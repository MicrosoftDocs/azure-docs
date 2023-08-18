---
title: Bulk remove group members by uploading a CSV file
description: Remove group members in bulk operations in the Azure admin center. 
services: active-directory 
author: barclayn
ms.author: barclayn
manager: amycolannino
ms.date: 09/22/2021
ms.topic: how-to
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.custom: it-pro
ms.reviewer: jeffsta
ms.collection: M365-identity-device-management
---

# Bulk remove group members in Azure Active Directory

You can remove a large number of members from a group by using a comma-separated values (CSV) file to remove group members in bulk using the portal for Azure Active Directory (Azure AD), part of Microsoft Entra.

## Understand the CSV template

Download and fill in the bulk upload CSV template to successfully add Azure AD group members in bulk. Your CSV template might look like this example:

![Spreadsheet for upload and call-outs explaining the purpose and values for each row and column](./media/groups-bulk-remove-members/template-example.png)

### CSV template structure

The rows in a downloaded CSV template are as follows:

- **Version number**: The first row containing the version number must be included in the upload CSV.
- **Column headings**: The format of the column headings is &lt;*Item name*&gt; [PropertyName] &lt;*Required or blank*&gt;. For example, `Member object ID or user principal name [memberObjectIdOrUpn] Required`. Some older versions of the template might have slight variations. For group membership changes, you have the option of which identifier to use: member object ID or user principal name.
- **Examples row**: We have included in the template a row of examples of acceptable values for each column. You must remove the examples row and replace it with your own entries.

### Additional guidance

- The first two rows of the upload template must not be removed or modified, or the upload can't be processed.
- The required columns are listed first.
- We don't recommend adding new columns to the template. Any additional columns you add are ignored and not processed.
- We recommend that you download the latest version of the CSV template as often as possible.

## To bulk remove group members

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Azure portal](https://portal.azure.com) with a User administrator account in the organization. Group owners can also bulk remove members of groups they own.
1. In Azure AD, select **Groups** > **All groups**.
1. Open the group from which you're removing members and then select **Members**.
1. On the **Members** page, select **Remove members**.
1. On the **Bulk remove group members** page, select **Download** to get the CSV file template with required group member properties.

   ![The Remove Members command is on the profile page for the group](./media/groups-bulk-remove-members/remove-panel.png)

1. Open the CSV file and add a line for each group member you want to remove from the group (required values are Member object ID or User principal name). Then save the file.

    :::image type="content" source="./media/groups-bulk-remove-members/csv-file.png" alt-text="The CSV file contains names and IDs of the group members to remove":::

1. On the **Bulk remove group members** page, under **Upload your csv file**, browse to the file. When you select the file, validation of the CSV file starts.
1. When the file contents are validated, the bulk import page displays **File uploaded successfully**. If there are errors, you must fix them before you can submit the job.
1. When your file passes validation, select **Submit** to start the Azure bulk operation that removes the group members from the group.
1. When the removal operation completes, you'll see a notification that the bulk operation succeeded.

## Check removal status

You can see the status of all of your pending bulk requests in the **Bulk operation results** page.

[![Check status in the Bulk Operations Results page](./media/groups-bulk-remove-members/bulk-center.png)](./media/groups-bulk-remove-members/bulk-center.png#lightbox)

For details about each line item within the bulk operation, select the values under the **# Success**, **# Failure**, or **Total Requests** columns. If failures occurred, the reasons for failure will be listed.

## Bulk removal service limits

Each bulk activity to remove a list of group members from can run for up to one hour. This enables removal of a list of at least 40,000 members.

## Next steps

- [Bulk import group members](groups-bulk-import-members.md)
- [Download members of a group](groups-bulk-download-members.md)
- [Download a list of all groups](groups-bulk-download.md)
