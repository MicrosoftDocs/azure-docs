---
title: Deploy OpenShift Origin to Azure| Microsoft Docs
description: Learn to deploy OpenShift Origin to Azure virtual machines.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: jbinder
manager: timlt 
editor: 
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 
ms.author: jbinder 
---

# Deploy OpenShift Origin to Azure Virtual Machines 

[OpenShift Origin](https://www.openshift.org/) is an open source container platform built on [Kubernetes](https://kubernetes.io/). It simplifies the process of deploying, scaling, and operating multi-tenant applications. 

This guide describes how to deploy OpenShift Origin on Azure Virtual Machines using the Azure CLI and Azure Resource Manager Templates. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create a KeyVault to manage SSH keys for the OpenShift cluster.
> * Deploy an OpenShift cluster on Azure VMs. 
> * Install and configure the [OpenShift CLI](https://docs.openshift.org/latest/cli_reference/index.html#cli-reference-index) to manage the cluster.
> * Customize the OpenShift deployment.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This quick start requires the Azure CLI version 2.0.8 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Log in to Azure 
Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions or click **Try it** to use Cloud Shell.

```azurecli 
az login
```
## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli 
az group create --name myResourceGroup --location eastus
```

## Create a Key Vault
Create a KeyVault to store the SSH keys for the cluster with the [az keyvault create](/cli/azure/keyvault#create) command.  

```azurecli 
az keyvault create --resource-group myResourceGroup --name myKeyVault \
       --enabled-for-template-deployment true \
       --location eastus
```

## Create an SSH key 
An SSH key is needed to secure access to the OpenShift Origin cluster. Create an SSH key-pair using the `ssh-keygen` command. 
 
 ```bash
ssh-keygen -f ~/.ssh/openshift_rsa -t rsa -N ''
```

> [!NOTE]
> The SSH key pair you create must not have a passphrase.

For more information on SSH keys on Windows, [How to create SSH keys on Windows](/azure/virtual-machines/linux/ssh-from-windows).

## Store SSH private key in Key Vault
The OpenShift deployment uses the SSH key you created to secure access to the OpenShift master. To enable the deployment to securely retrieve the SSH key, store the key in Key Vault using the following command.

# Enabled for template deployment
```azurecli
az keyvault secret set --vault-name KeyVaultName --name OpenShiftKey --file ~/.ssh/openshift.rsa
```

## Create a service principal 
OpenShift communicates with Azure using a username and password or a service principal. An Azure service principal is a security identity that you can use with apps, services, and automation tools like OpenShift. You control and define the permissions as to what operations the service principal can perform in Azure. To improve security over just providing a username and password, this example creates a basic service principal.

Create a service principal with [az ad sp create-for-rbac](/cli/azure/ad/sp#create-for-rbac) and output the credentials that OpenShift needs:

```azurecli
az ad sp create-for-rbac --name openshiftsp \
          --role Contributor --password {strong password} \
          --scopes $(az group show --name myResourceGroup --query id)
```
Take note of the appId property returned from the command.
```json
{
  "appId": "a487e0c1-82af-47d9-9a0b-af184eb87646d",
  "displayName": "openshiftsp",
  "name": "http://openshiftsp",
  "password": {strong password},
  "tenant": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
}
```
 > [!WARNING] 
 > Don't create an insecure password.  Follow the
 > [Azure AD password rules and restrictions](/azure/active-directory/active-directory-passwords-policy) guidance.

For more information on service principals, see [Create an Azure service principal with Azure CLI 2.0](/cli/azure/create-an-azure-service-principal-azure-cli)

## Deploy the OpenShift Origin template
Next deploy OpenShift Origin using an Azure Resource Manager template. 

> [!NOTE] 
> The following command requires az CLI 2.0.8 or later. You can verify the az CLI version with the `az --version` command. To update the CLI version, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

Use the `appId` value from the service principal you created earlier for the `aadClientId` parameter.

```azurecli 
az group deployment create --name myOpenShiftCluster \
      --template-uri https://raw.githubusercontent.com/Microsoft/openshift-origin/master/azuredeploy.json \
      --params \ 
        openshiftMasterPublicIpDnsLabel=myopenshiftmaster \
        infraLbPublicIpDnsLabel=myopenshiftlb \
        openshiftPassword=Pass@word!
        sshPublicKey=~/.ssh/openshift_rsa.pub \
        keyVaultResourceGroup=myResourceGroup \
        keyVaultName=myKeyVault \
        keyVaultSecret=OpenShiftKey \
        aadClientId={appId} \
        aadClientSecret={strong password} 
```
The deployment may take up to 20 minutes to complete. The URL of the OpenShift console and DNS name of the OpenShift master is printed to the terminal when the deployment completes.

```json
{
  "OpenShift Console Uri": "http://openshiftlb.cloudapp.azure.com:8443/console",
  "OpenShift Master SSH": "ocpadmin@myopenshiftmaster.cloudapp.azure.com"
}
```
## Connect to the OpenShift cluster
When the deployment completes, connect to the OpenShift console using the browser using the `OpenShift Console Uri`. Alternatively, you can connect to the OpenShift master using the following command.

```bash
$ ssh ocpadmin@myopenshiftmaster.cloudapp.azure.com
```

## Clean up resources
When no longer needed, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group, OpenShift cluster, and all related resources.

```azurecli 
az group delete --name myResourceGroup
```

## Next steps

In this tutorial, learned how to:
> [!div class="checklist"]
> * Create a KeyVault to manage SSH keys for the OpenShift cluster.
> * Deploy an OpenShift cluster on Azure VMs. 
> * Install and configure the [OpenShift CLI](https://docs.openshift.org/latest/cli_reference/index.html#cli-reference-index) to manage the cluster.

Now that OpenShift Origin cluster is deployed. You can follow OpenShift tutorials to learn how to deploy your first application and use the OpenShift tools. See [Getting Started with OpenShift Origin](https://docs.openshift.org/latest/getting_started/index.html) to get started. 
