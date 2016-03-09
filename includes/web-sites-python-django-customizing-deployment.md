Azure will determine that your application uses Python **if both of these conditions are true**:

- requirements.txt file in the root folder
- any .py file in the root folder OR a runtime.txt that specifies python

When that's the case, it will use a Python specific deployment script, which performs the standard synchronization of files, as well as additional Python operations such as:

- Automatic management of virtual environment
- Installation of packages listed in requirements.txt using pip
- Creation of the appropriate web.config based on the selected Python version.
- Collect static files for Django applications

You can control certain aspects of the default deployment steps without having to customize the script.

If you want to skip all Python specific deployment steps, you can create this empty file:

    \.skipPythonDeployment

If you want to skip collection of static files for your Django application:

    \.skipDjango 

For more control over deployment, you can override the default deployment script by creating the following files:

    \.deployment
    \deploy.cmd

You can use the [Azure command-line interface][] to create the files.  Use this command from your project folder:

    azure site deploymentscript --python

When these files don't exist, Azure creates a temporary deployment script and runs it.  It is identical to the one you create with the command above.

[Azure command-line interface]: http://azure.microsoft.com/downloads/
