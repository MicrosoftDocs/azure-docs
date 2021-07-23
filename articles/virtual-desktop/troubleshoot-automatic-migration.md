---
title: Troubleshoot automatic migration for Azure Virtual Desktop - Azure
description: How to resolve issues while using the automated process to migrate from Azure Virtual Desktop (classic).
services: virtual-desktop
author: Heidilohr
manager: lizross

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 07/14/2021
ms.author: helohr
---
# Troubleshooting automatic migration

This article will tell you how to solve commonly encountered issues in the migration module.

## I can't access the tenant

First, try these two things:

- Make sure your admin account has the required permissions to access the tenant.
- Try running **Get-RdsTenant** on the tenant.

If those two things work, try running the **Set-RdsMigrationContext** cmdlet to set the RDS Context and Adal Context for your migration:    

1. Create the RDS Context by running the **Add-RdsAccount** cmdlet.       

2. Find the RDS Context in the global variable *$rdMgmtContext*.         

3. Find the Adal Context in the global variable *$AdalContext*.

4. Run **Set-RdsMigrationContext** with the variables you found in this format:

   ```powershell
   Set-RdsMigrationContext -RdsContext <rdscontext> -AdalContext <adalcontext>
   ```

## Next steps

Learn more about automatic migration a [Migrate automatically from Azure Virtual Desktop (classic)](automatic-migration.md).