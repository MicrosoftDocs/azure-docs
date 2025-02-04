---
title: Manage packet captures for VMs
titleSuffix: Azure Network Watcher
description: Learn how to start, stop, download, and delete Azure virtual machines packet captures with the packet capture feature of Network Watcher.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 01/31/2025

#CustomerIntent: As an administrator, I want to capture IP packets to and from a virtual machine (VM) so I can review and analyze the data to help diagnose and solve network problems.
---

# Manage packet captures with Azure Network Watcher

In this article, you learn how to use the Azure Network Watcher [packet capture](packet-capture-overview.md) feature to remotely configure, start, stop, download, and delete virtual machine packet captures.

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A virtual machine (VM) or virtual machine scale set with outbound TCP connectivity to: `169.254.169.254` over port `80` and `168.63.129.16` over port `8037`. The Network Watcher agent VM extension uses these IP addresses to communicate with the Azure platform.

- Network Watcher Agent VM extension installed on the target virtual machine. Whenever you use Network Watcher packet capture in the Azure portal, the agent is automatically installed on the target VM or scale set if it wasn't previously installed. To update an already installed agent, see [Update Azure Network Watcher extension to the latest version](network-watcher-agent-update.md).

- An Azure storage account with VM outbound TCP connectivity to it over port `443`. If you don't have a storage account, see [Create a storage account using the Azure portal](../storage/common/storage-account-create.md?tabs=azure-portal&toc=/azure/network-watcher/toc.json). The storage account must be accessible from the subnet of the target virtual machine or scale set. For more information, see [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md?tabs=azure-portal&toc=/azure/network-watcher/toc.json).

- Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A virtual machine (VM) with outbound TCP connectivity to: `169.254.169.254` over port `80` and `168.63.129.16` over port `8037`. The Network Watcher agent VM extension uses these IP addresses to communicate with the Azure platform.

- Network Watcher Agent VM extension installed on the target virtual machine. For more information, see [Manage Network Watcher Agent VM extension for Windows](network-watcher-agent-windows.md?tabs=powershell) or [Manage Network Watcher Agent VM extension for Linux](network-watcher-agent-linux.md?tabs=powershell).

- An Azure storage account with VM outbound TCP connectivity to it over port `443`. If you don't have a storage account, see [Create a storage account using PowerShell](../storage/common/storage-account-create.md?tabs=azure-powershell&toc=/azure/network-watcher/toc.json). The storage account must be accessible from the subnet of the target virtual machine or scale set. For more information, see [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md?tabs=azure-powershell&toc=/azure/network-watcher/toc.json).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also install Azure PowerShell locally to run the cmdlets. This article requires the Az PowerShell module. For more information, see [How to install Azure PowerShell](/powershell/azure/install-azure-powershell). If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A virtual machine (VM) with outbound TCP connectivity to: `169.254.169.254` over port `80` and `168.63.129.16` over port `8037`. The Network Watcher agent VM extension uses these IP addresses to communicate with the Azure platform.

- Network Watcher Agent VM extension installed on the target virtual machine. For more information, see [Manage Network Watcher Agent VM extension for Windows](network-watcher-agent-windows.md?tabs=cli) or [Manage Network Watcher Agent VM extension for Linux](network-watcher-agent-linux.md?tabs=cli).

- An Azure storage account with VM outbound TCP connectivity to it over port `443`. If you don't have a storage account, see [Create a storage account using the Azure CLI](../storage/common/storage-account-create.md?tabs=azure-cli&toc=/azure/network-watcher/toc.json). The storage account must be accessible from the subnet of the target virtual machine or scale set. For more information, see [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md?tabs=azure-cli&toc=/azure/network-watcher/toc.json).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

---

> [!NOTE]
> Azure creates a Network Watcher instance in the virtual machine's region if Network Watcher wasn't enabled for that region. For more information, see [Enable or disable Azure Network Watcher](network-watcher-create.md).

If a network security group is associated to the network interface, or subnet that the network interface is in, ensure that rules exist to allow outbound connectivity over the previous ports. Similarly, ensure outbound connectivity over the previous ports when adding user-defined routes to your network.

## Start a packet capture

# [**Portal**](#tab/portal)

To start a capture session, use the following steps:

1. In the search box at the top of the portal, enter ***Network Watcher***. Select **Network Watcher** from the search results.

    :::image type="content" source="./media/network-watcher-portal-search.png" alt-text="Screenshot shows how to search for Network Watcher in the Azure portal." lightbox="./media/network-watcher-portal-search.png":::

1. Select **Packet capture** under **Network diagnostic tools**, then select **+ Add** to create a packet capture.

    :::image type="content" source="./media/packet-capture-manage/packet-capture.png" alt-text="Screenshot that shows Network Watcher packet capture in the Azure portal." lightbox="./media/packet-capture-manage/packet-capture.png":::

1. In **Add packet capture**, enter or select values for the following settings:

    | Setting | Value |
    | --- | --- |
    | **Basic Details** |  |
    | Subscription | Select the Azure subscription of the virtual machine. |
    | Resource group | Select the resource group of the virtual machine. |
    | Target type | Select **Virtual machine** or **Virtual machine scale set**. |
    | Target virtual machine scale set | Select the virtual machine scale set. <br> This option is available if you select **Virtual machine scale set** as the target type. |
    | Target instance | Select the virtual machine or scale set instance. |
    | Packet capture name | Enter a name or leave the default name. |
    | **Packet capture configuration** |  |
    | Capture location | Select **Storage account** (default option), **File**, or **Both**. |
    | Storage account | Select your **Standard** storage account<sup>1</sup>. <br> This option is available if you select **Storage account** or **Both** as a capture location. <br> The storage account must be in the same region as the target instance. |
    | Local file path | Enter a valid local file path where you want the capture to be saved in the target virtual machine. <br>If you're using a Linux machine, the path can start with `/var/captures`. <br>If you're using a Windows machine, the path can start with `C:\Captures`. <br> This option is available if you select **File** or **Both** as a capture location. |
    | Maximum bytes per packet | Enter the maximum number of bytes to be captured per each packet. All bytes are captured if left blank or 0 entered. |
    | Maximum bytes per session | Enter the total number of bytes that are captured. Once the value is reached the packet capture stops. Up to 1 GB is captured if left blank. |
    | Time limit (seconds) | Enter the time limit of the packet capture session in seconds. Once the value is reached the packet capture stops. Up to 5 hours (18,000 seconds) is captured if left blank. |
    | **Filtering (optional)** |  |   
    | Add filter criteria | Select **Add filter criteria** to add a new filter. You can define as many filters as you need. |
    | Protocol | Filters the packet capture based on the selected protocol. Available values are **TCP**, **UDP**, or **Any**. |   
    | Local IP address<sup>2</sup> | Filters the packet capture for packets where the local IP address matches this value. |
    | Local port<sup>2</sup> | Filters the packet capture for packets where the local port matches this value. |
    | Remote IP address<sup>2</sup> | Filters the packet capture for packets where the remote IP address matches this value. |
    | Remote port<sup>2</sup> | Filters the packet capture for packets where the remote port matches this value. |

    <sup>1</sup> Premium storage accounts are currently not supported for storing packet captures.
    
    <sup>2</sup> Port and IP address values can be a single value, a range such as 80-1024, or multiple values such as 80, 443.

1. Select **Start packet capture**.

    :::image type="content" source="./media/packet-capture-manage/add-packet-capture.png" alt-text="Screenshot of Add packet capture in the Azure portal showing available options." lightbox="./media/packet-capture-manage/add-packet-capture.png":::

1. The packet capture stops once the time limit or the file size (maximum bytes per session) is reached.

# [**PowerShell**](#tab/powershell)

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

The following table describes the optional parameters that you can use with the [New-AzNetworkWatcherPacketCapture](/powershell/module/az.network/new-aznetworkwatcherpacketcapture) cmdlet:

| Parameter | description |
| --- | --- |
| `-Filter` | Add filter(s) to capture only the traffic you want. For example, you can capture only TCP traffic from a specific IP address to a specific port. |
| `-TimeLimitInSeconds` | Set the maximum duration of the capture session. The default value is 18000 seconds (5 hours). |
| `-BytesToCapturePerPacket` | Set the maximum number of bytes to be captured per each packet. All bytes are captured if not used or 0 entered. |
| `-TotalBytesPerSession` | Set the total number of bytes that are captured. Once the value is reached the packet capture stops. Up to 1 GB (1,073,741,824 bytes) is captured if not used. |
| `-LocalFilePath` | Enter a valid local file path if you want the capture to be saved in the target virtual machine (For example, C:\Capture\myVM_1.cap). If you're using a Linux machine, the path must start with /var/captures. |

The packet capture stops once the time limit or the file size (maximum bytes per session) is reached.

# [**Azure CLI**](#tab/cli)

To start a capture session, use [az network watcher packet-capture create](/cli/azure/network/watcher/packet-capture#az-network-watcher-packet-capture-create) command:

```azurecli-interactive
# Start the Network Watcher capture session.
az network watcher packet-capture create --name 'myVM_1' --resource-group 'myResourceGroup' --vm 'myVM' --storage-account 'mystorageaccount'
```

```azurecli-interactive
# Start the Network Watcher capture session (storage account is in different resource group from the VM).
az network watcher packet-capture create --name 'myVM_1' --resource-group 'myResourceGroup' --vm 'myVM' --storage-account '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup2/providers/Microsoft.Storage/storageAccounts/mystorageaccount'
```

Once the capture session is started, you see the following output:

```output
{
  "bytesToCapturePerPacket": 0,
  "etag": "W/\"aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb\"",
  "filters": [],
  "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/NetworkWatcherRG/providers/Microsoft.Network/networkWatchers/NetworkWatcher_eastus/packetCaptures/myVM_1",
  "name": "myVM_1",
  "provisioningState": "Succeeded",
  "resourceGroup": "NetworkWatcherRG",
  "scope": {
    "exclude": [],
    "include": []
  },
  "storageLocation": {
    "storageId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount",
    "storagePath": "https://mystorageaccount.blob.core.windows.net/network-watcher-logs/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/myresourcegroup/providers/microsoft.compute/virtualmachines/myvm/2025/01/31/packetcapture_16_39_41_077.cap"
  },
  "target": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "targetType": "AzureVM",
  "timeLimitInSeconds": 18000,
  "totalBytesPerSession": 1073741824
}
```

The following table describes the optional parameters that you can use with the [az network watcher packet-capture create](/cli/azure/network/watcher/packet-capture#az-network-watcher-packet-capture-create) command:

| Parameter | description |
| --- | --- |
| `--filters` | Add filter(s) to capture only the traffic you want. For example, you can capture only TCP traffic from a specific IP address to a specific port. |
| `--time-limit` | Set the maximum duration of the capture session. The default value is 18000 seconds (5 hours). |
| `--capture-size` | Set the maximum number of bytes to be captured per each packet. All bytes are captured if not used or 0 entered. |
| `--capture-limit` | Set the total number of bytes that are captured. Once the value is reached the packet capture stops. Up to 1 GB (1,073,741,824 bytes) is captured if not used. |
| `--file-path` | Enter a valid local file path if you want the capture to be saved in the target virtual machine (For example, C:\Capture\myVM_1.cap). If you're using a Linux machine, the path must start with /var/captures. |

The packet capture stops once the time limit or the file size (maximum bytes per session) is reached.

---

## Stop a packet capture

# [**Portal**](#tab/portal)

To manually stop a packet capture session before it reaches its time or file size limits, select the ellipsis **...** on the right-side of the packet capture, or right-click it, then select **Stop**.
 
:::image type="content" source="./media/packet-capture-manage/stop-packet-capture.png" alt-text="Screenshot that shows how to stop a packet capture in the Azure portal." lightbox="./media/packet-capture-manage/stop-packet-capture.png":::

# [**PowerShell**](#tab/powershell)

To manually stop a packet capture session before it reaches its time or file size limits, use the [Stop-AzNetworkWatcherPacketCapture](/powershell/module/az.network/stop-aznetworkwatcherpacketcapture) cmdlet.

```azurepowershell-interactive
# Manually stop a packet capture session.
Stop-AzNetworkWatcherPacketCapture -Location 'eastus' -PacketCaptureName 'myVM_1'
```

> [!NOTE]
> The cmdlet doesn't return a response whether ran on a currently running capture session or a session that has already stopped.

# [**Azure CLI**](#tab/cli)

To manually stop a packet capture session before it reaches its time or file size limits, use the [az network watcher packet-capture stop](/cli/azure/network/watcher/packet-capture#az-network-watcher-packet-capture-stop) command.

```azurecli-interactive
# Manually stop a packet capture session.
az network watcher packet-capture stop --location 'eastus' --name 'myVM_1'
```

> [!NOTE]
> The command doesn't return a response whether ran on a currently running capture session or a session that has already stopped.

---

## View packet capture status

# [**Portal**](#tab/portal)

Go to the **Packet capture** page of Network Watcher to list existing packet captures regardless of their status.

:::image type="content" source="./media/packet-capture-manage/view-packet-capture.png" alt-text="Screenshot that shows how to list and see packet captures in the Azure portal." lightbox="./media/packet-capture-manage/view-packet-capture.png":::

# [**PowerShell**](#tab/powershell)

Use [Get-AzNetworkWatcherPacketCapture](/powershell/module/az.network/get-aznetworkwatcherpacketcapture) cmdlet to retrieve the status of a packet capture (running or completed).

```azurepowershell-interactive
# Get information, properties, and status of a packet capture.
Get-AzNetworkWatcherPacketCapture -Location 'eastus' -PacketCaptureName 'myVM_1'
```

The following output is an example of the output from the `Get-AzNetworkWatcherPacketCapture` cmdlet. The following example is after the capture is complete. The PacketCaptureStatus value is Stopped, with a StopReason of TimeExceeded. This value shows that the packet capture was successful and ran its time.

```output
ProvisioningState Name   Target                                                                                                                              BytesToCapturePerPacket TotalBytesPerSession TimeLimitInSeconds
----------------- ----   ------                                                                                                                              ----------------------- -------------------- ------------------
Succeeded         myVM_1 /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM 0                       1073741824           18000
```

> [!NOTE]
> To get more details in the output, add `| Format-List` to the end of the command.

# [**Azure CLI**](#tab/cli)

Use [az network watcher packet-capture show-status](/cli/azure/network/watcher/packet-capture#az-network-watcher-packet-capture-show-status) command to retrieve the status of a packet capture (running or completed).

```azurecli-interactive
# Get information, properties, and status of a packet capture.
az network watcher packet-capture show-status --location 'eastus' --name 'myVM_1'
```

The following example is the output from the `az network watcher packet-capture show-status` command. You can see that packetCaptureStatus value is **Stopped**, with a StopReason value of **TimeExceeded**:

```output
{
  "additionalProperties": {
    "status": "Succeeded"
  },
  "captureStartTime": "2016-12-06T17:20:01.5671279Z",
  "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/NetworkWatcherRG/providers/Microsoft.Network/networkWatchers/NetworkWatcher_eastus/packetCaptures/myVM_1",
  "name": "packetCaptureName",
  "packetCaptureError": [],
  "packetCaptureStatus": "Stopped",
  "stopReason": "TimeExceeded"
}
```

---

## Download a packet capture

# [**Portal**](#tab/portal)

After concluding your packet capture session, the resulting capture file is saved to Azure storage, a local file on the target virtual machine or both. The storage destination for the packet capture is specified during its creation. For more information, see [Start a packet capture](#start-a-packet-capture) section.

To download a packet capture file saved to Azure storage, follow these steps:

1. In the **Packet capture** page, select the packet capture that you want to download its file.

1. In the **Details** section, select the packet capture file link.

    :::image type="content" source="./media/packet-capture-manage/packet-capture-file.png" alt-text="Screenshot that shows how to select the packet capture file in the Azure portal." lightbox="./media/packet-capture-manage/packet-capture-file.png":::

1. In the blob page, select **Download**.

> [!NOTE]
> You can also download capture files from the storage account container using the Azure portal or Storage Explorer<sup>1</sup> at the following path: 
> ```
> https://{storageAccountName}.blob.core.windows.net/network-watcher-logs/subscriptions/{subscriptionId}/resourcegroups/{storageAccountResourceGroup}/providers/microsoft.compute/virtualmachines/{virtualMachineName}/{year}/{month}/{day}/packetcapture_{UTCcreationTime}.cap
> ```
> <sup>1</sup> Storage Explorer is a standalone app that you can conveniently use to access and work with Azure Storage data. For more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

To download a packet capture file saved to the virtual machine (VM), connect to the VM and download the file from the local path specified during the packet capture creation. 

# [**PowerShell**](#tab/powershell)

After concluding your packet capture session, the resulting capture file is saved to Azure storage, a local file on the target virtual machine or both. The storage destination for the packet capture is specified during its creation. For more information, see [Start a packet capture](#start-a-packet-capture) section.

If a storage account is specified, capture files are saved to the storage account at the following path:

```url
https://{storageAccountName}.blob.core.windows.net/network-watcher-logs/subscriptions/{subscriptionId}/resourcegroups/{storageAccountResourceGroup}/providers/microsoft.compute/virtualmachines/{virtualMachineName}/{year}/{month}/{day}/packetcapture_{UTCcreationTime}.cap
```

To download a packet capture from Azure storage to the local disk, use [Get-AzStorageBlobContent](/powershell/module/az.storage/get-azstorageblobcontent) cmdlet:

```azurepowershell-interactive
# Download the packet capture file from Azure storage container.
Get-AzStorageBlobContent -Container 'network-watcher-logs' -Blob '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/myresourcegroup/providers/microsoft.compute/virtualmachines/myvm/2024/01/25/packetcapture_22_44_54_342.cap' -Destination 'C:\Capture\myVM_1.cap'
```

> [!NOTE]
> You can also download the capture file from the storage account container using the Azure Storage Explorer. Storage Explorer is a standalone app that you can conveniently use to access and work with Azure Storage data. For more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

# [**Azure CLI**](#tab/cli)

After concluding your packet capture session, the resulting capture file is saved to Azure storage, a local file on the target virtual machine or both. The storage destination for the packet capture is specified during its creation. For more information, see [Start a packet capture](#start-a-packet-capture) section.

If a storage account is specified, capture files are saved to the storage account at the following path:

```url
https://{storageAccountName}.blob.core.windows.net/network-watcher-logs/subscriptions/{subscriptionId}/resourcegroups/{storageAccountResourceGroup}/providers/microsoft.compute/virtualmachines/{virtualMachineName}/{year}/{month}/{day}/packetcapture_{UTCcreationTime}.cap
```

To download a packet capture from Azure storage to the local disk, use [az storage blob download](/cli/azure/storage/blob#az-storage-blob-download) command:

```azurecli-interactive
# Download the packet capture file from Azure storage container.
az storage blob download --container-name 'network-watcher-logs' --blob-url '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/myresourcegroup/providers/microsoft.compute/virtualmachines/myvm/2024/01/25/packetcapture_22_44_54_342.cap' --file 'C:\Capture\myVM_1.cap'
```

> [!NOTE]
> You can also download the capture file from the storage account container using the Azure Storage Explorer. Storage Explorer is a standalone app that you can conveniently use to access and work with Azure Storage data. For more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

---

## Delete a packet capture

# [**Portal**](#tab/portal)

1. In the **Packet capture** page, select **...** on the right-side of the packet capture that you want to delete, or right-click it, then select **Delete**.

    :::image type="content" source="./media/packet-capture-manage/delete-packet-capture.png" alt-text="Screenshot that shows how to delete a packet capture from Network Watcher in Azure portal." lightbox="./media/packet-capture-manage/delete-packet-capture.png":::

1. Select **Yes**.

# [**PowerShell**](#tab/powershell)

Use [Remove-AzNetworkWatcherPacketCapture](/powershell/module/az.network/remove-aznetworkwatcherpacketcapture) to delete a packet capture resource.

```azurepowershell-interactive
# Delete a packet capture resource.
Remove-AzNetworkWatcherPacketCapture -Location 'eastus' -PacketCaptureName 'myVM_1'
```
# [**Azure CLI**](#tab/cli)

Use [az network watcher packet-capture delete](/cli/azure/network/watcher/packet-capture#az-network-watcher-packet-capture-delete) to delete a packet capture resource.

```azurecli-interactive
# Delete a packet capture resource.
az network watcher packet-capture delete --location 'eastus' --name 'myVM_1'
```

---

> [!IMPORTANT]
> Deleting the packet capture resource in Network Watcher doesn't delete the capture file from the storage account or the virtual machine. If you don't need the capture file anymore, you must manually delete it from the storage account or virtual machine.

## Related content

- To learn how to automate packet captures with virtual machine alerts, see [Create an alert triggered packet capture](network-watcher-alert-triggered-packet-capture.md).

- To learn how to analyze a Network Watcher packet capture file using Wireshark, see [Inspect and analyze Network Watcher packet capture files](packet-capture-inspect.md).
