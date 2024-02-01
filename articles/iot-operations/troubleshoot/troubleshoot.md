---
title: Troubleshoot Azure IoT Operations
description: Troubleshoot your Azure IoT Operations deployment
author: kgremban
ms.author: kgremban
ms.topic: troubleshooting-general
ms.custom:
  - ignite-2023
ms.date: 01/22/2024
---

# Troubleshoot Azure IoT Operations

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This article contains troubleshooting tips for Azure IoT Operations Preview.

## Deployment and configuration issues

For general deployment and configuration troubleshooting, you can use the Azure CLI IoT Operations *check* and *support* commands.

[Azure CLI version 2.46.0 or higher](/cli/azure/install-azure-cli) is required and the [Azure IoT Operations extension](/cli/azure/iot/ops) installed.

- Use [az iot ops check](/cli/azure/iot/ops#az-iot-ops-check) to evaluate IoT Operations service deployment for health, configuration, and usability. The *check* command can help you find problems in your deployment and configuration.

- Use [az iot ops support create-bundle](/cli/azure/iot/ops/support#az-iot-ops-support-create-bundle) to collect logs and traces to help you diagnose problems. The *support create-bundle* command creates a standard support bundle zip archive you can review or provide to Microsoft Support.

## Data Processor pipeline deployment status is failed

Your Data Processor pipeline deployment status is showing as **Failed**.

### Find pipeline error codes

To find the pipeline error codes, use the following commands.

To list the Data Processor pipeline deployments, run the following command:

```bash
kubectl get pipelines -A
```

The output from the pervious command looks like the following example:

```text
NAMESPACE                NAME                           AGE
azure-iot-operations     passthrough-data-pipeline      2d20h
azure-iot-operations     reference-data-pipeline        2d20h
azure-iot-operations     contextualized-data-pipeline   2d20h
```

To view detailed information for a pipeline, run the following command:

```bash
kubectl describe pipelines passthrough-data-pipeline -n azure-iot-operations
```

The output from the previous command looks like the following example:

```text
...
Status:
  Provisioning Status:
    Error
      Code:  <ErrorCode>
      Message: <ErrorMessage>
    Status:        Failed
Events:            <none>
```

## Data is corrupted in the Microsoft Fabric lakehouse table

If data is corrupted in the Microsoft Fabric lakehouse table that your Data Processor pipeline is writing to, make sure that no other processes are writing to the table. If you write to the Microsoft Fabric lakehouse table from multiple sources, you might see corrupted data in the table.

## Deployment issues with Data Processor

If you see deployment errors with Data Processor pods, make sure that when you created your Azure Key Vault you chose **Vault access policy** as the **Permission model**.

## Data Processor pipeline edits aren't applied to messages

If edits you make to a pipeline aren't applied to messages, run the following commands to propagate the changes:

```bash
kubectl rollout restart deployment aio-dp-operator -n azure-iot-operations 

kubectl rollout restart statefulset aio-dp-runner-worker -n azure-iot-operations 

kubectl rollout restart statefulset aio-dp-reader-worker -n azure-iot-operations
```

## Data Processor pipeline processing pauses unexpectedly

It's possible a momentary loss of communication with IoT MQ broker pods can pause the processing of data pipelines. You might also see errors such as `service account token expired`. If you notice this happening, run the following commands:

```bash
kubectl rollout restart statefulset aio-dp-runner-worker -n azure-iot-operations
kubectl rollout restart statefulset aio-dp-reader-worker -n azure-iot-operations
```

## Troubleshoot Layered Network Management

The troubleshooting guidance in this section is specific to Azure IoT Operations when using an IoT Layered Network Management. For more information, see [How does Azure IoT Operations work in layered network?](../manage-layered-network/concept-iot-operations-in-layered-network.md).

### Can't install Layered Network Management on the parent level

Layered Network Management operator install fails or you can't apply the custom resource for a Layered Network Management instance.

1. Verify the regions are supported for public preview. Public preview supports eight regions. For more information, see [Quickstart: Deploy Azure IoT Operations](../get-started/quickstart-deploy.md#connect-a-kubernetes-cluster-to-azure-arc).
1. If there are any other errors in installing Layered Network Management Arc extensions, follow the guidance included with the error. Try uninstalling and installing the extension. 
1. Verify the Layered Network Management operator is in the *Running and Ready* state.
1. If applying the custom resource `kubectl apply -f cr.yaml` fails, the output of this command lists the reason for error. For example, CRD version mismatch or wrong entry in CRD.

### Can't Arc-enable the cluster through the parent level Layered Network Management

If you repeatedly remove and onboard a cluster with the same machine, you might get an error while Arc-enabling the cluster on nested layers. For example, the error message might look like:

```Output
Error: We found an issue with outbound network connectivity from the cluster to the endpoints required for onboarding.
Please ensure to meet the following network requirements 'https://docs.microsoft.com/en-us/azure/azure-arc/kubernetes/quickstart-connect-cluster?tabs=azure-cli#meet-network-requirements'
If your cluster is behind an outbound proxy server, please ensure that you have passed proxy parameters during the onboarding of your cluster.
```

1. Run the following command:

    ```bash
    sudo systemctl restart systemd-networkd
    ```

1. Reboot the host machine.

#### Other types of Arc-enablement failures

1. Add the `--debug` parameter when running the `connectedk8s` command.
1. Capture and investigate a network packet trace. For more information, see [capture Layered Network Management packet trace](#capture-layered-network-management-packet-trace).

### Can't install IoT Operations on the isolated cluster

You can't install IoT Operations components on nested layers. For example, Layered Network Management on level 4 is running but can't install IoT Operations on level 3.

1. Verify the nodes can access the Layered Network Management service running on parent level. For example, run `ping <IP-ADDRESS-L4-LNM>` from the node.
1. Verify the DNS queries are being resolved to the Layered Network Management service running on the parent level using the following commands:

    ```bash
    nslookup management.azure.com
    ```

    DNS should respond with the IP address of the Layered Network Management service.

1. If the domain is being resolved correctly, verify the domain is added to the allowlist. For more information, see [Check the allowlist of Layered Network Management](#check-the-allowlist-of-layered-network-management).
1. Capture and investigate a network packet trace. For more information, see [capture Layered Network Management packet trace](#capture-layered-network-management-packet-trace).

### A pod fails when installing IoT Operations on an isolated cluster

When installing the IoT Operations components to a cluster, the installation starts and proceeds. However, initialization of one or few of the components (pods) fails.

1. Identify the failed pod

    ```bash
    kubectl get pods -n azure-iot-operations
    ```

1. Get details about the pod:

    ```bash
    kubectl describe pod [POD NAME] -n azure-iot-operations
    ```

1. Check the container image related information. If the image download fails, check if the domain name of download path is on the allowlist. For example: 

    ```output
    Warning  Failed  3m14s  kubelet  Failed to pull image "…
    ```

### Check the allowlist of Layered Network Management

Layered Network Management blocks traffic if the destination domain isn't on the allowlist.

1. Run the following command to list the config maps.
    ```bash
    kubectl get cm -n azure-iot-operations
    ```
1. The output should look like the following example:
    ```
    NAME                           DATA   AGE
    aio-lnm-level4-config          1      50s
    aio-lnm-level4-client-config   1      50s
    ```
1. The *xxx-client-config* contains the allowlist. Run:
    ```bash
    kubectl get cm aio-lnm-level4-client-config -o yaml
    ```
1. All the allowed domains are listed in the output.

### Capture Layered Network Management packet trace

In some cases, you might suspect that Layered Network Management instance at the parent level isn't forwarding network traffic to a particular endpoint. Connection to a required endpoint is causing an issue for the service running on your node. It's possible that the service you enabled is trying to connect to a new endpoint after an update. Or you're trying to install a new Arc extension or service that requires connection to endpoints that aren't on the default allowlist. Usually there would be information in the error message to notify the connection failure. However, if there's no clear information about the missing endpoint, you can capture the network traffic on the child node for detailed debugging.

#### Windows host

1. Install Wireshark network traffic analyzer on the host.
1. Run Wireshark and start capturing.
1. Reproduce the installation or connection failure.
1. Stop capturing.

#### Linux host

1. Run the following command to start capturing:

    ```bash
    sudo tcpdump -W 5 -C 10 -i any -w AIO-deploy -Z root
    ```

1. Reproduce the installation or connection failure.
1. Stop capturing.

#### Analyze the packet trace

Use Wireshark to open the trace file. Look for connection failures or nonresponded connections.

1. Filter the packets with the *ip.addr == [IP address]* parameter. Input the IP address of your custom DNS service address.
1. Review the DNS query and response, check if there's a domain name that isn't on the allowlist of Layered Network Management.
