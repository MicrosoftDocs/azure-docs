---
title: Migrate from Orchestrator to Azure Automation (Beta)
description: This article tells how to migrate runbooks and integration packs from Orchestrator to Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 03/16/2018
ms.topic: conceptual
---
# Migrate from Orchestrator to Azure Automation (Beta)

Runbooks in [System Center 2012 - Orchestrator](https://technet.microsoft.com/library/hh237242.aspx) are based on activities from integration packs that are written specifically for Orchestrator, while runbooks in Azure Automation are based on Windows PowerShell. [Graphical runbooks](automation-runbook-types.md#graphical-runbooks) in Azure Automation have a similar appearance to Orchestrator runbooks, with their activities representing PowerShell cmdlets, child runbooks, and assets. In addition to converting runbooks themselves, you must convert the integration packs with the activities that the runbooks use to integration modules with Windows PowerShell cmdlets. 

[Service Management Automation](https://technet.microsoft.com/library/dn469260.aspx) (SMA) stores and runs runbooks in your local datacenter like Orchestrator, and it uses the same integration modules as Azure Automation. The Runbook Converter converts Orchestrator runbooks to graphical runbooks, which are not supported in SMA. You can still install the Standard Activities Module and System Center Orchestrator Integration Modules into SMA, but you must manually [rewrite your runbooks](https://technet.microsoft.com/library/dn469262.aspx).

## Download the Orchestrator migration toolkit

The first step in migration is to download the [System Center Orchestrator Migration Toolkit](https://www.microsoft.com/download/details.aspx?id=47323&WT.mc_id=rss_alldownloads_all). This toolkit includes tools to assist you in converting runbooks from Orchestrator to Azure Automation.  

## Import the Standard Activities module

Import the [Standard Activities Module](https://docs.microsoft.com/system-center/orchestrator/standard-activities?view=sc-orch-2019) into Azure Automation. This includes converted versions of standard Orchestrator activities that converted graphical runbooks can use.

## Import Orchestrator integration modules

Microsoft provides [integration packs](https://technet.microsoft.com/library/hh295851.aspx) for building runbooks to automate System Center components and other products. Some of these integration packs are currently based on OIT but cannot currently be converted to integration modules because of known issues. Import [System Center Orchestrator Integration Modules](https://www.microsoft.com/download/details.aspx?id=49555) into Azure Automation for the integration packs used by your runbooks that access System Center. This package includes converted versions of the integration packs that can be imported into Azure Automation and Service Management Automation.  

## Convert integration packs

Use the [Integration Pack Converter](https://docs.microsoft.com/system-center/orchestrator/orch-integration-toolkit/integration-pack-wizard?view=sc-orch-2019) to convert any integration packs created using the [Orchestrator Integration Toolkit (OIT)](https://technet.microsoft.com/library/hh855853.aspx) to PowerShell-based integration modules that can be imported into Azure Automation or Service Management Automation. When you run the Integration Pack Converter, you are presented with a wizard that allows you to select an integration pack (.oip) file. The wizard then lists the activities included in that integration pack and allows you to select which activities to migrate. When you complete the wizard, it creates an integration module that includes a corresponding cmdlet for each of the activities in the original integration pack.

> [!NOTE]
> You can't use the Integration Pack Converter to convert integration packs that were not created with OIT. There are also some integration packs provided by Microsoft that can't currently be converted with this tool. Converted versions of these integration packs are provided for download so that they can be installed in Azure Automation or Service Management Automation.

### Parameters

Any properties of an activity in the integration pack are converted to parameters of the corresponding cmdlet in the integration module.  Windows PowerShell cmdlets have a set of [common parameters](https://technet.microsoft.com/library/hh847884.aspx) that can be used with all cmdlets. For example, the -Verbose parameter causes a cmdlet to output detailed information about its operation.  No cmdlet may have a parameter with the same name as a common parameter. If an activity does have a property with the same name as a common parameter, the wizard prompts you to provide another name for the parameter.

### Monitor activities

Monitor runbooks in Orchestrator start with a [monitor activity](https://technet.microsoft.com/library/hh403827.aspx) and run continuously waiting to be invoked by a particular event. Azure Automation does not support monitor runbooks, so any monitor activities in the integration pack is not converted. Instead, a placeholder cmdlet is created in the integration module for the monitor activity.  This cmdlet has no functionality, but it allows any converted runbook that uses it to be installed. This runbook is not able to run in Azure Automation, but it can be installed so that you can modify it.

Orchestrator includes a set of [standard activities](https://technet.microsoft.com/library/hh403832.aspx) that are not included in an integration pack but are used by many runbooks.  The Standard Activities module is an integration module that includes a cmdlet equivalent for each of these activities. You must install this integration module in Azure Automation before importing any converted runbooks that use a standard activity.

In addition to supporting converted runbooks, the cmdlets in the standard activities module can be used by someone familiar with Orchestrator to build new runbooks in Azure Automation. While the functionality of all of the standard activities can be performed with cmdlets, they may operate differently. The cmdlets in the converted standard activities module work in the same way as their corresponding activities and use the same parameters. This can help you in transitioning to Azure Automation runbooks.

## Convert Orchestrator runbooks

The Orchestrator Runbook Converter converts Orchestrator runbooks into [graphical runbooks](automation-runbook-types.md#graphical-runbooks) that can be imported into Azure Automation. The Runbook Converter is implemented as a PowerShell module with the cmdlet `ConvertFrom-SCORunbook` that makes the conversion. When you install the converter, it creates a shortcut to a PowerShell session that loads the cmdlet.   

Here are the basic steps to convert a runbook and import it into Azure Automation. Details of using the cmdlet are provided later in this section.

1. Export one or more runbooks from Orchestrator.
2. Obtain integration modules for all activities in the runbook.
3. Convert the Orchestrator runbooks in the exported file.
4. Review information in logs to validate the conversion and to determine any required manual tasks.
5. Import converted runbooks into Azure Automation.
6. Create any required assets in Azure Automation.
7. Edit the runbook in Azure Automation to modify any required activities.

The syntax for `ConvertFrom-SCORunbook` is:

```powershell
ConvertFrom-SCORunbook -RunbookPath <string> -Module <string[]> -OutputFolder <string>
```

* RunbookPath - Path to the export file containing the runbooks to convert.
* Module - Comma delimited list of integration modules containing activities in the runbooks.
* OutputFolder - Path to the folder to create converted graphical runbooks.

The following example command converts the runbooks in an export file called **MyRunbooks.ois_export**.  These runbooks use the Active Directory and Data Protection Manager integration packs.

```powershell
ConvertFrom-SCORunbook -RunbookPath "c:\runbooks\MyRunbooks.ois_export" -Module c:\ip\SystemCenter_IntegrationModule_ActiveDirectory.zip,c:\ip\SystemCenter_IntegrationModule_DPM.zip -OutputFolder "c:\runbooks"
```

### Use Runbook Converter log files

The Runbook Converter create the following log files in the same location as the converted runbook.  If the files already exist, they are overwritten with information from the last conversion.

| File | Contents |
|:--- |:--- |
| Runbook Converter - Progress.log |Detailed steps of the conversion including information for each activity successfully converted and warning for each activity not converted. |
| Runbook Converter - Summary.log |Summary of the last conversion including any warnings and follow up tasks that you need to perform such as creating a variable required for the converted runbook. |

### Export runbooks from Orchestrator

The Runbook Converter works with an export file from Orchestrator that contains one or more runbooks.  It creates a corresponding Azure Automation runbook for each Orchestrator runbook in the export file.  

To export a runbook from Orchestrator, right-click the name of the runbook in Runbook Designer and select **Export**.  To export all runbooks in a folder, right-click the name of the folder and select **Export**.

### Convert runbook activities

The Runbook Converter converts each activity in the Orchestrator runbook to a corresponding activity in Azure Automation.  For those activities that can't be converted, a placeholder activity is created in the runbook with warning text.  After you import the converted runbook into Azure Automation, you must replace any of these activities with valid activities that perform the required functionality.

Any Orchestrator activities in the Standard Activities Module are converted. There are some standard Orchestrator activities that are not in this module though and are not converted. For example, `Send Platform Event` has no Azure Automation equivalent since the event is specific to Orchestrator.

[Monitor activities](https://technet.microsoft.com/library/hh403827.aspx) are not converted since there is no equivalent to them in Azure Automation. The exceptions are monitor activities in converted integration packs that are converted to the placeholder activity.

Any activity from a converted integration pack is converted if you provide the path to the integration module with the `modules` parameter. For System Center Integration Packs, you can use the System Center Orchestrator Integration Modules.

### Manage Orchestrator resources

The Runbook Converter only converts runbooks, not other Orchestrator resources such as counters, variables, or connections.  Counters are not supported in Azure Automation.  Variables and connections are supported, but you must create them manually. The log files inform you if the runbook requires such resources and specify corresponding resources that you need to create in Azure Automation for the converted runbook to operate properly.

For example, a runbook may use a variable to populate a particular value in an activity.  The converted runbook converts the activity and specifies a variable asset in Azure Automation with the same name as the Orchestrator variable. This action is noted in the **Runbook Converter - Summary.log** file that is created after the conversion. You must manually create this variable asset in Azure Automation before using the runbook.

### Work with Orchestrator input parameters

Runbooks in Orchestrator accept input parameters with the `Initialize Data` activity.  If the runbook being converted includes this activity, then an [input parameter](automation-graphical-authoring-intro.md#handle-runbook-input) in the Azure Automation runbook is created for each parameter in the activity.  A [Workflow Script control](automation-graphical-authoring-intro.md#use-activities) activity is created in the converted runbook that retrieves and returns each parameter. Any activities in the runbook that use an input parameter refer to the output from this activity.

The reason that this strategy is used is to best mirror the functionality in the Orchestrator runbook.  Activities in new graphical runbooks should refer directly to input parameters using a Runbook input data source.

### Invoke Runbook activity

Runbooks in Orchestrator start other runbooks with the `Invoke Runbook` activity. If the runbook being converted includes this activity and the `Wait for completion` option is set, then a runbook activity is created for it in the converted runbook.  If the `Wait for completion` option is not set, then a Workflow Script activity is created that uses [Start-AzAutomationRunbook](https://docs.microsoft.com/powershell/module/az.automation/start-azautomationrunbook?view=azps-3.7.0) to start the runbook. After you import the converted runbook into Azure Automation, you must modify this activity with the information specified in the activity.

## Create Orchestrator assets

The Runbook Converter does not convert Orchestrator assets. You must manually create any required Orchestrator assets in Azure Automation.

## Configure Hybrid Runbook Worker

Orchestrator stores runbooks on a database server and runs them on runbook servers, both in your local datacenter. Runbooks in Azure Automation are stored in the Azure cloud and can run in your local datacenter using a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md). Configure a worker to run your runbooks converted from Orchestrator, since they are designed to run on local servers and access local resources.

## Related articles

* For Orchestrator details, see [System Center 2012 - Orchestrator](https://technet.microsoft.com/library/hh237242.aspx).
* Learn more about automating the management of services in [Service Management Automation](https://technet.microsoft.com/library/dn469260.aspx).
* Details of Orchestrator activities can be found in [Orchestrator Standard Activities](https://technet.microsoft.com/library/hh403832.aspx).
* To obtain the Orchestrator migration toolkit, see [Download System Center Orchestrator Migration Toolkit](https://www.microsoft.com/download/details.aspx?id=47323).
* For an overview of the Azure Automation Hybrid Runbook Worker, see [Hybrid Runbook Worker overview](automation-hybrid-runbook-worker.md).