---
title: Use Admin Kubeconfig to access an Azure Red Hat OpenShift (ARO) cluster
description: Learn how to use Admin Kubeconfig to access an Azure Red Hat OpenShift (ARO) cluster.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
keywords: openshift, red hat, kubeconfig, cluster
ms.topic: how-to
ms.date: 07/12/2023
ms.custom: template-how-to
---

# Use Admin Kubeconfig to access an Azure Red Hat OpenShift (ARO) cluster

This article shows you how to regain access to an ARO cluster using the Admin Kubeconfig feature. The Admin Kubeconfig feature lets you download and log in with the Admin Kubconfig file using the OpenShift CLI rather than the ARO console, thus bypassing components that may not be functioning properly. This can be helpful in the following instances:

- The Azure Red Hat OpenShift (ARO) console isn't responding, or not allowing a login.
- The OpenShift CLI isn't responding to requests.
- Cluster operators may not be available or accessible.
- An alternate cluster login method is required in order to fix the above issues.

The Admin Kubeconfig feature allows cluster access in scenarios where the kube-apiserver is available, but `openshift-ingress`, `openshift-console`, or `openshift-authentication` aren't allowing login.

> [!NOTE]
> When using the Admin Kubeconfig feature in an environment with multiple clusters, make sure you are working in the correct context. For more information about contexts, see the [Red Hat OpenShift documentation](https://docs.openshift.com/container-platform/4.12/cli_reference/openshift_cli/managing-cli-profiles.html).
> 

## Before you begin

Ensure you're running Azure CLI version 2.50.0 or later.

To check the version of Azure CLI run:
```azurecli-interactive
# Azure CLI version
az --version
```
To install or upgrade Azure CLI, see [Install Azure
CLI](/cli/azure/install-azure-cli).

## Retrieve Admin Kubeconfig

Run the following to retrieve Admin Kubeconfig:

```
export SUBSCRIPTION_ID=<your-subscription-ID>
export RESOURCE_GROUP=<your-resource-group-name>
export CLUSTER=<name-of-ARO-cluster>

az aro get-admin-kubeconfig --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --name $CLUSTER
```

## Source and use the Kubeconfig

By default, the command used previously to retrieve Admin Kubeconfig saves it to the local directory under the name *kubeconfig*. To use it, set the environment variable `KUBECONFIG` to the path of that file:

```
export KUBECONFIG=/path/to/kubeconfig
oc get nodes
[output will show up here]
```

Now there's no need to use the OpenShift CLI (`oc`) login because the admin user is already logged in and the kubeconfig file is present.