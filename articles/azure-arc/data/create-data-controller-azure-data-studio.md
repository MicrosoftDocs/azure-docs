---
title: Create data controller in Azure Data Studio
description: Create data controller in Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Create data controller in Azure Data Studio

You can create a data controller using Azure Data Studio through the deployment wizard and notebooks.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Prerequisites

- You need access to a Kubernetes cluster and have your kubeconfig file configured to point to the Kubernetes cluster you want to deploy to.
- You need to [install the client tools](install-client-tools.md) including **Azure Data Studio** the Azure Data Studio extensions called **Azure Arc** and **[!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)]**.
- You need to log in to Azure in Azure Data Studio.  To do this: type CTRL/Command + SHIFT + P to open the command text window and type **Azure**.  Choose **Azure: Sign in**.   In the panel, that comes up click the + icon in the top right to add an Azure account.

## Use the Deployment Wizard to create Azure Arc data controller

Follow these steps to create an Azure Arc data controller using the Deployment wizard.

1. In Azure Data Studio, click on the Connections tab on the left navigation.
2. Click on the **...** button at the top of the Connections panel and choose **New Deployment...**
3. In the new Deployment wizard, choose **Azure Arc Data Controller**, check the license acceptance checkbox, and then click the **Select** button at the bottom.
4. Use the default kubeconfig file or select another one.  Click **Next**.
5. Choose a Kubernetes cluster context. Click **Next**.
6. Choose a deployment configuration profile file depending on your target Kubernetes cluster. **Click Next**.
8. Choose the desired subscription and resource group.
9. Enter a name for the data controller and for the namespace that the data controller will be created in.  

> [!NOTE]
> If the namespace already exists it will be used if the namespace does not already contain other Kubernetes objects - pods, etc.  If the namespace does not exist, an attempt to create the namespace will be made.  Creating a namespace in a Kubernetes cluster requires Kubernetes cluster administrator privileges.  If you don't have Kubernetes cluster administrator privileges, ask your Kubernetes cluster administrator to perform the first few steps in the [Create a data controller using Kubernetes-native tools](./create-data-controller-using-kubernetes-native-tools.md) article which are required to be performed by a Kubernetes administrator before you complete this wizard.

> [!NOTE]
> Note: the data controller and namespace name will be used to create a custom resource in the Kubernetes cluster so they must conform to [Kubernetes naming conventions](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names).

10. Select an Azure location.
   
> [!NOTE]
> The Azure location selected here is the location in Azure where the *metadata* about the data controller and the database instances that it manages will be stored.  The data controller and database instances will be actually crewted in your Kubernetes cluster wherever that may be.

11.  Enter a username and password and confirm the password for the data controller administrator user account.

> [!NOTE]
> The password must be at least 8 characters long.

1.  Click **Next**.
2.  Review and click **Script to Notebook**.
3.  **Review the generated notebook**.  Make any changes necessary such as storage class names or service types.
4.  Click **Run All** at the top of the notebook.

## Monitoring the creation status

Creating the controller will take a few minutes to complete. You can monitor the progress in another terminal window with the following commands:

> [!NOTE]
>  The example commands below assume that you created a data controller and Kubernetes namespace with the name 'arc'.  If you used a different namespace/data controller name, you can replace 'arc' with your name.

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

## Troubleshooting creation problems

If you encounter any troubles with creation, please see the [troubleshooting guide](troubleshoot-guide.md).
