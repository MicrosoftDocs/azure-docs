---
title: Get started with Azure Automation State Configuration
description: This article tells how to do the most common tasks in Azure Automation State Configuration.
services: automation
ms.subservice: desired-state-config
ms.custom: devx-track-arm-template
ms.date: 01/01/2025
ms.topic: how-to
ms.service: azure-automation
---

# Get started with Azure Automation State Configuration

[!INCLUDE [azure-automation-dsc-end-of-life](~/includes/dsc-automation/azure-automation-dsc-end-of-life.md)]

[!INCLUDE [automation-dsc-linux-retirement-announcement](./includes/automation-dsc-linux-retirement-announcement.md)]

This article provides a step-by-step guide for doing the most common tasks with Azure Automation
State Configuration, such as:

- creating, importing, and compiling configurations
- enabling machines to manage
- viewing reports

For an overview State Configuration, see [State Configuration overview][23]. For Desired State
Configuration (DSC) documentation, see
[Windows PowerShell Desired State Configuration Overview][17].

If you want a sample environment that is already set up without following the steps described in
this article, you can use the [Azure Automation Managed Node template][27]. This template sets up a
complete State Configuration (DSC) environment, including an Azure virtual machine managed by State
Configuration (DSC).

## Prerequisites

To complete the examples in this article, the following are required:

- An Azure Automation account. To learn more about an Automation account and its requirements, see
  [Automation Account authentication overview][01].
- An Azure Resource Manager VM (not Classic) running a [supported operating system][24]. For
  instructions on creating a VM, see
  [Create your first Windows virtual machine in the Azure portal][14]

## Create a DSC configuration

You create a simple [DSC configuration][15] that ensures either the presence or absence of the
**Web-Server** Windows Feature (IIS), depending on how you assign nodes.

Configuration names in Azure Automation must be limited to no more than 100 characters.

1. Start [VS Code][26] (or any text editor).
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

This configuration calls one resource in each node block, the [WindowsFeature resource][19]. This
resource ensures either the presence or absence of the **Web-Server** feature.

## Import a configuration into Azure Automation

Next, you import the configuration into the Automation account.

1. Sign in to the [Azure portal][28].
1. On the left, select **All resources** and then the name of your Automation account.
1. On the Automation account page, select **State configuration (DSC)** under **Configuration
   Management**.
1. On the State configuration (DSC) page, select the **Configurations** tab, then select **Add**.
1. On the Import Configuration pane, browse to the `TestConfig.ps1` file on your computer.

   ![Screenshot of the **Import Configuration** blade][02]

1. Select **OK**.

## View a configuration in Azure Automation

After you import a configuration, you can view it in the Azure portal.

1. Sign in to the [Azure portal][28].
1. On the left, select **All resources** and then the name of your Automation account.
1. On the Automation account page, select **State configuration (DSC)** under **Configuration
   Management**.
1. On the State configuration (DSC) page, select the **Configurations** tab, then select the name of
   the configuration you imported in the previous procedure, **TestConfig**.
1. On the TestConfig Configuration pane, select **View configuration source**.

   ![Screenshot of the TestConfig configuration blade][12]

   A TestConfig Configuration source pane opens, displaying the PowerShell code for the
   configuration.

## Compile a configuration in Azure Automation

Before you can apply a desired state to a node, a DSC configuration defining that state must be
compiled into one or more node configurations (MOF document), and placed on the Automation DSC Pull
Server. For a more detailed description of compiling configurations in State Configuration (DSC),
see [Compile configurations in Azure Automation State Configuration][21]. For more information about
compiling configurations, see [DSC Configurations][15].

1. Sign in to the [Azure portal][28].
1. On the left, select **All resources** and then the name of your Automation account.
1. On the Automation account page, select **State configuration (DSC)** under **Configuration
   Management**.
1. On the State configuration (DSC) page, select the **Configurations** tab, then select the name of
   the previously imported configuration, **TestConfig**.
1. To start the compilation job, select **Compile** on the TestConfig Configuration pane, and then
   select **Yes**.

   ![Screenshot of the TestConfig configuration page highlighting compile button][06]

> [!NOTE]
> When you compile a configuration in Azure Automation, it automatically deploys any created node
> configuration MOF files to the pull server.

## View a compilation job

After you start a compilation, you can view it in the **Compilation Jobs** tile on the
**Configuration** page. The **Compilation Jobs** tile shows currently running, completed, and failed
jobs. When you open a compilation job pane, it shows information about that job including any errors
or warnings encountered, input parameters used in the configuration, and compilation logs.

1. Sign in to the [Azure portal][28].
1. On the left, select **All resources** and then the name of your Automation account.
1. On the Automation account page, select **State configuration (DSC)** under **Configuration
   Management**.
1. On the State configuration (DSC) page, select the **Configurations** tab, then select the name of
   the previously imported configuration, **TestConfig**.
1. Under **Compilation jobs**, select the compilation job to view. A Compilation Job pane opens,
   labeled with the date when the compilation job was started.

   ![Screenshot of the Compilation Job page][05]

1. To see further details about the job, select any tile in the Compilation Job pane.

## View node configurations

Successful completion of a compilation job creates one or more new node configurations. A node
configuration is a MOF document that you deploy to the pull server. You can view the node
configurations in your Automation account on the State configuration (DSC) page. A node
configuration has a name with the form `ConfigurationName.NodeName`.

1. Sign in to the [Azure portal][28].
1. On the left, select **All resources** and then the name of your Automation account.
1. On the Automation account page, select **State configuration (DSC)** under **Configuration
   Management**.
1. On the State configuration (DSC) page, select the **Compiled configurations** tab.

   ![Screenshot of the Compiled Configurations tab][07]

## Enable an Azure Resource Manager VM for management with State Configuration

You can use State Configuration to manage Azure VMs (both classic and Resource Manager), on-premises
VMs, Linux machines, AWS VMs, and on-premises physical machines. In this article, you learn how to
enable only Azure Resource Manager VMs. For information about enabling other types of machines, see
[Enable machines for management by Azure Automation State Configuration][22].

1. Sign in to the [Azure portal][28].
1. On the left, select **All resources** and then the name of your Automation account.
1. On the Automation account page, select **State configuration (DSC)** under **Configuration
   Management**.
1. On the State configuration (DSC) page, select the **Nodes** tab, then select **+ Add**.

   ![Screenshot of the DSC Nodes page highlighting the Add Azure VM button][10]

1. On the Virtual Machines pane, select your VM.
1. On the Virtual machine detail pane, select **+ Connect**.

   > [!IMPORTANT]
   > The VM must be an Azure Resource Manager VM running a [supported operating system][24].

1. On the Registration page, select the name of the node configuration to apply to the VM in the
   **Node configuration name** field. Providing a name at this point is optional. You can change the
   assigned node configuration after enabling the node.

1. Check **Reboot Node if Needed**, then select **OK**.

   ![Screenshot of the Registration blade][11]

   The node configuration you specified is applied to the VM at intervals specified by the value
   provided for **Configuration Mode Frequency**. The VM checks for updates to the node
   configuration at intervals specified by the **Refresh Frequency** value. For more information
   about how these values are used, see [Configuring the Local Configuration Manager][16].

Azure starts the process of enabling the VM. When complete, the VM shows up in the **Nodes** tab of
the State configuration (DSC) page in the Automation account.

## View the list of managed nodes

The **Nodes** tab of the State configuration (DSC) page contains a list of all machines enabled for
management in your Automation account.

1. Sign in to the [Azure portal][28].
1. On the left, select **All resources** and then the name of your Automation account.
1. On the Automation account page, select **State configuration (DSC)** under **Configuration
   Management**.
1. On the State configuration (DSC) page, select the **Nodes** tab.


### DSC nodes status values

The DSC node can take any of the following six values as follows:

- **Failed** - This status is displayed when an error occurs while applying one or more
  configurations on a node.
- **Not compliant** - This status is displayed when drift occurs on a node and it requires a close
  review.
- **Unresponsive** - This status is displayed when a node hasn't been checked in for more than 24
  hours.
- **Pending** - This status is displayed when a node has a new configuration to apply and the pull
  server is waiting for the node to check in.
- **In progress** - This status is displayed when a node applies configuration, and the pull server
  is awaiting status.
- **Compliant** - This status is displayed when a node has a valid configuration, and no drift
  occurs presently.

> [!NOTE]
> - **RefreshFrequencyMins** - It defines the frequency of node contacting the agent service and can
>   be provided as part of onboarding to DSC. It takes a maximum value of 10080 minutes.
> - Node will be marked as **Unresponsive** if the node does not contact the agent service for 1440
>   minutes (1 Day). We recommend that you use **RefreshFrequencyMins** value < 1440 minutes, else
>   the node would show in a false **Unresponsive** state.

## View reports for managed nodes

Each time State Configuration performs a consistency check on a managed node, the node sends a
status report back to the pull server. You can view these reports on the page for that node.

1. Sign in to the [Azure portal][28].
1. On the left, select **All resources** and then the name of your Automation account.
1. On the Automation account page, select **State configuration (DSC)** under **Configuration
   Management**.
1. On the State configuration (DSC) page, select the **Nodes** tab. Here, you can see the overview of
   Configuration state and the details for each node.

   ![Screenshot of Node page][09]

1. While on the **Nodes** tab, select the node record to open the reporting. Select the report you
   want to view.

   ![Screenshot of the Report pane][08]

You can see the following status information for the corresponding consistency check:

- The report status. Possible values are:
  - `Compliant` - the node is compliant with the check.
  - `Failed` - the configuration failed the check.
  - `Not Compliant` - the node is in `ApplyandMonitor` mode and the machine isn't in the desired
    state.
- The start time for the consistency check.
- The total runtime for the consistency check.
- The type of consistency check.
- Any errors, including the error code and error message.
- Any DSC resources used in the configuration, and the state of each resource (whether the node is
  in the desired state for that resource). You can select on each resource to get more detailed
  information for that resource.
- The name, IP address, and configuration mode of the node.

You can also select **View raw report** to see the actual data that the node sends to the server. For
more information about using that data, see [Using a DSC report server][18].

It can take some time before the first report is available, after a node is enabled or restarted. You might need to wait up to 30 minutes after you enable a node or restart a node.

## Reassign a node to a different node configuration

You can assign a node to use a different node configuration than the one you initially assigned.

1. Sign in to the [Azure portal][28].
1. On the left, select **All resources** and then the name of your Automation account.
1. On the Automation account page, select **State configuration (DSC)** under **Configuration
   Management**.
1. On the State configuration (DSC) page, select the **Nodes** tab.
1. On the **Nodes** tab, select on the name of the node you want to reassign.
1. On the page for that node, select **Assign node configuration**.

   ![Screenshot of the Node details page highlighting the Assign node configuration button][03]

1. On the Assign Node Configuration page, select the node configuration to which you want to assign
   the node, and then select **OK**.

   ![Screenshot of the Assign Node Configuration page][04]

## Unregister a node

You can unregister a no if you no longer want State Configuration to manage it. See
[How to remove a configuration and node from Automation State Configuration][13].

## Next steps

- For an overview, see [Azure Automation State Configuration overview][23].
- To enable the feature for VMs in your environment, see
  [Enable Azure Automation State Configuration][22].
- To understand PowerShell DSC, see [Windows PowerShell Desired State Configuration Overview][17].
- For pricing information, see [Azure Automation State Configuration pricing][25].
- For a PowerShell cmdlet reference, see [Az.Automation][20].

<!-- link references -->
[01]: ./automation-security-overview.md
[02]: ./media/automation-dsc-getting-started/AddConfig.png
[03]: ./media/automation-dsc-getting-started/AssignNode.png
[04]: ./media/automation-dsc-getting-started/AssignNodeConfig.png
[05]: ./media/automation-dsc-getting-started/CompilationJob.png
[06]: ./media/automation-dsc-getting-started/CompileConfig.png
[07]: ./media/automation-dsc-getting-started/NodeConfigs.png
[08]: ./media/automation-dsc-getting-started/NodeReport.png
[09]: ./media/automation-dsc-getting-started/NodesTab.png
[10]: ./media/automation-dsc-getting-started/OnboardVM.png
[11]: ./media/automation-dsc-getting-started/RegisterVM.png
[12]: ./media/automation-dsc-getting-started/ViewConfigSource.png
[13]: ./state-configuration/remove-node-and-configuration-package.md
[14]: /azure/virtual-machines/windows/quick-create-portal
[15]: /powershell/dsc/configurations/configurations
[16]: /powershell/dsc/managing-nodes/metaConfig
[17]: /powershell/dsc/overview
[18]: /powershell/dsc/pull-server/reportserver
[19]: /powershell/dsc/reference/resources/windows/windowsfeatureresource
[20]: /powershell/module/az.automation
[21]: automation-dsc-compile.md
[22]: automation-dsc-onboarding.md
[23]: automation-dsc-overview.md
[24]: automation-dsc-overview.md#operating-system-requirements
[25]: https://azure.microsoft.com/pricing/details/automation/
[26]: https://code.visualstudio.com/docs
[27]: https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.automation/automation-configuration
[28]: https://portal.azure.com
