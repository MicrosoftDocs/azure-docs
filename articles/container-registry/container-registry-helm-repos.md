---
title:  Store Helm charts
description: Learn how to store Helm charts for your Kubernetes applications using repositories in Azure Container Registry
ms.topic: article
ms.date: 01/28/2020
---

# Push and pull Helm charts to an Azure container registry

To quickly manage and deploy applications for Kubernetes, you can use the [open-source Helm package manager][helm]. With Helm, application packages are defined as [charts](https://helm.sh/docs/topics/charts/), which are collected and stored in a [Helm chart repository](https://helm.sh/docs/topics/chart_repository/).

This article shows you how to host Helm charts in repositories in an Azure container registry, using either a Helm 2 or Helm 3 installation. For this example, you store an existing Helm chart from the public Helm *stable* repo. In many scenarios, you would build and upload your own charts for the applications you develop. For more information on how to build your own Helm charts, see the [Chart Template Developer's Guide][develop-helm-charts].

> [!IMPORTANT]
> Support for Helm charts in Azure Container Registry is currently in preview. Previews are made available to you on the condition that you agree to the supplemental [terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Helm 2 or Helm 3?

To store, manage, and install Helm charts, you use a Helm client and the Helm CLI. Major releases of the Helm client include Helm 2 and Helm 3. Helm 3 supports a new chart format and no longer installs the Tiller server-side component. For details on the differences between Helm 2 and Helm 3, see the [version FAQ](https://helm.sh/docs/faq/). If you've previously deployed Helm 2 charts, see [Migrating Helm v2 to v3](https://helm.sh/docs/topics/v2_v3_migration/).

You can use either Helm 2 or Helm 3 to host Helm charts in Azure Container Registry, with workflows specific to each version:

* [Helm 3 client](#use-the-helm-3-client) - use `helm chart` commands to manage charts in your registry as [OCI artifacts](container-registry-image-formats.md#oci-artifacts)
* [Helm 2 client](#use-the-helm-2-client) - use [az acr helm][az-acr-helm] commands in the Azure CLI to add your container registry as a Helm chart repository

### Additional information

* Managing Helm charts as OCI artifacts in an Azure container registry is a recommended approach
* You can use legacy [az acr helm][az-acr-helm] Azure CLI commands and workflow with the Helm 3 client and charts. However, we recommend using the Helm 3 workflow with `helm chart` commands to manage charts as OCI artifacts. Certain commands such as `az acr helm list` aren't compatible with Helm 3 charts.
* As of Helm 3, [az acr helm][az-acr-helm] commands are supported mainly for compatibility with the Helm 2 client and chart format. Future development of these commands isn't currently planned.

## Use the Helm 3 client

### Prerequisites

- **An Azure container registry** in your Azure subscription. If needed, create a registry using the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md).
- **Helm client version 3.0.0 or later** - Run `helm version` to find your current version. For more information on how to install and upgrade Helm, see [Installing Helm][helm-install].
- **A Kubernetes cluster** where you will install a Helm chart. If needed, create an [Azure Kubernetes Service cluster][aks-quickstart]. 
- **Azure CLI version 2.0.71 or later** - Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### High level workflow

With **Helm 3** you:

* Can create *multiple* Helm repositories in a registry
* Store Helm 3 charts in an Azure container registry as [OCI artifacts](container-registry-image-formats.md#oci-artifacts). Currently, Helm 3 support for OCI is considered *experimental*.
* Use `helm chart` commands directly from the Helm CLI to push, pull, and manage Helm charts in an Azure container registry
* Authenticate with your Azure container registry via the Azure CLI, which then updates your Helm client automatically with the registry URI and credentials. You don't need to manually specify this registry information, so the credentials aren't exposed in the command history.
* Use `helm install` to install charts to a Kubernetes cluster from a local repository cache.

See the following sections for examples.

### Pull an existing Helm package

If you haven't already added the `stable` Helm chart repo, run the `helm repo add` command:

```console
helm repo add stable https://kubernetes-charts.storage.googleapis.com
```

Pull a chart package from the `stable` repo locally. For example, create a local directory such as *~/acr-helm*, then download the existing *stable/wordpress* chart package. (This example and other commands in this article are formatted for the Bash shell.)

```console
mkdir ~/acr-helm && cd ~/acr-helm
helm pull stable/wordpress --untar
```

The `helm pull stable/wordpress` command didn't specify a particular version, so the *latest* version was pulled and uncompressed in the `wordpress` subdirectory.

### Save chart to local registry cache

First set the following environment variable to enable OCI support in the Helm 3 client. Currently, this support is experimental. 

```console
export HELM_EXPERIMENTAL_OCI=1
```

Change directory to the `wordpress` subdirectory, which contains the Helm chart files. Then, run `helm chart save` to save a copy of the chart locally and also create an alias with the fully qualified name of the registry and the target repository and tag. 

In the following example, the registry name is *mycontainerregistry*, the target repo is *wordpress*, and the target chart tag is *latest*, but substitute values for your environment:

```console
cd wordpress
helm chart save . wordpress:latest
helm chart save . mycontainerregistry.azurecr.io/helm/wordpress:latest
```

Run `helm chart list` to confirm you saved the charts in the local registry cache. Output is similar to:

```console
REF                                                      NAME            VERSION DIGEST  SIZE            CREATED
wordpress:latest                                         wordpress       8.1.0   5899db0 29.1 KiB        1 day 
mycontainerregistry.azurecr.io/helm/wordpress:latest     wordpress       8.1.0   5899db0 29.1 KiB        1 day 
```

### Push chart to Azure Container Registry

Run the `helm chart push` command in the Helm 3 CLI to push the Helm chart to a repository in your Azure container registry. If it doesn't exist, the repository is created.

First use the Azure CLI command [az acr login][az-acr-login] to authenticate to your registry:

```azurecli
az acr login --name mycontainerregistry
```

Push the chart to the fully qualified target repository:

```console
helm chart push mycontainerregistry.azurecr.io/helm/wordpress:latest
```

After a successful push, output is similar to:

```console
The push refers to repository [mycontainerregistry.azurecr.io/helm/wordpress]
ref:     mycontainerregistry.azurecr.io/helm/wordpress:latest
digest:  5899db028dcf96aeaabdadfa5899db025899db025899db025899db025899db02
size:    29.1 KiB
name:    wordpress
version: 8.1.0
```

### List charts in the repository

Similar to other artifacts stored in an Azure container registry, you can show the repositories hosting your charts, and chart tags and manifests, in the Azure portal or by using [az acr repository][az-acr-repository] commands. 

For example, run [az acr repository show][az-acr-repository-show] to see the properties of the repo you created in the previous step:

```azurecli
az acr repository show --name mycontainerregistry --repository helm/wordpress
```

Output is similar to:

```console
{
  "changeableAttributes": {
    "deleteEnabled": true,
    "listEnabled": true,
    "readEnabled": true,
    "writeEnabled": true
  },
  "createdTime": "2020-01-29T16:54:30.1514833Z",
  "imageName": "helm/wordpress",
  "lastUpdateTime": "2020-01-29T16:54:30.4992247Z",
  "manifestCount": 1,
  "registry": "mycontainerregistry.azurecr.io",
  "tagCount": 1
}
```

Run the [az acr repository show-manifests][az-acr-repository-show-manifests] command to see details of the chart stored in the repository. For example:

```azurecli
az acr repository show-manifests --name mycontainerregistry --repository helm/wordpress --detail
```

Output, abbreviated in this example, shows a `configMediaType` of `application/vnd.cncf.helm.config.v1+json`:

```console
[
  {
    [...]
    "configMediaType": "application/vnd.cncf.helm.config.v1+json",
    "createdTime": "2020-01-29T16:54:30.2382436Z",
    "digest": "sha256:xxxxxxxx51bc0807bfa97cb647e493ac381b96c1f18749b7388c24bbxxxxxxxxx",
    "imageSize": 29995,
    "lastUpdateTime": "2020-01-29T16:54:30.3492436Z",
    "mediaType": "application/vnd.oci.image.manifest.v1+json",
    "tags": [
      "latest"
    ]
  }
]
```

### Pull chart to local cache

To install a Helm chart to Kubernetes, the chart must be in the local cache. In this example, first run `helm chart remove` to remove the existing `mycontainerregistry.azurecr.io/helm/wordpress:latest` local chart:

```console
helm chart remove mycontainerregistry.azurecr.io/helm/wordpress:latest
```

Run `helm chart pull` to download the chart from the Azure container registry to your local cache:

```console
helm chart pull mycontainerregistry.azurecr.io/helm/wordpress:latest
```

### Export Helm chart

To work further with the chart, export it to a local directory using `helm chart export`. For example, export the chart you pulled to the `install` directory:

```console
helm chart export mycontainerregistry.azurecr.io/helm/wordpress:latest --destination ./install
```

To view information for the exported chart in the repo, run the `helm inspect chart` command in the directory where you exported the chart.

```console
cd install
helm inspect chart wordpress
```

When no version number is provided, the *latest* version is used. Helm returns detailed information about your chart, as shown in the following condensed example output:

```
apiVersion: v1
appVersion: 5.3.2
dependencies:
- condition: mariadb.enabled
  name: mariadb
  repository: https://kubernetes-charts.storage.googleapis.com/
  tags:
  - wordpress-database
  version: 7.x.x
description: Web publishing platform for building blogs and websites.
home: http://www.wordpress.com/
icon: https://bitnami.com/assets/stacks/wordpress/img/wordpress-stack-220x234.png
keywords:
- wordpress
- cms
- blog
- http
- web
- application
- php
maintainers:
- email: containers@bitnami.com
  name: Bitnami
name: wordpress
sources:
- https://github.com/bitnami/bitnami-docker-wordpress
version: 8.1.0
```

### Install Helm chart

Run `helm install` to install the Helm chart you pulled to the local cache and exported. Specify a release name or pass the `--generate-name` parameter. For example:

```console
helm install wordpress --generate-name
```

As the installation proceeds, follow the instructions in the command output to see the WorPress URLs and credentials. You can also run the `kubectl get pods` command to see the Kubernetes resources deployed through the Helm chart:

```console
NAME                                    READY   STATUS    RESTARTS   AGE
wordpress-1598530621-67c77b6d86-7ldv4   1/1     Running   0          2m48s
wordpress-1598530621-mariadb-0          1/1     Running   0          2m48s
[...]
```

### Delete a Helm chart from the repository

To delete a chart from the repository, use the [az acr repository delete][az-acr-repository-delete] command. Run the following command and confirm the operation when prompted:

```azurecli
az acr repository delete --name mycontainerregistry --image helm/wordpress:latest
```

## Use the Helm 2 client

### Prerequisites

- **An Azure container registry** in your Azure subscription. If needed, create a registry using the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md).
- **Helm client version 2.11.0 (not an RC version) or later** - Run `helm version` to find your current version. You also need a Helm server (Tiller) initialized within a Kubernetes cluster. If needed, create an [Azure Kubernetes Service cluster][aks-quickstart]. For more information on how to install and upgrade Helm, see [Installing Helm][helm-install-v2].
- **Azure CLI version 2.0.46 or later** - Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### High level workflow

With **Helm 2** you:

* Configure your Azure container registry as a *single* Helm chart repository. Azure Container Registry manages the index definition as you add and remove charts to the repository.
* Use the [az acr helm][az-acr-helm] commands in the Azure CLI to add your Azure container registry as a Helm chart repository, and to push and manage charts. These Azure CLI commands wrap Helm 2 client commands.
* Add the chart repository in your Azure container registry to your local Helm repo index, supporting chart search
* Authenticate with your Azure container registry via the Azure CLI, which then updates your Helm client automatically with the registry URI and credentials. You don't need to manually specify this registry information, so the credentials aren't exposed in the command history.
* Use `helm install` to install charts to a Kubernetes cluster from a local repository cache.

See the following sections for examples.

### Add repository to Helm client

Add your Azure Container Registry Helm chart repository to your Helm client using the [az acr helm repo add][az-acr-helm-repo-add] command. This command gets an authentication token for your Azure container registry that is used by the Helm client. The authentication token is valid for 3 hours. Similar to `docker login`, you can run this command in future CLI sessions to authenticate your Helm client with your Azure Container Registry Helm chart repository:

```azurecli
az acr helm repo add --name mycontainerregistry
```

### Add a chart to the repository

First, create a local directory at *~/acr-helm*, then download the existing *stable/wordpress* chart:

```console
mkdir ~/acr-helm && cd ~/acr-helm
helm repo update
helm fetch stable/wordpress
```

Type `ls` to list the downloaded chart, and note the Wordpress version included in the filename. The `helm fetch stable/wordpress` command didn't specify a particular version, so the *latest* version was fetched. In the following example output, the Wordpress chart is version *8.1.0*:

```
wordpress-8.1.0.tgz
```

Push the chart to your Helm chart repository in Azure Container Registry using the [az acr helm push][az-acr-helm-push] command in the Azure CLI. Specify the name of your Helm chart downloaded in the previous step, such as *wordpress-8.1.0.tgz*:

```azurecli
az acr helm push --name mycontainerregistry wordpress-8.1.0.tgz
```

After a few moments, the Azure CLI reports that your chart is saved, as shown in the following example output:

```
{
  "saved": true
}
```

### List charts in the repository

To use the chart uploaded in the previous step, the local Helm repository index must be updated. You can reindex the repositories in the Helm client, or use the Azure CLI to update the repository index. Each time you add a chart to your repository, this step must be completed:

```azurecli
az acr helm repo add --name mycontainerregistry
```

With a chart stored in your repository and the updated index available locally, you can use the regular Helm client commands to search or install. To see all the charts in your repository, use the `helm search` command, providing your own Azure Container Registry name:

```console
helm search mycontainerregistry
```

The Wordpress chart pushed in the previous step is listed, as shown in the following example output:

```
NAME              	CHART VERSION	APP VERSION	DESCRIPTION
helmdocs/wordpress	8.1.0       	5.3.2      	Web publishing platform for building blogs and websites.
```

You can also list the charts with the Azure CLI, using [az acr helm list][az-acr-helm-list]:

```azurecli
az acr helm list --name mycontainerregistry
```

### Show information for a Helm chart

To view information for a specific chart in the repo, you can use the `helm inspect` command.

```console
helm inspect mycontainerregistry/wordpress
```

When no version number is provided, the *latest* version is used. Helm returns detailed information about your chart, as shown in the following condensed example output:

```
apiVersion: v1
appVersion: 5.3.2
description: Web publishing platform for building blogs and websites.
engine: gotpl
home: http://www.wordpress.com/
icon: https://bitnami.com/assets/stacks/wordpress/img/wordpress-stack-220x234.png
keywords:
- wordpress
- cms
- blog
- http
- web
- application
- php
maintainers:
- email: containers@bitnami.com
  name: Bitnami
name: wordpress
sources:
- https://github.com/bitnami/bitnami-docker-wordpress
version: 8.1.0
[...]
```

You can also show the information for a chart with the Azure CLI [az acr helm show][az-acr-helm-show] command. Again, the *latest* version of a chart is returned by default. You can append `--version` to list a specific version of a chart, such as *8.1.0*:

```azurecli
az acr helm show --name mycontainerregistry wordpress
```

### Install a Helm chart from the repository

The Helm chart in your repository is installed by specifying the repository name and the chart name. Use the Helm client to install the Wordpress chart:

```console
helm install mycontainerregistry/wordpress
```

> [!TIP]
> If you push to your Azure Container Registry Helm chart repository and later return in a new CLI session, your local Helm client needs an updated authentication token. To obtain a new authentication token, use the [az acr helm repo add][az-acr-helm-repo-add] command.

The following steps are completed during the install process:

- The Helm client searches the local repository index.
- The corresponding chart is downloaded from the Azure Container Registry repository.
- The chart is deployed using the Tiller in your Kubernetes cluster.

As the installation proceeds, follow the instructions in the command output to see the WorPress URLs and credentials. You can also run the `kubectl get pods` command to see the Kubernetes resources deployed through the Helm chart:

```
NAME                                    READY   STATUS    RESTARTS   AGE
wordpress-1598530621-67c77b6d86-7ldv4   1/1     Running   0          2m48s
wordpress-1598530621-mariadb-0          1/1     Running   0          2m48s
[...]
```

### Delete a Helm chart from the repository

To delete a chart from the repository, use the [az acr helm delete][az-acr-helm-delete] command. Specify the name of the chart, such as *wordpress*, and the version to delete, such as *8.1.0*.

```azurecli
az acr helm delete --name mycontainerregistry wordpress --version 8.1.0
```

If you wish to delete all versions of the named chart, leave out the `--version` parameter.

The chart continues to be returned when you run `helm search`. Again, the Helm client doesn't automatically update the list of available charts in a repository. To update the Helm client repo index, use the [az acr helm repo add][az-acr-helm-repo-add] command again:

```azurecli
az acr helm repo add --name mycontainerregistry
```

## Next steps

This article used an existing Helm chart from the public *stable* repository. For more information on how to create and deploy Helm charts, see [Developing Helm charts][develop-helm-charts].

Helm charts can be used as part of the container build process. For more information, see [Use Azure Container Registry Tasks][acr-tasks].

<!-- LINKS - external -->
[helm]: https://helm.sh/
[helm-install]: https://helm.sh/docs/intro/install/
[helm-install-v2]: https://v2.helm.sh/docs/using_helm/#installing-helm
[develop-helm-charts]: https://helm.sh/docs/chart_template_guide/
[semver2]: https://semver.org/
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
[aks-quickstart]: ../aks/kubernetes-walkthrough.md
[acr-bestpractices]: container-registry-best-practices.md
[az-configure]: /cli/azure/reference-index#az-configure
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-helm]: /cli/azure/acr/helm
[az-acr-repository]: /cli/azure/acr/repository
[az-acr-repository-show]: /cli/azure/acr/repository#az-acr-repository-show
[az-acr-repository-delete]: /cli/azure/acr/repository#az-acr-repository-delete
[az-acr-repository-show-tags]: /cli/azure/acr/repository#az-acr-repository-show-tags
[az-acr-repository-show-manifests]: /cli/azure/acr/repository#az-acr-repository-show-manifests
[az-acr-helm-repo-add]: /cli/azure/acr/helm/repo#az-acr-helm-repo-add
[az-acr-helm-push]: /cli/azure/acr/helm#az-acr-helm-push
[az-acr-helm-list]: /cli/azure/acr/helm#az-acr-helm-list
[az-acr-helm-show]: /cli/azure/acr/helm#az-acr-helm-show
[az-acr-helm-delete]: /cli/azure/acr/helm#az-acr-helm-delete
[acr-tasks]: container-registry-tasks-overview.md
