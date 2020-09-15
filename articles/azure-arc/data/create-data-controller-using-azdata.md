---
title: Create data controller using Azure Data CLI (azdata)
description: Create an Azure Arc data controller on a typical multi-node Kubernetes cluster which you already have deployed using the Azure Data CLI (azdata).
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---
# Create Azure Arc data controller using the Azure Data CLI (azdata)

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Prerequisites

Review the topic [Deploy the Azure Arc data controller](create-data-controller.md) for overview information.

To install the Azure Arc data Controller using the Azure Data CLI you will need to have the Azure Data CLI installed.

   [Install the Azure Data CLI](install-client-tools.md)

Regardless of which target deployment platform you choose, you will need to set the following environment variables prior to the deployment for the data controller administrator user.  You can provide these credentials to other people that need to have administrator access to the data controller as needed.

**AZDATA_USERNAME** - A username of your choice for the data controller administrator user.  Example: `arcadmin`

**AZDATA_PASSWORD** - A password of your choice for the data controller administrator user.  The password must be at least 8 characters long and contain characters from three of the following four sets: uppercase letters, lowercase letters, numbers, and symbols.

### Linux or macOS

```console
export AZDATA_USERNAME="<your username of choice>"
export AZDATA_PASSWORD="<your password of choice>"
```

### Windows PowerShell

```console
$ENV:AZDATA_USERNAME="<your username of choice>"
$ENV:AZDATA_PASSWORD="<your password of choice>"
```

You will need to connect and authenticate to a Kubernetes cluster and have an existing Kubernetes context selected prior to beginning the deployment of the Azure Arc data controller.  How you connect to a Kubernetes cluster or service varies so please see the documentation for the Kubernetes distribution or service that you are using on how to connect to the Kubernetes API server.

You can check to see that you have a current Kubernetes connection and confirm your current context with the following commands.

```console
kubectl get namespace

kubectl config current-context
```

## Install the Azure Arc data controller

> [!NOTE]
> You can use a different value for the `--namespace` parameter of the azdata arc dc create command in the examples below, but be sure to use that namespace name for the --namespace parameter in all other commands below.

Follow the appropriate section below depending on your target platform to configure your deployment.

[Install on Azure Kubernetes Service (AKS)](#install-on-azure-kubernetes-service-aks)

[Install on AKS engine on Azure Stack Hub](#install-on-aks-engine-on-azure-stack-hub)

[Install on AKS on Azure Stack HCI](#install-on-aks-on-azure-stack-hci)

[Install on Azure Red Hat OpenShift (ARO)](#install-on-azure-red-hat-openshift-aro)

[Install on Red Hat OpenShift Container Platform (OCP)](#install-on-red-hat-openshift-container-platform-ocp)

[Install on open source, upstream Kubernetes (kubeadm)](#install-on-open-source-upstream-kubernetes-kubeadm)

[Install on AWS Elastic Kubernetes Service (EKS)](#install-on-aws-elastic-kubernetes-service-eks)

[Install on Google Cloud Kubernetes Engine Service (GKE)](#install-on-google-cloud-kubernetes-engine-service-gke)

### Install on Azure Kubernetes Service (AKS)

By default, the AKS deployment profile uses the 'managed-premium' storage class.  The 'managed-premium' storage class will only work if you have VMs that were deployed using VM images that have premium disks.

If you are going to use 'managed-premium' as your storage class, then you can run the following command to deploy the data controller.  Substitute the placeholders in the command with your resource group name, subscription ID, and Azure location.

```console
azdata arc dc create --profile-name azure-arc-aks-premium-storage --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example:
#azdata arc dc create --profile-name azure-arc-aks-premium-storage --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

If you are not sure what storage class to use, you should use the 'default' storage class which is supported regardless of which VM type you are using. It just won't provide the fastest performance.

If you want to use the 'default' storage class, then you can run this command:

```console
azdata arc dc create --profile-name azure-arc-aks-default-storage --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example:
#azdata arc dc create --profile-name azure-arc-aks-premium-storage --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

Once you have run the command, continue on to [Monitoring the deployment status](#monitoring-the-deployment-status).

### Install on AKS engine on Azure Stack Hub

By default, the deployment profile uses the 'managed-premium' storage class.  The 'managed-premium' storage class will only work if you have worker VMs that were deployed using VM images that have premium disks on Azure Stack Hub.

You can run the following command to deploy the data controller using the managed-premium storage class:

```console
azdata arc dc create --profile-name azure-arc-aks-premium-storage --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example:
#azdata arc dc create --profile-name azure-arc-aks-premium-storage --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

If you are not sure what storage class to use, you should use the 'default' storage class which is supported regardless of which VM type you are using. In Azure Stack Hub, premium disks and standard disks are backed by the same storage infrastructure. Therefore, they are expected to provide the same general performance, but with different IOPS limits.

If you want to use the 'default' storage class, then you can run this command.

```console
azdata arc dc create --profile-name azure-arc-aks-default-storage --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example:
#azdata arc dc create --profile-name azure-arc-aks-premium-storage --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

Once you have run the command, continue on to [Monitoring the deployment status](#monitoring-the-deployment-status).

### Install on AKS on Azure Stack HCI

By default, the deployment profile uses the a storage class named 'default' and the service type 'LoadBalancer'.

You can run the following command to deploy the data controller using the 'default' storage class and service type 'LoadBalancer'.

```console
azdata arc dc create --profile-name azure-arc-aks-hci --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example:
#azdata arc dc create --profile-name azure-arc-aks-hci --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

Once you have run the command, continue on to [Monitoring the deployment status](#monitoring-the-deployment-status).


### Install on Azure Red Hat OpenShift (ARO)

To deploy on Azure Red Hat OpenShift, you will need to execute the following commands against your cluster to relax the security constraints. This is a temporary requirement which will be removed in the future.
> [!NOTE]
>   Use the same namespace here and in the `azdata arc dc create` command below.  Example is 'arc'.

```console
oc adm policy add-scc-to-user privileged -z default -n arc
oc adm policy add-scc-to-user anyuid     -z default -n arc
```

You can run the following command to deploy the data controller:
> [!NOTE]
>   Use the same namespace here and in the `oc adm policy add-scc-to-user` commands above.  Example is 'arc'.

```console
azdata arc dc create --profile-name azure-arc-azure-openshift --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example
#azdata arc dc create --profile-name azure-arc-azure-openshift --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

Once you have run the command, continue on to [Monitoring the deployment status](#monitoring-the-deployment-status).

### Install on Red Hat OpenShift Container Platform (OCP)

To deploy on Red Hat OpenShift Container Platform, you will need to execute the following commands against your cluster to relax the security constraints. This is a temporary requirement which will be removed in the future.
> [!NOTE]
>   Use the same namespace here and in the `azdata arc dc create` command below.  Example is 'arc'.

```console
oc adm policy add-scc-to-user privileged --serviceaccount default --namespace arc
oc adm policy add-scc-to-user anyuid     --serviceaccount default --namespace arc
```

You will also need to determine which storage class to use by running the following command.

```console
kubectl get storageclass
```

First, start by creating a new custom deployment profile file based on the azure-arc-openshift deployment profile by running the following command.  This command will create a directory 'custom' in your current working directory and a custom deployment profile file 'control.json' in that directory.

```console
azdata arc dc config init --source azure-arc-openshift --path ./custom
```

Now, set the desired storage class by replacing `<storageclassname>` in the command below with the name of the storage class that you want to use that was determined by running the `kubectl get storageclass` command above.

```console
azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.data.className=<storageclassname>"
azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.logs.className=<storageclassname>"

#Example:
#azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.data.className=mystorageclass"
#azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.logs.className=mystorageclass"
```

By default, the azure-arc-openshift deployment profile uses 'NodePort' as the service type.  If you are using an OpenShift cluster that is integrated with a load balancer, you can change the configuration to use the LoadBalancer service type using the following command:

```console
azdata arc dc config replace --path ./custom/control.json --json-values "$.spec.endpoints[*].serviceType=LoadBalancer"
```

Oftentimes, when using OpenShift you might want to run with the default security policies in OpenShift or want to generally lock down the environment more than typical.  You can optionally choose to disable some features to minimize the permissions required at deployment time and at run time by running the following commands.

This command disables metrics collections about pods.  You will not be able to see metrics about pods in the Grafana dashboards if you disable this feature.  Default is true.

```console
azdata arc dc config replace -p ./custom2/control.json --json-values spec.security.allowPodMetricsCollection=false
```

This command disables metrics collections about nodes.  You will not be able to see metrics about nodes in the Grafana dashboards if you disable this feature.  Default is true.

```console
azdata arc dc config replace --path ./custom2/control.json --json-values spec.security.allowNodeMetricsCollection=false
```

This command disables the ability to take memory dumps for troubleshooting purposes.
```console
azdata arc dc config replace --path ./custom2/control.json --json-values spec.security.allowDumps=false
```

Now you are ready to install the data controller using the following command.
> [!NOTE]
>   Use the same namespace here and in the `oc adm policy add-scc-to-user` commands above.  Example is 'arc'.

> [!NOTE]
>   The --path parameter should point to the _directory_ containing the control.json file not to the control.json file itself.


```console
azdata arc dc create --path ./custom --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example:
#azdata arc dc create --path ./custom --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

Once you have run the command, continue on to [Monitoring the deployment status](#monitoring-the-deployment-status).

### Install on open source, upstream Kubernetes (kubeadm)

By default, the kubeadm deployment profile uses a storage class called 'local-storage' and service type 'NodePort'.  If this is acceptable you can skip the instructions below that set the desired storage class and service type and immediately run the `azdata arc dc create` command below.

If you want to customize your deployment profile to specify a specific storage class and/or service type, start by creating a new custom deployment profile file based on the kubeadm deployment profile by running the following command. This command will create a directory 'custom' in your current working directory and a custom deployment profile file 'control.json' in that directory.

```console
azdata arc dc config init --source azure-arc-kubeadm --path ./custom
```

You can look up the available storage classes by running the following command.

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

By default, the kubeadm deployment profile uses 'NodePort' as the service type.  If you are using a Kubernetes cluster that is integrated with a load balancer, you can change the configuration using the following command.

```console
azdata arc dc config replace --path ./custom/control.json --json-values "$.spec.endpoints[*].serviceType=LoadBalancer"
```

Now you are ready to install the data controller using the following command.

```console
azdata arc dc create --path ./custom --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example:
#azdata arc dc create --path ./custom --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

Once you have run the command, continue on to [Monitoring the deployment status](#monitoring-the-deployment-status).

### Install on AWS Elastic Kubernetes Service (EKS)

By default, the EKS storage class is 'gp2' and the service type is 'LoadBalancer'.

Run the following command to install the data controller using the provided EKS deployment profile.

```console
azdata arc dc create --profile-name azure-arc-eks --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example:
#azdata arc dc create --profile-name azure-arc-eks --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

Once you have run the command, continue on to [Monitoring the deployment status](#monitoring-the-deployment-status).

### Install on Google Cloud Kubernetes Engine Service (GKE)

By default, the GKE storage class is 'standard' and the service type is 'LoadBalancer'.

Run the following command to install the data controller using the provided GKE deployment profile.

```console
azdata arc dc create --profile-name azure-arc-gke --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example:
#azdata arc dc create --profile-name azure-arc-gke --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

Once you have run the command, continue on to [Monitoring the deployment status](#monitoring-the-deployment-status).

## Monitoring the deployment status

Creating the controller will take a few minutes to complete. You can monitor the progress in another terminal window with the following commands:

> [!NOTE]
>  The example commands below assume that you created a data controller and Kubernetes namespace with the name 'arc'.  If you used a different namespace/data controller name, you can replace 'arc' with your name.

```console
kubectl get datacontroller/arc --namespace arc
```

```console
kubectl get pods --namespace arc
```

You can also check on the deployment status of any particular pod by running a command like below.  This is especially useful for troubleshooting any issues.

```console
kubectl describe po/<pod name> --namespace arc

#Example:
#kubectl describe po/control-2g7bl --namespace arc
```

## Troubleshooting deployment problems

If you encounter any troubles with deployment, please see the [troubleshooting guide](troubleshoot-guide.md).