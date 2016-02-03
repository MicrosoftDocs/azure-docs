<properties 
   pageTitle="Create an endpoint for Traffic Manager using PowerShell in the classic deployment model | Microsoft Azure"
   description="Learn how to create an endpoint for Traffic Manager using PowerShell in the classic deployment model"
   services="traffic-manager"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-service-management"
/>
<tags  
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="12/30/2015"
   ms.author="joaoma" />

# Create an endpoint for Traffic Manager (classic) using PowerShell

[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-classic-selectors-include.md](../../includes/traffic-manager-get-started-create-endpoint-classic-selectors-include.md)]
<BR>
[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-intro-include.md](../../includes/traffic-manager-get-started-create-endpoint-intro-include.md)]
<BR>
[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-classic-include.md)] [Resource Manager model](traffic-manager-get-started-create-endpoint-ps.md).
<BR>
[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-scenario-include.md](../../includes/traffic-manager-get-started-create-endpoint-scenario-include.md)]

## Adding Azure endpoints 


[AZURE.INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]

### Step 1
Add the traffic manager profile you want to add an endpoint to a variable in PowerShell using `Get-AzureTrafficManagerProfile`. In this case, the profile name is named "contoso". If you haven't created yet a 
	
	PS C:\> $TrafficManagerProfile = Get-AzureTrafficManagerProfile -Name contoso

### Step 2 
Add endpoints to the traffic manager profile using `Add-AzureTrafficManagerEndpoint`. In the following example it was added an external endpoint called "app-eu.contoso.com". 

	PS C:\> Add-AzureTrafficManagerEndpoint -DomainName app-eu.contoso.com -Location useast -Type Any -Status Enabled -Weight 10 -TrafficManagerProfile $TrafficManagerProfile

## Next steps

After configuring endpoints for your traffic manager profile, you have to [create a CNAME record to point your Internet domain to Traffic Manager](traffic-manager-point-internet-domain.md). This step will resolve your DNS record to your traffic manager resource. 
