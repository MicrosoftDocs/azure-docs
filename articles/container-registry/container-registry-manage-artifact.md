---
title: Manage OCI Artifacts and Supply Chain Artifacts with ORAS
description: A comprehensive guide on how to use Azure Container Registry to store, manage, and retrieve OCI and supply chain artifacts.
author: tejaswikolli-web
ms.topic: how-to # Don't change
ms.date: 01/24/2024
ms.author: tejaswikolli
ms.service: container-registry
#customer intent: As a developer, I want a comprehensive guide on using Azure Container Registry to manage OCI and supply chain artifacts so that I can effectively store and retrieve them.
---

# Manage OCI Artifacts and Supply Chain Artifacts with ORAS

Azure container registry (ACR) helps you manage both the Open container initiative (OCI) artifacts and supply chain artifacts. This article guides you how to use ACR for managing OCI artifacts and supply chain artifacts effectively. Learn to store, manage, and retrieve both OCI artifacts and a graph of supply chain artifacts, including signatures, software bill of materials (SBOM), security scan results, and other types.

This article is divided into two main sections:

* [Push and pull OCI artifacts with ORAS](container-registry-manage-artifact.md#push-and-pull-oci-artifacts-with-oras)
* [Attach, push, and pull supply chain artifacts with ORAS](container-registry-manage-artifact.md#attach-push-and-pull-supply-chain-artifacts-with-oras)

## Prerequisites

* **Azure container registry** - Create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI][az-acr-create].  
* **Azure CLI** - Version `2.29.1` or later is required. See [Install Azure CLI][azure-cli-install] for installation and/or upgrade.
* **ORAS CLI** - Version `v1.1.0` or later version is required. See: [ORAS installation][oras-install-docs].
* **Docker (Optional)** - To complete the walkthrough, a container image is referenced.
You can use [Docker installed locally][docker-install] to build and push a container image, or use [`acr build`][az-acr-build] to build remotely in Azure.  
While Docker Desktop isn't required, the `oras` cli utilizes the Docker desktop credential store for storing credentials. If Docker Desktop is installed, it must be running for `oras login`.

## Configure the registry

To configure your environment for easy command execution, follow these steps:

1. Set the `ACR_NAME` variable to your registry name.
2. Set the `REGISTRY` variable to `$ACR_NAME.azurecr.io`.
3. Set the `REPO` variable to your repository name.
4. Set the `TAG` variable to your desired tag.
5. Set the `IMAGE` variable to `$REGISTRY/${REPO}:$TAG`.

### Set environment variables

Configure a registry name, login credentials, a repository name, and tag to push and pull artifacts. The following example uses the `net-monitor` repository name and `v1` tag. Replace with your own repository name and tag.

```bash
ACR_NAME=myregistry
REGISTRY=$ACR_NAME.azurecr.io
REPO=net-monitor
TAG=v1
IMAGE=$REGISTRY/${REPO}:$TAG
```

### Sign in to a registry

Authenticate with the ACR, for allowing you to pull and push container images.

```azurecli
az login  
az acr login -n $REGISTRY  
``` 

If Docker isn't available, you can utilize the AD token provided for authentication. Authenticate with your[individual Microsoft Entra identity](container-registry-authentication.md?tabs=azure-cli#individual-login-with-azure-ad) using an AD token. Always use "000..." for the `USER_NAME` as the token is parsed through the `PASSWORD` variable.

```azurecli
# Login to Azure
az login
```

### Sign in with ORAS

Provide the credentials to `oras login`.

```bash
oras login $REGISTRY \
    --username $USER_NAME \
    --password $PASSWORD
```

This setup enables you to seamlessly push and pull artifacts to and from your Azure Container Registry. Adjust the variables as needed for your specific configuration.

## Push and Pull OCI Artifacts with ORAS

You can use an [Azure container registry][acr-landing] to store and manage [Open Container Initiative (OCI) artifacts](container-registry-image-formats.md#oci-artifacts) as well as Docker and OCI container images.

To demonstrate this capability, this section shows how to use the [OCI Registry as Storage (ORAS)][oras-cli] CLI to push and pull OCI artifacts to/from an Azure container registry. You can manage various OCI artifacts in an Azure container registry using different command-line tools appropriate to each artifact.

> [!NOTE]
> ACR and ORAS support multiple authentication options for users and system automation. This article uses individual identity, using an Azure token. For more authentication options see [Authenticate with an Azure container registry.][acr-authentication]

### Push an artifact

A single file artifact that has no `subject` parent can be anything from a container image, a helm chart, a readme file for the repository. Reference artifacts can be anything from a signature, software bill of materials, scan reports, or other evolving types. Reference artifacts, described in [Attach, push, and pull supply chain artifacts](container-registry-manage-artifact.md#attach-push-and-pull-supply-chain-artifacts-with-oras) are artifacts that refer to another artifact.

#### Push a Single-File Artifact

For this example, create content that represents a markdown file:

```bash
echo 'Readme Content' > readme.md
```

The following step pushes the `readme.md` file to `<myregistry>.azurecr.io/samples/artifact:readme`.
- The registry is identified with the fully qualified registry name `<myregistry>.azurecr.io` (all lowercase), followed by the namespace and repo: `/samples/artifact`.
- The artifact is tagged `:readme`, to identify it uniquely from other artifacts listed in the repo (`:latest, :v1, :v1.0.1`).
- Setting `--artifact-type readme/example` differentiates the artifact from a container image, which uses `application/vnd.oci.image.config.v1+json`.
- The `./readme.md` identifies the file uploaded, and the `:application/markdown` represents the [IANA `mediaType`][iana-mediatypes] of the file.  
  For more information, see [OCI Artifact Authors Guidance](https://github.com/opencontainers/artifacts/blob/main/artifact-authors.md).

Use the `oras push` command to push the file to your registry. 

**Linux, WSL2 or macOS**

```bash
oras push $REGISTRY/samples/artifact:readme \
    --artifact-type readme/example \
    ./readme.md:application/markdown
```

**Windows**

```cmd
.\oras.exe push $REGISTRY/samples/artifact:readme ^
    --artifact-type readme/example ^
    .\readme.md:application/markdown
```

Output for a successful push is similar to the following output:

```console
Uploading 2fdeac43552b readme.md
Uploaded  2fdeac43552b readme.md
Pushed <myregistry>.azurecr.io/samples/artifact:readme
Digest: sha256:e2d60d1b171f08bd10e2ed171d56092e39c7bac1

aec5d9dcf7748dd702682d53
```

#### Push a multi-file artifact

When OCI artifacts are pushed to a registry with ORAS, each file reference is pushed as a blob. To push separate blobs, reference the files individually, or collection of files by referencing a directory.  
For more information how to push a collection of files, see [Pushing artifacts with multiple files.][oras-push-multifiles]

Create some documentation for the repository:

```bash
echo 'Readme Content' > readme.md
mkdir details/
echo 'Detailed Content' > details/readme-details.md
echo 'More detailed Content' > details/readme-more-details.md
```

Push the multi-file artifact:

**Linux, WSL2 or macOS**

```bash
oras push $REGISTRY/samples/artifact:readme \
    --artifact-type readme/example\
    ./readme.md:application/markdown\
    ./details
```

**Windows**

```cmd
.\oras.exe push $REGISTRY/samples/artifact:readme ^
    --artifact-type readme/example ^
    .\readme.md:application/markdown ^
    .\details
```

### Discover the manifest

To view the manifest created as a result of `oras push`, use `oras manifest fetch`:

```bash
oras manifest fetch --pretty $REGISTRY/samples/artifact:readme
```

The output is similar to:

```json
{
  "mediaType": "application/vnd.oci.artifact.manifest.v1+json",
  "artifactType": "readme/example",
  "blobs": [
    {
      "mediaType": "application/markdown",
      "digest": "sha256:2fdeac43552b71eb9db534137714c7bad86b53a93c56ca96d4850c9b41b777fc",
      "size": 15,
      "annotations": {
        "org.opencontainers.image.title": "readme.md"
      }
    },
    {
      "mediaType": "application/vnd.oci.image.layer.v1.tar+gzip",
      "digest": "sha256:0d6c7434a34f6854f971487621426332e6c0fda08040b9e6cc8a93f354cee0b1",
      "size": 189,
      "annotations": {
        "io.deis.oras.content.digest": "sha256:11eceb2e7ac3183ec9109003a7389468ec73ad5ceaec0c4edad0c1b664c5593a",
        "io.deis.oras.content.unpack": "true",
        "org.opencontainers.image.title": "details"
      }
    }
  ],
  "annotations": {
    "org.opencontainers.artifact.created": "2023-01-10T14:44:06Z"
  }
}
```

### Pull an artifact

Create a clean directory for downloading.

```bash
mkdir ./download
```

Run the `oras pull` command to pull the artifact from your registry.

```bash
oras pull -o ./download $REGISTRY/samples/artifact:readme
```

### View the pulled files

```bash
tree ./download
```

### Remove the artifact (optional)

To remove the artifact from your registry, use the `oras manifest delete` command.

```bash
 oras manifest delete $REGISTRY/samples/artifact:readme
```

## Attach, push, and pull supply chain artifacts with ORAS

To demonstrate this capability, this article shows how to use the [OCI Registry as Storage (ORAS)](https://oras.land) CLI to `push`, `discover`, and `pull` a graph of supply chain artifacts to an Azure container registry.
Storing individual (subject) OCI Artifacts are covered in [Push and pull OCI artifacts](container-registry-manage-artifact.md#push-and-pull-oci-artifacts-with-oras).

To store a graph of artifacts, a reference to a `subject` artifact is defined using the [OCI image manifest][oci-image-manifest], which is part of the [prerelease OCI 1.1 Distribution specification][oci-1_1-spec].

### Push a container image

To associate a graph of artifacts with a container image using the Azure CLI:

You can build and push a container image, or skip this step if `$IMAGE` references an existing image in the registry.

```bash
az acr build -r $ACR_NAME -t $IMAGE https://github.com/wabbit-networks/net-monitor.git#main
```

### Attaching a Signature

```bash
echo '{"artifact": "'${IMAGE}'", "signature": "jayden hancock"}' > signature.json
```

#### Attach a signature to the registry, as a reference to the container image

The `oras attach` command creates a reference between the file (`./signature.json`) to the `$IMAGE`. The `--artifact-type` provides for differentiating artifacts, similar to file extensions that enable different file types. One or more files can be attached by specifying `[file]:[mediaType]`.

```bash
oras attach $IMAGE \
    --artifact-type signature/example \
    ./signature.json:application/json
```

For more information on oras attach, see [ORAS documentation][oras-docs].

### Attach a multi-file artifact as a reference

When OCI artifacts are pushed to a registry with ORAS, each file reference is pushed as a blob. To push separate blobs, reference the files individually, or collection of files by referencing a directory.  
For more information how to push a collection of files, see [Pushing artifacts with multiple files][oras-push-multifiles].

### Discovering artifact references

The [OCI v1.1 Specification][oci-spec] defines a [referrers API][oci-artifact-referrers] for discovering references to a `subject` artifact. The `oras discover` command can show the list of references to the container image.

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

### Creating Artifacts graphs

The OCI v1.1 Specification enables deep graphs, enabling signed software bill of materials (SBOM) and other artifact types.

Here's how to create and attach an SBOM to the registry:

#### Create a sample SBOM

```bash
echo '{"version": "0.0.0.0", "artifact": "'${IMAGE}'", "contents": "good"}' > sbom.json
```

#### Attach a sample SBOM to the image in the registry

**Linux, WSL2 or macOS**

```bash
oras attach $IMAGE \
  --artifact-type sbom/example \
  ./sbom.json:application/json
```

**Windows**

```cmd
.\oras.exe attach $IMAGE ^
    --artifact-type sbom/example ^
    ./sbom.json:application/json
```

#### Sign the SBOM

>[!IMPORTANT]
> Microsoft recommends using a secure crypto signing tool, like [Notation][Notation] to sign the image and generate a signature for signing SBOMs. 

Artifacts that are pushed as references, typically don't have tags as they're considered part of the `subject` artifact. To push a signature to an artifact that is a child of another artifact, use the `oras discover` with `--artifact-type` filtering to find the digest. This example uses a simple JSON signature for demonstration purposes.


```bash
SBOM_DIGEST=$(oras discover -o json \
                --artifact-type sbom/example \
                $IMAGE | jq -r ".manifests[0].digest")
```

Create a signature of an SBOM.

```bash
echo '{"artifact": "'$IMAGE@$SBOM_DIGEST'", "signature": "jayden hancock"}' > sbom-signature.json
```

#### Attach the SBOM signature

```bash
oras attach $IMAGE@$SBOM_DIGEST \
  --artifact-type 'signature/example' \
  ./sbom-signature.json:application/json
```

#### View the graph

```bash
oras discover -o tree $IMAGE
```

Generates the following output:

```output
myregistry.azurecr.io/net-monitor:v1
├── sbom/example
│   └── sha256:4f1843833c029ecf0524bc214a0df9a5787409fd27bed2160d83f8cc39fedef5
│       └── signature/example
│           └── sha256:3c43b8cb0c941ec165c9f33f197d7f75980a292400d340f1a51c6b325764aa93
├── readme/example
│   └── sha256:5fafd40589e2c980e2864a78818bff51ee641119cf96ebb0d5be83f42aa215af
└── signature/example
    └── sha256:00da2c1c3ceea087b16e70c3f4e80dbce6f5b7625d6c8308ad095f7d3f6107b5
```

### Promoting the Artifact Graph

A typical DevOps workflow promotes artifacts from dev through staging, to the production environment. Secure supply chain workflows promote public content to privately secured environments.
In either case you want to promote the signatures, SBOMs, scan results, and other related artifact with the subject artifact to have a complete graph of dependencies.

Using the [`oras copy`][oras-cli] command, you can promote a filtered graph of artifacts across registries.

Copy the `net-monitor:v1` image, and related artifacts to `sample-staging/net-monitor:v1`:

```bash
TARGET_REPO=$REGISTRY/sample-staging/$REPO
oras copy -r $IMAGE $TARGET_REPO:$TAG
```

The output of `oras copy`:

```console
Copying 6bdea3cdc730 sbom-signature.json
Copying 78e159e81c6b sbom.json
Copied  6bdea3cdc730 sbom-signature.json
Copied  78e159e81c6b sbom.json
Copying 7cf1385c7f4d signature.json
Copied  7cf1385c7f4d signature.json
Copying 3e797ecd0697 details
Copying 2fdeac43552b readme.md
Copied  3e797ecd0697 details
Copied  2fdeac43552b readme.md
Copied demo42.myregistry.io/net-monitor:v1 => myregistry.azurecr.io/sample-staging/net-monitor:v1
Digest: sha256:ff858b2ea3cdf4373cba65d2ca6bcede4da1d620503a547cab5916614080c763
```

### Discover the promoted artifact graph

```bash
oras discover -o tree $TARGET_REPO:$TAG
```

Output of `oras discover`:

```console
myregistry.azurecr.io/sample-staging/net-monitor:v1
├── sbom/example
│   └── sha256:4f1843833c029ecf0524bc214a0df9a5787409fd27bed2160d83f8cc39fedef5
│       └── signature/example
│           └── sha256:3c43b8cb0c941ec165c9f33f197d7f75980a292400d340f1a51c6b325764aa93
├── readme/example
│   └── sha256:5fafd40589e2c980e2864a78818bff51ee641119cf96ebb0d5be83f42aa215af
└── signature/example
    └── sha256:00da2c1c3ceea087b16e70c3f4e80dbce6f5b7625d6c8308ad095f7d3f6107b5
```

### Pulling Referenced Artifacts

To pull a specific referenced artifact, the digest of reference is discovered with the `oras discover` command:

```bash
DOC_DIGEST=$(oras discover -o json \
              --artifact-type 'readme/example' \
              $TARGET_REPO:$TAG | jq -r ".manifests[0].digest")
```

#### Create a clean directory for downloading

```bash
mkdir ./download
```

#### Pull the docs into the download directory

```bash
oras pull -o ./download $TARGET_REPO@$DOC_DIGEST
```

#### View the docs

```bash
tree ./download
```

The output of `tree`:

```output
./download
├── details
│   ├── readme-details.md
│   └── readme-more-details.md
└── readme.md
```

### View the repository and tag listing

ORAS enables artifact graphs to be pushed, discovered, pulled, and copied without having to assign tags. It also enables a tag listing to focus on the artifacts users think about, as opposed to the signatures and SBOMs that are associated with the container images, helm charts, and other artifacts.

#### View a list of tags

```bash
oras repo tags $REGISTRY/$REPO
```

### Deleting all artifacts in the graph

Support for the OCI v1.1 Specification enables deleting the graph of artifacts associated with the subject artifact. Use the [`oras manifest delete`][oras-cli] command to delete the graph of artifacts (signature, SBOM, and the signature of the SBOM).

```azurecli
oras manifest delete -f $REGISTRY/$REPO:$TAG

oras manifest delete -f $REGISTRY/sample-staging/$REPO:$TAG
```

You can view the list of manifests to confirm the deletion of the subject artifact, and all related artifacts leaving a clean environment.

```azurecli
az acr manifest list-metadata \
  --name $REPO \
  --registry $ACR_NAME -o jsonc
```

Output: 
```output
2023-01-10 18:38:45.366387 Error: repository "net-monitor" is not found.
```

## Summary

In this article, you learned how to use Azure Container Registry to store, manage, and retrieve both OCI artifacts and supply chain artifacts. You used ORAS CLI to push and pull artifacts to/from an Azure Container Registry. You also discovered the manifest of the pushed artifacts and viewed the graph of artifacts attached to the container image.

## Next steps

* Learn about [Artifact References](https://oras.land/docs/concepts/reftypes), associating signatures, software bill of materials and other reference types.
* Learn more about [the ORAS Project](https://oras.land/), including how to configure a manifest for an artifact.
* Visit the [OCI Artifacts](https://github.com/opencontainers/artifacts) repo for reference information about new artifact types.


<!-- LINKS - external -->
[docker-install]:           https://www.docker.com/get-started/
[oci-image-manifest]:    https://github.com/opencontainers/image-spec/blob/main/manifest.md
[oci-artifact-referrers]:   https://github.com/opencontainers/distribution-spec/blob/main/spec.md#listing-referrers/
[oci-spec]:                 https://github.com/opencontainers/distribution-spec/blob/main/spec.md/
[oci-1_1-spec]:             https://github.com/opencontainers/distribution-spec/releases/tag/v1.1.0-rc1
[oras-docs]:                https://oras.land/
[oras-install-docs]:        https://oras.land/docs/installation
[oras-cli]:                 https://oras.land/docs/category/oras-commands/
[oras-push-multifiles]:     https://oras.land/docs/how_to_guides/pushing_and_pulling#pushing-artifacts-with-multiple-files


<!-- LINKS - internal -->
[acr-authentication]:       ./container-registry-authentication.md?tabs=azure-cli
[az-acr-create]:            ./container-registry-get-started-azure-cli.md
[az-acr-build]:             /cli/azure/acr#az_acr_build
[az-acr-manifest-metadata]: /cli/azure/acr/manifest/metadata#az_acr_manifest_list_metadata
[azure-cli-install]:        /cli/azure/install-azure-cli
[iana-mediatypes]:          https://www.rfc-editor.org/rfc/rfc6838
[acr-landing]:              https://aka.ms/acr
[Notation]:                  /azure/container-registry/container-registry-tutorial-sign-build-push


