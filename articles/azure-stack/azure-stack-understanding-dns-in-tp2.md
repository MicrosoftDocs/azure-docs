---
title: Understanding DNS in Azure Stack TP2
---

Introducing iDNS for Azure Stack
================================

iDNS is a new feature in Technology Preview 2 for Azure Stack that
allows you to resolve external DNS names (such as http://www.bing.com).
It also allows you to register internal virtual network names so that
you can resolve VMs on the same VNET by name rather than IP address
without having to provide custom DNS server entries.

It’s something that’s always been there in Azure, working behind the
scenes and now we’re bringing it to Windows Server 2016 and to Azure
Stack.

What does iDNS do?
------------------

With iDNS in Azure Stack, you get the following capabilities, without
having to specify custom DNS Server entries.

-   Shared DNS name resolution services for tenant workloads.

-   Authoritative DNS service for name resolution and DNS registration within the tenant virtual network.

-   Recursive DNS service for resolution of Internet names from tenant VMs. Tenants no longer need to specify custom DNS entries to resolve Internet names (e.g. www.bing.com ).

Of course, you can still bring your own DNS and use Custom DNS servers
if you wish. But now if you just want to be able to resolve Internet DNS
names and be able to connect to other virtual machines in the same
virtual network you don’t need to specify anything and it will just
work.

What doesn’t iDNS do?
---------------------

With iDNS we get a great solution for allowing tenant VMs to resolve DNS
names of Internet sites. What iDNS does NOT allow you to do is create a
DNS record for a name that can be resolved from outside the virtual
network.

In **Azure**, you have the option of specifying a DNS name label that
can be associated with a Public IP Address. You get to choose the label
(prefix), but Azure chooses the suffix which is based on the Region in
which you create the Public IP Address.

![](media/image3.png)

In the image above, Azure will create an “A” record in DNS for the DNS
name label specified under the zone **westus.cloudapp.azure.com**. The
prefix and the suffix together comprise a Fully Qualified Domain Name
(FQDN) which can be resolved from anywhere on the public Internet.

In TP2, **Azure Stack** only supports iDNS for internal name
registration, so it cannot do the following.

-   Create a DNS record under an existing hosted DNS zone (e.g.
    azurestack.local)

-   Create a DNS zone (such as Contoso.com)

-   Create a record under your own custom DNS zone

-   Support the purchase of Domain names.

These features are not in TP2, but we are going to be adding new features
often so check back for updates!

Changes in DNS from Azure Stack TP1
===================================

In the Technology Preview 1 (TP1) release of Azure Stack, you had to
provide Custom DNS Servers if you wanted to be able to resolve hosts by
name rather than by IP address. This means that if you were creating a
Virtual Network or a VM, you had to provide at least one DNS Server
entry, and for the TP1 POC environment, this meant entering the IP of
the POC Fabric DNS Server, namely 192.168.200.2.

If you created a VM via the Portal, that meant you had to select Custom
DNS in the Virtual Network or Ethernet Adapter settings.

![](media/image1.png)

In TP2, you can select Azure DNS and do not need to specify custom DNS
server entries.

If you created a VM via a template with your own image, that meant you
had to add the **DHCPOptions** property and the DNS Server in order to
get DNS name resolution to work. Something that looked like this…

![](media/image2.png)

In TP2, you no longer need to make these changes to your VM templates to
allow your VMs to resolve Internet names. They should just work.
