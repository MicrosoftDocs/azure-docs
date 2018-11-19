---
title: Using Ansible with Azure
description: Introduction to using Ansible to automates cloud provisioning, configuration management, and application deployments.
ms.service: ansible
keywords: ansible, azure, devops, overview, cloud provision, configuration management, application deployment, ansible modules, ansible playbooks
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.date: 09/02/2018
ms.topic: article
---

# Ansible with Azure

[Ansible](http://www.ansible.com) is an open-source product that automates cloud provisioning, configuration management, and application deployments. Using Ansible you can provision virtual machines, containers, and network and complete cloud infrastructures. In addition, Ansible allows you to automate the deployment and configuration of resources in your environment.

This article gives a basic overview of some of the benefits of using Ansible with Azure.

## Ansible playbooks

[Ansible playbooks](http://docs.ansible.com/ansible/latest/playbooks.html) are Ansible’s configuration, deployment, and orchestration language. They can describe a policy you want your remote systems to enforce, or a set of steps in a general IT process. When you create a playbook you do so using YAML, which defines a model of a configuration or a process.

## Ansible modules

Ansible includes a suite of [Ansible modules](http://docs.ansible.com/ansible/latest/modules_by_category.html) that can be executed directly on remote hosts or via [playbooks](http://docs.ansible.com/ansible/latest/playbooks.html). Users can also create their own modules. Modules can be used to control system resources - such as services, packages, or files - or execute system commands.

For interacting with Azure services, Ansible includes a suite of [Ansible cloud modules](http://docs.ansible.com/ansible/list_of_cloud_modules.html#azure) that provides the tools to easily create and orchestrate your infrastructure on Azure. 

## Migrate existing workload to Azure

Once you have used Ansible to define your infrastructure, you can apply your application's playbook letting Azure automatically scale your environment as needed. 

## Automate cloud-native application in Azure

Ansible enables you to automate cloud-native applications in Azure using Azure microservices such as [Azure Functions](https://azure.microsoft.com//services/functions/) and [Kubernetes on Azure](https://azure.microsoft.com/services/container-service/kubernetes/).  

## Manage deployments with dynamic inventory
Via its [dynamic inventory](http://docs.ansible.com/ansible/intro_dynamic_inventory.html) feature, Ansible provides the ability to pull inventory from Azure resources. You can then tag your existing Azure deployments and manage those tagged deployments through Ansible.

## Additional Azure Marketplace options
The [Ansible Tower](https://azuremarketplace.microsoft.com/marketplace/apps/redhat.ansible-tower) Azure Marketplace image by Red Hat helps organizations scale IT automation and manage complex deployments across physical, virtual, and cloud infrastructures. Ansible Tower includes capabilities that provide additional levels of visibility, control, security, and efficiency necessary for today's enterprises. Ansible Tower encrypts credentials such as Azure and SSH keys so that you can delegate jobs to less experienced employees without the risk of exposing your credentials.

## Ansible module and version matrix for Azure
Ansible ships with a number of modules that can be executed directly on remote hosts or through playbooks.
The [Ansible module and version matrix](./ansible-matrix.md) lists the Ansible modules for Azure that can provision Azure cloud resources such as virtual machine, networking, and container services. 

## Next steps
- [Configure Ansible](/azure/virtual-machines/linux/ansible-install-configure?toc=%2Fen-us%2Fazure%2Fansible%2Ftoc.json&bc=%2Fen-us%2Fazure%2Fbread%2Ftoc.json)
- [Create a Linux VM](/azure/virtual-machines/linux/ansible-create-vm?toc=%2Fen-us%2Fazure%2Fansible%2Ftoc.json&bc=%2Fen-us%2Fazure%2Fbread%2Ftoc.json)
