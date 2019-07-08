---
 title: include file
 description: include file
 services: iot-accelerators
 author: dominicbetts
 ms.service: iot-accelerators
 ms.topic: include
 ms.date: 08/16/2018
 ms.author: dobett
 ms.custom: include file
---

## Access the virtual machine

The following steps use the Azure CLI in Azure Cloud Shell. If you prefer, you can [Install the Azure CLI](/cli/azure/install-azure-cli) on your development machine and run the commands locally.

The following steps show you how to configure the Azure virtual machine to allow **SSH** access. The steps shown assume the name you chose for the solution accelerator is **contoso-simulation** -- replace this value with the name of your deployment:

1. List the contents of the resource group that contains the solution accelerator resources:

    ```azurecli-interactive
    az resource list -g contoso-simulation -o table
    ```

    Make a note of the name of the virtual machine, the public IP address, and network security group - you need these values later.

1. Update the network security group to allow SSH access. The following command assumes the name of the network security group is **contoso-simulation-nsg** -- replace this value with the name of your network security group:

    ```azurecli-interactive
    az network nsg rule update --name SSH --nsg-name contoso-simulation-nsg -g contoso-simulation --access Allow -o table
    ```

    Only enable SSH access during test and development. If you enable SSH, [you should disable it again as soon as possible](https://docs.microsoft.com/azure/security/azure-security-network-security-best-practices#disable-rdpssh-access-to-virtual-machines).

1. Update the password for the **azureuser** account on the virtual machine to a password you know. Choose your own password when you run the following command:

    ```azurecli-interactive
    az vm user update --name vm-vikxv --username azureuser --password YOURSECRETPASSWORD  -g contoso-simulation
    ```

1. Find the public IP address of your virtual machine. The following command assumes the name of the virtual machine is **vm-vikxv** -- replace this value with the name of the virtual machine you made a note of previously:

    ```azurecli-interactive
    az vm list-ip-addresses --name vm-vikxv -g contoso-simulation -o table
    ```

    Make a note of the public IP address of your virtual machine.
