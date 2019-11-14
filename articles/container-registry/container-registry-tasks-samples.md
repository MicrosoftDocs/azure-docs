---
title: Azure Container Registry Tasks samples
description: Sample Azure Container Registry Tasks (ACR Tasks) to build, run, and patch container images
services: container-registry
author: dlepow
manager: gwallace

ms.service: container-registry
ms.topic: article
ms.date: 11/14/2019
ms.author: danlep
---

# ACR Tasks samples

This article links to example `task.yaml` files and associated Dockerfiles for several [Azure Container Registry Tasks](container-registry-tasks-overview.md) (ACR Tasks) scenarios. 

For additional examples, see the [Azure samples][task-examples] repo.

## Scenarios

* **Build image** - [YAML](https://github.com/Azure-Samples/acr-tasks/blob/master/build-hello-world.yaml) [Dockerfile](https://github.com/Azure-Samples/acr-tasks/blob/master/hello-world.dockerfile)

* **Run container** - [YAML](https://github.com/Azure-Samples/acr-tasks/blob/master/bash-echo.yaml)

* **Build and push image** - [YAML](https://github.com/Azure-Samples/acr-tasks/blob/master/build-push-hello-world.yaml) [Dockerfile](https://github.com/Azure-Samples/acr-tasks/blob/master/hello-world.dockerfile)

* **Build and run image** - [YAML](https://github.com/Azure-Samples/acr-tasks/blob/master/build-run-hello-world.yaml) [Dockerfile](https://github.com/Azure-Samples/acr-tasks/blob/master/hello-world.dockerfile)

* **Build and push multiple images** -  [YAML](https://github.com/Azure-Samples/acr-tasks/blob/master/build-push-hello-world-multi.yaml) [Dockerfile](https://github.com/Azure-Samples/acr-tasks/blob/master/hello-world.dockerfile)

* **Build and test images in parallel** -  [YAML](https://github.com/Azure-Samples/acr-tasks/blob/master/when-parallel.yaml) [Dockerfile](https://github.com/Azure-Samples/acr-tasks/blob/master/hello-world.dockerfile)

* **Build and push images to multiple registries** - [YAML](https://github.com/Azure-Samples/acr-tasks/blob/master/multipleRegistries/testtask.yaml) [Dockerfile](https://github.com/Azure-Samples/acr-tasks/blob/master/multipleRegistries/hello-world.dockerfile)







## Next steps

You can find multi-step task reference and examples here:

* [Task reference](container-registry-tasks-reference-yaml.md) - Task step types, their properties, and usage.
* [Task examples][task-examples] - Example `task.yaml` files for several scenarios, simple to complex.
* [Cmd repo](https://github.com/AzureCR/cmd) - A collection of containers as commands for ACR tasks.

<!-- IMAGES -->

<!-- LINKS - External -->
[task-examples]: https://github.com/Azure-Samples/acr-tasks
