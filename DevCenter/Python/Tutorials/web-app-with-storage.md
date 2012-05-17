<properties umbraconavihide="0" pagetitle="Web App with Storage" metakeywords="Azure Node.js hello world tutorial, Azure Node.js hello world, Azure Node.js Getting Started tutorial, Azure Node.js tutorial, Azure Node.js Express tutorial" metadescription="A tutorial that builds on the Web App with Express tutorial by adding Windows Azure Storage services and the Azure module." linkid="dev-nodejs-basic-web-app-with-storage" urldisplayname="Web App with Storage" headerexpose footerexpose disquscomments="1"></properties>

# Python Web Application using Storage

In this tutorial, you will create an application using the Windows
Azure Client Libraries for Python to work with storage services. You
will create a web-based task-list application
that you can deploy to Windows Azure. The task list allows a user to
retrieve tasks, add new tasks, and mark tasks as completed.

The task items are stored in Windows Azure Storage. Windows Azure
Storage provides unstructured data storage that is fault-tolerant and
highly available. Windows Azure Storage includes several data structures
where you can store and access data, and you can leverage the storage
services from the APIs included in the Windows Azure SDK for Python or
via REST APIs. For more information, see [Storing and Accessing Data in
Windows Azure][].

You will learn:

-   How to work with Windows Azure Storage services

A screenshot of the completed application will be similar as below (the added tasks items will be different):

![](../media/web-app-with-storage-Finaloutput.png)

## Prerequisites

To complete this tutorial, you need:

-   Install Python [http://www.python.org](http://www.python.org)
-   Install Django [https://docs.djangoproject.com/en/dev/intro/install/](http://https://docs.djangoproject.com/en/dev/intro/install/)
-   Install Windows Azure Client Libraries for python 

## Setup Windows Azure Account
[#include]
## Create Storage Account in Azure
[#include]

## Create Django Project

-   Create a default Django Project named 'TableserviceSample' 
-   Add new python file views.py to project.
-   Add following code to views.py to import django library:
           
        from django.http import HttpResponse
        from django.template.loader import render_to_string
        from django.template import Context

-   Add new django template file mytasks.html to project template folder and add following code into mytasks.html:
        
&lt;html&gt;<br>
&lt;head&gt;&lt;title&gt;&lt;/title&gt;&lt;/head&gt;<br>
&lt;body&gt;<br>
&lt;h2&gt;My Tasks&lt;/h2&gt; &lt;br&gt;<br>
&lt;tr&gt;<br>
&lt;td&gt;Name&lt;/td&gt;&lt;td&gt;Category&lt;/td&gt;&lt;td&gt;Date&lt;/td&gt;&lt;td&gt;Complete&lt;/td&gt;&lt;td&gt;Action&lt;/td&gt;&lt;/tr&gt;<br>
{% for entity in entities %}<br>
&lt;form action=&quot;update_entity&quot; method=&quot;GET&quot;&gt;<br>
&lt;tr&gt;&lt;td&gt;{{entity.name}} &lt;input type=&quot;hidden&quot; name='name' value=&quot;{{entity.name}}&quot;&gt;&lt;/td&gt;<br>
&lt;td&gt;{{entity.category}} &lt;input type=&quot;hidden&quot; name='name' value=&quot;{{entity.category}}&quot;&gt;&lt;/td&gt;<br>
&lt;td&gt;{{entity.date}} &lt;input type=&quot;hidden&quot; name='name' value=&quot;{{entity.date}}&quot;&gt;&lt;/td&gt;<br>
&lt;td&gt;{{entity.complete}} &lt;input type=&quot;hidden&quot; name='name' value=&quot;{{entity.complete}}&quot;&gt;&lt;/td&gt;<br>
{% if entity.complete == &quot;Yes&quot; %}<br>
&lt;td&gt;&lt;input type=&quot;submit&quot; value=&quot;Reactivate&quot;&gt;&lt;/td&gt;<br>
{% else %}<br>
&lt;td&gt;&lt;input type=&quot;submit&quot; value=&quot;Complete&quot;&gt;&lt;/td&gt;<br>
{% endif %}<br>
&lt;/tr&gt;<br>
&lt;/form&gt;<br>
{% endfor %}<br>
&lt;/table&gt;<br>
&lt;br&gt;<br>
&lt;hr&gt;<br>
&lt;table border=&quot;1&quot;&gt;<br>
&lt;form action=&quot;add_tasks&quot; method=&quot;GET&quot;&gt;<br>
&lt;tr&gt;&lt;td&gt;Name:&lt;/td&gt;&lt;td&gt;&lt;input type=&quot;text&quot; name=&quot;name&quot;&gt;&lt;/input&gt;&lt;/td&gt;&lt;/tr&gt;<br>
&lt;tr&gt;&lt;td&gt;Category:&lt;/td&gt;&lt;td&gt;&lt;input type=&quot;text&quot; name=&quot;category&quot;&gt;&lt;/input&gt;&lt;/td&gt;&lt;/tr&gt;<br>
&lt;tr&gt;&lt;td&gt;Item Date:&lt;/td&gt;&lt;td&gt;&lt;input type=&quot;text&quot; name=&quot;date&quot;&gt;&lt;/input&gt;&lt;/td&gt;&lt;/tr&gt;<br>
&lt;tr&gt;&lt;td&gt;&lt;input type=&quot;submit&quot; value=&quot;add task&quot;&gt;&lt;/input&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/form&gt;<br>
&lt;/table&gt;<br>
&lt;/body&gt;<br>
&lt;/html&gt;

    
## Import windowsazure storage module
Add following code on the top of views.py just after Django imports

        from windowsazure.storages.cloudtableclient import CloudTableClient

## Get storage account name and account key
Add following code on the top of views.py just after windowsazure import, replace the 'youraccount' and 'yourkey' with your real account name and key. You can get account name and key from azure management portal. 

        account_name = 'youraccount'
        account_key = 'yourkey'

## Create StorageServiceManager
Add following code after “account_name …”

        cloud_table_client = CloudTableClient(account_name=account_name, account_key=account_key)
		cloud_table_client.create_table('mytasks')

## List tasks. 
Add function list_tasks to views.py:

        def list_tasks(request): 
            entities = cloud_table_client.query_entities_by_filter('mytasks', '', 'name,category,date,complete')    
            html = rendor_to_string('mytasks.html', Context({'entities':entities}))
            return HttpResponse(html)

##  Add task
Add function add_task to views.py:

        def add_task(request):
            name = request.GET['name']
            category = request.GET['category']
            date = request.GET['date']
			cloud_table_client.insert_entity('mytasks', {'PartitionKey':name+category, 'RowKey':date, 'name':name, 'category':category, 'date':date, 'complete':'No'}) 
			entities = cloud_table_client.query_entities_by_filter('mytasks', '', 'name,category,date,complete')    
    		html = render_to_string('mytasks.html', Context({'entities':entities}))
    		return HttpResponse(html)

## Update task status
Add update_task function to views.py:

		def update_task(request):
    		name = request.GET['name']
    		category = request.GET['category']
    		date = request.GET['date']
    		partition_key = name + category
			row_key = date
		    cloud_table_client.update_entity('mytasks', partition_key, row_key, {'PartitionKey':partition_key, 'row_key':row_key, 'complete':1})
			entities = cloud_table_client.query_entities_by_filter('mytasks', '', 'name,category,date,complete')    
    		html = render_to_string('mytasks.html', Context({'entities':entities}))
			return HttpResponse(html)
![](../media/mytasks.png)
## Mapping urls
You need map the urls in django application to make it work. Open urls.py and add following mapping to urlpatterns:

    	url(r'^$', 'TableserviceSample.views.list_tasks'),
    	url(r'^list_tasks$', 'TableserviceSample.views.list_tasks'),
    	url(r'^add_task$', 'TableserviceSample.views.add_task'),
    	url(r'^update_task$', 'TableserviceSample.views.update_task'),

## Run Application
-   Launch application: [https://docs.djangoproject.com/en/dev/intro/tutorial01/](https://docs.djangoproject.com/en/dev/intro/tutorial01/) 
-   Open browser and type: http://127.0.0.1:8000/. Replace 8000 with the real port that you django application is launched. 

You can add task and click "Complete" button will update task complete status to Yes.

## Running the Application in the Compute Emulator
   [#include]

## Publishing the Application to Windows Azure
   [#include]

## Stopping and Deleting Your Application
   [#include]

  [0]: ../Media/getting-started-multi-tier-01.png
  [1]: ../Media/getting-started-multi-tier-100.png
  [2]: ../Media/getting-started-multi-tier-101.png
  [Get Tools and SDK]: http://go.microsoft.com/fwlink/?LinkID=234939&clcid=0x409
  [3]: ../Media/getting-started-3.png
  [4]: ../Media/getting-started-4.png
  [http://www.windowsazure.com]: http://www.windowsazure.com
  [5]: ../Media/getting-started-12.png
  [Windows Azure Platform Management Portal]: http://windows.azure.com
  [6]: ../Media/sb-queues-03.png
  [7]: ../Media/sb-queues-04.png
  [8]: ../Media/getting-started-multi-tier-09.png
  [9]: ../Media/getting-started-multi-tier-10.jpg
  [10]: ../Media/getting-started-multi-tier-11.png
  [11]: ../Media/getting-started-multi-tier-02.png
  [12]: ../Media/getting-started-multi-tier-12.png
  [13]: ../Media/getting-started-multi-tier-13.png
  [14]: ../Media/getting-started-multi-tier-33.png
  [15]: ../Media/getting-started-multi-tier-34.png
  [16]: ../Media/getting-started-multi-tier-35.png
  [17]: ../Media/getting-started-multi-tier-36.png
  [18]: ../Media/getting-started-multi-tier-37.png
  [19]: ../Media/getting-started-multi-tier-38.png
  [20]: ../Media/getting-started-multi-tier-39.png
  [21]: ../Media/SBExplorer.jpg
  [22]: ../Media/SBExplorerAddConnect.jpg
  [23]: ../Media/SBWorkerRole1.jpg
  [24]: ../Media/SBExplorerProperties.jpg
  [25]: ../Media/SBWorkerRoleProperties.jpg
  [26]: ../Media/SBNewWorkerRole.jpg
