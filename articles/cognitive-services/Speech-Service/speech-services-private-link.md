---
title: Using Speech Services with private endpoints
titleSuffix: Azure Cognitive Services
description: HowTo on using Speech Services with private endpoints provided by Azure Private Link
services: cognitive-services
author: alexeyo26
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/04/2020
ms.author: alexeyo
---

# Using Speech Services with private endpoints provided by Azure Private Link

[Azure Private Link](../../private-link/private-link-overview.md) allows you to connect to various PaaS services in Azure via a [private endpoint](../../private-link/private-endpoint-overview.md). A private endpoint is a private IP address within a specific [virtual network](../../virtual-network/virtual-networks-overview.md) and subnet.

This article explains how to set up and use Private Link and private endpoints with Azure Cognitive Speech Services. 

> [!NOTE]
    > This article explains the specifics of setting up and using Private Link with Azure Cognitive Speech Services. Before proceeding further please get familiar with the general article on [using virtual netowrks with Cognitive Services](../cognitive-services-virtual-networks.md).

# Create custom domain name

Private endpoints require the usage of [Cognitive Services custom subdomain names](../cognitive-services-custom-subdomains.md). Use the instructions below to create the one for your Speech resource.

> [!WARNING]
> A Speech resource with custom domain name enabled uses a different way to interact with Speech Services. Most likely you will have to adjust your application code for (private endpoint enabled) !!! and (**not** private endpoint enabled) !!! scenarios.
>
> Operation of enabling custom domain name is [**not reversible**](../cognitive-services-custom-subdomains.md#can-i-change-a-custom-domain-name). The only way to go back to the [regional name](../cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints) is to create a new Speech resource. 
>
> Especially in cases where your Speech resource has a lot of associated custom models and projects created via [Speech Studio](https://speech.microsoft.com/) we **strongly** recommend to try the configuration with a test resource and only then modify the one used in production.

# [Azure portal](#tab/portal)

- Go to [Azure portal](https://portal.azure.com/)
- Select the required Speech Resource
- Select *Networking* (*Resource management* group) 
- In *Firewalls and virtual networks* tab (default) click **Generate Custom Domain Name** button
- This opens a panel with instructions to create a unique custom subdomain for your resource
> [!WARNING]
   > After you have created a custom domain name it **cannot** be changed. See more information in the Warning above.
- After the operation is complete you may want to select *Keys and Endpoint* (*Resource management* group) and verify the new endpoint name of your resource in the format of `{your custom name}.cognitiveservices.azure.com`

# [PowerShell](#tab/powershell)

This section requires locally running PowerShell version 7.x or later with the Azure PowerShell module version 5.1.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps) .

Before proceeding further run `Connect-AzAccount` to create a connection with Azure.

> [!TIP]
> The code below will **NOT** work in Azure Cloud Shell.

**Verify custom domain name availability**

You need to check whether the custom domain your would like to use is free. We will use [Check Domain Availability](/rest/api/cognitiveservices/accountmanagement/checkdomainavailability/checkdomainavailability) method from Cognitive Services REST API. See comments in the code block below explaining the steps.

```azurepowershell
$subId = "Your Azure subscription Id"
$subdomainName = "custom domain name"

# Select the Azure subscription containing Speech resource
# If your Azure account has only one active subscription
# you can skip this step
Set-AzContext -SubscriptionId $subId

# Preparing OAuth token which is used in request
# to Cognitive Services REST API
$Context = Get-AzContext
$AccessToken = (Get-AzAccessToken -TenantId $Context.Tenant.Id).Token
$token = ConvertTo-SecureString -String $AccessToken -AsPlainText -Force

# Preparing and executing the request to Cognitive Services REST API
$uri = "https://management.azure.com/subscriptions/" + $subId + `
    "/providers/Microsoft.CognitiveServices/checkDomainAvailability?api-version=2017-04-18"
$body = @{
subdomainName = $subdomainName
type = "Microsoft.CognitiveServices/accounts"
}
$jsonBody = $body | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri $uri -ContentType "application/json" -Authentication Bearer `
    -Token $token -Body $jsonBody | Format-List
```
If the desired name is available you will get a response like this:
```bash
isSubdomainAvailable : True
reason               :
type                 :
subdomainName        : my-custom-name
```
If the name is already taken, then you will get the following response:
```bash
isSubdomainAvailable : False
reason               : Sub domain name 'my-custom-name' is already used. Please pick a different name.
type                 :
subdomainName        : my-custom-name
```
**Enabling custom domain name**

To enable custom domain name for the selected Speech Resource we use [Set-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/set-azcognitiveservicesaccount) cmdlet. See comments in the code block below explaining the steps.

> [!WARNING]
   > After successful execution of the code below you will create a custom domain name. This name **cannot** be changed. See more information in the Warning above.

```azurepowershell
$resourceGroup = "Resource group name where Speech resource is located"
$speechResourceName = "Your Speech resource name"
$subdomainName = "custom domain name"

# Select the Azure subscription containing Speech resource
# If your Azure account has only one active subscription
# you can skip this step
$subId = "Your Azure subscription Id"
Set-AzContext -SubscriptionId $subId

# Set the custom domain name to the selected resource
# WARNING! THIS IS NOT REVERSIBLE!
Set-AzCognitiveServicesAccount -ResourceGroupName $resourceGroup `
    -Name $speechResourceName -CustomSubdomainName $subdomainName
```

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

- This section requires the latest version of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Next section