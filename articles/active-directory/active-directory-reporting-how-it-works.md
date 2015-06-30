<properties
   pageTitle="Azure AD Reporting: How it works"
   description="Azure AD Reporting: How it works"
   services="active-directory"
   documentationCenter=""
   authors="kenhoff"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="06/03/2015"
   ms.author="kenhoff"/>

# Azure AD Reporting: How it works

[AZURE.INCLUDE [active-directory-reporting-content-journey-selector](../../includes/active-directory-reporting-content-journey-selector.md)]

## Reporting pipeline

The reporting pipeline consists of three main steps. Every time a user signs in, or an authentication is made, the following happens:

- First, the user is authenticated (successfully or unsuccessfully), and the result is stored in the Azure Active Directory service databases.
- At regular intervals, all recent sign ins are processed. At this point, our security and anomalous activity algorithms are searching all recent sign ins for suspicious activity.
- After processing, the reports are written, cached, and served in the Azure Management Portal.

## Report generation times

Due to the large volume of authentications and sign ins processed by the Azure AD platform, the most recent sign ins processed are, on average, one hour old. In rare cases, it may take up to 8 hours to process the most recent sign ins.

You can find the most recent processed sign in by examining the help text at the top of each report.

![Help text at the top of each report][001]

> [AZURE.TIP] For more documentation on Azure AD Reporting, check out [View your access and usage reports](active-directory-view-access-usage-reports.md).

[001]: ./media/active-directory-reporting-how-it-works/reportingWatermark.PNG
