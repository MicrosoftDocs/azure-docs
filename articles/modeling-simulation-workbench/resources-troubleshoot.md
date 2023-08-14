---
title: Troubleshoot Azure Modeling and Simulation Workbench
description: In this article, learn how to troubleshoot some issues with an Azure Modeling and Simulation Workbench
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 07/19/2023
# Customer intent: As a user of the Modeling and Simulation Workbench, I want to troubleshoot issues I may have encountered.
---

# Troubleshoot Azure Modeling and Simulation Workbench

This troubleshooting guide contains general troubleshooting steps and information for Azure Modeling and Simulation Workbench. The content is organized by topic type.

## Remote desktop troubleshooting

### Remote desktop access error

A *not authorized error* while accessing the remote desktop dashboard URL indicates possible issues with your network access. Review the chamber connector networking setup.

- If connector is configured for Azure ExpressRoute or VPN gateway, access the remote desktop dashboard URL from a computer in that network.
- If connector is configured for Public IP, access the remote desktop dashboard URL from an IP address that has been allow-listed for the connector.

### Remote desktop sign in errors

- A *blue sign-in screen* when navigating to your chamber's remote desktop dashboard URL indicates the single sign-on authentication configuration isn't set up properly.
- A *grey screen* when trying to connect to a workload indicates either your workload isn't in the running state, or the user provisioning failed for that user.

#### Failing for all users

- Review the [Create an application in Azure Active Directory](./quickstart-create-portal.md#create-an-application-in-azure-active-directory) article to verify your application registration is set up correctly.
- Review the [Update the application in Azure Active Directory](./quickstart-create-portal.md#add-redirect-uris-for-the-application-in-azure-active-directory) article to confirm your chamber connector's redirect URIs are set up correctly.
- Review the application registration secrets for Modeling and Simulation Workbench and check to see if your application client secret has expired. Complete the following steps if it's expired.
    1. Generate a new secret and make note of the client secret value.
    1. Update your Key Vault app secret value with the newly generated client **secret value.**
    1. Delete your connector and recreate it.
        - Make note of the network setup so you can properly configure the new connector with appropriate allowlist IPs or subnet value.
        - For the new connector, ensure you register your chamber connector's redirect URIs.
        - A new Remote Desktop URL is also provided to access the chamber workloads.
    1. The connector creation picks up the new secret and enables the Azure AD single sign-on experience. All Chamber Admins and Chamber Users that are provisioned at the chamber level automatically have access via this new connector.

#### Failing for some users

1. Ensure the user is provisioned as a Chamber User or a Chamber Admin on the **chamber** resource. They should be set up as an IAM role directly for that chamber, not as a parent resource with inherited permission.
1. Ensure the user has a valid email set for their Azure AD profile, and that their Azure AD alias matches their email alias. For example, an Azure AD sign in alias of _jane.doe_ must also have an email alias of _jane.doe_. Jane Doe can't sign in to Azure AD with jadoe or any other variation.
1. Validate your /mount/sharehome folder has available space. The /mount/sharedhome directory is set up to store user keys to establish a secure connection. Don't store uploaded tarballs/binaries in this folder or install tools and use disk capacity, as it may create system connection errors causing an outage. Use /mount/chamberstorages/\<storage name\> directory instead for all your data storage and tool installation needs.
1. Validate your folder permission settings are correct within your chamber. User provisioning may not work properly if the folder permission settings aren't correct. You can check folder permissions in a terminal session using the *ls -al* command for each /mount/sharedhome/\<useralias\>/.ssh folder, results should match below expectations:

     ```text
      /mount/sharedhome/<useralias>/.ssh folder: 700 (drwx------)
      /mount/sharedhome/<useralias>/.ssh/ public key (.pub or authorized_keys file): 644 (-rw-r--r--)
      /mount/sharedhome/<useralias>/.ssh/ private key (id_rsa): 600 (-rw-------)
     ```

1. If it's still not working, try a *refresh* by reprovisioning the user. The /mount/sharedhome/\<useralias\> folder is removed when removing user role assignment. Make sure data is backed up if necessary before removing user role assignment.
    1. Remove user's Chamber Admin or Chamber User role assignment at chamber level.
    1. Wait 5 minutes.
    1. Then add the user's role assignment back at chamber level.
    1. Wait 5 minutes.
    1. Advise user to sign in again.
1. If user still can't sign in, they should clear the browser cache and attempt a new sign into the desktop dashboard URL, or try it with a different browser. When the cache is properly cleared or a sign in to new browser is attempted, your organization's sign-in Azure AD prompt displays. OAuth credentials are cached and sometimes a fresh sign in can resolve issues with cached credentials.

### License error

An *all licenses are in use for the remote desktop error* means that all licenses are already being used for the remote desktop tool. Ask someone on your team to sign out of their session so that you can sign in.  Or contact your Microsoft account manager to get more remote desktop licenses.

## License server troubleshooting

### License file can't be checked out

1. Use the following code to see if the license file is expired.

   ```shell
   lmstatPath=$(find / -name lmstat | head -1)
   licenseHostname=<HOSTNAME_FOR_EDA_LICENSE_SERVICE>        # under Chamber/License e.g., <PORT>@<HOSTNAME>
   
   $lmstatPath -a -c $licenseHostname
   ```

    Expected output

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

1. If license file isn't expired, restart the license server from the Azure portal. Then verify if you can check out the license file.

1. If you can't check out the license file, [reload the original license file](./how-to-guide-licenses.md) from the license provider. Make sure no edits were made to the original file prior to reloading it.

1. Run the 'lmstat' command to check the status of the license server. If it's running, try to check out your license file.

1. If the issue persists, contact your Microsoft account manager.

## Data pipeline troubleshooting

### Data import to chamber not working

1. Verify your file is in root folder and filename contains only valid characters; alphanumerics, underscores, periods, and hyphens.
1. Check the networking and chamber connector settings for the chamber. Validate your network access.
    - If you're connecting in through an allow listed IP address, validate your current Public IP is listed.
    - If you're connecting in through VPN/Express Route, ensure that you're connecting in from a device in that network.
1. Confirm that you're provisioned as either a Workbench Owner, Chamber Admin, or Chamber User in the workbench's chamber.
1. Check the expiration date in the SAS URI to confirm it isn't expired. If it's expired, generate a new one and try again. For more information about importing data, see [import data to chamber.](./how-to-guide-upload-data.md)
1. Confirm you're not using AzCopy v10.18.0. Although we recommend using the latest version, there are known issues with that version.
1. If the issue persists, contact your Microsoft account manager.

### Unable to request data export

1. Confirm you're a Chamber Admin. Only a Chamber Admin can request a file/data to be exported.
1. For more information about data export, see [Export data from chamber.](./how-to-guide-download-data.md)

### Unable to approve data export request

1. Confirm you're a Workbench Owner.  A Workbench Owner has a Subscription Owner or Subscription Contributor role assigned to them. It's the only role that can approve (or reject) a data export request.
1. Confirm you didn't request the data export.  The user who requests the data export isn't allowed to also approve the data export.  For more information about data export, see [Export data from chamber.](./how-to-guide-download-data.md)

### Data export from chamber not working

Complete the following steps if you're unable to export data from the chamber using the SAS URI

1. Verify your file is in root folder and filename contains only valid characters; alphanumerics, underscores, periods, and hyphens.
1. Check the networking and chamber connector settings for the chamber. Validate your network access.
    - If you're connecting in through an allow listed IP address, validate your current Public IP is listed.
    - If you're connecting in through VPN/Express Route, ensure that you're connecting in from a device in that network.
1. Confirm that you're provisioned as either a Workbench Owner, Chamber Admin, or Chamber User in the workbench's chamber.
1. Check the expiration date in the SAS URI to confirm it isn't expired. If it's expired, generate a new one and try again. For more information about data export, see [Export data from chamber.](./how-to-guide-download-data.md)
1. If the issue persists, contact your Microsoft account manager.

## Quota/capacity troubleshooting

For storage or computing quota issues, contact your Microsoft account manager.  They'll get you more allocation for your workbench subscription, subject to regional capacity limits/constraints.

## Issue not covered or addressed

If the troubleshooting steps don't resolve your issue or your issue isn't listed on this page, contact your Microsoft account manager for support.
