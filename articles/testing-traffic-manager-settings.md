<properties
   pageTitle="Testing your Traffic Manager settings"
   description="This article will help you test your Traffic Manager settings."
   services="traffic-manager"
   documentationCenter="na"
   authors="cherylmc"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/23/2015"
   ms.author="cherylmc" />

# Testing Traffic Manager Settings

The best way to test your Traffic Manager settings is to set up a number of clients and then bring the endpoints, consisting of cloud services and websites, in your profile down one at a time. The following tips will help you test your Traffic Manager profile.

## Basic testing steps

-**Set the DNS TTL very low** so that changes will propagate quickly - 30 seconds, for example.

-**Know the IP addresses of your Azure cloud services and websites** in the profile you are testing.

-**Use tools that let you resolve a DNS name to an IP address** and display that address. You are checking to see that your company domain name resolves to IP addresses of the endpoints in your profile. They should resolve in a manner consistent with the load balancing method of your Traffic Manager profile. If you are on a computer running Windows, you can use the Nslookup.exe tool from a command or Windows PowerShell prompt. Other publicly available tools that allow you to "dig" an IP address are also readily available on the Internet.

### To check a Traffic Manager profile using nslookup

1-Open a command or Windows PowerShell prompt as an administrator.

2-Type `ipconfig /flushdns` to flush the DNS resolver cache.

3-Type `nslookup <your Traffic Manager domain name>`. For example, the following command checks the domain name with the prefix *myapp.contoso*
    nslookup myapp.contoso.trafficmanager.net
A typical result will show the following:
- The DNS name and IP address of the DNS server being accessed to resolve this Traffic Manager domain name.
- The Traffic Manager domain name you typed on the command line after "nslookup" and the IP address to which the Traffic Manager domain resolves. The second IP address is the important one to check. It should match a public virtual IP (VIP) address for one of the cloud services or websites in the Traffic Manager profile you are testing.

## Testing load balancing methods


### To test a failover load balancing method

1-Leave all endpoints up.
2-Use a single client.
3-Request DNS resolution for your company domain name using the Nslookup.exe tool or a similar utility.
4-Ensure that the resolved IP address your obtain is for your primary endpoint
5-Bring your primary endpoint down or remove the monitoring file so that Traffic Manager thinks it’s down.
6-Wait for the DNS Time-to-Live (TTL) of the Traffic Manager profile plus an additional 2 minutes. For example, if your DNS TTL is 300 seconds (5 minutes), you must wait for 7 minutes.
7-Flush your DNS client cache and request DNS resolution. In Windows, you can flush your DNS cache with the ipconfig /flushdns command issued at a command or Windows PowerShell prompt.
8-Ensure that the IP address you obtain is for your secondary endpoint.
9-Repeat the process, bringing down the secondary endpoint and then the tertiary and so on. Each time, be sure that the DNS resolution returns the IP address of the next endpoint in the list. When all endpoints are down, you should obtain the IP address of the primary endpoint again.

### To test a round robin load balancing method

1-Leave all endpoints up.
2-Use a single client.
3-Request DNS resolution for your company domain using the Nslookup.exe tool or a similar utility.
4-Ensure that the IP address you obtain is one of those in your list.
5-Flush your DNS client cache and repeat steps 3 and 4 over and over. You should see different IP addresses returned for each of your endpoints. Then, the process will repeat.

### To test a performance load balancing method

To effectively test a performance load balancing method, you must have clients located in different parts of the world. You could create clients in Azure that will attempt to call your services via your company domain name. Alternatively, if your corporation is global, you can remotely log into clients in other parts of the world and test from those clients.

There are free web-based DNS lookup and dig services available. Some of these give you the ability to check DNS name resolution from various locations. Do a search on “DNS lookup” for examples. Another option is to use a third-party solution like Gomez or Keynote to confirm that your profiles are distributing traffic as expected.

## See Also

[About Traffic Manager Load Balancing Methods](about-traffic-manager-balancing-methods.md)
[Traffic Manager Configuration Tasks](https://msdn.microsoft.com/library/azure/hh744830.aspx)
[Traffic Manager](traffic-manager.md)
