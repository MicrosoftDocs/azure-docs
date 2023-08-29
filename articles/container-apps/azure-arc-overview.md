---
title: Container Apps on Azure Arc Overview
description: Learn how Azure Arc integrates with Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 08/22/2023
ms.author: cshoe
---

# Azure Container Apps on Azure Arc (Preview)

You can run Container Apps on an Azure Arc-enabled AKS or AKS-HCI cluster.

Running in an Azure Arc-enabled Kubernetes cluster allows:

- Developers to take advantage of Container Apps' features
- IT administrators to maintain corporate compliance by hosting Container Apps on internal infrastructure.

Learn to set up your Kubernetes cluster for Container Apps, via [Set up an Azure Arc-enabled Kubernetes cluster to run Azure Container Apps](azure-arc-enable-cluster.md)

As you configure your cluster, you'll carry out these actions:

- **The connected cluster**, which is an Azure projection of your Kubernetes infrastructure. For more information, see [What is Azure Arc-enabled Kubernetes?](../azure-arc/kubernetes/overview.md).

- **A cluster extension**, which is a subresource of the connected cluster resource. The Container Apps extension [installs the required resources into your connected cluster](#resources-created-by-the-container-apps-extension). For more information about cluster extensions, see [Cluster extensions on Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/conceptual-extensions.md).

- **A custom location**, which bundles together a group of extensions and maps them to a namespace for created resources. For more information, see [Custom locations on top of Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/conceptual-custom-locations.md).

- **A Container Apps connected environment**, which enables configuration common across apps but not related to cluster operations. Conceptually, it's deployed into the custom location resource, and app developers create apps into this environment.

## Public preview limitations

The following public preview limitations apply to Azure Container Apps on Azure Arc enabled Kubernetes.

| Limitation | Details |
|---|---|
| Supported Azure regions | East US, West Europe, East Asia |
| Cluster networking requirement | Must support [LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) service type |
| Feature: Managed identities | [Not available](#are-managed-identities-supported) |
| Feature: Pull images from ACR with managed identity | Not available (depends on managed identities) |
| Logs | Log Analytics must be configured with cluster extension; not per-site |

## Resources created by the Container Apps extension

When the Container Apps extension is installed on the Azure Arc-enabled Kubernetes cluster, several resources are created in the specified release namespace. These resources enable your cluster to be an extension of the `Microsoft.App` resource provider to support the management and operation of your apps.

Optionally, you can choose to have the extension install [KEDA](https://keda.sh/) for event-driven scaling. However, only one KEDA installation is allowed on the cluster. If you have an existing installation, disable the KEDA installation as you install the cluster extension.

The following table describes the role of each revision created for you:

| Pod | Description | Number of Instances | CPU | Memory | Type |
|----|----|----|----|----|----|
| `<extensionName>-k8se-activator` | Used as part of the scaling pipeline | 2 | 100 millicpu | 500 MB | ReplicaSet |
| `<extensionName>-k8se-billing` | Billing record generation - Azure Container Apps on Azure Arc enabled Kubernetes is Free of Charge during preview | 3 | 100 millicpu | 100 MB | ReplicaSet | 
| `<extensionName>-k8se-containerapp-controller` | The core operator pod that creates resources on the cluster and maintains the state of components. | 2 | 100 millicpu | 1 GB | ReplicaSet |
| `<extensionName>-k8se-envoy` | A front-end proxy layer for all data-plane http requests. It routes the inbound traffic to the correct apps. | 3 | 1 Core | 1536 MB | ReplicaSet |
| `<extensionName>-k8se-envoy-controller` | Operator, which generates Envoy configuration | 2 | 200 millicpu | 500 MB | ReplicaSet |
| `<extensionName>-k8se-event-processor` | An alternative routing destination to help with apps that have scaled to zero while the system gets the first instance available. | 2 | 100 millicpu | 500 MB | ReplicaSet |
| `<extensionName>-k8se-http-scaler` | Monitors inbound request volume in order to provide scaling information to [KEDA](https://keda.sh). | 1 | 100 millicpu | 500 MB | ReplicaSet |
| `<extensionName>-k8se-keda-cosmosdb-scaler` | Keda Cosmos DB Scaler | 1 | 10 m | 128 MB | ReplicaSet |
| `<extensionName>-k8se-keda-metrics-apiserver` | Keda Metrics Server | 1 | 1 Core | 1000 MB | ReplicaSet |
| `<extensionName>-k8se-keda-operator` | Manages component updated and service endpoints for Dapr | 1 | 100 millicpu | 500 MB | ReplicaSet |
| `<extensionName>-k8se-log-processor` | Gathers logs from apps and other components and sends them to Log Analytics. | 2 | 200 millicpu | 500 MB | DaemonSet |
| `<extensionName>-k8se-mdm` | Metrics and Logs Agent | 2 | 500 millicpu | 500 MB | ReplicaSet |
| dapr-metrics | Dapr metrics pod | 1 | 100 millicpu | 500 MB | ReplicaSet |
| dapr-operator | Manages component updates and service endpoints for Dapr | 1 | 100 millicpu | 500 MB | ReplicaSet |
| dapr-placement-server | Used for Actors only - creates mapping tables that map actor instances to pods | 1 | 100 millicpu | 500 MB | StatefulSet |
| dapr-sentry | Manages mTLS between services and acts as a CA | 2 | 800 millicpu | 200 MB | ReplicaSet |

## FAQ for Azure Container Apps on Azure Arc (Preview)

- [How much does it cost?](#how-much-does-it-cost)
- [Which Container Apps features are supported?](#which-container-apps-features-are-supported)
- [Are managed identities supported?](#are-managed-identities-supported)
- [Are there any scaling limits?](#are-there-any-scaling-limits)
- [What logs are collected?](#what-logs-are-collected)
- [What do I do if I see a provider registration error?](#what-do-i-do-if-i-see-a-provider-registration-error)
- [Can I deploy the Container Apps extension on an ARM64 based cluster?](#can-i-deploy-the-container-apps-extension-on-an-arm64-based-cluster)

### How much does it cost?

Azure Container Apps on Azure Arc-enabled Kubernetes is free during the public preview.

### Which Container Apps features are supported?

During the preview period, certain Azure Container App features are being validated. When they're supported, their left navigation options in the Azure portal will be activated. Features that aren't yet supported remain grayed out.

### Are managed identities supported?

No. Apps can't be assigned managed identities when running in Azure Arc. If your app needs an identity for working with another Azure resource, consider using an [application service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) instead.

### Are there any scaling limits?

All applications deployed with Azure Container Apps on Azure Arc-enabled Kubernetes are able to scale within the limits of the underlying Kubernetes cluster. If the cluster runs out of available compute resources (CPU and memory primarily), then applications scale to the number of instances of the application that Kubernetes can schedule with available resource.

### What logs are collected?

Logs for both system components and your applications are written to standard output.

Both log types can be collected for analysis using standard Kubernetes tools. You can also configure the application environment cluster extension with a [Log Analytics workspace](../azure-monitor/logs/log-analytics-overview.md), and it sends all logs to that workspace.

By default, logs from system components are sent to the Azure team. Application logs aren't sent. You can prevent these logs from being transferred by setting `logProcessor.enabled=false` as an extension configuration setting. This configuration setting will also disable forwarding of application to your Log Analytics workspace. Disabling the log processor might affect the time needed for any support cases, and you'll be asked to collect logs from standard output through some other means.

### What do I do if I see a provider registration error?

As you create an Azure Container Apps connected environment resource, some subscriptions might see the "No registered resource provider found" error. The error details might include a set of locations and api versions that are considered valid. If this error message is returned, the subscription must be re-registered with the `Microsoft.App` provider. Re-registering the provider has no effect on existing applications or APIs. To re-register, use the Azure CLI to run `az provider register --namespace Microsoft.App --wait`. Then reattempt the connected environment command.

### Can I deploy the Container Apps extension on an ARM64 based cluster?

ARM64 based clusters aren't supported at this time.  

## Extension Release Notes

### Container Apps extension v1.0.46 (December 2022)

- Initial public preview release of Container apps extension

### Container Apps extension v1.0.47 (January 2023)

- Upgrade of Envoy to 1.0.24

### Container Apps extension v1.0.48 (February 2023)

- Add probes to EasyAuth container(s)
- Increased memory limit for dapr-operator
- Added prevention of platform header overwriting

### Container Apps extension v1.0.49 (February 2023)

 - Upgrade of KEDA to 2.9.1
 - Upgrade of Dapr to 1.9.5
 - Increase Envoy Controller resource limits to 200 m CPU
 - Increase Container App Controller resource limits to 1-GB memory
 - Reduce EasyAuth sidecar resource limits to 50 m CPU
 - Resolve KEDA error logging for missing metric values

### Container Apps extension v1.0.50 (March 2023)
 
 - Updated logging images in sync with Public Cloud

### Container Apps extension v1.5.1 (April 2023)
 
 - New versioning number format
 - Upgrade of Dapr to 1.10.4
 - Maintain scale of Envoy after deployments of new revisions
 - Change to when default startup probes are added to a container, if developer doesn't define both startup and readiness probes, then default startup probes are added
 - Adds CONTAINER_APP_REPLICA_NAME environment variable to custom containers
 - Improvement in performance when multiple revisions are stopped

### Container Apps extension v1.12.8 (June 2023)

 - Update OSS Fluent Bit to 2.1.2
 - Upgrade of Dapr to 1.10.6
 - Support for container registries exposed on custom port
 - Enable activate/deactivate revision when a container app is stopped
 - Fix Revisions List not returning init containers
 - Default allow headers added for cors policy

### Container Apps extension v1.12.9 (July 2023)

 - Minor updates to EasyAuth sidecar containers
 - Update of Extension Monitoring Agents

### Container Apps extension v1.17.8 (August 2023)

 - Update EasyAuth to 1.6.16
 - Update of Dapr to 1.10.8
 - Update Envoy to 1.25.6
 - Add volume mount support for Azure Container App jobs
 - Added IP Restrictions for applications with TCP Ingress type
 - Added support for Container Apps with multiple exposed ports
 
## Next steps

[Create a Container Apps connected environment (Preview)](azure-arc-enable-cluster.md)
