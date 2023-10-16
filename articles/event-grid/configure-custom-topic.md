---
title: Configure an Azure Event Grid topic
description: This article shows how to configure local auth, public or private access, managed identity, and data residency for an Event Grid custom topic.
ms.date: 07/21/2022
ms.topic: how-to
ms.custom: mode-ui
---

# Configure a custom topic or a domain in Azure Event Grid
This article shows how to update or configure a custom topic or a domain in Azure Event Grid. 

## Navigate to your topic or domain

1. Sign in to [Azure portal](https://portal.azure.com/).
2. In the search bar at the top, type **Event Grid Topics**, and then select **Event Grid Topics** from the drop-down list. If you are configuring a domain, search for **Event Grid Domains**. 

    :::image type="content" source="./media/custom-event-quickstart-portal/select-topics.png" alt-text="Screenshot showing the Azure port search bar to search for Event Grid topics.":::
3. On the **Event Grid Topics** or **Event Grid Domains** page, select your topic or domain. 

    :::image type="content" source="./media/configure-custom-topic/select-topic.png" alt-text="Screenshot showing the selection of the topic in the list of Event Grid topics.":::

## Enable to disable local authentication

1. On the **Overview** page, in the **Essentials** section, select the current value for **Local Authentication**. 
1. On the **Local Authentication** page, select **Enabled** or **Disabled**.

    :::image type="content" source="./media/configure-custom-topic/local-authentication.png" alt-text="Screenshot showing the Local Authentication page.":::    
1. Select **OK** to close the **Local Authentication** page. 

## Configure public or private access

1. On the left menu, select **Networking** under **Settings**.
2. Select **Public networks** to allow all networks, including the internet, to access the resource. 

    You can restrict the traffic using IP firewall rules. Specify a single IPv4 address or a range of IP addresses in Classless inter-domain routing (CIDR) notation. 

    :::image type="content" source="./media/configure-firewall/public-networks-page.png" alt-text="Screenshot that shows the Public network access page with Public networks selected.":::
3. Select **Private endpoints only** to allow only private endpoint connections to access this resource. Use the **Private endpoint connections** tab on this page to manage connections. 
 
    For step-by-step instructions to create a private endpoint connection, see [Add a private endpoint using Azure portal](configure-private-endpoints.md#use-azure-portal).

    :::image type="content" source="./media/configure-firewall/select-private-endpoints.png" alt-text="Screenshot that shows the Public network access page with Private endpoints only option selected.":::
4. Select **Save** on the toolbar. 

## Assign managed identity
When you use Azure portal, you can assign one system assigned identity and up to two user assigned identities to an existing topic or a domain. The following procedures show you how to enable an identity for a custom topic. The steps for enabling an identity for a domain are similar. 

### To assign a system-assigned identity to a topic
1. On the left menu, select **Identity** under **Settings**.
1. In the **System assigned** tab, turn **on** the switch to enable the identity. 
1. Select **Save** on the toolbar to save the setting. 

    :::image type="content" source="./media/managed-service-identity/identity-existing-topic.png" alt-text="Screenshot showing the Identity page for a custom topic."::: 

### To assign a user-assigned identity to a topic
1. Create a user-assigned identity by following instructions in the [Manage user-assigned managed identities](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) article. 
1. On the **Identity** page, switch to the **User assigned** tab in the right pane, and then select **+ Add** on the toolbar.

    :::image type="content" source="./media/managed-service-identity/user-assigned-identity-add-button.png" alt-text="Screenshot showing the User Assigned Identity tab of the Identity page.":::     
1. In the **Add user managed identity** window, follow these steps:
    1. Select the **Azure subscription** that has the user-assigned identity. 
    1. Select the **user-assigned identity**. 
    1. Select **Add**. 
1. Refresh the list in the **User assigned** tab to see the added user-assigned identity.

You can use similar steps to enable an identity for an Event Grid domain.

## Configure data residency

1. On the left menu, select **Configuration** under **Settings**.
1. 2. For **Data residency**, select whether you don't want any data to be replicated to another region (**Regional**) or you want the metadata to be replicated to a predefined secondary region (**Cross-Geo**). 

    The **Cross-Geo** option allows Microsoft-initiated failover to the paired region in case of a region failure. For more information, see [Server-side geo disaster recovery in Azure Event Grid](geo-disaster-recovery.md). Microsoft-initiated failover is exercised by Microsoft in rare situations to fail over Event Grid resources from an affected region to the corresponding geo-paired region. This process doesn't require an intervention from user. Microsoft reserves right to make a determination of when this path will be taken. The mechanism doesn't involve a user consent before the user's topic or domain is failed over. For more information, see [How do I recover from a failover?](./faq.yml).

    If you select the **Regional** option, you may define your own disaster recovery plan. 

    :::image type="content" source="./media/configure-custom-topic/data-residency.png" alt-text="Screenshot showing the Configuration page with data residency settings.":::        
1. After updating the setting, select **Apply** to apply changes.  

## Next steps

Learn more about what Event Grid can help you do:

- [Route custom events to web endpoint with the Azure portal and Event Grid](custom-event-quickstart-portal.md)
- [About Event Grid](overview.md)
- [Event handlers](event-handlers.md)

See the following samples to learn about publishing events to and consuming events from Event Grid using different programming languages. 

- [Azure Event Grid samples for .NET](/samples/azure/azure-sdk-for-net/azure-event-grid-sdk-samples/)
- [Azure Event Grid samples for Java](/samples/azure/azure-sdk-for-java/eventgrid-samples/)
- [Azure Event Grid samples for Python](/samples/azure/azure-sdk-for-python/eventgrid-samples/)
- [Azure Event Grid samples for JavaScript](/samples/azure/azure-sdk-for-js/eventgrid-javascript/)
- [Azure Event Grid samples for TypeScript](/samples/azure/azure-sdk-for-js/eventgrid-typescript/)
