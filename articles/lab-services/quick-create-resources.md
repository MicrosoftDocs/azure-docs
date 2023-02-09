---
title: Quickstart create lab plan resource
titleSuffix: Azure Lab Services
description: In this quickstart, you learn how to create a lab plan resource in the Azure portal. You need a lab plan to get started with Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: quickstart
ms.date: 02/09/2023
ms.custom: mode-portal
---

# Quickstart: Create lab resources you need to get started with Azure Lab Services

Azure Lab Services enables you to create labs, whose infrastructure is managed by Azure. In this quickstart, you create an Azure Lab Services lab plan in the Azure portal. You can then get started with creating labs by using the Azure Lab Services website, Microsoft Teams, or Canvas.

A lab plan is an Azure resource and serves as a collection of configurations and settings that apply to all the labs created from it. For example, lab plans specify the networking setup, the list of available VM images and VM sizes.

After you complete this quickstart, you'll have a lab plan that you can use for other tutorials.

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]

## Create a lab plan

In Azure Lab Services, a lab plan serves as a collection of configurations and settings that apply to all the labs created from it.

Follow these steps to create a lab plan from the Azure portal:

[!INCLUDE [Create a lab plan](./includes/lab-services-tutorial-create-lab-plan.md)]

## Clean up resources

[!INCLUDE [Clean up resources](./includes/lab-services-cleanup-resources.md)]

## Next steps

You now have an Azure Lab Services lab plan that contains the common configuration settings for labs.

Use this resource to learn more about Azure Lab Services and create labs.

> [!div class="nextstepaction"]
> [Quickstart: Create Windows-based lab](./quick-create-windows-lab.md)
