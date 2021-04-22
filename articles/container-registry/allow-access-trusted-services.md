---
title: Access network-restricted registry using trusted Azure service
description: Enable a trusted Azure service instance to securely access a network-restricted container registry to pull or push images 
ms.topic: article
ms.date: 01/29/2021
---

# Allow trusted services to securely access a network-restricted container registry (preview)

Azure Container Registry can allow select trusted Azure services to access a registry that's configured with network access rules. When trusted services are allowed, a trusted service instance can securely bypass the registry's network rules and perform operations such as pull or push images. The service instance's managed identity is used for access, and must be assigned an Azure role and authenticate with the registry.

Use the Azure Cloud Shell or a local installation of the Azure CLI to run the command examples in this article. If you'd like to use it locally, version 2.18 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

Allowing registry access by trusted Azure services is a **preview** feature.

## Limitations

* You must use a system-assigned managed identity enabled in a [trusted service](#trusted-services) to access a network-restricted container registry. User-assigned managed identities aren't currently supported.
* Allowing trusted services doesn't apply to a container registry configured with a [service endpoint](container-registry-vnet.md). The feature only affects registries that are restricted with a [private endpoint](container-registry-private-link.md) or that have [public IP access rules](container-registry-access-selected-networks.md) applied. 

## About trusted services

Azure Container Registry has a layered security model, supporting multiple network configurations that restrict access to a registry, including:

* [Private endpoint with Azure Private Link](container-registry-private-link.md). When configured, a registry's private endpoint is accessible only to resources within the virtual network, using private IP addresses.  
* [Registry firewall rules](container-registry-access-selected-networks.md), which allow access to the registry's public endpoint only from specific public IP addresses or address ranges. You can also configure the firewall to block all access to the public endpoint when using private endpoints.

When deployed in a virtual network or configured with firewall rules, a registry denies access by default to users or services from outside those sources. 

Several multi-tenant Azure services operate from networks that can't be included in these registry network settings, preventing them from pulling or pushing images to the registry. By designating certain service instances as "trusted", a registry owner can allow select Azure resources to securely bypass the registry's network settings to pull or push images. 

### Trusted services

Instances of the following services can access a network-restricted container registry if the registry's **allow trusted services** setting is enabled (the default). More services will be added over time.

|Trusted service  |Supported usage scenarios  |
|---------|---------|
|ACR Tasks     | [Access a different registry from an ACR Task](container-registry-tasks-cross-registry-authentication.md)       |
|Machine Learning | [Deploy](../machine-learning/how-to-deploy-custom-docker-image.md) or [train](../machine-learning/how-to-train-with-custom-image.md) a model in a Machine Learning workspace using a custom Docker container image |
|Azure Container Registry | [Import images from another Azure container registry](container-registry-import-images.md#import-from-an-azure-container-registry-in-the-same-ad-tenant) | 

> [!NOTE]
> Curently, enabling the allow trusted services setting does not allow instances of other managed Azure services including App Service, Azure Container Instances, and Azure Security Center to access a network-restricted container registry.

## Allow trusted services - CLI

By default, the allow trusted services setting is enabled in a new Azure container registry. Disable or enable the setting by running the [az acr update](/cli/azure/acr#az_acr_update) command.

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

Here's a typical workflow to enable an instance of a trusted service to access a network-restricted container registry.

1. Enable a system-assigned [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) in an instance of one of the [trusted services](#trusted-services) for Azure Container Registry.
1. Assign the identity an [Azure role](container-registry-roles.md) to your registry. For example, assign the ACRPull role to pull container images.
1. In the network-restricted registry, configure the setting to allow access by trusted services.
1. Use the identity's credentials to authenticate with the network-restricted registry. 
1. Pull images from the registry, or perform other operations allowed by the role.

### Example: ACR Tasks

The following example demonstrates using ACR Tasks as a trusted service. See [Cross-registry authentication in an ACR task using an Azure-managed identity](container-registry-tasks-cross-registry-authentication.md) for task details.

1. Create or update an Azure container registry, and [push a sample base image](container-registry-tasks-cross-registry-authentication.md#prepare-base-registry) to the registry. This registry is the *base registry* for the scenario.
1. In a second Azure container registry, [define](container-registry-tasks-cross-registry-authentication.md#define-task-steps-in-yaml-file) and [create](container-registry-tasks-cross-registry-authentication.md#option-2-create-task-with-system-assigned-identity) an ACR task to pull an image from the base registry. Enable a system-assigned managed identity when creating the task.
1. Assign the task identity [an Azure role to access the base registry](container-registry-tasks-authentication-managed-identity.md#3-grant-the-identity-permissions-to-access-other-azure-resources). For example, assign the AcrPull role, which has permissions to pull images.
1. [Add managed identity credentials](container-registry-tasks-authentication-managed-identity.md#4-optional-add-credentials-to-the-task) to the task.
1. To confirm that the task bypasses network restrictions, [disable public access](container-registry-access-selected-networks.md#disable-public-network-access) in the base registry.
1. Run the task. If the base registry and task are configured properly, the task runs successfully, because the base registry allows access.

To test disabling access by trusted services:

1. In the base registry, disable the setting to allow access by trusted services.
1. Run the task again. In this case, the task run fails, because the base registry no longer allows access by the task.

## Next steps

* To restrict access to a registry using a private endpoint in a virtual network, see [Configure Azure Private Link for an Azure container registry](container-registry-private-link.md).
* To set up registry firewall rules, see [Configure public IP network rules](container-registry-access-selected-networks.md).
