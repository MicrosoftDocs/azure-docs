---
title: Monitor the health of Azure Content Delivery Network resources| Microsoft Docs
description: Learn how to monitor the health of your Azure Content Delivery Network resources using Azure Resource Health.
services: cdn
author: duongau
manager: kumudd
ms.assetid: bf23bd89-35b2-4aca-ac7f-68ee02953f31
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/20/2024
ms.author: duau
---

# Monitor the health of Azure Content Delivery Network resources

Azure Content Delivery Network Resource health is a subset of [Azure resource health](../service-health/resource-health-overview.md). You can use Azure resource health to monitor the health of Content Delivery Network resources and receive actionable guidance to troubleshoot problems.

>[!IMPORTANT]
> Azure Content Delivery Network resource health only currently accounts for the health of global content delivery networking delivery and API capabilities. Azure Content Delivery Network resource health does not verify individual Content Delivery Network endpoints.
>
> The signals that feed Azure Content Delivery Network resource health might be up to 15 minutes delayed.

## How to find Azure Content Delivery Network resource health

1. In the [Azure portal](https://portal.azure.com), browse to your Content Delivery Network profile.

2. Select the **Settings** button.

    ![Settings button](./media/cdn-resource-health/cdn-profile-settings.png)

3. Under *Support + troubleshooting*, select **Resource health**.

    ![Screenshot of Content Delivery Network resource health.](./media/cdn-resource-health/cdn-resource-health3.png)

>[!TIP]
> You can also find content delivery network resources listed in the *Resource health* tile in the *Help + support* blade. You can quickly get to *Help + support* by clicking the circled **?** in the upper right corner of the portal.
>
> ![Help + support](./media/cdn-resource-health/cdn-help-support.png)

## Azure Content Delivery Network-specific messages

Statuses related to Azure Content Delivery Network resource health can be found in the following table:

|Message | Recommended Action |
|---|---|
|You might have stopped, removed, or misconfigured one or more of your Content Delivery Network endpoints | You might have stopped, removed, or misconfigured one or more of your Content Delivery Network endpoints.|
|We're sorry, the Content Delivery Network management service is currently unavailable | Check back here for status updates; If your problem persists after the expected resolution time, contact support.|
|We're sorry, your Content Delivery Network endpoints might be affected by ongoing issues with some of our Content Delivery Network providers | Check back here for status updates; Use the Troubleshoot tool to learn how to test your origin and Content Delivery Network endpoint; If your problem persists after the expected resolution time, contact support. |
|We're sorry, Content Delivery Network endpoint configuration changes are experiencing propagation delays | Check back here for status updates; If your configuration changes aren't fully propagated in the expected time, contact support.|
|We're sorry, we're experiencing issues loading the supplemental portal | Check back here for status updates; If your problem persists after the expected resolution time, contact support.|
We're sorry, we're experiencing issues with some of our Content Delivery Network providers | Check back here for status updates; If your problem persists after the expected resolution time, contact support. |

## Next steps

- [Read an overview of Azure resource health](../service-health/resource-health-overview.md)
- [Troubleshoot issues with Content Delivery Network compression](./cdn-troubleshoot-compression.md)
- [Troubleshoot issues with 404 errors](./cdn-troubleshoot-endpoint.md)
