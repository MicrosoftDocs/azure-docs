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
   ms.tgt_pltfrm="NA"
   ms.workload="infrastructure"
   ms.date="04/20/2015"
   ms.author="rasquill"/>

# Application Frameworks using templates

Use this stuff to create great things, quickly.

| Template Name | Description | View the template | Deploy it right now |
|:---|:---|:---:|:---:|
| Create Availability Set | Creates an Availability Set and configures it for 3 Fault Domains. | [link](https://github.com/Azure/azure-quickstart-templates/tree/master/101-create-availability-set-3FDs) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FDrewm3%2Fazure-quickstart-templates%2Fmaster%2F101-create-availability-set-3FDs%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Create Internal Load Balancer | Load balancer with inbound NAT rule. | [link](https://github.com/Azure/azure-quickstart-templates/tree/master/101-create-internal-loadbalancer) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FDrewm3%2Fazure-quickstart-templates%2Fmaster%2F101-create-internal-loadbalancer%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Create a security group | Creates a Network Security Group and attaches it to a subnet in the VNET. | [link](https://github.com/Azure/azure-quickstart-templates/tree/master/101-create-security-group) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FDrewm3%2Fazure-quickstart-templates%2Fmaster%2F101-create-security-group%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Datastax cluster on Ubuntu | Install a Datastax cluster on Ubuntu Virtual Machines using the custom script Linux extension | [link](https://github.com/Azure/azure-quickstart-templates/tree/master/datastax-on-ubuntu) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FDrewm3%2Fazure-quickstart-templates%2Fmaster%2Fdatastax-on-ubuntu%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Active Directory Forest and domain | This template will deploy 2 new VMs (along with a new VNet, storage account and load balancer) and create a new AD forest and domain. Each VM is created as a DC for the new domain and placed in an availability set and will also have an RDP endpoint added with a public load-balanced IP address. | [link](https://github.com/Azure/azure-quickstart-templates/tree/master/activedirectorynewdomain-ha-2-dc) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FDrewm3%2Fazure-quickstart-templates%2Fmaster%2Factivedirectorynewdomain-ha-2-dc%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| LAMP Stack on Ubuntu | This template uses the Azure Linux CustomScript extension to deploy a LAMP application by creating an Ubuntu VM, doing a silent install of MySQL, Apache, and PHP, then creating a simple PHP script. | [link](https://github.com/Azure/azure-quickstart-templates/tree/master/lamp-app) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FDrewm3%2Fazure-quickstart-templates%2Fmaster%2Flamp-app%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |

## Next steps

Discover all the templates at your disposal and learn about Azure Resource Management [here](resource-group-template-deploy.md).
