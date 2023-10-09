---
title: "Available extensions for Azure Arc-enabled Kubernetes clusters"
ms.date: 10/09/2023
ms.topic: how-to
description: "See which extensions are currently available for Azure Arc-enabled Kubernetes clusters and view release notes."
---

# Available extensions for Azure Arc-enabled Kubernetes clusters

[Cluster extensions for Azure Arc-enabled Kubernetes](conceptual-extensions.md) provide an Azure Resource Manager-driven experience for installation and lifecycle management of different Azure capabilities on top of your cluster. These extensions can be [deployed to your clusters](extensions.md) to enable different scenarios and improve cluster management.

The following extensions are currently available for use with Arc-enabled Kubernetes clusters. All of these extensions are [cluster-scoped](conceptual-extensions.md#extension-scope), except for Azure API Management on Azure Arc, which is namespace-scoped.

> [!NOTE]
> Installing Azure Arc extensions on [Azure Kubernetes Service (AKS) hybrid clusters provisioned from Azure](extensions.md#aks-hybrid-clusters-provisioned-from-azure-preview) is currently in preview, with support for the Azure Arc-enabled Open Service Mesh, Azure Key Vault Secrets Provider, Flux (GitOps) and Microsoft Defender for Cloud extensions.

## Azure Monitor Container Insights

- **Supported distributions**: All Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters

Azure Monitor Container Insights provides visibility into the performance of workloads deployed on the Kubernetes cluster. Use this extension to collect memory and CPU utilization metrics from controllers, nodes, and containers.

For more information, see [Azure Monitor Container Insights for Azure Arc-enabled Kubernetes clusters](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md?toc=/azure/azure-arc/kubernetes/toc.json&bc=/azure/azure-arc/kubernetes/breadcrumb/toc.json).

## Azure Policy

Azure Policy extends [Gatekeeper](https://github.com/open-policy-agent/gatekeeper), an admission controller webhook for [Open Policy Agent](https://www.openpolicyagent.org/) (OPA), to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner.

For more information, see [Understand Azure Policy for Kubernetes clusters](../../governance/policy/concepts/policy-for-kubernetes.md?toc=/azure/azure-arc/kubernetes/toc.json&bc=/azure/azure-arc/kubernetes/breadcrumb/toc.json).

## Azure Key Vault Secrets Provider

- **Supported distributions**: AKS on Azure Stack HCI, AKS hybrid clusters provisioned from Azure, Cluster API Azure, Google Kubernetes Engine,  Canonical Kubernetes Distribution, OpenShift Kubernetes Distribution, Amazon Elastic Kubernetes Service, VMware Tanzu Kubernetes Grid

The Azure Key Vault Provider for Secrets Store CSI Driver allows for the integration of Azure Key Vault as a secrets store with a Kubernetes cluster via a CSI volume. For Azure Arc-enabled Kubernetes clusters, you can install the Azure Key Vault Secrets Provider extension to fetch secrets.

For more information, see [Use the Azure Key Vault Secrets Provider extension to fetch secrets into Azure Arc-enabled Kubernetes clusters](tutorial-akv-secrets-provider.md).

## Microsoft Defender for Containers

- **Supported distributions**: AKS hybrid clusters provisioned from Azure, Cluster API Azure, Azure Red Hat OpenShift, Red Hat OpenShift (version 4.6 or newer), Google Kubernetes Engine Standard, Amazon Elastic Kubernetes Service, VMware Tanzu Kubernetes Grid, Rancher Kubernetes Engine, Canonical Kubernetes Distribution

Microsoft Defender for Containers is the cloud-native solution that is used to secure your containers so you can improve, monitor, and maintain the security of your clusters, containers, and their applications. It gathers information related to security like audit log data from the Kubernetes cluster, and provides recommendations and threat alerts based on gathered data.

For more information, see [Enable Microsoft Defender for Containers](../../defender-for-cloud/defender-for-kubernetes-azure-arc.md?toc=/azure/azure-arc/kubernetes/toc.json&bc=/azure/azure-arc/kubernetes/breadcrumb/toc.json).

> [!IMPORTANT]
> Defender for Containers support for Arc-enabled Kubernetes clusters is currently in public preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Azure Arc-enabled Open Service Mesh

- **Supported distributions**: AKS, AKS on Azure Stack HCI, AKS hybrid clusters provisioned from Azure, Cluster API Azure, Google Kubernetes Engine, Canonical Kubernetes Distribution, Rancher Kubernetes Engine, OpenShift Kubernetes Distribution, Amazon Elastic Kubernetes Service, VMware Tanzu Kubernetes Grid

[Open Service Mesh (OSM)](https://docs.openservicemesh.io/) is a lightweight, extensible, Cloud Native service mesh that allows users to uniformly manage, secure, and get out-of-the-box observability features for highly dynamic microservice environments.

For more information, see [Azure Arc-enabled Open Service Mesh](tutorial-arc-enabled-open-service-mesh.md).

## Azure Arc-enabled Data Services

- **Supported distributions**: AKS, AKS on Azure Stack HCI, Azure Red Hat OpenShift, Google Kubernetes Engine, Canonical Kubernetes Distribution, OpenShift Container Platform, Amazon Elastic Kubernetes Service

Makes it possible for you to run Azure data services on-premises, at the edge, and in public clouds using Kubernetes and the infrastructure of your choice. This extension enables the *custom locations* feature, providing a way to configure Azure Arc-enabled Kubernetes clusters as target locations for deploying instances of Azure offerings.

For more information, see [Azure Arc-enabled Data Services](../data/create-data-controller-direct-prerequisites.md) and [Create custom locations](custom-locations.md#create-custom-location).

## Azure App Service on Azure Arc

- **Supported distributions**: AKS, AKS on Azure Stack HCI, Azure Red Hat OpenShift, Google Kubernetes Engine, OpenShift Container Platform

Allows you to provision an App Service Kubernetes environment on top of Azure Arc-enabled Kubernetes clusters.

For more information, see [App Service, Functions, and Logic Apps on Azure Arc (Preview)](../../app-service/overview-arc-integration.md).

> [!IMPORTANT]
> App Service on Azure Arc is currently in public preview. Review the [public preview limitations for App Service Kubernetes environments](../../app-service/overview-arc-integration.md#public-preview-limitations) before deploying this extension.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Azure Event Grid on Kubernetes

- **Supported distributions**: AKS, Red Hat OpenShift

Event Grid is an event broker used to integrate workloads that use event-driven architectures. This extension lets you create and manage Event Grid resources such as topics and event subscriptions on top of Azure Arc-enabled Kubernetes clusters.

For more information, see [Event Grid on Kubernetes with Azure Arc (Preview)](../../event-grid/kubernetes/overview.md).

> [!IMPORTANT]
> Event Grid on Kubernetes with Azure Arc is currently in public preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Azure API Management on Azure Arc

- **Supported distributions**: All Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters.

With the integration between Azure API Management and Azure Arc on Kubernetes, you can deploy the API Management gateway component as an extension in an Azure Arc-enabled Kubernetes cluster. This extension is [namespace-scoped](conceptual-extensions.md#extension-scope), not cluster-scoped.

For more information, see [Deploy an Azure API Management gateway on Azure Arc (preview)](../../api-management/how-to-deploy-self-hosted-gateway-azure-arc.md).

> [!IMPORTANT]
> API Management self-hosted gateway on Azure Arc is currently in public preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Azure Arc-enabled Machine Learning

- **Supported distributions**: All Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters. Not currently supported for ARM 64.

The AzureML extension lets you deploy and run Azure Machine Learning on Azure Arc-enabled Kubernetes clusters.

For more information, see [Introduction to Kubernetes compute target in AzureML](../../machine-learning/how-to-attach-kubernetes-anywhere.md) and [Deploy AzureML extension on AKS or Arc Kubernetes cluster](../../machine-learning/how-to-deploy-kubernetes-extension.md).

## Flux (GitOps)

- **Supported distributions**: All Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters.

[GitOps on AKS and Azure Arc-enabled Kubernetes](conceptual-gitops-flux2.md) uses [Flux v2](https://fluxcd.io/docs/), a popular open-source tool set, to help manage cluster configuration and application deployment. GitOps is enabled in the cluster as a `Microsoft.KubernetesConfiguration/extensions/microsoft.flux` cluster extension resource.

For more information, see [Tutorial: Deploy applications using GitOps with Flux v2](tutorial-use-gitops-flux2.md).

The currently supported versions of the `microsoft.flux` extension are described below. The most recent version of the Flux v2 extension and the two previous versions (N-2) are supported. We generally recommend that you use the most recent version of the extension.

> [!IMPORTANT]
> Eventually, a major version update (v2.x.x) for the `microsoft.flux` extension will be released. When this happens, clusters won't be auto-upgraded to this version, since [auto-upgrade is only supported for minor version releases](extensions.md#upgrade-extension-instance). If you're still using an older API version when the next major version is released, you'll need to update your manifests to the latest API versions, perform any necessary testing, then upgrade your extension manually. For more information about the new API versions (breaking changes) and how to update your manifests, see the [Flux v2 release notes](https://github.com/fluxcd/flux2/releases/tag/v2.0.0).

### 1.7.8 (October 2023)

> [!NOTE]
> We have started to roll out this release across regions. We'll remove this note once version 1.7.8 is available to all supported regions.

Flux version: [Release v2.1.1](https://github.com/fluxcd/flux2/releases/tag/v2.1.1)

- source-controller: v1.1.1
- kustomize-controller: v1.1.0
- helm-controller: v0.36.1
- notification-controller: v1.1.0
- image-automation-controller: v0.36.1
- image-reflector-controller: v0.30.0

Changes made for this version:

- Upgrades Flux to [v2.1.1](https://github.com/fluxcd/flux2/releases/tag/v2.1.1)
- Adds support for [AKS clusters with workload identity](tutorial-use-gitops-flux2.md#workload-identity-in-aks-clusters)

### 1.7.7 (September 2023)

Flux version: [Release v2.0.1](https://github.com/fluxcd/flux2/releases/tag/v2.0.1)

- source-controller: v1.0.1
- kustomize-controller: v1.0.1
- helm-controller: v0.35.0
- notification-controller: v1.0.0
- image-automation-controller: v0.35.0
- image-reflector-controller: v0.29.1

Changes made for this version:

- Updated SSH key entry to use the [Ed25519 SSH host key](https://bitbucket.org/blog/ssh-host-key-changes) to prevent failures in configurations with `ssh` authentication type for Bitbucket.

### 1.7.6 (August 2023)

Flux version: [Release v2.0.1](https://github.com/fluxcd/flux2/releases/tag/v2.0.1)

- source-controller: v1.0.1
- kustomize-controller: v1.0.1
- helm-controller: v0.35.0
- notification-controller: v1.0.0
- image-automation-controller: v0.35.0
- image-reflector-controller: v0.29.1

Changes made for this version:

- Configurations with `ssh` authentication type were intermittently failing to reconcile with GitHub due to an updated [RSA SSH host key](https://github.blog/2023-03-23-we-updated-our-rsa-ssh-host-key/). This release updates the SSH key entries to match the ones mentioned in [GitHub's SSH key fingerprints documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints).

### 1.7.5 (August 2023)

Flux version: [Release v2.0.1](https://github.com/fluxcd/flux2/releases/tag/v2.0.1)

- source-controller: v1.0.1
- kustomize-controller: v1.0.1
- helm-controller: v0.35.0
- notification-controller: v1.0.0
- image-automation-controller: v0.35.0
- image-reflector-controller: v0.29.1

Changes made for this version:

- Upgrades Flux to [v2.0.1](https://github.com/fluxcd/flux2/releases/tag/v2.0.1)
- Promotes some APIs to v1. This change should not affect any existing Flux configurations that have already been deployed. Previous API versions will still be supported in all `microsoft.flux` v.1.x.x releases. However, we recommend that you update the API versions in your manifests as soon as possible. For more information about the new API versions (breaking changes) and how to update your manifests, see the [Flux v2 release notes](https://github.com/fluxcd/flux2/releases/tag/v2.0.0).
- Adds support for [Helm drift detection](tutorial-use-gitops-flux2.md#helm-drift-detection) and [OOM watch](tutorial-use-gitops-flux2.md#helm-oom-watch).

### 1.7.4 (June 2023)

Flux version: [Release v0.41.2](https://github.com/fluxcd/flux2/releases/tag/v0.41.2)

- source-controller: v0.36.1
- kustomize-controller: v0.35.1
- helm-controller: v0.31.2
- notification-controller: v0.33.0
- image-automation-controller: v0.31.0
- image-reflector-controller: v0.26.1

Changes made for this version:

- Adds support for [`wait`](https://fluxcd.io/flux/components/kustomize/kustomization/#wait) and [`postBuild`](https://fluxcd.io/flux/components/kustomize/kustomization/#post-build-variable-substitution) properties as optional parameters for kustomization. By default, `wait` will be set to `true` for all Flux configurations, and `postBuild` will be null. ([Example](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/kubernetesconfiguration/resource-manager/Microsoft.KubernetesConfiguration/stable/2023-05-01/examples/CreateFluxConfiguration.json#L55))

- Adds support for optional properties [`waitForReconciliation`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/kubernetesconfiguration/resource-manager/Microsoft.KubernetesConfiguration/stable/2023-05-01/fluxconfiguration.json#L1299C14-L1299C35) and [`reconciliationWaitDuration`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/kubernetesconfiguration/resource-manager/Microsoft.KubernetesConfiguration/stable/2023-05-01/fluxconfiguration.json#L1304).

   By default, `waitForReconciliation` is set to false, so when creating a flux configuration, the `provisioningState` returns `Succeeded` once the configuration reaches the cluster and the ARM template or Azure CLI command successfully exits. However, the actual state of the objects being deployed as part of the configuration is tracked by `complianceState`, which can be viewed in the portal or by using Azure CLI. Setting `waitForReconciliation` to true and specifying a `reconciliationWaitDuration` means that the template or CLI deployment will wait for `complianceState` to reach a terminal state (success or failure) before exiting. ([Example](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/kubernetesconfiguration/resource-manager/Microsoft.KubernetesConfiguration/stable/2023-05-01/examples/CreateFluxConfiguration.json#L72))

## Dapr extension for Azure Kubernetes Service (AKS) and Arc-enabled Kubernetes

[Dapr](https://dapr.io/) is a portable, event-driven runtime that simplifies building resilient, stateless, and stateful applications that run on the cloud and edge and embrace the diversity of languages and developer frameworks. The Dapr extension eliminates the overhead of downloading Dapr tooling and manually installing and managing the runtime on your clusters.

For more information, see [Dapr extension for AKS and Arc-enabled Kubernetes](../../aks/dapr.md).

## Next steps

- Read more about [cluster extensions for Azure Arc-enabled Kubernetes](conceptual-extensions.md).
- Learn how to [deploy extensions to an Arc-enabled Kubernetes cluster](extensions.md).
