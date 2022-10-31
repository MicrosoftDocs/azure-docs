---
title: "GitOps Flux v2 configurations with AKS and Azure Arc-enabled Kubernetes"
description: "This article provides a conceptual overview of GitOps in Azure for use in Azure Arc-enabled Kubernetes and Azure Kubernetes Service (AKS) clusters."
keywords: "GitOps, Flux, Kubernetes, K8s, Azure, Arc, AKS, Azure Kubernetes Service, containers, devops"
services: azure-arc, aks
ms.service: azure-arc
ms.date: 10/12/2022
ms.topic: conceptual
---

# GitOps Flux v2 configurations with AKS and Azure Arc-enabled Kubernetes

Azure provides configuration management capability using GitOps in Azure Kubernetes Service (AKS) and Azure Arc-enabled Kubernetes clusters. You can easily enable and use GitOps in these clusters.

With GitOps, you declare the desired state of your Kubernetes clusters in files in Git repositories. The Git repositories may contain the following files:

* [YAML-formatted manifests](https://yaml.org/) that describe Kubernetes resources (such as Namespaces, Secrets, Deployments, and others)
* [Helm charts](https://helm.sh/docs/topics/charts/) for deploying applications
* [Kustomize files](https://kustomize.io/) to describe environment-specific changes

Because these files are stored in a Git repository, they're versioned, and changes between versions are easily tracked. Kubernetes controllers run in the clusters and continually reconcile the cluster state with the desired state declared in the Git repository. These operators pull the files from the Git repositories and apply the desired state to the clusters. The operators also continuously assure that the cluster remains in the desired state.

GitOps on Azure Arc-enabled Kubernetes or Azure Kubernetes Service uses [Flux](https://fluxcd.io/docs/), a popular open-source tool set. Flux provides support for common file sources (Git and Helm repositories, Buckets) and template types (YAML, Helm, and Kustomize). Flux also supports multi-tenancy and deployment dependency management, among [other features](https://fluxcd.io/docs/).

## Flux cluster extension

:::image type="content" source="media/gitops/flux2-extension-install-arc.png" alt-text="Diagram showing the installation of the Flux extension for Azure Arc-enabled Kubernetes cluster." lightbox="media/gitops/flux2-extension-install-arc.png":::

:::image type="content" source="media/gitops/flux2-extension-install-aks.png" alt-text="Diagram showing the installation of the Flux extension for Azure Kubernetes Service cluster." lightbox="media/gitops/flux2-extension-install-aks.png":::

GitOps is enabled in an Azure Arc-enabled Kubernetes or AKS cluster as a `Microsoft.KubernetesConfiguration/extensions/microsoft.flux` [cluster extension](./conceptual-extensions.md) resource.  The `microsoft.flux` extension must be installed in the cluster before one or more `fluxConfigurations` can be created. The extension will be installed automatically when you create the first `Microsoft.KubernetesConfiguration/fluxConfigurations` in a cluster, or you can install it manually using the portal, the Azure CLI (*az k8s-extension create --extensionType=microsoft.flux*), ARM template, or REST API.

### Version support

The most recent version of the Flux v2 extension and the two previous versions (N-2) are supported. We generally recommend that you use the most recent version of the extension.

### Controllers

The `microsoft.flux` extension installs by default the [Flux controllers](https://fluxcd.io/docs/components/) (Source, Kustomize, Helm, Notification) and the FluxConfig CRD, fluxconfig-agent, and fluxconfig-controller. You can control which of these controllers is installed and can optionally install the Flux image-automation and image-reflector controllers, which provide functionality around updating and retrieving Docker images.

* [Flux Source controller](https://toolkit.fluxcd.io/components/source/controller/): Watches the source.toolkit.fluxcd.io custom resources. Handles the synchronization between the Git repositories, Helm repositories, and Buckets. Handles authorization with the source for private Git and Helm repos. Surfaces the latest changes to the source through a tar archive file.
* [Flux Kustomize controller](https://toolkit.fluxcd.io/components/kustomize/controller/): Watches the `kustomization.toolkit.fluxcd.io` custom resources. Applies Kustomize or raw YAML files from the source onto the cluster.
* [Flux Helm controller](https://toolkit.fluxcd.io/components/helm/controller/): Watches the `helm.toolkit.fluxcd.io` custom resources. Retrieves the associated chart from the Helm Repository source surfaced by the Source controller. Creates the `HelmChart` custom resource and applies the `HelmRelease` with given version, name, and customer-defined values to the cluster.
* [Flux Notification controller](https://toolkit.fluxcd.io/components/notification/controller/): Watches the `notification.toolkit.fluxcd.io` custom resources. Receives notifications from all Flux controllers. Pushes notifications to user-defined webhook endpoints.
* Flux Custom Resource Definitions:

  * `kustomizations.kustomize.toolkit.fluxcd.io`
  * `imagepolicies.image.toolkit.fluxcd.io`
  * `imagerepositories.image.toolkit.fluxcd.io`
  * `imageupdateautomations.image.toolkit.fluxcd.io`
  * `alerts.notification.toolkit.fluxcd.io`
  * `providers.notification.toolkit.fluxcd.io`
  * `receivers.notification.toolkit.fluxcd.io`
  * `buckets.source.toolkit.fluxcd.io`
  * `gitrepositories.source.toolkit.fluxcd.io`
  * `helmcharts.source.toolkit.fluxcd.io`
  * `helmrepositories.source.toolkit.fluxcd.io`
  * `helmreleases.helm.toolkit.fluxcd.io`
  * `fluxconfigs.clusterconfig.azure.com`

* [FluxConfig CRD](https://github.com/Azure/ClusterConfigurationAgent/blob/master/charts/azure-k8s-flux/templates/clusterconfig.azure.com_fluxconfigs.yaml): Custom Resource Definition for `fluxconfigs.clusterconfig.azure.com` custom resources that define `FluxConfig` Kubernetes objects.
* fluxconfig-agent: Responsible for watching Azure for new or updated `fluxConfigurations` resources, and for starting the associated Flux configuration in the cluster. Also, is responsible for pushing Flux status changes in the cluster back to Azure for each `fluxConfigurations` resource.
* fluxconfig-controller: Watches the `fluxconfigs.clusterconfig.azure.com` custom resources and responds to changes with new or updated configuration of GitOps machinery in the cluster.

> [!NOTE]
> The `microsoft.flux` extension is installed in the `flux-system` namespace and has cluster-wide scope. The option to install this extension at the namespace scope is not available, and attempt to install at namespace scope will fail with 400 error.

## Flux configurations

:::image type="content" source="media/gitops/flux2-config-install.png" alt-text="Diagram showing the installation of a Flux configuration in an Azure Arc-enabled Kubernetes or Azure Kubernetes Service cluster." lightbox="media/gitops/flux2-config-install.png":::

You create Flux configuration resources (`Microsoft.KubernetesConfiguration/fluxConfigurations`) to enable GitOps management of the cluster from your Git repos or Bucket sources. When you create a `fluxConfigurations` resource, the values you supply for the parameters, such as the target Git repo, are used to create and configure the Kubernetes objects that enable the GitOps process in that cluster. To ensure data security, the `fluxConfigurations` resource data is stored encrypted at rest in an Azure Cosmos DB database by the Cluster Configuration service.

The `fluxconfig-agent` and `fluxconfig-controller` agents, installed with the `microsoft.flux` extension, manage the GitOps configuration process.  

`fluxconfig-agent` is responsible for:

* Polls the Kubernetes Configuration data plane service for new or updated `fluxConfigurations` resources.
* Creates or updates `FluxConfig` custom resources in the cluster with the configuration information.
* Watches `FluxConfig` custom resources and pushes status changes back to the associated Azure fluxConfiguration resources.

`fluxconfig-controller` is responsible for:

* Watches status updates to the Flux custom resources created by the managed `fluxConfigurations`.
* Creates private/public key pair that exists for the lifetime of the `fluxConfigurations`. This key is used for authentication if the URL is SSH based and if the user doesn't provide their own private key during creation of the configuration.
* Creates custom authentication secret based on user-provided private-key/http basic-auth/known-hosts/no-auth data.
* Sets up RBAC (service account provisioned, role binding created/assigned, role created/assigned).
* Creates `GitRepository` or `Bucket` custom resource and `Kustomization` custom resources from the information in the `FluxConfig` custom resource.

Each `fluxConfigurations` resource in Azure will be associated in a Kubernetes cluster with one Flux `GitRepository` or `Bucket` custom resource and one or more `Kustomization` custom resources. When you create a `fluxConfigurations` resource, you'll specify, among other information, the URL to the source (Git repository or Bucket) and the sync target in the source for each `Kustomization`. You can configure dependencies between `Kustomization` custom resources to control deployment sequencing. Also, you can create multiple namespace-scoped `fluxConfigurations` resources on the same cluster for different applications and app teams.

> [!NOTE]
> The `fluxconfig-agent` monitors for new or updated `fluxConfiguration` resources in Azure. The agent requires connectivity to Azure for the desired state of the `fluxConfiguration` to be applied to the cluster. If the agent is unable to connect to Azure, there will be a delay in making the changes in the cluster until the agent can connect. If the cluster is disconnected from Azure for more than 48 hours, then the request to the cluster will time-out, and the changes will need to be re-applied in Azure.
>
> Sensitive customer inputs like private key and token/password are stored for less than 48 hours in the Kubernetes Configuration service. If you update any of these values in Azure, make sure that your clusters connect with Azure within 48 hours.

## GitOps with Private Link

If you've added support for [private link to an Azure Arc-enabled Kubernetes cluster](private-link.md), then the `microsoft.flux` extension works out-of-the-box with communication back to Azure. For connections to your Git repository, Helm repository, or any other endpoints that are needed to deploy your Kubernetes manifests, you will need to provision these endpoints behind your firewall or list them on your firewall so that the Flux Source controller can successfully reach them.

## Data residency

The Azure GitOps service (Azure Kubernetes Configuration Management) stores/processes customer data. By default, customer data is replicated to the paired region. For the regions Singapore, East Asia, and Brazil South, all customer data is stored and processed in the region.

## Apply Flux configurations at scale

Because Azure Resource Manager manages your configurations, you can automate creating the same configuration across all Azure Kubernetes Service and Azure Arc-enabled Kubernetes resources using Azure Policy, within the scope of a subscription or a resource group. This at-scale enforcement ensures that specific configurations will be applied consistently across entire groups of clusters.

[Learn how to use the built-in policies for Flux v2](./use-azure-policy-flux-2.md).

## Next steps

Advance to the next tutorial to learn how to enable GitOps on your AKS or Azure Arc-enabled Kubernetes clusters:

> [!div class="nextstepaction"]
* [Enable GitOps with Flux](./tutorial-use-gitops-flux2.md)
