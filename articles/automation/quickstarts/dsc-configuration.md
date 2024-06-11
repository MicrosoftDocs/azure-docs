---
title: Azure Quickstart - Configure a VM with Desired State Configuration
description: This article helps you get started configuring an Azure VM with Desired State Configuration.
services: automation
ms.subservice: dsc
keywords: dsc, configuration, automation
ms.date: 04/12/2023
ms.topic: quickstart
ms.custom: mvc, mode-other
---

# Configure a VM with Desired State Configuration

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

By enabling Azure Automation State Configuration, you can manage and monitor the configurations of your Windows and Linux servers using Desired State Configuration (DSC). Configurations that drift from a desired configuration can be identified or auto-corrected. This quickstart steps through enabling an Azure Linux VM and deploying a LAMP stack using Azure Automation State Configuration.

## Prerequisites

To complete this quickstart, you need:

* An Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).
* An Azure Resource Manager virtual machine running Red Hat Enterprise Linux, CentOS, or Oracle Linux. For instructions on creating a VM, see [Create your first Linux virtual machine in the Azure portal](../../virtual-machines/linux/quick-create-portal.md)

## Sign in to Azure
Sign in to the [Azure portal](https://portal.azure.com).

## Enable a virtual machine

There are many different methods to enable a machine for Automation State Configuration. This quickstart tells how to enable the feature for an Azure VM using an Automation account. You can learn more about different methods to enable your machines for State Configuration by reading [Enable machines for management by Azure Automation State Configuration](../automation-dsc-onboarding.md).

1. In the Azure portal, navigate to **Automation accounts**.
1. From the list of Automation accounts, select an account.
1. From the left pane of the Automation account, select **State configuration (DSC)**.
2. Click **Add** to open the **VM select** page.
3. Find the virtual machine for which to enable DSC. You can use the search field and filter options to find a specific virtual machine.
4. Click on the virtual machine, and then click **Connect**.
5. Select the DSC settings appropriate for the virtual machine. If you have already prepared a configuration, you can specify it as `Node Configuration Name`. You can set the [configuration mode](/powershell/dsc/managing-nodes/metaConfig) to control the configuration behavior for the machine.
6. Click **OK**. While the DSC extension is deployed to the virtual machine, the status reported is `Connecting`.

![Enabling an Azure VM for DSC](./media/dsc-configuration/dsc-onboard-azure-vm.png)

## Import modules

Modules contain DSC resources and many can be found in the [PowerShell Gallery](https://www.powershellgallery.com). Any resources that are used in your configurations must be imported to the Automation account before compiling. For this quickstart, the module named **nx** is required.

1. From the left pane of the Automation account, select **Modules Gallery** under **Shared Resources**.
1. Search for the module to import by typing part of its name: `nx`.
1. Click on the module to import.
1. Click **Import**.

![Importing a DSC Module](./media/dsc-configuration/dsc-import-module-nx.png)

## Import the configuration

This quickstart uses a DSC configuration that configures Apache HTTP Server, MySQL, and PHP on the machine. See [DSC configurations](/powershell/dsc/configurations/configurations).

In a text editor, type the following and save it locally as **AMPServer.ps1**.

```powershell-interactive
configuration 'LAMPServer' {
   Import-DSCResource -module "nx"

   Node localhost {

        $requiredPackages = @("httpd","mod_ssl","php","php-mysql","mariadb","mariadb-server")
        $enabledServices = @("httpd","mariadb")

        #Ensure packages are installed
        ForEach ($package in $requiredPackages){
            nxPackage $Package{
                Ensure = "Present"
                Name = $Package
                PackageManager = "yum"
            }
        }

        #Ensure daemons are enabled
        ForEach ($service in $enabledServices){
            nxService $service{
                Enabled = $true
                Name = $service
                Controller = "SystemD"
                State = "running"
            }
        }
   }
}
```

To import the configuration:

1. In the left pane of the Automation account, select **State configuration (DSC)** and then click the **Configurations** tab.
2. Click **+ Add**.
3. Select the configuration file that you saved in the prior step.
4. Click **OK**.

## Compile a configuration

You must compile a DSC configuration to a node configuration (MOF document) before it can be assigned to a node. Compilation validates the configuration and allows for the input of parameter values. To learn more about compiling a configuration, see [Compiling configurations in State Configuration](../automation-dsc-compile.md).

1. In the left pane of the Automation account, select **State Configuration (DSC)** and then click the **Configurations** tab.
1. Select the configuration `LAMPServer`.
1. From the menu options, select **Compile** and then click **Yes**.
1. In the Configuration view, you see a new compilation job queued. When the job has completed successfully, you are ready to move on to the next step. If there are any failures, you can click on the compilation job for details.

## Assign a node configuration

You can assign a compiled node configuration to a DSC node. Assignment applies the configuration to the machine and monitors or auto-corrects for any drift from that configuration.

1. In the left pane of the Automation account, select **State Configuration (DSC)** and then click the **Nodes** tab.
1. Select the node to which to assign a configuration.
1. Click **Assign Node Configuration**
1. Select the node configuration `LAMPServer.localhost` and click **OK**. State Configuration now assigns the compiled configuration to the node, and the node status changes to `Pending`. On the next periodic check, the node retrieves the configuration, applies it, and reports status. It can take up to 30 minutes for the node to retrieve the configuration, depending on the node settings.
1. To force an immediate check, you can run the following command locally on the Linux virtual machine:
   `sudo /opt/microsoft/dsc/Scripts/PerformRequiredConfigurationChecks.py`

![Assigning a Node Configuration](./media/dsc-configuration/dsc-assign-node-configuration.png)

## View node status

You can view the status of all State Configuration-managed nodes in your Automation account. The information is displayed by choosing **State Configuration (DSC)** and clicking the **Nodes** tab. You can filter the display by status, node configuration, or name search.

![DSC Node Status](./media/dsc-configuration/dsc-node-status.png)

## Next steps

In this quickstart, you enabled an Azure Linux VM for State Configuration, created a configuration for a LAMP stack, and deployed the configuration to the VM. To learn how you can use Azure Automation State Configuration to enable continuous deployment, continue to the article:

> [!div class="nextstepaction"]
> [Set up continuous deployment with Chocolatey](../automation-dsc-cd-chocolatey.md)
