---
title: "Known issues: Azure IoT Operations Preview"
description: Known issues for Azure IoT MQ, Layered Network Management, OPC UA Broker, OPC PLC simulator, Data Processor, and Operations portal.
author: dominicbetts
ms.author: dobett
ms.topic: troubleshooting-known-issue
ms.custom:
  - ignite-2023
ms.date: 05/03/2024
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

## Azure IoT MQ Preview

- You can only access the default deployment by using the cluster IP, TLS, and a service account token. Clients outside the cluster need extra configuration before they can connect.

- You can't update the Broker custom resource after the initial deployment. You can't make configuration changes to cardinality, memory profile, or disk buffer.

- You can't configure the size of a disk-backed buffer unless your chosen storage class supports it.

- Even though IoT MQ's [diagnostic service](../monitor/howto-configure-diagnostics.md) produces telemetry on its own topic, you might still get messages from the self-test when you subscribe to `#` topic.

- Some clusters that have slow Kubernetes API calls may result in selftest ping failures: `Status {Failed}. Probe failed: Ping: 1/2` from running `az iot ops check` command.

- You might encounter an error in the KafkaConnector StatefulSet event logs such as `Invalid value: "mq-to-eventhub-connector-<token>--connectionstring": must be no more than 63 characters`. Ensure your KafkaConnector name is of maximum 5 characters.

- You may encounter timeout errors in the Kafka connector and Event Grid connector logs. Despite this, the connector will continue to function and forward messages.

## Azure IoT Layered Network Management Preview

- If the Layered Network Management service doesn't get an IP address while running K3S on Ubuntu host, reinstall K3S without _trafeik ingress controller_ by using the `--disable=traefik` option.

    ```bash
    curl -sfL https://get.k3s.io | sh -s - --disable=traefik --write-kubeconfig-mode 644
    ```

    For more information, see [Networking | K3s](https://docs.k3s.io/networking#traefik-ingress-controller).

- If DNS queries don't resolve to the expected IP address while using [CoreDNS](../manage-layered-network/howto-configure-layered-network.md#configure-coredns) service running on child network level, upgrade to Ubuntu 22.04 and reinstall K3S.

## Azure IoT OPC UA Broker Preview

- All `AssetEndpointProfiles` in the cluster must be configured with the same transport authentication certificate, otherwise the OPC UA Broker might exhibit random behavior. To avoid this issue when using transport authentication, configure all asset endpoints with the same thumbprint for the transport authentication certificate in the Azure IoT Operations (preview) portal.

- If you deploy an `AssetEndpointProfile` into the cluster and the OPC UA Broker can't connect to the configured endpoint on the first attempt, then the OPC UA Broker never retries to connect.

    As a workaround, first fix the connection problem. Then either restart all the pods in the cluster with pod names that start with "aio-opc-opc.tcp", or delete the `AssetEndpointProfile` and deploy it again.

## OPC PLC simulator

If you create an asset endpoint for the OPC PLC simulator, but the OPC PLC simulator isn't sending data to the IoT MQ broker, run the following command to set `autoAcceptUntrustedServerCertificates=true` for the asset endpoint:

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

If the OPC PLC simulator isn't sending data to the IoT MQ broker after you create a new asset, restart the OPC PLC simulator pod. The pod name looks like `aio-opc-opc.tcp-1-f95d76c54-w9v9c`. To restart the pod, use the `k9s` tool to kill the pod, or run the following command:

```bash
kubectl delete pod aio-opc-opc.tcp-1-f95d76c54-w9v9c -n azure-iot-operations
```

## Azure IoT Data Processor Preview

- If you see deployment errors with Data Processor pods, make sure that when you created your Azure Key Vault you chose **Vault access policy** as the **Permission model**.

- If the data processor extension fails to uninstall, run the following commands and try the uninstall operation again:

    ```bash
    kubectl delete pod  aio-dp-reader-worker-0 --grace-period=0 --force -n azure-iot-operations
    kubectl delete pod  aio-dp-runner-worker-0 --grace-period=0 --force -n azure-iot-operations
    ```

- If edits you make to a pipeline aren't applied to messages, run the following commands to propagate the changes:

    ```bash
    kubectl rollout restart deployment aio-dp-operator -n azure-iot-operations 
    
    kubectl rollout restart statefulset aio-dp-runner-worker -n azure-iot-operations 
    
    kubectl rollout restart statefulset aio-dp-reader-worker -n azure-iot-operations
    ```

- It's possible a momentary loss of communication with IoT MQ broker pods can pause the processing of data pipelines. You might also see errors such as `service account token expired`. If you notice this happening, run the following commands:

    ```bash
    kubectl rollout restart statefulset aio-dp-runner-worker -n azure-iot-operations
    kubectl rollout restart statefulset aio-dp-reader-worker -n azure-iot-operations
    ```

- If data is corrupted in the Microsoft Fabric lakehouse table that your Data Processor pipeline is writing to, make sure that no other processes are writing to the table. If you write to the Microsoft Fabric lakehouse table from multiple sources, you might see corrupted data in the table.

## Azure IoT Akri Preview

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

1. Add the following environment variables to the configuration:

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

## Azure IoT Operations Preview portal

To sign in to the Azure IoT Operations portal, you need a Microsoft Entra ID account with at least contributor permissions for the resource group that contains your **Kubernetes - Azure Arc** instance. You can't sign in with a Microsoft account (MSA). To create an account in your Azure tenant:

1. Sign in to the [Azure portal](https://portal.azure.com/) with the same tenant and user name that you used to deploy Azure IoT Operations.
1. In the Azure portal, navigate to the **Microsoft Entra ID** section, select **Users > +New user > Create new user**. Create a new user and make a note of the password, you need it to sign in later.
1. In the Azure portal, navigate to the resource group that contains your **Kubernetes - Azure Arc** instance. On the **Access control (IAM)** page, select **+Add > Add role assignment**.
1. On the **Add role assignment page**, select **Privileged administrator roles**. Then select **Contributor** and then select **Next**.
1. On the **Members** page, add your new user to the role.
1. Select **Review and assign** to complete setting up the new user.

You can now use the new user account to sign in to the [Azure IoT Operations](https://iotoperations.azure.com) portal.
