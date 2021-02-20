---
title: Azure Functions Consumption plan hosting
description: Learn about how Azure Function Consumption plan hosting lets you run your code in an environment that scales dynamically, but you only pay for resources used during execution. 
ms.date: 8/31/2020
ms.topic: conceptual
# Customer intent: As a developer, I want to understand the benefits of using the Consumption plan so I can get the scalability benefits of Azure Functions without having to pay for resources I don't need.
---

# Azure Functions Consumption plan hosting

When you're using the Consumption plan, instances of the Azure Functions host are dynamically added and removed based on the number of incoming events. The Consumption plan is the fully <em>serverless</em> hosting option for Azure Functions.

## Benefits

The Consumption plan scales automatically, even during periods of high load. When running functions in a Consumption plan, you're charged for compute resources only when your functions are running. On a Consumption plan, a function execution times out after a configurable period of time.

For a comparison of the Consumption plan against the other plan and hosting types, see [function scale and hosting options](functions-scale.md).

## Billing

Billing is based on number of executions, execution time, and memory used. Usage is aggregated across all functions within a function app. For more information, see the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/).

To learn more about how to estimate costs when running in a Consumption plan, see [Understanding Consumption plan costs](functions-consumption-costs.md).

## Create a Consumption plan function app

When you create a function app in the Azure portal, the Consumption plan is the default. When using APIs to create you function app, you don't have to first create an App Service plan as you do with Premium and Dedicated plans.

Use the following links to learn how to create a serverless function app in a Consumption plan, either programmatically or in the Azure portal:

+ [Azure CLI](./scripts/functions-cli-create-serverless.md)
+ [Azure portal](./functions-get-started.md)
+ [Azure Resource Manager template](functions-create-first-function-resource-manager.md)

You can also create function apps in a Consumption plan when you publish a Functions project from [Visual Studio Code](./create-first-function-vs-code-csharp.md#publish-the-project-to-azure) or [Visual Studio](functions-create-your-first-function-visual-studio.md#publish-the-project-to-azure).

## Multiple apps in the same plan

Function apps in the same region can be assigned to the same Consumption plan. There's no downside or impact to having multiple apps running in the same Consumption plan. Assigning multiple apps to the same Consumption plan has no impact on resilience, scalability, or reliability of each app.

## Next steps

+ [Azure Functions hosting options](functions-scale.md)
+ [Event-driven scaling in Azure Functions](event-driven-scaling.md)
