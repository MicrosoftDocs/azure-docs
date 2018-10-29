---
title: Script action development with Linux-based HDInsight - Azure 
description: 'Learn how to use Bash scripts to customize Linux-based HDInsight clusters. The script action feature of HDInsight allows you to run scripts during or after cluster creation. Scripts can be used to change cluster configuration settings or install additional software.'
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 04/10/2018
ms.author: jasonh

---
# Script action development with HDInsight

Learn how to customize your HDInsight cluster using Bash scripts. Script actions are a way to customize HDInsight during or after cluster creation.

> [!IMPORTANT]
> The steps in this document require an HDInsight cluster that uses Linux. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdinsight-windows-retirement).

## What are script actions

Script actions are Bash scripts that Azure runs on the cluster nodes to make configuration changes or install software. A script action is executed as root, and provides full access rights to the cluster nodes.

Script actions can be applied through the following methods:

| Use this method to apply a script... | During cluster creation... | On a running cluster... |
| --- |:---:|:---:|
| Azure portal |✓ |✓ |
| Azure PowerShell |✓ |✓ |
| Azure Classic CLI |&nbsp; |✓ |
| HDInsight .NET SDK |✓ |✓ |
| Azure Resource Manager Template |✓ |&nbsp; |

For more information on using these methods to apply script actions, see [Customize HDInsight clusters using script actions](hdinsight-hadoop-customize-cluster-linux.md).

## <a name="bestPracticeScripting"></a>Best practices for script development

When you develop a custom script for an HDInsight cluster, there are several best practices to keep in mind:

* [Target the Hadoop version](#bPS1)
* [Target the OS Version](#bps10)
* [Provide stable links to script resources](#bPS2)
* [Use pre-compiled resources](#bPS4)
* [Ensure that the cluster customization script is idempotent](#bPS3)
* [Ensure high availability of the cluster architecture](#bPS5)
* [Configure the custom components to use Azure Blob storage](#bPS6)
* [Write information to STDOUT and STDERR](#bPS7)
* [Save files as ASCII with LF line endings](#bps8)
* [Use retry logic to recover from transient errors](#bps9)

> [!IMPORTANT]
> Script actions must complete within 60 minutes or the process fails. During node provisioning, the script runs concurrently with other setup and configuration processes. Competition for resources such as CPU time or network bandwidth may cause the script to take longer to finish than it does in your development environment.

### <a name="bPS1"></a>Target the Hadoop version

Different versions of HDInsight have different versions of Hadoop services and components installed. If your script expects a specific version of a service or component, you should only use the script with the version of HDInsight that includes the required components. You can find information on component versions included with HDInsight using the [HDInsight component versioning](hdinsight-component-versioning.md) document.

### <a name="bps10"></a> Target the OS version

Linux-based HDInsight is based on the Ubuntu Linux distribution. Different versions of HDInsight rely on different versions of Ubuntu, which may change how your script behaves. For example, HDInsight 3.4 and earlier are based on Ubuntu versions that use Upstart. Versions 3.5 and greater are based on Ubuntu 16.04, which uses Systemd. Systemd and Upstart rely on different commands, so your script should be written to work with both.

Another important difference between HDInsight 3.4 and 3.5 is that `JAVA_HOME` now points to Java 8.

You can check the OS version by using `lsb_release`. The following code demonstrates how to determine if the script is running on Ubuntu 14 or 16:

```bash
OS_VERSION=$(lsb_release -sr)
if [[ $OS_VERSION == 14* ]]; then
    echo "OS verion is $OS_VERSION. Using hue-binaries-14-04."
    HUE_TARFILE=hue-binaries-14-04.tgz
elif [[ $OS_VERSION == 16* ]]; then
    echo "OS verion is $OS_VERSION. Using hue-binaries-16-04."
    HUE_TARFILE=hue-binaries-16-04.tgz
fi
...
if [[ $OS_VERSION == 16* ]]; then
    echo "Using systemd configuration"
    systemctl daemon-reload
    systemctl stop webwasb.service    
    systemctl start webwasb.service
else
    echo "Using upstart configuration"
    initctl reload-configuration
    stop webwasb
    start webwasb
fi
...
if [[ $OS_VERSION == 14* ]]; then
    export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64
elif [[ $OS_VERSION == 16* ]]; then
    export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
fi
```

You can find the full script that contains these snippets at https://hdiconfigactions.blob.core.windows.net/linuxhueconfigactionv02/install-hue-uber-v02.sh.

For the version of Ubuntu that is used by HDInsight, see the [HDInsight component version](hdinsight-component-versioning.md) document.

To understand the differences between Systemd and Upstart, see [Systemd for Upstart users](https://wiki.ubuntu.com/SystemdForUpstartUsers).

### <a name="bPS2"></a>Provide stable links to script resources

The script and associated resources must remain available throughout the lifetime of the cluster. These resources are required if new nodes are added to the cluster during scaling operations.

The best practice is to download and archive everything in an Azure Storage account on your subscription.

> [!IMPORTANT]
> The storage account used must be the default storage account for the cluster or a public, read-only container on any other storage account.

For example, the samples provided by Microsoft are stored in the [https://hdiconfigactions.blob.core.windows.net/](https://hdiconfigactions.blob.core.windows.net/) storage account. This location is a public, read-only container maintained by the HDInsight team.

### <a name="bPS4"></a>Use pre-compiled resources

To reduce the time it takes to run the script, avoid operations that compile resources from source code. For example, pre-compile resources and store them in an Azure Storage account blob in the same data center as HDInsight.

### <a name="bPS3"></a>Ensure that the cluster customization script is idempotent

Scripts must be idempotent. If the script runs multiple times, it should return the cluster to the same state every time.

For example, a script that modifies configuration files should not add duplicate entries if ran multiple times.

### <a name="bPS5"></a>Ensure high availability of the cluster architecture

Linux-based HDInsight clusters provide two head nodes that are active within the cluster, and script actions run on both nodes. If the components you install expect only one head node, do not install the components on both head nodes.

> [!IMPORTANT]
> Services provided as part of HDInsight are designed to fail over between the two head nodes as needed. This functionality is not extended to custom components installed through script actions. If you need high availability for custom components, you must implement your own failover mechanism.

### <a name="bPS6"></a>Configure the custom components to use Azure Blob storage

Components that you install on the cluster might have a default configuration that uses Hadoop Distributed File System (HDFS) storage. HDInsight uses either Azure Storage or Data Lake Store as the default storage. Both provide an HDFS compatible file system that persists data even if the cluster is deleted. You may need to configure components you install to use WASB or ADL instead of HDFS.

For most operations, you do not need to specify the file system. For example, the following copies the giraph-examples.jar file from the local file system to cluster storage:

```bash
hdfs dfs -put /usr/hdp/current/giraph/giraph-examples.jar /example/jars/
```

In this example, the `hdfs` command transparently uses the default cluster storage. For some operations, you may need to specify the URI. For example, `adl:///example/jars` for Data Lake Store or `wasb:///example/jars` for Azure Storage.

### <a name="bPS7"></a>Write information to STDOUT and STDERR

HDInsight logs script output that is written to STDOUT and STDERR. You can view this information using the Ambari web UI.

> [!NOTE]
> Ambari is only available if the cluster is successfully created. If you use a script action during cluster creation, and creation fails, see the troubleshooting section [Customize HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md#troubleshooting) for other ways of accessing logged information.

Most utilities and installation packages already write information to STDOUT and STDERR, however you may want to add additional logging. To send text to STDOUT, use `echo`. For example:

```bash
echo "Getting ready to install Foo"
```

By default, `echo` sends the string to STDOUT. To direct it to STDERR, add `>&2` before `echo`. For example:

```bash
>&2 echo "An error occurred installing Foo"
```

This redirects information written to STDOUT to STDERR (2) instead. For more information on IO redirection, see [http://www.tldp.org/LDP/abs/html/io-redirection.html](http://www.tldp.org/LDP/abs/html/io-redirection.html).

For more information on viewing information logged by script actions, see [Customize HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md#troubleshooting)

### <a name="bps8"></a> Save files as ASCII with LF line endings

Bash scripts should be stored as ASCII format, with lines terminated by LF. Files that are stored as UTF-8, or use CRLF as the line ending may fail with the following error:

```
$'\r': command not found
line 1: #!/usr/bin/env: No such file or directory
```

### <a name="bps9"></a> Use retry logic to recover from transient errors

When downloading files, installing packages using apt-get, or other actions that transmit data over the internet, the action may fail due to transient networking errors. For example, the remote resource you are communicating with may be in the process of failing over to a backup node.

To make your script resilient to transient errors, you can implement retry logic. The following function demonstrates how to implement retry logic. It retries the operation three times before failing.

```bash
#retry
MAXATTEMPTS=3

retry() {
    local -r CMD="$@"
    local -i ATTMEPTNUM=1
    local -i RETRYINTERVAL=2

    until $CMD
    do
        if (( ATTMEPTNUM == MAXATTEMPTS ))
        then
                echo "Attempt $ATTMEPTNUM failed. no more attempts left."
                return 1
        else
                echo "Attempt $ATTMEPTNUM failed! Retrying in $RETRYINTERVAL seconds..."
                sleep $(( RETRYINTERVAL ))
                ATTMEPTNUM=$ATTMEPTNUM+1
        fi
    done
}
```

The following examples demonstrate how to use this function.

```bash
retry ls -ltr foo

retry wget -O ./tmpfile.sh https://hdiconfigactions.blob.core.windows.net/linuxhueconfigactionv02/install-hue-uber-v02.sh
```

## <a name="helpermethods"></a>Helper methods for custom scripts

Script action helper methods are utilities that you can use while writing custom scripts. These methods are contained in the[https://hdiconfigactions.blob.core.windows.net/linuxconfigactionmodulev01/HDInsightUtilities-v01.sh](https://hdiconfigactions.blob.core.windows.net/linuxconfigactionmodulev01/HDInsightUtilities-v01.sh) script. Use the following to download and use them as part of your script:

```bash
# Import the helper method module.
wget -O /tmp/HDInsightUtilities-v01.sh -q https://hdiconfigactions.blob.core.windows.net/linuxconfigactionmodulev01/HDInsightUtilities-v01.sh && source /tmp/HDInsightUtilities-v01.sh && rm -f /tmp/HDInsightUtilities-v01.sh
```

The following helpers available for use in your script:

| Helper usage | Description |
| --- | --- |
| `download_file SOURCEURL DESTFILEPATH [OVERWRITE]` |Downloads a file from the source URI to the specified file path. By default, it does not overwrite an existing file. |
| `untar_file TARFILE DESTDIR` |Extracts a tar file (using `-xf`) to the destination directory. |
| `test_is_headnode` |If ran on a cluster head node, return 1; otherwise, 0. |
| `test_is_datanode` |If the current node is a data (worker) node, return a 1; otherwise, 0. |
| `test_is_first_datanode` |If the current node is the first data (worker) node (named workernode0) return a 1; otherwise, 0. |
| `get_headnodes` |Return the fully qualified domain name of the headnodes in the cluster. Names are comma delimited. An empty string is returned on error. |
| `get_primary_headnode` |Gets the fully qualified domain name of the primary headnode. An empty string is returned on error. |
| `get_secondary_headnode` |Gets the fully qualified domain name of the secondary headnode. An empty string is returned on error. |
| `get_primary_headnode_number` |Gets the numeric suffix of the primary headnode. An empty string is returned on error. |
| `get_secondary_headnode_number` |Gets the numeric suffix of the secondary headnode. An empty string is returned on error. |

## <a name="commonusage"></a>Common usage patterns

This section provides guidance on implementing some of the common usage patterns that you might run into while writing your own custom script.

### Passing parameters to a script

In some cases, your script may require parameters. For example, you may need the admin password for the cluster when using the Ambari REST API.

Parameters passed to the script are known as *positional parameters*, and are assigned to `$1` for the first parameter, `$2` for the second, and so-on. `$0` contains the name of the script itself.

Values passed to the script as parameters should be enclosed by single quotes ('). Doing so ensures that the passed value is treated as a literal.

### Setting environment variables

Setting an environment variable is performed by the following statement:

    VARIABLENAME=value

Where VARIABLENAME is the name of the variable. To access the variable, use `$VARIABLENAME`. For example, to assign a value provided by a positional parameter as an environment variable named PASSWORD, you would use the following statement:

    PASSWORD=$1

Subsequent access to the information could then use `$PASSWORD`.

Environment variables set within the script only exist within the scope of the script. In some cases, you may need to add system-wide environment variables that will persist after the script has finished. To add system-wide environment variables, add the variable to `/etc/environment`. For example, the following statement adds `HADOOP_CONF_DIR`:

```bash
echo "HADOOP_CONF_DIR=/etc/hadoop/conf" | sudo tee -a /etc/environment
```

### Access to locations where the custom scripts are stored

Scripts used to customize a cluster needs to be stored in one of the following locations:

* An __Azure Storage account__ that is associated with the cluster.

* An __additional storage account__ associated with the cluster.

* A __publicly readable URI__. For example, a URL to data stored on OneDrive, Dropbox, or other file hosting service.

* An __Azure Data Lake Store account__ that is associated with the HDInsight cluster. For more information on using Azure Data Lake Store with HDInsight, see [Quickstart: Set up clusters in HDInsight](../storage/data-lake-storage/quickstart-create-connect-hdi-cluster.md).

    > [!NOTE]
    > The service principal HDInsight uses to access Data Lake Store must have read access to the script.

Resources used by the script must also be publicly available.

Storing the files in an Azure Storage account or Azure Data Lake Store provides fast access, as both within the Azure network.

> [!NOTE]
> The URI format used to reference the script differs depending on the service being used. For storage accounts associated with the HDInsight cluster, use `wasb://` or `wasbs://`. For publicly readable URIs, use `http://` or `https://`. For Data Lake Store, use `adl://`.

### Checking the operating system version

Different versions of HDInsight rely on specific versions of Ubuntu. There may be differences between OS versions that you must check for in your script. For example, you may need to install a binary that is tied to the version of Ubuntu.

To check the OS version, use `lsb_release`. For example, the following script demonstrates how to reference a specific tar file depending on the OS version:

```bash
OS_VERSION=$(lsb_release -sr)
if [[ $OS_VERSION == 14* ]]; then
    echo "OS verion is $OS_VERSION. Using hue-binaries-14-04."
    HUE_TARFILE=hue-binaries-14-04.tgz
elif [[ $OS_VERSION == 16* ]]; then
    echo "OS verion is $OS_VERSION. Using hue-binaries-16-04."
    HUE_TARFILE=hue-binaries-16-04.tgz
fi
```

## <a name="deployScript"></a>Checklist for deploying a script action

Here are the steps take when preparing to deploy a script:

* Put the files that contain the custom scripts in a place that is accessible by the cluster nodes during deployment. For example, the default storage for the cluster. Files can also be stored in publicly readable hosting services.
* Verify that the script is idempotent. Doing so allows the script to be executed multiple times on the same node.
* Use a temporary file directory /tmp to keep the downloaded files used by the scripts and then clean them up after scripts have executed.
* If OS-level settings or Hadoop service configuration files are changed, you may want to restart HDInsight services.

## <a name="runScriptAction"></a>How to run a script action

You can use script actions to customize HDInsight clusters using the following methods:

* Azure portal
* Azure PowerShell
* Azure Resource Manager templates
* The HDInsight .NET SDK.

For more information on using each method, see [How to use script action](hdinsight-hadoop-customize-cluster-linux.md).

## <a name="sampleScripts"></a>Custom script samples

Microsoft provides sample scripts to install components on an HDInsight cluster. See the following links for more example script actions.

* [Install and use Hue on HDInsight clusters](hdinsight-hadoop-hue-linux.md)
* [Install and use Solr on HDInsight clusters](hdinsight-hadoop-solr-install-linux.md)
* [Install and use Giraph on HDInsight clusters](hdinsight-hadoop-giraph-install-linux.md)
* [Install or upgrade Mono on HDInsight clusters](hdinsight-hadoop-install-mono.md)

## Troubleshooting

The following are errors you may encounter when using scripts you have developed:

**Error**: `$'\r': command not found`. Sometimes followed by `syntax error: unexpected end of file`.

*Cause*: This error is caused when the lines in a script end with CRLF. Unix systems expect only LF as the line ending.

This problem most often occurs when the script is authored on a Windows environment, as CRLF is a common line ending for many text editors on Windows.

*Resolution*: If it is an option in your text editor, select Unix format or LF for the line ending. You may also use the following commands on a Unix system to change the CRLF to an LF:

> [!NOTE]
> The following commands are roughly equivalent in that they should change the CRLF line endings to LF. Select one based on the utilities available on your system.

| Command | Notes |
| --- | --- |
| `unix2dos -b INFILE` |The original file is backed up with a .BAK extension |
| `tr -d '\r' < INFILE > OUTFILE` |OUTFILE contains a version with only LF endings |
| `perl -pi -e 's/\r\n/\n/g' INFILE` | Modifies the file directly |
| ```sed 's/$'"/`echo \\\r`/" INFILE > OUTFILE``` |OUTFILE contains a version with only LF endings. |

**Error**: `line 1: #!/usr/bin/env: No such file or directory`.

*Cause*: This error occurs when the script was saved as UTF-8 with a Byte Order Mark (BOM).

*Resolution*: Save the file either as ASCII, or as UTF-8 without a BOM. You may also use the following command on a Linux or Unix system to create a file without the BOM:

    awk 'NR==1{sub(/^\xef\xbb\xbf/,"")}{print}' INFILE > OUTFILE

Replace `INFILE` with the file containing the BOM. `OUTFILE` should be a new file name, which contains the script without the BOM.

## <a name="seeAlso"></a>Next steps

* Learn how to [Customize HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md)
* Use the [HDInsight .NET SDK reference](https://docs.microsoft.com/dotnet/api/overview/azure/hdinsight) to learn more about creating .NET applications that manage HDInsight
* Use the [HDInsight REST API](https://msdn.microsoft.com/library/azure/mt622197.aspx) to learn how to use REST to perform management actions on HDInsight clusters.
