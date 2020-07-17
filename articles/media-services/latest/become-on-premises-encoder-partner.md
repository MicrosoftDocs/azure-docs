---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Become an on-premises encoder partner - Azure Media Services 
description: This article discusses how to verify your on-premises live streaming encoders.
services: media-services
author: johndeu
manager: johndeu
ms.author: johndeu
ms.date: 03/02/2020
ms.topic: article
# Use only one of the following. Use ms.service for services, ms.prod for on premises. Remove the # before the relevant field.
ms.service: media-services
# product-name-from-white-list

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
# manager: MSFT-alias-manager-or-PM-counterpart
---
 
# How to verify your on-premises live streaming encoder

As an Azure Media Services on-premises encoder partner, Media Services promotes your product by recommending your encoder to enterprise customers. To become an on-premises encoder partner, you must verify compatibility of your on-premises encoder with Media Services. To do so, complete the following verifications.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Pass-through Live Event verification

1. In your Media Services account, make sure that the **Streaming Endpoint** is running. 
2. Create and start the **pass-through** Live Event. <br/> For more information, see [Live Event states and billing](live-event-states-billing.md).
3. Get the ingest URLs and configure your on-premises encoder to use the URL to send a multi-bitrate live stream to Media Services.
4. Get the preview URL and use it to verify that the input from the encoder is actually being received.
5. Create a new **Asset** object.
6. Create a **Live Output** and use the asset name that you created.
7. Create a **Streaming Locator** with the built-in **Streaming Policy** types.
8. List the paths on the **Streaming Locator** to get back the URLs to use.
9. Get the host name for the **Streaming Endpoint** that you want to stream from.
10. Combine the URL from step 8 with the host name in step 9 to get the full URL.
11. Run your live encoder for approximately 10 minutes.
12. Stop the Live Event. 
13. Use a player such as [Azure Media Player](https://aka.ms/azuremediaplayer) to watch the archived asset to ensure that playback has no visible glitches at all quality levels. Or, watch and validate via the preview URL during the live session.
14. Record the asset ID, the published streaming URL for the live archive, and the settings and version used from your live encoder.
15. Reset the Live Event state after creating each sample.
16. Repeat steps 5 through 15 for all configurations supported by your encoder (with and without ad signaling, captions, or different encoding speeds).

## Live encoding Live Event verification

1. In your Media Services account, make sure that the **Streaming Endpoint** is running. 
2. Create and start the **live encoding** Live Event. <br/> For more information, see [Live Event states and billing](live-event-states-billing.md).
3. Get the ingest URLs and configure your encoder to push a single-bitrate live stream to Media Services.
4. Get the preview URL and use it to verify that the input from the encoder is actually being received.
5. Create a new **Asset** object.
6. Create a **Live Output** and use the asset name that you created.
7. Create a **Streaming Locator** with the built-in **Streaming Policy** types.
8. List the paths on the **Streaming Locator** to get back the URLs to use.
9. Get the host name for the **Streaming Endpoint** that you want to stream from.
10. Combine the URL from step 8 with the host name in step 9 to get the full URL.
11. Run your live encoder for approximately 10 minutes.
12. Stop the Live Event.
13. Use a player such as [Azure Media Player](https://aka.ms/azuremediaplayer) to watch the archived asset to ensure that playback has no visible glitches for all quality levels. Or, watch and validate via the preview URL during the live session.
14. Record the asset ID, the published streaming URL for the live archive, and the settings and version used from your live encoder.
15. Reset the Live Event state after creating each sample.
16. Repeat steps 5 through 15 for all configurations supported by your encoder (with and without ad signaling, captions, or different encoding speeds).

## Longevity verification

Follow the same steps as in [Pass-through Live Event verification](#pass-through-live-event-verification) except for step 11. <br/>Instead of 10 minutes, run your live encoder for one week or longer. Use a player such as [Azure Media Player](https://aka.ms/azuremediaplayer) to watch the live streaming from time to time (or an archived asset) to ensure that playback has no visible glitches.

## Email your recorded settings

Finally, email your recorded settings and live archive parameters to Azure Media Services at amshelp@microsoft.com as a notification that all self-verification checks have passed. Also, include your contact information for any follow-ups. You can contact the Azure Media Services team with any questions about this process.

## See also

[Tested on-premises encoders](recommended-on-premises-live-encoders.md)

## Next steps

[Live streaming with Media Services v3](live-streaming-overview.md)
