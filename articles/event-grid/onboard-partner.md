---
title: Onboard as an Azure Event Grid partner using Azure portal
description: Use Azure portal to onboard an Azure Event Grid partner. 
ms.topic: conceptual
ms.date: 09/21/2022
---

# Onboard as an Azure Event Grid partner using the Azure portal
This article describes the way third-party SaaS providers, also known as [partners](concepts.md#partners) are onboarded to Event Grid to be able to publish events from their services and how those events are consumed by end users.

> [!IMPORTANT]
> Partners can publish events to Azure Event Grid, and also receive events from it. These capabilities are enabled through the [Partner Events](partner-events-overview.md) feature. If you aren't familiar with Partner Events, see [Partner Events overview](partner-events-overview-for-partners.md) for a detailed introduction of key concepts that are critical to understand and follow the steps in this article.

## Onboarding process for partners
In a nutshell, enabling your service’s events to be consumed by users typically involves the following process:

1. [Communicate your interest in becoming a partner](#communicate-your-interest-in-becoming-a-partner) to the Event Grid service team.
1. [Register the Event Grid resource provider](#register-the-event-grid-resource-provider) with your Azure subscription.
1. [Create a **partner registration**](#create-a-partner-registration). 
1. [Create a **namespace**](#create-a-partner-namespace).
1. [Create a **channel** and a **partner topic** in a single step](#create-a-channel).

    > [!IMPORTANT]
    > You may be able to create an event channel (legacy), which supports partner topics. **Channel** is the new routing resource type and is the preferred option, which supports both sending events via partner topics. An **event channel** is a legacy resource and will be deprecated soon. 
1. Test the Partner Events functionality end to end.

For step #5, you should decide what kind of user experience you want to provide. You have the following options:
- Provide your own solution, typically a web graphical user interface (GUI) experience, hosted under your domain using our SDK and/or REST API to create a channel (latest and recommended) /event channel (legacy) and its corresponding partner topic. With this option, you can ask the user for the subscription and resource group under which you'll create a partner topic.
- Use Azure portal or CLI to create the channel (recommended)/event channel (legacy) and an associated partner topic. With this option, you must have get in the user’s Azure subscription some way and resource group under which you'll create a partner topic. 

This article shows you how to **onboard as an Azure Event Grid partner** using the **Azure portal**. 

## Communicate your interest in becoming a partner
Contact the Event Grid team at [askgrid@microsoft.com](mailto:askgrid@microsoft.com?subject=Interested&nbsp;in&nbsp;onboarding&nbsp;as&nbsp;an&nbsp;Event&nbsp;Grid&nbsp;partner) communicating your interest in becoming a partner. We'll have a conversation with you providing detailed information on Partner Events’ use cases, personas, onboarding process, functionality, pricing, and more.

## Prerequisites
To complete the remaining steps, make sure you have:

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.
- An Azure [tenant](/entra/identity-platform/quickstart-create-new-tenant).


[!INCLUDE [register-provider](./includes/register-provider.md)]

## Create a partner registration 

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** from the left navigation pane, then type in **Event Grid Partner Registrations** in the search bar, and select it. 
1. On the **Event Grid Partner Registrations** page, select **+ Create** on the command bar or **Create Event Grid partner registrations** link on the page. 

    :::image type="content" source="./media/onboard-partner/add-partner-registration-link.png" alt-text="Add partner registration link":::
1. On the **Create Partner Topic Type Registrations - Basics** page, enter the following information: 
    1. In the **Project details** section, follow these steps:
        1. Select your Azure **subscription**. 
        1. Select an existing Azure **resource group** or create a new resource group. 
    1. In the **Registration details** section, follow these steps:
        1. For **Registration name**, enter a name for the registration. 
        1. For **Organization name**, enter the name of your organization. 
    1. In the **Partner resource type** section, enter details about your resource type that will be displayed on the **partner topic create** page: 
        1. For **Partner resource type name**, enter the name for the resource type. 
        2. For **Display name**, enter a user-friendly display name for the partner topic (resource) type. 
        3. Enter a **description for the resource type**. 
        4. Enter a **description for the scenario**. It should explain the ways or scenarios in which the partner topics for your resources can be used.  

            :::image type="content" source="./media/onboard-partner/create-partner-registration-page.png" alt-text="Create partner registration":::            
1. Select **Next: Custom Service** at the bottom of the page. On the **Customer Service** tab of the **Create Partner Registration** page, enter information that subscriber users will use to contact you when there's a problem with the event source:
    1. Enter the **Phone number**.
    1. Enter **extension** for the phone number.
    1. Enter a support web site **URL**. 
    
        :::image type="content" source="./media/onboard-partner/create-partner-registration-customer-service.png" alt-text="Create partner registration - customer service":::        
1. Select **Next: Tags** at the bottom of the page. 
1. On the **Tags** page, configure the following values. 
    1. Enter a **name** and a **value** for the tag you want to add. This step is **optional**. 
    1. Select **Review + create** at the bottom of the page to create the registration (partner topic type).
1. On the **Review + create** page, review all settings, and then select **Create** to create the partner registration. 

## Create a partner namespace

1. In the Azure portal, select **All services** from the left navigational menu, then type **Event Grid Partner Namespaces** in the search bar, and then select it from the list. 
1. On the **Event Grid Partner Namespaces** page, select **+ Create** on the toolbar. 
    
    :::image type="content" source="./media/onboard-partner/add-partner-namespace-link.png" alt-text="Partner namespaces - Add link":::
1. On the **Create Partner Namespace - Basics** page, specify the following information.
    1. In the **Project details** section, do the following steps: 
        1. Select an Azure **subscription**.
        1. Select an existing **resource group** or create a resource group. 
    1. In the **Namespace details** section, do the following steps:
        1. Enter a **name** for the namespace. 
        1. Select a **location** for the namespace. 
        1. For **Partner topic routing mode**, select **Channel name header** or **Source attribute in event**. 
        
            - **Channel name header** routing: With this kind of routing, you publish events using an http header called `aeg-channel-name` where you provide the name of the channel to which events should be routed. If you select this option, you'll create **channels** in the namespace.
            - **Source attribute in event** routing. This routing approach is based on the value of the `source` context attribute in the event. If you select this option, you'll create **event channels**, which is legacy equivalent to **channels** and will be deprecated soon.

            > [!IMPORTANT]
            > - It's not possible to update the routing mode once the namespace is created.             
            > - **Channel** is the new routing resource type and is the preferred option. An event channel is a legacy resource and will be deprecated soon.
    1. In the **Registration details** section, follow these steps to associate the namespace with a partner registration. 
        1. Select the **subscription** in which the partner registration exists. 
        1. Select the **resource group** that contains the partner registration. 
        1. Select the **partner registration** from the drop-down list.
    1. Select **Next: Tags** at the bottom of the page.

        :::image type="content" source="./media/onboard-partner/create-partner-namespace-basics-page.png" alt-text="Create partner namespace - basics page":::
1. On the **Tags** page, add tags (optional).
    1. Enter a **name** and a **value** for the tag you want to add. This step is **optional**.
    1. Select **Review + create** at the bottom of the page.         
1. On the **Review + create** page, review the details, and select **Create**. 

## Create a channel
If you selected **Channel name header** for **Partner topic routing mode**, create a channel by following steps in this section. 

1. Go to the **Overview** page of the partner namespace you created, and select **+ Channel** on the command bar.

    :::image type="content" source="./media/onboard-partner/create-channel-button.png" lightbox="./media/onboard-partner/create-channel-button.png" alt-text="Image showing the selection of Create Channel button on the command bar of the Event Grid Partner Namespace page.":::
1. On the **Create Channel - Basics** page, follow these steps.
    1. Enter a **name** for the channel. Channel name should be unique across the region in which is created.
    1. For the channel type, select **Partner Topic**. 
    
        Partner topics are resources that hold published events. Select **Partner Topic** if you want to **forward events to a partner topic** that holds events to be processed by a handler later. 
    3. If you selected **Partner Topic**, enter the following details:
        1. **ID of the subscription** in which the partner topic will be created. 
        1. **Resource group** in which the partner topic will be created. 
        1. **Name** of the partner topic. 
        1. Specify **source** information for the partner topic. Source is contextual information on the source of events provided by the partner that the end user can see. This information is helpful when end user is considering activating a partner topic, for example.

            :::image type="content" source="./media/onboard-partner/channel-partner-topic-basics.png" alt-text="Image showing the Create Channel - Basics page.":::
        1. Select **Add event type definitions** to declare the kind of events that are sent to the channel and to its associated partner topic. Event types are shown to customers when creating event subscriptions on the partner topic and are used to select the specific event types to send to an event handler destination.

            :::image type="content" source="./media/onboard-partner/event-type-definition-1.png" alt-text="Screenshot that shows the Event Types Definitions section with Add event types definitions option selected.":::

            :::image type="content" source="./media/onboard-partner/event-type-definition-2.png" alt-text="Screenshot that shows the definition of a sample event type.":::
            
            :::image type="content" source="./media/onboard-partner/event-type-definition-3.png" alt-text="Screenshot that shows a list with the event type definition that was added.":::
    1. Select **Next: Additional Features** link at the bottom of the page.
    1. On the **Additional Features** page, follow these steps:
        1. To set your own activation message that can help end user to activate the associated partner topic, select the check box next to **Set your own activation message**, and enter the message. 
        1. For **expiration time**, set the time after this channel is created at which the associated partner topic and this channel will be automatically deleted if not activated by the end user.
        1.Select **Next: Review + create**. 

        :::image type="content" source="./media/onboard-partner/create-channel-additional-features.png" alt-text="Image showing the Create Channel - Additional Features page.":::
    1. On the **Review + create** page, review all the settings for the channel, and select **Create** at the bottom of the page. 
    
        **Partner topic** option: 
        :::image type="content" source="./media/onboard-partner/create-channel-review-create.png" alt-text="Image showing the Create Channel - Review + create page.":::            
        
        
## Manage a channel

If you created a channel you may be interested to update the configuration once the resource has been created.

1. Go to the **Configuration** on the channel. You may update message for partner topic activation, expiration time if not activated, and event type definitions.

    :::image type="content" source="./media/onboard-partner/channel-configuration.png" alt-text="Screenshot that shows the Configuration page of a channel.":::

> [!IMPORTANT]
> Don't forget to save changes before leaving the configuration page.
    
## Create an event channel

If you selected **Source attribute in event** for **Partner topic routing mode**, create an event channel by following steps in this section. 

> [!IMPORTANT]
> - **Channel** is the new routing resource type and is the preferred option. 

1. Go to the **Overview** page of the namespace you created. 

    :::image type="content" source="./media/onboard-partner/partner-namespace-overview.png" alt-text="Partner namespace - overview page":::
    partner-namespace-overview.png
1. Select **+ Event Channel** on the toolbar. 
1. On the **Create Event Channel - Basics** page, specify the following information. 
    1. In the **Channel details** section, do these steps:
        1. For **Event channel name**, enter a name for the event channel. 
        1. Enter the **source**. See [Cloud Events 1.0 specifications](https://github.com/cloudevents/spec/blob/v1.0/spec.md#source-1) to get an idea of a suitable value for the source. Also, see [this Cloud Events schema example](cloud-event-schema.md#sample-event-using-cloudevents-schema).
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
1. On the **Additional features** page, you can set an **expiration time** and **description for the partner topic**. 
    1. The **expiration time** is the time at which the topic and its associated event channel will be automatically deleted if not activated by the customer. A default of seven days is used in case a time isn't provided. Select the checkbox to specify your own expiration time. 
    1. As this topic is a resource that's not created by the user, a **description** can help the user with understanding the nature of this topic. A generic description will be provided if none is set. Select the checkbox to set your own partner topic description. 
    1. Select **Next: Review + create**. 
    
        :::image type="content" source="./media/onboard-partner/create-event-channel-additional-features-page.png" alt-text="Create event channel - additional features page":::
1. On the **Review + create**, review the settings, and select **Create** to create the event channel. 

## Activate partner topics
Before your users can subscribe to partner topics you create in their Azure subscriptions, they'll have activate partner topics first. For details, see [Activate a partner topic](subscribe-to-partner-events.md#activate-a-partner-topic). 

   
## Next steps

See the following articles for more details about the Partner Events feature:

- [Partner Events overview for customers](partner-events-overview.md)
- [Partner Events overview for partners](partner-events-overview-for-partners.md)
- [Subscribe to partner events](subscribe-to-partner-events.md)
- [Subscribe to Auth0 events](auth0-how-to.md)
