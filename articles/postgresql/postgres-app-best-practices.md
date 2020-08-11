
# Application development Best practices

Here are some best practices to help build cloud-ready applications using Azure Database for PostgreSQL. Using these best pratices can save you a lot of development time and debugging issues with your application. 

## Application and Database resource configuration

### Application and Database in the same region
Make sure **all your dependencies are in the same region**	when deploying your application in Azure. Spreading instances across regions or availability zones creates network latency, which may impact the overall performance of your application. 

### Keep you PostgreSQL server secure
Your PostgreSQL server should be configured to be [secure]() and not accessible publicly. Use either one of these options to secure your server: 
- [Firewall rules]
- [Virtual Networks]
- [Private Link]

For security, you must always connect to your server over **SSL** and configure your MySQL server and your application to use **TLS1.2**. See [How to configure SSL/TLS](https://docs.microsoft.com/en-us/azure/mysql/concepts-ssl-connection-security). 

### Resetting your password
You can [reset your password](https://docs.microsoft.com/en-us/azure/mysql/howto-create-manage-server-portal#update-admin-password) for using Azure Portal. 

In a case where you have to reset password for a production database, it can cause downtime for your application until you have updated your application to use the new password. It is a good pattern to reset the password for any production workloads at off-peak hours to minimize the impact of this change.

When building any application, you would need to debug performance issues with your application. Here are  few best practices to use with Azure Database for PostgreSQL.

### Enable slow query logs identify performance issues


### Use connection pooling


### Retry logic to handle transient errors


### Enable read replication to mitigate failovers


## Database Deployment 

If you need to make a database deployment for your production application , here is a good pattern to follow to perform a manual update

1. Create a copy of production database on a new database
2. Update the new database with your new schema changes or updates needed for your database. 
3. Put the production database on read only state. This means no write operations should be performed on the production database until deployment is completed. 
4. Test you application with the newly updated database from step 1.
5. Deploy your application changes and make sure the application is now using the new database which has all the database updates needed. 
6. Keep the old production database so that you can roll back the changes. At a later date you can evaluate to either delete the old production database or export it on Azure storage if needed. 

>{!NOTE]
>  - If the application is like ecommerce app where you might not be able to put it in read only state, then deploy the changes directly on the production database after making a backup.  Theses change should occur during the off-peak hours with low traffic to the app to minimze the impact as some users may experience a failed requests. 
>  - Make sure your application code also handles any failed requests.

### Tune your server parameters
Server sometimes need to be tuned for your application workload.


## Database Schema and Queries

Here are few best practices to keep in mind on how you build your database schema and  build your queries for your application.
