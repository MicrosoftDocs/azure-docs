---
title: Configure a WAF
description: Learn how to configure a web application firewall (WAF) in front of your App Service Environment, either with Azure Application Gateway or a third-party WAF.
author: ccompy

ms.assetid: a2101291-83ba-4169-98a2-2c0ed9a65e8d
ms.topic: tutorial
ms.date: 03/03/2018
ms.author: stefsch
ms.custom: mvc, seodec18
---

# Configuring a Web Application Firewall (WAF) for App Service Environment
## Overview

Web application firewalls (WAF) help secure your web applications by inspecting inbound web traffic to block SQL injections, Cross-Site Scripting, malware uploads & application DDoS and other attacks. They also inspect the responses from the back-end web servers for Data Loss Prevention (DLP). Combined with the isolation and additional scaling provided by App Service Environments, this provides an ideal environment to host business critical web applications that need to withstand malicious requests and high volume traffic. Azure provides a WAF capability with the [Application Gateway](../../application-gateway/overview.md).  To see how to integrate your App Service Environment with an Application Gateway read the [Integrate your ILB ASE with an Application Gateway](./integrate-with-application-gateway.md) document.

In addition to the Azure Application Gateway, there are multiple marketplace options like the [Barracuda WAF for Azure](https://www.barracuda.com/programs/azure) that are available on the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/barracudanetworks.waf?tab=PlansAndPrice). The rest of this document focuses on how to integrate your App Service Environment with a Barracuda WAF device.

[!INCLUDE [app-service-web-to-api-and-mobile](../../../includes/app-service-web-to-api-and-mobile.md)] 

## Setup
For this document, we configure the App Service Environment behind multiple load balanced instances of Barracuda WAF so that only traffic from the WAF can reach the App Service Environment and it is not accessible from the DMZ. We also have Azure Traffic Manager in front of the Barracuda WAF instances to load balance across Azure data centers and regions. A high-level diagram of the setup would look like the following image:

![Diagram shows an optional Azure Traffic Manager connecting to instances of Web Application Firewall, connecting to Network A C L to only allow traffic from the firewall in an App Service Environment that contains Web, A P I, and Mobile App for two regions.][Architecture] 

> [!NOTE]
> With the introduction of [ILB support for App Service Environment](app-service-environment-with-internal-load-balancer.md), you can configure the ASE to be inaccessible from the DMZ and only be available to the private network. 
> 
> 

## Configuring your App Service Environment
To configure an App Service Environment, refer to [our documentation](app-service-web-how-to-create-an-app-service-environment.md) on the subject. Once you have an App Service Environment created, you can create Web Apps, API Apps, and [Mobile Apps](/previous-versions/azure/app-service-mobile/app-service-mobile-value-prop) in this environment that will all be protected behind the WAF we configure in the next section.

## Configuring your Barracuda WAF Cloud Service
Barracuda has a [detailed article](https://campus.barracuda.com/product/webapplicationfirewall/article/WAF/DeployWAFInAzure) on deploying its WAF on a virtual machine in Azure. But because we want redundancy and not introduce a single point of failure, you want to deploy at least two WAF instance VMs into the same Cloud Service when following these instructions.

### Adding Endpoints to Cloud Service
Once you have 2 or more WAF VM instances in your Cloud Service, you can use the [Azure portal](https://portal.azure.com/) to add HTTP and HTTPS endpoints that are used by your application as shown in the following image:

![Configure Endpoint][ConfigureEndpoint]

If your applications use other endpoints, make sure to add them to this list as well. 

### Configuring Barracuda WAF through its Management Portal
Barracuda WAF uses TCP Port 8000 for configuration through its management portal. If you have multiple instances of the WAF VMs, you need to repeat the steps here for each VM instance. 

> [!NOTE]
> Once you are done with WAF configuration, remove the TCP/8000 endpoint from all your WAF VMs to keep your WAF secure.
> 
> 

Add the management endpoint as shown in the following image to configure your Barracuda WAF.

![Add Management Endpoint][AddManagementEndpoint]

Use a browser to browse to the management endpoint on your Cloud Service. If your Cloud Service is called test.cloudapp.net, you would access this endpoint by browsing to `http://test.cloudapp.net:8000`. You should see a login page like the following image that you can log in using credentials you specified in the WAF VM setup phase.

![Management Login Page][ManagementLoginPage]

Once you log in, you should see a dashboard like the one in the following image that presents basic statistics about the WAF protection.

![Management Dashboard][ManagementDashboard]

Clicking on the **Services** tab lets you configure your WAF for services it is protecting. For more details on configuring your Barracuda WAF, see [their documentation](https://campus.barracuda.com/product/webapplicationfirewall/doc/4259884/configure-the-barracuda-web-application-firewall-from-the-web-interface/). In the following example, an App Service app serving traffic on HTTP and HTTPS has been configured.

![Management Add Services][ManagementAddServices]

> [!NOTE]
> Depending on how your applications are configured and what features are being used in your App Service Environment, you need to forward traffic for TCP ports other than 80 and 443, for example, if you have IP TLS setup for an App Service app. For a list of network ports used in App Service Environments, see [Control Inbound Traffic documentation's](app-service-app-service-environment-control-inbound-traffic.md) Network Ports section.
> 
> 

## Configuring Microsoft Azure Traffic Manager (OPTIONAL)
If your application is available in multiple regions, then you would want to load balance them behind [Azure Traffic Manager](../../traffic-manager/traffic-manager-overview.md). To do so, you can add an endpoint in the [Azure portal](https://portal.azure.com) using the Cloud Service name for your WAF in the Traffic Manager profile as shown in the following image. 

![Traffic Manager Endpoint][TrafficManagerEndpoint]

If your application requires authentication, ensure you have some resource that doesn't require any authentication for Traffic Manager to ping for the availability of your application. You can configure the URL on the **Configuration** page in the [Azure portal](https://portal.azure.com) as shown in the following image:

![Configure Traffic Manager][ConfigureTrafficManager]

To forward the Traffic Manager pings from your WAF to your application, you need to set up Website Translations on your Barracuda WAF to forward traffic to your application as shown in the following example:

![Website Translations][WebsiteTranslations]

## Securing Traffic to App Service Environment Using Network Security Groups (NSG)
Follow the [Control Inbound Traffic documentation](app-service-app-service-environment-control-inbound-traffic.md) for details on restricting traffic to your App Service Environment from the WAF only by using the VIP address of your Cloud Service. Here's a sample PowerShell command for performing this task for TCP port 80.

```azurepowershell-interactive
Get-AzureNetworkSecurityGroup -Name "RestrictWestUSAppAccess" | Set-AzureNetworkSecurityRule -Name "ALLOW HTTP Barracuda" -Type Inbound -Priority 201 -Action Allow -SourceAddressPrefix '191.0.0.1'  -SourcePortRange '*' -DestinationAddressPrefix '*' -DestinationPortRange '80' -Protocol TCP
```

Replace the SourceAddressPrefix with the Virtual IP Address (VIP) of your WAF's Cloud Service.

> [!NOTE]
> The VIP of your Cloud Service changes when you delete and re-create the Cloud Service. Make sure to update the IP address in the Network Resource group once you do so. 
> 
> 

<!-- IMAGES -->
[Architecture]: ./media/app-service-app-service-environment-web-application-firewall/Architecture.png
[ConfigureEndpoint]: ./media/app-service-app-service-environment-web-application-firewall/ConfigureEndpoint.png
[AddManagementEndpoint]: ./media/app-service-app-service-environment-web-application-firewall/AddManagementEndpoint.png
[ManagementAddServices]: ./media/app-service-app-service-environment-web-application-firewall/ManagementAddServices.png
[ManagementDashboard]: ./media/app-service-app-service-environment-web-application-firewall/ManagementDashboard.png
[ManagementLoginPage]: ./media/app-service-app-service-environment-web-application-firewall/ManagementLoginPage.png
[TrafficManagerEndpoint]: ./media/app-service-app-service-environment-web-application-firewall/TrafficManagerEndpoint.png
[ConfigureTrafficManager]: ./media/app-service-app-service-environment-web-application-firewall/ConfigureTrafficManager.png
[WebsiteTranslations]: ./media/app-service-app-service-environment-web-application-firewall/WebsiteTranslations.png
