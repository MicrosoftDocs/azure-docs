---
title: Azure Service Bus - guidance on maintenance 
description: This article helps you with preparing for planned maintenance events on your namespace in Azure Service Bus. 
ms.topic: how-to
ms.date: 07/10/2023
---

# Guidance on Azure maintenance events for Azure Service Bus
This article describes how you can prepare for planned maintenance events on your namespace in Azure Service Bus. 

## What is a planned maintenance event? 
To keep Azure Service Bus secure, compliant, stable, and performant, updates are being performed through the service components continuously. Thanks to the modern and robust service architecture and innovative technologies, most updates are fully transparent and non-impactful in terms of service availability. Still, a few types of updates cause short service interrupts and require special treatment.  

## What to expect during a planned maintenance event 
During planned maintenance, namespaces are moved to a redundant node that contains the latest updates. As this move happens, the clients SDK disconnects and reconnects automatically on the namespace. Usually, the upgrades happen within 30 seconds. 

## Retry logic 
Any client production application that connects to a Service Bus namespace should implement a robust connection [retry logic](/azure/architecture/best-practices/retry-service-specific#service-bus). Therefore, the updates are virtually transparent to the clients, or at least have minimal negative effects on clients. 

## Service health alert 
If you want to receive alerts for service issues or planned maintenance activities, you can use service health alerts in the Azure portal with appropriate event type and action groups. For more information, see [Receive alerts on Azure service notifications](/azure/service-health/alerts-activity-log-service-notifications-portal#create-service-health-alert-using-azure-portal). 

## Resource health 
If your namespace is experiencing connection failures, check the [Resource Health](/azure/service-health/resource-health-overview#get-started)  window in the [Azure portal](https://portal.azure.com/) for the current status. The **Health History** section contains the downtime reason for each event (when available). 

## Next steps 

- For more information about retry logic, see [Retry logic for Azure services](/azure/architecture/best-practices/retry-service-specific). 
- Learn more about handling transient faults in Azure at [Transient fault handling](/azure/architecture/best-practices/transient-faults). 
