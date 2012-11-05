<properties linkid="manage-services-how-to-configure-a-sqldb" urlDisplayName="How to configure" pageTitle="How to configure a SQL Database - Windows Azure" metaKeywords="Azure creating SQL Server, Azure configuring SQL Server" metaDescription="Learn how to create and configure a logical server using SQL Server in Windows Azure." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />




<h1 id="configLogical">How to Create and Configure SQL Database</h1>

In this topic, you'll step through logical server creation and configuration. In the new Windows Azure (Preview) Management Portal, revised workflows let you create a database first, and then create a server. 

However in this topic, you'll create the server first. You might prefer this approach if you have existing SQL Server databases that you want to upload.

##Table of Contents##
* [How to: Create a logical server](#configLogical)
* [How to: Configure the firewall for the logical server](#configFWLogical)

<h2 id="configLogical">How to: Create a logical server</h2>

1. Sign in to the [Management Portal](http://manage.windowsazure.com).

2. Click **SQL Database** and then click **SERVERS** on the SQL Database home page.

4. Click **Add** at the bottom of the page. 

5. In Server Settings, enter an administrator name as one word with no spaces. 

  SQL Database uses SQL Authentication over an encrypted connection. A new SQL Server authentication login assigned to the sysadmin fixed server role will be created using the name you provide. 

  The login cannot be an email address, Windows user account, or a Windows Live ID. Neither Claims nor Windows authentication is supported on SQL Database.

6. Provide a strong password that is over eight characters, using a combination of upper and lower case values, and a number or symbol.

7. Choose a region. Region determines the geographical location of the server. Regions cannot be easily switched, so choose one that makes sense for this server. Choose a location that is closest to you. Keeping your Windows Azure application and database in the same region saves you on egress bandwidth cost and data latency.

8. Be sure to keep the **Allow Services** option selected so that you can connect to this database using the Management Portal for SQL Database, storage services, and other services on Windows Azure. 

9. Click the checkmark at the bottom of the page when you are finished.

Notice that you did not specify a server name. SQL Database auto-generates the server name to ensure there are no duplicate DNS entries. The server name is a ten-character alphanumeric string. You cannot change the name of your SQL Database server.

In the next step, you will configure the firewall so that connections from applications running on your network are allowed access.

<h2 id="configFWLogical">How to: Configure the firewall for the logical server</h2>

1. In the [Management Portal](http://manage.windowsazure.com), click **SQL Databases**, click **Servers**, and then click on the server you just created.

2. Click **Configure**. 

3. Copy the current client IP address. If you are connecting from a network, this is the IP address that your  router or proxy server is listening on. SQL Database detects the IP address used by the current connection so that you can create a firewall rule to accept connection requests from this device. 

4. Paste the IP address into both the beginning and end range. Later, if you encounter connection errors indicating that the range is too narrow, you can edit this rule to widen the range.

  If client computers use dynamically assigned IP addresses, you must specify a range that is broad enough to include IP addresses assigned to computers in your network. Start with a narrow range, and then expand it only if you need to.

5. Enter a name for the firewall rule, such as the name of your computer or company.

6. Click the checkmark to save the rule.

7. Click **Save** at the bottom of the page to complete the step. If you do not see **Save**, refresh the browser page.

You now have a logical server, a firewall rule that allows inbound connections from your IP address, and an administrator login. In the next step, you'll switch to your local computer to complete the remaining configuration steps.

**Note:** The logical server you just created is transient and will be dynamically hosted on physical servers in a data center. If you delete the server, you should know in advance that this is a non-recoverable action. Be sure to backup any databases that you subsequently upload to the server. 
