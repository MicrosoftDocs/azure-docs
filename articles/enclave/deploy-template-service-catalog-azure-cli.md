---
title: Deploy Template from the service catalog using Azure CLI
titleSuffix: Azure Enclave
description: Deploy Template from the service catalog using Azure CLI.
author: aserfass-msft
ms.author: aserfass
ms.topic: how-to
ms.date: 9/30/2025
---

# Quickstart: Deploy a service catalog Template using the CLI

Azure Enclave is a cloud networking service that provides organizations with highly sensitive data the ability to quickly deploy and manage workloads across Commercial and air-gapped Azure clouds at scale. In this quickstart, you:

- Deploy a service catalog template from the service catalog using the Azure CLI.

> [!NOTE]
> 
> This sample deployment is just for demo purposes and doesn't represent all the best practices for network, systems, or applications administration.

## Before you begin
- This quickstart assumes a basic understanding of networking and Azure Enclave concepts. For more information, see [Concepts and best practices of Azure Enclave](./best-practices.md).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- You need to have the Azure CLI installed or use the [Azure Cloud Shell](https://portal.azure.com/#cloudshell/). For more information, see [Azure Command-Line Interface (CLI) documentation](/cli/azure/) 

- You need a [community](./what-community.md), [enclave](./what-enclave.md), [workload](./what-workload.md), and at least one [workload resource group](./what-workload.md#workload-resource-group) and permissions to create resources inside the workload resource group.

- Enable `Advanced` [maintenance mode](./maintenance-mode.md) for your enclave so you can add the Private Link resources to your enclave managed resource group.

## Deploy a template from the service catalog
The service catalog templates are publicly available here in Azure Public: https://veservicecatalogprod.z22.web.core.windows.net/inventory.xml

Download a specific template by using the name found in the inventory above (for example, https://veservicecatalogprod.z22.web.core.windows.net/adminVM/deploy-adminVM-1.0.1.json)

1. List the available templates on the service catalog:

    ```
    # Download the XML file
    $xmlUrl = "https://veservicecatalogprod.z22.web.core.windows.net/inventory.xml"
    $xmlContent = Invoke-WebRequest -Uri $xmlUrl -UseBasicParsing
    
    # Load the XML content
    [xml]$xml = $xmlContent.Content
    
    # Extract URLs from the XML file
    $urls = $xml.SelectNodes("//EnumerationResults/Blobs/Blob/Url")
    
    # # List the URLs
    $urls | ForEach-Object { $_.InnerText }
    ```
   
    Storage account names by environment
    - Azure: veservicecatalogprod.z22.web.core.windows.net
    - Azure Government: veservicecatalogfairfax.z2.web.core.usgovcloudapi.net
    - Azure Secret: veservicecatalogussec.z1.web.core.`<SecretDomain>`
    - Azure Top Secret: veservicecatalogusnat.z2.web.core.`<TopSecretDomain>`

1. Download each template
   Continuing the script from the previous step

    ```
    # download all templates
    $urls | ForEach-Object {
        $url = $_.InnerText
        $fileName = Split-Path -Leaf $url
        Invoke-WebRequest -Uri $url -OutFile $fileName
    }
    ```

1. Open the template and determine which parameters you need to provide values for. In this example, we use "storageAccount/deploy-storage-account-1.0.0.json"

    Note which parameters are required and which parameters have default values.
    
    Create a new params.json file to provide the parameter values:
    ```
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

1. Fetch the enclave resources to provide the following parameter values
    - storageAccountName
    - virtualNetworkName
    - networkResourceGroupName
    - privateDnsZoneResourceGroupName
    - keyVaultName
    - keyVaultResourceGroupName
    - ID of userAssignedIdentityObject
    ```
    az rest --method get --uri "<enclave-resource-id>?api-version=2024-01-01-preview"
    ```
    You'll still need to fetch values privateLinkSubnetName, keyName, userAssignedIdentityObject

1. List the subnets in the virtual network (privateLinkSubnetName)
    ```
    az network vnet subnet list --resource-group <resource-group-name> --vnet-name <vnet-name> --query "[].name"
    ```

1. Get CMK Key Name (keyName)
    ```
    az keyvault key list --vault-name <keyvault-name> --query "[].name"
    ```

1. Get the location of userAssignedIdentityObject (userAssignedIdentityObject.location)
    ```
    az resource show --ids <user-assigned-identity-resource-id> --query location
    ```

1. Get the subscription name
    ```
    az account show --subscription <subscription-id> --query name
    ```

1. Deploy the template
    ```
    az deployment group create --resource-group <resource-group-name> --template-file ./<template-downloaded-name> --parameters ./<parameter-file-name>
    ```

    This script is for deploying a Template from the service catalog
    
    ```
    az storage blob list --account-name <storage-account-name> --container-name servicecatalog --query '[].{Name:name}'

    az storage blob download --account-name <storag-eaccount-name> --container-name servicecatalog --name <template-to-download-name> --file ./<template-downloaded-name>

    az rest --method get --uri "<enclave-resource-id>?api-version=2024-01-01-preview"

    az network vnet subnet list --resource-group <resource-group-name> --vnet-name <vnet-name> --query "[].name"

    az keyvault key list --vault-name <keyvault-name> --query "[].name"

    az resource show --ids <user-assigned-identity-resource-id> --query location

    az account show --subscription <subscription-id> --query name

    az deployment group create --resource-group <resource-group-name> --template-file ./<template-downloaded-name> --parameters ./<parameter-file-name>
    ```

## Delete the deployment
If you don't plan on keeping these resources, clean up unnecessary resources to avoid Azure charges. If no other deployments exist in the resource group, the whole resource group can be deleted.
