<properties linkid="develop-dotnet-hadoop-recommendation-engine" urlDisplayName="Hadoop Recommendation Engine" pageTitle="Hadoop recommendation engine (.NET) - Windows Azure tutorials" metaKeywords="Azure Apache Mahout, Azure recommendation example, Azure recommendation tutorial, Azure recommendation engine" metaDescription="A tutorial that teaches how to use the Apache Mahout recommendation engine with Windows Azure to create song suggestions based on listening habits." metaCanonical="" disqusComments="1" umbracoNaviHide="1" writer="wenming"/>


# Simple recommendation engine using Apache Mahout 

Apache Mahout™ is a machine learning library built for use in scalable machine learning applications. Recommender engines are some of the most immediately recognizable machine learning applications in use today. In this tutorial you use the  [Million Song Dataset](http://labrosa.ee.columbia.edu/millionsong/tasteprofile) site and download the [dataset](http://labrosa.ee.columbia.edu/millionsong/sites/default/files/challenge/train_triplets.txt.zip) to create song recommendations for users based on their past listening habits.  This tutorial assumes that you already have an HDInsight Cluster running.

You learn:

* How to use Recommender Engines

This tutorial is composed of the following segments:

1. [Examining and formatting the data](#segment1).
3. [Installing Mahout](#Segment2).
3. [Running the Mahout job](#segment2).

<a name="setup"></a>
### Setup and configuration 

You must have an account to access Apache™ Hadoop™-based Services for Windows Azure and have created a cluster to work through this tutorial. To obtain an account and create a Hadoop cluster, follow the instructions outlined in the _Getting started with Microsoft Hadoop on Windows Azure_ section of the _Introduction to Hadoop on Windows Azure_ topic.

<a name="segment1"></a>
### Examining and formatting the data 

Apache Mahout provides a built-in implementation for Item-based Collaborative Filtering. Item-based Collaborative Filtering is a popular way to conduct recommendation data mining. 

This example deals with users that interact with items (songs). These users indicate preferences towards the items, expressed in the number of times they have listened to a song. You can view a sample of this dataset on the [Echo Nest Taste Profile Subset](http://labrosa.ee.columbia.edu/millionsong/tasteprofile) web page:

![The Echo Nest Taste Profile Subset](../media/the-echo-nest-taste-profile-subset.png) 
_Sample data from the Million Song Dataset_

To use this dataset with Mahout you need to do two things:

1.	Convert the IDs of both the songs and users to integer values.
2.	Save the new values with their rankings to a comma-separated file.

If you do not have Visual Studio 2010 installed, please skip this step and go to Running Mahout Job Section to get a pre-generated version.

Start by launching Visual Studio 2010. In Visual Studio, select **File -> New Project**. In the **Installed Templates** pane, inside the **Visual C#** node, select the **Window** category, and then select **Console Application** from the list. Name the project _ConvertToMahoutInput_.

![creating a console application](../media/creating-a-console-application.png)

_Creating a console application_

Once the application is created, open the **Program.cs** file and add the following static members to the **Program** class:


	const char tab = '\u0009';
	static Dictionary<string, int> usersMapping = new Dictionary<string, int>();
	static Dictionary<string, int> songMapping = new Dictionary<string, int>();	


Next, fill the **Main** method with the following code:


	var inputStream = File.Open(args[0], FileMode.Open);
	var reader = new StreamReader(inputStream);

	var outStream = File.Open("mInput.txt", FileMode.OpenOrCreate);
	var writer = new StreamWriter(outStream);

	var i = 1;

	var line = reader.ReadLine();
	while (!string.IsNullOrWhiteSpace(line))
	{
    	i++;
    	if (i > 5000)
		break;
    	var outLine = line.Split(tab);

    	int user = GetUser(outLine[0]);
    	int song = GetSong(outLine[1]);

    	writer.Write(user);
    	writer.Write(',');
    	writer.Write(song);
   	 	writer.Write(',');
   	 	writer.WriteLine(outLine[2]);

    	line = reader.ReadLine();
	}

	Console.WriteLine("saved {0} lines to {1}", i, args[1]);

	reader.Close();
	writer.Close();

	SaveMapping(usersMapping, "users.csv");
	SaveMapping(songMapping, "mInput.csv");

	Console.WriteLine("Mapping saved");
	Console.ReadKey();


Now create the **GetUser** and **GetSong** functions, which convert the ids to integers:

	static int GetUser(string user)
	{
    	if (!usersMapping.ContainsKey(user))
        	usersMapping.Add(user, usersMapping.Count + 1);

    	return usersMapping[user];
	}

	static int GetSong(string song)
	{
    	if (!songMapping.ContainsKey(song))
        	songMapping.Add(song, songMapping.Count + 1);

    	return songMapping[song];
	}

Finally, create the utility that implements the SaveMapping method that saves bot mapping dictionaries to .csv files.


	static void SaveMapping(Dictionary<string, int> mapping, string fileName)
	{
    	var stream = File.Open(fileName, FileMode.Create);
    	var writer = new StreamWriter(stream);

    	foreach (var key in mapping.Keys)
    	{
        	writer.Write(key);
        	writer.Write(',');
        	writer.WriteLine(mapping[key]);
    	}

    	writer.Close();
	}


Download the sample data from [this link](http://labrosa.ee.columbia.edu/millionsong/sites/default/files/challenge/train_triplets.txt.zip). Once downloaded, open **train\_triplets.txt.zip** and extract **train\_triplets.txt**.

When running the utility, include a command line argument with the location of **train\_triplets.txt**. To do so, right-click the **ConvertToMahoutInput** project node in **Solution Explorer** and select **Properties**. On the project properties page, add the path of **train\_triplets.txt** to the **Command line arguments** text box:

![setting command line arguments](../media/setting-command-line-arguments.png)

_Setting the Command line argument_

Press **F5** to run the program. Once complete, open the **bin\Debug** folder from the location to which the project was saved, and view the utility's output.  You should find users.txt and mInput.txt


<a name="segment2"></a>
### Installing Mahout 

Open the HDInsight cluster portal, and click the **Remote Desktop** icon.

![The Manage Cluster Icon](../media/the-manage-cluster-icon.png "The Manage Cluster Icon")

_The Remote Desktop icon_

HDInsight by default does not include Mahout.  Since it is part of the Hadoop eco-system, it requires a simple download from the Mahout [website](http://mahout.apache.org/).  The most recent version is at 0.7, but this instruction works for both version 0.5 and 0.7.

First, download [Mahout version 0.7](http://www.poolsaboveground.com/apache/mahout/0.7/mahout-distribution-0.7.zip) onto your local machine.

Then Copy it onto the cluster by selecting the local zip file and press control-v to copy, then paste it on the head node of your Hadoop Cluster.

![The Manage Cluster Icon](../media/uploading-mahout.PNG "The Manage Cluster Icon")
_Copying Mahout to the Headnode_

Finally right click on the zip file after the copying process is done, extract the Mahout distribution into C:\apps\dist.  You now have mahout installed in C:\apps\dist\mahout-distriution-0.7.  

Rename the folder to c:\apps\dist\mahout-0.7 for simplicity.  



<a name="segment3"></a>
### Running the Mahout job 

Copy the **mInput.txt** file from the **bin\Debug** folder to **c:\\** on the remote cluster. Once the file is copied, extract it. As mentioned in the previous section, copying a file onto a remote RDP session is by pressing control-C on your local machine after selecting the files, then control-v onto the RDP session Window. 

Create a file that contains the ID of the user for whom you will be generating recommendations. To do so, simply create a text file called **users.txt** in **c:\\**, containing the id of a single user.

> **Note:** You can generate recommendations for more users by putting their IDs on separate lines. If you have issues generating mInput.txt and users.txt you may download an pre-generated version at this github [repository](https://github.com/wenming/BigDataSamples/tree/master/mahout). It is the most convenient to download everything as one [zip file](https://github.com/wenming/BigDataSamples/archive/master.zip). Find users.txt and mInput.txt and Copy them to the remote cluster in folder c:\

At this point you should open a Hadoop terminal window and navitate to the folder that contains users.txt and mInput.txt.  

![The Manage Cluster Icon](../media/mahout-commandwindow.PNG "Mahout command window Icon")

_Hadoop Command Window_


Next, copy both **mInput.txt** and **users.txt** to HDFS. To do so, open the **Hadoop Command Shell** and run the following commands:

	hadoop dfs -copyFromLocal c:\mInput.txt input\mInput.txt
	hadoop dfs -copyFromLocal c:\users.txt input\users.txt

Verify the files have been copied to HDFS:

	hadoop fs -ls input/

This should show:  

	Found 2 items
	-rwxrwxrwx   1 writer supergroup      53322 2013-03-08 20:32 /user/writer/input/mInput.txt
	-rwxrwxrwx   1 writer supergroup        353 2013-03-08 20:33 /user/writer/input/users.txt


Now we can run the Mahout job using the following command:

	c:\apps\dist\mahout-0.7\bin>hadoop jar c:\Apps\dist\mahout-0.7\mahout-core-0.7-job.jar org.apache.mahout.cf.taste.hadoop.item.RecommenderJob -s SIMILARITY_COOCCURRENCE --input=input/mInput.txt --output=output --usersFile=input/users.txt

There are many other "distance" functions that the recommendation engine could use to compare the feature fector for different users, you may experiment and change the Similarity class to SIMILARITY_COOCCURRENCE, SIMILARITY_LOGLIKELIHOOD, SIMILARITY_TANIMOTO_COEFFICIENT, SIMILARITY_CITY_BLOCK, SIMILARITY_COSINE, SIMILARITY_PEARSON_CORRELATION, SIMILARITY_EUCLIDEAN_DISTANCE.  For the purpose of this tutorial we will not go into the detailed data science aspect of Mahout. 

The Mahout job should run for several minutes, after which an output file will be created. Run the following command to create a local copy of the output file:

	hadoop fs -copyToLocal output/part-r-00000 c:\output.txt

Open the **output.txt** file from the **c:\\** root folder and inspect its contents. The structure of the file is as follows:

	user	[song:rating,song:rating, ...]

If you would like to use other parts of Mahout on your cluster, you should save a copy of Mahout.cmd in the Mahout distribution's bin directory.  

<a name="summary"></a>
## Summary 

Recommender engines provide important functionality for many modern social networking sites, online shopping, streaming media, and other internet sites. Mahout provides an out-of-the-box recommendation engine that is easy to use, contains many useful features, and is scalable on Hadoop.