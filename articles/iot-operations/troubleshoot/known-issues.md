---
title: "Known issues: Azure IoT Operations"
description: Known issues for the MQTT broker, Layered Network Management (preview), connector for OPC UA, OPC PLC simulator, data flows, and operations experience web UI.
author: dominicbetts
ms.author: dobett
ms.topic: troubleshooting-known-issue
ms.date: 03/27/2025
---

# Known issues: Azure IoT Operations

This article lists the current known issues for Azure IoT Operations.

## Deploy, update, and uninstall issues

This section lists current known issues that might occur when you deploy, update, or uninstall Azure IoT Operations.

### Unable to retrieve some image pull secrets

---

Issue ID: 8959

---

Log signature: `"Unable to retrieve some image pull secrets (regcred)"`

---

During and after deploying Azure IoT Operations, you might see warnings about `Unable to retrieve some image pull secrets (regcred)` in the logs and Kubernetes events. These warnings are expected and don't affect the deployment and use of Azure IoT Operations.

No workaround needed.

### Error creating custom resources

---

Issue ID: 9091

---

Log signature: `"code": "ExtensionOperationFailed", "message": "The extension operation failed with the following error:  Error occurred while creating custom resources needed by system extensions"`

---

If your deployment fails with the message `Error occurred while creating custom resources needed by system extensions`, you have encountered a known sporadic failure.

To work around this issue, use the `az iot ops delete` command with the `--include-deps` flag to delete Azure IoT Operations from your cluster. When Azure IoT Operations and its dependencies are deleted from your cluster, retry the deployment.

### Codespaces restart error

---

Issue ID: 9941

---

Log signature: `"This codespace is currently running in recovery mode due to a configuration error."`

---

If you deploy Azure IoT Operations in GitHub Codespaces, shutting down and restarting the Codespace causes a `This codespace is currently running in recovery mode due to a configuration error` issue.

Currently, there's no workaround for the issue. If you need a cluster that supports shutting down and restarting, choose one of the options in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md).

### Helm package enters a stuck state during update

---

Issue ID: 0000

---

Log signature: `"Message: Update failed for this resource, as there is a conflicting operation in progress. Please try after sometime."`

---

When you update Azure IoT Operations, the Helm package might enter a stuck state, preventing any helm install or upgrade operations from proceeding. This results in the error message `Update failed for this resource, as there is a conflicting operation in progress. Please try after sometime.`, which blocks further updates.

To work around this issue, follow these steps:

1. Identify the stuck components by running the following command:

   ```sh
   helm list -n azure-iot-operations --pending
   ```

    In the output, look for the release name of components, `<component-release-name>`, which have a status of `pending-upgrade` or `pending-install`. This issue might affect the following components:

      - `-adr`
      - `-akri`
      - `-connectors`
      - `-mqttbroker`
      - `-dataflows`
      - `-schemaregistry`

1. Using the `<component-release-name>` from step 1, retrieve the revision history of the stuck release. You need to run the following command for **each component from step 1**. For example, if components `-adr` and `-mqttbroker` are stuck, you run the following command twice, once for each component:

   ```sh
   helm history <component-release-name> -n azure-iot-operations
   ```

    Make sure to replace `<component-release-name>` with the release name of the components that are stuck. In the output, look for the last revision that has a status of `Deployed` or `Superseded` and note the revision number.

1. Using the **revision number from step 2**, roll back the Helm release to the last successful revision. You need to run the following command for each component, `<component-release-name>`, and its revision number, `<revision-number>`, from steps 1 and 2.

    ```sh
    helm rollback <component-release-name> <revision-number> -n azure-iot-operations
    ```
  
    > [!IMPORTANT]
    > You need to repeat steps 2 and 3 for each component that is stuck. You reattempt the upgrade only after all components are rolled back to the last successful revision.

1. After the rollback of each component is complete, reattempt the upgrade using the following command:

   ```sh
   az iot ops update
   ```

    If you receive a message stating `Nothing to upgrade or upgrade complete`, force the upgrade by appending:

    ```sh
    az iot ops upgrade ....... --release-train stable --version 1.0.15 
    ```

## MQTT broker issues

This section lists current known issues for the MQTT broker.

### MQTT broker high memory usage

---

Issue ID: 3781

---

Log signature: `"failed to connect trace upload task to diagnostics service endpoint"`

---

Sometimes, the MQTT broker's memory usage can become unexpectedly high due to internal certificate rotation retries. This scenario results in errors such as `failed to connect trace upload task to diagnostics service endpoint` in the logs.

To work around this issue, restart each broker pod one by one (including the diagnostic service, probe, and authentication service), making sure each backend recovers before moving on. Alternatively, [redeploy Azure IoT Operations with longer internal certificate duration](../manage-mqtt-broker/howto-encrypt-internal-traffic.md#internal-certificates) such as `1500h` or more. For example:

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

### MQTT broker resources aren't visible in Azure portal

---

Issue ID: 0000

---

Log signature: N/A

---

MQTT broker resources created in your cluster using Kubernetes aren't visible in the Azure portal. This result is expected because [managing Azure IoT Operations components using Kubernetes is in preview](../deploy-iot-ops/howto-manage-update-uninstall.md#preview-manage-components-using-kubernetes-deployment-manifests), and synchronizing resources from the edge to the cloud isn't currently supported.

There's currently no workaround for this issue.

### Probe event errors

---

Issue ID: 1567

---

Log signature: `"Path verification failed for probe event with operation type 'Publish'"`

---

Don't publish or subscribe to diagnostic probe topics that start with `azedge/dmqtt/selftest`. Publishing or subscribing to these topics might affect the probe or self-test checks resulting in invalid results. Invalid results might be listed in diagnostic probe logs, metrics, or dashboards. For example, you might see the message `Path verification failed for probe event with operation type 'Publish'` in the diagnostics-probe logs.

There's currently no workaround for this issue.

## Azure IoT Layered Network Management (preview) issues

This section lists current known issues for  Azure IoT Layered Network Management.

### Layered Network Management service doesn't get an IP address

---

Issue ID: 7864

---

Log signature: N/A

---

The Layered Network Management service doesn't get an IP address when it runs on K3S on an Ubuntu host.

To work around this issue, you reinstall K3S without the _traefik ingress controller_:

```bash
curl -sfL https://get.k3s.io | sh -s - --disable=traefik --write-kubeconfig-mode 644
```

To learn more, see [Networking | K3s](https://docs.k3s.io/networking#traefik-ingress-controller).

### CoreDNS service doesn't resolve DNS queries correctly

---

Issue ID: 7955

---

Log signature: N/A

---

DNS queries don't resolve to the expected IP address while using the [CoreDNS](../manage-layered-network/howto-configure-layered-network.md#configure-coredns) service running on the child network level.

To work around this issue, upgrade to Ubuntu 22.04 and reinstall K3S.

## Connector for OPC UA issues

This section lists current known issues for the connector for OPC UA.

### Connector pod doesn't restart after configuration change

---

Issue ID: 7518

---

Log signature: N/A

---

When you add a new asset with a new asset endpoint profile to the OPC UA broker and trigger a reconfiguration, the deployment of the `opc.tcp` pods changes to accommodate the new secret mounts for username and password. If the new mount fails for some reason, the pod does not restart and therefore the old flow for the correctly configured assets stops as well.

### OPC UA servers reject application certificate

---

Issue ID: 7679

---

Log signature: N/A

---

The subject name and application URI must exactly match the provided certificate. Because there's no cross-validation, any errors could cause the OPC UA servers to reject the application certificate.  

### Connection errors after adding a new certificate

---

Issue ID: 8446

---

Log signature: N/A

---

Providing a new invalid OPC UA application instance certificate after a successful installation of AIO can lead to connection errors. To resolve the issue, delete your Azure IoT Operations instances and restart the installation.

## Connector for media and connector for ONVIF issues

This section lists current known issues for the connector for media and the connector for ONVIF.

### Cleanup of unused media-connector resources

---

Issue ID: 2142

---

Log signature: N/A

---

If you delete all the `Microsoft.Media` asset endpoint profiles the deployment for media processing is not deleted.

To work around this issue, run the following command using the full name of your media connector deployment:

```bash
kubectl delete deployment aio-opc-media-... -n azure-iot-operations
```

### Cleanup of unused onvif-connector resources

---

Issue ID: 3322

---

Log signature: N/A

---

If you delete all the `Microsoft.Onvif` asset endpoint profiles the deployment for media processing is not deleted.

To work around this issue, run the following command using the full name of your ONVIF connector deployment:

```bash
kubectl delete deployment aio-opc-onvif-... -n azure-iot-operations
```

### AssetType CRD removal process doesn't complete

---

Issue ID: 6065

---

Log signature: `"Error HelmUninstallUnknown: Helm encountered an error while attempting to uninstall the release aio-118117837-connectors in the namespace azure-iot-operations. (caused by: Unknown: 1 error occurred: * timed out waiting for the condition"`

---

Sometimes, when you attempt to uninstall Azure IoT Operations from the cluster, the system can get to a state where CRD removal job is stuck in pending state and that blocks cleanup of Azure IoT Operations.

To work around this issue, you need to manually delete the CRD and finish the uninstall. To do this, complete the following steps:

1. Delete the AssetType CRD manually: `kubectl delete crd assettypes.opcuabroker.iotoperations.azure.com --ignore-not-found=true`

1. Delete the job definition: `kubectl delete job aio-opc-delete-crds-job-<version> -n azure-iot-operations`

1. Find the Helm release for the connectors, it's the one with `-connectors` suffix: `helm ls -a -n azure-iot-operations`

1. Uninstall Helm release without running the hook: `helm uninstall aio-<id>-connectors -n azure-iot-operations --no-hooks`

## OPC PLC simulator issues

This section lists current known issues for the OPC PLC simulator.

### The simulator doesn't send data to the MQTT broker after you create an asset endpoint

---

Issue ID: 8616

---

Log signature: N/A

---

The OPC PLC simulator doesn't send data to the MQTT broker after you create an asset endpoint for the OPC PLC simulator.

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

### The simulator doesn't send data to the MQTT broker after you create an asset

---

Issue ID: 0000

---

Log signature: N/A

---

The OPC PLC simulator doesn't send data to the MQTT broker after you create a new asset.

To work around this issue,  restart the OPC PLC simulator pod. The pod name looks like `aio-opc-opc.tcp-1-f95d76c54-w9v9c`. To restart the pod, use the `k9s` tool to kill the pod, or run the following command:

```bash
kubectl delete pod aio-opc-opc.tcp-1-f95d76c54-w9v9c -n azure-iot-operations
```

## Data flows issues

This section lists current known issues for data flows.

### Data flow resources aren't visible in the operations experience web UI

---

Issue ID: 8724

---

Log signature: N/A

---

Data flow custom resources created in your cluster using Kubernetes aren't visible in the operations experience web UI. This result is expected because [managing Azure IoT Operations components using Kubernetes is in preview](../deploy-iot-ops/howto-manage-update-uninstall.md#preview-manage-components-using-kubernetes-deployment-manifests), and synchronizing resources from the edge to the cloud isn't currently supported.

There's currently no workaround for this issue.

### Unable to configure X.509 authentication for custom Kafka endpoints

---

Issue ID: 8750

---

Log signature: N/A

---

X.509 authentication for custom Kafka endpoints isn't currently supported.

### Data points aren't validated against a schema

---

Issue ID: 8794

---

Log signature: N/A

---

When you create a data flow, you can specify a schema in the source configuration. However, deserializing and validating messages using a schema isn't supported yet. Specifying a schema in the source configuration only allows the operations experience to display the list of data points, but the data points aren't validated against the schema.

### X.509 secret incorrectly encoded in operations experience web UI

---

Issue ID: 8841

---

Log signature: N/A

---

<!-- TODO: double check -->
When you create an X.509 secret in the operations experience, the secret is created with incorrectly encoded data.

To work around this issue, create the [multi-line secrets through Azure Key Vault](/azure/key-vault/secrets/multiline-secrets), then select it from the list of secrets in the operations experience.

### Connection failures with Azure Event Grid

---

Issue ID: 8891

---

Log signature: N/A

---

When you connect multiple IoT Operations instances to the same Event Grid MQTT namespace, connection failures might occur due to client ID conflicts. Client IDs are currently derived from data flow resource names, and when using infrastructure as code patterns for deployment, the generated client IDs might be identical.

To work around this issue, add randomness to the data flow names in your deployment templates.

### Data flow errors after a network disruption

---

Issue ID: 8953

---

Log signature: N/A

---

When the network connection is disrupted, data flows might encounter errors sending messages because of a mismatched producer ID.

To work around this issue, restart your data flow pods.

### Disconnections from Kafka endpoints

---

Issue ID: 9289

---

Log signature: N/A

---

If you use control characters in Kafka headers, you might encounter disconnections. Control characters in Kafka headers such as `0x01`, `0x02`, `0x03`, `0x04` are UTF-8 compliant but the IoT Operations MQTT broker rejects them. This issue happens during the data flow process when Kafka headers are converted to MQTT properties using a UTF-8 parser. Packets with control characters might be treated as invalid and rejected by the broker and lead to data flow failures.

To work around this issue, avoid using control characters in Kafka headers.

### Data flow deployment doesn't complete

---

Issue ID: 9411

---

Log signature:

`"Dataflow pod had error: Bad pod condition: Pod 'aio-dataflow-operator-0' container 'aio-dataflow-operator' stuck in a bad state due to 'CrashLoopBackOff'"`

`"Failed to create webhook cert resources: Failed to update ApiError: Internal error occurred: failed calling webhook "webhook.cert-manager.io" [...]"`

---

When you create a new data flow, it might not finish deployment. The cause is that the `cert-manager` wasn't ready or running.

To work around this issue, use the following steps to manually delete the data flow operator pod to clear the crash status:

1. Run `kubectl get pods -n azure-iot-operations`.
   In the output, Verify _aio-dataflow-operator-0_ is only data flow operator pod running.

1. Run `kubectl logs --namespace azure-iot-operations aio-dataflow-operator-0` to check the logs for the data flow operator pod.

   In the output, check for the final log entry:

   `Dataflow pod had error: Bad pod condition: Pod 'aio-dataflow-operator-0' container 'aio-dataflow-operator' stuck in a bad state due to 'CrashLoopBackOff'`

1. Run the _kubectl logs_ command again with the `--previous` option.

   `kubectl logs --namespace azure-iot-operations --previous aio-dataflow-operator-0`

   In the output, check for the final log entry:

   `Failed to create webhook cert resources: Failed to update ApiError: Internal error occurred: failed calling webhook "webhook.cert-manager.io" [...]`.

   If you see both log entries from the two _kubectl log_ commands, the cert-manager wasn't ready or running.

1. Run `kubectl delete pod aio-dataflow-operator-0 -n azure-iot-operations` to delete the data flow operator pod. Deleting the pod clears the crash status and restarts the pod.

1. Wait for the operator pod to restart and deploy the data flow.

### Data flows error metrics

---

Issue ID: 2382

---

Log signature: N/A

---

Data flows marks message retries and reconnects as errors, and as a result data flows may look unhealthy. This behavior is only seen in previous versions of data flows. Review the logs to determine if the data flow is healthy.
