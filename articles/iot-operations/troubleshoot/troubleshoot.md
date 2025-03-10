---
title: Troubleshoot Azure IoT Operations
description: Troubleshoot your Azure IoT Operations deployment
author: SoniaLopezBravo
ms.author: sonialopez
ms.topic: troubleshooting-general
ms.custom:
  - ignite-2023
ms.date: 11/01/2024
---

# Troubleshoot Azure IoT Operations

This article contains troubleshooting tips for Azure IoT Operations.

## General deployment troubleshooting

For general deployment and configuration troubleshooting, you can use the Azure CLI IoT Operations *check* and *support* commands.

[Azure CLI version 2.53.0 or higher](/cli/azure/install-azure-cli) is required and the [Azure IoT Operations extension](/cli/azure/iot/ops) installed.

- Use [az iot ops check](/cli/azure/iot/ops#az-iot-ops-check) to evaluate Azure IoT Operations service deployment for health, configuration, and usability. The *check* command can help you find problems in your deployment and configuration.

- Use [az iot ops support create-bundle](/cli/azure/iot/ops/support#az-iot-ops-support-create-bundle) to collect logs and traces to help you diagnose problems. The *support create-bundle* command creates a standard support bundle zip archive you can review or provide to Microsoft Support.

## Secret management

If you see the following error message related to secret management, you need to update your Azure Key Vault contents:

```output
rpc error: code = Unknown desc = failed to mount objects, error: failed to get objectType:secret,
objectName:nbc-eventhub-secret, objectVersion:: GET https://aio-kv-888f27b078.vault.azure.net/secrets/nbc-eventhub-secret/--------------------------------------------------------------------------------
RESPONSE 404: 404 Not FoundERROR CODE: SecretNotFound--------------------------------------------------------------------------------{ "error": { "code": "SecretNotFound", "message": "A secret with (name/id) nbc-eventhub-secret was not found in this key vault.
If you recently deleted this secret you may be able to recover it using the correct recovery command.
For help resolving this issue, please see https://go.microsoft.com/fwlink/?linkid=2125182" }
```

This error occurs when Azure IoT Operations tries to synchronize a secret from Azure Key Vault that doesn't exist. To resolve this issue, you need to add the secret in Azure Key Vault before you create resources such as a secret provider class.

## Connector for OPC UA

An OPC UA server connection fails with a `BadSecurityModeRejected` error if the connector tries to connect to a server that only exposes endpoints with no security. There are two options to resolve this issue:

- Overrule the restriction by explicitly setting the following values in the additional configuration for the asset endpoint profile:

    | Property | Value |
    |----------|-------|
    | `securityMode` | `none` |
    | `securityPolicy` | `http://opcfoundation.org/UA/SecurityPolicy#None` |

- Add a secure endpoint to the OPC UA server and set up the certificate mutual trust to establish the connection.

## Azure IoT Layered Network Management (preview) troubleshooting

The troubleshooting guidance in this section is specific to Azure IoT Operations when using the Layered Network Management component. For more information, see [How does Azure IoT Operations work in layered network?](../manage-layered-network/concept-iot-operations-in-layered-network.md).

### Can't install Layered Network Management on the parent level

If the Layered Network Management operator install fails or you can't apply the custom resource for a Layered Network Management instance:

1. Verify the regions are supported. For more information, see [Supported regions](../overview-iot-operations.md#supported-regions).
1. If there are any other errors in installing Layered Network Management Arc extensions, follow the guidance included with the error. Try uninstalling and installing the extension.
1. Verify the Layered Network Management operator is in the *Running and Ready* state.
1. If applying the custom resource `kubectl apply -f cr.yaml` fails, the output of this command lists the reason for error. For example, CRD version mismatch or wrong entry in CRD.

### Can't Arc-enable the cluster through the parent level Layered Network Management

If you repeatedly remove and onboard a cluster with the same machine, you might get an error while Arc-enabling the cluster on nested layers. For example:

```output
Error: We found an issue with outbound network connectivity from the cluster to the endpoints required for onboarding.
Please ensure to meet the following network requirements 'https://docs.microsoft.com/en-us/azure/azure-arc/kubernetes/quickstart-connect-cluster?tabs=azure-cli#meet-network-requirements'
If your cluster is behind an outbound proxy server, please ensure that you have passed proxy parameters during the onboarding of your cluster.
```

1. Run the following command:

    ```bash
    sudo systemctl restart systemd-networkd
    ```

1. Reboot the host machine.

### Other types of Arc-enablement failures

1. Add the `--debug` parameter when running the `connectedk8s` command.
1. Capture and investigate a network packet trace. For more information, see [capture Layered Network Management packet trace](#capture-layered-network-management-packet-trace).

### Can't install Azure IoT Operations on the isolated cluster

You can't install Azure IoT Operations components on nested layers. For example, Layered Network Management on level 4 is running but can't install Azure IoT Operations on level 3.

1. Verify the nodes can access the Layered Network Management service running on parent level. For example, run `ping <IP-ADDRESS-L4-LNM>` from the node.
1. Verify the DNS queries are being resolved to the Layered Network Management service running on the parent level using the following commands:

    ```bash
    nslookup management.azure.com
    ```

    DNS should respond with the IP address of the Layered Network Management service.

1. If the domain is being resolved correctly, verify the domain is added to the allowlist. For more information, see [Check the allowlist of Layered Network Management](#check-the-allowlist-of-layered-network-management).
1. Capture and investigate a network packet trace. For more information, see [capture Layered Network Management packet trace](#capture-layered-network-management-packet-trace).

### A pod fails when installing Azure IoT Operations on an isolated cluster

When installing the Azure IoT Operations components to a cluster, the installation starts and proceeds. However, initialization of one or few of the components (pods) fails.

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

    ```output
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

Use Wireshark to open the trace file. Look for connection failures or unresponsive connections.

1. Filter the packets with the *ip.addr == [IP address]* parameter. Input the IP address of your custom DNS service address.
1. Review the DNS query and response, check if there's a domain name that isn't on the allowlist of Layered Network Management.

## Operations experience

To sign in to the [operations experience](https://iotoperations.azure.com) web UI, you need a Microsoft Entra ID account with at least contributor permissions for the resource group that contains your **Kubernetes - Azure Arc** instance.

If you receive one of the following error messages: 

- A problem occurred getting unassigned instances
- Message: The request is not authorized
- Code: PermissionDenied

Verify your Microsoft Entra ID account meets the requirements in the [prerequisites](../discover-manage-assets/howto-manage-assets-remotely.md#prerequisites) section for operations experience access. 
