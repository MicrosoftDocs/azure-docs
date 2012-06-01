1. Configure the Package Management System (YUM) so that you can install MongoDB. Create a */etc/yum.repos.d/10gen.repo* file to hold information about your repository and add the following:

		[10gen]
		name=10gen Repository
		baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64
		gpgcheck=0
		enabled=1

2. Save the repo file and then run the following command to update the local package database:

		$ sudo yum update
3. To install the package, run the following command to install the latest stable version of MongoDB and the associated tools:

		$ sudo yum install mongo-10gen mongo-10gen-server

	Wait while MongoDB downloads and installs.

4. Create a data directory. By default MongoDB stores data in the */data/db* directory, but you must create that directory. To create it, run:

		$ sudo mkdir -p /data/db/
		$ sudo chown 'id -u' /data/db

	For more information on installing MongoDB on Linux, see [Quickstart Unix][QuickstartUnix].

5. To start the database, run:

		$ mongod

	You will see log messages displayed in this window as mongod.exe server starts and preallocates journal files. It may take several minutes to preallocate the journal files.

6. To start the MongoDB administrative shell, open a separate SSH or PuTTY window and run:

		$ mongo
		> db.foo.save ( { a:1 } )
		> db.foo.find()
		{ _id : ..., a : 1 }
		> show dbs  
		...
		> show collections  
		...  
		> help  

	The database is created by the insert.

7. To configure the firewall to allow remote access to MongoDB, run:

		$ sudo iptables -A INPUT -p tcp --dport 27017 -j ACCEPT

8. To show the new firewall rule, run:

		$ sudo iptables -L

9. Save the changes to IPtables:

		$ sudo /sbin/service iptables save

10. Restart the IPtables service:

		$ sudo /sbin/service iptables restart

11. Once MongoDB is installed you must configure an endpoint so that MongoDB can be accessed remotely. In the Management Portal, click **Virtual Machines**, then click the name of your new virtual machine, then click **Endpoints**.
	![Endpoints][Image7]

12. Click **Add Endpoint** at the bottom of the page.
	![Endpoints][Image8]

13. Add an endpoint with name "Mongo", protocol **TCP**, and both **Public** and **Private** ports set to "27017". This will allow MongoDB to be accessed remotely.
	![Endpoints][Image9]

[QuickStartUnix]: http://www.mongodb.org/display/DOCS/Quickstart+Unix
[AzurePreviewPortal]: http://manage.windowsazure.com

[Image7]: ../../Shared/Media/LinuxVmAddEndpoint.png
[Image8]: ../../Shared/Media/LinuxVmAddEndpoint2.png
[Image9]: ../../Shared/Media/LinuxVmAddEndpoint3.png