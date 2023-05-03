---
title: 'Azure Event Grid namespace MQTT clients and client groups'
description: 'Describes MQTT client and client group configuration.'
ms.topic: conceptual
ms.date: 04/26/2023
author: veyaddan
ms.author: veyaddan
---

# MQTT clients and client groups
In this article, you learn about configuring MQTT clients and client groups.

## Clients
Clients can be devices or applications, such as devices or vehicles that send/receive MQTT messages.

For example, consider a fleet management company with hundreds of trucks and other shipment delivery vehicles.  You can improve their routing, tracking, driver safety and predictable maintenance capabilities by sending and receiving MQTT messages to/from a cloud service.

In this scenario, vehicles can be configured as clients that publish/subscribe to various topics such as weather information, road conditions, geo location, engine performance and other wear-and-tear aspects of the vehicle. And, while configuring the vehicle as a client, a set of attributes such as vehicle type, year, make & model, max load capacity, etc. can also be included in the client metadata.

### What are client attributes?

Client attributes are a set of user defined key-value pairs or tags that provide information about the client. 

These client attributes can be used to create the client groups. For example, you can group all the vehicles of type semi-trucks into one group and all the vehicles of type pickup-trucks into another.

These attributes are used in the client group queries to filter a set of clients.  Attributes could be describing the physical or functional characteristics of the client.  Typical attribute could be "type" of the client.

Here's an example:

- Type: Values could be "sensor" or "thermostat" or "vehicle"

Here’s a sample schema for the client with attribute definition:

```json
{  
    "id": "device123",  
    "attributes": {  
        "type": "home-sensors",
        "sensors": ["motion", "noise", "light"]
     }
}
```

While configuring the client attributes, consider the topics that the clients publish (subscribe) to.  Thinking backwards from topics to clients helps identify the commonalities across client roles easier and defining the client attributes to make the client grouping simpler.

### Client schema

```json
{ 
    "name": "xyz",   
    "properties": { 
        "state": "Enabled",         
        "authenticationName": "@abc_123:y", // This is a unique client identity name, case insensitive. defaults to ARM name if not provided.   
            "clientCertificateAuthentication": { 
                "validationScheme": "SubjectMatchesAuthenticationName", // Required, Possible Values: [ThumbprintMatch, SubjectMatchesAuthenticationName, DnsMatchesAuthenticationName, UriMatchesAuthenticationName, IpMatchesAuthenticationName, EmailMatchesAuthenticationName]" 
                "allowedThumbprints": [ 
                    "xxxx", 
                    "yyyy" 
                ] // Only relevant for ThumbprintMatch, Max of 2
            },
     }, 
     "attributes": { 
     "attribute1": 123, 
     "arrayAttribute": [ 
           "value1", 
           "value2", 
           "value3" 
         ] 
     }, 
     "description": "Add description here" 
} 
```

### Sample contracts

Example for certificate chain based client authentication

```json
{
    "properties": {
        "authenticationName": "127.0.0.1",
        "state": "Enabled",
        "clientCertificateAuthentication": {
            "validationScheme": "IpMatchesAuthenticationName"
        },
        "attributes": {
            "room": "345",
            "floor": 3,
            "bldg": "17"
        },
        "description": "Description of the client"
    }
}
```

Example for self-signed certificate thumbprint based client authentication

```json
{
    "properties": {
        "authenticationName": "abcd@domain.com-1",
        "state": "Enabled",
        "clientCertificateAuthentication": {
            "validationScheme": "ThumbprintMatch",
            "allowedThumbprints": ["primary", "secondary"]
        },
        "attributes": {
            "room": "345",
            "floor": "3",
            "bldg": 17
        },
        "description": "Description of the client"
    }
}
```

> [!NOTE]
> - clientCertificateAuthentication is always required with a valid value of validationScheme.
> - authenticationName is not required, but after the first create request, authenticatioName value defaults to ARM name, and then it can not be updated.
> - authenticationName can not be updated.
> - If validationScheme is anything other than ThumbprintMatch, then allowedThumbprints list can not be provided.
> - allowedThumbprints list can only be provided and must be provided if validationScheme is ThumbprintMatch with atleast one thumbprint.
> - allowedThumbprints can only hold maximum of 2 thumbprints.
> - Allowed validationScheme values are SubjectMatchesAuthenticationName, DnsMatchesAuthenticationName, UriMatchesAuthenticationName, IpMatchesAuthenticationName, EmailMatchesAuthenticationName, ThumbprintMatch
> - Using thumbprint with allow reuse of the same certificate across multiple clients.  For other types of validation, the authentication name needs to be in the chosen field of the client certificate.

### Azure portal configuration
Use the following steps to create a client:

- Go to your namespace in the Azure portal
- Under Clients, select **+ Client**.

:::image type="content" source="./media/mqtt-clients-and-client-groups/mqtt-add-new-client.png" alt-text="Screenshot of adding a client.":::

- Choose the client certificate authentication validation scheme.  For more information about client authentication configuration, see [client authentication](mqtt-client-authentication.md) article.

- Add client attributes.

:::image type="content" source="./media/mqtt-clients-and-client-groups/mqtt-client-metadata-with-attributes.png" alt-text="Screenshot of client configuration.":::

- Select **Create**


### Azure CLI configuration
Use the following commands to create/show/delete a client

**Create client**
```azurecli-interactive
 az resource create --resource-type Microsoft.EventGrid/namespaces/clients --id /subscriptions/`Subscription ID`/resourceGroups/`Resource Group`/providers/Microsoft.EventGrid/namespaces/`Namespace Name`/clients/`Client name` --api-version 2023-06-01-preview --properties @./resources/client.json
```

**Get client**
```azurecli-interactive
az resource show --id /subscriptions/`Subscription ID`/resourceGroups/`Resource Group`/providers/Microsoft.EventGrid/namespaces/`Namespace Name`/clients/`Client name`
```

**Delete client**
```azurecli-interactive
az resource delete --id /subscriptions/`Subscription ID`/resourceGroups/`Resource Group`/providers/Microsoft.EventGrid/namespaces/`Namespace Name`/clients/`Client name`
```

## Client groups
Client groups allow you to group a set of client together based on commonalities.  The main purpose of client groups is to make configuring authorization easy.  You can authorize a client group to publish or subscribe to a topic space.  All the clients in the client group are authorized to perform the publish or subscribe action on the topic space.

In a namespace, we provide a default client group named "$all".  The client group includes all the clients in the namespace.  For ease of testing, you can use $all to configure permissions.

### Client group considerations

You should keep the quantity of client groups small to make permissions manageable.

Currently, a maximum of 10 client groups per namespace as supported.

While grouping clients, ensure that it's easier to reuse the group to publish and subscribe across multiple topic spaces.  To this end, it's important to think through the end-to-end scenarios to identify the topics every client publishes or subscribes to.  

We recommend identifying the commonalities across the scenarios, to avoid over fragmentation of client groups and topic spaces.  Set the client attributes generic enough to achieve simple grouping and avoid highly complex group queries.

### How to create client group queries?

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

### Sample client group schema

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

- Go to your namespace in the Azure portal
- Under Client groups, select **+ Client group**.

:::image type="content" source="./media/mqtt-clients-and-client-groups/mqtt-add-new-client-group.png" alt-text="Screenshot of adding a client group.":::

- Add client group query.

:::image type="content" source="./media/mqtt-clients-and-client-groups/mqtt-client-group-metadata.png" alt-text="Screenshot of client group configuration.":::

- Select **Create**

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
- Learn about [client authentication](mqtt-client-authentication.md)
