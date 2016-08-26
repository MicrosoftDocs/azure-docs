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
	ms.date="06/24/2016"
	ms.author="davidmu"/>

# Deploy an Azure Virtual Machine using C# and a Resource Manager template

By using resource groups and templates, you're able to manage all of the resources together that support your application. This article shows you how to set up authentication and storage using Azure PowerShell, and then build and deploy a template using C# to create Azure resources.

You first need to make sure you've done this:

- Install [Visual Studio](http://msdn.microsoft.com/library/dd831853.aspx)
- Verify the installation of [Windows Management Framework 3.0](http://www.microsoft.com/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/download/details.aspx?id=40855)
- Get an [authentication token](../resource-group-authenticate-service-principal.md)

It takes about 30 minutes to do these steps.
    
## Step 1: Create a resource group for template storage

All resources must be deployed in a resource group. See [Azure Resource Manager overview](../resource-group-overview.md) for more information.

1. Get a list of available locations where resources can be created.

	    Get-AzureRmLocation | sort Location | Select Location
        
2. Replace the value of **$locName** with a location from the list, for example **centralus**. Create the variable.

        $locName = "location name"
        
3. Replace the value of **$rgName** with the name of the new resource group. Create the variable and the resource group.

        $rgName = "resource group name"
        New-AzureRmResourceGroup -Name $rgName -Location $locName
        
    You should see something like this:
    
        ResourceGroupName : myrg1
        Location          : centralus
        ProvisioningState : Succeeded
        Tags              :
        ResourceId        : /subscriptions/{subscription-id}/resourceGroups/myrg1
    
## Step 2: Create a storage account and the templates container

A storage account is needed to store the template that you are going to create and deploy.

1. Replace the value of $stName with the name (lowercase letters and numbers only) of the storage account. Test the name for uniqueness.

        $stName = "storage account name"
        Get-AzureRmStorageAccountNameAvailability $stName

    If this command returns **True**, your proposed name is unique.
    
2. Now, run this command to create the storage account.
    
        New-AzureRmStorageAccount -ResourceGroupName $rgName -Name $stName -SkuName "Standard_LRS" -Kind "Storage" -Location $locName
        
3. Replace {blob-storage-endpoint} with endpoint of the blob storage in your account. Replace {storage-account-name} with the name of your storage account. Replace {primary-storage-key} with the primary access key. Run these commands to create the container where the files are stored. You can get the endpoint and key values from the Azure portal. 

        $ConnectionString = "DefaultEndpointsProtocol=http;BlobEndpoint={blob-storage-endpoint};AccountName={storage-account-name};AccountKey={primary-storage-key}"
        $ctx = New-AzureStorageContext -ConnnectionString $ConnectionString
        New-AzureStorageContainer -Name "templates" -Permission Blob -Context $ctx

## Step 3: Create the Visual Studio project, the template file, and the parameters file

### Create the template file

An Azure Resource Manager Template makes it possible for you to deploy and manage Azure resources together by using a JSON description of the resources and associated deployment parameters.

In Visual Studio, do this:

1. Click **File** > **New** > **Project**.

2. In **Templates** > **Visual C#**, select **Console Application**, enter the name and location of the project, and then click **OK**.

3. Right-click the project name in Solution Explorer, and then click **Add** > **New Item**.

4. Click Web, select JSON File, enter *VirtualMachineTemplate.json* for the name, and then click **Add**.

5. In the opening and closing brackets of the VirtualMachineTemplate.json file, add the required schema element and the required contentVersion element:

        {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
          "contentVersion": "1.0.0.0",
        }

6. [Parameters](../resource-group-authoring-templates.md#parameters) are not always required, but they make template management easier. They describe the type of the value, the default value if needed, and possibly the allowed values of the parameter. For this tutorial, the parameters you use to create a virtual machine, a storage account, and a virtual network are added to the template. Add the parameters element and its child elements after the contentVersion element:

        {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "newStorageAccountName": { "type": "string" },
            "adminUserName": { "type": "string" },
            "adminPassword": { "type": "securestring" },
            "dnsNameForPublicIP": { "type": "string" }
          },
        }

7. [Variables](../resource-group-authoring-templates.md#variables) can be used in a template to specify values that may change frequently or values that need to be created from a combination of parameter values. Add the variables element after the parameters section:

        {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "newStorageAccountName": { "type": "string" },
            "adminUsername": { "type": "string" },
            "adminPassword": { "type": "securestring" },
            "dnsNameForPublicIP": { "type": "string" },
          },
          "variables": {
            "location": "West US",
            "imagePublisher": "MicrosoftWindowsServer",
            "imageOffer": "WindowsServer",
            "windowsOSVersion": "2012-R2-Datacenter",
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

8. [Resources](../resource-group-authoring-templates.md#resources) such as the virtual machine, the virtual network, and the storage account are defined next in the template. Add the resources section after the variables section:

        {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "newStorageAccountName": { "type": "string" },
            "adminUsername": { "type": "string" },
            "adminPassword": { "type": "securestring" },
            "dnsNameForPublicIP": { "type": "string" }
          },
          "variables": {
            "location": "West US",
            "imagePublisher": "MicrosoftWindowsServer",
            "imageOffer": "WindowsServer",
            "OSDiskName": "osdiskforwindowssimple",
            "windowsOSVersion": "2012-R2-Datacenter",
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
            "subnetRef": "[concat(variables('vnetID'),'/subnets/',variables('subnetName'))]"
          },
          "resources": [
            {
              "apiVersion": "2015-06-15",
              "type": "Microsoft.Storage/storageAccounts",
              "name": "[parameters('newStorageAccountName')]",
              "location": "[variables('location')]",
              "properties": {
                "accountType": "[variables('storageAccountType')]"
              }
            },
            {
              "apiVersion": "2016-03-30",
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
              "apiVersion": "2016-03-30",
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
              "apiVersion": "2016-03-30",
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
              "apiVersion": "2016-03-30",
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
                    "sku": "[variables('windowsOSVersion')]",
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
      
9. Save the template file that you created.

### Create the parameters file

To specify values for the resource parameters that were defined in the template, you create a parameters file that contains the values and submit it to the Resource Manager with the template. In Visual Studio, do this:

1. Right-click the project name in Solution Explorer, and then click **Add**, and then  **New Item**.

2. Click Web, select JSON File, enter *Parameters.json* for the Name, and then click **Add**.

3. Open the parameters.json file and then add this JSON content:

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

    >[AZURE.NOTE] This article creates a virtual machine running a version of the Windows Server operating system. To learn more about selecting other images, see [Navigate and select Azure virtual machine images with Windows PowerShell and the Azure CLI](virtual-machines-linux-cli-ps-findimage.md).

4. Save the parameters file that you created.

### Upload the files and set the permission to use them 

The template file and the parameters file are accessed by Azure Resource Manager from an Azure storage account. To put the files in the first storage that you created, do this:

1. Open Cloud Explorer, and then navigate to the templates container in your storage account that your created earlier.

2. In the templates container window, click the Upload Blob icon in the upper-right corner of the window, browse to the VirtualMachineTemplate.json file that you created, and then click **Open**.

3. Click the Upload Blob icon again, browse to the Parameters.json file that you created, and then click **Open**.

## Step 4: Install the libraries

NuGet packages are the easiest way to install the libraries that you need to finish this tutorial. You must install the Azure Resource Management Library and the Azure Active Directory Authentication Library. To get these libraries in Visual Studio, do this:

1. Right-click the project name in the Solution Explorer, and then click **Manage NuGet Packages**.

2. Type *Active Directory* in the search box, click **Install** for the Active Directory Authentication Library package, and then follow the instructions to install the package.

4. At the top of the page, select **Include Prerelease**. Type *Microsoft.Azure.Management.ResourceManager* in the search box, click **Install** for the Microsoft Azure Resource Management Libraries, and then follow the instructions to install the package.

Now you're ready to start using the libraries to create your application.

##Step 5: Create the credentials that are used to authenticate requests

The Azure Active Directory application is created and the authentication library is installed, now you format the application information into credentials that are used to authenticate requests to the Azure Resource Manager. Do this:

1. Open the Program.cs file for the project that you created, and then add these using statements to the top of the file:

        using Microsoft.Azure;
        using Microsoft.IdentityModel.Clients.ActiveDirectory;
        using Microsoft.Azure.Management.ResourceManager;
        using Microsoft.Azure.Management.ResourceManager.Models;
        using Microsoft.Rest;

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

3. Add this code to the Main method in the Program.cs file to create the credentials:

        var token = GetAccessTokenAsync();
        var credential = new TokenCredentials(token.Result.AccessToken);

4. Save the Program.cs file.

## Step 6: Add the code to deploy the template

In this step, you use the [ResourceGroup](https://msdn.microsoft.com/library/azure/microsoft.azure.management.resources.models.resourcegroup.aspx) and the [ResourceManagementClient](https://msdn.microsoft.com/library/azure/microsoft.azure.management.resources.resourcemanagementclient.aspx) classes to create the resource group that the resources are deployed to.

1. Add variables to the Main method of the Program class to specify the names that you want to use for the resources, the location of the resources, such as "Central US", administrator account information, and your subscription identifier:

        var groupName = "resource group name";
        var storageName = "storage account name";
        var location = "location name";
        var subscriptionId = "subsciption id";

    Replace all of the variable values with the names and identifier that you want to use. You can find the subscription identifier by running Get-AzureRmSubscription. The value of the storageName variable is the name of the storage account where the template was stored.
    
2. Add this method to the Program class to create the resource group:

        public static async Task<ResourceGroup> CreateResourceGroupAsync(
          TokenCredentials credential,
          string groupName,
          string subscriptionId,
          string location)
        {
          Console.WriteLine("Creating the resource group...");
          var resourceManagementClient = new ResourceManagementClient(credential) 
            { SubscriptionId = subscriptionId };
          var resourceGroup = new ResourceGroup { Location = location };
          return await resourceManagementClient.ResourceGroups.CreateOrUpdateAsync(groupName, resourceGroup);
        }

2. Add this code to the Main method to call the method that you just added:

        var rgResult = CreateResourceGroupAsync(
          credential,
          groupName,
          subscriptionId,
          location);
        Console.WriteLine(rgResult.Result.Properties.ProvisioningState);
        Console.ReadLine();

3. Add this method to the Program class to deploy the resources to the resource group by using the template that you defined:

        public static async Task<DeploymentExtended> CreateTemplateDeploymentAsync(
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
              Uri = "https://" + storageName + ".blob.core.windows.net/templates/VirtualMachineTemplate.json"
            },
            ParametersLink = new ParametersLink
            {
              Uri = "https://" + storageName + ".blob.core.windows.net/templates/Parameters.json"
            }
          };
          var resourceManagementClient = new ResourceManagementClient(credential) 
            { SubscriptionId = subscriptionId };
          return await resourceManagementClient.Deployments.CreateOrUpdateAsync(
            groupName,
            deploymentName,
            deployment);
        }

4. Add this code to the Main method to call the method that you just added:

        var dpResult = CreateTemplateDeploymentAsync(
          credential,
          groupName",
          storageName,
          deploymentName,
          subscriptionId);
        Console.WriteLine(dpResult.Result.Properties.ProvisioningState);
        Console.ReadLine();

##Step 7: Add the code to delete the resources

Because you are charged for resources used in Azure, it is always a good practice to delete resources that are no longer needed. You don’t need to delete each resource separately from a resource group. Just delete the resource group and all of its resources are automatically deleted.

1.	Add this method to the Program class to delete the resource group:

        public static async void DeleteResourceGroupAsync(
          TokenCredentials credential,
          string groupName,
          string subscriptionId)
        {
          Console.WriteLine("Deleting resource group...");
          var resourceManagementClient = new ResourceManagementClient(credential)
            { SubscriptionId = subscriptionId };
          return await resourceManagementClient.ResourceGroups.DeleteAsync(groupName);
        }

2.	Add this code to the Main method to call the method that you just added:

        DeleteResourceGroupAsync(
          credential,
          groupName,
          subscriptionId);
        Console.ReadLine();

##Step 8: Run the console application

1.	To run the console application, click **Start** in Visual Studio, and then sign in to Azure AD using the same credentials that you use with your subscription.

2.	Press **Enter** after the Accepted status appears.

	It should take about 5 minutes for this console application to run completely from start to finish. Before you press Enter to start deleting resources, you could take a few minutes to verify the creation of the resources in the Azure portal before you delete them.

3. Browse to the Audit Logs in the Azure portal to see the status of the resources:

	![Browse audit logs in Azure portal](./media/virtual-machines-windows-csharp-template/crpportal.png)

## Next Steps

- If there were issues with the deployment, a next step would be to look at [Troubleshooting resource group deployments with Azure Portal](../resource-manager-troubleshoot-deployments-portal.md).
- Learn how to manage the virtual machine that you just created by reviewing [Manage virtual machines using Azure Resource Manager and PowerShell](virtual-machines-windows-csharp-manage.md).
