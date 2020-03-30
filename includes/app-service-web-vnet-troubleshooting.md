---
author: ccompy
ms.service: app-service-web
ms.topic: include
ms.date: 02/27/2020
ms.author: ccompy
---

The feature is easy to set up, but that doesn't mean your experience will be problem free. If you encounter problems accessing your desired endpoint, there are some utilities you can use to test connectivity from the app console. There are two consoles that you can use. One is the Kudu console, and the other is the console in the Azure portal. To reach the Kudu console from your app, go to **Tools** > **Kudu**. You can also reach the Kudo console at [sitename].scm.azurewebsites.net. After the website loads, go to the **Debug console** tab. To get to the Azure portal-hosted console from your app, go to **Tools** > **Console**.

#### Tools
The tools **ping**, **nslookup**, and **tracert** won't work through the console because of security constraints. To fill the void, two separate tools are added. To test DNS functionality, we added a tool named **nameresolver.exe**. The syntax is:

    nameresolver.exe hostname [optional: DNS Server]

You can use nameresolver to check the hostnames that your app depends on. This way you can test if you have anything misconfigured with your DNS or perhaps don't have access to your DNS server. You can see the DNS server that your app uses in the console by looking at the environmental variables WEBSITE_DNS_SERVER and WEBSITE_DNS_ALT_SERVER.

You can use the next tool to test for TCP connectivity to a host and port combination. This tool is called **tcpping** and the syntax is:

    tcpping.exe hostname [optional: port]

The **tcpping** utility tells you if you can reach a specific host and port. It can show success only if there's an application listening at the host and port combination, and there's network access from your app to the specified host and port.

#### Debug access to virtual network-hosted resources
A number of things can prevent your app from reaching a specific host and port. Most of the time it's one of these things:

* **A firewall is in the way.** If you have a firewall in the way, you hit the TCP timeout. The TCP timeout is 21 seconds in this case. Use the **tcpping** tool to test connectivity. TCP timeouts can be caused by many things beyond firewalls, but start there.
* **DNS isn't accessible.** The DNS timeout is 3 seconds per DNS server. If you have two DNS servers, the timeout is 6 seconds. Use nameresolver to see if DNS is working. You can't use nslookup, because that doesn't use the DNS your virtual network is configured with. If inaccessible, you could have a firewall or NSG blocking access to DNS or it could be down.

If those items don't answer your problems, look first for things like:

**Regional VNet Integration**
* Is your destination a non-RFC1918 address and you don't have WEBSITE_VNET_ROUTE_ALL set to 1?
* Is there an NSG blocking egress from your integration subnet?
* If you're going across Azure ExpressRoute or a VPN, is your on-premises gateway configured to route traffic back up to Azure? If you can reach endpoints in your virtual network but not on-premises, check your routes.
* Do you have enough permissions to set delegation on the integration subnet? During regional VNet Integration configuration, your integration subnet is delegated to Microsoft.Web. The VNet Integration UI delegates the subnet to Microsoft.Web automatically. If your account doesn't have sufficient networking permissions to set delegation, you'll need someone who can set attributes on your integration subnet to delegate the subnet. To manually delegate the integration subnet, go to the Azure Virtual Network subnet UI and set the delegation for Microsoft.Web.

**Gateway-required VNet Integration**
* Is the point-to-site address range in the RFC 1918 ranges (10.0.0.0-10.255.255.255 / 172.16.0.0-172.31.255.255 / 192.168.0.0-192.168.255.255)?
* Does the gateway show as being up in the portal? If your gateway is down, then bring it back up.
* Do certificates show as being in sync, or do you suspect that the network configuration was changed?  If your certificates are out of sync or you suspect that a change was made to your virtual network configuration that wasn't synced with your ASPs, select **Sync Network**.
* If you're going across a VPN, is the on-premises gateway configured to route traffic back up to Azure? If you can reach endpoints in your virtual network but not on-premises, check your routes.
* Are you trying to use a coexistence gateway that supports both point to site and ExpressRoute? Coexistence gateways aren't supported with VNet Integration.

Debugging networking issues is a challenge because you can't see what's blocking access to a specific host:port combination. Some causes include:

* You have a firewall up on your host that prevents access to the application port from your point-to-site IP range. Crossing subnets often requires public access.
* Your target host is down.
* Your application is down.
* You had the wrong IP or hostname.
* Your application is listening on a different port than what you expected. You can match your process ID with the listening port by using "netstat -aon" on the endpoint host.
* Your network security groups are configured in such a manner that they prevent access to your application host and port from your point-to-site IP range.

You don't know what address your app actually uses. It could be any address in the integration subnet or point-to-site address range, so you need to allow access from the entire address range.

Additional debug steps include:

* Connect to a VM in your virtual network and attempt to reach your resource host:port from there. To test for TCP access, use the PowerShell command **test-netconnection**. The syntax is:

      test-netconnection hostname [optional: -Port]

* Bring up an application on a VM and test access to that host and port from the console from your app by using **tcpping**.

#### On-premises resources ####

If your app can't reach a resource on-premises, check if you can reach the resource from your virtual network. Use the **test-netconnection** PowerShell command to check for TCP access. If your VM can't reach your on-premises resource, your VPN or ExpressRoute connection might not be configured properly.

If your virtual network-hosted VM can reach your on-premises system but your app can't, the cause is likely one of the following reasons:

* Your routes aren't configured with your subnet or point-to-site address ranges in your on-premises gateway.
* Your network security groups are blocking access for your point-to-site IP range.
* Your on-premises firewalls are blocking traffic from your point-to-site IP range.
* You're trying to reach a non-RFC 1918 address by using the regional VNet Integration feature.