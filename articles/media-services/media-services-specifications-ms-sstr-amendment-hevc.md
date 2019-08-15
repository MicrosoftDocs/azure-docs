---
title: Azure Media Services - Smooth Streaming Protocol (MS-SSTR) Amendment for HEVC | Microsoft Docs
description: This specification describes the protocol and format for fragmented MP4-based live streaming with HEVC in Azure Media Services. This is an amendment to the Smooth Streaming protocol documentation (MS-SSTR) to include support for HEVC ingest and streaming. Only the changes required to deliver HEVC are specified in this article, except were “(No Change)” indicates text is copied for clarification only.
services: media-services
documentationcenter: ''
author: cenkdin
manager: femila
editor: ''

ms.assetid: f27d85de-2cb8-4269-8eed-2efb566ca2c6
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/20/2019
ms.author: johndeu

---
# Smooth Streaming Protocol (MS-SSTR) Amendment for HEVC 

## 1 Introduction 

This article provides detailed amendments to be applied to the Smooth Streaming Protocol
specification [MS-SSTR] to enable Smooth Streaming of HEVC encoded video. In this specification, we
outline only the changes required to deliver the HEVC video codec. The article follows the same
numbering schema as the [MS-SSTR] specification. The empty headlines presented throughout the article are provided to orient the reader to their position in the [MS-SSTR] specification.  “(No Change)” indicates text is copied for clarification purposes only.

The article provides technical implementation requirements for the signaling of HEVC video codec 
in a Smooth Streaming manifest and normative  references are updated to reference the current MPEG standards 
that include HEVC, Common Encryption of HEVC, and box names for ISO Base Media File
Format have been updated to be consistent with the latest specifications. 

The referenced Smooth Streaming Protocol specification [MS-SSTR] describes the
wire format used to deliver live and on-demand digital media,
such as audio and video, in the following manners: from an encoder to a web
server, from a server to another server, and from a server to an HTTP client.
The use of an MPEG-4 ([[MPEG4-RA])](https://go.microsoft.com/fwlink/?LinkId=327787)-based data
structure delivery over HTTP allows seamless switching in near real time between
different quality levels of compressed media content. The result is a constant
playback experience for the HTTP client end user, even if network and video
rendering conditions change for the client computer or device.

## 1.1 Glossary 

The following terms are defined in *[MS-GLOS]*:

>   **globally unique identifier (GUID) universally unique identifier (UUID)**

The following terms are specific to this document:

>  **composition time:** The time a sample is presented at the client,
>   as defined in
>   [[ISO/IEC-14496-12]](https://go.microsoft.com/fwlink/?LinkId=183695).
> 
>   **CENC**: Common Encryption, as defined in [ISO/IEC 23001-7] Second Edition.
> 
>   **decode time:** The time a sample is required to be decoded on the client,
>   as defined in
>   [[ISO/IEC 14496-12:2008]](https://go.microsoft.com/fwlink/?LinkId=183695).

**fragment:** An independently downloadable unit of **media** that comprises one
or more **samples**.

>   **HEVC:** High Efficiency Video Coding, as defined in [ISO/IEC 23008-2]
> 
>   **manifest:** Metadata about the **presentation** that allows a client to
>   make requests for **media**. **media:** Compressed audio, video, and text
>   data used by the client to play a **presentation**. **media format:** A
>   well-defined format for representing audio or video as a compressed
>   **sample**.
> 
>   **presentation:** The set of all **streams** and related metadata needed to
>   play a single movie. **request:** An HTTP message sent from the client to
>   the server, as defined in
>   [[RFC2616]](https://go.microsoft.com/fwlink/?LinkId=90372) **response:** An
>   HTTP message sent from the server to the client, as defined in
>   [[RFC2616]](https://go.microsoft.com/fwlink/?LinkId=90372)
> 
>   **sample:** The smallest fundamental unit (such as a frame) in which
>   **media** is stored and processed.
> 
>   **MAY, SHOULD, MUST, SHOULD NOT, MUST NOT:** These terms (in all caps) are
>   used as described in
>   [[RFC2119]](https://go.microsoft.com/fwlink/?LinkId=90317) All statements of
>   optional behavior use either MAY, SHOULD, or SHOULD NOT.

## 1.2 References

>   References to Microsoft Open Specifications documentation do not include a
>   publishing year because links are to the latest version of the documents,
>   which are updated frequently. References to other documents include a
>   publishing year when one is available.

### 1.2.1 Normative References 

>  [MS-SSTR] Smooth Streaming Protocol *v20140502*
>   [https://msdn.microsoft.com/library/ff469518.aspx](https://msdn.microsoft.com/library/ff469518.aspx)
> 
>   [ISO/IEC 14496-12] International Organization for Standardization,
>   "Information technology -- Coding of audio-visual objects -- Part 12: ISO
>   Base Media File Format", ISO/IEC 14496-12:2014, Edition 4, Plus Corrigendum
>   1, Amendments 1 & 2.
>   <https://standards.iso.org/ittf/PubliclyAvailableStandards/c061988_ISO_IEC_14496-12_2012.zip>
> 
>   [ISO/IEC 14496-15] International Organization for Standardization,
>   "Information technology -- Coding of audio-visual objects -- Part 15:
>   Carriage of NAL unit structured video in the ISO Base Media File Format",
>   ISO 14496-15:2015, Edition 3.
>   <https://www.iso.org/iso/home/store/catalogue_tc/catalogue_detail.htm?csnumber=65216>
> 
>   [ISO/IEC 23008-2] Information technology -- High efficiency coding and media
>   delivery in heterogeneous environments -- Part 2: High efficiency video
>   coding: 2013 or newest edition
>   <https://standards.iso.org/ittf/PubliclyAvailableStandards/c035424_ISO_IEC_23008-2_2013.zip>
> 
>   [ISO/IEC 23001-7] Information technology — MPEG systems technologies — Part
>   7: Common encryption in ISO base media file format files, CENC Edition
>   2:2015 <https://www.iso.org/iso/catalogue_detail.htm?csnumber=65271>
> 
>   [RFC-6381] IETF RFC-6381, “The 'Codecs' and 'Profiles' Parameters for
>   "Bucket" Media Types” <https://tools.ietf.org/html/rfc6381>
> 
>   [MPEG4-RA] The MP4 Registration Authority, "MP4REG", [http://www.mp4ra.org](https://go.microsoft.com/fwlink/?LinkId=327787)
> 
>   [RFC2119] Bradner, S., "Key words for use in RFCs to Indicate Requirement
>   Levels", BCP 14, RFC 2119, March 1997,
>   [https://www.rfc-editor.org/rfc/rfc2119.txt](https://go.microsoft.com/fwlink/?LinkId=90317)

### 1.2.2 Informative References 

>   [MS-GLOS] Microsoft Corporation, "*Windows Protocols Master Glossary*."
> 
>   [RFC3548] Josefsson, S., Ed., "The Base16, Base32, and Base64 Data
>   Encodings", RFC 3548, July 2003, [https://www.ietf.org/rfc/rfc3548.txt](https://go.microsoft.com/fwlink/?LinkId=90432)
> 
>   [RFC5234] Crocker, D., Ed., and Overell, P., "Augmented BNF for Syntax
>   Specifications: ABNF", STD 68, RFC 5234, January 2008,
>   [https://www.rfc-editor.org/rfc/rfc5234.txt](https://go.microsoft.com/fwlink/?LinkId=123096)


## 1.3 Overview 

>   Only changes to the Smooth Streaming specification required for the delivery
>   of HEVC are specified below. Unchanged section headers are listed to
>   maintain location in the referenced Smooth Streaming specification
>   [MS-SSTR].

## 1.4 Relationship to Other Protocols 

## 1.5 Prerequisites/Preconditions 

## 1.6 Applicability Statement 

## 1.7 Versioning and Capability Negotiation 

## 1.8 Vendor-Extensible Fields 

>   The following method SHALL be used identify streams using the HEVC video
>   format:
> 
>   * **Custom Descriptive Codes for Media Formats:** This capability is
>   provided by the **FourCC** field, as specified in section *2.2.2.5*.
>   Implementers can ensure that extensions do not conflict by registering
>   extension codes with the MPEG4-RA, as specified in [[ISO/IEC-14496-12]](https://go.microsoft.com/fwlink/?LinkId=183695)

## 1.9 Standards Assignments 

## 2 Messages 

## 2.1 Transport

## 2.2 Message Syntax 

### 2.2.1 Manifest Request 

### 2.2.2 Manifest Response 

#### 2.2.2.1 SmoothStreamingMedia 

>   **MinorVersion (variable):** The minor version of the Manifest Response
>   message. MUST be set to 2. (No Change)
> 
>   **TimeScale (variable):** The time scale of the Duration attribute,
>   specified as the number of increments in one second. The default value is
> 1. (No Change)
> 
>    The recommended value is 90000 for representing the exact duration of video
>    frames and fragments containing fractional framerate video (for example, 30/1.001
>    Hz).

#### 2.2.2.2 ProtectionElement 

The ProtectionElement SHALL be present when Common Encryption (CENC) has been
applied to video or audio streams. HEVC encrypted streams SHALL conform to
Common Encryption 2nd Edition [ISO/IEC 23001-7]. Only slice data in VCL NAL
Units SHALL be encrypted.

#### 2.2.2.3 StreamElement 

>   **StreamTimeScale (variable):** The time scale for duration and time values
>   in this stream, specified as the number of increments in one second. A value
>   of 90000 is recommended for HEVC streams. A value matching the waveform
>   sample frequency (for example, 48000 or 44100) is recommended for audio streams.

##### 2.2.2.3.1 StreamProtectionElement

#### 2.2.2.4 UrlPattern 

#### 2.2.5 TrackElement 

>   **FourCC (variable):** A four-character code that identifies which media
>   format is used for each sample. The following range of values is reserved
>   with the following semantic meanings:
> 
> * "hev1”: Video samples for this track use HEVC video, using the ‘hev1’
>   sample description format specified in [ISO/IEC-14496-15].
> 
>   **CodecPrivateData (variable):** Data that specifies parameters specific to
>   the media format and common to all samples in the track, represented as a
>   string of hex-coded bytes. The format and semantic meaning of byte sequence
>   varies with the value of the **FourCC** field as follows:
> 
>   * When a TrackElement describes HEVC video, the **FourCC** field SHALL equal
>   **"hev1"** and;
> 
>   The **CodecPrivateData** field SHALL contain a hex-coded string
>   representation of the following byte sequence, specified in ABNF
>   [[RFC5234]:](https://go.microsoft.com/fwlink/?LinkId=123096) (no change from
>   MS-SSTR)
> 
>   * %x00 %x00 %x00 %x01 SPSField %x00 %x00 %x00 %x01 PPSField
> 
>   * SPSField contains the Sequence Parameter Set (SPS).
> 
>   * PPSField contains the Slice Parameter Set (PPS).
> 
>   Note: The Video Parameter Set (VPS) is not contained in CodecPrivateData,
>   but should be contained in the file header of stored files in the ‘hvcC’
>   box. Systems using Smooth Streaming Protocol must signal additional decoding
>   parameters (for example, HEVC Tier) using the Custom Attribute “codecs.”

##### 2.2.2.5.1 CustomAttributesElement 

#### 2.2.6 StreamFragmentElement 

>   The **SmoothStreamingMedia’s MajorVersion** field MUST be set to 2, and
>   **MinorVersion** field MUST be set to 2. (No Change)

##### 2.2.2.6.1 TrackFragmentElement 

### 2.2.3 Fragment Request 

>   **Note**: The default media format requested for **MinorVersion** 2 and ‘hev1’
>   is ‘iso8’ brand ISO Base Media File Format specified in [ISO/IEC 14496-12]
>   ISO Base Media File Format Fourth Edition, and [ISO/IEC 23001-7] Common
>   Encryption Second Edition.

### 2.2.4 Fragment Response 

#### 2.2.4.1 MoofBox 

#### 2.2.4.2 MfhdBox 

#### 2.2.4.3 TrafBox 

#### 2.2.4.4 TfxdBox 

>   The **TfxdBox** is deprecated, and its function replaced by the Track
>   Fragment Decode Time Box (‘tfdt’) specified in [ISO/IEC 14496-12] section
>   8.8.12.
> 
>   **Note**: A client may calculate the duration of a fragment by summing the
>   sample durations listed in the Track Run Box (‘trun’) or multiplying the
>   number of samples times the default sample duration. The baseMediaDecodeTime
>   in ‘tfdt’ plus fragment duration equals the URL time parameter for the next
>   fragment.
> 
>   A Producer Reference Time Box (‘prft’) SHOULD be inserted prior to a Movie
>   Fragment Box (‘moof’) as needed, to indicate the UTC time corresponding to
>   the Track Fragment Decode Time of the first sample referenced by the Movie
>   Fragment Box, as specified in [ISO/IEC 14496-12] section 8.16.5.

#### 2.2.4.5 TfrfBox 

>   The **TfrfBox** is deprecated, and its function replaced by the Track
>   Fragment Decode Time Box (‘tfdt’) specified in [ISO/IEC 14496-12] section
>   8.8.12.
> 
>   **Note**: A client may calculate the duration of a fragment by summing the
>   sample durations listed in the Track Run Box (‘trun’) or multiplying the
>   number of samples times the default sample duration. The baseMediaDecodeTime
>   in ‘tfdt’ plus fragment duration equals the URL time parameter for the next
>   fragment. Look ahead addresses are deprecated because they delay live
>   streaming.

#### 2.2.4.6 TfhdBox 

>   The **TfhdBox** and related fields encapsulate defaults for per sample
>   metadata in the fragment. The syntax of the **TfhdBox** field is a strict
>   subset of the syntax of the Track Fragment Header Box defined in
>   [[ISO/IEC-14496-12]](https://go.microsoft.com/fwlink/?LinkId=183695) section
>   8.8.7.
> 
>   **BaseDataOffset (8 bytes):** The offset, in bytes, from the beginning of
>   the **MdatBox** field to the sample field in the **MdatBox** field. To
>   signal this restriction, the default-base-is-moof flag (0x020000) must be
>   set.

#### 2.2.4.7 TrunBox 

>   The **TrunBox** and related fields encapsulate per sample metadata for the
>   requested fragment. The syntax of **TrunBox** is a strict subset of the
>   Version 1 Track Fragment Run Box defined in
>   [[ISO/IEC-14496-](https://go.microsoft.com/fwlink/?LinkId=183695)*12]*
>   section 8.8.8.
> 
>   **SampleCompositionTimeOffset (4 bytes):** The Sample Composition Time
>   offset of each sample adjusted so that the presentation time of the first
>   presented sample in the fragment is equal to the decode time of the first
>   decoded sample. Negative video sample composition offsets SHALL be used,
> 
>   as defined in
>   [[ISO/IEC-14496-12].](https://go.microsoft.com/fwlink/?LinkId=183695)
> 
>   Note: This avoids a video synchronization error caused by video lagging
>   audio equal to the largest decoded picture buffer removal delay, and
>   maintains presentation timing between alternative fragments that may have
>   different removal delays.
> 
>   The syntax of the fields defined in this section, specified in ABNF
>   [[RFC5234],](https://go.microsoft.com/fwlink/?LinkId=123096) remains the
>   same, except as follows:
> 
>   SampleCompositionTimeOffset = SIGNED_INT32

#### 2.2.4.8 MdatBox 

#### 2.2.4.9 Fragment Response Common Fields 

### 2.2.5 Sparse Stream Pointer 

### 2.2.6 Fragment Not Yet Available 

### 2.2.7 Live Ingest 

#### 2.2.7.1 FileType 

>   **FileType (variable):** specifies the subtype and intended use of the
>   MPEG-4 ([[MPEG4-RA])](https://go.microsoft.com/fwlink/?LinkId=327787) file,
>   and high-level attributes.
> 
>   **MajorBrand (variable):** The major brand of the media file. MUST be set to
>   "isml."
> 
>   **MinorVersion (variable):** The minor version of the media file. MUST be
>   set to 1.
> 
>   **CompatibleBrands (variable):** Specifies the supported brands of MPEG-4.
>   MUST include "ccff" and "iso8."
> 
>   The syntax of the fields defined in this section, specified in ABNF
>   [[RFC5234],](https://go.microsoft.com/fwlink/?LinkId=123096) is as follows:

    FileType = MajorBrand MinorVersion CompatibleBrands
    MajorBrand = STRING_UINT32
    MinorVersion = STRING_UINT32
    CompatibleBrands = "ccff" "iso8" 0\*(STRING_UINT32)

**Note**: The compatibility brands ‘ccff’ and ‘iso8’ indicate that fragments conform
to “Common Container File Format” and Common Encryption [ISO/IEC 23001-7] and
ISO Base Media File Format Edition 4 [ISO/IEC 14496-12].

#### 2.2.7.2 StreamManifestBox 

##### 2.2.7.2.1 StreamSMIL 

#### 2.2.7.3 LiveServerManifestBox 

##### 2.2.7.3.1 LiveSMIL 

#### 2.2.7.4 MoovBox 

#### 2.2.7.5 Fragment 

##### 2.2.7.5.1 Track Fragment Extended Header 

### 2.2.8 Server-to-Server Ingest 

## 3 Protocol Details 


## 3.1 Client Details 

### 3.1.1 Abstract Data Model 

#### 3.1.1.1 Presentation Description 

>   The Presentation Description data element encapsulates all metadata for the
>   presentation.
> 
>   Presentation Metadata: A set of metadata that is common to all streams in
>   the presentation. Presentation Metadata comprises the following fields,
>   specified in section *2.2.2.1*:
> 
> * **MajorVersion**
> * **MinorVersion**
> * **TimeScale**
> * **Duration**
> * **IsLive**
> * **LookaheadCount**
> * **DVRWindowLength**
> 
>   Presentations containing HEVC Streams SHALL set:

    MajorVersion = 2
    MinorVersion = 2

>   LookaheadCount = 0 (Note: Boxes deprecated)
> 
>   Presentations SHOULD also set:

    TimeScale = 90000

>   Stream Collection: A collection of Stream Description data elements, as
>   specified in section *3.1.1.1.2*.
> 
>   Protection Description: A collection of Protection System Metadata
>   Description data elements, as specified in section *3.1.1.1.1*.

##### 3.1.1.1.1 Protection System Metadata Description 

>   The Protection System Metadata Description data element encapsulates
>   metadata specific to a single Content Protection System. (No Change)
> 
>   Protection Header Description: Content protection metadata that pertains to
>   a single Content Protection System. Protection Header Description comprises
>   the following fields, specified in section *2.2.2.2*:
> 
>   * **SystemID**
>   * **ProtectionHeaderContent**

##### 3.1.1.1.2 Stream Description 

###### 3.1.1.1.2.1 Track Description 

###### 3.1.1.1.2.1.1 Custom Attribute Description 

##### 3.1.1.3 Fragment Reference Description 

###### 3.1.1.3.1 Track-Specific Fragment Reference Description 

#### 3.1.1.2 Fragment Description 

##### 3.1.1.2.1 Sample Description 

### 3.1.2 Timers 

### 3.1.3 Initialization 

### 3.1.4 Higher-Layer Triggered Events 

#### 3.1.4.1 Open Presentation 

#### 3.1.4.2 Get Fragment 

#### 3.1.4.3 Close Presentation 

### 3.1.5 Processing Events and Sequencing Rules 

#### 3.1.5.1 Manifest Request and Manifest Response 

#### 3.1.5.2 Fragment Request and Fragment Response

## 3.2 Server Details

## 3.3 Live Encoder Details 

## 4 Protocol Examples 

## 5 Security 

## 5.1 Security Considerations for Implementers

>   If the content transported using this protocol has high commercial value, a
>   Content Protection System should be used to prevent unauthorized use of the
>   content. The **ProtectionElement** can be used to carry metadata related to
>   the use of a Content Protection System. Protected audio and video content
>   SHALL be encrypted as specified by MPEG Common Encryption Second
>   Edition: 2015 [ISO/IEC 23001-7].
> 
>   **Note**: For HEVC video, only slice data in VCL NALs is encrypted. Slice
>   headers and other NALs are accessible to presentation applications prior to
>   decryption. in a secure video path, encrypted information is not available
>   to presentation applications.

## 5.2 Index of Security Parameters 


| **Security parameter**  | **Section**         |
|-------------------------|---------------------|
| ProtectionElement       | *2.2.2.2*           |
| Common Encryption Boxes | *[ISO/IEC 23001-7]* |

## 5.3 Common Encryption Boxes

The following boxes may be present in fragment responses when Common Encryption
is applied, and are specified in [ISO/IEC 23001-7] or [ISO/IEC 14496-12]:

1.  Protection System Specific Header Box (‘pssh’)

2.  Sample Encryption Box (‘senc’)

3.  Sample Auxiliary Information Offset Box (‘saio’)

4.  Sample Auxiliary Information Size Box (‘saiz’)

5.  Sample Group Description Box (‘sgpd’)

6.  Sample to Group Box (‘sbgp’)

---

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

[image1]: ./media/media-services-fmp4-live-ingest-overview/media-services-image1.png
[image2]: ./media/media-services-fmp4-live-ingest-overview/media-services-image2.png
[image3]: ./media/media-services-fmp4-live-ingest-overview/media-services-image3.png
[image4]: ./media/media-services-fmp4-live-ingest-overview/media-services-image4.png
[image5]: ./media/media-services-fmp4-live-ingest-overview/media-services-image5.png
[image6]: ./media/media-services-fmp4-live-ingest-overview/media-services-image6.png
[image7]: ./media/media-services-fmp4-live-ingest-overview/media-services-image7.png
