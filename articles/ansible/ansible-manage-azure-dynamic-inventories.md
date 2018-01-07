---
title: Use Ansible manage your Azure dynamic inventories
description: Learn how to Use Ansible manage your Azure dynamic inventories
ms.service: ansible
keywords: ansible, azure, devops, bash, cloudshell, dynamic inventory
author: tomarcher
manager: routlaw
ms.author: tarcher
ms.date: 01/06/2018
ms.topic: article
---

# Use Ansible manage your Azure dynamic inventories
Ansible can be used to pull inventory information from various sources (including cloud sources such as Azure) into a *dynamic inventory*. In this article, you use the [Azure Cloud Shell](./ansible-run-playbook-in-cloudshell.md) to configure an Ansible Azure Dynamic Inventory in which you create two virtual machines. One of those virtual machines will be tagged and have Nginx installed.

## Prerequisites

- **Azure subscription** - To learn about Azure purchase options, see [How to buy Azure](https://azure.microsoft.com/pricing/purchase-options/) or [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Create 

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Open Cloud Shell. If this is the first time you're using Cloud Shell, refer to the article [Use Ansible in the Azure Cloud Shell](./ansible-run-playbook-in-cloudshell.md#configure-cloud-shell) to open and configure your Cloud Shell environment.

1. Create an Azure resource group that will contain the virtual machines used in this tutorial.

    ```azurecli-interactive
    az group create --resource-group ansible-inventory-test-rg --location eastus
    ```

1. Create two Linux virtual machines on Azure using one of the following techniques:

    - **Ansible playbook** - The article, [Create a basic virtual machine in Azure with Ansible](https://review.docs.microsoft.com/en-us/azure/virtual-machines/linux/ansible-create-vm?branch=pr-en-us-30287) illustrates how to create a virtual machine from an Ansible playbook. If you use a playbook to define one or both of the virtual machines, ensure that the SSH connection is used instead of a password.

    - **Azure CLI** - Issue each of the following commands in the Cloud Shell to create the two virtual machines:

        ```azurecli-interactive
        az vm create --resource-group ansible-inventory-test-rg --name ansible-inventory-test-vm1 --image UbuntuLTS --generate-ssh-keys
        ```

        ```azurecli-interactive
        az vm create --resource-group ansible-inventory-test-rg --name ansible-inventory-test-vm2 --image UbuntuLTS --generate-ssh-keys
        ```

1.  Tag one of the virtual machines. 
Below are examples. More refer to https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags#azure-cli. 
az resource tag --tags hello=tag --id /subscriptions/<your subscription id>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM
If you don’t know your subscription ID, you could run
az account list

Then you will get something like
  {
    "cloudName": "AzureCloud",
    "id": "76907309-9f00-4b15-xxxx-xxxxx",
    "isDefault": true,
    "name": " PM",
    "state": "Enabled",
………..
    }

3.	Download Inventory Script.
wget https://raw.githubusercontent.com/ansible/ansible/devel/contrib/inventory/azure_rm.py
chmod +x azure_rm.py
Let us have a quick test. Execute /bin/uname on all instances in the “myresourcegroup” resource group:
ansible -i azure_rm.py myresourcegroup -m ping 
You will see output from all instances in the “myresourgroup” resource group. 
The authenticity of host '52.224.179.16 (52.224.179.16)' can't be established.
ECDSA key fingerprint is SHA256:RU2rM+dQsj5oUHr2Yt3q7JsLE1KjBYRFhl4awJqraqI.
Are you sure you want to continue connecting (yes/no)? yes
myVM | SUCCESS => {
    "changed": false,
    "failed": false,
    "ping": "pong"
}
myVM2 | SUCCESS => {
    "changed": false,
    "failed": false,
    "ping": "pong"
}
4.	Enable tag 

export AZURE_TAGS=hello:tag
Let us run the quick test again. This time execute /bin/uname on tagged instance:
ansible -i azure_rm.py myresourcegroup -m ping 

You will see output from tagged instance:
myVM | SUCCESS => {
    "changed": false,
    "failed": false,
    "ping": "pong"
}
And you also could use the inventory script to print instance specific information. 
python azure_rm.py --tags hello:tag –pretty

You will get below information as follows:

{
  "_meta": {
    "hostvars": {
      "myVM": {
        "ansible_host": "52.224.178.251",
        "computer_name": "myVM",
        "fqdn": null,
        "id": "/subscriptions/70e47246-282b-4a50-a3bb-bab25036156e/resourceGroups/MYRESOURCEGROUP/                                                                              providers/Microsoft.Compute/virtualMachines/myVM",
        "image": {
          "offer": "UbuntuServer",
          "publisher": "Canonical",
          "sku": "16.04-LTS",
          "version": "latest"
        },
  ……


5.	Set up Nginx on tagged instance
Below is a playbook of nginx.yml for Ubuntu platform. 
---
- name: install and start nginx on azure vm
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

Now let us start to use the inventory script with above ansible playbook to install Nginx on tagged VM. 
ansible-playbook -i azure_rm.py nginx.yml

Then you will get output as follows:
PLAY [install and start nginx on azure vm] ********************************************************************************************

TASK [Gathering Facts] ****************************************************************************************************************
ok: [myVM]

TASK [install nginx] ******************************************************************************************************************
changed: [myVM]

RUNNING HANDLER [start nginx] *********************************************************************************************************
ok: [myVM]

PLAY RECAP ****************************************************************************************************************************
myVM                       : ok=3    changed=1    unreachable=0    failed=0

You could check status with inventory script. 
ansible -i azure_rm.py -m shell -a "service nginx status"

Then you will get output as follows:
myVM | SUCCESS | rc=0 >>
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Tue 2017-12-26 07:02:07 UTC; 35s ago
 Main PID: 23068 (nginx)
   CGroup: /system.slice/nginx.service
           ├─23068 nginx: master process /usr/sbin/nginx -g daemon on; master_process on
           └─23070 nginx: worker process

Dec 26 07:02:07 myVM systemd[1]: Starting A high performance web server and a reverse proxy server...
Dec 26 07:02:07 myVM systemd[1]: nginx.service: Failed to read PID from file /run/nginx.pid: Invalid argument
Dec 26 07:02:07 myVM systemd[1]: Started A high performance web server and a reverse proxy server.

## Next steps
