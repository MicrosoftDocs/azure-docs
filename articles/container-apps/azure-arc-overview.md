---
title: Container Apps on Azure Arc Overview
description: Learn the benefits, architecture, supported features, prerequisites, and limitations of running Azure Container Apps on Azure Arc-enabled Kubernetes.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: concept-article
ms.date: 09/15/2026
ms.author: cshoe
ms.custom:
  - build-2025
---

# Azure Container Apps on Azure Arc

Azure Container Apps on Azure Arc-enabled Kubernetes lets you run Container Apps workloads on supported Kubernetes infrastructure outside Azure datacenters, including AKS on Azure Local. You manage the applications as Azure resources while the application containers and the Container Apps data plane run on your Kubernetes cluster.

Running Container Apps on Azure Arc can help you:

- Run applications close to users, devices, or on-premises data sources to reduce latency.
- Keep application processing in a location that supports your organization's data residency, sovereignty, or compliance requirements.
- Give application teams a Container Apps application model while infrastructure teams retain control of the Kubernetes cluster, networking, storage, capacity, and lifecycle.
- Manage applications across supported locations through Azure Resource Manager, Azure CLI, and the Azure portal.
- Use supported Container Apps capabilities such as revisions, ingress, autoscaling, Dapr, jobs, metrics, log streaming, custom domains, and application console access.

Container Apps on Azure Arc isn't a hosted compute service. Your organization provides, secures, scales, patches, and operates the underlying Kubernetes cluster and its compute, networking, and storage resources.

To prepare a cluster and deploy your first application, complete [Set up an Azure Arc-enabled Kubernetes cluster to run Azure Container Apps](azure-arc-enable-cluster.md), and then complete [Create a container app on Azure Arc](azure-arc-create-container-app.md).

As you configure your cluster, you create or use these resources:

- **Connected cluster:** The Azure Resource Manager representation of your Kubernetes cluster. Azure Arc agents running in the cluster maintain the connection to Azure. For more information, see [What is Azure Arc-enabled Kubernetes?](/azure/azure-arc/kubernetes/overview).

- **Container Apps cluster extension:** Software installed in the cluster that provides the Container Apps controllers, ingress, scaling, Dapr, logging, and other data-plane components. The extension is a child resource of the connected cluster.

- **Custom location:** An Azure location resource that associates the connected cluster, the Container Apps extension, and the Kubernetes namespace where Container Apps resources are created.

- **Container Apps connected environment:** The application boundary into which developers deploy container apps and jobs. The connected environment references the custom location and contains configuration shared by its applications.

The dependency order is: connected cluster > cluster extension > custom location > connected environment > container app or job. If an earlier resource is unhealthy, resources later in the chain might fail to provision.

## Limitations

The following limitations apply to Azure Container Apps on Azure Arc-enabled Kubernetes.

| Limitation | Details |
|---|---|
| Supported Azure regions | Australia East, East Asia, East US, North Central US, Southeast Asia, Sweden Central, UK South, West Europe, West US |
| Cluster networking requirement | Must support [LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) service type |
| Node OS requirement | **Linux** only. |
| Feature: Managed identities | [Not available](#are-managed-identities-supported) |
| Feature: Pull images from ACR with managed identity | Not available (depends on managed identities) |
| Feature: Azure Files | [SMB driver (>= v1.18.0)](https://github.com/kubernetes-csi/csi-driver-smb) should be installed before using Azure Files SMB storage |
| Logs | Log Analytics must be configured with cluster extension; not per-application |

The following features are supported:

- Labels
- Metrics
- Easy auth
- Log stream
- Resilience
- Custom domains
- Container Apps jobs
- Revision management
- App container console

> [!IMPORTANT]
> Before you install the extension on **AKS on Azure Local**, configure [HAProxy or another supported load balancer](/azure/aks/aksarc/configure-load-balancer) and configure custom CoreDNS. To configure CoreDNS for AKS on Azure Local, run `az containerapp arc setup-core-dns --distro AksAzureLocal`. For command options, see [`az containerapp arc`](/cli/azure/containerapp/arc).

## Resources created by the Container Apps extension

When the Container Apps extension is installed on the Azure Arc-enabled Kubernetes cluster, several resources are created in the specified release namespace. These resources enable your cluster to be an extension of the `Microsoft.App` resource provider to support the management and operation of your apps.

The extension can install the KEDA components used for event-driven and HTTP scaling. Only one supported KEDA installation can run in the cluster. Before installation, run `kubectl get deployment -A | grep -i keda` to check for an existing installation. If KEDA already exists, stop and confirm the supported coexistence configuration before continuing. Don't remove the existing KEDA installation or apply undocumented extension settings because other workloads might depend on it.

The following table describes the role of each extension component created for you:

| Pod | Description | Number of Instances | CPU | Memory | Type |
|----|----|----|----|----|----|
| `<extensionName>-k8se-activator` | Used as part of the scaling pipeline | 2 | 100 millicpu | 500 MB | ReplicaSet |
| `<extensionName>-k8se-billing` | Billing record generation | 3 | 100 millicpu | 100 MB | ReplicaSet |
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

## FAQ for Azure Container Apps on Azure Arc

- [Azure Container Apps on Azure Arc](#azure-container-apps-on-azure-arc)
  - [Limitations](#limitations)
  - [Resources created by the Container Apps extension](#resources-created-by-the-container-apps-extension)
  - [FAQ for Azure Container Apps on Azure Arc](#faq-for-azure-container-apps-on-azure-arc)
    - [Which Container Apps features are supported?](#which-container-apps-features-are-supported)
    - [Are managed identities supported?](#are-managed-identities-supported)
    - [Are there any scaling limits?](#are-there-any-scaling-limits)
    - [What logs are collected?](#what-logs-are-collected)
    - [How can I install SMB Driver?](#how-can-i-install-smb-driver)
  - [Can the extension be installed on Windows nodes?](#can-the-extension-be-installed-on-windows-nodes)
    - [Can I deploy the Container Apps extension on an Arm64-based cluster?](#can-i-deploy-the-container-apps-extension-on-an-arm64-based-cluster)
  - [Related content](#related-content)

### Which Container Apps features are supported?

For the documented support status and prerequisites of each feature, see [Limitations](#limitations). The Azure portal also disables controls that aren't available in a connected environment. Support can depend on the installed extension version, so verify the [extension release notes](container-apps-extension-release-notes.md) before using a recently added feature.

### Are managed identities supported?

No. You can't assign a managed identity to a container app or job in a connected environment. Managed-identity authentication for Azure Container Registry image pulls is also unavailable.

If an application must authenticate to an Azure resource, use a Microsoft Entra application and service principal:

1. Create or identify an application registration.
1. Grant its service principal only the Azure role required by the application.
1. Store the credential as a Container Apps secret.
1. Reference the secret through environment variables in the application.
1. Establish a credential-rotation process.

For more information, see [Application and service principal objects in Microsoft Entra ID](/entra/identity-platform/app-objects-and-service-principals). Avoid embedding credentials in an image or source repository.

### Are there any scaling limits?

Container apps and jobs can scale only within the allocatable CPU, memory, and specialized resources available in the underlying Kubernetes cluster. Setting a maximum replica count doesn't reserve capacity.

When the cluster lacks capacity, Kubernetes leaves new replicas pending and the application doesn't reach its requested replica count. Check for this condition with:

```bash
kubectl get pods -n <APPS_NAMESPACE>
kubectl describe pod <PENDING_POD_NAME> -n <APPS_NAMESPACE>
kubectl get events -n <APPS_NAMESPACE> --sort-by=.lastTimestamp
```

Plan cluster capacity for the extension components, peak application replicas, Kubernetes system workloads, rolling upgrades, and node failure.

### What logs are collected?

Logs for both system components and your applications are written to standard output.

Both log types can be collected for analysis using standard Kubernetes tools. You can also configure the application environment cluster extension with a [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-overview), and it sends all logs to that workspace.

By default, logs from system components are sent to the Azure team. Application logs aren't sent. You can prevent these logs from being transferred by setting `logProcessor.enabled=false` as an extension configuration setting. This configuration setting disables forwarding of application to your Log Analytics workspace. Disabling the log processor might affect the time needed for any support cases, and you'll be asked to collect logs from standard output through some other means.

### How can I install SMB Driver?

You can install the SMB driver using the following Helm command. For additional installation methods, see [Install driver on a Kubernetes cluster](https://github.com/kubernetes-csi/csi-driver-smb/tree/master/charts).

```
helm repo add csi-driver-smb https://raw.githubusercontent.com/kubernetes-csi/csi-driver-smb/master/charts
helm install csi-driver-smb csi-driver-smb/csi-driver-smb --namespace kube-system --version v1.18.0
```

## Can the extension be installed on Windows nodes?

No, the extension cannot be installed on Windows nodes. The extension supports installation on **Linux** nodes **only**.

### Can I deploy the Container Apps extension on an Arm64-based cluster?

No. The extension doesn't support Arm64-based clusters.


## Related content

- [Set up an Azure Arc-enabled Kubernetes cluster to run Azure Container Apps](azure-arc-enable-cluster.md)
- [Create a container app on Azure Arc](azure-arc-create-container-app.md)
- [Troubleshoot Azure Container Apps on Azure Arc-enabled Kubernetes](azure-arc-troubleshoot.md)
- [Azure Arc-enabled Kubernetes overview](/azure/azure-arc/kubernetes/overview)
- [Custom locations on Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/custom-locations)
- [Cluster extensions on Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/conceptual-extensions)
- [`az containerapp arc` CLI reference](/cli/azure/containerapp/arc)
- [Azure Container Apps extension release notes](container-apps-extension-release-notes.md)
