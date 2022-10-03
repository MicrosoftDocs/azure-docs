---
title: Configure customer-managed keys for Azure NetApp Files | Microsoft Docs
description: Describes how to configure customer-managed keys in Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 10/03/2022
ms.author: anfdocs
---

# Configure customer-managed keys for Azure NetApp Files

Customer-managed keys in Azure NetApp Files enable you to use your own keys rather than a Microsoft-managed key when creating a new volume. 

## Considerations

> [!IMPORTANT]
> The customer-manged keys feature is currently in preview. The program is controlled via Azure Feature Exposure Control (AFEC). To access this preview program, contact your account team.

* Customer-managed keys can only be configured on new volumes. You cannot migrate existing volumes to customer-managed key encryption. 
* To create a volume using customer-managed keys, you must select the *Standard* network features. Customer-managed key volumes are not supported for the Basic network features. Follow instructions in [Configure network features for a volume to](configure-network-features.md):  
    * [Register for the standard network features](configure-network-features.md#register-the-feature).
    * [Set the Network Features option](configure-network-features.md#set-the-network-features-option) in the volume creation page.
* Rekey operation is currently not supported.
* Switching from user-assigned identity to the system-assigned identity is currently not supported.
* MSI Automatic certificate renewal is not currently supported.  
* The MSI certificate has a lifetime of 90 days. It will be eligible for renewal after 46 days. **After 90 days, the certificate will no longer be valid and the customer-managed key volumes under the NetApp account will go offline.**
    * To renew, you need to call the NetApp account operation `renewCredentials` if eligible for renewal. If it is not eligible, you will get an error message stating when the account will be eligible for renewal. 
   *  You will need to call the operation via ARM REST API. Submit a POST request to `/subscriptions/<16 digit subscription ID>/resourceGroups/<resource_group_name>/providers/Microsoft.NetApp/netAppAccounts/<account name>/renewCredentials?api-version=2022-04`.
    This operation is available with the Azure CLI, PowerShell, and SDK beginning with the `2022-05` versions.
    * If the certificate is more than 46 days old, you can call proxy Azure Resource Manager (ARM) operation via REST API to renew the certificate. For example: 
        ```rest
         /{accountResourceId}/renewCredentials?api-version=2022-01 – example /subscriptions/<16 digit subscription ID>/resourceGroups/<resource group name>/providers/Microsoft.NetApp/netAppAccounts/<account name>/renewCredentials?api-version=2022-01  
        ```  
* Applying Azure network security groups on the private link subnet to Azure Key Vault is not supported for Azure NetApp Files customer-managed keys. Network security groups does not affect connectivity to Private Link unless `Private endpoint network policy` is enabled on the subnet. It is recommended to keep this option disabled. 
* If Azure NetApp Files fails to create a customer-managed key volume, error messages are displayed. Refer to the [Error messages and troubleshooting](#error-messages-and-troubleshooting) section for more information. 

## Requirements
Before creating your first customer-managed key volume, you must have set up: 
* An [Azure Key Vault](../key-vault/general/overview.md), containing at least one key. 
    * The key vault must have soft delete and purge protection enabled. 
    * The key must be of type RSA. 
* The key vault must have an [Azure Private Endpoint](../private-link/private-endpoint-overview.md).
    * The private endpoint must reside in a different subnet than the one delegated to Azure NetApp Files. The subnet must be in the same VNet as the one delegated to Azure NetApp.  

For more information about Azure Key Vault and Azure Private Endpoint, refer to:
* [Quickstart: Create a key vault ](../key-vault/general/quick-create-portal.md) 
* [Create or import a key into the vault](../key-vault/keys/quick-create-portal.md)
* [Create a private endpoint](../private-link/create-private-endpoint-portal.md)
* [More about keys and supported key types](../key-vault/keys/about-keys.md)
* [Network security groups](../virtual-network/network-security-groups-overview.md)
* [Manage network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md)

## Configure a NetApp account to use customer-managed keys

1. In the Azure portal and under Azure NetApp Files, select **Encryption**.

    The **Encryption** page enables you to manage encryption settings for your NetApp account. It includes an option to let you set your NetApp account to use your own encryption key, which is stored in [Azure Key Vault](../key-vault/general/basic-concepts.md). This setting provides a system-assigned identity to the NetApp account, and it adds an access policy for the identity with the required key permissions.

    :::image type="content" source="../media/azure-netapp-files/encryption-menu.png" alt-text="Screenshot of the encryption menu." lightbox="../media/azure-netapp-files/encryption-menu.png":::

1. When you set your NetApp account to use customer-managed key, you have two ways to specify the Key URI:  
    * The **Select from key vault** option allows you to select a key vault and a key. 
    :::image type="content" source="../media/azure-netapp-files/select-key.png" alt-text="Screenshot of the select a key interface." lightbox="../media/azure-netapp-files/select-key.png":::
    
    * The **Enter key URI** option allows you to enter manually the key URI. 
    :::image type="content" source="../media/azure-netapp-files/key-enter-uri.png" alt-text="Screenshot of the encryption menu showing key URI field." lightbox="../media/azure-netapp-files/key-enter-uri.png":::

## Configure a NetApp account to use customer-managed keys with user-assigned identity 

The **Encryption** page doesn't currently support choosing an identity type (either system-assigned or user-assigned). To configure encryption with the user-assigned identity, you need to use the REST API to do so. A good tool to use Azure REST API is [projectkudu/ARMClient: A simple command line tool to invoke the Azure Resource Manager API (github.com)](https://github.com/projectkudu/ARMClient). 

1. Create a user-assigned identity in the same region as your NetApp account. Alternately, you can use an existing identity. 
    For more information, see [Manage user-assigned managed identities](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).
1. Configure access to the key vault. You can use role-based access control or access policies. 
    1. For role-based access control, configure the key vault to use role-based access control authorization.
    :::image type="content" source="../media/azure-netapp-files/azure-role-based-access.png" alt-text="Screenshot of the access policies menu." lightbox="../media/azure-netapp-files/azure-role-based-access.png":::
    Create a custom role with permissions **Read**, **Encrypt**, and **Decrypt**. 
    :::image type="content" source="../media/azure-netapp-files/netapp-account-json.png" alt-text="Screenshot of an example JSON configuration." lightbox="../media/azure-netapp-files/netapp-account-json.png":::
    Add an assignment for the user-assigned identity for the custom role on the key vault. Alternatively, you can use the built-in role `key vault crypto user`, but this role includes more permissions than are necessary.
    1. Add an access policy for the user-assigned identity on the key vault. 
    :::image type="content" source="../media/azure-netapp-files/add-access-policy.png" alt-text="Screenshot of the access policies menu with the vault access permission model." lightbox="../media/azure-netapp-files/add-access-policy.png":::
    Select the permissions **Get**, **Encrypt**, and **Decrypt**. 
    :::image type="content" source="../media/azure-netapp-files/access-policy-get-encrypt-decrypt.png" alt-text="Screenshot of a drop-down menu with get, encrypt, and decrypt options selected." lightbox="../media/azure-netapp-files/access-policy-get-encrypt-decrypt.png":::
    Select the user-assigned identity under **Select principal**. Leave **Authorized application** blank. 
    :::image type="content" source="../media/azure-netapp-files/access-policy-confirm.png" alt-text="Screenshot of the add access policy menu. Authorized application field is blank." lightbox="../media/azure-netapp-files/access-policy-confirm.png":::
1. Send a PATCH request via the REST API to the NetApp account `/{accountResourceId}?api-version=2022-03` with the following request body:
    Take note of the `Azure-AsyncOperation` header in the response. That URL can be polled to get the result of the asynchronous patch operation. 
    ```rest
    { 
      "identity": { 
        "type": "UserAssigned", 
        "userAssignedIdentities": { 
          "<User assigned identity resource id>": {} 
        } 
      }, 
      "properties": { 
        "encryption": { 
          "keySource": "Microsoft.KeyVault", 
          "keyVaultProperties": { 
            "keyVaultUri": “<key vault uri>”, 
            "keyName": "<key name>", 
            "keyVaultResourceId": "<key vault resource id>" 
          }, 
          "identity": { 
            "userAssignedIdentity": "<user assigned identity resource id>" 
          } 
        } 
      } 
    } 
    ```
    **Examples** 
    
    User assigned identity resource ID: `/subscriptions/<subscription-id>/resourcegroups/contoso--westcentralus/providers/Microsoft.ManagedIdentity/userAssignedIdentities/contoso-wcu-identity` 
    
    Key vault URI: `https://contoso-wcu2.vault.azure.net `
    
    Key name: `/subscriptions/<subscription-id>/resourceGroups/contoso-westcentralus/providers/Microsoft.KeyVault/vaults/contoso-wcu2`

## Use ARM processor REST API with ARMClient 

ARMClient is an open-source tool that makes on-demand requests to ARM processor REST API convenient. Follow the readme document to install and sign into the tool: [projectkudu/ARMClient: A simple command line tool to invoke the Azure Resource Manager API (github.com)](https://github.com/projectkudu/ARMClient).

If you're using ARMClient, save the request body in a JSON file for reference. Be sure to use the `–verbose` flag. 

Example: `armclient patch <netapp account resource id>?api-version=2022-03-01 ./<path to json file> -verbose` 

Copy the `Azure-AsyncOperation` header from the response and poll the URI using `armclient get <Azure-AsyncOperation value>`. 


```bash
---------- RESPONSE (6363ms) ----------
HTTP/1.1 202 Accepted
Content-Length: 848
Content-Type: application/json; charset=utf-8
Expires: -1
Pragma: no-cache
x-ms-request-id: <request ID>
Azure-AsyncOperation: https://management.azure.com/subscriptions/<subscriptionID>/providers/Microsoft.NetApp/locations/westcentralus/operationResults/<operationResultId>?api-version=2022-03-01
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: <correlation-request-id>
x-ms-routing-request-id: LOCATION:TIMESTAMP:<routing-request-id>
Strict-Transport-Security: max-age=315360000; includeSubDuomains
X-Content-Type-Options: noniff
Cache-Control: no-cache
Date: Mon, 16 May 2022 13:59:09 GMT
ETag: W/"datetime"2022-05-16-T13%3A59%3A10.1633
Location: https://management.azure.com/subscriptions/<subscriptionID>/providers/Microsoft.NetApp/locations/westcentralus/operationResults/<operationResultsID>?api-version=2022-03-01
Server: Microsoft-IIS/10.0
X-Powered-By: ASP.NET
```

```azurecli
armclient get https://management.azure.com/subscriptions/<subscriptionID>/providers/Microsoft.NetApp/locations/westcentralus/operationResults/<operationResultsID>?api-version=2022-03-01
```

```json
{
"id": "/subscriptions/<subscriptionID>/providres/Microsoft.NetApp/locations/<region>/operationResults/<operationResultsID>",
"name": "<operationResultsID>",
"status": "Succeeded",
"startTime": "2022-05-16T13:59:10.1809382Z",
"endTime": "2022-05-16T13:59:13.638715Z",
"percentComplete": 100.0,
"properties": {
	"resourceName": "/subscriptions/<subscriptionID>/resourceGroups/<userID>-rotterdam-<region>/providers/Microsoft.NetApp/netAppAccounts/<account>"
	}
}
```

## Create an Azure NetApp Files volume using customer-manager keys

1. From Azure NetApp Files, select **Volumes** and then **+ Add volume**.    
1. Follow the instructions in [Configure network features for an Azure NetApp Files volume](configure-network-features.md) to:  
    * [Register for the Standard network features](configure-network-features.md#register-the-feature)
    * [Set the Network Features option in volume creation page](configure-network-features.md#set-the-network-features-option)
1. For a NetApp account configured to use a customer-managed key, the Create Volume page includes an option Encryption Key Source.  
 
    To encrypt the volume with your key, select **Customer-Managed Key** in the **Encryption Key Source** dropdown menu.  
     
    When you create a volume using a customer-managed key, you must also select **Standard** for the **Network features** option. Basic network features are not supported. 

    :::image type="content" source="../media/azure-netapp-files/keys-create-volume.png" alt-text="Screenshot of create volume menu." lightbox="../media/azure-netapp-files/keys-create-volume.png":::

1. Continue to complete the volume creation process. See: 
    * [Create an NFS volume](azure-netapp-files-create-volumes.md)
    * [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
    * [Create a dual-protocol volume](create-volumes-dual-protocol.md)

## Error messages and troubleshooting

This section lists error messages and possible resolutions when Azure NetApp Files fails to configure customer-managed key encryption or create a volume using a customer-managed key. 

### Errors configuring customer-managed key encryption on a NetApp account 

| Error Condition | Resolution |
| ----------- | ----------- |
| `The operation failed because the specified key vault key was not found` | When entering key URI manually, ensure that the URI is correct. |
| `Azure Key Vault key is not a valid RSA key` | Ensure that the selected key is of type RSA. |
| `Azure Key Vault key is not enabled` | Ensure that the selected key is enabled. |
| `Azure Key Vault key is expired` | Ensure that the selected key is not expired. |
| `Azure Key Vault key has not been activated` | Ensure that the selected key is active. |
| `Key Vault URI is invalid` | When entering key URI manually, ensure that the URI is correct. | 
| `Azure Key Vault is not recoverable. Make sure that Soft-delete and Purge protection are both enabled on the Azure Key Vault` | Update the key vault recovery level to: <br> `“Recoverable/Recoverable+ProtectedSubscription/CustomizedRecoverable/CustomizedRecoverable+ProtectedSubscription”` |

### Errors creating a volume encrypted with customer-managed keys  

| Error Condition | Resolution |
| ----------- | ----------- |
| `Volume cannot be encrypted with Microsoft.KeyVault, NetAppAccount has not been configured with KeyVault encryption` | Your NetApp account does not have customer-managed key encryption enabled. Configure the NetApp account to use customer-managed key. |
| `EncryptionKeySource cannot be changed` | No resolution. The `EncryptionKeySource` property of a volume cannot be changed. |
| `Unable to use the configured encryption key, please check if key is active` | Check that: <ol><li>Are all access policies correct on the key vault: Get, Encrypt, Decrypt?</li><li>Does a private endpoint for the key vault exist?</li><li>Is there a Virtual Network NAT in the VNet, with the delegated Azure NetApp Files subnet enabled?</li></ol> |

## Next steps

* [Azure NetApp Files API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/netapp/resource-manager/Microsoft.NetApp/stable/2019-11-01)
