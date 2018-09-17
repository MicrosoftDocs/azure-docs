---
title: Use Hadoop Pig with SSH on an HDInsight cluster - Azure 
description: Learn how connect to a Linux-based Hadoop cluster with SSH, and then use the Pig command to run Pig Latin statements interactively, or as a batch job.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 02/27/2018
ms.author: jasonh

---
# Run Pig jobs on a Linux-based cluster with the Pig command (SSH)

[!INCLUDE [pig-selector](../../../includes/hdinsight-selector-use-pig.md)]

Learn how to interactively run Pig jobs from an SSH connection to your HDInsight cluster. The Pig Latin programming language allows you to describe transformations that are applied to the input data to produce the desired output.

> [!IMPORTANT]
> The steps in this document require a Linux-based HDInsight cluster. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](../hdinsight-component-versioning.md#hdinsight-windows-retirement).

## <a id="ssh"></a>Connect with SSH

Use SSH to connect to your HDInsight cluster. The following example connects to a cluster named **myhdinsight** as the account named **sshuser**:

```bash
ssh sshuser@myhdinsight-ssh.azurehdinsight.net
```

For more information, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

## <a id="pig"></a>Use the Pig command

1. Once connected, start the Pig command-line interface (CLI) by using the following command:

    ```bash
    pig
    ```

    After a moment, the prompt changes to`grunt>`.

2. Enter the following statement:

    ```piglatin
    LOGS = LOAD '/example/data/sample.log';
    ```

    This command loads the contents of the sample.log file into LOGS. You can view the contents of the file by using the following statement:

    ```piglatin
    DUMP LOGS;
    ```

3. Next, transform the data by applying a regular expression to extract only the logging level from each record by using the following statement:

    ```piglatin
    LEVELS = foreach LOGS generate REGEX_EXTRACT($0, '(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)', 1)  as LOGLEVEL;
    ```

    You can use **DUMP** to view the data after the transformation. In this case, use `DUMP LEVELS;`.

4. Continue applying transformations by using the statements in the following table:

    | Pig Latin statement | What the statement does |
    | ---- | ---- |
    | `FILTEREDLEVELS = FILTER LEVELS by LOGLEVEL is not null;` | Removes rows that contain a null value for the log level and stores the results into `FILTEREDLEVELS`. |
    | `GROUPEDLEVELS = GROUP FILTEREDLEVELS by LOGLEVEL;` | Groups the rows by log level and stores the results into `GROUPEDLEVELS`. |
    | `FREQUENCIES = foreach GROUPEDLEVELS generate group as LOGLEVEL, COUNT(FILTEREDLEVELS.LOGLEVEL) as COUNT;` | Creates a set of data that contains each unique log level value and how many times it occurs. The data set is stored into `FREQUENCIES`. |
    | `RESULT = order FREQUENCIES by COUNT desc;` | Orders the log levels by count (descending) and stores into `RESULT`. |

    > [!TIP]
    > Use `DUMP` to view the result of the transformation after each step.

5. You can also save the results of a transformation by using the `STORE` statement. For example, the following statement saves the `RESULT` to the `/example/data/pigout` directory on the default storage for your cluster:

    ```piglatin
    STORE RESULT into '/example/data/pigout';
    ```

   > [!NOTE]
   > The data is stored in the specified directory in files named `part-nnnnn`. If the directory already exists, you receive an error.

6. To exit the grunt prompt, enter the following statement:

    ```piglatin
    QUIT;
    ```

### Pig Latin batch files

You can also use the Pig command to run Pig Latin contained in a file.

1. After exiting the grunt prompt, use the following command to create file named `pigbatch.pig`:

    ```bash
    nano ~/pigbatch.pig
    ```

2. Type or paste the following lines:

    ```piglatin
    LOGS = LOAD '/example/data/sample.log';
    LEVELS = foreach LOGS generate REGEX_EXTRACT($0, '(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)', 1)  as LOGLEVEL;
    FILTEREDLEVELS = FILTER LEVELS by LOGLEVEL is not null;
    GROUPEDLEVELS = GROUP FILTEREDLEVELS by LOGLEVEL;
    FREQUENCIES = foreach GROUPEDLEVELS generate group as LOGLEVEL, COUNT(FILTEREDLEVELS.LOGLEVEL) as COUNT;
    RESULT = order FREQUENCIES by COUNT desc;
    DUMP RESULT;
    ```

    When finished, use __Ctrl__ + __X__, __Y__, and then __Enter__ to save the file.

3. Use the following command to run the `pigbatch.pig` file by using the Pig command.

    ```bash
    pig ~/pigbatch.pig
    ```

    Once the batch job finishes, you see the following output:

        (TRACE,816)
        (DEBUG,434)
        (INFO,96)
        (WARN,11)
        (ERROR,6)
        (FATAL,2)


## <a id="nextsteps"></a>Next steps

For general information on Pig in HDInsight, see the following document:

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)

For more information on other ways to work with Hadoop on HDInsight, see the following documents:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)
* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)
