---
title: Origins and origin groups - Azure Front Door
description: This article explains the concept of what an origin and origin group is in a Front Door configuration.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 03/10/2022
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# Origins and origin groups in Azure Front Door

::: zone pivot="front-door-classic"

> [!NOTE]
> *Origin* and *origin group* in this article refers to the backend and backend pool of the Azure Front Door (classic) configuration.
>

::: zone-end

This article describes concepts about how to map your web application deployment with Azure Front Door. You'll also learn about what an *origin* and *origin group* is in the Azure Front Door configuration.

## Origin

An origin refers to the application deployment that Azure Front Door will retrieve contents from when caching isn't enabled or when a cache gets missed. Azure Front Door supports origins hosted in Azure as well as applications hosted in your on-premises datacenter or with another cloud provider. An origin shouldn't be confused with your database tier or storage tier. The origin should be viewed as the endpoint for your application backend. When you add an origin to an origin group in the Front Door configuration, you must also configure the following:

* **Origin type:** The type of resource you want to add. Front Door supports autodiscovery of your application backends from App Service, Cloud Service, or Storage. If you want a different resource in Azure or even a non-Azure backend, select **Custom host**.

    >[!IMPORTANT]
    >During configuration, APIs doesn't validate if the origin is not accessible from the Front Door environment. Make sure that Front Door can reach your origin.

* **Subscription and origin host name:** If you didn't select **Custom host** for your backend host type, select your backend by choosing the appropriate subscription and the corresponding backend host name.

::: zone pivot="front-door-standard-premium"

* **Private Link:** Azure Front Door Premium tier supports sending traffic to an origin by using Private Link. For more information, see [Secure your Origin with Private Link](private-link.md).

* **Certificate subject name validation:** during Azure Front Door to origin TLS connection, Azure Front Door will validate if the request host name matches the host name in the certificate provided by the origin. From a security standpoint, Microsoft doesn't recommend disabling certificate subject name check. For more information, see [End-to-end TLS encryption](end-to-end-tls.md), especially if you want to disable this feature. 

::: zone-end

* **Origin host header:** The host header value sent to the backend for each request. For more information, see [Origin host header](#origin-host-header).

* **Priority**. Assign priorities to your different backends when you want to use a primary service backend for all traffic. Also, provide backups if the primary or the backup backends are unavailable. For more information, see [Priority](routing-methods.md#priority).

* **Weight**. Assign weights to your different backends to distribute traffic across a set of backends, either evenly or according to weight coefficients. For more information, see [Weights](routing-methods.md#weighted).

### Origin host header

Requests that are forwarded by Azure Front Door to an origin will include a host header field that the origin uses to retrieve the targeted resource. The value for this field typically comes from the origin URI that has the host header and port.

For example, a request made for `www.contoso.com` will have the host header `www.contoso.com`. If you use the Azure portal to configure your origin, the default value for this field is the host name of the origin. If your origin is `contoso-westus.azurewebsites.net`, in the Azure portal, the autopopulated value for the origin host header will be `contoso-westus.azurewebsites.net`. However, if you use Azure Resource Manager templates or another method without explicitly setting this field, Front Door will send the incoming host name as the value for the host header. If the request was made for `www.contoso.com`, and your origin `contoso-westus.azurewebsites.net` has an empty header field, Front Door will set the host header as `www.contoso.com`.

Most app backends (Azure Web Apps, Blob storage, and Cloud Services) require the host header to match the domain of the backend. However, the frontend host that routes to your origin will use a different hostname such as `www.contoso.net`.

If your origin requires the host header to match the origin hostname, make sure that the origin host header includes the hostname of the origin. 

#### Configure the origin host header for the origin

To configure the **origin host header** field for an origin in the origin group section: 

1. Open your Front Door resource and select the origin group with the origin to configure. 

1. Add an origin if you haven't done so, or edit an existing one. 

1. Set the origin host header field to a custom value or leave it blank. The hostname for the incoming request will be used as the host header value. 

## Origin group

An origin group in Azure Front Door refers to a set of origins that receives similar traffic for their application. You can define the origin group as a logical grouping of your application instances across the world that receives the same traffic and responds with an expected behavior. These origins can be deployed across different regions or within the same region. All origins can be deployed in an Active/Active or Active/Passive configuration.

An origin group defines how origins should be evaluated by health probes. It also defines the load balancing method between them.

### Health probes

Azure Front Door sends periodic HTTP/HTTPS probe requests to each of your configured origins. Probe requests determine the proximity and health of each origin to load balance your end-user requests. Health probe settings for an origin group define how we poll the health status of app backends. The following settings are available for load-balancing configuration:

* **Path**: The URL used for probe requests for all the origins in the origin group. For example, if one of your origins is `contoso-westus.azurewebsites.net` and the path gets set to /probe/test.aspx, then Front Door environments, assuming the protocol is HTTP, will send health probe requests to `http://contoso-westus.azurewebsites.net/probe/test.aspx`.

* **Protocol**: Defines whether to send the health probe requests from Front Door to your origins with HTTP or HTTPS protocol.

* **Method**: The HTTP method to be used for sending health probes. Options include GET or HEAD (default).

    > [!NOTE]
    > For lower load and cost on your backends, Front Door recommends using HEAD requests for health probes.

* **Interval (seconds)**: Defines the frequency of health probes to your origins, or the intervals in which each of the Front Door environments sends a probe.

    >[!NOTE]
    >For faster failovers, set the interval to a lower value. The lower the value, the higher the health probe volume your backends receive. For example, if the interval is set to 30 seconds with say, 100 Front Door POPs globally, each backend will receive about 200 probe requests per minute.

For more information, see [Health probes](health-probes.md).

### Load-balancing settings

Load-balancing settings for the origin group define how we evaluate health probes. These settings determine if the origin is healthy or unhealthy. They also check how to load-balance traffic between different origins in the origin group. The following settings are available for load-balancing configuration:

* **Sample size:** Identifies how many samples of health probes we need to consider for origin health evaluation.

* **Successful sample size:** Defines the sample size as previously mentioned, the number of successful samples needed to call the origin healthy. For example, assume a Front Door health probe interval is 30 seconds, sample size is 5, and successful sample size is 3. Each time we evaluate the health probes for your origin, we look at the last five samples over 150 seconds (5 x 30). At least three successful probes are required to declare the origin as healthy.

* **Latency sensitivity (extra latency):** Defines whether you want Azure Front Door to send the request to the origin within the latency measurement sensitivity range or forward the request to the closest backend.

For more information, see [Least latency based routing method](routing-methods.md#latency).

## Restrict origin traffic

Front Door's features work best when traffic only flows through Front Door. You should configure your origin to block traffic that hasn't been sent through Front Door.

Front Door provides several approaches that you can use to restrict your origin traffic.

### Private Link origins

When you use the premium SKU of Front Door, you can use Private Link to send traffic to your origin. [Learn more about Private Link origins.](private-link.md)

You can then configure your origin to disallow traffic that doesn't come through Private Link. The way that you do this depends on the type of Private Link origin you use.

### Public IP address-based origins

To lock down your application to accept traffic only from your specific Front Door, you can set up IP ACLs for your backend or restrict the traffic on your backend to the specific value of the header 'X-Azure-FDID' sent by Front Door. These steps are detailed out as below:

- Configure IP ACLing for your backends to accept traffic from Azure Front Door's backend IP address space and Azure's infrastructure services only. Refer the IP details below for ACLing your backend:

    - Refer *AzureFrontDoor.Backend* section in [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) for Front Door's backend IP address range or you can also use the service tag *AzureFrontDoor.Backend* in your [network security groups](../virtual-network/network-security-groups-overview.md#security-rules).
    - Azure's [basic infrastructure services](../virtual-network/network-security-groups-overview.md#azure-platform-considerations) through virtualized host IP addresses: `168.63.129.16` and `169.254.169.254`

    > [!WARNING]
    > Front Door's backend IP space may change later, however, we will ensure that before that happens, that we would have integrated with [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519). We recommend that you subscribe to [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) for any changes or updates.

- Look for the `Front Door ID` value under the Overview section from Front Door portal page. You can then filter on the incoming header '**X-Azure-FDID**' sent by Front Door to your backend with that value to ensure only your own specific Front Door instance is allowed (because the IP ranges above are shared with other Front Door instances of other customers).

- Apply rule filtering in your backend web server to restrict traffic based on the resulting 'X-Azure-FDID' header value. Note that some services like Azure App Service provide this [header based filtering](../app-service/app-service-ip-restrictions.md#restrict-access-to-a-specific-azure-front-door-instance) capability without needing to change your application or host.

Here's an example for [Microsoft Internet Information Services (IIS)](https://www.iis.net/):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="Filter_X-Azure-FDID" patternSyntax="Wildcard" stopProcessing="true">
                    <match url="*" />
                    <conditions>
                        <add input="{HTTP_X_AZURE_FDID}" pattern="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" negate="true" />
                    </conditions>
                    <action type="AbortRequest" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```
    
Here's an example for [AKS NGINX ingress controller](../aks/ingress-basic.md):

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
    name: frontdoor-ingress
    annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/enable-modsecurity: "true"
    nginx.ingress.kubernetes.io/modsecurity-snippet: |
        SecRuleEngine On
        SecAuditLog /var/log/modsec_audit.log
        SecRule REQUEST_HEADERS:X-Azure-FDID "!@eq xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" "log,deny,id:107,status:403,msg:\'Traffic incoming from a different Frontdoor\'"
spec:
    #section omitted on purpose
```

Azure Front Door also supports the *AzureFrontDoor.Frontend* service tag, which provides the list of IP addresses that clients use when connecting to Front Door. You can use the *AzureFrontDoor.Frontend* service tag when you’re controlling the outbound traffic that should be allowed to connect to services deployed behind Azure Front Door. Azure Front Door also supports an additional service tag, *AzureFrontDoor.FirstParty*, to integrate internally with other Azure services. See [available service tags](../virtual-network/service-tags-overview.md#available-service-tags) for more details on Azure Front Door service tags use cases.

If using Application Gateway as a backend to Azure Front Door, then the check on the `X-Azure-FDID` header can be done in a custom WAF rule.  For more information, see [Create and use Web Application Firewall v2 custom rules on Application Gateway](../web-application-firewall/ag/create-custom-waf-rules.md#example-7).

## Next steps

::: zone pivot="front-door-standard-premium"

- Learn how to [create an Azure Front Door profile](create-front-door-portal.md).
- Learn about [Azure Front Door routing architecture](front-door-routing-architecture.md?pivots=front-door-standard-premium).

::: zone-end

::: zone pivot="front-door-classic"

- Learn how to [create an Azure Front Door (classic) profile](quickstart-create-front-door.md).
- Learn about [Azure Front Door (classic) routing architecture](front-door-routing-architecture.md?pivots=front-door-classic).

::: zone-end
