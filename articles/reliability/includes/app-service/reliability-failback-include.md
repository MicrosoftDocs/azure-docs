---
 title: include file
 description: include file
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/17/2025
 ms.author: anaharris
 ms.custom: include file
---
When an availability zone is unavailable, App Service automatically creates temporary instances in the other availability zones. These temporary instances are used to route traffic to your application. The platform then distributes traffic across the new instances as needed.
When the availability zone recovers, App Service automatically creates instances in the recovered availability zone, removes any temporary instances created in the other availability zones, and routes traffic between your instances as usual.