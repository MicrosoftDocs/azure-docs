
<div chunk="../chunks/sql-databases-left-nav.md" />

# How to Manage SQL Databases on Windows Azure

This guide shows you how to perform administrative tasks for logical servers and database instances on Windows Azure SQL Database. 

##What is SQL Database?

SQL Database provides relational database management services on Windows Azure, and is based on SQL Server technology. With SQL Database, you can easily provision and deploy database instances, and take advantage of a distributed data center that provides enterprise-class availability, scalability, and security with the benefits of built-in data protection and self-healing. 

##Table of Contents

* [Sign in to Windows Azure][] 
* [Configure SQL Database][]
* [Connect using Management Studio][]
* [Deploy a database to Windows Azure][]
* [Add logins and users][]
* [Scale a SQL Database solution][]
* [Monitor logical servers and database instances][]
* [Next Steps][]


<h2><a id="PreReq1"></a>Sign in to Windows Azure</h2>

SQL Database provides relational data storage, access, and management services on Windows Azure. To use it, you'll need a Windows Azure subscription.

1. Open a web browser, and browse to [http://www.windowsazure.com](http://www.windowsazure.com). To get started with a free account, click free trial in the upper right corner and follow the steps.

2. Your account is now created. You are ready to get started.


<h2><a id="PreReq2"></a>Create and configure SQL Database</h2>

Next, you'll step through logical server creation and configuration. In the new Windows Azure (Preview) Management Portal, revised workflows let you create a database first, and then create a server. 

In this guide, you'll create the server first. You might prefer this approach if you have existing SQL Server databases that you want to upload.

<h3><a id="createsrvr"></a>Create a logical server</h3>

1. Sign in at [http://www.windowsazure.com](http://www.windowsazure.com),

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

<h3><a id="configFWLogical"></a>Configure the firewall for the logical server</h3>

1. Click **SQL Databases**, click **Servers**, and then click on the server you just created.

2. Click **Configure**. 

3. Copy the current client IP address. If you are connecting from a network, this is the IP address that your  router or proxy server is listening on. SQL Database detects the IP address used by the current connection so that you can create a firewall rule to accept connection requests from this device. 

4. Paste the IP address into both the beginning and end range. Later, if you encounter connection errors indicating that the range is too narrow, you can edit this rule to widen the range.

  If client computers use dynamically assigned IP addresses, you must specify a range that is broad enough to include IP addresses assigned to computers in your network. Start with a narrow range, and then expand it only if you need to.

5. Enter a name for the firewall rule, such as the name of your computer or company.

6. Click the checkmark to save the rule.

7. Click **Save** at the bottom of the page to complete the step. If you do not see **Save**, refresh the browser page.

You now have a logical server, a firewall rule that allows inbound connections from your IP address, and an administrator login. In the next step, you'll switch to your local computer to complete the remaining configuration steps.

**Note:** The logical server you just created is transient and will be dynamically hosted on physical servers in a data center. If you delete the server, you should know in advance that this is a non-recoverable action. Be sure to backup any databases that you subsequently upload to the server. 



<h2><a id="PreReq3"></a>Connect using Management Studio</h2>

Management Studio is an administrative tool that lets you manage multiple SQL Server instances and servers in a single workspace. If you already have an on-premises SQL Server instance, you can open a connection to both the on-premises instance and a logical server on Windows Azure to perform tasks side by side.

Management Studio includes features that are not currently available in the management portal, such as a syntax checker and the ability to save scripts and named queries for reuse. SQL Database is just a tabular data stream (TDS) endpoint. Any tools that work with TDS, including Management Studio, are valid for SQL Database operations. Scripts that you develop for on-premises server will run on a SQL Database logical server. 

In the following step, you'll use Management Studio to connect to a logical server on Windows Azure. This step requires you to have SQL Server Management Studio version 2008 R2 or 2012. If you need help downloading or connecting to  Management Studio, see [Managing SQL Database using Management Studio][] on this site.

Before you can connect, it is sometimes necessary to create a firewall exception that allows outbound requests on port 1433 on your local system. Computers that are secure by default typically do not have port 1433 open. 

<h3><a id="configFWOnPremise"></a>Configure the firewall for an on-premises server</h3>

1. In Windows Firewall with Advanced Security, create a new outbound rule.

2. Choose **Port**, specify TCP 1433, specify **Allow the connection**, and be sure that the **Public** profile is selected.

3. Provide a meaningful name, such as *WindowsAzureSQLDatabase (tcp-out) port 1433*. 


<h3><a id="logical"></a>Connect to a logical server</h3>

1. In Management Studio, in Connect to Server, make sure that Database Engine is selected, then enter the logical server name in this format: *servername*.database.widnows.net

   You can also get the fully qualified server name in the management portal, on the server dashboard, in MANAGE URL.

2. In Authentication, choose **SQL Server Authentication** and then enter the administrator login that you created when you configured the logical server.

3. Click **Options**. 

4. In Connect to database, specify **master**.


<h3><a id="premise"></a>Connect to an on-premises server</h3>

1. In Management Studio, in Connect to Server, make sure that Database Engine is selected, then enter the name of a local instance in this format: *servername*\\*instancename*. If the server is local and a default instance, enter *localhost*.

2. In Authentication, choose **Windows Authentication** and then enter a Windows account that is a member of the sysadmin role.


<h2><a id="HowTo1"></a>Deploy a database to Windows Azure</h2>

There are numerous approaches for moving an on-premises SQL Server database to Windows Azure. In this task, you'll use the Deploy Database to SQL Database wizard to upload a sample database.

The School sample database is conveniently simple; all of its objects are compatible with SQL Database, eliminating the need to modify or prepare a database for migration. As a new administrator, try deploying a simple database first to learn the steps before using your own databases. 

**Note:** Review the SQL Database Migration Guide for detailed instructions on how to prepare an on-premises database for migration to Windows Azure. Also, consider downloading the Windows Azure Training Kit. It includes a lab that shows an alternative approach to migrating an on-premises database.

<h3><a id="CreateDB"></a>Create the school database on an on-premises server</h3>

Scripts for creating this database can be found in the [Getting Started with SQL Database Administration][]. In this guide, you'll run these scripts in Management Studio to create an on-premises version of the school database.

1. In Management Studio, connect to an on-premises server. Right-click **Databases**, click **New Database**, and enter *school*.

2. Right-click on *school*, click **New Query**. 

3. Copy and then execute the Create Schema script from the tutorial. 

<div style="width:auto; height:300px; overflow:auto"><pre>
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

Next, copy and execute the Insert Data script.

<div style="width:auto; height:300px; overflow:auto"><pre>
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
	-- Insert data into the Department table.
	INSERT INTO dbo.Department (DepartmentID, [Name], Budget, StartDate, Administrator)
	VALUES (1, 'Engineering', 350000.00, '2007-09-01', 2);
	INSERT INTO dbo.Department (DepartmentID, [Name], Budget, StartDate, Administrator)
	VALUES (2, 'English', 120000.00, '2007-09-01', 6);
	INSERT INTO dbo.Department (DepartmentID, [Name], Budget, StartDate, Administrator)
	VALUES (4, 'Economics', 200000.00, '2007-09-01', 4);
	INSERT INTO dbo.Department (DepartmentID, [Name], Budget, StartDate, Administrator)
	VALUES (7, 'Mathematics', 250000.00, '2007-09-01', 3);
	GO
	-- Insert data into the Course table.
	INSERT INTO dbo.Course (CourseID, Title, Credits, DepartmentID)
	VALUES (1050, 'Chemistry', 4, 1);
	INSERT INTO dbo.Course (CourseID, Title, Credits, DepartmentID)
	VALUES (1061, 'Physics', 4, 1);
	INSERT INTO dbo.Course (CourseID, Title, Credits, DepartmentID)
	VALUES (1045, 'Calculus', 4, 7);
	INSERT INTO dbo.Course (CourseID, Title, Credits, DepartmentID)
	VALUES (2030, 'Poetry', 2, 2);
	INSERT INTO dbo.Course (CourseID, Title, Credits, DepartmentID)
	VALUES (2021, 'Composition', 3, 2);
	INSERT INTO dbo.Course (CourseID, Title, Credits, DepartmentID)
	VALUES (2042, 'Literature', 4, 2);
	INSERT INTO dbo.Course (CourseID, Title, Credits, DepartmentID)
	VALUES (4022, 'Microeconomics', 3, 4);
	INSERT INTO dbo.Course (CourseID, Title, Credits, DepartmentID)
	VALUES (4041, 'Macroeconomics', 3, 4);
	INSERT INTO dbo.Course (CourseID, Title, Credits, DepartmentID)
	VALUES (4061, 'Quantitative', 2, 4);
	INSERT INTO dbo.Course (CourseID, Title, Credits, DepartmentID)
	VALUES (3141, 'Trigonometry', 4, 7);
	GO
	-- Insert data into the OnlineCourse table.
	INSERT INTO dbo.OnlineCourse (CourseID, URL)
	VALUES (2030, 'http://www.fineartschool.net/Poetry');
	INSERT INTO dbo.OnlineCourse (CourseID, URL)
	VALUES (2021, 'http://www.fineartschool.net/Composition');
	INSERT INTO dbo.OnlineCourse (CourseID, URL)
	VALUES (4041, 'http://www.fineartschool.net/Macroeconomics');
	INSERT INTO dbo.OnlineCourse (CourseID, URL)
	VALUES (3141, 'http://www.fineartschool.net/Trigonometry');
	--Insert data into OnsiteCourse table.
	INSERT INTO dbo.OnsiteCourse (CourseID, Location, Days, [Time])
	VALUES (1050, '123 Smith', 'MTWH', '11:30');
	INSERT INTO dbo.OnsiteCourse (CourseID, Location, Days, [Time])
	VALUES (1061, '234 Smith', 'TWHF', '13:15');
	INSERT INTO dbo.OnsiteCourse (CourseID, Location, Days, [Time])
	VALUES (1045, '121 Smith','MWHF', '15:30');
	INSERT INTO dbo.OnsiteCourse (CourseID, Location, Days, [Time])
	VALUES (4061, '22 Williams', 'TH', '11:15');
	INSERT INTO dbo.OnsiteCourse (CourseID, Location, Days, [Time])
	VALUES (2042, '225 Adams', 'MTWH', '11:00');
	INSERT INTO dbo.OnsiteCourse (CourseID, Location, Days, [Time])
	VALUES (4022, '23 Williams', 'MWF', '9:00');
	-- Insert data into the CourseInstructor table.
	INSERT INTO dbo.CourseInstructor(CourseID, PersonID)
	VALUES (1050, 1);
	INSERT INTO dbo.CourseInstructor(CourseID, PersonID)
	VALUES (1061, 31);
	INSERT INTO dbo.CourseInstructor(CourseID, PersonID)
	VALUES (1045, 5);
	INSERT INTO dbo.CourseInstructor(CourseID, PersonID)
	VALUES (2030, 4);
	INSERT INTO dbo.CourseInstructor(CourseID, PersonID)
	VALUES (2021, 27);
	INSERT INTO dbo.CourseInstructor(CourseID, PersonID)
	VALUES (2042, 25);
	INSERT INTO dbo.CourseInstructor(CourseID, PersonID)
	VALUES (4022, 18);
	INSERT INTO dbo.CourseInstructor(CourseID, PersonID)
	VALUES (4041, 32);
	INSERT INTO dbo.CourseInstructor(CourseID, PersonID)
	VALUES (4061, 34);
	GO
	--Insert data into the OfficeAssignment table.
	INSERT INTO dbo.OfficeAssignment(InstructorID, Location)
	VALUES (1, '17 Smith');
	INSERT INTO dbo.OfficeAssignment(InstructorID, Location)
	VALUES (4, '29 Adams');
	INSERT INTO dbo.OfficeAssignment(InstructorID, Location)
	VALUES (5, '37 Williams');
	INSERT INTO dbo.OfficeAssignment(InstructorID, Location)
	VALUES (18, '143 Smith');
	INSERT INTO dbo.OfficeAssignment(InstructorID, Location)
	VALUES (25, '57 Adams');
	INSERT INTO dbo.OfficeAssignment(InstructorID, Location)
	VALUES (27, '271 Williams');
	INSERT INTO dbo.OfficeAssignment(InstructorID, Location)
	VALUES (31, '131 Smith');
	INSERT INTO dbo.OfficeAssignment(InstructorID, Location)
	VALUES (32, '203 Williams');
	INSERT INTO dbo.OfficeAssignment(InstructorID, Location)
	VALUES (34, '213 Smith');
	-- Insert data into the StudentGrade table.
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (2021, 2, 4);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (2030, 2, 3.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (2021, 3, 3);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (2030, 3, 4);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (2021, 6, 2.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (2042, 6, 3.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (2021, 7, 3.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (2042, 7, 4);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (2021, 8, 3);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (2042, 8, 3);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4041, 9, 3.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4041, 10, null);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4041, 11, 2.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4041, 12, null);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4061, 12, null);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4022, 14, 3);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4022, 13, 4);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4061, 13, 4);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4041, 14, 3);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4022, 15, 2.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4022, 16, 2);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4022, 17, null);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4022, 19, 3.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4061, 20, 4);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4061, 21, 2);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4022, 22, 3);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4041, 22, 3.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4061, 22, 2.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (4022, 23, 3);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (1045, 23, 1.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (1061, 24, 4);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (1061, 25, 3);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (1050, 26, 3.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (1061, 26, 3);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (1061, 27, 3);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (1045, 28, 2.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (1050, 28, 3.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (1061, 29, 4);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (1050, 30, 3.5);
	INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
	VALUES (1061, 30, 4);
	GO
</pre></div>

   You now have an on-premises database that you can export to Windows Azure. Next, you'll run a wizard that creates a .bacpac file, loads it onto Windows Azure, and imports it into SQL Database.


<h3><a id="DeployDB"></a>Deploy to SQL Database</h3>

1. In Management Studio, connect to an on-premises SQL Server instance that has a database you want to migrate.

2. Right-click the school database that you just created, point to **Tasks**, and click **Deploy Database to SQL Database**.

3. In Deployment Settings, enter a name for the database, such as *school*. 

4. Click **Connect**.

5. In Server name, enter the 10-character server name, followed by .databases.windows.net.

6. In Authentication, choose **SQL Server Authentication**.

7. Enter the administrator login name and password that you provisioned when creating the SQL Database logical server.

8. Click **Options**.

9. In Connection Properties, in Connect to database, type **master**.

10. Click **Connect**. This step concludes the connection specification and takes you back to the wizard.


11. Click **Next** and click **Finish** to run the wizard.

<h3><a id="VerifyDBMigration"></a>Verify database deployment</h3>

1. In Management Studio, connect to the logical server. If you already have a connection open, you can close it and open a new one. The existing connection shows only those databases that were running at the time the connection was made.

   For instructions on how to connect to a logical server, see [Connect using Management Studio][] in this document. 

2. Expand the Databases folder. You should see the school database in the list.

3. Right-click on the school database and click **New Query**.

4. Execute the following query to verify that data is accessible.

<div style="width:auto; height:auto; overflow:auto"><pre>
	SELECT
		Course.Title as "Course Title"
  		,Department.Name as "Department"
  		,Person.LastName as "Instructor"
  		,OnsiteCourse.Location as "Location"
  		,OnsiteCourse.Days as "Days"
  		,OnsiteCourse.Time as "Time"
	FROM
 	 Course
 	 INNER JOIN Department
  	  ON Course.DepartmentID = Department.DepartmentID
 	 INNER JOIN CourseInstructor
 	   ON Course.CourseID = CourseInstructor.CourseID
 	 INNER JOIN Person
 	   ON CourseInstructor.PersonID = Person.PersonID
 	 INNER JOIN OnsiteCourse
		ON OnsiteCourse.CourseID = CourseInstructor.CourseID;
</pre></div>


<h2><a id="HowTo2"></a>Add logins and users</h2>

After you deploy a database, you need to configure logins and assign permissions. In the next step, you’ll run two scripts.

For the first script, you'll connect to master and run a script that creates logins. Logins will be used to support read and write operations, and to delegate operational tasks, such as the ability to run system queries without ‘sa’ permissions.

The logins you create must be SQL Server authentication logins. If you already have ready-made scripts that use Windows user identities or claims identities, that script will not work on SQL Database.

The second script assigns database user permissions. For this script, you will connect to a database already loaded on Windows Azure.

<h3><a id="CreateLogins"></a>Create logins</h3>

1. In Management Studio, connect to a logical server on Windows Azure, expand the Databases folder, right-click **master**, and select **New Query**.

2. Use the following Transact-SQL statements to create logins. Replace the password with a valid password. Select each one individually, and then click **Execute**. Repeat for the remaining logins.

<div style="width:auto; height:auto; overflow:auto"><pre>
    -- run on master, execute each line separately
    -- use this login to manage other logins on this server
    CREATE LOGIN sqladmin WITH password='&lt;ProvidePassword&gt;'; 
    CREATE USER sqladmin FROM LOGIN sqladmin;
    EXEC sp_addrolemember 'loginmanager', 'sqladmin';

    -- use this login to create or copy a database
    CREATE LOGIN sqlops WITH password='&lt;ProvidePassword&gt;';
    CREATE USER sqlops FROM LOGIN sqlops;
    EXEC sp_addrolemember 'dbmanager', 'sqlops';
</pre></div>


<h3><a id="CreateDBUsers"></a>Create database users</h3>

1. Expand the Databases folder, right-click **school**, and select **New Query**.

2. Use the following Transact-SQL statements to add database users. Replace the password with a valid password. 

<div style="width:auto; height:auto; overflow:auto"><pre>
    -- run on a regular database, execute each line separately
    -- use this login for read operations
    CREATE LOGIN sqlreader WITH password='&lt;ProvidePassword&gt;';
    CREATE USER sqlreader FROM LOGIN sqlreader;
    EXEC sp_addrolemember 'db_datareader', 'sqlreader';

    -- use this login for write operations
    CREATE LOGIN sqlwriter WITH password='&lt;ProvidePassword&gt;';
    CREATE USER sqlwriter FROM LOGIN sqlwriter;
    EXEC sp_addrolemember 'db_datawriter', 'sqlwriter';

    -- grant DMV permissions on the school database to 'sqlops'
    GRANT VIEW DATABASE STATE to 'sqlops';
</pre></div>

<h3><a id="ViewLogins"></a>View and test logins</h3>

1. In a new query window, connect to **master** and execute the following statement: 

        SELECT * from sys.sql_logins;

2. In Management Studio, right click on **school** database and select **New Query**.

3. On the Query menu, point to **Connection**, and then click **Change Connection**.

4. Login as *sqlreader*.

5. Copy and try to run the following statement. You should get an error stating that the object does not exist.

        INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
        VALUES (1061, 30, 9);

6. Open a second query window and change the connection context to *sqlwriter*. The same query should now run successfully.

You have now created and tested several logins. For more information, see [Managing Databases and Logins in SQL Database][] and [Monitoring SQL Database Using Dynamic Management Views][].


<h2><a id="HowTo3"></a>Monitor logical servers and database instances</h2>

Monitoring tools and techniques that you might be accustomed to using on an on-premises server, such as auditing logins, running traces, and using performance counters, are not available for SQL Database. On Windows Azure, you use Data Management Views (DMVs) to monitor data capacity, query problems, and current connections. 

For more information, see [Monitoring SQL Database Using Dynamic Management Views][].


<h2><a id="HowTo4"></a>Scale a SQL Database solution</h2>

On Windows Azure, database scalability is synonymous with scale out, where a workload is redistributed across multiple commodity servers in a data center. Scale out is a strategy for addressing problems with data capacity or performance. A very large database that is on a high-growth trajectory will eventually require a scale out strategy, whether it is accessed by a few users or many users.

Scale out on Windows Azure is best achieved through federation. SQL Database federation is based on horizontal sharding, where one or more tables are split by row and portioned across multiple federation members. 

Federation is not the only answer to every scalability problem. Sometimes the characteristics of your data or application requirements point to simpler approaches. The following list presents potential solutions in order of complexity.

**Increase the size of the database**

Databases are created at a fixed size subject to a maximum imposed by each edition. For the Web edition, you can increase a database to a maximum of 5 gigabytes. For Business edition, the maximum database size is 150 gigabytes. The most obvious way to increase data capacity is to change the edition and maximum size:

     ALTER DATABASE school MODIFY (EDITION = 'Business', MAXSIZE=10GB);

**Use multiple databases and allocate users**

In limited scenarios, you could create copies of a database and then allocate logins and users across each database. Before federation was an option, this was a common approach for redistributing a workload. This approach is viable for databases that you use on a short-term basis and then merge later into a primary database that you keep on premise, and for solutions that provide read-only data.

**Use federations**

Federations in SQL Database are used to achieve greater scalability and performance. One or more tables within a database are split by row and portioned across multiple databases (Federation members). This type of horizontal partitioning is often referred to as ‘sharding’. The primary scenarios in which this is useful are where you need to achieve scale, performance, or to manage capacity. 

Federations are supported in the Business edition. For more information, see [Federations in SQL Database][] and [SQL Database Federations Tutorial - DBA][].

**Consider other forms of storage**

Remember that Windows Azure supports multiple forms of data storage, including table storage and blob storage. If you do not require relational features, table or blob storage can be more economical. 

<h2><a id="NextSteps"></a>Next Steps</h2>

Now that you've learned the basics of SQL Database administration, follow these links to learn how to do more complex administative tasks.

* See [SQL Database][] on MSDN
* Visit the [SQL Database TechNet WIKI][]


[Concepts]: #Concepts
[Sign in to Windows Azure]: #PreReq1
[Configure SQL Database]: #PreReq2
[Connect using Management Studio]: #PreReq3
[Deploy a database to Windows Azure]: #HowTo1
[Add logins and users]: #HowTo2
[Monitor logical servers and database instances]: #HowTo3
[Scale a SQL Database solution]: #HowTo4
[Next Steps]: #NextSteps

[SQL Database]: http://msdn.microsoft.com/en-us/library/windowsazure/gg619386

[SQL Database TechNet WIKI]: http://social.technet.microsoft.com/wiki/contents/articles/2267.sql-azure-technet-wiki-articles-index-en-us.aspx

[How to Use SQL Database]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/sql-azure/
[Federations in SQL Database]: http://msdn.microsoft.com/en-us/library/windowsazure/hh597452.aspx
[SQL Database Federations Tutorial - DBA]: http://msdn.microsoft.com/en-us/library/windowsazure/hh778416.aspx
[Managing SQL Database using Management Studio]: http://www.windowsazure.com/en-us/develop/net/common-tasks/sql-azure-management/
[Monitoring SQL Database Using Dynamic Management Views]: http://msdn.microsoft.com/en-us/library/windowsazure/ff394114.aspx
[Introducing Geo-Replication for Windows Azure Storage]: http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/introducing-geo-replication-for-windows-azure-storage.aspx
[How to create a storage account for a Windows Azure Subscription]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433066.aspx
[Download Windows Azure SDK]: http://www.microsoft.com/en-us/download/details.aspx?id=15658
[Windows Azure Management Tools]: http://wapmmc.codeplex.com/
[Getting Started with SQL Database Administration]: http://www.windowsazure.com/en-us/manage/tutorials/sql-azure-management/  
[Managing Databases and Logins in SQL Database]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336235.aspx
[How to use the blob storage service]: https://www.windowsazure.com/en-us/develop/net/how-to-guides/blob-storage/
[DAC SQL Database Import Export Service Client v 1.5]: http://sqldacexamples.codeplex.com/releases/view/85948


[Adventure Works for SQL Database]: http://msftdbprodsamples.codeplex.com/releases/view/37304

