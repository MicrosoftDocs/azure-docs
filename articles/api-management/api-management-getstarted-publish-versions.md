---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Publish versions of your API using Azure API Management | Microsoft Docs
description: Follow the steps of this tutorial to learn how to publish multiple versions in API Management.
services: api-management
documentationcenter: ''
author: mattfarm
manager: anneta
editor: ''

ms.service: api-management
ms.workload: integration
ms.topic: article
ms.date: 08/18/2017
ms.author: apimpm
---

# Publish multiple versions of your API in a predictable way
In the previous steps of this getting started guide, we have added an API to our API Management service and applied multiple policies to the API. This tutorial describes how to set up versions of your API, and choose the way in which they are called by API developers.

## Prerequisites
To complete this tutorial, you will need to have created an API Management Service, and have either followed the previous tutorial articles, or have existing API you can alter (in place of Conference API).

## About versions
Sometimes it is impractical to have all callers to your API use exactly the same version. Sometimes you will want to publish new or different API features to some users, while others will want to stick they API that currently works for them. When callers want to upgrade to a later version, they want to be able to do this using an easy to understand approach.  We can do this using **versions** in Azure API Management.

## Walkthrough
In this walkthrough We will add a new version to an existing API, choosing a versioning scheme and identifier.

## Add a new revision
1. Browse to the **APIs** page within your API Management service in the Azure portal.
2. Select **Conference API** from the API list, then select the context menu (**...**) next to it.
3. Select **+ Add Version**.

    > [!TIP]
    > Versions can also be enabled when you first create a new API - select **Version this API?** on the **Add API** screen.

## Choose a versioning scheme
Azure API Management allows you to choose the way in which you will allow callers to specify which version of your API they want. You do this by choosing a **versioning scheme**. This scheme can be either **path, header or query string**. In our example, we will use path.

1. Leave **path** selected as your **versioning scheme**.
2. Add **v1** as your **version identifier**.

    > [!TIP]
    > If you select **header** or **query string** as a versioning scheme, you will need to provide an additional value - the name of the header or query string parameter.

3. Provide a description if you wish.
4. Select **Create** to set up your new version.
5. Underneath **Big Conference API** in the API List, you will now see two distinct APIs - **Original**, and **v1**. 

    > [!TIP]
    > If you add a version to a non-versioned API, we always create an **Original** for you - responding on the default URL. This is to ensure that any exisitng callers are not broken by the process of adding a version. If you create a new API with versions enabled at the start, an Original is not created.

## Add the version to a product
For callers to see your new version, it must be added to a **product** (products are not inherited from parent versions).

1. Select **Products** from the service management page.
2. Select **Unlimited**.
3. Select **APIs**.
4. Select **Add**.
5. Select **Conference API, Version V1**.
6. Return to the the service management page and select **APIs**.

## Browse the developer portal to see the version
1. Select **Developer Portal** from the top menu.
2. Select **APIs**, notice that **Conference API** shows **Original** and **v1** versions.
3. Select **v1**.
4. Notice the **Request URL** of the first operation in the list. It shows that the API URL path include **v1**.

## Next steps
[Monitor a published API](#api-management-getstarted-publish-versions.md)