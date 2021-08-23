---
title: How to create an image overlay
description: Learn how to create an image overlay
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: how-to
ms.date: 08/31/2020
---

# How to create an image overlay

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

Media Services allows you to overlay an image, audio file, or another video on top of a video. The input must specify exactly one image file. You can specify an image file in JPG, PNG, GIF or BMP format, or an audio file (such as a WAV, MP3, WMA or M4A file), or a video file in a supported file format.


## Prerequisites

* Collect the account information that you need to configure the *appsettings.json* file in the sample. If you're not sure how to do that, see [Quickstart: Register an application with the Microsoft identity platform](../../active-directory/develop/quickstart-register-app.md). The following values are expected in the *appsettings.json* file.

```json
    {
    "AadClientId": "",
    "AadEndpoint": "https://login.microsoftonline.com",
    "AadSecret": "",
    "AadTenantId": "",
    "AccountName": "",
    "ArmAadAudience": "https://management.core.windows.net/",
    "ArmEndpoint": "https://management.azure.com/",
    "Location": "",
    "ResourceGroup": "",
    "SubscriptionId": ""
    }
```

If you aren't already familiar with the creation of Transforms, it is recommended that you complete the following activities:

* Read [Encoding video and audio with Media Services](encode-concept.md)
* Read [How to encode with a custom transform - .NET](transform-custom-presets-how-to.md). Follow the steps in that article to set up the .NET needed to work with transforms, then return here to try out an overlays preset sample.
* See the [Transforms reference document](/rest/api/media/transforms).

Once you are familiar with Transforms, download the overlays sample.

## Overlays preset sample

Clone the Media Services .NET sample repository.

```bash
    git clone https://github.com/Azure-Samples/media-services-v3-dotnet.git
```

Navigate into the solution folder, and launch Visual Studio Code, or Visual Studio 2019.

A number of encoding samples are available in the VideoEncoding folder. Open the project in the [VideoEncoding/Encoding_OverlayImage](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/VideoEncoding/Encoding_OverlayImage) solution folder to get started learning how to use overlays.

The sample project contains two media files. A video file, and a logo image to overlay on top of the video.
* ignite.mp4
* cloud.png

In this sample, we first create a custom Transform that can overlay the image on top of the video in the CreateCustomTransform method.  Using the *[Filters](/rest/api/media/transforms/create-or-update#filters)* property of the *[StandardEncoderPreset](/rest/api/media/transforms/create-or-update#standardencoderpreset)*, we assign a new Filters collection that contains the video overlay settings.

A [VideoOverlay](/rest/api/media/transforms/create-or-update#videooverlay) contains a property called *InputLabel* that is required to map from the list of job input files submitted into the job and locate the right input source file intended for use as the overlay image or video.  When submitting the job this same label name is used to match up to the setting here in the Transform. In the sample we are using the label name of "logo" as seen in the string constant *OverlayLabel*.

The following code snippet shows how the Transform is formatted to use an overlay.

```csharp
new TransformOutput
                {
                    Preset = new StandardEncoderPreset
                    {
                        Filters = new Filters
                        {
                            Overlays = new List<Overlay>
                            {
                                new VideoOverlay
                                {
                                    InputLabel = OverlayLabel,   // same as the one used in the JobInput to identify which asset is the overlay image
                                    Position = new Rectangle( "1200","670") // left, top position of the overlay in absolute pixel position relative to the source videos resolution. 
    
                                }
                            }
                        },
                        Codecs = new List<Codec>
                        {
                            new AacAudio
                            {
                            },
                            new H264Video
                            {
                                KeyFrameInterval = TimeSpan.FromSeconds(2),
                                Layers = new List<H264Layer>
                                {
                                    new H264Layer
                                    {
                                        Profile = H264VideoProfile.Baseline,
                                        Bitrate = 1000000, // 1Mbps
                                        Width = "1280",
                                        Height = "720"
                                    },
                                    new H264Layer   // Adding a second layer to see that the image also is scaled and positioned the same way on this layer. 
                                    {
                                        Profile = H264VideoProfile.Baseline,
                                        Bitrate = 600000, // 600 kbps
                                        Width = "480",
                                        Height = "270"
                                    }
                                }
                            }
                        },
                        Formats = new List<Format>
                        {
                            new Mp4Format
                            {
                                FilenamePattern = "{Basename}_{Bitrate}{Extension}",
                            }
                        }
                    }
                }
```

When submitting the Job to the Transform, you must first create the two input assets.

* Asset 1 - in this sample the first Asset created is the local video file "ignite.mp4". This is the video that we will use as the background of the composite, and overlay a logo image on top of. 
* Asset 2 - in this sample, the second asset (stored in the overlayImageAsset variable) contains the .png file to be used for the logo. This image will be positioned onto the video during encoding.

When the Job is created in the *SubmitJobAsync* method, we first construct a JobInput array using a List<> object.  The List will contain the references to the two source assets.

In order to identify and match which input asset is to be used as the overlay in the Filter defined in above Transform, we again use the "logo" label name to handle the matching. The label name is added to the JobInputAsset for the .png image. This tells the Transform which asset to use when doing the overlay operation. you can re-use this same Transform with different Assets stored in Media Services that contain various logos or graphics that you wish to overlay, and simply change the asset name passed into the Job, while using the same label name "logo" for the Transform to match it to.

``` csharp
    // Add both the Video and the Overlay image assets here as inputs to the job.
    List<JobInput> jobInputs = new List<JobInput>() {
        new JobInputAsset(assetName: inputAssetName),
        new JobInputAsset(assetName: overlayAssetName, label: OverlayLabel)
    };
```

Run the sample by selecting the project in the Run and Debug window in Visual Studio Code. The sample will output progress of the encoding operation, and finally download the contents into the /Output folder in either your project root, or in the case of full Visual Studio this may be in your /bin/Output folder. 

The sample also publishes the content for streaming and will output the full HLS, DASH and Smooth Streaming manifest file URLs that can be used in any compatible player.  You can also easily copy the manifest URL to the [Azure Media Player demo](http://ampdemo.azureedge.net/) and paste the URL that ends with /manifest into the URL box, then click *Update Player*.

## API references

* [VideoOverlay object](/rest/api/media/transforms/create-or-update#videooverlay)
* [Filters](/rest/api/media/transforms/create-or-update#filters)
* [StandardEncoderPreset](/rest/api/media/transforms/create-or-update#standardencoderpreset)


[!INCLUDE [reference dotnet sdk references](./includes/reference-dotnet-sdk-references.md)]

## Next steps

[!INCLUDE [transforms next steps](./includes/transforms-next-steps.md)]
