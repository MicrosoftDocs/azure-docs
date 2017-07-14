---
title: Register your app with Azure Custom Decision Service | Microsoft Docs
description: A step-by-step guide for how to register a new app with Azure Custom Decision Service
services: cognitive-services
author: slivkins
manager: slivkins

ms.service: cognitive-services
ms.topic: article
ms.date: 06/02/2017
ms.author: slivkins;marcozo;alekh
---

# Register your app with Custom Decision Service

To use Custom Decision Service for your application, register it on the portal. This article explains how.

1. Go to the [front page](https://ds.microsoft.com/) of Custom Decision Service. On the ribbon, click **My Portal**, as highlighted in the image:

    ![Custom Decision Service home page](./media/custom-decision-service-get-started-app/home.png)

    If you are not already signed in, the portal prompts you to sign in with your [Microsoft account](https://account.microsoft.com/account). After you have signed in, the portal displays your Microsoft account in the upper-right corner of the page.

2. To register your application, click the **New App** button. In this example, you register an application in the **pooled learning mode** as described in the [overview](custom-decision-service-overview.md#pooled-learning-mode).

3. In the dialog box, choose an identifier for your application. Custom Decision Service requires a unique ID for each application. If someone else has already taken this ID, the system asks you to pick a different ID.

    ![Custom Decision Service portal](./media/custom-decision-service-get-started-app/portal.png)

4. Specify an Action Set API. This setting is an RSS or Atom feed that communicates the available content for your application to Custom Decision Service. Enter a name for the feed, and enter the URL from which it is served. To do this step later, click the **Feeds** button and then click the **New feed** button. An example that creates an RSS feed is described later.

5. To register your application in the [application-specific learning mode](custom-decision-service-overview.md#application-specific-learning-mode), select the **Custom App** check box in the lower-left corner. Enter a [connection string](../../storage/storage-configure-connection-string.md) for the Azure storage account where your application data is logged. For more information on how to create a storage account, see [How to create, manage, or delete a storage account](../../storage/storage-create-storage-account.md).

### Next steps

* Get started to optimize [a webpage](custom-decision-service-get-started-browser.md) or [a smartphone app](custom-decision-service-get-started-app.md).
* Work through a [tutorial](custom-decision-service-tutorial.md) for a more in-depth example.
* Consult the [API reference](custom-decision-service-api-reference.md) to learn more about the provided functionality.