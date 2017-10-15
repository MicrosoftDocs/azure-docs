---
title: Service principal for Azure Kubernetes cluster | Microsoft Docs
description: Create and manage an Azure Active Directory service principal for a Kubernetes cluster in Azure Container Service
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: acs, azure-container-service, kubernetes
keywords: ''

ms.service: container-service
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/26/2017
ms.author: nepeters
ms.custom: mvc

---

# Set up an Azure AD service principal for an AKS cluster

An AKS cluster requires an [Azure Active Directory service principal](../active-directory/develop/active-directory-application-objects.md) to interact with Azure APIs. The service principal is needed to dynamically manage esources such as [user-defined routes](../virtual-network/virtual-networks-udr-overview.md) and the [Layer 4 Azure Load Balancer](../load-balancer/load-balancer-overview.md).

This article shows different options for setting up a service principal for your AKS cluster.

## Before you begin

The steps detailed in this document assume that you have created an AKS Kubernetes cluster and have established a kubectl connection with the cluster. If you need these items see, the [AKS Kubernetes quickstart](./kubernetes-walkthrough.md).

You also need the Azure CLI version 2.0.4 or later installed and configured. Run az --version to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).


## Exsisting service principal

You can use an existing service principal that meets the following requirements:

**Scope**: the subscription used to deploy the cluster.
**Role**: **Contributor**
**Client secret**: must be a password. Currently, you can't use a service principal set up for certificate authentication.

## Create SP with AKS cluster

To create a service principal, you must have permissions to register an application with your Azure AD tenant, and to assign the application to a role in your subscription.

When deploying an AKS cluster with the `az aks create` command, you have the option to generate a service principal automatically.

As with other Kubernetes cluster creation options, you can specify parameters for an existing service principal when you run `az aks create`. However, when you omit these parameters, the Azure CLI creates one automatically for use with Container Service. This takes place transparently during the deployment.

The following command creates a Kubernetes cluster and generates both SSH keys and service principal credentials:

```console
az aks create -n myClusterName -d myDNSPrefix -g myResourceGroup --generate-ssh-keys
```

## Manually create the SP

If you want to create an Azure AD service principal before you deploy your Kubernetes cluster, Azure provides several methods.

```azurecli
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/mySubscriptionID"
```

Output is similar to the following:

```console
<sp output>
```

### Specify service principal when creating the Kubernetes cluster

Provide the **client ID** (also called the `appId`, for Application ID) and **client secret** (`password`) of an existing service principal as parameters when you create the Kubernetes cluster. Make sure the service principal meets the requirements at the beginning this article.

You can specify these parameters when deploying the Kubernetes cluster using the [Azure Command-Line Interface (CLI) 2.0](./kubernetes-walkthrough.md).

>[!TIP]
>When specifying the **client ID**, be sure to use the `appId`, not the `ObjectId`, of the service principal.
>

The following example shows one way to pass the parameters with the Azure CLI 2.0. This example uses the [Kubernetes quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-acs-kubernetes).

1. [Download](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-acs-kubernetes/azuredeploy.parameters.json) the template parameters file `azuredeploy.parameters.json` from GitHub.

2. To specify the service principal, enter values for `servicePrincipalClientId` and `servicePrincipalClientSecret` in the file. (You also need to provide your own values for `dnsNamePrefix` and `sshRSAPublicKey`. The latter is the SSH public key to access the cluster.) Save the file.

    ![Pass service principal parameters](./media/container-service-kubernetes-service-principal/service-principal-params.png)

3. Run the following command, using `--parameters` to set the path to the azuredeploy.parameters.json file. This command deploys the cluster in a resource group you create called `myResourceGroup` in the West US region.

    ```azurecli
    az login

    az account set --subscription "mySubscriptionID"

    az group create --name "myResourceGroup" --location "westus"

    az group deployment create -g "myResourceGroup" --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-acs-kubernetes/azuredeploy.json" --parameters @azuredeploy.parameters.json
    ```

## Additional considerations

* If you don't have permissions to create a service principal in your subscription, you might need to ask your Azure AD or subscription administrator to assign the necessary permissions, or ask them for a service principal to use with Azure Container Service.

* The service principal for Kubernetes is a part of the cluster configuration. However, don't use the identity to deploy the cluster.

* Every service principal is associated with an Azure AD application. The service principal for a Kubernetes cluster can be associated with any valid Azure AD application name (for example: `https://www.contoso.org/example`). The URL for the application doesn't have to be a real endpoint.

* When specifying the service principal **Client ID**, you can use the value of the `appId` (as shown in this article) or the corresponding service principal `name` (for example,`https://www.contoso.org/example`).

* On the master and agent VMs in the Kubernetes cluster, the service principal credentials are stored in the file /etc/kubernetes/azure.json.

* When you use the `az aks create` command to generate the service principal automatically, the service principal credentials are written to the file ~/.azure/acsServicePrincipal.json on the machine used to run the command.

* When you use the `az aks create` command to generate the service principal automatically, the service principal can also authenticate with an [Azure container registry](../container-registry/container-registry-intro.md) created in the same subscription.

## Next steps

* [Get started with Kubernetes](./kubernetes-walkthrough.md) in your container service cluster.

* To troubleshoot the service principal for Kubernetes, see the [ACS Engine documentation](https://github.com/Azure/acs-engine/blob/master/docs/kubernetes.md#troubleshooting).