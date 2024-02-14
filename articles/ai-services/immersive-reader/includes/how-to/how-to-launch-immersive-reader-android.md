---
author: rwallerms
manager: nitinme
ms.service: azure-ai-immersive-reader
ms.topic: include
ms.date: 02/14/2024
ms.author: rwaller
---

## Prerequisites

* An Azure subscription. You can [create one for free](https://azure.microsoft.com/free/ai-services).
* An Immersive Reader resource configured for Microsoft Entra authentication. Follow [these instructions](../../how-to-create-immersive-reader.md) to get set up. Save the output of your session into a text file so you can configure the environment properties.
* [Git](https://git-scm.com).
* [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk).
* [Android Studio](https://developer.android.com/studio).

## Configure authentication credentials

1. Start Android Studio, and open the project from the *immersive-reader-sdk/js/samples/quickstart-java-android* directory (Java) or the *immersive-reader-sdk/js/samples/quickstart-kotlin* directory (Kotlin).

1. Create a file named *.env* inside the **/assets** folder. Add the following names and values, and supply values as appropriate. Don't commit this file into source control because it contains secrets that shouldn't be made public.
    
    ```text
    TENANT_ID=<YOUR_TENANT_ID>
    CLIENT_ID=<YOUR_CLIENT_ID>
    CLIENT_SECRET=<YOUR_CLIENT_SECRET>
    SUBDOMAIN=<YOUR_SUBDOMAIN>
    ```

## Start the Immersive Reader with sample content

Choose a device emulator from the AVD Manager, and run the project.

## Next steps

> [!div class="nextstepaction"]
> [Explore the Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk)
