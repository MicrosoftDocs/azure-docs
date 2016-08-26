<properties
	pageTitle="Manage Service Bus with PowerShell | Microsoft Azure"
	description="Manage Service Bus with PowerShell scripts"
	services="service-bus"
	documentationCenter=".net"
	authors="sethmanheim"
	manager="timlt"
	editor=""/>

<tags
	ms.service="service-bus"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/02/2016"
	ms.author="sethm"/>

# Manage Service Bus with PowerShell

## Overview

Microsoft Azure PowerShell is a scripting environment that you can use to control and automate the deployment and management of your workloads in Azure. This article describes how to use PowerShell to provision and manage Service Bus entities such as namespaces, queues, and Event Hubs using a local Azure PowerShell console.

## Prerequisites

Before you begin this article, you must have the following:

- An Azure subscription. Azure is a subscription-based platform. For more
information about obtaining a subscription, see [Purchase Options][],
[Member Offers][], or [Free Trial][].

- A computer with Azure PowerShell. For instructions, see [Install and configure Azure PowerShell][].

- A general understanding of PowerShell scripts, NuGet packages, and the .NET Framework.

## Including a reference to the .NET assembly for Service Bus

There are a limited number of PowerShell cmdlets available for managing Service Bus. To provision
entities that are not exposed through the existing cmdlets, you can use the .NET client for
Service Bus in the [Service Bus NuGet package].

First, make sure that the script can locate the **Microsoft.ServiceBus.dll** assembly, which is installed with the NuGet package. In order to be flexible, the script performs these steps:

1. Determines the path at which it was invoked.
2. Traverses the path until it finds a folder named `packages`. This folder is created when you install NuGet packages.
3. Recursively searches the `packages` folder for an assembly named **Microsoft.ServiceBus.dll**.
4. References the assembly so that the types are available for later use.

Here's how these steps are implemented in a PowerShell script:

```
try
{
    # WARNING: Make sure to reference the latest version of Microsoft.ServiceBus.dll
    Write-Output "Adding the [Microsoft.ServiceBus.dll] assembly to the script..."
    $scriptPath = Split-Path (Get-Variable MyInvocation -Scope 0).Value.MyCommand.Path
    $packagesFolder = (Split-Path $scriptPath -Parent) + "\packages"
    $assembly = Get-ChildItem $packagesFolder -Include "Microsoft.ServiceBus.dll" -Recurse
    Add-Type -Path $assembly.FullName

    Write-Output "The [Microsoft.ServiceBus.dll] assembly has been successfully added to the script."
}

catch [System.Exception]
{
    Write-Error "Could not add the Microsoft.ServiceBus.dll assembly to the script. Make sure you build the solution before running the provisioning script."
}
```

## Provision a Service Bus namespace

Two PowerShell cmdlets support Service Bus namespace operations. Instead of the .NET SDK APIs, you can use [Get-AzureSBNamespace][] and [New-AzureSBNamespace][].

This example creates a few local variables in the script; `$Namespace` and `$Location`.

- `$Namespace` is the name the of the Service Bus namespace with which we want to work.
- `$Location` identifies the data center in which the script provisions the namespace.
- `$CurrentNamespace` stores the reference namespace that the script retrieves (or creates).

In an actual script, `$Namespace` and `$Location` can be passed as parameters.

This part of the script does the following:

1. Attempts to retrieve a Service Bus namespace with the provided name.
2. If the namespace is found, it reports what was found.
3. If the namespace is not found, it creates the namespace and then retrieves the newly created namespace.

	```
	$Namespace = "MyServiceBusNS"
	$Location = "West US"
	
	# Query to see if the namespace currently exists
	$CurrentNamespace = Get-AzureSBNamespace -Name $Namespace
	
	# Check if the namespace already exists or needs to be created
	if ($CurrentNamespace)
	{
	    Write-Output "The namespace [$Namespace] already exists in the [$($CurrentNamespace.Region)] region."
	}
	else
	{
	    Write-Host "The [$Namespace] namespace does not exist."
	    Write-Output "Creating the [$Namespace] namespace in the [$Location] region..."
	    New-AzureSBNamespace -Name $Namespace -Location $Location -CreateACSNamespace $false -NamespaceType Messaging
	    $CurrentNamespace = Get-AzureSBNamespace -Name $Namespace
	    Write-Host "The [$Namespace] namespace in the [$Location] region has been successfully created."
	}
	```

To provision other Service Bus entities, create an instance of the [NamespaceManager][] class from the SDK.
You can use the [Get-AzureSBAuthorizationRule][] cmdlet to retrieve an authorization rule that's used to provide a connection string. We'll store a reference to the `NamespaceManager` instance in the `$NamespaceManager` variable. We will use `$NamespaceManager` later in the script to provision other entities.

``` powershell
$sbr = Get-AzureSBAuthorizationRule -Namespace $Namespace
# Create the NamespaceManager object to create the event hub
Write-Output "Creating a NamespaceManager object for the [$Namespace] namespace..."
$NamespaceManager = [Microsoft.ServiceBus.NamespaceManager]::CreateFromConnectionString($sbr.ConnectionString);
Write-Output "NamespaceManager object for the [$Namespace] namespace has been successfully created."
```

## Provisioning other Service Bus entities

In order to provision other entities, such as queues, topics, and Event Hubs, use the [.NET API for Service Bus][]. This article focuses only on Event Hubs, but the steps for other entities are similar. In addition, more detailed examples, including other entities, are referenced at the end of this article.

This part of the script creates four more local variables. These variables are used to instantiate an `EventHubDescription` object. The script does the following:

1. Using the `NamespaceManager` object, check to see if the Event Hub identified by `$Path` exists.
2. If it does not exist, create an `EventHubDescription` and pass that to the `NamespaceManager` class `CreateEventHubIfNotExists` method.
3. After determining that the Event Hub is available, create a consumer group using `ConsumerGroupDescription` and `NamespaceManager`.

	```
	$Path  = "MyEventHub"
	$PartitionCount = 12
	$MessageRetentionInDays = 7
	$UserMetadata = $null
	$ConsumerGroupName = "MyConsumerGroup"
		
	# Check to see if the Event Hub already exists
	if ($NamespaceManager.EventHubExists($Path))
	{
	    Write-Output "The [$Path] event hub already exists in the [$Namespace] namespace."  
	}
	else
	{
	    Write-Output "Creating the [$Path] event hub in the [$Namespace] namespace: PartitionCount=[$PartitionCount] MessageRetentionInDays=[$MessageRetentionInDays]..."
	    $EventHubDescription = New-Object -TypeName Microsoft.ServiceBus.Messaging.EventHubDescription -ArgumentList $Path
	    $EventHubDescription.PartitionCount = $PartitionCount
	    $EventHubDescription.MessageRetentionInDays = $MessageRetentionInDays
	    $EventHubDescription.UserMetadata = $UserMetadata
	    $EventHubDescription.Path = $Path
	    $NamespaceManager.CreateEventHubIfNotExists($EventHubDescription);
	    Write-Output "The [$Path] event hub in the [$Namespace] namespace has been successfully created."
	}
		
	# Create the consumer group if it doesn't exist
	Write-Output "Creating the consumer group [$ConsumerGroupName] for the [$Path] event hub..."
	$ConsumerGroupDescription = New-Object -TypeName Microsoft.ServiceBus.Messaging.ConsumerGroupDescription -ArgumentList $Path, $ConsumerGroupName
	$ConsumerGroupDescription.UserMetadata = $ConsumerGroupUserMetadata
	$NamespaceManager.CreateConsumerGroupIfNotExists($ConsumerGroupDescription);
	Write-Output "The consumer group [$ConsumerGroupName] for the [$Path] event hub has been successfully created."
	```

## Migrate a namespace to another Azure subscription

The following sequence of commands moves a namespace from one Azure subscription to another. To execute this operation, the namespace must already be active, and the user running the PowerShell commands must be an administrator on both the source and target subscriptions.

```
# Create a new resource group in target subscription
Select-AzureRmSubscription -SubscriptionId 'ffffffff-ffff-ffff-ffff-ffffffffffff'
New-AzureRmResourceGroup -Name 'targetRG' -Location 'East US'

# Move namespace from source subscription to target subscription
Select-AzureRmSubscription -SubscriptionId 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
$res = Find-AzureRmResource -ResourceNameContains mynamespace -ResourceType 'Microsoft.ServiceBus/namespaces'
Move-AzureRmResource -DestinationResourceGroupName 'targetRG' -DestinationSubscriptionId 'ffffffff-ffff-ffff-ffff-ffffffffffff' -ResourceId $res.ResourceId
```

## Next steps

This article provided a basic outline for provisioning Service Bus entities using PowerShell. Anything that you can do using the .NET client libraries, you can also do in a PowerShell script.

There are more detailed examples available on these blog posts:

- [How to create Service Bus queues, topics and subscriptions using a PowerShell script](http://blogs.msdn.com/b/paolos/archive/2014/12/02/how-to-create-a-service-bus-queues-topics-and-subscriptions-using-a-powershell-script.aspx)
- [How to create a Service Bus Namespace and an Event Hub using a PowerShell script](http://blogs.msdn.com/b/paolos/archive/2014/12/01/how-to-create-a-service-bus-namespace-and-an-event-hub-using-a-powershell-script.aspx)

Some ready-made scripts are also available for download:
- [Service Bus PowerShell Scripts](https://code.msdn.microsoft.com/Service-Bus-PowerShell-a46b7059)

<!--Link references-->
[Purchase Options]: http://azure.microsoft.com/pricing/purchase-options/
[Member Offers]: http://azure.microsoft.com/pricing/member-offers/
[Free Trial]: http://azure.microsoft.com/pricing/free-trial/
[Install and configure Azure PowerShell]: ../powershell-install-configure.md
[Service Bus NuGet package]: http://www.nuget.org/packages/WindowsAzure.ServiceBus/
[Get-AzureSBNamespace]: https://msdn.microsoft.com/library/azure/dn495122.aspx
[New-AzureSBNamespace]: https://msdn.microsoft.com/library/azure/dn495165.aspx
[Get-AzureSBAuthorizationRule]: https://msdn.microsoft.com/library/azure/dn495113.aspx
[.NET API for Service Bus]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.aspx
[NamespaceManager]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.namespacemanager.aspx
