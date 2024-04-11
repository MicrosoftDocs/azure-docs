---
title: Configure customer-managed keys (preview) for experiment encryption
titleSuffix: Azure Chaos Studio
description: Learn how to configure customer-managed keys (preview) for your Azure Chaos Studio experiment resource by using Azure Blob Storage.
services: chaos-studio
ms.service: chaos-studio
ms.custom: devx-track-azurecli
ms.author: abbyweisberg
ms.reviewer: ninallam
author: nikhilkaul-msft
ms.date: 10/06/2023
ms.topic: how-to
---
 
# Configure customer-managed keys (preview) for Azure Chaos Studio by using Azure Blob Storage

Azure Chaos Studio automatically encrypts all data stored in your experiment resource with service-managed keys that Microsoft provides. As an optional feature, you can add a second layer of security by also providing your own customer-managed encryption keys. Customer-managed keys (CMKs) offer greater flexibility for controlling access and key-rotation policies.

When you use CMKs, you need to specify a user-assigned managed identity (UMI) to retrieve the key. The UMI you create must match the UMI that you use for the Chaos Studio experiment.

When configured, Chaos Studio uses Azure Storage, which uses the CMK to encrypt all your experiment execution and result data within your own storage account.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An existing UMI. For more information about how to create a UMI, see [Manage user-assigned managed identities](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity).
- A public-access-enabled storage account.

## Limitations

- Azure Chaos Studio experiments can't automatically rotate the CMK to use the latest version of the encryption key. You do key rotation directly in your chosen storage account.
- You need to use our *2023-10-27-preview REST API* to create and use CMK-enabled experiments only. There's *no* support for CMK-enabled experiments in our general availability-stable REST API until H1 2024.
- Chaos Studio currently *only supports creating Chaos Studio CMK experiments via the command line by using our 2023-10-27-preview REST API*. As a result, you *can't* create a Chaos Studio experiment with CMK enabled via the Azure portal. We plan to add this functionality in H1 of 2024.
- The storage account must have *public access from all networks* enabled for Chaos Studio experiments to be able to use it. If you have a hard requirement from your organization, reach out to your CSA for potential solutions.
- Experiment data will appear in ARG even after using CMK. This is a known issue, but the visbility is limited to only the active subcription using CMK. 

## Configure your storage account

When you create or update your storage account to use it for a CMK experiment, you need to go to the **Encryption** tab and set **Encryption type** to **Customer-managed keys (CMK)** and fill out all the required information.
> [!NOTE]
> The UMI that you use should match the one you use for the corresponding Chaos Studio CMK-enabled experiment.

## Use customer-managed keys with Chaos Studio

You can only configure customer-managed encryption keys when you create a new Chaos Studio experiment resource. When you specify the encryption key details, you also have to select a UMI to retrieve the key from Azure Key Vault.

> [!NOTE]
> The UMI should be the *same* UMI you use with your Chaos Studio experiment resource. Otherwise, the Chaos Studio CMK experiment fails to create or update.

## Azure CLI

The following code sample shows an example `PUT` command for creating or updating a Chaos Studio experiment resource to enable CMKs.

> [!NOTE]
>The two parameters specific to CMK experiments are under the `CustomerDataStorage` block, in which we ask for the subscription ID of the Azure Blob Storage account that you want to use to store your experiment data and the name of the Blob Storage container to use or create.

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

If you run the same `PUT` command from the previous example on an existing CMK-enabled experiment resource, but you leave the fields in `customerDataStorage` empty, CMK is disabled on an experiment.

## Reenable CMK on a Chaos Studio experiment

If you run the same `PUT` command from the previous example on an existing experiment resource by using the 2023-10-27-preview REST API and populate the fields in `customerDataStorage`, CMK is reenabled on an experiment.

## Change the user-assigned managed identity for retrieving the encryption key

You can change the managed identity for CMKs for an existing Chaos Studio experiment at any time. The outcome would be identical to updating the UMI for any Chaos Studio experiment.
> [!NOTE]
>If the UMI does *not* have the correct permissions to retrieve the CMK from your key vault and write to Blob Storage, the `PUT` command to update the UMI fails.

### List whether an experiment is CMK-enabled or not

When you use the `Get Experiment` command from the 2023-10-27-preview REST API, the response shows you whether the `CustomerDataStorage` properties were populated or not. In this way, you can tell whether an experiment is CMK enabled or not.

## Update the customer-managed encryption key being used by your storage account

You can change the key that you're using at any time because Chaos Studio is using your own storage account for encryption by using your CMK.

## Frequently asked questions

Here are some answers to common questions.

### Is there an extra charge to enable customer-managed keys?

There's no charge associated directly from Chaos Studio. The use of Blob Storage and Key Vault might carry extra cost subject to those services' individual pricing.

### Are customer-managed keys supported for existing Chaos Studio experiments?

This feature is currently only available for Chaos Studio experiments created by using our 2023-10-27-preview REST API.
