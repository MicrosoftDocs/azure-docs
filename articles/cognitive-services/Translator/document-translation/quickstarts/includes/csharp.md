---
title: "Quickstart: Document Translation C#"
description: 'Document translation processing using the REST API and C# programming language'
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: include
ms.date: 12/08/2022
ms.author: lajanuar
recommendations: false
---

For this quickstart, we'll use the latest version of [Visual Studio](https://visualstudio.microsoft.com/vs/) IDE to build and run the application.

1. Start Visual Studio.

1. On the **Get started** page, choose Create a new project.

    :::image type="content" source="../../media/visual-studio/get-started.png" alt-text="Screenshot of Visual Studio 2022 get started window.":::

1. On the **Create a new project page**, enter **console** in the search box. Choose the **Console Application** template, then choose **Next**.

     :::image type="content" source="../../media/visual-studio/create-project.png" alt-text="Screenshot of Visual Studio 2022 create new project page.":::

1. In the **Configure your new project** dialog window, enter `document-translation-qs` in the Project name box. Then choose Next.

    :::image type="content" source="../../media/visual-studio/configure-new-project.png" alt-text="Screenshot of Visual Studio 2022 configure new project set-up window.":::

1. In the **Additional information** dialog window, select **.NET 6.0 (Long-term support)**, and then select **Create**.

    :::image type="content" source="../../media/visual-studio/additional-information.png" alt-text="Screenshot of Visual Studio 2022 additional information set-up window.":::

## Install Newtonsoft.Json

1. Right-click on your **document-translation-qs** project and select **Manage NuGet Packages...** .

    :::image type="content" source="../../media/visual-studio/manage-nuget-packages.png" alt-text="Screenshot of select NuGet package window in Visual Studio.":::

1. Select the Browse tab and type **NewtonsoftJson**.

     :::image type="content" source="../../media/visual-studio/get-newtonsoft-json.png" alt-text="Screenshot of select pre-release NuGet package in Visual Studio.":::

1. Select the latest stable version from the dropdown menu and install the package in your project.

    :::image type="content" source="../../media/visual-studio/install-nuget-package.png" alt-text="Screenshot of install selected nuget package window":::

## Translate all documents in a container
