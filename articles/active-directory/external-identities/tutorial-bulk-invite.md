---

title: Tutorial for bulk inviting B2B collaboration users - Azure AD
description: In this tutorial, you learn how to use PowerShell and a CSV file to send bulk invitations to external Azure AD B2B collaboration users.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: tutorial
ms.date: 05/07/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal

#customer intent: As a tenant administrator, I want to send B2B invitations to multiple external users at the same time so that I can avoid having to send individual invitations to each user.

ms.collection: M365-identity-device-management
---

# Tutorial: Bulk invite Azure AD B2B collaboration users

If you use Azure Active Directory (Azure AD) B2B collaboration to work with external partners, you can invite multiple guest users to your organization at the same time. In this tutorial, you learn how to use the Azure portal to send bulk invitations to external users. Specifically, you do the following:

> [!div class="checklist"]
> * Use **Bulk invite users** to prepare a comma-separated value (.csv) file with the user information and invitation preferences
> * Upload the .csv file to Azure AD
> * Verify the users were added to the directory

If you don’t have Azure Active Directory, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Understand the CSV template

Download and fill in the bulk upload CSV template to help you successfully invite Azure AD guest users in bulk. The CSV template you download might look like this example:

![Spreadsheet for upload and call-outs explaining the purpose and values for each row and column](media/tutorial-bulk-invite/understand-template.png)

### CSV template structure

The rows in a downloaded CSV template are as follows:

- **Version number**: The first row containing the version number must be included in the upload CSV.
- **Column headings**: The format of the column headings is &lt;*Item name*&gt; [PropertyName] &lt;*Required or blank*&gt;. For example, `Email address to invite [inviteeEmail] Required`. Some older versions of the template might have slight variations.
- **Examples row**: We have included in the template a row of examples of acceptable values for each column. You must remove the examples row and replace it with your own entries.

### Additional guidance

- The first two rows of the upload template must not be removed or modified, or the upload can't be processed.
- The required columns are listed first.
- We don't recommend adding new columns to the template. Any additional columns you add are ignored and not processed.
- We recommend that you download the latest version of the CSV template as often as possible.

## Prerequisites

You need two or more test email accounts that you can send the invitations to. The accounts must be from outside your organization. You can use any type of account, including social accounts such as gmail.com or outlook.com addresses.

## Invite guest users in bulk

1. Sign in to the Azure portal with an account that is a User administrator in the organization.
2. In the navigation pane, select **Azure Active Directory**.
3. Under **Manage**, select **Users** > **Bulk invite**.
4. On the **Bulk invite users** page, select **Download** to get a valid .csv template with invitation properties.

    ![Bulk invite download button](media/tutorial-bulk-invite/bulk-invite-button.png)

5. Open the .csv template and add a line for each guest user. Required values are:

   * **Email address to invite** - the user who will receive an invitation

   * **Redirection url** - the URL to which the invited user is forwarded after accepting the invitation

    ![Example of a CSV file with guest users entered](media/tutorial-bulk-invite/bulk-invite-csv.png)

   > [!NOTE]
   > Don't use commas in the **Customized invitation message** because they'll prevent the message from being parsed successfully.

6. Save the file.
7. On the **Bulk invite users** page, under **Upload your csv file**, browse to the file. When you select the file, validation of the .csv file starts. 
8. When the file contents are validated, you’ll see **File uploaded successfully**. If there are errors, you must fix them before you can submit the job.
9. When your file passes validation, select **Submit** to start the Azure bulk operation that adds the invitations. 
10. To view the job status, select **Click here to view the status of each operation**. Or, you can select **Bulk operation results** in the **Activity** section. For details about each line item within the the bulk operation, select the values under the **# Success**, **# Failure**, or **Total Requests** columns. If failures occurred, the reasons for failure will be listed.

    ![Example of bulk operation results](media/tutorial-bulk-invite/bulk-operation-results.png)

11. When the job completes, you'll see a notification that the bulk operation succeeded.

## Verify guest users in the directory

Check to see that the guest users you added exist in the directory either in the Azure portal or by using PowerShell.

### View guest users in the Azure portal

1. Sign in to the Azure portal with an account that is a User administrator in the organization.
2. In the navigation pane, select **Azure Active Directory**.
3. Under **Manage**, select **Users**.
4. Under **Show**, select **Guest users only** and verify the users you added are listed.

### View guest users with PowerShell

Run the following command:

```powershell
 Get-AzureADUser -Filter "UserType eq 'Guest'"
```

You should see the users that you invited listed, with a user principal name (UPN) in the format *emailaddress*#EXT#\@*domain*. For example, *lstokes_fabrikam.com#EXT#\@contoso.onmicrosoft.com*, where contoso.onmicrosoft.com is the organization from which you sent the invitations.

## Clean up resources

When no longer needed, you can delete the test user accounts in the directory in the Azure portal on the Users page by selecting the checkbox next to the guest user and then selecting **Delete**. 

Or you can run the following PowerShell command to delete a user account:

```powershell
 Remove-AzureADUser -ObjectId "<UPN>"
```

For example: `Remove-AzureADUser -ObjectId "lstokes_fabrikam.com#EXT#@contoso.onmicrosoft.com"`

## Next steps

In this tutorial, you sent bulk invitations to guest users outside of your organization. Next, learn how the invitation redemption process works.

> [!div class="nextstepaction"]
> [Learn about the Azure AD B2B collaboration invitation redemption process](redemption-experience.md)
