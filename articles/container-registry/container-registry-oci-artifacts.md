---
title: Push OCI artifacts to private Azure container registry
description: Push and pull Open Container Initiative (OCI) artifacts using a private container registry in Azure 
services: container-registry
author: dlepow
manager: gwallace

ms.service: container-registry
ms.topic: article
ms.date: 08/28/2019
ms.author: danlep
ms.custom: 
---

# Push and pull an OCI artifact using an Azure container registry

You can use an Azure container registry to store and manage [Open Container Initiative (OCI) artifacts](container-registry-image-formats.md#oci-artifacts) as well as Docker and Docker-compatible container images.

To demonstrate this capability, this article shows how to use the [OCI Registry as Storage (ORAS)](https://github.com/deislabs/oras) tool to push a sample artifact -  a text file - to an Azure container registry. Then, pull the artifact from the registry. You can manage a variety of OCI artifacts in an Azure container registry using different command-line tools appropriate to each artifact.

## Prerequisites

* **Azure CLI** - You need a local installation of the Azure CLI to run the examples in this article. Version 2.0.71 or later is recommended. Run `az --version `to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* **Docker** - You must also have Docker installed locally, to authenticate with the registry. Docker provides packages that easily configure Docker on any [macOS][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.
* **Azure container registry** - Create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md).
* **ORAS tool** - Download and install a current `oras` release for your operating system from the [GitHub repo](https://github.com/deislabs/oras/releases). The tool is released as a compressed tarball (`.tar.gz` file). Extract and install the file using standard procedures for your operating system.
* **Azure Active Directory service principal (optional)** - Optionally create a [service principal](container-registry-auth-service-principal.md) to access your registry. Ensure that the service principal is assigned a role such as AcrPush so that it has permissions to push and pull artifacts.

## Sign in to a registry

[Sign in](/cli/azure/authenticate-azure-cli) to the Azure CLI with an identity (your own, or a service principal) that has permissions to push and pull artifacts from the container registry.

Then, use the Azure CLI command [az acr login](/cli/azure/acr?view=azure-cli-latest#az-acr-login) to access the registry. For example, to authenticate to a registry named *myregistry*:

```azurecli
az acr login --name myregistry
```

## Push an artifact

Create a text file in a local working working directory with some sample text. For example, in a bash shell:

```bash
echo "Here is an artifact!" > artifact.txt
```

Use the `oras` tool to push this text file to your registry. The following example pushes the sample text file to the `samples/artifact` repo in *myregistry*. The artifact is tagged `v1`. Note that you push the artifact using the fully qualified registry name *myregistry.azurecr.io* (all lowercase). 

```bash
oras push myregistry.azurecr.io/samples/artifact:v1 artifact.txt
```

> [!TIP]
> This example pushes the file with the default *media type* `application/vnd.oci.image.layer.v1.tar`. To push a custom media type, use the format `filename:type`, for example, `artifact.txt:application/application/vnd.oci.unknown.layer.v1+txt`. See the artifacts [quick guide](https://stevelasker.blog/2019/05/11/authoring-oci-registry-artifacts-quick-guide/).

Output for a successful push is similar to the following:

```console
Uploading 33998889555f artifact.txt
Pushed myregistry.azurecr.io/samples/artifact:v1
Digest: sha256:xxxxxxbc912ef63e69136f05f1078dbf8d00960a79ee73c210eb2a5f65xxxxxx
```

To manage artifacts in your registry, use standard `az acr` commands for managing images. For example, get the attributes of the artifact using the [az acr repository show][az-acr-repository-show] command:

```azurecli
az acr repository show --name myregistry --image samples/artifact:v1
```

Output is similar to the following:

```json
{
  "changeableAttributes": {
    "deleteEnabled": true,
    "listEnabled": true,
    "readEnabled": true,
    "writeEnabled": true
  },
  "createdTime": "2019-08-28T20:43:31.0001687Z",
  "digest": "sha256:xxxxxxbc912ef63e69136f05f1078dbf8d00960a79ee73c210eb2a5f65xxxxxx",
  "lastUpdateTime": "2019-08-28T20:43:31.0001687Z",
  "name": "v1",
  "signed": false
}
```

## Pull an artifact

Run the `oras pull` command to pull the artifact from your registry.

First remove the text file from your local working directory:

```bash
rm artifact.txt
```

Run `oras pull` to pull the artifact:

```bash
oras pull myregistry.azurecr.io/samples/artifact:v1
```

Verify that the pull was successful:

```bash
$ cat artifact.txt
Here is an artifact!
```

## Remove the artifact (optional)

To remove the artifact from your Azure container registry, use the [az acr repository delete][az-acr-repository-delete] command. The following example removes the repository and any artifact you stored there:

```azurecli
az acr repository delete --name myregistry --repository samples/artifact
```

## Next steps

* Learn more about [the ORAS Library](https://github.com/deislabs/oras/tree/master/docs), including how to configure a manifest for an artifact.
* Visit the [OCI Artifacts](https://github.com/opencontainers/artifacts) repo for reference information about new artifact types.



<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-windows]: https://docs.docker.com/docker-for-windows/

[az-acr-repository-show]: /cli/azure/acr/repository?#az-acr-repository-show

[az-acr-repository-delete]: /cli/azure/acr/repository#az-acr-repository-delete
