---
title: Submit a request to publish your application
description: Learn how to publish your application in Microsoft Entra application gallery.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 09/22/2023
ms.author: jomondi
ms.reviewer: ergreenl
ms.custom: kr2b-contr-experiment, contperf-fy22q4, enterprise-apps-article
---

# Submit a request to publish your application in Microsoft Entra application gallery

You can publish applications you develop in the Microsoft Entra application gallery, which is a catalog of thousands of apps. When you publish your applications, they're made publicly available for users to add to their tenants. For more information, see [Overview of the Microsoft Entra application gallery](overview-application-gallery.md).

To publish your application in the Microsoft Entra application gallery, you need to complete the following tasks:

- Make sure that you complete the prerequisites.
- Create and publish documentation.
- Submit your application.
- Join the Microsoft partner network.

## Prerequisites
To publish your application in the gallery, you must first read and agree to specific [terms and conditions](https://azure.microsoft.com/support/legal/active-directory-app-gallery-terms/).
- Implement support for *single sign-on* (SSO). To learn more about supported options, see [Plan a single sign-on deployment](plan-sso-deployment.md).
    - For password SSO, make sure that your application supports form authentication so that password vaulting can be used.
	- For federated applications (SAML/WS-Fed), the application should preferably support [software-as-a-service (SaaS) model](https://azure.microsoft.com/overview/what-is-saas/) but it is not mandatory and it can be an on-premises application as well. Enterprise gallery applications must support multiple user configurations and not any specific user.

	- For OpenID Connect, the application should be multitenant and [Microsoft Entra consent framework](../develop/application-consent-experience.md) must be correctly implemented. Refer to [this](../develop/howto-convert-app-to-be-multi-tenant.md) link to convert the application into multitenant.
- Provisioning is optional yet highly recommended. To learn more about Microsoft Entra SCIM, see [build a SCIM endpoint and configure user provisioning with Microsoft Entra ID](../app-provisioning/use-scim-to-provision-users-and-groups.md).

You can sign up for a free, test Development account. It's free for 90 days and you get all of the premium Microsoft Entra features with it. You can also extend the account if you use it for development work: [Join the Microsoft 365 Developer Program](/office/developer-program/microsoft-365-developer-program).

## Create and publish documentation

### Provide app documentation for your site

Ease of adoption is an important factor for those that make decisions about enterprise software. Documentation that is clear and easy to follow helps your users adopt technology and it reduces support costs.

Create documentation that includes the following information at minimum:

- An introduction to your SSO functionality
    - Protocols
    - Version and SKU
    - List of supported identity providers with documentation links
- Licensing information for your application
- Role-based access control for configuring SSO
- SSO Configuration Steps
    - UI configuration elements for SAML with expected values from the provider
    - Service provider information to be passed to identity providers
- If you use OIDC/OAuth, a list of permissions required for consent, with business justifications
- Testing steps for pilot users
- Troubleshooting information, including error codes and messages
- Support mechanisms for users
- Details about your SCIM endpoint, including supported resources and attributes

### App documentation on the Microsoft site

When your SAML application is added to the gallery, documentation is created that explains the step-by-step process. For an example, see [Tutorials for integrating SaaS applications with Microsoft Entra ID](../saas-apps/tutorial-list.md). This documentation is created based on your submission to the gallery. You can easily update the documentation if you make changes to your application by using your GitHub account.

For OIDC application, there is no application specific documentation, we have only the generic [tutorial](../develop/v2-protocols-oidc.md) for all the OpenID Connect applications.

## Submit your application

After you've tested that your application works with Microsoft Entra ID, submit your application request in the [Microsoft Application Network portal](https://microsoft.sharepoint.com/teams/apponboarding/Apps). The first time you try to sign in to the portal you're presented with one of two screens.

- If you receive the message "That didn't work", then you need to contact the [Microsoft Entra SSO Integration Team](mailto:SaaSApplicationIntegrations@service.microsoft.com). Provide the email account that you want to use for submitting the request. A business email address such as `name@yourbusiness.com` is preferred. The Microsoft Entra team then adds the account in the Microsoft Application Network portal.
- If you see a "Request Access" page, then fill in the business justification and select **Request Access**.

After your account is added, you can sign in to the Microsoft Application Network portal and submit the request by selecting the **Submit Request (ISV)** tile on the home page. If you see the "Your sign-in was blocked" error while logging in, see [Troubleshoot sign-in to the Microsoft Application Network portal](troubleshoot-app-publishing.md).

### Implementation-specific options

On the application **Registration** form, select the feature that you want to enable. Select **OpenID Connect & OAuth 2.0**, **SAML 2.0/WS-Fed**, or **Password SSO(UserName & Password)** depending on the feature that your application supports.

If you're implementing a [SCIM](../app-provisioning/use-scim-to-provision-users-and-groups.md) 2.0 endpoint for user provisioning, select **User Provisioning (SCIM 2.0)**. Download the schema to provide in the onboarding request. For more information, see [Export provisioning configuration and roll back to a known good state](../app-provisioning/export-import-provisioning-configuration.md). The schema that you configured is used when testing the non-gallery application to build the gallery application.

If you wish to register an MDM application in the Microsoft Entra application gallery, select **Register an MDM app**.

You can track application requests by customer name at the Microsoft Application Network portal. For more information, see [Application requests by Customers](https://microsoft.sharepoint.com/teams/apponboarding/Apps/SitePages/AppRequestsByCustomers.aspx).

### Timelines

Listing an **SAML 2.0 or WS-Fed application** in the gallery takes 12 to 15 business days.

:::image type="content" source="./media/howto-app-gallery-listing/timeline.png" alt-text="Screenshot that shows the timeline for listing a SAML application.":::

Listing an **OpenID Connect application** in the gallery takes 7 to 10 business days.

:::image type="content" source="./media/howto-app-gallery-listing/timeline-2.png" alt-text="Screenshot that shows the timeline for listing an OpenID Connect application.":::

Listing an **SCIM provisioning application** in the gallery varies, depending on numerous factors.

Not all applications are onboarded. Per the terms and conditions, a decision can be made not to list an application. Onboarding applications is at the sole discretion of the onboarding team.

Here's the flow of customer-requested applications.

:::image type="content" source="./media/howto-app-gallery-listing/customer-request-2.png" alt-text="Screenshot that shows the customer-requested apps flow.":::

To escalate issues of any kind, send an email to the [Microsoft Entra SSO Integration Team](mailto:SaaSApplicationIntegrations@service.microsoft.com). A response is typically sent as soon as possible.

## Update or Remove the application from the Gallery

You can submit your application update request in the [Microsoft Application Network portal](https://microsoft.sharepoint.com/teams/apponboarding/Apps). The first time you try to sign into the portal you're presented with one of two screens. 

- If you receive the message "That didn't work", then you need to contact the [Microsoft Entra SSO Integration Team](mailto:SaaSApplicationIntegrations@service.microsoft.com). Provide the email account that you want to use for submitting the request. A business email address such as `name@yourbusiness.com` is preferred. The Microsoft Entra team then adds the account in the Microsoft Application Network portal.

- If you see a "Request Access" page, then fill in the business justification and select **Request Access**.

After the account is added, you can sign in to the Microsoft Application Network portal and submit the request by selecting the **Submit Request (ISV)** tile on the home page and select **Update my application’s listing in the gallery** and select one of the following options as per your choice -

* If you want to update applications SSO feature, select **Update my application’s Federated SSO feature**.

* If you want to update Password SSO feature, select **Update my application’s Password SSO feature**.

* If you want to upgrade your listing from Password SSO to Federated SSO, select **Upgrade my application from Password SSO to Federated SSO**.

* If you want to update MDM listing, select **Update my MDM app**.

* If you want to improve User Provisioning feature, select **Improve my application’s User Provisioning feature**.

* If you want to remove the application from Microsoft Entra application gallery, select **Remove my application listing from the gallery**.

If you see the **Your sign-in was blocked** error while logging in, see [Troubleshoot sign-in to the Microsoft Application Network portal](troubleshoot-app-publishing.md).



## Join the Microsoft partner network

The Microsoft Partner Network provides instant access to exclusive programs, tools, connections, and resources. To join the network and create your go-to-market plan, see [Reach commercial customers](https://partner.microsoft.com/explore/commercial#gtm).

## Next steps

- Learn more about managing enterprise applications with [What is application management in Microsoft Entra ID?](what-is-application-management.md)
