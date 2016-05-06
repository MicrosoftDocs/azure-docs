<properties 
   pageTitle="Create an internal load balancer using a template in Resource Manager | Microsoft Azure"
   description="Learn how to create an internal load balancer using a template in Resource Manager"
   services="load-balancer"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="load-balancer"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/04/2016"
   ms.author="joaoma" />

# Get started creating an internal load balancer using a template

[AZURE.INCLUDE [load-balancer-get-started-ilb-arm-selectors-include.md](../../includes/load-balancer-get-started-ilb-arm-selectors-include.md)]
<BR>
[AZURE.INCLUDE [load-balancer-get-started-ilb-intro-include.md](../../includes/load-balancer-get-started-ilb-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](load-balancer-get-started-ilb-classic-ps.md).

[AZURE.INCLUDE [load-balancer-get-started-ilb-scenario-include.md](../../includes/load-balancer-get-started-ilb-scenario-include.md)]

## Deploy the template by using click to deploy

The sample template available in the public repository uses a parameter file containing the default values used to generate the scenario described above. To deploy this template using click to deploy, follow [this link](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-2-vms-internal-load-balancer%2Fazuredeploy.json), click **Deploy to Azure**, replace the default parameter values if necessary, and follow the instructions in the portal.

## Deploy the template by using PowerShell

To deploy the template you downloaded by using PowerShell, follow the steps below.

1. If you have never used Azure PowerShell, see [How to Install and Configure Azure PowerShell](../../articles/powershell-install-configure.md) and follow the instructions all the way to the end to sign into Azure and select your subscription.


2. Download the [parameters](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-2-vms-internal-load-balancer/azuredeploy.parameters.json) file to your local disk.
3. Edit the file and save it.
4. Run the **New-AzureRmResourceGroupDeployment** cmdlet to create a resource group using the template. 


		New-AzureRmResourceGroupDeployment -Name TestRG -Location westus `
		    -TemplateFile 'https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-2-vms-internal-load-balancer/azuredeploy.json' `
		    -TemplateParameterFile 'C:\temp\azuredeploy.parameters.json'
	
                
		
## Deploy the template by using the Azure CLI

To deploy the template by using the Azure CLI, follow the steps below.

1. If you have never used Azure CLI, see [Install and Configure the Azure CLI](../../articles/xplat-cli-install.md) and follow the instructions up to the point where you select your Azure account and subscription.
2. Run the **azure config mode** command to switch to Resource Manager mode, as shown below.

		azure config mode arm

	Here is the expected output for the command above:

		info:    New mode is arm

3. Open the [parameter file](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-2-vms-internal-load-balancer/azuredeploy.parameters.json), select its contents, and save it to a file in your computer. For this example, we saved the parameters file to *parameters.json*.

4. Run the **azure group deployment create** command to deploy the new internal load balancer by using the template and parameter files you downloaded and modified above. The list shown after the output explains the parameters used.

		azure group create -n TestRG -l westus --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-2-vms-internal-load-balancer/azuredeploy.json -e parameters.json


## Next steps

[Configure a load balancer distribution mode using source IP affinity](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)



