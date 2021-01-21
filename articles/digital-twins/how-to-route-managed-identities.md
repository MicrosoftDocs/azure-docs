---
# Mandatory fields.
title: Route events using managed identities
titleSuffix: Azure Digital Twins
description: See how to enable a system-assigned identity for Azure Digital Twins and use it to forward events.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 1/21/2021
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Route events using managed identities 

This article describes how to enable system-assigned identity for Azure Digital Twins instance and use it to forward events to supported destinations such as EventHub and ServiceBus destinations, and Azure Storage Container.  

Here are the steps that are covered in detail in this article: 

1. Create an Azure Digital Twins instance with a system-assigned identity or enable system-assigned identity on an existing Azure Digital Twins instance. 
1. Add an appropriate role[s] to the identity. For example, assign the Azure Event Hub Data Sender role to the identity if the endpoint is Event Hub. If the endpoint is Service Bus, use Azure Service Bus Data Sender role. 
1. When you create custom-endpoints, enable the usage of system-assigned identity to authenticate to custom-endpoints for forwarding events. 

## Create an Azure Digital Twins instance with a system-assigned identity 

First, let's look at how to and Azure Digital Twins instance with a system-managed identity. 

### Use the Azure portal 

*to-do* 

### Enable system-assigned identity on an existing for an existing Azure Digital Twins instance 

In the previous section, you learned how to enable a system-managed identity while you created an Azure Digital Twins instance. In this section, you will learn how to enable a system-managed identity on an existing Azure Digital Twins instance. 

### Use the Azure portal 

*to-do*

## Supported destinations and Azure roles 

After you enable system-assigned identity on your Azure Digital Twins instance, Azure automatically creates an identity in Azure Active Directory. Assign to this identity appropriate Azure roles so that the Azure Digital Twins instance can forward events to supported destinations. For example, assign the Azure Event Hub Data Sender role to the identity if the endpoint is Event Hub. 

This table also gives you the roles that the identity should be in so that the Azure Digital Twin instance can forward the events. 

| Destination | Azure role |
| --- | --- |
| Azure Event Hubs | Azure Event Hub Data Sender |
| Service Bus | Azure Service Bus Data Sender |
| Azure Storage Container | *to-do* |

## Assign Azure roles to the identity 

This section describes how to assign Azure role(s) to the system-assigned identity.

### Use the Azure portal 

*to-do*

### Enable system-assigned identity to authenticate to custom-endpoints for forwarding events 

Use the Azure portal 

*to-do*

## Next steps

Read about the different types of event messages you can receive:
* [*How-to: Interpret event data*](how-to-interpret-event-data.md)
