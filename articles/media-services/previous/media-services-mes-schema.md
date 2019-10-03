---
title: Media Encoder Standard schema | Microsoft Docs
description: The article gives an overview of the Media Encoder Standard schema.
author: Juliako
manager: femila
editor: ''
services: media-services
documentationcenter: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/19/2019
ms.author: juliako

---
# Media Encoder Standard schema
This article describes some of the elements and types of the XML schema on which [Media Encoder Standard presets](media-services-mes-presets-overview.md) are based. The article gives explanation of elements and their valid values.  

## <a name="Preset"></a> Preset (root element)
Defines an encoding preset.  

### Elements

| Name | Type | Description |
| --- | --- | --- |
| **Encoding** |[Encoding](media-services-mes-schema.md#Encoding) |Root element, indicates that the input sources are to be encoded. |
| **Outputs** |[Outputs](media-services-mes-schema.md#Output) |Collection of desired output files. |
| **StretchMode**<br/>minOccurs="0"<br/>default="AutoSize|xs:string|Control the output video frame size, padding, pixel, or display aspect ratio. **StretchMode** could be one of the following values: **None**, **AutoSize** (default), or **AutoFit**.<br/><br/>**None**: Strictly follow the output resolution (for example, the **Width** and **Height** in the preset) without considering the pixel aspect ratio or display aspect ratio of the input video. Recommended in scenarios such as [cropping](media-services-crop-video.md), where the output video has a different aspect ratio compared to the input. <br/><br/>**AutoSize**: The output resolution will fit inside the window (Width * Height) specified by preset. However, the encoder produces an output video that has square (1:1) pixel aspect ratio. Therefore, either output Width or output Height could be overridden in order to match the display aspect ratio of the input, without padding. For example, if the input is 1920x1080 and the encoding preset asks for 1280x1280, then the Height value in the preset is overridden, and the output will be at 1280x720, which maintains the input aspect ratio of 16:9. <br/><br/>**AutoFit**: If needed, pad the output video (with either letterbox or pillarbox) to honor the desired output resolution, while ensuring that the active video region in the output has the same aspect ratio as the input. For example, suppose the input is 1920x1080 and the encoding preset asks for 1280x1280. Then the output video will be at 1280x1280, but it will contain an inner 1280x720 rectangle of ‘active video’ with aspect ratio of 16:9, and letterbox regions 280 pixels high at the top and bottom. For another example, if the input is 1440x1080 and the encoding preset asks for 1280x720, then the output will be at 1280x720, which contains an inner rectangle of 960x720 at aspect ratio of 4:3, and pillar box regions 160 pixels wide at the left and right. 

### Attributes

| Name | Type | Description |
| --- | --- | --- |
| **Version**<br/><br/> Required |**xs: decimal** |The preset version. The following restrictions apply: xs:fractionDigits value="1"  and xs:minInclusive value="1" For example, **version="1.0"**. |

## <a name="Encoding"></a> Encoding
Contains a sequence of the following elements:  

### Elements

| Name | Type | Description |
| --- | --- | --- |
| **H264Video** |[H264Video](media-services-mes-schema.md#H264Video) |Settings for H.264 encoding of video. |
| **AACAudio** |[AACAudio](media-services-mes-schema.md#AACAudio) |Settings for AAC encoding of audio. |
| **BmpImage** |[BmpImage](media-services-mes-schema.md#BmpImage) |Settings for Bmp image. |
| **PngImage** |[PngImage](media-services-mes-schema.md#PngImage) |Settings for Png image. |
| **JpgImage** |[JpgImage](media-services-mes-schema.md#JpgImage) |Settings for Jpg image. |

## <a name="H264Video"></a> H264Video
### Elements

| Name | Type | Description |
| --- | --- | --- |
| **TwoPass**<br/><br/> minOccurs="0" |**xs:boolean** |Currently, only one-pass encoding is supported. |
| **KeyFrameInterval**<br/><br/> minOccurs="0"<br/><br/> **default="00:00:02"** |**xs:time** |Determines the fixed spacing between IDR frames in units of seconds. Also referred to as the GOP duration. See **SceneChangeDetection** for controlling whether the encoder can deviate from this value. |
| **SceneChangeDetection**<br/><br/> minOccurs="0"<br/><br/> default=”false” |**xs: boolean** |If set to true, encoder attempts to detect scene change in the video and inserts an IDR frame. |
| **Complexity**<br/><br/> minOccurs="0"<br/><br/> default="Balanced" |**xs:string** |Controls the trade-off between encode speed and video quality. Could be one of the following values: **Speed**, **Balanced**, or **Quality**<br/><br/> Default: **Balanced** |
| **SyncMode**<br/><br/> minOccurs="0" | |Feature will be exposed in a future release. |
| **H264Layers**<br/><br/> minOccurs="0" |[H264Layers](media-services-mes-schema.md#H264Layers) |Collection of output video layers. |

### Attributes

| Name | Type | Description |
| --- | --- | --- |
| **Condition** |**xs:string** | When the input has no video, you may want to force the encoder to insert a monochrome video track. To do that, use Condition="InsertBlackIfNoVideoBottomLayerOnly" (to insert a video at only the lowest bitrate) or Condition="InsertBlackIfNoVideo" (to insert a video at all output bitrates). For more information, see [this](media-services-advanced-encoding-with-mes.md#no_video) article.|

## <a name="H264Layers"></a> H264Layers

By default, if you send an input to the encoder that contains only audio, and no video, the output asset contains files with audio data only. Some players may not be able to handle such output streams. You can use the H264Video's **InsertBlackIfNoVideo** attribute setting to force the encoder to add a video track to the output in that scenario. For more information, see [this](media-services-advanced-encoding-with-mes.md#no_video) article.
              
### Elements

| Name | Type | Description |
| --- | --- | --- |
| **H264Layer**<br/><br/> minOccurs="0" maxOccurs="unbounded" |[H264Layer](media-services-mes-schema.md#H264Layer) |A collection of H264 layers. |

## <a name="H264Layer"></a> H264Layer
> [!NOTE]
> Video limits are based on the values described in the [H264 Levels](https://en.wikipedia.org/wiki/H.264/MPEG-4_AVC#Levels) table.  
> 
> 

### Elements

| Name | Type | Description |
| --- | --- | --- |
| **Profile**<br/><br/> minOccurs="0"<br/><br/> default=”Auto” |**xs: string** |Could be of one of the following **xs: string** values: **Auto**, **Baseline**, **Main**, **High**. |
| **Level**<br/><br/> minOccurs="0"<br/><br/> default=”Auto” |**xs: string** | |
| **Bitrate**<br/><br/> minOccurs="0" |**xs:int** |The bitrate used for this video layer, specified in kbps. |
| **MaxBitrate**<br/><br/> minOccurs="0" |**xs: int** |The maximum bitrate used for this video layer, specified in kbps. |
| **BufferWindow**<br/><br/> minOccurs="0"<br/><br/> default="00:00:05" |**xs: time** |Length of the video buffer. |
| **Width**<br/><br/> minOccurs="0" |**xs: int** |Width of the output video frame, in pixels.<br/><br/> Currently, you must specify both Width and Height. The Width and Height need to be even numbers. |
| **Height**<br/><br/> minOccurs="0" |**xs:int** |Height of the output video frame, in pixels.<br/><br/> Currently, you must specify both Width and Height. The Width and Height need to be even numbers.|
| **BFrames**<br/><br/> minOccurs="0" |**xs: int** |Number of B frames between reference frames. |
| **ReferenceFrames**<br/><br/> minOccurs="0"<br/><br/> default=”3” |**xs:int** |Number of reference frames in a GOP. |
| **EntropyMode**<br/><br/> minOccurs="0"<br/><br/> default=”Cabac” |**xs: string** |Could be one of the following values: **Cabac** and **Cavlc**. |
| **FrameRate**<br/><br/> minOccurs="0" |rational number |Determines the frame rate of the output video. Use default of "0/1" to let the encoder use the same frame rate as the input video. Allowed values are expected to be common video frame rates. However, any valid rational is allowed. For example, 1/1 would be 1 fps and is valid.<br/><br/> - 12/1  (12 fps)<br/><br/> - 15/1 (15 fps)<br/><br/> - 24/1 (24 fps)<br/><br/> - 24000/1001 (23.976 fps)<br/><br/> - 25/1 (25 fps)<br/><br/>  - 30/1 (30 fps)<br/><br/> - 30000/1001 (29.97 fps) <br/> <br/>**NOTE** If you are creating a custom preset for multiple-bitrate encoding, then all layers of the preset **must** use the same value of FrameRate.|
| **AdaptiveBFrame**<br/><br/> minOccurs="0" |**xs: boolean** |Copy from Azure media encoder |
| **Slices**<br/><br/> minOccurs="0"<br/><br/> default="0" |**xs:int** |Determines how many slices a frame is divided into. Recommend using default. |

## <a name="AACAudio"></a> AACAudio
 Contains a sequence of the following elements and groups.  

 For more information about AAC, see [AAC](https://en.wikipedia.org/wiki/Advanced_Audio_Coding).  

### Elements

| Name | Type | Description |
| --- | --- | --- |
| **Profile**<br/><br/> minOccurs="0 "<br/><br/> default="AACLC" |**xs: string** |Could be one of the following values: **AACLC**, **HEAACV1**, or **HEAACV2**. |

### Attributes

| Name | Type | Description |
| --- | --- | --- |
| **Condition** |**xs: string** |To force the encoder to produce an asset that contains a silent audio track when input has no audio, specify the "InsertSilenceIfNoAudio" value.<br/><br/> By default, if you send an input to the encoder that contains only video, and no audio, then the output asset contains files that contain only video data. Some players may not be able to handle such output streams. You can use this setting to force the encoder to add a silent audio track to the output in that scenario. |

### Groups

| Reference | Description |
| --- | --- |
| [AudioGroup](media-services-mes-schema.md#AudioGroup)<br/><br/> minOccurs="0" |See description of [AudioGroup](media-services-mes-schema.md#AudioGroup) to know the appropriate number of channels, sampling rate, and bit rate that could be set for each profile. |

## <a name="AudioGroup"></a> AudioGroup
For details about what values are valid for each profile, see the “Audio codec details” table that follows.  

### Elements

| Name | Type | Description |
| --- | --- | --- |
| **Channels**<br/><br/> minOccurs="0" |**xs: int** |The number of audio channels encoded. The following are valid options: 1, 2, 5, 6, 8.<br/><br/> Default: 2. |
| **SamplingRate**<br/><br/> minOccurs="0" |**xs: int** |The audio sampling rate, specified in Hz. |
| **Bitrate**<br/><br/> minOccurs="0" |**xs: int** |The bitrate used when encoding the audio, specified in kbps. |

### Audio codec details

Audio Codec|Details  
-----------------|---  
**AACLC** |1:<br/><br/> - 11025: 8 &lt;= bitrate &lt; 16<br/><br/> - 12000: 8 &lt;= bitrate &lt; 16<br/><br/> - 16000: 8 &lt;= bitrate &lt;32<br/><br/>- 22050: 24 &lt;= bitrate &lt; 32<br/><br/> - 24000: 24 &lt;= bitrate &lt; 32<br/><br/> - 32000: 32 &lt;= bitrate &lt;= 192<br/><br/> - 44100: 56 &lt;= bitrate &lt;= 288<br/><br/> - 48000: 56 &lt;= bitrate &lt;= 288<br/><br/> - 88200 : 128 &lt;= bitrate &lt;= 288<br/><br/> - 96000 : 128 &lt;= bitrate &lt;= 288<br/><br/> 2:<br/><br/> - 11025: 16 &lt;= bitrate &lt; 24<br/><br/> - 12000: 16 &lt;= bitrate &lt; 24<br/><br/> - 16000: 16 &lt;= bitrate &lt; 40<br/><br/> - 22050: 32 &lt;= bitrate &lt; 40<br/><br/> - 24000 : 32 &lt;= bitrate &lt; 40<br/><br/> - 32000:  40 &lt;= bitrate &lt;= 384<br/><br/> - 44100: 96 &lt;= bitrate &lt;= 576<br/><br/> - 48000 : 96 &lt;= bitrate &lt;= 576<br/><br/> - 88200: 256 &lt;= bitrate &lt;= 576<br/><br/> - 96000: 256 &lt;= bitrate &lt;= 576<br/><br/> 5/6:<br/><br/> - 32000: 160 &lt;= bitrate &lt;= 896<br/><br/> - 44100: 240 &lt;= bitrate &lt;= 1024<br/><br/> - 48000: 240 &lt;= bitrate &lt;= 1024<br/><br/> - 88200: 640 &lt;= bitrate &lt;= 1024<br/><br/> - 96000: 640 &lt;= bitrate &lt;= 1024<br/><br/> 8:<br/><br/> - 32000 : 224 &lt;= bitrate &lt;= 1024<br/><br/> - 44100 : 384 &lt;= bitrate &lt;= 1024<br/><br/> - 48000: 384 &lt;= bitrate &lt;= 1024<br/><br/> - 88200: 896 &lt;= bitrate &lt;= 1024<br/><br/> - 96000: 896 &lt;= bitrate &lt;= 1024  
**HEAACV1** |1:<br/><br/> - 22050: bitrate = 8<br/><br/> - 24000: 8 &lt;= bitrate &lt;= 10<br/><br/> - 32000: 12 &lt;= bitrate &lt;= 64<br/><br/> - 44100: 20 &lt;= bitrate &lt;= 64<br/><br/> - 48000: 20 &lt;= bitrate &lt;= 64<br/><br/> - 88200: bitrate = 64<br/><br/> 2:<br/><br/> - 32000: 16 &lt;= bitrate &lt;= 128<br/><br/> - 44100: 16 &lt;= bitrate &lt;= 128<br/><br/> - 48000: 16 &lt;= bitrate &lt;= 128<br/><br/> - 88200 : 96 &lt;= bitrate &lt;= 128<br/><br/> - 96000: 96 &lt;= bitrate &lt;= 128<br/><br/> 5/6:<br/><br/> - 32000 : 64 &lt;= bitrate &lt;= 320<br/><br/> - 44100: 64 &lt;= bitrate &lt;= 320<br/><br/> - 48000: 64 &lt;= bitrate &lt;= 320<br/><br/> - 88200 : 256 &lt;= bitrate &lt;= 320<br/><br/> - 96000: 256 &lt;= bitrate &lt;= 320<br/><br/> 8:<br/><br/> - 32000: 96 &lt;= bitrate &lt;= 448<br/><br/> - 44100: 96 &lt;= bitrate &lt;= 448<br/><br/> - 48000: 96 &lt;= bitrate &lt;= 448<br/><br/> - 88200: 384 &lt;= bitrate &lt;= 448<br/><br/> - 96000: 384 &lt;= bitrate &lt;= 448  
**HEAACV2** |2:<br/><br/> - 22050: 8 &lt;= bitrate &lt;= 10<br/><br/> - 24000: 8 &lt;= bitrate &lt;= 10<br/><br/> - 32000: 12 &lt;= bitrate &lt;= 64<br/><br/> - 44100: 20 &lt;= bitrate &lt;= 64<br/><br/> - 48000: 20 &lt;= bitrate &lt;= 64<br/><br/> - 88200: 64 &lt;= bitrate &lt;= 64  
  
## <a name="Clip"></a> Clip
### Attributes

| Name | Type | Description |
| --- | --- | --- |
| **StartTime** |**xs:duration** |Specifies the start time of a presentation. The value of StartTime needs to match the absolute timestamps of the input video. For example, if the first frame of the input video has a timestamp of 12:00:10.000, then StartTime should be at least 12:00:10.000 or greater. |
| **Duration** |**xs:duration** |Specifies the duration of a presentation (for example, appearance of an overlay in the video). |

## <a name="Output"></a> Output
### Attributes

| Name | Type | Description |
| --- | --- | --- |
| **FileName** |**xs:string** |The name of the output file.<br/><br/> You can use macros described in the following table to build the output file names. For example:<br/><br/> **"Outputs": [      {       "FileName": "{Basename}*{Resolution}*{Bitrate}.mp4",       "Format": {         "Type": "MP4Format"       }     }   ]** |

### Macros

| Macro | Description |
| --- | --- |
| **{Basename}** |If you are doing VoD encoding, the {Basename} is the first 32 characters of the AssetFile.Name property of the primary file in the input asset.<br/><br/> If the input asset is a live archive, then the {Basename} is derived from the trackName attributes in the server manifest. If you are submitting a subclip job using the TopBitrate, as in: "<VideoStream\>TopBitrate</VideoStream\>", and the output file contains video, then the {Basename} is the first 32 characters of the trackName of the video layer with the highest bitrate.<br/><br/> If instead you are submitting a subclip job using all of the input bitrates, such as "<VideoStream\>*</VideoStream\>", and the output file contains video, then {Basename} is the first 32 characters of the trackName of the corresponding video layer. |
| **{Codec}** |Maps to "H264" for video and "AAC" for audio. |
| **{Bitrate}** |The target video bitrate if the output file contains video and audio, or target audio bitrate if the output file contains audio only. The value used is the bitrate in kbps. |
| **{Channel}** |Audio channel count if the file contains audio. |
| **{Width}** |Width of the video, in pixels, in the output file, if the file contains video. |
| **{Height}** |Height of the video, in pixels, in the output file, if the file contains video. |
| **{Extension}** |Inherits from the "Type" property for the output file. The output file name has an extension which is one of: "mp4", "ts", "jpg", "png", or "bmp". |
| **{Index}** |Mandatory for thumbnail. Should only be present once. |

## <a name="Video"></a> Video (complex type inherits from Codec)
### Attributes

| Name | Type | Description |
| --- | --- | --- |
| **Start** |**xs:string** | |
| **Step** |**xs:string** | |
| **Range** |**xs:string** | |
| **PreserveResolutionAfterRotation** |**xs:boolean** |For detailed explanation, see the following section: [PreserveResolutionAfterRotation](media-services-mes-schema.md#PreserveResolutionAfterRotation) |

### <a name="PreserveResolutionAfterRotation"></a> PreserveResolutionAfterRotation
It is recommended to use the **PreserveResolutionAfterRotation** flag in combination with resolution values expressed in percentage terms (Width="100%" , Height="100%").  

By default, the encode resolution settings (Width, Height) in the Media Encoder Standard (MES) presets are targeted at videos with 0-degree rotation. For example, if your input video is 1280x720 with zero-degree rotation, then the default presets ensure that the output has the same resolution.  

![MESRoation1](./media/media-services-shemas/media-services-mes-roation1.png) 

If the input video has been captured with non-zero rotation (for example, a smartphone or tablet held vertically), then MES by default applies the encode resolution settings (Width, Height) to the input video, and then compensate for the rotation. For example, see the picture that follows. The preset uses Width = "100%", Height = "100%", which MES interprets as requiring the output to be 1280 pixels wide and 720 pixels tall. After rotating the video, it then shrinks the picture to fit into that window, leading to pillar-box areas on the left and right.  

![MESRoation2](./media/media-services-shemas/media-services-mes-roation2.png) 

Alternatively, you can make use of the **PreserveResolutionAfterRotation** flag and set it to "true" (default is "false"). So if your preset has Width = "100%", Height = "100%" and PreserveResolutionAfterRotation  set to "true",  an input video, which is 1280 pixels wide and 720 pixels tall with 90-degree rotation produces an output with zero-degree rotation, but 720 pixels wide and 1280 pixels tall. See the following picture:  

![MESRoation3](./media/media-services-shemas/media-services-mes-roation3.png) 

## <a name="FormatGroup"></a> FormatGroup (group)
### Elements

| Name | Type | Description |
| --- | --- | --- |
| **BmpFormat** |**BmpFormat** | |
| **PngFormat** |**PngFormat** | |
| **JpgFormat** |**JpgFormat** | |

## <a name="BmpLayer"></a> BmpLayer
### Element

| Name | Type | Description |
| --- | --- | --- |
| **Width**<br/><br/> minOccurs="0" |**xs:int** | |
| **Height**<br/><br/> minOccurs="0" |**xs:int** | |

### Attributes

| Name | Type | Description |
| --- | --- | --- |
| **Condition** |**xs:string** | |

## <a name="PngLayer"></a> PngLayer
### Element

| Name | Type | Description |
| --- | --- | --- |
| **Width**<br/><br/> minOccurs="0" |**xs:int** | |
| **Height**<br/><br/> minOccurs="0" |**xs:int** | |

### Attributes

| Name | Type | Description |
| --- | --- | --- |
| **Condition** |**xs:string** | |

## <a name="JpgLayer"></a> JpgLayer
### Element

| Name | Type | Description |
| --- | --- | --- |
| **Width**<br/><br/> minOccurs="0" |**xs:int** | |
| **Height**<br/><br/> minOccurs="0" |**xs:int** | |
| **Quality**<br/><br/> minOccurs="0" |**xs:int** |Valid values: 1(worst)-100(best) |

### Attributes

| Name | Type | Description |
| --- | --- | --- |
| **Condition** |**xs:string** | |

## <a name="PngLayers"></a> PngLayers
### Elements

| Name | Type | Description |
| --- | --- | --- |
| **PngLayer**<br/><br/> minOccurs="0" maxOccurs="unbounded" |[PngLayer](media-services-mes-schema.md#PngLayer) | |

## <a name="BmpLayers"></a> BmpLayers
### Elements

| Name | Type | Description |
| --- | --- | --- |
| **BmpLayer**<br/><br/> minOccurs="0" maxOccurs="unbounded" |[BmpLayer](media-services-mes-schema.md#BmpLayer) | |

## <a name="JpgLayers"></a> JpgLayers
### Elements

| Name | Type | Description |
| --- | --- | --- |
| **JpgLayer**<br/><br/> minOccurs="0" maxOccurs="unbounded" |[JpgLayer](media-services-mes-schema.md#JpgLayer) | |

## <a name="BmpImage"></a> BmpImage (complex type inherits from Video)
### Elements

| Name | Type | Description |
| --- | --- | --- |
| **PngLayers**<br/><br/> minOccurs="0" |[PngLayers](media-services-mes-schema.md#PngLayers) |Png layers |

## <a name="JpgImage"></a> JpgImage (complex type inherits from Video)
### Elements

| Name | Type | Description |
| --- | --- | --- |
| **PngLayers**<br/><br/> minOccurs="0" |[PngLayers](media-services-mes-schema.md#PngLayers) |Png layers |

## <a name="PngImage"></a> PngImage (complex type inherits from Video)
### Elements

| Name | Type | Description |
| --- | --- | --- |
| **PngLayers**<br/><br/> minOccurs="0" |[PngLayers](media-services-mes-schema.md#PngLayers) |Png layers |

## Examples
See examples of XML presets that are built based on this schema, see [Task Presets for MES (Media Encoder Standard)](media-services-mes-presets-overview.md).

## Next steps
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

