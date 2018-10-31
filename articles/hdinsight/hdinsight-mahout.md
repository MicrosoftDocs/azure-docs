---
title: Generate recommendations using Mahout HDInsight from PowerShell - Azure 
description: Learn how to use the Apache Mahout machine learning library to generate movie recommendations with HDInsight (Hadoop) from a PowerShell script running on your client.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 04/23/2018
ms.author: jasonh

---
# Generate movie recommendations by using Apache Mahout with Hadoop in HDInsight (PowerShell)

[!INCLUDE [mahout-selector](../../includes/hdinsight-selector-mahout.md)]

Learn how to use the [Apache Mahout](http://mahout.apache.org) machine learning library with Azure HDInsight to generate movie recommendations. The example in this document uses Azure PowerShell to run Mahout jobs.

## Prerequisites

* A Linux-based HDInsight cluster. For information about creating one, see [Get started using Linux-based Hadoop in HDInsight][getstarted].

    > [!IMPORTANT]
    > Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdinsight-windows-retirement).

* [Azure PowerShell](/powershell/azure/overview)

## <a name="recommendations"></a>Generate recommendations by using Azure PowerShell

> [!WARNING]
> The job in this section works by using Azure PowerShell. Many of the classes provided with Mahout do not currently work with Azure PowerShell. For a list of classes that do not work with Azure PowerShell, see the [Troubleshooting](#troubleshooting) section.
>
> For an example of using SSH to connect to HDInsight and run Mahout examples directly on the cluster, see [Generate movie recommendations using Mahout and HDInsight (SSH)](hadoop/apache-hadoop-mahout-linux-mac.md).

One of the functions that is provided by Mahout is a recommendation engine. This engine accepts data in the format of `userID`, `itemId`, and `prefValue` (the users preference for the item). Mahout uses the data to determine users with like-item preferences, which can be used to make recommendations.

The following example is a simplified walk-through of how the recommendation process works:

* **co-occurrence**: Joe, Alice, and Bob all liked *Star Wars*, *The Empire Strikes Back*, and *Return of the Jedi*. Mahout determines that users who like any one of these movies also like the other two.

* **co-occurrence**: Bob and Alice also liked *The Phantom Menace*, *Attack of the Clones*, and *Revenge of the Sith*. Mahout determines that users who liked the previous three movies also like these movies.

* **Similarity recommendation**: Because Joe liked the first three movies, Mahout looks at movies that others with similar preferences liked, but Joe has not watched (liked/rated). In this case, Mahout recommends *The Phantom Menace*, *Attack of the Clones*, and *Revenge of the Sith*.

### Understanding the data

[GroupLens Research][movielens] provides rating data for movies in a format that is compatible with Mahout. This data is available on the default storage for your cluster at `/HdiSamples/HdiSamples/MahoutMovieData`.

There are two files, `moviedb.txt` (information about the movies) and `user-ratings.txt`. The `user-ratings.txt` file is used during analysis. The `moviedb.txt` file is used to provide user-friendly text when displaying the results of the analysis.

The data contained in user-ratings.txt has a structure of `userID`, `movieID`, `userRating`, and `timestamp`, which tells how highly each user rated a movie. Here is an example of the data:

    196    242    3    881250949
    186    302    3    891717742
    22     377    1    878887116
    244    51     2    880606923
    166    346    1    886397596

### Run the job

Use the following Windows PowerShell script to run a job that uses the Mahout recommendation engine with the movie data:

> [!NOTE]
> This file prompts you for information that is used to connect to your HDInsight cluster and run jobs. It may take several minutes for the jobs to complete and download the output.txt file.

[!code-powershell[main](../../powershell_scripts/hdinsight/mahout/use-mahout.ps1?range=5-98)]

> [!NOTE]
> Mahout jobs do not remove temporary data that is created while processing the job. The `--tempDir` parameter is specified in the example job to isolate the temporary files into a specific directory.

The Mahout job does not return the output to STDOUT. Instead, it stores it in the specified output directory as **part-r-00000**. The script downloads this file to **output.txt** in the current directory on your workstation.

The following text is an example of the content of this file:

    1    [234:5.0,347:5.0,237:5.0,47:5.0,282:5.0,275:5.0,88:5.0,515:5.0,514:5.0,121:5.0]
    2    [282:5.0,210:5.0,237:5.0,234:5.0,347:5.0,121:5.0,258:5.0,515:5.0,462:5.0,79:5.0]
    3    [284:5.0,285:4.828125,508:4.7543354,845:4.75,319:4.705128,124:4.7045455,150:4.6938777,311:4.6769233,248:4.65625,272:4.649266]
    4    [690:5.0,12:5.0,234:5.0,275:5.0,121:5.0,255:5.0,237:5.0,895:5.0,282:5.0,117:5.0]

The first column is the `userID`. The values contained in '[' and ']' are `movieId`:`recommendationScore`.

The script also downloads the `moviedb.txt` and `user-ratings.txt` files, which are needed to format the output to be more readable.

### View the output

Although the generated output might be OK for use in an application, it's not user-friendly. The `moviedb.txt` from the server can be used to resolve the `movieId` to a movie name. Use the following PowerShell script to display recommendations with movie names:

[!code-powershell[main](../../powershell_scripts/hdinsight/mahout/use-mahout.ps1?range=106-180)]

Use the following command to display the recommendations in a user-friendly format: 

```powershell
.\show-recommendation.ps1 -userId 4 -userDataFile .\user-ratings.txt -movieFile .\moviedb.txt -recommendationFile .\output.txt
```

The output is similar to the following text:

    Reading movies descriptions
    Reading rated movies
    Reading recommendations
    Rated movies
    ---------------------------
    Movie                                    Rating
    -----                                    ------
    Devil's Own, The (1997)                  1
    Alien: Resurrection (1997)               3
    187 (1997)                               2
    (lines ommitted)

    ---------------------------
    Recommended movies
    ---------------------------

    Movie                                    Score
    -----                                    -----
    Good Will Hunting (1997)                 4.6504064
    Swingers (1996)                          4.6862745
    Wings of the Dove, The (1997)            4.6666665
    People vs. Larry Flynt, The (1996)       4.834559
    Everyone Says I Love You (1996)          4.707071
    Secrets & Lies (1996)                    4.818182
    That Thing You Do! (1996)                4.75
    Grosse Pointe Blank (1997)               4.8235292
    Donnie Brasco (1997)                     4.6792455
    Lone Star (1996)                         4.7099237

## <a name="troubleshooting"></a>Troubleshooting

### Cannot overwrite files

Mahout jobs do not clean up temporary files that were created during processing. In addition, the jobs do not overwrite existing output file.

To avoid errors when running Mahout jobs, delete temporary and output files between runs. To remove the files created by the earlier scripts in this document, use the following PowerShell script:

```powershell
# Login to your Azure subscription
# Is there an active Azure subscription?
$sub = Get-AzureRmSubscription -ErrorAction SilentlyContinue
if(-not($sub))
{
    Connect-AzureRmAccount
}

# Get cluster info
$clusterName = Read-Host -Prompt "Enter the HDInsight cluster name"
$creds=Get-Credential -Message "Enter the login for the cluster"

#Get the cluster info so we can get the resource group, storage, etc.
$clusterInfo = Get-AzureRmHDInsightCluster -ClusterName $clusterName
$resourceGroup = $clusterInfo.ResourceGroup
$storageAccountName = $clusterInfo.DefaultStorageAccount.split('.')[0]
$container = $clusterInfo.DefaultStorageContainer
$storageAccountKey = (Get-AzureRmStorageAccountKey `
    -Name $storageAccountName `
-ResourceGroupName $resourceGroup)[0].Value

#Create a storage context and upload the file
$context = New-AzureStorageContext `
    -StorageAccountName $storageAccountName `
    -StorageAccountKey $storageAccountKey

#Azure PowerShell can't delete blobs using wildcard,
#so have to get a list and delete one at a time
# Start with the output
$blobs = Get-AzureStorageBlob -Container $container -Context $context -Prefix "example/out"
foreach($blob in $blobs)
{
    Remove-AzureStorageBlob -Blob $blob.Name -Container $container -context $context
}
# Next the temp files
$blobs = Get-AzureStorageBlob -Container $container -Context $context -Prefix "example/temp"
foreach($blob in $blobs)
{
    Remove-AzureStorageBlob -Blob $blob.Name -Container $container -context $context
}
```

### <a name="nopowershell"></a>Classes that do not work with Azure PowerShell

Mahout jobs that use the following classes return various error messages when used from Windows PowerShell:

* org.apache.mahout.utils.clustering.ClusterDumper
* org.apache.mahout.utils.SequenceFileDumper
* org.apache.mahout.utils.vectors.lucene.Driver
* org.apache.mahout.utils.vectors.arff.Driver
* org.apache.mahout.text.WikipediaToSequenceFile
* org.apache.mahout.clustering.streaming.tools.ResplitSequenceFiles
* org.apache.mahout.clustering.streaming.tools.ClusterQualitySummarizer
* org.apache.mahout.classifier.sgd.TrainLogistic
* org.apache.mahout.classifier.sgd.RunLogistic
* org.apache.mahout.classifier.sgd.TrainAdaptiveLogistic
* org.apache.mahout.classifier.sgd.ValidateAdaptiveLogistic
* org.apache.mahout.classifier.sgd.RunAdaptiveLogistic
* org.apache.mahout.classifier.sequencelearning.hmm.BaumWelchTrainer
* org.apache.mahout.classifier.sequencelearning.hmm.ViterbiEvaluator
* org.apache.mahout.classifier.sequencelearning.hmm.RandomSequenceGenerator
* org.apache.mahout.classifier.df.tools.Describe

To run jobs that use these classes, connect to the HDInsight cluster using SSH and run the jobs from the command line. For an example of using SSH to run Mahout jobs, see [Generate movie recommendations using Mahout and HDInsight (SSH)](hadoop/apache-hadoop-mahout-linux-mac.md).

## Next steps

Now that you have learned how to use Mahout, discover other ways of working with data on HDInsight:

* [Hive with HDInsight](hadoop/hdinsight-use-hive.md)
* [Pig with HDInsight](hadoop/hdinsight-use-pig.md)
* [MapReduce with HDInsight](hadoop/hdinsight-use-mapreduce.md)

[build]: http://mahout.apache.org/developers/buildingmahout.html
[aps]: /powershell/azureps-cmdlets-docs
[movielens]: http://grouplens.org/datasets/movielens/
[100k]: http://files.grouplens.org/datasets/movielens/ml-100k.zip
[getstarted]:hadoop/apache-hadoop-linux-tutorial-get-started.md
[upload]: hdinsight-upload-data.md
[ml]: http://en.wikipedia.org/wiki/Machine_learning
[forest]: http://en.wikipedia.org/wiki/Random_forest
[enableremote]: ./media/hdinsight-mahout/enableremote.png
[connect]: ./media/hdinsight-mahout/connect.png
[hadoopcli]: ./media/hdinsight-mahout/hadoopcli.png
[tools]: https://github.com/Blackmist/hdinsight-tools
