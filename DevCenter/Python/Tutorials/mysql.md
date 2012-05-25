<properties linkid="dev-python-mysql" urlDisplayName="Web App with MySQL" headerExpose="" pageTitle="Django Hello World - MySQL Edition" metaKeywords="" footerExpose="" metaDescription="" umbracoNaviHide="0" disqusComments="1" />
# Django Hello World - MySQL Edition #
  
This tutorial describes how to use MySQL to access data from a Windows Azure Cloud Service application written in the Django Python web framework. This guide assumes that you have some prior experience using Windows Azure and Django. For an introduction to Windows Azure and Django, see [Django Hello World] [djangohelloworld]. The guide also assumes that you have some knowledge of MySQL. For an overview of MySQL, see the [MySQL website][mysqldoc].

In this tutorial, you will learn how to:

* Setup a Windows Azure virtual machine to host MySQL. While this tutorial explains how to accomplish this in Windows Server 2008 R2, the same could also be done with a Linux VM hosted in Windows Azure.
* Install a [MySQL driver] [mysqlpy] for Python.
* Configure an existing Django application to use a MySQL database.
* Use MySQL directly from Python.
* Run your MySQL Django application locally using the Windows Azure compute emulator.
* Publish your MySQL Django application to Windows Azure.

You will expand upon the [Django Hello World] [djangohelloworld] sample by utilizing a MySQL database, hosted in a Windows Azure VM, to find an interesting replacement for <i>World</i>. The replacement will in turn be determined via a MySQL-backed Django <i>counter</i> app. As was the case for the Hello World sample, this Django application will again be hosted in a web role.

The project files for this tutorial will be stored in <strong><em>C:\django\helloworld\*</em></strong> and the completed application will look similar to:
![][0]
  
## Setting up your development environment ##
Before you can begin developing your Windows Azure application, you need to get the tools and set up your development environment. For details about getting and installing the Windows Azure SDK for Python, see [Setup the Development Environment] [wapstarted] in the Python "Hello World" Application tutorial.

<b>Note:</b> This tutorial requires Python 2.7 and Django 1.4. These versions are included in the current Windows Azure SDK for Python; however if you have installed a previous version you will need to [upgrade to the latest version] [wapstarted].

## Install the MySQL Python package ##
You must download and install the MySQL Python package, in addition to installing the Windows Azure SDK for Python. You can install it directly [from this link] [mysqlpydl]. Once completed, run the following command to verify your installation:

![][1]

## Setting up a virtual machine to host MySQL
- Open up a TCP port for MySQL transactions on the virtual machine:
 1. Navigate to your newly created virtual machine in the Windows Azure Preview Portal and click the <i>ENDPOINTS</i> tab.
 1. Click <i>ADD ENDPOINT</i> button at the bottom of the screen.
![][6]

 1. Open up the <i>TCP</i> protocol's <i>PUBLIC PORT</i> **3306** as <i>PRIVATE PORT</i> **3306**.
![][8]

- Install the latest version of <a href="http://dev.mysql.com/downloads/mysql/">MySQL Community Server</a> for Windows on the virtual machine:
1. Install .NET version 4.0 from <a href="http://go.microsoft.com/fwlink/?LinkId=181012">here</a>.
1. Run the <i>Windows (x86, 64-bit), MSI Installer</i> link <a href="http://dev.mysql.com/downloads/mysql/">here</a> and download the appropriate MSI installer from the download mirror nearest you. Helpful hints are:
 * Select a <i>Complete</i> Setup Type.
 * Select a <i>Detailed Configuration</i> within the Configuration Wizard.
 * <b>Make sure you enable TCP/IP Networking on Port Number 3306 and add a firewall exception for the port</b>
 * Set a root password and enable root access from remote machines.
1. Install a sample <a href="http://dev.mysql.com/doc/index-other.html">"world" database</a> (MyISAM version):
 * Download <a href="http://downloads.mysql.com/docs/world.sql.zip">this</a> zip file on the Windows Azure Virtual Machine.
 * <b>Unzip it to <i>C:\Users\Administrator\Desktop\world.sql</i></b>.
- After installing MySQL, click the Windows <i>Start</i> menu and run the freshly installed <i>MySQL 5.5 Command Line Client</i>.  Issue the following commands:


		CREATE world;
		USE world;
		SOURCE C:\Users\Administrator\Desktop\world.sql
		CREATE USER 'testazureuser'@'%' IDENTIFIED BY 'testazure';
		CREATE DATABASE djangoazure;
		GRANT ALL ON djangoazure.* TO 'testazureuser'@'%';
		GRANT ALL ON world.* TO 'testazureuser'@'%';
		SELECT name from country LIMIT 1;

You should now see a response similar to the following: 

![][2]

## Extend the Django Hello World application
  <ol>
    <li>
      Follow the instructions given in the <a href="../Tutorials/web-app-with-django">Django Hello World</a> tutorial to create a trivial "Hello World" web application in Django.
    </li>
    <li>
      Open <strong><em>C:\django\helloworld\hello_dj\hello_dj\settings.py</em></strong> in your favorite text editor.  Modify the <b><i>DATABASES</i></b> global dictionary to read:
<pre>	
		DATABASES = {
		    'default': {
			    'ENGINE': <b style="color:orange;">'django.db.backends.mysql'</b>,
			    'NAME': <b style="color:orange;">'djangoazure'</b>,               
			    'USER': <b style="color:orange;">'testazureuser'</b>,  
			    'PASSWORD': <b style="color:orange;">'testazure'</b>,
			    'HOST': <b style="color:red;">'127.0.0.1'</b>, 
			    'PORT': <b style="color:orange;">'3306'</b>,
			    },
		    'world': {
			    'ENGINE': <b style="color:orange;">'django.db.backends.mysql'</b>,
			    'NAME': <b style="color:orange;">'world'</b>,               
			    'USER': <b style="color:orange;">'testazureuser'</b>,  
			    'PASSWORD': <b style="color:orange;">'testazure'</b>,
			    'HOST': <b style="color:red;">'127.0.0.1'</b>, 
			    'PORT': <b style="color:orange;">'3306'</b>,
			    }
			}
</pre>

<p>
As you can see, we've just given Django instructions on where to find our MySQL database. 
</p>

<b>Note:</b> You <b style="color:red;">must</b> change the <i>HOST</i> key to match your Windows Azure (MySQL) VM's <b>permanent</b> IP address. At this point, <i>HOST</i> should be set to whatever the <i>ipconfig</i> Windows command reports it as being.

<p>After you've modified <i>HOST</i> to match the MySQL VM's IP address, please save this file and close it.</p>

    </li>
    <li>
      Now that we've referenced our <i>djangoazure</i> database, let's do something useful with it! To this end, we'll create a model for a trivial <i>counter</i> app.  To instruct Django to create this, run the following commands:<pre class="prettyprint">
cd C:\django\helloworld\hello_dj\hello_dj
C:\Python27\python.exe manage.py startapp counter
</pre>If Django doesn't report any output from the final command above, it succeeded.
    </li>
    <li>
      Append the following text to <strong><em>C:\django\helloworld\hello_dj\hello_dj\counter\models.py</em></strong>:<pre class="prettyprint">class Counter(models.Model):
    count = models.IntegerField()
    def __unicode__(self):
        return u'%s' % (self.count)</pre>All we've done here is defined a subclass of Django's <i>Model</i> class named <i>Counter</i> with a single integer field, <i>count</i>. This trivial counter model will end up recording the number of hits to our Django application. 
    </li>
    <li>
      Next we make Django aware of <i>Counter</i>'s existence:
		<ol>
			<li>Edit <strong><em>C:\django\helloworld\hello_dj\hello_dj\settings.py</em></strong> again. Add <i>'counter'</i> to the <i>INSTALLED_APPS</i> tuple.</li>
			<li>From a command prompt, please run:<pre class="prettyprint">cd C:\django\helloworld\hello_dj\hello_dj
C:\Python27\python manage.py sql counter
C:\Python27\python manage.py syncdb
</pre>These commands store the <i>Counter</i> model in the live Django database, and result in output similar to the following:<pre>C:\django\helloworld\hello_dj\hello_dj> C:\Python27\python manage.py sql counter
BEGIN;
CREATE TABLE `counter_counter` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `count` integer NOT NULL
)
;
COMMIT;

C:\django\helloworld\hello_dj\hello_dj> C:\Python27\python manage.py syncdb
Creating tables ...
Creating table auth_permission
Creating table auth_group_permissions
Creating table auth_group
Creating table auth_user_user_permissions
Creating table auth_user_groups
Creating table auth_user
Creating table django_content_type
Creating table django_session
Creating table django_site
Creating table counter_counter

You just installed Django's auth system, which means you don't have any superusers defined.
Would you like to create one now? (yes/no): no
Installing custom SQL ...
Installing indexes ...
Installed 0 object(s) from 0 fixture(s)</pre></li>
		</ol>
    </li>
    <li>
      Replace the contents of <strong><em>C:\django\helloworld\hello_dj\hello_dj\views.py</em></strong>. The new implementation of the <i>hello</i> function below uses our <i>Counter</i> model in conjunction with a separate sample database we previously installed, <i>world</i>, to generate a suitable replacement for the "<i>World</i>" string:
      <pre class="prettyprint">
from django.http import HttpResponse
import django.db

from counter.models import Counter

def getCountry(intId):
    #Connect to the MySQL sample database 'world'
    cur = django.db.connections['world'].cursor()

    #Execute a trivial SQL query which returns the name of 
    #all countries contained in 'world'
    cur.execute("SELECT name from country")
    tmp = cur.fetchall()
    #Clean-up after ourselves
    cur.close()

    if intId >= len(tmp):
        return "countries exhausted"
    return tmp[intId][0]

def hello(request):
    if len(Counter.objects.all())==0:
        #when the database corresponding to 'helloworld.counter' is 
        #initially empty...
        c = Counter(count=0)
    else:
        c = Counter.objects.all()[0]
        c.count += 1
    c.save()
   
    world = getCountry(int(c.count))
    return HttpResponse("&lt;html&gt;&lt;body&gt;Hello &lt;em&gt;" + world + "&lt;/em&gt;&lt;/body&gt;&lt;/html&gt;")
</pre>
    </li>
  </ol>

## Running Your Application Locally ##
Before running your application in the Windows Azure emulator, let's run it as a normal Django application to ensure everything's working properly:

<pre class="prettyprint">
pushd C:\django\helloworld\hello_dj\hello_dj
C:\Python27\python.exe manage.py runserver
"%ProgramFiles%\Internet Explorer\iexplore.exe" http://localhost:<b style="color:orange;">8000</b></pre>

**Note:** You might need to change port <b style="color:orange;">8000</b> to another port depending upon how Django configured your application locally.

You should see output similar to the following in your web browser:

![][4] 

Refresh the web browser a few times and you should see the message change from "<i>Hello <em>&lt;country abc&gt;</em></i>" to "<i>Hello <em>&lt;some other country&gt;</em></i>".
  
##Running Your Application Locally in the Emulator##
Start the Windows Azure emulator and open the Django webpage exactly as you did in the [Django Hello World] [djangohelloworld] tutorial.

The output should be basically the same to what you saw with the locally hosted version:

![][5]

##Deploying the application to Windows Azure
From here, you need to duplicate the steps performed in the [Django Hello World] [djangohelloworld] tutorial to publish the MySQL derivation to Windows Azure.  

Additionally, you'll need to bundle MySQLdb with your app as this is not installed with the Windows Azure SDK for Python.  An easy way to accomplish this is:<pre class="prettyprint">
cd C:\django\helloworld\hello\_dj
copy -recurse C:\Python27\Lib\site-packages\MySQLdb .
copy -recurse C:\Python27\Lib\site-packages\\_mysql* .
</pre>

## Stopping and Deleting Your Application

After deploying your application, you may want to disable it so you can
avoid costs or build and deploy other applications within the free trial
time period.

Windows Azure bills web role instances per hour of server time consumed.
Server time is consumed once your application is deployed, even if the
instances are not running and are in the stopped state.

The following steps show you how to stop and delete your application.

1.  In the Windows PowerShell window, stop the service deployment
    created in the previous section with the following cmdlet:

        PS C:\django\helloworld\hello_dj\hello_dj> Stop-AzureService

    Stopping the service may take several minutes. When the service is
    stopped, you receive a message indicating that it has stopped.

    ![The status of the Stop-AzureService command][]

2.  To delete the service, call the following cmdlet:

        PS C:\django\helloworld\hello_dj\hello_dj> Remove-AzureService

3.  When prompted, enter **Y** to delete the service.

    Deleting the service may take several minutes. After the service has
    been deleted you receive a message indicating that the service was
    deleted.

    ![The status of the Remove-AzureService command][]

**Note**: Deleting the service does not delete the storage account that
was created when the service was initially published, and you will
continue to be billed for storage used. Since storage accounts can be
used by multiple deployments, be sure that no other deployed service is
using the storage account before you delete it. For more information on
deleting a storage account, see [How to Delete a Storage Account from a Windows Azure Subscription][].

[0]: ../Media/mysql_tutorial01.png
[1]: ../Media/mysql_tutorial01-1.png
[2]: ../Media/mysql_tutorial01-2.png
[3]: ../Media/mysql_tutorial01-3.png
[4]: ../Media/mysql_tutorial01.png
[5]: ../Media/mysql_tutorial01.png
[6]: ../Media/mysql_tutorial02-1.png
[7]: ../Media/mysql_tutorial02-2.png
[8]: ../Media/mysql_tutorial02-3.png
[9]: ../Media/mysql_tutorial03-1.png
[10]: ../Media/mysql_tutorial03-2.png 

[djangohelloworld]: ../Tutorials/web-app-with-django
[mysqldoc]: http://dev.mysql.com/doc/
[mysqlpy]: http://pypi.python.org/pypi/MySQL-python/1.2.3
[wapstarted]: ../commontasks/how-to-install-python
[mysqlpydl]: http://www.codegood.com/download/10/

[The status of the Stop-AzureService command]: ../Media/django-helloworld-ps-stop.png
[The status of the Remove-AzureService command]: ../Media/django-helloworld-ps-remove.png
[How to Delete a Storage Account from a Windows Azure Subscription]: http://msdn.microsoft.com/en-us/library/windowsazure/hh531562.aspx

[Installation Guide]: /develop/python/commontasks/how-to-install-python
 