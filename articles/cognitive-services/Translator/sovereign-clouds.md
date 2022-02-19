---
title: Using Translator in sovereign clouds
titleSuffix: Azure Cognitive Services
description: Overview of using Translator in sovereign clouds.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 02/15/2022
ms.author: lajanuar
---

# Use Translator in sovereign (national) clouds

 Azure sovereign clouds are isolated in-country platforms with independent authentication, storage, and compliance requirements. Sovereign clouds are often used within geographical boundaries where there's a strict data residency requirement. Azure Active Directory (Azure AD) is currently deployed in the following sovereign clouds:

|Cloud | Region identifier |
|---|--|
| [Azure US Government](../../azure-government/documentation-government-welcome.md)|<ul><li>`usgovarizona` (US Gov Arizona)</li><li>`usgovvirginia` (US Gov Virginia)</li></ul>|
| [Azure China 21 Vianet](/azure/china/overview-operations) |<ul><li>`chinaeast2` (East China 2)</li><li>`chinanorth` (China North)</li></ul>|

>[!NOTE]
> Azure Germany [closed on October 29, 2021](https://www.microsoft.com/cloud-platform/germany-cloud-regions). Learn more about [Azure Germany migration](/azure/active-directory/develop/authentication-sovereign-cloud#azure-germany-microsoft-cloud-deutschland).

## Sovereign cloud instances

Individual sovereign clouds are cloud instances. Each cloud instance is separate from the others and has its own environment and endpoints. Cloud-specific endpoints include OAuth 2.0 access token and OpenID Connect ID token request endpoints, and URLs for app management and deployment. Use the endpoints for the cloud instance where you'll deploy your application.

## Sovereign cloud endpoints

The following table lists the base URLs for the Azure AD endpoints used to register an application for each sovereign cloud.

| Sovereign cloud                          | Azure portal endpoint      |
| --------------------------------------- | -------------------------- |
| Azure portal for US Government          | `https://portal.azure.us`  |
| Azure portal China operated by 21 Vianet | `https://portal.azure.cn`  |

## Translator service in sovereign clouds

### [Azure US Government](#tab/us)

 The Azure Government cloud is available to US government customers and their partners. US federal, state, local, tribal governments and their partners have access to the Azure Government cloud dedicated instance. Cloud operations are controlled by screened US citizens.

| Azure US Government | Availability |
|--|--|
|Azure portal | <ul><li>[Azure Government Portal](https://portal.azure.us/)</li></ul>|
| Available regions</br></br>The region-identifier is a required header when using Translator for the government cloud. | <ul><li>`usgovarizona` </li><li> `usgovvirginia`</li></ul>|
|Available pricing tiers|<ul><li>Free (F0) and Standard (S0). See [Translator pricing](https://azure.microsoft.com/pricing/details/cognitive-services/translator/)</li></ul>|
|Supported Features | <ul><li>Text Translation</li><li>Document Translation</li><li>Custom Translation</li></ul>|
|Supported Languages| _See_ [Translator language support](language-support.md).|

<!-- markdownlint-disable MD036 -->

### Endpoints

**Azure portal**

```http
https://portal.azure.us
```

**Authorization token**

```http
https://<region-identifier>.api.cognitive.microsoft.us/sts/v1.0/issueToken
```

**Text translation**

```http
https://api.cognitive.microsofttranslator.us/
```

**Document Translation custom endpoint**

```http
https://<your-custom-domain>.cognitiveservices.azure.us/
```

**Custom Translator portal**

```http
https://portal.customtranslator.azure.us/
```

### Example API translation request

This example shows how to translate a single sentence from English to Simplified Chinese.

**Request**

```curl
curl -X POST "https://api.cognitive.microsofttranslator.us/translate?api-version=3.0?&from=en&to=zh-Hans" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Ocp-Apim-Subscription-Region: <region-identifier>" -H "Content-Type: application/json; charset=UTF-8" -d "[{'Text':'你好, 你叫什么名字？'}]"
```

**Response body**

```JSON
[
    {
        "translations":[
            {"text": "Hello, what is your name?", "to": "en"}
        ]
    }
]
```

> [!div class="nextstepaction"]
> [Azure Government: Translator text reference](translator-overview.md#translator-features-and-development-options)

### [Azure China 21 Vianet](#tab/china)

The Azure China cloud is a physical and logical network-isolated instance of cloud services located in China. In order to apply for an Azure China account, you need a Chinese legal entity, Internet Content provider (ICP) license, and a physical presence within China.

|Azure China 21 Vianet | Availability
|---|---|
|Azure portal |<ul><li>[Azure China 21 Vianet Portal](https://portal.azure.us/)</li></ul>|
|Regions <br></br>The region-identifier is a required header when using a multi-service resource. | <ul><li>`chinanorth` </li><li> `chinaeast2`</li></ul>|
|Supported Feature|[Text Translation](https://docs.azure.cn/cognitive-services/translator/reference/v3-0-reference)|
|Supported Languages| _See_ [Translator language support.](https://docs.azure.cn/cognitive-services/translator/language-support)|

<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD024 -->

### Endpoints

**Azure portal**

```http
https://portal.azure.cn
```

**Authorization token**

```http
https://<region-identifier>.api.cognitive.azure.cn/sts/v1.0/issueToken
```

**Text translation**

```http
https://api.translator.azure.cn/translate
```

### Example API translation request

This example shows how to translate a single sentence from English to Simplified Chinese.

**Request**

```curl
curl -X POST "https://api.translator.azure.cn/translate?api-version=3.0&from=en&to=zh-Hans" -H "Ocp-Apim-Subscription-Key: <client-secret>" -H "Content-Type: application/json; charset=UTF-8" -d "[{'Text': 'Hello, what is your name?'}]"
```

**Response body**

```JSON
[
    {
        "translations":[
            {"text": "你好, 你叫什么名字？", "to": "zh-Hans"}
        ]
    }
]
```

> [!div class="nextstepaction"]
> [Azure China: Translator Text reference](https://docs.azure.cn/cognitive-services/translator/reference/v3-0-reference)

---

## Next step

> [!div class="nextstepaction"]
> [Learn more about Translator](index.yml)
