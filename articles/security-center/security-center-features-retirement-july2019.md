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

We've made several [improvements](https://azure.microsoft.com/updates/?product=security-center) to Azure Security Center over the last six months.
With these improved capabilities, we're removing some redundant features and related APIs from Security Center on July 31, 2019.  

Most of these retiring features can be replaced with new functionality in Azure Security Center or Azure Log Analytics. In addition, a few features can be implemented using [Azure Sentinel (preview)](https://azure.microsoft.com/services/azure-sentinel/).

Security Center features to be retired include:

- [Events dashboard](#menu_events)
- [Search menu entry](#menu_search)
- [View classic Identity & Access link on Identity and access (preview)](#menu_classicidentity)
- [Security events map button on Security alerts map (preview)](#menu_securityeventsmap)
- [Custom alert rules (preview)](#menu_customalerts)
- [Investigate button in threat protection security alerts](#menu_investigate)
- [A subset of Security solutions](#menu_solutions)
- [Edit security configurations for Security policies](#menu_securityconfigurations)
- [Security & audit dashboard (originally used in OMS portal) for Log Analytics workspaces.](#menu_securityomsdashboard)

This article provides detailed information for each retired feature and the steps you can take to implement replacement features.

## Events dashboard<a name="menu_events"></a>

Security Center uses Microsoft Monitoring Agent to collect various security related configurations and events from your machines. It stores these events in your workspace(s). The [events dashboard](https://docs.microsoft.com/azure/security-center/security-center-events-dashboard) lets you view this data and  gives you an entry point to Log Analytics.

We are retiring the events dashboard:

![Events workspace selection screen][1]

We are also retiring the events dashboard that appears when you select a workspace:

![Events dashboard][2]

### Events dashboard - the new experience

We encouraged you to use the native capabilities of Azure Log Analytics to view notable events on your workspace(s).

If you've created custom notable events in Security Center, these will be accessible. Go to **Log Analytics** > **Select workspace** > **Saved Searches**. Your data won't be lost or modified. Native notable events are also available from the same screen.

![Workspace saved searches][3]

## Search menu entry<a name="menu_search"></a>

Azure Security Center currently uses Azure Monitor logs search to retrieve and analyze your security data. This screen serves as a window to Log Analytics search page, and enables users to run search queries on their selected workspace. For more information, see [Azure Security Center search](https://docs.microsoft.com/azure/security-center/security-center-search). We are retiring this search window:

![Search page][4]

### Search menu entry - the new experience

We encourage you to use the Azure Log Analytics native capabilities to perform search queries on your workspaces. Go to **Log Analytics** in Azure and select **Logs**.

![Log Analytics logs page][5]

## Classic Identity & Access (Preview)<a name="menu_classicidentity"></a>

The Classic Identity & Access experience in Security Center currently shows a dashboard of identity and access information in Log Analytics. To view this dashboard:

1. Select **View classic Identity & Access**.

   ![Identity page][6]

1. View the **Identity & Access dashboard**.

    ![Identity page - workspace selection][7]

1. Select a workspace to open the **Identity & Access log analytics dashboard** to view identity and access information on your workspace.

   ![Identity page - dashboard][8]

We are retiring all three screens shown in the preceding steps. Your data will remain available in the log analytics security solution and will not be modified or removed.

### Classic Identity & Access (Preview) - the new experience

The log analytics dashboard has shown insights on a single workspace. However, native Security Center capabilities provide visibility into all subscriptions and all workspaces associated with them. You can access an easy-to use view that lets you focus on what’s important with recommendations ranked according to their secure score.

All the features of the Identity & Access log analytics dashboard can be reached by selecting **Identity & access (Preview)** within Security Center.

![Identity page - classic experience retirement][9]

## Security events map<a name="menu_securityeventsmap"></a>

Security Center provides you with a [security alerts map](https://docs.microsoft.com/azure/security-center/security-center-threat-intel) to help identify security threats. The **Go to security events map** button in that map opens a dashboard that allows you to view raw security events on the selected workspace.

We are removing the **Go to security events map** button and the per-workspace dashboard.

![Security alerts map - button][10]

When you select the **Go to security events map** button, you open the threat intelligence dashboard. We are retiring the threat intelligence dashboard.  

![Threat intelligence dashboard][11]

When you choose a workspace to view its threat intelligence dashboard, you open the security alerts map (preview) screen in **Log Analytics**. We are retiring this screen.

![Security alerts map in Log Analytics][12]

Your existing data will remain available in the Log Analytics security solution and will not be modified nor removed.

### Security events map - the new experience

We encourage you to use the alerts map functionality built into Security Center: **Security alerts map (Preview)**. This functionality provides an optimized experience and works across all subscriptions and associated workspaces. It gives you a high-level view across your environment and isn't focused on a single workspace.

## Custom alert rules (Preview)<a name="menu_customalerts"></a>

We are [retiring the custom alerts experience](https://docs.microsoft.com/azure/security-center/security-center-custom-alert) on June 30th, 2019 because of the retirement of its underlying infrastructure. Until then, you'll be able to edit existing custom alert rules, but won't be able to add new ones. We recommend that you enable [Azure Sentinel](https://azure.microsoft.com/services/azure-sentinel/) to automatically migrate your existing alerts and create new ones. Alternatively, you can set up your alerts with Azure Monitor log alerts.

To keep your existing alerts and migrate them to Azure Sentinel:

1. Open Azure Sentinel and select the workspace where your custom alerts are stored.
1. Select **Analytics** from the menu to automatically migrate your alerts.

![Custom alerts][13]

If you're not interested in transitioning to Azure Sentinel, we encourage you to create your alerts with Azure Monitor log alerts. For instructions, see [Create, view, and manage log alerts by using Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-log) and [Log alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-unified-log).

For more information on custom alerts retirement, see the [Security Center custom alerts documentation](https://docs.microsoft.com/azure/security-center/security-center-custom-alert).

## Security alerts investigation<a name="menu_investigate"></a>

[The Investigation feature](https://docs.microsoft.com/azure/security-center/security-center-investigation) in Security Center allows you to triage, understand the scope, and track down the root cause of a potential security incident. We are removing this feature from Security Center because it has been replaced with an improved experience in [Azure Sentinel](https://azure.microsoft.com/services/azure-sentinel/).

![Security incident][14]

When you select the **Investigate** button from a **Security incident** screen, you open the **Investigation Dashboard (Preview)** in Log Analytics. We are retiring the Investigation Dashboard.  

Your existing data will remain available in the Log Analytics security solution and will not be modified nor removed.

![Investigation dashboard in Log Analytics][15]

### Investigation - the new experience

We encourage you to transition to [Azure Sentinel](https://azure.microsoft.com/services/azure-sentinel/) for a rich investigation experience. Azure Sentinel provides powerful search and query tools to hunt for security threats across your organization’s data sources.  

## Subset of security solutions<a name="menu_solutions"></a>

Security Center has the ability to enable [integrated security solutions in Azure](https://docs.microsoft.com/azure/security-center/security-center-partner-integration). We are retiring a the following partner solutions from Security Center. These solutions are enabled in [Azure Sentinel](https://azure.microsoft.com/services/azure-sentinel/) along with a number of additional data sources.

- [Next generation firewall and web application firewall solutions](https://docs.microsoft.com/azure/sentinel/connect-data-sources)
- [Integration of security solutions that support the Common Event Format (CEF)](https://docs.microsoft.com/azure/sentinel/connect-common-event-format)
- [Microsoft Advanced Threat Analytics](https://docs.microsoft.com/azure/sentinel/connect-azure-atp)
- [Azure AD Identity Protection](https://docs.microsoft.com/azure/sentinel/connect-azure-ad-identity-protection)

After retirement, you won't be able to add or modify any of solution types mentioned in the preceding list, either from the UI nor the API.

If you have existing connected solutions, we encourage you to move to Azure Sentinel before these are retired.

![Security centers solutions][16]

## Edit security configurations for security policies<a name="menu_securityconfigurations"></a>

Azure Security Center monitors security configurations by applying a set of [over 150 recommended rules](https://gallery.technet.microsoft.com/Azure-Security-Center-a789e335) for hardening the OS, including rules related to firewalls, auditing, password policies, and more. If a machine is found to have a vulnerable configuration, Security Center generates a security recommendation. The [Edit security configuration screen](https://docs.microsoft.com/azure/security-center/security-center-customize-os-security-config) allows customers to customize the default OS security configuration in Security Center.

This feature has been in preview and will be retired.

![Edit security configurations][17]

### Edit security configurations - the new experience

We intend to enable Security Center to support the [Guest configuration agent](https://docs.microsoft.com/azure/governance/policy/concepts/guest-configuration). Such an update will allow a much richer feature set, including support for additional operating systems and integration with guest configuration with Azure policies (in-guest policies). After these changes are enabled, you'll also have  the ability to control configurations at scale and apply them to new resources automatically.

## Security & audit dashboard for Log Analytics workspaces<a name="menu_securityomsdashboard"></a>

The **Security & audit dashboard** was originally used in the OMS portal. In Log analytics the dashboard provides a per-workspace overview of notable security events and threats, a threat intelligence map, and an identity-and-access assessment of security events saved in the workspace. We are removing the dashboard. As we already recommended in the dashboard UI, we advise you to use Azure Security Center going forward.

![Log analytics security dashboard][18]

### Security & audit dashboard - the new experience

We advise you to switch to Azure Security Center. It provides the same security overview across multiple subscriptions and the workspaces associated with them, plus a richer feature set.

You can get the original Log Analytics queries that populate the **Security & audit dashboard** in Security Center's [GitHub repository](https://github.com/Azure/Azure-Security-Center/tree/master/Legacy%20Log%20Analytics%20dashboards).

## Next steps

- Learn more about [Azure Security Center](https://docs.microsoft.com/azure/security-center/).
- Learn more about [Azure Sentinel](https://docs.microsoft.com/azure/sentinel).

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
