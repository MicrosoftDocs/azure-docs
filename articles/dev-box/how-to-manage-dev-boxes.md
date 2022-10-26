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
Dev boxes help you manage all of your tools, services, source-code and pre-built binaries specific to your project so you can immediately start working. Dev teams pre-configure dev boxes for specific projects and tasks. This enables you to get started quickly with an environment that's ready to build on so you can run your app in minutes. 

## Permissions
To manage a dev box, you need the following permissions:

|Action|Permission required|
|-----|-----|
|Create, view, or delete a dev box you created |Dev box user|
|View pools within a project|Dev box user|
|Connect to a dev box|Dev box user|
|Update dev boxes you created|Dev box user|
|View the network connections attached to the dev center| Dev box admin|
|View the dev box definitions attached to the dev center| Dev box admin|
|Create, view, update, or delete dev box pools in the project| Dev box admin|

## Create a dev box

Create a dev box through the developer portal. You can create as many dev boxes as you need, however there are common ways to split up your workload. 

For example, you could create a dev box for your front-end pool and a separate dev box for your back-end pool. You could also create multiple dev boxes for your back-end. Plan what dev boxes you want to create before provisioning them. 

[!INCLUDE [create a dev box](./includes/create-dev-box)]  

## Delete a dev box
When you no longer need a dev box, you can delete it.

There are many reasons why you will not need a dev box anymore. Maybe you are finished testing, or you finished working on a specific project within your product. Worried you messed up your code? Delete your Dev Box and create another one. 

CHECK WITH SAGAR 
> [!NOTE] 
> Ensure that neither you, nor your team members need the dev box before deleting as dev boxes cannot be retrieved after deletion. 

[!INCLUDE [clean up resources](./includes/clean-up-resources)]  
 
## Connect to a dev box
Once you create your dev box, you can connect to it with a remote desktop session through a browser, or through a remote desktop app. 

:::image type="content" source="./media/tutorial-connect-to-dev-box-with-remote-desktop-app/open-rdp-client.jpeg" alt-text="Screenshot of the developer portal showing the Add dev box button.":::

For most cases, use the remote desktop app when accessing a dev box. This provides the highest performance and best user-experience for heavy workloads. 

Use the browser for less expensive actions. When you access your dev box via your phone or chrome book, you can use the browser. This is useful for tasks such as a quick bug fix, or a pull request (PR) review.

## Next steps

- [Provide access to projects for project admins](./how-to-project-admin.md)
- [Create dev box definitions](./quickstart-configure-dev-box-service.md#create-a-dev-box-definition)
- [Configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md)