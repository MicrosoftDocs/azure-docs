---
title: Attach, push, and pull supply chain artifacts
description: Attach, push, and pull supply chain artifacts using Azure Registry (Preview)
author: SteveLasker
manager: gwallace
ms.topic: article
ms.date: 01/04/2023
ms.author: stevelas
ms.custom: references_regions, devx-track-azurecli
---

# Push and pull supply chain artifacts using Azure Registry (Preview)

Use an Azure container registry to store and manage a graph of supply chain artifacts, including signatures, software bill of materials (SBoM), security scan results or other types.

![Graph of artifacts, including a container image, signature and signed software bill of materials](./media/container-registry-artifacts/oras-artifact-graph.svg)

To demonstrate this capability, this article shows how to use the [OCI Registry as Storage (ORAS)](https://oras.land) CLI to push and pull a graph of supply chain artifacts to an Azure container registry.

Storing individual OCI Artifacts are covered in [Push and pull OCI artifact](.container-registry-oci-artifacts.md). To store a graph of artifacts, a reference to a `subject` artifact is defined using the [OCI Artifact Manifest][oci-artifact-manifest], which is part of the [pre-release OCI 1.1 Distribution specification][oci-1_1-spec]. OCI Artifact Manifest support is a preview feature and subject to [limitations](#preview-limitations). 

## Prerequisites

* **Azure container registry** - Create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md).
* **Azure CLI** - Version `2.29.1` or later is recommended. Run `az --version `to find the required. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* **ORAS CLI** - Download and install the ORAS CLI `v0.16.0` for your operating system from the [ORAS installation guide](https://oras.land/cli/). 
* **Docker (optional)** - To complete the walkthrough, a container image is referenced. You can use [Docker installed locally][docker-install] to build and push a container image, reference an existing container image or use [ACR Build][az-acr-build] to build remotely, in Azure.

## Preview limitations

OCI Artifact Manifest support ([OCI 1.1 specification][oci-1_1-spec]) is available in all Azure public regions. Azure China and government clouds are not yet supported.

## Configure a registry

Configure environment variables to easily copy/paste commands into your shell. The commands can be run locally or in the [Azure Cloud Shell](https://shell.azure.com/).

```console
ACR_NAME=myregistry
REGISTRY=$ACR_NAME.azurecr.io
REPO=net-monitor
TAG=v1
IMAGE=$REGISTRY/${REPO}:$TAG
```

To create a new registry, see [Quickstart: Create a container registry using the Azure CLI][acr-create]

Authenticate with your [individual Azure AD identity](container-registry-authentication.md?tabs=azure-cli#individual-login-with-azure-ad) using an AD token. Always use "000..." for the `USER_NAME` as the token is parsed through the `PASSWORD` variable.

```azurecli
# Login to Azure
az login

# Login to ACR, using a token based on your Azure identity
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

## Push a container image

This example associates a graph of artifacts to a container image. Build and push a container image, or reference an existing image in the registry.

```bash
az acr build -r $ACR_NAME -t $IMAGE https://github.com/wabbit-networks/net-monitor.git#main
```

## Create a sample signature to the container image

```bash
echo '{"artifact": "'${IMAGE}'", "signature": "pat hancock"}' > signature.json
```

### Attach a signature to the registry, as a reference to the container image

The ORAS command attaches the signature to a repository, referencing another artifact. The `--artifact-type` provides for differentiating artifacts, similar to file extensions that enable different file types. One or more files can be attached by specifying `file:mediaType`.

```bash
oras attach $IMAGE \
    ./signature.json:application/json \
    --artifact-type signature/example
```

For more information on oras attach, see [ORAS documentation][oras-docs].

## Attach a multi-file artifact as a reference

Create some documentation around an artifact.

```bash
echo 'Readme Content' > readme.md
echo 'Detailed Content' > readme-details.md
```

Attach the multi-file artifact as a reference.

```bash
oras attach $IMAGE \
    ./readme.md:application/markdown \
    ./readme-details.md:application/markdown \
    --artifact-type readme/example
```

## Discovering artifact references

The [OCI v1.1 Specification][oci-spec] defines a [referrers API][oci-artifacts-referrers] for discovering references to a `subject` artifact. The `oras discover` command can show the list of references to the container image.

Using `oras discover`, view the graph of artifacts now stored in the registry.

```bash
oras discover -o tree $IMAGE
```

The output shows the beginning of a graph of artifacts, where the signature and docs are viewed as children of the container image.

```output
myregistry.azurecr.io/net-monitor:v1
├── signature/example
│   └── sha256:555ea91f39e7fb30c06f3b7aa483663f067f2950dcb...
└── readme/example
    └── sha256:1a118663d1085e229ff1b2d4d89b5f6d67911f22e55...
```

## Creating a deep graphs of artifacts

The OCI v1.1 Specification enables deep graphs, enabling signed software bill of materials (SBoM) and other artifact types.

### Create a sample SBoM

```bash
echo '{"version": "0.0.0.0", "artifact": "'${IMAGE}'", "contents": "good"}' > sbom.json
```

### Attach a sample SBoM to the image in the registry

```bash
oras attach $IMAGE \
  ./sbom.json:application/json \
  --artifact-type sbom/example
```

### Sign the SBoM

Artifacts that are pushed as references, typically do not have tags as they are considered part of the subject artifact. To push a signature to an artifact that is a child of another artifact, use the `oras discover` with `--artifact-type` filtering to find the digest.

```bash
SBOM_DIGEST=$(oras discover -o json \
                --artifact-type sbom/example \
                $IMAGE | jq -r ".manifests[0].digest")
```

Create a signature of an SBoM

```bash
echo '{"artifact": "'$IMAGE@$SBOM_DIGEST'", "signature": "pat hancock"}' > sbom-signature.json
```

### Attach the SBoM signature

```bash
oras attach $IMAGE@$SBOM_DIGEST \
  --artifact-type 'signature/example' \
  ./sbom-signature.json:application/json
```

### View the graph

```bash
oras discover -o tree $IMAGE
```

Generates the following output:

```output
myregistry.azurecr.io/net-monitor:v1
├── signature/example
│   └── sha256:555ea91f39e7fb30c06f3b7aa483663f067f2950dcb...
├── readme/example
│   └── sha256:1a118663d1085e229ff1b2d4d89b5f6d67911f22e55...
└── sbom/example
    └── sha256:4280eef9adb632b42cf200e7cd5a822a456a558e4f3142da6b...
        └── signature/example
            └── sha256:a31ab875d37eee1cca68dbb14b2009979d05594d44a075bdd7...
```

## Pull a referenced artifact

To pull a referenced type, the digest of reference is discovered with the `oras discover` command

```bash
DOC_DIGEST=$(oras discover -o json \
              --artifact-type 'readme/example' \
              $IMAGE | jq -r ".manifests[0].digest")
```

### Create a clean directory for downloading

```bash
mkdir ./download
```

### Pull the docs into the download directory
```bash
oras pull -o ./download $REGISTRY/$REPO@$DOC_DIGEST
```
### View the docs

```bash
ls ./download
```

## View the repository and tag listing

OCI Artifact Manifest enables artifact graphs to be pushed, discovered, pulled and copied without having to assign tags. This enables a tag listing to focus on the artifacts users think about, as opposed to the signatures and SBoMs that are associated with the container images, helm charts and other artifacts.

### View a list of tags

```azurecli
az acr repository show-tags \
  -n $ACR_NAME \
  --repository $REPO \
  -o jsonc
```

### View a list of manifests

A repository can have a list of manifests that are both tagged and untagged

```azurecli
az acr manifest list-metadata \
  --name $REPO \
  --registry $ACR_NAME \
  --output jsonc
```

Note the container image manifests have `"tags":`

```json
{
  "architecture": "amd64",
  "changeableAttributes": {
    "deleteEnabled": true,
    "listEnabled": true,
    "readEnabled": true,
    "writeEnabled": true
  },
  "configMediaType": "application/vnd.docker.container.image.v1+json",
  "createdTime": "2021-11-12T00:18:54.5123449Z",
  "digest": "sha256:a0fc570a245b09ed752c42d600ee3bb5b4f77bbd70d8898780b7ab4...",
  "imageSize": 2814446,
  "lastUpdateTime": "2021-11-12T00:18:54.5123449Z",
  "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
  "os": "linux",
  "tags": [
    "v1"
  ]
}
```

The signature is untagged, but tracked as a `oras.artifact.manifest` reference to the container image

```json
{
  "changeableAttributes": {
    "deleteEnabled": true,
    "listEnabled": true,
    "readEnabled": true,
    "writeEnabled": true
  },
  "createdTime": "2021-11-12T00:19:10.987156Z",
  "digest": "sha256:555ea91f39e7fb30c06f3b7aa483663f067f2950dcbcc0b0d...",
  "imageSize": 85,
  "lastUpdateTime": "2021-11-12T00:19:10.987156Z",
  "mediaType": "application/vnd.cncf.oras.artifact.manifest.v1+json"
}
```
## Delete all artifacts in the graph

Support for the OCI v1.1 Specification enables deleting the graph of artifacts associated with the root artifact. Use the [az acr repository delete][az-acr-repository-delete] command to delete the signature, SBoM and the signature of the SBoM.

```azurecli
az acr repository delete \
  -n $ACR_NAME \
  -t ${REPO}:$TAG -y
```

### View the remaining manifests

```azurecli
az acr manifest list-metadata \
  --name $REPO \
  --registry $ACR_NAME \
  --detail -o jsonc
```

## Next steps

* Learn more about [the ORAS CLI](https://oras.land/cli/)
* Learn more about [OCI Artifact Manifest][oci-artifact-manifest] for how to push, discover, pull, copy a graph of supply chain artifacts

<!-- LINKS - external -->
[docker-install]:       https://www.docker.com/get-started/
[oras-install-docs]:    https://oras.land/cli/
[oras-docs]:       https://oras.land/
[oci-artifacts-referrers]:  https://github.com/opencontainers/distribution-spec/blob/main/spec.md#listing-referrers/
[oci-artifact-manifest]:  https://github.com/opencontainers/image-spec/blob/main/artifact.md/
[oci-spec]:  https://github.com/opencontainers/distribution-spec/blob/main/spec.md/
[oci-1_1-spec]:   https://github.com/opencontainers/distribution-spec/releases/tag/v1.1.0-rc1

<!-- LINKS - internal -->
[az-acr-build]: /cli/azure/acr#az_acr_build
[az-acr-repository-show]: /cli/azure/acr/repository?#az_acr_repository_show
[az-acr-repository-delete]: /cli/azure/acr/repository#az_acr_repository_delete
