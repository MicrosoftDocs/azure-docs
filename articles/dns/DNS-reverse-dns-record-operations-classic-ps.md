<properties 
   pageTitle="How to manage reverse DNS records for your services using PowerShell in the classic deployment model | Microsoft Azure"
   description="How to create reverse DNS records for Azure services using PowerShell in the classic deployment model"
   services="DNS"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-service-management"
/>
<tags  
   ms.service="DNS"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/22/2016"
   ms.author="joaoma" />

# How to manage reverse DNS records for your services (classic) using PowerShell

[AZURE.INCLUDE [DNS-reverse-dns-record-operations-classic-selectors-include.md](../../includes/DNS-reverse-dns-record-operations-classic-selectors-include.md)]

[AZURE.INCLUDE [DNS-reverse-dns-record-operations-intro-include.md](../../includes/DNS-reverse-dns-record-operations-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-classic-include.md)] [Resource Manager model](DNS-reverse-dns-record-operations-ps.md).

[AZURE.INCLUDE [DNS-reverse-dns-record-operations-scenario-include.md](../../includes/DNS-reverse-dns-record-operations-scenario-include.md)]

[AZURE.INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]

## Add a reverse DNS record to an existing Cloud Services
You can add reverse DNS to an existing Cloud Service using the “Set-AzureService” cmdlet.

	PS C:\> Set-AzureService –ServiceName “contosoapp1” –Description “App1 with Reverse DNS” –ReverseDnsFqdn “contosoapp1.cloudapp.net.”

## Create a new Cloud Service with reverse DNS record 
You can add a new Cloud Service with the reverse DNS property specified using the “Set-AzureService” cmdlet:

	PS C:\> New-AzureService –ServiceName “contosoapp1” –Location “West US” –Description “App1 with Reverse DNS” –ReverseDnsFqdn “contosoapp1.cloudapp.net.”

## View a reverse DNS record for an existing Cloud Service
You can view the configured value for an existing Cloud Service using the “Get-AzureService” cmdlet.

	PS C:\> Get-AzureService "contosoapp1"

## Remove a reverse DNS record from an existing Cloud Services
You can remove a reverse DNS property from an existing Cloud Service using the “Set-AzureService” cmdlet. This is done by setting the reverse DNS property value to blank.

	PS C:\> Set-AzureService –ServiceName “contosoapp1” –Description “App1 with Reverse DNS” –ReverseDnsFqdn “”

## Validation of reverse DNS records
To ensure a third party can’t create reverse DNS records mapping to your DNS domains, Azure only allows the creation of a reverse DNS record where one of the following is true:

- The reverse DNS FQDN is the name of the Cloud Service for which it has been specified, or any Cloud Service name within the same subscription e.g., reverse DNS is “contosoapp1.cloudapp.net.”.
- The reverse DNS FQDN forward resolves to the name or IP of the Cloud Service for which it has been specified, or to any Cloud Service name or IP within the same subscription e.g., reverse DNS is “app1.contoso.com.” which is a CName alias for contosoapp1.cloudapp.net.
Validation checks are only performed when the reverse DNS property for a Cloud Service is set or modified. Periodic re-validation is not performed.

[FAQ](../../includes/DNS-reverse-dns-record-operations-faq-include.md)