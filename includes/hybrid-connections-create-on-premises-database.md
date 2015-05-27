
This section shows you how to install a SQL Server Express, enable TCP/IP, set a static port, and create a database that can be used with Hybrid Connections.  

###Install SQL Server Express

To use an on-premises SQL Server or SQL Server Express database with a hybrid connection, TCP/IP needs to be enabled on a static port. Default instances on SQL Server use static port 1433, whereas named instances do not. Because of this, we will install the default instance. If you already have the default instance of SQL Server Express installed, you can skip this section.

1. To install SQL Server Express, run the **SQLEXPRWT_x64_ENU.exe** or **SQLEXPR_x86_ENU.exe** file that you downloaded. The SQL Server Installation Center wizard appears.
	
2. Choose **New SQL Server stand-alone installation or add features to an existing installation**, follow the instructions, accepting the default choices and settings, until you get to the **Instance Configuration** page.
	
3. On the **Instance Configuration** page, choose **Default instance**, then accept the default settings on the **Server Configuration** page.
	
5. On the **Database Engine Configuration** page, under **Authentication Mode**, choose **Mixed Mode (SQL Server authentication and Windows authentication)**, and provide a secure password for the built-in **sa** administrator account.
	
	In this tutorial, you will be using SQL Server authentication. Be sure to remember the password that you provide, because you will need it later.
	
6. Finish the wizard to complete the installation.

###Enable TCP/IP and setting a static port

This section uses SQL Server Configuration Manager, which was installed when you installed SQL Server Express, to enable TCP/IP and set a static IP address. 

1. Follow the steps in [Enable TCP/IP Network Protocol for SQL Server](http://technet.microsoft.com/library/hh231672%28v=sql.110%29.aspx) to enable TCP/IP access to the instance.

2. (Optional) If you are not able to use the default instance, you must follow the steps in [Configure a Server to Listen on a Specific TCP Port ](https://msdn.microsoft.com/library/ms177440.aspx) to set a static port for the instance. If you complete this step, you will connect using the new port that you define, instead of port 1433.

###Create a SQL Server database on-premises

1. In SQL Server Management Studio, connect to the SQL Server you just installed. (If the **Connect to Server** dialog does not appear automatically, navigate to **Object Explorer** in the left pane, click **Connect**, and then click **Database Engine**.) 	

	![Connect to Server](./media/hybrid-connections-create-on-premises-database/A04SSMSConnectToServer.png)
	
	For **Server type**, choose **Database Engine**. For **Server name**, you can use **localhost** or the name of the computer where you installed SQL Server. Choose **SQL Server authentication**, and supply the password for the sa login that you created earlier. 
	
2. To create a new database by using SQL Server Management Studio, right-click **Databases** in Object Explorer, and then click **New Database**.
	
3. In the **New Database** dialog, type `OnPremisesDB`, and then click **OK**. 
	
4. In Object Explorer, if you expand **Databases**, you will see that the new database is created.
