---
author: rwallerms
manager: nitinme
ms.service: azure-ai-immersive-reader
ms.topic: include
ms.date: 03/04/2021
ms.author: rwaller
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* An Immersive Reader resource configured for Microsoft Entra authentication. Follow [these instructions](../../how-to-create-immersive-reader.md) to get set up.  You will need some of the values created here when configuring the environment properties. Save the output of your session into a text file for future reference.
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

* Explore the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) and the [Immersive Reader SDK reference](../../reference.md).
* View code samples on [GitHub](https://github.com/microsoft/immersive-reader-sdk/tree/master/js/samples/).
