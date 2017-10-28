---
title: Configuration and management issues for Microsoft Azure Cloud Services FAQ| Microsoft Docs
description: This article lists the frequently asked questions about configuration and management for Microsoft Azure Cloud Services.
services: cloud-services
documentationcenter: ''
author: simonxjx
manager: cshepard
editor: ''
tags: top-support-issue

ms.assetid: 84985660-2cfd-483a-8378-50eef6a0151d
ms.service: cloud-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 6/9/2017
ms.author: v-six

---
# Configuration and management issues for Azure Cloud Services: Frequently asked questions (FAQs)

This article includes frequently asked questions about configuration and management issues for [Microsoft Azure Cloud Services](https://azure.microsoft.com/services/cloud-services). You can also consult the [Cloud Services VM Size page](cloud-services-sizes-specs.md) for size information.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## How do I add "nosniff" to my website?
To prevent clients from sniffing the MIME types, add a setting in your *web.config* file.

```xml
<configuration>
   <system.webServer>
      <httpProtocol>
         <customHeaders>
            <add name="X-Content-Type-Options" value="nosniff" />
         </customHeaders>
      </httpProtocol>
   </system.webServer>
</configuration>
```

You can also add this as a setting in IIS. Use the following command with the [common startup tasks](cloud-services-startup-tasks-common.md#configure-iis-startup-with-appcmdexe) article.

```cmd
%windir%\system32\inetsrv\appcmd set config /section:httpProtocol /+customHeaders.[name='X-Content-Type-Options',value='nosniff']
```

## How do I customize IIS for a web role?
Use the IIS startup script from the [common startup tasks](cloud-services-startup-tasks-common.md#configure-iis-startup-with-appcmdexe) article.

## I cannot scale beyond X instances
Your Azure Subscription has a limit on the number of cores you can use. Scaling will not work if you have used all the cores available. For example, if you have a limit of 100 cores, this means you could have 100 A1 sized virtual machine instances for your cloud service, or 50 A2 sized virtual machine instances.

## How can I implement Role-Based Access for Cloud Services?
Cloud Services doesn't support the Role-Based Access Control (RBAC) model, as it's not an Azure Resource Manager based service.

See [Azure RBAC vs. classic subscription administrators](../active-directory/role-based-access-control-what-is.md#azure-rbac-vs-classic-subscription-administrators).

## How do I set the idle timeout for Azure load balancer?
You can specify the timeout in your service definition (csdef) file like this:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceDefinition name="mgVS2015Worker" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition" schemaVersion="2015-04.2.6">
  <WorkerRole name="WorkerRole1" vmsize="Small">
    <ConfigurationSettings>
      <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
    </ConfigurationSettings>
    <Imports>
      <Import moduleName="RemoteAccess" />
      <Import moduleName="RemoteForwarder" />
    </Imports>
    <Endpoints>
      <InputEndpoint name="Endpoint1" protocol="tcp" port="10100"   idleTimeoutInMinutes="30" />
    </Endpoints>
  </WorkerRole>
```
See [New: Configurable Idle Timeout for Azure Load Balancer](https://azure.microsoft.com/blog/new-configurable-idle-timeout-for-azure-load-balancer/) for more information.

## Can Microsoft internal engineers RDP to cloud service instances without permission?
Microsoft follows a strict process that will not allow internal engineers to RDP into your cloud service without written permission (email or other written communication) from the owner or their designee.

## Why is the certificate chain of my cloud service SSL certificate incomplete?
We recommend that customers install the full certificate chain (leaf cert, intermediate certs, and root cert) instead of just the leaf certificate. When you install just the leaf certificate, you rely on Windows to build the certificate chain by walking the CTL. If intermittent network or DNS issues occur in Azure or Windows Update when Windows is trying to validate the certificate, the certificate may be considered invalid. By installing the full certificate chain, this problem can be avoided. The blog at [How to install a chained SSL certificate](https://blogs.msdn.microsoft.com/azuredevsupport/2010/02/24/how-to-install-a-chained-ssl-certificate/) shows how to do this.

## How do I associate a static IP address to my cloud service?
To set up a static IP address, you need to create a reserved IP. This reserved IP can be associated to a new cloud service or to an existing deployment. See the following documents for details:
* [How to create a reserved IP address](../virtual-network/virtual-networks-reserved-public-ip.md#manage-reserved-vips)
* [Reserve the IP address of an existing cloud service](../virtual-network/virtual-networks-reserved-public-ip.md#reserve-the-ip-address-of-an-existing-cloud-service)
* [Associate a reserved IP to a new cloud service](../virtual-network/virtual-networks-reserved-public-ip.md#associate-a-reserved-ip-to-a-new-cloud-service)
* [Associate a reserved IP to a running deployment](../virtual-network/virtual-networks-reserved-public-ip.md#associate-a-reserved-ip-to-a-running-deployment)
* [Associate a reserved IP to a cloud service by using a service configuration file](../virtual-network/virtual-networks-reserved-public-ip.md#associate-a-reserved-ip-to-a-cloud-service-by-using-a-service-configuration-file)

## What is the quota limit for my cloud service?
See [Service-specific limits](../azure-subscription-service-limits.md#subscription-limits).

## Why does the drive on my cloud service VM show very little free disk space?
This is expected behavior, and it shouldn't cause any issue to your application. Journaling is turned on for the %uproot% drive in Azure PaaS VMs, which essentially consumes double the amount of space that files normally take up. However there are several things to be aware of that essentially turn this into a non-issue.

The %approot% drive size is calculated as <size of .cspkg + max journal size + a margin of free space>, or 1.5 GB, whichever is larger. The size of your VM has no bearing on this calculation. (The VM size only affects the size of the temporary C: drive.) 

It is unsupported to write to the %approot% drive. If you are writing to the Azure VM, you must do so in a temporary LocalStorage resource (or other option, such as Blob storage, Azure Files, etc.). So the amount of free space on the %approot% folder is not meaningful. If you are not sure if your application is writing to the %approot% drive, you can always let your service run for a few days and then compare the "before" and "after" sizes. 

Azure will not write anything to the %approot% drive. Once the VHD is created from your .cspkg and mounted into the Azure VM, the only thing that might write to this drive is your application. 

The journal settings are non-configurable, so you can't turn it off.

## What are the features and capabilities that Azure basic IPS/IDS and DDOS provides?
Azure has IPS/IDS in datacenter physical servers to defend against threats. In addition, customers can deploy third-party security solutions, such as web application firewalls, network firewalls, antimalware, intrusion detection, prevention systems (IDS/IPS), and more. For more information, see [Protect your data and assets and comply with global security standards](https://www.microsoft.com/en-us/trustcenter/Security/AzureSecurity).

Microsoft continuously monitors servers, networks, and applications to detect threats. Azure's multipronged threat-management approach uses intrusion detection, distributed denial-of-service (DDoS) attack prevention, penetration testing, behavioral analytics, anomaly detection, and machine learning to constantly strengthen its defense and reduce risks. Microsoft Antimalware for Azure protects Azure cloud services and virtual machines. You have the option to deploy third-party security solutions in addition, such as web application fire walls, network firewalls, antimalware, intrusion detection and prevention systems (IDS/IPS), and more.

## Why does IIS stop writing to the log directory?
You have exhausted the local storage quota for writing to the log directory. To correct this, you can do one of three things:
* Enable diagnostics for IIS and have the diagnostics periodically moved to blob storage.
* Manually remove log files from the logging directory.
* Increase quota limit for local resources.

For more information, see the following documents:
* [Store and view diagnostic data in Azure Storage](cloud-services-dotnet-diagnostics-storage.md)
* [IIS Logs stops writing in cloud service](https://blogs.msdn.microsoft.com/cie/2013/12/21/iis-logs-stops-writing-in-cloud-service/)

## What is the purpose of the "Windows Azure Tools Encryption Certificate for Extensions"?
These certificates are automatically created whenever an extension is added to the cloud service. Most commonly, this is the WAD extension or the RDP extension, but it could be others, such as the Antimalware or Log Collector extension. These certificates are only used for encrypting and decrypting the private configuration for the extension. The expiration date is never checked, so it doesn’t matter if the certificate is expired. 

You can ignore these certificates. If you want to clean up the certificates, you can try deleting them all. Azure will throw an error if you try to delete a certificate that is in use.

## How can I generate a Certificate Signing Request (CSR) without "RDP-ing" in to the instance?
See the following guidance document:

>[Obtaining a certificate for use with Windows Azure Web Sites (WAWS)](https://azure.microsoft.com/blog/obtaining-a-certificate-for-use-with-windows-azure-web-sites-waws/)

Please note that a CSR is just a text file. It does NOT have to be created from the machine where the certificate will ultimately be used. Although this document is written for an App Service, the CSR creation is generic and applies also for Cloud Services.
