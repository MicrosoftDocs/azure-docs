---
title: Prepare to publish or deploy a Cloud Service from Visual Studio | Microsoft Docs
description: Learn the procedures to set up cloud and storage account services and configure your Azure application.
services: visual-studio-online
author: ghogen
manager: douge
ms.assetid: 92ee2f9e-ec49-4c7a-900d-620abe5e9d8a
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 11/10/2017
ms.author: ghogen

---
# Prepare to publish or deploy a cloud service from Visual Studio

To publish a cloud service project, you must set up the following services as described in this article:

* A **cloud service** to run your roles in the Azure environment, and 
* A **storage account** that provides access to the Blob, Queue, and Table services.

## Create a cloud service

A cloud service runs your roles in the Azure environment. You can create a cloud service either in Visual Studio or through the [Azure portal](https://portal.azure.com/) as described in the sections that follow.

### Create a cloud service from Visual Studio

1. With a previously created Cloud Service project, right-click the project select **Publish**.
1. If necessary, sign in with the Microsoft or organizational account associated with your Azure subscription, then select **Next** to advance to the **Settings** page.
1. A **Create Cloud Service and Storage Account** dialog appears (if not, select **Create New** from the **Cloud Service** list).
1. Enter a case-insensitive name for your cloud service, which forms part of your URL and must be unique. Also choose a Region or Affinity Group, and select a Replication option.

### Create a cloud service through the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **Cloud Services (classic)** on the left side of the page.
1. Select **+ Add**, then provide the required information (DNS name, subscription, resource group, and location). It's not necessary to upload a package at this point because you do that later in Visual Studio.
1. Select **Create** to complete the process.

## Create a storage account

A storage account provides access to the Blob, Queue, and Table services. You can create a storage account through Visual Studio or the [Azure portal](https://portal.azure.com/).

### Create a storage account from Visual Studio

1. In **Solution Explorer** with a previously created Cloud Service project, locate the **Connected Services** node within a role project, right-click, and select **Add Connected Service**. (In Visual Studio 2015, right-click the **Storage** node and select **Create Storage Account**.)
1. In the **Connected Services** list that appears, select **Cloud Storage with Azure Storage**.
1. In the Azure Storage dialog that appears, select **+Create New Storage Account**, which brings up a dialog in which you specify your subscription, a name fo the account, a pricing tier, resource group, and location.
1. Select **Create** when you're done. The new storage account appears in the list of available storage accounts in your subscription.
1. Select that account and select **Add**.

### Create a storage account through the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **+ New** on the top left.
1. Select **Storage** under "Azure Marketplace," then **Storage account - blob, file, table, queue** from the right side.
1. Provide the required information (name, deployment model, and so forth.
1. Select **Create** to complete the process.

## Configure your app to use the storage account

After you create a storage account, connecting to it from Visual Studio automatically updates the service configurations for the project, including URLs and access keys.

If you created a cloud service from Visual Studio using the **Add Connected Service**, you can check the connections by opening `ServiceConfiguration.Cloud.cscfg` and `ServiceConfiguration.Local.cscfg`.

If you created a cloud service through the Azure portal, follow the same steps in [Create a storage account from Visual Studio](#create-a-storage-account-from-visual-studio) but select the existing account rather than creating a new one. Visual Studio then updates the configuration for you.

To configure settings manually, use the property pages in Visual Studio for the applicable role in your cloud service project (right-click the role and select **Properties**). For more information, see [Configuring a connection string to a storage account](https://docs.microsoft.com/azure/vs-azure-tools-multiple-services-project-configurations#configuring-a-connection-string-to-a-storage-account).

### About access keys

The Azure portal shows the URLs that you can use to access resources in each of the Azure storage services, and also the primary and secondary access keys for your account. You use these keys to authenticate requests made against the storage services.

The secondary access key provides the same access to your storage account as the primary access key and is generated as a backup should your primary access key be compromised. Additionally, it is recommended that you regenerate your access keys on a regular basis. You can modify a connection string setting to use the secondary key while you regenerate the primary key, then you can modify it to use the regenerated primary key while you regenerate the secondary key.

## Next steps

To learn more about publishing apps to Azure from Visual Studio, see [Publishing a Cloud Service using the Azure Tools](vs-azure-tools-publishing-a-cloud-service.md).
