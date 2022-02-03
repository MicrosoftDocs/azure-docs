---
title: View information about users, groups, resources, tasks, keys, and serverless functions in the Usage analytics dashboard in CloudKnox Permissions Management 
description: How to view View information about users, groups, resources, tasks, keys, and serverless functions in the Usage analytics dashboard in CloudKnox Permissions Management.
services: active-directory
manager: karenh444
ms.service: active-directory
ms.topic: how-to
author: Yvonne-deQ
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# View information in the Usage analytics dashboard

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

You can  view information about users, groups, resources, tasks, keys, and serverless functions in the **Usage analytics** dashboard in CloudKnox Permissions Management (CloudKnox). 

## Display information about users, groups, or tasks

1. In CloudKnox, select the **Usage analytics** tab, and then, from the dropdown, select one of the following:

   - **Users**
   - **Group**
   - **Active resources**
   - **Active tasks**
   - **Access keys**
   - **Serverless functions**

1. From the **Authorization system type** dropdown, select the authorization system you want: Amazon Web Services (AWS), Microsoft Azure (Azure), or Google Cloud Platform (GCP).
1. From the **Identity type** dropdown, select **All**, **User**, **Role/App/Service a/c**, or **Resource**.
1. From the **Identity subtype** dropdown, select **All**, **ED**, **Local**, or **Cross-account**. 
1. From the **Identity state** dropdown, select **All**, **Active** or **Inactive**. 
1. From the **Identity filters** dropdown, select **Risky** or **Incl. in PCI calculation only**.
1. From the **Task type** dropdown, select **All** or **High-risk tasks**. 
1. To search for more specific criteria, enter the criteria in **Search**.
1. To apply your settings, select **Apply**.

    To discard your settings, select **Reset filter**.


## View information about identities

1. The **Identities** table displays the following information:

    - **Name**: The user name.
    - **Domain/Account**: The domain or account.
    - **Permission creep index (PCI)**: The numeric value assigned to the PCI.

        - **Index**: A numeral value of the permission creep index (PCI) assigned to the account.
        - **Since**: How long the index has been the value displayed.

         For more information about the **Permission creep index** , see [View key statistics and data about your authorization system](cloudknox-ui-dashboard.md).    

    - **Tasks**: The number of tasks that were:
    
        - **Granted**
        - **Executed**

    - **Resources**: The number of resources that were accessed.
    - **User groups**: The number of user groups.
    - **Last activity on**: The date the last activity happened.

     - Select the ellipses **(...)** menu and then select:
         - **Tags**: Add a tag.
         - **Auto remediate**: Update autoremediations settings

## Add a tag

1. From the ellipses **(...)** menu in the **Identities** table, select **Tags**.
1. In the **Tags** box, from the **Tag** dropdown, select a tag.
1. To create a custom tag, from the **Tag** dropdown:

    1. Select **New custom tag**, then enter a tag in the box;
    1. Select **Create**.

1. In the **Value** box, enter a value.
1. To save your tag settings, select **Save**

    To discard your changes, select **Cancel**.
1. Select **Add tag**.

## Update autoremediations settings

1. 1. From the ellipses **(...)** menu in the **Identities** table, select **Autoremediate**.

## Export information about users, groups, or tasks

- To export the data in comma-separated values (CSV) file format, select **Export**.

<!---## Next steps--->


