---
title: Using Chef with Azure
description: Introduction to using Chef to configure and test your Azure infrastructure
ms.service: virtual-machines-linux
keywords:  azure, chef, devops, virtual machines, overview, automate
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.date: 05/15/2018
ms.topic: article
---

# Using Chef with Azure
[Chef](https://www.chef.io) is a powerful automation platform that transforms virtual machine infrastructure on Azure into code. Chef automates how infrastructure is configured, deployed, and managed across your network, no matter its size.

This article describes the benefits of using Chef to manage Azure infrastructure.

## Chef Extension on Azure
Provision a virtual machine with Chef Client running as a background service with the [Chef Extension](https://docs.microsoft.com/azure/chef/chef-extension-portal) on the Azure Portal. Once provisioned, these virtual machines are ready to be managed by a Chef server.

## Chef Cloud Shell
Use Chef Workstation directly in Azure Cloud Shell! Run all of your Chef utilities and InSpec right from Cloud Shell. You can utilize the Chef commands from:

* [chef](https://docs.chef.io/ctl_chef.html)
* [kitchen](https://docs.chef.io/ctl_kitchen.html)
* [inspec](https://www.inspec.io/docs/reference/cli/)
* [knife](https://docs.chef.io/knife.html)
* [cookstyle](https://docs.chef.io/cookstyle.html)
* [foodcritic](https://docs.chef.io/foodcritic.html)
* [chef-run](https://www.chef.sh/docs/chef-workstation/getting-started/)

Combine our command utilities with the other tools available in Cloud Shell, such as `git`, `az-cli`, and `terraform`, and write your infrastructure and compliance automation from the browser.

## Automate infrastructure, apps, and compliance with one platform
Companies require speed, velocity, and safety to compete in the digital marketplace. Together Chef and Microsoft help individuals, teams, and enterprises accomplish all of these things. With one platform, Chef Automate, you can now automate and continuously deliver your infrastructure, applications, and compliance across your Microsoft estate.

## Test drive Chef Automate on Azure
Supported by Chef, the [Chef Automate Azure Marketplace solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/chef-software.chef-automate) enables you to build, deploy, and manage your infrastructure and applications collaboratively. One click gets you instant access to all commercial features included with Chef Automate; gain end-to-end visibility across your entire fleet, enable continuous compliance, and manage all change with a unified workflow.

## Next steps

* [Create a Windows virtual machine on Azure using Chef](/azure/virtual-machines/windows/chef-automation)
