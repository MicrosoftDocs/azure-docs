---
title: Customize activities on Microsoft Sentinel entity timelines | Microsoft Docs
description: Create custom activities to track specific events and behaviors on entity page timelines in Microsoft Sentinel.
author: yelevin
ms.topic: how-to
ms.date: 10/16/2024
ms.author: yelevin
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to customize activity tracking on entity timelines so that I can monitor specific events and behaviors relevant to my organization's security needs.

---

# Customize activities on entity page timelines

> [!IMPORTANT]
> Activity customization is in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features in preview.
> [!INCLUDE [unified-soc-preview-without-alert](includes/unified-soc-preview-without-alert.md)]

Create custom activities based on queries from any connected data sources to supplement built-in activities on entity timelines.

## Access Activity Customization

# [Azure portal](#tab/azure)

1. Navigate to **Entity behavior** > **Customize entity page (Preview)**

# [Defender portal](#tab/defender)

1. From any entity page, select the **Sentinel events** tab
2. Select **Customize Sentinel activities**

---

1. On the entity page, select the **Sentinel events** tab.

## Activity Management

### Activity Templates vs. Custom Activities

- **Activity templates**: Pre-built activities from Microsoft security researchers
- **My activities**: Your custom activities

> [!IMPORTANT]
> Once you create custom activities, only those activities appear on entity pages. To continue seeing built-in activities, create an activity for each desired template.

## Create Activities

### From Template

1. Select **Activity templates** tab
2. Filter by entity type and data source
3. Review activity details (description, data source, identifiers, query)
4. Select **Create activity** to open the wizard
5. Modify fields as needed or keep defaults
6. Select **Review and create** > **Create**

### From Scratch

1. Select **Add activity**
2. **General tab**:
   - Enter name and description
   - Select entity type (user or host)
   - Add filters for optimization
   - Set status (Enabled/Disabled)
3. **Activity configuration tab**:
   - Write KQL query using entity identifiers
   - Configure activity presentation

### Query Requirements
1. Enter a name for your activity (example: "user added to group").

1. Enter a description of the activity (example: "user group membership change based on Windows event ID 4728").

1. Select the type of entity (user or host) this query will track.

1. You can filter by additional parameters to help refine the query and optimize its performance. For example, you can filter for Active Directory users by choosing the **IsDomainJoined** parameter and setting the value to **True**.

1. You can select the initial status of the activity to **Enabled** or **Disabled**.

1. Select **Next : Activity configuration** to proceed to the next tab.

    :::image type="content" source="./media/customize-entity-activities/create-new-activity.png" alt-text="Screenshot - Create a new activity":::

### Activity configuration tab

#### Writing the activity query

Here you will write or paste the KQL query that will be used to detect the activity for the chosen entity, and determine how it will be represented in the timeline.

> [!IMPORTANT]
>
> We recommend that your query uses an [Advanced Security Information Model (ASIM) parser](normalization-about-parsers.md) and not a built-in table. This ensures that the query will support any current or future relevant data source rather than a single data source.
>

In order to correlate events and detect the custom activity, the KQL requires an input of several parameters, depending on the entity type. The parameters are the various identifiers of the entity in question.

Selecting a strong identifier is better in order to have one-to-one mapping between the query results and the entity. Selecting a weak identifier may yield inaccurate results. [Learn more about entities and strong vs. weak identifiers](entities.md).

The following table provides information about the entities' identifiers.

**Strong identifiers for account and host entities**

At least one identifier is required in a query.

| Entity | Identifier | Description |
| - | - | - |
| **Account** | Account_Sid | The on-premises SID of the account in Active Directory |
| | Account_AadUserId | The Microsoft Entra object ID of the user in Microsoft Entra ID |
| | Account_Name + Account_NTDomain | Similar to SamAccountName (example: Contoso\Joe) |
| | Account_Name + Account_UPNSuffix | Similar to UserPrincipalName (example: Joe@Contoso.com) |
| **Host** | Host_HostName + Host_NTDomain | similar to fully qualified domain name (FQDN) |
| | Host_HostName + Host_DnsDomain | similar to fully qualified domain name (FQDN) |
| | Host_NetBiosName + Host_NTDomain | similar to fully qualified domain name (FQDN) |
| | Host_NetBiosName + Host_DnsDomain | similar to fully qualified domain name (FQDN) |
| | Host_AzureID | the Microsoft Entra object ID of the host in Microsoft Entra ID (if Microsoft Entra domain joined) |
| | Host_OMSAgentID | the OMS Agent ID of the agent installed on a specific host (unique per host) 

Based on the entity selected you will see the available identifiers. Clicking on the relevant identifiers will paste the identifier into the query, at the location of the cursor.

> [!NOTE]
> - The query can contain **up to 10 fields**, so you must project the fields you want.
>
> - The projected fields must include the **TimeGenerated** field, in order to place the detected activity in the entity's timeline.

```kusto
SecurityEvent
| where EventID == "4728"
| where (SubjectUserSid == '{{Account_Sid}}' ) or (SubjectUserName == '{{Account_Name}}' and SubjectDomainName == '{{Account_NTDomain}}' )
| project TimeGenerated, SubjectUserName, MemberName, MemberSid, GroupName=TargetUserName
```

:::image type="content" source="./media/customize-entity-activities/new-activity-query.png" alt-text="Screenshot - Enter a query to detect the activity":::

#### Presenting the activity in the timeline

For the sake of convenience, you may want to determine how the activity is presented in the timeline by adding dynamic parameters to the activity output.

Microsoft Sentinel provides built-in parameters for you to use, and you can also use others based on the fields you projected in the query.

Use the following format for your parameters: `{{ParameterName}}`

After the activity query passes validation and displays the **View query results** link below the query window, you'll be able to expand the **Available values** section to view the parameters available for you to use when creating a dynamic activity title.

Select the **Copy** icon next to a specific parameter to copy that parameter to your clipboard so that you can paste it into the **Activity title** field above.

Add any of the following parameters to your query:

- Any field you projected in the query.

- Entity identifiers of any entities mentioned in the query.

- `StartTimeUTC`, to add the start time of the activity, in UTC time.

- `EndTimeUTC`, to add the end time of the activity, in UTC time.

- `Count`, to summarize several KQL query outputs into a single output.

    The `count` parameter adds the following command to your query in the background, even though it's not displayed fully in the editor:

    ```kusto
    Summarize count() by <each parameter you’ve projected in the activity>
    ```

    Then, when you use the **Bucket Size** filter in the entity pages, the following command is also added to the query that's run in the background:

    ```kusto
    Summarize count() by <each parameter you’ve projected in the activity>, bin (TimeGenerated, Bucket in Hours)
    ```

For example:

:::image type="content" source="./media/customize-entity-activities/new-activity-title.png" alt-text="Screenshot - See the available values for your activity title":::

When you are satisfied with your query and activity title, select **Next : Review**.

See more information on the following items used in the preceding examples, in the Kusto documentation:
- [***where*** operator](/kusto/query/where-operator?view=microsoft-sentinel&preserve-view=true)
- [***project*** operator](/kusto/query/project-operator?view=microsoft-sentinel&preserve-view=true)
- [***summarize*** operator](/kusto/query/summarize-operator?view=microsoft-sentinel&preserve-view=true)
- [***bin()*** function](/kusto/query/bin-function?view=microsoft-sentinel&preserve-view=true)
- [***count()*** aggregation function](/kusto/query/count-aggregation-function?view=microsoft-sentinel&preserve-view=true)

[!INCLUDE [kusto-reference-general-no-alert](includes/kusto-reference-general-no-alert.md)]

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

- [Learn about entity pages](entity-pages.md)
- [Understand entities in Microsoft Sentinel](entities.md)
- [Enable User and Entity Behavior Analytics](identify-threats-with-entity-behavior-analytics.md)
- [See entity types and identifiers reference](entities-reference.md)
