---
title: Secure traffic to origins - Azure Front Door
description: This article explains how to restrict traffic to your origins to ensure it's been processed by Azure Front Door.
services: front-door
author: johndowns
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 10/19/2022
ms.author: jodowns
zone_pivot_groups: front-door-tiers
---

# Secure traffic to Azure Front Door origins

Front Door's features work best when traffic only flows through Front Door. You should configure your origin to block traffic that hasn't been sent through Front Door. Otherwise, traffic might bypass Front Door's web application firewall, DDoS protection, and other security features.

::: zone pivot="front-door-standard-premium"

Front Door provides several approaches that you can use to restrict your origin traffic.

### Private Link origins

When you use the premium SKU of Front Door, you can use Private Link to send traffic to your origin. [Learn more about Private Link origins.](private-link.md)

You should configure your origin to disallow traffic that doesn't come through Private Link. The way that you do this depends on the type of Private Link origin you use:

- Azure App Service and Azure Functions automatically disable access through public internet endpoints when you use Private Link. For more information, see [Using Private Endpoints for Azure Web App](../app-service/networking/private-endpoint.md).
- Azure Storage provides a firewall, which you can use to deny traffic from the internet. For more information, see [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md).
- Internal load balancers with Azure Private Link service aren't publicly routable. You can also configure network security groups to ensure that you disallow access to your virtual network from the internet.

::: zone-end

### Public IP address-based origins

When you use public IP address-based origins, there are two approaches you should use together to ensure that traffic flows through your Front Door instance:

- Configure IP address filtering to ensure that requests to your origin are only accepted from the Front Door IP address ranges.
- Configure your application to verify the `X-Azure-FDID` header value, which Front Door attaches to all requests to the origin, and ensure that its value matches your Front Door's identifier.

#### IP address filtering

Configure IP ACLing for your backends to accept traffic from Azure Front Door's backend IP address space and Azure's infrastructure services only. Refer the IP details below for ACLing your backend:

    - Refer *AzureFrontDoor.Backend* section in [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) for Front Door's backend IP address range or you can also use the service tag *AzureFrontDoor.Backend* in your [network security groups](../virtual-network/network-security-groups-overview.md#security-rules).
    - Azure's [basic infrastructure services](../virtual-network/network-security-groups-overview.md#azure-platform-considerations) through virtualized host IP addresses: `168.63.129.16` and `169.254.169.254`

    > [!WARNING]
    > Front Door's backend IP space may change later, however, we will ensure that before that happens, that we would have integrated with [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519). We recommend that you subscribe to [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) for any changes or updates.

#### Front Door identifier

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