---
title: Configure your own key for encrypting Azure Event Hubs data at rest 
description: This article provides information on how to configure your own key for encrypting Azure Event Hubs data rest. 
ms.topic: conceptual
ms.date: 02/01/2021
---

# Configure customer-managed keys for encrypting Azure Event Hubs data at rest by using the Azure portal
Azure Event Hubs provides encryption of data at rest with Azure Storage Service Encryption (Azure SSE). The Event Hubs service uses Azure Storage to store the data. All the data that's stored with Azure Storage is encrypted using Microsoft-managed keys. If you use your own key (also referred to as Bring Your Own Key (BYOK) or customer-managed key), the data is still encrypted using the Microsoft-managed key, but in addition the Microsoft-managed key will be encrypted using the customer-managed key. This feature enables you to create, rotate, disable, and revoke access to customer-managed keys that are used for encrypting Microsoft-managed keys. Enabling the BYOK feature is a one time setup process on your namespace.

> [!NOTE]
> - The BYOK capability is supported by [Event Hubs dedicated single-tenant](event-hubs-dedicated-overview.md) clusters. It can't be enabled for standard Event Hubs namespaces.
> - The encryption can be enabled only for new or empty namespaces. If the namespace contains event hubs, the encryption operation will fail.

You can use Azure Key Vault to manage your keys and audit your key usage. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. For more information about Azure Key Vault, see [What is Azure Key Vault?](../key-vault/general/overview.md)

This article shows how to configure a key vault with customer-managed keys by using the Azure portal. To learn how to create a key vault using the Azure portal, see [Quickstart: Create an Azure Key Vault using the Azure portal](../key-vault/general/quick-create-portal.md).

> [!IMPORTANT]
> Using customer-managed keys with Azure Event Hubs requires that the key vault have two required properties configured. They are:  **Soft Delete** and **Do Not Purge**. These properties are enabled by default when you create a new key vault in the Azure portal. However, if you need to enable these properties on an existing key vault, you must use either PowerShell or Azure CLI.

## Enable customer-managed keys
To enable customer-managed keys in the Azure portal, follow these steps:

1. Navigate to your Event Hubs Dedicated cluster.
1. Select the namespace on which you want to enable BYOK.
1. On the **Settings** page of your Event Hubs namespace, select **Encryption**. 
1. Select the **Customer-managed key encryption at rest** as shown in the following image. 

    ![Enable customer managed key](./media/configure-customer-managed-key/enable-customer-managed-key.png)

## Set up a key vault with keys
After you enable customer-managed keys, you need to associate the customer managed key with your Azure Event Hubs namespace. Event Hubs supports only Azure Key Vault. If you enable the **Encryption with customer-managed key** option in the previous section, you need to have the key imported into Azure Key Vault. Also, the keys must have **Soft Delete** and **Do Not Purge** configured for the key. These settings can be configured using [PowerShell](../key-vault/general/key-vault-recovery.md) or [CLI](../key-vault/general/key-vault-recovery.md).

1. To create a new key vault, follow the Azure Key Vault [Quickstart](../key-vault/general/overview.md). For more information about importing existing keys, see [About keys, secrets, and certificates](../key-vault/general/about-keys-secrets-certificates.md).
1. To turn on both soft delete and purge protection when creating a vault, use the [az keyvault create](/cli/azure/keyvault#az-keyvault-create) command.

    ```azurecli-interactive
    az keyvault create --name ContosoVault --resource-group ContosoRG --location westus --enable-soft-delete true --enable-purge-protection true
    ```    
1. To add purge protection to an existing vault (that already has soft delete enabled), use the [az keyvault update](/cli/azure/keyvault#az-keyvault-update) command.

    ```azurecli-interactive
    az keyvault update --name ContosoVault --resource-group ContosoRG --enable-purge-protection true
    ```
1. Create keys by following these steps:
    1. To create a new key, select **Generate/Import** from the **Keys** menu under **Settings**.
        
        ![Select Generate/Import button](./media/configure-customer-managed-key/select-generate-import.png)
    1. Set **Options** to **Generate** and give the key a name.

        ![Create a key](./media/configure-customer-managed-key/create-key.png) 
    1. You can now select this key to associate with the Event Hubs namespace for encrypting from the drop-down list. 

        ![Select key from key vault](./media/configure-customer-managed-key/select-key-from-key-vault.png)
    1. Fill in the details for the key and click **Select**. This will enable the encryption of the Microsoft-managed key with your key (customer-managed key). 


## Rotate your encryption keys
You can rotate your key in the key vault by using the Azure Key Vaults rotation mechanism. Activation and expiration dates can also be set to automate key rotation. The Event Hubs service will detect new key versions and start using them automatically.

## Revoke access to keys
Revoking access to the encryption keys won't purge the data from Event Hubs. However, the data can't be accessed from the Event Hubs namespace. You can revoke the encryption key through access policy or by deleting the key. Learn more about access policies and securing your key vault from [Secure access to a key vault](../key-vault/general/security-overview.md).

Once the encryption key is revoked, the Event Hubs service on the encrypted namespace will become inoperable. If the access to the key is enabled or the delete key is restored, Event Hubs service will pick the key so you can access the data from the encrypted Event Hubs namespace.

## Set up diagnostic logs 
Setting diagnostic logs for BYOK enabled namespaces gives you the required information about the operations. These logs can be enabled and later stream to an event hub or analyzed through log analytics or streamed to storage to perform customized analytics. To learn more about diagnostic logs, see [Overview of Azure Diagnostic logs](../azure-monitor/essentials/platform-logs-overview.md).

## Enable user logs
Follow these steps to enable logs for customer-managed keys.

1. In the Azure portal, navigate to the namespace that has BYOK enabled.
1. Select **Diagnostic settings** under **Monitoring**.

    ![Select diagnostic settings](./media/configure-customer-managed-key/select-diagnostic-settings.png)
1. Select **+Add diagnostic setting**. 

    ![Select add diagnostic setting](./media/configure-customer-managed-key/select-add-diagnostic-setting.png)
1. Provide a **name** and select where you want to stream the logs to.
1. Select **CustomerManagedKeyUserLogs** and **Save**. This action enables the logs for BYOK on the namespace.

    ![Select customer-managed key user logs option](./media/configure-customer-managed-key/select-customer-managed-key-user-logs.png)

## Log schema 
All logs are stored in JavaScript Object Notation (JSON) format. Each entry has string fields that use the format described in the following table. 

| Name | Description |
| ---- | ----------- | 
| TaskName | Description of the task that failed. |
| ActivityId | Internal ID that's used for tracking. |
| category | Defines the classification of the task. For example, if the key from your key vault is being disabled, then it would be an information category or if a key can't be unwrapped, it could fall under error. |
| resourceId | Azure Resource Manager resource ID |
| keyVault | Full name of key vault. |
| key | The key name that's used to encrypt the Event Hubs namespace. |
| version | The version of the key being used. |
| operation | The operation that's performed on the key in your key vault. For example, disable/enable the key, wrap, or unwrap |
| code | The code that's associated with the operation. Example: Error code, 404 means that key wasn't found. |
| message | Any error message associated with the operation |

Here's an example of the  log for a customer managed key:

```json
{
   "TaskName": "CustomerManagedKeyUserLog",
   "ActivityId": "11111111-1111-1111-1111-111111111111",
   "category": "error"
   "resourceId": "/SUBSCRIPTIONS/11111111-1111-1111-1111-11111111111/RESOURCEGROUPS/DEFAULT-EVENTHUB-CENTRALUS/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/FBETTATI-OPERA-EVENTHUB",
   "keyVault": "https://mykeyvault.vault-int.azure-int.net",
   "key": "mykey",
   "version": "1111111111111111111111111111111",
   "operation": "wrapKey",
   "code": "404",
   "message": "Key not found: ehbyok0/111111111111111111111111111111",
}



{
   "TaskName": "CustomerManagedKeyUserLog",
   "ActivityId": "11111111111111-1111-1111-1111111111111",
   "category": "info"
   "resourceId": "/SUBSCRIPTIONS/111111111-1111-1111-1111-11111111111/RESOURCEGROUPS/DEFAULT-EVENTHUB-CENTRALUS/PROVIDERS/MICROSOFT.EVENTHUB/NAMESPACES/FBETTATI-OPERA-EVENTHUB",
   "keyVault": "https://mykeyvault.vault-int.azure-int.net",
   "key": "mykey",
   "version": "111111111111111111111111111111",
   "operation": "disable" | "restore",
   "code": "",
   "message": "",
}
```

## Use Resource Manager template to enable encryption
This section shows how to do the following tasks using **Azure Resource Manager templates**. 

1. Create an **Event Hubs namespace** with a managed service identity.
2. Create a **key vault** and grant the service identity access to the key vault. 
3. Update the Event Hubs namespace with the key vault information (key/value). 


### Create an Event Hubs cluster and namespace with managed service identity
This section shows you how to create an Azure Event Hubs namespace with managed service identity by using an Azure Resource Manager template and PowerShell. 

1. Create an Azure Resource Manager template to create an Event Hubs namespace with a managed service identity. Name the file: **CreateEventHubClusterAndNamespace.json**: 

    ```json
    {
       "$schema":"https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
       "contentVersion":"1.0.0.0",
       "parameters":{
          "clusterName":{
             "type":"string",
             "metadata":{
                "description":"Name for the Event Hub cluster."
             }
          },
          "namespaceName":{
             "type":"string",
             "metadata":{
                "description":"Name for the Namespace to be created in cluster."
             }
          },
          "location":{
             "type":"string",
             "defaultValue":"[resourceGroup().location]",
             "metadata":{
                "description":"Specifies the Azure location for all resources."
             }
          }
       },
       "resources":[
          {
             "type":"Microsoft.EventHub/clusters",
             "apiVersion":"2018-01-01-preview",
             "name":"[parameters('clusterName')]",
             "location":"[parameters('location')]",
             "sku":{
                "name":"Dedicated",
                "capacity":1
             }
          },
          {
             "type":"Microsoft.EventHub/namespaces",
             "apiVersion":"2018-01-01-preview",
             "name":"[parameters('namespaceName')]",
             "location":"[parameters('location')]",
             "identity":{
                "type":"SystemAssigned"
             },
             "sku":{
                "name":"Standard",
                "tier":"Standard",
                "capacity":1
             },
             "properties":{
                "isAutoInflateEnabled":false,
                "maximumThroughputUnits":0,
                "clusterArmId":"[resourceId('Microsoft.EventHub/clusters', parameters('clusterName'))]"
             },
             "dependsOn":[
                "[resourceId('Microsoft.EventHub/clusters', parameters('clusterName'))]"
             ]
          }
       ],
       "outputs":{
          "EventHubNamespaceId":{
             "type":"string",
             "value":"[resourceId('Microsoft.EventHub/namespaces',parameters('namespaceName'))]"
          }
       }
    }
    ```
2. Create a template parameter file named: **CreateEventHubClusterAndNamespaceParams.json**. 

    > [!NOTE]
    > Replace the following values: 
    > - `<EventHubsClusterName>` - Name of your Event Hubs cluster    
    > - `<EventHubsNamespaceName>` - Name of your Event Hubs namespace
    > - `<Location>` - Location of your Event Hubs namespace

    ```json
    {
       "$schema":"https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
       "contentVersion":"1.0.0.0",
       "parameters":{
          "clusterName":{
             "value":"<EventHubsClusterName>"
          },
          "namespaceName":{
             "value":"<EventHubsNamespaceName>"
          },
          "location":{
             "value":"<Location>"
          }
       }
    }
    
    ```
3. Run the following PowerShell command to deploy the template to create an Event Hubs namespace. Then, retrieve the ID of the Event Hubs namespace to use it later. Replace `{MyRG}` with the name of the resource group before running the command.  

    ```powershell
    $outputs = New-AzResourceGroupDeployment -Name CreateEventHubClusterAndNamespace -ResourceGroupName {MyRG} -TemplateFile ./CreateEventHubClusterAndNamespace.json -TemplateParameterFile ./CreateEventHubClusterAndNamespaceParams.json

    $EventHubNamespaceId = $outputs.Outputs["eventHubNamespaceId"].value
    ```
 
### Grant Event Hubs namespace identity access to key vault

1. Run the following command to create a key vault with **purge protection** and **soft-delete** enabled. 

    ```powershell
    New-AzureRmKeyVault -Name {keyVaultName} -ResourceGroupName {RGName}  -Location {location} -EnableSoftDelete -EnablePurgeProtection    
    ```     
    
    (OR)    
    
    Run the following command to update an **existing key vault**. Specify values for resource group and key vault names before running the command. 
    
    ```powershell
    ($updatedKeyVault = Get-AzureRmResource -ResourceId (Get-AzureRmKeyVault -ResourceGroupName {RGName} -VaultName {keyVaultName}).ResourceId).Properties| Add-Member -MemberType "NoteProperty" -Name "enableSoftDelete" -Value "true"-Force | Add-Member -MemberType "NoteProperty" -Name "enablePurgeProtection" -Value "true" -Force
    ``` 
2. Set the key vault access policy so that the managed identity of the Event Hubs namespace can access key value in the key vault. Use the ID of the Event Hubs namespace from the previous section. 

    ```powershell
    $identity = (Get-AzureRmResource -ResourceId $EventHubNamespaceId -ExpandProperties).Identity
    
    Set-AzureRmKeyVaultAccessPolicy -VaultName {keyVaultName} -ResourceGroupName {RGName} -ObjectId $identity.PrincipalId -PermissionsToKeys get,wrapKey,unwrapKey,list
    ```

### Encrypt data in Event Hubs namespace with customer-managed key from key vault
You have done the following steps so far: 

1. Created a premium namespace with a managed identity.
2. Create a key vault and granted the managed identity access to the key vault. 

In this step, you will update the Event Hubs namespace with key vault information. 

1. Create a JSON file named **CreateEventHubClusterAndNamespace.json** with the following content: 

    ```json
    {
       "$schema":"https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
       "contentVersion":"1.0.0.0",
       "parameters":{
          "clusterName":{
             "type":"string",
             "metadata":{
                "description":"Name for the Event Hub cluster."
             }
          },
          "namespaceName":{
             "type":"string",
             "metadata":{
                "description":"Name for the Namespace to be created in cluster."
             }
          },
          "location":{
             "type":"string",
             "defaultValue":"[resourceGroup().location]",
             "metadata":{
                "description":"Specifies the Azure location for all resources."
             }
          },
          "keyVaultUri":{
             "type":"string",
             "metadata":{
                "description":"URI of the KeyVault."
             }
          },
          "keyName":{
             "type":"string",
             "metadata":{
                "description":"KeyName."
             }
          }
       },
       "resources":[
          {
             "type":"Microsoft.EventHub/namespaces",
             "apiVersion":"2018-01-01-preview",
             "name":"[parameters('namespaceName')]",
             "location":"[parameters('location')]",
             "identity":{
                "type":"SystemAssigned"
             },
             "sku":{
                "name":"Standard",
                "tier":"Standard",
                "capacity":1
             },
             "properties":{
                "isAutoInflateEnabled":false,
                "maximumThroughputUnits":0,
                "clusterArmId":"[resourceId('Microsoft.EventHub/clusters', parameters('clusterName'))]",
                "encryption":{
                   "keySource":"Microsoft.KeyVault",
                   "keyVaultProperties":[
                      {
                         "keyName":"[parameters('keyName')]",
                         "keyVaultUri":"[parameters('keyVaultUri')]"
                      }
                   ]
                }
             }
          }
       ]
    }
    ``` 

2. Create a template parameter file: **UpdateEventHubClusterAndNamespaceParams.json**. 

    > [!NOTE]
    > Replace the following values: 
    > - `<EventHubsClusterName>` - Name of your Event Hubs cluster.        
    > - `<EventHubsNamespaceName>` - Name of your Event Hubs namespace
    > - `<Location>` - Location of your Event Hubs namespace
    > - `<KeyVaultName>` - Name of your key vault
    > - `<KeyName>` - Name of the key in the key vault

    ```json
    {
       "$schema":"https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
       "contentVersion":"1.0.0.0",
       "parameters":{
          "clusterName":{
             "value":"<EventHubsClusterName>"
          },
          "namespaceName":{
             "value":"<EventHubsNamespaceName>"
          },
          "location":{
             "value":"<Location>"
          },
          "keyName":{
             "value":"<KeyName>"
          },
          "keyVaultUri":{
             "value":"https://<KeyVaultName>.vault.azure.net"
          }
       }
    }
    ```             
3. Run the following PowerShell command to deploy the Resource Manager template. Replace `{MyRG}` with the name of your resource group before running the command. 

    ```powershell
    New-AzResourceGroupDeployment -Name UpdateEventHubNamespaceWithEncryption -ResourceGroupName {MyRG} -TemplateFile ./UpdateEventHubClusterAndNamespace.json -TemplateParameterFile ./UpdateEventHubClusterAndNamespaceParams.json 
    ```

## Troubleshoot
As a best practice, always enable logs like shown in the previous section. It helps in tracking the activities when BYOK encryption is enabled. It also helps in scoping down the problems.

Following are the common errors codes to look for when BYOK encryption is enabled.

| Action | Error code |	Resulting state of data |
| ------ | ---------- | ----------------------- | 
| Remove wrap/unwrap permission from a key vault | 403 |	Inaccessible |
| Remove AAD role membership from an AAD principal that granted the wrap/unwrap permission | 403 |	Inaccessible |
| Delete an encryption key from the key vault | 404 | Inaccessible |
| Delete the key vault | 404 | Inaccessible (assumes soft-delete is enabled, which is a required setting.) |
| Changing the expiration period on the encryption key such that it's already expired | 403 |	Inaccessible  |
| Changing the NBF (not before) such that key encryption key isn't active | 403 | Inaccessible  |
| Selecting the **Allow MSFT Services** option for the key vault firewall or otherwise blocking network access to the key vault that has the encryption key | 403 | Inaccessible |
| Moving the key vault to a different tenant | 404 | Inaccessible |  
| Intermittent network issue or DNS/AAD/MSI outage |  | Accessible using cached data encryption key |

> [!IMPORTANT]
> To enable Geo-DR on a namespace that's using the BYOK encryption, the secondary namespace for pairing must be in a dedicated cluster and must have a system assigned managed identity enabled on it. To learn more, see [Managed Identities for Azure Resources](../active-directory/managed-identities-azure-resources/overview.md).

## Next steps
See the following articles:
- [Event Hubs overview](event-hubs-about.md)
- [Key Vault overview](../key-vault/general/overview.md)