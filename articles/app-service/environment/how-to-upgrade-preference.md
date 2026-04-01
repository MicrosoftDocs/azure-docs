---
title: Set Upgrade Preference for Planned Maintenance
titleSuffix: App Service Environment
description: Configure the upgrade preference for Azure App Service Environment planned maintenance in the Azure portal or by using the Azure CLI.
author: seligj95
ms.author: jordanselig
ms.topic: how-to
ms.date: 03/17/2026
ms.service: azure-app-service
ms.custom:
  - devx-track-azurecli
  - sfi-image-nochange
#customer intent: As an App Service developer, I want to configure the upgrade preference for planned maintenance of my App Service Environment, so I can control when the upgrades happen.
---

# Set upgrade preference for App Service Environment planned maintenance

Microsoft regularly updates Azure App Service to provide new features, new runtime versions, performance improvements, and bug fixes. The upgrade process is referred to as _planned maintenance_. Upgrades happen automatically and they're applied progressively through the regions following [Advancing Safe Deployment Practices](https://azure.microsoft.com/blog/advancing-safe-deployment-practices/).

This article describes how to configure the upgrade preference for an App Service Environment v3. An App Service Environment provides a fully isolated and dedicated environment for running App Service apps securely at high scale. Because of the isolated nature of the environment, you have an opportunity to influence the upgrade process.

With App Service Environment v3, you can specify your preference for when and how the planned maintenance is applied. The upgrade can be applied automatically or manually. Even with your preference set to automatic, you have some options to influence the timing. Procedures are provided to set your preferences in the Azure portal or by using the Azure CLI.

## Prerequisites

- An App Service Environment v3. To create a new environment, follow the steps in [Quickstart: Create an App Service Environment](creation.md).

## Review automatic upgrade options

When you configure automatic upgrades, the platform upgrades your App Service Environment instance when the upgrade is available in the deployment region for the instance. You can choose from the following options:

- **None**: (Default) Upgrade automatically during the upgrade process for the region.
- **Early**: Upgrade automatically with a high prioritization compared with other instances in the region.
- **Late**: Upgrade automatically with a low prioritization compared with other instances in the region. 

In smaller regions, the Early and Late upgrade preferences might be very close to each other.

When automatic upgrades are enabled for an App Service Environment, upgrades from other Azure dependency services are permitted outside of the regional business hours. When manual upgrades are configured, these other service upgrades are gated with the App Service upgrade deployments.

## Review manual upgrade options

When you configure manual upgrades, you receive a notification when an upgrade is available. The availability is also visible in the Azure portal. After the upgrade is available, you typically have 15 days to start the upgrade process. If you don't start the upgrade within the 15 days, the upgrade is processed with the remaining automatic upgrades in the region.

Upgrades normally don't affect the availability of your apps. The upgrade adds extra instances to ensure the same capacity is available during upgrade. Patched and restarted instances are added back in rotation. When you have workloads sensitive to restarts, you should plan to start the maintenance during nonbusiness hours. The full upgrade process normally finishes within 18 hours, but can take longer. After the upgrade starts, the upgrade runs until it's complete and isn't paused during standard business hours.

### Important considerations

If you choose manual upgrades, there are important considerations to keep in mind:

- **You might receive less than 15 days notice**. Microsoft usually provides a 15-day notice before the upgrade is applied automatically. In rare cases, the notice period is less than 15 days. The "End Time" for the planned maintenance event that you receive always indicates the end of the notice period.

- **A manual upgrade can transition to automatic**. In rare cases, the availability of an upgrade for manual application can transition to an automatic upgrade. A security hotfix might supersede the planned upgrade. A regression might be discovered in a planned upgrade before the updates are applied to your instance. In these cases, the available upgrade is removed and the process transitions to automatic upgrade.

- **An upgrade is available, but you don't receive a notification**. You might see a notice in the Azure portal that an upgrade is available for your App Service Environment, but you don't receive a Service Health notification. (Notifications are sent according to [your configuration](#configure-notifications).) If you don't receive the notification, the available upgrade isn't required and the 15-day time limit doesn't apply. This issue is currently under investigation.

## View upgrade notifications

When an upgrade is available, the platform adds an upgrade event on the Service Health dashboard.

1. In the [Azure portal](https://portal.azure.com), go to the  **Azure Monitor** > **Service Health** dashboard.

1. To see the list of available (unapplied) upgrades, expand the **ACTIVE EVENTS** > **Planned maintenance** section.

1. Use the filters (**Scope**, **Subscription**, **Region**, **Service**, **Event tags**) and adjust the list results as needed.

   :::image type="content" source="./media/upgrade-preference/service-health-dashboard.png" border="false" alt-text="Screenshot of the Azure Monitor, Service Health dashboard in the Azure portal showing a filtered list of available upgrades.":::

1. To see more information about a specific upgrade, select the upgrade name in the list. A pane opens showing a summary about the upgrade. Select **Issue Updates**, **Impacted Services**, and **Impacted Resources** for more details.

   :::image type="content" source="./media/upgrade-preference/upgrade-event-details.png" alt-text="Screenshot that shows detailed for a selected upgrade in the Azure portal." lightbox="./media/upgrade-preference/upgrade-event-details-large.png":::

## Configure notifications

You can configure alerts to send a message to your email address or SMS phone number when an event is generated in Azure Monitor. You can also set up a trigger for your custom Azure Function or Logic App, which allows you to automatically take action on your resources. You might use the action to automatically divert traffic from your App Service Environment in one region that's being upgraded to an App Service Environment in another region. After the upgrade completes, you can automatically change the traffic back to normal.

1. In the [Azure portal](https://portal.azure.com), go to the  **Azure Monitor** > **Service Health** dashboard.

1. On the right, select **Create service health alert**:

   :::image type="content" source="./media/upgrade-preference/create-service-health-alert.png" alt-text="Screenshot that shows how to select 'Create service health alert' in the Azure portal.":::

1. Configure the new alert by following the instructions in [Create service health alerts](/azure/service-health/alerts-activity-log-service-notifications-portal).

1. [Create and manage action groups](/azure/azure-monitor/alerts/action-groups) that trigger based on the alert.

For more information, see [What are Azure Monitor alerts?](/azure/azure-monitor/alerts/alerts-overview)

## Test notifications for manual upgrades

As you build your automation and notification logic, you want to test it before an actual upgrade occurs. It might be month or more before an upgrade is available.

If you set the **Upgrade preference** for your App Service Environment to **Manual**, you can send a test upgrade available notification. The test helps you verify your automation logic. The test message is similar to a real notification, but the title is prefixed with "[Test]" and the description details are different.

1. In the [Azure portal](https://portal.azure.com), go to your **App Service Environment** resource.

1. In the left menu, select **Settings** > **Configuration**.

1. Locate the **Upgrade preference** setting, and select the **Send test notification** link.

   :::image type="content" source="./media/upgrade-preference/send-test-notification.png" alt-text="Screenshot that shows how to select 'Send test notification' for an App Service Environment with manual upgrade preference in the Azure portal.":::

   Test notifications are sent in batches every 15 minutes.

1. Allow time for the notification to send. [Verify the test notification](#view-upgrade-notifications) is listed on the **Service Health** dashboard in the Azure portal.

You can also send a test notification by using the Azure CLI. For more information, see the procedure described in [Apply upgrade to App Service Environment (Azure CLI)](#apply-upgrade-to-app-service-environment).

## Configure upgrade preference

Use the following procedure to configure the upgrade preference for your App Service Environment. The recommended approach is to use the Azure portal.

# [Azure portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), go to your **App Service Environment** resource.

1. In the left menu, select **Settings** > **Configuration**.

1. Locate the **Upgrade preference** setting, and select **Automatic** or **Manual**.

   :::image type="content" source="./media/upgrade-preference/configure-upgrade-preference.png" alt-text="Screenshot that shows how to configure the upgrade preference for the App Service Environment in the Azure portal.":::

1. Select **Apply** for your changes to take effect.

# [Azure CLI](#tab/azure-cli)

Run the following commands with the [Azure CLI](/cli/azure/install-azure-cli) or use the [Azure Cloud Shell](https://shell.azure.com/).

1. Set the `<placeholder>` command parameters to the values for your App Service Environment:

   ```azurecli
   ASE_NAME=<App-Service-Environment>
   ASE_RG=<Resource-Group>
   ```

1. View the current upgrade preference for the App Service Environment:

   ```azurecli
   az resource show --name $ASE_NAME -g $ASE_RG --resource-type "Microsoft.Web/hostingEnvironments" --query properties.upgradePreference
   ```

   The output displays "Manual" for manual upgrade, or the automatic upgrade type: "Early," "Late," or "None."

1. Configure the **Upgrade preference** setting for the App Service Environment:

   - For manual upgrade, set the `upgradePreference` property to **Manual**:

      ```azurecli
      az resource update --name $ASE_NAME -g $ASE_RG --resource-type "Microsoft.Web/hostingEnvironments" --set properties.upgradePreference=Manual
      ```

      The output shows a detailed listing of the property settings for the App Service Environment.

      Confirm the upgrade preference is set as expected:

      ```output
      "upgradePreference": "Manual",
      ```

   - For automatic upgrade, set the `upgradePreference` property to the automatic value: **Early**, **Late**, or **None**. The following example sets the preference to **Early** automatic upgrades:

      ```azurecli
      az resource update --name $ASE_NAME -g $ASE_RG --resource-type "Microsoft.Web/hostingEnvironments" --set properties.upgradePreference=Early
      ```

      Confirm the upgrade preference is set as expected:
      
      ```output
      "upgradePreference": "Early",
      ```

---

## Apply upgrade to App Service Environment

When an upgrade is available, a banner displays in the Azure portal. Use the following procedure to apply the upgrade to your App Service Environment.

# [Azure portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), go to your **App Service Environment** resource.

1. In the left menu, select **Settings** > **Configuration**.

1. Locate the **Upgrade preference** setting, and select **Upgrade now**:

   :::image type="content" source="./media/upgrade-preference/upgrade-now.png" alt-text="Screenshot that shows how to start the upgrade process for an App Service Environment in the Azure portal.":::

   The portal displays a confirmation message.

1. Select **Start upgrade** to upgrade.

# [Azure CLI](#tab/azure-cli)

Run the following commands with the [Azure CLI](/cli/azure/install-azure-cli) or use the [Azure Cloud Shell](https://shell.azure.com/).

The following procedure sends a test upgrade notification for the App Service Environment, and demonstrates how to initiate the upgrade process.

1. Set the `<placeholder>` command parameters to the values for your App Service Environment:

   ```azurecli
   ASE_NAME=<App-Service-Environment>
   ASE_RG=<Resource-Group>
   ```

1. Get your App Service Environment ID:

   ```azurecli
   ASE_ID=$(az appservice ase show --name $ASE_NAME --resource-group $ASE_RG --query id --output tsv)
   ```

1. Start the upgrade process:

   ```azurecli
   az rest --method POST --uri "${ASE_ID}/upgrade?api-version=2022-03-01"
   ```

---

During the upgrade process, the platform sends notifications, according to [your configuration](#configure-notifications).

## Related content

- [Create an App Service Environment](creation.md)
- [Create service health alerts](/azure/service-health/alerts-activity-log-service-notifications-portal)
- [App Service Environment networking](networking.md)
