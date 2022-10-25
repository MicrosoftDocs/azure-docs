---
title: Operate Azure Arc-enabled data services with least privileges
description: Explains how to operate Azure Arc-enabled data services with least privileges
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 11/07/2021
ms.topic: how-to
---

# Operate Azure Arc-enabled data services with least privileges

Operating Arc-enabled data services with least privileges is a security best practice. Only grant users and service accounts the specific permissions required to perform the required tasks. Both Azure and Kubernetes provide a role-based access control model which can be used to grant these specific permissions. This article describes certain common scenarios in which the security of least privilege should be applied.

> [!NOTE]
> In this article, a namespace name of `arc` will be used. If you choose to use a different name, then use the same name throughout.
> In this article, the `kubectl` CLI utility is used as the example. Any tool or system that uses the Kubernetes API can be used though.

## Deploy the Azure Arc data controller

Deploying the Azure Arc data controller requires some permissions which can be considered high privilege such as creating a Kubernetes namespace or creating cluster role. The following steps can be followed to separate the deployment of the data controller into multiple steps, each of which can be performed by a user or a service account which has the required permissions. This separation of duties ensures that each user or service account in the process has just the permissions required and nothing more.

### Deploy a namespace in which the data controller will be created

This step will create a new, dedicated Kubernetes namespace into which the Arc data controller will be deployed. It is essential to perform this step first, because the following steps will use this new namespace as a scope for the permissions that are being granted.

Permissions required to perform this action:

- Namespace
  - Create
  - Edit (if required for OpenShift clusters)

Run a command similar to the following to create a new, dedicated namespace in which the data controller will be created. 

```console
kubectl create namespace arc
```

If you are using OpenShift, you will need to edit the `openshift.io/sa.scc.supplemental-groups` and `openshift.io/sa.scc.uid-range` annotations on the namespace using `kubectl edit namespace <name of namespace>`.  Change these existing annotations to match these _specific_ UID and fsGroup IDs/ranges.

```console
openshift.io/sa.scc.supplemental-groups: 1000700001/10000
openshift.io/sa.scc.uid-range: 1000700001/10000
```

## Assign permissions to the deploying service account and users/groups

This step will create a service account and assign roles and cluster roles to the service account so that the service account can be used in a job to deploy the Arc data controller with the least privileges required.

Permissions required to perform this action:

- Service account
  - Create
- Role
  - Create
- Role binding
  - Create
- Cluster role
  - Create
- Cluster role binding
  - Create
- All the permissions being granted to the service account (see the arcdata-deployer.yaml below for details)

Save a copy of [arcdata-deployer.yaml](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/arcdata-deployer.yaml), and replace the placeholder `{{NAMESPACE}}` in the file with the namespace created in the previous step, for example: `arc`. Run the following command to create the deployer service account with the edited file.

```console
kubectl apply --namespace arc -f arcdata-deployer.yaml
```

## Grant permissions to users to create the bootstrapper job and data controller

Permissions required to perform this action:

- Role
  - Create
- Role binding
  - Create

Save a copy of [arcdata-installer.yaml](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/arcdata-installer.yaml), and replace the placeholder `{{INSTALLER_USERNAME}}` in the file with the name of the user to grant the permissions to, for example: `john@contoso.com`. Add additional role binding subjects such as other users or groups as needed. Run the following command to create the installer permissions with the edited file.

```console
kubectl apply --namespace arc -f arcdata-installer.yaml
```

## Deploy the bootstrapper job

Permissions required to perform this action:

- User that is assigned to the arcdata-installer-role role in the previous step

Run the following command to create the bootstrapper job that will run preparatory steps to deploy the data controller.

```console
kubectl apply --namespace arc -f https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/bootstrapper.yaml
```

## Create the Arc data controller

Now you are ready to create the data controller itself.

First, create a copy of the [template file](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/data-controller.yaml) locally on your computer so that you can modify some of the settings.

### Create the metrics and logs dashboards user names and passwords

At the top of the file, you can specify a user name and password that is used to authenticate to the metrics and logs dashboards as an administrator. Choose a secure password and share it with only those that need to have these privileges.

A Kubernetes secret is stored as a base64 encoded string - one for the username and one for the password.

```consoole
echo -n '<your string to encode here>' | base64
# echo -n 'example' | base64
```

Optionally, you can create SSL/TLS certificates for the logs and metrics dashboards. Follow the instructions at [Specify SSL/TLS certificates during Kubernetes native tools deployment](monitor-certificates.md).

### Edit the data controller configuration

Edit the data controller configuration as needed:

#### REQUIRED

- `location`: Change this to be the Azure location where the _metadata_ about the data controller will be stored.  Review the [list of available regions](overview.md#supported-regions).
- `logsui-certificate-secret`: The name of the secret created on the Kubernetes cluster for the logs UI certificate.
- `metricsui-certificate-secret`: The name of the secret created on the Kubernetes cluster for the metrics UI certificate.

#### Recommended: review and possibly change defaults

Review these values, and update for your deployment:

- `storage..className`: the storage class to use for the data controller data and log files. If you are unsure of the available storage classes in your Kubernetes cluster, you can run the following command: `kubectl get storageclass`. The default is default which assumes there is a storage class that exists and is named default not that there is a storage class that is the default. Note: There are two className settings to be set to the desired storage class - one for data and one for logs.
- `serviceType`: Change the service type to NodePort if you are not using a LoadBalancer.
- Security For Azure Red Hat OpenShift or Red Hat OpenShift Container Platform, replace the security: settings with the following values in the data controller yaml file.

   ```yml
   security:
    allowDumps: false
    allowNodeMetricsCollection: false
    allowPodMetricsCollection: false
   ```

#### Optional

The following settings are optional. 

- `name`: The default name of the data controller is arc, but you can change it if you want.
- `displayName`: Set this to the same value as the name attribute at the top of the file.
- `registry`: The Microsoft Container Registry is the default. If you are pulling the images from the Microsoft Container Registry and pushing them to a private container registry, enter the IP address or DNS name of your registry here.
- `dockerRegistry`: The secret to use to pull the images from a private container registry if required.
- `repository`: The default repository on the Microsoft Container Registry is arcdata. If you are using a private container registry, enter the path the folder/repository containing the Azure Arc-enabled data services container images.
- `imageTag`: The current latest version tag is defaulted in the template, but you can change it if you want to use an older version.
- `logsui-certificate-secret`: The name of the secret created on the Kubernetes cluster for the logs UI certificate.
- `metricsui-certificate-secret`: The name of the secret created on the Kubernetes cluster for the metrics UI certificate.

The following example shows a completed data controller yaml.

:::code language="yaml" source="~/azure_arc_sample/arc_data_services/deploy/yaml/data-controller.yaml":::

Save the edited file on your local computer and run the following command to create the data controller:

```console
kubectl create --namespace arc -f <path to your data controller file>

#Example
kubectl create --namespace arc -f data-controller.yaml
```

### Monitoring the creation status

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

## Next steps

You have several additional options for creating the Azure Arc data controller:

> **Just want to try things out?**
> Get started quickly with [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_data/) on AKS, Amazon EKS, or GKE, or in an Azure VM.
>

- [Create a data controller in direct connectivity mode with the Azure portal](create-data-controller-direct-prerequisites.md)
- [Create a data controller in indirect connectivity mode with CLI](create-data-controller-indirect-cli.md)
- [Create a data controller in indirect connectivity mode with Azure Data Studio](create-data-controller-indirect-azure-data-studio.md)
- [Create a data controller in indirect connectivity mode from the Azure portal via a Jupyter notebook in Azure Data Studio](create-data-controller-indirect-azure-portal.md)
- [Create a data controller in indirect connectivity mode with Kubernetes tools such as `kubectl` or `oc`](create-data-controller-using-kubernetes-native-tools.md)
