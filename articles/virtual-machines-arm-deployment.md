<properties 
	pageTitle="Deploy Azure Resources Using the Compute, Network, and Storage .NET Libraries" 
	description="Learn to use some of the available clients in the Compute, Storage, and Network .NET libraries to create and delete resources in Microsoft Azure" 
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

#Deploy Azure Resources Using the Compute, Network, and Storage .NET Libraries

This tutorial shows you how to use some of the available clients in the Compute, Storage, and Network .NET libraries to create and delete resources in Microsoft Azure. It also shows you how to authenticate the requests to Azure Resource Manager by using Azure Active Directory.

[AZURE.INCLUDE [free-trial-note](../includes/free-trial-note.md)]

To complete this tutorial you also need:

- [Visual Studio](http://msdn.microsoft.com/library/dd831853.aspx)
- [Azure storage account](storage-create-storage-account.md)
- [Windows Management Framework 3.0](http://www.microsoft.com/en-us/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/en-us/download/details.aspx?id=40855)
- [Azure PowerShell](install-configure-powershell.md)

It takes about 30 minutes to do these steps.

## Step 1: Add an application to Azure AD and set permissions

To use Azure AD to authenticate requests to Azure Resource Manager, an application must be added to the Default Directory. Do the following to add an application:

1. Open an Azure PowerShell prompt, and then run this command:

        Switch-AzureMode –Name AzureResourceManager

2. Set the Azure account that you want to use for this tutorial. Run this command and enter the credentials for your subscription when prompted:

	    Add-AzureAccount

3. Replace {password} in the following command with the one that you want to use and then run it to create the application:

	    New-AzureADApplication -DisplayName "My AD Application 1" -HomePage "https://myapp1.com" -IdentifierUris "https://myapp1.com"  -Password "{password}"

4. Record the ApplicationId value in the response from the previous step. You will need it later in this tutorial:

	![Create an AD application](./media/virtual-machines-arm-deployment/azureapplicationid.png)

	>[AZURE.NOTE] You can also find the application identifier in the client id field of the application in the Management Portal.	

5. Replace {application-id} with the identifier that you just recorded and then create the service principal for the application:

        New-AzureADServicePrincipal -ApplicationId {application-id} 

6. Set the permission to use the application:

	    New-AzureRoleAssignment -RoleDefinitionName Owner -ServicePrincipalName "https://myapp1.com"

##Step 2: Create a Visual Studio project and install the libraries

NuGet packages are the easiest way to install the libraries that you need to finish this tutorial. You must install the Azure Resource Management Library, the Azure Active Directory Authentication Library, and the Computer Resource Provider Library. To get these libraries in Visual Studio, do the following:

1. Click **File** > **New** > **Project**.

2. In **Templates** > **Visual C#**, select **Console Application**, enter the name and location of the project, and then click **OK**.

3. Right-click the project name in the Solution Explorer, and then click **Manage NuGet Packages**.

4. Type *Active Directory* in the search box, click **Install** for the Active Directory Authentication Library package, and then follow the instructions to install the package.

5. At the top of the page, select **Include Prerelease**. Type *Azure Compute* in the search box, click **Install** for the Compute .NET Libraries, and then follow the instructions to install the package.

6. Type *Azure Network* in the search box, click **Install** for the Network .NET Libraries, and then follow the instructions to install the package.

7. Type *Azure Storage* in the search box, click **Install** for the Network .NET Libraries, and then follow the instructions to install the package.

8. Type *Azure Resource Management* in the search box, click **Install** for the Resource Management Libraries.

You are now ready to start using the libraries to create your application.

##Step 3: Create the credentials that are used to authenticate requests

Now that the Azure Active Directory application is created and the authentication library is installed, you format the application information into credentials that are used to authenticate requests to Azure Resource Manager. Do the following:

1.	Open the Program.cs file for the project that you created, and then add the following using statements to the top of the file:

        using Microsoft.Azure;
        using Microsoft.IdentityModel.Clients.ActiveDirectory;
		using Microsoft.Azure.Management.Resources;
		using Microsoft.Azure.Management.Resources.Models;
		using Microsoft.Azure.Management.Storage;
		using Microsoft.Azure.Management.Storage.Models;
		using Microsoft.Azure.Management.Network;
		using Microsoft.Azure.Management.Network.Models;
		using Microsoft.Azure.Management.Compute;
		using Microsoft.Azure.Management.Compute.Models;


2. Add the following method to the Program class to get the token that is needed to create the credentials:

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

	Replace {subscription-id} with your subscription identifier.

4.	Save the Program.cs file.

##Step 4: Add the code to create the resources

###Create a resource group

Resources are always deployed to a resource group. You use the [ResourceGroup](https://msdn.microsoft.com/library/azure/microsoft.azure.management.resources.models.resourcegroup.aspx) and the [ResourceManagementClient](https://msdn.microsoft.com/library/azure/microsoft.azure.management.resources.resourcemanagementclient.aspx) classes to create the resource group that the resources are deployed to.

1.	Add the following method to the Program class to create the resource group:

		public async static void CreateResourceGroup(TokenCloudCredentials credential)
		{
		  Console.WriteLine("Creating the resource group...");
		  
          using (var resourceManagementClient = new ResourceManagementClient(credential))
		  {
		    var rgResult = await resourceManagementClient.ResourceGroups.CreateOrUpdateAsync(
              "mytestrg1", 
              new ResourceGroup { Location = "West US" } );
		    Console.WriteLine(rgResult.StatusCode);
		  }
		}

2.	Add the following code to the Main method to call the method that you just added:

		CreateResourceGroup(credential);
		Console.ReadLine();

###Create a storage account

A storage account is needed to store the virtual hard disk file that is created for the virtual machine.

1.	Add the following method to the Program class to create the storage account:

		public async static void CreateStorageAccount(TokenCloudCredentials credential)
        {
          Console.WriteLine("Creating the storage account...");
          
          using (var storageManagementClient = new StorageManagementClient(credential))
          {
            var saResult = await storageManagementClient.StorageAccounts.CreateAsync(
              "mytestrg1",
              "mytestsa1",
              new StorageAccountCreateParameters()
              { AccountType = AccountType.StandardLRS, Location = "West US" } );
            Console.WriteLine(saResult.StatusCode);
          }
        }

3.	Add the following code to the Main method to call the method that you just added:
		
		CreateStorageAccount(credential);
		Console.ReadLine();

###Create a virtual network

A virtual machine is most productive when it is added to a virtual network.

1.	Add the following method to the Program class to create a subnet, a public IP address, and a virtual network:

		public async static void CreateNetwork(TokenCloudCredentials credential)
        {
          Console.WriteLine("Creating the virtual network...");
          using (var networkClient = new NetworkResourceProviderClient(credential))
          {
            var subnet = new Subnet
            {
              Name = "mytestsn1",
              AddressPrefix = "10.0.0.0/24"
            };

            var vnResult = await networkClient.VirtualNetworks.CreateOrUpdateAsync(
              "mytestrg1",
              "mytestvn1",
              new VirtualNetwork
              {
                Location = "West US",
                AddressSpace = new AddressSpace { AddressPrefixes = new List<string> { "10.0.0.0/16" } },
                Subnets = new List<Subnet> { subnet }
              });
            Console.WriteLine(vnResult.StatusCode);

            var subnetResponse = await networkClient.Subnets.GetAsync(
              "mytestrg1",
              "mytestvn1",
              "mytestsn1"
            );

            Console.WriteLine("Creating the public ip...");
            vnResult = await networkClient.PublicIpAddresses.CreateOrUpdateAsync(
              "mytestrg1",
              "mytestip1",
              new PublicIpAddress
              {
                Location = "West US",
                PublicIpAllocationMethod = "Dynamic"
              });
            Console.WriteLine(vnResult.StatusCode);

            var pubipResponse = await networkClient.PublicIpAddresses.GetAsync("mytestrg1", "mytestip1");

            Console.WriteLine("Updating the network with the nic...");
            vnResult = await networkClient.NetworkInterfaces.CreateOrUpdateAsync(
              "mytestrg1",
              "mytestnic1",
              new NetworkInterface
              {
                Name = "mytestnic1",
                Location = "West US",
                IpConfigurations = new List<NetworkInterfaceIpConfiguration>
                {
                  new NetworkInterfaceIpConfiguration
                  {
                    Name = "nicconfig1",
                    PublicIpAddress = new ResourceId
                    {
                      Id = pubipResponse.PublicIpAddress.Id
                    },
                    Subnet = new ResourceId
                    {
                      Id = subnetResponse.Subnet.Id
                    }
                  }
                }
              });
            Console.WriteLine(vnResult.StatusCode);
          }
        }

2.	Add the following code to the Main method to call the method that you just added:

		CreateNetwork(credential);
		Console.ReadLine();

###Create a virtual machine

Now that you created all of the supporting resources, you can create a virtual machine.

1.	Add the following method to the Program class to create the virtual machine:

		public async static void CreateVirtualMachine(TokenCloudCredentials credential)
        {
          using (var computeClient = new ComputeManagementClient(credential))
          {
            Console.WriteLine("Creating the availability set...");
            var avSetResponse = await computeClient.AvailabilitySets.CreateOrUpdateAsync(
              "mytestrg1",
              new AvailabilitySet
              {
                Name = "mytestav1",
                Location = "West US"
              } );
            Console.WriteLine(avSetResponse.StatusCode);
                
            var networkClient = new NetworkResourceProviderClient(credential);
            var nicResponse = await networkClient.NetworkInterfaces.GetAsync("mytestrg1", "mytestnic1");

            Console.WriteLine("Creating the virtual machine...");
            var putVMResponse = await computeClient.VirtualMachines.CreateOrUpdateAsync(
              "mytestrg1",
              new VirtualMachine
              {
                Name = "mytestvm1",
                Location = "West US",
                AvailabilitySetReference = new AvailabilitySetReference
                {
                  ReferenceUri = avSetResponse.AvailabilitySet.Id
                },
                HardwareProfile = new HardwareProfile
                {
                  VirtualMachineSize = "Standard_A0"
                },
                OSProfile = new OSProfile
                {
                  AdminUsername = "mytestuser1",
                  AdminPassword = "Mytestpass1",
                  ComputerName = "mytestsv1",
                  WindowsConfiguration = new WindowsConfiguration
                  {
                    ProvisionVMAgent = true
                  }
                },
                NetworkProfile = new NetworkProfile
                {
                  NetworkInterfaces = new List<NetworkInterfaceReference>
                  {
                    new NetworkInterfaceReference
                    {
                      ReferenceUri = nicResponse.NetworkInterface.Id
                    }
                  }
                },
                StorageProfile = new StorageProfile
                {
                  SourceImage = new SourceImageReference
                  {
                    ReferenceUri = "/{subscription-id}/services/images/a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201502.01-en.us-127GB.vhd"
                  },
                  OSDisk = new OSDisk
                  {
                    Name = "myosdisk1",
                    CreateOption = "FromImage",
                    VirtualHardDisk = new VirtualHardDisk 
                    {
                      Uri = "http://mytestsa1.blob.core.windows.net/vhds/myosdisk1.vhd"
                    }
                  }
                }
              } );
            Console.WriteLine(putVMResponse.StatusCode);
          }
        }

	>[AZURE.NOTE] Image vhd names change regularly in the image gallery, so you need to get a current image name to deploy the virtual machine. To do this, see [Manage Images Windows using Windows PowerShell](https://msdn.microsoft.com/library/azure/dn790330.aspx), and then replace {source-image-name} with the name of the vhd file that you want to use. For example,  "a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201411.01-en.us-127GB.vhd". 

	Replace {subscription-id} with the identifier of your subscription.

2.	Add the following code to the Main method to call the method that you just added:

		CreateVirtualMachine(credential);
        Console.ReadLine();

##Step 5: Add the code to delete the resources

Because you are charged for resources used in Azure, it is always a good practice to delete resources that are no longer needed. If you want to delete the virtual machines and all of the supporting resources, all you have to do is delete the resource group.

1.	Add the following method to the Program class to delete the resource group:

		public async static void DeleteResourceGroup(TokenCloudCredentials credential)
        {
          Console.WriteLine("Deleting resource group...");
          using (var resourceGroupClient = new ResourceManagementClient(credential))
          {
            var rgResult = await resourceGroupClient.ResourceGroups.DeleteAsync("mytestrg1");
            Console.WriteLine(rgResult.StatusCode);
          }
        }

2.	Add the following code to the Main method to call the method that you just added:

		DeleteResourceGroup(credential);
        Console.ReadLine();

##Step 6: Run the console application

1.	To run the console application, click **Start** in Visual Studio, and then sign in to Azure AD using the same username and password that you use with your subscription.

2.	Press **Enter** after each status code is returned to create each resource. After the virtual machine is created, do the next step before pressing Enter to delete all of the resources.

	It should take about 5 minutes for this console application to run completely from start to finish. Before you press Enter to start deleting resources, you could take a few minutes to verify the creation of the resources in the Azure preview portal before you delete them.

3. Browse to the Audit Logs in the Azure preview portal to see the status of the resources:

	![Create an AD application](./media/virtual-machines-arm-deployment/crpportal.png)