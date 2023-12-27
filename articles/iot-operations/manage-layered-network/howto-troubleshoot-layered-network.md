---
title: Troubleshoot Layered Network Management
titleSuffix: Troubleshoot
description: Troubleshoot the deployment and configuration failures of Layered Network Management.
author: PatAltimore
ms.subservice: layered-network-management
ms.author: patricka
ms.topic: how-to
ms.custom: ignite-2023
ms.date: 1/2/2024

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure isolate devices.
---

# Cannot install Layered Network Management on the parent level
Fail when trying to install the Layered Network Management operator or apply the CR for Layered Network Management instance.

**Troubleshooting steps**

1. Check if the regions are supported for public preview (for now we only support 8 regions for public preview). See [Quickstart: Deploy Azure IoT Operations](azure/iot-operations/get-started/quickstart-deploy#connect-a-kubernetes-cluster-to-azure-arc) for more information.
1. If there are any other errors in installing Layered Network Management Arc extensions, please follow the guidance in the error. Try uninstalling/installing the extension again. 
1. Verify the Layered Network Management Operator is in Running and Ready state. 
1. If application of CR (`kubectl apply –f cr.yaml`) fails, the output of this command generally shows the reason for error (CRD version mismatch, wrong entry in CRD,... etc)

# Cannot Arc-enable the cluster through the parent level Layered Network Management

Sometimes there would be issue while Arc-enabling the cluster on nested layers if you have repeatedly removed and onboarded cluster with the same machine. The error message would look like:

```
Error: We found an issue with outbound network connectivity from the cluster to the endpoints required for onboarding.
Please ensure to meet the following network requirements 'https://docs.microsoft.com/en-us/azure/azure-arc/kubernetes/quickstart-connect-cluster?tabs=azure-cli#meet-network-requirements'
If your cluster is behind an outbound proxy server, please ensure that you have passed proxy parameters during the onboarding of your cluster.
```

**Troubleshooting steps**

1. Run the following command:
    ```bash
    sudo systemctl restart systemd-networkd
    ```
1. Reboot the host machine.

**For other types of Arc-enablement failures:**
1. Add the `–-debug` parameter when running the connectedk8s command.
1. Capture the network packet trace. See [capture network packet trace](#appendix-capture-network-packet-trace) for more information.

# Fail to install IoT Operations on the isolated cluster

Failure while installing the IoT Operations components on nested layers. (For example, Layered Network Management on Level 4 is running, but facing issues installing IoT Operations on level 3.) 

**Troubleshooting steps**
1. Verify the nodes can access the Layered Network Management service running on parent level. For example, run `ping <IP-ADDRESS-L4-LNM>` from the node.
2. Verify the DNS queries are getting resolved to the Layered Network Management service running on the parent level. This can be achieved using following commands:
    ```bash
    nslookup management.azure.com
    ```
    The DNS shall response with the IP address of the Layered Network Management service.
3. If the domain is getting resolved correctly, then verify that the domain is added to the allowlist. See appendix for more details.
4. For deeper investigation please capture the network packet trace. See [capture network packet trace](#appendix-capture-network-packet-trace) for more information.

# A particular pod fails when installing IoT Operations

When installing the IoT Operations components to a cluster, the installation starts and proceeds. However, initialization of one or few of the components (pods) keep failing.

**Troubleshooting steps**

1. Identify the failed pod
    ```bash
    kubectl get pods -n azure-iot-operations
    ```
1. Run:
    ```bash
    kubectl describe pod [POD NAME] -n azure-iot-operations
    ```
1. Check the container image related information. If the image download fails, check if the domain name of download path is on the allow list. For example: 
    ```
    Warning  Failed  3m14s  kubelet  Failed to pull image "…
    ```

# Appendix: Check the allowlist of Layered Network Management

1. Run the following command to list the config maps.
    ```bash
    kubectl get cm -n azure-iot-operations
    ```
1. The output should look like the following:
    ```
    NAME                           DATA   AGE
    aio-lnm-level4-config          1      50s
    aio-lnm-level4-client-config   1      50s
    ```
1. The *xxx-client-conifg* contains the allowlist. Run:
    ```bash
    kubectl get cm aio-lnm-level4-client-config -o yaml
    ```
1. All the allowed domains will be listed in the output.

# Appendix: Capture network packet trace

In some cases, you might suspect that Layered Network Management instance at the parent level is not forwarding network traffic to a particular endpoint and causing issue for the service running on your node. It is possible that the service you have enabled is trying to connect to a new endpoint after an update. Or you are trying to install a new Arc extension/service that requires connection to endpoints that are not on the default allowlist. Usually there would be information in the error message to notify the connection failure. However, if there is no clear information about the missing endpoint, you can capture the network traffic on the child node for detailed debugging.

**Capture packet trace**
- Windows host
    1. Install Wireshark on the host.
    1. Run the Wireshark and start capturing.
    1. Reproduce the installation or connection failure.
    1. Stop capturing.
- Linux host
    1. Run the following command to start capturing:
        ```bash
        sudo tcpdump -W 5 -C 10 -i any -w AIO-deploy -Z root
        ```
    1. Reproduce the installation or connection failure.
    1. Stop capturing.

**Analize the packet trace**

Use Wireshark to open the trace file. Look for connection failures or non-responded connections.
> [!TIP] Filter the packets with the *ip.addr == [IP address]* parameter. Input the IP address of your custom DNS service address. Review the DNS query and response, check if there is any domain name that is not on the allowlist of Layered Network Management.



