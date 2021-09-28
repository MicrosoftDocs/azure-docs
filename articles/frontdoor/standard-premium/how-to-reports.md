---
title: 'Azure Front Door Standard/Premium (Preview) Reports'
description: This article explains how reporting works in Azure Front Door.
services: frontdoor
author: jessie-jyy
ms.service: frontdoor
ms.topic: conceptual
ms.date: 07/07/2021
ms.author: yuajia
---

# Azure Front Door Standard/Premium (Preview) Reports

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Front Door Standard/Premium Analytics Reports provide a built-in and all-around view of how you Azure Front Door behaves along with associated Web Application Firewall metrics. You can also take advantage of Access Logs to do further troubleshooting and debugging. Azure Front Door Analytics reports include traffic reports and security reports.

| Reports | Details |
|---------|---------|
| Overview of key metrics | Shows overall data that got sent from Azure Front Door edges to clients<br/>- Peak bandwidth<br/>- Requests <br/>- Cache hit ratio<br/> - Total latency<br/>- 5XX error rate |
| Traffic by Domain | - Provides an overview of all the domains under the profile<br/>- Breakdown of data transferred out from AFD edge to client<br/>- Total requests<br/>- 3XX/4XX/5XX response code by domains |
| Traffic by Location | - Shows a map view of request and usage by top countries/regions<br/>- Trend view of top countries/regions |
| Usage | - Displays data transfer out from Azure Front Door edge to clients<br/>- Data transfer out from origin to AFD edge<br/>- Bandwidth from AFD edge to clients<br/>- Bandwidth from origin to AFD edge<br/>- Requests<br/>- Total latency<br/>- Request count trend by HTTP status code |
| Caching | - Shows cache hit ratio by request count<br/>- Trend view of hit and miss requests |
| Top URL | - Shows request count <br/>- Data transferred <br/>- Cache hit ratio <br/>- Response status code distribution for the most requested 50 assets. |
| Top Referrer | - Shows request count <br/>- Data transferred <br/>- Cache hit ratio <br/>- Response status code distribution for the top 50 referrers that generate traffic. |
| Top User Agent | - Shows request count <br/>- Data transferred <br/>- Cache hit ratio <br/>- Response status code distribution for the top 50 user agents that were used to request content. |

| Security reports | Details |
|---------|---------|
| Overview of key metrics | - Shows matched WAF rules<br/>- Matched OWASP rules<br/>- Matched BOT rules<br/>- Matched custom rules |
| Metrics by dimensions | - Breakdown of matched WAF rules trend by action<br/>- Doughnut chart of events by Rule Set Type and event by rule group<br/>- Break down list of top events by rule ID, countries/regions, IP address, URL, and user agent  |

> [!NOTE]
> Security reports is only available with Azure Front Door Premium SKU.

Most of the reports are based on access logs and are offered free of charge to customers on Azure Front Door. Customer doesn’t have to enable access logs or do any configuration to view these reports. Reports are accessible through portal and API. CSV download is also supported. 

Reports support any selected date range from the previous 90 days. With data points of every 5 mins, every hour, or every day based on the date range selected. Normally, you can view data with delay of within an hour and occasionally with delay of up to a few hours. 

## Access Reports using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) and select your Azure Front Door Standard/Premium profile.

1. In the navigation pane, select **Reports or Security** under *Analytics*.

   :::image type="content" source="../media/how-to-reports/front-door-reports-landing-page.png" alt-text="Screenshot of Reports landing page":::

1. There are seven tabs for different dimensions, select the dimension of interest.

   * Traffic by domain
   * Usage 
   * Traffic by location
   * Cache
   * Top url
   * Top referrer
   * Top user agent

1. After choosing the dimension, you can select different filters.
  
    1. **Show data for** - Select the date range for which you want to view traffic by domain. Available ranges are:
        
        * Last 24 hours
        * Last 7 days
        * Last 30 days
        * Last 90 days
        * This month
        * Last month
        * Custom date

         By default, data is shown for last seven days. For tabs with line charts, the data granularity goes with the date ranges you selected as the default behavior. 
    
        * 5 minutes - one data point every 5 minutes for date ranges less than or equal 24 hours.
        * By hour – one data every hour for date ranges between 24 hours to 30 days
        * By day – one data per day for date ranges bigger than 30 days.

        You can always use Aggregation to change the default aggregation granularity. Note: 5 minutes doesn’t work for data range longer than 14 days. 

    1. **Location** - Select single or multiple client locations by countries/regions. Countries/regions are grouped into six regions: North America, Asia, Europe, Africa, Oceania, and South America. Refer to [countries/regions mapping](https://en.wikipedia.org/wiki/Subregion). By default, all countries are selected.
    
        :::image type="content" source="../media/how-to-reports/front-door-reports-dimension-locations.png" alt-text="Screenshot of Reports for location dimension.":::
   
    1. **Protocol** - Select either HTTP or HTTPS to view traffic data.
 
        :::image type="content" source="../media/how-to-reports/front-door-reports-dimension-protocol.png" alt-text="Screenshot of Reports for protocol dimension.":::
    
    1. **Domains** - Select single or multi Endpoints or Custom Domains. By default, all endpoints and custom domains are selected. 
    
        * If you delete an endpoint or a custom domain in one profile and then recreate the same endpoint or domain in another profile. The endpoint will be considered a second endpoint.  
        * If you're viewing reports by custom domain - when you delete one custom domain and bind it to a different endpoint. They'll be treated as one custom domain. If view by endpoint - they'll be treated as separate items. 
    
        :::image type="content" source="../media/how-to-reports/front-door-reports-dimension-domain.png" alt-text="Screenshot of Reports for domain dimension.":::

1. If you want to export the data to a CSV file, select the *Download CSV* link on the selected tab.

    :::image type="content" source="../media/how-to-reports/front-door-reports-download-csv.png" alt-text="Screenshot of download csv file for Reports.":::

### Key metrics for all reports

| Metric | Description |
|---------|---------|
| Data Transferred | Shows data transferred from AFD edge POPs to client for the selected time frame, client locations, domains, and protocols. |
| Peak Bandwidth | Peak bandwidth usage in bits per seconds from Azure Front Door edge POPs to client for the selected time frame, client locations, domains, and protocols. | 
| Total Requests | The number of requests that AFD edge POPs responded to client for the selected time frame, client locations, domains, and protocols. |
| Cache Hit Ratio | The percentage of all the cacheable requests for which AFD served the contents from its edge caches for the selected time frame, client locations, domains, and protocols. |
| 5XX Error Rate | The percentage of requests for which the HTTP status code to client was a 5XX for the selected time frame, client locations, domains, and protocols. |
| Total Latency | Average latency of all the requests for the selected time frame, client locations, domains, and protocols. The latency for each request is measured as the total time of when the client request gets received by Azure Front Door until the last response byte sent from Azure Front Door to client. |

## Traffic by Domain

Traffic by Domain provides a grid view of all the domains under this Azure Front Door profile. In this report you can view: 
* Requests
* Data transferred out from Azure Front Door to client
* Requests with status code (3XX, 4Xx and 5XX) of each domain

Domains include Endpoint and Custom Domains, as explained in the Accessing Report session.  

You can go to other tabs to investigate further or view access log for more information if you find the metrics below your expectation. 

:::image type="content" source="../media/how-to-reports/front-door-reports-landing-page.png" alt-text="Screenshot of landing page for reports":::


## Usage

This report shows the trends of traffic and response status code by different dimensions, including:

* Data Transferred from edge to client and from origin to edge in line chart. 

* Data Transferred from edge to client by protocol in line chart. 

* Number of requests from edge to clients in line chart.  

* Number of requests from edge to clients by protocol, HTTP and HTTPS, in line chart. 

* Bandwidth from edge to client in line chart. 

* Total latency, which measures the total time from the client request received by Front Door until the last response byte sent from Front Door to client.

* Number of requests from edge to clients by HTTP status code, in line chart. Every request generates an HTTP status code. HTTP status code appears in HTTPStatusCode in Raw Log. The status code describes how CDN edge handled the request. For example, a 2xx status code indicates that the request got successfully served to a client. While a 4xx status code indicates that an error occurred. For more information about HTTP status codes, see List of HTTP status codes. 

* Number of requests from the edge to clients by HTTP status code. Percentage of requests by HTTP status code among all requests in grid. 

:::image type="content" source="../media/how-to-reports/front-door-reports-usage.png" alt-text="Screenshot of Reports by usage" lightbox="../media/how-to-reports/front-door-reports-usage-expanded.png":::

## Traffic by Location

This report displays the top 50 locations by the countries/regions of the visitors that access your asset the most. The report also provides a breakdown of metrics by countries/regions and gives you an overall view of countries/regions
 where the most traffic gets generated. Lastly you can see which countries/regions is having higher cache hit ratio or 4XX/5XX error codes.

:::image type="content" source="../media/how-to-reports/front-door-reports-by-location.png" alt-text="Screenshot of Reports by locations" lightbox="../media/how-to-reports/front-door-reports-by-location-expanded.png":::

The following are included in the reports:

* A world map view of the top 50 countries/regions by data transferred out or requests of your choice.
* Two line charts trend view of the top five countries/regions by data transferred out and requests of your choice. 
* A grid of the top countries/regions with corresponding data transferred out from AFD to clients, data transferred out % of all countries/regions, requests, request % among all countries/regions, cache hit ratio, 4XX response code and 5XX response code.

## Caching

Caching reports provides a chart view of cache hits/misses and cache hit ratio based on requests. These key metrics explain how CDN is caching contents since the fastest performance results from cache hits. You can optimize data delivery speeds by minimizing cache misses. This report includes:

* Cache hit and miss count trend, in line chart.

* Cache hit ratio in line chart.

Cache Hits/Misses describe the request number cache hits and cache misses for client requests.

* Hits: the client requests that are served directly from Azure CDN edge servers. Refers to those requests whose values for CacheStatus in raw logs are HIT, PARTIAL_HIT, or REMOTE HIT. 

* Miss: the client requests that are served by Azure CDN edge servers fetching contents from origin. Refers to those requests whose values for the field CacheStatus in raw logs are MISS. 

**Cache hit ratio** describes the percentage of cached requests that are served from edge directly. The formula of cache hit ratio is: `(PARTIAL_HIT +REMOTE_HIT+HIT/ (HIT + MISS + PARTIAL_HIT + REMOTE_HIT)*100%`. 

This report takes caching scenarios into consideration and requests that met the following requirements are taken into calculation. 

* The requested content was cached on the POP closest to the requester or origin shield. 

* Partial cached contents for object chunking.

It excludes all of the following cases: 

* Requests that are denied because of Rules Set.

* Requests that contain matching Rules Set that has been set to disabled cache. 

* Requests that are blocked by WAF. 

* Origin response headers indicate that they shouldn't be cached. For example, Cache-Control: private, Cache-Control: no-cache, or Pragma: no-cache headers will prevent an asset from being cached. 

:::image type="content" source="../media/how-to-reports/front-door-reports-caching.png" alt-text="Screenshot of Reports for caching.":::

## Top URLs

Top URLs allow you to view the amount of traffic incurred over a particular endpoint or custom domain. You'll see data for the most requested 50 assets during any period in the past 90 days. Popular URLs will be displayed with the following values. User can sort URLs by request count, request %, data transferred and data transferred %. All the metrics are aggregated by hour and may vary per the time frame selected. URL refers to the value of RequestUri in access log. 

:::image type="content" source="../media/how-to-reports/front-door-reports-top-url.png" alt-text="Screenshot of Reports for top URL.":::

* URL, refers to the full path of the requested asset in the format of `http(s)://contoso.com/index.html/images/example.jpg`. 
* Request counts. 
* Request % of the total requests served by Azure Front Door. 
* Data transferred. 
* Data transferred %. 
* Cache Hit Ratio %
* Requests with response code as 4XX
* Requests with response code as 5XX

> [!NOTE]
> Top URLs may change over time and to get an accurate list of the top 50 URLs, Azure Front Door counts all your URL requests by hour and keep the running total over the course of a day. The URLs at the bottom of the 500 URLs may rise onto or drop off the list over the day, so the total number of these URLs are approximations.  
>
> The top 50 URLs may rise and fall in the list, but they rarely disappear from the list, so the numbers for top URLs are usually reliable. When a URL drops off the list and rise up again over a day, the number of request during the period when they are missing from the list is estimated based on the request number of the URL that appear in that period.  
>
> The same logic applies to Top User Agent. 

## Top Referrers

Top Referrers allow customers to view the top 50 referrer that originated the most requests to the contents on a particular endpoint or custom domain. You can view data for any period in the past 90 days. A referrer indicates the URL from which a request was generated. Referrer may come from a search engine or other websites. If a user types a URL (for example, http(s)://contoso.com/index.html) directly into the address line of a browser, the referrer for the requested is "Empty". Top referrers report includes the follow values. You can sort by request count, request %, data transferred and data transferred %. All the metrics are aggregated by hour and may vary per the time frame selected. 

* Referrer, the value of Referrer in raw logs 
* Request counts 
* Request % of total requests served by Azure CDN in the selected time period. 
* Data transferred 
* Data transferred % 
* Cache Hit Ratio %
* Requests with response code as 4XX
* Requests with response code as 5XX

:::image type="content" source="../media/how-to-reports/front-door-reports-top-referrer.png" alt-text="Screenshot of Reports for top referrer.":::

## Top User Agent

This report allows you to have graphical and statistics view of the top 50 user agents that were used to request content. For example,
* Mozilla/5.0 (Windows NT 10.0; WOW64) 
* AppleWebKit/537.36 (KHTML, like Gecko) 
* Chrome/86.0.4240.75 
* Safari/537.36.  

A grid displays the request counts, request %, data transferred and data transferred, cache Hit Ratio %, requests with response code as 4XX and requests with response code as 5XX. User Agent refers to the value of UserAgent in access logs.

## Security Report

This report allows you to have graphical and statistics view of WAF patterns by different dimensions.

| Dimensions | Description |
|---------|---------|
| Overview metrics- Matched WAF rules | Requests that match custom WAF rules, managed WAF rules and bot manager. |
| Overview metrics- Blocked Requests | The percentage of requests that are blocked by WAF rules among all the requests that matched WAF rules. |
| Overview metrics- Matched Managed Rules | Four line-charts trend for requests that are Block, Log, Allow and Redirect. |
| Overview metrics- Matched Custom Rule | Requests that match custom WAF rules. |
| Overview metrics- Matched Bot Rule | Requests that match Bot Manager. |
| WAF request trend by action | Four line-charts trend for requests that are Block, Log, Allow and Redirect. |
| Events by Rule Type | Doughnut chart of the WAF requests distribution by Rule Type, e.g. Bot, custom rules and managed rules. |
| Events by Rule Group | Doughnut chart of the WAF requests distribution by Rule Group. |
| Requests by actions | A table of requests by actions, in descending order. |
| Requests by top Rule IDs | A table of requests by top 50 rule IDs, in descending order. |
| Requests by top  countries/regions |  A table of requests by top 50 countries/regions, in descending order. |
| Requests by top client IPs |  A table of requests by top 50 IPs, in descending order. |
| Requests by top Request URL |  A table of requests by top 50 URLs, in descending order. |
| Request by top Hostnames | A table of requests by top 50 hostname, in descending order. |
| Requests by top user agents | A table of requests by top 50 user agents, in descending order. |

## CVS format

You can download CSV files for different tabs in reports. This section describes the values in each CSV file.

### General information about the CVS report

Every CSV report includes some general information and the information is available in all CSV files. with variables based on the report you download. 


| Value | Description |
|---------|---------|
| Report | The name of the report. | 
| Domains | The list of the endpoints or custom domains for the report. |
| StartDateUTC | The start of the date range for which you generated the report, in Coordinated Universal Time (UTC) |
| EndDateUTC | The end of the date range for which you generated the report, in Coordinated Universal Time (UTC) |
| GeneratedTimeUTC | The date and time when you generated the report, in Coordinated Universal Time (UTC) |
| Location | The list of the countries/regions where the client requests originated. The value is ALL by default. Not applicable to Security report. |
| Protocol | The protocol of the request, HTTP, or HTTPs. Not applicable to Top URL and Traffic by User Agent in Reports and Security report. |
| Aggregation | The granularity of data aggregation in each row, every 5 minutes, every hour, and every day. Not applicable to Traffic by Domain, Top URL, and Traffic by User Agent in Reports and Security report. |

### Data in Traffic by Domain

* Domain 
* Total Request 
* Cache Hit Ratio 
* 3XX Requests 
* 4XX Requests 
* 5XX Requests 
* ByteTransferredFromEdgeToClient 

### Data in Traffic by Location

* Location
* TotalRequests
* Request%
* BytesTransferredFromEdgeToClient

### Data in Usage

There are three reports in this CSV file. One for HTTP protocol, one for HTTPS protocol and one for HTTP Status Code. 

Reports for HTTP and HTTPs share the same data set. 

* Time 
* Protocol 
* DataTransferred(bytes) 
* TotalRequest 
* bpsFromEdgeToClient 
* 2XXRequest 
* 3XXRequest 
* 4XXRequest 
* 5XXRequest 

Report for HTTP Status Code. 

* Time 
* DataTransferred(bytes) 
* TotalRequest 
* bpsFromEdgeToClient 
* 2XXRequest 
* 3XXRequest 
* 4XXRequest 
* 5XXRequest

### Data in Caching 

* Time
* CacheHitRatio 
* HitRequests 
* MissRequests 

### Data in Top URL 

* URL 
* TotalRequests 
* Request% 
* DataTransferred(bytes) 
* DataTransferred% 

### Data in User Agent 

* UserAgent 
* TotalRequests 
* Request% 
* DataTransferred(bytes) 
* DataTransferred% 

### Security Report 

There are seven tables all with the same fields below.  

* BlockedRequests 
* AllowedRequests 
* LoggedRequests 
* RedirectedRequests 
* OWASPRuleRequests 
* CustomRuleRequests 
* BotRequests 

The seven tables are for time, rule ID, countries/regions, IP address, URL, hostname, user agent. 

## Next steps

Learn about [Azure Front Door Standard/Premium real time monitoring metrics](how-to-monitor-metrics.md).
