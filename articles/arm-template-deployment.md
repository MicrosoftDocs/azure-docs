<properties 
	pageTitle="Deploy Azure Resources by Using a Template" 
	description="Learn to use some of the available clients in the Azure Resource Management Library to deploy a virtual machine, virtual network, and storage account" 
	services="virtual-machines,virtual-networks,storage" 
	documentationCenter="" 
	authors="davidmu1" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="multiple" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="vm-windows" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2015" 
	ms.author="davidmu"/>

# Deploy Azure Resources Using .NET Libraries and a Template

By using resource groups and templates, you're able to manage all of the resources that support your application together. This tutorial shows you how to use some of the available clients in the Azure Resource Management Library and how to build a template to deploy a virtual machine, virtual network, and storage account.

[AZURE.INCLUDE [free-trial-note](../includes/free-trial-note.md)]

To complete this tutorial you also need:

- [Visual Studio](http://msdn.microsoft.com/library/dd831853.aspx)
- [Azure storage account](storage-create-storage-account.md)
- [Windows Management Framework 3.0](http://www.microsoft.com/en-us/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/en-us/download/details.aspx?id=40855)
- [Azure PowerShell](install-configure-powershell.md)

It takes about 30 minutes to do these steps.

## Step 1: Add an application to Azure AD and set permissions

To use Azure AD to authenticate requests to Azure Resource Manager, an application must be added to the Default Directory. Do the following to add an application:

1. Open an Azure PowerShell command prompt, and then run this command:

        Switch-AzureMode –Name AzureResourceManager

2. Set the Azure account that you want to use for this tutorial. Run this command and enter the credentials for your subscription when prompted:

	    Add-AzureAccount

3. Replace {password} in the following command with the one that you want to use and then run it to create the application:

	    New-AzureADApplication -DisplayName "My AD Application 1" -HomePage "https://myapp1.com" -IdentifierUris "https://myapp1.com"  -Password "{password}"

4. Record the value the ApplicationId value in the response from the previous step. You will need it later in this tutorial:

	![Create an AD application](./media/arm-template-deployment/azureapplicationid.png)

	>[AZURE.NOTE] You can also find the application identifier in the client id field of the application in the Management Portal.	

5. Replace {application-id} with the identifier that you just recorded and then create the service principal for the application:

        New-AzureADServicePrincipal -ApplicationId {application-id} 

6. Set the permission to use the application:

	    New-AzureRoleAssignment -RoleDefinitionName Owner -ServicePrincipalName "https://myapp1.com"

## Step 2: Create the Visual Studio project, the template file, and the parameters file

###Create the template file

An Azure Resource Manager Template makes it possible for you to deploy and manage Azure resources together by using a JSON description of the resources and associated deployment parameters. In Visual Studio, do the following:

1. Click **File** > **New** > **Project**.

2. In **Templates** > **Visual C#**, select **Console Application**, enter the name and location of the project, and then click **OK**.

3. Right-click the project name in Solution Explorer, and then click **Add** > **New Item**.

4.	In the Add New Item window, select **Text File**, enter *VirtualMachineTemplate.json* for the name, and then click **Add**.

5.	Open the VirtualMachineTemplate.json file and then add the opening and closing brackets, the required schema element, and the required contentVersion element:

        {
            "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/VM.json",
            "contentVersion": "1.0.0.0",
        }

6. [Parameters](https://msdn.microsoft.com/library/azure/dn835138.aspx#parameters) are not always required, but they make template management easier. They describe the type of the value, the default value if needed, and possibly the allowed values of the parameter. For this tutorial, the parameters that are used to create a virtual machine, a storage account, and a virtual network are added to the template. 

    Add the parameters element and its child elements after the contentVersion element:

		{
		  "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/VM.json",
		  "contentVersion": "1.0.0.0",
		  "parameters": {
		    "location": { "type": "String", "defaultValue" : "West US", "allowedValues": [ "West US", "East US" ] },
            "newStorageAccountName": { "type": "string" },
            "storageAccountType": { "type": "string", "defaultValue": "Standard_LRS", "allowedValues": [ "Standard_LRS", "Standard_GRS" ] },
            "publicIPAddressName": { "type": "string" },
            "publicIPAddressType" : { "type" : "string", "defaultValue" : "Dynamic", "allowedValues" : [ "Dynamic" ] },
            "vmStorageAccountContainerName": { "type": "string", "defaultValue": "vhds" },
            "vmName": { "type": "string" },
            "vmSize": { "type": "string", "defaultValue": "Standard_A0", "allowedValues" : [ "Standard_A0", "Standard_A1" ] },
            "vmSourceImageName": { "type": "string" },
            "adminUserName": { "type": "string" },
            "adminPassword": { "type": "securestring" },
            "virtualNetworkName":{ "type" : "string" },
            "addressPrefix": { "type" : "string", "defaultValue" : "10.0.0.0/16" },
            "subnet1Name": { "type" : "string", "defaultValue" : "Subnet-1" },
            "subnet2Name": { "type" : "string", "defaultValue" : "Subnet-2" },
            "subnet1Prefix" : { "type" : "string", "defaultValue" : "10.0.0.0/24" },
            "subnet2Prefix" : { "type" : "string", "defaultValue" : "10.0.1.0/24" },
            "dnsName" : { "type" : "string" },
            "subscriptionId": { "type" : "string" },
            "nicName": { "type" : "string" }
          },
        }

7.	[Variables](https://msdn.microsoft.com/library/azure/dn835138.aspx#variables) can be used in a template to specify values that may change frequently or values that need to be created from a combination of parameter values. 

    Add the variables element after the parameters section:

		{
		  "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/VM.json",
		  "contentVersion": "1.0.0.0",
		  "parameters": {
		    "location": { "type": "String", "defaultValue" : "West US", "allowedValues": [ "West US", "East US" ] },
            "newStorageAccountName": { "type": "string" },
            "storageAccountType": { "type": "string", "defaultValue": "Standard_LRS", "allowedValues": [ "Standard_LRS", "Standard_GRS" ] },
            "publicIPAddressName": { "type": "string" },
            "publicIPAddressType" : { "type" : "string", "defaultValue" : "Dynamic", "allowedValues" : [ "Dynamic" ] },
            "vmStorageAccountContainerName": { "type": "string", "defaultValue": "vhds" },
            "vmName": { "type": "string" },
            "vmSize": { "type": "string", "defaultValue": "Standard_A0", "allowedValues" : [ "Standard_A0", "Standard_A1" ] },
            "vmSourceImageName": { "type": "string" },
            "adminUserName": { "type": "string" },
            "adminPassword": { "type": "securestring" },
            "virtualNetworkName":{ "type" : "string" },
            "addressPrefix": { "type" : "string", "defaultValue" : "10.0.0.0/16" },
            "subnet1Name": { "type" : "string", "defaultValue" : "Subnet-1" },
            "subnet2Name": { "type" : "string", "defaultValue" : "Subnet-2" },
            "subnet1Prefix" : { "type" : "string", "defaultValue" : "10.0.0.0/24" },
            "subnet2Prefix" : { "type" : "string", "defaultValue" : "10.0.1.0/24" },
            "dnsName" : { "type" : "string" },
            "subscriptionId": { "type" : "string" },
            "nicName": { "type" : "string" }
          },
          "variables": {
            "sourceImageName" : "[concat('/',parameters('subscriptionId'),'/services/images/',parameters('vmSourceImageName'))]",
            "vnetID":"[resourceId('Microsoft.Network/virtualNetworks',parameters('virtualNetworkName'))]",
            "subnet1Ref" : "[concat(variables('vnetID'),'/subnets/',parameters('subnet1Name'))]"
          },
        }

8.	[Resources](https://msdn.microsoft.com/library/azure/dn835138.aspx#resources) such as the virtual machine, the virtual network, and the storage account are defined next in the template. 

    Add the resources section after the variables section:

		{
		  "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/VM.json",
		  "contentVersion": "1.0.0.0",
		  "parameters": {
		    "location": { "type": "String", "defaultValue" : "West US", "allowedValues": [ "West US", "East US" ] },
            "newStorageAccountName": { "type": "string" },
            "storageAccountType": { "type": "string", "defaultValue": "Standard_LRS", "allowedValues": [ "Standard_LRS", "Standard_GRS" ] },
            "publicIPAddressName": { "type": "string" },
            "publicIPAddressType" : { "type" : "string", "defaultValue" : "Dynamic", "allowedValues" : [ "Dynamic" ] },
            "vmStorageAccountContainerName": { "type": "string", "defaultValue": "vhds" },
            "vmName": { "type": "string" },
            "vmSize": { "type": "string", "defaultValue": "Standard_A0", "allowedValues" : [ "Standard_A0", "Standard_A1" ] },
            "vmSourceImageName": { "type": "string" },
            "adminUserName": { "type": "string" },
            "adminPassword": { "type": "securestring" },
            "virtualNetworkName":{ "type" : "string" },
            "addressPrefix": { "type" : "string", "defaultValue" : "10.0.0.0/16" },
            "subnet1Name": { "type" : "string", "defaultValue" : "Subnet-1" },
            "subnet2Name": { "type" : "string", "defaultValue" : "Subnet-2" },
            "subnet1Prefix" : { "type" : "string", "defaultValue" : "10.0.0.0/24" },
            "subnet2Prefix" : { "type" : "string", "defaultValue" : "10.0.1.0/24" },
            "dnsName" : { "type" : "string" },
            "subscriptionId": { "type" : "string" },
            "nicName": { "type" : "string" }
          },
          "variables": {
            "sourceImageName" : "[concat('/',parameters('subscriptionId'),'/services/images/',parameters('vmSourceImageName'))]",
            "vnetID":"[resourceId('Microsoft.Network/virtualNetworks',parameters('virtualNetworkName'))]",
            "subnet1Ref" : "[concat(variables('vnetID'),'/subnets/',parameters('subnet1Name'))]"
          },
          "resources": [ {
            "apiVersion": "2014-12-01-preview",
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[parameters('newStorageAccountName')]",       
            "location": "[parameters('location')]",
            "properties": { "accountType": "[parameters('storageAccountType')]" }
          },
          {
            "apiVersion": "2014-12-01-preview",
            "type": "Microsoft.Network/publicIPAddresses",
            "name": "[parameters('publicIPAddressName')]",
            "location": "[parameters('location')]",
            "properties": { 
              "publicIPAllocationMethod": "[parameters('publicIPAddressType')]",
              "dnsSettings": { "domainNameLabel": "[parameters('dnsName')]" }
            }
          },
          {
            "apiVersion": "2014-12-01-preview",
            "type": "Microsoft.Network/virtualNetworks",
            "name": "[parameters('virtualNetworkName')]",
            "location": "[parameters('location')]",
            "properties": {
              "addressSpace": { "addressPrefixes": [ "[parameters('addressPrefix')]" ] },
              "subnets": [ {
                "name": "[parameters('subnet1Name')]",
                "properties": { "addressPrefix": "[parameters('subnet1Prefix')]" }
              },
              {
                "name": "[parameters('subnet2Name')]",
                "properties": { "addressPrefix": "[parameters('subnet2Prefix')]" }
              } ]
            }
          },
          {
            "apiVersion": "2014-12-01-preview",
            "type": "Microsoft.Network/networkInterfaces",
            "name": "[parameters('nicName')]",
            "location": "[parameters('location')]",
            "dependsOn": [
              "[concat('Microsoft.Network/publicIPAddresses/', parameters('publicIPAddressName'))]",
              "[concat('Microsoft.Network/virtualNetworks/', parameters('virtualNetworkName'))]"
            ],
            "properties": {
              "ipConfigurations": [ {
                "name": "ipconfig1",
                "properties": {
                  "privateIPAllocationMethod": "Dynamic",
                  "publicIPAddress": {
                    "id": "[resourceId('Microsoft.Network/publicIPAddresses', parameters('publicIPAddressName'))]"
                  },
                  "subnet": { "id": "[variables('subnet1Ref')]" }
                }
              } ]
            }
          },
          {
            "apiVersion": "2014-12-01-preview",
            "type": "Microsoft.Compute/virtualMachines",
            "name": "[parameters('vmName')]",
            "location": "[parameters('location')]",
            "dependsOn": [
              "[concat('Microsoft.Storage/storageAccounts/', parameters('newStorageAccountName'))]",
              "[concat('Microsoft.Network/networkInterfaces/', parameters('nicName'))]"
            ],
            "properties": {
              "hardwareProfile": { "vmSize": "[parameters('vmSize')]" },
              "osProfile": {
                "computername": "[parameters('vmName')]",
                "adminUsername": "[parameters('adminUsername')]",
                "adminPassword": "[parameters('adminPassword')]",
                "windowsProfile": { "provisionVMAgent": "true" }
              },
              "storageProfile": { 
                "sourceImage": { "id": "[variables('sourceImageName')]" },
                "destinationVhdsContainer" : "[concat('http://',parameters('newStorageAccountName'),'.blob.core.windows.net/',parameters('vmStorageAccountContainerName'),'/')]"
              },
              "networkProfile": {
                "networkInterfaces" : [ {
                  "id": "[resourceId('Microsoft.Network/networkInterfaces',parameters('nicName'))]"
                } ]
              }
            }
          } ]
        }

9.	Save the template file that you created.

###Create the parameters file

To specify values for the resource parameters that were defined in the template, you create a parameters file that contains the values and submit it to the Resource Manager with the template. In Visual Studio, do the following:

1.	Right-click the project name in Solution Explorer, and then click **Add**, and then  **New Item**.

2.	In the Add New Item window, select **Text File**, enter *Parameters.json* for the Name, and then click **Add**.

3.	Open the parameters.json file and then add the following JSON content:

        {
          "contentVersion": "1.0.0.0",
          "parameters": { 
            "vmName": { "value": "mytestvm1" },
            "newStorageAccountName": { "value": "mytestsa1" },
            "storageAccountType": { "value": "Standard_LRS" },
            "publicIPaddressName": { "value": "mytestip1" },
            "location": { "value": "West US" },
            "vmStorageAccountContainerName": { "value": "vhds" },
            "vmSize": { "value": "Standard_A1" },
            "subscriptionId": { "value": "{subscription-id}" },
            "vmSourceImageName": { "value": "{source-image-name}" },
            "adminUserName": { "value": "mytestacct1" },
            "adminPassword": { "value": "mytestpass1" },
            "virtualNetworkName": { "value": "mytestvn1" },
            "dnsName": { "value": "mytestdns1" }, 
            "nicName": { "value": "mytestnic1" } 
          }
        }

    >[AZURE.NOTE] Image vhd names change regularly in the image gallery, so you need to get a current image name to deploy the virtual machine. To do this, see [Manage Images Windows using Windows PowerShell](https://msdn.microsoft.com/library/azure/dn790330.aspx), and then replace {source-image-name} with the name of the vhd file that you want to use. For example,  "a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201412.01-en.us-127GB.vhd". Replace {subscription-id} with the identifier of your subscription.


4.	Save the parameters file that you created.

The template file and the parameters file are accessed by Azure Resource Manager from an Azure storage account. To put the files in storage, do the following:

1.	Open Server Explorer and navigate to the container in your storage account where you want to place the file. For this tutorial, the container where the template is located is named templates.

2.	In the upper-right corner of the templates container pane, click the Upload Blob icon, browse to the VirtualMachineTemplate.json file that you created, and then click **Open**.

3. Click the Upload Blob icon again, browse to the Parameters.json file that you created, and then click **Open**.

##Step 3: Install the libraries

NuGet packages are the easiest way to install the libraries that you need to finish this tutorial. You must install the Azure Resource Management Library and the Azure Active Directory Authentication Library. To get these libraries in Visual Studio, do the following:

1.	Right-click the project name in the Solution Explorer, and then click **Manage NuGet Packages**.

2.	Type *Active Directory* in the search box, click **Install** for the Active Directory Authentication Library package, and then follow the instructions to install the package.

3.	At the top of the page, select **Include Prerelease**. Type *Azure Resource Management* in the search box, click **Install** for the Microsoft Azure Resource Management Libraries, and then follow the instructions to install the package.

You are now ready to start using the libraries to create your application.

##Step 4: Create the credentials that are used to authenticate requests

Now that the Azure Active Directory application is created and the authentication library has been installed, you format the application information into credentials that are used to authenticate requests to the Azure Resource Manager. Do the following:

1.	Open the Program.cs file for the project that you created, and then add the following using statements to the top of the file:

        using Microsoft.Azure;
        using Microsoft.IdentityModel.Clients.ActiveDirectory;
        using Microsoft.Azure.Management.Resources;
        using Microsoft.Azure.Management.Resources.Models;

2.	Add the following method to the Program class to get the token that is needed to create the credentials:

        private static string GetAuthorizationHeader()
        {
          ClientCredential cc = new ClientCredential("{application-id}", "{password}");
            var context = new AuthenticationContext("https://login.windows.net/{tenant-id}");
            var result = context.AcquireToken("https://management.azure.com/", cc);
          if (result == null)
          {
            throw new InvalidOperationException("Failed to obtain the JWT token");
          }

          string token = result.AccessToken;

          return token;
        }

	Replace {application-id} with the application identifier that you recorded earlier, {password} with the password that you chose for the AD application, and {tenant-id} with the tenant identifier for your subscription. You can find the tenant id by running Get-AzureSubscription.

3.	Add the following code to the Main method in the Program.cs file to create the credentials:

		var token = GetAuthorizationHeader();
		var credential = new TokenCloudCredentials("{subscription-id}", token);

4.	Save the Program.cs file.


##Step 5: Add the code to deploy the template

Resources are always deployed from a template to a resource group. You use the [ResourceGroup](https://msdn.microsoft.com/library/azure/microsoft.azure.management.resources.models.resourcegroup.aspx) and the [ResourceManagementClient](https://msdn.microsoft.com/library/azure/microsoft.azure.management.resources.resourcemanagementclient.aspx) classes to create the resource group that the resources are deployed to.

1.	Add the following method to the Program class to create the resource group:

		public async static void CreateResourceGroup(TokenCloudCredentials credential)
		{
		  Console.WriteLine("Creating the resource group...");
		  var resourceGroup = new ResourceGroup { Location = "West US" };
		  using (var resourceManagementClient = new ResourceManagementClient(credential))
		  {
		    var rgResult = await resourceManagementClient.ResourceGroups.CreateOrUpdateAsync("mytestrg1", resourceGroup);
		    Console.WriteLine(rgResult.StatusCode);
		  }
		}

2.	Add the following code to the Main method to call the method that you just added:

		CreateResourceGroup(credential);
		Console.ReadLine();

3.	Add the following method to the Program class to deploy the resources to the resource group by using the template that you defined:

		public async static void CreateTemplateDeployment(TokenCloudCredentials credential)
		{
		  Console.WriteLine("Creating the template deployment...");
		  var deployment = new Deployment();
          deployment.Properties = new DeploymentProperties
		  {
		    Mode = DeploymentMode.Incremental,
		    TemplateLink = new TemplateLink
		    {
		      Uri = new Uri("https://{storage-account-name}.blob.core.windows.net/templates/VirtualMachineTemplate.json")
			},
			ParametersLink = new ParametersLink
			{
			  Uri = new Uri("https://{storage-account-name}.blob.core.windows.net/templates/Parameters.json")
			}
		  };
		  using (var templateDeploymentClient = new ResourceManagementClient(credential))
		  {
		    var dpResult = await templateDeploymentClient.Deployments.CreateOrUpdateAsync("mytestrg1", "mytestdp1", deployment);
			Console.WriteLine(dpResult.StatusCode);
		  }
		}

	Replace {storage-account-name} with the name of the account where you previously placed the files.

4.	Add the following code to the Main method to call the method that you just added:

		CreateTemplateDeployment(credential);
		Console.ReadLine();

##Step 6: Add the code to delete the resources

Because you are charged for resources used in Azure, it is always a good practice to delete resources that are no longer needed. You don’t need to delete each resource separately from a resource group. You can delete the resource group and all of its resources will automatically be deleted.

1.	Add the following method to the Program class to delete the resource group:

		public async static void DeleteResourceGroup(TokenCloudCredentials credential)
		{
		  using (var resourceGroupClient = new ResourceManagementClient(credential))
		  {
		    var rgResult = await resourceGroupClient.ResourceGroups.DeleteAsync("mytestrg1");
			Console.WriteLine(rgResult.StatusCode);
		  }
		}

2.	Add the following code to the Main method to call the method that you just added:

		DeleteResourceGroup(credential);
		Console.ReadLine();

##Step 7: Run the console application

1.	To run the console application, click **Start** in Visual Studio, and then sign in to Azure AD using the same username and password that you use with your subscription.

2.	Press **Enter** after each status code is returned to create each resource. After the virtual machine is created, do the next step before pressing Enter to delete all of the resources.

	It should take about 5 minutes for this console application to run completely from start to finish. Before you press Enter to start deleting resources, you could take a few minutes to verify the creation of the resources in the Azure preview portal before you delete them.

3. Browse to the Audit Logs in the Azure preview portal to see the status of the resources:

	![Create an AD application](./media/arm-template-deployment/crpportal.png)