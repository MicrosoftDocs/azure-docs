---
title: Azure Data Box Gateway troubleshoot | Micruse the Azure portal to tosoft Docs 
description: Describes how to troubleshoot Azure Data Box Gateway issues.
services: databox-edge-gateway
documentationcenter: NA
author: alkohli
manager: twooley
editor: ''

ms.assetid: 
ms.service: databox
ms.devlang: NA
ms.topic: overview
ms.custom: 
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 10/01/2018
ms.author: alkohli
---
# Troubleshoot your Azure Data Box Gateway issues 

This article describes how to troubleshoot any issues on your Azure Data Box Gateway. 

> [!IMPORTANT]
> - Data Box Gateway is in preview. Review the [Azure terms of service for preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you order and deploy this solution.

In this article, you learn how to:

> [!div class="checklist"]
> * Run diagnostics
> * Collect Support package
> * Use logs to troubleshoot


## Run diagnostics

To diagnose and troubleshoot any errors that you face during device configuration and operation, you can run the diagnostics tests. Perform the following steps in the local web UI of your device to run diagnostic tests.

1. In the local web UI, go to Troubleshooting > Diagnostic tests. Select the test you want to run and click Run test. This runs the tests to diagnose any possible issues with your network, device, web proxy, time, or cloud settings. You are notified that the device is running tests.

    ![Click add user](media/data-box-gateway-manage-bandwidth-schedules/add-schedule-1.png)
 
2. After the tests have completed, the results are displayed. The following example shows the results of diagnostic tests run on a virtual device. 
If a test fails, then a URL for recommended action is presented. You can click the URL to view the recommended action. 
 
    ![Click add user](media/data-box-gateway-manage-bandwidth-schedules/add-schedule-1.png)

NOTE:
If you are using a virtual device, then the hardware diagnostics tests are not available.


## Collect Support package

Perform the following steps to collect a Support package. 

A log package is comprised of all the relevant logs that can assist Data Box Gateway Support with troubleshooting any device issues. In this release, a log package can be generated via the local web UI.

1.	In the local web UI, go to Troubleshooting > Support. Click Create support package. The system starts collecting support package. The package collection may take several minutes.
 
2.	After the Support package is created, click Download Support package. A zipped package is downloaded on the path you chose. You can unzip the package and the view the system log files.


## Use logs to troubleshoot

Any errors experienced during the upload and refresh processes are included in the respective error files.

To view the error files, go to your share and click the share to view the contents. 
  

Click the _Microsoft Data Box Gateway folder_. This folder contains two subfolders – Upload containing log files for upload errors and Refresh for errors during refresh.

Here is a sample log file for refresh.
<root container="brownbag1" machine="VM15BS020663" timestamp="07/18/2018 00:11:10" />
<file item="test.txt" local="False" remote="True" error="16001" />
<summary runtime="00:00:00.0945320" errors="1" creates="2" deletes="0" insync="3" replaces="0" pending="9" />

When you see an error in this file (highlighted in the sample), note down the error code, in this case it is 16001. You need to look up the description of this error code against the following error reference.





## Next steps

- Learn how to [Manage bandwidth](data-box-gateway-manage-bandwidth.md).
