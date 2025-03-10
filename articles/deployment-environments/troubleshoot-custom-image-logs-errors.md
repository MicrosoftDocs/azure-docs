---
title: Troubleshooting Custom Image Deployment Errors
description: Learn how to troubleshoot and resolve errors encountered during custom image deployments in Azure Deployment Environments.
ms.service: azure-deployment-environments
ms.topic: troubleshooting-general
author: RoseHJM
ms.author: rosemalcolm
ms.date: 09/28/2024
---
# Troubleshooting Custom Image Deployment Errors

ADE stores error details for a failed deployment in the *$ADE_ERROR_LOG* file within the container. 

To troubleshoot a failed deployment:

1. Sign in to the [Developer Portal](https://aka.ms/devbox-portal).
1. Identify the environment that failed to deploy, and select **See details**.

    :::image type="content" source="./media/custom-image-logs-errors/failed-deployment-card.png" alt-text="Screenshot showing failed deployment error details, specifically an invalid name for a storage account." lightbox="./media/custom-image-logs-errors/failed-deployment-card-big.png":::

1. Review the error details in the **Error Details** section.

    :::image type="content" source="./media/custom-image-logs-errors/deployment-error-details.png" alt-text="Screenshot showing a failed deployment of an environment with the See Details button displayed." lightbox="./media/custom-image-logs-errors/deployment-error-details-big.png":::

Additionally, you can use the Azure CLI to view an environment's error details using the following command:
```bash
az devcenter dev environment show --environment-name {YOUR_ENVIRONMENT_NAME} --project {YOUR_PROJECT_NAME}
```

To view the operation logs for an environment deployment or deletion, use the Azure CLI to retrieve the latest operation for your environment, and then view the logs for that operation ID.

```bash
# Get list of operations on the environment, choose the latest operation
az devcenter dev environment list-operation --environment-name {YOUR_ENVIRONMENT_NAME} --project {YOUR_PROJECT_NAME}
# Using the latest operation ID, view the operation logs
az devcenter dev environment show-logs-by-operation --environment-name {YOUR_ENVIRONMENT_NAME} --project {YOUR_PROJECT_NAME} --operation-id {LATEST_OPERATION_ID}
```

## Related content

- [ADE CLI Custom Runner Image reference](https://aka.ms/deployment-environments/ade-cli-reference)