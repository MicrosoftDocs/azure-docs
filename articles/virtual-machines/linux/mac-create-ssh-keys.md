---
title: Create and use an SSH key pair for Linux VMs in Azure 
description: How to create and use an SSH public-private key pair for Linux VMs in Azure to improve the security of the authentication process.
author: mattmcinnes
ms.service: virtual-machines
ms.collection: linux
ms.workload: infrastructure-services
ms.custom: devx-track-linux
ms.topic: how-to
ms.date: 04/11/2023
ms.author: mattmcinnes
ms.reviewer: jamesser
---

# Quick steps: Create and use an SSH public-private key pair for Linux VMs in Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

With a secure shell (SSH) key pair, you can create virtual machines (VMs) in Azure that use SSH keys for authentication. This article shows you how to quickly generate and use an SSH public-private key file pair for Linux VMs. You can complete these steps with the Azure Cloud Shell, a macOS, or a Linux host. 

For help with troubleshooting issues with SSH, see [Troubleshoot SSH connections to an Azure Linux VM that fails, errors out, or is refused](/troubleshoot/azure/virtual-machines/troubleshoot-ssh-connection).

> [!NOTE]
> VMs created using SSH keys are by default configured with passwords disabled, which greatly increases the difficulty of brute-force guessing attacks. 

For more background and examples, see [Detailed steps to create SSH key pairs](create-ssh-keys-detailed.md).

For additional ways to generate and use SSH keys on a Windows computer, see [How to use SSH keys with Windows on Azure](ssh-from-windows.md).

[!INCLUDE [virtual-machines-common-ssh-support](../../../includes/virtual-machines-common-ssh-support.md)]

## Create an SSH key pair

Use the `ssh-keygen` command to generate SSH public and private key files. By default, these files are created in the ~/.ssh directory. You can specify a different location, and an optional password (*passphrase*) to access the private key file. If an SSH key pair with the same name exists in the given location, those files are overwritten.

The following command creates an SSH key pair using RSA encryption and a bit length of 4096:

```bash
ssh-keygen -m PEM -t rsa -b 4096
```

> [!NOTE]
> You can also create key pairs with the [Azure CLI](/cli/azure) with the [az sshkey create](/cli/azure/sshkey#az-sshkey-create) command, as described in [Generate and store SSH keys](../ssh-keys-azure-cli.md).

If you use the [Azure CLI](/cli/azure) to create your VM with the [az vm create](/cli/azure/vm#az-vm-create) command, you can optionally generate SSH public and private key files using the `--generate-ssh-keys` option. The key files are stored in the ~/.ssh directory unless specified otherwise with the `--ssh-dest-key-path` option. If an ssh key pair already exists and the  `--generate-ssh-keys` option is used, a new key pair won't be generated but instead the existing key pair will be used. In the following command, replace *VMname*, *RGname* and *UbuntuLTS* with your own values:

```azurecli-interactive
az vm create --name VMname --resource-group RGname --image UbuntuLTS --generate-ssh-keys 
```

## Provide an SSH public key when deploying a VM

To create a Linux VM that uses SSH keys for authentication, specify your SSH public key when creating the VM using the Azure portal, Azure CLI, Azure Resource Manager templates, or other methods:

* [Create a Linux virtual machine with the Azure portal](quick-create-portal.md)
* [Create a Linux virtual machine with the Azure CLI](quick-create-cli.md)
* [Create a Linux VM using an Azure template](create-ssh-secured-vm-from-template.md)

If you're not familiar with the format of an SSH public key, you can display your public key with the following `cat` command, replacing `~/.ssh/id_rsa.pub` with the path and filename of your own public key file if needed:

```bash
cat ~/.ssh/id_rsa.pub
```

A typical public key value looks like this example:

```output
ssh-rsa AAAAB3NzaC1yc2EAABADAQABAAACAQC1/KanayNr+Q7ogR5mKnGpKWRBQU7F3Jjhn7utdf7Z2iUFykaYx+MInSnT3XdnBRS8KhC0IP8ptbngIaNOWd6zM8hB6UrcRTlTpwk/SuGMw1Vb40xlEFphBkVEUgBolOoANIEXriAMvlDMZsgvnMFiQ12tD/u14cxy1WNEMAftey/vX3Fgp2vEq4zHXEliY/sFZLJUJzcRUI0MOfHXAuCjg/qyqqbIuTDFyfg8k0JTtyGFEMQhbXKcuP2yGx1uw0ice62LRzr8w0mszftXyMik1PnshRXbmE2xgINYg5xo/ra3mq2imwtOKJpfdtFoMiKhJmSNHBSkK7vFTeYgg0v2cQ2+vL38lcIFX4Oh+QCzvNF/AXoDVlQtVtSqfQxRVG79Zqio5p12gHFktlfV7reCBvVIhyxc2LlYUkrq4DHzkxNY5c9OGSHXSle9YsO3F1J5ip18f6gPq4xFmo6dVoJodZm9N0YMKCkZ4k1qJDESsJBk2ujDPmQQeMjJX3FnDXYYB182ZCGQzXfzlPDC29cWVgDZEXNHuYrOLmJTmYtLZ4WkdUhLLlt5XsdoKWqlWpbegyYtGZgeZNRtOOdN6ybOPJqmYFd2qRtb4sYPniGJDOGhx4VodXAjT09omhQJpE6wlZbRWDvKC55R2d/CSPHJscEiuudb+1SG2uA/oik/WQ== username@domainname
```

If you copy and paste the contents of the public key file to use in the Azure portal or a Resource Manager template, make sure you don't copy any trailing whitespace. To copy a public key in macOS, you can pipe the public key file to `pbcopy`. Similarly in Linux, you can pipe the public key file to programs such as `xclip`.

The public key that you place on your Linux VM in Azure is by default stored in ~/.ssh/id_rsa.pub, unless you specified a different location when you created the key pair. To use the [Azure CLI 2.0](/cli/azure) to create your VM with an existing public key, specify the value and optionally the location of this public key using the [az vm create](/cli/azure/vm#az-vm-create) command with the `--ssh-key-values` option. In the following command, replace *myVM*, *myResourceGroup*, *UbuntuLTS*, *azureuser*, and *mysshkey.pub* with your own values:

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image UbuntuLTS \
  --admin-username azureuser \
  --ssh-key-values mysshkey.pub
```

If you want to use multiple SSH keys with your VM, you can enter them in a space-separated list, like this `--ssh-key-values sshkey-desktop.pub, sshkey-laptop.pub`.

## SSH into your VM

With the public key deployed on your Azure VM, and the private key on your local system, SSH into your VM using the IP address or DNS name of your VM. In the following command, replace *azureuser* and *myvm.westus.cloudapp.azure.com* with the administrator user name and the fully qualified domain name (or IP address):

```bash
ssh azureuser@myvm.westus.cloudapp.azure.com
```

If you're connecting to this VM for the first time, you'll be asked to verify the host's fingerprint. It's tempting to accept the fingerprint that's presented, but that approach exposes you to a possible person-in-the-middle attack. You should always validate the host's fingerprint. You need to do this only the first time you connect from a client. To obtain the host fingerprint via the portal, use the Run Command feature to execute the command `ssh-keygen -lf /etc/ssh/ssh_host_ecdsa_key.pub | awk '{print $2}'`.

:::image type="content" source="media/ssh-from-windows/run-command-validate-host-fingerprint.png" alt-text="Screenshot showing using the Run Command to validate the host fingerprint.":::

To run the command using CLI, use [`az vm run-command invoke`](/cli/azure/vm/run-command).

If you specified a passphrase when you created your key pair, enter that passphrase when prompted during the sign-in process. The VM is added to your ~/.ssh/known_hosts file, and you won't be asked to connect again until either the public key on your Azure VM changes or the server name is removed from ~/.ssh/known_hosts.

If the VM is using the just-in-time access policy, you need to request access before you can connect to the VM. For more information about the just-in-time policy, see [Manage virtual machine access using the just in time policy](../../security-center/security-center-just-in-time.md).

## Next steps

* For more information on working with SSH key pairs, see [Detailed steps to create and manage SSH key pairs](create-ssh-keys-detailed.md).

* If you have difficulties with SSH connections to Azure VMs, see [Troubleshoot SSH connections to an Azure Linux VM](/troubleshoot/azure/virtual-machines/troubleshoot-ssh-connection).
