---
title: "Known issues: Azure IoT Operations"
description: Known issues for the MQTT broker, Layered Network Management (preview), connector for OPC UA, OPC PLC simulator, data flows, and operations experience web UI.
author: dominicbetts
ms.author: dobett
ms.topic: troubleshooting-known-issue
ms.date: 08/14/2025
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

MQTT broker resources created in your cluster using Kubernetes aren't visible in the Azure portal. This result is expected because [managing Azure IoT Operations components using Kubernetes is in preview](../deploy-iot-ops/howto-manage-update-uninstall.md#manage-components-using-kubernetes-deployment-manifests-preview), and synchronizing resources from the edge to the cloud isn't currently supported.

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

### An OPC UA server modeled as a device can only have one inbound endpoint of type "Microsoft.OpcUa"

---

Issue ID: 2411

---

`2025-07-24T13:29:30.280Z aio-opc-supervisor-85b8c78df5-26tn5 - Maintaining the new asset test-opcua-asset | - | 1 is skipped because the endpoint profile test-opcua.opcplc-e2e-anon-000000 is not present`

---

When you create an OPC UA device, you can only have one inbound endpoint of type `Microsoft.OpcUa`. Currently, any other endpoints aren't used.

Workaround: Create multiple devices with a single endpoint each if you want to use namespace assets.

An OPC UA namespaced asset can only have a single dataset. Currently, any other datasets aren't used.

Workaround: Create multiple namespace assets each with a single dataset.



### Data spike every 2.5 hours with some OPC UA simulators

---

Issue ID: 6513

---

Log signature: Increased message volume every 2.5 hours

---

Data values spike every 2.5 hours when using particular OPC UA simulators causing CPU and memory spikes. This issue isn't seen with OPC PLC simulator used in the quickstarts. No data is lost, but you can see an increase in the volume of data published from the server to the MQTT broker.

## Connector for media and connector for ONVIF issues

This section lists current known issues for the connector for media and the connector for ONVIF.

### AssetType CRD removal process doesn't complete

---

Issue ID: 6065

---

Log signature: `"Error HelmUninstallUnknown: Helm encountered an error while attempting to uninstall the release aio-118117837-connectors in the namespace azure-iot-operations. (caused by: Unknown: 1 error occurred: * timed out waiting for the condition"`

---

Sometimes, when you attempt to uninstall Azure IoT Operations from the cluster, the system reaches a state where CRD removal job is stuck in pending state, which blocks the cleanup of Azure IoT Operations.

To work around this issue, complete the following steps to manually delete the CRD and finish the uninstall:

1. Delete the AssetType CRD manually: `kubectl delete crd assettypes.opcuabroker.iotoperations.azure.com --ignore-not-found=true`

1. Delete the job definition: `kubectl delete job aio-opc-delete-crds-job-<version> -n azure-iot-operations`

1. Find the Helm release for the connectors, it's the one with `-connectors` suffix: `helm ls -a -n azure-iot-operations`

1. Uninstall Helm release without running the hook: `helm uninstall aio-<id>-connectors -n azure-iot-operations --no-hooks`

### Media and ONVIF devices with an underscore character in the endpoint name are ignored

---

Issue ID: 5712

---

Log signature: N/A

---

If you create a media or ONVIF device with an endpoint name that contains an underscore ("_") character, the connector for media ignores the device.

To work around this issue, use a hyphen ("-") instead of an underscore in the endpoint name.

### Media connector doesn't use the path in destination configuration

---

Issue ID: 6797

---

Log signature: N/A

---

Media assets with a task type of "snapshot-to-fs" or "clip-to-fs" don't honor the path in the destination configuration. Instead, they use the "Additional configuration" path field.

### Media connector ignores MQTT topic setting in asset

---

Issue ID: 6780

---

Log signature: N/A

---

The media connector ignores the MQTT destination topic setting in the asset. Instead, it uses the default topic: `/azure-iot-operations/data/<asset-name>/snapshot-to-mqtt`.

### Media connector inbound endpoint addresses aren't fully validated

---

Issue ID: 2679

---

Log signature: N/A

---

In the public preview release, the media connector accepts device inbound endpoint addresses with the following schemes: `async`, `cache`, `concat`, `concatf`, `crypto`, `data`, `fd`, `ffrtmpcrypt`, `ffrtmphttp`, `file`, `ftp`, `gopher`, `gophers`, `hls`, `http`, `httpproxy`, `https`, `mmsh`, `mmst`, `pipe`, `rtmp`, `rtmpe`, `rtmps`, `rtmpt`, `rtmpte`, `rtmpts`, `rtp`, `srtp`, `subfile`, `tcp`, `tls`, `udp`, `udplite`, `unix`, `ipfx`, `ipns`.

This enables input data from multiple source types. However, because the output configuration is based on the `streamConfiguration`, the possibilities for using data from these sources are limited.

### Secret sync conflict

---

Issue ID: 0606

---

Log signature: N/A

---

When using secret sync, ensure that secret names are globally unique. If a local secret with the same name exists, connectors might fail to retrieve the intended secret.

## Data flows issues

This section lists current known issues for data flows.

### Data flow resources aren't visible in the operations experience web UI

---

Issue ID: 8724

---

Log signature: N/A

---

Data flow custom resources created in your cluster using Kubernetes aren't visible in the operations experience web UI. This result is expected because [managing Azure IoT Operations components using Kubernetes is in preview](../deploy-iot-ops/howto-manage-update-uninstall.md#manage-components-using-kubernetes-deployment-manifests-preview), and synchronizing resources from the edge to the cloud isn't currently supported.

There's currently no workaround for this issue.

### A data flow profile can't exceed 70 data flows

---

Issue ID: 0313

---

Log signature:

`exec /bin/main: argument list too long`

---

If you create more than 70 data flows for a single data flow profile, deployments fail with the error `exec /bin/main: argument list too long`.

To work around this issue, create multiple data flow profiles and distribute the data flows across them. Don't exceed 70 data flows per profile.

### The request persistence flag is not set for MQTT sessions created for data flow graphs (WASM)

---

Issue ID: 6415

---

Log signature: N/A

---

When you create a data flow graph using the WASM, the MQTT session doesn't have the request persistence flag set. 

To work around this issue, set MQTT broker **Retained messages** mode to `All`. For more information, see [Configure MQTT broker persistence](../manage-mqtt-broker/howto-broker-persistence.md).

### Anonymous authentication fails to pull data flow graph definitions with incorrect media type

---

Issue ID: 0623

---

Log signature: N/A

---

When using anonymous authentication for registry endpoints, pulling data flow graph definitions (YAML files) fails unless the uploaded graph YAML media type is set specifically to `application/vnd.wasm.config.v1+json`.

To work around this issue, ensure that when you upload data flow graph definitions to your container registry, you set the correct media type. For more information about graph definitions, see [Configure WebAssembly graph definitions](../connect-to-cloud/howto-configure-wasm-graph-definitions.md). For example, when using the `oras` CLI tool to push the graph YAML file, use the following command:

```bash
oras push --config config.json:application/vnd.wasm.config.v1+json <registry>/<repository>:<tag> graph.yaml:application/vnd.wasm.content.layer.v1+wasm
```

And the artifact manifest should look like this:

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.wasm.config.v1+json",
    "digest": "sha256:44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a",
    "size": 2
  },
  "layers": [
    {
      "mediaType": "application/vnd.wasm.content.layer.v1+wasm",
      "digest": "sha256:cfa3ece7317a0c2598165bd67a9241bb6a2f48706023d0983078f0c2a8b5b8c0",
      "size": 556,
      "annotations": {
        "org.opencontainers.image.title": "graph.yaml"
      }
    }
  ]
}
```

### Data flow graphs only support specific endpoint types

---

Issue ID: 5693

---

Log signature: N/A

---

Data flow graphs (WASM) currently only support MQTT, Kafka, and OpenTelemetry (OTel) data flow endpoints. OpenTelemetry endpoints can only be used as destinations in data flow graphs. Other endpoint types like Data Lake, Microsoft Fabric OneLake, Azure Data Explorer, and Local Storage are not supported for data flow graphs.

To work around this issue, use one of the supported endpoint types:
- [MQTT endpoints](../connect-to-cloud/howto-configure-mqtt-endpoint.md) for bi-directional messaging with MQTT brokers
- [Kafka endpoints](../connect-to-cloud/howto-configure-kafka-endpoint.md) for bi-directional messaging with Kafka brokers, including Azure Event Hubs
- [OpenTelemetry endpoints](../connect-to-cloud/howto-configure-opentelemetry-endpoint.md) for sending metrics and logs to observability platforms (destination only)

For more information about data flow graphs, see [Use WebAssembly (WASM) with data flow graphs](../connect-to-cloud/howto-dataflow-graph-wasm.md).

### Complex data might be flattened when enriching data in a data flow

---

Issue ID: 7385

---

Log signature: N/A

---

When enriching data using complex object DSS reference data, the output might be moved to the root level instead of preserving the original structure.

For example, if you have a complex object with properties like:

```json
{
  "complex_property_1": {
      "field1": 12,
      "field2": 13 
  },
  "complex_property_2": {
     "field2": 24
  }
}
```

The output might look like:

```json
{
  "property_1": 2,
  "property_2": 3,
  "field1": 12,
  "field2": 24,
}
```

The complex properties are flattened to the root, and the original structure is lost. If fields with the same name exist in the complex objects or the root, the values might overwrite the root values. In the example, `field2` from `complex_property_2` overwrites the `field2` from `complex_property_1`.