
<properties 
   pageTitle="Create Application Gateway using Azure Resource Manager templates| Microsoft Azure"
   description="This page provides instructions to create an Azure Application Gateway using Azure Resource Manager template"
   documentationCenter="na"
   services="application-gateway"
   authors="joaoma"
   manager="jdial"
   editor="tysonn"/>
<tags 
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="hero-article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="09/21/2015"
   ms.author="joaoma"/>


# Create Application Gateway using ARM template

Application Gateway is load balancer layer 7. It provides failover, performance routing HTTP requests between different servers, whether they are on the cloud or on premise. Application gateway has the following application delivery features: HTTP load balancing, Cookie based session affinity, SSL offload. 

> [AZURE.SELECTOR]
- [Azure Classic Powershell steps](application-gateway-create-gateway.md)
- [Azure Resource Manager Powershell steps](application-gateway-create-gateway-arm.md)
- [Azure Resource Manager template steps](application-gateway-create-gateway-arm-template.md)


<BR>

You will learn how to download and modify and existing ARM template from GitHub, and deploy the template from GitHub, PowerShell, and the Azure CLI.

If you are simply deploying the ARM template directly from GitHub, without any changes, skip to deploy a template from github.


>[AZURE.IMPORTANT] Before you work with Azure resources, it's important to understand that Azure currently has two deployment models: Resource Manager, and classic. Make sure you understand [deployment models and tools](azure-classic-rm.md) before working with any Azure resource. You can view the documentation for different tools by clicking the tabs at the top of this article.This document will cover creating an Application Gateway using Azure Resource Manager. To use the classic version, go to [create an Application Gateway classic deployment using PowerShell](application-gateway-create-gateway.md).




## Scenario

In this scenario you will create:

- An Application Gateway with 2 instances;
- A Vnet named VirtualNetwork1 with a reserved CIDR block of 10.0.0.0/16;
- A subnet called Appgatewaysubnet using 10.0.0.0/28 as its CIDR block;
- Setup 2 previously configured back end IP's for the web servers you want to load balance the traffic. In this template example, the back end IP being used will be 10.0.1.10 and 10.0.1.11

>[AZURE.NOTE] Those are the parameters for this template. You can change rules, listener and SSL opening the azuredeploy.json to customize the template.



![arm-scenario](./media/application-gateway-create-gateway-arm-template/scenario-arm.png)



## Download and understand the ARM template

You can download the existing ARM template for creating a VNet and two subnets from github, make any changes you might want, and reuse it. To do so, follow the steps below.

1. Navigate to https://github.com/Azure/azure-quickstart-templates/blob/master/101-create-applicationgateway-publicip.
2. Click **azuredeploy.json**, and then click **RAW**.
3. Save the file to a a local folder on your computer.
4. If you are familiar with ARM templates, skip to step 7.
5. Open the file you just saved and look at the contents under **parameters** in line 5. ARM template parameters provide a placeholder for values that can be filled out during deployment.

	| Parameter | Description |
	|---|---|
	| **location** | Azure region where the Application Gateway will be created |
	| **VirtualNetwork1** | Name for the new VNet |
	| **addressPrefix** | Address space for the VNet, in CIDR format |
	| **ApplicationGatewaysubnet** | Name for the Application Gateway subnet |
	| **subnetPrefix** | CIDR block for the Application Gateway subnet |
	| **skuname** | sku instance size |
	| **capacity** | number of instances |
	| **backendaddress1** | IP address of the first web server |
	| **backendaddress2** | IP address of the second web server|


>[AZURE.IMPORTANT] ARM templates maintained in github can change over time. Make sure you check the template before using it.
	
6. Check the content under **resources** and notice the following:

	- **type**. Type of resource being created by the template. In this case, **Microsoft.Network/applicationGateways**, which represent an Application Gateway.
	- **name**. Name for the resource. Notice the use of **[parameters('applicationGatewayName')]**, which means the name will provided as input by the user or a parameter file during deployment.
	- **properties**. List of properties for the resource. This template uses the virtual network and public IP address during Application Gateway creation.

7. Navigate back to https://github.com/Azure/azure-quickstart-templates/blob/master/101-create-applicationgateway-publicip.
8. Click **azuredeploy-paremeters.json**, and then click **RAW**.
9. Save the file to a a local folder on your computer.
10. Open the file you just saved and edit the values for the parameters. Use the values below to deploy the Application Gateway described in our scenario.

		{
		   "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
		   "contentVersion": "1.0.0.0",
		   "parameters": {
		     "location": {
		       "value": "East US"
		     },
		     "addressPrefix": {
		      "value": "10.0.0.0/16"
    		 },
		     "subnetPrefix": {
		      "value": "10.0.0.0/24"
		     },
		     "skuName": {
		       "value": "Standard_Small"
		     },
		     "capacity": {
		       "value": 2
		    },
		    "backendIpAddress1": {
		      "value": "10.0.1.10"
		    },
		     "backendIpAddress2": {
		       "value": "10.0.1.11"
		     }
		  }
		}

11. Save the file.You can test the Json template and parameter template using online json validation tools like [JSlint.com](http://www.jslint.com/)
 
## Deploy The ARM template by using PowerShell

1. If you have never used Azure PowerShell, see [How to Install and Configure Azure PowerShell](powershell-install-configure.md) and follow the instructions all the way to the end to sign into Azure and select your subscription.
2. From an Azure PowerShell prompt, run the  **Switch-AzureMode** cmdlet to switch to Resource Manager mode, as shown below.

		Switch-AzureMode AzureResourceManager
	
Expected output:

		WARNING: The Switch-AzureMode cmdlet is deprecated and will be removed in a future release.

>[AZURE.WARNING] The Switch-AzureMode cmdlet will be deprecated soon. When that happens, all Resource Manager cmdlets will be renamed.
	
3. If needed, create a new resource group using `New-AzureResourceGroup` cmdlet.In the example below, you will create a new resource group called AppgatewayRG in East US location:

		PS C:\> New-AzureResourceGroup -Name AppgatewayRG -Location "East US"
		VERBOSE: 5:38:49 PM - Created resource group 'AppgatewayRG' in location 'eastus'


		ResourceGroupName : AppgatewayRG
		Location          : eastus
		ProvisioningState : Succeeded
		Tags              :
		Permissions       :
	                 Actions  NotActions
	                 =======  ==========
	                  *

		ResourceId        : /subscriptions/################################/resourceGroups/AppgatewayRG

4. Run the New-AzureResourceGroupDeployment cmdlet to deploy the new VNet by using the template and parameter files you downloaded and modified above.

		New-AzureResourceGroupDeployment -Name TestAppgatewayDeployment -ResourceGroupName AppgatewayRG `
 		   -TemplateFile C:\ARM\azuredeploy.json -TemplateParameterFile C:\ARM\azuredeploy-parameters.json

The output generated by the command line will be the following:

		DeploymentName    : testappgatewaydeployment
		ResourceGroupName : appgatewayRG
		ProvisioningState : Succeeded
		Timestamp         : 9/19/2015 1:49:41 AM
		Mode              : Incremental
		TemplateLink      :
		Parameters        :
                   Name             Type                       Value
                   ===============  =========================  ==========
                   location         String                     East US
                   addressPrefix    String                     10.0.0.0/16
                   subnetPrefix     String                     10.0.0.0/24
                   skuName          String                     Standard_Small
                   capacity         Int                        2
                   backendIpAddress1  String                     10.0.1.10
                   backendIpAddress2  String                     10.0.1.11

		Outputs           :


## Deploy the ARM template by using the Azure CLI

To deploy the ARM template you downloaded by using Azure CLI, follow the steps below.

1. If you have never used Azure CLI, see [Install and Configure the Azure CLI](xplat-cli-install.md) and follow the instructions up to the point where you select your Azure account and subscription.
2. Run the **azure config mode** command to switch to Resource Manager mode, as shown below.

		azure config mode arm

Here is the expected output for the command above:

		info:	New mode is arm

3. If necessary, run the **azure group create** to create a new resource group, as shown below. Notice the output of the command. The list shown after the output explains the parameters used. For more information about resource groups, visit [Azure Resource Manager Overview](resource-group-overview.md).

		azure group create -n appgatewayRG -l eastus

**-n (or --name)**. Name for the new resource group. For our scenario, *appgatewayRG*.

**-l (or --location)**. Azure region where the new resource group will be created. For our scenario, *Eastus*.

4. Run the **azure group deployment create** cmdlet to deploy the new VNet by using the template and parameter files you downloaded and modified above. The list shown after the output explains the parameters used.

		azure group deployment create -g appgatewayRG -n TestAppgatewayDeployment -f C:\ARM\azuredeploy.json -e C:\ARM\azuredeploy-parameters.json

Here is the expected output for the command above:

		azure group deployment create -g appgatewayRG -n TestAppgatewayDeployment -f C:\ARM\azuredeploy.json -e C:\ARM\azuredeploy-parameters.json
		info:    Executing command group deployment create
		+ Initializing template configurations and parameters
		+ Creating a deployment
		info:    Created template deployment "TestAppgatewayDeployment"
		+ Waiting for deployment to complete
		data:    DeploymentName     : TestAppgatewayDeployment
		data:    ResourceGroupName  : appgatewayRG
		data:    ProvisioningState  : Succeeded
		data:    Timestamp          : 2015-09-21T20:50:27.5129912Z
		data:    Mode               : Incremental
		data:    Name               Type    Value
		data:    -----------------  ------  --------------
		data:    location           String  East US
		data:    addressPrefix      String  10.0.0.0/16
		data:    subnetPrefix       String  10.0.0.0/24	
		data:    skuName            String  Standard_Small
		data:    capacity           Int     2
		data:    backendIpAddress1  String  10.0.1.10
		data:    backendIpAddress2  String  10.0.1.11
		info:    group deployment create command OK

**-g (or --resource-group)**. Name of the resource group the new VNet will be created in.

**-f (or --template-file)**. Path to your ARM template file.

**-e (or --parameters-file)**. Path to your ARM parameters file.

## Deploy ARM template using click to deploy

Click to deploy is another way to use ARM templates. It's an easy way to use templates with the Azure portal. 


### Step 1 
Using the link [Click to deploy Application Gateway](http://azure.microsoft.com/documentation/templates/101-create-applicationgateway-publicip/) will redirect you to the portal template page for Application Gateway.


### Step 2 

Click in "deploy to Azure"

![arm-scenario](./media/application-gateway-create-gateway-arm-template/deploytoazure.png)

### Step 3

Fill out the parameters for the deployment template on the portal and click OK

![arm-scenario](./media/application-gateway-create-gateway-arm-template/ibiza1.png)

### Step 4

Select "Legal terms" and click "buy"

### Step 5

On "custom deployment" blade, click "create".


 
## Next steps

If you want to configure SSL offload, see [Configure Application Gateway for SSL offload](application-gateway-ssl.md).

If you want to configure an Application Gateway to use with ILB, see [Create an Application Gateway with an Internal Load Balancer (ILB)](application-gateway-ilb.md).

If you want more information about load balancing options in general, see:

- [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
- [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)
