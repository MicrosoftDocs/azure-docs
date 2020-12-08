---
title: Define global user access control
description: In large organizations, user permissions can be complex and may be determined by a global organizational structure, in addition to the standard site and zone structure.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/08/2020
ms.topic: article
ms.service: azure
---

# Define global access control

In large organizations, user permissions can be complex and may be determined by a global organizational structure, in addition to the standard site and zone structure.

To support the demand for more complex global user access permissions, you can create a global business topology that is based on business units, regions, sites, zones, and then define user access permissions around these entities.

**Zero trust user access**

Working with business topology access tools helps organizations implement zero-trust strategies by better controlling where users manage and analyze assets in the Defender for IoT platform.

## About access groups

Global access control is established by creating user Access Groups. Access Groups consist of rules regarding which users can access specific business entities.

Working with groups lets you control view and configuration access to Defender for IoT for specific user roles at relevant business units, regions, specific sites, and zones.

For example, allow Security Analysts from an Active Directory group access to all West European automotive and glass production lines, as well as a plastic line in one zone.

:::image type="content" source="media/how-to-define-global-user-access-control/sa-diagram.png" alt-text="Diagram of the Security Analyst Active Directory Group.":::

Before you create Access Groups, it is recommended to:

- Carefully set up your business topology. For more information about business topology, see [Understanding the map views](how-to-work-with-maps.md#understanding-the-map-views) for details.

- Plan which users are associated with the Access Groups you create. Two options are available for assigning users to Access Groups:

  - **Assign groups of Active Directory groups**: Verify that you set up an Active Directory to integrate with the on-premises management console.
  
  - **Assign local users**: Verify that you created users. for more information, see [Define users](how-to-create-and-manage-users.md#define-users) for details.

Admin users cannot be assigned to Access Groups. These users have access to all business topology entities by default.

## Create Access Groups

This article describes how to create Access Groups. Default global business units and regions are created for the first group you create. You can edit the default entities when you define your first group.

To create groups:

1. Select **Access Groups** from the on-premises management console side menu.

2. **Add a group name**: Select :::image type="icon" source="media/how-to-define-global-user-access-control/add-icon.png" border="false":::. In the Add Access Group dialog box, enter an Access Group name. 64 characters are supported. Assign the name in a way that will help you easily distinguish this group from other groups.

:::image type="content" source="media/how-to-define-global-user-access-control/add-access-group.png" alt-text="The Add Access Group window used to create access groups.":::

3. **Assign Active Directory users**: If the **Assign an Active Directory Group** option appears, you can assign one active Directory Group to this Access Group.

:::image type="content" source="media/how-to-define-global-user-access-control/add-access-group.png" alt-text="Assign an active directory group in the create access group window.":::

4. If the option does not appear, and you want to include Active Directory groups in Access Groups, select **System Settings**>**Integrations** pane, and define groups. This should be entered exactly as it appears in the Active Directory configurations, and in lower case

5. **Assign individual users to the group (Users page)**: You can assign as many users as required to the group and can assign users to different groups. If you work this way, you must create and save the Access Group and rules, and then assign user to the group from the Users pane.

:::image type="content" source="media/how-to-define-global-user-access-control/role-management.png" alt-text="Manage your user's roles and assign them as needed.":::

6. **Create rules**: Create rules in the Add Rules for XXX dialog box based on your business topology access requirements. Options that appear here are based on the topology you designed in the **Enterprise View** and **Site Management** windows. You can create more than one rule per group. This may be required when working with complex access granularity at multiple sites. 

:::image type="content" source="media/how-to-define-global-user-access-control/add-rule.png" alt-text="Add a rule to your system":::

The rules you create appear in the Add Access Group dialog box where they can be deleted or edited.

:::image type="content" source="media/how-to-define-global-user-access-control/edit-access-groups.png" alt-text="View and edit all of your Access Groups from this window.":::

### About rules

This article describes the information you should know when creating rules.

- When an Access Group contains several rules, the rule logic aggregates all rules. For example, AND logic, not OR logic.

- Sensors must be assigned to Zones in the **Site Management** window for the rule to be successfully applied.

- You can only assign one element per rule. For example, one business unit, one region, one site, and one zone for each rule. Create addition rules for the group if, for example, you want users in one Active Directory group to have access to different business units in different regions.

- If you change an entity and the change impacts the rule logic, the rule will be deleted. If changes made to a topology entity impact the rule logic as such that all rules are deleted, the access group remains but the users cannot sign-in to the on-premises management console. Users are notified to sign-in to contact their administrator.

- If no business units or region is selected, the user will have access to all business units and regions defined.
