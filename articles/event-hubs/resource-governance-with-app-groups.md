---
title: Govern resources for client applications with Application Groups
description: Learn how to use application groups to govern resources for client applications that connects with Event Hubs. 
ms.topic: conceptual
ms.custom: subject-monitoring
ms.date: 02/10/2022
---

# Govern resources for client applications with Application Groups
Azure Event Hubs enables you to govern the event streaming workloads of each client application that connects to Event Hubs by using *Application Groups*. 

For more information, see [Resource governance with application groups](event-hubs-resource-governance-overview.md). 

## Creating an Application Group

You can create an application group using the Azure portal as illustrated below. When you create the application group you should associate it to either a shared access signatures (SAS) or Azure Active Directory(Azure AD) application id which is used by the client applications. 

:::image type="content" source="./media/resource-governance-with-app-groups/add-app-group.png" alt-text="Creating Application Group using Azure portal":::

For example, you can create application group `contosoAppGroup` associating it with SAS policy `contoso`. 

## Apply throttling policies
You can add zero or more application group policies when you create the application group or to an existing application group. 

In our example, you can add throttling policies related to `IncomingMessages`, `IncomingBytes` or `OutgoingBytes` to the `contosoAppGroup`. These policies will get applied for the event streaming workloads of the client applications that uses the SAS policy `contoso`. 

## Publish or consume events 
Once you successfully add throttling policies to the application group, you can test the throttling behavior by either publishing or consuming events using client applications that are part of the `contosoAppGroup` application group. For that you can use either [AMQP client](event-hubs-dotnet-standard-getstarted-send.md) or [Kafka client](event-hubs-quickstart-kafka-enabled-event-hubs.md) application and same SAS policy name or Azure AD application id that is used to create the application group. 

When your client applications are throttled, you should experience a slowness in publishing or consuming data. 


## Enabling/disabling application groups 
You can prevent client applications accessing the Event Hubs by disabling the application group. When the application group is disabled, client applications won't be able to publish or consume data. Any established connections from client applications of that application group will also be terminated. 


## Application Groups with Azure Resource Manager Templates 
You can also create an application group using the Azure Resource Manager(ARM) templates. 

In the following example, we are creating an application group using ARM templates. We have associated the application group that we create with an existing SAS policy name `contoso` by setting the client `AppGroupIdentifier` as `SASKeyName=contoso`. The application group policies are also defined in the ARM template. 


```json
{
    "type": "ApplicationGroups",
    "apiVersion": "2022-01-01-preview",
    "name": "[parameters('applicationGroupName')]",
    "dependsOn": [
    "[resourceId('Microsoft.EventHub/namespaces/', parameters('eventHubNamespaceName'))]",
    "[resourceId('Microsoft.EventHub/namespaces/authorizationRules', parameters('eventHubNamespaceName'),parameters('namespaceAuthorizationRuleName'))]"
    ],
    "properties": {
    "ClientAppGroupIdentifier": "SASKeyName=contoso",
    "policies": [
        {
        "Type": "ThrottlingPolicy",
        "Name": "ThrottlingPolicy1",
        "metricId": "IncomingMessages",
        "rateLimitThreshold": 10
        },
        {
        "Type": "ThrottlingPolicy",
        "Name": "ThrottlingPolicy2",
        "metricId": "IncomingBytes",
        "rateLimitThreshold": 3951729
        }
    ],
    "isEnabled": true
    }
}
```

