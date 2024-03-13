---
title: Troubleshoot configuration - SQL Managed Instance enabled by Azure Arc
description: Describes how to troubleshoot configuration. Includes steps to provide configuration files for SQL Managed Instance enabled by Azure Arc Azure Arc-enabled data services
author: MikeRayMSFT
ms.author: mikeray
ms.topic: troubleshooting-general 
ms.date: 04/10/2023
---

# User-provided configuration files

Arc data services provide management of configuration settings and files in the system. The system generates configuration files such as `mssql.conf`, `mssql.json`, `krb5.conf` using the user-provided settings in the custom resource spec and some system-determined settings. The scope of what settings are supported and what changes can be made to the configuration files using the custom resource spec evolves over time. You may need to try changes in the configuration files that aren't possible through the settings on the custom resource spec.

To alleviate this problem, you can provide configuration file content for a selected set of files through a Kubernetes `ConfigMap`. The information in the `ConfigMap` effectively overrides the file content that the system would have otherwise generated. This content allows you to try some configuration settings.

For Arc SQL Managed Instance, the supported configuration files that you can override using this method are:

- `mssql.conf`
- `mssql.json`
- `krb5.conf`

## Steps to provide override configuration files

1. Prepare the content of the configuration file

   Prepare the content of the file that you would like to provide an override for.

1. Create a `ConfigMap`

   Create a `ConfigMap` spec to store the content of the configuration file. The key in the `ConfigMap` dictionary should be the name of the file, and the value should be the content.

   You can provide file overrides for multiple configuration files in one `ConfigMap`.

   The `ConfigMap` must be in the same namespace as the SQL Managed Instance.

   The following spec shows an example of how to provide an override for mssql.conf file:

   ```json
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: sqlmifo-cm
     namespace: test
   data:
     mssql.conf: "[language]\r\nlcid = 1033\r\n\r\n[licensing]\r\npid = GeneralPurpose\r\n\r\n[network]\r\nforceencryption = 0\r\ntlscert = /var/run/secrets/managed/certificates/mssql/mssql-certificate.pem\r\ntlsciphers = ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384\r\ntlskey = /var/run/secrets/managed/certificates/mssql/mssql-privatekey.pem\r\ntlsprotocols = 1.2\r\n\r\n[sqlagent]\r\nenabled = False\r\n\r\n[telemetry]\r\ncustomerfeedback = false\r\n\r\n"
   ```

   Apply the `ConfigMap` in Kubernetes using `kubectl apply -f <filename>`.

1. Provide the name of the ConfigMap in SQL Managed Instance spec

   In SQL Managed Instance spec, provide the name of the ConfigMap in the field `spec.fileOverrideConfigMap`.

   The SQL Managed Instance `apiVersion` must be at least v12 (released in April 2023).

   The following SQL Managed Instance spec shows an example of how to provide the name of the ConfigMap.

   ```json
   apiVersion: sql.arcdata.microsoft.com/v12
   kind: SqlManagedInstance
   metadata:
     name: sqlmifo
     namespace: test
   spec:
     fileOverrideConfigMap: sqlmifo-cm
     ...
   ```

   Apply the SQL Managed Instance spec in Kubernetes. This action leads to the delivery of the provided configuration files to Arc SQL Managed Instance container.

1. Check that the files are downloaded in the `arc-sqlmi` container.

   The locations of supported files in the container are:

   - `mssql.conf`: `/var/run/config/mssql/mssql.conf`
   - `mssql.json`: `/var/run/config/mssql/mssql.json`
   - `krb5.conf`: `/etc/krb5.conf`

## Related content

[Get logs to troubleshoot Azure Arc-enabled data services](troubleshooting-get-logs.md)