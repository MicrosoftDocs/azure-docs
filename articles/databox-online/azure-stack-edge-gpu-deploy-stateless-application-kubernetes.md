---
title: Deploy Kubernetes stateless application on Azure Stack Edge Pro GPU device using kubectl| Microsoft Docs
description: Describes how to create and manage a Kubernetes stateless application deployment using kubectl on a Microsoft Azure Stack Edge Pro device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/05/2021
ms.author: alkohli
---

# Deploy a Kubernetes stateless application via kubectl on your Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to deploy a stateless application using kubectl commands on an existing Kubernetes cluster. This article also walks you through the process of creating and setting up pods in your stateless application.

## Prerequisites

Before you can create a Kubernetes cluster and use the `kubectl` command-line tool, you need to ensure that:

- You have sign-in credentials to a 1-node Azure Stack Edge Pro device.

- Windows PowerShell 5.0 or later is installed on a Windows client system to access the Azure Stack Edge Pro device. You can have any other client with a Supported operating system as well. This article describes the procedure when using a Windows client. To download the latest version of Windows PowerShell, go to [Installing Windows PowerShell](/powershell/scripting/install/installing-windows-powershell).

- Compute is enabled on the Azure Stack Edge Pro device. To enable compute, go to the **Compute** page in the local UI of the device. Then select a network interface that you want to enable for compute. Select **Enable**. Enabling compute results in the creation of a virtual switch on your device on that network interface. For more information, see [Enable compute network on your Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md).

- Your Azure Stack Edge Pro device has a Kubernetes cluster server running that is version v1.9 or later. For more information, see [Create and manage a Kubernetes cluster on Microsoft Azure Stack Edge Pro device](azure-stack-edge-gpu-create-kubernetes-cluster.md).

- You have installed `kubectl`.

## Deploy a stateless application

Before we begin, you should have:

1. Created a Kubernetes cluster.
2. Set up a namespace.
3. Associated a user with the namespace.
4. Saved the user configuration to `C:\Users\<username>\.kube`.
5. Installed `kubectl`.

Now you can begin running and managing stateless application deployments on an Azure Stack Edge Pro device. Before you start using `kubectl`, you need to verify that you have the correct version of `kubectl`.

### Verify you have the correct version of kubectl and set up configuration

To check the version of `kubectl`:

1. Verify that the version of `kubectl` is greater or equal to 1.9:

   ```powershell
   kubectl version
   ```
    
   An example of the output is shown below:
    
   ```powershell
   PS C:\WINDOWS\system32> C:\windows\system32\kubectl.exe version
   Client Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.2", GitCommit:"f6278300bebbb750328ac16ee6dd3aa7d3549568", GitTreeState:"clean", BuildDate:"2019-08-05T09:23:26Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"windows/amd64"}
   Server Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
   ```

   In this case, the client version of kubectl is v1.15.2 and is compatible to continue.

2. Get a list of the pods running on your Kubernetes cluster. A pod is an application container, or process, running on your Kubernetes cluster.

   ```powershell
   kubectl get pods -n <namespace-string>
   ```
    
   An example of command usage is shown below:
    
   ```powershell
   PS C:\WINDOWS\system32> kubectl get pods -n "test1"
   No resources found.
   PS C:\WINDOWS\system32>
   ```
    
   The output should state that no resources (pods) are found because there are no applications running on your cluster.

   The command will populate the directory structure of "C:\Users\\&lt;username&gt;\\.kube\" with configuration files. The kubectl command-line tool will use these files to create and manage stateless applications on your Kubernetes cluster.  

3. Manually check the directory structure of "C:\Users\\&lt;username&gt;\\.kube\" to verify *kubectl* has populated it with the following subfolders:

   ```powershell
   PS C:\Users\username> ls .kube
    
    
      Directory: C:\Users\user\.kube
    
   Mode                LastWriteTime         Length Name
   ----                -------------         ------ ----
   d-----         2/18/2020 11:05 AM                cache
   d-----         2/18/2020 11:04 AM                http-cache
   -a----         2/18/2020 10:41 AM           5377 config
   ```

> [!NOTE]
> To view a list of all kubectl commands, type `kubectl --help`.

### Create a stateless application using a deployment

Now that you've verified that the kubectl command-line version is correct and you have the required configuration files, you can create a stateless application deployment.

A pod is the basic execution unit of a Kubernetes application, the smallest and simplest unit in the Kubernetes object model that you create or deploy. A pod also encapsulates storage resources, a unique network IP, and options that govern how the container(s) should run.

The type of stateless application that you create is an nginx web server deployment.

All kubectl commands you use to create and manage stateless application deployments need to specify the namespace associated with the configuration. You created the namespace while connected to the cluster on the Azure Stack Edge Pro device in the [Create and manage a Kubernetes cluster on Microsoft Azure Stack Edge Pro device](azure-stack-edge-gpu-create-kubernetes-cluster.md) tutorial with `New-HcsKubernetesNamespace`.

To specify the namespace in a kubectl command, use `kubectl <command> -n <namespace-string>`.

Follow these steps to create an nginx deployment:

1. Apply a stateless application by creating a Kubernetes deployment object:

   ```powershell
   kubectl apply -f <yaml-file> -n <namespace-string>
   ```

   In this example, the path to the application YAML file is an external source.

   Here is a sample use of the command and its output:

   ```powershell
   PS C:\WINDOWS\system32> kubectl apply -f https://k8s.io/examples/application/deployment.yaml -n "test1"
    
   deployment.apps/nginx-deployment created
   ```

   Alternatively, you can save the following markdown to your local machine and substitute the path and filename in the *-f* parameter. For instance, "C:\Kubernetes\deployment.yaml". The configuration for the application deployment would be:

   ```markdown
   apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
   kind: Deployment
   metadata:
     name: nginx-deployment
   spec:
     selector:
       matchLabels:
         app: nginx
     replicas: 2 # tells deployment to run 2 pods matching the template
     template:
       metadata:
         labels:
           app: nginx
       spec:
         containers:
         - name: nginx
           image: nginx:1.7.9
           ports:
           - containerPort: 80
   ```

   This command creates a default nginx-deployment that has two pods to run your application.

2. Get the description of the Kubernetes nginx-deployment you created:

   ```powershell
   kubectl describe deployment nginx-deployment -n <namespace-string>
   ```

   A sample use of the command, with output, is shown below:
    
   ```powershell
   PS C:\Users\user> kubectl describe deployment nginx-deployment -n "test1"
    
   Name:                   nginx-deployment
   Namespace:              test1
   CreationTimestamp:      Tue, 18 Feb 2020 13:35:29 -0800
   Labels:                 <none>
   Annotations:            deployment.kubernetes.io/revision: 1
                           kubectl.kubernetes.io/last-applied-configuration:
                             {"apiVersion":"apps/v1","kind":"Deployment","metadata":{"annotations":{},"name":"nginx-deployment","namespace":"test1"},"spec":{"repl...
   Selector:               app=nginx
   Replicas:               2 desired | 2 updated | 2 total | 2 available | 0 unavailable
   StrategyType:           RollingUpdate
   MinReadySeconds:        0
   RollingUpdateStrategy:  25% max unavailable, 25% max surge
   Pod Template:
      Labels:  app=nginx
      Containers:
       nginx:
        Image:        nginx:1.7.9
        Port:         80/TCP
        Host Port:    0/TCP
        Environment:  <none>
        Mounts:       <none>
      Volumes:        <none>
   Conditions:
      Type           Status  Reason
      ----           ------  ------
      Available      True    MinimumReplicasAvailable
      Progressing    True    NewReplicaSetAvailable
   OldReplicaSets:  <none>
   NewReplicaSet:   nginx-deployment-5754944d6c (2/2 replicas created)
   Events:
     Type    Reason             Age    From                   Message
     ----    ------             ----   ----                   -------
     Normal  ScalingReplicaSet  2m22s  deployment-controller  Scaled up replica set nginx-deployment-5754944d6c to 2
   ```

   For the *replicas* setting, you will see:
    
   ```powershell
   Replicas:               2 desired | 2 updated | 2 total | 2 available | 0 unavailable
   ```

   The *replicas* setting indicates that your deployment specification requires two pods, and that those pods were created and updated and are ready for you to use.

   > [!NOTE]
   > A replica set replaces pods that are deleted or terminated for any reason, such as in the case of device node failure or a disruptive device upgrade. For this reason, we recommend that you use a replica set even if your application requires only a single pod.

3. To list the pods in your deployment:

   ```powershell
   kubectl get pods -l app=nginx -n <namespace-string>
   ```
    
   A sample use of the command, with output, is shown below:
    
   ```powershell
   PS C:\Users\user> kubectl get pods -l app=nginx -n "test1"
    
   NAME                                READY   STATUS    RESTARTS   AGE
   nginx-deployment-5754944d6c-7wqjd   1/1     Running   0          3m13s
   nginx-deployment-5754944d6c-nfj2h   1/1     Running   0          3m13s
   ```

   The output verifies that we have two pods with unique names that we can reference using kubectl.

4. To view information on an individual pod in your deployment:

   ```powershell
   kubectl describe pod <podname-string> -n <namespace-string>
   ```

  A sample use of the command, with output, is shown below:

   ```powershell
   PS C:\Users\user> kubectl describe pod "nginx-deployment-5754944d6c-7wqjd" -n "test1"

   Name:           nginx-deployment-5754944d6c-7wqjd
   Namespace:      test1
   Priority:       0
   Node:           k8s-1d9qhq2cl-n1/10.128.46.184
   Start Time:     Tue, 18 Feb 2020 13:35:29 -0800
   Labels:         app=nginx
                   pod-template-hash=5754944d6c
   Annotations:    <none>
   Status:         Running
   IP:             172.17.246.200
   Controlled By:  ReplicaSet/nginx-deployment-5754944d6c
    Containers:
      nginx:
        Container ID:   docker://280b0f76bfdc14cde481dc4f2b8180cf5fbfc90a084042f679d499f863c66979
        Image:          nginx:1.7.9
        Image ID:       docker-pullable://nginx@sha256:e3456c851a152494c3e4ff5fcc26f240206abac0c9d794affb40e0714846c451
        Port:           80/TCP
        Host Port:      0/TCP
        State:          Running
          Started:      Tue, 18 Feb 2020 13:35:35 -0800
        Ready:          True
        Restart Count:  0
        Environment:    <none>
        Mounts:
          /var/run/secrets/kubernetes.io/serviceaccount from default-token-8gksw (ro)
    Conditions:
      Type              Status
      Initialized       True
      Ready             True
      ContainersReady   True
      PodScheduled      True
    Volumes:
      default-token-8gksw:
        Type:        Secret (a volume populated by a Secret)
        SecretName:  default-token-8gksw
        Optional:    false
    QoS Class:       BestEffort
    Node-Selectors:  <none>
    Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                     node.kubernetes.io/unreachable:NoExecute for 300s
    Events:
      Type    Reason     Age    From                       Message
      ----    ------     ----   ----                       -------
      Normal  Scheduled  4m58s  default-scheduler          Successfully assigned test1/nginx-deployment-5754944d6c-7wqjd to k8s-1d9qhq2cl-n1
      Normal  Pulling    4m57s  kubelet, k8s-1d9qhq2cl-n1  Pulling image "nginx:1.7.9"
      Normal  Pulled     4m52s  kubelet, k8s-1d9qhq2cl-n1  Successfully pulled image "nginx:1.7.9"
      Normal  Created    4m52s  kubelet, k8s-1d9qhq2cl-n1  Created container nginx
      Normal  Started    4m52s  kubelet, k8s-1d9qhq2cl-n1  Started container nginx
   ```

### Rescale the application deployment by increasing the replica count

Each pod is meant to run a single instance of a given application. If you want to scale your application horizontally to run multiple instances, you can increase the number of pods to one for each instance. In Kubernetes, this is referred to as replication.
You can increase the number of pods in your application deployment by applying a new YAML file. The YAML file changes the replicas setting to 4, which increases the number of pods in your deployment to four pods. To increase the number of pods from 2 to 4:

```powershell
PS C:\WINDOWS\system32> kubectl apply -f https://k8s.io/examples/application/deployment-scale.yaml -n "test1"
```

Alternatively, you can save the following markdown on your local machine and substitute the path and filename for the *-f* parameter for `kubectl apply`. For instance, "C:\Kubernetes\deployment-scale.yaml". The configuration for the application deployment scale would be:

```markdown
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 4 # Update the replicas from 2 to 4
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.8
        ports:
        - containerPort: 80
```

To verify that the deployment has four pods:

```powershell
kubectl get pods -l app=nginx
```

Example output for a rescaling deployment from two to four pods is shown below:

```powershell
PS C:\WINDOWS\system32> kubectl get pods -l app=nginx

NAME                               READY     STATUS    RESTARTS   AGE
nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
nginx-deployment-148880595-fxcez   1/1       Running   0          2m
nginx-deployment-148880595-rwovn   1/1       Running   0          2m
```

As you can see from the output, you now have four pods in your deployment that can run your application.

### Delete a Deployment

To delete the deployment, including all the pods, you need to run `kubectl delete deployment` specifying the name of the deployment *nginx-deployment* and the namespace name. To delete the deployment:

   ```powershell
   kubectl delete deployment nginx-deployment -n <namespace-string>
   ```

An example of command usage, with output, is shown below:

```powershell
PS C:\Users\user> kubectl delete deployment nginx-deployment -n "test1"
deployment.extensions "nginx-deployment" deleted
```

## Next steps

[Kubernetes Overview](azure-stack-edge-gpu-kubernetes-overview.md)