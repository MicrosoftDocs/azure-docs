---
title: How to use authoring and runtime keys with LUIS
titleSuffix: Azure Cognitive Services
description: LUIS uses two keys, the authoring key to create your model and the runtime key for querying the prediction endpoint with user utterances.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 10/25/2019
ms.author: diberry
---

# Authoring and runtime keys

Language Understanding (LUIS) has two services and API sets:

* Authoring (previously known as _programmatic_)
* Prediction runtime

There are several key types, depending on what service you want to work with and how you want to work with it.

## Non-Azure resources for LUIS

### Starter key

When you first start using LUIS, a **starter key** is created for you. This resource provides:

* free authoring service requests through the LUIS portal or APIs (including SDKs)
* free 1,000 prediction endpoint requests per month through a browser, API, or SDKs

## Azure resources for LUIS

<a name="programmatic-key" ></a>
<a name="endpoint-key"></a>
<a name="authoring-key"></a>

LUIS allows three types of Azure resources:

|Key|Purpose|Cognitive service `kind`|Cognitive service `type`|
|--|--|--|--|
|[Authoring key](#programmatic-key)|Access and manage data of application with authoring, training, publishing, and testing. Create a LUIS authoring key if you intend to programmatically author LUIS apps.<br><br>The purpose of the `LUIS.Authoring` key is to allow you to:<br>* programmatically manage Language Understanding apps and models, including training, and publishing<br> * control permissions to the authoring resource by assigning people to [the contributor role](#contributions-from-other-authors).|`LUIS.Authoring`|`Cognitive Services`|
|[Prediction key](#prediction-endpoint-runtime-key)| Query prediction endpoint requests. Create a LUIS prediction key before your client app requests predictions beyond the 1,000 requests provided by the starter resource. |`LUIS`|`Cognitive Services`|
|[Cognitive Service multi-service resource key](../cognitive-services-apis-create-account-cli.md?tabs=windows#create-a-cognitive-services-resource)|Query prediction endpoint requests shared with LUIS and other supported Cognitive Services.|`CognitiveServices`|`Cognitive Services`|

When the resource creation process is finished, [assign the key](luis-how-to-azure-subscription.md) to the app in the LUIS portal.

It is important to author LUIS apps in [regions](luis-reference-regions.md#publishing-regions) where you want to publish and query.

> [!CAUTION]
> For convenience, many of the samples use the [Starter key](#starter-key) because it provides a few free prediction endpoint calls in its [quota](luis-limits.md#key-limits).


### Query prediction resources

* The runtime key can be used for all your LUIS apps or for specific LUIS apps.
* Do not use the runtime key for authoring LUIS apps.

The LUIS runtime endpoint accepts two styles of query, both use the prediction endpoint runtime key, but in different places.

The endpoint used to access the runtime uses a subdomain that is unique to your resource's region, denoted with `{region}` in the following table.

## Assignment of the key

You can [assign](luis-how-to-azure-subscription.md) the runtime key in the [LUIS portal](https://www.luis.ai) or via the corresponding APIs.

## Key limits

You can create up to 10 authoring keys per region per subscription.

See [Key Limits](luis-limits.md#key-limits) and [Azure regions](luis-reference-regions.md).

Publishing regions are different from authoring regions. Make sure you create an app in the authoring region corresponding to the publishing region you want your client application to be located.

## Key limit errors
If you exceed your transactions-per-second (TPS) quota, you receive an HTTP 429 error. If you exceed your transaction-per-month (TPS) quota, you receive an HTTP 403 error.

## Contributions from other authors

**For [authoring resource migrated](luis-migration-authoring.md) apps**: _contributors_ are managed in the Azure portal for the authoring resource, using the **Access control (IAM)** page. Learn [how to add a user](luis-how-to-collaborate.md), using the collaborator's email address and the _contributor_ role.

**For apps that have not migrated yet**: all _collaborators_ are managed in the LUIS portal from the **Manage -> Collaborators** page.

## Move, transfer, or change ownership

An app is defined by its Azure resources, which is determined by the owner's subscription.

You can move your LUIS app. Use the following documentation resources in the Azure portal or Azure CLI:

* [Move app between LUIS authoring resources](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/apps-move-app-to-another-luis-authoring-azure-resource)
* [Move resource to new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)
* [Move resource within same subscription or across subscriptions](../../azure-resource-manager/management/move-limitations/app-service-move-limitations.md)

To transfer [ownership](../../cost-management-billing/manage/billing-subscription-transfer.md) of your subscription:

**For users who have migrated - [authoring resource migrated](luis-migration-authoring.md) apps**: As the owner of the resource, you can add a `contributor`.

**For users who have not migrated yet**: Export your app as a JSON file. Another LUIS user can import the app, thereby becoming the app owner. The new app will have a different app ID.

## Access for private and public apps

For a **private** app, runtime access is available for owners and contributors. For a **public** app, runtime access is available to everyone that has their own Azure [Cognitive Service](../cognitive-services-apis-create-account.md) or [LUIS](luis-how-to-azure-subscription.md#create-resources-in-the-azure-portal) runtime resource, and has the public app's ID.

Currently, there isn't a catalog of public apps.

### Authoring access
Access to the app from the [LUIS](luis-reference-regions.md#luis-website) portal or the [authoring APIs](https://go.microsoft.com/fwlink/?linkid=2092087) is controlled by the Azure authoring resource.

The owner and all contributors have access to author the app.

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

<a name="prediction-endpoint-runtime-key"></a>

### Prediction endpoint runtime access

Access to query the prediction endpoint is controlled by a setting on the **Application Information** page in the **Manage** section.

|[Private endpoint](#runtime-security-for-private-apps)|[Public endpoint](#runtime-security-for-public-apps)|
|:--|:--|
|Available to owner and contributors|Available to owner, contributors, and anyone else that knows app ID|

You can control who sees your LUIS runtime key by calling it in a server-to-server environment. If you are using LUIS from a bot, the connection between the bot and LUIS is already secure. If you are calling the LUIS endpoint directly, you should create a server-side API (such as an Azure [function](https://azure.microsoft.com/services/functions/)) with controlled access (such as [AAD](https://azure.microsoft.com/services/active-directory/)). When the server-side API is called and authenticated and authorization is verified, pass the call on to LUIS. While this strategy doesn’t prevent man-in-the-middle attacks, it obfuscates your key and endpoint URL from your users, allows you to track access, and allows you to add endpoint response logging (such as [Application Insights](https://azure.microsoft.com/services/application-insights/)).

#### Runtime security for private apps

A private app's runtime is only available to the following:

|Key and user|Explanation|
|--|--|
|Owner's authoring key| Up to 1000 endpoint hits|
|Collaborator/contributor authoring keys| Up to 1000 endpoint hits|
|Any key assigned to LUIS by an author or collaborator/contributor|Based on key usage tier|

#### Runtime security for public apps

Once an app is configured as public, _any_ valid LUIS authoring key or LUIS endpoint key can query your app, as long as the key has not used the entire endpoint quota.

A user who is not an owner or contributor, can only access a public app's runtime if given the app ID. LUIS doesn't have a public _market_ or other way to search for a public app.

A public app is published in all regions so that a user with a region-based LUIS resource key can access the app in whichever region is associated with the resource key.

## Transfer of ownership

LUIS doesn't have the concept of transferring ownership of a resource.

## Securing the endpoint

You can control who can see your LUIS prediction runtime endpoint key by calling it in a server-to-server environment. If you are using LUIS from a bot, the connection between the bot and LUIS is already secure. If you are calling the LUIS endpoint directly, you should create a server-side API (such as an Azure [function](https://azure.microsoft.com/services/functions/)) with controlled access (such as [AAD](https://azure.microsoft.com/services/active-directory/)). When the server-side API is called and authentication and authorization are verified, pass the call on to LUIS. While this strategy doesn’t prevent man-in-the-middle attacks, it obfuscates your endpoint from your users, allows you to track access, and allows you to add endpoint response logging (such as [Application Insights](https://azure.microsoft.com/services/application-insights/)).

## Next steps

* Understand [versioning](luis-concept-version.md) concepts.
* Learn [how to create keys](luis-how-to-azure-subscription.md).
