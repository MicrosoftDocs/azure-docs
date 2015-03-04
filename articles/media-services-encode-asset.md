<properties 
	pageTitle="How to Encode an Asset with Azure Media Services" 
	description="Learn how to use the Azure Media Encoder to encode media content on Media Services. Code samples are written in C# and use the Media Services SDK for .NET." 
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
	ms.date="03/03/2015" 
	ms.author="juliako"/>

#Encoding with Azure Media Services

##Overview

Media Services supports the following encoders:

- Azure Media Encoder


By default each Media Services account can have one active encoding task at a time. You can reserve encoding units that allow you to have multiple encoding tasks running concurrently, one for each encoding reserved unit you purchase. For information about scaling encoding units, see the following **Portal** and **.NET** topics.

[AZURE.INCLUDE [media-services-selector-scale-encoding-units](../includes/media-services-selector-scale-encoding-units.md)]

##Azure Media Encoder

[Formats Supported by the Media Services Encoder](../media-services-azure-media-encoder-formats)  – Discusses the file and stream formats supported by Media Services

The **Azure Media Encoder** is configured using one of the encoder preset strings described [here](https://msdn.microsoft.com/library/azure/dn619392.aspx).

Encode with **Azure Media Encoder** using **Azure Management Portal**, **.NET**, or **REST API**.
 
[AZURE.INCLUDE [media-services-selector-encode](../includes/media-services-selector-encode.md)]

[Dynamic Packaging](https://msdn.microsoft.com/library/azure/jj889436.aspx) – Describes how to encode to a single format and dynamically serve Smooth Streaming, Apple HLS, or MPEG-DASH

[Controlling Media Service Encoder Output Filenames ](https://msdn.microsoft.com/library/azure/dn303341.aspx)– Describes the file naming convention used by the Azure Media Encoder and how to modify the output file names.

[Encoder Guides](https://msdn.microsoft.com/library/azure/dn535856.aspx) - A collection of topics that help you determine the best encoding for your intended audience

[Encoding your media with Dolby Digital Plus](../media-services-encode-with-dolby-digital-plus) – Describes how to encode audio tracks using Dolby Digital Plus encoding

[Quotas and Limitations](../media-services-quotas-and-limitations) – Describes quotas used and limitations of the Media Services Encoder





