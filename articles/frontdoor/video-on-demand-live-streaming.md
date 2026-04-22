---
title: Delivering Video On-Demand (VOD) and Live Streaming
titleSuffix: Azure Front Door
description: Improve live and VOD delivery with Microsoft’s global edge network. Get configuration guidance and performance results.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.date: 04/21/2026
ms.topic: concept-article
---

# Delivering video on-demand and live streaming with Azure Front Door

Azure Front Door's architecture is designed to optimize global content delivery by leveraging Microsoft's private backbone network together with a large global-edge footprint.

Azure Front Door minimizes latency and avoids congested public internet paths by routing traffic across Microsoft's private network between distributed edge locations, providing highly resilient delivery infrastructure. Combined with Microsoft's extensive peering relationships and redundant network paths, this architecture enables streaming workloads to reach deep into regional and last-mile networks and deliver a stable playback experience for end users with minimal buffering, whether your audience is a few thousand internal viewers or a global audience of concurrent users.

## Azure Front Door DASH streaming configuration optimization 

The following configuration examples illustrate how Azure Front Door is tuned to optimize delivery of MPEG-DASH video-on-demand (VOD) streaming workloads.

| Front Door configuration category | Configuration | Why it matters |
|---------------------------|---------------|----------------|
| Rules | Disable compression for segment files (*.m4s* and *.mp4*) | DASH and HLS media segments are already compressed video and audio data. Recompressing them provides no benefit and introduces unnecessary CPU overhead and latency during delivery. |
| Rules | Enable compression for manifest and playlist files (*.mpd* and *.m3u8*) | DASH and HLS manifests are small text-based XML or plain-text files that compress efficiently (often 70–80% size reduction). Enabling compression reduces manifest transfer time and improves initial player startup and playlist refresh performance. |
| Rules | Cache *.m3u8* and *.mpd* playlist files for 3 hours | For VOD, playlist files are static after publication. They don't change between viewer sessions. Caching them aggressively at the edge eliminates repeated round-trips to origin and accelerates startup time for every viewer. <br> **Note:** this TTL is specific to VOD and must not be applied to live streaming manifests. |
| Rules | Cache *.m4s* segment files for 1 hour (or longer with `immutable`) | VOD video segments are immutable once encoded and published. They never change. Caching them at the edge for extended durations prevents redundant origin fetches and improves throughput consistency. For truly immutable VOD assets, consider setting `Cache-Control: max-age=86400, immutable` at the origin to signal that the segment is never invalidated. |
| Rules | Ignore query string for caching | Some players append transient query parameters (for example: timestamps, client session IDs) to segment requests. Ignoring query strings prevents cache fragmentation and ensures identical media segments are served from the same cached object. Important exception: if your deployment uses URL-based token authentication (for example: Azure SAS tokens appended as query parameters), don't ignore query strings globally. Instead, configure Azure Front Door to pass through specific security parameters while ignoring nonsecurity ones. See the Content Protection note in the infrastructure considerations section below for a discussion of access control patterns and their caching trade-offs. |
| Route | Enable caching at the route level | Route-level caching ensures that requests matched by the path are cached by Azure Front Door's edge even if no specific rule explicitly enables caching. This configuration acts as a catch-all baseline for the streaming content path. |
| Route | Query string caching behavior: *Ignore query string* | This setting reinforces the rule-level configuration and ensures consistent cache behavior for all requests matching the route, including requests that don't match a more specific rule. |
| Route | Forwarding protocol: **HTTP only** (to origin) | If the origin resides within a trusted private network boundary behind Azure Front Door (such as Azure Blob Storage on a private endpoint), removing the TLS negotiation hop between Azure Front Door edge and origin reduces latency on every cache miss. <br> **Caveat:** if your content is DRM-protected (for example: PlayReady, Widevine) or your origin serves license or key material, maintain HTTPS to origin regardless of network topology. The sensitivity of encryption keys warrants the added latency overhead. |
| Route | Redirect client traffic to **HTTPS** | Viewer traffic remains encrypted end-to-end from the client to the Azure Front Door edge, which is the required security posture for any media delivery workload. It's essential for DRM playback environments where browsers enforce secure contexts. |
| Route | Pattern match /content/* (scope to streaming path) | Scoping rules to the specific content path ensures that these optimizations apply only to streaming assets and don't inadvertently affect other endpoints - such as APIs, auth services, or web app traffic - served by the same Azure Front Door instance. |

> [!NOTE]
> The caching TTLs and rules in the preceding table apply specifically to MPEG‑DASH VOD delivery, where media segments are immutable after publication and manifest files change far less frequently than in live streaming workflows. Live streaming manifests require a fundamentally different caching strategy. Playlist files must not be cached (or cached only briefly, typically for one to two segment durations) so that players always receive the current segment list. See the Live Streaming section for live‑specific guidance.

## Where Azure Front Door fits in a modern streaming architecture

Modern streaming delivery architectures combine multiple layers of infrastructure to optimize scale, resiliency, and performance. What that looks like in practice varies significantly depending on the size and nature of the operation - from a media team publishing training videos to a global OTT platform serving millions of concurrent streams. Azure Front Door is designed to play a meaningful role across this entire spectrum.

### Streaming use cases

Azure Front Door's private backbone routing, global edge footprint, and tight integration with Azure services make it a strong delivery tier across the following scenarios:

**Small and mid-size businesses and enterprises:** For organizations delivering internal communications, training libraries, customer-facing video portals, or product marketing content, Azure Front Door provides a complete delivery stack without the operational overhead of a dedicated media CDN. Pairing Azure Front Door with Azure Blob Storage for VOD - and with encoding and packaging partners from the Azure ecosystem - gives teams a globally distributed pipeline that scales automatically and integrates with existing Azure security, identity, and monitoring tooling. 

**Large virtual events and high-audience live broadcasts:** Conferences, product launches, company town halls, and live sports broadcasts benefit from Azure Front Door's unicast routing and Microsoft's backbone - which keeps traffic off congested public internet paths during peak concurrent load. For broadcast-grade live events with very high concurrent viewer counts, Azure Front Door can operate as the primary delivery tier or as part of a multi-CDN strategy with automated failover between providers. 

**Regional and emerging OTT platforms:** Growing streaming services that are building scalable distribution infrastructure - and that operate in geographies where Microsoft has strong peering and last-mile reach - will find Azure Front Door a competitive alternative to established media CDN providers. As Azure Front Door's media-specific feature set continues to mature, it's increasingly capable of supporting the operational demands of continuous, high-volume streaming at scale. 

**Hyperscale multi-CDN environments:** For platforms operating at the scale of the largest global OTT providers - where delivery architectures span multiple CDNs, custom origin infrastructure, and proprietary caching layers - Azure Front Door can integrate naturally as a high-performance delivery tier within a broader multi-CDN strategy. Azure Front Door's Rules Engine, real-time health probes, and origin group failover give platform engineers the control surface needed to manage Azure Front Door alongside other CDN providers and route traffic intelligently based on performance, cost, or geography. 

## Infrastructure considerations

Successful Azure Front Door streaming deployments require attention to several infrastructure aspects:

- **CORS headers:** Any video player running in a browser issues cross-origin requests for media segments and manifest files. Without correct Cross-Origin Resource Sharing (CORS) headers, specifically Access-Control-Allow-Origin on segment and manifest responses, browser-based playback fails entirely due to browser security policy enforcement. Configure CORS headers either at the origin or via Azure Front Door's response header modification rules. This configuration is important when your player UI is served from a different domain than your media CDN endpoint.

- **DRM integration:** Commercial VOD and live streaming deployments that require content protection use Digital Rights Management - typically some combination of Microsoft PlayReady, Google Widevine, and Apple FairPlay depending on the target device ecosystem. DRM license server requests must not be cached and should be routed separately from media segments. Azure Front Door can forward license requests to a DRM license origin while caching media segments independently. Plan your Azure Front Door route configuration to distinguish between licensable media paths and license acquisition endpoints from the start.

- **Content protection:** Azure Front Door's WAF provides baseline geo-filtering and rate limiting at the policy level. Native cryptographic URL request signing at the edge is on the Azure Front Door roadmap but isn't currently available in production releases. In the interim, access control for streaming content typically involves a lightweight origin-side or middleware token validation layer - for example, an Azure Function that issues short-lived access tokens, which are validated before content requests are proxied through Azure Front Door. One important nuance for any signed URL approach in streaming: signed URLs applied to individual media segments fragment your CDN cache, since each viewer receives a unique signed URL and the CDN treats each variant as a distinct cache key. For high-scale streaming, the cache-friendly pattern is cookie-based session authentication - validate the viewer's entitlement once on manifest request, issue a short-lived session cookie, and let segment requests flow through cleanly with shared cache efficiency.

## Related content

- [Improve performance by compressing files in Azure Front Door](./standard-premium/how-to-compression.md).
- [High-availability implementation guide for using Azure Front Door](high-availability.md).
- [Architecture best practices for Azure Front Door](/azure/well-architected/service-guides/azure-front-door?toc=/azure/frontdoor/toc.json)

