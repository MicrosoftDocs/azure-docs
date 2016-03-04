<properties
	pageTitle="Deploy Azure Resources using a template | Microsoft Azure"
	description="Learn to use some of the available clients in the Azure Resource Management Library to deploy a virtual machine, virtual network, and storage account"
	services="virtual-machines-windows,virtual-networks,storage"
	documentationCenter=""
	authors="davidmu1"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="multiple"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/06/2016"
	ms.author="davidmu"/>

# Deploy Azure resources using .NET libraries and a template

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.


By using resource groups and templates, you're able to manage all of the resources that support your application together. This tutorial shows you how to use some of the available clients in the Azure Resource Management Library and how to build a template to deploy a virtual machine, virtual network, and storage account.

[AZURE.INCLUDE [free-trial-note](../../includes/free-trial-note.md)]

To complete this tutorial you also need:

- [Visual Studio](http://msdn.microsoft.com/library/dd831853.aspx)
- [Azure storage account](../storage/storage-create-storage-account.md)
- [Windows Management Framework 3.0](http://www.microsoft.com/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/download/details.aspx?id=40855)

>[AZURE.NOTE] The storage account that you create at this point is used to store the template. Another storage account is created when you deploy the template that's used to store the disk for the virtual machine. Create a container in this storage account named templates.

[AZURE.INCLUDE [powershell-preview](../../includes/powershell-preview-inline-include.md)]

It takes about 30 minutes to do these steps.

## Step 1: Add an application to Azure AD and set permissions

To use Azure AD to authenticate requests to Azure Resource Manager, an application must be added to the Default Directory. Do the following to add an application:

1. Open an Azure PowerShell command prompt, and then run this command and enter the credentials for your subscription when prompted:

			Login-AzureRmAccount

2. Replace {password} in the following command with the one that you want to use and then run it to create the application:

			New-AzureRmADApplication -DisplayName "My AD Application 1" -HomePage "https://myapp1.com" -IdentifierUris "https://myapp1.com"  -Password "{password}"

	>[AZURE.NOTE] Take note of the application identifer that is returned after the application is created because you'll need it for the next step. You can also find the application identifier in the client id field of the application in the Active Directory section of the Azure portal.

3. Replace {application-id} with the identifier that you just recorded and then create the service principal for the application:

			New-AzureRmADServicePrincipal -ApplicationId {application-id}

4. Set the permission to use the application:

			New-AzureRmRoleAssignment -RoleDefinitionName Owner -ServicePrincipalName "https://myapp1.com"

## Step 2: Create the Visual Studio project, the template file, and the parameters file

### Create the template file

An Azure Resource Manager Template makes it possible for you to deploy and manage Azure resources together by using a JSON description of the resources and associated deployment parameters. The template that you build in this tutorial is similar to a template that can be found in the template gallery. To learn more, see [Deploy a simple Windows VM in West US](https://azure.microsoft.com/documentation/templates/101-simple-windows-vm/).

In Visual Studio, do the following:

1. Click **File** > **New** > **Project**.

2. In **Templates** > **Visual C#**, select **Console Application**, enter the name and location of the project, and then click **OK**.

3. Right-click the project name in Solution Explorer, and then click **Add** > **New Item**.

4. In the Add New Item window, select **Text File**, enter *VirtualMachineTemplate.json* for the name, and then click **Add**.

5. Open the VirtualMachineTemplate.json file and then add the opening and closing brackets, the required schema element, and the required contentVersion element:

	```
	{
		"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
		"contentVersion": "1.0.0.0",
	}
	```

6. [Parameters](../resource-group-authoring-templates.md#parameters) are not always required, but they make template management easier. They describe the type of the value, the default value if needed, and possibly the allowed values of the parameter. For this tutorial, the parameters that are used to create a virtual machine, a storage account, and a virtual network are added to the template.

    Add the parameters element and its child elements after the contentVersion element:

	```
	{
		"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
		"contentVersion": "1.0.0.0",
		"parameters": {
			"newStorageAccountName": { "type": "string" },
			"adminUserName": { "type": "string" },
			"adminPassword": { "type": "securestring" },
			"dnsNameForPublicIP": { "type": "string" },
			"windowsOSVersion": {
				"type": "string",
				"defaultValue": "2012-R2-Datacenter",
				"allowedValues": [ "2008-R2-SP1", "2012-Datacenter", "2012-R2-Datacenter" ]
			}
		},
 	}
	```

7. [Variables](../resource-group-authoring-templates.md#variables) can be used in a template to specify values that may change frequently or values that need to be created from a combination of parameter values.

    Add the variables element after the parameters section:

	```
	{
		"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
		"contentVersion": "1.0.0.0",
		"parameters": {
			"newStorageAccountName": { "type": "string" },
			"adminUsername": { "type": "string" },
			"adminPassword": { "type": "securestring" },
			"dnsNameForPublicIP": { "type": "string" },
			"windowsOSVersion": {
				"type": "string",
				"defaultValue": "2012-R2-Datacenter",
				"allowedValues": ["2008-R2-SP1", "2012-Datacenter", "2012-R2-Datacenter"]
			}
		},
		"variables": {
			"location": "West US",
			"imagePublisher": "MicrosoftWindowsServer",
			"imageOffer": "WindowsServer",
			"OSDiskName": "osdiskforwindowssimple",
			"nicName": "myVMnic1",
			"addressPrefix": "10.0.0.0/16",
			"subnetName": "Subnet",
			"subnetPrefix": "10.0.0.0/24",
			"storageAccountType": "Standard_LRS",
			"publicIPAddressName": "myPublicIP",
			"publicIPAddressType": "Dynamic",
			"vmStorageAccountContainerName": "vhds",
			"vmName": "MyWindowsVM",
			"vmSize": "Standard_A2",
			"virtualNetworkName": "MyVNET",
			"vnetID":"[resourceId('Microsoft.Network/virtualNetworks',variables('virtualNetworkName'))]",
			"subnet1Ref": "[concat(variables('vnetID'),'/subnets/',variables('subnet1Name'))]"
		},
	}
	```

8. [Resources](../resource-group-authoring-templates.md#resources) such as the virtual machine, the virtual network, and the storage account are defined next in the template.

    Add the resources section after the variables section:

	```
	{
		"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
		"contentVersion": "1.0.0.0",
		"parameters": {
			"newStorageAccountName": { "type": "string" },
			"adminUsername": { "type": "string" },
			"adminPassword": { "type": "securestring" },
			"dnsNameForPublicIP": { "type": "string" },
			"windowsOSVersion": {
				"type": "string",
				"defaultValue": "2012-R2-Datacenter",
				"allowedValues": [ "2008-R2-SP1", "2012-Datacenter", "2012-R2-Datacenter"]
			}
		},
		"variables": {
			"location": "West US",
			"imagePublisher": "MicrosoftWindowsServer",
			"imageOffer": "WindowsServer",
			"OSDiskName": "osdiskforwindowssimple",
			"nicName": "myVMnic1",
			"addressPrefix": "10.0.0.0/16",
			"subnetName": "Subnet",
			"subnetPrefix": "10.0.0.0/24",
			"storageAccountType": "Standard_LRS",
			"publicIPAddressName": "myPublicIP",
			"publicIPAddressType": "Dynamic",
			"vmStorageAccountContainerName": "vhds",
			"vmName": "MyWindowsVM",
			"vmSize": "Standard_A2",
			"virtualNetworkName": "MyVNET",
			"vnetID":"[resourceId('Microsoft.Network/virtualNetworks',variables('virtualNetworkName'))]",
			"subnet1Ref": "[concat(variables('vnetID'),'/subnets/',variables('subnet1Name'))]"
		},
		"resources": [
			{
  			"apiVersion": "2015-05-01-preview",
				"type": "Microsoft.Storage/storageAccounts",
				"name": "[parameters('newStorageAccountName')]",
				"location": "[variables('location')]",
				"properties": {
					"accountType": "[variables('storageAccountType')]"
				}
			},
			{
				"apiVersion": "2015-05-01-preview",
				"type": "Microsoft.Network/publicIPAddresses",
				"name": "[variables('publicIPAddressName')]",
				"location": "[variables('location')]",
				"properties": {
					"publicIPAllocationMethod": "[variables('publicIPAddressType')]",
					"dnsSettings": {
						"domainNameLabel": "[parameters('dnsNameForPublicIP')]"
					}
				}
			},
			{
				"apiVersion": "2015-05-01-preview",
				"type": "Microsoft.Network/virtualNetworks",
				"name": "[variables('virtualNetworkName')]",
				"location": "[variables('location')]",
				"properties": {
					"addressSpace": {
						"addressPrefixes": [ "[variables('addressPrefix')]" ]
					},
					"subnets": [ {
						"name": "[variables('subnetName')]",
						"properties": {
							"addressPrefix": "[variables('subnetPrefix')]"
						}
					} ]
				}
			},
			{
				"apiVersion": "2015-05-01-preview",
				"type": "Microsoft.Network/networkInterfaces",
				"name": "[variables('nicName')]",
				"location": "[variables('location')]",
				"dependsOn": [
					"[concat('Microsoft.Network/publicIPAddresses/', variables('publicIPAddressName'))]",
					"[concat('Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'))]"
				],
				"properties": {
					"ipConfigurations": [ {
						"name": "ipconfig1",
						"properties": {
							"privateIPAllocationMethod": "Dynamic",
							"publicIPAddress": {
								"id": "[resourceId('Microsoft.Network/publicIPAddresses', variables('publicIPAddressName'))]"
							},
							"subnet": {
								"id": "[variables('subnetRef')]"
							}
						}
					} ]
				}
			},
			{
				"apiVersion": "2015-06-15",
				"type": "Microsoft.Compute/virtualMachines",
				"name": "[variables('vmName')]",
				"location": "[variables('location')]",
				"dependsOn": [
					"[concat('Microsoft.Storage/storageAccounts/', parameters('newStorageAccountName'))]",
					"[concat('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
				],
				"properties": {
					"hardwareProfile": {
						"vmSize": "[variables('vmSize')]"
					},
					"osProfile": {
						"computerName": "[variables('vmName')]",
						"adminUsername": "[parameters('adminUsername')]",
						"adminPassword": "[parameters('adminPassword')]",
					},
					"storageProfile": {
						"imageReference": {
							"publisher": "[variables('imagePublisher')]",
							"offer": "[variables('imageOffer')]",
							"sku": "[parameters('windowsOSVersion')]",
							"version" : "latest"
						},
						"osDisk": {
							"name": "osdisk",
							"vhd": {
								"uri": "[concat('http://',parameters('newStorageAccountName'),'.blob.core.windows.net/',variables('vmStorageAccountContainerName'),'/',variables('OSDiskName'),'.vhd')]"
							},
							"caching": "ReadWrite",
							"createOption": "FromImage"
						}
					},
					"networkProfile": {
						"networkInterfaces" : [ {
							"id": "[resourceId('Microsoft.Network/networkInterfaces',variables('nicName'))]"
						} ]
					}
				}
			} ]
		}
		```

9. Save the template file that you created.

### Create the parameters file

To specify values for the resource parameters that were defined in the template, you create a parameters file that contains the values and submit it to the Resource Manager with the template. In Visual Studio, do the following:

1. Right-click the project name in Solution Explorer, and then click **Add**, and then  **New Item**.

2. In the Add New Item window, select **Text File**, enter *Parameters.json* for the Name, and then click **Add**.

3. Open the parameters.json file and then add the following JSON content:

	```
	{
		"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
		"contentVersion": "1.0.0.0",
		"parameters": {
			"newStorageAccountName": { "value": "mytestsa1" },
			"adminUserName": { "value": "mytestacct1" },
			"adminPassword": { "value": "mytestpass1" },
			"dnsNameForPublicIP": { "value": "mytestdns1" }
		}
	}
	```

    >[AZURE.NOTE] This tutorial creates a virtual machine running a version of the Windows Server operating system. To learn more about selecting other images, see [Navigate and select Azure virtual machine images with Windows PowerShell and the Azure CLI](virtual-machines-linux-cli-ps-findimage.md).


4. Save the parameters file that you created.

### Upload the files

The template file and the parameters file are accessed by Azure Resource Manager from an Azure storage account. To put the files in the first storage that you created, do the following:

1. Open Server Explorer and navigate to the container in your storage account where you want to place the file. For this tutorial, the container where the template is located is named templates.

2. In the upper-right corner of the templates container pane, click the Upload Blob icon, browse to the VirtualMachineTemplate.json file that you created, and then click **Open**.

3. Click the Upload Blob icon again, browse to the Parameters.json file that you created, and then click **Open**.

## Step 3: Install the libraries

NuGet packages are the easiest way to install the libraries that you need to finish this tutorial. You must install the Azure Resource Management Library and the Azure Active Directory Authentication Library. To get these libraries in Visual Studio, do the following:

1. Right-click the project name in the Solution Explorer, and then click **Manage NuGet Packages**.

2. Type *Active Directory* in the search box, click **Install** for the Active Directory Authentication Library package, and then follow the instructions to install the package.

3. At the top of the page, select **Include Prerelease**. Type *Microsoft.Azure.Management.Resources* in the search box, click **Install** for the Microsoft Azure Resource Management Libraries, and then follow the instructions to install the package.

You are now ready to start using the libraries to create your application.

##Step 4: Create the credentials that are used to authenticate requests

Now that the Azure Active Directory application is created and the authentication library has been installed, you format the application information into credentials that are used to authenticate requests to the Azure Resource Manager. Do the following:

1. Open the Program.cs file for the project that you created, and then add the following using statements to the top of the file:

	```
	using Microsoft.Azure;
	using Microsoft.IdentityModel.Clients.ActiveDirectory;
	using Microsoft.Azure.Management.Resources;
	using Microsoft.Azure.Management.Resources.Models;
	using Microsoft.Rest;
	```

2.	Add the following method to the Program class to get the token that is needed to create the credentials:

	```
	private static string GetAuthorizationHeader()
	{
		ClientCredential cc = new ClientCredential("{application-id}", "{password}");
		var context = new AuthenticationContext("https://login.windows.net/{tenant-id}");
		var result = context.AcquireTokenAsync("https://management.azure.com/", cc);
		if (result == null)
		{
			throw new InvalidOperationException("Failed to obtain the JWT token");
		}

		string token = result.AccessToken;

		return token;
	}
	```

	Replace {application-id} with the application identifier that you recorded earlier, {password} with the password that you chose for the AD application, and {tenant-id} with the tenant identifier for your subscription. You can find the tenant id by running Get-AzureSubscription.

3. Add the following code to the Main method in the Program.cs file to create the credentials:

	```
	var token = GetAuthorizationHeader();
	var credential = new TokenCredentials(token);
	```

4. Save the Program.cs file.


## Step 5: Add the code to deploy the template

Resources are always deployed from a template to a resource group. You use the [ResourceGroup](https://msdn.microsoft.com/library/azure/microsoft.azure.management.resources.models.resourcegroup.aspx) and the [ResourceManagementClient](https://msdn.microsoft.com/library/azure/microsoft.azure.management.resources.resourcemanagementclient.aspx) classes to create the resource group that the resources are deployed to.

1. Add the following method to the Program class to create the resource group:

	```
	public static void CreateResourceGroup(
		TokenCredentials credential,
		string groupName,
		string subscriptionId,
		string location)
	{
		Console.WriteLine("Creating the resource group...");
		var resourceManagementClient = new ResourceManagementClient(credential);
		resourceManagementClient.SubscriptionId = subscriptionId;
		var resourceGroup = new ResourceGroup {
			Location = location
		};
		var rgResult = resourceManagementClient.ResourceGroups.CreateOrUpdate(groupName, resourceGroup);
		Console.WriteLine(rgResult.StatusCode.Properties.ProvisioningState);
	}
	```

2. Add the following code to the Main method to call the method that you just added:

	```
	CreateResourceGroup(
		credential,
		"{group-name}",
		"{subscription-id}",
		"{location}");
		Console.ReadLine();
	```

	Replace {group-name} with the name that you want to use for the resource group. Replace {subscription-id} with your subscription identifier, you can get this by running Get-AzureSubscription. Replace location with the region that you want to create the resources, such as "West US".

3. Add the following method to the Program class to deploy the resources to the resource group by using the template that you defined:

	```
	public static void CreateTemplateDeployment(
		TokenCredentials credential,
		string groupName,
		string storageName,
		string deploymentName,
		string subscriptionId)
	{
		Console.WriteLine("Creating the template deployment...");
		var deployment = new Deployment();
		deployment.Properties = new DeploymentProperties
		{
			Mode = DeploymentMode.Incremental,
			TemplateLink = new TemplateLink
			{
				Uri = "https://{storage-name}.blob.core.windows.net/templates/VirtualMachineTemplate.json"
			},
			ParametersLink = new ParametersLink
			{
				Uri = "https://{storage-name}.blob.core.windows.net/templates/Parameters.json"
			}
		};
		var resourceManagementClient = new ResourceManagementClient(credential);
		resourceManagementClient.SubscriptionId = subscriptionId;
		var dpResult = resourceManagementClient.Deployments.CreateOrUpdate(
			groupName,
			deploymentName,
			deployment);
		Console.WriteLine(dpResult.Properties.ProvisioningState);
	}
	```

	Replace {storage-name} with the name of the account where you previously placed the files.

4. Add the following code to the Main method to call the method that you just added:

	```
	CreateTemplateDeployment(
		credential,
		"{group-name}",
		"{storage-name}",
		"{deployment-name}",
		"{subscription-id}");
	Console.ReadLine();
	```

    Replace {group-name} with the name of the resource group that you created. Replace {storage-name} with the name of the storage account where you placed the template files. Replace {deployment-name} with the name that you want to use to identify the deployment set of resources. Replace {subscription-id} with your subscription identifier, you can get this by running Get-AzureSubscription.

##Step 6: Add the code to delete the resources

Because you are charged for resources used in Azure, it is always a good practice to delete resources that are no longer needed. You don’t need to delete each resource separately from a resource group. You can delete the resource group and all of its resources will automatically be deleted.

1.	Add the following method to the Program class to delete the resource group:

	```
	public static void DeleteResourceGroup(
		TokenCredentials credential,
		string groupName,
		string subscriptionId)
	{
		Console.WriteLine("Deleting resource group...");
		var resourceGroupClient = new ResourceManagementClient(credential);
		resourceGroupClient.ResourceGroups.DeleteAsync(groupName);
	}
	```

2.	Add the following code to the Main method to call the method that you just added:

	```
	DeleteResourceGroup(
		credential,
		"{group-name}",
		"{subscription-id}");
	Console.ReadLine();
	```
    Replace {group-name} with the name of the resource group that you created. Replace {subscription-id} with your subscription identifier, you can get this by running Get-AzureSubscription.

##Step 7: Run the console application

1.	To run the console application, click **Start** in Visual Studio, and then sign in to Azure AD using the same username and password that you use with your subscription.

2.	Press **Enter** after the Accepted status appears.

	It should take about 5 minutes for this console application to run completely from start to finish. Before you press Enter to start deleting resources, you could take a few minutes to verify the creation of the resources in the Azure portal before you delete them.

3. Browse to the Audit Logs in the Azure portal to see the status of the resources:

	![Create an AD application](./media/virtual-machines-windows-csharp-template/crpportal.png)
