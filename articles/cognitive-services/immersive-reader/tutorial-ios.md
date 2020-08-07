---
title: "Tutorial: Launch the Immersive Reader using the Swift iOS code sample"
titleSuffix: Azure Cognitive Services
description: In this tutorial, you'll configure and run a sample Swift application that launches the Immersive Reader.
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

# Tutorial: Launch the Immersive Reader using the Swift iOS code sample

In the [overview](./overview.md), you learned about what the Immersive Reader is and how it implements proven techniques to improve reading comprehension for language learners, emerging readers, and students with learning differences. This tutorial covers how to create an iOS application that launches the Immersive Reader. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure and run a Swift app for iOS using a sample project
> * Acquire an access token
> * Launch the Immersive Reader with sample content

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An Immersive Reader resource configured for Azure Active Directory authentication. Follow [these instructions](./how-to-create-immersive-reader.md) to get set up. You will need some of the values created here when configuring the environment properties. Save the output of your session into a text file for future reference.
* [macOS](https://www.apple.com/macos)
* [Git](https://git-scm.com/)
* [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk)
* [Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12)

## Configure authentication credentials

1. Open Xcode and open **immersive-reader-sdk/js/samples/ios/quickstart-swift/quickstart-swift.xcodeproj**.
2. In the top menu, click on **Product > Scheme > Edit Scheme...**
3. In the **Run** view, click on the **Arguments** tab.
4. In the **Environment Variables** section, add the following names and values, supplying the values given when you created your Immersive Reader resource.

```text
TENANT_ID=<YOUR_TENANT_ID>
CLIENT_ID=<YOUR_CLIENT_ID>
CLIENT_SECRET<YOUR_CLIENT_SECRET>
SUBDOMAIN=<YOUR_SUBDOMAIN>
```

Be sure not to commit the above change into source control, as it contains secrets that should not be made public.

## Launch the Immersive Reader with sample content

1. In Xcode, press **Ctrl-R** to run the project.

## Next steps

* Explore the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) and the [Immersive Reader SDK Reference](./reference.md)
* View code samples on [GitHub](https://github.com/microsoft/immersive-reader-sdk/tree/master/js/samples/)
