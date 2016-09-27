<properties
	pageTitle="Generate recommendations using Mahout and WIndows-based HDInsight | Microsoft Azure"
	description="Learn how to use the Apache Mahout machine learning library to generate movie recommendations with Windows-based HDInsight (Hadoop)."
	services="hdinsight"
	documentationCenter=""
	authors="Blackmist"
	manager="paulettm"
	editor="cgronlun"
	tags="azure-portal"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/25/2016"
	ms.author="larryfr"/>

#Generate movie recommendations by using Apache Mahout with Hadoop in HDInsight

[AZURE.INCLUDE [mahout-selector](../../includes/hdinsight-selector-mahout.md)]

Learn how to use the [Apache Mahout](http://mahout.apache.org) machine learning library with Azure HDInsight to generate movie recommendations.

> [AZURE.NOTE] The steps in this document require a Windows client and a Windows-based HDInsight cluster. For information on using Mahout from a Linux, OS X, or Unix client, with a Linux-based HDInsight cluster, see [Generate movie recommendations by using Apache Mahout with Linux-based Hadoop in HDInsight](hdinsight-hadoop-mahout-linux-mac.md)


##<a name="learn"></a>What you will learn

Mahout is a [machine learning][ml] library for Apache Hadoop. Mahout contains algorithms for processing data, such as filtering, classification, and clustering. In this article, you will use a recommendation engine to generate movie recommendations that are based on movies your friends have seen. You will also learn how to perform classifications with a decision forest. This will teach you the following:

* How to run Mahout jobs by using Windows PowerShell

* How to run Mahout jobs from the Hadoop command line

* How to install Mahout on HDInsight 3.0 and HDInsight 2.0 clusters

	> [AZURE.NOTE] Mahout is provided with the HDInsight 3.1 version of the clusters. If you are using an earlier version of HDInsight, see [Install Mahout](#install) before you continue.

##prerequisites

- **An Windows-based Hadoop cluster in HDInsight**. For information about creating one, see [Get started using Hadoop in HDInsight][getstarted]
- **A workstation with Azure PowerShell**.

    [AZURE.INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]


##<a name="recommendations"></a>Generate recommendations by using Windows PowerShell

> [AZURE.NOTE] Although the job used in this section works by using Windows PowerShell, many of the classes provided with Mahout do not currently work with Windows PowerShell, and they must be run by using the Hadoop command line. For a list of classes that do not work with Windows PowerShell, see the [Troubleshooting](#troubleshooting) section.
>
> For an example of using the Hadoop command line to run Mahout jobs, see [Classify data by using the Hadoop command line](#classify).

One of the functions that is provided by Mahout is a recommendation engine. This engine accepts data in the format of `userID`, `itemId`, and `prefValue` (the users preference for the item). Mahout can then perform co-occurance analysis to determine: _users who have a preference for an item also have a preference for these other items_. Mahout then determines users with like-item preferences, which can be used to make recommendations.

The following is an extremely simple example that uses movies:

* __Co-occurance__: Joe, Alice, and Bob all liked _Star Wars_, _The Empire Strikes Back_, and _Return of the Jedi_. Mahout determines that users who like any one of these movies also like the other two.

* __Co-occurance__: Bob and Alice also liked _The Phantom Menace_, _Attack of the Clones_, and _Revenge of the Sith_. Mahout determines that users who liked the previous three movies also like these three.

* __Similarity recommendation__: Because Joe liked the first three movies, Mahout looks at movies that others with similar preferences liked, but Joe has not watched (liked/rated). In this case, Mahout recommends _The Phantom Menace_, _Attack of the Clones_, and _Revenge of the Sith_.

###Understanding the data

Conveniently, [GroupLens Research][movielens] provides rating data for movies in a format that is compatible with Mahout. This data is available on your cluster's default storage at `/HdiSamples/MahoutMovieData`.

There are two files, `moviedb.txt` (information about the movies,) and `user-ratings.txt`. The user-ratings.txt file is used during analysis, while moviedb.txt is used to provide user-friendly text infromation when displaying the results of the analysis.

The data contained in user-ratings.txt has a structure of `userID`, `movieID`, `userRating`, and `timestamp`, which tells us how highly each user rated a movie. Here is an example of the data:


    196	242	3	881250949
    186	302	3	891717742
    22	377	1	878887116
    244	51	2	880606923
    166	346	1	886397596

###Run the job

Use the following Windows PowerShell script to run a job that uses the Mahout recommendation engine with the movie data:

	# The HDInsight cluster name.
	$clusterName = "the cluster name"
    
    #Get HTTPS/Admin credentials for submitting the job later
    $creds = Get-Credential
    #Get the cluster info so we can get the resource group, storage, etc.
    $clusterInfo = Get-AzureRmHDInsightCluster -ClusterName $clusterName
    $resourceGroup = $clusterInfo.ResourceGroup
    $storageAccountName=$clusterInfo.DefaultStorageAccount.split('.')[0]
    $container=$clusterInfo.DefaultStorageContainer
    $storageAccountKey=(Get-AzureRmStorageAccountKey `
        -Name $storageAccountName `
        -ResourceGroupName $resourceGroup)[0].Value
            
    #Create a storage content and upload the file
    $context = New-AzureStorageContext `
        -StorageAccountName $storageAccountName `
        -StorageAccountKey $storageAccountKey
            
	# NOTE: The version number in the file path
	# may change in future versions of HDInsight.
	$jarFile =  "file:///C:/apps/dist/mahout-0.9.0.2.2.9.1-8/examples/target/mahout-examples-0.9.0.2.2.9.1-8-job.jar"
    #
	# If you are using an earlier version of HDInsight,
	# set $jarFile to the jar file you
	# uploaded.
	# For example,
	# $jarFile = "wasbs:///example/jars/mahout-core-0.9-job.jar"

	# The arguments for this job
	# * input - the path to the data uploaded to HDInsight
	# * output - the path to store output data
	# * tempDir - the directory for temp files
	$jobArguments = "--similarityClassname", "recommenditembased", `
                    "-s", "SIMILARITY_COOCCURRENCE", `
	                "--input", "wasbs:///HdiSamples/MahoutMovieData/user-ratings.txt",
	                "--output", "wasbs:///example/out",
	                "--tempDir", "wasbs:///example/temp"

	# Create the job definition
	$jobDefinition = New-AzureRmHDInsightMapReduceJobDefinition `
	  -JarFile $jarFile `
	  -ClassName "org.apache.mahout.cf.taste.hadoop.item.RecommenderJob" `
	  -Arguments $jobArguments

	# Start the job
	$job = Start-AzureRmHDInsightJob `
        -ClusterName $clusterName `
        -JobDefinition $jobDefinition `
        -HttpCredential $creds

	# Wait on the job to complete
	Write-Host "Wait for the job to complete ..." -ForegroundColor Green
	Wait-AzureRmHDInsightJob `
            -ClusterName $clusterName `
            -JobId $job.JobId `
            -HttpCredential $creds
    # Download the output
    Get-AzureStorageBlobContent `
            -Blob example/out/part-r-00000 `
            -Container $container `
            -Destination output.txt `
            -Context $context
            
	# Write out any error information
	Write-Host "STDERR"
	Get-AzureRmHDInsightJobOutput `
            -Clustername $clusterName `
            -JobId $job.JobId `
            -DefaultContainer $container `
            -DefaultStorageAccountName $storageAccountName `
            -DefaultStorageAccountKey $storageAccountKey `
            -HttpCredential $creds `
            -DisplayOutputType StandardError

> [AZURE.NOTE] Mahout jobs do not remove temporary data that is created while processing the job. The `--tempDir` parameter is specified in the example job to isolate the temporary files into a specific directory.

The Mahout job does not return the output to STDOUT. Instead, it stores it in the specified output directory as __part-r-00000__. The script downloads this file to __output.txt__ in the current directory on your workstation.

The following is an example of the content of this file:

	1	[234:5.0,347:5.0,237:5.0,47:5.0,282:5.0,275:5.0,88:5.0,515:5.0,514:5.0,121:5.0]
	2	[282:5.0,210:5.0,237:5.0,234:5.0,347:5.0,121:5.0,258:5.0,515:5.0,462:5.0,79:5.0]
	3	[284:5.0,285:4.828125,508:4.7543354,845:4.75,319:4.705128,124:4.7045455,150:4.6938777,311:4.6769233,248:4.65625,272:4.649266]
	4	[690:5.0,12:5.0,234:5.0,275:5.0,121:5.0,255:5.0,237:5.0,895:5.0,282:5.0,117:5.0]

The first column is the `userID`. The values contained in '[' and ']' are `movieId`:`recommendationScore`.

###View the output

Although the generated output might be OK for use in an application, it's not very readable. The `moviedb.txt` from the server can be used to resolve the `movieId` to a movie name, but you must first download it and the ratings file from the server using the following script:

    # The HDInsight cluster name.
	$clusterName = "the cluster name"
    
    #Get the cluster info so we can get the resource group, storage, etc.
    $clusterInfo = Get-AzureRmHDInsightCluster -ClusterName $clusterName
    $resourceGroup = $clusterInfo.ResourceGroup
    $storageAccountName=$clusterInfo.DefaultStorageAccount.split('.')[0]
    $container=$clusterInfo.DefaultStorageContainer
    $storageAccountKey=(Get-AzureRmStorageAccountKey `
        -Name $storageAccountName `
        -ResourceGroupName $resourceGroup)[0].Value
    #Create a storage content and upload the file
    $context = New-AzureStorageContext `
        -StorageAccountName $storageAccountName `
        -StorageAccountKey $storageAccountKey
    #Download the files
    Get-AzureStorageBlobContent -blob "HdiSamples/MahoutMovieData/moviedb.txt" `
    -Container $container `
    -Destination moviedb.txt `
    -Context $context
    Get-AzureStorageBlobContent -blob "HdiSamples/MahoutMovieData/user-ratings.txt" `
    -Container $container `
    -Destination user-ratings.txt `
    -Context $context

Once you have downloaded the files, use the following PowerShell script to display recommendations with movie names:

	<#
	.SYNOPSIS
	    Displays recommendations for movies.
	.DESCRIPTION
	    Displays recommendations generated by Mahout
	    with HDInsight example in a human readable format.
	.EXAMPLE
	    .\Show-Recommendation -userId 4
	        -userDataFile "user-ratings.txt"
	        -movieFile "moviedb.txt"
	        -recommendationFile "output.txt"
	#>

	[CmdletBinding(SupportsShouldProcess = $true)]
	param(
	    #The user ID
	    [Parameter(Mandatory = $true)]
	    [String]$userId,

	    [Parameter(Mandatory = $true)]
	    [String]$userDataFile,

	    [Parameter(Mandatory = $true)]
	    [String]$movieFile,

	    [Parameter(Mandatory = $true)]
	    [String]$recommendationFile
	)
	# Read movie ID & description into hash table
	Write-Host "Reading movies descriptions" -ForegroundColor Green
	$movieById = @{}
	foreach($line in Get-Content $movieFile)
	{
	    $tokens = $line.Split("|")
	    $movieById[$tokens[0]] = $tokens[1]
	}
	# Load movies user has already seen (rated)
	# into a hash table
	Write-Host "Reading rated movies" -ForegroundColor Green
	$ratedMovieIds = @{}
	foreach($line in Get-Content $userDataFile)
	{
	    $tokens = $line.Split("`t")
	    if($tokens[0] -eq $userId)
	    {
	        # Resolve the ID to the movie name
	        $ratedMovieIds[$movieById[$tokens[1]]] = $tokens[2]
	    }
	}
	# Read recommendations generated by Mahout
	Write-Host "Reading recommendations" -ForegroundColor Green
	$recommendations = @{}
	foreach($line in get-content $recommendationFile)
	{
	    $tokens = $line.Split("`t")
	    if($tokens[0] -eq $userId)
	    {
	        #Trim leading/treailing [] and split at ,
	        $movieIdAndScores = $tokens[1].TrimStart("[").TrimEnd("]").Split(",")
	        foreach($movieIdAndScore in $movieIdAndScores)
	        {
	            #Split at : and store title and score in a hash table
	            $idAndScore = $movieIdAndScore.Split(":")
	            $recommendations[$movieById[$idAndScore[0]]] = $idAndScore[1]
	        }
	        break
	    }
	}

	Write-Host "Rated movies" -ForegroundColor Green
	Write-Host "---------------------------" -ForegroundColor Green
	$ratedFormat = @{Expression={$_.Name};Label="Movie";Width=40}, `
	               @{Expression={$_.Value};Label="Rating"}
	$ratedMovieIds | format-table $ratedFormat
	Write-Host "---------------------------" -ForegroundColor Green

	write-host "Recommended movies" -ForegroundColor Green
	Write-Host "---------------------------" -ForegroundColor Green
	$recommendationFormat = @{Expression={$_.Name};Label="Movie";Width=40}, `
	                        @{Expression={$_.Value};Label="Score"}
	$recommendations | format-table $recommendationFormat

The following is an example of running the script:

	PS C:\> show-recommendation.ps1 -userId 4 -userDataFile .\user-ratings.txt -movieFile .\moviedb.txt -recommendationFile .\output.txt

The output should appear similar to the following:

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

##<a name="classify"></a>Classify data by using the Hadoop command line

One of the classification methods available with Mahout is to build a [random forest][forest]. This is a multiple step process that involves using training data to generate decision trees, which are then used to classify data. This uses the __org.apache.mahout.classifier.df.tools.Describe__ class provided by Mahout. It currently must be run by using the Hadoop command line.

###Load the data

1. Download the following files from [The NSL-KDD Data Set](http://nsl.cs.unb.ca/NSL-KDD/).

  * [KDDTrain+.ARFF](http://nsl.cs.unb.ca/NSL-KDD/KDDTrain+.arff): the training file

  * [KDDTest+.ARFF](http://nsl.cs.unb.ca/NSL-KDD/KDDTest+.arff): the test data

2. Open each file and remove the lines at the top that begin with '@', and then save the files. If these are not removed, you will receive error messages when using this data with Mahout.

2. Upload the files to __example/data__. You can do this by using the following script. Replace __CLUSTERNAME__ with the name of the HDInsight cluster. Replace FILENAME with the name fo the file to be uploaded.

        #Get the cluster info so we can get the resource group, storage, etc.
        $clusterName="CLUSTERNAME"
        $fileToUpload="FILENAME"
        $blobPath="example/data/FILENAME"
        $clusterInfo = Get-AzureRmHDInsightCluster -ClusterName $clusterName
        $resourceGroup = $clusterInfo.ResourceGroup
        $storageAccountName=$clusterInfo.DefaultStorageAccount.split('.')[0]
        $container=$clusterInfo.DefaultStorageContainer
        $storageAccountKey=(Get-AzureRmStorageAccountKey `
            -Name $storageAccountName `
        -ResourceGroupName $resourceGroup)[0].Value
        
        #Create a storage content and upload the file
        $context = New-AzureStorageContext `
            -StorageAccountName $storageAccountName `
            -StorageAccountKey $storageAccountKey
            
        Set-AzureStorageBlobContent `
            -File $fileToUpload `
            -Blob $blobPath `
            -Container $container `
            -Context $context

###Run the job

1. This job requires the Hadoop command line. Enable Remote Desktop for the HDInsight cluster, then connect to it by following the instructions at [Connect to HDInsight clusters using RDP](hdinsight-administer-use-management-portal.md#rdp).

3. After connecting, use the __Hadoop Command Line__ icon to open the Hadoop command line:

	![hadoop cli][hadoopcli]

3. Use the following command to generate the file descriptor (__KDDTrain+.info__), which uses Mahout.

		hadoop jar "c:/apps/dist/mahout-0.9.0.2.2.9.1-8/examples/target/mahout-examples-0.9.0.2.2.9.1-8-job.jar" org.apache.mahout.classifier.df.tools.Describe -p "wasbs:///example/data/KDDTrain+.arff" -f "wasbs:///example/data/KDDTrain+.info" -d N 3 C 2 N C 4 N C 8 N 2 C 19 N L

	The `N 3 C 2 N C 4 N C 8 N 2 C 19 N L` describes the attributes of the data in the file. For example, L indicates a label.

4. Build a forest of decision trees by using the following command:

		hadoop jar c:/apps/dist/mahout-0.9.0.2.2.9.1-8/examples/target/mahout-examples-0.9.0.2.2.9.1-8-job.jar org.apache.mahout.classifier.df.mapreduce.BuildForest -Dmapred.max.split.size=1874231 -d wasbs:///example/data/KDDTrain+.arff -ds wasbs:///example/data/KDDTrain+.info -sl 5 -p -t 100 -o nsl-forest

    The output of this operation is stored in the __nsl-forest__ directory, which is located in the storage for your HDInsight cluster at __wasbs://user/&lt;username>/nsl-forest/nsl-forest.seq. The &lt;username> is the user name that you used for your Remote Desktop session. This file is not readable by humans.

5. Test the forest by classifying the __KDDTest+.arff__ dataset. Use the following command:

    	hadoop jar c:/apps/dist/mahout-0.9.0.2.2.9.1-8/examples/target/mahout-examples-0.9.0.2.2.9.1-8-job.jar org.apache.mahout.classifier.df.mapreduce.TestForest -i wasbs:///example/data/KDDTest+.arff -ds wasbs:///example/data/KDDTrain+.info -m nsl-forest -a -mr -o wasbs:///example/data/predictions

    This command returns summary information about the classification process similar to the following:

	    14/07/02 14:29:28 INFO mapreduce.TestForest:

	    =======================================================
	    Summary
	    -------------------------------------------------------
	    Correctly Classified Instances          :      17560       77.8921%
	    Incorrectly Classified Instances        :       4984       22.1079%
	    Total Classified Instances              :      22544

	    =======================================================
	    Confusion Matrix
	    -------------------------------------------------------
	    a       b       <--Classified as
	    9437    274      |  9711        a     = normal
	    4710    8123     |  12833       b     = anomaly

	    =======================================================
	    Statistics
	    -------------------------------------------------------
	    Kappa                                       0.5728
	    Accuracy                                   77.8921%
	    Reliability                                53.4921%
	    Reliability (standard deviation)            0.4933

  This job also produces a file located at __wasbs:///example/data/predictions/KDDTest+.arff.out__. However, this file is not readable by humans.

> [AZURE.NOTE] Mahout jobs do not overwrite files. If you want to run these jobs again, you must delete the files that were created by previous jobs.

##<a name="troubleshooting"></a>Troubleshooting

###<a name="install"></a>Install Mahout

Mahout is installed on HDInsight 3.1 clusters, and it can be installed manually on HDInsight 3.0 or HDInsight 2.1 clusters by using the following steps:

1. The version of Mahout to use depends on the HDInsight version of your cluster. You can find the cluster version by viewing the properties for the cluster in the Azure portal.

  * __For HDInsight 2.1__, you can download a Java Archive (JAR) file that contains [Mahout 0.9](http://repo2.maven.org/maven2/org/apache/mahout/mahout-core/0.9/mahout-core-0.9-job.jar).

  * __For HDInsight 3.0__, you must [build Mahout from the source][build] and specify the Hadoop version provided by HDInsight. Install the prerequisites listed on the build page, download the source, and then use the following command to create the Mahout jar files:

			mvn -Dhadoop2.version=2.2.0 -DskipTests clean package

    	After the build completes, you can find the JAR file at __mahout\mrlegacy\target\mahout-mrlegacy-1.0-SNAPSHOT-job.jar__.

    	> [AZURE.NOTE] When Mahout 1.0 is released, you should be able to use the prebuilt packages with HDInsight 3.0.

2. Upload the jar file to __example/jars__ in the default storage for your cluster. Replace CLUSTERNAME in the following script with the name of your HDInsight cluster, and replace FILENAME with the path to the __mahout-coure-0.9-job.jar__ file..

        #Get the cluster info so we can get the resource group, storage, etc.
        $clusterName = "CLUSTERNAME"
        $fileToUpload = "FILENAME"
        $clusterInfo = Get-AzureRmHDInsightCluster -ClusterName $clusterName
        $resourceGroup = $clusterInfo.ResourceGroup
        $storageAccountName=$clusterInfo.DefaultStorageAccount.split('.')[0]
        $container=$clusterInfo.DefaultStorageContainer
        $storageAccountKey=(Get-AzureRmStorageAccountKey `
            -Name $storageAccountName `
        -ResourceGroupName $resourceGroup)[0].Value
        
        #Create a storage content and upload the file
        $context = New-AzureStorageContext `
            -StorageAccountName $storageAccountName `
            -StorageAccountKey $storageAccountKey
            
        Set-AzureStorageBlobContent `
            -File $fileToUpload `
            -Blob "example/jars/mahout-core-0.9-job.jar" `
            -Container $container `
            -Context $context

###Cannot overwrite files

Mahout jobs do not clean up temporary files that were created during processing. In addition, the jobs will not overwrite an existing output file.

To avoid errors when running Mahout jobs, delete temporary and output files between runs, or use unique temporary and output directory names.

###Cannot find the JAR file

HDInsight 3.1 clusters include Mahout. The path and file name include the version number of Mahout that is installed on the cluster. The Windows PowerShell example script in this tutorial uses a path that is valid as of November 2015, but the version number will change in future updates to HDInsight. To determine the current path to the Mahout JAR file for your cluster, use the following Windows PowerShell command, and then modify the script to reference the file path that is returned:

	Use-AzureRmHDInsightCluster -ClusterName $clusterName
    #Get the cluster info so we can get the resource group, storage, etc.
        $clusterInfo = Get-AzureRmHDInsightCluster -ClusterName $clusterName
        $resourceGroup = $clusterInfo.ResourceGroup
        $storageAccountName=$clusterInfo.DefaultStorageAccount.split('.')[0]
        $container=$clusterInfo.DefaultStorageContainer
        $storageAccountKey=(Get-AzureRmStorageAccountKey `
            -Name $storageAccountName `
        -ResourceGroupName $resourceGroup)[0].Value
    Invoke-AzureRmHDInsightHiveJob `
            -StatusFolder "wasbs:///example/statusout" `
            -DefaultContainer $container `
            -DefaultStorageAccountName $storageAccountName `
            -DefaultStorageAccountKey $storageAccountKey `
            -Query '!${env:COMSPEC} /c dir /b /s ${env:MAHOUT_HOME}\examples\target\*-job.jar'

###<a name="nopowershell"></a>Classes that do not work with Windows PowerShell

Mahout jobs that use the following classes return a variety of error messages if they are used from Windows PowerShell:

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

To run jobs that use these classes, connect to the HDInsight cluster, and run the jobs by using the Hadoop command line. See [Classify data using the Hadoop command line](#classify) for an example.

##Next steps

Now that you have learned how to use Mahout, discover other ways of working with data on HDInsight:

* [Hive with HDInsight](hdinsight-use-hive.md)
* [Pig with HDInsight](hdinsight-use-pig.md)
* [MapReduce with HDInsight](hdinsight-use-mapreduce.md)

[build]: http://mahout.apache.org/developers/buildingmahout.html
[aps]: ../powershell-install-configure.md
[movielens]: http://grouplens.org/datasets/movielens/
[100k]: http://files.grouplens.org/datasets/movielens/ml-100k.zip
[getstarted]: hdinsight-hadoop-linux-tutorial-get-started.md
[upload]: hdinsight-upload-data.md
[ml]: http://en.wikipedia.org/wiki/Machine_learning
[forest]: http://en.wikipedia.org/wiki/Random_forest
[management]: https://manage.windowsazure.com/
[enableremote]: ./media/hdinsight-mahout/enableremote.png
[connect]: ./media/hdinsight-mahout/connect.png
[hadoopcli]: ./media/hdinsight-mahout/hadoopcli.png
[tools]: https://github.com/Blackmist/hdinsight-tools
 