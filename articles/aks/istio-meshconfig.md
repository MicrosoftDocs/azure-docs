---
title: Configure Istio-based service mesh add-on for Azure Kubernetes Service
description: Configure Istio-based service mesh add-on for Azure Kubernetes Service
ms.topic: article
ms.custom:
ms.service: azure-kubernetes-service
ms.date: 02/14/2024
ms.author: shasb
author: shashankbarsin
---

# Configure Istio-based service mesh add-on for Azure Kubernetes Service

Open-source Istio uses [MeshConfig][istio-meshconfig] to define mesh-wide settings for the Istio service mesh. Istio-based service mesh add-on for AKS builds on top of MeshConfig and classifies different properties as supported, allowed, and blocked.

This article walks through how to configure Istio-based service mesh add-on for Azure Kubernetes Service and the support policy applicable for such configuration.

## Prerequisites

This guide assumes you followed the [documentation][istio-deploy-addon] to enable the Istio add-on on an AKS cluster.

## Set up configuration on cluster

1. Find out which revision of Istio is deployed on the cluster:

    ```bash
    az aks show --name $CLUSTER --resource-group $RESOURCE_GROUP --query 'serviceMeshProfile'
    ```

    Output:

    ```
    {
      "istio": {
          "certificateAuthority": null,
          "components": {
          "egressGateways": null,
          "ingressGateways": null
          },
          "revisions": [
          "asm-1-18"
          ]
      },
      "mode": "Istio"
    }
    ```

2. Create a ConfigMap with the name `istio-shared-configmap-<asm-revision>` in the `aks-istio-system` namespace. For example, if your cluster is running asm-1-18 revision of mesh, then the ConfigMap needs to be named as `istio-shared-configmap-asm-1-18`. Mesh configuration has to be provided within the data section under mesh.

    Example:

    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: istio-shared-configmap-asm-1-18
      namespace: aks-istio-system
    data:
      mesh: |-
        accessLogFile: /dev/stdout
        defaultConfig:
          holdApplicationUntilProxyStarts: true
    ```
    The values under `defaultConfig` are mesh-wide settings applied for Envoy sidecar proxy.

> [!CAUTION]
> A default ConfigMap (for example, `istio-asm-1-18` for revision asm-1-18) is created in `aks-istio-system` namespace on the cluster when the Istio addon is enabled. However, this default ConfigMap gets reconciled by the managed Istio addon and thus users should NOT directly edit this ConfigMap. Instead users should create a revision specific Istio shared ConfigMap (for example `istio-shared-configmap-asm-1-18` for revision asm-1-18) in the aks-istio-system namespace, and then the Istio control plane will merge this with the default ConfigMap, with the default settings taking precedence.

### Mesh configuration and upgrades

When you're performing [canary upgrade for Istio](./istio-upgrade.md), you need to create a separate ConfigMap for the new revision in the `aks-istio-system` namespace **before initiating the canary upgrade**. This way the configuration is available when the new revision's control plane is deployed on cluster. For example, if you're upgrading the mesh from asm-1-18 to asm-1-19, you need to copy changes over from `istio-shared-configmap-asm-1-18` to create a new ConfigMap called `istio-shared-configmap-asm-1-19` in the `aks-istio-system` namespace.

After the upgrade is completed or rolled back, you can delete the ConfigMap of the revision that was removed from the cluster.

## Allowed, supported, and blocked values

Fields in `MeshConfig` are classified into three categories: 

- **Blocked**: Disallowed fields are blocked via addon managed admission webhooks. API server immediately publishes the error message to the user that the field is disallowed.
- **Supported**: Supported fields (for example, fields related to access logging) receive support from Azure support.
- **Allowed**: These fields (such as proxyListenPort or proxyInboundListenPort) are allowed but they aren't covered by Azure support.

Mesh configuration and the list of allowed/supported fields are revision specific to account for fields being added/removed across revisions. The full list of allowed fields and the supported/unsupported ones within the allowed list is provided in the below table. When new mesh revision is made available, any changes to allowed and supported classification of the fields is noted in this table.

### MeshConfig

| **Field** | **Supported** | **Notes** |
|-----------|---------------|-----------|
| proxyListenPort | false | - |
| proxyInboundListenPort | false | - |
| proxyHttpPort | false | - |
| connectTimeout | false | Configurable in [DestinationRule](https://istio.io/latest/docs/reference/config/networking/destination-rule/#ConnectionPoolSettings-TCPSettings) |
| tcpKeepAlive | false | Configurable in [DestinationRule](https://istio.io/latest/docs/reference/config/networking/destination-rule/#ConnectionPoolSettings-TCPSettings) |
| defaultConfig | true | Used to configure [ProxyConfig](https://istio.io/latest/docs/reference/config/istio.mesh.v1alpha1/#ProxyConfig) |
| outboundTrafficPolicy | true | Also configurable in [Sidecar CR](https://istio.io/latest/docs/reference/config/networking/sidecar/#OutboundTrafficPolicy) |
| extensionProviders | false | - |
| defaultProviders | false | - |
| accessLogFile | true | - |
| accessLogFormat | true | - |
| accessLogEncoding | true | - |
| enableTracing | true | - |
| enableEnvoyAccessLogService | true | - |
| disableEnvoyListenerLog | true | - |
| trustDomain | false | - |
| trustDomainAliases | false | - |
| caCertificates | false | Configurable in [DestinationRule](https://istio.io/latest/docs/reference/config/networking/destination-rule/#ClientTLSSettings) |
| defaultServiceExportTo | false | Configurable in [ServiceEntry](https://istio.io/latest/docs/reference/config/networking/service-entry/#ServiceEntry) |
| defaultVirtualServiceExportTo | false | Configurable in [VirtualService](https://istio.io/latest/docs/reference/config/networking/virtual-service/#VirtualService) |
| defaultDestinationRuleExportTo | false | Configurable in [DestinationRule](https://istio.io/latest/docs/reference/config/networking/destination-rule/#DestinationRule) |
| localityLbSetting | false | Configurable in [DestinationRule](https://istio.io/latest/docs/reference/config/networking/destination-rule/#LoadBalancerSettings) |
| dnsRefreshRate | false | - |
| h2UpgradePolicy | false | Configurable in [DestinationRule](https://istio.io/latest/docs/reference/config/networking/destination-rule/#ConnectionPoolSettings-HTTPSettings) |
| enablePrometheusMerge | true | - |
| discoverySelectors | true | - |
| pathNormalization | false | - |
| defaultHttpRetryPolicy | false | Configurable in [VirtualService](https://istio.io/latest/docs/reference/config/networking/virtual-service/#HTTPRetry) |
| serviceSettings | false | - |
| meshMTLS | false | - |
| tlsDefaults | false | - |

### ProxyConfig (meshConfig.defaultConfig)

| **Field** | **Supported** |
|-----------|---------------|
| tracingServiceName | true |
| drainDuration | true |
| statsUdpAddress | false |
| proxyAdminPort | false |
| tracing | true |
| concurrency | true |
| envoyAccessLogService | true |
| envoyMetricsService | true |
| proxyMetadata | false |
| statusPort | false |
| extraStatTags | false |
| proxyStatsMatcher | false |
| terminationDrainDuration | true |
| meshId | false |
| holdApplicationUntilProxyStarts | true |
| caCertificatesPem | false |
| privateKeyProvider | false |

Fields present in [open source MeshConfig reference documentation][istio-meshconfig] but not in the above table are blocked. For example, `configSources` is blocked.

> [!CAUTION]
> **Support scope of configurations:** Mesh configuration allows for extension providers such as self-managed instances of Zipkin or Apache Skywalking to be configured with the Istio addon. However, these extension providers are outside the support scope of the Istio addon. Any issues associated with extension tools are outside the support boundary of the Istio addon.

## Common errors and troubleshooting tips

- Ensure that the MeshConfig is indented with spaces instead of tabs. 
- Ensure that you're only editing the revision specific shared ConfigMap (for example `istio-shared-configmap-asm-1-18`) and not trying to edit the default ConfigMap (for example `istio-asm-1-18`).
- The ConfigMap must follow the name `istio-shared-configmap-<asm-revision>` and be in the `aks-istio-system` namespace. 
- Ensure that all MeshConfig fields are spelled correctly. If they're unrecognized or if they aren't part of the allowed list, admission control denies such configurations.
- When performing canary upgrades, [check your revision specific ConfigMaps](#mesh-configuration-and-upgrades) to ensure configurations exist for the revisions deployed on your cluster.
- Certain `MeshConfig` options such as accessLogging may increase Envoy's resource consumption, and disabling some of these settings may mitigate Istio data plane resource utilization. It's also advisable to use the `discoverySelectors` field in the MeshConfig to help alleviate memory consumption for Istiod and Envoy.
- If the `concurrency` field in the MeshConfig is misconfigured and set to zero, it causes Envoy to use up all CPU cores. Instead if this field is unset, number of worker threads to run is automatically determined based on CPU requests/limits. 
- [Pod and sidecar race conditions][istio-sidecar-race-condition] in which the application starts before Envoy can be mitigated using the `holdApplicationUntilProxyStarts` field in the MeshConfig. 


[istio-meshconfig]: https://istio.io/latest/docs/reference/config/istio.mesh.v1alpha1/
[istio-sidecar-race-condition]: https://istio.io/latest/docs/ops/common-problems/injection/#pod-or-containers-start-with-network-issues-if-istio-proxy-is-not-ready
[istio-deploy-addon]: istio-deploy-addon.md
