---
title: Deployment labels in Azure Container Apps
description: Learn how to use deployment labels to manage revisions and environments in Azure Container Apps
services: container-apps
author: craigshoemaker  
ms.author: cshoe
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 10/27/2025
zone_pivot_groups: azure-cli-or-portal
---

# Deployment labels in Azure Container Apps

Deployment labels allow you to assign meaningful names (such as dev, staging, prod) to specific container revisions. Applying these names gives you a streamlined process for handling complex deployment scenarios and environment management.

With deployment labels, you can:

- Assign clear, descriptive labels to revisions
- Have new revisions automatically assigned to labels for routing and traffic management
- Route traffic based on labels instead of changing revision names
- Promote or demote revisions by reassigning labels
- Roll back to previous revisions using label history

## Key features

Deployment labels enable you to create sophisticated deployment strategies while maintaining control over your application lifecycle with the following features:

- **Label assignment**: Create and assign meaningful labels to container revisions, making it easier to manage environments like dev, staging, and prod.

- **Traffic splitting & A/B testing**: Support for traffic splitting, blind rollback, and A/B testing enables gradual rollouts and testing of new features.

- **Staging releases & auto swap**: Automatic revision activation allows you to seamlessly create new revisions and have them assigned to new or existing labels and receive traffic. Any revisions no longer referenced by a label will be shut down automatically.

::: zone pivot="azure-portal"

## Use deployment labels

To enable deployment labels, follow these steps in the Azure portal:

1. Open your container app in the Azure portal.

1. From the menu, under the *Application* section, select **Revisions and replicas**.

1. Select **Deployment mode**.

1. Select the **Deployment labels** column.

1. Select **Apply**.

### Create a new label 

New labels are based on existing labels when created in the portal. By default Container Apps creates your first label for you named *label-1*. When labels are created via CLI or Bicep, you can associate them with any existing revision or a new revision. 

1. Open your container app in the Azure portal.

1. From the menu, under the *Application* section, select **Labels**.

1. Select **New label**.

1. Select the existing label you want to base your new label on.

1. Enter the new label name in the text box.

1. Select **Duplicate**.

### Label history and rollbacks

You can view the full history of a label using the following steps:

1. Open your container app in the Azure portal.

1. From the menu, under *Application*, select **Labels**.

1. Select **Show history** associated with the label you're interested in.

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

1. **Test the changes**: With the new revision deployed, you can route a portion of traffic to the updated label.

1. **Promote changes**: Once you feel confident in the production revision, you can update the production label to point to the same revision

1. **Monitor and rollback if needed**: If issues arise, use the label history to roll back to a previous version.

## Related content

[Revision labels](./revisions-manage.md#revision-labels)