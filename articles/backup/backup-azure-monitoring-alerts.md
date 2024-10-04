---
title:Monitor Azure Monitor based alerts for Azure Backup
description: This article describes the new and improved alerting capabilities via Azure Monitor and the process to configure Azure Monitor.
ms.topic: how-to
ms.date: 10/10/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
ms.custom: engagement-fy24
---

# Monitor Azure Monitor based alerts for Azure Backup

This article describes how to switch to Azure Monitor based alerts for Azure Backup and monitor them.

Alerts are primarily the scenarios where you're notified to take relevant action. Azure Backup now provides new and improved alerting capabilities via Azure Monitor. If you're using the older [classic alerts solution](backup-azure-monitoring-built-in-monitor.md?tabs=recovery-services-vaults#backup-alerts-in-recovery-services-vault) for Recovery Services vaults, we recommend you move to Azure Monitor alerts.

> [!VIDEO https://www.youtube.com/embed/3zzWxWJGWPg]

## Key benefits of Azure Monitor alerts

Azure Monitor for Azure Backup provides the following key benefits:

- **Configure notifications to a wide range of notification channels**: Azure Monitor supports a wide range of notification channels, such as email, ITSM, webhooks, logic apps, and so on. You can configure notifications for backup alerts to any of these channels without investing much time in creating custom integrations.

- **Enable notifications for selective scenarios**: With Azure Monitor alerts, you can choose the scenarios to be notified about. Also, you can enable notifications for test subscriptions.

- **Monitor alerts at-scale via Backup center**: In addition to enabling you to manage the alerts from Azure Monitor dashboard, Azure Backup also provides an alert management experience tailored to backups via Backup center. This allows you to filter alerts by backup specific properties, such as workload type, vault location, and so on, and a way to get quick visibility into the active backup security alerts that need attention.

- **Manage alerts and notifications programmatically**: You can use Azure Monitor’s REST APIs to manage alerts and notifications via non-portal clients as well.

- **Consistent alert management for multiple Azure services, including backup**: Azure Monitor is the native service for monitoring resources across Azure. With the integration of Azure Backup with Azure Monitor, you can manage backup alerts in the same way as alerts for other Azure services, without requiring a separate learning curve.

## Supported alerting solutions

Azure Backup now supports different kinds of Azure Monitor based alerting solutions. You can use a combination of any of these based on your specific requirements. 

The following table lists some of these solutions:

| Alert | Utility | Description |
| --- | --- | --- |
| **Built-in Azure Monitor alerts** | Default alerts enabled for critical scenarios. | Azure Backup automatically generates built-in alerts for certain default scenarios, such as deletion of backup data, disabling of soft-delete, backup failures, restore failures, and [so on](backup-azure-monitoring-built-in-monitor.md?tabs=recovery-services-vaults#azure-monitor-alerts-for-azure-backup). You can view these alerts out of the box via Backup center. To configure notifications for these alerts (for example, emails), you can use Azure Monitor's *Alert Processing Rules* and Action groups to route alerts to a wide range of notification channels. |
| **Log/ARG based Alerts** | To write custom alerts. <br><br> - **Azure Resource Graph (ARG)**: On real time data. <br> - **LA**: On Log Analytics data (when some delay is acceptable). | If you've scenarios where an alert needs to be generated based on custom logic, you can use Log Analytics based alerts for such scenarios, provided you've configured your vaults to send diagnostics data to a Log Analytics (LA) workspace. |
| **Metric alerts**  | To write alerts for job success and cases where the health is not as expected. | You can write custom alert rules using Azure Monitor metrics to monitor the health of your backup items across different KPIs. |

## Supported scenarios

This section describes the supported monitoring scenarios for Azure Backup.

### Supported workloads and scenarios

The following table summarizes the different backup alerts currently available via Azure Monitor and the supported workload/vault types:

| **Alert Category** | **Alert Name** | **Supported workload types / vault types** | **Description** | 
| ------------------ | -------------  | ------------------------------------------ | -------- |
| Security | Delete Backup Data | - Microsoft Azure Virtual Machine <br><br> - SQL in Azure VM (non-AG scenarios) <br><br> - SAP HANA in Azure VM <br><br> - Azure Backup Agent <br><br> - DPM <br><br> - Azure Backup Server <br><br> - Azure Database for PostgreSQL Server <br><br> - Azure Blobs <br><br> - Azure Managed Disks  | This alert is fired when you stop backup and deletes backup data. <br><br> **Note** <br> If you disable the soft-delete feature for the vault, Delete Backup Data alert isn't received. |
| Security | Upcoming Purge | - Azure Virtual Machine <br><br> - SQL in Azure VM <br><br> - SAP HANA in Azure VM | For all workloads that support soft-delete, this alert is fired when the backup data for an item is 2 days away from being permanently purged by the Azure Backup service. | 
| Security | Purge Complete | - Azure Virtual Machine <br><br> - SQL in Azure VM <br><br> - SAP HANA in Azure VM | Delete Backup Data |
| Security | Soft Delete Disabled for Vault | Recovery Services vaults | This alert is fired when the soft-deleted backup data for an item has been permanently deleted by the Azure Backup service. | 
| Security | Modify Policy with Shorter Retention | - Azure Virtual Machine <br><br> - SQL in Azure VM <br><br> - SAP HANA in Azure VM <br><br> - Azure Files | This alert is fired when a backup policy is modified to use lesser retention. | 
| Security | Modify Protection with Shorter Retention | - Azure Virtual Machine <br><br> - SQL in Azure VM <br><br> - SAP HANA in Azure VM <br><br> - Azure Files | This alert is fired when a backup instance is assigned to a different policy with lesser retention. | 
| Security | MUA Disabled | Recovery Services vaults | This alert is fired when a user disables MUA functionality for vault. | 
| Security | Disable hybrid security features | Recovery Services vaults | This alert is fired when hybrid security settings are disabled for a vault. | 
| Jobs | Backup Failure | - Azure Virtual Machine <br><br> - SQL in Azure VM <br><br> - SAP HANA in Azure VM <br><br> - Azure Backup Agent <br><br> - Azure Files <br><br> - Azure Database for PostgreSQL Server <br><br> - Azure Managed Disks | This alert is fired when a backup job failure has occurred. By default, alerts for backup  failures are turned on. For more information, see the [section on turning on alerts for this scenario](#turning-on-azure-monitor-alerts-for-job-failure-scenarios). | 
| Jobs | Restore Failure | - Azure Virtual Machine <br><br> - SQL in Azure VM (non-AG scenarios) <br><br> - SAP HANA in Azure VM <br><br> - Azure Backup Agent <br><br> - Azure Files <br><br> - Azure Database for PostgreSQL Server <br><br> - Azure Blobs <br><br> - Azure Managed Disks | This alert is fired when a restore job failure has occurred. By default, alerts for restore failures are turned on. For more information, see the [section on turning on alerts for this scenario](#turning-on-azure-monitor-alerts-for-job-failure-scenarios). |
| Jobs | Unsupported backup type | - SQL in Azure VM <br><br> - SAP HANA in Azure VM | This alert is fired when the current settings for a database don't support certain backup types present in the policy. By default, alerts for unsupported backup type scenario are turned on. For more information, see the [section on turning on alerts for this scenario](#turning-on-azure-monitor-alerts-for-job-failure-scenarios). |
| Jobs | Workload extension unhealthy | - SQL in Azure VM <br><br> - SAP HANA in Azure VM | This alert is fired when the Azure Backup workload extension for database backups is in an unhealthy state that might prevent future backups from succeeding. By default, alerts for workload extension unhealthy scenario are turned on. For more information, see the [section on turning on alerts for this scenario](#turning-on-azure-monitor-alerts-for-job-failure-scenarios). |
 
> [!NOTE]
>- For Azure VM backup, backup failure alerts are not sent in scenarios where the underlying VM is deleted, or another backup job is already in progress (leading to failure of the other backup job). This is because these are scenarios where backup is expected to fail by design and hence alerts are not generated in these 2 cases.

### Supported monitoring platform

[Azure Business Continuity Center](../business-continuity-center/business-continuity-center-overview.md) enables you to view the list of all [Built-in alerts and custom alerts written on the metrics](metrics-overview.md#supported-built-in-metrics) that Microsoft offers. To view any custom alerts written on ARG, Log Analytics, Activity Logs, go to **Azure Monitor** > **Alerts**, and then select **Monitor Service** as **Log Alerts V2** and select **Signal Type** as **Log search/ Activity**. 

## Migrate from classic alerts to built-in Azure Monitor alerts

Among the different Azure Monitor based alert solutions, built-in Azure Monitor alerts come closest to classic alerts as per user experience and functionality. So, to quickly switch from classic alerts to Azure Monitor, you can use built-in Azure Monitor alerts.

The following table lists the differences between classic backup alerts and built-in Azure Monitor alerts for backup:

| Actions | Classic alerts | Built-in Azure Monitor alerts |
| --- | --- | --- |
| **Setting up notifications** | - You must enable the configure notifications feature for each Recovery Services vault, along with the email id(s) to which the notifications should be sent. <br><br> - For certain destructive operations, email notifications are sent to the subscription owner, admin and co-admin irrespective of the notification settings of the vault.| - Notifications are configured by creating an alert processing rule. <br><br> - While *alerts* are generated by default and can't be turned off for destructive operations, the notifications are in the control of the user, allowing you to clearly specify which set of email address (or other notification endpoints) you wish to route alerts to. |
| **Notification suppression for database backup scenarios** | When there are multiple failures for the same database due to the same error code, a single alert is generated (with the occurrence count updated for each failure type) and a new alert is only generated when the original alert is inactivated. | The behavior is currently different. Here, a separate alert is generated for every backup failure. If there's a window of time when backups will fail for a certain known item (for example, during a maintenance window), you can create a suppression rule to suppress email noise for that backup item during the given period. |
| **Pricing** | There are no additional charges for this solution. | Alerts for critical operations/failures generate by default (that you can view in the Azure portal or via non-portal interfaces) at no additional charge. However, to route these alerts to a notification channel (such as email), it incurs a minor charge for notifications beyond the *free tier* (of 1000 emails per month). Learn more about [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/). |

> [!NOTE]
>- If you've existing custom Azure Resource Graph (ARG) queries written on classic alerts data, you'll need to update these queries to fetch information from Azure Monitor-based alerts. You can use the *AlertsManagementResources* table in ARG to query Azure Monitor alerts data.
>- If you send classic alerts to Log Analytics workspace/Storage account/Event Hub via diagnostics settings, you'll also need to update these automation. To send the fired Azure Monitor based alerts to a destination of your choice, you can create an alert processing rule and action group that routes these alerts to a logic app, webhook, or runbook that in turn sends these alerts to the required destination.

Azure Backup now provides a guided experience via Backup center that allows you to switch to built-in Azure Monitor alerts and notifications with just a few selects. To perform this action, you need to have access to the *Backup Contributor* and *Monitoring Contributor* Azure role-based access control (Azure RBAC) roles to the subscription.

Follow these steps:

1. On the [Azure portal](https://portal.azure.com/), go to **Business Continuity Center** > **Alerts**.

1. On the **Alerts** blade, all the available alerts are listed.

   Select the alert type to take the required action.

   On the next screen, there are two recommended actions:

   - **Create rule**: This action creates an alert processing rule attached to an action group to enable you to receive notifications for Azure Monitor alerts. After you select, it leads you to a template deployment experience.

     :::image type="content" source="./media/move-to-azure-monitor-alerts/recommended-action-one.png" alt-text="Screenshot showing recommended alert migration action Create rule for Recovery Services vaults.":::

     You can deploy two resources via this template:

   - **Alert Processing Rule**: A rule that specifies alert types to be routed to each notification channel. This template deploys alert processing rules that span all Azure Monitor based alerts on all Recovery Services vaults in the subscription that the rule is created in.
   - **Action Group**: The notification channel to which alerts should be sent. This template deploys an email action group so that alerts are routed to the email ID(s) specified while deploying the template.

   To modify any of these parameters, for example, scope of alert processing rule, or choice of notification channels, you can edit these resources after creation, or you can [create the alert processing rule and action group from scratch](backup-azure-monitoring-built-in-monitor.md?tabs=recovery-services-vaults#configuring-notifications-for-alerts) via the Azure portal.

1. Enter the subscription, resource group, and region in which the alert processing rule and action group should be created. Also specify the email ID(s) to which notifications should be sent. Other parameters populate with default values and only need to be edited, if you want to customize the names and descriptions that the resources are created in.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-parameters.png" alt-text="Screenshot showing template parameters to set up notification rules for Azure Monitor alerts.":::

1. Select **Review+Create** to initiate deployment.

   Once deployed, notifications for Azure Monitor based alerts are enabled. If you have multiple subscriptions, repeat the above process to create an alert processing rule for each subscription.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/alert-processing-rule-deploy.png" alt-text="Screenshot showing deployment of notification rules for Azure Monitor alerts.":::

1. Next, you need to opt-out of classic alerts to avoid receiving duplicate alerts from two solutions.

   Select **Manage Alerts** to view the vaults for which classic alerts are currently enabled.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/recommended-action-two.png" alt-text="Screenshot showing recommended alert migration action Manage Alerts for Recovery Services vaults.":::

1. Select **Update** -> **Use only Azure Monitor alerts** checkbox.

   By doing so, you agree to receive backup alerts only via Azure Monitor, and you'll stop receiving alerts from the older (classic alerts) solution.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/classic-alerts-vault.png" alt-text="Screenshot showing how to opt out of classic alerts for vault.":::

1. To select multiple vaults on a page and update the settings for these vaults with a single action, select **Update** from the top menu.

   :::image type="content" source="./media/move-to-azure-monitor-alerts/classic-alerts-multiple-vaults.png" alt-text="Screenshot showing how to opt out of classic alerts for multiple vaults.":::

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