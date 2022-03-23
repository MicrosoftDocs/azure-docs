---
title: How to configure origins - Azure Front Door
description: This article shows how to configure origins in an origin group to use with your Azure Front Door profile.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 03/22/2022
ms.author: duau
---

# How to configure an origin for Azure Front Door

This article will show you how to create an Azure Front Door origin in an existing origin group. The origin group can be then associated with a route to determine how traffic will reach your origins.

> [!NOTE]
> An *Origin* and a *origin group* in this article refers to the backend and backend pool of the Azure Front Door (classic) configuration.
>

## Prerequisites

Before you can create an Azure Front Door origin, you must have an Azure Front Door Standard or Premium tier profile. To create an Azure Front Door profile, see [create a Azure Front Door](create-front-door-portal.md).

## Create a new origin group

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Front Door profile.

1. Select **Origin groups** and then select **+ Add** to create a new origin group.
   
    :::image type="content" source="./media/how-to-configure-origin/select-origin-group.png" alt-text="Screenshot of origin groups landing page.":::

1. On the **Add an origin group** page, enter a unique **Name** for the new origin group. Then select **+ Add an Origin** to add a new origin.

    :::image type="content" source="./media/how-to-configure-origin/add-origin-group.png" alt-text="Screenshot of add an origin group page.":::

## Add an origin

1. On the **Add an origin** page, enter, or select the values based on your requirements:

    :::image type="content" source="./media/how-to-configure-origin/add-origin.png" alt-text="Screenshot of add an origin page.":::
  
    | Setting | Value |
    | --- | --- |
    | Name | Enter a unique name for the new Azure Front Door origin. |   
    | Origin Type | The type of resource you want to add. Azure Front Door Standard and Premium tier supports autodiscovery of your application origin such as Azure App services, Azure Cloud service, and Azure Storage. If you want a different origin type in Azure or a non-Azure backend, you can select **Custom host**. |
    | Host Name  | If you didn't select **Custom host** as origin host type, then select your backend origin host name in the dropdown. |
    | Origin host header | Enter the host header value being sent to the backend for each request. For more information, see [origin host header](origin.md#origin-host-header). |
    | Certificate subject name validation | During the Azure Front Door and origin TLS connection, Azure Front Door will validate if the request host name matches the host name in the certificate provided by the origin. For more information, see [End-to-end TLS](end-to-end-tls.md). |
    | HTTP Port | Enter the value for the port that the origin supports for HTTP protocol. |
    | HTTPS Port | Enter the value for the port that the origin supports for HTTPS protocol. |
    | Priority | Assign a priority value to this origin when you want to use a primary service origin for all traffic. This set up will provide backups if the primary or another backup origin is unavailable. For more information, see [Priority](routing-methods.md#priority). |
    | Weight | Assign a weight value to this origin to distribute traffic across a set of origins, either evenly or according to weight coefficients. For more information, see [Weights](routing-methods.md#weighted). |
    | Private link | You can enable the private link service to secure connectivity to your origin. Supported origin types are Azure Blobs, App services, Internal Load Balancers. |
    | Status | Select this option to enable the origin. |

    > [!IMPORTANT]
    > During configuration, the Azure portal doesn't validate if the origin is accessible from Azure Front Door environments. You need to verify that Azure Front Door can reach your origin.
    >

1. Select **Add** once you have completed the origin settings. The origin should now appear in the origin group. 

1. Configure the rest of the origin group settings. You can update *Health probes* and *Load balancing* settings to meet your requirements. 

    > [!NOTE]
    > * You can configure session affinity to ensure requests from the same end user gets directed to the same origin. For more information, see [session affinity](routing-methods.md#affinity).
    > * The health probe path is **case sensitive**.
    >
  
    :::image type="content" source="./media/how-to-configure-origin/save-origin-group.png" alt-text="Screenshot of a configured origin group.":::

1. Select **Add** to save the origin group configuration. The origin group now should appear on the origin group page.

    :::image type="content" source="./media/how-to-configure-origin/origin-group-list.png" alt-text="Screenshot of origin group in origin groups list.":::

## Origin response timeout

1. Origin response timeout can be found on the **Overview** page of your Azure Front Door profile.

    :::image type="content" source="./media/how-to-configure-origin/origin-response-timeout.png" alt-text="Screenshot of origin response timeout button from the overview page.":::

    > [!IMPORTANT]
    > This timeout value is applied to all endpoints in the Azure Front Door profile.
    >

1. The value of the response timeout must be between 16 and 240 seconds.

    :::image type="content" source="./media/how-to-configure-origin/origin-response-timeout-box.png" alt-text="Screenshot of origin response timeout field.":::

## Clean up resources

To delete an origin group when you no longer needed it, select the **...** and then select **Delete** from the drop-down.

:::image type="content" source="./media/how-to-configure-origin/delete-origin-group.png" alt-text="Screenshot of how to delete an origin group.":::

To remove an origin when you no longer need it, select the **...** and then select **Delete** from the drop-down. 

:::image type="content" source="./media/how-to-create-origin/delete-origin.png" alt-text="Screenshot of how to delete an origin.":::

## Next steps

To learn about custom domains, see [adding a custom domain](standard-premium/how-to-add-custom-domain.md) to your Azure Front Door endpoint.
