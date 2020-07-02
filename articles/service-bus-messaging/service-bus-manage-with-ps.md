---
title: Use PowerShell to manage Azure Service Bus resources | Microsoft Docs
description: This article explains how to use Azure PowerShell module to create and manage Service Bus entities (namespaces, queues, topics, subscriptions).
ms.topic: article
ms.date: 06/23/2020
---

# Use PowerShell to manage Service Bus resources

Microsoft Azure PowerShell is a scripting environment that you can use to control and automate the deployment and management of Azure services. This article describes how to use the [Service Bus Resource Manager PowerShell module](/powershell/module/az.servicebus) to provision and manage Service Bus entities (namespaces, queues, topics, and subscriptions) using a local Azure PowerShell console or script.

You can also manage Service Bus entities using Azure Resource Manager templates. For more information, see the article [Create Service Bus resources using Azure Resource Manager templates](service-bus-resource-manager-overview.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

Before you begin, you'll need the following prerequisites:

* An Azure subscription. For more
  information about obtaining a subscription, see [purchase options][purchase options], [member offers][member offers], or [free account][free account].
* A computer with Azure PowerShell. For instructions, see [Get started with Azure PowerShell cmdlets](/powershell/azure/get-started-azureps).
* A general understanding of PowerShell scripts, NuGet packages, and the .NET Framework.

## Get started

The first step is to use PowerShell to log in to your Azure account and Azure subscription. Follow the instructions in [Get started with Azure PowerShell cmdlets](/powershell/azure/get-started-azureps) to log in to your Azure account, and retrieve and access the resources in your Azure subscription.

## Provision a Service Bus namespace

When working with Service Bus namespaces, you can use the [Get-AzServiceBusNamespace](/powershell/module/az.servicebus/get-azservicebusnamespace), [New-AzServiceBusNamespace](/powershell/module/az.servicebus/new-azservicebusnamespace), [Remove-AzServiceBusNamespace](/powershell/module/az.servicebus/remove-azservicebusnamespace), and [Set-AzServiceBusNamespace](/powershell/module/az.servicebus/set-azservicebusnamespace) cmdlets.

This example creates a few local variables in the script; `$Namespace` and `$Location`.

* `$Namespace` is the name of the Service Bus namespace with which we want to work.
* `$Location` identifies the data center in which we provision the namespace.
* `$CurrentNamespace` stores the reference namespace that we retrieve (or create).

In an actual script, `$Namespace` and `$Location` can be passed as parameters.

This part of the script does the following:

1. Attempts to retrieve a Service Bus namespace with the specified name.
2. If the namespace is found, it reports what was found.
3. If the namespace is not found, it creates the namespace and then retrieves the newly created namespace.
   
    ``` powershell
	# Query to see if the namespace currently exists
    $CurrentNamespace = Get-AzServiceBusNamespace -ResourceGroup $ResGrpName -NamespaceName $Namespace
   
    # Check if the namespace already exists or needs to be created
    if ($CurrentNamespace)
    {
        Write-Host "The namespace $Namespace already exists in the $Location region:"
		# Report what was found
		Get-AzServiceBusNamespace -ResourceGroup $ResGrpName -NamespaceName $Namespace
    }
    else
    {
        Write-Host "The $Namespace namespace does not exist."
        Write-Host "Creating the $Namespace namespace in the $Location region..."
        New-AzServiceBusNamespace -ResourceGroup $ResGrpName -NamespaceName $Namespace -Location $Location
        $CurrentNamespace = Get-AzServiceBusNamespace -ResourceGroup $ResGrpName -NamespaceName $Namespace
        Write-Host "The $Namespace namespace in Resource Group $ResGrpName in the $Location region has been successfully created."
                
    }
    ```

### Create a namespace authorization rule

The following example shows how to manage namespace authorization rules using the [New-AzServiceBusAuthorizationRule](/powershell/module/az.servicebus/new-azservicebusauthorizationrule), [Get-AzServiceBusAuthorizationRule](/powershell/module/az.servicebus/get-azservicebusauthorizationrule), [Set-AzServiceBusAuthorizationRule](/powershell/module/az.servicebus/set-azservicebusauthorizationrule), and [Remove-AzServiceBusAuthorizationRule](/powershell/module/az.servicebus/remove-azservicebusauthorizationrule) cmdlets.

```powershell
# Query to see if rule exists
$CurrentRule = Get-AzServiceBusAuthorizationRule -ResourceGroup $ResGrpName -NamespaceName $Namespace -AuthorizationRuleName $AuthRule

# Check if the rule already exists or needs to be created
if ($CurrentRule)
{
    Write-Host "The $AuthRule rule already exists for the namespace $Namespace."
}
else
{
    Write-Host "The $AuthRule rule does not exist."
    Write-Host "Creating the $AuthRule rule for the $Namespace namespace..."
    New-AzServiceBusAuthorizationRule -ResourceGroup $ResGrpName -NamespaceName $Namespace -AuthorizationRuleName $AuthRule -Rights @("Listen","Send")
    $CurrentRule = Get-AzServiceBusAuthorizationRule -ResourceGroup $ResGrpName -NamespaceName $Namespace -AuthorizationRuleName $AuthRule
    Write-Host "The $AuthRule rule for the $Namespace namespace has been successfully created."

    Write-Host "Setting rights on the namespace"
    $authRuleObj = Get-AzServiceBusAuthorizationRule -ResourceGroup $ResGrpName -NamespaceName $Namespace -AuthorizationRuleName $AuthRule

    Write-Host "Remove Send rights"
    $authRuleObj.Rights.Remove("Send")
    Set-AzServiceBusAuthorizationRule -ResourceGroup $ResGrpName -NamespaceName $Namespace -AuthRuleObj $authRuleObj

    Write-Host "Add Send and Manage rights to the namespace"
    $authRuleObj.Rights.Add("Send")
    Set-AzServiceBusAuthorizationRule -ResourceGroup $ResGrpName -NamespaceName $Namespace -AuthRuleObj $authRuleObj
    $authRuleObj.Rights.Add("Manage")
    Set-AzServiceBusAuthorizationRule -ResourceGroup $ResGrpName -NamespaceName $Namespace -AuthRuleObj $authRuleObj

    Write-Host "Show value of primary key"
    $CurrentKey = Get-AzServiceBusKey -ResourceGroup $ResGrpName -NamespaceName $Namespace -Name $AuthRule
        
    Write-Host "Remove this authorization rule"
    Remove-AzServiceBusAuthorizationRule -ResourceGroup $ResGrpName -NamespaceName $Namespace -Name $AuthRule
}
```

## Create a queue

To create a queue or topic, perform a namespace check using the script in the previous section. Then, create the queue:

```powershell
# Check if queue already exists
$CurrentQ = Get-AzServiceBusQueue -ResourceGroup $ResGrpName -NamespaceName $Namespace -QueueName $QueueName

if($CurrentQ)
{
    Write-Host "The queue $QueueName already exists in the $Location region:"
}
else
{
    Write-Host "The $QueueName queue does not exist."
    Write-Host "Creating the $QueueName queue in the $Location region..."
    New-AzServiceBusQueue -ResourceGroup $ResGrpName -NamespaceName $Namespace -QueueName $QueueName -EnablePartitioning $True
    $CurrentQ = Get-AzServiceBusQueue -ResourceGroup $ResGrpName -NamespaceName $Namespace -QueueName $QueueName
    Write-Host "The $QueueName queue in Resource Group $ResGrpName in the $Location region has been successfully created."
}
```

### Modify queue properties

After executing the script in the preceding section, you can use the [Set-AzServiceBusQueue](/powershell/module/az.servicebus/set-azservicebusqueue) cmdlet to update the properties of a queue, as in the following example:

```powershell
$CurrentQ.DeadLetteringOnMessageExpiration = $True
$CurrentQ.MaxDeliveryCount = 7
$CurrentQ.MaxSizeInMegabytes = 2048
$CurrentQ.EnableExpress = $True

Set-AzServiceBusQueue -ResourceGroup $ResGrpName -NamespaceName $Namespace -QueueName $QueueName -QueueObj $CurrentQ
```

## Provisioning other Service Bus entities

You can use the [Service Bus PowerShell module](/powershell/module/az.servicebus) to provision other entities, such as topics and subscriptions. These cmdlets are syntactically similar to the queue creation cmdlets demonstrated in the previous section.

## Next steps

- See the complete Service Bus Resource Manager PowerShell module documentation [here](/powershell/module/az.servicebus). This page lists all available cmdlets.
- For information about using Azure Resource Manager templates, see the article [Create Service Bus resources using Azure Resource Manager templates](service-bus-resource-manager-overview.md).
- Information about [Service Bus .NET management libraries](service-bus-management-libraries.md).

There are some alternate ways to manage Service Bus entities, as described in these blog posts:

* [How to create Service Bus queues, topics and subscriptions using a PowerShell script](https://docs.microsoft.com/archive/blogs/paolos/how-to-create-service-bus-queues-topics-and-subscriptions-using-a-powershell-script)
* [How to create a Service Bus Namespace and an Event Hub using a PowerShell script](https://docs.microsoft.com/archive/blogs/paolos/how-to-create-a-service-bus-namespace-and-an-event-hub-using-a-powershell-script)
* [Service Bus PowerShell Scripts](https://code.msdn.microsoft.com/Service-Bus-PowerShell-a46b7059)

<!--Anchors-->

[purchase options]: https://azure.microsoft.com/pricing/purchase-options/
[member offers]: https://azure.microsoft.com/pricing/member-offers/
[free account]: https://azure.microsoft.com/pricing/free-trial/
