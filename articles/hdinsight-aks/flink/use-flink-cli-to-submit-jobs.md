---
title: How to use Apache Flink CLI to submit jobs
description: Learn how to use Apache Flink CLI to submit jobs
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Apache Flink Command-Line Interface (CLI)

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Apache Flink provides a CLI (Command Line Interface) **bin/flink** to run jobs (programs) that are packaged as JAR files and to control their execution. The CLI is part of the Flink setup and can be set up on a single-node VM. It connects to the running JobManager specified in **conf/flink-conf.yaml**.

## Installation Steps

To install Flink CLI on Linux, you need a **Linux VM** to execute the installation script. You need to run a bash environment if you are on **Windows**. 

> [!NOTE]
> This does NOT work on Windows **GIT BASH**, you need to install [WSL](/windows/wsl/install) to make this work on Windows. 

### Requirements
* Install JRE 11.  If not installed, follow the steps described in `/java/openjdk/download`.
* Add java to PATH or define JAVA_HOME environment variable pointing to JRE installation directory, such that `$JAVA_HOME/bin/java` exists.

### Install or update

Both installing and updating the CLI require rerunning the install script. Install the CLI by running curl.

```bash
curl -L https://aka.ms/hdionaksflinkcliinstalllinux | bash
```

This command installs Flink CLI in the user's home directory (`$HOME/flink-cli`). The script can also be downloaded and run locally. You may have to restart your shell in order for changes to take effect.

## Run an Apache Flink command to test

   ```bash
   cd $HOME/flink-cli 

   bin/flink list -D azure.tenant.id=<update-tenant-id> -D rest.address=<flink-cluster-fqdn>
   ```
   > [!NOTE]
   > If executing via SSH pod, use the command ```bin/flink list``` to give you the complete output.

   If you don't want to add those parameters every time, add them to **conf/flink-conf.yaml**.
   
   ```bash
   rest.address: <flink-cluster-fqdn>
   azure.tenant.id: <tenant-id>
   ```
   Now the command becomes
   
   ```bash
   bin/flink list
   ```

   You should see output like the following:

   ```output
   To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code E4LW35GFD to authenticate.
   ```

   Open [https://microsoft.com/devicelogin](https://microsoft.com/devicelogin) in your browser, and enter the code, then use your microsoft.com ID to log in. After successful login, you should see output like the following if no job is running.
   
   ```output
   Waiting for response...
   No running jobs.
   No scheduled jobs.
   ```

#### curl `Object Moved` error

If you get an error from curl related to the -L parameter, or an error message including the text "Object Moved", try using the full URL instead of the aka.ms redirect:

```bash
curl https://hdiconfigactions.blob.core.windows.net/hiloflinkblob/install.sh | bash
```

## Examples
Here are some examples of actions supported by Flink’s CLI tool:

| Action | Purpose |
|-|-|
| run | This action executes jobs. It requires at least the jar containing the job. Flink- or job-related arguments can be passed if necessary. |
| info | This action can be used to print an optimized execution graph of the passed job. Again, the jar containing the job needs to be passed. |
| list | This action *lists all running or scheduled jobs*.|
| savepoint | This action can be used to *create or disposing savepoints* for a given job. It may be necessary to specify a savepoint directory besides the JobID. |
| cancel | This action can be used to *cancel running jobs* based on their JobID. |
| stop | This action combines the *cancel and savepoint actions to stop* a running job but also creates a savepoint to start from again. |

All actions and their parameters can be accessed through the following commands: 

```bash
bin/flink --help
```

The usage information of each individual action 

```bash
bin/flink <action> --help
```

> [!TIP]
> * If you have a Proxy blocking the connection: In order to get the installation scripts, your proxy needs to allow HTTPS connections to the following addresses: `https://aka.ms/` and `https://hdiconfigactions.blob.core.windows.net`
> * To resolve the issue, add the user or group to the [authorization profile](../hdinsight-on-aks-manage-authorization-profile.md).
