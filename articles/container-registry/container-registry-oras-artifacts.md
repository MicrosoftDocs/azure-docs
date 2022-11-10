---
title: Attach, push, and pull supply chain artifacts
description: Attach, push, and pull supply chain artifacts using Azure Registry (Preview)
author: SteveLasker
manager: gwallace
ms.topic: article
ms.date: 10/11/2022
ms.author: stevelas
ms.custom: references_regions, devx-track-azurecli
---

# Push and pull supply chain artifacts using Azure Registry (Preview)

Use an Azure container registry to store and manage a graph of artifacts, including signatures, software bill of materials (SBoM), security scan results or other types. 

![Graph of artifacts, including a container image, signature and signed software bill of materials](./media/container-registry-artifacts/oras-artifact-graph.svg)

To demonstrate this capability, this article shows how to use the [OCI Registry as Storage (ORAS)](https://oras.land) tool to push and pull a graph of artifacts to an Azure container registry.

ORAS Artifacts support is a preview feature and subject to [limitations](#preview-limitations). It requires [zone redundancy](zone-redundancy.md), which is available in the Premium service tier. For information about registry service tiers and limits, see [Azure Container Registry service tiers](container-registry-skus.md).

## Prerequisites

* **ORAS CLI** - The ORAS CLI enables attach, copy, push, discover, pull of artifacts to an ORAS Artifacts enabled registry.
* **Azure CLI** - To create an identity, list and delete repositories, you need a local installation of the Azure CLI. Version 2.29.1 or later is recommended. Run `az --version `to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* **Docker (optional)** - To complete the walkthrough, a container image is referenced. You can use Docker installed locally to build and push a container image, or reference an existing container image. Docker provides packages that easily configure Docker on any [macOS][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

## Preview limitations

ORAS Artifacts support is not available in the government or China clouds, but available in all other regions.

## ORAS installation

Download and install a preview ORAS release for your operating system. See [ORAS installation instructions][oras-install-docs] for how to extract and install the file for your operating system. This article uses ORAS CLI 0.14.1 to demonstrate how to manage supply chain artifacts in ACR.

## Configure a registry

Configure environment variables to easily copy/paste commands into your shell. The commands can be run in the [Azure Cloud Shell](https://shell.azure.com/).

```console
ACR_NAME=myregistry
REGISTRY=$ACR_NAME.azurecr.io
REPO=net-monitor
TAG=v1
IMAGE=$REGISTRY/${REPO}:$TAG
```

### Create a resource group

If needed, run the [az group create](/cli/azure/group#az-group-create) command to create a resource group for the registry.

```azurecli
az group create --name $ACR_NAME --location southcentralus
```
### Create ORAS Artifact enabled registry

Preview support for ORAS Artifacts requires Zone Redundancy, which requires a Premium service tier, in the South Central US region. Run the [az acr create](/cli/azure/acr#az-acr-create) command to create an ORAS Artifacts enabled registry. See the `az acr create` command help for more registry options.

```azurecli
az acr create \
  --resource-group $ACR_NAME \
  --name $ACR_NAME \
  --zone-redundancy enabled \
  --sku Premium \
  --output jsonc
```

In the command output, note the `zoneRedundancy` property for the registry. When enabled, the registry is zone redundant, and ORAS Artifact enabled.

```output
{
  [...]
  "zoneRedundancy": "Enabled",
}
```

### Sign in with Azure CLI

[Sign in](/cli/azure/authenticate-azure-cli) to the Azure CLI with your identity to push and pull artifacts from the container registry.

Then, use the Azure CLI command [az acr login](/cli/azure/acr#az-acr-login) to access the registry.

```azurecli
az login
az acr login --name $ACR_NAME
```

> [!NOTE]
> `az acr login` uses the Docker client to set an Azure Active Directory token in the `docker.config` file. The Docker client must be installed and running to complete the individual authentication flow.

## Sign in with ORAS

This section shows options to sign into the registry. Choose the method appropriate for your environment.

Run  `oras login` to authenticate with the registry. You may pass [registry credentials](container-registry-authentication.md) appropriate for your scenario, such as service principal credentials, user identity, or a repository-scoped token (preview).

- Authenticate with your [individual Azure AD identity](container-registry-authentication.md?tabs=azure-cli#individual-login-with-azure-ad) to use an AD token.

  ```azurecli
  USER_NAME="00000000-0000-0000-0000-000000000000"
  PASSWORD=$(az acr login --name $ACR_NAME --expose-token --output tsv --query accessToken)
  ```

- Authenticate with a [repository scoped token](container-registry-repository-scoped-permissions.md) (Preview) to use non-AD based tokens.

  ```azurecli
  USER_NAME="oras-token"
  PASSWORD=$(az acr token create -n $USER_NAME \
                    -r $ACR_NAME \
                    --repository $REPO content/write \
                    --only-show-errors \
                    --query "credentials.passwords[0].value" -o tsv)
  ```

- Authenticate with an Azure Active Directory [service principal with pull and push permissions](container-registry-auth-service-principal.md#create-a-service-principal) (AcrPush role) to the registry.

  ```azurecli
  SERVICE_PRINCIPAL_NAME="oras-sp"
  ACR_REGISTRY_ID=$(az acr show --name $ACR_NAME --query id --output tsv)
  PASSWORD=$(az ad sp create-for-rbac --name $SERVICE_PRINCIPAL_NAME \
            --scopes $(az acr show --name $ACR_NAME --query id --output tsv) \
             --role acrpush \
            --query "password" --output tsv)
  USER_NAME=$(az ad sp list --display-name $SERVICE_PRINCIPAL_NAME --query "[].appId" --output tsv)
  ```

### Sign in with ORAS

Supply the credentials to `oras login`.

  ```bash
  oras login $REGISTRY \
    --username $USER_NAME \
    --password $PASSWORD
  ```

To read the password from Stdin, use `--password-stdin`.

## Push a container image

This example associates a graph of artifacts to a container image. Build and push a container image, or reference an existing image in the registry.

```bash
docker build -t $IMAGE https://github.com/wabbit-networks/net-monitor.git#main
docker push $IMAGE
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
    ./readme-details.md:application/markdown
    --artifact-type readme/example
```

## Discovering artifact references

The ORAS Artifacts Specification defines a [referrers API][oras-artifacts-referrers] for discovering references to a `subject` artifact. The `oras discover` command can show the list of references to the container image.

Using `oras discover`, view the graph of artifacts now stored in the registry.

```bash
oras discover -o tree $IMAGE
```

The output shows the beginning of a graph of artifacts, where the signature and docs are viewed as children of the container image.

```output
myregistry.azurecr.io/net-monitor:v1
├── signature/example
│   └── sha256:555ea91f39e7fb30c06f3b7aa483663f067f2950dcb...
└── readme/example
    └── sha256:1a118663d1085e229ff1b2d4d89b5f6d67911f22e55...
```

## Creating a deep graphs of artifacts

The ORAS Artifacts specification enables deep graphs, enabling signed software bill of materials (SBoM) and other artifact types.

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
                $IMAGE | jq -r ".referrers[0].digest")
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
│   └── sha256:555ea91f39e7fb30c06f3b7aa483663f067f2950dcb...
├── readme/example
│   └── sha256:1a118663d1085e229ff1b2d4d89b5f6d67911f22e55...
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
              $IMAGE | jq -r ".referrers[0].digest")
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

ORAS Artifacts enables artifact graphs to be pushed, discovered, pulled and copied without having to assign tags. This enables a tag listing to focus on the artifacts users think about, as opposed to the signatures and SBoMs that are associated with the container images, helm charts and other artifacts.

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

Support for the ORAS Artifacts specification enables deleting the graph of artifacts associated with the root artifact. Use the [az acr repository delete][az-acr-repository-delete] command to delete the signature, SBoM and the signature of the SBoM.

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
* Learn more about [ORAS Artifacts][oras-artifacts] for how to push, discover, pull, copy a graph of supply chain artifacts

<!-- LINKS - external -->
[docker-linux]:         https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]:           https://docs.docker.com/docker-for-mac/
[docker-windows]:       https://docs.docker.com/docker-for-windows/
[oras-install-docs]:    https://oras.land/cli/
[oras-docs]:       https://oras.land/
[oras-artifacts]:       https://github.com/oras-project/artifacts-spec/
<!-- LINKS - internal -->
[az-acr-repository-show]: /cli/azure/acr/repository?#az_acr_repository_show
[az-acr-repository-delete]: /cli/azure/acr/repository#az_acr_repository_delete
