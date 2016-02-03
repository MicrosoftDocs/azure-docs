<properties 
   pageTitle="Create an endpoint for Traffic Manager using the Azure CLI in the classic deployment model | Microsoft Azure"
   description="Learn how to create an endpoint for Traffic Manager using the Azure CLI in the classic deployment model"
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
   ms.date="01/20/2016"
   ms.author="joaoma" />

# Create an endpoint for Traffic Manager (classic) using the Azure CLI

[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-classic-selectors-include.md](../../includes/traffic-manager-get-started-create-endpoint-classic-selectors-include.md)]

[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-intro-include.md](../../includes/traffic-manager-get-started-create-endpoint-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-classic-include.md)] [Resource Manager model](traffic-manager-get-started-create-endpoint-cli.md).


[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-scenario-include.md](../../includes/traffic-manager-get-started-create-endpoint-scenario-include.md)]

## Add endpoint to a traffic manager profile (classic)

[AZURE.INCLUDE [azure-cli-prerequisites-include.md](../../includes/azure-cli-prerequisites-include.md)]
### Step 1
Login to your Azure subscription using Azure CLI.

	azure login

### Step 2
Select the subscription where the traffic manager profile was created.

	azure account set <subscription name>

### Step 3
Azure CLI must be switched to ASM mode.

	azure config mode asm

### Step 4 

Assuming you already created a profile following the steps [in this article](traffic-manager-get-started-create-profile-classic-cli.md), the next steps will be listing the profile and adding endpoints to it. You can gather the traffic manager resources list using `azure network traffic-manager profile list` command. 

	C:\>azure network traffic-manager profile list
	info:    Executing command network traffic-manager profile list
	+ Getting Traffic Manager profiles
	data:    Name    Domain name                Status
	data:    ------  -------------------------  -------
	data:    contoso  contoso.trafficmanager.net  Enabled
	info:    network traffic-manager profile list command OK

### Step 5
After confirming the traffic manager profile you want to use, you can add an endpoint using the command `azure network profile endpoint create`.

	C:\>azure network traffic-manager profile endpoint create --profile-name contoso --name contoso.cloudapp.net --type CloudService  --endpoint-status enabled --weight 10 

Parameters used:

- **--profile-name** - Name of the traffic manager profile to add an endpoint.
- **--name** - Fully-qualified domain name for the endpoint used. 
- **--type** - It will be the type of endpoint. It can be: TrafficManager, CloudService, AzureWebsite, or any.
- **--weight** - It configures the endpoint weight for routing method algorithm.

Additional parameter when your traffic manager profile uses 'Performance" routing method and endpoint is 'any' or 'TrafficManager':

- **--endpoint-location** -  It specifies the region where the endpoint is created. 


## Next steps

After configuring endpoints for your traffic manager profile, you have to [create a CNAME record to point your Internet domain to Traffic Manager](traffic-manager-point-internet-domain.md). This step will resolve your DNS record to your traffic manager resource. 




