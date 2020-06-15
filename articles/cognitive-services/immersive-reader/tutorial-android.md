---
title: "Tutorial: Launch the Immersive Reader using the Android code samples"
titleSuffix: Azure Cognitive Services
description: In this tutorial, you'll configure and run a sample Android application that launches the Immersive Reader.
services: cognitive-services
author: dylankil
manager: nitinme

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: tutorial
ms.date: 06/10/2020
ms.author: dylankil
#Customer intent: As a developer, I want to learn more about the Immersive Reader SDK so that I can fully utilize all that the SDK has to offer.
---

# Tutorial: Launch the Immersive Reader using the Android Java code sample

In the [overview](./overview.md), you learned about what the Immersive Reader is and how it implements proven techniques to improve reading comprehension for language learners, emerging readers, and students with learning differences. This tutorial covers how to create an Android application that launches the Immersive Reader. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure and run an app for Android using a sample project
> * Acquire an access token
> * Launch the Immersive Reader with sample content

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An Immersive Reader resource configured for Azure Active Directory authentication. Follow [these instructions](./how-to-create-immersive-reader.md) to get set up. You will need some of the values created here when configuring the environment properties. Save the output of your session into a text file for future reference.
* [Git](https://git-scm.com/)
* [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk)
* [Android Studio](https://developer.android.com/studio)

## Configure authentication credentials

1. Launch Android Studio and open the project from the **immersive-reader-sdk/js/samples/quickstart-java-android** directory (Java) or **immersive-reader-sdk/js/samples/quickstart-kotlin** directory (Kotlin).

2. Create a file named **env** to the **/assets** folder and add the following, supplying values as appropriate. Be sure not to commit this file into source control, as it contains secrets that should not be made public.

```text
TENANT_ID=<YOUR_TENANT_ID>
CLIENT_ID=<YOUR_CLIENT_ID>
CLIENT_SECRET=<YOUR_CLIENT_SECRET>
SUBDOMAIN=<YOUR_SUBDOMAIN>
```

## Launch the Immersive Reader with sample content

1. Choose a device emulator from the AVD Manager and run the project.

## Next steps

* Explore the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) and the [Immersive Reader SDK Reference](./reference.md)
* View code samples on [GitHub](https://github.com/microsoft/immersive-reader-sdk/tree/master/js/samples/)