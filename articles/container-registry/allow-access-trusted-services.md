---
title: Access network-restricted registry with trusted service
description: Enable a trusted service instance to securely access a network-restricted container registry using a system-assigned managed identity 
ms.topic: article
ms.date: 09/23/2020
---

# Allow trusted services to securely access a network-restricted container registry

Azure Container Registry supports select trusted Azure services to access a network-restricted container registry. If access by trusted services is allowed, a managed identity enabled in a trusted service instance can securely bypass the registry's virtual network or firewall rules. The identity must be assigned an RBAC role to pull or push images and authenticate with the registry to perform registry operations.

Enabling access by trusted services is a feature of the **Premium** service tier. For information about registry service tiers and limits, see [Azure Container Registry service tiers](container-registry-skus.md).

You can use the Azure Cloud Shell or a local installation of the Azure CLI to run the command examples in this article. If you'd like to use it locally, version **XXXX** or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Why allow trusted services?

Azure Container Registry has a layered security model, supporting multiple network configurations that restrict access to a registry, including:

* [Private endpoint with Azure Private Link](container-registry-private-link.md). When configured, a registry's private endpoint is accessible only to resources within the virtual network, using private IP addresses.  
* [Registry firewall rules](container-registry-access-selected-networks.md), which allow access to the registry's public endpoint only from specific public IP addresses or address ranges. You can also use the firewall to block all access through the public endpoint when using private endpoints.

A user or service attempting to access a registry from outside those sources will be denied access. For example, several managed Azure services operate from networks that can't be included in registry network rules, limiting certain registry scenarios. By allowing trusted services, a registry owner can enable select trusted Azure resources to securely bypass network restrictions placed on a registry. 

## Limitations

* Only a system-assigned managed identity enabled in a [trusted service](#trusted-services) instance can access a network-restricted container registry. User-assigned managed identities aren't currently supported.
* Allowing trusted services is only effective in container registries that are restricted with a [private endpoint](container-registry-private-link.md) or that have [public IP access rules](container-registry-access-selected-networks.md) applied. This feature isn't supported in a registry configured with a [service endpoint](container-registry-vnet.md).

## Trusted services

The following services are allowed to access a network-restricted container registry when the **Allow trusted services** option is enabled. More services will be added over time.


|Trusted service  |Supported usage scenarios  |
|---------|---------|
|ACR Tasks     | [Access a registry in an ACR Task](container-registry-tasks-cross-registry-authentication.md)       |
|Machine Learning | [Deploy model from a workspace]() | [Deploy](../machine-learning/how-to-deploy-custom-docker-image.md) or [train](../machine-learning/how-to-train-with-custom-image.md) a model in a Machine Learning workspace using a custom Docker container image |
|Azure Container Registry | [Import images from another Azure container registry](container-registry-import-images.md#import-from-another-azure-container-registry) | 


### Non-trusted services

Instances of the following managed Azure services are *not* allowed access to a network-restricted Azure container registry, and access isn't enabled at this time by setting the **Allow trusted services** option:

* Azure Security Center
* Container Instances
* App Service

## Allow trusted services - CLI

Enable the **Allow trusted services** option by running the [az acr update](/cli/azure/acr#az-acr-update) command and enable the `--allow-trusted-services-network-access` option. By default, the option is disabled. 

```azurecli
az acr update --name myregistry --resource-group myResourceGroup \
  --allow-trusted-services-network-access enabled
```

To disable the option:

```azurecli
az acr update --name myregistry --resource-group myResourceGroup \
  --allow-trusted-services-network-access disabled
```

## Trusted services workflow

Here is a typical workflow to enable an instance of a trusted service to bypass network restrictions in a container registry.

1. Enable a system-assigned [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) in an instance of one of the [trusted services](#trusted-services) for Azure Container Registry.
1. Give the identity [RBAC permissions](container-registry-roles.md) to your registry, for example the ACRPull role to pull container images.
1. In the network-restricted registry, enable the **Allow trusted services** option. By default, the option is disabled.
1. Use the identity's credentials to authenticate with the network-restricted egistry. 
1. Perform permitted registry operations using the managed identity.

## Example: ACR Tasks

The following example demonstrates ACR Tasks as a trusted service in a network-restricted Azure container registry. See [Cross-registry authentication in an ACR task using an Azure-managed identity](container-registry-tasks-cross-registry-authentication.md) for task details.

1. Create or update an Azure container registry, and [push a base image](container-registry-tasks-cross-registry-authentication.md#prepare-base-registry) to the registry. This registry is the *base registry* for the scenario.
1. In a second Azure container registry, [define](container-registry-tasks-cross-registry-authentication.md#define-task-steps-in-yaml-file) and [create](container-registry-tasks-cross-registry-authentication.md#option-2-create-task-with-system-assigned-identity) an ACR task to pull an image from the base registry. Enable a system-assigned managed identity when creating the task.
1. Grant the identity [permissions to access the base registry](container-registry-tasks-authentication-managed-identity.md#3-grant-the-identity-permissions-to-access-other-azure-resources). For example, assign the AcrPull role, with permissions to pull images.
1. [Add managed identity credentials](container-registry-tasks-authentication-managed-identity.md#4-optional-add-credentials-to-the-task) to the task.
1. To confirm that the task bypasses network restrictions, [disable public access](container-registry-access-selected-networks.md#disable-public-network-access) in the base registry.
1. Run the task. If the base registry and task are configured properly, the task runs successfully.

## Next steps

* To restrict access to a registry using a private endpoint in a virtual network, see [Configure Azure Private Link for an Azure container registry](container-registry-private-link.md).
* To set up registry firewall rules, see [Configure public IP network rules](container-registry-access-selected-networks.md).
