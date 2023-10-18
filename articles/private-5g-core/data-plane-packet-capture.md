---
title: Perform packet capture on a packet core instance
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to perform packet capture on the control plane or data plane on a packet core instance. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 10/26/2023
ms.custom: template-how-to
---

# Perform packet capture on a packet core instance

Packet capture for control or data plane packets is performed using the **UPF Trace (UPFT)** tool. UPFT is similar to **tcpdump**, a data-network packet analyzer computer program that runs on a command line interface. You can use this tool to monitor and record packets on any user plane interface on the access network (N3 interface) or data network (N6 interface) on your device, as well as the control plane (N2 interface).

Packet capture works by mirroring packets to a Linux kernel interface, which can then be monitored using tcpdump. In this how-to guide, you'll learn how to perform packet capture on a packet core instance.

> [!IMPORTANT]
> Performing packet capture will reduce the performance of your system and the throughput of your data plane. It is therefore only recommended to use this tool at low scale during initial testing.

## Prerequisites

You must have an AP5GC site deployed to perform packet capture.

To perform packet capture using the command line, you must:

- Identify the **Kubernetes - Azure Arc** resource representing the Azure Arc-enabled Kubernetes cluster on which your packet core instance is running.
- Ensure your local machine has core kubectl access to the Azure Arc-enabled Kubernetes cluster. This requires a core kubeconfig file, which you can obtain by following [Core namespace access](set-up-kubectl-access.md#core-namespace-access).

## Performing packet capture using the Azure portal

## Set up a storage account

[!INCLUDE [](includes/include-diagnostics-storage-account-setup.md)]

### Start a packet capture

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to the **Packet Core Control Pane** overview page of the site you want to gather diagnostics for.
1. Select **Packet Capture** under the **Help** section on the left side. This will open a **Packet Capture** view.
1. Enter the **Container URL** that was configured for diagnostics storage and append the file name that you want to give the packet capture. For example:  
    `https://storageaccountname.blob.core.windows.net/diagscontainername/packetcapturename.zip`  
    > [!TIP]
    > The **Container URL** should have been noted during creation. If it wasn't:
    >
    >    1. Navigate to your **Storage account**.
    >    1. Select the **...** symbol on the right side of the container blob that you want to use for packet capture.
    >    1. Select **Container properties** in the context menu.
    >    1. Copy the contents of the **URL** field in the **Container properties** view.

1. Select **Start packet capture**.
1. Fill in the details on the **Start packet capture** pane and select **Create**.
1. The AP5GC online service will generate a packet capture at the provided storage account URL. Once the portal reports that this has succeeded, you'll be able to download the packet capture.
1. To download the packet capture, see [Download a block blob](/azure/storage/blobs/storage-quickstart-blobs-portal#download-a-block-blob).

## Performing packet capture using the command line

1. In a command line with kubectl access to the Azure Arc-enabled Kubernetes cluster, enter the UPF-PP troubleshooter pod:

    ```azurecli
    kubectl exec -it -n core core-upf-pp-0 -c troubleshooter -- bash
    ```

1. View the list of configured user plane interfaces:

    ```azurecli
    upft list
    ```

    This should report a single interface on the control plane network (N2), a single interface on the access network (N3) and an interface for each attached data network (N6). For example:

    ```azurecli
    n2trace
    n3trace
    n6trace0 (Data Network: internet)
    n6trace1 (Data Network: enterprise)
    n6trace2 (Data Network: test)
    ```

1. Run `upftdump` with any parameters that you would usually pass to tcpdump. In particular, `-i` to specify the interface, and `-w` to specify where to write to. Close the UPFT tool when done by pressing <kbd>Ctrl + C</kbd>. The following examples are common use cases:
    - To run capture packets on all interfaces run `upftdump -i any -w any.pcap`
    - To run capture packets for the N3 interface and the N6 interface for a single data network, enter the UPF-PP troubleshooter pod in two separate windows. In one window run `upftdump -i n3trace -w n3.pcap` and in the other window run `upftdump -i <N6 interface> -w n6.pcap` (use the N6 interface for the data network as identified in step 2).

    > [!IMPORTANT]
    > Packet capture files may be large, particularly when running packet capture on all interfaces. Specify filters when running packet capture to reduce the file size - see the tcpdump documentation for the available filters.
1. Leave the container:

    ```azurecli
    exit
    ```

1. Copy the output files:

    ```azurecli
    kubectl cp -n core core-upf-pp-0:<path to output file> <location to copy to> -c troubleshooter
    ```

    The `tcpdump` may have been stopped in the middle of writing a packet, which can cause this step to produce an error stating `unexpected EOF`. However, your file should have copied successfully, but you can check your target output file to confirm.

1. Remove the output files:

    ```azurecli
        kubectl exec -it -n core core-upf-pp-0 -c troubleshooter -- rm <path to output file>
    ```

## Next steps

For more options to monitor your deployment and view analytics:

- [Learn more about monitoring Azure Private 5G Core using Azure Monitor platform metrics](monitor-private-5g-core-with-platform-metrics.md)
- If you have found identified a problem and don't know how to resolve it, you can [Get support for your Azure Private 5G Core service](open-support-request.md)
