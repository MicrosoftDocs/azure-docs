---
title: include file
description: include file
services: container-registry
ms.service: container-registry
ms.topic: include
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
ms.custom: include file
---

| Resource | Basic | Standard | Premium |
|---|---|---|---|
| Included storage<sup>1</sup> (GiB) | 10 | 100 | 500 |
| Storage limit (TiB) | 20| 20 | 20 |
| Maximum image layer size (GiB) | 200 | 200 | 200 |
| Maximum manifest size (MiB) | 4 | 4 | 4 |
| ReadOps per minute<sup>2, 3</sup> | 1,000 | 3,000 | 10,000 |
| WriteOps per minute<sup>2, 4</sup> | 100 | 500 | 2,000 |
| Download bandwidth<sup>2</sup> (Mbps) | 30 | 60 | 100 |
| Upload bandwidth <sup>2</sup> (Mbps) | 10 | 20 | 50 |
| Webhooks | 2 | 10 | 500 |
| Geo-replication | N/A | N/A | [Supported][geo-replication] |
| Availability zones | N/A | N/A | [Supported][zones] |
| Content trust | N/A | N/A | [Supported][content-trust] |
| Private link with private endpoints | N/A | N/A | [Supported][plink] |
| &bull; Private endpoints | N/A | N/A | 200 |
| Public IP network rules | N/A | N/A | 100 |
| Service endpoint VNet access | N/A | N/A | [Preview][vnet] |
| &bull; Virtual network rules | N/A | N/A | 100 |
| Customer-managed keys | N/A | N/A | [Supported][cmk] |
| Repository-scoped permissions | [Supported][token] | [Supported][token] | [Supported][token]|
| &bull; Tokens | 100 | 500 | 50,000 |
| &bull; Scope maps | 100 | 500 | 50,000 |
| &bull; Actions| 500 | 500 | 500 |
| &bull; Repositories per scope map<sup>5</sup> | 500 | 500 | 500 |
| Anonymous pull access | N/A | [Preview][anonymous-pull-access] | [Preview][anonymous-pull-access] |


<sup>1</sup> Storage included in the daily rate for each tier. Additional storage may be used, up to the registry storage limit, at an additional daily rate per GiB. For rate information, see [Azure Container Registry pricing][pricing]. If you need storage beyond the registry storage limit, please contact Azure Support.

<sup>2</sup>*ReadOps*, *WriteOps*, and *Bandwidth* are minimum estimates. Azure Container Registry strives to improve performance as usage requires. Both resources, ACR, and the device must be in the same region to achieve a fast download speed.

<sup>3</sup>A [docker pull](https://docs.docker.com/registry/spec/api/#pulling-an-image) translates to multiple read operations based on the number of layers in the image, plus the manifest retrieval.

<sup>4</sup>A [docker push](https://docs.docker.com/registry/spec/api/#pushing-an-image) translates to multiple write operations, based on the number of layers that must be pushed. A `docker push` includes *ReadOps* to retrieve a manifest for an existing image.

<sup>5</sup> Individual *actions* of `content/delete`, `content/read`, `content/write`, `metadata/read`, `metadata/write` corresponds to the limit of Repositories per scope map. 

<!-- LINKS - External -->
[pricing]: https://azure.microsoft.com/pricing/details/container-registry/

<!-- LINKS - Internal -->
[geo-replication]: ../articles/container-registry/container-registry-geo-replication.md
[content-trust]: ../articles/container-registry/container-registry-content-trust.md
[vnet]: ../articles/container-registry/container-registry-vnet.md
[plink]: ../articles/container-registry/container-registry-private-link.md
[cmk]: ../articles/container-registry/tutorial-enable-customer-managed-keys.md
[token]: ../articles/container-registry/container-registry-repository-scoped-permissions.md
[zones]: ../articles/container-registry/zone-redundancy.md
[anonymous-pull-access]: ../articles/container-registry/anonymous-pull-access.md
