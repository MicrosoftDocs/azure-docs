---
title: "Conceptual overview Azure Kubernetes Configuration Management (GitOps)"
description: "This article provides a conceptual overview of GitOps in Azure for use in Azure Arc-enabled Kubernetes and Azure Kubernetes Service (AKS) clusters."
keywords: "GitOps, Flux, Kubernetes, K8s, Azure, Arc, AKS, Azure Kubernetes Service, containers, devops"
services: azure-arc, aks
ms.service: azure-arc
ms.date: 11/22/2021
ms.topic: conceptual
author: csand-msft
ms.author: csand
---

# GitOps in Azure

Azure provides configuration management capability using GitOps in Azure Arc-enabled Kubernetes and Azure Kubernetes Service (AKS) clusters. You can easily enable and use GitOps in these clusters.

With GitOps, you declare the desired state of your Kubernetes clusters in files in Git repositories. The Git repositories may contain the following files:

* [YAML-formatted manifests](https://yaml.org/) that describe Kubernetes resources (such as Namespaces, Secrets, Deployments, and others)
* [Helm charts](https://helm.sh/docs/topics/charts/) for deploying applications
* [Kustomize files](https://kustomize.io/) to describe environment-specific changes

Because these files are stored in a Git repository, they're versioned, and changes between versions are easily tracked. Kubernetes operators run in the clusters and continually reconcile the cluster state with the desired state declared in the Git repository. These operators pull the files from the Git repositories and apply the desired state to the clusters. The operators also assure that the clusters don't drift from the desired state.

Azure GitOps uses [Flux](https://fluxcd.io/docs/), a popular open-source tool set. Flux provides support for common file sources (Git and Helm repositories, buckets) and file types (YAML, Helm, and Kustomize). Flux also supports multi-tenancy and deployment dependency management, among [other features](https://fluxcd.io/docs/).

## Flux Cluster Extension

![flux extension install diagram](./media/gitops/flux2-extension-install.png)

GitOps is enabled in an Azure Arc-enabled Kubernetes or Azure Kubernetes Service cluster as a `Microsoft.KubernetesConfiguration/extensions/microsoft.flux` [cluster extension](./conceptual-extensions.md) resource.  You can install the `microsoft.flux` extension manually using the portal or the Azure CLI (*az k8s-extension create --extensionType=microsoft.flux*) or have it installed automatically when you create the first `Microsoft.KubernetesConfiguration/fluxConfigurations` in the cluster. The `microsoft.flux` extension must be installed in the cluster before one or more `fluxConfigurations` can be created.

The `microsoft.flux` extension installs the [Flux controllers](https://fluxcd.io/docs/components/) (Source, Kustomize, Helm, Notification) and the FluxConfig CRD, fluxconfig-agent, and fluxconfig-controller. You can optionally install the Flux image-automation and image-reflector controllers, which provide functionality around updating and retrieving Docker images.

* [Flux Source controller](https://toolkit.fluxcd.io/components/source/controller/): Watches the source.toolkit.fluxcd.io custom resources. Handles the synchronization between the Git repositories, Helm repositories, and Buckets. Handles authorization with the source for private Git and Helm repos. Surfaces the latest changes to the source through a tar archive file.
* [Flux Kustomize controller](https://toolkit.fluxcd.io/components/kustomize/controller/): Watches the kustomization.toolkit.fluxcd.io custom resources. Applies Kustomize or raw YAML files from the source onto the cluster.
* [Flux Helm controller](https://toolkit.fluxcd.io/components/helm/controller/): Watches the helm.toolkit.fluxcd.io custom resources. Retrieves the associated chart from the Helm Repository source surfaced by the Source controller. Creates the Helm Chart custom resource and applies the Helm Release with given version, name, and customer-defined values to the cluster.
* [Flux Notification controller](https://toolkit.fluxcd.io/components/notification/controller/): Watches the notification.toolkit.fluxcd.io custom resources. Receives notifications from all Flux controllers. Pushes notifications to user-defined webhook endpoints.
* Flux CRDs: - kustomizations.kustomize.toolkit.fluxcd.io, imagepolicies.image.toolkit.fluxcd.io, imagerepositories.image.toolkit.fluxcd.io, imageupdateautomations.image.toolkit.fluxcd.io, alerts.notification.toolkit.fluxcd.io, providers.notification.toolkit.fluxcd.io, receivers.notification.toolkit.fluxcd.io, buckets.source.toolkit.fluxcd.io, gitrepositories.source.toolkit.fluxcd.io, helmcharts.source.toolkit.fluxcd.io, helmrepositories.source.toolkit.fluxcd.io, helmreleases.helm.toolkit.fluxcd.io, fluxconfigs.clusterconfig.azure.com
* [FluxConfig CRD](https://github.com/Azure/ClusterConfigurationAgent/blob/master/charts/azure-arc-flux/templates/clusterconfig.azure.com_fluxconfigs.yaml): Custom Resource Definition for fluxconfigs.clusterconfig.azure.com CRs that define `FluxConfig` Kubernetes objects.
* fluxconfig-agent: Responsible for watching Azure for new or updated `fluxConfigurations` resources, and for starting the associated Flux configuration in the cluster. Also, is responsible for pushing Flux status changes in the cluster back to Azure for each `fluxConfigurations` resource.
* fluxconfig-controller: Watches the fluxconfigs.clusterconfig.azure.com custom resources and responds to changes with new or updated configuration of GitOps machinery in the cluster.

> [!NOTE]
> The `microsoft.flux` extension is installed in the `flux-system` namespace and has cluster-wide scope. The option to install this extension at the namespace scope is not available, and attempt to install at namespace scope will fail with 400 error.

## Flux Configurations

![flux configuration install diagram](./media/gitops/flux2-config-install.png)

With the `microsoft.flux` extension installed in your cluster, you can then create Flux configuration resources (`Microsoft.KubernetesConfiguration/fluxConfigurations`) to enable GitOps management of the cluster from your Git repos. When you create a `fluxConfigurations` resource, the values you supply for the parameters, such as the target Git repo, are used to create and configure the Kubernetes objects that enable the GitOps process in that cluster. To ensure data security, the `fluxConfigurations` resource data is stored encrypted at rest in an Azure Cosmos database.

The `fluxconfig-agent` and `fluxconfig-controller` agents, installed with the `microsoft.flux` extension, manage the GitOps configuration process.  

`fluxconfig-agent` is responsible for:

* Polls the Kubernetes Configuration data plane service for new or updated `fluxConfigurations` resources.
* Creates or updates `FluxConfig` custom resources in the cluster with the configuration information.
* Watches `FluxConfig` custom resources and pushes status changes back to the associated Azure fluxConfiguration resources.

`fluxconfig-controller` is responsible for:

* Watches status updates to the Flux custom resources created by the managed `fluxConfigurations`.
* Creates default genkey secret that is the private/public key pair that exists for the lifetime of the `fluxConfigurations`; this key is used for auth if the URL is SSH and no user-provided private-key is given.
* Creates custom auth secret based on user-provided private-key/http basic-auth/known-hosts/no-auth data.
* Sets up RBAC (service account provisioned, role binding created/assigned, role created/assigned).
* Creates GitRepository custom resource and Kustomization custom resources from the information in the `FluxConfig` custom resource.

Each `fluxConfigurations` resource in Azure will be associated in a Kubernetes cluster with one Flux `GitRepository` custom resource and one or more `Kustomization` custom resources. When you create a `fluxConfigurations` resource you'll specify, among other information, the URL to the Git repo and the sync target in the Git repo for each `Kustomization`. You can configure dependencies between `Kustomization` custom resources to control deployment sequencing. Also, you can create multiple namespace-scoped `fluxConfigurations` resources on the same cluster, though not with strong multi-tenancy (something we're working to address).

> [!NOTE]
> * `fluxconfig-agent` monitors for new or updated fluxConfiguration resources in Azure. Thus, agents require connectivity to Azure public cloud for the desired state to be applied to the cluster. If agents are unable to connect to Azure, there will be a delay in propagating the desired state to the cluster until the agents can connect.
> * Sensitive customer inputs like private key, known hosts content, HTTPS username, and token/password are stored for less than 48 hours in the Azure Arc enabled Kubernetes service. If you update any of these values in Azure, assure that your clusters connect with Azure within 48 hours.

## Next steps

Advance to the next tutorial to learn how to enable GitOps on your Azure Arc-enabled Kubernetes or Azure Kubernetes Service (AKS) clusters
> [!div class="nextstepaction"]
* [Enable GitOps with Flux](./tutorial-use-gitops-flux2.md)
