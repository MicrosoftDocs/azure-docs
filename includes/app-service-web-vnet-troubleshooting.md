---
author: ccompy
ms.service: app-service-web
ms.topic: include
ms.date: 02/27/2020
ms.author: ccompy
---

While the feature is easy to set up, that doesn't mean that your experience will be problem free. Should you encounter problems accessing your desired endpoint there are some utilities you can use to test connectivity from the app console. There are two consoles that you can use. One is the Kudu console and the other is the console in the Azure portal. To reach the Kudu console from your app, go to Tools -> Kudu. You can also reach the Kudo console at [sitename].scm.azurewebsites.net. Once the website loads, go to the Debug console tab. To get to the Azure portal hosted console then from your app go to Tools -> Console. 

#### Tools
The tools **ping**, **nslookup**, and **tracert** won’t work through the console due to security constraints. To fill the void, two separate tools added. In order to test DNS functionality, we added a tool named nameresolver.exe. The syntax is:

    nameresolver.exe hostname [optional: DNS Server]

You can use **nameresolver** to check the hostnames that your app depends on. This way you can test if you have anything mis-configured with your DNS or perhaps don't have access to your DNS server. You can see the DNS server that your app will use in the console by looking at the environmental variables WEBSITE_DNS_SERVER and WEBSITE_DNS_ALT_SERVER.

The next tool allows you to test for TCP connectivity to a host and port combination. This tool is called **tcpping** and the syntax is:

    tcpping.exe hostname [optional: port]

The **tcpping** utility tells you if you can reach a specific host and port. It only can show success if: there is an application listening at the host and port combination, and there is network access from your app to the specified host and port.

#### Debugging access to VNet hosted resources
There are a number of things that can prevent your app from reaching a specific host and port. Most of the time it is one of three things:

* **A firewall is in the way.** If you have a firewall in the way, you will hit the TCP timeout. The TCP timeout is 21 seconds in this case. Use the **tcpping** tool to test connectivity. TCP timeouts can be due to many things beyond firewalls but start there. 
* **DNS isn't accessible.** The DNS timeout is three seconds per DNS server. If you have two DNS servers, the timeout is 6 seconds. Use nameresolver to see if DNS is working. Remember you can't use nslookup as that doesn't use the DNS your VNet is configured with. If inaccessible, you could have a firewall or NSG blocking access to DNS or it could be down.

If those items don't answer your problems, look first for things like: 

**regional VNet Integration**
* is your destination a non-RFC1918 address and you do not have WEBSITE_VNET_ROUTE_ALL set to 1
* is there an NSG blocking egress from your integration subnet
* if going across ExpressRoute or a VPN, is your on-premises gateway configured to route traffic back up to Azure? If you can reach endpoints in your VNet but not on-premises, check your routes.
* do you have enough permissions to set delegation on the integration subnet? During regional VNet Integration configuration, your integration subnet will be delegated to Microsoft.Web. The VNet Integration UI will delegate the subnet to Microsoft.Web automatically. If your account does not have sufficient networking permissions to set delegation, you will need someone who can set attributes on your integration subnet to delegate the subnet. To manually delegate the integration subnet, go to the Azure Virtual Network subnet UI and set delegation for Microsoft.Web. 

**gateway required VNet Integration**
* is the point-to-site address range in the RFC 1918 ranges (10.0.0.0-10.255.255.255 / 172.16.0.0-172.31.255.255 / 192.168.0.0-192.168.255.255)?
* Does the Gateway show as being up in the portal? If your gateway is down, then bring it back up.
* Do certificates show as being in sync or do you suspect that the network configuration was changed?  If your certificates are out of sync or you suspect that there has been a change made to your VNet configuration that wasn't synced with your ASPs, then hit "Sync Network".
* if going across a VPN, is the on-premises gateway configured to route traffic back up to Azure? If you can reach endpoints in your VNet but not on-premises, check your routes.
* are you trying to use a coexistence gateway that supports both point to site and ExpressRoute? Coexistence gateways are not supported with VNet Integration 

Debugging networking issues is a challenge because there you cannot see what is blocking access to a specific host:port combination. Some of the causes include:

* you have a firewall up on your host preventing access to the application port from your point to site IP range. Crossing subnets often requires Public access.
* your target host is down
* your application is down
* you had the wrong IP or hostname
* your application is listening on a different port than what you expected. You can match your process ID with the listening port by using "netstat -aon" on the endpoint host. 
* your network security groups are configured in such a manner that they prevent access to your application host and port from your point to site IP range

Remember that you don't know what address your app will actually use. It could be any address in the integration subnet or point-to-site address range, so you need to allow access from the entire address range. 

Additional debug steps include:

* connect to a VM in your VNet and attempt to reach your resource host:port from there. To test for TCP access, use the PowerShell command **test-netconnection**. The syntax is:

      test-netconnection hostname [optional: -Port]

* bring up an application on a VM and test access to that host and port from the console from your app using **tcpping**

#### On-premises resources ####

If your app cannot reach a resource on-premises, then check if you can reach the resource from your VNet. Use the **test-netconnection** PowerShell command to check for TCP access. If your VM can't reach your on-premises resource, your VPN or ExpressRoute connection may not be configured properly.

If your VNet hosted VM can reach your on-premises system but your app can't, then the cause is likely one of the following reasons:

* your routes are not configured with your subnet or point to site address ranges in your on-premises gateway
* your network security groups are blocking access for your Point-to-Site IP range
* your on-premises firewalls are blocking traffic from your Point-to-Site IP range
* you are trying to reach a non-RFC 1918 address using the regional VNet Integration feature