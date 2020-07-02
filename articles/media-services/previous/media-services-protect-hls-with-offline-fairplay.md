---
title: Protect HLS content with offline Apple FairPlay - Azure | Microsoft Docs 
description: This topic gives an overview and shows how to use Azure Media Services to dynamically encrypt your HTTP Live Streaming (HLS) content with Apple FairPlay in offline mode.
services: media-services
keywords: HLS, DRM, FairPlay Streaming (FPS), Offline, iOS 10
documentationcenter: ''
author: willzhan
manager: steveng
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/07/2020
ms.author: willzhan
ms.reviewer: dwgeo

---
# Offline FairPlay Streaming for iOS 

> [!div class="op_single_selector" title1="Select the version of Media Services that you are using:"]
> * [Version 3](../latest/offline-fairplay-for-ios.md)
> * [Version 2](media-services-protect-hls-with-offline-fairplay.md)

> [!NOTE]
> No new features or functionality are being added to Media Services v2. <br/>Check out the latest version, [Media Services v3](https://docs.microsoft.com/azure/media-services/latest/). Also, see [migration guidance from v2 to v3](../latest/migrate-from-v2-to-v3.md)

Azure Media Services provides a set of well-designed [content protection services](https://azure.microsoft.com/services/media-services/content-protection/) that cover:

- Microsoft PlayReady
- Google Widevine
- Apple FairPlay
- AES-128 encryption

Digital rights management (DRM)/Advanced Encryption Standard (AES) encryption of content is performed dynamically upon request for various streaming protocols. DRM license/AES decryption key delivery services also are provided by Media Services.

Besides protecting content for online streaming over various streaming protocols, offline mode for protected content is also an often-requested feature. Offline-mode support is needed for the following scenarios:

* Playback when internet connection isn't available, such as during travel.
* Some content providers might disallow DRM license delivery beyond a country/region's border. If users want to watch content while traveling outside of the country/region, offline download is needed.
* In some countries/regions, internet availability and/or bandwidth is still limited. Users might choose to download first to be able to watch content in a resolution that is high enough for a satisfactory viewing experience. In this case, the issue typically isn't network availability but limited network bandwidth. Over-the-top (OTT)/online video platform (OVP) providers request offline-mode support.

This article covers FairPlay Streaming (FPS) offline-mode support that targets devices running iOS 10 or later. This feature isn't supported for other Apple platforms, such as watchOS, tvOS, or Safari on macOS.

## Preliminary steps
Before you implement offline DRM for FairPlay on an iOS 10+ device:

* Become familiar with online content protection for FairPlay. For more information, see the following articles and samples:

    - [Apple FairPlay Streaming for Azure Media Services is generally available](https://azure.microsoft.com/blog/apple-FairPlay-streaming-for-azure-media-services-generally-available/)
    - [Protect your HLS content with Apple FairPlay or Microsoft PlayReady](https://docs.microsoft.com/azure/media-services/media-services-protect-hls-with-FairPlay)
    - [A sample for online FPS streaming](https://azure.microsoft.com/resources/samples/media-services-dotnet-dynamic-encryption-with-FairPlay/)

* Obtain the FPS SDK from the Apple Developer Network. The FPS SDK contains two components:

    - The FPS Server SDK, which contains the Key Security Module (KSM), client samples, a specification, and a set of test vectors.
    - The FPS Deployment Pack, which contains the D function specification, along with instructions about how to generate the FPS Certificate, customer-specific private key, and Application Secret Key. Apple issues the FPS Deployment Pack only to licensed content providers.

## Configuration in Media Services
For FPS offline-mode configuration via the [Media Services .NET SDK](https://www.nuget.org/packages/windowsazure.mediaservices), use the Media Services .NET SDK version 4.0.0.4 or later, which provides the necessary API to configure FPS offline mode.
You also need the working code to configure online-mode FPS content protection. After you obtain the code to configure online-mode content protection for FPS, you need only the following two changes.

## Code change in the FairPlay configuration
The first change is to define an "enable offline mode" Boolean, called objDRMSettings.EnableOfflineMode, that is true when it enables the offline DRM scenario. Depending on this indicator, make the following change to the FairPlay configuration:

```csharp
if (objDRMSettings.EnableOfflineMode)
    {
        FairPlayConfiguration = Microsoft.WindowsAzure.MediaServices.Client.FairPlay.FairPlayConfiguration.CreateSerializedFairPlayOptionConfiguration(
            objX509Certificate2,
            pfxPassword,
            pfxPasswordId,
            askId,
            iv, 
            RentalAndLeaseKeyType.PersistentUnlimited,
            0x9999);
    }
    else
    {
        FairPlayConfiguration = Microsoft.WindowsAzure.MediaServices.Client.FairPlay.FairPlayConfiguration.CreateSerializedFairPlayOptionConfiguration(
            objX509Certificate2,
            pfxPassword,
            pfxPasswordId,
            askId,
            iv);
    }
```

## Code change in the asset delivery policy configuration
The second change is to add the third key into Dictionary<AssetDeliveryPolicyConfigurationKey, string>.
Add AssetDeliveryPolicyConfigurationKey as shown here:
 
```csharp
// FPS offline mode
    if (drmSettings.EnableOfflineMode)
    {
        objDictionary_AssetDeliveryPolicyConfigurationKey.Add(AssetDeliveryPolicyConfigurationKey.AllowPersistentLicense, "true");
        Console.WriteLine("FPS OFFLINE MODE: AssetDeliveryPolicyConfigurationKey.AllowPersistentLicense added into asset delivery policy configuration.");
    }

    // for IAssetDelivery for FPS
    IAssetDeliveryPolicy objIAssetDeliveryPolicy = objCloudMediaContext.AssetDeliveryPolicies.Create(
            drmSettings.AssetDeliveryPolicyName,
            AssetDeliveryPolicyType.DynamicCommonEncryptionCbcs,
            AssetDeliveryProtocol.HLS,
            objDictionary_AssetDeliveryPolicyConfigurationKey);
```

After this step, the <Dictionary_AssetDeliveryPolicyConfigurationKey> string in the FPS asset delivery policy contains the following three entries:

* AssetDeliveryPolicyConfigurationKey.FairPlayBaseLicenseAcquisitionUrl or AssetDeliveryPolicyConfigurationKey.FairPlayLicenseAcquisitionUrl, depending on factors such as the FPS KSM/key server used and whether you reuse the same asset delivery policy across multiple assets
* AssetDeliveryPolicyConfigurationKey.CommonEncryptionIVForCbcs
* AssetDeliveryPolicyConfigurationKey.AllowPersistentLicense

Now your Media Services account is configured to deliver offline FairPlay licenses.

## Sample iOS Player
FPS offline-mode support is available only on iOS 10 and later. The FPS Server SDK (version 3.0 or later) contains the document and sample for FPS offline mode. 
Specifically, FPS Server SDK (version 3.0 or later) contains the following two items related to offline mode:

* Document: "Offline Playback with FairPlay Streaming and HTTP Live Streaming." Apple, September 14, 2016. In FPS Server SDK version 4.0, this document is merged into the main FPS document.
* Sample code: HLSCatalog sample for FPS offline mode in the \FairPlay Streaming Server SDK version 3.1\Development\Client\HLSCatalog_With_FPS\HLSCatalog\. 
In the HLSCatalog sample app, the following code files are used to implement offline-mode features:

    - AssetPersistenceManager.swift code file: AssetPersistenceManager is the main class in this sample that demonstrates how to:

        - Manage downloading HLS streams, such as the APIs used to start and cancel downloads and to delete existing assets off devices.
        - Monitor the download progress.
    - AssetListTableViewController.swift and AssetListTableViewCell.swift code files: AssetListTableViewController is the main interface of this sample. It provides a list of assets the sample can use to play, download, delete, or cancel a download. 

These steps show how to set up a running iOS player. Assuming you start from the HLSCatalog sample in FPS Server SDK version 4.0.1, make the following code changes:

In HLSCatalog\Shared\Managers\ContentKeyDelegate.swift, implement the method `requestContentKeyFromKeySecurityModule(spcData: Data, assetID: String)` by using the following code. Let "drmUr" be a variable assigned to the HLS URL.

```swift
    var ckcData: Data? = nil
    
    let semaphore = DispatchSemaphore(value: 0)
    let postString = "spc=\(spcData.base64EncodedString())&assetId=\(assetIDString)"
    
    if let postData = postString.data(using: .ascii, allowLossyConversion: true), let drmServerUrl = URL(string: self.drmUrl) {
        var request = URLRequest(url: drmServerUrl)
        request.httpMethod = "POST"
        request.setValue(String(postData.count), forHTTPHeaderField: "Content-Length")
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        request.httpBody = postData
        
        URLSession.shared.dataTask(with: request) { (data, _, error) in
            if let data = data, var responseString = String(data: data, encoding: .utf8) {
                responseString = responseString.replacingOccurrences(of: "<ckc>", with: "").replacingOccurrences(of: "</ckc>", with: "")
                ckcData = Data(base64Encoded: responseString)
            } else {
                print("Error encountered while fetching FairPlay license for URL: \(self.drmUrl), \(error?.localizedDescription ?? "Unknown error")")
            }
            
            semaphore.signal()
            }.resume()
    } else {
        fatalError("Invalid post data")
    }
    
    semaphore.wait()
    return ckcData
```

In HLSCatalog\Shared\Managers\ContentKeyDelegate.swift, implement the method `requestApplicationCertificate()`. This implementation depends on whether you embed the certificate (public key only) with the device or host the certificate on the web. The following implementation uses the hosted application certificate used in the test samples. Let "certUrl" be a variable that contains the URL of the application certificate.

```swift
func requestApplicationCertificate() throws -> Data {

        var applicationCertificate: Data? = nil
        do {
            applicationCertificate = try Data(contentsOf: URL(string: certUrl)!)
        } catch {
            print("Error loading FairPlay application certificate: \(error)")
        }
        
        return applicationCertificate
    }
```

For the final integrated test, both the video URL and the application certificate URL are provided in the section "Integrated Test."

In HLSCatalog\Shared\Resources\Streams.plist, add your test video URL. For the content key ID, use the FairPlay license acquisition URL with the skd protocol as the unique value.

![Offline FairPlay iOS App Streams](media/media-services-protect-hls-with-offline-FairPlay/media-services-offline-FairPlay-ios-app-streams.png)

Use your own test video URL, FairPlay license acquisition URL, and application certificate URL, if you have them set up. Or you can continue to the next section, which contains test samples.

## Integrated test
Three test samples in Media Services cover the following three scenarios:

* FPS protected, with video, audio, and alternate audio track
* FPS protected, with video and audio, but no alternate audio track
* FPS protected, with video only and no audio

You can find these samples at [this demo site](https://aka.ms/poc#22), with the corresponding application certificate hosted in an Azure web app.
With either the version 3 or version 4 sample of the FPS Server SDK, if a master playlist contains alternate audio, during offline mode it plays audio only. Therefore, you need to strip the alternate audio. In other words, the second and third samples listed previously work in online and offline mode. The sample listed first plays audio only during offline mode, while online streaming works properly.

## FAQ
The following frequently asked questions provide assistance with troubleshooting:

- **Why does only audio play but not video during offline mode?** This behavior seems to be by design of the sample app. When an alternate audio track is present (which is the case for HLS) during offline mode, both iOS 10 and iOS 11 default to the alternate audio track. To compensate this behavior for FPS offline mode, remove the alternate audio track from the stream. To do this on Media Services, add the dynamic manifest filter "audio-only=false." In other words, an HLS URL ends with .ism/manifest(format=m3u8-aapl,audio-only=false). 
- **Why does it still play audio only without video during offline mode after I add audio-only=false?** Depending on the content delivery network (CDN) cache key design, the content might be cached. Purge the cache.
- **Is FPS offline mode also supported on iOS 11 in addition to iOS 10?** Yes. FPS offline mode is supported for iOS 10 and iOS 11.
- **Why can't I find the document "Offline Playback with FairPlay Streaming and HTTP Live Streaming" in the FPS Server SDK?** Since FPS Server SDK version 4, this document was merged into the "FairPlay Streaming Programming Guide."
- **What does the last parameter stand for in the following API for FPS offline mode?**
`Microsoft.WindowsAzure.MediaServices.Client.FairPlay.FairPlayConfiguration.CreateSerializedFairPlayOptionConfiguration(objX509Certificate2, pfxPassword, pfxPasswordId, askId, iv, RentalAndLeaseKeyType.PersistentUnlimited, 0x9999);`

    For the documentation for this API, see [FairPlayConfiguration.CreateSerializedFairPlayOptionConfiguration Method](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.mediaservices.client.FairPlay.FairPlayconfiguration.createserializedFairPlayoptionconfiguration?view=azure-dotnet). The parameter represents the duration of the offline rental, with second as the unit.
- **What is the downloaded/offline file structure on iOS devices?** The downloaded file structure on an iOS device looks like the following screenshot. The `_keys` folder stores downloaded FPS licenses, with one store file for each license service host. The `.movpkg` folder stores audio and video content. The first folder with a name that ends with a dash followed by a numeric contains video content. The numeric value is the PeakBandwidth of the video renditions. The second folder with a name that ends with a dash followed by 0 contains audio content. The third folder named "Data" contains the master playlist of the FPS content. Finally, boot.xml provides a complete description of the `.movpkg` folder content. 

![Offline FairPlay iOS sample app file structure](media/media-services-protect-hls-with-offline-FairPlay/media-services-offline-FairPlay-file-structure.png)

A sample boot.xml file:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<HLSMoviePackage xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" xmlns="http://apple.com/IMG/Schemas/HLSMoviePackage" xsi:schemaLocation="http://apple.com/IMG/Schemas/HLSMoviePackage /System/Library/Schemas/HLSMoviePackage.xsd">
  <Version>1.0</Version>
  <HLSMoviePackageType>PersistedStore</HLSMoviePackageType>
  <Streams>
    <Stream ID="1-4DTFY3A3VDRCNZ53YZ3RJ2NPG2AJHNBD-0" Path="1-4DTFY3A3VDRCNZ53YZ3RJ2NPG2AJHNBD-0" NetworkURL="https://willzhanmswest.streaming.mediaservices.windows.net/e7c76dbb-8e38-44b3-be8c-5c78890c4bb4/MicrosoftElite01.ism/QualityLevels(127000)/Manifest(aac_eng_2_127,format=m3u8-aapl)">
      <Complete>YES</Complete>
    </Stream>
    <Stream ID="0-HC6H5GWC5IU62P4VHE7NWNGO2SZGPKUJ-310656" Path="0-HC6H5GWC5IU62P4VHE7NWNGO2SZGPKUJ-310656" NetworkURL="https://willzhanmswest.streaming.mediaservices.windows.net/e7c76dbb-8e38-44b3-be8c-5c78890c4bb4/MicrosoftElite01.ism/QualityLevels(161000)/Manifest(video,format=m3u8-aapl)">
      <Complete>YES</Complete>
    </Stream>
  </Streams>
  <MasterPlaylist>
    <NetworkURL>https://willzhanmswest.streaming.mediaservices.windows.net/e7c76dbb-8e38-44b3-be8c-5c78890c4bb4/MicrosoftElite01.ism/manifest(format=m3u8-aapl,audio-only=false)</NetworkURL>
  </MasterPlaylist>
  <DataItems Directory="Data">
    <DataItem>
      <ID>CB50F631-8227-477A-BCEC-365BBF12BCC0</ID>
      <Category>Playlist</Category>
      <Name>master.m3u8</Name>
      <DataPath>Playlist-master.m3u8-CB50F631-8227-477A-BCEC-365BBF12BCC0.data</DataPath>
      <Role>Master</Role>
    </DataItem>
  </DataItems>
</HLSMoviePackage>
```

## Additional notes

* Widevine is a service provided by Google Inc. and subject to the terms of service and Privacy Policy of Google, Inc.

## Summary
This document includes the following steps and information you can use to implement FPS offline mode:

* Media Services content protection configuration via the Media Services .NET API configures dynamic FairPlay encryption and FairPlay license delivery in Media Services.
* An iOS player based on the sample from the FPS Server SDK sets up an iOS player that can play FPS content either in online streaming mode or offline mode.
* Sample FPS videos are used to test offline mode and online streaming.
* A FAQ answers questions about FPS offline mode.

## Next steps

[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]