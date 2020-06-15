---
title: Azure Media Player Protected Content
description: Azure Media Player currently supports AES-128 bit envelope encrypted content and common encrypted content.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: overview
ms.date: 04/20/2020
---

# Protected content #

Azure Media Player currently supports AES-128 bit envelope encrypted content and common encrypted content (through PlayReady and Widevine)  or encrypted content via FairPlay. In order to playback protected content correctly, you must tell Azure Media Player the `protectionInfo`. This information exists per source and can be added directly on the `<source>` tag via the `data-setup`.  You can also add the `protectionInfo` directly as a parameter if setting the source dynamically.

`protectionInfo` accepts a JSON object and includes:

- `type`: `AES` or `PlayReady` or `Widevine` or `FairPlay`
- `certificateUrl`: this should be a direct link to your hosted FairPlay cert

- `authenticationToken`: this is an option field to add an unencoded authentication token

> [!IMPORTANT]
> The **certificateUrl** object is only needed for FairPlay DRM.***
>[!NOTE]
> The default techOrder has been changed to accommodate the new tech- `html5FairPlayHLS` specifically to playback FairPlay content natively on browsers that support it (Safari on OSX 8+). If you have FairPlay content to playback **AND** you've changed the default techOrder to a custom one in your application, you will need to add this new tech into your techOrder object. We recommend you include it before silverlightSS so your content doesn't playback via PlayReady.

## Code sample ##

```html
Ex:

    <video id="vid1" class="azuremediaplayer amp-default-skin">
        <source
            src="//example/path/to/myVideo.ism/manifest"
            type="application/vnd.ms-sstr+xml"
            data-setup='{"protectionInfo": [{"type": "AES", "authenticationToken": "Bearer=urn%3amicrosoft%3aazure%3amediaservices%3acontentkeyidentifier=8130520b-c116-45a9-824e-4a0082f3cb3c&Audience=urn%3atest&ExpiresOn=1450207516&Issuer=http%3a%2f%2ftestacs.com%2f&HMACSHA256=eV7HDgZ9msp9H9bnEPGN91sBdU7XsZ9OyB6VgFhKBAU%3d"}]}'
        />
    </video>
or

```javascript
    var myPlayer = amp("vid1", /* Options */);
    myPlayer.src([{
        src: "//example/path/to/myVideo.ism/manifest",
        type: "application/vnd.ms-sstr+xml",
        protectionInfo: [{
            type: "PlayReady",
            authenticationToken: "Bearer=urn%3amicrosoft%3aazure%3amediaservices%3acontentkeyidentifier=d5646e95-63ee-4fbe-ba4e-295c8d9502e0&Audience=urn%3atest&ExpiresOn=1450222961&Issuer=http%3a%2f%2ftestacs.com%2f&HMACSHA256=4Jop3kNJdzVI8L5IZLgFtPdImyE%2fHTRil0x%2bEikSdPs%3d"
        }] }, ]
    );
```

or, with multiple DRM

```javascript
    var myPlayer = amp("vid1", /* Options */);
    myPlayer.src([{
        src: "//example/path/to/myVideo.ism/manifest",
        type: "application/vnd.ms-sstr+xml",
        protectionInfo: [{
                type: "PlayReady",
                authenticationToken: "Bearer=urn%3amicrosoft%3aazure%3amediaservices%3acontentkeyidentifier=d5646e95-63ee-4fbe-ba4e-295c8d9502e0&Audience=urn%3atest&ExpiresOn=1450222961&Issuer=http%3a%2f%2ftestacs.com%2f&HMACSHA256=4Jop3kNJdzVI8L5IZLgFtPdImyE%2fHTRil0x%2bEikSdPs%3d"
            },
            {
                type: "Widevine",
                authenticationToken: "Bearer=urn%3amicrosoft%3aazure%3amediaservices%3acontentkeyidentifier=d5646e95-63ee-4fbe-ba4e-295c8d9502e0&Audience=urn%3atest&ExpiresOn=1450222961&Issuer=http%3a%2f%2ftestacs.com%2f&HMACSHA256=4Jop3kNJdzVI8L5IZLgFtPdImyE%2fHTRil0x%2bEikSdPs%3d"
            },
            {
                   type: "FairPlay",
                  certificateUrl: "//example/path/to/myFairplay.der",
                   authenticationToken: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cm46bWljcm9zb2Z0OmF6dXJlOm1lZGlhc2VydmljZXM6Y29udGVudGtleWlkZW50aWZpZXIiOiIyMTI0M2Q2OC00Yjc4LTRlNzUtYTU5MS1jZWMzMDI0NDNhYWMiLCJpc3MiOiJodHRwOi8vY29udG9zbyIsImF1ZCI6InVybjp0ZXN0IiwiZXhwIjoxNDc0NTkyNDYzLCJuYmYiOjE0NzQ1ODg1NjN9.mE7UxgNhkieMMqtM_IiYQj-FK1KKIzB6lAptw4Mi67A"
        }] } ]
    );
```

> [!NOTE]
> Not all browsers/platforms are capable of playing back protected content. See the [Playback Technology](azure-media-player-playback-technology.md) section for more information on what is supported.
> [!IMPORTANT]
> The token passed into the player is meant for secured content and only used for authenticated users. It is assumed that the application is using SSL or some other form of security measure. Also, the end user is assummed to be trusted to not misuse the token; if that is not the case, please involve your security experts.

## Next steps ##

- [Azure Media Player Quickstart](azure-media-player-quickstart.md)