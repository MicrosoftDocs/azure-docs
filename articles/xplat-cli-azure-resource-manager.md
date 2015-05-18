<properties
	pageTitle="Using the Microsoft Azure CLI for Mac, Linux, and Windows with Azure Resource Management"
	description="Using the Microsoft Azure CLI for Mac, Linux, and Windows with Azure Resource Management."
	editor="tysonn"
	manager="timlt"
	documentationCenter=""
	authors="dsk-2015"
	services="virtual-machines"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services""
	ms.tgt_pltfrm="command-line-interface"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/05/2015"
	ms.author="dkshir;rasquill"/>

# Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management

> [AZURE.SELECTOR]
- [Azure PowerShell](powershell-azure-resource-manager.md)
- [Azure CLI](xplat-cli-azure-resource-manager.md)


This topic describes how to create, manage, and delete Azure resources and VMs using the Azure CLI for Mac, Linux, and Windows using the **arm** mode.  

>[AZURE.NOTE] To create and manage Azure resources on the command-line, you will need an Azure account ([free trial here](http://azure.microsoft.com/pricing/free-trial/)). You will also need to [install the Azure CLI](xplat-cli-install.md), and to [log on to use Azure resources associated with your account](xplat-cli-connect.md). If you've done these things, you're ready to go.

## Azure Resources

The Resource Manager allows you to manage a group of _resources_ (user-managed entities such as a virtual machine, database server, database, or website) as a single logical unit, or _resource group_. You can create, manage, and delete these resources imperatively on the command line, just like you can in the **asm** mode.

Using the **arm** mode, you can also manage your Azure resources in a _declarative_ way by describing the structure and relationships of a deployable group of resources in JSON *templates*. The template describes parameters that can be filled in either inline when running a command or stored in a separate JSON **azuredeploy-parameters.json** file. This allows you to easily create new resources using the same template by simply providing different parameters. For example, a template that creates a Website will have parameters for the site name, the region the Website will be located in, and other common parameters.

When a template is used to modify or create a group, a _deployment_ is created, which is then applied to the group. For more information on the Resource Manager, visit the [Azure Resource Manager Overview](resource-group-overview.md).

## Authentication

Working with the Resource Manager through the Azure CLI requires that you authenticate to Microsoft Azure using a work or school account. Authenticating with a certificate installed through a .publishsettings file will not work.

For more information on authenticating using a work or school account, see [Connect to an Azure subscription from the Azure CLI for Mac, Linux, and Windows](xplat-cli-connect.md).

> [AZURE.NOTE] Because you use a work or school account -- which is managed by Azure Active Directory -- you can also use Azure Role-Based Access Control (RBAC) to manage access and usage of Azure resources. For details, see [Managing and Auditing Access to Resources](resource-group-rbac.md).

## Setting the **arm** mode

Because the Resource Manager mode is not enabled by default, you must use the following command to enable Azure CLI resource manager commands.

	azure config mode arm

>[AZURE.NOTE] The Azure Resource Manager mode and Azure Service Management mode are mutually exclusive. That is, resources created in one mode cannot be managed from the other mode.

## Finding the locations

Most of the **arm** commands need a valid location to create or find a resource from. You can find all available locations by using the command

	azure location list

It will list locations specific to regions such as "West US", "East US", and so on.

## Creating Resource Group

A Resource Group is a logical grouping of network, storage and other resources. Almost all commands in **arm** mode need a resource group. You can create a resource group named _testrg_, for example, by using the command

	azure group create -n "testrg" -l "West US"

You can start adding resources to this group after this, and use it to configure a new virtual machine.

## Creating virtual machines

There are two ways to create virtual machines in the **arm** mode:

1. Using individual Azure CLI commands
2. Using Resource Group Templates

Be sure to create at least one resource group before you start with any of these methods.

### Using individual Azure CLI commands

This is the basic approach to configure and create a virtual machine as per your needs. In **arm** mode, you will need to configure some mandatory resources like the networking before you can use the **vm create** command.

>[AZURE.NOTE] If you are creating resources for the first time on the command line for your subscription, you might be prompted to register for certain Resource Providers.
> If that happens, it is easy to register the said provider and try the failed command again. For example,
>
> `azure provider register Microsoft.Storage`
>
> You can find out the list of providers registered for your subscription by running,
>
> `azure provider list`


#### Creating a public IP resource

You will need to create a public IP so you can SSH into your new virtual machine for any meaningful work. Creating a public IP is straightforward. The command needs a resource group, a name for your public IP resource and a location, in that order. For example,

	azure network public-ip create "testrg" "testip" "westus"

#### Creating a Network Interface Card resource

The Network Interface Card or NIC needs a subnet and a virtual network to be created first. Create a virtual network in a particular location and resource group by using the **network vnet create**.

	azure network vnet create "testrg" "testvnet" "westus"

You can then create a subnet in this virtual network by using **network vnet subnet create** as this example:

	azure network vnet subnet create "testrg" "testvnet" "testsubnet"

You should be able to create an NIC using these resources with **network nic create**.

	azure network nic create "testrg" "testnic" "westus" -k "testsubnet" -m "testvnet" -p "testip"

>[AZURE.NOTE] Although optional, it is very important to pass the public IP name as a parameter to the **network nic create** command as this binds the NIC to this IP, which will be later used to SSH into the virtual machine created using this NIC.

For more imformation on the **network** commands, see command line help or [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management](azure-cli-arm-commands.md).

#### Finding the Operating System image

Currently, you can only find an operating system based on the publisher of the image. In other words, you must run this command to find a list of OS image publishers in your desired location,

	azure vm image list-publishers "westus"

Then choose a publisher from the list, and find the list of images by that publisher by running, for example,

	azure vm image list "westus" "CoreOS"

Finally, choose an OS image from the list that looks something like this:

	info:    Executing command **vm image list**
	warn:    The parameters --offer and --sku if specified will be ignored
	+ Getting virtual machine image offers (Publisher: "Canonical" Location: "westus")
	data:    Publisher  Offer        Sku          Version          Location  Urn

	data:    ---------  -----------  -----------  ---------------  --------- ----------------------------------------
	data:    CoreOS     CoreOS       Alpha        475.1.0          westus    CoreOS:CoreOS:Alpha:475.1.0
	data:    CoreOS     CoreOS       Alpha        490.0.0          westus    CoreOS:CoreOS:Alpha:490.0.0

Note down the URN of the image you want to load on your virtual machine.

#### Creating a virtual machine

You are now ready to create a virtual machine by running **vm create** command and passing the required information. It's optional to pass the public IP at this stage, since the NIC already has this information. Your command may look something like this, where _testvm_ is the name of the virtual machine created in the _testrg_ resource group.

	azure-cli@0.8.0:/# azure vm create "testrg" "testvm" "westus" "Linux" -Q "CoreOS:CoreOS:Alpha:660.0.0" -u "azureuser" -p "Pass1234!" -N "testnic"
	info:    Executing command vm create
	+ Looking up the VM "testvm"
	info:    Using the VM Size "Standard_A1"
	info:    The [OS, Data] Disk or image configuration requires storage account
	+ Retrieving storage accounts
	info:    Could not find any storage accounts in the region "westus", trying to create new one
	+ Creating storage account "cli02f696bbfda6d83414300" in "westus"
	+ Looking up the storage account cli02f696bbfda6d83414300
	+ Looking up the NIC "testnic"
	+ Creating VM "testvm"
	info:    vm create command OK

You should be able to start this Virtual machine by running

	azure vm start "testrg" "testvm"

and SSH into it by using the command **ssh username@ipaddress**. To quickly look up the IP address of your public IP resource, use this command:

	azure network public-ip show "testrg" "testip"

Managing this virtual machine is easy with **vm** commands; for more information, visit [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management](azure-cli-arm-commands.md).

### **vm quick-create** shortcut

The new **vm quick-create** shortcut cuts out most of the steps of the imperative method of VM creation. This is handy when you want to try out creating simple virtual machines or if you do not care about the networking configurations. It's an interactive command, and you need to find out only the OS image URN before running it.

	azure-cli@0.8.0:/# azure vm quick-create
	info:  Executing command vm quick-create
	Resource group name: CLIRG
	Virtual machine name: myqvm
	Location name: westus
	Operating system Type [Windows, Linux]: Linux
	ImageURN (format: "publisherName:offer:skus:version"): CoreOS:CoreOS:Alpha:660.0.0
	User name: azureuser
	Password: ********
	Confirm password: ********

The Azure CLI will create a virtual machine with default VM size. It will also create a storage account, an NIC, a virtual network and subnet, and a public IP. You can SSH into the virtual machine using the public IP after it boots.

### Using Resource Group Templates

#### Locating and Configuring a Resource Group Template

1. When working with templates, you can either create your own, or use one from the Template Gallery, or use templates available on [github](https://github.com/azurermtemplates/azurermtemplates). To start with, let's use a template named **CoreOS.CoreOSStable.0.2.40-preview** from the Template Gallery. To list available templates from the gallery, use the following command. As there are thousands of templates available, you can paginate the results or use **grep** or **findstr**(on Windows) or your favorite string-searching command to locate interesting templates. Alternatively, you can use the **--json** option and download the entire list in JSON format for easier searching.

		azure group template list

	The response will list the publisher and template name, and will appear similar to the following (although there will be far more).

		data:    Publisher               Name
		data:    ----------------------------------------------------------------------------
		data:    CoreOS                  CoreOS.CoreOSStable.0.2.40-preview
		data:    CoreOS                  CoreOS.CoreOSAlpha.0.2.39-preview
		data:    SUSE                    SUSE.SUSELinuxEnterpriseServer12.2.0.36-preview
		data:    SUSE                    SUSE.SUSELinuxEnterpriseServer11SP3PremiumImage0.2.54-preview

2. To view the details of the template, use the following command.

		azure group template show CoreOS.CoreOSStable.0.2.40-preview

	This will return descriptive information about the template. The template we are using will create a Linux virtual machine.

3. Once you have selected a template, you can download it with the following command.

		azure group template download CoreOS.CoreOSStable.0.2.40-preview

	Downloading a template allows you to customize it to better suite your requirements. For example, adding another resource to the template.

	>[AZURE.NOTE] If you modify the template, use the `azure group template validate` command to validate the template before using it to create or modify an existing resource group.

4. To configure the resource group template for your use, open the template file in a text editor. Note the **parameters** JSON collection near the top. This contains a list of the parameters that this template expects in order to create the resources described by the template. Some parameters might have default values, while others specify either the type of the value or a range of allowed values.

	When using a template, you can supply parameters either as part of the command-line parameters, or by specifying a file containing the parameter values. You can also write your **value** fields directly inside the **parameters** section in the template, although that would make the template tightly bound to a particular deployment and wouldn't be reusable easily. Either way, the parameters must be in JSON format, and you must provide your own values for those keys that do not have default values.

	For example, to create a file that contains parameters for the **CoreOS.CoreOSStable.0.2.40-preview** template, use the following data to create a file named **params.json**. Replace the values used in this sample with your own values. The **Location** should specify an Azure region near you, such as **North Europe** or **South Central US**. (This example uses **West US**)

		{
		  "newStorageAccountName": {
			"value": "testStorage"
		  },
		  "newDomainName": {
			"value": "testDomain"
		  },
		  "newVirtualNetworkName": {
			"value": "testVNet"
		  },
		  "vnetAddressSpace": {
			"value": "10.0.0.0/11"
		  },
		  "hostName": {
			"value": "testHost"
		  },
		  "userName": {
			"value": "azureUser"
		  },
		  "password": {
			"value": "Pass1234!"
		  },
		  "location": {
			"value": "West US"
		  },
		  "hardwareSize": {
			"value": "Medium"
		  }
	    }

5. After saving the **params.json** file, use the following command to create a new resource group based on the template. The `-e` parameter specifies the **params.json** file created in the previous step. Replace the **testRG** with the group name you wish to use, and **testDeploy** with your deployment name. The location should be same as the one specified in your **params.json** template parameter file.

		azure group create "testRG" "West US" -f CoreOS.CoreOSStable.0.2.40-preview.json -d "testDeploy" -e params.json

	This command will return OK once the deployment has been uploaded, but before the deployment have been applied to resources in the group. To check the status of the deployment, use the following command.

		azure group deployment show "testRG" "testDeploy"

	The **ProvisioningState** shows the status of the deployment.

	If your deployment was successful, you will see an output similar to below:

		azure-cli@0.8.0:/# azure group deployment show testRG testDeploy
		info:    Executing command group deployment show
		+ Getting deployments
		data:    DeploymentName     : testDeploy
		data:    ResourceGroupName  : testRG
		data:    ProvisioningState  : Running
		data:    Timestamp          : 2015-04-27T07:49:18.5237635Z
		data:    Mode               : Incremental
		data:    Name                   Type          Value
		data:    ---------------------  ------------  ----------------
		data:    newStorageAccountName  String        testStorage
		data:    newDomainName          String        testDomain
		data:    newVirtualNetworkName  String        testVNet
		data:    vnetAddressSpace       String        10.0.0.0/11
		data:    hostName               String        testHost
		data:    userName               String        azureUser
		data:    password               SecureString  undefined
		data:    location               String        West US
		data:    hardwareSize           String        Medium
		info:    group deployment show command OK

	>[AZURE.NOTE] If you realize that your configuration isn't correct, and need to stop a long running deployment, use the following command.
	>
	> `azure group deployment stop "testRG" "testDeploy"`
	>
	> If you do not provide a deployment name, one will be created automatically based on the name of the template file. It will be returned as part of the output of the `azure group create` command.

6. To view the group, use the following command.

		azure group show "testRG"

	This command returns information about the resources in the group. If you have multiple groups, you can use the `azure group list` command to retrieve a list of group names, and then use `azure group show` to view details of a specific group.

7. You can also use latest templates directly from the github, instead of downloading from the template library. Open [Github.com](http://www.github.com) and search for AzureRmTemplates. Select the AzureRmTemplates repository and look for any templates that you find interesting, for example, _101-simple-vm-from-image_. If you click on the template, you will see it contains **azuredeploy.json** among other files. This is the template you want to use in your command by using a **--template-url** option. Open it in _raw_ mode, and copy the URL that appears in the browser's address bar. You can then use this URL directly to create a deployment, instead of downloading from a template library, by using a command similar to

		azure group deployment create "testDeploy" -g "testResourceGroup" --template-uri https://raw/githubusercontent.com/azurermtemplates/azurermtemplates/master/101-simple-vm-from-image/azuredeploy.json

	> [AZURE.NOTE] It is important to open the json template in _raw_ mode. The URL that appears in the browser's address bar is different from the one that appears in regular mode. To open the file in _raw_ mode, click on the button named _Raw_ on the upper right corner when viewing the file on github.

#### Working with resources

While templates allow you to declare group-wide changes in configuration, sometimes you need to work with just a specific resource. You can do this using the `azure resource` commands.

> [AZURE.NOTE] When using the `azure resource` commands other than the `list` command, you must specify the API version of the resource you are working with using the `-o` parameter. If you are unsure about the API version to use, consult the template file and find the **apiVersion** field for the resource.

1. To list all resources in a group, use the following command.

		azure resource list "testRG"

2. To view individual resources, within the group, use the following command.

		azure resource show "testRG" "testHost" Microsoft.ClassicCompute/virtualMachines -o "2014-06-01"

	Notice the **Microsoft.ClassicCompute/virtualMachines** parameter. This indicates the type of the resource you are requesting information on. If you look at the template file downloaded earlier, you will notice that this same value is used to define the type of the Virtual Machine resource described in the template.

	This command returns information related to the virtual machine.

3. When viewing details on a resource, it is often useful to use the `--json` parameter, as this makes the output more readable as some values are nested structures, or collections. The following demonstrates returning the results of the show command as a JSON document.

		azure resource show "testRG" "testHost" Microsoft.ClassicCompute/virtualMachines -o "2014-06-01" --json

	>[AZURE.NOTE] You can save the JSON data to file by using the &gt; character to pipe the output to file. For example:
	>
	> `azure resource show "testRG" "testHost" Microsoft.ClassicCompute/virtualMachines -o "2014-06-01" --json > myfile.json`

4. To delete an existing resource, use the following command.

		azure resource delete "testRG" "testHost" Microsoft.ClassicCompute/virtualMachines -o "2014-06-01"

## Logging

To view logged information on operations performed on a group, use the `azure group log show` command. By default, this will list last operation performed on the group. To view all operations, use the optional `--all` parameter. For the last deployment, use `--last-deployment`. For a specific deployment, use `--deployment` and specify the deployment name. The following example returns a log of all operations performed against the group 'MyGroup'.

	azure group log show mygroup --all

## Next steps

* For more information on using the Azure Cross-Platform Command-Line Interface, see [Install and Configure the Microsoft Azure Cross-Platform Command-Line Interface][xplatsetup].
* For information on working with Resource Manager using Azure PowerShell, see [Using Azure PowerShell with Azure Resource Manager](powershell-azure-resource-manager.md)
* For imformation on working with Resource Manager from the Azure Portal, see [Using resource groups to manage your Azure resources][psrm]

[signuporg]: http://www.windowsazure.com/documentation/articles/sign-up-organization/
[adtenant]: http://technet.microsoft.com/library/jj573650#createAzureTenant
[portal]: https://manage.windowsazure.com/
[xplatsetup]: xplat-cli.md
[psrm]: http://go.microsoft.com/fwlink/?LinkId=394760
