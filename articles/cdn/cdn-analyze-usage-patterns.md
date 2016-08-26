<properties
	pageTitle="Analyze Azure CDN usage patterns | Microsoft Azure"
	description="You can view usage patterns for your CDN using the following reports: Bandwidth, Data Transferred, Hits, Cache Statuses, Cache Hit Ratio, IPV4/IPV6 Data Transferred."
	services="cdn"
	documentationCenter=""
	authors="camsoper"
	manager="erikre"
	editor=""/>

<tags
	ms.service="cdn"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/28/2016"
	ms.author="casoper"/>

# Analyze Azure CDN usage patterns

[AZURE.INCLUDE [cdn-verizon-only](../../includes/cdn-verizon-only.md)]

You can view usage patterns for your CDN using the following reports:

- Bandwidth
- Data Transferred
- Hits
- Cache Statuses
- Cache Hit Ratio
- IPV4/IPV6 Data Transferred

## Accessing advanced HTTP reports

1. From the CDN profile blade, click the **Manage** button.

	![CDN profile blade manage button](./media/cdn-reports/cdn-manage-btn.png)

	The CDN management portal opens.

2. Hover over the **Analytics** tab, then hover over the **Core Reports** flyout.  Click on the desired report in the menu.

	![CDN management portal - Core Reports menu](./media/cdn-reports/cdn-core-reports.png)


## Bandwidth

The bandwidth report consists of a graph and data table indicating the bandwidth usage for HTTP and HTTPS over a particular time period. You can view the bandwidth usage across all CDN POPs or a particular POP. This allows you to view the traffic spikes and distribution across CDN POPs in Mbps.

- Select All Edge Nodes to see traffic from all nodes or choose a specific region/node from the dropdown list.
- Select Date range to view data for today/this week/this month, etc. or enter custom dates, then click "go" to make sure your selection is updated.
- You can export and download the data by clicking the excel sheet icon located next to "go".

The report is updated every 5 minutes.

![Bandwidth report](./media/cdn-reports/cdn-bandwidth.png)

## Data transferred

This report consists of a graph and data table indicating the traffic usage for HTTP and HTTPS over a particular time period. You can view the traffic usage across all CDN POPs or a particular POP. This allows you to view the traffic spikes and distribution across CDN POPs in GB.

- Select All Edge Nodes to see traffic from all notes or choose a specific region/node from the dropdown list.
- Select Date range to view data for today/this week/this month, etc. or enter custom dates, then click "go" to make sure your selection is updated.
- You can export and download the data by clicking the excel sheet icon located next to "go" .

The report is updated every 5 minutes.

![Data transferred report](./media/cdn-reports/cdn-data-transferred.png)

## Hits (status codes)

This report describes the distribution of request status codes for your content. Every request for content will generate an HTTP status code. The status code describes how edge POPs handled the request. For example, 2xx status codes indicate that the request was successfully served to a client, while a 4xx status code indicates an error occurred. For more details about HTTP status code, see [status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes).

- Select Date range to view data for today/this week/this month, etc. or enter custom dates, then click "go" to make sure your selection is updated.
- You can export and download the data by clicking the excel sheet located next to "go".

![Hits report](./media/cdn-reports/cdn-hits.png)

## Cache statuses

This report describes the distribution of cache hits and cache misses for client request. Since the fastest performance comes from cache hits, you can optimize data delivery speeds by minimizing cache misses and expired cache hits. Cache misses can be reduced by configuring your origin server to avoid assigning "no-cache" response headers, by avoiding query-string caching except where strictly needed, and by avoiding non-cacheable response codes. Expired cache hits can be avoided by making an asset's max-age as long as possible to minimize the number of requests to the origin server.

![Cache statuses report](./media/cdn-reports/cdn-cache-statuses.png)

### Main cache statuses include:

- TCP_HIT: Served from Edge. The object was in cache and had not exceeded its max-age.
- TCP_MISS: Served from Origin. The object was not in cache and the response was back to origin.
- TCP_EXPIRED _MISS: Served from origin after revalidation with origin. The object was in cache but had exceeded its max-age. A revalidation with origin resulted in the cache object being replaced by a new response from origin.
- TCP_EXPIRED _HIT: Served from Edge after revalidation with origin. The object was in cache but had exceeded its max-age. A revalidation with the origin server resulted in the cache object being unmodified.

- Select Date range to view data for today/this week/this month, etc. or enter custom dates, then click "go" to make sure your selection is updated.
- You can export and download the data by clicking the excel sheet icon located next to "go".

### Full list of cache statuses

- TCP_HIT - This status is reported when a request is served directly from the POP to the client. An asset is immediately served from a POP when it is cached on the POP closest to the client and it has a valid time-to-live, or TTL. TTL is determined by the following response headers:

	- Cache-Control: s-maxage
	- Cache-Control: max-age
	- Expires

- TCP_MISS - This status indicates that a cached version of the requested asset was not found on the POP closest to the client. The asset will be requested from either an origin server or an origin shield server. If the origin server or the origin shield server returns an asset, it will be served to the client and cached on both the client and the edge server. Otherwise, a non-200 status code (e.g., 403 Forbidden, 404 Not Found, etc.) will be returned.

- TCP_EXPIRED _HIT -  This status is reported when a request that targeted an asset with an expired TTL, such as when the asset's max-age has expired, was served directly from the POP to the client.

	An expired request typically results in a revalidation request to the origin server. In order for a TCP_EXPIRED _HIT to occur, the origin server must indicate that a newer version of the asset does not exist. This type of situation will typically update that asset's Cache-Control and Expires headers.

- TCP_EXPIRED _MISS - This status is reported when a newer version of an expired cached asset is served from the POP to the client. This occurs when the TTL for a cached asset has expired (e.g., expired max-age) and the origin server returns a newer version of that asset. This new version of the asset will be served to the client instead of the cached version. Additionally, it will be cached on the edge server and the client.

- CONFIG_NOCACHE - This status indicates that a customer-specific configuration on our edge POP prevented the asset from being cached.

- NONE - This status indicates that a cache content freshness check was not performed.

- TCP_ CLIENT_REFRESH _MISS - This status is reported when an HTTP client (e.g., browser) forces an edge POP to retrieve a new version of a stale asset from the origin server.

	By default, our servers prevent an HTTP client from forcing our edge servers to retrieve a new version of the asset from the origin server.

- TCP_ PARTIAL_HIT - This status is reported when a byte range request results in a hit for a partially cached asset. The requested byte range is immediately served from the POP to the client.

- UNCACHEABLE - This status is reported when an asset's Cache-Control and Expires headers indicate that it should not be cached on a POP or by the HTTP client. These types of requests are served from the origin server

## Cache Hit Ratio

This report indicates the percentage of cached requests that were served directly from cache.

The report provides the following details:

- The requested content was cached on the POP closest to the requester.
- The request was served directly from the edge of our network.
- The request did not require revalidation with the origin server.

The report doesn't include:

- Requests that are denied due to country filtering options.
- Requests for assets whose headers indicate that they should not be cached. For example, Cache-Control: private, Cache-Control: no-cache, or Pragma: no-cache headers will prevent an asset from being cached.
- Byte range requests for partially cached content.

The formula is: (TCP_ HIT/(TCP_ HIT+TCP_MISS))*100

- Select Date range to view data for today/this week/this month, etc. or enter custom dates, then click "go" to make sure your selection is updated.
- You can export and download the data by clicking the excel sheet icon located next to "go" .


![Cache hit ratio report](./media/cdn-reports/cdn-cache-hit-ratio.png)

## IPV4/IPV6 Data transferred

This report shows the traffic usage distribution in IPV4 vs IPV6.

![IPV4/IPV6 Data transferred](./media/cdn-reports/cdn-ipv4-ipv6.png)

- Select Date range to view data for today/this week/this month, etc. or enter custom dates.
- Then, click "go" to make sure your selection is updated.


## Considerations

Reports can only be generated within the last 18 months.
