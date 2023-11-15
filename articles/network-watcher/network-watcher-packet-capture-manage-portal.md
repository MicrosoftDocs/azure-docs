---
title: Manage packet captures in VMs with Azure Network Watcher - Azure portal
description: Learn how to manage packet captures in virtual machines with the packet capture feature of Network Watcher using the Azure portal.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 01/04/2023
ms.author: halkazwini
ms.custom: template-how-to, engagement-fy23
---

# Manage packet captures in virtual machines with Azure Network Watcher using the Azure portal

> [!div class="op_single_selector"]
> - [Azure portal](network-watcher-packet-capture-manage-portal.md)
> - [PowerShell](network-watcher-packet-capture-manage-powershell.md)
> - [Azure CLI](network-watcher-packet-capture-manage-cli.md)

Network Watcher packet capture allows you to create capture sessions to track traffic to and from a virtual machine. Filters are provided for the capture session to ensure you capture only the traffic you want. Packet capture helps to diagnose network anomalies, both reactively, and proactively. Other uses include gathering network statistics, gaining information on network intrusions, to debug client-server communication, and much more. Being able to remotely trigger packet captures, eases the burden of running a packet capture manually on a desired virtual machine, which saves valuable time.

In this article, you learn to start, stop, download, and delete a packet capture. 

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A virtual machine with the following outbound TCP connectivity:
    - to the chosen storage account over port 443
    - to 169.254.169.254 over port 80
    - to 168.63.129.16 over port 8037

> [!NOTE]
> The ports mentioned in the latter two cases are common across all Network Watcher features that involve the Network Watcher extension and might occasionally change.

If a network security group is associated to the network interface, or subnet that the network interface is in, ensure that rules exist to allow outbound connectivity over the previous ports. Similarly, ensure outbound connectivity over the previous ports when adding user-defined routes to your network.

## Start a packet capture

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box at the top of the portal, enter *Network Watcher*.
1. In the search results, select **Network Watcher**.
1. Select **Packet capture** under **Network diagnostic tools**. Any existing packet captures are listed, regardless of their status.
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
   | Storage account | Select your **Standard** storage account. <br> This option is available if you selected **Storage account** or **Both**. |
   | Local file path | Enter a valid local file path where you want the capture to be saved in the target virtual machine. If you're using a Linux machine, the path must start with */var/captures*. <br> This option is available if you selected **File** or **Both**. |
   | Maximum bytes per packet | Enter the maximum number of bytes to be captured per each packet. All bytes are captured if left blank or 0 entered. |
   | Maximum bytes per session | Enter the total number of bytes that are captured. Once the value is reached the packet capture stops. Up to 1 GB is captured if left blank. |
   | Time limit (seconds) | Enter the time limit of the packet capture session in seconds. Once the value is reached the packet capture stops. Up to 5 hours (18,000 seconds) is captured if left blank. |
   | **Filtering (optional)** |  |   
   | Add filter criteria | Select **Add filter criteria** to add a new filter. |
   | Protocol | Filters the packet capture based on the selected protocol. Available values are **TCP**, **UDP**, or **Any**. |   
   | Local IP address | Filters the packet capture for packets where the local IP address matches this value. |
   | Local port | Filters the packet capture for packets where the local port matches this value. |
   | Remote IP address | Filters the packet capture for packets where the remote IP address matches this value. |
   | Remote port | Filters the packet capture for packets where the remote port matches this value. |

     > [!NOTE]
     > Premium storage accounts are currently not supported for storing packet captures.

     > [!NOTE]
     > Port and IP address values can be a single value, multiple values, or a range, such as 80-1024, for port. You can define as many filters as you need.

1. Select **Start packet capture**.

    :::image type="content" source="./media/network-watcher-packet-capture-manage-portal/add-packet-capture.png" alt-text="Screenshot of Add packet capture in Azure portal showing available options.":::

1. Once the time limit set on the packet capture is reached, the packet capture stops and can be reviewed. To manually stop a packet capture session before it reaches its time limit, select the **...** on the right-side of the packet capture in **Packet capture** page, or right-click it, then select **Stop**.
 
    :::image type="content" source="./media/network-watcher-packet-capture-manage-portal/stop-packet-capture.png" alt-text="Screenshot showing how to stop a packet capture in Azure portal.":::

> [!NOTE]
> The Azure portal automatically:
>  * Creates a network watcher in the same region as the region of the target virtual machine, if the region doesn't already have a network watcher.
>  * Adds `AzureNetworkWatcherExtension` to [Linux](../virtual-machines/extensions/network-watcher-linux.md) or [Windows](../virtual-machines/extensions/network-watcher-windows.md) virtual machines, if the extension isn't already installed.

## Delete a packet capture

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box at the top of the portal, enter *Network Watcher*, then select **Network Watcher** from the search results.
1. Select **Packet capture** under **Network diagnostic tools**.
1. In the **Packet capture** page, select **...** on the right-side of the packet capture that you want to delete, or right-click it, then select **Delete**.

    :::image type="content" source="./media/network-watcher-packet-capture-manage-portal/delete-packet-capture.png" alt-text="Screenshot showing how to delete a packet capture from Network Watcher in Azure portal.":::

1. Select **Yes**.

> [!NOTE]
> Deleting a packet capture does not delete the capture file in the storage account or on the virtual machine.

## Download a packet capture

Once your packet capture session has completed, the capture file is saved to a blob storage or a local file on the target virtual machine. The storage location of the packet capture is defined during creation of the packet capture. A convenient tool to access capture files saved to a storage account is Azure Storage Explorer, which you can [download](https://storageexplorer.com/) after selecting the operating system.

- If a storage account is specified, packet capture files are saved to a storage account at the following location:

    ```
    https://{storageAccountName}.blob.core.windows.net/network-watcher-logs/subscriptions/{subscriptionId}/resourcegroups/{storageAccountResourceGroup}/providers/microsoft.compute/virtualmachines/{VMName}/{year}/{month}/{day}/packetCapture_{creationTime}.cap
    ```

- If a file path is specified, the capture file can be viewed on the virtual machine or downloaded.

## Next steps

- To learn how to automate packet captures with virtual machine alerts, see [Create an alert triggered packet capture](network-watcher-alert-triggered-packet-capture.md).
- To determine whether specific traffic is allowed in or out of a virtual machine, see [Diagnose a virtual machine network traffic filter problem](diagnose-vm-network-traffic-filtering-problem.md).