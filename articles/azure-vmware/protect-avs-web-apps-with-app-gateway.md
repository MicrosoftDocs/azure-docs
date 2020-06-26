---
title: Use Azure Application Gateway to protect your web apps on Azure VMware Solution
description: Configure Azure Application Gateway to securely expose your web apps running on Azure VMware Solution (AVS).
ms.topic: how-to
ms.date: 06/25/2020
---

# Use Azure Application Gateway to protect your web apps on Azure VMware Solution

[Azure Application Gateway](https://azure.microsoft.com/services/application-gateway/) is a layer 7 web traffic load balancer that enables you to manage traffic to your web applications. In this article, we'll walk through a common scenario using Application Gateway in front of a web server farm with a set of configurations and recommendations to protect a web app running on Azure VMware Solution (AVS). 

Application Gateway offers many capabilities, including incoming traffic distribution using cookie-based session affinity, URL-based routing, Web Application Firewall (WAF), native support for Websocket and HTTP/2 protocols, [and more](https://docs.microsoft.com/en-us/azure/application-gateway/features). It is offered in two versions, v1 and v2. Both have been tested with web apps running on Azure VMware Solution (AVS). 

## Topology
As shown in the following figure, Application Gateway can be used to protect Azure IaaS virtual machines, Azure VM scale sets, or on-premises servers. AVS virtual machines will be treated as on-premises servers by Application Gateway.

:::image type="content" source="media/protect-avs-web-apps-with-app-gw/app-gateway-protects.png" alt-text="Application Gateway protects AVS VMs.":::

> [!IMPORTANT]
> Azure Application Gateway is currently the only supported method to expose web apps running on AVS virtual machines.

The following diagram shows the testing scenario used to validate Application Gateway with AVS web applications.

:::image type="content" source="media/protect-avs-web-apps-with-app-gw/app-gateway-avs-scenario.png" alt-text="Application Gateway integration with AVS running web apps.":::

The Application Gateway instance is deployed on the hub in a dedicated subnet. It has an Azure public IP address; activating Standard DDoS protection for the virtual network is recommended. The web server is hosted on an AVS private cloud behind NSX T0 and T1 routers. AVS uses [ExpressRoute Global Reach](https://docs.microsoft.com/azure/expressroute/expressroute-global-reach) to enable the communication with the hub and on-premises systems.

## Deployment and configuration

1. In the Azure Portal, search for **Application Gateway** and select **Create application gateway**.

2. Provide the basic details as in the following figure; then select **Next:Frontends>**. 

    :::image type="content" source="media/protect-avs-web-apps-with-app-gw/create-app-gateway.png" alt-text="Application Gateway creation":::

3. Choose the frontend IP address type. For public, choose an existing public IP address or create a new one. Select **Next:Backends>**.

    :::image type="content" source="media/protect-avs-web-apps-with-app-gw/create-app-gateway-frontends.png" alt-text="Create Application Gateway frontends":::

    > [!NOTE]
    > Only standard and Web Application Firewall (WAF) SKUs are supported for private frontends.

4. Next add a backend pool, which describes a set of instances that are part of the application or service&mdash;in this case virtual machines running on AVS infrastructure. Provide the details of web servers running on the AVS Private cloud and select **Add**; then select **Next:Configuration>**.

    :::image type="content" source="media/protect-avs-web-apps-with-app-gw/create-app-gateway-backend.png" alt-text="Add a backend pool to Application Gateway.":::

5. On the **Configuration** tab, select **Add a routing rule**

    :::image type="content" source="media/protect-avs-web-apps-with-app-gw/config-tab-add-routing-rule.png" alt-text="Adding routing rules to Application Gateway.":::

6. On the **Listener** tab, provide the details for the listener. If HTTPS is selected, a certificate must be provided, either from a PFX file or an existing certificate from Azure Key Vault. 

    :::image type="content" source="media/protect-avs-web-apps-with-app-gw/add-routing-rule-listener.png" alt-text="Application Gateway routing rules listener settings.":::

7. Select the **Backend targets** tab and select the backend pool previously created. For the **HTTP settings** field, select **Add new**.

    :::image type="content" source="media/protect-avs-web-apps-with-app-gw/add-routing-rule-backend-trgts.png" alt-text="Application Gateway routing rules backend targets settings.":::

8. Configure the parameters for the HTTP settings. Select **Add**.

    :::image type="content" source="media/protect-avs-web-apps-with-app-gw/create-app-gateway-http.png" alt-text="Application Gateway Routing Rules HTTP settings.":::

9. If you want to configure path-based rules, select **Add multiple targets to create a path-based rule**. 

    :::image type="content" source="media/protect-avs-web-apps-with-app-gw/create-app-gw-path-rule1.png" alt-text="Application Gateway Routing Rules":::

10. Add a path-based rule and select **Add**. Repeat to add additional path-based rules. 

      :::image type="content" source="media/protect-avs-web-apps-with-app-gw/create-app-gw-path-rule2.png" alt-text="Adding path-based rules to Application Gateway.":::  

11. When you have finished adding path-based rules, select **Add** again; then select **Next:Tags>**. 

12. Add any desired tags. Select **Next:Review + Create>**.

13. A validation will run on your Application Gateway; if it is successful, select **Create** to deploy.

## Additional considerations

After your Application Gateway is deployed, additional settings can be set to cover different scenarios. Implementing configurations for features like multi-site hosting, HTTP header rewriting, or URL path-based routing is perfectly doable when combining Application Gateway with AVS running web apps, since AVS VMs are treated as on-premises servers. See [Application Gateway service documentation](https://docs.microsoft.com/azure/application-gateway/) for more details.
