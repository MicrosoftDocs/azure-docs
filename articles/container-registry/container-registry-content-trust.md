---
title: Content trust in Azure Container Registry
description: Learn how to pushed signed images to your Azure container registry.
services: container-registry
author: mmacy
manager: jeconnoc

ms.service: container-registry
ms.topic: quickstart
ms.date: 08/04/2018
ms.author: marsma
---
# Content trust in Azure Container Registry

Important to any distributed system designed with security in mind is verifying both the *source* and the *integrity* of data entering the system. You need to be able to verify both the publisher (source) of the data, as well the ensure it's not been modified after it was published (integrity). Azure Container Registry supports both by implementing Docker's [content trust][docker-content-trust] model, and this article will get you started.

## Content trust

words here

## Push trusted images

To push trusted images and enable image signing, you need to grant yourself or a service principle the `AcrImageSigner`, role in addition to the `Owner` and `Contributor` roles.

### Azure portal

Navigate to your registry in the Azure portal, then select Access Control (IAM) > Add > > Select `AcrImageSigner` for the Role.

### Azure CLI

First, get the resource ID of your registry with [az acr show][az-acr-show]. You use this value when you assign the roles to the user or service principle.

```azurecli
az acr show --name myRegistry --query id --output tsv
```

Then you can assign the `AcrImageSigner` role to a user

```azurecli
az role assignment create --scope resource_id --role AcrImageSigner --assignee user@example.com
```

Or a service principle identified by its application ID:

```azurecli
az role assignment create --scope resource_id --role AcrImageSigner --assignee 00000000-0000-0000-0000-000000000000
```

To pull trusted images, the `Reader` role is sufficient for registry users. No additional roles like `AcrImageSigner` need to be granted.

You can use both the Docker and Notary clients to interact with trusted images in Azure Container Registry. Detailed documentation can be found at [Content trust in Docker](https://docs.docker.com/engine/security/trust/content_trust/).

## Next steps

The Docker documentation for content trust and

<!-- IMAGES> -->
[aci-app-browser]: ../container-instances/media/container-instances-quickstart/aci-app-browser.png


<!-- LINKS - external -->
[docker-content-trust]: https://docs.docker.com/engine/security/trust/content_trust
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - internal -->
[az-acr-create]: /cli/azure/acr#az_acr_create
[az-acr-login]: /cli/azure/acr#az_acr_login
[az-group-create]: /cli/azure/group#az_group_create
[az-group-delete]: /cli/azure/group#az_group_delete
[azure-cli]: /cli/azure/install-azure-cli
[az-container-show]: /cli/azure/container#az_container_show
[container-instances-tutorial-prepare-app]: ../container-instances/container-instances-tutorial-prepare-app.md
[container-registry-skus]: container-registry-skus.md
[container-registry-auth-aci]: container-registry-auth-aci.md