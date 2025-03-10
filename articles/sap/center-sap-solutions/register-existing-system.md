---
title: Register existing SAP system 
description: Learn how to register an existing SAP system in Azure Center for SAP solutions through the Azure portal. You can visualize, manage, and monitor your existing SAP system through Azure Center for SAP solutions.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 02/03/2023
ms.author: kanamudu
author: kalyaninamuduri
#Customer intent: As a developer, I want to register my existing SAP system so that I can use the system with Azure Center for SAP solutions.
---

# Register existing SAP system
In this how-to guide, you learn how to register an existing SAP system with *Azure Center for SAP solutions*. After you register an SAP system with Azure Center for SAP solutions, you can use its visualization, management, and monitoring capabilities through the Azure portal. For example, you can:

- View and track the SAP system as an Azure resource, called the *Virtual Instance for SAP solutions (VIS)*.
- Get recommendations for your SAP infrastructure, Operating System configurations etc. based on quality checks that evaluate best practices for SAP on Azure.
- Get health and status information about your SAP system.
- Start and Stop SAP application tier.
- Start and Stop individual instances of ASCS, App server, and HANA Database.
- Monitor the Azure infrastructure metrics for the SAP system resources.
- View Cost Analysis for the SAP system.

When you register a system with Azure Center for SAP solutions, the following resources are created in your Subscription:
- Virtual Instance for SAP solutions, Central service instance for SAP solutions, App server instance for SAP solutions and Database for SAP solutions. These resource types are created to represent the SAP system on Azure. These resources don't have any billing or cost associated with them.
- A managed resource group that is used by Azure Center for SAP solutions service.
- A Storage account within the managed resource group that contains blobs. These blobs are scripts and logs necessary for the service to provide various capabilities that include discovering and registering all components of SAP system.

> [!NOTE]
> You can customize the names of the **Managed resource group** and the **Storage account** which get deployed as part of the registration process by using **Azure portal**, [Azure PowerShell](quickstart-register-system-powershell.md) or [Azure CLI](quickstart-register-system-cli.md) interfaces, when you register your systems.

> [!NOTE]
> You can now enable **secure access** from specific virtual networks to the ACSS **managed storage account** using the [new option in the registration experience](#managed-storage-account-network-access-settings).

## Prerequisites

### Azure infrastructure level prerequisites

- Check that you're trying to register a [supported SAP system configuration](#supported-systems)
- Grant access to Azure Storage accounts, Azure Resource Manager and Microsoft Entra services from the virtual network where the SAP system exists. Use one of these options:
    - Allow outbound internet connectivity for the VMs.
    - Use a [**Service tags**](../../virtual-network/service-tags-overview.md) to allow connectivity
    - Use a [Service tags with regional scope](../../virtual-network/service-tags-overview.md) to allow connectivity to resources in the same region as the VMs.
    - Allowlist the region-specific IP addresses for Azure Storage, Azure Resource Manager, and Microsoft Entra ID.
- ACSS deploys a **managed storage account** into your subscription, for each SAP system being registered. You have the option to choose [**network access**](#managed-storage-account-network-access-settings) setting for the storage account.
    - If you choose network access from specific Virtual Networks option, then you need to make sure **Microsoft.Storage** service endpoint is enabled on all subnets in which the SAP system Virtual Machines exist. This service endpoint is used to enable access from the SAP virtual machine to the managed storage account, to access the scripts that ACSS runs on the VM extension.
    - If you choose public network access option, then you need to grant access to Azure Storage accounts from the virtual network where the SAP system exists. 
- Register the **Microsoft.Workloads** Resource Provider in the subscription where you have the SAP system.
- Check that your Azure account has **Azure Center for SAP solutions administrator** and **Managed Identity Operator** or equivalent role access on the subscription or resource groups where you have the SAP system resources.
- A **User-assigned managed identity** which has **Azure Center for SAP solutions service role** access on the Compute resource group and **Reader** role access on the Virtual Network resource group of the SAP system. Azure Center for SAP solutions service uses this identity to discover your SAP system resources and register the system as a VIS resource.
- Make sure ASCS, Application Server and Database virtual machines of the SAP system are in **Running** state.\

### SAP system level prerequisites

- sapcontrol and saphostctrl exe files must exist on ASCS, App server and Database.
    - File path on Linux VMs: /usr/sap/hostctrl/exe
    - File path on Windows VMs: C:\Program Files\SAP\hostctrl\exe\
- Make sure the **sapstartsrv** process is running on all **SAP instances** and for **SAP hostctrl agent** on all the VMs in the SAP system.
    - To start hostctrl sapstartsrv, use this command for Linux VMs: 'hostexecstart -start'
    - To start instance sapstartsrv, use the command: 'sapcontrol -nr 'instanceNr' -function StartService S0S'
    - To check status of hostctrl sapstartsrv use this command for Windows VMs: C:\Program Files\SAP\hostctrl\exe\saphostexec –status
- For successful discovery and registration of the SAP system, ensure there's network connectivity between ASCS, App, and DB VMs. 'ping' command for App instance hostname must be successful from ASCS VM. 'ping' for Database hostname must be successful from App server VM.
- On App server profile, SAPDBHOST, DBTYPE, DBID parameters must have the right values configured for the discovery and registration of Database instance details.

## Supported systems

You can register SAP systems with Azure Center for SAP solutions that run on the following configurations:

- SAP NetWeaver or ABAP stacks
- Windows, SUSE and RHEL Linux operating systems
- HANA, DB2, SQL Server, Oracle, Max DB, and SAP ASE databases
- SAP system with multiple Application Server Instances on a single Virtual Machine
- SAP system with [clustered Application Server architecture](../workloads/high-availability-guide-rhel-with-dialog-instance.md)

The following SAP system configurations aren't supported in Azure Center for SAP solutions:

- HANA Large Instance (HLI)
- Systems with HANA Scale-out, MCOS and MCOD configurations
- Java stack
- Dual stack (ABAP and Java)
- Systems distributed across peered virtual networks
- Systems using IPv6 addresses
- Multiple SIDs running on same set of Virtual Machines. For example, two or more SIDs sharing a single VM for ASCS instance. 

## Enable resource permissions

When you register an existing SAP system as a VIS, Azure Center for SAP solutions service needs a **User-assigned managed identity** that has **Azure Center for SAP solutions service role** access on the Compute (VMs, Disks, Load balancers) resource group and **Reader** role access on the Virtual Network resource group of the SAP system. Before you register an SAP system with Azure Center for SAP solutions, either [create a new user-assigned managed identity or update role access for an existing managed identity](#setup-user-assigned-managed-identity).

Azure Center for SAP solutions uses this user-assigned managed identity to install VM extensions on the ASCS, Application Server and DB VMs. This step allows Azure Center for SAP solutions to discover the SAP system components, and other SAP system metadata. User-assigned managed identity is required to enable SAP system monitoring and management capabilities.

### Setup User-assigned managed identity

To provide permissions to the SAP system resources to a user-assigned managed identity:

1. [Create a new user-assigned managed identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#create-a-user-assigned-managed-identity) if needed or use an existing one.
1. [Assign **Azure Center for SAP solutions service role**](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#manage-access-to-user-assigned-managed-identities) role access to the user-assigned managed identity on the resource group(s) that have the Virtual Machines, Disks and Load Balancers of the SAP system and **Reader** role on the resource group(s) which have the Virtual Network components of the SAP system.
1. Once the permissions are assigned, this managed identity can be used in Azure Center for SAP solutions to register and manage SAP systems.

## Managed storage account network access settings
ACSS deploys a **managed storage account** into your subscription, for each SAP system being registered. When you register your SAP system using Azure portal, PowerShell, or REST API, you have the option to choose **network access** setting for the storage account. You can choose either public network access or access from specific virtual networks. 

To secure the managed storage account and limit access to only the virtual network that has your SAP virtual machines, you can choose the network access setting as **Enable access from specific Virtual Networks**. You can learn more about storage account network security in [this documentation](../../storage/common/storage-network-security.md). 

> [!IMPORTANT]
> When you limit storage account network access to specific virtual networks, you have to configure Microsoft.Storage [service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md) on all subnets related to the SAP system that you're registering. Without the service endpoint enabled, you won't be able to successfully register the system. Private endpoint on managed storage account isn't currently supported in this scenario. 

When you choose to limit network access to specific virtual networks, Azure Center for SAP solutions service accesses this storage account using [**trusted access**](../../storage/common/storage-network-security.md?tabs=azure-portal#grant-access-to-trusted-azure-services) based on the managed identity associated with the VIS resource.

## Register SAP system

To register an existing SAP system in Azure Center for SAP solutions:

1. Sign in to the [Azure portal](https://portal.azure.com). Make sure to sign in with an Azure account that has **Azure Center for SAP solutions administrator** and **Managed Identity Operator** role access to the subscription or resource groups where the SAP system exists. For more information, see the [resource permissions explanation](#enable-resource-permissions).
1. Search for and select **Azure Center for SAP solutions** in the Azure portal's search bar.
1. On the **Azure Center for SAP solutions** page, select **Register an existing SAP system**.

    :::image type="content" source="media/register-existing-system/register-button.png" alt-text="Screenshot of Azure Center for SAP solutions service overview page in the Azure portal, showing button to register an existing SAP system." lightbox="media/register-existing-system/register-button.png":::

1. On the **Basics** tab of the **Register existing SAP system** page, provide information about the SAP system.
    1. For **ASCS virtual machine**, select **Select ASCS virtual machine** and select the ASCS VM resource.
    1. For **SID name**, enter the SID name.
    1. For **SAP product**, select the SAP system product from the drop-down menu.
    1. For **Environment**, select the environment type from the drop-down menu. For example, production or non-production environments.
    1. For **Managed identity source**, select **Use existing user-assigned managed identity** option.
    1. For **Managed identity name**, select a **User-assigned managed identity** which has **Azure Center for SAP solutions service role** and **Reader** role access to the [respective resources of this SAP system.](#enable-resource-permissions)
    1. For **Managed resource group name**, optionally enter a resource group name as per your organization's naming policies. This resource group is managed by ACSS service.
    1. For **Managed storage account name**, optionally enter a storage account name as per your organization's naming policies. This storage account is managed by ACSS service.
    1. For **Storage account network access**, select **Enable access from specific virtual network** for enhanced network security access for the managed storage account. 
    1. Select **Review + register** to discover the SAP system and begin the registration process.

        :::image type="content" source="media/register-existing-system/registration-page.png" alt-text="Screenshot of Azure Center for SAP solutions registration page, highlighting mandatory fields to identify the existing SAP system." lightbox="media/register-existing-system/registration-page.png":::

    1. On the **Review + register** pane, make sure your settings are correct. Then, select **Register**.

1. Wait for the VIS resource to be created. The VIS name is the same as the SID name. The VIS deployment finishes after all SAP system components are discovered from the ASCS VM that you selected.
  
You can now review the VIS resource in the Azure portal. The resource page shows the SAP system resources, and information about the system.

If the registration doesn't succeed, see [what to do when an SAP system registration fails in Azure Center for SAP solutions](#fix-registration-failure). Once you have fixed the configuration causing the issue, retry registration using the **Retry** action available on the VIS resource page on Azure portal.

## Fix registration failure

- The process of registering an SAP system with Azure Center for SAP solutions might fail when any of the [prerequisites aren't met](#prerequisites). 
- Review the prerequisites and ensure the configurations are as suggested.
- Review any error messages displayed on the VIS resource on Azure portal. Follow any recommended actions.
- Once you have fixed the configuration causing the issue, retry registration using the **Retry** action available on the Virtual Instance for SAP solutions page on Azure portal.

### Error - Failed to discover details from the DB VM
This error happens when the Database identifier is incorrectly configured on the SAP system. One possible cause is that the Application Server profile parameter `rsdb/dbid` has an incorrect identifier for the HANA Database. To fix the error:

1. Stop the Application Server instance:
    
    `sapcontrol -nr <instance number> -function Stop`

1. Stop the ASCS instance:

    `sapcontrol -nr <instance number> -function Stop`

1. Open the Application Server profile.

1. Add the profile parameter for the HANA Database: 

    `rsdb/dbid = <SID of HANA Database>`

1. Restart the Application Server instance: 

    `sapcontrol -nr <instance number> -function Start`

1. Restart the ASCS instance: 

    `sapcontrol -nr <instance number> -function Start`

1. Delete the VIS resource whose registration failed.

1. [Register the SAP system](#register-sap-system) again.

### Error - Azure VM Agent not in desired provisioning state
**Cause:** This issue occurs when Azure VM agent's provisioning state isn't as expected on the specified Virtual Machine. Expected state is **Ready**. Verify the agent status by checking the properties section in the VM overview page. 

**Solution:** To fix the Linux VM Agent, 
1. Log in to the VM using bastion or serial console.
2. If the VM agent exists and isn't running, then restart the waagent.
  - sudo systemctl status waagent. 
3. If the service isn't running then restart this service. To restart, use the following steps:
  - sudo systemctl stop waagent
  - sudo systemctl start waagent
4. If this doesn't solve the issue, try updating the VM Agent using [this document](/azure/virtual-machines/extensions/update-linux-agent)
5. If the VM agent doesn't exist or needs to be reinstalled, then follow [this documentation](/azure/virtual-machines/extensions/update-linux-agent).

To fix the Windows VM Agent, follow [Troubleshooting Azure Windows VM Agent](/troubleshoot/azure/virtual-machines/windows-azure-guest-agent).

### Error - Misconfigured SAP System
**Cause:** This issue occurs when multiple ASCS (MESSAGESERVER and/or ENQREP) instances present in the configured SAP, which isn't a valid configuration. Ensure that there exists only one ASCS instance for the SID. 

**Solution:** To fix the issue, you'll need to reconfigure the SAP system so that there's only one ASCS instance present for the SID. Perform below steps:
1. Log on to the affected server, at operating system level, as "'sid'adm";
2. Run "ps -ef | grep sapstartsrv", and take note of the command line related to the sapstartsrv process from the affected instance;
3. Run "sapcontrol -nr <$$> -function StopService". Run the "ps" command again (see the previous step), and ensure that the sapstartsrv process was stopped (<$$> is the number of the affected instance);
4. Access the folder "/usr/sap/'SID'/SYS/global/sapcontrol".
5. If you list the files with "ls -l", you'll notice that there's more than one file for the affected server.
6. The name of the files consists of a few numbers separated by the "underscore" ("_") character, and the last field is the hostname of the server related to that particular file;
7. Delete (you can move or rename, if you prefer) all the conflicting files with the command "rm *hostname" (where "hostname" is the actual name of the server, not the word "hostname" itself);
8. Manually start the sapstartsrv process again, using the command line you took note at the step #2; 

## Next steps

- [Monitor SAP system from Azure portal](monitor-portal.md)
- [Manage a VIS](manage-virtual-instance.md)
