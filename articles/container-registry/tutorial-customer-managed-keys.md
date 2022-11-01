---
title: Customer-managed keys - overview
description: Learn about the customer-managed keys, an overview on its key features and considerations before you encrypt your Premium registry with a customer-managed key stored in Azure Key Vault.
ms.topic: tutorial
ms.date: 08/5/2022
ms.author: tejaswikolli
---

# Tutorial: An overview of a customer-managed key encryption for your Azure Container Registry

Azure Container Registry, automatically encrypts the images and other artifacts you store. By default, Azure automatically encrypts the registry content at rest with [service-managed keys](../security/fundamentals/encryption-models.md). You can supplement default encryption with an additional encryption layer using a customer-managed key.

  
In this tutorial, part one in a four-part series:

> [!div class="checklist"]
> * customer-managed key - Overview
> * Enable a customer-managed key - CLI, Portal, and Resource Manager Template
> * Rotate and revoke a customer-managed key
> * Troubleshoot a customer-managed key

## About customer-managed key 

A customer-managed key gives you the ownership to bring your own key in the [Azure Key Vault](../key-vault/general/overview.md). The customer-managed key also allows you to manage key rotations, controls the access and permissions to use the key, and audit the usage of the key.

The key features include:

>* **Regulatory compliance standards**: By default, Azure automatically encrypts the registry content at rest with [service-managed keys,](../security/fundamentals/encryption-models.md) but customer-managed keys encryption meets the guidelines of standard regulatory compliance.

>* **Integration with Azure key vault**: Customer-managed keys support server-side encryption through integration with [Azure Key Vault.](../key-vault/general/overview.md). With customer-managed keys, you can create your own encryption keys and store them in an Azure Key Vault, or you can use Azure Key Vault APIs to generate keys. 

>* **Key life cycle management**: Integrating customer-managed keys with [Azure Key Vault](../key-vault/general/overview.md), will give you full control and responsibility for the key lifecycle, including rotation and management.

## Before you enable a customer-managed key  

Configure Azure Container Registry (ACR) with a customer-managed key consider knowing:

>* This feature is available in the **Premium** container registry service tier. For more information, see [ACR service tiers.](container-registry-skus.md)
>* You can currently enable a customer-managed key only while creating a registry.
>* You can't disable the encryption after enabling a customer-managed key on a registry.
>* You have to configure a *user-assigned* managed identity to access the key vault. Later, if required you can enable the registry's *system-assigned* managed identity for key vault access.
>* Azure Container Registry supports only RSA or RSA-HSM keys. Elliptic curve keys aren't currently supported.
>* In a registry encrypted with a customer-managed key, you can retain logs for [ACR Tasks](container-registry-tasks-overview.md) only for 24 hours. To retain logs for a longer period, see guidance to [export and store task run logs.](container-registry-tasks-logs.md#alternative-log-storage)
>* [Content trust](container-registry-content-trust.md) is currently not supported in a registry encrypted with a customer-managed key.

## Update the customer-managed key version

Azure Container Registry supports both automatic and manual rotation  of registry encryption keys when a new key version is available in Azure Key Vault.

>[!IMPORTANT]
>It is an important security consideration for a registry with customer-managed key encryption to frequently update (rotate) the key versions. Follow your organization's compliance policies to regularly update [key versions,](../key-vault/general/about-keys-secrets-certificates.md#objects-identifiers-and-versioning) while storing a customer-managed key in Azure Key Vault.  

* **Automatically update the key version** -  With a registry encrypted with a non-versioned key, Azure Container Registry regularly checks the Azure key vault for a new key version and updates the customer-managed key within 1 hour. So, we suggest omitting the key version when you enable registry encryption with a customer-managed key. So, that ACR automatically uses and updates to the latest key version.

* **Manually update the key version** -  With a registry encrypted with a specific key version, Azure Container Registry uses that version for encryption until you manually rotate the customer-managed key. So, we suggest specifying the key version when you enable registry encryption with a customer-managed key. So, that ACR will use a specific version of a key for registry encryption.

For details, see [Choose key ID with version](tutorial-enable-customer-managed-keys.md#option-1-manual-key-rotation---key-id-with-version) ,  or [Choose key ID without key version](tutorial-enable-customer-managed-keys.md#option-2-automatic-key-rotation---key-id-omitting-version), and [Update key version](tutorial-rotate-revoke-customer-managed-keys.md#create-or-update-key-version---cli) later in this tutorial.

## Next steps

In this tutorial, you have an overview on a customer-managed keys, their key features, and a brief of the considerations to enable a customer-managed key to your registry and types of updating key versions.

Advance to the next [tutorial](tutorial-enable-customer-managed-keys.md) to enable your container registry with a customer-managed keys using Azure CLI, Azure portal, and Azure Resource Manager template.
* Learn more about [encryption at rest in Azure](../security/fundamentals/encryption-atrest.md).
* Learn more about access policies and how to [secure access to a key vault](../key-vault/general/security-features.md).


<!-- LINKS - external -->

<!-- LINKS - internal -->

[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-show]: /cli/azure/feature#az_feature_show
[az-group-create]: /cli/azure/group#az_group_create
[az-identity-create]: /cli/azure/identity#az_identity_create
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-deployment-group-create]: /cli/azure/deployment/group#az_deployment_group_create
[az-keyvault-create]: /cli/azure/keyvault#az_keyvault_create
[az-keyvault-key-create]: /cli/azure/keyvault/key#az_keyvault_key_create
[az-keyvault-key]: /cli/azure/keyvault/key
[az-keyvault-set-policy]: /cli/azure/keyvault#az_keyvault_set_policy
[az-keyvault-delete-policy]: /cli/azure/keyvault#az_keyvault_delete_policy
[az-resource-show]: /cli/azure/resource#az_resource_show
[az-acr-create]: /cli/azure/acr#az_acr_create
[az-acr-show]: /cli/azure/acr#az_acr_show
[az-acr-encryption-rotate-key]: /cli/azure/acr/encryption#az_acr_encryption_rotate_key
[az-acr-encryption-show]: /cli/azure/acr/encryption#az_acr_encryption_show
