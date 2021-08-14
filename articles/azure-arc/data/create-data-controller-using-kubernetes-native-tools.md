---
title: Create a Data Controller using Kubernetes tools
description: Create a Data Controller using Kubernetes tools
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Create Azure Arc data controller using Kubernetes tools


## Prerequisites

Review the topic [Create the Azure Arc data controller](create-data-controller.md) for overview information.

To create the Azure Arc data controller using Kubernetes tools you will need to have the Kubernetes tools installed.  The examples in this article will use `kubectl`, but similar approaches could be used with other Kubernetes tools such as the Kubernetes dashboard, `oc`, or `helm` if you are familiar with those tools and Kubernetes yaml/json.

[Install the kubectl tool](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

> [!NOTE]
> Some of the steps to create the Azure Arc data controller that are indicated below require Kubernetes cluster administrator permissions.  If you are not a Kubernetes cluster administrator, you will need to have the Kubernetes cluster administrator perform these steps on your behalf.

### Cleanup from past installations

If you installed the Azure Arc data controller in the past on the same cluster and deleted the Azure Arc data controller, there may be some cluster level objects that would still need to be deleted. Run the following commands to delete the Azure Arc data controller cluster level objects:

```console
# Cleanup azure arc data service artifacts

# Note: not all of these objects will exist in your environment depending on which version of the Arc data controller was installed

# Custom resource definitions (CRD)
kubectl delete crd datacontrollers.arcdata.microsoft.com
kubectl delete crd postgresqls.arcdata.microsoft.com
kubectl delete crd sqlmanagedinstances.sql.arcdata.microsoft.com
kubectl delete crd sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com
kubectl delete crd dags.sql.arcdata.microsoft.com
kubectl delete crd exporttasks.tasks.arcdata.microsoft.com
kubectl delete crd monitors.arcdata.microsoft.com

# Cluster roles and role bindings
kubectl delete clusterrole arcdataservices-extension
kubectl delete clusterrole arc:cr-arc-metricsdc-reader
kubectl delete clusterrole arc:cr-arc-dc-watch
kubectl delete clusterrole cr-arc-webhook-job

# Substitute the name of the namespace the data controller was deployed in into {namespace}.  If unsure, get the name of the mutatingwebhookconfiguration using 'kubectl get clusterrolebinding'
kubectl delete clusterrolebinding {namespace}:crb-arc-metricsdc-reader
kubectl delete clusterrolebinding {namespace}:crb-arc-dc-watch
kubectl delete clusterrolebinding crb-arc-webhook-job

# API services
# Up to May 2021 release
kubectl delete apiservice v1alpha1.arcdata.microsoft.com
kubectl delete apiservice v1alpha1.sql.arcdata.microsoft.com

# June 2021 release
kubectl delete apiservice v1beta1.arcdata.microsoft.com
kubectl delete apiservice v1beta1.sql.arcdata.microsoft.com

# GA/July 2021 release
kubectl delete apiservice v1.arcdata.microsoft.com
kubectl delete apiservice v1.sql.arcdata.microsoft.com

# Substitute the name of the namespace the data controller was deployed in into {namespace}.  If unsure, get the name of the mutatingwebhookconfiguration using 'kubectl get mutatingwebhookconfiguration'
kubectl delete mutatingwebhookconfiguration arcdata.microsoft.com-webhook-{namespace}

```

## Overview

Creating the Azure Arc data controller has the following high level steps:

   > [!IMPORTANT]
   > Some of the steps below require Kubernetes cluster administrator permissions

1. Create the custom resource definitions for the Arc data controller, Azure SQL managed instance, and PostgreSQL Hyperscale. 
1. Create a namespace in which the data controller will be created. 
1. Create the bootstrapper service including the replica set, service account, role, and role binding.
1. Create a secret for the data controller administrator username and password.
1. Create the webhook deployment job, cluster role and cluster role binding. 
1. Create the data controller.


## Create the custom resource definitions

Run the following command to create the custom resource definitions.  

   > [!IMPORTANT]
   > Requires Kubernetes cluster administrator permissions

```console
kubectl create -f https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/custom-resource-definitions.yaml
```

## Create a namespace in which the data controller will be created

Run a command similar to the following to create a new, dedicated namespace in which the data controller will be created.  In this example and the remainder of the examples in this article, a namespace name of `arc` will be used. If you choose to use a different name, then use the same name throughout.

```console
kubectl create namespace arc
```
If you are using OpenShift, you will need to edit the `openshift.io/sa.scc.supplemental-groups` and `openshift.io/sa.scc.uid-range` annotations on the namespace using `kubectl edit namespace <name of namespace>`.  Change these existing annotations to match these _specific_ UID and fsGroup IDs/ranges.

```console
openshift.io/sa.scc.supplemental-groups: 1000700001/10000
openshift.io/sa.scc.uid-range: 1000700001/10000
```

If other people will be using this namespace that are not cluster administrators, we recommend creating a namespace admin role and granting that role to those users through a role binding.  The namespace admin should have full permissions on the namespace.  More granular roles and example role bindings can be found on the [Azure Arc GitHub repository](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/yaml/rbac).

## Create the bootstrapper service

The bootstrapper service handles incoming requests for creating, editing, and deleting custom resources such as a data controller, SQL managed instances, or PostgreSQL Hyperscale server groups.

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

The example below assumes that you created a image pull secret name `arc-private-registry`.

```yaml
#Just showing only the relevant part of the bootstrapper.yaml template file here
    spec:
      serviceAccountName: sa-bootstrapper
      nodeSelector:
        kubernetes.io/os: linux
      imagePullSecrets:
      - name: arc-private-registry #Create this image pull secret if you are using a private container registry
      containers:
      - name: bootstrapper
        image: mcr.microsoft.com/arcdata/arc-bootstrapper:v1.0.0_2021-07-30 #Change this registry location if you are using a private container registry.
        imagePullPolicy: Always
```

## Create a secret for the Kibana/Grafana dashboards

The username and password is used to authenticate to the Kibana and Grafana dashboards as an administrator.  Choose a secure password and share it with only those that need to have these privileges.

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

## Create the webhook deployment job, cluster role and cluster role binding

First, create a copy of the [template file](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/web-hook.yaml) locally on your computer so that you can modify some of the settings.

Edit the file and replace `{{namespace}}` in all places with the name of the namespace you created in the previous step. **Save the file.**

Run the following command to create the cluster role and cluster role bindings.  

   > [!IMPORTANT]
   > Requires Kubernetes cluster administrator permissions

```console
kubectl create -n arc -f <path to the edited template file on your computer>
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
- **registry**: The Microsoft Container Registry is the default.  If you are pulling the images from the Microsoft Container Registry and [pushing them to a private container registry](offline-deployment.md), enter the IP address or DNS name of your registry here.
- **dockerRegistry**: The image pull secret to use to pull the images from a private container registry if required.
- **repository**: The default repository on the Microsoft Container Registry is `arcdata`.  If you are using a private container registry, enter the path the folder/repository containing the Azure Arc-enabled data services container images.
- **imageTag**: the current latest version tag is defaulted in the template, but you can change it if you want to use an older version.

The following example shows a completed data controller yaml file. Update the example for your environment, based on your requirements, and the information above.

```yml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: sa-mssql-controller
---
apiVersion: arcdata.microsoft.com/v1
kind: DataController
metadata:
  generation: 1
  name: arc-dc
spec:
  credentials:
    controllerAdmin: controller-login-secret
    dockerRegistry: arc-private-registry #Create a registry secret named 'arc-private-registry' if you are going to pull from a private registry instead of MCR.
    serviceAccount: sa-arc-controller
  docker:
    imagePullPolicy: Always
    imageTag: v1.0.0_2021-07-30
    registry: mcr.microsoft.com
    repository: arcdata
  infrastructure: other #Must be a value in the array [alibaba, aws, azure, gcp, onpremises, other]
  security:
    allowDumps: true #Set this to false if deploying on OpenShift
    allowNodeMetricsCollection: true #Set this to false if deploying on OpenShift
    allowPodMetricsCollection: true #Set this to false if deploying on OpenShift
  services:
  - name: controller
    port: 30080
    serviceType: LoadBalancer # Modify serviceType based on your Kubernetes environment
  settings:
    ElasticSearch:
      vm.max_map_count: "-1"
    azure:
      connectionMode: indirect
      location: eastus # Choose a different Azure location if you want
      resourceGroup: <your resource group>
      subscription: <your subscription GUID>
    controller:
      displayName: arc-dc
      enableBilling: "True"
      logs.rotation.days: "7"
      logs.rotation.size: "5000"
  storage:
    data:
      accessMode: ReadWriteOnce
      className: default # Use default configured storage class or modify storage class based on your Kubernetes environment
      size: 15Gi
    logs:
      accessMode: ReadWriteOnce
      className: default # Use default configured storage class or modify storage class based on your Kubernetes environment
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
kubectl describe pod/<pod name> --namespace arc

#Example:
#kubectl describe pod/control-2g7bl --namespace arc
```

## Troubleshooting creation problems

If you encounter any troubles with creation, please see the [troubleshooting guide](troubleshoot-guide.md).

## Next steps

- [Create a SQL managed instance using Kubernetes-native tools](./create-sql-managed-instance-using-kubernetes-native-tools.md)
- [Create a PostgreSQL Hyperscale server group using Kubernetes-native tools](./create-postgresql-hyperscale-server-group-kubernetes-native-tools.md)
