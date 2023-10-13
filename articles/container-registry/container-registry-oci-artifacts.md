---
title: Push and pull OCI artifact references
description: Push and pull Open Container Initiative (OCI) artifacts using a container registry in Azure
author: tejaswikolli-web
manager: gwallace
ms.topic: article
ms.date: 01/03/2023
ms.author: tejaswikolli
---

# Push and pull OCI artifacts using an Azure container registry

You can use an [Azure container registry][acr-landing] to store and manage [Open Container Initiative (OCI) artifacts](container-registry-image-formats.md#oci-artifacts) as well as Docker and OCI container images.

To demonstrate this capability, this article shows how to use the [OCI Registry as Storage (ORAS)][oras-cli] CLI to push a sample artifact -  a text file - to an Azure container registry. Then, pull the artifact from the registry. You can manage various OCI artifacts in an Azure container registry using different command-line tools appropriate to each artifact.

## Prerequisites

* **Azure container registry** - Create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or [az acr create][az-acr-create].
* **Azure CLI** - Version `2.29.1` or later is required. See [Install Azure CLI][azure-cli-install] for installation and/or upgrade.
* **ORAS CLI** - Version `v0.16.0` is required. See: [ORAS installation][oras-install-docs].
* **Docker (Optional)** - While Docker Desktop isn't required, the `oras` CLI utilizes the Docker desktop credential store for storing credentials. If Docker Desktop is installed, it must be running for `oras login`.

## Configure a registry

Configure environment variables to easily copy/paste commands into your shell. The commands can be run locally or in the [Azure Cloud Shell](https://shell.azure.com/).

```bash
ACR_NAME=myregistry
REGISTRY=$ACR_NAME.azurecr.io
```

## Sign in to a registry

Authenticate with your [individual Microsoft Entra identity](container-registry-authentication.md?tabs=azure-cli#individual-login-with-azure-ad) using an AD token. Always use "000..." for the `USER_NAME` as the token is parsed through the `PASSWORD` variable.

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

## Push a root artifact

A root artifact is an artifact that has no `subject` parent. Root artifacts can be anything from a container image, a helm chart, a readme file for the repository. Reference artifacts, described in [Attach, push, and pull supply chain artifacts](container-registry-oras-artifacts.md) are artifacts that refer to another artifact. Reference artifacts can be anything from a signature, software bill of materials, scan report or other evolving types.

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
Digest: sha256:e2d60d1b171f08bd10e2ed171d56092e39c7bac1aec5d9dcf7748dd702682d53
```

## Push a multi-file root artifact

When OCI artifacts are pushed to a registry with ORAS, each file reference is pushed as a blob. To push separate blobs, reference the files individually, or collection of files by referencing a directory.  
For more information how to push a collection of files, see [Pushing artifacts with multiple files][oras-push-multifiles]

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

## Discover the manifest

To view the manifest created as a result of `oras push`, use `oras manifest fetch`:

```bash
oras manifest fetch --pretty $REGISTRY/samples/artifact:readme
```

The output will be similar to:

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

## Pull a root artifact

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
tree ./download
```

## Remove the artifact (optional)

To remove the artifact from your registry, use the `oras manifest delete` command.

```bash
 oras manifest delete $REGISTRY/samples/artifact:readme
```

## Next steps

* Learn about [Artifact References](container-registry-oras-artifacts.md), associating signatures, software bill of materials and other reference types
* Learn more about [the ORAS Project](https://oras.land/), including how to configure a manifest for an artifact
* Visit the [OCI Artifacts](https://github.com/opencontainers/artifacts) repo for reference information about new artifact types

<!-- LINKS - external -->
[iana-mediatypes]:          https://www.rfc-editor.org/rfc/rfc6838
[oras-install-docs]:        https://oras.land/docs/installation
[oras-cli]:                 https://oras.land/blog/oras-0.15-a-fully-functional-registry-client/
[oras-push-multifiles]:     https://oras.land/docs/how_to_guides/pushing_and_pulling/#pushing-artifacts-with-multiple-files

<!-- LINKS - internal -->
[acr-landing]:              https://aka.ms/acr
[acr-authentication]:       ./container-registry-authentication.md?tabs=azure-cli
[az-acr-create]:            ./container-registry-get-started-azure-cli.md
[az-acr-repository-delete]: /cli/azure/acr/repository#az_acr_repository_delete
[azure-cli-install]:        /cli/azure/install-azure-cli
