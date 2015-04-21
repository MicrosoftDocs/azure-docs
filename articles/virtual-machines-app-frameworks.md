<properties
   pageTitle="Application Frameworks"
   description="Describes how to create popular and important application frameworks using templates with Azure Resource Management (ARM). Examples include the LAMP stack, Ruby on Rails, SharePoint, SQL Server, and others."
   services="virtual-machines"
   documentationCenter="virtual-machines"
   authors="squillace"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm=""
   ms.workload="infrastructure"
   ms.date="04/20/2015"
   ms.author="rasquill"/>

# Application Frameworks using templates

Use this stuff to create great things, quickly.

| Template Name | Description | View the template | Deploy it right now |
|:---|:---|:---:|:---:|
| Create Availability Set | Creates an Availability Set and configures it for 3 Fault Domains. | [link](https://github.com/azurermtemplates/azurermtemplates/blob/master/101-create-availability-set-3FDs/azuredeploy.json) | <a href="https://azuredeploy.net" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Create Internal Load Balancer | Load balancer with inbound NAT rule. | [link](https://github.com/azurermtemplates/azurermtemplates/tree/master/101-create-internal-loadbalancer) | <a href="https://azuredeploy.net" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Create a security group | Creates a Network Security Group and attaches it to a subnet in the VNET. | [link](https://github.com/azurermtempThis template uses the Azure Linux CustomScript extension to deploy a LAMP application by creating an Ubuntu VM, doing a silent install of MySQL, Apache and PHP, then creating a simple PHP script.lates/azurermtemplates/tree/master/101-create-security-group) | <a href="https://azuredeploy.net" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Docker Containers on Virtual Machine Cluster | Deploy docker containers on Virtual Machines across 5 regions using Loops and template linking | [link](https://github.com/azurermtemplates/azurermtemplates/tree/master/docker-containers-vm-resource-loops) | <a href="https://azuredeploy.net" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Datastax cluster on Ubuntu | Install a Datastax cluster on Ubuntu Virtual Machines using the custom script Linux extension | [link](https://github.com/azurermtemplates/azurermtemplates/tree/master/datastax-on-ubuntu) | <a href="https://azuredeploy.net" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Active Directory Forest and domain | This template will deploy 2 new VMs (along with a new VNet, storage account and load balancer) and create a new AD forest and domain. Each VM is created as a DC for the new domain and placed in an availability set and will also have an RDP endpoint added with a public load-balanced IP address. | [link](https://github.com/azurermtemplates/azurermtemplates/tree/master/activedirectorynewdomain-ha-2-dc) | <a href="https://azuredeploy.net" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Create a VM with an application from Chocolatey installed | This template allows you to create a VM with an application from Chocolatey installed. | [link](https://github.com/azurermtemplates/azurermtemplates/tree/master/chocolatey-app-vm) | <a href="https://azuredeploy.net" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| SQL Server AlwaysOn Cluster | This template deploys a SQL Server AlwaysOn cluster with Windows Server domain. | [link](https://github.com/azurermtemplates/azurermtemplates/tree/master/sql-alwayson) | <a href="https://azuredeploy.net" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Sharepoint Farm | This template creates three Azure VMs, each with a public IP address and load balancer and a VNet, configures one VM to be an AD DC for a new forest and domain, one with SQL Server domain joined, and a third VM with a Sharepoint farm and site. All VMs have public facing RDP. | [link](https://github.com/azurermtemplates/azurermtemplates/tree/master/sharepoint-three-vm) | <a href="https://azuredeploy.net" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| LAMP Stack on Ubuntu | This template uses the Azure Linux CustomScript extension to deploy a LAMP application by creating an Ubuntu VM, doing a silent install of MySQL, Apache, and PHP, then creating a simple PHP script. | [link](https://github.com/azurermtemplates/azurermtemplates/tree/master/lamp-app) | <a href="https://azuredeploy.net" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Create a Windows VM with Anti-Malware  | Create a Windows VM with Anti-Malware extension enabled. This is a sample template that shows how to set up the Anti-Malware service with this configuration. | link | <a href="https://azuredeploy.net" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |

## Next steps

Discover all the templates at your disposal and learn about Azure Resource Management [here](resource-group-template-deploy.md).

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png
