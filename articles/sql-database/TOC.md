# Overview
## [What is SQL Database?](sql-database-technical-overview.md)
### [Service tiers](sql-database-service-tiers.md)
### [Database Transaction Units](sql-database-what-is-a-dtu.md)
### [DTU benchmark overview](sql-database-benchmark-overview.md)
### [Resource limits](sql-database-resource-limits.md)
### [Features](sql-database-features.md)
### [SQL Database FAQ](sql-database-faq.md)
## Benefits
### [Learns and adapts](sql-database-learn-and-adapt.md)
### [Scales on the fly](sql-database-scale-on-the-fly.md)
### [Builds multitenant apps](sql-database-build-multi-tenant-apps.md)
### [Secures and protects](sql-database-helps-secures-and-protects.md)
### [Works in your environment](sql-database-works-in-your-environment.md)
## Comparisons
### [SQL Database versus SQL on a VM](sql-database-paas-vs-sql-server-iaas.md)
### [T-SQL differences](sql-database-transact-sql-information.md)
### [SQL versus NoSQL](../documentdb/documentdb-nosql-vs-sql.md)
## [SQL Database tools](sql-database-manage-overview.md)
## [SQL Database tutorials](sql-database-explore-tutorials.md)
## [Solution quick-starts](sql-database-solution-quick-starts.md)
## Security
### [Azure Security Center for Azure SQL Database](https://azure.microsoft.com/documentation/articles/security-center-sql-database/)
### [SQL Security Center](https://msdn.microsoft.com/library/azure/bb510589)

# Get Started
## Databases and servers
### Single databases
#### Learn
##### [Azure portal tutorial: Create an Azure SQL database using the Azure portal](sql-database-get-started.md)
#### Do
##### [Azure portal tutorial: Create an Azure SQL database using the Azure portal](sql-database-get-started.md)
##### [Azure portal tutorial: Create an Azure SQL database using PowerShell](sql-database-get-started-powershell.md)
##### [Azure portal tutorial: Create an Azure SQL database using C#](sql-database-get-started-csharp.md)
### Elastic database pools
#### Learn
##### [Elastic database pools](sql-database-elastic-pool.md)
##### [When to use an elastic database pool](sql-database-elastic-pool-guidance.md)
##### [Elastic pool pricing](sql-database-elastic-pool-price.md)
#### Do
##### [Create using the Azure portal](sql-database-elastic-pool-create-portal.md)
##### [Create using PowerShell](sql-database-elastic-pool-create-powershell.md)
##### [Create using C#](sql-database-elastic-pool-create-csharp.md)
### Scaling out
#### Learn
##### [Scaling-out](sql-database-elastic-scale-introduction.md)
##### [Elastic scale](sql-database-elastic-scale-get-started.md)
##### [Building scalable cloud databases](sql-database-elastic-database-client-library.md)
##### [Cross database jobs](sql-database-elastic-jobs-overview.md)
##### [Elastic tools FAQ](sql-database-elastic-scale-faq.md)
##### [Elastic database tools glossary](sql-database-elastic-scale-glossary.md)
##### [Moving data between scaled-out cloud databases](sql-database-elastic-scale-overview-split-and-merge.md)
#### Do
##### [Elastic jobs](sql-database-elastic-jobs-getting-started.md)
##### [Cross database reports](sql-database-elastic-query-getting-started.md)
##### [Cross database queries](sql-database-elastic-query-getting-started-vertical.md)
##### [Uninstall elastic jobs](sql-database-elastic-jobs-uninstall.md)
## Migrate and move data
### Learn
#### [Migrate a database](sql-database-cloud-migrate.md)
#### [Transactional replication](sql-database-cloud-migrate-compatible-using-transactional-replication.md)
#### [Data sync](sql-database-get-started-sql-data-sync.md)
#### [Copy a SQL database](sql-database-copy.md)
### Do
#### Determine database compatibility
##### [SQL Package utility](sql-database-cloud-migrate-determine-compatibility-sqlpackage.md)
##### [SQL Server Management Studio](sql-database-cloud-migrate-determine-compatibility-ssms.md)
#### Fix database compatibility issues
##### [SQL Server Data Tools](sql-database-cloud-migrate-fix-compatibility-issues-ssdt.md)
##### [SQL Server Management Studio](sql-database-cloud-migrate-fix-compatibility-issues-ssms.md)
##### [SQL Azure Migration Wizard](sql-database-cloud-migrate-fix-compatibility-issues.md)
##### [SQL Server Management Studio Migration Wizard](sql-database-cloud-migrate-compatible-using-ssms-migration-wizard.md)
#### Copy a database
##### [Copy using the Azure portal](sql-database-copy-portal.md)
##### [Copy using PowerShell](sql-database-copy-powershell.md)
##### [Copy using T-SQL](sql-database-copy-transact-sql.md)
#### Export database to a BACPAC file
##### [Azure portal](sql-database-export.md)
##### [SQL Server Management Studio](sql-database-cloud-migrate-compatible-export-bacpac-ssms.md)
##### [SQL Package utility](sql-database-cloud-migrate-compatible-export-bacpac-sqlpackage.md)
##### [PowerShell](sql-database-export-powershell.md)
#### Import database from a BACPAC file
##### [Azure portal](sql-database-import.md)
##### [PowerShell](sql-database-import-powershell.md)
##### [SQL Server Management Studio](sql-database-cloud-migrate-compatible-import-bacpac-ssms.md)
##### [SQL Package utility](sql-database-cloud-migrate-compatible-import-bacpac-sqlpackage.md)
#### [Load from CSV file using BCP](sql-database-load-from-csv-with-bcp.md)
## Authenticate and grant access
### Learn
#### [Overview](sql-database-security.md)
#### [Security guidelines](sql-database-security-guidelines.md)
#### [Manage logins](sql-database-manage-logins.md)
### Do
### [Tutorial: SQL authentication and access](sql-database-get-started-security.md)
## Secure and protect data
### Learn
#### Auditing
##### [Audit](sql-database-auditing-get-started.md)
##### [Downlevel clients support and IP endpoint changes for auditing](sql-database-auditing-and-dynamic-data-masking-downlevel-clients.md)
#### [Threat detection](sql-database-threat-detection-get-started.md)
#### Encrypt data
##### [Azure key vault](sql-database-always-encrypted-azure-key-vault.md)
##### [Windows certificate store](sql-database-always-encrypted.md)
##### [Transparent data encryption](https://msdn.microsoft.com/library/azure/dn948096)
##### [Column encryption](https://msdn.microsoft.com/library/azure/ms179331)
#### Mask data
##### Dynamic data masking
###### [Azure portal](sql-database-dynamic-data-masking-get-started.md)
### Do
#### [Dynamic data masking using the Azure portal](sql-database-dynamic-data-masking-get-started.md)
## Business continuity
### Learn
#### [Overview](sql-database-business-continuity.md)
#### [Database backups](sql-database-automated-backups.md)
#### [Long-term retention](sql-database-long-term-retention.md)
#### [Database recovery using backups](sql-database-recovery-using-backups.md)
#### [Authentication requirements for disaster recovery](sql-database-geo-replication-security-config.md)
#### [Business continuity design scenarios](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
#### [Disaster recovery strategies with elastic pools](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md)
#### [Rolling upgrades](sql-database-manage-application-rolling-upgrade.md)
### Do
#### Restore deleted database
##### [Azure portal](sql-database-restore-deleted-database-portal.md)
##### [PowerShell](sql-database-restore-deleted-database-powershell.md)
#### Point-in-time restore
##### [Azure portal](sql-database-point-in-time-restore-portal.md)
##### [PowerShell](sql-database-point-in-time-restore-powershell.md)
#### Geo-Restore databases
##### [Azure portal](sql-database-geo-restore-portal.md)
##### [PowerShell](sql-database-geo-restore-powershell.md)
#### [Single table](sql-database-cloud-migrate-restore-single-table-azure-backup.md)
#### [Recover from a data center outage](sql-database-disaster-recovery.md)
#### [Perform disaster recovery drills](sql-database-disaster-recovery-drills.md)
### Replicate databases
#### [Active Geo-Replication overview](sql-database-geo-replication-overview.md)
#### Configure Active Geo-Replication
##### [Azure portal](sql-database-geo-replication-portal.md)
##### [PowerShell](sql-database-geo-replication-powershell.md)
##### [T-SQL](sql-database-geo-replication-transact-sql.md)
#### Failover with Active Geo-Replication
##### [Azure portal](sql-database-geo-replication-failover-portal.md)
##### [PowerShell](sql-database-geo-replication-failover-powershell.md)
##### [T-SQL](sql-database-geo-replication-failover-transact-sql.md)
## App development
### Learn
#### [Database application development overview](sql-database-develop-overview.md)
#### [Connectivity libraries](sql-database-libraries.md)
#### [Multitenant SaaS applications](sql-database-design-patterns-multi-tenancy-saas-applications.md)
#### [Use ports beyond 1433 for ADO.NET 4.5](sql-database-develop-direct-route-ports-adonet-v12.md)
#### [Get required values for authenticating an application](sql-database-client-id-keys.md)
### Do
#### Connect an application
##### [.NET](sql-database-develop-dotnet-simple.md)
##### [C and C++](sql-database-develop-cplusplus-simple.md)
##### [Java](sql-database-develop-java-simple.md)
##### [Node.js](sql-database-develop-nodejs-simple.md)
##### [PHP](sql-database-develop-php-simple.md)
##### [Python](sql-database-develop-python-simple.md)
##### [Ruby](sql-database-develop-ruby-simple.md)
##### [Excel](sql-database-connect-excel.md)
#### [Connect with Visual Studio](sql-database-connect-query.md)
#### [Build a client application](https://www.microsoft.com/sql-server/developer-get-started)
#### [Work with error messages](sql-database-develop-error-messages.md)
### Customer implementations of software as a service
#### [Daxko/CSI Software](sql-database-implementation-daxko.md)
#### [GEP](sql-database-implementation-gep.md)
#### [SnelStart](sql-database-implementation-snelstart.md)
#### [Umbraco](sql-database-implementation-umbraco.md)
## Database development
### Learn
#### Temporal tables
##### [Temporal tables](sql-database-temporal-tables.md)
##### [Retention policies](sql-database-temporal-tables-retention-policy.md)
#### [JSON data](sql-database-json-features.md)
#### [In-Memory](sql-database-in-memory.md)
### Do
#### [SQL Server development](https://msdn.microsoft.com/library/ms179422.aspx)
## Monitoring and Tuning
### Learn
#### [Single databases](sql-database-single-database-monitor.md)
#### [SQL Database Advisor overview](sql-database-advisor.md)
#### [Single database guidance](sql-database-performance-guidance.md)
#### [Workload insights in the Azure portal](sql-database-performance.md)
#### [Use batching](sql-database-use-batching-to-improve-performance.md)
## SQL Database V11
### [Web and business edition sunset](sql-database-web-business-sunset-faq.md)
### [Service tier advisor](sql-database-service-tier-advisor.md)
### [Elastic pool assessment tool](sql-database-elastic-pool-database-assessment-powershell.md)
### [Upgrade to V12](sql-database-v12-plan-prepare-upgrade.md)
#### [Upgrade using the Azure portal](sql-database-upgrade-server-portal.md)
#### [Upgrade using PowerShell](sql-database-upgrade-server-powershell.md)
#### [Pricing tier recommendations](sql-database-service-tier-advisor.md)

# How To
## Create and manage
### Servers and databases
#### [Single databases](sql-database-manage-portal.md)
#### [Azure portal](sql-database-get-started.md)
#### [C#](sql-database-get-started-csharp.md)
#### [PowerShell](sql-database-manage-powershell.md)
#### [SQL Server Management Studio](sql-database-manage-azure-ssms.md)
### Elastic database pools
#### [Create using the Azure portal](sql-database-elastic-pool-create-portal.md)
#### [Create using PowerShell](sql-database-elastic-pool-create-powershell.md)
#### [Create using C#](sql-database-elastic-pool-create-csharp.md)
#### [Manage using the Azure portal](sql-database-elastic-pool-manage-portal.md)
#### [Manage using PowerShell](sql-database-elastic-pool-manage-powershell.md)
#### [Manage using C#](sql-database-elastic-pool-manage-csharp.md)
#### [Manage using T-SQL](sql-database-elastic-pool-manage-tsql.md)
### Sharded databases
#### [Use shard map manager](sql-database-elastic-scale-shard-map-management.md)
#### [Split merge security configuration](sql-database-elastic-scale-split-merge-security-configuration.md)
#### [Working with Dapper](sql-database-elastic-scale-working-with-dapper.md)
#### [Use entity framework](sql-database-elastic-scale-use-entity-framework-applications-visual-studio.md)
#### [Data-dependent routing](sql-database-elastic-scale-data-dependent-routing.md)
#### [Multitenant row level security](sql-database-elastic-tools-multi-tenant-row-level-security.md)
#### [Manage credentials](sql-database-elastic-scale-manage-credentials.md)
#### [Deploy a split-merge service](sql-database-elastic-scale-configure-deploy-split-and-merge.md)
#### [Add a shard](sql-database-elastic-scale-add-a-shard.md)
#### [Using the RecoveryManager class to fix shard map problems](sql-database-elastic-database-recovery-manager.md)
###  Authentication
#### [Azure AD authentication](sql-database-aad-authentication.md)
#### [Multi-factor authentication](sql-database-ssms-mfa-authentication.md)
### Firewall rules
#### [Azure portal](sql-database-configure-firewall-settings.md)
#### [PowerShell](sql-database-configure-firewall-settings-powershell.md)
#### [REST API](sql-database-configure-firewall-settings-rest.md)
#### [T-SQL](sql-database-configure-firewall-settings-tsql.md)
### Jobs and automation
#### [Service installation](sql-database-elastic-jobs-service-installation.md)
#### [Create and manage elastic jobs in the Azure portal](sql-database-elastic-jobs-create-and-manage.md)
#### [Create and manage elastic jobs using PowerShell](sql-database-elastic-jobs-powershell.md)
#### [Upgrade client library](sql-database-elastic-scale-upgrade-client-library.md)
#### [Managing SQL Databases using the Azure Automation service](sql-database-manage-automation.md)
### [Firewall](sql-database-firewall-configure.md)
## Encrypt data
### [Always-encrypted overview](sql-database-always-encrypted.md)
### [Transparent data encryption](https://msdn.microsoft.com/library/azure/dn948096)
### [Column encryption](https://msdn.microsoft.com/library/azure/ms179331)
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
### [Migrate existing scaled-out databases to scale-out](sql-database-elastic-convert-to-use-elastic-tools.md)
## Monitor and tune
### [Query Performance Insight](sql-database-query-performance.md)
### [SQL Database Advisor](sql-database-advisor-portal.md)
### [DMVs](sql-database-monitoring-with-dmvs.md)
### [Compatibility levels](sql-database-compatibility-level-query-performance-130.md)
### [Performance counters for shard map manager](sql-database-elastic-database-perf-counters.md)
### [Performance tuning tips](sql-database-troubleshoot-performance.md)
### Change service tiers and performance levels
#### [Using the Azure portal](sql-database-scale-up.md)
#### [Using PowerShell](sql-database-scale-up-powershell.md)
### [Create alerts](sql-database-insights-alerts-portal.md)
### In-Memory OLTP
#### [Adopt in-memory OLTP](sql-database-in-memory-oltp-migration.md)
#### [Monitor In-Memory OLTP Storage](sql-database-in-memory-oltp-monitoring.md)
### Query Store
#### [Monitoring performance by using the Query Store](https://msdn.microsoft.com/library/dn817826.aspx)
#### [Query Store usage scenarios](https://msdn.microsoft.com/library/mt614796.aspx)
#### [Operating the Query Store](sql-database-operate-query-store.md)
### Extended events
#### [Extended events](sql-database-xevent-db-diff-from-svr.md)
#### [Event file target code](sql-database-xevent-code-event-file.md)
#### [Ring buffer target code](sql-database-xevent-code-ring-buffer.md)
## Move data
### [Copy a SQL database](sql-database-copy.md)
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
### [Load from CSV file using BCP](sql-database-load-from-csv-with-bcp.md)
### [Moving data between scaled-out cloud databases](sql-database-elastic-scale-overview-split-and-merge.md)
## Query
### [SQL Server Management Studio](sql-database-connect-query-ssms.md)
### [Multishard querying](sql-database-elastic-scale-multishard-querying.md)
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
### [Moving databases](sql-database-troubleshoot-moving-data.md)


# Reference
## [PowerShell](/powershell/resourcemanager/azurerm.sql/v2.3.0/azurerm.sql)
## [PowerShell (Elastic DB)](/powershell/elasticdatabasejobs/v0.8.33/elasticdatabasejobs)
## [.NET](https:dotnet/api/microsoft.azure.management.sql.models)
## [Java](/java/api/com.microsoft.azure.management.sql)
## [Node.js](https://msdn.microsoft.com/library/mt652093.aspx)
## [Python](https://msdn.microsoft.com/library/mt652092.aspx)
## [Ruby](https://msdn.microsoft.com/library/mt691981.aspx)
## [PHP](https://msdn.microsoft.com/library/dn865013.aspx)
## [T-SQL](https://msdn.microsoft.com/library/azure/bb510741.aspx)
## [REST](/rest/api/sql/)

# Related
## SQL Database Management Library
### [Get the SQL Database Management Library package](https://www.nuget.org/packages/Microsoft.Azure.Management.Sql)
## [SQL Server Drivers](https://msdn.microsoft.com/library/mt654049.aspx)
### [ADO.NET](https://msdn.microsoft.com/library/mt657768.aspx)
### [JDBC](https://msdn.microsoft.com/library/mt484311.aspx)

### [ODBC](https://msdn.microsoft.com/library/mt654048.aspx)


# Resources
## [Pricing](https://azure.microsoft.com/pricing/details/sql-database/)
## [MSDN forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=ssdsgetstarted)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/sql-azure)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=sql-database)
## [Service updates](https://azure.microsoft.com/updates/?service=sql-database)
## [SQL Server Tools](https://msdn.microsoft.com/library/mt238365.aspx)
## [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx)
## [SQL Server Data Tools (SSDT)](https://msdn.microsoft.com/library/mt204009.aspx)
## [BCP](https://msdn.microsoft.com/library/ms162802.aspx)
## [SQLCMD](https://msdn.microsoft.com/library/ms162773.aspx)
## [SqlPackage](https://msdn.microsoft.com/hh550080.aspx)
