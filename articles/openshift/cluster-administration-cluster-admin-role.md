---
title: Azure Red Hat OpenShift cluster administrator role | Microsoft Docs
description:  Azure Red Hat OpenShift cluster administrator role assignment and usage
services: container-service
author: mjudeikis
ms.author: b-majude
ms.author: jzim
ms.service: container-service
ms.topic: article
ms.date: 09/25/2019
#Customer intent: As a developer, I need to understand how to administer and Azure Red Hat cluster using administrative role
---

# Azure Red Hat OpenShift customer administrator role

As an ARO (Azure Red Hat OpenShift) cluster administrator of an OpenShift cluster, your account has increased permissions and access to all user-created projects.

When your account has the osa-customer-admins authorization role bound to it, can automatically manage a project

    Note: osa-customer-admin clusterrole is not the same as cluster-admin clusterrole

For example, you can execute actions associated with a set of verbs (`create`) to operate on a set of resource names (`templates`). To view the details of these roles and their sets of verbs and resources, run the following command:

`$ oc describe clusterrole/osa-customer-admin`

The verb names do not necessarily all map directly to oc commands, but rather equate more generally to the types of CLI operations you can perform. For example, having the `list` verb means that you can display a list of all objects of a given resource name (`oc get`), while the `get` verb means that you can display the details of a specific object if you know its name (`oc describe`).

## How to configure customer administrator role

Customer administrator role can be configured only during cluster creation by providing flag `--customer-admin-group-id`. How to configure Azure Active Directory and Administrators group follow how to guide: [Azure Active Directory integration for Azure Red Hat OpenShift](howto-aad-app-configuration.md)

## Next steps

How to configure osa-customer-admin role:
> [!div class="nextstepaction"]
> [Azure Active Directory integration for Azure Red Hat OpenShift](howto-aad-app-configuration.md)