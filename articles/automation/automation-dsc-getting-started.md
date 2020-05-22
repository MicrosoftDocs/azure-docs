---
title: Get started with Azure Automation State Configuration
description: This article tells how to do the most common tasks in Azure Automation State Configuration.
services: automation
ms.service: automation
ms.subservice: dsc
author: mgoedtel
ms.author: magoedte
ms.date: 04/15/2019
ms.topic: conceptual
manager: carmonm
---
# Get started with Azure Automation State Configuration

This article provides a step-by-step guide for doing the most common tasks with Azure Automation State Configuration, such as creating, importing, and compiling configurations, enabling machines to manage, and viewing reports. For an overview State Configuration, see [State Configuration overview](automation-dsc-overview.md). For Desired State Configuration (DSC) documentation, see [Windows PowerShell Desired State Configuration Overview](/powershell/scripting/dsc/overview/overview).

If you want a sample environment that is already set up without following the steps described in this
article, you can use the [Azure Automation Managed Node template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-automation-configuration). This template sets up a complete State Configuration (DSC) environment, including an Azure VM that is managed by State Configuration (DSC).

## Prerequisites

To complete the examples in this article, the following are required:

- An Azure Automation account. For instructions on creating an Azure Automation Run As account, see [Azure Run As Account](automation-sec-configure-azure-runas-account.md).
- An Azure Resource Manager VM (not Classic) running a [supported operating system](automation-dsc-overview.md#operating-system-requirements). For instructions on creating a VM, see [Create your first Windows virtual machine in the Azure portal](../virtual-machines/virtual-machines-windows-hero-tutorial.md)

## Create a DSC configuration

You create a simple [DSC configuration](/powershell/scripting/dsc/configurations/configurations) that ensures either the
presence or absence of the **Web-Server** Windows Feature (IIS), depending on how you assign nodes.

1. Start [VSCode](https://code.visualstudio.com/docs) (or any text editor).
1. Type the following text:

    ```powershell
    configuration TestConfig
    {
        Node IsWebServer
        {
            WindowsFeature IIS
            {
                Ensure               = 'Present'
                Name                 = 'Web-Server'
                IncludeAllSubFeature = $true
            }
        }

        Node NotWebServer
        {
            WindowsFeature IIS
            {
                Ensure               = 'Absent'
                Name                 = 'Web-Server'
            }
        }
    }
    ```
1. Save the file as **TestConfig.ps1**.

This configuration calls one resource in each node block, the [WindowsFeature resource](/powershell/scripting/dsc/reference/resources/windows/windowsfeatureresource). This resource ensures either the presence or absence of the **Web-Server** feature.

## Import a configuration into Azure Automation

Next, you import the configuration into the Automation account.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left, click **All resources** and then the name of your Automation account.
1. On the Automation account page, select **State configuration (DSC)** under **Configuration Management**.
1. On the State configuration (DSC) page, click the **Configurations** tab, then click **Add**.
1. On the Import Configuration pane, browse to the `TestConfig.ps1` file on your computer.

   ![Screenshot of the **Import Configuration** blade](./media/automation-dsc-getting-started/AddConfig.png)

1. Click **OK**.

## View a configuration in Azure Automation

After you have imported a configuration, you can view it in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left, click **All resources** and then the name of your Automation account.
1. On the Automation account page, select  **State configuration (DSC)** under **Configuration Management**.
1. On the State configuration (DSC) page, click the **Configurations** tab, then click **TestConfig**. This is the name of the configuration you imported in the previous procedure.
1. On the TestConfig Configuration pane, click **View configuration source**.

   ![Screenshot of the TestConfig configuration blade](./media/automation-dsc-getting-started/ViewConfigSource.png)

   A TestConfig Configuration source pane opens, displaying the PowerShell code for the configuration.

## Compile a configuration in Azure Automation

Before you can apply a desired state to a node, a DSC configuration defining that state must be
compiled into one or more node configurations (MOF document), and placed on the Automation DSC Pull
Server. For a more detailed description of compiling configurations in State Configuration (DSC), see [Compile configurations in Azure Automation State Configuration](automation-dsc-compile.md).
For more information about compiling configurations, see
[DSC Configurations](/powershell/scripting/dsc/configurations/configurations).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left, click **All resources** and then the name of your Automation account.
1. On the Automation account page, click **State configuration (DSC)** under **Configuration Management**.
1. On the State configuration (DSC) page, click the **Configurations** tab, then click **TestConfig**. This is the name of the previously imported configuration.
1. On the TestConfig Configuration pane, click **Compile**, and then click **Yes**. This starts a compilation job.

   ![Screenshot of the TestConfig configuration page highlighting compile button](./media/automation-dsc-getting-started/CompileConfig.png)

> [!NOTE]
> When you compile a configuration in Azure Automation, it automatically deploys any created node configuration MOF files to the pull server.

## View a compilation job

After you start a compilation, you can view it in the **Compilation Jobs** tile on the
**Configuration** page. The **Compilation Jobs** tile shows currently running, completed, and
failed jobs. When you open a compilation job pane, it shows information about that job including
any errors or warnings encountered, input parameters used in the configuration, and compilation
logs.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left, click **All resources** and then the name of your Automation account.
1. On the Automation account page, click **State configuration (DSC)** under **Configuration Management**.
1. On the State configuration (DSC) page, click the **Configurations** tab, then click **TestConfig**. This is the name of the previously imported configuration.
1. Under **Compilation jobs**, select the compilation job to view. A Compilation Job pane opens, labeled with the date when the compilation job was started.

   ![Screenshot of the Compilation Job page](./media/automation-dsc-getting-started/CompilationJob.png)

1. Click on any tile in the Compilation Job pane to see further details about the job.

## View node configurations

Successful completion of a compilation job creates one or more new node configurations. A node
configuration is a MOF document that is deployed to the pull server and ready to be pulled and
applied by one or more nodes. You can view the node configurations in your Automation account on
the State configuration (DSC) page. A node configuration has a name with the form
`ConfigurationName.NodeName`.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left, click **All resources** and then the name of your Automation account.
1. On the Automation account page, click **State configuration (DSC)** under **Configuration Management**.
1. On the State configuration (DSC) page, click the **Compiled configurations** tab.

   ![Screenshot of the Compiled Configurations tab](./media/automation-dsc-getting-started/NodeConfigs.png)

## Enable an Azure Resource Manager VM for management with State Configuration

You can use State Configuration to manage Azure VMs (both classic and Resource
Manager), on-premises VMs, Linux machines, AWS VMs, and on-premises physical machines. In this
article, you learn how to enable only Azure Resource Manager VMs. For information about enabling
other types of machines, see [Enable machines for management by Azure Automation State Configuration](automation-dsc-onboarding.md).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left, click **All resources** and then the name of your Automation account.
1. On the Automation account page, click **State configuration (DSC)** under **Configuration Management**.
1. On the State configuration (DSC) page, select the **Nodes** tab, then click **+ Add**.

   ![Screenshot of the DSC Nodes page highlighting the Add Azure VM button](./media/automation-dsc-getting-started/OnboardVM.png)

1. On the Virtual Machines pane, select your VM.
1. On the Virtual machine detail pane, click **+ Connect**.

   > [!IMPORTANT]
   > The VM must be an Azure Resource Manager VM running a [supported operating system](automation-dsc-overview.md#operating-system-requirements).

2. On the Registration page, select the name of the node configuration to apply to the VM in the **Node configuration name** field. Providing a name at this point is optional. You can change the assigned node configuration after enabling the node.

3. Check **Reboot Node if Needed**, then click **OK**.

   ![Screenshot of the Registration blade](./media/automation-dsc-getting-started/RegisterVM.png)

   The node configuration you specified is applied to the VM at intervals specified by the value provided for **Configuration Mode Frequency**. The VM checks for updates to the node configuration at intervals specified by the **Refresh Frequency** value. For more information about how these values are used, see
   [Configuring the Local Configuration Manager](/powershell/scripting/dsc/managing-nodes/metaConfig).

Azure starts the process of enabling the VM. When it is complete, the VM shows up in the
**Nodes** tab of the State configuration (DSC) page in the Automation account.

## View the list of managed nodes

You can view the list of all machines that have been enabled for management in your Automation
account in the **Nodes** tab of the State configuration (DSC) page.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left, click **All resources** and then the name of your Automation account.
1. On the Automation account page, click **State configuration (DSC)** under **Configuration Management**.
1. On the State configuration (DSC) page, click the **Nodes** tab.

## View reports for managed nodes

Each time State Configuration performs a consistency check on a managed node, the
node sends a status report back to the pull server. You can view these reports on the page for that
node.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left, click **All resources** and then the name of your Automation account.
1. On the Automation account page, click **State configuration (DSC)** under **Configuration Management**.
1. On the State configuration (DSC) page, click the **Nodes** tab. Here, you can see the overview of Configuration state and the details for each node.

   ![Screenshot of Node page](./media/automation-dsc-getting-started/NodesTab.png)

1. While on the **Nodes** tab, click the node record to open the reporting. Click the report you want to view additional reporting details.

   ![Screenshot of the Report blade](./media/automation-dsc-getting-started/NodeReport.png)

On the blade for an individual report, you can see the following status information for the corresponding consistency check:

- The report status. Possible values are:
    * Compliant - the node is compliant with the check.
   * Failed - the configuration failed the check.
   * Not Compliant - the node is in `ApplyandMonitor` mode and the machine is not in the desired state.
- The start time for the consistency check.
- The total runtime for the consistency check.
- The type of consistency check.
- Any errors, including the error code and error message.
- Any DSC resources used in the configuration, and the state of each resource (whether the node is in the desired state for that resource). You can click on each resource to get more detailed information for that resource.
- The name, IP address, and configuration mode of the node.

You can also click **View raw report** to see the actual data that the node sends to the server.
For more information about using that data, see [Using a DSC report server](/powershell/scripting/dsc/pull-server/reportserver).

It can take some time after a node is enabled before the first report is available. You might
need to wait up to 30 minutes for the first report after you enable a node.

## Reassign a node to a different node configuration

You can assign a node to use a different node configuration than the one you initially assigned.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left, click **All resources** and then the name of your Automation account.
1. On the Automation account page, click **State configuration (DSC)** under **Configuration Management**.
1. On the State configuration (DSC) page, click the **Nodes** tab.
1. On the **Nodes** tab, click on the name of the node you want to reassign.
1. On the page for that node, click **Assign node configuration**.

    ![Screenshot of the Node details page highlighting the Assign node configuration button](./media/automation-dsc-getting-started/AssignNode.png)

1. On the Assign Node Configuration page, select the node configuration to which you want to assign the node, and then click **OK**.

    ![Screenshot of the Assign Node Configuration page](./media/automation-dsc-getting-started/AssignNodeConfig.png)

## Unregister a node

If you no longer want a node to be managed by State Configuration, you can unregister it.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left, click **All resources** and then the name of your Automation account.
1. On the Automation account page, click **State configuration (DSC)** under **Configuration Management**.
1. On the State configuration (DSC) page, click the **Nodes** tab.
1. On the **Nodes** tab, click on the name of the node you want to unregister.
1. On the pane for that node, click **Unregister**.

    ![Screenshot of the Node details page highlighting the Unregister button](./media/automation-dsc-getting-started/UnregisterNode.png)

## Next steps

- For an overview, see [Azure Automation State Configuration overview](automation-dsc-overview.md).
- To enable the feature for VMs in your environment, see [Enable Azure Automation State Configuration](automation-dsc-onboarding.md).
- To understand PowerShell DSC, see [Windows PowerShell Desired State Configuration overview](/powershell/scripting/dsc/overview/overview).
- For pricing information, see [Azure Automation State Configuration pricing](https://azure.microsoft.com/pricing/details/automation/).
- For a PowerShell cmdlet reference, see [Az.Automation](https://docs.microsoft.com/powershell/module/az.automation/?view=azps-3.7.0#automation).
