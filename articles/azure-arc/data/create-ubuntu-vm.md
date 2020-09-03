---
title: Create Ubuntu VM in Azure - Azure Arc
description: Create an Ubuntu VM - Azure Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Create an Ubuntu virtual machine in Azure

## Pre-requisites

You will either need to [download/install the Azure CLI](/cli/azure/install-azure-cli) or [Install the client tools](install-client-tools.md) to complete the steps below.

## Log in to Azure & set subscription

```console
az login
az account set --subscription <nameorIDOfYourSubscription>
```

You may also need to complete the sign-in with a browser to open this page https://microsoft.com/devicelogin and paste in a code that is returned to you by the `az login` command.

## Create an Azure resource group

Use the following command to create a resource group in Azure:

```console
az group create -n <ResourceGroupName> -l <Local>
```

Once created, your console returns the following output:

```json
{
  "id": "/subscriptions/<subscriptionID/resourceGroups/<ResourceGroupName>",
  "location": "<Locale>",
  "managedBy": null,
  "name": "<ResourceGroupName>",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

## Create an Ubuntu 18.04 Server virtual machine in Azure

Create an Ubuntu 18.04 Server virtual machine in Azure using the following command:

```console
az vm create -n <AzureVMName> -g <ResourceGroupName> -l <Locale> --image UbuntuLTS --os-disk-size-gb 200 --storage-sku Premium_LRS --admin-username <AdminAccount> --admin-password <SecurePassword> --size Standard_D8s_v3 --public-ip-address-allocation static
```

| Parameter       | Definition                             | Notes                                                |
| --------------- | -------------------------------------- | ---------------------------------------------------- |
| -n              | name of vm                             |                                                      |
| -g              | name of resource group                 |                                                      |
| -l              | target Azure region for the deployment |                                                      |
| image           | VM image type to be deployed           | UbuntuLTS - image name for Ubuntu 18.04 Server       |
| os-disk-size-gb | Size in GiB of the OS disk             | 200 GiB provides capacity for images and databases   |
| storage-sku     | type of storage                        | Highly recommended to use Premium_LRS                |
| admin-username  | username for admin account             |                                                      |
| admin-password  | password for admin account             | Must meet Azure password complexity requirements     |
| size            | CPU, Memory and #Data Disks            | Standard_D8s_v3 = 8 vCPU, 32 GiB RAM, 32 Data Disks  |
| public-ip-address-allocation | static or dynamic IP allocation | Setting static avoids IP changes on VM restart |

Once complete you will see the public IP address that has been allocated during the VM creation.

```json
{
  "fqdns": "",
  "id": "/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/virtualMachines/<AzureVMName>",
  "location": "<Locale>",
  "macAddress": "00-0D-3A-F7-BF-99",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "52.175.208.216",
  "resourceGroup": "<ResourceGroupName>",
  "zones": ""
}
```

## Verify connectivity

SSH to the VM to verify that you can connect and that port 22 is open.  Use a tool like [PuTTY](https://www.putty.org/) if you are on Windows to create an SSH terminal session to the VM.

```console
ssh <AdminAccount>@52.175.208.216 -y
```

The first time you connect you will need to confirm the connection. You will then need to provide the password you created above.

```console
ssh <AdminAccount>@52.175.208.216 -y
The authenticity of host '52.175.208.216 (52.175.208.216)' can't be established.
ECDSA key fingerprint is SHA256:C+tL3EnZS6mNgehHlztZnwdEPIqmYL0Ki27FCRdplgE.
Are you sure you want to continue connecting (yes/no)? yes
<AdminAccount>@52.175.208.216's password: 
<AdminAccount>@52.175.208.216's password: 
Welcome to Ubuntu 18.04.3 LTS (GNU/Linux 5.0.0-1027-azure x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Tue Dec 10 19:56:32 UTC 2019

  System load:  0.07               Processes:           180
  Usage of /:   0.6% of 193.66GB   Users logged in:     0
  Memory usage: 1%                 IP address for eth0: 10.0.0.4
  Swap usage:   0%

0 packages can be updated.
0 updates are security updates.

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.
```

## Next Steps

- [Run the script to install the Azure Arc data controller](kickstarter-install.md)
