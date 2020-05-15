---
title: Azure Service Bus - Automatically update messaging units 
description: This article shows you how you can use an Azure Automation runbook to automatically update messaging units of a Service Bus namespace.
services: service-bus-messaging
ms.service: service-bus-message
documentationcenter: ''
author: spelluru

ms.topic: how-to
ms.date: 05/14/2020
ms.author: spelluru

---

# Automatically update messaging units of an Azure Service Bus namespace 
This article shows you how you can use an Azure Automation runbook to automatically update messaging units of a Service Bus namespace.

> [!IMPORTANT]
> This article applies to only the premium tier of Azure Service Bus. 

## Create a Service Bus namespace
Create a premier tier Service Bus namespace. Follow steps from the [Create a namespace in the Azure portal](service-bus-quickstart-portal.md#create-a-namespace-in-the-azure-portal) article to create the namespace. 

## Create an Azure Automation account
Create an Azure Automation account by following instructions from the [Create an Azure Automation account](../automation/automation-quickstart-create-account.md) article. 

## Import Az.Service module from gallery
Import `Az.Accounts` and `Az.ServiceBus` modules from the gallery into the automation account. For step-by-step instructions, see [Import a module from the module gallery](../automation/automation-runbook-gallery.md#import-a-module-from-the-module-gallery-with-the-azure-portal).

## Create and publish a PowerShell runbook

1. Create a PowerShell runbook by follow instructions in the [Create a PowerShell runbook](../automation/automation-quickstart-create-runbook.md) article. 

    Here's a sample PowerShell script you can use to increase messaging units for a Service Bus namespace. This PowerShell script in an automation runbook increases MUs from 1 to 2, 2 to 4, or 4 to 8. The allowed values for this property are: 1, 2, 4, and 8. You can create another runbook to decrease the messaging units.1

    The **namespaceName** and **resourceGroupName** parameters are for testing the script in the runbook. The **WebHookData** parameter is for the alert to pass this information at runtime. 

    ```powershell
    [OutputType("PSAzureOperationResponse")]
    param
    (
        [Parameter (Mandatory=$false)]
        [object] $WebhookData,
    
        [Parameter (Mandatory = $false)]
        [String] $namespaceName,
    
        [Parameter (Mandatory = $false)]
        [String] $resourceGroupName
    )
    
    
    if ($WebhookData)
    {
        # Get the data object from WebhookData
        $WebhookBody = (ConvertFrom-Json -InputObject $WebhookData.RequestBody)
    
        # Get the info needed to identify the VM (depends on the payload schema)
        $schemaId = $WebhookBody.schemaId
        if ($schemaId -eq "AzureMonitorMetricAlert") {
            $resourceGroupName = $AlertContext.resourceGroupName
            $namespaceName = $AlertContext.resourceName
        }
    }
    
    $connection = Get-AutomationConnection -Name AzureRunAsConnection
    
    while(!($connectionResult) -And ($logonAttempt -le 10))
    {
        $LogonAttempt++
        # Logging in to Azure...
        $connectionResult =    Connect-AzAccount `
                                    -ServicePrincipal `
                                    -Tenant $connection.TenantID `
                                    -ApplicationId $connection.ApplicationID `
                                    -CertificateThumbprint $connection.CertificateThumbprint
    
        Start-Sleep -Seconds 30
    }
    
    # Get the current capacity (number of messaging units) of the namespace
    $sbusns=Get-AzServiceBusNamespace `
        -Name $namespaceName `
        -ResourceGroupName $resourceGroupName
    
    $currentCapacity = $sbusns.Sku.Capacity
    
    # Capacity can be one of these values: 1, 2, 4, 8
    if ($currentCapacity -eq 1) {
        $newMU = 2
    }
    elseif ($currentCapacity -eq 2) {
        $newMU = 4
    }
    elseif ($currentCapacity -eq 4) {
        $newMU = 8    
    }
    else {
    
    }
    
    # Update the capacity of the namespace
    Set-AzServiceBusNamespace `
            -Location eastus `
            -SkuName Premium `
            -Name $namespaceName `
            -SkuCapacity $newMU `
            -ResourceGroupName $resourceGroupName

    ```
2. [Test the workbook](../automation/manage-runbooks.md#test-a-runbook) and confirm that the messaging units on the namespace are updated. 
3. [Publish the workbook](..//automation/manage-runbooks.md#publish-a-runbook) so that it's available to add as an action for an alert on the namespace later. 

## Create an alert on the namespace to trigger the runbook
See [Use an alert to trigger an Azure Automation runbook](../automation/automation-create-alert-triggered-runbook.md) article to configure an alert on your Service Bus namespace to trigger the automation runbook you created. As an example, you could create an alert with namespace CPU usage goes above 75% as the condition and running automation runbook as an action on the alert. 

Now, create an alert on the namespace for a metric and tie it to the automation runbook. For example, you can create an alert on **CPU usage per namespace** or **Memory size usage per namespace** metric, and add an action to trigger the automation runbook you created. For details about these metrics, see [Resource usage metrics](service-bus-metrics-azure-monitor.md#resource-usage-metrics).

1. On the **Service Bus Namespace** page for your namespace, select **Alerts** on the left menu, and then select **+ New alert rule** on the toolbar. 
    
    ![Alerts page - New alert rule button](./media/automate-update-messaging-units/alerts-page.png)
2. On the **Create alert rule** page, click **Select condition**. 

    ![Create alert rule page - select condition](./media/automate-update-messaging-units/alert-rule-select-condition.png) 
3. On the **Configure signal logic** page, select **CPU** for the signal. 

    ![Configure signal logic - select CPU](./media/automate-update-messaging-units/configure-signal-logic.png)
4. Enter a **threshold value** (in this example, it's 75%), and select **Done**. 

    ![Configure CPU signal](./media/automate-update-messaging-units/cpu-signal-configuration.png)
5. Now, on the **Create alert page**, click **Select action group**.
    
    ![Select action group](./media/automate-update-messaging-units/select-action-group-button.png)
6. Select **Create action group** button on the toolbar. 

    ![Create action group button](./media/automate-update-messaging-units/create-action-group-button.png)
7. On the **Add action group** page, do the following steps:
    1. Enter a **name** for the action group. 
    2. Enter a **short name** for the action group.
    3. Select the **subscription**  in which you want to create this action group.
    4. Select the **resource group**. 
    5. In the **Actions** section, do the following steps:
        1. Enter a **name for the action**. For example: **Increase messaging units**. 
        2. For **Action type**, select **Automation Runbook**. 
        3. On the **Configure Runbook** page, do the following steps:
            1. For **Runbook source**, select **User**. 
            2. For **Subscription**, select your Azure **subscription** that contains the automation account. 
            3. For **Automation account**, select your **automation account**.
            4. For **Runbook**, select your runbook. 
            5. Select **OK** on the **Configure Runbook** page. 
    6. Select **OK** on the **Add action group** page. 

        ![Configure runbook](./media/automate-update-messaging-units/configure-runbook.png)

5. Now, on the **Create alert rule** page, enter a **name for the rule**, and then select **Create alert rule**. 

    ![Create alert rule](./media/automate-update-messaging-units/create-alert-rule.png)

Now, when the namespace CPU usage is above 75, the alert triggers the automation runbook, which increases the messaging units of the Service Bus namespace. Similarly, you can create an alert for another automation runbook, which decreases the messaging units if the CPU usage is below 25. 

## Next steps
To learn more about Service Bus messaging, see the following topics.

- [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
- [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
- [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
