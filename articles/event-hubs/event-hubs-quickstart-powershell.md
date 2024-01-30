---
title: 'Quickstart: Create an event hub using PowerShell'
description: This quickstart describes how to create an event hub using Azure PowerShell and then send and receive events using .NET Standard SDK.
ms.topic: quickstart
ms.date: 03/13/2023
ms.custom: devx-track-azurepowershell, mode-api, devx-track-dotnet
---

# Quickstart: Create an event hub using Azure PowerShell
In this quickstart, you create an event hub using Azure PowerShell.

## Prerequisites
An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you're using PowerShell locally, you must run the latest version of PowerShell to complete this quickstart. If you need to install or upgrade, see [Install and Configure Azure PowerShell](/powershell/azure/install-azure-powershell).

## Create a resource group
Run the following command to create a resource group. A resource group is a logical collection of Azure resources. All resources are deployed and managed in a resource group. 

If you're using Azure Cloud Shell, switch to **PowerShell** from **Bash** in the upper left corner. Select **Copy** to copy the command and paste it into the Cloud Shell, and run it. 

The following example creates a resource group in the East US region. Replace `myResourceGroup` with the name of the resource group you want to use.

```azurepowershell-interactive
$rgName="myResourceGroup$(Get-Random)"
$region="eastus"
New-AzResourceGroup –Name $rgName –Location $region
```
You see the output similar to the following one. You see the name of the resource with the random number suffix. 

```bash
ResourceGroupName : myResourceGroup1625872532
Location          : eastus
ProvisioningState : Succeeded
Tags              : 
ResourceId        : /subscriptions/0000000000-0000-0000-0000-0000000000000/resourceGroups/myResourceGroup1625872532
```

## Create an Event Hubs namespace
Run the following command to create an Event Hubs namespace in the resource group. An Event Hubs namespace provides a unique fully qualified domain name in which you can create one or more event hubs. Update the value of the namespace if you like. 

```azurepowershell-interactive
$namespaceName="myNamespace$(Get-Random)"
New-AzEventHubNamespace -ResourceGroupName $rgName -NamespaceName $namespaceName -Location $region
```

You see the output similar to the following one. You see the name of the namespace in the `Name` field. 

```bash
Name                   : myNamespace143349827
Id                     : /subscriptions/0000000000-0000-0000-0000-00000000000000/resourceGroups/myResourceGroup162587253
                         2/providers/Microsoft.EventHub/namespaces/myNamespace143349827
ResourceGroupName      : myResourceGroup1625872532
Location               : East US
Sku                    : Name : Standard , Capacity : 1 , Tier : Standard
Tags                   : 
ProvisioningState      : Succeeded
Status                 : Active
CreatedAt              : 3/13/2023 10:22:54 PM
UpdatedAt              : 3/13/2023 10:23:41 PM
ServiceBusEndpoint     : https://myNamespace143349827.servicebus.windows.net:443/
Enabled                : True
KafkaEnabled           : True
IsAutoInflateEnabled   : False
MaximumThroughputUnits : 0
ZoneRedundant          : False
ClusterArmId           : 
DisableLocalAuth       : False
MinimumTlsVersion      : 1.2
KeySource              : 
Identity               : 
IdentityType           : 
IdentityId             : 
EncryptionConfig       :
```

## Create an event hub

Now that you have an Event Hubs namespace, create an event hub within that namespace by running the following command.  

```azurepowershell-interactive
$ehubName="myEventHub"
New-AzEventHub -ResourceGroupName $rgName -NamespaceName $namespaceName -EventHubName $ehubName
```
You see output similar to the following one. 

```bash
ArchiveNameFormat            : 
BlobContainer                : 
CaptureEnabled               : 
CreatedAt                    : 3/13/2023 10:26:07 PM
DataLakeAccountName          : 
DataLakeFolderPath           : 
DataLakeSubscriptionId       : 
DestinationName              : 
Encoding                     : 
Id                           : /subscriptions/00000000000-0000-0000-0000-00000000000000/resourceGroups/myResourceGroup162
                               5872532/providers/Microsoft.EventHub/namespaces/myNamespace143349827/eventhubs/myEven
                               tHub
IntervalInSeconds            : 
Location                     : eastus
MessageRetentionInDays       : 7
Name                         : myEventHub
PartitionCount               : 4
PartitionId                  : {0, 1, 2, 3}
ResourceGroupName            : myResourceGroup1625872532
SizeLimitInBytes             : 
SkipEmptyArchive             : 
Status                       : Active
StorageAccountResourceId     : 
SystemDataCreatedAt          : 
SystemDataCreatedBy          : 
SystemDataCreatedByType      : 
SystemDataLastModifiedAt     : 
SystemDataLastModifiedBy     : 
SystemDataLastModifiedByType : 
Type                         : Microsoft.EventHub/namespaces/eventhubs
UpdatedAt                    : 3/13/2023 10:26:07 PM
```

Congratulations! You have used Azure PowerShell to create an Event Hubs namespace, and an event hub within that namespace. 

## Clean up resources
If you want to keep this event hub so that you can test sending and receiving events, ignore this section. Otherwise, run the following command to delete the resource group. This command deletes all the resources in the resource group and the resource group itself.

```azurepowershell-interactive
Remove-AzResourceGroup $rgName
```


## Next steps

In this article, you created the Event Hubs namespace, and used sample applications to send and receive events from your event hub. For step-by-step instructions to send events to (or) receive events from an event hub, see the **Send and receive events** tutorials: 

- [.NET Core](event-hubs-dotnet-standard-getstarted-send.md)
- [Java](event-hubs-java-get-started-send.md)
- [Python](event-hubs-python-get-started-send.md)
- [JavaScript](event-hubs-node-get-started-send.md)
- [Go](event-hubs-go-get-started-send.md)
- [C (send only)](event-hubs-c-getstarted-send.md)
- [Apache Storm (receive only)](event-hubs-storm-getstarted-receive.md)


[create a free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install and Configure Azure PowerShell]: /powershell/azure/install-az-ps
[New-AzResourceGroup]: /powershell/module/az.resources/new-azresourcegroup
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
[3]: ./media/event-hubs-quickstart-powershell/sender1.png
[4]: ./media/event-hubs-quickstart-powershell/receiver1.png
[5]: ./media/event-hubs-quickstart-powershell/metrics.png
