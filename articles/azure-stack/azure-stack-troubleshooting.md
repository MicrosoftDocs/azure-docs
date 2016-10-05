<properties
	pageTitle="Microsoft Azure Stack troubleshooting | Microsoft Azure"
	description="Azure Stack troubleshooting."
	services="azure-stack"
	documentationCenter=""
	authors="heathl17"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/04/2016"
	ms.author="helaw"/>

# Microsoft Azure Stack troubleshooting

If you experience issues while deploying or using Microsoft Azure Stack, refer to the following guidance. But first, make sure that your deployment environment complies with all [requirements](azure-stack-deploy.md) and [preparations](azure-stack-run-powershell-script.md). In particular, make sure you comply with the storage configuration requirements and this note:

>[AZURE.IMPORTANT] Only one NIC is allowed during the deployment process. If you want to use a specific NIC, you must disable all the others.

The recommendations for troubleshooting issues that are described in this section are derived from several sources and may or may not resolve your particular issue. Code examples are provided as is and expected results cannot be guaranteed. This section is not comprehensive of all troubleshooting issues for Microsoft Azure Stack, and it is subject to frequent edits and updates as improvements to the product are implemented.

## Known Issues

 - You may see the following non-terminating errors during deployment, which will not affect deployment success:
     - “The term 'C:\WinRM\Start-Logging.ps1' is not recognized”
     - “Invoke-EceAction: Cannot index into a null array” 
	 - “InvokeEceAction: Cannot bind argument to parameter 'Message' because it is an empty string.”
 - You may see deployment fail at step 60.61.93 with an error "Application with identifier 'URI' not found”. This is due to the way applications are registered in Azure Active Directory.  If you receive this error, continue to [rerun the installation script](azure-stack-rerun-deploy.md) from step 60.61.93 until deployment is complete.
 - You will see that the **Availability Set** resource in the Marketplace shows up under the **virtualMachine-ARM** category – this appearance is only a cosmetic issue.
 - When creating a new virtual machine in the portal, in the **Basics** step, the storage option defaults to SSD.  This setting must be changed to HDD or on the **Size** step of VM deployment, you will not see VM sizes available to select and continue deployment. 
 - You will see AzureRM PowerShell modules are no longer installed by default on the MAS-CON01 VM (in TP1 this was named ClientVM). This behavior is by design, because there is an alternate method to [install these modules and connect](azure-stack-connect-powershell.md).  
 - You will see that the **Microsoft.Insights** resource provider is not automatically registered for tenant subscriptions. If you would like to see monitoring data for a VM deployed as a tenant, run the following command from PowerShell (after you [install and connect](azure-stack-connect-powershell.md) as a tenant): 
       
	    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Insights 

 - You will see export functionality in the portal for Resource Groups, however no text is displayed and available for export.      
 - You can start a deployment of storage resources larger than available quota.  This deployment will fail and the account resources will be suspended.  There are two remediation options available:
     - Service Administrator can increase the quota, though changes will not take effect immediately and commonly take up to an hour to propagate.
     - Service Administrator can create an add-on plan with additional quota that the tenant can then add to the subscription.
 - When using the portal to create VMs on Azure Stack environments with identity in ‘Azure - China’, you will not see VM sizes available to select in the **Size** step of VM deployment and will be unable to continue deployment.
 - You may see a deployment failure in the portal, when the VM has actually deployed successfully.
 - When you delete a plan, offer, or subscription, VMs may not be deleted.
 - You will see the VM extensions in the marketplace.
 - You cannot deploy a VM from a saved VM image.
 - Tenants may see services which are not included in their subscription.  When tenants attempt to deploy these resources, they will receive an error.  Example:  Tenant subscription only includes storage resources.  Tenant will see option to create other resources like VMs.  In this scenario, when a tenant attempts to deploy a VM, they will receive a message indicating the VM can’t be created. 
 - When installing TP2, you should not activate the host OS in the VHD provided where you run the Azure Stack setup script, or you may receive an error messaging stating Windows will expire soon.


## Deployment

### Deployment failure
If you experience a failure during installation, the Azure Stack installer allows you to continue a failed installation by following the [rerun deployment steps](azure-stack-rerun-deploy.md).

### At the end of the deployment, the PowerShell session is still open and doesn’t show any output

This is probably just the result of the default behavior of a PowerShell command window, when it has been selected. The POC deployment had actually succeeded but the script was paused when selecting the window. Please press the ESC key to unselect it, and the completion message should be shown after it.

## Templates

### Azure template won't deploy to Azure Stack

Make sure that:

- The template must be using a Microsoft Azure service that is already available or in preview in Azure Stack.
- The APIs used for a specific resource are supported by the local Azure Stack instance, and that you are targeting a valid location (“local” in Azure Stack Technical Preview (TP) 2, vs the “East US” or “South India” in Azure).
- You review [this article](https://github.com/Azure/AzureStack-QuickStart-Templates/blob/master/README.md) about the Test-AzureRmResourceGroupDeployment cmdlets, which catch small differences in Azure Resource Manager syntax.

You can also use the Azure Stack templates already provided in the [GitHub repository](http://aka.ms/AzureStackGitHub/) to help you get started.

## Virtual machines

### After starting my Microsoft Azure Stack POC host, all my tenants VMs are gone from Hyper-V Manager, and come back automatically after waiting a bit?

As the system comes back up the storage subsystem and RPs need to determine consistency. The time needed depends on the hardware and specs being used, but it may be some time after a reboot of the host for tenant VMs to come back and be recognized.

### I have deleted some virtual machines, but still see the VHD files on disk. Is this expected?

Yes, this is expected. It was designed this way because:

- When you delete a VM, VHDs are not deleted. Disks are separate resources in the resource group.
- When a storage account gets deleted, the deletion is visible immediately through Azure Resource Manager (portal, PowerShell) but the disks it may contain are still kept in storage until garbage collection runs.

If you see "orphan" VHDs, it is important to know if they are part of the folder for a storage account that was deleted. If the storage account was not deleted, it's normal they are still there.

You can read more about configuring the retention threshold in [manage storage accounts](azure-stack-manage-storage-accounts.md).

## Installation steps
The following information about Azure Stack installation steps may be useful for troubleshooting purposes:  

| Index | Name | Description|
| ----- | ----- | -----|
|0.11 | (DEP) Validate Physical Machines | Validating the hardware and OS configuration on the physical nodes. |
| 0.12 | (DEP) Configure Physical Machines networking for POC | Configuring virtual network switches and interfaces. |
| 0.14 | (DEP) Deploy Domain | Deploy Active Directory on Virtual Machine. |
| 0.15 | (DEP) Configure the Domain server | Configure domain server with security groups etc. |
| 0.16 | (DEP) Configure Physical Machine | Configure networking, join domain, and setup local admins. |
| 0.18 | (STO) Configure Storage Cluster | Create storage cluster, create a storage pool and file server. |
| 0.19 | (CPI) Setup fabric infrastructure | Set up the prerequisites for fabric deployment. |
| 0.21 | (NET) Setup BGP and NAT | Installs BGP and NAT - needed only for One Node. |
| 0.22 | (NET) Configure NAT and Time Server | Syncs the time server and configures NAT entries. |
| 40.41 | (CPI) Create guest VMs | Create the management VMs. |
| 40.42 | (FBI) Set up PowerShell JEA | Setup PowerShell JEA for all roles. |
| 40.43 | (FBI) Set up Azure Stack Certification Authority | Installs Azure Stack Certification Authority. |
| 40.44 | (FBI) Configure Azure Stack Certification Authority | Configures Azure Stack Certification Authority. |
| 40.45 | (NET) Set up NC on VMs | Installs NC on the guest VMs |
| 40.46 | (NET) Configure NC on VMs | Configure NC on the guest VMs |
| 40.47 | (NET) Configure guest VMs | Configure the management VMs with NC ACLs. |
| 60.61.81 | (FBI) Deploy Azure Stack Fabric Ring Services - FabricRing PreRequisite | Creates VIPs for FabricRing |
| 60.61.82 | (FBI) Deploy Azure Stack Fabric Ring Services - Deploy Fabric Ring Cluster | Installs and configures Azure Stack Fabric Ring Cluster. |
| 60.61.83 | (FBI) Deploy Admin Extensions for Resource providers | Installing Admin Extensions for resource providers |
| 60.61.84 | (ACS) Set up Azure-consistent Storage in node level. | Installs and configures Azure-consistent Storage in node level. |
| 60.61.85 | (ACS) Set up Azure-consistent Storage in cluster level. | Installs and configures Azure-consistent Storage in cluster level. |
| 60.61.86 | (FBI) Deploy Azure Stack Fabric Ring Controller Services - Prerequisite | Prerequisites for InfraServiceController |
| 60.61.87 | (FBI) Deploy Azure Stack Fabric Ring Controller Services - Prerequisite | Prerequisites for CPI |
| 60.61.88 | (FBI) Deploy Azure Stack Fabric Ring Controller Services - Prerequisite | Prerequisites for ASAppGateway |
| 60.61.89 | (FBI) Deploy Azure Stack Fabric Ring Controller Services - Prerequisite | Prerequisites for Storage Controller |
| 60.61.90 | (FBI) Deploy Azure Stack Fabric Ring Controller Services - Prerequisite | Prerequisites for HealthMonitoring |
| 60.61.91 | (FBI) Deploy Azure Stack Fabric Ring Controller Services - Prerequisite | Prerequisites for ECE |
| 60.61.92 | (FBI) Deploy Azure Stack Fabric Ring Controller Services - Prerequisite | Prerequisites for PMM |
| 60.61.93 | (Katal) Create AzureStack Service Principals | Create Azure Graph Applications and Service Principals in AAD. |
| 60.61.94 | (NET) Setup GW VMs | Installs GW on the guest VMs. |
| 60.61.95 | (NET) Configure GW VMs | Configures GW on the guest VMs. |
| 60.61.96 | (NET) Deploy iDNS on hosts | Deploy iDNS on infrastructure hosts |
| 60.61.97 | (NET) Configure iDNS | Configure iDNS role |
| 60.61.98 | (FBI) Setup WSUS VMs | Installs WSUS server on the guest VMs. |
| 60.61.99 | (FBI) Configure WSUS VMs | Configures WSUS server on the guest VMs. |
| 60.61.100 | (FBI) Setup Azure SQL VMs | Installs Azure SQL server on the guest VMs |
| 60.61.101 | (Katal) Setup prerequisites for WAS VMs. | Sets up the prerequisites for Microsoft Azure Stack on the guest VMs. |
| 60.61.102 | (Katal) Setup WAS VMs | Installs Microsoft Azure Stack on the guest VMs. |
| 60.120.121 | (FBI) Deploy Resource providers and Controllers | Installs Resource providers and Controllers |
| 60.120.121 | (FBI) Deploy Resource providers and Controllers | Installs Resource providers and Controllers |
| 60.120.121 | (FBI) Deploy Resource providers and Controllers | Installs Resource providers and Controllers |
| 60.120.121 | (FBI) Deploy Resource providers and Controllers | Installs Resource providers and Controllers |
| 60.120.121 | (FBI) Deploy Resource providers and Controllers | Installs Resource providers and Controllers |
| 60.120.121 | (FBI) Deploy Resource providers and Controllers | Installs Resource providers and Controllers |
| 60.120.121 | (FBI) Deploy Resource providers and Controllers | Installs Resource providers and Controllers |
| 60.120.121 | (FBI) Deploy Resource providers and Controllers | Installs Resource providers and Controllers |
| 60.120.122 | (FBI) Controller Configuration | Configures Controllers |
| 60.120.123 | (Katal) Configure WAS VMs | Configures Microsoft Azure Stack on the guest VMs. |
| 60.120.124 | (Katal) Azure Stack AAD Configuration. | Configures Azure Stack with Azure AD. |
| 60.120.125 | (Katal) Install ADFS | Installs Active Directory Federation Services (ADFS) |
| 60.120.126 | (Katal) Install ADFS/Graph | Installs Azure Stack Graph |
| 60.120.127 | (Katal) Configure ADFS | Configures Active Directory Federation Services (ADFS) |
| 60.140.141 | (FBI) Configure SRP | Configures Storage Resource Provider |
| 60.140.142 | (ACS) Configure Azure-consistent Storage. | Configures Azure-consistent Storage. |
| 60.140.143 | (FBI) Create Storage Accounts | Create all storage accounts to be used by different providers. |
| 60.140.144 | (FBI) Register Usage for SRP | Register Usage for Storage Provider. |
| 60.140.145 | (CPI) Migrate Created VMs, Hosts, and Cluster to CPI | Migrates objects of the created VMs, Hosts, and Cluster to CPI |
| 60.140.146 | (FBI) Configure Windows Defender | Configures Windows Defender |
| 60.160.161 | (MON) Configure Monitoring Agent | Configures Monitoring Agent |
| 60.160.162 | (FBI) NRP Prerequisite | Installs NRP prerequisites |
| 60.160.163 | (FBI) NRP Deployment | Installs NRP  |
| 60.160.164 | (FBI) NRP Configuration | Configures NRP |
| 60.160.165 | (FBI) CRP Prerequisite | Installs CRP prerequisites |
| 60.160.166 | (FBI) CRP Deployment | Installs CRP |
| 60.160.167 | (FBI) CRP Configuration | Configures CRP |
| 60.160.168 | (FBI) FRP Prerequisite | Installs FRP prerequisites |
| 60.160.169 | (FBI) FRP Deployment | Installs FRP  |
| 60.160.170 | (FBI) FRP Configuration | Configures FRP |
| 60.160.174 | (FBI) URP Prerequisite | Installs URP prerequisites |
| 60.160.175 | (FBI) URP Deployment | Installs URP  |
| 60.160.176 | (FBI) URP Configuration | Configures URP |
| 60.160.171 | (FBI) HRP Prerequisite | Installs HRP prerequisites |
| 60.160.172 | (FBI) HRP Deployment | Installs HRP  |
| 60.160.173 | (FBI) HRP Configuration | Configures HRP |
| 60.160.177 | (KV) KeyVault Prerequisite | Installs KeyVault prerequisites |
| 60.160.178 | (KV) KeyVault Deployment | Installs KeyVault  |
| 60.160.179 | (KV) KeyVault Configuration | Configures KeyVault | 
| 60.190.191 | (FBI) Configure Gallery | Configure Gallery |
| 60.190.192 | (FBI) Configure Fabric Ring Services | Configure Fabric Ring Services |
| 60.221 | (FBI) Setup Console VMs | Installs Console server on the guest VMs. |
| 60.222 | (FBI) Setup Console VMs | Move DVM Contents to the Console VM. |
| 251 | Prepare for future host reboots | Set reboot policy |


## Next steps

[Frequently asked questions](azure-stack-FAQ.md)
