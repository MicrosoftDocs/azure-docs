---
title: Learn about Language Understanding Intelligent Service (LUIS) in Azure | Microsoft Docs 
description: Learn how to use Language Understanding Intelligent Service (LUIS) to bring the power of machine learning to your applications.
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/01/2017
ms.author: cahann

translator: Wang Hsiang
translate.date: 09/30/2017
---

# 學習語意理解智能服務 (LUIS)

人機互動中有一個關鍵點是在於如何使電腦理解人類的需求。LUIS 讓開發者能設置出可以理解人類語言，並依據使用者的要求給予回應的應用程式。LUIS 藉由機器學習去解析所輸入的自然語言，如此一來您的應用程式便無需面對此難題。任何與使用者溝通的客戶端應用，像是對話系統或聊天機器人，都可以藉由將使用者的輸入傳到 LUIS，獲得語意理解後的結果。

## 什麼是 LUIS 應用?

LUIS 是一個開發者可以定義語意分析模型的服務。LUIS 是一個網頁服務，具有一個您可以自己加入自然語言的 HTTP 端點。LUIS 會依照客戶的邏輯，分析並提取語句 (utterance) 中的意圖 (intents) 及實體 (entities)。您的應用程式便可以依據 LUIS 所辨識出的意圖 (intents) 採取適當的行動。

![LUIS 辨識使用者意圖 (intents)](./media/luis-overview/luis-overview-process.png)

## 關鍵概念

* **什麼是語句 (utterance)?** 語句 (utterance) 是您的應用程式所需理解的使用者文字檔輸入。它可能是一個句子，例如"幫我訂一張去巴黎的票"，也可以是句子的片段，像是"訂"或"往巴黎的航班"。語句 (utterances) 不一定都非常符合文法規則，特定的意圖 (intents) 也可能用不同的語句 (utterances) 來表達。閱讀[增加範例語句 (utterances)][add-example-utterances] 以了解如何訓練 LUIS 理解使用著的語句 (utterances)。
* **什麼是意圖 (intents)?** 意圖 (intents) 就像是句子中的動詞意圖 (intents) 代表使用者想要展現的行為。使用者的輸入會傳達一個目標或目的，例如訂機票、付帳單、找一篇新文章。根據使用者在您的應用程式可能會有的行為，您可以定義一套自命名的意圖 (intents)。例如一個旅行應用程式可能會定義一個名為"訂機票"的意圖 (intents)，LUIS 會從語句 (utterances) "幫我訂一張去巴黎的票"中提取出此意圖 (intents)。
* **什麼是實體 (entities)?** 如果意圖 (intents) 是動詞，那麼實體 (entities) 就是名詞。實體 (entity) 代表一個跟使用者意圖 (intents) 相關的物體。在語句 (utterances) "幫我訂一張去巴黎的票"中，"巴黎"就是代表地點的實體 (entity)。藉著辨識使用者輸入中的實體 (entities)，LUIS 會選擇要實現意圖 (intents) 的具體行動閱讀 [LUIS 中的實體 (entities)] (luis-concept-entity-types.md)以了解更多關於 LUIS 所提供的實體 (entities) 型別的細節。

## 計畫您的 LUIS 應用
在您打開 LUIS 使用介面之前，請先架構您應用程式所需意圖 (intents) 及實體 (entities) 大綱。一般來說，您會創造一個意圖 (intents) 來觸發您應用程式的動作，並創造一個實體 (entities) 來建構此動作所需要的參數。舉例來說，一個"訂機票"的意圖 (intents) 可能會觸發一個外部訂機票服務的API。閱讀[計畫您的應用程式](Plan-your-app.md)以獲得更多關於如何選擇意圖 (intents) 及實體 (entities)的例子及指引，以更好地反應出您應用程式中功能及關係。 

## 建造並訓練 LUIS 應用
一旦您決定了那些意圖 (intents) 及實體 (entities) 是您的 LUIS 應用所需要辨識的。閱讀[建造一個新的 LUIS 應用](LUIS-get-started-create-app.md)來快速演練如何建造一個 LUIS 應用。<!-- that you can monitor using the [Dashboard](App-Dashboard.md)-->
閱讀下列文章，以了解更多關於配置您 LUIS 應用的詳細步驟:
1.	[加入意圖 (intents)](Add-intents.md)
2.  [加入語句 (utterances)](Add-example-utterances.md)
3.	[加入實體 (entities)](Add-entities.md)
4.  [藉由特徵優化](Add-Features.md)
5.	[訓練及測試](Train-Test.md)
6.  [使用主動學習](label-suggested-utterances.md)
7.	[發佈](PublishApp.md)

您可以觀看一個關於這些步驟的基礎[影片教學](https://www.youtube.com/watch?v=jWeLajon9M8&index=4&list=PLD7HFcN7LXRdHkFBFu4stPPeWJcQ0VFLx)

## 使用主動學習優化
一旦您的應用程式部屬完成並且系統開始有了流量，LUIS 使用主動學習來優化自己。在主動學習的過程中，LUIS 辨識那些相對而言不確定的語句 (utterances)，並要求您標註出意圖 (intents) 及實體 (entities)。LUIS 知道哪些是不確定的，並會在那些能大幅優化系統的案例中請求您的協助。LUIS 學得越來越快，您也只需提供最少的時間及努力。這是最有效的主動機器學習。閱讀[標註建議的語句 (utterances)][label-suggested-utterances] 以了解如何使用 LUIS 網頁介面實行主動學習。

## 由寫程式的方式配置 LUIS
LUIS 提供一套可編成化的 REST APIs 讓研發人員能自動化應用程式的創建過程。這些 APIs 讓您能編輯、訓練、並發佈您的應用。

* [LUIS 可編程化 API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f).

## 整合 LUIS 與機器人
以 [Bot Framework](https://docs.microsoft.com/bot-framework/) 建構的機器人使用 LUIS 應用非常簡單，它提供了 Node.js 及 .NET 版本的 Bot Builder SDK。您可以參考下列的 LUIS 應用範例:

#### Node.js 
```javascript
// Add a global LUIS recognizer to your bot using the endpoint URL of your LUIS app
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/2c2afc3e-5f39-4b6f-b8ad-c47ce1b98d8a?subscription-key=9823b65a8c9045f8bce7fee87a5e1fbc';
bot.recognizer(new builder.LuisRecognizer(model));
```

#### C#
```cs
    // The LuisModel attribute specifies your LUIS app ID and your LUIS subscription key
    [LuisModel("2c2afc3e-5f39-4b6f-b8ad-c47ce1b98d8a", "9823b65a8c9045f8bce7fee87a5e1fbc")]
    [Serializable]
    public class TravelGuidDialog : LuisDialog<object>
    {
      // ...
```

Bot Builder SDK 提供能自動化掌握 LUIS 所輸出的意圖及實體的 classes。如何使用這些 classes 的程式碼，請看下列範例:

*	[LUIS 展示機器人 (C#)](https://github.com/Microsoft/BotBuilder-Samples/tree/master/CSharp/intelligence-LUIS)
*	[LUIS 展示機器人 (Node.js)](https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/intelligence-LUIS) 


## 整合 LUIS 與語音
您的 LUIS 端點與微軟認知服務中的語音識別服務 ( Microsoft Cognitive Service's speech recognition service) 無縫地執行著。在 C# SDK 版本的微軟語音認知服務 API (Microsoft Cognitive Services Speech API)，您可以增加 LUIS 應用 ID ( LUIS application ID) 及 LUIS 訂閱金鑰 (LUIS subscription key)，便能獲得理解後的語音辨識。

閱讀 [Microsoft Cognitive Services Speech API Overview](../Speech/Home.md).

<!-- Reference-style links -->
[add-example-utterances]: https://docs.microsoft.com/azure/cognitive-services/luis/add-example-utterances
[pre-built-entities]: https://docs.microsoft.com/azure/cognitive-services/luis/pre-builtentities
[label-suggested-utterances]: label-suggested-utterances.md

<!-- this link not working 5/8 -->
[cs-speech-service]: https://www.microsoft.com/cognitive-services/speech-api
