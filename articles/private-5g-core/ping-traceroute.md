---
title: Use ping and traceroute on a packet core instance
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to use the ping and traceroute utilities to inspect a packet core instance. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 07/31/2023
ms.custom: template-how-to
---

# Use ping and traceroute on a packet core instance

Azure Private 5G Core supports the standard **ping** and **traceroute** diagnostic tools. You can use ping and traceroute to help diagnose network connectivity problems. In this how-to guide, you'll learn how to use ping and traceroute to check connectivity on a data network (N6 interface) on your device.

## Prerequisites

- Identify the **Kubernetes - Azure Arc** resource representing the Azure Arc-enabled Kubernetes cluster on which your packet core instance is running.
- Ensure you have [Contributor](../role-based-access-control/built-in-roles.md#contributor) role assignment on the Azure subscription containing the **Kubernetes - Azure Arc** resource.
- Ensure your local machine has core kubectl access to the Azure Arc-enabled Kubernetes cluster. This requires a core kubeconfig file, which you can obtain by following [Set up kubectl access](commission-cluster.md#set-up-kubectl-access).

## Find the default gateway address

If you don't know the default gateway for the data network you want to test, you can find it on the **Advanced Networking** blade on the Azure Stack Edge (ASE) local UI.

To access the local UI, see [Tutorial: Connect to Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-connect.md).

## Run the ping and traceroute tools

1. In a command line with kubectl access to the Azure Arc-enabled Kubernetes cluster, enter the UPF-PP troubleshooter pod:

    ```azurecli
    kubectl exec -it -n core core-upf-pp-0 -c troubleshooter -- bash
    ```

1. Run the ping command, specifying the data network name and default gateway IP address.

    ```ping --net <DN name> <IP address>```

    For example:

    ```ping --net network-1  10.0.0.1```

    The tool should report a list of packets transmitted and received with 0% packet loss.

1. Run the traceroute command, specifying the data network name and default gateway IP address.

    ```traceroute --net <DN name> <IP address>```

    For example:

    ```traceroute --net network-1  10.0.0.1```

    The tool should report a series of hops across different endpoints, with the default gateway IP address as the final hop.

## Next steps

- For more detailed diagnostics, you can [Perform data plane packet capture on a packet core instance](data-plane-packet-capture.md)
- If you have found identified a connectivity issue and don't know how to resolve it, you can [Get support for your Azure Private 5G Core service](open-support-request.md)
