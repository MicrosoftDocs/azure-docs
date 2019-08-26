---
title: Authoring and Runtime keys - LUIS
titleSuffix: Azure Cognitive Services
description: LUIS uses two keys, the authoring key to create your model and the runtime key for querying the prediction endpoint with user utterances.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 09/02/2019
ms.author: diberry
---

# Authoring and runtime keys


>[!NOTE]
>Please [migrate](luis-migration-authoring.md) any apps, which don't use Azure authoring resource, before continuing.

LUIS uses two Azure resources, each resource has an access key: 
 
* [Authoring](#programmatic-key) to create intents, entities, and label utterances, train, and publish. When you are ready to publish your LUIS app, you need a [runtime key](luis-how-to-azure-subscription.md) assigned to the app.
* [Runtime](#runtime-key-for-query-predictions-of-user-utterances). Client-applications, such as a chat bot, need access to the runtime's **query prediction endpoint** through this key. 

|Key|Purpose|Cognitive service `kind`|Cognitive service `type`|
|--|--|--|--|
|[Authoring key](#programmatic-key)|Authoring, training, publishing, testing.|`LUIS.Authoring`|`Cognitive Services`|
|[Runtime key](#runtime-key-for-query-predictions-of-user-utterances)| Querying with a user utterance to determine intents and entities.|`LUIS`|`Cognitive Services`|

While you don't need to create both keys at the time, it is much easier if you do.

It is important to author LUIS apps in [regions](luis-reference-regions.md#publishing-regions) where you want to publish and query.

<a name="programmatic-key" ></a>

## Authoring key

An authoring key, also known as a starter key, is created automatically when you create a LUIS account and it is free. You have one authoring key across all your LUIS apps for each authoring [region](luis-reference-regions.md). The authoring key is provided to author your LUIS app or to test endpoint queries. To test endpoint queries with the authoring key, you can use up to 1,000 transactions a month. 

To find the authoring Key, sign in to [LUIS](luis-reference-regions.md#luis-website) and click on the account name in the upper-right navigation bar to open **Account Settings**.

![authoring Key](./media/luis-concept-keys/authoring-key.png)

When you want to make **runtime queries**, create the Azure [LUIS resource](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/). 

> [!CAUTION]
> For convenience, many of the samples use the authoring key because it provides a few endpoint calls in its [quota](luis-boundaries.md#key-limits).  

<a name="endpoint-key"></a>

## Runtime key 

When you need **runtime endpoint queries**, create a Language Understanding (LUIS) runtime resource, then assign it to the LUIS app. 

[!INCLUDE [Azure runtime resource creation for Language Understanding and Cognitive Service resources](../../../includes/cognitive-services-luis-azure-resource-instructions.md)]

When the Azure runtime resource creation process is finished, [assign the key](luis-how-to-azure-subscription.md) to the app. 

* The runtime (query prediction endpoint) key allows a quota of endpoint hits based on the usage plan you specified when creating the runtime key. See [Cognitive Services Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/?v=17.23h) for pricing information.

* The runtime key can be used for all your LUIS apps or for specific LUIS apps. 

* Do not use the runtime key for authoring LUIS apps. 

<a name="use-endpoint-key-in-query"></a>

### Use runtime key in query
The LUIS runtime endpoint accepts two styles of query, both use the runtime key, but in different places.

The endpoint used to access the runtime uses a subdomain that is unique to your resource's region, denoted with `{region}` in the following table. 


|Verb|Example url and key location|
|--|--|
|[GET](https://{region}.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78)|`https://{region}.api.cognitive.microsoft.com/luis/v2.0/apps/df67dcdb-c37d-46af-88e1-8b97951ca1c2?runtime-key=your-endpoint-key-here&verbose=true&timezoneOffset=0&q=turn%20on%20the%20lights`<br><br>query string value for `runtime-key`<br><br>Change your endpoint query value for the `runtime-key` from the authoring (starter) key, to the new endpoint key in order to use the LUIS endpoint key quota rate. If you create the key, and assign the key but do not change the endpoint query value for `runtime-key`, you are not using your endpoint key quota.|
|[POST](https://{region}.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee79)| `https://{region}.api.cognitive.microsoft.com/luis/v2.0/apps/df67dcdb-c37d-46af-88e1-8b97951ca1c2`<br><br> header value for `Ocp-Apim-Subscription-Key`<br>If you create the runtime key, and assign the runtime key but do not change the endpoint query value for `Ocp-Apim-Subscription-Key`, you are not using your runtime key.|

The app ID used in the previous URLs, `df67dcdb-c37d-46af-88e1-8b97951ca1c2`, is the public IoT app used for the [interactive demonstration](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/). 

## Assignment of the runtime key

You can [assign](luis-how-to-azure-subscription.md) the runtime key in the [LUIS portal](https://www.luis.ai) or via the corresponding APIs. 

## API usage of Ocp-Apim-Subscription-Key

The LUIS APIs use the HTTP header, `Ocp-Apim-Subscription-Key`. The header name does not change but the value of the key does. If you are accessing runtime APIs to get a query prediction of a user utterance, use the runtime endpoint and key value. All other APIs use the authoring key endpoint and key value.

The API will return a `401` error (access denied) if you using the incorrect key.

## Key limits
See [Key Limits](luis-boundaries.md#key-limits) and [Azure regions](luis-reference-regions.md). 

Publishing regions are different from authoring regions. Make sure you create an app in the authoring region corresponding to the publishing region you want your client application to be located.

## Key limit errors
If you exceed your transactions-per-second (TPS) quota, you receive an HTTP 429 error. If you exceed your transaction-per-month (TPS) quota, you receive an HTTP 403 error. 

## Collaborating with other authors

**For [authoring resource migrated](luis-migration-authoring.md) apps**: collaboration in managed in the Azure portal for the authoring resource, using the **Access control (IAM)** page. Add a user, using the collaborator's email address and the _contributor_ role. 

**For apps that have not migrated yet**: all collaborators are managed in the LUIS portal from the **Manage -> Collaborators** page.

### Collaborator roles vs entity roles

[Entity roles](luis-concept-roles.md) apply to the data model of the LUIS app. Collaborator roles apply to levels of authoring access. 

### Managing multiple authors

All users that author a LUIS app, need to be added to ROLENAME role on the resource. This is [completed](luis-how-to-collaborate.md) from the Azure portal.

## Moving or changing ownership

An app is defined by its Azure resources, which is determined by the owner's subscription. 

You can move your LUIS app. Use the following documentation resources in the Azure portal or Azure CLI:

* [Move app between LUIS authoring resources](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/apps-move-app-to-another-luis-authoring-azure-resource)
* [Move resource to new resource group or subscription](../../azure-resource-manager/resource-group-move-resources.md)
* [Move resource within same subscription or across subscriptions](../../azure-resource-manager/move-limitations/app-service-move-limitations.md)
* [Transfer ownership](../../billing/billing-subscription-transfer.md) of your subscription 


## Access for private and public apps

For a **private** app, runtime access is available for owners and collaborators. For a **public** app, runtime access is available to everyone that has their own Azure [Cognitive Service](../cognitive-services-apis-create-account.md) or [LUIS](luis-how-to-azure-subscription.md#create-prediction-endpoint-runtime-resource-in-the-azure-portal) resource, and has the public app's ID. 

Currently, there isn't a catalog of public apps.

### Authoring access
Access to the app from the [LUIS](luis-reference-regions.md#luis-website) portal or the [authoring APIs](https://go.microsoft.com/fwlink/?linkid=2092087) is controlled by the Azure auhoring resource. 

The owner and all collaborators have access to author the app. 

|Authoring access includes|Notes|
|--|--|
|Add or remove endpoint keys||
|Exporting version||
|Export endpoint logs||
|Importing version||
|Make app public|When an app is public, anyone with an authoring or endpoint key can query the app.|
|Modify model|
|Publish|
|Review endpoint utterances for [active learning](luis-how-to-review-endpoint-utterances.md)|
|Train|

### Runtime access

Access to query the endpoint is controlled by a setting on the **Application Information** page in the **Manage** section. 

![Set app to public](./media/luis-concept-security/set-application-as-public.png)

|[Private endpoint](#private-app-endpoint-security)|[Public endpoint](#public-app-endpoint-access)|
|:--|:--|
|Available to owner and collaborators|Available to owner, collaborators, and anyone else that knows app ID|

You can control who sees your LUIS runtime key by calling it in a server-to-server environment. If you are using LUIS from a bot, the connection between the bot and LUIS is already secure. If you are calling the LUIS endpoint directly, you should create a server-side API (such as an Azure [function](https://azure.microsoft.com/services/functions/)) with controlled access (such as [AAD](https://azure.microsoft.com/services/active-directory/)). When the server-side API is called and authenticated and authorization is verified, pass the call on to LUIS. While this strategy doesn’t prevent man-in-the-middle attacks, it obfuscates your key and endpoint URL from your users, allows you to track access, and allows you to add endpoint response logging (such as [Application Insights](https://azure.microsoft.com/services/application-insights/)).

#### Runtime security for private apps

A private app's runtime is only available to the following:

|Key and user|Explanation|
|--|--|
|Owner's authoring key| Up to 1000 endpoint hits|
|Collaborators' authoring keys| Up to 1000 endpoint hits|
|Any key assigned to LUIS by an author or collaborator|Based on key usage tier|

##### Microsoft user accounts

Authors and collaborators can assign keys to a private LUIS app. The Microsoft user account that creates the LUIS key in the Azure portal needs to be either the app owner or an app collaborator. You can't assign a key to a private app from another Azure account.

See [Azure Active Directory tenant user](luis-how-to-collaborate.md#azure-active-directory-tenant-user) to learn more about Active Directory user accounts. 

#### Runtime security for public apps

Once an app is configured as public, _any_ valid LUIS authoring key or LUIS endpoint key can query your app, as long as the key has not used the entire endpoint quota.

A user who is not an owner or collaborator, can only access a public app's runtime if given the app ID. LUIS doesn't have a public _market_ or other way to search for a public app.  

A public app is published in all regions so that a user with a region-based LUIS resource key can access the app in whichever region is associated with the resource key.

## Next steps

* Understand [versioning](luis-concept-version.md) concepts. 
