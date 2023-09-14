---
title: Use the application migration wizard to move AD FS apps to Azure Active Directory
description: The Active Directory Federation Services (AD FS) application activity report lets you quickly migrate applications from AD FS to Azure Active Directory (Azure AD). This migration tool for AD FS identifies compatibility with Azure AD and gives migration guidance.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 03/23/2023
ms.author: jomondi
ms.collection: M365-identity-device-management
ms.reviewer: alamaral
ms.custom: not-enterprise-apps
---

# How to Migrate Your AD FS Applications to Microsoft Entra ID for Authentication

The application migration wizard provides IT Admins guided experience to migrate relying party applications from ADFS to Azure AD. It provides one-click configuration for basic SAML URLs, claims mapping, and user assignments to integrate the application with Azure AD.

With the wizard, all Relying party application configurations are imported from the on-premises environment. The **Ready to migrate** on the wizard's home page renders applications that are ready to migrate along with relying party application usage statistics such as unique user count, successful sign-in and failed sign-ins count. You can use these statistics to prioritize application migrations.

The wizard only supports migration of SAML applications. OIDC (OpenID Connect) and WS-Fed configurations are not supported. For information on how to migrate other application types, see [Migrate applications to Azure Active Directory](../manage-apps/migrate-apps-to-aad.md).
 
## The Migration Process

Access the list of applications that you can migrate using the application migration wizard. The wizard displays only applications handling sign-in traffic within a specified time frame. The date range filter includes options for the last 1, 7, or 30 days. Inactive Relying Party Trusts that have not handled sign-in traffic in the last 30 days don't appear on the Application migration's dashboard.

It's important to test your apps and configuration during the process of moving authentication to Azure AD. We recommend using existing test environments or setting up a new one using Azure App Service or Azure Virtual Machines to ensure a smooth migration to the production environment.

The following table explains the three tabs available in the application migration wizard's home page.

| Tabs | Description |
| --- | --- |
| **All Apps** | Provides an application activity report for all SAML apps with sign-in activity. <br> Relying Party Trusts with yellow warning indicator and **Additional steps required** link are apps that require further configuration before migration. <br> Select the **additional steps required** button to analyze the blocking rules. Address the blocking rules on the on-premises side and wait for 24 hours for the AD FS Migration Insights job to re-evaluate the configurations. <br> If no blocking issues are found, the application's new migration status will be identified during the next iteration. If the status is **Ready**, you can migrate the application using the wizard.<br><br> Relying Party Trusts that satisfy all migration rules appear with a green **Ready** icon under **Next steps**. <br> Selecting the **Ready** button shows all rules that passed and provides a **Begin migration** button. The **Begin migration** button launches the migration wizard. |
| **Ready to Migrate** | Lists those applications that are ready to migrate. For these applications, there are supported configurations. <br> <br> You can prioritize application migrations by referencing each application’s usage statics, which lists **Unique user** count, **Successful sign-ins** and **Failed sign-ins** count. In addition, all relying party application configurations are imported from the on-premises environment. <br><br> Selecting **Begin migration** under **Next Steps** launches the migration wizard. You can't access the **Begin migration** button if there are not applications in the **Ready** state. |
| **Ready to Configure** | Lists all previously migrated applications. <br> Migrated applications will be editable in the Microsoft Entra admin center under **Enterprise applications** pane. <br><br>Selecting the **Configure application in Azure AD** button opens the **Single sign-on** pane of the newly created Azure AD Application. You can configure additional Single Sign-on properties from this pane. |

When you're ready to complete configurations of the migrated application, use available tutorials to integrate SaaS apps with Azure AD. See [Tutorial: Azure Active Directory single sign-on (SSO) integration with SaaS apps](../tutorials/tutorial-list-saas-apps.md) to find tutorials for your apps.
Publish a migration schedule and prioritize apps based on urgency to have a list of all applications ready for migration.

## Supported configurations:

The application migration wizard supports the following configurations:

- The option to customize the new Azure AD application name.
- SAML application configurations only.
- Identifier and reply url, which are used for single sign-on settings.
- User and group membership assignments configurations.
- Azure AD compatible claims configuration extracted from the Relying party claims configurations.

## Unsupported configurations:

The application migration wizard doesn't support the following configurations:

- OIDC (OpenID Connect) and WS-Fed configurations.
- Conditional access policies.
- The signing certificate won't be migrated from the relying party application.
- You can configure the unsupported configurations after the application is migrated.


## Migration wizard configurations
|Tabs| Description|
|---|---|
|**Summary** | Gives a summary of all the configurations that are mapped from the relying party trust. It offers a field for the application's Azure AD name |
| **Application Template**| This tab offers three options:<br> - Select the application template that best matches the application you're migrating. <br> - If the application template isn't listed, visit the Azure AD Gallery to add the template.<br> - If you don't find it in the Azure AD gallery, you can proceed to the next tab without selecting any of the templates. If you choose this option, migration proceeds with the default custom application template that Azure AD provides. |
| **User & groups**| Automatically maps the users and groups from the on-premises environment to the Azure AD environment. |
|**SAML configurations**| SAML configurations from the on-premises environment to the Azure AD environment. |
|**Claims**| Automatically maps the claims from the on-premises environment to the Azure AD environment. |
|**Configuration results** | shows other warnings that were identified. These warnings require action and attention once the application is migrated to the Azure AD tenant. |
|**Review + create**| |

## Troubleshooting

### Can't see all my AD FS applications in the report

 If you have installed Azure AD Connect health but you still see the prompt to install it or you don't see all your AD FS applications in the report it may be that you don't have active AD FS applications or your AD FS applications are microsoft application.

 The AD FS application activity report lists all the AD FS applications in your organization with active users sign-in in the last 30 days. Also, the report doesn't display microsoft related relying parties in AD FS such as Office 365. For example, relying parties with name 'urn:federation:MicrosoftOnline', 'microsoftonline', 'microsoft:winhello:cert:prov:server' won't show up in the list.


## Next steps

* [Video: How to use the AD FS activity report to migrate an application](https://www.youtube.com/watch?v=OThlTA239lU)
* [Managing applications with Azure Active Directory](what-is-application-management.md)
* [Manage access to apps](what-is-access-management.md)
* [Azure AD Connect federation](../hybrid/connect/how-to-connect-fed-whatis.md)
