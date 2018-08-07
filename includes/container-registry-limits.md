---
title: include file
description: include file
services: container-registry
author: mmacy

ms.service: container-registry
ms.topic: include
ms.date: 05/29/2018
ms.author: marsma
ms.custom: include file
---

| Resource | Basic | Standard | Premium |
|---|---|---|---|---|
| Storage | 10 GiB | 100 GiB| 500 GiB |
| Max image layer size | 20 GiB | 20 GiB | 50 GiB |
| ReadOps per minute<sup>1, 2</sup> | 1,000 | 3,000 | 10,000 |
| WriteOps per minute<sup>1, 3</sup> | 100 | 500 | 2,000 |
| Download bandwidth MBps<sup>1</sup> | 30 | 60 | 100 |
| Upload bandwidth MBps<sup>1</sup> | 10 | 20 | 50 |
| Webhooks | 2 | 10 | 100 |
| Geo-replication | N/A | N/A | [Supported](https://docs.microsoft.com/azure/container-registry/container-registry-geo-replication) |

<sup>1</sup> *ReadOps*, *WriteOps*, and *Bandwidth* are minimum estimates. ACR strives to improve performance as usage requires.

<sup>2</sup> [docker pull](https://docs.docker.com/registry/spec/api/#pulling-an-image) translates to multiple read operations based on the number of layers in the image, plus the manifest retrieval.

<sup>3</sup> [docker push](https://docs.docker.com/registry/spec/api/#pushing-an-image) translates to multiple write operations, based on the number of layers that must be pushed. A `docker push` includes *ReadOps* to retrieve a manifest for an existing image.
