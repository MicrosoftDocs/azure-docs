---
title: Automate OS and framework patching with Azure Container Registry Build (ACR Build)
description: An introduction to ACR Build, a suite of features in Azure Container Registry that provides secure, automated container image build and patching in the cloud.
services: container-registry
author: mmacy
manager: jeconnoc

ms.service: container-registry
ms.topic: article
ms.date: 05/02/2018
ms.author: marsma
---

# Automate OS and framework patching with ACR Build

Containers provide new levels of virtualization, isolating application and developer dependencies from infrastructure and operational requirements. What remains, however, is the need to address how this application virtualization is patched. **ACR Build**, a suite of features within Azure Container Registry, provides not only native container image build capability, but also automates OS and framework patching of your application images.

## What is ACR Build?

Azure Container Registry Build is an Azure-native container image build service. As a feature of Azure Container Registry, ACR Build enables inner-loop development in the cloud with both on-demand and automated container image building.

ACR Build supports triggering container image builds automatically when code is committed to a Git repository, and when a container's base image is updated. With base image update triggers, you can automate your OS and application framework patching workflow, maintaining secure environments while adhering to the principals of immutable containers.

## Quick Build: inner-loop extended to the cloud

The beginning of lifecycle management starts before developers check-in their first lines of code. ACR Build's [Quick Build](container-registry-tutorial-quick-build.md) feature enables an integrated local inner-loop development experience, offloading builds to Azure. With Quick Builds, you can verify your automated build definitions prior to checking in your code.

Using the familiar docker build format, the `az acr build` command in the Azure CLI takes a local context, sends it to the ACR Build service and, by default, pushes the built image to its registry upon completion. ACR Build will follow your geo-replicated registries, enabling dispersed development teams to leverage the closest replicated registry. During preview, ACR build is available in the East US and West Europe regions.

ACR Build is designed as a container lifecycle primitive. For example, use it to extend and integrate into your CI/CD solution. By executing `az login` with [a service principal
](https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli?view=azure-cli-latest#log-in-with-a-service-principal), your CI/CD solution can then issue `az acr build` commands to initiate image builds.

## Automated build: source code commit

Feature description.

## Automated build: base image update

ACR Build dynamically discovers base image dependencies when it builds a container image.

While ACR Build is in preview, automated container image build on base image update is limited to images residing the same registry.

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
