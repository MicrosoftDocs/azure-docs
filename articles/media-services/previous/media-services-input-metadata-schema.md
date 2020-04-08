---
title: Azure Media Services input metadata schema | Microsoft Docs
description: This article gives an overview of Azure Media Services input metadata schema.
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
ms.date: 03/18/2019
ms.author: juliako

---
# Input Metadata 

An encoding job is associated with an input asset (or assets) on which you want to perform some encoding tasks.  Upon completion of a task, an output asset is produced.  The output asset contains video, audio, thumbnails, manifest, etc. The output asset also contains a file with metadata about the input asset. The name of the metadata XML file has the following format: &lt;asset_id&gt;_metadata.xml (for example, 41114ad3-eb5e-4c57-8d92-5354e2b7d4a4_metadata.xml), where &lt;asset_id&gt; is the AssetId value of the input asset.  

Media Services does not pre-emptively scan input Assets to generate metadata. Input metadata is generated only as an artifact when an input Asset is processed in a Job. Hence this artifact is written to the output Asset. Different tools are used to generate metadata for input Assets and output Assets. Therefore, the input metadata has a slightly different schema than the output metadata.

If you want to examine the metadata file, you can create a **SAS** locator and download the file to your local computer. You can find an example on how to create a SAS locator and download a file  [Using the Media Services .NET SDK Extensions](media-services-dotnet-get-started.md).  

This article discusses the elements and types of the XML schema on which the input metada (&lt;asset_id&gt;_metadata.xml) is based.  For information about the file that contains metadata about the output asset, see [Output Metadata](media-services-output-metadata-schema.md).  

You can find the [Schema Code](media-services-input-metadata-schema.md#code) an [XML example](media-services-input-metadata-schema.md#xml) at the end of this article.  
 

## <a name="AssetFiles"></a> AssetFiles element (root element)
Contains a collection of [AssetFile element](media-services-input-metadata-schema.md#AssetFile)s for the encoding job.  

See an XML example at the end of this article: [XML example](media-services-input-metadata-schema.md#xml).  

| Name | Description |
| --- | --- |
| **AssetFile**<br /><br /> minOccurs="1" maxOccurs="unbounded" |A single child element. For more information, see [AssetFile element](media-services-input-metadata-schema.md#AssetFile). |

## <a name="AssetFile"></a> AssetFile element
 Contains attributes and elements that describe an asset file.  

 See an XML example at the end of this article: [XML example](media-services-input-metadata-schema.md#xml).  

### Attributes
| Name | Type | Description |
| --- | --- | --- |
| **Name**<br /><br /> Required |**xs:string** |Asset file name. |
| **Size**<br /><br /> Required |**xs:long** |Size of the asset file in bytes. |
| **Duration**<br /><br /> Required |**xs:duration** |Content play back duration. Example: Duration="PT25M37.757S". |
| **NumberOfStreams**<br /><br /> Required |**xs:int** |Number of streams in the asset file. |
| **FormatNames**<br /><br /> Required |**xs: string** |Format names. |
| **FormatVerboseNames**<br /><br /> Required |**xs: string** |Format verbose names. |
| **StartTime** |**xs:duration** |Content start time. Example: StartTime="PT2.669S". |
| **OverallBitRate** |**xs: int** |Average bitrate of the asset file in kbps. |

> [!NOTE]
> The following four child elements must appear in a sequence.  
> 
> 

### Child elements
| Name | Type | Description |
| --- | --- | --- |
| **Programs**<br /><br /> minOccurs="0" | |Collection of all [Programs element](media-services-input-metadata-schema.md#Programs) when the asset file is in MPEG-TS format. |
| **VideoTracks**<br /><br /> minOccurs="0" | |Each physical asset file can contain zero or more videos tracks interleaved into an appropriate container format. This element contains a collection of all [VideoTracks](media-services-input-metadata-schema.md#VideoTracks) that are part of the asset file. |
| **AudioTracks**<br /><br /> minOccurs="0" | |Each physical asset file can contain zero or more audio tracks interleaved into an appropriate container format. This element contains a collection of all [AudioTracks](media-services-input-metadata-schema.md#AudioTracks) that are part of the asset file. |
| **Metadata**<br /><br /> minOccurs="0" maxOccurs="unbounded" |[MetadataType](media-services-input-metadata-schema.md#MetadataType) |Asset file’s metadata represented as key\value strings. For example:<br /><br /> **&lt;Metadata key="language" value="eng" /&gt;** |

## <a name="TrackType"></a> TrackType
See an XML example at the end of this article: [XML example](media-services-input-metadata-schema.md#xml).  

### Attributes
| Name | Type | Description |
| --- | --- | --- |
| **Id**<br /><br /> Required |**xs:int** |Zero-based index of this audio or video track.<br /><br /> This is not necessarily that the TrackID as used in an MP4 file. |
| **Codec** |**xs:string** |Video track codec string. |
| **CodecLongName** |**xs: string** |Audio or video track codec long name. |
| **TimeBase**<br /><br /> Required |**xs:string** |Time base. Example: TimeBase="1/48000" |
| **NumberOfFrames** |**xs:int** |Number of frames (present for video tracks). |
| **StartTime** |**xs: duration** |Track start time. Example: StartTime="PT2.669S" |
| **Duration** |**xs:duration** |Track duration. Example: Duration="PTSampleFormat M37.757S". |

> [!NOTE]
> The following two child elements must appear in a sequence.  
> 
> 

### Child elements
| Name | Type | Description |
| --- | --- | --- |
| **Disposition**<br /><br /> minOccurs="0" maxOccurs="1" |[StreamDispositionType](media-services-input-metadata-schema.md#StreamDispositionType) |Contains presentation information (for example, whether a particular audio track is for visually impaired viewers). |
| **Metadata**<br /><br /> minOccurs="0" maxOccurs="unbounded" |[MetadataType](media-services-input-metadata-schema.md#MetadataType) |Generic key/value strings that can be used to hold a variety of information. For example, key=”language”, and value=”eng”. |

## <a name="AudioTrackType"></a> AudioTrackType (inherits from TrackType)
 **AudioTrackType** is a global complex type that inherits from [TrackType](media-services-input-metadata-schema.md#TrackType).  

 The type represents a specific audio track in the asset file.  

 See an XML example at the end of this article: [XML example](media-services-input-metadata-schema.md#xml).  

### Attributes
| Name | Type | Description |
| --- | --- | --- |
| **SampleFormat** |**xs:string** |Sample format. |
| **ChannelLayout** |**xs: string** |Channel layout. |
| **Channels**<br /><br /> Required |**xs:int** |Number (0 or more) of audio channels. |
| **SamplingRate**<br /><br /> Required |**xs:int** |Audio sampling rate in samples/sec or Hz. |
| **Bitrate** |**xs:int** |Average audio bit rate in bits per second, as calculated from the asset file. Only the elementary stream payload is counted, and the packaging overhead is not included in this count. |
| **BitsPerSample** |**xs:int** |Bits per sample for the wFormatTag format type. |

## <a name="VideoTrackType"></a> VideoTrackType (inherits from TrackType)
**VideoTrackType** is a global complex type that inherits from [TrackType](media-services-input-metadata-schema.md#TrackType).  

The type represents a specific video track in the asset file.  

See an XML example at the end of this article: [XML example](media-services-input-metadata-schema.md#xml).  

### Attributes
| Name | Type | Description |
| --- | --- | --- |
| **FourCC**<br /><br /> Required |**xs:string** |Video codec FourCC code. |
| **Profile** |**xs: string** |Video track's profile. |
| **Level** |**xs: string** |Video track's level. |
| **PixelFormat** |**xs: string** |Video track's pixel format. |
| **Width**<br /><br /> Required |**xs:int** |Encoded video width in pixels. |
| **Height**<br /><br /> Required |**xs:int** |Encoded video height in pixels. |
| **DisplayAspectRatioNumerator**<br /><br /> Required |**xs: double** |Video display aspect ratio numerator. |
| **DisplayAspectRatioDenominator**<br /><br /> Required |**xs:double** |Video display aspect ratio denominator. |
| **DisplayAspectRatioDenominator**<br /><br /> Required |**xs: double** |Video sample aspect ratio numerator. |
| **SampleAspectRatioNumerator** |**xs: double** |Video sample aspect ratio numerator. |
| **SampleAspectRatioNumerator** |**xs:double** |Video sample aspect ratio denominator. |
| **FrameRate**<br /><br /> Required |**xs:decimal** |Measured video frame rate in .3f format. |
| **Bitrate** |**xs:int** |Average video bit rate in kilobits per second, as calculated from the asset file. Only the elementary stream payload is counted, and the packaging overhead is not included. |
| **MaxGOPBitrate** |**xs: int** |Max GOP average bitrate for this video track, in kilobits per second. |
| **HasBFrames** |**xs:int** |Video track number of B frames. |

## <a name="MetadataType"></a> MetadataType
**MetadataType** is a global complex type that describes metadata of an asset file as key/value strings. For example, key=”language”, and value=”eng”.  

See an XML example at the end of this article: [XML example](media-services-input-metadata-schema.md#xml).  

### Attributes
| Name | Type | Description |
| --- | --- | --- |
| **key**<br /><br /> Required |**xs:string** |The key in the key/value pair. |
| **value**<br /><br /> Required |**xs:string** |The value in the key/value pair. |

## <a name="ProgramType"></a> ProgramType
**ProgramType** is a global complex type that describes a program.  

### Attributes
| Name | Type | Description |
| --- | --- | --- |
| **ProgramId**<br /><br /> Required |**xs:int** |Program Id |
| **NumberOfPrograms**<br /><br /> Required |**xs:int** |Number of programs. |
| **PmtPid**<br /><br /> Required |**xs:int** |Program Map Tables (PMTs) contain information about programs.  For more information, see [PMt](https://en.wikipedia.org/wiki/MPEG_transport_stream#PMT). |
| **PcrPid**<br /><br /> Required |**xs: int** |Used by decoder. For more information, see [PCR](https://en.wikipedia.org/wiki/MPEG_transport_stream#PCR) |
| **StartPTS** |**xs: long** |Starting presentation time stamp. |
| **EndPTS** |**xs: long** |Ending presentation time stamp. |

## <a name="StreamDispositionType"></a> StreamDispositionType
**StreamDispositionType** is a global complex type that describes the stream.  

See an XML example at the end of this article: [XML example](media-services-input-metadata-schema.md#xml).  

### Attributes
| Name | Type | Description |
| --- | --- | --- |
| **Default**<br /><br /> Required |**xs: int** |Set this attribute to 1 to indicate this is the default presentation. |
| **Dub**<br /><br /> Required |**xs:int** |Set this attribute to 1 to indicate this is the dubbed presentation. |
| **Original**<br /><br /> Required |**xs: int** |Set this attribute to 1 to indicate this is the original presentation. |
| **Comment**<br /><br /> Required |**xs:int** |Set this attribute to 1 to indicate this track contains commentary. |
| **Lyrics**<br /><br /> Required |**xs:int** |Set this attribute to 1 to indicate this track contains lyrics. |
| **Karaoke**<br /><br /> Required |**xs:int** |Set this attribute to 1 to indicate this represents the karaoke track (background music, no vocals). |
| **Forced**<br /><br /> Required |**xs:int** |Set this attribute to 1 to indicate this is the forced presentation. |
| **HearingImpaired**<br /><br /> Required |**xs:int** |Set this attribute to 1 to indicate this track is for people who are hard of hearing. |
| **VisualImpaired**<br /><br /> Required |**xs:int** |Set this attribute to 1 to indicate this track is for the visually impaired. |
| **CleanEffects**<br /><br /> Required |**xs: int** |Set this attribute to 1 to indicate this track has clean effects. |
| **AttachedPic**<br /><br /> Required |**xs: int** |Set this attribute to 1 to indicate this track has pictures. |

## <a name="Programs"></a> Programs element
Wrapper element holding multiple **Program** elements.  

### Child elements
| Name | Type | Description |
| --- | --- | --- |
| **Program**<br /><br /> minOccurs="0" maxOccurs="unbounded" |[ProgramType](media-services-input-metadata-schema.md#ProgramType) |For asset files that are in MPEG-TS format, contains information about programs in the asset file. |

## <a name="VideoTracks"></a> VideoTracks element
 Wrapper element holding multiple **VideoTrack** elements.  

 See an XML example at the end of this article: [XML example](media-services-input-metadata-schema.md#xml).  

### Child elements
| Name | Type | Description |
| --- | --- | --- |
| **VideoTrack**<br /><br /> minOccurs="0" maxOccurs="unbounded" |[VideoTrackType (inherits from TrackType)](media-services-input-metadata-schema.md#VideoTrackType) |Contains information about video tracks in the asset file. |

## <a name="AudioTracks"></a> AudioTracks element
 Wrapper element holding multiple **AudioTrack** elements.  

 See an XML example at the end of this article: [XML example](media-services-input-metadata-schema.md#xml).  

### elements
| Name | Type | Description |
| --- | --- | --- |
| **AudioTrack**<br /><br /> minOccurs="0" maxOccurs="unbounded" |[AudioTrackType (inherits from TrackType)](media-services-input-metadata-schema.md#AudioTrackType) |Contains information about audio tracks in the asset file. |

## <a name="code"></a> Schema Code
    <?xml version="1.0" encoding="utf-8"?>  
    <xs:schema xmlns:xs="https://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata" version="1.0"  
               xmlns="http://schemas.microsoft.com/windowsazure/mediaservices/2014/07/mediaencoder/inputmetadata"  
               targetNamespace="http://schemas.microsoft.com/windowsazure/mediaservices/2014/07/mediaencoder/inputmetadata"  
               elementFormDefault="qualified">  

      <xs:complexType name="MetadataType">  
        <xs:attribute name="key"   type="xs:string" use="required"/>  
        <xs:attribute name="value" type="xs:string" use="required"/>  
      </xs:complexType>  

      <xs:complexType name="ProgramType">  
        <xs:attribute name="ProgramId" type="xs:int" use="required">  
          <xs:annotation>  
            <xs:documentation>Program Id</xs:documentation>  
          </xs:annotation>  
        </xs:attribute>  
        <xs:attribute name="NumberOfPrograms" type="xs:int" use="required">  
          <xs:annotation>  
            <xs:documentation>Number of programs</xs:documentation>  
          </xs:annotation>  
        </xs:attribute>  
        <xs:attribute name="PmtPid" type="xs:int" use="required">  
          <xs:annotation>  
            <xs:documentation>pmt pid</xs:documentation>  
          </xs:annotation>  
        </xs:attribute>  
        <xs:attribute name="PcrPid" type="xs:int" use="required">  
          <xs:annotation>  
            <xs:documentation>pcr pid</xs:documentation>  
          </xs:annotation>  
        </xs:attribute>  
        <xs:attribute name="StartPTS" type="xs:long">  
          <xs:annotation>  
            <xs:documentation>start pts</xs:documentation>  
          </xs:annotation>  
        </xs:attribute>  
        <xs:attribute name="EndPTS" type="xs:long">  
          <xs:annotation>  
            <xs:documentation>end pts</xs:documentation>  
          </xs:annotation>  
        </xs:attribute>  
      </xs:complexType>  

      <xs:complexType name="StreamDispositionType">  
        <xs:attribute name="Default"          type="xs:int" use="required" />  
        <xs:attribute name="Dub"              type="xs:int" use="required" />  
        <xs:attribute name="Original"         type="xs:int" use="required" />  
        <xs:attribute name="Comment"          type="xs:int" use="required" />  
        <xs:attribute name="Lyrics"           type="xs:int" use="required" />  
        <xs:attribute name="Karaoke"          type="xs:int" use="required" />  
        <xs:attribute name="Forced"           type="xs:int" use="required" />  
        <xs:attribute name="HearingImpaired"  type="xs:int" use="required" />  
        <xs:attribute name="VisualImpaired"   type="xs:int" use="required" />  
        <xs:attribute name="CleanEffects"     type="xs:int" use="required" />  
        <xs:attribute name="AttachedPic"      type="xs:int" use="required" />  
      </xs:complexType>  

      <xs:complexType name="TrackType" abstract="true">  
        <xs:sequence>  
          <xs:element name="Disposition" type="StreamDispositionType" minOccurs="0" maxOccurs="1"/>  
          <xs:element name="Metadata" type="MetadataType" minOccurs="0" maxOccurs="unbounded"/>  
        </xs:sequence>  
        <xs:attribute name="Id" use="required">  
          <xs:annotation>  
            <xs:documentation>zero-based index of this video track. Note: this is not necessarily the TrackID as used in an MP4 file</xs:documentation>  
          </xs:annotation>  
          <xs:simpleType>  
            <xs:restriction base="xs:int">  
              <xs:minInclusive value="0"/>  
            </xs:restriction>  
          </xs:simpleType>  
        </xs:attribute>  
        <xs:attribute name="Codec" type="xs:string">  
          <xs:annotation>  
            <xs:documentation>video track codec string</xs:documentation>  
          </xs:annotation>  
        </xs:attribute>  
        <xs:attribute name="CodecLongName" type="xs:string">  
          <xs:annotation>  
            <xs:documentation>video track codec long name</xs:documentation>  
          </xs:annotation>  
        </xs:attribute>  
        <xs:attribute name="TimeBase"  type="xs:string" use="required">  
          <xs:annotation>  
            <xs:documentation>Time base. Example: TimeBase="1/48000"</xs:documentation>  
          </xs:annotation>  
        </xs:attribute>  
        <xs:attribute name="NumberOfFrames">  
          <xs:annotation>  
            <xs:documentation>number of frames</xs:documentation>  
          </xs:annotation>  
          <xs:simpleType>  
            <xs:restriction base="xs:int">  
              <xs:minInclusive value="0"/>  
            </xs:restriction>  
          </xs:simpleType>  
        </xs:attribute>  
        <xs:attribute name="StartTime" type="xs:duration">  
          <xs:annotation>  
            <xs:documentation>Track start time. Example: StartTime="PT2.669S"</xs:documentation>  
          </xs:annotation>  
        </xs:attribute>  
        <xs:attribute name="Duration" type="xs:duration">  
          <xs:annotation>  
            <xs:documentation>Track duration. Example: Duration="PT25M37.757S"</xs:documentation>  
          </xs:annotation>  
        </xs:attribute>  
      </xs:complexType>  

      <xs:complexType name="VideoTrackType">  
        <xs:annotation>  
          <xs:documentation>A specific video track in the parent AssetFile</xs:documentation>  
        </xs:annotation>  
        <xs:complexContent>  
          <xs:extension base="TrackType">  
            <xs:attribute name="FourCC" type="xs:string" use="required">  
              <xs:annotation>  
                <xs:documentation>video codec FourCC code</xs:documentation>  
              </xs:annotation>  
            </xs:attribute>  
            <xs:attribute name="Profile" type="xs:string">  
              <xs:annotation>  
                <xs:documentation>profile</xs:documentation>  
              </xs:annotation>  
            </xs:attribute>  
            <xs:attribute name="Level" type="xs:string">  
              <xs:annotation>  
                <xs:documentation>level</xs:documentation>  
              </xs:annotation>  
            </xs:attribute>  
            <xs:attribute name="PixelFormat" type="xs:string">  
              <xs:annotation>  
                <xs:documentation>Video track's pixel format</xs:documentation>  
              </xs:annotation>  
            </xs:attribute>  
            <xs:attribute name="Width" use="required">  
              <xs:annotation>  
                <xs:documentation>encoded video width in pixels</xs:documentation>  
              </xs:annotation>  
              <xs:simpleType>  
                <xs:restriction base="xs:int">  
                  <xs:minInclusive value="0"/>  
                </xs:restriction>  
              </xs:simpleType>  
            </xs:attribute>  
            <xs:attribute name="Height" use="required">  
              <xs:annotation>  
                <xs:documentation>encoded video height in pixels</xs:documentation>  
              </xs:annotation>  
              <xs:simpleType>  
                <xs:restriction base="xs:int">  
                  <xs:minInclusive value="0"/>  
                </xs:restriction>  
              </xs:simpleType>  
            </xs:attribute>  
            <xs:attribute name="DisplayAspectRatioNumerator" use="required">  
              <xs:annotation>  
                <xs:documentation>video display aspect ratio numerator</xs:documentation>  
              </xs:annotation>  
              <xs:simpleType>  
                <xs:restriction base="xs:double">  
                  <xs:minInclusive value="0"/>  
                </xs:restriction>  
              </xs:simpleType>  
            </xs:attribute>  
            <xs:attribute name="DisplayAspectRatioDenominator" use="required">  
              <xs:annotation>  
                <xs:documentation>video display aspect ratio denominator</xs:documentation>  
              </xs:annotation>  
              <xs:simpleType>  
                <xs:restriction base="xs:double">  
                  <xs:minInclusive value="0"/>  
                </xs:restriction>  
              </xs:simpleType>  
            </xs:attribute>  
            <xs:attribute name="SampleAspectRatioNumerator">  
              <xs:annotation>  
                <xs:documentation>video sample aspect ratio numerator</xs:documentation>  
              </xs:annotation>  
              <xs:simpleType>  
                <xs:restriction base="xs:double">  
                  <xs:minInclusive value="0"/>  
                </xs:restriction>  
              </xs:simpleType>  
            </xs:attribute>  
            <xs:attribute name="SampleAspectRatioDenominator">  
              <xs:annotation>  
                <xs:documentation>video sample aspect ratio denominator</xs:documentation>  
              </xs:annotation>  
              <xs:simpleType>  
                <xs:restriction base="xs:double">  
                  <xs:minInclusive value="0"/>  
                </xs:restriction>  
              </xs:simpleType>  
            </xs:attribute>  
            <xs:attribute name="FrameRate" use="required">  
              <xs:annotation>  
                <xs:documentation>measured video frame rate in .3f format</xs:documentation>  
              </xs:annotation>  
              <xs:simpleType>  
                <xs:restriction base="xs:decimal">  
                  <xs:minInclusive value="0"/>  
                  <xs:fractionDigits value="3"/>  
                </xs:restriction>  
              </xs:simpleType>  
            </xs:attribute>  
            <xs:attribute name="Bitrate">  
              <xs:annotation>  
                <xs:documentation>average video bit rate in kilobits per second, as calculated from the AssetFile. Counts only the elementary stream payload, and does not include the packaging overhead</xs:documentation>  
              </xs:annotation>  
              <xs:simpleType>  
                <xs:restriction base="xs:int">  
                  <xs:minInclusive value="0"/>  
                </xs:restriction>  
              </xs:simpleType>  
            </xs:attribute>  
            <xs:attribute name="MaxGOPBitrate">  
              <xs:annotation>  
                <xs:documentation>Max GOP average bitrate for this video track, in kilobits per second</xs:documentation>  
              </xs:annotation>  
              <xs:simpleType>  
                <xs:restriction base="xs:int">  
                  <xs:minInclusive value="0"/>  
                </xs:restriction>  
              </xs:simpleType>  
            </xs:attribute>  
            <xs:attribute name="HasBFrames" type="xs:int">  
              <xs:annotation>  
                <xs:documentation>video track number of B frames</xs:documentation>  
              </xs:annotation>  
            </xs:attribute>  
          </xs:extension>  
        </xs:complexContent>  
      </xs:complexType>  

      <xs:complexType name="AudioTrackType">  
        <xs:annotation>  
          <xs:documentation>a specific audio track in the parent AssetFile</xs:documentation>  
        </xs:annotation>  
        <xs:complexContent>  
          <xs:extension base="TrackType">  
            <xs:attribute name="SampleFormat"  type="xs:string">  
              <xs:annotation>  
                <xs:documentation>sample format</xs:documentation>  
              </xs:annotation>  
            </xs:attribute>  
            <xs:attribute name="ChannelLayout"  type="xs:string">  
              <xs:annotation>  
                <xs:documentation>channel layout</xs:documentation>  
              </xs:annotation>  
            </xs:attribute>  
            <xs:attribute name="Channels" use="required">  
              <xs:annotation>  
                <xs:documentation>number of audio channels</xs:documentation>  
              </xs:annotation>  
              <xs:simpleType>  
                <xs:restriction base="xs:int">  
                  <xs:minInclusive value="0"/>  
                </xs:restriction>  
              </xs:simpleType>  
            </xs:attribute>  
            <xs:attribute name="SamplingRate" use="required">  
              <xs:annotation>  
                <xs:documentation>audio sampling rate in samples/sec or Hz</xs:documentation>  
              </xs:annotation>  
              <xs:simpleType>  
                <xs:restriction base="xs:int">  
                  <xs:minInclusive value="0"/>  
                </xs:restriction>  
              </xs:simpleType>  
            </xs:attribute>  
            <xs:attribute name="Bitrate">  
              <xs:annotation>  
                <xs:documentation>average audio bit rate in bits per second, as calculated from the AssetFile. Counts only the elementary stream payload, and does not include the packaging overhead</xs:documentation>  
              </xs:annotation>  
              <xs:simpleType>  
                <xs:restriction base="xs:int">  
                  <xs:minInclusive value="0"/>  
                </xs:restriction>  
              </xs:simpleType>  
            </xs:attribute>  
            <xs:attribute name="BitsPerSample">  
              <xs:annotation>  
                <xs:documentation>Bits per sample for the wFormatTag format type</xs:documentation>  
              </xs:annotation>  
              <xs:simpleType>  
                <xs:restriction base="xs:int">  
                  <xs:minInclusive value="0"/>  
                </xs:restriction>  
              </xs:simpleType>  
            </xs:attribute>  
          </xs:extension>  
        </xs:complexContent>  
      </xs:complexType>  

      <xs:element name="AssetFiles">  
        <xs:annotation>  
          <xs:documentation>Collection of AssetFile entries for the encoding job</xs:documentation>  
        </xs:annotation>  
        <xs:complexType>  
          <xs:sequence>  
            <xs:element name="AssetFile" minOccurs="1" maxOccurs="unbounded">  
              <xs:annotation>  
                <xs:documentation>asset file</xs:documentation>  
              </xs:annotation>  
              <xs:complexType>  
                <xs:sequence>  
                  <xs:element name="Programs" minOccurs="0">  
                    <xs:annotation>  
                      <xs:documentation>This is the collection of all programs when file is MPEG-TS</xs:documentation>  
                    </xs:annotation>  
                    <xs:complexType>  
                      <xs:sequence>  
                        <xs:element name="Program" type="ProgramType" minOccurs="0" maxOccurs="unbounded" />  
                      </xs:sequence>  
                    </xs:complexType>  
                  </xs:element>  
                  <xs:element name="VideoTracks" minOccurs="0">  
                    <xs:annotation>  
                      <xs:documentation>Each physical AssetFile can contain in it zero or more video tracks interleaved into an appropriate container format. This is the collection of all those video tracks</xs:documentation>  
                    </xs:annotation>  
                    <xs:complexType>  
                      <xs:sequence>  
                        <xs:element name="VideoTrack" type="VideoTrackType" minOccurs="0" maxOccurs="unbounded" />  
                      </xs:sequence>  
                    </xs:complexType>  
                  </xs:element>  
                  <xs:element name="AudioTracks" minOccurs="0">  
                    <xs:annotation>  
                      <xs:documentation>each physical AssetFile can contain in it zero or more audio tracks interleaved into an appropriate container format. This is the collection of all those audio tracks</xs:documentation>  
                    </xs:annotation>  
                    <xs:complexType>  
                      <xs:sequence>  
                        <xs:element name="AudioTrack" type="AudioTrackType" minOccurs="0" maxOccurs="unbounded" />  
                      </xs:sequence>  
                    </xs:complexType>  
                  </xs:element>  
                  <xs:element name="Metadata" type="MetadataType" minOccurs="0" maxOccurs="unbounded" />  
                </xs:sequence>  
                <xs:attribute name="Name" type="xs:string" use="required">  
                  <xs:annotation>  
                    <xs:documentation>the media asset file name</xs:documentation>  
                  </xs:annotation>  
                </xs:attribute>  
                <xs:attribute name="Size" use="required">  
                  <xs:annotation>  
                    <xs:documentation>size of file in bytes</xs:documentation>  
                  </xs:annotation>  
                  <xs:simpleType>  
                    <xs:restriction base="xs:long">  
                      <xs:minInclusive value="0"/>  
                    </xs:restriction>  
                  </xs:simpleType>  
                </xs:attribute>  
                <xs:attribute name="Duration" type="xs:duration" use="required">  
                  <xs:annotation>  
                    <xs:documentation>content play back duration. Example: Duration="PT25M37.757S"</xs:documentation>  
                  </xs:annotation>  
                </xs:attribute>  
                <xs:attribute name="NumberOfStreams" type="xs:int" use="required">  
                  <xs:annotation>  
                    <xs:documentation>number of streams in asset file</xs:documentation>  
                  </xs:annotation>  
                </xs:attribute>  
                <xs:attribute name="FormatNames" type="xs:string" use="required">  
                  <xs:annotation>  
                    <xs:documentation>format names</xs:documentation>  
                  </xs:annotation>  
                </xs:attribute>  
                <xs:attribute name="FormatVerboseName" type="xs:string" use="required">  
                  <xs:annotation>  
                    <xs:documentation>format verbose names</xs:documentation>  
                  </xs:annotation>  
                </xs:attribute>  
                <xs:attribute name="StartTime" type="xs:duration">  
                  <xs:annotation>  
                    <xs:documentation>content start time. Example: StartTime="PT2.669S"</xs:documentation>  
                  </xs:annotation>  
                </xs:attribute>  
                <xs:attribute name="OverallBitRate">  
                  <xs:annotation>  
                    <xs:documentation>average bitrate of the asset file in kbps</xs:documentation>  
                  </xs:annotation>  
                  <xs:simpleType>  
                    <xs:restriction base="xs:int">  
                      <xs:minInclusive value="0"/>  
                    </xs:restriction>  
                  </xs:simpleType>  
                </xs:attribute>  
              </xs:complexType>  
            </xs:element>  
          </xs:sequence>  
        </xs:complexType>  
      </xs:element>  
    </xs:schema>  


## <a name="xml"></a> XML example
The following is an example of the Input metadata file.  

    <?xml version="1.0" encoding="utf-8"?>  
    <AssetFiles xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/windowsazure/mediaservices/2014/07/mediaencoder/inputmetadata">  
      <AssetFile Name="bear.mp4" Size="1973733" Duration="PT12.678S" NumberOfStreams="2" FormatNames="mov,mp4,m4a,3gp,3g2,mj2" FormatVerboseName="QuickTime / MOV" StartTime="PT0S" OverallBitRate="1245">  
        <VideoTracks>  
          <VideoTrack Id="1" Codec="h264" CodecLongName="H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10" TimeBase="1/29970" NumberOfFrames="375" StartTime="PT0.034S" Duration="PT12.645S" FourCC="avc1" Profile="High" Level="4.1" PixelFormat="yuv420p" Width="512" Height="384" DisplayAspectRatioNumerator="4" DisplayAspectRatioDenominator="3" SampleAspectRatioNumerator="1" SampleAspectRatioDenominator="1" FrameRate="29.656" Bitrate="1043" HasBFrames="1">  
            <Disposition Default="1" Dub="0" Original="0" Comment="0" Lyrics="0" Karaoke="0" Forced="0" HearingImpaired="0" VisualImpaired="0" CleanEffects="0" AttachedPic="0" />  
            <Metadata key="creation_time" value="2010-03-10 16:11:56" />  
            <Metadata key="language" value="eng" />  
            <Metadata key="handler_name" value="Mainconcept MP4 Video Media Handler" />  
          </VideoTrack>  
        </VideoTracks>  
        <AudioTracks>  
          <AudioTrack Id="0" Codec="aac" CodecLongName="AAC (Advanced Audio Coding)" TimeBase="1/44100" NumberOfFrames="546" StartTime="PT0S" Duration="PT12.678S" SampleFormat="fltp" ChannelLayout="stereo" Channels="2" SamplingRate="44100" Bitrate="156" BitsPerSample="0">  
            <Disposition Default="1" Dub="0" Original="0" Comment="0" Lyrics="0" Karaoke="0" Forced="0" HearingImpaired="0" VisualImpaired="0" CleanEffects="0" AttachedPic="0" />  
            <Metadata key="creation_time" value="2010-03-10 16:11:56" />  
            <Metadata key="language" value="eng" />  
            <Metadata key="handler_name" value="Mainconcept MP4 Sound Media Handler" />  
          </AudioTrack>  
        </AudioTracks>  
        <Metadata key="major_brand" value="mp42" />  
        <Metadata key="minor_version" value="0" />  
        <Metadata key="compatible_brands" value="mp42mp41" />  
        <Metadata key="creation_time" value="2010-03-10 16:11:53" />  
        <Metadata key="comment" value="Courtesy of National Geographic.  Used by Permission." />  
      </AssetFile>  
    </AssetFiles>  

## Next steps
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

