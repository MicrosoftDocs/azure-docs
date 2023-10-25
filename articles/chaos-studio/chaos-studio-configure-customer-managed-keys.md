---
title: Configure customer-managed keys for experiment encryption
titleSuffix: Azure Chaos Studio
description: Learn how to configure customer-managed keys for your Azure Chaos Studio experiment resource with Azure Key Vault and Azure Storage
services: chaos-studio
ms.service: chaos-studio
ms.author: nikhil-msft
author: nikhil-msft
ms.date: 10/06/2023
ms.topic: how-to
---
 
# Configure customer-managed keys for Azure Chaos Studio with Azure Key Vault
 
Azure Chaos Studio automatically encrypts all data stored in your experiment resource with keys that Microsoft provides (service-managed keys). As an optional feature, you can add a second layer of security by also providing your own (customer-managed) encryption key(s). Customer-managed keys offer greater flexibility for controlling access and key-rotation policies.
 
The keys you provide are stored securely using [Azure Key Vault](../key-vault/general/overview.md). You can create a separate key for each experiment resource you enable with customer-managed keys.
 
When you use customer-managed encryption keys, you need to specify a user-assigned managed identity to retrieve the keys from Azure Key Vault. This needs to match the UMI that you use for the Chaos Studio experiment. 
 
When configured, Azure Chaos Studio leverages Azure Storage, which uses the customer-managed key to encrypt all of your experiment execution and result data within your own Storage account.

## Prerequisites
 
- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
 
- An existing user-assigned managed identity. For more information about creating a user-assigned managed identity, see [Manage user-assigned managed identities](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity).

- A public-access enabled Azure storage account

- An Azure Key Vault
 
## Limitations
   
- Azure Chaos Studio experiments can't automatically rotate the customer-managed key to use the latest version of the encryption key. You would do this directly in your chosen Azure Storage account. 

- You will need to use our **2023-10-27-preview REST API** to create and use CMK-enabled experiments ONLY. We will **not** support CMK-enabled experiments in our GA-stable REST API until H1 2024. 

- Azure Chaos Studio currently **only supports creating Chaos Studio Customer-Managed-Key experiments via the Command Line using our 2023-10-27-preview REST API**. This means you will **not** be able to create a Chaos Studio experiment with CMK enabled via the Azure Portal. We plan to add this functionality in H1 of 2024.

- The storage account must have **public access from all networks** enabled for Azure Chaos Studio experiments to be able to use it. If this is a major issue for your organization, please reach out to your CSA for potential solutions.  
 
## Configure your Azure key vault
 
To use customer-managed encryption keys with Azure Chaos Studio experiments, you need to store the key in Azure Key Vault. You can use an existing key vault or create a new one. The experiment resource and key vault may be in different regions or subscriptions.

## Configure your Azure storage account
 
When creating and/or updating your storage account to use for a CMK experiment, you will need to navigate to the encryption tab and set the Encryption type to Customer-managed keys (CMK). 
 
## Use customer-managed keys with Azure Chaos Studio
 
You can only configure customer-managed encryption keys when you create a new Azure Chaos Studio experiment resource. When you specify the encryption key details, you also have to select a user-assigned managed identity to retrieve the key from Azure Key Vault. **NOTE** This should be the SAME user-assigned managed identity you are using with your Chaos Studio experiment resource, otherwise the Chaos Studio CMK experiment will fail.
 
To configure customer-managed keys for a new Chaos Studio resource, follow these steps:
 
# [Azure CLI](#tab/azure-cli)

 
The following code sample shows an example PUT command for creating or updating a Chaos Studio experiment resource to enable customer-managed keys:

**NOTE** The two parameters specific to CMK experiments are under the "CustomerDataStorage" block, in which we will ask for the Subscription ID of the Azure Blob Storage Account you want to use to storage your experiment data, as well as the name of the Blob Storage container to use or create. 
 
```HTTP
PUT https://management.azure.com/subscriptions/6b052e15-03d3-4f17-b2e1-be7f07588291/resourceGroups/exampleRG/providers/Microsoft.Chaos/experiments/exampleExperiment?api-version=2023-10-27-preview

{
  "location": "eastus2euap",
  "identity": {
    "type": "SystemAssigned"
  },
  "properties": {
    "steps": [
      {
        "name": "step1",
        "branches": [
          {
            "name": "branch1",
            "actions": [
              {
                "type": "continuous",
                "name": "urn:csci:microsoft:virtualMachine:shutdown/1.0",
                "selectorId": "selector1",
                "duration": "PT10M",
                "parameters": [
                  {
                    "key": "abruptShutdown",
                    "value": "false"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "selectors": [
      {
        "type": "List",
        "id": "selector1",
        "targets": [
          {
            "type": "ChaosTarget",
            "id": "/subscriptions/6b052e15-03d3-4f17-b2e1-be7f07588291/resourceGroups/exampleRG/providers/Microsoft.Compute/virtualMachines/exampleVM/providers/Microsoft.Chaos/targets/Microsoft-VirtualMachine"
          }
        ]
      }
    ],
    "customerDataStorage": {
      "storageAccountResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/exampleRG/providers/Microsoft.Storage/storageAccounts/exampleStorage",
      "blobContainerName": "azurechaosstudioexperiments"
    }
  }
}
```
## disable CMK from a Chaos Studio experiment
 
You can change the managed identity for customer-managed keys for an existing Chaos Studio experiment at any time. This would be identical to updating the User-assigned Managed identity for any Chaos Studio experiment. **NOTE** If the User-Assigned Managed Identity does NOT have the correct permisions to retrieve the CMK from your key vault and write to the Bloc Storage, the PUT command to update the UMI will fail. 

## Change the managed identity for retrieving the encryption key
 
You can change the managed identity for customer-managed keys for an existing Chaos Studio experiment at any time. This would be identical to updating the User-assigned Managed identity for any Chaos Studio experiment. **NOTE** If the User-Assigned Managed Identity does NOT have the correct permisions to retrieve the CMK from your key vault and write to the Bloc Storage, the PUT command to update the UMI will fail. 
 
## Update the customer-managed encryption key
 
You can change the key that you're using at any time, since Azure Chaos Studio is using your own Azure Storage account for encryption using your CMK. 
## Rotate encryption keys
 
You can rotate a customer-managed key in Azure Key Vault according to your compliance policies. To rotate a key:
 
1. In Azure Key Vault, update the key version or create a new key. 
1. [Update the customer-managed encryption key](#update-the-customer-managed-encryption-key) for your load testing resource.
 
## Frequently asked questions
 
### Is there an extra charge to enable customer-managed keys?
 
While there is no charge associated directly from Azure Chaos Studio, the use of Azure Blob Storage and Azure Key Vault may carry some additional cost subject to those services' individual pricing.
 
### Are customer-managed keys supported for existing Azure Chaos Studio experiments?
 
This feature is currently only available for Azure Chaos Studio experiments created using our **2023-10-27-preview** REST API
 
### How can I tell if customer-managed keys are enabled on my Azure Chaos Studio experiment?
 
Using the "Get Experiment" command from the 2023-10-27-preview REST API, the response will show you whether the "CustomerDataStorage" properties have been populated or not, which is how you can tell whether an experiment has CMK enabled or not. 
 
