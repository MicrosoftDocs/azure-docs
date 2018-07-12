---
title: Delete image resources in Azure Container Registry
description: Details on how to effectively managed registry size by deleting container image data.
services: container-registry
author: mmacy
manager: jeconnoc

ms.service: container-registry
ms.topic: article
ms.date: 07/14/2018
ms.author: marsma
---

# Delete container images in Azure Container Registry

Periodic deletion of stale or unused container image data should be included as part of your regular container registry maintenance routine. Because you can initiate deletion on several different resource types (like repositories, images, and manifest digests), it's important to understand how each delete operation affects the space usage of your registry. This article starts by introducing the components of a Docker registry and its images, explains how to delete those components, and how deleting each affects the size of your registry.

## Components of a registry

Because Docker container images share layer data and include several components by which delete operations can be made, managing registry size requires some knowledge of registry layout and how container images are constructed.

### Registry

A container registry is a service that stores and distributes container images. For example, Docker Hub is a public Docker container registry, while Azure Container Registry provides private Docker container registries in Azure.

### Repository

Within each registry are image *repositories*, collections of container images with the same name, but different tags. The name of an image is defined by the repository name, followed by a tag:

`repository:tag`

For example, these three images reside within the "acr-helloworld" repository, each with a different tag:

```
acr-helloworld:latest
acr-helloworld:v1
acr-helloworld:v2
```

## Components of an image

A container image consists of several components like tags, layers, and manifests. Understanding how these components relate to each another can help you determine what to delete, and in which situations.

### Tag

An image's *tag* typically specifies its version. A single image within a repository can be assigned one or multiple tags, and can also be "untagged." That is, you can delete all tags for an image, while still leaving the image data (its layers) within the registry.

You can push and pull an image by specifying its name in `repository:tag` format in the push or pull operation.

### Layer

Images are made up of one or more *layers*, each of which corresponds to a line in the Dockerfile that defines the image. Images within a repository can share layers, reducing the storage used by images that share layers. Network traffic is also minimized, since layers already existing in the local filesystem do not need to be pulled again; only new or modified layers are pulled from the registry.

### Manifest

Each container image includes an image *manifest* that provides the identification for the image, and specifies the layers that make up the image. Here is an example manifest (this is not a real manifest, the "layers" section has been truncated for brevity):

```json
{
	"schemaVersion": 2,
	"mediaType": "application/vnd.docker.distribution.manifest.v2+json",
	"config": {
		"mediaType": "application/vnd.docker.container.image.v1+json",
		"size": 6223,
		"digest": "sha256:f5268c82970b670d0e5a86292f2a5200e6901bc7b0a7985db92adb3f4ec845d7"
	},
	"layers": [
		{
			"mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
			"size": 1990402,
			"digest": "sha256:6d987f6f42797d81a318c40d442369ba3dc124883a0964d40b0c8f4f7561d913"
		},
		{
			"mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
			"size": 19186477,
			"digest": "sha256:a1b9769c94cda6dcaa17805171e8f4e92a5a4eaa7f8a1f8c66a241aa2c5b9936"
		},
		{
			"mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
			"size": 1240786,
			"digest": "sha256:339284aa29477891009cfa16588ac229c80b1f0ef578c529727c9066aaa280cc"
		}
	]
}
```

### Manifest digest

Manifests are identified by a unique SHA-256 hash, or *digest* (the `"digest"` value in the `"config"` section of the preceding example manifest). A unique digest is included in each container image you build. The digest value is unique even if the image's layer data is identical to that of another image. This is what allows you repeatedly push identically tagged images to a registry. For example, you can repeatedly push `myimage:latest` to your registry without error (though not recommended) because each image is identified by its unique digest.

You can pull an image from a registry by specifying its digest in the pull operation. Some systems may be configured to pull by digest because it guarantees the image version being pulled, even if an identically tagged image is subsequently pushed to the registry.

For example, pulling an image from the "acr-helloworld" repository by manifest digest:

```console
$ docker pull myregistry.azurecr.io/acr-helloworld@sha256:0a2e01852872580b2c2fea9380ff8d7b637d3928783c55beb3f21a6e58d5d108
```

> [!IMPORTANT]
> If you repeatedly push identically tagged images, you can create orphaned images--images that are untagged, but still consume space in your registry. Untagged images are not shown in the Azure CLI or in the Azure portal when you list or view images by tag. However, their layers still exist and consume space in your registry. For information about deleting orphaned image data, see [Delete by manifest digest](#delete-by-manifest-digest).

## Delete image data

You can delete image data from your container registry in several ways: delete a repository, delete by image name (`repository:tag`), or delete by manifest digest.

## Delete repository

Deleting a repository deletes all of the images in the repository, including all tags, layers, and manifests. When you delete a repository, you recover the storage space used by the images that were in that repository.

The following Azure CLI command deletes the "acr-helloworld" repository and all tags and manifests within the repository. If layers referenced by the deleted manifests are not referenced by any other images in the registry, their layer data is also deleted.

```azurecli
 az acr repository delete --name myregistry --repository acr-helloworld
```

## Delete by tag

You can delete individual images from a repository by specifying the repository name and tag in the delete operation. When you delete by tag, you recover the storage space used by any unique layers in the image (layers not shared by any other images in the registry).

To delete by tag, use [az acr repository delete][az-acr-repository-delete] and specify the image name (`repository:tag`) in the `--image` parameter. All layers unique to the image and any tags associated with the image are deleted.

For example, deleting the "acr-helloworld:latest" image from registry "myregistry":

```azurecli
$ az acr repository delete --name myregistry --image acr-helloworld:latest
This operation will delete the manifest 'sha256:0a2e01852872580b2c2fea9380ff8d7b637d3928783c55beb3f21a6e58d5d108' and all the following images: 'acr-helloworld:latest', 'acr-helloworld:v3'.
Are you sure you want to continue? (y/n): y
```

> [!TIP]
> Deleting *by tag* shouldn't be confused with deleting a tag (untagging). You can delete a tag with the Azure CLI command [az acr repository untag][az-acr-repository-untag]. No space is freed when you untag an image because its [manifest](#manifest) and layer data remains in the registry--only the tag itself is deleted.

## Delete by manifest digest

A [manifest digest](#manifest-digest) can be associated with one, none, or multiple tags. When you delete by digest, all tags referenced by the manifest are deleted, as is layer data for any layers unique to the image. Shared layer data is not deleted.

To delete by digest, first list the manifest digests for the repository containing the images you wish to delete:

```azurecli
az acr repository show-manifests --name myregistry --repository myrepository
```

For example, listing the manifest digests for the "acr-helloworld" repository:

```console
$ az acr repository show-manifests --name myregistry --repository acr-helloworld
[
  {
    "digest": "sha256:0a2e01852872580b2c2fea9380ff8d7b637d3928783c55beb3f21a6e58d5d108",
    "tags": [
      "latest",
      "v3"
    ],
    "timestamp": "2018-07-12T15:52:00.2075864Z"
  },
  {
    "digest": "sha256:3168a21b98836dda7eb7a846b3d735286e09a32b0aa2401773da518e7eba3b57",
    "tags": [
      "v2"
    ],
    "timestamp": "2018-07-12T15:50:53.5372468Z"
  },
  {
    "digest": "sha256:7ca0e0ae50c95155dbb0e380f37d7471e98d2232ed9e31eece9f9fb9078f2728",
    "tags": [
      "v1"
    ],
    "timestamp": "2018-07-11T21:38:35.9170967Z"
  }
]
```

Next, specify the digest you wish to delete in the [az acr repository delete][az-acr-repository-delete] command. The format of the command is:

```azurecli
az acr repository delete --name myregistry --image repository@digest
```

For example, to delete the last manifest listed in the preceding output (with the tag "v1"):

```console
$ az acr repository delete --name myregistry --image acr-helloworld@sha256:7ca0e0ae50c95155dbb0e380f37d7471e98d2232ed9e31eece9f9fb9078f2728
This operation will delete the manifest 'sha256:7ca0e0ae50c95155dbb0e380f37d7471e98d2232ed9e31eece9f9fb9078f2728' and all the following images: 'acr-helloworld:v1'.
Are you sure you want to continue? (y/n): y
```

The "acr-helloworld:v1" image is deleted from the registry, as is any layer data unique to that image. If a manifest is associated with multiple tags, all associated tags are also deleted.

## Delete untagged images

As mentioned in the [Manifest digest](#manifest-digest) section, pushing a modified image using an existing tag **untags** the previously pushed image, resulting in an orphaned (or "dangling") image. The previously pushed image's manifest--and its layer data--remains in the registry. Consider the following sequence of events:

1. Push image *acr-helloworld* with tag **latest**: `docker push myregistry.azurecr.io/acr-helloworld:latest`
1. Check manifests for repository *acr-helloworld*:

   ```console
   $ az acr repository show-manifests --name myregistry --repository acr-helloworld
   [
     {
       "digest": "sha256:d2bdc0c22d78cde155f53b4092111d7e13fe28ebf87a945f94b19c248000ceec",
       "tags": [
         "latest"
       ],
       "timestamp": "2018-07-11T21:32:21.1400513Z"
     }
   ]
   ```

1. Modify *acr-helloworld* Dockerfile
1. Push image *acr-helloworld* with tag **latest**: `docker push myregistry.azurecr.io/acr-helloworld:latest`
1. Check manifests for repository *acr-helloworld*:

   ```console
   $ az acr repository show-manifests --name myregistry --repository acr-helloworld
   [
     {
       "digest": "sha256:7ca0e0ae50c95155dbb0e380f37d7471e98d2232ed9e31eece9f9fb9078f2728",
       "tags": [
         "latest"
       ],
       "timestamp": "2018-07-11T21:38:35.9170967Z"
     },
     {
       "digest": "sha256:d2bdc0c22d78cde155f53b4092111d7e13fe28ebf87a945f94b19c248000ceec",
       "tags": null,
       "timestamp": "2018-07-11T21:32:21.1400513Z"
     }
   ]
   ```

As you can see in the output of the last step in the sequence, there is now an orphaned manifest whose `"tags"` property is `null`. This manifest still exists within the registry, along with any unique layer data that it references. **To delete such orphaned images and their layer data, you must delete by manifest digest**.

### List untagged images

You can list all untagged images in your repository using the following Azure CLI command. Replace the `<acrName>` and `<repositoryName>` values with those appropriate for your environment.

```azurecli
az acr repository show-manifests --name <acrName> --repository <repositoryName>  --query "[?tags==null].digest"
```

### Delete all untagged images

Use the following sample scripts with caution--deleted image data is UNRECOVERABLE.

**Azure CLI in Bash**

The following Bash script deletes all untagged images from a repository. It requires the Azure CLI, **awk**, and **xargs**. By default, the script performs no deletion. Change the `ENABLE_DELETE` value to `true` to enable image deletion.

> [!WARNING]
> If you have systems that pull images by manifest digest (as opposed to `repository:tag`), you should not run this script. Deleting untagged images will prevent those systems from pulling the images from your registry.

```bash
#!/bin/bash

# WARNING! This script deletes data!
# Run only if you do not have systems
# that pull images via manifest digest.

# Change to 'true' to enable image delete
ENABLE_DELETE=false

# Modify for your environment
REGISTRY=myregistry
REPOSITORY=myrepository

# Delete all untagged (orphaned) images
if [ "$ENABLE_DELETE" = true ]
then
    az acr repository show-manifests \
        --name $REGISTRY \
        --repository $REPOSITORY \
        --query '[].[digest,tags]' -o table \
    | awk '{FS=" "} !length($2)' \
    | xargs -I {} az acr repository delete --name $REGISTRY --image $REPOSITORY@{} --yes
else
    echo "No data deleted. Set ENABLE_DELETE=true to enable image deletion."
fi
```

**Azure CLI in PowerShell**

The following PowerShell script deletes all untagged images from a repository. It requires the PowerShell and the Azure CLI. By default, the script performs no deletion. Change the `$enableDelete` value to `true` to enable image deletion.

> [!WARNING]
> If you have systems that pull images by manifest digest (as opposed to `repository:tag`), you should not run this script. Deleting untagged images will prevent those systems from pulling the images from your registry.

```powershell
# WARNING! This script deletes data!
# Run only if you do not have systems
# that pull images via manifest digest.

# Change to 'true' to enable image delete
$enableDelete = false

# Modify for your environment
$registry = "myregistry"
$repository = "myrepository"

Foreach($x in (az acr repository show-manifests -n $registry --repository $repository | ConvertFrom-Json)) { if ((!$x.tags) -and ($enableDelete)) { az acr repository delete -n $registry --image "$repository@$($x.digest)" -y }}
```

## Next steps

For more information about how images are stored in Azure Container Registry see [Container image storage in Azure Container Registry](container-registry-storage.md).

<!-- IMAGES -->

<!-- LINKS - External -->
[portal]: https://portal.azure.com

<!-- LINKS - Internal -->
[az-acr-repository-untag]: /cli/azure/acr/repository#az-acr-repository-untag
[az-acr-repository-delete]: /cli/azure/acr/repository#az-acr-repository-delete