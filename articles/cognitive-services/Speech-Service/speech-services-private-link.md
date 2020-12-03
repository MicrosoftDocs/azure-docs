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

Private endpoints require the usage of [Cognitive Services custom subdomain names](../cognitive-services-custom-subdomains.md). Use the instructions below to create one for your Speech resource.

> [!WARNING]
> A Speech resource with custom domain name enabled uses a different way to interact with Speech Services. Most likely you will have to adjust your application code for both (private endpoint enabled) !!! and (**not** private endpoint enabled) !!! scenarios.
>
> Operation of enabling custom domain name is [**not reversible**](../cognitive-services-custom-subdomains.md#can-i-change-a-custom-domain-name). The only way to go back to the [regional name](../cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints) is to create a new Speech resource. 
>
> Especially in cases where your Speech resource has a lot of associated custom models and projects created via [Speech Studio](https://speech.microsoft.com/) we **strongly** recommend trying the configuration with a test resource and only then modifying the one used in production.

# [Azure portal](#tab/portal)

- Go to [Azure portal](https://portal.azure.com/) and sign in to your Azure account
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
> After successful execution of the code below you will create a custom domain name for your Speech resource. This name **cannot** be changed. See more information in the Warning above.

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
> After successful execution of the command below you will create a custom domain name for your Speech resource. This name **cannot** be changed. See more information in the Warning above.
```azurecli
az cognitiveservices account update --name my-speech-resource-name --resource-group my-resource-group-name --custom-domain my-custom-name
```

***

## Enabling private endpoints

Enable private endpoint using Azure portal, Azure PowerShell or Azure CLI.

We recommend using the [private DNS zone](../../dns/private-dns-overview.md) attached to the Virtual Network with the necessary updates for the private endpoints, which we create by default during the provisioning process. However, if you are using your own DNS server, you may need to make additional changes to your DNS configuration. See [DNS for private endpoints](#dns-for-private-endpoints) section. We recommend to decide on DNS strategy **before** provisioning private endpoint(s) for a production Speech resource. We also recommend preliminary testing, especially if you are using your own DNS server.

Use the following articles to create private endpoint(s). The articles are using a Web app as a sample resource to enable with private endpoints. Use instead the following parameters:

| Setting             | Value                                    |
|---------------------|------------------------------------------|
| Resource type       | **Microsoft.CognitiveServices/accounts** |
| Resource            | **\<your-speech-resource-name>**         |
| Target sub-resource | **account**                              |

- [Create a Private Endpoint using the Azure portal](../../private-link/create-private-endpoint-portal.md)
- [Create a Private Endpoint using Azure PowerShell](../../private-link/create-private-endpoint-powershell.md)
- [Create a Private Endpoint using Azure CLI](../../private-link/create-private-endpoint-cli.md)

### DNS for private endpoints

Get familiar with the general principles of [DNS for private endpoints in Cognitive Services resources](../cognitive-services-virtual-networks.md#dns-changes-for-private-endpoints). Then check that your DNS configuration is working correctly (see next sub-sections).

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

Note that IP address resolved points to a VNet Proxy endpoint which is used for dispatching the network traffic to a private endpoint enabled Cognitive Services resource. This behavior will be different for a resource with custom domain name enabled, but *without* private endpoints configured. See !!!

## Using Speech resource with custom domain name and private endpoint enabled

A Speech resource with custom domain name and private endpoint enabled uses a different way to interact with Speech Services. This section explains how to use such resource with Speech Services REST API and [Speech SDK](speech-sdk.md).

> [!NOTE]
> Please note, that a Speech Resource without private endpoints, but with **custom domain name** enabled also has a special way of interacting with Speech Services, but it differs comparing with a private endpoint enabled Speech Resource. If you have such resource (say, you had a resource with private endpoints, but then decided to remove them) ensure to get familiar with !!! the correspondent section.

### Speech resource with custom domain name and private endpoint. Usage with REST API

We will use `my-private-link-speech.cognitiveservices.azure.com` as a sample Speech resource DNS name (custom domain) for this section.

Usually Speech resources use [Cognitive Services regional endpoints](../cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints) for communicating with the Speech Services REST API. These resources have the following naming format: <p/>`{region}.api.cognitive.microsoft.com`

This is a sample request URL:

```http
https://westeurope.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions
```
After enabling custom domain for a Speech resource (which is necessary for private endpoints) such resource will use the following DNS name pattern for the basic REST API endpoint: <p/>`{your custom name}.cognitiveservices.azure.com`

That means that in our example the REST API endpoint name will be: <p/>`my-private-link-speech.cognitiveservices.azure.com`

And the sample request URL above needs to be converted to:
```http
https://my-private-link-speech.cognitiveservices.azure.com/speechtotext/v3.0/transcriptions
```
This URL should be reachable from the Virtual Network with the private endpoint attached (provided the [correct DNS resolution](#mandatory-check-dns-resolution-from-the-virtual-network)).

So generally speaking after enabling custom domain name for a Speech resource you need to replace host name in all request URLs with the new custom domain name. All other parts of the request (like the path '/speechtotext/v3.0/transcriptions' in the example above) remain the same.

> [!TIP]
> Some customers developed applications that use the region part of a regional endpoint DNS name (for example to send the request to the Speech resource deployed in the particular Azure Region).
>
> Speech resource custom domain name contains **no** information about the region where the resource is deployed. So the application logic described above will **not** work and needs to be altered.

### Speech resource with custom domain name and private endpoint. Usage with Speech SDK

Using Speech SDK with custom domain name and private endpoint enabled Speech resources requires the review and likely changes of your application code. We are working on more seamless support of private endpoint scenario and will introduce it in future Speech SDK versions.

We will use `my-private-link-speech.cognitiveservices.azure.com` as a sample Speech resource DNS name (custom domain) for this section.

#### General principle

Usually in SDK scenarios Speech resources use the special regional endpoints for different service offerings. The DNS name format for these endpoints is: </p>'{region}.{speech service offering}.speech.microsoft.com`

Example: </p>`westeurope.stt.speech.microsoft.com`

All possible values for the region (first element of the DNS name) are listed [here](regions.md) This table below presents the possible value for the Speech Services offering (second element of the DNS name):

| DNS name value | Speech Services offering                                    |
|----------------|-------------------------------------------------------------|
| `commands`     | [Custom Commands](custom-commands.md)                       |
| `convai`       | [Conversation Transcription](conversation-transcription.md) |
| `s2s`          | [Speech Translation](speech-translation.md)                 |
| `stt`          | [Speech-to-Text](speech-to-text.md)                         |
| `tts`          | [Text-to-Speech](text-to-speech.md)                         |
| `voice`        | [Custom Voice](how-to-custom-voice.md)                      |

Thus the example above (`westeurope.stt.speech.microsoft.com`) stands for Speech-to-Text endpoint in West Europe.

Private endpoint enabled endpoints communicate with Speech Services via a special proxy and because of that **the endpoint connection URLs need to be changed**. The following principle is applied: a "standard" endpoint URL follows the pattern of <p/>`{region}.{speech service offering}.speech.microsoft.com/{URL path}`

It should be changed to: <p/>`{your custom name}.cognitiveservices.azure.com/{speech service offering}/{URL path}`

**Example 1.** Application is communicating using the following URL (speech recognition using base model for US English in West Europe): <p/>`wss://westeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`

To use it in the private endpoint enabled scenario when custom domain name of the Speech resource is `my-private-link-speech.cognitiveservices.azure.com` this URL needs to be modified like this: <p/>`wss://my-private-link-speech.cognitiveservices.azure.com/stt/speech/recognition/conversation/cognitiveservices/v1?language=en-US`

Let's look closer:
- Hostname `westeurope.stt.speech.microsoft.com` is replaced by the custom domain hostname `my-private-link-speech.cognitiveservices.azure.com`
- Second element of the original DNS name (`stt`) becomes the first element of the URL path and precedes the original path, that is the original URL `/speech/recognition/conversation/cognitiveservices/v1?language=en-US` becomes `/stt/speech/recognition/conversation/cognitiveservices/v1?language=en-US`
 
**Example 2.** Application is communicating using the following URL (speech synthesizing using custom voice model in West Europe): <p/>`https://westeurope.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId=974481cc-b769-4b29-af70-2fb557b897c4`

To use it in the private endpoint enabled scenario when custom domain name of the Speech resource is `my-private-link-speech.cognitiveservices.azure.com` this URL needs to be modified like this: <p/>`https://my-private-link-speech.cognitiveservices.azure.com/voice/cognitiveservices/v1?deploymentId=974481cc-b769-4b29-af70-2fb557b897c4`

The same principle as in Example 1 is applied, but the key element this time is `voice`.



## Pricing

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).

## Next steps

* Learn more about [Azure Private Link](../../private-link/private-link-overview.md)