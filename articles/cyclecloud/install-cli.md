# CycleCloud CLI

In addition to the web interface, Azure CycleCloud can be controlled via the command line. CycleCloud's command-line interface (CLI) tool can be used to create, configure and manage clusters controlled by CycleCloud. It is highly recommended that you install these tools to make cluster management and configuration easier.

The CycleCloud CLI is distributed as a standard installable Python package for v2.4+.
It can be used on the same server that CycleCloud is installed on or on remote clients. The command line tools are a separate download, with pre-built binaries for Linux and Windows.

To begin, copy the CycleCloud binary to a location in your $PATH (for example, /usr/local/bin on Linux).

>[!Note]
>CLI credentials are stored like SSH keys. Ensure that your `~/.cycle` directory is locked down.

## Installing Command-Line Tools

The CycleCloud CLI is distributed as a Linux binary (cyclecloud-cli-|version|.linux64.tar.gz),
a Windows binary (cyclecloud-cli-|version|.win64.zip), and as source (cyclecloud-cli-|version|.tar.gz).
The binaries can be used once untarred. The source tarball can be installed just like any Python package.

### Using Pip

Using pip is the recommended way of installing the package, as it allows for easy upgrading and removal of Python packages:

    pip install cyclecloud-cli-|version|.tar.gz

### Using Easy_Install

Using easy_install is another easy way to install the CycleCloud CLI package along with all dependencies:

    easy_install cyclecloud-cli-|version|.tar.gz

If you have multiple versions of python installed, you can select which version to install on by using
version-specific pip or easy_install tools. For example, for python 2.6 you may have a pip installer with
the name ``pip-2.6`` or ``easy_install-2.6``.

### Using setup.py

If you do not have pip or easy_install configured on your system, you can also use the standard ``setup.py install`` method:

    tar -xzvf cyclecloud-cli-|version|.tar.gz

    cd cyclecloud-cli-|version|

    python setup.py install

## Install Permissions

If you get a 'permission denied' error when installing, you may need to run the install command with ``sudo`` since packages will be written to your system level Python install:

    $ sudo easy_install cyclecloud-cli-|version|.tar.gz

## Test the Install

To make sure that your CLI has been installed correctly, you can run the ``cyclecloud`` command with no options. You should receive a help message like the following::

    $ cyclecloud
    Usage: cyclecloud COMMAND [options]

    Options:
      -h, --help  show this help message and exit

    ...

If you see this, you have successfully installed the CycleCloud CLI tool.

# CLI Configuration

Before configuring the CycleCloud CLI, make sure that CycleCloud is running and accessible
from the machine you are installing on. If you installed CycleCloud on the same
machine you are installing the CLI tools on, you should be able to access ``http://localhost:8080``
using your web browser. If you installed CycleServer on a different machine, make sure you can access it via your web browser.

## Initialize the CLI

First, run the ``initialize`` command. This will ask you a few questions about how to connect to your
CycleServer instance. If this is your first time configuring CycleCloud, you must provide
some information about your Azure account. CycleCloud uses this information
to start compute clusters and to store data to Azure Storage:

    $ cyclecloud initialize
    Welcome to CycleCloud!
    CycleServer URL: [http://localhost:8080] http://10.0.1.31:8080
    CycleServer username: [admin] admin
    CycleServer password:

    Generating CycleCloud key...
    CycleCloud configuration stored in /home/demo/.cycle/config.ini
    CycleCloud connection information is configured properly.
    Wrote cluster template file '~/.cycle/condor_templates.txt'.
    Wrote cluster template file '~/.cycle/sge_templates.txt'.
    Wrote cluster template file '~/.cycle/starcluster.txt'.
    Access Key: **YOUR_ACCESS_KEY**
    Secret Key: **YOUR_SECRET_KEY**
    Default Region (Enter for default): us-east-1
    Container name to create (az://<account>/<container>): demo
    Azure account initialized and new credentials stored.

The first set of questions to answer are the URL pointing back to the CycleServer
instance you have set up. If you are installing the CLI tools on the same machine, the default of
``localhost`` should be sufficient. Next, you have to specify the user name and password
you created when setting up CycleServer for the first time.

Several example cluster templates will be written to the ``~/.cycle`` directory for future reference.

You will have to provide some information so that CycleCloud can access your Azure account.
If the ``ACCESS_KEY`` and ``SECRET_KEY`` environment variables are defined,
the CLI tools will ask to use them. If not, you must provide them. You will also
asked to provide a default region to use when starting clusters.

Finally, on first configuration you will be asked to give the name you wish to use for a container. This container will be used to store run-time configuration for your compute clusters. The container will be named 'az://[account]/[container]' where [container] is the value you specify. CycleCloud will only access this container, so if you need to limit access for security reasons this container is the only one that needs read/write permission.

Your configuration information is saved in your home directory at ``~/.cycle/config.ini``. If you need to reconfigure your account, you can edit or remove this file and re-run the initialize command. Alternately, you can rerun ``cyclecloud initialize`` with the ``--force`` option.

### Test Your Configuration

You can test your configuration by running the ``show_cluster`` command, which will return the details of all the clusters currently being managed by CycleCloud. If it is your first configuration, this list is likely to be empty. If you have configured the CLI tools correctly, the following command should not generate an error:

    $ cyclecloud show_cluster

Congratulations! Your CycleCloud CLI tools are installed and functioning.
