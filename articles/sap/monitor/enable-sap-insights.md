---
title: Enable SAP Insights
description: Learn to enable SAP Insights on your AMS instance.
author: akarshprabhu
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 05/01/2023
ms.author: akak
#Customer intent: I am an SAP BASIS or cloud infrastructure team member, I want to enable SAP Insights on my Azure monitor for SAP Instance.
---

# Enable Insights in Azure Monitor for SAP solutions (preview)

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-Azure-monitor.md)]

The Insights capability in Azure Monitor for SAP Solutions helps you troubleshoot Availability and Performance issues on your SAP workloads. It helps you correlate key SAP components issues with SAP logs and Azure platform metrics and health events. 
In this how-to-guide, learn to enable Insights in Azure Monitor for SAP solutions. You can use SAP Insights with only the latest version of the service, *Azure Monitor for SAP solutions* and not *Azure Monitor for SAP solutions (classic)*

> [!NOTE]
> This section applies to only Azure Monitor for SAP solutions.

## Prerequisites

- An Azure subscription.
- An existing Azure Monitor for SAP solutions resource. To create an Azure Monitor for SAP solutions resource, see the [quickstart for the Azure portal](quickstart-portal.md) or the [quickstart for PowerShell](quickstart-powershell.md).
- An existing NetWeaver and HANA(optional) provider. To configure a NetWeaver provider, see the How to guides for [NetWeaver provider configuration](provider-netweaver.md).
- (Optional) Alerts set up for availability and/or performance issues on the NetWeaver/HANA provider. To configure a NetWeaver provider, see the How to guides for [setting up Alerts on Azure Monitor for SAP](get-alerts-portal.md)

## Steps to Enable Insights in Azure Monitor for SAP solutions

To enable Insights for Azure Monitor for SAP solutions, you need to:

1. [Run a PowerShell script for access](#run-a-powershell-script-for-access)
1. [Prerequisite - Unprotect methods](#unprotect-the-getenvironment-method)

### Run a PowerShell script for access

> [!Note]
> This step gives your Azure Monitor for SAP solutions(AMS) instance access to Azure resource graph. With this access your AMS instance will be able to pull ARM IDs of virtual machines on which the linked SAP systems are hosted. This will help your AMS instance correlate issues you face with Azure infrastructure telemetry, giving you an end-to-end troubleshooting experience. 

> [!Important]
> To run this script succesfully, ensure you have Contributor + User Access Admin or Owner access on all subscriptions in the list. See steps to assign Azure roles.
1. Download the onboarding script [from github](https://github.com/Azure/Azure-Monitor-for-SAP-solutions-preview/blob/main/Scripts/AMS_AIOPS_SETUP.ps1)
2. Go to the Azure portal and select the Cloud Shell tab from the menu bar at the top. Refer [this guide](https://learn.microsoft.com/en-us/azure/cloud-shell/quickstart?tabs=azurecli) to get started with Cloud Shell. 
3. Switch from Bash to PowerShell.
4. Upload the script downloaded in the first step.
5. Use ```cd <script_path>```  command to navigate to the folder where the script is present. 
6. Set the AMS Resource/ARM ID with the command: 
```ARM ID
$armId = “<AMS ARM ID>"
```
7.	If the VMs belong to a different subscription than AMS, set the list of subscriptions in which VMs of the SAP system are present (use subscription IDs): 
```
$subscriptions = "<Subscription ID 1>","<Subscription ID 2>"
```
8.	Run the script uploaded from step 6 using the command:
   * If $subscriptions was set: 
```
.\AMS_AIOPS_SETUP.ps1 -ArmId $armId -subscriptions $subscriptions
```
   * If $subscriptions wasn't set: 
```
.\AMS_AIOPS_SETUP.ps1 -ArmId $armId
```

### Unprotect the GetEnvironment method

Follow steps to unprotect methods from the [NetWeaver provider configuration page](provider-netweaver.md#prerequisite-unprotect-methods-for-metrics). 

> [!Note]
> If you have already followed these steps during Netweaver provider setup, you can skip them. Please ensure you have unprotected the GetEnvironment method in particular here. 

> [!Note]
> You might have to wait for up to 2hrs for your AMS to start receiving the VM details that it monitors.

