---
title: Import container images to an Azure container registry 
description: Import container images to an Azure container registry by using Azure APIs, without needing to run Docker commands.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 02/01/2019
ms.author: danlep
---

# Import container images to a container registry 

[Intro here]

Users typically want to be able to push a base image to an Azure container registry without using Docker on the client. ACR enables users to use the import container image API which handles a number of common scenarios, including importing images from public registries, non-Azure private registries, and Azure container registries in other Azure subscriptions.

ACR Import has the following benefits. 
1. Because the client doesn’t need a local Docker installation, you can import images irrespective of the platform. 

2. Multiarchitecture images will have all underlying images copied over. When using Docker CLI, you can pull only the image of the matching platform. But when importing an image, ACR imports images for all architectures and platforms specified in the manifest list.  

To import container images, this article requires that you run the Azure CLI in Azure Cloud Shell or locally (version 2.0.55 or later recommended). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

## Create a container registry

If you don't already have an Azure container registry, create a registry and push a sample container image to it. For steps, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli.md).


## Scenarios

1.	Importing images from another ACR using integrated AAD permissions
a.	This case the user has permission to read from the source registry and write permissions to the target registry.
 
2.	Import images from public registries. 
a.	You can import from DockerHub – 
i.	az acr import  --source docker.io/library/hello-world:latest   -t  hello-world:latest
NOTE: To pull an official image like ‘hello-world:latest’ , it should be qualified with ‘docker.io/library’
 
b.	You can import an image from the Microsoft container registry  - 
i.	az acr import  --source mcr.microsoft.com/windows/servercore:latest  -t servercore:latest
 
3.	Importing images from a private repository
a.	You can import an image from a private registry by specifying credentials that have pull access to the registry. 
i.	az acr import  --source docker.io/myrepo/image:tag    -t  image:tag -u {username} –p {password}
NOTE: This can be used to import images from an Another ACR user a service principal that has ACRPull access to the registry where the image is being imported from.  @Nathan – needs to validate the last one and if it doesn’t work we will roll out a fix on this once he is back from vacation.

## Next steps

In this article, you learned about,,,

* Learn more about ....


<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-pull]: https://docs.docker.com/engine/reference/commandline/pull/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - Internal -->
[az-login]: /cli/azure/reference-index#az-login
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-show]: /cli/azure/acr#az-acr-show
[az-vm-create]: /cli/azure/vm#az-vm-create
[az-vm-show]: /cli/azure/vm#az-vm-show
[az-vm-identity-assign]: /cli/azure/vm/identity#az-vm-identity-assign
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-identity-show]: /cli/azure/identity#az-identity-show
[azure-cli]: /cli/azure/install-azure-cli