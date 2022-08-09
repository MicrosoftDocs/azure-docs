---
title: "GitOps Flux v2 configurations with AKS and Azure Arc-enabled Kubernetes"
description: "This article provides a conceptual overview of GitOps in Azure for use in Azure Arc-enabled Kubernetes and Azure Kubernetes Service (AKS) clusters."
keywords: "GitOps, Flux, Kubernetes, K8s, Azure, Arc, AKS, Azure Kubernetes Service, containers, devops"
services: azure-arc, aks
ms.service: azure-arc
ms.date: 5/26/2022
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

GitOps is enabled in an Azure Arc-enabled Kubernetes or AKS cluster as a `Microsoft.KubernetesConfiguration/extensions/microsoft.flux` [cluster extension](./conceptual-extensions.md) resource.  The `microsoft.flux` extension must be installed in the cluster before one or more `fluxConfigurations` can be created.  The extension will be installed automatically when you create the first `Microsoft.KubernetesConfiguration/fluxConfigurations` in a cluster, or you can install it manually using the portal, the Azure CLI, ARM template, or REST API.

### [Azure CLI](#tab/install-azure-cli)

```azurecli
az k8s-extension create --name flux --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --extension-type microsoft.flux
```

### [ARM Template](#tab/install-arm-template)

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "ConnectedClusterName": {
            "defaultValue": "<cluster-name>",
            "type": "String",
            "metadata": {
                "description": "The Connected Cluster name."
            }
        },
        "ExtensionInstanceName": {
            "defaultValue": "flux",
            "type": "String",
            "metadata": {
                "description": "The extension instance name."
            }
        },
        "ExtensionType": {
            "defaultValue": "microsoft.flux",
            "type": "String",
            "metadata": {
                "description": "The extension type."
            }
        },
        "ReleaseTrain": {
            "defaultValue": "stable",
            "type": "String",
            "metadata": {
                "description": "The release train."
            }
        }
    },
    "functions": [],
    "resources": [
        {
            "type": "Microsoft.KubernetesConfiguration/extensions",
            "apiVersion": "2021-09-01",
            "name": "[parameters('ExtensionInstanceName')]",
            "identity": {
                "type": "SystemAssigned"
            },
            "properties": {
                "extensionType": "[parameters('ExtensionType')]",
                "releaseTrain": "[parameters('ReleaseTrain')]"
            },
            "scope": "[concat('Microsoft.Kubernetes/connectedClusters/', parameters('ConnectedClusterName'))]"
        }
    ]
}
```

> [!NOTE]
> You can also specify `version` under `properties` to pin a certain extension version. However, this deactivates auto upgrades to minor versions.

---

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
You can create and manage `fluxConfigurations` via the Azure Portal, Azure CLI, ARM template, or REST API.

### [Azure Portal](#tab/create-configurations-azure-portal)

1. In the [Azure portal](https://portal.azure.com/#home), navigate to **Kubernetes - Azure Arc** and select your cluster.
1. Select **GitOps** (under **Settings**), and then select **+ Create**.
1. Provide required inputs for **Basics**, **Source**, **Kustomizations**, and then go to **Review + Create**.
1. Click **Refresh** to observe the State of the newly created GitOps configuration.

### [Azure CLI](#tab/create-configurations-azure-cli)

```azurecli
az k8s-configuration flux create -g <resource-group> -c <cluster-name> -n <configuration-name> -t connectedClusters --scope cluster --url <url-source-to-reconcile> --branch <git-branch> --kustomization <kustomization-parameters-as-key-value-pairs>
```

> [!NOTE]
> This creates a configuration for a public git repository. See the Azure CLI reference for additional options.

### [ARM Template](#tab/create-configurations-arm-template)

This provides a minimal example to create a cluster-scoped Flux configuration for a public git repository.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.KubernetesConfiguration/fluxConfigurations",
            "apiVersion": "2022-03-01",
            "name": "<name-of-configuration>",
            "scope": "Microsoft.Kubernetes/connectedClusters/<connected-cluster-name>",
            "properties": {
                "configurationProtectedSettings": {},
                "gitRepository": {
                    "repositoryRef": {
                        "branch": "<git-repository-branch-name>"
                    },
                    "url": "<git-repository-url>"
                },
                "kustomizations": {
                    "<name-of-kustomization>": {
                        "path": "<path-to-kustomization>"
                    }
                },
                "scope": "cluster",
                "sourceKind": "GitRepository"
            }
        }
    ]
}
```

> [!NOTE]
> Connecting to a private git repository requires to pass a Base64-encoded `https-key` or a `ssh-private-key` to the `configurationProtectedSettings`.

---

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
> * `fluxconfig-agent` monitors for new or updated `fluxConfiguration` resources in Azure. The agent requires connectivity to Azure for the desired state of the `fluxConfiguration` to be applied to the cluster. If the agent is unable to connect to Azure, there will be a delay in making the changes in the cluster until the agent can connect. If the cluster is disconnected from Azure for more than 48 hours, then the request to the cluster will time-out, and the changes will need to be re-applied in Azure.
> * Sensitive customer inputs like private key and token/password are stored for less than 48 hours in the Kubernetes Configuration service. If you update any of these values in Azure, assure that your clusters connect with Azure within 48 hours.

## GitOps with Private Link

If you've added support for private link to an Azure Arc-enabled Kubernetes cluster, then the `microsoft.flux` extension works out-of-the-box with communication back to Azure. For connections to your Git repository, Helm repository, or any other endpoints that are needed to deploy your Kubernetes manifests, you will need to provision these endpoints behind your firewall or list them on your firewall so that the Flux Source controller can successfully reach them.

For more information on private link scopes in Azure Arc, refer to [this document](../servers/private-link-security.md#create-a-private-link-scope).

## Data residency
The Azure GitOps service (Azure Kubernetes Configuration Management) stores/processes customer data. By default, customer data is replicated to the paired region. For the regions Singapore, East Asia, and Brazil South, all customer data is stored and processed in the region.

## Next steps

Advance to the next tutorial to learn how to enable GitOps on your AKS or Azure Arc-enabled Kubernetes clusters
> [!div class="nextstepaction"]
* [Enable GitOps with Flux](./tutorial-use-gitops-flux2.md)
