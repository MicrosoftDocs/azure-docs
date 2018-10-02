---
title: Azure Digital Twins facilities app tutorial | Microsoft Docs
description: Azure Digital Twins facilities app tutorial
author: adamgerard
manager: alinast
ms.service: azure-digital-twins
services: azure-digital-twins
ms.topic: tutorial
ms.date: 09/21/2018
ms.author: adgera
---

# Facilities app tutorial

IoT apps often connect buildings, devices, data, and sensors. This tutorial demonstrates a full building management app with smart notification and data processing.

## Create a Digital Twins instance in Azure Portal

1. Sign in to the [Azure portal](http://portal.azure.com).

1. Select **Create a resource** > **Internet of Things** > **Digital Twins** (or search by **Digital Twins**).

    ![Select to install Digital Twins][1]

1. In the **Digital Twins** pane, enter the following information for your Digital Twins:

   * **Subscription**: Choose the subscription that you want to use to create this Digital Twins instance.
   * **Resource group**: Select or create a resource group for the Digital Twins instance. For more information on resource groups, see [Use resource groups to manage your Azure resources][lnk-resource-groups].
   * **Location**: Select the closest location to your devices.
   * **Name**: Create a unique name for your Digital Twins. If the name you enter is available, a green check mark appears.

   ![Create Digital Twins][2]

1. Review your Digital Twins information, then click **Create**. Your Digital Twins might take a few minutes to create. You can monitor the progress in the **Notifications** pane.

1. Digital Twins provides a collection of REST APIs for management and interaction with your graph. These APIs are called Management APIs.

The URL is generated in the **Overview** section and has the following format: `https://[yourDigitalTwinsName].[yourLocation].azuresmartspaces.net/management/swagger`.

You will need this URL in the proceeding steps.

## Grant permissions to the console applications to interact with Digital Twins Management APIs

[!INCLUDE [digital-twins-permissions](../../includes/digital-twins-permissions.md)]

### Next steps

See a quick sample:

> [!div class="nextstepaction"]
> [C# code samples](https://github.com/Azure-Samples/digital-twins-samples-csharp)

<!-- Images -->
[1]: media/quickstart-view-occupancy-dotnet/create-digital-twins-portal.png
[2]: media/quickstart-view-occupancy-dotnet/create-digital-twins-param.png