---
title: Install Arc agent at scale for your VMware VMs
description: Learn how to enable guest management at scale for Arc enabled VMware vSphere VMs. 
ms.topic: how-to
ms.date: 04/23/2024
ms.service: azure-arc
ms.subservice: azure-arc-vmware-vsphere
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri

#Customer intent: As an IT infra admin, I want to install arc agents to use Azure management services for VMware VMs.
---

# Install Arc agents at scale for your VMware VMs

In this article, you learn how to install Arc agents at scale for VMware VMs and use Azure management capabilities.

## Prerequisites

Ensure the following before you install Arc agents at scale for VMware VMs:

- The resource bridge must be in running state.
- The vCenter must be in connected state.
- The user account must have permissions listed in Azure Arc VMware Administrator role.
- All the target machines are:
    - Powered on and the resource bridge has network connectivity to the host running the VM.
    - Running a [supported operating system](../servers/prerequisites.md#supported-operating-systems).
    - VMware tools are installed on the machines. If VMware tools aren't installed, enable guest management operation is grayed out in the portal.  
        >[!Note]
        >You can use the [out-of-band method](./enable-guest-management-at-scale.md#approach-d-install-arc-agents-at-scale-using-out-of-band-approach) to install Arc agents if VMware tools aren't installed.  
    - Able to connect through the firewall to communicate over the internet, and [these URLs](../servers/network-requirements.md#urls) aren't blocked.

   > [!NOTE]
   > If you're using a Linux VM, the account must not prompt for login on sudo commands. To override the prompt, from a terminal, run `sudo visudo`, and add `<username> ALL=(ALL) NOPASSWD:ALL` at the end of the file. Ensure you replace `<username>`. <br> <br>If your VM template has these changes incorporated, you won't need to do this for the VM created from that template.

## Approach A: Install Arc agents at scale from portal

An admin can install agents for multiple machines from the Azure portal if the machines share the same administrator credentials.

1. Navigate to **Azure Arc center** and select **vCenter resource**.

2. Select all the machines and choose **Enable in Azure** option. 

3. Select **Enable guest management** checkbox to install Arc agents on the selected machine.

4. If you want to connect the Arc agent via proxy, provide the proxy server details.

5. If you want to connect Arc agent via private endpoint, follow these [steps](../servers/private-link-security.md) to set up Azure private link. 

      >[!Note]
      > Private endpoint connectivity is only available for Arc agent to Azure communications. For Arc resource bridge to Azure connectivity, Azure private link isn't supported.

6. Provide the administrator username and password for the machine. 

> [!NOTE]
> For Windows VMs, the account must be part of local administrator group; and for Linux VM, it must be a root account.

## Approach B: Install Arc agents using AzCLI commands

The following Azure CLI commands can be used to install Arc agents.  

```azurecli
az connectedvmware vm guest-agent enable --password 

                                         --resource-group 

                                         --username 

                                         --vm-name 

                                         [--https-proxy] 

                                         [--no-wait]
```

## Approach C: Install Arc agents at scale using helper script

Arc agent installation can be automated using the helper script built using the AzCLI command provided [here](./enable-guest-management-at-scale.md#approach-b-install-arc-agents-using-azcli-commands). Download this [helper script](https://aka.ms/arcvmwarebatchenable) to enable VMs and install Arc agents at scale. In a single ARM deployment, the helper script can enable and install Arc agents on 200 VMs.  

### Features of the script

- Creates a log file (vmware-batch.log) for tracking its operations.

- Generates a list of Azure portal links to all the deployments created `(all-deployments-<timestamp>.txt)`. 

- Creates ARM deployment files `(vmw-dep-<timestamp>-<batch>.json)`.

- Can enable up to 200 VMs in a single ARM deployment if guest management is enabled, else enables 400 VMs. 

- Supports running as a cron job to enable all the VMs in a vCenter. 

- Allows for service principal authentication to Azure for automation. 

Before running this script, install az cli and the `connectedvmware` extension. 

### Prerequisites 

Before running this script, install: 

- Azure CLI from [here](/cli/azure/install-azure-cli).

- The `connectedvmware` extension for Azure CLI: Install it by running `az extension add --name connectedvmware`. 

### Usage 

1. Download the script to your local machine. 

2. Open a PowerShell terminal and navigate to the directory containing the script. 

3. Run the following command to allow the script to run, as it's an unsigned script (if you close the session before you complete all the steps, run this command again for the new session): `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`.

4. Run the script with the required parameters. For example, `.\arcvmware-batch-enablement.ps1 -VCenterId "<vCenterId>" -EnableGuestManagement -VMCountPerDeployment 3 -DryRun`. Replace `<vCenterId>` with the ARM ID of your vCenter. 

### Parameters

- `VCenterId`: The ARM ID of the vCenter where the VMs are located. 

- `EnableGuestManagement`: If this switch is specified, the script will enable guest management on the VMs. 

- `VMCountPerDeployment`: The number of VMs to enable per ARM deployment. The maximum value is 200 if guest management is enabled, else it's 400. 

- `DryRun`: If this switch is specified, the script will only create the ARM deployment files. Else, the script will also deploy the ARM deployments. 

### Running as a Cron Job 

You can set up this script to run as a cron job using the Windows Task Scheduler. Here's a sample script to create a scheduled task: 

```azurecli
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-File "C:\Path\To\vmware-batch-enable.ps1" -VCenterId "<vCenterId>" -EnableGuestManagement -VMCountPerDeployment 3 -DryRun' 
$trigger = New-ScheduledTaskTrigger -Daily -At 3am 
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "EnableVMs" 
```

Replace `<vCenterId>` with the ARM ID of your vCenter. 

To unregister the task, run the following command: 

```azurecli
Unregister-ScheduledTask -TaskName "EnableVMs"
```

## Approach D: Install Arc agents at scale using out-of-band approach 

Arc agents can be installed directly on machines without relying on VMware tools or APIs. By following the out-of-band approach, first onboard the machines as Arc-enabled Server resources with Resource type as Microsoft.HybridCompute/machines. After that, perform **Link to vCenter** operation to update the machine's Kind property as VMware, enabling virtual lifecycle operations.  

1. **Connect the machines as Arc-enabled Server resources:** Install Arc agents using Arc-enabled Server scripts. 

    You can use any of the following automation approaches to install Arc agents at scale:

   - [Install Arc agents at scale using a Service Principal](../servers/onboard-service-principal.md).
   - [Install Arc agents at scale using Configuration Manager script](../servers/onboard-configuration-manager-powershell.md).
   - [Install Arc agents at scale with a Configuration Manager custom task sequence](../servers/onboard-configuration-manager-custom-task.md).
   - [Install Arc agents at scale using Group policy](../servers/onboard-group-policy-powershell.md).
   - [Install Arc agents at scale using Ansible playbook](../servers/onboard-ansible-playbooks.md).

2. **Link Arc-enabled Server resources to the vCenter:** The following commands will update the Kind property of Hybrid Compute machines as **VMware**. Linking the machines to vCenter will enable virtual lifecycle operations and power cycle operations (start, stop, etc.) on the machines.  

   - The following command scans all the Arc for Server machines that belong to the vCenter in the specified subscription and links the machines with that vCenter. 

     ```azurecli
     az connectedvmware vm create-from-machines --subscription contoso-sub --vcenter-id /subscriptions/fedcba98-7654-3210-0123-456789abcdef/resourceGroups/contoso-rg-2/providers/Microsoft.HybridCompute/vcenters/contoso-vcenter
     ```

   - The following command scans all the Arc for Server machines that belong to the vCenter in the specified Resource Group and links the machines with that vCenter. 

     ```azurecli
     az connectedvmware vm create-from-machines --resource-group contoso-rg --vcenter-id /subscriptions/fedcba98-7654-3210-0123-456789abcdef/resourceGroups/contoso-rg-2/providers/Microsoft.HybridCompute/vcenters/contoso-vcenter.
     ```

   - The following command can be used to link an individual Arc for Server resource to vCenter. 

     ```azurecli
     az connectedvmware vm create-from-machines --resource-group contoso-rg --name contoso-vm --vcenter-id /subscriptions/fedcba98-7654-3210-0123-456789abcdef/resourceGroups/contoso-rg-2/providers/Microsoft.HybridCompute/vcenters/contoso-vcenter
     ```

## Next steps

[Set up and manage self-service access to VMware resources through Azure RBAC](setup-and-manage-self-service-access.md).
