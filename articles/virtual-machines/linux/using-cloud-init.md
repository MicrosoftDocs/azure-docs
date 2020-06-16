---
title: Overview of cloud-init support for Linux VMs in Azure 
description: Overview of cloud-init capabilities to configure a VM at provisioning time in Azure.
services: virtual-machines-linux
documentationcenter: ''
author: danielsollondon
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.assetid: 195c22cd-4629-4582-9ee3-9749493f1d72
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 06/15/2019
ms.author: danis

---
# cloud-init support for virtual machines in Azure
This article explains the support that exists for [cloud-init](https://cloudinit.readthedocs.io) to configure a virtual machine (VM) or virtual machine scale sets at provisioning time in Azure. These cloud-init configurations are run on first boot once the resources have been provisioned by Azure.  

VM Provisioning is the process where the Azure will pass down your VM Create parameter values, such as hostname, username, password etc., and make them available to the VM as it boots up. A 'provisioning agent' will consume those values, configure the VM, and report back when completed. 

Azure supports two provisioning agents [cloud-init](https://cloudinit.readthedocs.io), and the [Azure Linux Agent (WALA)](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-linux).

## cloud-init overview
[cloud-init](https://cloudinit.readthedocs.io) is a widely used approach to customize a Linux VM as it boots for the first time. You can use cloud-init to install packages and write files, or to configure users and security. Because cloud-init is called during the initial boot process, there are no additional steps or required agents to apply your configuration.  For more information on how to properly format your `#cloud-config` files or other inputs, see the [cloud-init documentation site](https://cloudinit.readthedocs.io/en/latest/topics/format.html#cloud-config-data).  `#cloud-config` files are text files encoded in base64.

cloud-init also works across distributions. For example, you don't use **apt-get install** or **yum install** to install a package. Instead you can define a list of packages to install. cloud-init automatically uses the native package management tool for the distro you select.

We are actively working with our endorsed Linux distro partners in order to have cloud-init enabled images available in the Azure marketplace. 
These images will make your cloud-init deployments and configurations work seamlessly with VMs and virtual machine scale sets. Initially we collaborate with the endorsed Linux distro partners and upstream to ensure cloud-init functions with the OS on Azure, then the packages are updated and made publicly available in the distro package repositories. 

There are two stages to making cloud-init available to the endorsed Linux distro OS's on Azure, package support, and then image support:
* 'cloud-init package support on Azure' documents which cloud-init packages onwards are supported or in preview, so you can use these packages with the OS in a custom image.
* 'image cloud-init ready' documents if the image is already configured to use cloud-init.


### Canonical
| Publisher / Version| Offer | SKU | Version | image cloud-init ready | cloud-init package support on Azure|
|:--- |:--- |:--- |:--- |:--- |:--- |
|Canonical 20.04 |UbuntuServer |18.04-LTS |latest |yes | yes |
|Canonical 18.04 |UbuntuServer |18.04-LTS |latest |yes | yes |
|Canonical 16.04|UbuntuServer |16.04-LTS |latest |yes | yes |
|Canonical 14.04|UbuntuServer |14.04.5-LTS |latest |yes | yes |

### RHEL
| Publisher / Version | Offer | SKU | Version | image cloud-init ready | cloud-init package support on Azure|
|:--- |:--- |:--- |:--- |:--- |:--- |
|RedHat 7.6 |RHEL |7-RAW-CI |7.6.2019072418 |yes | yes - support from package version: *18.2-1.el7_6.2*|
|RedHat 7.7 |RHEL |7-RAW-CI |7.7.2019081601 | yes (note this is a preview image, and once all RHEL 7.7 images support cloud-init, this will be removed 1st September 2020) | yes - support from package version: *18.5-6.el7*|
|RedHat 7.7 (Gen1)|RHEL |7.7 | 7.7.2020051912 | yes | yes - support from package version: *18.5-6.el7*|
|RedHat 7.7 (Gen2)|RHEL | 77-gen2 | 7.7.2020051913 | yes | yes - support from package version: *18.5-6.el7*|
|RedHat 7.7 (Gen1)|RHEL |7-LVM | 7.7.2020051921 | yes | yes - support from package version: *18.5-6.el7*|
|RedHat 7.7 (Gen2)|RHEL | 7lvm-gen2 | 7.7.2020051922  | yes | yes - support from package version: *18.5-6.el7*|
|RedHat 7.7 (Gen1) |rhel-byos | rhel-lvm77 | 7.7.20200416 | yes  | yes - support from package version: *18.5-6.el7*|
|RedHat 8.1 (Gen1) |RHEL |8.1-ci |8.1.2020042511 | yes (note this is a preview image, and once all RHEL 8.1 images support cloud-init, this will be removed 1st August 2020) | No, ETA for full support June 2020|
|RedHat 8.1 (Gen2) |RHEL |81-ci-gen2 |8.1.2020042524 | yes (note this is a preview image, and once all RHEL 8.1 images support cloud-init, this will be removed 1st August 2020) | No, ETA for full support June 2020 |

RedHat:RHEL 7.8 and 8.2 (Gen1 and Gen2) images are provisioned using cloud-init.

### CentOS

| Publisher / Version | Offer | SKU | Version | image cloud-init ready | cloud-init package support on Azure|
|:--- |:--- |:--- |:--- |:--- |:--- |
|OpenLogic 7.7 |CentOS |7-CI |7.7.20190920 |yes (note this is a preview image, and once all CentOS 7.7 images support cloud-init, this will be removed 1st September 2020) | yes - support from package version: *18.5-3.el7.centos*|

* CentOS 7.7 images that will be cloud-init enabled be updated here in June 2020 
* CentOS 7.8 images are provisioned using cloud-init.


### Oracle

| Publisher / Version | Offer | SKU | Version | image cloud-init ready | cloud-init package support on Azure|
|:--- |:--- |:--- |:--- |:--- |:--- |
|Oracle 7.7 |Oracle-Linux |77-ci |7.7.01| preview image (note this is a preview image, and it once all Oracle 7.7 images support cloud-init, this will be removed mid 2020, notice will be given) | no, in preview, package is: *18.5-3.0.1.el7*

### SuSE SLES
| Publisher / Version | Offer | SKU | Version | image cloud-init ready | cloud-init package support on Azure|
|:--- |:--- |:--- |:--- |:--- |:--- |
|SUSE SLES 15 SP1 |suse |sles-15-sp1-basic |cloud-init-preview| See [SUSE cloud-init blog](https://suse.com/c/clout-init-coming-to-suse-images-in-azure/) for details | No, in preview. |
|SUSE SLES 15 SP1 |suse |sles-15-sp1-basic |gen2-cloud-init-preview| See [SUSE cloud-init blog](https://suse.com/c/clout-init-coming-to-suse-images-in-azure/) for details | No, in preview. |


### Debian
| Publisher / Version | Offer | SKU | Version | image cloud-init ready | cloud-init package support on Azure|
|:--- |:--- |:--- |:--- |:--- |:--- |
| debian (Gen1) |debian-10 | 10-cloudinit |cloud-init-preview| yes (preview only) | No, in preview. |
| debian (Gen2) |debian-10 | 10-cloudinit-gen2 |cloud-init-preview| yes (preview only) | No, in preview. |




Currently Azure Stack will support the provisioning of cloud-init enabled images.

## What is the difference between cloud-init and the Linux Agent (WALA)?
WALA is an Azure platform-specific agent used to provision and configure VMs, and handle [Azure extensions](https://docs.microsoft.com/azure/virtual-machines/extensions/features-linux). 

We are enhancing the task of configuring VMs to use cloud-init instead of the Linux Agent in order to allow existing cloud-init customers to use their current cloud-init scripts, or new customers to take advantage of the rich cloud-init configuration functionality. If you have existing investments in cloud-init scripts for configuring Linux systems, there are **no additional settings required** to enable cloud-init process them. 

cloud-init cannot process Azure extensions, so WALA is still required in the image to process extensions, but will need to have its provisioning code disabled, for endorsed Linux distros images that are being converted to provision by cloud-init, they will have WALA installed, and setup correctly.

When creating a VM, if you do not include the Azure CLI `--custom-data` switch at provisioning time, cloud-init or WALA takes the minimal VM provisioning parameters required to provision the VM and complete the deployment with the defaults.  If you reference the cloud-init configuration with the `--custom-data` switch, whatever is contained in your custom data will be available to cloud-init when the VM boots.

cloud-init configurations applied to VMs do not have time constraints and will not cause a deployment to fail by timing out. This is not true for WALA, if you change the WALA defaults to process custom-data, it cannot exceed the total VM provisioning time allowance of 40mins, if so, the VM Create will fail.

## Deploying a cloud-init enabled Virtual Machine
Deploying a cloud-init enabled virtual machine is as simple as referencing a cloud-init enabled distribution during deployment.  Linux distribution maintainers have to choose to enable and integrate cloud-init into their base Azure published images. Once you have confirmed the image you want to deploy is cloud-init enabled, you can use the Azure CLI to deploy the image. 

The first step in deploying this image is to create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```
The next step is to create a file in your current shell, named *cloud-init.txt* and paste the following configuration. For this example, create the file in the Cloud Shell not on your local machine. You can use any editor you wish. Enter `sensible-editor cloud-init.txt` to create the file and see a list of available editors. Choose #1 to use the **nano** editor. Make sure that the whole cloud-init file is copied correctly, especially the first line:

```yaml
#cloud-config
package_upgrade: true
packages:
  - httpd
```
Press `ctrl-X` to exit the file, type `y` to save the file and press `enter` to confirm the file name on exit.

The final step is to create a VM with the [az vm create](/cli/azure/vm) command. 

The following example creates a VM named *centos74* and creates SSH keys if they do not already exist in a default key location. To use a specific set of keys, use the `--ssh-key-value` option.  Use the `--custom-data` parameter to pass in your cloud-init config file. Provide the full path to the *cloud-init.txt* config if you saved the file outside of your present working directory. The following example creates a VM named *centos74*:

```azurecli-interactive 
az vm create \
  --resource-group myResourceGroup \
  --name centos74 \
  --image OpenLogic:CentOS-CI:7-CI:latest \
  --custom-data cloud-init.txt \
  --generate-ssh-keys 
```

When the VM has been created, the Azure CLI shows information specific to your deployment. Take note of the `publicIpAddress`. This address is used to access the VM.  It takes some time for the VM to be created, the packages to install, and the app to start. There are background tasks that continue to run after the Azure CLI returns you to the prompt. You can SSH into the VM and use the steps outlined in the Troubleshooting section to view the cloud-init logs. 

## Troubleshooting cloud-init
Once the VM has been provisioned, cloud-init will run through all the modules and script defined in `--custom-data` in order to configure the VM.  If you need to troubleshoot any errors or omissions from the configuration, you need to search for the module name (`disk_setup` or `runcmd` for example) in the cloud-init log - located in **/var/log/cloud-init.log**.

> [!NOTE]
> Not every module failure results in a fatal cloud-init overall configuration failure. For example, using the `runcmd` module, if the script fails, cloud-init will still report provisioning succeeded because the runcmd module executed.

For more details of cloud-init logging, refer to the [cloud-init documentation](https://cloudinit.readthedocs.io/en/latest/topics/logging.html) 

## Next steps
For cloud-init examples of configuration changes, see the following documents:
 
- [Add an additional Linux user to a VM](cloudinit-add-user.md)
- [Run a package manager to update existing packages on first boot](cloudinit-update-vm.md)
- [Change VM local hostname](cloudinit-update-vm-hostname.md) 
- [Install an application package, update configuration files and inject keys](tutorial-automate-vm-deployment.md)
 
