---
title: Connect to AD-integrated Azure Arc-enabled SQL Managed Instance
description: Connect to AD-integrated Azure Arc-enabled SQL Managed Instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: mikhailalmeida
ms.author: mialmei
ms.reviewer: mikeray
ms.date: 10/11/2022
ms.topic: how-to
---

# Connect to AD-integrated Azure Arc-enabled SQL Managed Instance

This article describes how to connect to SQL Managed Instance endpoint using Active Directory (AD) authentication. Before you proceed, make sure you have an AD-integrated Azure Arc-enabled SQL Managed Instance deployed already.

See [Tutorial – Deploy AD-integrated SQL Managed Instance](deploy-active-directory-sql-managed-instance.md) to deploy Azure Arc-enabled SQL Managed Instance with Active Directory authentication enabled.

> [!NOTE]
> Ensure that a DNS record for the SQL endpoint is created in Active Directory DNS servers before continuing on this page. 

## Create Active Directory logins in SQL Managed Instance

Once SQL Managed Instance is successfully deployed, you will need to provision Active Directory logins in SQL Server.

To provision logins, first connect to the SQL Managed Instance using the SQL login with administrative privileges and run the following T-SQL:

```sql
CREATE LOGIN [<NetBIOS domain name>\<AD account name>] FROM WINDOWS;
GO
```

The following example creates a login for an Active Directory account named `admin`, in the domain named `contoso.local`, with NetBIOS domain name as `CONTOSO`:

```sql
CREATE LOGIN [CONTOSO\admin] FROM WINDOWS;
GO
```

## Connect to Azure Arc-enabled SQL Managed Instance

From your domain joined Windows-based client machine or a Linux-based domain aware machine, you can use `sqlcmd` utility, or open [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio (ADS)](/azure-data-studio/download-azure-data-studio) to connect to the Azure Arc-enabled SQL Managed Instance using AD authentication.

A domain-aware Linux-based machine is one where you are able to use Kerberos authentication using kinit. Such machine should have /etc/krb5.conf file set to point to the Active Directory domain (realm) being used. It should also have /etc/resolv.conf file set such that one can run DNS lookups against the Active Directory domain.


### Connect from Linux/Mac OS

To connect from a Linux/Mac OS client, authenticate to Active Directory using the kinit command and then use sqlcmd tool to connect to the SQL Managed Instance.

```console
kinit <username>@<REALM>
sqlcmd -S <Endpoint DNS name>,<Endpoint port number> -E
```

For example, to connect with the CONTOSO\admin account to the SQL managed instance with endpoint `sqlmi.contoso.local` at port `31433`, use the following command:

```console
kinit admin@CONTOSO.LOCAL
sqlcmd -S sqlmi.contoso.local,31433 -E
```

In the example, `-E` specifies Active Directory integrated authentication.

## Connect SQL Managed Instance from Windows

To log in to SQL Managed Instance with your current Windows Active Directory login, run the following command:

```console
sqlcmd -S <DNS name for master instance>,31433 -E
```

## Connect to SQL Managed Instance from SSMS

![Connect with SSMS](media/active-directory-deployment/connect-with-ssms.png)

## Connect to SQL Managed Instance from ADS

![Connect with ADS](media/active-directory-deployment/connect-with-ads.png)
