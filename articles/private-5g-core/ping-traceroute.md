---
title: Use ping and traceroute on a packet core instance
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to use the ping and traceroute utilities to check a packet core instance's network connectivity. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 07/31/2023
ms.custom: template-how-to
---

# Use ping and traceroute on a packet core instance

Azure Private 5G Core supports the standard **ping** and **traceroute** diagnostic tools, enhanced with an option to select a specific network interface. You can use ping and traceroute to help diagnose network connectivity problems. In this how-to guide, you'll learn how to use ping and traceroute to check connectivity to the access or data networks over the user plane interfaces on your device.

## Prerequisites

- Identify the **Kubernetes - Azure Arc** resource representing the Azure Arc-enabled Kubernetes cluster on which your packet core instance is running.
- Ensure your local machine has core kubectl access to the Azure Arc-enabled Kubernetes cluster. This requires a core kubeconfig file, which you can obtain by following [Set up kubectl access](commission-cluster.md#set-up-kubectl-access).

## Choose the IP address to test

You can use the ping and traceroute tools to check the reachability of any IP address over the specified interface. A common example is the default gateway. If you don't know the default gateway address for the interface you want to test, you can find it on the **Advanced Networking** blade on the Azure Stack Edge (ASE) local UI.

To access the local UI, see [Tutorial: Connect to Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-connect.md).

## Run the ping and traceroute tools

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

1. Run the ping command, specifying the network and IP address to test. You can specify `access` for the access network or the network name for a data network.

    ```azurecli
    ping --net <network name> <IP address>
    ```

    For example:

    ```azurecli
    ping --net enterprise 10.0.0.1
    ```

    The tool should report a list of packets transmitted and received with 0% packet loss.

1. Run the traceroute command, specifying the network and IP address to test. You can specify `access` for the access network or the network name for a data network.

    ```azurecli
    traceroute --net <network name> <IP address>
    ```

    For example:

    ```azurecli
    traceroute --net enterprise 10.0.0.1
    ```

    The tool should report a series of hops, with the specified IP address as the final hop.

## Next steps

- For more detailed diagnostics, you can [Perform data plane packet capture on a packet core instance](data-plane-packet-capture.md)
- If you have found identified a connectivity issue and don't know how to resolve it, you can [Get support for your Azure Private 5G Core service](open-support-request.md)
