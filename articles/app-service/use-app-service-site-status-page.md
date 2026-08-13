---
title: Use the App Service site status page
description: Learn how to use the App Service site status page to understand app runtime state, troubleshoot startup and availability issues, and decide when to use other monitoring or support tools.
ms.topic: how-to
ms.date: 07/27/2026
author: msangapu-msft
ms.author: msangapu
ms.service: azure-app-service
---

# Use the App Service site status page

The App Service site status page helps you understand the current runtime state of your **App Service for Linux** app and quickly identify platform-reported issues. Use this page when you need a fast status check for startup, availability, or restart-related problems. Site status reflects the platform's view of your app's runtime state and isn't a substitute for end-to-end health monitoring. For instance-level traffic management, use [Health check](monitor-instances-health-check.md). For broader Azure service or regional incidents, check [Azure Service Health](/azure/service-health/service-health-overview).

Site status is most useful during active troubleshooting. It helps you answer questions such as whether the app is still starting, whether an instance is blocked, or whether the platform detected an issue.

## What the site status page shows

The site status page provides:

- The current runtime state for your app.
- A platform-reported issue indicator when App Service detects a startup or runtime problem.
- Per-instance status details for scaled-out apps, so you can identify whether the issue affects all instances or only some.

## When to use the site status page

Use the site status page when:

- Your app isn't starting as expected.
- Your app is intermittently unavailable and you need to confirm the current platform state.
- You're validating whether a recent configuration or deployment change triggered an app recycle or restart.
- You want quick status context before deeper diagnostics or opening a support request.

## Open the site status page

1. In the [Azure portal](https://portal.azure.com), go to your App Service app.
1. In the left menu, select **Properties**.
1. Under **Site status**, review the current state and any detected issue details.

## Site status states

The following states can appear in site status:

| State | Meaning |
|---|---|
| **Starting** | The app is initializing and not yet ready to serve traffic. |
| **Started** | The app is running and able to serve traffic. |
| **Stopping** | The app is shutting down. |
| **Stopped** | The app isn't running. |
| **Updating** | The app is recycling to apply changes. |
| **Blocked** | App start attempts failed repeatedly, and startup is temporarily blocked. |
| **Unknown** | App Service couldn't determine state, typically because of a temporary platform communication issue. |
| **Issues detected** | App Service detected a runtime or startup problem and provides additional details. |

> [!NOTE]
> An **Unknown** state usually indicates a transient platform communication issue and resolves on its own. If the state persists, use [App Service diagnostics](overview-diagnostics.md) for guided troubleshooting.

## View issue details

When the site status shows **Issues detected**, open the detailed view to get more information about the problem. The detailed view includes:

- **Current status**: The current runtime state of the app.
- **Last error**: A description of the most recent error detected by the platform.
- **Last error details**: Additional context about the error, such as the affected component or configuration.
- **Last occurrence**: The timestamp of the most recent error.
- **Repair actions**: Available troubleshooting or remediation steps, such as guidance for resolving a storage mount failure.

Use this information to quickly understand what went wrong and whether a repair action is available before escalating to deeper diagnostics or support.

## Site status and health check

Both site status and health check are useful for understanding and improving the reliability of App Service apps, but they serve different purposes.

**Site status** helps you understand the current runtime state of your app. It provides platform-defined status values and detailed error information to help troubleshoot startup, runtime, and configuration-related issues.

**Health check** helps determine whether an instance should continue receiving traffic. It pings a customer-configured endpoint and uses the HTTP response to identify unhealthy instances, reroute traffic, and replace instances when needed. For more information, see [Monitor App Service instances by using Health check](monitor-instances-health-check.md).

| | Health Check | Site Status |
|---|---|---|
| **How it works** | Pings a customer-configured endpoint. | Uses platform-side runtime checks. |
| **What it reports** | The HTTP status returned by your configured endpoint. | A platform-defined runtime status for the app. |
| **Primary purpose** | Helps determine whether an instance should receive traffic. | Helps explain the current runtime state of the app. |
| **Configuration required** | Requires a health check path to be configured. | Doesn't require a customer-configured health endpoint. |

## How site status relates to other experiences

Use site status together with other App Service and Azure experiences:

- **App Service diagnostics**: Guided troubleshooting workflows and deeper analysis across availability, configuration, and performance. For more information, see [Diagnostics in Azure App Service](overview-diagnostics.md).
- **Azure Monitor**: Metrics, logs, and alerting for ongoing observability. For more information, see [Monitor Azure App Service](monitor-app-service.md).
- **Azure Service Health**: Service-level or regional incidents that can affect multiple resources. For more information, see [Azure Service Health](/azure/service-health/service-health-overview).

If the site status page indicates an issue and self-service diagnostics don't resolve it, open a support request. For more information, see [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

## Related content

- [Monitor Azure App Service](monitor-app-service.md)
- [Diagnostics in Azure App Service](overview-diagnostics.md)
- [Monitor App Service instances by using Health check](monitor-instances-health-check.md)
