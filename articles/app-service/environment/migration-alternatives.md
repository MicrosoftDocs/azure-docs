---
title: Migrate to App Service Environment v3
description: How to migrate your applications to App Service Environment v3
author: seligj95
ms.topic: article
ms.date: 07/24/2023
ms.author: jordanselig
---
# Migrate to App Service Environment v3

> [!NOTE]
> The App Service Environment v3 [migration feature](migrate.md) is now available for a set of supported environment configurations in certain regions. Consider that feature which provides an automated migration path to [App Service Environment v3](overview.md).
>

If you're currently using App Service Environment v1 or v2, you have the opportunity to migrate your workloads to [App Service Environment v3](overview.md). App Service Environment v3 has [advantages and feature differences](overview.md#feature-differences) that provide enhanced support for your workloads and can reduce overall costs. Consider using the [migration feature](migrate.md) if your environment falls into one of the [supported scenarios](migrate.md#supported-scenarios).

If your App Service Environment [isn't supported for migration](migrate.md#migration-feature-limitations) with the migration feature, you must use one of the manual methods to migrate to App Service Environment v3.

## Prerequisites

Scenario: An existing app running on an App Service Environment v1 or App Service Environment v2 and you need that app to run on an App Service Environment v3.

For any migration method that doesn't use the [migration feature](migrate.md), you need to [create the App Service Environment v3](creation.md) and a new subnet using the method of your choice. There are [feature differences](overview.md#feature-differences) between App Service Environment v1/v2 and App Service Environment v3 as well as [networking changes](networking.md) that involve new (and for internet-facing environments, additional) IP addresses. You need to update any infrastructure that relies on these IPs as well as account for inbound dependency changes such as the Azure Load Balancer port.

Multiple App Service Environments can't exist in a single subnet. If you need to use your existing subnet for your new App Service Environment v3, you need to delete the existing App Service Environment before you create a new one. For this scenario, the recommended migration method is to [back up your apps and then restore them](#back-up-and-restore) in the new environment after it gets created and configured. There is application downtime during this process because of the time it takes to delete the old environment, create the new App Service Environment v3, configure any infrastructure and connected resources to work with the new environment, and deploy your apps onto the new environment.

### Checklist before migrating apps

- [Create an App Service Environment v3](creation.md)
- After creating the new environment, update any networking dependencies with the IP addresses associated with the new environment
- Plan for downtime (if applicable)
- Decide on a process for recreating your apps in your new environment

## Isolated v2 App Service plans

App Service Environment v3 uses Isolated v2 App Service plans that are priced and sized differently than those from Isolated plans. Review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/) to understand how you're new environment needs to be sized and scaled to ensure appropriate capacity. There's no difference in how you create App Service plans for App Service Environment v3 compared to previous versions.

## Back up and restore

The [back up and restore](../manage-backup.md) feature allows you to keep your app configuration, file content, and database connected to your app when migrating to your new environment. Make sure you review the [details](../manage-backup.md#automatic-vs-custom-backups) of this feature.

> [!IMPORTANT]
> You must configure custom backups for your apps in order to restore them to an App Service Environment v3. Automatic backup doesn't support restoration on different App Service Environment versions. For more information on custom backups, see [Automatic vs custom backups](../manage-backup.md#automatic-vs-custom-backups).
:::image type="content" source="./media/migration/configure-custom-backup.png" alt-text="Screenshot that shows how to configure custom backup for an App Service app.":::
>

You can select a custom backup and restore it to an App Service in your App Service Environment v3. You must create the App Service you'll restore to before restoring the app. You can choose to restore the backup to the production slot, an existing slot, or a newly created slot that you can create during the restoration process.

:::image type="content" source="./media/migration/back-up-restore-sample.png" alt-text="Screenshot that shows how to use backup to restore App Service app in App Service Environment v3.":::

|Benefits     |Limitations    |
|---------|---------|
|Quick - should only take 5-10 minutes per app        |Support is limited to [certain database types](../manage-backup.md#automatic-vs-custom-backups)         |
|Multiple apps can be restored at the same time (restoration needs to be configured for each app individually)       |Old and new environments as well as supporting resources (for example apps, databases, storage accounts, and containers) must all be in the same subscription        |
|In-app MySQL databases are automatically backed up without any configuration        |Backups can be up to 10 GB of app and database content, up to 4 GB of which can be the database backup. If the backup size exceeds this limit, you get an error.        |
|Can restore the app to a snapshot of a previous state         |Using a [firewall enabled storage account](../../storage/common/storage-network-security.md) as the destination for your backups isn't supported   |
|Can integrate with [Azure Traffic Manager](../../traffic-manager/traffic-manager-overview.md) and [Azure Application Gateway](../../application-gateway/overview.md) to distribute traffic across old and new environments          |Using a [private endpoint enabled storage account](../../storage/common/storage-private-endpoints.md) for backup and restore isn't supported  |
|Can create empty web apps to restore to in your new environment before you start restoring to speed up the process   | Only supports custom backups        |

## Clone your app to an App Service Environment v3

[Cloning your apps](../app-service-web-app-cloning.md) is another feature that can be used to get your **Windows** apps onto your App Service Environment v3. There are limitations with cloning apps. These limitations are the same as those for the App Service Backup feature, see [Back up an app in Azure App Service](../manage-backup.md#whats-included-in-an-automatic-backup).

> [!NOTE]
> Cloning apps is supported on Windows App Service only.
>

This solution is recommended for users that are using Windows App Service and can't migrate using the [migration feature](migrate.md). You need to set up your new App Service Environment v3 before cloning any apps. Cloning an app can take up to 30 minutes to complete. Cloning can be done using PowerShell as described in the [documentation](../app-service-web-app-cloning.md#cloning-an-existing-app-to-an-app-service-environment) or using the Azure portal.

To clone an app using the [Azure portal](https://portal.azure.com), navigate to your existing App Service and select **Clone App** under **Development Tools**. Fill in the required fields using the details for your new App Service Environment v3.

1. Select an existing or create a new **Resource Group**.
1. Give your app a **Name**. This name can be the same as the old app, but note the site's default URL using the new environment will be different. You need to update any custom DNS or connected resources to point to the new URL.
1. Use your App Service Environment v3 name for **Region**.
1. Choose whether or not to clone your deployment source.
1. You can use an existing Windows **App Service plan** from your new environment if you created one already, or create a new one. The available Windows App Service plans in your new App Service Environment v3, if any, are listed in the dropdown.
1. Modify **SKU and size** as needed using one of the Isolated v2 options if creating a new App Service plan. Note App Service Environment v3 uses Isolated v2 plans, which have more memory and CPU per corresponding instance size compared to the Isolated plan. For more information, see [App Service Environment v3 SKU details](overview.md#pricing).

:::image type="content" source="./media/migration/portal-clone-sample.png" alt-text="Screenshot that shows how to clone an app to App Service Environment v3 using the portal.":::

|Benefits     |Limitations     |
|---------|---------|
|Can be automated using PowerShell        |Only supported on Windows App Service        |
|Multiple apps can be cloned at the same time (cloning needs to be configured for each app individually or using a script)       |Support is limited to [certain database types](../manage-backup.md#automatic-vs-custom-backups)         |
|Can integrate with [Azure Traffic Manager](../../traffic-manager/traffic-manager-overview.md) and [Azure Application Gateway](../../application-gateway/overview.md) to distribute traffic across old and new environments       |Old and new environments as well as supporting resources (for example apps, databases, storage accounts, and containers) must all be in the same subscription        |

## Manually create your apps on an App Service Environment v3

If the above feature doesn't support your apps or you're looking to take a more manual route, you have the option of deploying your apps following the same process you used for your existing App Service Environment. You don't need to make updates when you deploy your apps to your new environment.

You can export [Azure Resource Manager (ARM) templates](../../azure-resource-manager/templates/overview.md) of your existing apps, App Service plans, and any other supported resources and deploy them in or with your new environment. To export a template for just your app, navigate to your App Service and go to **Export template** under **Automation**.

:::image type="content" source="./media/migration/export-toc.png" alt-text="Screenshot of how to export App Service template from TOC.":::

You can also export templates for multiple resources directly from your resource group by going to your resource group, selecting the resources you want a template for, and then selecting **Export template**.

:::image type="content" source="./media/migration/export-template-sample.png" alt-text="Screenshot of how to export template for resources from a resource group.":::

The following initial changes to your Azure Resource Manager templates are required to get your apps onto your App Service Environment v3:

- Update SKU parameters for App Service plan to an Isolated v2 plan:

    ```json
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2021-02-01",
    "name": "[parameters('serverfarm_name')]",
    "location": "East US",
    "sku": {
        "name": "I1v2",
        "tier": "IsolatedV2",
        "size": "I1v2",
        "family": "Iv2",
        "capacity": 1
    },
    ```

- Update App Service plan (serverfarm) parameter the app is to be deployed into to the plan associated with the App Service Environment v3
- Update hosting environment profile (hostingEnvironmentProfile) parameter to the new App Service Environment v3 resource ID
- An Azure Resource Manager template export includes all properties exposed by the resource providers for the given resources. Remove all nonrequired properties such as those which point to the domain of the old app. For example, you `sites` resource could be simplified to the following sample:

    ```json
    "type": "Microsoft.Web/sites",
    "apiVersion": "2021-02-01",
    "name": "[parameters('site_name')]",
    "location": "East US",
    "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', parameters('serverfarm_name'))]"
    ],
    "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('serverfarm_name'))]",
        "siteConfig": {
            "linuxFxVersion": "NODE|14-lts"
         },
        "hostingEnvironmentProfile": {
            "id": "[parameters('hostingEnvironments_externalid')]"
        }
    }
    ```

Other changes may be required depending on how your app is configured.

Azure Resource Manager templates can be [deployed](../deploy-complex-application-predictably.md) using multiple methods including using the Azure portal, Azure CLI, or PowerShell.

## Guidance for manual migration

The [migration feature](migrate.md) automates the migration to App Service Environment v3 and at the same time transfers all of your apps to the new environment. There's about one hour of downtime during this migration. If you're in a position where you can't have any downtime, the recommendation is to use one of the manual options to recreate your apps in an App Service Environment v3.

You can distribute traffic between your old and new environment using an [Application Gateway](../networking/app-gateway-with-service-endpoints.md). If you're using an Internal Load Balancer (ILB) App Service Environment, see the [considerations](../networking/app-gateway-with-service-endpoints.md#considerations-for-ilb-ase) and [create an Azure Application Gateway](integrate-with-application-gateway.md) with an extra backend pool to distribute traffic between your environments. For internet facing App Service Environments, see these [considerations](../networking/app-gateway-with-service-endpoints.md#considerations-for-external-ase). You can also use services like [Azure Front Door](../../frontdoor/quickstart-create-front-door.md), [Azure Content Delivery Network (CDN)](../../cdn/cdn-add-to-web-app.md), and [Azure Traffic Manager](../../cdn/cdn-traffic-manager.md) to distribute traffic between environments. Using these services allows for testing of your new environment in a controlled manner and allows you to move to your new environment at your own pace.

Once your migration and any testing with your new environment is complete, delete your old App Service Environment, the apps that are on it, and any supporting resources that you no longer need. You continue to be charged for any resources that haven't been deleted.

## Frequently asked questions

- **Will I experience downtime during the migration?**  
  Downtime is dependent on your migration process. If you have a different App Service Environment that you can point traffic to while you migrate or if you can use a different subnet to create your new environment, you won't have downtime. However, if you must use the same subnet, there is downtime resulting from the time it takes to delete the old environment, create the App Service Environment v3, create the new App Service plans, re-create the apps, and update any resources that need to know about the new IP addresses.
- **Do I need to change anything about my apps to get them to run on App Service Environment v3?**  
  No, apps that run on App Service Environment v1 and v2 shouldn't need any modifications to run on App Service Environment v3. If you're using IP SSL, you must remove the IP SSL bindings before migrating.
- **What if my App Service Environment has a custom domain suffix?**  
  The migration feature supports this [migration scenario](./migrate.md#supported-scenarios). You can migrate using a manual method if you don't want to use the migration feature. You can configure your [custom domain suffix](./how-to-custom-domain-suffix.md) when creating your App Service Environment v3 or any time after. 
- **What if my App Service Environment is zone pinned?**  
  Zone pinning isn't a supported feature on App Service Environment v3.
- **What properties of my App Service Environment will change?**  
  You'll now be on App Service Environment v3 so be sure to review the [features and feature differences](overview.md#feature-differences) compared to previous versions. For ILB App Service Environment, you keep the same ILB IP address. For internet facing App Service Environment, the public IP address and the outbound IP address change. Note for internet facing App Service Environment, previously there was a single IP for both inbound and outbound. For App Service Environment v3, they're separate. For more information, see [App Service Environment v3 networking](networking.md#addresses).
- **Is backup and restore supported for moving apps from App Service Environment v2 to v3?**
  The [back up and restore](../manage-backup.md) feature supports restoring apps between App Service Environment versions as long as a custom backup is used for the restoration. Automatic backup doesn't support restoration to different App Service Environment versions.
- **What will happen to my App Service Environment v1/v2 resources after 31 August 2024?**  
  After 31 August 2024, if you haven't migrated to App Service Environment v3, your App Service Environment v1/v2s and the apps deployed in them will no longer be available. App Service Environment v1/v2 is hosted on App Service scale units running on [Cloud Services (classic)](../../cloud-services/cloud-services-choose-me.md) architecture that will be [retired on 31 August 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/). Because of this, [App Service Environment v1/v2 will no longer be available after that date](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement/). Migrate to App Service Environment v3 to keep your apps running or save or back up any resources or data that you need to maintain.

## Next steps

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)

> [!div class="nextstepaction"]
> [Integrate your ILB App Service Environment with the Azure Application Gateway](integrate-with-application-gateway.md)

> [!div class="nextstepaction"]
> [Migrate to App Service Environment v3 using the migration feature](migrate.md)

> [!div class="nextstepaction"]
> [Custom domain suffix](./how-to-custom-domain-suffix.md)
