---
title: Govern resources for client applications with application groups
description: Learn how to use application groups to govern resources for client applications that connect with Event Hubs. 
ms.topic: how-to
ms.custom: subject-monitoring
ms.date: 05/24/2022
---

# Govern resources for client applications with application groups
Azure Event Hubs enables you to govern event streaming workloads for client applications that connect to Event Hubs by using **application groups**. For more information, see [Resource governance with application groups](resource-governance-overview.md). 

This article shows you how to perform the following tasks:

- Create an application group.
- Enable or disable an application group
- Apply throttling policies to an application group

## Create an application group

You can create an application group using the Azure portal as illustrated below. When you create the application group, you should associate it to either a shared access signatures (SAS) or Azure Active Directory(Azure AD) application ID, which is used by client applications. 

:::image type="content" source="./media/resource-governance-with-app-groups/add-app-group.png" alt-text="Screenshot of the Create an application group page in the Azure portal.":::

For example, you can create application group `contosoAppGroup` associating it with SAS policy `contososaspolicy`. 

## Apply throttling policies
You can add zero or more policies when you create an application group or to an existing application group. 

For example, you can add throttling policies related to `IncomingMessages`, `IncomingBytes` or `OutgoingBytes` to the `contosoAppGroup`. These policies will get applied to event streaming workloads of client applications that use the SAS policy `contososaspolicy`. 

## Publish or consume events 
Once you successfully add throttling policies to the application group, you can test the throttling behavior by either publishing or consuming events using client applications that are part of the `contosoAppGroup` application group. For that, you can use either an [AMQP client](event-hubs-dotnet-standard-getstarted-send.md) or a [Kafka client](event-hubs-quickstart-kafka-enabled-event-hubs.md) application and same SAS policy name or Azure AD application ID that's used to create the application group. 

> [!NOTE]
> When your client applications are throttled, you should experience a slowness in publishing or consuming data. 

## Enable or disable application groups 
You can prevent client applications accessing your Event Hubs namespace by disabling the application group that contains those applications. When the application group is disabled, client applications won't be able to publish or consume data. Any established connections from client applications of that application group will also be terminated. 


## Create application groups using Resource Manager templates
You can also create an application group using the Azure Resource Manager (ARM) templates. 

The following example shows how to create an application group using an ARM template. In this exmaple, the application group is associated with an existing SAS policy name `contososaspolicy` by setting the client `AppGroupIdentifier` as `SASKeyName=contososaspolicy`. The application group policies are also defined in the ARM template. 


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
		"ClientAppGroupIdentifier": "SASKeyName=contososaspolicy",
		"policies": [{
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

## Next steps
For conceptual information on application groups, see [Resource governance with application groups](resource-governance-overview.md). 
