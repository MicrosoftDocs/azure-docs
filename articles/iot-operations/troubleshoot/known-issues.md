---
title: "Known issues: Azure IoT Operations"
description: Known issues for the MQTT broker, Layered Network Management (preview), connector for OPC UA, OPC PLC simulator, data flows, and operations experience web UI.
author: dominicbetts
ms.author: dobett
ms.topic: troubleshooting-known-issue
ms.date: 05/22/2025
---

# Known issues: Azure IoT Operations

This article lists the current known issues you might encounter when using Azure IoT Operations. The guidance helps you identify these issues and provides workarounds where available.

For general troubleshooting guidance, see [Troubleshoot Azure IoT Operations](troubleshoot.md).

## Deploy, update, and uninstall issues

This section lists current known issues that might occur when you deploy, update, or uninstall Azure IoT Operations.

### Error creating custom resources

---

Issue ID: 9091

---

Log signature: `"code": "ExtensionOperationFailed", "message": "The extension operation failed with the following error:  Error occurred while creating custom resources needed by system extensions"`

---

The message `Error occurred while creating custom resources needed by system extensions` indicates that your deployment failed due to a known sporadic issue.

To work around this issue, use the `az iot ops delete` command with the `--include-deps` flag to delete Azure IoT Operations from your cluster. When Azure IoT Operations and its dependencies are deleted from your cluster, retry the deployment.

### Codespaces restart error

---

Issue ID: 9941

---

Log signature: `"This codespace is currently running in recovery mode due to a configuration error."`

---

If you deploy Azure IoT Operations in GitHub Codespaces, shutting down and restarting the Codespace causes a `This codespace is currently running in recovery mode due to a configuration error` issue.

There's no workaround for this issue. If you need a cluster that supports shutting down and restarting, select one of the options in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md).

## MQTT broker issues

This section lists current known issues for the MQTT broker.

### MQTT broker resources aren't visible in the Azure portal

---

Issue ID: 4257

---

Log signature: N/A

---

MQTT broker resources created in your cluster using Kubernetes aren't visible in the Azure portal. This result is expected because [managing Azure IoT Operations components using Kubernetes is in preview](../deploy-iot-ops/howto-manage-update-uninstall.md#preview-manage-components-using-kubernetes-deployment-manifests), and synchronizing resources from the edge to the cloud isn't currently supported.

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

When you add a new asset with a new asset endpoint profile to the OPC UA broker and trigger a reconfiguration, the deployment of the `opc.tcp` pods changes to accommodate the new secret mounts for username and password. If the new mount fails for some reason, the pod doesn't restart and therefore the old flow for the correctly configured assets stops as well.

### Data spike every 2.5 hours with some OPC UA simulators

---

Issue ID: 6513

---

Log signature: Increased message volume every 2.5 hours

---

Data values spike every 2.5 hours when using particular OPC UA simulators causing CPU and memory spikes. This issue isn't seen with OPC PLC simulator used in the quickstarts. No data is lost, but you can see an increase in the volume of data published from the server to the MQTT broker.

### No message schema generated if selected nodes in a dataset reference the same complex data type definition

---

Issue ID: 7369

---

Log signature: `An item with the same key has already been added. Key: <element name of the data type>`

---

No message schema is generated if selected nodes in a dataset reference the same complex data type definition (a UDT of type struct or enum).

If you select data points (node IDs) for a dataset that share non-OPC UA namespace complex type definitions (struct or enum), then the JSON schema isn't generated. The default open schema is shown when you create a data flow instead. For example, if the data set contains three values of a data type, then whether it works or not is shown in the following table. You can substitute `int` for any OPC UA built in type or primitive type such as `string`, `double`, `float`, or `long`:

| Type of Value 1 | Type of Value 2 | Type of Value 3 | Successfully generates schema |
|-----------------|-----------------|-----------------|-----------------|
| `int` | `int` | `int` | Yes |
| `int` | `int` | `int` | Yes |
| `int` | `int` | `struct A` | Yes |
| `int` | `enum A` | `struct A` | Yes |
| `enum A` | `enum B` | `enum C` | Yes |
| `struct A` | `struct B` | `struct C` | Yes |
| `int` | `struct A` | `struct A` | No |
| `int` | `enum A` | `enum A` | No |

To work around this issue, you can either:

- Split the dataset across two or more assets.
- Manually upload a schema.
- Use the default nonschema experience in the data flow designer.

## Connector for media and connector for ONVIF issues

This section lists current known issues for the connector for media and the connector for ONVIF.

### AssetType CRD removal process doesn't complete

---

Issue ID: 6065

---

Log signature: `"Error HelmUninstallUnknown: Helm encountered an error while attempting to uninstall the release aio-118117837-connectors in the namespace azure-iot-operations. (caused by: Unknown: 1 error occurred: * timed out waiting for the condition"`

---

Sometimes, when you attempt to uninstall Azure IoT Operations from the cluster, the system can get to a state where CRD removal job is stuck in pending state and that blocks the cleanup of Azure IoT Operations.

To work around this issue, complete the following steps to manually delete the CRD and finish the uninstall:

1. Delete the AssetType CRD manually: `kubectl delete crd assettypes.opcuabroker.iotoperations.azure.com --ignore-not-found=true`

1. Delete the job definition: `kubectl delete job aio-opc-delete-crds-job-<version> -n azure-iot-operations`

1. Find the Helm release for the connectors, it's the one with `-connectors` suffix: `helm ls -a -n azure-iot-operations`

1. Uninstall Helm release without running the hook: `helm uninstall aio-<id>-connectors -n azure-iot-operations --no-hooks`

## Asset discovery with Akri services issues

This section lists current known issues for asset discovery with Akri services.

### Asset discovery doesn't work for one hour after upgrade

---

Issue ID: 0407

---

Log signature: N/A

---

When you upgrade the Akri services, you might experience some loss of messages and assets for an hour after the upgrade.

To workaround this issue, wait for an hour after the upgrade and run the asset detection scenario again.

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

### Connection failures with Azure Event Grid

---

Issue ID: 8891

---

Log signature: N/A

---

When you connect multiple IoT Operations instances to the same Event Grid MQTT namespace, connection failures might occur due to client ID conflicts. Client IDs are currently derived from data flow resource names, and when using infrastructure as code patterns for deployment, the generated client IDs might be identical.

To work around this issue, add randomness to the data flow names in your deployment templates.

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
Issue ID:2382
   If you see both log entries from the two _kubectl log_ commands, the cert-manager wasn't ready or running.

1. Run `kubectl delete pod aio-dataflow-operator-0 -n azure-iot-operations` to delete the data flow operator pod. Deleting the pod clears the crash status and restarts the pod.

1. Wait for the operator pod to restart and deploy the data flow.

### Data flows error metrics

---

Issue ID: 2382

---

Log signature: N/A

---

Data flows marks message retries and reconnects as errors, and as a result data flows might look unhealthy. This behavior is only seen in previous versions of data flows. Review the logs to determine if the data flow is healthy.
