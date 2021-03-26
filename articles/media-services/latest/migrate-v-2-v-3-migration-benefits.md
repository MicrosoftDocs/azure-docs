---
title: The benefits of migrating to Media Services API V3
description: This article lists the benefits of migrating from Media Services v2 to v3.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: conceptual
ms.workload: media
ms.date: 03/25/2021
ms.author: inhenkel
---

# Step 1 - Understand the benefits of migrating to Media Services API V3

![migration guide logo](./media/migration-guide/azure-media-services-logo-migration-guide.svg)

<hr color="#5ea0ef" size="10">

![migration steps 2](./media/migration-guide/steps-1.svg)

## Use the latest API

We encourage you to start using version 2020-05-01 of the Azure Media Services V3 API now to gain the benefits because new features, functionality, and performance optimizations are only available in the current V3 API.

You can change the API version in the portal, latest SDKs, latest CLI, and REST API with the correct version string.

There have been significant improvements to Media Services with V3.  

## Benefits of Media Services v3

| **V3 feature** | **Benefit** |
| --- | --- |
| **Azure portal** | |
| Azure portal updates | The Azure portal has been updated to include the management of V3 API entities. It allows customers to use the portal to start live streaming, submit V3 transform jobs, manage content protection policies, streaming endpoints, get API access, manage linked storage accounts, and perform monitoring tasks. |
| **Accounts and Storage** | |
| Azure role-based access control (RBAC) | Customers can now define their own roles and control access to each entity in the Media Services ARM API. This helps control access to resources by AAD accounts. |
| Managed Identities | Managed identities eliminate the need for developers to manage credentials by providing an identity for the Azure resource in Azure AD. See details on managed identities [here](../../active-directory/managed-identities-azure-resources/overview.md). |
| Private link support | Customers will access Media Services endpoints for Key Delivery, LiveEvents, and StreamingEndpoints via a PrivateEndpoint on their VNet. |
| [Customer-manged keys](concept-use-customer-managed-keys-byok.md) or bring your own key (BYOK) support | Customers can encrypt the data in their Media Services account using a key in their Azure Key Vault. |
| **Assets** | |
| An Asset can have multiple [streaming locators](streaming-locators-concept.md) each with different [dynamic packaging](dynamic-packaging-overview.md) and dynamic encryption settings. | There's a limit of 100 streaming locators allowed on each asset. Customers can store a single copy of the media content in the asset, but share different streaming URLs with different streaming policies or content protection policies that are based on a targeted audience.
| **Job processing** ||
| V3 introduces the concept of [Transforms](transforms-jobs-concept.md) for file-based Job processing. | A Transform can be used to build reusable configurations, to create Azure Resource Manager Templates, and isolate processing settings between multiple customers or tenants. |
| For file-based job processing, you can use a HTTP(S) URL as the input. | You don't need to have content already stored in Azure, nor do you need to create input Assets. |
| **Live events** ||
| Premium 1080p Live Events | New Live Event SKU allows customers to get cloud encoding with output up to 1080p in resolution. |
| New [low latency](live-event-latency.md) live streaming support on Live Events. | This allows users to watch live events closer to real time than if they didn't have this setting enabled. |
| Live Event Preview supports [dynamic packaging](dynamic-packaging-overview.md) and dynamic encryption. | This enables content protection on preview and DASH and HLS packaging. |
| Live Outputs replace Programs | Live output is simpler to use than the program entity in the v2 APIs. |
| RTMP ingest for Live Events is improved, with support for more encoders | Increases stability and provides source encoder flexibility. |
| Live Events can stream 24x7 | You can host a Live Event and keep your audience engaged for longer periods. |
| Live transcription on Live Events | Live transcription allows customers to automatically transcribe spoken language into text in real time during the live event broadcast. This significantly improves accessibility of live events. |
| [Stand-by mode](live-events-outputs-concept.md#standby-mode) on Live Events | Live events that are in standby state are less costly than running live events. This allows customers to maintain a set of live events that are ready to start within seconds at a lower cost than maintaining a set of running live events. Reduced pricing for standby live events will become effective in February 2021 for most regions, with the rest to follow in April 2021.
|**Content protection** ||
| [Content protection](content-key-policy-concept.md) supports multi-key features. | Customers can now use multiple content encryption keys on their Streaming locators. |
| **Monitoring** | |
| [Azure EventGrid](monitoring/reacting-to-media-services-events.md) notification support | EventGrid notifications are more feature rich. There are more types of notifications, broader SDK support for receiving the notifications in your own application, and more existing Azure services that can act as event handlers. |
| [Azure Monitor support and integration in the Azure portal](monitoring/monitor-events-portal-how-to.md) | This allows customers to visualize Media Services account quota usage, real-time statistics of streaming endpoints, and ingest and archive statistics for live events. Customers are now able to set alerts and perform necessary actions based on real-time metric data. |
