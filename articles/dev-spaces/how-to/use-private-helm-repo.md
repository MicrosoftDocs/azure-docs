---
title: "How to use a private Helm repository in Azure Dev Spaces"
services: azure-dev-spaces

author: "zr-msft"
ms.author: "zarhoads"
ms.date: "08/22/2019"
ms.topic: "conceptual"
description: "Use a private Helm repository in an Azure Dev Space."
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers, Helm"
manager: gwallace
---
# Use a private Helm repository in Azure Dev Spaces

[Helm][helm] is a package manager for Kubernetes. Helm uses a [chart][helm-chart] format to package dependencies. Helm charts are stored in a repository, which can be public or private. Azure Dev Spaces only retrieves Helm charts from public repositories when running your application. In cases where the Helm repository is private or Azure Dev Spaces can't access it, you can add a chart from that repository directly to your application. Adding the chart directly lets Azure Dev Spaces run your application without having to access the private Helm repository.

## Add the private Helm repository to your local machine

Use [helm repo add][helm-repo-add] and [helm repo update][helm-repo-update] to access the private Helm repository from your local machine.

```cmd
helm repo add privateRepoName http://example.com/helm/v1/repo --username user --password 5tr0ng_P@ssw0rd!
helm repo update
```

## Add the chart to your application

Navigate to your project's directory and run `azds prep`.

```cmd
azds prep --enable-ingress
```

> [!TIP]
> The `prep` command attempts to generate [a Dockerfile and Helm chart](../how-dev-spaces-works-prep.md#prepare-your-code) for your project. Azure Dev Spaces uses these files to build and run your code, but you can modify these files if you want to change how the project is built and ran.

Create a [requirements.yaml][helm-requirements] file with your chart in your application's chart directory. For example, if your application is named *app1*, you would create *charts/app1/requirements.yaml*.

```yaml
dependencies:
    - name: mychart
      version: 0.1.0
      repository:  http://example.com/helm/v1/repo
```

Navigate to your application's chart directory and use [helm dependency update][helm-dependency-update] to update the Helm dependencies for your application and download the chart from the private repository.

```cmd
helm dependency update
```

Verify a *charts* subdirectory with a *tgz* file has been added to your application's chart directory. For example, *charts/app1/charts/mychart-0.1.0.tgz*.

The chart from your private Helm repository has been downloaded and added to your project. Remove the *requirements.yaml* file so that Dev Spaces won't try to update this dependency.

## Run your application

Navigate to the root directory of your project and run `azds up` to verify your application successfully runs in your dev space.

```cmd
$ azds up
Using dev space 'default' with target 'MyAKS'
Synchronizing files...2s
Installing Helm chart...2s
Waiting for container image build...2m 25s
Building container image...
...
Service 'app1' port 'http' is available at http://app1.1234567890abcdef1234.eus.azds.io/
Service 'app1' port 80 (http) is available at http://localhost:54256
...
```

## Next steps

Learn more about [Helm and how it works][helm].

[helm]: https://docs.helm.sh
[helm-chart]: https://helm.sh/docs/topics/charts/
[helm-dependency-update]: https://helm.sh/docs/topics/charts/#managing-dependencies-with-the-dependencies-field
[helm-repo-add]: https://helm.sh/docs/intro/using_helm/#helm-repo-working-with-repositories
[helm-repo-update]: https://helm.sh/docs/intro/using_helm/#helm-repo-working-with-repositories
[helm-requirements]: https://helm.sh/docs/topics/charts/#chart-dependencies
