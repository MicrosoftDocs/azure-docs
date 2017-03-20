---
title: Automate Mobility Service installation for Azure Site Recovery using software deployment tools | Microsoft Docs.
description: This article helps you automate Mobility Service Installation using Software deployment tools like System Center Configuration Manager
services: site-recovery
documentationcenter: ''
author: AnoopVasudavan
manager: gauravd
editor: ''

ms.assetid:
ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 1/10/2017
ms.author: anoopkv
---
# Automate Mobility Service installation using software deployment tools

This article provides you an example of how you can use System Center Configuration Manager (SCCM) to deploy the Azure Site Recovery Mobility Service in your datacenter. Using a software deployment tool like SCCM gives you the following advantages
* Scheduling deployment -fresh installs and upgrades, during your planned maintenance window for software updates.
* Deploy at scale to hundreds of servers simultaneously


> [!NOTE]
> This article uses System Center Configuration Manager 2012 R2 to demonstrate the deployment activity. You could also automate Mobility Service Installation using [Azure Automation and Desired State Configuration](site-recovery-automate-mobility-service-install.md) .

## Prerequisites
1. A software deployment tool like System Center Configuration Manager(SCCM) that is already deployed in your environment.
  * Create two [Device Collections](https://technet.microsoft.com/library/gg682169.aspx) one for all **Windows Servers** and another for all **Linux Servers** you want to protect using Azure Site Recovery.
3. A Configuration Server that is already registered with Azure Site Recovery.
4. A secure network file share (SMB share) that can be accessed by the SCCM Server.

## Deploy Mobility Service on computers running Microsoft Windows Operating Systems
> [!NOTE]
> This article assumes the following
> 1. The IP Address of the configuration server is 192.168.3.121
> 2. The secure network file share is \\\ContosoSecureFS\MobilityServiceInstallers

### Step 1: Prepare for deployment
1. Create a folder on the network share and name it as **MobSvcWindows**
2. Log on to your Configuration Server and open up an Administrative command prompt
3. Run the following commands to generate a passphrase file.

    `cd %ProgramData%\ASR\home\svsystems\bin`

    `genpassphrase.exe -v > MobSvc.passphrase`
6. Copy the MobSvc.passphrase file into the MobSvcWindows folder on your network share.
5. Next browse to the installer repository on the Configuration Server by running the command.

  `cd %ProgramData%\ASR\home\svsystems\puhsinstallsvc\repository`
6. Copy the **Microsoft-ASR\_UA\_*version*\_Windows\_GA\_*date*\_Release.exe** to the **MobSvcWindows** folder on your network share.
7. Copy the code listed below and save it as **install.bat** into the **MobSvcWindows** folder
> [!NOTE]
> Remember to replace the [CSIP] place holders in the below script with the actual values of the IP Address of your Configuration Server.

  [!INCLUDE [site-recovery-sccm-windows-script](../../includes/site-recovery-sccm-windows-script.md)]

### Step 2: Create a Package

1. Log in to your System Center Configuration Manager Console
2. Browse to **Software Library** > **Application Management** > **Packages**
3. Right-click the **Packages** and select **Create Package**
4. Provide values for the Name, Description, Manufacturer, Language, Version.
5. Tick the **This package contains source files** checkbox.
6. Click the **Browse** button and select the network share where the installer is stored (\\\ContosoSecureFS\MobilityServiceInstaller\MobSvcWindows)

  ![create-sccm-package](./media/site-recovery-install-mobility-service-using-sccm/create_sccm_package.png)

7. In the **Choose the program type that you want to create** page, select **Standard Program**, and click **Next**

  ![create-sccm-package](./media/site-recovery-install-mobility-service-using-sccm/sccm-standard-program.png)
8. In the **Specify information about this standard program** page, provide the following inputs, and click **Next**. (The other inputs can be left to their default values)

  ![sccm-package-properties](./media/site-recovery-install-mobility-service-using-sccm/sccm-program-properties.png)   
| **Parameter Name** | **Value** |
|--|--|
| Name | Install Microsoft Azure Mobility Service (Windows) |
| Command line | install.bat |
| Program can run | Whether or not a user is logged on |
9. In the next page, select the target operating systems. Mobility Service can be installed only on Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2.

  ![sccm-package-properties-page2](./media/site-recovery-install-mobility-service-using-sccm/sccm-program-properties-page2.png)   
10. Complete Next twice to complete the wizard.

> [!NOTE]
> The script supports both new installations of Mobility Service Agents and upgrade/update of already installed Agents.

### Step 3: Deploy the Package
1. In the SCCM Console, right-click your package and select **Distribute Content**
  ![distribute-sccm-package](./media/site-recovery-install-mobility-service-using-sccm/sccm_distribute.png)
2. Select the **[Distribution Points](https://technet.microsoft.com/library/gg712321.aspx#BKMK_PlanForDistributionPoints)** on to which the packages should be copied over to.
3. Once you complete the wizard, the package starts replicating to the specified distribution points
4. Once the package distribution is done, right-click the package and select **Deploy**
  ![deploy-sccm-package](./media/site-recovery-install-mobility-service-using-sccm/sccm_deploy.png)
5. Select the Widows Server device collection you created in the prerequisites section as the target collection for deployment.

  ![sccm-select-target-collection](./media/site-recovery-install-mobility-service-using-sccm/sccm-select-target-collection.png)
6. In the **Specify the content destination** page, select your **Distribution Points**
7. In the **Specify setting to control how this software is deployed** page, ensure that the purpose is selected as required.

  ![sccm-deploy-select-purpose](./media/site-recovery-install-mobility-service-using-sccm/sccm-deploy-select-purpose.png)
8. Specify a schedule in the **Specify the schedule for this deployment**. Read more about [scheduling packages](https://technet.microsoft.com/library/gg682178.aspx)
9. Configure the properties on the **Distribution Points** page as per the needs of your Datacenter and complete the wizard.

> [!TIP]
> To avoid unnecessary reboots, schedule the package installation during your monthly maintenance window or Software Updates window.

You can monitor the deployment progress using the SCCM console by going to **Monitoring** > **Deployments** > *[your package name]*
  ![monitor-sccm](./media/site-recovery-install-mobility-service-using-sccm/report.PNG)

## Deploy Mobility Service on computers running Linux Operating Systems
> [!NOTE]
> This article assumes the following
> 1. The IP Address of the configuration server is 192.168.3.121
> 2. The secure network file share is \\\ContosoSecureFS\MobilityServiceInstallers

### Step 1: Prepare for deployment
1. Create a folder on the network share and name it as **MobSvcLinux**
2. Log on to your Configuration Server and open up an Administrative command prompt
3. Run the following commands to generate a passphrase file.

    `cd %ProgramData%\ASR\home\svsystems\bin`

    `genpassphrase.exe -v > MobSvc.passphrase`
6. Copy the MobSvc.passphrase file into the MobSvcWindows folder on your network share.
5. Next browse to the installer repository on the Configuration Server by running the command.

  `cd %ProgramData%\ASR\home\svsystems\puhsinstallsvc\repository`
6. Copy the following files to the **MobSvcLinux** folder on your network share
  * Microsoft-ASR\_UA\_*version*\_OEL-64\_GA\_*date*\_Release.tar.gz
  * Microsoft-ASR\_UA\_*version*\_RHEL6-64\_GA\_*date*\_Release.tar.gz
  * Microsoft-ASR\_UA\_*version*\_RHEL7-64\_GA\_*date*\_Release.tar.gz
  * Microsoft-ASR\_UA\_*version*\_SLES11-SP3-64\_GA\_*date*\_Release.tar.gz

7. Copy the code listed below and save it as **install_linux.sh** into the **MobSvcLinux** folder
> [!NOTE]
> Remember to replace the [CSIP] place holders in the below script with the actual values of the IP Address of your Configuration Server.

  [!INCLUDE [site-recovery-sccm-linux-script](../../includes/site-recovery-sccm-linux-script.md)]

### Step 2: Create a Package

1. Log in to your System Center Configuration Manager Console
2. Browse to **Software Library** > **Application Management** > **Packages**
3. Right-click the **Packages** and select **Create Package**
4. Provide values for the Name, Description, Manufacturer, Language, Version.
5. Tick the **This package contains source files** checkbox.
6. Click the **Browse** button and select the network share where the installer is stored (\\\ContosoSecureFS\MobilityServiceInstaller\MobSvcLinux)

  ![create-sccm-package](./media/site-recovery-install-mobility-service-using-sccm/create_sccm_package-linux.png)

7. In the **Choose the program type that you want to create** page, select **Standard Program**, and click **Next**

  ![create-sccm-package](./media/site-recovery-install-mobility-service-using-sccm/sccm-standard-program.png)
8. In the **Specify information about this standard program** page, provide the following inputs, and click **Next**. (The other inputs can be left to their default values)

  ![sccm-package-properties](./media/site-recovery-install-mobility-service-using-sccm/sccm-program-properties-linux.png)   
| **Parameter Name** | **Value** |
|--|--|
| Name | Install Microsoft Azure Mobility Service (Linux) |
| Command line | ./install_linux.sh |
| Program can run | Whether or not a user is logged on |

9. In the next page, select the **This program can run on any platform**
  ![sccm-package-properties-page2](./media/site-recovery-install-mobility-service-using-sccm/sccm-program-properties-page2-linux.png)   

10. Click **Next** twice to complete the wizard.
> [!NOTE]
> The script supports both new installations of Mobility Service Agents and upgrade/update of already installed Agents.

### Step 3: Deploy the Package
1. In the SCCM Console, right-click your package and select **Distribute Content**
  ![distribute-sccm-package](./media/site-recovery-install-mobility-service-using-sccm/sccm_distribute.png)
2. Select the **[Distribution Points](https://technet.microsoft.com/library/gg712321.aspx#BKMK_PlanForDistributionPoints)** on to which the packages should be copied over to.
3. Once you complete the wizard, the package starts replicating to the specified distribution points.
4. Once the package distribution is done, right-click the package and select **Deploy**
  ![deploy-sccm-package](./media/site-recovery-install-mobility-service-using-sccm/sccm_deploy.png)
5. Select the Linux Server device collection you created in the prerequisites section as the target collection for deployment.

  ![sccm-select-target-collection](./media/site-recovery-install-mobility-service-using-sccm/sccm-select-target-collection-linux.png)
6. In the **Specify the content destination** page, select your **Distribution Points**
7. In the **Specify setting to control how this software is deployed** page, ensure that the purpose is selected as required.

  ![sccm-deploy-select-purpose](./media/site-recovery-install-mobility-service-using-sccm/sccm-deploy-select-purpose.png)
8. Specify a schedule in the **Specify the schedule for this deployment**. Read more about [scheduling packages](https://technet.microsoft.com/library/gg682178.aspx)
9. Configure the properties on the **Distribution Points** page as per the needs of your Datacenter and complete the wizard.

Mobility Service gets installed on the Linux Server Device Collection as per the schedule you configured.

## Other methods to install mobility services
Read more about other ways to install mobility services.
* [Manual Installation using GUI](http://aka.ms/mobsvcmanualinstall)
* [Manual Installation using command-line](http://aka.ms/mobsvcmanualinstallcli)
* [Push Installation using Configuration Server ](http://aka.ms/pushinstall)
* [Automated Installation using Azure Automation & Desired State Configuration ](http://aka.ms/mobsvcdscinstall)

## Uninstall Mobility Service
Just like installation you can create SCCM packages to uninstall Mobility Service. Use the below script to uninstall the Mobility Service.

```
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
You are now ready to [Enable protection](https://docs.microsoft.com/en-us/azure/site-recovery/site-recovery-vmware-to-azure#step-6-replicate-applications) for your virtual machines.
