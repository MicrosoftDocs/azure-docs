---
title: Rotate customer-managed keytab
description: How to rotate a customer-managed keytab
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: patelr3
ms.author: ravpate
ms.reviewer: mikeray
ms.date: 05/05/2023
ms.topic: how-to
---
# Rotate SQL Server Managed Instance enabled by Azure Arc customer-managed keytab

This article describes how to rotate customer-managed keytabs for SQL Managed Instance enabled by Azure Arc. These keytabs are used to enable Active Directory logins for the managed instance.

## Prerequisites: 

Before you proceed with this article, you must have an active directory connector in customer-managed keytab mode and a SQL Managed Instance enabled by Azure Arc created.

- [Deploy a customer-managed keytab active directory connector](./deploy-customer-managed-keytab-active-directory-connector.md)
- [Deploy and connect a SQL Managed Instance enabled by Azure Arc](./deploy-active-directory-sql-managed-instance.md)

## How to rotate customer-managed keytabs in a managed instance

The following steps need to be followed to rotate the keytab:

1. Get `kvno` value for the current generation of credentials for the SQL MI Active Directory account.
1. Create a new keytab file with entries for the current generation of credentials. Specifically, the `kvno` value should match from step (1.) above.
1. Update the new keytab file with new entries for the new credentials for the SQL MI Active Directory account.
1. Create a kubernetes secret holding the new keytab file contents in the same namespace as the SQL MI.
1. Edit the SQL MI spec to point the Active Directory keytab secret setting to this new secret.
1. Change the password in the Active Directory domain.

We have provided the following PowerShell and bash scripts that will take care of steps 1-5 for you:
- [`rotate-sqlmi-keytab.sh`](https://github.com/microsoft/azure_arc/blob/main/arc_data_services/deploy/scripts/rotate-sql-keytab.sh) - This bash script uses `ktutil` or `adutil` (if the `--use-adutil` flag is specified) to generate the new keytab for you.
- [`rotate-sqlmi-keytab.ps1`](https://github.com/microsoft/azure_arc/blob/main/arc_data_services/deploy/scripts/rotate-sql-keytab.ps1) - This PowerShell script uses `ktpass.exe` to generate the new keytab for you.

Executing the above script would result in the following keytab file for the user `arcsqlmi@CONTOSO.COM`, secret `sqlmi-keytab-secret-kvno-2-3` and namespace `test`:

```text
KVNO Timestamp           Principal
---- ------------------- ------------------------------------------------------
   2 02/16/2023 17:12:05 arcsqlmiuser@CONTOSO.COM (aes256-cts-hmac-sha1-96) 
   2 02/16/2023 17:12:05 arcsqlmiuser@CONTOSO.COM (arcfour-hmac) 
   2 02/16/2023 17:12:05 MSSQLSvc/arcsqlmi.contoso.com@CONTOSO.COM (aes256-cts-hmac-sha1-96) 
   2 02/16/2023 17:12:05 MSSQLSvc/arcsqlmi.contoso.com@CONTOSO.COM (arcfour-hmac) 
   2 02/16/2023 17:12:05 MSSQLSvc/arcsqlmi.contoso.com:31433@CONTOSO.COM (aes256-cts-hmac-sha1-96) 
   2 02/16/2023 17:12:05 MSSQLSvc/arcsqlmi.contoso.com:31433@CONTOSO.COM (arcfour-hmac) 
   3 02/16/2023 17:13:41 arcsqlmiuser@CONTOSO.COM (aes256-cts-hmac-sha1-96) 
   3 02/16/2023 17:13:41 arcsqlmiuser@CONTOSO.COM (arcfour-hmac) 
   3 02/16/2023 17:13:41 MSSQLSvc/arcsqlmi.contoso.com@CONTOSO.COM (aes256-cts-hmac-sha1-96) 
   3 02/16/2023 17:13:41 MSSQLSvc/arcsqlmi.contoso.com@CONTOSO.COM (arcfour-hmac) 
   3 02/16/2023 17:13:41 MSSQLSvc/arcsqlmi.contoso.com:31433@CONTOSO.COM (aes256-cts-hmac-sha1-96) 
   3 02/16/2023 17:13:41 MSSQLSvc/arcsqlmi.contoso.com:31433@CONTOSO.COM (arcfour-hmac)
```

And the following updated-secret.yaml spec:
```yaml
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: sqlmi-keytab-secret-kvno-2-3
  namespace: test
data:
  keytab:
    <keytab-contents>
```

Finally, change the password for `arcsqlmi` user account in the domain controller for the Active Directory domain `contoso.com`:

1. Open **Server Manager** on the domain controller for the Active Directory domain `contoso.com`. You can either search for *Server Manager* or open it through the Start menu.
1. Go to **Tools** > **Active Directory Users and Computers**

   :::image type="content" source="media/rotate-customer-managed-keytab/active-directory-users-and-computers.png" alt-text="Screenshot of Active Directory Users and Computers.":::

1. Select the user that you want to change password for. Right-click to select the user. Select **Reset password**:

   :::image type="content" source="media/rotate-customer-managed-keytab/reset-password.png" alt-text="Screenshot of the control to reset the password for an Active Directory user account.":::

1. Enter new password and select `OK`.

### Troubleshooting errors after rotation

In case there are errors when trying to use Active Directory Authentication after completing keytab rotation, the following files in the `arc-sqlmi` container in the SQL MI pod are a good place to start investigating the root cause:
- `security.log` file located at `/var/opt/mssql/log` - This log file has logs for SQL's interactions with the Active Directory domain.
- `errorlog` file located at `/var/opt/mssql/log` - This log file contains logs from the SQL Server running on the container.
- `mssql.keytab` file located at `/var/run/secrets/managed/keytabs/mssql` - Verify that this keytab file contains the newly updated entries and matches the keytab file created by using the scripts provided above. The keytab file can be read using the `klist` command i.e. `klist -k mssql.keytab -e`

Additionally, after getting the kerberos Ticket-Granting Ticket (TGT) by using `kinit` command, verify the `kvno` of the SQL user matches the highest `kvno` in the `mssql.keytab` file in the `arc-sqlmi` container. For example, for `arcsqlmi@CONTOSO.COM` user:

- Get the kerberos TGT from the Active Directory domain by running `kinit arcsqlmi@CONTOSO.COM`. This will prompt a user input for the password for `arcsqlmi` user.
- Once this succeeds, the `kvno` can be queried by running `kvno arcsqlmi@CONTOSO.COM`.

We can also enable debug logging for the `kinit` command by running the following: `KRB5_TRACE=/dev/stdout kinit -V arcsqlmi@CONTOSO.COM`. This increases the verbosity and outputs the logs to stdout as the command is being executed.

## Related content

- [View the SQL managed instance dashboards](azure-data-studio-dashboards.md#view-the-sql-managed-instance-dashboards)
- [View SQL Managed Instance in the Azure portal](view-arc-data-services-inventory-in-azure-portal.md)
