---
title: Impact of deleting Microsoft Purview account on access policies (preview)
description: This guide discusses the consequences of deleting a Microsoft Purview account on published access policies
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: conceptual
ms.date: 11/16/2022
ms.custom:
---
# Impact of deleting Microsoft Purview account on access policies

## Important considerations 
Deleting a Microsoft Purview account that has active (that is, published) policies will remove those policies. This means that the access to data sources or datasets that was previously provisioned via those policies will also be removed. This can lead to outages, that is, users or groups in your organization not able to access critical data. Review the decision to delete the Microsoft Purview account with the people in Policy Author role at root collection level before proceeding. To find out who holds that role in the Microsoft Purview account, review the section on managing role assignments in this [guide](./how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

Before deleting the Microsoft Purview account, it's advisable that you provision access to the users in your organization that need access to datasets using an alternate mechanism or a different Purview account. Then orderly delete or unpublish any active policies
* [Deleting DevOps policies](how-to-policies-devops-authoring-generic.md#delete-a-devops-policy) - You'll need to delete DevOps policies for them to be unpublished.
* [Unpublishing Data Owner policies](how-to-policies-data-owner-authoring-generic.md#unpublish-a-policy).
* [Deleting Self-service access policies](how-to-delete-self-service-data-access-policy.md) - You'll need to delete Self-service access policies for them to be unpublished.

## Next steps
Check these concept guides
* [DevOps policies](concept-policies-devops.md) 
* [Data owner access policies](concept-policies-data-owner.md)
* [Self-service access policies](concept-self-service-data-access-policy.md)