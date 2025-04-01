---
 title: include file
 description: include file
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 11/11/2024
 ms.author: anaharris
 ms.custom: include file
---

Transient faults are short, intermittent failures in components. They occur frequently in a distributed environment like the cloud, and they're a normal part of operations. They correct themselves after a short period of time. It's important that your applications handle transient faults, usually by retrying affected requests.

All cloud-hosted applications should follow Azure's transient fault handling guidance when communicating with any cloud-hosted APIs, databases, and other components. To learn more about handling transient faults, see [Recommendations for handing transient faults](/azure/well-architected/reliability/handle-transient-faults).