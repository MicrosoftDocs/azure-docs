---
title: Configure upgrade preference for App Service Environment
description: Configure the upgrade preference for the Azure App Service Environment.
author: madsd
ms.topic: tutorial
ms.date: 07/05/2022
zone_pivot_groups: app-service-cli-portal
---

# Upgrade preference for App Service Environments

Azure App Service is regularly updated to provide new features, new runtime versions, performance improvements, and bug fixes. The upgrade happens automatically. The upgrades are applied progressively through the regions following [Azure Safe Deployment Practices](https://azure.microsoft.com/en-us/blog/advancing-safe-deployment-practices/). An App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for running App Service apps securely at high scale. Because of the isolated nature of App Service Environment, you have an opportunity to influence the upgrade process.

If you don't have an App Service Environment, see [How to Create an App Service Environment v3](./creation.md).

> [!NOTE]
> This article covers the features, benefits, and use cases of App Service Environment v3, which is used with App Service Isolated v2 plans.
> 

With App Service Environment v3 you can specify your preference for when and how the upgrade is applied. The upgrade can be applied automatically or manual. Even with automatic you have some options to influence the timing.

## Automatic upgrade preference

When you use an automatic upgrade preference, the platform will upgrade you when the upgrade is available in the region in which it is deployed. You can choose from one of these options:

* *None* is the default option. This will automatically apply the upgrade during the upgrade process for that region.
* *Early* will apply the upgrade automatically, but will prioritize it as one of the first instances in the region to be upgraded.
* *Late* will apply the upgrade automatically, but the instance will be one of the last in the region to be upgraded.

Note, that in smaller regions, Early and Late might be very close to each other.

## Manual upgrade preference

Manual upgrade preference will give you the option to receive a notification when an upgrade is available. After the upgrade is available, you will have 15 days to start the upgrade process. If you do not start the upgrade within the 15 days, it will be transferred to automatic upgrade and processed with the remaining automatic upgrades in the region.

::: zone pivot="experience-azp"

## Configure notifications

When an upgrade is available, Azure will add a planned maintenance event in the Service Health dashboard of Azure Monitor. To see past notifications in the [Azure portal](https://portal.azure.com), navigate to **Home > Monitor > Service Health > Planned maintenance** page. To make it easy to find the relevant events, click the **Service** box and check only the App Service type. You can also filter by subscription and region.

:::image type="content" source="./media/upgrade-preference/service-health-dashboard.png" alt-text="Screenshot of the Service Health dashboard in the Azure portal.":::

You can configure alerts to trigger when an event is added to send a message to your email address and/or SMS phone number. You can also set up a trigger for your custom Azure Function or Logic App, which allows you to automatically take action to your resources. This could be to automatically divert the traffic from your App Service Environment in one region which will be upgraded to an App Service Environment in another region in order to avoid any potential impact. Then, you can automatically change the traffic back to normal when an upgrade completes.

To configure alerts for upgrade notifications, click the **Add service health alert** at the top of the dashboard. Learn more about [Azure Monitor Alerts](../../azure-monitor/alerts/alerts-overview.md). This how-to article will guide you through [configuring alerts for service health events](../../service-health/alerts-activity-log-service-notifications-portal.md). Finally, you can follow this how-to guide to learn [how to create actions groups](../../azure-monitor/alerts/action-groups.md) that will trigger based on the alert.

### Send test notifications

As you build your automation and notification logic, you may want to test it before the actual upgrade is available as this could be more than a month out. The Azure portal has the ability to send a special test upgrade available notification which you can use to verify your automation logic. The message will be similar to the real notification, but the title will be prefixed with "[Test]" and the description will be different. You can send test notifications after you have configured your upgrade preference to Manual.

To send a test notification, navigate to the **Configuration** page for your App Service Environment and click the **Send test notification** link. The notifications are sent in batches every hour.

:::image type="content" source="./media/upgrade-preference/send-test-notification.png" alt-text="Screenshot of a configuration pane to send test notifications for the App Service Environment.":::

## Use the Azure portal to configure upgrade preference

1. From the [Azure portal](https://portal.azure.com), navigate to the **Configuration** page for your App Service Environment.
1. Select the upgrade preference of would like.
:::image type="content" source="./media/upgrade-preference/configure-upgrade-preference.png" alt-text="Screenshot of a configuration pane to select and update the upgrade preference for the App Service Environment.":::
1. Select "Save" at the top of the page.

::: zone-end

::: zone pivot="experience-azcli"

## Use Azure CLI to configure upgrade preference

The recommended experience for the upgrade is using the [Azure portal](how-to-upgrade-preference.md?pivots=experience-azp). If you decide to use the Azure CLI to configure and carry out the upgrade, you should follow the steps described here in order and as written since you'll be making Azure REST API calls. The recommended way for making these API calls is by using the [Azure CLI](/cli/azure/). For information about other methods, see [Getting Started with Azure REST](/rest/api/azure/).

For this guide, [install the Azure CLI](/cli/azure/install-azure-cli) or use the [Azure Cloud Shell](https://shell.azure.com/).

Replace the placeholders for name and resource group with your values for the App Service Environment you want to configure. To see the current upgrade preference:

```azurecli
ASE_NAME=<Your-App-Service-Environment-name>
ASE_RG=<Your-Resource-Group>
az resource show --name $ASE_NAME -g $ASE_RG --resource-type "Microsoft.Web/hostingEnvironments" --query properties.upgradePreference
```

To update the upgrade preference to **Manual**

```azurecli
ASE_NAME=<Your-App-Service-Environment-name>
ASE_RG=<Your-Resource-Group>
az resource update --name $ASE_NAME -g $ASE_RG --resource-type "Microsoft.Web/hostingEnvironments" --set properties.upgradePreference=Manual
```

::: zone-end

::: zone pivot="experience-azp"

## Use the Azure portal to upgrade the App Service Environment

When an upgrade is a banner is shown in the Azure portal. Follow these steps to start the upgrade:

1. From the [Azure portal](https://portal.azure.com), navigate to the **Configuration** page for your App Service Environment.
1. Click the **Upgrade now** button.
:::image type="content" source="./media/upgrade-preference/upgrade-now.png" alt-text="Screenshot of a configuration pane to start the upgrade for the App Service Environment.":::
1. A confirmation banner will appear. Click **Start upgrade** to start the upgrade process. You will receive notifications during the upgrade if you have configured it. See [Configuration notifications](#configure-notications) for more information.

::: zone-end

::: zone pivot="experience-azcli"

## Use Azure CLI to upgrade the App Service Environment

The recommended experience for the upgrade is using the [Azure portal](how-to-upgrade-preference.md?pivots=experience-azp). If you decide to use the Azure CLI to configure and carry out the upgrade, you should follow the steps described here in order and as written since you'll be making Azure REST API calls. The recommended way for making these API calls is by using the [Azure CLI](/cli/azure/). For information about other methods, see [Getting Started with Azure REST](/rest/api/azure/).

For this guide, [install the Azure CLI](/cli/azure/install-azure-cli) or use the [Azure Cloud Shell](https://shell.azure.com/).

Run these commands to get your App Service Environment ID and store it as an environment variable. Replace the placeholders for name and resource group with your values for the App Service Environment you want to migrate.

```azurecli
ASE_NAME=<Your-App-Service-Environment-name>
ASE_RG=<Your-Resource-Group>
ASE_ID=$(az appservice ase show --name $ASE_NAME --resource-group $ASE_RG --query id --output tsv)
```

Run this command to send a test upgrade notification:

```azurecli
az rest --method POST --uri "${ASE_ID}/testUpgradeAvailableNotification?api-version=2022-03-01"
```

Run this command to start the upgrade process:

```azurecli
az rest --method POST --uri "${ASE_ID}/upgrade?api-version=2022-03-01"
```

::: zone-end

 ## Next steps

> [!div class="nextstepaction"]
> [Using an App Service Environment v3](using.md)

> [!div class="nextstepaction"]
> [App Service Environment v3 Networking](networking.md)