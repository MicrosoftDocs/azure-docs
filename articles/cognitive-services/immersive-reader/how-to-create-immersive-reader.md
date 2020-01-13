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

In this article, we provide a script that will create an Immersive Reader resource and configure Azure Active Directory (Azure AD) authentication. Each time an Immersive Reader resource is created, whether with this script or in the portal, it must also be configured with Azure AD permissions. This script will help you with that.

The script is designed to create and configure all the necessary Immersive Reader and Azure AD resources for you all in one step. However, you can also just configure Azure AD authentication for an existing Immersive Reader resource, if for instance, you happen to have already created one in the Azure portal.

For some customers, it may be necessary to create multiple Immersive Reader resources, for development vs. production, or perhaps for multiple different regions your service is deployed in. For those cases, you can come back and use the script multiple times to create different Immersive Reader resources and get them configured with the Azure AD permissions.

The script is designed to be flexible. It will first look for existing Immersive Reader and Azure AD resources in your subscription, and create them only as necessary if they don't already exist. If it's your first time creating an Immersive Reader resource, the script will do everything you need. If you want to use it just to configure Azure AD for an existing Immersive Reader resource that was created in the portal, it will do that too. It can also be used to create and configure multiple Immersive Reader resources.

## Set up PowerShell environment

1. Start by opening the [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview). Ensure that the cloud shell is set to PowerShell in the upper-left hand dropdown or by typing `pwsh`.

1. Copy and paste the following code snippet into the shell.

    ```azurepowershell-interactive
    function Create-ImmersiveReaderResource(
        [Parameter(Mandatory=$true, Position=0)] [String] $SubscriptionName,
        [Parameter(Mandatory=$true)] [String] $ResourceName,
        [Parameter(Mandatory=$true)] [String] $ResourceSubdomain,
        [Parameter(Mandatory=$true)] [String] $ResourceSKU,
        [Parameter(Mandatory=$true)] [String] $ResourceLocation,
        [Parameter(Mandatory=$true)] [String] $ResourceGroupName,
        [Parameter(Mandatory=$true)] [String] $ResourceGroupLocation,
        [Parameter(Mandatory=$true)] [String] $AADAppDisplayName="ImmersiveReaderAAD",
        [Parameter(Mandatory=$true)] [String] $AADAppIdentifierUri,
        [Parameter(Mandatory=$true)] [String] $AADAppClientSecret
    )
    {
        Write-Host "Setting the active subscription to '$SubscriptionName'"
        $subscriptionExists = Get-AzSubscription -SubscriptionName $SubscriptionName
        if (-not $subscriptionExists) {
            throw "Error: Subscription does not exist"
        }
        az account set --subscription $SubscriptionName

        $resourceGroupExists = az group exists --name $ResourceGroupName
        if ($resourceGroupExists -eq "false") {
            Write-Host "Resource group does not exist. Creating resource group"
            $groupResult = az group create --name $ResourceGroupName --location $ResourceGroupLocation
            if (-not $groupResult) {
                throw "Error: Failed to create resource group"
            }
            Write-Host "Resource group created successfully"
        }

        # Create an Immersive Reader resource if it doesn't already exist
        $resourceId = az cognitiveservices account show --resource-group $ResourceGroupName --name $ResourceName --query "id" -o tsv
        if (-not $resourceId) {
            Write-Host "Creating the new Immersive Reader resource '$ResourceName' (SKU '$ResourceSKU') in '$ResourceLocation' with subdomain '$ResourceSubdomain'"
            $resourceId = az cognitiveservices account create `
                            --name $ResourceName `
                            --resource-group $ResourceGroupName `
                            --kind ImmersiveReader `
                            --sku $ResourceSKU `
                            --location $ResourceLocation `
                            --custom-domain $ResourceSubdomain `
                            --query "id" `
                            -o tsv

            if (-not $resourceId) {
                throw "Error: Failed to create Immersive Reader resource"
            }
            Write-Host "Immersive Reader resource created successfully"
        }

        # Create an Azure Active Directory app if it doesn't already exist
        $clientId = az ad app show --id $AADAppIdentifierUri --query "appId" -o tsv
        if (-not $clientId) {
            Write-Host "Creating new Azure Active Directory app"
            $clientId = az ad app create --password $AADAppClientSecret --display-name $AADAppDisplayName --identifier-uris $AADAppIdentifierUri --query "appId" -o tsv

            if (-not $clientId) {
                throw "Error: Failed to create Azure Active Directory app"
            }
            Write-Host "Azure Active Directory app created successfully"
        }

        # Create a service principal if it doesn't already exist
        $principalId = az ad sp show --id $AADAppIdentifierUri --query "objectId" -o tsv
        if (-not $principalId) {
            Write-Host "Creating new service principal"
            az ad sp create --id $clientId | Out-Null
            $principalId = az ad sp show --id $AADAppIdentifierUri --query "objectId" -o tsv

            if (-not $principalId) {
                throw "Error: Failed to create new service principal"
            }
            Write-Host "New service principal created successfully"
        }

        Write-Host "Granting service principal access to the newly created Immersive Reader resource"
        $accessResult = az role assignment create --assignee $principalId --scope $resourceId --role "Cognitive Services User"
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
        $result.ClientSecret = $AADAppClientSecret
        $result.Subdomain = $ResourceSubdomain

        Write-Host "Success! " -ForegroundColor Green -NoNewline
        Write-Host "Save the following JSON object to a text file for future reference:"
        Write-Output (ConvertTo-Json $result)
    }
    ```

1. Run the function `Create-ImmersiveReaderResource`, supplying the parameters as appropriate.

    ```azurepowershell-interactive
    Create-ImmersiveReaderResource
      -SubscriptionName <SUBSCRIPTION_NAME> `
      -ResourceName <RESOURCE_NAME> `
      -ResourceSubdomain <RESOURCE_SUBDOMAIN> `
      -ResourceSKU <RESOURCE_SKU> `
      -ResourceLocation <RESOURCE_LOCATION> `
      -ResourceGroupName <RESOURCE_GROUP_NAME> `
      -ResourceGroupLocation <RESOURCE_GROUP_LOCATION> `
      -AADAppDisplayName <AAD_APP_DISPLAY_NAME> `
      -AADAppIdentifierUri <AAD_APP_IDENTIFIER_URI> `
      -AADAppClientSecret <AAD_APP_CLIENT_SECRET>
    ```

    | Parameter | Comments |
    | --- | --- |
    | SubscriptionName |Name of the Azure subscription to use for your Immersive Reader resource. You must have a subscription in order to create a resource. |
    | ResourceName |  Must be alphanumeric, and may contain '-', as long as the '-' is not the first or last character. Length may not exceed 63 characters.|
    | ResourceSubdomain |A custom subdomain is needed for your Immersive Reader resource. The subdomain is used by the SDK when calling the Immersive Reader service to launch the Reader. The subdomain must be globally unique. The subdomain must be alphanumeric, and may contain '-', as long as the '-' is not the first or last character. Length may not exceed 63 characters. This parameter is optional if the resource already exists. |
    | ResourceSKU |Options: `S0` or `S1`. Visit our [Cognitive Services pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/immersive-reader/) to learn more about each available SKU. This parameter is optional if the resource already exists. |
    | ResourceLocation |Options: `eastus`, `eastus2`, `southcentralus`, `westus`, `westus2`, `australiaeast`, `southeastasia`, `centralindia`, `japaneast`, `northeurope`, `uksouth`, `westeurope`. This parameter is optional if the resource already exists. |
    | ResourceGroupName |Resources are created in resource groups within subscriptions. Supply the name of an existing resource group. If the resource group does not already exist, a new one with this name will be created. |
    | ResourceGroupLocation |If your resource group doesn't exist, you need to supply a location in which to create the group. To find a list of locations, run `az account list-locations`. Use the *name* property (without spaces) of the returned result. This parameter is optional if your resource group already exists. |
    | AADAppDisplayName |The Azure Active Directory application display name. If an existing Azure AD application is not found, a new one with this name will be created. This parameter is optional if the Azure AD application already exists. |
    | AADAppIdentifierUri |The URI for the Azure AD app. If an existing Azure AD app is not found, a new one with this URI will be created. For example, `https://immersivereaderaad-mycompany`. |
    | AADAppClientSecret |A password you create that will be used later to authenticate when acquiring a token to launch the Immersive Reader. The password must be at least 16 characters long, contain at least 1 special character, and contain at least 1 numeric character. |

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

* View the [Node.js quickstart](./quickstart-nodejs.md) to see what else you can do with the Immersive Reader SDK using Node.js
* View the [Python tutorial](./tutorial-python.md) to see what else you can do with the Immersive Reader SDK using Python
* View the [Swift tutorial](./tutorial-ios-picture-immersive-reader.md) to see what else you can do with the Immersive Reader SDK using Swift
* Explore the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) and the [Immersive Reader SDK Reference](./reference.md)




