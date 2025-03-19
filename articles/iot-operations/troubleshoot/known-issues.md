---
title: "Known issues: Azure IoT Operations"
description: Known issues for the MQTT broker, Layered Network Management (preview), connector for OPC UA, OPC PLC simulator, data flows, and operations experience web UI.
author: dominicbetts
ms.author: dobett
ms.topic: troubleshooting-known-issue
ms.custom:
  - ignite-2023
ms.date: 03/19/2025
---

# Known issues: Azure IoT Operations

This article lists the known issues for Azure IoT Operations.

## Deploy and uninstall issues

- During and after deploying Azure IoT Operations, you might see warnings about `Unable to retrieve some image pull secrets (regcred)` in the logs and Kubernetes events. These warnings are expected and don't affect the deployment and use of Azure IoT Operations.

- If your deployment fails with the message `Error occurred while creating custom resources needed by system extensions`, you have encountered a known sporadic failure that will be fixed in a future release. As a workaround, use the [az iot ops delete](/cli/azure/iot/ops#az-iot-ops-delete) command with the `--include-deps` flag to delete Azure IoT Operations from your cluster. When Azure IoT Operations and its dependencies are deleted from your cluster, retry the deployment.

- If you deploy Azure IoT Operations in GitHub Codespaces, shutting down and restarting the Codespace causes a `This codespace is currently running in recovery mode due to a configuration error.` issue. Currently, there's no workaround for the issue. If you need a cluster that supports shutting down and restarting, choose one of the options in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md).

## MQTT broker

- Sometimes, the MQTT broker's memory usage can become unexpectedly high due to internal certificate rotation retries. This results in errors like 'failed to connect trace upload task to diagnostics service endpoint' in the logs. The issue is expected to be addressed in the next patch update. In the meantime, as a workaround, restart each broker pod one by one (including the diagnostic service, probe, and authentication service), making sure each backend recovers before moving on. Alternatively, [redeploy Azure IoT Operations with higher internal certificate duration](../manage-mqtt-broker/howto-encrypt-internal-traffic.md#internal-certificates), `1500h` or more. 

  ```json
  {
    "advanced": {
      "internalCerts": {
        "duration": "1500h",
        "renewBefore": "1h",
        "privateKey": {
          "algorithm": "Ec256",
          "rotationPolicy": "Always"
        }
      }
    }
  }
  ```

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

## Data flows

- Data flow custom resources created in your cluster aren't visible in the operations experience UI. This is expected because [managing Azure IoT Operations components using Kubernetes is in preview](../deploy-iot-ops/howto-manage-update-uninstall.md#preview-manage-components-using-kubernetes-deployment-manifests), and synchronizing resources from the edge to the cloud isn't currently supported.

- X.509 authentication for custom Kafka endpoints isn't supported yet.

- Deserializing and validating messages using a schema isn't supported yet. Specifying a schema in the source configuration only allows the operations experience portal to display the list of data points, but the data points aren't validated against the schema.

<!-- TODO: double check -->
- Creating an X.509 secret in the operations experience portal results in a secret with incorrectly encoded data. To work around this issue, create the [multi-line secrets through Azure Key Vault](/azure/key-vault/secrets/multiline-secrets), then select it from the list of secrets in the operations experience portal.

- When connecting multiple IoT Operations instances to the same Event Grid MQTT namespace, connection failures may occur due to client ID conflicts. Client IDs are currently derived from data flow resource names, and when using Infrastructure as Code (IaC) patterns for deployment, the generated client IDs may be identical. As a temporary workaround, add randomness to the data flow names in your deployment templates.

- When network connection is disrupted, data flows may encounter errors sending messages due to a mismatched producer ID. If you experience this issue, restart your data flow pods.

- When using control characters in Kafka headers, you might encounter disconnections. Control characters in Kafka headers such as `0x01`, `0x02`, `0x03`, `0x04` are UTF-8 compliant but the IoT Operations MQTT broker rejects them. This issue happens during the data flow process when Kafka headers are converted to MQTT properties using a UTF-8 parser. Packets with control characters might be treated as invalid and rejected by the broker and lead to data flow failures.

- When you create a new data flow, it might not finish deployment. The cause is cert-manager wasn't ready or running. The current resolution is to manually delete the data flow operator pod to clear the crash status. Use the following steps to resolve the issue:
  1. Run `kubectl get pods -n azure-iot-operations`.
     In the output, Verify *aio-dataflow-operator-0* is only data flow operator pod running.
  1. Run `kubectl logs --namespace azure-iot-operations aio-dataflow-operator-0` to check the logs for the data flow operator pod. 
 
     In the output, check for the final log entry:

     `Dataflow pod had error: Bad pod condition: Pod 'aio-dataflow-operator-0' container 'aio-dataflow-operator' stuck in a bad state due to 'CrashLoopBackOff'`
  1. Run the *kubectl logs* command again with the `--previous` option.

     `kubectl logs --namespace azure-iot-operations --previous aio-dataflow-operator-0`

     In the output, check for the final log entry:

     `Failed to create webhook cert resources: Failed to update ApiError: Internal error occurred: failed calling webhook "webhook.cert-manager.io" [...]`.

     If you see both log entries from the two *kubectl log* commands, the cert-manager wasn't ready or running.
  1. Run `kubectl delete pod aio-dataflow-operator-0 -n azure-iot-operations` to delete the data flow operator pod. Deleting the pod clears the crash status and restarts the pod.
  1. Wait for the operator pod to restart and deploy the data flow.

## Helm package enters a stuck state

When you update Azure IoT Operations, the Helm package might enter a stuck state, preventing any helm install or upgrade operations from proceeding. This results in the `operation in progress` error, blocking further upgrades. 

Use the following steps to resolve the issue:

1. Identify the stuck Helm release by running the following command:

   ```sh
   helm list -n azure-iot-operations --pending
   ```
    In the output, look for a release name that contains `<component>` and has a status of `pending-upgrade` or `pending-install`. 

1. Retrieve the revision history of the stuck release. For example, for schema registry you run:

   ```sh
   helm history <schema-registry-release-name> -n azure-iot-operations
   ```

    In the output, look for the last revision that has a status of `Deployed` or `Superseded` and note the revision number.

1. Rollback the Helm release to the last successful revision. For example, for schema registry you run:

    ```sh
    helm rollback <schema-registry-release-name> <revision-number> -n azure-iot-operations
    ```
  
1. After the rollback is complete, reattempt the upgrade using the following command:

   ```sh
   az iot ops update
   ```

    If you receive a message stating `Nothing to upgrade or upgrade complete`, force the upgrade by appending: 

    ```sh
    az iot ops upgrade ....... --release-train stable --version 1.0.15 
    ``` 




