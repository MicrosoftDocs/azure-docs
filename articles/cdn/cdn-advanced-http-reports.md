<properties
	pageTitle="Azure CDN Advanced HTTP Reports | Microsoft Azure"
	description="Advanced HTTP reports in Microsoft Azure CDN. These reports provide detailed information on CDN activity."
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

# Advanced HTTP reports in Microsoft Azure CDN

## Overview

This document explains advanced HTTP reporting in Microsoft Azure CDN. These reports provide detailed information on CDN activity.

[AZURE.INCLUDE [cdn-premium-feature](../../includes/cdn-premium-feature.md)]

## Accessing advanced HTTP reports

1. From the CDN profile blade, click the **Manage** button.

	![CDN profile blade manage button](./media/cdn-advanced-http-reports/cdn-manage-btn.png)

	The CDN management portal opens.

2. Hover over the **Analytics** tab, then hover over the **Advanced HTTP Reports** flyout.  Click on **HTTP Large Platform**.

	![CDN management portal - Advanced Reports menu](./media/cdn-advanced-http-reports/cdn-advanced-reports.png)

	Report options are displayed.

## Geography Reports (Map-Based)

There are five reports that take advantage of a map to indicate the regions from which your content is being requested. These reports are World Map, United States Map, Canada Map, Europe Map, and Asia Pacific Map.

Each map-based report ranks geographic entities (i.e., countries, states, and provinces) according to the percentage of hits that originated from that region. Additionally, a map is provided to help you visualize the locations from which your content is being requested. It is able to do so by color-coding each region according to the amount of demand experienced in that region. Lighter shaded regions indicate lower demand for your content, while darker regions indicate higher levels of demand for your content.

Detailed traffic and bandwidth information for each region is provided directly below the map. This allows you to view the total number of hits, the percentage of hits, the total amount of data transferred (in gigabytes), and the percentage of data transferred for each region. View a description for each of these metrics. Finally, when you hover over a region (i.e., country, state, or province), the name and the percentage of hits that occurred in the region will be displayed as a tooltip.

A brief description is provided below for each type of map-based geography report.

Report Name | Description
------------|------------
World Map | This report allows you to view the worldwide demand for your CDN content. Each country is color-coded on the world map to indicate the percentage of hits that originated from that region.
United States Map | This report allows you to view the demand for your CDN content in the United States. Each state is color-coded on this map to indicate the percentage of hits that originated from that region.
Canada Map | This report allows you to view the demand for your CDN content in Canada. Each province is color-coded on this map to indicate the percentage of hits that originated from that region.
Europe Map | This report allows you to view the demand for your CDN content in Europe. Each country is color-coded on this map to indicate the percentage of hits that originated from that region.
Asia Pacific Map | This report allows you to view the demand for your CDN content in Asia. Each country is color-coded on this map to indicate the percentage of hits that originated from that region.

## Geography Reports (Bar Charts)

There are two additional reports that provide statistical information according to geography, which are Top Cities and Top Countries. These reports rank cities and countries, respectively, according to the number of hits that originated from those regions. Upon generating this type of report, a bar chart will indicate the top 10 cities or countries that requested content over a specific platform. This bar chart allows you to quickly assess the regions that generate the highest number of requests for your content.

The left-hand side of the graph (y-axis) indicates how many hits occurred in the specified region. Directly below the graph (x-axis), you will find a label for each of the top 10 regions.

### Using the bar charts

* If you hover over a bar, the name and the total number of hits that occurred in the region will be displayed as a tooltip.
* The tooltip for the Top Cities report identifies a city by its name, state/province, and country abbreviation.
* If the city or region (i.e., state/province) from which a request originated could not be determined, then it will indicate that they are unknown. If the country is unknown, then two question marks (i.e., ??) will be displayed.
* A report may include metrics for "Europe" or the "Asia/Pacific Region." Those items are not meant to provide statistical information on all IP addresses in those regions. Rather, they only apply to requests that originate from IP addresses that are spread out over Europe or Asia/Pacific instead of to a specific city or country.

The data that was used to generate the bar chart can be viewed below it. There you will find the total number of hits, the percentage of hits, the amount of data transferred (in gigabytes), and the percentage of data transferred for the top 250 regions. View a description for each of these metrics.

A brief description is provided for both types of reports below.

Report Name | Description
------------|------------
Top Cities | This report ranks cities according to the number of hits that originated from that region.
Top Countries | This report ranks countries according to the number of hits that originated from that region.

## Daily Summary

The Daily Summary report allows you to view the total number of hits and data transferred over a particular platform on a daily basis. This information can be used to quickly discern CDN activity patterns. For example, this report can help you detect which days experienced higher or lower than expected traffic.

Upon generating this type of report, a bar chart will provide a visual indication as to the amount of platform-specific demand experienced on a daily basis over the time period covered by the report. It will do so by displaying a bar for each day in the report. For example, selecting the time period called "Last Week" will generate a bar chart with seven bars. Each bar will indicate the total number of hits experienced on that day.

The left-hand side of the graph (y-axis) indicates how many hits occurred on the specified date. Directly below the graph (x-axis), you will find a label that indicates the date (Format: YYYY-MM-DD) for each day included in the report.

> [AZURE.TIP] If you hover over a bar, the total number of hits that occurred on that date will be displayed as a tooltip.

The data that was used to generate the bar chart can be viewed below it. There you will find the total number of hits and the amount of data transferred (in gigabytes) for each day covered by the report.

## By Hour

The By Hour report allows you to view the total number of hits and data transferred over a particular platform on an hourly basis. This information can be used to quickly discern CDN activity patterns. For example, this report can help you detect the time periods during the day that experience higher or lower than expected traffic.

Upon generating this type of report, a bar chart will provide a visual indication as to the amount of platform-specific demand experienced on an hourly basis over the time period covered by the report. It will do so by displaying a bar for each hour covered by the report. For example, selecting a 24 hour time period will generate a bar chart with twenty four bars. Each bar will indicate the total number of hits experienced during that hour.

The left-hand side of the graph (y-axis) indicates how many hits occurred on the specified hour. Directly below the graph (x-axis), you will find a label that indicates the date/time (Format: YYYY-MM-DD hh:mm) for each hour included in the report. Time is reported using 24 hour format and it is specified using the UTC/GMT time zone.

> [AZURE.TIP] If you hover over a bar, the total number of hits that occurred during that hour will be displayed as a tooltip.

The data that was used to generate the bar chart can be viewed below it. There you will find the total number of hits and the amount of data transferred (in gigabytes) for each hour covered by the report.

## By File

The By File report allows you to view the amount of demand and the traffic incurred over a particular platform for the most requested assets. Upon generating this type of report, a bar chart will be generated on the top 10 most requested assets over the specified time period.

> [AZURE.NOTE] For the purposes of this report, edge CNAME URLs are converted to their equivalent CDN URLs. This allows an accurate tally for the total number of hits associated with an asset regardless of the CDN or edge CNAME URL used to request it.

The left-hand side of the graph (y-axis) indicates the number of requests for each asset over the specified time period. Directly below the graph (x-axis), you will find a label that indicates the file name for each of the top 10 requested assets.

The data that was used to generate the bar chart can be viewed below it. There you will find the following information for each of the top 250 requested assets: relative path, the total number of hits, the percentage of hits, the amount of data transferred (in gigabytes), and the percentage of data transferred.

## By File Detail

The By File Detail report allows you to view the amount of demand and the traffic incurred over a particular platform for a specific asset. At the very top of this report is the File Details For option. This option provides a list of your most requested assets on the selected platform. In order to generate a By File Detail report, you will need to select the desired asset from the File Details For option. After which, a bar chart will indicate the amount of daily demand that it generated over the specified time period.

The left-hand side of the graph (y-axis) indicates the total number of requests that an asset experienced on a particular day. Directly below the graph (x-axis), you will find a label that indicates the date (Format: YYYY-MM-DD) for which CDN demand for the asset was reported.

The data that was used to generate the bar chart can be viewed below it. There you will find the total number of hits and the amount of data transferred (in gigabytes) for each day covered by the report.

## By File Type

The By File Type report allows you to view the amount of demand and the traffic incurred by file type. Upon generating this type of report, a donut chart will indicate the percentage of hits generated by the top 10 file types.

> [AZURE.TIP] If you hover over a slice in the donut chart, the Internet media type of that file type will be displayed as a tooltip.

The data that was used to generate the donut chart can be viewed below it. There you will find the file name extension/Internet media type, the total number of hits, the percentage of hits, the amount of data transferred (in gigabytes), and the percentage of data transferred for each of the top 250 file types.

## By Directory

The By Directory report allows you to view the amount of demand and the traffic incurred over a particular platform for content from a specific directory. Upon generating this type of report, a bar chart will indicate the total number of hits generated by content in the top 10 directories.

### Using the bar chart

* Hover over a bar to view the relative path to the corresponding directory.
* Content stored in a subfolder of a directory does not count when calculating demand by directory. This calculation relies solely on the number of requests generated for content stored in the actual directory.
* For the purposes of this report, edge CNAME URLs are converted to their equivalent CDN URLs. This allows an accurate tally for all statistics associated with an asset regardless of the CDN or edge CNAME URL used to request it.

The left-hand side of the graph (y-axis) indicates the total number of requests for the content stored in your top 10 directories. Each bar on the chart represents a directory. Use the color-coding scheme to match up a bar to a directory listed in the Top 250 Full Directories section.

The data that was used to generate the bar chart can be viewed below it. There you will find the following information for each of the top 250 directories: relative path, the total number of hits, the percentage of hits, the amount of data transferred (in gigabytes), and the percentage of data transferred.

## By Browser

The By Browser report allows you to view which browsers were used to request content. Upon generating this type of report, a pie chart will indicate the percentage of requests handled by the top 10 browsers.

### Using the pie chart

* Hover over a slice in the pie chart to view a browser's name and version.
* For the purposes of this report, each unique browser/version combination is considered a different browser.
* The slice called "Other" indicates the percentage of requests handled by all other browsers and versions.

The data that was used to generate the pie chart can be viewed below it. There you will find the browser type/version number, the total number of hits and the percentage of hits for each of the top 250 browsers.

## By Referrer

The By Referrer report allows you to view the top referrers to content on the selected platform. A referrer indicates the hostname from which a request was generated. Upon generating this type of report, a bar chart will indicate the amount of demand (i.e., hits) generated by the top 10 referrers.

The left-hand side of the graph (y-axis) indicates the total number of requests that an asset experienced for each referrer. Each bar on the chart represents a referrer. Use the color-coding scheme to match up a bar to a referrer listed in the Top 250 Referrer section.

The data that was used to generate the bar chart can be viewed below it. There you will find the URL, the total number of hits, and the percentage of hits generated from each of the top 250 referrers.

## By Download

The By Download report allows you to analyze download patterns for your most requested content. The top of the report contains a bar chart that compares attempted downloads with completed downloads for the top 10 requested assets. Each bar is color-coded according to whether it is an attempted download (blue) or a completed download (green).

> [AZURE.NOTE] For the purposes of this report, edge CNAME URLs are converted to their equivalent CDN URLs. This allows an accurate tally for all statistics associated with an asset regardless of the CDN or edge CNAME URL used to request it.

The left-hand side of the graph (y-axis) indicates the file name for each of the top 10 requested assets. Directly below the graph (x-axis), you will find labels that indicate the total number of attempted/completed downloads.

Directly below the bar chart, the following information will be listed for the top 250 requested assets: relative path (including file name), the number of times that it was downloaded to completion, the number of times that it was requested, and the percentage of requests that resulted in a complete download.

> [AZURE.TIP] Our CDN is not informed by an HTTP client (i.e. browser) when an asset has been completely downloaded. As a result, we have to calculate whether an asset has been completely downloaded according to status codes and byte-range requests. The first thing we look for when making this calculation is whether the request results in a 200 OK status code. If so, then we look at byte-range requests to ensure that they cover the entire asset. Finally, we compare the amount of data transferred to the size of the requested asset. If the data transferred is equal to or greater than the file size and the byte-range requests are appropriate for that asset, then the hit will be counted as a complete download.
>
>Due to the interpretive nature of this report, you should keep in mind the following points that may alter the consistency and accuracy of this report.
>
>* Traffic patterns cannot be accurately predicted when user-agents behave differently. This may produce completed download results that are greater than 100%.
>* Assets that take advantage of HTTP Progressive Download may not be accurately represented by this report. This is due to users seeking to different positions in a video.

## By 404 Errors

The By 404 Errors report allows you to identify the type of content that generates the most number of 404 Not Found status codes. The top of the report contains a bar chart for the top 10 assets for which a 404 Not Found status code was returned. This bar chart compares the total number of requests with requests that resulted in a 404 Not Found status code for those assets. Each bar is color-coded. A yellow bar is used to indicate that the request resulted in a 404 Not Found status code. A red bar is used to indicate the total number of requests for the asset.

> [AZURE.NOTE] For the purposes of this report, note the following:
>
>* A hit represents any request for an asset regardless of status code.
>* Edge CNAME URLs are converted to their equivalent CDN URLs. This allows an accurate tally for all statistics associated with an asset regardless of the CDN or edge CNAME URL used to request it.

The left-hand side of the graph (y-axis) indicates the file name for each of the top 10 requested assets that resulted in a 404 Not Found status code. Directly below the graph (x-axis), you will find labels that indicate the total number of requests and the number of requests that resulted in a 404 Not Found status code.

Directly below the bar chart, the following information will be listed for the top 250 requested assets: relative path (including file name), the number of requests that resulted in a 404 Not Found status code, the total number of times that the asset was requested, and the percentage of requests that resulted in a 404 Not Found status code.

## See also
* [Azure CDN Overview](cdn-overview.md)
* [Real-time stats in Microsoft Azure CDN](cdn-real-time-stats.md)
* [Overriding default HTTP behavior using the rules engine](cdn-rules-engine.md)
* [Analyze Edge Performance](cdn-edge-performance.md)
