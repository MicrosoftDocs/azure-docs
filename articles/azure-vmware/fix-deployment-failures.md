---
title: Support for Azure VMware Solution deployment or provisioning failure
description: Get information from your Azure VMware Solution private cloud to file a service request for an Azure VMware Solution deployment or provisioning failure.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 10/24/2022
ms.custom: engagement-fy23
---

# Open a support request for an Azure VMware Solution deployment or provisioning failure

This article shows you how to open a [support request](https://rc.portal.azure.com/#create/Microsoft.Support) and provide key information for an Azure VMware Solution deployment or provisioning failure.

When you have a failure on your private cloud, you need to open a support request in the Azure portal. To open a support request, first get some key information in the Azure portal:

- Correlation ID
- Error messages
- Azure ExpressRoute circuit ID

## Get the correlation ID

When you create a private cloud or any resource in Azure, a correlation ID for the resource is automatically generated for the resource. Include the private cloud correlation ID in your support request to more quickly open and resolve the request.

In the Azure portal, you can get the correlation ID for a resource in two ways:

- **Overview** pane
- Deployment logs

### Get the correlation ID from the resource overview

Here's an example of the operation details of a failed private cloud deployment, with the correlation ID selected:

:::image type="content" source="media/fix-deployment-failures/failed-private-cloud-deployment.png" alt-text="Screenshot that shows a failed private cloud deployment with the correlation ID selected."lightbox="media/fix-deployment-failures/failed-private-cloud-deployment.png":::

To access deployment results in a private cloud **Overview** pane:

1. In the Azure portal, select your private cloud.

1. In the left menu, select **Overview**.

After a deployment is initiated, the results of the deployment are shown in the private cloud **Overview** pane.

Copy and save the private cloud deployment correlation ID to include in the service request.

### Get the correlation ID from the deployment log

You can get the correlation ID for a failed deployment by searching the deployment activity log located in the Azure portal.

To access the deployment log:

1. In the Azure portal, select your private cloud, and then select the notifications icon.

   :::image type="content" source="media/fix-deployment-failures/open-notifications.png" alt-text="Screenshot that shows the notifications icon in the Azure portal."lightbox="media/fix-deployment-failures/open-notifications.png":::

1. In the **Notifications** pane, select **More events in the activity log**:

    :::image type="content" source="media/fix-deployment-failures/more-events-in-activity-log.png" alt-text="Screenshot that shows the More events in the activity log link selected in the Notifications pane."lightbox="media/fix-deployment-failures/more-events-in-activity-log.png":::

1. To find the failed deployment and its correlation ID, search for the name of the resource or other information that you used to create the resource.

    The following example shows search results for a private cloud resource named pc03.

    :::image type="content" source="media/fix-deployment-failures/find-past-deployments.png" alt-text="Screenshot that shows search results for an example private cloud resource and the Create or update a PrivateCloud pane."lightbox="media/fix-deployment-failures/find-past-deployments.png":::

1. In the search results in the **Activity log** pane, select the operation name of the failed deployment.

1. In the **Create or update a PrivateCloud** pane, select the **JSON** tab, and then look for `correlationId` in the log that is shown. Copy the `correlationId` value to include it in your support request.

## Copy error messages

To help resolve your deployment issue, include any error messages that are shown in the Azure portal. Select a warning message to see a summary of errors:

:::image type="content" source="media/fix-deployment-failures/summary-of-errors.png" alt-text="Screenshot that shows error details on the Summary tab of the Errors pane, with the copy icon selected.":::

To copy the error message, select the copy icon. Save the copied message to include in your support request.

## Get the ExpressRoute ID (URI)

Perhaps you're trying to scale or peer an existing private cloud with the private cloud ExpressRoute circuit, and it fails. In that scenario, you need the ExpressRoute ID to include in your support request.

To copy the ExpressRoute ID:

1. In the Azure portal, select your private cloud.
1. In the left menu, under **Manage**, select **Connectivity**.
1. In the right pane, select the **ExpressRoute** tab.
1. Select the copy icon for **ExpressRoute ID** and save the value to use in your support request.

:::image type="content" source="media/expressroute-global-reach/expressroute-id.png" alt-text="Screenshot that shows the ExpressRoute ID to copy to the clipboard."lightbox="media/expressroute-global-reach/expressroute-id.png":::

## Pre-validation failures

If your private cloud pre-validations check failed (before deployment), a correlation ID won't have been generated. In this scenario, you can provide the following information in your support request:

- Error and failure messages. These messages can be helpful in many failures, for example, for quota-related issues. It's important to copy these messages and include them in the support request, as described in this article.
- Information you used to create the Azure VMware Solution private cloud, including:
  - Location
  - Resource group
  - Resource name

## Create your support request

For general information about creating a support request, see [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

To create a support request for an Azure VMware Solution deployment or provisioning failure:

1. In the Azure portal, select the **Help** icon, and then select **New support request**.

    :::image type="content" source="media/fix-deployment-failures/open-support-request.png" alt-text="Screenshot of the New support request pane in the Azure portal."lightbox="media/fix-deployment-failures/open-support-request.png":::

1. Enter or select the required information:

   1. On the **Basics** tab:

      1. For **Problem type**, select **Configuration and Setup Issues**.

      1. For **Problem subtype**, select **Provision a private cloud**.

   1. On the **Details** tab:

      1. Enter or select the required information.

      1. Paste your Correlation ID or ExpressRoute ID where this information is requested. If you don't see a specific text box for these values, paste them in the **Provide details about the issue** text box.

   1. Paste any error details, including the error or failure messages you copied, in the **Provide details about the issue** text box.

1. Review your entries, and then select **Create** to create your support request.
