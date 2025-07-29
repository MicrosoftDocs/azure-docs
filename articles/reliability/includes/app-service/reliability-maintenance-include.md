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
Azure App Service performs regular service upgrades, as well as other forms of maintenance. To ensure that your expected capacity is available during an upgrade, the platform automatically adds extra instances of the App Service plan during the upgrade process.

**Enable zone redundancy.** When you enable zone redundancy on your App Service plan, you also improve your resiliency to updates that the App Service platform rolls out. *Update domains* consist of collections of virtual machines (VMs) that are taken offline at the time of an update. Update domains are tied to availability zones. Deploying multiple instances in your App Service plan and enabling zone redundancy for your plan adds an extra layer of resiliency during upgrades if an instance or zone becomes unhealthy.
