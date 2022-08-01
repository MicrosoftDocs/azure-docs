---
title:  Tutorial - Integrate Azure Spring Apps with Azure Load Balance Solutions
description: How to integrate Azure Spring Apps with Azure Load Balance Solutions
author: karlerickson
ms.author: karler
ms.service: spring-cloud
ms.topic: how-to
ms.date: 04/20/2020
ms.custom: devx-track-java, event-tier1-build-2022
---

# Integrate Azure Spring Apps with Azure Load Balance Solutions

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

Azure Spring Apps supports Spring applications on Azure. Increasing business can require multiple data centers with management of multiple instances of Azure Spring Apps.

Azure already provides different load-balance solutions. There are three options to integrate Azure Spring Apps with Azure load-balance solutions:

1. Integrate Azure Spring Apps with Azure Traffic Manager
2. Integrate Azure Spring Apps with Azure App Gateway
3. Integrate Azure Spring Apps with Azure Front Door

## Prerequisites

* Azure Spring Apps: [How to create an Azure Spring Apps service](./quickstart.md)
* Azure Traffic Manager: [How to create a traffic manager](../traffic-manager/quickstart-create-traffic-manager-profile.md)
* Azure App Gateway: [How to create an application gateway](../application-gateway/quick-create-portal.md)
* Azure Front Door: [How to create a front door](../frontdoor/quickstart-create-front-door.md)

## Integrate Azure Spring Apps with Azure Traffic Manager

To integrate Azure Spring Apps with Traffic Manager, add its public endpoints as traffic manager’s endpoints and then configure custom domain for both traffic manager and Azure Spring Apps.

### Add Endpoint in Traffic Manager

Add endpoints in traffic manager:

1. Specify **Type** to be *External endpoint*.
1. Input fully qualified domain name (FQDN) of each Azure Spring Apps public endpoint.
1. Select **OK**.

    ![Traffic Manager 1](media/spring-cloud-load-balancers/traffic-manager-1.png)
    ![Traffic Manager 2](media/spring-cloud-load-balancers/traffic-manager-2.png)

### Configure Custom Domain

To finish the configuration:

1. Sign in to the website of your domain provider, and create a CNAME record mapping from your custom domain to traffic manager’s Azure default domain name.
1. Follow instructions [How to add custom domain to Azure Spring Apps](./tutorial-custom-domain.md).
1. Add above custom domain binding to traffic manager to Azure Spring Apps corresponding app service and upload SSL certificate there.

    ![Traffic Manager 3](media/spring-cloud-load-balancers/traffic-manager-3.png)

## Integrate Azure Spring Apps with Azure App Gateway

To integrate with Azure Spring Apps service, complete the following configurations:

### Configure Backend Pool

1. Specify **Target type** as *IP address* or *FQDN*.
1. Enter your Azure Spring Apps public endpoints.

    ![App Gateway 1](media/spring-cloud-load-balancers/app-gateway-1.png)

### Add Custom Probe

1. Select **Health Probes** then **Add** to open custom **Probe** dialog.
1. The key point is to select *Yes* for **Pick host name from backend HTTP settings** option.

    ![App Gateway 2](media/spring-cloud-load-balancers/app-gateway-2.png)

### Configure Http Setting

1. Select **Http Settings** then **Add** to add an HTTP setting.
1. **Override with new host name:** select *Yes*.
1. **Host name override**: select **Pick host name from backend target**.
1. **Use custom probe**: select *Yes* and pick the custom probe created above.

    ![App Gateway 3](media/spring-cloud-load-balancers/app-gateway-3.png)

### Configure Rewrite Set

1. Select **Rewrites** then **Rewrite set** to add a rewrite set.
1. Select the routing rules that route requests to Azure Spring Apps public endpoints.
1. On **Rewrite rule configuration** tab, select **Add rewrite rule**.
1. **Rewrite type**: select **Request Header**
1. **Action type**: select **Delete**
1. **Header name**: select **Common header**
1. **Common Header**: select **X-Forwarded-Proto**

    ![App Gateway 4](media/spring-cloud-load-balancers/app-gateway-4.png)

## Integrate Azure Spring Apps with Azure Front Door

To integrate with Azure Spring Apps service and configure backend pool, use the following steps:

1. **Add backend pool**.
1. Specify the backend endpoint by adding host.

    ![Front Door 1](media/spring-cloud-load-balancers/front-door-1.png)

1. Specify **backend host type** as *custom host*.
1. Input FQDN of your Azure Spring Apps public endpoints in **backend host name**.
1. Accept the **backend host header** default, which is the same as **backend host name**.

    ![Front Door 2](media/spring-cloud-load-balancers/front-door-2.png)

## Next steps

* [How to create a traffic manager](../traffic-manager/quickstart-create-traffic-manager-profile.md)
* [How to create an application gateway](../application-gateway/quick-create-portal.md)
* [How to create a front door](../frontdoor/quickstart-create-front-door.md)
