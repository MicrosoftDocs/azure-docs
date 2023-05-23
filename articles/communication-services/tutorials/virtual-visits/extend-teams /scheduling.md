---
title: Extensibility of scheduling for Microsoft Teams Virtual appointments
description: Extend Microsoft Teams Virtual appointments scheduling with Azure Communication Services and Microsoft Graph API
author: tchladek
manager: chpalm
services: azure-communication-services

ms.author: tchladek
ms.date: 05/22/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Extend scheduling
In this article, you will learn the available options to schedule a Virtual appointment with Microsoft Teams and Microsoft Graph. 
First, you will learn how to replicate the existing experience in Microsoft Teams Virtual appointments. Second, you will learn how to bring your own scheduling system while providing the same Virtual appointment experience to consumers.

## Prerequisites
The reader of this article is expected to be familiar with: 
-	Microsoft Teams Virtual appointments product and provided user experiences 
-	Using Microsoft Graph Booking API to manage Microsoft Booking via Microsoft Graph API
-	Microsoft Graph Online meeting API to manage Microsoft Teams meetings via Microsoft Graph API

## Microsoft 365 scheduling system
Microsoft Teams Virtual appointments uses Microsoft Booking APIs to manage them. In the Teams application, you will see the Booking appointments for Booking staff members, and it provides the Booking page for customers to allow them to select appropriate times for consultation. 
Follow the steps below to build your own user interface for scheduling or to integrate Microsoft 365 scheduling system into your solution.
1.	Use the HTTP request below to list available Booking businesses and select which business will be used for Virtual appointments via Microsoft Graph Booking businesses API.

```
GET https://graph.microsoft.com/v1.0/solutions/bookingBusinesses
Permissions: Bookings.Read.All (delegated)
Response: response.body.value[0].displayName; // ”Contoso lunch delivery”
	        response.body.value[0].id; // "Contosolunchdelivery@contoso.onmicrosoft.com"
```
2.	List available Booking services and select which service will be used for Virtual appointments via Microsoft Graph Booking services API.
```
GET https://graph.microsoft.com/v1.0/solutions/bookingBusinesses/ Contosolunchdelivery@contoso.onmicrosoft.com/services
Permissions: Bookings.Read.All (delegated)
Response: response.body.value[0].displayName; // ” Initial service”
	    response.body.value[0].id; // " f9b9121f-aed7-4c8c-bb3a-a1796a0b0b2d"
```
3.	[Optional] List available Booking staff and select which staff will be assigned to the Virtual appointment via Microsoft Graph Booking staff member API. If no staff is selected, then the appointment will be labeled as “Unassigned”.
```
GET https://graph.microsoft.com/v1.0/solutions/bookingBusinesses/ Contosolunchdelivery@contoso.onmicrosoft.com/staffMembers
Permissions: Bookings.Read.All (delegated)
Response: response.body.value[0].displayName; // ”Dana Swope”
	    response.body.value[0].id; // "8ee1c803-a1fa-406d-8259-7ab53233f148"
```
4.	[Optional] Select or create Booking customer that will be associated with Virtual appointment via Microsoft Graph Booking customer API. No reminders are sent if there are no customers.
```
GET https://graph.microsoft.com/v1.0/solutions/bookingBusinesses/ Contosolunchdelivery@contoso.onmicrosoft.com/customers
Permissions: Bookings.Read.All (delegated)
Response: response.body.value[0].displayName; // ”Adele Vance”
	    response.body.value[0].id; // "80b5ddda-1e3b-4c9d-abe2-d606cc075e2e"
```
5.	Create Booking appointments for selected business, service, and optionally staff members and guests via Microsoft Graph Booking appointment API. In the example below, we will create an online meeting that will be associated with the booking. Additionally, you can provide notes and reminders., which are not captured here.
```
POST https://graph.microsoft.com/v1.0/solutions/bookingBusinesses/ Contosolunchdelivery@contoso.onmicrosoft.com/appointments
Body: {
    "endDateTime": {
        "@odata.type": "#microsoft.graph.dateTimeTimeZone",
        "dateTime": "2023-05-20T10:00:00.0000000+00:00",
        "timeZone": "UTC"
    },
    "isLocationOnline": true,
    "staffMemberIds": [
       {
          "8ee1c803-a1fa-406d-8259-7ab53233f148"
       }
    ],
    "serviceId": "f9b9121f-aed7-4c8c-bb3a-a1796a0b0b2d",
    "startDateTime": {
        "dateTime": "2023-05-20T09:00:00.0000000+00:00",
        "timeZone": "UTC"
    },
    "customers": [
        {
            "customerId": "80b5ddda-1e3b-4c9d-abe2-d606cc075e2e"
        }
    ]
}
Permissions: BookingsAppointment.ReadWrite.All (delegated)
Response: response.body.value.id; // "AAMkADc7zF4J0AAA8v_KnAAA="
          response.body.value.serviceId; // "f9b9121f-aed7-4c8c-bb3a-a1796a0b0b2d"
          response.body.value.joinWebUrl; // "https://teams.microsoft.com/l/meetup-join/..."
          response.body.value.anonymousJoinWebUrl; // "https://visit.teams.microsoft.com/webrtc-svc/..."
          response.body.value.staffMemberIds; // "8ee1c803-a1fa-406d-8259-7ab53233f148"
          response.body.value.customers[0].name; // "Adele Vance"
```
In the response, you will see a new Booking appointment was created. It will also show in the Microsoft Booking app and Microsoft Teams Virtual appointment application.

Note: The only way to get customer information is to use GET Microsoft Graph Booking appointment API.

## Bring your own scheduling system

If you have an existing scheduling system and would like to extend it with the Virtual appointment experience provided by Microsoft Teams, follow the steps below: 
1.	Create an online meeting that will be associated with Virtual appointment via Microsoft Graph Online meeting API. Note: This operation does not create a calendar event in Microsoft Booking, Outlook, or Microsoft Teams. If you would like to create calendar event, use Microsoft Graph Calendar event API.
```
POST https://graph.microsoft.com/v1.0/ me/onlineMeetings
Body: {
  "startDateTime":"2023-05-20T09:00:00.0000000+00:00",
  "endDateTime":"2023-05-20T10:00:00.0000000+00:00",
  "subject":"Virtual appointment in Microsoft Teams"
}
Permissions: OnlineMeetings.ReadWrite (delegated)
Response: response.body.value.id; // "MSpkYzE3NjctYmZiMi04ZdFpHRTNaR1F6WGhyZWFkLnYy"
          response.body.value.joinWebUrl; // "https://teams.microsoft.com/l/meetup-join/..."
```

2.	Create Virtual appointment experience for an onlinemeeting resource via 

```
GET https://graph.microsoft.com/v1.0/ me/onlineMeetings/ MSpkYzE3NjctYmZiMi04ZdFpHRTNaR1F6WGhyZWFkLnYy/getVirtualAppointmentJoinWebUrl
Permissions: OnlineMeetings.ReadWrite (delegated)
Response: response.body.value; //"https://visit.teams.microsoft.com/webrtc-svc/..."
```

You can store the generated URL inside your scheduling system or create a dedicated key-value pair storage that would link the unique ID of the calendar event in your scheduling system with the URL to Microsoft Teams Virtual appointment experience.

## Next Steps
-	Learn what [extensibility options](./scheduling.md) do you have for Virtual appointments.
-	Learn how to customize [before and after appointment](./before-and-after-appointment.md)
-	Learn how to customize [precall experience](./precall.md)
-	Learn how to customize [call experience](./call.md)
