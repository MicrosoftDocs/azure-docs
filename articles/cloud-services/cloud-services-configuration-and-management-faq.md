---
title: Configuration and management issues for Microsoft Azure Cloud Services FAQ| Microsoft Docs
description: This article lists the frequently asked questions about configuration and management for Microsoft Azure Cloud Services.
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
ms.date: 11/09/2017
ms.author: genli

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

## How can I add an Antimalware extension for my Cloud Services in an automated way?

You can enable Antimalware extension using PowerShell script in the Startup Task. Follow the steps in these articles to implement it: 
 
- [Create a PowerShell startup task](cloud-services-startup-tasks-common.md#create-a-powershell-startup-task)
- [Set-AzureServiceAntimalwareExtension](https://docs.microsoft.com/powershell/module/Azure/Set-AzureServiceAntimalwareExtension?view=azuresmps-4.0.0 )

For more information about Antimalware deployment scenarios and how to enable it from the portal, see [Antimalware Deployment Scenarios](../security/azure-security-antimalware.md#antimalware-deployment-scenarios).

## How to enable Server Name Indication (SNI) for Cloud Services?

You can enable SNI in Cloud Services by using one of the following methods:

### Method 1: Use PowerShell

The SNI binding can be configured using the PowerShell cmdlet **New-WebBinding** in a startup task for a cloud service role instance as below:
    
    New-WebBinding -Name $WebsiteName -Protocol "https" -Port 443 -IPAddress $IPAddress -HostHeader $HostHeader -SslFlags $sslFlags 
    
As described [here](https://technet.microsoft.com/library/ee790567.aspx), the $sslFlags could be one of the values as the following:

|Value|Meaning|
------|------
|0|No SNI|
|1|SNI Enabled |
|2 |Non SNI binding which uses Central Certificate Store|
|3|SNI binding which uses Central Certificate store |
 
### Method 2: Use code

The SNI binding could also be configured via code in the role startup as described on this [blog post](https://blogs.msdn.microsoft.com/jianwu/2014/12/17/expose-ssl-service-to-multi-domains-from-the-same-cloud-service/):

    
    //<code snip> 
                    var serverManager = new ServerManager(); 
                    var site = serverManager.Sites[0]; 
                    var binding = site.Bindings.Add(“:443:www.test1.com”, newCert.GetCertHash(), “My”); 
                    binding.SetAttributeValue(“sslFlags”, 1); //enables the SNI 
                    serverManager.CommitChanges(); 
    //</code snip> 
    
Using any of the approaches above, the respective certificates (*.pfx) for the specific hostnames have to be first installed on the role instances using a startup task or via code in order for the SNI binding to be effective.

## How can I add tags to my Azure Cloud Service? 

Cloud Service is a Classic resource. Only resources created through Azure Resource Manager support tags. You cannot apply tags to Classic resources such as Cloud Service. 

## What are the upcoming Cloud Service capabilities in the Azure Portal which can help manage and monitor applications?

* Ability to generate a new certificate for Remote Desktop Protocol (RDP) is coming soon. Alternatively, you can run this script:

```powershell
$cert = New-SelfSignedCertificate -DnsName yourdomain.cloudapp.net -CertStoreLocation "cert:\LocalMachine\My" -KeyLength 20 48 -KeySpec "KeyExchange"
$password = ConvertTo-SecureString -String "your-password" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath ".\my-cert-file.pfx" -Password $password
```
* Ability to choose blob or local for your csdef and cscfg upload location is coming soon. Using [New-AzureDeployment](/powershell/module/azure/new-azuredeployment?view=azuresmps-4.0.0), you can set each location value.
* Ability to monitor metrics at the instance level. Additional monitoring capabilities are available in [How to Monitor Cloud Services](cloud-services-how-to-monitor.md).


## How to enable HTTP/2 on Cloud Services VM?

Windows 10 and Windows Server 2016 come with support for HTTP/2 on both client and server side. If your client (browser) is connecting to the IIS server over TLS that negotiates HTTP/2 via TLS extensions, then you do not need to make any change on the server-side. This is because, over TLS, the h2-14 header specifying use of HTTP/2 is sent by default. If on the other hand your client is sending an Upgrade header to upgrade to HTTP/2, then you need to make the change below on the server side to ensure that the Upgrade works and you end up with an HTTP/2 connection. 

1. Run regedit.exe.
2. Browse to registry key: HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\HTTP\Parameters.
3. Create a new DWORD value named **DuoEnabled**.
4. Set its value to 1.
5. Restart your server.
6. Go to your **Default Web Site** and under **Bindings**, create a new TLS binding with the self-signed certificate just created. 

For more information, see:

- [HTTP/2 on IIS](https://blogs.iis.net/davidso/http2)
- [Video: HTTP/2 in Windows 10: Browser, Apps and Web Server](https://channel9.msdn.com/Events/Build/2015/3-88)
         

Note that the above steps could be automated via a startup task so that whenever a new PaaS instance gets created, it can do the changes above in the system registry. For more information, see [How to configure and run startup tasks for a cloud service](cloud-services-startup-tasks.md).

 
Once this has been done, you can verify whether the HTTP/2 has been enabled or not by using one of the following methods:

- Enable Protocol version in IIS logs and look into the IIS logs. It will show HTTP/2 in the logs. 
- Enable F12 Developer Tool in Internet Explorer/Edge and switch to the Network tab to verify the protocol. 

For more information, see [HTTP/2 on IIS](https://blogs.iis.net/davidso/http2).
