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
ms.date: 06/07/2017
ms.author: danlep

---
# Load balance containers in an Azure Container Service Kubernetes cluster
In this article, we explore how to load balance containers in a Kubernetes cluster in Azure Container Service. When deployed, the Kubernetes cluster includes an Azure load balancer for the agent VMs. You can enable the load balancer to provide an externally accessible IP address for a Kubernetes service, and distribute TCP network traffic to pods running in the agents. In this tutorial, you:

> [!div class="checklist"]
> * Enable the load balancer for a Kubernetes service using `kubectl expose` or a service configuration file
> * Use the portal to see the configuration of the load balancer
> * Learn about Ingress controllers to load balance HTTP or HTTPS traffic

You need a Kubernetes cluster in Container Service to complete the steps in this tutorial. If needed, [this script sample](./scripts/container-service-cli-deploy-k8s-linux.md) can create one for you. 

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]




## Kubernetes load balancing overview

A Kubernetes cluster in Azure Container Service includes an internet-facing Azure load balancer for the agent VMs. (A separate load balancer is configured for the master VMs.) Currently, the load balancer only supports TCP traffic in Kubernetes. By default, it exposes ports 80, 443, and 8080.

When you create a Kubernetes service that runs in more than one pod, you need a way to distribute incoming traffic among the pods. (In Kubernetes, a container runs in a *pod*.) To enable the Azure load balancer, set the service `type` to `LoadBalancer`. The load balancer creates a rule to map a public IP address and port number of incoming service traffic to the private IP addresses and port numbers of the pods. It handles the process in reverse for response traffic.  

With installation of an [Ingress controller](https://kubernetes.io/docs/user-guide/ingress/#ingress-controllers) on the cluster, load balancing and routing of HTTP or HTTPS traffic or more advanced scenarios are possible. 

## Install and configure `kubectl`

If you don't already have the Kubernetes `kubectl` command line tool installed, use the following command to install it:

```azurecli-interactive 
az acs kubernetes install-cli 
```

To get the cluster credentials, use the following command. In this example, the cluster named *myK8sCluster* is in the *myK8sRG* resource group.

```azurecli-interactive 
az acs kubernetes get-credentials --resource-group=myK8sRG --name=myK8sCluster
```

## Enable load balancer with `kubectl expose`

One way to enable the external load balancer is with the `kubectl expose` command and its `--type=LoadBalancer` flag.

Start a new container deployment based on the Docker image for the NGINX web server. The following command starts a new deployment called `mynginx`, consisting of three pod replicas.

```bash
kubectl run mynginx --replicas=3 --image nginx
```

To get information about the pods and the agent nodes where they are running, run `kubectl get pods -o wide`. You see output similar to the following:

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

Verify that you can access the `mynginx` service at the external IP address. For example, open a web browser to the IP address shown (`40.80.147.20` in this example). The browser shows the start page for the NGINX web server running in one of the pods. Or, run the `curl` command. For example:

```bash
curl 40.80.147.20
```
You should see output similar to:

```bash
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>

```

If you refresh the web page several times, or run a `curl` command several times, traffic is distributed among the pods. Verify this by running the `kubectl logs` command for each of the pods. The following command gets the logs from the first pod in this example:

```bash
kubectl logs mynginx-1358273036-29p3g
```



## Enable load balancer with configuration file

Alternatively, if you deploy a Kubernetes container app from a YAML or JSON [configuration file](https://kubernetes.io/docs/tutorials/object-management-kubectl/declarative-object-management-configuration/), enable the load balancer by adding this line:

```YAML
 "type": "LoadBalancer"
``` 


The following steps use the Kubernetes [Guestbook example](https://github.com/kubernetes/kubernetes/tree/master/examples/guestbook). This example is a multi-tier web app based on Redis and PHP Docker images. You modify the service configuration file so that the frontend PHP server uses the Azure load balancer.

To start, download the file `guestbook-all-in-one.yaml` from [GitHub](https://github.com/kubernetes/kubernetes/tree/master/examples/guestbook/all-in-one). 

Browse for the `spec` for the `frontend` service, and uncomment the line `type: LoadBalancer`.

![Load balancer in service configuration](./media/container-service-kubernetes-load-balancing/guestbook-frontend-loadbalance.png)

Take note that the configuration file specifies three replicas of the `frontend` service. Save the configuration file, and deploy the app by running the following command:

```
kubectl create -f guestbook-all-in-one.yaml
```

Type `kubectl get svc` to see the state of the services in the cluster. While the load balancer configures the rule, the `EXTERNAL-IP` of the `frontend` service appears as `<pending>`. After a few minutes, the external IP address is configured:

```bash
NAME           CLUSTER-IP     EXTERNAL-IP    PORT(S)        AGE
frontend       10.0.91.21     13.92.255.97   80:32689/TCP   9m
kubernetes     10.0.0.1       <none>         443/TCP        19h
redis-master   10.0.239.116   <none>         6379/TCP       10m
redis-slave    10.0.156.213   <none>         6379/TCP       9m
```

Verify that you can access the service at the external IP address. For example, open a web browser to the external IP address of the service, and add guestbook entries.

![Access guestbook externally](./media/container-service-kubernetes-load-balancing/guestbook-web.png)



## See load balancer configuration
If you want to see how the Azure load balancer is configured, go to the [Azure portal](https://portal.azure.com).

Browse for the resource group for your Kubernetes cluster - *myK8sRG* in this example. Select the load balancer for the agent VMs. Its name begins with name of the cluster followed by the name of the resource group - *myk8scluster-myk8srg-...* in this example. 

![Load balancer in resource group](./media/container-service-kubernetes-load-balancing/container-resource-group-portal.png)

To see the details of the load balancer configuration, click **Load balancing rules** and the name of the rule that was configured.

![Load balancer rules](./media/container-service-kubernetes-load-balancing/load-balancing-rules.png) 

### Considerations

* Every service is automatically assigned its own virtual IP address in the load balancer.
* If you want to reach the load balancer by a DNS name, work with your domain service provider to create a DNS name for the rule's IP address.

## Ingress controller for HTTP or HTTPS traffic

To load balance HTTP or HTTPS traffic to container web apps, and manage TLS certificates, you can use the Kubernetes [Ingress](https://kubernetes.io/docs/user-guide/ingress/) resource. An Ingress is a collection of rules that allow inbound connections to reach the cluster services. For an Ingress resource to work, the Kubernetes cluster must run an [Ingress controller](https://kubernetes.io/docs/user-guide/ingress/#ingress-controllers).

Azure Container Service does not implement a Kubernetes Ingress controller automatically. Several controller implementations are available. Currently, we recommend the [Nginx Ingress controller](https://github.com/kubernetes/ingress/tree/master/examples/deployment/nginx) to configure Ingress rules and load balance HTTP and HTTPS traffic. See the [Nginx Ingress controller documentation](https://github.com/kubernetes/ingress/tree/master/controllers/nginx/README.md).

> [!IMPORTANT]
> When using the Nginx Ingress controller in Azure Container Service, you must expose the controller deployment as a service with `type: LoadBalancer`. This configures the Azure load balancer to route traffic to the controller. For more information, see the previous sections.


## Next steps

In this tutorial, you learned about how to load balance containers in a Kubernetes cluster, including how to:

> [!div class="checklist"]
> * Enable the load balancer for a service using `kubectl expose` or a service configuration file
> * See the load balancer configuration in the portal
> * Use an Ingress controller to load balance HTTP or HTTPS traffic

Advance to the next tutorial to learn about integrating Kubernetes with an Azure container registry.

> [!div class="nextstepaction"]
> [Pull from an Azure container registry to Kubernetes](./container-service-kubernetes-acr.md)