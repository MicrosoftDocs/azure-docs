---
title: Configure Azure Arc enabled SQL managed instance
description: Configure Azure Arc enabled SQL managed instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: vin-yu 
ms.author: vinsonyu
ms.reviewer: mikeray
ms.date: 08/30/2020
ms.topic: configure

---

# Configure Azure Arc enabled SQL managed instance

## Congigure Resoruces for Azure Arc enabled SQL managed instance

You can modify the settings using azdata or kubectl.

**insert examples about changing resoruce limits**

## Configure Server options 
Server configuration settings can configured for Azure Arc enabled SQL managed instance after deployment time. This article describes how to configure settings like enabling or disabling mssql Agent, enable specific trace flags for troubleshooting scenarios.

To change any of these settings, follow these steps:

1. Create a custom `mssql-custom.conf` file that includes targeted settings. The following example enables SQL Agent and enables trace flag 1204.:

   ```
   [sqlagent]
   enabled=true
   
   [traceflag]
   traceflag0 = 1204
   ```

1. Copy `mssql-custom.conf` file to `/var/opt/mssql` in the `mssql-miaa` container in the `master-0` pod. Replace `<namespaceName>` with the big data cluster name.

   ```bash
   kubectl cp mssql-custom.conf master-0:/var/opt/mssql/mssql-custom.conf -c mssql-server -n <namespaceName>
   ```

1. Restart SQL Server instance.  Replace `<namespaceName>` with the big data cluster name.

   ```bash
   kubectl exec -it master-0  -c mssql-server -n <namespaceName> -- /bin/bash
   supervisorctl restart mssql-server
   exit
   ```


## Known limitations
- The steps above require Kubernetes cluster admin permissions
- This is subject to change throughout preview
