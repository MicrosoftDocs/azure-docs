---

  title: Assigning licenses to a group in Azure Active Directory | Microsoft Docs
  description: How to assign licenses using Azure Active Directory group-based licensing
  services: active-directory
  keywords: Azure AD licensing
  documentationcenter: ''
  author: curtand
  manager: femila
  editor: ''

  ms.assetid:
  ms.service: active-directory
  ms.devlang: na
  ms.topic: article
  ms.tgt_pltfrm: na
  ms.workload: identity
  ms.date: 02/21/2017
  ms.author: curtand

---

# Assigning licenses to a group in Azure Active Directory

In this article, we are going to walk through a basic scenario of assigning product licenses to a group and verifying that all members of the group are correctly licensed.

In his example, the tenant contains a security group called **HR Department** which includes all members of the Human Resources department, which in this case is around 1,000 users. The administrator wants to assign Office 365 Enterprise E3 licenses to the entire department; the Yammer Enterprise service included in the product needs to be temporarily disabled until a later time when the department is ready to start using it. The admin also wants to deploy Enterprise Mobility + Security licenses to the same group of users.

## Step 1: Assign the required licenses

1. Sign in to the [**Azure portal**](https://portal.azure.com) with an administrator account. To manage licenses, the account needs either the Global Administrator role or the User Account Administrator role.

2. Select **More services** in the left-hand side navigation pane, and then select **Azure Active Directory**. You can “favorite” this blade by clicking on the star icon or pin it to the portal dashboard.

3. On the **Azure Active Directory** blade, select **Licenses**. This opens a blade on which you can see and manage all licensable products in the tenant.

4. Under **All products**, select both Office 365 Enterprise E3 and Enterprise Mobility + Security by selecting the product names. Select **Assign** at the top of the blade to start the assignment.

  ![all products, assign license](media/active-directory-licensing-group-assignment-azure-portal/all-products-assign.png)

5. On the **Assign license** blade, click **Users and groups** to open the user and group blade. Search for the group name *HR Department*, select the group, and then be sure to confirm by clicking **Select** at the bottom of the blade.

  ![Select a group](media/active-directory-licensing-group-assignment-azure-portal/select-a-group.png)

6. On the **Assign license** blade, click **Assignment options (optional)** which displays all service plans comprising the two products we selected previously. Find Yammer Enterprise and turn it **Off** to disable that service from the product license. Confirm by clicking **OK** at the bottom of **Assignment options**.

  ![assignment options](media/active-directory-licensing-group-assignment-azure-portal/assignment-options.png)

7. Finally, on the **Assign license** blade, click **Assign** at the bottom of the blade to complete the assignment.

8. A notification is displayed in the upper right hand side corner showing status and outcome of the process. If the assignment to the group could not be completed (for example due to pre-existing licenses in the group), click the notification to view details of the failure.

We have now specified a license template on the HR Department group. A background process in Azure AD has been started to process all existing members of that group. This initial operation might take some time, depending on the current size of the group. In the next step, we will describe how to verify that the process has completed and if further attention is required to resolve problems.

> [!NOTE]
> The same assignment can be started from an alternative location: **Users and Groups** in Azure AD. Go to **Azure Active Directory &gt; Users and groups &gt; All groups,** find the group, select it and go to the **Licenses** tab. The **Assign** button on top of the blade will open the license assignment blade.

## Step 2: Verify that the initial assignment has completed

1. Go to **Azure Active Directory &gt; Users and groups &gt; All groups** and find the *HR Department* group to which licenses were assigned.

2. On the *HR Department* group blade, select **Licenses** to  quickly confirm if licenses have been fully assigned to users and if there are any errors requiring looking into, including:

  - Product licenses that have been assigned to the group. Select an entry to show the specific services that have been enabled and to make changes.

  - Status of the latest changes made to the license assignment: if the changes are being processed or if processing has been completed on all user members.

  - If there were errors, information about users in error state, for whom licenses could not be assigned.

  ![assignment options](media/active-directory-licensing-group-assignment-azure-portal/assignment-errors.png)

3. More detailed information about license processing is available under **Azure Active Directory &gt; Users and groups &gt;
    *groupname* &gt; Audit logs**:

  - Activity: **Start applying group based license to users**. It is logged when our system picks up the license assignment change on the group and starts applying it to all user members. It contains information about the change that was made.

  - Activity: **Finish applying group based license to users**. It is logged when our system finishes processing all users in the group. It contains a summary of how many users were successfully processed and how many users could not be assigned the group licenses.

## Step 3: Checking for license problems and resolving them

1. Go to **Azure Active Directory &gt; Users and groups &gt; All groups** and find the *HR Department* group to which licenses were assigned.

2. On the **HR Department** group blade, select **Licenses**. The notification on top of the blade signifies that there are 10 users for who licenses could not be assigned. It opens a list of all users in licensing error state for this group.

3. The **Failed assignments** column tells us that both product licenses could not be assigned to the users. **Top reason for failure** contains the cause of the failure, in this case **Conflicting service plans**.

  ![failed assignments](media/active-directory-licensing-group-assignment-azure-portal/failed-assignments.png)

4. Select a user to open the **Licenses** blade showing all licenses currently assigned to the user. In this example, we can see the user has the Office 365 Enterprise E1 license inherited from the **Kiosk users** group. This conflicts with the E3 license that the system tries to apply from the **HR Department** group; as a result, none of the licenses from that group have been assigned to the user.

  ![view licenses for a user](media/active-directory-licensing-group-assignment-azure-portal/user-license-view.png)

5. To solve this, we remove the user from the **Kiosk users** group. After Azure AD processes the change, the **HR Department** licenses are correctly assigned.

  ![license correctly assigned](media/active-directory-licensing-group-assignment-azure-portal/license-correctly-assigned.png)

## Next steps

To learn more about the feature set for license management through groups, read

* [What is group-based licensing in Azure Active Directory?](active-directory-licensing-whatis-azure-portal.md)
* [Identifying and resolving license problems for a group in Azure Active Directory](active-directory-licensing-group-problem-resolution-azure-portal.md)
* [How to migrate individual licensed users to group-based licensing in Azure Active Directory](active-directory-licensing-group-migration-azure-portal.md)
* [Azure Active Directory group-based licensing additional scenarios](active-directory-licensing-group-advanced.md)
