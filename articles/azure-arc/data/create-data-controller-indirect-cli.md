---
title: Create data controller using CLI
description: Create an Azure Arc data controller, on a typical multi-node Kubernetes cluster that you already have created, using the CLI.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.custom: devx-track-azurecli
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Create Azure Arc data controller using the CLI


## Prerequisites

Review the topic [Plan an Azure Arc-enabled data services deployment](plan-azure-arc-data-services.md) for overview information.

### Install tools

Before you begin, install the `arcdata` extension for Azure (az) CLI. 

[Install the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)]](install-client-tools.md)

Regardless of which target platform you choose, you need to set the following environment variables prior to the creation for the data controller. These environment variables become the credentials used for accessing the metrics and logs dashboards after data controller creation.

### Set environment variables

Following are two sets of environment variables needed to access the metrics and logs dashboards.

The environment variables include passwords for log and metric services. The passwords must be at least eight characters long and contain characters from three of the following four categories: Latin uppercase letters, Latin lowercase letters, numbers, and non-alphanumeric characters.


# [Linux](#tab/linux)

```console
## variables for Metrics and Monitoring dashboard credentials
export AZDATA_LOGSUI_USERNAME=<username for Kibana dashboard>
export AZDATA_LOGSUI_PASSWORD=<password for Kibana dashboard>
export AZDATA_METRICSUI_USERNAME=<username for Grafana dashboard>
export AZDATA_METRICSUI_PASSWORD=<password for Grafana dashboard>
```

# [Windows (PowerShell)](#tab/windows)

```PowerShell
## variables for Metrics and Monitoring dashboard credentials
$ENV:AZDATA_LOGSUI_USERNAME="<username for Kibana dashboard>"
$ENV:AZDATA_LOGSUI_PASSWORD="<password for Kibana dashboard>"
$ENV:AZDATA_METRICSUI_USERNAME="<username for Grafana dashboard>"
$ENV:AZDATA_METRICSUI_PASSWORD="<password for Grafana dashboard>"
```

--- 

### Connect to Kubernetes cluster

Connect and authenticate to a Kubernetes cluster and have an existing Kubernetes context selected prior to beginning the creation of the Azure Arc data controller. How you connect to a Kubernetes cluster or service varies. See the documentation for the Kubernetes distribution or service that you are using on how to connect to the Kubernetes API server.

You can check to see that you have a current Kubernetes connection and confirm your current context with the following commands.

```console
kubectl cluster-info
kubectl config current-context
```

## Create the Azure Arc data controller

The following sections provide instructions for specific types of Kubernetes platforms. Follow the instructions for your platform.

- [Azure Kubernetes Service (AKS)](#create-on-azure-kubernetes-service-aks)
- [AKS on Azure Stack HCI](#create-on-aks-on-azure-stack-hci)
- [Azure Red Hat OpenShift (ARO)](#create-on-azure-red-hat-openshift-aro)
- [Red Hat OpenShift Container Platform (OCP)](#create-on-red-hat-openshift-container-platform-ocp)
- [Open source, upstream Kubernetes (kubeadm)](#create-on-open-source-upstream-kubernetes-kubeadm)
- [AWS Elastic Kubernetes Service (EKS)](#create-on-aws-elastic-kubernetes-service-eks)
- [Google Cloud Kubernetes Engine Service (GKE)](#create-on-google-cloud-kubernetes-engine-service-gke)

> [!TIP]
> If you have no Kubernetes cluster, you can create one on Azure. Follow the instructions at [Quickstart: Deploy Azure Arc-enabled data services - directly connected mode - Azure portal](create-complete-managed-instance-directly-connected.md) to walk through the entire process. 
>
> Then follow the instructions under [Create on Azure Kubernetes Service (AKS)](#create-on-azure-kubernetes-service-aks).

## Create on Azure Kubernetes Service (AKS)

By default, the AKS deployment profile uses the `managed-premium` storage class. The `managed-premium` storage class only works if you have VMs that were deployed using VM images that have premium disks.

If you are going to use `managed-premium` as your storage class, then you can run the following command to create the data controller. Substitute the placeholders in the command with your resource group name, subscription ID, and Azure location.

```azurecli
az arcdata dc create --profile-name azure-arc-aks-premium-storage --k8s-namespace <namespace> --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect --use-k8s

#Example:
#az arcdata dc create --profile-name azure-arc-aks-premium-storage --k8s-namespace arc --name arc --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --resource-group my-resource-group --location eastus --connectivity-mode indirect --use-k8s
```

If you are not sure what storage class to use, you should use the `default` storage class which is supported regardless of which VM type you are using. It just won't provide the fastest performance.

If you want to use the `default` storage class, then you can run this command:

```azurecli
az arcdata dc create --profile-name azure-arc-aks-default-storage --k8s-namespace <namespace> --use-k8s --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example:
#az arcdata dc create --profile-name azure-arc-aks-default-storage  --k8s-namespace arc --use-k8s --name arc --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

Once you have run the command, continue on to [Monitoring the creation status](#monitor-the-creation-status).

## Create on AKS on Azure Stack HCI

### Configure storage (Azure Stack HCI with AKS-HCI)

If you are using Azure Stack HCI with AKS-HCI, create a custom storage class with `fsType`.

   ```json
   fsType: ext4
   ```

Use this type to deploy the data controller. See the complete instructions at [Create a custom storage class for an AKS on Azure Stack HCI disk](/azure-stack/aks-hci/container-storage-interface-disks#create-a-custom-storage-class-for-an-aks-on-azure-stack-hci-disk).

By default, the deployment profile uses a storage class named `default` and the service type `LoadBalancer`.

You can run the following command to create the data controller using the `default` storage class and service type `LoadBalancer`.

```azurecli
az arcdata dc create --profile-name azure-arc-aks-hci  --k8s-namespace <namespace> --use-k8s --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example:
#az arcdata dc create --profile-name azure-arc-aks-hci  --k8s-namespace arc --use-k8s --name arc --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

Once you have run the command, continue on to [Monitoring the creation status](#monitor-the-creation-status).

## Create on Azure Red Hat OpenShift (ARO)

### Create custom deployment profile

Use the profile `azure-arc-azure-openshift` for Azure RedHat Open Shift.

```azurecli
az arcdata dc config init --source azure-arc-azure-openshift --path ./custom
```

### Create data controller

You can run the following command to create the data controller:

```azurecli
az arcdata dc create --profile-name azure-arc-azure-openshift  --k8s-namespace <namespace> --use-k8s --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example
#az arcdata dc create --profile-name azure-arc-azure-openshift  --k8s-namespace arc --use-k8s --name arc --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

Once you have run the command, continue on to [Monitoring the creation status](#monitor-the-creation-status).

## Create on Red Hat OpenShift Container Platform (OCP)

### Determine storage class

To determine which storage class to use, run the following command.

```console
kubectl get storageclass
```

### Create custom deployment profile

Create a new custom deployment profile file based on the `azure-arc-openshift` deployment profile by running the following command. This command creates a directory `custom` in your current working directory and a custom deployment profile file `control.json` in that directory.

Use the profile `azure-arc-openshift` for OpenShift Container Platform.

```azurecli
az arcdata dc config init --source azure-arc-openshift --path ./custom
```

### Set storage class 

Now, set the desired storage class by replacing `<storageclassname>` in the command below with the name of the storage class that you want to use that was determined by running the `kubectl get storageclass` command above.

```azurecli
az arcdata dc config replace --path ./custom/control.json --json-values "spec.storage.data.className=<storageclassname>"
az arcdata dc config replace --path ./custom/control.json --json-values "spec.storage.logs.className=<storageclassname>"

#Example:
#az arcdata dc config replace --path ./custom/control.json --json-values "spec.storage.data.className=mystorageclass"
#az arcdata dc config replace --path ./custom/control.json --json-values "spec.storage.logs.className=mystorageclass"
```

### Set LoadBalancer (optional)

By default, the `azure-arc-openshift` deployment profile uses `NodePort` as the service type. If you are using an OpenShift cluster that is integrated with a load balancer, you can change the configuration to use the `LoadBalancer` service type using the following command:

```azurecli
az arcdata dc config replace --path ./custom/control.json --json-values "$.spec.services[*].serviceType=LoadBalancer"
```

### Create data controller

Now you are ready to create the data controller using the following command.

> [!NOTE]
>  The `--path` parameter should point to the _directory_ containing the control.json file not to the control.json file itself.

> [!NOTE]
> When deploying to OpenShift Container Platform, specify the `--infrastructure` parameter value.  Options are: `aws`, `azure`, `alibaba`, `gcp`, `onpremises`.

```azurecli
az arcdata dc create --path ./custom  --k8s-namespace <namespace> --use-k8s --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect --infrastructure <infrastructure>

#Example:
#az arcdata dc create --path ./custom  --k8s-namespace arc --use-k8s --name arc --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --resource-group my-resource-group --location eastus --connectivity-mode indirect --infrastructure onpremises
```

Once you have run the command, continue on to [Monitoring the creation status](#monitor-the-creation-status).

## Create on open source, upstream Kubernetes (kubeadm)

By default, the kubeadm deployment profile uses a storage class called `local-storage` and service type `NodePort`. If this is acceptable you can skip the instructions below that set the desired storage class and service type and immediately run the `az arcdata dc create` command below.

If you want to customize your deployment profile to specify a specific storage class and/or service type, start by creating a new custom deployment profile file based on the kubeadm deployment profile by running the following command. This command creates a directory `custom` in your current working directory and a custom deployment profile file `control.json` in that directory.

```azurecli
az arcdata dc config init --source azure-arc-kubeadm --path ./custom 
```

You can look up the available storage classes by running the following command.

```console
kubectl get storageclass
```

Now, set the desired storage class by replacing `<storageclassname>` in the command below with the name of the storage class that you want to use that was determined by running the `kubectl get storageclass` command above.

```azurecli
az arcdata dc config replace --path ./custom/control.json --json-values "spec.storage.data.className=<storageclassname>"
az arcdata dc config replace --path ./custom/control.json --json-values "spec.storage.logs.className=<storageclassname>"

#Example:
#az arcdata dc config replace --path ./custom/control.json --json-values "spec.storage.data.className=mystorageclass"
#az arcdata dc config replace --path ./custom/control.json --json-values "spec.storage.logs.className=mystorageclass"
```

By default, the kubeadm deployment profile uses `NodePort` as the service type. If you are using a Kubernetes cluster that is integrated with a load balancer, you can change the configuration using the following command.

```azurecli
az arcdata dc config replace --path ./custom/control.json --json-values "$.spec.services[*].serviceType=LoadBalancer"
```

Now you are ready to create the data controller using the following command.

> [!NOTE]
> When deploying to OpenShift Container Platform, specify the `--infrastructure` parameter value.  Options are: `aws`, `azure`, `alibaba`, `gcp`, `onpremises`.

```azurecli
az arcdata dc create --path ./custom  --k8s-namespace <namespace> --use-k8s --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect --infrastructure <infrastructure>

#Example:
#az arcdata dc create --path ./custom - --k8s-namespace <namespace> --use-k8s --name arc --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --resource-group my-resource-group --location eastus --connectivity-mode indirect --infrastructure onpremises
```

Once you have run the command, continue on to [Monitoring the creation status](#monitor-the-creation-status).

## Create on AWS Elastic Kubernetes Service (EKS)

By default, the EKS storage class is `gp2` and the service type is `LoadBalancer`.

Run the following command to create the data controller using the provided EKS deployment profile.

```azurecli
az arcdata dc create --profile-name azure-arc-eks  --k8s-namespace <namespace> --use-k8s --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example:
#az arcdata dc create --profile-name azure-arc-eks  --k8s-namespace <namespace> --use-k8s --name arc --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

Once you have run the command, continue on to [Monitoring the creation status](#monitor-the-creation-status).

## Create on Google Cloud Kubernetes Engine Service (GKE)

By default, the GKE storage class is `standard` and the service type is `LoadBalancer`.

Run the following command to create the data controller using the provided GKE deployment profile.

```azurecli
az arcdata dc create --profile-name azure-arc-gke --k8s-namespace <namespace> --use-k8s --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example:
#az arcdata dc create --profile-name azure-arc-gke --k8s-namespace <namespace> --use-k8s --name arc --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

Once you have run the command, continue on to [Monitoring the creation status](#monitor-the-creation-status).

## Monitor the creation status

It takes a few minutes to create the controller completely. You can monitor the progress in another terminal window with the following commands:

> [!NOTE]
> The example commands below assume that you created a data controller named `arc-dc` and Kubernetes namespace named `arc`. If you used different values update the script accordingly.

```console
kubectl get datacontroller/arc-dc --namespace arc
```

```console
kubectl get pods --namespace arc
```

You can also check on the creation status of any particular pod by running a command like below. This is especially useful for troubleshooting any issues.

```console
kubectl describe po/<pod name> --namespace arc

#Example:
#kubectl describe po/control-2g7bl --namespace arc
```

## Troubleshooting creation problems

If you encounter any troubles with creation, see the [troubleshooting guide](troubleshoot-guide.md).
