---
 title: include file
 description: include file
 services: azure-resource-manager
 author: tfitzmac
 ms.service: azure-resource-manager
 ms.topic: include
 ms.date: 02/19/2018
 ms.author: tomfitz
 ms.custom: include file
---

When deploying resources to Azure, you have tremendous flexibility when deciding what types of resources to deploy, where they are located, and how to set them up. However, that flexibility may open more options than you would like to allow in your organization. As you consider deploying resources to Azure, you might be wondering:

* How do I meet legal requirements for data sovereignty in certain countries/regions?
* How do I control costs?
* How do I ensure that someone does not inadvertently change a critical system?
* How do I track resource costs and bill it accurately?

This article addresses those questions. Specifically, you:

> [!div class="checklist"]
> * Assign users to roles and assign the roles to a scope so users have permission to perform expected actions but not more actions.
> * Apply policies that prescribe conventions for resources in your subscription.
> * Lock resources that are critical to your system.
> * Tag resources so you can track them by values that make sense to your organization.

This article focuses on the tasks you take to implement governance. For a broader discussion of the concepts, see [Governance in Azure](../articles/security/governance-in-azure.md). 
