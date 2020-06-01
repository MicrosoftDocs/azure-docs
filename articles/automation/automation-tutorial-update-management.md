---
title: Manage updates and patches for your Azure VMs in Azure Automation
description: This article tells how to use Update Management to manage updates and patches for your Azure VMs.
services: automation
ms.subservice: update-management
ms.topic: conceptual
ms.date: 04/06/2020
ms.custom: mvc
---
# Manage updates and patches for your Azure VMs

This article describes how you can use the Azure Automation [Update Management](automation-update-management.md) feature to manage updates and patches for your Azure VMs. For pricing information, see [Automation pricing for Update Management](https://azure.microsoft.com/pricing/details/automation/).

> [!NOTE]
> Update Management supports the deployment of first-party updates and the pre-downloading of patches. This support requires changes on the systems being patched. See [Configure Windows Update settings for Azure Automation Update Management](automation-configure-windows-update.md) to learn how to configure these settings on your systems.

Before using the procedures in this article, ensure that you've enabled Update Management on your VMs using one of these techniques:

* [Enable Update Management from an Automation account](automation-onboard-solutions-from-automation-account.md)
* [Enable Update Management by browsing the Azure portal](automation-onboard-solutions-from-browse.md)
* [Enable Update Management from a runbook](automation-onboard-solutions.md)
* [Enable Update Management from an Azure VM](automation-onboard-solutions-from-vm.md)

## <a name="scope-configuration"></a>Limit the scope for the deployment

Update Management uses a scope configuration within the workspace to target the computers to receive updates. For more information, see [Limit Update Management deployment scope](automation-scope-configurations-update-management.md).

## View update assessment

To view an update assessment:

1. In your Automation account, select **Update management** under **Update management**. 

2. The updates for your environment are listed on the Update management page. If any updates are identified as missing, a list of missing updates is shown on the **Missing updates** tab.

3. Under **Information link**, select the link for an update to open the support article that gives you important information about the update.

    ![View update status](./media/automation-tutorial-update-management/manageupdates-view-status-win.png)

4. Click anywhere else on the update to open the Log Search pane. The query for the log search is predefined for that specific update. You can modify this query or create your own query to view detailed information.

    ![View update status](./media/automation-tutorial-update-management/logsearch.png)

## Configure alerts

Follow the steps below to set up alerts to let you know the status of an update deployment:

1. In your Automation account, go to **Alerts** under **Monitoring**, then click **New alert rule**.

2. On the Create alert rule page, your Automation account is already selected as the resource. If you want to change it, click **Edit resource**. 

3. On the Select a resource page, choose **Automation Accounts** from the **Filter by resource type** dropdown menu. 

4. Select the Automation account that you want to use, and then click **Done**.

5. Click **Add condition** to select the signal that's appropriate for your update deployment. The following table shows the details of the two available signals.

    |Signal Name|Dimensions|Description
    |---|---|---|
    |`Total Update Deployment Runs`|- Update Deployment Name<br>-  Status    |Alerts on the overall status of an update deployment.|
    |`Total Update Deployment Machine Runs`|- Update Deployment Name</br>- Status</br>- Target Computer</br>- Update Deployment Run ID    |Alerts on the status of an update deployment targeted at specific machines.|

6. For a dimension, select a valid value from the list. If the value you want isn't in the list, click **\+** next to the dimension and type in the custom name. Then select the value to look for. If you want to select all values for a dimension, click the **Select \*** button. If you don't choose a value for a dimension, Update Management ignores that dimension.

    ![Configure signal logic](./media/automation-tutorial-update-management/signal-logic.png)

7. Under **Alert logic**, enter values in the **Time aggregation** and **Threshold** fields, and then click **Done**.

8. On the next pane, enter a name and a description for the alert.

9. Set the **Severity** field to **Informational(Sev 2)** for a successful run or **Informational(Sev 1)** for a failed run.

    ![Configure signal logic](./media/automation-tutorial-update-management/define-alert-details.png)

10. Click **Yes** or **No**, depending on how you want to enable the alert rule.

11. If you don't want to have alerts for this rule, select **Suppress Alerts**.

## Configure action groups for your alerts

Once you have your alerts configured, you can set up an action group, which is a group of actions to use across multiple alerts. The actions can include email notifications, runbooks, webhooks, and many more. To learn more about action groups, see [Create and manage action groups](../azure-monitor/platform/action-groups.md).

1. Select an alert and then select **Create New** under **Action Groups**. 

2. Enter a full name and a short name for the action group. Update Management uses the short name when sending notifications using the specified group.

3. Under **Actions**, enter a name that specifies the action, for example, **Email Notification**. 

4. For **Action Type**, select the appropriate type, for example, **Email/SMS/Push/Voice**. 

5. Click **Edit details**.

6. Fill in the pane for your action type. For example, if using **Email/SMS/Push/Voice**, enter an action name, select the **Email** checkbox, enter a valid email address, and then click **OK**.

    ![Configure an email action group](./media/automation-tutorial-update-management/configure-email-action-group.png)

7. In the Add action group pane, click **OK**.

8. For an alert email, you can customize the email subject. Select **Customize actions** under **Create rule**, then select **Email subject**. 

9. When you're finished, click **Create alert rule**. 

## Schedule an update deployment

Scheduling an update deployment creates a [schedule](shared-resources/schedules.md) resource linked to the **Patch-MicrosoftOMSComputers** runbook that handles the update deployment on the target machines. You must schedule a deployment that follows your release schedule and service window to install updates. You can choose the update types to include in the deployment. For example, you can include critical or security updates and exclude update rollups.

>[!NOTE]
>If you delete the schedule resource from the Azure portal or using PowerShell after creating the deployment, the deletion breaks the scheduled update deployment and presents an error when you attempt to reconfigure the schedule resource from the portal. You can only delete the schedule resource by deleting the corresponding deployment schedule.  

To schedule a new update deployment:

1. In your Automation account, go to **Update management** under **Update management**, and then select **Schedule update deployment**.

2. Under **New update deployment**, use the **Name** field to enter a unique name for your deployment.

3. Select the operating system to target for the update deployment.

4. In the **Groups to update (preview)** region, define a query that combines subscription, resource groups, locations, and tags to build a dynamic group of Azure VMs to include in your deployment. To learn more, see [Use dynamic groups with Update Management](automation-update-management-groups.md).

5. In the **Machines to update** region, select a saved search, an imported group, or pick **Machines** from the dropdown menu and select individual machines. With this option, you can see the readiness of the Log Analytics agent for each machine. To learn about the different methods of creating computer groups in Azure Monitor logs, see [Computer groups in Azure Monitor logs](../azure-monitor/platform/computer-groups.md).

6. Use the **Update classifications** region to specify [update classifications](automation-view-update-assessments.md#work-with-update-classifications) for products. For each product, deselect all supported update classifications but the ones to include in your update deployment.

7. Use the **Include/exclude updates** region to select specific updates for deployment. The Include/Exclude page displays the updates by KB article ID numbers to include or exclude. 
    
   > [!IMPORTANT]
   > Remember that exclusions override inclusions. For instance, if you define an exclusion rule of `*`, Update Management excludes all patches or packages from the installation. Excluded patches still show as missing from the machines. For Linux machines, if you include a package that has a dependent package that has been excluded, Update Management doesn't install the main package.

   > [!NOTE]
   > You can't specify updates that have been superseded to include in the update deployment.

8. Select **Schedule settings**. The default start time is 30 minutes after the current time. You can set the start time to any time from 10 minutes in the future.

9. Use the **Recurrence** field to specify if the deployment occurs once or uses a recurring schedule, then click **OK**.

10. In the **Pre-scripts + Post-scripts (Preview)** region, select the scripts to run before and after your deployment. To learn more, see [Manage pre-scripts and post-scripts](pre-post-scripts.md).
    
11. Use the **Maintenance window (minutes)** field to specify the amount of time allowed for updates to install. Consider the following details when specifying a maintenance window:

    * Maintenance windows control how many updates are installed.
    * Update Management doesn't stop installing new updates if the end of a maintenance window is approaching.
    * Update Management doesn't terminate in-progress updates if the maintenance window is exceeded.
    * If the maintenance window is exceeded on Windows, it's often because a service pack update is taking a long time to install.

    > [!NOTE]
    > To avoid updates being applied outside of a maintenance window on Ubuntu, reconfigure the `Unattended-Upgrade` package to disable automatic updates. For information about how to configure the package, see the [Automatic updates topic in the Ubuntu Server Guide](https://help.ubuntu.com/lts/serverguide/automatic-updates.html).

12. Use the **Reboot options** field to specify the way to handle reboots during deployment. The following options are available: 
    * Reboot if necessary (default)
    * Always reboot
    * Never reboot
    * Only reboot; this option doesn't install updates

    > [!NOTE]
    > The registry keys listed under [Registry keys used to manage restart](/windows/deployment/update/waas-restart#registry-keys-used-to-manage-restart) can cause a reboot event if **Reboot options** is set to **Never reboot**.

13. When you're finished configuring the deployment schedule, click **Create**.

    ![Update Schedule Settings pane](./media/automation-tutorial-update-management/manageupdates-schedule-win.png)

14. You're returned to the status dashboard. Select **Scheduled Update deployments** to show the deployment schedule that you've created.

## Schedule an update deployment programmatically

To learn how to create an update deployment with the REST API, see [Software Update Configurations - Create](/rest/api/automation/softwareupdateconfigurations/create). 

You can use a sample runbook to create a weekly update deployment. To learn more about this runbook, see [Create a weekly update deployment for one or more VMs in a resource group](https://gallery.technet.microsoft.com/scriptcenter/Create-a-weekly-update-2ad359a1).

## Check deployment status

After your scheduled deployment starts, you can see its status on the **Update deployments** tab under **Update management**. The status is **In progress** when the deployment is currently running. When the deployment ends successfully, the status changes to **Succeeded**. If there are failures with one or more updates in the deployment, the status is **Partially failed**.

## View results of a completed update deployment

When the deployment is finished, you can select it to see its dashboard.

![Update deployment status dashboard for a specific deployment](./media/automation-tutorial-update-management/manageupdates-view-results.png)

Under **Update results**, a summary provides the total number of updates and deployment results on the target VMs. The table on the right shows a detailed breakdown of the updates and the installation results for each.

The available values are:

* **Not attempted** - The update wasn't installed because there was insufficient time available, based on the defined maintenance window duration.
* **Not selected** - The update wasn't selected for deployment.
* **Succeeded** - The update succeeded.
* **Failed** - The update failed.

Select **All logs** to see all log entries that the deployment has created.

Select **Output** to see the job stream of the runbook responsible for managing the update deployment on the target VMs.

Select **Errors** to see detailed information about any errors from the deployment.

## View the deployment alert

When your update deployment is finished, you receive the alert that you've specified during setup for the deployment. For example, here's an email confirming a patch.

![Configure email action group](./media/automation-tutorial-update-management/email-notification.png)

## Next steps

* For information about scope configurations, see [Limit Update Management deployment scope](automation-scope-configurations-update-management.md).
* If you need to search logs stored in your Log Analytics workspace, see [Log searches in Azure Monitor logs](../log-analytics/log-analytics-log-searches.md).
* If finished with deployments, see [Unlink workspace from Automation account for Update Management](automation-unlink-workspace-update-management.md).
* To delete your VMs from Update Management, see [Remove VMs from Update Management](automation-remove-vms-from-update-management.md).
* To troubleshoot general Update Management errors, see [Troubleshoot Update Management issues](troubleshoot/update-management.md).
* To troubleshoot problems with the Windows update agent, see [Troubleshoot Windows update agent issues](troubleshoot/update-agent-issues.md).
* To troubleshoot problems with the Linux update agent, see [Troubleshoot Linux update agent issues](troubleshoot/update-agent-issues-linux.md).