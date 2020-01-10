---
title: How to configure OpenSSL for Linux
titleSuffix: Azure Cognitive Services
description: Learn about how to configure OpenSSL for Linux.
services: cognitive-services
author: jhakulin
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/10/2020
ms.author: jhakulin
---

## OpenSSL configuration for Linux

In the Speech SDK release versions before 1.9.0, OpenSSL is dynamically configured and the version which is installed in the system will be used.

In the Speech SDK release version 1.9.0 and onwards, OpenSSL (version 1.1.1b) is statically linked to the Speech SDK core library.

In case of connection failures occurs with 1.9.0 release, please check that OpenSSL `ssl/certs` directory exists in `/usr/lib` directory under the Linux system. If `ssl/certs` does not exist, please check where OpenSSL is installed in your system (using `which openssl` command), and locate openssl `certs`directory and copy the content of that directory into `/usr/lib/ssl/certs` directory.

## Next steps

> [!div class="nextstepaction"]
> [Explore our samples on GitHub](https://aka.ms/csspeech/samples)
