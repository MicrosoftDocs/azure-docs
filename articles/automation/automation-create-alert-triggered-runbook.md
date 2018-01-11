---
title: Respond to Azure alerts with an automation runbook | Microsoft Docs
description: Learn how to trigger a runbook to run when Azure alerts are raised.
services: automation
keywords: 
author: georgewallace
ms.author: gwallace
ms.date: 01/11/2017
ms.topic: article
manager: carmonm
---
# Respond to Azure alerts with an automation runbook

[Azure monitor](../monitoring-and-diagnostics/monitoring-overview-azure-monitor.md?toc=%2fazure%2fautomation%2ftoc.json) provides base-level metrics and logs for most services within Microsoft Azure. Azure automation runbooks can be called using [action groups](../monitoring-and-diagnostics/monitoring-action-groups.md?toc=%2fazure%2fautomation%2ftoc.json) or from classic alerts to automate tasks based on the alerts. This article shows you how to configure and run a runbook based off of these alerts.

## Alert types

Runbooks are supported actions on all three types of alerts. When an alert calls the runbook, the actual call is an HTTP POST request to the webhook. The body of the POST request contains a JSON-formated object that contains useful properties related to the alert. The following table contains links to the payload schema for each alert type:

|Alert  |Description|Payload Schema  |
|---------|---------|---------|
|[Classic metric alert](../monitoring-and-diagnostics/insights-alerts-portal.md?toc=%2fazure%2fautomation%2ftoc.json)    |Receive a notification when any platform-level metric meets a specific condition (for example, CPU % on a VM is greater than 90 for the past 5 minutes).| [Payload schema](../monitoring-and-diagnostics/insights-webhooks-alerts.md?toc=%2fazure%2fautomation%2ftoc.json#payload-schema)         |
|[Activity log alert](../monitoring-and-diagnostics/monitoring-activity-log-alerts.md?toc=%2fazure%2fautomation%2ftoc.json)    |Receive a notification when any new event in the Azure Activity Log matches specific conditions (for example, when a "Delete VM" operation occurs in myProductionResourceGroup or when a new Service Health event with "Active" as the status appears).| [Payload schema](../monitoring-and-diagnostics/insights-auditlog-to-webhook-email.md?toc=%2fazure%2fautomation%2ftoc.json#payload-schema)        |
|[Near real-time metric alert](../monitoring-and-diagnostics/monitoring-near-real-time-metric-alerts.md?toc=%2fazure%2fautomation%2ftoc.json)    |Receive a notification faster than metric alerts when one or more platform-level metrics meet specified conditions (for example, CPU % on a VM is greater than 90 and Network In is greater than 500 MB for the past 5 minutes).| [Payload schema](../monitoring-and-diagnostics/monitoring-near-real-time-metric-alerts.md?toc=%2fazure%2fautomation%2ftoc.json#payload-schema)          |

Since the data provided by each alert is different, each alert needs to be handled differently. In the next section, you learn how to create a runbook to handle these different types of alerts.

## Create a runbook to handle alerts

To use automation with alerts, you need a runbook that has logic to manage the alert JSON payload that is passed to the runbook. The following example runbook must be called from an Azure alert. As described in the preceding section, each type of alert type has a different schema. The script takes in the webhook data in the `WebhookData` runbook input parameter from an alert and evaluates the JSON payload to determine which alert type was used. The following example would be used on an alert from a VM. It retrieves the VM data from the payload, and uses that information to stop the VM. The connection must be set up in the Automation account where the runbook is ran.

The runbook uses the **AzureRunAsConnection** [run as account](automation-create-runas-account.md) to authenticate with Azure in order to perform the management action against the VM.

The following PowerShell script can be altered for use with many different resources.

Take the following example and create a runbook called **Stop-AzureVmInResponsetoVMAlert** with the sample PowerShell.

1. Open your Automation account.
1. Click **Runbooks** under **PROCESS AUTOMATION**. The list of runbooks is displayed.
1. Click the **Add a runbook** button found at the top of the list. On the **Add Runbook page**, select **Quick Create**.
1. Enter "Stop-AzureVmInResponsetoVMAlert" for the runbook **Name**, and select **PowerShell** for **Runbook type**. Click **Create**.
1. Copy the following PowerShell example into the edit pane. Click **Publish** to save and publish the runbook.

```powershell-interactive
<#
.SYNOPSIS
  This runbook will stop an ARM (V2) VM in response to an Azure alert trigger.

.DESCRIPTION
  This runbook will stop an ARM (V2) VM in response to an Azure alert trigger.
  Input is alert data with information needed to identify which VM to stop.
  
  DEPENDENCIES
  - The runbook must be called from an Azure alert via a webhook.
  
  REQUIRED AUTOMATION ASSETS
  - An Automation connection asset called "AzureRunAsConnection" that is of type AzureRunAsConnection.
  - An Automation certificate asset called "AzureRunAsCertificate".

.PARAMETER WebhookData
   Optional (user does not need to enter anything, but the service will always pass an object)
   This is the data that is sent in the webhook that is triggered from the alert.

.NOTES
   AUTHOR: Azure Automation Team
   LASTEDIT: 2017-11-22
#>

[OutputType("PSAzureOperationResponse")]

param
(
    [Parameter (Mandatory=$false)]
    [object] $WebhookData
)

$ErrorActionPreference = "stop"

if ($WebhookData)
{
    # Get the data object from WebhookData
    $WebhookBody = (ConvertFrom-Json -InputObject $WebhookData.RequestBody)

    # Get the info needed to identify the VM (depends on the payload schema)
    $schemaId = $WebhookBody.schemaId
    Write-Verbose "schemaId: $schemaId" -Verbose
    if ($schemaId -eq "AzureMonitorMetricAlert") {
        # This is the near-real-time Metric Alert schema
        $AlertContext = [object] ($WebhookBody.data).context
        $ResourceName = $AlertContext.resourceName
        $status = ($WebhookBody.data).status
    }
    elseif ($schemaId -eq "Microsoft.Insights/activityLogs") {
        # This is the Activity Log Alert schema
        $AlertContext = [object] (($WebhookBody.data).context).activityLog
        $ResourceName = (($AlertContext.resourceId).Split("/"))[-1]
        $status = ($WebhookBody.data).status
    }
    elseif ($schemaId -eq $null) {
        # This is the original Metric Alert schema
        $AlertContext = [object] $WebhookBody.context
        $ResourceName = $AlertContext.resourceName
        $status = $WebhookBody.status
    }
    else {
        # Schema not supported
        Write-Error "The alert data schema - $schemaId - is not supported."
    }

    Write-Verbose "status: $status" -Verbose
    if ($status -eq "Activated")
    {
        $ResourceType = $AlertContext.resourceType
        $ResourceGroupName = $AlertContext.resourceGroupName
        $SubId = $AlertContext.subscriptionId
        Write-Verbose "resourceType: $ResourceType" -Verbose
        Write-Verbose "resourceName: $ResourceName" -Verbose
        Write-Verbose "resourceGroupName: $ResourceGroupName" -Verbose
        Write-Verbose "subscriptionId: $SubId" -Verbose

        # Do work only if this is a V2 VM
        if ($ResourceType -eq "Microsoft.Compute/virtualMachines")
        {
            # This is an ARM (V2) VM
            Write-Verbose "This is an ARM (V2) VM." -Verbose

            # Authenticate to Azure with service principal and certificate and set subscription
            Write-Verbose "Authenticating to Azure with service principal and certificate" -Verbose
            $ConnectionAssetName = "AzureRunAsConnection"
            Write-Verbose "Get connection asset: $ConnectionAssetName" -Verbose
            $Conn = Get-AutomationConnection -Name $ConnectionAssetName
            if ($Conn -eq $null)
            {
                throw "Could not retrieve connection asset: $ConnectionAssetName. Check that this asset exists in the Automation account."
            }
            Write-Verbose "Authenticating to Azure with service principal." -Verbose
            Add-AzureRMAccount -ServicePrincipal -Tenant $Conn.TenantID -ApplicationId $Conn.ApplicationID -CertificateThumbprint $Conn.CertificateThumbprint | Write-Verbose
            Write-Verbose "Setting subscription to work against: $SubId" -Verbose
            Set-AzureRmContext -SubscriptionId $SubId -ErrorAction Stop | Write-Verbose

            # Stop the ARM (V2) VM
            Write-Verbose "Stopping the VM - $ResourceName - in resource group - $ResourceGroupName -" -Verbose
            Stop-AzureRmVM -Name $ResourceName -ResourceGroupName $ResourceGroupName -Force
            # [OutputType(PSAzureOperationResponse")]
        }
        else {
            # ResourceType not supported
            Write-Error "$ResourceType is not a supported resource type for this runbook."
        }
    }
    else {
        # The alert status was not 'Activated' so no action taken
        Write-Verbose ("No action taken. Alert status: " + $status) -Verbose
    }
}
else {
    # Error
    Write-Error "This runbook is meant to be started from an Azure alert webhook only."
}
```

## Create an action group

An action group is a collection of actions that are taken based off of an alert. Runbooks are just one of the many actions that are available with action groups.

1. In the portal, select **Monitor**.

1. Select **Action groups** under **SETTINGS**.

1. Select **Add action group**, and fill in the fields.

1. Enter a name in the Action group name box, and enter a name in the Short name box. The short name is used in place of a full action group name when notifications are sent using this group.

1. The Subscription box autofills with your current subscription. This subscription is the one in which the action group is saved.
Select the Resource group in which the action group is saved.

For this example, you create two actions, a runbook action and a notification action.

### Runbook action

The following steps create a runbook action within the action group.

1. Under **Actions**, give the action a name.

1. Select **Automation Runbook** for the **Action Type**.

1. Under **Details** select, **Edit Details**

1. On the **Configure Runbook** page, select **User** under **Runbook source**.

1. Choose your **Subscription** and **Automation account**, and finally select the runbook you created in the preceding step called "Stop-AzureVmInResponsetoVMAlert".

1. When done, click **OK**.

### Notification action

The following steps create a notification action within the action group.

1. Under **Actions**, give the action a name.

1. Select **Email** for the **Action Type**.

1. Under **Details** select, **Edit Details**

1. On the **Email** page, enter the email address to notify and click **OK**. Adding an email address as well as the runbook as an action is helpful as you are notified when the runbook is started. Your action group should look like the following image:

   ![Add action group page](./media/automation-create-alert-triggered-runbook/add-action-group.png)

1. Click **OK** to create the action group.

With the action group created, you can create [activity log alerts](../monitoring-and-diagnostics/monitoring-activity-log-alerts.md?toc=%2fazure%2fautomation%2ftoc.json) or [near real-time alerts](../monitoring-and-diagnostics/monitor-alerts-unified-usage#create-an-alert-rule-with-the-azure-portal.md/?toc=%2fazure%2fautomation%2ftoc.json) and use the action group you created.

## Classic alert

Classic alerts are based on metrics and do not use action groups, but have runbook actions based on them. To create a classic alert, use the following steps:

1. Select **+ Add metric alert**.

1. Name your metric alert 'myVMCPUAlert', and provide a brief description for the alert.

1. Set the Condition for the metric alert as 'Greater than', set the Threshold as '10', and set the Period as 'Over the last 5 minutes'.

1. Under **Take action**, select **Run a runbook from this alert**

1. On the **Configure Runbook** page, select **User** for **Runbook source**. Choose your automation account and select the **Stop-AzureVmInResponsetoVMAlert** runbook. Click **OK**, and then click **OK** again to save the alert rule.

## Next steps

* For more information on starting automation runbooks with webhooks, see [Start a runbook from a webhook](automation-webhooks.md)
* For details on different ways to start a runbook, see [Starting a Runbook](automation-starting-a-runbook.md).
* To learn how to create an activity log alert, see [Create activity log alerts](../monitoring-and-diagnostics/monitoring-activity-log-alerts.md?toc=%2fazure%2fautomation%2ftoc.json)
* To see how to create a near real-time alert, visit [Create an alert rule with the Azure portal](../monitoring-and-diagnostics/monitor-alerts-unified-usage#create-an-alert-rule-with-the-azure-portal.md/?toc=%2fazure%2fautomation%2ftoc.json).