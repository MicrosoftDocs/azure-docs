---
 title: include file
 description: include file
 services: event-grid
 author: spelluru
 ms.service: event-grid
 ms.topic: include
 ms.date: 10/31/2022
 ms.author: spelluru
 ms.custom: include file
---

## Authorize partner to create a partner topic

You must grant your consent to the partner to create partner topics in a resource group that you designate. This authorization has an expiration time. It's effective for the time period you specify between 1 to 365 days. 

> [!IMPORTANT]
> For a greater security stance, specify the minimum expiration time that offers the partner enough time to configure your events to flow to Event Grid and to provision your partner topic. Your partner won't be able to create resources (partner topics) in your Azure subscription after the authorization expiration time. 

> [!NOTE]
> Event Grid started enforcing authorization checks to create partner topics around June 30th, 2022. 

Following example shows the way to create a partner configuration resource that contains the partner authorization. You must identify the partner by providing either its **partner registration ID** or the **partner name**. Both can be obtained from your partner, but only one of them is required. For your convenience, the following examples leave a sample expiration time in the UTC format.

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar at the top, enter **Partner Configurations**, and select **Event Grid Partner Configurations** under **Services** in the results. 
1. On the **Event Grid Partner Configurations** page, select **Create Event Grid partner configuration** button on the page (or) select **+ Create** on the command bar. 

    :::image type="content" source="./media/subscribe-to-partner-events/partner-configurations.png" alt-text="Screenshot showing the Event Grid Partner Configurations with the list of partner configurations and a link to create a partner registration.":::    
1. On the **Create Partner Configuration** page, do the following steps: 
    1. In the **Project Details** section, select the **Azure subscription** and the **resource group** where you want to allow the partner to create a partner topic. 
    1. In the **Partner Authorizations** section, specify a default expiration time for partner authorizations defined in this configuration. 
    1. To provide your authorization for a partner to create partner topics in the specified resource group, select **+ Partner Authorization** link. 
    
        :::image type="content" source="./media/subscribe-to-partner-events/partner-authorization-configuration.png" alt-text="Screenshot showing the Create Partner Configuration page with the Partner Authorization link selected.":::
        
1. On the **Add partner authorization to create resources** page, you see a list of **verified partners**. A verified partner is a partner whose identity has been validated by Microsoft. You can select a verified partner, and select **Add** button at the bottom to give the partner the authorization to add a partner topic in your resource group. This authorization is effective up to the expiration time. 

    You also have an option to authorize a **non-verified partner.** Unless the partner is an entity that you know well, for example, an organization within your company, it's strongly encouraged that you only work with verified partners. If the partner isn't yet verified, encourage them to get verified by asking them to contact the Event Grid team at askgrid@microsoft.com. 

    1. To authorize a **verified partner**:
        1. Select the partner from the list.
        1. Specify **authorization expiration time**.
        1. select **Add**. 
    
            :::image type="content" source="./media/subscribe-to-partner-events/add-verified-partner.png" alt-text="Screenshot for granting a verified partner the authorization to create resources in your resource group.":::        
    1. To authorize a non-verified partner, select **Authorize non-verified partner**, and follow these steps:
        1. Enter the **partner registration ID**. You need to ask your partner for this ID. 
        1. Specify authorization expiration time. 
        1. Select **Add**. 
        
            :::image type="content" source="./media/subscribe-to-partner-events/add-non-verified-partner.png" alt-text="Screenshot for granting a non-verified partner the authorization to create resources in your resource group.":::       

            > [!IMPORTANT]          
            > Your partner won't be able to create resources (partner topics) in your Azure subscription after the authorization expiration time. 
1. Back on the **Create Partner Configuration** page, verify that the partner is added to the partner authorization list at the bottom. 
1. Select **Review + create** at the bottom of the page. 

    :::image type="content" source="./media/subscribe-to-partner-events/create-partner-registration.png" alt-text="Screenshot showing the Create Partner Configuration page with the partner authorization you just added.":::                    
1. On the **Review** page, review all settings, and then select **Create** to create the partner registration. 


