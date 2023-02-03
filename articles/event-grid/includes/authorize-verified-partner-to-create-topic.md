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


1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar at the top, enter **Partner Configurations**, and select **Event Grid Partner Configurations** under **Services** in the results. 
1. On the **Event Grid Partner Configurations** page, select **Create Event Grid partner configuration** button on the page (or) select **+ Create** on the command bar. 

    :::image type="content" source="./media/subscribe-to-partner-events/partner-configurations.png" alt-text="Screenshot showing the Event Grid Partner Configurations page with the list of partner configurations and the link to create a partner registration.":::    
1. On the **Create Partner Configuration** page, do the following steps: 
    1. In the **Project Details** section, select the **Azure subscription** and the **resource group** where you want to allow the partner to create a partner topic. 
    1. In the **Partner Authorizations** section, specify a default expiration time for partner authorizations defined in this configuration. 
    1. To provide your authorization for a partner to create partner topics in the specified resource group, select **+ Partner Authorization** link. 
    
        :::image type="content" source="./media/subscribe-to-partner-events/partner-authorization-configuration.png" alt-text="Screenshot showing the Create Partner Configuration page with the Partner Authorization link selected.":::
1. On the **Add partner authorization to create resources** page, you see a list of **verified partners**. A verified partner is a partner whose identity has been validated by Microsoft. Follow these steps to authorize **Auth0** to create a partner topic. 
    1. Select the **verified partner** (Auth0, SAP, Tribal Group, or Microsoft Graph API)  from the list of verified partners.
    1. Specify **authorization expiration time**.
    1. select **Add**. 

        :::image type="content" source="./media/authorize-verified-partner-to-create-topic/add-verified-partner.png" alt-text="Screenshot showing the page that allows you to grant a verified partner the authorization to create resources in your resource group.":::        

        > [!IMPORTANT]          
        > Your partner won't be able to create resources (partner topics) in your Azure subscription after the authorization expiration time.         
1. Back on the **Create Partner Configuration** page, verify that the partner is added to the partner authorization list at the bottom. 
1. Select **Review + create** at the bottom of the page. 
1. On the **Review** page, review all settings, and then select **Create** to create the partner registration. 


