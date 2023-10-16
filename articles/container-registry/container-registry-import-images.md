---
title: Import container images
description: Import container images to an Azure container registry by using Azure APIs, without needing to run Docker commands.
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
ms.custom: devx-track-azurepowershell, devx-track-azurecli
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

> [!IMPORTANT]
>* Importing images requires the external registry support  [RFC 7233](https://www.rfc-editor.org/rfc/rfc7233#section-2.3). We recommend using a registry that supports RFC 7233 ranges while using az acr import command with the registry URI to avoid failures.

## Limitations

* The maximum number of manifests for an imported image is 50.
* The maximum layer size for an image imported from a public registry is 2 GiB.

### [Azure CLI](#tab/azure-cli)

To import container images, this article requires that you run the Azure CLI in Azure Cloud Shell or locally (version 2.0.55 or later recommended). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

### [Azure PowerShell](#tab/azure-powershell)

To import container images, this article requires that you run Azure PowerShell in Azure Cloud Shell or locally (version 5.9.0 or later recommended). Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install the Azure Az PowerShell module][install-the-azure-az-powershell-module].

---

[!INCLUDE [container-registry-geo-replication-include](../../includes/container-registry-geo-replication-include.md)]

> [!IMPORTANT]
> Changes to image import between two Azure container registries have been introduced as of January 2021:
> * Import to or from a network-restricted Azure container registry requires the restricted registry to [**allow access by trusted services**](allow-access-trusted-services.md) to bypass the network. By default, the setting is enabled, allowing import. If the setting isn't enabled in a newly created registry with a private endpoint or with registry firewall rules, import will fail.
> * In an existing network-restricted Azure container registry that is used as an import source or target, enabling this network security feature is optional but recommended.

## Prerequisites

### [Azure CLI](#tab/azure-cli)

If you don't already have an Azure container registry, create a registry. For steps, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli.md).

### [Azure PowerShell](#tab/azure-powershell)

If you don't already have an Azure container registry, create a registry. For steps, see [Quickstart: Create a private container registry using Azure PowerShell](container-registry-get-started-powershell.md).

---

To import an image to an Azure container registry, your identity must have write permissions to the target registry (at least Contributor role, or a custom role that allows the importImage action). See [Azure Container Registry roles and permissions](container-registry-roles.md#custom-roles).

## Import from a public registry

> [!IMPORTANT]
> To import from a public registry to a network-restricted Azure container registry requires the restricted registry to [**allow access by trusted services**](allow-access-trusted-services.md) to bypass the network.By default, the setting is enabled, allowing import. If the setting isn't enabled in a newly created registry with a private endpoint or with registry firewall rules, import will fail.

### Import from Docker Hub

### [Azure CLI](#tab/azure-cli)

For example, use the [az acr import][az-acr-import] command to import the multi-architecture `hello-world:latest` image from Docker Hub to a registry named *myregistry*. Because `hello-world` is an official image from Docker Hub, this image is in the default `library` repository. Include the repository name and optionally a tag in the value of the `--source` image parameter. (You can optionally identify an image by its manifest digest instead of by tag, which guarantees a particular version of an image.)

```azurecli
az acr import \
  --name myregistry \
  --source docker.io/library/hello-world:latest \
  --image hello-world:latest
```

You can verify that multiple manifests are associated with this image by running the [az acr manifest list-metadata](/cli/azure/acr/manifest#az-acr-manifest-list-metadata) command:

```azurecli
az acr manifest list-metadata \
  --name hello-world \
  --registry myregistry
```

To import an artifact by digest without adding a tag:

```azurecli
az acr import \
   --name myregistry \
   --source docker.io/library/hello-world@sha256:abc123 \
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

### [Azure PowerShell](#tab/azure-powershell)

For example, use the [Import-AzContainerRegistryImage][import-azcontainerregistryimage] command to import the multi-architecture `hello-world:latest` image from Docker Hub to a registry named *myregistry*. Because `hello-world` is an official image from Docker Hub, this image is in the default `library` repository. Include the repository name and optionally a tag in the value of the `-SourceImage` parameter. (You can optionally identify an image by its manifest digest instead of by tag, which guarantees a particular version of an image.)

```azurepowershell
Import-AzContainerRegistryImage -RegistryName myregistry -ResourceGroupName myResourceGroup -SourceRegistryUri docker.io -SourceImage library/hello-world:latest
```

You can verify that multiple manifests are associated with this image by running the `Get-AzContainerRegistryManifest` cmdlet:

```azurepowershell
Get-AzContainerRegistryManifest -RepositoryName library/hello-world -RegistryName myregistry
```

If you have a [Docker Hub account](https://www.docker.com/pricing), we recommend that you use the credentials when importing an image from Docker Hub. Pass the Docker Hub user name and the password or a [personal access token](https://docs.docker.com/docker-hub/access-tokens/) as parameters to `Import-AzContainerRegistryImage`. The following example imports a public image from the `tensorflow` repository in Docker Hub, using Docker Hub credentials:

```azurepowershell
Import-AzContainerRegistryImage -RegistryName myregistry -ResourceGroupName myResourceGroup -SourceRegistryUri docker.io -SourceImage tensorflow/tensorflow:latest-gpu -Username <Docker Hub user name> -Password <Docker Hub token>
```

---

### Import from Microsoft Container Registry

For example, import the `ltsc2019` Windows Server Core image from the `windows` repository in Microsoft Container Registry.

### [Azure CLI](#tab/azure-cli)

```azurecli
az acr import \
--name myregistry \
--source mcr.microsoft.com/windows/servercore:ltsc2019 \
--image servercore:ltsc2019
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Import-AzContainerRegistryImage -RegistryName myregistry -ResourceGroupName myResourceGroup -SourceRegistryUri mcr.microsoft.com -SourceImage windows/servercore:ltsc2019
```

---

## Import from an Azure container registry in the same AD tenant

You can import an image from an Azure container registry in the same AD tenant using integrated Microsoft Entra permissions.

* Your identity must have Microsoft Entra permissions to read from the source registry (Reader role) and to import to the target registry (Contributor role, or a [custom role](container-registry-roles.md#custom-roles) that allows the importImage action).

* The registry can be in the same or a different Azure subscription in the same Active Directory tenant.

* [Public access](container-registry-access-selected-networks.md#disable-public-network-access) to the source registry may be disabled. If public access is disabled, specify the source registry by resource ID instead of by registry login server name.

* If the source registry and/or the target registry has a private endpoint or registry firewall rules are applied, ensure that the restricted registry [allows trusted services](allow-access-trusted-services.md) to access the network.

### Import from a registry in the same subscription

For example, import the `aci-helloworld:latest` image from a source registry *mysourceregistry* to *myregistry* in the same Azure subscription.

### [Azure CLI](#tab/azure-cli)

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

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Import-AzContainerRegistryImage -RegistryName myregistry -ResourceGroupName myResourceGroup -SourceRegistryUri mysourceregistry.azurecr.io -SourceImage aci-helloworld:latest
```

The following example imports the `aci-helloworld:latest` image to *myregistry* from a source registry *mysourceregistry* in which access to the registry's public endpoint is disabled. Supply the resource ID of the source registry with the `--registry` parameter. Notice that the `--source` parameter specifies only the source repository and tag, not the registry login server name.

```azurepowershell
Import-AzContainerRegistryImage -RegistryName myregistry -ResourceGroupName myResourceGroup -SourceRegistryResourceId '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/sourceResourceGroup/providers/Microsoft.ContainerRegistry/registries/mysourceregistry' -SourceImage aci-helloworld:latest
```

The following example imports an image by manifest digest (SHA-256 hash, represented as `sha256:...`) instead of by tag:

```azurepowershell
Import-AzContainerRegistryImage -RegistryName myregistry -ResourceGroupName myResourceGroup -SourceRegistryUri mysourceregistry.azurecr.io -SourceImage aci-helloworld@sha256:123456abcdefg
```

---

### Import from a registry in a different subscription

### [Azure CLI](#tab/azure-cli)

In the following example, *mysourceregistry* is in a different subscription from *myregistry* in the same Active Directory tenant. Supply the resource ID of the source registry with the `--registry` parameter. Notice that the `--source` parameter specifies only the source repository and tag, not the registry login server name.

```azurecli
az acr import \
  --name myregistry \
  --source aci-helloworld:latest \
  --image aci-hello-world:latest \
  --registry /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/sourceResourceGroup/providers/Microsoft.ContainerRegistry/registries/mysourceregistry
```

### [Azure PowerShell](#tab/azure-powershell)

In the following example, *mysourceregistry* is in a different subscription from *myregistry* in the same Active Directory tenant. Supply the resource ID of the source registry with the `--registry` parameter. Notice that the `--source` parameter specifies only the source repository and tag, not the registry login server name.

```azurepowershell
Import-AzContainerRegistryImage -RegistryName myregistry -ResourceGroupName myResourceGroup -SourceRegistryResourceId '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/sourceResourceGroup/providers/Microsoft.ContainerRegistry/registries/mysourceregistry' -SourceImage aci-helloworld:latest
```

---

### Import from a registry using service principal credentials

To import from a registry that you can't access using integrated Active Directory permissions, you can use service principal credentials (if available) to the source registry. Supply the appID and password of an Active Directory [service principal](container-registry-auth-service-principal.md) that has ACRPull access to the source registry. Using a service principal is useful for build systems and other unattended systems that need to import images to your registry.


### [Azure CLI](#tab/azure-cli)

```azurecli
az acr import \
  --name myregistry \
  --source sourceregistry.azurecr.io/sourcerrepo:tag \
  --image targetimage:tag \
  --username <SP_App_ID> \
  --password <SP_Passwd>
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Import-AzContainerRegistryImage -RegistryName myregistry -ResourceGroupName myResourceGroup -SourceRegistryUri sourceregistry.azurecr.io -SourceImage sourcerrepo:tag -Username <SP_App_ID> -Password <SP_Passwd>
```

---

## Import from an Azure container registry in a different AD tenant

To import from an Azure container registry in a different Microsoft Entra tenant, specify the source registry by login server name, and provide credentials that enable pull access to the registry. 

### Cross-tenant import with username and password

For example, use a [repository-scoped token](container-registry-repository-scoped-permissions.md) and password, or the appID and password of an Active Directory [service principal](container-registry-auth-service-principal.md) that has ACRPull access to the source registry.

### [Azure CLI](#tab/azure-cli)

```azurecli
az acr import \
  --name myregistry \
  --source sourceregistry.azurecr.io/sourcerrepo:tag \
  --image targetimage:tag \
  --username <SP_App_ID> \
  --password <SP_Passwd>
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Import-AzContainerRegistryImage -RegistryName myregistry -ResourceGroupName myResourceGroup -SourceRegistryUri sourceregistry.azurecr.io -SourceImage sourcerrepo:tag -Username <SP_App_ID> -Password <SP_Passwd>
```

---

### Cross-tenant import with access token

To access the source registry using an identity in the source tenant that has registry permissions, you can get an access token:

### [Azure CLI](#tab/azure-cli)

```azurecli
# Login to Azure CLI with the identity, for example a user-assigned managed identity
az login --identity --username <identity_ID>

# Get access token returned by `az account get-access-token`
az account get-access-token
```

In the target tenant, pass the access token as a password to the `az acr import` command. The source registry is specified by login server name. Notice that no username is needed in this command:

```azurecli
az acr import \
  --name myregistry \
  --source sourceregistry.azurecr.io/sourcerrepo:tag \
  --image targetimage:tag \
  --password <access-token>
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Login to Azure PowerShell with the identity, for example a user-assigned managed identity
Connect-AzAccount -Identity -AccountId <identity_ID>

# Get access token returned by `Get-AzAccessToken`
Get-AzAccessToken
```

In the target tenant, pass the access token as a password to the `Import-AzContainerRegistryImage` cmdlet. The source registry is specified by login server name. Notice that no username is needed in this command:

```azurepowershell
Import-AzContainerRegistryImage -RegistryName myregistry -ResourceGroupName myResourceGroup -SourceRegistryUri sourceregistry.azurecr.io -SourceImage sourcerrepo:tag -Password <access-token>
```

---

> [!NOTE]
> Cross-tenant doesn't work across the clouds. Cross-tenant import over private endpoints is also not supported.


## Import from a non-Azure private container registry

Import an image from a non-Azure private registry by specifying credentials that enable pull access to the registry. For example, pull an image from a private Docker registry:

### [Azure CLI](#tab/azure-cli)

```azurecli
az acr import \
  --name myregistry \
  --source docker.io/sourcerepo/sourceimage:tag \
  --image sourceimage:tag \
  --username <username> \
  --password <password>
```

### [Azure PowerShell](#tab/azure-powershell)
```azurepowershell
Import-AzContainerRegistryImage -RegistryName myregistry -ResourceGroupName myResourceGroup -SourceRegistryUri docker.io/sourcerepo -SourceImage sourcerrepo:tag -Username <username> -Password <password>
```

---

## Next steps

In this article, you learned about importing container images to an Azure container registry from a public registry or another private registry.

### [Azure CLI](#tab/azure-cli)

* For additional image import options, see the [az acr import][az-acr-import] command reference.

### [Azure PowerShell](#tab/azure-powershell)

* For additional image import options, see the [Import-AzContainerRegistryImage][import-azcontainerregistryimage] cmdlet reference.

---

* Image import can help you move content to a container registry in a different Azure region, subscription, or Microsoft Entra tenant. For more information, see [Manually move a container registry to another region](manual-regional-move.md).

* Learn how to [disable artifact export](data-loss-prevention.md) from a network-restricted container registry.


<!-- LINKS - Internal -->
[az-login]: /cli/azure/reference-index#az_login
[az-acr-import]: /cli/azure/acr#az_acr_import
[azure-cli]: /cli/azure/install-azure-cli
[install-the-azure-az-powershell-module]: /powershell/azure/install-az-ps
[import-azcontainerregistryimage]: /powershell/module/az.containerregistry/import-azcontainerregistryimage
