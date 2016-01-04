# Use Azure Resource Manager templates (tenant developers)

You can use Azure Resource Manager templates in Microsoft Azure Stack. Rather than deploying and managing each resource separately, an Azure Resource Manager template deploys and provisions all of the resources for your application in a single, coordinated operation. In the template, you define the resources that are needed for the application and specify deployment parameters to input values for different environments. The template consists of JSON and expressions which you can use to construct values for your deployment.

You can find a repository of several templates at <http://aka.ms/azurestackgithub>.

## Deploy SharePoint (non HA) template

SharePoint 2013 farm with PowerShell DSC Extension.

Creates a SharePoint 2013 farm using the PowerShell DSC Extension. It creates the following resources:

• A virtual network

• Three storage accounts

• Two external load balancers

• One VM configured as domain controller for a new forest with a single domain

• One VM configured as SQL Server 2014 stand alone

• One VM configured as a one machine SharePoint 2013 farm

## Deploy AD/SQL template

Create an AD domain controller server non-HA with PowerShell DSC Extension.

Creates an AD domain controller Server using the PowerShell DSC Extension. It creates the following resources:

• A Virtual Network

• One Storage Account

• One external load balancer

• One VM configured as Domain Controller for a new forest with a single domain

## Deploy AD/SQL template

Create a SQL Server 2014 Stand alone with PowerShell DSC Extension.

PowerShell DSC Extension. It creates the following resources:

• A Virtual Network

• Two Storage Accounts

• One external load balancer

• One VM configured as Domain Controller for a new forest with a single domain

• One VM configured as SQL Server 2014 stand alone

## VM-DSC-Extension-Azure-Automation-Pull-Server template

Deploy template from Git repo ARM Template to Azure and Azure Stack.

Configures an existing Virtual Machine Local Configuration Manager (LCM) via the DSC extension, registering it to an existing Azure Automation Account DSC Pull Server.

## Create a Virtual Machine from a User Image template

Upload existing VHD to storage, Create and Deploy custom ARM template to Azure Stack.

Creates a Virtual Machine from a custom user image. This template also deploys a Virtual Network (with DNS), Public IP address, and a Network Interface.

## Simple VM template

Very simple deployment of a Windows VM.

Deploys a simple Windows VM. This template also deploys a Virtual Network (with DNS), Public IP address, and a Network Interface.

For more information on templates, see the [Azure Resource Manager overview](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/) topic.

Azure Resource Manager templates can be used with the Microsoft Azure Stack portal, PowerShell, the command line, PowerShell, and Visual Studio.
