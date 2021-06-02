---
title: Customize activities on Azure Sentinel entity timelines | Microsoft Docs
description: Add customized activities to those Azure Sentinel tracks and displays on the timeline of entity pages
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/05/2021
ms.author: yelevin

---
# Customize activities on entity page timelines

> [!IMPORTANT]
>
> - Activity customization is in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Introduction

In addition to the activities tracked and presented in the timeline by Azure Sentinel out-of-the-box, you can create any other activities you want to keep track of and have them presented on the timeline as well. You can create customized activities based on queries of entity data from any connected data sources. The following examples show how you might use this capability:

- Add new activities to the entity timeline by modifying existing out-of-the-box activity templates.

- Add new activities from custom logs - for example, from a physical access-control log, you can add a user's entry and exit activities for a particular building to the user's timeline.

## Getting started

1. From the Azure Sentinel navigation menu, select **Entity behavior**.

1. In the **Entity behavior** blade, select **Customize entity page** at the top of the screen.

    :::image type="content" source="./media/customize-entity-activities/entity-behavior-blade.png" alt-text="Entity behavior page":::

1. You'll see a page with a list of any activities you've created in the **My activities** tab. In the **Activity templates** tab, you'll see the collection of activities offered out-of-the-box by Microsoft security researchers. These are the activities that are already being tracked and displayed on the timelines in your entity pages.

## Create an activity from a template

1. Click on the **Activity templates** tab to see the various activities available by default. You can filter the list by entity type as well as by data source. Selecting an activity from the list will display the following details in the preview pane:

    -  A description of the activity

    - The data source that provides the events that make up the activity

    - The identifiers used to identify the entity in the raw data

    - The query that results in the detection of this activity

1. Click the **Create activity** button at the bottom of the preview pane to start the activity creation wizard. 

1. The **Activity wizard - Create new activity from template** will open, with its fields already populated from the template. You can make changes as you like in the **General** and **Activity configuration** tabs.

1. When you are satisfied, select the **Review and create** tab. When you see the **Validation passed** message, click the **Create** button at the bottom.

## Create an activity from scratch

From the top of the activities page, click on **Add activity** to start the activity creation wizard.

The **Activity wizard - Create new activity** will open, with its fields blank.

### General tab
1. Enter a name for your activity (example: "user added to group").

1. Enter a description of the activity (example: "user group membership change based on Windows event ID 4728").

1. Select the type of entity (user or host) this query will track.

1. You can filter by additional parameters to help refine the query and optimize its performance. For example, you can filter for Active Directory users by choosing the **IsDomainJoined** parameter and setting the value to **True**.

1. You can select the initial status of the activity to **Enabled** or **Disabled**.

### Activity configuration tab

#### Writing the activity query

Here you will write or paste the KQL query that will be used to detect the activity for the chosen entity, and determine how it will be represented in the timeline.

In order to correlate events and detect the custom activity, the KQL requires an input of several parameters, depending on the entity type. The parameters are the various identifiers of the entity in question.

Selecting a strong identifier is better in order to have one-to-one mapping between the query results and the entity. Selecting a weak identifier may yield inaccurate results. [Learn more about entities and strong vs. weak identifiers](entities-in-azure-sentinel.md).

The following table provides information about the entities' identifiers.

**Strong identifiers for account and host entities**

At least one identifier is required in a query.

| Entity | Identifier | Description |
| - | - | - |
| **Account** | Account_Sid | The on-premises SID of the account in Active Directory |
| | Account_AadUserId | The Azure AD object ID of the user in Azure Active Directory |
| | Account_Name + Account_NTDomain | Similar to SamAccountName (example: Contoso\Joe) |
| | Account_Name + Account_UPNSuffix | Similar to UserPrincipalName (example: Joe@Contoso.com) |
| **Host** | Host_HostName + Host_NTDomain | similar to fully qualified domain name (FQDN) |
| | Host_HostName + Host_DnsDomain | similar to fully qualified domain name (FQDN) |
| | Host_NetBiosName + Host_NTDomain | similar to fully qualified domain name (FQDN) |
| | Host_NetBiosName + Host_DnsDomain | similar to fully qualified domain name (FQDN) |
| | Host_AzureID | the Azure AD object ID of the host in Azure Active Directory (if AAD domain joined) |
| | Host_OMSAgentID | the OMS Agent ID of the agent installed on a specific host (unique per host) |
|

Based on the entity selected you will see the available identifiers. Clicking on the relevant identifiers will paste the identifier into the query, at the location of the cursor.

> [!NOTE]
> - The query must contain the **TimeGenerated** field, in order to place the detected activity in the entity's timeline.
>
> - You can project **up to 10 fields** in the query.

#### Presenting the activity in the timeline

You can determine how the activity will be presented in the timeline for your convenience.

You can add dynamic parameters to the activity output with the following format: `{{ParameterName}}`

You can add the following parameters: 

- Any field you projected in the query  
- Count – use this parameter to summarize the count of the KQL query output 
- StartTimeUTC – Start time of the activity in UTC 
- EndTimeUTC – End time of the activity in UTC 

**Example**: "User `{{TargetUsername}}` was added to group `{{GroupName}}` by `{{SubjectUsername}}`"

### Review and create tab 

1. Verify all the configuration information of your custom activity.

1. When the **Validation passed** message appears, click **Create** to create the activity. You can edit or change it later in the **My Activities** tab.

## Manage your activities 

Manage your custom activities from the **My Activities** tab. Click on the ellipsis (...) at the end of an activity's row to:

- Edit the activity.
- Duplicate the activity to create a new, slightly different one.
- Delete the activity.
- Disable the activity (without deleting it).

## View activities in an entity page

Whenever you enter an entity page, all the enabled activity queries for that entity will run, providing you with up-to-the-minute information in the entity timeline. You'll see the activities in the timeline, alongside alerts and bookmarks. 

You can use the **Timeline content** filter to present only activities (or any combination of activities, alerts, and bookmarks).  

You can also use the **Activities** filter to present or hide specific activities. 

## Next steps

In this document, you learned how to create custom activities for your entity page timelines. To learn more about Azure Sentinel, see the following articles:
- Get the complete picture on [entity pages](identify-threats-with-entity-behavior-analytics.md).
- See the full list of [entities and identifiers](entities-reference.md).
