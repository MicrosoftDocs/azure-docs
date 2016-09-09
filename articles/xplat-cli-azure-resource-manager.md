
<properties
	pageTitle="Azure CLI with Resource Manager | Microsoft Azure"
	description="Use the Azure Command-Line Interface (CLI) to deploy multiple resources as a resource group"
	editor=""
	manager="timlt"
	documentationCenter=""
	authors="dlepow"
	services="azure-resource-manager"/>

<tags
	ms.service="azure-resource-manager"
	ms.workload="multiple"
	ms.tgt_pltfrm="vm-multiple"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/20/2016"
	ms.author="danlep"/>

# Use the Azure CLI for Mac, Linux, and Windows with Azure Resource Manager

> [AZURE.SELECTOR]
- [Portal](azure-portal/resource-group-portal.md) 
- [Azure CLI](xplat-cli-azure-resource-manager.md)
- [Azure PowerShell](powershell-azure-resource-manager.md)
- [.NET](https://azure.microsoft.com/documentation/samples/resource-manager-dotnet-resources-and-groups/)
- [Java](https://azure.microsoft.com/documentation/samples/resources-java-manage-resource-group/)
- [Node](https://azure.microsoft.com/documentation/samples/resource-manager-node-resources-and-groups/)
- [Python](https://azure.microsoft.com/documentation/samples/resource-manager-python-resources-and-groups/)
- [Ruby](https://azure.microsoft.com/documentation/samples/resource-manager-ruby-resources-and-groups/)


This article introduces common ways to create and manage Azure resources by using the Azure Command-Line Interface (Azure CLI) in the Azure Resource Manager mode.

>[AZURE.NOTE] To create and manage Azure resources on the command line, you will need an Azure subscription ([free Azure account here](https://azure.microsoft.com/free/)). You will also need to [install the Azure CLI](xplat-cli-install.md), and [log in to use Azure resources associated with your account](xplat-cli-connect.md). If you've done these things, you're ready to go.

## Azure resources

Use the Azure Resource Manager to create and manage a group of _resources_ (user-managed entities such as a virtual machine, database server, database, or website) as a single logical unit, or _resource group_.

One advantage of the Azure Resource Manager is that you can create your Azure resources in a _declarative_ way: you describe the structure and relationships of a deployable group of resources in JSON *templates*. The template identifies parameters that can be filled in either inline when running a command or stored in a separate JavaScript Object Notation (JSON) parameters file. This allows you to easily create new resources using the same template by simply providing different parameters. For example, a template that creates a website will have parameters for the site name, the region the website will be located in, and other common settings.

When a template is used to modify or create a group, a _deployment_ is created, which is then applied to the group. For more information on the Azure Resource Manager, visit the [Azure Resource Manager Overview](resource-group-overview.md).

After you create a deployment, you can manage the individual resources imperatively on the command line, just like you do in the classic deployment model. For example, use CLI commands in Resource Manager mode to start, stop, or delete resources such as [Azure Resource Manager virtual machines](./virtual-machines/virtual-machines-linux-cli-deploy-templates.md).

## Authentication

Working with the Azure Resource Manager through the Azure CLI currently requires you to authenticate to Microsoft Azure by using the `azure login` command and then specifying an account managed by Azure Active Directory - either a work or school account (an organizational account) or a Microsoft account. Authenticating with a certificate installed through a .publishsettings file doesn't work in this mode.

For more information on authenticating to Microsoft Azure, see [Connect to an Azure subscription from the Azure CLI](xplat-cli-connect.md).

>[AZURE.NOTE] When you use an account managed by Azure Active Directory, you can also use Azure Role-Based Access Control (RBAC) to manage access and usage of Azure resources. For details, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

## Set the Resource Manager mode

Because the CLI is not in Resource Manager mode by default, use the following command to enable Azure CLI Resource Manager commands.

	azure config mode arm

## Find the locations

Most of the Azure Resource Manager commands need a valid location to create or find a resource from. You can find all available locations for the different Azure resources by using the following command.

	azure location list

This lists the Azure regions that are available, such as "West US", "East US", and so on. For details of available resource providers and the locations in which they are available, use the `azure provider list` command followed by the `azure provider show` command. For example, the following command lists the locations of the Azure Container service:

    azure provider show Microsoft.ContainerService 

## Create a resource group

A resource group is a logical grouping of resources such as network, storage, and compute resources. Almost all commands in the Resource Manager mode need a resource group. You can create a resource group in the West US region named _testRG_, for example, by using the following command.

	azure group create -n "testRG" -l "West US"

You will deploy to this *testRG* resource group later when you use a template to launch an Ubuntu VM. Once you have created a resource group, you can add resources like virtual machines and networks or storage.


## Use resource group templates

### Locate and configure a resource group template

When working with templates, you can either [create your own](resource-group-authoring-templates.md), or use one of the community-contributed [QuickStart templates](https://azure.microsoft.com/documentation/templates/), which are also available on [GitHub](https://github.com/Azure/azure-quickstart-templates).

Creating a new template is beyond the scope of this article, so to start with let's use the _101-simple-vm-from-image_ template available in the [QuickStart templates](https://azure.microsoft.com/documentation/templates/101-vm-simple-linux/). By default, this creates a single Ubuntu 14.04.2-LTS virtual machine in a new virtual network with a single subnet. You only need to specify a resource group and the following few parameters to use this template:

* An admin user name for the VM = `adminUsername`
* A password = `adminPassword`
* A domain name for the VM = `dnsLabelPrefix`

>[AZURE.TIP] These steps show you just one way to use a VM template with the Azure CLI. For other examples, see [Deploy and manage virtual machines by using Azure Resource Manager templates and the Azure CLI](./virtual-machines/virtual-machines-linux-cli-deploy-templates.md).

1. Follow the "Learn more with GitHub" link to download the files azuredeploy.json and azuredeploy.parameters.json from [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-linux) to a working folder on your local computer. (Make sure to select the _raw_ format of each file in GitHub.)

2. Open the azuredeploy.parameters.json file in a text editor and enter parameter values suitable for your environment (leaving the **ubuntuOSVersion** value unchanged).

	```
			{
			  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
			  "contentVersion": "1.0.0.0",
			  "parameters": {
			    "adminUsername": {
			      "value": "azureUser"
			    },
			    "adminPassword": {
			      "value": "GEN-PASSWORD"
			    },
			    "dnsLabelPrefix": {
			      "value": "GEN-UNIQUE"
			    },
			    "ubuntuOSVersion": {
			      "value": "14.04.2-LTS"
			    }
			  }
			}

	```
3.  Now that the deployment parameters have been modified, you will deploy the Ubuntu VM into the *testRG* resource group that you created earlier. Choose a name for the deployment (*testRGDeploy* in this example) and then use the following command to kick it off.

	```
	azure group deployment create -f azuredeploy.json -e azuredeploy.parameters.json testRG testRGDeploy
	```

	The `-e` option specifies the azuredeploy.parameters.json file that you modified in the previous step. The `-f` option specifies the azuredeploy.json template file.  

	This command will return OK after the deployment is uploaded, but before the deployment is applied to resources in the group.

4. To check the status of the deployment, use the following command.

	```
	azure group deployment show testRG testRGDeploy
	```

	The **ProvisioningState** shows the status of the deployment.

	If your deployment is successful, you will see output similar to the following.

		azure-cli@0.8.0:/# azure group deployment show testRG testRGDeploy
		info:    Executing command group deployment show
		+ Getting deployments
		+ Getting deployments
		data:    DeploymentName     : testDeploy
		data:    ResourceGroupName  : testRG
		data:    ProvisioningState  : Succeeded
		data:    Timestamp          : 
		data:    Mode               : Incremental
		data:    Name                   Type          Value
		data:    ---------------------  ------------  ---------------------
		data:    adminUsername          String        MyUserName
		data:    adminPassword          SecureString  undefined
		data:    dnsLabelPrefix    String        MyDomainName
		data:    ubuntuOSVersion        String        14.04.2-LTS
		info:    group deployment show command OK

	>[AZURE.NOTE] If you realize that your configuration isn't correct, and need to stop a long-running deployment, use the following command.
	>
	> `azure group deployment stop testRG testRGDeploy`
	>
	> If you don't provide a deployment name, one is created automatically based on the name of the template file. It is returned as part of the output of the `azure group create` command.

	Now you can SSH to the VM, using the domain name you specified. When connnecting to the VM, you need to use a fully qualified domain name of the form `<domainName>.<region>.cloudapp.azure.com`, such as `MyDomainName.westus.cloudapp.azure.com`.

5. To view the group, use the following command.

		azure group show testRG

	This command returns information about the resources in the group. If you have multiple groups, use the `azure group list` command to retrieve a list of group names, and then use `azure group show` to view details of a specific group.

You can also use a template directly from [GitHub](https://github.com/Azure/azure-quickstart-templates), instead of downloading one to your computer. To do this, pass the URL to the azuredeploy.json file for the template in your command by using the **--template-uri** option. To get the URL, open azuredeploy.json on GitHub in _raw_ mode, and copy the URL that appears in the browser's address bar. You can then use this URL directly to create a deployment by using a command similar to the following.

	azure group deployment create testRG testRGDeploy --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-simple-linux/azuredeploy.json
You are prompted to enter the necessary template parameters.

> [AZURE.NOTE] It is important to open the JSON template in _raw_ mode. The URL that appears in the browser's address bar is different from the one that appears in regular mode. To open the file in _raw_ mode when viewing the file on GitHub, in the upper-right corner click **Raw**.

## Work with resources

While templates allow you to declare group-wide changes in configuration, sometimes you need to work with just a specific resource. You can do this using the `azure resource` commands.

> [AZURE.NOTE] When using the `azure resource` commands other than the `list` command, you must specify the API version of the resource you are working with using the `-o` parameter. If you are unsure about the API version to use, consult the template file and find the **apiVersion** field for the resource.

1. To list all resources in a group, use the following command.

		azure resource list testRG

2. To view an individual resource within the group, such as the VM named *MyUbuntuVM*, use a command like the following.

		azure resource show testRG MyUbuntuVM Microsoft.Compute/virtualMachines -o "2015-06-15"

	Notice the **Microsoft.Compute/virtualMachines** parameter. This indicates the type of the resource you are requesting information on. If you look at the template file downloaded earlier, you will notice that this same value is used to define the type of the virtual machine resource described in the template.

	This command returns information related to the virtual machine.

3. When viewing details on a resource, it is often useful to use the `--json` parameter. This makes the output more readable as some values are nested structures, or collections. The following example demonstrates returning the results of the **show** command as a JSON document.

		azure resource show testRG MyUbuntuVM Microsoft.Compute/virtualMachines -o "2015-06-15" --json

	>[AZURE.NOTE] You can save the JSON data to file by using the &gt; character to direct the output to a file. For example:
	>
	> `azure resource show testRG MyUbuntuVM Microsoft.Compute/virtualMachines -o "2015-06-15" --json > myfile.json`

4. To delete an existing resource, use a command like the following.

		azure resource delete testRG MyUbuntuVM Microsoft.Compute/virtualMachines -o "2015-06-15"

## View group logs

To view logged information on operations performed on a group, use the `azure group log show` command. By default, this will list the last operation performed on the group. To view all operations, use the optional `--all` parameter. For the last deployment, use `--last-deployment`. For a specific deployment, use `--deployment` and specify the deployment name. The following example returns a log of all operations performed on the group *testRG*.

	azure group log show testRG --all
    
## Export a resource group as a template

For an existing resource group, you can view the Resource Manager template for the resource group. Exporting the template offers two benefits:

1. You can easily automate future deployments of the solution because all of the infrastructure is defined in the template.

2. You can become familiar with template syntax by looking at the JSON that represents your solution.

Using the Azure CLI, you can either export a template that represents the current state of your resource group, or download the template that was used for a particular deployment.

* **Export the template for a resource group** - This is helpful when you have made changes to a resource group, and need to retrieve the JSON representation of its current state. However, the generated template contains only a minimal number of parameters and no variables. Most of the values in the template are hard-coded. Before deploying the generated template, you may wish to convert more of the values into parameters so you can customize the deployment for different environments.

    To export the template for a resource group to a local directory, run the `azure group export` command as shown in the following example. (Substitute a local directory appropriate for your operating system environment.)

        azure group export testRG ~/azure/templates/

* **Download the template for a particular deployment** -- This is helpful when you need to view the actual template that was used to deploy resources. The template will include all of the parameters and variables defined for the original deployment. However, if someone in your organization has made changes to the resource group outside of what is defined in the template, this template will not represent the current state of the resource group.

    To download the template used for a particular deployment to a local directory, run the `azure group deployment template download` command.

        azure group deployment template download TestRG testRGDeploy ~/azure/templates/downloads/
 
>[AZURE.NOTE] Template export is in preview, and not all resource types currently support exporting a template. When attempting to export a template, you may see an error that states some resources were not exported. If needed, you can manually define these resources in your template after downloading it.

## Next steps

* For information on working with Azure Resource Manager using Azure PowerShell, see [Using Azure PowerShell with Azure Resource Manager](powershell-azure-resource-manager.md).
* For information on working with Azure Resource Manager from the Azure portal, see [Using the Azure Portal to deploy and manage your Azure resources](./azure-portal/resource-group-portal.md).


