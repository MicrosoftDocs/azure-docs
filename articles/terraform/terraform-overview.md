---
title: Using Terraform with Azure
description: Introduction to using Terraform to vesion and deploy Azure infrastructure.
services: terraform
ms.service: terraform
keywords: terraform, devops, overview, plan, apply, automate
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 08/31/2018
---

# Terraform with Azure

[Hashicorp Terraform](https://www.terraform.io/) is an open-source tool for provisioning and managing cloud infrastructure. It codifies infrastructure in configuration files that describe the topology of cloud resources, such as virtual machines, storage accounts, and networking interfaces. Terraform's command-line interface (CLI) provides a simple mechanism to deploy and version the configuration files to Azure or any other supported cloud.

This article describes the benefits of using Terraform to manage Azure infrastructure.

## Automate infrastructure management.

Terraform's template-based configuration files enable you to define, provision, and configure Azure resources in a repeatable and predictable manner. Automating infrastructure has several benefits:

- Lowers the potential for human errors while deploying and managing infrastructure.
- Deploys the same template multiple times to create identical development, test, and production environments.
- Reduces the cost of development and test environments by creating them on-demand.

## Understand infrastructure changes before they are applied 

As a resource topology becomes complex, understanding the meaning and impact of infrastructure changes can be difficult.

Terraform provides a command-line interface (CLI) that allows users to validate and preview infrastructure changes before they are deployed. Previewing infrastructure changes in a safe, productive manner has several benefits:
- Team members can collaborate more effectively by quickly understanding proposed changes and their impact.
- Unintended changes can be caught early in the development process


## Deploy infrastructure to multiple clouds

Terraform is a popular tool choice for multi-cloud scenarios, where similar infrastructure is deployed to Azure and additional cloud providers or on-premises datacenters. It enables developers to use the same tools and configuration files to manage infrastructure on multiple cloud providers.

## Next steps

Now that you have an overview of Terraform and its benefits, here are suggested next steps:

- Get started by [installing Terraform and configuring it to use Azure](https://docs.microsoft.com/azure/virtual-machines/linux/terraform-install-configure).
- [Create an Azure virtual machine using Terraform](https://docs.microsoft.com/azure/virtual-machines/linux/terraform-create-complete-vm)
- Explore the [Azure Resource Manager module for Terraform](https://www.terraform.io/docs/providers/azurerm/) 