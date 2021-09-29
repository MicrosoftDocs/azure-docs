---
title: Origin and Origin group in Azure Front Door Standard/Premium
description: This article describes what origin and origin group are in an Azure Front Door configuration.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 02/18/2021
ms.author: duau
---

# Origin and Origin group in Azure Front Door Standard/Premium (Preview)

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

This article will cover concepts about how your web application deployment works with Azure Front Door Standard/Premium. You'll also learn about what an *origin* and *origin group* is in the Azure Front Door Standard/Premium configuration.

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Origin

Azure Front Door Standard/Premium origin refers to the host name or public IP of your application that serves your client requests. Azure Front Door Standard/Premium supports both Azure origins and also non-Azure origins, such as when application your application is hosted in your on-premises datacenter or with another cloud provider. Origin shouldn't be confused with your database tier or storage tier. Origin should be viewed as the endpoint for your application backend. When you add an origin to an Azure Front Door Standard/Premium origin group, you must also add the following information:

* **Origin type:** The type of resource you want to add. Front Door supports autodiscovery of your application backends from App Service, Cloud Service, or Storage. If you want a different resource in Azure or even a non-Azure backend, select **Custom host**.

    >[!IMPORTANT]
    >During configuration, APIs doesn't validate if the origin is not accessible from the Front Door environment. Make sure that Front Door can reach your origin.

* **Subscription and Origin host name:** If you didn't select **Custom host** for your backend host type, select your backend by choosing the appropriate subscription and the corresponding backend host name.

* **Origin host header:** The host header value sent to the backend for each request. For more information, see [Origin host header](#hostheader).

* **Priority:** Assign priorities to your different origin when you want to use a primary origin for all traffic. Also, provide backups if the primary or the backup origins are unavailable. For more information, see [Priority](#priority).

* **Weight:** Assign weights to your different origin to distribute traffic across a set of origins, either evenly or according to weight coefficients. For more information, see [Weights](#weighted).

### <a name = "hostheader"></a>Origin host header

Requests that are forwarded by Azure Front Door Standard/Premium to an origin will include a host header field that the origin uses to retrieve the targeted resource. The value for this field typically comes from the origin URI that has the host header and port.

For example, a request made for `www.contoso.com` will have the host header `www.contoso.com`. If you use Azure portal to configure your origin, the default value for this field is the host name of the backend. If your origin is `contoso-westus.azurewebsites.net`, in the Azure portal, the autopopulated value for the origin host header will be `contoso-westus.azurewebsites.net`. However, if you use Azure Resource Manager templates or another method without explicitly setting this field, Front Door will send the incoming host name as the value for the host header. If the request was made for `www.contoso.com`, and your origin is `contoso-westus.azurewebsites.net` that has an empty header field, Front Door will set the host header as `www.contoso.com`.

Most app backends (Azure Web Apps, Blob storage, and Cloud Services) require the host header to match the domain of the backend. However, the frontend host that routes to your backend will use a different hostname such as `www.contoso.net`.

If your origin requires the host header to match the backend hostname, make sure that the backend host header includes the hostname of the backend.

#### Configuring the origin host header for the origin

To configure the **origin host header** field for an origin in the origin group section:

1. Open your Front Door resource and select the origin group with the origin to configure.

2. Add an origin if you haven't done so, or edit an existing one.

3. Set the origin host header field to a custom value or leave it blank. The hostname for the incoming request will be used as the host header value.

## Origin group

An origin group in Azure Front Door Standard/Premium refers to the set of origins that receives similar traffic for their application. In other words, it's a logical grouping of your application instances across the world that receive the same traffic and respond with an expected behavior. These origins can be deployed across different regions or within the same region. All origins can be in Active/Active deployment mode or what is defined as Active/Passive configuration.

An origin group defines how origins should be evaluated via health probes. It also defines how load balancing occurs between them.

### Health probes

Azure Front Door Standard/Premium sends periodic HTTP/HTTPS probe requests to each of your configured origins. Probe requests determine the proximity and health of each origin to load balance your end-user requests. Health probe settings for an origin group define how we poll the health status of app backends. The following settings are available for load-balancing configuration:

* **Path**: The URL used for probe requests for all the origins in the origin group. For example, if one of your origins is `contoso-westus.azurewebsites.net` and the path gets set to /probe/test.aspx, then Front Door environments, assuming the protocol is HTTP, will send health probe requests to `http://contoso-westus.azurewebsites.net/probe/test.aspx`.

* **Protocol**: Defines whether to send the health probe requests from Front Door to your origins with HTTP or HTTPS protocol.

* **Method**: The HTTP method to be used for sending health probes. Options include GET or HEAD (default).
    > [!NOTE]
    > For lower load and cost on your backends, Front Door recommends using HEAD requests for health probes.

* **Interval (seconds)**: Defines the frequency of health probes to your origins, or the intervals in which each of the Front Door environments sends a probe.

    >[!NOTE]
    >For faster failovers, set the interval to a lower value. The lower the value, the higher the health probe volume your backends receive. For example, if the interval is set to 30 seconds with say, 100 Front Door POPs globally, each backend will receive about 200 probe requests per minute.

For more information, see [Health probes](concept-health-probes.md).

### Load-balancing settings

Load-balancing settings for the origin group define how we evaluate health probes. These settings determine if the origin is healthy or unhealthy. They also check how to load-balance traffic between different origins in the origin group. The following settings are available for load-balancing configuration:

* **Sample size:** Identifies how many samples of health probes we need to consider for origin health evaluation.

* **Successful sample size:** Defines the sample size as previously mentioned, the number of successful samples needed to call the origin healthy. For example, assume a Front Door health probe interval is 30 seconds, sample size is 5, and successful sample size is 3. Each time we evaluate the health probes for your origin, we look at the last five samples over 150 seconds (5 x 30). At least three successful probes are required to declare the origin as healthy.

* **Latency sensitivity (extra latency):** Defines whether you want Azure Front Door Standard/Premium to send the request to the origin within the latency measurement sensitivity range or forward the request to the closest backend.

For more information, see [Least latency based routing method](#latency).

## Routing methods

Azure Front Door Standard/Premium supports different kinds of traffic-routing methods to determine how to route your HTTP/HTTPS traffic to different service endpoints. When your client requests reaching Front Door, the configured routing method gets applied to ensure the requests are forwarded to the best backend instance. 

There are four traffic routing methods available in Azure Front Door Standard/Premium:

* **[Latency](#latency):** The latency-based routing ensures that requests are sent to the lowest latency backends acceptable within a sensitivity range. Basically, your user requests are sent to the "closest" set of backends in respect to network latency.
* **[Priority](#priority):** You can assign priorities to your backends when you want to configure a primary backend to service all traffic. The secondary backend can be a backup in case the primary backend becomes unavailable.
* **[Weighted](#weighted):** You can assign weights to your backends when you want to distribute traffic across a set of backends. Whether you want to evenly distribute or according to the weight coefficients.

All Azure Front Door Standard/Premium configurations include monitoring of backend health and automated instant global failover. For more information, see [Backend Monitoring](concept-health-probes.md). Your Front Door can work based off of a single routing method. But depending on your application needs, you can also combine multiple routing methods to build an optimal routing topology.

### <a name = "latency"></a>Lowest latencies based traffic-routing

Deploying backends in two or more locations across the globe can improve the responsiveness of your applications by routing traffic to the destination that is 'closest' to your end users. The default traffic-routing method for your Front Door configuration forwards requests from your end users to the closest backend of the Front Door environment that received the request. Combined with the Anycast architecture of Azure Front Door, this approach ensures that each of your end users get maximum performance personalized based on their location.

The 'closest' backend isn't necessarily closest as measured by geographic distance. Instead, Front Door determines the closest backends by measuring network latency.

Below is the overall decision flow:

| Available backends | Priority | Latency signal (based on health probe) | Weights |
|-------------| ----------- | ----------- | ----------- |
| First, select all backends that are enabled and returned healthy (200 OK) for the health probe. If there are six backends A, B, C, D, E, and F, and among them C is unhealthy and E is disabled. The list of available backends is A, B, D, and F.  | Next, the top priority backends among the available ones are selected. If backend A, B, and D have priority 1 and backend F has a priority of 2. Then, the selected backends will be A, B, and D.| Select the backends with latency range (least latency & latency sensitivity in ms specified). If backend A is 15 ms, B is 30 ms and D is 60 ms away from the Front Door environment where the request landed, and latency sensitivity is 30 ms, then the lowest latency pool consist of backend A and B, because D is beyond 30 ms away from the closest backend that is A. | Lastly, Front Door will round robin the traffic among the final selected pool of backends in the ratio of weights specified. Say, if backend A has a weight of 5 and backend B has a weight of 8, then the traffic will be distributed in the ratio of 5:8 among backends A and B. |

>[!NOTE]
> By default, the latency sensitivity property is set to 0 ms, that is, always forward the request to the fastest available backend.

### <a name = "priority"></a>Priority-based traffic-routing

Often an organization wants to provide high availability for their services by deploying more than one backup service in case the primary one goes down. Across the industry, this topology is also referred to as Active/Standby or Active/Passive deployment topology. The 'Priority' traffic-routing method allows Azure customers to easily implement this failover pattern.

Your default Front Door contains an equal priority list of backends. By default, Front Door sends traffic only to the top priority backends (lowest value for priority) that is, the primary set of backends. If the primary backends aren't available, Front Door routes the traffic to the secondary set of backends (second lowest value for priority). If both the primary and secondary backends aren't available, the traffic goes to the third, and so on. Availability of the backend is based on the configured status (enabled or disabled) and the ongoing backend health status as determined by the health probes.

#### Configuring priority for backends

Each backend in your backend pool of the Front Door configuration has a property called 'Priority', which can be a number between 1 and 5. With Azure Front Door, you configure the backend priority explicitly using this property for each backend. This property is a value between 1 and 5. Lower values represent a higher priority. Backends can share priority values.

### <a name = "weighted"></a>Weighted traffic-routing method
The 'Weighted' traffic-routing method allows you to distribute traffic evenly or to use a pre-defined weighting.

In the Weighted traffic-routing method, you assign a weight to each backend in the Front Door configuration of your backend pool. The weight is an integer from 1 to 1000. This parameter uses a default weight of '50'.

With the list of available backends that have an acceptable latency sensitivity, the traffic gets distributed with a round-robin mechanism using the ratio of weights specified. If the latency sensitivity gets set to 0 milliseconds, then this property doesn't take effect unless there are two backends with the same network latency. 

The weighted method enables some useful scenarios:

* **Gradual application upgrade**: Gives a percentage of traffic to route to a new backend, and gradually increase the traffic over time to bring it at par with other backends.
* **Application migration to Azure**: Create a backend pool with both Azure and external backends. Adjust the weight of the backends to prefer the new backends. You can gradually set this up starting with having the new backends disabled, then assigning them the lowest weights, slowly increasing it to levels where they take most traffic. Then finally disabling the less preferred backends and removing them from the pool.  
* **Cloud-bursting for additional capacity**: Quickly expand an on-premises deployment into the cloud by putting it behind Front Door. When you need extra capacity in the cloud, you can add or enable more backends and specify what portion of traffic goes to each backend.

## Next steps

Learn how to [create a Front Door Standard/Premium](create-front-door-portal.md)
