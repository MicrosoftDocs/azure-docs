---
title: Alert exclusions (maintenance window)
description: Define conditions under which alerts will not be sent.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# Alert exclusions (maintenance window)

Define conditions under which alerts will not be sent. For example, define and update stop and start times, assets or subnets that should be excluded when triggering alerts, or CyberX engines that should be excluded. For example, during a maintenance window, you may want to stop alert delivery of all alerts, except for malware alerts on critical assets.

The APIs you define here appear in the Central Manager, Alert Exclusion rule window as a read-only exclusion rule.

:::image type="content" source="media/image8.png" alt-text="Screenshot of Alert Exclusion view":::

## /external/v1/maintenanceWindow

### Method - POST

### Query parameters

- **ticketId**: The maintenance ticket ID in the user’s systems.

- **ttl**: TTL (time to live) defines the duration of the maintenance window in minutes. After the period of time defined by this parameter, the system automatically starts sending alerts.

- **engines**: Defines from which security engine to suppress alerts during the maintenance process:

   - ANOMALY

   - MALWARE

   - OPERATIONAL

   - POLICY_VIOLATION

   - PROTOCOL_VIOLATION

- **sensorIds**: Defines from which CyberX sensor to suppress alerts during the maintenance process. It is the same ID retrieved from /api/v1/appliances (GET).

- **subnets**: Defines from which subnet to suppress alerts during the maintenance process. The subnet is sent in the following format: 192.168.0.0/16.

### Error codes

- **201 (Created)**: The action was successfully completed.

- **400 (Bad Request)**: Appears in the following cases:

   - The **ttl** parameter is not numeric or not positive.

   - The **subnets** parameter was defined using a wrong format.

   - The **ticketId** parameter is missing.

   - The **engine** parameter does not match the existing security engines.  

- **404 (Not Found)**: One of the sensors does not exists.

- **409 (Conflict)**: The ticket ID is linked to another open maintenance window.

- **500 (Internal Server Error)**: Any other unexpected error.

> [!NOTE]
> Make sure that the ticketID is not linked to an existing open window. The exclusion rule that is generated: Maintenance-{token name}-{ticket ID}.

## Method - PUT

Allows updating the maintenance window duration after starting the maintenance process by changing the **ttl** parameter. The new duration definition overrides the previous one.

This method is useful when you want to set a longer duration than the currently configured duration.

### Query parameters

- **ticketId**: The maintenance ticket ID in the user’s systems.

- **ttl**: Defines the duration of the window in minutes.

### Error code

- **200 (OK)**: The action was successfully completed.

- **400 (Bad Request)**: Appears in the following cases:

   - The **ttl** parameter is not numeric or not positive.

   - The **ticketId** parameter is missing.

   - The **ttl** parameter is missing.

- **404 (Not Found)**: The ticket ID is not linked to an open maintenance window.

- **500 (Internal Server Error)**: Any other unexpected error.

> [!NOTE]
> Make sure that the ticket ID is linked to an existing open window.

## Method - DELETE

Closes an existing maintenance window.

### Query parameters

- **ticketId**: Logs the maintenance ticket ID in the user’s systems.

### Error code

- **200 (OK)**: The action was successfully completed.

- **400 (Bad Request)**: The **ticketId** parameter is missing.

- **404 (Not Found)**: The ticket ID is not linked to an open maintenance window.

- **500 (Internal Server Error)**: Any other unexpected error.

> [!NOTE]
> Make sure that the ticket ID is linked to an existing open window.

## Method - GET

Retrieve a log of all the open/close/update actions that were performed in the system during the maintenance. You can retrieve a log only for maintenance windows that were active in the past and have been closed.

### Query parameters 

- **fromDate**: Filters the logs from the predefined date and later, the format is 2019-12-30.

- **toDate**: Filters the logs up to the predefined date, the format is 2019-12-30.

- **ticketId**: Filters the logs related to a specific ticketId.

- **tokenName**: Filters the logs related to a specific tokenName.

### Error code

- **200 (OK)**: The action was successfully completed.

- **400 (Bad Request)**: The date format is wrong.

- **204 (No Content)**: There is no data to show.

- **500 (Internal Server Error)**: Any other unexpected error.

### Response type

**JSON**

### Response content

Array of JSON Objects representing maintenance window operations.

### Response structure

| Name          | Type            | Comment                                         | Nullable |
| ------------- | --------------- | ----------------------------------------------- | -------- |
| dateTime      | string          | Example: “2012-04-23T18:25:43.511Z”             | no       |
| ticketId      | string          | Example: “9a5fe99c-d914-4bda-9332-307384fe40bf” | no       |
| tokenName     | string          |                                                 | no       |
| engines       | Array of string |                                                 | yes      |
| sensorIds     | Array of string |                                                 | yes      |
| subnets       | Array of string |                                                 | yes      |
| ttl           | numeric         |                                                 | yes      |
| operationType | string          | Values are “OPEN”, “UPDATE” and “CLOSE”         | no       |