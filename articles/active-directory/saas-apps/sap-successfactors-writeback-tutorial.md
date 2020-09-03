---
title: 'Tutorial: Configure SAP SuccessFactors writeback in Azure Active Directory | Microsoft Docs'
description: Learn how to configure attribute write-back to SAP SuccessFactors from Azure AD
services: active-directory
author: cmmdesai
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.topic: article
ms.workload: identity
ms.date: 08/05/2020
ms.author: chmutali
---
# Tutorial: Configure attribute write-back from Azure AD to SAP SuccessFactors
The objective of this tutorial is to show the steps to write-back attributes from Azure AD to SAP SuccessFactors Employee Central. 

## Overview

You can configure the SAP SuccessFactors Writeback app to write specific attributes from Azure Active Directory to SAP SuccessFactors Employee Central. The SuccessFactors writeback provisioning app supports assigning values to the following Employee Central attributes:

* Work Email
* Username
* Business phone number (including country code, area code, number, and extension)
* Business phone number primary flag
* Cell phone number (including country code, area code, number)
* Cell phone primary flag 
* User custom01-custom15 attributes
* loginMethod attribute

> [!NOTE]
> This app does not have any dependency on the SuccessFactors inbound user provisioning integration apps. You can configure it independent of [SuccessFactors to on-premises AD](sap-successfactors-inbound-provisioning-tutorial.md) provisioning app or [SuccessFactors to Azure AD](sap-successfactors-inbound-provisioning-cloud-only-tutorial.md) provisioning app.

### Who is this user provisioning solution best suited for?

This SuccessFactors Writeback user provisioning solution is ideally suited for:

* Organizations using Office 365 that desire to write-back authoritative attributes managed by IT (such as email address, phone, username) back to SuccessFactors Employee Central.

## Configuring SuccessFactors for the integration

All SuccessFactors provisioning connectors require credentials of a SuccessFactors account with the right permissions to invoke the Employee Central OData APIs. This section describes steps to create the service account in SuccessFactors and grant appropriate permissions. 

* [Create/identify API user account in SuccessFactors](#createidentify-api-user-account-in-successfactors)
* [Create an API permissions role](#create-an-api-permissions-role)
* [Create a Permission Group for the API user](#create-a-permission-group-for-the-api-user)
* [Grant Permission Role to the Permission Group](#grant-permission-role-to-the-permission-group)

### Create/identify API user account in SuccessFactors
Work with your SuccessFactors admin team or implementation partner to create or identify a user account in SuccessFactors that will be used to invoke the OData APIs. The username and password credentials of this account will be required when configuring the provisioning apps in Azure AD. 

### Create an API permissions role

1. Log in to SAP SuccessFactors with a user account that has access to the Admin Center.
1. Search for *Manage Permission Roles*, then select **Manage Permission Roles** from the search results.

   ![Manage Permission Roles](./media/sap-successfactors-inbound-provisioning/manage-permission-roles.png)

1. From the Permission Role List, click **Create New**.

   > [!div class="mx-imgBorder"]
   > ![Create New Permission Role](./media/sap-successfactors-inbound-provisioning/create-new-permission-role-1.png)

1. Add a **Role Name** and **Description** for the new permission role. The name and description should indicate that the role is for API usage permissions.

   > [!div class="mx-imgBorder"]
   > ![Permission role detail](./media/sap-successfactors-inbound-provisioning/permission-role-detail.png)

1. Under Permission settings, click **Permission...**, then scroll down the permission list and click **Manage Integration Tools**. Check the box for **Allow Admin to Access to OData API through Basic Authentication**.

   > [!div class="mx-imgBorder"]
   > ![Manage integration tools](./media/sap-successfactors-inbound-provisioning/manage-integration-tools.png)

1. Scroll down in the same box and select **Employee Central API**. Add permissions as shown below to read using ODATA API and edit using ODATA API. Select the edit option if you plan to use the same account for the write-back to SuccessFactors scenario. 

   > [!div class="mx-imgBorder"]
   > ![Read write permissions](./media/sap-successfactors-inbound-provisioning/odata-read-write-perm.png)

1. Click on **Done**. Click **Save Changes**.

### Create a Permission Group for the API user

1. In the SuccessFactors Admin Center, search for *Manage Permission Groups*, then select **Manage Permission Groups** from the search results.

   > [!div class="mx-imgBorder"]
   > ![Manage permission groups](./media/sap-successfactors-inbound-provisioning/manage-permission-groups.png)

1. From the Manage Permission Groups window, click **Create New**.

   > [!div class="mx-imgBorder"]
   > ![Add new group](./media/sap-successfactors-inbound-provisioning/create-new-group.png)

1. Add a Group Name for the new group. The group name should indicate that the group is for API users.

   > [!div class="mx-imgBorder"]
   > ![Permission group name](./media/sap-successfactors-inbound-provisioning/permission-group-name.png)

1. Add members to the group. For example, you could select **Username** from the People Pool drop-down menu and then enter the username of the API account that will be used for the integration. 

   > [!div class="mx-imgBorder"]
   > ![Add group members](./media/sap-successfactors-inbound-provisioning/add-group-members.png)

1. Click **Done** to finish creating the Permission Group.

### Grant Permission Role to the Permission Group

1. In SuccessFactors Admin Center, search for *Manage Permission Roles*, then select **Manage Permission Roles** from the search results.
1. From the **Permission Role List**, select the role that you created for API usage permissions.
1. Under **Grant this role to...**, click **Add...** button.
1. Select **Permission Group...** from the drop-down menu, then click **Select...** to open the Groups window to search and select the group created above. 

   > [!div class="mx-imgBorder"]
   > ![Add permission group](./media/sap-successfactors-inbound-provisioning/add-permission-group.png)

1. Review the Permission Role grant to the Permission Group. 
   > [!div class="mx-imgBorder"]
   > ![Permission Role and Group detail](./media/sap-successfactors-inbound-provisioning/permission-role-group.png)

1. Click **Save Changes**.

## Preparing for SuccessFactors Writeback

The SuccessFactors Writeback provisioning app uses certain *code* values for setting email and phone numbers in Employee Central. These *code* values are set as constant values in the attribute-mapping table and are different for each SuccessFactors instance. This section uses [Postman](https://www.postman.com/downloads/) to fetch the code values. You may use [cURL](https://curl.haxx.se/), [Fiddler](https://www.telerik.com/fiddler) or any other similar tool to send HTTP requests. 

### Download and configure Postman with your SuccessFactors tenant

1. Download [Postman](https://www.postman.com/downloads/)
1. Create a "New Collection" in the Postman app. Call it "SuccessFactors". 

   > [!div class="mx-imgBorder"]
   > ![New Postman collection](./media/sap-successfactors-inbound-provisioning/new-postman-collection.png)

1. In the "Authorization" tab, enter credentials of the API user configured in the previous section. Configure type as "Basic Auth". 

   > [!div class="mx-imgBorder"]
   > ![Postman authorization](./media/sap-successfactors-inbound-provisioning/postman-authorization.png)

1. Save the configuration. 

### Retrieve constant value for emailType

1. In Postman, click on the ellipsis (...) associated with the SuccessFactors collection and add a "New Request" called "Get Email Types" as shown below. 

   > [!div class="mx-imgBorder"]
   > ![Postman email request ](./media/sap-successfactors-inbound-provisioning/postman-email-request.png)

1. Open the "Get Email Type" request panel. 
1. In the GET URL, add the following URL, replacing `successFactorsAPITenantName` with the API tenant for your SuccessFactors instance. 
   `https://<successfactorsAPITenantName>/odata/v2/Picklist('ecEmailType')?$expand=picklistOptions&$select=picklistOptions/id,picklistOptions/externalCode&$format=json`

   > [!div class="mx-imgBorder"]
   > ![Postman get email type](./media/sap-successfactors-inbound-provisioning/postman-get-email-type.png)

1. The "Authorization" tab will inherit the auth configured for the collection. 
1. Click on "Send" to invoke the API call. 
1. In the Response body, view the JSON result set and look for the ID corresponding to the `externalCode = B`. 

   > [!div class="mx-imgBorder"]
   > ![Postman email type response](./media/sap-successfactors-inbound-provisioning/postman-email-type-response.png)

1. Note down this value as the constant to use with *emailType* in the attribute-mapping table.

### Retrieve constant value for phoneType

1. In Postman, click on the ellipsis (...) associated with the SuccessFactors collection and add a "New Request" called "Get Phone Types" as shown below. 

   > [!div class="mx-imgBorder"]
   > ![Postman phone request](./media/sap-successfactors-inbound-provisioning/postman-phone-request.png)

1. Open the "Get Phone Type" request panel. 
1. In the GET URL, add the following URL, replacing `successFactorsAPITenantName` with the API tenant for your SuccessFactors instance. 
   `https://<successfactorsAPITenantName>/odata/v2/Picklist('ecPhoneType')?$expand=picklistOptions&$select=picklistOptions/id,picklistOptions/externalCode&$format=json`

   > [!div class="mx-imgBorder"]
   > ![Postman get phone type](./media/sap-successfactors-inbound-provisioning/postman-get-phone-type.png)

1. The "Authorization" tab will inherit the auth configured for the collection. 
1. Click on "Send" to invoke the API call. 
1. In the Response body, view the JSON result set and look for the *id* corresponding to the `externalCode = B` and `externalCode = C`. 

   > [!div class="mx-imgBorder"]
   > ![Postman-Phone](./media/sap-successfactors-inbound-provisioning/postman-phone-type-response.png)

1. Note down these values as the constants to use with *businessPhoneType* and *cellPhoneType* in the attribute-mapping table.

## Configuring SuccessFactors Writeback App

This section provides steps for 

* [Add the provisioning connector app and configure connectivity to SuccessFactors](#part-1-add-the-provisioning-connector-app-and-configure-connectivity-to-successfactors)
* [Configure attribute mappings](#part-2-configure-attribute-mappings)
* [Enable and launch user provisioning](#enable-and-launch-user-provisioning)

### Part 1: Add the provisioning connector app and configure connectivity to SuccessFactors

**To configure SuccessFactors Writeback:**

1. Go to <https://portal.azure.com>

2. In the left navigation bar, select **Azure Active Directory**

3. Select **Enterprise Applications**, then **All Applications**.

4. Select **Add an application**, and select the **All** category.

5. Search for **SuccessFactors Writeback**, and add that app from the gallery.

6. After the app is added and the app details screen is shown, select **Provisioning**

7. Change the **Provisioning** **Mode** to **Automatic**

8. Complete the **Admin Credentials** section as follows:

   * **Admin Username** – Enter the username of the SuccessFactors API user account, with the company ID appended. It has the format: **username\@companyID**

   * **Admin password –** Enter the password of the SuccessFactors API user account. 

   * **Tenant URL –** Enter the name of the SuccessFactors OData API services endpoint. Only enter the host name of server without http or https. This value should look like: `api4.successfactors.com`.

   * **Notification Email –** Enter your email address, and check the "send email if failure occurs" checkbox.
    > [!NOTE]
    > The Azure AD Provisioning Service sends email notification if the provisioning job goes into a [quarantine](/azure/active-directory/manage-apps/application-provisioning-quarantine-status) state.

   * Click the **Test Connection** button. If the connection test succeeds, click the **Save** button at  the top. If it fails, double-check that the SuccessFactors credentials and URL are valid.
    >[!div class="mx-imgBorder"]
    >![Azure portal](./media/sap-successfactors-inbound-provisioning/sfwb-provisioning-creds.png)

   * Once the credentials are saved successfully, the **Mappings** section will display the default mapping. Refresh the page, if the attribute mappings are not visible.  

### Part 2: Configure attribute mappings

In this section, you will configure how user data flows from SuccessFactors to Active Directory.

1. On the Provisioning tab under **Mappings**, click **Provision Azure Active Directory Users**.

1. In the **Source Object Scope** field, you can select which sets of  users in Azure AD should be considered for write-back, by defining a set of attribute-based filters. The default scope is "all users in Azure AD". 
   > [!TIP]
   > When you are configuring the provisioning app for the first time, you will need to test and verify your attribute mappings and expressions to make sure that it is giving you the desired result. Microsoft recommends using the scoping filters under **Source Object Scope** to test your mappings with a few test users from Azure AD. Once you have verified that the mappings work, then you can either remove the filter or gradually expand it to include more users.

1. The **Target Object Actions** field only supports the **Update** operation.

1. In the mapping table under **Attribute mappings** section, you can map the following Azure Active Directory attributes to SuccessFactors. The table below provides guidance on how to map the write-back attributes. 

   | \# | Azure AD attribute | SuccessFactors Attribute | Remarks |
   |--|--|--|--|
   | 1 | employeeId | personIdExternal | By default, this attribute is the matching identifier. Instead of employeeId you can use any other Azure AD attribute that may store the value equal to personIdExternal in SuccessFactors.    |
   | 2 | mail | email | Map email attribute source. For testing purposes, you can map userPrincipalName to email. |
   | 3 | 8448 | emailType | This constant value is the SuccessFactors ID value associated with business email. Update this value to match your SuccessFactors environment. See the section [Retrieve constant value for emailType](#retrieve-constant-value-for-emailtype) for steps to set this value. |
   | 4 | true | emailIsPrimary | Use this attribute to set business email as primary in SuccessFactors. If business email is not primary, set this flag to false. |
   | 5 | userPrincipalName | [custom01 – custom15] | Using **Add New Mapping**, you can optionally write userPrincipalName or any Azure AD attribute to a custom attribute available in the SuccessFactors User object.  |
   | 6 | on-prem-samAccountName | username | Using **Add New Mapping**, you can optionally map on-premises samAccountName to SuccessFactors username attribute. |
   | 7 | SSO | loginMethod | If SuccessFactors tenant is setup for [partial SSO](https://apps.support.sap.com/sap/support/knowledge/en/2320766), then using Add New Mapping, you can optionally set loginMethod to a    constant value of "SSO" or "PWD". |
   | 8 | telephoneNumber | businessPhoneNumber | Use this mapping to flow *telephoneNumber* from Azure AD to SuccessFactors business / work phone number. |
   | 9 | 10605 | businessPhoneType | This constant value is the SuccessFactors ID value associated with business phone. Update this value to match your SuccessFactors environment. See the section [Retrieve constant value for phoneType](#retrieve-constant-value-for-phonetype) for steps to set this value. |
   | 10 | true | businessPhoneIsPrimary | Use this attribute to set the primary flag for business phone number. Valid values are true or false. |
   | 11 | mobile | cellPhoneNumber | Use this mapping to flow *telephoneNumber* from Azure AD to SuccessFactors business / work phone number. |
   | 12 | 10606 | cellPhoneType | This constant value is the SuccessFactors ID value associated with cell phone. Update this value to match your SuccessFactors environment. See the section [Retrieve constant value for phoneType](#retrieve-constant-value-for-phonetype) for steps to set this value. |
   | 13 | false | cellPhoneIsPrimary | Use this attribute to set the primary flag for cell phone number. Valid values are true or false. |
 
1. Validate and review your attribute mappings. 
 
    >[!div class="mx-imgBorder"]
    >![Writeback attribute mapping](./media/sap-successfactors-inbound-provisioning/writeback-attribute-mapping.png)

1. Click **Save** to save the mappings. Next, we will update the JSON Path API expressions to use the phoneType codes in your SuccessFactors instance. 
1. Select **Show advanced options**. 

    >[!div class="mx-imgBorder"]
    >![Show advanced options](./media/sap-successfactors-inbound-provisioning/show-advanced-options.png)

1. Click on **Edit attribute list for SuccessFactors**. 

   > [!NOTE] 
   > If the **Edit attribute list for SuccessFactors** option does not show in the Azure portal, use the URL *https://portal.azure.com/?Microsoft_AAD_IAM_forceSchemaEditorEnabled=true* to access the page. 

1. The **API expression** column in this view displays the JSON Path expressions used by the connector. 
1. Update the JSON Path expressions for business phone and cell phone to use the ID value (*businessPhoneType* and *cellPhoneType*) corresponding to your environment. 

    >[!div class="mx-imgBorder"]
    >![Phone JSON Path change](./media/sap-successfactors-inbound-provisioning/phone-json-path-change.png)

1. Click **Save** to save the mappings.

## Enable and launch user provisioning

Once the SuccessFactors provisioning app configurations have been completed, you can turn on the provisioning service in the Azure portal.

> [!TIP]
> By default when you turn on the provisioning service, it will initiate provisioning operations for all users in scope. If there are errors in the mapping or data issues, then the provisioning job might fail and go into the quarantine state. To avoid this, as a best practice, we recommend configuring **Source Object Scope** filter and testing  your attribute mappings with a few test users before launching the full sync for all users. Once you have verified that the mappings work and are giving you the desired results, then you can either remove the filter or gradually expand it to include more users.

1. In the **Provisioning** tab, set the **Provisioning Status** to **On**.

2. Click **Save**.

3. This operation will start the initial sync, which can take a variable number of hours depending on how many users are in the SuccessFactors tenant. You can check the progress bar to the track the progress of the sync cycle. 

4. At any time, check the **Audit logs** tab in the Azure portal to see what actions the provisioning service has performed. The audit logs lists all individual sync events performed by the provisioning service, such as which users are being read from Employee Central and then subsequently added or updated to Active Directory. 

5. Once the initial sync is completed, it will write an audit summary report in the **Provisioning** tab, as shown below.

   > [!div class="mx-imgBorder"]
   > ![Provisioning progress bar](./media/sap-successfactors-inbound-provisioning/prov-progress-bar-stats.png)

## Supported scenarios, known issues and limitations

Refer to the [Writeback scenarios section](../app-provisioning/sap-successfactors-integration-reference.md#writeback-scenarios) of the SAP SuccessFactors integration reference guide. 

## Next steps

* [Deep dive into Azure AD and SAP SuccessFactors integration reference](../app-provisioning/sap-successfactors-integration-reference.md)
* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
* [Learn how to configure single sign-on between SuccessFactors and Azure Active Directory](successfactors-tutorial.md)
* [Learn how to integrate other SaaS applications with Azure Active Directory](tutorial-list.md)
* [Learn how to export and import your provisioning configurations](../app-provisioning/export-import-provisioning-configuration.md)

