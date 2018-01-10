---
title: Azure Stack Deployment Planning Worksheet | Microsoft Docs
description: Describes the Azure Stack planning worksheet used for multi-node Azure Stack Azure-connected deployments.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/15/2017
ms.author: jeffgilb

---
# Azure Stack Deployment Planning Worksheet
Covers general introductory and decision overview content. Overview of required information: Azure connection, Identity store, Billing model decisions, Customer information, Environment information. 

> [!NOTE]
> You can download the latest Azure Stack deployment planning worksheet from https://aka.ms/tbd.

## Deployment decision planning
Azure connection, identity store, and billing model decisions. Links to deployment planning decisions article for more information.

## Customer information
The Customer information section is where you provide information to integrate Azure Stack with your organizations IT infrastructure. 
COMPANY NAME
The name of your organization. 
REGION NAME
This value is pre-pended to your External Domain Name suffix (see below) and used to create the FQDN of your external endpoints (for example, regionname.cloudapp.externaldomainname.com). Even if there is only one region, you will still need to provide a region name. It must consist of only letters and numbers between 0-9. 
 	This is a key decision point! Choosing your region name and external domain name should be done with careful consideration and planning, as this will form the basis of your DNS namespace. These values cannot be changed without re-deploying Azure Stack.

If you plan to have more than one region in the future, carefully consider the following tips:
•	Use a region name that gives some indication of the physical location of the Azure Stack scale-units. In Azure, the region names correspond to the geographic location of the datacenters where the compute, storage, and network resources are located (USWest, EastAsia, NorthEurope, etc.), to give users a clear idea of where their resources will be physical located. 
•	Use a naming convention that will be intuitive for your users. Datacenter locations are a popular choice for region names. Make sure that your tenants can make a good choice as to where to deploy their resources based on the region name.
•	Keep the region name short. The region will be pre-pended to your external domain name to create the FQDN for that region.
For example, when your tenants create a public IP address, they can create a DNS name label to associate with that public IP address. This is useful if you want to associate the public IP address with a load balancer that will balance traffic for a web application, for example. Tenants can pick the prefix or “Host Name”, but the suffix will be based on the region name, and the external domain name that you choose during deployment. 
For example, in Azure if you are creating a public IP address in a resource group in the WestUS Region, the DNS name label field looks like this:
  
In Azure Stack, it will look similar to this, except instead of .westus you will see the region name you chose for this field, and instead of cloudapp.azure.com, you will see cloudapp.[ExternalDomainName] where [ExternalDomainName] will be the value you choose for external domain name. As you can see, the value that you choose here will be used to build the URLs that will be used for your tenant services and can get long quickly so choose carefully.
These considerations are important even if you only have a single region, as these values cannot be changed without re-deploying Azure Stack.
EXTERNAL DOMAIN NAME
This is the external DNS zone for you Azure Stack instance. This value, along with the region name, will be used to construct the FQDN for all external endpoints for this Azure Stack region (for example, regionname.cloudapp.externaldomainname.com).
 	This is a key decision point! Choosing your region name and external domain Name should be done with careful consideration and planning, as this will form the basis of your DNS namespace. These values cannot be changed without re-deploying Azure Stack.
As with the region name, you should choose the external domain name very carefully as this will be used to form all the URLs for external endpoints that your tenants will access. It can’t be changed after you have deployed Azure Stack. 
EXAMPLE: CONTOSO.COM
Let’s look at a sample deployment of a fictitious company to help illustrate how these values would be used. 
Contoso wants to deploy Azure Stack and it already owns the DNS Domain, Contoso.com. They would like to leverage this existing DNS name, since their customers are already familiar with it and their brand, and so they want to use an external domain name for Azure Stack that is a subdomain of Contoso.com. They’re going to start out with a single region in their Chicago datacenter with plans to add more regions in the future. They have chosen to call this Azure cloud MAST because it’s simple and they like the way it sounds. 
Taking this into consideration, Contoso chooses the following values for their deployment.
Company name: Contoso
Region name: CHI
External domain name: mast.contoso.com
With this combination, here are a few examples of what the resulting URLS would be for this deployment.
The Azure Stack Tenant Portal URL for this deployment would be:
https://publicportal.chi.mast.contoso.com 
What if a tenant wants to create a load balancer with a public IP Address for his web application and give it a DNS name label? The application it will be used for is a teamwork application, so the tenant uses the DNS name label “Teams”. The resulting URL for the web application would look like this.
http://teams.chi.cloudapp.mast.contoso.com 
In this example, Contoso chose an external domain name that was a subdomain of a DNS domain name that already existed. In this case Contoso can set up a DNS delegation for that zone down to the Azure Stack DNS so that tenants can resolve these names from outside of the Azure Stack instance. Contoso could also, for example, setup a CNAME or alias for Azure Stack to point to portal.mast.contoso.com that in turn points to portal.chi.mast.contoso.com. Later on, when they want to expand and add another region in Seattle, they can setup load balancing rules to route the name portal.mast.contoso.com to either portal.chi.mast.contoso.com or portal.sea.mast.contoso.com depending on proximity, availability, or other business rules.
Organizations can, of course, set this up differently according to their business needs. This is merely an example of the considerations you must take into account during your namespace planning.
PRIVATE DOMAIN INFORMATION
This is used to create the internal, Active Directory integrated DNS domain that will be used for Azure Stack infrastructure services. This domain is used for internal endpoints, service-to-service communications, infrastructure role machine accounts, group managed service accounts, etc. This domain and the endpoints in it are accessible only from the infrastructure subnet (see the section on Network Settings), and are NOT exposed externally to tenants.
There are three fields that you need to complete in this section. These values are used to create the internal infrastructure domain and domain controllers for Azure Stack. 
Fully Qualified Domain Name: This is the DNS friendly FQDN of the private infrastructure domain. You can choose your own or use the sample value (azurestack.local) provided in the deployment worksheet. The most important thing to keep in mind here is that this domain is completely self-contained and used only for Azure Stack infrastructure services. It is not meant to be integrated with your organizations on-premise Active Directory instance. It will, for the most part, be a black box that you won’t access or configure directly. It is configured completely via automation.
Domain admin user name: The Domain Admin User name is not actually captured in the deployment worksheet, and is there only to let you know that you will need to provide this at deployment time.
Domain admin password: Similar to the domain user name, the domain admin password is not actually entered into the deployment worksheet. The field is simply meant to let you know that you will need to provide this at deployment time.

NAMING PREFIXES
During the deployment, a set of computer names and corresponding IP assignments will be automatically generated for both physical devices as well as deployment related items (e.g management virtual machines, AD object names, etc).   Provide two alpha-numeric prefix strings up to eight characters long, and it will be prepended to those environment resources for easy identification.  These prefixes are used with well-known suffixes to make names consistent across all Azure Stack installations and to facilitate troubleshooting and diagnostics. For example, in the event that trace logs need to be collected, it’s easier to diagnose issues if we recognize the naming pattern we see in the logs.
 
The Physical Machine prefix will be used for physical switch and physical compute nodes.  
 
The Deployment Prefix will be used by Azure Stack deployment for the infrastructure role machine names.
 
These two options are provided as often different teams with different naming conventions manage network devices, physical computer devices, and service specific VMs.  These can be the same string if desired.


## Environment information
This section collects time and DNS information. 
TIME ZONE
Only one time-zone setting is permitted per Azure Stack Region. This value will default to whatever time zone is configured on the DVM. However, if you want to specify this explicitly, you can do so here. For a list of valid time zone values, refer to this article. 
DNS FORWARDER
Azure Stack deploys its own recursive DNS servers that are part of the solutions infrastructure. If they don’t have the proper authority, these recursive DNS servers will forward DNS name queries to an upstream DNS server. This is to make sure that the authoritative resolver for that DNS name can be found, the name resolved, and the result returned to original requester. 
Azure Stack DNS servers are only authoritative for the external domain name zone., For queries for DNS names outside of the Azure Stack solution, you must provide the IP Address of a DNS server in your environment that can either resolve these names or forward them as appropriate. 
It is recommended that you provide at least two entries (separated by commas) in the Upstream DNS Servers field. These entries must be IP addresses of valid DNS servers accessible from your Azure Stack Public Infrastructure network (see Networking Design and Infrastructure). If you don’t provide these entries, or if these entries are unavailable, queries for DNS names for endpoints outside of the Azure Stack (e.g. Internet endpoints like www.bing.com ) will fail.
NOTE HERE TO POINT TO DATACENTER INTEGRATION ARTICLE: https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-integrate-dns
TIME SYNCHRONIZATION
You must choose a specific time server with is used to synchronize Azure Stack.  Time symbolization is critical to Azure Stack and its Infrastructure Roles, as it is used to generate Kerberos tickets which are used to authenticate internal services with each other.
You must specify an IP for the time synchronization server, although most of the components in the infrastructure can resolve an URL, some can only support IP addresses. If you’re are using the Disconnected deployment option, you must specify a time server on your corporate network that you are sure can be reached from the infrastructure network in Azure Stack.
 

