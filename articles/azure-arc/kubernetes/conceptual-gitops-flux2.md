---
title: "Application deployments with GitOps (Flux v2)"
description: "This article provides a conceptual overview of GitOps in Azure for use in Azure Arc-enabled Kubernetes and Azure Kubernetes Service (AKS) clusters."
ms.date: 10/04/2023
ms.topic: conceptual
ms.custom: devx-track-azurecli, references-regions
---

# Application deployments with GitOps (Flux v2) for AKS and Azure Arc-enabled Kubernetes

Azure provides an automated application deployments capability using GitOps that works with Azure Kubernetes Service (AKS) and Azure Arc-enabled Kubernetes clusters. The key benefits provided by adopting GitOps for deploying applications to Kubernetes clusters include:

* Continual visibility into the status of applications running on clusters.
* Separation of concerns between application development teams and infrastructure teams. Application teams don't need to have experience with Kubernetes deployments. Platform engineering teams typically create a self-serve model for application teams, empowering them to run deployments with higher confidence.
* Ability to recreate clusters with the same desired state in case of a crash or to scale out.

With GitOps, you declare the desired state of your Kubernetes clusters in files in Git repositories. The Git repositories may contain the following files:

* [YAML-formatted manifests](https://yaml.org/) that describe Kubernetes resources (such as Namespaces, Secrets, Deployments, and others)
* [Helm charts](https://helm.sh/docs/topics/charts/) for deploying applications
* [Kustomize files](https://kustomize.io/) to describe environment-specific changes

Because these files are stored in a Git repository, they're versioned, and changes between versions are easily tracked. Kubernetes controllers run in the clusters and continually reconcile the cluster state with the desired state declared in the Git repository. These operators pull the files from the Git repositories and apply the desired state to the clusters. The operators also continuously assure that the cluster remains in the desired state.

GitOps on Azure Arc-enabled Kubernetes or Azure Kubernetes Service uses [Flux](https://fluxcd.io/docs/), a popular open-source tool set. Flux provides support for common file sources (Git and Helm repositories, Buckets, Azure Blob Storage) and template types (YAML, Helm, and Kustomize). Flux also supports [multi-tenancy](#multi-tenancy) and deployment dependency management, among [other features](https://fluxcd.io/docs/). Flux is deployed directly on the cluster, and each cluster's control plane is logically separated. Hence, it can scale well to hundreds and thousands of clusters. It enables pure pull-based GitOps application deployments. No access to clusters is needed by the source repo or by any other cluster.

## Flux cluster extension

GitOps is enabled in an Azure Arc-enabled Kubernetes or AKS cluster as a `Microsoft.KubernetesConfiguration/extensions/microsoft.flux` [cluster extension](./conceptual-extensions.md) resource.  The `microsoft.flux` extension must be installed in the cluster before one or more `fluxConfigurations` can be created. The extension is installed automatically when you create the first `Microsoft.KubernetesConfiguration/fluxConfigurations` in a cluster, or you can install it manually using the portal, the Azure CLI (`az k8s-extension create --extensionType=microsoft.flux`), ARM template, or REST API.

### Controllers

By default, the `microsoft.flux` extension installs the [Flux controllers](https://fluxcd.io/docs/components/) (Source, Kustomize, Helm, Notification) and the FluxConfig CRD, fluxconfig-agent, and fluxconfig-controller. You can control which of these controllers is installed. Optionally, you can also install the Flux image-automation and image-reflector controllers, which provide functionality for updating and retrieving Docker images.

* [Flux Source controller](https://toolkit.fluxcd.io/components/source/controller/): Watches the `source.toolkit.fluxcd.io` custom resources. Handles synchronization between the Git repositories, Helm repositories, Buckets and Azure Blob storage. Handles authorization with the source for private Git, Helm repos and Azure blob storage accounts. Surfaces the latest changes to the source through a tar archive file.
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

* FluxConfig CRD: Custom Resource Definition for `fluxconfigs.clusterconfig.azure.com` custom resources that define `FluxConfig` Kubernetes objects.
* fluxconfig-agent: Responsible for watching Azure for new or updated `fluxConfigurations` resources, and for starting the associated Flux configuration in the cluster. Also responsible for pushing Flux status changes in the cluster back to Azure for each `fluxConfigurations` resource.
* fluxconfig-controller: Watches the `fluxconfigs.clusterconfig.azure.com` custom resources and responds to changes with new or updated configuration of GitOps machinery in the cluster.

> [!NOTE]
> The `microsoft.flux` extension is installed in the `flux-system` namespace and has [cluster-wide scope](conceptual-extensions.md#extension-scope). The option to install this extension at the namespace scope is not available, and attempts to install at namespace scope will fail with 400 error.

## Flux configurations

:::image type="content" source="media/gitops/flux2-config-install.png" alt-text="Diagram showing the installation of a Flux configuration in an Azure Arc-enabled Kubernetes or AKS cluster." lightbox="media/gitops/flux2-config-install.png":::

You create Flux configuration resources (`Microsoft.KubernetesConfiguration/fluxConfigurations`) to enable GitOps management of the cluster from your Git repos, Bucket sources or Azure Blob Storage. When you create a `fluxConfigurations` resource, the values you supply for the [parameters](#parameters), such as the target Git repo, are used to create and configure the Kubernetes objects that enable the GitOps process in that cluster. To ensure data security, the `fluxConfigurations` resource data is stored encrypted at rest in an Azure Cosmos DB database by the Cluster Configuration service.

The `fluxconfig-agent` and `fluxconfig-controller` agents, installed with the `microsoft.flux` extension, manage the GitOps configuration process.  

`fluxconfig-agent` is responsible for the following tasks:

* Polls the Kubernetes Configuration data plane service for new or updated `fluxConfigurations` resources.
* Creates or updates `FluxConfig` custom resources in the cluster with the configuration information.
* Watches `FluxConfig` custom resources and pushes status changes back to the associated Azure fluxConfiguration resources.

`fluxconfig-controller` is responsible for the following tasks:

* Watches status updates to the Flux custom resources created by the managed `fluxConfigurations`.
* Creates private/public key pair that exists for the lifetime of the `fluxConfigurations`. This key is used for authentication if the URL is SSH based and if the user doesn't provide their own private key during creation of the configuration.
* Creates custom authentication secret based on user-provided private-key/http basic-auth/known-hosts/no-auth data.
* Sets up RBAC (service account provisioned, role binding created/assigned, role created/assigned).
* Creates `GitRepository` or `Bucket` custom resource and `Kustomization` custom resources from the information in the `FluxConfig` custom resource.

Each `fluxConfigurations` resource in Azure is associated with one Flux `GitRepository` or `Bucket` custom resource and one or more `Kustomization` custom resources in a Kubernetes cluster. When you create a `fluxConfigurations` resource, you specify the URL to the source (Git repository, Bucket or Azure Blob storage) and the sync target in the source for each `Kustomization`. You can configure dependencies between `Kustomization` custom resources to control deployment sequencing. You can also create multiple namespace-scoped `fluxConfigurations` resources on the same cluster for different applications and app teams.

> [!NOTE]
> The `fluxconfig-agent` monitors for new or updated `fluxConfiguration` resources in Azure. The agent requires connectivity to Azure for the desired state of the `fluxConfiguration` to be applied to the cluster. If the agent is unable to connect to Azure, there will be a delay in making changes in the cluster until the agent can connect. If the cluster is disconnected from Azure for more than 48 hours, then the request to the cluster will time-out, and the changes will need to be reapplied in Azure.
>
> Sensitive customer inputs like private key and token/password are stored for less than 48 hours in the Kubernetes Configuration service. If you update any of these values in Azure, make sure that your clusters connect with Azure within 48 hours.

### Version support

The most recent version of the Flux v2 extension (`microsoft.flux`) and the two previous versions (N-2) are supported. We generally recommend that you use the [most recent version](extensions-release.md#flux-gitops) of the extension. Starting with `microsoft.flux` version 1.7.0, ARM64-based clusters are supported.

> [!NOTE]
> If you have been using Flux v1, we recommend [migrating to Flux v2](conceptual-gitops-flux2.md#migrate-from-flux-v1) as soon as possible.
>
> Support for Flux v1-based cluster configuration resources created prior to January 1, 2024 will end on [May 24, 2025](https://azure.microsoft.com/updates/migrate-your-gitops-configurations-from-flux-v1-to-flux-v2-by-24-may-2025/). Starting on January 1, 2024, you won't be able to create new Flux v1-based cluster configuration resources.

## GitOps with Private Link

If you've added support for [private link to an Azure Arc-enabled Kubernetes cluster](private-link.md), then the `microsoft.flux` extension works out-of-the-box with communication back to Azure. For connections to your Git repository, Helm repository, or any other endpoints that are needed to deploy your Kubernetes manifests, you must provision these endpoints behind your firewall, or list them on your firewall, so that the Flux Source controller can successfully reach them.

## Data residency

The Azure GitOps service (Azure Kubernetes Configuration Management) stores/processes customer data. By default, customer data is replicated to the paired region. For the regions Singapore, East Asia, and Brazil South, all customer data is stored and processed in the region.

## Apply Flux configurations at scale

Because Azure Resource Manager manages your configurations, you can automate creating the same configuration across all Azure Kubernetes Service and Azure Arc-enabled Kubernetes resources using Azure Policy, within the scope of a subscription or a resource group. This at-scale enforcement ensures that specific configurations are applied consistently across entire groups of clusters.

[Learn how to use the built-in policies for Flux v2](./use-azure-policy-flux-2.md).

## Parameters

To see all the parameters supported by Flux in Azure, see the [`az k8s-configuration` documentation](/cli/azure/k8s-configuration). This implementation doesn't currently support every parameter that Flux supports (see the [official Flux documentation](https://fluxcd.io/docs/)). Let us know if a parameter you need is missing from the Azure implementation.

You can also see the full list of parameters for the `az k8s-configuration flux` by using the `-h` parameter in Azure CLI (for example, `az k8s-configuration flux -h` or `az k8s-configuration flux create -h`).

The following information describes some of the parameters and arguments available for the `az k8s-configuration flux create` command.

### Configuration general arguments

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--cluster-name` `-c` | String | Name of the cluster resource in Azure. |
| `--cluster-type` `-t` | Allowed values: `connectedClusters`, `managedClusters`, `provisionedClusters` | Use `connectedClusters` for Azure Arc-enabled Kubernetes clusters, `managedClusters` for AKS clusters, or `provisionedClusters` for [AKS hybrid clusters provisioned from Azure](extensions.md#aks-hybrid-clusters-provisioned-from-azure-preview) (installing extensions on these clusters is currently in preview). |
| `--resource-group` `-g` | String | Name of the Azure resource group that holds the cluster resource. |
| `--name` `-n`| String | Name of the Flux configuration in Azure. |
| `--namespace` `--ns` | String | Name of the namespace to deploy the configuration.  Default: `default`. |
| `--scope` `-s` | String | Permission scope for the operators. Possible values are `cluster` (full access) or `namespace` (restricted access). Default: `cluster`.
| `--suspend` | flag | Suspends all source and kustomize reconciliations defined in this Flux configuration. Reconciliations active at the time of suspension will continue.  |

### Source general arguments

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--kind` | String | Source kind to reconcile. Allowed values: `bucket`, `git`, `azblob`.  Default: `git`. |
| `--timeout` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Maximum time to attempt to reconcile the source before timing out. Default: `10m`. |
| `--sync-interval` `--interval` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Time between reconciliations of the source on the cluster. Default: `10m`. |

### Git repository source reference arguments

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--branch` | String | Branch within the Git source to sync to the cluster. Default: `master`. Newer repositories might have a root branch named `main`, in which case you need to set `--branch=main`.  |
| `--tag` | String | Tag within the Git source to sync to the cluster. Example: `--tag=3.2.0`. |
| `--semver` | String | Git tag `semver` range within the Git source to sync to the cluster. Example: `--semver=">=3.1.0-rc.1 <3.2.0"`. |
| `--commit` | String | Git commit SHA within the Git source to sync to the cluster. Example: `--commit=363a6a8fe6a7f13e05d34c163b0ef02a777da20a`. |

For more information, see the [Flux documentation on Git repository checkout strategies](https://fluxcd.io/docs/components/source/gitrepositories/#checkout-strategies).

### Public Git repository

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | http[s]://server/repo[.git] | URL of the Git repository source to reconcile with the cluster. |

### Private Git repository with SSH and Flux-created keys

Add the public key generated by Flux to the user account in your Git service provider.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | ssh://user@server/repo[.git] | `git@` should replace `user@` if the public key is associated with the repository instead of the user account. |

### Private Git repository with SSH and user-provided keys

Use your own private key directly or from a file. The key must be in [PEM format](https://aka.ms/PEMformat) and end with a newline (`\n`).

Add the associated public key to the user account in your Git service provider.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | ssh://user@server/repo[.git] | `git@` should replace `user@` if the public key is associated with the repository instead of the user account. |
| `--ssh-private-key` | Base64 key in [PEM format](https://aka.ms/PEMformat) | Provide the key directly. |
| `--ssh-private-key-file` | Full path to local file | Provide the full path to the local file that contains the PEM-format key.

### Private Git host with SSH and user-provided known hosts

The Flux operator maintains a list of common Git hosts in its `known_hosts` file. Flux uses this information to authenticate the Git repository before establishing the SSH connection. If you're using an uncommon Git repository or your own Git host, you can supply the host key so that Flux can identify your repository.

Just like private keys, you can provide your `known_hosts` content directly or in a file. When you're providing your own content, use the [known_hosts content format specifications](https://aka.ms/KnownHostsFormat), along with either of the preceding SSH key scenarios.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | ssh://user@server/repo[.git] | `git@` can replace `user@`. |
| `--known-hosts` | Base64 string | Provide `known_hosts` content directly. |
| `--known-hosts-file` | Full path to local file | Provide `known_hosts` content in a local file. |

### Private Git repository with an HTTPS user and key

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | `https://server/repo[.git]` | HTTPS with Basic Authentication. |
| `--https-user` | Raw string | HTTPS username. |
| `--https-key` | Raw string | HTTPS personal access token or password.

### Private Git repository with an HTTPS CA certificate

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | `https://server/repo[.git]` | HTTPS with Basic Authentication. |
| `--https-ca-cert` | Base64 string | CA certificate for TLS communication. |
| `--https-ca-cert-file` | Full path to local file | Provide CA certificate content in a local file. |

### Bucket source arguments

If you use `bucket` source, here are the bucket-specific command arguments.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | URL String | The URL for the `bucket`. Formats supported: `http://`, `https://`. |
| `--bucket-name` | String | Name of the `bucket` to sync. |
| `--bucket-access-key` | String | Access Key ID used to authenticate with the `bucket`. |
| `--bucket-secret-key` | String | Secret Key used to authenticate with the `bucket`. |
| `--bucket-insecure` | Boolean | Communicate with a `bucket` without TLS.  If not provided, assumed false; if provided, assumed true. |

### Azure Blob Storage Account source arguments

If you use `azblob` source, here are the blob-specific command arguments.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--url` `-u` | URL String | The URL for the `azblob`. |
| `--container-name` | String | Name of the Azure Blob Storage container to sync |
| `--sp_client_id` | String | The client ID for authenticating a service principal with Azure Blob, required for this authentication method |
| `--sp_tenant_id` | String | The tenant ID for authenticating a service principal with Azure Blob, required for this authentication method |
| `--sp_client_secret` | String | The client secret for authenticating a service principal with Azure Blob |
| `--sp_client_cert` | String | The Base64 encoded client certificate for authenticating a service principal with Azure Blob |
| `--sp_client_cert_password` | String | The password for the client certificate used to authenticate a service principal with Azure Blob |
| `--sp_client_cert_send_chain` | String | Specifies whether to include x5c header in client claims when acquiring a token to enable subject name / issuer based authentication for the client certificate |
| `--account_key` | String | The Azure Blob Shared Key for authentication |
| `--sas_token` | String | The Azure Blob SAS Token for authentication |
| `--managed-identity-client-id` | String | The client ID of the managed identity for authentication with Azure Blob |

> [!IMPORTANT]
> When using managed identity authentication for AKS clusters and `azblob` source, the managed identity must be assigned at minimum the [Storage Blob Data Reader](/azure/role-based-access-control/built-in-roles#storage-blob-data-reader) role. Authentication using a managed identity is not yet available for Azure Arc-enabled Kubernetes clusters.

### Local secret for authentication with source

You can use a local Kubernetes secret for authentication with a `git`, `bucket` or `azBlob` source.  The local secret must contain all of the authentication parameters needed for the source and must be created in the same namespace as the Flux configuration.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--local-auth-ref` `--local-ref`  | String | Local reference to a Kubernetes secret in the Flux configuration namespace to use for authentication with the source. |

For HTTPS authentication, you create a secret with the `username` and `password`:

```azurecli
kubectl create ns flux-config
kubectl create secret generic -n flux-config my-custom-secret --from-literal=username=<my-username> --from-literal=password=<my-password-or-key>
```

For SSH authentication, you create a secret with the `identity` and `known_hosts` fields:

```azurecli
kubectl create ns flux-config
kubectl create secret generic -n flux-config my-custom-secret --from-file=identity=./id_rsa --from-file=known_hosts=./known_hosts
```

For both cases, when you create the Flux configuration, use `--local-auth-ref my-custom-secret` in place of the other authentication parameters:

```azurecli
az k8s-configuration flux create -g <cluster_resource_group> -c <cluster_name> -n <config_name> -t connectedClusters --scope cluster --namespace flux-config -u <git-repo-url> --kustomization name=kustomization1 --local-auth-ref my-custom-secret
```

Learn more about using a local Kubernetes secret with these authentication methods:

* [Git repository HTTPS authentication](https://fluxcd.io/docs/components/source/gitrepositories/#https-authentication)
* [Git repository HTTPS self-signed certificates](https://fluxcd.io/docs/components/source/gitrepositories/#https-self-signed-certificates)
* [Git repository SSH authentication](https://fluxcd.io/docs/components/source/gitrepositories/#ssh-authentication)
* [Bucket static authentication](https://fluxcd.io/docs/components/source/buckets/#static-authentication)

> [!NOTE]
> If you need Flux to access the source through your proxy, you must update the Azure Arc agents with the proxy settings. For more information, see [Connect using an outbound proxy server](./quickstart-connect-cluster.md?tabs=azure-cli-connect-using-an-outbound-proxy-server).

### Git implementation

To support various repository providers that implement Git, Flux can be configured to use one of two Git libraries: `go-git` or `libgit2`. For details, see the [Flux documentation](https://fluxcd.io/docs/components/source/gitrepositories/#git-implementation).

The GitOps implementation of Flux v2 automatically determines which library to use for public cloud repositories:

* For GitHub, GitLab, and BitBucket repositories, Flux uses `go-git`.
* For Azure DevOps and all other repositories, Flux uses `libgit2`.

For on-premises repositories, Flux uses `libgit2`.

### Kustomization

Kustomization is a setting created for Flux configurations that lets you choose a specific path in the source repo that is reconciled into the cluster. You don't need to create a `kustomization.yaml file on this specified path. By default, all of the manifests in this path will be reconciled. However, if you want to have a Kustomize overlay for applications available on this repo path, you should create [Kustomize files](https://kustomize.io/) in git for the flux configuration to make use of.

By using [`az k8s-configuration flux kustomization create`](/cli/azure/k8s-configuration/flux/kustomization#az-k8s-configuration-flux-kustomization-create), you can create one or more kustomizations during the configuration.

| Parameter | Format | Notes |
| ------------- | ------------- | ------------- |
| `--kustomization` | No value | Start of a string of parameters that configure a kustomization. You can use it multiple times to create multiple kustomizations. |
| `name` | String | Unique name for this kustomization. |
| `path` | String | Path within the Git repository to reconcile with the cluster. Default is the top level of the branch. |
| `prune` | Boolean | Default is `false`. Set `prune=true` to assure that the objects that Flux deployed to the cluster will be cleaned up if they're removed from the repository or if the Flux configuration or kustomizations are deleted. Using `prune=true` is important for environments where users don't have access to the clusters and can make changes only through the Git repository. |
| `depends_on` | String | Name of one or more kustomizations (within this configuration) that must reconcile before this kustomization can reconcile. For example: `depends_on=["kustomization1","kustomization2"]`. If you remove a kustomization that has dependent kustomizations, the state of dependent kustomizations becomes `DependencyNotReady`, and reconciliation will halt.|
| `timeout` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Default: `10m`.  |
| `sync_interval` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Default: `10m`.  |
| `retry_interval` | [golang duration format](https://pkg.go.dev/time#Duration.String) | Default: `10m`.  |
| `validation` | String | Values: `none`, `client`, `server`. Default: `none`.  See [Flux documentation](https://fluxcd.io/docs/) for details.|
| `force` | Boolean | Default: `false`. Set `force=true` to instruct the kustomize controller to re-create resources when patching fails because of an immutable field change. |

You can also use [`az k8s-configuration flux kustomization`](/cli/azure/k8s-configuration/flux/kustomization) to update, list, show, and delete kustomizations in a Flux configuration.

## Multi-tenancy

Flux v2 supports [multi-tenancy](https://github.com/fluxcd/flux2-multi-tenancy) in [version 0.26](https://fluxcd.io/blog/2022/01/january-update/#flux-v026-more-secure-by-default). This capability has been integrated into Azure GitOps with Flux v2.

> [!NOTE]
> For the multi-tenancy feature, you need to know if your manifests contain any cross-namespace sourceRef for HelmRelease, Kustomization, ImagePolicy, or other objects, or [if you use a Kubernetes version less than 1.20.6](https://fluxcd.io/blog/2022/01/january-update/#flux-v026-more-secure-by-default). To prepare:
>
> * Upgrade to Kubernetes version 1.20.6 or greater.
> * In your Kubernetes manifests, assure that all `sourceRef` are to objects within the same namespace as the GitOps configuration.
>   * If you need time to update your manifests, you can [opt out of multi-tenancy](#opt-out-of-multi-tenancy). However, you still need to upgrade your Kubernetes version.

### Update manifests for multi-tenancy

Let’s say you deploy a `fluxConfiguration` to one of our Kubernetes clusters in the **cluster-config** namespace with cluster scope. You configure the source to sync the `https://github.com/fluxcd/flux2-kustomize-helm-example` repo. This is the same sample Git repo used in the [Deploy applications using GitOps with Flux v2 tutorial](tutorial-use-gitops-flux2.md). After Flux syncs the repo, it deploys the resources described in the manifests (YAML files). Two of the manifests describe HelmRelease and HelmRepository objects.

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: nginx
  namespace: nginx
spec:
  releaseName: nginx-ingress-controller
  chart:
    spec:
      chart: nginx-ingress-controller
      sourceRef:
        kind: HelmRepository
        name: bitnami
        namespace: flux-system
      version: "5.6.14"
  interval: 1h0m0s
  install:
    remediation:
      retries: 3
  # Default values
  # https://github.com/bitnami/charts/blob/master/bitnami/nginx-ingress-controller/values.yaml
  values:
    service:
      type: NodePort
```

```yaml
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: bitnami
  namespace: flux-system
spec:
  interval: 30m
  url: https://charts.bitnami.com/bitnami
```

By default, the Flux extension will deploy the `fluxConfigurations` by impersonating the **flux-applier** service account that is deployed only in the **cluster-config** namespace. Using the above manifests, when multi-tenancy is enabled the HelmRelease would be blocked. This is because the HelmRelease is in the **nginx** namespace and is referencing a HelmRepository in the **flux-system** namespace. Also, the Flux helm-controller cannot apply the HelmRelease, because there is no **flux-applier** service account in the **nginx** namespace.

To work with multi-tenancy, the correct approach is to deploy all Flux objects into the same namespace as the `fluxConfigurations`. This approach avoids the cross-namespace reference issue, and allows the Flux controllers to get the permissions to apply the objects. Thus, for a GitOps configuration created in the **cluster-config** namespace, these example manifests would change as follows:

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: nginx
  namespace: cluster-config 
spec:
  releaseName: nginx-ingress-controller
  targetNamespace: nginx
  chart:
    spec:
      chart: nginx-ingress-controller
      sourceRef:
        kind: HelmRepository
        name: bitnami
        namespace: cluster-config
      version: "5.6.14"
  interval: 1h0m0s
  install:
    remediation:
      retries: 3
  # Default values
  # https://github.com/bitnami/charts/blob/master/bitnami/nginx-ingress-controller/values.yaml
  values:
    service:
      type: NodePort
```

```yaml
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: bitnami
  namespace: cluster-config
spec:
  interval: 30m
  url: https://charts.bitnami.com/bitnami
```

### Opt out of multi-tenancy

When the `microsoft.flux` extension is installed, multi-tenancy is enabled by default to assure security by default in your clusters.  However, if you need to disable multi-tenancy, you can opt out by creating or updating the `microsoft.flux` extension in your clusters with "--configuration-settings multiTenancy.enforce=false":

```azurecli
az k8s-extension create --extension-type microsoft.flux --configuration-settings multiTenancy.enforce=false -c CLUSTER_NAME -g RESOURCE_GROUP -n flux -t <managedClusters or connectedClusters>
```

```azurecli
az k8s-extension update --configuration-settings multiTenancy.enforce=false -c CLUSTER_NAME -g RESOURCE_GROUP -n flux -t <managedClusters or connectedClusters>
```

## Migrate from Flux v1

If you are still using Flux v1, we recommend migrating to Flux v2 as soon as possible.

To migrate to using Flux v2 in the same clusters where you've been using Flux v1, you must first delete all Flux v1 `sourceControlConfigurations` from the clusters. Because Flux v2 has a fundamentally different architecture, the `microsoft.flux` cluster extension won't install if there are Flux v1 `sourceControlConfigurations` resources in a cluster. The process of removing Flux v1 configurations and deploying Flux v2 configurations should not take more than 30 minutes.

Removing Flux v1 `sourceControlConfigurations` doesn't stop any applications that are running on the clusters. However, during the period when Flux v1 configuration is removed and Flux v2 extension is not yet fully deployed:

* If there are new changes in the application manifests stored in a Git repository, these are not pulled during the migration, and the application version deployed on the cluster will be stale.
* If there are unintended changes in the cluster state and it deviates from the desired state specified in source Git repository, the cluster won't be able to self-heal.

We recommend testing your migration scenario in a development environment before migrating your production environment.

### View and delete Flux v1 configurations

Use these Azure CLI commands to find and then delete existing `sourceControlConfigurations` in a cluster:

```azurecli
az k8s-configuration list --cluster-name <Arc or AKS cluster name> --cluster-type <connectedClusters OR managedClusters> --resource-group <resource group name>
az k8s-configuration delete --name <configuration name> --cluster-name <Arc or AKS cluster name> --cluster-type <connectedClusters OR managedClusters> --resource-group <resource group name>
```

You can also view and delete existing GitOps configurations for a cluster in the Azure portal. To do so, navigate to the cluster where the configuration was created and select **GitOps** in the left pane. Select the configuration, then select **Delete**.

### Deploy Flux v2 configurations

Use the Azure portal or Azure CLI to [apply Flux v2 configurations](tutorial-use-gitops-flux2.md#apply-a-flux-configuration) to your clusters.

### Flux v1 retirement information

The open-source project of Flux v1 has been archived, and feature development has been stopped indefinitely. For more information, see the [fluxcd project](https://fluxcd.io/docs/migration/).

Flux v2 was launched as the upgraded open-source project of Flux. It has a new architecture and supports more GitOps use cases. Microsoft launched a version of an extension using Flux v2 in May 2022. Since then, customers have been advised to move to Flux v2 within three years, as support for using Flux v1 is scheduled to end in May 2025.

Key new features introduced in the GitOps extension for Flux v2:

* Flux v1 is a monolithic do-it-all operator. Flux v2 separates the functionalities into [specialized controllers](#controllers) (Source controller, Kustomize controller, Helm controller, and Notification controller).
* Supports synchronization with multiple source repositories.
* Supports [multi-tenancy](#multi-tenancy), like applying each source repository with its own set of permissions.
* Provides operational insights through health checks, events and alerts.
* Supports Git branches, pinning on commits and tags, and following SemVer tag ranges.
* Credentials configuration per GitRepository resource: SSH private key, HTTP/S username/password/token, and OpenPGP public keys.

## Next steps

* Use our tutorial to learn how to [enable GitOps on your AKS or Azure Arc-enabled Kubernetes clusters](tutorial-use-gitops-flux2.md).
* Learn about [CI/CD workflow using GitOps](conceptual-gitops-flux2-ci-cd.md).
