<properties 
   pageTitle="How to create reverse DNS records for your services using PowerShell in Resource Manager | Microsoft Azure"
   description="How to create reverse DNS records for Azure services  using PowerShell in Resource Manager"
   services="DNS"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="DNS"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/16/2016"
   ms.author="joaoma" />

# How to manage reverse DNS records for your services using PowerShell

[AZURE.INCLUDE [DNS-reverse-dns-record-operations-arm-selectors-include.md](../../includes/DNS-reverse-dns-record-operations-arm-selectors-include.md)]

[AZURE.INCLUDE [DNS-reverse-dns-record-operations-intro-include.md](../../includes/DNS-reverse-dns-record-operations-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](DNS-reverse-dns-record-operations-classic-ps.md).

[AZURE.INCLUDE [DNS-reverse-dns-record-operations-scenario-include.md](../../includes/DNS-reverse-dns-record-operations-scenario-include.md)]

[AZURE.INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]


## Add a reverse DNS record to an existing Public IP address
You can add reverse DNS to an existing Public IP Address using the “Set-AzureRmPublicIpAddress” cmdlet.

	PS C:\> $pip = Get-AzureRmPublicIpAddress -Name PublicIP -ResourceGroupName NRP-DemoRG-PS
	PS C:\> $pip.DnsSettings.ReverseFqdn = "contosoapp1.westus.cloudapp.azure.com."
	PS C:\> Set-AzureRmPublicIpAddress -PublicIpAddress $pip 

## Create a new Public IP Address with reverse DNS record
You can add a new Public IP Address with the reverse DNS property specified using the “New-AzureRmPublicIpAddress” cmdlet.

	PS C:\> New-AzureRmPublicIpAddress -Name PublicIP2 -ResourceGroupName NRP-DemoRG-PS -Location WestUS -AllocationMethod Dynamic -DomainNameLabel "contosoapp2" -ReverseFqdn "contosoapp2.westus.cloudapp.azure.com."
 
## View a reverse DNS record  for an existing Public IP address
You can view the configured value for an existing Public IP Address using the “Get-AzureRmPublicIpAddress” cmdlet.

	PS C:\> Get-AzureRmPublicIpAddress -Name PublicIP2 -ResourceGroupName NRP-DemoRG-PS 

## Remove a reverse DNS record from existing Public IP address
You can remove a reverse DNS property from an existing Public IP Address using the “Set-AzureRmPublicIpAddress” cmdlet. This is done by setting the ReverseFqdn property value to blank.

	PS C:\> $pip = Get-AzureRmPublicIpAddress -Name PublicIP -ResourceGroupName NRP-DemoRG-PS
	PS C:\> $pip.DnsSettings.ReverseFqdn = ""
	PS C:\> Set-AzureRmPublicIpAddress -PublicIpAddress $pip 

[FAQ](../../includes/DNS-reverse-dns-record-operations-faq-include.md)