---
title: Understand access to a connected registry
description: Introduction to token-based authentication and authorization for connected registries in Azure Container Registry
author: toddysm
ms.author: memladen
ms.service: container-registry
ms.topic: overview
ms.date: 10/11/2022
ms.custom: ignite-fall-2021
---

# Understand access to a connected registry

To access and manage a [connected registry](intro-connected-registry.md), currently only ACR [token-based authentication](container-registry-repository-scoped-permissions.md) is supported. As shown in the following image, two different types of tokens are used by each connected registry:

* [**Client tokens**](#client-tokens) - One or more tokens that on-premises clients use to authenticate with a connected registry and push or pull images and artifacts to or from it.
* [**Sync token**](#sync-token) - A token used by each connected registry to access its parent and synchronize content.

![Connected registry authentication verview](media/overview-connected-registry-access/connected-registry-authentication-overview.svg)

> [!IMPORTANT]
> Store token passwords for each connected registry in a safe location. After they are created, token passwords can't be retrieved. You can regenerate token passwords at any time.

## Client tokens

To manage client access to a connected registry, you create tokens scoped for actions on one or more repositories. After creating a token, configure the connected registry to accept the token by using the [az acr connected-registry update](/cli/azure/acr/connected-registry#az-acr-connected-registry-update) command. A client can then use the token credentials to access a connected registry endpoint - for example, to use Docker CLI commands to pull or push images to the connected registry.

Your options for configuring client token actions depend on whether the connected registry allows both push and pull operations or functions as a pull-only mirror. 
* A connected registry in the default [ReadWrite mode](intro-connected-registry.md#modes) allows both pull and push operations, so you can create a token that allows actions to both *read* and *write* repository content in that registry. 
* For a connected registry in [ReadOnly mode](intro-connected-registry.md#modes), client tokens can only allow actions to *read* repository content.

### Manage client tokens

Update client tokens, passwords, or scope maps as needed by using [az acr token](/cli/azure/acr#az-acr-token) and [az acr scope-map](/cli/azure/acr#az-acr-scope-map) commands. Client token updates are propagated automatically to the connected registries that accept the token.

## Sync token

Each connected registry uses a sync token to authenticate with its immediate parent - which could be another connected registry or the cloud registry. The connected registry automatically uses this token when synchronizing content with the parent or performing other updates. 

* The sync token and passwords are generated automatically when you create the connected registry resource. Run the [az acr connected-registry install renew-credentials][az-acr-connected-registry-install-renew-credentials] command to regenerate the passwords.
* Include sync token credentials in the configuration used to deploy the connected registry on-premises. 
* By default, the sync token is granted permission to synchronize selected repositories with its parent. You must provide an existing sync token or one or more repositories to sync when you create the connected registry resource.
* It also has permissions to read and write synchronization messages on a gateway used to communicate with the connected registry's parent. These messages control the synchronization schedule and manage other updates between the connected registry and its parent.

### Manage sync token

Update sync tokens, passwords, or scope maps as needed by using [az acr token](/cli/azure/acr#az-acr-token) and [az acr scope-map](/cli/azure/acr#az-acr-scope-map) commands. Sync token updates are propagated automatically to the connected registry. Follow the standard practices of rotating passwords when updating the sync token.

> [!NOTE]
> The sync token cannot be deleted until the connected registry associated with the token is deleted. You can disable a connected registry by setting the status of the sync token to `disabled`. 

## Registry endpoints

Token credentials for connected registries are scoped to access specific registry endpoints:

* A client token accesses the connected registry's endpoint. The connected registry endpoint is the login server URI, which is typically the IP address of the server or device that hosts it.

* A sync token accesses the endpoint of the parent registry, which is either another connected registry endpoint or the cloud registry itself. When scoped to access the cloud registry, the sync token needs to reach two registry endpoints:

    - The fully qualified login server name, for example, `contoso.azurecr.io`. This endpoint is used for authentication.
    - A fully qualified regional [data endpoint](container-registry-firewall-access-rules.md#enable-dedicated-data-endpoints) for the cloud registry, for example, `contoso.westus2.data.azurecr.io`. This endpoint is used to exchange messages with the connected registry for synchronization purposes. 

## Next steps

Continue to  the following article to learn about specific scenarios where connected registry can be utilized.

> [!div class="nextstepaction"]
> [Overview: Connected registry and IoT Edge][overview-connected-registry-and-iot-edge]

<!-- LINKS - internal -->
[az-acr-connected-registry-update]: /cli/azure/acr/connected-registry#az_acr_connected_registry_update
[az-acr-connected-registry-install-renew-credentials]: /cli/azure/acr/connected-registry/install#az_acr_connected_registry_install_renew_credentials
[overview-connected-registry-and-iot-edge]:overview-connected-registry-and-iot-edge.md
[repository-scoped-permissions]: container-registry-repository-scoped-permissions.md
