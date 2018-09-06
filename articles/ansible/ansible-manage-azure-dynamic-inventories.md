---
title: Use Ansible to manage your Azure dynamic inventories
description: Learn how to use Ansible to manage your Azure dynamic inventories
ms.service: ansible
keywords: ansible, azure, devops, bash, cloudshell, dynamic inventory
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.date: 08/09/2018
ms.topic: article
---

# Use Ansible to manage your Azure dynamic inventories
Ansible can be used to pull inventory information from various sources (including cloud sources such as Azure) into a *dynamic inventory*. In this article, you use the [Azure Cloud Shell](./ansible-run-playbook-in-cloudshell.md) to configure an Ansible Azure Dynamic Inventory in which you create two virtual machines, tag one of those virtual machines, and install Nginx on the tagged virtual machine.

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

- **Azure credentials** - [Create Azure credentials and configure Ansible](/azure/virtual-machines/linux/ansible-install-configure#create-azure-credentials)

## Create the test virtual machines

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Open [Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview).

1. Create an Azure resource group to hold the virtual machines for this tutorial.

    > [!IMPORTANT]	
    > The Azure resource group you create in this step must have a name that is entirely lower-case. Otherwise, the generation of the dynamic inventory will fail.

    ```azurecli-interactive
    az group create --resource-group ansible-inventory-test-rg --location eastus
    ```

1. Create two Linux virtual machines on Azure using one of the following techniques:

    - **Ansible playbook** - The article, [Create a basic virtual machine in Azure with Ansible](/azure/virtual-machines/linux/ansible-create-vm) illustrates how to create a virtual machine from an Ansible playbook. If you use a playbook to define one or both of the virtual machines, ensure that the SSH connection is used instead of a password.

    - **Azure CLI** - Issue each of the following commands in the Cloud Shell to create the two virtual machines:

        ```azurecli-interactive
        az vm create --resource-group ansible-inventory-test-rg \
                     --name ansible-inventory-test-vm1 \
                     --image UbuntuLTS --generate-ssh-keys
        ```

        ```azurecli-interactive
        az vm create --resource-group ansible-inventory-test-rg \
                     --name ansible-inventory-test-vm2 \
                     --image UbuntuLTS --generate-ssh-keys
        ```

## Tag a virtual machine
You can [use tags to organize your Azure resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags#azure-cli) by user-defined categories. 

Enter the following [az resource tag](/cli/azure/resource?view=azure-cli-latest.md#az-resource-tag) command to tag the virtual machine `ansible-inventory-test-vm1` with the key `nginx`:

```azurecli-interactive
az resource tag --tags nginx --id /subscriptions/<YourAzureSubscriptionID>/resourceGroups/ansible-inventory-test-rg/providers/Microsoft.Compute/virtualMachines/ansible-inventory-test-vm1
```

## Generate a dynamic inventory
Once you have your virtual machines defined (and tagged), it's time to generate the dynamic inventory. Ansible provides a Python script called [azure_rm.py](https://github.com/ansible/ansible/blob/devel/contrib/inventory/azure_rm.py) that generates a dynamic inventory of your Azure resources by making API requests to the Azure Resource Manager. The following steps walk you through using the `azure_rm.py` script to connect to your two test Azure virtual machines:

1. Use the GNU `wget` command to retrieve the `azure_rm.py` script:

    ```azurecli-interactive
    wget https://raw.githubusercontent.com/ansible/ansible/devel/contrib/inventory/azure_rm.py
    ```

1. Use the `chmod` command to change the access permissions to the `azure_rm.py` script. The following command uses the `+x` parameter to allow for execution (running) of the specified file (`azure_rm.py`):

    ```azurecli-interactive
    chmod +x azure_rm.py
    ```

1. Use the [ansible command](https://docs.ansible.com/ansible/2.4/ansible.html) to connect to your resource group: 

    ```azurecli-interactive
    ansible -i azure_rm.py ansible-inventory-test-rg -m ping 
    ```

1. Once connected, you see results similar to the following output:

    ```Output
    ansible-inventory-test-vm1 | SUCCESS => {
        "changed": false,
        "failed": false,
        "ping": "pong"
    }
    ansible-inventory-test-vm2 | SUCCESS => {
        "changed": false,
        "failed": false,
        "ping": "pong"
    }
    ```

## Enable the virtual machine tag
Once you've set the desired tag, you need to "enable" the tag. One way to enable a tag is by exporting the tag to an environment variable called `AZURE_TAGS` via the **export** command:

```azurecli-interactive
export AZURE_TAGS=nginx
```

Once the tag has been exported, you can try the `ansible` command again:

```azurecli-interactive
ansible -i azure_rm.py ansible-inventory-test-rg -m ping 
```

You now see only one virtual machine (the one whose tag matches the value exported into the **AZURE_TAGS** environment variable):

```Output
ansible-inventory-test-vm1 | SUCCESS => {
    "changed": false,
    "failed": false,
    "ping": "pong"
}
```

## Set up Nginx on the tagged VM
The purpose of tags is to enable the ability to quickly and easily work with subgroups of your virtual machines. For example, let's say you want to install Nginx only on virtual machines to which you've assigned a tag of `nginx`. The following steps illustrate how easy that is to accomplish:

1. Create a file (to contain your playbook) named `nginx.yml` as follows:

  ```azurecli-interactive
  vi nginx.yml
  ```

1. Insert the following code into the newly created `nginx.yml` file:

    ```yml
    ---
    - name: Install and start Nginx on an Azure virtual machine
    hosts: azure
    become: yes
    tasks:
    - name: install nginx
      apt: pkg=nginx state=installed
      notify:
      - start nginx

    handlers:
    - name: start nginx
      service: name=nginx state=started
    ```

1. Run the `nginx.yml` playbook:

    ```azurecli-interactive
    ansible-playbook -i azure_rm.py nginx.yml
    ```

1. Once you run the playbook, you see results similar to the following output:

    ```Output
    PLAY [Install and start Nginx on an Azure virtual machine] **********

    TASK [Gathering Facts] **********
    ok: [ansible-inventory-test-vm1]

    TASK [install nginx] **********
    changed: [ansible-inventory-test-vm1]

    RUNNING HANDLER [start nginx] **********
    ok: [ansible-inventory-test-vm1]

    PLAY RECAP **********
    ansible-inventory-test-vm1 : ok=3    changed=1    unreachable=0    failed=0
    ```

## Test Nginx installation
This section illustrates one technique to test that Nginx is installed on your virtual machine.

1. Use the [az vm list-ip-addresses](https://docs.microsoft.com/cli/azure/vm?view=azure-cli-latest#az-vm-list-ip-addresses) command to retrieve the IP address of the `ansible-inventory-test-vm1` virtual machine. The returned value (the virtual machine's IP address) is then used as the parameter to the SSH command to connect to the virtual machine.

    ```azurecli-interactive
    ssh `az vm list-ip-addresses \
    -n ansible-inventory-test-vm1 \
    --query [0].virtualMachine.network.publicIpAddresses[0].ipAddress -o tsv`
    ```

1. While connected to the `ansible-inventory-test-vm1` virtual machine, run the [nginx -v](https://nginx.org/en/docs/switches.html) command to determine if Nginx is installed.

    ```azurecli-interactive
    nginx -v
    ```

1. Once you run the `nginx -v` command, you see the Nginx version (second line) that indicates that Nginx is installed.

    ```Output
    tom@ansible-inventory-test-vm1:~$ nginx -v

    nginx version: nginx/1.10.3 (Ubuntu)
    
    tom@ansible-inventory-test-vm1:~$
    ```

1. Press the **&lt;Ctrl>D** keyboard combination to disconnect the SSH session.

1. Performing the preceding steps for the `ansible-inventory-test-vm2` virtual machine yields an informational message indicating where you can get Nginx (which implies that you don't have it installed at this point):

    ```Output
    tom@ansible-inventory-test-vm2:~$ nginx -v
    The program 'nginx' can be found in the following packages:
    * nginx-core
    * nginx-extras
    * nginx-full
    * nginx-lightTry: sudo apt install <selected package>
    tom@ansible-inventory-test-vm2:~$
    ```

## Next steps
> [!div class="nextstepaction"] 
> [Create a basic virtual machine in Azure with Ansible](/azure/virtual-machines/linux/ansible-create-vm)
