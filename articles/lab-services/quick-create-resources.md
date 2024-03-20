---
title: 'Quickstart: Create lab plan resource'
titleSuffix: Azure Lab Services
description: In this quickstart, you learn how to create a lab plan in the Azure portal to get started with Azure Lab Services and grant permission to create labs for users.
services: lab-services
ms.service: lab-services
author: RoseHJM
ms.author: rosemalcolm
ms.topic: quickstart
ms.date: 03/13/2024
ms.custom: mode-portal
#customer intent: As an  administrator, I want to quickly create a lab plan in Azure Lab Services and assign permissions to create labs to educators so they can create and run classes.
---

# Quickstart: Create resources you need to get started with Azure Lab Services

In this quickstart, you create an Azure Lab Services lab plan in the Azure portal and grant permissions to a user to create labs. Azure Lab Services enables you to create labs with infrastructure managed by Azure. After you create a lab plan, you can create labs by using the Azure Lab Services website, Microsoft Teams, or Canvas.

:::image type="content" source="./media/quick-create-resources/lab-services-process-lab-plan.png" alt-text="Diagram that shows the steps for creating a lab with Azure Lab Services, highlighting Create a lab plan." lightbox="./media/quick-create-resources/lab-services-process-lab-plan.png":::

A lab plan is an Azure resource. A lab plan contains configuration and settings that apply to all the labs created from it. For example, lab plans specify the networking setup, the available virtual machine (VM) images, and VM sizes.

After you complete this quickstart, you'll have a lab plan that you can use for other quickstarts and tutorials.

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Azure manage resources](./includes/lab-services-prerequisite-manage-resources.md)]

## Create a lab plan

In Azure Lab Services, a lab plan contains configuration and settings that apply to all the labs created from it.

Follow these steps to create a lab plan from the Azure portal:

[!INCLUDE [Create a lab plan](./includes/lab-services-tutorial-create-lab-plan.md)]

## Add a user to the Lab Creator role

[!INCLUDE [Add Lab Creator role](./includes/lab-services-add-lab-creator.md)]

## Clean up resources

[!INCLUDE [Clean up resources](./includes/lab-services-cleanup-resources.md)]

## Next step

You created an Azure Lab Services lab plan and granted permissions to create labs. The lab plan contains the common configuration settings for the labs.

You can now use this resource to create a lab or let lab creators create labs.

> [!div class="nextstepaction"]
> [Quickstart: Create a Windows-based lab](./quick-create-connect-lab.md)
