<properties 
    pageTitle="Operational Insights - Set Up Your Workspace" 
    description="Learn about how to set up your workspace in Microsoft Azure Operational Insights." 
    services="operational-insights" 
    documentationCenter="" 
    authors="bandersmsft" 
    manager="jwhit" 
    editor="banders"/>

<tags 
    ms.service="operational-insights" 
    ms.workload="operational-insights" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="02/24/2015" 
    ms.author="leylakazemi"/>

# Set up your workspace 

To create a new Microsoft Azure Operational Insights workspace, you choose a workspace name, associate it with your account, and you choose a geographical location. An Operational Insights workspace is essentially a container that includes account information and simple configuration information for the account. You or other members of your organization might use multiple Operational Insights workspaces to manage different sets of data that is collected from all or portions of your IT infrastructure.

After the workspace is created, you can perform other tasks using the workspace, such as manage Operational Insights, view your usage data in the dashboard, select storage accounts, and directly connect agents or to connect to System Center Operations Manager.

To learn out more on how to create a workspace using Azure, watch the following video:

> [AZURE.VIDEO creating-a-workspace-for-azure-customers-opinsights]


## How many workspaces do I need?
A workspace is seen as an Azure resource within the Azure Management Portal.
You can either create a new workspace or link to an existing Preview workspace you might have opened earlier for use with System Center Operations Manager, but you haven't yet associated with an Azure subscription (necessary for billing).
A workspace represents the level at which data is collected, aggregated, analyzed, and presented in the Operational Insights portal. 
You might choose to have multiple workspaces to segregate data from different environments and systems; each Operations Manager management group (and all its agents) or individual VMs/agents can each be connected with only one workspace.

Each workspace can have multiple user accounts associated with it, and each user account (Microsoft account or Organizational account) can have access to multiple Operational Insights workspaces.
By default, the Microsoft account or Organizational account used to create the workspace becomes the Administrator of the workspace.  The administrator can then invite additional Microsoft accounts or pick users from his Azure Active Directory.

