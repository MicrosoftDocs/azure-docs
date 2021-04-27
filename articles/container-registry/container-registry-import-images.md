---
title: Import container images
description: Import container images to an Azure container registry by using Azure APIs, without needing to run Docker commands.
ms.topic: article
ms.date: 01/15/2021
---

# Import container images to a container registry

You can easily import (copy) container images to an Azure container registry, without using Docker commands. For example, import images from a development registry to a production registry, or copy base images from a public registry.

Azure Container Registry handles a number of common scenarios to copy images and other artifacts from an existing registry:

* Import images from a public registry

* Import images or OCI artifacts including Helm 3 charts from another Azure container registry, in the same or a different Azure subscription or tenant

* Import from a non-Azure private container registry

Image import into an Azure container registry has the following benefits over using Docker CLI commands:

* Because your client environment doesn't need a local Docker installation, import any container image, regardless of the supported OS type.

* When you import multi-architecture images (such as official Docker images), images for all architectures and platforms specified in the manifest list get copied.

* Access to the target registry doesn't have to use the registry's public endpoint.

To import container images, this article requires that you run the Azure CLI in Azure Cloud Shell or locally (version 2.0.55 or later recommended). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

> [!NOTE]
> If you need to distribute identical container images across multiple Azure regions, Azure Container Registry also supports [geo-replication](container-registry-geo-replication.md). By geo-replicating a registry (Premium service tier required), you can serve multiple regions with identical image and tag names from a single registry.
>

> [!IMPORTANT]
> Changes to image import between two Azure container registries have been introduced as of January 2021:
> * Import to or from a network-restricted Azure container registry requires the restricted registry to [**allow access by trusted services**](allow-access-trusted-services.md) to bypass the network. By default, the setting is enabled, allowing import. If the setting isn't enabled in a newly created registry with a private endpoint or with registry firewall rules, import will fail. 
> * In an existing network-restricted Azure container registry that is used as an import source or target, enabling this network security feature is optional but recommended.

## Prerequisites

If you don't already have an Azure container registry, create a registry. For steps, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli.md).

To import an image to an Azure container registry, your identity must have write permissions to the target registry (at least Contributor role, or a custom role that allows the importImage action). See [Azure Container Registry roles and permissions](container-registry-roles.md#custom-roles). 

## Import from a public registry

### Import from Docker Hub

For example, use the [az acr import][az-acr-import] command to import the multi-architecture `hello-world:latest` image from Docker Hub to a registry named *myregistry*. Because `hello-world` is an official image from Docker Hub, this image is in the default `library` repository. Include the repository name and optionally a tag in the value of the `--source` image parameter. (You can optionally identify an image by its manifest digest instead of by tag, which guarantees a particular version of an image.)
 
```azurecli
az acr import \
  --name myregistry \
  --source docker.io/library/hello-world:latest \
  --image hello-world:latest
```

You can verify that multiple manifests are associated with this image by running the `az acr repository show-manifests` command:

```azurecli
az acr repository show-manifests \
  --name myregistry \
  --repository hello-world
```

If you have a [Docker Hub account](https://www.docker.com/pricing), we recommend that you use the credentials when importing an image from Docker Hub. Pass the Docker Hub user name and the password or a [personal access token](https://docs.docker.com/docker-hub/access-tokens/) as parameters to `az acr import`. The following example imports a public image from the `tensorflow` repository in Docker Hub, using Docker Hub credentials:

```azurecli
az acr import \
  --name myregistry \
  --source docker.io/tensorflow/tensorflow:latest-gpu \
  --image tensorflow:latest-gpu
  --username <Docker Hub user name>
  --password <Docker Hub token>
```

### Import from Microsoft Container Registry

For example, import the `ltsc2019` Windows Server Core image from the `windows` repository in Microsoft Container Registry.

```azurecli
az acr import \
--name myregistry \
--source mcr.microsoft.com/windows/servercore:ltsc2019 \
--image servercore:ltsc2019
```

## Import from an Azure container registry in the same AD tenant

You can import an image from an Azure container registry in the same AD tenant using integrated Azure Active Directory permissions.

* Your identity must have Azure Active Directory permissions to read from the source registry (Reader role) and to import to the target registry (Contributor role, or a [custom role](container-registry-roles.md#custom-roles) that allows the importImage action).

* The registry can be in the same or a different Azure subscription in the same Active Directory tenant.

* [Public access](container-registry-access-selected-networks.md#disable-public-network-access) to the source registry may be disabled. If public access is disabled, specify the source registry by resource ID instead of by registry login server name.

* If the source registry and/or the target registry has a private endpoint or registry firewall rules are applied, ensure that the restricted registry [allows trusted services](allow-access-trusted-services.md) to access the network.

### Import from a registry in the same subscription

For example, import the `aci-helloworld:latest` image from a source registry *mysourceregistry* to *myregistry* in the same Azure subscription.

```azurecli
az acr import \
  --name myregistry \
  --source mysourceregistry.azurecr.io/aci-helloworld:latest \
  --image aci-helloworld:latest
```

The following example imports the `aci-helloworld:latest` image to *myregistry* from a source registry *mysourceregistry* in which access to the registry's public endpoint is disabled. Supply the resource ID of the source registry with the `--registry` parameter. Notice that the `--source` parameter specifies only the source repository and tag, not the registry login server name.

```azurecli
az acr import \
  --name myregistry \
  --source aci-helloworld:latest \
  --image aci-helloworld:latest \
  --registry /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/sourceResourceGroup/providers/Microsoft.ContainerRegistry/registries/mysourceregistry
```

The following example imports an image by manifest digest (SHA-256 hash, represented as `sha256:...`) instead of by tag:

```azurecli
az acr import \
  --name myregistry \
  --source mysourceregistry.azurecr.io/aci-helloworld@sha256:123456abcdefg 
```

### Import from a registry in a different subscription

In the following example, *mysourceregistry* is in a different subscription from *myregistry* in the same Active Directory tenant. Supply the resource ID of the source registry with the `--registry` parameter. Notice that the `--source` parameter specifies only the source repository and tag, not the registry login server name.

```azurecli
az acr import \
  --name myregistry \
  --source samples/aci-helloworld:latest \
  --image aci-hello-world:latest \
  --registry /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/sourceResourceGroup/providers/Microsoft.ContainerRegistry/registries/mysourceregistry
```

### Import from a registry using service principal credentials

To import from a registry that you can't access using integrated Active Directory permissions, you can use service principal credentials (if available) to the source registry. Supply the appID and password of an Active Directory [service principal](container-registry-auth-service-principal.md) that has ACRPull access to the source registry. Using a service principal is useful for build systems and other unattended systems that need to import images to your registry.

```azurecli
az acr import \
  --name myregistry \
  --source sourceregistry.azurecr.io/sourcerrepo:tag \
  --image targetimage:tag \
  --username <SP_App_ID> \
  --password <SP_Passwd>
```

## Import from an Azure container registry in a different AD tenant

To import from an Azure container registry in a different Azure Active Directory tenant, specify the source registry by login server name, and provide username and password credentials that enable pull access to the registry. For example, use a [repository-scoped token](container-registry-repository-scoped-permissions.md) and password, or the appID and password of an Active Directory [service principal](container-registry-auth-service-principal.md) that has ACRPull access to the source registry. 

```azurecli
az acr import \
  --name myregistry \
  --source sourceregistry.azurecr.io/sourcerrepo:tag \
  --image targetimage:tag \
  --username <SP_App_ID> \
  --password <SP_Passwd>
```

## Import from a non-Azure private container registry

Import an image from a non-Azure private registry by specifying credentials that enable pull access to the registry. For example, pull an image from a private Docker registry: 

```azurecli
az acr import \
  --name myregistry \
  --source docker.io/sourcerepo/sourceimage:tag \
  --image sourceimage:tag \
  --username <username> \
  --password <password>
```

## Next steps

In this article, you learned about importing container images to an Azure container registry from a public registry or another private registry. For additional image import options, see the [az acr import][az-acr-import] command reference. 


<!-- LINKS - Internal -->
[az-login]: /cli/azure/reference-index#az_login
[az-acr-import]: /cli/azure/acr#az_acr_import
[azure-cli]: /cli/azure/install-azure-cli
