---
title: Rate limits
description: The Log Analytics API service will throttle requests if the rate is observed to be too high. The limits vary based on authentication scheme.
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# Rate limits

The Log Analytics API service will throttle requests if the rate is observed to be too high. The limits vary based on authentication scheme.

## Azure Active Directory authentication

Using Azure Active Directory for authentication, throttling rules are applied per AAD client users. Each AAD user is able to make up to 200 requests per 30 seconds, with no cap on the total calls per day.

## API Key authentication to sample data

Using API key authentication to sample data, throttling rules are applied per client IP address. Each client IP address is able to make up to 200 requests per 30 seconds, with no cap on total calls per day.

## Rate Limited Responses

If requests are being made at a rate higher than this, then these requests will receive [HTTP status code 429](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_Client_Error) (Too Many Requests) along with the `Retry-After: <delta-seconds>` header which indicates the number of seconds until requests to this application are likely to be accepted.

In the event that the Application Insights service is under high load or is down for maintenance, [HTTP status code 503](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#5xx_Server_Error) (Service Unavailable) will be returned, and in some cases a Retry-After header may be returned.

## Query limits

As well as call rate limits and daily quota caps, there are also limits on queries themselves:

1.  Queries cannot return more than 500,000 rows
2.  Queries cannot return more than 64,000,000 bytes (\~61 MiB total data)
3.  Queries cannot run longer than 10 minutes by default. See [this](timeouts.md) for details.
