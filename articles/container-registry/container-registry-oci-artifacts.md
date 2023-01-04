---
title: Push and pull OCI artifact
description: Push and pull Open Container Initiative (OCI) artifacts using a container registry in Azure
author: SteveLasker
manager: gwallace
ms.topic: article
ms.date: 01/03/2023
ms.author: stevelas
---

# Push and pull an OCI artifact using an Azure container registry

You can use an Azure container registry to store and manage [Open Container Initiative (OCI) artifacts](container-registry-image-formats.md#oci-artifacts) as well as Docker and OCI container images.

To demonstrate this capability, this article shows how to use the [OCI Registry as Storage (ORAS)](https://github.com/deislabs/oras) CLI to push a sample artifact -  a text file - to an Azure container registry. Then, pull the artifact from the registry. You can manage a variety of OCI artifacts in an Azure container registry using different command-line tools appropriate to each artifact.

## Prerequisites

* **Azure container registry** - Create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md).
* **Azure CLI** - Version `2.29.1` or later is recommended. Run `az --version `to find the required. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* **ORAS CLI** - Download and install the ORAS CLI `v0.16.0` for your operating system from the [ORAS installation guide](https://oras.land/cli/). 

## Configure a registry

Configure environment variables to easily copy/paste commands into your shell. The commands can be run locally or in the [Azure Cloud Shell](https://shell.azure.com/).

```bash
ACR_NAME=myregistry
REGISTRY=$ACR_NAME.azurecr.io
```

To create a new registry, see [Quickstart: Create a container registry using the Azure CLI][acr-create]
## Sign in to a registry

Authenticate with your [individual Azure AD identity](container-registry-authentication.md?tabs=azure-cli#individual-login-with-azure-ad) using an AD token. Always use "000..." for the `USER_NAME` as the token is parsed through the `PASSWORD` variable.

```azurecli
USER_NAME="00000000-0000-0000-0000-000000000000"
PASSWORD=$(az acr login --name $ACR_NAME --expose-token --output tsv --query accessToken)
```

> [!NOTE]
> ACR and ORAS support multiple authentication options for users and system automation. This article uses individual identity, using an Azure token. For more authentication options see [Authenticate with an Azure container registry][acr-authentication]


### Sign in with ORAS

Provide the credentials to `oras login`.

  ```bash
  oras login $REGISTRY \
    --username $USER_NAME \
    --password $PASSWORD
  ```

## Push an artifact

Create content that represents a markdown file:

```bash
echo 'Readme Content' > readme.md
```

Use the `oras push` command to push the file to your registry. 

The following example pushes the `readme.md` file to the `samples/artifact` repo. The registry is identified with the fully qualified registry name `myregistry.azurecr.io` (all lowercase) with the namespace and repo following. The artifact is tagged `readme`, to identify it uniquely from other artifacts listed in the repo (`latest, v1, v1.0.1`). The type is set through the `-config` parameter. `/dev/null` represents an empty config object, where the `:readme/example` identifies the artifact type, differentiating it from a container images which use `application/vnd.oci.image.config.v1+json`. The `./readme.md` identifies the file uploaded, and the `:application/markdown` represents the IANA `mediaType` of the file. See [OCI Artifacts](https://github.com/opencontainers/artifacts/blob/main/artifact-authors.md) for additional information.

**Linux, WSL2 or macOS**

```bash
oras push $REGISTRY/samples/artifact:readme \
    --config /dev/null:readme/example\
    ./readme.md:application/markdown
```

**Windows**

```cmd
.\oras.exe push $REGISTRY/samples/artifact:1.0 ^
    --config NUL:readme/example ^
    .\readme.md:application/markdown
```

Output for a successful push is similar to the following:

```console
Uploading 2fdeac43552b readme.md
Uploaded  2fdeac43552b readme.md
Pushed demo42.azurecr.io/samples/artifact:readme
Digest: sha256:e2d60d1b171f08bd10e2ed171d56092e39c7bac1aec5d9dcf7748dd702682d53
```

## Pull an artifact

Create a clean directory for downloading

```bash
mkdir ./download
```

Run the `oras pull` command to pull the artifact from your registry.

```bash
oras pull -o ./download $REGISTRY/samples/artifact:readme
```

### View the pulled files

```bash
ls ./download
```

## Remove the artifact (optional)

To remove the artifact from your Azure container registry, use the [az acr repository delete][az-acr-repository-delete] command. The following example removes the artifact you stored there:

```azurecli
az acr repository delete \
    --name $REGISTRY \
    --image samples/artifact:readme
```

## Next steps

* Learn more about [the ORAS Library](https://github.com/deislabs/oras), including how to configure a manifest for an artifact
* Visit the [OCI Artifacts](https://github.com/opencontainers/artifacts) repo for reference information about new artifact types



<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - internal -->
[acr-authentication]: /articles/container-registry/container-registry-authentication.md?tabs=azure-cli
[az-acr-repository-show]: /cli/azure/acr/repository?#az_acr_repository_show
[az-acr-repository-delete]: /cli/azure/acr/repository#az_acr_repository_delete
[acr-create]: /container-registry/container-registry-get-started-azure-cli