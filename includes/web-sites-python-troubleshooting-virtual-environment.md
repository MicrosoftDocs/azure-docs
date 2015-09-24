The deployment script will skip creation of the virtual environment on Azure if it detects that a compatible virtual environment already exists.  This can speed up deployment considerably.  Packages that are already installed will be skipped by pip.

In certain situations, you may want to force delete that virtual environment.  You'll want to do this if you decide to include a virtual environment as part of your repository.  You may also want to do this if you need to get rid of certain packages, or test changes to requirements.txt.

There are a few options to manage the existing virtual environment on Azure:

### Option 1: Use FTP

With an FTP client, connect to the server and you'll be able to delete the env folder.  Note that some FTP clients (such as web browsers) may be read-only and won't allow you to delete folders, so you'll want to make sure to use an FTP client with that capability.  The FTP host name and user are displayed in the your web app's blade on the [Azure Portal](https://portal.azure.com).

### Option 2: Toggle runtime

Here's an alternative that takes advantage of the fact that the deployment script will delete the env folder when it doesn't match the desired version of Python.  This will effectively delete the existing environment, and create a new one.

1. Switch to a different version of Python (via runtime.txt or the **Application Settings** blade in the Azure Portal)
1. git push some changes (ignore any pip install errors if any)
1. Switch back to initial version of Python
1. git push some changes again

### Option 3: Customize deployment script

If you've customized the deployment script, you can change the code in deploy.cmd to force it to delete the env folder.
