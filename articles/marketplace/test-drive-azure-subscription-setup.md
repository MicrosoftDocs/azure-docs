---
title: Set up an Azure Marketplace subscription for hosted test drives
description: Explains how to set up an Azure Marketplace subscription for Dynamics 365 apps on Dataverse and Power Apps and Dynamics 365 Operations Apps test drives
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: trkeya
ms.author: trkeya
ms.date: 12/03/2021
---

# Set up an Azure Marketplace subscription for hosted test drives

This article explains how to set up an Azure Marketplace subscription and **Dynamics 365 apps on Dataverse and Power Apps** or **Dynamics 365 Operations Apps** environment for test drives.

## Set up for Dynamics 365 apps on Dataverse and Power Apps

1. Sign into the [Azure portal](https://portal.azure.com/) with an Admin account.
2. Verify you are in the tenant associated with your Dynamics 365 test drive instance by hovering over your account icon in the upper right corner. If you are not in the correct tenant, select the account icon to switch into the correct tenant.

    :::image type="content" source="./media/test-drive/select-correct-tenant.png" alt-text="Selecting the correct tenant.":::

3. Verify that the **Dynamics 365 Customer Engagement Plan** license is available.

    [![Checking the plan license.](media/test-drive/check-plan-license.png)](media/test-drive/check-plan-license.png#lightbox)

4. Create an Azure Active Directory (AD) app in Azure. AppSource will use this app to provision and deprovision the test drive user in your tenant.
    1. From the filter pane, select **Azure Active Directory**.
    2. Select **App registrations**.

        [![Selecting app registrations.](media/test-drive/app-registrations.png)](media/test-drive/app-registrations.png#lightbox)

    3. Select **New registration**.
    4. Provide an appropriate application name.

        :::image type="content" source="./media/test-drive/register-an-application.png" alt-text="Registering an application.":::

    5. Under Supported account types, select **Account in any organization directory and personal Microsoft accounts**.
    6. Select **Create** and wait for your app to be created.
    7. Once the app is created, note the **Application ID** displayed on the overview screen. You will need this value later when configuring your test drive.
    8. Under **Manage Application**, select **API permissions**.
    9. Select **Add a permission** and then **Microsoft Graph API**.
    10. Select the **Application** permission category and then the **User.ReadWrite.All**, **Directory.Read.All** and **Directory.ReadWrite.All** permissions.

        :::image type="content" source="./media/test-drive/microsoft-graph.png" alt-text="Setting the application permissions.":::

    11. Once the permission is added, select **Grant admin consent for Microsoft**.
    12. From the message alert, select **Yes**.

        [![Shows the application permissions successfully granted.](media/test-drive/api-permissions-confirmation-customer.png)](media/test-drive/api-permissions-confirmation-customer.png#lightbox)

    13. To generate a secret for the Azure AD App:
        1. From **Manage Application**, select **Certificate and secrets**.
        2. Under Client secrets, select **New client secret**.

             :::image type="content" source="./media/test-drive/new-client-secret.png" alt-text="Adding a new client secret.":::

        3. Enter a description, such as *Test Drive*, and select an appropriate duration. Because the test drive will break once this Key expires, at which point you will need to generate and provide AppSource a new key, we recommend using the maximum duration of 24 months.
        4. Select **Add** to generate the Azure app secret. Copy this value as it will be hidden as soon as you leave this blade. You will need this value later when configuring your test drive.

            :::image type="content" source="./media/test-drive/add-client-secret-customer.png" alt-text="Adding a client secret.":::

5. Add the Service Principal role to the application to allow the Azure AD app to remove users from your Azure tenant. There are two options for completing this step.

    **Option 1**

    1. Search for **Azure AD roles and administrators** and select the service.

        :::image type="content" source="./media/test-drive/active-ad-roles.png" alt-text="Shows how to search for Azure AD roles and administrators.":::

    2. On the **All roles** page, search for the **User Administrator** role and double-click **User administrator**.

        :::image type="content" source="./media/test-drive/user-administrator.png" alt-text="Shows how to search for and select User administrator.":::

    3. Select **Add Assignments**.

        :::image type="content" source="./media/test-drive/add-assignments-1.png" alt-text="Shows the Add assignments button.":::

    4. Search for and select the above-created app, then **Add**.

        :::image type="content" source="./media/test-drive/add-assignments-2.png" alt-text="Shows a successful app assignment.":::

    5. Note the Service Principal role successfully assigned to the application:

        :::image type="content" source="./media/test-drive/successful-assignment.png" alt-text="Shows the Service Principal role successfully assigned to the application.":::

    **Option 2**

    1. Open an Administrative-level PowerShell command prompt.
    2. Install-Module MSOnline (run this command if MSOnline is not installed).
    3. Connect-MsolService (this will display a popup window; sign in with the newly created org tenant).
    4. $applicationId = **<YOUR_APPLICATION_ID>**.
    5. $sp = Get-MsolServicePrincipal -AppPrincipalId $applicationId.
    6. Add-MsolRoleMember -RoleObjectId fe930be7-5e62-47db-91af-98c3a49a38b1 -RoleMemberObjectId $sp.ObjectId -RoleMemberType servicePrincipal.

         :::image type="content" source="./media/test-drive/sign-in-to-account.png" alt-text="Signing in to your account.":::

6. Create a new Security Group and add it to Canvas App (Power Apps). This step is only applicable to Dynamics 365 for Customer Engagement & Power Apps offers with the Canvas Apps option.
    1. Create a new Security Group.
        1. Go to **Azure Active Directory**.
        1. Under **Manage**, select **Groups**.
        1. Select **+ New Group**.
        1. Select the **Security Group** type. 
        1. For **Group Name**, enter *TestDriveSecurityGroup*.
        1. Add a description, such as **Security Group for Test Drive**.
        1. Leave other fields as default and select **Create**.

            :::image type="content" source="./media/test-drive/create-new-group.png" alt-text="Shows how to create a new security group.":::

    1. Add the security group just created to the Canvas App (Power Apps).
        1. Open the **PowerApps** portal page and sign in.
        1. Select **Apps**, then the ellipses at the app.
        1. Select **Share**.
        1. Search for the **TestDriveSecurityGroup** security group created in the prior step.
        1. Add **Data permissions** to the security group.
        1. Clear the **send email** invitation check box.
        1. Select **Share**.
    
            > [!NOTE]
            > When using a backend data source other than CE/Dataverse for Canvas App (Power Apps):
            > - Allow the above created security group to access your data source. For example, a SharePoint data source.
            > - Open SharePoint and share the data table with the Security Group.

7. Add the just-created Azure app as an application user to your test drive CRM instance. This step is applicable only to Dynamics 365 apps on Dataverse and Power Apps Offers.
    1. Sign into **CRM instance** and select **Setting** > **Security** > **Users**.
    2. Change the view to **Application Users**.

        :::image type="content" source="./media/test-drive/application-users.png" alt-text="Setting account information for a user.":::

    3. Add a new user (ensure the form is for APPLICATION USER).
    4. Add the above created **Azure ApplicationId** in **Application ID**.
    5. Select **Save**.
    6. Select **Manage roles**.
    7. Assign a custom or OOB security role that contains read, write, and assign role privileges, such as *System Administrator*.

        :::image type="content" source="./media/test-drive/security-roles-selection.png" alt-text="Selecting the role privileges.":::

    10. Enable the **Act on Behalf of Another User** privilege.
    11. Assign the application user the custom security role you created for your test drive.

## Set up for  Dynamics 365 Operations Apps

1. Sign into the [Azure portal](https://portal.azure.com/) with an Admin account.
2. Verify you are in the tenant associated with your Dynamics 365 test drive instance by hovering over your account icon in the upper right corner. If you are not in the correct tenant, select the account icon to switch into the correct tenant.

    :::image type="content" source="./media/test-drive/select-correct-tenant.png" alt-text="Selecting the correct tenant.":::

3. Create an Azure AD App in Azure. AppSource will use this app to provision and deprovision the test drive user in your tenant.
    1. From the filter pane, select **Azure Active Directory**.
    2. Select **App registrations**.

        :::image type="content" source="./media/test-drive/app-registrations.png" alt-text="Selecting an app registration.":::

    3. Select **New registration**.
    4. Provide an appropriate application name.

        :::image type="content" source="./media/test-drive/register-an-application.png" alt-text="Registering an application.":::

    5. Under Supported account types, select **Account in any organization directory and personal Microsoft accounts**.
    6. Select **Create** and wait for your app to be created.
    7. Once the app is created, note the **Application ID** displayed on the overview screen. You will need this value later when configuring your test drive.
    8. Under **Manage Application**, select **API permissions**.
    9. Select **Add a permission** and then **Microsoft Graph API**.
    10. Select the **Application** permission category and then the **Directory.Read.All** and **Directory.ReadWrite.All** permissions.

        :::image type="content" source="./media/test-drive/microsoft-graph.png" alt-text="Setting application permissions.":::

    11. Select **Add permission**.
    12. Once the permission is added, select **Grant admin consent for Microsoft**.
    13. From the message alert, select **Yes**.

        [![Shows the application permissions are successfully granted.](media/test-drive/api-permissions-confirmation-operations.png)](media/test-drive/api-permissions-confirmation-operations.png#lightbox)

    14. To generate a secret for the Azure AD App:
        1. From **Manage Application**, select **Certificate and secrets**.
        2. Under Client secrets, select **New client secret**.
        3. Enter a description, such as *Test Drive*, and select an appropriate duration. The test drive will break once this Key expires, at which point you will need to generate and provide AppSource a new key.
        4. Select **Add** to generate the Azure app secret. Copy this value as it will be hidden as soon as you leave this blade. You will need this value later when configuring your test drive.

            :::image type="content" source="./media/test-drive/add-client-secret-operations.png" alt-text="Shows addition of a client secret.":::

4. Add the Service Principal role to the application to allow the Azure AD app to remove users from your Azure tenant.
    1. Open an Administrative-level PowerShell command prompt.
    2. Install-Module MSOnline (run this command if MSOnline is not installed).
    3. Connect-MsolService (this will display a popup window; sign in with the newly created org tenant).
    4. $applicationId = **<YOUR_APPLICATION_ID>**.
    5. $sp = Get-MsolServicePrincipal -AppPrincipalId $applicationId.
    6. Add-MsolRoleMember -RoleObjectId fe930be7-5e62-47db-91af-98c3a49a38b1 -RoleMemberObjectId $sp.ObjectId -RoleMemberType servicePrincipal.

        :::image type="content" source="./media/test-drive/sign-in-to-account.png" alt-text="Signing in to your account.":::

5. Now add the above app to **Dynamics 365 Operations Apps** to enable the app to manage users.
    1. Find your **Dynamics 365 Operations Apps** instance.
    2. From the top-left corner, click the three-line menu (hamburger).
    3. Select **System Administration**.
    4. Select **Azure Active Directory applications**.
    5. Select **+ New**.
    6. Enter the **Client ID of the Azure AD app** that is going to perform the on-behalf-of actions.

    > [!NOTE]
    > The user ID on whose behalf the actions will be performed (typically the System Admin of the instance or a user who has privileges to add other users).

    [![The user ID on whose behalf the actions will be performed (typically the System Admin of the instance or a user who has privileges to add other users).](media/test-drive/system-admin-user-id.png)](media/test-drive/system-admin-user-id.png#lightbox)
<!--
## Next steps

- [Commercial marketplace partner and customer usage attribution](azure-partner-customer-usage-attribution.md) -->
