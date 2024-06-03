---
title: Relocation guidance in Azure Event Hubs
description: Learn how to relocate Azure Event Hubs to a another region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/24/2024
ms.service: event-hubs
ms.topic: concept-article
ms.custom:
  - subject-relocation
---

# Relocate Azure Event Hubs to another region

This article shows you how to to copy an Event Hubs namespace and configuration settings to another region. 

If you have other resources in the Azure resource group that contains the Event Hubs namespace, you may want to export the template at the resource group level so that all related resources can be moved to the new region in one step.  To learn how to export a **resource group** to the template, see [Move resources across regions(from resource group)](/azure/resource-mover/move-region-within-resource-group).

 
## Prerequisites

- Ensure that the services and features that your account uses are supported in the target region.

- If you have **capture feature** enabled for event hubs in the namespace, move [Azure Storage or Azure Data Lake Store Gen 2](../storage/common/storage-account-move.md) accounts before moving the Event Hubs namespace. You can also move the resource group that contains both Storage and Event Hubs namespaces to the other region by following steps similar to the ones described in this article. 

- If the Event Hubs namespace is in an **Event Hubs cluster**, [move the dedicated cluster](../event-hubs/move-cluster-across-regions.md) to the **target region** before you go through steps in this article. You can also use the [quickstart template on GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventhub/eventhubs-create-cluster-namespace-eventhub/) to create an Event Hubs cluster. In the template, remove the namespace portion of the JSON to create only the cluster. 

- Identify all resources dependencies. Depending on how you've deployed Event Hubs, the following services *may* need deployment in the target region:

    - [Public IP](/azure/virtual-network/move-across-regions-publicip-portal)
    - [Virtual Network](./relocation-virtual-network.md)
    - Event Hubs Namespace
    - [Event Hubs Cluster](./relocation-event-hub-cluster.md)
    - [Storage Account](./relocation-storage-account.md)
        >[!TIP]
        >When Capture is enabled, you can either relocate a Storage Account from the source or use an existing one in the target region.

- Identify all dependent resources. Event Hubs is a messaging system that lets applications publish and subscribe for messages.  Consider whether or not your application at target requires messaging support for the same set of dependent services that it had at the source target.


## Downtime

To understand the possible downtimes involved, see [Cloud Adoption Framework for Azure: Select a relocation method](/azure/cloud-adoption-framework/relocate/select#select-a-relocation-method).



## Considerations for Service Endpoints

The virtual network service endpoints for Azure Event Hubs restrict access to a specified virtual network. The endpoints can also restrict access to a list of IPv4 (internet protocol version 4) address ranges. Any user connecting to the Event Hubs from outside those sources is denied access. If Service endpoints were configured in the source region for the Event Hubs resource, the same would need to be done in the target one.

For a successful recreation of the Event Hubs to the target region, the VNet and Subnet must be created beforehand. In case the move of these two resources is being carried out with the Azure Resource Mover tool, the service endpoints won’t be configured automatically. Hence, they need to be configured manually, which can be done through the [Azure portal](/azure/key-vault/general/quick-create-portal), the [Azure CLI](/azure/key-vault/general/quick-create-cli), or [Azure PowerShell](/azure/key-vault/general/quick-create-powershell).

## Considerations for Private Endpoint

Azure Private Link provides private connectivity from a virtual network to [Azure platform as a service (PaaS), customer-owned, or Microsoft partner services](/azure/private-link/private-endpoint-overview). Private Link simplifies the network architecture and secures the connection between endpoints in Azure by eliminating data exposure to the public internet.

For a successful recreation of the Event Hubs in the target region, the VNet and Subnet must be created before the actual recreation occurs.

## Prepare

To get started, export a Resource Manager template. This template contains settings that describe your Event Hubs namespace.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All resources** and then select your Event Hubs namespace.
3. On the **Event Hubs Namespace** page, select **Export template** under **Automation** in the left menu. 
4. Choose **Download** in the **Export template** page.

    ![Screenshot showing where to download Resource Manager template](../event-hubs/media/move-across-regions/download-template.png)
5. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

   This zip file contains the .json files that include the template and scripts to deploy the template.


## Modify the template

Modify the template by changing the Event Hubs namespace name and region.

# [portal](#tab/azure-portal)




1. Select **Template deployment**. 

1. In the Azure portal, select **Create**.

1. Select **Build your own template in the editor**.

1. Select **Load file**, and then follow the instructions to load the **template.json** file that you downloaded in the last section.

1. In the **template.json** file, name the Event Hubs namespace by setting the default value of the namespace name. This example sets the default value of the Event Hubs namespace name to `namespace-name`.

   ```json
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespaces_name": {
            "defaultValue": "namespace-name",
            "type": "String"
        },
    },
   ```
1. Edit the **location** property in the **template.json** file to the target region. This example sets the target region to `centralus`.

   ```json
   "resources": [
       {
           "type": "Microsoft.KeyVault/vaults",
           "apiVersion": "2023-07-01",
           "name": "[parameters('vaults_name')]",
           "location": "centralus",
           
       },
       
   ]


    "resources": [
    {
        "type": "Microsoft.EventHub/namespaces",
        "apiVersion": "2023-01-01-preview",
        "name": "[parameters('namespaces_name')]",
        "location": "centralus",
        
     },
    {
        "type": "Microsoft.EventHub/namespaces/authorizationrules",
        "apiVersion": "2023-01-01-preview",
        "name": "[concat(parameters('namespaces_name'), '/RootManageSharedAccessKey')]",
        "location": "centralus",
        "dependsOn": [
            "[resourceId('Microsoft.EventHub/namespaces', parameters('namespaces_name'))]"
        ],
        "properties": {
            "rights": [
                "Listen",
                "Manage",
                "Send"
            ]
        }
    },
    {
        "type": "Microsoft.EventHub/namespaces/networkrulesets",
        "apiVersion": "2023-01-01-preview",
        "name": "[concat(parameters('namespaces_name'), '/default')]",
        "location": "centralus",
        "dependsOn": [
            "[resourceId('Microsoft.EventHub/namespaces', parameters('namespaces_name'))]"
        ],
        "properties": {
            "publicNetworkAccess": "Enabled",
            "defaultAction": "Deny",
            "virtualNetworkRules": [
                {
                    "subnet": {
                        "id": "[concat(parameters('virtualNetworks_vnet_akv_externalid'), '/subnets/default')]"
                    },
                    "ignoreMissingVnetServiceEndpoint": false
                }
            ],
            "ipRules": [],
            "trustedServiceAccessEnabled": false
        }
    },
    {
        "type": "Microsoft.EventHub/namespaces/privateEndpointConnections",
        "apiVersion": "2023-01-01-preview",
        "name": "[concat(parameters('namespaces_peterheesbus_name'), '/81263915-15d5-4f14-8d65-25866d745a66')]",
        "location": "centralus",
        "dependsOn": [
            "[resourceId('Microsoft.EventHub/namespaces', parameters('namespaces_peterheesbus_name'))]"
        ],
        "properties": {
            "provisioningState": "Succeeded",
            "privateEndpoint": {
                "id": "[parameters('privateEndpoints_pvs_eventhub_externalid')]"
            },
            "privateLinkServiceConnectionState": {
                "status": "Approved",
                "description": "Auto-Approved"
            }
        }
    }
   ```

   To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces, **Central US** = **centralus**.

1. Remove resources of type private endpoint in the template.

   ```json
    {
        "type": "Microsoft.EventHub/namespaces/privateEndpointConnections",
    
    }
   ```

1. If you configured a service endpoint in your Event Hubs, in the `networkrulesets` section, under `virtualNetworkRules`, add the rule for the target subnet. Ensure that the `ignoreMissingVnetServiceEndpoint`_ flag is set to `False`, so that the IaC fails to deploy the Event Hubs in case the service endpoint isn’t configured in the target region.

    \_parameter.json_
    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        
        "target_vnet_externalid": {
          "value": "virtualnetwork-externalid"
        },
        "target_subnet_name": {
          "value": "subnet-name"
        }
      }
    }
    ```

   \_template.json
    ```json
    {
        "type": "Microsoft.EventHub/namespaces/networkrulesets",
        "apiVersion": "2023-01-01-preview",
        "name": "[concat(parameters('namespaces_name'), '/default')]",
        "location": "centralus",
        "dependsOn": [
            "[resourceId('Microsoft.EventHub/namespaces', parameters('namespaces_name'))]"
        ],
        "properties": {
            "publicNetworkAccess": "Enabled",
            "defaultAction": "Deny",
            "virtualNetworkRules": [
                {
                    "subnet": {
                        "id": "[concat(parameters('target_vnet_externalid), concat('/subnets/', parameters('target_subnet_name')]"
                    },
                    "ignoreMissingVnetServiceEndpoint": false
                }
            ],
            "ipRules": [],
            "trustedServiceAccessEnabled": false
        }
    },

    ```
1. Select **Save** to save the template.

# [PowerShell](#tab/azure-powershell)


1. In the **template.json** file, name the Event Hubs namespace by setting the default value of the namespace name. This example sets the default value of the Event Hubs namespace name to `namespace-name`.

   ```json
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespaces_name": {
            "defaultValue": "namespace-name",
            "type": "String"
        },
    
    },
   ```

2. Edit the **location** property in the **template.json** file to the target region. This example sets the target region to `centralus`.

   ```json
   "resources": [
       {
           "type": "Microsoft.KeyVault/vaults",
           "apiVersion": "2023-07-01",
           "name": "[parameters('vaults_name')]",
           "location": "centralus",
           
       },
       
   ]


    "resources": [
    {
        "type": "Microsoft.EventHub/namespaces",
        "apiVersion": "2023-01-01-preview",
        "name": "[parameters('namespaces_name')]",
        "location": "centralus",
        
     },
    {
        "type": "Microsoft.EventHub/namespaces/authorizationrules",
        "apiVersion": "2023-01-01-preview",
        "name": "[concat(parameters('namespaces_name'), '/RootManageSharedAccessKey')]",
        "location": "centralus",
        "dependsOn": [
            "[resourceId('Microsoft.EventHub/namespaces', parameters('namespaces_name'))]"
        ],
        "properties": {
            "rights": [
                "Listen",
                "Manage",
                "Send"
            ]
        }
    },
    {
        "type": "Microsoft.EventHub/namespaces/networkrulesets",
        "apiVersion": "2023-01-01-preview",
        "name": "[concat(parameters('namespaces_name'), '/default')]",
        "location": "centralus",
        "dependsOn": [
            "[resourceId('Microsoft.EventHub/namespaces', parameters('namespaces_name'))]"
        ],
        "properties": {
            "publicNetworkAccess": "Enabled",
            "defaultAction": "Deny",
            "virtualNetworkRules": [
                {
                    "subnet": {
                        "id": "[concat(parameters('virtualNetworks_vnet_akv_externalid'), '/subnets/default')]"
                    },
                    "ignoreMissingVnetServiceEndpoint": false
                }
            ],
            "ipRules": [],
            "trustedServiceAccessEnabled": false
        }
    },
    {
        "type": "Microsoft.EventHub/namespaces/privateEndpointConnections",
        "apiVersion": "2023-01-01-preview",
        "name": "[concat(parameters('namespaces_peterheesbus_name'), '/81263915-15d5-4f14-8d65-25866d745a66')]",
        "location": "centralus",
        "dependsOn": [
            "[resourceId('Microsoft.EventHub/namespaces', parameters('namespaces_peterheesbus_name'))]"
        ],
        "properties": {
            "provisioningState": "Succeeded",
            "privateEndpoint": {
                "id": "[parameters('privateEndpoints_pvs_eventhub_externalid')]"
            },
            "privateLinkServiceConnectionState": {
                "status": "Approved",
                "description": "Auto-Approved"
            }
        }
    }
   ```

   You can obtain region codes by running the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command.

   ```azurepowershell-interactive
   Get-AzLocation | format-table
   ```

3. Remove resources of typ private endpoint in the template.

   ```json
    {
        "type": "Microsoft.EventHub/namespaces/privateEndpointConnections",
        
    }
   ```

4. If you configured a service endpoint in your Event Hubs, in the `networkrulesets` section, under `virtualNetworkRules`, add the rule for the target subnet. Ensure that the `ignoreMissingVnetServiceEndpoint` flag is set to False, so that the IaC fails to deploy the Event Hubs in case the service endpoint isn’t configured in the target region.

   \_parameter.json_

   ```json
   {
     "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
     "contentVersion": "1.0.0.0",
     "parameters": {
       ...
       "target_vnet_externalid": {
         "value": "virtualnetwork-externalid"
       },
       "target_subnet_name": {
         "value": "subnet-name"
       }
     }
   }
   ```

   \_template.json

   ```json
   {
       "type": "Microsoft.EventHub/namespaces/networkrulesets",
       "apiVersion": "2023-01-01-preview",
       "name": "[concat(parameters('namespaces_name'), '/default')]",
       "location": "centralus",
       "dependsOn": [
           "[resourceId('Microsoft.EventHub/namespaces', parameters('namespaces_name'))]"
       ],
       "properties": {
           "publicNetworkAccess": "Enabled",
           "defaultAction": "Deny",
           "virtualNetworkRules": [
               {
                   "subnet": {
                       "id": "[concat(parameters('target_vnet_externalid), concat('/subnets/', parameters('target_subnet_name')]"
                   },
                   "ignoreMissingVnetServiceEndpoint": false
               }
           ],
           "ipRules": [],
           "trustedServiceAccessEnabled": false
       }
   },
   ```

1. Select **Save** to save the template.
---

## Redeploy

1. In the Azure portal, select **Create a resource**.

1. In **Search the Marketplace**, type **template deployment**, and select **Template deployment (deploy using custom templates)**.

1. Select **Build your own template in the editor**.

1. Select **Load file**, and then follow the instructions to load the **template.json** file that you modified in the last section.

1. On the **Custom deployment** page, follow these steps:

    1. Select an Azure **subscription**. 
    2. Select an existing **resource group** or create one. If the source namespace was in an Event Hubs cluster, select the resource group that contains cluster in the target region. 
    3. Select the target **location** or region. If you selected an existing resource group, this setting is read-only. 
    4. In the **SETTINGS** section, do the following steps:    
        1. Enter the new **namespace name**. 

            ![Deploy Resource Manager template](../event-hubs//media/move-across-regions/deploy-template.png)
        2. If your source namespace was in an **Event Hubs cluster**, enter names of **resource group** and **Event Hubs cluster** as part of **external ID**. 

              ```
              /subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<CLUSTER'S RESOURCE GROUP>/providers/Microsoft.EventHub/clusters/<CLUSTER NAME>
              ```   
        3. If Event Hubs in your namespace uses a Storage account for capturing events, specify the resource group name and the storage account for `StorageAccounts_<original storage account name>_external` field. 
            
            ```
            /subscriptions/0000000000-0000-0000-0000-0000000000000/resourceGroups/<STORAGE'S RESOURCE GROUP>/providers/Microsoft.Storage/storageAccounts/<STORAGE ACCOUNT NAME>
            ```    
    5. Select **Review + create** at the bottom of the page. 
    6. On the **Review + create** page, review settings, and then select **Create**.   

1. Network configuration settings (private endpoints) need to be re-configured in the new Event Hubs.

## Discard or clean up
After the deployment, if you want to start over, you can delete the **target Event Hubs namespace**, and repeat the steps described in the [Prepare](#prepare) and [Move](#redeploy) sections of this article.

To commit the changes and complete the move of an Event Hubs namespace, delete the **Event Hubs namespace** in the original region. Make sure that you processed all the events in the namespace before deleting the namespace. 

To delete an Event Hubs namespace (source or target) by using the Azure portal:

1. In the search window at the top of Azure portal, type **Event Hubs**, and select **Event Hubs** from search results. You see the Event Hubs namespaces in a list.
2. Select the target namespace to delete, and select **Delete** from the toolbar. 

    ![Screenshot showing Delete namespace - button](../event-hubs//media/move-across-regions/delete-namespace-button.png)
3. On the **Delete Namespace** page, confirm the deletion by typing the **namespace name**, and then select **Delete**. 

## Next steps

In this how-to, you learned how to move an Event Hubs namespace from one region to another. 

For instructions on moving an Event Hubs cluster from one region to another region, see [Relocate Event Hubs to another region](relocation-event-hub-cluster.md) article. 

To learn more about moving resources between regions and disaster recovery in Azure, refer to:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
