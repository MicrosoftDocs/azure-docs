<properties linkid="develop-python-web-sites-configuration" urlDisplayName="Web Sites Python Configuration" pageTitle="Web Sites Python Configuration - Windows Azure Tutorial" metaKeywords="Windows Azure Python   web site" metaDescription="A tutorial that introduces you to configuring a Python web site on Windows Azure." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />

<div chunk="../chunks/article-left-menu.md" />

# Configuring Python with Windows Azure Web Sites #

This tutorial describes options for authoring and configuring a basic Web Server Gateway Interface (WSGI) compliant Python application on Windows Azure Websites. Getting started with Windows Azure Websites is easy, and your Python application will have room to scale and extend to other Windows Azure services. The Windows Azure Websites platform includes Python 2.7 and the generic wfastcgi.py FastCGI handler for Python. All you have to do is configure your web site to use the Python handler.  

For a more complex example configuring the Django framework on Windows Azure Websites, please see the following tutorial: 
[http://www.windowsazure.com/en-us/develop/python/tutorials/web-sites-with-django](http://www.windowsazure.com/en-us/develop/python/tutorials/web-sites-with-django).  

## WSGI Support

WSGI is a Python standard described by [PEP 3333](http://www.python.org/dev/peps/pep-3333/) defining an interface between the web server and Python. It provides a standardized interface for writing various web applications and frameworks using Python.  Popular Python web frameworks today use WSGI.  Windows Azure Websites gives you support for any such frameworks; in addition, advanced users can even author their own as long as the custom handler follows the WSGI specification guidelines.

## Web Site Creation

This tutorial assumes an existing Windows Azure subscription and access to the Windows Azure Management Portal. Detailed guidance on creating a web site is available at [http://www.windowsazure.com/en-us/manage/services/web-sites/how-to-create-websites](http://www.windowsazure.com/en-us/manage/services/web-sites/how-to-create-websites).
 
In short, if you do not have an existing website you can create one from the Windows Azure Management Portal. Select the WEB SITES feature and use the QUICK CREATE option, specifying a URL for your web site.

![](../Media/configure-python-create-website.png)

## Git Publishing

Use the QUICK START or DASHBOARD tabs for your newly created web site to configure Git publishing.  This tutorial uses Git to create, manage, and publish our Python web site to Windows Azure Websites. 

![](../Media/configure-python-git.png)

Once Git publishing is set up, a Git repository will be created and associated with your web site.  The repository’s URL will be displayed and can henceforth be used to push data from the local development environment to the cloud. To publish applications via Git, make sure a Git client is also installed and use the instructions provided to push your web site content to Windows Azure Websites.

## Web Site Content

As an example we use a basic Python application with a basic WSGI handler that illustrates the minimal amount of work needed to take advantage of Windows Azure Websites’ Python support.  This skeleton Python application can then be used to start authoring a variety of solutions, with complexity ranging from the example below all the way to a full-fledged web framework.  

Below is the code for the basic WSGI handler. It is similar to that suggested by the [PEP 3333](http://www.python.org/dev/peps/pep-3333/) specification as a starting point for a WSGI compliant application. We saved this content in a file named ConfigurePython.py created in a ConfigurePython folder under the web site root:

	def application(environ, start_response):
	    status = '200 OK'
	    response_headers = [('Content-type', 'text/plain')]
	    start_response(status, response_headers)
	    yield 'Hello from Windows Azure Websites\n'

*application* is a Python callable, which will serve as the entry point called by a WSGI-compliant server. This callable object accepts 2 positional arguments: 

* *environ*: a dictionary with various environment variables
* *start_response*: a callable provided by the web server for transfer of HTTP status and response header

This handler will return the plain text “Hello from Windows Azure Websites” for every request made to it.

## Configuration Options

There are 2 different options for configuring your Python application with Windows Azure Websites.

**Option 1: Portal** 

1.1. Register the FastCGI handler via CONFIGURE tab in the Portal.
For this example we use the FastCGI handler for Python included with Windows Azure Websites. To do the same use the following paths for your script processor and FastCGI handler argument:

* Python script processor path: D:\python27\python.exe
* Python FastCGI handler path: D:\python27\scripts\wfastcgi.py

![](../Media/configure-python-handler-mapping.png)

1.2. Configure app settings via the same CONFIGURE tab in the Portal.
The app settings are converted to environment variables. This is a mechanism you can use for configuration values required by your Python application. For this basic example application we configured the following:

* PYTHONPATH informs Python about the directory to search for modules. Windows Azure Websites provides D:\home\site\wwwroot as syntactic sugar pointing to the root of your web site. 
* WSGI_HANDLER records a module or package name and the attribute to be used.

![](../Media/configure-python-app-settings.png)

**Option 2: web.config**  
The configuration alternative is to use a web.config file under the web site root for actions described below. Using the web.config option provides better portability potential for a web application. There are 2 approaches available to route requests to the web application: either set a handler that handles the * path, which instructs IIS to route every incoming request through Python; or set a specific path that Python will handle and subsequently employ URL Rewriting to redirect various URLs to our selected path.  In fact, we recommend the latter approach – using an empty handler file under the web site root to serve as the request target (handler.fcgi in our example) – for better performance. In the former scenario, all requests, including those for static content (e.g. image files and style sheets), will have to go through Python, subverting the optimizations the web server provides for accessing static files.  Employing the latter approach allows serving static content efficiently and invoking Python only when necessary.

2.1. Specify the PYTHONPATH variable. 
> This will inform Python where to look for the application code. D:\home\site\wwwroot is also used here as the absolute path to the web site.

2.2. Set the WSGI_HANDLER variable.
> Windows Azure Websites uses this value to direct Python to call our WSGI handler.  The value of this variable is a Python expression which should, when executed, return a callable which represents a WSGI handler. 

2.3. Add a handler for Python.
> This will inform Windows Azure Websites that Python should handle requests made to the path handler.fcgi. It is important for the handler syntax to look exactly like what we have inside the <handlers> tag in the example below unless you bring your own FastCGI handler or Python development stack.

2.4. Rewrite URLs to handler.fcgi.
> Requesting handler.fcgi all the time may not be the best idea. To select the path of files to be handled by the Python handler we used URL Rewriting so all the URLs get handled by our Python handler.

	<configuration>
  		<appSettings>
    		<add key="pythonpath" value="D:\home\site\wwwroot\ConfigurePython" />
    		<add key="WSGI_HANDLER" value="ConfigurePython.application" />
  		</appSettings>
  		<system.webServer>
    		<handlers>
      			<add name="PythonHandler" 
           		verb="*" path="handler.fcgi" 
           		modules="FastCgiModule" 
           		scriptProcessor="D:\Python27\Python.exe|D:\Python27\Scripts\wfastcgi.py" 
           		resourceType="Either" />
   			</handlers>
			<rewrite>
	    		<rules>
					<rule name="Configure Python" stopProcessing="true">
		    			<match url="(.*)" ignoreCase="false" />
		    			<conditions>
							<add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
		    			</conditions>
		    			<action type="Rewrite" url="handler.fcgi/{R:1}" appendQueryString="false" />
					</rule>
	    		</rules>
			</rewrite>
  		</system.webServer>
	</configuration> 

The folder structure for the example under web site root is the following (casing of Python folder and file names is significant and reflected in web.config):

* ConfigurePython\ConfigurePython.py
* web.config
* handler.fcgi

Because we are rewriting all URLs to handler.fcgi and handing that path via FastCGI to Python, we need to create a placeholder file with the same name so that IIS will not return an HTTP 404 error. This is due to the internal behavior of the IIS FastCGI module, which enforces that the file being requested must exist before it is passed onto the specified script processor application.

Browse to your web site to test correct configuration. For this example the “Hello from Windows Azure Websites” message is visible on access.

![](../Media/configure-python-result.png)
 
