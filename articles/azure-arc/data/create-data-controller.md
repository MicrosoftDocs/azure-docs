---
title: Create data controller
description: Create controller for installing the Azure Arc data controller on a typical multi-node Kubernetes cluster which you already have deployed.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Create the Azure Arc data controller

> [!NOTE]
> Task is not required if you have used the [kickstart installation](kickstarter-install.md) to create a *one-box* virtual machine. This scenario is for installing the Azure Arc data controller on a typical multi-node Kubernetes cluster which you already have deployed.

## Overview of installing the Azure Arc data controller

Azure Arc enabled data services is supported on different types of Kubernetes clusters and managed Kubernetes services. Currently the following distributions and services are supported:

- Azure Kubernetes Service (AKS)
- Azure Kubernetes Engine (AKE) on Azure Stack
- OpenShift Container Platform (OCP) 4.2+
- Azure RedHat OpenShift (ARO)
- Open source, upstream Kubernetes version 1.14+ typically deployed using kubeadm
- AWS Elastic Kubernetes Service (EKS)

Regardless of which target deployment platform  you choose you will need to set the following environment variables:

- `AZDATA_USERNAME` - username of your choice
- `AZDATA_PASSWORD` - password of your choice (The password must be at least 8 characters long and contain characters from three of the following four sets: uppercase letters, lowercase letters, numbers, and symbols.)

You will also need to provide the following information in the `azdata arc dc create` command parameters:

- Data controller name - any friendly name of your choice
- Azure subscription ID - the Azure subscription ID for where you want the data controller resource in Azure to be created
- Resource group name - the name of the resource group where you want the data controller resource in Azure to be created
- Location - the Azure location where the data controller resource will be created in Azure - enter one of the following: 
   - eastus
   - eastus2
   - centralus
   - westus2
   - westeurope
   - southeastasia
- Connectivity Mode - Connectivity mode of your cluster. Currently only "indirect" is supported

> [!NOTE]
>  you can use a different value for the `--namespace` parameter of the `azdata arc dc create` command, but be sure to use that namespace in all other commands below, such as the `kubectl` commands.

## Set the environment variables

### Linux or macOS

```console
export AZDATA_USERNAME="<your username of choice> - For example, arcadmin"
export AZDATA_PASSWORD="<your password of choice>"
```

### Windows PowerShell

```console
$ENV:AZDATA_USERNAME="<your username of choice> - For example, arcadmin"
$ENV:AZDATA_PASSWORD="<your password of choice>"
```

## Install the Azure Arc data controller

Follow the appropriate section below depending on your target platform to configure your deployment.

### Install on Azure Kubernetes Service (AKS)

By default the AKS deployment profile uses the 'managed-premium' storage class. The 'managed-premium' storage class will only work if you have VMs that were deployed using VM images that have premium disks.

If you are going to use 'managed-premium' as your storage class, then you can run the following command to deploy the data controller:

You can run the following command to deploy the data controller using the managed-premium storage class:

```console
azdata arc dc create --profile-name azure-arc-aks-premium-storage --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect
```

If you are not sure what storage class to use, you should use the 'default' storage class which is supported regardless of which VM type you are using. It just won't provide the fastest performance.

If you want to use the 'default' storage class, then you can run this command:

```console
azdata arc dc create --profile-name azure-arc-aks-default-storage --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect
```

### Install on Kubernetes with AKS engine on Azure Stack Hub

By default the deployment profile uses the 'managed-premium' storage class. The 'managed-premium' storage class will only work if you have worker VMs that were deployed using VM images that have premium disks on Azure Stack Hub.

You can run the following command to deploy the data controller using the managed-premium storage class:

```console
azdata arc dc create --profile-name azure-arc-aks-premium-storage --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect
```

If you are not sure what storage class to use, you should use the 'default' storage class which is supported regardless of which VM type you are using. In Azure Stack Hub, premium disks and standard disks are backed by the same storage infrastructure. So they are expected to provide the same performance, but with different IOPS cap numbers.

If you want to use the 'default' storage class, then you can run this command:

```console
azdata arc dc create --profile-name azure-arc-aks-default-storage --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect
```

### Install on Azure RedHat OpenShift (ARO)

To deploy onto Azure OpenShift you will need to execute the following commands against your cluster to relax the security constraints. This is a temporary requirement which will be removed in the future.
> [!NOTE]
>   Use the same namespace here and in the `azdata arc dc create` command below. Example is 'arc'.

```console
oc adm policy add-scc-to-user privileged -z default -n arc
oc adm policy add-scc-to-user anyuid     -z default -n arc
```

You can run the following command to deploy the data controller:
> [!NOTE]
>   Use the same namespace here and in the `oc adm policy add-scc-to-user` commands above. Example is 'arc'.

```console
azdata arc dc create --profile-name azure-arc-azure-openshift --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect
```

### Install on OpenShift Container Platform (OCP)

To deploy onto Red Hat OpenShift Container Platform you will need to execute the following commands against your cluster to relax the security constraints. This is a temporary requirement which will be removed in the future.
> [!NOTE]
>   Use the same namespace here and in the `azdata arc dc create` command below. Example is 'arc'.

```console
oc adm policy add-scc-to-user privileged -z default -n arc
oc adm policy add-scc-to-user anyuid     -z default -n arc
```

You will need to determine which storage class to use by running the following command:

```console
kubectl get storageclass
```

First, start by creating a new custom deployment profile file based on the kubeadm deployment profile by running the following command:

```console
azdata arc dc config init -s azure-arc-openshift -t ./custom
```

Now, set the desired storage class by replacing `<storageclassname>` in the command below with the name of the storage class that you want to use that was determined by running the `kubectl get storageclass` command above.

```console
azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.data.className=<storageclassname>"
azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.logs.className=<storageclassname>"

#Example:
#azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.data.className=mystorageclass"
#azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.logs.className=mystorageclass"
```

By default the kubeadm deployment profile uses 'NodePort' as the service type. **If** you are using an OpenShift cluster that is integrated with a load balancer, you can change the configuration using the following command:

```console
azdata arc dc config replace --path ./custom/control.json --json-values "$.spec.endpoints[*].serviceType=LoadBalancer"
```

Oftentimes, customers using OpenShift want to run with the default security policies in OpenShift or want to generally lock down the environment more than typical. You can optionally choose to disable some features to minimize the permissions required at deployment time and at run time.

```console
#Disables metrics collections about pods. You will not be able to see metrics about pods in the Grafana dashboards if you disable this feature. Default is true.
azdata arc dc config replace -p ./custom2/control.json --json-values spec.security.allowPodMetricsCollection=false

#Disables metrics collections about nodes. You will not be able to see metrics about nodes in the Grafana dashboards if you disable this feature. Default is true.
azdata arc dc config replace -p ./custom2/control.json --json-values spec.security.allowNodeMetricsCollection=false

#Disables the ability to take dumps for troubleshooting purposes.
azdata arc dc config replace -p ./custom2/control.json --json-values spec.security.allowDumps=false
```

Now you are ready to install the data controller using the following command:
> [!NOTE]
>   Use the same namespace here and in the `oc adm policy add-scc-to-user` commands above. Example is 'arc'.

```console
azdata arc dc create --path ./custom --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect
```

### Install on open source, upstream Kubernetes (kubeadm)

By default, the kubeadm deployment profile uses a storage class called 'local-storage' and service type 'NodePort'. If this is acceptable you can skip the instructions below that set the desired storage class and service type and immediate run the `azdata arc dc create` command below.

If you want to customize your deployment profile to specify a specific storage class and/or service type, start by creating a new custom deployment profile file based on the kubeadm deployment profile by running the following command:

```console
azdata arc dc config init -s azure-arc-kubeadm -t ./custom
```

You can look up the available storage classes by running the following command:

```console
kubectl get storageclass
```

Now, set the desired storage class by replacing `<storageclassname>` in the command below with the name of the storage class that you want to use that was determined by running the `kubectl get storageclass` command above.

```console
azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.data.className=<storageclassname>"
azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.logs.className=<storageclassname>"

#Example:
#azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.data.className=mystorageclass"
#azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.logs.className=mystorageclass"
```

By default the kubeadm deployment profile uses 'NodePort' as the service type. **If** you are using a Kubernetes cluster that is integrated with a load balancer, you can change the configuration using the following command:

```console
azdata arc dc config replace --path ./custom/control.json --json-values "$.spec.endpoints[*].serviceType=LoadBalancer"
```

Now you are ready to install the data controller using the following command:

```console
azdata arc dc create --path ./custom --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect
```

### Install on AWS Elastic Kubernetes Service (EKS)

By default, the EKS storage class is 'gp2' and the service type is 'LoadBalancer'.

Run the following command to install the data controller using the provided EKS deployment profile:

```console
azdata arc dc create --profile-name azure-arc-eks --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect
```

## Monitoring the deployment status

Creating the controller will take a few minutes to complete. You can monitor the progress in another terminal window with the following command:

```console
kubectl get pods -n arc
```

You can also check on the deployment status of any particular pod by running a command like this:

```console
kubectl describe po/<pod name> -n arc
```

Example:

```console
kubectl describe po/control-2g7bl -n arc
```

## Next steps

Now try to [deploy a SQL Database managed instance](create-sql-managed-instance.md)
