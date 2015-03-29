<properties 
    pageTitle="Build a web app with Python and Flask using DocumentDB | Azure" 
    description="Learn how to use DocumentDB to store and access data from an Python and Flask (MVC) web application hosted on Azure." 
    services="documentdb" 
    documentationCenter="python" 
    authors="crwilcox" 
    manager="jhubbard" 
    editor="cgronlun"/>

<tags 
    ms.service="documentdb" 
    ms.workload="data-management" 
    ms.tgt_pltfrm="na" 
    ms.devlang="python" 
    ms.topic="article" 
    ms.date="02/12/2015" 
    ms.author="crwilcox"/>

# Build a web application with Python and Flask (MVC) using DocumentDB
------------------------------------------------------------------------

To highlight how customers can efficiently leverage Azure DocumentDB to
store and query JSON documents, this document provides an end-to-end
walkthrough of building a voting web application using Azure Document
DB.

This walkthrough shows you how to use the DocumentDB service provided by
Azure to store and access data from a Python web application hosted on
Azure and presumes that you have some prior experience using Python and
Azure Websites.

This walkthrough covers:

1. Creating and provisioning a DocumentDB Account

2. Creating a Python MVC Application

3. Connecting to and using Azure DocumentDB from your web application

4. Deploying the Web Application to Azure Websites

By following this walkthrough, you will build a simple voting
application that allows you to vote for a poll.

![Alt text](./media/documentdb-python-application/image1.png)


## Prerequisites

Before following the instructions in this article, you should ensure
that you have the following installed:

- Visual Studio 2013 (or [Visual Studio Express][] which is the free
version)

- Python Tools for Visual Studio from [here][]

- Azure SDK for Visual Studio 2013, version 2.4 or higher available from
[here][1]

- Python 2.7 from [here][2]

- Microsoft Visual C++ Compiler for Python 2.7 from [here][3]

## Step 1: Create a DocumentDB database account

To provision a DocumentDB database account in Azure, open the [Azure
Management Portal][] and either Click the Azure Gallery tile on the
homepage or click "+" in the lower left hand corner of the screen.

![Alt text](./media/documentdb-python-application/image2.png)


This will open the Azure Marketplace, where you can select from the many
available Azure services. In the Marketplace, select "Data + analytics" from the list of categories.

![Alt text](./media/documentdb-python-application/image3.png)

From here, search for documentdb and select the option for DocumentDB

![Alt text](./media/documentdb-python-application/image4.png)

Then select "Create" from the bottom of the screen

![Alt text](./media/documentdb-python-application/image5.png)

This will open the "New DocumentDB" blade where you can specify the
name, region, scale, resource group and other settings for your new
account.

![Alt text](./media/documentdb-python-application/image6.png)

Once you’re done supplying the values for your account, Click "Create"
and the provisioning process will begin creating your database account.
Once the provisioning process is complete you should see a notification
appear in the notifications area of the portal and the tile on your
start screen (if you selected to create one) will change to show the
completed action.

![Alt text](./media/documentdb-python-application/image7.png)

Once provisioning is complete, clicking the DocumentDB tile from the
start screen will bring up the main blade for this newly created
DocumentDB account.

![Alt text](./media/documentdb-python-application/image8.png)

Using the "Keys" button, access your endpoint URL and the Primary Key,
copy these to your clipboard and keep them handy as we will use these
values in the web application we will create next.


## Step 2: Create a new Python Flask Web Application

Open Visual Studio, File -\> New Project -\> Python -\>, Flask Web
Project with the name **tutorial**. 

For those new to Flask, it is a web framework that helps us build web
applications in Python faster. [Click here to access Flask tutorials][].

![Alt text](./media/documentdb-python-application/image9.png)

It will ask you whether you want to
install external packages. Click on **Install into a virtual environment**. Be sure to use Python 2.7 as the base environment as PyDocumentDB does not currently support Python 3.x.  This will setup the required Python virtual environment for your project.

![Alt text](./media/documentdb-python-application/image10.png)


## Step 3: Modify the Python Flask Web Application


### Add flask packages to your project

Once your project is setup you need to add certain flask packages that
we will need for our project, including pydocumentdb, the python package for DocumentDB. Open the file named **requirements.txt** and replace the contents with the following:

    flask==0.9
    flask-mail==0.7.6
    sqlalchemy==0.7.9
    flask-sqlalchemy==0.16
    sqlalchemy-migrate==0.7.2
    flask-whooshalchemy==0.55a
    flask-wtf==0.8.4
    pytz==2013b
    flask-babel==0.8
    flup
    pydocumentdb>=0.9.4-preview

Right-click on **env** and click **install from requirements.txt**

![Alt text](./media/documentdb-python-application/image11.png)

**Note:** In rare cases, you may see a failure in the output window. If
this happens, check if the error is related to cleanup. Sometimes the
cleanup will fail but installation will still be successful (scroll up
in the output window to verify this).
<a name="verify-the-virtual-environment"></a> If this occurs it's ok to continue.


### Verify the virtual environment

Let's make sure that everything is installed properly. Start the web
site by hitting **F5** This will launch the flask development server
and start your web browser. You should see the following page:

![Alt text](./media/documentdb-python-application/image12.png)

### Create Database, Collection and Document Definition

Add a Python file by right-clicking on on the folder named **tutorial** in the Solution Explorer.  Name the file **forms.py**.  We are creating our polling application.

    from flask.ext.wtf import Form
    from wtforms import RadioField

    class VoteForm(Form):
        deploy_preference  = RadioField('Deployment Preference', choices=[
            ('Web Site', 'Web Site'),
            ('Cloud Service', 'Cloud Service'),
            ('Virtual Machine', 'Virtual Machine')], default='Web Site')

### Add the required imports to views.py

Add the following import statements at the top in **views.py**. These
will import DocumentDB's PythonSDK and Flask packages.


    from forms import VoteForm
    import config
    import pydocumentdb.document_client as document_client
    

### Create Database, Collection and Document

Add the following code to **views.py**. This takes care of creating the 
database used by the form. Do not delete any of the existing code in 
**views.py**. Simply append this to the end.

    @app.route('/create')
    def create():
        """Renders the contact page."""
        client = document_client.DocumentClient(config.DOCUMENTDB_HOST, {'masterKey': config.DOCUMENTDB_KEY})
    
        # Attempt to delete the database.  This allows this to be used to recreate as well as create
        try:
            db = next((data for data in client.ReadDatabases() if data['id'] == config.DOCUMENTDB_DATABASE))
            client.DeleteDatabase(db['_self'])
        except:
            pass
    
        # Create database
        db = client.CreateDatabase({ 'id': config.DOCUMENTDB_DATABASE })
        # Create collection
        collection = client.CreateCollection(db['_self'],{ 'id': config.DOCUMENTDB_COLLECTION })
        # Create document
        document = client.CreateDocument(collection['_self'],
            { 'id': config.DOCUMENTDB_DOCUMENT,
            'Web Site': 0,
            'Cloud Service': 0,
            'Virtual Machine': 0,
            'name': config.DOCUMENTDB_DOCUMENT })
    
        return render_template(
            'create.html', 
            title='Create Page', 
            year=datetime.now().year,
            message='You just created a new database, collection, and document.  Your old votes have been deleted')


### Read Database and Collection and Document and Submit Form

Add the following code to **views.py**. This takes care of setting up
the form, reading the database, collection and document. Do not delete
any of the existing code in **views.py**. Simply append this to the end.
    
    @app.route('/vote', methods=['GET', 'POST'])
    def vote(): 
        form = VoteForm()
        replaced_document ={}
        if form.validate_on_submit(): # is user submitted vote  
            client = document_client.DocumentClient(config.DOCUMENTDB_HOST, {'masterKey': config.DOCUMENTDB_KEY})
            
            # Read databases and take first since id should not be duplicated.
            db = next((data for data in client.ReadDatabases() if data['id'] == config.DOCUMENTDB_DATABASE))
            
            # Read collections and take first since id should not be duplicated.
            coll = next((coll for coll in client.ReadCollections(db['_self']) if coll['id'] == config.DOCUMENTDB_COLLECTION))
    
            # Read documents and take first since id should not be duplicated.
            doc = next((doc for doc in client.ReadDocuments(coll['_self']) if doc['id'] == config.DOCUMENTDB_DOCUMENT))
    
            # Take the data from the deploy_preference and increment our database
            doc[form.deploy_preference.data] = doc[form.deploy_preference.data] + 1
            replaced_document = client.ReplaceDocument(doc['_self'], doc)
    
            # Create a model to pass to results.html
            class VoteObject:
                choices = dict()
                total_votes = 0
    
            vote_object = VoteObject()
            vote_object.choices = {
                "Web Site" : doc['Web Site'],
                "Cloud Service" : doc['Cloud Service'],
                "Virtual Machine" : doc['Virtual Machine']
            }
            vote_object.total_votes = sum(vote_object.choices.values())
    
            return render_template(
                'results.html', 
                year=datetime.now().year, 
                vote_object = vote_object)
    
        else :
            return render_template(
                'vote.html', 
                title = 'Vote',
                year=datetime.now().year,
                form = form)


### Create the html files

Under the templates folder add the following html files: create.html, results.html, vote.html

Add the following code to **create.html**. It takes care of displaying
the message that we created a new database, collection and document.

    {% extends "layout.html" %}
    {% block content %}
    <h2>{{ title }}.</h2>
    <h3>{{ message }}</h3>
    <p><a href="{{ url_for('vote') }}" class="btn btn-primary btn-large">Vote &raquo;</a></p>
    {% endblock %}

Add the following code to **results.html**. It takes care of displaying
the results of the poll.

    {% extends "layout.html" %}
    {% block content %}
    <h2>Results of the vote</h2>
    <br />

    {% for choice in vote_object.choices %}
    <div class="row">
        <div class="col-sm-5">{{choice}}</div>
        <div class="col-sm-5">
            <div class="progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="{{vote_object.choices[choice]}}" aria-valuemin="0" 
                     aria-valuemax="{{vote_object.total_votes}}" style="width: {{(vote_object.choices[choice]/vote_object.total_votes)*100}}%;">
                    {{vote_object.choices[choice]}}
                </div>
            </div>
        </div>
    </div>
    {% endfor %}

    <br />
    <a class="btn btn-primary" href="{{ url_for('vote') }}">Vote again?</a>
    {% endblock %}

Add the following code to **vote.html**. It takes care of displaying the
poll and accepting the votes. On registering the votes the control is
passed over to views.py where we will recognize the vote casted and
append the document accordingly.

    {% extends "layout.html" %}
    {% block content %}
    <h2>What is your favorite way to host an application on Azure?</h2>
    <form action="" method="post" name="vote">
        {{form.hidden_tag()}}
        {{form.deploy_preference}}
        <button class="btn btn-primary" type="submit">Vote</button>
    </form>
    {% endblock %}

Replace the contents of **index.html** with the following. This
serves as the landing page for your application.

    {% extends "layout.html" %}
    {% block content %}
    <h2>Python + DocumentDB Voting Application.</h2>
    <h3>This is a sample DocumentDB voting application using PyDocumentDB</h3>
    <p><a href="{{ url_for('create') }}" class="btn btn-primary btn-large">Create/Clear the Voting Database &raquo;</a></p>
    <p><a href="{{ url_for('vote') }}" class="btn btn-primary btn-large">Vote &raquo;</a></p>
    {% endblock %}


### Add a configuration file and change the \_\_init\_\_.py

Right-click on the project name tutorial and add a file - **config.py**.
This config is required by forms in flask. You may use it to provide a
secret key as well. This is not needed for this tutorial though. Add the following code to config.py.   Alter the values of **DOCUMENTDB\_HOST** and **DOCUMENTDB\_KEY**.

    CSRF_ENABLED = True
    SECRET_KEY = 'you-will-never-guess'
    
    DOCUMENTDB_HOST = 'https://YOUR_DOCUMENTDB_NAME.documents.azure.com:443/'
    DOCUMENTDB_KEY = 'YOUR_SECRET_KEY_ENDING_IN_=='
    
    DOCUMENTDB_DATABASE = 'voting database'
    DOCUMENTDB_COLLECTION = 'voting collection'
    DOCUMENTDB_DOCUMENT = 'voting document'


Similarly replace the contents of **\_\_init\_\_.py** with the following.

    from flask import Flask
    app = Flask(__name__)
    app.config.from_object('config')
    import tutorial.views

After following the above mentioned steps, this is how your solution
explorer should look like

![Alt text](./media/documentdb-python-application/image15.png)


## Step 4: Run your application locally

Hit F5 or the run button in Visual Studio and you should see the
following on your screen.

![Alt text](./media/documentdb-python-application/image16.png)

Click on "Create/Clear the Voting Database" to generate the database.

![Alt text](./media/documentdb-python-application/image17.png)

Then, Click on "Vote" and select your option

![Alt text](./media/documentdb-python-application/image18.png)

For every vote you cast it will increment the appropriate counter.

![Alt text](./media/documentdb-python-application/image19.png)


## Step 5: Deploy application to Azure Websites

Now that you have the complete application working correctly against
DocumentDB we're going to deploy this to Azure Websites. Right-click on
the Project in Solution Explorer (make sure you're not still running it
locally) and select Publish.  Then, select Microsoft Azure Websites.

![Alt text](./media/documentdb-python-application/image20.png)


Configure your Azure Website by providing your credentials and click Publish.

![Alt text](./media/documentdb-python-application/image21.png)

In a few seconds, Visual Studio will finish publishing your web
application and launch a browser where you can see your handy work
running in Azure!


## Next steps

Congratulations! You have just built your first Python Application using
Azure DocumentDB and published it to Azure Websites.


  [Click here to access Flask tutorials]: http://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world

  [Visual Studio Express]: http://www.visualstudio.com/products/visual-studio-express-vs.aspx
  [here]: http://aka.ms/ptvs
  [1]: http://go.microsoft.com/fwlink/?linkid=254281&clcid=0x409
  [2]: https://www.python.org/downloads/windows/
  [3]: http://aka.ms/vcpython27 
  [Microsoft Web Platform Installer]: http://www.microsoft.com/web/downloads/platform.aspx
  [Azure Management Portal]: http://portal.azure.com