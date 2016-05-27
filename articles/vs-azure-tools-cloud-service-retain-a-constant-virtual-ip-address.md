<properties
   pageTitle="How to retain a constant virtual IP address for a cloud service | Microsoft Azure"
   description="Learn how to ensure that the virtual IP address (VIP) of your Azure cloud service doesn't change."
   services="visual-studio-online"
   documentationCenter="na"
   authors="TomArcher"
   manager="douge"
   editor="" />
<tags
   ms.service="multiple"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple"
   ms.date="04/19/2016"
   ms.author="tarcher" />

# How to retain a constant virtual IP address for a cloud service

When you update a cloud service that's hosted in Azure, you might need to ensure that the virtual IP address (VIP) of the service doesn't change. Many domain management services use the Domain Name System (DNS) for registering domain names. DNS works only if the VIP remains the same. You can use the **Publish Wizard** in Azure Tools to ensure that the VIP of your cloud service doesn’t change when you update it. For more information about how to use DNS domain management for cloud services, see [Configuring a custom domain name for an Azure cloud service](./cloud-services/cloud-services-custom-domain-name.md).

## Publishing a cloud service without changing its VIP

The VIP of a cloud service is allocated when you first deploy it to Azure in a particular environment, such as the Production environment. The VIP doesn’t change unless you delete the deployment explicitly or it is implicitly deleted by the deployment update process. To retain the VIP, you must not delete your deployment, and you must also make sure that Visual Studio doesn’t delete your deployment automatically. You can control the behavior by specifying deployment settings in the **Publish Wizard**, which supports several deployment options. You can specify a fresh deployment or an update deployment, which can be incremental or simultaneous, and both kinds of update deployments retain the VIP. For definitions of these different types of deployment, see [Publish Azure Application Wizard](vs-azure-tools-publish-azure-application-wizard.md).  In addition, you can control whether the previous deployment of a cloud service is deleted if an error occurs. The VIP might unexpectedly change if you don't set that option correctly.

### To update a cloud service without changing its VIP

1. After you deploy your cloud service at least once, open the shortcut menu for the node for your Azure project, and then choose **Publish**. The **Publish Azure Application** wizard appears.

1. In the list of subscriptions, choose the one to which you want to deploy, and then choose the **Next** button. The **Settings** page of the wizard appears.

1. On the **Common Settings** tab, verify that the name of the cloud service to which you’re deploying, the **Environment**, the **Build Configuration**, and the **Service Configuration** are all correct.

1. On the **Advanced Settings** tab, verify that the storage account and the deployment label are correct, that the **Delete deployment on failure** check box is cleared, and that the **Deployment** update check box is selected. By selecting the **Deployment** update check box, you ensure that your deployment won't be deleted and your VIP won't be lost when you republish your application. By clearing the **Delete deployment on failure check box**, you ensure that your VIP won't be lost if an error occurs during deployment.

1. To further specify how you want the roles to be updated, choose the  **Settings** link next to the **Deployment update** box, and then choose either the incremental update or simultaneous update option in the **Deployment update** settings dialog box. If you choose incremental update, each instance is updated one after another, so that the application is always available. If you choose simultaneous update, all instances are updated at the same time. Simultaneous updating is faster, but your service might not be available during the update process.

1. When you’re satisfied with your settings, choose the **Next** button.

1. On the **Summary** page of the wizard, verify your settings, and then choose the **Publish** button.

  >[AZURE.WARNING] If the deployment fails, you should address why it failed and redeploy promptly, to avoid leaving your cloud service in a corrupted state.

## Next steps

To learn about publishing to Azure from Visual Studio, see [Publish Azure application wizard](vs-azure-tools-publish-azure-application-wizard.md).
