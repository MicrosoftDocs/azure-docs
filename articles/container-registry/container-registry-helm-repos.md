---
title:  Store Helm charts
description: Learn how to store Helm charts for your Kubernetes applications using repositories in Azure Container Registry
ms.topic: article
ms.date: 01/08/2020
---

# Use Azure Container Registry as a Helm repository for Kubernetes application charts

With Azure Container Registry, you can store Helm charts in private, secure Helm chart repositories, that can integrate with build pipelines or other Azure services. Helm chart repositories in Azure Container Registry include geo-replication features to keep your charts close to deployments and for redundancy. Helm chart repositories are available across all Azure Container Registry price tiers.

This article shows you how to store and use a Helm chart stored in an Azure Container Registry repository. For this article, you store an existing Helm chart from the public Helm *stable* repo. In most scenarios, you would build and upload your own charts for the applications you develop. For more information on how to build your own Helm charts, see the [Chart Template Developer's Guide][develop-helm-charts].

## Helm 2 or Helm 3?

To quickly manage and deploy applications for Kubernetes, you can use the [open-source Helm package manager][helm]. With Helm, applications are defined as *charts* that are stored in a Helm chart repository. These charts define configurations and dependencies, and can be versioned throughout the application lifecycle. 

With Helm 2, you configure your Azure container registry as a *single* Helm chart repository. Azure Container Registry manages the index definition as you add and remove charts to the repository.

With Helm 3, you are able to create multiple Helm repositories in a registry, using `helm chart` commands to push and pull Helm charts as [OCI artifacts](container-registry-image-formats.md#oci-artifacts).

To add your Azure container registry as a Helm chart repository, you use the Azure CLI. With this approach, your Helm client is updated with the URI and credentials for the repository backed by Azure Container Registry. You don't need to manually specify this repository information, so the credentials aren't exposed in the command history, for example.

Helm 3 supports OCI for package distribution. Chart packages are able to be stored and shared across OCI-based registries including Azure Container Registry. Currently OCI support is considered *experimental*.

### Tips

* Helm 3 is currently installed in the Azure Cloud Shell.
* Charts pushed using the Helm 3 client to a container registry can't be listed with [az acr helm list][az-acr-helm-list] command.

## Helm 3

If you are using Helm 3 and want to store Helm charts, you can use the Helm 3 client. You must be using:

- **An Azure container registry** in your Azure subscription. If needed, you can create a registry using the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md).
- **Helm client version 3.0.0 or later** - Run `helm version` to find your current version. You also need a Kubernetes cluster. If needed, you can [create an Azure Kubernetes Service cluster][aks-quickstart]. For more information on how to install and upgrade Helm, see [Installing Helm][helm-install].
- **Azure CLI version 2.0.71 or later** - Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### Pull an existing Helm package

If you haven't already added the `stable` Helm chart repo, run the following command:

```console
helm repo add stable https://kubernetes-charts.storage.googleapis.com
```

Pull a chart package from the `stable` repo locally. For example, create a local directory such as *~/acr-helm*, then download the existing *stable/wordpress* chart package. This example and other commands in this article assume you are using a Bash shell:

```console
mkdir ~/acr-helm && cd ~/acr-helm
helm pull stable/wordpress --untar
```

List the downloaded package, and note the Wordpress version included in the filename. The `helm pull stable/wordpress` command didn't specify a particular version, so the *latest* version was fetched. In the following example output, the Wordpress package is version *8.1.0*:

```console
wordpress-8.1.0.tgz
```

### Save chart to local registry cache

First set the following environment variable to enable OCI support:

```console
export HELM_EXPERIMENTAL_OCI=1
```

Change directory to the location of the untarred package, which contains the [Helm chart files](https://helm.sh/docs/topics/charts/). Then, run `helm chart save` to save a copy of the chart locally and also create an alias with the fully qualified name of the registry and the target repository and tag. 

In the following example, the registry name is *mycontainerregistry*, the target repo is *wordpress*, and the target chart tag is *latest*, but substitute values for your environment:

```console
cd wordpress
helm chart save . wordpress:latest
helm chart save . mycontainerregistry.azurecr.io/helm/wordpress:latest
```

Run `helm chart list` to confirm the charts you have saved in the local registry cache. Output is similar to:

```console
REF                                                      NAME            VERSION DIGEST  SIZE            CREATED
wordpress:latest                                         wordpress       8.1.0   5899db0 29.1 KiB        1 day 
mycontainerregistry.azurecr.io/helm/wordpress:latest     wordpress       8.1.0   5899db0 29.1 KiB        1 day 
```

### Push chart to Azure Container Registry

Using the Helm 3 CLI, use the `helm chart push` command to push the Helm chart to a repository in your Azure container registry.

First use the Azure CLI command [az acr login][az-acr-login] to authenticate to your registry:

```
az acr login --name mycontainerregistry
```

Push the chart to the fully qualified target repository:

```azurecli
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

As with other artifacts stored in an Azure container registry, you can see the repositories hosting your charts, as well as chart tags, in the Azure portal or by using [az acr repository][az-acr-repository] commands. For example, run [az acr repository show][az-acr-repository-show] to see the properties of the repo you created in the previous step:

```azurecli
az acr repository show --name mycontainerregistry --repository helm/wordpress
```

Run the [az acr repository show-tags][az-acr-repository-show-tags] command to see the chart tags in the repository.

### Pull chart to local cache

To install a Helm chart to Kubernetes, the chart must be in the local cache. In this example, first run `helm chart remove` to remove the existing `mycontainerregistry.azurecr.io/helm/wordpress:latest` local chart:

```console
helm chart remove mycontainerregistry.azurecr.io/helm/wordpress:latest
```

Run `helm chart pull` to pull the chart from the Azure container registry

```console
helm chart pull mycontainerregistry.azurecr.io/helm/wordpress:latest
```


### Install a Helm chart

To work further with the chart, export it to a directory using `helm chart export`. For example, export the chart to the install directory:

```console
helm chart export mycontainerregistry.azurecr.io/helm/wordpress:latest --destination ./install
```

To view information for the exported chart in the repo, you can run the `helm inspect chart` command in the directory where you exported the chart.

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

### Install a Helm chart

Run `helm install` to install the Helm chart you pull to the local cache and exported. For example:

```console
helm install wordpress --generate-name
```

As the installation proceeds, follow the instructions in the command output to see the WorPress URLs and credentials. You can also run the `kubectl get pods` command to see the Kubernetes resources deployed through the Helm chart:

```
NAME                                    READY   STATUS    RESTARTS   AGE
wordpress-1598530621-67c77b6d86-7ldv4   1/1     Running   0          2m48s
wordpress-1598530621-mariadb-0          1/1     Running   0          2m48s
[...]
```

### Delete a Helm chart from the repository

To delete a chart from the repository, use the [az acr repository delete][az-acr-repository-delete] command. 

```azurecli
az acr repository delete --name mycontainerregistry --image helm/wordpress:latest
```


## Helm 2

If you are using Helm 2 and want to store Helm 2 charts, you can use the Helm 2 client and the [az acr helm][az-acr-helm] commands in the Azure CLI. You must be using:

- **An Azure container registry** in your Azure subscription. If needed, you can create a registry using the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md).
- **Helm client version 2.11.0 (not an RC version) or later** - Run `helm version` to find your current version. You also need a Helm server (Tiller) initialized within a Kubernetes cluster. If needed, you can [create an Azure Kubernetes Service cluster][aks-quickstart]. For more information on how to install and upgrade Helm, see [Installing Helm][helm-install].
- **Azure CLI version 2.0.46 or later** - Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### Add repository to Helm client

Add your Azure Container Registry Helm chart repository to your Helm client using the [az acr helm repo add][az-acr-helm-repo-add] command. This command gets an authentication token for your Azure container registry that is used by the Helm client. The authentication token is valid for 1 hour. Similar to `docker login`, you can run this command in future CLI sessions to authenticate your Helm client with your Azure Container Registry Helm chart repository:

```azurecli
az acr helm repo add --name mycontainerregistry
```

### Add a chart to the repository

First, create a local directory at *~/acr-helm*, then download the existing *stable/wordpress* chart:

```console
mkdir ~/acr-helm && cd ~/acr-helm
helm fetch stable/wordpress
```

List the downloaded chart, and note the Wordpress version included in the filename. The `helm fetch stable/wordpress` command didn't specify a particular version, so the *latest* version was fetched. In the following example output, the Wordpress chart is version *8.1.0*:

```
wordpress-8.1.0.tgz
```

Push the chart to your Helm chart repository in Azure Container Registry using the Azure CLI [az acr helm push][az-acr-helm-push] command. Specify the name of your Helm chart downloaded in the previous step, such as *wordpress-8.1.0.tgz*:

```azurecli
az acr helm push --name mycontainerregistry wordpress-8.1.0.tgz
```

After a few moments, the Azure CLI reports that your chart has been saved, as shown in the following example output:

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
helmdocs/wordpress	8.1.0       	4.9.8      	Web publishing platform for building blogs and websites.
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

You can also show the information for a chart with the Azure CLI [az acr helm show][az-acr-helm-show] command. Again, the *latest* version of a chart is returned by default. You can append `--version` to list a specific version of a chart, such as *8.1.0*:

```azurecli
az acr helm show --mycontainerregistry wordpress
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

Helm charts can be used as part of the container build process. For more information, see [use Azure Container Registry Tasks][acr-tasks].

For more information on how to use and manage Azure Container Registry, see the [best practices][acr-bestpractices].

<!-- LINKS - external -->
[helm]: https://helm.sh/
[helm-install]: https://helm.sh/docs/intro/install/
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
[az-acr-repository-show-tags]: /cli/azure/acr/repository#az-acr-repository-show-tags
[az-acr-helm-repo-add]: /cli/azure/acr/helm/repo#az-acr-helm-repo-add
[az-acr-helm-push]: /cli/azure/acr/helm#az-acr-helm-push
[az-acr-helm-list]: /cli/azure/acr/helm#az-acr-helm-list
[az-acr-helm-show]: /cli/azure/acr/helm#az-acr-helm-show
[az-acr-helm-delete]: /cli/azure/acr/helm#az-acr-helm-delete
[acr-tasks]: container-registry-tasks-overview.md
