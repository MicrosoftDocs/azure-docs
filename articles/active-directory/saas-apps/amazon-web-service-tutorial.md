---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with AWS Single-Account Access | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and AWS Single-Account Access.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 03/05/2021
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with AWS Single-Account Access

In this tutorial, you'll learn how to integrate AWS Single-Account Access with Azure Active Directory (Azure AD). When you integrate AWS Single-Account Access with Azure AD, you can:

* Control in Azure AD who has access to AWS Single-Account Access.
* Enable your users to be automatically signed-in to AWS Single-Account Access with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Understanding the different AWS applications in the Azure AD application gallery
Use the information below to make a decision between using the AWS Single Sign-On and AWS Single-Account Access applications in the Azure AD application gallery.

**AWS Single Sign-On**

[AWS Single Sign-On](./aws-single-sign-on-tutorial.md) was added to the Azure AD application gallery in February 2021. It makes it easy to manage access centrally to multiple AWS accounts and AWS applications, with sign-in through Microsoft Azure AD. Federate Microsoft Azure AD with AWS SSO once, and use AWS SSO to manage permissions across all of your AWS accounts from one place. AWS SSO provisions permissions automatically and keeps them current as you update policies and access assignments. End users can authenticate with their Azure AD credentials to access the AWS Console, Command Line Interface, and AWS SSO integrated applications.

**AWS Single-Account Access**

[AWS Single-Account Access]() has been used by customers over the past several years and enables you to federate Azure AD to a single AWS account and use Azure AD to manage access to AWS IAM roles. AWS IAM administrators define roles and policies in each AWS account. For each AWS account, Azure AD administrators federate to AWS IAM, assign users or groups to the account, and configure Azure AD to send assertions that authorize role access.  

| Feature | AWS Single Sign-On | AWS Single-Account Access |
|:--- |:---:|:---:|
|Conditional access| Supports a single conditional access policy for all AWS accounts. | Supports a single conditional access policy for all accounts or custom policies per account|
| CLI access | Supported | Supported|
| Privileged  Identity Management | Not yet supported | Not yet supported |
| Centralize account management | Centralize account management in AWS. | Centralize account management in Azure AD (will likely require an Azure AD enterprise application per account). |
| SAML certificate| Single certificate| Separate certificates per app / account | 

## AWS Single-Account Access architecture
![Diagram of Azure AD and AWS relationship](./media/amazon-web-service-tutorial/tutorial_amazonwebservices_image.png)

You can configure multiple identifiers for multiple instances. For example:

* `https://signin.aws.amazon.com/saml#1`

* `https://signin.aws.amazon.com/saml#2`

With these values, Azure AD removes the value of **#**, and sends the correct value `https://signin.aws.amazon.com/saml` as the audience URL in the SAML token.

We recommend this approach for the following reasons:

- Each application provides you with a unique X509 certificate. Each instance of an AWS app instance can then have a different certificate expiry date, which can be managed on an individual AWS account basis. Overall certificate rollover is easier in this case.

- You can enable user provisioning with an AWS app in Azure AD, and then our service fetches all the roles from that AWS account. You don't have to manually add or update the AWS roles on the app.

- You can assign the app owner individually for the app. This person can manage the app directly in Azure AD.

> [!Note]
> Make sure you use a gallery application only.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* An AWS single sign-on (SSO) enabled subscription.

> [!Note]
> Roles should not be manually edited in Azure AD when doing role imports.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* AWS Single-Account Access supports **SP and IDP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding AWS Single-Account Access from the gallery

To configure the integration of AWS Single-Account Access into Azure AD, you need to add AWS Single-Account Access from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using a work account, school account, or personal Microsoft account.
1. In the Azure portal, search for and select **Azure Active Directory**.
1. Within the Azure Active Directory overview menu, choose **Enterprise Applications** > **All applications**.
1. Select **New application** to add an application.
1. In the **Add from the gallery** section, type **AWS Single-Account Access** in the search box.
1. Select **AWS Single-Account Access** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for AWS Single-Account Access

Configure and test Azure AD SSO with AWS Single-Account Access using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in AWS Single-Account Access.

To configure and test Azure AD SSO with AWS Single-Account Access, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure AWS Single-Account Access SSO](#configure-aws-single-account-access-sso)** - to configure the single sign-on settings on application side.
    1. **[Create AWS Single-Account Access test user](#create-aws-single-account-access-test-user)** - to have a counterpart of B.Simon in AWS Single-Account Access that is linked to the Azure AD representation of user.
    1. **[How to configure role provisioning in AWS Single-Account Access](#how-to-configure-role-provisioning-in-aws-single-account-access)**
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **AWS Single-Account Access** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, update both **Identifier (Entity ID)** and **Reply URL** with the same default value: `https://signin.aws.amazon.com/saml`. You must select **Save** to save the configuration changes.

1. When you are configuring more than one instance, provide an identifier value. From second instance onwards, use the following format, including a **#** sign to specify a unique SPN value.

    `https://signin.aws.amazon.com/saml#2`

1. AWS application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, AWS application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
	
	| Name  | Source attribute  | Namespace |
	| --------------- | --------------- | --------------- |
	| RoleSessionName | user.userprincipalname | `https://aws.amazon.com/SAML/Attributes` |
	| Role | user.assignedroles |  `https://aws.amazon.com/SAML/Attributes` |
	| SessionDuration | "provide a value between 900 seconds (15 minutes) to 43200 seconds (12 hours)" |  `https://aws.amazon.com/SAML/Attributes` |

    > [!NOTE]
    > AWS expects roles for users assigned to the application. Please set up these roles in Azure AD so that users can be assigned the appropriate roles. To understand how to configure roles in Azure AD, see [here](../develop/howto-add-app-roles-in-azure-ad-apps.md#app-roles-ui--preview)

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** (Step 3) dialog box, select **Add a certificate**.

    ![Create new SAML Certificate](common/add-saml-certificate.png)

1. Generate a new SAML signing certificate, and then select **New Certificate**. Enter an email address for certificate notifications.
   
    ![New SAML Certificate](common/new-saml-certificate.png) 

1. In the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![The Certificate download link](./media/amazon-web-service-tutorial/certificate.png)

1. In the **Set up AWS Single-Account Access** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to AWS Single-Account Access.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **AWS Single-Account Access**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure AWS Single-Account Access SSO

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

    ![Screenshot shows the Add user page where you can create a policy for the user.](./media/amazon-web-service-tutorial/adduser2.png)

    a. Select **Attach existing policies directly**.

    b. Search for the newly created policy in the filter section **AzureAD_SSOUserRole_Policy**.

    c. Select the policy, and then select **Next: Review**.

19. Review the policy to the attached user.

    ![Screenshot of Add user page, with Create user highlighted](./media/amazon-web-service-tutorial/adduser3.png)

    a. Review the user name, access type, and policy mapped to the user.

    b. Select **Create user**.

20. Download the user credentials of a user.

    ![Screenshot shows the Add user page with a Download c s v button to get user credentials.](./media/amazon-web-service-tutorial/adduser4.png)

    a. Copy the user **Access key ID** and **Secret access key**.

    b. Enter these credentials into the Azure AD user provisioning section to fetch the roles from the AWS console.

    c. Select **Close**.

### How to configure role provisioning in AWS Single-Account Access

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
> The provisioning service imports roles only from AWS to Azure AD. The service does not provision users and groups from Azure AD to AWS.

> [!NOTE]
> After you save the provisioning credentials, you must wait for the initial sync cycle to run. Sync usually takes around 40 minutes to finish. You can see the status at the bottom of the **Provisioning** page, under **Current Status**.

### Create AWS Single-Account Access test user

The objective of this section is to create a user called B.Simon in AWS Single-Account Access. AWS Single-Account Access doesn't need a user to be created in their system for SSO, so you don't need to perform any action here.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to AWS Single-Account Access Sign on URL where you can initiate the login flow.  

* Go to AWS Single-Account Access Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the AWS Single-Account Access for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the AWS Single-Account Access tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the AWS Single-Account Access for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Known issues

* AWS Single-Account Access provisioning integration can be used only to connect to AWS public cloud endpoints. AWS Single-Account Access provisioning integration can't be used to access AWS Government environments.
 
* In the **Provisioning** section, the **Mappings** subsection shows a "Loading..." message, and never displays the attribute mappings. The only provisioning workflow supported today is the import of roles from AWS into Azure AD for selection during a user or group assignment. The attribute mappings for this are predetermined, and aren't configurable.

* The **Provisioning** section only supports entering one set of credentials for one AWS tenant at a time. All imported roles are written to the `appRoles` property of the Azure AD [`servicePrincipal` object](/graph/api/resources/serviceprincipal) for the AWS tenant.

  Multiple AWS tenants (represented by `servicePrincipals`) can be added to Azure AD from the gallery for provisioning. There's a known issue, however, with not being able to automatically write all of the imported roles from the multiple AWS `servicePrincipals` used for provisioning into the single `servicePrincipal` used for SSO.

  As a workaround, you can use the [Microsoft Graph API](/graph/api/resources/serviceprincipal) to extract all of the `appRoles` imported into each AWS `servicePrincipal` where provisioning is configured. You can subsequently add these role strings to the AWS `servicePrincipal` where SSO is configured.

* Roles must meet the following requirements to be eligible to be imported from AWS into Azure AD:

  * Roles must have exactly one saml-provider defined in AWS
  * The combined length of the ARN(Amazon Resource Name) for the role and the ARN for the associated saml-provider must be less than 240 characters.

## Change log

* 01/12/2020 - Increased role length limit from 119 characters to 239 characters. 

## Next steps

Once you configure AWS Single-Account Access you can enforce Session Control, which protects exfiltration and infiltration of your organization's sensitive data in real time. Session Control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad)


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