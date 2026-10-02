import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // NEIS API Backend Proxy Endpoint (Bypasses browser CORS & Ad-blocker restrictions)
  app.get('/api/neis/meal', async (req, res) => {
    try {
      let { ATPT_OFCDC_SC_CODE, SD_SCHUL_CODE, MLSV_YMD, MLSV_FROM_YMD, MLSV_TO_YMD, pIndex, pSize } = req.query;

      // Force C10 for 대진전자통신고등학교 (7150597)
      if (SD_SCHUL_CODE === '7150597') {
        ATPT_OFCDC_SC_CODE = 'C10';
      }

      const params = new URLSearchParams({
        Type: 'json',
        pIndex: (pIndex as string) || '1',
        pSize: (pSize as string) || '100',
        ATPT_OFCDC_SC_CODE: (ATPT_OFCDC_SC_CODE as string) || 'C10',
        SD_SCHUL_CODE: (SD_SCHUL_CODE as string) || '7150597',
      });

      if (MLSV_YMD) params.append('MLSV_YMD', MLSV_YMD as string);
      if (MLSV_FROM_YMD) params.append('MLSV_FROM_YMD', MLSV_FROM_YMD as string);
      if (MLSV_TO_YMD) params.append('MLSV_TO_YMD', MLSV_TO_YMD as string);

      const targetUrl = `https://open.neis.go.kr/hub/mealServiceDietInfo?${params.toString()}`;
      const response = await fetch(targetUrl);
      const data = await response.json();

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(data);
    } catch (error) {
      console.error('Proxy meal error:', error);
      res.status(500).json({ error: 'Failed to fetch meal from NEIS API' });
    }
  });

  app.get('/api/neis/school', async (req, res) => {
    try {
      const { SCHUL_NM } = req.query;
      if (!SCHUL_NM) {
        return res.status(400).json({ error: 'SCHUL_NM is required' });
      }

      const url = `https://open.neis.go.kr/hub/schoolInfo?Type=json&pIndex=1&pSize=20&SCHUL_NM=${encodeURIComponent(
        SCHUL_NM as string
      )}`;
      const response = await fetch(url);
      const data = await response.json();

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(data);
    } catch (error) {
      console.error('Proxy school error:', error);
      res.status(500).json({ error: 'Failed to fetch school info from NEIS API' });
    }
  });

  // Vite development server middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(url, `
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>대진전자통신고 급식 알리미</title>
    <meta name="description" content="대진전자통신고등학교 실시간 급식 정보, 주간/월간 식단표, 영양 성분 및 알레르기 안내" />
    <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  </head>
  <body class="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen font-sans antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
        `);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production static serving
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
