---
title: Create an Azure Functions Premium plan in the portal
description: Learn how to use the Azure portal to create a function app that runs in the Premium plan.
ms.topic: how-to
ms.date: 10/30/2020
---

# Create a Premium plan function app in the Azure portal

Azure Functions offers a scalable Premium plan that provides virtual network connectivity, no cold start, and premium hardware. To learn more, see [Azure Functions Premium plan](functions-premium-plan.md). 

In this article, you learn how to use the Azure portal to create a function app in a Premium plan. 

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a function app

You must have a function app to host the execution of your functions. A function app lets you group functions as a logical unit for easier management, deployment, scaling, and sharing of resources.

[!INCLUDE [functions-premium-create](../../includes/functions-premium-create.md)]

At this point, you can create functions in the new function app. These functions can take advantage of the benefits of the [Premium plan](functions-premium-plan.md).

## Clean up resources

[!INCLUDE [Clean-up resources](../../includes/functions-quickstart-cleanup.md)]

## Next steps

> [!div class="nextstepaction"]
> [Add an HTTP triggered function](./functions-create-function-app-portal.md#create-function)
