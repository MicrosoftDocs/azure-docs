---
title: Replicate a database with the link via T-SQL & PowerShell scripts
titleSuffix: Azure SQL Managed Instance
description: Learn how to use a Managed Instance link with T-SQL and PowerShell scripts to replicate a database from SQL Server to Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: data-movement
ms.custom: 
ms.devlang: 
ms.topic: guide
author: sasapopo
ms.author: sasapopo
ms.reviewer: mathoma, danil
ms.date: 03/22/2022
---

# Replicate a database with the link feature via T-SQL and PowerShell scripts - Azure SQL Managed Instance

[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article teaches you how to use Transact-SQL (T-SQL) and PowerShell scripts to replicate your database from SQL Server to Azure SQL Managed Instance by using a [Managed Instance link](link-feature.md).

> [!NOTE]
> - The link is a feature of Azure SQL Managed Instance and is currently in preview. You can also use a [SQL Server Management Studio (SSMS) wizard](managed-instance-link-use-ssms-to-replicate-database.md) to set up the link to replicate your database. 
> - The PowerShell scripts in this article call SQL Managed Instance REST APIs.


## Prerequisites 

To replicate your databases to SQL Managed Instance, you need the following prerequisites: 

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [SQL Server 2019 Enterprise or Developer edition](https://www.microsoft.com/en-us/evalcenter/evaluate-sql-server-2019), starting with [CU15 (15.0.4198.2)](https://support.microsoft.com/topic/kb5008996-cumulative-update-15-for-sql-server-2019-4b6a8ee9-1c61-482d-914f-36e429901fb6).
- Azure SQL Managed Instance. [Get started](instance-create-quickstart.md) if you don't have it. 
- [SQL Server Management Studio v18.11.1 or later](/sql/ssms/download-sql-server-management-studio-ssms).
- A properly [prepared environment](managed-instance-link-preparation.md).

## Replicate a database

Use the following instructions to manually set up the link between your SQL Server instance and managed instance. After the link is created, your source database gets a read-only replica copy on your target managed instance. 

> [!NOTE]
> The link supports replication of user databases only. Replication of system databases is not supported. To replicate instance-level objects (stored in master or msdb databases), we recommend that you script them out and run T-SQL scripts on the destination instance.

## Terminology and naming conventions

As you run scripts from this user guide, it's important not to mistake SQL Server and SQL Managed Instance names for their fully qualified domain names (FQDNs). The following table explains what the various names exactly represent and how to obtain their values:

| Terminology	| Description | How to find out |
| :----| :------------- | :------------- | 
| SQL Server name | Also called a short SQL Server name. For example: *sqlserver1*. This isn't a fully qualified domain name. | Run `SELECT @@SERVERNAME` from T-SQL. |
| SQL Server FQDN | Fully qualified domain name of your SQL Server instance. For example: *sqlserver1.domain.com*. | See your network (DNS) configuration on-premises, or the server name if you're using an Azure virtual machine (VM). |
| SQL Managed Instance name | Also called a short SQL Managed Instance name. For example: *managedinstance1*. | See the name of your managed instance in the Azure portal. |
| SQL Managed Instance FQDN | Fully qualified domain name of your SQL Managed Instance name. For example: *managedinstance1.6d710bcf372b.database.windows.net*. | See the host name on the SQL Managed Instance overview page in the Azure portal. |
| Resolvable domain name | DNS name that can be resolved to an IP address. For example, running *nslookup sqlserver1.domain.com* should return an IP address such as 10.0.1.100. | Use nslookup from the command prompt. |

## Establish trust between instances

The first step in setting up a link is to establish trust between the two instances and secure the endpoints that are used to communicate and encrypt data across the network. Distributed availability groups use the existing availability group database mirroring endpoint, rather than having their own dedicated endpoint. This is why security and trust need to be configured between the two entities through the availability group database mirroring endpoint.

Certificate-based trust is the only supported way to secure database mirroring endpoints on SQL Server and SQL Managed Instance. If you have existing availability groups that use Windows authentication, you need to add certificate-based trust to the existing mirroring endpoint as a secondary authentication option. You can do this by using the `ALTER ENDPOINT` statement.

> [!IMPORTANT]
> Certificates are generated with an expiration date and time. They must be rotated before they expire.

Here's an overview of the process to secure database mirroring endpoints for both SQL Server and SQL Managed Instance:

1. Generate a certificate on SQL Server and obtain its public key.
1. Obtain a public key of the SQL Managed Instance certificate.
1. Exchange the public keys between SQL Server and SQL Managed Instance.

The following sections describe these steps in detail.

### Create a certificate on SQL Server and import its public key to SQL Managed Instance

First, create a master key on SQL Server and generate an authentication certificate:
  
```sql
-- Run on SQL Server
-- Create a master key encryption password
-- Keep the password confidential and in a secure place
USE MASTER
CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<strong_password>'
GO

-- Create the SQL Server certificate for the instance link
USE MASTER
GO

DECLARE @sqlserver_certificate_name NVARCHAR(MAX) = N'Cert_' + @@servername  + N'_endpoint'
DECLARE @sqlserver_certificate_subject NVARCHAR(MAX) = N'Certificate for ' + @sqlserver_certificate_name
DECLARE @create_sqlserver_certificate_command NVARCHAR(MAX) = N'CREATE CERTIFICATE [' + @sqlserver_certificate_name + '] WITH SUBJECT = ''' + @sqlserver_certificate_subject + ''', EXPIRY_DATE = ''03/30/2025'''
EXEC sp_executesql @stmt = @create_sqlserver_certificate_command
GO
```

Then, use the following T-SQL query on SQL Server to verify that the certificate has been created:
  
```sql
-- Run on SQL Server
USE MASTER
GO
SELECT * FROM sys.certificates
```

In the query results, you'll see that the certificate has been encrypted with the master key.

Now you can get the public key of the generated certificate on SQL Server:

```sql
-- Run on SQL Server
-- Show the public key of the generated SQL Server certificate
USE MASTER
GO
DECLARE @sqlserver_certificate_name NVARCHAR(MAX) = N'Cert_' + @@servername  + N'_endpoint'
DECLARE @PUBLICKEYENC VARBINARY(MAX) = CERTENCODED(CERT_ID(@sqlserver_certificate_name));
SELECT @PUBLICKEYENC AS PublicKeyEncoded;
```

Save the value of `PublicKeyEncoded` from the output, because you'll need it for the next step.

For the next step, use PowerShell with the installed [Az.Sql module](https://www.powershellgallery.com/packages/Az.Sql/3.7.1), version 3.5.1 or later. Or use Azure Cloud Shell online to run the commands, because it's always updated with the latest module versions.
  
Run the following PowerShell script. (If you use Cloud Shell, fill out necessary user information, copy it, paste it into Cloud Shell, and then run the script.) Replace:

- `<SubscriptionID>` with your Azure subscription ID. 
- `<ManagedInstanceName>` with the short name of your managed instance. 
- `<PublicKeyEncoded>` with the public portion of the SQL Server certificate in binary format, which you generated in the previous step. It's a long string value that starts with `0x`.

```powershell
# Run in Azure Cloud Shell
# ===============================================================================
# POWERSHELL SCRIPT TO IMPORT SQL SERVER CERTIFICATE TO MANAGED INSTANCE
# USER CONFIGURABLE VALUES
# (C) 2021-2022 SQL Managed Instance product group
# ===============================================================================
# Enter your Azure subscription ID
$SubscriptionID = "<YourSubscriptionID>"

# Enter your managed instance name – for example, "sqlmi1"
$ManagedInstanceName = "<YourManagedInstanceName>"

# Enter the name for the server trust certificate – for example, "Cert_sqlserver1_endpoint"
$certificateName = "<YourServerTrustCertificateName>"

# Insert the certificate public key blob that you got from SQL Server – for example, "0x1234567..."

$PublicKeyEncoded = "<PublicKeyEncoded>"

# ===============================================================================
# INVOKING THE API CALL -- REST OF THE SCRIPT IS NOT USER CONFIGURABLE
# ===============================================================================
# Log in and select a subscription if needed.
#
if ((Get-AzContext ) -eq $null)
{
    echo "Logging to Azure subscription"
    Login-AzAccount
}
Select-AzSubscription -SubscriptionName $SubscriptionID

# Build the URI for the API call.
#
$miRG = (Get-AzSqlInstance -InstanceName $ManagedInstanceName).ResourceGroupName
$uriFull = "https://management.azure.com/subscriptions/" + $SubscriptionID + "/resourceGroups/" + $miRG+ "/providers/Microsoft.Sql/managedInstances/" + $ManagedInstanceName + "/serverTrustCertificates/" + $certificateName + "?api-version=2021-08-01-preview"
echo $uriFull

# Build the API request body.
#
$bodyFull = "{ `"properties`":{ `"PublicBlob`":`"$PublicKeyEncoded`" } }"

echo $bodyFull 

# Get auth token and build the HTTP request header.
#
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$currentAzureContext = Get-AzContext
$profileClient = New-Object Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient($azProfile)
$token = $profileClient.AcquireAccessToken($currentAzureContext.Tenant.TenantId)
$authToken = $token.AccessToken
$headers = @{}
$headers.Add("Authorization", "Bearer "+"$authToken")

# Invoke API call
#
Invoke-WebRequest -Method PUT -Headers $headers -Uri $uriFull -ContentType "application/json" -Body $bodyFull
```

The result of this operation will be a time stamp of the successful upload of the SQL Server certificate private key to SQL Managed Instance.

### Get the certificate public key from SQL Managed Instance and import it to SQL Server

The certificate for securing the endpoint for a link is automatically generated. This section describes how to get the certificate public key from SQL Managed Instance, and how to import it to SQL Server.

Use SSMS to connect to SQL Managed Instance. Run the stored procedure [sp_get_endpoint_certificate](/sql/relational-databases/system-stored-procedures/sp-get-endpoint-certificate-transact-sql) to get the certificate public key:

```sql
-- Run on a managed instance
EXEC sp_get_endpoint_certificate @endpoint_type = 4
```

Copy the entire public key (which starts with `0x`) from SQL Managed Instance. Run the following query on SQL Server by replacing `<InstanceCertificate>` with the key value. You don't need to use quotation marks.

> [!IMPORTANT]
> The name of the certificate must be the SQL Managed Instance FQDN.

```sql
-- Run on SQL Server
USE MASTER
CREATE CERTIFICATE [<SQLManagedInstanceFQDN>]
FROM BINARY = <InstanceCertificate>
```

Finally, verify all created certificates by using the following dynamic management view (DMV):

```sql
-- Run on SQL Server
SELECT * FROM sys.certificates
```

## Create a mirroring endpoint on SQL Server

If you don't have an existing availability group or a mirroring endpoint on SQL Server, the next step is to create a mirroring endpoint on SQL Server and secure it with the certificate. If you do have an existing availability group or mirroring endpoint, go straight to the next section, [Alter an existing endpoint](#alter-an-existing-endpoint).

To verify that you don't have an existing database mirroring endpoint created, use the following script:

```sql
-- Run on SQL Server
-- View database mirroring endpoints on SQL Server
SELECT * FROM sys.database_mirroring_endpoints WHERE type_desc = 'DATABASE_MIRRORING'
```

If the preceding query doesn't show an existing database mirroring endpoint, run the following script on SQL Server. It creates a new database mirroring endpoint on port 5022 and secures the endpoint with a certificate.

```sql
-- Run on SQL Server
-- Create a connection endpoint listener on SQL Server
USE MASTER
CREATE ENDPOINT database_mirroring_endpoint
    STATE=STARTED   
    AS TCP (LISTENER_PORT=5022, LISTENER_IP = ALL)
    FOR DATABASE_MIRRORING (
        ROLE=ALL,
        AUTHENTICATION = CERTIFICATE <SQL_SERVER_CERTIFICATE>,
        ENCRYPTION = REQUIRED ALGORITHM AES
    )  
GO
```

Validate that the mirroring endpoint was created by running the following script on SQL Server:

```sql
-- Run on SQL Server
-- View database mirroring endpoints on SQL Server
SELECT
    name, type_desc, state_desc, role_desc,
    connection_auth_desc, is_encryption_enabled, encryption_algorithm_desc
FROM 
    sys.database_mirroring_endpoints
```

A new mirroring endpoint was created with certificate authentication and AES encryption enabled.

### Alter an existing endpoint

> [!NOTE]
> Skip this step if you've just created a new mirroring endpoint. Use this step only if you're using existing availability groups with an existing database mirroring endpoint.

If you're using existing availability groups for the link, or if there's an existing database mirroring endpoint, first validate that it satisfies the following mandatory conditions for the link:

- Type must be `DATABASE_MIRRORING`.
- Connection authentication must be `CERTIFICATE`.
- Encryption must be enabled.
- Encryption algorithm must be `AES`.

Run the following query on SQL Server to view details for an existing database mirroring endpoint:

```sql
-- Run on SQL Server
-- View database mirroring endpoints on SQL Server
SELECT
    name, type_desc, state_desc, role_desc, connection_auth_desc,
    is_encryption_enabled, encryption_algorithm_desc
FROM
    sys.database_mirroring_endpoints
```

If the output shows that the existing `DATABASE_MIRRORING` endpoint `connection_auth_desc` isn't `CERTIFICATE`, or `encryption_algorthm_desc` isn't `AES`, the *endpoint needs to be altered to meet the requirements*.

On SQL Server, the same database mirroring endpoint is used for both availability groups and distributed availability groups. If your `connection_auth_desc` endpoint is `NTLM` (Windows authentication) or `KERBEROS`, and you need Windows authentication for an existing availability group, it's possible to alter the endpoint to use multiple authentication methods by switching the authentication option to `NEGOTIATE CERTIFICATE`. This change will allow the existing availability group to use Windows authentication, while using certificate authentication for SQL Managed Instance. 

Similarly, if encryption doesn't include AES and you need RC4 encryption, it's possible to alter the endpoint to use both algorithms. For details about possible options for altering endpoints, see the [documentation page for sys.database_mirroring_endpoints](/sql/relational-databases/system-catalog-views/sys-database-mirroring-endpoints-transact-sql).

The following script is an example of how to alter your existing database mirroring endpoint on SQL Server. Replace:

- `<YourExistingEndpointName>` with your existing endpoint name. 
- `<CERTIFICATE-NAME>` with the name of the generated SQL Server certificate. 

Depending on your specific configuration, you might need to customize the script further. You can also use `SELECT * FROM sys.certificates` to get the name of the created certificate on SQL Server.

```sql
-- Run on SQL Server
-- Alter the existing database mirroring endpoint to use CERTIFICATE for authentication and AES for encryption
USE MASTER
ALTER ENDPOINT <YourExistingEndpointName>   
    STATE=STARTED   
    AS TCP (LISTENER_PORT=5022, LISTENER_IP = ALL)
    FOR DATABASE_MIRRORING (
        ROLE=ALL,
        AUTHENTICATION = WINDOWS NEGOTIATE CERTIFICATE <CERTIFICATE-NAME>,
        ENCRYPTION = REQUIRED ALGORITHM AES
    )
GO
```

After you run the `ALTER` endpoint query and set the dual authentication mode to Windows and certificate, use this query again on SQL Server to show details for the database mirroring endpoint:

```sql
-- Run on SQL Server
-- View database mirroring endpoints on SQL Server
SELECT
    name, type_desc, state_desc, role_desc, connection_auth_desc,
    is_encryption_enabled, encryption_algorithm_desc
FROM
    sys.database_mirroring_endpoints
```

You've successfully modified your database mirroring endpoint for a SQL Managed Instance link.

## Create an availability group on SQL Server

If you don't have an existing availability group, the next step is to create one on SQL Server. Create an availability group with the following parameters for a link:

-	SQL Server name
-	Database name
-	A failover mode of `MANUAL`
-	A seeding mode of `AUTOMATIC`

First, find out your SQL Server name by running the following T-SQL statement:

```sql
-- Run on SQL Server
SELECT @@SERVERNAME AS SQLServerName 
```

Then, use the following script to create the availability group on SQL Server. Replace:

- `<SQLServerName>` with the name of your SQL Server instance. 
- `<AGName>` with the name of your availability group. For multiple databases, you'll need to create multiple availability groups. A Managed Instance link requires one database per availability group. Consider naming each availability group so that its name reflects the corresponding database - for example, `AG_<db_name>`. 
- `<DatabaseName>` with the name of database that you want to replicate.
- `<SQLServerIP>` with the SQL Server IP address. You can use a resolvable SQL Server host machine name as an alternative, but you need to make sure that the name is resolvable from the SQL Managed Instance virtual network.

```sql
-- Run on SQL Server
-- Create the primary availability group on SQL Server
USE MASTER
CREATE AVAILABILITY GROUP [<AGName>]
WITH (CLUSTER_TYPE = NONE)
    FOR database [<DatabaseName>]  
    REPLICA ON   
        '<SQLServerName>' WITH   
            (  
            ENDPOINT_URL = 'TCP://<SQLServerIP>:5022',
            AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,
            FAILOVER_MODE = MANUAL,
            SEEDING_MODE = AUTOMATIC
            );
GO
```

Consider the following:

- The link currently supports replicating one database per availability group. You can replicate multiple databases to SQL Managed Instance by setting up multiple links.
- Collation between SQL Server and SQL Managed Instance should be the same. A mismatch in collation could cause a mismatch in server name casing and prevent a successful connection from SQL Server to SQL Managed Instance.
- Error 1475 indicates that you need to start a new backup chain by creating a full backup without the `COPY ONLY` option.

In the following code, replace:

- `<DAGName>` with the name of your distributed availability group. When you're replicating several databases, you need one availability group and one distributed availability group for each database. Consider naming each item accordingly - for example, `DAG_<db_name>`. 
- `<AGName>` with the name of the availability group that you created in the previous step. 
- `<SQLServerIP>` with the IP address of SQL Server from the previous step. You can use a resolvable SQL Server host machine name as an alternative, but make sure that the name is resolvable from the SQL Managed Instance virtual network. 
- `<ManagedInstanceName>` with the short name of your managed instance. 
- `<ManagedInstnaceFQDN>` with the fully qualified domain name of your managed instance.

```sql
-- Run on SQL Server
-- Create a distributed availability group for the availability group and database
-- ManagedInstanceName example: 'sqlmi1'
-- ManagedInstanceFQDN example: 'sqlmi1.73d19f36a420a.database.windows.net'
USE MASTER
CREATE AVAILABILITY GROUP [<DAGName>]
  WITH (DISTRIBUTED) 
  AVAILABILITY GROUP ON  
  '<AGName>' WITH 
  (
    LISTENER_URL = 'TCP://<SQLServerIP>:5022',
    AVAILABILITY_MODE = ASYNCHRONOUS_COMMIT,
    FAILOVER_MODE = MANUAL,
    SEEDING_MODE = AUTOMATIC,
    SESSION_TIMEOUT = 20
  ),
  '<ManagedInstanceName>' WITH
  (
    LISTENER_URL = 'tcp://<ManagedInstanceFQDN>:5022;Server=[<ManagedInstanceName>]',
    AVAILABILITY_MODE = ASYNCHRONOUS_COMMIT,
    FAILOVER_MODE = MANUAL,
    SEEDING_MODE = AUTOMATIC
  );
GO
```

### Verify availability groups

Use the following script to list all availability groups and distributed availability groups on the SQL Server instance. At this point, the state of your availability group needs to be `connected`, and the state of your distributed availability groups needs to be `disconnected`. The state of the distributed availability group will move to `connected` only when it has been joined with SQL Managed Instance. 

```sql
-- Run on SQL Server
-- This will show that the availability group and distributed availability group have been created on SQL Server.
SELECT * FROM sys.availability_groups
```

Alternatively, you can use SSMS Object Explorer to find availability groups and distributed availability groups. Expand the **Always On High Availability** folder and then the **Availability Groups** folder.

## Create a link

The final step of the setup process is to create the link. At this time, you accomplish this by making a REST API call. 

You can invoke direct API calls to Azure by using various API clients. For simplicity of the process, sign in to the Azure portal and run the following PowerShell script from Azure Cloud Shell. Replace: 

- `<SubscriptionID>` with your Azure subscription ID. 
- `<ManagedInstanceName>` with the short name of your managed instance. 
- `<AGName>` with the name of the availability group created on SQL Server. 
- `<DAGName>` with the name of the distributed availability group created on SQL Server. 
- `<DatabaseName>` with the database replicated in the availability group on SQL Server. 
- `<SQLServerAddress>` with the address of the SQL Server instance. This can be a DNS name, a public IP address, or even a private IP address. The provided address must be resolvable from the back-end node that hosts the managed instance.
  
```powershell
# Run in Azure Cloud Shell
# =============================================================================
# POWERSHELL SCRIPT FOR CREATING MANAGED INSTANCE LINK
# USER CONFIGURABLE VALUES
# (C) 2021-2022 SQL Managed Instance product group 
# =============================================================================
# Enter your Azure subscription ID
$SubscriptionID = "<SubscriptionID>"
# Enter your managed instance name – for example, "sqlmi1"
$ManagedInstanceName = "<ManagedInstanceName>"
# Enter the availability group name that was created on SQL Server
$AGName = "<AGName>"
# Enter the distributed availability group name that was created on SQL Server
$DAGName = "<DAGName>"
# Enter the database name that was placed in the availability group for replication
$DatabaseName = "<DatabaseName>"
# Enter the SQL Server address
$SQLServerAddress = "<SQLServerAddress>"

# =============================================================================
# INVOKING THE API CALL -- THIS PART IS NOT USER CONFIGURABLE
# =============================================================================
# Log in to the subscription if needed
if ((Get-AzContext ) -eq $null)
{
    echo "Logging to Azure subscription"
    Login-AzAccount
}
Select-AzSubscription -SubscriptionName $SubscriptionID
# -----------------------------------
# Build the URI for the API call
# -----------------------------------
echo "Building API URI"
$miRG = (Get-AzSqlInstance -InstanceName $ManagedInstanceName).ResourceGroupName
$uriFull = "https://management.azure.com/subscriptions/" + $SubscriptionID + "/resourceGroups/" + $miRG+ "/providers/Microsoft.Sql/managedInstances/" + $ManagedInstanceName + "/distributedAvailabilityGroups/" + $DAGName + "?api-version=2021-05-01-preview"
echo $uriFull
# -----------------------------------
# Build the API request body
# -----------------------------------
echo "Buildign API request body"
$bodyFull = @"
{
    "properties":{
        "TargetDatabase":"$DatabaseName",
        "SourceEndpoint":"TCP://$SQLServerAddress`:5022",
        "PrimaryAvailabilityGroupName":"$AGName",
        "SecondaryAvailabilityGroupName":"$ManagedInstanceName",
    }
}
"@
echo $bodyFull 
# -----------------------------------
# Get the authentication token and build the header
# -----------------------------------
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$currentAzureContext = Get-AzContext
$profileClient = New-Object Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient($azProfile)    
$token = $profileClient.AcquireAccessToken($currentAzureContext.Tenant.TenantId)
$authToken = $token.AccessToken
$headers = @{}
$headers.Add("Authorization", "Bearer "+"$authToken")
# -----------------------------------
# Invoke the API call
# -----------------------------------
echo "Invoking API call to have Managed Instance join DAG on SQL Server"
$response = Invoke-WebRequest -Method PUT -Headers $headers -Uri $uriFull -ContentType "application/json" -Body $bodyFull
echo $response
```

The result of this operation will be a time stamp of the successful execution of the request to create a link.

## Verify the link

To verify that connection has been made between SQL Managed Instance and SQL Server, run the following query on SQL Server. The connection will not be instantaneous after you make the API call. It can take up to a minute for the DMV to start showing a successful connection. Keep refreshing the DMV until the connection appears as `CONNECTED` for the SQL Managed Instance replica.

```sql
-- Run on SQL Server
SELECT
    r.replica_server_name AS [Replica],
    r.endpoint_url AS [Endpoint],
    rs.connected_state_desc AS [Connected state],
    rs.last_connect_error_description AS [Last connection error],
    rs.last_connect_error_number AS [Last connection error No],
    rs.last_connect_error_timestamp AS [Last error timestamp]
FROM
    sys.dm_hadr_availability_replica_states rs
    JOIN sys.availability_replicas r
    ON rs.replica_id = r.replica_id
```

After the connection is established, the **Managed Instance Databases** view in SSMS initially shows the replicated databases in a **Restoring** state as the initial seeding phase moves and restores the full backup of the database. After the database is restored, replication has to catch up to bring the two databases to a synchronized state. The database will no longer be in **Restoring** after the initial seeding finishes. Seeding small databases might be fast enough that you won't see the initial **Restoring** state in SSMS.

> [!IMPORTANT]
> - The link won't work unless network connectivity exists between SQL Server and SQL Managed Instance. To troubleshoot network connectivity, follow the steps in [Test bidirectional network connectivity](managed-instance-link-preparation.md#test-bidirectional-network-connectivity).
> - Take regular backups of the log file on SQL Server. If the used log space reaches 100 percent, replication to SQL Managed Instance stops until space use is reduced. We highly recommend that you automate log backups by setting up a daily job. For details, see [Back up log files on SQL Server](link-feature-best-practices.md#take-log-backups-regularly).


## Next steps

For more information on the link feature, see the following resources:

- [Managed Instance link – connecting SQL Server to Azure reimagined](https://aka.ms/mi-link-techblog)
- [Prepare your environment for a Managed Instance link](./managed-instance-link-preparation.md)
- [Use a Managed Instance link with scripts to migrate a database](./managed-instance-link-use-scripts-to-failover-database.md)
- [Use a Managed Instance link via SSMS to replicate a database](./managed-instance-link-use-ssms-to-replicate-database.md)
- [Use a Managed Instance link via SSMS to migrate a database](./managed-instance-link-use-ssms-to-failover-database.md)
