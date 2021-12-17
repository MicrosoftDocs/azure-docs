---
title: App Service Environment Networking
description: App Service Environment networking details
author: madsd
ms.topic: overview
ms.date: 11/15/2021
ms.author: madsd
---

# App Service Environment networking

> [!NOTE]
> This article is about the App Service Environment v3 which is used with Isolated v2 App Service plans
> 

The App Service Environment (ASE) is a single tenant deployment of the Azure App Service that hosts Windows and Linux containers, web apps, api apps, logic apps, and function apps. When you install an ASE, you pick the Azure Virtual Network that you want it to be deployed in. All of the inbound and outbound application traffic will be inside the virtual network you specify. The ASE is deployed into a single subnet in your virtual network. Nothing else can be deployed into that same subnet.

## Subnet requirements

The subnet must be delegated to Microsoft.Web/hostingEnvironments and must be empty.

The size of the subnet can affect the scaling limits of the App Service plan instances within the ASE. We recommend using a `/24` address space (256 addresses) for your subnet to ensure enough addresses to support production scale.

To use a smaller subnet, you should be aware of the following details of the ASE and network setup.

Any given subnet has five addresses reserved for management purposes. On top of the management addresses, ASE will dynamically scale the supporting infrastructure and will use between 4 and 27 addresses depending on configuration and load. The remaining addresses can be used for instances in the App Service plan. The minimal size of your subnet is a `/27` address space (32 addresses).

If you run out of addresses within your subnet, you can be restricted from scaling out your App Service plans in the ASE or you can experience increased latency during intensive traffic load if we are not able scale the supporting infrastructure.

## Addresses

The ASE has the following network information at creation:

| Address type | description |
|--------------|-------------|
| ASE virtual network | The virtual network the ASE is deployed into |
| ASE subnet | The subnet that the ASE is deployed into |
| Domain suffix | The domain suffix that is used by the apps made in this ASE |
| Virtual IP | This setting is the VIP type used by the ASE. The two possible values are internal and external |
| Inbound address | The inbound address is the address your apps on this ASE are reached at. If you have an internal VIP, it is an address in your ASE subnet. If the address is external, it will be a public facing address |
| Default outbound addresses | The apps in this ASE will use this address, by default, when making outbound calls to the internet. |

The ASEv3 has details on the addresses used by the ASE in the **IP Addresses** portion of the ASE portal.

![ASE addresses UI](./media/networking/networking-ip-addresses.png)

As you scale your App Service plans in your ASE, you'll use more addresses out of your ASE subnet. The number of addresses used will vary based on the number of App Service plan instances you have, and how much traffic your ASE is receiving. Apps in the ASE don't have dedicated addresses in the ASE subnet. The specific addresses used by an app in the ASE subnet by an app will change over time.

## Ports and network restrictions

For your app to receive traffic, you need to ensure that inbound Network Security Groups (NSGs) rules allow the ASE subnet to receive traffic from the required ports. In addition to any ports you'd like to receive traffic on, you should ensure the AzureLoadBalancer is able to connect to the ASE subnet on port 80. This is used for internal VM health checks. You can still control port 80 traffic from the virtual network to you ASE subnet.

The general recommendation is to configure the following inbound NSG rule:

|Port|Source|Destination|
|-|-|-|
|80,443|VirtualNetwork|ASE subnet range|

The minimal requirement for ASE to be operational is:

|Port|Source|Destination|
|-|-|-|
|80|AzureLoadBalancer|ASE subnet range|

If you use the minimum required rule you may need one or more rules for your application traffic, and if you are using any of the deployment or debugging options, you will also have to allow this traffic to the ASE subnet. The source of these rules can be VirtualNetwork or one or more specific client IPs or IP ranges. The destination will always be the ASE subnet range.

The normal app access ports are:

|Use|Ports|
|-|-|
|HTTP/HTTPS|80, 443|
|FTP/FTPS|21, 990, 10001-10020|
|Visual Studio remote debugging|4022, 4024, 4026|
|Web Deploy service|8172|

## Network routing

You can set Route Tables (UDRs) without restriction. You can force tunnel all of the outbound application traffic from your ASE to an egress firewall device, such as the Azure Firewall, and not have to worry about anything other than your application dependencies. You can put WAF devices, such as the Application Gateway, in front of inbound traffic to your ASE to expose specific apps on that ASE. If you'd like to customize the outbound address of your applications on an ASE, you can add a NAT Gateway to your ASE subnet.

## DNS

The following sections describe the DNS considerations and configuration inbound to your ASE and outbound from your ASE.

### DNS configuration to your ASE

If your ASE is made with an external VIP, your apps are automatically put into public DNS. If your ASE is made with an internal VIP, you may need to configure DNS for it. If you selected having Azure DNS private zones configured automatically during ASE creation, then DNS is configured in your ASE virtual network. If you selected Manually configuring DNS, you need to either use your own DNS server or configure Azure DNS private zones. To find the inbound address of your ASE, go to the **ASE portal > IP Addresses** UI. 

If you want to use your own DNS server, you need to add the following records:

1. create a zone for `<ASE-name>.appserviceenvironment.net`
1. create an A record in that zone that points * to the inbound IP address used by your ASE
1. create an A record in that zone that points @ to the inbound IP address used by your ASE
1. create a zone in `<ASE-name>.appserviceenvironment.net` named scm
1. create an A record in the scm zone that points * to the IP address used by your ASE private endpoint

To configure DNS in Azure DNS Private zones:

1. create an Azure DNS private zone named `<ASE-name>.appserviceenvironment.net`
1. create an A record in that zone that points * to the inbound IP address
1. create an A record in that zone that points @ to the inbound IP address
1. create an A record in that zone that points *.scm to the inbound IP address

In addition to the default domain provided when an app is created, you can also add a custom domain to your app. You can set a custom domain name without any validation on your apps in an ILB ASE. If you are using custom domains, you will need to ensure they have DNS records configured. You can follow the guidance above to configure DNS zones and records for a custom domain name by replacing the default domain name with the custom domain name. The custom domain name works for app requests but doesn't for the scm site. The scm site is only available at *&lt;appname&gt;.scm.&lt;asename&gt;.appserviceenvironment.net*.

### DNS configuration from your ASE

The apps in your ASE will use the DNS that your virtual network is configured with. If you want some apps to use a different DNS server than what your virtual network is configured with, you can manually set it on a per app basis with the app settings WEBSITE_DNS_SERVER and WEBSITE_DNS_ALT_SERVER. The app setting WEBSITE_DNS_ALT_SERVER configures the secondary DNS server. The secondary DNS server is only used when there is no response from the primary DNS server.

## Limitations

While the ASE does deploy into a customer virtual network, there are a few networking features that aren't available with ASE:

* Send SMTP traffic. You can still have email triggered alerts but your app can't send outbound traffic on port 25
* Use of Network Watcher or NSG Flow to monitor outbound traffic

## More resources

- [Environment variables and app settings reference](../reference-app-settings.md)