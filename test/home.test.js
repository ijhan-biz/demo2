import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('..', import.meta.url);

test('홈에 새 히어로와 홈 전용 넓은 레이아웃을 표시합니다', async () => {
  const home = await readFile(new URL('src/pages/index.astro', root), 'utf8');
  const layout = await readFile(new URL('src/layouts/Layout.astro', root), 'utf8');

  assert.match(home, /<Layout title="demo2 실습 시작" home>/);
  assert.match(home, /<section class="hero" aria-labelledby="home-title">/);
  assert.match(home, /DEMO2-LIVE-03/);
  assert.match(home, /<h1 id="home-title">아이디어에서 배포까지, AI와 함께<\/h1>/);
  assert.doesNotMatch(home, /DEMO2-UPDATE-02|update-banner/);
  assert.match(layout, /home\?: boolean;/);
  assert.match(layout, /main\.home-layout\s*\{\s*max-width: 1200px;/);
});

test('히어로 버튼이 BASE_URL 기반 세션과 실습 페이지로 이동합니다', async () => {
  const home = await readFile(new URL('src/pages/index.astro', root), 'utf8');

  assert.match(home, /class="button button--primary" href=\{`\$\{base\}lesson\/`\}>세션 요약 보러 가기<\/a>/);
  assert.match(home, /class="button button--secondary" href=\{`\$\{base\}diy\/`\}>직접 실습하기<\/a>/);
});

test('여섯 단계의 개발 흐름을 순서 있는 목록으로 표시합니다', async () => {
  const home = await readFile(new URL('src/pages/index.astro', root), 'utf8');
  const labels = ['이슈 등록', 'Copilot 코드 작성', '코드 리뷰', '사람의 병합', 'Actions 검사·배포', '사이트 확인'];

  assert.match(home, /개발 흐름 안내 · 실시간 실행 상태가 아닙니다/);
  const flow = home.match(/<ol class="steps">([\s\S]*?)<\/ol>/);
  assert.ok(flow);
  assert.equal((flow[1].match(/class="step"/g) ?? []).length, 6);
  let previous = -1;
  for (const label of labels) {
    const current = flow[1].indexOf(label);
    assert.ok(current > previous, `${label} should follow the previous step`);
    previous = current;
  }
});

test('세 개의 바로가기와 FeedbackWidget을 유지합니다', async () => {
  const home = await readFile(new URL('src/pages/index.astro', root), 'utf8');

  assert.equal((home.match(/class="shortcut-card"/g) ?? []).length, 3);
  assert.match(home, /href=\{`\$\{base\}pipeline\/`\}>파이프라인으로 이동<\/a>/);
  assert.match(home, /href=\{`\$\{base\}secure-supply-chain\/`\}>공급망 보안으로 이동<\/a>/);
  assert.match(home, /href=\{`\$\{base\}diy\/`\}>실습 시작하기<\/a>/);
  assert.match(home, /<FeedbackWidget \/>/);
});
