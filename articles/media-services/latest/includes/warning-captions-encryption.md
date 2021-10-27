---
author: johndeu
ms.service: media-services 
ms.topic: include
ms.date: 10/09/21
ms.author: johndeu
ms.custom: concept, captions, encryption
---

## Security considerations for closed captions, subtitles, and timed-metadata delivery

The dynamic encryption and DRM features of Azure Media Services has limits to consider when attempting to secure content delivery that includes live transcriptions, captions, subtitles, or timed-metadata.
The DRM subsystems, including PlayReady, FairPlay, and Widevine do not support the encryption and licensing of text tracks.  The lack of DRM encryption for text tracks limits your ability to secure the contents of live transcriptions, manual inserted captions, uploaded subtitles, or timed-metadata signals that may be inserted as separate tracks.

To secure your captions, subtitles, or timed-metadata tracks, it is recommended to follow one of the guidelines:

1. Use AES-128 Clear Key encryption.  When enabling AES-128 clear key encryption, the text tracks can be configured to be encrypted using a full "envelope" encryption technique that follows the same encryption pattern as the audio and video segments. These segments can then be decrypted by a client application after requesting the decryption key from the Media Services Key Delivery service using an authenticated JWT token.  This method is supported by the Azure Media Player, but may not be supported on all devices and can require some client-side development work to make sure it succeeds on all platforms.
1. Use CDN token authentication to protect the text (subtitle, captions, metadata) tracks being delivered with short form tokenized URLs that are restricted to geo, IP, or other configurable settings in the CDN portal.  Enable the CDN security features using Verizon Premium CDN or other 3rd-party CDN configured to connect to your Media Services streaming endpoints.

> [!WARNING]
> If you do not follow one of the guidelines above, your subtitles, captions, or timed-metadata text will be accessible as un-encrypted content that could be intercepted or shared outside of your intended client delivery path. 
> This can result in leaked information. If you are concerned about the contents of the captions or subtitles being leaked in a secure delivery scenario, reach out to the Media Services support team for more information on the above guidelines for securing your content delivery.