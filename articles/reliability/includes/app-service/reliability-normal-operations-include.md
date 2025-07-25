---
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/17/2025
 ms.author: anaharris
 ms.custom: include file
---
The following section describes what to expect when you configure App Service plans for zone redundancy and all availability zones are operational:

- **Traffic routing between zones:** During normal operations, traffic is routed between all available App Service plan instances across all availability zones.

- **Data replication between zones:** During normal operations, any state stored in your application's file system is stored in zone-redundant storage and synchronously replicated between availability zones.
