---
title: 'Tutorial: Azure Active Directory integration with Amazon Web Services (AWS) | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Amazon Web Services (AWS).
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 7561c20b-2325-4d97-887f-693aa383c7be
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/16/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Amazon Web Services (AWS)

In this tutorial, you learn how to integrate Amazon Web Services (AWS) with Azure Active Directory (Azure AD).

Integrating Amazon Web Services (AWS) with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Amazon Web Services (AWS).
- You can enable your users to automatically get signed-on to Amazon Web Services (AWS) (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

![Amazon Web Services (AWS)](./media/amazon-web-service-tutorial/tutorial_amazonwebservices_image.png)

You can configure multiple Identifiers for multiple instances as below. 

* `https://signin.aws.amazon.com/saml#1`

* `https://signin.aws.amazon.com/saml#2`

With these values, Azure AD will remove the value of **#** and send the correct value `https://signin.aws.amazon.com/saml` as the Audience URL in the SAML Token.

**We recommend to use this approach for the following reasons:**

a. Each application will provide you the unique X509 certificate and so each instance can have a different certificate expiry date and you can manage this on the individual AWS account basis. Overall certificate rollover will be easy in this case.

b. You can enable User Provisioning with AWS app in Azure AD and then our service will fetch all the roles from that AWS account. You don’t have to manually add or update the AWS roles on the app.

c. You can assign the app owner individually for the app who can manage the app directly in Azure AD.

> [!Note]
> Make sure you use only Gallery App

## Prerequisites

To configure Azure AD integration with Amazon Web Services (AWS), you need the following items:

- An Azure AD subscription
- An Amazon Web Services (AWS) single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

> [!Note]
> If you want to integrate multiple AWS accounts to one Azure account for Single Sign on, please refer [this](https://docs.microsoft.com/azure/active-directory/active-directory-saas-aws-multi-accounts-tutorial) article.

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Amazon Web Services (AWS) from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Amazon Web Services (AWS) from the gallery
To configure the integration of Amazon Web Services (AWS) into Azure AD, you need to add Amazon Web Services (AWS) from the gallery to your list of managed SaaS apps.

**To add Amazon Web Services (AWS) from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![image](./media/amazon-web-service-tutorial/selectazuread.png)

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![image](./media/amazon-web-service-tutorial/a_select_app.png)
	
3. To add new application, click **New application** button on the top of dialog.

	![image](./media/amazon-web-service-tutorial/a_new_app.png)

4. In the search box, type **Amazon Web Services (AWS)**, select **Amazon Web Services (AWS)** from result panel then click **Add** button to add the application.

	 ![image](./media/amazon-web-service-tutorial/tutorial_amazonwebservices(aws)_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Amazon Web Services (AWS) based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Amazon Web Services (AWS) is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Amazon Web Services (AWS) needs to be established.

To configure and test Azure AD single sign-on with Amazon Web Services (AWS), you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create an Amazon Web Services (AWS) test user](#create-an-amazon-web-services-aws-test-user)** - to have a counterpart of Britta Simon in Amazon Web Services (AWS) that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Amazon Web Services (AWS) application.

**To configure Azure AD single sign-on with Amazon Web Services (AWS), perform the following steps:**

1. In the [Azure portal](https://portal.azure.com/), on the **Amazon Web Services (AWS)** application integration page, select **Single sign-on**.

    ![image](./media/amazon-web-service-tutorial/B1_B2_Select_SSO.png)

2. On the **Select a Single sign-on method** dialog, select **SAML** mode to enable single sign-on.

    ![image](./media/amazon-web-service-tutorial/b1_b2_saml_sso.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **Basic SAML Configuration** dialog.

	![image](./media/amazon-web-service-tutorial/b1-domains_and_urlsedit.png)

4. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

    ![image](./media/amazon-web-service-tutorial/tutorial_amazonwebservices(aws)_url.png)

5. When you are configuring more than one instance, please provide Identifier value. From second instance onwards, please provide Identifier value in following format. Please use a **#** sign to specify a unique SPN value. 

	`https://signin.aws.amazon.com/saml#2`

	![Amazon Web Services (AWS) Domain and URLs single sign-on information](./media/amazon-web-service-tutorial/tutorial_amazonwebservices(aws)_identifier.png)

6. Amazon Web Services (AWS) application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes & Claims** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes & Claims** dialog.

	![image](./media/amazon-web-service-tutorial/i4-attribute.png)

7. In the **User Claims** section on the **User Attributes & Claims** dialog, configure SAML token attribute as shown in the image above and perform the following steps:
    
	| Name  | Source Attribute  | Namespace |
	| --------------- | --------------- | --------------- |
	| RoleSessionName | user.userprincipalname | https://aws.amazon.com/SAML/Attributes |
	| Role 			  | user.assignedroles |  https://aws.amazon.com/SAML/Attributes |
	| SessionDuration 			  | "provide a value between 900 seconds (15 minutes) to 43200 seconds (12 hours)" |  https://aws.amazon.com/SAML/Attributes |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](./media/amazon-web-service-tutorial/i2-attribute.png)

	![image](./media/amazon-web-service-tutorial/i3-attribute.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Enter the **Namespace** value.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Save**.

8. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** and save it on your computer.

	![image](./media/amazon-web-service-tutorial/tutorial_amazonwebservices(aws)_certificate.png) 

9. In a different browser window, sign-on to your Amazon Web Services (AWS) company site as administrator.

10. Click **AWS Home**.

    ![Configure Single Sign-On home][11]

11. Click **Identity and Access Management**.

    ![Configure Single Sign-On Identity][12]

12. Click **Identity Providers**, and then click **Create Provider**.

    ![Configure Single Sign-On Provider][13]

13. On the **Configure Provider** dialog page, perform the following steps:

    ![Configure Single Sign-On dialog][14]

	a. As **Provider Type**, select **SAML**.

	b. In the **Provider Name** textbox, type a provider name (for example: *WAAD*).

	c. To upload your downloaded **metadata file** from Azure portal, click **Choose File**.

	d. Click **Next Step**.

14. On the **Verify Provider Information** dialog page, click **Create**.

    ![Configure Single Sign-On Verify][15]

15. Click **Roles**, and then click **Create role**.

    ![Configure Single Sign-On Roles][16]

16. On the **Create role** page, perform the following steps:  

    ![Configure Single Sign-On Trust][19]

    a. Select **SAML 2.0 federation** under **Select type of trusted entity**.

	b. Under **Choose a SAML 2.0 Provider section**, select the **SAML provider** you have created previously (for example: *WAAD*)

	c. Select **Allow programmatic and AWS Management Console access**.
  
    d. Click **Next: Permissions**.

17. On the **Attach Permissions Policies** dialog, you don't need to attach any policy. Click **Next: Review**.  

    ![Configure Single Sign-On Policy][33]

18. On the **Review** dialog, perform the following steps:

    ![Configure Single Sign-On Review][34]

	a. In the **Role name** textbox, enter your Role name.

	b. In the **Role description** textbox, enter the description.

    c. Click **Create Role**.

    d. Create as many roles as needed and map them to the Identity Provider.

19. Use AWS service account credentials for fetching the roles from AWS account in Azure AD User Provisioning. For this, open the AWS console home.

20. Click on **Services** -> **Security, Identity& Compliance** -> **IAM**.

	![fetching the roles from AWS account](./media/amazon-web-service-tutorial/fetchingrole1.png)

21. Select the **Policies** tab in the IAM section.

	![fetching the roles from AWS account](./media/amazon-web-service-tutorial/fetchingrole2.png)

22. Create a new policy by clicking on **Create policy** for fetching the roles from AWS account in Azure AD User Provisioning.

	![Creating new policy](./media/amazon-web-service-tutorial/fetchingrole3.png)

23. Create your own policy to fetch all the roles from AWS accounts by performing the following steps:

	![Creating new policy](./media/amazon-web-service-tutorial/policy1.png)

	a. In the **“Create policy”** section click on **“JSON”** tab.

	b. In the policy document, add the below JSON.

	```

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

24. Define the **new policy** by performing the following steps:

	![Define the new policy](./media/amazon-web-service-tutorial/policy2.png)

	a. Provide the **Policy Name** as **AzureAD_SSOUserRole_Policy**.

	b. You can provide **Description** to the policy as **This policy will allow to fetch the roles from AWS accounts**.

	c. Click on **“Create Policy”** button.

25. Create a new user account in the AWS IAM Service by performing the following steps:

	a. Click on **Users** navigation in the AWS IAM console.

	![Define the new policy](./media/amazon-web-service-tutorial/policy3.png)

	b. Click on **Add user** button to create a new user.

	![Add user](./media/amazon-web-service-tutorial/policy4.png)

	c. In the **Add user** section, perform the following steps:

	![Add user](./media/amazon-web-service-tutorial/adduser1.png)

	* Enter the user name as **AzureADRoleManager**.

	* In the Access type, select the **Programmatic access** option. This way the user can invoke the APIs and fetch the roles from AWS account.

	* Click on the **Next Permissions** button in the bottom right corner.

26. Now create a new policy for this user by performing the following steps:

	![Add user](./media/amazon-web-service-tutorial/adduser2.png)

	a. Click on the **Attach existing policies directly** button.

	b. Search for the newly created policy in the filter section **AzureAD_SSOUserRole_Policy**.

	c. Select the **policy** and then click on the **Next: Review** button.

27. Review the policy to the attached user by performing following steps:

	![Add user](./media/amazon-web-service-tutorial/adduser3.png)

	a. Review the user name, access type, and policy mapped to the user.

	b. Click on the **Create user** button at the bottom right corner to create the user.

28. Download the user credentials of a user by performing following steps:

	![Add user](./media/amazon-web-service-tutorial/adduser4.png)

	a. Copy the user **Access key ID** and **Secret access key**.

	b. Enter these credentials into Azure AD user provisioning section to fetch the roles from AWS console.

	c. Click on **Close** button at the bottom.

29. Navigate to **User Provisioning** section of Amazon Web Services app in Azure AD Management Portal.

	![Add user](./media/amazon-web-service-tutorial/provisioning.png)

30. Enter the **Access Key** and **Secret** in the **Client Secret** and **Secret Token** field respectively.

	![Add user](./media/amazon-web-service-tutorial/provisioning1.png)

	a. Enter the AWS user access key in the **clientsecret** field.

	b. Enter the AWS user secret in the **Secret Token** field.

	c. Click on the **Test Connection** button and you should able to successfully test this connection.

	d. Save the setting by clicking on the **Save** button at the top.

31. Now make sure that you enable the Provisioning Status **On** in the Settings section by making the switch on and then clicking on the **Save** button at the top.

	![Add user](./media/amazon-web-service-tutorial/provisioning2.png)

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![image](./media/amazon-web-service-tutorial/d_users_and_groups.png)

2. Select **New user** at the top of the screen.

    ![image](./media/amazon-web-service-tutorial/d_adduser.png)

3. In the User properties, perform the following steps.

    ![image](./media/amazon-web-service-tutorial/d_userproperties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Properties**, select the **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Select **Create**.
 
### Create an Amazon Web Services (AWS) test user

The objective of this section is to create a user called Britta Simon in Amazon Web Services (AWS). Amazon Web Services (AWS) doesn't need a user to be created in their system for SSO, so you don't need to perform any action here.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Amazon Web Services (AWS).

1. In the Azure portal, select **Enterprise Applications**, select **All applications**.

	![image](./media/amazon-web-service-tutorial/d_all_applications.png)

2. In the applications list, select **Amazon Web Services (AWS)**.

	![image](./media/amazon-web-service-tutorial/tutorial_amazonwebservices(aws)_app.png)

3. In the menu on the left, select **Users and groups**.

    ![image](./media/amazon-web-service-tutorial/d_leftpaneusers.png)

4. Select the **Add** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![image](./media/amazon-web-service-tutorial/d_assign_user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

	![image](./media/amazon-web-service-tutorial/tutorial_amazonwebservices_users.png)

6. In the **Select Role** dialog choose the appropriate user role in the list, then click the **Select** button at the bottom of the screen.

	![image](./media/amazon-web-service-tutorial/tutorial_amazonwebservices_roles.png)

	>[!NOTE]
	>After enabling the user provisioning with the application, you should have to wait for 30 minutes to get all the roles from Amazon Web Services (AWS) then you need to refresh the page and then while assigning the application to users and groups you see the roles for the user.

7. In the **Add Assignment** dialog select the **Assign** button.

	![image](./media/amazon-web-service-tutorial/tutorial_amazonwebservices_assign.png)
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Amazon Web Services (AWS) tile in the Access Panel, you should get automatically signed-on to your Amazon Web Services (AWS) application.
For more information about the Access Panel, see [Introduction to the Access Panel](../active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

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
