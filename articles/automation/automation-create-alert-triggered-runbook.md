---
title: Respond to Azure alerts with an automation runbook | Microsoft Docs
description: Learn how to trigger a runbook to run when Azure alerts are raised.
services: automation
keywords: 
author: georgewallace
ms.author: gwallace
ms.date: 12/05/2017
ms.topic: 
manager: carmonm
---
# Respond to Azure alerts with an automation runbook

Azure automation provides the ability to automate tasks. [Azure monitor](../monitoring-and-diagnostics/monitoring-overview-azure-monitor.md?toc=%2fazure%2fautomation%2ftoc.json) provides base-level metrics and logs for most services within Microsoft Azure. Azure automation can be called using [action groups](../monitoring-and-diagnostics/monitoring-action-groups.md?toc=%2fazure%2fautomation%2ftoc.json) or from classic alerts to automate tasks based on the alerts. This article shows you how to configure and run a runbook based off of these alerts. 

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete this tutorial 

## Log in to the Azure portal

Log in to the Azure portal at http://portal.azure.com

## Create the runbook

Navigate to your automation account

The following example must be called from an Azure alert. The script takes in the webhook data and evaluates the webhook JSON to determine which alert type was triggered. Each alert type has a different schema.

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
## Clean up resources


## Create an action group

In the portal, select **Monitor**.

Select **Action groups** under **SETTINGS**.

Select **Add action group**, and fill in the fields.

Enter a name in the Action group name box, and enter a name in the Short name box. The short name is used in place of a full action group name when notifications are sent using this group.

The Subscription box autofills with your current subscription. This subscription is the one in which the action group is saved.
Select the Resource group in which the action group is saved.

For this example, you create two actions, a runbook action and a notification action.

### Runbook action

Under **Actions**, give the action a name.

Select **Automation Runbook** for the **Action Type**.

Under **Details** select, **Edit Details**

On the **Configure Runbook** page, select **User** under **Runbook source**.

Choose your **Subscription** and **Automation account**, and finally select the **Stop-AzureVmInResponsetoVMAlert** runbook.

When done, click **OK**.

### Notification action

Under **Actions**, give the action a name.

Select **Email** for the **Action Type**.

Under **Details** select, **Edit Details**

On the **Email** page, enter the email address to notify and click **OK**.

Your action group should look like the following image:

![Add action group page](./media/automation-create-alert-triggered-runbook/add-action-group.png)

Click **OK** to create the action group.

## Create alert from blah

Navigate to **Virtual machines** and select a current VM.

Select **Alert rules** under **MONITORING**

Here is where you can create alerts of one of the following

* Metric alert - 
* Activity log alert - 

## Classic Alert

Classic alerts based on metrics do not use action groups, but have runbook actions based on them.

Select **+ Add metric alert**.

Name your metric alert 'myVMCPUAlert', and provide a brief description for the alert.

Set the Condition for the metric alert as 'Greater than', set the Threshold as '10', and set the Period as 'Over the last 5 minutes'.

Under **Take action**, select **Run a runbook from this alert**

On the **Configure Runbook** page, select **User** for **Runbook source**. Choose your automation account and select the **Stop-AzureVmInResponsetoVMAlert** runbook. Click **OK**, and then click **OK** again to save the alert rule.

The following is an example webhookdata passed to a runbook for classic metric alerts.

```json
{
    "WebhookName": "Alert1515515157799",
    "RequestBody": {
        "status": "Activated",
        "context": {
            "condition": {
                "metricName": "Percentage CPU",
                "metricUnit": "Percent",
                "metricValue": "32.5441666666667",
                "threshold": "1",
                "windowSize": "5",
                "timeAggregation": "Average",
                "operator": "GreaterThan"
            },
            "resourceName": "contosovm1",
            "resourceType": "microsoft.compute/virtualmachines",
            "resourceRegion": "eastus",
            "portalLink": "https://portal.azure.com/#resource/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoVM/providers/Microsoft.Compute/virtualMachines/ContosoVM1",
            "timestamp": "2018-01-09T18:06:40.4724348Z",
            "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoVM/providers/microsoft.insights/alertrules/myVMCPUAlert",
            "name": "myVMCPUAlert",
            "description": "An alert on CPU that calls a runbook to Shutdown the VM",
            "conditionType": "Metric",
            "subscriptionId": "00000000-0000-0000-0000-000000000000",
            "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoVM/providers/Microsoft.Compute/virtualMachines/ContosoVM1",
            "resourceGroupName": "ContosoVM"
        },
        "properties": {
            "$type": "Microsoft.WindowsAzure.Management.Common.Storage.CasePreservedDictionary`1[[System.String, mscorlib]], Microsoft.WindowsAzure.Management.Common.Storage",
            "automationAccountResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/TestAzureAuto/providers/Microsoft.Automation/automationAccounts/TestAzureAuto",
            "automationRunbookName": "Stop-AzureVmInResponsetoVMAlert",
            "webhookResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/TestAzureAuto/providers/Microsoft.Automation/automationAccounts/TestAzureAuto/webhooks/Alert1515515157799",
            "isGlobalRunbook": "False",
            "isEnabled": "True"
        }
    },
    "RequestHeader": {
        "Connection": "Keep-Alive",
        "Host": "s1events.azure-automation.net",
        "User-Agent": "azure-insights/0.9",
        "x-ms-request-id": "fad24ad4-8d53-4675-a9a9-033139598256"
    }
}
```

## Near real-time metric alert
## Activity alert



```json
{
    "WebhookName": "Alert1510204804154",
    "RequestBody": {
        "schemaId": "Microsoft.Insights/activityLogs",
        "data": {
            "status": "Activated",
            "context": {
                "activityLog": {
                    "authorization": {
                        "action": "Microsoft.Compute/virtualMachines/start/action",
                        "scope": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/automationtest/providers/Microsoft.Compute/virtualMachines/Win2012R2DC"
                    },
                    "channels": "Operation",
                    "claims": {
                        "aud": "https://management.core.windows.net/",
                        "iss": "https://sts.windows.net/f9e6521b-53b4-4a64-815a-9f08aeddbf8c/",
                        "iat": "1510265260",
                        "nbf": "1510265260",
                        "exp": "1510269160",
                        "http://schemas.microsoft.com/claims/authnclassreference": "1",
                        "aio": "ASQA2/8GAAAAAqOuBHyoRyEm/SulPrkirgOr7P3TgDAW4BadDOPTKxg=",
                        "altsecid": "1:live.com:00034001A5977943",
                        "http://schemas.microsoft.com/claims/authnmethodsreferences": "pwd",
                        "appid": "c44b4083-3bb0-49c1-b47d-974e53cbdf3c",
                        "appidacr": "2",
                        "e_exp": "262800",
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "csand-msft@LIVE.COM",
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "Sanders",
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": "Chris",
                        "groups": "506d3255-e0c4-4984-9fab-9ce0b359dd54",
                        "http://schemas.microsoft.com/identity/claims/identityprovider": "live.com",
                        "ipaddr": "131.107.174.111",
                        "name": "Chris Sanders",
                        "http://schemas.microsoft.com/identity/claims/objectidentifier": "83107163-1bf7-4112-aef9-106af0a30e33",
                        "puid": "1003000088E910E1",
                        "http://schemas.microsoft.com/identity/claims/scope": "user_impersonation",
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "a9Df4wC1k4tSRl_6aizc53wA3lhpgv6U78SevNGWs-0",
                        "http://schemas.microsoft.com/identity/claims/tenantid": "f9e6521b-53b4-4a64-815a-9f08aeddbf8c",
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "live.com#csand-msft@LIVE.COM",
                        "uti": "XHFssrNmxkC4uD8xvmQlAA",
                        "ver": "1.0",
                        "wids": "62e90394-69f5-4237-9190-012177145e10"
                    },
                    "caller": "csand-msft@LIVE.COM",
                    "correlationId": "582e6c32-457c-4524-b523-70bf170f2a69",
                    "description": "",
                    "eventSource": "Administrative",
                    "eventTimestamp": "2017-11-09T22:35:52.0565988+00:00",
                    "httpRequest": {
                        "clientRequestId": "cc0cc932-de7d-44a9-aaeb-1133f46bc108",
                        "clientIpAddress": "131.107.174.239",
                        "method": "POST"
                    },
                    "eventDataId": "946b140c-3b64-41b2-b046-47117c5d8e54",
                    "level": "Informational",
                    "operationName": "Microsoft.Compute/virtualMachines/start/action",
                    "operationId": "582e6c32-457c-4524-b523-70bf170f2a69",
                    "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/automationtest/providers/Microsoft.Compute/virtualMachines/Win2012R2DC",
                    "resourceGroupName": "automationtest",
                    "resourceProviderName": "Microsoft.Compute",
                    "status": "Started",
                    "subStatus": "",
                    "subscriptionId": "00000000-0000-0000-0000-000000000000",
                    "submissionTimestamp": "2017-11-09T22:36:09.8216757+00:00",
                    "resourceType": "Microsoft.Compute/virtualMachines"
                }
            },
            "properties": {}
        }
    },
    "RequestHeader": {
        "Connection": "Keep-Alive",
        "Expect": "100-continue",
        "Host": "s1events.azure-automation.net",
        "User-Agent": "IcMBroadcaster/1.0",
        "X-CorrelationContext": "RkkKACgAAAACAAAAEAAIOa18KivnSZWavGFEr0yMAQAQAO7R1SdBMQZAgDlliAIWpFo=",
        "x-ms-request-id": "4da979ca-941f-4683-8f0f-9305ecf69ea4"
    }
}
```

```json
{
    "WebhookName": "Alert1510875839452",
    "RequestBody": {
        "status": "Activated",
        "context": {
            "condition": {
                "metricName": "Percentage CPU",
                "metricUnit": "Percent",
                "metricValue": "17.7654545454545",
                "threshold": "1",
                "windowSize": "10",
                "timeAggregation": "Average",
                "operator": "GreaterThan"
            },
            "resourceName": "win2012r2dc",
            "resourceType": "microsoft.compute/virtualmachines",
            "resourceRegion": "westus",
            "portalLink": "https://portal.azure.com/#resource/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/automationtest/providers/Microsoft.Compute/virtualMachines/Win2012R2DC",
            "timestamp": "2017-11-16T23:54:03.9517451Z",
            "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/automationtest/providers/microsoft.insights/alertrules/VMMetricAlert1",
            "name": "VMMetricAlert1",
            "description": "A metric alert for the VM Win2012R2",
            "conditionType": "Metric",
            "subscriptionId": "00000000-0000-0000-0000-000000000000",
            "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/automationtest/providers/Microsoft.Compute/virtualMachines/Win2012R2DC",
            "resourceGroupName": "automationtest"
        },
        "properties": {
            "$type": "Microsoft.WindowsAzure.Management.Common.Storage.CasePreservedDictionary`1[[System.String, mscorlib]], Microsoft.WindowsAzure.Management.Common.Storage",
            "automationAccountResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/HybridWinRG/providers/Microsoft.Automation/automationAccounts/AutomationTestEUS2",
            "automationRunbookName": "Get-MetricAlertData",
            "webhookResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/HybridWinRG/providers/Microsoft.Automation/automationAccounts/AutomationTestEUS2/webhooks/Alert1510875839452",
            "isGlobalRunbook": "False",
            "isEnabled": "True"
        }
    },
    "RequestHeader": {
        "Connection": "Keep-Alive",
        "Host": "s1events.azure-automation.net",
        "User-Agent": "azure-insights/0.9",
        "x-ms-request-id": "42ead714-5be5-42db-b510-ef927a6f1082"
    }
}
```

## Next steps
In this tutorial, you learned how to:
> [!div class="checklist"]
> * All tutorials include a list summarizing the steps to completion
> * Each of these bullet points align to the H2 in the right nav
> * To minimize bullet bloat, use these green checkboxes in a tutorial

Advance to the next article to learn more
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

