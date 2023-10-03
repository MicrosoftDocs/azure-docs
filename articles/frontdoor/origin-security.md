---
title: Secure traffic to origins
titleSuffix: Azure Front Door
description: This article explains how to ensure that your origins receive traffic only from Azure Front Door.
services: front-door
author: johndowns
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 10/02/2023
ms.author: jodowns
zone_pivot_groups: front-door-tiers
---

# Secure traffic to Azure Front Door origins

Front Door's features work best when traffic only flows through Front Door. You should configure your origin to block traffic that hasn't been sent through Front Door. Otherwise, traffic might bypass Front Door's web application firewall, DDoS protection, and other security features.

::: zone pivot="front-door-classic"

> [!NOTE]
> *Origin* and *origin group* in this article refers to the backend and backend pool of the Azure Front Door (classic) configuration.

::: zone-end

::: zone pivot="front-door-standard-premium"

Front Door provides several approaches that you can use to restrict your origin traffic.

## Private Link origins

When you use the premium SKU of Front Door, you can use Private Link to send traffic to your origin. [Learn more about Private Link origins.](private-link.md)

You should configure your origin to disallow traffic that doesn't come through Private Link. The way that you restrict traffic depends on the type of Private Link origin you use:

- Azure App Service and Azure Functions automatically disable access through public internet endpoints when you use Private Link. For more information, see [Using Private Endpoints for Azure Web App](../app-service/networking/private-endpoint.md).
- Azure Storage provides a firewall, which you can use to deny traffic from the internet. For more information, see [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md).
- Internal load balancers with Azure Private Link service aren't publicly routable. You can also configure network security groups to ensure that you disallow access to your virtual network from the internet.

::: zone-end

## Public IP address-based origins

When you use public IP address-based origins, there are two approaches you should use together to ensure that traffic flows through your Front Door instance:

- Configure IP address filtering to ensure that requests to your origin are only accepted from the Front Door IP address ranges.
- Configure your application to verify the `X-Azure-FDID` header value, which Front Door attaches to all requests to the origin, and ensure that its value matches your Front Door's identifier.

### IP address filtering

Configure IP address filtering for your origins to accept traffic from Azure Front Door's backend IP address space and Azure's infrastructure services only.

The *AzureFrontDoor.Backend* service tag provides a list of the IP addresses that Front Door uses to connect to your origins. You can use this service tag within your [network security group rules](../virtual-network/network-security-groups-overview.md#security-rules). You can also download the [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519) data set, which is updated regularly with the latest IP addresses.

You should also allow traffic from Azure's [basic infrastructure services](../virtual-network/network-security-groups-overview.md#azure-platform-considerations) through the virtualized host IP addresses `168.63.129.16` and `169.254.169.254`.

> [!WARNING]
> Front Door's IP address space changes regularly. Ensure that you use the *AzureFrontDoor.Backend* service tag instead of hard-coding IP addresses.

### Front Door identifier

IP address filtering alone isn't sufficient to secure traffic to your origin, because other Azure customers use the same IP addresses. You should also configure your origin to ensure that traffic has originated from *your* Front Door profile.

Azure generates a unique identifier for each Front Door profile. You can find the identifier in the Azure portal, by looking for the *Front Door ID* value in the Overview page of your profile.

When Front Door makes a request to your origin, it adds the `X-Azure-FDID` request header. Your origin should inspect the header on incoming requests, and reject requests where the value doesn't match your Front Door profile's identifier.

### Example configuration

The following examples show how you can secure different types of origins.

# [App Service and Functions](#tab/app-service-functions)

You can use [App Service access restrictions](../app-service/app-service-ip-restrictions.md#restrict-access-to-a-specific-azure-front-door-instance) to perform IP address filtering as well as header filtering. The capability is provided by the platform, and you don't need to change your application or host.

# [Application Gateway](#tab/application-gateway)

Application Gateway is deployed into your virtual network. Configure a network security group rule to allow inbound access on ports 80 and 443 from the *AzureFrontDoor.Backend* service tag, and disallow inbound traffic on ports 80 and 443 from the *Internet* service tag.

Use a custom WAF rule to check the `X-Azure-FDID` header value.  For more information, see [Create and use Web Application Firewall v2 custom rules on Application Gateway](../web-application-firewall/ag/create-custom-waf-rules.md#example-7).

# [IIS](#tab/iis)

When you run [Microsoft Internet Information Services (IIS)](https://www.iis.net/) on an Azure-hosted virtual machine, you should create a network security group in the virtual network that hosts the virtual machine. Configure a network security group rule to allow inbound access on ports 80 and 443 from the *AzureFrontDoor.Backend* service tag, and disallow inbound traffic on ports 80 and 443 from the *Internet* service tag.

Use an IIS configuration file like in the following example to inspect the `X-Azure-FDID` header on your incoming requests:

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

# [AKS NGINX controller](#tab/aks-nginx)

When you run [AKS with an NGINX ingress controller](../aks/ingress-basic.md), you should create a network security group in the virtual network that hosts the AKS cluster. Configure a network security group rule to allow inbound access on ports 80 and 443 from the *AzureFrontDoor.Backend* service tag, and disallow inbound traffic on ports 80 and 443 from the *Internet* service tag.

Use a Kubernetes ingress configuration file like in the following example to inspect the `X-Azure-FDID` header on your incoming requests:

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
    SecRule &REQUEST_HEADERS:X-Azure-FDID \"@eq 0\"  \"log,deny,id:106,status:403,msg:\'Front Door ID not present\'\"
    SecRule REQUEST_HEADERS:X-Azure-FDID \"@rx ^(?!xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).*$\"  \"log,deny,id:107,status:403,msg:\'Wrong Front Door ID\'\"
spec:
  #section omitted on purpose
```

---

## Next steps

- Learn how to configure a [WAF profile on Front Door](front-door-waf.md). 
- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
