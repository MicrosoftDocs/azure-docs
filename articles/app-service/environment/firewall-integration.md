---
title: Locking down Azure App Service Environment outbound traffic
description: Describes how to integrate with Azure Firewall to secure outbound traffic
services: app-service
documentationcenter: na
author: ccompy
manager: stefsch
ms.assetid: 955a4d84-94ca-418d-aa79-b57a5eb8cb85
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/24/2018
ms.author: ccompy

---

# Locking down an App Service Environment

The App Service Environment (ASE) has a number of external dependencies that it requires access to in order to function properly. The ASE lives in the customer Azure Virtual Network (VNet). Customers must allow the ASE dependency traffic, which is a problem for customers that want to lock down all egress from their VNet.

There are a number of inbound dependencies that an ASE has. The inbound management traffic cannot be sent through a firewall device. The source addresses for this traffic are known and are published in the [App Service Environment management addresses](https://docs.microsoft.com/azure/app-service/environment/management-addresses) document. You can create Network Security Group rules with that information to secure inbound traffic.

The ASE outbound dependencies are almost entirely defined with FQDNs, which do not have static addresses behind them. The lack of static addresses means that Network Security Groups (NSGs) cannot be used to lock down the outbound traffic from an ASE. The addresses change often enough that one cannot set up rules based on the current resolution and use that to create NSGs. 

The solution to securing outbound addresses lies in use of a firewall device that can control outbound traffic based on domain names. The Azure Networking team has put a new network appliance into Preview called Azure Firewall. The Azure Firewall is capable of restricting egress HTTP and HTTPS traffic based on the DNS name of the destination.  

## Configuring Azure Firewall with your ASE 

The steps to lock down egress from your ASE with Azure Firewall are:

1. Create an Azure Firewall in the VNet where your ASE is, or will be. [Azure Firewall documenation](https://docs.microsoft.com/azure/firewall/)
2. From the Azure Firewall UI, select the App Service Environment FQDN Tag
3. Create a route table with the management addresses from [App Service Environment management addresses]( https://docs.microsoft.com/azure/app-service/environment/management-addresses) with a next hop of Internet. The route table entries are required to avoid asymmetric routing problems. 
4. Add routes for the IP address dependencies noted below in the IP address dependencies with a next hop of Internet. 
5. Add a route to your route table for 0.0.0.0/0 with the next hop being your Azure Firewall network appliance
6. Create Service Endpoints for your ASE subnet to Azure SQL and Azure Storage
7. Assign the route table you created to your ASE subnet  

## Application traffic 

The above steps will allow your ASE to operate without problems. You still need to configure things to accommodate your application needs. There are two problems for applications in an ASE that is configured with Azure Firewall.  

- Application dependency FQDNs must be added to the Azure Firewall or the route table
- Routes must be created for the addresses that traffic will come from to avoid asymmetric routing issues

If your applications have dependencies, they need to be added to your Azure Firewall. Create Application rules to allow HTTP/HTTPS traffic and Network rules for everything else. 

If you know the address range that your application request traffic will come from, you can add that to the route table that is assigned to your ASE subnet. If the address range is large or unspecified, then you can use a network appliance like the Application Gateway to give you one address to add to your route table. For details on configuring an Application Gateway with your ILB ASE, read [Integrating your ILB ASE with an Application Gateway](https://docs.microsoft.com/azure/app-service/environment/integrate-with-application-gateway)


## Dependencies

The Azure App Service has a number of external dependencies. They can be categorically broken down into several main areas:

- Service Endpoint capable services should be set up Service Endpoints with if you wish to lock down outbound network traffic.
- IP address endpoints are not addressed with a domain name. This can be a problem for firewall devices that expect all HTTPS traffic to use domain names. The IP address endpoints should be added to the route table that is set on the ASE subnet.
- FQDN HTTP/HTTPS endpoints can be placed in your firewall device.
- Wildcard HTTP/HTTPS endpoints are dependencies that can vary with your ASE based on a number of qualifiers. 
- Linux dependencies are only a concern if you are deploying Linux apps into your ASE. If you are not deploying Linux apps into your ASE, then these addresses do not need to be added to your firewall. 


#### Service Endpoint capable dependencies 

| Endpoint |
|----------|
| Azure SQL |
| Azure Storage |
| Azure KeyVault |


#### IP address dependencies 

| Endpoint |
|----------|
| 40.77.24.27:443 |
| 13.82.184.151:443 |
| 13.68.109.212:443 |
| 13.90.249.229:443 |
| 13.91.102.27:443 |
| 104.45.230.69:443 |
| 168.62.226.198:12000 |


#### FQDN HTTP/HTTPS dependencies 

| Endpoint |
|----------|
|graph.windows.net:443 |
|login.live.com:443 |
|login.windows.com:443 |
|login.windows.net:443 |
|login.microsoftonline.com:443 |
|client.wns.windows.com:443 |
|definitionupdates.microsoft.com:443 |
|go.microsoft.com:80 |
|go.microsoft.com:443 |
|www.microsoft.com:80 |
|www.microsoft.com:443 |
|wdcpalt.microsoft.com:443 |
|wdcp.microsoft.com:443 |
|ocsp.msocsp.com:443 |
|mscrl.microsoft.com:443 |
|mscrl.microsoft.com:80 |
|crl.microsoft.com:443 |
|crl.microsoft.com:80 |
|www.thawte.com:443 |
|crl3.digicert.com:80 |
|ocsp.digicert.com:80 |
|csc3-2009-2.crl.verisign.com:80 |
|crl.verisign.com:80 |
|ocsp.verisign.com:80 |
|azperfcounters1.blob.core.windows.net:443 |
|azurewatsonanalysis-prod.core.windows.net:443 |
|global.metrics.nsatc.net:80   |
|az-prod.metrics.nsatc.net:443 |
|antares.metrics.nsatc.net:443 |
|azglobal-black.azglobal.metrics.nsatc.net:443 |
|azglobal-red.azglobal.metrics.nsatc.net:443 |
|antares-black.antares.metrics.nsatc.net:443 |
|antares-red.antares.metrics.nsatc.net:443 |
|maupdateaccount.blob.core.windows.net:443 |
|clientconfig.passport.net:443 |
|packages.microsoft.com:443 |
|schemas.microsoft.com:80 |
|schemas.microsoft.com:443 |
|management.core.windows.net:443 |
|management.core.windows.net:80 |
|www.msftconnecttest.com:80 |
|shavamanifestcdnprod1.azureedge.net:443 |
|validation-v2.sls.microsoft.com:443 |
|flighting.cp.wd.microsoft.com:443 |
|dmd.metaservices.microsoft.com:80 |
|admin.core.windows.net:443 |
|azureprofileruploads.blob.core.windows.net:443 |
|azureprofileruploads2.blob.core.windows.net:443 |
|azureprofileruploads3.blob.core.windows.net:443 |
|azureprofileruploads4.blob.core.windows.net:443 |
|azureprofileruploads5.blob.core.windows.net:443 |

#### Wildcard HTTP/HTTPS dependencies 

| Endpoint |
|----------|
|gr-Prod-\*.cloudapp.net:443 |
| \*.management.azure.com:443 |
| \*.update.microsoft.com:443 |
| \*.windowsupdate.microsoft.com:443 |
|grmdsprod\*mini\*.servicebus.windows.net:443 |
|grmdsprod\*lini\*.servicebus.windows.net:443 |
|grsecprod\*mini\*.servicebus.windows.net:443 |
|grsecprod\*lini\*.servicebus.windows.net:443 |
|graudprod\*mini\*.servicebus.windows.net:443 |
|graudprod\*lini\*.servicebus.windows.net:443 |

#### Linux dependencies 

| Endpoint |
|----------|
|wawsinfraprodbay063.blob.core.windows.net:443 |
|registry-1.docker.io:443 |
|auth.docker.io:443 |
|production.cloudflare.docker.com:443 |
|download.docker.com:443 |
|us.archive.ubuntu.com:80 |
|download.mono-project.com:80 |
|packages.treasuredata.com:80|
|security.ubuntu.com:80 |

