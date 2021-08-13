---
title: Licensing Microsoft&reg; Smooth Streaming Client Porting Kit
description: Learn about how to licensing the Microsoft&reg; Smooth Streaming Client Porting Kit.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''
ms.assetid: e3b488e7-8428-4c10-a072-eb3af46c82ad
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 3/10/2021
ms.author: xpouyat
---
# Licensing Microsoft&reg; Smooth Streaming Client Porting Kit

[!INCLUDE [media services api v2 logo](./includes/v2-hr.md)]
 
## Overview
Microsoft Smooth Streaming Client Porting Kit (**SSPK** for short) is a Smooth Streaming client implementation that is optimized to help embedded device manufacturers, cable and mobile operators, content service providers, handset manufacturers, independent software vendors (ISVs), and solution providers to create products and services for streaming adaptive content in Smooth Streaming format. SSPK is a device and platform-independent implementation of Smooth Streaming client that can be ported by the licensee to any device and platform. 

Included below is a high-level architecture and IIS Smooth Streaming Porting Kit box is the Smooth Streaming Client implementation provided by Microsoft and includes all the core logic for playback of Smooth Streaming content. This content is then ported by partners for a specific device or platform by implementing appropriate interfaces. 

![SSPK](./media/media-services-sspk/sspk-arch.png)

## Description
SSPK is licensed on terms that offer excellent business value. SSPK license provides the industry with:

* Smooth Streaming Porting Kit source in C++ 
  * implements Smooth Streaming Client functionality
  * adds format parsing, heuristics, buffering logic, etc.
* Player application APIs 
  * programming interfaces for interaction with a media player application
* Platform Abstraction Layer (PAL) Interface 
  * programming interfaces for interaction with the operating system (threads, sockets)
* Hardware Abstraction Layer (HAL) Interface 
  * programming interfaces for interaction with hardware A/V decoders (decoding, rendering)
* Digital Rights Management (DRM) Interface 
  * programming interfaces for handling DRM through the DRM Abstraction Layer (DAL)
  * Microsoft PlayReady Porting Kit ships separately but integrates through this interface. [See more details on Microsoft PlayReady Device licensing](https://www.microsoft.com/playready/licensing/device_technology.mspx#pddipdl).
* Implementation samples 
  * sample PAL implementation for Linux
  * sample HAL implementation for GStreamer

## Licensing Options
Microsoft Smooth Streaming Client Porting Kit is made available to licensees under two distinct license agreements: one for developing Smooth Streaming Client Interim Products and another for distributing Smooth Streaming Client Final Products to end users.

* For chipset manufacturers, system integrators, or independent software vendors (ISVs) who require a source code porting kit to develop Interim Products, a Microsoft Smooth Streaming Client Porting Kit **Interim Product License** should be executed.
* For device manufacturers or ISVs who require distribution rights for Smooth Streaming Client Final Products to end users, the Microsoft Smooth Streaming Client Porting Kit **Final Product License** should be executed.

### Microsoft Smooth Streaming Client Porting Kit Interim Product License
Under this license, Microsoft offers a Smooth Streaming Client Porting Kit and the necessary intellectual property rights to develop and distribute Smooth Streaming Client Interim Products to other Smooth Streaming Client Porting Kit device licensees that distribute Smooth Streaming Client Final Products.

#### Fee structure
A U.S. $50,000 one-time license fee provides access to the Smooth Streaming Client Porting Kit. 

### Microsoft Smooth Streaming Client Porting Kit Final Product License
Under this license, Microsoft offers all necessary intellectual property rights to receive Smooth Streaming Client Interim Products from other Smooth Streaming Client Porting Kit licensees and to distribute company-branded Smooth Streaming Client Final Products to end users.

#### Fee structure
The Smooth Streaming Client Final Product is offered under a royalty model as under:

* $0.10 per device implementation shipped
* The royalty is capped at $50,000 each year
* No royalty for first 10,000 device implementations each year 

## Licensing Procedure and SSPK access
Email [sspkinfo@microsoft.com](mailto:sspkinfo@microsoft.com) for all licensing queries.

The SSPK Distribution portal is accessible to registered Interim licensees.

Interim and Final SSPK licensees can submit technical questions to [smoothpk@microsoft.com](mailto:smoothpk@microsoft.com).

## Microsoft Smooth Streaming Client Interim Product Agreement Licensees
* Enseo, Inc.
* Fluendo S.A.
* Guangzhou Dimai Digital Limited Co.
* Guangzhou Shikun Electronics., Ltd.
* Hisilicon Technologies Co., Ltd.
* LG Electronics, Inc.
* MediaTek Inc.
* Montage LZ Technologies Hong Kong Limited
* Panasonic Corporation
* Synamedia Limited
* Tatung Technology Inc.
* Top Victory Investments, Ltd.
* ZTE Corporation

## Microsoft Smooth Streaming Client Final Product Agreement Licensees
* Advanced Digital Broadcast SA
* AmTRAN Technology Co., Ltd 
* Arcadyan Technology Corporation
* Arcelik A.S
* Compal Electronics, Inc.
* Enseo, LLC
* EXPRESS LUCK TECHNOLOGY LIMITED
* FAIRWIT HONGKONG CO., LIMITED
* Fluendo S.A.
* FUNAI ELECTRIC CO., LTD
* Hisense Broadband Multimedia Technologies Co.,Ltd.
* Hisense International Co., Ltd.
* Hisense Visual Technology Co., Ltd
* HKC Corporation Limited
* Hong Kong Konka Ltd
* Jinpin Electrical Company Ltd.Zhuhai.S.E.Z
* KAONMEDIA CO., Ltd.
* KDDI Corporation
* K-Tronics (Suzhou) Technology Co., Ltd.
* LG Electronics, Inc.
* Liberty Global Technology Services BV
* Mega Fame Electronics Co. Limited
* MINGCAI NEW CENTURY (HK) CO., LIMITED
* MIRC Electronics Limited
* MOKA INTERNATIONAL LIMITED
* ONEPLUS ELECTRONICS (SHENZHEN) CO., LTD.
* Panasonic Corporation
* Qingdao Haier Optronics Co., Ltd.
* Sharp Consumer Electronics Poland Sp. z o.o.
* Shenzhen ATEKO PHOTO Electricity Co.,Ltd.
* Shenzhen Chuangwei-RGB Electronics Co.,Ltd.
* Shenzhen Jiuzhou Electric Co., Ltd
* Shenzhen KTC Technology Co., Ltd. 
* Shenzhen Maxmade Technology Co., Ltd
* Shenzhen MTC Co., Ltd
* Shenzhen Skyworth Digital Technology Co., Ltd
* Sichuan Changhong Electric Co., Ltd.
* SKARDIN INDUSTRIAL CORP
* Sky CP Ltd
* SMARDTV GLOBAL SAS
* Sony Corporation
* SoftAtHome
* Technicolor Delivery Technologies, SAS
* Top Victory Investments, Ltd.
* Vizio, Inc.
* Walton Hi-Tech Industries Ltd.
* ZTE CORPORATION

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

