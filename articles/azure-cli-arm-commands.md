<properties
	pageTitle="Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management"
	description="Learn about using the command-line tools for Mac, Linux, and Windows to manage Azure resources using the Azure CLI arm mode."
	services="virtual-machines"
	documentationCenter=""
	authors="dsk-2015"
	manager="timlt"
	editor="tysonn"/>

<tags
	ms.service="multiple"
	ms.workload="multiple"
	ms.tgt_pltfrm="command-line-interface"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/23/2015"
	ms.author="dkshir"/>

# Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management

This topic describes how to use the Azure Command-Line Interface (Azure CLI) in the **arm** mode to create, manage, and delete services on the command line of Mac, Linux, and Windows computers. You can perform the same tasks using the various libraries of the Azure SDKs, with PowerShell, and using the Azure Portal. 

Azure resource management enables you to create a group of resources -- virtual machines, websites, databases, and so on -- as a single deployable unit. You can then deploy, update, or delete all of the resources for your application in a single, coordinated operation. You describe your group resources in a JSON template for deployment and then can use that template for different environments such as testing, staging and production. 

## Imperative and declarative approaches 

As with the [service management mode (**asm**)](virtual-machines-command-line-tools.md), the **arm** mode of the Azure CLI gives you commands that create resources imperatively on the command line. For example, if you type `azure group create <groupname> <location>` you are asking Azure to create a resource group, and with `azure group deployment create <resourcegroup> <deploymentname>` you are instructing Azure to create a deployment of any number of items and place them in a group. Because each type of resource has imperative commands, you can chain them together to create fairly complex deployments. 

However, using resource group _templates_ that describe a resource group is a declarative approach that is far more powerful, allowing you to automate complex deployments of (almost) any number of resources for (almost) any purpose. When using templates, the only imperative command is to deploy one. For a general overview of templates, resources, and resource groups, see [Azure Resource Group Overview](resource-groups-overview).  

> [AZURE.NOTE] In addition to command-specific options documented below and on the command line, there are three options that can be used to view detailed output such as request options and status codes. The -v parameter provides verbose output, and the -vv parameter provides even more detailed verbose output. The --json option will output the result in raw json format, and is very useful for scripting scenarios.
> 
> Usage with the --json switch is very common, and is an important part of both obtaining and understanding results from Azure CLI operations that return resource information, status, and logs and also using templates. You may want to install JSON parser tools such as **jq** or **jsawk** or use your favorite language library.

##Usage requirements

The set-up requirements to use the **arm** mode with the Azure CLI are:

- an Azure account ([get a free trial here](http://azure.microsoft.com/pricing/free-trial/))
- [installing the Azure CLI](xplat-cli-install.md)
- [configuring the Azure CLI](xplat-cli-connect.md) to use an Azure Active Directory identity or a Service Principal

Once you have an account and have installed the Azure CLI, you must 

- switch to the **arm** mode by typing `azure config mode arm`. 
- Log in to your Azure account by typing `azure login` and using your work or school identity at the prompts

Now type `azure` to see a list of the top level commands described in the sections below.

## azure account: Manage your account information and publish settings
Your Azure subscription information is used by the tool to connect to your account. This information can be obtained from the Azure portal in a publish settings file as described here. You can import the publish settings file as a persistent local configuration setting that the tool will use for subsequent operations. You only need to import your publish settings once.

**List the imported subscriptions** 
		
	account list [options]

**Show details about a subscription**  
  
	account show [options] [subscriptionNameOrId]
    
**Set the current subscription**

	account set [options] <subscriptionNameOrId>

**Remove a subscription or environment, or clear all of the stored account and environment info**  
    	
	account clear [options]

**Commands to manage your account environment**  
   
	account env list [options]
	account env show [options] [environment]
	account env add [options] [environment]
	account env set [options] [environment]
	account env delete [options] [environment]

## azure ad: Commands to display Active Directory objects

**Commands to display active directory applications**

	ad app create [options]
	ad app delete [options] <object-id>

**Commands to display active directory groups**
	
	ad group list [options]
	ad group show [options]

**Commands to provide an active directory sub group or member info**

	ad group member list [options] [objectId]

**Commands to display active directory service principals**
	
	ad sp list [options]
	ad sp show [options]
	ad sp create [options] <application-id>
	ad sp delete [options] <object-id>

**Commands to display active directory users**

	ad user list [options]
	ad user show [options]

## azure availset: commands to manage your availability sets

**Creates an availability set within a resource group**
	
	availset create [options] <resource-group> <name> <location> [tags]

**Lists the availability sets within a resource group**

	availset list [options] <resource-group>

**Gets one availability set within a resource group**
	
	availset show [options] <resource-group> <name>

**Deletes one availability set within a resource group**
	
	availset delete [options] <resource-group> <name>

## azure config: commands to manage your local settings

**List Azure CLI configuration settings**

	config list [options]

**Delete a config setting**

	config delete [options] <name>
   
**Update a config setting**

	config set <name> <value>

**Sets the Azure CLI working mode to either `arm` or `asm`**

	config mode [options] <modename>


## azure feature: commands to manage account features

**List all features available for your subscription**
	
	feature list [options]

**Shows a feature**

	feature show [options] <providerName> <featureName>

**Registers a previewed feature of a resource provider**

	feature register [options] <providerName> <featureName>

## azure group: Commands to manage your resource groups

**Creates a new resource group**

	group create [options] <name> <location>

**Set tags to a resource group**

	group set [options] <name> <tags>

**Deletes a resource group**

	group delete [options] <name>

**Lists the resource groups for your subscription**

	group list [options]

**Shows a resource group for your subscription**

	group show [options] <name>

**Commands to manage resource group logs**

	group log show [options] [name]

**Commands to manage your deployment in a resource group**

	group deployment create [options] [resource-group] [name]
	group deployment list [options] <resource-group> [state]
	group deployment show [options] <resource-group> [deployment-name]
	group deployment stop [options] <resource-group> [deployment-name]

**Commands to manage your local or gallery resource group template**

	group template list [options]
	group template show [options] <name>
	group template download [options] [name] [file]
	group template validate [options] <resource-group>

## azure insights: Commands related to monitoring Insights (events, alert rules, autoscale settings, metrics)

**Retrieve operation logs for a subscription, a correlationId, a resource group, resource, or resource provider**

	insights logs list [options]

## azure location: Commands to get the available locations for all resource types

**List the available locations**

	location list [options]

## azure network: Commands to manage network resource

**Commands to manage virtual networks**

	network vnet create [options] <resource-group> <name> <location>
	network vnet set [options] <resource-group> <name>
	network vnet list [options] <resource-group>
	network vnet show [options] <resource-group> <name>
	network vnet delete [options] <resource-group> <name>

**Commands to manage virtual network subnets**
	
	network vnet subnet create [options] <resource-group> <vnet-name> <name>
	network vnet subnet set [options] <resource-group> <vnet-name> <name>
	network vnet subnet list [options] <resource-group> <vnet-name>
	network vnet subnet show [options] <resource-group> <vnet-name> <name>
	network vnet subnet delete [options] <resource-group> <vnet-name> <subnet-name>

**Commands to manage load balancers**

	network lb create [options] <resource-group> <name> <location>
	network lb list [options] <resource-group>
	network lb show [options] <resource-group> <name>
	network lb delete [options] <resource-group> <name>

**Commands to manage probes of a load balancer**
	
	network lb probe create [options] <resource-group> <lb-name> <name>
	network lb probe set [options] <resource-group> <lb-name> <name>
	network lb probe list [options] <resource-group> <lb-name>
	network lb probe delete [options] <resource-group> <lb-name> <name>

**Commands to manage frontend ip configurations of a load balancer**

	network lb frontend-ip create [options] <resource-group> <lb-name> <name>
	network lb frontend-ip set [options] <resource-group> <lb-name> <name>
	network lb frontend-ip list [options] <resource-group> <lb-name>
	network lb frontend-ip delete [options] <resource-group> <lb-name> <name>

**Commands to manage backend address pools of a load balancer**
	
	network lb address-pool create [options] <resource-group> <lb-name> <name>
	network lb address-pool add [options] <resource-group> <lb-name> <name>
	network lb address-pool remove [options] <resource-group> <lb-name> <name>
	network lb address-pool list [options] <resource-group> <lb-name>
	network lb address-pool delete [options] <resource-group> <lb-name> <name>

**Commands to manage load balancer rules**
	
	network lb rule create [options] <resource-group> <lb-name> <name>
	network lb rule set [options] <resource-group> <lb-name> <name>
	network lb rule list [options] <resource-group> <lb-name>
	network lb rule delete [options] <resource-group> <lb-name> <name>

**Commands to manage load balancer inbound NAT rules**
	
	network lb inbound-nat-rule create [options] <resource-group> <lb-name> <name>
	network lb inbound-nat-rule set [options] <resource-group> <lb-name> <name>
	network lb inbound-nat-rule list [options] <resource-group> <lb-name>
	network lb inbound-nat-rule delete [options] <resource-group> <lb-name> <name>

**Commands to manage public ip addresses**
	
	network public-ip create [options] <resource-group> <name> <location>
	network public-ip set [options] <resource-group> <name>
	network public-ip list [options] <resource-group>
	network public-ip show [options] <resource-group> <name>
	network public-ip delete [options] <resource-group> <name>
   
**Commands to manage network interfaces**

	network nic create [options] <resource-group> <name> <location>
	network nic set [options] <resource-group> <name>
	network nic list [options] <resource-group>
	network nic show [options] <resource-group> <name>
	network nic delete [options] <resource-group> <name>

**Commands to manage network security groups**

	network nsg create [options] <resource-group> <name> <location>
	network nsg set [options] <resource-group> <name>
	network nsg list [options] <resource-group>
	network nsg show [options] <resource-group> <name>
	network nsg delete [options] <resource-group> <name>

**Commands to manage network security group rules**

	network nsg rule create [options] <resource-group> <nsg-name> <name>
	network nsg rule set [options] <resource-group> <nsg-name> <name>
	network nsg rule list [options] <resource-group> <nsg-name>
	network nsg rule show [options] <resource-group> <nsg-name> <name>
	network nsg rule delete [options] <resource-group> <nsg-name> <name>

**Commands to manage traffic manager profile**
		
	network traffic-manager profile create [options] <resource-group> <name>
	network traffic-manager profile set [options] <resource-group> <name>
	network traffic-manager profile list [options] <resource-group>
	network traffic-manager profile show [options] <resource-group> <name>
	network traffic-manager profile delete [options] <resource-group> <name>
	network traffic-manager profile is-dns-available [options] <resource-group> <relative-dns-name> 

**Commands to manage traffic manager endpoints**

	network traffic-manager profile endpoint create [options] <resource-group> <profile-name> <name> <endpoint-location>
	network traffic-manager profile endpoint set [options] <resource-group> <profile-name> <name>
	network traffic-manager profile endpoint delete [options] <resource-group> <profile-name> <name>

**Commands to manage virtual network gateways**

	network gateway list [options] <resource-group>

## azure provider: Commands to manage resource provider registrations

**List currently registered providers in ARM**

	provider list [options]

**Show details about the requested provider namespace**

	provider show [options] <namespace>

**Register provider with the subscription**

	provider register [options] <namespace>

**Unregister provider with the subscription**

	provider unregister [options] <namespace>

## azure resource: Commands to manage your resources

**Creates a resource in a resource group**

	resource create [options] <resource-group> <name> <resource-type> <location> <api-version>

**Updates a resource in a resource group without any templates or parameters**

	resource set [options] <resource-group> <name> <resource-type> <properties> <api-version>

**Lists the resources**

	resource list [options] [resource-group]

**Gets one resource within a resource group or subscription**

	resource show [options] <resource-group> <name> <resource-type> <api-version>

**Deletes a resource in a resource group**

	resource delete [options] <resource-group> <name> <resource-type> <api-version>

## azure role: Commands to manage your Azure roles

**Get all available role definitions**

	role list [options]

**Get an available role definition**

	role show [options] [name]

**Commands to manage your role assignment**

	role assignment create [options] [objectId] [upn] [mail] [spn] [role] [scope] [resource-group] [resource-type] [resource-name]
	role assignment list [options] [objectId] [upn] [mail] [spn] [role] [scope] [resource-group] [resource-type] [resource-name]
	role assignment delete [options] [objectId] [upn] [mail] [spn] [role] [scope] [resource-group] [resource-type] [resource-name]

## azure storage: Commands to manage your Storage objects

**Commands to manage your Storage accounts**

	storage account list [options]
	storage account show [options] <name>
	storage account create [options] <name>
	storage account set [options] <name>
	storage account delete [options] <name>

**Commands to manage your Storage account keys**

	storage account keys list [options] <name>
	storage account keys renew [options] <name>

**Commands to show your Storage connection string**

	storage account connectionstring show [options] <name>

**Commands to manage your Storage containers**

	storage container list [options] [prefix]
	storage container show [options] [container]
	storage container create [options] [container]
	storage container delete [options] [container]
	storage container set [options] [container]

**Commands to manage shared access signatures of your Storage container**

	storage container sas create [options] [container] [permissions] [expiry]

**Commands to manage stored access policies of your Storage container**

	storage container policy create [options] [container] [name]
	storage container policy show [options] [container] [name]
	storage container policy list [options] [container]
	storage container policy set [options] [container] [name]
	storage container policy delete [options] [container] [name]

**Commands to manage your Storage blobs**

	storage blob list [options] [container] [prefix]
	storage blob show [options] [container] [blob]
	storage blob delete [options] [container] [blob]
	storage blob upload [options] [file] [container] [blob]
	storage blob download [options] [container] [blob] [destination]

**Commands to manage your blob copy operations**

	storage blob copy start [options] [sourceUri] [destContainer]
	storage blob copy show [options] [container] [blob]
	storage blob copy stop [options] [container] [blob] [copyid]

**Commands to manage shared access signature of your Storage blob**

	storage blob sas create [options] [container] [blob] [permissions] [expiry]

**Commands to manage your Storage file shares**

	storage share create [options] [share]
	storage share show [options] [share]
	storage share delete [options] [share]
	storage share list [options] [prefix]

**Commands to manage your Storage files**

	storage file list [options] [share] [path]
	storage file delete [options] [share] [path]
	storage file upload [options] [source] [share] [path]
	storage file download [options] [share] [path] [destination]

**Commands to manage your Storage file directory**

	storage directory create [options] [share] [path]
	storage directory delete [options] [share] [path]

**Commands to manage your Storage queues**

	storage queue create [options] [queue]
	storage queue list [options] [prefix]
	storage queue show [options] [queue]
	storage queue delete [options] [queue]

**Commands to manage shared access signatures of your Storage queue**

	storage queue sas create [options] [queue] [permissions] [expiry]

**Commands to manage stored access policies of your Storage queue**

	storage queue policy create [options] [queue] [name]
	storage queue policy show [options] [queue] [name]
	storage queue policy list [options] [queue]
	storage queue policy set [options] [queue] [name]
	storage queue policy delete [options] [queue] [name]

**Commands to manage your Storage logging properties**

	storage logging show [options]
	storage logging set [options]

**Commands to manage your Storage metrics properties**

	storage metrics show [options]
	storage metrics set [options]

**Commands to manage your Storage tables**

	storage table create [options] [table]
	storage table list [options] [prefix]
	storage table show [options] [table]
	storage table delete [options] [table]

**Commands to manage shared access signatures of your Storage table**

	storage table sas create [options] [table] [permissions] [expiry]

**Commands to manage stored access policies of your Storage table**

	storage table policy create [options] [table] [name]
	storage table policy show [options] [table] [name]
	storage table policy list [options] [table]
	storage table policy set [options] [table] [name]
	storage table policy delete [options] [table] [name]

## azure tag: Commands to manage your resource manager tag

**Add a tag**

	tag create [options] <name> <value>

**Remove an entire tag or a tag value**

	tag delete [options] <name> <value>

**Lists the tag information**

	tag list [options]

**Get a tag**

	tag show [options] [name]

## azure vm: Commands to manage your Azure Virtual Machines

**Create a VM**

	vm create [options] <resource-group> <name> <location> <os-type>

**Create a VM with default resources**

	vm quick-create [options] <resource-group> <name> <location> <os-type> <image-urn> <admin-username> <admin-password>

**Lists the virtual machines within a resource group**

	vm list [options] <resource-group>

**Gets one virtual machine within a resource group**

	vm show [options] <resource-group> <name>

**Deletes one virtual machine within a resource group**

	vm delete [options] <resource-group> <name>

**Shutdown one virtual machine within a resource group**

	vm stop [options] <resource-group> <name>

**Restarts one virtual machine within a resource group**

	vm restart [options] <resource-group> <name>

**Starts one virtual machine within a resource group**

	vm start [options] <resource-group> <name>

**Shutdown one virtual machine within a resource group and releases the compute resources**

	vm deallocate [options] <resource-group> <name>

**Lists available virtual machine sizes**

	vm sizes [options]

**Capture the VM as OS Image or VM Image**

	vm capture [options] <resource-group> <name> <vhd-name-prefix>

**Sets the state of the VM to Generalized**

	vm generalize [options] <resource-group> <name>

**Gets instance view of the VM**

	vm get-instance-view [options] <resource-group> <name>

**Enables you to reset Remote Desktop Access or SSH settings on a Virtual Machine and to reset the password for the account that has administrator or sudo authority**

	vm reset-access [options] <resource-group> <name>

**Updates VM with new data**

	vm set [options] <resource-group> <name>

**Commands to manage your Virtual Machine data disks**

	vm disk attach-new [options] <resource-group> <vm-name> <size-in-gb> [vhd-name]
	vm disk detach [options] <resource-group> <vm-name> <lun>
	vm disk attach [options] <resource-group> <vm-name> [vhd-url]

**Commands to manage VM resource extensions**

	vm extension set [options] <resource-group> <vm-name> <name> <publisher-name> <version>
	vm extension get [options] <resource-group> <vm-name>

**Commands to manage your Docker Virtual Machine**

	vm docker create [options] <resource-group> <name> <location> <os-type>

**Commands to manage VM images**

	vm image list-publishers [options] <location>
	vm image list-offers [options] <location> <publisher>
	vm image list-skus [options] <location> <publisher> <offer>
	vm image list [options] <location> <publisher> [offer] [sku]
