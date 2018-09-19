---
title: Use AES-128 dynamic encryption and the key delivery service | Microsoft Docs
description: Deliver your content encrypted with AES 128-bit encryption keys by using Microsoft Azure Media Services. Media Services also provides the key delivery service that delivers encryption keys to authorized users. This topic shows how to dynamically encrypt with AES-128 and use the key delivery service.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.assetid: 4d2c10af-9ee0-408f-899b-33fa4c1d89b9
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/18/2018
ms.author: juliako

---
# Use AES-128 dynamic encryption and the key delivery service
> [!div class="op_single_selector"]
> * [.NET](media-services-protect-with-aes128.md)
> * [Java](https://github.com/southworkscom/azure-sdk-for-media-services-java-samples)
> * [PHP](https://github.com/Azure/azure-sdk-for-php/tree/master/examples/MediaServices)
>  

> [!NOTE]
> To get the latest version of the Java SDK and get started developing with Java, see [Get started with the Java client SDK for Azure Media Services](https://docs.microsoft.com/azure/media-services/media-services-java-how-to-use). <br/>
> To download the latest PHP SDK for Media Services, look for version 0.5.7 of the Microsoft/WindowsAzure package in the [Packagist repository](https://packagist.org/packages/microsoft/windowsazure#v0.5.7).  

## Overview
> [!NOTE]
> For information on how to encrypt content with the Advanced Encryption Standard (AES) for delivery to Safari on macOS, see [this blog post](https://azure.microsoft.com/blog/how-to-make-token-authorized-aes-encrypted-hls-stream-working-in-safari/).
> For an overview of how to protect your media content with AES encryption, see [this video](https://channel9.msdn.com/Shows/Azure-Friday/Azure-Media-Services-Protecting-your-Media-Content-with-AES-Encryption).
> 
> 

 You can use Media Services to deliver HTTP Live Streaming (HLS) and Smooth Streaming encrypted with the AES by using 128-bit encryption keys. Media Services also provides the key delivery service that delivers encryption keys to authorized users. If you want Media Services to encrypt an asset, you associate an encryption key with the asset and also configure authorization policies for the key. When a stream is requested by a player, Media Services uses the specified key to dynamically encrypt your content by using AES encryption. To decrypt the stream, the player requests the key from the key delivery service. To determine whether the user is authorized to get the key, the service evaluates the authorization policies that you specified for the key.

Media Services supports multiple ways of authenticating users who make key requests. The content key authorization policy can have one or more authorization restrictions, either open or token restrictions. The token-restricted policy must be accompanied by a token issued by a security token service (STS). Media Services supports tokens in the [simple web token](https://msdn.microsoft.com/library/gg185950.aspx#BKMK_2) (SWT) and [JSON Web Token](https://msdn.microsoft.com/library/gg185950.aspx#BKMK_3) (JWT) formats. For more information, see [Configure the content key's authorization policy](media-services-protect-with-aes128.md#configure_key_auth_policy).

To take advantage of dynamic encryption, you need to have an asset that contains a set of multi-bitrate MP4 files or multi-bitrate Smooth Streaming source files. You also need to configure the delivery policy for the asset (described later in this article). Then, based on the format specified in the streaming URL, the on-demand streaming server ensures that the stream is delivered in the protocol you selected. As a result, you need to store and pay only for the files in single storage format. Media Services builds and serves the appropriate response based on requests from a client.

This article is useful to developers who work on applications that deliver protected media. The article shows you how to configure the key delivery service with authorization policies so that only authorized clients can receive encryption keys. It also shows how to use dynamic encryption.


## AES-128 dynamic encryption and key delivery service workflow

Perform the following general steps when you encrypt your assets with AES by using the Media Services key delivery service and also by using dynamic encryption:

1. [Create an asset, and upload files into the asset](media-services-protect-with-aes128.md#create_asset).

2. [Encode the asset that contains the file to the adaptive bitrate MP4 set](media-services-protect-with-aes128.md#encode_asset).

3. [Create a content key, and associate it with the encoded asset](media-services-protect-with-aes128.md#create_contentkey). In Media Services, the content key contains the asset's encryption key.

4. [Configure the content key's authorization policy](media-services-protect-with-aes128.md#configure_key_auth_policy). You must configure the content key authorization policy. The client must meet the policy before the content key is delivered to the client.

5. [Configure the delivery policy for an asset](media-services-protect-with-aes128.md#configure_asset_delivery_policy). The delivery policy configuration includes the key acquisition URL and an initialization vector (IV). (AES-128 requires the same IV for encryption and decryption.) The configuration also includes the delivery protocol (for example, MPEG-DASH, HLS, Smooth Streaming, or all) and the type of dynamic encryption (for example, envelope or no dynamic encryption).

	You can apply a different policy to each protocol on the same asset. For example, you can apply PlayReady encryption to Smooth/DASH and an AES envelope to HLS. Any protocols that aren't defined in a delivery policy are blocked from streaming. (An example is if you add a single policy that specifies only HLS as the protocol.) The exception is if you have no asset delivery policy defined at all. Then, all protocols are allowed in the clear.

6. [Create an OnDemand locator](media-services-protect-with-aes128.md#create_locator) to get a streaming URL.

The article also shows [how a client application can request a key from the key delivery service](media-services-protect-with-aes128.md#client_request).

You can find a complete [.NET example](media-services-protect-with-aes128.md#example) at the end of the article.

The following image demonstrates the workflow previously described. Here, the token is used for authentication.

![Protect with AES-128](./media/media-services-content-protection-overview/media-services-content-protection-with-aes.png)

The remainder of this article provides explanations, code examples, and links to topics that show you how to achieve the tasks previously described.

## Current limitations
If you add or update your asset's delivery policy, you must delete any existing locator and create a new locator.

## <a id="create_asset"></a>Create an asset and upload files into the asset
To manage, encode, and stream your videos, you must first upload your content into Media Services. After it's uploaded, your content is stored securely in the cloud for further processing and streaming. 

For more information, see [Upload files into a Media Services account](media-services-dotnet-upload-files.md).

## <a id="encode_asset"></a>Encode the asset that contains the file to the adaptive bitrate MP4 set
With dynamic encryption, you create an asset that contains a set of multi-bitrate MP4 files or multi-bitrate Smooth Streaming source files. Then, based on the specified format in the manifest or fragment request, the on-demand streaming server ensures that you receive the stream in the protocol you selected. Then, you only need to store and pay for the files in single storage format. Media Services builds and serves the appropriate response based on requests from a client. For more information, see [Dynamic packaging overview](media-services-dynamic-packaging-overview.md).

>[!NOTE]
>When your Media Services account is created, a default streaming endpoint is added to your account in the "Stopped" state. To start streaming your content and take advantage of dynamic packaging and dynamic encryption, the streaming endpoint from which you want to stream content must be in the "Running" state. 
>
>Also, to use dynamic packaging and dynamic encryption, your asset must contain a set of adaptive bitrate MP4s or adaptive bitrate Smooth Streaming files.

For instructions on how to encode, see [Encode an asset by using Media Encoder Standard](media-services-dotnet-encode-with-media-encoder-standard.md).

## <a id="create_contentkey"></a>Create a content key and associate it with the encoded asset
In Media Services, the content key contains the key that you want to encrypt an asset with.

For more information, see [Create a content key](media-services-dotnet-create-contentkey.md).

## <a id="configure_key_auth_policy"></a>Configure the content key's authorization policy
Media Services supports multiple ways of authenticating users who make key requests. You must configure the content key authorization policy. The client (player) must meet the policy before the key can be delivered to the client. The content key authorization policy can have one or more authorization restrictions, either open, token restriction, or IP restriction.

For more information, see [Configure a content key authorization policy](media-services-dotnet-configure-content-key-auth-policy.md).

## <a id="configure_asset_delivery_policy"></a>Configure an asset delivery policy
Configure the delivery policy for your asset. Some things that the asset delivery policy configuration includes are:

* The key acquisition URL. 
* The initialization vector (IV) to use for the envelope encryption. AES-128 requires the same IV for encryption and decryption. 
* The asset delivery protocol (for example, MPEG-DASH, HLS, Smooth Streaming, or all).
* The type of dynamic encryption (for example, AES envelope) or no dynamic encryption. 

For more information, see [Configure an asset delivery policy](media-services-dotnet-configure-asset-delivery-policy.md).

## <a id="create_locator"></a>Create an OnDemand streaming locator to get a streaming URL
You need to provide your user with the streaming URL for Smooth Streaming, DASH, or HLS.

> [!NOTE]
> If you add or update your asset's delivery policy, you must delete any existing locator and create a new locator.
> 
> 

For instructions on how to publish an asset and build a streaming URL, see [Build a streaming URL](media-services-deliver-streaming-content.md).

## Get a test token
Get a test token based on the token restriction that was used for the key authorization policy.

```csharp
    // Deserializes a string containing an Xml representation of a TokenRestrictionTemplate
    // back into a TokenRestrictionTemplate class instance.
    TokenRestrictionTemplate tokenTemplate = 
        TokenRestrictionTemplateSerializer.Deserialize(tokenTemplateString);

    // Generate a test token based on the data in the given TokenRestrictionTemplate.
    //The GenerateTestToken method returns the token without the word "Bearer" in front
    //so you have to add it in front of the token string. 
    string testToken = TokenRestrictionTemplateSerializer.GenerateTestToken(tokenTemplate);
    Console.WriteLine("The authorization token is:\nBearer {0}", testToken);
```

You can use the [Azure Media Services Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html) to test your stream.

## <a id="client_request"></a>How can your client request a key from the key delivery service?
In the previous step, you constructed the URL that points to a manifest file. Your client needs to extract the necessary information from the streaming manifest files to make a request to the key delivery service.

### Manifest files
The client needs to extract the URL (that also contains content key ID [kid]) value from the manifest file. The client then tries to get the encryption key from the key delivery service. The client also needs to extract the IV value and use it to decrypt the stream. The following snippet shows the <Protection> element of the Smooth Streaming manifest:

```xml
    <Protection>
      <ProtectionHeader SystemID="B47B251A-2409-4B42-958E-08DBAE7B4EE9">
        <ContentProtection xmlns:sea="urn:mpeg:dash:schema:sea:2012" schemeIdUri="urn:mpeg:dash:sea:2012">
          <sea:SegmentEncryption schemeIdUri="urn:mpeg:dash:sea:aes128-cbc:2013"/>
          <sea:KeySystem keySystemUri="urn:mpeg:dash:sea:keysys:http:2013"/>
          <sea:CryptoPeriod IV="0xD7D7D7D7D7D7D7D7D7D7D7D7D7D7D7D7" 
                            keyUriTemplate="https://wamsbayclus001kd-hs.cloudapp.net/HlsHandler.ashx?
                                            kid=da3813af-55e6-48e7-aa9f-a4d6031f7b4d"/>
        </ContentProtection>
      </ProtectionHeader>
    </Protection>
```

In the case of HLS, the root manifest is broken into segment files. 

For example, the root manifest is: http://test001.origin.mediaservices.windows.net/8bfe7d6f-34e3-4d1a-b289-3e48a8762490/BigBuckBunny.ism/manifest(format=m3u8-aapl). It contains a list of segment file names.

    . . . 
    #EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=630133,RESOLUTION=424x240,CODECS="avc1.4d4015,mp4a.40.2",AUDIO="audio"
    QualityLevels(514369)/Manifest(video,format=m3u8-aapl)
    #EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=965441,RESOLUTION=636x356,CODECS="avc1.4d401e,mp4a.40.2",AUDIO="audio"
    QualityLevels(842459)/Manifest(video,format=m3u8-aapl)
    …

If you open one of the segment files in a text editor (for example, http://test001.origin.mediaservices.windows.net/8bfe7d6f-34e3-4d1a-b289-3e48a8762490/BigBuckBunny.ism/QualityLevels(514369)/Manifest(video,format=m3u8-aapl), it contains #EXT-X-KEY, which indicates that the file is encrypted.

    #EXTM3U
    #EXT-X-VERSION:4
    #EXT-X-ALLOW-CACHE:NO
    #EXT-X-MEDIA-SEQUENCE:0
    #EXT-X-TARGETDURATION:9
    #EXT-X-KEY:METHOD=AES-128,
    URI="https://wamsbayclus001kd-hs.cloudapp.net/HlsHandler.ashx?
         kid=da3813af-55e6-48e7-aa9f-a4d6031f7b4d",
            IV=0XD7D7D7D7D7D7D7D7D7D7D7D7D7D7D7D7
    #EXT-X-PROGRAM-DATE-TIME:1970-01-01T00:00:00.000+00:00
    #EXTINF:8.425708,no-desc
    Fragments(video=0,format=m3u8-aapl)
    #EXT-X-ENDLIST

>[!NOTE] 
>If you plan to play an AES-encrypted HLS in Safari, see [this blog](https://azure.microsoft.com/blog/how-to-make-token-authorized-aes-encrypted-hls-stream-working-in-safari/).

### Request the key from the key delivery service

The following code shows how to send a request to the Media Services key delivery service by using a key delivery Uri (that was extracted from the manifest) and a token. (This article doesn't explain how to get SWTs from an STS.)

```csharp
    private byte[] GetDeliveryKey(Uri keyDeliveryUri, string token)
    {
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(keyDeliveryUri);

        request.Method = "POST";
        request.ContentType = "text/xml";
        if (!string.IsNullOrEmpty(token))
        {
            request.Headers[AuthorizationHeader] = token;
        }
        request.ContentLength = 0;

        var response = request.GetResponse();

        var stream = response.GetResponseStream();
        if (stream == null)
        {
            throw new NullReferenceException("Response stream is null");
        }

        var buffer = new byte[256];
        var length = 0;
        while (stream.CanRead && length <= buffer.Length)
        {
            var nexByte = stream.ReadByte();
            if (nexByte == -1)
            {
                break;
            }
            buffer[length] = (byte)nexByte;
            length++;
        }
        response.Close();

        // AES keys must be exactly 16 bytes (128 bits).
        var key = new byte[length];
        Array.Copy(buffer, key, length);
        return key;
    }
```

## Protect your content with AES-128 by using .NET

### Create and configure a Visual Studio project

1. Set up your development environment, and populate the app.config file with connection information, as described in [Media Services development with .NET](media-services-dotnet-how-to-use.md).

2. Add the following elements to appSettings, as defined in your app.config file:

    ```xml
    <add key="Issuer" value="http://testissuer.com"/>
    <add key="Audience" value="urn:test"/>
    ```

### <a id="example"></a>Example

Overwrite the code in your Program.cs file with the code shown in this section.
 
>[!NOTE]
>There is a limit of 1,000,000 policies for different Media Services policies (for example, for Locator policy or ContentKeyAuthorizationPolicy). Use the same policy ID if you always use the same days/access permissions. An example is policies for locators that are intended to remain in place for a long time (non-upload policies). For more information, see the "Limit access policies" section in [Manage assets and related entities with the Media Services .NET SDK](media-services-dotnet-manage-entities.md#limit-access-policies).

Make sure to update variables to point to folders where your input files are located.

[!code-csharp[Main](../../../samples-mediaservices-encryptionaes/DynamicEncryptionWithAES/DynamicEncryptionWithAES/Program.cs)]

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]
