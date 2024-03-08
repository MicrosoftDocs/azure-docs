---
title: Extensibility of before and after appointment activities for Microsoft Teams Virtual appointments
description: Extend Microsoft Teams Virtual appointments before and after appointment activities with Azure Communication Services, Microsoft Graph API, and Power Platform
author: tchladek
manager: chpalm
ms.author: tchladek
ms.date: 05/22/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Extend before and after appointment activities

Microsoft Power Automate and Logic Apps provide developers with no-code & low-code tools to configure the customer journey before and after the appointment via pre-existing connectors. You can use their triggers and actions to tailor your experience. 
Microsoft 365 introduces triggers (examples of triggers are: button is selected, booking is created, booking is canceled, time recurrence, form submitted, or file upload), that allows you to automate your flows, and Azure Communication Services introduces actions to use various communication channels to communicate with your customers. Examples of actions are; send an SMS, send an email, send a chat message.

## Prerequisites
The reader of this article is expected to be familiar with: 
-	[Microsoft Teams Virtual appointments](https://www.microsoft.com/microsoft-teams/premium/virtual-appointments) product and provided [user experience](https://guidedtour.microsoft.com/guidedtour/industry-longform/virtual-appointments/1/1) 
-	[Microsoft Graph Booking API](/graph/api/resources/booking-api-overview) to manage [Microsoft Booking](https://www.microsoft.com/microsoft-365/business/scheduling-and-booking-app) via [Microsoft Graph API](/graph/overview)
-	[Microsoft Graph Online meeting API](/graph/api/resources/onlinemeeting) to manage [Microsoft Teams meetings](https://www.microsoft.com/microsoft-teams/online-meetings) via [Microsoft Graph API](/graph/overview)

## Send SMS, email, and chat message when booking is canceled
When a booking is canceled, there are three options to send confirmation of cancellation: SMS, email, and/or chat message. The following example shows how to configure each of the three options in Power Automate.

The first step is to select the Microsoft Booking trigger "When an appointment is Canceled" and then select the address that is used for the management of Virtual appointments. 
 
 :::image type="content" source="./media/flow-send-reminder-on-booking-cancellation.png" alt-text="Example of Power Automate flow that sends an SMS, email and chat message when Microsoft Booking is canceled." lightbox="./media/flow-send-reminder-on-booking-cancellation.png":::

Second, you must configure every individual communication channel. We start with "Send SMS". After providing the connection to Azure Communication Services resource, you must select the phone number that will be used for SMS. If you don't have an acquired phone number in the resource, you must first acquire one. Then, you can use the parameter "customerPhone" to fill in the customer's phone and define the SMS message.

The next parallel path is to send the email. After connecting to Azure Communication Services, you need to provide the sender's email. The receiver of the email can be taken from the booking property "Customer Email". Then you can provide the email subject and rich text body.

The last parallel path sends a chat message to your chat solution powered by Azure Communication Services. After providing a connection to Azure Communication Services, you define the Azure Communication Services user ID that represents your organization (for example, a bot that replaces the value `<APPLICATION USER ID>` in the previous image). Then you select the scope "Chat" to receive an access token for this identity. Next, you create a new chat thread to send a message to this user. Lastly, you send a chat message in created chat thread about the cancellation of the Virtual appointment.
  
## Next steps
-	Learn [what extensibility options you have for Virtual appointments](./overview.md)
-	Learn how to customize [scheduling experience](./schedule.md)
-	Learn how to customize [precall experience](./precall.md)
-	Learn how to customize [call experience](./call.md)
