---
title: Conversational Language Understanding backwards compatibility
titleSuffix: Azure AI services
description: Learn about backwards compatibility between LUIS and Conversational Language Understanding
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 12/19/2023
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# Migrate from Language Understanding (LUIS) to conversational language understanding (CLU)

[Conversational language understanding (CLU)](../overview.md) is a cloud-based AI offering in Azure AI Language. It's the newest generation of [Language Understanding (LUIS)](../../../luis/what-is-luis.md) and offers backwards compatibility with previously created LUIS applications. CLU employs state-of-the-art machine learning intelligence to allow users to build a custom natural language understanding model for predicting intents and entities in conversational utterances. 

CLU offers the following advantages over LUIS: 

- Improved accuracy with state-of-the-art machine learning models for better intent classification and entity extraction. LUIS required more examples to generalize certain concepts in intents and entities, while CLU's more advanced machine learning reduces the burden on customers by requiring significantly less data.  
- Multilingual support for model learning and training. Train projects in one language and immediately predict intents and entities across 96 languages.
- Ease of integration with different CLU and [custom question answering](../../question-answering/overview.md) projects using [orchestration workflow](../../orchestration-workflow/overview.md). 
- The ability to add testing data within the experience using Language Studio and APIs for model performance evaluation prior to deployment. 

To get started, you can [create a new project](../quickstart.md?pivots=language-studio#create-a-conversational-language-understanding-project) or [migrate your LUIS application](#migrate-your-luis-applications). 

## Comparison between LUIS and CLU

The following table presents a side-by-side comparison between the features of LUIS and CLU. It also highlights the changes to your LUIS application after migrating to CLU. Select the linked concept to learn more about the changes.

|LUIS features | CLU features | Post migration |
|:------------:|:----------------------------------------------:|:--------------:|
|Machine-learned and Structured ML entities| Learned [entity components](#how-are-entities-different-in-clu) |Machine-learned entities without subentities will be transferred as CLU entities. Structured ML entities will only transfer leaf nodes (lowest level subentities that do not have their own subentities) as entities in CLU. The name of the entity in CLU will be the name of the subentity concatenated with the parent. For example, _Order.Size_|
|List, regex, and prebuilt entities| List, regex, and prebuilt [entity components](#how-are-entities-different-in-clu) | List, regex, and prebuilt entities will be transferred as entities in CLU with a populated entity component based on the entity type.|
|`Pattern.Any` entities| Not currently available | `Pattern.Any` entities will be removed.|
|Single culture for each application|[Multilingual models](#how-is-conversational-language-understanding-multilingual) enable multiple languages for each project. |The primary language of your project will be set as your LUIS application culture. Your project can be trained to extend to different languages.|
|Entity roles  |[Roles](#how-are-entity-roles-transferred-to-clu) are no longer needed. | Entity roles will be transferred as entities.|
|Settings for: normalize punctuation, normalize diacritics, normalize word form, use all training data  |[Settings](#how-is-the-accuracy-of-clu-better-than-luis) are no longer needed. |Settings will not be transferred.  |
|Patterns and phrase list features|[Patterns and Phrase list features](#how-is-the-accuracy-of-clu-better-than-luis) are no longer needed. |Patterns and phrase list features will not be transferred.  |
|Entity features| Entity components| List or prebuilt entities added as features to an entity will be transferred as added components to that entity. [Entity features](#how-do-entity-features-get-transferred-in-clu) will not be transferred for intents. |
|Intents and utterances| Intents and utterances |All intents and utterances will be transferred. Utterances will be labeled with their transferred entities. |
|Application GUIDs |Project names| A project will be created for each migrating application with the application name. Any special characters in the application names will be removed in CLU.|
|Versioning| Every time you train, a model is created and acts as a version of your [project](#how-do-i-manage-versions-in-clu). | A project will be created for the selected application version. |
|Evaluation using batch testing |Evaluation using testing sets | [Adding your testing dataset](../how-to/tag-utterances.md#how-to-label-your-utterances) will be required.|  
|Role-Based Access Control (RBAC) for LUIS resources |Role-Based Access Control (RBAC) available for Language resources |Language resource RBAC must be [manually added after migration](../../concepts/role-based-access-control.md). |
|Single training mode| Standard and advanced [training modes](#how-are-the-training-times-different-in-clu-how-is-standard-training-different-from-advanced-training) | Training will be required after application migration. |
|Two publishing slots and version publishing |Ten deployment slots with custom naming | Deployment will be required after the application’s migration and training. |
|LUIS authoring APIs and SDK support in .NET, Python, Java, and Node.js |[CLU Authoring REST APIs](https://aka.ms/clu-authoring-apis). | For more information, see the [quickstart article](../quickstart.md?pivots=rest-api) for information on the CLU authoring APIs. [Refactoring](#do-i-have-to-refactor-my-code-if-i-migrate-my-applications-from-luis-to-clu) will be necessary to use the CLU authoring APIs. |
|LUIS Runtime APIs and SDK support in .NET, Python, Java, and Node.js |[CLU Runtime APIs](https://aka.ms/clu-runtime-api). CLU Runtime SDK support for [.NET](/dotnet/api/overview/azure/ai.language.conversations-readme) and [Python](/python/api/overview/azure/ai-language-conversations-readme?view=azure-python-preview&preserve-view=true). | See [how to call the API](../how-to/call-api.md#use-the-client-libraries-azure-sdk) for more information. [Refactoring](#do-i-have-to-refactor-my-code-if-i-migrate-my-applications-from-luis-to-clu) will be necessary to use the CLU runtime API response. |

## Migrate your LUIS applications

Use the following steps to migrate your LUIS application using either the LUIS portal or REST API.

# [LUIS portal](#tab/luis-portal)

## Migrate your LUIS applications using the LUIS portal

Follow these steps to begin migration using the [LUIS Portal](https://www.luis.ai/): 

1. After logging into the LUIS portal, click the button on the banner at the top of the screen to launch the migration wizard. The migration will only copy your selected LUIS applications to CLU. 

    :::image type="content" source="../media/backwards-compatibility/banner.svg" alt-text="A screenshot showing the migration banner in the LUIS portal." lightbox="../media/backwards-compatibility/banner.svg":::


    The migration overview tab provides a brief explanation of conversational language understanding and its benefits. Press Next to proceed.  

    :::image type="content" source="../media/backwards-compatibility/migration-overview.svg" alt-text="A screenshot showing the migration overview window." lightbox="../media/backwards-compatibility/migration-overview.svg":::

1. Determine the Language resource that you wish to migrate your LUIS application to. If you have already created your Language resource, select your Azure subscription followed by your Language resource, and then select **Next**. If you don't have a Language resource, click the link to create a new Language resource. Afterwards, select the resource and select **Next**. 

    :::image type="content" source="../media/backwards-compatibility/select-resource.svg" alt-text="A screenshot showing the resource selection window." lightbox="../media/backwards-compatibility/select-resource.svg":::

1. Select all your LUIS applications that you want to migrate, and specify each of their versions. Select **Next**. After selecting your application and version, you will be prompted with a message informing you of any features that won't be carried over from your LUIS application. 

    > [!NOTE] 
    > Special characters are not supported by conversational language understanding. Any special characters in your selected LUIS application names will be removed in your new migrated applications. 
    :::image type="content" source="../media/backwards-compatibility/select-applications.svg" alt-text="A screenshot showing the application selection window." lightbox="../media/backwards-compatibility/select-applications.svg":::

1. Review your Language resource and LUIS applications selections. Select **Finish** to migrate your applications.  

1. A popup window will let you track the migration status of your applications. Applications that have not started migrating will have a status of **Not started**. Applications that have begun migrating will have a status of **In progress**, and once they have finished migrating their status will be **Succeeded**. A **Failed** application means that you must repeat the migration process. Once the migration has completed for all applications, select **Done**.

    :::image type="content" source="../media/backwards-compatibility/migration-progress.svg" alt-text="A screenshot showing the application migration progress window." lightbox="../media/backwards-compatibility/migration-progress.svg":::

1. After your applications have migrated, you can perform the following steps: 

   * [Train your model](../how-to/train-model.md?tabs=language-studio) 
   * [Deploy your model](../how-to/deploy-model.md?tabs=language-studio) 
   * [Call your deployed model](../how-to/call-api.md?tabs=language-studio)  

# [REST API](#tab/rest-api)

## Migrate your LUIS applications using REST APIs

Follow these steps to begin migration programmatically using the CLU Authoring REST APIs: 

1. Export your LUIS application in JSON format. You can use the [LUIS Portal](https://www.luis.ai/) to export your applications, or the [LUIS programmatic APIs](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c40).  

1. Submit a POST request using the following URL, headers, and JSON body to import LUIS application into your CLU project. CLU does not support names with special characters so remove any special characters from the project name.
    
    ### Request URL
    ```rest
    {ENDPOINT}/language/authoring/analyze-conversations/projects/{PROJECT-NAME}/:import?api-version={API-VERSION}&format=luis
    ```
    
    |Placeholder  |Value  | Example |
    |---------|---------|---------|
    |`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
    |`{PROJECT-NAME}`     | The name for your project. This value is case sensitive.   | `myProject` |
    |`{API-VERSION}`     | The [version](../../concepts/model-lifecycle.md#api-versions) of the API you are calling. | `2023-04-01` |
      
    ### Headers

    Use the following header to authenticate your request.
      
    |Key|Value|
    |--|--|
    |`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|
    
    ### JSON body

    Use the exported LUIS JSON data as your body.

1. After your applications have migrated, you can perform the following steps:  

   * [Train your model](../how-to/train-model.md?tabs=language-studio) 
   * [Deploy your model](../how-to/deploy-model.md?tabs=language-studio) 
   * [Call your deployed model](../how-to/call-api.md?tabs=language-studio)  

---

## Frequently asked questions
   
### Which LUIS JSON version is supported by CLU? 

CLU supports the model JSON version 7.0.0. If the JSON format is older, it would need to be imported into LUIS first, then exported from LUIS with the most recent version.  

### How are entities different in CLU? 

In CLU, a single entity can have multiple entity components, which are different methods for extraction. Those components are then combined together using rules you can define. The available components are: 
- Learned: Equivalent to ML entities in LUIS, labels are used to train a machine-learned model to predict an entity based on the content and context of the provided labels.
- List: Just like list entities in LUIS, list components exact match a set of synonyms and maps them back to a normalized value called a **list key**.
- Prebuilt: Prebuilt components allow you to define an entity with the prebuilt extractors for common types available in both LUIS and CLU.
- Regex: Regex components use regular expressions to capture custom defined patterns, exactly like regex entities in LUIS.

Entities in LUIS will be transferred over as entities of the same name in CLU with the equivalent components transferred.

After migrating, your structured machine-learned leaf nodes and bottom-level subentities will be transferred to the new CLU model while all the parent entities and higher-level entities will be ignored. The name of the entity will be the bottom-level entity’s name concatenated with its parent entity. 

#### Example: 

LUIS entity: 

* Pizza Order  
   * Topping  
   * Size  

Migrated LUIS entity in CLU: 

* Pizza Order.Topping 
* Pizza Order.Size 
 
You also cannot label 2 different entities in CLU for the same span of characters. Learned components in CLU are mutually exclusive and do not provide overlapping predictions for learned components only. When migrating your LUIS application, entity labels that overlapped preserved the longest label and ignored any others.  

For more information on entity components, see [Entity components](../concepts/entity-components.md).

### How are entity roles transferred to CLU? 

Your roles will be transferred as distinct entities along with their labeled utterances. Each role’s entity type will determine which entity component will be populated. For example, a list entity role will be transferred as an entity with the same name as the role, with a populated list component. 

### How do entity features get transferred in CLU? 

Entities used as features for intents will not be transferred. Entities used as features for other entities will populate the relevant component of the entity. For example, if a list entity named _SizeList_ was used as a feature to a machine-learned entity named _Size_, then the _Size_ entity will be transferred to CLU with the list values from _SizeList_ added to its list component. The same is applied for prebuilt and regex entities.

### How are entity confidence scores different in CLU? 

Any extracted entity has a 100% confidence score and therefore entity confidence scores should not be used to make decisions between entities.  

### How is conversational language understanding multilingual? 

Conversational language understanding projects accept utterances in different languages. Furthermore, you can train your model in one language and extend it to predict in other languages.  

#### Example:  

Training utterance (English):  *How are you?* 

Labeled intent: Greeting 

Runtime utterance (French): *Comment ça va?*  

Predicted intent: Greeting 

### How is the accuracy of CLU better than LUIS? 

CLU uses state-of-the-art models to enhance machine learning performance of different models of intent classification and entity extraction. 

These models are insensitive to minor variations, removing the need for the following settings: _Normalize punctuation_, _normalize diacritics_, _normalize word form_, and _use all training data_.  

Additionally, the new models do not support phrase list features as they no longer require supplementary information from the user to provide semantically similar words for better accuracy. Patterns were also used to provide improved intent classification using rule-based matching techniques that are not necessary in the new model paradigm. The question below explains this in more detail. 

### What do I do if the features I am using in LUIS are no longer present?

There are several features that were present in LUIS that will no longer be available in CLU. This includes the ability to do feature engineering, having patterns and pattern.any entities, and structured entities. If you had dependencies on these features in LUIS, use the following guidance:

- **Patterns**: Patterns were added in LUIS to assist the intent classification through defining regular expression template utterances. This included the ability to define Pattern only intents (without utterance examples). CLU is capable of generalizing by leveraging the state-of-the-art models. You can provide a few utterances to that matched a specific pattern to the intent in CLU, and it will likely classify the different patterns as the top intent without the need of the pattern template utterance. This simplifies the requirement to formulate these patterns, which was limited in LUIS, and provides a better intent classification experience. 

- **Phrase list features**: The ability to associate features mainly occurred to assist the classification of intents by highlighting the key elements/features to use. This is no longer required since the deep models used in CLU already possess the ability to identify the elements that are inherent in the language. In turn removing these features will have no effect on the classification ability of the model.

- **Structured entities**: The ability to define structured entities was mainly to enable multilevel parsing of utterances. With the different possibilities of the sub-entities, LUIS needed all the different combinations of entities to be defined and presented to the model as examples. In CLU, these structured entities are no longer supported, since overlapping learned components are not supported. There are a few possible approaches to handling these structured extractions:
    - **Non-ambiguous extractions**: In most cases the detection of the leaf entities is enough to understand the required items within a full span. For example, structured entity such as _Trip_ that fully spanned a source and destination (_London to New York_ or _Home to work_) can be identified with the individual spans predicted for source and destination. Their presence as individual predictions would inform you of the _Trip_ entity.
    - **Ambiguous extractions**: When the boundaries of different sub-entities are not very clear. To illustrate, take the example “I want to order a pepperoni pizza and an extra cheese vegetarian pizza”. While the different pizza types as well as the topping modifications can be extracted, having them extracted without context would have a degree of ambiguity of where the extra cheese is added. In this case the extent of the span is context based and would require ML to determine this. For ambiguous extractions you can use one of the following approaches:

1. Combine sub-entities into different entity components within the same entity.

#### Example: 

LUIS Implementation: 

* Pizza Order (entity)  
   * Size (subentity) 
   * Quantity (subentity) 

CLU Implementation: 

* Pizza Order (entity) 
   * Size (list entity component: small, medium, large) 
   * Quantity (prebuilt entity component: number) 

In CLU, you would label the entire span for _Pizza Order_ inclusive of the size and quantity, which would return the pizza order with a list key for size, and a number value for quantity in the same entity object. 

2. For more complex problems where entities contain several levels of depth, you can create a project for each level of depth in the entity structure. This gives you the option to:
- Pass the utterance to each project.
- Combine the analyses of each project in the stage proceeding CLU. 

For a detailed example on this concept, check out the pizza sample projects available on [GitHub](https://aka.ms/clu-pizza).

### How do I manage versions in CLU? 

CLU saves the data assets used to train your model. You can export a model's assets or load them back into the project at any point. So models act as different versions of your project.

You can export your CLU projects using [Language Studio](https://language.cognitive.azure.com/home) or [programmatically](../how-to/fail-over.md#export-your-primary-project-assets) and store different versions of the assets locally.

### Why is CLU classification different from LUIS? How does None classification work? 

CLU presents a different approach to training models by using multi-classification as opposed to binary classification. As a result, the interpretation of scores is different and also differs across training options. While you are likely to achieve better results, you have to observe the difference in scores and determine a new threshold for accepting intent predictions. You can easily add a confidence score threshold for the [None intent](../concepts/none-intent.md) in your project settings. This will return *None* as the top intent if the top intent did not exceed the confidence score threshold provided. 

### Do I need more data for CLU models than LUIS? 

The new CLU models have better semantic understanding of language than in LUIS, and in turn help make models generalize with a significant reduction of data. While you shouldn’t aim to reduce the amount of data that you have, you should expect better performance and resilience to variations and synonyms in CLU compared to LUIS. 

### If I don’t migrate my LUIS apps, will they be deleted? 

Your existing LUIS applications will be available until October 1, 2025. After that time you will no longer be able to use those applications, the service endpoints will no longer function, and the applications will be permanently deleted. 

### Are .LU files supported on CLU? 

Only JSON format is supported by CLU. You can import your .LU files to LUIS and export them in JSON format, or you can follow the migration steps above for your application. 

### What are the service limits of CLU? 

See the [service limits](../service-limits.md) article for more information.

### Do I have to refactor my code if I migrate my applications from LUIS to CLU? 

The API objects of CLU applications are different from LUIS and therefore code refactoring will be necessary.  

If you are using the LUIS [programmatic](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c40) and [runtime](https://westus.dev.cognitive.microsoft.com/docs/services/luis-endpoint-api-v3-0/operations/5cb0a9459a1fe8fa44c28dd8) APIs, you can replace them with their equivalent APIs. 

[CLU authoring APIs](https://aka.ms/clu-authoring-apis): Instead of LUIS's specific CRUD APIs for individual actions such as _add utterance_, _delete entity_, and _rename intent_, CLU offers an [import API](/rest/api/language/2023-04-01/conversational-analysis-authoring/import) that replaces the full content of a project using the same name. If your service used LUIS programmatic APIs to provide a platform for other customers, you must consider this new design paradigm. All other APIs such as: _listing projects_, _training_, _deploying_, and _deleting_ are available. APIs for actions such as _importing_ and _deploying_ are asynchronous operations instead of synchronous as they were in LUIS. 

[CLU runtime APIs](https://aka.ms/clu-runtime-api): The new API request and response includes many of the same parameters such as: _query_, _prediction_, _top intent_, _intents_, _entities_, and their values. The CLU response object offers a more straightforward approach. Entity predictions are provided as they are within the utterance text, and any additional information such as resolution or list keys are provided in extra parameters called `extraInformation` and `resolution`.

You can use the [.NET](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.Language.Conversations_1.0.0-beta.3/sdk/cognitivelanguage/Azure.AI.Language.Conversations/samples/) or [Python](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-language-conversations_1.1.0b1/sdk/cognitivelanguage/azure-ai-language-conversations/samples/README.md) CLU runtime SDK to replace the LUIS runtime SDK. There is currently no authoring SDK available for CLU. 

### How are the training times different in CLU? How is standard training different from advanced training?

CLU offers standard training, which trains and learns in English and is comparable to the training time of LUIS. It also offers advanced training, which takes a considerably longer duration as it extends the training to all other [supported languages](../language-support.md). The train API will continue to be an asynchronous process, and you will need to assess the change in the DevOps process you employ for your solution. 

### How has the experience changed in CLU compared to LUIS? How is the development lifecycle different?

In LUIS you would Build-Train-Test-Publish, whereas in CLU you Build-Train-Evaluate-Deploy-Test. 

1. **Build**: In CLU, you can define your intents, entities, and utterances before you train. CLU additionally offers you the ability to specify _test data_ as you build your application to be used for model evaluation. Evaluation assesses how well your model is performing on your test data and provides you with precision, recall, and F1 metrics.
2. **Train**: You create a model with a name each time you train. You can overwrite an already trained model. You can specify either _standard_ or _advanced_ training, and determine if you would like to use your test data for evaluation, or a percentage of your training data to be left out from training and used as testing data. After training is complete, you can evaluate how well your model is doing on the outside. 
3. **Deploy**: After training is complete and you have a model with a name, it can be deployed for predictions. A deployment is also named and has an assigned model. You could have multiple deployments for the same model. A deployment can be overwritten with a different model, or you can swap models with other deployments in the project.
4. **Test**: Once deployment is complete, you can use it for predictions through the deployment endpoint. You can also test it in the studio in the Test deployment page. 

This process is in contrast to LUIS, where the application ID was attached to everything, and you deployed a version of the application in either the staging or production slots.

This will influence the DevOps processes you use.

### Does CLU have container support?

No, you cannot export CLU to containers.

### How will my LUIS applications be named in CLU after migration?

Any special characters in the LUIS application name will be removed. If the cleared name length is greater than 50 characters, the extra characters will be removed. If the name after removing special characters is empty (for example, if the LUIS application name was `@@`), the new name will be _untitled_. If there is already a conversational language understanding project with the same name, the migrated LUIS application will be appended with `_1` for the first duplicate and increase by 1 for each additional duplicate. In case the new name’s length is 50 characters and it needs to be renamed, the last 1 or 2 characters will be removed to be able to concatenate the number and still be within the 50 characters limit. 

## Migration from LUIS Q&A

If you have any questions that were unanswered in this article, consider leaving your questions at our [Microsoft Q&A thread](https://aka.ms/luis-migration-qna-thread). 

## Next steps
* [Quickstart: create a CLU project](../quickstart.md)
* [CLU language support](../language-support.md)
* [CLU FAQ](../faq.md)
