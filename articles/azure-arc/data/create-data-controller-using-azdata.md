---
title: Create data controller using Azure Data CLI (azdata)
description: Create an Azure Arc data controller on a typical multi-node Kubernetes cluster which you already have created using the Azure Data CLI (azdata).
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 03/02/2021
ms.topic: how-to
---

# Create Azure Arc data controller using the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)]

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Prerequisites

Review the topic [Create the Azure Arc data controller](create-data-controller.md) for overview information.

To create the Azure Arc data Controller using the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] you will need to have the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] installed.

   [Install the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)]](install-client-tools.md)

Regardless of which target platform you choose, you will need to set the following environment variables prior to the creation for the data controller administrator user. You can provide these credentials to other people that need to have administrator access to the data controller as needed.

**AZDATA_USERNAME** - A username of your choice for the data controller administrator user. Example: `arcadmin`

**AZDATA_PASSWORD** - A password of your choice for the data controller administrator user. The password must be at least eight characters long and contain characters from three of the following four sets: uppercase letters, lowercase letters, numbers, and symbols.

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

You will need to connect and authenticate to a Kubernetes cluster and have an existing Kubernetes context selected prior to beginning the creation of the Azure Arc data controller. How you connect to a Kubernetes cluster or service varies. See the documentation for the Kubernetes distribution or service that you are using on how to connect to the Kubernetes API server.

You can check to see that you have a current Kubernetes connection and confirm your current context with the following commands.

```console
kubectl get namespace
kubectl config current-context
```

### Connectivity modes

As described in [Connectivity modes and requirements](./connectivity.md), Azure Arc data controller can be deployed either with either `direct` or `indirect` connectivity mode. With `direct` connectivity mode, usage data is automatically and continuously sent to Azure. In this articles, the examples specify `direct` connectivity mode as follows:

   ```console
   --connectivity-mode direct
   ```

   To create the controller with `indirect` connectivity mode, update the scripts in the example as specified below:

   ```console
   --connectivity-mode indirect
   ```

#### Create service principal

If you are deploying the Azure Arc data controller with `direct` connectivity mode, Service Principal credentials are required for the Azure connectivity. The service principal is used to upload usage and metrics data. 

Follow these commands to create your metrics upload service principal:

> [!NOTE]
> Creating a service principal requires [certain permissions in Azure](../../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app).

To create a service principal, update the following example. Replace `<ServicePrincipalName>` with the name of your service principal and run the command:

```azurecli
az ad sp create-for-rbac --name <ServicePrincipalName>
``` 

If you created the service principal earlier, and just need to get the current credentials, run the following command to reset the credential.

```azurecli
az ad sp credential reset --name <ServicePrincipalName>
```

For example, to create a service principal named `azure-arc-metrics`, run the following command

```console
az ad sp create-for-rbac --name azure-arc-metrics
```

Example output:

```output
"appId": "2e72adbf-de57-4c25-b90d-2f73f126e123",
"displayName": "azure-arc-metrics",
"name": "http://azure-arc-metrics",
"password": "5039d676-23f9-416c-9534-3bd6afc78123",
"tenant": "72f988bf-85f1-41af-91ab-2d7cd01ad1234"
```

Save the `appId`, `password`, and `tenant` values in an environment variable for use later. 

#### Save environment variables in Windows

```console
SET SPN_CLIENT_ID=<appId>
SET SPN_CLIENT_SECRET=<password>
SET SPN_TENANT_ID=<tenant>
SET SPN_AUTHORITY=https://login.microsoftonline.com
```

#### Save environment variables in Linux or macOS

```console
export SPN_CLIENT_ID='<appId>'
export SPN_CLIENT_SECRET='<password>'
export SPN_TENANT_ID='<tenant>'
export SPN_AUTHORITY='https://login.microsoftonline.com'
```

#### Save environment variables in PowerShell

```console
$Env:SPN_CLIENT_ID="<appId>"
$Env:SPN_CLIENT_SECRET="<password>"
$Env:SPN_TENANT_ID="<tenant>"
$Env:SPN_AUTHORITY="https://login.microsoftonline.com"
```

After you have created the service principal, assign the service principal to the appropriate role. 

### Assign roles to the service principal

Run this command to assign the service principal to the `Monitoring Metrics Publisher` role on the subscription where your database instance resources are located:

#### Run the command on Windows

> [!NOTE]
> You need to use double quotes for role names when running from a Windows environment.

```azurecli
az role assignment create --assignee <appId> --role "Monitoring Metrics Publisher" --scope subscriptions/<Subscription ID>
az role assignment create --assignee <appId> --role "Contributor" --scope subscriptions/<Subscription ID>
```

#### Run the command on Linux or macOS

```azurecli
az role assignment create --assignee <appId> --role 'Monitoring Metrics Publisher' --scope subscriptions/<Subscription ID>
az role assignment create --assignee <appId> --role 'Contributor' --scope subscriptions/<Subscription ID>
```

#### Run the command in PowerShell

```powershell
az role assignment create --assignee <appId> --role 'Monitoring Metrics Publisher' --scope subscriptions/<Subscription ID>
az role assignment create --assignee <appId> --role 'Contributor' --scope subscriptions/<Subscription ID>
```

```output
{
  "canDelegate": null,
  "id": "/subscriptions/<Subscription ID>/providers/Microsoft.Authorization/roleAssignments/f82b7dc6-17bd-4e78-93a1-3fb733b912d",
  "name": "f82b7dc6-17bd-4e78-93a1-3fb733b9d123",
  "principalId": "5901025f-0353-4e33-aeb1-d814dbc5d123",
  "principalType": "ServicePrincipal",
  "roleDefinitionId": "/subscriptions/<Subscription ID>/providers/Microsoft.Authorization/roleDefinitions/3913510d-42f4-4e42-8a64-420c39005123",
  "scope": "/subscriptions/<Subscription ID>",
  "type": "Microsoft.Authorization/roleAssignments"
}
```

With the service principal assigned to the appropriate role, and the environment variables set, you can proceed to create the data controller 

## Create the Azure Arc data controller

> [!NOTE]
> You can use a different value for the `--namespace` parameter of the azdata arc dc create command in the examples below, but be sure to use that namespace name for the `--namespace parameter` in all other commands below.

- [Create on Azure Kubernetes Service (AKS)](#create-on-azure-kubernetes-service-aks)
- [Create on AKS engine on Azure Stack Hub](#create-on-aks-engine-on-azure-stack-hub)
- [Create on AKS on Azure Stack HCI](#create-on-aks-on-azure-stack-hci)
- [Create on Azure Red Hat OpenShift (ARO)](#create-on-azure-red-hat-openshift-aro)
- [Create on Red Hat OpenShift Container Platform (OCP)](#create-on-red-hat-openshift-container-platform-ocp)
- [Create on open source, upstream Kubernetes (kubeadm)](#create-on-open-source-upstream-kubernetes-kubeadm)
- [Create on AWS Elastic Kubernetes Service (EKS)](#create-on-aws-elastic-kubernetes-service-eks)
- [Create on Google Cloud Kubernetes Engine Service (GKE)](#create-on-google-cloud-kubernetes-engine-service-gke)

### Create on Azure Kubernetes Service (AKS)

By default, the AKS deployment profile uses the `managed-premium` storage class. The `managed-premium` storage class will only work if you have VMs that were deployed using VM images that have premium disks.

If you are going to use `managed-premium` as your storage class, then you can run the following command to create the data controller. Substitute the placeholders in the command with your resource group name, subscription ID, and Azure location.

```console
azdata arc dc create --profile-name azure-arc-aks-premium-storage --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode direct

#Example:
#azdata arc dc create --profile-name azure-arc-aks-premium-storage --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode direct
```

If you are not sure what storage class to use, you should use the `default` storage class which is supported regardless of which VM type you are using. It just won't provide the fastest performance.

If you want to use the `default` storage class, then you can run this command:

```console
azdata arc dc create --profile-name azure-arc-aks-default-storage --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode direct

#Example:
#azdata arc dc create --profile-name azure-arc-aks-default-storage --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode direct
```

Once you have run the command, continue on to [Monitoring the creation status](#monitoring-the-creation-status).

### Create on AKS engine on Azure Stack Hub

By default, the deployment profile uses the `managed-premium` storage class. The `managed-premium` storage class will only work if you have worker VMs that were deployed using VM images that have premium disks on Azure Stack Hub.

You can run the following command to create the data controller using the managed-premium storage class:

```console
azdata arc dc create --profile-name azure-arc-aks-premium-storage --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode direct

#Example:
#azdata arc dc create --profile-name azure-arc-aks-premium-storage --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode direct
```

If you are not sure what storage class to use, you should use the `default` storage class which is supported regardless of which VM type you are using. In Azure Stack Hub, premium disks and standard disks are backed by the same storage infrastructure. Therefore, they are expected to provide the same general performance, but with different IOPS limits.

If you want to use the `default` storage class, then you can run this command.

```console
azdata arc dc create --profile-name azure-arc-aks-default-storage --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode direct

#Example:
#azdata arc dc create --profile-name azure-arc-aks-premium-storage --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode direct
```

Once you have run the command, continue on to [Monitoring the creation status](#monitoring-the-creation-status).

### Create on AKS on Azure Stack HCI

By default, the deployment profile uses a storage class named `default` and the service type `LoadBalancer`.

You can run the following command to create the data controller using the `default` storage class and service type `LoadBalancer`.

```console
azdata arc dc create --profile-name azure-arc-aks-hci --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode direct

#Example:
#azdata arc dc create --profile-name azure-arc-aks-hci --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode direct
```

Once you have run the command, continue on to [Monitoring the creation status](#monitoring-the-creation-status).


### Create on Azure Red Hat OpenShift (ARO)

Azure Red Hat OpenShift requires a security context constraint.

#### Apply the security context

Before you create the data controller on Azure Red Hat OpenShift, you will need to apply specific security context constraints (SCC). For the preview release, these relax the security constraints. Future releases will provide updated SCC.

[!INCLUDE [apply-security-context-constraint](includes/apply-security-context-constraint.md)]

#### Create custom deployment profile

Use the profile `azure-arc-azure-openshift` for Azure RedHat Open Shift.

```console
azdata arc dc config init --source azure-arc-azure-openshift --path ./custom
```

#### Create data controller

You can run the following command to create the data controller:

> [!NOTE]
> Use the same namespace here and in the `oc adm policy add-scc-to-user` commands above. Example is `arc`.

```console
azdata arc dc create --profile-name azure-arc-azure-openshift --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode direct

#Example
#azdata arc dc create --profile-name azure-arc-azure-openshift --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode direct
```

Once you have run the command, continue on to [Monitoring the creation status](#monitoring-the-creation-status).

### Create on Red Hat OpenShift Container Platform (OCP)

> [!NOTE]
> If you are using Red Hat OpenShift Container Platform on Azure, it is recommended to use the latest available version.

Before you create the data controller on Red Hat OCP, you will need to apply specific security context constraints. 

#### Apply the security context constraint

[!INCLUDE [apply-security-context-constraint](includes/apply-security-context-constraint.md)]

#### Determine storage class

You will also need to determine which storage class to use by running the following command.

```console
kubectl get storageclass
```

#### Create custom deployment profile

Create a new custom deployment profile file based on the `azure-arc-openshift` deployment profile by running the following command. This command creates a directory `custom` in your current working directory and a custom deployment profile file `control.json` in that directory.

Use the profile `azure-arc-openshift` for OpenShift Container Platform.

```console
azdata arc dc config init --source azure-arc-openshift --path ./custom
```

#### Set storage class 

Now, set the desired storage class by replacing `<storageclassname>` in the command below with the name of the storage class that you want to use that was determined by running the `kubectl get storageclass` command above.

```console
azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.data.className=<storageclassname>"
azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.logs.className=<storageclassname>"

#Example:
#azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.data.className=mystorageclass"
#azdata arc dc config replace --path ./custom/control.json --json-values "spec.storage.logs.className=mystorageclass"
```

#### Set LoadBalancer (optional)

By default, the `azure-arc-openshift` deployment profile uses `NodePort` as the service type. If you are using an OpenShift cluster that is integrated with a load balancer, you can change the configuration to use the `LoadBalancer` service type using the following command:

```console
azdata arc dc config replace --path ./custom/control.json --json-values "$.spec.services[*].serviceType=LoadBalancer"
```

#### Verify security policies

When using OpenShift, you might want to run with the default security policies in OpenShift or want to generally lock down the environment more than typical. You can optionally choose to disable some features to minimize the permissions required at deployment time and at run time by running the following commands.

This command disables metrics collections about pods. You will not be able to see metrics about pods in the Grafana dashboards if you disable this feature. Default is true.

```console
azdata arc dc config replace -p ./custom/control.json --json-values spec.security.allowPodMetricsCollection=false
```

This command disables metrics collections about nodes. You will not be able to see metrics about nodes in the Grafana dashboards if you disable this feature. Default is true.

```console
azdata arc dc config replace --path ./custom/control.json --json-values spec.security.allowNodeMetricsCollection=false
```

This command disables the ability to take memory dumps for troubleshooting purposes.
```console
azdata arc dc config replace --path ./custom/control.json --json-values spec.security.allowDumps=false
```

#### Create data controller

Now you are ready to create the data controller using the following command.

> [!NOTE]
>   Use the same namespace here and in the `oc adm policy add-scc-to-user` commands above. Example is `arc`.

> [!NOTE]
>   The `--path` parameter should point to the _directory_ containing the control.json file not to the control.json file itself.


```console
azdata arc dc create --path ./custom --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode direct

#Example:
#azdata arc dc create --path ./custom --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode direct
```

Once you have run the command, continue on to [Monitoring the creation status](#monitoring-the-creation-status).

### Create on open source, upstream Kubernetes (kubeadm)

By default, the kubeadm deployment profile uses a storage class called `local-storage` and service type `NodePort`. If this is acceptable you can skip the instructions below that set the desired storage class and service type and immediately run the `azdata arc dc create` command below.

If you want to customize your deployment profile to specify a specific storage class and/or service type, start by creating a new custom deployment profile file based on the kubeadm deployment profile by running the following command. This command will create a directory `custom` in your current working directory and a custom deployment profile file `control.json` in that directory.

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

By default, the kubeadm deployment profile uses `NodePort` as the service type. If you are using a Kubernetes cluster that is integrated with a load balancer, you can change the configuration using the following command.

```console
azdata arc dc config replace --path ./custom/control.json --json-values "$.spec.services[*].serviceType=LoadBalancer"
```

Now you are ready to create the data controller using the following command.

```console
azdata arc dc create --path ./custom --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode direct

#Example:
#azdata arc dc create --path ./custom --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode direct
```

Once you have run the command, continue on to [Monitoring the creation status](#monitoring-the-creation-status).

### Create on AWS Elastic Kubernetes Service (EKS)

By default, the EKS storage class is `gp2` and the service type is `LoadBalancer`.

Run the following command to create the data controller using the provided EKS deployment profile.

```console
azdata arc dc create --profile-name azure-arc-eks --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode direct

#Example:
#azdata arc dc create --profile-name azure-arc-eks --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode direct
```

Once you have run the command, continue on to [Monitoring the creation status](#monitoring-the-creation-status).

### Create on Google Cloud Kubernetes Engine Service (GKE)

By default, the GKE storage class is `standard` and the service type is `LoadBalancer`.

Run the following command to create the data controller using the provided GKE deployment profile.

```console
azdata arc dc create --profile-name azure-arc-gke --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode direct

#Example:
#azdata arc dc create --profile-name azure-arc-gke --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode direct
```

Once you have run the command, continue on to [Monitoring the creation status](#monitoring-the-creation-status).

## Monitoring the creation status

Creating the controller will take a few minutes to complete. You can monitor the progress in another terminal window with the following commands:

> [!NOTE]
>  The example commands below assume that you created a data controller and Kubernetes namespace with the name `arc`. If you used a different namespace/data controller name, you can replace `arc` with your name.

```console
kubectl get datacontroller/arc --namespace arc
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