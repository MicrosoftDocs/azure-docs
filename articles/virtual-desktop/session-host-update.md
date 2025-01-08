---
title: Session host update (preview) - Azure Virtual Desktop
description: Learn about session host update, which updates the operating system image and configuration of session hosts in a host pool in Azure Virtual Desktop.
ms.topic: conceptual
author: dknappettmsft
ms.author: daknappe
ms.date: 10/01/2024
---

# Session host update for Azure Virtual Desktop (preview)

> [!IMPORTANT]
> Session host update for Azure Virtual Desktop is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Session host update enables you to update the underlying virtual machine (VM) disk type, operating system (OS) image, and other configuration properties of all session hosts in a [host pool with a session host configuration](host-pool-management-approaches.md#session-host-configuration-management-approach). Session host update deallocates or deletes the existing virtual machines and creates new ones that are added to your host pool with the updated configuration. This method of updating session hosts aligns with the recommendation of managing updates within the core source image, rather than distributing and installing updates to each session host individually on an ongoing repeated schedule to keep them up to date.

Here are the changes you can make when performing an update:

- Virtual machine image
- [Virtual machine size](/azure/virtual-machines/sizes)
- [Virtual machine disk type](/azure/virtual-machines/disks-types)
- Virtual machine security type:
   - Standard
   - [Trusted launch virtual machines](security-guide.md#trusted-launch)
   - [Confidential virtual machines](security-guide.md#azure-confidential-computing-virtual-machines)
- Active Directory domain join credentials
- Microsoft Intune enrollment
- Local administrator credentials
- Run a custom configuration PowerShell script

After you complete an update of your session hosts using session host update, all session hosts in a host pool are standardized with the changes you specified. Other Azure properties of the session hosts, such as the availability configuration, network configuration, and location, are persisted across updates.

## Update process

You can specify the number of session hosts in a host pool to update concurrently, known as a *batch*. This value is the maximum number of session hosts that are unavailable at a time during the update and all remaining session hosts are available to use. When an update starts, only one session host is targeted (known as the *initial*) to test that the end-to-end update process is successful before moving on to updating the rest of the session hosts in the pool in batches. This approach minimizes the impact if a failure occurs.

Here's an example: if you have a host pool with 10 session hosts and you enter a batch size of three, a single session host (the initial) is updated, then the remaining session hosts are updated in three batches of three session hosts. At any point after the initial session host completes its update, there are a minimum of seven session hosts available for use in the host pool.

During an update, session host update follows this process:

1. Existing session hosts are selected based upon their name, and the size of the batch previously specified. A notification specified by the admin is sent out to any connected users, then the service waits the duration also specified earlier before signing out any remaining users.

1. The selected session hosts are placed into drain mode, then removed from the host pool. The computer account for session hosts joined to an Active Directory domain isn't deleted.

1. The same number of new session hosts are created using the updated session host configuration. The new Azure resources for the VM, OS disk, and network interface are in the format `SessionHostName-DateTime`, for example, an existing VM called `VM1-0` is replaced with a new VM called `VM1-0-2023-04-15T17-16-07`. The hostname of the operating system isn't changed. These new session hosts are joined to your directory using Azure VM extensions.

   Session hosts joined to an Active Directory domain inherit the existing AD computer objects. This process establishes the trust relationship and breaks the existing trust relationship with the previous VMs. 

1. The new session hosts are joined to the existing host pool and drain mode is disabled, and the session hosts can accept connections.

1. The original VMs are either deallocated or deleted, depending upon whether you chose to save the original VMs.

There can only be one session host update operation running or scheduled in a single host pool at a time. However, you can have session host update operations running on multiple host pools at the same time.

The existing power state and drain mode of session hosts is honored. You can perform an update on a host pool where all the session hosts are deallocated to save costs.

> [!IMPORTANT]
> - If you use Azure Virtual Desktop Insights, the Azure Monitor agent or Log Analytics agent isn't automatically installed on the updated session hosts. To install the agent automatically, here are some options:
>    - For the Azure Monitor agent, you can [use Azure Policy](/azure/azure-monitor/agents/azure-monitor-agent-policy).
>    - For the Log Analytics agent, you can [use Azure Automation](/azure/azure-monitor/agents/agent-windows?tabs=azure-automation#install-the-agent).
>
> - Keep in mind [quota limits](/azure/quotas/view-quotas) on your Azure subscription and consider [submitting a request to increase a quota](/azure/quotas/quickstart-increase-quota-portal) if an update would go over the limit.
>
> - We recommend that you test the update process on a test host pool aligned to the host pool you want to update. This will test the update process itself and also the result of a new VM with the same name as the previous VM within your environment. It's also important to test that any updates, such as new applications or hotfixes, work as expected within your environment before updating a production host pool.

## Virtual machines and management tools

The new image must be [supported for Azure Virtual Desktop](prerequisites.md#operating-systems-and-licenses) and the [generation of virtual machine](/azure/virtual-machines/generation-2), and can be from:

- Azure Marketplace.

- An existing Azure Compute Gallery shared image.

- An existing managed image.

As session host update creates new virtual machines, it needs to join them to a directory. You must use the same directory as the existing VMs. You can't change the directory during an update.

Any customizations, such as files, registry keys, or certificates that were added manually to session hosts, aren't present after the update is complete. You can't update session hosts in the pool individually, so you should either add these customizations into the image itself, ensure the customizations are applied by configuration management tools such as Intune or Group Policy, or add these customizations to the custom configuration PowerShell script in the session host configuration.

During an update with session hosts joined to Active Directory, computer objects aren't deleted. This means that there are temporarily orphaned computer objects within Active Directory. When the new virtual machine is joined to the domain, it uses the original host name and inherits the orphaned computer object. If you change the domain, you need to remove the orphaned computer objects from the previous domain.

Group Policy objects (GPOs) are used to apply policy to session hosts and are typically applied at the OU level in the Active Directory domain. However, there might be some application/filtering done using computer objects or group objects. As the new VMs inherit the orphaned computer objects, existing GPOs still apply. You should ensure that existing GPOs still apply if you change the OU membership as part of the update process. 

## Scheduling and user sessions

If there are users signed in to a session host when it starts to update, they receive the notification specified by an administrator, which should inform users to sign out, then sign in again. Users can immediately sign in again to be connected to another session host in the host pool.

New connections are directed to session hosts that are updated to avoid them signing in to a session host that will be updated imminently, only for them to be notified to sign out again. However, at the beginning of an update there aren't any newly updated session hosts, so users who were asked to sign out and recently signed in to session hosts yet to be updated are notified to sign out again.

With only a reduced number of session hosts available, you should schedule an update at an appropriate time for your business to minimize disruption to end users.

## Known issues and limitations

Here are known issues and limitations:

- Session host update is only available in the global Azure cloud. It isn't available in other clouds, such as Azure US Government or Azure operated by 21Vianet.

- For session hosts that were created from an Azure Compute Gallery shared image that has a purchase plan, the plan isn't retained when the session hosts are updated. To check whether the image you use for your session hosts has a purchase plan, you can use [Azure PowerShell](/azure/virtual-machines/windows/cli-ps-findimage) or [Azure CLI](/azure/virtual-machines/linux/cli-ps-findimage).

- Session host update currently requires access to the public Azure Storage endpoint `wvdhpustgr0prod.blob.core.windows.net` to deploy the RDAgent. Until this is migrated to a [required endpoint for Azure Virtual Desktop](/azure/virtual-desktop/required-fqdn-endpoint), session hosts that can't access `wvdhpustgr0prod.blob.core.windows.net` fail to be updated with the error `CustomerVmNoAccessToDeploymentPackageException`.

- The size of the OS disk can't be changed during an update. The update service defaults to the same size as defined by the gallery image.

- If an update fails, the host pool can't be deleted until the update is canceled.

- The update progress only changes when a session host has updated. As an example, in a host pool with 10 session hosts, while the first session host is being updated the progress shows as **0.00%**. This only moves to **10%** once the first session host has updated.

- If you decide to create an image that is taken from an existing session host that you then use as the source image for your session host update, you need to delete the `C:\packages\plugin` folder before creating the image. Otherwise this folder prevents the DSC extension that joins the updated virtual machines to the host pool from running.

- If you use Azure Virtual Desktop Insights, the Azure Monitor agent or Log Analytics agent isn't automatically installed on the updated session hosts. To install the agent automatically, here are some options:
   - For the Azure Monitor agent, you can [use Azure Policy](/azure/azure-monitor/agents/azure-monitor-agent-policy).
   - For the Log Analytics agent, you can [use Azure Automation](/azure/azure-monitor/agents/agent-windows?tabs=azure-automation#install-the-agent).
   - Manually add these new session hosts from within [Azure Virtual Desktop Insights](insights.md) in the Azure portal.

- Modifying a session host configuration in a host pool with no session hosts at the same time a session host is being created can result in a host pool with inconsistent session host properties and should be avoided.

- Updates with large batch sizes can result in intermittent failures with the error code `AgentRegistrationFailureGeneric`. If this occurs for a subset of session hosts being updated, [retrying the update](session-host-update-configure.md#pause-resume-cancel-or-retry-an-update) typically resolves the issue.

## Next steps

- Learn how to [update session hosts in a host pool with a session host configuration using session host update](session-host-update-configure.md).
