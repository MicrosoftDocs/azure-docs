---
 title: include file
 description: include file
 services: event-grid
 author: robece
 ms.service: event-grid
 ms.topic: include
 ms.date: 10/18/2023
 ms.author: robece
ms.custom:
  - include file
  - ignite-2023
---

## Namespace

An Event Grid namespace is a declarative space that provides a scope to all the nested resources or subresources such as topics, certificates, clients, client groups, topic spaces, permission bindings.  

| Resource   | Protocol supported |
| :--- | :---: |
| Namespace topics | HTTP |
| Topic Spaces | MQTT |
| Clients | MQTT |
| Client Groups | MQTT |
| CA Certificates | MQTT |
| Permission bindings | MQTT |

Using the namespace, you can organize the subresources into logical groups and manage them as a single unit in your Azure subscription.  Deleting a namespace deletes all the subresources in the namespace.

It gives you a unique fully qualified domain name (FQDN).  A namespace exposes two endpoints:

- An HTTP endpoint to support general messaging requirements using Namespace Topics.
- An MQTT endpoint for IoT messaging or solutions that use MQTT.
  
A namespace also provides DNS-integrated network endpoints and a range of access control and network integration management features such as IP ingress filtering and private links. It's also the container of managed identities used for all contained resources that use them.

Namespace is a tracked resource with `tags` and `location` properties, and once created, it can be found on `resources.azure.com`.  

The name of the namespace can be 3-50 characters long.  It can include alphanumeric, and hyphen(-), and no spaces.  The name needs to be unique per region.

**Current supported regions:** Central US, East Asia, East US, East US 2, North Europe, South Central US, Southeast Asia, UAE North, West Europe, West US 2, West US 3.

## Throughput units

Throughput units (TUs) control the capacity of Azure Event Grid namespace and allow user to control capacity of their namespace resource for message ingress and egress. For more information about limits, see [Azure Event Grid quotas and limits](../quotas-limits.md).
