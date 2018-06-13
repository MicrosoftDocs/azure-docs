---
title: 'FAQ for the Azure Active Directory SSO plug-in | Microsoft Docs'
description: Get answers to frequently asked questions about configuring single sign-on between Azure Active Directory and Jira/Confluence.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 4b663047-7f88-443b-97bd-54224b232815
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/31/2018
ms.author: jeedes

---
# FAQ for the Azure Active Directory SSO plug-in

Please refer below FAQs if you have any query regarding this plug-in.

## What does the plug-in do?

The plug-in provides single sign-on (SSO) capability for Atlassian Jira (including Jira Core, Jira Software, Jira Service Desk) and Confluence on-premises software. The plug-in works with Azure Active Directory (Azure AD) as an identity provider (IdP).

## Which Atlassian products does the plug-in work with?

The plug-in works with on-premises versions of Jira and Confluence.

## Does the plug-in work on cloud versions?

No. The plug-in supports only on-premises versions of Jira and Confluence.

## Which versions of Jira and Confluence does the plug-in support?

The plug-in supports these versions:

* Jira Core and Software: 6.0 to 7.8
* Jira Service Desk: 3.0 to 3.2
* Confluence: 5.0 to 5.10

## Is the plug-in free or paid?

It's a free add-on.

## Do I need to restart Jira or Confluence after I deploy the plug-in?

A restart is not required. You can start using the plug-in immediately.

## How do I get support for the plug-in?

You can reach out to the [Azure AD SSO Integration Team](<mailto:SaaSApplicationIntegrations@service.microsoft.com>) for any support needed for this plug-in. The team responds in 24-48 business hours.

You can also raise a support ticket with Microsoft through the Azure portal channel.

## Would the plug-in work on a Mac or Ubuntu installation of Jira and Confluence?

We have tested the plug-in only on 64-bit Windows Server installations of Jira and Confluence.

## Does the plug-in work with IdPs other than Azure AD?

No. It works only with Azure AD.

## What version of SAML does the plug-in work with?

It works with SAML 2.0.

## Does the plug-in do user provisioning?

No. The plug-in provides only SAML 2.0-based SSO. The user has to be provisioned in the application before the SSO sign-in.

## Does the plug-in support cluster versions of Jira and Confluence?

No. The plug-in works with on-premises versions of Jira and Confluence.

## Does the plug-in work with HTTP versions of Jira and Confluence?

No. The plug-in works with HTTPS-enabled installations only.