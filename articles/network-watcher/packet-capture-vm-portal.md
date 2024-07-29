---
title: Manage packet captures for VMs - Azure portal
titleSuffix: Azure Network Watcher
description: Learn how to start, stop, download, and delete Azure virtual machines packet captures with the packet capture feature of Network Watcher using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 02/07/2024
#CustomerIntent: As an administrator, I want to capture IP packets to and from a virtual machine (VM) so I can review and analyze the data to help diagnose and solve network problems.
---

# Manage packet captures for virtual machines with Azure Network Watcher using the Azure portal

The Network Watcher packet capture tool allows you to create capture sessions to record network traffic to and from an Azure virtual machine (VM). Filters are provided for the capture session to ensure you capture only the traffic you want. Packet capture helps in diagnosing network anomalies both reactively and proactively. Its applications extend beyond anomaly detection to include gathering network statistics, acquiring insights into network intrusions, debugging client-server communication, and addressing various other networking challenges. Network Watcher packet capture enables you to initiate packet captures remotely, alleviating the need for manual execution on a specific virtual machine.

In this article, you learn how to remotely configure, start, stop, download, and delete a virtual machine packet capture using the Azure portal. To learn how to manage packet captures using PowerShell or Azure CLI, see [Manage packet captures for virtual machines using PowerShell](packet-capture-vm-powershell.md) or [Manage packet captures for virtual machines using the Azure CLI](packet-capture-vm-cli.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A virtual machine with the following outbound TCP connectivity:
    - to the storage account over port 443
    - to 169.254.169.254 over port 80
    - to 168.63.129.16 over port 8037

> [!NOTE]
> - Azure creates a Network Watcher instance in the the virtual machine's region if Network Watcher wasn't enabled for that region. For more information, see [Enable or disable Azure Network Watcher](network-watcher-create.md).
> - Network Watcher packet capture requires Network Watcher agent VM extension to be installed on the target virtual machine. Whenever you use Network Watcher packet capture in the Azure portal, the agent is automatically installed on the target VM or scale set if it wasn't previously installed. To update an already installed agent, see [Update Azure Network Watcher extension to the latest version](../virtual-machines/extensions/network-watcher-update.md?toc=/azure/network-watcher/toc.json). To manually install the agent, see [Network Watcher Agent virtual machine extension for Linux](../virtual-machines/extensions/network-watcher-linux.md) or [Network Watcher Agent virtual machine extension for Windows](../virtual-machines/extensions/network-watcher-windows.md).
> - The last two IP addresses and ports listed in the **Prerequisites** are common across all Network Watcher tools that use the Network Watcher agent and might occasionally change.

If a network security group is associated to the network interface, or subnet that the network interface is in, ensure that rules exist to allow outbound connectivity over the previous ports. Similarly, ensure outbound connectivity over the previous ports when adding user-defined routes to your network.

## Start a packet capture

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *Network Watcher*. Select **Network Watcher** from the search results.

    :::image type="content" source="./media/packet-capture-vm-portal/portal-search.png" alt-text="Screenshot shows how to search for Network Watcher in the Azure portal." lightbox="./media/packet-capture-vm-portal/portal-search.png":::

1. Select **Packet capture** under **Network diagnostic tools**. Any existing packet captures are listed, regardless of their status.

    :::image type="content" source="./media/packet-capture-vm-portal/packet-capture.png" alt-text="Screenshot shows Network Watcher packet capture in the Azure portal." lightbox="./media/packet-capture-vm-portal/packet-capture.png":::

1. Select **+ Add** to create a packet capture. In **Add packet capture**, enter or select values for the following settings:

    | Setting | Value |
    | --- | --- |
    | **Basic Details** |  |
    | Subscription | Select the Azure subscription of the virtual machine. |
    | Resource group | Select the resource group of the virtual machine. |
    | Target type | Select **Virtual machine**. |
    | Target instance | Select the virtual machine. |
    | Packet capture name | Enter a name or leave the default name. |
    | **Packet capture configuration** |  |
    | Capture location | Select **Storage account**, **File**, or **Both**. |
    | Storage account | Select your **Standard** storage account<sup>1</sup>. <br> This option is available if you selected **Storage account** or **Both** as a capture location. |
    | Local file path | Enter a valid local file path where you want the capture to be saved in the target virtual machine. If you're using a Linux machine, the path must start with */var/captures*. <br> This option is available if you selected **File** or **Both** as a capture location. |
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

    :::image type="content" source="./media/packet-capture-vm-portal/add-packet-capture.png" alt-text="Screenshot of Add packet capture in the Azure portal showing available options.":::

1. Once the time limit set on the packet capture is reached, the packet capture stops and can be reviewed. To manually stop a packet capture session before it reaches its time limit, select the **...** on the right-side of the packet capture, or right-click it, then select **Stop**.
 
    :::image type="content" source="./media/packet-capture-vm-portal/stop-packet-capture.png" alt-text="Screenshot that shows how to stop a packet capture in the Azure portal." lightbox="./media/packet-capture-vm-portal/stop-packet-capture.png":::

## Download a packet capture

After concluding your packet capture session, the resulting capture file is saved to Azure storage, a local file on the target virtual machine or both. The storage destination for the packet capture is specified during its creation. For more information, see [Start a packet capture](#start-a-packet-capture).

To download a packet capture file saved to Azure storage, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *Network Watcher*, then select **Network Watcher** from the search results.

1. Select **Packet capture** under **Network diagnostic tools**.

1. In the **Packet capture** page, select the packet capture that you want to download its file.

1. In the **Details** section, select the packet capture file link.

    :::image type="content" source="./media/packet-capture-vm-portal/packet-capture-file.png" alt-text="Screenshot that shows how to select the packet capture file in the Azure portal." lightbox="./media/packet-capture-vm-portal/packet-capture-file.png":::

1. In the blob page, select **Download**.

> [!NOTE]
> You can also download capture files from the storage account container using the Azure portal or Storage Explorer<sup>1</sup> at the following path: 
> ```
> https://{storageAccountName}.blob.core.windows.net/network-watcher-logs/subscriptions/{subscriptionId}/resourcegroups/{storageAccountResourceGroup}/providers/microsoft.compute/virtualmachines/{virtualMachineName}/{year}/{month}/{day}/packetcapture_{UTCcreationTime}.cap
> ```
> <sup>1</sup> Storage Explorer is a standalone app that you can conveniently use to access and work with Azure Storage data. For more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

To download a packet capture file saved to the virtual machine (VM), connect to the VM and download the file from the local path specified during the packet capture creation. 

## Delete a packet capture

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *Network Watcher*, then select **Network Watcher** from the search results.

1. Select **Packet capture** under **Network diagnostic tools**.

1. In the **Packet capture** page, select **...** on the right-side of the packet capture that you want to delete, or right-click it, then select **Delete**.

    :::image type="content" source="./media/packet-capture-vm-portal/delete-packet-capture.png" alt-text="Screenshot that shows how to delete a packet capture from Network Watcher in Azure portal." lightbox="./media/packet-capture-vm-portal/delete-packet-capture.png":::

1. Select **Yes**.

> [!IMPORTANT]
> Deleting a packet capture in Network Watcher doesn't delete the capture file from the storage account or the virtual machine. If you don't need the capture file anymore, you must manually delete it from the storage account to avoid incurring storage costs.

## Related content

- To learn how to automate packet captures with virtual machine alerts, see [Create an alert triggered packet capture](network-watcher-alert-triggered-packet-capture.md).
- To learn how to analyze a Network Watcher packet capture file using Wireshark, see [Inspect and analyze Network Watcher packet capture files](packet-capture-inspect.md).
