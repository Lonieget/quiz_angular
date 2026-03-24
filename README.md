動態問卷系統 (Dynamic Questionnaire System)
這是一個基於 前後端分離 架構開發的全端應用程式。系統核心功能在於提供高度靈活的問卷管理方案，支援動態題目渲染、多條件搜尋以及權限控管功能。

核心功能
動態問卷渲染：前端根據後端回傳的 JSON 結構，自動生成對應的表單元件（單選、多選、文字輸入）。

問卷生命週期管理：支援問卷的發佈、關閉與自動過期機制。

進階搜尋與篩選：使用者可根據日期區間、關鍵字及問卷狀態進行多維度檢索。

後台管理系統：

RBAC 權限控管：區分管理員與一般使用者，確保數據安全。

統計分析：即時統計問卷填寫結果，並以視覺化方式呈現趨勢。

響應式設計：確保在不同裝置（桌面、平板、手機）上皆具備良好的操作體驗。

技術棧
前端 (Frontend)
Framework: Angular 17+

Styling: SCSS / Bootstrap 5

State Management: RxJS (Reactive Programming)

Tooling: Angular CLI, TypeScript

後端 (Backend)
Framework: Java Spring Boot 3.x

Database: MySQL / PostgreSQL

ORM: Spring Data JPA

Security: Spring Security (Role-based Access Control)

API Design: RESTful API / Swagger (OpenAPI 3.0)

系統架構簡介
本系統採用 Spec-driven Development (SDD) 的理念進行設計，確保前後端介面串接的精準度：

資料層：設計關聯式資料庫，處理問卷 (Quiz)、題目 (Question) 與作答紀錄 (Response) 之間的一對多與多對多關係。

邏輯層：由 Spring Boot 處理業務邏輯，包含問卷狀態自動更新排程。

表現層：Angular 元件化開發，透過 Service 層進行非同步 HTTP 通訊。

如何運行
前端環境
確保安裝 Node.js (v18+)

進入前端目錄： cd frontend-folder

安裝依賴： npm install

啟動服務： ng serve

瀏覽器開啟： http://localhost:4200

後端環境
確保安裝 JDK 17+ 與 Maven

配置 application.properties 中的資料庫連線資訊

執行專案： ./mvnw spring-boot:run

API 文件地址： http://localhost:8080/swagger-ui.html

未來展望
[ ] 支援將問卷結果導出為 Excel/CSV。

[ ] 整合更多樣化的圖表插件 (如 Chart.js)。

[ ] 加入使用者自訂問卷佈景主題功能。
