---
title: Perform data plane packet capture for a packet core instance
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to perform data plane packet capture for a packet core instance. 
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: conceptual
ms.date: 12/13/2022
ms.custom: template-how-to
---

# Perform data plane packet capture for a packet core instance

Packet capture for data plane packets is performed using the **UPF Trace (UPFT)** tool. UPFT is similar to **tcpdump**, a data-network packet analyzer computer program that runs on a command line interface. You can use this tool to monitor and record packets on any user plane interface on the access network (N3 interface) or data network (N6 interface) on your device.

Data plane packet capture works by mirroring packets to a Linux kernel interface, which can then be monitored using tcpdump. In this how-to guide, you'll learn how to perform data plane packet capture for a packet core instance.

> [!IMPORTANT]
> Performing packet capture will reduce the performance of your system and the throughput of your data plane. It is therefore only recommended to use this tool at low scale during initial testing.

## Prerequisites

- Identify the **Kubernetes - Azure Arc** resource representing the Azure Arc-enabled Kubernetes cluster on which your packet core instance is running.
- Ensure you have [Contributor](../role-based-access-control/built-in-roles.md#contributor) role assignment on the Azure subscription containing the **Kubernetes - Azure Arc** resource.
- Ensure your local machine has core kubectl access to the Azure Arc-enabled Kubernetes cluster. This requires a core kubeconfig file, which you can obtain by following [Set up kubectl access](commission-cluster.md#set-up-kubectl-access).

## Performing packet capture

1. In a command line with kubectl access to the Azure Arc-enabled Kubernetes cluster, enter the UPF-PP troubleshooter pod:

    `kubectl exec -it -n core core-upf-pp-0 -c troubleshooter -- bash`

1. View the list of interfaces that can be monitored:

    `upft list`

1. Run `upftdump` with any parameters that you would usually pass to tcpdump. In particular, `-i` to specify the interface, and `-w` to specify where to write to. Close the UPFT tool when done by pressing <kbd>Ctrl + C</kbd>. The following examples are common use cases:
    - To run capture packets on all interfaces run `upftdump -i any -w any.pcap`
    - To run capture packets for the N3 interface and the N6 interface for a single data network, enter the UPF-PP troubleshooter pod in two separate windows. In one window run `upftdump -i n3trace -w n3.pcap` and in the other window run `upftdump -i <N6 interface> -w n6.pcap` (use the N6 interface for the data network as identified in step 2).

    > [!IMPORTANT]
    > Packet capture files may be large, particularly when running packet capture on all interfaces. Specify filters when running packet capture to reduce the file size - see the tcpdump documentation for the available filters.
1. Leave the container:

    `exit`

1. Copy the output files:

    `kubectl cp -n core core-upf-pp-0: <path to output file> <location to copy to> -c troubleshooter`

    The `tcpdump` may have been stopped in the middle of writing a packet, which can cause this step to produce an error stating `unexpected EOF`. However, your file should have copied successfully, but you can check your target output file to confirm.

1. Remove the output files:

    `kubectl exec -it -n core core-upf-pp-0 -c troubleshooter -- rm <path to output file>`

## Next steps

For more options to monitor your deployment and view analytics:

- [Learn more about monitoring Azure Private 5G Core using Azure Monitor platform metrics](monitor-private-5g-core-with-platform-metrics.md)
