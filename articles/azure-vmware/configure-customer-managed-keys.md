---
title: Configure customer-managed key encryption at rest in Azure VMware Solution
description: Learn how to encrypt data in Azure VMware Solution with customer-managed keys using Azure Key Vault.
ms.topic: how-to 
ms.date: 12/17/2021

---

# Configure customer-managed key encryption at rest in Azure VMware Solution

## Overview

In this article, you'll learn how to encrypt VMware vSAN Key Encryption Keys (KEK) with Customer Managed Keys (CMKs) handled by customer-owned Azure Key Vault. Each ESXi host that participates in the vSAN cluster uses randomly generated Disk Encryption Keys (DEKs) that ESXi uses to encrypt disk data at rest. vSAN encrypts all DEKs with a KEK provided by Azure VMware Solution KMS. When you enable CMK encryption on your Azure VMware Solution private cloud, Azure VMware Solution uses the CMK from your key vault to encrypt the vSAN KEKs. Azure VMware Solution private cloud and Key Vault don't need to be in the same subscription.

When managing your own encryption keys, you can do the following actions:

- Control Azure access to vSAN keys.
- Centrally manage and lifecycle CMK.
- Revoke Azure from accessing the KEK.

Customer managed keys (CMKs) feature supports, shown below by key type and key size.

- RSA: 2048, 3072, 4096
- RSA-HSM: 2048, 3072, 4096

## Topology 

<!-- New content from Rahi to go here -->

:::image type="content" source="media/configure-customer-managed-keys/customer-managed-keys-topology-diagram.png" alt-text="Diagram showing the customer managed keys topology." border="false" lightbox="media/configure-customer-managed-keys/customer-managed-keys-topology-diagram.png":::


## Prerequisites

Before you begin to enable customer-managed key (CMK) functionality, ensure the requirements listed below are met:

1. You'll need an Azure key vault to leverage CMK functionality. If you don't have an Azure key vault, you can create one using the [Quickstart: Create a key vault using the Azure portal](https://docs.microsoft.com/azure/key-vault/general/quick-create-portal) guide.
1. If you enabled restricted access to key vault, you'll need to allow Microsoft Trusted Services to bypass the Azure Key Vault firewall.
1. Enable system assigned Identity on your Azure VMware Solution private cloud if you didn't enable it during software-defined data center (SDDC) provisioning.

# [Portal](#tab/azure-portal)

1. Log into Azure portal.
1. Navigate to **Azure VMware Solution** and locate your SDDC.
1. From the left navigation, open **Manage** and select **Identity**. 
1. In **System Assigned** check **Enable** and click **Save**.
    1. **System Assigned identity** should now be enabled.
1. To validate, select the **Overview** tab of SDDC.
    <!-- New image from Rahi to go here -->
1. Find **JSON View** in the upper right corner and select it.
1. In the **Resource JSON** window, use the **API version** drop down menu to find and select the appropriate API version.

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
  "resources": [
    {
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
    }
  ]
}
```
---


## Enable CMK with system-assigned identity 

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

<!--  intro paragraph here  what are they doing and why -->

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