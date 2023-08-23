---
title: Create and upload an OpenBSD image  
description: Learn how to create and upload a virtual hard disk (VHD) that contains the OpenBSD operating system to create an Azure virtual machine through Azure CLI
author: gbowerman
ms.service: virtual-machines
ms.custom: devx-track-azurecli, devx-track-linux
ms.collection: linux
ms.topic: how-to
ms.date: 05/24/2017
ms.author: guybo
ms.reviewer: mattmcinnes
---
# Create and Upload an OpenBSD disk image to Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

This article shows you how to create and upload a virtual hard disk (VHD) that contains the OpenBSD operating system. After you upload it, you can use it as your own image to create a virtual machine (VM) in Azure through Azure CLI.


## Prerequisites
This article assumes that you have the following items:

* **An Azure subscription** - If you don't have an account, you can create one in just a couple of minutes. If you have an MSDN subscription, see [Monthly Azure credit for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/). Otherwise, learn how to [create a free trial account](https://azure.microsoft.com/pricing/free-trial/).  
* **Azure CLI** - Make sure you have the latest [Azure CLI](/cli/azure/install-azure-cli) installed and logged in to your Azure account with [az login](/cli/azure/reference-index).
* **OpenBSD operating system installed in a .vhd file** - A supported OpenBSD operating system ([6.6 version AMD64](https://ftp.openbsd.org/pub/OpenBSD/7.2/amd64/)) must be installed to a virtual hard disk. Multiple tools exist to create .vhd files. For example, you can use a virtualization solution such as Hyper-V to create the .vhd file and install the operating system. For instructions about how to install and use Hyper-V, see [Install Hyper-V and create a virtual machine](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh846766(v=ws.11)).


## Prepare OpenBSD image for Azure
On the VM where you installed the OpenBSD operating system 6.1, which added Hyper-V support, complete the following procedures:

1. If DHCP is not enabled during installation, enable the service as follows:

    ```sh    
    doas echo dhcp > /etc/hostname.hvn0
    ```

2. Set up a serial console as follows:

    ```sh
    doas echo "stty com0 115200" >> /etc/boot.conf
    doas echo "set tty com0" >> /etc/boot.conf
    ```

3. Configure Package installation as follows:

    ```sh
    doas echo "https://ftp.openbsd.org/pub/OpenBSD" > /etc/installurl
    ```
   
4. By default, the `root` user is disabled on virtual machines in Azure. Users can run commands with elevated privileges by using the `doas` command on OpenBSD VM. Doas is enabled by default. For more information, see [doas.conf](https://man.openbsd.org/doas.conf.5). 

5. Install and configure prerequisites for the Azure Agent as follows:

    ```sh
    doas pkg_add py-setuptools openssl git
    doas ln -sf /usr/local/bin/python2.7 /usr/local/bin/python
    doas ln -sf /usr/local/bin/python2.7-2to3 /usr/local/bin/2to3
    doas ln -sf /usr/local/bin/python2.7-config /usr/local/bin/python-config
    doas ln -sf /usr/local/bin/pydoc2.7  /usr/local/bin/pydoc
    ```

6. The latest release of the Azure agent can always be found on [GitHub](https://github.com/Azure/WALinuxAgent/releases). Install the agent as follows:

    ```sh
    doas git clone https://github.com/Azure/WALinuxAgent 
    doas cd WALinuxAgent
    doas python setup.py install
    doas waagent -register-service
    ```

    > [!IMPORTANT]
    > After you install Azure Agent, it's a good idea to verify that it's running as follows:
    >
    > ```sh
    > doas ps auxw | grep waagent
    > root     79309  0.0  1.5  9184 15356 p1  S      4:11PM    0:00.46 python /usr/local/sbin/waagent -daemon (python2.7)
    > doas cat /var/log/waagent.log
    > ```

7. Deprovision the system to clean it and make it suitable for deprovisioning. The following command also deletes the last provisioned user account and the associated data:

    ```sh
    doas waagent -deprovision+user -force
    ```
> [!NOTE]
> If you are migrating a specific virtual machine and do not wish to create a generalized image, skip the deprovision step.

Now you can shut down your VM.


## Prepare the VHD
The VHDX format is not supported in Azure, only **fixed VHD**. You can convert the disk to fixed VHD format using Hyper-V Manager or the PowerShell [convert-vhd](/powershell/module/hyper-v/convert-vhd) cmdlet. An example is as following.

```powershell
Convert-VHD OpenBSD61.vhdx OpenBSD61.vhd -VHDType Fixed
```

## Create storage resources and upload
First, create a resource group with [az group create](/cli/azure/group). The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli
az group create --name myResourceGroup --location eastus
```

To upload your VHD, create a storage account with [az storage account create](/cli/azure/storage/account). Storage account names must be unique, so provide your own name. The following example creates a storage account named *mystorageaccount*:

```azurecli
az storage account create --resource-group myResourceGroup \
    --name mystorageaccount \
    --location eastus \
    --sku Premium_LRS
```

To control access to the storage account, obtain the storage key with [az storage account keys list](/cli/azure/storage/account/keys) as follows:

```azurecli
STORAGE_KEY=$(az storage account keys list \
    --resource-group myResourceGroup \
    --account-name mystorageaccount \
    --query "[?keyName=='key1']  | [0].value" -o tsv)
```

To logically separate the VHDs you upload, create a container within the storage account with [az storage container create](/cli/azure/storage/container):

```azurecli
az storage container create \
    --name vhds \
    --account-name mystorageaccount \
    --account-key ${STORAGE_KEY}
```

Finally, upload your VHD with [az storage blob upload](/cli/azure/storage/blob) as follows:

```azurecli
az storage blob upload \
    --container-name vhds \
    --file ./OpenBSD61.vhd \
    --name OpenBSD61.vhd \
    --account-name mystorageaccount \
    --account-key ${STORAGE_KEY}
```


## Create VM from your VHD
You can create a VM with a [sample script](/previous-versions/azure/virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm-vhd) or directly with [az vm create](/cli/azure/vm). To specify the OpenBSD VHD you uploaded, use the `--image` parameter as follows:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myOpenBSD61 \
    --image "https://mystorageaccount.blob.core.windows.net/vhds/OpenBSD61.vhd" \
    --os-type linux \
    --admin-username azureuser \
    --ssh-key-value ~/.ssh/id_rsa.pub
```

Obtain the IP address for your OpenBSD VM with [az vm list-ip-addresses](/cli/azure/vm) as follows:

```azurecli
az vm list-ip-addresses --resource-group myResourceGroup --name myOpenBSD61
```

Now you can SSH to your OpenBSD VM as normal:
        
```bash
ssh azureuser@<ip address>
```


## Next steps
If you want to know more about Hyper-V support on OpenBSD6.1, read [OpenBSD 6.1](https://www.openbsd.org/61.html) and [hyperv.4](https://man.openbsd.org/hyperv.4).

If you want to create a VM from managed disk, read [az disk](/cli/azure/disk).
