---
title: How to use private endpoints with the Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to use the Speech service with private endpoints provided by Azure Private Link
services: cognitive-services
author: alexeyo26
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 12/15/2020
ms.author: alexeyo
---

# Use the Speech service through a private endpoint

[Azure Private Link](../../private-link/private-link-overview.md) lets you connect to services in Azure by using a [private endpoint](../../private-link/private-endpoint-overview.md). A private endpoint is a private IP address that's accessible only within a specific [virtual network](../../virtual-network/virtual-networks-overview.md) and subnet.

This article explains how to set up and use Private Link and private endpoints with the Speech service in Azure Cognitive Services.

> [!NOTE]
> This article explains the specifics of setting up and using Private Link with Azure Cognitive Services. Before you proceed, review how to [use virtual networks with Cognitive Services](../cognitive-services-virtual-networks.md).

This article also describes [how to remove private endpoints later, but still use the speech resource](#use-speech-resource-with-custom-domain-name-without-private-endpoints).

## Create a custom domain name

Private endpoints require a [custom subdomain name for Cognitive Services](../cognitive-services-custom-subdomains.md). Use the following instructions to create one for your speech resource.

> [!WARNING]
> A speech resource with a custom domain name enabled uses a different way to interact with the Speech service. You might have to adjust your application code for both of these scenarios: [private endpoint enabled](#use-speech-resource-with-custom-domain-name-and-private-endpoint-enabled) and [*not* private endpoint enabled](#use-speech-resource-with-custom-domain-name-without-private-endpoints).
>
> When you enable a custom domain name, the operation is [*not reversible*](../cognitive-services-custom-subdomains.md#can-i-change-a-custom-domain-name). The only way to go back to the [regional name](../cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints) is to create a new speech resource.
>
> If your speech resource has a lot of associated custom models and projects created via [Speech Studio](https://speech.microsoft.com/), we strongly recommend trying the configuration with a test resource before you modify the resource used in production.

# [Azure portal](#tab/portal)

To create a custom domain name by using the Azure portal, follow these steps:

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the required speech resource.
1. In the **Resource Management** group in the left pane, select **Networking**.
1. On the **Firewalls and virtual networks** tab, select **Generate Custom Domain Name**. A new right panel appears with instructions to create a unique custom subdomain for your resource.
1. In the **Generate Custom Domain Name** panel, enter a custom domain name. Your full custom domain will look like:
    `https://{your custom name}.cognitiveservices.azure.com`. 
    
    Remember that after you create a custom domain name, it _cannot_ be changed.
    
    After you've entered your custom domain name, select **Save**.
1. After the operation finishes, in the **Resource management** group, select **Keys and Endpoint**. Confirm that the new endpoint name of your resource starts this way:

    `https://{your custom name}.cognitiveservices.azure.com`

# [PowerShell](#tab/powershell)

To create a custom domain name by using PowerShell, confirm that your computer has PowerShell version 7.x or later with the Azure PowerShell module version 5.1.0 or later. to see the versions of these tools, follow these steps:

1. In a PowerShell window, enter:

    `$PSVersionTable`

    Confirm that the `PSVersion` value is greater than 7.x. To upgrade PowerShell, follow the instructions at [Installing various versions of PowerShell](/powershell/scripting/install/installing-powershell).

1. In a PowerShell window, enter:

    `Get-Module -ListAvailable Az`

    If nothing appears, or if that version the Azure PowerShell module is lower than 5.1.0, follow the instructions at [Install Azure PowerShell module](/powershell/azure/install-Az-ps) to upgrade.

Before proceeding, run `Connect-AzAccount` to create a connection with Azure.

## Verify that a custom domain name is available

Check whether the custom domain that you want to use is available. 
The following code confirms that the domain is available by using the [Check Domain Availability](/rest/api/cognitiveservices/accountmanagement/checkdomainavailability/checkdomainavailability) operation in the Cognitive Services REST API.

> [!TIP]
> The following code will *not* work in Azure Cloud Shell.

```azurepowershell
$subId = "Your Azure subscription Id"
$subdomainName = "custom domain name"

# Select the Azure subscription that contains the speech resource.
# You can skip this step if your Azure account has only one active subscription.
Set-AzContext -SubscriptionId $subId

# Prepare the OAuth token to use in the request to the Cognitive Services REST API.
$Context = Get-AzContext
$AccessToken = (Get-AzAccessToken -TenantId $Context.Tenant.Id).Token
$token = ConvertTo-SecureString -String $AccessToken -AsPlainText -Force

# Prepare and send the request to the Cognitive Services REST API.
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
If the desired name is available, you'll see a response like this:
```azurepowershell
isSubdomainAvailable : True
reason               :
type                 :
subdomainName        : my-custom-name
```
If the name is already taken, then you'll see the following response:
```azurepowershell
isSubdomainAvailable : False
reason               : Sub domain name 'my-custom-name' is already used. Please pick a different name.
type                 :
subdomainName        : my-custom-name
```
## Create your custom domain name

To enable a custom domain name for the selected speech resource, use the[Set-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/set-azcognitiveservicesaccount) cmdlet.

> [!WARNING]
> After the following code runs successfully, you'll create a custom domain name for your speech resource. Remember that this name *cannot* be changed.

```azurepowershell
$resourceGroup = "Resource group name where speech resource is located"
$speechResourceName = "Your speech resource name"
$subdomainName = "custom domain name"

# Select the Azure subscription that contains the speech resource.
# You can skip this step if your Azure account has only one active subscription.
$subId = "Your Azure subscription Id"
Set-AzContext -SubscriptionId $subId

# Set the custom domain name to the selected resource.
# WARNING: THIS CANNOT BE CHANGED OR UNDONE!
Set-AzCognitiveServicesAccount -ResourceGroupName $resourceGroup `
    -Name $speechResourceName -CustomSubdomainName $subdomainName
```

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

This section requires the latest version of the Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed.

## Verify that the custom domain name is available

Check whether the custom domain that you want to use is free. Use the[Check Domain Availability](/rest/api/cognitiveservices/accountmanagement/checkdomainavailability/checkdomainavailability) method from the Cognitive Services REST API.

Copy the following code block, insert your preferred custom domain name, and save to the file `subdomain.json`.

```json
{
	"subdomainName": "custom domain name",
	"type": "Microsoft.CognitiveServices/accounts"
}
```

Copy the file to your current folder or upload it to Azure Cloud Shell and run the following command. (Replace `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` with your Azure subscription ID).

```azurecli-interactive
az rest --method post --url "https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/providers/Microsoft.CognitiveServices/checkDomainAvailability?api-version=2017-04-18" --body @subdomain.json
```
If the desired name is available, you'll see a response like this:
```azurecli
{
  "isSubdomainAvailable": true,
  "reason": null,
  "subdomainName": "my-custom-name",
  "type": null
}
```

If the name is already taken, then you'll see the following response:
```azurecli
{
  "isSubdomainAvailable": false,
  "reason": "Sub domain name 'my-custom-name' is already used. Please pick a different name.",
  "subdomainName": "my-custom-name",
  "type": null
}
```
## Enable a custom domain name

To enable a custom domain name for the selected speech resource, use the [az cognitiveservices account update](/cli/azure/cognitiveservices/account#az_cognitiveservices_account_update) command.

Select the Azure subscription that contains the speech resource. If your Azure account has only one active subscription, you can skip this step. (Replace `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` with your Azure subscription ID).
```azurecli-interactive
az account set --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
Set the custom domain name to the selected resource. Replace the sample parameter values with the actual ones and run the following command.

> [!WARNING]
> After successful execution of the following command, you'll create a custom domain name for your speech resource. Remember that this name *cannot* be changed.

```azurecli
az cognitiveservices account update --name my-speech-resource-name --resource-group my-resource-group-name --custom-domain my-custom-name
```

***

## Enable private endpoints

We recommend using the [private DNS zone](../../dns/private-dns-overview.md) attached to the virtual network with the necessary updates for the private endpoints. You create a private DNS zone by default during the provisioning process. If you're using your own DNS server, you might also need to change your DNS configuration. 

Decide on a DNS strategy *before* you provision private endpoints for a production speech resource. And test your DNS changes, especially if you use your own DNS server.

Use one of the following articles to create private endpoints. The articles use a web app as a sample resource to enable with private endpoints. But use these parameters instead of those in the article:

| Setting             | Value                                    |
|---------------------|------------------------------------------|
| Resource type       | **Microsoft.CognitiveServices/accounts** |
| Resource            | **\<your-speech-resource-name>**         |
| Target sub-resource | **account**                              |

- [Create a Private Endpoint using the Azure portal](../../private-link/create-private-endpoint-portal.md)
- [Create a Private Endpoint using Azure PowerShell](../../private-link/create-private-endpoint-powershell.md)
- [Create a Private Endpoint using Azure CLI](../../private-link/create-private-endpoint-cli.md)

**DNS for private endpoints:** Review the general principles of [DNS for private endpoints in Cognitive Services resources](../cognitive-services-virtual-networks.md#dns-changes-for-private-endpoints). Then confirm that your DNS configuration is working correctly by performing the checks described in the following sections.

### Resolve DNS from the virtual network

This check is *required**.

Follow these steps to test the custom DNS entry from your virtual network:

1. Log in to a virtual machine located in the virtual network to which you've attached your private endpoint. 
1. Open a Windows command prompt or a Bash shell, run `nslookup`, and confirm that it successfully resolves your resource's custom domain name.

   ```dos
   C:\>nslookup my-private-link-speech.cognitiveservices.azure.com
   Server:  UnKnown
   Address:  168.63.129.16

   Non-authoritative answer:
   Name:    my-private-link-speech.privatelink.cognitiveservices.azure.com
   Address:  172.28.0.10
   Aliases:  my-private-link-speech.cognitiveservices.azure.com
   ```

1. Confirm that the IP address matches the IP address of your private endpoint.

### Resolve DNS from other networks

Perform this check only if both of these statements are true:

- You plan to use your private-endpoint-enabled speech resource in "hybrid" mode.
- You've enabled either the **All networks** or the **Selected Networks and Private Endpoints** access option in the **Networking** section of your resource. 

If you plan to access the resource by using only a private endpoint, you can skip this section.

1. Log in to a computer attached to a network that's allowed to access the resource.
2. Open a Windows command prompt or Bash shell, run `nslookup`, and confirm that it successfully resolves your resource's custom domain name.

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

3. Confirm that the IP address matches the IP address of your private endpoint.

> [!NOTE]
> The resolved IP address points to a virtual network proxy endpoint, which dispatches the network traffic to the private endpoint for the Cognitive Services resource. The behavior will be different for a resource with a custom domain name but *without* private endpoints. See [this section](#dns-configuration) for details.

## Adjust existing applications and solutions

A speech resource with a custom domain enabled uses a different way to interact with the Speech service. This is true for a custom-domain-enabled speech resource both with and without private endpoints. Information in this section applies to both scenarios.

### Use a speech resource with a custom domain name and a private endpoint enabled

A speech resource with custom domain name and private endpoint enabled uses a different way to interact with the Speech service. This section explains how to use such a resource with the Speech service REST API and [Speech SDK](speech-sdk.md).

> [!NOTE]
> A speech resource without private endpoints but with a custom domain name enabled also has a special way of interacting with the Speech service. This way differs from the scenario of a private-endpoint-enabled speech resource. If you have such resource (for example, you had a resource with private endpoints but then decided to remove them), see the the section [Use a speech resource with a custom domain name and without private endpoints](#use-a-speech-resource-with-a-custom-domain-name-and-without-private-endpoints).

#### REST API

We'll use `my-private-link-speech.cognitiveservices.azure.com` as a sample speech resource DNS name (custom domain) for this section.

The Speech service has REST APIs for [speech-to-text](rest-speech-to-text.md) and [text-to-speech](rest-text-to-speech.md). Consider the following information for the private-endpoint-enabled scenario.

Speech-to-text has two REST APIs. Each API serves a different purpose, uses different endpoints, and requires a different approach when your'e using it in the private-endpoint-enabled scenario.

The speech-to-text REST APIs are:
- [Speech-to-Text REST API v3.0](rest-speech-to-text.md#speech-to-text-rest-api-v30) is used for [Batch transcription](batch-transcription.md) and [Custom Speech](custom-speech-overview.md). v3.0 is a [successor of v2.0](/azure/cognitive-services/speech-service/migrate-v2-to-v3).
- [Speech-to-Text REST API for short audio](rest-speech-to-text.md#speech-to-text-rest-api-for-short-audio) is used for online transcription. 

Usage of the Speech-to-Text REST API for short audio and the Text-to-Speech REST API in the private endpoint scenario is the same. It's equivalent to the [Speech SDK case](#speech-resource-with-custom-domain-name-and-private-endpoint-usage-with-speech-sdk) described later in this article. 

Speech-to-Text REST API v3.0 uses a different set of endpoints, so it requires a different approach for the private-endpoint-enabled scenario.

The next subsections describe both cases.

##### Speech-to-Text REST API v3.0

Usually, speech resources use [Cognitive Services regional endpoints](../cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints) for communicating with the [Speech-to-Text REST API v3.0](rest-speech-to-text.md#speech-to-text-rest-api-v30). These resources have the following naming format: <p/>`{region}.api.cognitive.microsoft.com`.

This is a sample request URL:

```http
https://westeurope.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions
```
After you enable a custom domain for a speech resource (which is necessary for private endpoints), that resource will use the following DNS name pattern for the basic REST API endpoint: <p/>`{your custom name}.cognitiveservices.azure.com`.

That means that in our example, the REST API endpoint name will be: <p/>`my-private-link-speech.cognitiveservices.azure.com`.

And the sample request URL needs to be converted to:
```http
https://my-private-link-speech.cognitiveservices.azure.com/speechtotext/v3.0/transcriptions
```
This URL should be reachable from the virtual network with the private endpoint attached (provided the [correct DNS resolution](#resolve-dns-from-the virtual-network)).

After you enable a custom domain name for a speech resource, you typically replace the host name in all request URLs with the new custom domain host name. All other parts of the request (like the path `/speechtotext/v3.0/transcriptions` in the earlier example) remain the same.

> [!TIP]
> Some customers develop applications that use the region part of the regional endpoint's DNS name (for example, to send the request to the speech resource deployed in the particular Azure region).
>
> A custom domain for a speech resource contains *no* information about the region where the resource is deployed. So the application logic described earlier will *not* work and needs to be altered.

##### Speech-to-Text REST API for Short Audio and Text-to-Speech REST API

[Speech-to-Text REST API for Short Audio](rest-speech-to-text.md#speech-to-text-rest-api-for-short-audio) and [Text-to-Speech REST API](rest-text-to-speech.md) use two types of endpoints:
- [Cognitive Services regional endpoints](../cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints) for communicating with the Cognitive Services REST API to obtain an authorization token
- Special endpoints for all other operations

The detailed description of the special endpoints and how their URL should be transformed for a private-endpoint-enabled speech resource is provided in [this subsection](#general-principles) about usage with the Speech SDK. The same principle described for the SDK applies for the Speech-to-Text REST API v1.0 and the Text-to-Speech REST API.

Get familiar with the material in the subsection mentioned in the previous paragraph and see the following example. The example describes the Text-to-Speech REST API. Usage of the Speech-to-Text REST API for Short Audio is fully equivalent.

> [!NOTE]
> When you're using the Speech-to-Text REST API for Short Audio in private endpoint scenarios, use an authorization token [passed through](rest-speech-to-text.md#request-headers) the `Authorization` [header](rest-speech-to-text.md#request-headers). Passing a speech subscription key to the special endpoint via the `Ocp-Apim-Subscription-Key` header will *not* work and will generate Error 401.

**Text-to-Speech REST API usage example**

We'll use West Europe as a sample Azure region and `my-private-link-speech.cognitiveservices.azure.com` as a sample speech resource DNS name (custom domain). The custom domain name `my-private-link-speech.cognitiveservices.azure.com` in our example belongs to the speech resource created in the West Europe region.

To get the list of the voices supported in the region, do the following two operations:

- Obtain an authorization token:
  ```http
  https://westeurope.api.cognitive.microsoft.com/sts/v1.0/issuetoken
  ```
- By using the token, get the list of voices:
  ```http
  https://westeurope.tts.speech.microsoft.com/cognitiveservices/voices/list
  ```
See more details on the preceding steps in the [Text-to-Speech REST API documentation](rest-text-to-speech.md).

For the private-endpoint-enabled speech resource, the endpoint URLs for the same operation sequence need to be modified. The same sequence will look like this:

- Obtain an authorization token:
  ```http
  https://my-private-link-speech.cognitiveservices.azure.com/v1.0/issuetoken
  ```
  See the detailed explanation in the earilier [Speech-to-Text REST API v3.0](#speech-to-text-rest-api-v30) subsection.)

- By using the obtained token, get the list of voices:
  ```http
  https://my-private-link-speech.cognitiveservices.azure.com/tts/cognitiveservices/voices/list
  ```
  See a detailed explanation in the [General principles](#general-principles) subsection for the Speech SDK.

#### Speech SDK

Using the Speech SDK with a custom domain name and private-endpoint-enabled speech resources requires you to review and likely change your application code.

We'll use `my-private-link-speech.cognitiveservices.azure.com` as a sample speech resource DNS name (custom domain) for this section.

##### General principles

Usually in SDK scenarios (as well as in the Text-to-Speech REST API scenarios), speech resources use the dedicated regional endpoints for different service offerings. The DNS name format for these endpoints is: </p>`{region}.{speech service offering}.speech.microsoft.com`.

An example DNS name is: </p>`westeurope.stt.speech.microsoft.com`.

All possible values for the region (first element of the DNS name) are listed in [Speech service supported regions](regions.md). The following table presents the possible value for the Speech service offering (second element of the DNS name):

| DNS name value | Speech service offering                                    |
|----------------|-------------------------------------------------------------|
| `commands`     | [Custom Commands](custom-commands.md)                       |
| `convai`       | [Conversation Transcription](conversation-transcription.md) |
| `s2s`          | [Speech Translation](speech-translation.md)                 |
| `stt`          | [Speech-to-Text](speech-to-text.md)                         |
| `tts`          | [Text-to-Speech](text-to-speech.md)                         |
| `voice`        | [Custom Voice](how-to-custom-voice.md)                      |

So the earlier example (`westeurope.stt.speech.microsoft.com`) stands for a speech-to-text endpoint in West Europe.

Private-endpoint-enabled endpoints communicate with the Speech service via a special proxy. Because of that, *you must change the endpoint connection URLs*. 

A "standard" endpoint URL looks like: <p/>`{region}.{speech service offering}.speech.microsoft.com/{URL path}`.

A private endpoint URL looks like: <p/>`{your custom name}.cognitiveservices.azure.com/{speech service offering}/{URL path}`.

**Example 1.** An application is communicating by using the following URL (speech recognition using the base model for US English in West Europe):

```
wss://westeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US
```

To use it in the private-endpoint-enabled scenario when the custom domain name of the speech resource is `my-private-link-speech.cognitiveservices.azure.com`, you must modify the URL like this:

```
wss://my-private-link-speech.cognitiveservices.azure.com/stt/speech/recognition/conversation/cognitiveservices/v1?language=en-US
```

Notice the details:

- The host name `westeurope.stt.speech.microsoft.com` is replaced by the custom domain host name `my-private-link-speech.cognitiveservices.azure.com`.
- The second element of the original DNS name (`stt`) becomes the first element of the URL path and precedes the original path. So the original URL `/speech/recognition/conversation/cognitiveservices/v1?language=en-US` becomes `/stt/speech/recognition/conversation/cognitiveservices/v1?language=en-US`.

**Example 2.** An application uses the following URL to synthesize speech in West Europe by using a custom voice model:
```http
https://westeurope.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId=974481cc-b769-4b29-af70-2fb557b897c4
```

The following equivalent URL uses a private endpoint enabled where the custom domain name of the speech resource is `my-private-link-speech.cognitiveservices.azure.com`:

```http
https://my-private-link-speech.cognitiveservices.azure.com/voice/cognitiveservices/v1?deploymentId=974481cc-b769-4b29-af70-2fb557b897c4
```

The same principle as in Example 1 is applied, but the key element this time is `voice`.

##### Modify applications

Follow these steps to modify your code:

1. Determine the application endpoint URL:

   - [Enable logging for your application](how-to-use-logging.md) and run it to log activity.
   - In the log file, search for `SPEECH-ConnectionUrl`. In matching lines, the `value` parameter contains the full URL that your application used to reach the Speech service.

   Example:

   ```
   (114917): 41ms SPX_DBG_TRACE_VERBOSE:  property_bag_impl.cpp:138 ISpxPropertyBagImpl::LogPropertyAndValue: this=0x0000028FE4809D78; name='SPEECH-ConnectionUrl'; value='wss://westeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?traffictype=spx&language=en-US'
   ```

   So the URL that the application used in this example is:

   ```
   wss://westeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US
   ```

2. Create a `SpeechConfig` instance by using a full endpoint URL.

   1. Modify the endpoint that you determined in the previous section, as described in the earlier [General principles](#general-principles) section.

   1. Modify how you create the instance of `SpeechConfig`. Most likely, your application is using something like this:
      ```csharp
      var config = SpeechConfig.FromSubscription(subscriptionKey, azureRegion);
      ```
   This won't work for private-endpoint-enabled speech resource because of the host name and URL changes that we described in the previous sections. If you try to run your existing application without any modifications by using the key of a private-endpoint-enabled resource, you'll get an authentication error (401).

   To make it work, modify how you instantiate the `SpeechConfig` class and use "from endpoint"/"with endpoint" initialization. Suppose we have the following two variables defined:
     - `subscriptionKey` contains the key of the private-endpoint-enabled speech resource.
     - `endPoint` contains the full *modified* endpoint URL (using the type required by the corresponding programming language). In our example, this variable should contain:
       ```
       wss://my-private-link-speech.cognitiveservices.azure.com/stt/speech/recognition/conversation/cognitiveservices/v1?language=en-US
       ```

   1. Create a `SpeechConfig` instance:
      ```csharp
      var config = SpeechConfig.FromEndpoint(endPoint, subscriptionKey);
      ```
      ```cpp
      auto config = SpeechConfig::FromEndpoint(endPoint, subscriptionKey);
      ```
      ```java
      SpeechConfig config = SpeechConfig.fromEndpoint(endPoint, subscriptionKey);
      ```
      ```python
      import azure.cognitiveservices.speech as speechsdk
      speech_config = speechsdk.SpeechConfig(endpoint=endPoint, subscription=subscriptionKey)
     ```
     ```objectivec
     SPXSpeechConfiguration *speechConfig = [[SPXSpeechConfiguration alloc] initWithEndpoint:endPoint subscription:subscriptionKey];
    ```

> [!TIP]
> The query parameters specified in the endpoint URI are not changed, even if they're set by any other APIs. For example, if the recognition language is defined in the URI as query parameter `language=en-US`, and is also set to `ru-RU` via the corresponding property, the language setting in the URI is used. The effective language is then `en-US`.
>
> Parameters set in the endpoint URI always take precidence. Other APIs can override only parameters that are not specified in the endpoint URI.

After this modification, your application should work with the private enabled speech resources. We're working on more seamless support of private endpoint scenarios.

### Use a speech resource with a custom domain name and without private endpoints

In this article, we've pointed out several times that enabling a custom domain for a speech resource is *irreversible*. Such a resource will use a different way of communicating with the Speech service, compared to the ones that are using [regional endpoint names](../cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints).

This section explains how to use a speech resource with an enabled custom domain name but *without* any private endpoints with the Speech service REST API and [Speech SDK](speech-sdk.md). This might be a resource that was once used in a private endpoint scenario, but then had its private endpoints deleted.

#### DNS configuration

Remember how a custom domain DNS name of the private-endpoint-enabled speech resource is [resolved from public networks](#resolve-dns-from-other-networks). In this case, the IP address resolved points to a proxy endpoint for a virtual network. That endpoint is used for dispatching the network traffic to the private-endpoint-enabled Cognitive Services resource.

However, when *all* resource private endpoints are removed (or right after the enabling of the custom domain name), the CNAME record of the speech resource is reprovisioned. It now points to the IP address of the corresponding [Cognitive Services regional endpoint](../cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints).

So the output of the `nslookup` command will look like this:
```dos
C:\>nslookup my-private-link-speech.cognitiveservices.azure.com
Server:  UnKnown
Address:  fe80::1

Non-authoritative answer:
Name:    apimgmthskquihpkz6d90kmhvnabrx3ms3pdubscpdfk1tsx3a.cloudapp.net
Address:  13.93.122.1
Aliases:  my-private-link-speech.cognitiveservices.azure.com
          westeurope.api.cognitive.microsoft.com
          cognitiveweprod.trafficmanager.net
          cognitiveweprod.azure-api.net
          apimgmttmdjylckcx6clmh2isu2wr38uqzm63s8n4ub2y3e6xs.trafficmanager.net
          cognitiveweprod-westeurope-01.regional.azure-api.net
```
Compare it with the output from [this section](#resolve-dns-from-other-networks).

#### REST API

##### Speech-to-Text REST API v3.0

Speech-to-Text REST API v3.0 usage is fully equivalent to the case of [private-endpoint-enabled speech resources](#speech-to-text-rest-api-v30).

##### Speech-to-Text REST API for Short Audio and Text-to-Speech REST API

In this case, Speech-to-Text REST API for Short Audio and Text-to-Speech REST API usage have no differences from the general case, with one exception for Speech-to-Text REST API for Short Audio. (See the following note.) You should use both APIs as described in [Speech-to-Text REST API for Short Audio](rest-speech-to-text.md#speech-to-text-rest-api-for-short-audio) and [Text-to-Speech REST API](rest-text-to-speech.md) documentation.

> [!NOTE]
> When you're using the Speech-to-Text REST API for Short Audio in custom domain scenarios, use an authorization token [passed through](rest-speech-to-text.md#request-headers) an `Authorization` [header](rest-speech-to-text.md#request-headers). Passing a speech subscription key to the special endpoint via the `Ocp-Apim-Subscription-Key` header will *not* work and will generate Error 401.

#### speech resource with custom domain name without private endpoints. Usage with Speech SDK

Using Speech SDK with custom domain name enabled speech resources **without** private endpoints requires the review and likely changes of your application code. Note that these changes are **different** comparing to the case of a [private endpoint enabled speech resource](#speech-resource-with-custom-domain-name-and-private-endpoint-usage-with-speech-sdk). We are working on more seamless support of private endpoint / custom domain scenario.

We will use `my-private-link-speech.cognitiveservices.azure.com` as a sample speech resource DNS name (custom domain) for this section.

In the section on [private endpoint enabled speech resource](#speech-resource-with-custom-domain-name-and-private-endpoint-usage-with-speech-sdk) we explained how to determine the endpoint URL used, modify it and make it work through "from endpoint"/"with endpoint" initialization of the `SpeechConfig` class instance.

However if you try to run the same application after having all private endpoints removed (allowing some time to the correspondent DNS record reprovisioning) you will get Internal service error (404). The reason is the [DNS record](#dns-configuration) that now points to the regional Cognitive Services endpoint instead of the VNet proxy, and the URL paths like `/stt/speech/recognition/conversation/cognitiveservices/v1?language=en-US` will not be found there, hence the "Not found" error (404).

If you "roll-back" your application to the "standard" instantiation of `SpeechConfig` in the style of
```csharp
var config = SpeechConfig.FromSubscription(subscriptionKey, azureRegion);
```
your application will terminate with the Authentication error (401).

##### Modifying applications

To let your application use a speech resource with a custom domain name and without private endpoints, follow these steps:

**1. Request Authorization Token from the Cognitive Services REST API**

[This article](../authentication.md#authenticate-with-an-authentication-token) shows how to get the token using the Cognitive Services REST API.

Use your custom domain name in the endpoint URL, that is in our example this URL is:
```http
https://my-private-link-speech.cognitiveservices.azure.com/sts/v1.0/issueToken
```
> [!TIP]
> You can find this URL in the Azure portal. On your speech resource page, under the under the **Resource management** group, select **Keys and Endpoint**.

**2. Create a `SpeechConfig` instance using "from authorization token" / "with authorization token" method.**

Create a `SpeechConfig` instance using the authorization token you obtained in the previous section. Suppose we have the following variables defined:

- `token`: the authorization token obtained in the previous section
- `azureRegion`: the name of the speech resource [region](regions.md) (example: `westeurope`)
- `outError`: (only for [Objective C](/objectivec/cognitive-services/speech/spxspeechconfiguration#initwithauthorizationtokenregionerror) case)

Next, create a `SpeechConfig` instance:

```csharp
var config = SpeechConfig.FromAuthorizationToken(token, azureRegion);
```
```cpp
auto config = SpeechConfig::FromAuthorizationToken(token, azureRegion);
```
```java
SpeechConfig config = SpeechConfig.fromAuthorizationToken(token, azureRegion);
```
```python
import azure.cognitiveservices.speech as speechsdk
speech_config = speechsdk.SpeechConfig(auth_token=token, region=azureRegion)
```
```objectivec
SPXSpeechConfiguration *speechConfig = [[SPXSpeechConfiguration alloc] initWithAuthorizationToken:token region:azureRegion error:outError];
```
> [!NOTE]
> The caller needs to ensure that the authorization token is valid.
> Before the authorization token expires, the caller needs to refresh it by calling this setter with a new valid token.
> As configuration values are copied when creating a new recognizer or synthesizer, the new token value will not apply to recognizers or synthesizers that have already been created.
> For these, set the authorization token of the corresponding recognizer or synthesizer to refresh the token.
> If you don't refresh the token, the the recognizer or synthesizer will encounter errors while operating.

After this modification your application should work with speech resources that use a custom domain name without private endpoints.

## Pricing

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).

## Learn more

* [Azure Private Link](../../private-link/private-link-overview.md)
* [Speech SDK](speech-sdk.md)
* [Speech-to-Text REST API](rest-speech-to-text.md)
* [Text-to-Speech REST API](rest-text-to-speech.md)
