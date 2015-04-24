<properties 
   pageTitle="Overview of Azure DNS" 
   description=" Overview of Azure DNS" 
   services="virtual-network" 
   documentationCenter="na" 
   authors="joaoma" 
   manager="adinah" 
   editor=""/>

<tags
   ms.service="virtual-network"
   ms.devlang="en"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="04/22/2015"
   ms.author="joaoma"/>

#Azure DNS Overview#

Behind any website or service on the Internet, there is an IP address. For example, www.microsoft.com uses the IP address 134.170.185.46. The Doman Name System, or DNS, is responsible for translating (or resolving) the website or service name to its IP address.<BR><BR>
Azure DNS is hosting service for DNS domains, providing name resolution using Microsoft Azure infrastructure. By hosting your domains in Azure, you can manage your DNS records using the same credentials, APIs, tools and billing as your other Azure services.<BR><BR>
DNS domains in Azure DNS are hosted on Azure’s global network of DNS name servers.  We use Anycast networking, so that each DNS query is answered by the closest available DNS server. This provides both fast performance and high availability for your domain.<BR><BR>
The service is based on Azure Resource Manager (ARM).  Your domains and records can be managed via Azure Resource Manager REST APIs, .NET SDK, PowerShell cmdlets and command line interface.  Azure DNS is currently in Preview, and is not yet supported in the Azure management portal.<BR><BR>
Azure DNS does not currently support purchasing of domain names.  To purchase domains you should use a third-party domain name registrar, who will typically charge a small annual fee.  These domains can then be hosted in Azure DNS for management of DNS records—see [Delegate a Domain to Azure DNS](./dns-domain-delegation.md/) for details.


##See Also 

[Get Started configuring PowerShell for Azure DNS](./dns-getstarted-configure-powershell.md/)<BR>

[Get started creating DNS zones](./dns-getstarted-create-dnszones.md/)


