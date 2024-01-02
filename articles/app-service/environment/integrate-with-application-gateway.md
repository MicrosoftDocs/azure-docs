---
title: Integrate with Application Gateway
description: Learn on how to integrate an app in your ILB App Service Environment with an Application Gateway in this end-to-end walk-through.
author: madsd

ms.assetid: a6a74f17-bb57-40dd-8113-a20b50ba3050
ms.topic: article
ms.date: 10/12/2021
ms.author: madsd
ms.custom: seodec18
---
# Integrate your ILB App Service Environment with the Azure Application Gateway

The [App Service Environment][AppServiceEnvironmentoverview] is a deployment of Azure App Service in the subnet of a customer's Azure virtual network. It can be deployed with an external or internal endpoint for app access. The deployment of the App Service environment with an internal endpoint is called an internal load balancer (ILB) App Service environment (ASE).

Web application firewalls help secure your web applications by inspecting inbound web traffic to block SQL injections, Cross-Site Scripting, malware uploads & application DDoS and other attacks. You can get a WAF device from the Azure Marketplace or you can use the [Azure Application Gateway][appgw].

The Azure Application Gateway is a virtual appliance that provides layer 7 load balancing, TLS/SSL offloading, and web application firewall (WAF) protection. It can listen on a public IP address and route traffic to your application endpoint. The following information describes how to integrate a WAF-configured application gateway with an app in an ILB App Service environment.  

The integration of the application gateway with the ILB App Service environment is at an app level. When you configure the application gateway with your ILB App Service environment, you're doing it for specific apps in your ILB App Service environment. This technique enables hosting secure multitenant applications in a single ILB App Service environment.  

:::image type="content" source="./media/integrate-with-application-gateway/appgw-highlevel.png" alt-text="Screenshot of High level integration diagram":::

In this walkthrough, you will:

* Create an Azure Application Gateway.
* Configure the application gateway to point to an app in your ILB App Service environment.
* Edit the public DNS host name that points to your application gateway.

## Prerequisites

To integrate your application gateway with your ILB App Service environment, you need:

* An ILB App Service environment.
* A private DNS zone for ILB App Service environment.
* An app running in the ILB App Service environment.
* A public DNS name that's used later to point to your application gateway.
* If you need to use TLS/SSL encryption to the application gateway, a valid public certificate that's used to bind to your application gateway is required.

### ILB App Service environment

For details on how to create an ILB App Service environment, see [Create an ASE in the Azure portal][creation] and [Create an ASE with ARM template][createfromtemplate].

* After ILB ASE is created, the default domain is `<YourAseName>.appserviceenvironment.net`.

    :::image type="content" source="./media/integrate-with-application-gateway/ilb-ase.png" alt-text="Screenshot of ILB ASE Overview":::

* An internal load balancer is provisioned for inbound access. You can check the Inbound address in the IP addresses under ASE Settings. You can create a private DNS zone mapped to this IP address later.

    :::image type="content" source="./media/integrate-with-application-gateway/ip-addresses.png" alt-text="Screenshot of getting the inbound address from ILB ASE IP addresses settings.":::

### A private DNS zone

You need a [private DNS zone][privatednszone] for internal name resolution. Create it using the ASE name using the record sets shown in the following table (for instructions, see [Quickstart - Create an Azure private DNS zone using the Azure portal][createprivatednszone]).

| Name  | Type | Value               |
| ----- | ---- | ------------------- |
| *     | A    | ASE inbound address |
| @     | A    | ASE inbound address |
| @     | SOA  | ASE DNS name        |
| *.scm | A    | ASE inbound address |

### App Service on ILB ASE

You need to create an App Service plan and an app in your ILB ASE. When creating the app in the portal, select your ILB ASE as the **Region**.

### A public DNS name to the application gateway

To connect to the application gateway from internet, you need a routable domain name. In this case, I used a routable domain name `asabuludemo.com` and planning to connect to an App Service with this domain name `app.asabuludemo.com`. The IP addresses mapped to this app domain name need to set to the public IP after the application gateway created.
With a public domain mapped to the application gateway, you don't need to configure a custom domain in App Service. You can buy a custom domain name with [App Service Domains](../manage-custom-dns-buy-domain.md#buy-and-map-an-app-service-domain). 

### A valid public certificate

For security enhancement, it's recommended to bind TLS/SSL certificate for session encryption. To bind TLS/SSL certificate to the application gateway, a valid public certificate with following information is required. With [App Service certificates](../configure-ssl-app-service-certificate.md), you can buy a TLS/SSL certificate and export it in .pfx format.

| Name  | Value               | Description|
| ----- | ------------------- |------------|
| **Common Name** |`<yourappname>.<yourdomainname>`, for example: `app.asabuludemo.com`  <br/> or `*.<yourdomainname>`, for example: `*.asabuludemo.com` | A standard certificate or a [wildcard certificate](https://wikipedia.org/wiki/Wildcard_certificate) for the application gateway|
| **Subject Alternative Name** | `<yourappname>.scm.<yourdomainname>`, for example: `app.scm.asabuludemo.com`  <br/>or `*.scm.<yourdomainname>`, for example: `*.scm.asabuludemo.com` |The SAN that allowing to connect to App Service kudu service. It's an optional setting, if you don't want to publish the App Service kudu service to the internet.|

The certificate file should have a private key and save in .pfx format, it will be imported to the application gateway later.

## Create an application gateway

For the basic application gateway creation, refer to [Tutorial: Create an application gateway with a Web Application Firewall using the Azure portal][Tutorial: Create an application gateway with a Web Application Firewall using the Azure portal].

In this tutorial, we'll use Azure portal to create an application gateway with ILB App Service environment.

In the Azure portal, select **New** > **Network** > **Application Gateway** to create an application gateway.

1. Basics setting

    In **Tier** dropdown list, you can select **Standard V2** or  **WAF V2** to enable **WAF** feature on the application gateway. 

2. Frontends setting

    Select Frontend IP address type to **Public**, **Private** or **Both** . If you set to **Private** or **Both**, you need to assign a static IP address in the application gateway subnet range. In this case, we set to Public IP for public endpoint only.
    
    * Public IP address - You need to associate a public IP address for the application gateway public access. Record this IP address, you need to add a record in your DNS service later.
    
        :::image type="content" source="./media/integrate-with-application-gateway/frontends.png" alt-text="Screenshot of getting a public IP address from the application gateway frontends setting.":::

3. Backends setting

    Input a backend pool name and select the **App Services** or **IP address or FQDN** in **Target type**. In this case, we set to **App services** and select App Service name from the target dropdown list.

    :::image type="content" source="./media/integrate-with-application-gateway/add-backend-pool.png" alt-text="Screenshot of adding a backend pool name in backends setting.":::

4. Configuration setting

    In **Configuration** setting, you need to add a routing rule by selecting **Add a routing rule** icon.

    :::image type="content" source="./media/integrate-with-application-gateway/configuration.png" alt-text="Screenshot of adding a routing rule in configuration setting.":::

    You need to configure a **Listener** and  **Backend targets** in a routing rule. You can add an HTTP listener for proof of concept deployment or add an HTTPS listener for security enhancement.

    * To connect to the application gateway with HTTP protocol, you can create a listener with following settings,
    
        | Parameter      | Value                             | Description                                                  |
        | -------------- | --------------------------------- | ------------------------------------------------------------ |
        | Rule name      | For example: `http-routingrule`    | Routing name                                                 |
        | Listener name  | For example: `http-listener`       | Listener name                                                |
        | Frontend IP    | Public                            | For internet access, set to Public                           |
        | Protocol       | HTTP                             | Don't use TLS/SSL encryption                                       |
        | Port           | 80                               | Default HTTP Port                                           |
        | Listener type  | Multi site                        | Allow to listen multi-sites on the application gateway           |
        | Host type      | Multiple/Wildcard                 | Set to multiple or wildcard website name if listener type is set to multi-sites. |
        | Host name      | For example:  `app.asabuludemo.com` | Set to a routable domain name for App Service              |
        
        :::image type="content" source="./media/integrate-with-application-gateway/http-routing-rule.png" alt-text="Screenshot of HTTP Listener of the application gateway Routing Rule.":::
    
    * To connect to the application gateway with TLS/SSL encryption, you can create a listener with following settings,
    
        | Parameter      | Value                             | Description                                                  |
        | -------------- | --------------------------------- | ------------------------------------------------------------ |
        | Rule name      | For example: `https-routingrule`    | Routing name                                                 |
        | Listener name  | For example: `https-listener`       | Listener name                                                |
        | Frontend IP    | Public                            | For internet access, set to Public                           |
        | Protocol       | HTTPS                             | Use TLS/SSL encryption                                       |
        | Port           | 443                               | Default HTTPS Port                                           |
        | Https Settings | Upload a certificate              | Upload a certificate contains the CN and the private key with .pfx format. |
        | Listener type  | Multi site                        | Allow to listen multi-sites on the application gateway           |
        | Host type      | Multiple/Wildcard                 | Set to multiple or wildcard website name if listener type is set to multi-sites. |
        | Host name      | For example:  `app.asabuludemo.com` | Set to a routable domain name for App Service              |
        
        :::image type="content" source="./media/integrate-with-application-gateway/https-routing-rule.png" alt-text="HTTPS listener of the application gateway Routing Rule.":::
    
    * You have to configure a **Backend Pool** and **HTTP setting** in **Backend targets**. The Backend pool was configured in previously steps. Select **Add new** link to add an HTTP setting.
    
        :::image type="content" source="./media/integrate-with-application-gateway/add-new-http-setting.png" alt-text="Screenshot of adding new link to add an H T T P setting.":::
    
    * HTTP settings listed as below:
    
        | Parameter                     | Value                                                        | Description                                                  |
        | ----------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
        | HTTP setting name             | For example: `https-setting`                                   | HTTP setting name                                            |
        | Backend protocol              | HTTPS                                                        | Use TLS/SSL encryption                                       |
        | Backend port                  | 443                                                          | Default HTTPS Port                                           |
        | Use well known CA certificate | Yes                                                          | The default domain name of ILB ASE is `.appserviceenvironment.net`, the certificate of this domain is issued by a public trusted root authority. In the Trusted root certificate setting, you can set to use **well known CA trusted root certificate**. |
        | Override with new host name   | Yes                                                          | The host name header will be overwrote on connecting to the app on ILB ASE |
        | Host name override            | Pick host name from backend target | When setting backend pool to App Service, you can pick host from backend target |
        | Create custom probes | No | Use default health probe|
        
        :::image type="content" source="./media/integrate-with-application-gateway/https-setting.png" alt-text="Screenshot of **Add an H T T P setting** dialog.":::


## Configure an application gateway integration with ILB ASE

To access ILB ASE from the application gateway, you need to check if a virtual network link to private DNS zone. If there's no virtual network linked to your application gateway's VNet, add a virtual network link with following steps.

### Configure virtual network links with a private DNS zone

* To configure virtual network link with private DNS zone, go to the private DNS zone configuration plane. Select the **Virtual network links** > **Add** 

:::image type="content" source="./media/integrate-with-application-gateway/add-vnet-link.png" alt-text="Add a virtual network link to private DNS zone.":::

* Input the **Link name** and select the respective subscription and virtual network where the application gateway resides in.

:::image type="content" source="./media/integrate-with-application-gateway/vnet-link.png" alt-text="Screenshot of input link name details to virtual network links setting in private DNS zone.":::

* You can confirm the backend health status from **Backend health** in the application gateway plane.

:::image type="content" source="./media/integrate-with-application-gateway/backend-health.png" alt-text="Screenshot of confirm the backend health status from backend health.":::

### Add a public DNS record

You need to configure a proper DNS mapping when access to the application gateway from internet.

* The public IP address of the application gateway can be found in **Frontend IP configurations** in the application gateway plane.

:::image type="content" source="./media/integrate-with-application-gateway/frontend-ip.png" alt-text="Application gateway frontend IP address can be found in Frontend IP configuration.":::

* Use Azure DNS service as example, you can add a record set to map the app domain name to the public IP address of the application gateway.

:::image type="content" source="./media/integrate-with-application-gateway/dns-service.png" alt-text="Screenshot of adding a record set to map the app domain name to the public IP address of the application gateway.":::

### Validate connection

* On a machine access from internet, you can verify the name resolution for the app domain name to the application gateway public IP address.

:::image type="content" source="./media/integrate-with-application-gateway/name-resolution.png" alt-text="validate the name resolution from a command prompt.":::

* On a machine access from internet, test the web access from a browser.

:::image type="content" source="./media/integrate-with-application-gateway/access-web.png" alt-text="Screenshot of opening a browser, access to the web.":::

<!--LINKS-->
[appgw]: ../../application-gateway/overview.md
[custom-domain]: ../app-service-web-tutorial-custom-domain.md
[creation]: ./creation.md
[createfromtemplate]: ./create-from-template.md
[createprivatednszone]: ../../dns/private-dns-getstarted-portal.md
[AppServiceEnvironmentoverview]: ./overview.md
[privatednszone]: ../../dns/private-dns-overview.md
[Tutorial: Create an application gateway with a Web Application Firewall using the Azure portal]: ../../web-application-firewall/ag/application-gateway-web-application-firewall-portal.md
