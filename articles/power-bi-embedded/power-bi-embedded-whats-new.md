<properties
   pageTitle="What's new in Power BI Embedded"
   description="Get the latest info on what's new in Power BI Embedded"
   services="power-bi-embedded"
   documentationCenter=""
   authors="minewiskan"
   manager="mblythe"
   editor=""
   tags=""/>
<tags
   ms.service="power-bi-embedded"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="powerbi"
   ms.date="07/06/2016"
   ms.author="owend"/>

# What's new in Power BI Embedded

Updates to **Power BI Embedded** are released on a regular basis. However, not every release includes new user-facing features; some releases are focused on back-end service capabilities. We’ll highlight new user-facing capabilities here. Be sure to check back often.

## July 11th, 2016

Included in this release:

-    **Great news!** The Power BI Embedded service is no longer in preview - it’s now GA (generally available).  
-    All REST APIs have moved from **/beta** to **/v1.0**.
-    .NET and JavaScript SDKs has been updated for **v1.0**.
-    Power BI API calls can now be authenticated directly by using API keys. App tokens are only needed for embedding. As part of this, provision and dev tokens have been deprecated in v1.0 APIs, but they’ll continue to work in the beta version until 12/30/2016. To learn more, see [Authenticating and Authorizing with Power BI Embedded](power-bi-embedded-app-token-flow.md).
-    Row level security (RLS) support for app tokens and embedded reports. To learn more, see [Row level security with Power BI Embedded](power-bi-embedded-rls.md).
-    Updated sample application for all **v1.0** API calls.
-    Power BI Embedded support for Azure SDK, PowerShell and CLI.
-    Users can export visualization data to a **.csv**.
-    Power BI Embedded is now supported in all the same languages/locales as Microsoft Azure. To learn more, see  [Azure - Languages](http://social.technet.microsoft.com/wiki/contents/articles/4234.windows-azure-extent-of-localization.aspx).
