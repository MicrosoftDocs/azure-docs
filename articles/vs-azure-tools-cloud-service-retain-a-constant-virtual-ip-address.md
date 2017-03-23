---
title: How to retain a constant virtual IP address for an Azure cloud service | Microsoft Docs
description: Learn how to ensure that the virtual IP address (VIP) of your Azure cloud service doesn't change.
services: visual-studio-online
documentationcenter: na
author: TomArcher
manager: douge
editor: ''

ms.assetid: 4a58e2c6-7a79-4051-8a2c-99182ff8b881
ms.service: multiple
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 03/21/2017
ms.author: tarcher

---
# Retain a constant virtual IP address for an Azure cloud service
When you update a cloud service that's hosted in Azure, you might need to ensure that the virtual IP address (VIP) of the service doesn't change. Many domain management services use the Domain Name System (DNS) for registering domain names. DNS works only if the VIP remains the same. You can use the **Publish Wizard** in Azure Tools to ensure that the VIP of your cloud service doesn’t change when you update it. For more information about how to use DNS domain management for cloud services, see [Configuring a custom domain name for an Azure cloud service](cloud-services/cloud-services-custom-domain-name.md).

## Publish a cloud service without changing its VIP
The VIP of a cloud service is allocated when you first deploy it to Azure in a particular environment, such as the Production environment. The VIP changes only if you delete the deployment explicitly or the deployment is implicitly deleted by the deployment update process. To retain the VIP, you must not delete your deployment. You must also make sure that Visual Studio doesn’t delete your deployment automatically. 

To control these behaviors, you can specify deployment settings in the **Publish Wizard**, which supports several deployment options. You can specify a fresh deployment or an update deployment, which can be incremental or simultaneous. Both kinds of update deployment retain the VIP. For definitions of these different types of deployment, see [Publish Azure Application Wizard](vs-azure-tools-publish-azure-application-wizard.md). In addition, you can control whether the previous deployment of a cloud service is deleted if an error occurs. The VIP might unexpectedly change if you don't set that option correctly.

## Update a cloud service without changing its VIP
1. Create or open an Azure cloud service project in Visual Studio. 

1. In **Solution Explorer**, right-click the project. On the context menu, select **Publish**.

	![Publish menu](./media/vs-azure-tools-cloud-service-retain-a-constant-virtual-ip-address/solution-explorer-publish-menu.png)

1. In the **Publish Azure Application** dialog box, select the Azure subscription to which you want to deploy. Sign in if necessary, and select **Next**.

	![Publish Azure application: sign in](./media/vs-azure-tools-cloud-service-retain-a-constant-virtual-ip-address/azure-publish-signin.png)

1. On the **Common Settings** tab, verify that the name of the cloud service to which you’re deploying, the **Environment**, the **Build Configuration**, and the **Service Configuration** are all correct.

	![Publish Azure application - common settings](./media/vs-azure-tools-cloud-service-retain-a-constant-virtual-ip-address/azure-publish-common-settings.png)

1. On the **Advanced Settings** tab, verify that the storage account and the deployment label are correct. Verify that the **Delete deployment on failure** check box is cleared, and verify that the **Deployment update** check box is selected. By selecting the **Deployment update** check box, you ensure that your deployment isn't deleted and your VIP isn't lost when you republish your application. By clearing the **Delete deployment on failure** check box, you ensure that your VIP isn't lost if an error occurs during deployment.

	![Publish Azure application - advanced settings](./media/vs-azure-tools-cloud-service-retain-a-constant-virtual-ip-address/azure-publish-advanced-settings.png)

1. (Optional) To further specify how you want the roles to be updated, select **Settings** next to **Deployment update**. Select either **Incremental update** or **Simultaneous update**. Choose **Incremental update** to update each instance of your application, one after another, so that the application is always available. Choose **Simultaneous update** to update all instances of your application at the same time. Simultaneous updating is faster, but your service might not be available during the update process. When you are finished, select **Next**.

	![Publish Azure application - deployment update settings](./media/vs-azure-tools-cloud-service-retain-a-constant-virtual-ip-address/azure-publish-deployment-update-settings.png)

1. In the **Publish Azure Application** dialog box, select **Next** until the **Summary** page is displayed. Verify your settings, and then select **Publish**.
   
	![Publish Azure application - summary](./media/vs-azure-tools-cloud-service-retain-a-constant-virtual-ip-address/azure-publish-summary.png)

## Next steps
- [Using the Visual Studio Publish Azure Application Wizard](vs-azure-tools-publish-azure-application-wizard.md)

