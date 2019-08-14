---
title: "Azure Active Directory (Azure AD) authentication"
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

# Use Azure Active Directory (Azure AD) authentication with the Immersive Reader service

In the following sections, you will use either the Azure Cloud Shell environment or the Azure CLI to create a new Immersive Reader resource with a custom subdomain and then configure Azure AD in your Azure tenant. After completing that initial configuration, you will call Azure AD to obtain an access token, similar to how it will be done when using the Immersive Reader SDK. If you get stuck, links are provided in each section with all the available options for each of the Azure CLI commands.

## Create an Immersive Reader resource with a custom subdomain

1. Start by opening the [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview). Then [select a subscription](https://docs.microsoft.com/powershell/module/servicemanagement/azure/select-azuresubscription?view=azuresmps-4.0.0#description):

   ```azurecli-interactive
   Select-AzSubscription -SubscriptionName <YOUR_SUBSCRIPTION>
   ```

2. Next, [create an Immersive Reader resource](https://docs.microsoft.com/powershell/module/az.cognitiveservices/new-azcognitiveservicesaccount?view=azps-1.8.0) with a custom subdomain.

   >[!NOTE]
   > The Subdomain name is used in Immersive Reader SDK when launching the Reader with the launchAsync function.

   -SkuName can be F0 (Free tier) or S0 (Standard tier, also free during public preview). The S0 tier has a higher call rate limit and no monthly quota on the number of calls.

   -Location can be any of the following: `eastus`, `westus`, `australiaeast`, `centralindia`, `japaneast`, `northeurope`, `westeurope`

   -CustomSubdomainName needs to be globally unique and cannot include special characters, such as: ".", "!", ",".


   ```azurecli-interactive
   $resource = New-AzCognitiveServicesAccount -ResourceGroupName <RESOURCE_GROUP_NAME> -name <RESOURCE_NAME> -Type ImmersiveReader -SkuName S0 -Location <REGION> -CustomSubdomainName <UNIQUE_SUBDOMAIN>

   // Display the Resource info
   $resource
   ```

   If successful, the resource **Endpoint** should show the subdomain name unique to your resource.

   Here we are capturing the newly created resource object into a **$resource** variable, as it will be used later when granting access to this resource.


   >[!NOTE]
   > If you create a resource in the Azure portal, the resource 'Name' is used as the custom subdomain. You can check the subdomain name in the portal by going to the resource Overview page and finding the subdomain in the Endpoint listed there, for example, `https://[SUBDOMAIN].cognitiveservices.azure.com/`. You can also check here later when you need to get the subdomain for integrating with the SDK.

   If the resource was created in the portal, you can also [get an existing resource](https://docs.microsoft.com/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccount?view=azps-1.8.0) now.

   ```azurecli-interactive
   $resource = Get-AzCognitiveServicesAccount -ResourceGroupName <RESOURCE_GROUP_NAME> -name <RESOURCE_NAME>

   // Display the Resource info
   $resource
   ```

## Assign a role to a service principal

Now that you have a custom subdomain associated with your resource, you need to assign a role to a service principal.

1. First, let's [create an Azure AD application](https://docs.microsoft.com/powershell/module/Az.Resources/New-AzADApplication?view=azps-1.8.0).

   >[!NOTE]
   > The Password, also known as the 'client secret', will be used when obtaining authentication tokens.

   ```azurecli-interactive
   $password = "<YOUR_PASSWORD>"
   $secureStringPassword = ConvertTo-SecureString -String $password -AsPlainText -Force
   $aadApp = New-AzADApplication -DisplayName ImmersiveReaderAAD -IdentifierUris http://ImmersiveReaderAAD -Password $secureStringPassword

   // Display the Azure AD app info
   $aadApp
   ```

   Here we are capturing the newly created Azure AD app object into an **$aadApp** variable for use in the next step.

2. Next, you need to [create a service principal](https://docs.microsoft.com/powershell/module/az.resources/new-azadserviceprincipal?view=azps-1.8.0) for the Azure AD application.

   ```azurecli-interactive
   $principal = New-AzADServicePrincipal -ApplicationId $aadApp.ApplicationId

   // Display the service principal info
   $principal
   ```

   Here we are capturing the newly created Service Principal object into a **$principal** variable for use in the next step.


3. The last step is to [assign the "Cognitive Services User" role](https://docs.microsoft.com/powershell/module/az.Resources/New-azRoleAssignment?view=azps-1.8.0) to the service principal (scoped to the resource). By assigning a role, you are granting the service principal access to this resource. You can grant the same service principal access to multiple resources in your subscription.

   ```azurecli-interactive
   New-AzRoleAssignment -ObjectId $principal.Id -Scope $resource.Id -RoleDefinitionName "Cognitive Services User"
   ```

   >[!NOTE]
   > This step needs to be performed for each Immersive Reader resource you create. For example, if you create multiple resources for different global regions, then you will need to perform this step for each of those regional resources so that the Azure AD authentication works for all of them. Or, if you create a new resource at a later point in time, you will need to perform this role assignment step for that new resource as well.


## Obtain an Azure AD token

In this example, your password is used to authenticate the service principal to obtain an Azure AD token.

1. Get your **TenantId**:
   ```azurecli-interactive
   $context = Get-AzContext
   $context.Tenant.Id
   ```

2. Get a token:
   ```azurecli-interactive
   $authority = "https://login.windows.net/" + $context.Tenant.Id
   $resource = "https://cognitiveservices.azure.com/"
   $authContext = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext" -ArgumentList $authority
   $clientCredential = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.ClientCredential" -ArgumentList $aadApp.ApplicationId, $password
   $token = $authContext.AcquireTokenAsync($resource, $clientCredential).Result
   $token
   ```

   >[!NOTE]
   > The Immersive Reader SDK uses the AccessToken property of the token, e.g. $token.AccessToken. See the SDK [reference](reference.md) and code [samples](https://github.com/microsoft/immersive-reader-sdk/tree/master/js/samples) for details.

Alternatively, the service principal can be authenticated with a certificate. In addition to a service principal, user principals are also supported by having permissions delegated through another Azure AD application. In this case, instead of passwords or certificates, users would be prompted for two-factor authentication when acquiring tokens.

## Next steps

* View the [Node.js tutorial](./tutorial-nodejs.md) to see what else you can do with the Immersive Reader SDK using Node.js
* View the [Python tutorial](./tutorial-python.md) to see what else you can do with the Immersive Reader SDK using Python
* View the [Swift tutorial](./tutorial-ios-picture-immersive-reader.md) to see what else you can do with the Immersive Reader SDK using Swift
* Explore the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) and the [Immersive Reader SDK Reference](./reference.md)