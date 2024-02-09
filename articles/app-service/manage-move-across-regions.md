---
title: Move an app to another region
description: Learn how to move App Service resources from one region to another.
author: msangapu-msft
ms.author: msangapu
ms.topic: how-to
ms.date: 02/27/2020
ms.custom: subject-moving-resources

#Customer intent: As an Azure service administrator, I want to move my App Service resources to another Azure region.
---

# Move an App Service resource to another region

This article describes how to move App Service resources to a different Azure region. You might move your resources to another region for a number of reasons. For example, to take advantage of a new Azure region, to deploy features or services available in specific regions only, to meet internal policy and governance requirements, or in response to capacity planning requirements.

App Service resources are region-specific and can't be moved across regions. You must create a copy of your existing App Service resources in the target region, then move your content over to the new app. If your source app uses a custom domain, you can [migrate it to the new app in the target region](manage-custom-dns-migrate-domain.md) when you're finished.

To make copying your app easier, you can [clone an individual App Service app](app-service-web-app-cloning.md) into an App Service plan in another region, but it does have [limitations](app-service-web-app-cloning.md#current-restrictions), especially that it doesn't support Linux apps.

## Prerequisites

- Make sure that the App Service app is in the Azure region from which you want to move.
- Make sure that the target region supports App Service and any related service, whose resources you want to move.
<!-- - Domain bindings, certificates, and managed identities can't replicated using the **Export template** method. You must create them manually. -->

## Prepare

Identify all the App Service resources that you're currently using. For example:

- App Service apps
- [App Service plans](overview-hosting-plans.md)
- [Deployment slots](deploy-staging-slots.md)
- [Custom domains purchased in Azure](manage-custom-dns-buy-domain.md)
- [TLS/SSL certificates](configure-ssl-certificate.md)
- [Azure Virtual Network integration](./overview-vnet-integration.md)
- [Hybrid connections](app-service-hybrid-connections.md).
- [Managed identities](overview-managed-identity.md)
- [Backup settings](manage-backup.md)

Certain resources, such as imported certificates or hybrid connections, contain integration with other Azure services. For information on how to move those resources across regions, see the documentation for the respective services.

## Move

1. [Create a back up of the source app](manage-backup.md).
1. [Create an app in a new App Service plan, in the target region](app-service-plan-manage.md#create-an-app-service-plan).
2. [Restore the back up in the target app](manage-backup.md)
2. If you use a custom domain, [bind it preemptively to the target app](manage-custom-dns-migrate-domain.md#2-create-the-dns-records) with `asuid.` and [enable the domain in the target app](manage-custom-dns-migrate-domain.md#3-enable-the-domain-for-your-app).
3. Configure everything else in your target app to be the same as the source app and verify your configuration.
4. When you're ready for the custom domain to point to the target app, [remap the domain name](manage-custom-dns-migrate-domain.md#4-remap-the-active-dns-name).

<!-- 1. Login to the [Azure portal](https://portal.azure.com) > **Resource Groups**.
2. Locate the Resource Group that contains the source App Service resources and click on it.
3. Select > **Settings** > **Export template**.
4. Choose **Deploy** in the **Export template** blade.
5. Click **TEMPLATE** > **Edit template** to open the template in the online editor.
6. Click inside the online editor and type Ctrl+F (or ⌘+F on a Mac) and type `"identity": {` to find any managed identity definition. The following is an example if you have a user-assigned managed identity.
    ```json
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/<group-name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>": {
                "principalId": "00000000-0000-0000-0000-000000000000",
                "clientId": "00000000-0000-0000-0000-000000000000"
            }
        }
    },
    ```
6. Click inside the online editor and type Ctrl+F (or ⌘+F on a Mac) and type `"Microsoft.Web/sites/hostNameBindings` to find all hostname bindings. The following is an example if you have a user-assigned managed identity.
    ```json
    {
        "type": "Microsoft.Web/sites/hostNameBindings",
        "apiVersion": "2018-11-01",
        "name": "[concat(parameters('sites_webapp_name'), '/', parameters('sites_webapp_name'), '.azurewebsites.net')]",
        "location": "West Europe",
        "dependsOn": [
            "[resourceId('Microsoft.Web/sites', parameters('sites_webapp_name'))]"
        ],
        "properties": {
            "siteName": "<app-name>",
            "hostNameType": "Verified"
        }
    },
    ```
6. Click inside the online editor and type Ctrl+F (or ⌘+F on a Mac) and type `"Microsoft.Web/certificates` to find all hostname bindings. The following is an example if you have a user-assigned managed identity.
    ```json
    {
        "type": "Microsoft.Web/certificates",
        "apiVersion": "2018-11-01",
        "name": "[parameters('certificates_test2_cephaslin_com_name')]",
        "location": "West Europe",
        "properties": {
            "hostNames": [
                "[parameters('certificates_test2_cephaslin_com_name')]"
            ],
            "password": "[parameters('certificates_test2_cephaslin_com_password')]"
        }
    },
    ```
7. Delete the entire JSON block. Click **Save** in the online editor.
8. Click **BASICS** > **Create new** to create a new resource group. Type the group name and click **OK**.
9. In **BASICS** > **Location**, select the region you want.   -->

## Clean up source resources

Delete the source app and App Service plan. [An App Service plan in the non-free tier carries a charge, even if no app is running in it.](app-service-plan-manage.md#delete-an-app-service-plan)

## Next steps

[Azure App Service App Cloning Using PowerShell](app-service-web-app-cloning.md)
