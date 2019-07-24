---
title: Collaborative Translation Framework (CTF) Reporting - Translator Text API
titlesuffix: Azure Cognitive Services
description: How to use Collaborative Translation Framework (CTF) reporting.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 12/14/2017
ms.author: swmachan
---

# How to use Collaborative Translation Framework (CTF) reporting

> [!NOTE]
> This method is deprecated. It is not available in V3.0 of the Translator Text API.
> 
> The Collaborative Translations Framework (CTF), previously available for V2.0 of the Translator Text API, was deprecated as of February 1, 2018. The AddTranslation and AddTranslationArray functions let users enable corrections through the Collaborative Translation Framework. After January 31, 2018, these two functions did not accept new sentence submissions, and users receive an error message. These functions were retired and will not be replaced.

The Collaborative Translation Framework (CTF) Reporting API returns statistics and the actual content in the CTF store. This API is different from the GetTranslations() method because it:
* Returns the translated content and its total count only from your account (appId or Azure Marketplace account).
* Returns the translated content and its total count without requiring a match of the source sentence.
* Does not return the automatic translation (machine translation).

## Endpoint
The endpoint of the CTF Reporting API is
https://api.microsofttranslator.com/v2/beta/ctfreporting.svc


## Methods
| Name |	Description|
|:---|:---|
| GetUserTranslationCounts Method | Get counts of the translations that are created by the user. |
| GetUserTranslations Method | Retrieves the translations that are created by the user. |

These methods enable you to:
* Retrieve the complete set of user translations and corrections under your account ID for download.
* Obtain the list of the frequent contributors. Ensure that the correct user name is provided in AddTranslation().
* Build a user interface (UI) that allows your trusted users to see all available candidates, if necessary restricted to a portion of your site, based on the URI prefix.

> [!NOTE]
> Both the methods are relatively slow and expensive. It is recommended to use them sparingly.

## GetUserTranslationCounts method

This method gets the count of translations that are created by the user. It provides the list of translation counts grouped by the uriPrefix, from, to, user, minRating, and maxRating request parameters.

**Syntax**

> [!div class="tabbedCodeSnippets"]
> ```cs
> UserTranslationCount[]GetUserTranslationCounts(
>            string appId,
>            string uriPrefix,
>            string from,
>            string to,
>            int? minRating,
>            int? maxRating,
>            string user,
>            string category
>            DateTime? minDateUtc,
>            DateTime? maxDateUtc,
>            int? skip,
>            int? take);
> ```

**Parameters**

| Parameter	| Description |
|:---|:---|
| appId | **Required** If the Authorization header is used, leave the appid field empty else specify a string containing "Bearer" + " " + access token.|
| uriPrefix | **Optional** A string containing prefix of URI of the translation.|
| from | **Optional** A string representing the language code of the translation text. |
| to | **Optional** A string representing the language code to translate the text into.|
| minRating| **Optional** An integer value representing the minimum quality rating for the translated text. The valid value is between -10 and 10. The default value is 1.|
| maxRating| **Optional** An integer value representing the maximum quality rating for the translated text. The valid value is between -10 and 10. The default value is 1.|
| user | **Optional** A string that is used to filter the result based on the originator of the submission.	|
| category| **Optional** A string containing the category or domain of the translation. This parameter supports only the default option general.|
| minDateUtc| **Optional** The date from when you want to retrieve the translations. The date must be in the UTC format. |
| maxDateUtc| **Optional** The date till when you want to retrieve the translations. The date must be in the UTC format. |
| skip| **Optional** The number of results that you want to skip on a page. For example, if you want the skip the first 20 rows of the results and view from the 21st result record, specify 20 for this parameter. The default value for this parameter is 0.|
| take | **Optional** The number of results that you want to retrieve. The maximum number of each request is 100. The default is 100.|

> [!NOTE]
> The skip and take request parameters enable pagination for a large number of result records.

**Return value**

The result set contains array of the **UserTranslationCount**. Each UserTranslationCount has the following elements:

| Field	| Description |
|:---|:---|
| Count| The number of results that is retrieved|
| From | The source language|
| Rating| The rating that is applied by the submitter in the AddTranslation() method call|
| To| The target language|
| Uri| The URI applied in the AddTranslation() method call|
| User| The user name|

**Exceptions**

| Exception	| Message | Conditions |
|:---|:---|:---|
| ArgumentOutOfRangeException | The parameter '**maxDateUtc**' must be greater than or equal to '**minDateUtc**'.| The value of the parameter **maxDateUtc** is lesser than the value of the parameter **minDateUtc**.|
| TranslateApiException | IP is over the quota.| <ul><li>The limit for the number of requests per minute is reached.</li><li>The request size remains limited at 10000 characters.</li><li>An hourly and a daily quota limit the number of characters that the Microsoft Translator API will accept.</li></ul>|
| TranslateApiException | AppId is over the quota.| The application ID exceeded the hourly or daily quota.|

> [!NOTE]
> The quota will adjust to ensure fairness among all users of the service.

**View code examples on GitHib**
* [C#](https://github.com/MicrosoftTranslator/Documentation-Code-TextAPI/blob/master/ctf/ctf-getusertranslationcounts-example-csharp.md)
* [PHP](https://github.com/MicrosoftTranslator/Documentation-Code-TextAPI/blob/master/ctf/ctf-getusertranslationcounts-example-php.md)

## GetUserTranslations method

This method retrieves the translations that are created by the user. It provides the translations grouped by the uriPrefix, from, to, user, and minRating and maxRating request parameters.

**Syntax**

> [!div class="tabbedCodeSnippets"]
> ```cs
> UserTranslation[] GetUserTranslations (
>             string appId,
>             string uriPrefix,
>             string from,
>             string to,
>             int? minRating,
>             int? maxRating,
>             string user,
>             string category
>             DateTime? minDateUtc,
>             DateTime? maxDateUtc,
>             int? skip,
>             int? take);
> ```

**Parameters**

| Parameter	| Description |
|:---|:---|
| appId | **Required** If the Authorization header is used, leave the appid field empty else specify a string containing "Bearer" + " " + access token.|
| uriPrefix| **Optional** A string containing prefix of URI of the translation.|
| from| **Optional** A string representing the language code of the translation text.|
| to| **Optional** A string representing the language code to translate the text into.|
| minRating| **Optional** An integer value representing the minimum quality rating for the translated text. The valid value is between -10 and 10. The default value is 1.|
| maxRating| **Optional** An integer value representing the maximum quality rating for the translated text. The valid value is between -10 and 10. The default value is 1.|
| user| **Optional. A string that is used to filter the result based on the originator of the submission**|
| category| **Optional** A string containing the category or domain of the translation. This parameter supports only the default option general.|
| minDateUtc| **Optional** The date from when you want to retrieve the translations. The date must be in the UTC format.|
| maxDateUtc| **Optional** The date till when you want to retrieve the translations. The date must be in the UTC format.|
| skip| **Optional** The number of results that you want to skip on a page. For example, if you want the skip the first 20 rows of the results and view from the 21st result record, specify 20 for this parameter. The default value for this parameter is 0.|
| take| **Optional** The number of results that you want to retrieve. The maximum number of each request is 100. The default is 50.|

> [!NOTE]
> The skip and take request parameters enable pagination for a large number of result records.

**Return value**

The result set contains array of the **UserTranslation**. Each UserTranslation has the following elements:

| Field	| Description |
|:---|:---|
| CreatedDateUtc| The creation date of the entry using AddTranslation()|
| From|	The source language|
| OriginalText|	The source language text that is used when submitting the request|
|Rating	|The rating that is applied by the submitter in the AddTranslation() method call|
|To|	The target language|
|TranslatedText|	The translation as submitted in the AddTranslation() method call|
|Uri|	The URI applied in the AddTranslation() method call|
|User	|The user name|

**Exceptions**

| Exception	| Message | Conditions |
|:---|:---|:---|
| ArgumentOutOfRangeException | The parameter '**maxDateUtc**' must be greater than or equal to '**minDateUtc**'.| The value of the parameter **maxDateUtc** is lesser than the value of the parameter **minDateUtc**.|
| TranslateApiException | IP is over the quota.| <ul><li>The limit for the number of requests per minute is reached.</li><li>The request size remains limited at 10000 characters.</li><li>An hourly and a daily quota limit the number of characters that the Microsoft Translator API will accept.</li></ul>|
| TranslateApiException | AppId is over the quota.| The application ID exceeded the hourly or daily quota.|

> [!NOTE]
> The quota will adjust to ensure fairness among all users of the service.

**View code examples on GitHib**
* [C#](https://github.com/MicrosoftTranslator/Documentation-Code-TextAPI/blob/master/ctf/ctf-getusertranslations-example-csharp.md)
* [PHP](https://github.com/MicrosoftTranslator/Documentation-Code-TextAPI/blob/master/ctf/ctf-getusertranslations-example-php.md)
