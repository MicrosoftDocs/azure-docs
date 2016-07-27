<properties
	pageTitle="Real-Time-Stats in Azure CDN | Microsoft Azure"
	description="Real-Time Statistics provides real-time data about the performance of Azure CDN when delivering content to your clients."
	services="cdn"
	documentationCenter=".NET"
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

# Real-time stats in Microsoft Azure CDN

[AZURE.INCLUDE [cdn-premium-feature](../../includes/cdn-premium-feature.md)]

## Overview

This document explains real-time stats in Microsoft Azure CDN. This functionality provides real-time data about the performance of our CDN when delivering content to your clients.

The following graphs are available when viewing real-time statistics for the HTTP-based platforms:

* [Bandwidth](#bandwidth)
* [Status Codes](#status-codes)
* [Cache Statuses](#cache-statuses)
* [Connections](#connections)

> [AZURE.NOTE] Each of the above graphs displays real-time statistics for a given period of time. A sliding window of data is displayed once the specified time has passed. This means that old data will be removed from the graph to make room for new data. The length of time for this sliding window can be set by the Time span of graphs option.

## Accessing real-time stats

1. From the CDN profile blade, click the **Manage** button.

	![CDN profile blade manage button](./media/cdn-real-time-stats/cdn-manage-btn.png)

	The CDN management portal opens.

2. Hover over the **Analytics** tab, then hover over the **Real-Time Stats** flyout.  Click on **HTTP Large Platform**.

	Report options are displayed.

## Bandwidth

The Bandwidth graph displays the amount of bandwidth used for the current platform over a specified period of time. The shaded portion of the graph indicates bandwidth usage. The exact amount of bandwidth currently being used is displayed directly below the line graph.

> [AZURE.NOTE] The units used by to report bandwidth usage are one of the following: bits per second (b/s), Kilobits per second (Kb/s), Megabits per second (Mb/s), or Gigabits per second (Gb/s).

## Status Codes

The Status Codes graph consists of color-coded lines that indicate how often HTTP response codes are occurring over a specified period of time. The left side of the graph (y-axis) indicates how often a status code is returned for requests, while the bottom of the graph (x-axis) indicates the progression of time.

A list of status codes is displayed directly above the graph. This list indicates each status code that can be included in the line graph and the current number of occurrences per second for that status code. By default, a line is displayed for each of these status codes in the graph. However, you can choose to only monitor the status codes that have special significance for your CDN configuration. This can be accomplished by only marking the desired status code options and clearing all other options. After you are satisfied with the status codes that will be displayed in the graph, you should click Refresh Graph. This will prevent the cleared status codes from being included in the graph.

> [AZURE.NOTE] The **Refresh Graph** option will clear the graph. After which, it will only display the selected status codes.

Each status code option is described below.

Name | Description
-----|------------
Total Hits per second | Determines whether the total number of requests per second for the current platform will be displayed in the graph. You can use this option as a baseline indicator to see the percentage of total hits that a particular status code comprises.
2xx per second | Determines whether the total number of 2xx status codes (e.g., 200, 201, 202, etc.) that occur per second for the current platform will be displayed in the graph. This type of status code indicates that the request was successfully delivered to the client.
304 per second | Determines whether the total number of 304 status codes that occur per second for the current platform will be displayed in the graph. This status code indicates that the requested asset has not been modified since it was last retrieved by the HTTP client.
3xx per second | Determines whether the total number of 3xx status codes (e.g., 300, 301, 302, etc.) that occur per second for the current platform will be displayed in the graph. This option excludes occurrences of 304 status codes. This type of status code indicates that the request resulted in a redirection.
403 per second | Determines whether the total number of 403 status codes that occur per second for the current platform will be displayed in the graph. This status code indicates that the request was deemed unauthorized. One possible cause for this status code is when an unauthorized user requests an asset protected by Token-Based Authentication.
404 per second | Determines whether the total number of 404 status codes that occur per second for the current platform will be displayed in the graph. This status code indicates that the requested asset could not be found.
4xx per second | Determines whether the total number of 4xx status codes (e.g., 400, 401, 402, 405, etc.) that occur per second for the current platform will be displayed in the graph. This option excludes occurrences of 403 and 404 status codes. This status code indicates that the requested asset was not delivered to the client.
5xx per second | Determines whether the total number of 5xx status codes (e.g., 500, 501, 502, etc.) that occur per second for the current platform will be displayed in the graph.
Other per second | Determines whether the total occurrences for all other status codes will be reported in the graph.

You can also choose to temporarily hide logged data for a particular status code. You may do this from the area directly below the graph by clearing the desired status code option. The selected status code will be immediately hidden from the graph. Marking that status code option will cause that option to be displayed again.

> [AZURE.NOTE] The color-coded options directly below the graph only affect what is displayed in the graph. It does not affect whether the graph will keep track of that status code.

## Cache Statuses

The Cache Statuses graph consists of color-coded lines that indicate how often certain types of cache statuses are occurring over a specified period of time. The left side of the graph (y-axis) indicates how often a cache status is returned for requests, while the bottom of the graph (x-axis) indicates the progression of time.

A list of cache statuses is displayed directly above the graph. This list indicates each cache status that can be included in the line graph and the current number of occurrences per second for that cache status. By default, a line is displayed for each of these cache statuses in the graph. However, you can choose to only monitor the cache statuses that have special significance for your CDN configuration. This can be accomplished by only marking the desired cache status options and clearing all other options. After you are satisfied with the cache statuses that will be displayed in the graph, you should click Refresh Graph. This will prevent the cleared status codes from being included in the graph.

> [AZURE.NOTE] The **Refresh Graph** option will clear the graph. After which, it will only display the selected cache statuses.

You can also choose to temporarily hide logged data for a particular response code. You may do this by clearing the desired response code option from the area directly below the graph. The selected response code will be immediately hidden from the graph. Marking that response code option will cause that option to be displayed again.

> [AZURE.NOTE] The color-coded options directly below the graph only affect what is displayed in the graph. It does not affect whether the graph will keep track of that status code.

## Connections

This graphical representation of the average number of connections per minute allows you to view how many connections have been established to your servers. A connection consists of each request for an asset that passes through our CDN.

## See also
* [Azure CDN Overview](cdn-overview.md)
* [Overriding default HTTP behavior using the rules engine](cdn-rules-engine.md)
* [Advanced HTTP Reports](cdn-advanced-http-reports.md)
* [Analyze Edge Performance](cdn-edge-performance.md)
