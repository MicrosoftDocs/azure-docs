---
title: Using Ansible with Azure | Microsoft Docs
description: Introduction to using Ansible to automates cloud provisioning, configuration management, and application deployments.
keywords: ansible, azure, devops, overview, cloud provision, configuration management, application deployment, ansible modules, ansible playbooks
ms.topic: overview
ms.service: ansible
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.date: 04/30/2019
---

# Using Ansible with Azure

[Ansible](https://www.ansible.com) is an open-source product that automates cloud provisioning, configuration management, and application deployments. Using Ansible you can provision virtual machines, containers, and network and complete cloud infrastructures. Also, Ansible allows you to automate the deployment and configuration of resources in your environment.

This article gives a basic overview of some of the benefits of using Ansible with Azure.

## Ansible playbooks

[Ansible playbooks](https://docs.ansible.com/ansible/latest/playbooks.html) allow you to direct Ansible to configure your environment. Playbooks are coded using YAML so as to be human-readable. The Tutorials section gives many examples of using playbooks to install and configure Azure resources. 

## Ansible modules

Ansible includes a suite of [Ansible modules](https://docs.ansible.com/ansible/latest/modules_by_category.html) that are run directly on remote hosts or via [playbooks](https://docs.ansible.com/ansible/latest/playbooks.html). Users can create their own modules. Modules are used to control system resources - such as services, packages, or files - or execute system commands.

For interacting with Azure services, Ansible includes a suite of [Ansible cloud modules](https://docs.ansible.com/ansible/list_of_cloud_modules.html#azure). These modules enable you to create and orchestrate your infrastructure on Azure. 

## Migrate existing workload to Azure

Once you use Ansible to define your infrastructure, you can apply your application's playbook letting Azure automatically scale your environment as needed. 

## Automate cloud-native application in Azure

Ansible enables you to automate cloud-native applications in Azure using Azure microservices such as [Azure Functions](https://azure.microsoft.com//services/functions/) and [Kubernetes on Azure](https://azure.microsoft.com/services/container-service/kubernetes/).  

## Manage deployments with dynamic inventory

Via its [dynamic inventory](https://docs.ansible.com/ansible/intro_dynamic_inventory.html) feature, Ansible provides the ability to pull inventory from Azure resources. You can then tag your existing Azure deployments and manage those tagged deployments through Ansible.

## Additional Azure Marketplace options

The [Ansible Tower](https://azuremarketplace.microsoft.com/marketplace/apps/redhat.ansible-tower) is an Azure Marketplace image by Red Hat. 

Ansible Tower is a web-based UI and dashboard for Ansible that has the following features:

* Enables you to define role-based access control, job scheduling, and graphical inventory management. 
* Includes a REST API and CLI so you can insert Tower into existing tools and processes. 
* Supports real-time output of playbook runs. 
* Encrypts credentials - such as Azure and SSH keys - so you can delegate tasks without exposing credentials.

## Ansible module and version matrix for Azure

Ansible includes a suite of modules for use in provisioning and configuring Azure resources. These resources include virtual machines, scale sets, networking services, and container services. The [Ansible matrix](./ansible-matrix.md) lists the Ansible modules for Azure and the Ansible versions in which they ship.

## Next steps

- [Quickstart: Deploy the Ansible solution template for Azure to CentOS](./ansible-deploy-solution-template.md)
- [Quickstart: Configure Linux virtual machines in Azure using Ansible](/azure/virtual-machines/linux/ansible-install-configure?toc=%2Fazure%2Fansible%2Ftoc.json&bc=%2Fazure%2Fbread%2Ftoc.json)