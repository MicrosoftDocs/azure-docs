---
title: Access network-restricted registry using trusted Azure service
description: Enable a trusted Azure service instance to securely access a network-restricted container registry to pull or push images 
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# Allow trusted services to securely access a network-restricted container registry

Azure Container Registry can allow select trusted Azure services to access a registry that's configured with network access rules. When trusted services are allowed, a trusted service instance can securely bypass the registry's network rules and perform operations such as pull or push images. This article explains how to enable and use trusted services with a network-restricted Azure container registry.

Use the Azure Cloud Shell or a local installation of the Azure CLI to run the command examples in this article. If you'd like to use it locally, version 2.18 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Limitations

* Certain registry access scenarios with trusted services require a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md). Except where noted that a user-assigned managed identity is supported, only a system-assigned identity may be used. 
* Allowing trusted services doesn't apply to a container registry configured with a [service endpoint](container-registry-vnet.md). The feature only affects registries that are restricted with a [private endpoint](container-registry-private-link.md) or that have [public IP access rules](container-registry-access-selected-networks.md) applied. 

## About trusted services

Azure Container Registry has a layered security model, supporting multiple network configurations that restrict access to a registry, including:

* [Private endpoint with Azure Private Link](container-registry-private-link.md). When configured, a registry's private endpoint is accessible only to resources within the virtual network, using private IP addresses.  
* [Registry firewall rules](container-registry-access-selected-networks.md), which allow access to the registry's public endpoint only from specific public IP addresses or address ranges. You can also configure the firewall to block all access to the public endpoint when using private endpoints.

When deployed in a virtual network or configured with firewall rules, a registry denies access to users or services from outside those sources. 

Several multi-tenant Azure services operate from networks that can't be included in these registry network settings, preventing them from performing operations such as pull or push images to the registry. By designating certain service instances as "trusted", a registry owner can allow select Azure resources to securely bypass the registry's network settings to perform registry operations. 

### Trusted services

Instances of the following services can access a network-restricted container registry if the registry's **allow trusted services** setting is enabled (the default). More services will be added over time.

Where indicated, access by the trusted service requires additional configuration of a managed identity in a service instance, assignment of an [RBAC role](container-registry-roles.md), and authentication with the registry. For example steps, see [Trusted services workflow](#trusted-services-workflow), later in this article.

|Trusted service  |Supported usage scenarios  | Configure managed identity with RBAC role
|---------|---------|------|
| Azure Container Instances | [Deploy to Azure Container Instances from Azure Container Registry using a managed identity](../container-instances/using-azure-container-registry-mi.md) | Yes, either system-assigned or user-assigned identity |
| Microsoft Defender for Cloud | Vulnerability scanning by [Microsoft Defender for container registries](scan-images-defender.md) | No |
|ACR Tasks     | [Access the parent registry or a different registry from an ACR Task](container-registry-tasks-cross-registry-authentication.md)       | Yes |
|Machine Learning | [Deploy](../machine-learning/how-to-deploy-custom-container.md) or [train](../machine-learning/v1/how-to-train-with-custom-image.md) a model in a Machine Learning workspace using a custom Docker container image | Yes |
|Azure Container Registry | [Import images](container-registry-import-images.md) to or from a network-restricted Azure container registry | No |

> [!NOTE]
> Curently, enabling the allow trusted services setting doesn't apply to App Service.

## Allow trusted services - CLI

By default, the allow trusted services setting is enabled in a new Azure container registry. Disable or enable the setting by running the [az acr update](/cli/azure/acr#az-acr-update) command.

To disable:

```azurecli
az acr update --name myregistry --allow-trusted-services false
```

To enable the setting in an existing registry or a registry where it's already disabled:

```azurecli
az acr update --name myregistry --allow-trusted-services true
```

## Allow trusted services - portal

By default, the allow trusted services setting is enabled in a new Azure container registry. 

To disable or re-enable the setting in the portal:

1. In the portal, navigate to your container registry.
1. Under **Settings**, select **Networking**. 
1. In **Allow public network access**, select **Selected networks** or **Disabled**.
1. Do one of the following:
    * To disable access by trusted services, under **Firewall exception**, uncheck **Allow trusted Microsoft services to access this container registry**. 
    * To allow trusted services, under **Firewall exception**, check **Allow trusted Microsoft services to access this container registry**.
1. Select **Save**.

## Trusted services workflow

Here's a typical workflow to enable an instance of a trusted service to access a network-restricted container registry. This workflow is needed when a service instance's managed identity is used to bypass the registry's network rules.

1. Enable a managed identity in an instance of one of the [trusted services](#trusted-services) for Azure Container Registry.
1. Assign the identity an [Azure role](container-registry-roles.md) to your registry. For example, assign the ACRPull role to pull container images.
1. In the network-restricted registry, configure the setting to allow access by trusted services.
1. Use the identity's credentials to authenticate with the network-restricted registry. 
1. Pull images from the registry, or perform other operations allowed by the role.

### Example: ACR Tasks

The following example demonstrates using ACR Tasks as a trusted service. See [Cross-registry authentication in an ACR task using an Azure-managed identity](container-registry-tasks-cross-registry-authentication.md) for task details.

1. Create or update an Azure container registry.
[Create](container-registry-tasks-cross-registry-authentication.md#option-2-create-task-with-system-assigned-identity) an ACR task. 
    * Enable a system-assigned managed identity when creating the task.
    * Disable default auth mode (`--auth-mode None`) of the task.
1. Assign the task identity [an Azure role to access the registry](container-registry-tasks-authentication-managed-identity.md#3-grant-the-identity-permissions-to-access-other-azure-resources). For example, assign the AcrPush role, which has permissions to pull and push images.
2. [Add managed identity credentials for the registry](container-registry-tasks-authentication-managed-identity.md#4-optional-add-credentials-to-the-task) to the task.
3. To confirm that the task bypasses network restrictions, [disable public access](container-registry-access-selected-networks.md#disable-public-network-access) in the registry.
4. Run the task. If the registry and task are configured properly, the task runs successfully, because the registry allows access.

To test disabling access by trusted services:

1. Disable the setting to allow access by trusted services.
1. Run the task again. In this case, the task run fails, because the registry no longer allows access by the task.

## Next steps

* To restrict access to a registry using a private endpoint in a virtual network, see [Configure Azure Private Link for an Azure container registry](container-registry-private-link.md).
* To set up registry firewall rules, see [Configure public IP network rules](container-registry-access-selected-networks.md).
