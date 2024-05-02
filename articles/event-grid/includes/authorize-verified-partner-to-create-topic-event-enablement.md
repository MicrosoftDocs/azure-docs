---
 title: include file
 description: include file
 services: event-grid
 author: jfggdl
 ms.service: event-grid
 ms.topic: include
 ms.date: 05/08/2024
 ms.author: jafernan
 ms.custom: include file
---

1. In the **Partner Authorizations** section, specify a default expiration time for all partner authorizations defined. You can provide a period between 1 and 365 days. You must grant your consent to the partner to create partner topics in a resource group that you designate. 
1. To provide your authorization for a partner to create partner topics in the specified resource group, select **+ Partner Authorization** link.

1. On the **Add partner authorization to create resources** page, you see a list of **verified partners**. A verified partner is a partner whose identity has been validated by Microsoft.
    1. Select **MicrosoftGraphAPI**.
    1. Specify **authorization expiration time**.
    1. select **Add**.

        > [!IMPORTANT]
        > For a greater security stance, specify an expiration time that is short yet provides enough time to create your Microsoft Graph API subscription(s) and related partner topic(s). If you create several Microsoft Graph API subscriptions through this portal experience, you should account for the time it takes to create all resources. The operation fails if there is an attempt to create a partner topic after the authorization expiration time.
1. On the **Create Partner Configuration** page, verify that the partner is added to the partner authorization list at the bottom.
1. Select **Review + create** at the bottom of the page.
1. On the **Review** page, review all settings, and then select **Create**.
