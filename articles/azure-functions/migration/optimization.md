---
title: Post-migration optimization opportunities for Azure Functions
description: Learn about additional opportunities to optimize with Azure Functions
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025
ms.topic: conceptual
---

# Typical post-migration optimizations for Azure Functions

After you've migrated your Lambda to Azure Functions and your AWS resources are decommissioned, we recommend you explore additional features on Azure. These features can help you in future workload requirements or help close gaps in areas where your AWS Lambda solution was not yet meeting requirements.

> [!NOTE]
> **Content developer**: List features here that we know the service in Azure "does it better" -- The call to action should be that the service owner learns more about these unique features and decides if they will help close any deficiencies in their AWS Lambda implementation (things that were prohibitive to do in AWS) or could help with future requirements. This is the "Now that you're here on Azure, we recommend you use these diffierntiation feature/approachs.

We recommend that workloads coming from AWS Lambda take a look at the following additional functionality offered by Azure for serverless hosting.

| Feature   | Workload impact |
| :-------- | :-------------- |
| Feature 1 | Workload impact, with a link to learn more. |
| Feature n | Workload impact, with a link to learn more. |

## Optimization tooling

> [!NOTE]
> **Content developer**: Introduce service specific optimization tooling that we make available to our customers for this service.

### Use the Azure Well-Architected service guide

Assess your current Azure Function configuration against the recommendations available in the Azure Well-Architected service guide for Azure Functions. The Azure Functions service guide gives recommendations across reliability, security, cost optimization, operational excellence, and performance efficiency. Evaluate if your workload would benefit from any of these recommendations and build a plan to implement those improvements.

See more at, [Service guide Azure Functions](/azure/well-architected/service-guides/azure-functions-security)

### Use Azure Advisor

Review the recommendations for your Azure Functions deployment in Azure Advisor. You'll get recommendations across areas such as cost, security, reliability, opperational excellence, and performance. The recommendations for Azure Functions will be part of your Azure App Service recommendations. Evaluate if your workload would benefit from any of these recommendations and build a plan to implement those improvements, dismissing recommendations that are not apporporiate for your workload.

Learn more in the [Azure Advisor documentation](/azure/advisor/advisor-overview)

## Next step

> [!div class="nextstepaction"]
> [Service guide Azure Functions](/azure/well-architected/service-guides/azure-functions-security)
