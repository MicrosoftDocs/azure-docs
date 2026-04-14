---
title: Upgrade Mobility Service and appliance components - Modernized
description: This article describes about automatic updates for mobility agent and the procedure involved with manual updates - Modernized.
ms.service: azure-site-recovery
ms.topic: how-to
ms.date: 02/12/2026
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
author: Jeronika-MS
# Customer intent: "As an IT administrator managing mobility service updates, I want to automate mobility agent and appliance component updates, so that I can maintain system performance without needing to handle credentials for upgrades or disrupting ongoing replication."
---


# Upgrade Mobility Service and Appliance components (Modernized)

By using this modernized mobility service and appliance components, you don't need to maintain source machine's Root/Admin credentials for performing upgrades. You need the credentials only for the initial installation of the agent on source machines. Once done, you can remove the credentials and the upgrades occur automatically.


## Update mobility agent automatically

By default, automatic updates are enabled on a vault. Automatic updates are triggered at 12:00 AM local time every day, if a new version is available.

> [!NOTE]
> If you use private preview bits, automatic updates are blocked for the protected machines. Ensure that you setup Site Recovery on your machine again, using a fresh Azure Site Recovery replication appliance.

To get the latest features, enhancements, and fixes, select the **Allow Site Recovery to manage** option on the **Mobility agent upgrade settings**. Automatic updates don't require a reboot or affect ongoing replication of your virtual machines. Automatic updates also ensure that all the replication appliances in the vault are automatically updated.

:::image type="content" source="./media/upgrade-mobility-service-modernized/automatic-updates-on.png" alt-text="Automatic updates on for Mobility agent.":::

To turn off the automatic updates, toggle the **Allow Site Recovery to manage** button.

:::image type="content" source="./media/upgrade-mobility-service-modernized/automatic-updates-off.png" alt-text="Automatic updates off for mobility agent.":::


## Update mobility agent manually

If you turn off automatic updates for your mobility agent, you can update the agent manually by using the following procedures:

> [!IMPORTANT]
> These steps apply only when the mobility agent is healthy.

### Upgrade mobility agent on multiple protected items through portal

To manually update the mobility agent on multiple protected items, follow these steps:

1. Go to **Recovery services vault** > **Replicated items** and select *New Site Recovery mobility agent update is available*. Select **Install**.

   :::image type="content" source="./media/upgrade-mobility-service-modernized/agent-update.png" alt-text="Manual update of mobility agent on multiple protected items.":::

1. Select the source machines to update and then select **OK**.

   >[!NOTE]
   >If the virtual machine doesn't meet the prerequisites to upgrade the Mobility service, you can't select it. See information on [how to resolve](#resolve-blocking-issues-for-agent-upgrade).


1. After initiating the upgrade, a Site Recovery job is created in the vault for each upgrade operation. You can track the job by going to **Monitoring** > **Site Recovery jobs**.

### Update mobility agent for a single protected machine through portal

> [!IMPORTANT]
> These steps apply only when the mobility agent is healthy.

To update the mobility agent for a protected item, follow these steps:
1. Go to **recovery services vault** > **Replicated items** and select a virtual machine.
1. In the virtual machine's **Overview** blade, check the current version of the mobility agent against **Agent version**. If a new update is available, the status appears as **New update available**.

   :::image type="content" source="./media/upgrade-mobility-service-modernized/agent-version.png" alt-text="Manual update of mobility agent on a single protected items.":::

1. Select **New update available**. The latest available version is displayed. Select **Update to this version** to start the update job.

   :::image type="content" source="./media/upgrade-mobility-service-modernized/agent-update-details.png" alt-text="mobility agent update details.":::

   > [!NOTE]
   > If the upgrade is blocked, check and resolve the errors as detailed in [Resolve blocking issues for agent upgrade](#resolve-blocking-issues-for-agent-upgrade).



### Update mobility agent by using command line or when private endpoint is enabled

When you enable private endpoints, automatic updates aren't available. You need to manually update the mobility agent by using command line.

To update the mobility agent for a protected item, follow these steps:  

1. Go to **Recovery services vault** > **Replicated items**, and select a virtual machine. 

1. In the virtual machine's **Overview** blade, under **Agent version**, you can view the current version of the mobility agent. If a new update is available, the status is updated as **New update available**. 

1. Confirm the availability of new version, download the latest agent version’s package from [here](./site-recovery-whats-new.md#supported-updates) on the source machine and update the agent version. 

#### Update mobility agent on Windows machines

To update the mobility agent on Windows machines, follow these steps:

1.	Open command prompt and go to the folder where you placed the update package.

    `cd C:\Azure Site Recovery\Agent`

1.	Run the following command to extract the update package:

    `Microsoft-ASR_UA*Windows*release.exe /q /x:C:\Azure Site Recovery\Agent`

1.	Run the following command to proceed with the update:

    `UnifiedAgent.exe /Role "MS" /Platform VmWare /Silent  /InstallationType Upgrade /CSType CSPrime  /InstallLocation "C:\Program Files (x86)\Microsoft Azure Site Recovery"`

1.	Registration starts automatically after the agent is updated. To manually check the status of registration, run the following command:

    `"C:\Azure Site Recovery\Agent\agent\UnifiedAgentConfigurator.exe" /SourceConfigFilePath "config.json" /CSType CSPrime`

##### Upgrade settings

|Setting|Details|
|---|---|
|Syntax|	`.\UnifiedAgent.exe /Role "MS" /Platform vmware /Silent  /InstallationType Upgrade /CSType CSPrime  /InstallLocation "C:\Azure Site Recovery\Agent"`|
|`/Role`|Mandatory update parameter. </br>Specifies that the Mobility service (MS) is updated.|
|`/InstallLocation`|Optional. </br>Specifies the Mobility service installation location.|
|`/Platform`|Mandatory. </br>Specifies the platform on which the Mobility service is updated: </br> VMware for VMware virtual machines/physical servers. </br>Azure for Azure VMs. </br></br>If you're treating Azure virtual machines as physical machines, specify VMware.|
|`/Silent`|Optional. </br>Specifies whether to run the installer in silent mode.|
|`/CSType`|Mandatory. </br>Defines modernized or legacy architecture. (Use CSPrime)|

##### Registration settings

|Setting|Details|
|---|---|
|Syntax|`"<InstallLocation>\UnifiedAgentConfigurator.exe" /SourceConfigFilePath "config.json" /CSType CSPrime >`|
|`/SourceConfigFilePath`|Mandatory. </br>Full file path of the Mobility Service configuration file. Use any valid folder.|
|`/CSType`|Mandatory. </br>Defines modernized or legacy architecture. (CSPrime or CSLegacy).|

#### Update mobility agent on Linux machines

To update the mobility agent on Linux machines, follow these steps:

1.	From a terminal session, copy the update package to a local folder such as `/tmp` on the server for which you're updating the agent and run the following command:

    `cd /tmp ;`
    `tar -xvf Microsoft-ASR_UA_version_LinuxVersion_GA_date_release.tar.gz`

1.	To update the agent, run the following command:

    `./install -q -r MS -v VmWare -a Upgrade -c CSPrime`

1.	Registration starts automatically after the agent updates. To manually check the registration status, run the following command:

    `<InstallLocation>/Vx/bin/UnifiedAgentConfigurator.sh -c CSPrime -S config.json -q`

##### Installation settings

|Setting|Details|
|---|---|
|Syntax|`./install -q -r MS -v VmWare -a Upgrade -c CSPrime`|
|`-r`|Mandatory. </br>Installation parameter. </br>Specifies whether to install the Mobility service (MS).|
|`-d`|Optional. </br>Specifies the Mobility service installation location: `/usr/local/ASR`.|
|`-v`|Mandatory. </br>Specifies the platform on which to install the Mobility service. </br>VMware for VMware virtual machines and physical servers. </br>Azure for Azure virtual machines.|
|`-q`|Optional. </br>Specifies whether to run the installer in silent mode.|
|`-c`|Mandatory. </br>Defines modernized or legacy architecture. Use `CSPrime` or `CSLegacy`.|
|`-a`|Mandatory. </br>Specifies that the command upgrades the mobility agent and doesn't install it.|

##### Registration settings

|Setting|Details|
|---|---|
|Syntax|`<InstallLocation>/Vx/bin/UnifiedAgentConfigurator.sh -c CSPrime -S config.json -q`|
|`-S`|Mandatory. </br>Full file path of the Mobility Service configuration file. Use any valid folder.|
|`-c`|Mandatory. </br>Defines modernized or legacy architecture. Use `CSPrime` or `CSLegacy`.|
|`-q`|Optional. </br>Specifies whether to run the installer in silent mode.|


## Mobility agent on latest version

After you update the Mobility agent to the latest version or it automatically updates to the latest version, the status shows as **Up to date**.

### Resolve blocking issues for agent upgrade

If the upgrade prerequisites for the mobility agent aren't met, you can't update the virtual machine. Resolve these issues to proceed with the upgrade.

Prerequisites include, but aren't limited to, the following conditions:

- A pending mandatory reboot on the protected machine.

- The replication appliance is on an incompatible version.

- Replication appliance components –  Proxy server or Process server – can't communicate with Azure services.

- The mobility agent on the protected machine can't communicate with the replication appliance.

If any of these issues apply, the status shows as **Cannot update to latest version**. Select the status to view the reasons that block the update and the recommended actions to fix the problem.

>[!NOTE]
>After resolving the blocking reasons, wait 30 minutes before retrying the operations. It takes time for the latest information to update in the Site Recovery services.

### Mobility agent upgrade job failure

If the mobility agent upgrade operation fails (either from a manual trigger or an automatic upgrade operation), the job updates with the reason for failure. Resolve the errors and then retry the operation.

To view the failure errors, you can either go to **Site Recovery jobs** and select a specific job to see the resolution of errors, or you can use the following steps:

1. Go to the **replicated items** section and select a specific virtual machine.

1. In the **Overview** blade, against **Agent version**, you see the current version of the mobility agent.

1. Next to the current version, the status updates with the message **Update failed**. Select the status to retry the update operation.

1. You see a link to the previous upgrade job. Select the job to go to the specific job.

1. Resolve the previous job errors.

Trigger the update operation after resolving the errors from the previous failed job.

## Upgrade appliance

By default, the appliance has automatic updates enabled. The appliance triggers automatic updates at 12:00 AM local time every day, if a new version is available for any of the components.

To check the update status of any of the components, go to the appliance server and open **Microsoft Azure Appliance Configuration Manager**. Go to **Appliance components** and expand it to view the list of all the components and their version.

If any of these components need to be updated, the **Status** reflects the same. Select the status message to upgrade the component.

  :::image type="content" source="./media/upgrade-mobility-service-modernized/appliance-components.png" alt-text="replication appliance components.":::

### Turn off autoupdate

1. On the server running the appliance, open the Registry Editor.
1. Go to **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureAppliance**.
1. Create a registry key **AutoUpdate** with a DWORD value of 0 to turn off autoupdate.

    :::image type="content" source="./media/upgrade-mobility-service-modernized/registry-key.png" alt-text="Set registry key.":::


### Turn on autoupdate

Turn on autoupdate by deleting the AutoUpdate registry key from **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureAppliance**.

To delete the registry key:

1. On the server running the appliance, open the Registry Editor.
1. Go to **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureAppliance**.
1. Delete the registry key **AutoUpdate** that you created to turn off autoupdate.

### Update appliance components manually or when you enable private endpoint

> [!IMPORTANT]
> If you're using Windows Server 2016 for your replication appliance, make sure you install [Microsoft .NET framework 4.7.2](https://support.microsoft.com/topic/microsoft-net-framework-4-7-2-offline-installer-for-windows-05a72734-2127-a15d-50cf-daf56d5faec2) on the appliance machine.

When you enable private endpoints, you can't use automatic updates. To update all the components of Azure Site Recovery replication appliance, follow these steps: 

1.	Check this page to see if a new version of the components is available for your version.  
1.	Download the update packages for all versions that have updates available on your appliance, and update all the components. 

#### Update Process server

1.	To update the process server, download the latest version from [here](./site-recovery-whats-new.md#supported-updates). 
1.	Download the update package to the Azure Site Recovery replication appliance. 
1.	Open command prompt and go to the folder where you put the update package.
    
    `cd C:\Downloads`

1.	To update the process server, run the following command: 
    
    `msiexec.exe /i ProcessServer.msi ALLUSERS=1 REINSTALL=ALL REINSTALLMODE=vomus /l*v msi.log`

#### Update Recovery Services agent

To update the Recovery Service agent, download the latest version from [here](./site-recovery-whats-new.md#supported-updates).

1.	Download the update package to the Azure Site Recovery replication appliance. 
1.	Open command prompt and go to the folder where you put the update package.
    
    `cd C:\Downloads`

1.	To update the Recovery Service agent, run the following command: 
    
    `MARSAgentInstaller.exe /q /nu for mars agent`

#### Update remaining components of appliance

1.	To update the remaining components of the Azure Site Recovery replication appliance, download the latest version from [here](./site-recovery-whats-new.md#supported-updates).
1.	Open the downloaded `.msi` file. It triggers the update automatically.
1.	Check the latest version in Windows settings > **Add or remove program**.

### Resolve problems with component upgrade

If prerequisites to upgrade any of the components aren't met, then it can't be updated. The reasons/prerequisites include, but not limited to,

- One of the components of the replication appliance is on an incompatible version.

- The replication appliance can't communicate with Azure services.

In case any of the above issues are applicable, the status is updated as **Cannot update to latest version**. Select the status to view the reasons blocking the update and recommended actions to fix the issue. After resolving the blocking reasons, try the update manually.