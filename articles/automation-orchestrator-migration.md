<properties 
   pageTitle="Migrating runbooks and integration packs from Orchestrator"
   description="Describes how to migrate runbooks and integration packs from System Center Orchestrator to Azure Automation."
   services="automation"
   documentationCenter=""
   authors="bwren"
   manager="stevenka"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/04/2015"
   ms.author="bwren" />


# Migrating from Orchestrator to Azure Automation

Runbooks in [System Center Orchestrator](http://technet.microsoft.com/library/hh237242.aspx) are based on activities from integration packs that are written specifically for Orchestrator while runbooks in Azure Automation are based on Windows PowerShell Workflows.  Graphical runbooks in Azure Automation have a similar appearance to Orchestrator runbooks with their activities representing PowerShell cmdlets, child runbooks, and assets. 

The **System Center Orchestrator Migration Toolkit** includes tools to assist you in converting runbooks from Orchestrator to Azure Automation.  In addition to converting the runbooks themselves, you must convert the integration packs with the activities that they use to integration modules with Windows PowerShell cmdlets.  

Following is the the basic process for converting Orchestrator runbooks to Azure Automation.  Each of these steps is described in detail in the sections below.

1.  Download the System Center Orchestrator Migration Toolkit which contains the tools and modules discussed in this article. 
2.  Install [Standard Activities Module](standard-activities-module) into Azure Automation.  This includes converted versions of standard Orchestrator activities that may be used by converted runbooks.
2.  Install converted Microsoft integration packs into Azure Automation.  These are modules for Microsoft technologies that have been converted from Orchestrator integration packs that may contain activities that are used by converted runbooks. 
3.  Convert custom and third party integration packs using the [Integration Pack Converter](#integration-pack-converter) and install in Azure Automation.
4.  Manually recreate [global assets](#global-assets) in Orchestrator in Azure Automation since there is no automated method to perform this migration.
5.  Convert Orchestrator runbooks using the [Runbook Converter](#runbook-converter) (coming soon) and install in Azure Automation.
6.  Configure a [Hybrid Runbook Worker](#hybrid-runbook-worker) in your local data center to run the converted runbooks.

## Service Management Automation

[Service Management Automation](https://technet.microsoft.com/en-us/library/dn469260.aspx) (SMA) stores and runs runbooks in your local data center like Orchestrator, and it uses the same integration modules as Azure Automation.  When it is available, the [Runbook Converter](#runbookconverter) will convert Orchestrator runbooks to graphical runbooks though which are not supported in SMA.  You can still install the [Standard Activities Module](#standardactivitiesmodule) and any converted [integration packs](#integrationpackconverter) into SMA, but you must manually [rewrite your runbooks](http://technet.microsoft.com/library/dn469262.aspx).

## Hybrid Runbook Worker

Runbooks in Orchestrator are stored on a database server and run on runbook servers, both in your local data center.  Runbooks in Azure Automation are stored in the Azure cloud and can run in your local data center using a [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md).  This is how you will usually run runbooks converted from Orchestrator since they are designed to run on local servers.

## Integration Pack Converter

The Integration Pack Converter converts integration packs that were created using the Orchestrator Integration Toolkit (OIT) to integration modules based on Windows PowerShell that can be imported into Azure Automation or Service Management Automation.  

When you run the Integration Pack Converter, you are presented with a wizard that will allow you to select an integration pack (.oip) file.  The wizard then lists the activities included in that integration pack and allows you to select which will be migrated.  When you complete the wizard, it creates a module that includes a corresponding cmdlet for each of the activities in the original integration pack.


### Parameters

Any properties of an activity in the integration pack are converted to parameters of the corresponding cmdlet in the integration module.  Windows PowerShell cmdlets have a set of [common parameters](http://technet.microsoft.com/library/hh847884.aspx) that can be used with all cmdlets.  For example, the -Verbose parameter causes a cmdlet to output detailed information about its operation.  No cmdlet may have a parameter with the same name as a common parameter.  If an activity does have a property with the same name as a common parameter, the wizard will prompt you to provide another name for the parameter.

### Monitor activities

Monitor runbooks in Orchestrator start with a [monitor activity](http://technet.microsoft.com/library/hh403827.aspx) and run continuously waiting to be invoked by a particular event.  Azure Automation does not support monitor runbooks, so any monitor activities in the integration pack will not be converted.  Instead, a placeholder cmdlet is created in the integration module for the monitor activity.  This cmdlet has no functionality, but it allows any converted runbook that uses it to be installed.  This runbook will not be able to run in Azure Automation, but it can be installed so that the user can modify it.

### Integration packs that cannot be converted

Integration packs that were not created with OIT, including some created by Microsoft, cannot be converted with this tool.  Integration packs provided by Microsoft have been converted to integration modules so that they can be installed in Azure Automation or Service Management Automation.


## Standard Activities Module

Orchestrator includes a set of [standard activities](http://technet.microsoft.com/library/hh403832.aspx) that are not included in an integration pack but are used by many runbooks.  The Standard Activities module is a integration module that includes a cmdlet equivalent for each of these activities.  You must install this integration module in Azure Automation before importing any converted runbooks that use a standard activity.

In addition to supporting converted runbooks, the cmdlets in the standard activities module can be used by someone familiar with Orchestrator to build new runbooks in Azure Automation.  While the functionality of all of the standard activities can be performed with cmdlets, they may operate differently.  The cmdlets in the converted standard activities module will work the same as their corresponding activities and use the same parameters.  This can help the existing Orchestrator runbook author in their transition to Azure Automation runbooks.

## Runbook Converter (coming soon)

This tool will convert Orchestrator runbooks into graphical runbooks that can be imported into Azure Automation.  Further details on this tool will be provided here when it comes available.

## Related articles

- [System Center 2012 - Orchestrator](http://technet.microsoft.com/library/hh237242.aspx)
- [Service Management Automation](https://technet.microsoft.com/en-us/library/dn469260.aspx)
- [Hybrid Runbook Worker](automation-hybrid-runbook-worker.md)
- [Orchestrator Standard Activities](http://technet.microsoft.com/library/hh403832.aspx)





