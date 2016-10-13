<properties
	pageTitle=" Scale Media Processing using the Azure portal | Microsoft Azure"
	description="This tutorial walks you through the steps of scaling Media Processing using the Azure portal."
	services="media-services"
	documentationCenter=""
	authors="Juliako"
	manager="erikre"
	editor=""/>

<tags
	ms.service="media-services"
	ms.workload="media"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/01/2016"
	ms.author="juliako"/>

# Change the reserved unit type

> [AZURE.SELECTOR]
- [.NET](media-services-dotnet-encoding-units.md)
- [Portal](media-services-portal-scale-media-processing.md)
- [REST](https://msdn.microsoft.com/library/azure/dn859236.aspx)
- [Java](https://github.com/southworkscom/azure-sdk-for-media-services-java-samples)
- [PHP](https://github.com/Azure/azure-sdk-for-php/tree/master/examples/MediaServices)

## Overview

>[AZURE.IMPORTANT] Make sure to review the [overview](media-services-scale-media-processing-overview.md) topic to get more information about scaling media processing topic.

## Scale media processing

To change the reserved unit type and the number of reserved units, do the following:

1. Log in at the [Azure portal](https://portal.azure.com/).

2. In the **Settings** window, select **Media reserved units**.

	To change the number of reserved units for the selected reserved unit type, use the **Media Served Units** slider.

	To change the **RESERVED UNIT TYPE**, press S1, S2, or S3.

	![Processors page](./media/media-services-portal-scale-media-processing/media-services-scale-media-processing.png)

3. Press the SAVE button to save your changes.

	The new reserved units are allocated when you press SAVE.

##Next steps

Review Media Services learning paths.

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]


