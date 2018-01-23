---
title: Connectivity and networking issues for Microsoft Azure Cloud Services FAQ| Microsoft Docs
description: This article lists the frequently asked questions about connectivity and networking for Microsoft Azure Cloud Services.
services: cloud-services
documentationcenter: ''
author: genlin
manager: cshepard
editor: ''
tags: top-support-issue

ms.assetid: 84985660-2cfd-483a-8378-50eef6a0151d
ms.service: cloud-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/20/2017
ms.author: genli

---
# Connectivity and networking issues for Azure Cloud Services: Frequently asked questions (FAQs)

This article includes frequently asked questions about connectivity and networking issues for [Microsoft Azure Cloud Services](https://azure.microsoft.com/services/cloud-services). You can also consult the [Cloud Services VM Size page](cloud-services-sizes-specs.md) for size information.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## I can't reserve an IP in a multi-VIP cloud service
First, make sure that the virtual machine instance that you're trying to reserve the IP for is turned on. Second, make sure that you're using Reserved IPs for both the staging and production deployments. **Do not** change the settings while the deployment is upgrading.

## How do I remote desktop when I have an NSG?
Add rules to the NSG that allow traffic on ports **3389** and **20000**.  Remote Desktop uses port **3389**.  Cloud Service instances are load balanced, so you can't directly control which instance to connect to.  The *RemoteForwarder* and *RemoteAccess* agents manage RDP traffic and allow the client to send an RDP cookie and specify an individual instance to connect to.  The *RemoteForwarder* and *RemoteAccess* agents require that port **20000** be opened, which may be blocked if you have an NSG.

## Can I ping a cloud service?

No, not by using the normal "ping"/ICMP protocol. The ICMP protocol is not permitted through the Azure load balancer.

To test connectivity, we recommend that you do a port ping. While Ping.exe uses ICMP, other tools, such as PSPing, Nmap, and telnet allow you to test connectivity to a specific TCP port.

For more information, see [Use port pings instead of ICMP to test Azure VM connectivity](https://blogs.msdn.microsoft.com/mast/2014/06/22/use-port-pings-instead-of-icmp-to-test-azure-vm-connectivity/).

## How do I prevent receiving thousands of hits from unknown IP addresses that indicate some sort of malicious attack to the cloud service?
Azure implements a multilayer network security to protect its platform services against distributed denial-of-service (DDoS) attacks. The Azure DDoS defense system is part of Azure’s continuous monitoring process, which is continually improved through penetration-testing. This DDoS defense system is designed to withstand not only attacks from the outside but also from other Azure tenants. For more detail, see [Microsoft Azure Network Security](http://download.microsoft.com/download/C/A/3/CA3FC5C0-ECE0-4F87-BF4B-D74064A00846/AzureNetworkSecurity_v3_Feb2015.pdf).

You can also create a startup task to selectively block some specific IP addresses. For more information, see [Block a specific IP address](cloud-services-startup-tasks-common.md#block-a-specific-ip-address).

## When I try to RDP to my cloud service instance, I get the message, "The user account has expired."
You may get the error message "This user account has expired" when you bypass the expiration date that is configured in your RDP settings. You can change the expiration date from the portal by following these steps:
1. Log in to the Azure Management Console (https://manage.windowsazure.com), navigate to your cloud service, and select the **Configure** tab.
2. Select **Remote**.
3. Change the "Expires On" date, and then save the configuration.

You now should be able to RDP to your machine.

## Why is LoadBalancer not balancing traffic equally?
For information about how internal load balancer works, see [Azure Load Balancer new distribution mode](https://azure.microsoft.com/blog/azure-load-balancer-new-distribution-mode/).

The distribution algorithm used is a 5-tuple (source IP, source port, destination IP, destination port, protocol type) hash to map traffic to available servers. It provides stickiness only within a transport session. Packets in the same TCP or UDP session will be directed to the same datacenter IP (DIP) instance behind the load balanced endpoint. When the client closes and re-opens the connection or starts a new session from the same source IP, the source port changes and causes the traffic to go to a different DIP endpoint.

## How can I redirect the incoming traffic to my default URL of Cloud Service to a custom URL? 

The URL Rewrite Module of IIS could be used to redirect traffic coming to the default URL for the cloud service (for example, \*.cloudapp.net) to some custom DNS Name/URL. Since the URL Rewrite Module is by default enabled on the Web Roles and its rules are configured in the application's web.config, it would always be available on the VM irrespective of reboots/reimages. For more information, see:

- [Creating Rewrite Rules for the URL Rewrite Module](https://docs.microsoft.com/iis/extensions/url-rewrite-module/creating-rewrite-rules-for-the-url-rewrite-module)
- [How to remove default link](https://stackoverflow.com/questions/32286487/azure-website-how-to-remove-default-link?answertab=votes#tab-top)

## How can I block/disable the incoming traffic to the default URL of my Cloud Service? 

You may prevent the incoming traffic to the default URL/Name of your cloud service (for example, \*.cloudapp.net) by setting the host header to a custom DNS name (for example, www.MyCloudService.com) under site binding configuration in the cloud service definition (*.csdef) file as indicated below: 
 

    <?xml version="1.0" encoding="utf-8"?> 
    <ServiceDefinition name="AzureCloudServicesDemo" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition" schemaVersion="2015-04.2.6"> 
      <WebRole name="MyWebRole" vmsize="Small"> 
        <Sites> 
          <Site name="Web"> 
            <Bindings> 
              <Binding name="Endpoint1" endpointName="Endpoint1" hostHeader="www.MyCloudService.com" /> 
            </Bindings> 
          </Site> 
        </Sites> 
        <Endpoints> 
          <InputEndpoint name="Endpoint1" protocol="http" port="80" /> 
        </Endpoints> 
        <ConfigurationSettings> 
          <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" /> 
        </ConfigurationSettings> 
      </WebRole> 
    </ServiceDefinition> 
 
As this host header binding is enforced through csdef file, the service would only be accessible via the custom name 'www.MyCloudService.com', whereas all the incoming requests to the '*.cloudapp.net' domain would always fail. That being said, if you however use a custom SLB probe or an internal load balancer in the service, blocking default URL/Name of the service may interfere with the probing behavior. 

## How to make sure the public facing IP address of a Cloud Service (aka, VIP) never changes so that it could be customarily whitelisted by few specific clients?

For whitelisting the IP address of your Cloud Services, it is recommended that you have a Reserved IP associated with it otherwise the Virtual IP provided by Azure will be deallocated from your subscription if you delete the deployment. Please note that for successful VIP swap operation you would need individual Reserved IPs for both Production and Staging slots, in the absence of which swap operation will fail. Follow these articles to Reserve an IP address and associate it with your Cloud Services:  
 
- [Reserve the IP address of an existing cloud service](../virtual-network/virtual-networks-reserved-public-ip.md#reserve-the-ip-address-of-an-existing-cloud-service)
- [Associate a reserved IP to a cloud service by using a service configuration file](../virtual-network/virtual-networks-reserved-public-ip.md#associate-a-reserved-ip-to-a-cloud-service-by-using-a-service-configuration-file) 

As long as you have more than one instance for your roles, associating RIP with your Cloud Service shouldn't cause any downtime. Alternatively, you can whitelist the IP range of your Azure Datacenter. You can find all Azure IP ranges [here](https://www.microsoft.com/en-us/download/details.aspx?id=41653). 

This file contains the IP address ranges (including Compute, SQL and Storage ranges) used in the Microsoft Azure Datacenters. An updated file is posted weekly which reflects the currently deployed ranges and any upcoming changes to the IP ranges. New ranges appearing in the file will not be used in the datacenters for at least one week. Please download the new xml file every week and perform the necessary changes on your site to correctly identify services running in Azure. Express Route users may note this file used to update the BGP advertisement of Azure space in the first week of each month. 

## How can I use Azure Resource Manager VNets with Cloud Services? 

Cloud services cannot be placed in an Azure Resource Manager VNets, but an Azure Resource Manager VNets and a Classic VNets can be connected through peering. For more information, see [Virtual network peering](../virtual-network/virtual-network-peering-overview.md).