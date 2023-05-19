---
title: How to Troubleshoot Modeling and Simulation Workbench issues
description: In this how-to guide, learn how to troubleshoot some issues with a Modeling and Simulation Workbench deployment.
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
1. Search for Modeling and Simulation Workbench and choose the workbench you want to see logs for from the resource list.
1. In the menu for the workbench, select **Activity log** blade on the left of the screen.

   :::image type="content" source="/azure/active-directory/develop/media/howtoguide-troubleshooting/workbench-activity-log.png" alt-text="Screenshot of the Azure portal in a web browser, showing the activity log for a workbench.":::

1. Use filters provided here to find logs for your Modeling and Simulation Workbench workbench. On screen, you find a link to **Learn more about Azure Activity log** and **Visit Log Analytics** which provides a [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial) for consolidating logs, saving queries, pin results to
1. NOTE: the lifetime of these logs is 30 days. If you want to retain logs longer, click on the **Export Activity Logs** option to access options available to you.

## Remote desktop connection troubleshooting

### Remote desktop access error

If you get a *not authorized* error while accessing the remote desktop dashboard URL, it indicates possible issues with your network access. Review the chamber connector networking setup.

- If connector is configured for Azure ExpressRoute or VPN gateway, you need to be accessing the remote desktop dashboard URL from a computer in that network.
- if connector is configured for Public IP, you need to be accessing the remote desktop dashboard URL from an IP address that has been allow-listed for the connector.

### Remote desktop sign in errors

If you see a blue sign-in screen when navigating to your chamber's remote desktop dashboard URL, the single sign-on authentication configuration isn't set up properly. If you see a grey screen when trying to connect to a workload, either your workload is not in the running state, or the user provisioning failed for that user.

#### Failing for all users

1. Review the instructions to verify your App Registration is set up properly as defined here [Create an application in Azure Active Directory](./quickstart-create-portal.md#create-an-application-in-azure-active-directory)
1. Ensure you've registered your chamber connector's redirect URIs as defined here [Update the application in Azure Active Directory](./quickstart-create-portal.md#update-the-application-in-azure-active-directory)
1. If your application client secret has expired
    1. Generate a new secret, take note of the client secret value
    1. Update your Key Vault app secret value with the newly generated client **secret value**
    1. Delete your connector and recreate it.
        1. Make note of the network setup so you can properly configure the new connector with appropriate allowlist IPs or subnet value.
        1. For the new connector, ensure you've registered your chamber connector's redirect URIs.
        1. Take note there's also a new Remote Desktop URL provided to access the chamber workloads.
    1. The connector creation picks up the new secret and enables the Azure AD single sign-on experience. All Chamber Admins and Chamber Users that are provisioned at the chamber level automatically have access via this new connector.

#### Failing for some users

1. Ensure your user has been provisioned as a Chamber User or a Chamber Admin on the **chamber** resource. Not a parent resource with inherited permission, but IAM role set directly for that chamber.
1. Ensure your user has a valid email set for their Azure AD profile, and they log into Azure AD with alias that matches their alias for their email. For example,  John Doe at Contoso with alias of _johnd_ should sign in to Azure AD using _johnd_ alias, where their email is johnd@contoso.com. Not logging in with _johndoe_ or any other variation.
1. Validate your folder permission settings are correct within your chamber. User provisioning may not work properly if the folder permission settings aren't correct.

     ```text
      /mount/sharedhome/<useralias>/.ssh folder: 700 (drwx------)
      /mount/sharedhome/<useralias>/.ssh/ public key (.pub or authorized_keys file): 644 (-rw-r--r--)
      /mount/sharedhome/<useralias>/.ssh/ private key (id_rsa): 600 (-rw-------)
     ```

1. If it's still not working, try a *refresh* by reprovisioning the user. When removing user role assignment, the /mount/sharedhome/\<useralias\> folder is removed. Make sure data is backed up if necessary before removing user role assignment.
    1. Remove user's Chamber Admin or Chamber User role assignment at chamber level.
    1. *Wait 5 minutes*.
    1. For this user, add their role assignment at chamber level.
    1. *Wait 5 minutes*.
    1. Have them try to sign in again.
1. Clear browser cache and attempt new sign in to the desktop dashboard URL, or try with a different browser. If cache was properly cleared, or attempting sign in first time with a new browser, you should see your organizations sign-in Azure AD prompt. OAuth credentials are cached and sometimes a fresh sign in can get around any issues with the cached credentials.

### License error

If you receive an error that all licenses are in use for the remote desktop tool, that means your remote desktop licenses are all in use.

1. Contact your Microsoft account representative to get remote desktop licenses more licenses.
1. Or, ask somebody on your team to sign out of their session, so that frees up opportunity for you to sign in.

## License server troubleshooting

### License file can't be checked out

1. Check license file to see if it has expired or not.

   ```shell
   lmstatPath=$(find / -name lmstat | head -1)
   licenseHostname=<HOSTNAME_FOR_EDA_LICENSE_SERVICE>        # under Chamber/License e.g., <PORT>@<HOSTNAME>
   
   $lmstatPath -a -c $licenseHostname
   ```

   expected output is

   ```shell
   lmstat - Copyright (c) <YEAR> Flexera. All Rights Reserved.
   Flexible License Manager status on <TIME>
   
   License server status: <PORT>@<HOSTNAME>
       License file(s) on <HOSTNAME>: <LICENSE_FILE_PATH>:
   
   <HOSTNAME>: license server UP <VERSION>
   
   Vendor daemon status (on <HOSTNAME>):
   
      <VENDOR_DAEMON>: UP <VERSION>
   Feature usage info:
   ...
   Users of <FEATURE_N>:  (Total of <W> license issued;  Total of <X> licenses in use)
   Users of <FEATURE_N+1>:  (Total of <Y> license issued;  Total of <Z> licenses in use)
   ...
   ```

1. If licenses are unexpired, restart license server from the Azure portal. Check if license file can be checked out. <!---TODO screenshot from within chamber showing how command or output of how to check out license file. Or sample code/command line call to check out license --->

1. If not, reupload the original license file from the license provider. Make sure no edits were made to the file provided by the license provider prior to uploading. See [how to upload license](./how-to-guide-licenses.md)

1. Run 'lmstat' command to check the status of the license server, if it's running try to check out your license file. <!---TODO screenshot of lmstat output without any proprietary information--->

1. If the issue persists, contact your Microsoft account representative.

## Data pipeline troubleshooting

### Data upload to chamber not working

1. Check the networking and chamber connector settings for the chamber. Validate your network access.
    1. If you're connecting in through an allow listed IP address, validate your current Public IP is listed.
    1. If you're connecting in through VPN/Express Route, ensure that you're connecting in from a device in that network.
1. Ensure that you're provisioned into the workbench's chamber as an authorized user; Workbench Owner, Chamber Admin, or Chamber User. <!--- TODO screenshot showing instance/chamber/IAM role and Chamber Admin/Chamber Users roles set --->
1. Ensure your SAS URI isn't expired, expiration date is in the SAS URI. If it's expired, generate a new one and try again. See [how to upload data](./how-to-guide-upload-data.md)
1. Check your version of azcopy, while we recommend 'latest', there are known issues with v10.18.0 so that version doesn't work.
1. If the issue persists, contact your Microsoft account representative.

### Unable to request data download request

1. You must be a Chamber Admin to request a file download.
1. Once file download request is made, check for the file request in the chamber 'requested files' area in Azure portal. See [request download](./how-to-guide-download-data.md).

### Unable to approve data download request

1. You must be a Workbench Owner to approve a data download request. A Workbench Owner has Subscription Owner or Subscription Contributor role assigned to them.
1. You can't be the same user who requested the download. See [approve download](./how-to-guide-download-data.md).

### Data export from chamber not working

If you're unable to export data from chamber using the SAS URI.

1. Check the networking and chamber connector settings for the chamber. Validate your network access.
    1. If you're connecting in through an allow listed IP address, validate your current Public IP is listed.
    1. If you're connecting in through VPN/Express Route, ensure that you're connecting in from a device in that network.
1. Ensure that you're provisioned into the workbench's chamber as an authorized user; Workbench Owner, Chamber Admin, or Chamber User. <!--- TODO screenshot showing instance/chamber/IAM role and Chamber Admin/Chamber Users roles set --->
1. Ensure your SAS URI isn't expired, expiration date is in the SAS URI. If it's expired, generate a new one and try again. See [download file from chamber](./how-to-guide-download-data.md).
1. If the issue persists, contact your Microsoft account representative.

## Quota/capacity troubleshooting

If you run into quota issues for compute or storage, work with your Microsoft account manager to get more allocation for your workbench subscription, subject to prevailing regional capacity limits/constraints.

## Issue not covered or addressed

If troubleshooting recovery steps to not resolve your issue, or your issue isn't listed, contact your Microsoft account manager for support.
