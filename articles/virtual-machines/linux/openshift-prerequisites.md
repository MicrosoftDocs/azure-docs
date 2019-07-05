---
title: OpenShift in Azure prerequisites | Microsoft Docs
description: Prerequisites to deploy OpenShift in Azure.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: haroldwongms
manager: mdotson
editor: 
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 06/14/2019
ms.author: haroldw
---

# Common prerequisites for deploying OpenShift in Azure

This article describes common prerequisites for deploying OpenShift Container Platform or OKD in Azure.

The installation of OpenShift uses Ansible playbooks. Ansible uses Secure Shell (SSH) to connect to all cluster hosts to complete installation steps.

When ansible makes the SSH connection to the remote hosts, it can't enter a password. For this reason, the private key can't have a password (passphrase) associated with it or deployment fails.

Because the virtual machines (VMs) deploy via Azure Resource Manager templates, the same public key is used for access to all VMs. The corresponding private key must be on the VM that executes all the playbooks as well. To perform this action securely, an Azure key vault is used to pass the private key into the VM.

If there's a need for persistent storage for containers, then persistent volumes are required. OpenShift supports Azure virtual hard disks (VHDs) for persistent volumes, but Azure must first be configured as the cloud provider.

In this model, OpenShift:

- Creates a VHD object in an Azure storage account or a managed disk.
- Mounts the VHD to a VM and formats the volume.
- Mounts the volume to the pod.

For this configuration to work, OpenShift needs permissions to perform these tasks in Azure. A service principal is used for this purpose. The service principal is a security account in Azure Active Directory that is granted permissions to resources.

The service principal needs to have access to the storage accounts and VMs that make up the cluster. If all OpenShift cluster resources deploy to a single resource group, the service principal can be granted permissions to that resource group.

This guide describes how to create the artifacts associated with the prerequisites.

> [!div class="checklist"]
> * Create a key vault to manage SSH keys for the OpenShift cluster.
> * Create a service principal for use by the Azure Cloud Provider.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure 
Sign in to your Azure subscription with the [az login](/cli/azure/reference-index) command and follow the on-screen directions, or click **Try it** to use Cloud Shell.

```azurecli 
az login
```
## Create a resource group

Create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. You should use a dedicated resource group to host the key vault. This group is separate from the resource group into which the OpenShift cluster resources deploy.

The following example creates a resource group named *keyvaultrg* in the *eastus* location:

```azurecli 
az group create --name keyvaultrg --location eastus
```

## Create a key vault
Create a key vault to store the SSH keys for the cluster with the [az keyvault create](/cli/azure/keyvault) command. The key vault name must be globally unique and must be enabled for template deployment or the deployment will fail with "KeyVaultParameterReferenceSecretRetrieveFailed" error.

The following example creates a key vault named *keyvault* in the *keyvaultrg* resource group:

```azurecli 
az keyvault create --resource-group keyvaultrg --name keyvault \
       --enabled-for-template-deployment true \
       --location eastus
```

## Create an SSH key 
An SSH key is needed to secure access to the OpenShift cluster. Create an SSH key pair by using the `ssh-keygen` command (on Linux or macOS):
 
 ```bash
ssh-keygen -f ~/.ssh/openshift_rsa -t rsa -N ''
```

> [!NOTE]
> Your SSH key pair can't have a password / passphrase.

For more information on SSH keys on Windows, see [How to create SSH keys on Windows](/azure/virtual-machines/linux/ssh-from-windows). Be sure to export the private key in OpenSSH format.

## Store the SSH private key in Azure Key Vault
The OpenShift deployment uses the SSH key you created to secure access to the OpenShift master. To enable the deployment to securely retrieve the SSH key, store the key in Key Vault by using the following command:

```azurecli
az keyvault secret set --vault-name keyvault --name keysecret --file ~/.ssh/openshift_rsa
```

## Create a service principal 
OpenShift communicates with Azure by using a username and password or a service principal. An Azure service principal is a security identity that you can use with apps, services, and automation tools like OpenShift. You control and define the permissions as to which operations the service principal can perform in Azure. It's best to scope the permissions of the service principal to specific resource groups rather than the entire subscription.

Create a service principal with [az ad sp create-for-rbac](/cli/azure/ad/sp) and output the credentials that OpenShift needs.

The following example creates a service principal and assigns it contributor permissions to a resource group named openshiftrg.

First, create the resource group named openshiftrg:

```azurecli
az group create -l eastus -n openshiftrg
```

Create service principal:

```azurecli
scope=`az group show --name openshiftrg --query id`
az ad sp create-for-rbac --name openshiftsp \
      --role Contributor --password {Strong Password} \
      --scopes $scope
```
If you're using Windows, execute ```az group show --name openshiftrg --query id``` and use the output in place of $scope.

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

## Prerequisites applicable only to Resource Manager template

Secrets will need to be created for the SSH private key (**sshPrivateKey**), Azure AD client secret (**aadClientSecret**), OpenShift admin password (**openshiftPassword**), and Red Hat Subscription Manager password or activation key (**rhsmPasswordOrActivationKey**).  Additionally, if custom SSL certificates are used, then six additional secrets will need to be created - **routingcafile**, **routingcertfile**, **routingkeyfile**, **mastercafile**, **mastercertfile**, and **masterkeyfile**.  These parameters will be explained in more detail.

The template references specific secret names so you **must** use the bolded names listed above (case sensitive).

### Custom Certificates

By default, the template will deploy an OpenShift cluster using self-signed certificates for the OpenShift web console and the routing domain. If you want to use custom SSL certificates, set 'routingCertType' to 'custom' and 'masterCertType' to 'custom'.  You'll need the CA, Cert, and Key files in .pem format for the certificates.  It is possible to use custom certificates for one but not the other.

You'll need to store these files in Key Vault secrets.  Use the same Key Vault as the one used for the private key.  Rather than require 6 additional inputs for the secret names, the template is hard-coded to use specific secret names for each of the SSL certificate files.  Store the certificate data using the information from the following table.

| Secret Name      | Certificate file   |
|------------------|--------------------|
| mastercafile     | master CA file     |
| mastercertfile   | master CERT file   |
| masterkeyfile    | master Key file    |
| routingcafile    | routing CA file    |
| routingcertfile  | routing CERT file  |
| routingkeyfile   | routing Key file   |

Create the secrets using the Azure CLI. Below is an example.

```bash
az keyvault secret set --vault-name KeyVaultName -n mastercafile --file ~/certificates/masterca.pem
```

## Next steps

This article covered the following topics:
> [!div class="checklist"]
> * Create a key vault to manage SSH keys for the OpenShift cluster.
> * Create a service principal for use by the Azure Cloud Solution Provider.

Next, deploy an OpenShift cluster:

- [Deploy OpenShift Container Platform](./openshift-container-platform.md)
- [Deploy OpenShift Container Platform Self-Managed Marketplace Offer](./openshift-marketplace-self-managed.md)