---
title: "Tutorial: Launch the Immersive Reader using the Android code samples"
titleSuffix: Azure Cognitive Services
description: In this tutorial, you'll configure and run a sample Android application that launches the Immersive Reader.
services: cognitive-services
author: dylankil
manager: guillasi

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: tutorial
ms.date: 06/10/2020
ms.author: dylankil
ms.custom: devx-track-java

#Customer intent: As a developer, I want to learn more about the Immersive Reader SDK so that I can fully utilize all that the SDK has to offer.
---

# Tutorial: Start the Immersive Reader using the Android Java code sample

In the [overview](./overview.md), you learned about what the Immersive Reader is and how it implements proven techniques to improve reading comprehension for language learners, emerging readers, and students with learning differences. This tutorial covers how to create an Android application that starts the Immersive Reader. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure and run an app for Android by using a sample project.
> * Acquire an access token.
> * Start the Immersive Reader with sample content.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.

## Prerequisites

* An Immersive Reader resource configured for Azure Active Directory authentication. Follow [these instructions](./how-to-create-immersive-reader.md) to get set up. You'll need some of the values created here when you configure the environment properties. Save the output of your session into a text file for future reference.
* [Git](https://git-scm.com/).
* [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk).
* [Android Studio](https://developer.android.com/studio).

## Configure authentication credentials

1. Start Android Studio, and open the project from the **immersive-reader-sdk/js/samples/quickstart-java-android** directory (Java) or the **immersive-reader-sdk/js/samples/quickstart-kotlin** directory (Kotlin).

1. Create a file named **env** inside the **/assets** folder. Add the following names and values, and supply values as appropriate. Don't commit this file into source control because it contains secrets that shouldn't be made public.
    
    ```text
    TENANT_ID=<YOUR_TENANT_ID>
    CLIENT_ID=<YOUR_CLIENT_ID>
    CLIENT_SECRET=<YOUR_CLIENT_SECRET>
    SUBDOMAIN=<YOUR_SUBDOMAIN>
    ```

## Start the Immersive Reader with sample content

Choose a device emulator from the AVD Manager, and run the project.

## Next steps

* Explore the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) and the [Immersive Reader SDK reference](./reference.md).
* View code samples on [GitHub](https://github.com/microsoft/immersive-reader-sdk/tree/master/js/samples/).