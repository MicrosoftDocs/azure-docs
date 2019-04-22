---
title: Azure CycleCloud Submit Once User Management | Microsoft Docs
description: Create and manage user accounts for Submit Once in Azure CycleCloud.
author: KimliW
ms.technology: submitonce
ms.date: 08/01/2018
ms.author: adjohnso
---

# Submit Once User Management

Before a user can interact with SubmitOnce via the command-line tools, they need 3 things:

1. The CycleServer command-line tools on the bin path.

2. A valid CycleServer username and password, as well as access to the CycleServer web server.

3. A user account matching the CycleServer username in the managed clusters.

## Create a CycleServer Account for Each User

Each user of SubmitOnce should have an account in CycleServer. The username in CycleServer should match the user's OS username in the managed clusters.  To create a new user, log in to the CycleServer web interface as an administrator, click the "Admin > Users" link in the upper right-hand corner of the screen and click "Add new user". Fill out the new user form and click "Create".

> [!NOTE]
> The user's CycleServer username should be the same as the user's OS username in at least the *Home Cluster*. SubmitOnce may be configured to use a common service account (username `cycle_server` by default) for remote clusters by disabling "Run-As-Owner" in the Application Settings for SubmitOnce. However, if "Run-As-Owner" is disabled, the service account must be enabled as an SGE admin.  To give the account SGE admin privileges, run `qconf -am cycle_server`.
