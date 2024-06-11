---
title: Diagnose and solve UDP packet drops in Azure Kubernetes Service (AKS)
description: Learn how to diagnose and solve UDP packet drops in Azure Kubernetes Service (AKS).
ms.topic: how-to
ms.date: 05/09/2024
author: schaffererin
ms.author: schaffererin
ms.service: azure-kubernetes-service
---

# Diagnose and solve UDP packet drops in Azure Kubernetes Service (AKS)

This article describes how to diagnose and solve UDP packet drops in Azure Kubernetes Service (AKS). It walks you through UDP packet drop issues caused by a small read buffer, which could lead to overflow in cases of high network traffic.

UDP, or *User Datagram Protocol*, is a connectionless protocol used within managed AKS clusters. UDP packets don't establish a connection before data transfer, so they're sent without any guarantee of delivery, reliability, or order. This means that UDP packets can be lost, duplicated, or arrive out of order at the destination due to various reasons.

## Prerequisites

* An AKS cluster with at least one node pool and one pod running a UDP-based application.
* Azure CLI installed and configured. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).
* Kubectl installed and configured to connect to your AKS cluster. For more information, see [Install kubectl](/cli/azure/install-azure-cli).
* A client machine that can send and receive UDP packets to and from your AKS cluster.

## Issue: UDP connections have a high packet drop rate

One possible cause of UDP packet loss is that the UDP buffer size is too small to handle the incoming traffic. The UDP buffer size determines how much data can be stored in the kernel before the application processes it. If the buffer size is insufficient, the kernel might drop packets that exceed the buffer capacity. This setting is managed at the virtual machine (VM) level for your nodes. The default value is *212992 bytes* or *0.2 MB*.

There are two different variables at the VM level that apply to the UDP buffer size:

* `net.core.rmem_max = 212992 bytes`: The maximum possible buffer size for incoming traffic on a per-socket basis.
* `net.core.rmem_default = 212992 bytes`: The default buffer size for incoming traffic on a per-socket basis.

To allow the buffer to grow to serve more traffic, you need to update the maximum values for read buffer sizes based on your application's requirements.

> [!IMPORTANT]
> This article focuses on Ubuntu Linux kernel buffer sizes. If you want to see other configurations for Linux and Windows, see [Customize node configuration for AKS node pools](./custom-node-configuration.md).

## Diagnose the issue

### Check current UDP buffer settings

1. Get a list of your nodes using the `kubectl get nodes` command and pick a node you want to check the buffer settings for.

    ```bash
    kubectl get nodes
    ```

2. Set up a debug pod on the node you selected using the `kubectl debug` command. Replace `<node-name>` with the name of the node you want to debug.

    ```bash
    kubectl debug <node-name> -it --image=ubuntu --share-processes -- bash
    ```

3. Get the value of the `net.core.rmem_max` and `net.core.rmem_default` variables using the following `sysctl` command:

    ```bash
    sysctl net.core.rmem_max net.core.rmem_default
    ```

### Measure incoming UDP traffic

To check if your buffer is too small for your application and is dropping packets, start by simulating realistic network traffic on your pods and setting up a debug pod to monitor the incoming traffic. Then, you can use the following commands to measure the incoming UDP traffic:

1. Check the UDP file using the following `cat` command:

    ```bash
    cat /proc/net/udp
    ```

    This file shows you the statistics of the current open connections under the `rx_queue` column. It doesn't show historical data.

2. Check the snmp file using the following `cat` command:

    ```bash
    cat /proc/net/snmp
    ```

    This file shows you the life-to-date of the UDP packets, including how many packets were dropped under the `RcvbufErrors` column.

If you notice an increase beyond your buffer size in the `rx_queue` or an uptick in the `RcvbufErrors` value, you need to upgrade your buffer size.

> [!WARNING]
> If your application consistently runs at or beyond the buffer limits, simply increasing the size might not be the best solution. In such cases, you want to analyze and optimize your application for how it processes UDP requests. Increasing the buffer size is only beneficial if you experience bursts of traffic that cause the buffer to run out of space, because it assists in giving the kernel extra time/resources to process the burst in requests.

## Mitigate the issue

> [!IMPORTANT]
> Before you proceed, it's important to understand the impact of changing the buffer size. The buffer size tells the system kernel to reserve a certain amount of memory for the socket. More sockets and larger buffers can lead to increased memory reserved for the sockets and less memory available for other resources on the nodes. This can lead to resource starvation if not configured properly.

You can change buffer size values on a node pool level during the node pool creation process. The steps in this section show you how to configure your Linux OS and apply the changes to all nodes in the node pool. You can't add this setting to an existing node pool.

1. Create a `linuxosconfig.json` file with the following content. You can modify the values based on your application's requirements and node SKU. The minimum value is *212992 bytes*, and the maximum value is *134217728 bytes*.

    ```json
    { 
        "sysctls": { 
            "netCoreRmemMax": 2000000  
        } 
    } 
    ```

2. Make sure you're in the same directory as the `linuxosconfig.json` file and create a new node pool with the buffer size configuration using the [`az aks nodepool add`][az-aks-nodepool-add] command.

    ```azurecli-interactive
    az aks nodepool add --resource-group $RESOURCE_GROUP --cluster-name $CLUSTER_NAME --name $NODE_POOL_NAME --linux-os-config ./linuxosconfig.json
    ```

    This command sets the maximum UDP buffer size to `2 MB` for each socket on the node. You can adjust the value in the `linuxosconfig.json` file to meet your application's requirements.

## Validate the changes

Once you apply the new values, you can access your VM to ensure the new values are set as default.

1. Get a list of your nodes using the `kubectl get nodes` command and pick a node you want to check the buffer settings for.

    ```bash
    kubectl get nodes
    ```

2. Set up a debug pod on the node you selected using the `kubectl debug` command. Replace `<node-name>` with the name of the node you want to debug.

    ```bash
    kubectl debug <node-name> -it --image=ubuntu --share-processes -- bash
    ```

3. Get the value of the `net.core.rmem_max` variable using the following `sysctl` command:

    ```bash
    sysctl net.core.rmem_max
    ```

## Next steps

In this article, you learned how to diagnose and solve UDP packet drops in Azure Kubernetes Service (AKS). For more information on how to troubleshoot issues in AKS, see the [Azure Kubernetes Service troubleshooting documentation](/troubleshoot/azure/azure-kubernetes/welcome-azure-kubernetes).

<!-- LINKS -->
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az-aks-nodepool-add
