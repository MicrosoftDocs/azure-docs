---
title: HTTPS Endpoint | Azure Marketplace
description: Configure lead management for an HTTPS endpoint.
services: Azure, Marketplace, Cloud Partner Portal, 
author: dan-wesley
ms.service: marketplace
ms.topic: conceptual
ms.date: 12/24/2018
ms.author: pabutler
---

# Configure lead management using an HTTPS endpoint

You can use an HTTPS endpoint to handle Azure Marketplace and AppSource leads. These leads can be written to  that can be written to a Customer Relationship Management (CRM) system or sent out as an email notification. This article describes how to configure lead management using the [Microsoft Flow](https://powerapps.microsoft.com/automate-processes/) automation service.

## Create a flow using Microsoft Flow

1. Open the [Flow](https://flow.microsoft.com/) webpage. Select **Sign in** or select **Sign up free** to create a free Flow account.

2. Sign in and select **My flows** on the menu bar.

    ![My flows](./media/cloud-partner-portal-lead-management-instructions-https/https-myflows.png)

3. Select **+ Create from blank**.

    ![Create from blank](./media/cloud-partner-portal-lead-management-instructions-https/https-myflows-create-fromblank.png)

4. Select **Create from blank**.

    ![Create from blank](./media/cloud-partner-portal-lead-management-instructions-https/https-myflows-create-fromblank2.png)

5. In the **Search connectors and triggers** field, type "request" to find the Request connector.
6. Under **Triggers**, select **When a HTTP request is received**. 

    ![Select the HTTP request received trigger](./media/cloud-partner-portal-lead-management-instructions-https/https-myflows-pick-request-trigger.png)

7. Use one of the following steps to configure the **Request Body JSON Schema**:

   - Copy the [JSON schema](#json-schema) at the end of this article into the **Request Body JSON Schema** text box.
   - Select **Use sample payload to generate schema**. In the **Enter or paste a sample JSON payload** text box, paste in the [JSON example](#json-example). Select **Done** to create the schema.

   >[!Note]
   >At this point in the flow you can either connect to a CRM system or configure an email notification.

### To connect to a CRM system

1. Select **+ New step**.
2. Choose the CRM system of your choice with the action to create a new record. The following screen capture shows **Dynamics 365 - Create a new record** as an example.

    ![Create a new record](./media/cloud-partner-portal-lead-management-instructions-https/https-image009.png)

3. Provide the **Organization Name** that's the connection inputs for your connector. Select **Leads** from the **Entity Name** dropdown list.

    ![Select leads](./media/cloud-partner-portal-lead-management-instructions-https/https-image011.png)

4. Flow shows a form for providing lead information. You can map items from the input request by choosing to add dynamic content. The following screen capture shows **OfferTitle** as an example.

    ![Add dynamic content](./media/cloud-partner-portal-lead-management-instructions-https/https-image013.png)

5. Map the fields you want and then select **Save** to save your flow.

6. An HTTP POST URL is created in the request. Copy this URL and use it as the HTTPS endpoint.

    ![HTTP Post URL](./media/cloud-partner-portal-lead-management-instructions-https/https-myflows-get-post-url.png)

### To set up email notification

1. Select **+ New step**.
2. Under **Choose an action**, select **Actions**.
3. Under **Actions**, select **Send an email**.

    ![Add an email action](./media/cloud-partner-portal-lead-management-instructions-https/https-myflows-add-email-action.png)

4. In **Send an email**, configure the following required fields:

   - **To** - Enter at least one valid email address.
   - **Subject** - Flow gives you the option of adding Dynamic content, like **LeadSource** in the following screen capture.

     ![Add an email action using dynamic content](./media/cloud-partner-portal-lead-management-instructions-https/https-myflows-configure-email-dynamic-content.png)

   - **Body** - From the Dynamic content list, add the information you want in the body of the email. For example, LastName, FirstName, Email, and Company.

   When you're finished setting up the email notification, it will look like the example in the following screen capture.

   ![Add an email action](./media/cloud-partner-portal-lead-management-instructions-https/https-myflows-configure-email-action.png)

5. Select **Save** to finish your flow.
6. An HTTP POST URL is created in the request. Copy this URL and use it as the HTTPS endpoint.

    ![HTTP Post URL](./media/cloud-partner-portal-lead-management-instructions-https/https-myflows-get-post-url.png)

## Configure your offer to send leads to the HTTPS endpoint

When you configure the lead management information for your offer, select **HTTPS Endpoint** for the **Lead Destination** and paste in the HTTP POST URL you copied in the previous step.  

![Add dynamic content](./media/cloud-partner-portal-lead-management-instructions-https/https-image017.png)

When leads are generated, Microsoft sends leads to the Flow, which get routed to the CRM system or email address you configured.

## JSON schema and example

The JSON test example uses the following schema:

### JSON schema

``` json
{
  "$schema": "https://json-schema.org/draft-04/schema#",
  "definitions": {},
  "id": "http://example.com/example.json",
  "properties": {
    "ActionCode": {
      "id": "/properties/ActionCode",
      "type": "string"
    },
    "OfferTitle": {
      "id": "/properties/OfferTitle",
      "type": "string"
    },
    "LeadSource": {
      "id": "/properties/LeadSource",
      "type": "string"
    },
    "UserDetails": {
      "id": "/properties/UserDetails",
      "properties": {
        "Company": {
          "id": "/properties/UserDetails/properties/Company",
          "type": "string"
        },
        "Country": {
          "id": "/properties/UserDetails/properties/Country",
          "type": "string"
        },
        "Email": {
          "id": "/properties/UserDetails/properties/Email",
          "type": "string"
        },
        "FirstName": {
          "id": "/properties/UserDetails/properties/FirstName",
          "type": "string"
        },
        "LastName": {
          "id": "/properties/UserDetails/properties/LastName",
          "type": "string"
        },
        "Phone": {
          "id": "/properties/UserDetails/properties/Phone",
          "type": "string"
        },
        "Title": {
          "id": "/properties/UserDetails/properties/Title",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  "type": "object"
}
```

You can copy and edit the following JSON example to use as a test in your MS Flow.

### JSON example

```json
{
"OfferTitle": "Test Microsoft",
"LeadSource": "Test run through MS Flow",
"UserDetails": {
"Company": "Contoso",
"Country": "USA",
"Email": "someone@contoso.com",
"FirstName": "Some",
"LastName": "One",
"Phone": "16175555555",
"Title": "Esquire"
}
}
```

## Next steps

If you haven't already done so, configure customer [leads](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-get-customer-leads) in the Cloud Partner Portal.
