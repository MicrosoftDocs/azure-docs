<h1 id="SQLAzureTutorialITPro"> Getting Started with Windows Azure SQL Databases</h1>

Learn the fundamentals of Windows Azure database administration using just the portal and the instructions in this tutorial. If you are new to database administration, you can follow these lessons to learn essential skills in about 30 minutes. 

This tutorial does not assume prior experience with SQL Server or Windows Azure SQL Database. Upon completing this tutorial, you will have a sample database on Windows Azure and an understanding of how to perform basic administration tasks using the management portal.

You will learn:

* How to create a database and server using the portal.
* How to add data using script.
* How to query sample and system data.
* How to create a database login and assign permissions.
* How to connect to the database from Excel.


You will create and provision a sample database on Windows Azure and query system and user data using Excel and other applications.



<h2 id="Subscribe">Create a Windows Azure Account</h2>

1. Open a web browser, and browse to [http://www.windowsazure.com](http://www.windowsazure.com).
To get started with a free account, click free trial in the upper right corner and follow the steps.

2. Your account is now created. You are ready to get started.


<h2 id="Connect">Connect to SQL Database and create a database</h2>


1. Connect to Windows Azure at [http://www.windowsazure.com](http://www.windowsazure.com) and log in to the portal. You should see a navigation pane that looks like this. 

    ![Image1] []

2. Click **New** at the bottom of the page. When you click **New**, a list rolls up the screen showing things you can create.

3. Click **SQL Database** and then click **Custom Create**. 

    ![Image2] []

    Choosing this option lets you create a new server at the same time, with you as the administrator. As the system administrator, you can perform more tasks, including connecting to the SQL Database management portal, which you will do later in this tutorial.  

4.  The Database Settings page appears when you click **Custom Create**. In this page, you provide basic information that creates an empty database on the server. Adding tables and data will come in a later step. 

    Fill out the Database Settings page as follows:

    ![Image3] []

* Enter **School** for the database name. 

* Use the default settings for edition, max size, and collation. 

* Choose **New SQL Azure Server**. Selecting a new server adds a second page that we'll use to set the administrator account and region. 

* When you are through, click the arrow to go to next page.


7. Fill out the Server Settings as follows: 

    ![Image4] []

* Enter an administrator name as one word with no spaces. SQL Database uses SQL Authentication over an encrypted connection to validate user identity. A new login that has administrator permissions will be created using the name you provide. The administrator name cannot be a Windows user, nor should it be a Windows Live ID. Windows authentication is not supported on SQL Database.

* Provide a strong password that is over eight characters, using a combination of upper and lower case values, and a number or symbol.

* Choose a region. Region determines the geographical location of the server. Regions cannot be easily switched, so choose one that makes sense for this server. Generally, you choose a location that is closest to you or your customers to minimize how long it takes data to travel over an internet connection.

* Be sure to keep the **Allow Windows Azure Services to access this server**  checkbox selected so that you can connect to this database using the SQL Database management portal, Excel in Office 365, or Windows Azure SQL Reporting.

* Click the checkmark at the bottom of the page when you are finished.

Notice that you did not specify a server name. Because the SQL Database server must be accessible worldwide, SQL Database configures the appropriate DNS entries when the server is created. The generated name ensures that there are no name collisions with other DNS entries. You cannot change the name of your SQL Database server.

In the next step, you will configure the firewall so that connections from applications running on your computer are allowed to access the databases on your SQL Database server.



<h2 id="ConfigFirewall">Configure the firewall</h2>

To configure the firewall so that connections are allowed through, you'll enter information on the server page.

**Note:** The SQL Database service is only available with TCP port 1433 used by the TDS protocol, so make sure that the firewall on your network and local computer allows outgoing TCP communication on port 1433. For more information, see [SQL Azure Firewall](http://social.technet.microsoft.com/wiki/contents/articles/2677.sql-azure-firewall-en-us.aspx).


1. In the navigation pane on the left, click **SQL Databases**.

2. Click **Servers** at the top of the page. Next, click on the server you just created so that you see a white arrow to the right. Click on the arrow to open the server page.

    ![Image5] []

3. On the server page, click **Configure** to open the firewall configuration settings and specify the rule as follows: 

    ![Image6] []

* Copy the current client IP address. This is the IP address that your  router or proxy server is listening on. SQL Database detects the IP address used by the current connection so that you can create a firewall rule to accept connection requests from this device. 

* Paste the IP address into both the beginning and end range. Later, if you encounter connection errors indicating that the range is too narrow, you can edit this rule to widen the range.

* Enter a name for the firewall rule, such as the name of your computer or company.

* Click the checkmark to save the rule.

    After you save the rule, your page will look similar to the following screenshot.

    ![Image7] []

4. Click **Save** at the bottom of the page to complete the step. If you do not see **Save**, refresh the browser page.

You now have a SQL Database server on Windows Azure, a firewall rule that enables access to the server, a database object, and an administrator login. But you still don't have a working database that you can query. To do that, your database must have a schema and actual data.

Because this tutorial uses just the tools on hand, you'll use the query window in the management portal to run Transact-SQL (T-SQL) script that builds a predefined database.

As your skills increase, you will want to explore additional ways of creating a database, including programmatic approaches or the designer in SQL Server Data Tools. If you already have an existing SQL Server database that runs on a local server, you can easily migrate that database to the SQL Azure server that you just set up. Use the links at the end of this tutorial to find out how. 



<h2 id="AddData">Add data and a schema using T-SQL script</h2>

In this step, you run two scripts. The first one creates a schema that defines tables, columns, and relationships. The second script adds the data. Each step is performed independently on a separate connection. If you've built databases in SQL Server before, one of the differences you'll notice in SQL Database is that CREATE and INSERT commands must run in separate batches. SQL Database imposes this requirement to minimize attacks against the data while it is in transit. 

**Note:** The schema and data values are taken from this [MSDN article](http://msdn.microsoft.com/en-us/library/windowsazure/ee621790.aspx "MSDN article") and have been modified to work with SQL Database.

1. Go to the home page. In the portal, the **School** database appears in the list of items on the home page. 

   ![Image8] []


2. Click on **School** so that you see a white arrow to the right. Click on the arrow to open the database page.

   ![Image9] []

3. Click **Manage** at the bottom of the page. If it is not visible, refresh the browser window. This will open the SQL Database management portal. This portal is separate from the Windows Azure management portal. You'll use this portal to run T-SQL commands and queries. 

	![Image10] []

4. Enter the administrator login name and password. This is the administrator login that you specified when you created the server.

	![Image11] []

5. Click **New Query** in SQL Database management portal. An empty query window opens in the workspace. In the next step, you will use this window to copy in a series of predefined scripts that will add structure and data to your empty database.

	![Image12] []
	

<h2 id="createschema">Create the schema</h2>

In this step, you will create the schema using the following script. The script first checks for an existing table of the same name to ensure there won't be a name collision, and creates the table using the [CREATE TABLE](http://msdn.microsoft.com/en-us/library/windowsazure/ee336258.aspx) statement. Further on, this script uses the [ALTER TABLE](http://msdn.microsoft.com/en-us/library/windowsazure/ee336286.aspx) statement to specify the primary key and table relationships.

Copy the script and paste it into the query window. Click **Run** at the top of the window to execute the script.


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
    END
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
	END
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
	END
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
	END
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
	END
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
	END
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
	END
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
	END
	GO

	-- Define the relationship between OnsiteCourse and Course.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
       WHERE object_id = OBJECT_ID(N'[dbo].[FK_OnsiteCourse_Course]')
       AND parent_object_id = OBJECT_ID(N'[dbo].[OnsiteCourse]'))
	ALTER TABLE [dbo].[OnsiteCourse]  WITH CHECK ADD  
       CONSTRAINT [FK_OnsiteCourse_Course] FOREIGN KEY([CourseID])
	REFERENCES [dbo].[Course] ([CourseID])
	GO
	ALTER TABLE [dbo].[OnsiteCourse] CHECK 
       CONSTRAINT [FK_OnsiteCourse_Course]
	GO

	-- Define the relationship between OnlineCourse and Course.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
       WHERE object_id = OBJECT_ID(N'[dbo].[FK_OnlineCourse_Course]')
       AND parent_object_id = OBJECT_ID(N'[dbo].[OnlineCourse]'))
	ALTER TABLE [dbo].[OnlineCourse]  WITH CHECK ADD  
       CONSTRAINT [FK_OnlineCourse_Course] FOREIGN KEY([CourseID])
	REFERENCES [dbo].[Course] ([CourseID])
	GO
	ALTER TABLE [dbo].[OnlineCourse] CHECK 
       CONSTRAINT [FK_OnlineCourse_Course]
	GO
	-- Define the relationship between StudentGrade and Course.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
       WHERE object_id = OBJECT_ID(N'[dbo].[FK_StudentGrade_Course]')
       AND parent_object_id = OBJECT_ID(N'[dbo].[StudentGrade]'))
	ALTER TABLE [dbo].[StudentGrade]  WITH CHECK ADD  
       CONSTRAINT [FK_StudentGrade_Course] FOREIGN KEY([CourseID])
	REFERENCES [dbo].[Course] ([CourseID])
	GO
	ALTER TABLE [dbo].[StudentGrade] CHECK 
       CONSTRAINT [FK_StudentGrade_Course]
	GO

	--Define the relationship between StudentGrade and Student.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
       WHERE object_id = OBJECT_ID(N'[dbo].[FK_StudentGrade_Student]')
       AND parent_object_id = OBJECT_ID(N'[dbo].[StudentGrade]'))	
	ALTER TABLE [dbo].[StudentGrade]  WITH CHECK ADD  
       CONSTRAINT [FK_StudentGrade_Student] FOREIGN KEY([StudentID])
	REFERENCES [dbo].[Person] ([PersonID])
	GO
	ALTER TABLE [dbo].[StudentGrade] CHECK 
       CONSTRAINT [FK_StudentGrade_Student]
	GO

	-- Define the relationship between CourseInstructor and Course.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
  	 WHERE object_id = OBJECT_ID(N'[dbo].[FK_CourseInstructor_Course]')
  	 AND parent_object_id = OBJECT_ID(N'[dbo].[CourseInstructor]'))
	ALTER TABLE [dbo].[CourseInstructor]  WITH CHECK ADD  
  	 CONSTRAINT [FK_CourseInstructor_Course] FOREIGN KEY([CourseID])
	REFERENCES [dbo].[Course] ([CourseID])
	GO
	ALTER TABLE [dbo].[CourseInstructor] CHECK 
 	  CONSTRAINT [FK_CourseInstructor_Course]
	GO

	-- Define the relationship between CourseInstructor and Person.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
 	  WHERE object_id = OBJECT_ID(N'[dbo].[FK_CourseInstructor_Person]')
	   AND parent_object_id = OBJECT_ID(N'[dbo].[CourseInstructor]'))
	ALTER TABLE [dbo].[CourseInstructor]  WITH CHECK ADD  
 	  CONSTRAINT [FK_CourseInstructor_Person] FOREIGN KEY([PersonID])
	REFERENCES [dbo].[Person] ([PersonID])
	GO
	ALTER TABLE [dbo].[CourseInstructor] CHECK 
  	 CONSTRAINT [FK_CourseInstructor_Person]
	GO

	-- Define the relationship between Course and Department.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
       WHERE object_id = OBJECT_ID(N'[dbo].[FK_Course_Department]')
       AND parent_object_id = OBJECT_ID(N'[dbo].[Course]'))
	ALTER TABLE [dbo].[Course]  WITH CHECK ADD  
       CONSTRAINT [FK_Course_Department] FOREIGN KEY([DepartmentID])
	REFERENCES [dbo].[Department] ([DepartmentID])
	GO
	ALTER TABLE [dbo].[Course] CHECK CONSTRAINT [FK_Course_Department]
	GO

	--Define the relationship between OfficeAssignment and Person.
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys 
	  WHERE object_id = OBJECT_ID(N'[dbo].[FK_OfficeAssignment_Person]')
 	  AND parent_object_id = OBJECT_ID(N'[dbo].[OfficeAssignment]'))
	ALTER TABLE [dbo].[OfficeAssignment]  WITH CHECK ADD  
 	  CONSTRAINT [FK_OfficeAssignment_Person] FOREIGN KEY([InstructorID])
	REFERENCES [dbo].[Person] ([PersonID])
	GO
	ALTER TABLE [dbo].[OfficeAssignment] CHECK 
   	 CONSTRAINT [FK_OfficeAssignment_Person]
	GO


<h2 id="insertData">Insert data</h2>

Open a new query window and then paste in the following script. Run the script to insert data. This script uses the [INSERT](http://msdn.microsoft.com/en-us/library/windowsazure/ee336284.aspx) statement to add values to each column.

	-- Insert data into the Person table.
	USE School
	GO
	SET IDENTITY_INSERT dbo.Person ON
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
	SET IDENTITY_INSERT dbo.Person OFF
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


<h2 id="QueryDBSysData">Query sample and system data in the management portal</h2>

To check your work, run a query that returns the data you just entered. You can also run built-in stored procedures and data management views that provide information about the databases running on your SQL Database server.

<h4 id="QueryDB">Query sample data</h4>

In a new query window, copy and run the following T-SQL script to retrieve some of the data you just added.

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
		ON OnsiteCourse.CourseID = CourseInstructor.CourseID

You should see a result set that looks like the following illustration.

![Image13] []


<h4 id="QuerySys">Query system data</h4>

You can also use system views and built-in stored procedures to get information from the server. For the purposes of this tutorial, you will try out just a few commands.

Run the following command to find out which databases are available on the server. 

	SELECT * FROM sys.databases  

Run this command to return a list of users currently connected to the server.

	SELECT user_name(),suser_sname()

Run this stored procedure to return a list of all of the objects in the **School** database.

	EXEC SP_help

Do not close the portal connection to the **School** database. You will need it again in a few minutes.



<h2 id="DBLogin">Create a database login and assign permissions</h2>

In SQL Database, data access is configured using T-SQL. In this lesson, using T-SQL, you will do three things: create a login, create  a database user, and grant permissions via role membership.

A SQL login is used for server connections. All users who access a database on a SQL Database server do so by providing a SQL login name and password. 

To create a login, you must first connect to the **master** database.

<h4 id=CreateLogin>Create a SQL login</h4>

1. Go back to the Windows Azure portal, select **SQL Databases**, click **Servers**, choose the server and then click the white arrow to open the
server page. 

    ![Image5] []

2. On the Quick Start page, click **Manage Server** to open a new SQL Database management portal connection. 

3. Enter the administrator name and password. This is the administrator login that you specified when you created the server.

    ![Image20] []

4. The SQL Database management portal opens in a new browser window. Click **Select a Database** at the top, and click **master**.

	![Image14] []

5. If you see an error on the page similar to the following, ignore it. Click **New Query** to open a query window that lets you execute T-SQL commands on the **master** database.

	![Image15] []

6. Copy and paste the following command into the query window.

     CREATE LOGIN myDBlogin WITH password='Password1';

7. Run the command to create a new SQL Server login named 'myDBlogin'.


<h4 id=CreateDBuser>Create a database user and assign permissions</h4>

After you create a login, the next step is to assign the database and permission levels associated with the login. You do this by creating a **database user** on each database.

1. Go back to the SQL Database management portal page that connects to the **School** database. If you closed the browser window, start a new connection to **School** database using the steps from the previous lesson, "Add data and a schema using T-SQL script". 

	On the SQL Database management portal page, the **School** database name is visible in the top left corner.

	![Image12] []

2. Click **New Query** to open a new query window and copy in the following statement. 

	CREATE USER myDBuser FROM LOGIN myDBlogin;

3. Run the script. This script creates a new database user based on the server login.

   Next, you'll assign permissions using the db_datareader role. Database users assigned to this role can read all data from all user tables in the database. 

4. Open a new query window and then enter and run the next statement. This statement runs a built-in stored procedure that assigns the db_datareader role to the new user you just created.


     EXEC sp&#95;addrolemember 'db&#95;datareader', 'myDBuser';


You now have a new SQL Server login that has read-only permission to the **School** database. Using these steps, you can create other logins to allow different levels of access to your data.




<h2 id="ClientConnection">Connect from other applications</h2>

Now that you have an operational database, you can connect to it from an Excel workbook.

<h4>Connect from Excel</h4>


If Excel 2010 is installed on your computer, you can use the following steps to connect to your sample database.

1. In Excel, on the Data tab, click **From Other Sources**, and then click **From SQL Server**.

2. In the Data Connection wizard, enter the fully-qualified domain name of your SQL Database server, followed by a SQL Server login that has permission to access the database. 

  The server name can be found on the Windows Azure management portal, on SQL Database, on Server page, on the Dashboard, in **Manage URL**. The server name consists of a series of letters and numbers, followed by '.database.windows.net'. Specify this name in the Database Connection wizard. Do not include the http:// or https:// prefix when specifying the name.

  Enter a SQL login. For testing purposes, you can use the administrator login that you created when you set up the server. For regular data access, use a database user login similar to the one you just created.

    ![Image16] []

3.  On the next page, choose the **School** database, and then choose **Course**. Click **Finish**.

	![Image17] []

4. The Import Data dialog box appears that prompts you to select how and where to import your data. With the default options selected, click **OK**.

	![Image19] []


5. In the worksheet, you should see a table similar to the following. 
	
	![Image18] []

Using just Excel, you can import only one table at a time. A better approach is to use the PowerPivot for Excel add-in, which lets you import and work with multiple tables as a single data set. Working with PowerPivot is beyond the scope of this tutorial, but you can get more information on this [Microsoft web site](http://www.microsoft.com/en-us/bi/powerpivot.aspx).


<h2 id="NextSteps">Next steps</h2>

Now that you are familiar with SQL Database and the management portals, you can move on to the next step by learning more about tools and techniques used by SQL Server database administrators.

To actively manage your new database, consider installing and using SQL Server Management Studio. Management Studio is the primary database administration tool for managing SQL Server databases, including those running on Windows Azure. Using Management Studio, you can save queries for future use, add new tables and stored procedures, and hone your T-SQL skills in a rich scripting environment that includes a syntax checker, intellisense, and templates. To get started, follow the instructions in [Managing SQL Azure Servers and Databases Using SQL Server Management Studio](http://www.windowsazure.com/en-us/develop/net/common-tasks/sql-azure-management/).

Fluency in the T-SQL query and data definition language is essential for database administrators. If you are new to T-SQL, start with the [Tutorial: Writing Transact-SQL Statements](http://msdn.microsoft.com/en-us/library/ms365303.aspx) to learn some basic skills.

There are other methods for moving an on-premise database to SQL Database. If you have existing databases, or if you downloaded sample databases to practice with, try the following alternative approaches:

* [Migrating Databases to SQL Azure](http://msdn.microsoft.com/en-us/library/windowsazure/ee730904.aspx)
* [Copying Databases in SQL Azure](http://msdn.microsoft.com/en-us/library/windowsazure/ff951624.aspx)
* [How to Use SQL Azure Programmatically](http://www.windowsazure.com/en-us/develop/net/how-to-guides/sql-azure/)




[Image1]: media/NavPaneDBSelected.png
[Image2]: media/MainPageCustomCreateDB.png
[Image3]: media/DatabaseSettings.PNG
[Image4]: media/ServerSettings.png
[Image5]: media/DBPortalDatabasesServers.PNG
[Image6]: media/DBConfigFirewall.png
[Image7]: media/DBConfigFirewallSAVE.png
[Image8]: media/MainPageHome.PNG
[Image9]: media/dblistschool.png
[Image10]: media/dbportalmanagebutton.png
[Image11]: media/ManageDatabaseLogin.png
[Image12]: media/DBPortalNewQuery.png
[Image13]: media/DBQueryResults.png
[Image14]: media/DBPortalConnectMaster.PNG
[Image15]: media/DBPortalConnectMasterErr.PNG
[Image16]: media/ExcelConnect.png
[Image17]: media/ExcelSelect.png
[Image18]: media/ExcelTable.png
[Image19]: media/ExcelImport.png
[Image20]: media/ManageDatabaseLogin.png

