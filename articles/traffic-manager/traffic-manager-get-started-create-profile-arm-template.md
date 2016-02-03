<properties 
   pageTitle="Create a Traffic Manager profile using a template in Resource Manager | Microsoft Azure"
   description="Learn how to create an Traffic Manager profile using a template in Resource Manager"
   services="traffic-manager"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="01/02/2016"
   ms.author="joaoma" />

# Create a Traffic Manager profile using a template

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-arm-selectors-include.md](../../includes/traffic-manager-get-started-create-profile-arm-selectors-include.md)]

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-intro-include.md](../../includes/traffic-manager-get-started-create-profile-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](traffic-manager-get-started-create-profile-classic-ps.md).

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-scenario-include.md](../../includes/traffic-manager-get-started-create-profile-scenario-include.md)]


## Deploy the template by using click to deploy

The sample template available in the public repository uses a parameter file containing the default values used to generate the scenario described above. To deploy this template using click to deploy, follow [this link](https://azure.microsoft.com/documentation/templates/201-traffic-manager-webapp/), click **Deploy to Azure**, replace the default parameter values if necessary, and follow the instructions in the portal.

## Deploy the template by using PowerShell

To deploy the template you downloaded by using PowerShell, follow the steps below.

1. If you have never used Azure PowerShell, see [How to Install and Configure Azure PowerShell](powershell-install-configure.md) and follow the instructions all the way to the end to sign into Azure and select your subscription.
2. 
3. Run the **New-AzureRmResourceGroup** cmdlet to create a resource group using the template.

		New-AzureRmResourceGroup -Name TestRG -Location westus `
		    -TemplateFile 'https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-traffic-manager-webapp/azuredeploy.json' `
		    -TemplateParameterFile 'https://github.com/Azure/azure-quickstart-templates/blob/master/201-traffic-manager-webapp/azuredeploy.parameters.json'	


## Deploy the template by using the Azure CLI

To deploy the template by using the Azure CLI, follow the steps below.

1. If you have never used Azure CLI, see [Install and Configure the Azure CLI](xplat-cli.md) and follow the instructions up to the point where you select your Azure account and subscription.
2. Run the **azure config mode** command to switch to Resource Manager mode, as shown below.

		azure config mode arm

	Here is the expected output for the command above:

		info:    New mode is arm

3. Open the [parameter file](https://github.com/Azure/azure-quickstart-templates/blob/master/201-traffic-manager-webapp/azuredeploy.parameters.json), select its contents, and save it to a file in your computer. For this example, we saved the parameters file to *parameters.json*.

4. Run the **azure group deployment create** command to deploy the new traffic manager profile by using the template and parameter files you downloaded and modified above. The list shown after the output explains the parameters used.

		azure group create -n TestRG -l westus --template-uri 'https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-traffic-manager-webapp/azuredeploy.json' -e parameters.json

## Next steps
 
You need to [add endpoints](traffic-manager-get-started-create-endpoint-classic-portal.md) for the traffic manager profile. You can also [associate your company domain to a traffic manager profile](traffic-manager-point-internet-domain.md).