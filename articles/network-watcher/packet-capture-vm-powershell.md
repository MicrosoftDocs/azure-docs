---
title: Manage packet captures for VMs - Azure PowerShell
titleSuffix: Azure Network Watcher
description: Learn how to start, stop, download, and delete Azure virtual machines packet captures with the packet capture feature of Network Watcher using Azure PowerShell.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 02/07/2024
ms.custom: devx-track-azurepowershell
#CustomerIntent: As an administrator, I want to capture IP packets to and from a virtual machine (VM) so I can review and analyze the data to help diagnose and solve network problems.
---

# Manage packet captures for virtual machines with Azure Network Watcher using PowerShell

The Network Watcher packet capture tool allows you to create capture sessions to record network traffic to and from an Azure virtual machine (VM). Filters are provided for the capture session to ensure you capture only the traffic you want. Packet capture helps in diagnosing network anomalies both reactively and proactively. Its applications extend beyond anomaly detection to include gathering network statistics, acquiring insights into network intrusions, debugging client-server communication, and addressing various other networking challenges. Network Watcher packet capture enables you to initiate packet captures remotely, alleviating the need for manual execution on a specific virtual machine.

In this article, you learn how to remotely configure, start, stop, download, and delete a virtual machine packet capture using Azure PowerShell. To learn how to manage packet captures using the Azure portal or Azure CLI, see [Manage packet captures for virtual machines using the Azure portal](packet-capture-vm-portal.md) or [Manage packet captures for virtual machines using the Azure CLI](packet-capture-vm-cli.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. This article requires the Azure PowerShell `Az` module. To find the installed version, run `Get-Module -ListAvailable Az`. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

- A virtual machine with the following outbound TCP connectivity:
    - to the storage account over port 443
    - to 169.254.169.254 over port 80
    - to 168.63.129.16 over port 8037

> [!NOTE]
> - Azure creates a Network Watcher instance in the the virtual machine's region if Network Watcher wasn't enabled for that region. For more information, see [Enable or disable Azure Network Watcher](network-watcher-create.md).
> - Network Watcher packet capture requires Network Watcher agent VM extension to be installed on the target virtual machine. For more information, see [Install Network Watcher agent](#install-network-watcher-agent).
> - The last two IP addresses and ports listed in the **Prerequisites** are common across all Network Watcher tools that use the Network Watcher agent and might occasionally change.

If a network security group is associated to the network interface, or subnet that the network interface is in, ensure that rules exist to allow outbound connectivity over the previous ports. Similarly, ensure outbound connectivity over the previous ports when adding user-defined routes to your network.

## Install Network Watcher agent

To use packet capture, the Network Watcher agent virtual machine extension must be installed on the virtual machine.

Use [Get-AzVMExtension](/powershell/module/az.compute/get-azvmextension) cmdlet to check if the extension is installed on the virtual machine:

```azurepowershell-interactive
# List the installed extensions on the virtual machine.
Get-AzVMExtension -VMName 'myVM' -ResourceGroupName 'myResourceGroup' | format-table Name, Publisher, ExtensionType, EnableAutomaticUpgrade 
```

If the extension is installed on the virtual machine, then you can see it listed in the output of the preceding command:

```output
Name                         Publisher                      ExtensionType            EnableAutomaticUpgrade
----                         ---------                      -------------            ----------------------
AzureNetworkWatcherExtension Microsoft.Azure.NetworkWatcher NetworkWatcherAgentLinux                   True
```

If the extension isn't installed, then use [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) cmdlet to install it:

```azurepowershell-interactive
# Install Network Watcher agent on a Linux virtual machine.
Set-AzVMExtension -Publisher 'Microsoft.Azure.NetworkWatcher' -ExtensionType 'NetworkWatcherAgentLinux' -Name 'AzureNetworkWatcherExtension' -VMName 'myVM' -ResourceGroupName 'myResourceGroup' -TypeHandlerVersion '1.4' -EnableAutomaticUpgrade 1 
```

```azurepowershell-interactive
# Install Network Watcher agent on a Windows virtual machine.
Set-AzVMExtension -Publisher 'Microsoft.Azure.NetworkWatcher' -ExtensionType 'NetworkWatcherAgentWindows' -Name 'AzureNetworkWatcherExtension' -VMName 'myVM' -ResourceGroupName 'myResourceGroup' -TypeHandlerVersion '1.4' -EnableAutomaticUpgrade 1 
```

After a successful installation of the extension, you see the following output: 

```output
RequestId IsSuccessStatusCode StatusCode ReasonPhrase
--------- ------------------- ---------- ------------
                         True         OK 
```

## Start a packet capture

To start a capture session, use [New-AzNetworkWatcherPacketCapture](/powershell/module/az.network/new-aznetworkwatcherpacketcapture) cmdlet:

```azurepowershell-interactive
# Place the virtual machine configuration into a variable.
$vm = Get-AzVM -ResourceGroupName 'myResourceGroup' -Name 'myVM'

# Place the storage account configuration into a variable.
$storageAccount = Get-AzStorageAccount -ResourceGroupName 'myResourceGroup' -Name 'mystorageaccount'

# Start the Network Watcher capture session.
New-AzNetworkWatcherPacketCapture -Location 'eastus' -PacketCaptureName 'myVM_1' -TargetVirtualMachineId $vm.Id  -StorageAccountId $storageAccount.Id 
```

Once the capture session is started, you see the following output:

```output
ProvisioningState Name   BytesToCapturePerPacket TotalBytesPerSession TimeLimitInSeconds
----------------- ----   ----------------------- -------------------- ------------------
Succeeded         myVM_1 0                       1073741824           18000
```

The following table describes the optional parameters that you can use with the `New-AzNetworkWatcherPacketCapture` cmdlet:

| Parameter | description |
| --- | --- |
| `-Filter` | Add filter(s) to capture only the traffic you want. For example, you can capture only TCP traffic from a specific IP address to a specific port. |
| `-TimeLimitInSeconds` | Set the maximum duration of the capture session. The default value is 18000 seconds (5 hours). |
| `-BytesToCapturePerPacket` | Set the maximum number of bytes to be captured per each packet. All bytes are captured if not used or 0 entered. |
| `-TotalBytesPerSession` | Set the total number of bytes that are captured. Once the value is reached the packet capture stops. Up to 1 GB (1,073,741,824 bytes) is captured if not used. |
| `-LocalFilePath` | Enter a valid local file path if you want the capture to be saved in the target virtual machine (For example, C:\Capture\myVM_1.cap). If you're using a Linux machine, the path must start with /var/captures. |

## Stop a packet capture

Use [Stop-AzNetworkWatcherPacketCapture](/powershell/module/az.network/stop-aznetworkwatcherpacketcapture) cmdlet to manually stop a running packet capture session.

```azurepowershell-interactive
# Manually stop a packet capture session.
Stop-AzNetworkWatcherPacketCapture -Location 'eastus' -PacketCaptureName 'myVM_1'
```

> [!NOTE]
> The cmdlet doesn't return a response whether ran on a currently running capture session or a session that has already stopped.

## Get a packet capture

Use [Get-AzNetworkWatcherPacketCapture](/powershell/module/az.network/get-aznetworkwatcherpacketcapture) cmdlet to retrieve the status of a packet capture (running or completed).

```azurepowershell-interactive
# Get information, properties, and status of a packet capture.
Get-AzNetworkWatcherPacketCapture -Location 'eastus' -PacketCaptureName 'myVM_1'
```

The following output is an example of the output from the `Get-AzNetworkWatcherPacketCapture` cmdlet. The following example is after the capture is complete. The PacketCaptureStatus value is Stopped, with a StopReason of TimeExceeded. This value shows that the packet capture was successful and ran its time.

```output
ProvisioningState Name   Target                                                                                                                              BytesToCapturePerPacket TotalBytesPerSession TimeLimitInSeconds
----------------- ----   ------                                                                                                                              ----------------------- -------------------- ------------------
Succeeded         myVM_1 /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM 0                       1073741824           18000
```

> [!NOTE]
> To get more details in the output, add `| Format-List` to the end of the command.

## Download a packet capture

After concluding your packet capture session, the resulting capture file is saved to Azure storage, a local file on the target virtual machine or both. The storage destination for the packet capture is specified during its creation. For more information, see [Start a packet capture](#start-a-packet-capture).

If a storage account is specified, capture files are saved to the storage account at the following path:

```url
https://{storageAccountName}.blob.core.windows.net/network-watcher-logs/subscriptions/{subscriptionId}/resourcegroups/{storageAccountResourceGroup}/providers/microsoft.compute/virtualmachines/{virtualMachineName}/{year}/{month}/{day}/packetcapture_{UTCcreationTime}.cap
```

To download a packet capture file saved to Azure storage, use [Get-AzStorageBlobContent](/powershell/module/az.storage/get-azstorageblobcontent) cmdlet:

```azurepowershell-interactive
# Download the packet capture file from Azure storage container.
Get-AzStorageBlobContent -Container 'network-watcher-logs' -Blob 'subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/myresourcegroup/providers/microsoft.compute/virtualmachines/myvm/2024/01/25/packetcapture_22_44_54_342.cap' -Destination 'C:\Capture\myVM_1.cap'
```

> [!NOTE]
> You can also download the capture file from the storage account container using the Azure Storage Explorer. Storage Explorer is a standalone app that you can conveniently use to access and work with Azure Storage data. For more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

## Delete a packet capture

```azurepowershell-interactive
# Remove a packet capture resource.
Remove-AzNetworkWatcherPacketCapture -Location 'eastus' -PacketCaptureName 'myVM_1'
```

> [!IMPORTANT]
> Deleting a packet capture in Network Watcher doesn't delete the capture file from the storage account or the virtual machine. If you don't need the capture file anymore, you must manually delete it from the storage account to avoid incurring storage costs.

## Related content

- To learn how to automate packet captures with virtual machine alerts, see [Create an alert triggered packet capture](network-watcher-alert-triggered-packet-capture.md).
- To learn how to analyze a Network Watcher packet capture file using Wireshark, see [Inspect and analyze Network Watcher packet capture files](packet-capture-inspect.md).
