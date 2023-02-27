---
title: How to Troubleshoot Modeling and Simulation Workbench issues
description: In this How-to guide, you'll learn how to troubleshoot some issues with a Modeling and Simulation Workbench deployment.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 01/01/2023
# Customer intent: As a user of the Modeling and Simulation Workbench, I want to troubleshoot issues I may have encountered.
---

# How to troubleshoot Modeling and Simulation Workbench issues

## Access to Modeling and Simulation Workbench activity logs

1. Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal.
1. Search for Modeling and Simulation Workbench and choose the workbench you want to provision from the resource list.
1. In the menu for the workbench, select **Activity log** blade on the left of the screen.
1. Use filters provided here to find logs for your Modeling and Simulation Workbench workbench. On screen, you'll find a link to **Learn more about Azure Activity log** and **Visit Log Analytics** which will provide a [Log Analytics tutorial](https://learn.microsoft.com/azure/azure-monitor/logs/log-analytics-tutorial) for consolidating logs, saving queries, pin results to
1. NOTE: the lifetime of these logs is 30 days. If you want to retain logs longer, click on the **Export Activity Logs** option to access options available to you.

## Remote desktop connection troubleshooting

### Access error

If you have trouble accessing the remote desktop dashboard URL provided for your chamber's connector, you need to check and validate your network access as setup with the chamber's connector.

- If connector is configured for Azure ExpressRoute or VPN gateway, you need to be accessing the remote desktop dashboard URL from a computer in that network.
- if connector is configured for Public IP, you need to be accessing the remote desktop dashboard URL from an IP address, which has been allow-listed for the connector.

### Blue sign in screen

If you see a blue sign-in screen when navigating to your chamber's remote desktop dashboard URL, the single sign-on authentication configuration isn't set up properly.

1. Review the instructions to verify your App Registration is set up properly as defined here [Create an application in Azure Active Directory](./quickstart-create-portal.md#create-an-application-in-azure-active-directory)
1. Ensure you've registered your chamber connector's redirect URIs as defined here [Update the application in Azure Active Directory](./quickstart-create-portal.md#update-the-application-in-azure-active-directory)
1. If your application client secret has expired
    1. Generate a new secret, take note of the client secret value
    1. Update your Key Vault app secret value with the newly generated client secret value
    1. For your Modeling and Simulation Workbench instance, update the OTDS keyVault keys. If you reused your Key Vault app secret value key, make sure to provide version for the new secret value.<!---TODO Link to documentation for this step. If not the manage workbench or chamber, at least the REST API docs --->

## License server troubleshooting

### License file can't be checked out

1. Check license file to see if it has expired or not. 1. `INCREMENT <feature> <cdslmd|mgcld|snpslmd|ansyslmd|...> <version> <expirationdate> <seats> ...` or `FEATURE <feature> <cdslmd|mgcld|snpslmd|ansyslmd|...> <version> <expirationdate> <seats> ...`
1. If licenses are unexpired, restart license server from the Azure portal. Check if license file can be checked out. <!---TODO Add screenshot from within chamber showing how command or output of how to check out license file. Or sample code/command line call to check out license --->
1. If not, reupload the original license file from the license provider. Make sure no edits were made to the file provided by the license provider prior to uploading. See [how to upload license](./howtoguide-licenses.md)
1. Run 'lmstat' command to check the status of the license server, if it is running try to check out your license file. <!---TODO Add screenshot of lmstat output without any proprietary information--->
1. If the issue persists, contact your Microsoft account representative.

## Data pipeline troubleshooting

### Data upload to chamber not working

1. Check the networking and chamber connector settings for the chamber. Validate your network access.
    1. If you're connecting in through an allow listed IP address, validate your current Public IP is listed.
    1. If you're connecting in through VPN/Express Route, ensure that you're connecting in from a device in that network.
1. Ensure that you're provisioned into the workbench's chamber as an authorized user; Workbench Owner, Chamber Admin, or Chamber User. <!--- TODO Add screenshot showing instance/chamber/IAM role and Chamber Admin/Chamber Users roles set --->
1. Ensure your SAS URI isn't expired, expiration date is in the SAS URI. If it's expired, generate a new one and try again. See [how to upload data](./howtoguide-upload-data.md)
1. If the issue persists, contact your Microsoft account representative.

### Unable to request data download request

1. You must be a Chamber Admin to request a file download.
1. Once file download request is made, check for the file request in the chamber 'requested files' area in Azure portal. See [request download](./howtoguide-download-data.md).

### Unable to approve data download request

1. You must be a Workbench Owner to approve a data download request. A Workbench Owner will have Subscription Owner or Subscription Contributor role assigned to them.
1. You cannot be the same user who requested the download. See [approve download](./howtoguide-download-data.md).

### Data download from chamber not working

If you're unable to download data from chamber using the SAS URI.

1. Check the networking and chamber connector settings for the chamber. Validate your network access.
    1. If you're connecting in through an allow listed IP address, validate your current Public IP is listed.
    1. If you're connecting in through VPN/Express Route, ensure that you're connecting in from a device in that network.
1. Ensure that you're provisioned into the workbench's chamber as an authorized user; Workbench Owner, Chamber Admin, or Chamber User. <!--- TODO Add screenshot showing instance/chamber/IAM role and Chamber Admin/Chamber Users roles set --->
1. Ensure your SAS URI isn't expired, expiration date is in the SAS URI. If it's expired, generate a new one and try again. See [download file from chamber](./howtoguide-download-data.md).
1. If the issue persists, contact your Microsoft account representative.

## Quota/capacity troubleshooting

If you run into quota issues for compute or storage, contact your Microsoft Account Manager to request an increase in quota. Work with your account manager to get more allocation for your workbench subscription, subject to prevailing regional capacity limits/constraints.  
