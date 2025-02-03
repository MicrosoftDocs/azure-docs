---
title: Azure built-in roles for Security - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Security category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 01/25/2025
ms.custom: generated
---

# Azure built-in roles for Security

This article lists the Azure built-in roles in the Security category.


## App Compliance Automation Administrator

Create, read, download, modify and delete reports objects and related other resource objects.

[!INCLUDE [role-read-permissions.md](../includes/role-read-permissions.md)]

[Learn more](/microsoft-365-app-certification/docs/automate-certification-with-acat)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.AppComplianceAutomation](../permissions/security.md#microsoftappcomplianceautomation)/* |  |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/blobServices/write | Returns the result of put blob service properties |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/fileservices/write | Put file service properties |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/listKeys/action | Returns the access keys for the specified storage account. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/write | Creates a storage account with the specified parameters or update the properties or tags or adds custom domain for the specified storage account. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/blobServices/generateUserDelegationKey/action | Returns a user delegation key for the blob service |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/blobServices/containers/read | Returns list of containers |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/blobServices/containers/write | Returns the result of put blob container |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/blobServices/read | Returns blob service properties or statistics |
> | [Microsoft.PolicyInsights](../permissions/management-and-governance.md#microsoftpolicyinsights)/policyStates/queryResults/action | Query information about policy states. |
> | [Microsoft.PolicyInsights](../permissions/management-and-governance.md#microsoftpolicyinsights)/policyStates/triggerEvaluation/action | Triggers a new compliance evaluation for the selected scope. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/resources/read | Get the list of resources based upon filters. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/resources/read | Gets the resources for the resource group. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resources/read | Gets resources of a subscription. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/delete | Deletes a resource group and all its resources. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/write | Creates or updates a resource group. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/tags/read | Gets all the tags on a resource. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/validate/action | Validates an deployment. |
> | [Microsoft.Security](../permissions/security.md#microsoftsecurity)/automations/read | Gets the automations for the scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/write | Creates or updates an deployment. |
> | [Microsoft.Security](../permissions/security.md#microsoftsecurity)/automations/delete | Deletes the automation for the scope |
> | [Microsoft.Security](../permissions/security.md#microsoftsecurity)/automations/write | Creates or updates the automation for the scope |
> | [Microsoft.Security](../permissions/security.md#microsoftsecurity)/register/action | Registers the subscription for Azure Security Center |
> | [Microsoft.Security](../permissions/security.md#microsoftsecurity)/unregister/action | Unregisters the subscription from Azure Security Center |
> | */read | Read control plane information for all Azure resources. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Create, read, download, modify and delete reports objects and related other resource objects.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/0f37683f-2463-46b6-9ce7-9b788b988ba2",
  "name": "0f37683f-2463-46b6-9ce7-9b788b988ba2",
  "permissions": [
    {
      "actions": [
        "Microsoft.AppComplianceAutomation/*",
        "Microsoft.Storage/storageAccounts/blobServices/write",
        "Microsoft.Storage/storageAccounts/fileservices/write",
        "Microsoft.Storage/storageAccounts/listKeys/action",
        "Microsoft.Storage/storageAccounts/write",
        "Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/write",
        "Microsoft.Storage/storageAccounts/blobServices/read",
        "Microsoft.PolicyInsights/policyStates/queryResults/action",
        "Microsoft.PolicyInsights/policyStates/triggerEvaluation/action",
        "Microsoft.Resources/resources/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/subscriptions/resourceGroups/resources/read",
        "Microsoft.Resources/subscriptions/resources/read",
        "Microsoft.Resources/subscriptions/resourceGroups/delete",
        "Microsoft.Resources/subscriptions/resourceGroups/write",
        "Microsoft.Resources/tags/read",
        "Microsoft.Resources/deployments/validate/action",
        "Microsoft.Security/automations/read",
        "Microsoft.Resources/deployments/write",
        "Microsoft.Security/automations/delete",
        "Microsoft.Security/automations/write",
        "Microsoft.Security/register/action",
        "Microsoft.Security/unregister/action",
        "*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "App Compliance Automation Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## App Compliance Automation Reader

Read, download the reports objects and related other resource objects.

[!INCLUDE [role-read-permissions.md](../includes/role-read-permissions.md)]

[Learn more](/microsoft-365-app-certification/docs/automate-certification-with-acat)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | */read | Read control plane information for all Azure resources. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read, download the reports objects and related other resource objects.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/ffc6bbe0-e443-4c3b-bf54-26581bb2f78e",
  "name": "ffc6bbe0-e443-4c3b-bf54-26581bb2f78e",
  "permissions": [
    {
      "actions": [
        "*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "App Compliance Automation Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Attestation Contributor

Can read write or delete the attestation provider instance

[Learn more](/azure/attestation/quickstart-powershell)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | Microsoft.Attestation/attestationProviders/attestation/read | Gets the attestation service status. |
> | Microsoft.Attestation/attestationProviders/attestation/write | Adds attestation service. |
> | Microsoft.Attestation/attestationProviders/attestation/delete | Removes attestation service. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can read write or delete the attestation provider instance",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/bbf86eb8-f7b4-4cce-96e4-18cddf81d86e",
  "name": "bbf86eb8-f7b4-4cce-96e4-18cddf81d86e",
  "permissions": [
    {
      "actions": [
        "Microsoft.Attestation/attestationProviders/attestation/read",
        "Microsoft.Attestation/attestationProviders/attestation/write",
        "Microsoft.Attestation/attestationProviders/attestation/delete"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Attestation Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Attestation Reader

Can read the attestation provider properties

[Learn more](/azure/attestation/troubleshoot-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | Microsoft.Attestation/attestationProviders/attestation/read | Gets the attestation service status. |
> | Microsoft.Attestation/attestationProviders/read | Gets the attestation service status. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can read the attestation provider properties",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/fd1bd22b-8476-40bc-a0bc-69b95687b9f3",
  "name": "fd1bd22b-8476-40bc-a0bc-69b95687b9f3",
  "permissions": [
    {
      "actions": [
        "Microsoft.Attestation/attestationProviders/attestation/read",
        "Microsoft.Attestation/attestationProviders/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Attestation Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Key Vault Administrator

Perform all data plane operations on a key vault and all objects in it, including certificates, keys, and secrets. Cannot manage key vault resources or manage role assignments. Only works for key vaults that use the 'Azure role-based access control' permission model.

[Learn more](/azure/key-vault/general/rbac-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/checkNameAvailability/read | Checks that a key vault name is valid and is not in use |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/deletedVaults/read | View the properties of soft deleted key vaults |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/locations/*/read |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/*/read |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/operations/read | Lists operations available on Microsoft.KeyVault resource provider |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Perform all data plane operations on a key vault and all objects in it, including certificates, keys, and secrets. Cannot manage key vault resources or manage role assignments. Only works for key vaults that use the 'Azure role-based access control' permission model.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/00482a5a-887f-4fb3-b363-3b7fe8e74483",
  "name": "00482a5a-887f-4fb3-b363-3b7fe8e74483",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.KeyVault/checkNameAvailability/read",
        "Microsoft.KeyVault/deletedVaults/read",
        "Microsoft.KeyVault/locations/*/read",
        "Microsoft.KeyVault/vaults/*/read",
        "Microsoft.KeyVault/operations/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.KeyVault/vaults/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Key Vault Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Key Vault Certificate User

Read certificate contents. Only works for key vaults that use the 'Azure role-based access control' permission model.

[Learn more](/azure/key-vault/general/rbac-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/certificates/read | List certificates in a specified key vault, or get information about a certificate. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/secrets/getSecret/action | Gets the value of a secret. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/secrets/readMetadata/action | List or view the properties of a secret, but not its value. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/read | List keys in the specified vault, or read properties and public material of a key. For asymmetric keys, this operation exposes public key and includes ability to perform public key algorithms such as encrypt and verify signature. Private keys and symmetric keys are never exposed. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read certificate contents. Only works for key vaults that use the 'Azure role-based access control' permission model.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/db79e9a7-68ee-4b58-9aeb-b90e7c24fcba",
  "name": "db79e9a7-68ee-4b58-9aeb-b90e7c24fcba",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.KeyVault/vaults/certificates/read",
        "Microsoft.KeyVault/vaults/secrets/getSecret/action",
        "Microsoft.KeyVault/vaults/secrets/readMetadata/action",
        "Microsoft.KeyVault/vaults/keys/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Key Vault Certificate User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Key Vault Certificates Officer

Perform any action on the certificates of a key vault, except manage permissions. Only works for key vaults that use the 'Azure role-based access control' permission model.

[Learn more](/azure/key-vault/general/rbac-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/checkNameAvailability/read | Checks that a key vault name is valid and is not in use |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/deletedVaults/read | View the properties of soft deleted key vaults |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/locations/*/read |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/*/read |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/operations/read | Lists operations available on Microsoft.KeyVault resource provider |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/certificatecas/* |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/certificates/* |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/certificatecontacts/write | Manage Certificate Contact |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Perform any action on the certificates of a key vault, except manage permissions. Only works for key vaults that use the 'Azure role-based access control' permission model.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a4417e6f-fecd-4de8-b567-7b0420556985",
  "name": "a4417e6f-fecd-4de8-b567-7b0420556985",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.KeyVault/checkNameAvailability/read",
        "Microsoft.KeyVault/deletedVaults/read",
        "Microsoft.KeyVault/locations/*/read",
        "Microsoft.KeyVault/vaults/*/read",
        "Microsoft.KeyVault/operations/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.KeyVault/vaults/certificatecas/*",
        "Microsoft.KeyVault/vaults/certificates/*",
        "Microsoft.KeyVault/vaults/certificatecontacts/write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Key Vault Certificates Officer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Key Vault Contributor

Manage key vaults, but does not allow you to assign roles in Azure RBAC, and does not allow you to access secrets, keys, or certificates.

[Learn more](/azure/key-vault/general/security-features)

[!INCLUDE [contributor-role-warning.md](~/reusable-content/ce-skilling/azure/includes/key-vault/includes/key-vault-contributor-role-warning.md)]

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/* |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/locations/deletedVaults/purge/action | Purge a soft deleted key vault |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/hsmPools/* |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/managedHsms/* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage key vaults, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f25e0fa2-a7c8-4377-a976-54943a77a395",
  "name": "f25e0fa2-a7c8-4377-a976-54943a77a395",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.KeyVault/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [
        "Microsoft.KeyVault/locations/deletedVaults/purge/action",
        "Microsoft.KeyVault/hsmPools/*",
        "Microsoft.KeyVault/managedHsms/*"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Key Vault Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Key Vault Crypto Officer

Perform any action on the keys of a key vault, except manage permissions. Only works for key vaults that use the 'Azure role-based access control' permission model.

[Learn more](/azure/key-vault/general/rbac-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/checkNameAvailability/read | Checks that a key vault name is valid and is not in use |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/deletedVaults/read | View the properties of soft deleted key vaults |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/locations/*/read |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/*/read |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/operations/read | Lists operations available on Microsoft.KeyVault resource provider |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/* |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keyrotationpolicies/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Perform any action on the keys of a key vault, except manage permissions. Only works for key vaults that use the 'Azure role-based access control' permission model.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/14b46e9e-c2b7-41b4-b07b-48a6ebf60603",
  "name": "14b46e9e-c2b7-41b4-b07b-48a6ebf60603",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.KeyVault/checkNameAvailability/read",
        "Microsoft.KeyVault/deletedVaults/read",
        "Microsoft.KeyVault/locations/*/read",
        "Microsoft.KeyVault/vaults/*/read",
        "Microsoft.KeyVault/operations/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.KeyVault/vaults/keys/*",
        "Microsoft.KeyVault/vaults/keyrotationpolicies/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Key Vault Crypto Officer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Key Vault Crypto Service Encryption User

Read metadata of keys and perform wrap/unwrap operations. Only works for key vaults that use the 'Azure role-based access control' permission model.

[Learn more](/azure/key-vault/general/rbac-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/eventSubscriptions/write | Create or update an eventSubscription |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/eventSubscriptions/read | Read an eventSubscription |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/eventSubscriptions/delete | Delete an eventSubscription |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/read | List keys in the specified vault, or read properties and public material of a key. For asymmetric keys, this operation exposes public key and includes ability to perform public key algorithms such as encrypt and verify signature. Private keys and symmetric keys are never exposed. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/wrap/action | Wraps a symmetric key with a Key Vault key. Note that if the Key Vault key is asymmetric, this operation can be performed by principals with read access. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/unwrap/action | Unwraps a symmetric key with a Key Vault key. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read metadata of keys and perform wrap/unwrap operations. Only works for key vaults that use the 'Azure role-based access control' permission model.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/e147488a-f6f5-4113-8e2d-b22465e65bf6",
  "name": "e147488a-f6f5-4113-8e2d-b22465e65bf6",
  "permissions": [
    {
      "actions": [
        "Microsoft.EventGrid/eventSubscriptions/write",
        "Microsoft.EventGrid/eventSubscriptions/read",
        "Microsoft.EventGrid/eventSubscriptions/delete"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.KeyVault/vaults/keys/read",
        "Microsoft.KeyVault/vaults/keys/wrap/action",
        "Microsoft.KeyVault/vaults/keys/unwrap/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Key Vault Crypto Service Encryption User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Key Vault Crypto Service Release User

Release keys. Only works for key vaults that use the 'Azure role-based access control' permission model.

[Learn more](/azure/key-vault/general/rbac-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/release/action | Release a key using public part of KEK from attestation token. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Release keys. Only works for key vaults that use the 'Azure role-based access control' permission model.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/08bbd89e-9f13-488c-ac41-acfcb10c90ab",
  "name": "08bbd89e-9f13-488c-ac41-acfcb10c90ab",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.KeyVault/vaults/keys/release/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Key Vault Crypto Service Release User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Key Vault Crypto User

Perform cryptographic operations using keys. Only works for key vaults that use the 'Azure role-based access control' permission model.

[Learn more](/azure/key-vault/general/rbac-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/read | List keys in the specified vault, or read properties and public material of a key. For asymmetric keys, this operation exposes public key and includes ability to perform public key algorithms such as encrypt and verify signature. Private keys and symmetric keys are never exposed. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/update/action | Updates the specified attributes associated with the given key. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/backup/action | Creates the backup file of a key. The file can used to restore the key in a Key Vault of same subscription. Restrictions may apply. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/encrypt/action | Encrypts plaintext with a key. Note that if the key is asymmetric, this operation can be performed by principals with read access. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/decrypt/action | Decrypts ciphertext with a key. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/wrap/action | Wraps a symmetric key with a Key Vault key. Note that if the Key Vault key is asymmetric, this operation can be performed by principals with read access. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/unwrap/action | Unwraps a symmetric key with a Key Vault key. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/sign/action | Signs a message digest (hash) with a key. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/keys/verify/action | Verifies the signature of a message digest (hash) with a key. Note that if the key is asymmetric, this operation can be performed by principals with read access. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Perform cryptographic operations using keys. Only works for key vaults that use the 'Azure role-based access control' permission model.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/12338af0-0e69-4776-bea7-57ae8d297424",
  "name": "12338af0-0e69-4776-bea7-57ae8d297424",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.KeyVault/vaults/keys/read",
        "Microsoft.KeyVault/vaults/keys/update/action",
        "Microsoft.KeyVault/vaults/keys/backup/action",
        "Microsoft.KeyVault/vaults/keys/encrypt/action",
        "Microsoft.KeyVault/vaults/keys/decrypt/action",
        "Microsoft.KeyVault/vaults/keys/wrap/action",
        "Microsoft.KeyVault/vaults/keys/unwrap/action",
        "Microsoft.KeyVault/vaults/keys/sign/action",
        "Microsoft.KeyVault/vaults/keys/verify/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Key Vault Crypto User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Key Vault Data Access Administrator

Manage access to Azure Key Vault by adding or removing role assignments for the Key Vault Administrator, Key Vault Certificates Officer, Key Vault Crypto Officer, Key Vault Crypto Service Encryption User, Key Vault Crypto User, Key Vault Reader, Key Vault Secrets Officer, or Key Vault Secrets User roles. Includes an ABAC condition to constrain role assignments.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/write | Create a role assignment at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/roleAssignments/delete | Delete a role assignment at the specified scope. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/read | Gets the list of subscriptions. |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/read | List management groups for the authenticated user. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |
> | **Condition** |  |
> | ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{00482a5a-887f-4fb3-b363-3b7fe8e74483, a4417e6f-fecd-4de8-b567-7b0420556985, 14b46e9e-c2b7-41b4-b07b-48a6ebf60603, e147488a-f6f5-4113-8e2d-b22465e65bf6, 12338af0-0e69-4776-bea7-57ae8d297424, 21090545-7ca7-4776-b22c-e363652d74d2, b86a8fe4-44ce-4948-aee5-eccb2c155cd7, 4633458b-17de-408a-b874-0445c86b69e6})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{00482a5a-887f-4fb3-b363-3b7fe8e74483, a4417e6f-fecd-4de8-b567-7b0420556985, 14b46e9e-c2b7-41b4-b07b-48a6ebf60603, e147488a-f6f5-4113-8e2d-b22465e65bf6, 12338af0-0e69-4776-bea7-57ae8d297424, 21090545-7ca7-4776-b22c-e363652d74d2, b86a8fe4-44ce-4948-aee5-eccb2c155cd7, 4633458b-17de-408a-b874-0445c86b69e6})) | Add or remove role assignments for the following roles:<br/>Key Vault Administrator<br/>Key Vault Certificates Officer<br/>Key Vault Crypto Officer<br/>Key Vault Crypto Service Encryption User<br/>Key Vault Crypto User<br/>Key Vault Reader<br/>Key Vault Secrets Officer<br/>Key Vault Secrets User |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Manage access to Azure Key Vault by adding or removing role assignments for the Key Vault Administrator, Key Vault Certificates Officer, Key Vault Crypto Officer, Key Vault Crypto Service Encryption User, Key Vault Crypto User, Key Vault Reader, Key Vault Secrets Officer, or Key Vault Secrets User roles. Includes an ABAC condition to constrain role assignments.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/8b54135c-b56d-4d72-a534-26097cfdc8d8",
  "name": "8b54135c-b56d-4d72-a534-26097cfdc8d8",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/roleAssignments/write",
        "Microsoft.Authorization/roleAssignments/delete",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Management/managementGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Support/*",
        "Microsoft.KeyVault/vaults/*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": [],
      "conditionVersion": "2.0",
      "condition": "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{00482a5a-887f-4fb3-b363-3b7fe8e74483, a4417e6f-fecd-4de8-b567-7b0420556985, 14b46e9e-c2b7-41b4-b07b-48a6ebf60603, e147488a-f6f5-4113-8e2d-b22465e65bf6, 12338af0-0e69-4776-bea7-57ae8d297424, 21090545-7ca7-4776-b22c-e363652d74d2, b86a8fe4-44ce-4948-aee5-eccb2c155cd7, 4633458b-17de-408a-b874-0445c86b69e6})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals{00482a5a-887f-4fb3-b363-3b7fe8e74483, a4417e6f-fecd-4de8-b567-7b0420556985, 14b46e9e-c2b7-41b4-b07b-48a6ebf60603, e147488a-f6f5-4113-8e2d-b22465e65bf6, 12338af0-0e69-4776-bea7-57ae8d297424, 21090545-7ca7-4776-b22c-e363652d74d2, b86a8fe4-44ce-4948-aee5-eccb2c155cd7, 4633458b-17de-408a-b874-0445c86b69e6}))"
    }
  ],
  "roleName": "Key Vault Data Access Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Key Vault Reader

Read metadata of key vaults and its certificates, keys, and secrets. Cannot read sensitive values such as secret contents or key material. Only works for key vaults that use the 'Azure role-based access control' permission model.

[Learn more](/azure/key-vault/general/rbac-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/checkNameAvailability/read | Checks that a key vault name is valid and is not in use |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/deletedVaults/read | View the properties of soft deleted key vaults |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/locations/*/read |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/*/read |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/operations/read | Lists operations available on Microsoft.KeyVault resource provider |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/*/read |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/secrets/readMetadata/action | List or view the properties of a secret, but not its value. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read metadata of key vaults and its certificates, keys, and secrets. Cannot read sensitive values such as secret contents or key material. Only works for key vaults that use the 'Azure role-based access control' permission model.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/21090545-7ca7-4776-b22c-e363652d74d2",
  "name": "21090545-7ca7-4776-b22c-e363652d74d2",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.KeyVault/checkNameAvailability/read",
        "Microsoft.KeyVault/deletedVaults/read",
        "Microsoft.KeyVault/locations/*/read",
        "Microsoft.KeyVault/vaults/*/read",
        "Microsoft.KeyVault/operations/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.KeyVault/vaults/*/read",
        "Microsoft.KeyVault/vaults/secrets/readMetadata/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Key Vault Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Key Vault Secrets Officer

Perform any action on the secrets of a key vault, except manage permissions. Only works for key vaults that use the 'Azure role-based access control' permission model.

[Learn more](/azure/key-vault/general/rbac-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/checkNameAvailability/read | Checks that a key vault name is valid and is not in use |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/deletedVaults/read | View the properties of soft deleted key vaults |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/locations/*/read |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/*/read |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/operations/read | Lists operations available on Microsoft.KeyVault resource provider |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/secrets/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Perform any action on the secrets of a key vault, except manage permissions. Only works for key vaults that use the 'Azure role-based access control' permission model.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b86a8fe4-44ce-4948-aee5-eccb2c155cd7",
  "name": "b86a8fe4-44ce-4948-aee5-eccb2c155cd7",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.KeyVault/checkNameAvailability/read",
        "Microsoft.KeyVault/deletedVaults/read",
        "Microsoft.KeyVault/locations/*/read",
        "Microsoft.KeyVault/vaults/*/read",
        "Microsoft.KeyVault/operations/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.KeyVault/vaults/secrets/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Key Vault Secrets Officer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Key Vault Secrets User

Read secret contents. Only works for key vaults that use the 'Azure role-based access control' permission model.

[Learn more](/azure/key-vault/general/rbac-guide)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/secrets/getSecret/action | Gets the value of a secret. |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/vaults/secrets/readMetadata/action | List or view the properties of a secret, but not its value. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read secret contents. Only works for key vaults that use the 'Azure role-based access control' permission model.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4633458b-17de-408a-b874-0445c86b69e6",
  "name": "4633458b-17de-408a-b874-0445c86b69e6",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.KeyVault/vaults/secrets/getSecret/action",
        "Microsoft.KeyVault/vaults/secrets/readMetadata/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Key Vault Secrets User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Managed HSM contributor

Lets you manage managed HSM pools, but not access to them.

[Learn more](/azure/key-vault/managed-hsm/secure-your-managed-hsm)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/managedHSMs/* |  |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/deletedManagedHsms/read | View the properties of a deleted managed hsm |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/locations/deletedManagedHsms/read | View the properties of a deleted managed hsm |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/locations/deletedManagedHsms/purge/action | Purge a soft deleted managed hsm |
> | [Microsoft.KeyVault](../permissions/security.md#microsoftkeyvault)/locations/managedHsmOperationResults/read | Check the result of a long run operation |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage managed HSM pools, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/18500a29-7fe2-46b2-a342-b16a415e101d",
  "name": "18500a29-7fe2-46b2-a342-b16a415e101d",
  "permissions": [
    {
      "actions": [
        "Microsoft.KeyVault/managedHSMs/*",
        "Microsoft.KeyVault/deletedManagedHsms/read",
        "Microsoft.KeyVault/locations/deletedManagedHsms/read",
        "Microsoft.KeyVault/locations/deletedManagedHsms/purge/action",
        "Microsoft.KeyVault/locations/managedHsmOperationResults/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Managed HSM contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Microsoft Sentinel Automation Contributor

Microsoft Sentinel Automation Contributor

[Learn more](/azure/sentinel/roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Logic](../permissions/integration.md#microsoftlogic)/workflows/triggers/read | Reads the trigger. |
> | [Microsoft.Logic](../permissions/integration.md#microsoftlogic)/workflows/triggers/listCallbackUrl/action | Gets the callback URL for trigger. |
> | [Microsoft.Logic](../permissions/integration.md#microsoftlogic)/workflows/runs/read | Reads the workflow run. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/hostruntime/webhooks/api/workflows/triggers/read | List Web Apps Hostruntime Workflow Triggers. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/hostruntime/webhooks/api/workflows/triggers/listCallbackUrl/action | Get Web Apps Hostruntime Workflow Trigger Uri. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/hostruntime/webhooks/api/workflows/runs/read | List Web Apps Hostruntime Workflow Runs. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Microsoft Sentinel Automation Contributor",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f4c81013-99ee-4d62-a7ee-b3f1f648599a",
  "name": "f4c81013-99ee-4d62-a7ee-b3f1f648599a",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Logic/workflows/triggers/read",
        "Microsoft.Logic/workflows/triggers/listCallbackUrl/action",
        "Microsoft.Logic/workflows/runs/read",
        "Microsoft.Web/sites/hostruntime/webhooks/api/workflows/triggers/read",
        "Microsoft.Web/sites/hostruntime/webhooks/api/workflows/triggers/listCallbackUrl/action",
        "Microsoft.Web/sites/hostruntime/webhooks/api/workflows/runs/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Microsoft Sentinel Automation Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Microsoft Sentinel Contributor

Microsoft Sentinel Contributor

[Learn more](/azure/sentinel/roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/* |  |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/analytics/query/action | Search using new engine. |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/*/read | View log analytics data |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/savedSearches/* |  |
> | [Microsoft.OperationsManagement](../permissions/monitor.md#microsoftoperationsmanagement)/solutions/read | Get existing OMS solution |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/query/read | Run queries over the data in the workspace |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/query/*/read |  |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/dataSources/read | Get data source under a workspace. |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/querypacks/*/read |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/workbooks/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/myworkbooks/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/ConfidentialWatchlists/* |  |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/query/ConfidentialWatchlist/* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Microsoft Sentinel Contributor",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/ab8e14d6-4a74-4a29-9ba8-549422addade",
  "name": "ab8e14d6-4a74-4a29-9ba8-549422addade",
  "permissions": [
    {
      "actions": [
        "Microsoft.SecurityInsights/*",
        "Microsoft.OperationalInsights/workspaces/analytics/query/action",
        "Microsoft.OperationalInsights/workspaces/*/read",
        "Microsoft.OperationalInsights/workspaces/savedSearches/*",
        "Microsoft.OperationsManagement/solutions/read",
        "Microsoft.OperationalInsights/workspaces/query/read",
        "Microsoft.OperationalInsights/workspaces/query/*/read",
        "Microsoft.OperationalInsights/workspaces/dataSources/read",
        "Microsoft.OperationalInsights/querypacks/*/read",
        "Microsoft.Insights/workbooks/*",
        "Microsoft.Insights/myworkbooks/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [
        "Microsoft.SecurityInsights/ConfidentialWatchlists/*",
        "Microsoft.OperationalInsights/workspaces/query/ConfidentialWatchlist/*"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Microsoft Sentinel Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Microsoft Sentinel Playbook Operator

Microsoft Sentinel Playbook Operator

[Learn more](/azure/sentinel/roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Logic](../permissions/integration.md#microsoftlogic)/workflows/read | Reads the workflow. |
> | [Microsoft.Logic](../permissions/integration.md#microsoftlogic)/workflows/triggers/listCallbackUrl/action | Gets the callback URL for trigger. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/hostruntime/webhooks/api/workflows/triggers/listCallbackUrl/action | Get Web Apps Hostruntime Workflow Trigger Uri. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/read | Get the properties of a Web App |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Microsoft Sentinel Playbook Operator",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/51d6186e-6489-4900-b93f-92e23144cca5",
  "name": "51d6186e-6489-4900-b93f-92e23144cca5",
  "permissions": [
    {
      "actions": [
        "Microsoft.Logic/workflows/read",
        "Microsoft.Logic/workflows/triggers/listCallbackUrl/action",
        "Microsoft.Web/sites/hostruntime/webhooks/api/workflows/triggers/listCallbackUrl/action",
        "Microsoft.Web/sites/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Microsoft Sentinel Playbook Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Microsoft Sentinel Reader

Microsoft Sentinel Reader

[Learn more](/azure/sentinel/roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/*/read |  |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/dataConnectorsCheckRequirements/action | Check user authorization and license |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/threatIntelligence/indicators/query/action | Query Threat Intelligence Indicators |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/threatIntelligence/queryIndicators/action | Query Threat Intelligence Indicators |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/analytics/query/action | Search using new engine. |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/*/read | View log analytics data |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/LinkedServices/read | Get linked services under given workspace. |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/savedSearches/read | Gets a saved search query. |
> | [Microsoft.OperationsManagement](../permissions/monitor.md#microsoftoperationsmanagement)/solutions/read | Get existing OMS solution |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/query/read | Run queries over the data in the workspace |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/query/*/read |  |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/querypacks/*/read |  |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/dataSources/read | Get data source under a workspace. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/workbooks/read | Read a workbook |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/myworkbooks/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/templateSpecs/*/read | Get or list template specs and template spec versions |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/ConfidentialWatchlists/* |  |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/query/ConfidentialWatchlist/* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Microsoft Sentinel Reader",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/8d289c81-5878-46d4-8554-54e1e3d8b5cb",
  "name": "8d289c81-5878-46d4-8554-54e1e3d8b5cb",
  "permissions": [
    {
      "actions": [
        "Microsoft.SecurityInsights/*/read",
        "Microsoft.SecurityInsights/dataConnectorsCheckRequirements/action",
        "Microsoft.SecurityInsights/threatIntelligence/indicators/query/action",
        "Microsoft.SecurityInsights/threatIntelligence/queryIndicators/action",
        "Microsoft.OperationalInsights/workspaces/analytics/query/action",
        "Microsoft.OperationalInsights/workspaces/*/read",
        "Microsoft.OperationalInsights/workspaces/LinkedServices/read",
        "Microsoft.OperationalInsights/workspaces/savedSearches/read",
        "Microsoft.OperationsManagement/solutions/read",
        "Microsoft.OperationalInsights/workspaces/query/read",
        "Microsoft.OperationalInsights/workspaces/query/*/read",
        "Microsoft.OperationalInsights/querypacks/*/read",
        "Microsoft.OperationalInsights/workspaces/dataSources/read",
        "Microsoft.Insights/workbooks/read",
        "Microsoft.Insights/myworkbooks/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/templateSpecs/*/read",
        "Microsoft.Support/*"
      ],
      "notActions": [
        "Microsoft.SecurityInsights/ConfidentialWatchlists/*",
        "Microsoft.OperationalInsights/workspaces/query/ConfidentialWatchlist/*"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Microsoft Sentinel Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Microsoft Sentinel Responder

Microsoft Sentinel Responder

[Learn more](/azure/sentinel/roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/*/read |  |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/dataConnectorsCheckRequirements/action | Check user authorization and license |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/automationRules/* |  |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/cases/* |  |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/incidents/* |  |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/entities/runPlaybook/action | Run playbook on entity |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/threatIntelligence/indicators/appendTags/action | Append tags to Threat Intelligence Indicator |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/threatIntelligence/indicators/query/action | Query Threat Intelligence Indicators |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/threatIntelligence/bulkTag/action | Bulk Tags Threat Intelligence |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/threatIntelligence/indicators/appendTags/action | Append tags to Threat Intelligence Indicator |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/threatIntelligence/indicators/replaceTags/action | Replace Tags of Threat Intelligence Indicator |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/threatIntelligence/queryIndicators/action | Query Threat Intelligence Indicators |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/businessApplicationAgents/systems/undoAction/action | Undoes an action |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/analytics/query/action | Search using new engine. |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/*/read | View log analytics data |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/dataSources/read | Get data source under a workspace. |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/savedSearches/read | Gets a saved search query. |
> | [Microsoft.OperationsManagement](../permissions/monitor.md#microsoftoperationsmanagement)/solutions/read | Get existing OMS solution |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/query/read | Run queries over the data in the workspace |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/query/*/read |  |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/dataSources/read | Get data source under a workspace. |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/querypacks/*/read |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/workbooks/read | Read a workbook |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/myworkbooks/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/cases/*/Delete |  |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/incidents/*/Delete |  |
> | [Microsoft.SecurityInsights](../permissions/security.md#microsoftsecurityinsights)/ConfidentialWatchlists/* |  |
> | [Microsoft.OperationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/query/ConfidentialWatchlist/* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Microsoft Sentinel Responder",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/3e150937-b8fe-4cfb-8069-0eaf05ecd056",
  "name": "3e150937-b8fe-4cfb-8069-0eaf05ecd056",
  "permissions": [
    {
      "actions": [
        "Microsoft.SecurityInsights/*/read",
        "Microsoft.SecurityInsights/dataConnectorsCheckRequirements/action",
        "Microsoft.SecurityInsights/automationRules/*",
        "Microsoft.SecurityInsights/cases/*",
        "Microsoft.SecurityInsights/incidents/*",
        "Microsoft.SecurityInsights/entities/runPlaybook/action",
        "Microsoft.SecurityInsights/threatIntelligence/indicators/appendTags/action",
        "Microsoft.SecurityInsights/threatIntelligence/indicators/query/action",
        "Microsoft.SecurityInsights/threatIntelligence/bulkTag/action",
        "Microsoft.SecurityInsights/threatIntelligence/indicators/appendTags/action",
        "Microsoft.SecurityInsights/threatIntelligence/indicators/replaceTags/action",
        "Microsoft.SecurityInsights/threatIntelligence/queryIndicators/action",
        "Microsoft.SecurityInsights/businessApplicationAgents/systems/undoAction/action",
        "Microsoft.OperationalInsights/workspaces/analytics/query/action",
        "Microsoft.OperationalInsights/workspaces/*/read",
        "Microsoft.OperationalInsights/workspaces/dataSources/read",
        "Microsoft.OperationalInsights/workspaces/savedSearches/read",
        "Microsoft.OperationsManagement/solutions/read",
        "Microsoft.OperationalInsights/workspaces/query/read",
        "Microsoft.OperationalInsights/workspaces/query/*/read",
        "Microsoft.OperationalInsights/workspaces/dataSources/read",
        "Microsoft.OperationalInsights/querypacks/*/read",
        "Microsoft.Insights/workbooks/read",
        "Microsoft.Insights/myworkbooks/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [
        "Microsoft.SecurityInsights/cases/*/Delete",
        "Microsoft.SecurityInsights/incidents/*/Delete",
        "Microsoft.SecurityInsights/ConfidentialWatchlists/*",
        "Microsoft.OperationalInsights/workspaces/query/ConfidentialWatchlist/*"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Microsoft Sentinel Responder",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Security Admin

View and update permissions for Microsoft Defender for Cloud. Same permissions as the Security Reader role and can also update the security policy and dismiss alerts and recommendations.<br><br>For Microsoft Defender for IoT, see [Azure user roles for OT and Enterprise IoT monitoring](/azure/defender-for-iot/organizations/roles-azure).

[Learn more](/azure/defender-for-cloud/permissions)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/policyAssignments/* | Create and manage policy assignments |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/policyDefinitions/* | Create and manage policy definitions |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/policyExemptions/* | Create and manage policy exemptions |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/policySetDefinitions/* | Create and manage policy sets |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/read | List management groups for the authenticated user. |
> | [Microsoft.operationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/*/read | View log analytics data |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Security](../permissions/security.md#microsoftsecurity)/* | Create and manage security components and policies |
> | [Microsoft.IoTSecurity](../permissions/internet-of-things.md#microsoftiotsecurity)/* |  |
> | [Microsoft.IoTFirmwareDefense](../permissions/internet-of-things.md#microsoftiotfirmwaredefense)/* |  |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Security Admin Role",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/fb1c8493-542b-48eb-b624-b4c8fea62acd",
  "name": "fb1c8493-542b-48eb-b624-b4c8fea62acd",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Authorization/policyAssignments/*",
        "Microsoft.Authorization/policyDefinitions/*",
        "Microsoft.Authorization/policyExemptions/*",
        "Microsoft.Authorization/policySetDefinitions/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Management/managementGroups/read",
        "Microsoft.operationalInsights/workspaces/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Security/*",
        "Microsoft.IoTSecurity/*",
        "Microsoft.IoTFirmwareDefense/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Security Admin",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Security Assessment Contributor

Lets you push assessments to Microsoft Defender for Cloud

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Security](../permissions/security.md#microsoftsecurity)/assessments/write | Create or update security assessments on your subscription |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you push assessments to Security Center",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/612c2aa1-cb24-443b-ac28-3ab7272de6f5",
  "name": "612c2aa1-cb24-443b-ac28-3ab7272de6f5",
  "permissions": [
    {
      "actions": [
        "Microsoft.Security/assessments/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Security Assessment Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Security Manager (Legacy)

This is a legacy role. Please use Security Admin instead.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.ClassicCompute](../permissions/compute.md#microsoftclassiccompute)/*/read | Read configuration information classic virtual machines |
> | [Microsoft.ClassicCompute](../permissions/compute.md#microsoftclassiccompute)/virtualMachines/*/write | Write configuration for classic virtual machines |
> | [Microsoft.ClassicNetwork](../permissions/networking.md#microsoftclassicnetwork)/*/read | Read configuration information about classic network |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Security](../permissions/security.md#microsoftsecurity)/* | Create and manage security components and policies |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "This is a legacy role. Please use Security Administrator instead",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/e3d13bf0-dd5a-482e-ba6b-9b8433878d10",
  "name": "e3d13bf0-dd5a-482e-ba6b-9b8433878d10",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.ClassicCompute/*/read",
        "Microsoft.ClassicCompute/virtualMachines/*/write",
        "Microsoft.ClassicNetwork/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Security/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Security Manager (Legacy)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Security Reader

View permissions for Microsoft Defender for Cloud. Can view recommendations, alerts, a security policy, and security states, but cannot make changes.<br><br>For Microsoft Defender for IoT, see [Azure user roles for OT and Enterprise IoT monitoring](/azure/defender-for-iot/organizations/roles-azure).

[Learn more](/azure/defender-for-cloud/permissions)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/read | Read a classic metric alert |
> | [Microsoft.operationalInsights](../permissions/monitor.md#microsoftoperationalinsights)/workspaces/*/read | View log analytics data |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/*/read |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Security](../permissions/security.md#microsoftsecurity)/*/read | Read security components and policies |
> | [Microsoft.IoTSecurity](../permissions/internet-of-things.md#microsoftiotsecurity)/*/read |  |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/*/read |  |
> | [Microsoft.Security](../permissions/security.md#microsoftsecurity)/iotDefenderSettings/packageDownloads/action | Gets downloadable IoT Defender packages information |
> | [Microsoft.Security](../permissions/security.md#microsoftsecurity)/iotDefenderSettings/downloadManagerActivation/action | Download manager activation file with subscription quota data |
> | [Microsoft.Security](../permissions/security.md#microsoftsecurity)/iotSensors/downloadResetPassword/action | Downloads reset password file for IoT Sensors |
> | [Microsoft.IoTSecurity](../permissions/internet-of-things.md#microsoftiotsecurity)/defenderSettings/packageDownloads/action | Gets downloadable IoT Defender packages information |
> | [Microsoft.IoTSecurity](../permissions/internet-of-things.md#microsoftiotsecurity)/defenderSettings/downloadManagerActivation/action | Download manager activation file |
> | [Microsoft.Management](../permissions/management-and-governance.md#microsoftmanagement)/managementGroups/read | List management groups for the authenticated user. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Security Reader Role",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/39bc4728-0917-49c7-9d2c-d95423bc2eb4",
  "name": "39bc4728-0917-49c7-9d2c-d95423bc2eb4",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/read",
        "Microsoft.operationalInsights/workspaces/*/read",
        "Microsoft.Resources/deployments/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Security/*/read",
        "Microsoft.IoTSecurity/*/read",
        "Microsoft.Support/*/read",
        "Microsoft.Security/iotDefenderSettings/packageDownloads/action",
        "Microsoft.Security/iotDefenderSettings/downloadManagerActivation/action",
        "Microsoft.Security/iotSensors/downloadResetPassword/action",
        "Microsoft.IoTSecurity/defenderSettings/packageDownloads/action",
        "Microsoft.IoTSecurity/defenderSettings/downloadManagerActivation/action",
        "Microsoft.Management/managementGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Security Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)