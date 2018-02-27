---
title: SSH into Azure Container Service (AKS) cluster nodes
description: Create an SSH connection with an Azure Container Service (AKS) cluster nodes
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 2/28/2018
ms.author: nepeters
ms.custom: mvc
---

# SSH into Azure Container Service (AKS) cluster nodes

Azure Container Service (AKS) are not exposed to the internet. In order to create an SSH connection with each node you need to either give each node a public IP address, or create a service internal to the cluster over which an SSH connection can be made.

This document details creating internal service for SSH connections.

## Create SSH service

Create a file named `aks-ssh.yaml` and copy in the following manifest.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: aks-ssh
spec:
  selector:
    app: aks-ssh
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 22
    targetPort: 22
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: aks-ssh
  labels:
    app: aks-ssh
spec:
  replicas: 1
  selector:
    matchLabels:
      app: aks-ssh
  template:
    metadata:
      labels:
        app: aks-ssh
    spec:
      containers:
      - name: alpine
        image: alpine:latest
        ports:
        - containerPort: 22
        command: ["/bin/sh", "-c", "--"]
        args: ["while true; do sleep 30; done;"]
      hostNetwork: true
```

Run the manifest using the following command.

```azurecli-interactive
kubectl apply -f aks-ssh.yaml
```

## Create the SSH connection

Get the IP address of the aks-ssh service. If the external IP address is pending, give it a minute and try again.

```azurecli-interactive
$ kubectl get service

NAME               TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)        AGE
kubernetes         ClusterIP      10.0.0.1      <none>          443/TCP        1d
aks-ssh            LoadBalancer   10.0.51.173   13.92.154.191   22:31898/TCP   17m
```

When creating an SSH session with the aks-ssh service, you are connected to the node on which the pod is created. If you would like to connected to separate nodes, used SSH key forwarding.

Set up SSH forwarding.

```azurecli-interactive
$ ssh-add

Identity added: /Users/user/.ssh/id_rsa (/Users/user/.ssh/id_rsa)
```

Create SSH connection.

```azurecli-interactive
$ ssh -A azureuser@13.92.154.191

Welcome to Ubuntu 16.04.3 LTS (GNU/Linux 4.11.0-1016-azure x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

48 packages can be updated.
0 updates are security updates.


*** System restart required ***
Last login: Tue Feb 27 20:10:38 2018 from 167.220.99.8
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

azureuser@aks-nodepool1-42032720-2:~$
```

Now that you have created an SSH connection with one node, you can SSH into any other nodes.

```azurecli-interactive
ssh azureuser@aks-nodepool1-42032720-0
```