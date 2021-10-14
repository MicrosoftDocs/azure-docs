---
title: Set up Azure Virtual Desktop for Azure Stack HCI (preview) - Azure
description: How to set up Azure Virtual Desktop for Azure Stack HCI (preview).
author: Heidilohr
ms.topic: how-to
ms.date: 11/02/2021
ms.author: helohr
manager: femila
---
# Set up Azure Virtual Desktop for Azure Stack HCI (preview)

> [!IMPORTANT]
> Azure Virtual Desktop for Azure Stack HCI is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Requirements

1. An [Azure Stack HCI cluster registered to Azure Portal](/azure-stack/hci/deploy/register-with-azure).

2. An Azure subscription for Azure Virtual Desktop session host pool creation with all required admin permissions.

3. [An on-premises Active Directory (AD) synced with Azure Active Directory](/azure/architecture/reference-architectures/identity/azure-ad).

4. A stable connection to your Azure subscription from your on-premises network.

## Set up your deployment

To set up Azure Virtual Desktop for Azure Stack HCI:

1. Follow the instructions in [Begin the host pool setup process](create-host-pools-azure-marketplace.md#begin-the-host-pool-setup-process) to create a host pool and workspace. At the end of that section, come back to this article and start on step 2.

2. Next, follow the instructions in [Create a new VM](/azure-stack/hci/manage/vm#create-a-new-vm) to deploy a VM with a supported OS and join it to a domain.

   >[!NOTE]
   >Install the Remote Desktop Session Host (RDSH) role if the VM is running a Windows Server OS.

3. Follow the directions in [Install Arc for server agents on the VM](../azure-arc/servers/learn/quick-enable-hybrid-vm.md).

4. Install the [Azure Virtual Desktop Agent](agent-overview.md) and follow the instructions in [Register the VMs to the Azure Virtual Desktop host pool](create-host-pools-powershell.md#register-the-virtual-machines-to-the-azure-virtual-desktop-host-pool) to register the VM to the Azure Virtual Desktop service.

5. Follow the directions in [Create app groups and manage user assignments](manage-app-groups.md).

6. Go to [the web client](https://rdweb.wvd.microsoft.com/arm/webclient/index.html) and grant your users access to the new deployment.

## Optional configurations

Now that you've set up Azure Virtual Desktop for Azure Stack HCI, here are a few extra things you can do depending on your deployment's needs.

### Create a profile container using a file share on Azure Stack HCI

1. Deploy a file share on a single or clustered Windows Server VM deployment. The Windows Server VMs with file server role can also be co-located on the same cluster where the session host VMs are deployed.

2. Connect to the virtual machine with the credentials you provided when creating the virtual machine.

3. On the virtual machine, launch Control Panel and select System.

4. Select Computer name, select Change settings, and then select Change…

5. Select Domain and then enter the Active Directory domain on the virtual network.

6. Authenticate with a domain account that has privileges to domain-join machines.

7. Follow the directions in [](create-host-pools-user-profile.md#prepare-the-virtual-machine-to-act-as-a-file-share-for-user-profiles) to prepare your VM for deployment.

8. Follow the directions in [Configure the FSLogix profile container](create-host-pools-user-profile.md#configure-the-fslogix-profile-container) to configure your profile container for use.

### Download supported OS images from Azure Marketplace

You can run any OS images that both Azure Virtual Desktop and Azure Stack HCI support on your deployment. To learn which OSes Azure Virtual Desktop supports, see [Supported VM OS images](overview.md#supported-virtual-machine-os-images).

You have two options to download an image:

- Deploy a VM with your preferred OS image, then follow the instructions in [Download a Windows VHD from Azure](../virtual-machines/windows/download-vhd.md).

- Download a Windows VHD from Azure without deploying a VM.

Downloading a Windows VHD without deploying a VM has several extra steps. To download a VHD from Azure without deploying a VM, you'll need to complete the instructions in the following sections in order.

### Requirements for downloading a VHD without a VM

Before you begin, make sure you're connected to Azure and are running [Azure Cloud Shell](../cloud-shell/quickstart.md) in either a command prompt or in the bash environment. You can also run CLI reference commands on the Azure command-line interface (CLI).

If you're using a local installation, run the [az login](/cli/azure/reference-index#az_login) command to sign into Azure.

After that, follow any other prompts you see to finish signing in. For additional sign-in options, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

If this is your first time using Azure CLI, install any required extensions by following the instructions in [Use extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).

Finally, run the [az version](/cli/azure/reference-index?#az_version) command to make sure your cient is up to date. If it's out of date, run the [az upgrade](/cli/azure/reference-index?#az_upgrade) command to upgrade to the latest version.

## Search Azure Marketplace for Azure Virtual Desktop images

You can find the image you're looking for by using the **Search** function in Azure Marketplace in the Azure portal. To find images specifically for Azure Virtual Desktop, you can run one of the following example queries.

If you're looking for Windows 10 multi-session, you can run a search with this criteria:

```azure
az vm image list --all --publisher "microsoftwindowsdesktop" --offer "windows-10" --sku "21h1-evd-g2"
```

This command should return the following URN:

```azure
MicrosoftWindowsDesktop:Windows-10:21h1-evd-g2:latest
```

If you're looking for Windows Server 2019 datacenter, you can run the following criteria in your Azure CLI:

```azure
az vm image list --all --publisher "microsoftwindowsserver" --offer "WindowsServer" --sku "2019-Datacenter-gen2"
```

This command should return the following URN:

```azure
MicrosoftWindowsServer:windowsserver-gen2preview:2019-datacenter-gen2:latest
```

>[!IMPORTANT]
>Make sure to only use generation 2 ("gen2") images. Azure Virtual Desktop for Azure Stack HCI doesn't support creating a VM with a first-generation ("gen1") image. Avoid SKUs with a "-g1" suffix.

## Create a new managed disk from the Marketplace image

Create an Azure Managed Disk from your chosen Marketplace image.

1. Set some parameters.

```azure
$urn = <URN of the Marketplace image> #Example: “MicrosoftWindowsServer:WindowsServer:2019-Datacenter:Latest”
$diskName = <disk name> #Name for new disk to be created
$diskRG = <resource group> #Resource group that contains the new disk
```

2. Create the disk and generate a SAS access URL.

```azure
az disk create -g $diskRG -n $diskName --image-reference $urn
$sas = az disk grant-access --duration-in-seconds 36000 --access-level Read --name $diskName --resource-group $diskRG
$diskAccessSAS = ($sas | ConvertFrom-Json)[0].accessSas
```

## Export a VHD from the managed disk to Azure Stack HCI cluster

This step will export a VHD from the managed disk to your Azure Stack HCI
cluster, which can then be used to create VMs.

1. Using the SAS URL of the managed disk created above, a VHD image of the chose Marketplace image can be downloaded.

2. The download will take several minutes to complete. Ensure the copy has completed before proceeding to next steps.

(Storage Explorer can also be used to download the VHDs)

## Clean up the managed disk

To delete the managed disk you created, run these commands:

```azure
az disk revoke-access --name $diskName --resource-group $diskRG 
az disk delete --name $diskName --resource-group $diskRG --yes
```

The deletion takes a couple minutes to complete.