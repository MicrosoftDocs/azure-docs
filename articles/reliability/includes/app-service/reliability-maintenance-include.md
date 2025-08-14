---
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/17/2025
 ms.author: anaharris
 ms.custom: include file
---
App Service performs regular service upgrades and other maintenance tasks. To maintain your expected capacity during an upgrade, the platform automatically adds extra instances of the App Service plan during the upgrade process.

**Enable zone redundancy.** When you enable zone redundancy on your App Service plan, you also improve resiliency during platform updates. *Update domains* consist of collections of VMs that go offline during an update, and they map to availability zones. Deploying multiple instances in your App Service plan and enabling zone redundancy for your plan adds an extra layer of resiliency if an instance or zone becomes unhealthy during an upgrade.
