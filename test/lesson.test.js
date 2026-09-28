import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('..', import.meta.url);

test('세션 요약 페이지는 공유 레이아웃과 세 가지 핵심 단계를 표시합니다', async () => {
  const lesson = await readFile(new URL('src/pages/lesson.astro', root), 'utf8');

  assert.match(lesson, /import Layout from '\.\.\/layouts\/Layout\.astro';/);
  assert.match(lesson, /코드 리뷰/);
  assert.match(lesson, /보안 게이트/);
  assert.match(lesson, /승인 후 배포/);
  assert.match(lesson, /이슈에서 배포까지 연결했습니다\./);
});

test('공유 탐색 메뉴에서 세션 요약 페이지로 이동합니다', async () => {
  const layout = await readFile(new URL('src/layouts/Layout.astro', root), 'utf8');

  assert.match(layout, /href=\{`\$\{base\}lesson\/`\}>세션 요약<\/a>/);
});
