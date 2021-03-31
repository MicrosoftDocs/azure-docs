---
title: "Azure RBAC - Azure Arc enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
ms.date: 03/05/2021
ms.topic: conceptual
author: shashankbarsin
ms.author: shasb
description: "This article provides a conceptual overview of Azure RBAC capability on Azure Arc enabled Kubernetes"
---

# Azure RBAC on Azure Arc enabled Kubernetes

Kubernetes objects of the type [ClusterRoleBinding and RoleBinding](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) provide a way to define authorization in a Kubernetes native way. Instead, this feature allows for usage of Azure Active Directory (AAD) and role assignments in Azure to control authorization checks on the cluster.

With this, all benefits of Azure role assignments such as activity log allowing you to see all the Azure RBAC changes happening on an Azure resource now become applicable for your Azure Arc enabled Kubernetes cluster.

## Architecture

[ ![Azure RBAC architecture](./media/conceptual-azure-rbac.png) ](./media/conceptual-azure-rbac.png#lightbox)

In order to route all authorization access checks to the authorization service in Azure, a webhook server ([guard](https://github.com/appscode/guard)) is deployed on the cluster.

The `apiserver` of the cluster is configured to use [webhook token authentication](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#webhook-token-authentication) and [webhook authorization](https://kubernetes.io/docs/reference/access-authn-authz/webhook/) so that `TokenAccessReview` and `SubjectAccessReview` requests are routed to the guard webhook server. The `TokenAccessReview` and `SubjectAccessReview` requests are triggered by requests for Kubernetes resources sent to the `apiserver`.

Guard then makes a `checkAccess` call on the authorization service in  Azure to see if the requesting AAD entity has access to the resource of concern. 

If there exists a role in assignment that permits this access, then an `allowed` response is sent back from the authorization service guard. Guard in turn sends back an `allowed` response to the `apiserver` resulting in the calling entity being able to access the requested Kubernetes resource


If a role in assignment permitting this access doesn't exist, then a `denied` response is sent back from the authorization service guard. Guard in turn sends back an `denied` response to the `apiserver`, resulting in the calling entity getting a 403 forbidden error on the requested resource.

## Next steps

* Walk through our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
* Already have a Kubernetes cluster connected to Azure Arc? [Set up Azure RBAC on your cluster](./azure-rbac.md).