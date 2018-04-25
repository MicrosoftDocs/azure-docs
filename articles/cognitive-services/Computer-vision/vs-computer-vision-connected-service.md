---
title: Computer Vision C# tutorial | Microsoft Docs
titleSuffix: "Microsoft Cognitive Services"
description: Connect to Cognitive Services Computer Vision from an ASP.NET Core web application.
services: cognitive-services
author: ghogen
manager: douge
ms.service: cognitive-services
ms.component: computer-vision
ms.topic: conceptual
ms.date: 03/01/2018
ms.author: ghogen
---
# Connecting to Cognitive Services Computer Vision API by using Connected Services in Visual Studio

By using the Cognitive Services Computer Vision API, you can detect, analyze, organize, and tag faces in photos.

This article and its companion articles provide details for using the Visual Studio Connected Service feature for Cognitive Services Computer Vision API. The capability is available in both Visual Studio 2017 15.7 or later, with the Cognitive Services extension installed.

## Prerequisites

- **An Azure subscription**. If you do not have one, you can sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
- **Visual Studio 2017 version 15.7** with the **Web Development** workload installed. [Download it now](https://aka.ms/vsdownload).
- An ASP.NET Core web project open.
- The Cognitive Services VSIX extension installed. [Install it now](broken-link-placeholder.md).

[!INCLUDE [vs-install-cognitive-services-vsix](../includes/vs-install-cognitive-services-vsix.md)]

## Add support to your project for Cognitive Services Computer Vision API

1. In **Solution Explorer**, choose **Add** > **Connected Service**.
   The Connected Service page appears with services you can add to your project.

   ![Add Connected Service menu item](../media/vs-common/Connected-Service-Menu.PNG)

1. In the menu of available services, choose **Cognitive Services Computer Vision API**.

   ![Choose the service to connect to](./media/vs-face-connected-service/Cog-Vision-Connected-Service-0.PNG)

   If you've signed into Visual Studio, and have an Azure subscription associated with your account, a page appears with a dropdown list with your subscriptions.

   ![Select your subscription](media/vs-face-connected-service/Cog-Vision-Connected-Service-1.PNG)

1. Select the subscription you want to use, and then choose a name for the Face API, or choose the Edit link to modify the automatically generated name, choose the resource group, and the Pricing Tier.

   ![Edit connected service details](media/vs-face-connected-service/Cog-Vision-Connected-Service-2.PNG)

   Follow the link for details on the pricing tiers.

1. Choose Add to add supported for the Connected Service.
   Visual Studio modifies your project to add the NuGet packages, configuration file entries, and other changes to support a connection the Computer Vision API.

## Clean up resources

When no longer needed, delete the resource group. This deletes the cognitive service and related resources. To delete the resource group through the portal:

1. Enter the name of your resource group in the Search box at the top of the portal. When you see the resource group used in this QuickStart in the search results, select it.
2. Select **Delete resource group**.
3. In the **TYPE THE RESOURCE GROUP NAME:** box type in the name of the resource group and select **Delete**.

## Next steps

Learn more about the Computer Vision API by reading the [Computer Vision API Documentation](index.md).
