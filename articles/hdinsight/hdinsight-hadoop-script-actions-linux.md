<properties
    pageTitle="Script action development with Linux-based HDInsight | Microsoft Azure"
    description="Learn how to customize Linux-based HDInsight clusters with Script Action."
    services="hdinsight"
    documentationCenter=""
    authors="Blackmist"
    manager="paulettm"
    editor="cgronlun"/>

<tags
    ms.service="hdinsight"
    ms.workload="big-data"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="07/05/2016"
    ms.author="larryfr"/>

# Script action development with HDInsight

Script actions are a way to customize Azure HDInsight clusters by specifying cluster configuration settings or installing additional services, tools, or other software on the cluster. You can use script actions during cluster creation or on a running cluster.

> [AZURE.NOTE] The information in this document is specific to Linux-based HDInsight clusters. For information on using script actions with Windows-based clusters, see [Script action development with HDInsight (Windows)](hdinsight-hadoop-script-actions.md).

## What are script actions?

Script actions are Bash scripts that Azure runs on the cluster nodes to make configuration changes or install software. A script action is executed as root, and provides full access rights to the cluster nodes.

Script actions can be applied through the following methods:

| Use this to apply a script... | During cluster creation... | On a running cluster... |
| ----- |:-----:|:-----:|
| Azure Portal | ✓ | ✓ |
| Azure PowerShell | ✓ | ✓ |
| Azure CLI | &nbsp; | ✓ |
| HDInsight .NET SDK | ✓ | ✓ |
| Azure Resource Manager Template | ✓ | &nbsp; |

For more information on using these methods to apply script actions, see [Customize HDInsight clusters using script actions](hdinsight-hadoop-customize-cluster-linux.md).

## <a name="bestPracticeScripting"></a>Best practices for script development

When you develop a custom script for an HDInsight cluster, there are several best practices to keep in mind:

- [Target the Hadoop version](#bPS1)
- [Provide stable links to script resources](#bPS2)
- [Use pre-compiled resources](#bPS4)
- [Ensure that the cluster customization script is idempotent](#bPS3)
- [Ensure high availability of the cluster architecture](#bPS5)
- [Configure the custom components to use Azure Blob storage](#bPS6)
- [Write information to STDOUT and STDERR](#bPS7)
- [Save files as ASCII with LF line endings](#bps8)
- [Use retry logic to recover from transient errors](#bps9)

> [AZURE.IMPORTANT] Script actions must complete within 60 minutes, or they will timeout. During node provisioning, the script is ran concurrently with other setup and configuration processes. Competition for resources such as CPU time or network bandwidth may cause the script to take longer to finish than it does in your development environment.

### <a name="bPS1"></a>Target the Hadoop version

Different versions of HDInsight have different versions of Hadoop services and components installed. If your script expects a specific version of a service or component, you should only use the script with the version of HDInsight that includes the required components. You can find information on component versions included with HDInsight using the [HDInsight component versioning](hdinsight-component-versioning.md) document.

### <a name="bPS2"></a>Provide stable links to script resources

You should make sure that the scripts and resources used by the script remain available throughout the lifetime of the cluster, and that the versions of these files do not change for the duration. These resources are required if new nodes are added to the cluster during scaling operations.

The best practice is to download and archive everything in an Azure Storage account on your subscription.

> [AZURE.IMPORTANT] The storage account used must be the default storage account for the cluster or a public, read-only container on any other storage account.

For example, the samples provided by Microsoft are stored in the [https://hdiconfigactions.blob.core.windows.net/](https://hdiconfigactions.blob.core.windows.net/) storage account, which is a public, read-only container maintained by the HDInsight team.

### <a name="bPS4"></a>Use pre-compiled resources

To reduce the time it takes to run the script, avoid operations that compile resources from source code. Instead, pre-compile the resources and store the binary version in Azure Blob storage so that it can quickly be downloaded to the cluster from your script.

### <a name="bPS3"></a>Ensure that the cluster customization script is idempotent

Scripts must be designed to be idempotent in the sense that if the script is ran multiple times, it should ensure that the cluster is returned to the same state every time it is ran.

For example, if a custom script installs an application at /usr/local/bin on its first run, then on each subsequent run the script should check whether the application already exists at the /usr/local/bin location before proceeding with other steps in the script.

### <a name="bPS5"></a>Ensure high availability of the cluster architecture

Linux-based HDInsight clusters provides two head nodes that are active within the cluster, and script actions are ran for both nodes. If the components you install expect only one head node, you must design a script that will only install the component on one of the two head nodes in the cluster.

> [AZURE.IMPORTANT] Default services installed as part of HDInsight are designed to fail over between the two head nodes as needed, however this functionality is not extended to custom components installed through script ctions. If you need the components installed through a script action to be highly available, you must implement your own failover mechanism that uses the two available head nodes.

### <a name="bPS6"></a>Configure the custom components to use Azure Blob storage

Components that you install on the cluster might have a default configuration that uses Hadoop Distributed File System (HDFS) storage. HDInsight uses Azure Blob Storage (WASB) as the default storage. This provides an HDFS compatible file system that persists data even if the cluster is deleted. You should configure components you install to use WASB instead of HDFS.

For example, the following copies the giraph-examples.jar file from the local file system to WASB:

    hadoop fs -copyFromLocal /usr/hdp/current/giraph/giraph-examples.jar /example/jars/

### <a name="bPS7"></a>Write information to STDOUT and STDERR

Information written to STDOUT and STDERR during script execution is logged, and can be viewed using the Ambari web UI.

> [AZURE.NOTE] Ambari will only be available if the cluster is successfully created. If you use a script action during cluster creation, and creation fails, see the troubleshooting section [Customize HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md#troubleshooting) for other ways of accessing logged information.

Most utilities and installation packages will already write information to STDOUT and STDERR, however you may want to add additional logging. To send text to STDOUT use `echo`. For example:

        echo "Getting ready to install Foo"

By default, `echo` will send the string to STDOUT. To direct it to STDERR, add `>&2` before `echo`. For example:

        >&2 echo "An error occurred installing Foo"

This redirects information sent to STDOUT (1, which is default so not listed here,) to STDERR (2). For more information on IO redirection, see [http://www.tldp.org/LDP/abs/html/io-redirection.html](http://www.tldp.org/LDP/abs/html/io-redirection.html).

For more information on viewing information logged by script actions, see [Customize HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md#troubleshooting)

###<a name="bps8"></a> Save files as ASCII with LF line endings

Bash scripts should be stored as ASCII format, with lines terminated by LF. If files are stored as UTF-8, which may include a Byte Order Mark at the beginning of the file, or with line endings of CRLF, which is common for Windows editors, then the script will fail with errors similar to the following:

    $'\r': command not found
    line 1: #!/usr/bin/env: No such file or directory

###<a name="bps9"></a> Use retry logic to recover from transient errors

When downloading files, installing packages using apt-get, or other actions that transmit data over the internet, the action may fail due to transient networking errors. For example, the remote resource you are communicating with may be in the process of failing over to a backup node.

To make your script resilient to transient errors, you can implement retry logic. The following is an example of a function that will run any command passed to it and (if the command fails,) retry up to three times. It will wait two seconds between each retry.

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

The following are examples of using this function.

    retry ls -ltr foo

    retry wget -O ./tmpfile.sh https://hdiconfigactions.blob.core.windows.net/linuxhueconfigactionv02/install-hue-uber-v02.sh

## <a name="helpermethods"></a>Helper methods for custom scripts

script action helper methods are utilities that you can use while writing custom scripts. These are defined in [https://hdiconfigactions.blob.core.windows.net/linuxconfigactionmodulev01/HDInsightUtilities-v01.sh](https://hdiconfigactions.blob.core.windows.net/linuxconfigactionmodulev01/HDInsightUtilities-v01.sh), and can be included in your scripts using the following:

    # Import the helper method module.
    wget -O /tmp/HDInsightUtilities-v01.sh -q https://hdiconfigactions.blob.core.windows.net/linuxconfigactionmodulev01/HDInsightUtilities-v01.sh && source /tmp/HDInsightUtilities-v01.sh && rm -f /tmp/HDInsightUtilities-v01.sh

This makes the following helpers available for use in your script:

| Helper usage | Description |
| ------------ | ----------- |
| `download_file SOURCEURL DESTFILEPATH [OVERWRITE]` | Downloads a file from the source URL to the specified file path. By default, it will not overwrite an existing file. |
| `untar_file TARFILE DESTDIR` | Extracts a tar file (using `-xf`,) to the destination directory. |
| `test_is_headnode` | If ran on a cluster head node, returns 1; otherwise, 0. |
| `test_is_datanode` | If the current node is a data (worker) node, returns a 1; otherwise, 0. |
| `test_is_first_datanode` | If the current node is the first data (worker) node (named workernode0,) returns a 1; otherwise, 0. |

## <a name="commonusage"></a>Common usage patterns

This section provides guidance on implementing some of the common usage patterns that you might run into while writing your own custom script.

### Passing parameters to a script

In some cases, your script may require parameters. For example, you may need the admin password for the cluster in order to retrieve information from the Ambari REST API.

Parameters passed to the script are known as _positional parameters_, and are assigned to `$1` for the first parameter, `$2` for the second, and so-on. `$0` contains the name of the script itself.

Values passed to the script as parameters should be enclosed by single quotes (') so that the passed value is treated as a literal, and special treatment isn't given to included characters such as '!'.

### Setting environment variables

Setting an environment variable is performed by the following:

    VARIABLENAME=value

Where VARIABLENAME is the name of the variable. To access the variable after this, use `$VARIABLENAME`. For example, to assign a value provided by a positional parameter as an environment variable named PASSWORD, you would use the following:

    PASSWORD=$1

Subsequent access to the information could then use `$PASSWORD`.

Environment variables set within the script only exist within the scope of the script. In some cases, you may need to add system wide environment variables that will persist after the script has finished. Usually this is so that users connecting to the cluster via SSH can use the components installed by your script. You can accomplish this by adding the environment variable to `/etc/environment`. For example, the following adds __HADOOP\_CONF\_DIR__:

    echo "HADOOP_CONF_DIR=/etc/hadoop/conf" | sudo tee -a /etc/environment

### Access to locations where the custom scripts are stored

Scripts used to customize a cluster needs to either be in the default storage account for the cluster or, if on another storage account, in a public read-only container. If your script accesses resources located elsewhere these also need to be in a publicly accessible (at least public read-only). For instance you might want to download a file to the cluster using `download_file`.

Storing the file in an Azure storage account accessible by the cluster (such as the default storage account,) will provide fast access, as this storage is within the Azure network.

## <a name="deployScript"></a>Checklist for deploying a script action

Here are the steps we took when preparing to deploy these scripts:

- Put the files that contain the custom scripts in a place that is accessible by the cluster nodes during deployment. This can be any of the default or additional Storage accounts specified at the time of cluster deployment, or any other publicly accessible storage container.

- Add checks into scripts to make sure that they execute impotently, so that the script can be executed multiple times on the same node.

- Use a temporary file directory /tmp to keep the downloaded files used by the scripts and then clean them up after scripts have executed.

- In the event that OS-level settings or Hadoop service configuration files were changed, you may want to restart HDInsight services so that they can pick up any OS-level settings, such as the environment variables set in the scripts.

## <a name="runScriptAction"></a>How to run a script action

You can use script actions to customize HDInsight clusters by using the Azure portal, Azure PowerShell, Azure Resource Manager (ARM) templates or the HDInsight .NET SDK. For instructions, see [How to use script action](hdinsight-hadoop-customize-cluster-linux.md).

## <a name="sampleScripts"></a>Custom script samples

Microsoft provides sample scripts to install components on an HDInsight cluster. The sample scripts and instructions on how to use them are available at the links below:

- [Install and use Hue on HDInsight clusters](hdinsight-hadoop-hue-linux.md)
- [Install and use R on HDInsight Hadoop clusters](hdinsight-hadoop-r-scripts-linux.md)
- [Install and use Solr on HDInsight clusters](hdinsight-hadoop-solr-install-linux.md)
- [Install and use Giraph on HDInsight clusters](hdinsight-hadoop-giraph-install-linux.md)  

> [AZURE.NOTE] The documents linked above are specific to Linux-based HDInsight clusters. For a scripts that work with Windows-based HDInsight, see [Script action development with HDInsight (Windows)](hdinsight-hadoop-script-actions.md) or use the links available at the top of each article.

##Troubleshooting

The following are errors you may encounter when using scripts you have developed:

__Error__: `$'\r': command not found`. Sometimes followed by `syntax error: unexpected end of file`.

_Cause_: This error is caused when the lines in a script end with CRLF. Unix systems expect only LF as the line ending.

This problem most often occurs when the script is authored on a Windows environment, as CRLF is a common line ending for many text editors on Windows.

_Resolution_: If it is an option in your text editor, select Unix format or LF for the line ending. You may also use the following commands on a Unix system to change the CRLF to an LF:

> [AZURE.NOTE] The following commands are roughly equivalent in that they should change the CRLF line endings to LF. Select one based on the utilities available on your system.

| Command | Notes |
| ------- | ----- |
| `unix2dos -b INFILE` | The original file will be backed up with a .BAK extension |
| `tr -d '\r' < INFILE > OUTFILE` | OUTFILE will contain a version with only LF endings |
| `perl -pi -e 's/\r\n/\n/g' INFILE` | This will modify the file directly without creating a new file |
| ```sed 's/$'"/`echo \\\r`/" INFILE > OUTFILE``` | OUTFILE will contain a version with only LF endings.

__Error__: `line 1: #!/usr/bin/env: No such file or directory`.

_Cause_: This error occurs when the script was saved as UTF-8 with a Byte Order Mark (BOM).

_Resolution_: Save the file either as ASCII, or as UTF-8 without a BOM. You may also use the following command on a Linux or Unix system to create a new file without the BOM:

    awk 'NR==1{sub(/^\xef\xbb\xbf/,"")}{print}' INFILE > OUTFILE

For the above command, replace __INFILE__ with the file containing the BOM. __OUTFILE__ should be a new file name, which will contain the script without the BOM.

## <a name="seeAlso"></a>Next steps

* Learn how to [Customize HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md)

* Use the [HDInsight .NET SDK reference](https://msdn.microsoft.com/library/mt271028.aspx) to learn more about creating .NET applications that manage HDInsight

* Use the [HDInsight REST API](https://msdn.microsoft.com/library/azure/mt622197.aspx) to learn how to use REST to perform management actions on HDInsight clusters.
