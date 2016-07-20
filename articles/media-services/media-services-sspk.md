<properties 
	pageTitle="Licensing Microsoft® Smooth Streaming Client Porting Kit" 
	description="Learn about how to licensing the Microsoft® Smooth Streaming Client Porting Kit." 
	services="media-services" 
	documentationCenter="" 
	authors="xpouyat,vsood" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/22/2016"  
	ms.author="xpouyat"/>

#Licensing Microsoft® Smooth Streaming Client Porting Kit

##Overview

Microsoft Smooth Streaming Client Porting Kit (**SSPK** for short) is a Smooth Streaming client implementation that is optimized to help embedded device manufacturers, cable and mobile operators, content service providers, handset manufacturers, independent software vendors (ISVs), and solution providers to create products and services for streaming adaptive streaming content in Smooth Streaming format. SSPK is a device and platform independent implementation of Smooth Streaming client that can be ported by the licensee to any device and platform. 

Included below is a high level architecture and IIS Smooth Streaming Porting Kit box is the Smooth Streaming Client implementation provided by Microsoft and includes all the core logic for playback of Smooth Streaming content. This is then ported by partners for a specific device or platform by implementing appropriate interfaces. 

![SSPK](./media/media-services-sspk/sspk-arch.png)

##Description

SSPK is licensed on terms that offer excellent business value. SSPK license provides the industry with:

- Smooth Streaming Porting Kit source in C++ 
  - implements Smooth Streaming Client functionality
  - adds format parsing, heuristics, buffering logic, etc.
- Player application APIs 
  -	programming interfaces for interaction with a media player application
- Platform Abstraction Layer (PAL) Interface 
  -	programming interfaces for interaction with the operating system (threads, sockets)
- Hardware Abstraction Layer (HAL) Interface 
  -	programming interfaces for interaction with hardware A/V decoders (decoding, rendering)
- Digital Rights Management (DRM) Interface 
  -	programming interfaces for handling DRM through the DRM Abstraction Layer (DAL)
  -	Microsoft PlayReady Porting Kit ships separately but integrates through this interface. For more details on Microsoft PlayReady Device licensing, click [here](http://www.microsoft.com/playready/licensing/device_technology.mspx#pddipdl).
- Implementation samples 
  -	sample PAL implementation for Linux
  -	sample HAL implementation for GStreamer

##Licensing Options

Microsoft Smooth Streaming Client Porting Kit is made available to licensees under two distinct license agreements: one for developing Smooth Streaming Client Interim Products and another for distributing Smooth Streaming Client Final Products to end users.
 
- For chipset manufacturers, system integrators, or independent software vendors (ISVs) who require a source code porting kit to develop Interim Products, a Microsoft Smooth Streaming Client Porting Kit **Interim Product License** should be executed.
- For device manufacturers or ISVs who require distribution rights for Smooth Streaming Client Final Products to end users, the Microsoft Smooth Streaming Client Porting Kit **Final Product License** should be executed.

###Microsoft Smooth Streaming Client Porting Kit Interim Product License

Under this license, Microsoft offers a Smooth Streaming Client Porting Kit and the necessary intellectual property rights to develop and distribute Smooth Streaming Client Interim Products to other Smooth Streaming Client Porting Kit device licensees that distribute Smooth Streaming Client Final Products.

####Fee structure

A U.S. $50,000 one-time license fee provides access to the Smooth Streaming Client Porting Kit. 

###Microsoft Smooth Streaming Client Porting Kit Final Product License

Under this license, Microsoft offers all necessary intellectual property rights to receive Smooth Streaming Client Interim Products from other Smooth Streaming Client Porting Kit licensees and to distribute company-branded Smooth Streaming Client Final Products to end users.

####Fee structure

The Smooth Streaming Client Final Product is offered under a royalty model as under:

- $0.10 per device implementation shipped
- The royalty is capped at $50,000 each year
- No royalty for first 10,000 device implementations each year 

##Licensing Procedure and SSPK access

Please email [sspkinfo@microsoft.com](mailto:sspkinfo@microsoft.com) for all licensing queries.

The [SSPK Distribution portal](https://microsoft.sharepoint.com/teams/SSPKDOWNLOAD/) is accessible to registered Interim licensees.

Interim and Final SSPK licensees can submit technical questions to [smoothpk@microsoft.com](mailto:smoothpk@microsoft.com).

##Microsoft Smooth Streaming Client Interim Product Agreement Licensees

- Adroit Business Solutions, Inc
- Advanced Digital Broadcast SA
- AirTies Kablosuz Iletism Sanayive Dis Ticaret A.S.
- Albis Technologies Ltd.
- Alticast Corporation
- Amazon Digital Services, Inc.
- AVC Multimedia Software Co., Ltd.
- EchoStar Purchasing Corporation
- Enseo, Inc.
- Fluendo S.A.
- HANDAN BroadInfoCom Co., Ltd.
- Infomir GMBH
- Irdeto USA Inc.
- Liberty Global Services BV
- MediaTek Inc.
- MStar Co, Ltd
- Nintendo Co., Ltd.
- OpenTV, Inc.
- Saffron Digital Limited
- Sichuan Changhong Electric Co., Ltd
- SoftAtHome
- Sony Corporation
- Tatung Technology Inc.
- Vestel Elektronik Sanayi ve Ticaret A.S.
- VisualOn, Inc.
- ZTE Corporation

##Microsoft Smooth Streaming Client Final Product Agreement Licensees

- Advanced Digital Broadcast SA
- AirTies Kablosuz Iletism Sanayive Dis Ticaret A.S.
- Albis Technologies Ltd.
- Amazon Digital Services, Inc.
- AmTRAN Technology Co., Ltd.
- Arcadyan Technology Corporation
- ATMACA ELEKTRONİK SAN. VE TİC. A.Ş
- British Sky Broadcasting Limited
- CastPal Technology Inc., Shenzhen
- Compal Electronics, Inc.
- Dongguan Digital AV Technology Corp., Ltd.
- EchoStar Purchasing Corporation
- Enseo, Inc.
- Filmflex Movies Limited
- Fluendo S.A.
- Gibson Innovations Limited
- HANDAN BroadInfoCom Co., Ltd.
- Hisense International Co., Ltd
- Homecast Co.,Ltd
- Hon Hai Precision Industry Co., Ltd.
- Infomir GMBH
- Kaonmedia Co., Ltd.
- KDDI Corporation
- Nintendo Co., Ltd.
- Orange SA
- Saffron Digital Limited
- Sagemcom Broadband SAS
- Shenzhen Coship Electronics CO., LTD
- Shenzhen Jiuzhou Electric Co.,Ltd
- Shenzhen Skyworth Digital Technology Co., Ltd
- Sichuan Changhong Electric Co., Ltd.
- Skardin Industrial Corp.
- Sky Deutschland Fernsehen GmbH & Co. KG
- SmarDTV S.A.
- SoftAtHome
- Sony Corporation
- TCL Overseas Marketing (Macao Commercial Offshore) Limited
- Technicolor Delivery Technologies, SAS
- Toshiba Lifestyle Products & Services Corporation
- Universal Media Corporation /Slovakia/ s.r.o.
- VIZIO, Inc.
- Wistron Corporation
- ZTE Corporation

##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]
