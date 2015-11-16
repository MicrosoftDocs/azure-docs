<properties 
   pageTitle="Create an Internet facing load balancer in Resource Manager using a template | Microsoft Azure"
   description="Learn how to create an Internet facing load balancer in Resource Manager using a template"
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
   ms.date="10/21/2015"
   ms.author="joaoma" />

#Create an Internet facing load balancer using a template

[AZURE.INCLUDE [load-balancer-get-started-internet-arm-selectors-include.md](../../includes/load-balancer-get-started-internet-arm-selectors-include.md)]

[AZURE.INCLUDE [load-balancer-get-started-internet-intro-include.md](../../includes/load-balancer-get-started-internet-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)] This article covers the Resource Manager deployment model. 

[AZURE.INCLUDE [load-balancer-get-started-internet-scenario-include.md](../../includes/load-balancer-get-started-internet-scenario-include.md)]

## Deploy the ARM template by using click to deploy

The sample template available in the public repository uses a parameter file containing the default values used to generate the scenario described above. To deploy this template using click to deploy, follow [this link](http://go.microsoft.com/fwlink/?LinkId=544801), click **Deploy to Azure**, replace the default parameter values if necessary, and follow the instructions in the portal.

## Deploy the ARM template by using PowerShell

To deploy the ARM template you downloaded by using PowerShell, follow the steps below.

1. If you have never used Azure PowerShell, see [How to Install and Configure Azure PowerShell](powershell-install-configure.md) and follow the instructions all the way to the end to sign into Azure and select your subscription.
2. Run the **Switch-AzureMode** cmdlet to switch to Resource Manager mode, as shown below.

		Switch-AzureMode AzureResourceManager

	Here is the expected output for the command above:

		WARNING: The Switch-AzureMode cmdlet is deprecated and will be removed in a future release.

	>[AZURE.WARNING] The Switch-AzureMode cmdlet will be deprecated soon. When that happens, all Resource Manager cmdlets will be renamed.

3. Run the **New-AzureResourceGroup** cmdlet to create a resource group using the template.

		New-AzureResourceGroup -Name TestRG -Location uswest `
		    -TemplateFile 'https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-2-vms-loadbalancer-natrules/azuredeploy.json' `
		    -TemplateParameterFile 'https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-2-vms-loadbalancer-natrules/azuredeploy.parameters.json'	

## Deploy the ARM template by using the Azure CLI

To deploy the ARM template by using the Azure CLI, follow the steps below.

1. If you have never used Azure CLI, see [Install and Configure the Azure CLI](xplat-cli.md) and follow the instructions up to the point where you select your Azure account and subscription.
2. Run the **azure config mode** command to switch to Resource Manager mode, as shown below.

		azure config mode arm

	Here is the expected output for the command above:

		info:    New mode is arm

3. From your browser, navigate to **https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-2-vms-loadbalancer-natrules/azuredeploy.parameters.json**, copy the contents of the json file and paste into a new file in your computer. For this scenario, you would be copying the values below to a file named **c:\lb\azuredeploy.parameters.json**.
4. Run the **azure group deployment create** cmdlet to deploy the new load balancer by using the template and parameter files you downloaded and modified above. The list shown after the output explains the parameters used.

		azure group create -n TestRG -l westus -f 'https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-2-vms-loadbalancer-natrules/azuredeploy.json' -e 'c:\lb\azuredeploy.parameters.json'
