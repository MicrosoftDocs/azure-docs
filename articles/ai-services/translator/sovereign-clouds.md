---
title: "Translator: sovereign clouds"
titleSuffix: Azure AI services
description: Using Translator in sovereign clouds
services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: reference
ms.date: 07/18/2023
ms.author: lajanuar
---

# Translator in sovereign (national) clouds

 Azure sovereign clouds are isolated in-country/region platforms with independent authentication, storage, and compliance requirements. Sovereign clouds are often used within geographical boundaries where there's a strict data residency requirement. Translator is currently deployed in the following sovereign clouds:

|Cloud | Region identifier |
|---|--|
| [Azure US Government](../../azure-government/documentation-government-welcome.md)|<ul><li>`usgovarizona` (US Gov Arizona)</li><li>`usgovvirginia` (US Gov Virginia)</li></ul>|
| [Microsoft Azure operated by 21Vianet](/azure/china/overview-operations) |<ul><li>`chinaeast2` (East China 2)</li><li>`chinanorth` (China North)</li></ul>|

## Azure portal endpoints

The following table lists the base URLs for Azure sovereign cloud endpoints:

| Sovereign cloud                          | Azure portal endpoint      |
| --------------------------------------- | -------------------------- |
| Azure portal for US Government          | `https://portal.azure.us`  |
| Azure portal China operated by 21 Vianet | `https://portal.azure.cn`  |

<!-- markdownlint-disable MD033 -->

## Translator: sovereign clouds

### [Azure US Government](#tab/us)

 The Azure Government cloud is available to US government customers and their partners. US federal, state, local, tribal governments and their partners have access to the Azure Government cloud dedicated instance. Cloud operations are controlled by screened US citizens.

| Azure US Government | Availability and support |
|--|--|
|Azure portal | <ul><li>[Azure Government Portal](https://portal.azure.us/)</li></ul>|
| Available regions</br></br>The region-identifier is a required header when using Translator for the government cloud. | <ul><li>`usgovarizona` </li><li> `usgovvirginia`</li></ul>|
|Available pricing tiers|<ul><li>Free (F0) and Standard (S1). See [Translator pricing](https://azure.microsoft.com/pricing/details/cognitive-services/translator/)</li></ul>|
|Supported Features | <ul><li>[Text Translation](reference/v3-0-reference.md)</li><li>[Document Translation](document-translation/overview.md)</li><li>[Custom Translator](custom-translator/overview.md)</li></ul>|
|Supported Languages| <ul><li>[Translator language support](language-support.md)</li></ul>|

<!-- markdownlint-disable MD036 -->

### Endpoint

#### Azure portal

Base URL:

```http
https://portal.azure.us
```

#### Authorization token

Replace the `<region-identifier>` parameter with the sovereign cloud identifier:

|Cloud | Region identifier |
|---|--|
| Azure US Government|<ul><li>`usgovarizona` (US Gov Arizona)</li><li>`usgovvirginia` (US Gov Virginia)</li></ul>|
| Azure operated by 21Vianet|<ul><li>`chinaeast2` (East China 2)</li><li>`chinanorth` (China North)</li></ul>|

```http
https://<region-identifier>.api.cognitive.microsoft.us/sts/v1.0/issueToken
```

#### Text translation

```http
https://api.cognitive.microsofttranslator.us/
```

#### Document Translation custom endpoint

```http
https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.us/translator/text/batch/v1.0
```

#### Custom Translator portal

```http
https://portal.customtranslator.azure.us/
```

### Example API translation request

Translate a single sentence from English to Simplified Chinese.

**Request**

```curl
curl -X POST "https://api.cognitive.microsofttranslator.us/translate?api-version=3.0?&from=en&to=zh-Hans" -H "Ocp-Apim-Subscription-Key: <key>" -H "Ocp-Apim-Subscription-Region: chinanorth" -H "Content-Type: application/json; charset=UTF-8" -d "[{'Text':'你好, 你叫什么名字？'}]"
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
> [Azure Government: Translator text reference](../../azure-government/documentation-government-cognitiveservices.md#translator)

### [Azure operated by 21Vianet](#tab/china)

The Azure operated by 21Vianet cloud is a physical and logical network-isolated instance of cloud services located in China. In order to apply for an Azure operated by 21Vianet account, you need a Chinese legal entity, Internet Content provider (ICP) license, and physical presence within China.

|Azure operated by 21Vianet | Availability and support |
|---|---|
|Azure portal |<ul><li>[Azure operated by 21Vianet Portal](https://portal.azure.cn/)</li></ul>|
|Regions <br></br>The region-identifier is a required header when using a multi-service resource. | <ul><li>`chinanorth` </li><li> `chinaeast2`</li></ul>|
|Supported Feature|<ul><li>[Text Translation](https://docs.azure.cn/cognitive-services/translator/reference/v3-0-reference)</li><li>[Document Translation](document-translation/overview.md)</li></ul>|
|Supported Languages|<ul><li>[Translator language support.](https://docs.azure.cn/cognitive-services/translator/language-support)</li></ul>|

<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD024 -->

### Endpoint

Base URL

#### Azure portal

```http
https://portal.azure.cn
```

#### Authorization token

Replace the `<region-identifier>` parameter with the sovereign cloud identifier:

```http
https://<region-identifier>.api.cognitive.azure.cn/sts/v1.0/issueToken
```

#### Text translation

```http
https://api.translator.azure.cn/translate
```

### Example text translation request

Translate a single sentence from English to Simplified Chinese.

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

#### Document Translation custom endpoint

```http
https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.cn/translator/text/batch/v1.0
```

### Example batch translation request

```json
{
    "inputs": [
        {
            "source": {
                "sourceUrl": "https://<storage_acount>.blob.core.chinacloudapi.cn/source-en?sv=2019-12-12&st=2021-03-05T17%3A45%3A25Z&se=2021-03-13T17%3A45%3A00Z&sr=c&sp=rl&sig=SDRPMjE4nfrH3csmKLILkT%2Fv3e0Q6SWpssuuQl1NmfM%3D"
            },
            "targets": [
                {
                    "targetUrl": "https://<storage_acount>.blob.core.chinacloudapi.cn/target-zh-Hans?sv=2019-12-12&st=2021-03-05T17%3A49%3A02Z&se=2021-03-13T17%3A49%3A00Z&sr=c&sp=wdl&sig=Sq%2BYdNbhgbq4hLT0o1UUOsTnQJFU590sWYo4BOhhQhs%3D",
                    "language": "zh-Hans"
                }
            ]
        }
    ]
}
```

---

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Translator](index.yml)
