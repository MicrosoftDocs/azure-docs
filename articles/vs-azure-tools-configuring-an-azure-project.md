---
title: Configure an Azure cloud service project with Visual Studio | Microsoft Docs
description: Learn how to configure an Azure cloud service project in Visual Studio, depending on your requirements for that project.
services: visual-studio-online
author: ghogen
manager: douge
assetId: 609d6965-05cc-47b1-82dc-c76a92d4f295
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 03/06/2017
ms.author: ghogen

---
# Configure an Azure cloud service project with Visual Studio
You can configure an Azure cloud service project, depending on your requirements for that project. You can set properties for the project for the following categories:

- **Publish a cloud service to Azure** - You can set a property to make sure that an existing cloud service deployed to Azure is not accidentally deleted.
- **Run or debug a cloud service on the local computer** - You can select a service configuration to use and indicate whether you want to start the Azure storage emulator.
- **Validate a cloud service package when it is created** - You can decide to treat any warnings as errors so that you can ensure that the cloud service package deploys without any issues. 

## Steps to configure an Azure cloud service project
1. Open or create a cloud service project in Visual Studio

1. In **Solution Explorer**, right-click the project, and, from the context menu, select **Properties**.
   
1. In the project's properties page, select the **Development** tab.

	![Project properties menu](./media/vs-azure-tools-configuring-an-azure-project/solution-explorer-project-properties-menu.png)

1. Set **Prompt before deleting an existing deployment** to **True**. This setting helps to ensure you don't accidentally delete an existing deployment in Azure

1. Select the desired **Service configuration** to indicate which service configuration you want to use when you run or debug your cloud service locally. For more information on how to modify a service configuration for a role, see [How to configure the roles for an Azure cloud service with Visual Studio](./vs-azure-tools-configure-roles-for-cloud-service.md).

1. Set **Start Azure storage emulator** to **True** to start the Azure storage emulator when you run or debug your cloud service locally.

1. Set **Treat warnings as errors** to **True** to make sure you cannot publish if there are package validation errors.

1. Set **Use web project ports** to **True** to make sure that your web role uses the same port each time it starts locally in IIS Express.

1. From the Visual Studio toolbar, select **Save**.

## Next steps
- [Configure an Azure project using multiple service configurations](vs-azure-tools-multiple-services-project-configurations.md)

