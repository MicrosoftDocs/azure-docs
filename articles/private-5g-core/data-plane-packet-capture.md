---
title: Perform packet capture on a packet core instance
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to perform packet capture on the control plane or data plane on a packet core instance. 
author: anzaman
ms.author: alzam
ms.service: azure-private-5g-core
ms.topic: how-to
ms.date: 04/24/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Perform packet capture on a packet core instance

Packet capture for control or data plane packets is performed using the **MEC-Dataplane Trace** tool. MEC-Dataplane (MEC-DP) Trace is similar to **tcpdump**, a data-network packet analyzer computer program that runs on a command line interface (CLI). You can use MEC-DP Trace to monitor and record packets on any user plane interface on the access network (N3 interface) or data network (N6 interface) on your device, and the control plane (N2 interface). You can access MEC-DP Trace using the Azure portal or the Azure CLI.

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

>[!IMPORTANT]
> Once you have created the user-assigned managed identity, you must refresh the packet core configuration by making a dummy configuration change. This could be a change that will have no impact on your deployment and can be left in place, or a change that you immediately revert. See [Modify a packet core instance](modify-packet-core.md). If you do not refresh the packet core configuration, packet capture will fail.

### Start a packet capture

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to the **Packet Core Control Pane** overview page of the site you want to run a packet capture in.
1. Select **Packet Capture** under the **Help** section on the left side. This will open a **Packet Capture** view.
1. If this is the first time you've taken a packet capture using the portal, you'll see an error message prompting you to configure a storage account. If so:
    1. Follow the link in the error message.
    1. Enter the **Storage account container URL** that was configured for diagnostics storage and select **Modify**.
        > [!TIP]
        > If you don't have the URL for your storage account container:
        >
        >    1. Navigate to your **Storage account**.
        >    1. Select the **...** symbol on the right side of the container that you want to use for packet capture.
        >    1. Select **Container properties** in the context menu.
        >    1. Copy the contents of the **URL** field.
    1. Return to the **Packet Capture** view.
1. Select **Start packet capture**.
1. Fill in the details on the **Start packet capture** pane and select **Create**.

    The **Maximum bytes per session** limit is applied per node. In highly available (HA) deployments, it's likely that the packet capture will reach this limit and complete on one node before the other, so a packet capture will still be running when the first has completed. You should stop any running packet captures before starting a new one.

1. The page will refresh every few seconds until the packet capture has completed. You can also use the **Refresh** button to refresh the page. If you want to stop the packet capture early, select **Stop packet capture**.

1. Once the packet capture has completed, the AP5GC online service will save the output at the provided storage account URL.

    In HA deployments, two packet capture files will be uploaded, one for each node. The files will be labeled with a `0` or a `1`, corresponding to the `core-mec-dp-0` or `core-mec-dp-1` pod. If one packet capture fails, the status page will show an error, but the successful capture results will upload as normal.

1. To download the packet capture output, you can use the **Copy to clipboard** button in the **Storage** or **File name** columns to copy those details and then paste them into the **Search** box in the portal. To download the output, right-click the file and select **Download**.

## Performing packet capture using the Azure CLI

1. In a command line with kubectl access to the Azure Arc-enabled Kubernetes cluster, enter the MEC-DP troubleshooter pod:

    ```azurecli
    kubectl exec -it -n core core-mec-dp-0 -c troubleshooter -- bash
    ```

    > [!NOTE]
    > In an HA deployment, `core-mec-dp-0` may not exist because the node is down. In that case, enter `core-mec-dp-1` instead.

1. View the list of configured user plane interfaces:

    ```azurecli
    mect list
    ```

    This should report a single interface on the control plane network (N2), a single interface on the access network (N3) and a single interface for the core network (N6).

    ```azurecli
    n2trace
    n3trace
    n6trace
    ```
1. Run `mectdump` with any parameters that you would usually pass to tcpdump. In particular, `-i` to specify the interface, and `-w` to specify where to write to. Close the tool when finished by pressing <kbd>Ctrl + C</kbd>. The following examples are common use cases:
    - To capture packets on all interfaces, run `mectdump -i any -w any.pcap`
    - To capture packets for the N3 interface and the N6 interface for a single data network, enter the MEC-DP troubleshooter pod in two separate windows. In one window run `mectdump -i n3trace -w n3.pcap` and in the other window run `mectdump -i n6trace -w n6.pcap`. To select an individual data network, filter by VLAN ID.


    > [!IMPORTANT]
    > Packet capture files might be large, particularly when running packet capture on all interfaces. Specify filters when running packet capture to reduce the file size - see the tcpdump documentation for the available filters.

1. Leave the container:

    ```azurecli
    exit
    ```

1. Copy the output files:

    ```azurecli
    kubectl cp -n core core-mec-dp-0:<path to output file> <location to copy to> -c troubleshooter
    ```

    The tcpdump might have been stopped in the middle of writing a packet, which can cause this step to produce an error stating `unexpected EOF`. However, your file should have copied successfully, and you can check your target output file to confirm.

1. Remove the output files:

    ```azurecli
        kubectl exec -it -n core core-mec-dp-0 -c troubleshooter -- rm <path to output file>
    ```

## Next steps

For more options to monitor your deployment and view analytics:

- [Learn more about monitoring Azure Private 5G Core using Azure Monitor platform metrics](monitor-private-5g-core-with-platform-metrics.md)
- If you have found a problem and don't know how to resolve it, you can [Get support for your Azure Private 5G Core service](open-support-request.md)
