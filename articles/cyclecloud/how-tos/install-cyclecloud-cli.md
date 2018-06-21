# How to Install the Azure CycleCloud CLI #

The Azure CycleCloud Command-Line Interface (CLI) provides console access to the CycleCloud application.  It makes all of the functions available via the GUI available from the command line.   It can be used to control CycleCloud and CycleCloud Clusters directly or via script.


## Pre-Requisites ##

The CycleCloud CLI requires an existing installation of Python 2.7.  Most Linux and Mac systems already have a valid python 2.7 installation.   For Windows, follow these instructions to install Python: [Installing Python for Windows](http://docs.python-guide.org/en/latest/starting/install/win/).


## Getting the CycleCloud CLI Installer ##

The CLI installer is distributed in as part of the the CycleCloud installation package.  It can be found in the `cycle_server/cli/` sub-directory within the CycleCloud installation package.   After installing CycleCloud, the CLI installer is also available in the `cli/` sub-directory of the CycleCloud installation directory.

The installer is distributed as a zip file with a name like `cyclecloud-cli.zip`.


## Installing the CycleCloud CLI in Linux ##

Extract the contents of `cyclecloud-cli.zip` to a temporary directory.

    cd /tmp
    unzip /opt/cycle_server/cli/cyclecloud-cli.zip

This will create a sub-directory named `cyclecloud-cli-installer-<VERSION>`.  To complete the installation, run the `install.sh` script within the `cyclecloud-cli-installer-<VERSION>` directory.

    cd /tmp/cyclecloud-cli-installer*
    ./install.sh

The CycleCloud CLI will be installed to `${HOME}/bin`.   Optionally, after installing the CLI, add the `${HOME}/bin` directory to the PATH environment variable in your profile.


## Installing the CycleCloud CLI in Windows ##

In Windows Explorer, copy the CLI installer zip file to a temporary directory such as your `Downloads` directory or `$env:TMP`.   Right click on the copy of `cyclecloud-cli.zip` and select **"Extract All"**.  This will create a sub-folder named `cyclecloud-cli-installer-<VERSION>`.

Inside the `cyclecloud-cli-installer-<VERSION>` sub-folder, you will find a PowerShell script named `install.ps1`.   Double-click on the `install.ps1` script to complete the CLI installation.

The CycleCloud CLI should now be available in the system PATH for new PowerShell or Command Prompt sessions.
