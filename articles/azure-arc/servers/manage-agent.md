---
title:  Managing the Azure Arc for servers (preview) agent
description: This article describes the different management tasks that you will typically perform during the lifecycle of the Azure Arc for servers Connected Machine agent.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: mgoedtel
ms.author: magoedte
ms.date: 04/13/2020
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
| RedHat Enterprise, Amazon, CentOS Linux | [yum](https://wiki.centos.org/PackageManagement/Yum) | 

### Windows agent

To update the agent on a Windows machine to the latest version, the agent is available from Microsoft Update and can be deployed using your existing software update management process. It can also be run manually from the Command Prompt, from a script or other automation solution, or from the UI wizard by executing `AzureConnectedMachine.msi`. 

> [!NOTE]
> * To upgrade the agent, you must have *Administrator* permissions.
> * To upgrade manually, you must first download and copy the Installer package to a folder on the target server, or from a shared network folder. 

If you are unfamiliar with the command-line options for Windows Installer packages, review [Msiexec standard command-line options](https://docs.microsoft.com/windows/win32/msi/standard-installer-command-line-options) and [Msiexec command-line options](https://docs.microsoft.com/windows/win32/msi/command-line-options).

#### To upgrade using the Setup Wizard

1. Sign on to the computer with an account that has administrative rights.

2. Execute **AzureConnectedMachineAgent.msi** to start the Setup Wizard.

The Setup Wizard discovers if a previous version exists, and then it automatically performs an upgrade of the agent. When the upgrade completes, the Setup Wizard automatically closes.

#### To upgrade from the command line

1. Sign on to the computer with an account that has administrative rights.

2. To upgrade the agent silently and create a setup log file in the `C:\Support\Logs` folder, run the following command.

    ```dos
    msiexec.exe /i AzureConnectedMachineAgent.msi /qn /l*v "C:\Support\Logs\Azcmagentupgradesetup.log"
    ```

### Linux agent

To update the agent on a Linux machine to the latest version, it involves two commands. One command to update the local package index with the list of latest available packages from the repositories, and one command to upgrade the local package. 

> [!NOTE]
> To upgrade the agent, you must have *root* access permissions or with an account that has elevated rights using Sudo.

#### Upgrade Ubuntu

1. To update the local package index with the latest changes made in the repositories, run the following command:

    ```bash
    apt update
    ```

2. To upgrade your system, run the following command:

    ```bash
    apt upgrade
    ```

Actions of the [apt](https://help.ubuntu.com/lts/serverguide/apt.html) command, such as installation and removal of packages, are logged in the `/var/log/dpkg.log` log file.

#### Upgrade Red Hat/CentOS/Amazon Linux

1. To update the local package index with the latest changes made in the repositories, run the following command:

    ```bash
    yum check-update
    ```

2. To upgrade your system, run the following command:

    ```bash
    yum update
    ```

Actions of the [yum](https://access.redhat.com/articles/yum-cheat-sheet) command, such as installation and removal of packages, are logged in the `/var/log/yum.log` log file. 

#### Upgrade SUSE Linux Enterprise

1. To update the local package index with the latest changes made in the repositories, run the following command:

    ```bash
    zypper refresh
    ```

2. To upgrade your system, run the following command:

    ```bash
    zypper update
    ```

Actions of the [zypper](https://en.opensuse.org/Portal:Zypper) command, such as installation and removal of packages, are logged in the `/var/log/zypper.log` log file. 

## About the Azcmagent tool

The Azcmagent tool (Azcmagent.exe) is used to configure the agent during installation, or modify the initial configuration of the Azure Arc for servers (preview) Connected Machine agent after it is installed. Azcmagent.exe provides command-line parameters to customize the agent and view its status:

* **Connect** - To connect the machine to Azure Arc

* **Disconnect** - To disconnect the machine from Azure Arc

* **Reconnect** - To reconnect a disconnected machine to Azure Arc

* **Show** - View agent status and its configuration properties (Resource Group name, Subscription Id, version, etc.), which can help when troubleshooting an issue with the agent.

* **-h or --help** - Shows available command-line parameters

    For example, to see detailed help for the **Reconnect** parameter, type `azcmagent reconnect -h`. 

* **-v or --verbose** - Enable verbose logging

You can perform a **Connect**, **Disconnect**, and **Reconnect** manually while logged on interactively, or automate using the same service principal you used to onboard multiple agents or with a Microsoft identity platform [access token](../../active-directory/develop/access-tokens.md).

### Connect 

### Disconnect

Specifies the agent deletes the Azure Resource Manager resource representing the machine in Azure. It does not delete the agent from the machine. After the machine is disconnected, if you want to re-register it with Azure Arc for servers (preview), use `azcmagent connect` to create a new resource for it in Azure.

To disconnect using a service principal, run the following command:

`azcmagent disconnect --service-principal-id <serviceprincipalAppID> --service-principal-secret <serviceprincipalPassword> --tenant-id <tenantID>`

To disconnect using an access token, run the following command:

`azcmagent disconnect --access-token <accessToken>`

To disconnect with your elevated logged-on credentials (interactive), run the following command:

`azcmagent disconnect --tenant-id <tenantID>`

## Remove the agent

Perform one of the following methods to uninstall the Windows or Linux Connected Machine agent from the machine. Removing the agent does not unregister the machine with Arc for servers (preview), this is a separate process you perform when you no longer need to manage the machine in Azure.

### Windows agent

Both of the following methods remove the agent, but they do not remove the *C:\Program Files\AzureConnectedMachineAgent* folder on the machine.

#### Uninstall from Control Panel

1. To uninstall the Windows agent from the machine, do the following:

    a. Sign in to the computer with an account that has administrator permissions.  
    b. In **Control Panel**, select **Programs and Features**.  
    c. In **Programs and Features**, select **Azure Connected Machine Agent**, select **Uninstall**, and then select **Yes**.  

    >[!NOTE]
    > You can also run the agent setup wizard by double-clicking the **AzureConnectedMachineAgent.msi** installer package.

#### Uninstall from the command line

To uninstall the agent manually from the Command Prompt or to use an automated method, such as a script, you can use the following example. First you need to retrieve the product code, which is a GUID that is the principal identifier of the application package, from the operating system. The uninstall is performed by using the Msiexec.exe command line - `msiexec /x {Product Code}`.
    
1. Open the Registry Editor.

2. Under registry key `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall`, look for and copy the product code GUID.

3. You can then uninstall the agent by using Msiexec using the following examples:

   * From the command-line type:

       ```dos
       msiexec.exe /x {product code GUID} /qn
       ```

   * You can perform the same steps using PowerShell:

       ```powershell
       Get-ChildItem -Path HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall | `
       Get-ItemProperty | `
       Where-Object {$_.DisplayName -eq "Azure Connected Machine Agent"} | `
       ForEach-Object {MsiExec.exe /x "$($_.PsChildName)" /qn}
       ```

### Linux agent

> [!NOTE]
> To uninstall the agent, you must have *root* access permissions or with an account that has elevated rights using Sudo.

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

## Unregister machine

If you are planning to stop managing the machine with supporting services in Azure, perform the following steps to unregister the machine with Arc for servers (preview). You can perform these step either before or after you have removed the Connected Machine agent from the machine.

1. Open Azure Arc for servers (preview) by going to the [Azure portal](https://aka.ms/hybridmachineportal).

2. Select the machine in the list, select the ellipsis (**...**), and then select **Delete**.
