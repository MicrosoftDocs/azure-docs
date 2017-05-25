---
title: Use Ansible to create a Linux VM in Azure | Microsoft Docs
description: Learn how to use Ansible to create and manage Linux virtual machines in Azure
services: virtual-machines-linux
documentationcenter: virtual-machines
author: iainfoulds
manager: timlt
editor: na
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/23/2017
ms.author: iainfou
---

## Create supporting Azure resources

Create resource group:

```azurecli
az group create --name myResourceGroup --location eastus
```

Create a virtual network:

```azurecli
az network vnet create \
  --resource-group myResourceGroup \
  --name myVnet \
  --address-prefix 10.0.0.0/16 \
  --subnet-name mySubnetFrontEnd \
  --subnet-prefix 10.0.1.0/24
```


## Create Azure credentials
Ansible can communicate with Azure using either a username and password or a service principal. An Azure service principal is a security identity that you can then use with apps, services, and automation tools like Ansible. You can control and define the permissions as to what operations the service principal can perform in Azure. To improve security over just providing a username and password, this example creates a basic service principal.

Create a service principal with [az ad sp create-for-rbac](/cli/azure/ad/sp#create-for-rbac) and output the credentials that Ansible needs:

```azurecli
az ad sp create-for-rbac --query [appId,password,tenant]
```

As example of the output from the preceeding commands is as follows:

```json
[
  "eec5624a-90f8-4386-8a87-02730b5410d5",
  "531dcffa-3aff-4488-99bb-4816c395ea3f",
  "72f988bf-86f1-41af-91ab-2d7cd011db47"
]
```

To authenticate to Azure, you also need to obtain your Azure subscription ID with [az account show](/cli/azure/account#show):

```azurecli
az account show --query [id] --output tsv
```


## Create Ansible credentials file
To provide credentials to Ansible, you can define environment variables or create a local credentials file. If you use tools such as Ansible Tower or Jenkins, defining environment variables is more secure and flexible. For more information about how to define Ansible credentials, see [Providing Credentials to Azure Modules](https://docs.ansible.com/ansible/guide_azure.html#providing-credentials-to-azure-modules). 

To simplify usage in a development environment, this example creates a *credentials* file for Ansible as follows:

```bash
mkdir ~/.azure
vi ~/.azure/credentials
```

The *credentials* file itself combines the subscription ID with the output from creating a service principal. The output from the previous [az ad sp create-for-rbac](/cli/azure/ad/sp#create-for-rbac) command is the same order as needed for *client_id*, *secret*, and *tenant*.The following example *credentials* file shows these values matching the previous output:

```bash
[default]
subscription_id=xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
client_id=66cf7166-dd13-40f9-bca2-3e9a43f2b3a4
secret=b8326643-f7e9-48fb-b0d5-952b68ab3def
tenant=72f988bf-86f1-41af-91ab-2d7cd011db47
```


## Create and run Ansible playbook



Create an Ansible playbook named **azure_create_vm.yml**:

```yaml
- name: Create Azure VM
  hosts: localhost
  connection: local
  tasks:
  - name: Create VM
    azure_rm_virtualmachine:
      resource_group: myResourceGroup
      name: myVM
      vm_size: Standard_DS1_v2
      admin_username: azureuser
      ssh_password_enabled: false
      ssh_public_keys: 
        - path: /home/azureuser/.ssh/authorized_keys
          key_data: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCvLE/HrsE8eak8kamEQc8bilmC6qwc14fNvMrYoqmW/aUq1t7iGk6PnVzbhEuJhin4T9sHRHgHk8prmzR83iu3JoRHi98uzLssyWduYerNYd70HvNElJttniarfWZnzQ20mxHiOCyJtXwfMBt0SPzebq5Qi3GpxO+k5gqnaw5DjNTw7jLQlie6FgLEZ/wXSmEfWL22EMwyqC45sEE1uUJaYH/0Lc7NXyEhqyS2/aE3g8ozW9y94oWJreWHWOcNJCDy7nzYpAiHtoaSwbc7aG0stTDUL4aiF2CEj4wUjbNa8MCE8Py2i4E2ZFb9nLGXltgF1MAdH0UMSGC3XhwhqT9h"
      image:
        offer: CentOS
        publisher: OpenLogic
        sku: '7.3'
        version: latest
```

Run the Ansible playbook:

```bash
ansible-playbook azure_create_vm.yml
```