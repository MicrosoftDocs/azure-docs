---
title: 'Quickstart: Create a lab with REST API'
description: In this quickstart, you create a lab in Azure DevTest Labs by using an Azure REST API.
ms.topic: quickstart
ms.author: rosemalcolm
author: RoseHJM
ms.date: 10/27/2021
ms.custom: mode-api, UpdateFrequency2
#Customer intent: As an administrator, I want to set up a lab so that my developers have a test environment.
---

# Quickstart: Create a lab in Azure DevTest Labs using Azure REST API

Get started with Azure DevTest Labs by using the Azure REST API. Azure DevTest Labs encompasses a group of resources, such as Azure virtual machines (VMs) and networks. This infrastructure lets you better manage those resources by specifying limits and quotas.  The Azure REST API allows you to manage operations on services hosted in the Azure platform.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The PowerShell [Az Module](/powershell/azure/new-azureps-module-az) installed. Ensure you have the latest version. If necessary, run `Update-Module -Name Az`.

## Prepare request body

Prepare the [request body](/rest/api/dtl/labs/create-or-update#request-body) to be consumed by the REST call.

Copy and paste the following JSON syntax into a file called `body.json`. Save the file on your local machine or in an Azure storage account.

```json
{
  "properties": {
    "labStorageType": "Standard"
  },
  "location": "westus2",
  "tags": {
    "Env": "alpha"
  }
}
```

## Sign in to your Azure subscription

1. Provide an appropriate value for the variables and then execute the script.

    ```powershell
    $subscription = "subscriptionID"
    $resourceGroup = "resourceGroupName"
    $labName = "labName"
    $file = "path\body.json"
    ```

1. From your workstation, sign in to your Azure subscription with the PowerShell [Connect-AzAccount](/powershell/module/Az.Accounts/Connect-AzAccount) cmdlet and follow the on-screen directions.

    ```powershell
    # Sign in to your Azure subscription
    $sub = Get-AzSubscription -ErrorAction SilentlyContinue
    if(-not($sub))
    {
        Connect-AzAccount
    }
    
    # If you have multiple subscriptions, set the one to use
    # Set-AzContext -SubscriptionId $subscription
    ```

## Build request body for submission

The syntax for the PUT request is:<br>
 `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DevTestLab/labs/{name}?api-version=2018-09-15`.

 Execute the following PowerShell scripts to pass the request value to a parameter. The contents of the request body is passed to a parameter as well.

```powershell
# build URI
$URI = "https://management.azure.com/subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.DevTestLab/labs/$labName`?api-version=2018-09-15"

# build body
$body = Get-Content $file
```

## Obtain an authentication token

Use the following commands to retrieve an authentication token:

```powershell
$azContext = Get-AzContext
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$profileClient = New-Object -TypeName Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient -ArgumentList ($azProfile)
$token = $profileClient.AcquireAccessToken($azContext.Subscription.TenantId)
$authHeader = @{
    'Content-Type'='application/json'
    'Authorization'='Bearer ' + $token.AccessToken
}
```

## Invoke the REST API

Use the following commands to invoke the REST API and review the response.

```powershell
# Invoke the REST API
$response = Invoke-RestMethod -Uri $URI -Method PUT -Headers $authHeader -Body $body

# Review output
$response | ConvertTo-Json
```

The response should look similar to the following text:

```output
{
    "properties":  {
                       "labStorageType":  "Standard",
                       "mandatoryArtifactsResourceIdsLinux":  [

                                                              ],
                       "mandatoryArtifactsResourceIdsWindows":  [

                                                                ],
                       "createdDate":  "2021-10-27T20:22:49.7495913+00:00",
                       "premiumDataDisks":  "Disabled",
                       "environmentPermission":  "Reader",
                       "announcement":  {
                                            "title":  "",
                                            "markdown":  "",
                                            "enabled":  "Disabled",
                                            "expired":  false
                                        },
                       "support":  {
                                       "enabled":  "Disabled",
                                       "markdown":  ""
                                   },
                       "provisioningState":  "Creating",
                       "uniqueIdentifier":  "uniqueID"
                   },
    "id":  "/subscriptions/ContosoID/resourcegroups/groupcontoso/providers/microsoft.devtestlab/labs/myotherlab",

    "name":  "myOtherLab",
    "type":  "Microsoft.DevTestLab/labs",
    "location":  "westus2",
    "tags":  {
                 "Env":  "alpha"
             }
}
```

## Clean up resources

If you're not going to continue to use this lab, delete it with the following steps:

1. Provide an appropriate value for the variables and then execute the script.

    ```powershell
    $subscription = "subscriptionID"
    $resourceGroup = "resourceGroupName"
    $labName = "labName"
    ```

1. Execute the following script to remove the named lab from Azure DevTest Labs.

    ```powershell
    # build URI
    $URI = "https://management.azure.com/subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.DevTestLab/labs/$labName`?api-version=2018-09-15"
    
    # obtain access token
    $azContext = Get-AzContext
    $azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
    $profileClient = New-Object -TypeName Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient -ArgumentList ($azProfile)
    $token = $profileClient.AcquireAccessToken($azContext.Subscription.TenantId)
    $authHeader = @{
        'Content-Type'='application/json'
        'Authorization'='Bearer ' + $token.AccessToken
    }
    
    # Invoke the REST API
    Invoke-RestMethod -Uri $URI -Method DELETE -Headers $authHeader
    ```

## Next steps

In this quickstart, you created a lab using the Azure REST API. To learn how to access the lab, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Access the lab](../tutorial-use-custom-lab.md)
