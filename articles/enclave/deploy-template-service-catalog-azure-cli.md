---
title: Deploy a template from the service catalog using Azure CLI
titleSuffix: Azure Enclave
description: Learn how to deploy a template from the Azure Enclave service catalog using Azure CLI.
author: aserfass-msft
ms.author: aserfass
ms.service: azure-enclave
ai-usage: ai-assisted
ms.topic: how-to
ms.date: 09/24/2026
---

# Quickstart: Deploy a service catalog template using the CLI

Azure Enclave is a cloud networking service that provides organizations with highly sensitive data the ability to quickly deploy and manage workloads across Commercial and air-gapped Azure clouds at scale. In this quickstart, you:

- Deploy a service catalog template by using Azure CLI commands.

> [!NOTE]
> 
> This sample deployment is just for demo purposes and doesn't represent all the best practices for network, systems, or applications administration.

## Before you begin
- This quickstart assumes a basic understanding of networking and Azure Enclave concepts. For more information, see [Concepts and best practices of Azure Enclave](./best-practices.md).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- You need to have the Azure CLI installed or use the [Azure Cloud Shell](https://portal.azure.com/#cloudshell/). For more information, see [Azure Command-Line Interface (CLI) documentation](/cli/azure/).

- You need a [community](./what-community.md), [enclave](./what-enclave.md), [workload](./what-workload.md), and at least one [workload resource group](./what-workload.md#workload-resource-group). You also need permission to create resources in the workload resource group.

- If the template creates resources in the enclave managed resource group, enable the required [maintenance mode](./maintenance-mode.md) before deployment.

## Prerequisites

Before you begin, review the prerequisites specified by the service catalog template you plan to deploy. Deploy any required prerequisite resources that aren't already available, and confirm that you have permission to use them.

Then gather the resource names, resource IDs, and other parameter values required by that template. The prerequisites, required parameters, and default values can vary by template and version. Don't assume that every template requires the resources used in the following example.

## Deploy a template from the service catalog
You can find the service catalog templates in Azure Public in the [`inventory.xml`](https://veservicecatalogprod.z22.web.core.windows.net/inventory.xml) inventory file.  

Download a specific template by using the name you find in the inventory (for example, [`deploy-adminVM-1.0.1.json`](https://veservicecatalogprod.z22.web.core.windows.net/adminVM/deploy-adminVM-1.0.1.json)).

1. List the available templates on the service catalog:

    ```powershell
    # Download the XML file
    $xmlUrl = "https://veservicecatalogprod.z22.web.core.windows.net/inventory.xml"
    $xmlContent = Invoke-WebRequest -Uri $xmlUrl -UseBasicParsing
    
    # Load the XML content
    [xml]$xml = $xmlContent.Content
    
    # Extract URLs from the XML file
    $urls = $xml.SelectNodes("//EnumerationResults/Blobs/Blob/Url")
    
    # List the URLs
    $urls | ForEach-Object { $_.InnerText }
    ```
   
    The service catalog storage account varies by environment:

    - Azure: `veservicecatalogprod.z22.web.core.windows.net`
    - Azure Government: `veservicecatalogfairfax.z2.web.core.usgovcloudapi.net`
    - Azure Secret: `veservicecatalogussec.z1.web.core.<AzureSecretDomain>`
    - Azure Top Secret: `veservicecatalogusnat.z2.web.core.<AzureTopSecretDomain>`

1. Download each template
   Continue the PowerShell script from the previous step. To download only one template, replace the filter with the template URL you selected.

    ```powershell
    # download all templates
    $urls | ForEach-Object {
        $url = $_.InnerText
        $fileName = Split-Path -Leaf $url
        Invoke-WebRequest -Uri $url -OutFile $fileName
    }
    ```

1. Open the template and determine which parameters you need to provide. In this example, use `storageAccount/deploy-storage-account-1.0.0.json`.

    Note which parameters are required and which parameters have default values.
    
    Create a `params.json` file to provide the parameter values:
    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "storageAccountName": {
                "value": ""
            },
            "virtualNetworkName": {
                "value": ""
            },
            "networkResourceGroupName": {
                "value": ""
            },
            "privateLinkSubnetName": {
                "value": ""
            },
            "privateDnsZoneResourceGroupName": {
                "value": ""
            },
            "keyVaultName": {
                "value": ""
            },
            "keyName": {
                "value": ""
            },
            "keyVaultResourceGroupName": {
                "value": ""
            },
            "userAssignedIdentityObject": {
                "value": {
                    "name":"",
                    "id":"",
                    "location":"",
                    "subscriptionName":""
                }
            }
        }
    }
    ```

1. Fetch the enclave resources to provide the following parameter values:
    - `storageAccountName`
    - `virtualNetworkName`
    - `networkResourceGroupName`
    - `privateDnsZoneResourceGroupName`
    - `keyVaultName`
    - `keyVaultResourceGroupName`
    - `userAssignedIdentityObject.name`
    - `userAssignedIdentityObject.id`
    - `userAssignedIdentityObject.location`
    - `userAssignedIdentityObject.subscriptionName`

    ```azurecli
    az rest --method get --uri "<enclave-resource-id>?api-version=<api-version>"
    ```

    Use a currently supported `Microsoft.Mission` API version (for example, `2026-10-01-preview` or `2026-04-01`).

    Use the response and the Azure resource properties to populate the values in `params.json`. For more API operations and schemas, see the [Azure Enclave API reference](https://aka.ms/ae/api) and [Azure Enclave API source and specs](https://aka.ms/ae/apigithub). You must also identify `privateLinkSubnetName` and `keyName`.

1. List the subnets in the virtual network (privateLinkSubnetName)
    ```azurecli
    az network vnet subnet list --resource-group <resource-group-name> --vnet-name <vnet-name> --query "[].name"
    ```

1. Get CMK Key Name (keyName)
    ```azurecli
    az keyvault key list --vault-name <keyvault-name> --query "[].name"
    ```

1. Get the location of userAssignedIdentityObject (userAssignedIdentityObject.location)
    ```azurecli
    az resource show --ids <user-assigned-identity-resource-id> --query location
    ```

1. Get the subscription name
    ```azurecli
    az account show --subscription <subscription-id> --query name
    ```

1. Deploy the template
    ```azurecli
    az deployment group create --resource-group <resource-group-name> --template-file ./<template-downloaded-name> --parameters @./<parameter-file-name>
    ```

## Validate the deployment

1. Check the deployment status.

    ```azurecli
    az deployment group show --resource-group <resource-group-name> --name <deployment-name> --query properties.provisioningState
    ```

1. Confirm that the resources created by the template are present.

    ```azurecli
    az resource list --resource-group <resource-group-name> --output table
    ```

## Delete the deployment
If you don't plan on keeping these resources, delete only the resources created by this deployment to avoid Azure charges. Delete the resource group only when it's dedicated to this deployment and you confirmed that it contains no resources you need to keep.

## Related content

- [Azure Enclave API reference](https://aka.ms/ae/api)
- [Azure Enclave API source and specs](https://aka.ms/ae/apigithub)
