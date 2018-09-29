---
title: Use Helm repositories in Azure Container Registry
description: Learn how to use a Helm repository with Azure Container Registry to store charts for your applications
services: container-registry
author: iainfoulds

ms.service: container-registry
ms.topic: article
ms.date: 09/24/2018
ms.author: iainfou
---

# Use Azure Container Registry as a Helm repository for your application charts

To quickly manage and deploy applications for Kubernetes, you can use the [open-source Helm package manager][helm]. With Helm, applications are defined as *charts* that are stored in a Helm chart repository. These charts define configurations and dependencies, and can be versioned throughout the application lifecycle. Azure Container Registry can be used as the host for Helm chart repositories.

With Azure Container Registry, you have a private, secure Helm chart repository, that can integrate with build pipelines or other Azure services. Helm chart repositories in Azure Container Registry include geo-replication features to keep your charts close to deployments and for redundancy. You only pay for the storage used by the charts, and are available across all Azure Container Registry price tiers.

This article shows you how to use a Helm chart repository stored in Azure Container Registry.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Before you begin

To complete the steps in this article, the following pre-requisites must be met:

- **Azure Container Registry** - Create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md).
- **Helm client** to search and install charts. You also need a Helm server (Tiller) initialized within a Kubernetes cluster. If needed, you can [create an Azure Kubernetes Service cluster][aks-quickstart]. For more information on how to install and use Helm, see [Installing Helm][helm-install].
- **Azure CLI version 2.0.46 or later** - Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Add a repository to Helm client

A Helm repository is an HTTP server that can store Helm charts. Azure Container Registry can provide this storage for Helm charts, and manage the index definition as you add and remove charts to the repository.

To add your Azure Container Registry as a Helm chart repository, you use the Azure CLI. With this approach, your Helm client is updated with the URI and credentials for the repository backed by Azure Container Registry. You don't need to manually specify this repository information, so the credentials aren't exposed in the command history, for example.

If needed, log in to the Azure CLI and follow the prompts:

```azurecli
az login
```

Configure the Azure CLI defaults with the name of your Azure Container Registry using the [az configure][az-configure] command. In the following example, replace `<acrName>` with the name of your registry:

```azurecli
az configure --defaults acr=<acrName>
```

Now add your Azure Container Registry Helm chart repository to your Helm client using the [az acr helm repo add][az-acr-helm-repo-add] command. This command gets an authentication token for your Azure container registry that is used by the Helm client. The authentication token is valid for 1 hour. Similar to `docker login`, you can run this command in future CLI sessions to authenticate your Helm client with your Azure Container Registry Helm chart repository:

```azurecli
az acr helm repo add
```

## Add a chart to the repository

For this article, let's get an existing Helm chart from the public Helm *stable* repo. The *stable* repo is a curated, public repo that includes common application charts. Package maintainers can submit their charts to the *stable* repo, in the same way that Docker Hub provides a public registry for common container images. The chart downloaded from the public *stable* repo can then be pushed to your private Azure Container Registry repository. In most scenarios, you would build and upload your own charts for the applications you develop. For more information on how to build your own Helm charts, see [developing Helm charts][develop-helm-charts].

First, create a directory at *~/acr-helm*, then download the existing *stable/wordpress* chart:

```console
mkdir ~/acr-helm && cd ~/acr-helm
helm fetch stable/wordpress
```

List the downloaded chart, and note the Wordpress version included in the filename. The `helm fetch stable/wordpress` command didn't specify a particular version, so the *latest* version was fetched. All Helm charts include a version number in the filename that follows the [SemVer 2][semver2] standard. In the following example output, the Wordpress chart is version *2.1.10*:

```
$ ls

wordpress-2.1.10.tgz
```

Now push the chart to your Helm chart repository in Azure Container Registry using the Azure CLI [az acr helm push][az-acr-helm-push] command. Specify the name of your Helm chart downloaded in the previous step, such as *wordpress-2.1.10.tgz*:

```azurecli
az acr helm push wordpress-2.1.10.tgz
```

After a few moments, the Azure CLI reports that your chart has been saved, as shown in the following example output:

```
$ az acr helm push wordpress-2.1.10.tgz

{
  "saved": true
}
```

## List charts in the repository

The Helm client maintains a local cached copy of the contents of remote repositories. Changes to a remote repository don't automatically update the list of available charts known locally by the Helm client. When you search for charts across repositories, Helm uses it's local cached index. To use the chart uploaded in the previous step, the local Helm repository index must be updated. You can reindex the repositories in the Helm client, or use the Azure CLI to update the repository index. Each time you add a chart to your repository, this step must be completed:

```azurecli
az acr helm repo add
```

With a chart stored in your repository and the updated index available locally, you can use the regular Helm client commands to search or install. To see all the charts in your repository, use `helm search <acrName>`. Provide your own Azure Container Registry name:

```console
helm search <acrName>
```

The Wordpress chart pushed in the previous step is listed, as shown in the following example output:

```
$ helm search myacrhelm

NAME              	CHART VERSION	APP VERSION	DESCRIPTION
helmdocs/wordpress	2.1.10       	4.9.8      	Web publishing platform for building blogs and websites.
```

You can also list the charts with the Azure CLI, using [az acr helm list][az-acr-helm-list]:

```azurecli
az acr helm list
```

## Show information for a Helm chart

To view information for a specific chart in the repo, you can again use the regular Helm client. To see information for the chart named *wordpress*, use `helm inspect`.

```console
helm inspect <acrName>/wordpress
```

When no version number is provided, the *latest* version is used. Helm returns detailed information about your chart, as shown in the following condensed example output:

```
$ helm inspect myacrhelm/wordpress

appVersion: 4.9.8
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
  name: bitnami-bot
name: wordpress
sources:
- https://github.com/bitnami/bitnami-docker-wordpress
version: 2.1.10
[...]
```

You can also show the information for a chart with the Azure CLI [az acr helm show][az-acr-helm-show] command. Again, the *latest* version of a chart is returned by default. You can append `--version` to list a specific version of a chart, such as *2.1.10*:

```azurecli
az acr helm show wordpress
```

## Install a Helm chart from the repository

The Helm chart in your repository is installed by specifying the repository name and then chart name. Use the Helm client to install the Wordpress chart:

```console
helm install <acrName>/wordpress
```

> [!TIP]
> If you push to your Azure Container Registry Helm chart repository and later return in a new CLI session, your local Helm client needs an updated authentication token. To obtain a new authentication token, use the [az acr helm repo add][az-acr-helm-repo-add] command.

The following steps are completed during the install process:

- The Helm client searches the local repository index.
- The corresponding chart is downloaded from the Azure Container Registry repository.
- The chart is deployed using the Tiller in your Kubernetes cluster.

The following condensed example output shows the Kubernetes resources deployed through the Helm chart:

```
$ helm install myacrhelm/wordpress

NAME:   irreverent-jaguar
LAST DEPLOYED: Thu Sep 13 21:44:20 2018
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/Pod(related)
NAME                                          READY  STATUS   RESTARTS  AGE
irreverent-jaguar-wordpress-7ff46d9b8c-b7v6m  0/1    Pending  0         1s
irreverent-jaguar-mariadb-0                   0/1    Pending  0         1s
[...]
```

## Delete a Helm chart from the repository

To delete a chart from the repository, use the [az acr helm delete][az-acr-helm-delete] command. Specify the name of the chart, such as *wordpress*, and the version to delete, such as *2.1.10*.

```azurecli
az acr helm delete wordpress --version 2.1.10
```

If you wish to delete all versions of the named chart, leave out the `--version` parameter.

The chart continues to be returned in `helm search <acrName>`. Again, the Helm client doesn't automatically update the list of available charts in a repository. To update the Helm client repo index, use the [az acr helm repo add][az-acr-helm-repo-add] command again:

```azurecli
az acr helm repo add
```

## Next steps

This article used an existing Helm chart from the public *stable* repository. For more information on how to create and deploy Helm charts, see [Developing Helm charts][develop-helm-charts].

Helm charts can be used as part of the container build process. For more information, see [use Azure Container Registry Tasks][acr-tasks].

For more information on how to use and manage Azure Container Registry, see the [best practices][acr-bestpractices].

<!-- LINKS - external -->
[helm]: https://helm.sh/
[helm-install]: https://docs.helm.sh/using_helm/#installing-helm
[develop-helm-charts]: https://docs.helm.sh/developing_charts/
[semver2]: https://semver.org/
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
[aks-quickstart]: ../aks/kubernetes-walkthrough.md
[acr-bestpractices]: container-registry-best-practices.md
[az-configure]: /cli/azure/reference-index#az-configure
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-helm-repo-add]: /cli/azure/acr/helm/repo#az-acr-helm-repo-add
[az-acr-helm-push]: /cli/azure/acr/helm#az-acr-helm-push
[az-acr-helm-list]: /cli/azure/acr/helm#az-acr-helm-list
[az-acr-helm-show]: /cli/azure/acr/helm#az-acr-helm-show
[az-acr-helm-delete]: /cli/azure/acr/helm#az-acr-helm-delete
[acr-tasks]: container-registry-tasks-overview.md
