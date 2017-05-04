---
title: Deploy an Azure Virtual Machine Using C# | Microsoft Docs
description: Use C# and Azure Resource Manager to deploy a virtual machine and all its supporting resources.
services: virtual-machines-windows
documentationcenter: ''
author: davidmu1
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 87524373-5f52-4f4b-94af-50bf7b65c277
ms.service: virtual-machines-windows
ms.workload: na
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 03/01/2017
ms.author: davidmu

---
# Deploy an Azure Virtual Machine Using C# #

This article shows you how use C# to create an Azure virtual machine and its supporting resources.

It takes about 20 minutes to do these steps.

## Step 1: Create a Visual Studio project

In this step, you make sure that Visual Studio is installed and you create a console application used to create the resources.

1. If you haven't already, install [Visual Studio](https://www.visualstudio.com/).
2. In Visual Studio, click **File** > **New** > **Project**.
3. In **Templates** > **Visual C#**, select **Console Application**, enter the name and location of the project, and then click **OK**.

## Step 2: Install libraries

NuGet packages are the easiest way to install the libraries that you need to finish these steps. To get the libraries that you need in Visual Studio, do these steps:


1. Right-click the project name in the Solution Explorer, click **Manage NuGet Packages**, and then click **Browse**.
2. Type *Microsoft.IdentityModel.Clients.ActiveDirectory* in the search box, click **Install**, and then follow the instructions to install the package.
3. At the top of the page, select **Include Prerelease**. Type *Microsoft.Azure.Management.Compute* in the search box, click **Install**, and then follow the instructions to install the package.
4. Type *Microsoft.Azure.Management.Network* in the search box, click **Install**, and then follow the instructions to install the package.
5. Type *Microsoft.Azure.Management.Storage* in the search box, click **Install**, and then follow the instructions to install the package.
6. Type *Microsoft.Azure.Management.ResourceManager* in the search box, click **Install**, and then follow the instructions to install the package.

Now you're ready to start using the libraries to create your application.

## Step 3: Create the credentials used to authenticate requests

Before you start this step, make sure that you have access to an [Active Directory service principal](../../resource-group-authenticate-service-principal.md). From the service principal, you acquire a token for authenticating requests to Azure Resource Manager.

1. Open the Program.cs file for the project that you created, and then add these using statements to the top of the file:
   
    ```
    using Microsoft.Azure;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using Microsoft.Azure.Management.ResourceManager;
    using Microsoft.Azure.Management.ResourceManager.Models;
    using Microsoft.Azure.Management.Storage;
    using Microsoft.Azure.Management.Storage.Models;
    using Microsoft.Azure.Management.Network;
    using Microsoft.Azure.Management.Network.Models;
    using Microsoft.Azure.Management.Compute;
    using Microsoft.Azure.Management.Compute.Models;
    using Microsoft.Rest;
    ```

2. To get the token that's needed to create the credentials, add this method to the Program class:
   
    ```    
    private static async Task<AuthenticationResult> GetAccessTokenAsync()
    {
      var cc = new ClientCredential("{client-id}", "{client-secret}");
      var context = new AuthenticationContext("https://login.windows.net/{tenant-id}");
      var token = await context.AcquireTokenAsync("https://management.azure.com/", cc);
      if (token == null)
      {
        throw new InvalidOperationException("Could not get the token");
      }
      return token;
    }
    ```

    Replace these values:
    
    - *{client-id}* with the identifier of the Azure Active Directory application. You can find this identifier on the Properties blade of your AD application. To find your AD application in the Azure portal, click **Azure Active Directory** in the resource menu, and then click **App registrations**.
    - *{client-secret}* with the access key of the AD application. You can find this identifier on the Properties blade of your AD application.
    - *{tenant-id}* with the tenant identifier of your subscription. You can find the tenant identifier on the Properties blade for Azure Active Directory in the Azure portal. It is labeled *Directory ID*.

3. To call the method that you previously added, add this code to the Main method in the Program.cs file:
   
    ```
    var token = GetAccessTokenAsync();
    var credential = new TokenCredentials(token.Result.AccessToken);
    ```

4. Save the Program.cs file.

## Step 3: Create the resources

### Register the providers and create a resource group

All resources must be contained in a resource group. Before you can add resources to a group, your subscription must be registered with the resource providers.

1. Add variables to the Main method of the Program class to specify the names that you want to use for the resources:

    ```   
    var groupName = "myResourceGroup";
    var subscriptionId = "subsciptionId";
    var storageName = "myStorageAccount";
    var ipName = "myPublicIP";
    var subnetName = "mySubnet";
    var vnetName = "myVnet";
    var nicName = "myNIC";
    var avSetName = "myAVSet";
    var vmName = "myVM";  
    var location = "location";
    var adminName = "adminName";
    var adminPassword = "adminPassword";
    ```

    Replace these values:

    - All resource names that start with *my*, with names that make sense for your environment.
    - *subscriptionId* with your subscription identifier. You can find the subscription identifier on the Subscriptions blade of the Azure portal.
    - *location* with the [Azure region](https://azure.microsoft.com/regions/) where you want to create the resources.
    - *adminName* with the name of the administrator account on the virtual machine.
    - *adminPassword* with the password of the administrator account.

2. To create the resource group and register the providers, add this method to the Program class:
   
    ```
    public static async Task<ResourceGroup> CreateResourceGroupAsync(
      TokenCredentials credential,
      string groupName,
      string subscriptionId,
      string location)
    {
      var resourceManagementClient = new ResourceManagementClient(credential)
        { SubscriptionId = subscriptionId };
   
      Console.WriteLine("Registering the providers...");
      var rpResult = resourceManagementClient.Providers.Register("Microsoft.Storage");
      Console.WriteLine(rpResult.RegistrationState);
      rpResult = resourceManagementClient.Providers.Register("Microsoft.Network");
      Console.WriteLine(rpResult.RegistrationState);
      rpResult = resourceManagementClient.Providers.Register("Microsoft.Compute");
      Console.WriteLine(rpResult.RegistrationState);
   
      Console.WriteLine("Creating the resource group...");
      var resourceGroup = new ResourceGroup { Location = location };
      return await resourceManagementClient.ResourceGroups.CreateOrUpdateAsync(
        groupName, 
        resourceGroup);
    }
    ```

3. To call the method that you previously added, add this code to the Main method:
   
    ```   
    var rgResult = CreateResourceGroupAsync(
      credential,
      groupName,
      subscriptionId,
      location);
    Console.WriteLine(rgResult.Result.Properties.ProvisioningState);
    Console.ReadLine();
    ```

### Create a storage account

When using an unmanaged disk, a [storage account](../../storage/storage-create-storage-account.md) is needed to store the virtual hard disk file that is created for the virtual machine.

1. To create the storage account, add this method to the Program class:

    ```   
    public static async Task<StorageAccount> CreateStorageAccountAsync(
      TokenCredentials credential,       
      string groupName,
      string subscriptionId,
      string location,
      string storageName)
    {
      var storageManagementClient = new StorageManagementClient(credential)
        { SubscriptionId = subscriptionId };
      
      Console.WriteLine("Creating the storage account...");

      return await storageManagementClient.StorageAccounts.CreateAsync(
        groupName,
        storageName,
        new StorageAccountCreateParameters()
          {
            Sku = new Microsoft.Azure.Management.Storage.Models.Sku() 
              { Name = SkuName.StandardLRS},
            Kind = Kind.Storage,
            Location = location
          }
      );
    }
    ```

2. To call the method that you previously added, add this code to the Main method:
   
    ```
    var stResult = CreateStorageAccountAsync(
      credential,
      groupName,
      subscriptionId,
      location,
      storageName);
    Console.WriteLine(stResult.Result.ProvisioningState);  
    Console.ReadLine();
    ```

### Create a public IP address

A public IP address is needed to communicate with the virtual machine.

1. To create the public IP address for the virtual machine, add this method to the Program class:
   
    ```
    public static async Task<PublicIPAddress> CreatePublicIPAddressAsync(
      TokenCredentials credential,  
      string groupName,
      string subscriptionId,
      string location,
      string ipName)
    {
      var networkManagementClient = new NetworkManagementClient(credential)
        { SubscriptionId = subscriptionId };
      
      Console.WriteLine("Creating the public ip...");

      return await networkManagementClient.PublicIPAddresses.CreateOrUpdateAsync(
        groupName,
        ipName,
        new PublicIPAddress
          {
            Location = location,
            PublicIPAllocationMethod = "Dynamic"
          }
      );
    }
    ```

2. To call the method that you previously added, add this code to the Main method:
   
    ```   
    var ipResult = CreatePublicIPAddressAsync(
      credential,
      groupName,
      subscriptionId,
      location,
      ipName);
    Console.WriteLine(ipResult.Result.ProvisioningState);  
    Console.ReadLine();
    ```

### Create a virtual network

A virtual machine that's created with the Resource Manager deployment model must be in a virtual network.

1. To create a subnet and a virtual network, add this method to the Program class:

    ```   
    public static async Task<VirtualNetwork> CreateVirtualNetworkAsync(
      TokenCredentials credential,
      string groupName,
      string subscriptionId,
      string location,
      string vnetName,
      string subnetName)
    {
      var networkManagementClient = new NetworkManagementClient(credential)
        { SubscriptionId = subscriptionId };
   
      var subnet = new Subnet
        {
          Name = subnetName,
          AddressPrefix = "10.0.0.0/24"
        };
   
      var address = new AddressSpace 
        {
          AddressPrefixes = new List<string> { "10.0.0.0/16" }
        };
         
      Console.WriteLine("Creating the virtual network...");
      return await networkManagementClient.VirtualNetworks.CreateOrUpdateAsync(
        groupName,
        vnetName,
        new VirtualNetwork
          {
            Location = location,
            AddressSpace = address,
            Subnets = new List<Subnet> { subnet }
          }
      );
    }
    ```

2. To call the method that you previously added, add this code to the Main method:

    ```   
    var vnResult = CreateVirtualNetworkAsync(
      credential,
      groupName,
      subscriptionId,
      location,
      vnetName,
      subnetName);
    Console.WriteLine(vnResult.Result.ProvisioningState);  
    Console.ReadLine();
    ```

### Create a network interface

A virtual machine needs a network interface to communicate on the virtual network.

1. To create a network interface, add this method to the Program class:

    ```   
    public static async Task<NetworkInterface> CreateNetworkInterfaceAsync(
      TokenCredentials credential,
      string groupName,
      string subscriptionId,
      string location,
      string subnetName,
      string vnetName,
      string ipName,
      string nicName)
    {
      var networkManagementClient = new NetworkManagementClient(credential)
        { SubscriptionId = subscriptionId };
      var subnet = await networkManagementClient.Subnets.GetAsync(
        groupName,
        vnetName,
        subnetName
      );
      var publicIP = await networkManagementClient.PublicIPAddresses.GetAsync(
        groupName, 
        ipName
      );
   
      Console.WriteLine("Creating the network interface...");
      return await networkManagementClient.NetworkInterfaces.CreateOrUpdateAsync(
        groupName,
        nicName,
        new NetworkInterface
          {
            Location = location,
            IpConfigurations = new List<NetworkInterfaceIPConfiguration>
              {
                new NetworkInterfaceIPConfiguration
                  {
                    Name = nicName,
                    PublicIPAddress = pubipResponse,
                    Subnet = subnetResponse
                  }
              }
          }
      );
    }
    ```

2. To call the method that you previously added, add this code to the Main method:
   
    ```
    var ncResult = CreateNetworkInterfaceAsync(
      credential,
      groupName,
      subscriptionId,
      location,
      subnetName,
      vnetName,
      ipName,
      nicName);
    Console.WriteLine(ncResult.Result.ProvisioningState);  
    Console.ReadLine();
    ```

### Create an availability set

Availability sets make it easier for you to manage the maintenance of the virtual machines used by your application.

1. To create the availability set, add this method to the Program class:

    ```   
    public static async Task<AvailabilitySet> CreateAvailabilitySetAsync(
      TokenCredentials credential,
      string groupName,
      string subscriptionId,
      string location,
      string avsetName)
    {
      var computeManagementClient = new ComputeManagementClient(credential)
        { SubscriptionId = subscriptionId };
        
      Console.WriteLine("Creating the availability set...");
      return await computeManagementClient.AvailabilitySets.CreateOrUpdateAsync(
        groupName,
        avsetName,
        new AvailabilitySet()
          { Location = location }
      );
    }
    ```

2. To call the method that you previously added, add this code to the Main method:
   
    ```
    var avResult = CreateAvailabilitySetAsync(
      credential,  
      groupName,
      subscriptionId,
      location,
      avSetName);
    Console.ReadLine();
    ```

### Create a virtual machine

Now that you created all the supporting resources, you can create a virtual machine.

1. To create the virtual machine, add this method to the Program class:

    ```   
    public static async Task<VirtualMachine> CreateVirtualMachineAsync(
      TokenCredentials credential, 
      string groupName,
      string subscriptionId,
      string location,
      string nicName,
      string avsetName,
      string storageName,
      string adminName,
      string adminPassword,
      string vmName)
    {
      var networkManagementClient = new NetworkManagementClient(credential)
        { SubscriptionId = subscriptionId };
      var computeManagementClient = new ComputeManagementClient(credential)
        { SubscriptionId = subscriptionId };  
      var nic = await networkManagementClient.NetworkInterfaces.GetAsync(
        groupName, 
        nicName);
      var avSet = await computeManagementClient.AvailabilitySets.GetAsync(
        groupName, 
        avsetName);
   
      Console.WriteLine("Creating the virtual machine...");
      return await computeManagementClient.VirtualMachines.CreateOrUpdateAsync(
        groupName,
        vmName,
        new VirtualMachine
          {
            Location = location,
            AvailabilitySet = new Microsoft.Azure.Management.Compute.Models.SubResource
              {
                Id = avSet.Id
              },
            HardwareProfile = new HardwareProfile
              {
                VmSize = "Standard_A0"
              },
            OsProfile = new OSProfile
              {
                AdminUsername = adminName,
                AdminPassword = adminPassword,
                ComputerName = vmName,
                WindowsConfiguration = new WindowsConfiguration
                  {
                    ProvisionVMAgent = true
                  }
              },
            NetworkProfile = new NetworkProfile
              {
                NetworkInterfaces = new List<NetworkInterfaceReference>
                  {
                    new NetworkInterfaceReference { Id = nic.Id }
                  }
              },
            StorageProfile = new StorageProfile
              {
                ImageReference = new ImageReference
                  {
                    Publisher = "MicrosoftWindowsServer",
                    Offer = "WindowsServer",
                    Sku = "2012-R2-Datacenter",
                    Version = "latest"
                  },
                OsDisk = new OSDisk
                  {
                    Name = "mytestod1",
                    CreateOption = DiskCreateOptionTypes.FromImage,
                    Vhd = new VirtualHardDisk
                      {
                        Uri = "http://" + storageName + ".blob.core.windows.net/vhds/mytestod1.vhd"
                      }
                  }
              }
          }
      );
    }
    ```

    > [!NOTE]
    > This tutorial creates a virtual machine running a version of the Windows Server operating system. To learn more about selecting other images, see [Navigate and select Azure virtual machine images with Windows PowerShell and the Azure CLI](../linux/cli-ps-findimage.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
    > 
    >

2. To call the method that you previously added, add this code to the Main method:
   
    ```
    var vmResult = CreateVirtualMachineAsync(
      credential,
      groupName,
      subscriptionId,
      location,
      nicName,
      avSetName,
      storageName,
      adminName,
      adminPassword,
      vmName);
    Console.WriteLine(vmResult.Result.ProvisioningState);
    Console.ReadLine();
    ```

## Step 4: Delete the resources

Because you are charged for resources used in Azure, it is always good practice to delete resources that are no longer needed. If you want to delete the virtual machines and all the supporting resources, all you have to do is delete the resource group.

1. To delete the resource group, add this method to the Program class:
   
    ```
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
    ```

2. To call the method that you previously added, add this code to the Main method:
   
    ```   
    DeleteResourceGroupAsync(
      credential,
      groupName,
      subscriptionId);
    Console.ReadLine();
    ```

## Step 5: Run the console application

1. To run the console application, click **Start** in Visual Studio, and then sign in to Azure AD using the same username and password that you use with your subscription.

2. Press **Enter** after the *Succeeded* status appears. 
   
3. After the virtual machine is created and before you press **Enter** to start deleting resources, you could take a few minutes to inspect the resources in the Azure portal.

## Next Steps
* Take advantage of using a template to create a virtual machine by using the information in [Deploy an Azure Virtual Machine using C# and a Resource Manager template](csharp-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
* Learn how to manage the virtual machine that you created by reviewing [Manage Azure Virtual Machines using Azure Resource Manager and C#](csharp-manage.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

