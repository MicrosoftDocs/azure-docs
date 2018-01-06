---
title: Run Ansible playbook in CloudShell
description: Run Ansible playbook in CloudShell
ms.service: ansible
keywords: ansible, azure, devops, bash, cloudshell
author: tomarcher
manager: routlaw
ms.author: tarcher
ms.date: 01/06/2018
ms.topic: quickstart
---

# Run Ansible playbook in CloudShell

In this quickstart, you learn how to run an Ansible playbook in the Azure Cloud Shell.

## Prerequisites

- **Azure subscription** - To learn about Azure purchase options, see [How to buy Azure](https://azure.microsoft.com/pricing/purchase-options/) or [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/).

- **Azure virtual machine** - You need to connect to an Azure virtual machine to complete this QuickStart. If you do not have an Azure virtual machine, refer to the article, [Create a complete Linux virtual machine environment in Azure with Ansible](/azure/virtual-machines/linux/ansible-create-complete-vm).

## Configure Cloud Shell

If you have never used Cloud Shell, the following steps will guide you through setting it up the first time you use it:

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select the Cloud Shell icon from the top navigation of the Azure portal.

  ![Select the Cloud Shell icon to run Bash commands against Azure from your favorite browser.](./media/ansible-run-playbook-in-cloudshell/cloud-shell-icon.png)

1. Select the **Bash** option.

  ![Cloud Shell supports both Bash or PowerShell.](./media/ansible-run-playbook-in-cloudshell/cloud-shell-first-time-select-env.png)

1. Select a subscription to create a storage account and Microsoft Azure Files share, and select **Create Storage**.

  ![Cloud Shell requires an Azure file share to persist files.](./media/ansible-run-playbook-in-cloudshell/cloud-shell-first-time-create-storage.png)

1. You should now see results similar to the following:

  ![Once Cloud Shell has started, you can enter commands for your chosen environment.](./media/ansible-run-playbook-in-cloudshell/cloud-shell-first-time-started.png)

## Ansible authentication in Azure and specifying the active Azure subscription
By default, Ansible is installed in the Bash environment of Cloud Shell. As using Azure Resource Manager modules requires authenticating with the Azure API, Cloud Shell automatically authenticates your default Azure subscription to deploy resources through the Ansible Azure modules. 

If you want to change the subscription being used when you run Ansible commands in Cloud Shell, the following steps illustrate how to:

- Determine the default Azure subscription
- Show all of your Azure subscriptions
- Change the current active Azure subscription

1. Enter the following command into the Cloud Shell to display the active Azure subscription:

  ```cli
  az account show
  ```

1. Enter the following command into the Cloud Shell to display all of your Azure subscriptions (in a table format):

  ```cli
  az account list --output table
  ```

1. Using either the subscription name or the subscription ID, enter the following command into the Cloud Shell to set the active Azure subscription:

  ```cli
  az account set --subscription "<YourAzureSubscriptionId>"
  ```

## Use Ansible to connect to your Azure virtual machine
Ansible has created a Python script called [azure_rm.py](https://github.com/ansible/ansible/blob/devel/contrib/inventory/azure_rm.py) that generates a dynamic inventory of your Azure resources by making API requests to the Azure Resource Manager. The following steps walk you through using the `azure_rm.py` script to connect to an Azure virtual machine:

1. Open the Azure Cloud Shell.

1. Use the GNU `wget` command to retrieve the `azure_rm.py` script by typing the following into the Cloud Shell prompt:

  ```cli
  wget https://raw.githubusercontent.com/ansible/ansible/devel/contrib/inventory/azure_rm.py
  ```

1. Use the `chmod` command to change the access permissions to the `azure_rm.py` script. The following uses the `+x` parameter to allow for execution (running) of the specified file (`azure_rm.py`):

  ```cli
  chmod +x azure_rm.py
  ```

1. Use the [ansible command](https://docs.ansible.com/ansible/2.4/ansible.html) to ping your virtual machine - to ensure that it can be contacted - by entering the following command into the Cloud Shell: 

  ```cli
  ansible -i azure_rm.py &lt;YourVMName> -m ping
  ```






The output is as following. 
The authenticity of host '52.168.52.51 (52.168.52.51)' can't be established.
ECDSA key fingerprint is SHA256:8694cdz+AX2IVa4zmjD6RuKlL6m8qt6v0QvIzVaDnJ8.
Are you sure you want to continue connecting (yes/no)? yes
myfirstVM | SUCCESS => {
    "changed": false,
    "failed": false,
    "ping": "pong"
}

The other example is as following. 
ansible -i azure_rm.py myfirstVM -m shell -a 'hostname'

## Run Ansible playbook in CloudShell
Create a Resource Group
Below is an example of an Ansible Playbook to create a resource group. You could run below command to create a rg.yml and copy below example to rg.yml. 
azcliinteractive Copy 
vi rg.yml
- name: My first Ansible Playbook
  hosts: localhost
  connection: local
  tasks:
  - name: Create a resource group
    azure_rm_resourcegroup:
        name: demoresourcegroup
        location: eastus

Run above playbook through the command ansible-playbook as following.
azcliinteractive Copy 
ansible-playbook rg.yml

 The output is as following. 
PLAY [My first Ansible Playbook] *************************************************************************************************

TASK [Gathering Facts] ***********************************************************************************************************
ok: [localhost]

TASK [Create a resource group] ***************************************************************************************************
changed: [localhost]

PLAY RECAP ***********************************************************************************************************************
localhost                  : ok=2    changed=1    unreachable=0    failed=0
Verify deployment with Azure CLI 2.0
Run below command to verify the resource has succeeded provisioning. 
azcliinteractive Copy 
az group show -n demoresourcegroup

Delete the resource group
Let us use a playbook to delete created resource group. You could run below command to create a rg2.yml and copy below example to rg2.yml. 
azcliinteractive Copy 
vi rg2.yml

- name: My second Ansible Playbook
  hosts: localhost
  connection: local
  tasks:
  - name: Delete a resource group
    azure_rm_resourcegroup:
        name: demoresourcegroup
        state: absent

Run above playbook through the command ansible-playbook as following.
azcliinteractive Copy 
ansible-playbook rg2.yml

The output is as following. 
PLAY [My second Ansible Playbook] **************************************************************************************************************************

TASK [Gathering Facts] *************************************************************************************************************************************
ok: [localhost]

TASK [Delete a resource group] *****************************************************************************************************************************
changed: [localhost]

PLAY RECAP *************************************************************************************************************************************************
localhost                  : ok=2    changed=1    unreachable=0    failed=0


## Next steps
