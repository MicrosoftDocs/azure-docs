---
title: Azure Media Player error codes
description: An error code reference for Azure Media Player.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: error-reference
ms.date: 04/20/2020
---

# Error codes #

When playback can't start or has stopped, an error event will be fired and the `error()` function will return a code and an optional message to help the app developer get more details. `error().message` isn't the message displayed to the user.  The message displayed to the user is based on `error().code` bits 27-20, see table below.

```javascript

    var myPlayer = amp('vid1');
    myPlayer.addEventListener('error', function() {
        var errorDetails = myPlayer.error();
        var code = errorDetails.code;
        var message = errorDetails.message;
    }
```

## Error codes, bits [31-28] (4 bits) ##

Describe the area of the error.

- 0 - Unknown
- 1 - AMP
- 2 - AzureHtml5JS
- 3 - FlashSS
- 4 - SilverlightSS
- 5 - Html5
- 6 - Html5FairPlayHLS

## Error codes, bits [27-0] (28 bits) ##

Describe details of the error, bits 27-20 provide a high level, bits 19-0 provide more detail if available.


| amp.errorCode.[name] | Codes, Bits [27-0] (28 bits) | Description |
|---|---:|---|
| **MEDIA_ERR_ABORTED errors range (0x0100000 - 0x01FFFFF)** | | |
| abortedErrUnknown | 0x0100000 | Generic abort error |
| abortedErrNotImplemented | 0x0100001 | Abort error, not implemented |
| abortedErrHttpMixedContentBlocked | 0x0100002 | Abort error, mixed content blocked - generally occurs when loading an `http://` stream from an `https://` page |
| **MEDIA_ERR_NETWORK errors start value (0x0200000 - 0x02FFFFF)** | | |
| networkErrUnknown | 0x0200000 | Generic network error |
| networkErrHttpBadUrlFormat | 0x0200190 | Http 400 error response |
| networkErrHttpUserAuthRequired | 0x0200191 | Http 401 error response |
| networkErrHttpUserForbidden | 0x0200193 | Http 403 error response |
| networkErrHttpUrlNotFound | 0x0200194 | Http 404 error response |
| networkErrHttpNotAllowed | 0x0200195 | Http 405 error response |
| networkErrHttpGone | 0x020019A | Http 410 error response |
| networkErrHttpPreconditionFailed | 0x020019C | Http 412 error response |
| networkErrHttpInternalServerFailure | 0x02001F4 | Http 500 error response
| networkErrHttpBadGateway | 0x02001F6 | Http 502 error response |
| networkErrHttpServiceUnavailable | 0x02001F7 | Http 503 error response |
| networkErrHttpGatewayTimeout | 0x02001F8 | Http 504 error response |
| networkErrTimeout | 0x0200258 | Network timeout error
| networkErrErr | 0x0200259 | Network connection error response |
| **MEDIA_ERR_DECODE errors (0x0300000 - 0x03FFFFF)** | | |
| decodeErrUnknown | 0x0300000 | Generic decode error |
| **MEDIA_ERR_SRC_NOT_SUPPORTED errors (0x0400000 - 0x04FFFFF)** | | |
| srcErrUnknown | 0x0400000 | Generic source not supported error |
| srcErrParsePresentation | 0x0400001 | Presentation parse error |
| srcErrParseSegment | 0x0400002 | Segment parse error |
| srcErrUnsupportedPresentation | 0x0400003 | Presentation not supported |
| srcErrInvalidSegment | 0x0400004 | Invalid segment |
| **MEDIA_ERR_ENCRYPTED errors start value(0x0500000 - 0x05FFFFF)** | | |
| encryptErrUnknown | 0x0500000 | Generic encrypted error | 
| encryptErrDecrypterNotFound | 0x0500001 | Decrypter not found |
| encryptErrDecrypterInit | 0x0500002 | Decrypter initialization error |
| encryptErrDecrypterNotSupported | 0x0500003 | Decrypter not supported |
| encryptErrKeyAcquire | 0x0500004 | Key acquire failed |
| encryptErrDecryption | 0x0500005 | Decryption of segment failed |
| encryptErrLicenseAcquire | 0x0500006 | License acquire failed |
| **SRC_PLAYER_MISMATCH errors start value(0x0600000 - 0x06FFFFF)** | | |
| srcPlayerMismatchUnknown | 0x0600000 | Generic no matching tech player to play the source |
| srcPlayerMismatchFlashNotInstalled | 0x0600001 |Flash plugin isn't installed, if installed the source may play. *OR* Flash 30 is installed and playing back AES content.  If this is the case, please try a different browser. Flash 30 is unsupported today as of June 7th. See [known issues](azure-media-player-known-issues.md) for more details. Note: If 0x00600003, both Flash and Silverlight are not installed, if specified in the techOrder.|
| srcPlayerMismatchSilverlightNotInstalled | 0x0600002 | Silverlight plugin is not installed, if installed the source may play. Note: If 0x00600003, both Flash and Silverlight are not installed, if specified in the techOrder. |
| | 0x00600003 | Both Flash and Silverlight are not installed, if specified in the techOrder. |
| **Unknown errors (0x0FF00000)** | | |
| errUnknown | 0xFF00000 | Unknown errors |

## User error messages ##

User message displayed is based on error code's bits 27-20.

- MEDIA_ERR_ABORTED (1) -"You aborted the video playback"
- MEDIA_ERR_NETWORK (2) - "A network error caused the video download to fail part-way."
- MEDIA_ERR_DECODE (3) - "The video playback was aborted due to a corruption problem or because the video used features your browser did not support."
- MEDIA_ERR_SRC_NOT_SUPPORTED (4)-"The video could not be loaded, either because the server or network failed or because the format is not supported."
- MEDIA_ERR_ENCRYPTED (5) - "The video is encrypted and we do not have the keys to decrypt it."
- SRC_PLAYER_MISMATCH (6) - "No compatible source was found for this video."
- MEDIA_ERR_UNKNOWN (0xFF) - "An unknown error occurred."

## Examples ##

### 0x10600001 ##

"No compatible source was found for this video." is displayed to the end user.

There is no tech player that can play the requested sources, but if Flash plugin is installed, it is likely that a source could be played.  

### 0x20200194 ###

"A network error caused the video download to fail part-way." is displayed to the end user.

AzureHtml5JS failed to playback from an http 404 response.

### Categorizing errors ###

```javascript
    if(myPlayer.error().code & amp.errorCode.abortedErrStart) {
        // MEDIA_ERR_ABORTED errors
    }
    else if(myPlayer.error().code & amp.errorCode.networkErrStart) {
        // MEDIA_ERR_NETWORK errors
    }
    else if(myPlayer.error().code & amp.errorCode.decodeErrStart) {
        // MEDIA_ERR_DECODE errors
    }
    else if(myPlayer.error().code & amp.errorCode.srcErrStart) {
        // MEDIA_ERR_SRC_NOT_SUPPORTED errors
    }
    else if(myPlayer.error().code & amp.errorCode.encryptErrStart) {
        // MEDIA_ERR_ENCRYPTED errors
    }
    else if(myPlayer.error().code & amp.errorCode.srcPlayerMismatchStart) {
        // SRC_PLAYER_MISMATCH errors
    }
    else {
        // unknown errors
    }
```

### Catching a specific error ###

The following code catches just 404 errors:

```javascript
    if(myPlayer.error().code & amp.errorCode.networkErrHttpUrlNotFound) {
        // all http 404 errors
    }
```

## Next steps ##

- [Azure Media Player Quickstart](azure-media-player-quickstart.md)