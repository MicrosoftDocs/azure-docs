---
title: Push and pull OCI artifact
description: Push and pull Open Container Initiative (OCI) artifacts using a private container registry in Azure 
author: SteveLasker
manager: gwallace
ms.topic: article
ms.date: 03/11/2020
ms.author: stevelas
---

# Push and pull an OCI artifact using an Azure container registry

You can use an Azure container registry to store and manage [Open Container Initiative (OCI) artifacts](container-registry-image-formats.md#oci-artifacts) as well as Docker and Docker-compatible container images.

To demonstrate this capability, this article shows how to use the [OCI Registry as Storage (ORAS)](https://github.com/deislabs/oras) tool to push a sample artifact -  a text file - to an Azure container registry. Then, pull the artifact from the registry. You can manage a variety of OCI artifacts in an Azure container registry using different command-line tools appropriate to each artifact.

## Prerequisites

* **Azure container registry** - Create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md).
* **ORAS tool** - Download and install a current ORAS release for your operating system from the [GitHub repo](https://github.com/deislabs/oras/releases). The tool is released as a compressed tarball (`.tar.gz` file). Extract and install the file using standard procedures for your operating system.
* **Azure Active Directory service principal (optional)** - To authenticate directly with ORAS, create a [service principal](container-registry-auth-service-principal.md) to access your registry. Ensure that the service principal is assigned a role such as AcrPush so that it has permissions to push and pull artifacts.
* **Azure CLI (optional)** - To use an individual identity, you need a local installation of the Azure CLI. Version 2.0.71 or later is recommended. Run `az --version `to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* **Docker (optional)** - To use an individual identity, you must also have Docker installed locally, to authenticate with the registry. Docker provides packages that easily configure Docker on any [macOS][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.


## Sign in to a registry

This section shows two suggested workflows to sign into the registry, depending on the identity used. Choose the method appropriate for your environment.

### Sign in with ORAS

Using a [service principal](container-registry-auth-service-principal.md) with push rights, run the `oras login` command to sign in to the registry using the service principal application ID and password. Specify the fully qualified registry name (all lowercase), in this case *myregistry.azurecr.io*. The service principal application ID is passed in the environment variable `$SP_APP_ID`, and the password in the variable `$SP_PASSWD`.

```bash
oras login myregistry.azurecr.io --username $SP_APP_ID --password $SP_PASSWD
```

To read the password from Stdin, use `--password-stdin`.

### Sign in with Azure CLI

[Sign in](/cli/azure/authenticate-azure-cli) to the Azure CLI with your identity to push and pull artifacts from the container registry.

Then, use the Azure CLI command [az acr login](/cli/azure/acr?view=azure-cli-latest#az-acr-login) to access the registry. For example, to authenticate to a registry named *myregistry*:

```azurecli
az login
az acr login --name myregistry
```

> [!NOTE]
> `az acr login` uses the Docker client to set an Azure Active Directory token in the `docker.config` file. The Docker client must be installed and running to complete the individual authentication flow.

## Push an artifact

Create a text file in a local working working directory with some sample text. For example, in a bash shell:

```bash
echo "Here is an artifact!" > artifact.txt
```

Use the `oras push` command to push this text file to your registry. The following example pushes the sample text file to the `samples/artifact` repo. The registry is identified with the fully qualified registry name *myregistry.azurecr.io* (all lowercase). The artifact is tagged `1.0`. The artifact has an undefined type, by default, identified by the *media type* string following the filename `artifact.txt`. See [OCI Artifacts](https://github.com/opencontainers/artifacts) for additional types. 

**Linux**

```bash
oras push myregistry.azurecr.io/samples/artifact:1.0 \
    --manifest-config /dev/null:application/vnd.unknown.config.v1+json \
    ./artifact.txt:application/vnd.unknown.layer.v1+txt
```

**Windows**

```cmd
.\oras.exe push myregistry.azurecr.io/samples/artifact:1.0 ^
    --manifest-config NUL:application/vnd.unknown.config.v1+json ^
    .\artifact.txt:application/vnd.unknown.layer.v1+txt
```

Output for a successful push is similar to the following:

```console
Uploading 33998889555f artifact.txt
Pushed myregistry.azurecr.io/samples/artifact:1.0
Digest: sha256:xxxxxxbc912ef63e69136f05f1078dbf8d00960a79ee73c210eb2a5f65xxxxxx
```

To manage artifacts in your registry, if you are using the Azure CLI, run standard `az acr` commands for managing images. For example, get the attributes of the artifact using the [az acr repository show][az-acr-repository-show] command:

```azurecli
az acr repository show \
    --name myregistry \
    --image samples/artifact:1.0
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
  "name": "1.0",
  "signed": false
}
```

## Pull an artifact

Run the `oras pull` command to pull the artifact from your registry.

First remove the text file from your local working directory:

```bash
rm artifact.txt
```

Run `oras pull` to pull the artifact, and specify the media type used to push the artifact:

```bash
oras pull myregistry.azurecr.io/samples/artifact:1.0 \
    --media-type application/vnd.unknown.layer.v1+txt
```

Verify that the pull was successful:

```bash
$ cat artifact.txt
Here is an artifact!
```

## Remove the artifact (optional)

To remove the artifact from your Azure container registry, use the [az acr repository delete][az-acr-repository-delete] command. The following example removes the artifact you stored there:

```azurecli
az acr repository delete \
    --name myregistry \
    --image samples/artifact:1.0
```

## Next steps

* Learn more about [the ORAS Library](https://github.com/deislabs/oras/tree/master/docs), including how to configure a manifest for an artifact
* Visit the [OCI Artifacts](https://github.com/opencontainers/artifacts) repo for reference information about new artifact types



<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - internal -->
[az-acr-repository-show]: /cli/azure/acr/repository?#az-acr-repository-show
[az-acr-repository-delete]: /cli/azure/acr/repository#az-acr-repository-delete
