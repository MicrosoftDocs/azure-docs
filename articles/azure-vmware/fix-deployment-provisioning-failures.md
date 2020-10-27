---
title: Get help with Azure VMware Solution deployment or provisioning failures
description: How to get the information you need from your Azure VMware Solution private cloud to file a service request for Azure VMware Solution deployment or provisioning failures.
ms.topic: how-to
ms.date: 06/09/2020
---

# Get help with Azure VMware Solution deployment or provisioning failures

This article helps you with Azure VMware Solution deployment and provisioning failures. When you have failures on your private cloud, you'll need to open a [support request](https://rc.portal.azure.com/#create/Microsoft.Support) (SR) in the Azure portal. 

First, though, you'll need to collect some key information in the Azure portal:

- Correlation ID
- ExpressRoute circuit ID

## Collect the correlation ID
 
A correlation ID gets generated when you create a private cloud or any resource in Azure. Each Azure Resource Manager deployment also generates a correlation ID. This ID enables faster SR creation and resolution. 
 
Here is an example of the output from a failed private cloud deployment, with the correlation ID highlighted.

:::image type="content" source="media/fix-deployment-provisioning-failures/failed-private-cloud-deployment.png" alt-text="Failed private cloud deployment with correlation ID.":::

Copy and save this correlation ID to include in the service request. For details, see [Create your support request](#create-your-support-request) at the end of this article.

If the failure occurs in the pre-validation stages, no correlation ID gets generated. In this case, you can provide the information you used when creating the Azure VMware Solution private cloud, including:

- Location
- Resource group
- Resource name
 
### Collect a summary of errors

The details of any errors can also help resolve your issue. From the preceding screen, select the warning message to see a summary of errors.
 
 :::image type="content" source="media/fix-deployment-provisioning-failures/summary-of-errors.png" alt-text="Summary of errors.":::

Again, copy and save this summary to include in the SR.
 
### Retrieve past deployments

You can retrieve past deployments, including failed ones, by searching in the deployment activity log accessed by selecting the notifications icon.

:::image type="content" source="media/fix-deployment-provisioning-failures/open-notifications.png" alt-text="Open notifications.":::

In Notifications, select **More events in the activity log**.

:::image type="content" source="media/fix-deployment-provisioning-failures/more-events-in-activity-log.png" alt-text="Link: More events in the activity log.":::

Then search for the name of the resource or other information used to create the resource to find the failed deployment and its correlation ID. The following example shows search results on a private cloud resource (pc03).
 
:::image type="content" source="media/fix-deployment-provisioning-failures/find-past-deployments.png" alt-text="Find past failed Azure VMware Solution deployments.":::
 
Selecting the operation name of the failed deployment opens a window with details. Select the JSON tab and look for correlationId. Copy and include in the SR. 
 
## Collect the ExpressRoute ID (URI)
 
Perhaps you're trying to scale or peer an existing private cloud with the private cloud ExpressRoute circuit, and it fails. In that case, you'll need the ExpressRoute ID. 

In the Azure portal, select **Connectivity > ExpressRoute** and copy the **ExpressRoute ID** to your clipboard.
 
:::image type="content" source="media/fix-deployment-provisioning-failures/expressroute-id.png" alt-text="Copy the ExpressRoute ID to the clipboard."::: 
 
> [!NOTE]
> On occasion, pre-validation checks may fail before deployment, and the only available information will be the error and failure messages. These can be helpful in many failures, for instance, quota-related issues, and it's important to include these messages in the support request. To collect these, see the earlier section, [Collect a summary of errors](#collect-a-summary-of-errors).

## Create your support request

For general guidance in creating your support request, see [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md). 

Here is specific guidance in creating an SR for Azure VMware Solution deployment or provisioning failures.

1. Select the **Help** icon and then **+ New support request**.

    :::image type="content" source="media/fix-deployment-provisioning-failures/open-sr-on-avs.png" alt-text="Collect an ExpressRoute ID for your SR.":::

2. Fill in all required fields, and on the **Basics** tab:

    - For **Problem type**, select **Configuration and Setup Issues**.

    - For **Problem subtype**, select **Provision a private cloud**.

3. On the **Details** tab:

    - Fill in all required fields.

    - Paste your Correlation ID or ExpressRoute ID into the specific fields provided. If you don't see a specific field, you can paste them into the text box under **Provide details about the issue.**

    - Paste any error details, including the summary of errors you copied, into the text box under **Provide details about the issue.**

4. Review and select **Create** to create your SR.
