---
title: Onboard as an Azure Event Grid partner using Azure portal
description: Use Azure portal to onboard an Azure Event Grid partner. 
ms.topic: conceptual
ms.date: 10/29/2020
---

# Onboard as an Azure Event Grid partner using the Azure portal
This article describes the way third-party SaaS providers, also known as event publishers or partners, are onboarded to Event Grid to be able to publish events from their services and how those events are consumed by end users.

> [!IMPORTANT]
> If you are not familiar with Partner Events, see [Partner Events overview](partner-events-overview.md) for a detailed introduction of key concepts that are critical to understand and follow the steps in this article.

## Onboarding process for event publishers (partners)
In a nutshell, enabling your service’s events to be consumed by users typically involves the following process:

1. **Communicate your interest** in becoming a partner to the Event Grid service team before proceeding with the next steps.
1. Create a partner topic type by creating a **registration**. 
1. Create a **namespace**.
1. Create an **event channel** and **partner topic** (single step).
1. Test the Partner Events functionality end to end.

For step #4, you should decide what kind of user experience you want to provide. You have the following options:
- Provide your own solution, typically a web graphical user interface (GUI) experience, hosted under your domain using our SDK and/or REST API to create an event channel and its corresponding partner topic. With this option, you can ask the user for the subscription and resource group under which you'll create a partner topic.
- Use Azure portal or CLI to create the event channel and associated partner topic. With this option, you must have get in the user’s Azure subscription some way and resource group under which you'll create a partner topic. 

This article shows you how to onboard as an Azure Event Grid partner using the Azure portal. 

> [!NOTE]
> Registering a partner topic type is an optional step. To help you decide if you should create a partner topic type, see [Resources managed by event publisher](partner-events-overview.md#resources-managed-by-event-publishers).

## Communicate your interest in becoming a partner
Fill out [this form](https://aka.ms/gridpartnerform) and contact the Event Grid team at [GridPartner@microsoft.com](mailto:GridPartner@microsoft.com). We'll have a conversation with you providing detailed information on Partner Events’ use cases, personas, onboarding process, functionality, pricing, and more.

## Prerequisites
To complete the remaining steps, make sure you have:

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.
- An Azure [tenant](../active-directory/develop/quickstart-create-new-tenant.md).

## Register a partner topic type (optional)
1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** from the left navigation pane, then type in **Event Grid Partner Registrations** in the search bar, and select it. 
1. On the **Event Grid Partner Registrations** page, select **+ Add** on the toolbar. 

    :::image type="content" source="./media/onboard-partner/add-partner-registration-link.png" alt-text="Add partner registration link":::
1. On the **Create Partner Topic Type Registrations - Basics** page, enter the following information: 
    1. In the **Project details** section, follow these steps:
        1. Select your Azure **subscription**. 
        1. Select an existing Azure **resource group** or create a new resource group. 
    1. In the **Registration details** section, follow these steps:
        1. For **Registration name**, enter a name for the registration. 
        1. For **Organization name**, enter the name of your organization. 
    1. In the **Partner resource type** section, enter details about your resource type that will be displayed on the **partner topic create** page: 
        1. For **Partner resource type name**, enter the name for the resource type. This will be the type of partner topic that will be created in your Azure subscription. 
        2. For **Display name**, enter a user-friendly display name for the partner topic (resource) type. 
        3. Enter a **description for the resource type**. 
        4. Enter a **description for the scenario**. It should explain the ways or scenarios in which the partner topics for your resources can be used.  

            :::image type="content" source="./media/onboard-partner/create-partner-registration-page.png" alt-text="Create partner registration":::            
1. Select **Next: Custom Service** at the bottom of the page. On the **Customer Service** tab of the **Create Partner Registration** page, enter information that subscriber users will use to contact you in case of a problem with the event source:
    1. Enter the **Phone number**.
    1. Enter **extension** for the phone number.
    1. Enter a support web site **URL**. 
    
        :::image type="content" source="./media/onboard-partner/create-partner-registration-customer-service.png" alt-text="Create partner registration - customer service":::        
1. Select **Next: Tags** at the bottom of the page. 
1. On the **Tags** page, configure the following values. 
    1. Enter a **name** and a **value** for the tag you want to add. This step is **optional**. 
    1. Select **Review + create** at the bottom of the page to create the registration (partner topic type).

## Create a partner namespace

1. In the Azure portal, select **All services** from the left navigational menu, then type **Event Grid Partner Namespaces** in the search bar, and then select it from the list. 
1. On the **Event Grid Partner Namespaces** page, select **+ Add** on the toolbar. 
    
    :::image type="content" source="./media/onboard-partner/add-partner-namespace-link.png" alt-text="Partner namespaces - Add link":::
1. On the **Create Partner Namespace - Basics** page, specify the following information.
    1. In the **Project details** section, do the following steps: 
        1. Select an Azure **subscription**.
        1. Select an existing **resource group** or create a resource group. 
    1. In the **Namespace details** section, do the following steps:
        1. Enter a **name** for the namespace. 
        1. Select a **location** for the namespace. 
    1. In the **Registration details** section, do the following steps to associate the namespace with a partner registration. 
        1. Select the **subscription** in which the partner registration exists. 
        1. Select the **resource group** that contains the partner registration. 
        1. Select the **partner registration** from the drop-down list.
    1. Select **Next: Tags** at the bottom of the page.

        :::image type="content" source="./media/onboard-partner/create-partner-namespace-basics-page.png" alt-text="Create partner namespace - basics page":::
1. On the **Tags** page, add tags (optional).
    1. Enter a **name** and a **value** for the tag you want to add. This step is **optional**.
    1. Select **Review + create** at the bottom of the page.         
1. On the **Review + create** page, review the details, and select **Create**. 

## Create an event channel
> [!IMPORTANT]
> You'll need to request from your user an Azure subscription, resource group, location, and partner topic name to create a partner topic that your user will own and manage.

1. Go to the **Overview** page of the namespace you created. 

    :::image type="content" source="./media/onboard-partner/partner-namespace-overview.png" alt-text="Partner namespace - overview page":::
    partner-namespace-overview.png
1. Select **+ Event Channel** on the toolbar. 
1. On the **Create Event Channel - Basics** page, specify the following information. 
    1. In the **Channel details** section, do these steps:
        1. For **Event channel name**, enter a name for the event channel. 
        1. Enter the **source**. See [Cloud Events 1.0 specifications](https://github.com/cloudevents/spec/blob/v1.0/spec.md#source-1) to get an idea of a suitable value for the source. Also, see [this Cloud Events schema example](cloud-event-schema.md#sample-event-using-cloudevents-schema).
        1. Enter the source (WHAT IS IT?).
    1. In the **Destination details** section, enter details for the destination partner topic that will be created for this event channel. 
        1. Enter the **ID of the subscription** in which the partner topic will be created. 
        1. Enter the **name of the resource group** in which the partner topic resource will be created. 
        1. Enter a **name for the partner topic**. 
    1. Select **Next: Filters** at the bottom of the page. 
    
        :::image type="content" source="./media/onboard-partner/create-event-channel-basics-page.png" alt-text="Create event channel - basics page":::
1. On the **Filters** page, add filters. do the following steps:
    1. Filter on attributes of each event. Only events that match all filters get delivered. Up to 25 filters can be specified. Comparisons are case-insensitive. Valid keys used for filters vary based on the event schema. In the following example, `eventid`, `source`, `eventtype`, and `eventtypeversioin` can be used for keys. You can also use custom properties inside the data payload, using the `.` as the nesting operator. For example: `data`, `data.key`, `data.key1.key2`.
    1. Select **Next: Additional features** at the bottom of the page. 
    
        :::image type="content" source="./media/onboard-partner/create-event-channel-filters-page.png" alt-text="Create event channel - filters page":::
        create-event-channel-filters-page.png
1. On the **Additional features** page, you can set an **expiration time** and **description for the partner topic**. 
    1. The **expiration time** is the time at which the topic and its associated event channel will be automatically deleted if not activated by the customer. A default of seven days is used in case a time isn't provided. Select the checkbox to specify your own expiration time. 
    1. As this topic is a resource that's not created by the user, a **description** can help the user with understanding the nature of this topic. A generic description will be provided if none is set. Select the checkbox to set your own partner topic description. 
    1. Select **Next: Review + create**. 
    
        :::image type="content" source="./media/onboard-partner/create-event-channel-additional-features-page.png" alt-text="Create event channel - additional features page":::
1. On the **Review + create**, review the settings, and select **Create** to create the event channel. 

## Next steps
- [Partner topics overview](partner-topics-overview.md)
- [Partner topics onboarding form](https://aka.ms/gridpartnerform)
- [Auth0 partner topic](auth0-overview.md)
- [How to use the Auth0 partner topic](auth0-how-to.md)
