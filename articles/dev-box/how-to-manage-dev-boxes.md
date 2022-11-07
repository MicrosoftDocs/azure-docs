---
title: How to manage a dev box
titleSuffix: Microsoft Dev Box
description: This article describes how to create, delete, and connect to Microsoft Dev Box dev boxes.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 09/18/2022
ms.topic: how-to
---

<!-- Intent: As a dev box user, I want to be able to manage my dev boxes so that I can use them most effectively. -->

# Manage a dev box
You can pre-configure a dev box to manage all of your tools, services, source-code and pre-built binaries specific to your project so you can immediately start working. Dev box enables you to get started quickly with an environment that's ready to build on so you can run your app in minutes. 

## Permissions

As a dev box developer, you can: 
- Create, view, and delete dev boxes you create
- View pools within a project 
- Connect to dev boxes

## Create a dev box

Create a dev box through the developer portal. You can create as many dev boxes as you need, however there are common ways to split up your workload. 

You could create a dev box for your front-end work and a separate dev box for your back-end work. You could also create multiple dev boxes for your back-end. 

For example, say you were working on a bug. You could a separate dev box for the bug fix to work on the specific task, troubleshoot the issue and avoid poisoning your primary machine. 


[!INCLUDE [create a dev box](./includes/create-dev-box.md)]


## Connect to a dev box
Once you create your dev box, you can connect to it through the remote desktop app, or through the browser. 

:::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/open-rdp-client.jpeg" alt-text="Screenshot of dev box showing open an RDP client.":::

For most cases, use the remote desktop app when accessing a dev box. The remote desktop provides the highest performance and best user-experience for heavy workloads. 

Use the browser for lighter workloads. When you access your dev box via your phone or chrome book, you can use the browser. The browser is useful for tasks such as a quick bug fix, or a pull request (PR) review.

## Delete a dev box
When you no longer need a dev box, you can delete it.

There are many reasons why you might not need a dev box anymore. Maybe you're finished testing, or you finished working on a specific project within your product. 

You can delete dev boxes once you finish your tasks. Say you finished fixing your bug and merged your pull request. Now, you can delete your dev box and create new dev boxes to work on new items. 

> [!NOTE] 
> Ensure that neither you, nor your team members need the dev box before deleting as dev boxes cannot be retrieved after deletion. 

[!INCLUDE [clean up resources](./includes/clean-up-resources.md)]  
 

## Next steps

- [Provide access to projects for project admins](./how-to-project-admin.md)
- [Create dev box definitions](./quickstart-configure-dev-box-service.md#create-a-dev-box-definition)
- [Configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md)