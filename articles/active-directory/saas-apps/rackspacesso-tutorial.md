---
title: 'Tutorial: Azure AD SSO integration with Rackspace SSO'
description: Learn how to configure single sign-on between Azure Active Directory and Rackspace SSO.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---
# Tutorial: Azure AD SSO integration with Rackspace SSO

In this tutorial, you'll learn how to integrate Rackspace SSO with Azure Active Directory (Azure AD). When you integrate Rackspace SSO with Azure AD, you can:

* Control in Azure AD who has access to Rackspace SSO.
* Enable your users to be automatically signed-in to Rackspace SSO with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with Rackspace SSO, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* Rackspace SSO single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Rackspace SSO supports **IDP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Rackspace SSO from the gallery

To configure the integration of Rackspace SSO into Azure AD, you need to add Rackspace SSO from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Rackspace SSO** in the search box.
1. Select **Rackspace SSO** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Rackspace SSO

In this section, you configure and test Azure AD single sign-on with Rackspace SSO based on a test user called **Britta Simon**.
When using single sign-on with Rackspace, the Rackspace users will be automatically created the first time they sign in to the Rackspace portal. 

To configure and test Azure AD single sign-on with Rackspace SSO, you need to perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
2. **[Configure Rackspace SSO](#configure-rackspace-sso)** - to configure the Single Sign-On settings on application side.
    1. **[Set up Attribute Mapping in the Rackspace Control Panel](#set-up-attribute-mapping-in-the-rackspace-control-panel)** - to assign Rackspace roles to Azure AD users.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Rackspace SSO** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows to edit Basic S A M L Configuration.](common/edit-urls.png "Basic Configuration")

4. On the **Basic SAML Configuration** section, upload the **Service Provider metadata file** which you can download from the [URL](https://login.rackspace.com/federate/sp.xml) and perform the following steps:

	a. Click **Upload metadata file**.

    ![Screenshot shows Basic S A M L Configuration with the Upload metadata file link.](common/upload-metadata.png "Metadata")

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![Screenshot shows a dialog box where you can select and upload a file.](common/browse-upload-metadata.png "Folder")

	c. Once the metadata file is successfully uploaded, the necessary URLs get auto populated automatically.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

This file will be uploaded to Rackspace to populate required Identity Federation configuration settings.

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Rackspace SSO.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Rackspace SSO**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Rackspace SSO

To configure single sign-on on **Rackspace SSO** side:

1. See the documentation at [Add an Identity Provider to the Control Panel](https://developer.rackspace.com/docs/rackspace-federation/gettingstarted/add-idp-cp/)
1. It will lead you through the steps to:
    1. Create a new Identity Provider.
    1. Specify an email domain that users will use to identify your company when signing in.
    1. Upload the **Federation Metadata XML** previously downloaded from the Azure control panel.

This will correctly configure the basic SSO settings needed for Azure and Rackspace to connect.

### Set up Attribute Mapping in the Rackspace control panel

Rackspace uses an **Attribute Mapping Policy** to assign Rackspace roles and groups to your single sign-on users. The **Attribute Mapping Policy** translates Azure AD SAML claims into the user configuration fields Rackspace requires. More documentation can be found in the Rackspace [Attribute Mapping Basics documentation](https://developer.rackspace.com/docs/rackspace-federation/appendix/map/). Some considerations:

* If you want to assign varying levels of Rackspace access using Azure AD groups, you will need to enable the Groups claim in the Azure **Rackspace SSO** Single Sign-on settings. The **Attribute Mapping Policy** will then be used to match those groups to desired Rackspace roles and groups:

    ![Screenshot shows the Groups claim settings.](common/sso-groups-claim.png "Groups")

* By default, Azure AD sends the UID of Azure AD Groups in the SAML claim, versus the name of the Group. However, if you are synchronizing your on-premises Active Directory to Azure AD, you have the option to send the actual names of the groups:

    ![Screenshot shows the Groups claim name settings.](common/sso-groups-claims-names.png "Claims")

The following example **Attribute Mapping Policy** demonstrates:
1. Setting the Rackspace user's name to the `user.name` SAML claim. Any claim can be used, but it is most common to set this to a field containing the user's email address.
1. Setting the Rackspace roles `admin` and `billing:admin` on a user by matching an Azure AD Group, by either Group Name or Group UID. A *substitution* of `"{0}"` in the `roles` field is used, and will be replaced by the results of the `remote` rule expressions.
1. Using the `"{D}"` *default substitution* to let Rackspace retrieve additional SAML fields by looking for standard and well-known SAML claims in the SAML exchange.

```yaml
---
mapping:
    rules:
    - local:
        user:
          domain: "{D}"
          name: "{At(http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name)}"
          email: "{D}"
          roles:
              - "{0}"
          expire: "{D}"
      remote:
          - path: |
              (
                if (mapping:get-attributes('http://schemas.microsoft.com/ws/2008/06/identity/claims/groups')='7269f9a2-aabb-9393-8e6d-282e0f945985') then ('admin', 'billing:admin') else (),
                if (mapping:get-attributes('http://schemas.microsoft.com/ws/2008/06/identity/claims/groups')='MyAzureGroup') then ('admin', 'billing:admin') else ()
              )
            multiValue: true
  version: RAX-1
```
> [!TIP]
> Ensure that you use a text editor that validates YAML syntax when editing your policy file.

See the Rackspace [Attribute Mapping Basics documentation](https://developer.rackspace.com/docs/rackspace-federation/appendix/map/) for more examples.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the Rackspace SSO for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Rackspace SSO tile in the My Apps, you should be automatically signed in to the Rackspace SSO for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

You can also use the **Validate** button in the **Rackspace SSO** Single sign-on settings:

   ![Screenshot shows the SSO Validate Button.](common/sso-validate-sign-on.png "Validate")

## Next steps

Once you configure Rackspace SSO you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).