---
title: Create an Azure Virtual Desktop golden image
description: A walkthrough for how to set up a golden image for your Azure Virtual Desktop deployment in the Azure portal.
author: cshea15
ms.topic: how-to
ms.date: 12/01/2021
ms.author: chashea
manager: bterkaly 
---
# Create a golden image in Azure
This article will walk you through how to use the Azure portal to create a custom image to use for your Azure Virtual Desktop session hosts. This custom image, which we'll call a "golden image," contains all apps and configuration settings you want to apply to your deployment.
There are other approaches to customizing your session hosts, such as using device management tools like [Microsoft Intune](/mem/intune/fundamentals/azure-virtual-desktop-multi-session) or automating your image build using tools like [Azure Image Builder](../virtual-machines/windows/image-builder-virtual-desktop.md) with [Azure DevOps](/azure/devops/pipelines/get-started/key-pipelines-concepts?view=azure-devops&preserve-view=true). Which strategy works best depends on the complexity and size of your planned Azure Virtual Desktop environment and your current application deployment processes. 
## Create an image from an Azure VM
When creating a new VM for your golden image, make sure to choose an OS that's in the list of [supported virtual machine OS images](prerequisites.md#operating-systems-and-licenses).  We recommend using a Windows 10 or 11 multi-session (with or without Microsoft 365) or Windows Server image for pooled host pools. We recommend using Windows 10 or 11 Enterprise images for personal host pools. You can use either Generation 1 or Generation 2 VMs; Gen 2 VMs support features that aren't supported for Gen 1 machines. Learn more about Generation 1 and Generation 2 VMs at [Support for generation 2 VMs on Azure](../virtual-machines/generation-2.md).
> [!IMPORTANT]
> The VM used for taking the image must be deployed without "Login with Microsoft Entra ID" flag. During the deployment of Session Hosts in Azure Virtual Desktop, if you choose to add VMs to Microsoft Entra ID you are able to Login with AD Credentials too.
### Take your first snapshot
First, [create the base VM](../virtual-machines/windows/quick-create-portal.md) for your chosen image. After you've deployed the image, take a snapshot of the disk of your image VM. Snapshots are save states that will let you roll back any changes if you run into problems while building the image. Since you'll be taking many snapshots throughout the build process, make sure to give the snapshot a name you can easily identify. 
### Customize your VM
Sign in to the VM and start customizing it with apps, updates, and other things you'll need for your image. If the VM needs to be domain-joined during customization, remove it from the domain before running sysprep. If you need to install many apps, we recommend you take multiple snapshots to revert your VM if a problem happens. 
Make sure you've done the following things before taking the final snapshot:
- Install the latest Windows updates.
- Complete any necessary cleanup, such as cleaning up temporary files, defragmenting disks, and removing unnecessary user profiles.
> [!NOTE]
> 1. If your machine will include an antivirus app, it may cause issues when you start sysprep. To avoid this, disable all antivirus programs before running sysprep.
> 
> 1. [Unified Write Filter](/windows-hardware/customize/enterprise/unified-write-filter) (UWF) is not supported for session hosts. Please ensure it is not enabled in your image.
> 
> 1. Do not join your golden image VM to a host pool, by deploying the Azure Virtual Desktop Agent. If you do this when you create additional session hosts from this image at a later time, they will fail to join the host pool as the Registration token will have expired. The host pool deployment process will automatically join the session hosts to the required host pool during the provisioning process.

### Take the final snapshot
When you are done installing your applications to the image VM, take a final snapshot of the disk. If sysprep or capture fails, you will be able to create a new base VM with your applications already installed from this snapshot. 
### Run sysprep
Some optional things you can do before running Sysprep:
- Reboot once
- Clean up temp files in system storage
- Optimize drivers (defrag)
- Remove any user profiles 
- Generalize the VM by running [sysprep](../virtual-machines/generalize.md)
 
## Capture the VM
After you've completed sysprep and shut down your machine in the Azure portal, open the **VM** tab and select the **Capture** button to save the image for later use. When you capture a VM, you can either add the image to a shared image gallery or capture it as a managed image.
The [Shared Image Gallery](../virtual-machines/shared-image-galleries.md) lets you add features and use existing images in other deployments. Images from a Shared Image Gallery are highly-available, ensure easy versioning, and you can deploy them at scale. However, if you have a simpler deployment, you may want to use a standalone managed image instead.
> [!IMPORTANT]
> We recommend using Azure Compute Gallery images for production environments because of their enhanced capabilities, such as replication and image versioning. 
When you create a capture, you'll need to delete the VM afterwards, as you'll no longer be able to use it after the capture process is finished. Don't try to capture the same VM twice, even if there's an issue with the capture. Instead, create a new VM from your latest snapshot, then run sysprep again.
Once you've finished the capture process, you can use your image to create your session hosts. To find the image, open the **Host pool** tab, choose **Gallery**, then select all images. Next, select **My items** and look for your managed images under **My images**. Your image definitions should appear under the shared items section.
## Other recommendations
Here are some extra things you should keep in mind when creating a golden image:
- Don't capture a VM that already exists in your host pools. The image will conflict with the existing VM's configuration, and the new VM won't work.
- Make sure to remove the VM from the domain before running sysprep. 
- Delete the base VM once you've captured the image from it. 
- After you've captured your image, don't use the same VM you captured again. Instead, create a new base VM from the last snapshot you created. You'll need to periodically update and patch this new VM on a regular basis.  
- Don't create a new base VM from an existing custom image. It is better to start with a brand-new source VM.
## Next steps
If you want to add a language pack to your image, see [Language packs](language-packs.md).
