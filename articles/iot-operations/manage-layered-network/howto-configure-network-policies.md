---
title: Configure network policies for Azure IoT Operations
description: Learn which network flows Azure IoT Operations needs so you can configure Kubernetes or Cilium network policies on a default-deny cluster.
author: david-emakenemi
ms.author: demakenemi
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 11/18/2026

#CustomerIntent: As a platform or security engineer, I want to know which network flows Azure IoT Operations needs so that I can restrict cluster traffic with network policies without breaking my deployment.
---

# Configure network policies for Azure IoT Operations

Network policies restrict traffic between pods, services, and internet endpoints to only what a workload needs. Restricting traffic reduces the attack surface if a pod is compromised and makes network traffic easier to monitor.

This article lists the network flows that Azure IoT Operations needs, grouped by component, so you can configure Kubernetes `NetworkPolicy` or `CiliumNetworkPolicy` resources on a cluster that runs Azure IoT Operations.

Network traffic varies with how you configure Azure IoT Operations and your cluster, so there's no single policy that fits every deployment. Use the tables in this article as a starting point, and adjust them for the components, endpoints, and connectors you deploy.

## Prerequisites

- A Kubernetes cluster with a network plugin (CNI) that enforces network policies, such as Cilium or Calico.
- Azure IoT Operations deployed to the cluster. For more information, see [Deployment overview](../deploy-iot-ops/overview-deploy.md).
- Familiarity with Kubernetes [network policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/).
- For the example policies, Cilium installed with support for `CiliumNetworkPolicy` resources.

## Assumptions

This article assumes that your network policies **deny all traffic by default**. It lists the connections that you must allow for Azure IoT Operations to work. Any pod-to-pod, pod-to-service, or outbound connection that isn't listed might be blocked by your policies.

For pod-to-pod traffic, allow egress from the source and ingress to the destination when both are isolated by policy. An egress allow rule alone doesn't allow traffic through a destination's ingress restrictions.

<!-- TODO (Gordon): Confirm the version or versions this guidance applies to. Broker-internal flows might change in future releases. -->

> [!IMPORTANT]
> The pod names in this article are examples and include generated suffixes. Network policies select pods by **label**, not by name. Use `kubectl get pods -n azure-iot-operations --show-labels` to find the labels for the pods in your deployment.

## How Azure IoT Operations traffic is organized

By default, Azure IoT Operations runs in the `azure-iot-operations` namespace, and the Azure Arc agents run in the `azure-arc` namespace. Traffic falls into three groups:

| Traffic | Description | Where it's covered |
|---|---|---|
| Within the `azure-iot-operations` namespace | Components such as data flows, OPC UA, and Akri connectors communicate with the MQTT broker. | [Flows within the namespace](#flows-within-the-azure-iot-operations-namespace) |
| Across namespaces and from the control plane | Azure IoT Operations pods call the Kubernetes API and DNS. The Kubernetes API server calls Azure IoT Operations admission webhooks. MQTT clients in other namespaces connect to the broker. | [Flows across namespaces](#flows-across-namespaces-and-from-the-control-plane) |
| Outbound to external endpoints | Data flows send data to Azure. Connectors reach OPC UA servers and devices. The cluster pulls container images. Azure Arc connects to Azure. | [Outbound flows](#outbound-flows-to-external-endpoints) |

### The MQTT broker service model

Azure IoT Operations components don't connect to individual broker pods. They connect to the broker's frontend service, which is `aio-broker` on port 18883 (MQTT v5) by default.

Only the frontend service needs to be reachable by other pods. The broker's internal services, such as the backend and health manager, must only be reachable by other broker pods.

### Built-in broker network policy

Azure IoT Operations deploys a Kubernetes network policy named `aio-broker-ingress` in the Azure IoT Operations namespace. This policy:

- Selects all MQTT broker pods except the frontend, authentication, webhook, and diagnostics pods.
- Allows ingress to those pods only from other MQTT broker pods, on all ports.

As a result, pods outside the broker, such as Akri or data flow pods, can't reach the broker backend or health manager directly. NetworkPolicy allow rules are additive. If you add your own policies in the `azure-iot-operations` namespace, don't broaden ingress to the protected broker pods, and allow all traffic between MQTT broker pods.

<!-- TODO (Gordon): Confirm the Azure IoT Operations version that first ships aio-broker-ingress, and whether it can be disabled. -->

## Flows within the azure-iot-operations namespace

If your policies allow all traffic within a namespace, you don't need separate rules for these flows. If you restrict traffic within the namespace, allow the following flows.

### MQTT broker

| Source | Destination | Port | Protocol | Notes |
|---|---|---|---|---|
| Azure IoT Operations components (data flow profile pods, OPC UA, Akri, Akri connectors, `aio-edge-registry-0`) | `aio-broker` service (broker frontend) | 18883 | MQTT v5 | Default port. The port is set by your [BrokerListener](../manage-mqtt-broker/howto-configure-brokerlistener.md) configuration. |
| All MQTT broker pods (`aio-broker-*`) | All MQTT broker pods | All | TCP | Broker-internal traffic. Includes frontend to authentication, frontend to backend, and health manager to backend. The ports depend on the broker configuration, so allow all ports. |

The MQTT broker uses the following pods and services:

| Pods | Services |
|---|---|
| `aio-broker-authentication-*`<br>`aio-broker-backend-*`<br>`aio-broker-diagnostics-probe-*`<br>`aio-broker-frontend-*`<br>`aio-broker-health-manager-*`<br>`aio-broker-operator-*`<br>`aio-broker-webhook-*` | `aio-broker` (frontend, port 18883)<br>`aio-broker-authentication`<br>`aio-broker-backend`<br>`aio-broker-frontend-headless`<br>`aio-broker-health-manager`<br>`aio-broker-webhook` (port 8443) |

<!-- TODO (Gordon): Confirm the health manager protocol (the original guidance lists MQTT on port 8883). -->

### Observability

| Source | Destination | Port | Protocol | Notes |
|---|---|---|---|---|
| All pods in `azure-iot-operations` | `aio-observability` service | 4317, 4318 | OpenTelemetry (gRPC or HTTP) | All Azure IoT Operations pods send telemetry to this service. |

<!-- TODO (observability team): Document flows for aio-otel-collector-*, aio-observability-cluster-metrics-agent-*, and aio-observability-operator-*, including any destinations outside the namespace. -->

## Flows across namespaces and from the control plane

| Source | Destination | Port | Protocol | Notes |
|---|---|---|---|---|
| All pods in `azure-iot-operations` | Kubernetes API server | 443 (service) or 6443 (API server) | HTTPS | The API server port depends on your Kubernetes distribution. In Cilium, use the `kube-apiserver` entity. |
| All pods in `azure-iot-operations` | `kube-dns` in `kube-system` | 53 | UDP and TCP | Name resolution. |
| Kubernetes API server | `aio-broker-webhook` | 8443 | HTTPS | Admission webhook for MQTT broker resources. |
| Kubernetes API server | `aio-dataflow-webhook` | 8443 | HTTPS | Admission webhook for data flow resources. |
| Kubernetes API server | `aio-akri-webhook` | 8443 | HTTPS | Admission webhook for Akri resources. |
| MQTT client pods in other namespaces | `aio-broker` service, or the service for a custom BrokerListener | 18883 by default | MQTT | Only if workloads in other namespaces use the broker. The port is set by your [BrokerListener](../manage-mqtt-broker/howto-configure-brokerlistener.md) configuration. |
| All pods in `azure-iot-operations` | HTTP(S) proxy | Proxy port | HTTP or HTTPS | Only if you configured a proxy when you connected the cluster to Azure Arc. |

Azure IoT Operations uses cert-manager only through Kubernetes custom resources, so you don't need a network rule between Azure IoT Operations pods and cert-manager.

<!-- TODO (Gordon): Confirm whether the proxy row applies to all pods or only to pods that make outbound calls. -->

## Outbound flows to external endpoints

Values in angle brackets (`<>`) depend on your configuration. Replace `<region>` with the Azure region of your deployment.

### Data flows

Only the data flow profile pods (for example, `aio-dataflow-<profile>-0`) connect to external endpoints. The `aio-dataflow-operator`, `aio-dataflow-webhook`, and `aio-wasm-graph-controller` pods don't need outbound connectivity.

<!-- TODO (Gordon): Add the pod label that selects only data flow profile pods. -->

| Destination | Example FQDN | Port | Protocol |
|---|---|---|---|
| Azure Event Hubs (Kafka endpoint) | `<namespace>.servicebus.windows.net` | 9093 | Kafka over TLS |
| Other Kafka brokers | `<kafka-broker-host>` | As configured | Kafka |
| Azure Event Grid MQTT broker | `<namespace>.<region>-1.ts.eventgrid.azure.net` | 8883 | MQTT over TLS |
| Azure Data Lake Storage | `<account>.blob.core.windows.net` | 443 | HTTPS |
| Microsoft Fabric OneLake | `onelake.dfs.fabric.microsoft.com` | 443 | HTTPS |
| Azure Data Explorer | `<cluster>.<region>.kusto.windows.net` | 443 | HTTPS |
| Container registries in [RegistryEndpoint](../develop-edge-apps/howto-configure-registry-endpoint.md) resources | `<registry>.azurecr.io`, `<registry>.<region>.data.azurecr.io` | 443 | HTTPS |

The exact endpoints come from your [DataflowEndpoint](../connect-to-cloud/howto-configure-dataflow-endpoint.md) resources.

<!-- TODO (Gordon): Confirm the Event Grid MQTT port (8883). -->

### OPC UA

| Source | Destination | Port | Protocol | Notes |
|---|---|---|---|---|
| OPC UA connector pods (`aio-opc-*`) | [Configured OPC UA servers](../discover-manage-assets/howto-configure-opc-ua.md) | 50000 by default | OPC UA (`opc.tcp`) | The port is set per asset endpoint. |

<!-- TODO (OPC UA team): Confirm whether aio-opc-supervisor-*, aio-opc-opcua-commander-*, and aio-opc-ua-gds-manager-* connect to OPC UA servers. -->

### Akri connectors

Akri connectors act as protocol adapters and support protocols such as MQTT, REST (HTTP), SSE, and ONVIF. Their outbound connections depend on the protocol and on the devices or endpoints you configure. Allow each connector to reach its configured devices on the required ports. For more information, see [Akri connectors overview](../develop-edge-apps/overview-akri-connectors.md).

### MQTT broker custom authentication

If you configure the MQTT broker to use [custom authentication](../manage-mqtt-broker/howto-configure-authentication.md), allow the `aio-broker-authentication-*` pods to reach your custom authentication server over HTTPS.

### Container images

The cluster nodes pull Azure IoT Operations container images from Microsoft Container Registry. Image pulls are made by the node's container runtime, not by pods, so allow them in your host or perimeter firewall.

| Endpoint | Port | Protocol |
|---|---|---|
| `mcr.microsoft.com` | 443 | HTTPS |
| `<region>.data.mcr.microsoft.com` | 443 | HTTPS |

### Azure endpoints

As an Azure Arc extension, Azure IoT Operations connects to Azure for identity, monitoring, and telemetry. For the full list of endpoints, see [Azure IoT Operations endpoints](../deploy-iot-ops/overview-deploy.md#azure-iot-operations-endpoints).

<!-- TODO (Gordon + observability team): Replace the wildcard list in the original guidance (*.azure.com, *.azure.net, *.microsoft.com, *.microsoftmetrics.com, *.microsoftonline.com, *.visualstudio.com, *.windows.net) with exact FQDNs, and list which pods call them. Open items:
- Telemetry: dc.services.visualstudio.com, global.prod.microsoftmetrics.com, *.prod.microsoftmetrics.com, *.prod.hot.ingest.monitor.core.windows.net, gcs.prod.monitoring.core.windows.net
- Key Vault (<vault-name>.vault.azure.net): which pod and namespace sync secrets
- aio-usage-* and aio-usage-dil-*: do they call Azure?
- aio-operator-*, aio-mcp-frontend-*, aio-inference-connector-*: outbound flows, if any
-->

### Azure Arc

Azure IoT Operations requires an Azure Arc-enabled Kubernetes cluster, and the Arc agents in the `azure-arc` namespace need their own outbound access. Azure IoT Operations also uses custom locations, so the Arc endpoints for custom locations and cluster connect are required.

For the list of Azure Arc endpoints, see [Azure Arc-enabled Kubernetes network requirements](/azure/azure-arc/kubernetes/network-requirements). If you use Azure Arc gateway, see [Simplify network configuration requirements with Azure Arc gateway](/azure/azure-arc/kubernetes/arc-gateway-simplify-networking) for the endpoints that still need direct access.

## Example policies

The following examples use `CiliumNetworkPolicy` to allow egress. They don't configure ingress rules or cover every flow in this article. On a default-deny cluster, also allow the required ingress to destination pods.

Kubernetes NetworkPolicy and Cilium allow rules are additive: traffic allowed by one policy isn't restricted by another allow policy. Cilium explicit deny rules take precedence over allow rules.

<!-- TODO (Gordon): Validate both examples on a default-deny Cilium cluster before publishing. -->

### Allow DNS, the Kubernetes API, and traffic within the namespace

This policy applies to every pod in the `azure-iot-operations` namespace. In Cilium, once an egress policy selects a pod, egress that isn't allowed by this or another policy is denied, so this example also allows traffic within the namespace.

```yaml
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: aio-allow-baseline-egress
  namespace: azure-iot-operations
spec:
  endpointSelector: {}
  egress:
  # Allow traffic to all pods in the azure-iot-operations namespace
  - toEndpoints:
    - {}
  # Allow DNS, and let Cilium see DNS lookups for FQDN rules
  - toEndpoints:
    - matchLabels:
        k8s:io.kubernetes.pod.namespace: kube-system
        k8s-app: kube-dns
    toPorts:
    - ports:
      - port: "53"
        protocol: ANY
      rules:
        dns:
        - matchPattern: "*"
  # Allow the Kubernetes API server
  - toEntities:
    - kube-apiserver
```

### Allow data flows to send data to Azure Event Hubs

This policy lets the data flow profile pods reach one Event Hubs namespace over the Kafka protocol. FQDN rules in Cilium require the DNS rule from the previous example. Replace the label key and value placeholders with labels that select only the data flow profile pods in your deployment, and replace `<namespace>` with your Event Hubs namespace.

```yaml
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: aio-dataflow-egress-eventhubs
  namespace: azure-iot-operations
spec:
  endpointSelector:
    matchLabels:
      <dataflow-profile-label-key>: <dataflow-profile-label-value>
  egress:
  - toFQDNs:
    - matchName: <namespace>.servicebus.windows.net
    toPorts:
    - ports:
      - port: "9093"
        protocol: TCP
```

## Validate your policies

After you apply your policies, check that Azure IoT Operations works as expected:

1. Check that all pods in the `azure-iot-operations` namespace are running.

   ```bash
   kubectl get pods -n azure-iot-operations
   ```

1. Send test data through a data flow and confirm that it arrives at the destination.

1. If you use Cilium with Hubble, look for dropped traffic from Azure IoT Operations pods.

   ```bash
   hubble observe --namespace azure-iot-operations --verdict DROPPED
   ```

## Related content

- [Deployment overview](../deploy-iot-ops/overview-deploy.md)
- [Configure BrokerListeners](../manage-mqtt-broker/howto-configure-brokerlistener.md)
- [Configure data flow endpoints](../connect-to-cloud/howto-configure-dataflow-endpoint.md)
- [Azure Arc-enabled Kubernetes network requirements](/azure/azure-arc/kubernetes/network-requirements)
- [Kubernetes network policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
