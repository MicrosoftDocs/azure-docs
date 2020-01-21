---
title: 'Tutorial: Configure SuccessFactors inbound provisioning in Azure Active Directory | Microsoft Docs'
description: Learn how to configure inbound provisioning from SuccessFactors 
services: active-directory
author: cmmdesai
documentationcenter: na
manager: jodadzie
ms.assetid: 1ff90231-1312-463e-8949-7d976e433fc3
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/05/2019
ms.author: chmutali
---
# Tutorial: Configure SAP SuccessFactors to Active Directory user provisioning (Preview)
The objective of this tutorial is to show the steps you need to perform to provision users from SuccessFactors Employee Central into Active Directory (AD) and Azure AD, with optional write-back of email address to SuccessFactors. This integration is in public preview and supports retrieving more than [70+ user attributes](../manage-apps/sap-successfactors-attribute-reference.md) from SuccessFactors Employee Central.

>[!NOTE]
>Use this tutorial if the users you want to provision from SuccessFactors need an on-premises AD account and optionally an Azure AD account. If the users from SuccessFactors only need Azure AD account (cloud-only users), then please refer to the tutorial on [configure SAP SuccessFactors to Azure AD](sap-successfactors-inbound-provisioning-cloud-only-tutorial.md) user provisioning. 


## Overview

The [Azure Active Directory user provisioning service](../manage-apps/user-provisioning.md) integrates with the [SuccessFactors Employee Central](https://www.successfactors.com/products-services/core-hr-payroll/employee-central.html) in order to manage the identity life cycle of users. 

The SuccessFactors user provisioning workflows supported by the Azure AD user provisioning service enable automation of the following human resources and identity lifecycle management scenarios:

* **Hiring new employees** - When a new employee is added to SuccessFactors, a user account is automatically created in Active Directory, Azure Active Directory, and optionally Office 365 and [other SaaS applications supported by Azure AD](../manage-apps/user-provisioning.md), with write-back of the email address to SuccessFactors.

* **Employee attribute and profile updates** - When an employee record is updated in SuccessFactors (such as their name, title, or manager), their user account will be automatically updated in Active Directory, Azure Active Directory, and optionally Office 365 and [other SaaS applications supported by Azure AD](../manage-apps/user-provisioning.md).

* **Employee terminations** - When an employee is terminated in SuccessFactors, their user account is automatically disabled in Active Directory, Azure Active Directory, and optionally Office 365 and [other SaaS applications supported by Azure AD](../manage-apps/user-provisioning.md).

* **Employee rehires** - When an employee is rehired in SuccessFactors, their old account can be automatically reactivated or re-provisioned (depending on your preference) to Active Directory, Azure Active Directory, and optionally Office 365 and [other SaaS applications supported by Azure AD](../manage-apps/user-provisioning.md).

### Who is this user provisioning solution best suited for?

This SuccessFactors to Active Directory user provisioning solution is ideally suited for:

* Organizations that desire a pre-built, cloud-based solution for SuccessFactors user provisioning

* Organizations that require direct user provisioning from SuccessFactors to Active Directory

* Organizations that require users to be provisioned using data obtained from the [SuccessFactors Employee Central (EC)](https://www.successfactors.com/products-services/core-hr-payroll/employee-central.html)

* Organizations that require joining, moving, and leaving users to be synced to one or more Active Directory Forests, Domains, and OUs based only on change information detected in [SuccessFactors Employee Central (EC)](https://www.successfactors.com/products-services/core-hr-payroll/employee-central.html)

* Organizations using Office 365 for email

## Solution Architecture

This section describes the end-to-end user provisioning solution architecture for common hybrid environments. There are two related flows:

* **Authoritative HR Data Flow – from SuccessFactors to on-premises Active Directory:** In this flow worker events (such as New Hires, Transfers, Terminations) first occur in the cloud SuccessFactors Employee Central and then the event data flows into on-premises Active Directory through Azure AD and the Provisioning Agent. Depending on the event, it may lead to create/update/enable/disable operations in AD.
* **Email Writeback Flow – from on-premises Active Directory to SuccessFactors:** Once the account creation is complete in Active Directory, it is synced with Azure AD through Azure AD Connect sync and email attribute can be written back to SuccessFactors.

  ![Overview](./media/sap-successfactors-inbound-provisioning/sf2ad-overview.png)

### End-to-end user data flow

1. The HR team performs worker transactions (Joiners/Movers/Leavers or New Hires/Transfers/Terminations) in SuccessFactors Employee Central
2. The Azure AD Provisioning Service runs scheduled synchronizations of identities from SuccessFactors EC and identifies changes that need to be processed for sync with on-premises Active Directory.
3. The Azure AD Provisioning Service invokes the on-premises Azure AD Connect Provisioning Agent with a request payload containing AD account create/update/enable/disable operations.
4. The Azure AD Connect Provisioning Agent uses a service account to add/update AD account data.
5. The Azure AD Connect Sync engine runs delta sync to pull updates in AD.
6. The Active Directory updates are synced with Azure Active Directory.
7. If the [SuccessFactors Writeback app](sap-successfactors-writeback-tutorial.md) is configured, it writes back email attribute to SuccessFactors, based on the matching attribute used.

## Planning your deployment

Configuring Cloud HR driven user provisioning from SuccessFactors to AD requires considerable planning covering different aspects such as:
* Setup of the Azure AD Connect provisioning agent 
* Number of SuccessFactors to AD user provisioning apps to deploy
* Matching ID, Attribute mapping, transformation and scoping filters

Please refer to the [cloud HR deployment plan](../manage-apps/plan-cloud-hr-provision.md) for comprehensive guidelines around these topics. 

## Configuring SuccessFactors for the integration

A common requirement of all the SuccessFactors provisioning connectors is that they require credentials of a SuccessFactors account with the right permissions to invoke the SuccessFactors OData APIs. This section describes steps to create the service account in SuccessFactors and grant appropriate permissions. 

* [Create/identify API user account in SuccessFactors](#createidentify-api-user-account-in-successfactors)
* [Create an API permissions role](#create-an-api-permissions-role)
* [Create a Permission Group for the API user](#create-a-permission-group-for-the-api-user)
* [Grant Permission Role to the Permission Group](#grant-permission-role-to-the-permission-group)

### Create/identify API user account in SuccessFactors
Work with your SuccessFactors admin team or implementation partner to create or identify a user account in SuccessFactors that will be used to invoke the OData APIs. The username and password credentials of this account will be required when configuring the provisioning apps in Azure AD. 

### Create an API permissions role

* Log in to SAP SuccessFactors with a user account that has access to the Admin Center.
* Search for *Manage Permission Roles*, then select **Manage Permission Roles** from the search results.
  ![Manage Permission Roles](./media/sap-successfactors-inbound-provisioning/manage-permission-roles.png)
* From the Permission Role List, click **Create New**.
  > [!div class="mx-imgBorder"]
  > ![Create New Permission Role](./media/sap-successfactors-inbound-provisioning/create-new-permission-role-1.png)
* Add a **Role Name** and **Description** for the new permission role. The name and description should indicate that the role is for API usage permissions.
  > [!div class="mx-imgBorder"]
  > ![Permission role detail](./media/sap-successfactors-inbound-provisioning/permission-role-detail.png)
* Under Permission settings, click **Permission...**, then scroll down the permission list and click **Manage Integration Tools**. Check the box for **Allow Admin to Access to OData API through Basic Authentication**.
  > [!div class="mx-imgBorder"]
  > ![Manage integration tools](./media/sap-successfactors-inbound-provisioning/manage-integration-tools.png)
* Scroll down in the same box and select **Employee Central API**. Add permissions as shown below to read using ODATA API and edit using ODATA API. Select the edit option if you plan to use the same account for the Writeback to SuccessFactors scenario. 
  > [!div class="mx-imgBorder"]
  > ![Read write permissions](./media/sap-successfactors-inbound-provisioning/odata-read-write-perm.png)

  >[!NOTE]
  >For the complete list of attributes retrieved by this provisioning app, please refer to [SuccessFactors Attribute Reference](../manage-apps/sap-successfactors-attribute-reference.md)

* Click on **Done**. Click **Save Changes**.

### Create a Permission Group for the API user

* In the SuccessFactors Admin Center, search for *Manage Permission Groups*, then select **Manage Permission Groups** from the search results.
  > [!div class="mx-imgBorder"]
  > ![Manage permission groups](./media/sap-successfactors-inbound-provisioning/manage-permission-groups.png)
* From the Manage Permission Groups window, click **Create New**.
  > [!div class="mx-imgBorder"]
  > ![Add new group](./media/sap-successfactors-inbound-provisioning/create-new-group.png)
* Add a Group Name for the new group. The group name should indicate that the group is for API users.
  > [!div class="mx-imgBorder"]
  > ![Permission group name](./media/sap-successfactors-inbound-provisioning/permission-group-name.png)
* Add members to the group. For example, you could select **Username** from the People Pool drop-down menu and then enter the username of the API account that will be used for the integration. 
  > [!div class="mx-imgBorder"]
  > ![Add group members](./media/sap-successfactors-inbound-provisioning/add-group-members.png)
* Click **Done** to finish creating the Permission Group.

### Grant Permission Role to the Permission Group

* In SuccessFactors Admin Center, search for *Manage Permission Roles*, then select **Manage Permission Roles** from the search results.
* From the **Permission Role List**, select the role that you created for API usage permissions.
* Under **Grant this role to...**, click **Add...** button.
* Select **Permission Group...** from the drop-down menu, then click **Select...** to open the Groups window to search and select the group created above. 
  > [!div class="mx-imgBorder"]
  > ![Add permission group](./media/sap-successfactors-inbound-provisioning/add-permission-group.png)
* Review the Permission Role grant to the Permission Group. 
  > [!div class="mx-imgBorder"]
  > ![Permission Role and Group detail](./media/sap-successfactors-inbound-provisioning/permission-role-group.png)
* Click **Save Changes**.

## Configuring user provisioning from SuccessFactors to Active Directory

This section provides steps for user account provisioning from SuccessFactors to each Active Directory domain within the scope of your integration.

* [Add the provisioning connector app and download the Provisioning Agent](#part-1-add-the-provisioning-connector-app-and-download-the-provisioning-agent)
* [Install and configure on-premises Provisioning Agent(s)](#part-2-install-and-configure-on-premises-provisioning-agents)
* [Configure connectivity to SuccessFactors and Active Directory](#part-3-in-the-provisioning-app-configure-connectivity-to-successfactors-and-active-directory)
* [Configure attribute mappings](#part-4-configure-attribute-mappings)
* [Enable and launch user provisioning](#enable-and-launch-user-provisioning)

### Part 1: Add the provisioning connector app and download the Provisioning Agent

**To configure SuccessFactors to Active Directory provisioning:**

1. Go to <https://portal.azure.com>

2. In the left navigation bar, select **Azure Active Directory**

3. Select **Enterprise Applications**, then **All Applications**.

4. Select **Add an application**, and select the **All** category.

5. Search for **SuccessFactors to Active Directory User Provisioning**, and add that app from the gallery.

6. After the app is added and the app details screen is shown, select **Provisioning**

7. Change the **Provisioning** **Mode** to **Automatic**

8. Click on the information banner displayed to download the Provisioning Agent. 
   > [!div class="mx-imgBorder"]
   > ![Download Agent](./media/sap-successfactors-inbound-provisioning/download-pa-agent.png "Download Agent Screen")


### Part 2: Install and configure on-premises Provisioning Agent(s)

To provision to Active Directory on-premises, the Provisioning agent must be installed on a server that has .NET 4.7.1+ Framework and network access to the desired Active Directory domain(s).

> [!TIP]
> You can check the version of the .NET framework on your server using the instructions provided [here](https://docs.microsoft.com/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed).
> If the server does not have .NET 4.7.1 or higher installed, you can download it from [here](https://support.microsoft.com/help/4033342/the-net-framework-4-7-1-offline-installer-for-windows).  

Transfer the downloaded agent installer to the server host and follow the steps given below to complete the agent configuration.

1. Sign in to the Windows Server where you want to install the new agent.

1. Launch the Provisioning Agent installer, agree to the terms, and click on the **Install** button.

   ![Install Screen](./media/workday-inbound-tutorial/pa_install_screen_1.png "Install Screen")
   
1. After installation is complete, the wizard will launch and you will see the **Connect Azure AD** screen. Click on the **Authenticate** button to connect to your Azure AD instance.

   ![Connect Azure AD](./media/workday-inbound-tutorial/pa_install_screen_2.png "Connect Azure AD")
   
1. Authenticate to your Azure AD instance using Global Admin Credentials.

   ![Admin Auth](./media/workday-inbound-tutorial/pa_install_screen_3.png "Admin Auth")

   > [!NOTE]
   > The Azure AD admin credentials is used only to connect to your Azure AD tenant. The agent does not store the credentials locally on the server.

1. After successful authentication with Azure AD, you will see the **Connect Active Directory** screen. In this step, enter your AD domain name and click on the **Add Directory** button.

   ![Add Directory](./media/workday-inbound-tutorial/pa_install_screen_4.png "Add Directory")
  
1. You will now be prompted to enter the credentials required to connect to the AD Domain. On the same screen, you can use the **Select domain controller priority** to specify domain controllers that the agent should use for sending provisioning requests.

   ![Domain Credentials](./media/workday-inbound-tutorial/pa_install_screen_5.png)
   
1. After configuring the domain, the installer displays a list of configured domains. On this screen, you can repeat step #5 and #6 to add more domains or click on **Next** to proceed to agent registration.

   ![Configured Domains](./media/workday-inbound-tutorial/pa_install_screen_6.png "Configured Domains")

   > [!NOTE]
   > If you have multiple AD domains (e.g. na.contoso.com, emea.contoso.com), then please add each domain individually to the list.
   > Only adding the parent domain (e.g. contoso.com) is not sufficient. You must register each child domain with the agent.
   
1. Review the configuration details and click on **Confirm** to register the agent.
  
   ![Confirm Screen](./media/workday-inbound-tutorial/pa_install_screen_7.png "Confirm Screen")
   
1. The configuration wizard displays the progress of the agent registration.
  
   ![Agent Registration](./media/workday-inbound-tutorial/pa_install_screen_8.png "Agent Registration")
   
1. Once the agent registration is successful, you can click on **Exit** to exit the Wizard.
  
   ![Exit Screen](./media/workday-inbound-tutorial/pa_install_screen_9.png "Exit Screen")
   
1. Verify the installation of the Agent and make sure it is running by opening the “Services” Snap-In and look for the Service named “Microsoft Azure AD Connect Provisioning Agent”
  
   ![Services](./media/workday-inbound-tutorial/services.png)

### Part 3: In the provisioning app, configure connectivity to SuccessFactors and Active Directory
In this step, we establish connectivity with SuccessFactors and Active Directory in the Azure portal. 

1. In the Azure portal, go back to the SuccessFactors to Active Directory User Provisioning App created in [Part 1](#part-1-add-the-provisioning-connector-app-and-download-the-provisioning-agent)

1. Complete the **Admin Credentials** section as follows:

   * **Admin Username** – Enter the username of the SuccessFactors API user account, with the company ID appended. It has the format: **username\@companyID**

   * **Admin password –** Enter the password of the SuccessFactors API user account. 

   * **Tenant URL –** Enter the name of the SuccessFactors OData API services endpoint. Only enter the host name of server without http or https. This value should look like: **<api-server-name>.successfactors.com**.

   * **Active Directory Forest -** The "Name" of your Active Directory domain, as registered with the agent. Use the dropdown to select the target domain for provisioning. This value is typically a string like: *contoso.com*

   * **Active Directory Container -** Enter the container DN where the agent should create user accounts by default.
        Example: *OU=Users,DC=contoso,DC=com*
        > [!NOTE]
        > This setting only comes into play for user account creations if the *parentDistinguishedName* attribute is not configured in the attribute mappings. This setting is not used for user search or update operations. The entire domain sub tree falls in the scope of the search operation.

   * **Notification Email –** Enter your email address, and check the “send email if failure occurs” checkbox.
    > [!NOTE]
    > The Azure AD Provisioning Service sends email notification if the provisioning job goes into a [quarantine](/azure/active-directory/manage-apps/application-provisioning-quarantine-status) state.

   * Click the **Test Connection** button. If the connection test succeeds, click the **Save** button at  the top. If it fails, double-check that the SuccessFactors credentials and the AD credentials configured on the agent setup are valid.
    >[!div class="mx-imgBorder"]
    >![Azure portal](./media/sap-successfactors-inbound-provisioning/sf2ad-provisioning-creds.png)

   * Once the credentials are saved successfully, the **Mappings** section will display the default mapping **Synchronize SuccessFactors Users to On Premises Active Directory**

### Part 4: Configure attribute mappings

In this section, you will configure how user data flows from SuccessFactors to Active Directory.

1. On the Provisioning tab under **Mappings**, click **Synchronize SuccessFactors Users to On Premises Active Directory**.

1. In the **Source Object Scope** field, you can select which sets of  users in SuccessFactors should be in scope for provisioning to AD, by defining a set of attribute-based filters. The default scope is “all users in SuccessFactors”. Example filters:

   * Example: Scope to users with personIdExternal between 1000000 and
        2000000 (excluding 2000000)

      * Attribute: personIdExternal

      * Operator: REGEX Match

      * Value: (1[0-9][0-9][0-9][0-9][0-9][0-9])

   * Example: Only employees and not contingent workers

      * Attribute: EmployeeID

      * Operator: IS NOT NULL

   > [!TIP]
   > When you are configuring the provisioning app for the first time, you will need to test and verify your attribute mappings and expressions to make sure that it is giving you the desired result. Microsoft recommends using the scoping filters under **Source Object Scope** to test your mappings with a few test users from SuccessFactors. Once you have verified that the mappings work, then you can either remove the filter or gradually expand it to include more users.

   > [!CAUTION] 
   > The default behavior of the provisioning engine is to disable/delete users that go out of scope. This may not be desirable in your SuccessFactors to AD integration. To override this default behavior refer to the article [Skip deletion of user accounts that go out of scope](../manage-apps/skip-out-of-scope-deletions.md)
  
1. In the **Target Object Actions** field, you can globally filter what actions are performed on Active Directory. **Create** and **Update** are most common.

1. In the **Attribute mappings** section, you can define how individual SuccessFactors attributes map to Active Directory attributes.

  >[!NOTE]
  >For the complete list of SuccessFactors attribute supported by the application, please refer to [SuccessFactors Attribute Reference](../manage-apps/sap-successfactors-attribute-reference.md)


1. Click on an existing attribute mapping to update it, or click **Add new mapping** at the bottom of the screen to add new
        mappings. An individual attribute mapping supports these properties:

      * **Mapping Type**

         * **Direct** – Writes the value of the SuccessFactors attribute to the AD attribute, with no changes

         * **Constant** - Write a static, constant string value to the AD attribute

         * **Expression** – Allows you to write a custom value to the AD attribute, based on one or more SuccessFactors attributes. [For more info, see this article on expressions](../manage-apps/functions-for-customizing-application-data.md).

      * **Source attribute** - The user attribute from SuccessFactors

      * **Default value** – Optional. If the source attribute has an empty value, the mapping will write this value instead.
            Most common configuration is to leave this blank.

      * **Target attribute** – The user attribute in Active  Directory.

      * **Match objects using this attribute** – Whether or not this mapping should be used to uniquely identify users between
            SuccessFactors and Active Directory. This value is typically set on the  Worker ID field for SuccessFactors, which is typically mapped to one of the Employee ID attributes in Active Directory.

      * **Matching precedence** – Multiple matching attributes can be set. When there are multiple, they are evaluated in the
            order defined by this field. As soon as a match is found, no  further matching attributes are evaluated.

      * **Apply this mapping**

         * **Always** – Apply this mapping on both user creation and update actions

         * **Only during creation** - Apply this mapping only on user creation actions

1. To save your mappings, click **Save** at the top of the  Attribute-Mapping section.

Once your attribute mapping configuration is complete, you can now [enable and launch the user provisioning service](#enable-and-launch-user-provisioning).

## Enable and launch user provisioning

Once the SuccessFactors provisioning app configurations have been completed, you can turn on the provisioning service in the Azure portal.

> [!TIP]
> By default when you turn on the provisioning service, it will initiate provisioning operations for all users in scope. If there are errors in the mapping or SuccessFactors data issues, then the provisioning job might fail and go into the quarantine state. To avoid this, as a best practice, we recommend configuring **Source Object Scope** filter and testing  your attribute mappings with a few test users before launching the full sync for all users. Once you have verified that the mappings work and are giving you the desired results, then you can either remove the filter or gradually expand it to include more users.

1. In the **Provisioning** tab, set the **Provisioning Status** to **On**.

2. Click **Save**.

3. This operation will start the initial sync, which can take a variable number of hours depending on how many users are in the SuccessFactors tenant. You can check the progress bar to the track the progress of the sync cycle. 

4. At any time, check the **Audit logs** tab in the Azure portal to see what actions the provisioning service has performed. The audit logs lists all individual sync events performed by the provisioning service, such as which users are being read out of SuccessFactors and then subsequently added or updated to Active Directory. 

5. Once the initial sync is completed, it will write an audit summary report in the **Provisioning** tab, as shown below.

   > [!div class="mx-imgBorder"]
   > ![Provisioning progress bar](./media/sap-successfactors-inbound-provisioning/prov-progress-bar-stats.png)

## Next steps

* [Learn more about supported SuccessFactors Attributes for inbound provisioning](../manage-apps/sap-successfactors-attribute-reference.md)
* [Learn how to configure email writeback to SuccessFactors](sap-successfactors-writeback-tutorial.md)
* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)
* [Learn how to configure single sign-on between SuccessFactors and Azure Active Directory](successfactors-tutorial.md)
* [Learn how to integrate other SaaS applications with Azure Active Directory](tutorial-list.md)
* [Learn how to export and import your provisioning configurations](../manage-apps/export-import-provisioning-configuration.md)
