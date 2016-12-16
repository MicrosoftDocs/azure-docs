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
ms.date: 12/16/2016
ms.author: danlep

---

# About the Azure Active Directory service principal for a Kubernetes cluster in Azure Container Service



In Azure Container Service, Kubernetes requires an [Azure Active Directory service principal](../active-directory/active-directory-application-objects.md) as a service account to interact with Azure APIs. The service principal is needed to dynamically manage
resources such as
[user-defined routes](../virtual-network/virtual-networks-udr-overview.md)
and the Layer 4 [Azure Load Balancer](../load-balancer/load-balancer-overview.md).

If you don't have a service principal set up to create a Kubernetes cluster, you can follow the instructions in this article to create one.

## Service principal options for a Kubernetes cluster

When [creating a Kubernetes cluster](./container-service-deployment.md) in Azure Container Service, you have these options to specify an Azure Active Directory service principal:

* Provide the **client ID** and **client secret** (password) of an existing service principal as parameters when you use the [Kubernetes quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/<101-acs-kubernetes></101-acs-kubernetes>) to create the Kubernetes cluster. You can specify these parameters when deploying the Kubernetes cluster using the portal, the Azure Command-Line Interface (CLI), or Azure PowerShell.

    For example,the following command shows how to pass the parameters explicitly with Azure PowerShell:

    ```PowerShell
    $PlainClientID="myClientID"
        
    $SecureClientID = $PlainClientID | ConvertTo-SecureString -AsPlainText -Force
        
    $PlainClientSecret ="myClientSecret"
        
    $SecureClientSecret = $PlainClientSecret | ConvertTo-SecureString -AsPlainText -Force
        
    New-AzureRmResourceGroupDeployment -Name myClusterName -ResourceGroupName myResourceGroup -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-acs-kubernetes/azuredeploy.json" -servicePrincipalClientID $SecureClientID -servicePrincipalClientSecret $SecureClientSecret
    ```



* If you have installed and set up the [Azure CLI 2.0 (Preview)](https://docs.microsoft.com/cli/azure/install-az-cli2), you can run the [`az acs create`](https://docs.microsoft.com/en-us/cli/azure/acs#create) command to create the cluster. If you don't pass the service principal credentials on the command line, Azure Container Service generates the service principal automatically. For example:

    * **Specify the service principal explictly**

        ```Azure CLI 2.0
        az acs create -n myClusterName -d myDNSPrefix -g myResourceGroup --generate-ssh-keys --orchestrator-type kubernetes --client-secret "myClientSecret" --service-principal "myClientID"
        ``` 

    * **Generate the service principal automatically**

        ```Azure CLI 2.0
        az acs create -n myClusterName -d myDNSPrefix -g myResourceGroup --generate-ssh-keys --orchestrator-type kubernetes
        ```


        ``` 
## Create a service principal in Azure Active Directory


There are several ways to create a service principal in Azure Active Directory. The following commands show you how to do this with the [Azure CLI 2.0 (Preview)](https://docs.microsoft.com/cli/azure/install-az-cli2). You can alternatively create a service principal using the [Azure Command-Line Interface](../azure-resource-manager/resource-group-authenticate-service-principal-cli.md), [Azure PowerShell](../azure-resource-manager/resource-group-authenticate-service-principal.md), or the [classic portal](../azure-resource-manager/resource-group-create-service-principal-portal.md).

> [!IMPORTANT]
> For your Kubernetes cluster, make sure to create a service principal with role as **Contributor**.

   ```Azure CLI 2.0
   az login
   az account set --subscription="mySubscriptionID"
   az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/mySubscriptionID"
   ```

This returns output similar to the following (shown here redacted):

![Create a service principal](./media/container-service-kubernetes-service-principal/service-principal-creds.png)

Highlighted are the **client ID** (`appId`) and the **client secret** (`password`) that you need when you specify service principal parameters for cluster deployment.


Confirm your service principal by opening a new shell and run the following commands substituting in `appId`, `password`, and `tenant`:

   ```shell
   az login --service-principal -u yourClientID -p yourClientSecret --tenant yourTenant
   az vm list-sizes --location westus
   ```

## Additional considerations

* Currently for Kubernetes in a container service cluster, the client secret for a service principal must be a password. You can't use a certificate.

* When specifying the service principal **Client ID**, you can use either the `appId` (as shown in this article) or the service principal `name`.

* If you use the `az acs create` command to generate the service principal automatically, the service principal credentials are written to the file ~/.azure/acsServicePrincipal.json on the machine used to run the command.

* On the master and node VMs in the Kubernetes cluster, the service principal credentials are stored in the file /etc/kubernetes/azure.json.
