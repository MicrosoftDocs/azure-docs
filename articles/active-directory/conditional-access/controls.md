---
title: Custom controls in Azure AD Conditional Access
description: Learn how custom controls in Azure Active Directory Conditional Access work.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: article
ms.date: 02/25/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

ms.collection: M365-identity-device-management
---
# Custom controls (preview)

Custom controls are a capability of the Azure Active Directory Premium P1 edition. When using custom controls, your users are redirected to a compatible service to satisfy further requirements outside of Azure Active Directory. To satisfy this control, a user’s browser is redirected to the external service, performs any required authentication or validation activities, and is then redirected back to Azure Active Directory. Azure Active Directory verifies the response and, if the user was successfully authenticated or validated, the user continues in the Conditional Access flow.

These controls allow the use of certain external or custom services as Conditional Access controls, and generally extend the capabilities of Conditional Access.

Providers currently offering a compatible service include:

- [Duo Security](https://duo.com/docs/azure-ca)
- [Entrust Datacard](https://www.entrustdatacard.com/products/authentication/intellitrust)
- [GSMA](https://mobileconnect.io/azure/)
- [Ping Identity](https://documentation.pingidentity.com/pingid/pingidAdminGuide/index.shtml#pid_c_AzureADIntegration.html)
- [RSA](https://community.rsa.com/docs/DOC-81278)
- [SecureAuth](https://docs.secureauth.com/pages/viewpage.action?pageId=47238992#)
- [Silverfort](https://www.silverfort.io/company/using-silverfort-mfa-with-azure-active-directory/)
- [Symantec VIP](https://help.symantec.com/home/VIP_Integrate_with_Azure_AD)
- [Thales (Gemalto)](https://resources.eu.safenetid.com/help/AzureMFA/Azure_Help/Index.htm)
- [Trusona](https://www.trusona.com/docs/azure-ad-integration-guide)

For more information on those services, contact the providers directly.

## Creating custom controls

To create a custom control, you should first contact the provider that you wish to utilize. Each non-Microsoft provider has its own process and requirements to sign up, subscribe, or otherwise become a part of the service, and to indicate that you wish to integrate with Conditional Access. At that point, the provider will provide you with a block of data in JSON format. This data allows the provider and Conditional Access to work together for your tenant, creates the new control and defines how Conditional Access can tell if your users have successfully performed verification with the provider.

Custom controls cannot be used with Identity Protection's automation requiring multi-factor authentication or to elevate roles in Privileged Identity Manager (PIM).

Copy the JSON data and then paste it into the related textbox. Do not make any changes to the JSON unless you explicitly understand the change you’re making. Making any change could break the connection between the provider and Microsoft and potentially lock you and your users out of your accounts.

The option to create a custom control is in the **Manage** section of the **Conditional Access** page.

![Control](./media/controls/82.png)

Clicking **New custom control**, opens a blade with a textbox for the JSON data of your control.  

![Control](./media/controls/81.png)

## Deleting custom controls

To delete a custom control, you must first ensure that it isn’t being used in any Conditional Access policy. Once complete:

1. Go to the Custom controls list
1. Click …  
1. Select **Delete**.

## Editing custom controls

To edit a custom control, you must delete the current control and create a new control with the updated information.

## Session controls

Session controls enable limited experience within a cloud app. The session controls are enforced by cloud apps and rely on additional information provided by Azure AD to the app about the session.

![Control](./media/controls/31.png)

### Use app enforced restrictions

You can use this control to require Azure AD to pass device information to the selected cloud apps. The device information enables the cloud apps to know whether a connection is initiated from a compliant or domain-joined device. This control only supports SharePoint Online and Exchange Online as selected cloud apps. When selected, the cloud app uses the device information to provide users, depending on the device state, with a limited or full experience.

To learn more, see:

- [Enabling limited access with SharePoint Online](https://aka.ms/spolimitedaccessdocs)
- [Enabling limited access with Exchange Online](https://aka.ms/owalimitedaccess)

## Next steps

- If you want to know how to configure a Conditional Access policy, see [Require MFA for specific apps with Azure Active Directory Conditional Access](app-based-mfa.md).
- If you are ready to configure Conditional Access policies for your environment, see the [best practices for Conditional Access in Azure Active Directory](best-practices.md).
