---
title: "Create an Immersive Reader Resource"
titleSuffix: Azure Cognitive Services
description: This article will show you how to create a new Immersive Reader resource with a custom subdomain and then configure Azure AD in your Azure tenant.
services: cognitive-services
author: rwaller
manager: guillasi

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: conceptual
ms.date: 07/22/2019
ms.author: rwaller
---

# Create an Immersive Reader resource and configure Azure Active Directory authentication

This article shows how to create an Immersive Reader resource and configure it with Azure Active Directory authentication.

## Set up Powershell environment

1. Start by opening the [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview). Ensure that the cloud shell is set to PowerShell in the upper-left hand dropdown or by typing `pwsh`.

1. Copy and paste the following code snippet into the shell.

    ```azurepowershell-interactive
    function Create-ImmersiveReaderResource(
        [Parameter(Mandatory=$true, Position=0)] [String] $SubscriptionName,
        [Parameter(Mandatory=$true)] [String] $ResourceGroupName,
        [Parameter(Mandatory=$false)] [String] $ResourceGroupLocation,
        [Parameter(Mandatory=$true)] [String] $ResourceName,
        [Parameter(Mandatory=$true)] [String] $ResourceLocation,
        [Parameter(Mandatory=$true)] [String] $ResourceSku,
        [Parameter(Mandatory=$true)] [String] $Subdomain,
        [Parameter(Mandatory=$true)] [String] $ClientSecret,
        [Parameter(Mandatory=$false)] [String] $ApplicationDisplayName="ImmersiveReaderAAD",
        [Parameter(Mandatory=$false)] [String] $IdentifierUri="http://ImmersiveReaderAAD"
    )
    {
        Write-Host "Setting the active subscription to '$SubscriptionName'"
        az account set --subscription $SubscriptionName

        Write-Host "Checking if the resource group '$ResourceGroupName' already exists"
        $resourceGroupExists = az group exists --name $ResourceGroupName
        if ($resourceGroupExists -eq "true") {
            Write-Host "Resource group exists"
        } else {
            Write-Host "Resource group does not exist. Creating resource group"
            az group create --name $ResourceGroupName --location $ResourceGroupLocation | Out-Null
        }

        # Create an Azure Active Directory resource if it doesn't already exist
        $resourceId = az cognitiveservices account show --resource-group $ResourceGroupName --name $ResourceName --query "id" -o tsv
        if (-not $resourceId) {
            Write-Host "Creating the new Immersive Reader resource '$ResourceName' (SKU '$ResourceSku') in '$ResourceLocation' with subdomain '$Subdomain'"
            $resourceId = az cognitiveservices account create `
                            --name $ResourceName `
                            --resource-group $ResourceGroupName `
                            --kind ImmersiveReader `
                            --sku $ResourceSku `
                            --location $ResourceLocation `
                            --custom-domain $Subdomain `
                            --query "id" `
                            -o tsv

            if (-not $resourceId) {
                throw "Error: Failed to create Immersive Reader resource"
            }
            Write-Host "Immersive Reader resource created successfully"
        }

        # Create an Azure Active Directory app if it doesn't already exist
        $clientId = az ad app show --id $IdentifierUri --query "appId" -o tsv
        if (-not $clientId) {
            Write-Host "Creating new Azure Active Directory app"
            $clientId = az ad app create --password $ClientSecret --display-name $ApplicationDisplayName --identifier-uris $IdentifierUri --query "appId" -o tsv

            if (-not $clientId) {
                throw "Error: Failed to create Azure Active Directory app"
            }
            Write-Host "Azure Active Directory app created successfully"
        }

        # Create a service principal if it doesn't already exist
        $principalId = az ad sp show --id $IdentifierUri --query "objectId" -o tsv
        if (-not $principalId) {
            Write-Host "Creating new service principal"
            az ad sp create --id $clientId | Out-Null
            $principalId = az ad sp show --id $IdentifierUri --query "objectId" -o tsv

            if (-not $principalId) {
                throw "Error: Failed to create new service principal"
            }
            Write-Host "New service principal created successfully"
        }

        Write-Host "Granting service principal access to the newly created Immersive Reader resource"
        $accessResult = az role assignment create --assignee $principalId --scope $resourceId --role "Cognitive Services User" | Out-Null
        if (-not $accessResult) {
                throw "Error: Failed to grant service principal access"
        }
        Write-Host "Service principal access granted successfully"

        # Grab the tenant ID, which is needed when obtaining an Azure AD token
        $tenantId = az account show --query "tenantId" -o tsv

        # Collect the information needed to obtain an Azure AD token into one object
        $result = @{}
        $result.TenantId = $tenantId
        $result.ClientId = $clientId
        $result.ClientSecret = $ClientSecret
        $result.Subdomain = $Subdomain

        Write-Host "Success! " -ForegroundColor Green -NoNewline
        Write-Host "Save the following JSON object to a text file for future reference:"
        Write-Output (ConvertTo-Json $result)
    }
    ```

1. Run the function `Create-ImmersiveReaderResource`, supplying the parameters as appropriate.

    ```azurepowershell-interactive
    Create-ImmersiveReaderResource
      -SubscriptionName <SUBSCRIPTION_NAME> `
      -ResourceGroupName <RESOURCE_GROUP_NAME> `
      -ResourceGroupLocation <RESOURCE_GROUP_LOCATION> `
      -ResourceName <RESOURCE_NAME> `
      -ResourceLocation <RESOURCE_LOCATION> `
      -ResourceSku <RESOURCE_SKU> `
      -Subdomain <SUBDOMAIN> `
      -ClientSecret <CLIENT_SECRET> `
      -ApplicationDisplayName <APP_DISPLAY_NAME> `
      -IdentifierUri <IDENTIFIER_URI>
    ```

    | Parameter | Comments |
    | --- | --- |
    | SubscriptionName |You must have an Azure subscription in order to create a resource |
    | ResourceGroupName |Resources are created in resource groups within subscriptions. Supply a name of an existing resource group. If this resource group does not already exist, this script will created a new one for you with this name |
    | ResourceGroupLocation |If your resource group doesn't exist, you need to supply a location in which to create the group. To find a list of locations, run `az account list-locations`. This parameter is optional if your resource group already exists |
    | ResourceName |  Must be alphanumeric, and may contain '-', as long as the '-' does not start or end the subdomain. Length must be <= 63|
    | ResourceLocation |Options: `eastus`, `eastus2`, `southcentralus`, `westus`, `westus2`, `australiaeast`, `southeastasia`, `centralindia`, `japaneast`, `northeurope`, `uksouth`, `westeurope` |
    | ResourceSku |Options: `S0`, `S1`, or `F0`. Visit our [Cognitive Services pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/immersive-reader/) to learn more about each available SKU |
    | Subdomain |This parameter is provided as a feature for Azure AD authentication for Cognitive Services. The subdomain must be globally unique |
    | ClientSecret |A password you create that will be used later to authenticate when acquiring a token to call the Immersive Reader |
    | ApplicationDisplayName |Must be alphanumeric, and may contain '-', as long as the '-' does not start or end the subdomain. Length must be <= 63. This parameter is optional if your Azure AD app already exists |
    | IdentifierUri |A unique URI that will be used for the Azure AD app that will be created. For example, `https://immersivereaderaad-mycompany` |

1. Copy the JSON output into a text file for later use. The output should look like the following.

    ```json
    {
      "TenantId": "...",
      "ClientId": "...",
      "ClientSecret": "...",
      "Subdomain": "..."
    }
    ```

## Next steps

* View the [Node.js tutorial](./tutorial-nodejs.md) to see what else you can do with the Immersive Reader SDK using Node.js
* View the [Python tutorial](./tutorial-python.md) to see what else you can do with the Immersive Reader SDK using Python
* View the [Swift tutorial](./tutorial-ios-picture-immersive-reader.md) to see what else you can do with the Immersive Reader SDK using Swift
* Explore the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) and the [Immersive Reader SDK Reference](./reference.md)




