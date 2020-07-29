---
title: 'Tutorial: Azure Active Directory integration with Amazon Web Services (AWS) to connect multiple accounts | Microsoft Docs'
description: Learn how to configure single sign-on between Azure AD and Amazon Web Services (AWS) (Legacy Tutorial).
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 7561c20b-2325-4d97-887f-693aa383c7be
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 04/16/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Amazon Web Services (AWS) (Legacy Tutorial)

In this tutorial, you learn how to integrate Azure Active Directory (Azure AD) with Amazon Web Services (AWS) (Legacy Tutorial).

Integrating Amazon Web Services (AWS) with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Amazon Web Services (AWS).
- You can enable your users to automatically get signed-on to Amazon Web Services (AWS) (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

![Amazon Web Services (AWS) in the results list](./media/aws-multi-accounts-tutorial/amazonwebservice.png)

> [!NOTE]
> Please note connecting one AWS app to all your AWS accounts is not our recommended approach. Instead we recommend you to use [this](https://docs.microsoft.com/azure/active-directory/saas-apps/amazon-web-service-tutorial) approach to configure multiple instances of AWS account to Multiple instances of AWS apps in Azure AD. You should only use this approach if you have few AWS Accounts and Roles in it, this model is not scalable as the AWS accounts and roles inside these accounts grow. This approach does not use AWS Role import functionality using Azure AD User Provisioning, so you have to manually add/update/delete the roles. For other limitations on this approach please see the details below.

**Please note that we do not recommend to use this approach for following reasons:**

* You have to use the Microsoft Graph Explorer approach to patch all the roles to the app. We don’t recommend using the manifest file approach.

* We have seen customers reporting that after adding ~1200 app roles for a single AWS app, any operation on the app started throwing the errors related to size. There is a hard limit of size on the application object.

* You have to manually update the role as the roles get added in any of the accounts, which is a Replace approach and not Append unfortunately. Also if your accounts are growing then this becomes n x n relationship with accounts and roles.

* All the AWS accounts will be using the same Federation Metadata XML file and at the time of certificate rollover you have to drive this massive exercise to update the Certificate on all the AWS accounts at the same time

## Prerequisites

To configure Azure AD integration with Amazon Web Services (AWS), you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Amazon Web Services (AWS) single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Amazon Web Services (AWS) supports **SP and IDP** initiated SSO
* Once you configure Amazon Web Services (AWS) you can enforce Session Control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session Control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-aad)

## Adding Amazon Web Services (AWS) from the gallery

To configure the integration of Amazon Web Services (AWS) into Azure AD, you need to add Amazon Web Services (AWS) from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Amazon Web Services (AWS)** in the search box.
1. Select **Amazon Web Services (AWS)** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

1. Once the application is added, go to **Properties** page and copy the **Object ID**.

	![Amazon Web Services (AWS) in the results list](./media/aws-multi-accounts-tutorial/tutorial-amazonwebservices-properties.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Amazon Web Services (AWS) based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Amazon Web Services (AWS) is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Amazon Web Services (AWS) needs to be established.

In Amazon Web Services (AWS), assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Amazon Web Services (AWS), you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Amazon Web Services (AWS) Single Sign-On](#configure-amazon-web-services-aws-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Amazon Web Services (AWS) application.

**To configure Azure AD single sign-on with Amazon Web Services (AWS), perform the following steps:**

1. In the [Azure portal](https://portal.azure.com/), on the **Amazon Web Services (AWS)** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure and click **Save**.

5. Amazon Web Services (AWS) application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes & Claims** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes & Claims** dialog.

	![image](common/edit-attribute.png)

6. In the **User Claims** section on the **User Attributes** dialog, configure SAML token attribute as shown in the image above and perform the following steps:

	| Name  | Source Attribute  | Namespace |
	| --------------- | --------------- | --------------- |
	| RoleSessionName | user.userprincipalname | `https://aws.amazon.com/SAML/Attributes` |
	| Role 			  | user.assignedroles |  `https://aws.amazon.com/SAML/Attributes`|
	| SessionDuration 			  | "provide a value between 900 seconds (15 minutes) to 43200 seconds (12 hours)" |  `https://aws.amazon.com/SAML/Attributes` |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. In the **Namespace** textbox, type the Namespace value shown for that row.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

7. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

### Configure Amazon Web Services (AWS) Single Sign-On

1. In a different browser window, sign-on to your Amazon Web Services (AWS) company site as administrator.

1. Click **AWS Home**.

    ![Configure Single Sign-On home][11]

1. Click **Identity and Access Management**.

    ![Configure Single Sign-On Identity][12]

1. Click **Identity Providers**, and then click **Create Provider**.

    ![Configure Single Sign-On Provider][13]

1. On the **Configure Provider** dialog page, perform the following steps:

    ![Configure Single Sign-On dialog][14]

	a. As **Provider Type**, select **SAML**.

	b. In the **Provider Name** textbox, type a provider name (for example: *WAAD*).

	c. To upload your downloaded **metadata file** from Azure portal, click **Choose File**.

	d. Click **Next Step**.

1. On the **Verify Provider Information** dialog page, click **Create**.

    ![Configure Single Sign-On Verify][15]

1. Click **Roles**, and then click **Create role**.

    ![Configure Single Sign-On Roles][16]

1. On the **Create role** page, perform the following steps:  

    ![Configure Single Sign-On Trust][19]

    a. Select **SAML 2.0 federation** under **Select type of trusted entity**.

	b. Under **Choose a SAML 2.0 Provider section**, select the **SAML provider** you have created previously (for example: *WAAD*)

	c. Select **Allow programmatic and AWS Management Console access**.
  
    d. Click **Next: Permissions**.

1. Search **Administrator Access** in the search bar and select the **AdministratorAccess** checkbox and then click **Next: Tags**.

	![Select Administrator Access](./media/aws-multi-accounts-tutorial/administrator-access.png)

1. On the **Add tags (optional)** section, perform the following steps:

	![Select Administrator Access](./media/aws-multi-accounts-tutorial/config2.png)

	a. In the **Key** textbox, enter the key name for ex: Azureadtest.

	b. In the **Value (optional)** textbox, enter the key value using the following format `accountname-aws-admin`. The account name should be in all lowercase.

	c. Click **next: Review**.

1. On the **Review** dialog, perform the following steps:

    ![Configure Single Sign-On Review][34]

	a. In the **Role name** textbox, enter the value in the following pattern `accountname-aws-admin`.

	b. In the **Role description** textbox, enter the same value which you have used for the role name.

    c. Click **Create Role**.

    d. Create as many roles as needed and map them to the Identity Provider.

	> [!NOTE]
	> Similarly create remaining other roles like accountname-finance-admin, accountname-read-only-user, accountname-devops-user, accountname-tpm-user with different policies to be attached. Later also these role policies can be changed as per requirements per AWS account but its always better to keep same policies for each role across the AWS accounts.

1. Please make a note of account ID for that AWS account either from EC2 properties or IAM dashboard as highlighted below:

	![Select Administrator Access](./media/aws-multi-accounts-tutorial/aws-accountid.png)

1. Now sign into [Azure portal](https://portal.azure.com/) and navigate to **Groups**.

1. Create new groups with the same name as that of IAM Roles created earlier and note down the **Object IDs** of these new groups.

	![Select Administrator Access](./media/aws-multi-accounts-tutorial/copy-objectids.png)

1. Sign out from current AWS account and login with other account where you want to configure single sign on with Azure AD.

1. Once all the roles are created in the accounts, they show up in the **Roles** list for those accounts.

	![Roles setup](./media/aws-multi-accounts-tutorial/tutorial-amazonwebservices-listofroles.png)

1. We need to capture all the Role ARN and Trusted Entities for all the roles across all the accounts, which we need to map manually with Azure AD application.

1. Click on the roles to copy **Role ARN** and **Trusted Entities** values. You need these values for all the roles that you need to create in Azure AD.

	![Roles setup](./media/aws-multi-accounts-tutorial/tutorial-amazonwebservices-role-summary.png)

1. Perform the above step for all the roles in all the accounts and store all of them in format **Role ARN,Trusted entities** in a notepad.

1. Open [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) in another window.

	a. Sign in to the Microsoft Graph Explorer site using the Global Admin/Co-admin credentials for your tenant.

	b. You need to have sufficient permissions to create the roles. Click on **modify permissions** to get the required permissions.

	![Microsoft Graph Explorer dialog box](./media/aws-multi-accounts-tutorial/graph-explorer-new9.png)

	c. Select following permissions from the list (if you don't have these already) and click "Modify Permissions" 

	![Microsoft Graph Explorer dialog box](./media/aws-multi-accounts-tutorial/graph-explorer-new10.png)

	d. This will ask you to login again and accept the consent. After accepting the consent, you are logged into the Microsoft Graph Explorer again.

	e. Change the version dropdown to **beta**. To fetch all the Service Principals from your tenant, use the following query:

	`https://graph.microsoft.com/beta/servicePrincipals`

	If you are using multiple directories, then you can use following pattern, which has your primary domain in it
	`https://graph.microsoft.com/beta/contoso.com/servicePrincipals`

	![Microsoft Graph Explorer dialog box](./media/aws-multi-accounts-tutorial/graph-explorer-new1.png)

	f. From the list of Service Principals fetched, get the one you need to modify. You can also use the Ctrl+F to search the application from all the listed ServicePrincipals. You can use following query by using the **Object ID** which you have copied from Azure AD Properties page to get to the respective Service Principal.

	`https://graph.microsoft.com/beta/servicePrincipals/<objectID>`.

	![Microsoft Graph Explorer dialog box](./media/aws-multi-accounts-tutorial/graph-explorer-new2.png)

	g. Extract the appRoles property from the service principal object.

	![Microsoft Graph Explorer dialog box](./media/aws-multi-accounts-tutorial/graph-explorer-new3.png)

	h. You now need to generate new roles for your application. 

	i. Below JSON is an example of appRoles object. Create a similar object to add the roles you want for your application.

	```
	{
	"appRoles": [
        {
            "allowedMemberTypes": [
                "User"
            ],
            "description": "msiam_access",
            "displayName": "msiam_access",
            "id": "7dfd756e-8c27-4472-b2b7-38c17fc5de5e",
            "isEnabled": true,
            "origin": "Application",
            "value": null
        },
        {
            "allowedMemberTypes": [
                "User"
            ],
            "description": "Admin,WAAD",
            "displayName": "Admin,WAAD",
            "id": "4aacf5a4-f38b-4861-b909-bae023e88dde",
            "isEnabled": true,
            "origin": "ServicePrincipal",
            "value": "arn:aws:iam::12345:role/Admin,arn:aws:iam::12345:saml-provider/WAAD"
        },
        {
            "allowedMemberTypes": [
                "User"
            ],
            "description": "Auditors,WAAD",
            "displayName": "Auditors,WAAD",
            "id": "bcad6926-67ec-445a-80f8-578032504c09",
            "isEnabled": true,
            "origin": "ServicePrincipal",
            "value": "arn:aws:iam::12345:role/Auditors,arn:aws:iam::12345:saml-provider/WAAD"
        }    ]
	}
	```

	> [!Note]
	> You can only add new roles after the **msiam_access** for the patch operation. Also, you can add as many roles as you want per your Organization need. Azure AD will send the **value** of these roles as the claim value in SAML response.

	j. Go back to your Microsoft Graph Explorer and change the method from **GET** to **PATCH**. Patch the Service Principal object to have desired roles by updating appRoles property similar to the one shown above in the example. Click **Run Query** to execute the patch operation. A success message confirms the creation of the role for your Amazon Web Services application.

	![Microsoft Graph Explorer dialog box](./media/aws-multi-accounts-tutorial/graph-explorer-new11.png)

1. After the Service Principal is patched with more roles, you can assign Users/Groups to the respective roles. This can be done by going to portal and navigating to the Amazon Web Services application. Click on the **Users and Groups** tab on the top.

1. We recommend you to create new groups for every AWS role so that you can assign that particular role in that group. Note that this is one to one mapping for one group to one role. You can then add the members who belong to that group.

1. Once the Groups are created, select the group and assign to the application.

	![Configure Single Sign-On Add](./media/aws-multi-accounts-tutorial/graph-explorer-new5.png)

	> [!Note]
	> Nested groups are not supported when assigning groups.

1. To assign the role to the group, select the role and click on **Assign** button in the bottom of the page.

	![Configure Single Sign-On Add](./media/aws-multi-accounts-tutorial/graph-explorer-new6.png)

	> [!Note]
	> Please note that you need to refresh your session in Azure portal to see new roles.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Amazon Web Services (AWS) tile in the Access Panel, you should get Amazon Web Services (AWS) application page with option to select the role.

![Configure Single Sign-On Add](./media/aws-multi-accounts-tutorial/tutorial-amazonwebservices-test-screen.png)

You can also verify the SAML response to see the roles being passed as claims.

![Configure Single Sign-On Add](./media/aws-multi-accounts-tutorial/tutorial-amazonwebservices-test-saml.png)

For more information about the Access Panel, see [Introduction to the Access Panel](../active-directory-saas-access-panel-introduction.md).

## Additional resources

* [How to configure provisioning using MS Graph APIs](https://docs.microsoft.com/azure/active-directory/manage-apps/application-provisioning-configure-api)
* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)
* [How to protect Amazon Web Services (AWS) with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/protect-aws)

<!--Image references-->

[11]: ./media/aws-multi-accounts-tutorial/ic795031.png
[12]: ./media/aws-multi-accounts-tutorial/ic795032.png
[13]: ./media/aws-multi-accounts-tutorial/ic795033.png
[14]: ./media/aws-multi-accounts-tutorial/ic795034.png
[15]: ./media/aws-multi-accounts-tutorial/ic795035.png
[16]: ./media/aws-multi-accounts-tutorial/ic795022.png
[17]: ./media/aws-multi-accounts-tutorial/ic795023.png
[18]: ./media/aws-multi-accounts-tutorial/ic795024.png
[19]: ./media/aws-multi-accounts-tutorial/ic795025.png
[32]: ./media/aws-multi-accounts-tutorial/ic7950251.png
[33]: ./media/aws-multi-accounts-tutorial/ic7950252.png
[35]: ./media/aws-multi-accounts-tutorial/tutorial-amazonwebservices-provisioning.png
[34]: ./media/aws-multi-accounts-tutorial/config3.png
[36]: ./media/aws-multi-accounts-tutorial/tutorial-amazonwebservices-securitycredentials.png
[37]: ./media/aws-multi-accounts-tutorial/tutorial-amazonwebservices-securitycredentials-continue.png
[38]: ./media/aws-multi-accounts-tutorial/tutorial-amazonwebservices-createnewaccesskey.png
[39]: ./media/aws-multi-accounts-tutorial/tutorial-amazonwebservices-provisioning-automatic.png
[40]: ./media/aws-multi-accounts-tutorial/tutorial-amazonwebservices-provisioning-testconnection.png
[41]: ./media/aws-multi-accounts-tutorial/