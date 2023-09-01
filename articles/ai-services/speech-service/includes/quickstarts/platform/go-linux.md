---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/14/2022
ms.author: eur
---

## Platform requirements

The Speech SDK for Go only supports **Ubuntu 18.04/20.04/22.04**, **Debian 10/11**, **Red Hat Enterprise Linux (RHEL) 8**, and **CentOS 8** on the x64 architecture when used with Linux.

[!INCLUDE [Linux distributions](linux-distributions.md)]

You must install the [Go binary version 1.13 or later](https://go.dev/dl/).

## Install the Speech SDK for Go

[!INCLUDE [linux-install-sdk](linux-install-sdk.md)]

### Configure the Go environment

The following steps enable your Go environment to find the Speech SDK. In both steps, replace `<architecture>` with the processor architecture of your CPU. This will be `x86`, `x64`, `arm32`, or `arm64`.

1. Because the bindings rely on `cgo`, you need to set the environment variables so Go can find the SDK. 

   ```sh
   export CGO_CFLAGS="-I$SPEECHSDK_ROOT/include/c_api"
   export CGO_LDFLAGS="-L$SPEECHSDK_ROOT/lib/<architecture> -lMicrosoft.CognitiveServices.Speech.core"
   ```

1. To run applications and the SDK, you need to tell the operating system where to find the libraries. 

   ```sh
   export LD_LIBRARY_PATH="$SPEECHSDK_ROOT/lib/<architecture>:$LD_LIBRARY_PATH"
   ```
