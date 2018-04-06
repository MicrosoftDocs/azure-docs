---
title: GPUs on Azure Container Service (AKS)
description: Use GPUs on Azure Container Service (AKS)
services: container-service
author: laevenso
manager: gamonroy

ms.service: container-service
ms.topic: article
ms.date: 04/05/2018
ms.author: -
ms.custom: mvc
---

# Using GPUs on AKS

AKS supports the creation of GPU enabled node pools. Azure currently provides single or multiple GPU enabled VMs. GPU enabled VMs are designed for compute-intensive, graphics-intensive, and visualization workloads. A list of GPU enabled VMs can be found [here](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes-gpu).


## Create an AKS cluster

GPUs are generally needed for compute-intesive workloads suchas graphics-intensive, and visualization workloads. Please refer to the following [document](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes-gpu) to determine the right VM size for your workload.
We recommend a minimum size of `Standard_NC6` for your Azure Container Service (AKS) nodes.

> [!NOTE]
> GPU enabled VMs contain specialized hardware that is subject to higher pricing. Please refer to the [pricing](https://azure.microsoft.com/en-us/pricing/) tool for more information.


If you need an AKS cluster that meets this minimum recommendation, run the following commands.

Create a resource group for the cluster.

```azurecli
az group create --name myGPUCluster --location eastus
```

Create the AKS cluster with nodes that are of size `Standard_D3_v2`.

```azurecli
az aks create --resource-group myGPUCluster --name myGPUCluster --node-vm-size Standard_NC6
```

Connect to the AKS cluster.

```azurecli
az aks get-credentials --resource-group myGPUCluster --name myGPUCluster
```

## Confirm GPUs are schedulable

Run the following commands to confirm the GPUs are schedulable via Kubernetes. 

Get the current list of nodes

```
kubectl get nodes
NAME                       STATUS    ROLES     AGE       VERSION
aks-nodepool1-22139053-0   Ready     agent     10h       v1.9.6
aks-nodepool1-22139053-1   Ready     agent     10h       v1.9.6
aks-nodepool1-22139053-2   Ready     agent     10h       v1.9.6
```

Describe one of the nodes to confirm the GPUs are schedulable. This can be found under the `Capacity` section. For example `alpha.kubernetes.io/nvidia-gpu:  1`

```
$ kubectl describe node aks-nodepool1-22139053-0
Name:               aks-nodepool1-22139053-0
Roles:              agent
Labels:             agentpool=nodepool1
                    beta.kubernetes.io/arch=amd64
                    beta.kubernetes.io/instance-type=Standard_NC6
                    beta.kubernetes.io/os=linux
                    failure-domain.beta.kubernetes.io/region=eastus
                    failure-domain.beta.kubernetes.io/zone=1
                    kubernetes.azure.com/cluster=MC_myGPUCluster_myGPUCluster
                    kubernetes.io/hostname=aks-nodepool1-22139053-0
                    kubernetes.io/role=agent
                    storageprofile=managed
                    storagetier=Standard_LRS
Annotations:        node.alpha.kubernetes.io/ttl=0
                    volumes.kubernetes.io/controller-managed-attach-detach=true
Taints:             <none>
CreationTimestamp:  Thu, 05 Apr 2018 12:13:20 -0700
Conditions:
  Type                 Status  LastHeartbeatTime                 LastTransitionTime                Reason                       Message
  ----                 ------  -----------------                 ------------------                ------                       -------
  NetworkUnavailable   False   Thu, 05 Apr 2018 12:15:07 -0700   Thu, 05 Apr 2018 12:15:07 -0700   RouteCreated                 RouteController created a route
  OutOfDisk            False   Thu, 05 Apr 2018 22:14:33 -0700   Thu, 05 Apr 2018 12:13:20 -0700   KubeletHasSufficientDisk     kubelet has sufficient disk space available
  MemoryPressure       False   Thu, 05 Apr 2018 22:14:33 -0700   Thu, 05 Apr 2018 12:13:20 -0700   KubeletHasSufficientMemory   kubelet has sufficient memory available
  DiskPressure         False   Thu, 05 Apr 2018 22:14:33 -0700   Thu, 05 Apr 2018 12:13:20 -0700   KubeletHasNoDiskPressure     kubelet has no disk pressure
  Ready                True    Thu, 05 Apr 2018 22:14:33 -0700   Thu, 05 Apr 2018 12:15:10 -0700   KubeletReady                 kubelet is posting ready status. AppArmor enabled
Addresses:
  InternalIP:  10.240.0.4
  Hostname:    aks-nodepool1-22139053-0
Capacity:
 alpha.kubernetes.io/nvidia-gpu:  1
 cpu:                             6
 memory:                          57691688Ki
 pods:                            110
Allocatable:
 alpha.kubernetes.io/nvidia-gpu:  1
 cpu:                             6
 memory:                          57589288Ki
 pods:                            110
System Info:
 Machine ID:                 2eb0e90bd1fe450ba3cf83479443a511
 System UUID:                CFB485B6-CB49-A545-A2C9-8E4C592C3273
 Boot ID:                    fea24544-596d-4246-b8c3-610fc7ac7280
 Kernel Version:             4.13.0-1011-azure
 OS Image:                   Debian GNU/Linux 9 (stretch)
 Operating System:           linux
 Architecture:               amd64
 Container Runtime Version:  docker://1.13.1
 Kubelet Version:            v1.9.6
 Kube-Proxy Version:         v1.9.6
PodCIDR:                     10.244.1.0/24
ExternalID:                  /subscriptions/8ecadfc9-d1a3-4ea4-b844-0d9f87e4d7c8/resourceGroups/MC_levo-aks-eastus_levo-eus-01_eastus/providers/Microsoft.Compute/virtualMachines/aks-nodepool1-22139053-0
Non-terminated Pods:         (2 in total)
  Namespace                  Name                       CPU Requests  CPU Limits  Memory Requests  Memory Limits
  ---------                  ----                       ------------  ----------  ---------------  -------------
  kube-system                kube-proxy-pwffr           100m (1%)     0 (0%)      0 (0%)           0 (0%)
  kube-system                kube-svc-redirect-mkpf4    0 (0%)        0 (0%)      0 (0%)           0 (0%)
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  CPU Requests  CPU Limits  Memory Requests  Memory Limits
  ------------  ----------  ---------------  -------------
  100m (1%)     0 (0%)      0 (0%)           0 (0%)
Events:         <none>
```

## Run a GPU enabled workload

In order to demonstrate the GPUs are indeed working we'll schedule a GPU enabled workload with the appropriate resource request. In this example we will be running a [Tensorflow job](https://www.tensorflow.org/versions/r1.1/get_started/mnist/beginners) against the [MNIST dataset](http://yann.lecun.com/exdb/mnist/)

The following job specification includes a resource limit of `alpha.kubernetes.io/nvidia-gpu: 1`. The appropriate drivers will be available on the node and must be mounted (/usr/local/nvidia) into the pod using the appropriate volume specification as seen below

```
apiVersion: batch/v1
kind: Job
metadata:
  labels:
    app: tf-mnist
  name: tf-mnist
spec:
  template:
    metadata:
      labels:
        app: tf-mnist
    spec:
      containers:
      - name: tf-mnist
        image: lachlanevenson/tf-mnist:gpu
        args: ["--max_steps", "500"]
        imagePullPolicy: IfNotPresent
        resources:
          limits:
            alpha.kubernetes.io/nvidia-gpu: 1
        volumeMounts:
        - name: nvidia
          mountPath: /usr/local/nvidia
      restartPolicy: OnFailure
      volumes:
        - name: nvidia
          hostPath:
            path: /usr/local/nvidia         
```

Confirm that the job pod completed successfully
```
$ kubectl get pods --show-all
NAME              READY     STATUS      RESTARTS   AGE
mnist-pod-7dthc   0/1       Completed   0          6h
$ kubectl get jobs
NAME        DESIRED   SUCCESSFUL   AGE
mnist-pod   1         1            6h
```

Refer to the pod logs to confirm that the appropriate GPU device has been discovered in this case. `Tesla K80`
```
$ kubectl logs mnist-pod-7dthc
2018-04-05 22:31:11.676047: I tensorflow/core/platform/cpu_feature_guard.cc:137] Your CPU supports instructions that this TensorFlow binary was not compiled to use: SSE4.1 SSE4.2 AVX AVX2 FMA
2018-04-05 22:31:19.256648: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1030] Found device 0 with properties:
name: Tesla K80 major: 3 minor: 7 memoryClockRate(GHz): 0.8235
pciBusID: 1f3c:00:00.0
totalMemory: 11.17GiB freeMemory: 11.10GiB
2018-04-05 22:31:19.256690: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1120] Creating TensorFlow device (/device:GPU:0) -> (device: 0, name: Tesla K80, pci bus id: 1f3c:00:00.0, compute capability: 3.7)
2018-04-05 22:31:24.131547: I tensorflow/stream_executor/dso_loader.cc:139] successfully opened CUDA library libcupti.so.8.0 locally
Successfully downloaded train-images-idx3-ubyte.gz 9912422 bytes.
Extracting /tmp/tensorflow/input_data/train-images-idx3-ubyte.gz
Successfully downloaded train-labels-idx1-ubyte.gz 28881 bytes.
Extracting /tmp/tensorflow/input_data/train-labels-idx1-ubyte.gz
Successfully downloaded t10k-images-idx3-ubyte.gz 1648877 bytes.
Extracting /tmp/tensorflow/input_data/t10k-images-idx3-ubyte.gz
Successfully downloaded t10k-labels-idx1-ubyte.gz 4542 bytes.
Extracting /tmp/tensorflow/input_data/t10k-labels-idx1-ubyte.gz
Accuracy at step 0: 0.093
Accuracy at step 10: 0.6566
Accuracy at step 20: 0.7899
Accuracy at step 30: 0.8392
Accuracy at step 40: 0.873
Accuracy at step 50: 0.884
Accuracy at step 60: 0.8913
Accuracy at step 70: 0.9021
Accuracy at step 80: 0.9064
Accuracy at step 90: 0.91
Adding run metadata for 99
Accuracy at step 100: 0.9066
Accuracy at step 110: 0.9093
Accuracy at step 120: 0.9133
Accuracy at step 130: 0.9213
Accuracy at step 140: 0.9212
Accuracy at step 150: 0.9238
Accuracy at step 160: 0.9276
Accuracy at step 170: 0.9273
Accuracy at step 180: 0.9258
Accuracy at step 190: 0.9325
Adding run metadata for 199
Accuracy at step 200: 0.93
Accuracy at step 210: 0.9319
Accuracy at step 220: 0.9328
Accuracy at step 230: 0.9355
Accuracy at step 240: 0.9337
Accuracy at step 250: 0.9351
Accuracy at step 260: 0.9359
Accuracy at step 270: 0.9368
Accuracy at step 280: 0.9416
Accuracy at step 290: 0.9409
Adding run metadata for 299
Accuracy at step 300: 0.9406
Accuracy at step 310: 0.943
Accuracy at step 320: 0.942
Accuracy at step 330: 0.9448
Accuracy at step 340: 0.9479
Accuracy at step 350: 0.9488
Accuracy at step 360: 0.9458
Accuracy at step 370: 0.9444
Accuracy at step 380: 0.9491
Accuracy at step 390: 0.9461
Adding run metadata for 399
Accuracy at step 400: 0.9481
Accuracy at step 410: 0.9509
Accuracy at step 420: 0.9514
Accuracy at step 430: 0.9508
Accuracy at step 440: 0.9515
Accuracy at step 450: 0.9511
Accuracy at step 460: 0.9501
Accuracy at step 470: 0.9515
Accuracy at step 480: 0.9529
Accuracy at step 490: 0.9547
Adding run metadata for 499
```
