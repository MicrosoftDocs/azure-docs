---
title:  Managing the Azure Arc for servers (preview) agent
description: This article describes the different management tasks that you will typically perform during the lifecycle of the Azure Arc for servers Connected Machine agent.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: mgoedtel
ms.author: magoedte
ms.date: 03/24/2020
ms.topic: conceptual
---

# Managing and maintaining the Connected Machine agent

After initial deployment of the Azure Arc for servers (preview) Connected Machine agent for Windows or Linux, you may need to reconfigure the agent, upgrade it, or remove it from the computer if it has reached the retirement stage in its lifecycle. You can easily manage these routine maintenance tasks manually or through automation, which reduces both operational error and expenses.

## Upgrading agent

The Azure Connected Machine agent for Windows and Linux can be upgraded to the latest release manually or automatically depending on your requirements. The following table describes the methods supported to perform the agent upgrade.

| Operating system | Upgrade method |
|------------------|----------------|
| Windows | Manually<br> Windows Update |
| Ubuntu | [Apt](https://help.ubuntu.com/lts/serverguide/apt.html) |
| SUSE Linux Enterprise Server | [zypper](https://en.opensuse.org/SDB:Zypper_usage_11.3) |
| Red Hat Enterprise, Amazon, CentOS Linux | [yum](https://wiki.centos.org/PackageManagement/Yum) | 

### Windows agent

To update the agent on a Windows machine to the latest version, the agent is available from Microsoft Update and can be deployed using your existing software update management process. It can also be run manually from the Command Prompt, from a script or other automation solution, or from the UI wizard by executing `AzureConnectedMachine.msi`. 

> [!NOTE]
> * To upgrade the agent, you must have *Administrator* permissions.
> * To upgrade manually, you must first download and copy the Installer package to a folder on the target server, or from a shared network folder. 

#### To upgrade using the Setup Wizard

1. Sign on to the computer with an account that has administrative rights.

2. Execute **AzureConnectedMachineAgent.msi** to start the Setup Wizard.

3. The Setup Wizard discovers if a previous version exists, and then it automatically performs an upgrade of the agent. When the upgrade completes, the Setup Wizard automatically closes.

#### To upgrade from the command line

1. Sign on to the computer with an account that has administrative rights.

2. To upgrade the agent silently and create a setup log file in the `C:\Support\Logs` folder, run the following command.

    ```dos
    msiexec.exe /i AzureConnectedMachineAgent.msi /qn /l*v "C:\Support\Logs\Azcmagentupgradesetup.log"
    ```

### Linux agent

## Remove the agent

To disconnect a machine from Azure Arc for servers (preview), do the following:

1. Open Azure Arc for servers (preview) by going to the [Azure portal](https://aka.ms/hybridmachineportal).

1. Select the machine in the list, select the ellipsis (**...**), and then select **Delete**.

### Windows agent

1. To uninstall the Windows agent from the machine, do the following:

    a. Sign in to the computer with an account that has administrator permissions.  
    b. In **Control Panel**, select **Programs and Features**.  
    c. In **Programs and Features**, select **Azure Connected Machine Agent**, select **Uninstall**, and then select **Yes**.  

    >[!NOTE]
    > You can also run the agent setup wizard by double-clicking the **AzureConnectedMachineAgent.msi** installer package.

    If you want to script removal of the agent, you can use the following example, which retrieves the product code and uninstalls the agent by using the Msiexec.exe command line - `msiexec /x {Product Code}`. To do so:  
    
    a. Open the Registry Editor.  
    b. Under registry key `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall`, look for and copy the product code GUID.  
    c. You can then uninstall the agent by using Msiexec.

    The following example demonstrates how to uninstall the agent:

    ```powershell
    Get-ChildItem -Path HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall | `
    Get-ItemProperty | `
    Where-Object {$_.DisplayName -eq "Azure Connected Machine Agent"} | `
    ForEach-Object {MsiExec.exe /x "$($_.PsChildName)" /qn}
    ```

### Linux agent

To uninstall the Linux agent, the command to use depends on the Linux operating system.

- For Ubuntu, run the following command:

    ```bash
    sudo apt purge azcmagent
    ```

- For RHEL, CentOS, and Amazon Linux, run the following command:

    ```bash
    sudo yum remove azcmagent
    ```

- For SLES, run the following command:

    ```bash
    sudo zypper remove azcmagent
    ```

## Update proxy settings

To configure the agent to communicate to the service through a proxy server after deployment, use one of the following methods to complete this task.

### Windows agent

### Linux agent