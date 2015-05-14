<properties 
	pageTitle="Configure Asset Delivery Policies using .NET" 
	description="This topic shows how to configure different asset delivery policies." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/06/2015" 
	ms.author="juliako"/>

#How to: Configure Asset Delivery Policies
[AZURE.INCLUDE [media-services-selector-asset-delivery-policy](../includes/media-services-selector-asset-delivery-policy.md)]

This article is part of the [Media Services Video on Demand workflow](media-services-video-on-demand-workflow.md) and [Media Services Live Streaming workflow](media-services-live-streaming-workflow.md) series. 

One of the steps in the Media Services content delivery workflow is configuring delivery policies for assets that you want to be streamed. The asset delivery policy tells Media Services how you want for your asset to be delivered: into which streaming protocol should your asset be dynamically packaged (for example, MPEG DASH, HLS, Smooth Streaming, or all), whether or not you want to dynamically encrypt your asset and how (envelope or common encryption). 

This topic discusses why and how to create and configure asset delivery policies. 

>[AZURE.NOTE]To be able to use dynamic packaging and dynamic encryption, you must make sure to have at least one scale unit (also known as streaming unit). For more information, see [How to Scale a Media Service](media-services-manage-origins.md#scale_streaming_endpoints). 
>
>Also, your asset must contain a set of adaptive bitrate MP4s or adaptive bitrate Smooth Streaming files.      

You could apply different policies to the same asset. For example, you could apply PlayReady encryption to Smooth Streaming and AES Envelope encryption to MPEG DASH and HLS. Any protocols that are not defined in a delivery policy (for example, you add a single policy that only specifies HLS as the protocol) will be blocked from streaming. The exception to this is if you have no asset delivery policy defined at all. Then, all protocols will be allowed in the clear.

Note that if your want to delivery a storage encrypted asset, you must configure the asset’s delivery policy. Before your asset can be streamed, the streaming server removes the storage encryption and streams your content using the specified delivery policy. For example, to deliver your asset encrypted with Advanced Encryption Standard (AES) envelope encryption key, set the policy type to **DynamicEnvelopeEncryption**. To remove storage encryption and stream the asset in the clear, set the policy type to **NoDynamicEncryption**. Examples that show how to configure these policy types follow. 

Depending on how you configure the asset delivery policy you would be able to dynamically package, dynamically encrypt, and stream the following streaming protocols: Smooth Streaming, HLS, MPEG DASH, and HDS streams.  

The following list shows the formats that you use to stream Smooth, HLS, DASH and HDS.  

Smooth Streaming:

	{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest

HLS:

	{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=m3u8-aapl)

MPEG DASH

	{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=mpd-time-csf) 

HDS

	{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=f4m-f4f)

For instructions on how to publish an asset and build a streaming URL, see [Build a streaming URL](media-services-deliver-streaming-content.md).

##Clear asset delivery policy 

The following **ConfigureClearAssetDeliveryPolicy** method specifies to not apply dynamic encryption and to deliver the stream in any of the following protocols:  MPEG DASH, HLS, and Smooth Streaming protocols. 
  
For information on what values you can specify when creating an AssetDeliveryPolicy, see the [Types used when defining AssetDeliveryPolicy](#types) section. 

    static public void ConfigureClearAssetDeliveryPolicy(IAsset asset)
    {
        IAssetDeliveryPolicy policy =
            _context.AssetDeliveryPolicies.Create("Clear Policy",
            AssetDeliveryPolicyType.NoDynamicEncryption, 
            AssetDeliveryProtocol.HLS | AssetDeliveryProtocol.SmoothStreaming | AssetDeliveryProtocol.Dash, null);

        asset.DeliveryPolicies.Add(policy);
    }

##DynamicCommonEncryption asset delivery policy 


The following **CreateAssetDeliveryPolicy** method creates the **AssetDeliveryPolicy** that is configured to apply dynamic common encryption (**DynamicCommonEncryption**) to a smooth streaming protocol (other protocols will be blocked from streaming). The method takes two parameters : **Asset** (the asset to which you want to apply the delivery policy) and **IContentKey** (the content key of the **CommonEncryption** type, for more information, see: [Creating a content key](media-services-dotnet-create-contentkey.md#common_contentkey)).

For information on what values you can specify when creating an AssetDeliveryPolicy, see the [Types used when defining AssetDeliveryPolicy](#types) section. 


    static public void CreateAssetDeliveryPolicy(IAsset asset, IContentKey key)
    {
        Uri acquisitionUrl = key.GetKeyDeliveryUrl(ContentKeyDeliveryType.PlayReadyLicense);

        Dictionary<AssetDeliveryPolicyConfigurationKey, string> assetDeliveryPolicyConfiguration =
            new Dictionary<AssetDeliveryPolicyConfigurationKey, string>
        {
            {AssetDeliveryPolicyConfigurationKey.PlayReadyLicenseAcquisitionUrl, acquisitionUrl.ToString()},
        };

        var assetDeliveryPolicy = _context.AssetDeliveryPolicies.Create(
                "AssetDeliveryPolicy",
            AssetDeliveryPolicyType.DynamicCommonEncryption,
            AssetDeliveryProtocol.SmoothStreaming,
            assetDeliveryPolicyConfiguration);

        // Add AssetDelivery Policy to the asset
        asset.DeliveryPolicies.Add(assetDeliveryPolicy);

        Console.WriteLine();
        Console.WriteLine("Adding Asset Delivery Policy: " +
            assetDeliveryPolicy.AssetDeliveryPolicyType);
    }



##DynamicEnvelopeEncryption asset delivery policy 

The following **CreateAssetDeliveryPolicy** method creates the **AssetDeliveryPolicy** that is configured to apply dynamic envelope encryption (**DynamicEnvelopeEncryption**) to HLS and DASH protocols (other protocols will be blocked from streaming). The method takes two parameters : **Asset** (the asset to which you want to apply the delivery policy) and **IContentKey** (the content key of the **EnvelopeEncryption** type, for more information, see: [Creating a content key](media-services-dotnet-create-contentkey.md#envelope_contentkey)).


For information on what values you can specify when creating an AssetDeliveryPolicy, see the [Types used when defining AssetDeliveryPolicy](#types) section.   

    private static void CreateAssetDeliveryPolicy(IAsset asset, IContentKey key)
    {
        
        //  Get the Key Delivery Base Url by removing the Query parameter.  The Dynamic Encryption service will
        //  automatically add the correct key identifier to the url when it generates the Envelope encrypted content
        //  manifest.  Omitting the IV will also cause the Dynamice Encryption service to generate a deterministic
        //  IV for the content automatically.  By using the EnvelopeBaseKeyAcquisitionUrl and omitting the IV, this
        //  allows the AssetDelivery policy to be reused by more than one asset.
        //
        Uri keyAcquisitionUri = key.GetKeyDeliveryUrl(ContentKeyDeliveryType.BaselineHttp);
        UriBuilder uriBuilder = new UriBuilder(keyAcquisitionUri);
        uriBuilder.Query = String.Empty;
        keyAcquisitionUri = uriBuilder.Uri;

        // The following policy configuration specifies: 
        //   key url that will have KID=<Guid> appended to the envelope and
        //   the Initialization Vector (IV) to use for the envelope encryption.
        Dictionary<AssetDeliveryPolicyConfigurationKey, string> assetDeliveryPolicyConfiguration =
            new Dictionary<AssetDeliveryPolicyConfigurationKey, string> 
        {
            {AssetDeliveryPolicyConfigurationKey.EnvelopeBaseKeyAcquisitionUrl, keyAcquisitionUri.ToString()},
        };

        IAssetDeliveryPolicy assetDeliveryPolicy =
            _context.AssetDeliveryPolicies.Create(
                        "AssetDeliveryPolicy",
                        AssetDeliveryPolicyType.DynamicEnvelopeEncryption,
                        AssetDeliveryProtocol.HLS | AssetDeliveryProtocol.Dash,
                        assetDeliveryPolicyConfiguration);

        // Add AssetDelivery Policy to the asset
        asset.DeliveryPolicies.Add(assetDeliveryPolicy);

        Console.WriteLine();
        Console.WriteLine("Adding Asset Delivery Policy: " + assetDeliveryPolicy.AssetDeliveryPolicyType);
    }


##<a id="types"></a>Types used when defining AssetDeliveryPolicy

###<a id="AssetDeliveryProtocol"></a>AssetDeliveryProtocol 

    /// <summary>
    /// Delivery protocol for an asset delivery policy.
    /// </summary>
    [Flags]
    public enum AssetDeliveryProtocol
    {
        /// <summary>
        /// No protocols.
        /// </summary>
        None = 0x0,

        /// <summary>
        /// Smooth streaming protocol.
        /// </summary>
        SmoothStreaming = 0x1,

        /// <summary>
        /// MPEG Dynamic Adaptive Streaming over HTTP (DASH)
        /// </summary>
        Dash = 0x2,

        /// <summary>
        /// Apple HTTP Live Streaming protocol.
        /// </summary>
        HLS = 0x4,

        /// <summary>
        /// Adobe HTTP Dynamic Streaming (HDS)
        /// </summary>
        Hds = 0x8,

        /// <summary>
        /// Include all protocols.
        /// </summary>
        All = 0xFFFF
    }

###<a id="AssetDeliveryPolicyType"></a>AssetDeliveryPolicyType

    /// <summary>
    /// Policy type for dynamic encryption of assets.
    /// </summary>
    public enum AssetDeliveryPolicyType
    {
        /// <summary>
        /// Delivery Policy Type not set.  An invalid value.
        /// </summary>
        None,

        /// <summary>
        /// The Asset should not be delivered via this AssetDeliveryProtocol. 
        /// </summary>
        Blocked, 

        /// <summary>
        /// Do not apply dynamic encryption to the asset.
        /// </summary>
        /// 
        NoDynamicEncryption,  

        /// <summary>
        /// Apply Dynamic Envelope encryption.
        /// </summary>
        DynamicEnvelopeEncryption,

        /// <summary>
        /// Apply Dynamic Common encryption.
        /// </summary>
        DynamicCommonEncryption
    }

###<a id="ContentKeyDeliveryType"></a>ContentKeyDeliveryType

    /// <summary>
    /// Delivery method of the content key to the client.
    /// </summary>
    public enum ContentKeyDeliveryType
    {
        /// <summary>
        /// None.
        /// </summary>
        None,

        /// <summary>
        /// Use PlayReady License acquistion protocol
        /// </summary>
        PlayReadyLicense,

        /// <summary>
        /// Use MPEG Baseline HTTP key protocol.
        /// </summary>
        BaselineHttp
    }

###<a id="AssetDeliveryPolicyConfigurationKey"></a>AssetDeliveryPolicyConfigurationKey

    /// <summary>
    /// Keys used to get specific configuration for an asset delivery policy.
    /// </summary>
    public enum AssetDeliveryPolicyConfigurationKey
    {
        /// <summary>
        /// No policies.
        /// </summary>
        None,

        /// <summary>
        /// Exact Envelope key URL.
        /// </summary>
        EnvelopeKeyAcquisitionUrl,

        /// <summary>
        /// Base key url that will have KID=<Guid> appended for Envelope.
        /// </summary>
        EnvelopeBaseKeyAcquisitionUrl,
        
        /// <summary>
        /// The initialization vector to use for envelope encryption in Base64 format.
        /// </summary>
        EnvelopeEncryptionIVAsBase64,

        /// <summary>
        /// The PlayReady License Acquisition Url to use for common encryption.
        /// </summary>
        PlayReadyLicenseAcquisitionUrl,

        /// <summary>
        /// The PlayReady Custom Attributes to add to the PlayReady Content Header
        /// </summary>
        PlayReadyCustomAttributes,

        /// <summary>
        /// The initialization vector to use for envelope encryption.
        /// </summary>
        EnvelopeEncryptionIV,
    }