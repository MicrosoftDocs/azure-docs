---
title: Container Apps on Azure Arc Overview
description: Learn how Azure Arc integrates with Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 01/21/2025
ms.author: cshoe
---

# Azure Container Apps on Azure Arc (Preview)

You can run Container Apps on an Azure Arc-enabled AKS or AKS on Azure Local cluster.

Running in an Azure Arc-enabled Kubernetes cluster allows:

- Developers to take advantage of Container Apps' features
- IT administrators to maintain corporate compliance by hosting Container Apps on internal infrastructure.

Learn to set up your Kubernetes cluster for Container Apps, via [Set up an Azure Arc-enabled Kubernetes cluster to run Azure Container Apps](azure-arc-enable-cluster.md)

As you configure your cluster, you carry out these actions:

- **The connected cluster**, which is an Azure projection of your Kubernetes infrastructure. For more information, see [What is Azure Arc-enabled Kubernetes?](/azure/azure-arc/kubernetes/overview).

- **A cluster extension**, which is a subresource of the connected cluster resource. The Container Apps extension [installs the required resources into your connected cluster](#resources-created-by-the-container-apps-extension). For more information about cluster extensions, see [Cluster extensions on Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/conceptual-extensions).

- **A custom location**, which bundles together a group of extensions and maps them to a namespace for created resources. For more information, see [Custom locations on top of Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/conceptual-custom-locations).

- **A Container Apps connected environment**, which enables configuration common across apps but not related to cluster operations. Conceptually, it's deployed into the custom location resource, and app developers create apps into this environment.

## Public preview limitations

The following public preview limitations apply to Azure Container Apps on Azure Arc enabled Kubernetes.

| Limitation | Details |
|---|---|
| Supported Azure regions | East US, West Europe, East Asia |
| Cluster networking requirement | Must support [LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) service type |
| Node OS requirement | **Linux** only. | 
| Feature: Managed identities | [Not available](#are-managed-identities-supported) |
| Feature: Pull images from ACR with managed identity | Not available (depends on managed identities) |
| Logs | Log Analytics must be configured with cluster extension; not per-application |

> [!IMPORTANT]
> If deploying onto **AKS on Azure Local** ensure that you have [setup HAProxy as your load balancer](/azure/aks/hybrid/configure-load-balancer)  before attempting to install the extension.

## Resources created by the Container Apps extension

When the Container Apps extension is installed on the Azure Arc-enabled Kubernetes cluster, several resources are created in the specified release namespace. These resources enable your cluster to be an extension of the `Microsoft.App` resource provider to support the management and operation of your apps.

Optionally, you can choose to have the extension install [KEDA](https://keda.sh/) for event-driven scaling. However, only one KEDA installation is allowed on the cluster. If you have an existing installation, disable the KEDA installation as you install the cluster extension.

The following table describes the role of each revision created for you:

| Pod | Description | Number of Instances | CPU | Memory | Type |
|----|----|----|----|----|----|
| `<extensionName>-k8se-activator` | Used as part of the scaling pipeline | 2 | 100 millicpu | 500 MB | ReplicaSet |
| `<extensionName>-k8se-billing` | Billing record generation - Azure Container Apps on Azure Arc enabled Kubernetes is Free of Charge during preview | 3 | 100 millicpu | 100 MB | ReplicaSet | 
| `<extensionName>-k8se-containerapp-controller` | The core operator pod that creates resources on the cluster and maintains the state of components. | 2 | 100 millicpu | 1 GB | ReplicaSet |
| `<extensionName>-k8se-envoy` | A front-end proxy layer for all data-plane http requests. It routes the inbound traffic to the correct apps. | 3 | 1 Core | 1,536 MB | ReplicaSet |
| `<extensionName>-k8se-envoy-controller` | Operator, which generates Envoy configuration | 2 | 200 millicpu | 500 MB | ReplicaSet |
| `<extensionName>-k8se-event-processor` | An alternative routing destination to help with apps that have scaled to zero while the system gets the first instance available. | 2 | 100 millicpu | 500 MB | ReplicaSet |
| `<extensionName>-k8se-http-scaler` | Monitors inbound request volume in order to provide scaling information to [KEDA](https://keda.sh). | 1 | 100 millicpu | 500 MB | ReplicaSet |
| `<extensionName>-k8se-keda-cosmosdb-scaler` | KEDA Cosmos DB Scaler | 1 | 10 m | 128 MB | ReplicaSet |
| `<extensionName>-k8se-keda-metrics-apiserver` | KEDA Metrics Server | 1 | 1 Core | 1,000 MB | ReplicaSet |
| `<extensionName>-k8se-keda-operator` | Scales workloads in and out from 0/1 to N instances | 1 | 100 millicpu | 500 MB | ReplicaSet |
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
- [Can the extension be installed on Windows nodes?](#can-the-extension-be-installed-on-windows-nodes)
- [Can I deploy the Container Apps extension on an Arm64 based cluster?](#can-i-deploy-the-container-apps-extension-on-an-arm64-based-cluster)

### How much does it cost?

Azure Container Apps on Azure Arc-enabled Kubernetes is free during the public preview.

### Which Container Apps features are supported?

During the preview period, certain Azure Container App features are being validated. When they're supported, their left navigation options in the Azure portal will be activated. Features that aren't yet supported remain grayed out.

### Are managed identities supported?

Managed Identities aren't supported. Apps can't be assigned managed identities when running in Azure Arc. If your app needs an identity for working with another Azure resource, consider using an [application service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) instead.

### Are there any scaling limits?

All applications deployed with Azure Container Apps on Azure Arc-enabled Kubernetes are able to scale within the limits of the underlying Kubernetes cluster. If the cluster runs out of available compute resources (CPU and memory primarily), then applications scale to the number of instances of the application that Kubernetes can schedule with available resource.

### What logs are collected?

Logs for both system components and your applications are written to standard output.

Both log types can be collected for analysis using standard Kubernetes tools. You can also configure the application environment cluster extension with a [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-overview), and it sends all logs to that workspace.

By default, logs from system components are sent to the Azure team. Application logs aren't sent. You can prevent these logs from being transferred by setting `logProcessor.enabled=false` as an extension configuration setting. This configuration setting disables forwarding of application to your Log Analytics workspace. Disabling the log processor might affect the time needed for any support cases, and you'll be asked to collect logs from standard output through some other means.

### What do I do if I see a provider registration error?

As you create an Azure Container Apps connected environment resource, some subscriptions might see the "No registered resource provider found" error. The error details might include a set of locations and API versions that are considered valid. If this error message is returned, the subscription must be re-registered with the `Microsoft.App` provider. Re-registering the provider has no effect on existing applications or APIs. To re-register, use the Azure CLI to run `az provider register --namespace Microsoft.App --wait`. Then reattempt the connected environment command.

## Can the extension be installed on Windows nodes?

No, the extension cannot be installed on Windows nodes. The extension supports installation on **Linux** nodes **only**.

### Can I deploy the Container Apps extension on an Arm64 based cluster?

Arm64 based clusters aren't supported at this time.  

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

 - Upgrade of KEDA to 2.9.1 and Dapr to 1.9.5
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

 - Update OSS Fluent Bit to 2.1.2 and Dapr to 1.10.6
 - Support for container registries exposed on custom port
 - Enable activate/deactivate revision when a container app is stopped
 - Fix Revisions List not returning init containers
 - Default allow headers added for cors policy

### Container Apps extension v1.12.9 (July 2023)

 - Minor updates to EasyAuth sidecar containers
 - Update of Extension Monitoring Agents

### Container Apps extension v1.17.8 (August 2023)

 - Update EasyAuth to 1.6.16, Dapr to 1.10.8, and Envoy to 1.25.6
 - Add volume mount support for Azure Container App jobs
 - Added IP Restrictions for applications with TCP Ingress type
 - Added support for Container Apps with multiple exposed ports

### Container Apps extension v1.23.5 (December 2023)

 - Update Envoy to 1.27.2, KEDA to v2.10.0, EasyAuth to 1.6.20, and Dapr to 1.11
 - Set Envoy to max TLS 1.3
 - Fix to resolve crashes in Log Processor pods
 - Fix to image pull secret retrieval issues
 - Update placement of Envoy to distribute across available nodes where possible
 - When container apps fail to provision as a result of revision conflicts, set the provisioning state to failed

### Container Apps extension v1.30.6 (January 2024)

 - Update KEDA to v2.12, Envoy SC image to v1.0.4, and Dapr image to v1.11.6
 - Added default response timeout for Envoy routes to 1,800 seconds
 - Changed Fluent bit default log level to warn
 - Delay deletion of job pods to ensure log emission
 - Fixed issue for job pod deletion for failed job executions
 - Ensure jobs in suspended state have failed pods deleted
 - Update to not resolve HTTPOptions for TCP applications
 - Allow applications to listen on HTTP or HTTPS
 - Add ability to suspend jobs
 - Fixed issue where KEDA scaler was failing to create job after stopped job execution
 - Add startingDeadlineSeconds to Container App Job if there's a cluster reboot
 - Removed heavy logging in Envoy access log server
 - Updated Monitoring Configuration version for Azure Container Apps on Azure Arc enabled Kubernetes

### Container Apps extension v1.36.15 (April 2024)

 - Update Dapr to v1.12 and Dapr Metrics to v0.6
 - Allow customers to enabled Azure SDK debug logging in Dapr
 - Scale Envoy in response to memory usage
 - Change of Envoy log format to Json
 - Export additional Envoy metrics
 - Truncate Envoy log to first 1,024 characters when log content failed to parse
 - Handle SIGTERM gracefully in local proxy
 - Allow ability to use different namespaces with KEDA
 - Validation added for scale rule name
 - Enabled revision GC by default
 - Enabled emission of metrics for sidecars
 - Added volumeMounts to job executions
 - Added validation to webhook endpoints for jobs

 ### Container Apps extension v1.37.1 (July 2024)

 - Update EasyAuth to support MISE

 ### Container Apps extension v1.37.2 (September 2024)

  - Updated Dapr-Metrics image to v0.6.8 to resolve network timeout issue
  - Resolved issue in Log Processor which prevented MDSD container from starting when cluster is connected behind a Proxy

 ### Container Apps extension v1.37.7 (October 2024)

  - Resolved issue with MDM Init container which caused container to crash in event it couldn't be pulled
  - Added support for [Logic Apps Hybrid Deployment Model (Public Preview)](https://techcommunity.microsoft.com/t5/azure-integration-services-blog/announcement-introducing-the-logic-apps-hybrid-deployment-model/ba-p/4271568)

## Next steps

[Create a Container Apps connected environment (Preview)](azure-arc-enable-cluster.md)
