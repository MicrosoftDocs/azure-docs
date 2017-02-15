---
title: Azure Kubernetes cluster for Windows | Microsoft Docs
description: Deploy and get started with a Kubernetes cluster for Windows containers in Azure Container Service
services: container-service
documentationcenter: ''
author: danlep
manager: timlt
editor: ''
tags: acs, azure-container-service, kubernetes
keywords: ''

ms.assetid: 
ms.service: container-service
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/21/2017
ms.author: dlepow

---

# Get started with Windows containers in a Kubernetes cluster


This article shows how to create a Kubernetes cluster in Azure Container Service that contains Windows nodes to run Windows containers. 

> [!NOTE]
> Support for Windows containers with Kubernetes in Azure Container Service is in preview. Currently, you can only use the Azure portal to create a Kubernetes cluster with Windows nodes.



The following image shows the architecture of a Kubernetes cluster in Azure Container Service with one Linux master node and two Windows agent nodes. 

* The master serves the Kubernetes REST API and is accessible by SSH on port 22 or `kubectl` on port 443. 
* The Windows agent nodes are grouped in an Azure availability set
and run your containers. The Windows nodes can be accessed through an RDP SSH tunnel via the master node. Azure load balancer rules are dynamically added to the cluster depending on exposed services.

All VMs are in the same private virtual network and are fully accessible to each other. All VMs run a kubelet, Docker, and a Proxy.

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-windows-walkthrough/kubernetes-windows.png)

## Prerequisites







## Create the cluster

Use the Azure portal to [create a Kubernetes cluster](container-service-deployment.md#create-a-cluster-by-using-the-azure-portal). 

*Steps to be added*

1. In **Orchestrator configuration**, select **Kubernetes - Windows**.
2. More steps....


## Connect to the cluster

Use the `kubectl` command-line tool to connect from your local computer to the master node of the Kubernetes cluster. For steps, see [Connect to an Azure Container Service cluster]().


## Access the Windows nodes
 windows nodes can be accessed through an RDP SSH tunnel via the master node.  To do this, follow these [instructions](ssh.md#create-port-80-tunnel-to-the-master), replacing port 80 with 3389.  Since your windows machine is already using port 3389, it is recommended to use 3390 to Windows Node 0, 10.240.245.5, 3391 to Windows Node 1, 10.240.245.6, and so on as shown in the following image:

![Image of Windows RDP tunnels](media/container-service-kubernetes-windows-walkthrough/rdptunnels.png)




## Create your first Kubernetes service

After completing this walkthrough you will know how to:
 * access Kubernetes cluster via SSH,
 * deploy a simple Windows Docker application and expose to the world,
 * and deploy a hybrid Windows / Linux Docker application.
 
1. After successfully deploying the template write down the master FQDN (Fully Qualified Domain Name).
   1. If using Powershell or CLI, the output parameter is in the OutputsString section named 'masterFQDN'
   2. If using Portal, to get the output you need to:
     1. navigate to "resource group"
     2. click on the resource group you just created
     3. then click on "Succeeded" under *last deployment*
     4. then click on the "Microsoft.Template"
     5. now you can copy the output FQDNs and sample SSH commands

   ![Image of docker scaling](images/portal-kubernetes-outputs.png)

2. SSH to the master FQDN obtained in step 1.

3. Explore your nodes and running pods:
  1. to see a list of your nodes type `kubectl get nodes`.  If you want full detail of the nodes, add `-o yaml` to become `kubectl get nodes -o yaml`.
  2. to see a list of running pods type `kubectl get pods --all-namespaces`.  By default DNS, heapster, and the dashboard pods will be assigned to the Linux nodes.

4. Start your first Docker image by editing a file named `simpleweb.yaml` filling in the contents below, and then apply by typing `kubectl apply -f simpleweb.yaml`.  This will start a windows simple web application and expose to the world.

  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: win-webserver
    labels:
      app: win-webserver
  spec:
    ports:
      # the port that this service should serve on
    - port: 80
      targetPort: 80
    selector:
      app: win-webserver
    type: LoadBalancer
  ---
  apiVersion: extensions/v1beta1
  kind: Deployment
  metadata:
    labels:
      app: win-webserver
    name: win-webserver
  spec:
    replicas: 1
    template:
      metadata:
        labels:
          app: win-webserver
        name: win-webserver
      spec:
        containers:
        - name: windowswebserver
          image: microsoft/windowsservercore
          command:
          - powershell.exe
          - -command
          - "<#code used from https://gist.github.com/wagnerandrade/5424431#> ; $$ip = (Get-NetIPAddress | where {$$_.IPAddress -Like '*.*.*.*'})[0].IPAddress ; $$url = 'http://'+$$ip+':80/' ; $$listener = New-Object System.Net.HttpListener ; $$listener.Prefixes.Add($$url) ; $$listener.Start() ; $$callerCounts = @{} ; Write-Host('Listening at {0}...' -f $$url) ; while ($$listener.IsListening) { ;$$context = $$listener.GetContext() ;$$requestUrl = $$context.Request.Url ;$$clientIP = $$context.Request.RemoteEndPoint.Address ;$$response = $$context.Response ;Write-Host '' ;Write-Host('> {0}' -f $$requestUrl) ;  ;$$count = 1 ;$$k=$$callerCounts.Get_Item($$clientIP) ;if ($$k -ne $$null) { $$count += $$k } ;$$callerCounts.Set_Item($$clientIP, $$count) ;$$header='<html><body><H1>Windows Container Web Server</H1>' ;$$callerCountsString='' ;$$callerCounts.Keys | % { $$callerCountsString+='<p>IP {0} callerCount {1} ' -f $$_,$$callerCounts.Item($$_) } ;$$footer='</body></html>' ;$$content='{0}{1}{2}' -f $$header,$$callerCountsString,$$footer ;Write-Output $$content ;$$buffer = [System.Text.Encoding]::UTF8.GetBytes($$content) ;$$response.ContentLength64 = $$buffer.Length ;$$response.OutputStream.Write($$buffer, 0, $$buffer.Length) ;$$response.Close() ;$$responseStatus = $$response.StatusCode ;Write-Host('< {0}' -f $$responseStatus)  } ; "
        nodeSelector:
          beta.kubernetes.io/os: windows
  ```

5. Type `watch kubectl get pods` to watch the deployment of the service that takes about 30 seconds.  Once running, type `kubectl get svc` and curl the 10.x address to see the output, eg. `curl 10.244.1.4`

6. Type `watch kubectl get svc` to watch the addition of the external IP address that will take about 2-5 minutes.  Once there, you can take the external IP and view in your web browser.

7. The next step in this walkthrough is to deploy a hybrid Linux / Windows app.  This application uses a Windows ASP.Net WebAPI front end, and a linux redis database as the backend.  The ASP.Net WebAPI looks up the redis database via the fqdn redis-master.default.svc.cluster.local.  To run this app, paste the contents below into a file named `hybrid.yaml` and type `kubectl apply -f hybrid.yaml`.  This will take about 10 minutes to pull down the images.

  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: redis-master
    labels:
      app: redis
      tier: backend
      role: master
  spec:
    ports:
      # the port that this service should serve on
    - port: 6379
      targetPort: 6379
    selector:
      app: redis
      tier: backend
      role: master
  ---
  apiVersion: extensions/v1beta1
  kind: Deployment
  metadata:
    name: redis-master
  spec:
    replicas: 1
    template:
      metadata:
        labels:
          app: redis
          role: master
          tier: backend
      spec:
        containers:
        - name: master
          image: redis
          resources:
            requests:
              cpu: 100m
              memory: 100Mi
          ports:
          - containerPort: 6379
        nodeSelector:
          beta.kubernetes.io/os: linux
  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: aspnet-webapi-todo
    labels:
      app: aspnet-webapi-todo
      tier: frontend
  spec:
    ports:
      # the port that this service should serve on
    - port: 80
      targetPort: 80
    selector:
      app: aspnet-webapi-todo
      tier: frontend
    type: LoadBalancer
  ---
  apiVersion: extensions/v1beta1
  kind: Deployment
  metadata:
    name: aspnet-webapi-todo
  spec:
    replicas: 1
    template:
      metadata:
        labels:
          app: aspnet-webapi-todo
          tier: frontend
      spec:
        containers:
        - name: aspnet-webapi-todo
          image: anhowe/aspnet-web-api-todo2:latest
        nodeSelector:
          beta.kubernetes.io/os: windows
  ```

8. Type `watch kubectl get pods` to watch the deployment of the service that takes about 10 minutes.  Once running, type `kubectl get svc` and for the app names `aspnet-webapi-todo` copy the external address and open in your webbrowser.  As shown in the following image, the traffic flows from your webbrowser to the ASP.Net WebAPI frontend and then to the hybrid container.

   ![Image of hybrid traffic flow](images/hybrid-trafficflow.png)



## Next steps

Here are recommended links to learn more about Kubernetes:

1. [Kubernetes Bootcamp](https://kubernetesbootcamp.github.io/kubernetes-bootcamp/index.html) - shows you how to deploy, scale, update, and debug containerized applications.
2. [Kubernetes Userguide](http://kubernetes.io/docs/user-guide/) - provides information on running programs in an existing Kubernetes cluster.
3. [Kubernetes Examples](https://github.com/kubernetes/kubernetes/tree/master/examples) - provides a number of examples on how to run real applications with Kubernetes.