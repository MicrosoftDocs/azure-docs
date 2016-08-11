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
	ms.date="07/05/2016"
	ms.author="adegeo"/>

# Cloud Services FAQ
This article answers some frequently-asked questions about Microsoft Azure Cloud SErvices. You can also visit the [Azure Support FAQ](http://go.microsoft.com/fwlink/?LinkID=185083) for general Azure pricing and support information. You can also consult the [Cloud Services VM Size page](cloud-services-sizes-specs.md) for size information.

## Troubleshooting

### I can't reserve an IP in a multi-VIP cloud service

First, make sure that the virutal machine instance that you're trying to reserve the IP for is turned on. Second, make sure that you're using Reserved IPs for bother the staging and production deployments. **Do not** change the settings while the deploymnet is upgrading.

<!-- CSS case
Scenario: Reserving IPs in a multi VIP cloud service
Ref: 116042013984378

Error: The VIP for deployment <deploymentName> in service <serviceName> specified for reserved ip <serviceName> is not set. Ensure that the deployment is Running.
Cause: Turn on VM and retry.

Error: Cannot update Azure Deployment when it is using Reserved Ips
Cause: Customer needs to use a Reserved IP for Production and Staging to perform a VIP swap and he was not able to upgrade because there was a upgrade in progress.
-->