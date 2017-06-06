---
title: Load balance containers - Azure Kubernetes cluster | Microsoft Docs
description: Connect externally and load balance across multiple containers in a Kubernetes cluster in Azure Container Service.
services: container-service
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Containers, Micro-services, Kubernetes, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/06/2017
ms.author: danlep

---
# Load balance containers in an Azure Container Service Kubernetes cluster
In this article, we explore how to load balance containers in a Kubernetes cluster in Azure Container Service. Load balancing provides an externally accessible IP address for a Kubernetes service and distributes network traffic among the pods running in agent VMs. In this tutorial, you:

> [!div class="checklist"]
> * X
> * Y
> * Z

You need a Kubernetes cluster in Container Service to complete the steps in this tutorial. If needed, [this script sample](./scripts/container-service-cli-deploy-k8s-linux.md) can create one for you.

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]




## Kubernetes load balancing overview

A Kubernetes cluster in Azure Container Service includes an internet-facing Azure load balancer for the agent VMs. (A separate load balancer resource is configured for the master VMs.) Azure load balancer is a Layer 4 load balancer. Currently, the load balancer only supports TCP traffic in Kubernetes. An Azure load balancer is, by default, configured to expose ports 80, 443, and 8080.

When creating a Kubernetes service, you can automatically configure the Azure load balancer to allow access to the service. To configure the load balancer, set the service `type` to `LoadBalancer`. The load balancer creates a rule to map a public IP address and port number of incoming service traffic to the private IP addresses and port numbers of the pods in agent VMs (and vice versa for response traffic). 

With installation of additional software, load balancing and routing of HTTP or HTTPS traffic or more advanced scenarios are possible. 

## Expose a service with `kubectl expose`

If you don't already have the Kubernetes `kubectl` command line tool installed, use the following command to install it:

```azurecli-interactive 
az acs kubernetes install-cli 
```

To get the cluster credentials, use the following command. In this example the cluster named *myK8sCluster* is in the *myResourceGroup* resource group.

```azurecli-interactive 
az acs kubernetes get-credentials --resource-group=myResourceGroup --name=myK8sCluster
```

Start a new container deployment. (In Kubernetes, a container runs inside a *pod*.) The following command starts a new deployment called `mynginx`, consisting of three pods based on the Docker image for the NGINX web server.

```bash
kubectl run mynginx --replicas=3 --image nginx
```

To get information about the pods and where they are running, run `kubectl get pods -o wide`. You see output similar to the following:

```bash
NAME                       READY     STATUS    RESTARTS   AGE       IP           NODE
mynginx-1358273036-29p3g   1/1       Running   0          5m        10.244.0.6   k8s-agent-2e1359a1-1    
mynginx-1358273036-6cchp   1/1       Running   0          5m        10.244.0.7   k8s-agent-2e1359a1-1    
mynginx-1358273036-dsw6v   1/1       Running   0          5m        10.244.1.6   k8s-agent-2e1359a1-0
```


To configure the Azure load balancer to accept external traffic to the deployment, run `kubectl expose` with `--type=LoadBalancer`. The following command exposes the NGINX deployment as a service on port 80:

```bash
kubectl expose deployments mynginx --port=80 --type=LoadBalancer
```

Type `kubectl get svc` to see the state of the services in the cluster. While the load balancer configures the rule, the `EXTERNAL-IP` of the service appears as `<pending>`. After a few minutes, the external IP address is configured:

```bash
NAME         CLUSTER-IP    EXTERNAL-IP    PORT(S)        AGE
kubernetes   10.0.0.1      <none>         443/TCP        30m
mynginx      10.0.48.222   40.80.147.20   80:31857/TCP   18m
```

Verify that you can access the service at the external IP address. For example, open a web browser to the IP address shown (`40.80.147.20` in this example). The browser shows the NGINX web server running in one of the pods. Or, run the `curl` or `wget` command. For example:

```bash
curl 40.80.147.20
```

    You should see output similar to:

    ![Access Nginx with curl](./media/container-service-kubernetes-load-balancing/curl-output.png)

6. To see the configuration of the Azure load balancer, go to the [Azure portal](https://portal.azure.com).

7. Browse for the resource group for your container service cluster, and select the load balancer for the agent VMs. Its name should be the same as the container service. (Don't choose the load balancer for the master nodes, the one whose name includes **master-lb**.) 

    ![Load balancer in resource group](./media/container-service-kubernetes-load-balancing/container-resource-group-portal.png)

8. To see the details of the load balancer configuration, click **Load balancing rules** and the name of the rule that was configured.

    ![Load balancer rules](./media/container-service-kubernetes-load-balancing/load-balancing-rules.png) 

### Example: Specify `type: LoadBalancer` in the service configuration file

If you deploy a Kubernetes container app from a YAML or JSON [service configuration file](https://kubernetes.io/docs/user-guide/services/operations/#service-configuration-file), specify an external load balancer by adding the following line to the service specification:

```YAML
 "type": "LoadBalancer"
``` 



The following steps use the Kubernetes [Guestbook example](https://github.com/kubernetes/kubernetes/tree/master/examples/guestbook). This example is a multi-tier web app based on  Redis and PHP Docker images. You can specify in the service configuration file that the frontend PHP server uses the Azure load balancer.

1. Download the file `guestbook-all-in-one.yaml` from [GitHub](https://github.com/kubernetes/kubernetes/tree/master/examples/guestbook/all-in-one). 
2. Browse for the `spec` for the `frontend` service.
3. Uncomment the line `type: LoadBalancer`.

    ![Load balancer in service configuration](./media/container-service-kubernetes-load-balancing/guestbook-frontend-loadbalance.png)

4. Save the file, and deploy the app by running the following command:

    ```
    kubectl create -f guestbook-all-in-one.yaml
    ```

5. Type `kubectl get svc` to see the state of the services in the cluster. While the load balancer configures the rule, the `EXTERNAL-IP` of the `frontend` service appears as `<pending>`. After a few minutes, the external IP address is configured: 

    ![Configure Azure load balancer](./media/container-service-kubernetes-load-balancing/guestbook-external-ip.png)

6. Verify that you can access the service at the external IP address. For example, you can open a web browser to the external IP address of the service.

    ![Access guestbook externally](./media/container-service-kubernetes-load-balancing/guestbook-web.png)

    You can add guestbook entries.

7. To see the configuration of the Azure load balancer, browse for the load balancer resource for the cluster in the [Azure portal](https://portal.azure.com). See the steps in the previous example.

### Considerations

* Creation of the load balancer rule happens asynchronously, and information about the provisioned balancer is published in the service’s `status.loadBalancer` field.
* Every service is automatically assigned its own virtual IP address in the load balancer.
* If you want to reach the load balancer by a DNS name, work with your domain service provider to create a DNS name for the rule's IP address.

## HTTP or HTTPS traffic

To load balance HTTP or HTTPS traffic to container web apps and manage certificates for transport layer security (TLS), you can use the Kubernetes [Ingress](https://kubernetes.io/docs/user-guide/ingress/) resource. An Ingress is a collection of rules that allow inbound connections to reach the cluster services. For an Ingress resource to work, the Kubernetes cluster must have an [Ingress controller](https://kubernetes.io/docs/user-guide/ingress/#ingress-controllers) running.

Azure Container Service does not implement a Kubernetes Ingress controller automatically. Several controller implementations are available. Currently, the [Nginx Ingress controller](https://github.com/kubernetes/ingress/tree/master/examples/deployment/nginx) is recommended to configure Ingress rules and load balance HTTP and HTTPS traffic. 

For more information, see the [Nginx Ingress controller documentation](https://github.com/kubernetes/ingress/tree/master/controllers/nginx/README.md).

> [!IMPORTANT]
> When using the Nginx Ingress controller in Azure Container Service, you must expose the controller deployment as a service with `type: LoadBalancer`. This configures the Azure load balancer to route traffic to the controller. For more information, see the previous section.


## Next steps

* See the [Kubernetes LoadBalancer documentation](https://kubernetes.io/docs/user-guide/load-balancer/)
* Learn more about [Kubernetes Ingress and Ingress controllers](https://kubernetes.io/docs/user-guide/ingress/)
* See [Kubernetes examples](https://github.com/kubernetes/kubernetes/tree/master/examples)

