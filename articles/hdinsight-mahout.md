<properties
	pageTitle="Generate movie recommendations using Mahout with Microsoft Azure HDInsight (Hadoop)"
	description="Learn how to use the Apache Mahout machine learning library to generate movie recommendations with HDInsight (Hadoop)"
	services="hdinsight"
	documentationCenter=""
	authors="Blackmist"
	manager="paulettm"
	editor=""/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/06/2015"
	ms.author="larryfr"/>

#Generate movie recommendations by using Apache Mahout with HDInsight

Learn how to use the [Apache Mahout](http://mahout.apache.org) machine learning library with Azure HDInsight to generate movie recommendations.

> [AZURE.NOTE] You must have an HDInsight cluster to use the information in this article. For information about creating one, see [Get started using Hadoop in HDInsight][getstarted].
>
> Mahout is provided with the HDInsight 3.1 version of the clusters. If you are using an earlier version of HDInsight, see [Install Mahout](#install) before you continue.

##<a name="learn"></a>What you will learn

Mahout is a [machine learning][ml] library for Apache Hadoop. Mahout contains algorithms for processing data, such as filtering, classification, and clustering. In this article, you will use a recommendation engine to generate movie recommendations that are based on movies your friends have seen. You will also learn how to perform classifications with a decision forest. This will teach you the following:

* How to run Mahout jobs by using Windows PowerShell

* How to run Mahout jobs from the Hadoop command line

* How to install Mahout on HDInsight 3.0 and HDInsight 2.0 clusters

##<a name="recommendations"></a>Generate recommendations by using Windows PowerShell

> [AZURE.NOTE] Although the job used in this section works by using Windows PowerShell, many of the classes provided with Mahout do not currently work with Windows PowerShell, and they must be run by using the Hadoop command line. For a list of classes that do not work with Windows PowerShell, see the [Troubleshooting](#troubleshooting) section.
>
> For an example of using the Hadoop command line to run Mahout jobs, see [Classify data by using the Hadoop command line](#classify).

One of the functions that is provided by Mahout is a recommendation engine. This engine accepts data in the format of `userID`, `itemId`, and `prefValue` (the users preference for the item). Mahout can then perform co-occurance analysis to determine: _users who have a preference for an item also have a preference for these other items_. Mahout then determines users with like-item preferences, which can be used to make recommendations.

The following is an extremely simple example that uses movies:

* __Co-occurance__: Joe, Alice, and Bob all liked _Star Wars_, _The Empire Strikes Back_, and _Return of the Jedi_. Mahout determines that users who like any one of these movies also like the other two.

* __Co-occurance__: Bob and Alice also liked _The Phantom Menace_, _Attack of the Clones_, and _Revenge of the Sith_. Mahout determines that users who liked the previous three movies also like these three.

* __Similarity recommendation__: Because Joe liked the first three movies, Mahout looks at movies that others with similar preferences liked, but Joe has not watched (liked/rated). In this case, Mahout recommends _The Phantom Menace_, _Attack of the Clones_, and _Revenge of the Sith_.

###Load the data

Conveniently, [GroupLens Research][movielens] provides rating data for movies in a format that is compatible with Mahout.

1. Download the [MovieLens 100k][100k] archive, which contains 100,000 ratings from 1000 users for 1700 movies.

2. Extract the archive. It should contain an __ml-100k__ directory, which contains many data files prefixed with __u.__. The file that will be analyzed by Mahout is __u.data__. The data structure of this file is `userID`, `movieID`, `userRating`, and `timestamp`. Here is an example of the data:


		196	242	3	881250949
		186	302	3	891717742
		22	377	1	878887116
		244	51	2	880606923
		166	346	1	886397596


3. Upload the __u.data__ file to __example/data/u.data__ in your HDInsight cluster. If you have [Azure PowerShell][aps], you can use the [HDInsight-Tools][tools] module to upload the file. For other ways to upload files, see [Upload data for Hadoop Jobs in HDInsight][upload]. The following command uses `Add-HDInsightFile` to upload the file:

    	PS C:\> Add-HDInsightFile -LocalPath "path\to\u.data" -DestinationPath "example/data/u.data" -ClusterName "your cluster name"

    This uploads the __u.data__ file to __example/data/u.data__ in the default storage in your cluster. You can then access this data by using the __wasb:///example/data/u.data__ URI from HDInsight jobs.

###Run the job

Use the following Windows PowerShell script to run a job that uses the Mahout recommendation engine with the __u.data__ file that you uploaded previously:

	# The HDInsight cluster name.
	$clusterName = "the cluster name"

	# NOTE: The version number portion of the file path
	# may change in future versions of HDInsight.
	# So dynamically grab it using Hive.
	$mahoutPath = Invoke-Hive -Query '!${env:COMSPEC} /c dir /b /s ${env:MAHOUT_HOME}\examples\target\*-job.jar' | where {$_.startswith("C:\apps\dist")}
	$noCRLF = $mahoutPath -replace "`r`n", ""
	$cleanedPath = $noCRLF -replace "\\", "/"
	$jarFile = "file:///$cleanedPath"
    #
	# If you are using an earlier version of HDInsight,
	# set $jarFile to the jar file you
	# uploaded.
	# For example,
	# $jarFile = "wasb:///example/jars/mahout-core-0.9-job.jar"

	# The arguments for this job
	# * input - the path to the data uploaded to HDInsight
	# * output - the path to store output data
	# * tempDir - the directory for temp files
	$jobArguments = "-s", "SIMILARITY_COOCCURRENCE",
	                "--input", "wasb:///example/data/u.data",
	                "--output", "wasb:///example/out",
	                "--tempDir", "wasb:///temp/mahout"

	# Create the job definition
	$jobDefinition = New-AzureHDInsightMapReduceJobDefinition `
	  -JarFile $jarFile `
	  -ClassName "org.apache.mahout.cf.taste.hadoop.item.RecommenderJob" `
	  -Arguments $jobArguments

	# Start the job
	$job = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $jobDefinition

	# Wait on the job to complete
	Write-Host "Wait for the job to complete ..." -ForegroundColor Green
	Wait-AzureHDInsightJob -Job $job

	# Write out any error information
	Write-Host "STDERR"
	Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $job.JobId -StandardError

> [AZURE.NOTE] Mahout jobs do not remove temporary data that is created while processing the job. The `--tempDir` parameter is specified in the example job to isolate the temporary files into a specific path for easy deletion.
>
> To remove these files, you can use one of the tools mentioned in [Upload data for Hadoop jobs in HDInsight][upload]. Or you can use the `Remove-HDInsightFile` function in the [HDInsight-Tools][tools] module.
>
> If you do not remove the temporary files or the output file, you will receive an error message if you run the job again.

The Mahout job does not return the output to STDOUT. Instead, it stores it in the specified output directory as __part-r-00000__. To download and view the file, use the `Get-HDInsightFile` function in the [HDInsight-Tools][tools] module.

The following is an example of the content of the file:

	1	[234:5.0,347:5.0,237:5.0,47:5.0,282:5.0,275:5.0,88:5.0,515:5.0,514:5.0,121:5.0]
	2	[282:5.0,210:5.0,237:5.0,234:5.0,347:5.0,121:5.0,258:5.0,515:5.0,462:5.0,79:5.0]
	3	[284:5.0,285:4.828125,508:4.7543354,845:4.75,319:4.705128,124:4.7045455,150:4.6938777,311:4.6769233,248:4.65625,272:4.649266]
	4	[690:5.0,12:5.0,234:5.0,275:5.0,121:5.0,255:5.0,237:5.0,895:5.0,282:5.0,117:5.0]

The first column is the `userID`. The values contained in '[' and ']' are `movieId`:`recommendationScore`.

###View the output

Although the generated output might be OK for use in an application, it's not very readable. Some of the other files extracted to the __ml-100k__ folder earlier can be used to resolve `movieId` to a movie name. A Python script that will do this is included in the __ml-100k__ folder (__show\_recommendations.py__), or you can use the following Windows PowerShell script:

	<#
	.SYNOPSIS
	    Displays recommendations for movies.
	.DESCRIPTION
	    Displays recommendations generated by Mahout
	    with HDInsight example in a human readable format.
	.EXAMPLE
	    .\Show-Recommendation -userId 4
	        -userDataFile "u.data"
	        -movieFile "u.item"
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

To use this script, you must have previously extracted the __ml-100k__ folder, in addition to having a local copy of the __part-r-00000__ output file that was generated by the Mahout job. The following is an example of running the script:

	PS C:\> show-recommendation.ps1 -userId 4 -userDataFile .\ml-100k\u.data -movieFile .\ml-100k\u.item -recommendationFile .\output.txt


> [AZURE.NOTE] The example Python script, __show\_recommendations.py__, takes the same parameters.

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

2. Upload the files to __example/data__. You can do this by using the `Add-HDInsightFile` function in the [HDInsight-Tools][tools] module.

###Run the job

1. This job requires the Hadoop command line, so you must first enable Remote Desktop through the [Azure portal][management]. In the portal, select your HDInsight cluster, and then select __Enable Remote__ at the bottom of the __Configuration__ page:

    ![enable remote][enableremote]

    When prompted, enter a user name and password to use for remote sessions.

2. When remote access is enabled, select __Connect__ to begin the connection. This downloads an __.rdp__ file, which can be used to start a Remote Desktop session.

    ![connect][connect]

3. After connecting, use the __Hadoop Command Line__ icon to open the Hadoop command line:

	![hadoop cli][hadoopcli]

3. Use the following command to generate the file descriptor (__KDDTrain+.info__), which uses Mahout.

		hadoop jar "c:/apps/dist/mahout-0.9.0.2.1.3.0-1887/examples/target/mahout-examples-0.9.0.2.1.3.0-1887-job.jar" org.apache.mahout.classifier.df.tools.Describe -p "wasb:///example/data/KDDTrain+.arff" -f "wasb:///example/data/KDDTrain+.info" -d N 3 C 2 N C 4 N C 8 N 2 C 19 N L

	The `N 3 C 2 N C 4 N C 8 N 2 C 19 N L` describes the attributes of the data in the file. For example, L indicates a label.

4. Build a forest of decision trees by using the following command:

		hadoop jar c:/apps/dist/mahout-0.9.0.2.1.3.0-1887/examples/target/mahout-examples-0.9.0.2.1.3.0-1887-job.jar org.apache.mahout.classifier.df.mapreduce.BuildForest -Dmapred.max.split.size=1874231 -d wasb:///example/data/KDDTrain+.arff -ds wasb:///example/data/KDDTrain+.info -sl 5 -p -t 100 -o nsl-forest

    The output of this operation is stored in the __nsl-forest__ directory, which is located in the storage for your HDInsight cluster at __wasb://user/&lt;username>/nsl-forest/nsl-forest.seq. The &lt;username> is the user name that you used for your Remote Desktop session. This file is not readable by humans.

5. Test the forest by classifying the __KDDTest+.arff__ dataset. Use the following command:

    	hadoop jar c:/apps/dist/mahout-0.9.0.2.1.3.0-1887/examples/target/mahout-examples-0.9.0.2.1.3.0-1887-job.jar org.apache.mahout.classifier.df.mapreduce.TestForest -i wasb:///example/data/KDDTest+.arff -ds wasb:///example/data/KDDTrain+.info -m nsl-forest -a -mr -o wasb:///example/data/predictions

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

  This job also produces a file located at __wasb:///example/data/predictions/KDDTest+.arff.out__. However, this file is not readable by humans.

> [AZURE.NOTE] Mahout jobs do not overwrite files. If you want to run these jobs again, you must delete the files that were created by previous jobs.

##<a name="troubleshooting"></a>Troubleshooting

###<a name="install"></a>Install Mahout

Mahout is installed on HDInsight 3.1 clusters, and it can be installed manually on HDInsight 3.0 or HDInsight 2.1 clusters by using the following steps:

1. The version of Mahout to use depends on the HDInsight version of your cluster. You can find the cluster version by using the following [Azure PowerShell][aps] command:

    	PS C:\> Get-AzureHDInsightCluster -Name YourClusterName | Select version


  * __For HDInsight 2.1__, you can download a Java Archive (JAR) file that contains [Mahout 0.9](http://repo2.maven.org/maven2/org/apache/mahout/mahout-core/0.9/mahout-core-0.9-job.jar).

  * __For HDInsight 3.0__, you must [build Mahout from the source][build] and specify the Hadoop version provided by HDInsight. Install the prerequisites listed on the build page, download the source, and then use the following command to create the Mahout jar files:

			mvn -Dhadoop2.version=2.2.0 -DskipTests clean package

    	After the build completes, you can find the JAR file at __mahout\mrlegacy\target\mahout-mrlegacy-1.0-SNAPSHOT-job.jar__.

    	> [AZURE.NOTE] When Mahout 1.0 is released, you should be able to use the prebuilt packages with HDInsight 3.0.

2. Upload the jar file to __example/jars__ in the default storage for your cluster. The following example uses the [send-hdinsight][sendhdinsight] script to upload the file:

    	PS C:\> .\Send-HDInsight -LocalPath "path\to\mahout-core-0.9-job.jar" -DestinationPath "example/jars/mahout-core-0.9-job.jar" -ClusterName "your cluster name"

###Cannot overwrite files

Mahout jobs do not clean up temporary files that were created during processing. In addition, the jobs will not overwrite an existing output file.

To avoid errors when running Mahout jobs, delete temporary and output files between runs, or use unique temporary and output directory names.

###Cannot find the JAR file

HDInsight 3.1 clusters include Mahout. The path and file name include the version number of Mahout that is installed on the cluster. The Windows PowerShell example script in this tutorial uses a path that is valid as of July 2014, but the version number will change in future updates to HDInsight. To determine the current path to the Mahout JAR file for your cluster, use the following Windows PowerShell command, and then modify the script to reference the file path that is returned:

	Use-AzureHDInsightCluster -Name $clusterName
	$jarFile = Invoke-Hive -Query '!${env:COMSPEC} /c dir /b /s ${env:MAHOUT_HOME}\examples\target\*-job.jar'

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


[build]: http://mahout.apache.org/developers/buildingmahout.html
[aps]: http://azure.microsoft.com/documentation/articles/install-configure-powershell/
[movielens]: http://grouplens.org/datasets/movielens/
[100k]: http://files.grouplens.org/datasets/movielens/ml-100k.zip
[getstarted]: http://azure.microsoft.com/documentation/articles/hdinsight-get-started/
[upload]: http://azure.microsoft.com/documentation/articles/hdinsight-upload-data/
[ml]: http://en.wikipedia.org/wiki/Machine_learning
[forest]: http://en.wikipedia.org/wiki/Random_forest
[management]: https://manage.windowsazure.com/
[enableremote]: ./media/hdinsight-mahout/enableremote.png
[connect]: ./media/hdinsight-mahout/connect.png
[hadoopcli]: ./media/hdinsight-mahout/hadoopcli.png
[tools]: https://github.com/Blackmist/hdinsight-tools
