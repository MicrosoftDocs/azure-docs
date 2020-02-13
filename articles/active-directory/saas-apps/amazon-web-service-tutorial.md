---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Amazon Web Services (AWS) | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Amazon Web Services (AWS).
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 7561c20b-2325-4d97-887f-693aa383c7be
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 01/16/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Amazon Web Services (AWS)

In this tutorial, you'll learn how to integrate Amazon Web Services (AWS) with Azure Active Directory (Azure AD). When you integrate Amazon Web Services (AWS) with Azure AD, you can:

* Control in Azure AD who has access to Amazon Web Services (AWS).
* Enable your users to be automatically signed-in to Amazon Web Services (AWS) with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

![Diagram of Azure AD and AWS relationship](./media/amazon-web-service-tutorial/tutorial_amazonwebservices_image.png)

You can configure multiple identifiers for multiple instances. For example:

* `https://signin.aws.amazon.com/saml#1`

* `https://signin.aws.amazon.com/saml#2`

With these values, Azure AD removes the value of **#**, and sends the correct value `https://signin.aws.amazon.com/saml` as the audience URL in the SAML token.

We recommend this approach for the following reasons:

- Each application provides you with a unique X509 certificate. Each instance of an AWS app instance can then have a different certificate expiry date, which can be managed on an individual AWS account basis. Overall certificate rollover is easier in this case.

- You can enable user provisioning with an AWS app in Azure AD, and then our service fetches all the roles from that AWS account. You don’t have to manually add or update the AWS roles on the app.

- You can assign the app owner individually for the app. This person can manage the app directly in Azure AD.

> [!Note]
> Make sure you use a gallery application only.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* An AWS single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Amazon Web Services (AWS) supports **SP and IDP** initiated SSO
* Once you configure the Amazon Web Services (AWS) you can enforce session controls, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session controls extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-aad)

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding Amazon Web Services (AWS) from the gallery

To configure the integration of Amazon Web Services (AWS) into Azure AD, you need to add Amazon Web Services (AWS) from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using a work account, school account, or personal Microsoft account.
1. In the Azure portal, search for and select **Azure Active Directory**.
1. Within the Azure Active Directory overview menu, choose **Enterprise Applications** > **All applications**.
1. Select **New application** to add an application.
1. In the **Add from the gallery** section, type **Amazon Web Services (AWS)** in the search box.
1. Select **Amazon Web Services (AWS)** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Amazon Web Services (AWS)

Configure and test Azure AD SSO with Amazon Web Services (AWS) using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Amazon Web Services (AWS).

To configure and test Azure AD SSO with Amazon Web Services (AWS), complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Amazon Web Services (AWS) SSO](#configure-amazon-web-services-aws-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Amazon Web Services (AWS) test user](#create-amazon-web-services-aws-test-user)** - to have a counterpart of B.Simon in Amazon Web Services (AWS) that is linked to the Azure AD representation of user.
	1. **[How to configure role provisioning in Amazon Web Services (AWS)](#how-to-configure-role-provisioning-in-amazon-web-services-aws)**
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Amazon Web Services (AWS)** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the application is pre-configured, and the necessary URLs are already pre-populated with Azure. The user needs to save the configuration by selecting **Save**.

1. When you are configuring more than one instance, provide an identifier value. From second instance onwards, use the following format, including a **#** sign to specify a unique SPN value.

	`https://signin.aws.amazon.com/saml#2`

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Amazon Web Services (AWS)** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. In the Azure portal, search for and select **Azure Active Directory**.
1. Within the Azure Active Directory overview menu, choose **Users** > **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Amazon Web Services (AWS).

1. In the Azure portal, search for and select **Azure Active Directory**.
1. Within the Azure Active Directory overview menu, choose **Enterprise Applications** > **All applications**.
1. In the application list, select **Amazon Web Services (AWS)**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Amazon Web Services (AWS) SSO

1. In a different browser window, sign-on to your AWS company site as an administrator.

2. Select **AWS Home**.

    ![Screenshot of AWS company site, with AWS Home icon highlighted][11]

3. Select **Identity and Access Management**.

    ![Screenshot of AWS services page, with IAM highlighted][12]

4. Select **Identity Providers** > **Create Provider**.

    ![Screenshot of IAM page, with Identity Providers and Create Provider highlighted][13]

5. On the **Configure Provider** page, perform the following steps:

    ![Screenshot of Configure Provider][14]

	a. For **Provider Type**, select **SAML**.

	b. For **Provider Name**, type a provider name (for example: *WAAD*).

	c. To upload your downloaded **metadata file** from the Azure portal, select **Choose File**.

	d. Select **Next Step**.

6. On the **Verify Provider Information** page, select **Create**.

    ![Screenshot of Verify Provider Information, with Create highlighted][15]

7. Select **Roles** > **Create role**.

    ![Screenshot of Roles page][16]

8. On the **Create role** page, perform the following steps:  

    ![Screenshot of Create role page][19]

    a. Under **Select type of trusted entity**, select **SAML 2.0 federation**.

	b. Under **Choose a SAML 2.0 Provider**, select the **SAML provider** you created previously (for example: *WAAD*).

	c. Select **Allow programmatic and AWS Management Console access**.
  
    d. Select **Next: Permissions**.

9. On the **Attach permissions policies** dialog box, attach the appropriate policy, per your organization. Then select **Next: Review**.  

    ![Screenshot of Attach permissions policy dialog box][33]

10. On the **Review** dialog box, perform the following steps:

    ![Screenshot of Review dialog box][34]

	a. In **Role name**, enter your role name.

	b. In **Role description**, enter the description.

    c. Select **Create role**.

    d. Create as many roles as needed, and map them to the identity provider.

11. Use AWS service account credentials for fetching the roles from the AWS account in Azure AD user provisioning. For this, open the AWS console home.

12. Select **Services**. Under **Security, Identity & Compliance**, select **IAM**.

	![Screenshot of AWS console home, with Services and IAM highlighted](./media/amazon-web-service-tutorial/fetchingrole1.png)

13. In the IAM section, select **Policies**.

	![Screenshot of IAM section, with Policies highlighted](./media/amazon-web-service-tutorial/fetchingrole2.png)

14. Create a new policy by selecting **Create policy** for fetching the roles from the AWS account in Azure AD user provisioning.

	![Screenshot of Create role page, with Create policy highlighted](./media/amazon-web-service-tutorial/fetchingrole3.png)

15. Create your own policy to fetch all the roles from AWS accounts.

	![Screenshot of Create policy page, with JSON highlighted](./media/amazon-web-service-tutorial/policy1.png)

	a. In **Create policy**, select the **JSON** tab.

	b. In the policy document, add the following JSON:

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

    c. Select **Review policy** to validate the policy.

	![Screenshot of Create policy page](./media/amazon-web-service-tutorial/policy5.png)

16. Define the new policy.

	![Screenshot of Create policy page, with Name and Description fields highlighted](./media/amazon-web-service-tutorial/policy2.png)

	a. For **Name**, enter **AzureAD_SSOUserRole_Policy**.

	b. For **Description**, enter **This policy will allow to fetch the roles from AWS accounts**.

	c. Select **Create policy**.

17. Create a new user account in the AWS IAM service.

	a. In the AWS IAM console, select **Users**.

	![Screenshot of AWS IAM console, with Users highlighted](./media/amazon-web-service-tutorial/policy3.png)

	b. To create a new user, select **Add user**.

	![Screenshot of Add user button](./media/amazon-web-service-tutorial/policy4.png)

	c. In the **Add user** section:

	![Screenshot of Add user page, with User name and Access type highlighted](./media/amazon-web-service-tutorial/adduser1.png)

	* Enter the user name as **AzureADRoleManager**.

	* For the access type, select **Programmatic access**. This way, the user can invoke the APIs and fetch the roles from the AWS account.

	* Select **Next Permissions**.

18. Create a new policy for this user.

	![Screenshot of Add user](./media/amazon-web-service-tutorial/adduser2.png)

	a. Select **Attach existing policies directly**.

	b. Search for the newly created policy in the filter section **AzureAD_SSOUserRole_Policy**.

	c. Select the policy, and then select **Next: Review**.

19. Review the policy to the attached user.

	![Screenshot of Add user page, with Create user highlighted](./media/amazon-web-service-tutorial/adduser3.png)

	a. Review the user name, access type, and policy mapped to the user.

	b. Select **Create user**.

20. Download the user credentials of a user.

	![Screenshot of Add user](./media/amazon-web-service-tutorial/adduser4.png)

	a. Copy the user **Access key ID** and **Secret access key**.

	b. Enter these credentials into the Azure AD user provisioning section to fetch the roles from the AWS console.

	c. Select **Close**.

### How to configure role provisioning in Amazon Web Services (AWS)

1. In the Azure AD management portal, in the AWS app, go to **Provisioning**.

	![Screenshot of AWS app, with Provisioning highlighted](./media/amazon-web-service-tutorial/provisioning.png)

2. Enter the access key and secret in the **clientsecret** and **Secret Token** fields, respectively.

	![Screenshot of Admin Credentials dialog box](./media/amazon-web-service-tutorial/provisioning1.png)

	a. Enter the AWS user access key in the **clientsecret** field.

	b. Enter the AWS user secret in the **Secret Token** field.

	c. Select **Test Connection**.

	d. Save the setting by selecting **Save**.

3. In the **Settings** section, for **Provisioning Status**, select **On**. Then select **Save**.

	![Screenshot of Settings section, with On highlighted](./media/amazon-web-service-tutorial/provisioning2.png)

> [!NOTE]
> Provisioning service will only import roles from AWS to Azure AD. This service will not provision users and groups from Azure AD back to AWS.

### Create Amazon Web Services (AWS) test user

The objective of this section is to create a user called B.Simon in Amazon Web Services (AWS). Amazon Web Services (AWS) doesn't need a user to be created in their system for SSO, so you don't need to perform any action here.

## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Amazon Web Services (AWS) tile in the Access Panel, you should be automatically signed in to the Amazon Web Services (AWS) for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Known issues

 * In the **Provisioning** section, the **Mappings** subsection shows a "Loading..." message, and never displays the attribute mappings. The only provisioning workflow supported today is the import of roles from AWS into Azure AD for selection during a user or group assignment. The attribute mappings for this are predetermined, and aren't configurable.

 * The **Provisioning** section only supports entering one set of credentials for one AWS tenant at a time. All imported roles are written to the `appRoles` property of the Azure AD [`servicePrincipal` object](https://docs.microsoft.com/graph/api/resources/serviceprincipal?view=graph-rest-beta) for the AWS tenant.

   Multiple AWS tenants (represented by `servicePrincipals`) can be added to Azure AD from the gallery for provisioning. There's a known issue, however, with not being able to automatically write all of the imported roles from the multiple AWS `servicePrincipals` used for provisioning into the single `servicePrincipal` used for SSO.

   As a workaround, you can use the [Microsoft Graph API](https://docs.microsoft.com/graph/api/resources/serviceprincipal?view=graph-rest-beta) to extract all of the `appRoles` imported into each AWS `servicePrincipal` where provisioning is configured. You can subsequently add these role strings to the AWS `servicePrincipal` where SSO is configured.

* Roles must meet the following requirements to be eligible to be imported from AWS into Azure AD:

  * Roles must have exactly one saml-provider defined in AWS

  * The combined length of the role ARN and the saml-provider ARN for a role being imported must be 119 characters or less

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Amazon Web Services (AWS) with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/protect-aws)

- [How to protect Amazon Web Services (AWS) with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

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
