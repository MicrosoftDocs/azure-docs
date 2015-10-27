<properties
	pageTitle="Azure CLI with Resource Manager | Microsoft Azure"
	description="Use the Azure CLI for Mac, Linux, and Windows to deploy multiple resources as a resource group."
	editor=""
	manager="timlt"
	documentationCenter=""
	authors="dlepow"
	services="azure-resource-manager"/>

<tags
	ms.service="azure-resource-manager"
	ms.workload="multiple"
	ms.tgt_pltfrm="command-line-interface"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/26/2015"
	ms.author="danlep"/>

# Use the Azure CLI for Mac, Linux, and Windows with Azure Resource Manager

> [AZURE.SELECTOR]
- [Azure CLI](xplat-cli-azure-resource-manager.md)
- [Azure PowerShell](powershell-azure-resource-manager.md)



This article describes how to create and manage Azure resources by using the Azure Command-Line Interface (CLI) for Mac, Linux, and Windows in the Azure Resource Manager mode.

>[AZURE.NOTE] To create and manage Azure resources on the command line, you will need an Azure account ([free trial here](http://azure.microsoft.com/pricing/free-trial/)). You will also need to [install the Azure CLI](xplat-cli-install.md), and to [log on to use Azure resources associated with your account](xplat-cli-connect.md). If you've done these things, you're ready to go.

## Azure resources

Use the Azure Resource Manager to create and manage a group of _resources_ (user-managed entities such as a virtual machine, database server, database, or website) as a single logical unit, or _resource group_.

One advantage of the Azure Resoure Manager is that you can create your Azure resources in a _declarative_ way: you describe the structure and relationships of a deployable group of resources in JSON *templates*. The template identifies parameters that can be filled in either inline when running a command or stored in a separate JSON azuredeploy-parameters.json file. This allows you to easily create new resources using the same template by simply providing different parameters. For example, a template that creates a website will have parameters for the site name, the region the website will be located in, and other common settings.

When a template is used to modify or create a group, a _deployment_ is created, which is then applied to the group. For more information on the Azure Resource Manager, visit the [Azure Resource Manager Overview](../resource-group-overview.md).

After you create a deployment, you can manage the individual resources imperatively on the command line, just like you can in the classic (Service Management) deployment model. For example, use Azure Resource Manager CLI commands to start, stop, or delete resources such as [Azure Resource Manager virtual machines](../virtual-machines/virtual-machines-deploy-rmtemplates-azure-cli.md).

## Authentication

Working with the Azure Resource Manager through the Azure CLI requires you to authenticate to Microsoft Azure using a work or school account (an organizational account) or a Microsoft account (starting in CLI version 0.9.10). Authenticating with a certificate installed through a .publishsettings file doesn't work in this mode.

For more information on authenticating to Microsoft Azure, see [Connect to an Azure subscription from the Azure CLI](xplat-cli-connect.md).

>[AZURE.NOTE] When you use a work or school account -- which is managed by Azure Active Directory -- you can also use Azure Role-Based Access Control (RBAC) to manage access and usage of Azure resources. For details, see [Managing and Auditing Access to Resources](../azure-portal/resource-group-rbac.md).

## Set the Azure Resource Manager mode

Because the Azure Resource Manager mode is not enabled by default, use the following command to enable Azure CLI Resource Manager commands.

	azure config mode arm

>[AZURE.NOTE] The Azure Resource Manager mode and Azure Service Management mode are mutually exclusive. That is, resources created in one mode cannot be managed from the other mode.

## Find the locations

Most of the Azure Resource Manager commands need a valid location to create or find a resource from. You can find all available locations for the different Azure resources by using the following command.

	azure location list

This lists the Azure resources and the Azure regions in which they are available, such as "West US", "East US", and so on.

## Create a resource group

A resource group is a logical grouping of network, storage, and other resources. Almost all commands in the Azure Resource Manager mode need a resource group. You can create a resource group named _testRG_, for example, by using the following command.

	azure group create -n "testRG" -l "West US"

You start adding resources to this group after this, and use it to configure a resource such as a new virtual machine.


## Use resource group templates

### Locate and configure a resource group template

When working with templates, you can either [create your own](resource-group-authoring-templates.md), or use one of the templates from the [Template Gallery](https://azure.microsoft.com/documentation/templates/), which are also available on [GitHub](https://github.com/Azure/azure-quickstart-templates).

Creating a new template is beyond the scope of this article, so to start with let's use the _101-simple-vm-from-image_ template available from [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/101-simple-linux-vm). By default, this creates a single Ubuntu 4.04.2-LTS virtual machine in a new virtual network with a single subnet in the West US region. You only need to specify the following few parameters to use this template:

* A unique storage account name
* An admin user name for the VM
* A password
* A domain name for the VM

>[AZURE.TIP] These steps show you just one way to use a VM template with the Azure CLI. For other examples, see [Deploy and manage virtual machines by using Azure Resource Manager templates and the Azure CLI](../virtual-machines/virtual-machines-deploy-rmtemplates-azure-cli.md).

1. Download the files azuredeploy.json and azuredeploy.parameters.json from [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/101-simple-linux-vm) to a working folder on your local computer.

2. Open the azuredeploy.parameters.json file in a text editor and enter parameter values suitable for your environment (leaving the **ubuntuOSVersion** value unchanged).
```
	{
	  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
	  "contentVersion": "1.0.0.0",
	  "parameters": {
	    "newStorageAccountName": {
	      "value": "MyStorageAccount"
	    },
	    "adminUsername": {
	      "value": "MyUserName"
	    },
	    "adminPassword": {
	      "value": "MyPassword"
	    },
	    "dnsNameForPublicIP": {
	      "value": "MyDomainName"
	    },
	    "ubuntuOSVersion": {
	      "value": "14.04.2-LTS"
	    }
	  }
	}
```
3. After saving the azuredeploy.parameters.json file, use the following command to create a new resource group based on the template. The `-e` option specifies the azuredeploy.parameters.json file that you modified in the previous step. Replace the *testRG* with the group name you wish to use, and *testDeploy* with a deployment name of your choice. The location should be same as the one specified in your template parameter file.

		azure group create "testRG" "West US" -f azuredeploy.json -d "testDeploy" -e azuredeploy.parameters.json

	This command will return OK after the deployment is uploaded, but before the deployment is applied to resources in the group.

4. To check the status of the deployment, use the following command.

		azure group deployment show "testRG" "testDeploy"

	The **ProvisioningState** shows the status of the deployment.

	If your deployment is successful, you will see output similar to the following.

		azure-cli@0.8.0:/# azure group deployment show testRG testDeploy
		info:    Executing command group deployment show
		+ Getting deployments
		+ Getting deployments
		data:    DeploymentName     : testDeploy
		data:    ResourceGroupName  : testRG
		data:    ProvisioningState  : Running
		data:    Timestamp          : 2015-10-26T16:15:29.5562024Z
		data:    Mode               : Incremental
		data:    Name                   Type          Value
		data:    ---------------------  ------------  ---------------------
		data:    newStorageAccountName  String        MyStorageAccount
		data:    adminUsername          String        MyUserName
		data:    adminPassword          SecureString  undefined
		data:    dnsNameForPublicIP     String        MyDomainName
		data:    ubuntuOSVersion        String        14.04.2-LTS
		info:    group deployment show command OK

	>[AZURE.NOTE] If you realize that your configuration isn't correct, and need to stop a long-running deployment, use the following command.
	>
	> `azure group deployment stop "testRG" "testDeploy"`
	>
	> If you don't provide a deployment name, one is created automatically based on the name of the template file. It is returned as part of the output of the `azure group create` command.

	Now you can SSH to the VM, using the domain name you specified. When connnecting to the VM, you need to use a fully qualified domain name of the form `<domainName>.<region>.cloudapp.azure.com`, such as `MyDomainName.westus.cloudapp.azure.com`.

5. To view the group, use the following command.

		azure group show "testRG"

	This command returns information about the resources in the group. If you have multiple groups, use the `azure group list` command to retrieve a list of group names, and then use `azure group show` to view details of a specific group.

You can also use a template directly from [GitHub](https://github.com/Azure/azure-quickstart-templates), instead of downloading one to your computer. To do this, pass the URL to the azuredeploy.json file for the template in your command by using the **--template-url** option. To get the URL, open azuredeploy.json on GitHub in _raw_ mode, and copy the URL that appears in the browser's address bar. You can then use this URL directly to create a deployment by using a command similar to the following.

	azure group deployment create "testDeploy" -g "testResourceGroup" --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-simple-linux-vm/azuredeploy.json
You are prompted to enter the necessary template parameters.

> [AZURE.NOTE] It is important to open the JSON template in _raw_ mode. The URL that appears in the browser's address bar is different from the one that appears in regular mode. To open the file in _raw_ mode when viewing the file on GitHub, in the upper-right corner click **Raw**.

## Working with resources

While templates allow you to declare group-wide changes in configuration, sometimes you need to work with just a specific resource. You can do this using the `azure resource` commands.

> [AZURE.NOTE] When using the `azure resource` commands other than the `list` command, you must specify the API version of the resource you are working with using the `-o` parameter. If you are unsure about the API version to use, consult the template file and find the **apiVersion** field for the resource.

1. To list all resources in a group, use the following command.

		azure resource list "testRG"

2. To view an individual resource within the group, use a command like the following.

		azure resource show "testRG" "MyUbuntuVM" Microsoft.Compute/virtualMachines -o "2015-06-15"

	Notice the **Microsoft.Compute/virtualMachines** parameter. This indicates the type of the resource you are requesting information on. If you look at the template file downloaded earlier, you will notice that this same value is used to define the type of the virtual machine resource described in the template.

	This command returns information related to the virtual machine.

3. When viewing details on a resource, it is often useful to use the `--json` parameter. This makes the output more readable as some values are nested structures, or collections. The following example demonstrates returning the results of the **show** command as a JSON document.

		azure resource show "testRG" "MyUbuntuVM" Microsoft.Compute/virtualMachines -o "2015-06-15" --json

	>[AZURE.NOTE] You can save the JSON data to file by using the &gt; character to pipe the output to file. For example:
	>
	> `azure resource show "testRG" "MyUbuntuVM" Microsoft.Compute/virtualMachines -o "2015-06-15" --json > myfile.json`

4. To delete an existing resource, use a command like the following.

		azure resource delete "testRG" "MyUbuntuVM" Microsoft.Compute/virtualMachines -o "2015-06-15"

## Logging

To view logged information on operations performed on a group, use the `azure group log show` command. By default, this will list the last operation performed on the group. To view all operations, use the optional `--all` parameter. For the last deployment, use `--last-deployment`. For a specific deployment, use `--deployment` and specify the deployment name. The following example returns a log of all operations performed on the group *MyGroup*.

	azure group log show MyGroup --all

## Next steps

* For information on working with Azure Resource Manager using Azure PowerShell, see [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md).
* For information on working with Azure Resource Manager from the Azure Portal, see [Using resource groups to manage your Azure resources][psrm].

[signuporg]: http://www.windowsazure.com/documentation/articles/sign-up-organization/
[adtenant]: http://technet.microsoft.com/library/jj573650#createAzureTenant
[psrm]: http://go.microsoft.com/fwlink/?LinkId=394760
