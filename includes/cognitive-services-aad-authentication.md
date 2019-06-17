---
author: erhopf
ms.author: erhopf
ms.service: cognitive-services
ms.topic: include
ms.date: 06/30/2019
---

## Authenticate with Azure Active Directory

> [!IMPORTANT]
> Currently, Azure Speech Services and Microsoft Translator Text APIs **do not** support authentication using AAD.

In the previous sections, we showed you how to authenticate against Azure Cognitive Services using either a single-service or multi-service subscription key. While these keys provide a quick and easy path to start development, they fall short in more complex scenarios that require role-based access controls. Let's take a look at what's required to authenticate using Azure Active Directory (AAD).

In the following sections, you'll use either the Azure Cloud Shell environment or the Azure CLI to create a subdomain, assign roles, and obtain a bearer token to call the Azure Cognitive Services.

### Create a resource with a custom subdomain

The first step is to create a custom subdomain.

1. Start by opening the Azure Cloud Shell. then [select a subscription](https://docs.microsoft.com/powershell/module/servicemanagement/azure/select-azuresubscription?view=azuresmps-4.0.0#description):

   ```Powershell
   Select-AzureSubscription -SubscriptionName <YOUR_SUBCRIPTION>
   ```

2. Next, [create a Cognitive Services resource](https://docs.microsoft.com/powershell/module/az.cognitiveservices/new-azcognitiveservicesaccount?view=azps-1.8.0) with a custom subdomain. The subdomain name needs to be globally unique and cannot include special characters, such as: ".", "!", ",".

   ```Powershell
   New-AzCognitiveServicesAccount -ResourceGroupName <RESOURCE_GROUP_NAME> -name <ACCOUNT_NAME> -Type <ACCOUNT_TYPE> -SkuName <SUBSCRIPTION_TYPE> -Location <REGION> -CustomSubdomainName <UNIQUE_SUBDOMAIN>
   ```

3. If successful, the **Endpoint** should show the subdomain name unique to your resource.


### Assign a role to a service principal

Now that you have a custom subdomain associated with your resource, you're going to need to assign a role to a service principal.

1. First, let's register an [AAD application](https://docs.microsoft.com/powershell/module/Az.Resources/New-AzADApplication?view=azps-1.8.0).

   ```Powershell
   $SecureStringPassword = ConvertTo-SecureString -String <YOUR_PASSWORD> -AsPlainText -Force

   New-AzADApplication -DisplayName <APP_DISPLAY_NAME> -IdentifierUris <APP_URIS> -Password $SecureStringPassword
   ```

### Sample request
