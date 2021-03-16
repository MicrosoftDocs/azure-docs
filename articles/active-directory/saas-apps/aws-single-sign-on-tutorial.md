---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with AWS Single Sign-on | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and AWS Single Sign-on.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 02/18/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with AWS Single Sign-on

In this tutorial, you'll learn how to integrate AWS Single Sign-on with Azure Active Directory (Azure AD). When you integrate AWS Single Sign-on with Azure AD, you can:

* Control in Azure AD who has access to AWS Single Sign-on.
* Enable your users to be automatically signed-in to AWS Single Sign-on with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* AWS Single Sign-on single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* AWS Single Sign-on supports **SP and IDP** initiated SSO

* AWS Single Sign-on supports [**Automated user provisioning**](./aws-single-sign-on-provisioning-tutorial.md).

## Adding AWS Single Sign-on from the gallery

To configure the integration of AWS Single Sign-on into Azure AD, you need to add AWS Single Sign-on from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **AWS Single Sign-on** in the search box.
1. Select **AWS Single Sign-on** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for AWS Single Sign-on

Configure and test Azure AD SSO with AWS Single Sign-on using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in AWS Single Sign-on.

To configure and test Azure AD SSO with AWS Single Sign-on, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure AWS Single Sign-on SSO](#configure-aws-single-sign-on-sso)** - to configure the single sign-on settings on application side.
    1. **[Create AWS Single Sign-on test user](#create-aws-single-sign-on-test-user)** - to have a counterpart of B.Simon in AWS Single Sign-on that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **AWS Single Sign-on** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. If you have **Service Provider metadata file**, on the **Basic SAML Configuration** section, perform the following steps:

	a. Click **Upload metadata file**.

    ![image1](common/upload-metadata.png)

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![image2](common/browse-upload-metadata.png)

	c. Once the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values get auto populated in Basic SAML Configuration section:

	![image3](common/idp-intiated.png)

	> [!Note]
	> If the **Identifier** and **Reply URL** values are not getting auto polulated, then fill in the values manually according to your requirement.

1. If you don't have **Service Provider metadata file**, perform the following steps on the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<REGION>.signin.aws.amazon.com/platform/saml/<ID>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<REGION>.signin.aws.amazon.com/platform/saml/acs/<ID>`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://portal.sso.<REGION>.amazonaws.com/saml/assertion/<ID>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [AWS Single Sign-on Client support team](mailto:aws-sso-partners@amazon.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. AWS Single Sign-on application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/edit-attribute.png)


    > [!NOTE]
    > If ABAC is enabled in AWS SSO, the additional attributes may be passed as session tags directly into AWS accounts.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate(Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up AWS Single Sign-on** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to AWS Single Sign-on.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **AWS Single Sign-on**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure AWS Single Sign-on SSO

1. Open the **AWS SSO console** . 
2. In the left navigation pane, choose **Settings**.
3. On the **Settings** page, find **Identity source**, choose **Change**.
4. On the Change directory page, choose **External identity provider**.
5. In the **Service provider metadata** section, find **AWS SSO SAML metadata** and select **Download metadata file** to download the metadata file and save it on your computer.
6. In the **Identity provider metadata** section, choose **Browse** to upload the metadata file which you have downloaded from the Azure portal.
7. Choose **Next: Review**.
8. In the text box, type **CONFIRM** to confirm changing directory.
9. Choose **Finish**.

### Create AWS Single Sign-on test user

1. Open the **AWS SSO console**.

2. In the left navigation pane, choose **Users**.

3. On the Users page, choose **Add user**.

4. On the Add user page, follow these steps:

    a. In the **Username** field, enter B.Simon.

    b. In the **Email address** field, enter the `username@companydomain.extension`. For example, `B.Simon@contoso.com`.

    c. In the **Confirm email address** field, re-enter the email address from the previous step.

    d. In the First name field, enter `Jane`.

    e. In the Last name field, enter `Doe`.

    f. In the Display name field, enter `Jane Doe`.

    g. Choose **Next: Groups**.

    > [!NOTE]
    > Make sure the username entered in AWS SSO matches the user’s Azure AD sign-in name. This
will you help avoid any authentication problems.

5. Choose **Add user**.
6. Next, you will assign the user to your AWS account. To do so, in the left navigation pane of the
AWS SSO console, choose **AWS accounts**.
7. On the AWS Accounts page, select the AWS organization tab, check the box next to the AWS
account you want to assign to the user. Then choose **Assign users**.
8. On the Assign Users page, find and check the box next to the user B.Simon. Then choose **Next:
Permission sets**.
9. Under the select permission sets section, check the box next to the permission set you want to
assign to the user B.Simon. If you don’t have an existing permission set, choose **Create new
permission set**.

    > [!NOTE]
    > Permission sets define the level of access that users and groups have to an AWS account. To learn more
about permission sets, see the AWS SSO **Permission Sets** page.
10. Choose **Finish**.

> [!NOTE]
> AWS Single Sign-on also supports automatic user provisioning, you can find more details [here](./aws-single-sign-on-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to AWS Single Sign-on Sign on URL where you can initiate the login flow.  

* Go to AWS Single Sign-on Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the AWS Single Sign-on for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the AWS Single Sign-on tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the AWS Single Sign-on for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure AWS Single Sign-on you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).