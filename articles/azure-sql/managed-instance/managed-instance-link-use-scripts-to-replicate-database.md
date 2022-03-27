---
title: Replicate database with link feature with T-SQL and PowerShell scripts
titleSuffix: Azure SQL Managed Instance
description: This guide teaches you how to use the SQL Managed Instance link with scripts to replicate database from SQL Server to Azure SQL Managed Instance.
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

# Replicate database with Azure SQL Managed Instance link feature with T-SQL and PowerShell scripts

[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article teaches you to use scripts, T-SQL and PowerShell, to set up [Managed Instance link feature](link-feature.md) to replicate your database from SQL Server to Azure SQL Managed Instance.

Before configuring replication for your database through the link feature, make sure you've [prepared your environment](managed-instance-link-preparation.md). 

> [!NOTE]
> The link feature for Azure SQL Managed Instance is currently in preview.

> [!NOTE]
> Configuration on Azure side is done with PowerShell that calls SQL Managed Instance REST API. Support for Azure PowerShell and CLI will be released in the upcomming weeks. At that point this article will be updated with the simplified PowerShell scripts.

> [!TIP]
> SQL Managed Instance link database replication can be set up with [SSMS wizard](managed-instance-link-use-ssms-to-replicate-database.md).

## Prerequisites 

To replicate your databases to Azure SQL Managed Instance, you need the following prerequisites: 

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [SQL Server 2019 Enterprise or Developer edition](https://www.microsoft.com/en-us/evalcenter/evaluate-sql-server-2019), starting with [CU15 (15.0.4198.2)](https://support.microsoft.com/topic/kb5008996-cumulative-update-15-for-sql-server-2019-4b6a8ee9-1c61-482d-914f-36e429901fb6).
- An instance of Azure SQL Managed Instance. [Get started](instance-create-quickstart.md) if you don't have one. 
- [SQL Server Management Studio (SSMS) v18.11.1 or later](/sql/ssms/download-sql-server-management-studio-ssms).
- A properly [prepared environment](managed-instance-link-preparation.md).

## Replicate database

Use instructions below to manually setup the link between your instance of SQL Server and your instance of SQL Managed Instance. Once the link is created, your source database gets a read-only replica copy on your target Azure SQL Managed Instance. 

> [!NOTE]
> The link supports replication of user databases only. Replication of system databases is not supported. To replicate instance-level objects (stored in master or msdb databases), we recommend to script them out and run T-SQL scripts on the destination instance.

## Terminology and naming conventions

In executing scripts from this user guide, it's important not to mistaken, for example, SQL Server, or Managed Instance name, with their fully qualified domain names.
The following table is explaining what different names exactly represent, and how to obtain their values.

| Terminology	| Description | How to find out |
| :----| :------------- | :------------- | 
| SQL Server name | Also referred to as a short SQL Server name. For example: **"sqlserver1"**. This isn't a fully qualified domain name. | Execute **“SELECT @@SERVERNAME”** from T-SQL |
| SQL Server FQDN | Fully qualified domain name of your SQL Server. For example: **"sqlserver1.domain.com"**. | From your network (DNS) configuration on-prem, or Server name if using Azure VM. |
| Managed Instance name | Also referred to as a short Managed Instance name. For example: **"managedinstance1"**. | See the name of your Managed Instance in Azure portal. |
| SQL Managed Instance FQDN | Fully qualified domain name of your SQL Managed Instance name. For example: **"managedinstance1.6d710bcf372b.database.windows.net"**. | See the Host name at SQL Managed Instance overview page in Azure portal. |
| Resolvable domain name | DNS name that could be resolved to an IP address. For example, executing **"nslookup sqlserver1.domain.com"** should return an IP address, for example 10.0.1.100. | Use nslookup from the command prompt. |

## Trust between SQL Server and SQL Managed Instance

This first step in creating SQL Managed Instance link is establishing the trust between the two entities and secure the endpoints used for communication and encryption of data across the network. Distributed Availability Groups technology in SQL Server doesn't have its own database mirroring endpoint, but it rather uses the existing Availability Group database mirroring endpoint. This is why the security and trust between the two entities needs to be configured for the Availability Group database mirroring endpoint.

Certificates-based trust is the only supported way to secure database mirroring endpoints on SQL Server and SQL Managed Instance. In case you've existing Availability Groups that are using Windows Authentication, certificate based trust needs to be added to the existing mirroring endpoint as a secondary authentication option. This can be done by using ALTER ENDPOINT statement.

> [!IMPORTANT]
> Certificates are generated with an expiry date and time, and they need to be rotated before they expire.

Here's the overview of the process to secure database mirroring endpoints for both SQL Server and SQL Managed Instance:
- Generate certificate on SQL Server and obtain its public key.
- Obtain public key of SQL Managed Instance certificate.
- Exchange the public keys between the SQL Server and SQL Managed Instance.

The following section discloses steps to complete these actions.

## Create certificate on SQL Server and import its public key to Managed Instance

First, create master key on SQL Server and generate authentication certificate.
  
```sql
-- Execute on SQL Server
-- Create MASTER KEY encryption password
-- Keep the password confidential and in a secure place.
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

Then, use the following T-SQL query on SQL Server to verify the certificate has been created.
  
```sql
-- Execute on SQL Server
USE MASTER
GO
SELECT * FROM sys.certificates
```

In the query results you'll find the certificate and will see that it has been encrypted with the master key.

Now you can get the public key of the generated certificate on SQL Server.

```sql
-- Execute on SQL Server
-- Show the public key of the generated SQL Server certificate
USE MASTER
GO
DECLARE @sqlserver_certificate_name NVARCHAR(MAX) = N'Cert_' + @@servername  + N'_endpoint'
DECLARE @PUBLICKEYENC VARBINARY(MAX) = CERTENCODED(CERT_ID(@sqlserver_certificate_name));
SELECT @PUBLICKEYENC AS PublicKeyEncoded;
```

Save the value of PublicKeyEncoded from the output, as it will be needed for the next step.

Next step should be executed in PowerShell, with installed Az.Sql module, version 3.5.1 or higher, or use Azure Cloud Shell online to run the commands as it's always updated wit the latest module versions.
  
Execute the following PowerShell script in Azure Cloud Shell (fill out necessary user information, copy, paste into Azure Cloud Shell and execute).
Replace `<SubscriptionID>` with your Azure Subscription ID. Replace `<ManagedInstanceName>` with the short name  of your managed instance. Replace `<PublicKeyEncoded>` below with the public portion of the SQL Server certificate in binary format generated in the previous step. That will be a long string value starting with 0x, that you've obtained from SQL Server.

```powershell
# Execute in Azure Cloud Shell
# ===============================================================================
# POWERSHELL SCRIPT TO IMPORT SQL SERVER CERTIFICATE TO MANAGED INSTANCE
# USER CONFIGURABLE VALUES
# (C) 2021-2022 SQL Managed Instance product group
# ===============================================================================
# Enter your Azure Subscription ID
$SubscriptionID = "<YourSubscriptionID>"

# Enter your Managed Instance name – example "sqlmi1"
$ManagedInstanceName = "<YourManagedInstanceName>"

# Enter name for the server trust certificate - example "Cert_sqlserver1_endpoint"
$certificateName = "<YourServerTrustCertificateName>"

# Insert the cert public key blob you got from the SQL Server - example "0x1234567..."
$PublicKeyEncoded = "<PublicKeyEncoded>"

# ===============================================================================
# INVOKING THE API CALL -- REST OF THE SCRIPT IS NOT USER CONFIGURABLE
# ===============================================================================
# Log in and select Subscription if needed.
#
if ((Get-AzContext ) -eq $null)
{
    echo "Logging to Azure subscription"
    Login-AzAccount
}
Select-AzSubscription -SubscriptionName $SubscriptionID

# Build URI for the API call.
#
$miRG = (Get-AzSqlInstance -InstanceName $ManagedInstanceName).ResourceGroupName
$uriFull = "https://management.azure.com/subscriptions/" + $SubscriptionID + "/resourceGroups/" + $miRG+ "/providers/Microsoft.Sql/managedInstances/" + $ManagedInstanceName + "/serverTrustCertificates/" + $certificateName + "?api-version=2021-08-01-preview"
echo $uriFull

# Build API request body.
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

The result of this operation will be time stamp of the successful upload of the SQL Server certificate private key to Managed Instance.

## Get the Managed Instance public certificate public key and import it to SQL Server

Certificate for securing the endpoint for SQL Managed Instance link is automatically generated. This section describes how to get the SQL Managed Instance certificate public key, and how import is to SQL Server.

Use SSMS to connect to the SQL Managed Instance and execute stored procedure [sp_get_endpoint_certificate](/sql/relational-databases/system-stored-procedures/sp-get-endpoint-certificate-transact-sql) to get the certificate public key.

```sql
-- Execute on Managed Instance
EXEC sp_get_endpoint_certificate @endpoint_type = 4
```

Copy the entire public key from Managed Instance starting with “0x” shown in the previous step and use it in the below query on SQL Server by replacing `<InstanceCertificate>` with the key value. No quotations need to be used.

> [!IMPORTANT]
> Name of the certificate must be SQL Managed Instance FQDN.

```sql
-- Execute on SQL Server
USE MASTER
CREATE CERTIFICATE [<SQLManagedInstanceFQDN>]
FROM BINARY = <InstanceCertificate>
```

Finally, verify all created certificates by viewing the following DMV.

```sql
-- Execute on SQL Server
SELECT * FROM sys.certificates
```

## Mirroring endpoint on SQL Server

If you don’t have existing Availability Group nor mirroring endpoint on SQL Server, the next step is to create a mirroring endpoint on SQL Server and secure it with the certificate. If you do have existing Availability Group or mirroring endpoint, go straight to the next section “Altering existing database mirroring endpoint”
To verify that you don't have an existing database mirroring endpoint created, use the following script.

```sql
-- Execute on SQL Server
-- View database mirroring endpoints on SQL Server
SELECT * FROM sys.database_mirroring_endpoints WHERE type_desc = 'DATABASE_MIRRORING'
```

In case that the above query doesn't show there exists a previous database mirroring endpoint, execute the following script on SQL Server to create a new database mirroring endpoint on the port 5022 and secure it with a certificate.

```sql
-- Execute on SQL Server
-- Create connection endpoint listener on SQL Server
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

Validate that the mirroring endpoint was created by executing the following on SQL Server.

```sql
-- Execute on SQL Server
-- View database mirroring endpoints on SQL Server
SELECT
    name, type_desc, state_desc, role_desc,
    connection_auth_desc, is_encryption_enabled, encryption_algorithm_desc
FROM 
    sys.database_mirroring_endpoints
```

New mirroring endpoint was created with CERTIFICATE authentication, and AES encryption enabled.

### Altering existing database mirroring endpoint

> [!NOTE]
> Skip this step if you've just created a new mirroring endpoint. Use this step only if using existing Availability Groups with existing database mirroring endpoint.

In case existing Availability Groups are used for SQL Managed Instance link, or in case there's an existing database mirroring endpoint, first validate it satisfies the following mandatory conditions for SQL Managed Instance Link:
- Type must be “DATABASE_MIRRORING”.
- Connection authentication must be “CERTIFICATE”.
- Encryption must be enabled.
- Encryption algorithm must be “AES”.

Execute the following query on SQL Server to view details for an existing database mirroring endpoint.

```sql
-- Execute on SQL Server
-- View database mirroring endpoints on SQL Server
SELECT
    name, type_desc, state_desc, role_desc, connection_auth_desc,
    is_encryption_enabled, encryption_algorithm_desc
FROM
    sys.database_mirroring_endpoints
```

In case that the output shows that the existing DATABASE_MIRRORING endpoint connection_auth_desc isn't “CERTIFICATE”, or encryption_algorthm_desc isn't “AES”, the **endpoint needs to be altered to meet the requirements**.

On SQL Server, one database mirroring endpoint is used for both Availability Groups and Distributed Availability Groups. In case your connection_auth_desc is NTLM (Windows authentication) or KERBEROS, and you need Windows authentication for an existing Availability Groups, it's possible to alter the endpoint to use multiple authentication methods by switching the auth option to NEGOTIATE CERTIFICATE. This will allow the existing AG to use Windows authentication, while using certificate authentication for SQL Managed Instance. See details of possible options at documentation page for [sys.database_mirroring_endpoints](/sql/relational-databases/system-catalog-views/sys-database-mirroring-endpoints-transact-sql).

Similarly, if encryption doesn't include AES and you need RC4 encryption, it's possible to alter the endpoint to use both algorithms. See details of possible options at documentation page for [sys.database_mirroring_endpoints](/sql/relational-databases/system-catalog-views/sys-database-mirroring-endpoints-transact-sql).

The script below is provided as an example of how to alter your existing database mirroring endpoint on SQL Server. Depending on your existing specific configuration, you perhaps might need to customize it further for your scenario. Replace `<YourExistingEndpointName>` with your existing endpoint name. Replace `<CERTIFICATE-NAME>` with the name of the generated SQL Server certificate. You can also use `SELECT * FROM sys.certificates` to get the name of the created certificate on the SQL Server.

```sql
-- Execute on SQL Server
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

After running the ALTER endpoint query and setting the dual authentication mode to Windows and Certificate, use again this query on SQL Server to show the database mirroring endpoint details.

```sql
-- Execute on SQL Server
-- View database mirroring endpoints on SQL Server
SELECT
    name, type_desc, state_desc, role_desc, connection_auth_desc,
    is_encryption_enabled, encryption_algorithm_desc
FROM
    sys.database_mirroring_endpoints
```

With this you've successfully modified your database mirroring endpoint for SQL Managed Instance link.

## Availability Group on SQL Server

If you don't have existing AG the next step is to create an AG on SQL Server. If you do have existing AG go straight to the next section “Use existing Availability Group (AG) on SQL Server”. A new AG needs to be created with the following parameters for Managed Instance link:
-	Specify SQL Server name
-	Specify database name
-	Failover mode MANUAL
-	Seeding mode AUTOMATIC

Use the following script to create a new Availability Group on SQL Server. Replace `<SQLServerName>` with the name of your SQL Server. Find out your SQL Server name with executing the following T-SQL:

```sql
-- Execute on SQL Server
SELECT @@SERVERNAME AS SQLServerName 
```

Replace `<AGName>` with the name of your availability group. For multiple databases you'll need to create multiple Availability Groups. Managed Instance link requires one database per AG. In this respect, consider naming each AG so that its name reflects the corresponding database - for example `AG_<db_name>`. Replace `<DatabaseName>` with the name of database you wish to replicate. Replace `<SQLServerIP>` with SQL Server’s IP address. Alternatively, resolvable SQL Server host machine name can be used, but you need to make sure that the name is resolvable from SQL Managed Instance virtual network.

```sql
-- Execute on SQL Server
-- Create primary AG on SQL Server
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

> [!NOTE]
> One database per single Availability Group is the current product limitation for replication to SQL Managed Instance using the link feature.
> If you get the Error 1475 you'll have to create a full backup without COPY ONLY option, that will start new backup chain.
> As the best practice it's highly recommended that collation on SQL Server and SQL Managed Instance is the same. This is because depending on collation settings, AG and DAG names could, or could not be case sensitive. If there's a mismatch with this, there could be issues in ability to successfully connect SQL Server to Managed Instance.

Replace `<DAGName>` with the name of your distributed availability group. When replicating several databases, one availability group and one distributed availability groups is needed for each database so consider naming each item accordingly - for example `DAG_<db_name>`. Replace `<AGName>` with the name of availability group created in the previous step. Replace `<SQLServerIP>` with the IP address of SQL Server from the previous step. Alternatively, resolvable SQL Server host machine name can be used, but you need to make sure that the name is resolvable from SQL Managed Instance virtual network. Replace `<ManagedInstanceName>` with the short name of your SQL Managed Instance. Replace `<ManagedInstnaceFQDN>` with a fully qualified domain name of SQL Managed Instance.

```sql
-- Execute on SQL Server
-- Create DAG for AG and database
-- ManagedInstanceName example 'sqlmi1'
-- ManagedInstanceFQDN example 'sqlmi1.73d19f36a420a.database.windows.net'
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

### Verify AG and distributed AG

Use the following script to list all available Availability Groups and Distributed Availability Groups on the SQL Server. Availability Group state needs to be connected, and Distributed Availability Group state disconnected at this point. Distributed Availability Group state will move to `connected` only when it has been joined with SQL Managed Instance. This will be explained in one of the next steps.

```sql
-- Execute on SQL Server
-- This will show that Availability Group and Distributed Availability Group have been created on SQL Server.
SELECT * FROM sys.availability_groups
```

Alternatively, in SSMS object explorer, expand the “Always On High Availability”, then “Availability Groups” folder to show available Availability Groups and Distributed Availability Groups.

## Creating SQL Managed Instance link

The final step of the setup process is to create the SQL Managed Instance link. To accomplish this, a REST API call will be made. Invoking direct API calls will be replaced with PowerShell and CLI clients, which will be delivered in one of our next releases.

Invoking direct API call to Azure can be accomplished with various API clients. However, for simplicity of the process, execute the below PowerShell script from Azure Cloud Shell.

Log in to Azure portal and execute the below PowerShell scripts in Azure Cloud Shell. Make the following replacements with the actual values in the script: Replace `<SubscriptionID>` with your Azure Subscription ID. Replace `<ManagedInstanceName>` with the short name of your managed instance. Replace `<AGName>` with the name of Availability Group created on SQL Server. Replace `<DAGName>` with the name of Distributed Availability Group create on SQL Server. Replace `<DatabaseName>` with the database replicated in Availability Group on SQL Server. Replace `<SQLServerAddress>` with the address of the SQL Server. This can be a DNS name, or public IP or even private IP address, as long as the address provided can be resolved from the backend node hosting the SQL Managed Instance.
  
```powershell
# Execute in Azure Cloud Shell
# =============================================================================
# POWERSHELL SCRIPT FOR CREATING MANAGED INSTANCE LINK
# USER CONFIGURABLE VALUES
# (C) 2021-2022 SQL Managed Instance product group 
# =============================================================================
# Enter your Azure Subscription ID
$SubscriptionID = "<SubscriptionID>"
# Enter your Managed Instance name – example "sqlmi1"
$ManagedInstanceName = "<ManagedInstanceName>"
# Enter Availability Group name that was created on the SQL Server
$AGName = "<AGName>"
# Enter Distributed Availability Group name that was created on SQL Server
$DAGName = "<DAGName>"
# Enter database name that was placed in Availability Group for replciation
$DatabaseName = "<DatabaseName>"
# Enter SQL Server address
$SQLServerAddress = "<SQLServerAddress>"

# =============================================================================
# INVOKING THE API CALL -- THIS PART IS NOT USER CONFIGURABLE
# =============================================================================
# Log in to subscription if needed
if ((Get-AzContext ) -eq $null)
{
    echo "Logging to Azure subscription"
    Login-AzAccount
}
Select-AzSubscription -SubscriptionName $SubscriptionID
# -----------------------------------
# Build URI for the API call
# -----------------------------------
echo "Building API URI"
$miRG = (Get-AzSqlInstance -InstanceName $ManagedInstanceName).ResourceGroupName
$uriFull = "https://management.azure.com/subscriptions/" + $SubscriptionID + "/resourceGroups/" + $miRG+ "/providers/Microsoft.Sql/managedInstances/" + $ManagedInstanceName + "/distributedAvailabilityGroups/" + $DAGName + "?api-version=2021-05-01-preview"
echo $uriFull
# -----------------------------------
# Build API request body
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
# Get auth token and build the header
# -----------------------------------
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$currentAzureContext = Get-AzContext
$profileClient = New-Object Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient($azProfile)    
$token = $profileClient.AcquireAccessToken($currentAzureContext.Tenant.TenantId)
$authToken = $token.AccessToken
$headers = @{}
$headers.Add("Authorization", "Bearer "+"$authToken")
# -----------------------------------
# Invoke API call
# -----------------------------------
echo "Invoking API call to have Managed Instance join DAG on SQL Server"
$response = Invoke-WebRequest -Method PUT -Headers $headers -Uri $uriFull -ContentType "application/json" -Body $bodyFull
echo $response
```

The result of this operation will be the time stamp of the successful execution of request for Managed Instance link creation.

## Verifying created SQL Managed Instance link

To verify that connection has been made between SQL Managed Instance and SQL Server, execute the following query on SQL Server. Have in mind that connection will not be instantaneous upon executing the API call. It can take up to a minute for the DMV to start showing a successful connection. Keep refreshing the DMV until connection is shown as CONNECTED for SQL Managed Instance replica.

```sql
-- Execute on SQL Server
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

In addition, once the connection is established, Managed Instance Databases view in SSMS will initially show replicated database as “Restoring…”. This is because the initial seeding is in progress moving the full backup of the database, which is followed by the catchup replication. Once the seeding process is done, the database will no longer be in “Restoring…” state. For small databases, seeding might finish quickly so you might not see the initial “Restoring…” state in SSMS.

> [!IMPORTANT]
> The link will not work unless network connectivity exists between SQL Server and Managed Instance. To troubleshoot the network connectivity following steps described in [test bidirectional network connectivity](managed-instance-link-preparation.md#test-bidirectional-network-connectivity).

> [!IMPORTANT]
> Make regular backups of the log file on SQL Server. If the log space used reaches 100%, the replication to SQL Managed Instance will stop until this space use is reduced. It is highly recommended that you automate log backups through setting up a daily job. For more details on how to do this see [Backup log files on SQL Server](link-feature-best-practices.md#take-log-backups-regularly).

## Next steps

For more information on the link feature, see the following:

- [Managed Instance link – connecting SQL Server to Azure reimagined](https://aka.ms/mi-link-techblog).
- [Prepare for SQL Managed Instance link](./managed-instance-link-preparation.md).
- [Use SQL Managed Instance link with scripts to migrate database](./managed-instance-link-use-scripts-to-failover-database.md).
- [Use SQL Managed Instance link via SSMS to replicate database](./managed-instance-link-use-ssms-to-replicate-database.md).
- [Use SQL Managed Instance link via SSMS to migrate database](./managed-instance-link-use-ssms-to-failover-database.md).
