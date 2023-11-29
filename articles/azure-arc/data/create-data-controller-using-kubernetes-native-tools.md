---
title: Create a data controller using Kubernetes tools
description: Create a data controller using Kubernetes tools
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Create Azure Arc-enabled data controller using Kubernetes tools

A data controller manages Azure Arc-enabled data services for a Kubernetes cluster. This article describes how to use Kubernetes tools to create a data controller.

Creating the data controller has the following high level steps:

1. Create the namespace and bootstrapper service
1. Create the data controller

> [!NOTE]
> For simplicity, the steps below assume that you are a Kubernetes cluster administrator. For production deployments or more secure environments, it is recommended to follow the security best practices of "least privilege" when deploying the data controller by granting only specific permissions to users and service accounts involved in the deployment process. 
>
> See the topic [Operate Arc-enabled data services with least privileges](least-privilege.md) for detailed instructions.


## Prerequisites

Review the topic [Plan an Azure Arc-enabled data services deployment](plan-azure-arc-data-services.md) for overview information.

To create the data controller using Kubernetes tools you will need to have the Kubernetes tools installed.  The examples in this article will use `kubectl`, but similar approaches could be used with other Kubernetes tools such as the Kubernetes dashboard, `oc`, or `helm` if you are familiar with those tools and Kubernetes yaml/json.

[Install the kubectl tool](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Create the namespace and bootstrapper service

The bootstrapper service handles incoming requests for creating, editing, and deleting custom resources such as a data controller.

Save a copy of [bootstrapper-unified.yaml](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/bootstrapper-unified.yaml), and replace the placeholder `{{NAMESPACE}}` in *all the places* in the file with the desired namespace name, for example: `arc`.

> [!IMPORTANT]
> The bootstrapper-unified.yaml template file defaults to pulling the bootstrapper container image from the Microsoft Container Registry (MCR). If your environment can't directly access the Microsoft Container Registry, you can do the following:
> - Follow the steps to [pull the container images from the Microsoft Container Registry and push them to a private container registry](offline-deployment.md).
> - [Create an image pull secret](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-secret-by-providing-credentials-on-the-command-line) named `arc-private-registry` for your private container registry.
> - Change the image URL for the bootstrapper image in the bootstrap.yaml file.
> - Replace `arc-private-registry` in the bootstrap.yaml file if a different name was used for the image pull secret.

Run the following command to create the namespace and bootstrapper service with the edited file.

```console
kubectl apply --namespace arc -f bootstrapper-unified.yaml
```

Verify that the bootstrapper pod is running using the following command.

```console
kubectl get pod --namespace arc -l app=bootstrapper
```

If the status is not _Running_, run the command a few times until the status is _Running_.

## Create the data controller

Now you are ready to create the data controller itself.

First, create a copy of the [template file](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/data-controller.yaml) locally on your computer so that you can modify some of the settings.

### Create the metrics and logs dashboards user names and passwords

At the top of the file, you can specify a user name and password that is used to authenticate to the metrics and logs dashboards as an administrator. Choose a secure password and share it with only those that need to have these privileges.

A Kubernetes secret is stored as a base64 encoded string - one for the username and one for the password.

You can use an online tool to base64 encode your desired username and password or you can use built in CLI tools depending on your platform.

PowerShell

```console
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes('<your string to encode here>'))

#Example
#[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes('example'))

```

Linux/macOS

```console
echo -n '<your string to encode here>' | base64

#Example
# echo -n 'example' | base64
```

### Create certificates for logs and metrics dashboards

Optionally, you can create SSL/TLS certificates for the logs and metrics dashboards. Follow the instructions at [Specify SSL/TLS certificates during Kubernetes native tools deployment](monitor-certificates.md).

### Edit the data controller configuration

Edit the data controller configuration as needed:

**REQUIRED**
- **location**: Change this to be the Azure location where the _metadata_ about the data controller will be stored.  Review the [list of available regions](overview.md#supported-regions).
- **resourceGroup**: the Azure resource group where you want to create the data controller Azure resource in Azure Resource Manager.  Typically this resource group should already exist, but it is not required until the time that you upload the data to Azure.
- **subscription**: the Azure subscription GUID for the subscription that you want to create the Azure resources in.

**RECOMMENDED TO REVIEW AND POSSIBLY CHANGE DEFAULTS**
- **storage..className**: the storage class to use for the data controller data and log files.  If you are unsure of the available storage classes in your Kubernetes cluster, you can run the following command: `kubectl get storageclass`.  The default is `default` which assumes there is a storage class that exists and is named `default` not that there is a storage class that _is_ the default.  Note: There are two className settings to be set to the desired storage class - one for data and one for logs.
- **serviceType**: Change the service type to `NodePort` if you are not using a LoadBalancer.
- **Security** For Azure Red Hat OpenShift or Red Hat OpenShift Container Platform, replace the `security:` settings with the following values in the data controller yaml file.

```yml
  security:
    allowDumps: false
    allowNodeMetricsCollection: false
    allowPodMetricsCollection: false
```

**OPTIONAL**
- **name**: The default name of the data controller is `arc`, but you can change it if you want.
- **displayName**: Set this to the same value as the name attribute at the top of the file.
- **logsui-certificate-secret**: The name of the secret created on the Kubernetes cluster for the logs UI certificate.
- **metricsui-certificate-secret**: The name of the secret created on the Kubernetes cluster for the metrics UI certificate.

The following example shows a completed data controller yaml.

:::code language="yaml" source="~/azure_arc_sample/arc_data_services/deploy/yaml/data-controller.yaml":::

Save the edited file on your local computer and run the following command to create the data controller:

```console
kubectl create --namespace arc -f <path to your data controller file>

#Example
kubectl create --namespace arc -f data-controller.yaml
```

## Monitoring the creation status

Creating the controller will take a few minutes to complete. You can monitor the progress in another terminal window with the following commands:

```console
kubectl get datacontroller --namespace arc
```

```console
kubectl get pods --namespace arc
```

You can also check on the creation status or logs of any particular pod by running a command like below.  This is especially useful for troubleshooting any issues.

```console
kubectl describe pod/<pod name> --namespace arc
kubectl logs <pod name> --namespace arc

#Example:
#kubectl describe pod/control-2g7bl --namespace arc
#kubectl logs control-2g7b1 --namespace arc
```

## Troubleshooting creation problems

If you encounter any troubles with creation, please see the [troubleshooting guide](troubleshoot-guide.md).

## Related content

- [Create a SQL managed instance using Kubernetes-native tools](./create-sql-managed-instance-using-kubernetes-native-tools.md)
- [Create a PostgreSQL server using Kubernetes-native tools](./create-postgresql-server-kubernetes-native-tools.md)

