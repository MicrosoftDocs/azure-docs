---
title: include file
description: include file
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: include
ms.date: 05/14/2019
ms.author: danlep
ms.custom: include file
---

| Resource | Basic | Standard | Premium |
|---|---|---|---|
| Storage<sup>1</sup> | 10 GiB | 100 GiB| 500 GiB |
| Maximum image layer size | 200 GiB | 200 GiB | 200 GiB |
| ReadOps per minute<sup>2, 3</sup> | 1,000 | 3,000 | 10,000 |
| WriteOps per minute<sup>2, 4</sup> | 100 | 500 | 2,000 |
| Download bandwidth MBps<sup>2</sup> | 30 | 60 | 100 |
| Upload bandwidth MBps<sup>2</sup> | 10 | 20 | 50 |
| Webhooks | 2 | 10 | 100 |
| Geo-replication | N/A | N/A | [Supported][geo-replication] |
| Content trust | N/A | N/A | [Supported][content-trust] |

<sup>1</sup>The specified storage limits are the amount of *included* storage for each tier. You're charged an additional daily rate per GiB for image storage above these limits. For rate information, see [Azure Container Registry pricing][pricing].

<sup>2</sup>*ReadOps*, *WriteOps*, and *Bandwidth* are minimum estimates. Azure Container Registry strives to improve performance as usage requires.

<sup>3</sup>A [docker pull](https://docs.docker.com/registry/spec/api/#pulling-an-image) translates to multiple read operations based on the number of layers in the image, plus the manifest retrieval.

<sup>4</sup>A [docker push](https://docs.docker.com/registry/spec/api/#pushing-an-image) translates to multiple write operations, based on the number of layers that must be pushed. A `docker push` includes *ReadOps* to retrieve a manifest for an existing image.

<!-- LINKS - External -->
[pricing]: https://azure.microsoft.com/pricing/details/container-registry/

<!-- LINKS - Internal -->
[geo-replication]: ../articles/container-registry/container-registry-geo-replication.md
[content-trust]: ../articles/container-registry/container-registry-content-trust.md
