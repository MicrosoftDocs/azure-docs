---
 title: include file
 description: include file
 services: event-grid
 author: sonalika-roy
 ms.service: event-grid
 ms.topic: include
 ms.date: 05/30/20223
 ms.author: sonalikaroy
 ms.custom: include file
---

## Create a namespace in the Azure portal
A namespace in Azure Event Grid is a logical container for one or more topics, clients, client groups, topic spaces and permission bindings. It provides a unique namespace, allowing you to have multiple resources in the same Azure region. With an Azure Event Grid namespace you can group now together related resources and manage them as a single unit in your Azure subscription.

Please follow the next sections to create, view and manage an Azure Event Grid namespace.

To create a namespace:

1. Sign-in to the Azure portal.

2. In the **search box**, enter **Event Grid** and select Event Grid Namespaces service.
  
    :::image type="content" source="../media/create-view-manage-namespaces/search-event-grid.png" alt-text="Screenshot showing Event Grid the search results in the Azure portal.":::

3. In the **Overview** page, select **Create** in any of the namespace cards available in the MQTT events or Custom events sections.

    :::image type="content" source="../media/create-view-manage-namespaces/overview-create.png" alt-text="Screenshot showing Event Grid overview.":::

4. On the **Basics** tab, select the Azure subscription, resource group, name, location, [availability zone](../concepts.md#availability-zones), and [throughput units](../concepts-pull-delivery.md#throughput-units) for your Event Grid namespace.

    :::image type="content" source="../media/create-view-manage-namespaces/namespace-creation-basics.png" alt-text="Screenshot showing Event Grid namespace creation basic tab.":::

> [!NOTE]
> If the selected region supports availability zones the "Availability zones" checkbox can be enabled or disabled.  The checkbox is selected by default if the region supports availability zones. However, you can uncheck and disable Availability zones if needed. The selection cannot be changed once the namespace is created.

5. On the **Tags** tab, add the tags in case you need them.

    :::image type="content" source="../media/create-view-manage-namespaces/namespace-creation-tags.png" alt-text="Screenshot showing Event Grid namespace creation tags tab.":::

6. On the **Review + create** tab, review your settings and select **Create**.

    :::image type="content" source="../media/create-view-manage-namespaces/namespace-creation-review.png" alt-text="Screenshot showing Event Grid namespace creation review + create tab.":::

7. Once the deployment of the resource is successful, select **Go to resource** on the deployment page. 
    
