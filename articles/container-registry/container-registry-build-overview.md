---
title: Automatic container builds and patching with Azure Container Registry Build (ACR Build)
description: An introduction ACR Build, a suite of features in Azure Container Registry that provides secure, automated container image build and patching in the cloud.
services: container-registry
author: mmacy
manager: jeconnoc

ms.service: container-registry
ms.topic: article
ms.date: 04/27/2018
ms.author: marsma
---

# Automate building and patching container images with ACR Build

<!--
* TITLE: auto build, patch, run containers with acr build
* TITLE: securely build and maintain container images ...
* never patch again
* ACR supports OS and framework patching through ACR BUild
* lead in is patching
* lead with the nugget
* maintenance - the Big Deal
-->

As containers provide new levels of virtualization, isolating application and developer dependencies from the infrastructure and operational requirements, we must address how the application virtualization is patched.

## What is ACR Build?

Azure Container Registry Build is an Azure-native container build service. As a feature of Azure Container Registry, ACR Build enables inner-loop development in the cloud with the [Quick Build](container-registry-tutorial-quick-build.md), as well as automated container image building.

ACR Build supports triggering container image builds automatically when code is committed to a Git repository, and when a container's base image is updated. With base image update triggers, you can automate your OS and application framework patching workflow, maintaining secure environments, while adhering to the principals of immutable containers.

## Quick Build: inner-loop extended to the cloud

The beginning of lifecycle management starts before developers check-in their first lines of code. ACR Build enables an integrated local, inner-loop development experience, offloading builds to Azure. Developers can verify their automated build definitions, prior to checking in their code. Using the familiar docker build format, `az acr build` will take a local context, send it to the acr build service, optionally pushing to its registry upon completion. ACR Build will follow your geo-replicated registries, enabling dispersed development teams to leverage the closest replicated datacenter. For preview, ACR build service will support East US and West Europe.

ACR Build was designed as a container lifecycle primitive, that will extend and/or integrate into your CI/CD solution.
Using `az login` with [a service principal
](https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli?view=azure-cli-latest#log-in-with-a-service-principal), your CI/CD solution may call `az acr build [...]` commands.

## Automated build: source code commit

Feature description.

## Automated build: base image update

ACR Build dynamically discovers base image dependencies. During preview, base images are limited to the same registry.

## Next steps

When you're ready to start building your container images in the cloud, check out part one of the three-part ACR Build tutorial series.

> [!div class="nextstepaction"]
> [Build container images in the cloud with Azure Container Registry Build](container-registry-tutorial-quick-build.md)

<!-- LINKS - External -->
[sample-archive]: https://github.com/Azure-Samples/acr-build-helloworld-node/archive/master.zip
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-build]: /cli/azure/acr#az-acr-build
[az-ad-sp-create-for-rbac]: /cli/azure/ad/sp#az-ad-sp-create-for-rbac
[az-container-attach]: /cli/azure/container#az-container-attach
[az-container-create]: /cli/azure/container#az-container-create
[az-container-delete]: /cli/azure/container#az-container-delete
[az-keyvault-create]: /cli/azure/keyvault/secret#az-keyvault-create
[az-keyvault-secret-set]: /cli/azure/keyvault/secret#az-keyvault-secret-set
[service-principal-auth]: container-registry-auth-service-principal.md

<!-- IMAGES -->
[quick-build-01-fork]: ./media/container-registry-tutorial-quick-build/quick-build-01-fork.png
[quick-build-02-browser]: ./media/container-registry-tutorial-quick-build/quick-build-02-browser.png
