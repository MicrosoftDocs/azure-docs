---
title: Azure Red Hat OpenShift cluster administrator role | Microsoft Docs
description:  Assignment and usage of the Azure Red Hat OpenShift cluster administrator role
services: container-service
author: mjudeikis
ms.author: jzim
ms.service: container-service
ms.topic: article
ms.date: 09/25/2019
#Customer intent: As a developer, I need to understand how to administer an Azure Red Hat cluster by using the administrative role
---

# Azure Red Hat OpenShift customer administrator role

You're the cluster administrator of an Azure Red Hat OpenShift cluster. Your account has increased permissions and access to all user-created projects.

When your account has the customer-admin-cluster authorization role bound to it, it can automatically manage a project.

> [!Note] 
> The customer-admin-cluster cluster role is not the same as the cluster-admin cluster role.

For example, you can execute actions associated with a set of verbs (`create`) to operate on a set of resource names (`templates`). To view the details of these roles and their sets of verbs and resources, run the following command:

`$ oc get clusterroles customer-admin-cluster -o yaml`

The verb names don't necessarily all map directly to `oc` commands. They equate more generally to the types of CLI operations that you can perform. 

For example, having the `list` verb means that you can display a list of all objects of a resource name (`oc get`). The `get` verb means that you can display the details of a specific object if you know its name (`oc describe`).

## Configure the customer administrator role

You can configure the customer-admin-cluster cluster role only during cluster creation by providing the flag `--customer-admin-group-id`. This field is not currently configurable in the Azure portal. To learn how to configure Azure Active Directory and the Administrators group, see [Azure Active Directory integration for Azure Red Hat OpenShift](howto-aad-app-configuration.md).

## Confirm membership in the customer administrator role

To confirm your membership in the customer admin group, try the OpenShift CLI commands `oc get nodes` or `oc projects`. `oc get nodes` will show a list of nodes if you have the customer-admin-cluster role, and a permission error if you only have the customer-admin-project role. `oc projects` will show all projects in the cluster as opposed to just the projects you are working in.

To further explore roles and permissions in your cluster, you can use the [`oc policy who-can <verb> <resource>`](https://docs.openshift.com/container-platform/3.11/admin_guide/manage_rbac.html#managing-role-bindings) command.

## Next steps

Configure the customer-admin-cluster cluster role:
> [!div class="nextstepaction"]
> [Azure Active Directory integration for Azure Red Hat OpenShift](howto-aad-app-configuration.md)
