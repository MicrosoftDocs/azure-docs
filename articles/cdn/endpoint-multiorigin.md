---
title: Azure CDN endpoint multi-origin
description: Get started with Azure CDN endpoint multiple origins.
services: cdn
author: asudbring
manager: KumudD
ms.service: azure-cdn
ms.topic: how-to
ms.date: 8/20/2020
ms.author: allensu
---

# Azure CDN endpoint multi-origin

With the support of multiple origins, you can establish global redundancy and eliminate downtime by choosing multiple origins within an Azure CDN endpoint. The redundancy provided by multi-origin spreads risk by probing the health of each origin and failing over if necessary. To set up multi-origin, setup one or more origin groups. Each origin group is a collection of one or more origins that can take similar workloads.

> [!NOTE]
> Currently this feature is only available from Azure CDN from Microsoft. 

## Create the origin group

1. Sign in to the [Azure portal](https://portal.azure.com)

2. Select your Azure CDN profile and then select the endpoint to be configured for multi-origin.

3. Select **Origin** under **Settings** in the endpoint configuration:

    :::image type="content" source="./media/endpoint-multiorigin/endpoint-multiorigin-1.png" alt-text="Azure CDN multi-origin" border="true":::

4. To enable multi-origin, you need at least one origin group. Select **Create Origin Group**:

    :::image type="content" source="./media/endpoint-multiorigin/endpoint-multiorigin-2.png" alt-text="Azure CDN multi-origin" border="true":::

5. In the **Add Origin Group** configuration, enter or select the following information:

   | Setting           | Value                                                                 |
   |-------------------|-----------------------------------------------------------------------|
   | Origin group name | Enter a name for your origin group.                                   |
   | Probe path        | The path in the origin that is used to determine the health. |
   | Probe interval    | Select a probe interval of 1, 2, or 4 minutes.                        |
   | Probe protocol    | Select **HTTP** or **HTTPS**.                                         |
   | Probe method      | Select **Head** or **Get**.                                           |
    
   :::image type="content" source="./media/endpoint-multiorigin/endpoint-multiorigin-3.png" alt-text="Azure CDN multi-origin" border="true":::

6. Select **Add**.

7. To choose the default origin group, select **Configure Origin group**:

    :::image type="content" source="./media/endpoint-multiorigin/endpoint-multiorigin-4.png" alt-text="Azure CDN multi-origin" border="true":::

8. Select your origin group in the pull-down box and select **OK**.

## Add multiple origins

1. In the origin settings for your endpoint, select **+ Create Origin**:

    :::image type="content" source="./media/endpoint-multiorigin/endpoint-multiorigin-5.png" alt-text="Azure CDN multi-origin" border="true":::

2. Enter or select the following information in the **Add Origin** configuration:

   | Setting           | Value                                                                 |
   |-------------------|-----------------------------------------------------------------------|
   | Origin Type | Select **Storage**, **Cloud Service**, **Web App**, or **Custom origin**.                                   |
   | Origin hostname        | Select or enter your origin hostname.  The drop-down lists all available origins of the type you specified in the previous setting. If you selected **Custom origin** as your origin type, enter the domain of your customer origin server. |
   | Origin host header    | Enter the host header you want Azure CDN to send with each request, or leave the default.                        |
   | HTTP port   | Enter the HTTP port.                                         |
   | HTTPS port     | Enter the HTTPS port.                                           |
   | Priority    | Enter a number between 1 and 5.       |
   | Weight      | Enter a number between 1 and 1000.   |

    > [!NOTE]
    > When an origin is created within an origin group, it must be accorded a priority and weight. If an origin group has only one origin, then the default priority and weight is set as 1. Traffic is routed to the highest priority origins if the origin is healthy. If an origin is determined to be unhealthy then the connections are diverted to another origin in the order of priority. If two origins have the same priority, then traffic is distributed as per weight specified for the origin 

    :::image type="content" source="./media/endpoint-multiorigin/endpoint-multiorigin-6.png" alt-text="Azure CDN multi-origin" border="true":::

3. Select **Add**.

4. Select **Configure origin** to set the origin path for all origins:

    :::image type="content" source="./media/endpoint-multiorigin/endpoint-multiorigin-7.png" alt-text="Azure CDN multi-origin" border="true":::

5. Select **OK**.

## Configure origins and origin group settings

Once you have several origins and an origin group, you can add or remove the origins into different groups. Origins within the same group should serve similar workloads. Traffic will be distributed into these origins based on their healthy status, priority, and weight value. 

1. In the origin settings of the Azure CDN endpoint, select **Configure Origin group**:

    :::image type="content" source="./media/endpoint-multiorigin/endpoint-multiorigin-8.png" alt-text="Azure CDN multi-origin" border="true":::

2. Select the origin group you want to configure in the pull-down box, and select **OK**.

3. In **Update origin group**, select **+ Add Origin**:

    :::image type="content" source="./media/endpoint-multiorigin/endpoint-multiorigin-9.png" alt-text="Azure CDN multi-origin" border="true":::

4. Select the origin to be added to the group in the pull-down box and select **OK**.

5. Verify the origin has been added to the group, then select **Save**:

    :::image type="content" source="./media/endpoint-multiorigin/endpoint-multiorigin-10.png" alt-text="Azure CDN multi-origin" border="true":::

## Remove origin from origin group

1. In the origin settings of the Azure CDN endpoint, select **Configure Origin group**:

    :::image type="content" source="./media/endpoint-multiorigin/endpoint-multiorigin-8.png" alt-text="Azure CDN multi-origin" border="true":::

2. Select the origin group you want to configure in the pull-down box, and select **OK**.

3. To remove an origin from the origin group, select the trash can icon next to the origin and select **Save**:

    :::image type="content" source="./media/endpoint-multiorigin/endpoint-multiorigin-11.png" alt-text="Azure CDN multi-origin" border="true":::

## Next Steps
In this article, you enabled Azure CDN endpoint multi-origin.

For more information on Azure CDN and the other Azure services mentioned in this article, see:

* [Azure CDN](./cdn-overview.md)
* [Compare Azure CDN product feature](./cdn-features.md)
