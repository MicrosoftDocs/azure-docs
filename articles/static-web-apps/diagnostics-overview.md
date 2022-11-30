---
title: Diagnose and solve tool for Static Web Apps
description: Learn to troubleshoot issues with your Static Web App with the Diagnose and Solve tool in the Azure portal.
ms.date: 12/01/2022
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.author: cshoe
---

# Azure Static Web App diagnostics overview

If issues arise with your Static Web App, Static Web App diagnostics can help you diagnose what went wrong and guide you through troubleshooting steps. Diagnostics for your Static Web App are accessible directly from the Azure Portal, with no additional configuration needed.

Although these diagnostics are most helpful for issues that arose within 24 hours, all the diagnostic graphs are always available for you to analyze.

## Open Static Web App diagnostics

To access Static Web App diagnostics, navigate to your Static Web App in the [Azure portal](https://portal.azure.com). In the left navigation, click on **Diagnose and solve problems**.

In the Static Web App diagnostics homepage, you can perform a search for a symptom with your app, or choose a diagnostic category that best describes the issue with your app.

![Static Web App Diagnose and solve problems homepage with diagnostic search box and Troubleshooting categories for discovering diagnostics for the selected Azure Resource.](./media/diagnostics/static-web-app-diagnostics-overview.png)

## Diagnostic Interface

The Static Web App diagnostics page offers access to the following:

- **Search box**
- **Troubleshooting categories**

## Search box

The search box is a quick way to find a diagnostic. The same diagnostic can be found through Troubleshooting categories.

![Static Web App Diagnose and solve problems search box with a dropdown of Custom Authentication Information, Get Static Web App Custom Domain configuration, Get Static Web App Deployment Information.](./media/diagnostics/static-web-app-diagnostics-search.png)


## Troubleshooting categories

Troubleshooting categories group diagnostics for ease of discovery. The following are available:

- **Availability and Performance**
- **Configuration and Management**
- **Content Deployment**

![Static Web App Diagnose and solve problems Troubleshooting categories list displaying Availability and Performance, Configuration and Management, and Content Deployment.](./media/diagnostics/static-web-app-diagnostics-categories.png)

## Diagnostic report

After you choose to investigate the issue further by clicking on a topic, you can view more details about the topic often supplemented with graphs and markdowns. Diagnostic report can be a powerful tool for pinpointing the problem with your app. The following is the Configuration and Management overview:

![Static Web App Diagnose and solve problems Configuration and Management, which displays different configuration aspects of a Static Web App such as General Information, Application Configuration, Custom Authentication, Managed Identity, App Settings, and Custom Domains.](./media/diagnostics/static-web-app-diagnostics-report.png)