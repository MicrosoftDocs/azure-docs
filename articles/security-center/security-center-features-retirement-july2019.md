---
title: Retirement of Security Center features (July 2019) | Microsoft Docs
description: This article details features in Security Center that will be retired on July 31st, 2019.
services: security-center
author: yoavfrancis

ms.service: security-center
ms.devlang: na
ms.topic: article
ms.date: 4/16/2019
ms.author: yoafr
---

# Retirement of Security Center features (July 2019)

We have made several [improvements](https://azure.microsoft.com/updates/?product=security-center) to the Azure Security Center over the last 6 months.  
With the improved capabilities we are removing a number of redundant features, as well as related APIs, from the Security Center on July 31, 2019.  

Most of the retired features can be replaced with new features in Azure Security Center or Log Analytics; and a few features can be implemented using [Azure Sentinel (preview)](https://azure.microsoft.com/services/azure-sentinel/), recently announced.

The list of features being retired from the Security Center includes:

- [Events dashboard](#menu_events)
- [Search menu entry](#menu_search)
- [View classic Identity & Access link on Identity and access (preview)](#menu_classicidentity)
- [Security events map button on Security alerts map (preview)](#menu_securityeventsmap)
- [Custom alert rules (preview)](#menu_customalerts)
- [Investigate button in threat protection security alerts](#menu_investigate)
- [A subset of Security solutions](#menu_solutions)
- [Edit security configurations for Security policies](#menu_securityconfigurations)
- [Security & audit dashboard (originally used in OMS portal) for Log Analytics workspaces.](#menu_securityomsdashboard)

The below provides detailed information for each retired feature and the steps you can take using the replacement features.

## Events dashboard<a name="menu_events"></a>
Security Center uses the Microsoft Monitoring Agent to collect various security related configurations and events from your machines and stores these events in your workspace(s). The [Events dashboard](https://docs.microsoft.com/azure/security-center/security-center-events-dashboard) allows viewing this data, and essentially provides another entry point to Log Analytics.

Going forward the events dashboard will be retired:

![Events workspace selection screen][1]

The events dashboard that appears once a user clicks on a workspace, will also be retired:

![Events dashboard][2]

### Events dashboard - New experience

Customers are encouraged to use Log Analytics’ native capabilities to view notable events on their workspace(s).
If you have already created custom notable events from Security Center, these will be accessible via Log analytics -> select workspace -> Saved Searches. Your data will not be lost nor modified. Native Notable events are also available from the same screen.

![Workspace saved searches][3]

## Search menu entry<a name="menu_search"></a>
Azure Security Center currently uses Azure Monitor logs search to retrieve and analyze your security data. This screen essentially serves as a façade to Log Analytics “[Search](https://docs.microsoft.com/azure/security-center/security-center-search)” page – allowing users to run Search queries on their selected workspace. Going forward this search window will be retired:

![Search page][4]

### Search menu entry - New experience

Customers are encouraged to use **Log Analytics** native capabilities to perform Search queries on their workspaces. To do so, they can go to Log analytics in Azure, and select: “Logs”:

![Log Analytics logs page][5]

## Classic Identity & Access (Preview)<a name="menu_classicidentity"></a>
The “Classic” identity & access experience in Security Center had provided a way for customers to view their Identity & access related information in log analytics. This was done by following the clicks below:

Click on “View classic Identity & Access”

![Identity page][6]

Along with the screen this page would open, “Identity and access dashboard”:

![Identity page - workspace selection][7]

A click on the workspace opens the “Identity and access” log analytics dashboard where customers can view identity & access information on their workspace:

![Identity page - dashboard][8]

Going forward all the three screens above will be retired. Your data will remain available in the log analytics security solution and will not be modified or removed.

### Classic Identity & Access (Preview) - New experience
While the Log analytics dashboard has provided insights on a given workspace only, the native Security Center capabilities provide visibility into all subscriptions and all workspaces associated with them, in an easy-to use view that lets you focus on what’s important, according to the secure score of your Identity & access recommendation(s).
All the features of the identity and access Log analytics dashboard can be reached by selecting “Identity & access (Preview)” within Security Center:

![Identity page - classic experience retirement][9]

## Security events map<a name="menu_securityeventsmap"></a>
Security Center provides you with a [map](https://docs.microsoft.com/azure/security-center/security-center-threat-intel) that helps you identify security threats against the environment. The ‘Go to security events map’ button in that map leads to a dashboard that allows to view raw security events on the selected workspace.
The button, along with the per-workspace dashboard, will be removed after deprecation.

![Security alerts map - button][10]

Today when you click on “Go to security events map” the Threat intelligence dashboard is opened. The threat intelligence dashboard will be retired.  

![Threat intelligence dashboard][11]

When you choose a workspace to view its threat intelligence dashboard, the security alerts map(Preview) screen *in Log Analytics* is opened. This screen will be retired.

![Security alerts map in Log Analytics][12]

Your existing data will remain available in the log analytics security solution and will not be modified nor removed.

### Security events map - New experience
We encourage our customers to use the alerts map functionality built into Security Center - “Security alerts map (Preview)”. This provides an optimized experience and works across all subscriptions and associated workspaces, allowing a macro view across your environment, and not focus on a single workspace.

## Custom alert rules (Preview)<a name="menu_customalerts"></a>
The custom alerts experience will be [retired](https://docs.microsoft.com/azure/security-center/security-center-custom-alert) June 30th, 2019, due to retirement of the underlying infrastructure it is built on. In the timeframe until deprecation, users will be able to edit existing custom alert rules but will not be able to add new ones. Users are advised to enable [Azure Sentinel](https://azure.microsoft.com/services/azure-sentinel/) with one-click onboarding to automatically migrate their existing alerts and create new ones, or alternatively re-create their alerts with Azure Monitor log alerts.

To keep your existing alerts and migrate them to Azure Sentinel, please launch Azure Sentinel. As first step, select the workspace where your custom alerts are stored, and then select the ‘Analytics’ menu item to automatically migrate your alerts.

![Custom alerts][13]

Customers not interested in onboarding to Azure Sentinel are encouraged to re-create their alerts with Azure Monitor log alerts. For instructions, please see: [Create, view, and manage log alerts using Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-log). For instructions on how to create log alerts, please see: [Log alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-unified-log).

For more information on custom alerts retirement, please see the [Security Center custom alerts documentation](https://docs.microsoft.com/azure/security-center/security-center-custom-alert).

## Security alerts investigation<a name="menu_investigate"></a>
[The Investigation feature](https://docs.microsoft.com/azure/security-center/security-center-investigation) in Security Center allows you to triage, understand the scope, and track down the root cause of a potential security incident. This feature will be removed from Security Center as it has been replaced with an improved experience in [Azure Sentinel](https://azure.microsoft.com/services/azure-sentinel/).

![Security incident][14]

When you click on the “Investigate” button above, the “Investigation Dashboard (Preview)” in Log Analytics opens. The Investigation Dashboard will be retired.  
Your existing data will remain available in the Log Analytics security solution and will not be modified nor removed.

![Investigation dashboard in Log Analytics][15]

### Investigation - New experience

We encourage our customers to onboard [Azure Sentinel](https://azure.microsoft.com/services/azure-sentinel/) for a rich investigation experience, powered by the alerts hunting feature. Azure Sentinel provides powerful hunting search and query tools to hunt for security threats across your organization’s data sources.  

## Subset of Security solutions<a name="menu_solutions"></a>

Security Center has the ability to enable [integrated security solutions in Azure](https://docs.microsoft.com/azure/security-center/security-center-partner-integration). The following partner solutions would be removed, and supported in [Azure Sentinel](https://azure.microsoft.com/services/azure-sentinel/), along with even more data sources.

- Next generation firewall and Web application Firewall solutions (Azure Sentinel [Documentation](https://docs.microsoft.com/azure/sentinel/connect-data-sources))
- Integration of security solutions that support the Common event format (CEF) (Azure Sentinel [Documentation](https://docs.microsoft.com/azure/sentinel/connect-common-event-format))
- Microsoft Advanced Threat Analytics (Azure Sentinel [Documentation](https://docs.microsoft.com/azure/sentinel/connect-azure-atp))
- Azure AD Identity Protection (Azure Sentinel [Documentation](https://docs.microsoft.com/azure/sentinel/connect-azure-ad-identity-protection))

Following the deprecation, users will not be able to add new or modify existing connected solutions of the types mentioned above, from both the UI and the API.
The existing connected solutions are encouraged to move to Azure Sentinel by the end of this period.

![Security centers solutions][16]

## Edit security configurations for Security policies<a name="menu_securityconfigurations"></a>
Azure Security Center monitors security configurations by applying a set of [over 150 recommended rules](https://gallery.technet.microsoft.com/Azure-Security-Center-a789e335) for hardening the OS, including rules related to firewalls, auditing, password policies, and more. If a machine is found to have a vulnerable configuration, Security Center generates a security recommendation. The [Edit security configuration screen](https://docs.microsoft.com/azure/security-center/security-center-customize-os-security-config) allows customers to customize the default OS security configuration in Security Center.

This feature has been in preview and will be retired.

![Edit security configurations][17]

### Edit security configurations - New experience

Security Center will support the [in-guest agent](https://docs.microsoft.com/azure/governance/policy/concepts/guest-configuration) in the near future, allowing a much richer feature set - including support for additional operating systems and integration with guest configuration with Azure policies (in-guest policies). This will also provide the ability to control at scale and apply on new resources automatically.

## Security & audit dashboard (originally used in OMS portal) for Log Analytics workspaces<a name="menu_securityomsdashboard"></a>

The Security dashboard in Log analytics provides a per-workspace overview of notable security events and threats, a threat intelligence map, and Identity & access assessment of security events saved in the workspace. The dashboard will be removed going forward. As we already recommended in the dashboard UI, our users are advised to use Azure Security Center going forward.

![Log analytics security dashboard][18]

### Security & audit dashboard - New experience
Our customers are advised to use Azure Security Center, which provides the same security overview across multiple subscriptions and workspaces associated with them, along with a richer feature set.

## Next steps
- Learn more about [Azure Security Center](https://docs.microsoft.com/azure/security-center/)
- Learn more about [Azure Sentinel](https://docs.microsoft.com/azure/sentinel)

<!--Image references - events-->
[1]: ./media/security-center-features-retirement-july2019/asc_events_dashboard.png
[2]: ./media/security-center-features-retirement-july2019/asc_events_dashboard_inner.png
[3]: ./media/security-center-features-retirement-july2019/workspace_saved_searches.png
<!--Image references - search-->
[4]: ./media/security-center-features-retirement-july2019/asc_search.png
[5]: ./media/security-center-features-retirement-july2019/workspace_logs.png
<!--Image references - classic identity and access-->
[6]: ./media/security-center-features-retirement-july2019/asc_identity.png
[7]: ./media/security-center-features-retirement-july2019/asc_identity_workspace_selection.png
[8]: ./media/security-center-features-retirement-july2019/loganalytics_dashboard_identity.png
[9]: ./media/security-center-features-retirement-july2019/asc_identity_nobuttonhighlight.png
<!--Image references - alerts map-->
[10]: ./media/security-center-features-retirement-july2019/asc_security_alerts_map.png
[11]: ./media/security-center-features-retirement-july2019/asc_threat_intellignece_dashboard.png
[12]: ./media/security-center-features-retirement-july2019/loganalytics_security_alerts_map.png
<!--Image references - custom alerts-->
[13]: ./media/security-center-features-retirement-july2019/asc_custom_alerts.png
<!--Image references - Investigation-->
[14]: ./media/security-center-features-retirement-july2019/asc-security-incident.png
[15]: ./media/security-center-features-retirement-july2019/loganalytics_investigation_dashboard.png
<!--Image references - Solutions-->
[16]: ./media/security-center-features-retirement-july2019/asc_security_solutions.png
<!--Image references - Edit security configurations-->
[17]: ./media/security-center-features-retirement-july2019/asc_edit_security_configurations.png
<!--Image references - Security dashboard in log analytics-->
[18]: ./media/security-center-features-retirement-july2019/loganalytics_security_dashboard.png
