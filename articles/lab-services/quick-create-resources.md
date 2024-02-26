---
title: 'Quickstart: Create lab plan resource'
titleSuffix: Azure Lab Services
description: In this quickstart, you learn how to create a lab plan resource in the Azure portal to get started with Azure Lab Services. You then grant a user permissions to create labs.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: quickstart
ms.date: 02/09/2023
ms.custom: mode-portal
---

# Quickstart: Create resources you need to get started with Azure Lab Services

Azure Lab Services enables you to create labs, whose infrastructure is managed by Azure. In this quickstart, you create an Azure Lab Services lab plan in the Azure portal and grant a user permissions to create labs. You can then get started with creating labs by using the Azure Lab Services website, Microsoft Teams, or Canvas.

A lab plan is an Azure resource and serves as a collection of configurations and settings that apply to all the labs created from it. For example, lab plans specify the networking setup, the list of available VM images and VM sizes.

:::image type="content" source="./media/quick-create-resources/lab-services-process-lab-plan.png" alt-text="Diagram that shows the steps for creating a lab with Azure Lab Services, highlighting Create a lab plan.":::

After you complete this quickstart, you'll have a lab plan that you can use for other tutorials.

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Azure manage resources](./includes/lab-services-prerequisite-manage-resources.md)]

## Create a lab plan

In Azure Lab Services, a lab plan serves as a collection of configurations and settings that apply to all the labs created from it.

Follow these steps to create a lab plan from the Azure portal:

[!INCLUDE [Create a lab plan](./includes/lab-services-tutorial-create-lab-plan.md)]

## Add a user to the Lab Creator role

[!INCLUDE [Add Lab Creator role](./includes/lab-services-add-lab-creator.md)]

## Clean up resources

[!INCLUDE [Clean up resources](./includes/lab-services-cleanup-resources.md)]

## Next steps

You've successfully created an Azure Lab Services lab plan and granted a user permissions to create labs. The lab plan contains the common configuration settings for the labs.

You can now use this resource to create a lab or let lab creators do this.

> [!div class="nextstepaction"]
> [Quickstart: Create a Windows-based lab](./quick-create-connect-lab.md)
