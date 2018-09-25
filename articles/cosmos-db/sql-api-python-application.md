---
title: Python Flask web application tutorial for Azure Cosmos DB | Microsoft Docs
description: Review a database tutorial on using Azure Cosmos DB to store and access data from a Python Flask web application hosted on Azure. Find application development solutions.
keywords: Application development, python flask, python web application, python web development
services: cosmos-db
author: SnehaGunda
manager: kfile

ms.service: cosmos-db
ms.component: cosmosdb-sql
ms.devlang: python
ms.topic: tutorial
ms.date: 02/23/2017
ms.author: sngun
ms.custom: H1Hack27Feb2017

---
# Build a Python Flask web application using Azure Cosmos DB

> [!div class="op_single_selector"]
> * [.NET](sql-api-dotnet-application.md)
> * [Java](sql-api-java-application.md)
> * [Node.js](sql-api-nodejs-application.md)
> * [Python](sql-api-python-application.md)
> * [Xamarin](mobile-apps-with-xamarin.md)
> 

This tutorial shows you how to use Azure Cosmos DB to store and access data from a Python Flask web application hosted on Azure App Service. This tutorial presumes that you have some prior experience using Python and Azure websites.

This database tutorial covers:

1. Creating and provisioning an Azure Cosmos DB account.
2. Creating a Python Flask application.
3. Connecting to and using Azure Cosmos DB from your web application.
4. Deploying the web application to Azure App Service.

By following this tutorial, you will build a simple voting
application that allows you to vote for a poll.

![Screen shot of the voting application created by this database tutorial](./media/sql-api-python-application/cosmos-db-pythonr-run-application.png)

## Database tutorial prerequisites
Before following the instructions in this article, you should ensure
that you have the following installed:

* [An Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 

  [!INCLUDE [cosmos-db-emulator-docdb-api](../../includes/cosmos-db-emulator-docdb-api.md)]

* [Visual Studio 2017](https://www.visualstudio.com/downloads/) with **Azure development** and **Python development** enabled. You can check whether these prerequisites are installed, and install them, by opening **Visual Studio Installer** locally.   
* [Microsoft Azure SDK for Python 2.7](https://azure.microsoft.com/downloads/). 
* [Python 2.7](https://www.python.org/downloads/windows/). You can use the 32-bit or 64-bit installation.

> [!IMPORTANT]
> If you are installing Python 2.7 for the first time, ensure that in the Customize Python 2.7.13 screen, you select **Add python.exe to Path**.
> 
> ![Screen shot of the Customize Python 2.7.11 screen, where you need to select Add python.exe to Path](./media/sql-api-python-application/cosmos-db-python-install.png)
> 
> 

* [Microsoft Visual C++ Compiler for Python 2.7](https://www.microsoft.com/en-us/download/details.aspx?id=44266).

## Step 1: Create an Azure Cosmos DB database account
Let's start by creating an Azure Cosmos DB account. If you already have an account or if you are using the Azure Cosmos DB Emulator for this tutorial, you can skip to [Step 2: Create a new Python Flask web application](#step-2-create-a-new-python-flask-web-application).

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount.md)]

<br/>
Now let's walk through how to create a new Python Flask web application from the ground up.

## Step 2: Create a new Python Flask web application
1. In Visual Studio, on the **File** menu, point to **New**, and then click **Project**.
   
    The **New Project** dialog box appears.
2. In the left pane, expand **Templates** and then **Python**, and then click **Web**. 
3. Select **Flask  Web Project** in the center pane, then in the **Name** box type **tutorial**, and then click **OK**. Remember that Python package names should be all lowercase, as described in the [Style Guide for Python Code](https://www.python.org/dev/peps/pep-0008/#package-and-module-names).
   
    For those new to Python Flask, it is a web application development framework that helps you build web applications in Python faster.
   
    ![Screen shot of the New Project window in Visual Studio with Python highlighted on the left, Python Flask Web Project selected in the middle, and the name tutorial in the Name box](./media/sql-api-python-application/image9.png)
4. In the **Python Tools for Visual Studio** window, click **Install into a virtual environment**. 
   
    ![Screen shot of the database tutorial - Python Tools for Visual Studio window](./media/sql-api-python-application/python-install-virtual-environment.png)
5. In the **Add Virtual Environment** window, select Python 2.7 or Python 3.5 in the Select an interpreter box, accept the other defaults, and then click **Create**. This sets up the required Python virtual environment for your project.
   
    ![Screen shot of the database tutorial - Python Tools for Visual Studio window](./media/sql-api-python-application/image10_A.png)
   
    The output window displays `Successfully installed Flask-0.10.1 Jinja2-2.8 MarkupSafe-0.23 Werkzeug-0.11.5 itsdangerous-0.24 'requirements.txt' was installed successfully.` when the environment is successfully installed.

## Step 3: Modify the Python Flask web application
### Add the Python Flask packages to your project
After your project is set up, you'll need to add the required Flask packages to your project, including pydocumentdb, the Python package for the Azure Cosmos DB SQL API.

1. In Solution Explorer, open the file named **requirements.txt** and replace the contents with the following:
   
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
        pydocumentdb>=1.0.0
2. Save the **requirements.txt** file. 
3. In Solution Explorer, right-click **env** and click **Install from requirements.txt**.
   
    ![Screen shot showing env (Python 2.7) selected with Install from requirements.txt highlighted in the list](./media/sql-api-python-application/cosmos-db-python-install-from-requirements.png)
   
    After successful installation, the output window displays the following:
   
        Successfully installed Babel-2.3.2 Tempita-0.5.2 WTForms-2.1 Whoosh-2.7.4 blinker-1.4 decorator-4.0.9 flask-0.9 flask-babel-0.8 flask-mail-0.7.6 flask-sqlalchemy-0.16 flask-whooshalchemy-0.55a0 flask-wtf-0.8.4 flup-1.0.2 pydocumentdb-1.6.1 pytz-2013b0 speaklater-1.3 sqlalchemy-0.7.9 sqlalchemy-migrate-0.7.2
   
   > [!NOTE]
   > In rare cases, you might see a failure in the output window. If this happens, check if the error is related to clean up. Sometimes the clean up fails, but the installation will still be successful (scroll up in the output window to verify this). You can check your installation by [Verifying the virtual environment](#verify-the-virtual-environment). If the installation failed but the verification is successful, it's OK to continue.
   > 
   > 

### Verify the virtual environment
Let's make sure that everything is installed correctly.

1. Build the solution by pressing **Ctrl**+**Shift**+**B**.
2. Once the build succeeds, start the website by pressing **F5**. This launches the Flask development server and starts your web browser. You should see the following page.
   
    ![The empty Python Flask web development project displayed in a browser](./media/sql-api-python-application/image12.png)
3. Stop debugging the website by pressing **Shift**+**F5** in Visual Studio.

### Create database, collection, and document definitions
Now let's create your voting application by adding new files and updating others.

1. In Solution Explorer, right-click the **tutorial** project, click **Add**, and then click **New Item**. Select **Empty Python File** and name the file **forms.py**.  
2. Add the following code to the forms.py file, and then save the file.

```python
from flask_wtf import Form
from wtforms import RadioField

class VoteForm(Form):
    deploy_preference  = RadioField('Deployment Preference', choices=[
        ('Web Site', 'Web Site'),
        ('Cloud Service', 'Cloud Service'),
        ('Virtual Machine', 'Virtual Machine')], default='Web Site')
```


### Add the required imports to views.py
1. In Solution Explorer, expand the **tutorial** folder, and open the **views.py** file. 
2. Add the following import statements to the top of the **views.py** file, then save the file. These import Azure Cosmos DB's PythonSDK and the Flask packages.
   
    ```python
    from forms import VoteForm
    import config_cosmos
    import pydocumentdb.document_client as document_client
    ```

### Create database, collection, and document
* Still in **views.py**, add the following code to the end of the file. This takes care of creating the database used by the form. Do not delete any of the existing code in **views.py**. Simply append this to the end.

```python
@app.route('/create')
def create():
    """Renders the contact page."""
    client = document_client.DocumentClient(config_cosmos.COSMOSDB_HOST, {'masterKey': config_cosmos.COSMOSDB_KEY})

    # Attempt to delete the database.  This allows this to be used to recreate as well as create
    try:
        db = next((data for data in client.ReadDatabases() if data['id'] == config_cosmos.COSMOSDB_DATABASE))
        client.DeleteDatabase(db['_self'])
    except:
        pass

    # Create database
    db = client.CreateDatabase({ 'id': config_cosmos.COSMOSDB_DATABASE })

    # Create collection
    collection = client.CreateCollection(db['_self'],{ 'id': config_cosmos.COSMOSDB_COLLECTION })

    # Create document
    document = client.CreateDocument(collection['_self'],
        { 'id': config_cosmos.COSMOSDB_DOCUMENT,
          'Web Site': 0,
          'Cloud Service': 0,
          'Virtual Machine': 0,
          'name': config_cosmos.COSMOSDB_DOCUMENT 
        })

    return render_template(
       'create.html',
        title='Create Page',
        year=datetime.now().year,
        message='You just created a new database, collection, and document.  Your old votes have been deleted')
```


### Read database, collection, document, and submit form
* Still in **views.py**, add the following code to the end of the file. This takes care of setting up the form, reading the database, collection, and document. Do not delete any of the existing code in **views.py**. Simply append this to the end.

```python
@app.route('/vote', methods=['GET', 'POST'])
def vote(): 
    form = VoteForm()
    replaced_document ={}
    if form.validate_on_submit(): # is user submitted vote  
        client = document_client.DocumentClient(config_cosmos.COSMOSDB_HOST, {'masterKey': config_cosmos.COSMOSDB_KEY})

        # Read databases and take first since id should not be duplicated.
        db = next((data for data in client.ReadDatabases() if data['id'] == config_cosmos.COSMOSDB_DATABASE))

        # Read collections and take first since id should not be duplicated.
        coll = next((coll for coll in client.ReadCollections(db['_self']) if coll['id'] == config_cosmos.COSMOSDB_COLLECTION))

        # Read documents and take first since id should not be duplicated.
        doc = next((doc for doc in client.ReadDocuments(coll['_self']) if doc['id'] == config_cosmos.COSMOSDB_DOCUMENT))

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
```


### Create the HTML files
1. In Solution Explorer, in the **tutorial** folder, right-click the **templates** folder, click **Add**, and then click **New Item**. 
2. Select **HTML Page**, and then in the name box type **create.html**. 
3. Repeat steps 1 and 2 to create two additional HTML files: results.html and vote.html.
4. Add the following code to **create.html** in the `<body>` element. It displays a message stating that we created a new database, collection, and document.
   
    ```html
    {% extends "layout.html" %}
    {% block content %}
    <h2>{{ title }}.</h2>
    <h3>{{ message }}</h3>
    <p><a href="{{ url_for('vote') }}" class="btn btn-primary btn-large">Vote &raquo;</a></p>
    {% endblock %}
    ```
5. Add the following code to **results.html** in the `<body`> element. It displays the results of the poll.
   
    ```html
    {% extends "layout.html" %}
    {% block content %}
    <h2>Results of the vote</h2>
        <br />
   
    {% for choice in vote_object.choices %}
    <div class="row">
        <div class="col-sm-5">{{choice}}</div>
            <div class="col-sm-5">
                <div class="progress">
                    <div class="progress-bar" role="progressbar" aria-valuenow="{{vote_object.choices[choice]}}" aria-valuemin="0" aria-valuemax="{{vote_object.total_votes}}" style="width: {{(vote_object.choices[choice]/vote_object.total_votes)*100}}%;">
                                {{vote_object.choices[choice]}}
                </div>
            </div>
            </div>
    </div>
    {% endfor %}
   
    <br />
    <a class="btn btn-primary" href="{{ url_for('vote') }}">Vote again?</a>
    {% endblock %}
    ```
6. Add the following code to **vote.html** in the `<body`> element. It displays the poll and accepts the votes. On registering the votes, the control is passed over to views.py where Azure Cosmos DB recognizes the vote cast and appends the document accordingly.
   
    ```html
    {% extends "layout.html" %}
    {% block content %}
    <h2>What is your favorite way to host an application on Azure?</h2>
    <form action="" method="post" name="vote">
        {{form.hidden_tag()}}
            {{form.deploy_preference}}
            <button class="btn btn-primary" type="submit">Vote</button>
    </form>
    {% endblock %}
    ```
7. In the **templates** folder, replace the contents of **index.html** with the following. This
   serves as the landing page for your application.
   
    ```html
    {% extends "layout.html" %}
    {% block content %}
    <h2>Python + Azure Cosmos DB Voting Application.</h2>
    <h3>This is a sample Cosmos DB voting application using PyDocumentDB</h3>
    <p><a href="{{ url_for('create') }}" class="btn btn-primary btn-large">Create/Clear the Voting Database &raquo;</a></p>
    <p><a href="{{ url_for('vote') }}" class="btn btn-primary btn-large">Vote &raquo;</a></p>
    {% endblock %}
    ```

### Add a configuration file and change the \_\_init\_\_.py
1. In Solution Explorer, right-click the **tutorial** project, click **Add**, click **New Item**, select **Empty Python File**, and then name the file **config_cosmos.py**. This config file is required by forms in Flask. You can use it to provide a secret key as well. This key is not needed for this tutorial though.
2. Add the following code to config_cosmos.py, you'll need to alter the values of **COSMOSDB\_HOST** and **COSMOSDB\_KEY** in the next step.
   
    ```python
    CSRF_ENABLED = True
    SECRET_KEY = 'you-will-never-guess'
   
    COSMOSDB_HOST = 'https://YOUR_COSMOSDB_NAME.documents.azure.com:443/'
    COSMOSDB_KEY = 'YOUR_SECRET_KEY_ENDING_IN_=='
   
    COSMOSDB_DATABASE = 'voting database'
    COSMOSDB_COLLECTION = 'voting collection'
    COSMOSDB_DOCUMENT = 'voting document'
    ```
3. In the [Azure portal](https://portal.azure.com/), navigate to the **Keys** page by clicking **Browse**, **Azure Cosmos DB Accounts**, double-click the name of the account to use, and then click the **Keys** button in the **Essentials** area. On the **Keys** page, copy the **URI** value and paste it into the **config.py** file, as the value for the **COSMOSDB\_HOST** property. 
4. Back in the Azure portal, on the **Keys** page, copy the value of the **Primary Key** or the **Secondary Key**, and paste it into the **config_cosmos.py** file, as the value for the **COSMOSDB\_KEY** property.
5. In the **\_\_init\_\_.py** file, add the following lines for including the config file reading and some basic logging: 
   
        app.config.from_object('config_cosmos')
        logging.basicConfig(level=logging.INFO,format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        logger = logging.getLogger(__name__)
   
    So that the content of the file is:
   
    ```python
    import logging
    from flask import Flask
    app = Flask(__name__)
    app.config.from_pyfile('config_cosmos')
    logging.basicConfig(level=logging.INFO,format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)

    import tutorial.views
    ```
6. After adding all the files, Solution
   Explorer should look like this:
   
    ![Screen shot of the Visual Studio Solution Explorer window](./media/sql-api-python-application/cosmos-db-python-solution-explorer.png)

## Step 4: Run your web application locally
1. Build the solution by pressing **Ctrl**+**Shift**+**B**.
2. Once the build succeeds, start the website by pressing **F5**. You should see the following on your screen.
   
    ![Screen shot of the Python + Azure Cosmos DB Voting Application displayed in a web browser](./media/sql-api-python-application/cosmos-db-pythonr-run-application.png)
3. Click **Create/Clear the Voting Database** to generate the database.
   
    ![Screen shot of the Create Page of the web application – development details](./media/sql-api-python-application/cosmos-db-python-run-create-page.png)
4. Then, click **Vote** and select your option.
   
    ![Screen shot of the web application with a voting question posed](./media/sql-api-python-application/cosmos-db-vote.png)
5. For every vote you cast, it increments the appropriate counter.
   
    ![Screen shot of the Results of the vote page shown](./media/sql-api-python-application/cosmos-db-voting-results.png)
6. Stop debugging the project by pressing Shift+F5.

## Step 5: Deploy the web application to Azure
Now that you have the complete application working correctly against
Azure Cosmos DB locally, we're going to create a web.config file, update the files on the server to match the local environment, and then view the completed app on Azure. This procedure is specific to Visual Studio 2017. If you are using a different version of Visual Studio, see [Publishing to Azure App Service](/visualstudio/python/publishing-to-azure).

1. In Visual Studio **Solution Explorer**, right-click the project and select **Add > New Item...**. In the dialog that appears, selecting the **Azure web.config (Fast CGI)** template and select **OK**. This creates a `web.config` file in your project root. 

2. Modify the `<system.webServer>` section in `web.config` so that the path matches the Python installation. For example, for Python 2.7 x64 the entry should appear as follows:
    
    ```xml
    <system.webServer>
        <handlers>
            <add name="PythonHandler" path="*" verb="*" modules="FastCgiModule" scriptProcessor="D:\home\Python27\python.exe|D:\home\Python27\wfastcgi.py" resourceType="Unspecified" requireAccess="Script"/>
        </handlers>
    </system.webServer>
    ```

3. Set the `WSGI_HANDLER` entry in `web.config` as to `tutorial.app` to match your project name. 

    ```xml
    <!-- Flask apps only: change the project name to match your app -->
    <add key="WSGI_HANDLER" value="tutorial.app"/>
    ```

4. In Visual Studio **Solution Explorer**, expand the **tutorial** folder, right-click the `static` folder, select **Add > New Item...**, select the "Azure static files web.config" template, and select **OK**. This action creates another `web.config` in the `static` folder that disables Python processing for that folder. This configuration sends requests for static files to the default web server rather than using the Python application.

5. Save the files, then right-click the project in Solution Explorer (make sure you're not still running it locally) and select **Publish**.  
   
     ![Screen shot of the tutorial selected in Solution Explorer, with the Publish option highlighted](./media/sql-api-python-application/image20.png)
6. In the **Publish** dialog box, select **Microsoft Azure App Service**, select **Create New**, and then click **Publish**.
   
    ![Screen shot of the Publish Web window with Microsoft Azure App Service highlighted](./media/sql-api-python-application/cosmos-db-python-publish.png)
7. In the **Create App Service** dialog box, enter the name for your web app along with your **Subscription**, **Resource Group**, and **App Service Plan**, then click **Create**.
   
    ![Screen shot of the Microsoft Azure Web Apps Window window](./media/sql-api-python-application/cosmos-db-python-create-app-service.png)
8. In a few seconds, Visual Studio finishes copying your files to the server and displays "The page cannot be displayed because an internal server error has occurred." on the `http://<your app service>.azurewebsites.net/` page.

9. In the Azure portal, open your new App Service account, then in the navigation menu, scroll down to the **Development Tools** section, select **Extensions**, then click **+ Add**.

10. In the **Choose extension** page, scroll down to the most recent Python 2.7 installation and select the x86 or x64 bit option, then click **OK** to accept the legal terms.  
   
11. Use the Kudu console, which you can browse to at `https://<your app service name>.scm.azurewebsites.net/DebugConsole`, to install the packages listed in your app's `requirements.txt` file. To do this, in the Kudu Diagnostic Console, navigate to your Python folder `D:\home\Python27` then run the following command as described in the [Kudu console](/visualstudio/python/managing-python-on-azure-app-service#azure-app-service-kudu-console) section:

    ```
    D:\home\Python27>python -m pip install --upgrade -r /home/site/wwwroot/requirements.txt
    ```          

12. Restart the App Service in the Azure portal after installing the new packages by pressing the **Restart** button. 

    > [!Tip] 
    > If you make any changes to your app's `requirements.txt` file, be sure to again use the Kudu console to install any packages that are now listed in that file. 

13. Once you've fully configured the server environment, refresh the page in the browser and the web app should appear.

    ![Results of publishing Bottle, Flask, and Django apps to App Service](./media/sql-api-python-application/python-published-app-services.png)

    > [!Tip] 
    > If the web page does not appear, or you still get the "The page cannot be displayed because an internal server error has occurred." message, open the web.config file in Kudo and add ` <httpErrors errorMode="Detailed"></httpErrors>` to the system.webServer section, then refresh the page. This will provided detailed error output to the browser. 

## Troubleshooting
If this is the first Python app you've run on your computer, ensure that the following folders (or the equivalent installation locations) are included in your PATH variable:

    C:\Python27\site-packages;C:\Python27\;C:\Python27\Scripts;

If you receive an error on your vote page, and you named your project something other than **tutorial**, make sure that **\_\_init\_\_.py** references the correct project name in the line: `import tutorial.view`.

## Next steps
Congratulations! You have completed your first Python web application using Azure Cosmos DB and published it to Azure.

To add additional functionality to your web application, review the APIs available in the [Azure Cosmos DB Python SDK](sql-api-sdk-python.md).

For more information about Azure, Visual Studio, and Python, see the [Python Developer Center](https://azure.microsoft.com/develop/python/). 

For additional Python Flask tutorials, see [The Flask Mega-Tutorial, Part I: Hello, World!](http://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world). 
