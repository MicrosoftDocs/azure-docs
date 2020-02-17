---
title: Automate Mobility Service for disaster recovery of installation in Azure Site Recovery
description: How to automatically install the Mobility Service for VMware /physical server disaster recovery with Azure Site Recovery.
author: Rajeswari-Mamilla
ms.topic: how-to
ms.date: 2/5/2020
ms.author: ramamill
---

# Automate Mobility Service installation

This article describes how to automate installation and updates for the Mobility Service agent in [Azure Site Recovery](site-recovery-overview.md).

When you deploy Site Recovery for disaster recovery of on-premises VMware VMs and physical servers to Azure, you install the Mobility Service agent on each machine you want to replicate. The Mobility Service captures data writes on the machine, and forwards them to the Site Recovery process server for replication. You can deploy the Mobility Service in a few ways:

- **Push installation**: Let Site Recovery install  the Mobility service agent when you enable replication for a machine in the Azure portal.
- **Manual installation**: Install the Mobility service manually on each machine. [Learn more](vmware-physical-mobility-service-overview.md) about push and manual installation.
- **Automated deployment**: Automate installation with software deployment tools such as Microsoft Endpoint Configuration Manager, or third-party tools such as JetPatch.

Automated installation and updating provides a solution if:

- Your organization doesn't allow for push installation on protected servers.
- Your company policy requires passwords to be changed periodically. You have to specify a password for the push installation.
- Your security policy doesn't permit adding firewall exceptions for specific machines.
- You're acting as a hosting service provider and don't want to provide customer machine credentials that are needed for push installation with Site Recovery.
- You need to scale agent installations to lots of servers simultaneously.
- You want to schedule installations and upgrades during planned maintenance windows.

## Prerequisites

To automate the installation, you need the following items:

- A deployed software installation solution such as [Configuration Manager](/configmgr/) or [JetPatch](https://jetpatch.com/microsoft-azure-site-recovery/).
- Deployment prerequisites in place in [Azure](tutorial-prepare-azure.md) and [on-premises](vmware-azure-tutorial-prepare-on-premises.md) for VMware disaster recovery, or for [physical server](physical-azure-disaster-recovery.md) disaster recovery. Review the [support requirements](vmware-physical-azure-support-matrix.md) for disaster recovery.

## Prepare for automated deployment

The following table summarizes tools and processes for automating Mobility Service deployment.

**Tool** | **Details** | **Instructions**
--- | --- | ---
**Configuration Manager** | 1. Verify that you have the [prerequisites](#prerequisites) listed above in place. <br/><br/> 2. Deploy disaster recovery by setting up the source environment, including downloading an OVA file to deploy the Site Recovery configuration server as a VMware VM using an OVF template.<br/><br/> 3. You register the configuration server with the Site Recovery service, set up the target Azure environment, and configure a replication policy.<br/><br/> 4. For automated Mobility Service deployment, you create a network share containing the configuration server passphrase and Mobility Service installation files.<br/><br/> 5. You create a Configuration Manager package containing the installation or updates, and prepare for Mobility Service deployment.<br/><br/> 6. You can then enable replication to Azure for the machines that have the Mobility Service installed. | [Automate with Configuration Manager](#automate-with-configuration-manager)
**JetPatch** | 1. Verify that you have the [prerequisites](#prerequisites) listed above in place. <br/><br/> 2. Deploy disaster recovery by setting up the source environment, including downloading and deploying JetPatch Agent Manager for Azure Site Recovery in your Site Recovery environment, using an OVF template.<br/><br/> 3. You register the configuration server with Site Recovery, set up the target Azure environment, and configure a replication policy.<br/><br/> 4. For automated deployment, initialize and complete the JetPatch Agent Manager configuration.<br/><br/> 5. In JetPatch you can create a Site Recovery policy to automate deployment and upgrade of the Mobility Service agent. <br/><br/> 6. You can then enable replication to Azure for the machines that have the Mobility Service installed. | [Automate with JetPatch Agent Manager](https://jetpatch.com/microsoft-azure-site-recovery-deployment-guide/)<br/><br/> [Troubleshoot agent installation in JetPatch](https://kc.jetpatch.com/hc/articles/360035981812)

## Automate with Configuration Manager

### Prepare the installation files

1. Make sure you have the prerequisites in place.
1. Create a secure network file share (SMB share) that can be accessed by the machine running the configuration server.
1. In Configuration Manager, [categorize the servers](/sccm/core/clients/manage/collections/automatically-categorize-devices-into-collections) on which you want to install or update the Mobility Service. One collection should contain all Windows servers, the other all Linux servers.
1. On the network share, create a folder:

   - For installation on Windows machines, create a folder named _MobSvcWindows_.
   - For installation on Linux machines, create a folder named _MobSvcLinux_.

1. Sign in to the configuration server machine.
1. On the configuration server machine, open an administrative command prompt.
1. To generate the passphrase file, run this command:

    ```Console
    cd %ProgramData%\ASR\home\svsystems\bin
    genpassphrase.exe -v > MobSvc.passphrase
    ```

1. Copy the _MobSvc.passphrase_ file to the Windows folder and the Linux folder.
1. To browse to the folder that contains the installation files, run this command:

    ```Console
    cd %ProgramData%\ASR\home\svsystems\pushinstallsvc\repository
    ```

1. Copy these installation files to the network share:

   - For Windows, copy _Microsoft-ASR_UA_version_Windows_GA_date_Release.exe_ to _MobSvcWindows_.
   - For Linux, copy the following files to _MobSvcLinux_:
     - _Microsoft-ASR_UARHEL6-64release.tar.gz_
     - _Microsoft-ASR_UARHEL7-64release.tar.gz_
     - _Microsoft-ASR_UASLES11-SP3-64release.tar.gz_
     - _Microsoft-ASR_UASLES11-SP4-64release.tar.gz_
     - _Microsoft-ASR_UAOL6-64release.tar.gz_
     - _Microsoft-ASR_UAUBUNTU-14.04-64release.tar.gz_

1. As described in the following procedures, copy the code to the Windows or Linux folders. We're assuming that:

   - The configuration server's IP address is `192.168.3.121`.
   - The secure network file share is `\\ContosoSecureFS\MobilityServiceInstallers`.

### Copy code to the Windows folder

Copy the following code:

- Save the code in the _MobSvcWindows_ folder as _install.bat_.
- Replace the `[CSIP]` placeholders in this script with the actual values of the IP address of your configuration server.
- The script supports new installations of the Mobility Service agent, and updates to agents that are already installed.

```DOS
Time /t >> C:\Temp\logfile.log
REM ==================================================
REM ==== Clean up the folders ========================
RMDIR /S /q %temp%\MobSvc
MKDIR %Temp%\MobSvc
MKDIR C:\Temp
REM ==================================================

REM ==== Copy new files ==============================
COPY M*.* %Temp%\MobSvc
CD %Temp%\MobSvc
REN Micro*.exe MobSvcInstaller.exe
REM ==================================================

REM ==== Extract the installer =======================
MobSvcInstaller.exe /q /x:%Temp%\MobSvc\Extracted
REM ==== Wait 10s for extraction to complete =========
TIMEOUT /t 10
REM =================================================

REM ==== Perform installation =======================
REM =================================================

CD %Temp%\MobSvc\Extracted
whoami >> C:\Temp\logfile.log
SET PRODKEY=HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall
REG QUERY %PRODKEY%\{275197FC-14FD-4560-A5EB-38217F80CBD1}
IF NOT %ERRORLEVEL% EQU 0 (
	echo "Product is not installed. Goto INSTALL." >> C:\Temp\logfile.log
	GOTO :INSTALL
) ELSE (
	echo "Product is installed." >> C:\Temp\logfile.log

	echo "Checking for Post-install action status." >> C:\Temp\logfile.log
	GOTO :POSTINSTALLCHECK
)

:POSTINSTALLCHECK
	REG QUERY "HKLM\SOFTWARE\Wow6432Node\InMage Systems\Installed Products\5" /v "PostInstallActions" | Find "Succeeded"
	If %ERRORLEVEL% EQU 0 (
		echo "Post-install actions succeeded. Checking for Configuration status." >> C:\Temp\logfile.log
		GOTO :CONFIGURATIONCHECK
	) ELSE (
		echo "Post-install actions didn't succeed. Goto INSTALL." >> C:\Temp\logfile.log
		GOTO :INSTALL
	)

:CONFIGURATIONCHECK
	REG QUERY "HKLM\SOFTWARE\Wow6432Node\InMage Systems\Installed Products\5" /v "AgentConfigurationStatus" | Find "Succeeded"
	If %ERRORLEVEL% EQU 0 (
		echo "Configuration has succeeded. Goto UPGRADE." >> C:\Temp\logfile.log
		GOTO :UPGRADE
	) ELSE (
		echo "Configuration didn't succeed. Goto CONFIGURE." >> C:\Temp\logfile.log
		GOTO :CONFIGURE
	)


:INSTALL
	echo "Perform installation." >> C:\Temp\logfile.log
	UnifiedAgent.exe /Role MS /InstallLocation "C:\Program Files (x86)\Microsoft Azure Site Recovery" /Platform "VmWare" /Silent
	IF %ERRORLEVEL% EQU 0 (
	    echo "Installation has succeeded." >> C:\Temp\logfile.log
		(GOTO :CONFIGURE)
    ) ELSE (
		echo "Installation has failed." >> C:\Temp\logfile.log
		GOTO :ENDSCRIPT
	)

:CONFIGURE
	echo "Perform configuration." >> C:\Temp\logfile.log
	cd "C:\Program Files (x86)\Microsoft Azure Site Recovery\agent"
	UnifiedAgentConfigurator.exe  /CSEndPoint "[CSIP]" /PassphraseFilePath %Temp%\MobSvc\MobSvc.passphrase
	IF %ERRORLEVEL% EQU 0 (
	    echo "Configuration has succeeded." >> C:\Temp\logfile.log
    ) ELSE (
		echo "Configuration has failed." >> C:\Temp\logfile.log
	)
	GOTO :ENDSCRIPT

:UPGRADE
	echo "Perform upgrade." >> C:\Temp\logfile.log
	UnifiedAgent.exe /Platform "VmWare" /Silent
	IF %ERRORLEVEL% EQU 0 (
	    echo "Upgrade has succeeded." >> C:\Temp\logfile.log
    ) ELSE (
		echo "Upgrade has failed." >> C:\Temp\logfile.log
	)
	GOTO :ENDSCRIPT

:ENDSCRIPT
	echo "End of script." >> C:\Temp\logfile.log
```

### Copy code to the Linux folder

Copy the following code:

- Save the code in the _MobSvcLinux_ folder as _install_linux.sh_.
- Replace the `[CSIP]` placeholders in this script with the actual values of the IP address of your configuration server.
- The script supports new installations of the Mobility Service agent, and updates to agents that are already installed.

```Bash
#!/usr/bin/env bash

rm -rf /tmp/MobSvc
mkdir -p /tmp/MobSvc
INSTALL_DIR='/usr/local/ASR'
VX_VERSION_FILE='/usr/local/.vx_version'

echo "=============================" >> /tmp/MobSvc/sccm.log
echo `date` >> /tmp/MobSvc/sccm.log
echo "=============================" >> /tmp/MobSvc/sccm.log

if [ -f /etc/oracle-release ] && [ -f /etc/redhat-release ]; then
    if grep -q 'Oracle Linux Server release 6.*' /etc/oracle-release; then
        if uname -a | grep -q x86_64; then
            OS="OL6-64"
            echo $OS >> /tmp/MobSvc/sccm.log
            cp *OL6*.tar.gz /tmp/MobSvc
        fi
    fi
elif [ -f /etc/redhat-release ]; then
    if grep -q 'Red Hat Enterprise Linux Server release 6.* (Santiago)' /etc/redhat-release || \
        grep -q 'CentOS Linux release 6.* (Final)' /etc/redhat-release || \
        grep -q 'CentOS release 6.* (Final)' /etc/redhat-release; then
        if uname -a | grep -q x86_64; then
            OS="RHEL6-64"
            echo $OS >> /tmp/MobSvc/sccm.log
            cp *RHEL6*.tar.gz /tmp/MobSvc
        fi
    elif grep -q 'Red Hat Enterprise Linux Server release 7.* (Maipo)' /etc/redhat-release || \
        grep -q 'CentOS Linux release 7.* (Core)' /etc/redhat-release; then
        if uname -a | grep -q x86_64; then
            OS="RHEL7-64"
            echo $OS >> /tmp/MobSvc/sccm.log
            cp *RHEL7*.tar.gz /tmp/MobSvc
                fi
    fi
elif [ -f /etc/SuSE-release ] && grep -q 'VERSION = 11' /etc/SuSE-release; then
    if grep -q "SUSE Linux Enterprise Server 11" /etc/SuSE-release && grep -q 'PATCHLEVEL = 3' /etc/SuSE-release; then
        if uname -a | grep -q x86_64; then
            OS="SLES11-SP3-64"
            echo $OS >> /tmp/MobSvc/sccm.log
            cp *SLES11-SP3*.tar.gz /tmp/MobSvc
        fi
    elif grep -q "SUSE Linux Enterprise Server 11" /etc/SuSE-release && grep -q 'PATCHLEVEL = 4' /etc/SuSE-release; then
        if uname -a | grep -q x86_64; then
            OS="SLES11-SP4-64"
            echo $OS >> /tmp/MobSvc/sccm.log
            cp *SLES11-SP4*.tar.gz /tmp/MobSvc
        fi
    fi
elif [ -f /etc/lsb-release ] ; then
    if grep -q 'DISTRIB_RELEASE=14.04' /etc/lsb-release ; then
       if uname -a | grep -q x86_64; then
           OS="UBUNTU-14.04-64"
           echo $OS >> /tmp/MobSvc/sccm.log
           cp *UBUNTU-14*.tar.gz /tmp/MobSvc
       fi
    fi
else
    exit 1
fi

if [ -z "$OS" ]; then
    exit 1
fi

Install()
{
    echo "Perform Installation." >> /tmp/MobSvc/sccm.log
    ./install -q -d ${INSTALL_DIR} -r MS -v VmWare
    RET_VAL=$?
    echo "Installation Returncode: $RET_VAL" >> /tmp/MobSvc/sccm.log
    if [ $RET_VAL -eq 0 ]; then
        echo "Installation has succeeded. Proceed to configuration." >> /tmp/MobSvc/sccm.log
        Configure
    else
        echo "Installation has failed." >> /tmp/MobSvc/sccm.log
        exit $RET_VAL
    fi
}

Configure()
{
    echo "Perform configuration." >> /tmp/MobSvc/sccm.log
    ${INSTALL_DIR}/Vx/bin/UnifiedAgentConfigurator.sh -i [CSIP] -P MobSvc.passphrase
    RET_VAL=$?
    echo "Configuration Returncode: $RET_VAL" >> /tmp/MobSvc/sccm.log
    if [ $RET_VAL -eq 0 ]; then
        echo "Configuration has succeeded." >> /tmp/MobSvc/sccm.log
    else
        echo "Configuration has failed." >> /tmp/MobSvc/sccm.log
        exit $RET_VAL
    fi
}

Upgrade()
{
    echo "Perform Upgrade." >> /tmp/MobSvc/sccm.log
    ./install -q -v VmWare
    RET_VAL=$?
    echo "Upgrade Returncode: $RET_VAL" >> /tmp/MobSvc/sccm.log
    if [ $RET_VAL -eq 0 ]; then
        echo "Upgrade has succeeded." >> /tmp/MobSvc/sccm.log
    else
        echo "Upgrade has failed." >> /tmp/MobSvc/sccm.log
        exit $RET_VAL
    fi
}

cp MobSvc.passphrase /tmp/MobSvc
cd /tmp/MobSvc

tar -zxvf *.tar.gz

if [ -e ${VX_VERSION_FILE} ]; then
    echo "${VX_VERSION_FILE} exists. Checking for configuration status." >> /tmp/MobSvc/sccm.log
    agent_configuration=$(grep ^AGENT_CONFIGURATION_STATUS "${VX_VERSION_FILE}" | cut -d"=" -f2 | tr -d " ")
    echo "agent_configuration=$agent_configuration" >> /tmp/MobSvc/sccm.log
     if [ "$agent_configuration" == "Succeeded" ]; then
        echo "Agent is already configured. Proceed to Upgrade." >> /tmp/MobSvc/sccm.log
        Upgrade
    else
        echo "Agent is not configured. Proceed to Configure." >> /tmp/MobSvc/sccm.log
        Configure
    fi
else
    Install
fi

cd /tmp

```

### Create a package

1. Sign in to the Configuration Manager console and go to **Software Library** > **Application Management** > **Packages**.
1. Right-click **Packages** > **Create Package**.
1. Provide package details including a name, description, manufacturer, language, and version.
1. Select **This package contains source files**.
1. Click **Browse**, and select the network share and folder that contains the relevant installer (_MobSvcWindows_ or _MobSvcLinux_). Then, select **Next**.

   ![Screenshot of Create Package and Program wizard](./media/vmware-azure-mobility-install-configuration-mgr/create_sccm_package.png)

1. In **Choose the program type that you want to create** page, select **Standard Program** > **Next**.

   ![Screenshot of Create Package and Program wizard](./media/vmware-azure-mobility-install-configuration-mgr/sccm-standard-program.png)

1. In **Specify information about this standard program** page, specify the following values:

    **Parameter** | **Windows value** | **Linux value**
    --- | --- | ---
    **Name** | Install Microsoft Azure Mobility Service (Windows) | Install Microsoft Azure Mobility Service (Linux).
    **Command line** | install.bat | ./install_linux.sh
    **Program can run** | Whether or not a user is logged on | Whether or not a user is logged on
    **Other parameters** | Use default setting | Use default setting

   ![Screenshot of Create Package and Program wizard](./media/vmware-azure-mobility-install-configuration-mgr/sccm-program-properties.png)

1. In **Specify the requirements for this standard program**, do the following tasks:

   - For Windows machines, select **This program can run only on specified platforms**. Then, select the [supported Windows operating systems](vmware-physical-azure-support-matrix.md#replicated-machines) and select **Next**.
   - For Linux machines, select **This program can run on any platform**. Then select **Next**.

1. Finish the wizard.

### Deploy the package

1. In the Configuration Manager console, right-click the package and select **Distribute Content**.

   ![Screenshot of Configuration Manager console](./media/vmware-azure-mobility-install-configuration-mgr/sccm_distribute.png)

1. Select the distribution points on to which the packages should be copied. [Learn more](/sccm/core/servers/deploy/configure/install-and-configure-distribution-points).
1. Complete the wizard. The package then starts replicating to the specified distribution points.
1. After the package distribution finishes, right-click the package > **Deploy**.

   ![Screenshot of Configuration Manager console](./media/vmware-azure-mobility-install-configuration-mgr/sccm_deploy.png)

1. Select the Windows or Linux device collection you created previously.
1. On the **Specify the content destination** page, select **Distribution Points**.
1. In **Specify settings to control how this software is deployed** page, set **Purpose** to **Required**.

   ![Screenshot of Deploy Software wizard](./media/vmware-azure-mobility-install-configuration-mgr/sccm-deploy-select-purpose.png)

1. In **Specify the schedule for this deployment**, set up a schedule. [Learn more](/sccm/apps/deploy-use/deploy-applications#bkmk_deploy-sched).

   - The Mobility Service is installed in accordance with the schedule you specify.
   - To avoid unnecessary reboots, schedule the package installation during your monthly maintenance window or software updates window.

1. On the **Distribution Points** page, configure settings and finish the wizard.
1. Monitor deployment progress in the Configuration Manager console. Go to **Monitoring** > **Deployments** > _\<your package name\>_.

### Uninstall the Mobility Service

You can create Configuration Manager packages to uninstall the Mobility Service. For example, the following script uninstalls the Mobility Service:

```DOS
Time /t >> C:\logfile.log
REM ==================================================
REM ==== Check if Mob Svc is already installed =======
REM ==== If not installed no operation required ========
REM ==== Else run uninstall command =====================
REM ==== {275197FC-14FD-4560-A5EB-38217F80CBD1} is ====
REM ==== guid for Mob Svc Installer ====================
whoami >> C:\logfile.log
NET START | FIND "InMage Scout Application Service"
IF  %ERRORLEVEL% EQU 1 (GOTO :INSTALL) ELSE GOTO :UNINSTALL
:NOOPERATION
                echo "No Operation Required." >> c:\logfile.log
                GOTO :ENDSCRIPT
:UNINSTALL
                echo "Uninstall" >> C:\logfile.log
                MsiExec.exe /qn /x {275197FC-14FD-4560-A5EB-38217F80CBD1} /L+*V "C:\ProgramData\ASRSetupLogs\UnifiedAgentMSIUninstall.log"
:ENDSCRIPT
```

## Next steps

[Enable replication](vmware-azure-enable-replication.md) for VMs.
