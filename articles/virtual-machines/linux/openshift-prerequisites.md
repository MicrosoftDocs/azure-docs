---
title: OpenShift in Azure prerequisites | Microsoft Docs
description: Prerequisites to deploy OpenShift in Azure.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: haroldw
manager: najoshi
editor: 
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 
ms.author: haroldw
---

# Common prerequisites for deploying OpenShift in Azure

This article describes common prerequisites for deploying OpenShift Origin or OpenShift Container Platform in Azure.

The installation of OpenShift uses Ansible playbooks. Ansible uses Secure Shell (SSH) to connect to all cluster hosts to complete installation steps.

When you initiate the SSH connection to the remote hosts, you cannot enter a password. For this reason, the private key cannot have a password associated with it or deployment fails.

Because the virtual machines (VMs) deploy via Azure Resource Manager templates, the same public key is used for access to all VMs. You need to inject the corresponding private key into the VM that executes all the playbooks as well. To do this securely, you use an Azure key vault to pass the private key into the VM.

If there's a need for persistent storage for containers, then persistent volumes are required. OpenShift supports Azure virtual hard disks (VHDs) for this capability, but Azure must first be configured as the cloud provider. 

In this model, OpenShift:

- Creates a VHD object in an Azure Storage account.
- Mounts the VHD to a VM and format the volume.
- Mounts the volume to the pod.

For this configuration to work, OpenShift needs permissions to perform the previous tasks in Azure. You achieve this with a service principal. The service principal is a security account in Azure Active Directory that is granted permissions to resources.

The service principal needs to have access to the storage accounts and VMs that make up the cluster. If all OpenShift cluster resources deploy to a single resource group, the service principal can be granted permissions to that resource group.

This guide describes how to create the artifacts associated with the prerequisites.

> [!div class="checklist"]
> * Create a key vault to manage SSH keys for the OpenShift cluster.
> * Create a service principal for use by the Azure Cloud Solution Provider.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure 
Sign in to your Azure subscription with the [az login](/cli/azure/reference-index#az_login) command and follow the on-screen directions, or click **Try it** to use Cloud Shell.

```azurecli 
az login
```
## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. You use a dedicated resource group to host the key vault. This group is separate from the resource group into which the OpenShift cluster resources deploy. 

The following example creates a resource group named *keyvaultrg* in the *eastus* location:

```azurecli 
az group create --name keyvaultrg --location eastus
```

## Create a key vault
Create a key vault to store the SSH keys for the cluster with the [az keyvault create](/cli/azure/keyvault#az_keyvault_create) command. The key vault name must be globally unique.

The following example creates a key vault named *keyvault* in the *keyvaultrg* resource group:

```azurecli 
az keyvault create --resource-group keyvaultrg --name keyvault \
       --enabled-for-template-deployment true \
       --location eastus
```

## Create an SSH key 
An SSH key is needed to secure access to the OpenShift Origin cluster. Create an SSH key pair by using the `ssh-keygen` command (on Linux or macOS):
 
 ```bash
ssh-keygen -f ~/.ssh/openshift_rsa -t rsa -N ''
```

> [!NOTE]
> Your SSH key pair cannot have a password.

For more information on SSH keys on Windows, see [How to create SSH keys on Windows](/azure/virtual-machines/linux/ssh-from-windows).

## Store the SSH private key in Azure Key Vault
The OpenShift deployment uses the SSH key you created to secure access to the OpenShift master. To enable the deployment to securely retrieve the SSH key, store the key in Key Vault by using the following command:

```azurecli
az keyvault secret set --vault-name keyvault --name keysecret --file ~/.ssh/openshift_rsa
```

## Create a service principal 
OpenShift communicates with Azure by using a username and password or a service principal. An Azure service principal is a security identity that you can use with apps, services, and automation tools like OpenShift. You control and define the permissions as to which operations the service principal can perform in Azure. To improve security beyond just providing a username and password, this example creates a basic service principal.

Create a service principal with [az ad sp create-for-rbac](/cli/azure/ad/sp#az_ad_sp_create_for_rbac) and output the credentials that OpenShift needs.

The following example creates a service principal and assigns it contributor permissions to a resource group named myResourceGroup. If you're using Windows, execute ```az group show --name myResourceGroup --query id```
separately and use the output to feed the --scopes option.

```azurecli
az ad sp create-for-rbac --name openshiftsp \
          --role Contributor --password {Strong Password} \
          --scopes $(az group show --name myResourceGroup --query id)
```

Take note of the appId property returned from the command:
```json
{
  "appId": "11111111-abcd-1234-efgh-111111111111",            
  "displayName": "openshiftsp",
  "name": "http://openshiftsp",
  "password": {Strong Password},
  "tenant": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
}
```
 > [!WARNING] 
 > Be sure to create a secure password. Follow the
 > [Azure AD password rules and restrictions](/azure/active-directory/active-directory-passwords-policy) guidance.

For more information on service principals, see [Create an Azure service principal with Azure CLI](https://docs.microsoft.com/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest).

## Next steps

This article covered the following topics:
> [!div class="checklist"]
> * Create a key vault to manage SSH keys for the OpenShift cluster.
> * Create a service principal for use by the Azure Cloud Solution Provider.

Next, deploy an OpenShift cluster:

- [Deploy OpenShift Origin](./openshift-origin.md)
- [Deploy OpenShift Container Platform](./openshift-container-platform.md)

