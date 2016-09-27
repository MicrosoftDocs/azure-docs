<properties
    pageTitle="VM Management Solution | Microsoft Azure"
    description="The VM Management solutions starts and stops your Azure Resource Manager Virtual Machines on a schedule and proactively monitor from Log Analytics."
    services="automation"
    documentationCenter=""
    authors="MGoedtel"
    manager="jwhit"
    editor=""
	/>
<tags
    ms.service="automation"
    ms.workload="tbd"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="get-started-article"
    ms.date="09/22/2016"
    ms.author="magoedte"/>

# ![VM Management Solution in Automation](media/automation-solution-vm-management/vm-management-solution-icon.png) VM Management solution in Automation

The VM Management solutions starts and stops your Azure Resource Manager virtual machines on a user-defined schedule and provides insight into the success of the Automation jobs that start and stop your virtual machines with OMS Log Analytics.  

## Prerequisites

- The runbook works with an [Azure Run As account](automation-sec-configure-azure-runas-account.md).  The Run As account is the preferred authentication credential since it uses certificate authentication instead of a password that may expire or change frequently.  

- This solution can only manage VMs which are in the same subscription and resource group as where the Automation account resides.  

- This solution only works in the following Azure regions - Australia Southeast, East US, Southeast Asia, and West Europe.

- To send email notifications when the start and stop VM runbooks complete, an Office 365  business-class subscription is required.  

## Solution components

This solution consists of the following resources that will be imported and added to your Automation account.

### Runbooks

Runbook | Description|
----------|------------|
CleanSolution-MS-Mgmt-VM | This runbook will remove all contained resources, remove all locks, and schedules when you go to delete the solution from your subscription.|  
SendMailO365-MS-Mgmt | This runbook sends an email through Office 365 Exchange.|
StartByResourceGroup-MS-Mgmt-VM | This runbook is intended to start VMs (both classic and ARM based VMs) that resides in a given list of Azure resource group(s).
StopByResourceGroup-MS-Mgmt-VM | This runbook is intended to stop VMs (both classic and ARM based VMs) that resides in a given list of Azure resource group(s).|
<br>

### Variables

Variable | Description|
----------|------------|
**SendMailO365-MS-Mgmt** Runbook ||
SendMailO365-IsSendEmail-MS-Mgmt | Specifies if StartByResourceGroup-MS-Mgmt-VM and StopByResourceGroup-MS-Mgmt-VM runbooks can send email notification upon completion.  Select **True** to enable and **False** to disable email alerting. Default value is **False**.| 
**StartByResourceGroup-MS-Mgmt-VM** Runbook ||
StartByResourceGroup-ExcludeList-MS-Mgmt-VM | Enter VM names to be excluded from management operation; separate names by using semi-colon(;). Values are case-sensitive and wildcard (asterisk) is supported.|
StartByResourceGroup-SendMailO365-EmailBodyPreFix-MS-Mgmt | Text that can be appended to the beginning of the email message body.|
StartByResourceGroup-SendMailO365-EmailRunBookAccount-MS-Mgmt | Specifies the name of the Automation Account that contains the Email runbook.  **Do not modify this variable.**|
StartByResourceGroup-SendMailO365-EmailRunbookName-MS-Mgmt | Specifies the name of the email runbook.  This is used by the StartByResourceGroup-MS-Mgmt-VM and StopByResourceGroup-MS-Mgmt-VM runbooks to send email.  **Do not modify this variable.**|
StartByResourceGroup-SendMailO365-EmailRunbookResourceGroup-MS-Mgmt | Specifies the name of the Resource group that contains the Email runbook.  **Do not modify this variable.**|
StartByResourceGroup-SendMailO365-EmailSubject-MS-Mgmt | Specifies the text for the subject line of the email.|  
StartByResourceGroup-SendMailO365-EmailToAddress-MS-Mgmt | Specifies the recipient(s) of the email.  Enter separate names by using semi-colon(;).|
StartByResourceGroup-TargetResourceGroups-MS-Mgmt-VM | Enter VM names to be excluded from management operation; separate names by using semi-colon(;). Values are case-sensitive and wildcard (asterisk) is supported.  Default value (asterisk) will include all resource groups in the subscription.|
StartByResourceGroup-TargetSubscriptionID-MS-Mgmt-VM | Specifies the subscription that contains VMs to be managed by this solution.  This must be the same subscription where the Automation account of this solution resides.|   
**StopByResourceGroup-MS-Mgmt-VM ** ||
StopByResourceGroup-ExcludeList-MS-Mgmt-VM | Enter VM names to be excluded from management operation; separate names by using semi-colon(;). Values are case-sensitive and wildcard (asterisk) is supported.|
StopByResourceGroup-SendMailO365-EmailBodyPreFix-MS-Mgmt | Text that can be appended to the beginning of the email message body.|
StopByResourceGroup-SendMailO365-EmailRunBookAccount-MS-Mgmt | Specifies the name of the Automation Account that contains the Email runbook.  **Do not modify this variable.**|
StopByResourceGroup-SendMailO365-EmailRunbookResourceGroup-MS-Mgmt | Specifies the name of the Resource group that contains the Email runbook.  **Do not modify this variable.**|
StopByResourceGroup-SendMailO365-EmailSubject-MS-Mgmt | Specifies the text for the subject line of the email.|  
StopByResourceGroup-SendMailO365-EmailToAddress-MS-Mgmt | Specifies the recipient(s) of the email.  Enter separate names by using semi-colon(;).|
StopByResourceGroup-TargetResourceGroups-MS-Mgmt-VM | Enter VM names to be excluded from management operation; separate names by using semi-colon(;). Values are case-sensitive and wildcard (asterisk) is supported.  Default value (asterisk) will include all resource groups in the subscription.|
StopByResourceGroup-TargetSubscriptionID-MS-Mgmt-VM | Specifies the subscription that contains VMs to be managed by this solution.  This must be the same subscription where the Automation account of this solution resides.|  
<br>

### Schedules

Schedule | Description|
----------|------------|
StartByResourceGroup-Schedule-MS-Mgmt | Schedule for StartByResourceGroup runbook.|
StopByResourceGroup-Schedule-MS-Mgmt | Schedule for StopByResourceGroup runbook.|

## Configuration

Perform the following steps to add the VM Management solution to your Automation account and then configure the variables to customize the solution.

1. From the home-screen in the Azure portal, select the **Marketplace** tile.  If the tile is no longer pinned to your home-screen, from the left navigation pane, select **New**.  
2. In the Marketplace blade, type **Start VM** in the search box, and then select the solution **Start/Stop VMs during off-hours preview** from the search results.  
3. In the **Start/Stop VMs during off-hours preview** blade for the selected solution, review the summary information and then click **Create**, and the **Add Soultion** blade appears where you are prompted to configure three items before you can import the solution into your Automation subscription.<br> ![VM Management Add Solution blade](media/automation-solution-vm-management/vm-management-solution-add-solution-blade.png)
  
4. On the **Add Solution** blade, you are required to configure the following before the solution can be created in your Automation account:

    a. Workspace: you can select an OMS workspace that is linked to the same Azure subscription that the Automation account is in.  If you do not have an OMS workpace, you can select  **Create New Workspace** and in the **OMS Workspace** blade you are asked to provide: 
      - **OMS Workspace** - Provide a name for a new workspace.  
      - **Subscription** - A subscription to link to by selecting from the drop-down list if the default selected is not appropriate.
      - **Resource Group** - Select either an existing Resource Group or a new Resource Group.
      - **Location** - Currently the only locations provided for selection are **Australia Southeast**, **East US**, **Southeast Asia**, and **West Europe**.
      - **Pricing tear** - <provide brief description>.

    b. Automation Account:  If you are creating a new OMS workspace, you will be required to also create a new Automation account that will be tied to the new OMS workspace specified above, including the Azure subscription, resource group and region.  You can select  **Create an Automation account** and in the **Add Automation account** blade you are asked to provide:
      - **Name** - the name of the Automation account.
      
      All other options are automatically populated based on the OMS workspace selected and an Azure Run As account is the default authentication method for the runbooks included in this solution. These options cannot be modified.  Once you click **OK**, the configuration options are validated and the Automation account is created.  
    c. Configuration: on the **Parameters** blade, you are asked to provide:
      - **Target ResourceGroup Names** - The resource group name that contain VMs to be managed by this solution.  You can enter more than one name and separate each using a semi-colon (values are case-sensitive).  Using a wildcard is supported if you want to target VMs in all resource groups in the subscription.  
      - **Schedule** - Enter a recurring date and time for starting and stopping the VM's in the target resource group(s).  
  
5. Once you have completed configuring the initial settings required for the solution, select **Create**.  All settings will be validated and then it will attempt to deploy in your subscription.  This process can take several seconds to complete.  

## Collection frequency

Automation job log and job stream data is ingested into OMS repository every five (5) minutes.  

## Using the solution


## Log Analytics records

Automation creates two types of records in the OMS repository.

### Job Logs

Property | Description|
----------|----------|
Time | Date and time when the runbook job executed.|
resourceId | Specifies the resource type in Azure.  For Automation, the value is the Automation account associated with the runbook.|
operationName | Specifies the type of operation performed in Azure.  For Automation, the value will be Job.|
resultType | The status of the runbook job.  Possible values are:<br>- Started<br>- Stopped<br>- Suspended<br>- Failed<br>- Succeeded|
resultDescription | Describes the runbook job result state.  Possible values are:<br>- Job is started<br>- Job Failed<br>- Job Completed|
CorrelationId | GUID that is the Correlation Id of the runbook job.|
Category | Classification of the type of data.  For Automation, the value is JobLogs.|
RunbookName | The name of the runbook.|
JobId | GUID that is the Id of the runbook job.|
Caller |  Who initiated the operation.  Possible values are either an email address or system for scheduled jobs.|

### Job Streams
Property | Description|
----------|----------|
Time | Date and time when the runbook job executed.|
resourceId | Specifies the resource type in Azure.  For Automation, the value is the Automation account associated with the runbook.|
operationName | Specifies the type of operation performed in Azure.  For Automation, the value will be Job.|
resultType | The status of the runbook job.  Possible values are:<br>- InProgress|
resultDescription | Includes the output stream from the runbook.|
CorrelationId | GUID that is the Correlation Id of the runbook job.|
Category | Classification of the type of data.  For Automation, the value is JobStreams.|
RunbookName | The name of the runbook.|
JobId | GUID that is the Id of the runbook job.|
Caller | Who initiated the operation.  Possible values are either an email address or system for scheduled jobs.| 
StreamType | The type of job stream. Possible values are:<br>-Progress<br>- Output<br>- Warning<br>- Error<br>- Debug<br>- Verbose|
   

