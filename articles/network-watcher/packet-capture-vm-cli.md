---
title: Manage packet captures for VMs - Azure CLI
titleSuffix: Azure Network Watcher
description: Learn how to start, stop, download, and delete Azure virtual machines packet captures with the packet capture feature of Network Watcher using the Azure CLI.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 01/31/2024
ms.custom: devx-track-azurecli
#CustomerIntent: As an administrator, I want to capture IP packets to and from a virtual machine (VM) so I can review and analyze the data to help diagnose and solve network problems.
---

# Manage packet captures for virtual machines with Azure Network Watcher using the Azure CLI

The Network Watcher packet capture tool allows you to create capture sessions to record network traffic to and from an Azure virtual machine (VM). Filters are provided for the capture session to ensure you capture only the traffic you want. Packet capture helps in diagnosing network anomalies both reactively and proactively. Its applications extend beyond anomaly detection to include gathering network statistics, acquiring insights into network intrusions, debugging client-server communication, and addressing various other networking challenges. Network Watcher packet capture enables you to initiate packet captures remotely, alleviating the need for manual execution on a specific virtual machine.

In this article, you learn how to remotely configure, start, stop, download, and delete a virtual machine packet capture using Azure PowerShell. To learn how to manage packet captures using the Azure portal or Azure CLI, see [Manage packet captures for virtual machines using the Azure portal](packet-capture-vm-portal.md) or [Manage packet captures for virtual machines using PowerShell](packet-capture-vm-powershell.md).


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

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

### Step 1

Run the `az vm extension set` command to install the packet capture agent on the guest virtual machine.

For Windows virtual machines:

```azurecli-interactive
az vm extension set --resource-group resourceGroupName --vm-name virtualMachineName --publisher Microsoft.Azure.NetworkWatcher --name NetworkWatcherAgentWindows --version 1.4
```

For Linux virtual machines:

```azurecli-interactive
az vm extension set --resource-group resourceGroupName --vm-name virtualMachineName --publisher Microsoft.Azure.NetworkWatcher --name NetworkWatcherAgentLinux --version 1.4
```

### Step 2

To ensure that the agent is installed, run the `vm extension show` command and pass it the resource group and virtual machine name. Check the resulting list to ensure the agent is installed.

For Windows virtual machines:

```azurecli-interactive
az vm extension show --resource-group resourceGroupName --vm-name virtualMachineName --name NetworkWatcherAgentWindows
```

For Linux virtual machines:

```azurecli-interactive
az vm extension show --resource-group resourceGroupName --vm-name virtualMachineName --name AzureNetworkWatcherExtension
```

The following sample is an example of the response from running `az vm extension show`

```json
{
  "autoUpgradeMinorVersion": true,
  "forceUpdateTag": null,
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}/extensions/NetworkWatcherAgentWindows",
  "instanceView": null,
  "location": "westcentralus",
  "name": "NetworkWatcherAgentWindows",
  "protectedSettings": null,
  "provisioningState": "Succeeded",
  "publisher": "Microsoft.Azure.NetworkWatcher",
  "resourceGroup": "{resourceGroupName}",
  "settings": null,
  "tags": null,
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "typeHandlerVersion": "1.4",
  "virtualMachineExtensionType": "NetworkWatcherAgentWindows"
}
```

## Start a packet capture

Once the preceding steps are complete, the packet capture agent is installed on the virtual machine.

### Step 1

Retrieve a storage account. This storage account is used to store the packet capture file.

```azurecli-interactive
az storage account list
```

### Step 2

At this point, you are ready to create a packet capture.  First, let's examine the parameters you may want to configure. Filters are one such parameter that can be used to limit the data that is stored by the packet capture. The following example sets up a packet capture with several  filters.  The first three filters collect outgoing TCP traffic only from local IP 10.0.0.3 to destination ports 20, 80 and 443.  The last filter collects only UDP traffic.

```azurecli-interactive
az network watcher packet-capture create --resource-group {resourceGroupName} --vm {vmName} --name packetCaptureName --storage-account {storageAccountName} --filters "[{\"protocol\":\"TCP\", \"remoteIPAddress\":\"1.1.1.1-255.255.255.255\",\"localIPAddress\":\"10.0.0.3\", \"remotePort\":\"20\"},{\"protocol\":\"TCP\", \"remoteIPAddress\":\"1.1.1.1-255.255.255.255\",\"localIPAddress\":\"10.0.0.3\", \"remotePort\":\"80\"},{\"protocol\":\"TCP\", \"remoteIPAddress\":\"1.1.1.1-255.255.255.255\",\"localIPAddress\":\"10.0.0.3\", \"remotePort\":\"443\"},{\"protocol\":\"UDP\"}]"
```

The following example is the expected output from running the `az network watcher packet-capture create` command.

```json
{
  "bytesToCapturePerPacket": 0,
  "etag": "W/\"b8cf3528-2e14-45cb-a7f3-5712ffb687ac\"",
  "filters": [
    {
      "localIpAddress": "10.0.0.3",
      "localPort": "",
      "protocol": "TCP",
      "remoteIpAddress": "1.1.1.1-255.255.255.255",
      "remotePort": "20"
    },
    {
      "localIpAddress": "10.0.0.3",
      "localPort": "",
      "protocol": "TCP",
      "remoteIpAddress": "1.1.1.1-255.255.255.255",
      "remotePort": "80"
    },
    {
      "localIpAddress": "10.0.0.3",
      "localPort": "",
      "protocol": "TCP",
      "remoteIpAddress": "1.1.1.1-255.255.255.255",
      "remotePort": "443"
    },
    {
      "localIpAddress": "",
      "localPort": "",
      "protocol": "UDP",
      "remoteIpAddress": "",
      "remotePort": ""
    }
  ],
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/NetworkWatcherRG/providers/Microsoft.Network/networkWatchers/NetworkWatcher_westcentralus/pa
cketCaptures/packetCaptureName",
  "name": "packetCaptureName",
  "provisioningState": "Succeeded",
  "resourceGroup": "NetworkWatcherRG",
  "storageLocation": {
    "filePath": null,
    "storageId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/gwteststorage123abc",
    "storagePath": "https://gwteststorage123abc.blob.core.windows.net/network-watcher-logs/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/{resourceGroupName}/p
roviders/microsoft.compute/virtualmachines/{vmName}/2017/05/25/packetcapture_16_22_34_630.cap"
  },
  "target": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}",
  "timeLimitInSeconds": 18000,
  "totalBytesPerSession": 1073741824
}
```

## Get a packet capture

Running the `az network watcher packet-capture show-status` command, retrieves the status of a currently running, or completed packet capture.

```azurecli-interactive
az network watcher packet-capture show-status --name packetCaptureName --location {networkWatcherLocation}
```

The following example is the output from the `az network watcher packet-capture show-status` command. The following example is when the capture is Stopped, with a StopReason of TimeExceeded.

```
{
  "additionalProperties": {
    "status": "Succeeded"
  },
  "captureStartTime": "2016-12-06T17:20:01.5671279Z",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/NetworkWatcherRG/providers/Microsoft.Network/networkWatchers/NetworkWatcher_westcentralus/packetCaptures/packetCaptureName",
  "name": "packetCaptureName",
  "packetCaptureError": [],
  "packetCaptureStatus": "Stopped",
  "stopReason": "TimeExceeded"
}
```

## Stop a packet capture

By running the `az network watcher packet-capture stop` command, if a capture session is in progress it is stopped.

```azurecli-interactive
az network watcher packet-capture stop --name packetCaptureName --location westcentralus
```

> [!NOTE]
> The command returns no response when ran on a currently running capture session or an existing session that has already stopped.

## Delete a packet capture

```azurecli-interactive
az network watcher packet-capture delete --name packetCaptureName --location westcentralus
```

> [!NOTE]
> Deleting a packet capture does not delete the file in the storage account.

## Download a packet capture

Once your packet capture session has completed, the capture file can be uploaded to blob storage or to a local file on the VM. The storage location of the packet capture is defined at creation of the session. A convenient tool to access these capture files saved to a storage account is Microsoft Azure Storage Explorer, which can be downloaded here:  https://storageexplorer.com/

If a storage account is specified, packet capture files are saved to a storage account at the following location:

```
https://{storageAccountName}.blob.core.windows.net/network-watcher-logs/subscriptions/{subscriptionId}/resourcegroups/{storageAccountResourceGroup}/providers/microsoft.compute/virtualmachines/{VMName}/{year}/{month}/{day}/packetCapture_{creationTime}.cap
```

## Related content

- To learn how to automate packet captures with virtual machine alerts, see [Create an alert triggered packet capture](network-watcher-alert-triggered-packet-capture.md).
- To determine whether specific traffic is allowed in or out of a virtual machine, see [Diagnose a virtual machine network traffic filter problem](diagnose-vm-network-traffic-filtering-problem.md).
