---
title: Azure Front Door Service - Backends and Backend Pools | Microsoft Docs
description: This article helps you understand what are backend and backend pools for in Front Door configuration.
services: front-door
documentationcenter: ''
author: sharad4u
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/10/2018
ms.author: sharadag
---

# Backends and backend pools in Azure Front Door Service
This article explains the different concepts regarding how you can map your application deployment with Front Door. We will also explain you what the different terms in Front Door configuration around application backend mean.

## Backend pool
A backend pool in Front Door refers to the set of equivalent backends that can receive the same type of traffic for their application. In other words, it is a logical grouping of your application instances throughout the world that can receive the same traffic and can respond with the expected behavior. These backends are usually deployed across different regions or within the same region. Additionally, these backends can all be in Active-Active deployment mode or otherwise could be defined as an Active/Passive configuration.

Backend pool also defines how the different backends should all be evaluated for their health via health probes and correspondingly how the load balancing between the backends should happen.

### Health probes
Front Door sends periodic HTTP/HTTPS probe requests to each of your configured backends to determine the proximity and health of each backend to load balance your end-user requests. Health probe settings for a backend pool define how we poll for the health status for your application backends. The following settings are available for configuration for load balancing:

1. **Path**: URL path where the probe requests will be sent to for all the backends in the backend pool. For example, if one of your backends is `contoso-westus.azurewebsites.net` and the path is set to `/probe/test.aspx`, then Front Door environments, assuming protocol is set to HTTP, will send the health probe requests to http://contoso-westus.azurewebsites.net/probe/test.aspx. 
2. **Protocol**: Defines whether the health probe requests from Front Door to your backends will be sent over HTTP or HTTPS protocol.
3. **Interval (seconds)**: This field defines the frequency of health probes to your backends, that is, the intervals in which each of the Front Door environments will send a probe. Note - if you are looking for faster failovers, then set this field to a lower value. However, the lower the value more the health probe volume that your backends will receive. To get an idea of how much probe volume Front Door will generate on your backends, let's take an example. Let's say, the interval is set to 30 seconds and there are about 90 Front Door environments or POPs globally. So, each of your backends will approximately receive about 3-5 probe requests per second.

Read [health probes](front-door-health-probes.md) for details.

### Load balancing settings
The load balancing settings for the backend pool define how we evaluate the health probes for deciding the backend to be healthy or unhealthy and also how we need to load balance the traffic between the different backends in the backend pool. The following settings are available for configuration for load balancing:

1. **Sample size**: This property identifies how many samples of health probes we need to consider for backend health evaluation.
2. **Successful sample size**: This property defines that of the 'sample size' as explained above, how many samples do we need to check for success to call the backend as healthy. 
</br>For example, let's say for your Front Door you have set the health probe *interval* to 30 seconds, *sample size* is set to '5' and *successful sample size* is set to '3'. Then what this configuration means is that every time we evaluate the health probes for your backend, we will look at the last five samples, which would be spanning last 150 seconds (=5*30 s) and unless there are 3 or more of these probes successful we will declare the backend unhealthy. Let's say there were only two successful probes and, so we will mark the backend as unhealthy. The next time we run the evaluation if we find 3 successful in the last five probes, then we mark the backend as healthy again.
3. **Latency sensitivity (additional latency)**: The latency sensitivity field defines whether you want Front Door to send the request to backends that are within the sensitivity range in terms of latency measurement or forwarding the request to the closest backend. Read [least latency based routing method](front-door-routing-methods.md#latency) for Front Door to learn more.

## Backend
A backend is equivalent to an application's deployment instance in a region. Front Door supports both Azure as well as non-Azure backends and so the region here isn't only restricted to Azure regions but can also be your on-premise datacenter or an application instance in some other cloud.

Backends, in the context of Front Doors, refers to the host name or public IP of your application, which can serve client requests. So, backends should not be confused with your database tier or your storage tier etc. but rather should be viewed as the public endpoint of your application backend.

When you add a backend in a backend pool of your Front Door, you will need to fill in the following details:

1. **Backend host type**: The type of resource you want to add. Front Door supports auto-discovery of your application backends if from app service, cloud service, or storage. If you want a different resource in Azure or even a non-Azure backend, select 'Custom host'. Note - During configuration, the APIs do not validate whether the backend is accessible from Front Door environments, instead you need to ensure that your backend can be reached by Front Door. 
2. **Subscription and Backend host name**: If you have not selected 'Custom host' for backend host type, then you need to scope down and select your backend by choosing the appropriate subscription and the corresponding backend host name from the user interface.
3. **Backend host header**: The Host header value sent to the backend for each request. Read [backend host header](#hostheader) for details.
4. **Priority**: You can assign priorities to your different backends when you want to use a primary service backend for all traffic, and provide backups in case the primary or the backup backends are unavailable. Read more about [priority](front-door-routing-methods.md#priority).
5. **Weight**: You can assign weights to your different backends when you want to distribute traffic across a set of backends, either evenly or according to weight coefficients. Read more about [weights](front-door-routing-methods.md#weighted).


### <a name = "hostheader"></a>Backend host header

Requests forwarded by Front Door to a backend have a Host header field that the backend uses to retrieve the targeted resource. The value for this field typically comes from the backend URI and has the host and port. For example, a request made for `www.contoso.com` will have the Host header `www.contoso.com`. If you are configuring your backend using Azure portal, then the default value that gets populated for this field is the host name of the backend. For example, if your backend is `contoso-westus.azurewebsites.net`, then in the Azure portal the auto-populated value for backend host header will be `contoso-westus.azurewebsites.net`. 
</br>However, if you are using Resource Manager templates or other mechanism and you are not setting this field explicitly then Front Door sends the incoming host name as the value for Host header. For example, if the request was made for `www.contoso.com`, and your backend is `contoso-westus.azurewebsites.net` with the backend host header field as empty, then Front Door will set the Host header as `www.contoso.com`.

Most application backends (such as Web Apps, Blob Storage, and Cloud Services) require the host header to match the domain of the backend. However, the frontend host that routes to your backend will have a different hostname like www.contoso.azurefd.net. If the backend you are setting up requires the Host header to match the host name of the backend, you should ensure that the 'Backend host header’ also has the host name of the backend.

#### Configuring the backend host header for the backend
The ‘Backend host header’ field can be configured for a backend in the backend pool section.

1. Open your Front Door resource and click on the backend pool that has the backend to be configured.

2. Add a backend if you have not added any, or edit an existing one. The 'Backend host header' field can be set to a custom value or left blank, which means that the hostname for the incoming request will be used as the Host header value.



## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).