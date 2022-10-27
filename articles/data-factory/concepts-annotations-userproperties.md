---
title: Monitor with annotations and user properties
description: Advanced monitoring with annotations and user properties
author: olmoloce
ms.author: olmoloce
ms.reviewer: olmoloce
ms.service: data-factory
ms.subservice: monitoring
ms.topic: conceptual
ms.date: 10/27/2022
---

# Monitor with annotations and user properties

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

## Annotations

Azure Data Factory annotations are tags that you can add to your Azure Data Factory or Azure Synapse Analytics entities to easly identify them. 
A anotation allows you to classify or group different entities in order to easily monitor or filter them after an execution.
Anotations only allow you to define static values and can be added to pipelines, datasets, linked services and triggers.

## User Properties

User properties are key-value pairs defined at the activity level. By adding user properties, you can view additional information about activities under activity runs window that may help you to monitor your activity executions.
User properties allow you to define dynamic values and can be added to any activity, up to 5 per activity, under User Properties tab.

## How to use annotations and user properties

As we discussed, annotations are static values that you can asign to pipelines, datasets, linked services, and triggers. Let's assume you want to filter for pipelines that belong to the same business unit or project name. We will first create the annotation. Click on the Properties icon, + New button and name your annotation appropriately. We advise being consitent with your naming.

![Create Annotation!](./media/concepts-annotations-userproperties/CreateAnnotations1.png "Create Annotation")

When you go to the Monitor tab, you can filter under Pipeline runs for this Annotation:

![Monitor Annotations!](./media/concepts-annotations-userproperties/MonitorAnnotations.png "Monitor Annotations")

If you want to monitor for dynamic values at the activity level, you can do so by leveraging the User properties. You can add these under any activity by clicking on the Activity box, User properties tab and the + New button:

![Create User Properties!](./media/concepts-annotations-userproperties/CreateUserProperties.png "Create User Properties")

For Copy Activity specifically, you can auto-generate these:

![Copy Activity User Properties!](./media/concepts-annotations-userproperties/CopyActivityUserProperties.png "Copy Activity User Properties")

To monitor User properties, go to the Activity runs monitoring view. Here you will see all the properties you added.

![Monitor User Properties](./media/concepts-annotations-userproperties/MonitorUserProperties.png "Monitor User Properties")

You can remove some from the view if you click on the Bookmark sign:

![Remove User Properties](./media/concepts-annotations-userproperties/RemoveUserProperties.png "Remove User Properties")

## Next steps

To learn more about monitoring see [Visually monitor Azure Data Factory](./monitor-visually.md)
