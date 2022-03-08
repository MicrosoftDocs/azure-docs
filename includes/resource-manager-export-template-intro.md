---
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: include
ms.date: 12/16/2021
ms.author: tomfitz
---

To assist with creating Azure Resource Manager templates, you can export a template from existing resources. The exported template helps you understand the JSON syntax and properties that deploy your resources. To automate future deployments, start with the exported template and modify it for your scenario. The export template process attempts to create a usable template. However, most exported templates require some modifications before they can be used to deploy Azure resources.

Resource Manager enables you to pick one or more resources for exporting to a template. You can focus on exactly the resources you need in the template.