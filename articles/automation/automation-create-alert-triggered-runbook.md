---
title: Use an alert to trigger an Azure Automation runbook
description: Learn how to trigger a runbook to run when an Azure alert is raised.
services: automation
ms.service: automation
ms.component: process-automation
author: georgewallace
ms.author: gwallace
ms.date: 09/18/2018
ms.topic: conceptual
manager: carmonm
---
# Use an alert to trigger an Azure Automation runbook

You can use [Azure Monitor](../azure-monitor/overview.md?toc=%2fazure%2fautomation%2ftoc.json) to monitor base-level metrics and logs for most services in Azure. You can call Azure Automation runbooks by using [action groups](../monitoring-and-diagnostics/monitoring-action-groups.md?toc=%2fazure%2fautomation%2ftoc.json) or by using classic alerts to automate tasks based on alerts. This article shows you how to configure and run a runbook by using alerts.

## Alert types

You can use automation runbooks with three alert types:
* Classic metric alerts
* Activity log alerts
* Near real-time metric alerts

When an alert calls a runbook, the actual call is an HTTP POST request to the webhook. The body of the POST request contains a JSON-formated object that has useful properties that are related to the alert. The following table lists links to the payload schema for each alert type:

|Alert  |Description|Payload schema  |
|---------|---------|---------|
|[Classic metric alert](../monitoring-and-diagnostics/insights-alerts-portal.md?toc=%2fazure%2fautomation%2ftoc.json)    |Sends a notification when any platform-level metric meets a specific condition. For example, when the value for **CPU %** on a VM is greater than **90** for the past 5 minutes.| [Class metric alert payload schema](../monitoring-and-diagnostics/insights-webhooks-alerts.md?toc=%2fazure%2fautomation%2ftoc.json#payload-schema)         |
|[Activity log alert](../monitoring-and-diagnostics/monitoring-activity-log-alerts.md?toc=%2fazure%2fautomation%2ftoc.json)    |Sends a notification when any new event in the Azure activity log matches specific conditions. For example, when a `Delete VM` operation occurs in **myProductionResourceGroup** or when a new Azure Service Health event with an **Active** status appears.| [Activity log alert payload schema](../monitoring-and-diagnostics/monitoring-activity-log-alerts-webhook.md)        |
|[Near real-time metric alert](../monitoring-and-diagnostics/monitoring-near-real-time-metric-alerts.md?toc=%2fazure%2fautomation%2ftoc.json)    |Sends a notification faster than metric alerts when one or more platform-level metrics meet specified conditions. For example, when the value for **CPU %** on a VM is greater than **90**, and the value for **Network In** is greater than **500 MB** for the past 5 minutes.| [Near real-time metric alert payload schema](../monitoring-and-diagnostics/insights-webhooks-alerts.md?toc=%2fazure%2fautomation%2ftoc.json#payload-schema)          |

Because the data that's provided by each type of alert is different, each alert type is handled differently. In the next section, you learn how to create a runbook to handle different types of alerts.

## Create a runbook to handle alerts

To use Automation with alerts, you need a runbook that has logic that manages the alert JSON payload that's passed to the runbook. The following example runbook must be called from an Azure alert.

As described in the preceding section, each type of alert has a different schema. The script takes in the webhook data in the `WebhookData` runbook input parameter from an alert. Then, the script evaluates the JSON payload to determine which alert type was used.

This example uses an alert from a VM. It retrieves the VM data from the payload, and then uses that information to stop the VM. The connection must be set up in the Automation account where the runbook is run. When using alerts to trigger runbooks, it is important to check the status of the alert in the runbook that is triggered. The runbook will trigger each time the alert changes state. Alerts have multiple states, the two most common states are `Activated` and `Resolved`. Check for this state in your runbook logic to ensure that your runbook does not run more than once. The example in this article shows how to look for `Activated` alerts only.

The runbook uses the **AzureRunAsConnection** [Run As account](automation-create-runas-account.md) to authenticate with Azure to perform the management action against the VM.

Use this example to create a runbook called **Stop-AzureVmInResponsetoVMAlert**. You can modify the PowerShell script, and use it with many different resources.

1. Go to your Azure Automation account.
1. Under **PROCESS AUTOMATION**, select **Runbooks**.
1. At the top of the list of runbooks, select **Add a runbook**. 
1. On the **Add Runbook** page, select **Quick Create**.
1. For the runbook name, enter **Stop-AzureVmInResponsetoVMAlert**. For the runbook type, select **PowerShell**. Then, select **Create**.  
1. Copy the following PowerShell example into the **Edit** pane. 

    ```powershell-interactive
    <#
    .SYNOPSIS
    This runbook stops a resource management VM in response to an Azure alert trigger.

    .DESCRIPTION
    This runbook stops a resource management VM in response to an Azure alert trigger.
    The input is alert data that has the information required to identify which VM to stop.
    
    DEPENDENCIES
    - The runbook must be called from an Azure alert via a webhook.
    
    REQUIRED AUTOMATION ASSETS
    - An Automation connection asset called "AzureRunAsConnection" that is of type AzureRunAsConnection.
    - An Automation certificate asset called "AzureRunAsCertificate".

    .PARAMETER WebhookData
    Optional. (The user doesn't need to enter anything, but the service always passes an object.)
    This is the data that's sent in the webhook that's triggered from the alert.

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
        # Get the data object from WebhookData.
        $WebhookBody = (ConvertFrom-Json -InputObject $WebhookData.RequestBody)

        # Get the info needed to identify the VM (depends on the payload schema).
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
            # The schema isn't supported.
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

            # Use this only if this is a resource management VM.
            if ($ResourceType -eq "Microsoft.Compute/virtualMachines")
            {
                # This is the VM.
                Write-Verbose "This is a resource management VM." -Verbose

                # Authenticate to Azure by using the service principal and certificate. Then, set the subscription.
                Write-Verbose "Authenticating to Azure with service principal and certificate" -Verbose
                $ConnectionAssetName = "AzureRunAsConnection"
                Write-Verbose "Get connection asset: $ConnectionAssetName" -Verbose
                $Conn = Get-AutomationConnection -Name $ConnectionAssetName
                if ($Conn -eq $null)
                {
                    throw "Could not retrieve connection asset: $ConnectionAssetName. Check that this asset exists in the Automation account."
                }
                Write-Verbose "Authenticating to Azure with service principal." -Verbose
                Connect-AzureRmAccount -ServicePrincipal -Tenant $Conn.TenantID -ApplicationId $Conn.ApplicationID -CertificateThumbprint $Conn.CertificateThumbprint | Write-Verbose
                Write-Verbose "Setting subscription to work against: $SubId" -Verbose
                Set-AzureRmContext -SubscriptionId $SubId -ErrorAction Stop | Write-Verbose

                # Stop the VM.
                Write-Verbose "Stopping the VM - $ResourceName - in resource group - $ResourceGroupName -" -Verbose
                Stop-AzureRmVM -Name $ResourceName -ResourceGroupName $ResourceGroupName -Force
                # [OutputType(PSAzureOperationResponse")]
            }
            else {
                # ResourceType isn't supported.
                Write-Error "$ResourceType is not a supported resource type for this runbook."
            }
        }
        else {
            # The alert status was not 'Activated', so no action taken.
            Write-Verbose ("No action taken. Alert status: " + $status) -Verbose
        }
    }
    else {
        # Error
        Write-Error "This runbook is meant to be started from an Azure alert webhook only."
    }
    ```
1. Select **Publish** to save and publish the runbook.

## Create an action group

An action group is a collection of actions that are triggered by an alert. Runbooks are just one of the many actions that you can use with action groups.

1. In the Azure portal, select **Monitor** > **SETTINGS** > **Action groups**.
1. Select **Add action group**, and then enter the required information:  
    1. In the **Action group name** box, enter a name.
    1. In the **Short name** box, enter a name. The short name is used in place of a full action group name when notifications are sent by using this action group.
    1. The **Subscription** box is automatically filled with your current subscription. This is the subscription in which the action group is saved.
    1. Select the resource group in which the action group is saved.

For this example, you create two actions: a runbook action and a notification action.

### Runbook action

To create a runbook action in the action group:

1. Under **Actions**, for **ACTION NAME**, enter a name for the action. For **ACTION TYPE**, select **Automation Runbook**.
1. Under **DETAILS**, select **Edit Details**.  
1. On the **Configure Runbook** page, under **Runbook source**, select **User**.  
1. Select your **Subscription** and **Automation account**, and then select the **Stop-AzureVmInResponsetoVMAlert** runbook.  
1. When you are finished, select **OK**.

### Notification action

To create a notification action in the action group:

1. Under **Actions**, for **ACTION NAME**, enter a name for the action. For **ACTION TYPE**, select **Email**.  
1. Under **DETAILS** select, **Edit Details**.  
1. On the **Email** page, enter the email address to use for notification, and then select **OK**. Adding an email address in addition to the runbook as an action is helpful. You are notified when the runbook is started.  

    Your action group should look like the following image:

   ![Add action group page](./media/automation-create-alert-triggered-runbook/add-action-group.png)
1. To create the action group, select **OK**.

You can use this action group in the [activity log alerts](../monitoring-and-diagnostics/monitoring-activity-log-alerts.md?toc=%2fazure%2fautomation%2ftoc.json) and [near real-time alerts](../monitoring-and-diagnostics/monitoring-overview-alerts.md?toc=%2fazure%2fautomation%2ftoc.json) that you create.

## Classic alert

Classic alerts are based on metrics, and do not use action groups. However, you can set up a runbook action based on a classic alert. 

To create a classic alert:

1. Select **Add metric alert**.
1. Name your metric alert **myVMCPUAlert**. Enter a brief description for the alert.
1. For the metric alert condition, select **Greater than**. For the **Threshold** value, select **10**. For the **Period** value, select **Over the last five minutes**.
1. Under **Take action**, select **Run a runbook from this alert**.
1. On the **Configure Runbook** page, for **Runbook source**, select **User**. Choose your automation account, and then select the **Stop-AzureVmInResponsetoVMAlert** runbook. Select **OK**.
1. To save the alert rule, select **OK**.

## Next steps

* For more information about starting an Automation runbook by using a webhook, see [Start a runbook from a webhook](automation-webhooks.md).
* For details about different ways to start a runbook, see [Starting a runbook](automation-starting-a-runbook.md).
* To learn how to create an activity log alert, see [Create activity log alerts](../monitoring-and-diagnostics/monitoring-activity-log-alerts.md?toc=%2fazure%2fautomation%2ftoc.json).
* To learn how to create a near real-time alert, see [Create an alert rule in the Azure portal](../monitoring-and-diagnostics/alert-metric.md?toc=/azure/azure-monitor/toc.json).
