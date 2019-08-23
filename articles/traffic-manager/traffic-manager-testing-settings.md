---
title: Verify Azure Traffic Manager settings
description: This article will help you verify your Traffic Manager settings.
services: traffic-manager
author: asudbring
ms.service: traffic-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/16/2017
ms.author: allensu
---

# Verify Traffic Manager settings

To test your Traffic Manager settings, you need to have multiple clients, in various locations, from which you can run your tests. Then, bring the endpoints in your Traffic Manager profile down one at a time.

* Set the DNS TTL value low so that changes propagate quickly (for example, 30 seconds).
* Know the IP addresses of your Azure cloud services and websites in the profile you are testing.
* Use tools that let you resolve a DNS name to an IP address and display that address.

You are checking to see that the DNS names resolve to IP addresses of the endpoints in your profile. The names should resolve in a manner consistent with the traffic routing method defined in the Traffic Manager profile. You can use the tools like **nslookup** or **dig** to resolve DNS names.

The following examples help you test your Traffic Manager profile.

### Check Traffic Manager profile using nslookup and ipconfig in Windows

1. Open a command or Windows PowerShell prompt as an administrator.
2. Type `ipconfig /flushdns` to flush the DNS resolver cache.
3. Type `nslookup <your Traffic Manager domain name>`. For example, the following command checks the domain name with the prefix *myapp.contoso*

        nslookup myapp.contoso.trafficmanager.net

    A typical result shows the following information:

    + The DNS name and IP address of the DNS server being accessed to resolve this Traffic Manager domain name.
    + The Traffic Manager domain name you typed on the command line after "nslookup" and the IP address to which the Traffic Manager domain resolves. The second IP address is the important one to check. It should match a public virtual IP (VIP) address for one of the cloud services or websites in the Traffic Manager profile you are testing.

## How to test the failover traffic routing method

1. Leave all endpoints up.
2. Using a single client, request DNS resolution for your company domain name using nslookup or a similar utility.
3. Ensure that the resolved IP address matches the primary endpoint.
4. Bring down your primary endpoint or remove the monitoring file so that Traffic Manager thinks that the application is down.
5. Wait for the DNS Time-to-Live (TTL) of the Traffic Manager profile plus an additional two minutes. For example, if your DNS TTL is 300 seconds (5 minutes), you must wait for seven minutes.
6. Flush your DNS client cache and request DNS resolution using nslookup. In Windows, you can flush your DNS cache with the ipconfig /flushdns command.
7. Ensure that the resolved IP address matches your secondary endpoint.
8. Repeat the process, bringing down each endpoint in turn. Verify that the DNS returns the IP address of the next endpoint in the list. When all endpoints are down, you should obtain the IP address of the primary endpoint again.

## How to test the weighted traffic routing method

1. Leave all endpoints up.
2. Using a single client, request DNS resolution for your company domain name using nslookup or a similar utility.
3. Ensure that the resolved IP address matches one of your endpoints.
4. Flush your DNS client cache and repeat steps 2 and 3 for each endpoint. You should see different IP addresses returned for each of your endpoints.

## How to test the performance traffic routing method

To effectively test a performance traffic routing method, you must have clients located in different parts of the world. You can create clients in different Azure regions that can be used to test your services. If you have a global network, you can remotely sign in to clients in other parts of the world and run your tests from there.

Alternatively, there are free web-based DNS lookup and dig services available. Some of these tools give you the ability to check DNS name resolution from various locations around the world. Do a search on "DNS lookup" for examples. Third-party services like Gomez or Keynote can be used to confirm that your profiles are distributing traffic as expected.

## Next steps

* [About Traffic Manager traffic routing methods](traffic-manager-routing-methods.md)
* [Traffic Manager performance considerations](traffic-manager-performance-considerations.md)
* [Troubleshooting Traffic Manager degraded state](traffic-manager-troubleshooting-degraded.md)
