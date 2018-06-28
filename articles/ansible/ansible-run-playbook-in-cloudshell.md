---
title: Run Ansible with Bash in Azure Cloud Shell
description: Learn how to perform various Ansible tasks with Bash in Azure Cloud Shell
ms.service: ansible
keywords: ansible, azure, devops, bash, cloudshell, playbook, bash
author: tomarcher
manager: routlaw
ms.author: tarcher
ms.date: 02/01/2018
ms.topic: article
---

# Run Ansible with Bash in Azure Cloud Shell

In this tutorial, you learn how to perform various Ansible tasks from Bash in Cloud Shell. These tasks include connecting to a virtual machine, and creating Ansible playbooks to create and delete an Azure resource group.

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

- **Configure Azure Cloud Shell** - If you are new to Azure Cloud Shell, the article [Quickstart for Bash in Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/quickstart) illustrates how to start and configure Cloud Shell. Launch a dedicated website for Cloud Shell here:

[![Launch Cloud Shell](https://shell.azure.com/images/launchcloudshell.png "Launch Cloud Shell")](https://shell.azure.com)

## Automatic credential configuration
Ansible authenticates with Azure when logged in to the Cloud Shell to manage infrastructure without any additional configuration. If you have more than one subscriptions, you can choose which subscription Ansible should work with by export `AZURE_SUBSCRIPTION_ID` environment variable. To list all subscriptions, run:

```azurecli-interactive
az account list
```
Note the `id` of the subscription you want to work, and then set `AZURE_SUBSCRIPTION_ID`:

```azurecli-interactive
export AZURE_SUBSCRIPTION_ID=<your-subscription-id>
```

## Use Ansible to connect to a VM
Ansible has created a Python script called [azure_rm.py](https://github.com/ansible/ansible/blob/devel/contrib/inventory/azure_rm.py) that generates a dynamic inventory of your Azure resources by making API requests to the Azure Resource Manager. The following steps walk you through using the `azure_rm.py` script to connect to an Azure virtual machine:

1. Open Bash in Cloud Shell. Shell type is denoted on the left side of the Cloud Shell window.

1. Use the GNU `wget` command to retrieve the `azure_rm.py` script:

   ```azurecli-interactive
   wget https://raw.githubusercontent.com/ansible/ansible/devel/contrib/inventory/azure_rm.py
   ```

1. Use the `chmod` command to change the access permissions to the `azure_rm.py` script. The following command uses the `+x` parameter to allow for execution (running) of the specified file (`azure_rm.py`):

   ```azurecli-interactive
   chmod +x azure_rm.py
   ```

1.  Use the [ansible command](https://docs.ansible.com/ansible/latest/cli/ansible.html) `-i` to specify dynamic inventory file `azure_rm.py`, and list all virtual machine hosts in your subscription.

   ```azurecli-interactive
   ansible -i azure_rm.py all --list-hosts
   ```

1. Connect to one of your virtual machines with ansible ping module: 

  ```azurecli-interactive
  ansible -i azure_rm.py <vm-host-name> -m ping
  ```

  Once connected, you should see results similar success output or Permission denied (publickey) error:

  ```Output
  The authenticity of host 'nn.nnn.nn.nn (nn.nnn.nn.nn)' can't be established.
  ECDSA key fingerprint is SHA256:&lt;some value>.
  Are you sure you want to continue connecting (yes/no)? yes
  <vm-host-name> | SUCCESS => {
      "changed": false,
      "failed": false,
      "ping": "pong"
  }
  ```

## Run a playbook in Cloud Shell
The [ansible-playbook](https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html) command executes Ansible playbooks, running the tasks on the targeted host(s). 
This section walks you through using the Cloud Shell to create and execute two playbooks - one to create a resource group, and a second to delete the resource group. 

1. Create a file named `rg.yml` as follows:

  ```azurecli-interactive
  vi rg.yml
  ```

1. Type keyboard `i` to enter insert mode. Copy the following contents into the Cloud Shell window (now hosting an instance of the VI editor):

   ```yml
   - name: My first Ansible Playbook
     hosts: localhost
     connection: local
     tasks:
     - name: Create a resource group
       azure_rm_resourcegroup:
         name: demoresourcegroup
         location: eastus
   ```

1. Save the file, and exit the VI editor by entering `:wq` and pressing &lt;Enter>.

1. Use the `ansible-playbook` command to run the `rg.yml` playbook:

   ```azurecli-interactive
   ansible-playbook rg.yml
   ```

1. You should see results similar to the following output:

   ```Output
   PLAY [My first Ansible Playbook] **********
 
   TASK [Gathering Facts] **********
   ok: [localhost] 

   TASK [Create a resource group] **********
   changed: [localhost]

   PLAY RECAP **********
   localhost : ok=2 changed=1 unreachable=0 failed=0
   ```

1. Verify the deployment with the facts module. Now create a second Ansible playbook to retrieve resource group information:

   ```azurecli-interactive
   vi rg2.yml
   ```

1. Copy the following contents into the Cloud Shell window (now hosting an instance of the VI editor):

   ```yml
   - name: My second Ansible Playbook
     hosts: localhost
     connection: local
     tasks:
     - name: Retrieve a resource group
       azure_rm_resourcegroup_facts:
         name: demoresourcegroup
   ```

1. Save the file, and exit the VI editor by entering `:wq` and pressing &lt;Enter>.

1. Use the `ansible-playbook` command to run the `rg2.yml` playbook with verbose mode:

   ```azurecli-interactive
   ansible-playbook rg2.yml -vvv
   ```

1. You should see results similar to the following output:

   ```Output
   The output is as following. 
   PLAY [My second Ansible Playbook] **********

   TASK [Gathering Facts] **********
   ok: [localhost]

   TASK [Retrieve a resource group] **********
   ok: [localhost] => {
       "ansible_facts": {
           "azure_resourcegroups": [
              {
                  "id": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/demoresourcegroup",
                  "location": "eastus",
                  "name": "demoresourcegroup",
                  "properties": {
                      "provisioningState": "Succeeded"
                  }
              }
          ]
       },
       "changed": false,
       "invocation": {
           "module_args": {
               "name": "demoresourcegroup",
           }
       }
   }

   PLAY RECAP **********
   localhost : ok=2 changed=1 unreachable=0 failed=0
   ```

1. Now that you've created the resource group, create a third Ansible playbook to delete the resource group:

   ```azurecli-interactive
   vi rg3.yml
   ```

1. Copy the following contents into the Cloud Shell window (now hosting an instance of the VI editor):

   ```yml
   - name: My second Ansible Playbook
     hosts: localhost
     connection: local
     tasks:
     - name: Delete a resource group
       azure_rm_resourcegroup:
         name: demoresourcegroup
         state: absent
   ```

1. Save the file, and exit the VI editor by entering `:wq` and pressing &lt;Enter>.

1. Use the `ansible-playbook` command to run the `rg3.yml` playbook:

   ```azurecli-interactive
   ansible-playbook rg3.yml
   ```

1. You should see results similar to the following output:

   ```Output
   The output is as following. 
   PLAY [My second Ansible Playbook] **********

   TASK [Gathering Facts] **********
   ok: [localhost]

   TASK [Delete a resource group] **********
   changed: [localhost]

   PLAY RECAP **********
   localhost : ok=2 changed=1 unreachable=0 failed=0
   ```

## Next steps

> [!div class="nextstepaction"] 
> [Create a basic virtual machine in Azure with Ansible](/azure/virtual-machines/linux/ansible-create-vm)
