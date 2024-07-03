---
author: sharmas
manager: nitinme
ms.service: azure-ai-immersive-reader
ms.topic: include
ms.date: 02/21/2024
ms.author: sharmas
---

## Prerequisites

* An Azure subscription. You can [create one for free](https://azure.microsoft.com/free/ai-services).
* An Immersive Reader resource configured for Microsoft Entra authentication. Follow [these instructions](../../how-to-create-immersive-reader.md) to get set up. Save the output of your session into a text file so you can configure the environment properties.
* [macOS](https://www.apple.com/macos) and [Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12).
* [Git](https://git-scm.com).
* Clone the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) from GitHub.

## Configure authentication credentials

1. In Xcode, select **Open Existing Project**. Open the file *immersive-reader-sdk/js/samples/ios/quickstart-swift.xcodeproj*.
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

In Xcode, select a device simulator, then run the project from the controls or enter **Ctrl+R**.

## Next step

> [!div class="nextstepaction"]
> [Explore the Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk)
