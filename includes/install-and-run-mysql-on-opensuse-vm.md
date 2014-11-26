
1. To escalate privileges, run:

		sudo -s
	
	Enter your password.

2. Run the following command to install MySQL Community Server edition:

		# zypper install mysql-community-server

	Wait while MySQL downloads and installs.
3. To set MySQL to start when the system boots, execute the following command:

		# insserv mysql
4. Now you can manually start the MySQL daemon (mysqld) with the following command:

		# rcmysql start

	To check the status of the MySQL daemon, run:

		# rcmysql status

	If you want to stop the MySQL daemon, run:

		# rcmysql stop

5. Warning! After installation, the MySQL root password is empty by default.  It's recommended that you run **mysql\_secure\_installation**, a script that helps secure MySQL. When running **mysql\_secure\_installation**, you will be prompted to change the MySQL root password, remove anonymous user accounts, disable remote root logins, remove test databases, and reload the privileges table. It is recommended that you answer yes to all of these options and change the root password. Run the following command to execute the script:

		$ mysql_secure_installation

6. After you run, you can login to MySQL:

		$ mysql -u root -p

	Enter the MySQL root password (which you changed in the previous step) and you'll be presented with a prompt where you can issue SQL statements to interact with the database.

7. To create a new MySQL user, run the following at the **mysql>** prompt:

		mysql> CREATE USER 'mysqluser'@'localhost' IDENTIFIED BY 'password';

	Note, the semi-colons (;) at the end of the lines are crucial for ending the commands.

8. To create a database and grant the `mysqluser` user permissions on it, issue the following commands:

		mysql> CREATE DATABASE testdatabase;
		mysql> GRANT ALL ON testdatabase.* TO 'mysqluser'@'localhost' IDENTIFIED BY 'password';

	Note that database user names and passwords are only used by scripts connecting to the database.  Database user account names do not necessarily represent actual user accounts on the system.

9. To login from another computer, execute the following:

		mysql> GRANT ALL ON testdatabase.* TO 'mysqluser'@'<ip-address>' IDENTIFIED BY 'password';

	where `ip-address` is the IP address of the computer from which you will connect to MySQL.
	
10. To exit the MySQL database administration utility, issue the following command:

		quit

11. After MySQL is installed, you'll need to configure an endpoint so that MySQL can be accessed remotely. Log in to the [Azure Management Portal][AzurePreviewPortal]. In the Azure portal, click **Virtual Machines**, click the name of your new VM, and then click **Endpoints**.

	![Endpoints][Image7]

12. Click **Add** at the bottom of the page.
	![Endpoints][Image8]

13. Add an endpoint named "MySQL" with protocol **TCP**, and **Public** and **Private** ports set to "3306". This allows remote access to MySQL.
	![Endpoints][Image9]

14. To remotely connect to MySQL running on your OpenSUSE virtual machine in Azure, run the following command on your local computer:

		mysql -u mysqluser -p -h <yourservicename>.cloudapp.net

	For example, using the virual machine we created in this tutorial, the command would be:

		mysql -u mysqluser -p -h testlinuxvm.cloudapp.net

15. You've successfully configured MySQL, created a database, and a new user.  For more information on MySQL, see the [MySQL Documentation][MySQLDocs].	

[MySQLDocs]: http://dev.mysql.com/doc/
[AzurePreviewPortal]: http://manage.windowsazure.com

[Image9]: ./media/install-and-run-mysql-on-opensuse-vm/LinuxVmAddEndpointMySQL.png
