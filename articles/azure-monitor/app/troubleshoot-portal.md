---
title: Application Insights portal connectivity troubleshooting 
description: Troubleshooting steps for Application Insights portal connectivity issues
ms.date: 03/09/2022
---

# Application Insights Portal connectivity

This is a troubleshooting guide for the Application Insights portal when encountering connectivity errors similar to `Error retrieving data.
Try selecting another sample.` or `Missing localization resource`.

  <img src="./media/\troubleshoot-portal\troubleshoot-portal.png" style="width:10.64552in;height:2.39638in"
    alt="Graphical user interface, text, application, email Description automatically generated" />
    
## Troubleshooting

The source of the issue is likely plugins that interfere with the portal's connectivity. 

To confirm that this is the source of the issue and to identify which plugin is interfering:

1. Open the portal in an incognito browser and verify that the site functions correctly.

2. Attempt disabling plugins to identify the one that is causing the connectivity issue.
