---

title: Application Insights portal connectivity troubleshooting 
description: Troubleshooting steps for Application Insights portal connectivity issues
services: azure-monitor
ms.topic: conceptual
ms.date: 03/09/2022
ms.reviewer: vgorbenko

---

# “Error retrieving data” message on dashboard

This is a troubleshooting guide for the Application Insights portal when encountering connectivity errors similar to `Error retrieving data` or `Missing localization resource`.

  <img src="./media/\troubleshoot-portal-connectivity\troubleshoot-portal-connectivity.png" 
    alt="Graphical user interface, text, application, email Description automatically generated" />
    
## Troubleshooting

The source of the issue is likely browser plugins that interfere with the portal's connectivity. 

To confirm that this is the source of the issue and to identify which plugin is interfering:

1. Open the portal in an incognito browser and verify that the site functions correctly.

2. Attempt disabling plugins to identify the one that is causing the connectivity issue.
