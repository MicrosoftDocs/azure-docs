---
title: Install the Ansible solution template for Azure
description: Learn how to install the Ansible solution template on a Linux VM hosted on Azure, along with tools configured to work with Azure.
ms.service: ansible
keywords: ansible, azure, devops, plugin, linux vm, managed service identity, apt-transport-https
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 01/23/2019
---

# Install the Ansible solution template for Azure
The Ansible solution template for Azure is designed to configure an Ansible instance with minimal Azure knowledge. Using the Azure portal, you can provision a fully configured Ansible instance in minutes. 

This article walks you through the steps to install the Ansible solution template on a Linux VM along with tools configured to work with Azure. The tools include:

- **Ansible plugin for Azure** - The Ansible plugin for Azure includes a suite of modules that enable you to create and manage your infrastructure on Azure. The latest version is installed by default. However, you can specify a version number that is appropriate for your environment.
- **Azure Command-Line Interface (CLI) 2.0** - The [Azure CLI 2.0](/cli/azure/?view=azure-cli-latest) is a cross-platform command-line experience for managing Azure resources. 
- **managed identities for Azure resources** - A feature of [Active Directory](/azure/active-directory/), the [managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/overview) feature addresses the issue of keeping cloud application credentials secure so that they never appear on developer workstations and are never checked into source control.
- **apt-transport-https transport** - The apt-transport-https is an APT transport that enables the use of repositories accessed via the HTTP Secure protocol (HTTPS).

## Prerequisites
- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

