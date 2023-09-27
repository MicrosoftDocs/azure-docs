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
In this article, you learn the available options to schedule a Virtual appointment with Microsoft Teams and Microsoft Graph. 
First, you learn how to replicate the existing experience in Microsoft Teams Virtual appointments. Second, you learn how to bring your own scheduling system while providing the same Virtual appointment experience to consumers.

## Prerequisites
The reader of this article is expected to be familiar with: 
-	[Microsoft Teams Virtual appointments](https://www.microsoft.com/microsoft-teams/premium/virtual-appointments) product and provided [user experience](https://guidedtour.microsoft.com/guidedtour/industry-longform/virtual-appointments/1/1) 
-	[Microsoft Graph Booking API](/graph/api/resources/booking-api-overview) to manage [Microsoft Booking](https://www.microsoft.com/microsoft-365/business/scheduling-and-booking-app) via [Microsoft Graph API](/graph/overview)
-	[Microsoft Graph Online meeting API](/graph/api/resources/onlinemeeting) to manage [Microsoft Teams meetings](https://www.microsoft.com/microsoft-teams/online-meetings) via [Microsoft Graph API](/graph/overview)

## Microsoft 365 scheduling system
Microsoft Teams Virtual appointments use Microsoft Booking APIs to manage them. In the Teams application, you see the Booking appointments for Booking staff members, and it provides the [Booking page](https://support.microsoft.com/office/customize-and-publish-a-booking-page-for-customers-to-schedule-appointments-72fc8c8c-325b-4a16-b7ab-87bc1f324e4f) for customers to allow them to select appropriate times for consultation. 
Follow the next steps to build your own user interface for scheduling or to integrate Microsoft 365 scheduling system into your solution.
1.	Use the following HTTP request to list available Booking businesses and select business for Virtual appointments via [Microsoft Graph Booking businesses API](/graph/api/resources/bookingbusiness).

```
GET https://graph.microsoft.com/v1.0/solutions/bookingBusinesses
Permissions: Bookings.Read.All (delegated)
Response: response.body.value[0].displayName; // ”Contoso lunch delivery”
	        response.body.value[0].id; // "Contosolunchdelivery@contoso.onmicrosoft.com"
```
2.	List available Booking services and select service for Virtual appointments via [Microsoft Graph Booking services API](/graph/api/resources/bookingservice).
```
GET https://graph.microsoft.com/v1.0/solutions/bookingBusinesses/ Contosolunchdelivery@contoso.onmicrosoft.com/services
Permissions: Bookings.Read.All (delegated)
Response: response.body.value[0].displayName; // ” Initial service”
	    response.body.value[0].id; // " f9b9121f-aed7-4c8c-bb3a-a1796a0b0b2d"
```
3.	[Optional] List available Booking staff members and select staff members for Virtual appointment via [Microsoft Graph Booking staff member API](/graph/api/resources/bookingstaffmember). If no staff member is selected, then created appointment is labeled as “Unassigned”.
```
GET https://graph.microsoft.com/v1.0/solutions/bookingBusinesses/ Contosolunchdelivery@contoso.onmicrosoft.com/staffMembers
Permissions: Bookings.Read.All (delegated)
Response: response.body.value[0].displayName; // ”Dana Swope”
	    response.body.value[0].id; // "8ee1c803-a1fa-406d-8259-7ab53233f148"
```
4.	[Optional] Select or create Booking customer that for Virtual appointment via [Microsoft Graph Booking customer API](/graph/api/resources/bookingcustomer). No reminders are sent if there are no customers.
```
GET https://graph.microsoft.com/v1.0/solutions/bookingBusinesses/ Contosolunchdelivery@contoso.onmicrosoft.com/customers
Permissions: Bookings.Read.All (delegated)
Response: response.body.value[0].displayName; // ”Adele Vance”
	    response.body.value[0].id; // "80b5ddda-1e3b-4c9d-abe2-d606cc075e2e"
```
5.	Create Booking appointments for selected business, service, and optionally staff members and guests via [Microsoft Graph Booking appointment API](/graph/api/resources/bookingappointment). In the following example, we create an online meeting that is associated with the booking. Additionally, you can provide [notes and reminders](/graph/api/resources/bookingappointment).
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
In the response, you see a new Booking appointment was created. Virtual appointment also shows in the Microsoft Booking app and Microsoft Teams Virtual appointment application.

> [!NOTE]
> The only way to get customer information is to use GET Microsoft Graph Booking appointment API.


## Bring your own scheduling system

If you have an existing scheduling system and would like to extend it with the Virtual appointment experience provided by Microsoft Teams, follow the steps below: 
1.	Create an online meeting for Virtual appointment via [Microsoft Graph Online meeting API](/graph/api/resources/onlinemeeting). 
   > [!NOTE]
   > This operation doesn't create a calendar event in Microsoft Booking, Outlook, or Microsoft Teams. If you would like to create a calendar event, use [Microsoft Graph Calendar event API](/graph/api/resources/event).
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

2.	Create [Virtual appointment experience](/graph/api/virtualappointment-getvirtualappointmentjoinweburl?tabs=http) for an [onlinemeeting resource](/graph/api/resources/onlinemeeting) created in previous step via 

```
GET https://graph.microsoft.com/v1.0/ me/onlineMeetings/ MSpkYzE3NjctYmZiMi04ZdFpHRTNaR1F6WGhyZWFkLnYy/getVirtualAppointmentJoinWebUrl
Permissions: OnlineMeetings.ReadWrite (delegated)
Response: response.body.value; //"https://visit.teams.microsoft.com/webrtc-svc/..."
```

You can store the generated URL inside your scheduling system or create a dedicated key-value pair storage that would link the unique ID of the calendar event in your scheduling system with the URL to Microsoft Teams Virtual appointment experience.

## Next steps
-	Learn what [extensibility options](./overview.md) do you have for Virtual appointments.
-	Learn how to customize [before and after appointment](./before-and-after-appointment.md)
-	Learn how to customize [precall experience](./precall.md)
-	Learn how to customize [call experience](./call.md)
