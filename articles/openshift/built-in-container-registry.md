---
title: Configure built-in container registry for Azure Red Hat OpenShift 4
description: Configure built-in container registry for Azure Red Hat OpenShift 4
author: majguo
ms.author: jiangma
ms.service: azure-redhat-openshift
ms.topic: conceptual
ms.date: 10/15/2020
---
# Configure the built-in container registry for Azure Red Hat OpenShift 4

Azure Red Hat OpenShift provides an [integrated container image registry](https://docs.openshift.com/container-platform/4.9/registry/index.html) that adds the ability to automatically provision new image repositories on demand. This provides users with a built-in location for their application builds to push the resulting images.

In this article, you'll configure the built-in container image registry for an Azure Red Hat OpenShift (ARO) 4 cluster. You'll learn how to:

> [!div class="checklist"]
> * Authorize an identity to access to the registry
> * Access the built-in container image registry from inside the cluster
> * Access the built-in container image registry from outside the cluster

## Before you begin

This article assumes you have an existing ARO cluster (see [Create an Azure Red Hat OpenShift 4 cluster](./tutorial-create-cluster.md)). If you would like to configure Microsoft Entra integration, make sure to create the cluster with the `--pull-secret` argument to `az aro create`.

> [!NOTE]
> [Configuring Microsoft Entra authentication](./configure-azure-ad-ui.md#configure-openshift-openid-authentication) for your cluster is the easiest way to interact with the internal registry from outside the cluster.

Once you have your cluster, [connect to the cluster](./tutorial-connect-cluster.md) by authenticating as the `kubeadmin` user.

## Configure authentication to the registry

For any identity (a cluster user, Microsoft Entra user, or ServiceAccount) to access the internal registry, it must be granted permissions inside the cluster:

As `kubeadmin`, execute the following commands:
   ```bash
   # Note: replace "<user>" with the identity you need to access the registry
   oc policy add-role-to-user -n openshift-image-registry registry-viewer <user>
   oc policy add-role-to-user -n openshift-image-registry registry-editor <user>
   ```

> [!Note]
> For cluster users and Microsoft Entra users - this will be the same name you use to authenticate into the cluster. For OpenShift ServiceAccounts, format the name as `system:serviceaccount:<project>:<name>`

## Access the registry

Now that you've configured authentication for the registry, you can interact with it:

### From inside the cluster

If you need to access the registry from inside the cluster (e.g. you are running a CI/CD platform as Pods that will push/pull images to the registry), you can access the registry via its [ClusterIP Service](https://docs.openshift.com/container-platform/4.9/rest_api/network_apis/service-core-v1.html) at the fully qualified domain name `image-registry.openshift-image-registry.svc.cluster.local:5000`, which is accessible to all Pods within the cluster.

### From outside the cluster

If your workflows require you access the internal registry from outside the cluster (e.g. you want to push/pull images from a developer's laptop, external CI/CD platform, and/or a different ARO cluster), you will need to perform a few additional steps:

As `kubeadmin`, execute the following commands to expose the built-in registry outside the cluster via a [Route](https://docs.openshift.com/container-platform/4.9/rest_api/network_apis/route-route-openshift-io-v1.html):
   ```bash
   oc patch config.imageregistry.operator.openshift.io/cluster --patch='{"spec":{"defaultRoute":true}}' --type=merge
   oc patch config.imageregistry.operator.openshift.io/cluster --patch='[{"op": "add", "path": "/spec/disableRedirect", "value": true}]' --type=json
   ```

You can then find the registry's externally-routable fully qualified domain name:

As `kubeadmin`, execute:
   ```bash
   oc get route -n openshift-image-registry default-route --template='{{ .spec.host }}'
   ```

## Next steps

Now that you've set up the built-in container image registry, you can get started by deploying an application on OpenShift. For Java applications, check out [Deploy a Java application with Open Liberty/WebSphere Liberty on an Azure Red Hat OpenShift 4 cluster](howto-deploy-java-liberty-app.md).
