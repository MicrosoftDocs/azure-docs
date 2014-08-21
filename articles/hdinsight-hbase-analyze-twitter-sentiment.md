 <properties linkid="manage-services-hdinsight-howto-social-data" urlDisplayName="Analyze realt-time Twitter sentiment with Hbase in HDInsight" pageTitle="Analyze real-time Twitter sentiment with HBase in HDInsight | Azure" metaKeywords="" description="Learn how to do real-time analysis of big data using HBase in an HDInsight (Hadoop) cluster." metaCanonical="" services="HDInsight" documentationCenter="" title="Analyze real-time Twitter sentiment with HBase in HDInsight" authors="jgao" solutions="" manager="paulettm" editor="cgronlun" />

# Analyze real-time Twitter sentiment with HBase in HDInsight

Learn how to do real-time [sentiment analysis](http://en.wikipedia.org/wiki/Sentiment_analysis) of big data using HBase in an HDInsight (Hadoop) cluster.


Social web sites are one of the major driving forces for Big Data adoption. Public APIs provided by sites like Twitter are a useful source of data for analyzing and understanding popular trends. In this tutorial, you will develop a console streaming service application and an ASP.NET Web application to perform the following:

![][img-app-arch]

- Get geo-tagged Tweets in real-time using the Twitter streaming API.
- Evaluate the sentiment of these Tweets.
- Store the sentiment information in HBase using the Microsoft HBase SDK.
- Plot the real-time statistical results on Google maps using an ASP.NET Web application. A visualization of the tweets will look something like this:

	![hdinsight.hbase.twitter.sentiment.google.map][img-google-map]
	
	You will be able to query tweets with certain keywords to get a sense of the expressed opinion in tweets is positive, negative, or neutral.

A complete Visual Studio solution sample can be found at [https://github.com/maxluk/tweet-sentiment](https://github.com/maxluk/tweet-sentiment).






























##In this article

- [Prerequisites](#prerequisites)
- [Create a Twitter application](#twitter)
- [Create a simple Twitter streaming service](#streaming)
- [Create an Azure Website to visualize Twitter sentiment](#web)
- [Next steps](#nextsteps)

##<a id="prerequisites"></a>Prerequisites
Before you begin this tutorial, you must have the following:

- **An HBase cluster in HDInsight**. For instructions on cluster provision, see [Get started using HBase with Hadoop in HDInsight][hBase-get-started]. You will need the following data to go through the tutorial:

	<table border="1">
	<tr><th>Cluster property</th><th>Description</th></tr>
	<tr><td>HBase cluster name</td><td>This is your HDInsight HBase cluster name. For example: https://myhbase.azurehdinsight.net/</td></tr>
	<tr><td>Cluster user name</td><td>The Hadoop user account name. The default Hadoop username is <strong>admin</strong>.</td></tr>
	<tr><td>Cluster user password</td><td>The Hadoop cluster user password.</td></tr>
	</table>

- **A workstation** with Visual Studio 2013 installed. For instructions, see [Installing Visual Studio](http://msdn.microsoft.com/en-us/library/e2h7fzkw.aspx).





##<a id="twitter"></a>Create a Twitter application ID and secrets

The Twitter Streaming APIs use [OAuth](http://oauth.net/) to authorize requests. 

The first step to use OAuth is to create a new application on the Twitter Developer site.

**To create Twitter application ID and secrets:**

1. Sign in to [https://apps.twitter.com/](https://apps.twitter.com/).Click the **Sign up now** link if you don't have a Twitter account.
2. Click **Create New App**.
3. Enter **Name**, **Description**, **Website**. The Website field is not really used. It doesn't have to be a valid URL. The following table shows some sample values to use:

	<table border="1">
	<tr><th>Field</th><th>Value</th></tr>
	<tr><td>Name</td><td>MyHDInsightHBaseApp</td></tr>
	<tr><td>Description</td><td>MyHDInsightHBaseApp</td></tr>
	<tr><td>Website</td><td>http://www.myhdinsighthbaseapp.com</td></tr>
	</table>

4. Check **Yes, I agree**, and then click **Create your Twitter application**.
5. Click the **Permissions** tab. The default permission is **Read only**. This is sufficient for this tutorial. 
6. Click the **API Keys** tab.
7. Click **Create my access token**.
8. Click **Test OAuth** in the upper right corner of the page.
9. Write down **API key**, **API secret**, **Access token**, and **Access token secret**. You will need the values later in the tutorial.

	![hdi.hbase.twitter.sentiment.twitter.app][img-twitter-app]






























##<a id="streaming"></a> Create a simple Twitter streaming service

Create a console application to get Tweets, calculate Tweet sentiment score and send the processed Tweet words to HBase.

**To create the  Visual Studio solution:**

1. Open **Visual Studio**.
2. From the **File** menu, point to **New**, and then click **Project**.
3. Type or select the following values:

	- Templates: **Visual C#**
	- Template: **Console Application**
	- Name: **TweetSentimentStreaming** 
	- Location: **C:\Tutorials**
	- Solution name: **TweetSentimentStreaming**

4. Click **OK** to continue.
 


**To install Nuget packages and add SDK references:**

1. From the **Tools** menu, click **Nuget Package Manager**, and then click **Package Manager Console**. The console panel will open at the bottom of the page.
2. Use the following commands to install the [Tweetinvi](https://www.nuget.org/packages/TweetinviAPI/) package, which is used to access the Twitter API, and the [Protobuf-net](https://www.nuget.org/packages/protobuf-net/) package, which is used to serialize and deserialize objects.

		Install-Package TweetinviAPI
		Install-Package protobuf-net 

	> [WACOM.NOTE] The Microsoft Hbase SDK Nuget package is not available as of August 20th, 2014. The Github repo is [https://github.com/hdinsight/hbase-sdk-for-net](https://github.com/hdinsight/hbase-sdk-for-net). Until the SDK is available, you must build the dll yourself.

3. From **Solution Explorer**, right-click **References**, and then click **Add Reference**.
4. In the left pane, expand **Assemblies**, and then click **Framework**.
5. In the right pane, select the checkbox in front of **System.Configuration**, and then click **OK**.



**To define the Tweeter streaming service class:**

1. From **Solution explorer**, right-click **TweetSentimentStreaming**, point to **Add**, and then click **Class**.
2. In **Name**, type **HBaseWriter**, and then click **Add**.
3. In **HBaseWriter.cs**, add the following using statements on the top of the file:

		using System.IO;		
		using System.Threading;
		using System.Globalization;
		using Microsoft.HBase.Client;
		using Tweetinvi.Core.Interfaces;
		using org.apache.hadoop.hbase.rest.protobuf.generated;

4. Inside **HbaseWriter.cs**, add a new class call **DictionaryItem**:

	    public class DictionaryItem
	    {
	        public string Type { get; set; }
	        public int Length { get; set; }
	        public string Word { get; set; }
	        public string Pos { get; set; }
	        public string Stemmed { get; set; }
	        public string Polarity { get; set; }
	    }

	This class structure is used to parse the sentiment dictionary file. The data is used to calculate sentiment score for each Tweet.

5. Inside the **HBaseWriter** class, define the following constants and variables:

        // HDinsight HBase cluster and HBase table information
        const string CLUSTERNAME = "https://<HBaseClusterName>.azurehdinsight.net/";
        const string HADOOPUSERNAME = "<HadoopUserName>"; //the default name is "admin"
        const string HADOOPUSERPASSWORD = "<HaddopUserPassword>";
        const string HBASETABLENAME = "tweets_by_words";

        // Sentiment dictionary file and the punctuation characters
        const string DICTIONARYFILENAME = @"..\..\data\dictionary\dictionary.tsv";
        private static char[] _punctuationChars = new[] { 
            ' ', '!', '\"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/',   //ascii 23--47
            ':', ';', '<', '=', '>', '?', '@', '[', ']', '^', '_', '`', '{', '|', '}', '~' };   //ascii 58--64 + misc.

        // For writting to HBase
        HBaseClient client;

        // a sentiment dictionary for estimate sentiment. It is loaded from a physical file.
        Dictionary<string, DictionaryItem> dictionary;
        
        // use multithread write
        Thread writerThread;
        Queue<ITweet> queue = new Queue<ITweet>();
        bool threadRunning = true;

6. Set the constant values, including **&lt;HBaseClusterName>**, **&lt;HadoopUserName>**, and **&lt;HaddopUserPassword>**. If you want to change the HBase table name, you must change the table name in the Web application accordingly.

	You will download and move the dictionary.tsv file to a specific folder later in the tutorial.

7. Define the following functions inside the **HBaseWriter** class:

		// This function connects to HBase, loads the sentiment dictionary, and starts the thread for writting.
        public HBaseWriter()
        {
            ClusterCredentials credentials = new ClusterCredentials(new Uri(CLUSTERNAME), HADOOPUSERNAME, HADOOPUSERPASSWORD);
            client = new HBaseClient(credentials);

            // create the HBase table if it doesn't exist
            if (!client.ListTables().name.Contains(HBASETABLENAME))
            {
                TableSchema tableSchema = new TableSchema();
                tableSchema.name = HBASETABLENAME;
                tableSchema.columns.Add(new ColumnSchema { name = "d" });
                client.CreateTable(tableSchema);
                Console.WriteLine("Table \"{0}\" is created.", HBASETABLENAME);
            }

            // Load sentiment dictionary from a file
            LoadDictionary();

			// Start a thread for writting to HBase
            writerThread = new Thread(new ThreadStart(WriterThreadFunction));
            writerThread.Start();
        }

        ~HBaseWriter()
        {
            threadRunning = false;
        }

        // Enqueue the Tweets received
        public void WriteTweet(ITweet tweet)
        {
            lock (queue)
            {
                queue.Enqueue(tweet);
            }
        }

        // Load sentiment dictionary from a file
        private void LoadDictionary()
        {
            List<string> lines = File.ReadAllLines(DICTIONARYFILENAME).ToList();
            var items = lines.Select(line =>
            {
                var fields = line.Split('\t');
                var pos = 0;
                return new DictionaryItem
                {
                    Type = fields[pos++],
                    Length = Convert.ToInt32(fields[pos++]),
                    Word = fields[pos++],
                    Pos = fields[pos++],
                    Stemmed = fields[pos++],
                    Polarity = fields[pos++]
                };
            });

            dictionary = new Dictionary<string, DictionaryItem>();
            foreach (var item in items)
            {
                if (!dictionary.Keys.Contains(item.Word))
                {
                    dictionary.Add(item.Word, item);
                }
            }
        }

        // Calculate sentiment score
        private int CalcSentimentScore(string[] words)
        {
            Int32 total = 0;
            foreach (string word in words)
            {
                if (dictionary.Keys.Contains(word))
                {
                    switch (dictionary[word].Polarity)
                    {
                        case "negative": total -= 1; break;
                        case "positive": total += 1; break;
                    }
                }
            }
            if (total > 0)
            {
                return 1;
            }
            else if (total < 0)
            {
                return -1;
            }
            else
            {
                return 0;
            }
        }

		// Popular a CellSet object to be written into HBase
        private void CreateTweetByWordsCells(CellSet set, ITweet tweet)
        {
            // Split the Tweet into words
            string[] words = tweet.Text.ToLower().Split(_punctuationChars);

            // Calculate sentiment score base on the words
            int sentimentScore = CalcSentimentScore(words);
            var word_pairs = words.Take(words.Length - 1)
                                  .Select((word, idx) => string.Format("{0} {1}", word, words[idx + 1]));
            var all_words = words.Concat(word_pairs).ToList();

            // For each word in the Tweet add a row to the HBase table
            foreach (string word in all_words)
            {
                string time_index = (ulong.MaxValue - (ulong)tweet.CreatedAt.ToBinary()).ToString().PadLeft(20) + tweet.IdStr;
                string key = word + "_" + time_index;

                // Create a row
                var row = new CellSet.Row { key = Encoding.UTF8.GetBytes(key) };

                // Add columns to the row, including Tweet identifier, language, coordinator(if available), and sentiment 
                var value = new Cell { column = Encoding.UTF8.GetBytes("d:id_str"), data = Encoding.UTF8.GetBytes(tweet.IdStr) };
                row.values.Add(value);
                
                value = new Cell { column = Encoding.UTF8.GetBytes("d:lang"), data = Encoding.UTF8.GetBytes(tweet.Language.ToString()) };
                row.values.Add(value);
                
                if (tweet.Coordinates != null)
                {
                    var str = tweet.Coordinates.Longitude.ToString() + "," + tweet.Coordinates.Latitude.ToString();
                    value = new Cell { column = Encoding.UTF8.GetBytes("d:coor"), data = Encoding.UTF8.GetBytes(str) };
                    row.values.Add(value);
                }

                value = new Cell { column = Encoding.UTF8.GetBytes("d:sentiment"), data = Encoding.UTF8.GetBytes(sentimentScore.ToString()) };
                row.values.Add(value);

                set.rows.Add(row);
            }
        }

        // Write a Tweet (CellSet) to HBase
        public void WriterThreadFunction()
        {
            try
            {
                while (threadRunning)
                {
                    if (queue.Count > 0)
                    {
                        CellSet set = new CellSet();
                        lock (queue)
                        {
                            do
                            {
                                ITweet tweet = queue.Dequeue();
                                CreateTweetByWordsCells(set, tweet);
                            } while (queue.Count > 0);
                        }

                        // Write the Tweet by words cell set to the HBase table
                        client.StoreCells(HBASETABLENAME, set);
                        Console.WriteLine("\tRows written: {0}", set.rows.Count);
                    }
                    Thread.Sleep(100);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception: " + ex.Message);
            }
        }

	The code provides the following functionality:

	- **Connect to Hbase [ HBaseWriter() ]**: Use the HBase SDK to create a *ClusterCredentials* object with the cluster URL and the Hadoop user credential, and then create a *HBaseClient* object using the ClusterCredentials object.
	- **Create HBase table [ HBaseWriter() ]**: The method call is *HBaseClient.CreateTable()*.
	- **Write to HBase table [ WriterThreadFunction() ]**: The method call is *HBaseClient.StoreCells()*.

**To complete the Program.cs:**

1. From **Solution Explorer**, double-click **Program.cs** to open it.
2. At the beginning of the file, add the following using statements:

		using System.Configuration;
		using System.Diagnostics;
		using Tweetinvi;

3. Inside the **Program** class, define the following constants:

        const string TWITTERAPPACCESSTOKEN = "<TwitterApplicationAccessToken";
        const string TWITTERAPPACCESSTOKENSECRET = "TwitterApplicationAccessTokenSecret";
        const string TWITTERAPPAPIKEY = "TwitterApplicationAPIKey";
        const string TWITTERAPPAPISECRET = "TwitterApplicationAPISecret";

4. Set the constant values to match your Twitter application values.

3. Modify the **Main()** function, so it looks like:

		static void Main(string[] args)
		{
            TwitterCredentials.SetCredentials(TWITTERAPPACCESSTOKEN, TWITTERAPPACCESSTOKENSECRET, TWITTERAPPAPIKEY, TWITTERAPPAPISECRET);

            Stream_FilteredStreamExample();
		}

4. Add the following function to the class:

        private static void Stream_FilteredStreamExample()
        {
            for (; ; )
            {
                try
                {
                    HBaseWriter hbase = new HBaseWriter();
                    var stream = Stream.CreateFilteredStream();
                    stream.AddLocation(Geo.GenerateLocation(-180, -90, 180, 90));

                    var tweetCount = 0;
                    var timer = Stopwatch.StartNew();

                    stream.MatchingTweetReceived += (sender, args) =>
                    {
                        tweetCount++;
                        var tweet = args.Tweet;

                        // Write Tweets to HBase
                        hbase.WriteTweet(tweet);

                        if (timer.ElapsedMilliseconds > 1000)
                        {
                            if (tweet.Coordinates != null)
                            {
                                Console.ForegroundColor = ConsoleColor.Green;
                                Console.WriteLine("\n{0}: {1} {2}", tweet.Id, tweet.Language.ToString(), tweet.Text);
                                Console.ForegroundColor = ConsoleColor.White;
                                Console.WriteLine("\tLocation: {0}, {1}", tweet.Coordinates.Longitude, tweet.Coordinates.Latitude);
                            }

                            timer.Restart();
                            Console.WriteLine("\tTweets/sec: {0}", tweetCount);
                            tweetCount = 0;
                        }
                    };

                    stream.StartStreamMatchingAllConditions();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Exception: {0}", ex.Message);
                }
            }
        }

**To download the sentiment dictionary file:**

1. Browse to [https://github.com/maxluk/tweet-sentiment](https://github.com/maxluk/tweet-sentiment).
2. Click **Download ZIP**.
3. Extract the file locally.
4. Copy the file from **../tweet-sentiment/SimpleStreamingService/data/dictionary/dictionary.tsv**.
5. Paste the file to your solution under **TweetSentimentStreaming/TweetSentimentStreaming/data/dictionary/dictionary.tsv**.

**To run the streaming service:**

1. From Visual Studio, press **F5**. The following is the console application screenshot:

	![hdinsight.hbase.twitter.sentiment.streaming.service][img-streaming-service]
2. Keep the streaming console application running while you developing the Web application, So you have more data to use.



























##<a id="web"></a> Create an Azure Website to visualize Twitter sentiment

In this section, you will create a ASP.NET MVC Web application to read the real-time sentiment data from HBase and plot the data on Google maps.

**To create a ASP.NET MVC Web application:**

1. Open Visual Studio.
2. Click **File**, click **New**, and then click **Project**.
3. Type or enter the following:

	- Template category: **Visual C#/Web**
	- Template: **ASP.NET Web Application**
	- Name: **TweetSentimentWeb**
	- Location: **C:\Tutorials** 
4. Click **OK**.
5. In **Select a template**, click **MVC**. 
6. In **Windows Azure**, click **Manage Subscriptions**.
7. From **Manage Windows Azure Subscriptions**, click **Sign in**.
8. Enter your Azure credential. Your Azure subscription information will be shown on the Accounts tab.
9. Click **Close** to close the Manage Windows Azure Subscriptions window.
10. From **New ASP.NET Project - TweetSentimentWeb**, Click **OK**.
11. From **Configure Windows Azure Site Settings**, select the **Region** that is closer to you. You don't need to specify a database server. Remember the Site name (TweetSentiment4265).
12. Click **OK**.

**To install Nuget packages:**

1. From the **Tools** menu, click **Nuget Package Manager**, and then click **Package Manager Console**. The console panel is opened at the bottom of the page.
2. Use the following command to install the [Protobuf-net](https://www.nuget.org/packages/protobuf-net/) package, which is used to serialize and deserialize objects.

		Install-Package protobuf-net 

	> [WACOM.NOTE] The Microsoft Hbase SDK Nuget package is not available as of August 20th, 2014. The Github repo is [https://github.com/hdinsight/hbase-sdk-for-net](https://github.com/hdinsight/hbase-sdk-for-net). Until the SDK is available, you must build the dll yourself.

**To add HBaseReader class:**

1. From **Solution Explorer**, expand **TweetSentiment**.
2. Right-click **Models**, click **Add**, and then click **Class**.
3. In Name, enter **HBaseReader.cs**, and then click **Add**.
4. Add the following Using statements on the top of the file:

		using System.Configuration;
		using System.Threading.Tasks;
		using System.Text;
		using Microsoft.HBase.Client;
		using org.apache.hadoop.hbase.rest.protobuf.generated;

4. Add a Tweet class to the file:

	    public class Tweet
	    {
	        public string IdStr { get; set; }
	        public string Text { get; set; }
	        public string Lang { get; set; }
	        public double Longtitude { get; set; }
	        public double Latitude { get; set; }
	        public int Sentiment { get; set; }
	    }

4. Inside the **HBaseReader** class, define the following constants and variables:

        // For reading Tweet sentiment data from HDInsight HBase
        HBaseClient client;

        // HDinsight HBase cluster and HBase table information
        const string CLUSTERNAME = "https://<HBaseClusterName>.azurehdinsight.net/";
        const string HADOOPUSERNAME = "<HadoopUserName>"; //the default name is "admin"
        const string HADOOPUSERPASSWORD = "<HaddopUserPassword>";
        const string HBASETABLENAME = "tweets_by_words";

6. Set the constant values, including **&lt;HBaseClusterName>**, **&lt;HadoopUserName>**, and **&lt;HaddopUserPassword>**. The HBase table name is "tweets_by_words". The values must match the values you sent in the streaming service, so that the Web application reads the data from the same HBase table.

4. Inside the **HBaseReader** class, define the following functions:

        public HBaseReader()
        {
            ClusterCredentials creds = new ClusterCredentials(
                            new Uri(CLUSTERNAME),
                            HADOOPUSERNAME,
                            HADOOPUSERPASSWORD);
            client = new HBaseClient(creds);
        }

        public async Task<IEnumerable<Tweet>> QueryTweetsByKeywordAsync(string keyword)
        {
            // verify the HBase table
            var list = new List<Tweet>();
            Boolean exists = await CheckTable();

            if (!exists)
            {
                return list;
            }

            // Scan the HBase table with the keywords
            string startRow = keyword + "_";
            string endRow = keyword + "|";
            var scanSettings = new Scanner { 
                batch = 100000, 
                startRow = Encoding.UTF8.GetBytes(startRow), 
                endRow = Encoding.UTF8.GetBytes(endRow) };
            ScannerInformation scannerInfo = await client.CreateScannerAsync(HBASETABLENAME, scanSettings);

            CellSet next;
            while ((next = await client.ScannerGetNextAsync(scannerInfo)) != null)
            {
                // Parse the rows retrieved from HBase 
                foreach (CellSet.Row row in next.rows)
                {
                    var coordinates = row.values.Find(c => Encoding.UTF8.GetString(c.column) == "d:coor");
                    if (coordinates != null)
                    {
                        var lonlat = Encoding.UTF8.GetString(coordinates.data).Split(',');

                        var sentimentField = row.values.Find(c => Encoding.UTF8.GetString(c.column) == "d:sentiment");
                        var sentiment = 0;
                        if (sentimentField != null)
                        {
                            sentiment = Convert.ToInt32(Encoding.UTF8.GetString(sentimentField.data));
                        }

                        list.Add(new Tweet
                        {
                            Longtitude = Convert.ToDouble(lonlat[0]),
                            Latitude = Convert.ToDouble(lonlat[1]),
                            Sentiment = sentiment
                        });
                    }

                    if (coordinates != null)
                    {
                        var lonlat = Encoding.UTF8.GetString(coordinates.data).Split(',');
                    }
                }
            }

            return list;
        }

        internal async Task<bool> CheckTable()
        {
            return (await client.ListTablesAsync()).name.Contains(HBASETABLENAME);
        }


**To add TweetsController controller:**

1. From **Solution Explorer**, expand **TweetSentimentWeb**.
2. Right-click **Controllers**, click **Add**, and then click **Controller**.
3. Click **Web API 2 Controller - Empty**, and then click **Add**.
4. In Controller name, type **TweetsController**, and then click **Add**.
5. From **Solution Explorer**, double-click TweetsController.cs to open the file.
5. Add the following using statements to the beginning of the file:

		using System.Threading.Tasks;
		using TweetSentimentWeb.Models;

5. Copy and paste the following code into the TweetsController class:

        HBaseReader hbase = new HBaseReader();

        public async Task<IEnumerable<Tweet>> GetTweetsByQuery(string query)
        {
            return await hbase.QueryTweetsByKeywordAsync(query);
        }

**To add tweetStream.js:**

1. From **Solution Explorer**, expand **TweetSentimentWeb**.
2. Right-click **Scripts**, click **Add**, click **JavaScript File**.
3. In Item name, enter **twitterStream.js**.
4. Copy and paste the following code into the file:

		var liveTweetsPos = new google.maps.MVCArray();
		var liveTweets = new google.maps.MVCArray();
		var liveTweetsNeg = new google.maps.MVCArray();
		var map;
		var heatmap;
		var heatmapNeg;
		var heatmapPos;
		
		function initialize() {
		
		    //Setup Google Map
		    var myLatlng = new google.maps.LatLng(17.7850, -12.4183);
		    var light_grey_style = [
		        {"featureType": "landscape", "stylers":[{ "saturation": -100 },{ "lightness": 65 }, { "visibility": "on" }]},
		        { "featureType": "poi", "stylers": [{ "saturation": -100 }, { "lightness": 51 }, { "visibility": "simplified" }] },
		        { "featureType": "road.highway", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] },
		        { "featureType": "road.arterial", "stylers": [{ "saturation": -100 }, { "lightness": 30 }, { "visibility": "on" }] },
		        { "featureType": "road.local", "stylers": [{ "saturation": -100 }, { "lightness": 40 }, { "visibility": "on" }] },
		        { "featureType": "transit", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] },
		        { "featureType": "administrative.province", "stylers": [{ "visibility": "off" }] },
		        { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": -25 }, { "saturation": -100 }] },
		        { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] }];
		    var myOptions = {
		        zoom: 3,
		        center: myLatlng,
		        mapTypeId: google.maps.MapTypeId.ROADMAP,
		        mapTypeControl: true,
		        mapTypeControlOptions: {
		            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
		            position: google.maps.ControlPosition.LEFT_BOTTOM
		        },
		        styles: light_grey_style
		    };
		
		    var mapElement = document.getElementById("map_canvas");
		
		    map = new google.maps.Map(mapElement, myOptions);
		
		    //Setup heat map and link to Twitter array we will append data to
		    heatmap = new google.maps.visualization.HeatmapLayer({
		        data: liveTweets,
		        radius: 25
		    });
		
		    heatmapNeg = new google.maps.visualization.HeatmapLayer({
		        data: liveTweetsNeg,
		        radius: 25
		    });
		
		    heatmapPos = new google.maps.visualization.HeatmapLayer({
		        data: liveTweetsPos,
		        radius: 25
		    });
		
		    heatmap.setMap(map);
		
		    var gradientNeg = [
		        'rgba(0, 255, 255, 0)',
		        'rgba(0, 255, 255, 1)',
		        'rgba(0, 191, 255, 1)',
		        'rgba(0, 127, 255, 1)',
		        'rgba(0, 63, 255, 1)',
		        'rgba(0, 0, 255, 1)',
		        'rgba(0, 0, 223, 1)',
		        'rgba(0, 0, 191, 1)',
		        'rgba(0, 0, 159, 1)',
		        'rgba(0, 0, 127, 1)',
		        'rgba(63, 0, 91, 1)',
		        'rgba(127, 0, 63, 1)',
		        'rgba(191, 0, 31, 1)',
		        'rgba(255, 0, 0, 1)'
		    ]
		    var gradientPos = [
		      'rgba(0, 255, 255, 0)',
		      'rgba(0, 255, 255, 1)',
		      'rgba(0, 255, 191, 1)',
		      'rgba(0, 255, 127, 1)',
		      'rgba(0, 255, 63, 1)',
		      'rgba(0, 127, 0, 1)',
		      'rgba(0, 159, 0, 1)',
		      'rgba(0, 191, 0, 1)'
		    ]
		
		    heatmapNeg.set('gradient', gradientNeg);
		
		    //Add tweet to the heat map array.
		    var tweetLocation = new google.maps.LatLng(40, -120);
		    liveTweets.push(tweetLocation);
		
		    //Add tweet to the heat map array.
		    var tweetLocationNeg = new google.maps.LatLng(40, -120);
		    liveTweetsNeg.push(tweetLocationNeg);
		
		    $("#neutralBtn").button("toggle");
		}
		
		function onsearch() {
		    var uri = 'api/tweets?query=';
		    var query = $('#searchbox').val();
		    $.getJSON(uri + query)
		        .done(function (data) {
		            liveTweetsPos.clear();
		            liveTweets.clear();
		            liveTweetsNeg.clear();
		
		            // On success, 'data' contains a list of tweets.
		            $.each(data, function (key, item) {
		                addTweet(item);
		            });
		
		            if (!$("#neutralBtn").hasClass('active')) {
		                $("#neutralBtn").button("toggle");
		            }
		            onNeutralBtn();
		        })
		        .fail(function (jqXHR, textStatus, err) {
		            $('#statustext').text('Error: ' + err);
		        });
		}
		
		function addTweet(item) {
		    //Add tweet to the heat map array.
		    var tweetLocation = new google.maps.LatLng(item.Latitude, item.Longtitude);
		    if (item.Sentiment > 0) {
		        liveTweetsPos.push(tweetLocation);
		    } else if (item.Sentiment < 0) {
		        liveTweetsNeg.push(tweetLocation);
		    } else {
		        liveTweets.push(tweetLocation);
		    }
		}
		
		function onPositiveBtn() {
		    if ($("#neutralBtn").hasClass('active')) {
		        $("#neutralBtn").button("toggle");
		    }
		    if ($("#negativeBtn").hasClass('active')) {
		        $("#negativeBtn").button("toggle");
		    }
		
		    heatmapPos.setMap(map);
		    heatmapNeg.setMap(null);
		    heatmap.setMap(null);
		
		    $('#statustext').text('Tweets: ' + liveTweetsPos.length);
		}
		
		function onNeutralBtn() {
		    if ($("#positiveBtn").hasClass('active')) {
		        $("#positiveBtn").button("toggle");
		    }
		    if ($("#negativeBtn").hasClass('active')) {
		        $("#negativeBtn").button("toggle");
		    }
		
		    heatmap.setMap(map);
		    heatmapNeg.setMap(null);
		    heatmapPos.setMap(null);
		
		    $('#statustext').text('Tweets: ' + liveTweets.length);
		}
		
		function onNegativeBtn() {
		    if ($("#positiveBtn").hasClass('active')) {
		        $("#positiveBtn").button("toggle");
		    }
		    if ($("#neutralBtn").hasClass('active')) {
		        $("#neutralBtn").button("toggle");
		    }
		
		    heatmapNeg.setMap(map);
		    heatmap.setMap(null);
		    heatmapPos.setMap(null);
		
		    $('#statustext').text('Tweets: ' + liveTweetsNeg.length);
		}

	This JavaScript file contains the GUI controls.

**To modify the layout.cshtml:**

1. From **Solution Explorer**, expand **TweetSentimentWeb**, expand **Views**, expand **Shared**, and then double-click _**Layout.cshtml**.
2. Append the following code inside the **&lt;head>** tag:

	    <!-- Google Maps -->
	    <link href="https://google-developers.appspot.com/maps/documentation/javascript/examples/default.css" rel="stylesheet" type="text/css" />
	    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false&libraries=visualization"></script>
	
	    <!-- Spatial Dashboard JavaScript -->
	    <script src="~/Scripts/twitterStream.js" type="text/javascript"></script>

3. Modify the **&lt;body>** tag, so the &lt;body> tag looks like the following:

		<body onload ="initialize()">
		    <div class="navbar navbar-inverse navbar-fixed-top">
		        <div class="container">
		            <div class="navbar-header">
		                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
		                    <span class="icon-bar"></span>
		                    <span class="icon-bar"></span>
		                    <span class="icon-bar"></span>
		                </button>
		            </div>
		
		            <div class="navbar-collapse collapse">
		                <div class="row">
		                    <ul class="nav navbar-nav col-lg-5">
		                        <li class="col-lg-12">
		                            <div class="navbar-form">
		                                <input id="searchbox" type="search" class="form-control">
		                                <button type="button" class="btn btn-primary" onclick="onsearch();">Go</button>
		                            </div>
		                        </li>
		                    </ul>
		                    <ul class="nav navbar-nav col-lg-4">
		                        <li>
		                            <div class="navbar-form">
		                                <div class="btn-group" data-toggle="buttons-radio">
		                                    <button type="button" id="positiveBtn" class="btn btn-primary" onclick="onPositiveBtn();">Positive</button>
		                                    <button type="button" id="neutralBtn" class="btn btn-primary" onclick="onNeutralBtn();">Neutral</button>
		                                    <button type="button" id="negativeBtn" class="btn btn-primary" onclick="onNegativeBtn();">Negative</button>
		                                </div>
		                            </div>
		                        </li>
		                        @*<li class="divider-vertical"></li>
		                <li>@Html.ActionLink("Home", "Index", "Home")</li>
		            <li>@Html.ActionLink("About", "About", "Home")</li>
		            <li>@Html.ActionLink("Contact", "Contact", "Home")</li>*@
		                        <li><span id="statustext" class="navbar-text"></span></li>
		                    </ul>
		                </div>
		            </div>
		        </div>
		    </div>
		    @*"container body-content"*@
		    <div class="map_container">
		        @RenderBody()
		        <hr />
		        <footer>
		            <p>&copy; @DateTime.Now.Year - My ASP.NET Application</p>
		        </footer>
		    </div>
		
		    @Scripts.Render("~/bundles/jquery")
		    @Scripts.Render("~/bundles/bootstrap")
		    @RenderSection("scripts", required: false)
		</body>

	The _layout.cshtml file defines the web page appearance.

**To modify the site.css file:**

1. From **Solution Explorer**, expand **TweetSentimentWeb**, expand **Content**, and then double-click **Site.css**.
2. Append the following code to the file.
		
		/* make container, and thus map, 100% width */
		.map_container {
			width: 100%;
			height: 100%;
		}
		
		#map_canvas{
		  height:100%;
		}
		
		#tweets{
		  position: absolute;
		  top: 60px;
		  left: 75px;
		  z-index:1000;
		  font-size: 30px;
		}

**To modify the global.asax file:**

1. From **Solution Explorer**, expand **TweetSentimentWeb**, and then double-click **Global.asax**.
2. Add the following using statement:

		using System.Web.Http;

2. Add the following lines inside the **Application_Start()** function:

		// Register API routes
		GlobalConfiguration.Configure(WebApiConfig.Register);
  
	Modify the registration of the API routes to make Web API controller work inside of the MVC application.

**To run the Web application:**

1. Verify the streaming service console application is still running. So you can see the real-time changes.
2. Press **F5** to run the web application:

	![hdinsight.hbase.twitter.sentiment.google.map][img-google-map]
2. In the text box, enter a keyword, and then click **Go**.  Depending on the data collected in the HBase table, some keywords might not be found. Try some common keywords, such as "love", "xbox", "playstation" and so on. 
3. Toggle among **Positive**, **Neutral**, and **Negative** to compare sentiment on the subject.
4. Let the streaming service running for another hour, and then search the same keyword, and compare the results.

 
Optionally, you can deploy the application to an Azure Web site.  For instructions, see [Get started with Azure Web Sites and ASP.NET][website-get-started].
 
##<a id="nextsteps"></a>Next Steps

In this tutorial we have learned how to get Tweets, analyze the sentiment of Tweets, save the sentiment data to HBase, and present the real-time Twitter sentiment data to Google maps. To learn more, see:

- [Get started with HDInsight][hdinsight-get-started]
- [Analyze Twitter data with Hadoop in HDInsight][hdinsight-analyze-twitter-data]
- [Analyze flight delay data using HDInsight][hdinsight-analyze-flight-delay-data]
- [Develop C# Hadoop streaming programs for HDInsight][hdinsight-develop-streaming]
- [Develop Java MapReduce programs for HDInsight][hdinsight-develop-mapreduce]


[hbase-get-started]: ../hdinsight-hbase-get-started/
[website-get-started]: ../web-sites-dotnet-get-started/



[img-app-arch]: ./media/hdinsight-hbase-analyze-twitter-sentiment/AppArchitecture.png
[img-twitter-app]: ./media/hdinsight-hbase-analyze-twitter-sentiment/TwitterApp.png
[img-streaming-service]: ./media/hdinsight-hbase-analyze-twitter-sentiment/StreamingService.png
[img-google-map]: ./media/hdinsight-hbase-analyze-twitter-sentiment/TwitterSentimentGoogleMap.png



[hdinsight-develop-streaming]: ../hdinsight-hadoop-develop-deploy-streaming-jobs/
[hdinsight-develop-mapreduce]: ../hdinsight-develop-deploy-java-mapreduce/
[hdinsight-analyze-twitter-data]: ../hdinsight-analyze-twitter-data/





[curl]: http://curl.haxx.se
[curl-download]: http://curl.haxx.se/download.html

[apache-hive-tutorial]: https://cwiki.apache.org/confluence/display/Hive/Tutorial

[twitter-streaming-api]: https://dev.twitter.com/docs/streaming-apis
[twitter-statuses-filter]: https://dev.twitter.com/docs/api/1.1/post/statuses/filter

[powershell-start]: http://technet.microsoft.com/en-us/library/hh847889.aspx
[powershell-install]: ../install-configure-powershell
[powershell-script]: http://technet.microsoft.com/en-us/library/ee176949.aspx

[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-storage-powershell]: ../hdinsight-use-blob-storage/#powershell
[hdinsight-analyze-flight-delay-data]: ../hdinsight-analyze-flight-delay-data/
[hdinsight-storage]: ../hdinsight-use-blob-storage/
[hdinsight-use-sqoop]: ../hdinsight-use-sqoop/
[hdinsight-power-query]: ../hdinsight-connect-excel-power-query/
[hdinsight-hive-odbc]: ../hdinsight-connect-excel-hive-ODBC-driver/

