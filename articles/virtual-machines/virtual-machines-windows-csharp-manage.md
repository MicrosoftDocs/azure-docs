<properties
	pageTitle="Manage VMs using Azure Resource Manager and C# | Microsoft Azure"
	description="Manage virtual machines using Azure Resource Manager and C#."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="davidmu1"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="na"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/24/2016"
	ms.author="davidmu"/>

# Manage Azure Virtual Machines using Azure Resource Manager and C#  

The tasks in this article show you how to manage virtual machines, such as starting, stopping, and updating.

To complete the tasks in this article, you need:

- [Visual Studio](http://msdn.microsoft.com/library/dd831853.aspx)
- [An authentication token](../resource-group-authenticate-service-principal.md)

## Create a Visual Studio project and install packages

NuGet packages are the easiest ways to install the libraries that you need to finish the tasks in this article. You must install the Azure Active Directory Authentication Library and the Computer Resource Provider Library. To get these libraries in Visual Studio, do this:

1. Click **File** > **New** > **Project**.

2. In **Templates** > **Visual C#**, select **Console Application**, enter the name and location of the project, and then click **OK**.

3. Right-click the project name in the Solution Explorer, and then click **Manage NuGet Packages**.

4. Type *Active Directory* in the search box, click **Install** for the Active Directory Authentication Library package, and then follow the instructions to install the package.

5. At the top of the page, select **Include Prerelease**. Type *Microsoft.Azure.Management.Compute* in the search box, click **Install** for the Compute .NET Libraries, and then follow the instructions to install the package.

Now you're ready to start using the libraries to manage your virtual machines.

## Set up the project

Now that the Azure Active Directory application is created and the authentication library is installed, you format the application information into credentials that are used to authenticate requests to Azure Resource Manager.

1. Open the Program.cs file for the project that you created, and then add these using statements to the top of the file:

        using Microsoft.Azure;
        using Microsoft.IdentityModel.Clients.ActiveDirectory;
        using Microsoft.Azure.Management.Compute;
        using Microsoft.Azure.Management.Compute.Models;
        using Microsoft.Rest;
        
2. Add variables to the Main method of the Program class to specify the names of the resources that you want to manage, the location of the resources, such as "Central US", and your subscription identifier:

        var groupName = "resource group name";
        var vmName = "virtual machine name";  
        var location = "location name";
        var subscriptionId = "subsciption id";

    Replace all of the variable values with the names and identifier that you want to use. You can find the subscription identifier by running Get-AzureRmSubscription.
    
3. Add this method to the Program class to get the token that is needed to create the credentials.

	    private static async Task<AuthenticationResult> GetAccessTokenAsync()
	    {
          var cc = new ClientCredential("{client-id}", "{client-secret}");
          var context = new AuthenticationContext("https://login.windows.net/{tenant-id}");
          var result = await context.AcquireTokenAsync("https://management.azure.com/", cc);
          if (result == null)
          {
            throw new InvalidOperationException("Could not get the token");
          }
          return result;
        }
	
    Replace {client-id} with the identifier of the Azure Active Directory application, {client-secret} with the access key of the AD application, and {tenant-id} with the tenant identifier for your subscription. You can find the tenant id by running Get-AzureRmSubscription. You can find the access key by using the Azure portal.
    
4. Add this code to the Main method in Program.cs to create the credentials:

        var token = GetAccessTokenAsync();
        var credential = new TokenCredentials(token.Result.AccessToken);

5. Save the Program.cs file.

## Display information about a virtual machine

1. Add this method to the Program class in the project that you previously created:

        public static async void GetVirtualMachineAsync(
          TokenCredentials credential, 
          string groupName, 
          string vmName, 
          string subscriptionId)
        {
          Console.WriteLine("Getting information about the virtual machine...");

          var computeManagementClient = new ComputeManagementClient(credential)
            { SubscriptionId = subscriptionId };
          var vmResult = await computeManagementClient.VirtualMachines.GetAsync(
            groupName, 
            vmName, 
            InstanceViewTypes.InstanceView);

          Console.WriteLine("hardwareProfile");
          Console.WriteLine("   vmSize: " + vmResult.HardwareProfile.VmSize);

          Console.WriteLine("\nstorageProfile");
          Console.WriteLine("  imageReference");
          Console.WriteLine("    publisher: " + vmResult.StorageProfile.ImageReference.Publisher);
          Console.WriteLine("    offer: " + vmResult.StorageProfile.ImageReference.Offer);
          Console.WriteLine("    sku: " + vmResult.StorageProfile.ImageReference.Sku);
          Console.WriteLine("    version: " + vmResult.StorageProfile.ImageReference.Version);
          Console.WriteLine("  osDisk");
          Console.WriteLine("    osType: " + vmResult.StorageProfile.OsDisk.OsType);
          Console.WriteLine("    name: " + vmResult.StorageProfile.OsDisk.Name);
          Console.WriteLine("    createOption: " + vmResult.StorageProfile.OsDisk.CreateOption);
          Console.WriteLine("    uri: " + vmResult.StorageProfile.OsDisk.Vhd.Uri);
          Console.WriteLine("    caching: " + vmResult.StorageProfile.OsDisk.Caching);

          Console.WriteLine("\nosProfile");
          Console.WriteLine("  computerName: " + vmResult.OsProfile.ComputerName);
          Console.WriteLine("  adminUsername: " + vmResult.OsProfile.AdminUsername);
          Console.WriteLine("  provisionVMAgent: " + vmResult.OsProfile.WindowsConfiguration.ProvisionVMAgent.Value);
          Console.WriteLine("  enableAutomaticUpdates: " + vmResult.OsProfile.WindowsConfiguration.EnableAutomaticUpdates.Value);

          Console.WriteLine("\nnetworkProfile");
          foreach (NetworkInterfaceReference nic in vmResult.NetworkProfile.NetworkInterfaces)
          {
            Console.WriteLine("  networkInterface id: " + nic.Id);
          }

          Console.WriteLine("\nvmAgent");
          Console.WriteLine("  vmAgentVersion" + vmResult.InstanceView.VmAgent.VmAgentVersion);
          Console.WriteLine("    statuses");
          foreach (InstanceViewStatus stat in vmResult.InstanceView.VmAgent.Statuses)
          {
            Console.WriteLine("    code: " + stat.Code);
            Console.WriteLine("    level: " + stat.Level);
            Console.WriteLine("    displayStatus: " + stat.DisplayStatus);
            Console.WriteLine("    message: " + stat.Message);
            Console.WriteLine("    time: " + stat.Time);
          }

          Console.WriteLine("\ndisks");
          foreach (DiskInstanceView idisk in vmResult.InstanceView.Disks)
          {
            Console.WriteLine("  name: " + idisk.Name);
            Console.WriteLine("  statuses");
            foreach (InstanceViewStatus istat in idisk.Statuses)
            {
              Console.WriteLine("    code: " + istat.Code);
              Console.WriteLine("    level: " + istat.Level);
              Console.WriteLine("    displayStatus: " + istat.DisplayStatus);
              Console.WriteLine("    time: " + istat.Time);
            }
          }

          Console.WriteLine("\nVM general status");
          Console.WriteLine("  provisioningStatus: " + vmResult.ProvisioningState);
          Console.WriteLine("  id: " + vmResult.Id);
          Console.WriteLine("  name: " + vmResult.Name);
          Console.WriteLine("  type: " + vmResult.Type);
          Console.WriteLine("  location: " + vmResult.Location);
          Console.WriteLine("\nVM instance status");
          foreach (InstanceViewStatus istat in vmResult.InstanceView.Statuses)
          {
            Console.WriteLine("\n  code: " + istat.Code);
            Console.WriteLine("  level: " + istat.Level);
            Console.WriteLine("  displayStatus: " + istat.DisplayStatus);
          }
          
        }

2. Add this code to the Main method to call the method that you just added:

        GetVirtualMachineAsync(
          credential,
          groupName,
          vmName,
          subscriptionId);
        Console.WriteLine("\nPress enter to continue...");
        Console.ReadLine();
    
3. Save the Program.cs file.

4. Click **Start** in Visual Studio, and then sign in to Azure AD using the same username and password that you use with your subscription.

	When you run this method you should see something like this:
    
        Getting information about the virtual machine...
        hardwareProfile
          vmSize: Standard_A0

        storageProfile
          imageReference
            publisher: MicrosoftWindowsServer
            offer: WindowsServer
            sku: 2012-R2-Datacenter
            version: latest
          osDisk
            osType: Windows
            name: myosdisk
            createOption: FromImage
            uri: http://store1.blob.core.windows.net/vhds/myosdisk.vhd
            caching: ReadWrite

          osProfile
            computerName: vm1
            adminUsername: account1
            provisionVMAgent: True
            enableAutomaticUpdates: True

          networkProfile
            networkInterface 
              id: /subscriptions/{subscription-id}
                /resourceGroups/rg1/providers/Microsoft.Network/networkInterfaces/nc1

          vmAgent
            vmAgentVersion2.7.1198.766
            statuses
            code: ProvisioningState/succeeded
            level: Info
            displayStatus: Ready
            message: GuestAgent is running and accepting new configurations.
            time: 4/13/2016 8:35:32 PM

          disks
            name: myosdisk
            statuses
              code: ProvisioningState/succeeded
              level: Info
              displayStatus: Provisioning succeeded
              time: 4/13/2016 8:04:36 PM

          VM general status
            provisioningStatus: Succeeded
            id: /subscriptions/{subscription-id}
              /resourceGroups/rg1/providers/Microsoft.Compute/virtualMachines/vm1
            name: vm1
            type: Microsoft.Compute/virtualMachines
            location: centralus

          VM instance status
            code: ProvisioningState/succeeded
              level: Info
              displayStatus: Provisioning succeeded
            code: PowerState/running
              level: Info
              displayStatus: VM running

## Start a virtual machine

1. Comment out any code that you previously added to the Main method, except the code to get the credentials.

2. Add this method to the Program class:

        public static async void StartVirtualMachineAsync(
          TokenCredentials credential, 
          string groupName, 
          string vmName, 
          string subscriptionId)
        {
          Console.WriteLine("Starting the virtual machine...");
          var computeManagementClient = new ComputeManagementClient(credential)
            { SubscriptionId = subscriptionId };
          await computeManagementClient.VirtualMachines.StartAsync(groupName, vmName);
        }

3. Add this code to the Main method to call the method that you just added:

        StartVirtualMachineAsync(
          credential,
          groupName,
          vmName,
          subscriptionId);
        Console.WriteLine("\nPress enter to continue...");
        Console.ReadLine();

4. Save the Program.cs file.

5. Click **Start** in Visual Studio, and then sign in to Azure AD using the same username and password that you use with your subscription.

	You should see the status of the virtual machine change to Running.

## Stop a virtual machine

You can stop a virtual machine in two ways. You can stop a virtual machine and keep all of its settings, but continue to be charged for it, or you can stop a virtual machine and deallocate it, which also deallocates all resources associated with it and ends billing for the virtual machine.

1. Comment out any code that you previously added to the Main method, except the code to get the credentials.

2. Add this method to the Program class:

        public static void StopVirtualMachineAsync(
          TokenCredentials credential, 
          string groupName, 
          string vmName, 
          string subscriptionId)
        {
          Console.WriteLine("Stopping the virtual machine...");
          var computeManagementClient = new ComputeManagementClient(credential)
            { SubscriptionId = subscriptionId };
          await computeManagementClient.VirtualMachines.PowerOffAsync(groupName, vmName);
        }

	If you want to deallocate the virtual machine, change the PowerOff call to this:

        computeManagementClient.VirtualMachines.Deallocate(groupName, vmName);

3. Add this code to the Main method to call the method that you just added:

        StopVirtualMachineAsync(
          credential,
          groupName,
          vmName,
          subscriptionId);
        Console.WriteLine("\nPress enter to continue...");
        Console.ReadLine();

4. Save the Program.cs file.

5. Click **Start** in Visual Studio, and then sign in to Azure AD using the same username and password that you use with your subscription.

    You should see the status of the virtual machine change to Stopped. If you ran the method calling Deallocate, the status is Stopped (deallocated).

## Restart a running virtual machine

1. Comment out any code that you previously added to the Main method, except the code to get the credentials.

2. Add this method to the Program class:

        public static async void RestartVirtualMachineAsync(
          TokenCredentials credential,
          string groupName,
          string vmName,
          string subscriptionId)
        {
          Console.WriteLine("Restarting the virtual machine...");
          var computeManagementClient = new ComputeManagementClient(credential)
            { SubscriptionId = subscriptionId };
          await computeManagementClient.VirtualMachines.RestartAsync(groupName, vmName);
        }

3. Add this code to the Main method to call the method that you just added:

        RestartVirtualMachineAsync(
          credential,
          groupName,
          vmName,
          subscriptionId);
        Console.WriteLine("\nPress enter to continue...");
        Console.ReadLine();

4. Save the Program.cs file.

5. Click **Start** in Visual Studio, and then sign in to Azure AD using the same username and password that you use with your subscription.

## Delete a virtual machine

1. Comment out any code that you previously added to the Main method, except the code to get the credentials.

2. Add this method to the Program class:

        public static async void DeleteVirtualMachineAsync(
          TokenCredentials credential, 
          string groupName, 
          string vmName, 
          string subscriptionId)
        {
          Console.WriteLine("Deleting the virtual machine...");
          var computeManagementClient = new ComputeManagementClient(credential)
            { SubscriptionId = subscriptionId };
          await computeManagementClient.VirtualMachines.DeleteAsync(groupName, vmName);
        }

3. Add this code to the Main method to call the method that you just added:

        DeleteVirtualMachineAsync(
          credential,
          groupName,
          vmName,
          subscriptionId);
        Console.WriteLine("\nPress enter to continue...");
        Console.ReadLine();

4. Save the Program.cs file.

5. Click **Start** in Visual Studio, and then sign in to Azure AD using the same username and password that you use with your subscription.

## Update a virtual machine

This example shows you how to change the size of a running virtual machine.

1. Comment out any code that you previously added to the Main method, except the code to get the credentials.

2. Add this method to the Program class:

        public static async void UpdateVirtualMachineAsync(
          TokenCredentials credential, 
          string groupName, 
          string vmName, 
          string subscriptionId)
        {
          Console.WriteLine("Updating the virtual machine...");
          var computeManagementClient = new ComputeManagementClient(credential)
            { SubscriptionId = subscriptionId };
          var vmResult = await computeManagementClient.VirtualMachines.GetAsync(groupName, vmName);
          vmResult.HardwareProfile.VmSize = "Standard_A1";
          await computeManagementClient.VirtualMachines.CreateOrUpdateAsync(groupName, vmName, vmResult);
        }

3. Add this code to the Main method to call the method that you just added:

        UpdateVirtualMachineAsync(
          credential,
          groupName,
          vmName,
          subscriptionId);
        Console.WriteLine("\nPress enter to continue...");
        Console.ReadLine();

4. Save the Program.cs file.

5. Click **Start** in Visual Studio, and then sign in to Azure AD using the same username and password that you use with your subscription.

    You should see the size of the virtual machine change to Standard_A1
    
## Next Steps

If there were issues with a deployment, you might take a look at [Troubleshooting resource group deployments with Azure Portal](../resource-manager-troubleshoot-deployments-portal.md)
