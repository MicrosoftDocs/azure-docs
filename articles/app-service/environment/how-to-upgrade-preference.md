---
title: Configure upgrade preference for App Service Environment planned maintenance
description: Configure the upgrade preference for the Azure App Service Environment planned maintenance.
author: madsd
ms.topic: tutorial
ms.custom: devx-track-azurecli
ms.date: 11/05/2024
zone_pivot_groups: app-service-cli-portal
---

# Upgrade preference for App Service Environment planned maintenance

Azure App Service is regularly updated to provide new features, new runtime versions, performance improvements, and bug fixes. This is also known as planned maintenance. The upgrade happens automatically. The upgrades are applied progressively through the regions following [Azure Safe Deployment Practices](https://azure.microsoft.com/blog/advancing-safe-deployment-practices/). An App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for running App Service apps securely at high scale. Because of the isolated nature of App Service Environment, you have an opportunity to influence the upgrade process.

If you don't have an App Service Environment, see [How to Create an App Service Environment v3](./creation.md).

> [!NOTE]
> This article covers the features, benefits, and use cases of App Service Environment v3, which is used with App Service Isolated v2 plans.
> 

With App Service Environment v3, you can specify your preference for when and how the planned maintenance is applied. The upgrade can be applied automatically or manually. Even with your preference set to automatic, you have some options to influence the timing.

## Automatic upgrade preference

When you use an automatic upgrade preference, the platform upgrades your App Service Environment instance when the upgrade is available in the region in which the instance is deployed. You can choose from one of these options:

* *None* is the default option. This option automatically applies the upgrade during the upgrade process for that region.
* *Early* applies the upgrade automatically, but prioritizes it as one of the first instances in the region to be upgraded.
* *Late* applies the upgrade automatically, but the instance is one of the last in the region to be upgraded.

In smaller regions, Early and Late upgrade preferences might be very close to each other.

## Manual upgrade preference

Manual upgrade preference gives you the option to receive a notification when an upgrade is available. The availability is also visible in the Azure portal. After the upgrade is available, you'll typically have 15 days to start the upgrade process. If you don't start the upgrade within the 15 days, the upgrade is processed with the remaining automatic upgrades in the region.

> [!NOTE]
> Our goal is to provide you with a 15-day notice before the upgrade is applied automatically. In rare cases, the notice period is less than 15 days. The "End Time" for the planned maintenance event that you receive always indicates the end of the notice period.
> 

Upgrades normally don't affect the availability of your apps. The upgrade adds extra instances to ensure that the same capacity is available during upgrade. Patched and restarted instances are added back in rotation, and when you have workloads sensitive to restarts you should plan to start the maintenance during non-business hours. The full upgrade process normally finishes within 18 hours, but could take longer. Once the upgrade is started the upgrade runs until it's complete and isn't paused during standard business hours.

> [!NOTE]
> In rare cases, the upgrade availability might be impacted by a security hotfix superseding the planned upgrade, or a regression found in the planned upgrade before it has been applied to your instance. In these rare cases, the available upgrade will be removed and will transition to automatic upgrade.
> 

> [!IMPORTANT]
> In rare cases, you might see an upgrade is available in the **Configuration** page for your App Service Environment, but you don't receive a **Service Health** notification (if you [configure notifications](#configure-notifications)). If you don't receive a Service Health notification, this available upgrade isn't required and the 15-day time limit doesn't apply. This is a known bug that we are working to fix.
> 

## Configure notifications

When an upgrade is available, Azure adds a planned maintenance event in the Service Health dashboard of Azure Monitor. To see past notifications in the [Azure portal](https://portal.azure.com), navigate to **Home > Monitor > Service Health > Planned maintenance**. To make it easy to find the relevant events, select the **Service** box and check only the App Service type. You can also filter by subscription and region.

:::image type="content" source="./media/upgrade-preference/service-health-dashboard.png" alt-text="Screenshot of the Service Health dashboard in the Azure portal.":::

You can configure alerts to send a message to your email address and/or SMS phone number when an event is generated in Azure Monitor. You can also set up a trigger for your custom Azure Function or Logic App, which allows you to automatically take action on your resources. This action could be to automatically divert the traffic from your App Service Environment in one region that is upgraded to an App Service Environment in another region. Then, you can automatically change the traffic back to normal when an upgrade completes.

To configure alerts for upgrade notifications, select the **Add service health alert** at the top of the dashboard. Learn more about [Azure Monitor Alerts](/azure/azure-monitor/alerts/alerts-overview). This how-to article guides you through [configuring alerts for service health events](/azure/service-health/alerts-activity-log-service-notifications-portal). Finally, you can follow this how-to guide to learn [how to create actions groups](/azure/azure-monitor/alerts/action-groups) that trigger based on the alert.

### Send test notifications

As you build your automation and notification logic, you want to test it before the actual upgrade is available as this upgrade could be more than a month out. The Azure portal has the ability to send a special test upgrade available notification, which you can use to verify your automation logic. The message is similar to the real notification, but the title is prefixed with "[Test]" and the description is different. You can send test notifications after you configured your upgrade preference to Manual.

To send a test notification, navigate to the **Configuration** page for your App Service Environment and select the **Send test notification** link. The test notifications are sent in batches every 15 minutes.

:::image type="content" source="./media/upgrade-preference/send-test-notification.png" alt-text="Screenshot of a configuration pane to send test notifications for the App Service Environment.":::

::: zone pivot="experience-azp"

## Use the Azure portal to configure upgrade preference

1. From the [Azure portal](https://portal.azure.com), navigate to the **Configuration** page for your App Service Environment.
1. Select an upgrade preference.
:::image type="content" source="./media/upgrade-preference/configure-upgrade-preference.png" alt-text="Screenshot of a configuration pane to select and update the upgrade preference for the App Service Environment.":::
1. Select "Save" at the top of the page.

::: zone-end

::: zone pivot="experience-azcli"

## Use Azure CLI to configure upgrade preference

The recommended experience for the upgrade is to use the [Azure portal](how-to-upgrade-preference.md?pivots=experience-azp). If you decide to use the Azure CLI to configure and carry out the upgrade, you should follow the steps described here in order. You can run the commands locally after [installing the Azure CLI](/cli/azure/install-azure-cli) or use the [Azure Cloud Shell](https://shell.azure.com/).

Replace the placeholders for name and resource group with your values for the App Service Environment you want to configure. To see the current upgrade preference:

```azurecli
ASE_NAME=<Your-App-Service-Environment-name>
ASE_RG=<Your-Resource-Group>
az resource show --name $ASE_NAME -g $ASE_RG --resource-type "Microsoft.Web/hostingEnvironments" --query properties.upgradePreference
```

To update the upgrade preference to **Manual**:

```azurecli
ASE_NAME=<Your-App-Service-Environment-name>
ASE_RG=<Your-Resource-Group>
az resource update --name $ASE_NAME -g $ASE_RG --resource-type "Microsoft.Web/hostingEnvironments" --set properties.upgradePreference=Manual
```

::: zone-end

::: zone pivot="experience-azp"

## Use the Azure portal to upgrade the App Service Environment

When an upgrade is available, a banner is shown in the Azure portal. Follow these steps to start the upgrade:

1. From the [Azure portal](https://portal.azure.com), navigate to the **Configuration** page for your App Service Environment.
1. Select the **Upgrade now** button.
:::image type="content" source="./media/upgrade-preference/upgrade-now.png" alt-text="Screenshot of a configuration pane to start the upgrade for the App Service Environment.":::
1. A confirmation banner appears. Select **Start upgrade** to start the upgrade process. Notifications are sent during the upgrade if you configured them. For more information, see [Configure notifications](#configure-notifications).

::: zone-end

::: zone pivot="experience-azcli"

## Use Azure CLI to upgrade the App Service Environment

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
