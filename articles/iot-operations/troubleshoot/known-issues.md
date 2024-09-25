---
title: "Known issues: Azure IoT Operations Preview"
description: Known issues for the MQTT broker, Layered Network Management, connector for OPC UA, OPC PLC simulator, data processor, and operations experience web UI.
author: dominicbetts
ms.author: dobett
ms.topic: troubleshooting-known-issue
ms.custom:
  - ignite-2023
ms.date: 07/11/2024
---

# Known issues: Azure IoT Operations Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This article lists the known issues for Azure IoT Operations Preview.

## Deploy and uninstall issues

- You must use the Azure CLI interactive login `az login` when you deploy Azure IoT Operations. If you don't, you might see an error such as _ERROR: AADSTS530003: Your device is required to be managed to access this resource_.

- When you use the `az iot ops delete` command to uninstall Azure IoT Operations, some custom Akri resources might not be deleted from the cluster. These Akri instances can cause issues if you redeploy Azure IoT Operations to the same cluster. You should manually delete any Akri instance custom resources from the cluster before you redeploy Azure IoT Operations.

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
> Don't use this configuration in production or pre-production environments. Exposing your cluster to the internet without proper authentication might lead to unauthorized access and even DDOS attacks.

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

- Currently, you can't track a value by using the last known value flag, `?$last`, in your dataflows configuration. Until a bug fix is in place, the workaround to is to deploy Azure IoT Operations version 0.5.1 and use data processor.

- Dataflows profile scaling iwth `instanceCount` is limited to `1` for Azure IoT Operations version 0.6.x.

- Configuration using Azure Resource Manager isn't supported. Instead, configure dataflows using `kubectl` and YAML files as documented.

## Akri services

When Akri services generate an asset endpoint for a discovered asset, the configuration may contain an invalid setting that prevents the asset from connecting to the MQTT broker. To resolve this issue, edit the `AssetEndpointProfile` configuration and remove the `"securityMode":"none"` setting from thr `additionalConfiguration` property. For example, the configuration for the `opc-ua-broker-opcplc-000000-50000` asset endpoint generated in the quickstarts should look like the following example:

```yml
apiVersion: deviceregistry.microsoft.com/v1beta1
kind: AssetEndpointProfile
metadata:
  creationTimestamp: "2024-08-05T11:41:21Z"
  generation: 2
  name: opc-ua-broker-opcplc-000000-50000
  namespace: azure-iot-operations
  resourceVersion: "233018"
  uid: f9cf479f-7a77-49b5-af88-18d509e9cdb0
spec:
  additionalConfiguration: '{"applicationName":"opc-ua-broker-opcplc-000000-50000","keepAliveMilliseconds":10000,"defaults":{"publishingIntervalMilliseconds":1000,"queueSize":1,"samplingIntervalMilliseconds":1000},"subscription":{"maxItems":1000,"lifetimeMilliseconds":360000},"security":{"autoAcceptUntrustedServerCertificates":true,"securityPolicy":"http://opcfoundation.org/UA/SecurityPolicy#None"},"session":{"timeoutMilliseconds":60000,"keepAliveIntervalMilliseconds":5000,"reconnectPeriodMilliseconds":500,"reconnectExponentialBackOffMilliseconds":10000}}'
  targetAddress: "\topc.tcp://opcplc-000000:50000"
  transportAuthentication:
    ownCertificates: []
  userAuthentication:
    mode: Anonymous
  uuid: opc-ua-broker-opcplc-000000-50000
```

A sporadic issue might cause the `aio-opc-asset-discovery` pod to restart with the following error in the logs: `opcua@311 exception="System.IO.IOException: Failed to bind to address http://unix:/var/lib/akri/opcua-asset.sock: address already in use.`.

To work around this issue, use the following steps to update the **DaemonSet** specification:

1. Locate the **target** custom resource provided by `orchestration.iotoperations.azure.com` with a name that ends with `-ops-init-target`:

    ```console
    kubectl get targets -n azure-iot-operations
    ```

1. Edit the target configuration and find the `spec.components.aio-opc-asset-discovery.properties.resource.spec.template.spec.containers.env` parameter. For example:

    ```console
    kubectl edit target solid-zebra-97r6jr7rw43vqv-ops-init-target -n azure-iot-operations
    ```

1. Add the following environment variables to the `spec.components.aio-opc-asset-discovery.properties.resource.spec.template.spec.containers.env` configuration section:

    ```yml
    - name: ASPNETCORE_URLS 
      value: http://+8443 
    - name: POD_IP 
      valueFrom: 
        fieldRef: 
          fieldPath: "status.podIP" 
    ```

1. Save your changes. The final specification looks like the following example:

    ```yml
    apiVersion: orchestrator.iotoperations.azure.com/v1 
    kind: Target 
    metadata: 
      name: <cluster-name>-target 
      namespace: azure-iot-operations 
    spec: 
      displayName: <cluster-name>-target 
      scope: azure-iot-operations 
      topologies: 
      ...
      version: 1.0.0.0 
      components: 
        ... 
        - name: aio-opc-asset-discovery 
          type: yaml.k8s 
          properties: 
            resource: 
              apiVersion: apps/v1 
              kind: DaemonSet 
              metadata: 
                labels: 
                  app.kubernetes.io/part-of: aio 
                name: aio-opc-asset-discovery 
              spec: 
                selector: 
                  matchLabels: 
                    name: aio-opc-asset-discovery 
                template: 
                  metadata: 
                    labels: 
                      app.kubernetes.io/part-of: aio 
                      name: aio-opc-asset-discovery 
                  spec: 
                    containers: 
                      - env: 
                          - name: ASPNETCORE_URLS 
                            value: http://+8443 
                          - name: POD_IP 
                            valueFrom: 
                              fieldRef: 
                                fieldPath: status.podIP 
                          - name: DISCOVERY_HANDLERS_DIRECTORY 
                            value: /var/lib/akri 
                          - name: AKRI_AGENT_REGISTRATION 
                            value: 'true' 
                        image: >- 
                          edgeappmodel.azurecr.io/opcuabroker/discovery-handler:0.4.0-preview.3 
                        imagePullPolicy: Always 
                        name: aio-opc-asset-discovery 
                        ports: ... 
                        resources: ...
                        volumeMounts: ...
                    volumes: ...
    ```

## Operations experience web UI

To sign in to the operations experience, you need a Microsoft Entra ID account with at least contributor permissions for the resource group that contains your **Kubernetes - Azure Arc** instance. You can't sign in with a Microsoft account (MSA). To create an account in your Azure tenant:

1. Sign in to the [Azure portal](https://portal.azure.com/) with the same tenant and user name that you used to deploy Azure IoT Operations.
1. In the Azure portal, go to the **Microsoft Entra ID** section, select **Users > +New user > Create new user**. Create a new user and make a note of the password, you need it to sign in later.
1. In the Azure portal, go to the resource group that contains your **Kubernetes - Azure Arc** instance. On the **Access control (IAM)** page, select **+Add > Add role assignment**.
1. On the **Add role assignment page**, select **Privileged administrator roles**. Then select **Contributor** and then select **Next**.
1. On the **Members** page, add your new user to the role.
1. Select **Review and assign** to complete setting up the new user.

You can now use the new user account to sign in to the [Azure IoT Operations](https://iotoperations.azure.com) portal.
