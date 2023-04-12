---
title: Azure Active Directory SSO integration with QRadar SOAR
description: Learn how to configure single sign-on between Azure Active Directory and QRadar SOAR.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 04/11/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with QRadar SOAR

In this article, you learn how to integrate QRadar SOAR with Azure Active Directory (Azure AD). QRadar SOAR enhances the analyst experience through accelerated incident response with simple automation, process standardization, and integration with your existing security tools. When you integrate QRadar SOAR with Azure AD, you can:

* Control in Azure AD who has access to QRadar SOAR.
* Enable your users to be automatically signed-in to QRadar SOAR with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You configure and test Azure AD single sign-on for QRadar SOAR in a test environment. QRadar SOAR supports both **SP** and **IDP** initiated single sign-on.

## Prerequisites

To integrate Azure Active Directory with QRadar SOAR, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* QRadar SOAR single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the QRadar SOAR application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add QRadar SOAR from the Azure AD gallery

Add QRadar SOAR from the Azure AD application gallery to configure single sign-on with QRadar SOAR. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **QRadar SOAR** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type a URL using one of the following patterns:

    | **Identifier** |
    |-------|
    | `https://<CustomerName>.domain.extension/<ID>` |
    | `https://<CustomerName>.domain.extension` |

    b. In the **Reply URL** textbox, type a URL using one of the following patterns:

    | **Reply URL** |
    |-------|
    | `https://<CustomerName>.domain.extension/<ID>` |
    | `https://<CustomerName>.domain.extension` |

1. If you want to configure **SP** initiated SSO, then perform the following step:  

    In the **Sign on URL** textbox, type a URL using one of the following patterns:

    | **Sign on URL** |
    |-------|
    | `https://<CustomerName>.domain.extension/<ID>` |
    | `https://<CustomerName>.domain.extension` |

    > [!Note]
    > These values are not the real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [QRadar SOAR Client support team](mailto:mysphelp@us.ibm.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up QRadar SOAR** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows how to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure QRadar SOAR SSO

To configure single sign-on on **QRadar SOAR** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [QRadar SOAR support team](mailto:mysphelp@us.ibm.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create QRadar SOAR test user

In this section, you create a user called Britta Simon in QRadar SOAR. Work with [QRadar SOAR support team](mailto:mysphelp@us.ibm.com) to add the users in the QRadar SOAR platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to QRadar SOAR Sign-on URL where you can initiate the login flow.  

* Go to QRadar SOAR Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the QRadar SOAR for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the QRadar SOAR tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the QRadar SOAR for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure QRadar SOAR you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).