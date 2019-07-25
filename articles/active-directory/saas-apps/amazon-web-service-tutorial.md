---
title: 'Tutorial: Azure Active Directory integration with Amazon Web Services (AWS) | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Amazon Web Services (AWS).
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: celested

ms.assetid: 7561c20b-2325-4d97-887f-693aa383c7be
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 06/24/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Integrate Amazon Web Services (AWS) with Azure Active Directory

In this tutorial, you'll learn how to integrate Amazon Web Services (AWS) with Azure Active Directory (Azure AD). When you integrate Amazon Web Services (AWS) with Azure AD, you can:

* Control in Azure AD who has access to Amazon Web Services (AWS).
* Enable your users to be automatically signed-in to Amazon Web Services (AWS) with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

![Amazon Web Services (AWS)](./media/amazon-web-service-tutorial/tutorial_amazonwebservices_image.png)

You can configure multiple Identifiers for multiple instances as below.

* `https://signin.aws.amazon.com/saml#1`

* `https://signin.aws.amazon.com/saml#2`

With these values, Azure AD will remove the value of **#** and send the correct value `https://signin.aws.amazon.com/saml` as the Audience URL in the SAML Token.

**We recommend to use this approach for the following reasons:**

a. Each application will provide you a unique X509 certificate. Each instance of AWS App instance can then have a different certificate expiry date which can be managed on an individual AWS account basis. Overall certificate rollover will be easier in this case.

b. You can enable User Provisioning with AWS app in Azure AD and then our service will fetch all the roles from that AWS account. You don’t have to manually add or update the AWS roles on the app.

c. You can assign the app owner individually for the app who can manage the app directly in Azure AD.

> [!Note]
> Make sure you use only Gallery App

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Amazon Web Services (AWS) single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment. Amazon Web Services (AWS) supports **SP and IDP** initiated SSO.

## Adding Amazon Web Services (AWS) from the gallery

To configure the integration of Amazon Web Services (AWS) into Azure AD, you need to add Amazon Web Services (AWS) from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Amazon Web Services (AWS)** in the search box.
1. Select **Amazon Web Services (AWS)** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on

Configure and test Azure AD SSO with Amazon Web Services (AWS) using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Amazon Web Services (AWS).

To configure and test Azure AD SSO with Amazon Web Services (AWS), complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.
2. **[Configure Amazon Web Services (AWS)](#configure-amazon-web-services-aws)** to configure the SSO settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with B.Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable B.Simon to use Azure AD single sign-on.
5. **[Create Amazon Web Services (AWS) test user](#create-amazon-web-services-aws-test-user)** to have a counterpart of B.Simon in Amazon Web Services (AWS) that is linked to the Azure AD representation of user.
6. **[Test SSO](#test-sso)** to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Amazon Web Services (AWS)** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, the application is pre-configured and the necessary URLs are already pre-populated with Azure. The user needs to save the configuration by clicking the **Save** button.

5. When you are configuring more than one instance, please provide Identifier value. From second instance onwards, please provide Identifier value in following format. Please use a **#** sign to specify a unique SPN value.

	`https://signin.aws.amazon.com/saml#2`

6. Amazon Web Services (AWS) application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open User Attributes dialog.

	![image](common/edit-attribute.png)

7. In addition to above, Amazon Web Services (AWS) application expects few more attributes to be passed back in SAML response. In the **User Claims** section on the **User Attributes** dialog, perform the following steps to add SAML token attribute as shown in the below table:

	| Name  | Source Attribute  | Namespace |
	| --------------- | --------------- | --------------- |
	| RoleSessionName | user.userprincipalname | https://aws.amazon.com/SAML/Attributes |
	| Role 			  | user.assignedroles |  https://aws.amazon.com/SAML/Attributes |
	| SessionDuration 			  | "provide a value between 900 seconds (15 minutes) to 43200 seconds (12 hours)" |  https://aws.amazon.com/SAML/Attributes |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. In the **Namespace** textbox, type the Namespace value shown for that row.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

   ![The Certificate download link](common/metadataxml.png)

1. On the **Set up Amazon Web Services (AWS)** section, copy the appropriate URL(s) based on your requirement.

   ![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure Amazon Web Services (AWS)

1. In a different browser window, sign-on to your Amazon Web Services (AWS) company site as administrator.

2. Click **AWS Home**.

    ![Configure Single Sign-On home][11]

3. Click **Identity and Access Management**.

    ![Configure Single Sign-On Identity][12]

4. Click **Identity Providers**, and then click **Create Provider**.

    ![Configure Single Sign-On Provider][13]

5. On the **Configure Provider** dialog page, perform the following steps:

    ![Configure Single Sign-On dialog][14]

	a. As **Provider Type**, select **SAML**.

	b. In the **Provider Name** textbox, type a provider name (for example: *WAAD*).

	c. To upload your downloaded **metadata file** from Azure portal, click **Choose File**.

	d. Click **Next Step**.

6. On the **Verify Provider Information** dialog page, click **Create**.

    ![Configure Single Sign-On Verify][15]

7. Click **Roles**, and then click **Create role**.

    ![Configure Single Sign-On Roles][16]

8. On the **Create role** page, perform the following steps:  

    ![Configure Single Sign-On Trust][19]

    a. Select **SAML 2.0 federation** under **Select type of trusted entity**.

	b. Under **Choose a SAML 2.0 Provider section**, select the **SAML provider** you have created previously (for example: *WAAD*)

	c. Select **Allow programmatic and AWS Management Console access**.
  
    d. Click **Next: Permissions**.

9. On the **Attach Permissions Policies** dialog, please attach appropriate policy as per your organization. Click **Next: Review**.  

    ![Configure Single Sign-On Policy][33]

10. On the **Review** dialog, perform the following steps:

    ![Configure Single Sign-On Review][34]

	a. In the **Role name** textbox, enter your Role name.

	b. In the **Role description** textbox, enter the description.

    c. Click **Create Role**.

    d. Create as many roles as needed and map them to the Identity Provider.

11. Use AWS service account credentials for fetching the roles from AWS account in Azure AD User Provisioning. For this, open the AWS console home.

12. Click on **Services** -> **Security, Identity& Compliance** -> **IAM**.

	![fetching the roles from AWS account](./media/amazon-web-service-tutorial/fetchingrole1.png)

13. Select the **Policies** tab in the IAM section.

	![fetching the roles from AWS account](./media/amazon-web-service-tutorial/fetchingrole2.png)

14. Create a new policy by clicking on **Create policy** for fetching the roles from AWS account in Azure AD User Provisioning.

	![Creating new policy](./media/amazon-web-service-tutorial/fetchingrole3.png)

15. Create your own policy to fetch all the roles from AWS accounts by performing the following steps:

	![Creating new policy](./media/amazon-web-service-tutorial/policy1.png)

	a. In the **“Create policy”** section click on **“JSON”** tab.

	b. In the policy document, add the below JSON.

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                "iam:ListRoles"
                ],
                "Resource": "*"
            }
        ]
    }
    ```

    c. Click on **Review Policy button** to validate the policy.

	![Define the new policy](./media/amazon-web-service-tutorial/policy5.png)

16. Define the **new policy** by performing the following steps:

	![Define the new policy](./media/amazon-web-service-tutorial/policy2.png)

	a. Provide the **Policy Name** as **AzureAD_SSOUserRole_Policy**.

	b. You can provide **Description** to the policy as **This policy will allow to fetch the roles from AWS accounts**.

	c. Click on **“Create Policy”** button.

17. Create a new user account in the AWS IAM Service by performing the following steps:

	a. Click on **Users** navigation in the AWS IAM console.

	![Define the new policy](./media/amazon-web-service-tutorial/policy3.png)

	b. Click on **Add user** button to create a new user.

	![Add user](./media/amazon-web-service-tutorial/policy4.png)

	c. In the **Add user** section, perform the following steps:

	![Add user](./media/amazon-web-service-tutorial/adduser1.png)

	* Enter the user name as **AzureADRoleManager**.

	* In the Access type, select the **Programmatic access** option. This way the user can invoke the APIs and fetch the roles from AWS account.

	* Click on the **Next Permissions** button in the bottom right corner.

18. Now create a new policy for this user by performing the following steps:

	![Add user](./media/amazon-web-service-tutorial/adduser2.png)

	a. Click on the **Attach existing policies directly** button.

	b. Search for the newly created policy in the filter section **AzureAD_SSOUserRole_Policy**.

	c. Select the **policy** and then click on the **Next: Review** button.

19. Review the policy to the attached user by performing following steps:

	![Add user](./media/amazon-web-service-tutorial/adduser3.png)

	a. Review the user name, access type, and policy mapped to the user.

	b. Click on the **Create user** button at the bottom right corner to create the user.

20. Download the user credentials of a user by performing following steps:

	![Add user](./media/amazon-web-service-tutorial/adduser4.png)

	a. Copy the user **Access key ID** and **Secret access key**.

	b. Enter these credentials into Azure AD user provisioning section to fetch the roles from AWS console.

	c. Click on **Close** button at the bottom.

21. Navigate to **User Provisioning** section of Amazon Web Services app in Azure AD Management Portal.

	![Add user](./media/amazon-web-service-tutorial/provisioning.png)

22. Enter the **Access Key** and **Secret** in the **Client Secret** and **Secret Token** field respectively.

	![Add user](./media/amazon-web-service-tutorial/provisioning1.png)

	a. Enter the AWS user access key in the **clientsecret** field.

	b. Enter the AWS user secret in the **Secret Token** field.

	c. Click on the **Test Connection** button and you should able to successfully test this connection.

	d. Save the setting by clicking on the **Save** button at the top.

23. Now make sure that you enable the Provisioning Status **On** in the Settings section by making the switch on and then clicking on the **Save** button at the top.

	![Add user](./media/amazon-web-service-tutorial/provisioning2.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Amazon Web Services (AWS).

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Amazon Web Services (AWS)**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Create Amazon Web Services (AWS) test user

The objective of this section is to create a user called B.Simon in Amazon Web Services (AWS). Amazon Web Services (AWS) doesn't need a user to be created in their system for SSO, so you don't need to perform any action here.

### Test SSO

When you select the Amazon Web Services (AWS) tile in the Access Panel, you should be automatically signed in to the Amazon Web Services (AWS) for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Known issues

 * In the **Provisioning** section, the **Mappings** sub-section will show a "Loading..." message and never display the attribute mappings. The only provisioning workflow supported today is the import of roles from AWS into Azure AD for selection during user/group assignment. The attribute mappings for this are predetermined and not configurable.
 
 * The **Provisioning** section only supports entering one set of credentials for one AWS tenant at a time. All imported roles are written to the appRoles property of the Azure AD [servicePrincipal object](https://docs.microsoft.com/graph/api/resources/serviceprincipal?view=graph-rest-beta) for the AWS tenant. Multiple AWS tenants (represented by servicePrincipals) can be added to Azure AD from the gallery for provisioning, however there is a known issue with not being able to automatically write all of the imported roles from the multiple AWS servicePrincipals used for provisioning into the single servicePrincipal used for single sign-on. As a workaround, the [Microsoft Graph API](https://docs.microsoft.com/graph/api/resources/serviceprincipal?view=graph-rest-beta) can be used to extract all of the appRoles imported into each AWS servicePrincipal where provisioning is configured. These role strings can be subsequently added to the AWS servicePrincipal where single sign-on is configured.

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

<!--Image references-->

[11]: ./media/amazon-web-service-tutorial/ic795031.png
[12]: ./media/amazon-web-service-tutorial/ic795032.png
[13]: ./media/amazon-web-service-tutorial/ic795033.png
[14]: ./media/amazon-web-service-tutorial/ic795034.png
[15]: ./media/amazon-web-service-tutorial/ic795035.png
[16]: ./media/amazon-web-service-tutorial/ic795022.png
[17]: ./media/amazon-web-service-tutorial/ic795023.png
[18]: ./media/amazon-web-service-tutorial/ic795024.png
[19]: ./media/amazon-web-service-tutorial/ic795025.png
[32]: ./media/amazon-web-service-tutorial/ic7950251.png
[33]: ./media/amazon-web-service-tutorial/ic7950252.png
[35]: ./media/amazon-web-service-tutorial/tutorial_amazonwebservices_provisioning.png
[34]: ./media/amazon-web-service-tutorial/ic7950253.png
[36]: ./media/amazon-web-service-tutorial/tutorial_amazonwebservices_securitycredentials.png
[37]: ./media/amazon-web-service-tutorial/tutorial_amazonwebservices_securitycredentials_continue.png
[38]: ./media/amazon-web-service-tutorial/tutorial_amazonwebservices_createnewaccesskey.png
[39]: ./media/amazon-web-service-tutorial/tutorial_amazonwebservices_provisioning_automatic.png
[40]: ./media/amazon-web-service-tutorial/tutorial_amazonwebservices_provisioning_testconnection.png
[41]: ./media/amazon-web-service-tutorial/tutorial_amazonwebservices_provisioning_on.png
