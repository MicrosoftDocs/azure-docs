---
 title: include file
 description: include file
 services: azure-resource-manager
 author: tfitzmac
 ms.service: azure-resource-manager
 ms.topic: include
 ms.date: 03/13/2018
 ms.author: tomfitz
 ms.custom: include file
---

You apply tags to your Azure resources giving metadata to logically organize them into a taxonomy. Each tag consists of a name and a value pair. For example, you can apply the name "Environment" and the value "Production" to all the resources in production.

After you apply tags, you can retrieve all the resources in your subscription with that tag name and value. Tags enable you to retrieve related resources from different resource groups. This approach is helpful when you need to organize resources for billing or management.

Your taxonomy should consider a self-service metadata tagging strategy in addition to an auto-tagging strategy to reduce the burden on users and increase accuracy.

The following limitations apply to tags:

* Each resource or resource group can have a maximum of 15 tag name/value pairs. This limitation applies only to tags directly applied to the resource group or resource. A resource group can contain many resources that each have 15 tag name/value pairs. If you have more than 15 values that you need to associate with a resource, use a JSON string for the tag value. The JSON string can contain many values that are applied to a single tag name. This article shows an example of assigning a JSON string to the tag.
* The tag name is limited to 512 characters, and the tag value is limited to 256 characters. For storage accounts, the tag name is limited to 128 characters, and the tag value is limited to 256 characters.
* Virtual Machines are limited to a total of 2048 characters for all tag names and values.
* Tags applied to the resource group are not inherited by the resources in that resource group.
* Tags can't be applied to classic resources such as Cloud Services.
* Tag names can't contain these characters: `<`, `>`, `%`, `&`, `\`, `?`, `/`
