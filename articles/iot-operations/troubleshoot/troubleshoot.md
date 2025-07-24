---
title: Troubleshoot Azure IoT Operations
description: Troubleshoot your Azure IoT Operations deployment and configuration
author: SoniaLopezBravo
ms.author: sonialopez
ms.topic: troubleshooting-general
ms.custom:
  - ignite-2023
ms.date: 05/07/2025
---

# Troubleshoot Azure IoT Operations

This article contains troubleshooting tips for Azure IoT Operations.

The troubleshooting guidance helps you diagnose and resolve issues you might encounter when deploying, configuring, or running Azure IoT Operations by:

- Collecting diagnostic information from the Azure IoT Operations service and the Azure IoT Operations components running on your cluster.
- Providing solutions to common issues such as insufficient security permissions, missing secrets, or incorrect configuration settings.

For information about known issues and temporary workarounds, see [Known issues: Azure IoT Operations](known-issues.md).

## Troubleshoot Azure IoT Operations deployment

For general deployment and configuration troubleshooting, you can use the Azure CLI IoT Operations `check` and `support` commands.

[Azure CLI version 2.53.0 or higher](/cli/azure/install-azure-cli) is required and the [Azure IoT Operations extension](/cli/azure/iot/ops) installed.

- To evaluate Azure IoT Operations service deployment for health, configuration, and usability, use [az iot ops check](/cli/azure/iot/ops#az-iot-ops-check). The `check` command can help you find problems in your deployment and configuration.

- To collect logs and traces to help you diagnose problems, use [az iot ops support create-bundle](/cli/azure/iot/ops/support#az-iot-ops-support-create-bundle). The `support create-bundle` command creates a standard support bundle zip archive you can review or provide to Microsoft Support.

### You see an UnauthorizedNamespaceError error message

If you see the following error message, you either didn't enable the required Azure-arc custom locations feature, or you enabled the custom locations feature with an incorrect custom locations RP OID.

```output
Message: Microsoft.ExtendedLocation resource provider does not have the required permissions to create a namespace on the cluster.
```

To resolve the issue, follow [this guidance](/azure/azure-arc/kubernetes/custom-locations#enable-custom-locations-on-your-cluster) to enable the custom locations feature with the correct OID.

### You see a MissingResourceVersionOnHost error message

This error message indicates that the custom location resource associated with the deployment isn't properly configured. The custom location has the wrong the API version for the resources it's attempting to project to the cluster.

```output
Message: The resource {resource Id} extended location {custom location resource Id} does not support the resource type {IoT Operations resource type} or api version {IoT Operations ARM API}. Please check with the owner of the extended location to ensure the host has the CRD {custom resource name} with group {api group name}.iotoperations.azure.com, plural {custom resource plural name}, and versions [{api group version}] installed.
```

To resolve, delete any provisioned resources associated with prior deployments including custom locations. You can use `az iot ops delete` or alternative mechanism. Due to a potential caching issue, waiting a few minutes after deletion before redeploying AIO or choosing a custom location name via `az iot ops create --custom-location` is recommended.

### You see a LinkedAuthorizationFailed error message

If your deployment fails with the `"code":"LinkedAuthorizationFailed"` error, the message indicates that you don't have the required permissions on the resource group containing the cluster.

The following message indicates that the logged-in principal doesn't have the required permissions to deploy resources to the resource group specified in the resource sync resource ID.

```output
Message: The client {principal Id} with object id {principal object Id} has permission to perform action Microsoft.ExtendedLocation/customLocations/resourceSyncRules/write on scope {resource sync resource Id}; however, it does not have permission to perform action(s) Microsoft.Authorization/roleAssignments/write on the linked scope(s) {resource sync resource group} (respectively) or the linked scope(s) are invalid.
```

To deploy resource sync rules, the logged-in principal must have the `Microsoft.Authorization/roleAssignments/write` permission against the resource group that resources are being deployed to. This security constraint is necessary because edge to cloud resource hydration creates new resources in the target resource group.

To resolve the issue, either elevate principal permissions, or don't deploy resource sync rules. The current AIO CLI has an opt-in mechanism to deploy resource sync rules by using the `--enable-rsync` flag. To stop the resource sync rules being deployed, omit the flag.

> [!NOTE]
> Legacy AIO CLIs had an opt-out mechanism by using the `--disable-rsync-rules`.

### Deployment of MQTT broker fails

A deployment might fail if the cluster doesn't have sufficient resources for the specified MQTT broker cardinality and memory profile. To resolve this situation, adjust the replica count, workers, sharding, and memory profile settings to appropriate values for your cluster.

> [!WARNING]
> Setting the replica count to one can result in data loss in node failure scenarios.

> [!TIP]
> If you set lower values for sharding, workers, or memory profile, the broker's capacity to handle message load is reduced. Before you deploy to production, test your scenario with the MQTT broker configuration, to ensure the broker can handle the maximum expected load.

To learn more about how to choose suitable values for these parameters, see [Configure broker settings for high availability, scaling, and memory usage](../manage-mqtt-broker/howto-configure-availability-scale.md).

### You want to enable resource sync rules on an existing instance

Currently, you can't use the `az iot ops` command to enable resource sync rules on an existing instance. To work around this limitation, you can use the `az rest` command as follows:

To create the device registry rule:

1. Create a file called *rsr_device_registry.json* with the following content. Replace the `<placeholder>` values with your values:

    ```json
    {
        "location": "<custom location region>",
        "properties": {
            "targetResourceGroup": "/subscriptions/<subscription Id>/resourceGroups/<resource group name>",
            "priority": 200,
            "selector": {
                "matchLabels": {
                    "management.azure.com/provider-name": "Microsoft.DeviceRegistry"
                }
            }
        }
    }
    ```

1. Run the following command to create the device registry resource sync rule. Replace the `<placeholder>` values with your values:

    ```azcli
    az rest --url /subscriptions/<subscription Id>/resourceGroups/<resource group name>/providers/Microsoft.ExtendedLocation/customLocations/<custom location name>/resourceSyncRules/<rule name>?api-version=2021-08-31-preview --method PUT --body "@rsr_device_registry.json"
    ```

To create the instance rule:

1. Create a file called *rsr_instance.json* with the following content. Replace the `<placeholder>` values with your own values:

    ```json
    {
        "location": "<custom location region>",
        "properties": {
            "targetResourceGroup": "/subscriptions/<subscription Id>/resourceGroups/<resource group name>",
            "priority": 400,
            "selector": {
                "matchLabels": {
                    "management.azure.com/provider-name": "microsoft.iotoperations"
                }
            }
        }
    }
    ```

1. Run the following command to create the instance resource sync rule. Replace the `<placeholder>` values with your own values:

    ```azcli
    az rest --url /subscriptions/<subscription Id>/resourceGroups/<resource group name>/providers/Microsoft.ExtendedLocation/customLocations/<custom location name>/resourceSyncRules/<rule name>?api-version=2021-08-31-preview --method PUT --body "@rsr_instance.json"
    ```

## Troubleshoot Azure Key Vault secret management

If you see the following error message related to secret management, update your Azure Key Vault contents:

```output
rpc error: code = Unknown desc = failed to mount objects, error: failed to get objectType:secret,
objectName:nbc-eventhub-secret, objectVersion:: GET https://aio-kv-888f27b078.vault.azure.net/secrets/nbc-eventhub-secret/--------------------------------------------------------------------------------
RESPONSE 404: 404 Not FoundERROR CODE: SecretNotFound--------------------------------------------------------------------------------{ "error": { "code": "SecretNotFound", "message": "A secret with (name/id) nbc-eventhub-secret was not found in this key vault.
If you recently deleted this secret you may be able to recover it using the correct recovery command.
For help resolving this issue, please see https://go.microsoft.com/fwlink/?linkid=2125182" }
```

This error occurs when Azure IoT Operations tries to synchronize a secret from Azure Key Vault that doesn't exist. To resolve this issue, add the secret in Azure Key Vault before you create resources such as a secret provider class.

## Troubleshoot OPC UA server connections

An OPC UA server connection fails with a `BadSecurityModeRejected` error if the connector tries to connect to a server that only exposes endpoints with no security. There are two options to resolve this issue:

- Overrule the restriction by explicitly setting the following values in the additional configuration for the asset endpoint profile:

    | Property | Value |
    |----------|-------|
    | `securityMode` | `none` |
    | `securityPolicy` | `http://opcfoundation.org/UA/SecurityPolicy#None` |

- To establish the connection, add a secure endpoint to the OPC UA server and set up the certificate mutual trust.

## Troubleshoot OPC PLC simulator

### The OPC PLC simulator doesn't send data to the MQTT broker after you create an asset endpoint for it

To work around this issue, run the following command to set `autoAcceptUntrustedServerCertificates=true` for the asset endpoint:

```bash
ENDPOINT_NAME=<name-of-you-endpoint-here>
kubectl patch AssetEndpointProfile $ENDPOINT_NAME \
-n azure-iot-operations \
--type=merge \
-p '{"spec":{"additionalConfiguration":"{\"applicationName\":\"'"$ENDPOINT_NAME"'\",\"security\":{\"autoAcceptUntrustedServerCertificates\":true}}"}}'
```

> [!CAUTION]
> Don't use this configuration in production or preproduction environments. Exposing your cluster to the internet without proper authentication might lead to unauthorized access and even DDOS attacks.

You can patch all your asset endpoints with the following command:

```bash
ENDPOINTS=$(kubectl get AssetEndpointProfile -n azure-iot-operations --no-headers -o custom-columns=":metadata.name")
for ENDPOINT_NAME in `echo "$ENDPOINTS"`; do \
kubectl patch AssetEndpointProfile $ENDPOINT_NAME \
   -n azure-iot-operations \
   --type=merge \
   -p '{"spec":{"additionalConfiguration":"{\"applicationName\":\"'"$ENDPOINT_NAME"'\",\"security\":{\"autoAcceptUntrustedServerCertificates\":true}}"}}'; \
done
```

## Troubleshoot Azure IoT Layered Network Management (preview)

The troubleshooting guidance in this section is specific to Azure IoT Operations when using the Layered Network Management component. For more information, see [How does Azure IoT Operations work in layered network?](../manage-layered-network/concept-iot-operations-in-layered-network.md).

### You can't install Layered Network Management on the parent level

If the Layered Network Management operator install fails or you can't apply the custom resource for a Layered Network Management instance then:

1. Verify the regions are supported. For more information, see [Supported regions](../overview-iot-operations.md#supported-regions).
1. If there are any other errors in installing Layered Network Management Arc extensions, follow the guidance included with the error. Try uninstalling and installing the extension.
1. Verify the Layered Network Management operator is in the *Running and Ready* state.
1. If applying the custom resource `kubectl apply -f cr.yaml` fails, the output of this command lists the reason for error. For example, CRD version mismatch or wrong entry in CRD.

### You can't Arc-enable the cluster through the parent level Layered Network Management

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

If you still see the error, check the following items:

1. Add the `--debug` parameter when running the `connectedk8s` command.
1. Capture and investigate a network packet trace. For more information, see [capture Layered Network Management to a packet trace](#you-want-to-capture-layered-network-management-to-a-packet-trace).

### You can't install Azure IoT Operations on the isolated cluster

You can't install Azure IoT Operations components on nested layers. For example, Layered Network Management on level 4 is running but can't install Azure IoT Operations on level 3.

1. Verify the nodes can access the Layered Network Management service running on parent level. For example, run `ping <IP-ADDRESS-L4-LNM>` from the node.
1. Verify the DNS queries are being resolved to the Layered Network Management service running on the parent level using the following commands:

    ```bash
    nslookup management.azure.com
    ```

    DNS should respond with the IP address of the Layered Network Management service.

1. If the domain is being resolved correctly, verify the domain is added to the allowlist. For more information, see [Can't connect to the Azure IoT Operations service from the child level Layered Network Management](#you-cant-connect-to-the-azure-iot-operations-service-from-the-child-level-layered-network-management).
1. Capture and investigate a network packet trace. For more information, see [capture Layered Network Management to a packet trace](#you-want-to-capture-layered-network-management-to-a-packet-trace).

### You can install Azure IoT Operations on the isolated cluster but the pods fail to start

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

### You can't connect to the Azure IoT Operations service from the child level Layered Network Management

Layered Network Management blocks traffic if the destination domain isn't on the allowlist. The child level can access the list of domains in the allowlist. To verify if the domain is included, check the allowlist of Layered Network Management. If the domain isn't on the allowlist, you can add it to the allowlist.

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

### You want to capture Layered Network Management to a packet trace

In some cases, you might suspect that Layered Network Management instance at the parent level isn't forwarding network traffic to a particular endpoint. Connection to a required endpoint is causing an issue for the service running on your node. It's possible that the service you enabled is trying to connect to a new endpoint after an update. Or you're trying to install a new Arc extension or service that requires connection to endpoints that aren't on the default allowlist. Usually there would be information in the error message to notify the connection failure. However, if there's no clear information about the missing endpoint, you can capture the network traffic on the child node for detailed debugging.

#### [Windows host](#tab/tabid-windows)

1. Install Wireshark network traffic analyzer on the host.
1. Run Wireshark and start capturing.
1. Reproduce the installation or connection failure.
1. Stop capturing.

#### [Linux host](#tab/tabid-linux)

1. To start capturing, run the following command:

    ```bash
    sudo tcpdump -W 5 -C 10 -i any -w AIO-deploy -Z root
    ```

1. Reproduce the installation or connection failure.
1. Stop capturing.

***

Use Wireshark to open the trace file. Look for connection failures or unresponsive connections.

1. Filter the packets with the *ip.addr == [IP address]* parameter. Input the IP address of your custom DNS service address.
1. Review the DNS query and response to check if there's a domain name that isn't on the allowlist of Layered Network Management.

## Troubleshoot access to the operations experience web UI

To sign in to the [operations experience](https://iotoperations.azure.com) web UI, you need a Microsoft Entra ID account with at least contributor permissions for the resource group that contains your **Kubernetes - Azure Arc** instance.

If you receive one of the following error messages:

- A problem occurred getting unassigned instances
- Message: The request is not authorized
- Code: PermissionDenied

Verify your Microsoft Entra ID account meets the requirements in the [prerequisites](../discover-manage-assets/howto-manage-assets-remotely.md#prerequisites) section for operations experience access.

## Troubleshoot data flows

### You see a "Global error: AllBrokersDown" error message

If you see a `Global error: AllBrokersDown` error message in the data flow logs this means that the data flow hasn't processed any messages for about four or five minutes. Check that the data flow source is correctly configured and sending messages. For example, check that you're using the correct topic name from the MQTT broker.
