---
author: mcleanbyron
ms.service: service-connector
ms.topic: include
ms.date: 07/24/2025
ms.author: malev
author: maud-lv
---

*Microsoft.ServiceLinker* is the name of Service Connector's resource provider.

When you open the Service Connector tab in the Azure portal, the ServiceLinker [resource provider](/azure/azure-resource-manager/management/overview#terminology) is registered in your active subscription. The user who generated the registration is listed as the initiator of the registration event.

Service Connector lets you connect services across subscriptions. When you create a connection to a target service registered in another subscription, Service Linker also gets registered in the target service's subscription. This registration occurs when you select the **Review + create** tab before creating the connection.
