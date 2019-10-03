---
title: Backends and backend pools in Azure Front Door Service | Microsoft Docs
description: This article describes what backends and backend pools are in Front Door configuration.
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
This article describes concepts about how to map your app deployment with Azure Front Door Service. It also explains the different terms in Front Door configuration around app backends.

## Backends
A backend is equal to an app's deployment instance in a region. Front Door Service supports both Azure and non-Azure backends, so the region isn't only restricted to Azure regions. Also, it can be your on-premise datacenter or an app instance in another cloud.

Front Door Service backends refer to the host name or public IP of your app, which can serve client requests. Backends shouldn't be confused with your database tier, storage tier, and so on. Backends should be viewed as the public endpoint of your app backend. When you add a backend in a Front Door backend pool, you must also add the following:

- **Backend host type**. The type of resource you want to add. Front Door Service supports autodiscovery of your app backends from app service, cloud service, or storage. If you want a different resource in Azure or even a non-Azure backend, select **Custom host**.

    >[!IMPORTANT]
    >During configuration, APIs don't validate if the backend is inaccessible from Front Door environments. Make sure that Front Door can reach your backend.

- **Subscription and Backend host name**. If you haven't selected **Custom host** for backend host type, select your backend by choosing the appropriate subscription and the corresponding backend host name in the UI.

- **Backend host header**. The host header value sent to the backend for each request. For more information, see [Backend host header](#hostheader).

- **Priority**. Assign priorities to your different backends when you want to use a primary service backend for all traffic. Also, provide backups if the primary or the backup backends are unavailable. For more information, see [Priority](front-door-routing-methods.md#priority).

- **Weight**. Assign weights to your different backends to distribute traffic across a set of backends, either evenly or according to weight coefficients. For more information, see [Weights](front-door-routing-methods.md#weighted).

### <a name = "hostheader"></a>Backend host header

Requests forwarded by Front Door to a backend include a host header field that the backend uses to retrieve the targeted resource. The value for this field typically comes from the backend URI and has the host and port.

For example, a request made for www\.contoso.com will have the host header www\.contoso.com. If you use Azure portal to configure your backend, the default value for this field is the host name of the backend. If your backend is contoso-westus.azurewebsites.net, in the Azure portal, the autopopulated value for the backend host header will be contoso-westus.azurewebsites.net. However, if you use Azure Resource Manager templates or another method without explicitly setting this field, Front Door Service will send the incoming host name as the value for the host header. If the request was made for www\.contoso.com, and your backend is contoso-westus.azurewebsites.net that has an empty header field, Front Door Service will set the host header as www\.contoso.com.

Most app backends (Azure Web Apps, Blob storage, and Cloud Services) require the host header to match the domain of the backend. However, the frontend host that routes to your backend will use a different hostname such as www\.contoso.azurefd.net.

If your backend requires the host header to match the backend host name, make sure that the backend host header includes the host name backend.

#### Configuring the backend host header for the backend

To configure the **backend host header** field for a backend in the backend pool section:

1. Open your Front Door resource and select the backend pool with the backend to configure.

2. Add a backend if you haven't done so, or edit an existing one.

3. Set the backend host header field to a custom value or leave it blank. The hostname for the incoming request will be used as the host header value.

## Backend pools
A backend pool in Front Door Service refers to the set of backends that receive similar traffic for their app. In other words, it's a logical grouping of your app instances across the world that receive the same traffic and respond with expected behavior. These backends are deployed across different regions or within the same region. All backends can be in Active/Active deployment mode or what is defined as Active/Passive configuration.

A backend pool defines how the different backends should be evaluated via health probes. It also defines how load balancing occurs between them.

### Health probes
Front Door Service sends periodic HTTP/HTTPS probe requests to each of your configured backends. Probe requests determine the proximity and health of each backend to load balance your end-user requests. Health probe settings for a backend pool define how we poll the health status of app backends. The following settings are available for load-balancing configuration:

- **Path**. The URL used for probe requests for all the backends in the backend pool. For example, if one of your backends is contoso-westus.azurewebsites.net and the path is set to /probe/test.aspx, then Front Door Service environments, assuming the protocol is set to HTTP, will send health probe requests to http\://contoso-westus.azurewebsites.net/probe/test.aspx.

- **Protocol**. Defines whether to send the health probe requests from Front Door Service to your backends with HTTP or HTTPS protocol.

- **Interval (seconds)**. Defines the frequency of health probes to your backends, or the intervals in which each of the Front Door environments sends a probe.

    >[!NOTE]
    >For faster failovers, set the interval to a lower value. The lower the value, the higher the health probe volume your backends receive. For example, if the interval is set to 30 seconds with 90 Front Door environments or POPs globally, each backend will receive about 3-5 probe requests per second.

For more information, see [Health probes](front-door-health-probes.md).

### Load-balancing settings
Load-balancing settings for the backend pool define how we evaluate health probes. These settings determine if the backend is healthy or unhealthy. They also check how to load-balance traffic between different backends in the backend pool. The following settings are available for load-balancing configuration:

- **Sample size**. Identifies how many samples of health probes we need to consider for backend health evaluation.

- **Successful sample size**. Defines the sample size as previously mentioned, the number of successful samples needed to call the backend healthy. For example, assume a Front Door health probe interval is 30 seconds, sample size is 5, and successful sample size is 3. Each time we evaluate the health probes for your backend, we look at the last five samples over 150 seconds (5 x 30). At least three successful probes are required to declare the backend as healthy.

- **Latency sensitivity (additional latency)**. Defines whether you want Front Door to send the request to backends within the latency measurement sensitivity range or forward the request to the closest backend.

For more information, see [Least latency based routing method](front-door-routing-methods.md#latency).

## Next steps

- [Create a Front Door profile](quickstart-create-front-door.md)
- [How Front Door works](front-door-routing-architecture.md)