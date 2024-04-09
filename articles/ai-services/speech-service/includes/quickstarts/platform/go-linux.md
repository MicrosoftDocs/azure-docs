---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 02/02/2024
ms.author: eur
---

## Platform requirements

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

The Speech SDK for Go supports the following distributions on the x64 architecture:

- Ubuntu 18.04/20.04
- Debian 9/10/11
- Red Hat Enterprise Linux (RHEL) 8
- CentOS 7

[!INCLUDE [Linux distributions](linux-distributions.md)]

Install the [Go binary version 1.13 or later](https://go.dev/dl/).

## Install the Speech SDK for Go

[!INCLUDE [linux-install-sdk](linux-install-sdk.md)]

### Configure the Go environment

The following steps enable your Go environment to find the Speech SDK.

1. Because the bindings rely on `cgo`, you need to set the environment variables so Go can find the SDK.

   ```console
   export CGO_CFLAGS="-I$SPEECHSDK_ROOT/include/c_api"
   export CGO_LDFLAGS="-L$SPEECHSDK_ROOT/lib/<architecture> -lMicrosoft.CognitiveServices.Speech.core"
   ```

   > [!IMPORTANT]
   > Replace `<architecture>` with the processor architecture of your CPU: `x86`, `x64`, `arm32`, or `arm64`.

1. To run applications and the SDK, you need to tell the operating system where to find the libraries.

   ```console
   export LD_LIBRARY_PATH="$SPEECHSDK_ROOT/lib/<architecture>:$LD_LIBRARY_PATH"
   ```

   > [!IMPORTANT]
   > Replace `<architecture>` with the processor architecture of your CPU: `x86`, `x64`, `arm32`, or `arm64`.
