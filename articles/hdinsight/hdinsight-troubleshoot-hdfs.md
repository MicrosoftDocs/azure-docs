---
title: Troubleshoot HDFS in Azure HDInsight
description: Get answers to common questions about working with HDFS and Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 09/30/2019 
ms.custom: seodec18
---

# Troubleshoot Apache Hadoop HDFS by using Azure HDInsight

Learn about the top issues and their resolutions when working with Hadoop Distributed File System (HDFS) payloads in Apache Ambari. For a full list of commands, see the [HDFS Commands Guide](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HDFSCommands.html) and the [File System Shell Guide](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/FileSystemShell.html).

## <a name="how-do-i-access-local-hdfs-from-inside-a-cluster"></a>How do I access the local HDFS from inside a cluster?

### Issue

Access the local HDFS from the command line and application code instead of by using Azure Blob storage or Azure Data Lake Storage from inside the HDInsight cluster.

### Resolution steps

1. At the command prompt, use `hdfs dfs -D "fs.default.name=hdfs://mycluster/" ...` literally, as in the following command:

    ```output
    hdfs dfs -D "fs.default.name=hdfs://mycluster/" -ls /
    Found 3 items
    drwxr-xr-x   - hdiuser hdfs          0 2017-03-24 14:12 /EventCheckpoint-30-8-24-11102016-01
    drwx-wx-wx   - hive    hdfs          0 2016-11-10 18:42 /tmp
    drwx------   - hdiuser hdfs          0 2016-11-10 22:22 /user
    ```

2. From source code, use the URI `hdfs://mycluster/` literally, as in the following sample application:

    ```Java
    import java.io.IOException;
    import java.net.URI;
    import org.apache.commons.io.IOUtils;
    import org.apache.hadoop.conf.Configuration;
    import org.apache.hadoop.fs.*;

    public class JavaUnitTests {

        public static void main(String[] args) throws Exception {

            Configuration conf = new Configuration();
            String hdfsUri = "hdfs://mycluster/";
            conf.set("fs.defaultFS", hdfsUri);
            FileSystem fileSystem = FileSystem.get(URI.create(hdfsUri), conf);
            RemoteIterator<LocatedFileStatus> fileStatusIterator = fileSystem.listFiles(new Path("/tmp"), true);
            while(fileStatusIterator.hasNext()) {
                System.out.println(fileStatusIterator.next().getPath().toString());
            }
        }
    }
    ```

3. Run the compiled .jar file (for example, a file named `java-unit-tests-1.0.jar`) on the HDInsight cluster with the following command:

    ```apache
    hadoop jar java-unit-tests-1.0.jar JavaUnitTests
    hdfs://mycluster/tmp/hive/hive/5d9cf301-2503-48c7-9963-923fb5ef79a7/inuse.info
    hdfs://mycluster/tmp/hive/hive/5d9cf301-2503-48c7-9963-923fb5ef79a7/inuse.lck
    hdfs://mycluster/tmp/hive/hive/a0be04ea-ae01-4cc4-b56d-f263baf2e314/inuse.info
    hdfs://mycluster/tmp/hive/hive/a0be04ea-ae01-4cc4-b56d-f263baf2e314/inuse.lck
    ```

## du

The [-du](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/FileSystemShell.html#du) command displays sizes of files and directories contained in the given directory or the length of a file in case it's just a file.

The `-s` option produces an aggregate summary of file lengths being displayed.  
The `-h` option formats the file sizes.

Example:

```bash
hdfs dfs -du -s -h hdfs://mycluster/
hdfs dfs -du -s -h hdfs://mycluster/tmp
```

## rm

The [-rm](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/FileSystemShell.html#rm) command deletes files specified as arguments.

Example:

```bash
hdfs dfs -rm hdfs://mycluster/tmp/testfile
```

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
