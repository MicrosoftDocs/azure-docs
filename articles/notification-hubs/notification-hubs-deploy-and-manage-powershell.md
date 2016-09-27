<properties 
	pageTitle="Deploy and Manage Notification Hubs using PowerShell" 
	description="How to Create and Manage Notification Hubs Using PowerShell for Automation" 
	services="notification-hubs" 
	documentationCenter="" 
	authors="wesmc7777" 
	manager="erikre" 
	editor="" />

<tags 
	ms.service="notification-hubs" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="powershell" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/29/2016" 
	ms.author="wesmc"/>

# Deploy and Manage Notification Hubs using PowerShell

##Overview

This article shows you how to use Create and Manage Azure Notification Hubs using PowerShell. The following common automation tasks are shown in this topic.

+ Create a Notification Hub
+ Set Credentials

If you also need to create a new service bus namespace for your notification hubs, see [Manage Service Bus with PowerShell](../service-bus/service-bus-powershell-how-to-provision.md).

Managing Notifications Hubs is not supported directly by the cmdlets included with Azure PowerShell. The best approach from PowerShell is to reference the Microsoft.Azure.NotificationHubs.dll assembly. The assembly is distributed with the [Microsoft Azure Notification Hubs NuGet package](https://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/).


## Prerequisites

Before you begin this article, you must have the following:

- An Azure subscription. Azure is a subscription-based platform. For more
information about obtaining a subscription, see [Purchase Options],
[Member Offers], or [Free Trial].

- A computer with Azure PowerShell. For instructions, see [Install and configure Azure PowerShell].

- A general understanding of PowerShell scripts, NuGet packages, and the .NET Framework.


## Including a reference to the .NET assembly for Service Bus

Managing Azure Notification Hubs is not yet included with the PowerShell cmdlets in Azure PowerShell. To provision notification hubs, you can use the .NET client provided in the [Microsoft Azure Notification Hubs NuGet package](https://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/).

First, make sure your script can locate the **Microsoft.Azure.NotificationHubs.dll** assembly, which is installed as a NuGet package in a Visual Studio project. In order to be flexible, the script performs these steps:

1. Determines the path at which it was invoked.
2. Traverses the path until it finds a folder named `packages`. This folder is created when you install NuGet packages for Visual Studio projects.
3. Recursively searches the `packages` folder for an assembly named **Microsoft.Azure.NotificationHubs.dll**.
4. References the assembly so that the types are available for later use.

Here's how these steps are implemented in a PowerShell script:

``` powershell

try
{
    # WARNING: Make sure to reference the latest version of Microsoft.Azure.NotificationHubs.dll
    Write-Output "Adding the [Microsoft.Azure.NotificationHubs.dll] assembly to the script..."
    $scriptPath = Split-Path (Get-Variable MyInvocation -Scope 0).Value.MyCommand.Path
    $packagesFolder = (Split-Path $scriptPath -Parent) + "\packages"
    $assembly = Get-ChildItem $packagesFolder -Include "Microsoft.Azure.NotificationHubs.dll" -Recurse
    Add-Type -Path $assembly.FullName

    Write-Output "The [Microsoft.Azure.NotificationHubs.dll] assembly has been successfully added to the script."
}

catch [System.Exception]
{
    Write-Error("Could not add the Microsoft.Azure.NotificationHubs.dll assembly to the script. Make sure you build the solution before running the provisioning script.")
}
```

## Create the NamespaceManager class

To provision Notification Hubs, create an instance of the [NamespaceManager](https://msdn.microsoft.com/library/azure/microsoft.azure.notificationhubs.namespacemanager.aspx) class from the SDK. 

You can use the [Get-AzureSBAuthorizationRule] cmdlet included with Azure PowerShell to retrieve an authorization rule that's used to provide a connection string. We'll store a reference to the `NamespaceManager` instance in the `$NamespaceManager` variable. We will use `$NamespaceManager` to provision a notification hub.

``` powershell
$sbr = Get-AzureSBAuthorizationRule -Namespace $Namespace
# Create the NamespaceManager object to create the hub
Write-Output "Creating a NamespaceManager object for the [$Namespace] namespace..."
$NamespaceManager=[Microsoft.Azure.NotificationHubs.NamespaceManager]::CreateFromConnectionString($sbr.ConnectionString);
Write-Output "NamespaceManager object for the [$Namespace] namespace has been successfully created."
```


## Provisioning a new Notification Hub 

To provision a new notification hub, use the [.NET API for Notification Hubs].

In this part of the script you set up four local variables. 

1. `$Namespace` : Set this to the name of the namespace where you want to create a notification hub.
2. `$Path` : Set this path to the name of the new notification hub.  For example, "MyHub".    
3. `$WnsPackageSid` : Set this to the package SID for you Windows App from the [Windows Dev Center](http://go.microsoft.com/fwlink/p/?linkid=266582&clcid=0x409).
4. `$WnsSecretkey`: Set this to the secret key for you Windows App from the [Windows Dev Center](http://go.microsoft.com/fwlink/p/?linkid=266582&clcid=0x409).

These variables are used to connect to your namespace and create a new Notification Hub configured to handle Windows Notification Services (WNS) notifications with WNS credentials for a Windows App. For information on obtaining the package SID and secret key see, the [Getting Started with Notification Hubs](notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md) tutorial. 

+ The script snippet uses the `NamespaceManager` object to check to see if the Notification Hub identified by `$Path` exists.

+ If it does not exist, the script will create an `NotificationHubDescription` with WNS credentials and pass that to the `NamespaceManager` class `CreateNotificationHub` method.

``` powershell

$Namespace = "<Enter your namespace>"
$Path  = "<Enter a name for your notification hub>"
$WnsPackageSid = "<your package sid>"
$WnsSecretkey = "<enter your secret key>"

$WnsCredential = New-Object -TypeName Microsoft.Azure.NotificationHubs.WnsCredential -ArgumentList $WnsPackageSid,$WnsSecretkey

# Query the namespace
$CurrentNamespace = Get-AzureSBNamespace -Name $Namespace

# Check if the namespace already exists
if ($CurrentNamespace)
{
    Write-Output "The namespace [$Namespace] in the [$($CurrentNamespace.Region)] region was found."

    # Create the NamespaceManager object used to create a new notification hub
    $sbr = Get-AzureSBAuthorizationRule -Namespace $Namespace
    Write-Output "Creating a NamespaceManager object for the [$Namespace] namespace..."
    $NamespaceManager = [Microsoft.Azure.NotificationHubs.NamespaceManager]::CreateFromConnectionString($sbr.ConnectionString);
    Write-Output "NamespaceManager object for the [$Namespace] namespace has been successfully created."

    # Check to see if the Notification Hub already exists
    if ($NamespaceManager.NotificationHubExists($Path))
    {
        Write-Output "The [$Path] notification hub already exists in the [$Namespace] namespace."  
    }
    else
    {
        Write-Output "Creating the [$Path] notification hub in the [$Namespace] namespace."
        $NHDescription = New-Object -TypeName Microsoft.Azure.NotificationHubs.NotificationHubDescription -ArgumentList $Path;
        $NHDescription.WnsCredential = $WnsCredential;
        $NamespaceManager.CreateNotificationHub($NHDescription);
        Write-Output "The [$Path] notification hub was created in the [$Namespace] namespace."
    }
}
else
{
    Write-Host "The [$Namespace] namespace does not exist."
}
```




## Additional Resources

- [Manage Service Bus with PowerShell](../service-bus/service-bus-powershell-how-to-provision.md)
- [How to create Service Bus queues, topics and subscriptions using a PowerShell script](http://blogs.msdn.com/b/paolos/archive/2014/12/02/how-to-create-a-service-bus-queues-topics-and-subscriptions-using-a-powershell-script.aspx)
- [How to create a Service Bus Namespace and an Event Hub using a PowerShell script](http://blogs.msdn.com/b/paolos/archive/2014/12/01/how-to-create-a-service-bus-namespace-and-an-event-hub-using-a-powershell-script.aspx)

Some ready-made scripts are also available for download:
- [Service Bus PowerShell Scripts](https://code.msdn.microsoft.com/windowsazure/Service-Bus-PowerShell-a46b7059)
 

[Purchase Options]: http://azure.microsoft.com/pricing/purchase-options/
[Member Offers]: http://azure.microsoft.com/pricing/member-offers/
[Free Trial]: http://azure.microsoft.com/pricing/free-trial/
[Install and configure Azure PowerShell]: ../powershell-install-configure.md
[.NET API for Notification Hubs]: https://msdn.microsoft.com/library/azure/mt414893.aspx
[Get-AzureSBNamespace]: https://msdn.microsoft.com/library/azure/dn495122.aspx
[New-AzureSBNamespace]: https://msdn.microsoft.com/library/azure/dn495165.aspx
[Get-AzureSBAuthorizationRule]: https://msdn.microsoft.com/library/azure/dn495113.aspx
 
