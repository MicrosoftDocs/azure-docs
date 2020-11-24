---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 10/08/2020
 ms.author: cherylmc
 ms.custom: include file
---

DNS settings are not a required part of this configuration, but DNS is necessary if you want name resolution between your VMs. Specifying a value does not create a new DNS server. The DNS server IP address that you specify should be a DNS server that can resolve the names for the resources you are connecting to.

After you create your virtual network, you can add the IP address of a DNS server to handle name resolution. Open the settings for your virtual network, select DNS servers, and add the IP address of the DNS server that you want to use for name resolution.

1. Locate the virtual network in the portal.
2. On the page for your virtual network, under the **Settings** section, select **DNS servers**.
3. Add a DNS server.
4. To save your settings, select **Save** at the top of the page.