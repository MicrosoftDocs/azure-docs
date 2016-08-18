<properties
	pageTitle="Cloud Services FAQ | Microsoft Azure"
	description="Frequently-asked questions about Cloud Services."
	services="cloud-services"
	documentationCenter=""
	authors="Thraka"
	manager="timlt"
	editor=""/>

<tags
	ms.service="cloud-services"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/18/2016"
	ms.author="adegeo"/>

# Cloud Services FAQ
This article answers some frequently-asked questions about Microsoft Azure Cloud SErvices. You can also visit the [Azure Support FAQ](http://go.microsoft.com/fwlink/?LinkID=185083) for general Azure pricing and support information. You can also consult the [Cloud Services VM Size page](cloud-services-sizes-specs.md) for size information.

## Certificates

### I can't remove expired certificate

Azure will prevent you from removing a certificate while it is in use. You need to either delete the deployment using the certificate, or update the deployment with a different or renewed certificate.

### I have expired certificates named Windows Azure Service Management for Extensions

These certificates are created whenever an extension is added to the cloud service such as the Remote Desktop extension. These certificates are only used for encrypting and decrypting the private configuration of the extension. It does not matter if these certificates expire; the experation date is not checked.

### Certificates I have deleted keep reappearing

Most likely this is because of a tool you're using, such as Visual Studio. Whenever you reconnect with a tool that is using a certificate, it will again be uploaded to Azure.

### My certificates keep disappearing

When the virtual machine instance recycles, all local changes are lost. You must use a [startup task](cloud-services-startup-tasks.md) to install certificates to the virtual machine.

## Troubleshooting

### I can't reserve an IP in a multi-VIP cloud service

First, make sure that the virutal machine instance that you're trying to reserve the IP for is turned on. Second, make sure that you're using Reserved IPs for bother the staging and production deployments. **Do not** change the settings while the deploymnet is upgrading.
