---
title: Protect HLS content with offline Apple FairPlay - Azure | Microsoft Docs 
description: This topic gives an overview and shows how to use Azure Media Services to dynamically encrypt your HTTP Live Streaming (HLS) content with Apple FairPlay in offline mode.
services: media-services
keywords: HLS, DRM, FairPlay Streaming (FPS), Offline, iOS 10
documentationcenter: ''
author: willzhan
manager: steveng
editor: ''

ms.assetid: 7c3b35d9-1269-4c83-8c91-490ae65b0817
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/01/2017
ms.author: willzhan, dwgeo

---
# Offline FairPlay Streaming
Microsoft Azure Media Services provides a set of well-designed [content protection services](https://azure.microsoft.com/services/media-services/content-protection/), covering:
- Microsoft PlayReady
- Google Widevine
- Apple FairPlay
- AES-128 encryption

DRM/AES encryption of content is performed dynamically upon request for various streaming protocols. DRM license/AES decryption key delivery services are also provided by Azure Media Services.

Besides protecting content for online streaming over various streaming protocols, offline mode for protected content is also an often-requested feature. Offline mode support is needed for the following scenarios:
1. Playback when Internet connection is not available such as during travel;
2. Some content providers may disallow DRM license delivery beyond a country's border. If a user wants to watch content while traveling abroad, offline download is needed.
3. In some countries, Internet availability and/or bandwidth is still limited. Users may choose to download first to be able to watch content in high enough resolution for satisfactory viewing experience. In this case, more often, the issue is not network availability, rather it is limited network bandwidth. OTT/OVP providers are asking for offline mode support.

This article covers FairPlay Streaming (FPS) offline mode support targeting devices running iOS 10 or later. This feature is not supported for other Apple platforms such as watchOS, tvOS, or Safari on macOS.

## Preliminary Steps
Before implementing offline DRM for FairPlay on an iOS 10+ device, you should first:
1. Become familiar with online content protection for FairPlay. This is covered in detail in the following articles/samples:
- [Apple FairPlay Streaming for Azure Media Services generally available](https://azure.microsoft.com/blog/apple-FairPlay-streaming-for-azure-media-services-generally-available/)
- [Protect your HLS content with Apple FairPlay or Microsoft PlayReady](https://docs.microsoft.com/azure/media-services/media-services-protect-hls-with-FairPlay)
- [A sample for online FPS streaming](https://azure.microsoft.com/resources/samples/media-services-dotnet-dynamic-encryption-with-FairPlay/)
2. Obtain the FPS SDK from Apple Developer Network. FPS SDK contains two components:
- FPS Server SDK, which contains KSM (Key Security Module), client samples, a specification, and a set of test vectors;
- FPS Deployment Pack, which contains the D Function, specification along with instructions about how to generate the FPS Certificate, customer-specific private key, and Application Secret key (ASK). Apple issues FPS Deployment Pack only to licensed content providers.

## Configuration in Azure Media Services
For FPS offline mode configuration via [Azure Media Services .NET SDK](https://www.nuget.org/packages/windowsazure.mediaservices), you need to use Azure Media Services .NET SDK v. 4.0.0.4 or later, which provided the necessary API to configure FPS offline mode.
As indicated in the assumptions above, we assume you have the working code for configuring online mode FPS content protection. Once you have the code for configuring online mode content protection for FPS, you only need the following two changes.

## Code Change in FairPlay Configuration
Let’s define a “enable offline mode” boolean, called objDRMSettings.EnableOfflineMode that is true when enabling the offline DRM scenario. Depending on this indicator, we make the following change to the FairPlay configuration:

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

## Code Change in Asset Delivery Policy Configuration
The second change is to add the third key into the dictionary Dictionary<AssetDeliveryPolicyConfigurationKey, string>.
The third AssetDeliveryPolicyConfigurationKey needs to be added is as below: 
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

After this step, the Dictionary<AssetDeliveryPolicyConfigurationKey, string> in FPS asset delivery policy will contain the following three entries:
1. AssetDeliveryPolicyConfigurationKey.FairPlayBaseLicenseAcquisitionUrl or AssetDeliveryPolicyConfigurationKey.FairPlayLicenseAcquisitionUrl depending on factors such as FPS KSM/key server used and whether we want to reuse the same Asset Delivery Policy across multiple assets
2. AssetDeliveryPolicyConfigurationKey.CommonEncryptionIVForCbcs
3. AssetDeliveryPolicyConfigurationKey.AllowPersistentLicense

Now your media services account is configured to delivered offline FairPlay licenses.

## Sample iOS Player
First, we should note that FPS offline mode support is available only on iOS 10 and later. We should get FPS Server SDK (v3.0 or later) which contains document and sample for FPS offline mode. 
Specifically, FPS Server SDK (v3.0 or later) contains the following two items related to offline mode:
1. Document: Offline Playback with FairPlay Streaming and HTTP Live Streaming. Apple, 9/14/2016. In FPS Server SDK v 4.0, this doc has been merged into the main FPS streaming doc.
2. Sample code: HLSCatalog sample for FPS offline mode in \FairPlay Streaming Server SDK v3.1\Development\Client\HLSCatalog_With_FPS\HLSCatalog\. 
In the HLSCatalog sample app, the following code files are particularly for implementing offline mode features:
- AssetPersistenceManager.swift code file: AssetPersistenceManager is the main class in this sample that demonstrates
    - How to manage downloading HLS streams, such as APIs for starting and cancelling download, deleting existing assets off the user’s device;
    - How to monitor the download progress.
- AssetListTableViewController.swift and AssetListTableViewCell.swift code files: AssetListTableViewController is the main interface of this sample. It provides a list of assets the sample can play, download, delete, or cancel a download. 

Below are the detailed steps for setting up a running iOS player. Let’s assume you start from the HLSCatalog sample in FPS Server SDK v 4.0.1.  We need to make the following code changes:

In HLSCatalog\Shared\Managers\ContentKeyDelegate.swift, implement the method `requestContentKeyFromKeySecurityModule(spcData: Data, assetID: String)` using the following code: Let drmUr be a variable assigned to the HLS streaming URL.

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

In HLSCatalog\Shared\Managers\ContentKeyDelegate.swift, implement the method `requestApplicationCertificate()`. This implementation depends on whether you embed the certificate (public key only) with the device or host the certificate on the web. Below is an implementation using the hosted application certificate used in our test samples. Let certUrl be a variable containing the URL of the application certificate.

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

For final integrated test, both video URL and application certificate URL will be provided in the section of “Integrated Test”.

In HLSCatalog\Shared\Resources\Streams.plist, add your test video URL and, for content key ID, we can just use FairPlay license acquisition URL with skd protocol as the unique value.

![Offline FairPlay iOS App Streams](media/media-services-protect-hls-with-offline-FairPlay/media-services-offline-FairPlay-ios-app-streams.png)

For the test video URL, FairPlay license acquisition URL and application certificate URL, you can use your own, if you have them set up, or you can continue to the next section which contains test samples.

## Integrated Test
Three test samples have been set up in Azure Media Services that cover the following three scenarios:
1.	FPS protected, with video, audio and alternate audio track;
2.	FPS protected, with video, audio but no alternate audio track;
3.	FPS protected, with video only, no audio.

These samples can be found at this [demo site](http://aka.ms/poc#22), with the corresponding application certificate  hosted in an Azure web app.
We have noticed that, with either v3 or v4 sample of FPS Server SDK, if a master playlist contains alternate audio, during offline mode, it plays audio only. Therefore we need to strip alternate audio. In other words, among the three sample above, (2) and (3) work in both online and offline mode. But (1) will play audio only during offline mode while online streaming works fine.

## FAQ
Some frequently asked questions for troubleshooting:
- **Why does only audio play but no video during offline mode?** This behavior seems to be by design of the sample app. When alternate audio track is present (which is the case for HLS), during offline mode, both iOS 10 and iOS 11 will default to alternate audio track. To compensate this behavior for FPS offline mode, we need to remove alternate audio track from the stream. To do this on Azure Media Services side, we can simply add the dynamic manifest filter “audio-only=false.” In other words, an HLS URL would ends with .ism/manifest(format=m3u8-aapl,audio-only=false). 
- **Why does it still play audio only without video during offline mode after I added audio-only=false?** Depending on CDN cache key design, the content may be cached. You need to purge the cache.
- **Is FPS offline mode also supported on iOS 11 in addition to iOS 10?** Yes, FPS offline mode is supported for both iOS 10 and iOS 11.
- **Why can’t I find the document Offline Playback with FairPlay Streaming and HTTP Live Streaming in FPS Server SDK?** Since FPS Server SDK v 4, this document has been merged into FairPlay Streaming Programming Guide document.
- **What does the last parameter stand for in the following API for FPS offline mode?**
`Microsoft.WindowsAzure.MediaServices.Client.FairPlay.FairPlayConfiguration.CreateSerializedFairPlayOptionConfiguration(objX509Certificate2, pfxPassword, pfxPasswordId, askId, iv, RentalAndLeaseKeyType.PersistentUnlimited, 0x9999);`

The documentation for this API can be found [here](https://docs.microsoft.com/en-us/dotnet/api/microsoft.windowsazure.mediaservices.client.FairPlay.FairPlayconfiguration.createserializedFairPlayoptionconfiguration?view=azure-dotnet). The parameter represents the duration of offline rental with hour as the unit.
- **What is the downloaded/offline file structure on iOS devices?** The downloaded file structure on an iOS device looks like below (screenshot). `_keys` folder stores downloaded FPS licenses, one store file for each license service host. `.movpkg` folder stores audio and video content. The first folder with name ending with a dash followed by a numeric contains video content. The numeric value is the "PeakBandwidth" of the video renditions. The second folder with name ending with a dash followed by 0 contains audio content. The third folder named "Data" contains the master playlist of the FPS content. Boot.xml provides a complete description of `.movpkg` folder content (see below for a sample boot.xml file).

![Offline FairPlay iOS Sample App File Structure](media/media-services-protect-hls-with-offline-FairPlay/media-services-offline-FairPlay-file-structure.png)

A sample boot.xml file:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<HLSMoviePackage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://apple.com/IMG/Schemas/HLSMoviePackage" xsi:schemaLocation="http://apple.com/IMG/Schemas/HLSMoviePackage /System/Library/Schemas/HLSMoviePackage.xsd">
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

## Summary
In this document, we have provided the detailed steps and info for implementing FPS offline mode, including:
1. Azure Media Services content protection configuration via AMS .NET API. This configures dynamic FairPlay encryption and FairPlay license delivery in AMS.
2. iOS player based on the sample from Apple FPS Server SDK. This would set up an iOS player that can play FPS content either in online streaming mode or offline mode.
3. Sample FPS videos for testing both offline mode and online streaming.
4. FAQ about FPS offline mode.
