---
title: Connect to an existing Remote Desktop environment - Azure
description: Describes how to connect an existing Remote Desktop tenant environment to a new Windows Virtual Desktop deployment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: helohr
---
# Connect to an existing Remote Desktop environment

You may have an existing Remote Desktop tenant environment already connected to an existing Windows Virtual Desktop deployment that you want to connect to a different Windows Virtual Desktop deployment. You can reuse the RD tenant environment for a new connection by following these steps. This procedure assumes you're already familiar with how to set up a Windows Virtual Desktop environment on Active Directory, but if you need more specific instructions, see [Set up Windows Virtual Desktop tenants in Azure Active Directory](tenant-setup-azure-active-directory.md).

1. Give consent to allow the new Windows Virtual Desktop application to read the tenant’s Azure Active Directory.
2. Create an RD tenant and host pool in the new Windows Virtual Desktop deployment.
3. Uninstall the RD Host Agent from the host pool's session hosts.
4. Register the session host virtual machines with the host pool in the new Windows Virtual Desktop deployment.
5. Install the Side-by-Side stack.
6. Create an application group for publishing RemoteApps.

>[!NOTE]
>This procedure assumes the two Windows Virtual Desktop deployments you're trying to connect to each other are different versions.

## Validating your connection

The following scenarios are expected to work and should be verified through validation testing. Any issues should be reported with the new diagnostics role service. For more information, see [Identify issues with the diagnostics role service](diagnostics-role-service.md).

## Validation scenarios for default desktop application group

|Scenario|Auth|PaaS or WSCore|UPN match|Remote desktop tenant|Host pools per tenant|Session hosts per host pool|Desktop app groups per host pool|Users|
|---|---|---|---|---|---|---|---|---|
|DT1|Azure AD|PaaS|Y|1|1|1|1|One user assigned to desktop app group, second user not assigned to desktop app group|
|DT2|Azure AD|PaaS|Y|N|1|1|1|One user per tenant assigned to desktop app group|
|DT3|Azure AD|PaaS|Y|1|N|1|1|One user assigned to desktop app group in Host Pool 1, second user assigned to a desktop app group in Host Pool 1 and Host Pool 2|
|DT4|Azure AD|PaaS|Y|1|1|N|1|N users per tenant assigned to the same host pool|
|DT5–DT8|Azure AD|PaaS|N (Repeat above for mismatch UPN)| | | | | |

### Validation questions for default desktop application group

Scenarios DT1 and DT5:

* Can a user assigned to a desktop app group see desktop icons in the RD client?
* Can a user assigned to a desktop app group connect to the desktop?
* What about users not assigned to the desktop app group?

Scenarios DT2 and DT6:

* If a user is assigned to a desktop app group in one RD tenant but not other RD tenants, can the user see desktops for the tenants they are not assigned to?
* Does the user know which tenant they're connecting to?

Scenarios DT3 and DT7:

* If a user is assigned to a desktop app group in multiple host pools within the same tenant, do all desktop icons show up in the client?

Scenarios DT4 and DT8:

* If multiple users are assigned to a desktop app group in a host pool with multiple session hosts, and all users are signed in at once, how are their sessions distributed across the pool's session hosts?

## Validation scenarios for the RemoteApp groups and user profile disk

|Scenario|Auth|PaaS or WSCore|UPN match|Remote desktop tenant|Host pools per tenant|Session hosts per host pool|RemoteApp groups per host pool|RemoteApps per RemoteApp group|Users|
|---|---|---|---|---|---|---|---|---|---|
|RA1|Azure AD|PaaS|Y|1|1|>2|1|>2|>1 users per tenant assigned to each app group|
|RA2|Azure AD|PaaS|N|N|1|1|>2|1||>2|>1 users per tenant assigned to each app group|

### Validation questions for the RemoteApp groups and user profile disk

Scenarios RA1 and RA2:

* Can a user assigned to a RemoteApp group with multiple RemoteApps see all of the RD client's apps?
* Can a user assigned to a RemoteApp group connect to one of the RemoteApps?
* If User Profile Disks are enabled and user logs on to one session host, saves data, then logs onto a second session host in the host pool, does the saved data follow the user? (In this case, you might have to shut down the first session host to force the broker to send the user to a second session host.)