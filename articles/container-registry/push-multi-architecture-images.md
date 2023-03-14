---
title: Multi-architecture images in your registry
description: Use your Azure container registry to build, import, store, and deploy multi-architecture (multi-arch) images
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
ms.custom: 
---

# Multi-architecture images in your Azure container registry

This article introduces *multi-architecture* (*multi-arch*) images and how you can use Azure Container Registry features to help create, store, and use them. 

A multi-arch image is a type of container image that may combine variants for different architectures, and sometimes for different operating systems. When running an image with multi-architecture support, container clients will automatically select an image variant that matches your OS and architecture.

## Manifests and manifest lists

Multi-arch images are based on image manifests and manifest lists.

### Manifest

Each container image is represented by a [manifest](container-registry-concepts.md#manifest). A manifest is a JSON file that uniquely identifies the image, referencing its layers and their corresponding sizes. 

A basic manifest for a Linux `hello-world` image looks similar to the following:

  ```json
  {
    "schemaVersion": 2,
    "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
    "config": {
        "mediaType": "application/vnd.docker.container.image.v1+json",
        "size": 1510,
        "digest": "sha256:fbf289e99eb9bca977dae136fbe2a82b6b7d4c372474c9235adc1741675f587e"
      },
    "layers": [
        {
          "mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
          "size": 977,
          "digest": "sha256:2c930d010525941c1d56ec53b97bd057a67ae1865eebf042686d2a2d18271ced"
        }
      ]
  }
  ```
    
You can view a manifest in Azure Container Registry using the Azure portal or tools such as the [az acr manifest list-metadata](/cli/azure/acr/manifest#az-acr-manifest-list-metadata) command in the Azure CLI.

### Manifest list

A *manifest list* for a multi-arch image (known more generally as an [image index](https://github.com/opencontainers/image-spec/blob/master/image-index.md) for OCI images) is a collection (index) of images, and you create one by specifying one or more image names. It includes details about each of the images such as the supported OS and architecture, size, and manifest digest. The manifest list can be used in the same way as an image name in `docker pull` and `docker run` commands. 

The `docker` CLI manages manifests and manifest lists using the [docker manifest](https://docs.docker.com/engine/reference/commandline/manifest/) command.

> [!NOTE]
> Currently, the `docker manifest` command and subcommands are experimental. See the Docker documentation for details about using experimental commands.

You can view a manifest list using the `docker manifest inspect` command. The following is the output for the multi-arch image `mcr.microsoft.com/mcr/hello-world:latest`, which has three manifests: two for Linux OS architectures and one for a Windows architecture.
```json
{
  "schemaVersion": 2,
  "mediaType": "application/vnd.docker.distribution.manifest.list.v2+json",
  "manifests": [
    {
      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
      "size": 524,
      "digest": "sha256:83c7f9c92844bbbb5d0a101b22f7c2a7949e40f8ea90c8b3bc396879d95e899a",
      "platform": {
        "architecture": "amd64",
        "os": "linux"
      }
    },
    {
      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
      "size": 525,
      "digest": "sha256:873612c5503f3f1674f315c67089dee577d8cc6afc18565e0b4183ae355fb343",
      "platform": {
        "architecture": "arm64",
        "os": "linux"
      }
    },
    {
      "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
      "size": 1124,
      "digest": "sha256:b791ad98d505abb8c9618868fc43c74aa94d08f1d7afe37d19647c0030905cae",
      "platform": {
        "architecture": "amd64",
        "os": "windows",
        "os.version": "10.0.17763.1697"
      }
    }
  ]
}
```

When a multi-arch manifest list is stored in Azure Container Registry, you can also view the manifest list using the Azure portal or with tools such as the [az acr manifest list-metadata](/cli/azure/acr/manifest#az-acr-manifest-list-metadata) command.

## Import a multi-arch image 

An existing multi-arch image can be imported to an Azure container registry using the [az acr import](/cli/azure/acr#az-acr-import) command. The image import syntax is the same as with a single-architecture image. Like import of a single-architecture image, import of a multi-arch image doesn't use Docker commands. 

For details, see [Import container images to a container registry](container-registry-import-images.md).

## Push a multi-arch image

When you have build workflows to create container images for different architectures, follow these steps to push a multi-arch image to your Azure container registry.

1. Tag and push each architecture-specific image to your container registry. The following example assumes two Linux architectures: arm64 and amd64. 

   ```console
   docker tag myimage:arm64 \
     myregistry.azurecr.io/multi-arch-samples/myimage:arm64

   docker push myregistry.azurecr.io/multi-arch-samples/myimage:arm64
 
   docker tag myimage:amd64 \
     myregistry.azurecr.io/multi-arch-samples/myimage:amd64

   docker push myregistry.azurecr.io/multi-arch-samples/myimage:amd64
   ``` 

1. Run `docker manifest create` to create a manifest list to combine the preceding images into a multi-arch image.

   ```console
   docker manifest create myregistry.azurecr.io/multi-arch-samples/myimage:multi \
    myregistry.azurecr.io/multi-arch-samples/myimage:arm64 \
    myregistry.azurecr.io/multi-arch-samples/myimage:amd64
   ```

1. Push the manifest to your container registry using `docker manifest push`:

   ```console
   docker manifest push myregistry.azurecr.io/multi-arch-samples/myimage:multi
   ```

1. Use the `docker manifest inspect` command to view the manifest list. An example of command output is shown in a preceding section.

After you push the multi-arch manifest to your registry, work with the multi-arch image the same way that you do with a single-architecture image. For example, pull the image using `docker pull`, and use [az acr repository](/cli/azure/acr/repository#az-acr-repository) commands to view tags, manifests, and other properties of the image.

## Build and push a multi-arch image

Using features of [ACR Tasks](container-registry-tasks-overview.md), you can build and push a multi-arch image to your Azure container registry. For example, define a [multi-step task](container-registry-tasks-multi-step.md) in a YAML file that builds a Linux multi-arch image.

The following example assumes that you have separate Dockerfiles for two architectures, arm64 and amd64. It builds and pushes the architecture-specific images, then creates and pushes a multi-arch manifest that has the `latest` tag:

```yml
version: v1.1.0

steps:
- build: -t {{.Run.Registry}}/multi-arch-samples/myimage:{{.Run.ID}}-amd64 -f dockerfile.arm64 . 
- build: -t {{.Run.Registry}}/multi-arch-samples/myyimage:{{.Run.ID}}-arm64 -f dockerfile.amd64 . 
- push: 
    - {{.Run.Registry}}/multi-arch-samples/myimage:{{.Run.ID}}-arm64
    - {{.Run.Registry}}/multi-arch-samples/myimage:{{.Run.ID}}-amd64
- cmd: >
    docker manifest create
    {{.Run.Registry}}/multi-arch-samples/myimage:latest
    {{.Run.Registry}}/multi-arch-samples/myimage:{{.Run.ID}}-arm64
    {{.Run.Registry}}/multi-arch-samples/myimage:{{.Run.ID}}-amd64
- cmd: docker manifest push --purge {{.Run.Registry}}/multi-arch-samples/myimage:latest
- cmd: docker manifest inspect {{.Run.Registry}}/multi-arch-samples/myimage:latest
```

## Next steps

* Use [Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines) to build container images for different architectures.
* Learn about building multi-platform images using the experimental Docker [buildx](https://docs.docker.com/buildx/working-with-buildx/) plug-in.

<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-windows]: https://docs.docker.com/docker-for-windows/
