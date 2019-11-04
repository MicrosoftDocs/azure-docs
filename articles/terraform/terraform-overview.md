---
title: Using Terraform with Azure
description: Introduction to using Terraform to version and deploy Azure infrastructure.
ms.service: terraform
author: tomarchermsft
ms.author: tarcher
ms.topic: overview
ms.date: 10/26/2019
---

# Terraform with Azure

[Hashicorp Terraform](https://www.terraform.io/) is an open-source tool for provisioning and managing cloud infrastructure. It codifies infrastructure in configuration files that describe the topology of cloud resources. These resources include  virtual machines, storage accounts, and networking interfaces. The Terraform CLI provides a simple mechanism to deploy and version the configuration files to Azure.

This article describes the benefits of using Terraform to manage Azure infrastructure.

## Automate infrastructure management.

Terraform's template-based configuration files enable you to define, provision, and configure Azure resources in a repeatable and predictable manner. Automating infrastructure has several benefits:

- Lowers the potential for human errors while deploying and managing infrastructure.
- Deploys the same template multiple times to create identical development, test, and production environments.
- Reduces the cost of development and test environments by creating them on-demand.

## Understand infrastructure changes before being applied

As a resource topology becomes complex, understanding the meaning and impact of infrastructure changes can be difficult.

The Terraform CLI enables users to validate and preview infrastructure changes before application. Previewing infrastructure changes in a safe manner has several benefits:
- Team members can collaborate more effectively by quickly understanding proposed changes and their impact.
- Unintended changes can be caught early in the development process

## Deploy infrastructure to multiple clouds

Terraform is adept at deploying an infrastructure across multiple cloud providers. It enables developers to use consistent tooling to manage each infrastructure definition.

## Next steps

Now that you have an overview of Terraform and its benefits, here are suggested next steps:

- Get started by [installing Terraform and configuring it to use Azure](/azure/virtual-machines/linux/terraform-install-configure).
- [Create an Azure virtual machine using Terraform](/azure/virtual-machines/linux/terraform-create-complete-vm)
- Explore the [Azure Resource Manager module for Terraform](https://www.terraform.io/docs/providers/azurerm/) 