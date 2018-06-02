---
title: Tools for using Ansible with Azure
description: Install and use individual tools for Ansible with Azure
ms.service: ansible
keywords: ansible, azure, devops, tools, vs code, visual studio code, extension
author: tomarcher
manager: routlaw
ms.author: tarcher
ms.date: 01/14/2018
ms.topic: article
---

# Tools for using Ansible with Azure

The following tools make working with Ansible and Azure easier and more efficient.

## Visual Studio Code extension for Ansible

The [Visual Studio Code extension for Ansible](https://marketplace.visualstudio.com/items?itemName=vscoss.vscode-ansible) provides several features for using Ansible from Visual Studio Code:

- Auto completion of Ansible directives, modules, and plugins from the Ansible documentation as you type.
- Code snippets display when clicking &lt;Ctrl>&lt;Space> while authoring your Ansible playbooks.
- Syntax highlighting displays your Ansible playbook code in different colors and fonts in accordance with YAML syntax.
- Ansible playbooks can be run from the Visual Studio Code Terminal window.
    - (Windows only) Ansible can be run from a Docker container.
    - (Linux and macOS) Ansible can be run from a Docker container or from a local Ansible installation. 
- Ansible playbooks can be run from Azure Cloud Shell.