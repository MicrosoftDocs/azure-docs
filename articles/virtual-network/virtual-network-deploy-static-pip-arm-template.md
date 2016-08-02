<properties
   pageTitle="Deploy a VM with a static public IP using a template in Resource Manager | Microsoft Azure"
   description="Learn how to deploy VMs with a static public IP using a template in Resource Manager"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/27/2016"
   ms.author="telmos" />

# Deploy a VM with a static public IP using a template

[AZURE.INCLUDE [virtual-network-deploy-static-pip-arm-selectors-include.md](../../includes/virtual-network-deploy-static-pip-arm-selectors-include.md)]

[AZURE.INCLUDE [virtual-network-deploy-static-pip-intro-include.md](../../includes/virtual-network-deploy-static-pip-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.

[AZURE.INCLUDE [virtual-network-deploy-static-pip-scenario-include.md](../../includes/virtual-network-deploy-static-pip-scenario-include.md)]

## Public IP resources in a template file

You can view and download the [sample template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/IaaS-Story/03-Static-public-IP/azuredeploy.json).

The section below shows the definition of the public IP resource, based on the scenario above.

      {
        "apiVersion": "2015-06-15",
        "type": "Microsoft.Network/publicIPAddresses",
        "name": "[variables('webVMSetting').pipName]",
        "location": "[variables('location')]",
        "properties": {
          "publicIPAllocationMethod": "Static"
        },
        "tags": {
          "displayName": "PublicIPAddress - Web"
        }
      },

Notice the **publicIPAllocationMethod** property, which is set to *Static*. This property can be either *Dynamic* (default value) or *Static*. Setting it to static guarantees that the public IP address assigned will never change.

The section below shows the association of the public IP address with a network interface.

      {
        "apiVersion": "2015-06-15",
        "type": "Microsoft.Network/networkInterfaces",
        "name": "[variables('webVMSetting').nicName]",
        "location": "[variables('location')]",
        "tags": {
          "displayName": "NetworkInterface - Web"
        },
        "dependsOn": [
          "[concat('Microsoft.Network/publicIPAddresses/', variables('webVMSetting').pipName)]",
          "[concat('Microsoft.Network/virtualNetworks/', parameters('vnetName'))]"
        ],
        "properties": {
          "ipConfigurations": [
            {
              "name": "ipconfig1",
              "properties": {
                "privateIPAllocationMethod": "Static",
                "privateIPAddress": "[variables('webVMSetting').ipAddress]",
                "publicIPAddress": {
                  "id": "[resourceId('Microsoft.Network/publicIPAddresses',variables('webVMSetting').pipName)]"
                },
                "subnet": {
                  "id": "[variables('frontEndSubnetRef')]"
                }
              }
            }
          ]
        }
      },

Notice the **publicIPAddress** property pointing to the **Id** of a resource named **variables('webVMSetting').pipName**. That is the name of the public IP resource shown above.

Finally, the network interface above is listed in the **networkProfile** property of the VM being created.

      "networkProfile": {
        "networkInterfaces": [
          {
            "id": "[resourceId('Microsoft.Network/networkInterfaces', variables('webVMSetting').nicName)]"
          }
        ]
      }

## Deploy the template by using click to deploy

The sample template available in the public repository uses a parameter file containing the default values used to generate the scenario described above. To deploy this template using click to deploy, click **Deploy to Azure** in the Readme.md file for the [VM with static PIP](https://github.com/Azure/azure-quickstart-templates/tree/master/IaaS-Story/03-Static-public-IP) template. Replace the default parameter values if desired and enter values for the blank parameters.  Follow the instructions in the portal to create a virtual machine with a static public IP address.

## Deploy the template by using PowerShell

To deploy the template you downloaded by using PowerShell, follow the steps below.

1. If you have never used Azure PowerShell, see [How to Install and Configure Azure PowerShell](../powershell-install-configure.md) and follow the instructions in steps 1 to 3.

2. In a PowerShell console, run the **New-AzureRmResourceGroup** cmdlet to create a new resource group, if necessary. If you already have a resource group created, go to step 3.

		New-AzureRmResourceGroup -Name PIPTEST -Location westus

	Expected output:

		ResourceGroupName : PIPTEST
		Location          : westus
		ProvisioningState : Succeeded
		Tags              :
		ResourceId        : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/StaticPublicIP

3. In a PowerShell console, run the **New-AzureRmResourceGroupDeployment** cmdlet to deploy the template.

		New-AzureRmResourceGroupDeployment -Name DeployVM -ResourceGroupName PIPTEST `
		    -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/IaaS-Story/03-Static-public-IP/azuredeploy.json `
		    -TemplateParameterUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/IaaS-Story/03-Static-public-IP/azuredeploy.parameters.json

	Expected output:

		DeploymentName    : DeployVM
		ResourceGroupName : PIPTEST
		ProvisioningState : Succeeded
		Timestamp         : <Deployment date> <Deployment time>
		Mode              : Incremental
		TemplateLink      :
		                    Uri            : https://raw.githubusercontent.com/Azure/azure-quickstart-templates/mas
		                    ter/IaaS-Story/03-Static-public-IP/azuredeploy.json
		                    ContentVersion : 1.0.0.0

		Parameters        :
		                    Name                      Type                       Value     
		                    ========================  =========================  ==========
		                    vnetName                  String                     WTestVNet
		                    vnetPrefix                String                     192.168.0.0/16
		                    frontEndSubnetName        String                     FrontEnd  
		                    frontEndSubnetPrefix      String                     192.168.1.0/24
		                    storageAccountNamePrefix  String                     iaasestd  
		                    stdStorageType            String                     Standard_LRS
		                    osType                    String                     Windows   
		                    adminUsername             String                     adminUser
		                    adminPassword             SecureString                         

		Outputs           :

## Deploy the template by using the Azure CLI

To deploy the template by using the Azure CLI, follow the steps below.

1. If you have never used Azure CLI, follow the steps in the [Install and Configure the Azure CLI](../xplat-cli-install.md) article and then the steps to connect the CLI to your subscription in the "Use azure login to authenticate interactively" section of the [Connect to an Azure subscription from the Azure Command-Line Interface (Azure CLI)](../xplat-cli-connect.md) article.
2. Run the **azure config mode** command to switch to Resource Manager mode, as shown below.

		azure config mode arm

	Here is the expected output for the command above:

		info:    New mode is arm

3. Open the [parameter file](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/IaaS-Story/03-Static-public-IP/azuredeploy.parameters.json), select its content, and save it to a file in your computer. For this example, the parameters are saved to a file named *parameters.json*. Change the parameter values within the file if desired, but at a minimum, it's recommended that you change the value for the adminPassword parameter to a unique, complex password.

4. Run the **azure group deployment create** cmdlet to deploy the new VNet by using the template and parameter files you downloaded and modified above. In the command below, replace <path> with the path you saved the file to. 

		azure group create -n PIPTEST2 -l westus --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/IaaS-Story/03-Static-public-IP/azuredeploy.json -e <path>\parameters.json

	Expected output (lists parameter values used):

		info:    Executing command group create
		+ Getting resource group PIPTEST2
		+ Creating resource group PIPTEST2
		info:    Created resource group PIPTEST2
		+ Initializing template configurations and parameters
		+ Creating a deployment
		info:    Created template deployment "azuredeploy"
		data:    Id:                  /subscriptions/<Subscription ID>/resourceGroups/PIPTEST2
		data:    Name:                PIPTEST2
		data:    Location:            westus
		data:    Provisioning State:  Succeeded
		data:    Tags: null
		data:
		info:    group create command OK
