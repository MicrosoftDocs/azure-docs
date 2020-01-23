---
title: Troubleshooting guide for live streaming | Microsoft Docs
description: This article gives suggestions on how to troubleshoot Azure Media Services live streaming problems.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/20/2019
ms.author: juliako

---
# Troubleshooting guide for live streaming  

This article gives suggestions on how to troubleshoot some live streaming problems.

## Issues related to on-premises encoders
This section gives suggestions on how to troubleshoot problems related to on-premises encoders that are configured to send a single bitrate stream to AMS channels that are enabled for live encoding.

### Problem: Would like to see logs
* **Potential issue**: Can't find encoder logs that might help in debugging issues.
  
  * **Telestream Wirecast**: You can usually find logs under C:\Users\{username}\AppData\Roaming\Wirecast\ 
  * **Elemental Live**: You can find has links to logs on the management portal. Click on **Stats**, then **Logs**. On the **Log Files** page, you will see a list of logs for all the LiveEvent items; select the one matching your current session. 
  * **Flash Media Live Encoder**: You can find the **Log Directory...** by navigating to the **Encoding Log** tab.

### Problem: There is no option for outputting a progressive stream
* **Potential issue**: The encoder being used doesn't automatically deinterlace. 
  
    **Troubleshooting steps**: Look for a de-interlacing option within the encoder interface. Once de-interlacing is enabled, check again for progressive output settings. 

### Problem: Tried several encoder output settings and still unable to connect.
* **Potential issue**: Azure encoding channel was not properly reset. 
  
    **Troubleshooting steps**: Make sure the encoder is no longer pushing to AMS, stop and reset the channel. Once running again, try connecting your encoder with the new settings. If this still does not correct the issue, try creating a new channel entirely, sometimes channels can become corrupt after several failed attempts.  
* **Potential issue**: The GOP size or key frame settings are not optimal. 
  
    **Troubleshooting steps**: Recommended GOP size or keyframe interval is two seconds. Some encoders calculate this setting in number of frames, while others use seconds. For example: When outputting 30 fps, the GOP size would be 60 frames, which is equivalent to 2 seconds.  
* **Potential issue**: Closed ports are blocking the stream. 
  
    **Troubleshooting steps**: When streaming via RTMP, check firewall and/or proxy settings to confirm that outbound ports 1935 and 1936 are open. 

> [!NOTE]
> If after following the troubleshooting steps you still cannot successfully stream, submit a support ticket using the Azure portal.
> 
> 

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

