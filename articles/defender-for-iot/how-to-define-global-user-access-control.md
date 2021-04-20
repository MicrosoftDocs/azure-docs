---
title: Define global user access control
description: In large organizations, user permissions can be complex and might be determined by a global organizational structure, in addition to the standard site and zone structure.
ms.date: 12/08/2020
ms.topic: article
---

# Define global access control

In large organizations, user permissions can be complex and might be determined by a global organizational structure, in addition to the standard site and zone structure.

To support the demand for user access permissions that are global and more complex, you can create a global business topology that's based on business units, regions, and sites. Then you can define user access permissions around these entities.

Working with access tools for business topology helps organizations implement zero-trust strategies by better controlling where users manage and analyze devices in the Azure Defender for IoT platform.

## About access groups

Global access control is established through the creation of user access groups. Access groups consist of rules regarding which users can access specific business entities. Working with groups lets you control view and configuration access to Defender for IoT for specific user roles at relevant business units, regions, and sites.

For example, allow security analysts from an Active Directory group to access all West European automotive and glass production lines, along with a plastics line in one region.

:::image type="content" source="media/how-to-define-global-user-access-control/sa-diagram.png" alt-text="Diagram of the Security Analyst Active Directory group.":::

Before you create access groups, we recommend that you:

- Carefully set up your business topology. For more information about business topology, see [Work with site map views](how-to-gain-insight-into-global-regional-and-local-threats.md#work-with-site-map-views).

- Plan which users are associated with the access groups that you create. Two options are available for assigning users to access groups:

  - **Assign groups of Active Directory groups**: Verify that you set up an Active Directory instance to integrate with the on-premises management console.
  
  - **Assign local users**: Verify that you created users. For more information, see [Define users](how-to-create-and-manage-users.md#define-users).

Admin users can't be assigned to access groups. These users have access to all business topology entities by default.

## Create access groups

This section describes how to create access groups. Default global business units and regions are created for the first group that you create. You can edit the default entities when you define your first group.

To create groups:

1. Select **Access Groups** from the side menu of the on-premises management console.

2. Select :::image type="icon" source="media/how-to-define-global-user-access-control/add-icon.png" border="false":::. In the **Add Access Group** dialog box, enter a name for the access group. The console supports 64 characters. Assign the name in a way that will help you easily distinguish this group from other groups.

   :::image type="content" source="media/how-to-define-global-user-access-control/add-access-group.png" alt-text="The Add Access Group dialog box where you create access groups.":::

3. If the **Assign an Active Directory Group** option appears, you can assign one Active Directory group of users to this access group.

   :::image type="content" source="media/how-to-define-global-user-access-control/add-access-group.png" alt-text="Assign an Active Directory group in the Create Access Group dialog box.":::

   If the option doesn't appear, and you want to include Active Directory groups in access groups, select **System Settings**. On the **Integrations** pane, define the groups. Enter a group name exactly as it appears in the Active Directory configurations, and in lowercase.

5. On the **Users** pane, assign as many users as required to the group. You can also assign users to different groups. If you work this way, you must create and save the access group and rules, and then assign users to the group from the **Users** pane.

   :::image type="content" source="media/how-to-define-global-user-access-control/role-management.png" alt-text="Manage your users' roles and assign them as needed.":::

6. Create rules in the **Add Rules for *name*** dialog box based on your business topology's access requirements. Options that appear here are based on the topology that you designed in the **Enterprise View** and **Site Management** windows. 

   You can create more than one rule per group. You might need to create more than one rule per group when you're working with complex access granularity at multiple sites. 

   :::image type="content" source="media/how-to-define-global-user-access-control/add-rule.png" alt-text="Add a rule to your system.":::

The rules that you create appear in the **Add Access Group** dialog box. There, you can delete or edit them.

:::image type="content" source="media/how-to-define-global-user-access-control/edit-access-groups.png" alt-text="View and edit all of your access groups from this window.":::

### About rules

When you're creating rules, be aware of the following information:

- When an access group contains several rules, the rule logic aggregates all rules. For example, the rules use AND logic, not OR logic.

- For a rule to be successfully applied, you must assign sensors to zones in the **Site Management** window.

- You can assign only one element per rule. For example, you can assign one business unit, one region, and one site for each rule. Create more rules for the group if, for example, you want users in one Active Directory group to have access to different business units in different regions.

- If you change an entity and the change affects the rule logic, the rule will be deleted. If changes made to a topology entity affect the rule logic such that all rules are deleted, the access group remains but the users can't sign in to the on-premises management console. Users are notified to contact their administrator to sign in.

- If no business unit or region is selected, users will have access to all defined business units and regions.

## See also

[About Defender for IoT console users](how-to-create-and-manage-users.md)
