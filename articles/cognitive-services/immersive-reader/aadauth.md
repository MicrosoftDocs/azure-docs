---
title: "Azure Active Directory (AAD) authentication"
titleSuffix: Azure Cognitive Services
description: Reference for the Immersive Reader SDK
services: cognitive-services
author: rwaller
manager: guillasi

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: reference
ms.date: 07/22/2019
ms.author: rwaller
---

## Use Azure Active Directory (AAD) authentication tokens with the Immersive Reader service

In the following sections, you'll use either the Azure Cloud Shell environment or the Azure CLI to create a new Immersive Reader resource with a custom subdomain, configure AAD in your Azure tenant, grant AAD access to the Immersive Reader resource, and then obtain an AAD access token to use with the Immersive Reader SDK. If you get stuck, links are provided in each section with all available options for each command in Azure Cloud Shell/Azure CLI.

### Create an Immersive Reader resource with a custom subdomain

1. Start by opening the [Azure Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview). Then [select a subscription](https://docs.microsoft.com/powershell/module/servicemanagement/azure/select-azuresubscription?view=azuresmps-4.0.0#description):

   ```azurecli-interactive
   Select-AzureSubscription -SubscriptionName <YOUR_SUBCRIPTION>
   ```

2. Next, [create an Immersive Reader resource](https://docs.microsoft.com/powershell/module/az.cognitiveservices/new-azcognitiveservicesaccount?view=azps-1.8.0) with a custom subdomain. 

   >[!NOTE]
   > The Subdomain name is used in Immersive Reader SDK when launching the Reader with the launchAsync() method.

   -SkuName can be F0 (Free tier) or S0 (Standard tier, also free during public preview). The S0 tier has a higher call rate limit and no monthly quota on the number of calls.

   -Location can be any of the following: `eastus`, `westus`, `austrailiaeast`, `centralindia`, `japaneast`, `northeurope`, `westeurope`
   
   -CustomSubdomainName needs to be globally unique and cannot include special characters, such as: ".", "!", ",".


   ```azurecli-interactive
   $resource = New-AzCognitiveServicesAccount -ResourceGroupName <RESOURCE_GROUP_NAME> -name <RESOURCE_NAME> -Type ImmersiveReader -SkuName S0 -Location <REGION> -CustomSubdomainName <UNIQUE_SUBDOMAIN>

   // Display the Resource info
   $resource
   ```

   If successful, the resource **Endpoint** should show the subdomain name unique to your resource.

   Here we are capturing the newly created resource object into a **$resource** variable, as it will be used later when granting access to this resource.


   >[!NOTE]
   > If you create a resource in the Azure portal, the resource 'Name' is used as the custom subdomain. You can check the subdomain name in the portal by going to the resource Overview page and finding the subdomain in the Endpoint listed there, e.g. `https://[SUBDOMAIN].cognitiveservices.azure.com/`. You can also check here later when you need to get the subdomain for integrating with the SDK.

   If the resource was created in the portal, you can also [get an existing resource](https://docs.microsoft.com/en-us/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccount?view=azps-1.8.0) now.

   ```azurecli-interactive
   $resource = Get-AzCognitiveServicesAccount -ResourceGroupName <RESOURCE_GROUP_NAME> -name <RESOURCE_NAME>

   // Display the Resource info
   $resource
   ```   

### Assign a role to a service principal

Now that you have a custom subdomain associated with your resource, you need to assign a role to a service principal.

1. First, let's [create an AAD application](https://docs.microsoft.com/powershell/module/Az.Resources/New-AzADApplication?view=azps-1.8.0).

   >[!NOTE]
   > The Password, also known as the 'client secret', will be used when obtaining authentication tokens.

   ```azurecli-interactive
   $password = <YOUR_PASSWORD>
   $aadApp = New-AzADApplication -DisplayName <APP_DISPLAY_NAME> -IdentifierUris <APP_URIS> -Password $password

   // Display the AAD app info
   $aadApp
   ```

   Here we are capturing the newly created AAD app object into an **$aadApp** variable for use in the next step.   

2. Next, you need to [create a service principal](https://docs.microsoft.com/powershell/module/az.resources/new-azadserviceprincipal?view=azps-1.8.0) for the AAD application.

   ```azurecli-interactive
   $principal = New-AzADServicePrincipal -ApplicationId $aadApp.Id

   // Display the service principal info
   $principal
   ```

   Here we are capturing the newly created Service Principal object into a **$principal** variable for use in the next step.


3. The last step is to [assign the "Cognitive Services User" role](https://docs.microsoft.com/powershell/module/az.Resources/New-azRoleAssignment?view=azps-1.8.0) to the service principal (scoped to the resource). By assigning a role, you're granting service principal access to this resource. You can grant the same service principal access to multiple resources in your subscription.

   ```azurecli-interactive
   New-AzRoleAssignment -ObjectId $principal.Id -Scope $resource.Id -RoleDefinitionName "Cognitive Services User"
   ```

### Obtain an AAD token

In this example, your password is used to authenticate the service principal to obtain an AAD token.

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
   > The Immersive Reader SDK uses the AccessToken property of the token, e.g. $token.AccessToken. See the SDK [reference](reference.md) and code [samples](https://github.com/microsoft/immersive-reader-sdk/tree/master/samples) for details.

Alternatively, the service principal can be authenticated with a certificate. Besides service principal, user principal is also supported by having permissions delegated through another AAD application. In this case, instead of passwords or certificates, users would be prompted for two-factor authentication when acquiring token.