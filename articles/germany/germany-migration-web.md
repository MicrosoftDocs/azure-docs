---
title: Migrate Azure web resources from Azure Germany to global Azure
description: This article provides information about migrating your Azure web resources from Azure Germany to global Azure.
ms.topic: article
ms.date: 10/16/2020
author: gitralf
ms.author: ralfwi 
ms.service: germany
ms.custom: bfmigrate
---

# Migrate web resources to global Azure

[!INCLUDE [closureinfo](../../includes/germany-closure-info.md)]

This article has information that can help you migrate Azure web resources from Azure Germany to global Azure.

## Web Apps

Migrating apps that you created by using the Web Apps feature of Azure App Service from Azure Germany to global Azure isn't supported at this time. We recommend that you export a web app as an Azure Resource Manager template. Then, redeploy after you change the location property to the new destination region.

> [!IMPORTANT]
> Change location, Azure Key Vault secrets, certificates, and other GUIDs to be consistent with the new region.

### Migrate Web App resource

1. [Export Web App and App Service plan as a template](../azure-resource-manager/templates/export-template-portal.md) from your Azure Germany subscription. Select the resources you want to migrate in your web app resource group and export as a template.
1. Download the template as a zip file. 
1. Edit the location property in the **template.json** file to the target Azure global region. For example, the following JSON file has a target location of *West US*.

    ```json
        "resources": [
        {
            "type": "Microsoft.Web/serverfarms",
            "apiVersion": "2018-02-01",
            "name": "[parameters('serverfarms_myappservice_name')]",
            "location": "West US",

    ```
1. Deploy the modified template to Azure global. For example, you can use PowerShell to deploy.

    ```powershell
    az deployment group create --name "<web app name>" \
        --resource-group "<resource group name>" \
        --template-file "<path of your template.json file>"
    ```

### Migrate Web App content

1. In the Azure Germany portal, select your Web App.
1. Select **Development Tools > Advanced Tools**.
1. From the top menu, select **Debug console** then choose **PowerShell**.
1. Select **site**.
1. Select the **download icon** beside the **wwwroot** folder. The downloaded zip file contains source code of your web app.
1. Deploy the web root to the migrated Azure global web app. For example, you can use the following PowerShell script.

    ``` powershell
    az webapp deployment source config-zip \
        --resource-group "<resource group name>" \
        --name "<web App name>" \
        --src "path to webroot folder zip file"
    ```

For more information:

- Refresh your knowledge by completing the [App Service tutorials](../app-service/tutorial-dotnetcore-sqldb-app.md).
- Get information about how to [export Azure Resource Manager templates](../azure-resource-manager/templates/export-template-portal.md).
- Review the [Azure Resource Manager overview](../azure-resource-manager/management/overview.md).
- Review the [App Service overview](../app-service/overview.md).
- Get an [overview of Azure locations](https://azure.microsoft.com/global-infrastructure/locations/).
- Learn how to [redeploy a template](../azure-resource-manager/templates/deploy-powershell.md).

## Notification Hubs

To migrate settings from one Azure Notification Hubs instance to another instance, export and import all registration tokens with their tags:

1. [Export the existing notification hub registrations](/previous-versions/azure/azure-services/dn790624(v=azure.100)) to an Azure Blob storage container.
1. Create a new notification hub in the target environment.
1. [Import your registration tokens](/previous-versions/azure/azure-services/dn790624(v=azure.100)) from Blob storage to your new notification hub.

For more information:

- Refresh your knowledge by completing the [Notification Hubs tutorials](../notification-hubs/notification-hubs-android-push-notification-google-fcm-get-started.md).
- Review the [Notification Hubs overview](../notification-hubs/notification-hubs-push-notification-overview.md).

## Event Hubs

To migrate an Azure Event Hub, you export the Event Hub resource template from Azure Germany then deploy the template to global Azure.

1. [Export Event Hub as a template](../azure-resource-manager/templates/export-template-portal.md) from your Azure Germany subscription.
1. [Deploy Event Hub template as a custom template](../azure-resource-manager/templates/deploy-portal.md#deploy-resources-from-custom-template) to your global Azure subscription. Load and deploy the template you exported from your Azure Germany subscription.

For more information:

- Review the [Event Hubs overview](../event-hubs/event-hubs-about.md).
- Review the [Azure Resource Manager overview](../azure-resource-manager/management/overview.md).
- Get information about how to [export Azure Resource Manager templates](../azure-resource-manager/templates/export-template-portal.md).
- Learn how to [redeploy a template](../azure-resource-manager/templates/deploy-powershell.md).

## Next steps

Learn about tools, techniques, and recommendations for migrating resources in the following service categories:

- [Compute](./germany-migration-compute.md)
- [Networking](./germany-migration-networking.md)
- [Storage](./germany-migration-storage.md)
- [Databases](./germany-migration-databases.md)
- [Analytics](./germany-migration-analytics.md)
- [IoT](./germany-migration-iot.md)
- [Integration](./germany-migration-integration.md)
- [Identity](./germany-migration-identity.md)
- [Security](./germany-migration-security.md)
- [Management tools](./germany-migration-management-tools.md)
- [Media](./germany-migration-media.md)