---
title: 'Tutorial: Preparing user accounts for Lifecycle workflows'
description: Tutorial for preparing user accounts for Lifecycle workflows.
services: active-directory
author: owinfreyATL
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.subservice: compliance
ms.date: 08/02/2023
ms.author: owinfrey
ms.reviewer: krbain
ms.custom: template-tutorial
---
# Preparing user accounts for Lifecycle workflows tutorials

For the on-boarding and off-boarding tutorials you need accounts for which the workflows are executed. This section helps you prepare these accounts, if you already have test accounts that meet the following requirements, you can proceed directly to the on-boarding and off-boarding tutorials. Two accounts are required for the on-boarding tutorials, one account for the new hire and another account that acts as the manager of the new hire. The new hire account must have the following attributes set:

- employeeHireDate must be set to today
- department must be set to sales
- manager attribute must be set, and the manager account should have a mailbox to receive an email

The off-boarding tutorials only require one account that has group and Teams memberships, but the account will be deleted during the tutorial.

## Prerequisites

[!INCLUDE [Microsoft Entra ID Governance license](../../../includes/active-directory-entra-governance-license.md)]
- An Azure AD tenant
- A global administrator account for the Azure AD tenant.  This account is used to create our users and workflows.

## Before you begin

In most cases, users are going to be provisioned to Azure AD either from an on-premises solution (such as Azure AD Connect or Cloud sync) or with an HR solution. These users have the attributes and values populated at the time of creation. Setting up the infrastructure to provision users is outside the scope of this tutorial. For information, see [Tutorial: Basic Active Directory environment](../cloud-sync/tutorial-basic-ad-azure.md) and [Tutorial: Integrate a single forest with a single Azure AD tenant](../cloud-sync/tutorial-single-forest.md)

## Create users in Azure AD

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

We use the Graph Explorer to quickly create two users needed to execute the Lifecycle Workflows in the tutorials.  One user represents our new employee and the second represents the new employee's manager.

You need to edit the POST and replace the &lt;your tenant name here&gt; portion with the name of your tenant.  For example:   $UPN_manager = "bsimon@&lt;your tenant name here&gt;" to $UPN_manager = "bsimon@contoso.onmicrosoft.com".  

>[!NOTE]
>Be aware that a workflow will not trigger when the employee hire date (Days from event) is prior to the workflow creation date. You must set a employeeHiredate in the future by design.  The dates used in this tutorial are a snapshot in time.  Therefore, you should change the dates accordingly to accommodate for this situation.

First we create our employee, Melva Prince.

 1. Now navigate to [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
 2. Sign-in to Graph Explorer with the global administrator account for your tenant.
 3. At the top, change **GET** to **POST** and add `https://graph.microsoft.com/v1.0/users/` to the box. 
 4. Copy the following code in to the **Request body** 
 5. Replace `<your tenant here>` in the following code with the value of your Azure AD tenant.
 6. Select **Run query**
 7. Copy the ID that is returned in the results.  This is used later to assign a manager.

   ```json
   {
     "accountEnabled": true,
     "displayName": "Melva Prince",
     "mailNickname": "mprince",
     "department": "sales",
     "mail": "mprince@<your tenant name here>",
     "employeeHireDate": "2022-04-15T22:10:00Z",
     "userPrincipalName": "mprince@<your tenant name here>",
     "passwordProfile" : {
       "forceChangePasswordNextSignIn": true,
       "password": "xWwvJ]6NMw+bWH-d"
     }
   }
   ```
 :::image type="content" source="media/tutorial-lifecycle-workflows/graph-post-user.png" alt-text="Screenshot of POST create Melva in graph explorer." lightbox="media/tutorial-lifecycle-workflows/graph-post-user.png":::

Next, we create Britta Simon.  This is the account that is used as our manager.

 1. Still in [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
 2. Make sure the top is still set to **POST** and `https://graph.microsoft.com/v1.0/users/` is in the box.  
 3. Copy the following code in to the **Request body** 
 4.  Replace `<your tenant here>` in the following code with the value of your Azure AD tenant.
 5. Select **Run query**
 6. Copy the ID that is returned in the results. This is used later to assign a manager.
    ```json
    {
      "accountEnabled": true,
      "displayName": "Britta Simon",
      "mailNickname": "bsimon",
      "department": "sales",
      "mail": "bsimon@<your tenant name here>",
      "employeeHireDate": "2021-01-15T22:10:00Z",
      "userPrincipalName": "bsimon@<your tenant name here>",
      "passwordProfile" : {
        "forceChangePasswordNextSignIn": true,
        "password": "xWwvJ]6NMw+bWH-d"
      }
    }
    ```

>[!NOTE]
> You need to change the &lt;your tenant name here&gt; section of the code to match your Azure AD tenant.

As an alternative, the following PowerShell script may also be used to quickly create two users needed execute a lifecycle workflow.  One user represents our new employee and the second represents the new employee's manager.

>[!IMPORTANT]
>The following PowerShell script is provided to quickly create the two users required for this tutorial.  These users can also be created manually by signing in to the Azure portal as a global administrator and creating them.

In order to create this step, save the following PowerShell script to a location on a machine that has access to Azure. 

Next, you need to edit the script and replace the &lt;your tenant name here&gt; portion with the name of your tenant.  For example:   $UPN_manager = "bsimon@&lt;your tenant name here&gt;" to $UPN_manager = "bsimon@contoso.onmicrosoft.com".  

You need to do perform this action for both $UPN_employee and $UPN_manager  

After editing the script, save it and follow these steps:

 1.  Open a Windows PowerShell command prompt, with Administrative privileges, from a machine that has access to the Azure portal.
2. Navigate to the saved PowerShell script location and run it.
3. If prompted select **Yes to all** when installing the Azure AD module.
4. When prompted, sign in to the Azure portal with a global administrator for your Azure AD tenant.

```powershell
#
# DISCLAIMER:
# Copyright (c) Microsoft Corporation. All rights reserved. This 
# script is made available to you without any express, implied or 
# statutory warranty, not even the implied warranty of 
# merchantability or fitness for a particular purpose, or the 
# warranty of title or non-infringement. The entire risk of the 
# use or the results from the use of this script remains with you.
#
#
#
#
#Declare variables

$Displayname_employee = "Melva Prince"
$UPN_employee = "mprince<your tenant name here>"
$Name_employee = "mprince"
$Password_employee = "Pass1w0rd"
$EmployeeHireDate_employee = "04/10/2022"
$Department_employee = "Sales"
$Displayname_manager = "Britta Simon"
$Name_manager = "bsimon"
$Password_manager = "Pass1w0rd"
$Department = "Sales"
$UPN_manager = "bsimon@<your tenant name here>"

Install-Module -Name AzureAD
Connect-AzureAD -Confirm

$PasswordProfile = New-Object -TypeName Microsoft.Open.AzureAD.Model.PasswordProfile
$PasswordProfile.Password = "<Password>"
New-AzureADUser -DisplayName $Displayname_manager  -PasswordProfile $PasswordProfile -UserPrincipalName $UPN_manager -AccountEnabled $true -MailNickName $Name_manager -Department $Department
New-AzureADUser -DisplayName $Displayname_employee  -PasswordProfile $PasswordProfile -UserPrincipalName $UPN_employee -AccountEnabled $true -MailNickName $Name_employee -Department $Department
```

Once your user(s) has been successfully created in Azure AD, you may proceed to follow the Lifecycle workflow tutorials for your workflow creation.  

## Additional steps for pre-hire scenario

There are some additional steps that you should be aware of when testing either the [On-boarding users to your organization using Lifecycle workflows with Azure portal](tutorial-onboard-custom-workflow-portal.md) tutorial or the [On-boarding users to your organization using Lifecycle workflows with Microsoft Graph](tutorial-onboard-custom-workflow-graph.md) tutorial.

### Edit the users attributes using the Azure portal

Some of the attributes required for the pre-hire onboarding tutorial are exposed through the Azure portal and can be set there. 

 These attributes are:

| Attribute | Description |Set on|
|:--- |:---:|-----|
|mail|Used to notify manager of the new employees temporary access pass|Manager|
|manager|This attribute that is used by the lifecycle workflow|Employee|

For the tutorial, the **mail** attribute only needs to be set on the manager account and the **manager** attribute set on the employee account.  Use the following steps:

 1. Sign in to the [Azure portal](https://portal.azure.com).
 2. On the right, select **Azure Active Directory**.
 3. Select **Users**.
 4. Select **Melva Prince**.
 5. At the top, select **Edit**.
 6. Under manager, select **Change** and Select **Britta Simon**.
 7. At the top, select **Save**.
 8. Go back to users and select **Britta Simon**.
 9. At the top, select **Edit**.
 10. Under **Email**, enter a valid email address.
 11. Select **Save**.

### Edit employeeHireDate

The employeeHireDate attribute is new to Azure AD.  It isn't exposed through the UI and must be updated using Graph.  To edit this attribute, we can use [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).

>[!NOTE]
>Be aware that a workflow will not trigger when the employee hire date (Days from event) is prior to the workflow creation date. You must set an employeeHiredate in the future by design. The dates used in this tutorial are a snapshot in time. Therefore, you should change the dates accordingly to accommodate for this situation.

In order to do this, we must get the object ID for our user Melva Prince.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the right, select **Azure Active Directory**.
3. Select **Users**.
4. Select **Melva Prince**.
5. Select the copy sign next to the **Object ID**.
6. Now navigate to [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
7. Sign-in to Graph Explorer with the global administrator account for your tenant.
8. At the top, change **GET** to **PATCH** and add `https://graph.microsoft.com/v1.0/users/<id>` to the box.  Replace `<id>` with the value we copied before.
9. Copy the following in to the **Request body** and select **Run query**
    ```Example
    {
    "employeeHireDate": "2022-04-15T22:10:00Z"
    }
    ```
    :::image type="content" source="media/tutorial-lifecycle-workflows/update-1.png" alt-text="Screenshot of the PATCH employeeHireDate." lightbox="media/tutorial-lifecycle-workflows/update-1.png":::

10. Verify the change by changing **PATCH** back to **GET** and **v1.0** to **beta**. Select **Run query**. You should see the attributes for Melva set.  
    :::image type="content" source="media/tutorial-lifecycle-workflows/update-3.png" alt-text="Screenshot of the GET employeeHireDate." lightbox="media/tutorial-lifecycle-workflows/update-3.png":::

### Edit the manager attribute on the employee account
The manager attribute is used for email notification tasks.  It's used by the lifecycle workflow to email the manager a temporary password for the new employee.   Use the following steps to ensure your Azure AD users have a value for the manager attribute.

1. Still in [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
2. Make sure the top is still set to **PUT** and `https://graph.microsoft.com/v1.0/users/<id>/manager/$ref` is in the box. Change `<id>` to the ID of Melva Prince. 
3. Copy the code below in to the **Request body** 
4. Replace `<managerid>` in the following code with the value of Britta Simons ID.
5. Select **Run query**
    ```Example
    {
      "@odata.id": "https://graph.microsoft.com/v1.0/users/<managerid>"
    }
    ```

    :::image type="content" source="media/tutorial-lifecycle-workflows/graph-add-manager.png" alt-text="Screenshot of Adding a manager in Graph explorer." lightbox="media/tutorial-lifecycle-workflows/graph-add-manager.png":::

6. Now, we can verify that the manager has been set correctly by changing the **PUT** to **GET**.
7. Make sure `https://graph.microsoft.com/v1.0/users/<id>/manager/` is in the box.  The `<id>` is still that of Melva Prince. 
8. Select **Run query**.  You should see Britta Simon returned in the Response.

    :::image type="content" source="media/tutorial-lifecycle-workflows/graph-get-manager.png" alt-text="Screenshot of getting a manager in Graph explorer." lightbox="media/tutorial-lifecycle-workflows/graph-get-manager.png":::

For more information about updating manager information for a user in Graph API, see [assign manager](/graph/api/user-post-manager?view=graph-rest-1.0&tabs=http&preserve-view=true) documentation. You can also set this attribute in the Azure Admin center. For more information, see [add or change profile information](../fundamentals/active-directory-users-profile-azure-portal.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context).

### Enabling the Temporary Access Pass (TAP)

A Temporary Access Pass is a time-limited pass issued by an admin that satisfies strong authentication requirements.  

In this scenario, we use this feature of Azure AD to generate a temporary access pass for our new employee.  It is then mailed to the employee's manager.

To use this feature, it must be enabled on our Azure AD tenant.  To do this, use the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com) as a Global Administrator and select **Azure Active Directory** > **Security** > **Authentication methods** > **Temporary Access Pass**
2. Select **Yes** to enable the policy and add Britta Simon and select which users have the policy applied, and any **General** settings.

## Additional steps for leaver scenario

There are some additional steps that you should be aware of when testing either the Off-boarding users from your organization using Lifecycle workflows with Azure portal tutorial or the Off-boarding users from your organization using Lifecycle workflows with Microsoft Graph tutorial.

### Set up user with groups and Teams with team membership

A user with groups and Teams memberships is required before you begin the tutorials for leaver scenario.


## Next steps
- [On-boarding users to your organization using Lifecycle workflows with Azure portal](tutorial-onboard-custom-workflow-portal.md)
- [On-boarding users to your organization using Lifecycle workflows with Microsoft Graph](tutorial-onboard-custom-workflow-graph.md)
- [Tutorial: Off-boarding users from your organization using Lifecycle workflows with Azure portal](tutorial-offboard-custom-workflow-portal.md)
- [Tutorial: Off-boarding users from your organization using Lifecycle workflows with Microsoft Graph](tutorial-offboard-custom-workflow-graph.md)
