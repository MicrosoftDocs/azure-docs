---
title: "Available extensions for Azure Arc-enabled Kubernetes clusters"
ms.date: 08/08/2024
ms.topic: how-to
description: "See which extensions are currently available for Azure Arc-enabled Kubernetes clusters and view release notes."
---

# Available extensions for Azure Arc-enabled Kubernetes clusters

[Cluster extensions for Azure Arc-enabled Kubernetes](conceptual-extensions.md) provide an Azure Resource Manager-driven experience for installation and lifecycle management of different Azure capabilities on top of your cluster. These extensions can be [deployed to your clusters](extensions.md) to enable different scenarios and improve cluster management.

The following extensions are currently available for use with Arc-enabled Kubernetes clusters. All of these extensions are [cluster-scoped](conceptual-extensions.md#extension-scope), except for Azure API Management on Azure Arc, which is namespace-scoped.

## Azure Monitor Container Insights

- **Supported distributions**: All Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters

Azure Monitor Container Insights provides visibility into the performance of workloads deployed on the Kubernetes cluster. Use this extension to collect memory and CPU utilization metrics from controllers, nodes, and containers.

For more information, see [Azure Monitor Container Insights for Azure Arc-enabled Kubernetes clusters](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md?toc=/azure/azure-arc/kubernetes/toc.json&bc=/azure/azure-arc/kubernetes/breadcrumb/toc.json).

## Azure Policy

Azure Policy extends [Gatekeeper](https://github.com/open-policy-agent/gatekeeper), an admission controller webhook for [Open Policy Agent](https://www.openpolicyagent.org/) (OPA), to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner.

For more information, see [Understand Azure Policy for Kubernetes clusters](../../governance/policy/concepts/policy-for-kubernetes.md?toc=/azure/azure-arc/kubernetes/toc.json&bc=/azure/azure-arc/kubernetes/breadcrumb/toc.json).

## Azure Key Vault Secrets Provider

- **Supported distributions**: AKS on Azure Stack HCI,  AKS enabled by Azure Arc, Cluster API Azure, Google Kubernetes Engine,  Canonical Kubernetes Distribution, OpenShift Kubernetes Distribution, Amazon Elastic Kubernetes Service, VMware Tanzu Kubernetes Grid

The Azure Key Vault Provider for Secrets Store CSI Driver allows for the integration of Azure Key Vault as a secrets store with a Kubernetes cluster via a CSI volume. For Azure Arc-enabled Kubernetes clusters, you can install the Azure Key Vault Secrets Provider extension to fetch secrets.

For more information, see [Use the Azure Key Vault Secrets Provider extension to fetch secrets into Azure Arc-enabled Kubernetes clusters](tutorial-akv-secrets-provider.md).

## Microsoft Defender for Containers

- **Supported distributions**: AKS enabled by Azure Arc, Cluster API Azure, Azure Red Hat OpenShift, Red Hat OpenShift (version 4.6 or newer), Google Kubernetes Engine Standard, Amazon Elastic Kubernetes Service, VMware Tanzu Kubernetes Grid, Rancher Kubernetes Engine, Canonical Kubernetes Distribution

Microsoft Defender for Containers is the cloud-native solution that is used to secure your containers so you can improve, monitor, and maintain the security of your clusters, containers, and their applications. It gathers information related to security like audit log data from the Kubernetes cluster, and provides recommendations and threat alerts based on gathered data.

For more information, see [Enable Microsoft Defender for Containers](/azure/defender-for-cloud/defender-for-kubernetes-azure-arc?toc=/azure/azure-arc/kubernetes/toc.json&bc=/azure/azure-arc/kubernetes/breadcrumb/toc.json).

> [!IMPORTANT]
> Defender for Containers support for Arc-enabled Kubernetes clusters is currently in public preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Azure Arc-enabled Open Service Mesh

- **Supported distributions**: AKS, AKS on Azure Stack HCI,  AKS enabled by Azure Arc, Cluster API Azure, Google Kubernetes Engine, Canonical Kubernetes Distribution, Rancher Kubernetes Engine, OpenShift Kubernetes Distribution, Amazon Elastic Kubernetes Service, VMware Tanzu Kubernetes Grid

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

The Azure Machine Learning extension lets you deploy and run Azure Machine Learning on Azure Arc-enabled Kubernetes clusters.

For more information, see [Introduction to Kubernetes compute target in Azure Machine Learning](../../machine-learning/how-to-attach-kubernetes-anywhere.md) and [Deploy Azure Machine Learning extension on AKS or Arc Kubernetes cluster](../../machine-learning/how-to-deploy-kubernetes-extension.md).

## Flux (GitOps)

- **Supported distributions**: All Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters.

[GitOps on AKS and Azure Arc-enabled Kubernetes](conceptual-gitops-flux2.md) uses [Flux v2](https://fluxcd.io/docs/), a popular open-source tool set, to help manage cluster configuration and application deployment. GitOps is enabled in the cluster as a `Microsoft.KubernetesConfiguration/extensions/microsoft.flux` cluster extension resource.

For more information, see [Tutorial: Deploy applications using GitOps with Flux v2](tutorial-use-gitops-flux2.md).

The most recent version of the Flux v2 extension and the two previous versions (N-2) are supported. We generally recommend that you use the most recent version of the extension.

> [!IMPORTANT]
> The [Flux v2.3.0 release](https://fluxcd.io/blog/2024/05/flux-v2.3.0/) includes API changes to the HelmRelease and HelmChart APIs, with deprecated fields removed, and an updated version of the kustomize package. An upcoming minor version update of Microsoft's Flux extension will include these changes, consistent with the upstream OSS Flux project.
>
> The [HelmRelease](https://fluxcd.io/flux/components/helm/helmreleases/) kind will be promoted from `v2beta1` to `v2` (GA). The `v2` API is backwards compatible with `v2beta1`, with the exception of these deprecated fields, which will be removed:
>
> - `.spec.chart.spec.valuesFile`: replaced by `.spec.chart.spec.valuesFiles`
> - `.spec.postRenderers.kustomize.patchesJson6902`: replaced by `.spec.postRenderers.kustomize.patches`
> - `.spec.postRenderers.kustomize.patchesStrategicMerge`: replaced by `.spec.postRenderers.kustomize.patches`
> - `.status.lastAppliedRevision`: replaced by `.status.history.chartVersion`
>
> The [HelmChart](https://fluxcd.io/flux/components/source/helmcharts/) kind will be promoted from `v1beta2` to `v1` (GA). The `v1` API is backwards compatible with `v1beta2`, with the exception of the `.spec.valuesFile` field, which will be replaced by `.spec.valuesFiles`.
>
> To avoid issues due to breaking changes, we recommend updating your deployments as soon as possible to ensure that your manifests are compliant with this release. Use the new fields which are already available in the current version of the APIs, instead of the fields that will be removed.
>
> The kustomize package will be updated to v5.4.0, which contains the following breaking changes:
>
> - [Kustomization build fails when resources key is missing](https://github.com/kubernetes-sigs/kustomize/issues/5337)
> - [Components are now applied after generators and before transformers](https://github.com/kubernetes-sigs/kustomize/pull/5170) in [v5.1.0](https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize%2Fv5.1.0)
> - [Null yaml values are replaced by "null"](https://github.com/kubernetes-sigs/kustomize/pull/5519) in [v5.4.0](https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize%2Fv5.4.0)


> [!NOTE]
> When a new version of the `microsoft.flux` extension is released, it may take several days for the new version to become available in all regions.

### 1.11.1 (August 2024)

Flux version: [Release v2.3.0](https://github.com/fluxcd/flux2/releases/tag/v2.3.0)

- source-controller: v1.3.0
- kustomize-controller: v1.3.0
- helm-controller: v1.0.1
- notification-controller: v1.3.0
- image-automation-controller: v0.32.1
- image-reflector-controller: v0.38.0

Changes made for this version:

- Update flux OSS controllers.
- Resolved the continuous restart issue of the Fluent Bit sidecar in `fluxconfig-agent` and `fluxconfig-controller`.
- Addressed security vulnerabilities in `fluxconfig-agent` and `fluxconfig-controller` by updating the Go packages.
- Enabled workload identity for the Kustomize controller. For setup instructions, see [Workload identity in AKS clusters](/azure/azure-arc/kubernetes/tutorial-use-gitops-flux2#workload-identity-in-aks-clusters).
- Flux controller pods can now set the annotation `kubernetes.azure.com/set-kube-service-host-fqdn` in their pod specifications. This allows traffic to the API Server's domain name even when a Layer 7 firewall is present, facilitating deployments during extension installation. For more details, see [Configure annotation on Flux extension pods](/azure/azure-arc/kubernetes/tutorial-use-gitops-flux2#configure-annotation-on-flux-extension-pods).

### 1.10.0 (June 2024)

Flux version: [Release v2.1.2](https://github.com/fluxcd/flux2/releases/tag/v2.1.2)

- source-controller: v1.2.5
- kustomize-controller: v1.1.1
- helm-controller: v0.36.2
- notification-controller: v1.1.0
- image-automation-controller: v0.36.1
- image-reflector-controller: v0.30.0

Changes made for this version:

- The `FluxConfig` custom resource now includes support for [OCI repositories](https://fluxcd.io/flux/components/source/ocirepositories/). This enhancement means that Flux configurations can accommodate Git repository, Buckets, Azure Blob storage, or OCI repository as valid source types.

### 1.9.1 (April 2024)

Flux version: [Release v2.1.2](https://github.com/fluxcd/flux2/releases/tag/v2.1.2)

- source-controller: v1.2.5
- kustomize-controller: v1.1.1
- helm-controller: v0.36.2
- notification-controller: v1.1.0
- image-automation-controller: v0.36.1
- image-reflector-controller: v0.30.0

Changes made for this version:

- The log-level parameters for controllers (including `fluxconfig-agent` and `fluxconfig-controller`) are now customizable. For more information, see [Configurable log-level parameters](tutorial-use-gitops-flux2.md#configurable-log-level-parameters).
- Helm chart changes to expose new SSH host key algorithm to connect to Azure DevOps. For more information, see [Azure DevOps SSH-RSA deprecation](tutorial-use-gitops-flux2.md#azure-devops-ssh-rsa-deprecation).

## Dapr extension for Azure Kubernetes Service (AKS) and Arc-enabled Kubernetes

[Dapr](https://dapr.io/) is a portable, event-driven runtime that simplifies building resilient, stateless, and stateful applications that run on the cloud and edge and embrace the diversity of languages and developer frameworks. The Dapr extension eliminates the overhead of downloading Dapr tooling and manually installing and managing the runtime on your clusters.

For more information, see [Dapr extension for AKS and Arc-enabled Kubernetes](/azure/aks/dapr).

## Azure AI Video Indexer

- **Supported distributions**: All Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters

Azure AI Video Indexer enabled by Arc runs video and audio analysis on edge devices. The solution is designed to run on Azure Stack Edge Profile, a heavy edge device, and supports many video formats, including MP4 and other common formats. It supports several languages in all basic audio-related models.

For more information, see [Try Azure AI Video Indexer enabled by Arc](/azure/azure-video-indexer/azure-video-indexer-enabled-by-arc-quickstart).

## Edge Storage Accelerator

- **Supported distributions**: AKS enabled by Azure Arc, AKS Edge Essentials, Ubuntu

[Edge Storage Accelerator (ESA)](../edge-storage-accelerator/index.yml) is a first-party storage system designed for Arc-connected Kubernetes clusters. ESA can be deployed to write files to a "ReadWriteMany" persistent volume claim (PVC) where they are then transferred to Azure Blob Storage. ESA offers a range of features to support Azure IoT Operations and other Azure Arc Services.

For more information, see [What is Edge Storage Accelerator?](../edge-storage-accelerator/overview.md).

## Next steps

- Read more about [cluster extensions for Azure Arc-enabled Kubernetes](conceptual-extensions.md).
- Learn how to [deploy extensions to an Arc-enabled Kubernetes cluster](extensions.md).
