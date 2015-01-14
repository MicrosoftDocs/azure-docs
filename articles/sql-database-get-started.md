<properties urlDisplayName="How to create and provision" pageTitle="Getting started with SQL Database - Azure" metaKeywords="" description="Get started creating and managing SQL Databases in Azure." metaCanonical="" services="sql-database" documentationCenter="" title="" authors="jeffgoll" solutions="" writer="" manager="jeffreyg" editor="tysonn"/>

<tags ms.service="sql-database" ms.workload="data-management" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/04/2014" ms.author="jeffreyg" />


#Getting Started with Microsoft Azure SQL Database

In this tutorial you will learn the fundamentals of Microsoft Azure SQL Database administration using the Azure Management portal. If you are new to database administration, you can follow these lessons to learn essential skills in about 30 minutes. 

This tutorial does not assume prior experience with SQL Server or Azure SQL Database. When you complete this tutorial, you will have a sample database on Azure and an understanding of how to perform basic administration tasks using the Management Portal.

You will create and provision a sample database on the Azure platform and query system and user data using Excel.


##Table of Contents##

* [Step 1: Create a Microsoft Azure account](#Subscribe)
* [Step 2: Connect to Azure and create a database](#Subscribe)
* [Step 3: Configure the firewall](#ConfigFirewall)
* [Step 4: Add data and a schema using Transact-SQL script](#AddData)
* [Step 5: Create the schema](#createschema)
* [Step 6: Insert data](#insertData)
* [Step 7: Query sample and system data in the Management Portal for SQL Database](#QueryDBSysData)
* [Step 8: Create a database login and assign permissions](#DBLogin)
* [Step 9: Connect from an application](#ClientConnection)


<h2 id="Subscribe">Step 1: Create a Microsoft Azure account</h2>

1. Open a web browser, and browse to [http://azure.microsoft.com](http://azure.microsoft.com).
To get started with a free account, click free trial in the upper right corner and follow the steps.

2. Your account is now created. You are ready to get started.


<h2 id="Connect">Step 2: Connect to Azure and create a database</h2>


1. Sign in to the [Management Portal](http://manage.windowsazure.com). You should see a navigation pane that looks like this.

	![Navigation pane][Image1]

2. Click **New** at the bottom of the page. When you click **New**, a list rolls up the screen showing things you can create.

3. Click **SQL Database** and then click **Custom Create**. 

	![Navigation pane][Image2]

Choosing this option lets you create a new server and a SQL database at the same time, with you as the administrator. As the system administrator, you can perform more tasks, including connecting to the Management Portal for SQL Database, which you will do later in this tutorial.  

4.  The Database Settings page appears when you click **Custom Create**. In this page, provide basic information that creates an empty SQL database on the server. Adding tables and data will come in a later step. 

    Fill out the Database Settings page as follows:

	![Navigation pane][Image3]

* Enter **School** for the database name. 

* Use the default settings for edition, max size, and collation. 

* Choose **New SQL Database Server**. Selecting a new server adds a second page that we'll use to set the administrator account and region. 

* When you are done, click the arrow to go to next page.


7. Fill out the Server Settings as follows: 

	![Navigation pane][Image4]

* Enter an administrator name as one word with no spaces. SQL Database uses SQL Authentication over an encrypted connection to validate user identity. A new SQL Server authentication login that has administrator permissions will be created using the name you provide. The administrator name cannot be a Windows user, nor should it be a Live ID user name. Windows authentication is not supported on SQL Database.

* Provide a strong password that is over eight characters, using a combination of upper and lower case values, and a number or symbol. Use the help bubble for details about password complexity.

* Choose a region. Region determines the geographical location of the server. Regions cannot be easily switched, so choose one that makes sense for this server. Choose a location that is closest to you. Keeping your Azure application and database in the same region saves you on egress bandwidth cost and data latency.

* Be sure to keep the **Allow Azure Services to access this server**  checkbox selected so that you can connect to this database using the Management Portal for SQL Database, Excel in Office 365, or Azure SQL Reporting.

* Click the checkmark at the bottom of the page when you are finished.

Notice that you did not specify a server name. Because the SQL Database server must be accessible worldwide, SQL Database configures the appropriate DNS entries when the server is created. The generated name ensures that there are no name collisions with other DNS entries. You cannot change the name of your SQL Database server.

To see the name of the server that hosts the **School** database that you just created, click **SQL Databases** in the left navigation pane, then click the **School** database in the **SQL Databases** list view. On the **Quick Start** page, scroll down to see the server name.

In the next step, you will configure the firewall so that connections from applications running on your computer are allowed to access the databases on your SQL Database server.



<h2 id="ConfigFirewall">Step 3: Configure the firewall</h2>

To configure the firewall so that connections are allowed through, you'll enter information on the server page.

**Note:** The SQL Database service is only available with TCP port 1433 used by the TDS protocol, so make sure that the firewall on your network and local computer allows outgoing TCP communication on port 1433. For more information, see [SQL Database Firewall](http://social.technet.microsoft.com/wiki/contents/articles/2677.sql-azure-firewall-en-us.aspx).


1. In the navigation pane on the left, click **SQL Databases**.

2. Click **Servers** at the top of the page. Next, click on the server you just created to open the server page.

3. On the server page, click **Configure** to open the **Allowed IP Addresses** settings, and then click **Add to the allowed IP Addresses** link. This will create a new firewall rule to allow connection requests from the router or proxy server your device is listening on.

4. You can create additional firewall rules by specifying a rule name and the start and end IP range values.

5. To enable interactions between this server and other Azure services, click **Yes** to the **Microsoft Azure Services** option. 

7. To save your changes, click **SAVE** at the bottom of the page.

6. After you save the rule, your page will look similar to the following screenshot.

	![Navigation pane][Image7]

You now have a SQL Database server on Azure, a firewall rule that enables access to the server, a database object, and an administrator login. But you still don't have a working database that you can query. To do that, your database must have a schema and actual data.

Because this tutorial uses just the tools at hand, you'll use the query window in the Management Portal for SQL Database to run Transact-SQL script that builds a predefined database.

As your skills increase, you will want to explore additional ways of creating a database, including programmatic approaches or the design surface in SQL Server Data Tools. If you already have an existing SQL Server database that runs on a local server, you can easily migrate that database to the Azure server that you just set up. Use the links at the end of this tutorial to find out how. 



<h2 id="AddData">Step 4: Add data and a schema using Transact-SQL script</h2>

In this step, you run two scripts. The first one creates a schema that defines tables, columns, and relationships. The second script adds the data. Each step is performed independently on a separate connection. If you've built databases in SQL Server before, one of the differences you'll notice in SQL Database is that CREATE and INSERT commands must run in separate batches. SQL Database imposes this requirement to minimize attacks against the data while it is in transit. 

**Note:** The schema and data values are taken from this [MSDN article](http://msdn.microsoft.com/en-us/library/windowsazure/ee621790.aspx "MSDN article") and have been modified to work with SQL Database.

1. Go to the home page. In the [Management Portal](http://manage.windowsazure.com), the **School** database appears in the list of items on the home page.

	![Navigation pane][Image8]

2. Click on **School** to select it, then click **Manage** at the bottom of the page. This will open the Management Portal for SQL Database. This portal is separate from the Azure Management Portal. You'll use this portal to run Transact-SQL commands and queries.

3. Enter the administrator login name and password to login to the **School** database. This is the administrator login that you specified when you created the server.

4. In the management portal for SQL Database, click **New Query** in the ribbon. An empty query window will open in the workspace. In the next step, you will use this window to copy in a series of predefined scripts that will add structure and data to your empty database.



<h2 id="createschema">Step 5: Create the schema</h2>

In this step, you will create the schema using the following script. The script first checks for an existing table of the same name to ensure there won't be a name collision, and creates the table using the [CREATE TABLE](http://msdn.microsoft.com/en-us/library/windowsazure/ee336258.aspx) statement. Further on, this script uses the [ALTER TABLE](http://msdn.microsoft.com/en-us/library/windowsazure/ee336286.aspx) statement to specify the primary key and table relationships.

Copy the script and paste it into the query window. Click **Run** at the top of the window to execute the script.

<div style="width:auto; height:600px; overflow:auto"><pre>
	-- Create the Department table.
	IF NOT EXISTS (SELECT * FROM sys.objects 
		WHERE object_id = OBJECT_ID(N'[dbo].[Department]') 
		AND type in (N'U'))
   	BEGIN
  	CREATE TABLE [dbo].[Department](
		[DepartmentID] [int] NOT NULL,
		[Name] [nvarchar](50) NOT NULL,
		[Budget] [money] NOT NULL,
		[StartDate] [datetime] NOT NULL,
		[Administrator] [int] NULL,
     CONSTRAINT [PK_Department] PRIMARY KEY CLUSTERED 
    (
	[DepartmentID] ASC
    )WITH (IGNORE_DUP_KEY = OFF)
    )
    END;
	GO

	-- Create the Person table.
	IF NOT EXISTS (SELECT * FROM sys.objects 
		WHERE object_id = OBJECT_ID(N'[dbo].[Person]') 
		AND type in (N'U'))
	BEGIN
	CREATE TABLE [dbo].[Person](
		[PersonID] [int] IDENTITY(1,1) NOT NULL,
		[LastName] [nvarchar](50) NOT NULL,
		[FirstName] [nvarchar](50) NOT NULL,
		[HireDate] [datetime] NULL,
		[EnrollmentDate] [datetime] NULL,
 	 CONSTRAINT [PK_School.Student] PRIMARY KEY CLUSTERED 	
	(
	[PersonID] ASC
	)WITH (IGNORE_DUP_KEY = OFF)
	) 
	END;
	GO

	-- Create the OnsiteCourse table.
	IF NOT EXISTS (SELECT * FROM sys.objects 
		WHERE object_id = OBJECT_ID(N'[dbo].[OnsiteCourse]') 
		AND type in (N'U'))
	BEGIN
	CREATE TABLE [dbo].[OnsiteCourse](
		[CourseID] [int] NOT NULL,
		[Location] [nvarchar](50) NOT NULL,
		[Days] [nvarchar](50) NOT NULL,
		[Time] [smalldatetime] NOT NULL,
 	 CONSTRAINT [PK_OnsiteCourse] PRIMARY KEY CLUSTERED 
	(
		[CourseID] ASC
	)WITH (IGNORE_DUP_KEY = OFF)
	) 
	END;
	GO

	-- Create the OnlineCourse table.
	IF NOT EXISTS (SELECT * FROM sys.objects 
		WHERE object_id = OBJECT_ID(N'[dbo].[OnlineCourse]') 
		AND type in (N'U'))
	BEGIN
	CREATE TABLE [dbo].[OnlineCourse](
		[CourseID] [int] NOT NULL,
		[URL] [nvarchar](100) NOT NULL,
 	 CONSTRAINT [PK_OnlineCourse] PRIMARY KEY CLUSTERED 
	(
		[CourseID] ASC
	)WITH (IGNORE_DUP_KEY = OFF)
	) 
	END;
	GO

	--Create the StudentGrade table.
	IF NOT EXISTS (SELECT * FROM sys.objects 
		WHERE object_id = OBJECT_ID(N'[dbo].[StudentGrade]') 
		AND type in (N'U'))
	BEGIN
	CREATE TABLE [dbo].[StudentGrade](
		[EnrollmentID] [int] IDENTITY(1,1) NOT NULL,
		[CourseID] [int] NOT NULL,
		[StudentID] [int] NOT NULL,
		[Grade] [decimal](3, 2) NULL,
	 CONSTRAINT [PK_StudentGrade] PRIMARY KEY CLUSTERED 
	(
		[EnrollmentID] ASC
	)WITH (IGNORE_DUP_KEY = OFF)
	) 
	END;
	GO

	-- Create the CourseInstructor table.
	IF NOT EXISTS (SELECT * FROM sys.objects 
		WHERE object_id = OBJECT_ID(N'[dbo].[CourseInstructor]') 
		AND type in (N'U'))
	BEGIN
	CREATE TABLE [dbo].[CourseInstructor](
		[CourseID] [int] NOT NULL,
		[PersonID] [int] NOT NULL,
	 CONSTRAINT [PK_CourseInstructor] PRIMARY KEY CLUSTERED 
	(
		[CourseID] ASC,
		[PersonID] ASC
	)WITH (IGNORE_DUP_KEY = OFF)
	) 
	END;
	GO

	-- Create the Course table.
	IF NOT EXISTS (SELECT * FROM sys.objects 
		WHERE object_id = OBJECT_ID(N'[dbo].[Course]') 
		AND type in (N'U'))
	BEGIN
	CREATE TABLE [dbo].[Course](
		[CourseID] [int] NOT NULL,
		[Title] [nvarchar](100) NOT NULL,
		[Credits] [int] NOT NULL,
		[DepartmentID] [int] NOT NULL,
 	 CONSTRAINT [PK_School.Course] PRIMARY KEY CLUSTERED 
	(
		[CourseID] ASC
	)WITH (IGNORE_DUP_KEY = OFF)
	)
	END;
	GO

	-- Create the OfficeAssignment table.
	IF NOT EXISTS (SELECT * FROM sys.objects 
		WHERE object_id = OBJECT_ID(N'[dbo].[OfficeAssignment]')
		AND type in (N'U'))
	BEGIN
	CREATE TABLE [dbo].[OfficeAssignment](
		[InstructorID] [int] NOT NULL,
		[Location] [nvarchar](50) NOT NULL,
		[Timestamp] [timestamp] NOT NULL,
 	 CONSTRAINT [PK_OfficeAssignment] PRIMARY KEY CLUSTERED 
	(
		[InstructorID] ASC
	)WITH (IGNORE_DUP_KEY = OFF)
	)
	END;
	GO

	-- Define the relationship between OnsiteCourse and Course.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
       WHERE object_id = OBJECT_ID(N'[dbo].[FK_OnsiteCourse_Course]')
       AND parent_object_id = OBJECT_ID(N'[dbo].[OnsiteCourse]'))
	ALTER TABLE [dbo].[OnsiteCourse]  WITH CHECK ADD  
       CONSTRAINT [FK_OnsiteCourse_Course] FOREIGN KEY([CourseID])
	REFERENCES [dbo].[Course] ([CourseID]);
	GO
	ALTER TABLE [dbo].[OnsiteCourse] CHECK 
       CONSTRAINT [FK_OnsiteCourse_Course];
	GO

	-- Define the relationship between OnlineCourse and Course.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
       WHERE object_id = OBJECT_ID(N'[dbo].[FK_OnlineCourse_Course]')
       AND parent_object_id = OBJECT_ID(N'[dbo].[OnlineCourse]'))
	ALTER TABLE [dbo].[OnlineCourse]  WITH CHECK ADD  
       CONSTRAINT [FK_OnlineCourse_Course] FOREIGN KEY([CourseID])
	REFERENCES [dbo].[Course] ([CourseID]);
	GO
	ALTER TABLE [dbo].[OnlineCourse] CHECK 
       CONSTRAINT [FK_OnlineCourse_Course];
	GO
	-- Define the relationship between StudentGrade and Course.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
       WHERE object_id = OBJECT_ID(N'[dbo].[FK_StudentGrade_Course]')
       AND parent_object_id = OBJECT_ID(N'[dbo].[StudentGrade]'))
	ALTER TABLE [dbo].[StudentGrade]  WITH CHECK ADD  
       CONSTRAINT [FK_StudentGrade_Course] FOREIGN KEY([CourseID])
	REFERENCES [dbo].[Course] ([CourseID]);
	GO
	ALTER TABLE [dbo].[StudentGrade] CHECK 
       CONSTRAINT [FK_StudentGrade_Course];
	GO

	--Define the relationship between StudentGrade and Student.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
       WHERE object_id = OBJECT_ID(N'[dbo].[FK_StudentGrade_Student]')
       AND parent_object_id = OBJECT_ID(N'[dbo].[StudentGrade]'))	
	ALTER TABLE [dbo].[StudentGrade]  WITH CHECK ADD  
       CONSTRAINT [FK_StudentGrade_Student] FOREIGN KEY([StudentID])
	REFERENCES [dbo].[Person] ([PersonID]);
	GO
	ALTER TABLE [dbo].[StudentGrade] CHECK 
       CONSTRAINT [FK_StudentGrade_Student];
	GO

	-- Define the relationship between CourseInstructor and Course.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
  	 WHERE object_id = OBJECT_ID(N'[dbo].[FK_CourseInstructor_Course]')
  	 AND parent_object_id = OBJECT_ID(N'[dbo].[CourseInstructor]'))
	ALTER TABLE [dbo].[CourseInstructor]  WITH CHECK ADD  
  	 CONSTRAINT [FK_CourseInstructor_Course] FOREIGN KEY([CourseID])
	REFERENCES [dbo].[Course] ([CourseID]);
	GO
	ALTER TABLE [dbo].[CourseInstructor] CHECK 
 	  CONSTRAINT [FK_CourseInstructor_Course];
	GO

	-- Define the relationship between CourseInstructor and Person.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
 	  WHERE object_id = OBJECT_ID(N'[dbo].[FK_CourseInstructor_Person]')
	   AND parent_object_id = OBJECT_ID(N'[dbo].[CourseInstructor]'))
	ALTER TABLE [dbo].[CourseInstructor]  WITH CHECK ADD  
 	  CONSTRAINT [FK_CourseInstructor_Person] FOREIGN KEY([PersonID])
	REFERENCES [dbo].[Person] ([PersonID]);
	GO
	ALTER TABLE [dbo].[CourseInstructor] CHECK 
  	 CONSTRAINT [FK_CourseInstructor_Person];
	GO

	-- Define the relationship between Course and Department.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
       WHERE object_id = OBJECT_ID(N'[dbo].[FK_Course_Department]')
       AND parent_object_id = OBJECT_ID(N'[dbo].[Course]'))
	ALTER TABLE [dbo].[Course]  WITH CHECK ADD  
       CONSTRAINT [FK_Course_Department] FOREIGN KEY([DepartmentID])
	REFERENCES [dbo].[Department] ([DepartmentID]);
	GO
	ALTER TABLE [dbo].[Course] CHECK CONSTRAINT [FK_Course_Department];
	GO

	--Define the relationship between OfficeAssignment and Person.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
	  WHERE object_id = OBJECT_ID(N'[dbo].[FK_OfficeAssignment_Person]')
 	  AND parent_object_id = OBJECT_ID(N'[dbo].[OfficeAssignment]'))
	ALTER TABLE [dbo].[OfficeAssignment]  WITH CHECK ADD  
 	  CONSTRAINT [FK_OfficeAssignment_Person] FOREIGN KEY([InstructorID])
	REFERENCES [dbo].[Person] ([PersonID]);
	GO
	ALTER TABLE [dbo].[OfficeAssignment] CHECK 
   	 CONSTRAINT [FK_OfficeAssignment_Person];
	GO
</pre></div>



<h2 id="insertData">Step 6: Insert data</h2>

Open a new query window and then paste in the following script. Run the script to insert data. This script uses the [INSERT](http://msdn.microsoft.com/en-us/library/windowsazure/ee336284.aspx) statement to add values to each column.

<div style="width:auto; height:600px; overflow:auto"><pre>
	-- Insert data into the Person table.
	SET IDENTITY_INSERT dbo.Person ON;
	GO
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (1, 'Abercrombie', 'Kim', '1995-03-11', null);
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (2, 'Barzdukas', 'Gytis', null, '2005-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (3, 'Justice', 'Peggy', null, '2001-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (4, 'Fakhouri', 'Fadi', '2002-08-06', null);
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (5, 'Harui', 'Roger', '1998-07-01', null);
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (6, 'Li', 'Yan', null, '2002-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (7, 'Norman', 'Laura', null, '2003-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (8, 'Olivotto', 'Nino', null, '2005-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (9, 'Tang', 'Wayne', null, '2005-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (10, 'Alonso', 'Meredith', null, '2002-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (11, 'Lopez', 'Sophia', null, '2004-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (12, 'Browning', 'Meredith', null, '2000-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (13, 'Anand', 'Arturo', null, '2003-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (14, 'Walker', 'Alexandra', null, '2000-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (15, 'Powell', 'Carson', null, '2004-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (16, 'Jai', 'Damien', null, '2001-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (17, 'Carlson', 'Robyn', null, '2005-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (18, 'Zheng', 'Roger', '2004-02-12', null);
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (19, 'Bryant', 'Carson', null, '2001-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (20, 'Suarez', 'Robyn', null, '2004-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (21, 'Holt', 'Roger', null, '2004-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (22, 'Alexander', 'Carson', null, '2005-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (23, 'Morgan', 'Isaiah', null, '2001-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (24, 'Martin', 'Randall', null, '2005-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (25, 'Kapoor', 'Candace', '2001-01-15', null);
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (26, 'Rogers', 'Cody', null, '2002-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (27, 'Serrano', 'Stacy', '1999-06-01', null);
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (28, 'White', 'Anthony', null, '2001-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (29, 'Griffin', 'Rachel', null, '2004-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (30, 'Shan', 'Alicia', null, '2003-09-01');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (31, 'Stewart', 'Jasmine', '1997-10-12', null);
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (32, 'Xu', 'Kristen', '2001-7-23', null);
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (33, 'Gao', 'Erica', null, '2003-01-30');
	INSERT INTO dbo.Person (PersonID, LastName, FirstName, HireDate, EnrollmentDate)
	VALUES (34, 'Van Houten', 'Roger', '2000-12-07', null);
	GO
	SET IDENTITY_INSERT dbo.Person OFF;
	GO
	
</pre></div>


<h2 id="QueryDBSysData">Step 7: Query sample and system data in the Management Portal for SQL Database</h2>

To check your work, run a query that returns the data you just entered. You can also run built-in stored procedures and data management views that provide information about the databases running on your SQL Database server.

<h4 id="QueryDB">Query sample data</h4>

In a new query window, copy and run the following Transact-SQL script to retrieve some of the data you just added.


<div style="width:auto; height:auto; overflow:auto"><pre>
	SELECT * From Person
</pre></div>

You should see a result set with 34 rows from the person table, including PersonID, LastName, FirstName, HireDate, and EnrollmentDate.


<h4 id="QuerySys">Query system data</h4>

You can also use system views and built-in stored procedures to get information from the server. For the purposes of this tutorial, you will try out just a few commands.

Run the following command to find out which databases are available on the server. 

	SELECT * FROM sys.databases  

Run this command to return a list of users currently connected to the server.

	SELECT user_name(),suser_sname()

Run this stored procedure to return a list of all of the objects in the **School** database.

	EXEC SP_help

Do not close the portal connection to the **School** database. You will need it again in a few minutes.



<h2 id="DBLogin">Step 8: Create a database login and assign permissions</h2>

In SQL Database, you can create logins and grant permissions using Transact-SQL. In this lesson, using Transact-SQL, you will do three things:


1. Create a SQL Server authentication login
2. Create  a database user, and
3. Grant permissions via role membership.

A SQL Server authentication login is used for server connections. All users who access a database on a SQL Database server do so by providing a SQL Server authentication login name and password. 

To create a login, you must first connect to the **master** database.

<h4 id="CreateLogin">Create a SQL Server authentication login</h4>

1. In the [Management Portal](http://manage.windowsazure.com), select **SQL Databases**, click **Servers**, choose the server and then click the white arrow to open the
server page.

2. On the Quick Start page, click **Manage Server** to open a new connection to the Management Portal for SQL Database. 

3. Specify **master** for the database to connect to, then login with your username and password. This is the administrator login that you specified when you created the server.

4. The SQL Database management portal opens in a new browser window and you will be connected to **master**.

5. If you see an error on the page similar to the following, ignore it. Click **New Query** to open a query window that lets you execute Transact-SQL commands on the **master** database.

	![Navigation pane][Image15]

6. Copy and paste the following command into the query window.

        CREATE LOGIN SQLDBLogin WITH password='Password1';

7. Run the command to create a new SQL Server login named 'SQLDBLogin'.


<h4 id="CreateDBuser">Create a database user and assign permissions</h4>

After you create a SQL Server authentication login, the next step is to assign the database and permission levels associated with the login. You do this by creating a **database user** on each database.

1. Go back to the SQL Database management portal page that connects to the **School** database. If you closed the browser window, start a new connection to **School** database using the steps from the previous lesson, "Add data and a schema using Transact-SQL script". 

	On the SQL Database management portal page, the **School** database name is visible in the top left corner.

	![Navigation pane][Image12]

2. Click **New Query** to open a new query window and copy in the following statement. 

	    CREATE USER SQLDBUser FROM LOGIN SQLDBLogin;

3. Run the script. This script creates a new database user based on the login.

   Next, you'll assign permissions using the db_datareader role. Database users assigned to this role can read all data from all user tables in the database. 

4. Open a new query window and then enter and run the next statement. This statement runs a built-in stored procedure that assigns the db_datareader role to the new user you just created. 

        EXEC sp_addrolemember 'db_datareader', 'SQLDBUser';

You now have a new SQL Server authentication login that has read-only permission to the **School** database. Using these steps, you can create other SQL Server authentication logins to allow different levels of access to your data.


<h2 id="ClientConnection">Step 9: Connect from an application</h2>

You can use ADO.NET to connect to Microsoft Azure SQL Database. Unlike an on-premises connection, you need to account for throttling or other service faults that could terminate a connection or temporarily block new connections. This condition is called a transient fault. To manage transient faults, you implement a retry strategy. When connecting to Azure SQL Database, the [Transient Fault Handling Application Block](http://go.microsoft.com/fwlink/?LinkId=519356), part of Enterprise Library 6 – April 2013, has detection strategies that identify a transient fault condition.

<h4>Sample C# Console Application</h4>


	static void Main(string[] args)
    {
        //NOTE: Use appropriate exception handling in a production application.

        //Replace
        //  builder["Server"]: {servername} = Your Azure SQL Database server name
        //  builder["User ID"]: {username}@{servername} = Your Azure SQL Database user name and server name
        //  builder["Password"]: {password} = Your Azure SQL Database password

        System.Data.SqlClient.SqlConnectionStringBuilder builder = new System.Data.SqlClient.SqlConnectionStringBuilder();
        builder["Server"] = "{servername}";
        builder["User ID"] = "{username}@{servername}";
        builder["Password"] = "{password}";

        builder["Database"] = "AdventureWorks2012";
        builder["Trusted_Connection"] = false;
        builder["Integrated Security"] = false;
        builder["Encrypt"] = true;

        //1. Define an Exponential Backoff retry strategy for Azure SQL Database throttling (ExponentialBackoff Class). An exponential back-off strategy will gracefully back off the load on the service.
        int retryCount = 4;
        int minBackoffDelayMilliseconds = 2000;
        int maxBackoffDelayMilliseconds = 8000;
        int deltaBackoffMilliseconds = 2000;

        ExponentialBackoff exponentialBackoffStrategy = 
          new ExponentialBackoff("exponentialBackoffStrategy",
              retryCount,
              TimeSpan.FromMilliseconds(minBackoffDelayMilliseconds), 
              TimeSpan.FromMilliseconds(maxBackoffDelayMilliseconds),
              TimeSpan.FromMilliseconds(deltaBackoffMilliseconds));

        //2. Set a default strategy to Exponential Backoff.
        RetryManager manager = new RetryManager(new List<RetryStrategy>
        {  
            exponentialBackoffStrategy 
        }, "exponentialBackoffStrategy");

        //3. Set a default Retry Manager. A RetryManager provides retry functionality, or if you are using declarative configuration, you can invoke the RetryPolicyFactory.CreateDefault
            RetryManager.SetDefault(manager);

        //4. Define a default SQL Connection retry policy and SQL Command retry policy. A policy provides a retry mechanism for unreliable actions and transient conditions.
        RetryPolicy retryConnectionPolicy = manager.GetDefaultSqlConnectionRetryPolicy();
        RetryPolicy retryCommandPolicy = manager.GetDefaultSqlCommandRetryPolicy();

        //5. Create a function that will retry the connection using a ReliableSqlConnection.
        retryConnectionPolicy.ExecuteAction(() =>
        {
            using (ReliableSqlConnection connection = new ReliableSqlConnection(builder.ConnectionString))
            {
                connection.Open();

                IDbCommand command = connection.CreateCommand();
                command.CommandText = "SELECT Name FROM Production.Product";

                //6. Create a function that will retry the command calling ExecuteCommand() from the ReliableSqlConnection
                retryCommandPolicy.ExecuteAction(() =>
                {
                    using (IDataReader reader = connection.ExecuteCommand<IDataReader>(command))
                    {
                        while (reader.Read())
                        {
                            string name = reader.GetString(0);

                            Console.WriteLine(name);
                        }
                    }
                });                  
            }
        });

        Console.ReadLine();
    }



<h2 id="NextSteps">Next steps</h2>

Now that you are familiar with SQL Database and the management portals, you can try out other tools and techniques used by SQL Server database administrators.

To actively manage your new database, consider installing and using SQL Server Management Studio. Management Studio is the primary database administration tool for managing SQL Server databases, including those running on Azure. Using Management Studio, you can save queries for future use, add new tables and stored procedures, and hone your Transact-SQL skills in a rich scripting environment that includes a syntax checker, intellisense, and templates. To get started, follow the instructions in [Managing SQL Databases Using SQL Server Management Studio](http://www.azure.microsoft.com/en-us/documentation/articles/sql-database-manage-azure-ssms/).

Fluency in the Transact-SQL query and data definition language is essential for database administrators. If you are new to Transact-SQL, start with the [Tutorial: Writing Transact-SQL Statements](http://msdn.microsoft.com/en-us/library/ms365303.aspx) to learn some basic skills.

There are other methods for moving an on-premises database to SQL Database. If you have existing databases, or if you downloaded sample databases to practice with, try the following alternative approaches:

* [Migrating Databases to SQL Database](http://msdn.microsoft.com/en-us/library/windowsazure/ee730904.aspx)
* [Copying Databases in SQL Database](http://msdn.microsoft.com/en-us/library/windowsazure/ff951624.aspx)
* [Deploy a SQL Server Database to an Azure Virtual Machine](http://msdn.microsoft.com/en-us/library/dn195938)



[Image1]: ./media/sql-database-get-started/1NavPaneDBSelected_SQLTut.png
[Image2]: ./media/sql-database-get-started/2MainPageCustomCreateDB_SQLTut.png
[Image3]: ./media/sql-database-get-started/3DatabaseSettings_SQLTut.PNG
[Image4]: ./media/sql-database-get-started/4ServerSettings_SQLTut.PNG
[Image5]: ./media/sql-database-get-started/5DBPortalDatabasesServers_SQLTut.PNG
[Image6]: ./media/sql-database-get-started/6DBConfigFirewall_SQLTut.PNG
[Image7]: ./media/sql-database-get-started/7DBConfigFirewallSAVE_SQLTut.png
[Image8]: ./media/sql-database-get-started/20MainPageHome_SQLTut.PNG
[Image9]: ./media/sql-database-get-started/9dblistschool_SQLTut.PNG
[Image10]: ./media/sql-database-get-started/10dbportalmanagebutton_SQLTut.PNG
[Image11]: ./media/sql-database-get-started/11ManageDatabaseLogin_SQLTut.PNG
[Image12]: ./media/sql-database-get-started/12DBPortalNewQuery_SQLTut.PNG
[Image13]: ./media/sql-database-get-started/13DBQueryResults_SQLTut.PNG
[Image14]: ./media/sql-database-get-started/14DBPortalConnectMaster_SQLTut.PNG
[Image15]: ./media/sql-database-get-started/15DBPortalConnectMasterErr_SQLTut.PNG
[Image16]: ./media/sql-database-get-started/16ExcelConnect_SQLTut.png
[Image17]: ./media/sql-database-get-started/17ExcelSelect_SQLTut.PNG
[Image18]: ./media/sql-database-get-started/18ExcelTable_SQLTut.PNG
[Image19]: ./media/sql-database-get-started/19ExcelImport_SQLTut.png
[Image20]: ./media/sql-database-get-started/11ManageDatabaseLogin_SQLTut.PNG

