---
title: Azure Cloud Services roles FAQ | Microsoft Docs
description: Frequently asked questions about Azure Cloud Services. Answers some common questions about certificates, web roles, and worker roles.
services: cloud-services
documentationcenter: ''
author: Thraka
manager: timlt
editor: ''

ms.assetid: 84985660-2cfd-483a-8378-50eef6a0151d
ms.service: cloud-services
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/19/2017
ms.author: adegeo

---
# Cloud Services FAQ
This article answers some frequently asked questions about Microsoft Azure Cloud Services. You can also visit the [Azure Support FAQ](http://go.microsoft.com/fwlink/?LinkID=185083) for general Azure pricing and support information. You can also consult the [Cloud Services VM Size page](cloud-services-sizes-specs.md) for size information.

## Certificates
### Where should I install my certificate?
* **My**  
  Application Certificate with private key (\*.pfx, \*.p12).
* **CA**  
  All your intermediate certificates go in this store (Policy and Sub CAs).
* **ROOT**  
  The root CA store, so your main root CA cert should go here.

### I can't remove expired certificate
Azure prevents you from removing a certificate while it is in use. You need to either delete the deployment that uses the certificate, or update the deployment with a different or renewed certificate.

### Delete an expired certificate
As long as the certificate is not in use, you can use the [Remove-AzureCertificate](https://msdn.microsoft.com/library/azure/mt589145.aspx) PowerShell cmdlet to remove a certificate.

### I have expired certificates named Windows Azure Service Management for Extensions
These certificates are created whenever an extension is added to the cloud service such as the Remote Desktop extension. These certificates are only used for encrypting and decrypting the private configuration of the extension. It does not matter if these certificates expire. The expiration date is not checked.

### Certificates I have deleted keep reappearing
These keep reappearing most likely because of a tool you're using, such as Visual Studio. Whenever you reconnect with a tool that is using a certificate, it will again be uploaded to Azure.

### My certificates keep disappearing
When the virtual machine instance recycles, all local changes are lost. Use a [startup task](cloud-services-startup-tasks.md) to install certificates to the virtual machine each time the role starts.

### I cannot find my management certificates in the portal
[Management certificates](../azure-api-management-certs.md) are only available in the Azure Classic Portal. The current Azure portal does not use management certificates. 

### How can I disable a management certificate?
[Management certificates](../azure-api-management-certs.md) cannot be disabled. You delete them through the Azure Classic Portal when you do not want them to be used anymore.

### How do I create an SSL certificate for a specific IP address?
Follow the directions in the [create a certificate tutorial](cloud-services-certs-create.md). Use the IP address as the DNS Name.

## Security
### Disable SSL 3.0
To disable SSL 3.0 and use TLS security, create a startup task which is documented on this blog post: https://azure.microsoft.com/en-us/blog/how-to-disable-ssl-3-0-in-azure-websites-roles-and-virtual-machines/

### Add **nosniff** to your website
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

### Customize IIS for a web role
Use the IIS startup script from the [common startup tasks](cloud-services-startup-tasks-common.md#configure-iis-startup-with-appcmdexe) article.

## Scaling
### I cannot scale beyond X instances
Your Azure Subscription has a limit on the number of cores you can use. Scaling will not work if you have used all the cores available. For example, if you have a limit of 100 cores, this means you could have 100 A1 sized virtual machine instances for your cloud service, or 50 A2 sized virtual machine instances.

## Networking
### I can't reserve an IP in a multi-VIP cloud service
First, make sure that the virtual machine instance that you're trying to reserve the IP for is turned on. Second, make sure that you're using Reserved IPs for bother the staging and production deployments. **Do not** change the settings while the deployment is upgrading.

## Remote desktop
### How do I remote desktop when I have an NSG?
Add rules to the NSG that allow traffic on ports **3389** and **20000**.  Remote Desktop uses port **3389**.  Cloud Service instances are load balanced, so you can't directly control which instance to connect to.  The *RemoteForwarder* and *RemoteAccess* agents manage RDP traffic and allow the client to send an RDP cookie and specify an individual instance to connect to.  The *RemoteForwarder* and *RemoteAccess* agents require that port **20000*** be opened, which may be blocked if you have an NSG.
