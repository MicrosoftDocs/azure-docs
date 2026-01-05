---
 title: Description of Azure Storage availability zone zone-down experience - expected downtime
 description: Description of Azure Storage availability zone zone-down experience - expected downtime
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

A small amount of downtime, typically, a few seconds, might occur during automatic recovery as traffic is redirected to healthy zones. When you design applications for ZRS, follow practices for [transient fault handling](#resilience-to-transient-faults), including implementing retry policies with exponential back-off.
