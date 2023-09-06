---
title: Data synced from your ITSM product to LA Workspace
description: This article provides an overview of data synced from your ITSM product to LA Workspace.
ms.topic: conceptual
ms.date: 06/19/2023
ms.custom: references_regions
ms.reviewer: nolavime

---

# Data synced from your ITSM product

Incidents and change requests are synced from [ServiceNow](./itsmc-connections-servicenow.md) to your Log Analytics workspace based on the connection's configuration by using the **Sync Data** field.

## Synced data

This section shows some examples of data gathered by ITSM Connector.

The fields in **ServiceDesk_CL** vary depending on the work item type that you import into Log Analytics. Here are fields for two work item types:

**Work item:** **Incidents**
ServiceDeskWorkItemType_s="Incident"

**Fields**

- ServiceDeskConnectionName
- Service Desk ID
- State
- Urgency
- Impact
- Priority
- Escalation
- Created By
- Resolved By
- Closed By
- Source
- Assigned To
- Category
- Title
- Description
- Created Date
- Closed Date
- Resolved Date
- Last Modified Date
- Computer

**Work item:** **Change Requests**

ServiceDeskWorkItemType_s="ChangeRequest"

**Fields**
- ServiceDeskConnectionName
- Service Desk ID
- Created By
- Closed By
- Source
- Assigned To
- Title
- Type
- Category
- State
- Escalation
- Conflict Status
- Urgency
- Priority
- Risk
- Impact
- Assigned To
- Created Date
- Closed Date
- Last Modified Date
- Requested Date
- Planned Start Date
- Planned End Date
- Work Start Date
- Work End Date
- Description
- Computer

## ServiceNow example 
### Output data for a ServiceNow incident

| Log Analytics field | ServiceNow field |
|:--- |:--- |
| ServiceDeskId_s| Number |
| IncidentState_s | State |
| Urgency_s |Urgency |
| Impact_s |Impact|
| Priority_s | Priority |
| CreatedBy_s | Opened by |
| ResolvedBy_s | Resolved by|
| ClosedBy_s  | Closed by |
| Source_s| Contact type |
| AssignedTo_s | Assigned to  |
| Category_s | Category |
| Title_s|  Short description |
| Description_s|  Notes |
| CreatedDate_t|  Opened |
| ClosedDate_t| Closed|
| ResolvedDate_t|Resolved|
| Computer  | Configuration item |

### Output data for a ServiceNow change request

| Log Analytics | ServiceNow field |
|:--- |:--- |
| ServiceDeskId_s| Number |
| CreatedBy_s | Requested by |
| ClosedBy_s | Closed by |
| AssignedTo_s | Assigned to  |
| Title_s|  Short description |
| Type_s|  Type |
| Category_s|  Category |
| CRState_s|  State|
| Urgency_s|  Urgency |
| Priority_s| Priority|
| Risk_s| Risk|
| Impact_s| Impact|
| RequestedDate_t  | Requested by date |
| ClosedDate_t | Closed date |
| PlannedStartDate_t  | Planned start date |
| PlannedEndDate_t  | Planned end date |
| WorkStartDate_t  | Actual start date |
| WorkEndDate_t | Actual end date|
| Description_s | Description |
| Computer  | Configuration item |

## Next steps

[Troubleshooting problems in ITSM Connector](./itsmc-resync-servicenow.md)
