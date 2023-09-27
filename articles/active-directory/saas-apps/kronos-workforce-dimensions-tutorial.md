---
title: 'Tutorial: Microsoft Entra SSO integration with Kronos Workforce Dimensions'
description: Learn how to configure single sign-on between Microsoft Entra ID and Kronos Workforce Dimensions.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes

---

# Tutorial: Microsoft Entra SSO integration with Kronos Workforce Dimensions

In this tutorial, you'll learn how to integrate Kronos Workforce Dimensions with Microsoft Entra ID. When you integrate Kronos Workforce Dimensions with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Kronos Workforce Dimensions.
* Enable your users to be automatically signed-in to Kronos Workforce Dimensions with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Kronos Workforce Dimensions single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Kronos Workforce Dimensions supports **SP** initiated SSO.

## Add Kronos Workforce Dimensions from the gallery

To configure the integration of Kronos Workforce Dimensions into Microsoft Entra ID, you need to add Kronos Workforce Dimensions from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Kronos Workforce Dimensions** in the search box.
1. Select **Kronos Workforce Dimensions** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-kronos-workforce-dimensions'></a>

## Configure and test Microsoft Entra SSO for Kronos Workforce Dimensions

Configure and test Microsoft Entra SSO with Kronos Workforce Dimensions using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Kronos Workforce Dimensions.

To configure and test Microsoft Entra SSO with Kronos Workforce Dimensions, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Kronos Workforce Dimensions SSO](#configure-kronos-workforce-dimensions-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Kronos Workforce Dimensions test user](#create-kronos-workforce-dimensions-test-user)** - to have a counterpart of B.Simon in Kronos Workforce Dimensions that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Kronos Workforce Dimensions** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.<ENVIRONMENT>.mykronos.com/authn/<TENANT_ID/hsp/<TENANT_NUMBER>`

    b. In the **Sign on URL** text box, type a URL using one of the following patterns:
    
    | **Sign on URL** |
    |-----|
    | `https://<CUSTOMER>-<ENVIRONMENT>-sso.<ENVIRONMENT>.mykronos.com/` |
    | `https://<CUSTOMER>-sso.<ENVIRONMENT>.mykronos.com/` |

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Sign on URL. Contact [Kronos Workforce Dimensions Client support team](mailto:support@kronos.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you'll create a test user called B.Simon.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you'll enable B.Simon to use single sign-on by granting access to Kronos Workforce Dimensions.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Kronos Workforce Dimensions**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Kronos Workforce Dimensions SSO

To configure single sign-on on **Kronos Workforce Dimensions** side, you need to send the **App Federation Metadata Url** to [Kronos Workforce Dimensions support team](mailto:support@kronos.com). They set this setting to have the SAML SSO connection set properly on both sides.

## Create Kronos Workforce Dimensions test user

In this section, you create a user called Britta Simon in Kronos Workforce Dimensions. Work with [Kronos Workforce Dimensions support team](mailto:support@kronos.com) to add the users in the Kronos Workforce Dimensions platform. Users must be created and activated before you use single sign-on.

> [!NOTE]
> Original Microsoft documentation advises to contact UKG Support via email to create your Microsoft Entra users. While this option is available please consider the following self-service options. 

### Manual Process 

There are two ways to manually create your Microsoft Entra users in WFD.  You can either select an existing user, duplicate them and then update the necessary fields to make that user unique.  This process can be time consuming and requires knowledge of the WFD User Interface. The alternative is to create the user via the WFD API which is much quicker. This option requires knowledge of using API Tools such as Postman to send the request to the API instead. The following instructions will assist with importing a prebuilt example into the Postman API Tool. 

#### Setup 

1. Open Postman tool and import the following files: 

    a. Workforce Dimensions - Create User.postman_collection.json 

    b. Microsoft Entra ID to WFD Env Variables.json 

1. In the left-pane, select the **Environments** button. 

1. Click on **AAD_to_WFD_Env_Variables** and add the values provided by UKG Support pertaining to your WFD instance. 

    > [!NOTE]
    > access_token and refresh_token should be empty as these will automatically populate as a result of the Obtain Access Token HTTP Request.   

1. Open the **Create Microsoft Entra user in WFD** HTTP Request and update highlighted properties within the JSON payload: 

    ```  
    { 

    "personInformation": { 

       "accessAssignment": { 

          "accessProfileName": "accessProfileName", 

          "notificationProfileName": "All" 

        }, 

        "emailAddresses": [ 

          { 

            "address": "address” 

            "contactTypeName": "Work" 

          } 

        ], 

        "employmentStatusList": [ 

          { 

            "effectiveDate": "2019-08-15", 

            "employmentStatusName": "Active", 

            "expirationDate": "3000-01-01" 

          } 

        ], 

        "person": { 

          "personNumber": "personNumber", 

          "firstName": "firstName", 

          "lastName": "lastName", 

          "fullName": "fullName", 

          "hireDate": "2019-08-15", 

          "shortName": "shortName" 

        }, 

        "personAuthenticationTypes": [ 

          { 

            "activeFlag": true, 

            "authenticationTypeName": "Federated" 

          } 

        ], 

        "personLicenseTypes": [ 

          { 

            "activeFlag": true, 

            "licenseTypeName": "Employee" 

          }, 

          { 

            "activeFlag": true, 

            "licenseTypeName": "Absence" 

          }, 

          { 

            "activeFlag": true, 

            "licenseTypeName": "Hourly Timekeeping" 

          }, 

          { 

            "activeFlag": true, 

            "licenseTypeName": "Scheduling" 

          } 

        ], 

        "userAccountStatusList": [ 

          { 

            "effectiveDate": "2019-08-15", 

            "expirationDate": "3000-01-01", 

            "userAccountStatusName": "Active" 

          } 

        ] 

      }, 

      "jobAssignment": { 

        "baseWageRates": [ 

          { 

            "effectiveDate": "2019-01-01", 

            "expirationDate": "3000-01-01", 

            "hourlyRate": 20.15 

          } 

        ], 

        "jobAssignmentDetails": { 

          "payRuleName": "payRuleName", 

          "timeZoneName": "timeZoneName" 

        }, 

        "primaryLaborAccounts": [ 

          { 

            "effectiveDate": "2019-08-15", 

            "expirationDate": "3000-01-01", 

            "organizationPath": "organizationPath" 

          } 

        ] 

      }, 

      "user": { 

        "userAccount": { 

          "logonProfileName": "Default", 

          "userName": "userName" 

        } 

      } 

    }
    ```

    > [!NOTE]
    > The personInformation.emailAddress.address and the user.userAccount.userName must both match the targeted Microsoft Entra user you are trying to create in WFD. 

1. In the upper-righthand corner, select the **Environments** drop-down-box and select **AAD_to_WFD_Env_Variables**. 

1. Once the JSON payload has been updated and the correct environment variables selected, select the **Obtain Access Token** HTTP Request and click the **Send** button. This will leverage the updated environment variables to authenticate to your WFD instance and then cache your access token in the environment variables to use when calling the create user method. 

1. If the authentication call was successful, you should see a 200 response with an access token returned. This access token will also now show in the **CURRENT VALUE** column in the environment variables for the **access_token** entry. 

    > [!NOTE]
    > If an access_token is not received, confirm that all variables in the environment variables are correct. User credentials should be a super user account. 

1. Once an **access_token** is obtained, select the **AAD_to_WFD_Env_Variables** HTTP Request and click the **Send** button.  If the request is successful you will receive a 200 HTTP status back. 

1. Login to WFD with the **Super User** account and confirm the new Microsoft Entra user was created within the WFD instance. 

### Automated Process 

The automated process consists of a flat-file in CSV format which allows the user to prespecify the highlighted values in the payload from the manual API process above. The flat-file is consumed by the accompanying PowerShell script which creates the new WFD users in bulk. The script processes new user creations in batches of 70 (default) which is configurable for optimal performance. The following instructions will walk through the setup and execution of the script. 

1. Save both the **AAD_To_WFD.csv** and **AAD_To_WFD.ps1** files locally to your computer. 

1. Open the **AAD_To_WFD.csv** file and fill in the columns. 

    * **personInformation.accessAssignment.accessProfileName**: Specific Access Profile Name from WFD instance. 

    * **personInformation.emailAddresses.address**: 
    Must match the User Principle Name in Microsoft Entra ID. 

    * **personInformation.personNumber**: Must be unique across the WFD instance. 

    * **personInformation.firstName**: User’s first name. 

    * **personInformation.lastName**: User’s last name. 

    * **jobAssignment.jobAssignmentDetails.payRuleName**: Specific Pay Rule Name from WFD. 

    * **jobAssignment.jobAssignmentDetails.timeZoneName**: Timezone format must match WFD instance (i.e. (GMT -08:00) Pacific Time) 

    * **jobAssignment.primaryLaborAccounts.organizationPath**: Organization Path of a specific Business structure in the WFD instance. 

1. Save the .csv file. 

1. Right-Click the **AAD_To_WFD.ps1** script and click **Edit** to modify it. 

1. Confirm the path specified in Line 15 is the correct name/path to the **AAD_To_WFD.csv** file. 

1. Update the following lines with the values provided by UKG Support pertaining to your WFD instance. 

    * Line 33:  vanityUrl 

    * Line 43:  appKey 

    * Line 48:  client_id 

    * Line 49:  client_secret 

1. Save and execute the script. 

1. Provide WFD **Super User** credentials when prompted. 

1. Once completed, the script will return a list of any users that failed to create.

> [!Note]
> Be sure to check the values provided in the AAD_To_WFD.csv file if it is returned as the result of typos or mismatched fields in the WFD instance.  The error could also be returned by the WFD API instance if all users in the batch already exist in the instance.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to Kronos Workforce Dimensions Sign-on URL where you can initiate the login flow. 

* Go to Kronos Workforce Dimensions Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Kronos Workforce Dimensions tile in the My Apps, this will redirect to Kronos Workforce Dimensions Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Kronos Workforce Dimensions you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
