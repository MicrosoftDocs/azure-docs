---
author: mcleanbyron
ms.service: service-connector
ms.topic: include
ms.date: 01/12/2021
ms.author: malev
author: maud-lv
---

Microsoft.ServiceLinker is the name of Service Connector's resource provider.

When a user opens the Service Connector tab in the Azure portal, the ServiceLinker [resource provider](/azure/azure-resource-manager/management/overview#terminology) is automatically registered in the user's active subscription. The user who generated the registration is listed as the initiator of the registration event.

Service Connector lets users connect services across subscriptions. When a user creates a connection to a target service registered in another subscription, Service Linker also gets registered in the target service's subscription. This registration occurs when the user selects the **Review + create** tab before finally creating the connection.
