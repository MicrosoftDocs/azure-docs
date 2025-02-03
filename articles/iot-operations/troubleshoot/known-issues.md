---
title: "Known issues: Azure IoT Operations"
description: Known issues for the MQTT broker, Layered Network Management (preview), connector for OPC UA, OPC PLC simulator, dataflows, and operations experience web UI.
author: dominicbetts
ms.author: dobett
ms.topic: troubleshooting-known-issue
ms.custom:
  - ignite-2023
ms.date: 01/28/2025
---

# Known issues: Azure IoT Operations

This article lists the known issues for Azure IoT Operations.

## Deploy and uninstall issues

- If you prefer to have no updates made to your cluster without giving explicit consent, you should disable Arc updates when you enable the cluster. This is due to the fact that some system extensions are automatically updated by the Arc agent. To disable updates, include the `--disable-auto-upgrade` flag as part of the `az connectedk8s connect` command.

- If your deployment fails with the `"code":"LinkedAuthorizationFailed"` error, it means that you don't have **Microsoft.Authorization/roleAssignments/write** permissions on the resource group that contains your cluster.

- Directly editing **SecretProviderClass** and **SecretSync** custom resources in your Kubernetes cluster can break the secrets flow in Azure IoT Operations. For any operations related to secrets, use the operations experience UI.

- During and after deploying Azure IoT Operations, you might see warnings about `Unable to retrieve some image pull secrets (regcred)` in the logs and Kubernetes events. These warnings are expected and don't affect the deployment and use of Azure IoT Operations.

- If your deployment fails with the message `Error occurred while creating custom resources needed by system extensions`, you have encountered a known sporadic failure that will be fixed in a future release. As a work around, use the [az iot ops delete](/cli/azure/iot/ops#az-iot-ops-delete) command with the `--include-deps` flag to delete Azure IoT Operations from your cluster. When Azure IoT Operations and its dependencies are deleted from your cluster, retry the deployment.

- If you deploy Azure IoT Operations in GitHub Codespaces, shutting down and restarting the Codespace causes a `This codespace is currently running in recovery mode due to a configuration error.` issue. Currently, there's no workaround for the issue. If you need a cluster that supports shutting down and restarting, choose one of the options in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md).

- Downgrading the Azure Container Storage extension from 2.2.3 to 2.2.2 causes a logging loop that leads to high CPU usage warnings. To resolve, upgrade the extension back to 2.2.3. For more information, see [Upgrade or downgrade between versions](../deploy-iot-ops/howto-upgrade.md).

## MQTT broker

- MQTT broker resources created in your cluster using Kubernetes aren't visible Azure portal. This is expected because [managing Azure IoT Operations components using Kubernetes is in preview](../deploy-iot-ops/howto-manage-update-uninstall.md#preview-manage-components-using-kubernetes-deployment-manifests), and synchronizing resources from the edge to the cloud isn't currently supported.

- You can't update the Broker resource after the initial deployment. You can't make configuration changes to cardinality, memory profile, or disk buffer.

  As a workaround, when deploying Azure IoT Operations with the [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init) command, you can include the `--broker-config-file` parameter with a JSON configuration file for the MQTT broker. For more information, see [Advanced MQTT broker config](https://github.com/Azure/azure-iot-ops-cli-extension/wiki/Advanced-Mqtt-Broker-Config) and [Configure core MQTT broker settings](../manage-mqtt-broker/howto-configure-availability-scale.md).

- If a Broker only has one backend replica (`backendChain.redundancyFactor` is set to 1) upgrading Azure IoT Operations might fail. Only upgrade Azure IoT Operations if the Broker has more than one backend replica.

- Even though the MQTT broker's [diagnostics](../manage-mqtt-broker/howto-broker-diagnostics.md) produces telemetry on its own topic, you might still get messages from the self-test when you subscribe to `#` topic.

- Deployment might fail if the **cardinality** and **memory profile** values are set to be too large for the cluster. To resolve this issue, set the replicas count to `1` and use a smaller memory profile, like `low`.

- Don't publish or subscribe to diagnostic probe topics that start with `azedge/dmqtt/selftest`. Publishing or subscribing to these topics might affect the probe or self-test checks resulting in invalid results. Invalid results might be listed in diagnostic probe logs, metrics, or dashboards. For example, you might see the issue *Path verification failed for probe event with operation type 'Publish'* in the diagnostics-probe logs.

## Azure IoT Layered Network Management (preview)

- If the Layered Network Management service doesn't get an IP address while running K3S on Ubuntu host, reinstall K3S without _traefik ingress controller_ by using the `--disable=traefik` option.

    ```bash
    curl -sfL https://get.k3s.io | sh -s - --disable=traefik --write-kubeconfig-mode 644
    ```

    For more information, see [Networking | K3s](https://docs.k3s.io/networking#traefik-ingress-controller).

- If DNS queries don't resolve to the expected IP address while using [CoreDNS](../manage-layered-network/howto-configure-layered-network.md#configure-coredns) service running on child network level, upgrade to Ubuntu 22.04 and reinstall K3S.

## Connector for OPC UA

- Azure Device Registry asset definitions let you use numbers in the attribute section while OPC supervisor expects only strings.

- When you add a new asset with a new asset endpoint profile to the OPC UA broker and trigger a reconfiguration, the deployment of the `opc.tcp` pods changes to accommodate the new secret mounts for username and password. If the new mount fails for some reason, the pod does not restart and therefore the old flow for the correctly configured assets stops as well.

- The subject name and application URI must exactly match the provided certificate. Because there's no cross-validation, any errors could cause the OPC UA servers to reject the application certificate.  

- Providing a new invalid OPC UA application instance certificate after a successful installation of AIO can lead to connection errors. To resolve the issue, delete your Azure IoT Operations instances and restart the installation.

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

- Dataflow custom resources created in your cluster aren't visible in the operations experience UI. This is expected because [managing Azure IoT Operations components using Kubernetes is in preview](../deploy-iot-ops/howto-manage-update-uninstall.md#preview-manage-components-using-kubernetes-deployment-manifests), and synchronizing resources from the edge to the cloud isn't currently supported.

- X.509 authentication for custom Kafka endpoints isn't supported yet.

- Deserializing and validating messages using a schema is not supported yet. Specifying a schema in the source configuration only allows the operations experience portal to display the list of data points, but the data points are not validated against the schema.

<!-- TODO: double check -->
- Creating an X.509 secret in the operations experience portal results in a secret with incorrectly encoded data. To work around this issue, create the [multi-line secrets through Azure Key Vault](/azure/key-vault/secrets/multiline-secrets), then select it from the list of secrets in the operations experience portal.

- When connecting multiple IoT Operations instances to the same Event Grid MQTT namespace, connection failures may occur due to client ID conflicts. Client IDs are currently derived from dataflow resource names, and when using Infrastructure as Code (IaC) patterns for deployment, the generated client IDs may be identical. As a temporary workaround, add randomness to the dataflow names in your deployment templates.

- When network connection is disrupted, Dataflows may encounter errors sending messages due to a mismatched producer ID. If you experience this issue, restart your Dataflows pods.

- When using control characters in Kafka headers, you might encounter disconnections. Control characters in Kafka headers such as `0x01`, `0x02`, `0x03`, `0x04` are UTF-8 compliant but the IoT Operations MQTT broker rejects them. This issue happens during the data flow process when Kafka headers are converted to MQTT properties using a UTF-8 parser. Packets with control characters might be treated as invalid and rejected by the broker and lead to data flow failures.
