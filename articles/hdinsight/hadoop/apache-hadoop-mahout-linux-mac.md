---
title: Generate recommendations using Apache Mahout and HDInsight (SSH) - Azure 
description: Learn how to use the Apache Mahout machine learning library to generate movie recommendations with HDInsight (Hadoop).
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 04/24/2019
---

# Generate movie recommendations by using Apache Mahout with Linux-based Apache Hadoop in HDInsight (SSH)

[!INCLUDE [mahout-selector](../../../includes/hdinsight-selector-mahout.md)]

Learn how to use the [Apache Mahout](https://mahout.apache.org) machine learning library with Azure HDInsight to generate movie recommendations.

Mahout is a [machine learning](https://en.wikipedia.org/wiki/Machine_learning) library for Apache Hadoop. Mahout contains algorithms for processing data, such as filtering, classification, and clustering. In this article, you use a recommendation engine to generate movie recommendations that are based on movies your friends have seen.

## Prerequisites

* An Apache Hadoop cluster on HDInsight. See [Get Started with HDInsight on Linux](./apache-hadoop-linux-tutorial-get-started.md).

* An SSH client. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

## Apache Mahout versioning

For more information about the version of Mahout in HDInsight, see [HDInsight versions and Apache Hadoop components](../hdinsight-component-versioning.md).

## <a name="recommendations"></a>Understanding recommendations

One of the functions that is provided by Mahout is a recommendation engine. This engine accepts data in the format of `userID`, `itemId`, and `prefValue` (the preference for the item). Mahout can then perform co-occurrence analysis to determine: *users who have a preference for an item also have a preference for these other items*. Mahout then determines users with like-item preferences, which can be used to make recommendations.

The following workflow is a simplified example that uses movie data:

* **Co-occurrence**: Joe, Alice, and Bob all liked *Star Wars*, *The Empire Strikes Back*, and *Return of the Jedi*. Mahout determines that users who like any one of these movies also like the other two.

* **Co-occurrence**: Bob and Alice also liked *The Phantom Menace*, *Attack of the Clones*, and *Revenge of the Sith*. Mahout determines that users who liked the previous three movies also like these three movies.

* **Similarity recommendation**: Because Joe liked the first three movies, Mahout looks at movies that others with similar preferences liked, but Joe has not watched (liked/rated). In this case, Mahout recommends *The Phantom Menace*, *Attack of the Clones*, and *Revenge of the Sith*.

### Understanding the data

Conveniently, [GroupLens Research](https://grouplens.org/datasets/movielens/) provides rating data for movies in a format that is compatible with Mahout. This data is available on your cluster's default storage at `/HdiSamples/HdiSamples/MahoutMovieData`.

There are two files, `moviedb.txt` and `user-ratings.txt`. The `user-ratings.txt` file is used during analysis. The `moviedb.txt` is used to provide user-friendly text information when viewing the results.

The data contained in user-ratings.txt has a structure of `userID`, `movieID`, `userRating`, and `timestamp`, which indicates how highly each user rated a movie. Here is an example of the data:

    196    242    3    881250949
    186    302    3    891717742
    22     377    1    878887116
    244    51     2    880606923
    166    346    1    886397596

## Run the analysis

From an SSH connection to the cluster, use the following command to run the recommendation job:

```bash
mahout recommenditembased -s SIMILARITY_COOCCURRENCE -i /HdiSamples/HdiSamples/MahoutMovieData/user-ratings.txt -o /example/data/mahoutout --tempDir /temp/mahouttemp
```

> [!NOTE]  
> The job may take several minutes to complete, and may run multiple MapReduce jobs.

## View the output

1. Once the job completes, use the following command to view the generated output:

    ```bash
    hdfs dfs -text /example/data/mahoutout/part-r-00000
    ```

    The output appears as follows:

        1    [234:5.0,347:5.0,237:5.0,47:5.0,282:5.0,275:5.0,88:5.0,515:5.0,514:5.0,121:5.0]
        2    [282:5.0,210:5.0,237:5.0,234:5.0,347:5.0,121:5.0,258:5.0,515:5.0,462:5.0,79:5.0]
        3    [284:5.0,285:4.828125,508:4.7543354,845:4.75,319:4.705128,124:4.7045455,150:4.6938777,311:4.6769233,248:4.65625,272:4.649266]
        4    [690:5.0,12:5.0,234:5.0,275:5.0,121:5.0,255:5.0,237:5.0,895:5.0,282:5.0,117:5.0]

    The first column is the `userID`. The values contained in '[' and ']' are `movieId`:`recommendationScore`.

2. You can use the output, along with the moviedb.txt, to provide more information on the recommendations. First, copy the files locally using the following commands:

    ```bash
    hdfs dfs -get /example/data/mahoutout/part-r-00000 recommendations.txt
    hdfs dfs -get /HdiSamples/HdiSamples/MahoutMovieData/* .
    ```

    This command copies the output data to a file named **recommendations.txt** in the current directory, along with the movie data files.

3. Use the following command to create a Python script that looks up movie names for the data in the recommendations output:

    ```bash
    nano show_recommendations.py
    ```

    When the editor opens, use the following text as the contents of the file:

   ```python
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
   ```

    Press **Ctrl-X**, **Y**, and finally **Enter** to save the data.

4. Run the Python script. The following command assumes you are in the directory where all the files were downloaded:

    ```bash
    python show_recommendations.py 4 user-ratings.txt moviedb.txt recommendations.txt
    ```

    This command looks at the recommendations generated for user ID 4.

   * The **user-ratings.txt** file is used to retrieve movies that have been rated.

   * The **moviedb.txt** file is used to retrieve the names of the movies.

   * The **recommendations.txt** is used to retrieve the movie recommendations for this user.

     The output from this command is similar to the following text:

       Seven Years in Tibet (1997), score=5.0
       Indiana Jones and the Last Crusade (1989), score=5.0
       Jaws (1975), score=5.0
       Sense and Sensibility (1995), score=5.0
       Independence Day (ID4) (1996), score=5.0
       My Best Friend's Wedding (1997), score=5.0
       Jerry Maguire (1996), score=5.0
       Scream 2 (1997), score=5.0
       Time to Kill, A (1996), score=5.0

## Delete temporary data

Mahout jobs do not remove temporary data that is created while processing the job. The `--tempDir` parameter is specified in the example job to isolate the temporary files into a specific path for easy deletion. To remove the temp files, use the following command:

```bash
hdfs dfs -rm -f -r /temp/mahouttemp
```

> [!WARNING]  
> If you want to run the command again, you must also delete the output directory. Use the following to delete this directory:
>
> `hdfs dfs -rm -f -r /example/data/mahoutout`


## Next steps

Now that you have learned how to use Mahout, discover other ways of working with data on HDInsight:

* [Apache Hive with HDInsight](hdinsight-use-hive.md)
* [Apache Pig with HDInsight](hdinsight-use-pig.md)
* [MapReduce with HDInsight](hdinsight-use-mapreduce.md)