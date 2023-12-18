---
title: Configure customer-managed keys (preview) for experiment encryption
titleSuffix: Azure Chaos Studio
description: Learn how to configure customer-managed keys (preview) for your Azure Chaos Studio experiment resource using Azure Blob Storage
services: chaos-studio
ms.service: chaos-studio
ms.author: nikhilkaul
author: nikhilkaul-msft
ms.date: 10/06/2023
ms.topic: how-to
---
 
# Configure customer-managed keys (preview) for Azure Chaos Studio using Azure Blob Storage
 
Azure Chaos Studio automatically encrypts all data stored in your experiment resource with keys that Microsoft provides (service-managed keys). As an optional feature, you can add a second layer of security by also providing your own (customer-managed) encryption key(s). Customer-managed keys offer greater flexibility for controlling access and key-rotation policies.
 
When you use customer-managed encryption keys, you need to specify a user-assigned managed identity (UMI) to retrieve the key. The UMI you create needs to match the UMI that you use for the Chaos Studio experiment. 
 
When configured, Azure Chaos Studio uses Azure Storage, which uses the customer-managed key to encrypt all of your experiment execution and result data within your own Storage account.

## Prerequisites
 
- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
 
- An existing user-assigned managed identity. For more information about creating a user-assigned managed identity, see [Manage user-assigned managed identities](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity).

- A public-access enabled Azure storage account
 
## Limitations
   
- Azure Chaos Studio experiments can't automatically rotate the customer-managed key to use the latest version of the encryption key. You would do key rotation directly in your chosen Azure Storage account. 

- You will need to use our **2023-10-27-preview REST API** to create and use CMK-enabled experiments ONLY. There is **no** support for CMK-enabled experiments in our GA-stable REST API until H1 2024. 

- Azure Chaos Studio currently **only supports creating Chaos Studio Customer-Managed-Key experiments via the Command Line using our 2023-10-27-preview REST API**. As a result, you **cannot** create a Chaos Studio experiment with CMK enabled via the Azure portal. We plan to add this functionality in H1 of 2024.

- The storage account must have **public access from all networks** enabled for Azure Chaos Studio experiments to be able to use it. If you have a hard requirement from your organization, reach out to your CSA for potential solutions.  

## Configure your Azure storage account
 
When creating and/or updating your storage account to use for a CMK experiment, you need to navigate to the encryption tab and set the Encryption type to Customer-managed keys (CMK) and fill out all required information. 
> [!NOTE]
> The User-assigned managed identity that you use should match the one you use for the corresponding Chaos Studio CMK-enabled experiment. 
 
## Use customer-managed keys with Azure Chaos Studio
 
You can only configure customer-managed encryption keys when you create a new Azure Chaos Studio experiment resource. When you specify the encryption key details, you also have to select a user-assigned managed identity to retrieve the key from Azure Key Vault. 

> [!NOTE]
> The UMI should be the SAME user-assigned managed identity you use with your Chaos Studio experiment resource, otherwise the Chaos Studio CMK experiment fails to Create/Update.
 

# [Azure CLI](#tab/azure-cli)

 
The following code sample shows an example PUT command for creating or updating a Chaos Studio experiment resource to enable customer-managed keys:

> [!NOTE]
>The two parameters specific to CMK experiments are under the "CustomerDataStorage" block, in which we ask for the Subscription ID of the Azure Blob Storage Account you want to use to storage your experiment data and the name of the Blob Storage container to use or create. 
 
```HTTP
PUT https://management.azure.com/subscriptions/<yourSubscriptionID>/resourceGroups/exampleRG/providers/Microsoft.Chaos/experiments/exampleExperiment?api-version=2023-10-27-preview

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
## Disable CMK on a Chaos Studio experiment
 
If you run the same PUT command from the previous example on an existing CMK-enabled experiment resource, but leave the fields in "customerDataStorage" empty, CMK is disabled on an experiment. 

## Re-enable CMK on a Chaos Studio experiment
 
If you run the same PUT command from the previous example on an existing experiment resource using the 2023-10-27-preview REST API and populate the fields in "customerDataStorage", CMK is re-enabled on an experiment. 

## Change the user-assigned managed identity for retrieving the encryption key
 
You can change the managed identity for customer-managed keys for an existing Chaos Studio experiment at any time. The outcome would be identical to updating the User-assigned Managed identity for any Chaos Studio experiment. 
> [!NOTE]
>If the User-Assigned Managed Identity does NOT have the correct permissions to retrieve the CMK from your key vault and write to the Blob Storage, the PUT command to update the UMI fails. 

### List whether an experiment is CMK-enabled or not
 
Using the "Get Experiment" command from the 2023-10-27-preview REST API, the response shows you whether the "CustomerDataStorage" properties have been populated or not, which is how you can tell whether an experiment has CMK enabled or not. 
 
## Update the customer-managed encryption key being used by your Azure Storage Account
 
You can change the key that you're using at any time, since Azure Chaos Studio is using your own Azure Storage account for encryption using your CMK. 


 
## Frequently asked questions
 
### Is there an extra charge to enable customer-managed keys?
 
While there's no charge associated directly from Azure Chaos Studio, the use of Azure Blob Storage and Azure Key Vault could carry some additional cost subject to those services' individual pricing.
 
### Are customer-managed keys supported for existing Azure Chaos Studio experiments?
 
This feature is currently only available for Azure Chaos Studio experiments created using our **2023-10-27-preview** REST API.
