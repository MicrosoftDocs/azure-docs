<properties
	pageTitle="Generate recommendations using Mahout and Linux-based HDInsight | Microsoft Azure"
	description="Learn how to use the Apache Mahout machine learning library to generate movie recommendations with Linux-based HDInsight (Hadoop)."
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
	ms.date="06/14/2016"
	ms.author="larryfr"/>

#Generate movie recommendations by using Apache Mahout with Linux-based Hadoop in HDInsight

[AZURE.INCLUDE [mahout-selector](../../includes/hdinsight-selector-mahout.md)]

Learn how to use the [Apache Mahout](http://mahout.apache.org) machine learning library with Azure HDInsight to generate movie recommendations.

Mahout is a [machine learning][ml] library for Apache Hadoop. Mahout contains algorithms for processing data, such as filtering, classification, and clustering. In this article, you will use a recommendation engine to generate movie recommendations that are based on movies your friends have seen.

> [AZURE.NOTE] The steps in this document require a Linux-based Hadoop on HDInsight cluster. For information on using Mahout with a Windows-based cluster, see [Generate movie recommendations by using Apache Mahout with Windows-based Hadoop in HDInsight](hdinsight-mahout.md)

##Prerequisites

* A Linux-based Hadoop on HDInsight cluster. For information about creating one, see [Get started using Linux-based Hadoop in HDInsight][getstarted]

##Mahout versioning

For more information about the version of Mahout included with your HDInsight cluster, see [HDInsight versions and Hadoop components](hdinsight-component-versioning.md).

> [AZURE.WARNING] While it is possible to upload a different version of Mahout to the HDInsight cluster, only components provided with the HDInsight cluster are fully supported and Microsoft Support will help to isolate and resolve issues related to these components.
>
> Custom components receive commercially reasonable support to help you to further troubleshoot the issue. This might result in resolving the issue OR asking you to engage available channels for the open source technologies where deep expertise for that technology is found. For example, there are many community sites that can be used, like: [MSDN forum for HDInsight](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=hdinsight), [http://stackoverflow.com](http://stackoverflow.com). Also Apache projects have project sites on [http://apache.org](http://apache.org), for example: [Hadoop](http://hadoop.apache.org/), [Spark](http://spark.apache.org/).

##<a name="recommendations"></a>Understanding recommendations

One of the functions that is provided by Mahout is a recommendation engine. This engine accepts data in the format of `userID`, `itemId`, and `prefValue` (the users preference for the item). Mahout can then perform co-occurance analysis to determine: _users who have a preference for an item also have a preference for these other items_. Mahout then determines users with like-item preferences, which can be used to make recommendations.

The following is an extremely simple example that uses movies:

* __Co-occurance__: Joe, Alice, and Bob all liked _Star Wars_, _The Empire Strikes Back_, and _Return of the Jedi_. Mahout determines that users who like any one of these movies also like the other two.

* __Co-occurance__: Bob and Alice also liked _The Phantom Menace_, _Attack of the Clones_, and _Revenge of the Sith_. Mahout determines that users who liked the previous three movies also like these three.

* __Similarity recommendation__: Because Joe liked the first three movies, Mahout looks at movies that others with similar preferences liked, but Joe has not watched (liked/rated). In this case, Mahout recommends _The Phantom Menace_, _Attack of the Clones_, and _Revenge of the Sith_.

###Understanding the data

Conveniently, [GroupLens Research][movielens] provides rating data for movies in a format that is compatible with Mahout. This data is available on your cluster's default storage at `/HdiSamples/HdiSamples/MahoutMovieData`.

There are two files, `moviedb.txt` (information about the movies,) and `user-ratings.txt`. The user-ratings.txt file is used during analysis, while moviedb.txt is used to provide user-friendly text infromation when displaying the results of the analysis.

The data contained in user-ratings.txt has a structure of `userID`, `movieID`, `userRating`, and `timestamp`, which tells us how highly each user rated a movie. Here is an example of the data:


    196	242	3	881250949
    186	302	3	891717742
    22	377	1	878887116
    244	51	2	880606923
    166	346	1	886397596

##Run the analysis

Use the following command to run the recommendation job:

    mahout recommenditembased -s SIMILARITY_COOCCURRENCE -i /HdiSamples/HdiSamples/MahoutMovieData/user-ratings.txt -o /example/data/mahoutout --tempDir /temp/mahouttemp

> [AZURE.NOTE] The job may take several minutes to complete, and may run multiple MapReduce jobs.

##View the output

1. Once the job completes, use the following command to view the generated output:

		hdfs dfs -text /example/data/mahoutout/part-r-00000

	The output will appear as follows:

		1	[234:5.0,347:5.0,237:5.0,47:5.0,282:5.0,275:5.0,88:5.0,515:5.0,514:5.0,121:5.0]
		2	[282:5.0,210:5.0,237:5.0,234:5.0,347:5.0,121:5.0,258:5.0,515:5.0,462:5.0,79:5.0]
		3	[284:5.0,285:4.828125,508:4.7543354,845:4.75,319:4.705128,124:4.7045455,150:4.6938777,311:4.6769233,248:4.65625,272:4.649266]
		4	[690:5.0,12:5.0,234:5.0,275:5.0,121:5.0,255:5.0,237:5.0,895:5.0,282:5.0,117:5.0]

	The first column is the `userID`. The values contained in '[' and ']' are `movieId`:`recommendationScore`.

2. You can use the output, along with the moviedb.txt, to display more user friendly information. First, we need to copy the files locally using the following commands:

		hdfs dfs -get /example/data/mahoutout/part-r-00000 recommendations.txt
        hdfs dfs -get /HdiSamples/HdiSamples/MahoutMovieData/* .

	This will copy the output data to a file named **recommendations.txt** in the current directory, along with the movie data files.

3. Use the following command to create a new Python script that will look up movie names for the data in the recommendations output:

		nano show_recommendations.py

	When the editor opens, use the following as the contents of the file:

        #!/usr/bin/env python

        import sys

        if len(sys.argv) != 5:
                print "Arguments: userId userDataFilename movieFilename recommendationFilename"
                sys.exit(1)

        userId, userDataFilename, movieFilename, recommendationFilename = sys.argv[1:]

        print "Reading Movies Descriptions"
        movieFile = open(movieFilename)
        movieById = {}
        for line in movieFile:
                tokens = line.split("|")
                movieById[tokens[0]] = tokens[1:]
        movieFile.close()

        print "Reading Rated Movies"
        userDataFile = open(userDataFilename)
        ratedMovieIds = []
        for line in userDataFile:
                tokens = line.split("\t")
                if tokens[0] == userId:
                        ratedMovieIds.append((tokens[1],tokens[2]))
        userDataFile.close()

        print "Reading Recommendations"
        recommendationFile = open(recommendationFilename)
        recommendations = []
        for line in recommendationFile:
                tokens = line.split("\t")
                if tokens[0] == userId:
                        movieIdAndScores = tokens[1].strip("[]\n").split(",")
                        recommendations = [ movieIdAndScore.split(":") for movieIdAndScore in movieIdAndScores ]
                        break
        recommendationFile.close()

        print "Rated Movies"
        print "------------------------"
        for movieId, rating in ratedMovieIds:
                print "%s, rating=%s" % (movieById[movieId][0], rating)
        print "------------------------"

        print "Recommended Movies"
        print "------------------------"
        for movieId, score in recommendations:
                print "%s, score=%s" % (movieById[movieId][0], score)
        print "------------------------"

	Press **Ctrl-X**, **Y**, and finally **Enter** to save the data.

3. Use the following command to make the file executable:

		chmod +x show_recommendations.py

4. Run the Python script. The following assumes you are in the directory where all the files were downloaded:

		./show_recommendations.py 4 user-ratings.txt moviedb.txt recommendations.txt

	This will look at the recommendations generated for user ID 4.

	* The **user-ratings.txt** file is used to retrieve movies that the user has rated
	* The **moviedb.txt** file is used to retrieve the names of the movies
	* The **recommendations.txt** is used to retrieve the movie recommendations for this user

	The output from this command will be similar to the following:

		Reading Movies Descriptions
		Reading Rated Movies
		Reading Recommendations
		Rated Movies
		------------------------
		Mimic (1997), rating=3
		Ulee's Gold (1997), rating=5
		Incognito (1997), rating=5
		One Flew Over the Cuckoo's Nest (1975), rating=4
		Event Horizon (1997), rating=4
		Client, The (1994), rating=3
		Liar Liar (1997), rating=5
		Scream (1996), rating=4
		Star Wars (1977), rating=5
		Wedding Singer, The (1998), rating=5
		Starship Troopers (1997), rating=4
		Air Force One (1997), rating=5
		Conspiracy Theory (1997), rating=3
		Contact (1997), rating=5
		Indiana Jones and the Last Crusade (1989), rating=3
		Desperate Measures (1998), rating=5
		Seven (Se7en) (1995), rating=4
		Cop Land (1997), rating=5
		Lost Highway (1997), rating=5
		Assignment, The (1997), rating=5
		Blues Brothers 2000 (1998), rating=5
		Spawn (1997), rating=2
		Wonderland (1997), rating=5
		In & Out (1997), rating=5
		------------------------
		Recommended Movies
		------------------------
		Seven Years in Tibet (1997), score=5.0
		Indiana Jones and the Last Crusade (1989), score=5.0
		Jaws (1975), score=5.0
		Sense and Sensibility (1995), score=5.0
		Independence Day (ID4) (1996), score=5.0
		My Best Friend's Wedding (1997), score=5.0
		Jerry Maguire (1996), score=5.0
		Scream 2 (1997), score=5.0
		Time to Kill, A (1996), score=5.0
		Rock, The (1996), score=5.0
		------------------------

##Delete temporary data

Mahout jobs do not remove temporary data that is created while processing the job. The `--tempDir` parameter is specified in the example job to isolate the temporary files into a specific path for easy deletion. To remove the temp files, use the following command:

	hdfs dfs -rm -f -r /temp/mahouttemp

> [AZURE.WARNING] If you want to run the command again, you must also delete the output directory. Use the following to delete this directory:
>
> ```hdfs dfs -rm -f -r /example/data/mahoutout```

## Next steps

Now that you have learned how to use Mahout, discover other ways of working with data on HDInsight:

* [Hive with HDInsight](hdinsight-use-hive.md)
* [Pig with HDInsight](hdinsight-use-pig.md)
* [MapReduce with HDInsight](hdinsight-use-mapreduce.md)

[build]: http://mahout.apache.org/developers/buildingmahout.html
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
 