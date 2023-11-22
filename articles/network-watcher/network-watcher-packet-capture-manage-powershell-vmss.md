---
title: Manage packet captures in virtual machine scale sets - Azure PowerShell
titleSuffix: Azure Network Watcher
description: Learn how to manage packet captures in virtual machine scale sets with the packet capture feature of Network Watcher using PowerShell.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 06/07/2022
ms.author: halkazwini 
ms.custom: devx-track-azurepowershell, engagement-fy23
---

# Manage packet captures in Virtual machine scale set with Azure Network Watcher using PowerShell

> [!div class="op_single_selector"]
> - [Azure portal](network-watcher-packet-capture-manage-portal-vmss.md)
> - [PowerShell](network-watcher-packet-capture-manage-powershell-vmss.md)


Network Watcher packet capture allows you to create capture sessions to track traffic to and from a virtual machine scale set instance/(s). Filters are provided for the capture session to ensure you capture only the traffic you want. Packet capture helps to diagnose network anomalies, both reactively, and proactively. Other uses include gathering network statistics, gaining information on network intrusions, to debug client-server communication, and much more. Being able to remotely trigger packet captures, eases the burden of running a packet capture manually on a desired virtual machine scale set instance/(s), which saves valuable time.

This article takes you through the different management tasks that are currently available for packet capture.

- [**Start a packet capture**](#start-a-packet-capture)
- [**Stop a packet capture**](#stop-a-packet-capture)
- [**Delete a packet capture**](#delete-a-packet-capture)
- [**Download a packet capture**](#download-a-packet-capture)


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Before you begin

This article assumes you have the following resources:

* An instance of Network Watcher in the region you want to create a packet capture

> [!IMPORTANT]
> Packet capture requires a virtual machine scale set extension `AzureNetworkWatcherExtension`. For installing the extension on a Windows VM visit [Azure Network Watcher Agent virtual machine extension for Windows](../virtual-machines/extensions/network-watcher-windows.md) and for Linux VM visit [Azure Network Watcher Agent virtual machine extension for Linux](../virtual-machines/extensions/network-watcher-linux.md).

## Install virtual machine scale set extension

### Step 1

```powershell
$vmss = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"
```

### Step 2

Install networkWatcherAgent on virtual machine scale set/ virtual machine scale set instance/(s)


```powershell
Add-AzVmssExtension -VirtualMachineScaleSet $vmss -Name "AzureNetworkWatcherExtension" -Publisher "Microsoft.Azure.NetworkWatcher" -Type "NetworkWatcherAgentWindows" -TypeHandlerVersion "1.4" -AutoUpgradeMinorVersion $True

Update-AzVmss -ResourceGroupName "$resourceGroupName" -Name $virtualMachineScaleSetName -VirtualMachineScaleSet $vmss
Update-AzVmssInstance -ResourceGroupName "$resourceGroupName" -VMScaleSetName $vmss.Name -InstanceId 0
> The `Set-AzVMExtension` cmdlet may take several minutes to complete.
```

### Step 3

To ensure that the agent is installed, follow Step 1


```powershell
Get-AzVMss -ResourceGroupName $vmss.ResourceGroupName  -VMNScaleSetName $vmss.Name
```


## Start a packet capture

Once the preceding steps are complete, the packet capture agent is installed on the virtual machine scale set.

### Step 1

The next step is to retrieve the Network Watcher instance. This variable is passed to the `New-AzNetworkWatcherPacketCapture` cmdlet in step 4.

```powershell
$networkWatcher = Get-AzNetworkWatcher  | Where {$_.Location -eq "westcentralus" }
```

### Step 2

Retrieve a storage account. This storage account is used to store the packet capture file.

```powershell
$storageAccount = Get-AzStorageAccount -ResourceGroupName testrg -Name testrgsa123
```

### Step 3

Filters can be used to limit the data that is stored by the packet capture. The following example sets up two filters.  One filter collects outgoing TCP traffic only from local IP 10.0.0.3 to destination ports 20, 80 and 443.  The second filter collects only UDP traffic.

```powershell
$filter1 = New-AzPacketCaptureFilterConfig -Protocol TCP -RemoteIPAddress "1.1.1.1-255.255.255.255" -LocalIPAddress "10.0.0.3" -LocalPort "1-65535" -RemotePort "20;80;443"
$filter2 = New-AzPacketCaptureFilterConfig -Protocol UDP
```

> [!NOTE]
> Multiple filters can be defined for a packet capture.

### Step 4

Create Scope for packet capture
```powershell
$s1 = New-AzPacketCaptureScopeConfig -Include "0", "1"
```


### Step 5

Run the `New-AzNetworkWatcherPacketCaptureV2` cmdlet to start the packet capture process, passing the required values retrieved in the preceding steps.
```powershell

New-AzNetworkWatcherPacketCaptureV2 -NetworkWatcher $networkwatcher -PacketCaptureName $pcName -TargetId $vmss.Id -TargetType "azurevmss" -StorageAccountId $storageAccount.id -Filter $filter1, $filter2
```
## Get a packet capture

Running the `Get-AzNetworkWatcherPacketCapture` cmdlet, retrieves the status of a currently running, or completed packet capture.

```powershell
Get-AzNetworkWatcherPacketCapture -NetworkWatcher $networkWatcher -PacketCaptureName "PacketCaptureTest"
```

The following example is the output from the `Get-AzNetworkWatcherPacketCapture` cmdlet. The following example is after the capture is complete. The PacketCaptureStatus value is Stopped, with a StopReason of TimeExceeded. This value shows that the packet capture was successful and ran its time.
```
Name                    : PacketCaptureTest
Id                      : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/NetworkWatcherRG/providers/Microsoft.Network/networkWatcher
                          s/NetworkWatcher_westcentralus/packetCaptures/PacketCaptureTest
Etag                    : W/"4b9a81ed-dc63-472e-869e-96d7166ccb9b"
ProvisioningState       : Succeeded
Target                  : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Compute/virtualMachines/testvm1
BytesToCapturePerPacket : 0
TotalBytesPerSession    : 1073741824
TimeLimitInSeconds      : 60
StorageLocation         : {
                            "StorageId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testrg/providers/Microsoft.Storage/storageA
                          ccounts/examplestorage",
                            "StoragePath": "https://examplestorage.blob.core.windows.net/network-watcher-logs/subscriptions/00000000-0000-0000-0000-00000
                          0000000/resourcegroups/testrg/providers/microsoft.compute/virtualmachines/testvm1/2017/02/01/packetcapture_22_42_48_238.cap"
                          }
Filters                 : [
                            {
                              "Protocol": "TCP",
                              "RemoteIPAddress": "1.1.1.1-255.255.255",
                              "LocalIPAddress": "10.0.0.3",
                              "LocalPort": "1-65535",
                              "RemotePort": "20;80;443"
                            },
                            {
                              "Protocol": "UDP",
                              "RemoteIPAddress": "",
                              "LocalIPAddress": "",
                              "LocalPort": "",
                              "RemotePort": ""
                            }
                          ]
CaptureStartTime        : 2/1/2017 10:43:01 PM
PacketCaptureStatus     : Stopped
StopReason              : TimeExceeded
PacketCaptureError      : []
```

## Stop a packet capture

By running the `Stop-AzNetworkWatcherPacketCapture` cmdlet, if a capture session is in progress it's stopped.

```powershell
Stop-AzNetworkWatcherPacketCapture -NetworkWatcher $networkWatcher -PacketCaptureName "PacketCaptureTest"
```

> [!NOTE]
> The cmdlet returns no response when ran on a currently running capture session or an existing session that has already stopped.

## Delete a packet capture

```powershell
Remove-AzNetworkWatcherPacketCapture -NetworkWatcher $networkWatcher -PacketCaptureName "PacketCaptureTest"
```

> [!NOTE]
> Deleting a packet capture does not delete the file in the storage account.

## Download a packet capture

Once your packet capture session has completed, the capture file can be uploaded to blob storage or to a local file on the instance/(s). The storage location of the packet capture is defined at creation of the session. A convenient tool to access these capture files saved to a storage account is Microsoft Azure Storage Explorer, which can be downloaded here:  https://storageexplorer.com/

If a storage account is specified, packet capture files are saved to a storage account at the following location:

If multiple instances are selected 
```
https://{storageAccountName}.blob.core.windows.net/network-watcher-logs/subscriptions/{subscriptionId}/resourcegroups/{storageAccountResourceGroup}/providers/microsoft.compute/virtualmachinescalesets/{VMSSName}/{year}/{month}/{day}/packetCapture_{creationTime}
```
If single instance is selected
```
https://{storageAccountName}.blob.core.windows.net/network-watcher-logs/subscriptions/{subscriptionId}/resourcegroups/{storageAccountResourceGroup}/providers/microsoft.compute/virtualmachinescalesets/{VMSSName}/virtualMachines/{instance}/{year}/{month}/{day}/packetCapture_{creationTime}.cap
```



## Next steps

Find if certain traffic is allowed in or out of your VM by visiting [Check IP flow verify](diagnose-vm-network-traffic-filtering-problem.md)

<!-- Image references -->