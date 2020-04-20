---
title:  Tutorial - Integrate Azure Spring Cloud with Azure Load Balance Solutions
description: How to integrate Azure Spring Cloud with Azure Load Balance Solutions
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: how-to
ms.date: 04/20/2020
---

# Integrate Azure Spring Cloud with Azure Load Balance Solutions

Azure Spring Cloud supports microservices on Azure.  A growing business can require multiple data centers with management of multiple Azure Spring Cloud instances.

Azure already provides different load-balance solutions. There are three options to integrate Azure Spring Cloud with Azure load-balance solutions:

1.	Integrate Azure Spring Cloud with Azure Traffic Manager
2.	Integrate Azure Spring Cloud with Azure App Gateway
3.	Integrate Azure Spring Cloud with Azure Front Door

## Prerequisites

* Azure Spring Cloud: [How to create an Azure spring cloud service](https://docs.microsoft.com/azure/spring-cloud/spring-cloud-quickstart-launch-app-portal)
* Azure Traffic Manager: [How to create a traffic manager](https://docs.microsoft.com/azure/traffic-manager/quickstart-create-traffic-manager-profile/)
* Azure App Gateway: [How to create an application gateway](https://docs.microsoft.com/azure/application-gateway/quick-create-portal)
* Azure Front Door: [How to create a front door](https://docs.microsoft.com/azure/frontdoor/quickstart-create-front-door)

## Integrate Azure Spring Cloud with Azure Traffic Manager

To integrate Azure spring cloud with Traffic Manager, add its public endpoints as traffic manager’s endpoints and then configure custom domain for both traffic manager and Azure spring cloud.

### Add Endpoint in Traffic Manager
Add endpoints in traffic manager:
1.	Specify **Type** to be *External endpoint*.
1.	Input fully qualified domain name (FQDN) of each Azure spring cloud public endpoint.
1. Click **OK**.

    ![Traffic Manager 1](media/spring-cloud-load-balancers/traffic-manager-1.png)
    ![Traffic Manager 2](media/spring-cloud-load-balancers/traffic-manager-2.png)

### Configure Custom Domain
To finish the configuration:
1.	Sign in to the website of your domain provider, and create a CNAME record mapping from your custom domain to traffic manager’s Azure default domain name.
1. 	Follow instructions [How to add custom domain to Azure Spring Cloud](spring-cloud/spring-cloud-tutorial-custom-domain.md).
1. Add above custom domain binding to traffic manager to Azure spring cloud corresponding app service and upload SSL certificate there.

    ![Traffic Manager 3](media/spring-cloud-load-balancers/traffic-manager-3.png)

## Integrate Azure Spring Cloud with Azure App Gateway


## Integrate Azure Spring Cloud with Azure Front Door


## Next steps
