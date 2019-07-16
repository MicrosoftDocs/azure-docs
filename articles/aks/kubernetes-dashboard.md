---
title: Manage an Azure Kubernetes Service cluster with the web dashboard
description: Learn how to use the built-in Kubernetes web UI dashboard to manage an Azure Kubernetes Service (AKS) cluster
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 10/08/2018
ms.author: mlearned
---

# Access the Kubernetes web dashboard in Azure Kubernetes Service (AKS)

Kubernetes includes a web dashboard that can be used for basic management operations. This dashboard lets you view basic health status and metrics for your applications, create and deploy services, and edit existing applications. This article shows you how to access the Kubernetes dashboard using the Azure CLI, then guides you through some basic dashboard operations.

For more information on the Kubernetes dashboard, see [Kubernetes Web UI Dashboard][kubernetes-dashboard].

## Before you begin

The steps detailed in this document assume that you have created an AKS cluster and have established a `kubectl` connection with the cluster. If you need to create an AKS cluster, see the [AKS quickstart][aks-quickstart].

You also need the Azure CLI version 2.0.46 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Start the Kubernetes dashboard

To start the Kubernetes dashboard, use the [az aks browse][az-aks-browse] command. The following example opens the dashboard for the cluster named *myAKSCluster* in the resource group named *myResourceGroup*:

```azurecli
az aks browse --resource-group myResourceGroup --name myAKSCluster
```

This command creates a proxy between your development system and the Kubernetes API, and opens a web browser to the Kubernetes dashboard. If a web browser doesn't open to the Kubernetes dashboard, copy and paste the URL address noted in the Azure CLI, typically `http://127.0.0.1:8001`.

![The overview page of the Kubernetes web dashboard](./media/kubernetes-dashboard/dashboard-overview.png)

### For RBAC-enabled clusters

If your AKS cluster uses RBAC, a *ClusterRoleBinding* must be created before you can correctly access the dashboard. By default, the Kubernetes dashboard is deployed with minimal read access and displays RBAC access errors. The Kubernetes dashboard does not currently support user-provided credentials to determine the level of access, rather it uses the roles granted to the service account. A cluster administrator can choose to grant additional access to the *kubernetes-dashboard* service account, however this can be a vector for privilege escalation. You can also integrate Azure Active Directory authentication to provide a more granular level of access.

To create a binding, use the [kubectl create clusterrolebinding][kubectl-create-clusterrolebinding] command as shown in the following example. 

> [!WARNING]
> This sample binding does not apply any additional authentication components and may lead to insecure use. The Kubernetes dashboard is open to anyone with access to the URL. Do not expose the Kubernetes dashboard publicly.
>
> For more information on using the different authentication methods, see the Kubernetes dashboard wiki on [access controls][dashboard-authentication].

```console
kubectl create clusterrolebinding kubernetes-dashboard --clusterrole=cluster-admin --serviceaccount=kube-system:kubernetes-dashboard
```

You can now access the Kubernetes dashboard in your RBAC-enabled cluster. To start the Kubernetes dashboard, use the [az aks browse][az-aks-browse] command as detailed in the previous step.

## Create an application

To see how the Kubernetes dashboard can reduce the complexity of management tasks, let's create an application. You can create an application from the Kubernetes dashboard by providing text input, a YAML file, or through a graphical wizard.

To create an application, complete the following steps:

1. Select the **Create** button in the upper right window.
1. To use the graphical wizard, choose to **Create an app**.
1. Provide a name for the deployment, such as *nginx*
1. Enter the name for the container image to use, such as *nginx:1.15.5*
1. To expose port 80 for web traffic, you create a Kubernetes service. Under **Service**, select **External**, then enter **80** for both the port and target port.
1. When ready, select **Deploy** to create the app.

![Deploy an app in the Kubernetes web dashboard](./media/kubernetes-dashboard/create-app.png)

It takes a minute or two for a public external IP address to be assigned to the Kubernetes service. On the left-hand size, under **Discovery and Load Balancing** select **Services**. Your application's service is listed, including the *External endpoints*, as shown in the following example:

![View list of services and endpoints](./media/kubernetes-dashboard/view-services.png)

Select the endpoint address to open a web browser window to the default NGINX page:

![View the default NGINX page of the deployed application](./media/kubernetes-dashboard/default-nginx.png)

## View pod information

The Kubernetes dashboard can provide basic monitoring metrics and troubleshooting information such as logs.

To see more information about your application pods, select **Pods** in the left-hand menu. The list of available pods is shown. Choose your *nginx* pod to view information, such as resource consumption:

![View pod information](./media/kubernetes-dashboard/view-pod-info.png)

## Edit the application

In addition to creating and viewing applications, the Kubernetes dashboard can be used to edit and update application deployments. To provide additional redundancy for the application, let's increase the number of NGINX replicas.

To edit a deployment:

1. Select **Deployments** in the left-hand menu, and then choose your *nginx* deployment.
1. Select **Edit** in the upper right-hand navigation bar.
1. Locate the `spec.replica` value, at around line 20. To increase the number of replicas for the application, change this value from *1* to *3*.
1. Select **Update** when ready.

![Edit the deployment to update the number of replicas](./media/kubernetes-dashboard/edit-deployment.png)

It takes a few moments for the new pods to be created inside a replica set. On the left-hand menu, choose **Replica Sets**, and then choose your *nginx* replica set. The list of pods now reflects the updated replica count, as shown in the following example output:

![View information on the replica set](./media/kubernetes-dashboard/view-replica-set.png)

## Next steps

For more information about the Kubernetes dashboard, see the [Kubernetes Web UI Dashboard][kubernetes-dashboard].

<!-- LINKS - external -->
[kubernetes-dashboard]: https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/
[dashboard-authentication]: https://github.com/kubernetes/dashboard/wiki/Access-control
[kubectl-create-clusterrolebinding]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#-em-clusterrolebinding-em-
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply

<!-- LINKS - internal -->
[aks-quickstart]: ./kubernetes-walkthrough.md
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-browse]: /cli/azure/aks#az-aks-browse
