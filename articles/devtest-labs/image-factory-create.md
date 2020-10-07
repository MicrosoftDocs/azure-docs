---
title: Create an image factory in Azure DevTest Labs | Microsoft Docs
description: This article shows you how to set up a custom image factory by using sample scripts available in the Git repository (Azure DevTest Labs). 
ms.topic: article
ms.date: 06/26/2020
---

# Create a custom image factory in Azure DevTest Labs
This article shows you how to set up a custom image factory by using sample scripts available in the [Git repository](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Scripts/ImageFactory).

## What's an image factory?
An image factory is a configuration-as-code solution that builds and distributes images automatically on a regular basis with all the desired configurations. The images in the image factory are always up-to-date, and the ongoing maintenance is almost zero once the whole process is automated. And, because all the required configurations are already in the image, it saves the time from manually configuring the system after a VM has been created with the base OS.

The significant accelerator to get a developer desktop to a ready state in DevTest Labs is using custom images. The downside of custom images is that there's something extra to maintain in the lab. For example, trial versions of products expire over time (or) newly released security updates aren't applied, which force us to refresh the custom image periodically. With an image factory, you have a definition of the image checked in to source code control and have an automated process to produce custom images based on the definition.

The solution enables the speed of creating virtual machines from custom images while eliminating additional ongoing maintenance costs. With this solution, you can automatically create custom images, distribute them to other DevTest Labs, and retire the old images. In the following video, you learn about the image factory, and how it's implemented with DevTest Labs.  All the Azure Powershell scripts are freely available and located here:  [https://aka.ms/dtlimagefactory](https://aka.ms/dtlimagefactory).

<br/>

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Custom-Image-Factory-with-Azure-DevTest-Labs/player]


## High-level view of the solution
The solution enables the speed of creating virtual machines from custom images while eliminating additional ongoing maintenance costs. With this solution, you can automatically create custom images and distribute them to other DevTest Labs. You use Azure DevOps (formerly Visual Studio Team Services) as the orchestration engine for automating the all the operations in the DevTest Labs.

![High-level view of the solution](./media/create-image-factory/high-level-view-of-solution.png)

There's a [VSTS Extension for DevTest Labs](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks) that enables you to execute these individual steps:

- Create custom image
- Create VM
- Delete VM
- Create environment
- Delete environment
- Populate environment

Using the DevTest Labs extension is an easy way to get started with automatically creating custom images in DevTest Labs.

There's an alternate implementation using PowerShell script for a more complex scenario. Using PowerShell, you can fully automate an image factory based on DevTest Labs that can be used in your Continuous Integration and Continuous Delivery (CI/CD) toolchain. The principles followed in this alternate solution are:

- Common updates should require no changes to the image factory. (for example, adding a new type of custom image, automatically retiring old images, adding a new ‘endpoint’ DevTest Labs to receive custom images, and so on.)
- Common changes are backed by source code control (infrastructure as code)
- DevTest Labs receiving custom images may not be in the same Azure Subscription (labs span subscriptions)
- PowerShell scripts must be reusable so we can spin up additional factories as needed

## Next steps
Move on to the next article in this section: [Run an image factory from Azure DevOps](image-factory-set-up-devops-lab.md)
