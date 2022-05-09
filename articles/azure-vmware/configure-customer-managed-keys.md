---
title: Configure customer-managed key encryption at rest in Azure VMware Solution
description: Learn how to encrypt data in Azure VMware Solution with customer-managed keys using Azure Key Vault.
ms.topic: how-to 
ms.date: 5/09/2022

---

# Configure customer-managed key encryption at rest in Azure VMware Solution

## Overview

This article will show you how to encrypt VMware vSAN Key Encryption Keys (KEK) with customer-managed keys (CMKs) managed by customer-owned Azure Key Vault. 

When CMK encryptions are enabled on your Azure VMware Solution private cloud, Azure VMware Solution uses the CMK from your Key Vault to encrypt the vSAN KEKs. Each ESXi host that participates in the vSAN cluster uses randomly generated Disk Encryption Keys (DEKs) that ESXi uses to encrypt disk data at rest. vSAN encrypts all DEKs with a KEK provided by Azure VMware Solution key management system (KMS). Azure VMware Solution private cloud and Key Vault don't need to be in the same subscription.

When managing your own encryption keys, you can do the following actions:

- Control Azure access to vSAN keys.
- Centrally manage and lifecycle CMK.
- Revoke Azure from accessing the KEK.

Customer-managed keys (CMKs) feature supports, see the following shown by key type and key size.

- RSA: 2048, 3072, 4096
- RSA-HSM: 2048, 3072, 4096

## Topology 

The following diagram shows how Azure VMware Solution uses Azure Active Directory (Azure AD) and a key vault to deliver the customer-managed key.

:::image type="content" source="media/configure-customer-managed-keys/customer-managed-keys-topology-diagram.png" alt-text="Diagram showing the customer-managed keys topology." border="false" lightbox="media/configure-customer-managed-keys/customer-managed-keys-topology-diagram.png":::


## Prerequisites

Before you begin to enable customer-managed key (CMK) functionality, ensure the following listed requirements are met:

1. You'll need an Azure Key Vault to use CMK functionality. If you don't have an Azure Key Vault, you can create one using [Quickstart: Create a Key Vault using the Azure portal](https://docs.microsoft.com/azure/key-vault/general/quick-create-portal).
1. If you enabled restricted access to Key Vault, you'll need to allow Microsoft Trusted Services to bypass the Azure Key Vault firewall. Go to [Configure Azure Key Vault networking settings](https://docs.microsoft.com/azure/key-vault/general/how-to-azure-key-vault-network-security?tabs=azure-portal) to learn more.
1. Enable system assigned Identity on your Azure VMware Solution private cloud if you didn't enable it during software-defined data center (SDDC) provisioning.

# [Portal](#tab/azure-portal)

1. Log into Azure portal.
1. Navigate to **Azure VMware Solution** and locate your SDDC.
1. From the left navigation, open **Manage** and select **Identity**. 
1. In **System Assigned**, check **Enable** and select **Save**.

**System Assigned identity** should now be enabled.

# [Template](#tab/azure-resource-manager)

Use the given JSON file to create an Azure Resource Manager template (ARM template). Use it to enable Managed Service Identity (MSI) on pre-existing SDDC or while deploying a new SDDC.

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

System-assigned identity is restricted to one per resource and is tied to the lifecycle of the resource. You can grant permissions to the managed identity by using Azure Role-Based Access Control (RBAC). The managed identity is authenticated with Azure AD, so you don't have to store any credentials in code.

>[!IMPORTANT]
> Ensure that Key Vault is in the same region as the Azure VMware Solution private cloud.

# [Portal](#tab/azure-portal)

Navigate to your **Azure Key Vault** and provide access to the SDDC on Azure Key Vault using the Principal ID captured in the **Enable MSI** tab.

1. From your Azure VMware Solution private cloud, under **Manage**, select **Encryption** and then **Customer-managed keys (CMK)**.
1. CMK provides two options for **Key Selection** from Azure Key Vault.
    
    **Option 1**

    1. Under **Encryption key**, choose the **select from Key Vault** button.
    1. Select the encryption type, then the **Select Key Vault and key** option.
    1. Select the Key Vault and key from the drop-down, click **Select**.
    
    **Option 2**

      1. Under **Encryption key**, choose the **Enter key from URI** button.
      1. Enter a specific Key URI in the **Key URI** box.

    > [!IMPORTANT]
    > If you'd like to select a specific key version instead of the auto selected latest version, you'll need to specify key URI with key version. This will affect the CMK key version life cycle.

1. Select **Save** to grant access to the resource. 

# [Template](#tab/azure-resource-manager)

Use the given JSON file to create an Azure Resource Manager template (ARM template) and enable CMK on SDDC.

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
				"description": "Key Vault url to be used for Customer Managed Key"
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

## Customer-managed key version lifecycle

You can change the Customer Managed Key by creating a new version of the key at any time without interrupting the virtual machine (VM) workload.

In Azure VMware Solution, CMK key version rotation will depend on the key selection setting you've chosen during CMK setup.

**Key selection setting 1**

A customer enables CMK encryption without supplying a specific key version for CMK. Azure VMware Solution selects the latest key version for CMK from the customer's Key Vault to encrypt the vSAN KEKs. Azure VMware Solution tracks the CMK for version rotation. When a new version of the CMK key in Azure Key Vault is created, it's captured by Azure VMware Solution automatically to encrypt vSAN KEKs.

**Key selection setting 2**

A customer can enable CMK encryption for a specified CMK key version to supply the full key version URI under the **Enter Key from URI** option. When the customer's current key expires, the customer will need to re-enable CMK encryption with a new key.

## Change from customer-managed key to Microsoft managed key 

If a customer wants to change from customer-managed key (CMK) to Microsoft managed key (MMK), it won't interrupt VM workload. To make the change from CMK to MMK, use the following steps.

1. Select **Encryption**, located under **Manage** from your Azure VMware Solution private cloud.
2. Select **Microsoft-managed keys (MMK)**.
3. Select **Save**.
  
## Restore permission

## Errors  

Errors 403 and 404 occur when Managed Service Identity (MSI) doesn't have access to Key Vault. These errors occur when a user removes access policies within Key Vault, deletes Key Vault, DNS outages, networking issues, or Key Vault outages.  It results in the delay of update operations on vCenter. The approach is to shut down the hosts to avoid any malicious access to the data within an hour of the error.  Host maintenance and update operations, whether manual or automatic, won't work, but you can still access the private cloud. 

When all errors get resolved, access to the data will be restored. No data is lost because of outages. The error will get resolved by Microsoft fixing service outages or by you restoring a KEK or access to the Key Vault. To protect data from errors, Azure VMware Solution caches data encryption keys for as long as possible. You can write the data encryption keys to disks protected by a Microsoft key or a data protection API (DP API). But only if it continues to honor the one-hour window and is cleaned up afterward.

>[!TIP]
> You'll be notified if a key or access to the key is revoked. Once revoked, you can then define custom actions to take. If you lose access to your cached data encryption key, make the data inaccessible so you don't lose the data.

>[!TIP]
> You'll be notified if a key or access to the key is revoked. Once revoked, you can then define custom actions to take. If you lose access to your cached data encryption key, make the data inaccessible so you don't lose the data.

## Next steps