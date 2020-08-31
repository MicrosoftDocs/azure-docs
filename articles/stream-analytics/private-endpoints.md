---
title: Manage private endpoints
description: Learn how to managed private endpoints in Stream Analytics cluster
author: sidramadoss
ms.author: sidram
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: overview
ms.custom: mvc
ms.date: 09/22/2020
---

# Manage private endpoints in Stream Analytics cluster
<Token>**APPLIES TO:** ![yes](./media/applies-to/yes.png)Stream Analytics cluster</Token> 

Stream Analytics allows you to connect your ASA jobs to your input and output resources that are behind a firewall or a Azure Virtual Network (VNet). This is a 2-step process:
1. Create a private endpoint for a resource (e.g., Azure Event Hub, Azure SQL Database) in your ASA Cluster.
2. Goto your resource (e.g., Azure Event Hub, Azure SQL Database) and approve the private endpoint connection you created in the previous step.

After approving the connection, any job running in your ASA cluster will be able to access the resource through the private endpoint.

## Create private endpoint in Stream Analytics cluster
1. Sign in to the Azure portal.
2. Locate and select your Stream Analytics cluster.
3. Under **Settings**, select **Private endpoints**.
4. Select **Add private endpoint** and choose the resource you want to access securely through a private endpoint.
   |Setting|Value|
    |---|---|
    |Name|Enter any name for your private endpoint. If this name is taken, create a unique one.|
    |Connection method|Select **Connect to an Azure resource in my directory**.<br><br>You can then choose one of your resources to securely connect to using the private endpoint. Or you can connect to someone else's resource by using a resource ID or alias that they've shared with you.|
    |Subscription|Select your subscription.|
    |Resource type|Choose the [resource type that maps to your resource](https://docs.microsoft.com/azure/private-link/private-endpoint-overview#private-link-resource).|
    |Resource|Select the resource you want to connect to using private endpoint.|
    |Target sub-resource|The type of sub-resource for the resource selected above that your private endpoint will be able to access.|
    ![image of private endpoint create experience](./media/private-endpoints/create-private-endpoint.png)
5. You have now created a private endpoint in your ASA cluster. The next step is to approve this connection from the target resource side. For example, if you created a private endpoint to a Azure SQL DB instance in the previous step, you should go to this SQL DB instance and see a pending connection that should be approved. Note that it might take a few minutes for connection request to show up. 
    ![approve private endpoint](./media/private-endpoints/approve-private-endpoint.png)
6. You can go back to you ASA cluster and see the state change from **Pending customer approval** to **Pending DNS Setup** to **Setup complete** within couple of minutes.

## Delete private endpoint in Stream Analytics cluster
1. Sign in to the Azure portal.
2. Locate and select your Stream Analytics cluster.
3. Under **Settings**, select **Private endpoints**.
4. Choose the private endpoint you want to delete.
   ![delete private endpoint](./media/private-endpoints/delete-private-endpoint.png)

## Next steps

You now have an overview of managing private endpoints in Azure Stream Analytics cluster. Next, you can learn how to scale your clusters and run jobs in your cluster:

* [Scaling Stream Analytics cluster](stream-analytics-scale-cluster.md).
* [Managing Stream Analytics jobs in a Stream Analytics cluster](stream-analytics-manage-jobs-cluster.md).
* [Create a Stream Analytics job](stream-analytics-quick-create-portal.md).