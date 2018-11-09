---
title: Prebuilt entities - LUIS
titleSuffix: Azure Cognitive Services
description: This article contains lists of the prebuilt entities that are included in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/24/2018
ms.author: diberry
---

# Entities per culture

Language Understanding (LUIS) provides prebuilt entities. When a prebuilt entity is included in your application, LUIS includes the corresponding entity prediction in the endpoint response. All example utterances are also labeled with the entity. The behavior of prebuilt entities **can't** be modified. Unless otherwise noted, prebuilt entities are available in all LUIS application locales (cultures). The following table shows the prebuilt entities that are supported for each culture.

Prebuilt entity   |   English (United States)<br>```En-us```   |   French (France)<br>```fr-FR```   |   Italian (Italy)<br>```it-IT```   |   Spanish (Spain)<br>```es-ES```   |   Chinese<br>```zh-CN```   |   German<br>```de-DE```   |   Portuguese (Brazil)<br>```pt-BR```   |   Japanese (Japan)<br>```ja-JP```   |   Korean (Korea)<br>```ko-kr```   | French (Canada)<br>```fr-CA```   |   Spanish (Mexico)<br>```es-MX```   |   Dutch (Netherlands)<br>```nl-NL```   |
------|:------:|------|------|------|------|------|------|------|------|------|------|------|
[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |   -   |   -   |   -   |   ✔   |
[Currency](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |   -   |   -   |   -   |   ✔   |
[DatetimeV2](luis-reference-prebuilt-datetimev2.md):<br>date<br>daterange<br>time<br>timerange   |    ✔   |   ✔   |   -   |   ✔   |    ✔   |   -   |   ✔   |   -   |   -   |   -   |   -   |   -   |
[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |   -   |   -   |   -   |   ✔   |
[Email](luis-reference-prebuilt-email.md)   |    ✔   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |
[GeographyV2](luis-reference-prebuilt-geographyV2.md)   |    ✔   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |
[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    ✔   |   ✔   |   ✔   |   ✔   |   -   |   ✔   |   ✔   |   ✔   |   ✔   |   ✔   |   ✔   |   ✔   |
[Number](luis-reference-prebuilt-number.md)   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |   -   |   -   |   -   |   ✔   |
[Ordinal](luis-reference-prebuilt-ordinal.md)   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |   -   |   -   |   -   |   ✔   |
[Percentage](luis-reference-prebuilt-percentage.md)   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |   -   |   -   |   -   |   ✔   |
[PersonName](luis-reference-prebuilt-person.md)   |    ✔   |    -   |    -   |    -   |    ✔   |    -   |    -   |    -   |   -   |   -   |   -   |   -   |
[Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    ✔   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |
[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |    ✔   |   -   |   -   |   -   |   ✔   |
[URL](luis-reference-prebuilt-url.md)   |    ✔   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |   -   |

See notes on [Deprecated prebuilt entities](luis-reference-prebuilt-deprecated.md)

KeyPhrase is not available in all subcultures of Portuguese (Brazil) - ```pt-BR```.

## Contribute to prebuilt entity cultures
The prebuilt entities are developed in the Recognizers-Text open-source project. [Contribute](https://github.com/Microsoft/Recognizers-Text) to the project. This project includes examples of currency per culture. 

GeographyV2 and PersonName are not included in the Recognizers-Text project. For issues with these prebuilt entities, please open a [support request](../../azure-supportability/how-to-create-azure-support-request.md). 

## Next steps

Learn about the [number](luis-reference-prebuilt-number.md), [datetimeV2](luis-reference-prebuilt-datetimev2.md), and [currency](luis-reference-prebuilt-currency.md) entities. 
