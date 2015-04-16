<properties
   pageTitle="Use PowerShell to manage Service Bus and Event Hubs resources"
   description="Using PowerShell to create and manage Service Bus and Event Hubs resources"
   services="service-bus"
   documentationCenter=".NET"
   authors="sethmanheim"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-bus"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd"
   ms.date="04/14/2015"
   ms.author="sethm"/>

# Use PowerShell to manage Service Bus and Event Hubs resources

Microsoft Azure PowerShell is a scripting environment that you can use to control and automate the deployment and management of Azure services. This article describes how to use PowerShell to provision and manage Service Bus entities such as namespaces, queues, and Event Hubs using a local Azure PowerShell console.

## Prerequisites

Before you begin, you'll need the following:

- An Azure subscription. Azure is a subscription-based platform. For more
information about obtaining a subscription, see [Purchase Options], [Member Offers], or [Free Trial].

- A computer with Azure PowerShell. See the setup instructions in the next section.

- A general understanding of PowerShell scripts, NuGet packages, and the .NET Framework.

## Set up PowerShell

[AZURE.INCLUDE [powershell-setup](../includes/powershell-setup.md)]

## Include a reference to the .NET assembly for Service Bus

There are a limited number of PowerShell cmdlets available for managing Service Bus. To provision entities that are not exposed through the existing cmdlets, you can use the .NET client for Service Bus from within PowerShell by referencing the [Service Bus NuGet package].

First, make sure that the script can locate the **Microsoft.ServiceBus.dll** assembly, which is installed with the NuGet package. In order to be flexible, the script performs these steps:

1. Determines the path from which it was invoked.
2. Traverses the path until it finds a folder named `packages`. This folder is created when you install NuGet packages.
3. Recursively searches the `packages` folder for an assembly named **Microsoft.ServiceBus.dll**.
4. References the assembly so that the types are available for later use.

Here's how these steps are implemented in a PowerShell script:

	```powershell
	
	try
	{
	    # IMPORTANT: Make sure to reference the latest version of Microsoft.ServiceBus.dll
	    Write-Output "Adding the [Microsoft.ServiceBus.dll] assembly to the script..."
	    $scriptPath = Split-Path (Get-Variable MyInvocation -Scope 0).Value.MyCommand.Path
	    $packagesFolder = (Split-Path $scriptPath -Parent) + "\packages"
	    $assembly = Get-ChildItem $packagesFolder -Include "Microsoft.ServiceBus.dll" -Recurse
	    Add-Type -Path $assembly.FullName
	
	    Write-Output "The [Microsoft.ServiceBus.dll] assembly has been successfully added to the script."
	}
	
	catch [System.Exception]
	{
	    Write-Error("Could not add the Microsoft.ServiceBus.dll assembly to the script. Make sure you build the solution before running the provisioning script.")
	}
	
	```

## Provision a Service Bus namespace

When working with Service Bus namespaces, there are two cmdlets you can use instead of the .NET SDK: [Get-AzureSBNamespace] and [New-AzureSBNamespace].

This example creates a few local variables in the script; `$Namespace` and `$Location`.

- `$Namespace` is the name the of the Service Bus namespace with which we want to work.
- `$Location` identifies the data center in which will we provision the namespace.
- `$CurrentNamespace` stores the reference namespace that we retrieve (or create).

In an actual script, `$Namespace` and `$Location` can be passed as parameters.

This part of the script does the following:

1. Attempts to retrieve a Service Bus namespace with the provided name.
2. If the namespace is found, it reports what was found.
3. If the namespace is not found, it creates the namespace and then retrieves the newly created namespace.

		``` powershell
		
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
		    New-AzureSBNamespace -Name $Namespace -Location $Location -CreateACSNamespace false -NamespaceType Messaging
		    $CurrentNamespace = Get-AzureSBNamespace -Name $Namespace
		    Write-Host "The [$Namespace] namespace in the [$Location] region has been successfully created."
		}
		```
To provision other Service Bus entities, create an instance of the `NamespaceManager` object from the SDK. You can use the [Get-AzureSBAuthorizationRule] cmdlet to retrieve an authorization rule that's used to provide a connection string. This example stores a reference to the `NamespaceManager` instance in the `$NamespaceManager` variable. The script later uses `$NamespaceManager` to provision other entities.

		``` powershell
		$sbr = Get-AzureSBAuthorizationRule -Namespace $Namespace
		# Create the NamespaceManager object to create the Event Hub
		Write-Output "Creating a NamespaceManager object for the [$Namespace] namespace..."
		$NamespaceManager = [Microsoft.ServiceBus.NamespaceManager]::CreateFromConnectionString($sbr.ConnectionString);
		Write-Output "NamespaceManager object for the [$Namespace] namespace has been successfully created."
		```
## Provisioning other Service Bus entities

To provision other entities, such as queues, topics, and Event Hubs, you can use the [.NET API for Service Bus]. More detailed examples, including other entities, are referenced at the end of this article.

### Create an Event Hub

This part of the script creates four more local variables. These variables are used to instantiate an `EventHubDescription` object. The script does the following:

1. Using the `NamespaceManager` object, check to see if the Event Hub identified by `$Path` exists.
2. If it does not exist, create an `EventHubDescription` and pass that to the `NamespaceManager` class `CreateEventHubIfNotExists` method.
3. After determining that the Event Hub is available, create a consumer group using `ConsumerGroupDescription` and `NamespaceManager`.

		``` powershell
		
		$Path  = "MyEventHub"
		$PartitionCount = 12
		$MessageRetentionInDays = 7
		$UserMetadata = $null
		$ConsumerGroupName = "MyConsumerGroup"
		
		# Check if the Event Hub already exists
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

### Create a queue

To create a queue or topic, perform a namespace check as in the previous section. 

	if ($NamespaceManager.QueueExists($Path))
	{
	    Write-Output "The [$Path] queue already exists in the [$Namespace] namespace." 
	}
	else
	{
	    Write-Output "Creating the [$Path] queue in the [$Namespace] namespace..."
	    $QueueDescription = New-Object -TypeName Microsoft.ServiceBus.Messaging.QueueDescription -ArgumentList $Path
	    if ($AutoDeleteOnIdle -ge 5)
	    {
	        $QueueDescription.AutoDeleteOnIdle = [System.TimeSpan]::FromMinutes($AutoDeleteOnIdle)
	    }
	    if ($DefaultMessageTimeToLive -gt 0)
	    {
	        $QueueDescription.DefaultMessageTimeToLive = [System.TimeSpan]::FromMinutes($DefaultMessageTimeToLive)
	    }
	    if ($DuplicateDetectionHistoryTimeWindow -gt 0)
	    {
	        $QueueDescription.DuplicateDetectionHistoryTimeWindow = [System.TimeSpan]::FromMinutes($DuplicateDetectionHistoryTimeWindow)
	    }
	    $QueueDescription.EnableBatchedOperations = $EnableBatchedOperations
	    $QueueDescription.EnableDeadLetteringOnMessageExpiration = $EnableDeadLetteringOnMessageExpiration
	    $QueueDescription.EnableExpress = $EnableExpress
	    $QueueDescription.EnablePartitioning = $EnablePartitioning
	    $QueueDescription.ForwardDeadLetteredMessagesTo = $ForwardDeadLetteredMessagesTo
	    $QueueDescription.ForwardTo = $ForwardTo
	    $QueueDescription.IsAnonymousAccessible = $IsAnonymousAccessible
	    if ($LockDuration -gt 0)
	    {
	        $QueueDescription.LockDuration = [System.TimeSpan]::FromSeconds($LockDuration)
	    }
	    $QueueDescription.MaxDeliveryCount = $MaxDeliveryCount
	    $QueueDescription.MaxSizeInMegabytes = $MaxSizeInMegabytes
	    $QueueDescription.RequiresDuplicateDetection = $RequiresDuplicateDetection
	    $QueueDescription.RequiresSession = $RequiresSession
	    if ($EnablePartitioning)
	    {
	        $QueueDescription.SupportOrdering = $False
	    }
	    else
	    {
	        $QueueDescription.SupportOrdering = $SupportOrdering
	    }
	    $QueueDescription.UserMetadata = $UserMetadata
	    $NamespaceManager.CreateQueue($QueueDescription);
	}

### Create a topic

	if ($NamespaceManager.TopicExists($Path))
	{
	    Write-Output "The [$Path] topic already exists in the [$Namespace] namespace." 
	}
	else
	{
	    Write-Output "Creating the [$Path] topic in the [$Namespace] namespace..."
	    $TopicDescription = New-Object -TypeName Microsoft.ServiceBus.Messaging.TopicDescription -ArgumentList $Path
	    if ($AutoDeleteOnIdle -ge 5)
	    {
	        $TopicDescription.AutoDeleteOnIdle = [System.TimeSpan]::FromMinutes($AutoDeleteOnIdle)
	    }
	    if ($DefaultMessageTimeToLive -gt 0)
	    {
	        $TopicDescription.DefaultMessageTimeToLive = [System.TimeSpan]::FromMinutes($DefaultMessageTimeToLive)
	    }
	    if ($DuplicateDetectionHistoryTimeWindow -gt 0)
	    {
	        $TopicDescription.DuplicateDetectionHistoryTimeWindow = [System.TimeSpan]::FromMinutes($DuplicateDetectionHistoryTimeWindow)
	    }
	    $TopicDescription.EnableBatchedOperations = $EnableBatchedOperations
	    $TopicDescription.EnableExpress = $EnableExpress
	    $TopicDescription.EnableFilteringMessagesBeforePublishing = $EnableFilteringMessagesBeforePublishing
	    $TopicDescription.EnablePartitioning = $EnablePartitioning
	    $TopicDescription.IsAnonymousAccessible = $IsAnonymousAccessible
	    $TopicDescription.MaxSizeInMegabytes = $MaxSizeInMegabytes
	    $TopicDescription.RequiresDuplicateDetection = $RequiresDuplicateDetection
	    if ($EnablePartitioning)
	    {
	        $TopicDescription.SupportOrdering = $False
	    }
	    else
	    {
	        $TopicDescription.SupportOrdering = $SupportOrdering
	    }
	    $TopicDescription.UserMetadata = $UserMetadata
	    $NamespaceManager.CreateTopic($TopicDescription);
	}

## Next steps

This article provides you with a basic outline for provisioning Service Bus entities using PowerShell. Although there are a limited number of PowerShell cmdlets available for managing Service Bus messaging entities, by referencing the Microsoft.ServiceBus.dll assembly, virtually any operation you can perform using the .NET client libraries you can also perform in a PowerShell script.

There are more detailed examples available on these blogs posts:

- [How to create Service Bus queues, topics and subscriptions using a PowerShell script](http://blogs.msdn.com/b/paolos/archive/2014/12/02/how-to-create-a-service-bus-queues-topics-and-subscriptions-using-a-powershell-script.aspx)
- [How to create a Service Bus Namespace and an Event Hub using a PowerShell script](http://blogs.msdn.com/b/paolos/archive/2014/12/01/how-to-create-a-service-bus-namespace-and-an-event-hub-using-a-powershell-script.aspx)

Some ready-made script are also available for download:
- [Service Bus PowerShell Scripts](https://code.msdn.microsoft.com/windowsazure/Service-Bus-PowerShell-a46b7059)

<!--Anchors-->

[Purchase Options]: http://azure.microsoft.com/pricing/purchase-options/
[Member Offers]: http://azure.microsoft.com/pricing/member-offers/
[Free Trial]: http://azure.microsoft.com/pricing/free-trial/
[Service Bus NuGet package]: http://www.nuget.org/packages/WindowsAzure.ServiceBus/
[Get-AzureSBNamespace]: https://msdn.microsoft.com/library/azure/dn495122.aspx
[New-AzureSBNamespace]: https://msdn.microsoft.com/library/azure/dn495165.aspx
[Get-AzureSBAuthorizationRule]: https://msdn.microsoft.com/library/azure/dn495113.aspx
[.NET API for Service Bus]: https://msdn.microsoft.com/library/microsoft.servicebus.aspx