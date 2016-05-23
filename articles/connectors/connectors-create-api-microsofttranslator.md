<properties
    pageTitle="Add the Microsoft Translator in PowerApps Enterprise or logic apps| Microsoft Azure"
    description="Overview of the Microsoft Translator connector with REST API parameters"
    services=""
    suite=""
    documentationCenter="" 
    authors="MandiOhlinger"
    manager="erikre"
    editor=""
    tags="connectors"/>

<tags
   ms.service="multiple"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="05/18/2016"
   ms.author="mandia"/>

# Get started with the Microsoft Translator connector
Connect to Microsoft Translator to translate text, detect a language, and more. The Microsoft Translator connector can be used from:

- Logic apps 
- PowerApps

> [AZURE.SELECTOR]
- [Logic apps](../articles/connectors/connectors-create-api-microsofttranslator.md)
- [PowerApps Enterprise](../articles/power-apps/powerapps-create-api-microsofttranslator.md)

With Microsoft Translator, you can: 

- Build your business flow based on the data you get from Microsoft Translator. 
- Use actions to translate text, detect a language, and more. These actions get a response, and then make the output available for other actions. For example, when a new file is created in Dropbox, you can translate the text in the file to another language using Microsoft Translator.
- Add the Microsoft Translator connector to PowerApps Enterprise. Then, your users can use this connector within their apps. 

For information on how to add a connector in PowerApps Enterprise, go to [Register a connector in PowerApps](../power-apps/powerapps-register-from-available-apis.md). 

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Triggers and actions
Microsoft Translator includes the following actions. There are no triggers.

Triggers | Actions
--- | ---
None | <ul><li>Detect language</li><li>Text to speech</li><li>Translate text</li><li>Get languages</li><li>Get speech languages</li></ul>

All connectors support data in JSON and XML formats.


## Create a connection to Microsoft Translator

>[AZURE.INCLUDE [Steps to create a connection to Microsoft Translator](../../includes/connectors-create-api-microsofttranslator.md)]


## Swagger REST API reference
Applies to version: 1.0.

### Detect language    
Detects source language of given text.  
```GET: /Detect```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|query|string|yes|query|none |Text whose language will be identified|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Text to speech    
Converts a given text into speech as an audio stream in wave format.  
```GET: /Speak```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|query|string|yes|query|none |Text to convert|
|language|string|yes|query|none |Language code to generate speech (example: 'en-us')|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Translate text    
Translates text to a specified language using Microsoft Translator.  
```GET: /Translate```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|query|string|yes|query|none |Text to translate|
|languageTo|string|yes|query| none|Target language code (example: 'fr')|
|languageFrom|string|no|query|none |Source language; if not provided, Microsoft Translator will try to auto-detect. (example: en)|
|category|string|no|query|general |Translation category (default: 'general')|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get languages    
Retrieves all languages that Microsoft Translator supports.  
```GET: /TranslatableLanguages```

There are no parameters for this call. 

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Get speech languages    
Retrieves the languages available for speech synthesis.  
```GET: /SpeakLanguages``` 

There are no parameters for this call.

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|

## Object definitions

#### Language: language model for Microsoft Translator translatable languages

|Property Name | Data Type | Required|
|---|---|---|
|Code|string|no|
|Name|string|no|


## Next steps

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

Go back to the [APIs list](apis-list.md).


<!--References-->
[5]: https://datamarket.azure.com/developer/applications/
[6]: ./media/connectors-create-api-microsofttranslator/register-your-application.png
