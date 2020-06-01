---
title: "Enable Azure Dev Spaces on AKS & install the client-side tools"
services: azure-dev-spaces
ms.date: "07/24/2019"
ms.topic: "conceptual"
description: "Learn how to enable Azure Dev Spaces on an AKS cluster and install the client-side tools."
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, Helm, service mesh, service mesh routing, kubectl, k8s"
---

# Enable Azure Dev Spaces on an AKS cluster and install the client-side tools

This article shows you several ways to enable Azure Dev Spaces on an AKS cluster as well as install the client-side tools.

## Enable or remove Azure Dev Spaces using the CLI

Before you can enable Dev Spaces using the CLI, you need:
* An Azure subscription. If you don't have an Azure subscription, you can create a [free account][az-portal-create-account].
* [The Azure CLI installed][install-cli].
* [An AKS cluster][create-aks-cli] in a [supported region][supported-regions].

Use the `use-dev-spaces` command to enable Dev Spaces on your AKS cluster and follow the prompts.

```azurecli
az aks use-dev-spaces -g myResourceGroup -n myAKSCluster
```

The above command enables Dev Spaces on the *myAKSCluster* cluster in the *myResourceGroup* group and creates a *default* dev space.

```console
'An Azure Dev Spaces Controller' will be created that targets resource 'myAKSCluster' in resource group 'myResourceGroup'. Continue? (y/N): y

Creating and selecting Azure Dev Spaces Controller 'myAKSCluster' in resource group 'myResourceGroup' that targets resource 'myAKSCluster' in resource group 'myResourceGroup'...2m 24s

Select a dev space or Kubernetes namespace to use as a dev space.
 [1] default
Type a number or a new name: 1

Kubernetes namespace 'default' will be configured as a dev space. This will enable Azure Dev Spaces instrumentation for new workloads in the namespace. Continue? (Y/n): Y

Configuring and selecting dev space 'default'...3s

Managed Kubernetes cluster 'myAKSCluster' in resource group 'myResourceGroup' is ready for development in dev space 'default'. Type `azds prep` to prepare a source directory for use with Azure Dev Spaces and `azds up` to run.
```

The `use-dev-spaces` command also installs the Azure Dev Spaces CLI.

To remove Azure Dev Spaces from your AKS cluster, use the `azds remove` command. For example:

```azurecli
$ azds remove -g MyResourceGroup -n MyAKS
Azure Dev Spaces Controller 'MyAKS' in resource group 'MyResourceGroup' that targets resource 'MyAKS' in resource group 'MyResourceGroup' will be deleted. This will remove Azure Dev Spaces instrumentation from the target resource for new workloads. Continue? (y/N): y

Deleting Azure Dev Spaces Controller 'MyAKS' in resource group 'MyResourceGroup' that targets resource 'MyAks' in resource group 'MyResourceGroup' (takes a few minutes)...
```

The above command removes Azure Dev Spaces from the *MyAKS* cluster in *MyResourceGroup*. Any namespaces you created with Azure Dev Spaces will remain along with their workloads, but new workloads in those namespaces will not be instrumented with Azure Dev Spaces. In addition, if you restart any existing pods instrumented with Azure Dev Spaces, you may see errors. Those pods must be redeployed without Azure Dev Spaces tooling. To fully remove Azure Dev Spaces from your cluster, delete all pods in all namespaces where Azure Dev Spaces was enabled.

## Install the client-side tools

You can use the Azure Dev Spaces client-side tools to interact with dev spaces on an AKS cluster from your local machine. There are several ways to install the client-side tools:

* In [Visual Studio Code][vscode], install the [Azure Dev Spaces extension][vscode-extension].
* In [Visual Studio 2019][visual-studio], install the Azure Development workload.
* Download and install the [Windows][cli-win], [Mac][cli-mac], or [Linux][cli-linux] CLI.

## Next steps

Learn how Azure Dev Spaces helps you develop more complex applications across multiple containers, and how you can simplify collaborative development by working with different versions or branches of your code in different spaces.

> [!div class="nextstepaction"]
> [Team development in Azure Dev Spaces][team-development-qs]

[create-aks-cli]: ../../aks/kubernetes-walkthrough.md#create-a-resource-group
[install-cli]: /cli/azure/install-azure-cli?view=azure-cli-latest
[supported-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service
[team-development-qs]: ../quickstart-team-development.md

[az-portal]: https://portal.azure.com
[az-portal-create-account]: https://azure.microsoft.com/free
[cli-linux]: https://aka.ms/get-azds-linux
[cli-mac]: https://aka.ms/get-azds-mac
[cli-win]: https://aka.ms/get-azds-windows
[visual-studio]: https://aka.ms/vsdownload?utm_source=mscom&utm_campaign=msdocs
[visual-studio-k8s-tools]: https://aka.ms/get-vsk8stools
[vscode]: https://code.visualstudio.com/download
[vscode-extension]: https://marketplace.visualstudio.com/items?itemName=azuredevspaces.azds
