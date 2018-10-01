---
title: HTTPS Endpoint | Microsoft Docs
description: Configure lead management for Https.
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: dan-wesley
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 09/17/2018
ms.author: pbutlerm
---

# Configure lead management using an HTTPS endpoint

You can use an HTTPS endpoint to handle Azure Marketplace and AppSource leads that can be written to a CRM system. This article describes how to configure lead management using the Microsoft Flow automation service.


## Create a flow using Microsoft Flow

1.  Open the [Flow](https://flow.microsoft.com/) webpage. Select **Sign in** or select **Sign up free** to create a free Flow account.

2.  Sign in and select **My flows** on the menu bar.

    ![My flows](./media/cloud-partner-portal-lead-management-instructions-https/image001.png)

3.  Select **Create from blank**.

    ![Create from blank](./media/cloud-partner-portal-lead-management-instructions-https/image003.png)


4.  Select the **Request/Response** connector, and then search for the request trigger. 

    ![Create from blank](./media/cloud-partner-portal-lead-management-instructions-https/image005.png)

5. Select the **Request** trigger.
    ![Request trigger](./media/cloud-partner-portal-lead-management-instructions-https/image007.png)


6.  Copy the **JSON Example** at the end of this article into the **Request Body JSON Schema**.

7.  Add a new step and choose the CRM system of your choice with the action to create a new record. The next screen capture shows **Dynamics 365 - Create a new record** as an example.

    ![Create a new record](./media/cloud-partner-portal-lead-management-instructions-https/image009.png)

8.  Provide the connection inputs for your connector and select the **Leads** entity.

    ![Select leads](./media/cloud-partner-portal-lead-management-instructions-https/image011.png)

9.  Flows shows a form for providing lead information. You can map items from the input request by choosing to add dynamic content.

    ![Add dynamic content](./media/cloud-partner-portal-lead-management-instructions-https/image013.png)

10.  Map the fields you want and then select **Save** to save your flow.

11. An HTTP POST URL is created in the Request. Copy this URL and use it as the HTTPS endpoint.

    ![HTTP Post URL](./media/cloud-partner-portal-lead-management-instructions-https/image015.png)

## Configure your offer to send leads to the HTTPS endpoint

When you configure the lead management information for your offer, select **HTTPS Endpoint** for the Lead Destination and paste in the HTTP POST URL you copied in the previous step.  

![Add dynamic content](./media/cloud-partner-portal-lead-management-instructions-https/image017.png)

When leads are generated, Microsoft will send leads to the Flow, which get routed to the  CRM system you configured.


## JSON Example

``` json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
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
