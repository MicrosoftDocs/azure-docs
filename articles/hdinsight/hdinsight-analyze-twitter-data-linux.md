---
title: Analyze X data with Apache Hive - Azure HDInsight 
description: Learn how to use Apache Hive and Apache Hadoop on HDInsight to transform raw X data into a searchable Hive table.
ms.service: azure-hdinsight
ms.topic: how-to
ms.custom: H1Hack27Feb2017, hdinsightactive, linux-related-content
ms.date: 06/15/2024
---

# Analyze X data using Apache Hive and Apache Hadoop on HDInsight

Learn how to use [Apache Hive](https://hive.apache.org/) to process X data. The result is a list of X users who sent the most tweets that contain a certain word.

> [!IMPORTANT]  
> The steps in this document were tested on HDInsight 3.6.

## Get the data

X allows you to retrieve the data for each tweet as a JavaScript Object Notation (JSON) document through a REST API. [OAuth](https://oauth.net) is required for authentication to the API.

### Create an X application

1. From a web browser, sign in to [https://developer.x.com](https://developer.x.com). Select the **Sign-up now** link if you don't have an X account.

2. Select **Create New App**.

3. Enter **Name**, **Description**, **Website**. You can make up a URL for the **Website** field. The following table shows some sample values to use:

   | Field | Value |
   |--- |--- |
   | Name |MyHDInsightApp |
   | Description |MyHDInsightApp |
   | Website |`https://www.myhdinsightapp.com` |

4. Select **Yes, I agree**, and then select **Create your Twitter application**.

5. Select the **Permissions** tab. The default permission is **Read only**.

6. Select the **Keys and Access Tokens** tab.

7. Select **Create my access token**.

8. Select **Test OAuth** in the upper-right corner of the page.

9. Write down **consumer key**, **Consumer secret**, **Access token**, and **Access token secret**.

### Download tweets

The following Python code downloads 10,000 tweets from X and save them to a file named **tweets.txt**.

> [!NOTE]  
> The following steps are performed on the HDInsight cluster, since Python is already installed.

1. Use [ssh command](./hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. Use the following commands to install [Tweepy](https://www.tweepy.org/), [Progress bar](https://pypi.python.org/pypi/progressbar/2.2), and other required packages:

   ```bash
   sudo apt install python-dev libffi-dev libssl-dev
   sudo apt remove python-openssl
   python -m pip install virtualenv
   mkdir gettweets
   cd gettweets
   virtualenv gettweets
   source gettweets/bin/activate
   pip install tweepy progressbar pyOpenSSL requests[security]
   ```

1. Use the following command to create a file named **gettweets.py**:

   ```bash
   nano gettweets.py
   ```

1. Edit the code below by replacing `Your consumer secret`, `Your consumer key`, `Your access token`, and `Your access token secret` with the relevant information from your X application. Then paste the edited code as the contents of the **gettweets.py** file.

   ```python
   #!/usr/bin/python

   from tweepy import Stream, OAuthHandler
   from tweepy.streaming import StreamListener
   from progressbar import ProgressBar, Percentage, Bar
   import json
   import sys

   #X app information
   consumer_secret='Your consumer secret'
   consumer_key='Your consumer key'
   access_token='Your access token'
   access_token_secret='Your access token secret'

   #The number of tweets we want to get
   max_tweets=100

   #Create the listener class that receives and saves tweets
   class listener(StreamListener):
       #On init, set the counter to zero and create a progress bar
       def __init__(self, api=None):
           self.num_tweets = 0
           self.pbar = ProgressBar(widgets=[Percentage(), Bar()], maxval=max_tweets).start()

       #When data is received, do this
       def on_data(self, data):
           #Append the tweet to the 'tweets.txt' file
           with open('tweets.txt', 'a') as tweet_file:
               tweet_file.write(data)
               #Increment the number of tweets
               self.num_tweets += 1
               #Check to see if we have hit max_tweets and exit if so
               if self.num_tweets >= max_tweets:
                   self.pbar.finish()
                   sys.exit(0)
               else:
                   #increment the progress bar
                   self.pbar.update(self.num_tweets)
           return True

       #Handle any errors that may occur
       def on_error(self, status):
           print status

   #Get the OAuth token
   auth = OAuthHandler(consumer_key, consumer_secret)
   auth.set_access_token(access_token, access_token_secret)
   #Use the listener class for stream processing
   twitterStream = Stream(auth, listener())
   #Filter for these topics
   twitterStream.filter(track=["azure","cloud","hdinsight"])
   ```

    > [!TIP]  
    > Adjust the topics filter on the last line to track popular keywords. Using keywords popular at the time you run the script allows for faster capture of data.

1. Use **Ctrl + X**, then **Y** to save the file.

1. Use the following command to run the file and download tweets:

    ```bash
    python gettweets.py
    ```

    A progress indicator appears. It counts up to 100% as the tweets are downloaded.

   > [!NOTE]  
   > If it is taking a long time for the progress bar to advance, you should change the filter to track trending topics. When there are many tweets about the topic in your filter, you can quickly get the 100 tweets needed.

### Upload the data

To upload the data to HDInsight storage, use the following commands:

```bash
hdfs dfs -mkdir -p /tutorials/x/data
hdfs dfs -put tweets.txt /tutorials/x/data/tweets.txt
```

These commands store the data in a location that all nodes in the cluster can access.

## Run the HiveQL job

1. Use the following command to create a file containing [HiveQL](https://cwiki.apache.org/confluence/display/Hive/LanguageManual) statements:

   ```bash
   nano x.hql
   ```

    Use the following text as the contents of the file:

   ```hiveql
   set hive.exec.dynamic.partition = true;
   set hive.exec.dynamic.partition.mode = nonstrict;
   -- Drop table, if it exists
   DROP TABLE tweets_raw;
   -- Create it, pointing toward the tweets logged from X
   CREATE EXTERNAL TABLE tweets_raw (
       json_response STRING
   )
   STORED AS TEXTFILE LOCATION '/tutorials/x/data';
   -- Drop and recreate the destination table
   DROP TABLE tweets;
   CREATE TABLE tweets
   (
       id BIGINT,
       created_at STRING,
       created_at_date STRING,
       created_at_year STRING,
       created_at_month STRING,
       created_at_day STRING,
       created_at_time STRING,
       in_reply_to_user_id_str STRING,
       text STRING,
       contributors STRING,
       retweeted STRING,
       truncated STRING,
       coordinates STRING,
       source STRING,
       retweet_count INT,
       url STRING,
       hashtags array<STRING>,
       user_mentions array<STRING>,
       first_hashtag STRING,
       first_user_mention STRING,
       screen_name STRING,
       name STRING,
       followers_count INT,
       listed_count INT,
       friends_count INT,
       lang STRING,
       user_location STRING,
       time_zone STRING,
       profile_image_url STRING,
       json_response STRING
   );
   -- Select tweets from the imported data, parse the JSON,
   -- and insert into the tweets table
   FROM tweets_raw
   INSERT OVERWRITE TABLE tweets
   SELECT
       cast(get_json_object(json_response, '$.id_str') as BIGINT),
       get_json_object(json_response, '$.created_at'),
       concat(substr (get_json_object(json_response, '$.created_at'),1,10),' ',
       substr (get_json_object(json_response, '$.created_at'),27,4)),
       substr (get_json_object(json_response, '$.created_at'),27,4),
       case substr (get_json_object(json_response,    '$.created_at'),5,3)
           when "Jan" then "01"
           when "Feb" then "02"
           when "Mar" then "03"
           when "Apr" then "04"
           when "May" then "05"
           when "Jun" then "06"
           when "Jul" then "07"
           when "Aug" then "08"
           when "Sep" then "09"
           when "Oct" then "10"
           when "Nov" then "11"
           when "Dec" then "12" end,
       substr (get_json_object(json_response, '$.created_at'),9,2),
       substr (get_json_object(json_response, '$.created_at'),12,8),
       get_json_object(json_response, '$.in_reply_to_user_id_str'),
       get_json_object(json_response, '$.text'),
       get_json_object(json_response, '$.contributors'),
       get_json_object(json_response, '$.retweeted'),
       get_json_object(json_response, '$.truncated'),
       get_json_object(json_response, '$.coordinates'),
       get_json_object(json_response, '$.source'),
       cast (get_json_object(json_response, '$.retweet_count') as INT),
       get_json_object(json_response, '$.entities.display_url'),
       array(
           trim(lower(get_json_object(json_response, '$.entities.hashtags[0].text'))),
           trim(lower(get_json_object(json_response, '$.entities.hashtags[1].text'))),
           trim(lower(get_json_object(json_response, '$.entities.hashtags[2].text'))),
           trim(lower(get_json_object(json_response, '$.entities.hashtags[3].text'))),
           trim(lower(get_json_object(json_response, '$.entities.hashtags[4].text')))),
       array(
           trim(lower(get_json_object(json_response, '$.entities.user_mentions[0].screen_name'))),
           trim(lower(get_json_object(json_response, '$.entities.user_mentions[1].screen_name'))),
           trim(lower(get_json_object(json_response, '$.entities.user_mentions[2].screen_name'))),
           trim(lower(get_json_object(json_response, '$.entities.user_mentions[3].screen_name'))),
           trim(lower(get_json_object(json_response, '$.entities.user_mentions[4].screen_name')))),
       trim(lower(get_json_object(json_response, '$.entities.hashtags[0].text'))),
       trim(lower(get_json_object(json_response, '$.entities.user_mentions[0].screen_name'))),
       get_json_object(json_response, '$.user.screen_name'),
       get_json_object(json_response, '$.user.name'),
       cast (get_json_object(json_response, '$.user.followers_count') as INT),
       cast (get_json_object(json_response, '$.user.listed_count') as INT),
       cast (get_json_object(json_response, '$.user.friends_count') as INT),
       get_json_object(json_response, '$.user.lang'),
       get_json_object(json_response, '$.user.location'),
       get_json_object(json_response, '$.user.time_zone'),
       get_json_object(json_response, '$.user.profile_image_url'),
       json_response
   WHERE (length(json_response) > 500);
   ```

1. Press **Ctrl + X**, then press **Y** to save the file.

1. Use the following command to run the HiveQL contained in the file:

   ```bash
   beeline -u 'jdbc:hive2://headnodehost:10001/;transportMode=http' -i x.hql
   ```

    This command runs the **x.hql** file. Once the query completes, you see a `jdbc:hive2//localhost:10001/>` prompt.

1. From the beeline prompt, use the following query to verify that data was imported:

   ```hiveql
   SELECT name, screen_name, count(1) as cc
   FROM tweets
   WHERE text like "%Azure%"
   GROUP BY name,screen_name
   ORDER BY cc DESC LIMIT 10;
   ```

    This query returns a maximum of 10 tweets that contain the word **Azure** in the message text.

    > [!NOTE]  
    > If you changed the filter in the `gettweets.py` script, replace **Azure** with one of the filters you used.

## Next steps

You've learned how to transform an unstructured JSON dataset into a structured [Apache Hive](https://hive.apache.org/) table. To learn more about Hive on HDInsight, see the following documents:

* [Get started with HDInsight](hadoop/apache-hadoop-linux-tutorial-get-started.md)
* [Analyze flight delay data using HDInsight](./interactive-query/interactive-query-tutorial-analyze-flight-data.md)
