<properties linkid="mobile-services-sql-scale-guidance" urlDisplayName="Scale mobile services backed by Azure SQL Database" pageTitle="Scale mobile services backed by Azure SQL Database - Azure Mobile Services" metaKeywords="" description="Learn how to diagnose and fix scalability issues in your mobile services backed by SQL Database" metaCanonical="" services="" documentationCenter="Mobile" title="Scale mobile services backed by Azure SQL Database" authors="yavorg" solutions="" manager="" editor="mollybos" />
# Scale mobile services backed by Azure SQL Database

Azure Mobile Services makes it very easy to get started and build an app that connects to a cloud-hosted backend that stores data in a SQL database. As your app grows, scaling your service instances is as simple as adjusting scale settings in the portal to add more computational and networking capacity. However, scaling the SQL database backing your service requires some proactive planning and monitoring as the service receives more load. This document will walk you through a set of best practices to ensure continued great performance of your SQL-backed mobile services.

This topic walks you through these basic sections:

1. [Diagnosing Problems](#Diagnosing)
2. [Indexing](#Indexing)
3. [Schema Design](#Schema)
4. [Query Design](#Query)
5. [Service Architecture](#Architecture)
6. [Advanced Diagnostics](#Advanced)

<a name="Diagnosing"></a>
## Diagnosing Problems

If you suspect your mobile service is experiencing problems under load, the first place to check is the **Dashboard** tab for your service in the [Azure Management Portal](http://manage.windowsazure.com). Some of the things to verify here:
- Your usage meters including **API Calls** and **Active Devices** meters are not over quota
- **Endpoint Monitoring** status indicates service is up (only available if service is using the Standard tier and Endpoint Monitoring is enabled) 

If any of the above is not true, consider adjusting your scale settings on the *Scale* tab. If that does not address the issue, we can proceed and investigate whether Azure SQL Database may be the source of the issue. The next few sections cover a few different approaches to diagnose what may be going wrong.

### Choosing the Right SQL Database Tier 

It is important to understand the different database tiers you have at your disposal to ensure you've picked the right tier given your app's needs. Azure SQL Database offers two different database editions with different tiers:
- Web and Business Edition
- Basic, Standard, and Premium Edition (currently in preview)

While the Web and Business Edition is fully supported, it is being sunset by April 24, 2015 as discussed in [Web and Business Edition Sunset FAQ](http://msdn.microsoft.com/en-US/library/azure/dn741330.aspx). We encourage new customers to start using the Basic, Standard, and Premium preview in preparation for this change, if their application requirements allow it. 

#### Web and Business Edition

Currently this is the default edition used by Mobile Services. Here are some recommendations in selecting the tier for your database:
- **Free 20 MB database** - use for development purposes only 
- **Web and Business** - use for development and production services. The two tiers provide the same level of performance, however the Web tier only supports databases up to 5GB in size. For larger databases, use the Business tier. 

#### Basic, Standard, and Premium Edition

This new edition provides a variety of new tiers and monitoring capabilities that make it even easier to understand and troubleshoot database performance. To use this edition with your mobile service:

1. Navigate to the [Preview Features](https://account.windowsazure.com/previewfeatures) page and sign up for **New Service Tiers for SQL Databases**
2. Once the preview feature is active, launch the [Azure Management Portal](http://manage.windowsazure.com).
3. Select **+NEW** in the toolbar and then pick **Data Services**, **SQL Database**, **Quick Create**.
4. Enter a database name and then select **New SQL database server** in the **Server** field. This will create a server that is using the new Basic, Standard, and Premium Edition. 
5. Fill out the rest of the fields and select **Create SQL Database**. This will create a 100MB database using the Basic tier.
6. Configure your mobile service to use the database you just created
    - If you are creating a new mobile service, select **+NEW**, **Compute**, **Mobile Service**, **Create**. On the next screen, fill out the values, select **Use an existing SQL database** in the **Database** field, and then select **Next**. On the next screen be sure to pick the database you created in step 5, then select **OK**.
    - If you already have a mobile service, navigate to the **Configure** tab for that service and select **Change Database** in the toolbar. On the next screen, select **Use an existing SQL database** in the **SQL Database** field and then select **Next**. On the next screen be sure to pick the database you created in step 5, then select **OK**.

Here are some recommendations on selecting the right tier for your database:
- **Basic** - use at development time or for small production services where you only expect to make a single database query at a time
- **Standard** - use for production services where you expect multiple concurrent database queries
- **Premium** - use for large scale production services with many concurrent queries, high peak load, and expected low latency for every request.

For more information on when to use each tier, see [Reasons to Use the new Service Tiers](http://msdn.microsoft.com/en-US/library/azure/dn369873.aspx#Reasons)

### Analyzing Database Metrics

Now that we are familiar with the different database tiers, we can explore database performance metrics to help us reason about scaling within and among the tiers.

1. Launch the [Azure Management Portal](http://manage.windowsazure.com).
2. On the Mobile Services tab, select the service you want to work with.
3. Select the **Configure** tab.
4. Select the **SQL Database** name in the **Database Settings** section. This will navigate to the Azure SQL Database tab in the portal.
5. Navigate to the **Monitor** tab
6. Ensure the relevant metrics are displayed by using the **Add Metrics** button. Include the following
    - *CPU Percentage* (available only in Basic/Standard/Premium tiers)
    - *Physical Data Reads Percentage* (available only in Basic/Standard/Premium tiers) 
    - *Log Writes Percentage* (available only in Basic/Standard/Premium tiers)
    - *Storage* 
7. Inspect the metrics over the time window when your service was experiencing issues. 

    ![Azure Management Portal - SQL Database Metrics][PortalSqlMetrics]

If any metric exceeds 80% utilization for an extended period of time, this could indicate a performance problem. For more detailed information on understanding database utilization, see [Understanding Resource Use](http://msdn.microsoft.com/en-US/library/azure/dn369873.aspx#Resource).

If the metrics indicate your database is incurring high utilization, consider the following mitigation steps:
- **Scale up the database to a higher service tier.**
  To immediately resolve issues, consider using the **Scale** tab for your database to scale up your database. This will result in an increase in your bill.
    ![Azure Management Portal - SQL Database Scale][PortalSqlScale]

- **Tune your database.**
  It is frequently possible to reduce database utilization and avoid having to scale to a higher tier by optimizing your database. 
- **Consider your service architecture.**
  Frequently your service load is not distributed evenly over time but contains "spikes" of high demand. Instead of scaling the database up to handle the spikes, and having it go underutilized during periods of low demand, it is frequently possible to adjust the service architecture to avoid such spikes, or to handle them without incurring database hits.

The remaining sections of this document contain tailored guidance to help with implementing these mitigations.

### Configuring Alerts

It is frequently useful to configure alerts for key database metrics as a proactive step to ensure you have plenty of time to react in case of resource exhaustion. 

1. Navigate to the **Monitoring** tab for the database you want to set up alerts for
2. Ensure the relevant metrics are displayed as described in the previous section
3. Select the metric you want to set an alert for and select **Add Rule**
    ![Azure Management Portal - SQL Alert][PortalSqlAddAlert]
4. Provide a name and description for the alert
    ![Azure Management Portal - SQL Alert Name and Description][PortalSqlAddAlert2]
5. Specify the value to use as the alert threshold. Consider using **80%** to allow for some reaction time. Also be sure to specify an email address that you actively monitor. 
    ![Azure Management Portal - SQL Alert Threshold and Email][PortalSqlAddAlert3]

<a name="Indexing"></a>
## Indexing

<a name="Schema"></a>
## Schema Design

<a name="Query"></a>
## Query Design

<a name="Architecture"></a>
## Service Architecture

<a name="Advanced"></a>
## Advanced Diagnostics
This section covers some more advanced diagnostic tasks, which may be useful if the steps so far have not addressed the issue fully.

### Prerequisites
To perform some of the diagnostic tasks in this section, you need access to a management tool for SQL databases such as **SQL Server Management Studio** or the management functionality built into the **Azure Management Portal**.

SQL Server Management Studio is a free Windows application, which offers the most advanced capabilities. If you do not have access to a Windows machine, consider provisioning a Virtual Machine in Azure as shown in [Create a Virtual Machine Running Windows Server](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-windows-tutorial/). If you intend to use the VM primarily for the purpose of running SQL Server Management Studio, a **Basic A0** (formerly "Extra Small") instance should be sufficient. 

The Azure Management Portal offers a built-in management experience, which is more limited, but is available without a local install.

The the following steps walk you through obtaining the connection information for the SQL database backing your mobile service and then using either of the two tools to connect to it. You may pick whichever tool you prefer.

#### Obtain SQL Connection Information 
1. Launch the [Azure Management Portal](http://manage.windowsazure.com).
2. On the Mobile Services tab, select the service you want to work with.
3. Select the **Configure** tab.
4. Select the **SQL Database** name in the **Database Settings** section. This will navigate to the Azure SQL Database tab in the portal.
5. Select **Set up Windows Azure firewall rules for this IP address**.
6. Make a note of the server address in the **Connect to your database** section, for example: *mcml4otbb9.database.windows.net*.

#### SQL Server Management Studio
1. Navigate to [SQL Server Editions - Express](http://www.microsoft.com/en-us/server-cloud/products/sql-server-editions/sql-server-express.aspx)
2. Find the **SQL Server Management Studio** section and select the **Download** button underneath.
3. Complete the setup steps until you can successfully run the application:

    ![SQL Server Management Studio][SSMS]

4. In the **Connect to Server** dialog enter the following values
    - Server name: *server address you obtained earlier*
    - Authentication: *SQL Server Authentication*
    - Login: *login you picked when creating server*
    - Password: *password you picked when creating server*
5. You should now be connected.

#### Azure Management Portal
1. On Azure SQL Database tab for your database, select the **Manage** button 
2. Configure the connection with the following values
    - Server: *should be pre-set to the right value*
    - Database: *leave blank*
    - Username: *login you picked when creating server*
    - Password: *password you picked when creating server*
3. You should now be connected.

    ![Azure Management Portal - SQL Database][PortalSqlManagement]

### Advanced Diagnostics

### Advanced Indexing

## See Also


<!-- IMAGES -->
 
[SSMS]: ./media/mobile-services-sql-scale-guidance/1.png
[PortalSqlManagement]: ./media/mobile-services-sql-scale-guidance/2.png
[PortalSqlMetrics]: ./media/mobile-services-sql-scale-guidance/3.png
[PortalSqlScale]: ./media/mobile-services-sql-scale-guidance/4.png
[PortalSqlAddAlert]: ./media/mobile-services-sql-scale-guidance/5.png
[PortalSqlAddAlert2]: ./media/mobile-services-sql-scale-guidance/6.png
[PortalSqlAddAlert3]: ./media/mobile-services-sql-scale-guidance/7.png