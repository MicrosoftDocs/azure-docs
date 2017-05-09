---
title: Service principal for Azure Kubernetes cluster | Microsoft Docs
description: Create and manage an Azure Active Directory service principal in an Azure Container Service cluster with Kubernetes
services: container-service
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: acs, azure-container-service, kubernetes
keywords: ''

ms.assetid: 
ms.service: container-service
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/21/2017
ms.author: danlep

---

# About the Azure Active Directory service principal for a Kubernetes cluster in Azure Container Service



In Azure Container Service, Kubernetes requires an [Azure Active Directory service principal](../active-directory/active-directory-application-objects.md) as a service account to interact with Azure APIs. The service principal is needed to dynamically manage
resources such as
[user-defined routes](../virtual-network/virtual-networks-udr-overview.md)
and the [Layer 4 Azure Load Balancer](../load-balancer/load-balancer-overview.md).

This article shows different options to specify a service principal for your Kubernetes cluster. For example, if you installed and set up the [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-az-cli2), you can run the [`az acs create`](https://docs.microsoft.com/en-us/cli/azure/acs#create) command to create the Kubernetes cluster and the service principal at the same time.



## Requirements for the service principal

Following are requirements for the Azure Active Directory service principal in a Kubernetes cluster in Azure Container Service. 

* **Scope**: the resource group in which the cluster is deployed

* **Role**: **Contributor**

* **Client secret**: must be a password. Currently, you can't use a service principal set up for certificate authentication.

> [!NOTE]
> Every service principal is associated with an Azure Active Directory application. The service principal for a Kubernetes cluster can be associated with any valid Azure Active Directory application name.
> 


## Service principal options for a Kubernetes cluster

### Option 1: Pass the service principal client ID and client secret

Provide the **client ID** (also called the `appId`, for Application ID) and **client secret** (`password`) of an existing service principal as parameters when you create the Kubernetes cluster. If you are using an existing service principal, make sure it meets the requirements in the previous section. If you need to create a service principal, see [Create a service principal](#create-a-service-principal-in-azure-active-directory) later in this article.

You can specify these parameters when [deploying the Kubernetes cluster](./container-service-deployment.md) using the portal, the Azure Command-Line Interface (CLI) 2.0, Azure PowerShell, or other methods.

>[!TIP] 
>When specifying the **client ID**, be sure to use the `appId`, not the `ObjectId`, of the service principal.
>

The following example shows one way to pass the parameters with the Azure CLI 2.0 (see [installation and setup instructions](/cli/azure/install-az-cli2)). This example uses the [Kubernetes quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-acs-kubernetes).

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


### Option 2: Generate the service principal when creating the cluster with the Azure CLI 2.0

If you installed and set up the [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-az-cli2), you can run the [`az acs create`](https://docs.microsoft.com/en-us/cli/azure/acs#create) command to [create the cluster](./container-service-create-acs-cluster-cli.md).

As with other Kubernetes cluster creation options, you can specify parameters for an existing service principal when you run `az acs create`. However, when you omit these parameters, Azure Container Service creates a service principal automatically. This takes place transparently during the deployment. 

The following command creates a Kubernetes cluster and generates both SSH keys and service principal credentials:

```console
az acs create -n myClusterName -d myDNSPrefix -g myResourceGroup --generate-ssh-keys --orchestrator-type kubernetes
```

## Create a service principal in Azure Active Directory

If you want to create a service principal in Azure Active Directory for use in your Kubernetes cluster, Azure provides several methods. 

The following example commands show you how to do this with the [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-az-cli2). You can alternatively create a service principal using [Azure PowerShell](../azure-resource-manager/resource-group-authenticate-service-principal.md), the [classic portal](../azure-resource-manager/resource-group-create-service-principal-portal.md), or other methods.

> [!IMPORTANT]
> Make sure you review the requirements for the service principal earlier in this article.
>

```azurecli
az login

az account set --subscription "mySubscriptionID"

az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/mySubscriptionID"
```

This returns output similar to the following (shown here redacted):

![Create a service principal](./media/container-service-kubernetes-service-principal/service-principal-creds.png)

Highlighted are the **client ID** (`appId`) and the **client secret** (`password`) that you use as service principal parameters for cluster deployment.


Confirm your service principal by opening a new shell and run the following commands, substituting in `appId`, `password`, and `tenant`:

```azurecli 
az login --service-principal -u yourClientID -p yourClientSecret --tenant yourTenant

az vm list-sizes --location westus
```

## Additional considerations


* When specifying the service principal **Client ID**, you can use the value of the `appId` (as shown in this article) or the corresponding service principal `name` (for example,        `https://www.contoso.org/example`).

* If you use the `az acs create` command to generate the service principal automatically, the service principal credentials are written to the file ~/.azure/acsServicePrincipal.json on the machine used to run the command.

* On the master and node VMs in the Kubernetes cluster, the service principal credentials are stored in the file /etc/kubernetes/azure.json.

## Next steps

* [Get started with Kubernetes](container-service-kubernetes-walkthrough.md) in your container service cluster.
