---

title: Application Insights portal connectivity troubleshooting 
description: Troubleshooting guide for Application Insights portal connectivity issues
services: azure-monitor
ms.topic: conceptual
ms.date: 03/09/2022
ms.reviewer: vgorbenko

---

# "Error retrieving data" message on Application Insights portal 

This is a troubleshooting guide for the Application Insights portal when encountering connectivity errors similar to `Error retrieving data` or `Missing localization resource`.

![image Portal connectivity error](./media/troubleshoot-portal-connectivity/troubleshoot-portal-connectivity.png)

The source of the issue is likely third-party browser plugins that interfere with the portal's connectivity. 

To confirm that this is the source of the issue and to identify which plugin is interfering:

- Open the portal in an InPrivate or Incognito window and verify the site functions correctly.

- Attempt disabling plugins to identify the one that is causing the connectivity issue.
