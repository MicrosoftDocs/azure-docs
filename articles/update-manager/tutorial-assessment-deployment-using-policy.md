---
title: Schedule updates and enable periodic assessment at scale using policy.
description: In this tutorial, you learn on how enable periodic assessment or update the deployment using policy.
ms.service: azure-update-manager
ms.date: 09/18/2023
ms.topic: tutorial 
author: SnehaSudhirG
ms.author: sudhirsneha
#Customer intent: As an IT admin, I want dynamically apply patches or enable periodic assessment on the machines at scale using a policy.
---

# Tutorial: Enable periodic assessment and schedule updates on Azure VMs using policy

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.
 
This tutorial explains how you can enable periodic assessment and schedule updates on your Azure VMs at scale using Azure policy. A policy allows you to assign standards and assess compliance at scale. [Learn more](../governance/policy/overview.md).

**Periodic Assessment**  - is a setting on your machine that enables you to see the latest updates available for your machines and removes the hassle of performing assessment manually every time you need to check the update status. Once you enable this setting, update manager fetches updates on your machine once every 24 hours.

**Schedule patching** - is a setting to target a group of machines for update deployment via Azure Policy. The grouping using policy, keeps you from having to edit your deployment to update machines. You can use subscription, resource group, tags or regions to define the scope and use this feature for the built-in policies which you can customize as per your use-case.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Enable periodic assessment
> - Enable schedule patching


## Prerequisites

- You must have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Enable Periodic assessment

Go to **Policy** from the Azure portal and under **Authoring**, go to **Definitions**. 
1. From the **Category** dropdown, select **Azure Update Manager**. Select *Configure periodic checking for missing system updates on Azure virtual machines* for Azure machines.
1. When the Policy Definition opens, select **Assign**.
1. In **Basics**, select your subscription as your scope. You can also specify a resource group within subscription as the scope and select Next.
1. In **Parameters**, uncheck **Only show parameters that need input or review** so that you can see the values of parameters. 
1. In **Assessment**: select *AutomaticByPlatform* and select *Operating system* and then select **Next**. You need to create separate policies for Windows and Linux.
1. In **Remediation**, check **Create a remediation task**, so that periodic assessment is enabled on your machines and click **Next**.
1. In **Non-compliance**, provide the message that you would like to see in case of non-compliance. For example: *Your machine doesn't have periodic assessment enabled.* and then select **Review+Create**.
1. In **Review+Create**, select **Create**. This action triggers Assignment and Remediation Task creation, which can take a minute or so. 

You can monitor the compliance of resources under **Compliance** and remediation status under **Remediation** from the Policy home page.

## Enable schedule patching

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Policy**.
1. In **Assignments**, select **Assign policy**.
1. Under **Basics**, in the **Assign policy** page:
	- In **Scope**, choose your subscription, resource group, and choose **Select**.
	- Select **Policy definition** to view a list of policies.
	- In **Available Definitions**, select **Built in** for Type and in search, enter - *Schedule recurring updates using Azure Update Manager* and click **Select**.
	- Ensure that **Policy enforcement** is set to **Enabled** and select **Next**.
	
1. In **Parameters**, by default, only the Maintenance configuration ARM ID is visible. 

	> [!NOTE]
	> If you do not specify any other parameters, all machines in the subscription and resource group that you selected in **Basics** will be covered under scope. However, if you want to scope further based on resource group, location, OS, tags and so on, deselect **Only show parameters that need input or review** to view all parameters.

	- Maintenance Configuration ARM ID: A mandatory parameter to be provided. It denotes the ARM ID of the schedule that you want to assign to the machines.
	- Resource groups: You can specify a resource group optionally if you want to scope it down to a resource group. By default, all resource groups within the subscription are selected.
	- Operating System types: You can select Windows or Linux. By default, both are preselected.
	- Machine locations: You can optionally specify the regions that you want to select. By default, all are selected.
	- Tags on machines: You can use tags to scope down further. By default, all are selected.
	- Tags operator: In case you have selected multiple tags, you can specify if you want the scope to be machines that have all the tags or machines which have any of those tags.

1. In **Remediation**, **Managed Identity**, **Type of Managed Identity**, select System assigned managed identity and **Permissions** is already set as *Contributor* according to the policy definition.

	> [!NOTE]
	> If you select Remediation, the policy would be effective on all the existing machines in the scope else, it is assigned to any new machine which is added to the scope.

1. In **Review + Create**, verify your selections, and select **Create** to identify the non-compliant resources to understand the compliance state of your environment.


## Next steps
Learn about [managing multiple machines](manage-multiple-machines.md).
 
