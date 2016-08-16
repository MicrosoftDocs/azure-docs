<properties 
	pageTitle="Configuring a Web Application Firewall (WAF) for App Service Environment" 
	description="Learn how to configure a web application firewall in front of your App Service Environment." 
	services="app-service\web" 
	documentationCenter="" 
	authors="naziml" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/18/2016" 
	ms.author="naziml"/>	

# Configuring a Web Application Firewall (WAF) for App Service Environment

## Overview ##
Web application firewalls like the [Barracuda WAF for Azure](https://www.barracuda.com/programs/azure) that is available on the [Azure Marketplace](https://azure.microsoft.com/marketplace/partners/barracudanetworks/waf-byol/) helps secure your web applications by inspecting inbound web traffic to block SQL injections, Cross-Site Scripting, malware uploads & application DDoS and other attacks. It also inspects the responses from the back-end web servers for Data Loss Prevention (DLP). Combined with the isolation and additional scaling provided by App Service Environments, this provides an ideal environment to host business critical web applications that need to withstand malicious requests and high volume traffic.

+[AZURE.INCLUDE [app-service-web-to-api-and-mobile](../../includes/app-service-web-to-api-and-mobile.md)] 

## Setup ##
For this document we will configure our App Service Environment behind multiple load balanced instances of Barracuda WAF so that only traffic from the WAF can reach the App Service Environment and it will not be accessible from the DMZ. We will also have Azure Traffic Manager in front of our Barracuda WAF instances to load balance across Azure data centers and regions. A high level diagram of the setup would look like what is shown below.

![Architecture][Architecture] 

## Configuring your App Service Environment ##
To configure an App Service Environment refer to [our documentation](app-service-web-how-to-create-an-app-service-environment.md) on the subject. Once you have an App Service Environment created, you can create [Web Apps](app-service-web-overview.md), [API Apps](../app-service-api/app-service-api-apps-why-best-platform.md) and [Mobile Apps](../app-service-mobile/app-service-mobile-value-prop.md) in this environment that will all be protected behind the WAF we configure in the next section.

## Configuring your Barracuda WAF Cloud Service ##
Barracuda has a [detailed article](https://techlib.barracuda.com/WAF/AzureDeploy) on deploying its WAF on a virtual machine in Azure. But because we want redundancy and not introduce a single point of failure, you want to deploy at least 2 WAF instance VMs into the same Cloud Service when following these instructions.

### Adding Endpoints to Cloud Service ###
Once you have 2 or more WAF VM instances in your Cloud Service you can use the [Azure Portal](https://portal.azure.com/) to add HTTP and HTTPS endpoints that are used by your application as shown in the image below.

![Configure Endpoint][ConfigureEndpoint]

If your applications use other endpoints, make sure to add those to this list as well. 

### Configuring Barracuda WAF through its Managment Portal ###
Barracuda WAF uses TCP Port 8000 for configuration through its management portal. Since we have multiple instances of the WAF VMs you will need to repeat the steps here for each VM instance. 


> Note: Once you are done with WAF configuration, remove the TCP/8000 endpoint from all your WAF VMs to keep your WAF secure.

Add the management endpoint as shown in the image below to configure your Barracuda WAF.

![Add Management Endpoint][AddManagementEndpoint]
 
Use a browser to browse to the management endpoint on your Cloud Service. If your Cloud Service is called test.cloudapp.net, you would access this endpoint by browsing to http://test.cloudapp.net:8000. You should see a login page like below that you can login using credentials you specified in the WAF VM setup phase.

![Management Login Page][ManagementLoginPage]

Once you login you should see a dashboard as the one in the image below that will present basic statistics about the WAF protection.

![Management Dashboard][ManagementDashboard]

Clicking on the Services tab will let you configure your WAF for services it is protecting. For more details on configuring your Barracuda WAF you can consult [their documentation](https://techlib.barracuda.com/waf/getstarted1). In the example below an Azure Web App serving traffic on HTTP and HTTPS has been configured.

![Management Add Services][ManagementAddServices]

> Note: Depending on how your applications are configured and what features are being used in your App Service Environment, you will need to forward traffic for TCP ports other than 80 and 443, e.g. if you have IP SSL setup for a Web App. For a list of network ports used in App Service Environments, please refer to [Control Inbound Traffic documentation's](app-service-app-service-environment-control-inbound-traffic.md) Network Ports section.

## Configuring Microsoft Azure Traffic Manager (OPTIONAL) ##
If your application is available in multiple regions, then you would want to load balance them behind [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md). To do so you can add an endpoint in the [Azure classic portal](https://manage.azure.com) using the Cloud Service name for your WAF in the Traffic Manager profile as shown in the image below. 

![Traffic Manager Endpoint][TrafficManagerEndpoint]

If your application requires authentication, ensure you have some resource that doesn't require any authentication for Traffic Manager to ping for the availability of your application. You can configure the URL under the Configure section on the [Azure classic portal](https://manage.azure.com) as shown below.

![Configure Traffic Manager][ConfigureTrafficManager]

To forward the Traffic Manager pings from your WAF to your application, you need to setup Website Translations on your Barracuda WAF to forward traffic to your application as shown in the example below.

![Website Translations][WebsiteTranslations]

## Securing Traffic to App Service Environment Using Network Security Groups (NSG)##
Follow the [Control Inbound Traffic documentation](app-service-app-service-environment-control-inbound-traffic.md) for details on restricting traffic to your App Service Environment from the WAF only by using the VIP address of your Cloud Service. Here's a sample Powershell command for performing this task for TCP port 80.


    Get-AzureNetworkSecurityGroup -Name "RestrictWestUSAppAccess" | Set-AzureNetworkSecurityRule -Name "ALLOW HTTP Barracuda" -Type Inbound -Priority 201 -Action Allow -SourceAddressPrefix '191.0.0.1'  -SourcePortRange '*' -DestinationAddressPrefix '*' -DestinationPortRange '80' -Protocol TCP

Replace the SourceAddressPrefix with the Virtual IP Address (VIP) of your WAF's Cloud Service.

> Note: The VIP of your Cloud Service will change when you delete and re-create the Cloud Service. Make sure to update the IP address in the Network Resource group once you do so. 
 
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
