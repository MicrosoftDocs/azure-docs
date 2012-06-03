<properties umbraconavihide="0" pagetitle="Web App with Storage" metakeywords="Azure Node.js hello world tutorial, Azure Node.js hello world, Azure Node.js Getting Started tutorial, Azure Node.js tutorial, Azure Node.js Express tutorial" metadescription="A tutorial that builds on the Web App with Express tutorial by adding Windows Azure Storage services and the Windows Azure module." linkid="dev-nodejs-basic-web-app-with-storage" urldisplayname="Web App with Storage" headerexpose="" footerexpose="" disquscomments="1"></properties>

# Python Web Application using Storage

In this tutorial, you will learn how to create an application using the Windows
Azure Client Libraries for Python with storage services. If this is your first Python Azure app, you may wish to take a look at [Django Hello World Web Application][] first.

For this guide, you will create a web-based task-list application
that you can deploy to Windows Azure. The task list allows a user to
retrieve tasks, add new tasks, and mark tasks as completed.  We'll be using Django as the web framework.

The task items are stored in Windows Azure Storage. Windows Azure
Storage provides unstructured data storage that is fault-tolerant and
highly available. Windows Azure Storage includes several data structures
where you can store and access data, and you can leverage the storage
services from the APIs included in the Windows Azure SDK for Python or
via REST APIs. For more information, see [Storing and Accessing Data in
Windows Azure].

You will learn:

-   How to work with Windows Azure Storage services

A screenshot of the completed application will be similar as below (the added tasks items will be different):

![](../media/web-app-with-storage-Finaloutput-mac.png)

## <a id="setup"> </a>Setting Up the Development Environment

please see the [Installation Guide][] for information on how to set up your Python, Django and Azure environments.


*Note for Windows*: if you used the Windows WebPI installer, you already have Django and the Client Libs installed.

## Setup A Windows Azure Account

<div chunk="../../Shared/Chunks/create-azure-account.md" />

## Create A Storage Account In Windows Azure

<div chunk="../../Shared/Chunks/create-storage-account.md" />

## Create A Django Project

Here are the steps for creating the app:

-   Create a default Django Project named 'TableserviceSample' 
- 	From the command line, cd into a directory where you’d like to store your code, then run the following command: 

		django-admin.py startproject TableserviceSample

-   Add a new Python file **views.py** to the project
-   Add the following code to **views.py** to import the required Django support:
           
        from django.http import HttpResponse
        from django.template.loader import render_to_string
        from django.template import Context

-   Create a new folder named **templates** under the **TableserviceSample/TableserviceSample** folder.
-   Edit the application settings so your templates can be located. Open **settings.py** and add the following entry to INSTALLED_APPS:

        'TableserviceSample',

-   Add a new Django template file **mytasks.html** to the **templates** folder and add following code to it:
 
<pre>
	&lt;html&gt;
	&lt;head&gt;&lt;title&gt;&lt;/title&gt;&lt;/head&gt;
	&lt;body&gt;
	&lt;h2&gt;My Tasks&lt;/h2&gt; &lt;br&gt;
	&lt;table border="1"&gt; 
	&lt;tr&gt;
	&lt;td&gt;Name&lt;/td&gt;&lt;td&gt;Category&lt;/td&gt;&lt;td&gt;Date&lt;/td&gt;&lt;td&gt;Complete&lt;/td&gt;&lt;td&gt;Action&lt;/td&gt;&lt;/tr&gt;
	{% for entity in entities %}
	&lt;form action=&quot;update_task&quot; method=&quot;GET&quot;&gt;
	&lt;tr&gt;&lt;td&gt;{{entity.name}} &lt;input type=&quot;hidden&quot; name='name' value=&quot;{{entity.name}}&quot;&gt;&lt;/td&gt;
	&lt;td&gt;{{entity.category}} &lt;input type=&quot;hidden&quot; name='category' value=&quot;{{entity.category}}&quot;&gt;&lt;/td&gt;
	&lt;td&gt;{{entity.date}} &lt;input type=&quot;hidden&quot; name='date' value=&quot;{{entity.date}}&quot;&gt;&lt;/td&gt;
	&lt;td&gt;{{entity.complete}} &lt;input type=&quot;hidden&quot; name='complete' value=&quot;{{entity.complete}}&quot;&gt;&lt;/td&gt;

	&lt;td&gt;&lt;input type=&quot;submit&quot; value=&quot;Complete&quot;&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/form&gt;
	{% endfor %}
	&lt;/table&gt;
	&lt;br&gt;
	&lt;hr&gt;
	&lt;table border=&quot;1&quot;&gt;
	&lt;form action=&quot;add_task&quot; method=&quot;GET&quot;&gt;
	&lt;tr&gt;&lt;td&gt;Name:&lt;/td&gt;&lt;td&gt;&lt;input type=&quot;text&quot; name=&quot;name&quot;&gt;&lt;/input&gt;&lt;/td&gt;&lt;/tr&gt;
	&lt;tr&gt;&lt;td&gt;Category:&lt;/td&gt;&lt;td&gt;&lt;input type=&quot;text&quot; name=&quot;category&quot;&gt;&lt;/input&gt;&lt;/td&gt;&lt;/tr&gt;
	&lt;tr&gt;&lt;td&gt;Item Date:&lt;/td&gt;&lt;td&gt;&lt;input type=&quot;text&quot; name=&quot;date&quot;&gt;&lt;/input&gt;&lt;/td&gt;&lt;/tr&gt;
	&lt;tr&gt;&lt;td&gt;&lt;input type=&quot;submit&quot; value=&quot;add task&quot;&gt;&lt;/input&gt;&lt;/td&gt;&lt;/tr&gt;
	&lt;/form&gt;
	&lt;/table&gt;
	&lt;/body&gt;
	&lt;/html&gt;    

</pre> 

    
## Import windowsazure storage module
Add following code on the top of **views.py** just after Django imports

        from azure.storage import TableService

## Get storage account name and account key
Add the following code to **views.py** just after the windowsazure import, and replace  'youraccount' and 'yourkey' with your real account name and key. You can get an account name and key from azure management portal. 

        account_name = 'youraccount'
        account_key = 'yourkey'

## Create TableService
Add following code after “account_name …”

		table_service = TableService(account_name=account_name, account_key=account_key)
		table_service.create_table('mytasks')

## List tasks 
Add function list_tasks to **views.py**:

		def list_tasks(request): 
		    entities = table_service.query_entities('mytasks', '', 'name,category,date,complete')    
		    html = render_to_string('mytasks.html', Context({'entities':entities}))
		    return HttpResponse(html)

##  Add task
Add the function add_task to **views.py**:

		def add_task(request):
		    name = request.GET['name']
		    category = request.GET['category']
		    date = request.GET['date']
		    table_service.insert_entity('mytasks', {'PartitionKey':name+category, 'RowKey':date, 'name':name, 'category':category, 'date':date, 'complete':'No'}) 
		    entities = table_service.query_entities('mytasks', '', 'name,category,date,complete')    
		    html = render_to_string('mytasks.html', Context({'entities':entities}))
		    return HttpResponse(html)

## Update task status
Add the function update_task to **views.py**:

		def update_task(request):
		    name = request.GET['name']
		    category = request.GET['category']
		    date = request.GET['date']
		    partition_key = name + category
		    row_key = date
		    table_service.update_entity('mytasks', partition_key, row_key, {'PartitionKey':partition_key, 'RowKey':row_key, 'name': name, 'category':category, 'date':date, 'complete':'Yes'})
		    entities = table_service.query_entities('mytasks', '', 'name,category,date,complete')    
		    html = render_to_string('mytasks.html', Context({'entities':entities}))
		    return HttpResponse(html)


## Mapping urls
Now you need to map the URLs in the Django app. Open **urls.py** and add following mappings to urlpatterns:

    	url(r'^$', 'TableserviceSample.views.list_tasks'),
    	url(r'^list_tasks$', 'TableserviceSample.views.list_tasks'),
    	url(r'^add_task$', 'TableserviceSample.views.add_task'),
    	url(r'^update_task$', 'TableserviceSample.views.update_task'),

## Run the application


-  Switch to the "TableserviceSample" directory, if you haven't already, and run the command:

		python manage.py runserver

-   Point your browser to: http://127.0.0.1:8000/. Replace 8000 with the real port #

You can now click "Add Task" to create one and then click the "Complete" button to update the task and set its status to Yes.



## Running the Application in the Compute Emulator, Publishing and Stopping/Deleting your Application

Now that you've successfully run your app on the built-in Django server, you can test it out further by deploying it to the Windows Azure emulator (Windows only) and then publishing to Windows Azure.  For general instructions on how to do this, please refer to the article **"Django Hello World Web Application"** which discusses these steps in detail.


<h2 id="NextSteps">Next Steps</h2>

Now that you’ve learned the basics of the Windows Azure Table service, follow these links to learn how to do more complex storage tasks.

- See the MSDN Reference: [Storing and Accessing Data in Windows Azure] []
- Visit the Windows Azure Storage Team Blog: <http://blogs.msdn.com/b/windowsazurestorage/>


[Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
[container-acl]: http://msdn.microsoft.com/en-us/library/windowsazure/dd179391.aspx
[error-codes]: http://msdn.microsoft.com/en-us/library/windowsazure/dd179439.aspx

[Installation Guide]: ../commontasks/how-to-install-python.md 
[Django Hello World Web Application]: ./django-helloworld.md