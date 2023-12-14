---
title: How to use private endpoints with Speech service
titleSuffix: Azure AI services
description: Learn how to use Speech service with private endpoints provided by Azure Private Link
#services: cognitive-services
author: alexeyo26
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 04/07/2021
ms.author: alexeyo
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Use Speech service through a private endpoint

[Azure Private Link](../../private-link/private-link-overview.md) lets you connect to services in Azure by using a [private endpoint](../../private-link/private-endpoint-overview.md). A private endpoint is a private IP address that's accessible only within a specific [virtual network](../../virtual-network/virtual-networks-overview.md) and subnet.

This article explains how to set up and use Private Link and private endpoints with the Speech service. This article then describes how to remove private endpoints later, but still use the Speech resource.

> [!NOTE]
> Before you proceed, review [how to use virtual networks with Azure AI services](../cognitive-services-virtual-networks.md).


Setting up a Speech resource for the private endpoint scenarios requires performing the following tasks:
1. [Create a custom domain name](#create-a-custom-domain-name)
1. [Turn on private endpoints](#turn-on-private-endpoints)
1. [Adjust existing applications and solutions](#adjust-an-application-to-use-a-speech-resource-with-a-private-endpoint)

[!INCLUDE [](includes/speech-vnet-service-enpoints-private-endpoints.md)]

This article describes the usage of the private endpoints with Speech service. Usage of the VNet service endpoints is described [here](speech-service-vnet-service-endpoint.md).

## Create a custom domain name
> [!CAUTION]
> A Speech resource with a custom domain name enabled uses a different way to interact with Speech service. You might have to adjust your application code for both of these scenarios: [with private endpoint](#adjust-an-application-to-use-a-speech-resource-with-a-private-endpoint) and [*without* private endpoint](#adjust-an-application-to-use-a-speech-resource-without-private-endpoints).
>

[!INCLUDE [Custom Domain include](includes/how-to/custom-domain.md)]

## Turn on private endpoints

We recommend using the [private DNS zone](../../dns/private-dns-overview.md) attached to the virtual network with the necessary updates for the private endpoints.
You can create a private DNS zone during the provisioning process.
If you're using your own DNS server, you might also need to change your DNS configuration.

Decide on a DNS strategy *before* you provision private endpoints for a production Speech resource. And test your DNS changes, especially if you use your own DNS server.

Use one of the following articles to create private endpoints.
These articles use a web app as a sample resource to make available through private endpoints.

- [Create a private endpoint by using the Azure portal](../../private-link/create-private-endpoint-portal.md)
- [Create a private endpoint by using Azure PowerShell](../../private-link/create-private-endpoint-powershell.md)
- [Create a private endpoint by using Azure CLI](../../private-link/create-private-endpoint-cli.md)

Use these parameters instead of the parameters in the article that you chose:

| Setting             | Value                                    |
|---------------------|------------------------------------------|
| Resource type       | **Microsoft.CognitiveServices/accounts** |
| Resource            | **\<your-speech-resource-name>**         |
| Target sub-resource | **account**                              |

**DNS for private endpoints:** Review the general principles of [DNS for private endpoints in Azure AI services resources](../cognitive-services-virtual-networks.md#apply-dns-changes-for-private-endpoints). Then confirm that your DNS configuration is working correctly by performing the checks described in the following sections.

### Resolve DNS from the virtual network

This check is *required*.

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

Perform this check only if you've turned on either the **All networks** option or the **Selected Networks and Private Endpoints** access option in the **Networking** section of your resource.

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

> [!NOTE]
> The resolved IP address points to a virtual network proxy endpoint, which dispatches the network traffic to the private endpoint for the Speech resource. The behavior will be different for a resource with a custom domain name but *without* private endpoints. See [this section](#dns-configuration) for details.

## Adjust an application to use a Speech resource with a private endpoint

A Speech resource with a custom domain interacts with the Speech service in a different way.
This is true for a custom-domain-enabled Speech resource both with and without private endpoints.
Information in this section applies to both scenarios.

Follow instructions in this section to adjust existing applications and solutions to use a Speech resource with a custom domain name and a private endpoint turned on.

A Speech resource with a custom domain name and a private endpoint turned on uses a different way to interact with the Speech service. This section explains how to use such a resource with the Speech service REST APIs and the [Speech SDK](speech-sdk.md).

> [!NOTE]
> A Speech resource without private endpoints that uses a custom domain name also has a special way of interacting with the Speech service.
> This way differs from the scenario of a Speech resource that uses a private endpoint.
> This is important to consider because you may decide to remove private endpoints later.
> See [Adjust an application to use a Speech resource without private endpoints](#adjust-an-application-to-use-a-speech-resource-without-private-endpoints) later in this article.

### Speech resource with a custom domain name and a private endpoint: Usage with the REST APIs

We'll use `my-private-link-speech.cognitiveservices.azure.com` as a sample Speech resource DNS name (custom domain) for this section.

Speech service has REST APIs for [Speech to text](rest-speech-to-text.md) and [Text to speech](rest-text-to-speech.md). Consider the following information for the private-endpoint-enabled scenario.

Speech to text has two REST APIs. Each API serves a different purpose, uses different endpoints, and requires a different approach when you're using it in the private-endpoint-enabled scenario.

The Speech to text REST APIs are:
- [Speech to text REST API](rest-speech-to-text.md), which is used for [Batch transcription](batch-transcription.md) and [Custom Speech](custom-speech-overview.md). 
- [Speech to text REST API for short audio](rest-speech-to-text-short.md), which is used for real-time speech to text.

Usage of the Speech to text REST API for short audio and the Text to speech REST API in the private endpoint scenario is the same. It's equivalent to the [Speech SDK case](#speech-resource-with-a-custom-domain-name-and-a-private-endpoint-usage-with-the-speech-sdk) described later in this article.

Speech to text REST API uses a different set of endpoints, so it requires a different approach for the private-endpoint-enabled scenario.

The next subsections describe both cases.

#### Speech to text REST API

Usually, Speech resources use [Azure AI services regional endpoints](../cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints) for communicating with the [Speech to text REST API](rest-speech-to-text.md). These resources have the following naming format: <p/>`{region}.api.cognitive.microsoft.com`.

This is a sample request URL:

```http
https://westeurope.api.cognitive.microsoft.com/speechtotext/v3.1/transcriptions
```

> [!NOTE]
> See [this article](sovereign-clouds.md) for Azure Government and Microsoft Azure operated by 21Vianet endpoints.

After you turn on a custom domain for a Speech resource (which is necessary for private endpoints), that resource will use the following DNS name pattern for the basic REST API endpoint: <p/>`{your custom name}.cognitiveservices.azure.com`

That means that in our example, the REST API endpoint name will be: <p/>`my-private-link-speech.cognitiveservices.azure.com`

And the sample request URL needs to be converted to:
```http
https://my-private-link-speech.cognitiveservices.azure.com/speechtotext/v3.1/transcriptions
```
This URL should be reachable from the virtual network with the private endpoint attached (provided the [correct DNS resolution](#resolve-dns-from-the-virtual-network)).

After you turn on a custom domain name for a Speech resource, you typically replace the host name in all request URLs with the new custom domain host name. All other parts of the request (like the path `/speechtotext/v3.1/transcriptions` in the earlier example) remain the same.

> [!TIP]
> Some customers develop applications that use the region part of the regional endpoint's DNS name (for example, to send the request to the Speech resource deployed in the particular Azure region).
>
> A custom domain for a Speech resource contains *no* information about the region where the resource is deployed. So the application logic described earlier will *not* work and needs to be altered.

#### Speech to text REST API for short audio and Text to speech REST API

The [Speech to text REST API for short audio](rest-speech-to-text-short.md) and the [Text to speech REST API](rest-text-to-speech.md) use two types of endpoints:
- [Azure AI services regional endpoints](../cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints) for communicating with the Azure AI services REST API to obtain an authorization token
- Special endpoints for all other operations

> [!NOTE]
> See [this article](sovereign-clouds.md) for Azure Government and Azure operated by 21Vianet endpoints.

The detailed description of the special endpoints and how their URL should be transformed for a private-endpoint-enabled Speech resource is provided in [this subsection](#construct-endpoint-url) about usage with the Speech SDK. The same principle described for the SDK applies for the Speech to text REST API for short audio and the Text to speech REST API.

Get familiar with the material in the subsection mentioned in the previous paragraph and see the following example. The example describes the Text to speech REST API. Usage of the Speech to text REST API for short audio is fully equivalent.

> [!NOTE]
> When you're using the Speech to text REST API for short audio and Text to speech REST API in private endpoint scenarios, use a resource key passed through the `Ocp-Apim-Subscription-Key` header. (See details for [Speech to text REST API for short audio](rest-speech-to-text-short.md#request-headers) and [Text to speech REST API](rest-text-to-speech.md#request-headers))
>
> Using an authorization token and passing it to the special endpoint via the `Authorization` header will work *only* if you've turned on the **All networks** access option in the **Networking** section of your Speech resource. In other cases you will get either `Forbidden` or `BadRequest` error when trying to obtain an authorization token.

**Text to speech REST API usage example**

We'll use West Europe as a sample Azure region and `my-private-link-speech.cognitiveservices.azure.com` as a sample Speech resource DNS name (custom domain). The custom domain name `my-private-link-speech.cognitiveservices.azure.com` in our example belongs to the Speech resource created in the West Europe region.

To get the list of the voices supported in the region, perform the following request:

```http
https://westeurope.tts.speech.microsoft.com/cognitiveservices/voices/list
```
See more details in the [Text to speech REST API documentation](rest-text-to-speech.md).

For the private-endpoint-enabled Speech resource, the endpoint URL for the same operation needs to be modified. The same request will look like this:

```http
https://my-private-link-speech.cognitiveservices.azure.com/tts/cognitiveservices/voices/list
```
See a detailed explanation in the [Construct endpoint URL](#construct-endpoint-url) subsection for the Speech SDK.

### Speech resource with a custom domain name and a private endpoint: Usage with the Speech SDK

Using the Speech SDK with a custom domain name and private-endpoint-enabled Speech resources requires you to review and likely change your application code.

We'll use `my-private-link-speech.cognitiveservices.azure.com` as a sample Speech resource DNS name (custom domain) for this section.

#### Construct endpoint URL

Usually in SDK scenarios (as well as in the Speech to text REST API for short audio and Text to speech REST API scenarios), Speech resources use the dedicated regional endpoints for different service offerings. The DNS name format for these endpoints is:

`{region}.{speech service offering}.speech.microsoft.com`

An example DNS name is:

`westeurope.stt.speech.microsoft.com`

All possible values for the region (first element of the DNS name) are listed in [Speech service supported regions](regions.md). (See [this article](sovereign-clouds.md) for Azure Government and Azure operated by 21Vianet endpoints.) The following table presents the possible values for the Speech service offering (second element of the DNS name):

| DNS name value | Speech service offering                                    |
|----------------|-------------------------------------------------------------|
| `commands`     | [Custom Commands](custom-commands.md)                       |
| `convai`       | [Meeting Transcription](meeting-transcription.md) |
| `s2s`          | [Speech Translation](speech-translation.md)                 |
| `stt`          | [Speech to text](speech-to-text.md)                         |
| `tts`          | [Text to speech](text-to-speech.md)                         |
| `voice`        | [Custom voice](professional-voice-create-project.md)                      |

So the earlier example (`westeurope.stt.speech.microsoft.com`) stands for a Speech to text endpoint in West Europe.

Private-endpoint-enabled endpoints communicate with Speech service via a special proxy. Because of that, *you must change the endpoint connection URLs*.

A "standard" endpoint URL looks like: <p/>`{region}.{speech service offering}.speech.microsoft.com/{URL path}`

A private endpoint URL looks like: <p/>`{your custom name}.cognitiveservices.azure.com/{speech service offering}/{URL path}`

**Example 1.** An application is communicating by using the following URL (speech recognition using the base model for US English in West Europe):

```
wss://westeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US
```

To use it in the private-endpoint-enabled scenario when the custom domain name of the Speech resource is `my-private-link-speech.cognitiveservices.azure.com`, you must modify the URL like this:

```
wss://my-private-link-speech.cognitiveservices.azure.com/stt/speech/recognition/conversation/cognitiveservices/v1?language=en-US
```

Notice the details:

- The host name `westeurope.stt.speech.microsoft.com` is replaced by the custom domain host name `my-private-link-speech.cognitiveservices.azure.com`.
- The second element of the original DNS name (`stt`) becomes the first element of the URL path and precedes the original path. So the original URL `/speech/recognition/conversation/cognitiveservices/v1?language=en-US` becomes `/stt/speech/recognition/conversation/cognitiveservices/v1?language=en-US`.

**Example 2.** An application uses the following URL to synthesize speech in West Europe:
```
wss://westeurope.tts.speech.microsoft.com/cognitiveservices/websocket/v1
```

The following equivalent URL uses a private endpoint, where the custom domain name of the Speech resource is `my-private-link-speech.cognitiveservices.azure.com`:

```
wss://my-private-link-speech.cognitiveservices.azure.com/tts/cognitiveservices/websocket/v1
```

The same principle in Example 1 is applied, but the key element this time is `tts`.

#### Modifying applications

Follow these steps to modify your code:

1. Determine the application endpoint URL:

   - [Turn on logging for your application](how-to-use-logging.md) and run it to log activity.
   - In the log file, search for `SPEECH-ConnectionUrl`. In matching lines, the `value` parameter contains the full URL that your application used to reach the Speech service.

   Example:

   ```
   (114917): 41ms SPX_DBG_TRACE_VERBOSE:  property_bag_impl.cpp:138 ISpxPropertyBagImpl::LogPropertyAndValue: this=0x0000028FE4809D78; name='SPEECH-ConnectionUrl'; value='wss://westeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?traffictype=spx&language=en-US'
   ```

   So the URL that the application used in this example is:

   ```
   wss://westeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US
   ```

2. Create a `SpeechConfig` instance by using a full endpoint URL:

   1. Modify the endpoint that you just determined, as described in the earlier [Construct endpoint URL](#construct-endpoint-url) section.

   1. Modify how you create the instance of `SpeechConfig`. Most likely, your application is using something like this:
      ```csharp
      var config = SpeechConfig.FromSubscription(speechKey, azureRegion);
      ```
      This won't work for a private-endpoint-enabled Speech resource because of the host name and URL changes that we described in the previous sections. If you try to run your existing application without any modifications by using the key of a private-endpoint-enabled resource, you'll get an authentication error (401).

      To make it work, modify how you instantiate the `SpeechConfig` class and use "from endpoint"/"with endpoint" initialization. Suppose we have the following two variables defined:
      - `speechKey` contains the key of the private-endpoint-enabled Speech resource.
      - `endPoint` contains the full *modified* endpoint URL (using the type required by the corresponding programming language). In our example, this variable should contain:
        ```
        wss://my-private-link-speech.cognitiveservices.azure.com/stt/speech/recognition/conversation/cognitiveservices/v1?language=en-US
        ```

      Create a `SpeechConfig` instance:
      ```csharp
      var config = SpeechConfig.FromEndpoint(endPoint, speechKey);
      ```
      ```cpp
      auto config = SpeechConfig::FromEndpoint(endPoint, speechKey);
      ```
      ```java
      SpeechConfig config = SpeechConfig.fromEndpoint(endPoint, speechKey);
      ```
      ```python
      import azure.cognitiveservices.speech as speechsdk
      config = speechsdk.SpeechConfig(endpoint=endPoint, subscription=speechKey)
      ```
      ```objectivec
      SPXSpeechConfiguration *config = [[SPXSpeechConfiguration alloc] initWithEndpoint:endPoint subscription:speechKey];
      ```
      ```javascript
      import * as sdk from "microsoft.cognitiveservices.speech.sdk";
      config: sdk.SpeechConfig = sdk.SpeechConfig.fromEndpoint(new URL(endPoint), speechKey);
      ```

> [!TIP]
> The query parameters specified in the endpoint URI are not changed, even if they're set by other APIs. For example, if the recognition language is defined in the URI as query parameter `language=en-US`, and is also set to `ru-RU` via the corresponding property, the language setting in the URI is used. The effective language is then `en-US`.
>
> Parameters set in the endpoint URI always take precedence. Other APIs can override only parameters that are not specified in the endpoint URI.

After this modification, your application should work with the private-endpoint-enabled Speech resources. We're working on more seamless support of private endpoint scenarios.

[!INCLUDE [](includes/speech-studio-vnet.md)]


## Adjust an application to use a Speech resource without private endpoints

In this article, we've pointed out several times that enabling a custom domain for a Speech resource is *irreversible*. Such a resource will use a different way of communicating with Speech service, compared to the ones that are using [regional endpoint names](../cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints).

This section explains how to use a Speech resource with a custom domain name but *without* any private endpoints with the Speech service REST APIs and [Speech SDK](speech-sdk.md). This might be a resource that was once used in a private endpoint scenario, but then had its private endpoints deleted.

### DNS configuration

Remember how a custom domain DNS name of the private-endpoint-enabled Speech resource is [resolved from public networks](#resolve-dns-from-other-networks). In this case, the IP address resolved points to a proxy endpoint for a virtual network. That endpoint is used for dispatching the network traffic to the private-endpoint-enabled Azure AI services resource.

However, when *all* resource private endpoints are removed (or right after the enabling of the custom domain name), the CNAME record of the Speech resource is reprovisioned. It now points to the IP address of the corresponding [Azure AI services regional endpoint](../cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints).

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

### Speech resource with a custom domain name and without private endpoints: Usage with the REST APIs

#### Speech to text REST API

Speech to text REST API usage is fully equivalent to the case of [private-endpoint-enabled Speech resources](#speech-to-text-rest-api).

#### Speech to text REST API for short audio and Text to speech REST API

In this case, usage of the Speech to text REST API for short audio and usage of the Text to speech REST API have no differences from the general case, with one exception. (See the following note.) You should use both APIs as described in the [Speech to text REST API for short audio](rest-speech-to-text-short.md) and [Text to speech REST API](rest-text-to-speech.md) documentation.

> [!NOTE]
> When you're using the Speech to text REST API for short audio and Text to speech REST API in custom domain scenarios, use a Speech resource key passed through the `Ocp-Apim-Subscription-Key` header. (See details for [Speech to text REST API for short audio](rest-speech-to-text-short.md#request-headers) and [Text to speech REST API](rest-text-to-speech.md#request-headers))
>
> Using an authorization token and passing it to the special endpoint via the `Authorization` header will work *only* if you've turned on the **All networks** access option in the **Networking** section of your Speech resource. In other cases you will get either `Forbidden` or `BadRequest` error when trying to obtain an authorization token.

### Speech resource with a custom domain name and without private endpoints: Usage with the Speech SDK

Using the Speech SDK with custom-domain-enabled Speech resources *without* private endpoints is equivalent to the general case as described in the [Speech SDK documentation](speech-sdk.md).

In case you have modified your code for using with a [private-endpoint-enabled Speech resource](#speech-resource-with-a-custom-domain-name-and-a-private-endpoint-usage-with-the-speech-sdk), consider the following.

In the section on [private-endpoint-enabled Speech resources](#speech-resource-with-a-custom-domain-name-and-a-private-endpoint-usage-with-the-speech-sdk), we explained how to determine the endpoint URL, modify it, and make it work through "from endpoint"/"with endpoint" initialization of the `SpeechConfig` class instance.

However, if you try to run the same application after having all private endpoints removed (allowing some time for the corresponding DNS record reprovisioning), you'll get an internal service error (404). The reason is that the [DNS record](#dns-configuration) now points to the regional Azure AI services endpoint instead of the virtual network proxy, and the URL paths like `/stt/speech/recognition/conversation/cognitiveservices/v1?language=en-US` won't be found there.

You need to roll back your application to the standard instantiation of `SpeechConfig` in the style of the following code:

```csharp
var config = SpeechConfig.FromSubscription(speechKey, azureRegion);
```

[!INCLUDE [](includes/speech-vnet-service-enpoints-private-endpoints-simultaneously.md)]

## Pricing

For pricing details, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link).

## Learn more

* [Use Speech service through a Virtual Network service endpoint](speech-service-vnet-service-endpoint.md)
* [Azure Private Link](../../private-link/private-link-overview.md)
* [Azure VNet service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md)
* [Speech SDK](speech-sdk.md)
* [Speech to text REST API](rest-speech-to-text.md)
* [Text to speech REST API](rest-text-to-speech.md)
