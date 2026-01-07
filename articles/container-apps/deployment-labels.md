---
title: Deployment labels in Azure Container Apps
description: Learn how to use deployment labels to manage revisions and environments in Azure Container Apps
services: container-apps
author: craigshoemaker  
ms.author: cshoe
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 01/05/2026
zone_pivot_groups: azure-cli-or-portal
---

# Deployment labels in Azure Container Apps

Deployment labels help you assign meaningful names, such as dev, staging, or prod, to specific container revisions. When you apply these names, you streamline handling complex deployment scenarios and environment management.

By using deployment labels, you can:

- Assign clear, descriptive labels to revisions.
- Automatically assign new revisions to labels for routing and traffic management.
- Route traffic based on labels instead of changing revision names.
- Promote or demote revisions by reassigning labels.
- Roll back to previous revisions by using label history.

> [!IMPORTANT]
> Before you can use deployment labels, you need to follow the steps to first [enable deployment](?pivots=azure-portal#use-deployment-labels) labels in the portal for your container app.

## Key features

Deployment labels enable you to create sophisticated deployment strategies while maintaining control over your application lifecycle by using the following features:

- **Label assignment**: Create and assign meaningful labels to container revisions, making it easier to manage environments like dev, staging, and prod.

- **Traffic splitting & A/B testing**: Support for traffic splitting, blind rollback, and A/B testing enables gradual rollouts and testing of new features.

- **Staging releases & auto swap**: Automatic revision activation allows you to seamlessly create new revisions and assign them to new or existing labels to receive traffic. Any revisions no longer referenced by a label are shut down automatically.

::: zone pivot="azure-portal"

## Use deployment labels

By default deployment labels aren't available to your container app. To enable, deployment labels, follow these steps in the Azure portal:

1. Open your container app in the Azure portal.

1. From the menu, under the *Application* section, select **Revisions and replicas**.

1. Select **Deployment mode**.

1. Select the **Deployment labels** column.

1. Select **Apply**.

### Create a new label

Create new labels in the portal based on existing labels. By default, Container Apps creates your first label named *label-1*. When you create labels through the CLI or Bicep, you can associate them with any existing revision or a new revision.

1. Open your container app in the Azure portal.

1. From the menu, under the *Application* section, select **Labels**.

1. Select **New label**.

1. Select the existing label you want to base your new label on.

1. Enter the new label name in the text box.

1. Select **Duplicate**.

### Label history and rollbacks

You can view the full history of a label by using the following steps:

1. Open your container app in the Azure portal.

1. From the menu, under *Application*, select **Labels**.

1. Select **Show history** for the label you're interested in.

Use the *Show history* option for any label to:

- Review the label's revision history.
- Roll back to a previous revision by pointing the label to a different container revision.

::: zone-end

::: zone pivot="azure-cli"

## Use deployment labels

To enable deployment labels, follow these steps in the Azure CLI:

1. Open your terminal.

1. Create the following environment variables.

	```bash
	CONTAINER_APP_NAME="my-container-app"
	CONTAINER_APP_IMAGE="mcr.microsoft.com/k8se/quickstart:latest"
	LOCATION="centralus"
	RESOURCE_GROUP="my-container-apps-rg"
	ENVIRONMENT_NAME="my-container-apps-env"
	TARGET_LABEL="stage"
	```

1. Use the following command to create a new app and revision with label:

   ```bash
   az containerapp create \
   --name $CONTAINER_APP_NAME \
   --resource-group $RESOURCE_GROUP \
   --image $CONTAINER_APP_IMAGE \
   --environment $ENVIRONMENT_NAME \
   --location $LOCATION \
   --ingress external \
   --target-port 0 \
   --revisions-mode labels \
   --target-label $TARGET_LABEL
   ```

1. To create a new revision with a new or existing label, use the following command:

   ```bash
   az containerapp update \
   --name $CONTAINER_APP_NAME \
   --resource-group $RESOURCE_GROUP \
   --image $CONTAINER_APP_IMAGE \
   --target-label $TARGET_LABEL
   ```

1. To show label history, use the following command:

   ```bash
   az containerapp label-history show \
   --name $CONTAINER_APP_NAME \
   --resource-group $RESOURCE_GROUP \
   --label $TARGET_LABEL
   ```

1. To show label app traffic, use the following command:

   ```bash
   az containerapp ingress traffic show \
   --name $CONTAINER_APP_NAME \
   --resource-group $RESOURCE_GROUP \
   ```

1. To add a label to a revision, use the following commands:

   ```bash
   az containerapp revision label add \
   --name $CONTAINER_APP_NAME \
   --resource-group $RESOURCE_GROUP \
   --revision $REVISION_NAME \
   --label $TARGET_LABEL
   ```

1. To remove a label from a revision, use the following commands:

   ```bash
   az containerapp revision label remove \
   --name $CONTAINER_APP_NAME \
   --resource-group $RESOURCE_GROUP \
   --label $TARGET_LABEL
   ```

::: zone-end

## Supported scenarios

- **Blue-green deployments**: Easily manage blue-green deployments by labeling and switching between revisions. This approach provides a simple way to handle complete environment swaps.

- **A/B testing**: Direct a percentage of traffic to different revisions for feature testing. This practice allows you to validate new functionality with a subset of users before full deployment.

- **Staged rollouts**: Gradually increase traffic to a new revision by adjusting traffic percentages.

- **Environment isolation**: Use labels to maintain separate dev, staging, and prod environments. Each environment can be updated independently while maintaining a clear promotion path.

## Workflow example

Here's a typical workflow using deployment labels:

1. **Create initial labels**: Create labels such as "stage" and "production" pointing to the same revision initially.

1. **Update a label**: Select a label (for example, "stage") to update it with new containers, scaling, or volume settings.

1. **Test the changes**: With the new revision deployed, route a portion of traffic to the updated label.

1. **Promote changes**: When you're confident in the production revision, update the production label to point to the same revision.

1. **Monitor and rollback if needed**: If problems arise, use the label history to roll back to a previous version.

## Related content

[Revision labels](./revisions-manage.md#revision-labels)