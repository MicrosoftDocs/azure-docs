---
title: 'Azure Event Grid namespace MQTT client groups'
description: 'Describes MQTT client group configuration.'
ms.topic: conceptual
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 05/23/2023
author: veyaddan
ms.author: veyaddan
---

# Client groups
Client groups allow you to group a set of client together based on commonalities.  The main purpose of client groups is to make configuring authorization easy.  You can authorize a client group to publish or subscribe to a topic space.  All the clients in the client group are authorized to perform the publish or subscribe action on the topic space.



In a namespace, we provide a default client group named "$all".  The client group includes all the clients in the namespace.  For ease of testing, you can use $all to configure permissions.

> [!NOTE]
> - Client group name can be 3-50 characters long
> - Client group name can include alphanumeric, hyphen(-) and, no spaces
> - Client group name needs to be unique per namespace
> - `$all` is the default client group that includes all the clients in the namespace. This group cannot be edited or deleted

## Client group considerations

You should keep the quantity of client groups small to make permissions manageable.

Currently, a maximum of 10 client groups per namespace as supported.

While grouping clients, ensure that it's easier to reuse the group to publish and subscribe across multiple topic spaces.  To this end, it's important to think through the end-to-end scenarios to identify the topics every client publishes or subscribes to.  

We recommend identifying the commonalities across the scenarios, to avoid over fragmentation of client groups and topic spaces.  Set the client attributes generic enough to achieve simple grouping and avoid highly complex group queries.

## How to create client group queries?

To set up a client group, you need to build a query that filters a set of clients based on their attribute values.

Here are a few sample queries:
- (attributes.sensors = "motion" or attributes.sensors = "humidity") or attributes.type = "home-sensors"
- attributes.sensors IN ["motion", "humidity", "temperature"] and attributes.floor <= 5
- authenticationName IN ['client1', 'client2']

In group queries, following operands are allowed:
- Equality operator "="
- Not equal operator in two forms "<>" and "!="
- Less than "<", greater than ">", less than equal to "<=", greater than equal to ">=" for long integer values
- "IN" to compare with a set of values

**Sample client group schema**

```json
{
  "properties": {
    "description": "Description of client group",
    "query": "attributes.b IN ['a', 'b', 'c']"
  }
}
```

### Azure portal configuration
Use the following steps to create a client group:

1. Go to your namespace in the Azure portal
2. Under Client groups, select **+ Client group**.

    :::image type="content" source="./media/mqtt-client-groups/mqtt-add-new-client-group.png" alt-text="Screenshot of adding a client group." lightbox="./media/mqtt-client-groups/mqtt-add-new-client-group.png":::
1. Add client group query.

    :::image type="content" source="./media/mqtt-client-groups/mqtt-client-group-metadata.png" alt-text="Screenshot of client group configuration." lightbox="./media/mqtt-client-groups/mqtt-client-group-metadata.png":::
4. Select **Create**

### Azure CLI configuration
Use the following commands to create/show/delete a client group

**Create client group**
```azurecli-interactive
az resource create --resource-type Microsoft.EventGrid/namespaces/clientGroups --id /subscriptions/`Subscription ID`/resourceGroups/`Resource Group`/providers/Microsoft.EventGrid/namespaces/`Namespace Name`/clientGroups/`Client Group Name` --api-version 2023-06-01-preview --properties @./resources/CG.json
```

**Get client group**
```azurecli-interactive
az resource show --id /subscriptions/`Subscription ID`/resourceGroups/`Resource Group`/providers/Microsoft.EventGrid/namespaces/`Namespace Name`/clientGroups/`Client group name` |
```

**Delete client group**
```azurecli-interactive
az resource delete --id /subscriptions/`Subscription ID`/resourceGroups/`Resource Group`/providers/Microsoft.EventGrid/namespaces/`Namespace Name`/clientGroups/`Client group name` |
```

## Next steps
- Learn about [topic spaces](mqtt-topic-spaces.md)
