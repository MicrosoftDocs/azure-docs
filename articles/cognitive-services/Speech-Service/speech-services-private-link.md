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
> This article explains the specifics of setting up and using Private Link with Azure Cognitive Speech Services. Before proceeding further please get familiar with the general article on [using virtual networks with Cognitive Services](../cognitive-services-virtual-networks.md).

## Create custom domain name

Private endpoints require the usage of [Cognitive Services custom subdomain names](../cognitive-services-custom-subdomains.md). Use the instructions below to create the one for your Speech resource.

> [!WARNING]
> A Speech resource with custom domain name enabled uses a different way to interact with Speech Services. Most likely you will have to adjust your application code for (private endpoint enabled) !!! and (**not** private endpoint enabled) !!! scenarios.
>
> Operation of enabling custom domain name is [**not reversible**](../cognitive-services-custom-subdomains.md#can-i-change-a-custom-domain-name). The only way to go back to the [regional name](../cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints) is to create a new Speech resource. 
>
> Especially in cases where your Speech resource has a lot of associated custom models and projects created via [Speech Studio](https://speech.microsoft.com/) we **strongly** recommend trying the configuration with a test resource and only then modifying the one used in production.

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

## Verify custom domain name availability

You need to check whether the custom domain your would like to use is free. We will use [Check Domain Availability](/rest/api/cognitiveservices/accountmanagement/checkdomainavailability/checkdomainavailability) method from Cognitive Services REST API. See comments in the code block below explaining the steps.

> [!TIP]
> The code below will **NOT** work in Azure Cloud Shell.

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
```azurepowershell
isSubdomainAvailable : True
reason               :
type                 :
subdomainName        : my-custom-name
```
If the name is already taken, then you will get the following response:
```azurepowershell
isSubdomainAvailable : False
reason               : Sub domain name 'my-custom-name' is already used. Please pick a different name.
type                 :
subdomainName        : my-custom-name
```
## Enabling custom domain name

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

## Verify custom domain name availability

You need to check whether the custom domain your would like to use is free. We will use [Check Domain Availability](/rest/api/cognitiveservices/accountmanagement/checkdomainavailability/checkdomainavailability) method from Cognitive Services REST API. 

Copy the code block below, insert the custom domain name and save to the file `subdomain.json`.

```json
{
	"subdomainName": "custom domain name",
	"type": "Microsoft.CognitiveServices/accounts"
}
```

Copy the file to your current folder or upload it to Azure Cloud Shell and execute the following command. (Replace `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` with your Azure subscription Id).

```azurecli-interactive
az rest --method post --url "https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/providers/Microsoft.CognitiveServices/checkDomainAvailability?api-version=2017-04-18" --body @subdomain.json
```
If the desired name is available you will get a response like this:
```azurecli
{
  "isSubdomainAvailable": true,
  "reason": null,
  "subdomainName": "my-custom-name",
  "type": null
}
```

If the name is already taken, then you will get the following response:
```azurecli
{
  "isSubdomainAvailable": false,
  "reason": "Sub domain name 'my-custom-name' is already used. Please pick a different name.",
  "subdomainName": "my-custom-name",
  "type": null
}
```
## Enabling custom domain name

To enable custom domain name for the selected Speech Resource we use [az cognitiveservices account update](/cli/azure/cognitiveservices/account?view=azure-cli-latest#az_cognitiveservices_account_update) command.

Select the Azure subscription containing Speech resource. If your Azure account has only one active subscription you can skip this step. (Replace `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` with your Azure subscription Id).
```azurecli-interactive
az account set --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
Set the custom domain name to the selected resource. Replace the sample parameter values with the actual ones and execute the command below.
> [!WARNING]
> After successful execution of the command below you will create a custom domain name. This name **cannot** be changed. See more information in the Warning above.
```azurecli
az cognitiveservices account update --name my-speech-resource-name --resource-group my-resource-group-name --custom-domain my-custom-name
```

***

## Enabling private endpoints

Enable private endpoint using Azure portal, Azure PowerShell or Azure CLI.

We recommend using the [private DNS zone](../../dns/private-dns-overview.md) attached to the Virtual Network with the necessary updates for the private endpoints, which we create by default during the provisioning process. However, if you are using your own DNS server, you may need to make additional changes to your DNS configuration. See [DNS for private endpoints](#dns-for-private-endpoints) section. We recommend to decide on DNS strategy **before** provisioning private endpoint(s) for a production Speech resource. We also recommend preliminary testing, especially if you are using your own DNS server.

Use the following articles to create private endpoint(s). The articles using a Web app as a sample resource to enable with private endpoints. Use instead the following parameters:

| Setting | Value |
| ------- | ----- |
| Resource type | **Microsoft.CognitiveServices/accounts** |
| Resource | **\<your-speech-resource-name>**  |
| Target sub-resource | **account** |

- [Create a Private Endpoint using the Azure portal](../../private-link/create-private-endpoint-portal.md)
- [Create a Private Endpoint using Azure PowerShell](../../private-link/create-private-endpoint-powershell.md)
- [Create a Private Endpoint using Azure CLI](../../private-link/create-private-endpoint-cli.md)

### DNS for private endpoints

Get familiar with the general principles of [DNS for private endpoints for Cognitive Services resources](../cognitive-services-virtual-networks.md#dns-changes-for-private-endpoints). Then check that your DNS configuration is working correctly (see next sub-sections).

#### (Mandatory check). DNS resolution from the Virtual Network

We will use `my-private-link-speech.cognitiveservices.azure.com` as a sample Speech resource DNS name for this section.

Log on to a virtual machine located in the virtual network to which you have attached your private endpoint. Open Windows Command Prompt or Bash shell, execute 'nslookup' command and ensure it successfully resolves your resource custom domain name:
```dos
C:\>nslookup my-private-link-speech.cognitiveservices.azure.com
Server:  UnKnown
Address:  168.63.129.16

Non-authoritative answer:
Name:    my-private-link-speech.privatelink.cognitiveservices.azure.com
Address:  172.28.0.10
Aliases:  my-private-link-speech.cognitiveservices.azure.com
```
Check that the IP address resolved corresponds to the address of your private endpoint.

#### (Optional check). DNS resolution from other networks

This check is necessary if you plan to use your private endpoint enabled Speech resource in "hybrid" mode, that is you have enabled *All networks* or *Selected Networks and Private Endpoints* access option in the *Networking* section of your resource. If you plan to access the resource using only private endpoint you can skip this section.

We will use `my-private-link-speech.cognitiveservices.azure.com` as a sample Speech resource DNS name for this section.

On any machine attached to a network from which you allow access to the resource open Windows Command Prompt or Bash shell, execute 'nslookup' command and ensure it successfully resolves your resource custom domain name:
```dos
C:\>nslookup my-private-link-speech.cognitiveservices.azure.com
Server:  UnKnown
Address:  fe80::1

Non-authoritative answer:
Name:    vnetproxyv1-weu-prod.westeurope.cloudapp.azure.com
Address:  13.69.67.71
Aliases:  my-private-link-speech.cognitiveservices.azure.com
          my-private-link-speech.privatelink.cognitiveservices.azure.com
          westeurope.prod.vnet.cog.trafficmanager.net
```

Note that IP address resolved points to a VNet Proxy endpoint which is used for dispatching the network traffic to a private endpoint enabled Cognitive Services resource. This behaviour will be different for a resource with custom domain name enabled, but *without* private endpoints configured. See !!!


### Pricing

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).

## Next steps

* Learn more about [Azure Private Link](../../private-link/private-link-overview.md)