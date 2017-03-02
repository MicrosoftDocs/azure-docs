---
title: Scale media processing by adding encoding units - Azure |  Microsoft Docs
description: Learn how to how to add encoding units with .NET
services: media-services
documentationcenter: ''
author: juliako
manager: erikre
editor: ''

ms.assetid: 33f7625a-966a-4f06-bc09-bccd6e2a42b5
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/23/2017
ms.author: juliako;milangada;

---
# How to scale encoding with .NET SDK
> [!div class="op_single_selector"]
> * [Portal](media-services-portal-scale-media-processing.md)
> * [.NET](media-services-dotnet-encoding-units.md)
> * [REST](https://docs.microsoft.com/rest/api/media/operations/encodingreservedunittype)
> * [Java](https://github.com/southworkscom/azure-sdk-for-media-services-java-samples)
> * [PHP](https://github.com/Azure/azure-sdk-for-php/tree/master/examples/MediaServices)
> 
> 

## Overview
> [!IMPORTANT]
> Make sure to review the [overview](media-services-scale-media-processing-overview.md) topic to get more information about scaling media processing topic.
> 
> 

To change the reserved unit type and the number of encoding reserved units using .NET SDK, do the following:

    IEncodingReservedUnit encodingS1ReservedUnit = _context.EncodingReservedUnits.FirstOrDefault();
    encodingS1ReservedUnit.ReservedUnitType = ReservedUnitType.Basic; // Corresponds to S1
    encodingS1ReservedUnit.Update();
    Console.WriteLine("Reserved Unit Type: {0}", encodingS1ReservedUnit.ReservedUnitType);

    encodingS1ReservedUnit.CurrentReservedUnits = 2;
    encodingS1ReservedUnit.Update();

    Console.WriteLine("Number of reserved units: {0}", encodingS1ReservedUnit.CurrentReservedUnits);

## Opening a Support Ticket
By default every Media Services account can scale to up to 25 Encoding and 5 On-Demand Streaming Reserved Units. You can request a higher limit by opening a support ticket.

### Open a support ticket
To open a support ticket do the following:

1. Click [Get Support](https://manage.windowsazure.com/?getsupport=true). If you are not logged in, you will be prompted to enter your credentials.
2. Select your subscription.
3. Under support type, select "Technical".
4. Click on "Create Ticket".
5. Select "Azure Media Services" in the product list presented on the next page.
6. Select a "Problem type" that is appropriate for your issue.
7. Click Continue.
8. Follow instructions on next page and then enter details about your issue.
9. Click submit to open the ticket.

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

