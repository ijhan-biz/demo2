import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('..', import.meta.url);

test('홈 제목 바로 아래에 두 번째 데모 업데이트 배너를 표시합니다', async () => {
  const home = await readFile(new URL('src/pages/index.astro', root), 'utf8');

  assert.match(home, /<\/h1>\s*<section class="update-banner"/);
  assert.match(home, /DEMO2-UPDATE-02/);
  assert.match(home, /두 번째 데모 업데이트가 반영되었습니다/);
  assert.match(home, /이슈에서 시작한 변경을 PR과 코드 리뷰를 거쳐 배포했습니다\./);
  assert.doesNotMatch(home, /학습 페이지는 아직 없습니다/);
});

test('업데이트 배너에서 BASE_URL 기반 세션 요약 페이지로 이동합니다', async () => {
  const home = await readFile(new URL('src/pages/index.astro', root), 'utf8');

  assert.match(home, /href=\{`\$\{base\}lesson\/`\}[^>]*>세션 요약 보러 가기<\/a>/);
});
