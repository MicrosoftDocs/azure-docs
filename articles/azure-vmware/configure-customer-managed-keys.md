---
title: Configure customer-managed key encryption at rest in Azure VMware Solution
description: Learn how to encrypt data in Azure VMware Solution with customer-managed keys using Azure Key Vault.
ms.topic: how-to 
ms.date: 12/17/2021

---

# Configure customer-managed key encryption at rest in Azure VMware Solution

## Overview

In this how-to, you'll learn how to encrypt data in Azure VMware Solution with [customer-managed keys (CMK)](/azure/storage/common/customer-managed-keys-overview) using Azure Key Vault. Customer-managed keys let you generate and manage encryption keys for your Azure VMware Solution private cloud. These keys are protected with a Key Encryption Key (KEK) and stored in your storage account. KEK is invoked with the region, subscription, key type, and operation requirements. The resource and Key Vault aren't required to be in the same subscription. 

When managing your own encryption keys, you can:

- Control access

- Centrally manage keys and the key lifecycle

- Revoke Azure from accessing the data

Every Azure VMware Solution private cloud has a unique managed service identity with Key Vault. For service authentication to Key Vault, Azure Service has a unique identity per resource instance. It allows you to isolate resources according to your internal security needs. 

When you create the Azure VMware Solution private cloud, you'll assign identity either with a user-assigned identity (UAI) or system-assigned identity (SAI) and KEK to your service instance. You can change an existing CMK configured with UAI to SAI or SAI to UAI.  When you delete an existing UAI, the resource identity is replaced with SAI automatically. For more information, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview).  


>[!NOTE]
>CMK with Azure VMware Solution is [FIPS compliant](/azure/compliance/offerings/offering-fips-140-2).

## Topology 

<!-- New content from Rahi to go here -->

:::image type="content" source="media/configure-customer-managed-keys/customer-managed-keys-topology-diagram.png" alt-text="Diagram showing the customer managed keys topology." border="false"lightbox="media/configure-customer-managed-keys/customer-managed-keys-topology-diagram.png":::


## Prerequisites

# [Portal](#tab/azure-portal)

1. Login to Azure portal.
1. Navigate to **Azure VMware Solution** and locate your SDDC.
    <!-- New image from Rahi to go here -->
1. Click **Identity**. 
1. In **System Assigned** check **Enable** and click **Save**.
    <!-- New image from Rahi to go here -->
    1. **System Assigned identity** should now be enabled.
1. To validate, click the **Overview** tab of SDDC.
    <!-- New image from Rahi to go here -->
1. Find **JSON View** in the upper right corner and select it.
1. In the **Resource JSON** window, use the **API version** drop down menu to find and select the appropriate API version.

# [Azure CLI](#tab/azure-cli)

Using the JSON file provided below, use the following command to enable MSI on existing SDDC.

`az deployment group create --name <deployment name> --resource-group <RG Name> --template-file ./filename.json`

    ```json   
    {
            "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "variables": {
                    "name": "SDDC Name",
                    "location": "eastasia",
                    "sku": "av36"
            },
            "resources": [{
                    "type": "Microsoft.AVS/privateClouds",
                    "apiVersion": "2021-12-01",
                    "name": "[variables('name')]",
                    "location": "[variables('location')]",
                    "sku": {
                            "name": "[variables('sku')]"
                    },
                    "properties": {
                            "managementCluster": {
                                    "clusterSize": <Number of hosts in a Cluster>
                            },
                            "internet": "enabled"
                            },
    		"identity": {
    			"type": "SystemAssigned"
    			}
    
                    }]
    
    }
    ```

# [Template](#tab/azure-resource-manager)

Below is the JSON file used to create an Azure Resource Manager (ARM) template and enable MSI on pre-existing SDDC or while deploying a new SDDC.

```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "apiVersion": {
                "type": "String",
                "metadata": {
                    "description": "Must be 2021-12-01"
                }
            },
            "name": {
                "type": "String",
                "metadata": {
                    "description": "Name of the SDDC"
                }
            },
            "location": {
                "type": "String",
                "metadata": {
                    "description": "Region of SDDC"
                }
            },
            "sku": {
                "type": "String",
                "metadata": {
                    "description": "SKU value of the SDDC"
                }
            },
            "hosts": {
                "type": "Int",
                "metadata": {
                    "description": "Number of hosts in the management cluster"
                }
            },
            "networkBlock": {
                "type": "String"
            },
    
            "internet": {
                "type": "String",
                "allowedValues": [
                    "enabled",
                    "disabled"
                ],
                "metadata": {
                    "description": "Internet status"
                }
            },
            "identityType": {
                "type": "String",
                "allowedValues": [
                    "SystemAssigned",
                    "None"
                ]
            }
        },
        "resources": [{
            "type": "Microsoft.AVS/privateClouds",
            "apiVersion": "[parameters('apiVersion')]",
            "name": "[parameters('name')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "[parameters('sku')]"
            },
            "properties": {
                "managementCluster": {
                    "clusterSize": "[parameters('hosts')]"
                },
                "internet": "[parameters('internet')]",
                "networkBlock": "[parameters('networkBlock')]"
            },
            "identity": {
                "type": "[parameters('identityType')]"
            }
        }]
    }
     
```
---

## Azure VMware Solution CMK workflow

You can set new key encryptions at any time without service interruption, including Microsoft KEK to customer KEK or from customer KEK to Microsoft KEK. The existing data doesn't get re-encrypted. Instead, a shallow rekey and re-encryption is done to KEKs, and then the data is tagged with the customer-managed key version. Don't delete old keys because they're needed to read data. 

:::image type="content" source="media/configure-customer-managed-keys/customer-managed-keys-generation-flow.png" alt-text="Diagram showing the customer managed keys workflow." border="false"lightbox="media/configure-customer-managed-keys/customer-managed-keys-generation-flow.png":::

If a shallow rekey gets initiated from vCenter, the old keys aren't useful. Key Management Interoperability Protocol (KMIP) doesn't have control over which keys vCenter wants to use. If vCenter asks to delete keys, KMIP proxy deletes them. You can keep a record of old keys if that's a compliance requirement. Key Vault doesn't support KMIP, and vCenter doesn't support the Key Vault REST interface. For this reason, a proxy service is in place that enables translation between the two.

Expired KEKs can still be used for rotation flow as the previous key. They unwrap the old data encryption keys so a new encryption key can wrap them. Version checks are done regularly to ensure that Azure VMware Solution always wraps the keys with the latest version. 

>[!IMPORTANT]
>After encrypting CMKs, only new data gets encrypted while all previous data stays encrypted with Microsoft-managed keys (MMKs).

## Set up CMK with system-assigned identity 

System-assigned identity is restricted to one per resource and is tied to the lifecycle of the resource.  You can grant permissions to the managed identity by using Azure Role-based Access Control (RBAC). The managed identity is authenticated with Azure AD, so you don't have to store any credentials in code.

>[!IMPORTANT]
> Ensure that Key Vault is in the same region as the Azure VMware Solution private cloud.

# [Portal](#tab/azure-portal)

Navigate to your **Azure Key vault** and provide access to the SDDC on Azure Key vault using the Principal ID captured in the **Enble MSI** tab. Provide permissions

1. From your Azure VMware Solution private cloud, under **Manage**, select **Encryption** and then **Customer-managed keys (CMK)**.

<!--    :::image type="content" source="media/configure-customer-managed-key-encryption-at-rest/set-up-customer-managed-keys1.png" alt-text="Screenshot of the encryption type for customer-managed keys.":::  -->   

1. Select the encryption type and then the **Select key vault and key** option.
   
<!--    :::image type="content" source="media/configure-customer-managed-key-encryption-at-rest/set-up-customer-managed-keys2.png" alt-text="Screenshot of the key and key vault selection."::: -->

1. Select the key vault and key from the dropdowns and then select **Select**.  

<!--    :::image type="content" source="media/configure-customer-managed-key-encryption-at-rest/set-up-customer-managed-keys3.png" alt-text="Screenshot of the key and key vault drop-downs.":::   -->  

1. Select **Manage resource identity**.

<!--    :::image type="content" source="media/configure-customer-managed-key-encryption-at-rest/set-up-customer-managed-keys4.png" alt-text="Screenshot of the Manage resource identity option.":::     --> 

1. Select the **System assigned** tab under Identity.

<!--    :::image type="content" source="media/configure-customer-managed-key-encryption-at-rest/enable-system-assigned-identity1.png" alt-text="Screenshot of the System-assigned identity tab toggled off.":::  -->   

1. Toggle the Status to **On** and then select **Save**.

<!--    :::image type="content" source="media/configure-customer-managed-key-encryption-at-rest/enable-system-assigned-identity2.png" alt-text="Screenshot of the System-assigned identity tab toggled on.":::   -->  

1. When prompted, select **Enable**.

<!--    :::image type="content" source="media/configure-customer-managed-key-encryption-at-rest/enable-system-assigned-identity3.png" alt-text="Screenshot of the Enable system-assigned managed identity window to enable SAI.":::     -->

1. Select **Save** to grant access to the resource. 

<!--    :::image type="content" source="media/configure-customer-managed-key-encryption-at-rest/enable-system-assigned-identity4.png" alt-text="Screenshot of the System-assigned identity enabled."::: -->


# [Azure CLI](#tab/azure-cli)

Below is the command used to enable CMK on SDDC using the JSON file provided.

`az deployment group create --name <deployment name> --resource-group <RG Name> --template-file ./filename.json`

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {
            "name": "<SDDC Name>",
            "location": "<Location of SDDC>",
            "sku": "av36"
    },
    "resources": [{
            "type": "Microsoft.AVS/privateClouds",
            "apiVersion": "2021-12-01",
            "name": "[variables('name')]",
            "location": "[variables('location')]",
            "sku": {
                    "name": "[variables('sku')]"
            },
            "properties": {
                    "managementCluster": {
                            "clusterSize": <Size of Cluster>
                    },
                    "internet": "enabled",
                    "encryption": {
                            "status": "enabled",
            "keyVaultProperties": {
                                    "keyVaultUrl": "<KeyVault URl>",
                                    "keyName": "<Key Name>",
                                    "keyVersion": ""
                            }
                            }
                    }

            }]

}

```
# [Template](#tab/azure-resource-manager)

Below is the JSON file used to create an ARM template and enable CMK on SDDC.

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {
		"apiVersion": {
			"type": "String",
			"metadata": {
				"description": "Must be 2021-12-01"
			}
		},
		"name": {
			"type": "String",
			"metadata": {
				"description": "Name of the SDDC"
			}
		},
		"location": {
			"type": "String",
			"metadata": {
				"description": "Location of the SDDC"
			}
		},
		"sku": {
			"type": "String",
			"metadata": {
				"description": "SKU value of the SDDC"
			}
		},
		"clusterSize": {
			"type": "int",
			"metadata": {
				"description": "Number of hosts in management cluster"
			}
		},
		"internet": {
			"type": "String",
			"allowedValues": [
				"enabled",
				"disabled"
			],
			"metadata": {
				"description": "Internet status"
			}
		},
		"status": {
			"type": "String",
			"allowedValues": [
				"enabled",
				"disabled"
			],
			"metadata": {
				"description": "Specifying whether need to perform enable cmk or disable cmk"
			}
		},
		"keyVaultUrl": {
			"type": "String",
			"metadata": {
				"description": "Key vault url to be used for Customer Managed Key"
			}
		},
		"keyName": {
			"type": "String",
			"metadata": {
				"description": "Name of the Customer Managed Key"
			}
		},
		"keyVersion": {
			"type": "String",
			"metadata": {
				"description": "Version of the Customer Managed Key"
			}
		}
	},
	"resources": [{
		"type": "Microsoft.AVS/privateClouds",
		"apiVersion": "[parameters('apiVersion')]",
		"name": "[parameters('name')]",
		"location": "[parameters('location')]",
		"sku": {
			"name": "[parameters('sku')]"
		},
		"properties": {
			"managementCluster": {
				"clusterSize": "[parameters('clusterSize')]"
			},
			"internet": "[parameters('internet')]",
			"encryption": {
				"status": "[parameters('status')]",
				"keyVaultProperties": {
					"keyVaultUrl": "[parameters('keyVaultUrl')]",
					"keyName": "[parameters('keyName')]",
					"keyVersion": "[parameters('keyVersion')]"
				}
			}
		}
	}]
}
```
---

## Change from CMK to MMK and back to CMK 

intro paragraph here --> what are they doing and why

1. From your Azure VMware Solution private cloud, under **Manage**, select **Encryption**.

2. Select **Microsoft-managed keys (MMK)**.

<!--    :::image type="content" source="media/configure-customer-managed-key-encryption-at-rest/change-customer-managed-keys-to-microsoft-managed-keys1.png" alt-text="Screenshot of the Microsoft-managed keys option.":::   -->  

3. Select **Save**.

<!--    :::image type="content" source="media/configure-customer-managed-key-encryption-at-rest/change-customer-managed-keys-to-microsoft-managed-keys2.png" alt-text="Screenshot of the MMK option selected with the Save button in focus.":::    --> 

  
## Restore permission

## Errors  

Errors 403 and 404 occur when managed service identity doesn't have access to Key Vault. These errors occur when a user removes access policies within Key Vault or deletes Key Vault, DNS outages, networking issues, or Key Vault outages.  It results in the delay of update operations on vCenter. The approach is to shut down the hosts to avoid any malicious access to the data within an hour of the error.  Host maintenance and update operations, whether manual or automatic, won't work, but you can still access the private cloud. 

Regardless of the cause of the error, once resolved, access to the data is restored. No data is lost due to outages. The error gets resolved either by Microsoft fixing service outages or by you restoring a KEK or access to the Key Vault. For resiliency against such errors, Azure VMware Solution caches data encryption keys for as long as possible. You can write the data encryption keys to disks protected by a Microsoft key or a data protection API (DPAPI). But only if it continues to honor the one-hour window and is cleaned up afterward.

>[!TIP]
> You'll be notified if a key or access to the key is revoked. Once revoked, you can then define custom actions to take. If you lose access to your cached data encryption key, make the data inaccessible so you don't lose the data.

>[!TIP]
> You'll be notified if a key or access to the key is revoked. Once revoked, you can then define custom actions to take. If you lose access to your cached data encryption key, make the data inaccessible so you don't lose the data.

## Next steps