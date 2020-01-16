---
title: How to configure OpenSSL for Linux
titleSuffix: Azure Cognitive Services
description: Learn how to configure OpenSSL for Linux.
services: cognitive-services
author: jhakulin
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/15/2020
ms.author: jhakulin
---

# Configure OpenSSL for Linux

OpenSSL is dynamically configured to the host-system version when using any Speech SDK release version prior to 1.9.0.

Starting at the Speech SDK version 1.9.0 and onwards, OpenSSL (version 1.1.1b) is statically linked to the Speech SDK core library.

## Troubleshoot connectivity

In case of connection failures with 1.9.0 release, please check that OpenSSL `ssl/certs` directory exists in `/usr/lib` directory under the Linux system. If `ssl/certs` does not exist, please check where OpenSSL is installed in your system (using `which openssl` command), and locate openssl `certs`directory and copy the content of that directory into `/usr/lib/ssl/certs` directory.

## Next steps

> [!div class="nextstepaction"]
> [Check the general overview about the Speech SDK capabilities and supported platforms](speech-sdk.md)