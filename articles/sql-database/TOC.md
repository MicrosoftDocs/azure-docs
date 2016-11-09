# Overview
## [What is SQL Database?](sql-database-technical-overview.md)
## Features
### [Service tiers](sql-database-service-tiers.md)
### [What is a DTU?](sql-database-what-is-a-dtu.md)
### [DTU benchmark overview](sql-database-benchmark-overview.md)
### [Management tools](sql-database-manage-overview.md)
## Consideration and limitations
### [SQL Database versus SQL on a VM](sql-database-paas-vs-sql-server-iaas.md)
### [T-SQL differences](sql-database-transact-sql-information.md)
### [Resource limits](sql-database-resource-limits.md)
### [General limitations](sql-database-general-limitations.md)

## Benefits
### [Learns and adapts](sql-database-learn-and-adapt.md)
### [Scales on the fly](sql-database-scale-on-the-fly.md)
### [Builds multitenant apps](sql-database-build-multi-tenant-apps.md)
### [Secures and protects](sql-database-helps-secures-and-protects.md)
### [Works in your environment](sql-database-works-in-your-environment.md)

## Scenarios

### Servers, pools, databases, and firewalls
#### [When to use an elastic database pool](sql-database-elastic-pool-guidance.md)
#### [Elastic database pools](sql-database-elastic-pool.md)
#### [Automation](sql-database-manage-automation.md)
#### Modify service tiers and performance levels
##### [Azure portal](sql-database-scale-up.md)
##### [PowerShell](sql-database-scale-up-powershell.md)

### Scaled-out databases
#### [Overview](sql-database-elastic-scale-introduction.md)
#### [Build scalable cloud databases](sql-database-elastic-database-client-library.md)
#### [Cross-database jobs](sql-database-elastic-jobs-overview.md)
#### [Elastic database tools glossary](sql-database-elastic-scale-glossary.md)
#### [FAQ](sql-database-elastic-scale-faq.md)

### Access and permissions
#### [Overview](sql-database-security.md)
#### [Azure Security Center for Azure SQL Database](,,/security-center/security-center-sql-database.md?toc=%2fazure%2fsql-database%2ftoc.json)
#### [SQL Security Center](https://msdn.microsoft.com/library/azure/bb510589)

### Business continuity
#### [Overview](sql-database-business-continuity.md)
#### [Database backups](sql-database-automated-backups.md)
#### [Database recovery using backups](sql-database-recovery-using-backups.md)
#### [Authentication requirements for disaster recovery](sql-database-geo-replication-security-config.md)
#### [Business continuity design scenarios](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
#### [Disaster recovery strategies with elastic pools](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md)
#### [Rolling upgrades](sql-database-manage-application-rolling-upgrade.md)

### [Database performance](sql-database-single-database-monitor.md)
### [Database development](sql-database-develop-overview.md)
### [Migrate SQL Server databases](sql-database-cloud-migrate.md)

## Customer Implementations
### [Daxko/CSI Software](sql-database-implementation-daxko.md)
### [GEP](sql-database-implementation-gep.md)
### [SnelStart](sql-database-implementation-snelstart.md)
### [Umbraco](sql-database-implementation-umbraco.md)

## [SQL Database FAQ](sql-database-faq.md)
## [Security guidelines](sql-database-security-guidelines.md)


# Get Started
## Create a SQL Database
### [Azure portal](sql-database-get-started.md)
### [C#](sql-database-get-started-csharp.md)
### [PowerShell](sql-database-get-started-powershell.md)

## [Create and manage access and permissions](sql-database-get-started-security.md)

## Manage servers, pools, databases and firewalls
### [Azure portal](sql-database-manage-portal.md)
### [SQL Server Management Studio](sql-database-manage-azure-ssms.md)
### [PowerShell](sql-database-manage-powershell.md)


## Secure and protect data
### [Auditing](sql-database-auditing-get-started.md)
### [Threat detection](sql-database-threat-detection-get-started.md)
### Dynamic data masking
#### [Azure portal](sql-database-dynamic-data-masking-get-started-portal.md)

## Create and manage scaled-out databases
### [Elastic scale](sql-database-elastic-scale-get-started.md)
### [Elastic jobs](sql-database-elastic-jobs-getting-started.md)
### Elastic queries
### [Cross database reports](sql-database-elastic-query-getting-started.md)
### [Cross database queries](sql-database-elastic-query-getting-started-vertical.md)

## [In-memory optimization](sql-database-in-memory.md)

## [Moving databases](sql-database-troubleshoot-moving-data.md)

## [Data sync](sql-database-get-started-sql-data-sync.md)

##Monitor and tune databases
### [SQL Database Advisor overview](sql-database-advisor.md)
### [Workload insights in the Azure portal](sql-database-performance.md)

## [Solution quick-starts](sql-database-solution-quick-starts.md)


# How To

## Create
### Elastic database pools
#### [Azure portal](sql-database-elastic-pool-create-portal.md)
#### [C#](sql-database-elastic-pool-create-csharp.md)
#### [PowerShell](sql-database-elastic-pool-create-powershell.md)
### Databases
#### Sharded databases
##### [Use shard map manager](sql-database-elastic-scale-shard-map-management.md)
##### [Split merge security configuration](sql-database-elastic-scale-split-merge-security-configuration.md)
##### [Working with Dapper](sql-database-elastic-scale-working-with-dapper.md)
##### [Use entity framework](sql-database-elastic-scale-use-entity-framework-applications-visual-studio.md)
##### [Data dependent routing](sql-database-elastic-scale-data-dependent-routing.md)
##### [Multitenant row level security](sql-database-elastic-tools-multi-tenant-row-level-security.md)
### Firewall rules
#### Server
##### [Azure Portal](sql-database-configure-firewall-settings.md)
##### [PowerShell](sql-database-configure-firewall-settings-powershell.md)
##### [REST API](sql-database-configure-firewall-settings-rest.md)
#### Database
### Jobs
#### [Service installation](sql-database-elastic-jobs-service-installation.md)
#### [Azure portal](sql-database-elastic-jobs-create-and-manage.md)
#### [PowerShell](sql-database-elastic-jobs-powershell.md)

## Develop
### [Overview](https://msdn.microsoft.com/library/mt763826.aspx)
### Scenarios
#### [Multitenant SaaS applications](sql-database-design-patterns-multi-tenancy-saas-applications.md)
#### Temporal tables
##### [Temporal tables](sql-database-temporal-tables.md)
##### [Retention policies](sql-database-temporal-tables-retention-policy.md)
#### [JSON data](sql-database-json-features.md)
#### [In-memory](sql-database-in-memory.md)
### Get started
#### [Connectivity libraries](sql-database-libraries.md)
#### Connect an application
##### [.NET](sql-database-develop-dotnet-simple.md)
##### [Java](sql-database-develop-java-simple.md)
##### [Node.js](sql-database-develop-nodejs-simple.md)
##### [PHP](sql-database-develop-php-simple.md)
##### [Python](sql-database-develop-python-simple.md)
##### [Ruby](sql-database-develop-ruby-simple.md)
##### [Excel](sql-database-connect-excel.md)
#### [Connect with Visual Studio](sql-database-connect-query.md)

### Create
#### Create elastic pools
##### [PowerShell](sql-database-elastic-pool-create-powershell.md)
##### [C#](sql-database-elastic-pool-create-csharp.md)
#### Create firewall rules
##### [PowerShell](sql-database-configure-firewall-settings-powershell.md)
##### [REST API](sql-database-configure-firewall-settings-rest.md)
### Manage
#### [Manage using PowerShell](sql-database-manage-powershell.md)
#### Manage elastic pools
##### [PowerShell](sql-database-elastic-pool-manage-powershell.md)
##### [C#](sql-database-elastic-pool-manage-csharp.md)
#### [Change service tiers and performance levels](sql-database-scale-up-powershell.md)
### Move data
#### [Export database to a BACPAC file](sql-database-export-powershell.md)
#### [Import database from a BACPAC file](sql-database-import-powershell.md)
### [Get required values for authenticating an application](sql-database-client-id-keys.md)
### [Elastic jobs](sql-database-elastic-jobs-powershell.md)
### [Use ports beyond 1433 for ADO.NET 4.5](sql-database-develop-direct-route-ports-adonet-v12.md)
### [Work with error messages](sql-database-develop-error-messages.md)
### [Use batching](sql-database-use-batching-to-improve-performance.md)

### Reference
#### [Transact-SQL](https://msdn.microsoft.com/library/azure/bb510741.aspx)
#### [.NET Framework Data Provider for SQL Server (concepts)](https://msdn.microsoft.com/library/kb9s9ks0.aspx)
#### [.NET Framework Data Provider for SQL Server (API Reference)](https://msdn.microsoft.com/library/system.data.sqlclient.aspx)
#### SQL PowerShell
##### [Azure SQL Database Cmdlets (Resource Management)](https://msdn.microsoft.com/library/azure/mt574084(v=azure.300\).aspx)
##### [Azure SQL Database Cmdlets (Service Management)](https://msdn.microsoft.com/library/azure/dn546723(v=azure.300\).aspx)
##### [SQL Server Cmdlets](https://msdn.microsoft.com/library/mt740629.aspx)
#### SQL Database REST API
##### [REST API (Resource Management)](https://msdn.microsoft.com/library/azure/mt420159)
##### [REST API (Service Management)](https://msdn.microsoft.com/library/azure/dn505719.aspx)
#### SQL Database Management Library
##### [SQL Database Management Library Reference](https://msdn.microsoft.com/library/azure/mt349017.aspx)
##### [Get the SQL Database Management Library package](https://www.nuget.org/packages/Microsoft.Azure.Management.Sql)
#### Entity Framework
##### [Get the Entity Framework package](https://www.nuget.org/packages/EntityFramework/)
#### [SQL Server Drivers](https://msdn.microsoft.com/library/mt654049.aspx)
##### [ADO.NET](https://msdn.microsoft.com/library/mt657768.aspx)
##### [JDBC](https://msdn.microsoft.com/library/mt484311.aspx)
##### [Node.js](https://msdn.microsoft.com/library/mt652093.aspx)
##### [ODBC](https://msdn.microsoft.com/library/mt654048.aspx)
##### [PHP](https://msdn.microsoft.com/library/dn865013.aspx)
##### [Python](https://msdn.microsoft.com/library/mt652092.aspx)
##### [Ruby](https://msdn.microsoft.com/library/mt691981.aspx)
#### [Azure SDK (download)](https://www.visualstudio.com/vs/azure-tools/)
#### [Azure SDK (documentation)](https://azure.microsoft.com/documentation/articles/dotnet-sdk/)
### Resources
#### [SQL Server Tools](https://msdn.microsoft.com/library/mt238365.aspx)
#### [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx)
#### [SQL Server Data Tools (SSDT)](https://msdn.microsoft.com/library/mt204009.aspx)
#### [BCP](https://msdn.microsoft.com/library/ms162802.aspx)
#### [SQLCMD](https://msdn.microsoft.com/library/ms162773.aspx)
#### [SqlPackage](https://msdn.microsoft.com/hh550080.aspx)

## Detect threats
### [Threat detection](sql-database-threat-detection-get-started.md)
### [Firewall](sql-database-firewall-configure.md)

## Encrypt data
### [Always-encrypted overview](sql-database-always-encrypted.md)
### [Always-encrypted Azure Key Vault](sql-database-always-encrypted-azure-key-vault.md)
### [Transparent data encryption](https://msdn.microsoft.com/library/azure/dn948096)
### [Column encryption](https://msdn.microsoft.com/library/azure/ms179331)

## Manage
###  Authentication
#### [Azure AD authentication](sql-database-aad-authentication.md)
#### [Multi-factor authentication](sql-database-ssms-mfa-authentication.md)
### Elastic pools
#### [Azure portal](sql-database-elastic-pool-manage-portal.md)
#### [PowerShell](sql-database-elastic-pool-manage-powershell.md)
#### [T-SQL](sql-database-elastic-pool-manage-tsql.md)
#### [C#](sql-database-elastic-pool-manage-csharp.md)
### Databases
#### [Single databases](sql-database-manage-portal.md)
#### [Change service tiers and performance levels](sql-database-scale-up.md)
#### Sharded databases
##### [Migrate existing scaled-out databases to scale-out](sql-database-elastic-convert-to-use-elastic-tools.md)
##### [Manage credentials](sql-database-elastic-scale-manage-credentials.md)
##### [Moving data between scaled-out cloud databases](sql-database-elastic-scale-overview-split-and-merge.md)
##### [Deploy a split-merge service](sql-database-elastic-scale-configure-deploy-split-and-merge.md)
##### [Add a shard](sql-database-elastic-scale-add-a-shard.md)
##### [Using the RecoveryManager class to fix shard map problems](sql-database-elastic-database-recovery-manager.md)
### Firewall rules
#### [Azure Portal](sql-database-configure-firewall-settings.md)
#### [PowerShell](sql-database-configure-firewall-settings-powershell.md)
#### [REST API](sql-database-configure-firewall-settings-rest.md)
### Jobs
#### [Service installation](sql-database-elastic-jobs-service-installation.md)
#### [Azure portal](sql-database-elastic-jobs-create-and-manage.md)
#### [PowerShell](sql-database-elastic-jobs-powershell.md)
#### [Upgrade client library](sql-database-elastic-scale-upgrade-client-library.md)
### [Manage logins](sql-database-manage-logins.md)
## Mask data
### [Dynamic data masking](sql-database-dynamic-data-masking-get-started-portal.md)
### [Downlevel clients](sql-database-auditing-and-dynamic-data-masking-downlevel-clients.md)
## Migrate
### Determine compatibility
#### [SQL Package utility](sql-database-cloud-migrate-determine-compatibility-sqlpackage.md)
#### [SQL Server Management Studio](sql-database-cloud-migrate-determine-compatibility-ssms.md)
### Fix compatibility issues
#### [SQL Server Data Tools](sql-database-cloud-migrate-fix-compatibility-issues-ssdt.md)
#### [SQL Server Management Studio](sql-database-cloud-migrate-fix-compatibility-issues-ssms.md)
#### [SQL Azure Migration Wizard](sql-database-cloud-migrate-fix-compatibility-issues.md)
### [Use SQL Server Management Studio Migration Wizard](sql-database-cloud-migrate-compatible-using-ssms-migration-wizard.md)
### [Use transactional replication](sql-database-cloud-migrate-compatible-using-transactional-replication.md)

## Monitor and tune
### [Single databases](sql-database-performance-guidance.md)
### [Query Performance Insight](sql-database-query-performance.md)
### [SQL Database Advisor](sql-database-advisor-portal.md)
### Change service tiers and performance levels
#### [Azure portal](sql-database-scale-up.md)
#### [PowerShell](sql-database-scale-up-powershell.md)
### [Performance tuning tips](sql-database-troubleshoot-performance.md)
### In-Memory OLTP
#### [Adopt in-memory OLTP](sql-database-in-memory-oltp-migration.md)
#### [Monitor In-Memory OLTP Storage](sql-database-in-memory-oltp-monitoring.md)
### Query Store
#### [Monitoring performance by using the Query Store](https://msdn.microsoft.com/library/dn817826.aspx)
#### [Query Store usage scenarios](https://msdn.microsoft.com/library/mt614796.aspx)
#### [Operating the Query Store](sql-database-operate-query-store.md)
### [Compatibility levels](sql-database-compatibility-level-query-performance-130.md)
### [Event auditing](sql-database-auditing-get-started.md)
### [Performance counters for shard map manager](sql-database-elastic-database-perf-counters.md)
### Extended events
#### [Extended events](sql-database-xevent-db-diff-from-svr.md)
#### [Event file target code](sql-database-xevent-code-event-file.md)
#### [Ring buffer target code](sql-database-xevent-code-ring-buffer.md)
### DMVs
#### [DMVs](sql-database-monitoring-with-dmvs.md)
#### [DMVs](sql-database-manage-azure-ssms#monitor-sql-database-using-dynamic-management-views)

## Move data
### Copy a SQL database
#### [Overview](sql-database-copy.md)
#### [Azure portal](sql-database-copy-portal.md)
#### [PowerShell](sql-database-copy-powershell.md)
#### [T-SQL](sql-database-copy-transact-sql.md)
### Export database to a BACPAC file
#### [Azure portal](sql-database-export.md)
#### [SQL Server Management Studio](sql-database-cloud-migrate-compatible-export-bacpac-ssms.md)
#### [SQL Package utility](sql-database-cloud-migrate-compatible-export-bacpac-sqlpackage.md)
#### [PowerShell](sql-database-export-powershell.md)
### Import database from a BACPAC file
#### [Azure portal](sql-database-import.md)
#### [PowerShell](sql-database-import-powershell.md)
#### [SQL Server Management Studio](sql-database-cloud-migrate-compatible-import-bacpac-ssms.md)
#### [SQL Package utility](sql-database-cloud-migrate-compatible-import-bacpac-sqlpackage.md)
### [Data sync](sql-database-get-started-sql-data-sync.md)
### [Load from CSV file using BCP](sql-database-load-from-csv-with-bcp.md)

## Query
### [SQL Server Management Studio](sql-database-connect-query-ssms.md)
### [Muiltishard querying](sql-database-elastic-scale-multishard-querying.md)
### Cross-database queries
#### [Overview](sql-database-elastic-query-overview.md)
#### [Cross database querying with different schemas](sql-database-elastic-query-vertical-partitioning.md)
#### [Cross database reporting](sql-database-elastic-query-horizontal-partitioning.md)
#### [Distributed transactions across cloud databases](sql-database-elastic-transactions-overview.md)

## Restore
### Restore deleted database
#### [Azure portal](sql-database-restore-deleted-database-portal.md)
#### [PowerShell](sql-database-restore-deleted-database-powershell.md)
### Point in time restore
#### [Azure portal](sql-database-point-in-time-restore-portal.md)
#### [PowerShell](sql-database-point-in-time-restore-powershell.md)
### Geo-Restore
#### [Azure portal](sql-database-geo-restore-portal.md)
#### [PowerShell](sql-database-geo-restore-powershell.md)
#### [Single table](sql-database-cloud-migrate-restore-single-table-azure-backup.md)
### [Recover from a data center outage](sql-database-disaster-recovery.md)
### [Perform disaster recovery drills](sql-database-disaster-recovery-drills.md)

## Replicate
### [Active Geo-Replication overview](sql-database-geo-replication-overview.md)
### Configure
#### [PowerShell](sql-database-geo-replication-powershell.md)
#### [T-SQL](sql-database-geo-replication-transact-sql.md)
### Failover
#### [Azure portal](sql-database-geo-replication-failover-portal.md)
#### [PowerShell](sql-database-geo-replication-failover-powershell.md)
#### [T-SQL](sql-database-geo-replication-failover-transact-sql.md)

## Troubleshoot
### [Connection issues](sql-database-troubleshoot-common-connection-issues.md)
### [Transient connection error](sql-database-troubleshoot-connection.md)
### [Diagnose and prevent](sql-database-connectivity-issues.md)
### [Permissions](sql-database-troubleshoot-permissions.md)

# Reference
## [T-SQL](https://msdn.microsoft.com/library/azure/bb510741.aspx)
## [Azure SQL Database Cmdlets](https://msdn.microsoft.com/library/azure/mt574084(v=azure.300\).aspx)
## [SQL Server Cmdlets](https://msdn.microsoft.com/library/mt740629.aspx)
## [REST API](https://msdn.microsoft.com/library/azure/mt420159)
## SQL Database Management Library
### [SQL Database Management Library Reference](https://msdn.microsoft.com/library/azure/mt349017.aspx)
### [Get the SQL Database Management Library package](https://www.nuget.org/packages/Microsoft.Azure.Management.Sql)
## [SQL Server Drivers](https://msdn.microsoft.com/library/mt654049.aspx)
### [ADO.NET](https://msdn.microsoft.com/library/mt657768.aspx)
### [JDBC](https://msdn.microsoft.com/library/mt484311.aspx)
### [Node.js](https://msdn.microsoft.com/library/mt652093.aspx)
### [ODBC](https://msdn.microsoft.com/library/mt654048.aspx)
### [PHP](https://msdn.microsoft.com/library/dn865013.aspx)
### [Python](https://msdn.microsoft.com/library/mt652092.aspx)
### [Ruby](https://msdn.microsoft.com/library/mt691981.aspx)

# Resources
## [Pricing](https://azure.microsoft.com/pricing/details/sql-database/)
## [Service updates](https://azure.microsoft.com/updates/?service=sql-database)
## [SQL Server Tools](https://msdn.microsoft.com/library/mt238365.aspx)
## [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx)
## [SQL Server Data Tools (SSDT)](https://msdn.microsoft.com/library/mt204009.aspx)
## [BCP](https://msdn.microsoft.com/library/ms162802.aspx)
## [SQLCMD](https://msdn.microsoft.com/library/ms162773.aspx)
## [SqlPackage](https://msdn.microsoft.com/hh550080.aspx)
