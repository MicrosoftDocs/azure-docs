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
---

# 關於Language Understanding Intelligent Service (LUIS)

電腦能否理解人類所想是現今人機互動的一個關鍵性問題。Language Understanding Intelligent Service (LUIS)能幫助開發者建立一個能了解人類語言，並依照使用者的要求做出回應的智慧化應用。LUIS利用機器學習技術從自然語言中擷取出意圖，使得應用端不需要再做處理。任何的與使用者交談的客戶端應用服務，像是會話系統或是聊天機器人，能將使用者的輸入傳進LUIS，並得到經過自然語言處理的結果。

## 什麼是 LUIS app?

LUIS app是一個供使用者建立自訂語言模型的環境。LUIS app網路服務提供了HTTP endpoint，讓您的客戶端應用程式與LUIS溝通，以附加理解自然語言的能力。LUIS app可以從使用者的語句中抽取出符合客戶端應用程式邏輯的意圖以及關鍵字。您的客戶端應用便能依照LUIS所認定的使用者意圖來做出適當的回應。

![LUIS recognizes user intent](./media/luis-overview/luis-overview-process.png)

## 關鍵的概念

* **什麼是 utterance?** Utterance 是你的app需要去理解的使用者文字輸入。它可以是一個句子，像是「幫我訂一張去巴黎的機票」，或是句子的一部份，像是「訂機票」或是「飛往巴黎的航班」。Utterances 的組成結構未必良好，某種特定想法，可能有不同的表達方式。請參考[Add example utterances][add-example-utterances]以了解如何訓練LUIS app理解使用者的語句。
* **什麼是 intents?** Intents 像是一句話中的動詞，代表使用者想要執行的動作。它是一個被包含在使用者輸入語句的目的或是目標，像是訂機票、付帳或是尋找一篇新聞報導。你可以依照使用者使用你的應用程式時可能會採取的行為，來定義並命名一組intents。以一個旅遊app為例，設計者可能會定義一個名為「訂機票」的intent，以幫助LUIS從「幫我訂一張去巴黎的機票」這句話中汲取出意圖。
* **什麼是 entities?** 如果說intents是動詞，那entities便是名詞。Entity代表與使用者intent相關的物件類別實例。在「幫我訂一張去巴黎的機票」此句中，「巴黎」是屬於位置這個entity。藉由判斷出使用者語句中的enetities，LUIS能幫助你選擇特定的反饋，以滿足使用者的期待。請參考[Entities in LUIS](luis-concept-entity-types.md)以取得關於LUIS所提供的entities類別的詳細資訊。

## 籌畫你的LUIS app
在LUIS線上介面創建你的LUIS app前，你可以試著描述你的應用程式中的意圖以及對應關鍵字的大致輪廓來幫助你籌畫你的LUIS app。一般來說，你創建一個intent來觸發一個客戶端應用程式或聊天機器人的行為，並創建出一個entity來模擬執行該行為時所需的參數。舉例來說，「訂機票」這個intent可能會觸發用來呼叫訂機票這種外部服務的API，此服務需要像是目的地，日期，航空公司等entities。請參見[Plan your app](Plan-your-app.md)中如何選擇intents以及entities來對應應用程式中功能的範例與指引。 

## 建立及訓練LUIS app
在你決定好你的app所需要釐清的intents以及entities，你可以開始將它們加進你的LUIS app。參見[create a new LUIS app](LUIS-get-started-create-app.md)以了解如何快速建置一個LUIS app。<!-- that you can monitor using the [Dashboard](App-Dashboard.md)-->欲知更多設置你的LUIS app的步驟，請參見以下的文章：
1.	[Add intents](Add-intents.md)
2.  [Add utterances](Add-example-utterances.md)
3.	[Add entities](Add-entities.md)
4.  [Improve performance using features](Add-Features.md)
5.	[Train and test](Train-Test.md)
6.  [Use active learning](label-suggested-utterances.md)
7.	[Publish](PublishApp.md)

你也可以選擇觀看基本的影片教學 [video tutorial](https://www.youtube.com/watch?v=jWeLajon9M8&index=4&list=PLD7HFcN7LXRdHkFBFu4stPPeWJcQ0VFLx) 。

## 利用主動式學習來提高性能
一旦你部屬了你的應用服務且資訊開始流入系統，LUIS便會利用主動式學習來改良自己。在主動式學習的過程中，LUIS會識別出相對不確定的utterances並要求你依照intent跟entities標示它們。這個步驟有著相當大的優點。LUIS知道自己無法確定哪些語句的組成，然後像你尋求協助以最大化的提升系統表現。LUIS學得更快，你也只需要花費最少的時間與精力來訓練它。這便是最有效的主動式機器學習。參見[Label suggested utterances][label-suggested-utterances]，以得知如何藉由LUIS網頁介面來做到主動式學習。

## 以編程方式設置LUIS
LUIS提供一系列的程序化REST APIs，開發者可以藉由這些APIs來自動化建立應用服務的程序。這些API能幫助你編著、訓練、發行你的應用程式。

* [LUIS Programmatic API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f).

## 將LUIS與聊天機器人整合
藉由[Bot Framework](https://docs.microsoft.com/bot-framework/)，其提供了Node.js和.NET的Bot Builder SDK，可幫助你輕鬆的將LUIS與聊天機器人整合。你可以像下面的範例中，簡單地連結LUIS app。

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

Bot Builder SDK 提供了能自動處理從LUIS app所傳回的intents與entities的資料類別。欲知如何使用這些資料類別，請見以下的範例：

*	[LUIS demo bot (C#)](https://github.com/Microsoft/BotBuilder-Samples/tree/master/CSharp/intelligence-LUIS)
*	[LUIS demo bot (Node.js)](https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/intelligence-LUIS) 


## 將LUIS與Speech整合
你的LUIS 終端能與Microsoft Cognitive Service's speech recognition service無縫接軌。再Microsoft Cognitive Services Speech API的C# SDK中，你可以加入你的LUIS應用程式ID、訂閱金鑰，並將語音辨識結果回傳至LUIS。

請參見 [Microsoft Cognitive Services Speech API Overview](../Speech/Home.md).

<!-- Reference-style links -->
[add-example-utterances]: https://docs.microsoft.com/azure/cognitive-services/luis/add-example-utterances
[pre-built-entities]: https://docs.microsoft.com/azure/cognitive-services/luis/pre-builtentities
[label-suggested-utterances]: label-suggested-utterances.md

<!-- this link not working 5/8 -->
[cs-speech-service]: https://www.microsoft.com/cognitive-services/speech-api
