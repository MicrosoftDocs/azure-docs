---
title: Create an Event Hubs Dedicated cluster using the Azure portal
description: In this quickstart, you learn how to create an Azure Event Hubs cluster using Azure portal.
ms.topic: quickstart
ms.date: 02/07/2023
ms.custom: mode-ui
---

# Quickstart: Create a Dedicated Azure Event Hubs cluster using Azure portal 
Event Hubs clusters offer **single-tenant deployments** for customers with the most demanding streaming needs. This offering has a guaranteed **99.99%** SLA, which is available only in our Dedicated pricing tier. An [Event Hubs cluster](event-hubs-dedicated-overview.md) can ingress millions of events per second with guaranteed capacity and subsecond latency. Namespaces and event hubs created within a cluster include all features of the premium offering and more, but without any ingress limits. The Dedicated offering also includes the popular [Event Hubs Capture](event-hubs-capture-overview.md) feature at no additional cost, allowing you to automatically batch and log data streams to [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md) or [Azure Data Lake Storage Gen 1](../data-lake-store/data-lake-store-overview.md).

Dedicated clusters are provisioned and billed by **capacity units (CUs)**, a pre-allocated amount of CPU and memory resources. You can purchase up to 10 CUs for a cluster in the Azure portal. If you need a cluster larger than 10 CU, you can submit an Azure support request to scale up your cluster after its creation. In this quickstart, we'll walk you through creating a 1 CU Event Hubs cluster through the Azure portal.

> [!NOTE]
> - The Dedicated tier isn't available in all regions. Try to create a Dedicated cluster in the Azure portal and see supported regions in the **Location** drop-down list on the **Create Event Hubs Cluster** page.
> - This [Azure Portal](https://aka.ms/eventhubsclusterquickstart) self-serve experience is currently in **preview**. If you have any questions about the Dedicated offering, reach out to the [Event Hubs team](mailto:askeventhubs@microsoft.com).


## Prerequisites
To complete this quickstart, make sure that you have:

- An Azure account. If you don't have one, [purchase an account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/) before you begin. This feature isn't supported with a free Azure account. 
- [Visual Studio](https://visualstudio.microsoft.com/vs/) 2017 Update 3 (version 15.3, 26730.01) or later.
- [.NET Standard SDK](https://dotnet.microsoft.com/download), version 2.0 or later.
- [Created a resource group](../event-hubs/event-hubs-create.md#create-a-resource-group).

## Create an Event Hubs Dedicated Cluster
An Event Hubs cluster provides a unique scoping container in which you can create one or more namespaces. 

> [!WARNING]
> You won't be able to delete the cluster for at least 4 hours after you create it. Therefore, you will be charged for a minimum 4 hours of usage of the cluster. For more information on pricing, see [Event Hubs - Pricing](https://azure.microsoft.com/pricing/details/event-hubs/). 

To create a cluster in your resource group using the Azure portal, complete the following steps:

1. Follow [this link](https://aka.ms/eventhubsclusterquickstart) to create a cluster on Azure portal. Conversely, select **All services** from the left navigation pane, then type in **Event Hubs Clusters** in the search bar and select **Event Hubs Clusters** from the list of results.
1. On the **Event Hubs Clusters** page, select **+ Create** on the toolbar. 
1. On the **Create Cluster** page, configure the following settings:
    1. Enter a **name for the cluster**. The system immediately checks to see if the name is available.
    2. Select the **subscription** in which you want to create the cluster.
    3. Select the **resource group** in which you want to create the cluster.
    1. Notice that the **Support Scaling** option is set to **Enabled**. 
    1. Select a **location** for the cluster. If your preferred region is grayed out or it's temporarily out of capacity. Submit a [support request](#submit-a-support-request) to the Event Hubs team for further assistance.
    1. For **Capacity units**, move the slider to set the number or CUs. The minimum value is 1 and the maximum value is 10. 
    1. Select the **Next: Tags** button at the bottom of the page. You may have to wait a few minutes for the system to fully provision the resources.

        :::image type="content" source="./media/event-hubs-dedicated-cluster-create-portal/create-event-hubs-clusters-basics-page.png" alt-text="Image showing the Create Event Hubs Cluster - Basics page.":::
3. On the **Tags** page, configure the following:
    1. Enter a **name** and a **value** for the tag you want to add. This step is **optional**.  
    2. Select the **Review + Create** button.
    
        > [!IMPORTANT]
        > You won't be able to delete the cluster for at least 4 hours after you create it. Therefore, you will be charged for a minimum 4 hours of usage of the cluster. For more information on pricing, see [Event Hubs - Pricing](https://azure.microsoft.com/pricing/details/event-hubs/).   
1. On the **Review + Create** page, review the details, and select **Create**. 

    :::image type="content" source="./media/event-hubs-dedicated-cluster-create-portal/create-event-hubs-clusters-review-create-page.png" alt-text="Image showing the Create Event Hubs Cluster page - Review + Create page.":::
5. After the creation is successful, select **Go to resource** to navigate to the home page for your Event Hubs cluster. 

## Create a namespace and event hub within a cluster

1. To create a namespace within a cluster, on the **Event Hubs Cluster** page for your cluster, select **+Namespace** from the top menu.

    :::image type="content" source="./media/event-hubs-dedicated-cluster-create-portal/cluster-management-page-add-namespace-button.png" alt-text="Image showing the Cluster management page - add namespace button.":::
2. On the **Create a namespace** page, do the following steps:
    1. Enter a **name for the namespace**.  The system checks to see if the name is available.
    2. The namespace inherits the following properties:
        1. Subscription ID
        2. Resource Group
        3. Location
        4. Cluster Name
    3. Select **Create** to create the namespace. Now you can manage your cluster.  

        :::image type="content" source="./media/event-hubs-dedicated-cluster-create-portal/create-namespace-cluster-page.png" alt-text="Image showing the Create namespace in the cluster page.":::
3. Once your namespace is created, you can [create an event hub](event-hubs-create.md#create-an-event-hub) as you would normally create one within a namespace. 

## Scale a Dedicated cluster

For clusters created with the **Support Scaling** option set, use the following steps to scale out or scale in your cluster. 

1. On the **Event Hubs Cluster** page for your Dedicated cluster, select **Scale** on the left menu.

    :::image type="content" source="./media/event-hubs-dedicated-cluster-create-portal/scale-page.png" alt-text="Screenshot showing the Scale tab of the Event Hubs Cluster page.":::
1. Use the slider to increase (scale out) or decrease (scale in) capacity units assigned to the cluster. 
1. Then, select **Save** on the command bar. 

    The **Scale** tab is available only for the Event Hubs clusters created with the **Support scaling** option checked. You don't see the **Scale** tab for clusters that were created before this feature was released or for the clusters you created without selecting the **Support scaling** option. If you wish to change the size of a cluster that you can't scale yourself, or if your preferred region isn't available, submit a support request by using the following steps. 

### Submit a support request

1. In [Azure portal](https://portal.azure.com), select **Help + support** from the left menu.
2. Select **Create a support request** on the toolbar.
3. On the support page, follow these steps:
    1. For **Issue Type**, select **Technical** from the drop-down list.
    2. For **Subscription**, select your subscription.
    3. For **Service**, select **My services**, and then select **Event Hubs**.
    4. For **Resource**, select your cluster if it exists already, otherwise select **General Question/Resource Not Available**.
    5. For **Problem type**, select **Quota or Configuration changes**.
    6. For **Problem subtype**, select one of the following values from the drop-down list:
        1. Select **Dedicated Cluster SKU requests** to request for the feature to be supported in your region.
        2. Select **Scale up or down a Dedicated Cluster** if you want to scale up or scale down your Dedicated cluster. 
    7. For **Subject**, describe the issue.

        ![Support ticket page](./media/event-hubs-dedicated-cluster-create-portal/support-ticket.png)

 ## Delete a Dedicated cluster
 
1. To delete the cluster, select **Delete** from the toolbar on the **Event Hubs Cluster** page for your cluster. 

    > [!IMPORTANT]
    > You won't be able to delete the cluster for at least 4 hours after you create it. Therefore, you will be charged for a minimum 4 hours of usage of the cluster. For more information on pricing, see [Event Hubs - Pricing](https://azure.microsoft.com/pricing/details/event-hubs/).  

    :::image type="content" source="./media/event-hubs-dedicated-cluster-create-portal/delete-menu.png" alt-text="Screenshot showing the Delete button on the Event Hubs Cluster page.":::   
1. A message will appear confirming your wish to delete the cluster.
1. Type the **name of the cluster** and select **Delete** to delete the cluster.

    ![Delete cluster page](./media/event-hubs-dedicated-cluster-create-portal/delete-cluster-page.png)


## Next steps
In this article, you created an Event Hubs cluster. For step-by-step instructions to send and receive events from an event hub, and capture events to an Azure storage or Azure Data Lake Store, see the following tutorials:

- Send and receive events 
    - [.NET Core](event-hubs-dotnet-standard-getstarted-send.md)
    - [Java](event-hubs-java-get-started-send.md)
    - [Python](event-hubs-python-get-started-send.md)
    - [JavaScript](event-hubs-node-get-started-send.md)
- [Use Azure portal to enable Event Hubs Capture](event-hubs-capture-enable-through-portal.md)
- [Use Azure Event Hubs for Apache Kafka](azure-event-hubs-kafka-overview.md)
