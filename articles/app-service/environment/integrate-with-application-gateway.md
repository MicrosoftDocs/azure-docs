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
# Integrate your ILB App Service Environment with the Azure Application Gateway #

The [App Service Environment](./intro.md) is a deployment of Azure App Service in the subnet of a customer's Azure virtual network. It can be deployed with a public or private endpoint for app access. The deployment of the App Service Environment with a private endpoint (that is, an internal load balancer) is called an ILB App Service Environment.  

Web application firewalls help secure your web applications by inspecting inbound web traffic to block SQL injections, Cross-Site Scripting, malware uploads & application DDoS and other attacks. You can get a WAF device from the Azure marketplace or you can use the [Azure Application Gateway][appgw].

The Azure Application Gateway is a virtual appliance that provides layer 7 load balancing, TLS/SSL offloading, and web application firewall (WAF) protection. It can listen on a public IP address and route traffic to your application endpoint. The following information describes how to integrate a WAF-configured application gateway with an app in an ILB App Service Environment.  

The integration of the application gateway with the ILB App Service Environment is at an app level. When you configure the application gateway with your ILB App Service Environment, you're doing it for specific apps in your ILB App Service Environment. This technique enables hosting secure multitenant applications in a single ILB App Service Environment.  

:::image type="content" source="./media/integrate-with-application-gateway/appgw-highlevel.png" alt-text="High level integration diagram":::

In this walkthrough, you will:

* Create an Azure Application Gateway.
* Configure the Application Gateway to point to an app in your ILB App Service Environment.
* Configure your app to honor the custom domain name.
* Edit the public DNS host name that points to your application gateway.

## Prerequisites

To integrate your Application Gateway with your ILB App Service Environment, you need:

* An ILB App Service Environment.
* A private DNS zone for ILB App Service Environment.
* An app running in the ILB App Service Environment.
* A public DNS name that is used later to point to your Application Gateway.
* A valid public certificate that is used later to bind to your Application Gateway.

### ILB App Service Environment

For details on how to create an ILB App Service Environment from Azure portal, see [Create an App Service Environment][ilbase] or create from template, see [Create an ASE with ARM - Azure App Service Environment][createfromtemplate]

* After ILB ASE had been created, the default domain will be `<YourAseName>.appserviceenvironment.net`

:::image type="content" source="./media/integrate-with-application-gateway/appgw-ilbase.png" alt-text="ILB ASE Overview":::

* An internal load balancer had be provisioned for inbound access. You can check the Inbound address in the IP addresses under ASE Settings plane. You will need to create a private DNS zone mapped to this IP address later.

:::image type="content" source="./media/integrate-with-application-gateway/appgw-ipaddresses.png" alt-text="ILB ASE IP addresses":::

### Private DNS Zone

You will need a private DNS zone for internal name resolution. If you didn't configure private DNS zone while creating ASE, you have to create a private DNS zone after ASE created. To create a private DNS zone on Azure Portal, see [Quickstart - Create an Azure private DNS zone using the Azure portal][createprivatednszone], the record sets listed a below,

| Name  | Type | Value               |
| ----- | ---- | ------------------- |
| *     | A    | ASE inbound address |
| @     | A    | ASE inbound address |
| @     | SOA  | ASE DNS name        |
| *.scm | A    | ASE inbound address |

:::image type="content" source="./media/integrate-with-application-gateway/appgw-privatednszone.png" alt-text="Private DNS zone":::
### App Service on ILB ASE

You will need to create an app service and an app service plan reside in an ILB ASE. To create an app service in an ILB ASE on Azure Portal, in app service creation **Basics** setting, you need to pick the ILB ASE you created previously in the **Region** dropdown list.

:::image type="content" source="./media/integrate-with-application-gateway/appgw-createwebapp.png" alt-text="Create a Web App":::

### App Service DNS name

In order to connect to Application Gateway from internet, you need a routable domain name. In this case, I used a routable domain name `asabuludemo.com` and planning to connect to an app service with this domain name `app.asabuludemo.com`. The IP address mapped to this app domain name need to set to the public IP after Application Gateway created.

### A valid public certificate

For security enhancement, it is recommended to bind TLS/SSL certificate for session encryption. To bind TLS/SSL certificate to Application Gateway, you need a valid public certificate, the **Common Name** (**CN**) and **Subject Alternative Name** (**SAN**) of certificate should be below,

* **Common Name**: `*.<yourdomainname>`, for example: `*.asabuludemo.com`
* **Subject Alternative Name**: `*.scm.<yourdomainname>` for example: `*.scm.asabuludemo.com`. This **SAN** allow to connect to app service kudo service. This is an optional setting, if you don't want to publish the app service kudo service to the internet. 

The certificate file must contains a private kay and save to .pfx format, it will be imported to Application Gateway later.


## Create an Application Gateway

Before you start to create the Application Gateway, pick or create a subnet that you will use to host the gateway.

You should use a subnet that is not the one named GatewaySubnet. If you put the Application Gateway in GatewaySubnet, you'll be unable to create a virtual network gateway later.

You also cannot put the gateway in the subnet that your ILB App Service Environment uses. The App Service Environment is the only thing that can be in this subnet.

In this tutorial, we will use Azure Portal to create an Application Gateway.

### Create an Application Gateway on Azure Portal

On the Azure Portal, select **New** > **Network** > **Application Gateway** to create an Application Gateway

### Basics setting

In **Basics** setting, you need to input the required parameters. In **Tier** dropdown list, you can select **Standard V2** or  **WAF V2** to enable **WAF** feature on Application Gateway. 

:::image type="content" source="./media/integrate-with-application-gateway/appgw-basics.png" alt-text="Application Gateway Basics setting":::

### Frontends setting

In **Frontends** setting, you need to select Frontend IP address type to **Public**, **Private** or **Both** . If you set to **Private**

or **Both**, you will need to assign a static IP address in Application Gateway subnet range. In this case, we set to Public IP for public endpoint only.

* Public IP address - You will need to associate a public IP address for Application Gateway public access. Record this IP address, you will need to add a record in your DNS service later.

:::image type="content" source="./media/integrate-with-application-gateway/appgw-frontends.png" alt-text="Application Gateway Frontends setting":::

### Backends setting

In **Frontends** setting, you will need a backend pool name. You also need to select the **App Services** or **IP address or FQDN** in **Target type**. In this case, we set to **App services** and select app service name from the target dropdown list.

:::image type="content" source="./media/integrate-with-application-gateway/appgw-addbackendpool.png" alt-text="Application Gateway Backend Pool":::

### Configuration setting

In **Configuration** setting, you need to add a routing rule by clicking **Add a routing rule** icon.

:::image type="content" source="./media/integrate-with-application-gateway/appgw-configuration.png" alt-text="Application Gateway Configuration":::

You will need to configure a **Listener** and  **Backend targets** in a routing rule.

* The listener settings listed as below,

| Parameter      | Value                             | Description                                                  |
| -------------- | --------------------------------- | ------------------------------------------------------------ |
| Rule name      | For example: https-routingrule    | Routing name                                                 |
| Listener name  | For example: https-listener       | Listener name                                                |
| Frontend IP    | Public                            | For internet access, set to Public                           |
| Protocol       | HTTPS                             | Use TLS/SSL encryption                                       |
| Port           | 443                               | Default HTTPS Port                                           |
| Https Settings | Upload a certificate              | Upload a certificate contains the CN and the private key with .pfx format. |
| Listener type  | Multi site                        | Allow to listen multi-sites on Application Gateway           |
| Host type      | Multiple/Wildcard                 | Set to multiple or wildcard website name if listener type is set to multi-sites. |
| Host name      | For example:  app.asabuludemo.com | Set to a routable domain name for app service              |

:::image type="content" source="./media/integrate-with-application-gateway/appgw-routingrule.png" alt-text="Application Gateway Routing Rule":::

* You will need to configure a **Backend Pool** and  **HTTP setting** in **Backend targets**. The Backend pool was configured in previously steps. You need to add a HTTP setting.

:::image type="content" source="./media/integrate-with-application-gateway/appgw-addnewhttpsetting.png" alt-text="Application Gateway add a HTTP setting":::

* HTTP settings listed as below:

| Parameter                     | Value                                                        | Description                                                  |
| ----------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| HTTP setting name             | For example: https-setting                                   | HTTP setting name                                            |
| Backend protocol              | HTTPS                                                        | Use TLS/SSL encryption                                       |
| Backend port                  | 443                                                          | Default HTTPS Port                                           |
| Use well known CA certificate | Yes                                                          | The default domain name of ILB ASE is **.appserviceenvironment.net**, the certificate of this domain is issued by an public trusted root authority. In the Trusted root certificate setting, you can set to use **well known CA trusted root certificate**. |
| Override with new host name   | Yes                                                          | The host name header will be overwrote on connecting to the app on ILB ASE |
| Host name override            | Override with specific domain name<br />For example: app.asev3-ilb-20211008.appserviceenvironment.net | Set host name to the private DNS record of the app on ILB ASE |

:::image type="content" source="./media/integrate-with-application-gateway/appgw-httpsetting.png" alt-text="Application Gateway HTTP settings":::


## Configure Application Gateway integration with ILB ASE

After the Application Gateway had been created, there is a health probe had been provisioned. The health probe name is *httpsettings-{GUID}*. You may encounter an error as below when check the health probes. One of the reasons that Application Gateway probe cannot access to backend is failed to resolve the private domain name. To fix this issue, you need to add an virtual network link to private DNS zone.

`Cannot connect to backend server. Check whether any NSG/UDR/Firewall is blocking access to the server. Check if application is running on correct port.`

:::image type="content" source="./media/integrate-with-application-gateway/appgw-healthprobeerror.png" alt-text="Application Gateway health probe error":::

### Configure virtual network links with private DNS zone

* To configure virtual network link with private DNS zone, go to the private DNS zone configuration plane. Select the **Virtual network links** > **+Add** 

:::image type="content" source="./media/integrate-with-application-gateway/appgw-addvnetlink.png" alt-text="Add a virtual network link to private DNS zone":::

* Input the **Link name** and select the respective subscription and virtual network where Application Gateway reside in.

:::image type="content" source="./media/integrate-with-application-gateway/appgw-vnetlink.png" alt-text="Virtual network links in private DNS zone":::

### Configure Health Probe

You can recreate the health probe to replace the default health probe when Application Gateway created. To configure the health probe, the key parameters listed as below,

* Health Probe settings:

| Parameter                                 | Value                                                        | Description                                                  |
| ----------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Health Probe                              | For example: https-probe                                     | Health probe name                                            |
| Protocol                                  | HTTPS                                                        | Use TLS/SSL encryption                                       |
| Host                                      | For example:  app.asev3-ilb-20211008.appserviceenvironment.net | Set host name to the private DNS record of the app on ILB ASE |
| Pick host name form backend HTTP settings | No                                                           | Do not pick host name from backend as we set the Host explictly |
| Pick port from backend HTTP settings      | Yes                                                          | Pick port from backend                                       |
| Path                                      | /                                                            | Use default root path                                        |
| HTTP settings                             | https-setting                                                | Use the HTTP setting on Application Gateway                  |

:::image type="content" source="./media/integrate-with-application-gateway/appgw-addhealthprobe.png" alt-text="Application Gateway add a health probe":::

Click Test button to test the backend health. Once the status is green, add to the Application Gateway.

:::image type="content" source="./media/integrate-with-application-gateway/appgw-healthprobestatus.png" alt-text="Application Gateway health probe status":::

* Also confirm the backend health status from **Backend health** in the Application Gateway plane.

:::image type="content" source="./media/integrate-with-application-gateway/appgw-backendhealth.png" alt-text="Application Gateway backend health":::

### Add a DNS record

You will need to configure a proper DNS mapping when access to Application Gateway from internet.

* The public IP address of Application Gateway can be found in **Frontend IP configurations** in Application Gateway plane.

:::image type="content" source="./media/integrate-with-application-gateway/appgw-frontendip.png" alt-text="Application Gateway frontend IP address":::

* Use Azure DNS service as example, you can add a record set to map the app domain name to the public IP address of Application Gateway.

:::image type="content" source="./media/integrate-with-application-gateway/appgw-dnsservice.png" alt-text="DNS Service":::

### Validate connection

* On a machine access from internet, you can verify the name resolution for the app domain name to Application Gateway public IP address.

:::image type="content" source="./media/integrate-with-application-gateway/appgw-nameresolution.png" alt-text="Name resolution":::

* On a machine access from internet, test the web access from a browser.

:::image type="content" source="./media/integrate-with-application-gateway/appgw-accessweb.png" alt-text="Access to Web":::

<!--LINKS-->
[appgw]: ../../application-gateway/overview.md
[custom-domain]: ../app-service-web-tutorial-custom-domain.md
[ilbase]: ./create-ilb-ase.md
[createfromtemplate]: ./create-from-template.md
[createprivatednszone]: ../../dns/private-dns-getstarted-portal.md
