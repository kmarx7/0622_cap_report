# CaptureFlow AI

여러 캡처 이미지에서 텍스트와 시간 정보를 추출해 순서가 있는 Markdown 문서로 만드는 로컬 우선 MVP입니다.

## 실행

```bash
npm install
npm run dev
```

프로덕션 빌드 검증:

```bash
npm run build
npm run lint
```

Tesseract.js가 최초 OCR 실행 시 한국어와 영어 학습 데이터를 내려받습니다. 업로드한 이미지와 추출 결과는 서버에 저장하지 않습니다.

## 이후 확장 TODO

- 로그인, 프로젝트 저장, Supabase 연동
- Google Vision, Azure OCR, OpenAI Vision, Gemini Vision provider
- OpenAI, Claude, Gemini summarizer
- PDF, Notion, Google Docs export
- 결제, 사용량 제한, 개인정보 마스킹
- 카카오톡, 강의 노트, 법률 증거 정리 전용 모드
