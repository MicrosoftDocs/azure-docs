---
title: Switch to Azure Monitor based alerts for Azure Backup
description: This article describes the new and improved alerting capabilities via Azure Monitor and the process to configure Azure Monitor.
ms.topic: how-to
ms.date: 03/27/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
ms.custom: engagement-fy24
---

# Switch to Azure Monitor based alerts for Azure Backup

Azure Backup now provides new and improved alerting capabilities via Azure Monitor. If you're using the older [classic alerts solution](backup-azure-monitoring-built-in-monitor.md?tabs=recovery-services-vaults#backup-alerts-in-recovery-services-vault) for Recovery Services vaults, we recommend you move to Azure Monitor alerts.



## Notification for backup alerts

> [!NOTE]
> Configuration of notification can be done only through the Azure portal. PS/CLI/REST API/Azure Resource Manager Template client is currently not supported.

Once an alert is raised, you're notified. Azure Backup provides a built-in notification mechanism via email. You can specify individual email addresses or distribution lists to be notified when an alert is generated. You can also choose if you need to receive notified for each individual alert or to group them in an hourly digest and then get notified.

:::image type="content" source="./media/backup-azure-monitoring-laworkspace/recovery-services-vault-built-in-notification-inline.png" alt-text="Screenshot of the Recovery Services vault built-in email notification." lightbox="./media/backup-azure-monitoring-laworkspace/recovery-services-vault-built-in-notification-expanded.png":::

When notification is configured, you'll receive a welcome or introductory email. This confirms that Azure Backup can send emails to these addresses when an alert is raised.

If the frequency was set to an hourly digest, and an alert was raised and resolved within an hour, it won't be a part of the upcoming hourly digest.

> [!NOTE]
>- If a destructive operation, such as **stop protection with delete data** is performed, an alert is raised and an email is sent to subscription owners, admins, and co-admins even if notifications aren't configured for the Recovery Services vault.
>- To configure notification for successful jobs, use [Log Analytics](backup-azure-monitoring-use-azuremonitor.md#using-log-analytics-workspace).

## Inactivating alerts

To inactivate/resolve an active alert, you can select the list item corresponding to the alert you wish to inactivate. This opens up a screen that shows detailed information about the alert, with an **Inactivate** button at the top. Selecting this button will change the status of the alert to **Inactive**. You may also inactivate an alert by right-clicking the list item corresponding to that alert and selecting **Inactivate**.

:::image type="content" source="./media/backup-azure-monitoring-laworkspace/vault-alert-inactivate.png" alt-text="Screenshot showing how to inactivate alerts via Backup center.":::





## Suppress notifications during a planned maintenance window

For certain scenarios, you might want to suppress notifications for a particular window of time when backups are going to fail. This is especially important for database backups, where log backups could happen as frequently as every 15 minutes, and you don't want to receive a separate notification every 15 minutes for each failure occurrence. In such a scenario, you can create a second alert processing rule that exists alongside the main alert processing rule used for sending notifications. The second alert processing rule won't be linked to an action group, but is used to specify the time for notification types that should be suppressed.

By default, the suppression alert processing rule takes priority over the other alert processing rule. If a single fired alert is affected by different alert processing rules of both types, the action groups of that alert will be suppressed.

To create a suppression alert processing rule, follow these steps:

1. Go to **Backup center** > **Alerts**, and select **Alert processing rules**.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-blade-inline.png" alt-text="Screenshot showing alert processing rules blade in portal." lightbox="./media/move-to-azure-monitor-alerts/alert-processing-rule-blade-expanded.png":::

1. Select **Create**.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-create.png" alt-text="Screenshot showing creation of new alert processing rule.":::

1. Select **Scope**, for example, subscription or resource group, that the alert processing rule should span.

   You can also select more granular filters if you want to suppress notifications only for a particular backup item. For example, if you want to suppress notifications for *testdb1* database in the Virtual Machine *VM1*, you can specify filters "where Alert Context (payload) contains `/subscriptions/00000000-0000-0000-0000-0000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/VM1/providers/Microsoft.RecoveryServices/backupProtectedItem/SQLDataBase;MSSQLSERVER;testdb1`".
   
   To get the required format of your required backup item, see the *SourceId field* from the [Alert details page](backup-azure-monitoring-built-in-monitor.md?tabs=recovery-services-vaults#viewing-fired-alerts-in-the-azure-portal).

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-scope.png" alt-text="Screenshot showing specified scope of alert processing rule.":::

1. Under **Rule Settings**, select **Suppress notifications**.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-settings.png" alt-text="Screenshot showing alert processing rule settings.":::

1. Under **Scheduling**, select the window of time for which the alert processing rule will apply.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-schedule.png" alt-text="Screenshot showing alert processing rules scheduling.":::

1. Under **Details**, specify the subscription, resource group, and name under that the alert processing rule should be created.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-details.png" alt-text="Screenshot showing alert processing rules details.":::

1. Select **Review+Create**.

   If your suppression windows are one-off scenarios and not recurring, you can **Disable** the alert processing rule once you don't need it anymore. You can enable it again in future when you have a new maintenance window in the future.

## Programmatic options

You can also use programmatic methods to opt-out of classic alerts and manage Azure Monitor notifications.

### Opt out of classic backup alerts

In the following sections, you'll learn how to opt out of classic backup alert solution using the supported clients. 

#### Using Azure Resource Manager (ARM)/ Bicep/ REST API/ Azure Policy

The **monitoringSettings** vault property helps you specify if you want to disable classic alerts. You can create a custom ARM/Bicep template or Azure Policy to modify this setting for your vaults.

The following example of the vault settings property shows that the classic alerts are disabled and built-in Azure Monitor alerts are enabled for all job failures.

   ```json
   {
      "monitoringSettings": {
         "classicAlertsForCriticalOperations": "Disabled",
         "azureMonitorAlertSettings": {
            "alertsForAllJobFailures": "Enabled"
         }
      }
   }
   ```

#### Using Azure PowerShell

To modify the alert settings of the vault, use the [Update-AzRecoveryServicesVault](/powershell/module/az.recoveryservices/update-azrecoveryservicesvault) command.

The following example helps you to enable built-in Azure Monitor alerts for job failures and disables classic alerts:

```azurepowershell
Update-AzRecoveryServicesVault -ResourceGroupName testRG -Name testVault -DisableClassicAlerts $true -DisableAzureMonitorAlertsForJobFailure $false
```

### Using Azure CLI

 To modify the alert settings of the vault, use the [az backup vault backup-properties set](/cli/azure/backup/vault/backup-properties?view=azure-cli-latest&preserve-view=true) command.

The following example helps you to enable built-in Azure Monitor alerts for job failures and disables classic alerts.

```azurecli-interactive
az backup vault backup-properties set \
	--name testVault \
	--resource-group testRG \
    --clasic-alerts  Disable \
    --alerts-for-job-failures Enable
```

### Set up notifications for Azure Monitor alerts

You can use the following standard programmatic interfaces supported by Azure Monitor to manage action groups and alert processing rules.

- [Azure Monitor REST API reference](/rest/api/monitor/)
- [Azure Monitor PowerShell reference](/powershell/module/az.monitor/)
- [Azure Monitor CLI reference](/cli/azure/monitor?view=azure-cli-latest&preserve-view=true)

#### Using Azure Resource Manager (ARM)/ Bicep/ REST API

You can use [these sample ARM and Bicep templates](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.recoveryservices/recovery-services-create-alert-processing-rule) that create an alert processing rule and action group associated to all Recovery Services vaults in the selected subscription.

#### Using Azure PowerShell

As described in earlier sections, you need an action group (notification channel) and alert processing rule (notification rule) to configure notifications for your vaults.

To configure the notification, run the following cmdlet:

1. Create an action group associated with an email ID using the [New-AzActionGroupReceiver](/powershell/module/az.monitor/new-azactiongroupreceiver) cmdlet and the [Set-AzActionGroup](/powershell/module/az.monitor/set-azactiongroup) cmdlet.

   ```powershell
   $email1 = New-AzActionGroupReceiver -Name 'user1' -EmailReceiver -EmailAddress 'user1@contoso.com'
   Set-AzActionGroup -Name "testActionGroup" -ResourceGroupName "testRG" -ShortName "testAG" -Receiver $email1
   ```

1. Create an alert processing rule that's linked to the above action group using the [Set-AzAlertProcessingRule](/powershell/module/az.alertsmanagement/set-azalertprocessingrule) cmdlet.

   ```powershell
   Set-AzAlertProcessingRule -ResourceGroupName "testRG" -Name "AddActionGroupToSubscription" -Scope "/subscriptions/xxxx-xxx-xxxx" -FilterTargetResourceType "Equals:Microsoft.RecoveryServices/vaults" -Description "Add ActionGroup1 to alerts on all RS vaults in subscription" -Enabled "True" -AlertProcessingRuleType "AddActionGroups" -ActionGroupId "/subscriptions/xxxx-xxx-xxxx/resourcegroups/testRG/providers/microsoft.insights/actiongroups/testActionGroup"
   ```

#### Using Azure CLI

As described in earlier sections, you need an action group (notification channel) and alert processing rule (notification rule) to configure notifications for your vaults.

To configure the same, run the following commands:

1. Create an action group associated with an email ID using the [az monitor action-group create](/cli/azure/monitor/action-group?view=azure-cli-latest&preserve-view=true#az-monitor-action-group-create) command.

   ```azurecli-interactive
   az monitor action-group create --name testag1 --resource-group testRG --short-name testag1 --action email user1 user1@contoso.com --subscription "Backup PM Subscription"
   ```

1. Create an alert processing rule that is linked to the above action group using the [az monitor alert-processing-rule create](/cli/azure/monitor/alert-processing-rule?view=azure-cli-latest&preserve-view=true#az-monitor-alert-processing-rule-create) command.

   ```azurecli-interactive
   az monitor alert-processing-rule create \
   --name 'AddActionGroupToSubscription' \
   --rule-type AddActionGroups \
   --scopes "/subscriptions/xxxx-xxx-xxxx" \
   --filter-resource-type Equals "Microsoft.RecoveryServices/vaults"
   --action-groups "/subscriptions/xxxx-xxx-xxxx/resourcegroups/testRG/providers/microsoft.insights/actiongroups/testag1" \
   --enabled true \
   --resource-group testRG \
   --description "Add ActionGroup1 to all RS vault alerts in subscription"
   ```

## Next steps
Learn more about [Azure Backup monitoring and reporting](monitoring-and-alerts-overview.md).