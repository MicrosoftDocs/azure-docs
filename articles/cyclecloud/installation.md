# Installing CycleCloud

## A Note on Names

It is worth noting that the names CycleCloud and CycleServer are sometimes used interchangeably, but this
confuses the distinction between them. CycleServer is the platform that underlies CycleCloud.
It handles data storage, plugin management, logging, monitoring, and alerting among other functions. CycleCloud is a plugin to CycleServer, which manages the creation of clusters across multiple cloud providers. While CycleCloud is the official name of the product,
you will find CycleServer referenced in many commands and directory names.

## Installation

To begin the installation, unpack the CycleCloud installation to a temporary working directory.
On Windows, this must be a local disk.

From the local directory, run `install.sh` (on Linux) or `install.cmd` (on Windows)
to begin the installation process. On Linux, the default install location is /opt/cycle_server.
On Windows, only C:\Program Files\CycleServer is currently supported.

On Linux systems, the install.sh script supports several options for customization:

Option | Definition
------ | ----------
``--batch``| Install without any prompts
``--installdir`` | Install to a directory other than /opt/cycle_server
``--force``      | Install to the specified directory even if it is not empty
``--nostart``    | Do not start the processes after the installation is complete

> [!NOTE]
>You must have write permission to the /opt directory. The CycleCloud installer will create a cycle_server user and unix group, install into the /opt/cycle_server directory by default, and assign cycle_server:cycle_server ownership to the directory.

Once the installer has finished running, you will be provided a link to complete the installation
from your browser. Copy the link provided into your web browser. Further configuration is discussed in the Configuration section.

### Notes on Security

The default installation of CycleCloud uses non-encrypted HTTP running on port 8080. We strongly recommend configuring SSL for all installations.

Do not install CycleCloud on a shared drive, or any drive in which non-admin users have access. For Linux installations, anyone with access to the CycleCloud group will gain access to unencrypted data. We recommend that non-admin users not be added to this group.

## Upgrading CycleCloud

To upgrade an existing CycleCloud installation, save the install bundle to the server’s local drive. The upgrade script will unpack the bundle and install the new package. On Linux, the upgrade script is ``$CS_HOME/util/upgrade.sh``. On Windows, the upgrade script is ``C:\Program Files\CycleServer\util\upgrade.cmd``. Both scripts take the path to the install bundle as an argument. For example:

  ``/opt/cycle_server/util/upgrade.sh /tmp/cyclecloud-6.6.0.tar.gz``

To upgrade the cyclecloud command line tool, copy the new binary over the old. In most cases, upgrades within a release series (e.g. 5.x) do not typically require CLI upgrades.

> [!NOTE]
>As of version 6.6.0, Java Runtime Environment is no longer packaged in the installation. JRE version 8 or higher is required.


## Installing Multiple Instances of CycleCloud on the Same Machine

> [!NOTE]
> This section is applicable to Linux installations only.

Running multiple instances of CycleCloud on the same machine is supported, but requires some slight
modifications to the configuration files before starting CycleCloud for the first time.
During the install step, make sure to use the ``--nostart`` flag to keep the server from starting,
and the ``--installdir`` flag to specify an alternate install directory. For example:

  ``./install.sh --nostart --installdir /mnt/second_cycle_server``

After the installer finishes, edit ``$CS_HOME/config/cycle_server.properties`` and change the
following port numbers to an unused port (incrementing each default port number by one usually works well):

```cyclecloud_installation-interactive
commandPort=6400

webServerPort=8080

webServerSslPort=8443

tomcat.shutdownPort=8007

brokerPort=5672

brokerJmxPort=9099

url=jdbc:derby://localhost:1527/cycle_server
```

Next, edit ``$CS_HOME/data/derby.properties`` and modify ``derby.drda.portNumber``
so that it matches the port specified in the ``url=`` line of cycle_server.properties

Finally, copy /etc/init.d/cycle_server to a new file and edit the CS_HOME path
to point to the new CycleServer install, then start CycleServer using the new init script.

# Configuration

After CycleCloud is installed, it is configured through your web browser. The login screen will load after the webserver has fully initialized, which can take several minutes.

## Initial Setup

Step 1: Welcome

![Welcome Screen](~/images/setup-step1.png)

Enter a Site Name, your CycleComputing Account ID, and Password, then click **Next**.

Step 2: License Agreement

![License Agreement](~/images/setup-step2.png)

Accept the license agreement and click **Next**.

Step 3: Administrator Account

![Administrator Account setup](~/images/setup-step3.png)

At this step in the process, you will set up the local administrator account for CycleCloud. This
account is used to administer the CycleCloud application - it is NOT an operating system account.
Enter a user ID and password, then click **Done** to continue. For the remainder of this guide, we assume
the account's user ID is "admin".

> [!NOTE]
> All CycleCloud account passwords must be between 8 and 123 characters long, and meet at least 3 of the following 4 conditions:

* Contain at least one upper case letter
* Contain at least one lower case letter
* Contain at least one number
* Contain at least one special character: @ # $ % ^ & * - _ ! + = [ ] { } | \ : ' , . ?

## Licensing

CycleCloud will check for existing licenses using the Cycle Computing Portal credentials you
provided in Step 1. If a license is found for the internally-generated Node ID of your
installation, the license will be installed automatically. If a license has not been assigned
to this instance, you will be presented with a list of your available licenses. Click **Claim**
to select the desired license and it will be installed automatically.

If there are no available licenses associated with your Cycle Computing Portal credentials, please
contact your sales representative. If you need to manually enter a license (for example, if your
CycleCloud installation is in an air-gapped environment), your sales representative will send an
email with a license. Copy the license string from the email and paste
it into the form. Click **Install License** to continue.

![Enter License screen](~/images/setup-license.png)

You will see confirmation that the license has been successfully installed.
