---
title: How to upgrade the Azure Monitor for VMs Dependency agent| Microsoft Docs
description: This article describes how to upgrade the Azure Monitor for VMs Dependency agent using command-line, setup wizard, and other methods.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn
ms.assetid: 
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/16/2019
ms.author: magoedte
---

# How to upgrade the Azure Monitor for VMs Dependency agent

After initial deployment of the Azure Monitor for VMs Dependency agent, updates are released that include bug fixes or support of new features or functionality.  This article helps you understand the methods available and how to perform the upgrade manually or through automation.

## Upgrade options 

The Dependency agent for Windows and Linux can be upgraded to the latest release manually or automatically depending on the deployment scenario and environment the machine is running in. The following methods can be used to upgrade the agent.

|Environment |Installation method |Upgrade method |
|------------|--------------------|---------------|
|Azure VM | Dependency agent VM extension for Windows/Linux | Agent is automatically upgraded by default unless you configured your Azure Resource Manager template to opt out by setting the property *autoUpgradeMinorVersion* to **false**. |
| Custom Azure VM images | Manual install of Dependency agent for Windows/Linux | Updating VMs to the newest version of the agent needs to be performed from the command line running the Windows installer package or Linux self-extracting and installable shell script bundle.|
| Non-Azure VMs | Manual install of Dependency agent for Windows/Linux | Updating VMs to the newest version of the agent needs to be performed from the command line running the Windows installer package or Linux self-extracting and installable shell script bundle. |

## Upgrade Windows agent 

To update the agent on a Windows VM to the latest version not installed using the Dependency agent VM extension, you either run from the Command Prompt, script or other automation solution, or by using the InstallDependencyAgent-Windows.exe Setup Wizard.  

You can download the latest version of the Windows agent from [here](https://aka.ms/dependencyagentwindows).

### Using the Setup Wizard

1. Sign on to the computer with an account that has administrative rights.

2. Execute **InstallDependencyAgent-Windows.exe** to start the Setup Wizard.

3. In the **Dependency Agent 9.9.1 Setup** dialog box, click **I agree** to accept the license agreement.

5. In the **Dependency Agent 9.9.0 Uninstall** dialog box, click **Next**. The status page displays the progress of the uninstall of the previous version.

6. In the **Dependency Agent 9.9.0 Uninstall** dialog box, click **Uninstall** to proceed with uninstalling the previous version from the path specified in the dialog box. 

7. In the **Dependency Agent 9.9.0 Uninstall** dialog box, the uninstall progress is shown and when completed, the **Completing Dependency Agent Uninstall** page appears. Click **Finish**.

8. In the **Dependency Agent 9.9.1 Setup** dialog box, the install progress is shown. When the **Completing Dependency Agent Uninstall** page appears, click **Finish**. 

### From the command line

1. Sign on to the computer with an account that has administrative rights.

2. Run the following command.

    ```dos
    InstallDependencyAgent-Windows.exe /S /RebootMode=manual
    ```

    The `/RebootMode=manual` parameter prevents the upgrade from automatically rebooting the machine if some processes are using files from the previous version and have a lock on them. 

3. To confirm the upgrade was successful, check the `install.log` for detailed setup information. The log directory is *%Programfiles%\Microsoft Dependency Agent\logs*.

## Upgrade Linux agent 

Upgrade from prior versions of the Dependency agent on Linux is supported and performed following the same command as a new installation.

1. Sign on to the computer with an account that has administrative rights.

2. Run the following command as root`sh InstallDependencyAgent-Linux64.bin -s`. 

If the Dependency agent fails to start, check the logs for detailed error information. On Linux agents, the log directory is */var/opt/microsoft/dependency-agent/log*. 

## Next steps