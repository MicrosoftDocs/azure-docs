---
title: Create your first Language Understanding Intelligent Services (LUIS) app in 10 minutes in Azure | Microsoft Docs 
description: Get started quickly by creating and managing a LUIS application on the Language Understanding Intelligent Services (LUIS) webpage. 
services: cognitive-services
author: DeniseMak
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 04/26/2017
ms.author: v-demak
translate.date: 10/25/2017
translator: Hsiang Wang
---

# 在 10 分鐘內創造您的第一個 LUIS APP

此 Quickstart 可以在短短的幾分鐘內幫助您創建您的第一個語言理解智能服務（LUIS）應用程序。完成後，您將有一個 LUIS 終端在雲端運行。

在範例中，您將創建一個旅遊應用程序，可幫助您預訂航班，並檢查目的地的天氣。"how-to" 是指這個應用程序，並建立在它上面。

## 在開始之前
為了使用 Microsoft Cognitive Service APIs，您需先在 Azure 儀表板創立一個 [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account).

如果您沒有 Azure 訂閱，註冊 [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## 製作一個新的 APP
您可以在 **My Apps** 頁面上創建和管理您的應用程序。您可以透過點擊 [LUIS web page](https://www.luis.ai) 頂端導航欄中的 **My Apps** 來進入此頁面。

1. 在 **My Apps** 頁面，點擊 **New App**.
2. 在對話框中，將您的應用程序命名為 "TravelAgent"。

    ![A new app form](./Images/NewApp-Form.JPG)
3. 選擇您應用程式的語言 (在 TravelAgent 中，我們選擇英文)，並點選 **Create**. 

    >[!注意]
    >語言一旦選定就無法更動. 

LUIS 創建了 TravelAgent 應用程序，並打開其主頁面，如下圖所示。使用左側面板中的導航鏈接移動您的應用頁面，以定義數據並處理您的 app。

![TravelAgent app created and Opened](./Images/AppCreated_Opened.JPG)

## 添加意圖 (intents)
您的第一個任務是添加意圖 (intents)。意圖 (intents) 是用戶的話語傳達的意圖或請求的動作。它們是您的應用程序的主要模塊。您現在需要定義應用程序所需要偵測到的意圖（例如，預訂航班）。單擊側面菜單中的 **Intents** 來進入 intents 頁面，通過單擊 **Add Intent** 按鈕來創建您的意圖 (intents)。

更詳細添加 intents 的教學，請閱讀 [Add intents](add-intents.md).

## 添加語句 (utterances)
現在您已經定義了意圖，您可以開始建立範例，以便讓機器學習模型學習到不同的模式（例如，"預訂6月8日起飛的西雅圖航班"）。選擇您剛剛添加的 intent 並將您的 utterances 保存在此 intent 內。

## 添加實體 (entities)
現在你有 intents，你可以繼續添加 entities。entities 描述與 intents 相關的信息，有時對於您的應用程序執行其任務至關重要。這個應用程序的一個例子是預訂航班的航空公司。在您的 TravelAgent 應用程序中添加一個名為 "Airline" 的 entities。

更多 entities 的詳細資訊，請詳閱 [Add entities](add-entities.md).

## 在語句 (utterances) 中標註實體 (entities)
接下來，您需要在例子中標註 entities 來訓練 LUIS 定義此 entities。請在您添加的話語中，特別標出 entities。

## 添加預建構實體 (prebuilt entities)
添加一個預先存在的實體可能會很有用，我們稱之為 *prebuilt* entities。這些類型的 entities 可以直接使用，不需要標註。轉到 **Entities** 頁面添加與您的應用程序相關的 prebuilt entities。 將 `ordinal` 和 `datetime` 這兩個 prebuilt entities 添加到您的應用程序。

## 訓練您的 APP
在左側面板中選擇 **Train & Test**，然後單擊 **Train Application** 並根據前面步驟中定義的 intents，utterances 和 entities 來訓練您的應用程序。

## 測試您的 app
您可以通過鍵入測試 utterance 並按 Enter 鍵來測試。結果顯示與每個 intent 相關的得分。檢查最高評分的 intent 是否符合每個測試 utterance 的 intent。

## 發布您的 app
從左側菜單中選擇 **Publish App**，然後單擊 **Publish**。


## 使用您的 app
從 **Publish App** 頁面複製端點URL，並將其黏貼到瀏覽器中。在URL結尾附加一個查詢，如"預訂波士頓航班"，並提交請求。包含結果的 JSON 應該顯示在瀏覽器中。

## 下一步

* 嘗試通過繼續添加和標註 utterances 來提高 app 的性能。
* 試著添加 [Features](Add-Features.md) 來豐富您的模型並增進您 LUIS 的表現。Features 幫助您的應用識別可互換的詞/短語，以及在您的領域中較常用的用語。
