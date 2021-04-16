---
title: Create a Data Controller using Kubernetes tools
description: Create a Data Controller using Kubernetes tools
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 03/02/2021
ms.topic: how-to
---

# Create Azure Arc data controller using Kubernetes tools

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Prerequisites

Review the topic [Create the Azure Arc data controller](create-data-controller.md) for overview information.

To create the Azure Arc data Controller using Kubernetes tools you will need to have the Kubernetes tools installed.  The examples in this article will use `kubectl`, but similar approaches could be used with other Kubernetes tools such as the Kubernetes dashboard, `oc`, or `helm` if you are familiar with those tools and Kubernetes yaml/json.

[Install the kubectl tool](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

> [!NOTE]
> Some of the steps to create the Azure Arc data controller that are indicated below require Kubernetes cluster administrator permissions.  If you are not a Kubernetes cluster administrator, you will need to have the Kubernetes cluster administrator perform these steps on your behalf.

### Cleanup from past installations

If you installed Azure Arc data controller in the past, on the same cluster and deleted the Azure Arc data controller using `azdata arc dc delete` command, there may be some cluster level objects that would still need to be deleted. Run the following commands to delete Azure Arc data controller cluster level objects:

```console
# Cleanup azure arc data service artifacts
kubectl delete crd datacontrollers.arcdata.microsoft.com 
kubectl delete crd sqlmanagedinstances.sql.arcdata.microsoft.com 
kubectl delete crd postgresql-11s.arcdata.microsoft.com 
kubectl delete crd postgresql-12s.arcdata.microsoft.com
```

## Overview

Creating the Azure Arc data controller has the following high level steps:
1. Create the custom resource definitions for the Arc data controller, Azure SQL managed instance, and PostgreSQL Hyperscale. **[Requires Kubernetes Cluster Administrator Permissions]**
2. Create a namespace in which the data controller will be created. **[Requires Kubernetes Cluster Administrator Permissions]**
3. Create the bootstrapper service including the replica set, service account, role, and role binding.
4. Create a secret for the data controller administrator username and password.
5. Create the data controller.
   
## Create the custom resource definitions

Run the following command to create the custom resource definitions.  **[Requires Kubernetes Cluster Administrator Permissions]**

```console
kubectl create -f https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/custom-resource-definitions.yaml
```

## Create a namespace in which the data controller will be created

Run a command similar to the following to create a new, dedicated namespace in which the data controller will be created.  In this example and the remainder of the examples in this article, a namespace name of `arc` will be used. If you choose to use a different name, then use the same name throughout.

```console
kubectl create namespace arc
```

If other people will be using this namespace that are not cluster administrators, we recommend creating a namespace admin role and granting that role to those users through a role binding.  The namespace admin should have full permissions on the namespace.  More information will be provided later on how to provide more granular role-based access to users.

## Create the bootstrapper service

The bootstrapper service handles incoming requests for creating, editing, and deleting custom resources such as a data controller, SQL managed instance, or PostgreSQL Hyperscale server group.

Run the following command to create a bootstrapper service, a service account for the bootstrapper service, and a role and role binding for the bootstrapper service account.

```console
kubectl create --namespace arc -f https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/bootstrapper.yaml
```

Verify that the bootstrapper pod is running using the following command.  You may need to run it a few times until the status changes to `Running`.

```console
kubectl get pod --namespace arc
```

The bootstrapper.yaml template file defaults to pulling the bootstrapper container image from the Microsoft Container Registry (MCR).  If your environment does not have access directly to the Microsoft Container Registry, you can do the following:
- Follow the steps to [pull the container images from the Microsoft Container Registry and push them to a private container registry](offline-deployment.md).
- [Create an image pull secret](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-secret-by-providing-credentials-on-the-command-lin) for your private container registry.
- Add an image pull secret to the bootstrapper container. See example below.
- Change the image location for the bootstrapper image. See example below.

The example below assumes that you created a image pull secret name `regcred` as indicated in the Kubernetes documentation.

```yaml
#just showing only the relevant part of the bootstrapper.yaml template file here
containers:
      - env:
        - name: ACCEPT_EULA
          value: "Y"
        #image: mcr.microsoft.com/arcdata/arc-bootstrapper:public-preview-dec-2020  <-- template value to change
        image: <your registry DNS name or IP address>/<your repo>/arc-bootstrapper:<your tag>
        imagePullPolicy: IfNotPresent
        name: bootstrapper
        resources: {}
        securityContext:
          runAsUser: 21006
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      imagePullSecrets:
      - name: regcred
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      serviceAccount: sa-mssql-controller
      serviceAccountName: sa-mssql-controller
      terminationGracePeriodSeconds: 30

```

## Create a secret for the data controller administrator

The data controller administrator username and password is used to authenticate to the data controller API to perform administrative functions.  Choose a secure password and share it with only those that need to have cluster administrator privileges.

A Kubernetes secret is stored as a base64 encoded string - one for the username and one for the password.

You can use an online tool to base64 encode your desired username and password or you can use built in CLI tools depending on your platform.

PowerShell

```console
[Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes('<your string to encode here>'))

#Example
#[Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes('example'))

```

Linux/macOS

```console
echo -n '<your string to encode here>' | base64

#Example
# echo -n 'example' | base64
```

Once you have encoded the username and password you can create a file based on the [template file](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/controller-login-secret.yaml) and replace the username and password values with your own.

Then run the following command to create the secret.

```console
kubectl create --namespace arc -f <path to your data controller secret file>

#Example
kubectl create --namespace arc -f C:\arc-data-services\controller-login-secret.yaml
```

## Create the data controller

Now you are ready to create the data controller itself.

First, create a copy of the [template file](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/data-controller.yaml) locally on your computer so that you can modify some of the settings.

Edit the following as needed:

**REQUIRED**
- **location**: Change this to be the Azure location where the _metadata_ about the data controller will be stored.  You can see the list of available Azure locations in the [create data controller overview](create-data-controller.md) article.
- **resourceGroup**: the Azure resource group where you want to create the data controller Azure resource in Azure Resource Manager.  Typically this resource group should already exist, but it is not required until the time that you upload the data to Azure.
- **subscription**: the Azure subscription GUID for the subscription that you want to create the Azure resources in.

**RECOMMENDED TO REVIEW AND POSSIBLY CHANGE DEFAULTS**
- **storage..className**: the storage class to use for the data controller data and log files.  If you are unsure of the available storage classes in your Kubernetes cluster, you can run the following command: `kubectl get storageclass`.  The default is `default` which assumes there is a storage class that exists and is named `default` not that there is a storage class that _is_ the default.  Note: There are two className settings to be set to the desired storage class - one for data and one for logs.
- **serviceType**: Change the service type to `NodePort` if you are not using a LoadBalancer.  Note: There are two serviceType settings that need to be changed.
- On Azure Red Hat OpenShift or Red Hat OpenShift container platform, you must apply the security context constraint before you create the data controller. Follow the instructions at [Apply a security context constraint for Azure Arc enabled data services on OpenShift](how-to-apply-security-context-constraint.md).
- **Security** For Azure Red Hat OpenShift or Red Hat OpenShift container platform, replace the `security:` settings with the following values in the data controller yaml file. 

```yml
  security:
    allowDumps: true
    allowNodeMetricsCollection: false
    allowPodMetricsCollection: false
    allowRunAsRoot: false
```

**OPTIONAL**
- **name**: The default name of the data controller is `arc`, but you can change it if you want.
- **displayName**: Set this to the same value as the name attribute at the top of the file.
- **registry**: The Microsoft Container Registry is the default.  If you are pulling the images from the Microsoft Container Registry and [pushing them to a private container registry](offline-deployment.md), enter the IP address or DNS name of your registry here.
- **dockerRegistry**: The image pull secret to use to pull the images from a private container registry if required.
- **repository**: The default repository on the Microsoft Container Registry is `arcdata`.  If you are using a private container registry, enter the path the folder/repository containing the Azure Arc enabled data services container images.
- **imageTag**: the current latest version tag is defaulted in the template, but you can change it if you want to use an older version.

The following example shows a completed data controller yaml file. Update the example for your environment, based on your requirements, and the information above.

```yaml
apiVersion: arcdata.microsoft.com/v1alpha1
kind: datacontroller
metadata:
  generation: 1
  name: arc
spec:
  credentials:
    controllerAdmin: controller-login-secret
    #dockerRegistry: arc-private-registry - optional if you are using a private container registry that requires authentication using an image pull secret
    serviceAccount: sa-mssql-controller
  docker:
    imagePullPolicy: Always
    imageTag: public-preview-dec-2020 
    registry: mcr.microsoft.com
    repository: arcdata
  security:
    allowDumps: true
    allowNodeMetricsCollection: true
    allowPodMetricsCollection: true
    allowRunAsRoot: false
  services:
  - name: controller
    port: 30080
    serviceType: LoadBalancer
  - name: serviceProxy
    port: 30777
    serviceType: LoadBalancer
  settings:
    ElasticSearch:
      vm.max_map_count: "-1"
    azure:
      connectionMode: Indirect
      location: eastus
      resourceGroup: myresourcegroup
      subscription: c82c901a-129a-435d-86e4-cc6b294590ae
    controller:
      displayName: arc
      enableBilling: "True"
      logs.rotation.days: "7"
      logs.rotation.size: "5000"
  storage:
    data:
      accessMode: ReadWriteOnce
      className: default
      size: 15Gi
    logs:
      accessMode: ReadWriteOnce
      className: default
      size: 10Gi
```

Save the edited file on your local computer and run the following command to create the data controller:

```console
kubectl create --namespace arc -f <path to your data controller file>

#Example
kubectl create --namespace arc -f C:\arc-data-services\data-controller.yaml
```

## Monitoring the creation status

Creating the controller will take a few minutes to complete. You can monitor the progress in another terminal window with the following commands:

> [!NOTE]
>  The example commands below assume that you created a data controller and Kubernetes namespace with the name `arc`.  If you used a different namespace/data controller name, you can replace `arc` with your name.

```console
kubectl get datacontroller/arc --namespace arc
```

```console
kubectl get pods --namespace arc
```

You can also check on the creation status of any particular pod by running a command like below.  This is especially useful for troubleshooting any issues.

```console
kubectl describe po/<pod name> --namespace arc

#Example:
#kubectl describe po/control-2g7bl --namespace arc
```

Azure Arc extension for Azure Data Studio provides a notebook to walk you through the experience of how to set up Azure Arc enabled Kubernetes and configure it to monitor a git repository that contains a sample SQL Managed Instance yaml file. When everything is connected, a new SQL Managed Instance will be deployed to your Kubernetes cluster.

See the **Deploy a SQL Managed Instance using Azure Arc enabled Kubernetes and Flux** notebook in the Azure Arc extension for Azure Data Studio.

## Troubleshooting creation problems

If you encounter any troubles with creation, please see the [troubleshooting guide](troubleshoot-guide.md).

## Next steps

- [Create a SQL managed instance using Kubernetes-native tools](./create-sql-managed-instance-using-kubernetes-native-tools.md)
- [Create a PostgreSQL Hyperscale server group using Kubernetes-native tools](./create-postgresql-hyperscale-server-group-kubernetes-native-tools.md)
