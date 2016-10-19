<properties
	pageTitle="Deploy a VM using C# and a Resource Manager template | Microsoft Azure"
	description="Learn to how to use C# and a Resource Manager template to deploy an Azure VM."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="davidmu1"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="na"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/10/2016"
	ms.author="davidmu"/>

# Deploy an Azure Virtual Machine using C# and a Resource Manager template

By using resource groups and templates, you're able to manage all the resources together that support your application. This article shows you how to use Visual Studio and C# to set up authentication, create a template, and then deploy Azure resources using the template that you created.

You first need to make sure you've done these setup steps:

- Install [Visual Studio](http://msdn.microsoft.com/library/dd831853.aspx)
- Verify the installation of [Windows Management Framework 3.0](http://www.microsoft.com/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/download/details.aspx?id=40855)
- Get an [authentication token](../resource-group-authenticate-service-principal.md)
- Create a resource group using [Azure PowerShell](../resource-group-template-deploy.md), [Azure CLI](../resource-group-template-deploy-cli.md), or [Azure portal](../resource-group-template-deploy-portal.md).

It takes about 30 minutes to do these steps.
    
## Step 1: Create the Visual Studio project, the template file, and the parameters file

### Create the template file

An Azure Resource Manager template makes it possible for you to deploy and manage Azure resources together. The template is a JSON description of the resources and associated deployment parameters.

In Visual Studio, do these steps:

1. Click **File** > **New** > **Project**.

2. In **Templates** > **Visual C#**, select **Console Application**, enter the name and location of the project, and then click **OK**.

3. Right-click the project name in Solution Explorer, click **Add** > **New Item**.

4. Click Web, select JSON File, enter *VirtualMachineTemplate.json* for the name, and then click **Add**.

5. In the opening and closing brackets of the VirtualMachineTemplate.json file, add the required schema element and the required contentVersion element:

        {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
          "contentVersion": "1.0.0.0",
        }

6. [Parameters](../resource-group-authoring-templates.md#parameters) are not always required, but they provide a way to input values when the template is deployed. Add the parameters element and its child elements after the contentVersion element:

        {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "adminUserName": { "type": "string" },
            "adminPassword": { "type": "securestring" }
          },
        }

7. [Variables](../resource-group-authoring-templates.md#variables) can be used in a template to specify values that may change frequently or values that need to be created from a combination of parameter values. Add the variables element after the parameters section:

        {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "adminUsername": { "type": "string" },
            "adminPassword": { "type": "securestring" }
          },
          "variables": {
            "vnetID":"[resourceId('Microsoft.Network/virtualNetworks','myvn1')]",
            "subnetRef": "[concat(variables('vnetID'),'/subnets/mysn1')]"  
          },
        }

8. [Resources](../resource-group-authoring-templates.md#resources) such as the virtual machine, the virtual network, and the storage account are defined next in the template. Add the resources section after the variables section:

        {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "adminUsername": { "type": "string" },
            "adminPassword": { "type": "securestring" }
          },
          "variables": {
            "vnetID":"[resourceId('Microsoft.Network/virtualNetworks','myvn1')]",
            "subnetRef": "[concat(variables('vnetID'),'/subnets/mysn1')]"
          },
          "resources": [
            {
              "type": "Microsoft.Storage/storageAccounts",
              "name": "mystorage1",
              "apiVersion": "2015-06-15",
              "location": "[resourceGroup().location]",
              "properties": { "accountType": "Standard_LRS" }
            },
            {
              "apiVersion": "2016-03-30",
              "type": "Microsoft.Network/publicIPAddresses",
              "name": "myip1",
              "location": "[resourceGroup().location]",
              "properties": {
                "publicIPAllocationMethod": "Dynamic",
                "dnsSettings": { "domainNameLabel": "mydns1" }
              }
            },
            {
              "apiVersion": "2016-03-30",
              "type": "Microsoft.Network/virtualNetworks",
              "name": "myvnet1",
              "location": "[resourceGroup().location]",
              "properties": {
                "addressSpace": { "addressPrefixes": [ "10.0.0.0/16" ] },
                "subnets": [ {
                  "name": "mysn1",
                  "properties": { "addressPrefix": "10.0.0.0/24" }
                } ]
              }
            },
            {
              "apiVersion": "2016-03-30",
              "type": "Microsoft.Network/networkInterfaces",
              "name": "mync1",
              "location": "[resourceGroup().location]",
              "dependsOn": [
                "Microsoft.Network/publicIPAddresses/myip1",
                "Microsoft.Network/virtualNetworks/myvn1"
              ],
              "properties": {
                "ipConfigurations": [ {
                  "name": "ipconfig1",
                  "properties": {
                    "privateIPAllocationMethod": "Dynamic",
                    "publicIPAddress": {
                      "id": "[resourceId('Microsoft.Network/publicIPAddresses', 'myip1')]"
                    },
                    "subnet": { "id": "[variables('subnetRef')]" }
                  }
                } ]
              }
            },
            {
              "apiVersion": "2016-03-30",
              "type": "Microsoft.Compute/virtualMachines",
              "name": "myvm1",
              "location": "[resourceGroup().location]",
              "dependsOn": [
                "Microsoft.Network/networkInterfaces/mync1",
                "Microsoft.Storage/storageAccounts/mystorage1"
              ],
              "properties": {
                "hardwareProfile": { "vmSize": "Standard_A1" },
                "osProfile": {
                  "computerName": "myvm1",
                  "adminUsername": "[parameters('adminUsername')]",
                  "adminPassword": "[parameters('adminPassword')]"
                },
                "storageProfile": {
                  "imageReference": {
                    "publisher": "MicrosoftWindowsServer",
                    "offer": "WindowsServer",
                    "sku": "2012-R2-Datacenter",
                    "version" : "latest"
                  },
                  "osDisk": {
                    "name": "myosdisk1",
                    "vhd": {
                      "uri": "https://mystorage1.blob.core.windows.net/vhds/myosdisk1.vhd"
                    },
                    "caching": "ReadWrite",
                    "createOption": "FromImage"
                  }
                },
                "networkProfile": {
                  "networkInterfaces" : [ {
                    "id": "[resourceId('Microsoft.Network/networkInterfaces','mync1')]"
                  } ]
                }
              }
            } ]
          }
      
9. Save the template file that you created.

### Create the parameters file

To specify values for the resource parameters that were defined in the template, you create a parameters file that contains the values that are used when the template is deployed. In Visual Studio, do these steps:

1. Right-click the project name in Solution Explorer, click **Add** > **New Item**.

2. Click Web, select JSON File, enter *Parameters.json* for the Name, and then click **Add**.

3. Open the parameters.json file and then add this JSON content:

        {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "adminUserName": { "value": "mytestacct1" },
            "adminPassword": { "value": "mytestpass1" }
          }
        }

    >[AZURE.NOTE] This article creates a virtual machine running a version of the Windows Server operating system. To learn more about selecting other images, see [Navigate and select Azure virtual machine images with Windows PowerShell and the Azure CLI](virtual-machines-linux-cli-ps-findimage.md).

4. Save the parameters file that you created.

## Step 2: Install the libraries

NuGet packages are the easiest way to install the libraries that you need to finish this tutorial. You need the Azure Resource Management Library and the Azure Active Directory Authentication Library to create the resources. To get these libraries in Visual Studio, do these steps:

1. Right-click the project name in the Solution Explorer, click **Manage NuGet Packages**, and then click Browse.

2. Type *Active Directory* in the search box, click **Install** for the Active Directory Authentication Library package, and then follow the instructions to install the package.

4. At the top of the page, select **Include Prerelease**. Type *Microsoft.Azure.Management.ResourceManager* in the search box, click **Install** for the Microsoft Azure Resource Management Libraries, and then follow the instructions to install the package.

Now you're ready to start using the libraries to create your application.

## Step 3: Create the credentials that are used to authenticate requests

The Azure Active Directory application is created and the authentication library is installed. Now you format the application information into credentials that are used to authenticate requests to the Azure Resource Manager.

1. Open the Program.cs file for the project that you created, and then add these using statements to the top of the file:

        using Microsoft.Azure;
        using Microsoft.IdentityModel.Clients.ActiveDirectory;
        using Microsoft.Azure.Management.ResourceManager;
        using Microsoft.Azure.Management.ResourceManager.Models;
        using Microsoft.Rest;
        using System.IO;

2.	Add this method to the Program class to get the token that's needed to create the credentials:

        private static async Task<AuthenticationResult> GetAccessTokenAsync()
        {
          var cc = new ClientCredential("{client-id}", "{client-secret}");
          var context = new AuthenticationContext("https://login.windows.net/{tenant-id}");
          var token = await context.AcquireTokenAsync("https://management.azure.com/", cc);
          if (token == null)
          {
            throw new InvalidOperationException("Could not get the token.");
          }
          return token;
        }

    Replace {client-id} with the identifier of the Azure Active Directory application, {client-secret} with the access key of the AD application, and {tenant-id} with the tenant identifier for your subscription. You can find the tenant id by running Get-AzureRmSubscription. You can find the access key by using the Azure portal.

3. To create the credentials, add this code to the Main method in the Program.cs file:

        var token = GetAccessTokenAsync();
        var credential = new TokenCredentials(token.Result.AccessToken);

4. Save the Program.cs file.

## Step 4: Deploy the template

In this step, you use the resource group that you previously created, but you could also create a resource group using the [ResourceGroup](https://msdn.microsoft.com/library/azure/microsoft.azure.management.resources.models.resourcegroup.aspx) and the [ResourceManagementClient](https://msdn.microsoft.com/library/azure/microsoft.azure.management.resources.resourcemanagementclient.aspx) classes.

1. Add variables to the Main method of the Program class to specify the names of the resources that you previously created, the deployment name, and your subscription identifier:

        var groupName = "resource group name";
        var subscriptionId = "subsciption id";
        var deploymentName = "deployment name";

    Replace the value of groupName with the name of your resource group. Replace the value of deploymentName with the name that you want to use for the deployment. You can find the subscription identifier by running Get-AzureRmSubscription.

2. Add this method to the Program class to deploy the resources to the resource group by using the template that you defined:

        public static async Task<DeploymentExtended> CreateTemplateDeploymentAsync(
          TokenCredentials credential,
          string groupName,
          string deploymentName,
          string subscriptionId)
        {
          Console.WriteLine("Creating the template deployment...");
          var deployment = new Deployment();
          deployment.Properties = new DeploymentProperties
          {
            Mode = DeploymentMode.Incremental,
            Template = File.ReadAllText("..\\..\\VirtualMachineTemplate.json"),
            Parameters = File.ReadAllText("..\\..\\Parameters.json")
          };
          var resourceManagementClient = new ResourceManagementClient(credential) 
            { SubscriptionId = subscriptionId };
          return await resourceManagementClient.Deployments.CreateOrUpdateAsync(
            groupName,
            deploymentName,
            deployment);
        }

    If you wanted to deploy the template from a storage account, you can replace the Template property with the TemplateLink property.

3. To call the method that you just added, add this code to the Main method:

        var dpResult = CreateTemplateDeploymentAsync(
          credential,
          groupName,
          deploymentName,
          subscriptionId);
        Console.WriteLine(dpResult.Result.Properties.ProvisioningState);
        Console.ReadLine();

## Step 5: Delete the resources

Because you are charged for resources used in Azure, it is always a good practice to delete resources that are no longer needed. You don’t need to delete each resource separately from a resource group. Delete the resource group and all its resources are automatically deleted.

1.	To delete the resource group, add this method to the Program class:

        public static async void DeleteResourceGroupAsync(
          TokenCredentials credential,
          string groupName,
          string subscriptionId)
        {
          Console.WriteLine("Deleting resource group...");
          var resourceManagementClient = new ResourceManagementClient(credential)
            { SubscriptionId = subscriptionId };
          await resourceManagementClient.ResourceGroups.DeleteAsync(groupName);
        }

2.	To call the method that you just added, add this code to the Main method:

        DeleteResourceGroupAsync(
          credential,
          groupName,
          subscriptionId);
        Console.ReadLine();

##Step 6: Run the console application

1.	To run the console application, click **Start** in Visual Studio, and then sign in to Azure AD using the same credentials that you use with your subscription.

2.	Press **Enter** after the Accepted status appears.

	It should take about five minutes for this console application to run completely from start to finish. Before you press Enter to start deleting resources, you could take a few minutes to verify the creation of the resources in the Azure portal before you delete them.

3. To see the status of the resources, browse to the Audit Logs in the Azure portal:

	![Browse audit logs in Azure portal](./media/virtual-machines-windows-csharp-template/crpportal.png)

## Next Steps

- If there were issues with the deployment, a next step would be to look at [Troubleshooting resource group deployments with Azure portal](../resource-manager-troubleshoot-deployments-portal.md).
- Learn how to manage the virtual machine that you created by reviewing [Manage virtual machines using Azure Resource Manager and PowerShell](virtual-machines-windows-csharp-manage.md).
