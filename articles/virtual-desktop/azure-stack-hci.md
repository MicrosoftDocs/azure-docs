---
title: Set up Azure Virtual Desktop for Azure Stack HCI (preview) - Azure
description: How to set up Azure Virtual Desktop for Azure Stack HCI (preview).
author: Heidilohr
ms.topic: how-to
ms.date: 11/02/2021
ms.author: helohr
manager: femila
ms.custom: ignite-fall-2021, devx-track-azurecli
---
# Set up Azure Virtual Desktop for Azure Stack HCI (preview)

> [!IMPORTANT]
> Azure Virtual Desktop for Azure Stack HCI is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

With Azure Virtual Desktop for Azure Stack HCI (preview), you can use Azure Virtual Desktop session hosts in your on-premises Azure Stack HCI infrastructure. For more information, see [Azure Virtual Desktop for Azure Stack HCI (preview)](azure-stack-hci-overview.md).

## Requirements

In order to use Azure Virtual Desktop for Azure Stack HCI, you'll need the following things:

- An [Azure Stack HCI cluster registered with Azure](/azure-stack/hci/deploy/register-with-azure).

- An Azure subscription for Azure Virtual Desktop session host pool creation with all required admin permissions.

- [An on-premises Active Directory (AD) synced with Azure Active Directory](/azure/architecture/reference-architectures/identity/azure-ad).

- A stable connection to Azure from your on-premises network.

- Access from your on-premises network to all the required URLs listed in Azure Virtual Desktop's [required URL list](safe-url-list.md) for virtual machines.

## Configure Azure Virtual Desktop for Azure Stack HCI

To set up Azure Virtual Desktop for Azure Stack HCI:

1. Create a new host pool with no virtual machines by following the instructions in [Begin the host pool setup process](create-host-pools-azure-marketplace.md#begin-the-host-pool-setup-process). At the end of that section, come back to this article and start on step 2.

2. Configure the newly created host pool to be a validation host pool by following the steps in [Define your host pool as a validation host pool](create-validation-host-pool.md#define-your-host-pool-as-a-validation-host-pool) to enable the Validation environment property.

3. Follow the instructions in [Workspace information](create-host-pools-azure-marketplace.md#workspace-information) to create a workspace for yourself.

4. Deploy a new virtual machine on your Azure Stack HCI infrastructure by following the instructions in [Create a new VM](/azure-stack/hci/manage/vm#create-a-new-vm). Deploy a VM with a supported OS and join it to a domain.

   >[!NOTE]
   >Install the Remote Desktop Session Host (RDSH) role if the VM is running a Windows Server OS.

5. Enable Azure to manage the new virtual machine through Azure Arc by installing the Connected Machine agent to it. Follow the directions in [Connect hybrid machines with Azure Arc-enabled servers](../azure-arc/servers/learn/quick-enable-hybrid-vm.md) to install the Windows agent to the virtual machine.

6. Add the virtual machine to the Azure Virtual Desktop host pool you created earlier by installing the [Azure Virtual Desktop Agent](agent-overview.md). After that, follow the instructions in [Register the VMs to the Azure Virtual Desktop host pool](create-host-pools-powershell.md#register-the-virtual-machines-to-the-azure-virtual-desktop-host-pool) to register the VM to the Azure Virtual Desktop service.

7. Follow the directions in [Create app groups and manage user assignments](manage-app-groups.md) to create an app group for testing and assign user access to it.

8. Go to [the web client](./user-documentation/connect-web.md) and grant your users access to the new deployment.

## Optional configurations

Now that you've set up Azure Virtual Desktop for Azure Stack HCI, here are a few extra things you can do depending on your deployment's needs.

### Create a profile container using a file share on Azure Stack HCI

To create a profile container using a file share:

1. Deploy a file share on a single or clustered Windows Server VM deployment. The Windows Server VMs with file server role can also be colocated on the same cluster where the session host VMs are deployed.

2. Connect to the virtual machine with the credentials you provided when creating the virtual machine.

3. On the virtual machine, launch **Control Panel** and select **System**.

4. Select Computer name, select **Change settings**, and then select **Change…**.

5. Select **Domain**, then enter the Active Directory domain on the virtual network.

6. Authenticate with a domain account that has privileges to domain-join machines.

7. Follow the directions in [Prepare the VM to act as a file share](create-host-pools-user-profile.md#prepare-the-virtual-machine-to-act-as-a-file-share-for-user-profiles) to prepare your VM for deployment.

8. Follow the directions in [Configure the FSLogix profile container](create-host-pools-user-profile.md#configure-the-fslogix-profile-container) to configure your profile container for use.

### Download supported OS images from Azure Marketplace

You can run any OS images that both Azure Virtual Desktop and Azure Stack HCI support on your deployment. To learn which OSes Azure Virtual Desktop supports, see [Supported VM OS images](prerequisites.md#operating-systems-and-licenses).

You have two options to download an image:

- Deploy a VM with your preferred OS image, then follow the instructions in [Download a Windows VHD from Azure](../virtual-machines/windows/download-vhd.md).
- Download a Windows Virtual Hard Disk (VHD) from Azure without deploying a VM.

Downloading a Windows VHD without deploying a VM has several extra steps. To download a VHD from Azure without deploying a VM, you'll need to complete the instructions in the following sections in order.

### Requirements to download a VHD without a VM

Before you begin, make sure you're connected to Azure and are running [Azure Cloud Shell](../cloud-shell/quickstart.md) in either a command prompt or in the bash environment. You can also run CLI reference commands via the Azure CLI.

If you're using a local installation, run the [az login](/cli/azure/reference-index#az-login) command to sign into Azure.

After that, follow any other prompts you see to finish signing in. For additional sign-in options, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

If this is your first time using Azure CLI, install any required extensions by following the instructions in [Use extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).

Finally, run the [az version](/cli/azure/reference-index?#az-version) command to make sure your client is up to date. If it's out of date, run the [az upgrade](/cli/azure/reference-index?#az-upgrade) command to upgrade to the latest version.

### Search Azure Marketplace for Azure Virtual Desktop images

You can find the image you're looking for by using the **Search** function in Azure Marketplace in the Azure portal. To find images specifically for Azure Virtual Desktop, you can run one of the following example queries.

If you're looking for Windows 10 multi-session, you can run a search with this criteria:

```azurecli
az vm image list --all --publisher "microsoftwindowsdesktop" --offer "windows-10" --sku "21h1-evd-g2"
```

This command should return the following URN:

```output
MicrosoftWindowsDesktop:Windows-10:21h1-evd-g2:latest
```

If you're looking for Windows Server 2019 datacenter, you can run the following criteria in your Azure CLI:

```azurecli
az vm image list --all --publisher "microsoftwindowsserver" --offer "WindowsServer" --sku "2019-Datacenter-gen2"
```

This command should return the following URN:

```output
MicrosoftWindowsServer:windowsserver-gen2preview:2019-datacenter-gen2:latest
```

>[!IMPORTANT]
>Make sure to only use generation 2 ("gen2") images. Azure Virtual Desktop for Azure Stack HCI doesn't support creating a VM with a first-generation ("gen1") image. Avoid SKUs with a "-g1" suffix.

### Create a new Azure managed disk from the image

Next, you'll need to create an Azure managed disk from the image you downloaded from the Azure Marketplace.

To create an Azure managed disk:

1. Run the following commands in an Azure command-line prompt to set the parameters of your managed disk. Make sure to replace the items in brackets with the values relevant to your scenario.

```console
$urn = <URN of the Marketplace image> #Example: “MicrosoftWindowsServer:WindowsServer:2019-Datacenter:Latest”
$diskName = <disk name> #Name for new disk to be created
$diskRG = <resource group> #Resource group that contains the new disk
```

2. Run these commands to create the disk and generate a Serial Attached SCSI (SAS) access URL.

```azurecli
az disk create -g $diskRG -n $diskName --image-reference $urn
$sas = az disk grant-access --duration-in-seconds 36000 --access-level Read --name $diskName --resource-group $diskRG
$diskAccessSAS = ($sas | ConvertFrom-Json)[0].accessSas
```

### Export a VHD from the managed disk to Azure Stack HCI cluster

After that, you'll need to export the VHD you created from the managed disk to your Azure Stack HCI cluster, which will let you create new VMs. You can use the following method in a regular web browser or Storage Explorer.

To export the VHD:

1. Open a browser and go to the SAS URL of the managed disk you generated in [Create a new Azure managed disk from the image](#create-a-new-azure-managed-disk-from-the-image). You can download the VHD image for the image you downloaded at the Azure Marketplace at this URL.

2. Download the VHD image. The downloading process may take several minutes, so be patient. Make sure the image has fully downloaded before going to the next section.

>[!NOTE]
>If you're running azcopy, you may need to skip the md5check by running this command:
>
> ```azurecli
> azcopy copy “$sas" "destination_path_on_cluster" --check-md5 NoCheck
> ```

### Clean up the managed disk

When you're done with your VHD, you'll need to free up space by deleting the managed disk.

To delete the managed disk you created, run these commands:

```azurecli
az disk revoke-access --name $diskName --resource-group $diskRG 
az disk delete --name $diskName --resource-group $diskRG --yes
```

This command may take a few minutes to finish, so be patient.

>[!NOTE]
>Optionally, you can also convert the download VHD to a dynamic VHDx by running this command:
>
> ```powershell
> Convert-VHD -Path " destination_path_on_cluster\file_name.vhd" -DestinationPath " destination_path_on_cluster\file_name.vhdx" -VHDType Dynamic
> ```

## Next steps

If you need to refresh your memory about the basics or pricing information, go to [Azure Virtual Desktop for Azure Stack HCI](azure-stack-hci-overview.md).

If you have additional questions, check out our [FAQ](azure-stack-hci-faq.yml).
