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

Occasionally, you may need to access an Azure Container Service (AKS) node for maintenance, log collection, or other troubleshooting operations. Azure Container Service (AKS) nodes are not exposed to the internet. Use the steps detailed in this document to create an SSH connection with an AKS node.

## Configure SSH access

 To SSH into a specific node, a pod is created with `hostNetwork` access. A service is also created for pod access. This configuration is privileged and should be removed after use.

Create a file named `aks-ssh.yaml` and copy in this manifest. Update the node name with the name of the target AKS node.

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
      nodeName: aks-nodepool1-42032720-0
```

Run the manifest to create the pod and service.

```azurecli-interactive
$ kubectl apply -f aks-ssh.yaml
```

Get the external IP address of the exposed service. It may take a minute for IP address configuration to complete. 

```azurecli-interactive
$ kubectl get service

NAME               TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)        AGE
kubernetes         ClusterIP      10.0.0.1      <none>          443/TCP        1d
aks-ssh            LoadBalancer   10.0.51.173   13.92.154.191   22:31898/TCP   17m
```

Create the ssh connection. 

The default user name for an AKS cluster is `azureuser`. If this account was changed at cluster creation time, substitute the proper admin user name. 

If your key is not at `~/ssh/id_rsa`, provide the correct location using the `ssh -i` argument.

```azurecli-interactive
$ ssh azureuser@13.92.154.191

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

azureuser@aks-nodepool1-42032720-0:~$
```

## Remove SSH access

When done, delete the SSH access pod and service.

```azurecli-interactive
kubectl delete -f aks-ssh.yaml
```