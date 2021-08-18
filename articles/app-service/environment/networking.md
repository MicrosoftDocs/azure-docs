---
title: App Service Environment Networking
description: App Service Environment networking details
author: ccompy
ms.assetid: 6f262f63-aef5-4598-88d2-2f2c2f2bfc24
ms.topic: article
ms.date: 06/30/2021
ms.author: ccompy
ms.custom: seodec18
---

# App Service Environment networking

> [!NOTE]
> This article is about the App Service Environment v3 which is used with Isolated v2 App Service plans
> 


The App Service Environment (ASE) is a single tenant deployment of the Azure App Service that hosts web apps, api apps, and function apps. When you install an ASE, you pick the Azure Virtual Network (VNet) that you want it to be deployed in. All of the inbound and outbound traffic application will be inside the VNet you specify. The ASE is deployed into a single subnet in your VNet. Nothing else can be deployed into that same subnet. The subnet needs to be delegated to Microsoft.Web/HostingEnvironments

## Addresses 

The ASE has the following network information at creation:

| Address type | description |
|--------------|-------------|
| ASE virtual network | The VNet the ASE is deployed into |
| ASE subnet | The subnet that the ASE is deployed into |
| Domain suffix | The domain suffix that is used by the apps made in this ASE |
| Virtual IP | This is the VIP type used by the ASE. The two possible values are internal and external |
| Inbound address | The inbound address is the address your apps on this ASE are reached at. If you have an internal VIP, it is an address in your ASE subnet. If the address is external, it will be a public facing address |
| Default outbound addresses | The apps in this ASE will use this address, by default, when making outbound calls to the internet. |

The ASEv3 has details on the addresses used by the ASE in the **IP Addresses** portion of the ASE portal.

![ASE addresses UI](./media/networking/networking-ip-addresses.png)

As you scale your App Service plans in your ASE, you'll use more addresses out of your ASE subnet. The number of addresses used will vary based on the number of App Service plan instances you have, and how much traffic your ASE is receiving. Apps in the ASE don't have dedicated addresses in the ASE subnet. The specific addresses used by an app in the ASE subnet by an app will change over time.

## Ports

The ASE receives application traffic on ports 80 and 443. If those ports are blocked, you can't reach your apps. 

> [!NOTE]
> Port 80 must be allowed from AzureLoadBalancer to the ASE subnet for keep alive traffic between the load balancer and the ASE infrastructure. You can still control port 80 traffic to your ASE virtual IP.
> 

## Extra configurations

You can set Network Security Groups (NSGs) and Route Tables (UDRs) without restriction. You can force tunnel all of the outbound traffic from your ASE to an egress firewall device, such as the Azure Firewall, and not have to worry about anything other than your application dependencies. You can put WAF devices, such as the Application Gateway, in front of inbound traffic to your ASE to expose specific apps on that ASE. For a different dedicated outbound address to the internet, you can use a NAT Gateway with your ASE. To use a NAT Gateway with your ASE, configure the NAT Gateway against the ASE subnet. 

## DNS

### DNS configuration to your ASE

If your ASE is made with an external VIP, your apps are automatically put into public DNS. If your ASE is made with an internal VIP, you may need to configure DNS for it. If you selected having Azure DNS private zones configured automatically during ASE creation, then DNS is configured in your ASE VNet. If you selected Manually configuring DNS, you need to either use your own DNS server or configure Azure DNS private zones. To find the inbound address of your ASE, go to the **ASE portal > IP Addresses** UI. 

If you want to use your own DNS server, you need to add the following records:

1. create a zone for &lt;ASE name&gt;.appserviceenvironment.net
1. create an A record in that zone that points * to the inbound IP address used by your ASE
1. create an A record in that zone that points @ to the inbound IP address used by your ASE
1. create a zone in &lt;ASE name&gt;.appserviceenvironment.net named scm
1. create an A record in the scm zone that points * to the IP address used by your ASE private endpoint

To configure DNS in Azure DNS Private zones:

1. create an Azure DNS private zone named `<ASE-name>.appserviceenvironment.net`
1. create an A record in that zone that points * to the inbound IP address
1. create an A record in that zone that points @ to the inbound IP address
1. create an A record in that zone that points *.scm to the inbound IP address

The DNS settings for your ASE default domain suffix don't restrict your apps to only being accessible by those names. You can set a custom domain name without any validation on your apps in an ASE. If you then want to create a zone named *contoso.net*, you could do so and point it to the inbound IP address. The custom domain name works for app requests but doesn't for the scm site. The scm site is only available at *&lt;appname&gt;.scm.&lt;asename&gt;.appserviceenvironment.net*. 

#### DNS configuration from your ASE

The apps in your ASE will use the DNS that your VNet is configured with. If you want some apps to use a different DNS server than what your VNet is configured with, you can manually set it on a per app basis with the app settings WEBSITE_DNS_SERVER and WEBSITE_DNS_ALT_SERVER. The app setting WEBSITE_DNS_ALT_SERVER configures the secondary DNS server. The secondary DNS server is only used when there is no response from the primary DNS server. 

## Limitations

While the ASE does deploy into a customer VNet, there are a few networking features that aren't available with ASE. 

* send SMTP traffic. You can still have email triggered alerts but your app can't send outbound traffic on port 25
* Use of Network Watcher or NSG Flow to monitor outbound traffic

## More resources

- [Environment variables and app settings reference](../reference-app-settings.md)