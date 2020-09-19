---
title: "Tutorial: Start the Immersive Reader using the Swift iOS code sample"
titleSuffix: Azure Cognitive Services
description: In this tutorial, you'll configure and run a sample Swift application that starts the Immersive Reader.
services: cognitive-services
author: dylankil
manager: guillasi

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: tutorial
ms.date: 06/10/2020
ms.author: dylankil
#Customer intent: As a developer, I want to learn more about the Immersive Reader SDK so that I can fully utilize all that the SDK has to offer.
---

# Tutorial: Start the Immersive Reader using the Swift iOS code sample

In the [overview](./overview.md), you learned about what the Immersive Reader is and how it implements proven techniques to improve reading comprehension for language learners, emerging readers, and students with learning differences. This tutorial covers how to create an iOS application that starts the Immersive Reader. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure and run a Swift app for iOS by using a sample project.
> * Acquire an access token.
> * Start the Immersive Reader with sample content.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.

## Prerequisites

* An Immersive Reader resource configured for Azure Active Directory authentication. Follow [these instructions](./how-to-create-immersive-reader.md) to get set up. You'll need some of the values created here when you configure the environment properties. Save the output of your session into a text file for future reference.
* [macOS](https://www.apple.com/macos).
* [Git](https://git-scm.com/).
* [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk).
* [Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12).

## Configure authentication credentials

1. Open Xcode, and open **immersive-reader-sdk/js/samples/ios/quickstart-swift/quickstart-swift.xcodeproj**.
1. On the top menu, select **Product** > **Scheme** > **Edit Scheme**.
1. In the **Run** view, select the **Arguments** tab.
1. In the **Environment Variables** section, add the following names and values. Supply the values given when you created your Immersive Reader resource.

    ```text
    TENANT_ID=<YOUR_TENANT_ID>
    CLIENT_ID=<YOUR_CLIENT_ID>
    CLIENT_SECRET<YOUR_CLIENT_SECRET>
    SUBDOMAIN=<YOUR_SUBDOMAIN>
    ```

Don't commit this change into source control because it contains secrets that shouldn't be made public.

## Start the Immersive Reader with sample content

In Xcode, select **Ctrl+R** to run the project.

## Next steps

* Explore the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) and the [Immersive Reader SDK reference](./reference.md).
* View code samples on [GitHub](https://github.com/microsoft/immersive-reader-sdk/tree/master/js/samples/).
