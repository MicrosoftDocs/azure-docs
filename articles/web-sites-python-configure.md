<properties 
	pageTitle="Configuring Python with Azure App Service Web Apps" 
	description="This tutorial describes options for authoring and configuring a basic Web server Gateway Interface (WSGI) compliant Python application on Azure App Service Web Apps." 
	services="app-service\web" 
	documentationCenter="python" 
	tags="python"
	authors="huguesv" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="python" 
	ms.topic="article" 
	ms.date="04/15/2015" 
	ms.author="huguesv"/>




# Configuring Python with Azure App Service Web Apps

This tutorial describes options for authoring and configuring a basic Web Server Gateway Interface (WSGI) compliant Python application on [Azure App Service Web Apps](http://go.microsoft.com/fwlink/?LinkId=529714).

It describes additional features of Git deployment, such as virtual environment and package installation using requirements.txt.


## Bottle, Django or Flask?

The Azure Marketplace contains templates for the Bottle, Django and Flask frameworks. If you are developing your first web app in Azure App Service, or you are not familiar with Git, we recommend that you follow one of these tutorials, which include step-by-step instructions for building a working application from the gallery using Git deployment from Windows or Mac:

- [Creating web apps with Bottle](web-sites-python-create-deploy-bottle-app.md)
- [Creating web apps with Django](web-sites-python-create-deploy-django-app.md)
- [Creating web apps with Flask](web-sites-python-create-deploy-flask-app.md)


## Web app creation on Azure Preview Portal

This tutorial assumes an existing Azure subscription and access to the Azure Preview Portal.

If you do not have an existing web app, you can create one from the [Azure Preview Portal](https://portal.azure.com).  Click the NEW button in the bottom left corner, then click **Web + Mobile** > **Web app**.

## Git Publishing

Configure Git publishing for your newly created web app by following the instructions at [Continuous deployment using GIT in Azure App Service](web-sites-publish-source-control.md). This tutorial uses Git to create, manage, and publish our Python web app to Azure App Service.

Once Git publishing is set up, a Git repository will be created and associated with your web app. The repository's URL will be displayed and can henceforth be used to push data from the local development environment to the cloud. To publish applications via Git, make sure a Git client is also installed and use the instructions provided to push your web app content to Azure App Service.


## Application Overview

In the next sections, the following files are created. They should be placed in the root of the Git repository.

    app.py
    requirements.txt
    runtime.txt
    web.config
    ptvs_virtualenv_proxy.py


## WSGI Handler

WSGI is a Python standard described by [PEP 3333](http://www.python.org/dev/peps/pep-3333/) defining an interface between the web server and Python. It provides a standardized interface for writing various web applications and frameworks using Python. Popular Python web frameworks today use WSGI. Azure App Service Web Apps gives you support for any such frameworks; in addition, advanced users can even author their own as long as the custom handler follows the WSGI specification guidelines.

Here's an example of an `app.py` that defines a custom handler:

    def wsgi_app(environ, start_response):
        status = '200 OK'
        response_headers = [('Content-type', 'text/plain')]
        start_response(status, response_headers)
        response_body = 'Hello World'
        yield response_body.encode()

    if __name__ == '__main__':
        from wsgiref.simple_server import make_server

        httpd = make_server('localhost', 5555, wsgi_app)
        httpd.serve_forever()

You can run this application locally with `python app.py`, then browse to `http://localhost:5555` in your web browser.


## Virtual Environment

Although the example app above doesn't require any external packages, it is likely that your application will require some.

To help manage external package dependencies, Azure Git deployment supports the creation of virtual environments.

When Azure detects a requirements.txt in the root of the repository, it automatically creates a virtual environment named `env`. This only occurs on the first deployment, or during any deployment after the selected Python runtime has changed.

You will probably want to create a virtual environment locally for development, but don't include it in your Git repository.


## Package Management

Packages listed in requirements.txt will be installed automatically in the virtual environment using pip. This happens on every deployment, but pip will skip installation if a package is already installed.

Example `requirements.txt`:

    azure==0.8.4


## Python Version

[AZURE.INCLUDE [web-sites-python-customizing-runtime](../includes/web-sites-python-customizing-runtime.md)]

Example `runtime.txt`:

    python-2.7


## Web.config

You'll need to create a web.config file to specify how the server should handle requests.

Note that if you have a web.x.y.config file in your repository, where x.y matches the selected Python runtime, then Azure will automatically copy the appropriate file as web.config.

The following web.config examples rely on a virtual environment proxy script, which is described in the next section.  They work with the WSGI handler used in the example `app.py` above.

Example `web.config` for Python 2.7:

    <?xml version="1.0"?>
    <configuration>
      <appSettings>
        <add key="WSGI_ALT_VIRTUALENV_HANDLER" value="app.wsgi_app" />
        <add key="WSGI_ALT_VIRTUALENV_ACTIVATE_THIS"
             value="D:\home\site\wwwroot\env\Scripts\activate_this.py" />
        <add key="WSGI_HANDLER"
             value="ptvs_virtualenv_proxy.get_virtualenv_handler()" />
        <add key="PYTHONPATH" value="D:\home\site\wwwroot" />
      </appSettings>
      <system.web>
        <compilation debug="true" targetFramework="4.0" />
      </system.web>
      <system.webServer>
        <modules runAllManagedModulesForAllRequests="true" />
        <handlers>
          <remove name="Python273_via_FastCGI" />
          <remove name="Python340_via_FastCGI" />
          <add name="Python FastCGI"
               path="handler.fcgi"
               verb="*"
               modules="FastCgiModule"
               scriptProcessor="D:\Python27\python.exe|D:\Python27\Scripts\wfastcgi.py"
               resourceType="Unspecified"
               requireAccess="Script" />
        </handlers>
        <rewrite>
          <rules>
            <rule name="Static Files" stopProcessing="true">
              <conditions>
                <add input="true" pattern="false" />
              </conditions>
            </rule>
            <rule name="Configure Python" stopProcessing="true">
              <match url="(.*)" ignoreCase="false" />
              <conditions>
              </conditions>
              <action type="Rewrite"
                      url="handler.fcgi/{R:1}"
                      appendQueryString="true" />
            </rule>
          </rules>
        </rewrite>
      </system.webServer>
    </configuration>


Example `web.config` for Python 3.4:

    <?xml version="1.0"?>
    <configuration>
      <appSettings>
        <add key="WSGI_ALT_VIRTUALENV_HANDLER" value="app.wsgi_app" />
        <add key="WSGI_ALT_VIRTUALENV_ACTIVATE_THIS"
             value="D:\home\site\wwwroot\env\Scripts\python.exe" />
        <add key="WSGI_HANDLER"
             value="ptvs_virtualenv_proxy.get_venv_handler()" />
        <add key="PYTHONPATH" value="D:\home\site\wwwroot" />
      </appSettings>
      <system.web>
        <compilation debug="true" targetFramework="4.0" />
      </system.web>
      <system.webServer>
        <modules runAllManagedModulesForAllRequests="true" />
        <handlers>
          <remove name="Python273_via_FastCGI" />
          <remove name="Python340_via_FastCGI" />
          <add name="Python FastCGI"
               path="handler.fcgi"
               verb="*"
               modules="FastCgiModule"
               scriptProcessor="D:\Python34\python.exe|D:\Python34\Scripts\wfastcgi.py"
               resourceType="Unspecified"
               requireAccess="Script" />
        </handlers>
        <rewrite>
          <rules>
            <rule name="Static Files" stopProcessing="true">
              <conditions>
                <add input="true" pattern="false" />
              </conditions>
            </rule>
            <rule name="Configure Python" stopProcessing="true">
              <match url="(.*)" ignoreCase="false" />
              <conditions>
              </conditions>
              <action type="Rewrite" url="handler.fcgi/{R:1}" appendQueryString="true" />
            </rule>
          </rules>
        </rewrite>
      </system.webServer>
    </configuration>


Static files will be handled by the web server directly, without going through Python code, for improved performance.

In the above examples, the location of the static files on disk should match the location in the URL. This means that a request for `http://pythonapp.azurewebsites.net/static/site.css` will serve the file on disk at `\static\site.css`.

It's possible configure the rule `Static Files` to serve files from a location on disk that differs from the location in the URL.  In the following rule definition, a request for `http://pythonapp.azurewebsites.net/static/site.css` will serve the file on disk at `\FlaskWebProject\static\site.css`, instead of `\static\site.css`.

    <rule name="Static Files" stopProcessing="true">
      <match url="^/static/.*" ignoreCase="true" />
      <action type="Rewrite" url="^/FlaskWebProject/static/.*" appendQueryString="true" />
    </rule>

`WSGI_ALT_VIRTUALENV_HANDLER` is where you specify the WSGI handler. In the above examples, it's `app.wsgi_app` because the handler is a function named `wsgi_app` in `app.py` in the root folder.

`PYTHONPATH` can be customized, but if you install all your dependencies in the virtual environment by specifying them in requirements.txt, you shouldn't need to change it.


## Virtual Environment Proxy

The following script is used to retrieve the WSGI handler, activate the virtual environment and log errors. It is designed to be generic and used without modifications.

Contents of `ptvs_virtualenv_proxy.py`:

     # ############################################################################
     #
     # Copyright (c) Microsoft Corporation. 
     #
     # This source code is subject to terms and conditions of the Apache License, Version 2.0. A 
     # copy of the license can be found in the License.html file at the root of this distribution. If 
     # you cannot locate the Apache License, Version 2.0, please send an email to 
     # vspython@microsoft.com. By using this source code in any fashion, you are agreeing to be bound 
     # by the terms of the Apache License, Version 2.0.
     #
     # You must not remove this notice, or any other, from this software.
     #
     # ###########################################################################

    import datetime
    import os
    import sys

    if sys.version_info[0] == 3:
        def to_str(value):
            return value.decode(sys.getfilesystemencoding())

        def execfile(path, global_dict):
            """Execute a file"""
            with open(path, 'r') as f:
                code = f.read()
            code = code.replace('\r\n', '\n') + '\n'
            exec(code, global_dict)
    else:
        def to_str(value):
            return value.encode(sys.getfilesystemencoding())

    def log(txt):
        """Logs fatal errors to a log file if WSGI_LOG env var is defined"""
        log_file = os.environ.get('WSGI_LOG')
        if log_file:
            f = open(log_file, 'a+')
            try:
                f.write('%s: %s' % (datetime.datetime.now(), txt))
            finally:
                f.close()

    ptvsd_secret = os.getenv('WSGI_PTVSD_SECRET')
    if ptvsd_secret:
        log('Enabling ptvsd ...\n')
        try:
            import ptvsd
            try:
                ptvsd.enable_attach(ptvsd_secret)
                log('ptvsd enabled.\n')
            except: 
                log('ptvsd.enable_attach failed\n')
        except ImportError:
            log('error importing ptvsd.\n');

    def get_wsgi_handler(handler_name):
        if not handler_name:
            raise Exception('WSGI_HANDLER env var must be set')
        
        if not isinstance(handler_name, str):
            handler_name = to_str(handler_name)

        module_name, _, callable_name = handler_name.rpartition('.')
        should_call = callable_name.endswith('()')
        callable_name = callable_name[:-2] if should_call else callable_name
        name_list = [(callable_name, should_call)]
        handler = None

        while module_name:
            try:
                handler = __import__(module_name, fromlist=[name_list[0][0]])
                for name, should_call in name_list:
                    handler = getattr(handler, name)
                    if should_call:
                        handler = handler()
                break
            except ImportError:
                module_name, _, callable_name = module_name.rpartition('.')
                should_call = callable_name.endswith('()')
                callable_name = callable_name[:-2] if should_call else callable_name
                name_list.insert(0, (callable_name, should_call))
                handler = None

        if handler is None:
            raise ValueError('"%s" could not be imported' % handler_name)

        return handler

    activate_this = os.getenv('WSGI_ALT_VIRTUALENV_ACTIVATE_THIS')
    if not activate_this:
        raise Exception('WSGI_ALT_VIRTUALENV_ACTIVATE_THIS is not set')

    def get_virtualenv_handler():
        log('Activating virtualenv with %s\n' % activate_this)
        execfile(activate_this, dict(__file__=activate_this))

        log('Getting handler %s\n' % os.getenv('WSGI_ALT_VIRTUALENV_HANDLER'))
        handler = get_wsgi_handler(os.getenv('WSGI_ALT_VIRTUALENV_HANDLER'))
        log('Got handler: %r\n' % handler)
        return handler

    def get_venv_handler():
        log('Activating venv with executable at %s\n' % activate_this)
        import site
        sys.executable = activate_this
        old_sys_path, sys.path = sys.path, []
        
        site.main()
        
        sys.path.insert(0, '')
        for item in old_sys_path:
            if item not in sys.path:
                sys.path.append(item)

        log('Getting handler %s\n' % os.getenv('WSGI_ALT_VIRTUALENV_HANDLER'))
        handler = get_wsgi_handler(os.getenv('WSGI_ALT_VIRTUALENV_HANDLER'))
        log('Got handler: %r\n' % handler)
        return handler


## Customize Git deployment

[AZURE.INCLUDE [web-sites-python-customizing-runtime](../includes/web-sites-python-customizing-deployment.md)]


## Troubleshooting - Package Installation

[AZURE.INCLUDE [web-sites-python-troubleshooting-package-installation](../includes/web-sites-python-troubleshooting-package-installation.md)]


## Troubleshooting - Virtual Environment

[AZURE.INCLUDE [web-sites-python-troubleshooting-virtual-environment](../includes/web-sites-python-troubleshooting-virtual-environment.md)]

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)





