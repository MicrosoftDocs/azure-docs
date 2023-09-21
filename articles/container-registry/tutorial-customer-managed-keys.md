---
title: Overview of customer-managed keys
description: Learn how to encrypt your Premium container registry by using a customer-managed key stored in Azure Key Vault.
ms.topic: tutorial
ms.date: 08/5/2022
ms.author: tejaswikolli
---

# Overview of customer-managed keys

Azure Container Registry automatically encrypts images and other artifacts that you store. By default, Azure automatically encrypts the registry content at rest by using [service-managed keys](../security/fundamentals/encryption-models.md). By using a customer-managed key, you can supplement default encryption with an additional encryption layer.
  
This article is part one in a four-part tutorial series. The tutorial covers:

> [!div class="checklist"]
> * Overview of customer-managed keys
> * Enable a customer-managed key
> * Rotate and revoke a customer-managed key
> * Troubleshoot a customer-managed key

## About customer-managed keys 

A customer-managed key gives you the ownership to bring your own key in [Azure Key Vault](../key-vault/general/overview.md). When you enable a customer-managed key, you can manage its rotations, control the access and permissions to use it, and audit its use.

Key features include:

* **Regulatory compliance**: Azure automatically encrypts registry content at rest with [service-managed keys](../security/fundamentals/encryption-models.md), but customer-managed key encryption helps you meet guidelines for regulatory compliance.

* **Integration with Azure Key Vault**: Customer-managed keys support server-side encryption through integration with [Azure Key Vault](../key-vault/general/overview.md). With customer-managed keys, you can create your own encryption keys and store them in a key vault. Or you can use Azure Key Vault APIs to generate keys. 

* **Key lifecycle management**: Integrating customer-managed keys with [Azure Key Vault](../key-vault/general/overview.md) gives you full control and responsibility for the key lifecycle, including rotation and management.

## Before you enable a customer-managed key  

Before you configure Azure Container Registry with a customer-managed key, consider the following information:

* This feature is available in the Premium service tier for a container registry. For more information, see [Azure Container Registry service tiers](container-registry-skus.md).
* You can currently enable a customer-managed key only while creating a registry.
* You can't disable the encryption after you enable a customer-managed key on a registry.
* You have to configure a *user-assigned* managed identity to access the key vault. Later, if required, you can enable the registry's *system-assigned* managed identity for key vault access.
* Azure Container Registry supports only RSA or RSA-HSM keys. Elliptic-curve keys aren't currently supported.
* In a registry that's encrypted with a customer-managed key, you can retain logs for [Azure Container Registry tasks](container-registry-tasks-overview.md) for only 24 hours. To retain logs for a longer period, see [View and manage task run logs](container-registry-tasks-logs.md#alternative-log-storage).
* [Content trust](container-registry-content-trust.md) is currently not supported in a registry that's encrypted with a customer-managed key.

## Update the customer-managed key version

Azure Container Registry supports both automatic and manual rotation of registry encryption keys when a new key version is available in Azure Key Vault.

>[!IMPORTANT]
>It's an important security consideration for a registry with customer-managed key encryption to frequently update (rotate) the key versions. Follow your organization's compliance policies to regularly update [key versions](../key-vault/general/about-keys-secrets-certificates.md#objects-identifiers-and-versioning) while storing a customer-managed key in Azure Key Vault.  

* **Automatically update the key version**: When a registry is encrypted with a non-versioned key, Azure Container Registry regularly checks the key vault for a new key version and updates the customer-managed key within one hour. We suggest that you omit the key version when you enable registry encryption with a customer-managed key. Azure Container Registry will then automatically use and update the latest key version.

* **Manually update the key version**: When a registry is encrypted with a specific key version, Azure Container Registry uses that version for encryption until you manually rotate the customer-managed key. We suggest that you specify the key version when you enable registry encryption with a customer-managed key. Azure Container Registry will then use a specific version of a key for registry encryption.

For details, see [Key rotation](tutorial-enable-customer-managed-keys.md#key-rotation) and [Update key version](tutorial-rotate-revoke-customer-managed-keys.md#create-or-update-the-key-version-by-using-the-azure-cli).

## Next steps

* To enable your container registry with a customer-managed key by using the Azure CLI, the Azure portal, or an Azure Resource Manager template, advance to the next article: [Enable a customer-managed key](tutorial-enable-customer-managed-keys.md).
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
