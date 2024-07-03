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
* [Git](https://git-scm.com).
* Clone the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) from GitHub.
* [Android Studio](https://developer.android.com/studio).

## Configure authentication credentials

1. Start Android Studio, and open the Immersive Reader SDK project from the *immersive-reader-sdk/js/samples/quickstart-java-android* directory (Java) or the *immersive-reader-sdk/js/samples/quickstart-kotlin* directory (Kotlin).

    > [!TIP]
    > You might need to let the system update the Gradle plugins to at least version 8.

1. To create a new assets folder, right-click on **app** and select **Folder** -> **Assets Folder** from the dropdown.

    :::image type="content" source="../../media/how-tos/android-studio-assets-folder.png" alt-text="Screenshot of the Assets folder option.":::

1. Right-click on **assets** and select **New** -> **File**. Name the file **env**.

    :::image type="content" source="../../media/how-tos/android-studio-create-env-file.png" alt-text="Screenshot of name input field to create the env file.":::

1. Add the following names and values, and supply values as appropriate. Don't commit this file into source control because it contains secrets that shouldn't be made public.
    
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
