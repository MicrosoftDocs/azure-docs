---
title: Tutorial - Create a Jenkins server on Azure
description: In this tutorial, you install Jenkins on an Azure Linux virtual machine from the Jenkins solution template and build a sample Java application.
keywords: jenkins, azure, devops, portal, virtual machine, solution template
ms.topic: tutorial
ms.date: 03/03/2020
---

# Tutorial: Create a Jenkins server on an Azure Linux VM 

This tutorial shows how to install [Jenkins](https://jenkins.io) on an Ubuntu Linux VM with the tools and plug-ins configured to work with Azure. When you're finished, you have a Jenkins server running in Azure building a sample Java app from [GitHub](https://github.com).

> [!div class="checklist"]
> * Install and configure a Jenkins server on Azure
> * Access the Jenkins console using an SSH tunnel
> * Create a Freestyle project
> * Compile the code and package the sample app

[!INCLUDE [jenkins-install-solution-template-include](../../includes/jenkins-install-solution-template-steps.md)]