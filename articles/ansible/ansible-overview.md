---
title: Using Ansible with Azure
description: Introduction to using Ansible to automates cloud provisioning, configuration management, and application deployments.
ms.service: ansible
keywords: ansible, devops, overview, cloud provision, configuration management, application deployment
author: tomarcher
manager: routlaw
ms.author: tarcher
ms.date: 12/18/2017
ms.topic: article
---

# Ansible with Azure

[Ansible](http://www.ansible.com) is an open source automation engine that automates cloud provisioning (including VM, container, network and complete cloud infrastructures), configuration management, and application deployments.  

This article describes the benefits of using Ansible with Azure.

## Automate and configure Azure resources

Ansible includes a suite of [Ansible cloud modules](http://docs.ansible.com/ansible/list_of_cloud_modules.html#azure) for interacting with Azure services. The cloud modules give you the tools to easily create and orchestrate infrastructure on Microsoft Azure. 

### Migrate existing workload manageds to Azure

Once you have defined your Azure environments with Ansible, you can apply your application's playbook letting Azure automatically scale your environment as needed. 

### Automate cloud-native application in Azure

You can leverage the power of Ansible to automate cloud-native applications in Azure using Azure microservices such as [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) and [Kubernetes on Azure](https://azure.microsoft.com/en-us/services/container-service/kubernetes/)).  

## Manage existing Azure deployments with Dynamic Inventory
Via its [Dynamic Inventory](http://docs.ansible.com/ansible/intro_dynamic_inventory.html) feature, Ansible provides the ability to pull inventory from Azure resources. You can then tag your existing Azure deployments and manage those tagged deployments through Ansible.

## Additional Ansible options in the Azure Marketplace
The The [Ansible Tower](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/redhat.ansible-tower) Azure Marketplace image by Red Hat helps organizations scale IT automation and manage complex deployments across physical, virtual, and cloud infrastructures. Ansible Tower includes capabilities that provide additional levels of visibility, control, security, and efficiency necessary for today's enterprises. Ansible Tower encrypts credentials such as Azure and SSH keys so that you can delegate jobs to junior or temp employees without risking explosing your credentials.

## Next steps
Now that you have an overview of Ansible and its benefits, here are suggested next steps: