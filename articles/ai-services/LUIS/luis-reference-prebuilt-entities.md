---
title: All Prebuilt entities - LUIS
titleSuffix: Azure AI services
description: This article contains lists of the prebuilt entities that are included in Language Understanding (LUIS).
services: cognitive-services
ms.author: aahi
author: aahill
manager: nitinme
ms.custom: seodec18
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: reference
ms.date: 05/05/2021
---

# Entities per culture in your LUIS model

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


Language Understanding (LUIS) provides prebuilt entities.

## Entity resolution
When a prebuilt entity is included in your application, LUIS includes the corresponding entity resolution in the endpoint response. All example utterances are also labeled with the entity.

The behavior of prebuilt entities can't be modified but you can improve resolution by [adding the prebuilt entity as a feature to a machine-learning entity or sub-entity](concepts/entities.md#prebuilt-entities).

## Availability
Unless otherwise noted, prebuilt entities are available in all LUIS application locales (cultures). The following table shows the prebuilt entities that are supported for each culture.

|Culture|Subcultures|Notes|
|--|--|--|
|Chinese|[zh-CN](#chinese-entity-support)||
|Dutch|[nl-NL](#dutch-entity-support)||
|English|[en-US (American)](#english-american-entity-support)||
|English|[en-GB (British)](#english-british-entity-support)||
|French|[fr-CA (Canada)](#french-canadian-entity-support), [fr-FR (France)](#french-france-entity-support), ||
|German|[de-DE](#german-entity-support)||
|Italian|[it-IT](#italian-entity-support)||
|Japanese|[ja-JP](#japanese-entity-support)||
|Korean|[ko-KR](#korean-entity-support)||
|Portuguese|[pt-BR (Brazil)](#portuguese-brazil-entity-support)||
|Spanish|[es-ES (Spain)](#spanish-spain-entity-support), [es-MX (Mexico)](#spanish-mexico-entity-support)||
|Turkish|[turkish](#turkish-entity-support)||

## Prediction endpoint runtime

The availability of a prebuilt entity in a specific language is determined by the prediction endpoint runtime version.

## Chinese entity support

The following entities are supported:

| Prebuilt entity | zh-CN |
| --------------- | :---: |
[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    V2, V3   |
[Currency (money)](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    V2, V3   |
[DatetimeV2](luis-reference-prebuilt-datetimev2.md):<br>date<br>daterange<br>time<br>timerange   |    V2, V3   |
[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    V2, V3   |
[Email](luis-reference-prebuilt-email.md)   |    V2, V3   |
[Number](luis-reference-prebuilt-number.md)   |    V2, V3   |
[Ordinal](luis-reference-prebuilt-ordinal.md)   |    V2, V3   |
[Percentage](luis-reference-prebuilt-percentage.md)   |    V2, V3   |
[PersonName](luis-reference-prebuilt-person.md)   |    V2, V3   |
[Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    V2, V3   |
[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    V2, V3   |
[URL](luis-reference-prebuilt-url.md)   |    V2, V3   |
<!---[GeographyV2](luis-reference-prebuilt-geographyV2.md)   |    -   |-->
<!---[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    -   |-->
<!---[OrdinalV2](luis-reference-prebuilt-ordinal-v2.md)   |    -   |-->

## Dutch entity support

The following entities are supported:

| Prebuilt entity | nl-NL |
| --------------- | :---: |
[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    V2, V3   |
[Currency (money)](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    V2, V3   |
[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    V2, V3   |
[Email](luis-reference-prebuilt-email.md)   |    V2, V3   |
[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    V2, V3   |
[Number](luis-reference-prebuilt-number.md)   |    V2, V3   |
[Ordinal](luis-reference-prebuilt-ordinal.md)   |    V2, V3   |
[Percentage](luis-reference-prebuilt-percentage.md)   |    V2, V3   |
[Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    V2, V3   |
[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    V2, V3   |
[URL](luis-reference-prebuilt-url.md)   |    V2, V3   |
<!---[Datetime](luis-reference-prebuilt-deprecated.md)   |    -   |-->
<!---[GeographyV2](luis-reference-prebuilt-geographyV2.md)   |    -   |-->
<!---[OrdinalV2](luis-reference-prebuilt-ordinal-v2.md)   |    -   |-->
<!---[PersonName](luis-reference-prebuilt-person.md)   |    -   |-->

## English (American) entity support

The following entities are supported:

| Prebuilt entity | en-US |
| --------------- | :---: |
[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    V2, V3   |
[Currency (money)](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    V2, V3   |
[DatetimeV2](luis-reference-prebuilt-datetimev2.md):<br>date<br>daterange<br>time<br>timerange   |    V2, V3   |
[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    V2, V3   |
[Email](luis-reference-prebuilt-email.md)   |    V2, V3   |
[GeographyV2](luis-reference-prebuilt-geographyV2.md)   |    V2, V3   |
[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    V2, V3   |
[Number](luis-reference-prebuilt-number.md)   |    V2, V3   |
[Ordinal](luis-reference-prebuilt-ordinal.md)   |    V2, V3   |
[OrdinalV2](luis-reference-prebuilt-ordinal-v2.md)   |    V2, V3   |
[Percentage](luis-reference-prebuilt-percentage.md)   |    V2, V3   |
[PersonName](luis-reference-prebuilt-person.md)   |    V2, V3   |
[Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    V2, V3   |
[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    V2, V3   |
[URL](luis-reference-prebuilt-url.md)   |    V2, V3   |

## English (British) entity support

The following entities are supported:

| Prebuilt entity | en-GB |
| --------------- | :---: |
[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    V2, V3   |
[Currency (money)](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    V2, V3   |
[DatetimeV2](luis-reference-prebuilt-datetimev2.md):<br>date<br>daterange<br>time<br>timerange   |    V2, V3   |
[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    V2, V3   |
[Email](luis-reference-prebuilt-email.md)   |    V2, V3   |
[GeographyV2](luis-reference-prebuilt-geographyV2.md)   |    V2, V3   |
[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    V2, V3   |
[Number](luis-reference-prebuilt-number.md)   |    V2, V3   |
[Ordinal](luis-reference-prebuilt-ordinal.md)   |    V2, V3   |
[OrdinalV2](luis-reference-prebuilt-ordinal-v2.md)   |    V2, V3   |
[Percentage](luis-reference-prebuilt-percentage.md)   |    V2, V3   |
[PersonName](luis-reference-prebuilt-person.md)   |    V2, V3   |
[Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    V2, V3   |
[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    V2, V3   |
[URL](luis-reference-prebuilt-url.md)   |    V2, V3   |

## French (France) entity support

The following entities are supported:

| Prebuilt entity | fr-FR |
| --------------- | :---: |
[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    V2, V3   |
[Currency (money)](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    V2, V3   |
[DatetimeV2](luis-reference-prebuilt-datetimev2.md):<br>date<br>daterange<br>time<br>timerange   |    V2, V3   |
[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    V2, V3   |
[Email](luis-reference-prebuilt-email.md)   |    V2, V3   |
[GeographyV2](luis-reference-prebuilt-geographyV2.md)   |    -   |
[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    V2, V3   |
[Number](luis-reference-prebuilt-number.md)   |    V2, V3   |
[Ordinal](luis-reference-prebuilt-ordinal.md)   |    V2, V3   |
[Percentage](luis-reference-prebuilt-percentage.md)   |    V2, V3   |
[Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    V2, V3   |
[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    V2, V3   |
[URL](luis-reference-prebuilt-url.md)   |    V2, V3   |
<!---[OrdinalV2](luis-reference-prebuilt-ordinal-v2.md)   |    -   |-->
<!---[PersonName](luis-reference-prebuilt-person.md)   |   -   |-->

## French (Canadian) entity support

The following entities are supported:

| Prebuilt entity | fr-CA |
| --------------- | :---: |
[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    V2, V3   |
[Currency (money)](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    V2, V3   |
[DatetimeV2](luis-reference-prebuilt-datetimev2.md):<br>date<br>daterange<br>time<br>timerange   |    V2, V3   |
[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    V2, V3   |
[Email](luis-reference-prebuilt-email.md)   |    V2, V3   |
[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    V2, V3   |
[Number](luis-reference-prebuilt-number.md)   |    V2, V3   |
[Ordinal](luis-reference-prebuilt-ordinal.md)   |    V2, V3   |
[Percentage](luis-reference-prebuilt-percentage.md)   |    V2, V3   |
[Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    V2, V3   |
[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    V2, V3   |
[URL](luis-reference-prebuilt-url.md)   |    V2, V3   |
<!---[GeographyV2](luis-reference-prebuilt-geographyV2.md)   |    -   |-->
<!---[OrdinalV2](luis-reference-prebuilt-ordinal-v2.md)   |    -   |-->
<!---[PersonName](luis-reference-prebuilt-person.md)   |    -   |-->

## German entity support

The following entities are supported:

|Prebuilt entity | de-DE |
| -------------- | :---: |
[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    V2, V3   |
[Currency (money)](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    V2, V3   |
[DatetimeV2](luis-reference-prebuilt-datetimev2.md):<br>date<br>daterange<br>time<br>timerange   |    V2, V3   |
[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    V2, V3   |
[Email](luis-reference-prebuilt-email.md)   |    V2, V3   |
[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    V2, V3   |
[Number](luis-reference-prebuilt-number.md)   |    V2, V3   |
[Ordinal](luis-reference-prebuilt-ordinal.md)   |    V2, V3   |
[Percentage](luis-reference-prebuilt-percentage.md)   |    V2, V3   |
[Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    V2, V3   |
[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    V2, V3   |
[URL](luis-reference-prebuilt-url.md)   |    V2, V3   |
<!---[GeographyV2](luis-reference-prebuilt-geographyV2.md)   |    -   |-->
<!---[OrdinalV2](luis-reference-prebuilt-ordinal-v2.md)   |    -   |-->
<!---[PersonName](luis-reference-prebuilt-person.md)   |    -   |-->

## Italian entity support

Italian prebuilt age, currency, dimension, number, percentage _resolution_ changed from V2 and V3 preview.

The following entities are supported:

| Prebuilt entity | it-IT |
| --------------- | :---: |
[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    V2, V3   |
[Currency (money)](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    V2, V3   |
[DatetimeV2](luis-reference-prebuilt-datetimev2.md):<br>date<br>daterange<br>time<br>timerange   |    V2, V3   |
[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    V2, V3   |
[Email](luis-reference-prebuilt-email.md)   |    V2, V3   |
[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    V2, V3   |
[Number](luis-reference-prebuilt-number.md)   |    V2, V3   |
[Ordinal](luis-reference-prebuilt-ordinal.md)   |    V2, V3   |
[Percentage](luis-reference-prebuilt-percentage.md)   |    V2, V3   |
[Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    V2, V3   |
[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    V2, V3   |
[URL](luis-reference-prebuilt-url.md)   |    V2, V3   |
<!---[GeographyV2](luis-reference-prebuilt-geographyV2.md)   |    -   |-->
<!---[OrdinalV2](luis-reference-prebuilt-ordinal-v2.md)   |    -   |-->
<!---[PersonName](luis-reference-prebuilt-person.md)   |    -   |-->

## Japanese entity support

The following entities are supported:

|Prebuilt entity | ja-JP |
| -------------- | :---: |
[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    V2, -   |
[Currency (money)](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    V2, -   |
[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    V2, -   |
[Email](luis-reference-prebuilt-email.md)   |    V2, V3   |
[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    V2, V3   |
[Number](luis-reference-prebuilt-number.md)   |    V2, -   |
[Ordinal](luis-reference-prebuilt-ordinal.md)   |    V2, -   |
[Percentage](luis-reference-prebuilt-percentage.md)   |    V2, -   |
[Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    V2, V3   |
[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    V2, -   |
[URL](luis-reference-prebuilt-url.md)   |    V2, V3   |
<!---[Datetime](luis-reference-prebuilt-deprecated.md)   |    -   |-->
<!---[GeographyV2](luis-reference-prebuilt-geographyV2.md)   |    -   |-->
<!---[OrdinalV2](luis-reference-prebuilt-ordinal-v2.md)   |    -   |-->
<!---[PersonName](luis-reference-prebuilt-person.md)   |    -   |-->

## Korean entity support

The following entities are supported:

| Prebuilt entity | ko-KR |
| --------------- | :---: |
[Email](luis-reference-prebuilt-email.md)   |    V2, V3   |
[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    V2, V3   |
[Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    V2, V3   |
[URL](luis-reference-prebuilt-url.md)   |    V2, V3   |
<!---[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    -   |-->
<!---[Currency (money)](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    -   |-->
<!---[Datetime](luis-reference-prebuilt-deprecated.md)   |    -   |-->
<!---[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    -   |-->
<!---[GeographyV2](luis-reference-prebuilt-geographyV2.md)   |    -   |-->
<!---[Number](luis-reference-prebuilt-number.md)   |    -   |-->
<!---[Ordinal](luis-reference-prebuilt-ordinal.md)   |    -   |-->
<!---[OrdinalV2](luis-reference-prebuilt-ordinal-v2.md)   |    -   |-->
<!---[Percentage](luis-reference-prebuilt-percentage.md)   |    -   |-->
<!---[PersonName](luis-reference-prebuilt-person.md)   |    -   |-->
<!---[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    -   |-->

## Portuguese (Brazil) entity support

The following entities are supported:

| Prebuilt entity | pt-BR |
| --------------- | :---: |
[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    V2, V3   |
[Currency (money)](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    V2, V3   |
[DatetimeV2](luis-reference-prebuilt-datetimev2.md):<br>date<br>daterange<br>time<br>timerange   |    V2, V3   |
[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    V2, V3   |
[Email](luis-reference-prebuilt-email.md)   |    V2, V3   |
[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    V2, V3   |
[Number](luis-reference-prebuilt-number.md)   |    V2, V3   |
[Ordinal](luis-reference-prebuilt-ordinal.md)   |    V2, V3   |
[Percentage](luis-reference-prebuilt-percentage.md)   |    V2, V3   |
[Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    V2, V3   |
[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    V2, V3   |
[URL](luis-reference-prebuilt-url.md)   |    V2, V3   |
<!---[GeographyV2](luis-reference-prebuilt-geographyV2.md)   |    -   |-->
<!---[OrdinalV2](luis-reference-prebuilt-ordinal-v2.md)   |    -   |-->
<!---[PersonName](luis-reference-prebuilt-person.md)   |    -   |-->

KeyPhrase is not available in all subcultures of Portuguese (Brazil) - ```pt-BR```.

## Spanish (Spain) entity support

The following entities are supported:

| Prebuilt entity | es-ES |
| --------------- | :---: |
[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    V2, V3   |
[Currency (money)](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    V2, V3   |
[DatetimeV2](luis-reference-prebuilt-datetimev2.md):<br>date<br>daterange<br>time<br>timerange   |    V2, V3   |
[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    V2, V3   |
[Email](luis-reference-prebuilt-email.md)   |    V2, V3   |
[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    V2, V3   |
[Number](luis-reference-prebuilt-number.md)   |    V2, V3   |
[Ordinal](luis-reference-prebuilt-ordinal.md)   |    V2, V3   |
[Percentage](luis-reference-prebuilt-percentage.md)   |    V2, V3   |
[Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    V2, V3   |
[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    V2, V3   |
[URL](luis-reference-prebuilt-url.md)   |    V2, V3   |
<!---[GeographyV2](luis-reference-prebuilt-geographyV2.md)   |    -   |-->
<!---[OrdinalV2](luis-reference-prebuilt-ordinal-v2.md)   |    -   |-->
<!---[PersonName](luis-reference-prebuilt-person.md)   |    -   |-->

## Spanish (Mexico) entity support

The following entities are supported:

| Prebuilt entity | es-MX |
| --------------- | :---: |
[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    -   |
[Currency (money)](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    -   |
[DatetimeV2](luis-reference-prebuilt-datetimev2.md):<br>date<br>daterange<br>time<br>timerange   |    -   |
[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    -   |
[Email](luis-reference-prebuilt-email.md)   |    V2, V3   |
[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    V2, V3   |
[Number](luis-reference-prebuilt-number.md)   |    V2, V3   |
[Ordinal](luis-reference-prebuilt-ordinal.md)   |    -   |
[Percentage](luis-reference-prebuilt-percentage.md)   |    -   |
[Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    V2, V3   |
[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    -   |
[URL](luis-reference-prebuilt-url.md)   |    V2, V3   |
<!---[GeographyV2](luis-reference-prebuilt-geographyV2.md)   |    -   |-->
<!---[OrdinalV2](luis-reference-prebuilt-ordinal-v2.md)   |    -   |-->
<!---[PersonName](luis-reference-prebuilt-person.md)   |    -   |-->

<!--- See notes on [Deprecated prebuilt entities](luis-reference-prebuilt-deprecated.md)-->

## Turkish entity support

| Prebuilt entity | tr-tr |
| --------------- | :---: |
[Age](luis-reference-prebuilt-age.md):<br>year<br>month<br>week<br>day   |    -   |
[Currency (money)](luis-reference-prebuilt-currency.md):<br>dollar<br>fractional unit (ex: penny)  |    -   |
[DatetimeV2](luis-reference-prebuilt-datetimev2.md):<br>date<br>daterange<br>time<br>timerange   |    -   |
[Dimension](luis-reference-prebuilt-dimension.md):<br>volume<br>area<br>weight<br>information (ex: bit/byte)<br>length (ex: meter)<br>speed (ex: mile per hour)  |    -   |
[Email](luis-reference-prebuilt-email.md)   |    -   |
[Number](luis-reference-prebuilt-number.md)   |    -   |
[Ordinal](luis-reference-prebuilt-ordinal.md)   |    -   |
[Percentage](luis-reference-prebuilt-percentage.md)   |    -   |
[Temperature](luis-reference-prebuilt-temperature.md):<br>fahrenheit<br>kelvin<br>rankine<br>delisle<br>celsius   |    -   |
[URL](luis-reference-prebuilt-url.md)   |    -   |
<!---[KeyPhrase](luis-reference-prebuilt-keyphrase.md)   |    V2, V3   |-->
<!---Phonenumber](luis-reference-prebuilt-phonenumber.md)   |    -   |-->

<!--- See notes on [Deprecated prebuilt entities](luis-reference-prebuilt-deprecated.md). -->

## Contribute to prebuilt entity cultures
The prebuilt entities are developed in the Recognizers-Text open-source project. [Contribute](https://github.com/Microsoft/Recognizers-Text) to the project. This project includes examples of currency per culture.

GeographyV2 and PersonName are not included in the Recognizers-Text project. For issues with these prebuilt entities, please open a [support request](../../azure-portal/supportability/how-to-create-azure-support-request.md).

## Next steps

Learn about the [number](luis-reference-prebuilt-number.md), [datetimeV2](luis-reference-prebuilt-datetimev2.md), and [currency](luis-reference-prebuilt-currency.md) entities.
