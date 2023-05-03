---
title: Create and Manage an Azure Virtual Machine Using Java 
description: Use Java and Azure Resource Manager to deploy a virtual machine and all its supporting resources.
services: virtual-machines
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure
ms.topic: how-to
ms.date: 10/09/2021
ms.custom: devx-track-java, devx-track-arm-template
ms.author: cynthn
---
# Create and manage Windows VMs in Azure using Java

**Applies to:** :heavy_check_mark: Windows VMs 

An [Azure Virtual Machine](overview.md) (VM) needs several supporting Azure resources. This article covers creating, managing, and deleting VM resources using Java. You learn how to:

> [!div class="checklist"]
> * Create a Maven project
> * Add dependencies
> * Create credentials
> * Create resources
> * Perform management tasks
> * Delete resources
> * Run the application

It takes about 20 minutes to do these steps.

## Create a Maven project

1. If you haven't already done so, install [Java](/azure/developer/java/fundamentals/java-support-on-azure).
2. Install [Maven](https://maven.apache.org/download.cgi).
3. Create a new folder and the project:
    
    ```
    mkdir java-azure-test
    cd java-azure-test
    
    mvn archetype:generate -DgroupId=com.fabrikam -DartifactId=testAzureApp -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
    ```

## Add dependencies

1. Under the `testAzureApp` folder, open the `pom.xml` file and add the build configuration to &lt;project&gt; to enable the building of your application:

    ```xml
    <build>
      <plugins>
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>exec-maven-plugin</artifactId>
            <configuration>
                <mainClass>com.fabrikam.testAzureApp.App</mainClass>
            </configuration>
        </plugin>
      </plugins>
    </build>
    ```

2. Add the dependencies that are needed to access the Azure Java SDK.

    ```xml
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-identity</artifactId>
      <version>1.3.6</version>
    </dependency>
    <dependency>
      <groupId>com.azure.resourcemanager</groupId>
      <artifactId>azure-resourcemanager</artifactId>
      <version>2.8.0</version>
    </dependency>
    ```

3. Save the file.

## Set up authentication

Learn how to [set up authentication](/azure/developer/java/sdk/get-started#set-up-authentication).

## Create the management client

1. Open the `App.java` file under `src\main\java\com\fabrikam` and make sure this package statement is at the top:

    ```java
    package com.fabrikam.testAzureApp;
    ```

2. Create AzureResourceManager：
   
    ```java
    TokenCredential credential = new EnvironmentCredentialBuilder()
                .authorityHost(AzureAuthorityHosts.AZURE_PUBLIC_CLOUD)
                .build();

    // Please finish 'Set up authentication' step first to set the four environment variables: AZURE_SUBSCRIPTION_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID
    AzureProfile profile = new AzureProfile(AzureEnvironment.AZURE);

    AzureResourceManager azureResourceManager = AzureResourceManager.configure()
            .withLogLevel(HttpLogDetailLevel.BASIC)
            .authenticate(credential, profile)
            .withDefaultSubscription();
    ```

## Create resources

### Create the resource group

All resources must be contained in a [Resource group](../../azure-resource-manager/management/overview.md).

To specify values for the application and create the resource group, add this code to the try block in the main method:

```java
System.out.println("Creating resource group...");
ResourceGroup resourceGroup = azure.resourceGroups()
    .define("myResourceGroup")
    .withRegion(Region.US_EAST)
    .create();
```

### Create the availability set

[Availability sets](tutorial-availability-sets.md) make it easier for you to maintain the virtual machines used by your application.

To create the availability set, add this code to the try block in the main method:

```java
System.out.println("Creating availability set...");
AvailabilitySet availabilitySet = azure.availabilitySets()
    .define("myAvailabilitySet")
    .withRegion(Region.US_EAST)
    .withExistingResourceGroup("myResourceGroup")
    .create();
```
### Create the public IP address

A [Public IP address](../../virtual-network/ip-services/public-ip-addresses.md) is needed to communicate with the virtual machine.

To create the public IP address for the virtual machine, add this code to the try block in the main method:

```java
System.out.println("Creating public IP address...");
PublicIpAddress publicIPAddress = azure.publicIpAddresses()
    .define("myPublicIP")
    .withRegion(Region.US_EAST)
    .withExistingResourceGroup("myResourceGroup")
    .withDynamicIP()
    .create();
```

### Create the virtual network

A virtual machine must be in a subnet of a [Virtual network](../../virtual-network/virtual-networks-overview.md).

To create a subnet and a virtual network, add this code to the try block in the main method:

```java
System.out.println("Creating virtual network...");
Network network = azure.networks()
    .define("myVN")
    .withRegion(Region.US_EAST)
    .withExistingResourceGroup("myResourceGroup")
    .withAddressSpace("10.0.0.0/16")
    .withSubnet("mySubnet", "10.0.0.0/24")
    .create();
```

### Create the network interface

A virtual machine needs a network interface to communicate on the virtual network.

To create a network interface, add this code to the try block in the main method:

```java
System.out.println("Creating network interface...");
NetworkInterface networkInterface = azure.networkInterfaces()
    .define("myNIC")
    .withRegion(Region.US_EAST)
    .withExistingResourceGroup("myResourceGroup")
    .withExistingPrimaryNetwork(network)
    .withSubnet("mySubnet")
    .withPrimaryPrivateIPAddressDynamic()
    .withExistingPrimaryPublicIPAddress(publicIPAddress)
    .create();
```

### Create the virtual machine

Now that you created all the supporting resources, you can create a virtual machine.

To create the virtual machine, add this code to the try block in the main method:

```java
System.out.println("Creating virtual machine...");
VirtualMachine virtualMachine = azure.virtualMachines()
    .define("myVM")
    .withRegion(Region.US_EAST)
    .withExistingResourceGroup("myResourceGroup")
    .withExistingPrimaryNetworkInterface(networkInterface)
    .withLatestWindowsImage("MicrosoftWindowsServer", "WindowsServer", "2012-R2-Datacenter")
    .withAdminUsername("azureuser")
    .withAdminPassword("Azure12345678")
    .withComputerName("myVM")
    .withExistingAvailabilitySet(availabilitySet)
    .withSize("Standard_DS1")
    .create();
Scanner input = new Scanner(System.in);
System.out.println("Press enter to get information about the VM...");
input.nextLine();
```

> [!NOTE]
> This tutorial creates a virtual machine running a version of the Windows Server operating system. To learn more about selecting other images, see [Navigate and select Azure virtual machine images with Windows PowerShell and the Azure CLI](../linux/cli-ps-findimage.md).
> 
>

If you want to use an existing disk instead of a marketplace image, use this code: 

```java
Disk managedDisk = azure.disks().define("myosdisk")
    .withRegion(Region.US_EAST)
    .withExistingResourceGroup("myResourceGroup")
    .withWindowsFromVhd("https://mystorage.blob.core.windows.net/vhds/myosdisk.vhd")
    .withStorageAccountName("mystorage")
    .withSizeInGB(128)
    .withSku(DiskSkuTypes.PREMIUM_LRS)
    .create();

azure.virtualMachines().define("myVM")
    .withRegion(Region.US_EAST)
    .withExistingResourceGroup("myResourceGroup")
    .withExistingPrimaryNetworkInterface(networkInterface)
    .withSpecializedOSDisk(managedDisk, OperatingSystemTypes.WINDOWS)
    .withExistingAvailabilitySet(availabilitySet)
    .withSize(VirtualMachineSizeTypes.STANDARD_DS1)
    .create();
```

## Perform management tasks

During the lifecycle of a virtual machine, you may want to run management tasks such as starting, stopping, or deleting a virtual machine. Additionally, you may want to create code to automate repetitive or complex tasks.

When you need to do anything with the VM, you need to get an instance of it. Add this code to the try block of the main method:

```java
VirtualMachine vm = azure.virtualMachines().getByResourceGroup("myResourceGroup", "myVM");
```

### Get information about the VM

To get information about the virtual machine, add this code to the try block in the main method:

```java
System.out.println("hardwareProfile");
System.out.println("    vmSize: " + vm.size());
System.out.println("storageProfile");
System.out.println("  imageReference");
System.out.println("    publisher: " + vm.storageProfile().imageReference().publisher());
System.out.println("    offer: " + vm.storageProfile().imageReference().offer());
System.out.println("    sku: " + vm.storageProfile().imageReference().sku());
System.out.println("    version: " + vm.storageProfile().imageReference().version());
System.out.println("  osDisk");
System.out.println("    osType: " + vm.storageProfile().osDisk().osType());
System.out.println("    name: " + vm.storageProfile().osDisk().name());
System.out.println("    createOption: " + vm.storageProfile().osDisk().createOption());
System.out.println("    caching: " + vm.storageProfile().osDisk().caching());
System.out.println("osProfile");
System.out.println("    computerName: " + vm.osProfile().computerName());
System.out.println("    adminUserName: " + vm.osProfile().adminUsername());
System.out.println("    provisionVMAgent: " + vm.osProfile().windowsConfiguration().provisionVMAgent());
System.out.println(
        "    enableAutomaticUpdates: " + vm.osProfile().windowsConfiguration().enableAutomaticUpdates());
System.out.println("networkProfile");
System.out.println("    networkInterface: " + vm.primaryNetworkInterfaceId());
System.out.println("vmAgent");
System.out.println("  vmAgentVersion: " + vm.instanceView().vmAgent().vmAgentVersion());
System.out.println("    statuses");
for (InstanceViewStatus status : vm.instanceView().vmAgent().statuses()) {
    System.out.println("    code: " + status.code());
    System.out.println("    displayStatus: " + status.displayStatus());
    System.out.println("    message: " + status.message());
    System.out.println("    time: " + status.time());
}
System.out.println("disks");
for (DiskInstanceView disk : vm.instanceView().disks()) {
    System.out.println("  name: " + disk.name());
    System.out.println("  statuses");
    for (InstanceViewStatus status : disk.statuses()) {
        System.out.println("    code: " + status.code());
        System.out.println("    displayStatus: " + status.displayStatus());
        System.out.println("    time: " + status.time());
    }
}
System.out.println("VM general status");
System.out.println("  provisioningStatus: " + vm.provisioningState());
System.out.println("  id: " + vm.id());
System.out.println("  name: " + vm.name());
System.out.println("  type: " + vm.type());
System.out.println("VM instance status");
for (InstanceViewStatus status : vm.instanceView().statuses()) {
    System.out.println("  code: " + status.code());
    System.out.println("  displayStatus: " + status.displayStatus());
}
System.out.println("Press enter to continue...");
input.nextLine();
```

### Stop the VM

You can stop a virtual machine and keep all its settings, but continue to be charged for it, or you can stop a virtual machine and deallocate it. When a virtual machine is deallocated, all resources associated with it are also deallocated and billing ends for it.

To stop the virtual machine without deallocating it, add this code to the try block in the main method:

```java
System.out.println("Stopping vm...");
vm.powerOff();
System.out.println("Press enter to continue...");
input.nextLine();
```

If you want to deallocate the virtual machine, change the PowerOff call to this code:

```java
vm.deallocate();
```

### Start the VM

To start the virtual machine, add this code to the try block in the main method:

```java
System.out.println("Starting vm...");
vm.start();
System.out.println("Press enter to continue...");
input.nextLine();
```

### Resize the VM

Many aspects of deployment should be considered when deciding on a size for your virtual machine. For more information, see [VM sizes](../sizes.md).  

To change size of the virtual machine, add this code to the try block in the main method:

```java
System.out.println("Resizing vm...");
vm.update()
    .withSize(VirtualMachineSizeTypes.STANDARD_DS2)
    .apply();
System.out.println("Press enter to continue...");
input.nextLine();
```

### Add a data disk to the VM

To add a data disk to the virtual machine that is 2 GB in size, has a LUN of 0, and a caching type of ReadWrite, add this code to the try block in the main method:

```java
System.out.println("Adding data disk...");
vm.update()
    .withNewDataDisk(2, 0, CachingTypes.READ_WRITE)
    .apply();
System.out.println("Press enter to delete resources...");
input.nextLine();
```

## Delete resources

Because you are charged for resources used in Azure, it is always good practice to delete resources that are no longer needed. If you want to delete the virtual machines and all the supporting resources, all you have to do is delete the resource group.

1. To delete the resource group, add this code to the try block in the main method:
   
    ```java
    System.out.println("Deleting resources...");
    azure.resourceGroups().deleteByName("myResourceGroup");
    ```

2. Save the App.java file.

## Run the application

It should take about five minutes for this console application to run completely from start to finish.

1. To run the application, use this Maven command:

    ```
    mvn compile exec:java
    ```

2. Before you press **Enter** to start deleting resources, you could take a few minutes to verify the creation of the resources in the Azure portal. Click the deployment status to see information about the deployment.


## Next steps
* Learn more about using the [Azure libraries for Java](/java/azure/java-sdk-azure-overview).
