<properties
	pageTitle="Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management"
	description="Learn about using the command-line tools for Mac, Linux, and Windows to manage Azure using the Azure CLI arm mode."
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

This topic describes how to use the Azure Command-Line Interface (Azure CLI) in the **arm** mode to create, manage, and delete services on the command line of Mac, Linux, and Windows computers. You can perform the same tasks using the various libraries of the Azure SDKs, with PowerShell, and 

> [AZURE.NOTE] Using Azure services with the **asm** mode is conceptually similar to thinking of individual Azure concepts and services like Websites, Virtual Machines, Virtual Networks, Storage, and so on. Richer functionality with a logically grouped and hierarchical model of resources is available on the command line using the **arm** mode. To switch to that mode, see [Using the Azure Cross-Platform Command-Line Interface with the Resource Manager](xplat-cli-azure-resource-manager.md).

For installation instructions, see [Install and Configure the Azure Cross-Platform Command-Line Interface](xplat-cli-install.md).

Optional parameters are shown in square brackets (for example, [parameter]). All other parameters are required.

In addition to command-specific optional parameters documented here, there are three optional parameters that can be used to display detailed output such as request options and status codes. The -v parameter provides verbose output, and the -vv parameter provides even more detailed verbose output. The --json option will output the result in raw json format.

## azure account: Manage your account information and publish settings
Your Azure subscription information is used by the tool to connect to your account. This information can be obtained from the Azure portal in a publish settings file as described here. You can import the publish settings file as a persistent local configuration setting that the tool will use for subsequent operations. You only need to import your publish settings once.

**account download [options]**

This command launches a browser to download your .publishsettings file from the Azure portal.

	~$ azure account download
	info:   Executing command account download
	info:   Launching browser to https://windows.azure.com/download/publishprofile.aspx
	help:   Save the downloaded file, then execute the command
	help:   account import <file>
	info:   account download command OK

**account import [options] &lt;file>**


This command imports a publishsettings file or certificate so that it can be used by the tool going forward.

	~$ azure account import publishsettings.publishsettings
	info:   Importing publish settings file publishsettings.publishsettings
	info:   Found subscription: 3-Month Free Trial
	info:   Found subscription: Pay-As-You-Go
	info:   Setting default subscription to: 3-Month Free Trial
	warn:   The 'publishsettings.publishsettings' file contains sensitive information.
	warn:   Remember to delete it now that it has been imported.
	info:   Account publish settings imported successfully

> [AZURE.NOTE] The publishsettings file can contain details (that is, subscription name and ID) about more than one subscription. When you import the publishsettings file, the first subscription is used as the default description. To use a different subscription, run the following command.
<code>~$ azure config set subscription &lt;other-subscription-id&gt;</code>

**account clear [options]**

This command removes the stored publishsettings that have been imported. Use this command if you're finished using the tool on this machine and want to assure that the tool cannot be used with your account going forward.

	~$ azure account clear
	Clearing account info.
	info:   OK

**account list [options]**

List the imported subscriptions

	~$ azure account list
	info:    Executing command account list
	data:    Name                                    Id
	       Current
	data:    --------------------------------------  -------------------------------
	-----  -------
	data:    Forums Subscription                     8679c8be-3b05-49d9-b8fb  true
	data:    Evangelism Team Subscription            9e672699-1055-41ae-9c36  false
	data:    MSOpenTech-Prod                         c13e6a92-706e-4cf5-94b6  false

**account set [options] &lt;subscription&gt;**

Set the current subscription




## Commands to manage your account environment

**account env list [options]**

List of the account environments

	C:\windows\system32>azure account env list
	info:    Executing command account env list
	data:    Name
	data:    ---------------
	data:    AzureCloud
	data:    AzureChinaCloud
	info:    account env list command OK

**account env show [options] [environment]**

Show account environment details

	~$ azure account env show
	info:    Executing command account env show
	Environment name: AzureCloud
	data:    Environment publishingProfile  http://go.microsoft.com/fwlink/?LinkId=2544
	data:    Environment portal  http://go.microsoft.com/fwlink/?LinkId=2544
	info:    account env show command OK

**account env add [options] [environment]**

This command adds an environment to the account

**account env set [options] [environment]**

This command sets the account environment

**account env delete [options] [environment]**

This command deletes the specified environment from the account

## azure ad: Commands to display Active Directory objects

Commands to display active directory applications
help:      ad app create [options]
help:      ad app delete [options] <object-id>
help:    
help:    Commands to display active directory groups
help:      ad group list [options]
help:      ad group show [options]
help:    
help:    Commands to provide an active directory sub group or member info
help:      ad group member list [options] [objectId]
help:    
help:    Commands to display active directory service principals
help:      ad sp list [options]
help:      ad sp show [options]
help:      ad sp create [options] <application-id>
help:      ad sp delete [options] <object-id>
help:    
help:    Commands to display active directory users
help:      ad user list [options]
help:      ad user show [options]

## azure availset: commands to manage your availability sets

help:    Creates an availability set within a resource group
help:      availset create [options] <resource-group> <name> <location> [tags]
help:    
help:    Lists the availability sets within a resource group
help:      availset list [options] <resource-group>
help:    
help:    Gets one availability set within a resource group
help:      availset show [options] <resource-group> <name>
help:    
help:    Deletes one availability set within a resource group
help:      availset delete [options] <resource-group> <name>

## azure config: commands to manage your local settings

List config settings
help:      config list [options]
help:    
help:    Delete a config setting
help:      config delete [options] <name>
help:    
help:    Update a config setting
help:      config set <name> <value>
help:    
help:    Sets the cli working mode, valid names are 'arm' for resource manager and 'asm' for service management
help:      config mode [options] <name>


## azure feature: commands to manage account features

**account affinity-group list [options]**

This command lists your Azure affinity groups.

## azure group: Commands to manage your resource groups

Creates a new resource group
help:      group create [options] <name> <location>
help:    
help:    Set tags to a resource group
help:      group set [options] <name> <tags>
help:    
help:    Deletes a resource group
help:      group delete [options] <name>
help:    
help:    Lists the resource groups for your subscription
help:      group list [options]
help:    
help:    Shows a resource group for your subscription
help:      group show [options] <name>
help:    
help:    Commands to manage resource group logs
help:      group log show [options] [name]
help:    
help:    Commands to manage your deployment in a resource group
help:      group deployment create [options] [resource-group] [name]
help:      group deployment list [options] <resource-group> [state]
help:      group deployment show [options] <resource-group> [deployment-name]
help:      group deployment stop [options] <resource-group> [deployment-name]
help:    
help:    Commands to manage your local or gallery resource group template
help:      group template list [options]
help:      group template show [options] <name>
help:      group template download [options] [name] [file]
help:      group template validate [options] <resource-group>

## azure insights: Commands related to monitoring Insights (events, alert rules, autoscale settings, metrics)

Retrieve operation logs for a subscription, a correlationId, a resource group, resource, or resource provider.
help:      insights logs list [options]

## azure location: Commands to get the available locations for all resource types

list the available locations
help:      location list [options]

## azure network: Commands to manage network resource

help:    Commands to manage virtual networks
help:      network vnet create [options] <resource-group> <name> <location>
help:      network vnet set [options] <resource-group> <name>
help:      network vnet list [options] <resource-group>
help:      network vnet show [options] <resource-group> <name>
help:      network vnet delete [options] <resource-group> <name>
help:    
help:    Commands to manage virtual network subnets
help:      network vnet subnet create [options] <resource-group> <vnet-name> <name>
help:      network vnet subnet set [options] <resource-group> <vnet-name> <name>
help:      network vnet subnet list [options] <resource-group> <vnet-name>
help:      network vnet subnet show [options] <resource-group> <vnet-name> <name>
help:      network vnet subnet delete [options] <resource-group> <vnet-name> <subnet-name>
help:    
help:    Commands to manage load balancers
help:      network lb create [options] <resource-group> <name> <location>
help:      network lb list [options] <resource-group>
help:      network lb show [options] <resource-group> <name>
help:      network lb delete [options] <resource-group> <name>
help:    
help:    Commands to manage probes of a load balancer
help:      network lb probe create [options] <resource-group> <lb-name> <name>
help:      network lb probe set [options] <resource-group> <lb-name> <name>
help:      network lb probe list [options] <resource-group> <lb-name>
help:      network lb probe delete [options] <resource-group> <lb-name> <name>
help:    
help:    Commands to manage frontend ip configurations of a load balancer
help:      network lb frontend-ip create [options] <resource-group> <lb-name> <name>
help:      network lb frontend-ip set [options] <resource-group> <lb-name> <name>
help:      network lb frontend-ip list [options] <resource-group> <lb-name>
help:      network lb frontend-ip delete [options] <resource-group> <lb-name> <name>
help:    
help:    Commands to manage backend address pools of a load balancer
help:      network lb address-pool create [options] <resource-group> <lb-name> <name>
help:      network lb address-pool add [options] <resource-group> <lb-name> <name>
help:      network lb address-pool remove [options] <resource-group> <lb-name> <name>
help:      network lb address-pool list [options] <resource-group> <lb-name>
help:      network lb address-pool delete [options] <resource-group> <lb-name> <name>
help:    
help:    Commands to manage load balancer rules
help:      network lb rule create [options] <resource-group> <lb-name> <name>
help:      network lb rule set [options] <resource-group> <lb-name> <name>
help:      network lb rule list [options] <resource-group> <lb-name>
help:      network lb rule delete [options] <resource-group> <lb-name> <name>
help:    
help:    Commands to manage load balancer inbound NAT rules
help:      network lb inbound-nat-rule create [options] <resource-group> <lb-name> <name>
help:      network lb inbound-nat-rule set [options] <resource-group> <lb-name> <name>
help:      network lb inbound-nat-rule list [options] <resource-group> <lb-name>
help:      network lb inbound-nat-rule delete [options] <resource-group> <lb-name> <name>
help:    
help:    Commands to manage public ip addresses
help:      network public-ip create [options] <resource-group> <name> <location>
help:      network public-ip set [options] <resource-group> <name>
help:      network public-ip list [options] <resource-group>
help:      network public-ip show [options] <resource-group> <name>
help:      network public-ip delete [options] <resource-group> <name>
help:    
help:    Commands to manage network interfaces
help:      network nic create [options] <resource-group> <name> <location>
help:      network nic set [options] <resource-group> <name>
help:      network nic list [options] <resource-group>
help:      network nic show [options] <resource-group> <name>
help:      network nic delete [options] <resource-group> <name>
help:    
help:    Commands to manage network security groups
help:      network nsg create [options] <resource-group> <name> <location>
help:      network nsg set [options] <resource-group> <name>
help:      network nsg list [options] <resource-group>
help:      network nsg show [options] <resource-group> <name>
help:      network nsg delete [options] <resource-group> <name>
help:    
help:    Commands to manage network security group rules
help:      network nsg rule create [options] <resource-group> <nsg-name> <name>
help:      network nsg rule set [options] <resource-group> <nsg-name> <name>
help:      network nsg rule list [options] <resource-group> <nsg-name>
help:      network nsg rule show [options] <resource-group> <nsg-name> <name>
help:      network nsg rule delete [options] <resource-group> <nsg-name> <name>
help:    
help:    Commands to manage traffic manager
help:    
help:    Commands to manage traffic manager profile
help:      network traffic-manager profile create [options] <resource-group> <name>
help:      network traffic-manager profile set [options] <resource-group> <name>
help:      network traffic-manager profile list [options] <resource-group>
help:      network traffic-manager profile show [options] <resource-group> <name>
help:      network traffic-manager profile delete [options] <resource-group> <name>
help:      network traffic-manager profile is-dns-available [options] <resource-group> <relative-dns-name> 
help:    
help:    Commands to manage traffic manager endpoints
help:      network traffic-manager profile endpoint create [options] <resource-group> <profile-name> <name> <endpoint-location>
help:      network traffic-manager profile endpoint set [options] <resource-group> <profile-name> <name>
help:      network traffic-manager profile endpoint delete [options] <resource-group> <profile-name> <name>
help:    
help:    Commands to manage virtual network gateways
help:      network gateway list [options] <resource-group>

## azure provider: Commands to manage resource provider registrations

help:    List currently registered providers in ARM
help:      provider list [options]
help:    
help:    Show details about the requested provider namespace
help:      provider show [options] <namespace>
help:    
help:    Register namespace provider with the subscription
help:      provider register [options] <namespace>
help:    
help:    Un-register namespace provider with the subscription
help:      provider unregister [options] <namespace>

## azure resource: Commands to manage your resources

help:    Creates a resource in a resource group
help:      resource create [options] <resource-group> <name> <resource-type> <location> <api-version>
help:    
help:    Updates a resource in a resource group without any templates or parameters
help:      resource set [options] <resource-group> <name> <resource-type> <properties> <api-version>
help:    
help:    Lists the resources
help:      resource list [options] [resource-group]
help:    
help:    Gets one resource within a resource group or subscription
help:      resource show [options] <resource-group> <name> <resource-type> <api-version>
help:    
help:    Deletes a resource in a resource group
help:      resource delete [options] <resource-group> <name> <resource-type> <api-version>

## azure role: Commands to manage your Azure roles

help:    Get all available role definitions
help:      role list [options]
help:    
help:    Get an available role definition
help:      role show [options] [name]
help:    
help:    Commands to manage your role assignment
help:      role assignment create [options] [objectId] [upn] [mail] [spn] [role] [scope] [resource-group] [resource-type] [resource-name]
help:      role assignment list [options] [objectId] [upn] [mail] [spn] [role] [scope] [resource-group] [resource-type] [resource-name]
help:      role assignment delete [options] [objectId] [upn] [mail] [spn] [role] [scope] [resource-group] [resource-type] [resource-name]

## azure storage: Commands to manage your Storage objects

help:    Commands to manage your Storage accounts
help:      storage account list [options]
help:      storage account show [options] <name>
help:      storage account create [options] <name>
help:      storage account set [options] <name>
help:      storage account delete [options] <name>
help:    
help:    Commands to manage your Storage account keys
help:      storage account keys list [options] <name>
help:      storage account keys renew [options] <name>
help:    
help:    Commands to show your Storage connection string
help:      storage account connectionstring show [options] <name>
help:    
help:    Commands to manage your Storage containers
help:      storage container list [options] [prefix]
help:      storage container show [options] [container]
help:      storage container create [options] [container]
help:      storage container delete [options] [container]
help:      storage container set [options] [container]
help:    
help:    Commands to manage shared access signatures of your Storage container
help:      storage container sas create [options] [container] [permissions] [expiry]
help:    
help:    Commands to manage stored access policies of your Storage container
help:      storage container policy create [options] [container] [name]
help:      storage container policy show [options] [container] [name]
help:      storage container policy list [options] [container]
help:      storage container policy set [options] [container] [name]
help:      storage container policy delete [options] [container] [name]
help:    
help:    Commands to manage your Storage blobs
help:      storage blob list [options] [container] [prefix]
help:      storage blob show [options] [container] [blob]
help:      storage blob delete [options] [container] [blob]
help:      storage blob upload [options] [file] [container] [blob]
help:      storage blob download [options] [container] [blob] [destination]
help:    
help:    Commands to manage your blob copy operations
help:      storage blob copy start [options] [sourceUri] [destContainer]
help:      storage blob copy show [options] [container] [blob]
help:      storage blob copy stop [options] [container] [blob] [copyid]
help:    
help:    Commands to manage shared access signature of your Storage blob
help:      storage blob sas create [options] [container] [blob] [permissions] [expiry]
help:    
help:    Commands to manage your Storage file shares
help:      storage share create [options] [share]
help:      storage share show [options] [share]
help:      storage share delete [options] [share]
help:      storage share list [options] [prefix]
help:    
help:    Commands to manage your Storage files
help:      storage file list [options] [share] [path]
help:      storage file delete [options] [share] [path]
help:      storage file upload [options] [source] [share] [path]
help:      storage file download [options] [share] [path] [destination]
help:    
help:    Commands to manage your Storage file directory
help:      storage directory create [options] [share] [path]
help:      storage directory delete [options] [share] [path]
help:    
help:    Commands to manage your Storage queues
help:      storage queue create [options] [queue]
help:      storage queue list [options] [prefix]
help:      storage queue show [options] [queue]
help:      storage queue delete [options] [queue]
help:    
help:    Commands to manage shared access signatures of your Storage queue
help:      storage queue sas create [options] [queue] [permissions] [expiry]
help:    
help:    Commands to manage stored access policies of your Storage queue
help:      storage queue policy create [options] [queue] [name]
help:      storage queue policy show [options] [queue] [name]
help:      storage queue policy list [options] [queue]
help:      storage queue policy set [options] [queue] [name]
help:      storage queue policy delete [options] [queue] [name]
help:    
help:    Commands to manage your Storage logging properties
help:      storage logging show [options]
help:      storage logging set [options]
help:    
help:    Commands to manage your Storage metrics properties
help:      storage metrics show [options]
help:      storage metrics set [options]
help:    
help:    Commands to manage your Storage tables
help:      storage table create [options] [table]
help:      storage table list [options] [prefix]
help:      storage table show [options] [table]
help:      storage table delete [options] [table]
help:    
help:    Commands to manage shared access signatures of your Storage table
help:      storage table sas create [options] [table] [permissions] [expiry]
help:    
help:    Commands to manage stored access policies of your Storage table
help:      storage table policy create [options] [table] [name]
help:      storage table policy show [options] [table] [name]
help:      storage table policy list [options] [table]
help:      storage table policy set [options] [table] [name]
help:      storage table policy delete [options] [table] [name]

## azure tag: Commands to manage your resource manager tag

help:    add a tag
help:      tag create [options] <name> <value>
help:    
help:    Remove an entire tag or a tag value
help:      tag delete [options] <name> <value>
help:    
help:    Lists the tag information
help:      tag list [options]
help:    
help:    Get a tag
help:      tag show [options] [name]

## azure vm: Commands to manage your Azure Virtual Machines

help:    Create a VM
help:      vm create [options] <resource-group> <name> <location> <os-type>
help:    
help:    Create a VM with default resources
help:      vm quick-create [options] <resource-group> <name> <location> <os-type> <image-urn> <admin-username> <admin-password>
help:    
help:    Lists the virtual machines within a resource group
help:      vm list [options] <resource-group>
help:    
help:    Gets one virtual machine within a resource group
help:      vm show [options] <resource-group> <name>
help:    
help:    Deletes one virtual machine within a resource group
help:      vm delete [options] <resource-group> <name>
help:    
help:    Shutdown one virtual machine within a resource group
help:      vm stop [options] <resource-group> <name>
help:    
help:    Restarts one virtual machine within a resource group
help:      vm restart [options] <resource-group> <name>
help:    
help:    Starts one virtual machine within a resource group
help:      vm start [options] <resource-group> <name>
help:    
help:    Shutdown one virtual machine within a resource group and releases the compute resources
help:      vm deallocate [options] <resource-group> <name>
help:    
help:    Lists available virtual machine sizes
help:      vm sizes [options]
help:    
help:    Capture the VM as OS Image or VM Image
help:      vm capture [options] <resource-group> <name> <vhd-name-prefix>
help:    
help:    Sets the state of the VM to Generalized.
help:      vm generalize [options] <resource-group> <name>
help:    
help:    Gets instance view of the VM.
help:      vm get-instance-view [options] <resource-group> <name>
help:    
help:    Enables you to reset Remote Desktop Access or SSH settings on a Virtual Machine and to reset the password for the account that has administrator or sudo authority.
help:      vm reset-access [options] <resource-group> <name>
help:    
help:    Updates VM with new data.
help:      vm set [options] <resource-group> <name>
help:    
help:    Commands to manage your Virtual Machine data disks
help:      vm disk attach-new [options] <resource-group> <vm-name> <size-in-gb> [vhd-name]
help:      vm disk detach [options] <resource-group> <vm-name> <lun>
help:      vm disk attach [options] <resource-group> <vm-name> [vhd-url]
help:    
help:    Commands to manage VM resource extensions
help:      vm extension set [options] <resource-group> <vm-name> <name> <publisher-name> <version>
help:      vm extension get [options] <resource-group> <vm-name>
help:    
help:    Commands to manage your Docker Virtual Machine
help:      vm docker create [options] <resource-group> <name> <location> <os-type>
help:    
help:    Commands to manage VM images
help:      vm image list-publishers [options] <location>
help:      vm image list-offers [options] <location> <publisher>
help:      vm image list-skus [options] <location> <publisher> <offer>
help:      vm image list [options] <location> <publisher> [offer] [sku]
