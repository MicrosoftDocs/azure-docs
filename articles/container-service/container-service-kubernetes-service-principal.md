---
title: Service principal for Azure Kubernetes cluster | Microsoft Docs
description: Create and manage an Azure Active Directory service principal for a Kubernetes cluster in Azure Container Service
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
ms.date: 04/24/2017
ms.author: danlep

---

# Set up an Azure Active Directory service principal for a Kubernetes cluster in Container Service



In Azure Container Service, Kubernetes requires an [Azure Active Directory service principal](../active-directory/active-directory-application-objects.md) as a service account to interact with Azure APIs. The service principal is needed to dynamically manage
resources such as
user-defined routes
and the Layer 4 Azure Load Balancer.

This article shows different options to set up a service principal for your Kubernetes cluster. For example, if you installed and set up the [Azure CLI 2.0](/cli/azure/install-az-cli2), you can run the [`az acs create`](/cli/azure/acs#create) command to create the Kubernetes cluster and the service principal at the same time.



## Requirements for the service principal

Following are requirements for the Azure Active Directory service principal in a Kubernetes cluster in Azure Container Service. You can use an existing service principal that meets the requirements, or create a new one.

* **Scope**: the resource group in the subscription used to deploy the cluster

* **Role**: **Contributor**

* **Client secret**: must be a password. Currently, you can't use a service principal set up for certificate authentication.

> 
> [!IMPORTANT] To create a service principal in your subscription, you must have permissions to register an application with your Azure AD tenant, and to assign the application to a role in your Azure subscription. To see if you have the required permissions, [check in the Portal](../azure-resource-manager/resource-group-create-service-principal-portal.md#required-permissions). If you don't have these permissions, ask your Azure AD or subscription administrator to assign the necessary permissions, or request a service principal for use with Azure Container Service. 
>

## Option 1: Create a service principal in Azure AD

If you want to create an Azure AD service principal before you deploy your Kubernetes cluster, Azure provides several methods. 

The following example commands show you how to do this with the [Azure CLI 2.0](../azure-resource-manager/resource-group-authenticate-service-principal-cli). You can alternatively create a service principal using [Azure PowerShell](../azure-resource-manager/resource-group-authenticate-service-principal.md) or other methods.

> [!IMPORTANT]
> Make sure you review the requirements for the service principal earlier in this article. If you don't have the required Azure AD and subscription permissions to create a service principal, ask your Azure AD or subscription administrator to assign the necessary permissions, or request a service principal for use with Azure Container Service.   
>

```azurecli
az login

az account set --subscription "mySubscriptionID"

az group create -n "myResourceGroupName" -l "westus"

az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/mySubscriptionID/resourceGroups/myResourceGroupName"
```

Output is similar to the following (shown here redacted):

![Create a service principal](./media/container-service-kubernetes-service-principal/service-principal-creds.png)

Highlighted are the **client ID** (`appId`) and the **client secret** (`password`) that you use as service principal parameters for cluster deployment.


To confirm your service principal, open a new shell and run the following commands, substituting in `appId`, `password`, and `tenant`:

```azurecli 
az login --service-principal -u yourClientID -p yourClientSecret --tenant yourTenant

az vm list-sizes --location westus
```
 
### Specify the service principal when creating the Kubernetes cluster

Provide the **client ID** (also called the `appId`, for Application ID) and **client secret** (`password`) of an existing service principal as parameters when you create the Kubernetes cluster. If you are using an existing service principal, make sure it meets the requirements at the beginning this article.

You can specify these parameters when deploying the Kubernetes cluster using the [Azure Command-Line Interface (CLI) 2.0](container-service-kubernetes-walkthrough.md), [Azure portal](./container-service-deployment.md), or other methods.

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


## Option 2: Generate the service principal when creating the cluster with the Azure CLI 2.0

If you installed and set up the [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-az-cli2), you can run the [`az acs create`](https://docs.microsoft.com/en-us/cli/azure/acs#create) command to [create the cluster](./container-service-create-acs-cluster-cli.md).

As with other Kubernetes cluster creation options, you can specify parameters for an existing service principal when you run `az acs create`. However, when you omit these parameters, the Azure CLI creates one automatically for use with Container Service. This takes place transparently during the deployment. 

> [!IMPORTANT]
> To generate a service principal when you run `az acs create`, you must have permissions to register an application with your Azure AD tenant, and to assign the application to a role in your Azure subscription (see the requirements earlier in this article). If your account doesn't have permissions, the command generates an error similar to `Insufficient privileges to complete the operation.`
> 

The following command creates a Kubernetes cluster and generates both SSH keys and service principal credentials:

```console
az acs create -n myClusterName -d myDNSPrefix -g myResourceGroup --generate-ssh-keys --orchestrator-type kubernetes
```



## Additional considerations


* Every service principal is associated with an Azure AD application. The service principal for a Kubernetes cluster can be associated with any valid Azure AD application name (for example: `https://www.contoso.org/example`).

* When specifying the service principal **Client ID**, you can use the value of the `appId` (as shown in this article) or the corresponding service principal `name` (for example,`https://www.contoso.org/example`).


* On the master and node VMs in the Kubernetes cluster, the service principal credentials are stored in the file /etc/kubernetes/azure.json.

* When you use the `az acs create` command to generate the service principal automatically, the service principal credentials are written to the file ~/.azure/acsServicePrincipal.json on the machine used to run the command. 

* When you use the `az acs create` command to generate the service principal automatically, the service principal can also authenticate with an [Azure container registry](../container-registry/container-registry-intro.md) created in the same subscription.

## Troubleshooting

If the service principal for your Kubernetes cluster isn't configured properly, you can't run commands on the cluster such as `kubectl get nodes` and `kubectl proxy`. 

To check whether the service principal is configured properly, SSH to the master node of the cluster. After making the connection, run the following command:

```bash
sudo journalctl -u kubelet | grep --text autorest
```

Output similar to the following, including `400 Bad Request`, typically indicates a problem with the service principal:

```bash
Nov 10 16:35:22 k8s-master-43D6F832-0 docker[3177]: E1110 16:35:22.840688 3201 kubelet_node_status.go:69] Unable to construct api.Node object for kubelet: failed to get external ID from cloud provider: autorest#WithErrorUnlessStatusCode: POST https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token?api-version=1.0 failed with 400 Bad Request: StatusCode=400
```

Check that the service principal credentials were provided accurately when you created the cluster, and confirm that the service principal has both read and write permissions to the target subscription. Then, redeploy the cluster.


## Next steps

* [Get started with Kubernetes](container-service-kubernetes-walkthrough.md) in your container service cluster.
