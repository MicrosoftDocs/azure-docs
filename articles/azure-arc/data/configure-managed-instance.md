---
title: Configure Azure Arc enabled SQL managed instance
description: Configure Azure Arc enabled SQL managed instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: vin-yu 
ms.author: vinsonyu
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Configure Azure Arc enabled SQL managed instance

This article explains how to configure Azure Arc enabled SQL managed instance.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Configure Resources for Azure Arc enabled SQL Managed Instance

### Configure using azdata

You can edit the configuration of Azure Arc enabled SQL Managed Instances with the `azdata` CLI. Run the following command to see configuration options. 

```
azdata arc sql mi edit --help
```

The following example sets the cpu core and memory requests and limits.

```
azdata arc sql mi edit --cores-limit 4 --cores-request 2 --memory-limit 4Gi --memory-request 2Gi -n <NAME_OF_SQL_MI>
```

To view the changes made to the SQL managed instance, you can use the following commands to view the configuration yaml file:

```
azdata arc sql mi show -n <NAME_OF_SQL_MI>
```

## Configure Server options

You can configure server configuration settings for Azure Arc enabled SQL managed instance after creation time. This article describes how to configure settings like enabling or disabling mssql Agent, enable specific trace flags for troubleshooting scenarios.

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


**Known limitations**
- The steps above require Kubernetes cluster admin permissions
- This is subject to change throughout preview
