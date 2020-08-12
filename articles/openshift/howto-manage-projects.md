---
title: Manage resources in Azure Red Hat OpenShift | Microsoft Docs
description: Manage projects, templates, image-streams in an Azure Red Hat OpenShift cluster
services: openshift
keywords:  red hat openshift projects requests self-provisioner
author: mjudeikis
ms.author: gwallace
ms.date: 07/19/2019
ms.topic: conceptual
ms.service: container-service
#Customer intent: As a developer, I need to understand how to manage Openshift projects and development resources
---

# Manage projects, templates, image-streams in an Azure Red Hat OpenShift cluster 

In an OpenShift Container Platform, projects are used to group and isolate related objects. As an administrator, you can give developers access to specific projects, allow them to create their own projects, and grant them administrative rights to individual projects.

## Self-provisioning projects

You can enable developers to create their own projects. An API endpoint is responsible for provisioning a project according to a template named project-request. The web console and the `oc new-project` command use this endpoint when a developer creates a new project.

When a project request is submitted, the API substitutes the following parameters in the template:

| Parameter               | Description                                    |
| ----------------------- | ---------------------------------------------- |
| PROJECT_NAME            | The name of the project. Required.             |
| PROJECT_DISPLAYNAME     | The display name of the project. May be empty. |
| PROJECT_DESCRIPTION     | The description of the project. May be empty.  |
| PROJECT_ADMIN_USER      | The username of the administrating user.       |
| PROJECT_REQUESTING_USER | The username of the requesting user.           |

Access to the API is granted to developers with the self-provisioners cluster role binding. This feature is available to all authenticated developers by default.

## Modify the template for a new project 

1. Log in as a user with `customer-admin` privileges.

2. Edit the default project-request template.

   ```
   oc edit template project-request -n openshift
   ```

3. Remove the default project template from the Azure Red Hat OpenShift (ARO) update process by adding the following annotation:
 `openshift.io/reconcile-protect: "true"`

   ```
   ...
   metadata:
     annotations:
       openshift.io/reconcile-protect: "true"
   ...
   ```

   The project-request template will not be updated by the ARO update process. This enables customers to customize the template and preserve these customizations when the cluster is updated.

## Disable the self-provisioning role

You can prevent an authenticated user group from self-provisioning new projects.

1. Log in as a user with `customer-admin` privileges.

2. Edit the self-provisioners cluster role binding.

   ```
   oc edit clusterrolebinding.rbac.authorization.k8s.io self-provisioners
   ```

3. Remove the role from the ARO update process by adding the following annotation: `openshift.io/reconcile-protect: "true"`.

   ```
   ...
   metadata:
     annotations:
       openshift.io/reconcile-protect: "true"
   ...
   ```

4. Change the cluster role binding to prevent `system:authenticated:oauth` from creating projects:

   ```
   apiVersion: rbac.authorization.k8s.io/v1
   groupNames:
   - osa-customer-admins
   kind: ClusterRoleBinding
   metadata:
     annotations:
       openshift.io/reconcile-protect: "true"
     labels:
       azure.openshift.io/owned-by-sync-pod: "true"
     name: self-provisioners
   roleRef:
     name: self-provisioner
   subjects:
   - kind: SystemGroup
     name: osa-customer-admins
   ```

## Manage default templates and imageStreams

In Azure Red Hat OpenShift, you can disable updates for any default templates and image streams inside `openshift` namespace.
To disable updates for ALL `Templates` and `ImageStreams` in `openshift` namespace:

1. Log in as a user with `customer-admin` privileges.

2. Edit `openshift` namespace:

   ```
   oc edit namespace openshift
   ```

3. Remove `openshift` namespace from the ARO update process by adding the following annotation: 
`openshift.io/reconcile-protect: "true"`

   ```
   ...
   metadata:
     annotations:
       openshift.io/reconcile-protect: "true"
   ...
   ```

   Any individual object in the `openshift` namespace can be removed from the update process by adding annotation `openshift.io/reconcile-protect: "true"` to it.

## Next steps

Try the tutorial:
> [!div class="nextstepaction"]
> [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md)
