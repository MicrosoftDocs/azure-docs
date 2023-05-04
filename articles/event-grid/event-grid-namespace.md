---
title: 'Azure Event Grid namespace overview'
description: 'Describes Event Grid namespace.'
ms.topic: conceptual
ms.date: 05/04/2023
author: veyaddan
ms.author: veyaddan
---

# Event Grid namespace

An Event Grid namespace is a declarative space that provides a scope to all the nested resources or subresources such as topics, certificates, clients, client groups, topic spaces, permission bindings.

Namespace is a tracked resource with 'tags' and a 'location' properties, and once created can be found on resources.azure.com.  

using the namespace, you can organize the subresources into logical groups and manage them as a single unit in your Azure subscription.  Deleting a namespace deletes all the subresources encompassed within the namespace.

## Next steps
- Learn about [creating an Event Grid namespace](create-view-manage-namespaces.md)
- Learn about [MQTT support in Event Grid](mqtt-overview.md)
- Learn about [pull subscription support in Event Grid](overview.md)
