# 動態問卷系統 (Dynamic Questionnaire System)

這是一個基於 **前後端分離架構** 開發的全端 Web 應用程式。本系統旨在提供一個高度靈活的環境，讓管理員能動態建立、編輯與發佈問卷，並提供一般使用者流暢的填寫體驗。

## 核心功能 (Key Features)

* **動態表單渲染**：前端根據後端回傳的題目配置（單選、多選、文字、日期），動態生成對應的問卷表單。
* **問卷生命週期管理**：支援問卷的「草稿、發佈、過期、關閉」四種狀態切換。
* **多條件篩選與搜尋**：提供強大的搜尋功能，可根據問卷標題、起訖日期、狀態進行精準檢索。
* **後台管理系統**：
    * **RBAC 權限控管**：具備管理員 (Admin) 與使用者 (User) 權限區分，確保數據編輯的安全性。
    * **批次操作**：支援多筆問卷同時發佈或關閉。
* **統計分析介面**：即時統計問卷填寫數據，並以清晰的圖表或列表呈現結果。
* **響應式介面 (RWD)**：支援桌面、平板與手機端，提供跨裝置的優質體驗。

---

## 技術棧 (Tech Stack)

### 前端 (Frontend)
- **Framework**: Angular 17+
- **Styling**: SCSS / Bootstrap 5 / Angular Material (若有使用)
- **Data Flow**: RxJS (用於處理非同步資料與狀態管理)
- **HttpClient**: 與後端 RESTful API 進行通訊

### 後端 (Backend)
- **Framework**: Java Spring Boot 3.x
- **Database**: MySQL / PostgreSQL
- **Persistence Layer**: Spring Data JPA / MyBatis
- **Security**: Spring Security (Role-based Access Control)
- **Documentation**: Swagger (OpenAPI 3.0)

---

## 系統架構 (Architecture)

本專案遵循 **Spec-driven Development (SDD)** 理念開發：
1.  **資料結構設計**：設計關聯式資料庫，處理問卷 (Quiz)、題目 (Question) 與作答紀錄 (Response) 之間的一對多與多對多關係。
2.  **RESTful API 實作**：標準化 API 介面設計，確保前後端資料交換的高效與一致性。
3.  **元件化開發**：Angular 端採用模組化元件開發，提高程式碼的重用性與可維護性。

---

## 如何運行 (How to Run)

### 前端開發環境
1. 確保已安裝 Node.js (v18+) 及 Angular CLI。
2. 進入前端目錄：`cd frontend`
3. 安裝套件：`npm install`
4. 啟動開發伺服器：`ng serve`
5. 在瀏覽器打開：`http://localhost:4200`

### 後端開發環境
1. 確保已安裝 JDK 17+ 與 Maven。
2. 於 `src/main/resources/application.properties` 中配置您的資料庫連線資訊。
3. 執行 Spring Boot 應用：`./mvnw spring-boot:run`
4. API 文件地址：`http://localhost:8080/swagger-ui.html`

---

## 預計擴充功能
- [ ] 支援問卷結果匯出為 Excel / CSV。
- [ ] 加入視覺化數據分析圖表 (ECharts / Chart.js)。
- [ ] 增加題目圖片上傳功能。
