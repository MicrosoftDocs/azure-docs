---
title: Azure Resource Graph Sample Queries for Azure Orbital Ground Station
description: Provides a collection of Azure Resource Graph sample queries for Azure Orbital Ground Station.
author: kellydevens
ms.service: orbital
ms.topic: how-to
ms.custom: ga
ms.date: 09/08/2023
ms.author: kellydevens
---

# Azure Resource Graph sample queries for Azure Orbital Ground Station

This page is a collection of [Azure Resource Graph](../governance/resource-graph/overview.md)
sample queries for Azure Orbital Ground Station. For a complete list of Azure Resource Graph samples, see
[Resource Graph samples by Category](../governance/resource-graph/samples/samples-by-category.md)
and [Resource Graph samples by Table](../governance/resource-graph/samples/samples-by-table.md).

## Sample queries

### List Upcoming Contacts
#### Sorted by reservation start time

```kusto
OrbitalResources  
| where type == 'microsoft.orbital/spacecrafts/contacts' and todatetime(properties.reservationStartTime) >= now()
| sort by todatetime(properties.reservationStartTime)
| extend Contact_Profile = tostring(split(properties.contactProfile.id, "/")[-1])
| extend Spacecraft = tostring(split(id, "/")[-3])
| project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Status=properties.status, Provisioning_Status=properties.provisioningState
```

#### Sorted by ground station

```kusto
OrbitalResources 
| where type == 'microsoft.orbital/spacecrafts/contacts' and todatetime(properties.reservationStartTime) >= now() 
| sort by tostring(properties.groundStationName) 
| extend Contact_Profile = tostring(split(properties.contactProfile.id, "/")[-1]) 
| extend Spacecraft = tostring(split(id, "/")[-3]) 
| project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Reservation_Start_Time = todatetime(properties.reservationStartTime), Reservation_End_Time = todatetime(properties.reservationEndTime), Status=properties.status, Provisioning_Status=properties.provisioningState 
```

#### Sorted by contact profile

```kusto
OrbitalResources 
| where type == 'microsoft.orbital/spacecrafts/contacts' 
| where todatetime(properties.reservationStartTime) >= now()
| extend Contact_Profile = tostring(split(properties.contactProfile.id, "/")[-1]) 
| sort by Contact_Profile 
| extend Spacecraft = tostring(split(id, "/")[-3]) 
| project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Reservation_Start_Time = todatetime(properties.reservationStartTime), Reservation_End_Time = todatetime(properties.reservationEndTime), Status=properties.status, Provisioning_Status=properties.provisioningState
```

### List Contacts from Past ‘x’ Days

#### Sorted by reservation start time 

```kust
OrbitalResources  
| where type == 'microsoft.orbital/spacecrafts/contacts' and todatetime(properties.reservationStartTime) >= now(-1d)  
| sort by todatetime(properties.reservationStartTime)  
| extend Contact_Profile = tostring(split(properties.contactProfile.id, "/")[-1]) 
| extend Spacecraft = tostring(split(id, "/")[-3]) 
| project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Reservation_Start_Time = todatetime(properties.reservationStartTime), Reservation_End_Time = todatetime(properties.reservationEndTime), Status=properties.status, Provisioning_Status=properties.provisioningState 
```

#### On a specified ground station 

This query will help customers track all the past contacts sorted by reservation start time for a specified ground station. 

```kusto
OrbitalResources 
| where type == 'microsoft.orbital/spacecrafts/contacts' and todatetime(properties.reservationStartTime) >= now(-1d) and properties.groundStationName == 'Microsoft_Gavle' 
| sort by todatetime(properties.reservationStartTime) 
| extend Contact_Profile = tostring(split(properties.contactProfile.id, "/")[-1]) 
| extend Spacecraft = tostring(split(id, "/")[-3]) 
| project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Reservation_Start_Time = todatetime(properties.reservationStartTime), Reservation_End_Time = todatetime(properties.reservationEndTime), Status=properties.status, Provisioning_Status=properties.provisioningState 
```

#### On specified contact profile 

This query will help customers track all the past contacts sorted by reservation start time for a specified contact profile.

```kusto
OrbitalResources  
| where type == 'microsoft.orbital/spacecrafts/contacts'  
| extend Contact_Profile = tostring(split(properties.contactProfile.id, "/")[-1])  
| where todatetime(properties.reservationStartTime) >= now(-1d) and Contact_Profile == 'test-CP'  
| sort by todatetime(properties.reservationStartTime)  
| extend Spacecraft = tostring(split(id, "/")[-3])  
| project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Reservation_Start_Time = todatetime(properties.reservationStartTime), Reservation_End_Time = todatetime(properties.reservationEndTime), Status=properties.status, Provisioning_Status=properties.provisioningState 
```
