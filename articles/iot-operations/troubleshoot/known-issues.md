---
title: "Known issues: Azure IoT Operations Preview"
description: Known issues for the MQTT broker, Layered Network Management, connector for OPC UA, OPC PLC simulator, data processor, and operations experience web UI.
author: dominicbetts
ms.author: dobett
ms.topic: troubleshooting-known-issue
ms.custom:
  - ignite-2023
ms.date: 08/22/2024
---

# Known issues: Azure IoT Operations Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This article lists the known issues for Azure IoT Operations Preview.

## Deploy and uninstall issues

- You must use the Azure CLI interactive login `az login` when you deploy Azure IoT Operations. If you don't, you might see an error such as _ERROR: AADSTS530003: Your device is required to be managed to access this resource_.

- If your deployment fails with the `"code":"LinkedAuthorizationFailed"` error, it means that you don't have **Microsoft.Authorization/roleAssignments/write** permissions on the resource group that contains your cluster.

  To resolve this issue, either request the required permissions or make the following adjustments to your deployment steps:

  - If deploying with an Azure Resource Manager template, set the `deployResourceSyncRules` parameter to `false`.
  - If deploying with the Azure CLI, include the `--disable-rsync-rules` flag with the [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init) command.

- Uninstalling K3s: When you uninstall k3s on Ubuntu by using the `/usr/local/bin/k3s-uninstall.sh` script, you might encounter an issue where the script gets stuck on unmounting the NFS pod. A workaround for this issue is to run the following command before you run the uninstall script: `sudo systemctl stop k3s`.

## MQTT broker

- You can only access the default deployment by using the cluster IP, TLS, and a service account token. Clients outside the cluster need extra configuration before they can connect.

- You can't update the Broker custom resource after the initial deployment. You can't make configuration changes to cardinality, memory profile, or disk buffer.

  As a workaround, when deploying Azure IoT Operations with the [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init) command, you can include the `--broker-config-file` parameter with a JSON configuration file for the MQTT broker. For more information, see [Advanced MQTT broker config](https://github.com/Azure/azure-iot-ops-cli-extension/wiki/Advanced-Mqtt-Broker-Config) and [Configure core MQTT broker settings](../manage-mqtt-broker/howto-configure-availability-scale.md).

- You can't configure the size of a disk-backed buffer unless your chosen storage class supports it.

- Even though the MQTT broker's [diagnostics](../manage-mqtt-broker/howto-configure-availability-scale.md#configure-mqtt-broker-diagnostic-settings) produces telemetry on its own topic, you might still get messages from the self-test when you subscribe to `#` topic.

- Some clusters that have slow Kubernetes API calls may result in selftest ping failures: `Status {Failed}. Probe failed: Ping: 1/2` from running `az iot ops check` command.

- Probe operations fail with `Not Authorized` error when the deployment doesn't have a custom authorization policy with rules defined. To resolve this issue, create a [broker authorization policy with rules](../manage-mqtt-broker/howto-configure-authorization.md#authorization-rules).

- You might encounter an error in the KafkaConnector StatefulSet event logs such as `Invalid value: "mq-to-eventhub-connector-<token>--connectionstring": must be no more than 63 characters`. Ensure your KafkaConnector name is of maximum 5 characters.

- You may encounter timeout errors in the Kafka connector and Event Grid connector logs. Despite this, the connector will continue to function and forward messages.

- Deployment might fail if the **cardinality** and **memory profile** values are set to be too large for the cluster. To resolve this issue, set the replicas count to `1` and use a smaller memory profile, like `low`.

## Azure IoT Layered Network Management Preview

- If the Layered Network Management service doesn't get an IP address while running K3S on Ubuntu host, reinstall K3S without _trafeik ingress controller_ by using the `--disable=traefik` option.

    ```bash
    curl -sfL https://get.k3s.io | sh -s - --disable=traefik --write-kubeconfig-mode 644
    ```

    For more information, see [Networking | K3s](https://docs.k3s.io/networking#traefik-ingress-controller).

- If DNS queries don't resolve to the expected IP address while using [CoreDNS](../manage-layered-network/howto-configure-layered-network.md#configure-coredns) service running on child network level, upgrade to Ubuntu 22.04 and reinstall K3S.

## Connector for OPC UA

- All `AssetEndpointProfiles` in the cluster must be configured with the same transport authentication certificate, otherwise the connector for OPC UA might exhibit random behavior. To avoid this issue when using transport authentication, configure all asset endpoints with the same thumbprint for the transport authentication certificate in the Azure IoT Operations (preview) portal.

- If you deploy an `AssetEndpointProfile` into the cluster and the connector for OPC UA can't connect to the configured endpoint on the first attempt, then the connector for OPC UA never retries to connect.

  As a workaround, first fix the connection problem. Then either restart all the pods in the cluster with pod names that start with "aio-opc-opc.tcp", or delete the `AssetEndpointProfile` and deploy it again.

- If you create an asset by using the operations experience web UI, the subject property for any messages sent by the asset is set to the `externalAssetId` value. In this case, the `subject` is a GUID rather than a friendly asset name.

- If your broker tries to connect to an untrusted server, it throws a `rejected to write to PKI` error. You can also encounter this error in assets and asset endpoint profiles.

  As a workaround, add the server's certificate to the trusted certificates store as described in [Configure the trusted certificates list](../discover-manage-assets/howto-configure-opcua-certificates-infrastructure.md#configure-the-trusted-certificates-list).

  Or, you can [Optionally configure your AssetEndpointProfile without mutual trust established](../discover-manage-assets/howto-configure-opc-plc-simulator.md#optionally-configure-your-assetendpointprofile-without-mutual-trust-established). This workaround should not be used in production environments.

## OPC PLC simulator

If you create an asset endpoint for the OPC PLC simulator, but the OPC PLC simulator isn't sending data to the MQTT broker, run the following command to set `autoAcceptUntrustedServerCertificates=true` for the asset endpoint:

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

If the OPC PLC simulator isn't sending data to the MQTT broker after you create a new asset, restart the OPC PLC simulator pod. The pod name looks like `aio-opc-opc.tcp-1-f95d76c54-w9v9c`. To restart the pod, use the `k9s` tool to kill the pod, or run the following command:

```bash
kubectl delete pod aio-opc-opc.tcp-1-f95d76c54-w9v9c -n azure-iot-operations
```

## Dataflows

- Sending data to ADX, ADLSv2, and Fabric OneLake are not available in Azure IoT Operations version 0.6.x. Support for these endpoints will be added back in an upcoming preview release.

- By default, dataflows don't send MQTT message user properties to Kafka destinations. These user properties include values such as `subject` that store the name of the asset sending the message. To include user properties in the Kafka message, update the `DataflowEndpoint` configuration to include: `copyMqttProperties: enabled`. For example:

    ```yaml
    apiVersion: connectivity.iotoperations.azure.com/v1beta1
    kind: DataflowEndpoint
    metadata:
      name: kafka-target
      namespace: azure-iot-operations
    spec:
      endpointType: kafkaSettings
      kafkaSettings:
        host: "<NAMESPACE>.servicebus.windows.net:9093"
        batching:
          latencyMs: 0
          maxMessages: 100
        tls:
          mode: Enabled
        copyMqttProperties: enabled
      authentication:
        method: SystemAssignedManagedIdentity
        systemAssignedManagedIdentitySettings:
          audience: https://<NAMESPACE>.servicebus.windows.net
    ```

- Currently, you can't track a value by using the last known value flag, `?$last`, in your dataflows configuration. Until a bug fix is in place, the workaround is to deploy Azure IoT Operations version 0.5.1 and use data processor.

- Dataflows profile scaling with `instanceCount` is limited to `1` for Azure IoT Operations version 0.6.x.

- Configuration using Azure Resource Manager isn't supported. Instead, configure dataflows using `kubectl` and YAML files as documented.

- When using Event Hubs endpoint as a dataflow source, Kafka headers gets corrupted as its translated to MQTT. To learn more, see [Configure Kafka dataflow endpoints](../connect-to-cloud/howto-configure-kafka-endpoint.md#kafka-endpoint-is-a-dataflow-source).

## Akri services

In the current release, the Akri services don't support any user-configurable scenarios. Full support for Akri services will be added back in an upcoming preview release.

> [!NOTE]
> You can see Akri related pods deployed in the cluster, but they don't support any user-configurable scenarios.

## Operations experience web UI

To sign in to the operations experience, you need a Microsoft Entra ID account with at least contributor permissions for the resource group that contains your **Kubernetes - Azure Arc** instance. You can't sign in with a Microsoft account (MSA). To create an account in your Azure tenant:

1. Sign in to the [Azure portal](https://portal.azure.com/) with the same tenant and user name that you used to deploy Azure IoT Operations.
1. In the Azure portal, go to the **Microsoft Entra ID** section, select **Users > +New user > Create new user**. Create a new user and make a note of the password, you need it to sign in later.
1. In the Azure portal, go to the resource group that contains your **Kubernetes - Azure Arc** instance. On the **Access control (IAM)** page, select **+Add > Add role assignment**.
1. On the **Add role assignment page**, select **Privileged administrator roles**. Then select **Contributor** and then select **Next**.
1. On the **Members** page, add your new user to the role.
1. Select **Review and assign** to complete setting up the new user.

You can now use the new user account to sign in to the [Azure IoT Operations](https://iotoperations.azure.com) portal.
