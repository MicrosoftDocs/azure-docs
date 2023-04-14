---
title: Set up Azure Virtual Desktop for Azure Stack HCI (preview) - Azure
description: How to set up Azure Virtual Desktop for Azure Stack HCI (preview).
author: dansisson
ms.topic: how-to
ms.date: 02/19/2023
ms.author: v-dansisson
ms.reviewer: daknappe
manager: femila
ms.custom: ignite-fall-2021, devx-track-azurecli
---
# Set up Azure Virtual Desktop for Azure Stack HCI (preview)

This article describes how to set up Azure Virtual Desktop for Azure Stack HCI (preview) manually or through an automated process.

With Azure Virtual Desktop for Azure Stack HCI (preview), you can use Azure Virtual Desktop session hosts in your on-premises Azure Stack HCI infrastructure. For more information, see [Azure Virtual Desktop for Azure Stack HCI (preview)](azure-stack-hci-overview.md).

> [!IMPORTANT]
> This feature is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Configure Azure Virtual Desktop for Azure Stack HCI

You can set up Azure Virtual Desktop for Azure Stack HCI either manually or automatically using the Azure Resource Manager template (ARM template) in the Azure portal. Both these methods deploy a pooled host pool.

# [Manual deployment](#tab/manual-deployment)

## Prerequisites

To use Azure Virtual Desktop for Azure Stack HCI, you need the following things:

- An [Azure Stack HCI cluster registered with Azure](/azure-stack/hci/deploy/register-with-azure).

- An Azure subscription for Azure Virtual Desktop session host pool creation with all required admin permissions.

- [An on-premises Active Directory (AD) synced with Azure Active Directory](/azure/architecture/reference-architectures/identity/azure-ad).

- A stable connection to Azure from your on-premises network.

- Access from your on-premises network to all the required URLs listed in Azure Virtual Desktop's [required URL list](safe-url-list.md) for virtual machines.

## Configure Azure Virtual Desktop for Azure Stack HCI manually

To manually configure Azure Virtual Desktop for Azure Stack HCI, follow these high-level steps:

- [Step 1: Create a new virtual machines on Azure Stack HCI](#step-1-create-a-new-virtual-machine-on-azure-stack-hci)
- [Step 2: Install Connected Machine agent on the virtual machine](#step-2-install-connected-machine-agent-on-the-virtual-machine)
- [Step 3: Deploy a custom template](#step-3-deploy-a-custom-template)
- [Step 4: Manage application groups](#step-4-manage-application-groups)

### Step 1: Create a new virtual machine on Azure Stack HCI

Create a new virtual machine with a supported operating system on your Azure Stack HCI infrastructure. For step-by-step instructions about how to create a VM, see [Create a new VM](/azure-stack/hci/manage/vm#create-a-new-vm). For information about supported operating system and licenses, see [Operating systems and licenses](/azure/virtual-desktop/prerequisites#operating-systems-and-licenses).

> [!NOTE]
> [Install the Remote Desktop Session Host (RDSH) role](/troubleshoot/windows-server/remote/install-rds-host-role-service-without-connection-broker) if the VM is running a Windows Server operating system.

### Step 2: Install Connected Machine agent on the virtual machine

To manage the new VM from Azure via Azure Arc, install the Connected Machine agent on the VM. For step-by-step instructions on how to install the Windows agent on the VM, see [Connect hybrid machines with Azure Arc-enabled servers](../azure-arc/servers/learn/quick-enable-hybrid-vm.md).

### Step 3: Deploy a custom template

After you satisfy the [prerequisites](#prerequisites) and complete [Step 1](#step-1-create-a-new-virtual-machine-on-azure-stack-hci) and [Step 2](#step-2-install-connected-machine-agent-on-the-virtual-machine), perform these steps to deploy Azure Virtual Desktop on Azure Stack HCI from a custom template:

1. Select the [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/avdarmtemplatecreatega) button.

    > [!TIP]
    > Hold down **CTRL** while selecting the button to open the Azure portal in a new browser tab.

    The Azure Resource Manager template opens in the Azure portal and sets up Azure Virtual Desktop on Azure Stack HCI by:

    - Creating host pool, workspace, and application group
    - Adding the VMs you created in [Step 1](#step-1-create-a-new-virtual-machine-on-azure-stack-hci) as session hosts to the host pool
    - Joining the VMs to the domain and downloading and installing the Azure Virtual Desktop agents and registering them to the host pool

    To find all the relevant custom templates, see [Quick Deploy templates](https://github.com/Azure/RDS-Templates/tree/master/ARM-wvd-templates/HCI/HybridCompute) on GitHub.

1. Select or enter the following values under **Project details**:
    
    1. From **Subscription**, select the correct subscription.
    1. In **Region**, select the Azure region for the host pool that’s right for you and your customers.
    1. In **Host Pool Name**, enter a unique name for your host pool.
    1. In **Location**, enter a region where you create the Host Pool, Workspace, and VMs. The metadata for these objects is stored in the geography associated with the region, such as **East US**. This location must match the Azure region you selected previously, in step b.
    1. In **Workspace Name**, enter a unique name.
   
        :::image type="content" source="./media/azure-virtual-desktop-hci/project-details-1.png" alt-text="Screenshot of the first part of the Project details section." lightbox="./media/azure-virtual-desktop-hci/project-details-1.png" :::

    1. In **Domain**, enter the domain name to join your session hosts to the required domain.
    
    1. In **O U Path**, enter the OU Path value for domain join. For example: `OU=unit1,DC=contoso,DC=com`.
   
    1. In **Domain Administrator Username** and **Domain Administrator Password**, enter the domain administrator credentials to join your session hosts to the domain.

        :::image type="content" source="./media/azure-virtual-desktop-hci/project-details-2.png" alt-text="Screenshot of the second part of the Project details section." lightbox="./media/azure-virtual-desktop-hci/project-details-2.png" :::

    1. In **Vm Resource Ids**, enter full ARM resource IDs of the VMs to add to the host pool as session hosts. You can add multiple VMs. For example:

        `“/subscriptions/<subscriptionID>/resourceGroups/Contoso-        rg/providers/Microsoft.HybridCompute/machines/Contoso-VM1”,”/subscriptions/<subscriptionID>/resourceGroups/Contoso-rg/providers/Microsoft.HybridCompute/machines/Contoso-VM2”`
    
    1. In **Token Expiration Time**, enter the host pool token expiration. If left blank, the template automatically takes the current UTC time as the default value.
    
    1. In **Tags**, enter values for tags in the following format:
    
        {"CreatedBy": "name", "Test": "Test2”}
    
    1. In **Deployment Id**, enter the Deployment ID. A new GUID is created by default.
    
    1. In **Validation Environment**, select the validation environment. The default is **false**.
    
        :::image type="content" source="./media/azure-virtual-desktop-hci/project-details-3.png" alt-text="Screenshot of the third part of the Project details section." lightbox="./media/azure-virtual-desktop-hci/project-details-3.png" :::

1. Select the **Review+Create** button.

1. After validation passes, select **Create**.

    After the deployment is complete, you can see all the required objects created.

### Step 4: Manage application groups

You can add more application groups to a host pool and assign users to the application group. For step-by-step instructions, see [Tutorial: Manage app groups with the Azure portal](manage-app-groups.md).

## Activate Windows operating system

You must license and activate the Windows VMs before you use them on Azure Stack HCI.

For activating your multi-session OS VMs (Windows 10, Windows 11, or later), enable Azure Benefits on the VM once it is created. Make sure to enable Azure Benefits on the host computer also. For more information, see [Azure Benefits on Azure Stack HCI](/azure-stack/hci/manage/azure-benefits).

> [!NOTE]
> You must manually enable access for each VM that requires Azure Benefits.

For all other OS images (such as Windows Server or single-session OS), Azure Benefits is not required. Continue to use the existing activation methods. For more information, see [Activate Windows Server VMs on Azure Stack HCI](/azure-stack/hci/manage/vm-activate).

## Optional configurations

Now that you've set up Azure Virtual Desktop for Azure Stack HCI, here are a few extra things you can do depending on your deployment needs:

### Create a profile container

To create a profile container using a file share on Azure Stack HCI, do the following:

1. Deploy a file share on a single or clustered Windows Server VM deployment. The Windows Server VMs with file server role can also be co-located on the same cluster where the session host VMs are deployed.

1. Connect to the VM with the credentials you provided when creating the VM.

3. Join the VM to an Active Directory domain.

7. Follow the instructions in [Create a profile container for a host pool using a file share](create-host-pools-user-profile.md) to prepare your VM and configure your profile container.

### Add session hosts

You can add new session hosts to an existing host pool that was created either manually or using the custom template.

To get started, select the [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/avdarmtemplateaddga) button.

The custom template opens in the Azure portal. This Azure Resource Manager template sets up your VMs for Azure Virtual Desktop and adds them to your existing host pool. To find all the relevant custom templates, see [Quick Deploy templates](https://github.com/Azure/RDS-Templates/tree/master/ARM-wvd-templates/HCI/HybridCompute) on GitHub.

### Download supported OS images from Azure Marketplace

You can run any OS images that both Azure Virtual Desktop and Azure Stack HCI support on your deployment. To learn which operating systems Azure Virtual Desktop supports, see [Supported VM OS images](prerequisites.md#operating-systems-and-licenses).

You have two options to download an image:

- Deploy a VM with your preferred OS image, then follow the instructions in [Download a Windows VHD from Azure](../virtual-machines/windows/download-vhd.md).
- Download a Windows Virtual Hard Disk (VHD) from Azure without deploying a VM.

Downloading a Windows VHD without deploying a VM has several extra steps. To download a VHD from Azure without deploying a VM, you'll need to complete the instructions in the following sections in order.

### Requirements to download a VHD without a VM

Before you begin, make sure you're connected to Azure and are running [Azure Cloud Shell](../cloud-shell/quickstart.md) in either a command prompt or in the bash environment. You can also run CLI reference commands via the Azure CLI.

If you're using a local installation, run the [az login](/cli/azure/reference-index#az-login) command to sign into Azure.

After that, follow any other prompts you see to finish signing in. For more sign-in options, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

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

If you're looking for Windows Server 2019 Datacenter, you can run the following criteria in your Azure CLI:

```azurecli
az vm image list --all --publisher "microsoftwindowsserver" --offer "WindowsServer" --sku "2019-Datacenter-gen2"
```

This command should return the following URN:

```output
MicrosoftWindowsServer:windowsserver-gen2preview:2019-datacenter-gen2:latest
```

> [!IMPORTANT]
> Make sure to only use generation 2 ("gen2") images. Azure Virtual Desktop for Azure Stack HCI doesn't support creating a VM with a first-generation ("gen1") image. Avoid SKUs with a "-g1" suffix.

### Create a new Azure managed disk from the image

Next, you need to create an Azure managed disk from the image you downloaded from the Azure Marketplace.

To create an Azure managed disk:

1. Run the following commands in an Azure command-line prompt to set the parameters of your managed disk. Make sure to replace the items in brackets with the values relevant to your scenario.

    ```console
    $urn = <URN of the Marketplace image> #Example:    “MicrosoftWindowsServer:WindowsServer:2019-Datacenter:Latest”
    $diskName = <disk name> #Name for new disk to be created
    $diskRG = <resource group> #Resource group that contains the new disk
    ```

1. Run these commands to create the disk and generate a Serial Attached SCSI (SAS) access URL.

    ```azurecli
    az disk create -g $diskRG -n $diskName --image-reference $urn
    $sas = az disk grant-access --duration-in-seconds 36000 --access-level Read --name $diskName --resource-group $diskRG
    $diskAccessSAS = ($sas | ConvertFrom-Json)[0].accessSas
    ```

### Export a VHD from the managed disk to Azure Stack HCI cluster

After that, you'll need to export the VHD you created from the managed disk to your Azure Stack HCI cluster, which will let you create new VMs. You can use the following method in a regular web browser or Storage Explorer.

To export the VHD:

1. Open a browser and go to the SAS URL of the managed disk you generated in [Create a new Azure managed disk from the image](#create-a-new-azure-managed-disk-from-the-image). You can download the VHD image for the image you downloaded at the Azure Marketplace at this URL.

1. Download the VHD image. The downloading process may take several minutes, so be patient. Make sure the image has fully downloaded before going to the next section.

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

This command may take a few minutes to finish.

> [!NOTE]
> Optionally, you can also convert the download VHD to a dynamic VHDx by running this command:
>
> ```powershell
> Convert-VHD -Path " destination_path_on_cluster\file_name.vhd" -DestinationPath " destination_path_on_cluster\file_name.vhdx" -VHDType Dynamic
> ```

## Next steps

For an overview and pricing information, see [Azure Virtual Desktop for Azure Stack HCI](azure-stack-hci-overview.md).

To find answers to frequently asked questions, see [FAQ](azure-stack-hci-faq.yml).

# [Automated deployment](#tab/automated-deployment)

## Prerequisites

To use Azure Virtual Desktop for Azure Stack HCI, you'll need the following things:

- An Azure subscription for Azure Virtual Desktop session host pool creation with all required admin permissions. For more information, see [Built-in Azure RBAC roles for Azure Virtual Desktop](rbac.md).

- An [Azure Stack HCI cluster registered with Azure](/azure-stack/hci/deploy/register-with-azure) in the same subscription.

- Azure Arc virtual machine (VM) management should be set up on the Azure Stack HCI cluster. For more information, see [VM provisioning through Azure portal on Azure Stack HCI (preview)](/azure-stack/hci/manage/azure-arc-enabled-virtual-machines).

- [An on-premises Active Directory (AD) synced with Azure Active Directory](/azure/architecture/reference-architectures/identity/azure-ad). The AD domain should resolve using DNS. For more information, see [Prerequisites for Azure Virtual Desktop](prerequisites.md#network).

- A stable connection to Azure from your on-premises network.

- Access from your on-premises network to all the required URLs listed in Azure Virtual Desktop's [required URL list](safe-url-list.md) for virtual machines.

- There should be at least one Windows OS image available on the cluster. For more information, see how to [create VM images using Azure Marketplace images](/azure-stack/hci/manage/virtual-machine-image-azure-marketplace?tabs=azurecli), [use images in Azure Storage account](/azure-stack/hci/manage/virtual-machine-image-storage-account?tabs=azurecli), and [use images in local share](/azure-stack/hci/manage/virtual-machine-image-local-share?tabs=azurecli).

## Configure Azure Virtual Desktop for Azure Stack HCI via automation

The automated deployment of Azure Virtual Desktop for Azure Stack HCI is based on an Azure Resource Manager template, which automates the following steps:

- Creating the host pool and workspace
- Creating the session hosts on the Azure Stack HCI cluster
- Joining the domain, downloading and installing the Azure Virtual Desktop agents, and then registering them to the host pool

Follow these steps for the automated deployment process:

1. Sign in to the Azure portal.

1. On the Azure portal menu or from the Home page, select **Azure Stack HCI**.

1. Select your Azure Stack HCI cluster.

    :::image type="content" source="media/azure-virtual-desktop-hci/azure-portal.png" alt-text="Screenshot of Azure portal." lightbox="media/azure-virtual-desktop-hci/azure-portal.png":::

1. On the **Overview** page, select the **Get Started** tab.

1. Select the **Deploy** button on the **Azure Virtual Desktop** tile. The **Custom deployment** page will open.

    :::image type="content" source="media/azure-virtual-desktop-hci/custom-template.png" alt-text="Screenshot of custom deployment template." lightbox="media/azure-virtual-desktop-hci/custom-template.png":::

1. Select the correct subscription under **Project details**.

1. Select either **Create new** to create a new resource group or select an existing resource group from the drop-down menu.

1. Select the Azure region for the host pool that’s right for you and your customers.

1. Enter a unique name for your host pool.

1. In **Location**, enter a region where Host Pool, Workspace, and VMs machines will be created. The metadata for these objects is stored in the geography associated with the region. For example: East US.

    > [!NOTE]
    > This location must match the Azure region you selected in step 8 above.

1. In **Custom Location Id**, enter the resource ID of the deployment target for creating VMs, which is associated with an Azure Stack HCI cluster. For example:
*/subscriptions/My_subscriptionID/resourcegroups/Contoso-rg/providers/microsoft.extendedlocation/customlocations/Contoso-CL*

1. Enter a value for **Virtual Processor Count** (vCPU) and for **Memory GB** for your VM. Defaults are 4 vCPU and 8GB respectively.

1. Enter a unique name for **Workspace Name**.

1. Enter local administrator credentials for **Vm Administrator Account Username** and **Vm Administrator Account Password**.

1. Enter the **OU Path** value for domain join. *Example: OU=unit1,DC=contoso,DC=com*.

1. Enter the **Domain** name to join your session hosts to the required domain.

1. Enter domain administrator credentials for **Domain Administrator Username** and **Domain Administrator Password** to join your session hosts to the domain. These are mandatory fields.

1. Enter the number of VMs to be created for **Vm Number of Instances**. Default is 1.

1. Enter a prefix for the VMs for **Vm Name Prefix**.

1. Enter the **Image Id** of the image to be used. This can be a custom image or an Azure Marketplace image.  *Example:  /subscriptions/My_subscriptionID/resourceGroups/Contoso-rg/providers/microsoft.azurestackhci/marketplacegalleryimages/Contoso-Win11image*.

1. Enter the **Virtual Network Id** of the virtual network. *Example: /subscriptions/My_subscriptionID/resourceGroups/Contoso-rg/providers/Microsoft.AzureStackHCI/virtualnetworks/Contoso-virtualnetwork*.

1. Enter the **Token Expiration Time**. If left blank, the default will be the current UTC time. 

1. Enter values for **Tags**. *Example format: { "CreatedBy": "name",  "Test": "Test2”  }*

1. Enter the **Deployment Id**. A new GUID will be created by default.

1. Select the **Validation Environment** - it's **false** by default.

> [!NOTE]
> For more session host configurations, use the Full Configuration [(CreateHciHostpoolTemplate.json)](https://github.com/Azure/RDS-Templates/blob/master/ARM-wvd-templates/HCI/CreateHciHostpoolTemplate.json) template, which offers all the features that can be used to deploy Azure Virtual Desktop on Azure Stack HCI.

## Activate Windows operating system

You must license and activate Windows VMs before you use them on Azure Stack HCI.

For activating your multi-session OS VMs (Windows 10, Windows 11, or later), enable Azure Benefits on the VM once it is created. Make sure to enable Azure Benefits on the host computer also. For more information, see [Azure Benefits on Azure Stack HCI](/azure-stack/hci/manage/azure-benefits).

> [!NOTE]
> You must manually enable access for each VM that requires Azure Benefits.

For all other OS images (such as Windows Server or single-session OS), Azure Benefits is not required. Continue to use the existing activation methods. For more information, see [Activate Windows Server VMs on Azure Stack HCI](/azure-stack/hci/manage/vm-activate).

## Optional configuration

Now that you've set up Azure Virtual Desktop for Azure Stack HCI, here are a few optional things you can do depending on your deployment needs:
 
### Add session hosts

You can add new session hosts to an existing host pool that was created either manually or using the custom template. Use the **Quick Deploy** [(AddHciVirtualMachinesQuickDeployTemplate.json)](https://github.com/Azure/RDS-Templates/blob/master/ARM-wvd-templates/HCI/QuickDeploy/AddHciVirtualMachinesQuickDeployTemplate.json) template to get started.

For information on how to deploy a custom template, see [Quickstart: Create and deploy ARM templates by using the Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).

> [!NOTE]
> For more session host configurations, use the **Full Configuration** [(AddHciVirtualMachinesTemplate.json)](https://github.com/Azure/RDS-Templates/blob/master/ARM-wvd-templates/HCI/AddHciVirtualMachinesTemplate.json) template, which offers all the features that can be used to deploy Azure Virtual Desktop on Azure Stack HCI. Learn more at [RDS-Templates](https://github.com/Azure/RDS-Templates/blob/master/ARM-wvd-templates/HCI/Readme.md).

### Create a profile container

To create a profile container using a file share on Azure Stack HCI, do the following:

1. Deploy a file share on a single or clustered Windows Server VM deployment. The Windows Server VMs with file server role can also be co-located on the same cluster where the session host VMs are deployed.

1. Connect to the VM with the credentials you provided when creating the VM.

3. Join the VM to an Active Directory domain.

7. Follow the instructions in [Create a profile container for a host pool using a file share](create-host-pools-user-profile.md) to prepare your VM and configure your profile container.

## Next steps

For an overview and pricing information, see [Azure Virtual Desktop for Azure Stack HCI](azure-stack-hci-overview.md).