---
title: Publish your application
description: Learn how to publish your application in the Azure Active Directory application gallery. 
titleSuffix: Azure AD
services: active-directory
author: eringreenlee
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 1/18/2022
ms.author: ergreenl
---

# Request to Publish your application in the Azure Active Directory application gallery

You can publish your application in the Azure Active Directory (Azure AD) application gallery. When your application is published, it's made available as an option for users when they add applications to their tenant. For more information, see [Overview of the Azure Active Directory application gallery](overview-application-gallery.md).

To publish your application in the gallery, you need to complete the following tasks:

- Make sure that you complete the prerequisites.
- Create and publish documentation.
- Submit your application.
- Join the Microsoft partner network.

## Prerequisites
- To publish your application in the gallery, you must first read and agree to specific [terms and conditions](https://azure.microsoft.com/support/legal/active-directory-app-gallery-terms/).
- Support for single sign-on (SSO). To learn more about the supported options, see [Plan a single sign-on deployment](plan-sso-deployment.md).
    - For password SSO, make sure that your application supports form authentication so that password vaulting can be used. 
	- For federated applications (OpenID and SAML/WS-Fed), the application must support the [software-as-a-service (SaaS) model](https://azure.microsoft.com/overview/what-is-saas/) to be listed in the gallery. The enterprise gallery applications must support multiple user configurations and not any specific user.
	- For Open ID Connect, the application must be multitenanted and the [Azure AD consent framework](../develop/consent-framework.md) must be properly implemented for the application. 
- Supporting provisioning is optional, but highly recommended. To learn more about the Azure AD SCIM implementation, see [build a SCIM endpoint and configure user provisioning with Azure AD](../app-provisioning/use-scim-to-provision-users-and-groups.md).

You can get a free test account with all the premium Azure AD features - 90 days free and can get extended as long as you do dev work with it: [Join the Microsoft 365 Developer Program](/office/developer-program/microsoft-365-developer-program).

## Create and publish documentation

### Documentation on your site

Ease of adoption is a significant factor in enterprise software decisions. Clear easy-to-follow documentation supports your users in their adoption journey and reduces support costs.

Your documentation should at a minimum include the following items:

- Introduction to your SSO functionality
    - Protocols supported
    - Version and SKU
    - Supported identity providers list with documentation links
- Licensing information for your application
- Role-based access control for configuring SSO
- SSO Configuration Steps
    - UI configuration elements for SAML with expected values from the provider
    - Service provider information to be passed to identity providers
- If OIDC/OAuth, list of permissions required for consent with business justifications
- Testing steps for pilot users
- Troubleshooting information, including error codes and messages
- Support mechanisms for users
- Details about your SCIM endpoint, including the resources and attributes supported

### Documentation on the Microsoft site

When your application is added to the gallery, documentation is created that explains the step-by-step process. For an example, see [Tutorials for integrating SaaS applications with Azure Active Directory](../saas-apps/tutorial-list.md). This documentation is created based on your submission to the gallery, and you can easily update it if you make changes to your application using your GitHub account.

## Submit your application

After you've tested that your application integration works with Azure AD, submit your application request in the [Microsoft Application Network portal](https://microsoft.sharepoint.com/teams/apponboarding/Apps). The first time you try to sign into the portal you are presented with one of two screens. 

- If you receive the message "That didn't work", then you need to contact the [Azure AD SSO Integration Team](mailto:SaaSApplicationIntegrations@service.microsoft.com). Provide the email account that you want to use for submitting the request. A business email address such as `name@yourbusiness.com` is preferred. The Azure AD team will add the account in the Microsoft Application Network portal.
- If you see a "Request Access" page, then fill in the business justification and select **Request Access**.

After the account is added, you can sign in to the Microsoft Application Network portal and submit the request by selecting the **Submit Request (ISV)** tile on the home page. If you see the **Your sign-in was blocked** error while logging in, see [Troubleshoot sign-in to the Microsoft Application Network portal](troubleshoot-app-publishing.md).

### Implementation-specific options

On the Application Registration Form, select the feature that you want to enable. Select **OpenID Connect & OAuth 2.0**, **SAML 2.0/WS-Fed**, or **Password SSO(UserName & Password)** depending on the feature that your application supports.

If you're implementing a [SCIM](../app-provisioning/use-scim-to-provision-users-and-groups.md) 2.0 endpoint for user provisioning, select **User Provisioning (SCIM 2.0)**. Download the schema to provide in the onboarding request. For more information, see [Export provisioning configuration and roll back to a known good state](../app-provisioning/export-import-provisioning-configuration.md). The schema that you configured is used when testing the non-gallery application to build the gallery application. 

You can track application requests by customer name at the Microsoft Application Network portal. For more information, see [Application requests by Customers](https://microsoft.sharepoint.com/teams/apponboarding/Apps/SitePages/AppRequestsByCustomers.aspx).

### Timelines

The timeline for the process of listing a SAML 2.0 or WS-Fed application in the gallery is 7 to 10 business days.

:::image type="content" source="./media/howto-app-gallery-listing/timeline.png" alt-text="Screenshot that shows the timeline for listing a SAML application.":::

The timeline for the process of listing an OpenID Connect application in the gallery is 2 to 5 business days.

:::image type="content" source="./media/howto-app-gallery-listing/timeline2.png" alt-text="Screenshot that shows the timeline for listing an OpenID Connect application.":::

The timeline for the process of listing a SCIM provisioning application in the gallery is variable and depends on numerous factors.

Not all applications can be onboarded. Per the terms and conditions, the choice may be made to not list an application. Onboarding applications is at the sole discretion of the onboarding team. If your application is declined, you should use the non-gallery provisioning application to satisfy your provisioning needs.

Here's the flow of customer-requested applications.

:::image type="content" source="./media/howto-app-gallery-listing/customer-request-2.png" alt-text="Screenshot that shows the customer-requested apps flow.":::

For any escalations, send email to the [Azure AD SSO Integration Team](mailto:SaaSApplicationIntegrations@service.microsoft.com), and a response is sent as soon as possible.


## Join the Microsoft partner network

The Microsoft Partner Network provides instant access to exclusive resources, programs, tools, and connections. To join the network and create your go to market plan, see [Reach commercial customers](https://partner.microsoft.com/explore/commercial#gtm).

## Next steps

- Learn more about managing enterprise applications in [What is application management in Azure Active Directory?](what-is-application-management.md)
