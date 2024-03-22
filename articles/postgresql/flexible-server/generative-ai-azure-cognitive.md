---
title: Integrate Azure AI Language Services with Azure Database for PostgreSQL
description: Create AI applications with sentiment analysis, summarization, or key phrase extraction using Azure AI Language Services and Azure Database for PostgreSQL - Flexible Server.
author: mulander
ms.author: adamwolk
ms.reviewer: maghan
ms.date: 03/18/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Integrate Azure Database for PostgreSQL - Flexible Server with Azure Cognitive Services (Preview)

Azure AI extension gives the ability to invoke the [Azure AI Language Services](../../ai-services/language-service/overview.md#which-language-service-feature-should-i-use) such as sentiment analysis right from within the database.

## Prerequisites

1. [Enable and configure](generative-ai-azure-overview.md#enable-the-azure_ai-extension) the `azure_ai` extension.
1. [Create a Language resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) in the Azure portal to get your key and endpoint.
1. After it deploys, select **Go to resource**.

> [!NOTE]  
> You will need the key, endpoint and region from the resource you create to connect the extension to the API.

## Configure azure_ai extension with Azure Cognitive Services

In the Language resource, under **Resource Management** > **Keys and Endpoint** you can find the endpoint, keys, and Location/Region for your language resource. Use the endpoint and key to enable `azure_ai` extension to invoke the model deployment. The Location/Region setting is only required for the translation function.

```postgresql
select azure_ai.set_setting('azure_cognitive.endpoint','https://<endpoint>.cognitiveservices.azure.com');
select azure_ai.set_setting('azure_cognitive.subscription_key', '<API Key>');
-- the region setting is only required for the translate function
select azure_ai.set_setting('azure_cognitive.region', '<API Key>');
```

## Sentiment analysis

[Sentiment analysis](../../ai-services/language-service/sentiment-opinion-mining/overview.md) provides sentiment labels (`negative`,`positive`,`neutral`) and confidence scores for the text passed to the model.

### `azure_cognitive.analyze_sentiment`

```postgresql
azure_cognitive.analyze_sentiment(text text, language text, timeout_ms integer DEFAULT 3600000, throw_on_error boolean DEFAULT TRUE, disable_service_logs boolean DEFAULT false)
```

#### Arguments

##### `text`

`text` input to be processed.

##### `language`

`text` two-letter ISO 639-1 representation of the language that the input text is written in. Check [language support](../../ai-services/language-service/concepts/language-support.md) for allowed values.

##### `timeout_ms`

`integer DEFAULT 3600000` timeout in milliseconds after which the operation is stopped.

##### `throw_on_error`

`boolean DEFAULT true` on error should the function throw an exception resulting in a rollback of wrapping transactions.

##### `disable_service_logs`

`boolean DEFAULT false` the Language service logs your input text for 48 hours solely to allow for troubleshooting issues. Setting this property to `true` disables input logging and might limit our ability to investigate issues that occur.

For more information, see Cognitive Services Compliance and Privacy notes at https://aka.ms/cs-compliance, and Microsoft Responsible AI principles at https://www.microsoft.com/ai/responsible-ai.

#### Return type

`azure_cognitive.sentiment_analysis_result` a result record containing the sentiment predictions of the input text. It contains the sentiment, which can be `positive`, `negative`, `neutral`, and `mixed`; and the score for positive, neutral, and negative found in the text represented as a real number between 0 and 1. For example in `(neutral,0.26,0.64,0.09)`, the sentiment is `neutral` with `positive` score at `0.26`, neutral at `0.64` and negative at `0.09`.

## Language detection

[Language detection in Azure AI](../../ai-services/language-service/language-detection/overview.md) automatically detects the language a document.

### `azure_cognitive.detect_language`

```postgresql
azure_cognitive.detect_language(text TEXT, timeout_ms INTEGER DEFAULT 3600000, throw_on_error BOOLEAN DEFAULT TRUE, disable_service_logs BOOLEAN DEFAULT FALSE)
```

#### Arguments

##### `text`

`text` input to be processed.

##### `timeout_ms`

`integer DEFAULT 3600000` timeout in milliseconds after which the operation is stopped.

##### `throw_on_error`

`boolean DEFAULT true` on error should the function throw an exception resulting in a rollback of wrapping transactions.

##### `disable_service_logs`

`boolean DEFAULT false` the Language service logs your input text for 48 hours solely to allow for troubleshooting issues. Setting this property to `true` disables input logging and might limit our ability to investigate issues that occur.

For more information, see Cognitive Services Compliance and Privacy notes at https://aka.ms/cs-compliance, and Microsoft Responsible AI principles at https://www.microsoft.com/ai/responsible-ai.

#### Return type

`azure_cognitive.language_detection_result`, a result containing the detected language name, its two-letter ISO 639-1 representation, and the confidence score for the detection. For example in `(Portuguese,pt,0.97)`, the language is `Portuguese`, and detection confidence is `0.97`.

## Key phrase extraction

[Key phrase extraction in Azure AI](../../ai-services/language-service/key-phrase-extraction/overview.md) extracts the main concepts in a text.

### `azure_cognitive.extract_key_phrases`

```postgresql
azure_cognitive.extract_key_phrases(text TEXT, language TEXT, timeout_ms INTEGER DEFAULT 3600000, throw_on_error BOOLEAN DEFAULT TRUE, disable_service_logs BOOLEAN DEFAULT FALSE)
```

#### Arguments

##### `text`

`text` input to be processed.

##### `language`

`text` two-letter ISO 639-1 representation of the language that the input text is written in. Check [language support](../../ai-services/language-service/concepts/language-support.md) for allowed values.

##### `timeout_ms`

`integer DEFAULT 3600000` timeout in milliseconds after which the operation is stopped.

##### `throw_on_error`

`boolean DEFAULT true` on error should the function throw an exception resulting in a rollback of wrapping transactions.

##### `disable_service_logs`

`boolean DEFAULT false` the Language service logs your input text for 48 hours solely to allow for troubleshooting issues. Setting this property to `true` disables input logging and might limit our ability to investigate issues that occur.

For more information, see Cognitive Services Compliance and Privacy notes at https://aka.ms/cs-compliance, and Microsoft Responsible AI principles at https://www.microsoft.com/ai/responsible-ai.

#### Return type

`text[]`, a collection of key phrases identified in the text. For example, if invoked with a `text` set to `'For more information, see Cognitive Services Compliance and Privacy notes.'`, and `language` set to `'en'`, it could return `{"Cognitive Services Compliance","Privacy notes",information}`.

## Entity linking

[Entity linking in Azure AI](../../ai-services/language-service/entity-linking/overview.md) identifies and disambiguates the identity of entities found in text linking them to a well-known knowledge base.

### `azure_cognitive.linked_entities`

```postgresql
azure_cognitive.linked_entities(text text, language text, timeout_ms integer DEFAULT 3600000, throw_on_error boolean DEFAULT true, disable_service_logs boolean DEFAULT false)
```

#### Arguments

##### `text`

`text` input to be processed.

##### `language`

`text` two-letter ISO 639-1 representation of the language that the input text is written in. Check [language support](../../ai-services/language-service/concepts/language-support.md) for allowed values.

##### `timeout_ms`

`integer DEFAULT 3600000` timeout in milliseconds after which the operation is stopped.

##### `throw_on_error`

`boolean DEFAULT true` on error should the function throw an exception resulting in a rollback of wrapping transactions.

##### `disable_service_logs`

`boolean DEFAULT false` the Language service logs your input text for 48 hours solely to allow for troubleshooting issues. Setting this property to `true` disables input logging and might limit our ability to investigate issues that occur.

For more information, see Cognitive Services Compliance and Privacy notes at https://aka.ms/cs-compliance, and Microsoft Responsible AI principles at https://www.microsoft.com/ai/responsible-ai.

#### Return type

`azure_cognitive.linked_entity[]`, a collection of linked entities, where each defines the name, data source entity identifier, language, data source, URL, collection of `azure_cognitive.linked_entity_match` (defining the text and confidence score) and finally a Bing entity search API identifier. For example, if invoked with a `text` set to `'For more information, see Cognitive Services Compliance and Privacy notes.'`, and `language` set to `'en'`, it could return `{"(\"Cognitive computing\",\"Cognitive computing\",en,Wikipedia,https://en.wikipedia.org/wiki/Cognitive_computing,\"{\"\"(\\\\\"\"Cognitive Services\\\\\"\",0.78)\
"\"}\",d73f7d5f-fddb-0908-27b0-74c7db81cd8d)","(\"Regulatory compliance\",\"Regulatory compliance\",en,Wikipedia,https://en.wikipedia.org/wiki/Regulatory_compliance
,\"{\"\"(Compliance,0.28)\"\"}\",89fefaf8-e730-23c4-b519-048f3c73cdbd)","(\"Information privacy\",\"Information privacy\",en,Wikipedia,https://en.wikipedia.org/wiki
/Information_privacy,\"{\"\"(Privacy,0)\"\"}\",3d0f2e25-5829-4b93-4057-4a805f0b1043)"}`.

### `azure_cognitive.recognize_entities`

[Named Entity Recognition (NER) feature in Azure AI](../../ai-services/language-service/named-entity-recognition/overview.md) can identify and categorize entities in unstructured text.

```postgresql
azure_cognitive.recognize_entities(text text, language text, timeout_ms integer DEFAULT 3600000, throw_on_error boolean DEFAULT true, disable_service_logs boolean DEFAULT false)
```

#### Arguments

##### `text`

`text` input to be processed.

##### `language`

`text` two-letter ISO 639-1 representation of the language that the input text is written in. Check [language support](../../ai-services/language-service/concepts/language-support.md) for allowed values.

##### `timeout_ms`

`integer DEFAULT 3600000` timeout in milliseconds after which the operation is stopped.

##### `throw_on_error`

`boolean DEFAULT true` on error should the function throw an exception resulting in a rollback of wrapping transactions.

##### `disable_service_logs`

`boolean DEFAULT false` the Language service logs your input text for 48 hours solely to allow for troubleshooting issues. Setting this property to `true` disables input logging and might limit our ability to investigate issues that occur.

For more information, see Cognitive Services Compliance and Privacy notes at https://aka.ms/cs-compliance, and Microsoft Responsible AI principles at https://www.microsoft.com/ai/responsible-ai.

#### Return type

`azure_cognitive.entity[]`, a collection of entities, where each defines the text identifying the entity, category of the entity and confidence score of the match. For example, if invoked with a `text` set to `'For more information, see Cognitive Services Compliance and Privacy notes.'`, and `language` set to `'en'`, it could return `{"(\"Cognitive Services\",Skill,\"\",0.94)"}`.

## Personally Identifiable data (PII) detection

 Identifies [PII data](../../ai-services/language-service/personally-identifiable-information/overview.md) found in the input text and categorizes those entities into types.

### `azure_cognitive.recognize_pii_entities`

```postgresql
azure_cognitive.recognize_pii_entities(text text, language text, timeout_ms integer DEFAULT 3600000, throw_on_error boolean DEFAULT true, domain text DEFAULT 'none'::text, disable_service_logs boolean DEFAULT true)
```

#### Arguments

##### `text`

`text` input to be processed.

##### `language`

`text` two-letter ISO 639-1 representation of the language that the input text is written in. Check [language support](../../ai-services/language-service/concepts/language-support.md) for allowed values.

##### `timeout_ms`

`integer DEFAULT 3600000` timeout in milliseconds after which the operation is stopped.

##### `throw_on_error`

`boolean DEFAULT true` on error should the function throw an exception resulting in a rollback of wrapping transactions.

##### `domain`

`text DEFAULT 'none'::text`, the personal data domain used for personal data Entity Recognition. Valid values are `none` for no domain specified and `phi` for Personal Health Information.

##### `disable_service_logs`

`boolean DEFAULT true` the Language service logs your input text for 48 hours solely to allow for troubleshooting issues. Setting this property to `true` disables input logging and might limit our ability to investigate issues that occur.

For more information, see Cognitive Services Compliance and Privacy notes at https://aka.ms/cs-compliance, and Microsoft Responsible AI principles at https://www.microsoft.com/ai/responsible-ai.

#### Return type

`azure_cognitive.pii_entity_recognition_result`, a result containing the redacted text, and entities as `azure_cognitive.entity[]`. Each entity contains the nonredacted text, personal data category, subcategory, and a score indicating the confidence that the entity correctly matches the identified substring. For example, if invoked with a `text` set to `'My phone number is +1555555555, and the address of my office is 16255 NE 36th Way, Redmond, WA 98052.'`, and `language` set to `'en'`, it could return `("My phone number is ***********, and the address of my office is ************************************.","{""(+1555555555,PhoneNumber,\\""\\"",0.8)"",""(\\""16255 NE 36th Way, Redmond, WA 98052\\"",Address,\\""\\"",1)""}")`.

## Document summarization

[Document summarization](../../ai-services/language-service/summarization/overview.md) uses natural language processing techniques to generate a summary for documents.

### `azure_cognitive.summarize_abstractive`

[Document abstractive summarization](../../ai-services/language-service/summarization/overview.md) produces a summary that might not use the same words in the document but yet captures the main idea.

```postgresql
azure_cognitive.summarize_abstractive(text text, language text, timeout_ms integer DEFAULT 3600000, throw_on_error boolean DEFAULT true, sentence_count integer DEFAULT 3, disable_service_logs boolean DEFAULT false)
```

#### Arguments

##### `text`

`text` input to be processed.

##### `language`

`text` two-letter ISO 639-1 representation of the language that the input text is written in. Check [language support](../../ai-services/language-service/concepts/language-support.md) for allowed values.

##### `timeout_ms`

`integer DEFAULT 3600000` timeout in milliseconds after which the operation is stopped.

##### `throw_on_error`

`boolean DEFAULT true` on error should the function throw an exception resulting in a rollback of wrapping transactions.

##### `sentence_count`

`integer DEFAULT 3`, maximum number of sentences that the summarization should contain.

##### `disable_service_logs`

`boolean DEFAULT false` the Language service logs your input text for 48 hours solely to allow for troubleshooting issues. Setting this property to `true` disables input logging and might limit our ability to investigate issues that occur.

For more information, see Cognitive Services Compliance and Privacy notes at https://aka.ms/cs-compliance, and Microsoft Responsible AI principles at https://www.microsoft.com/ai/responsible-ai.

#### Return type

`text[]`, a collection of summaries with each one not exceeding the defined `sentence_count`. For example, if invoked with a `text` set to `'PostgreSQL features transactions with atomicity, consistency, isolation, durability (ACID) properties, automatically updatable views, materialized views, triggers, foreign keys, and stored procedures. It is designed to handle a range of workloads, from single machines to data warehouses or web services with many concurrent users. It was the default database for macOS Server and is also available for Linux, FreeBSD, OpenBSD, and Windows.'`, and `language` set to `'en'`, it could return `{"PostgreSQL is a database system with advanced features such as atomicity, consistency, isolation, and durability (ACID) properties. It is designed to handle a range of workloads, from single machines to data warehouses or web services with many concurrent users. PostgreSQL was the default database for macOS Server and is available for Linux, BSD, OpenBSD, and Windows."}`.

### `azure_cognitive.summarize_extractive`

[Document extractive summarization](../../ai-services/language-service/summarization/how-to/document-summarization.md) produces a summary extracting key sentences within the document.

```postgresql
azure_cognitive.summarize_extractive(text text, language text, timeout_ms integer DEFAULT 3600000, throw_on_error boolean DEFAULT true, sentence_count integer DEFAULT 3, sort_by text DEFAULT 'offset'::text, disable_service_logs boolean DEFAULT false)
```

#### Arguments

##### `text`

`text` input to be processed.

##### `language`

`text` two-letter ISO 639-1 representation of the language that the input text is written in. Check [language support](../../ai-services/language-service/concepts/language-support.md) for allowed values.

##### `timeout_ms`

`integer DEFAULT 3600000` timeout in milliseconds after which the operation is stopped.

##### `throw_on_error`

`boolean DEFAULT true` on error should the function throw an exception resulting in a rollback of wrapping transactions.

##### `sentence_count`

`integer DEFAULT 3`, maximum number of sentences to extract.

##### `sort_by`

`text DEFAULT ``offset``::text`, order of extracted sentences. Valid values are `rank` and `offset`.

##### `disable_service_logs`

`boolean DEFAULT false` the Language service logs your input text for 48 hours solely to allow for troubleshooting issues. Setting this property to `true` disables input logging and might limit our ability to investigate issues that occur.

For more information, see Cognitive Services Compliance and Privacy notes at https://aka.ms/cs-compliance, and Microsoft Responsible AI principles at https://www.microsoft.com/ai/responsible-ai.

#### Return type

`azure_cognitive.sentence[]`, a collection of extracted sentences along with their rank score.  
For example, if invoked with a `text` set to `'PostgreSQL features transactions with atomicity, consistency, isolation, durability (ACID) properties, automatically updatable views, materialized views, triggers, foreign keys, and stored procedures. It is designed to handle a range of workloads, from single machines to data warehouses or web services with many concurrent users. It was the default database for macOS Server and is also available for Linux, FreeBSD, OpenBSD, and Windows.'`, and `language` set to `'en'`, it could return `{"(\"PostgreSQL features transactions with atomicity, consistency, isolation, durability (ACID) properties, automatically updatable views, materialized views, triggers, foreign keys, and stored procedures.\",0.16)","(\"It is designed to handle a range of workloads, from single machines to data warehouses or web services with many concurrent users.\",0)","(\"It was the default database for macOS Server and is also available for Linux, FreeBSD, OpenBSD, and Windows.\",1)"}`.

## Language translation

[Azure AI Text Translation](../../ai-services/translator/text-translation-overview.md) enables quick and accurate translation to target languages in real time.

### `azure_cognitive.translate`

```postgresql
azure_cognitive.translate(text text, target_language text, timeout_ms integer DEFAULT NULL, throw_on_error boolean DEFAULT true, source_language text DEFAULT NULL, text_type text DEFAULT 'plain', profanity_action text DEFAULT 'NoAction', profanity_marker text DEFAULT 'Asterisk', suggested_source_language text DEFAULT NULL , source_script text DEFAULT NULL , target_script text DEFAULT NULL)
```

> [!NOTE]  
> Translation is only available in version 0.2.0 of azure_ai extension. To check the version, check the pg_available_extensions catalog view.

```postgresql
select * from pg_available_extensions where name = 'azure_ai';
```

#### Arguments

For more information on parameters, see [Translator API](../../ai-services/translator/reference/v3-0-translate.md).  

##### `text`

`text` the input text to be translated

##### `target_language`

`text` two-letter ISO 639-1 representation of the language that you want the input text to be translated to. Check [language support](../../ai-services/language-service/concepts/language-support.md) for allowed values.

##### `timeout_ms`

`integer DEFAULT 3600000` timeout in milliseconds after which the operation is stopped.

##### `throw_on_error`

`boolean DEFAULT true` on error should the function throw an exception resulting in a rollback of wrapping transactions.

##### `source_language`

`text DEFAULT NULL` two-letter ISO 639-1 representation of the language that the input text is written in. Check [language support](../../ai-services/language-service/concepts/language-support.md) for allowed values. If it isn't specified, automatic language detection is applied to determine the source language.

##### `text_type`

`boolean DEFAULT 'plain'` Defines the type of text being translated. Valid values are 'plain' or 'html'. Any HTML needs to be well-formed.

##### `profanity_action`
`boolean DEFAULT 'NoAction'` Specifies how profanities are treated in translations. Valid values are 'NoAction', 'Marked', or 'Deleted'. 'NoAction' is the default behavior and profanity passes from source to target. 'Deleted' indicates that profane words are removed without replacement. 'Marked' replaces the marked word in the output with the profanity_marker parameter.

##### `profanity_marker`
`boolean DEFAULT 'Asterisk'` Specifies how profanities are marked in translations. Possible values are 'Asterisk' that replaces profane words with *** or 'Tag' that replaces profane words with '\<profanity> \</profanity>' tags.

##### `suggested_source_language`
`text DEFAULT NULL` Specifies fallback language if the language of input text can't be identified.

##### `source_script`
`text DEFAULT NULL` Specific script of the input text.

##### `target_script`
`text DEFAULT NULL` Specific script of the input text.

#### Return type

`azure_cognitive.translated_text_result`, a json array of translated texts. Details of the response body can be found in the [response body](../../ai-services/translator/reference/v3-0-translate.md#response-body).

## Examples

### Sentiment analysis examples

```postgresql
select b.*
from azure_cognitive.analyze_sentiment('The book  was not great, It is mediocre at best','en') b
```

### Summarization examples

```postgresql
SELECT
    bill_id,
    unnest(azure_cognitive.summarize_abstractive(bill_text, 'en')) abstractive_summary
FROM bill_summaries
WHERE bill_id = '114_hr2499';
```

### Translation examples

```postgresql
-- Translate into Portuguese
select  a.*
from azure_cognitive.translate('Language Translation in real time in multiple languages is quite cool', 'pt') a;

-- Translate to multiple languages
select  (unnest(a.translations)).*
from azure_cognitive.translate('Language Translation in real time in multiple languages is quite cool', array['es', 'pt', 'zh-Hans']) a;
```

### Personal data detection examples

```postgresql
select
    'Contoso employee with email Contoso@outlook.com is using our awesome API' as InputColumn,
    pii_entities.*
    from azure_cognitive.recognize_pii_entities('Contoso employee with email Contoso@outlook.com is using our awesome API', 'en') as pii_entities
```

## Related content

- [Learn more about Azure Open AI integration](generative-ai-azure-openai.md)
- [Learn more about Azure Machine Learning integration](generative-ai-azure-machine-learning.md)
