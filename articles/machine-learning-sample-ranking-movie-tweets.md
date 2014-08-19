<properties title="Azure Machine Learning Sample: Ranking movie tweets based on their predicted popularity" pageTitle="Machine Learning Sample: Ranking movie tweets based on their predicted popularity | Azure" description="A sample Azure Machine Learning experiment that uses movie tweeting data and ranks the tweets by engagement." metaKeywords="" services="" solutions="" documentationCenter="" authors="garye" videoId="" scriptId="" />

<tags ms.service="machine-learning" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="garye" />

#Azure Machine Learning Sample: Ranking movie tweets based on their predicted popularity

*You can find the sample experiment associated with this model in ML Studio in the **EXPERIMENTS** section under the **SAMPLES** tab. The experiment name is:*

	Sample Experiment - Ranking of Movie Tweets According to their Future Popularity - Development

##Problem description

Tweet popularity analysis is a hot problem in today's information technology realm. We are solving an example challenge, posted on [ACM RecSys conference](http://recsys.acm.org/), in this experiment. 

In this experiment we are focusing on extracted data from [Movie Tweeting Dataset](http://recsyswiki.com/wiki/Movietweetings). The engagement of the ratings in the form of retweet and favorites counts has been extracted from this dataset and uploaded into Cloud ML Studio. The goal of the challenge is to rank the tweets (for each user) by engagement. For more information please visit the challenge [webpage](http://2014.recsyschallenge.com/). 

##Data

The dataset originates from users of the IMDb iOS app that rate movies and share the rating on Twitter. By querying the Twitter API on a daily basis for tweets containing the keywords 'I rated #IMDb', tweets were collected and relevant information was extracted. For more information on this dataset see [this github website](https://github.com/sidooms/MovieTweetings), [this slideshare presentation](http://www.slideshare.net/simondooms/movie-tweetings-a-movie-rating-dataset-collected-from-twitter) or [this paper](http://crowdrec2013.noahlab.com.hk/papers/crowdrec2013_Dooms.pdf). We used a randomly selected 30% of the data for training and the rest for testing. Here are the raw data column descriptions:

- Scraping Time: a linux timestamp indicating the moment the Twitter API was queried for the tweet information. So it is not the posting time of the tweet itself but rather the moment at which the data of the tweet was collected. This may be important to take into account since it reflects how long the tweet has been online and may therefore influence the number of retweets or favorites (the longer a tweet has been online, the more its exposure).
- Tweet ID: The actual twitter tweet id.
- User ID: The actual twitter user id.
- Movie id: The id of the rated movie, id is the actual IMDb id as used in the URL: www.imdb.com/title/ttxxx/
- Rating: The numeric rating on a 10-star scale, extracted from the tweet text.
- Retweet Count: Extracted from the raw tweet data. This indicates how many times the tweet has been retweeted.
- Favorite Count: Extracted from the raw tweet data. This indicates how many times the tweet has been selected as favorite. 
- Time Zone: Extracted from the raw tweet data. This indicates which time zone the twitter user who sent this tweet is located at.

##Model

The model image is as follows:

![Model][image1]

Some extra information:

First Execute R Script: 

![Execute R Script 1][image2]

In the above, we create a new feature called "Popularity" which is a combination of Retweets and Favorites. 

Second Execute R Script:

![Execute R Script 2][image3]

In the above, we try to demonstrate:

- Plotting sort by actual popularity

![Sort by actual popularity][image4]

- Plotting sort by predicted popularity

![Sort by predicted popularity][image5]

- Comparing the predictions with actual popularities

![Comparing the predictions with actual popularities][image6]

- Output = sorted data based on predicted popularity

We used **Boosted Decision Tree Regression Model** to predict the future popularities. 

##Results

The result is a sorted list based on the predicted tweet popularities:

<table>
<tr><th>User ID</th><th>Movie ID</th><th>Rating</th><th>Popularity</th><th>Scored Labels</th><th>Movie Name</th></tr>
<tr><td>568533000</td><td>2375605</td><td>10</td><td>1.38629</td><td>3.11132</td><td>The Act of Killing (2012)</td></tr>
<tr><td>23655000</td><td>1245492</td><td>10</td><td>1.09861</td><td>2.29266</td><td>This Is the End (2013)</td></tr>
<tr><td>23655000</td><td>2101441</td><td>10</td><td>2.19722</td><td>2.29266</td><td>Spring Breakers (2012)</td></tr>
<tr><td>23655000</td><td>993846</td><td>10</td><td>2.30259</td><td>2.29266</td><td>The Wolf of Wall Street (2013)</td></tr>
<tr><td>198258000</td><td>100234</td><td>10</td><td>5.07517</td><td>2.11954</td><td>Nema-ye Nazdik (1990)</td></tr>
<tr><td>473855000</td><td>810922</td><td>8</td><td>0.693147</td><td>2.11334</td><td>Take Me Home Tonight (2011)</td></tr>
<tr><td>467227000</td><td>997246</td><td>9</td><td>0.693147</td><td>2.06799</td><td>Avaze gonjeshk-ha (2008)</td></tr>
<tr><td>573512000</td><td>986264</td><td>9</td><td>0.693147</td><td>2.0627</td><td>Taare Zameen Par (2007)</td></tr>
<tr><td>456063000</td><td>1170358</td><td>10</td><td>0.693147</td><td>2.01752</td><td>The Hobbit The Desolation of Smaug (2013)</td></tr>
<tr><td>87778200</td><td>2219210</td><td>10</td><td>1.38629</td><td>2.01166</td><td>Crawl Bitch Crawl (2012)</td></tr>
<tr><td>448650000</td><td>2258858</td><td>10</td><td>1.79176</td><td>1.99899</td><td>Wadjda (2012)</td></tr>
<tr><td>532375000</td><td>1670345</td><td>8</td><td>2.07944</td><td>1.99806</td><td>Now You See Me (2013)</td></tr>
<tr><td>1322490000</td><td>95953</td><td>9</td><td>1.79176</td><td>1.94244</td><td>Rain Man (1988)</td></tr>
<tr><td>1386760000</td><td>1670345</td><td>8</td><td>1.38629</td><td>1.91671</td><td>Now You See Me (2013)</td></tr>
<tr><td>1386760000</td><td>1682180</td><td>8</td><td>1.38629</td><td>1.91671</td><td>Stoker (2013)</td></tr>
<tr><td>1386760000</td><td>45152</td><td>8</td><td>1.09861</td><td>1.91671</td><td>Singin in the Rain (1952)</td></tr>
<tr><td>1386760000</td><td>327056</td><td>8</td><td>1.09861</td><td>1.91671</td><td>Mystic River (2003)</td></tr>
<tr><td>435122000</td><td>790724</td><td>10</td><td>1.38629</td><td>1.90674</td><td>Jack Reacher (2012)</td></tr>
<tr><td>553918000</td><td>200465</td><td>9</td><td>0.693147</td><td>1.90638</td><td>The Bank Job (2008)</td></tr>
<tr><td>435122000</td><td>1542344</td><td>8</td><td>0.693147</td><td>1.90454</td><td>127 Hours (2010)Biography</td></tr>
<tr><td>45824200</td><td>145660</td><td>10</td><td>0.693147</td><td>1.87529</td><td>Austin Powers The Spy Who Shagged Me (1999)</td></tr>
<tr><td>45824200</td><td>265086</td><td>10</td><td>0.693147</td><td>1.87529</td><td>Black Hawk Down (2001)</td></tr>
<tr><td>1568600000</td><td>1582507</td><td>9</td><td>1.38629</td><td>1.8594</td><td>House at the End of the Street (2012)</td></tr>
<tr><td>45826100</td><td>1935156</td><td>10</td><td>1.38629</td><td>1.85154</td><td>Jodorowskys Dune (2013)</td></tr>
<tr><td>45628100</td><td>1313104</td><td>10</td><td>1.38629</td><td>1.85154</td><td>The Cove (2009)</td></tr>
<tr><td>183265000</td><td>1454468</td><td>10</td><td>0.693147</td><td>1.84714</td><td>Gravity (2013)</td></tr>
<tr><td>435122000</td><td>802948</td><td>7</td><td>0.693147</td><td>1.83538</td><td>An American (2007)</td></tr>
<tr><td>164037000</td><td>112573</td><td>10</td><td>1.38629</td><td>1.8331</td><td>Braveheart (1995)Biography</td></tr>
<tr><td>1386760000</td><td>1999987</td><td>7</td><td>0.693147</td><td>1.82541</td><td>Breathe In (2013)</td></tr>
<tr><td>127085000</td><td>2234155</td><td>7</td><td>2.56495</td><td>1.80432</td><td>The Internship (2013)</td></tr>
<tr><td>127085000</td><td>1389096</td><td>7</td><td>2.77259</td><td>1.80432</td><td>Stand Up Guys (2012)</td></tr>
<tr><td>214950000</td><td>988045</td><td>10</td><td>0.693147</td><td>1.79949</td><td>Sherlock Holmes (2009)</td></tr>
<tr><td>98969300</td><td>462590</td><td>10</td><td>0.693147</td><td>1.79872</td><td>Step Up (2006)</td></tr>
<tr><td>98969300</td><td>114814</td><td>10</td><td>1.60944</td><td>1.79872</td><td>The Usual Suspects (1995)</td></tr>
<tr><td>98969300</td><td>2334649</td><td>10</td><td>2.63906</td><td>1.79872</td><td>Fruitvale Station (2013)</td></tr>
<tr><td>98969300</td><td>113277</td><td>10</td><td>1.60944</td><td>1.79872</td><td>Heat (1995)</td></tr>
<tr><td>98969300</td><td>2024432</td><td>10</td><td>1.94591</td><td>1.79872</td><td>Identity Thief (2013)</td></tr>
<tr><td>98969300</td><td>1345836</td><td>10</td><td>2.19722</td><td>1.79872</td><td>The Dark Knight Rises (2012)</td></tr>
<tr><td>98969300</td><td>1893256</td><td>10</td><td>1.09861</td><td>1.79872</td><td>Hummingbird (2013)</td></tr>
<tr><td>98969300</td><td>1979320</td><td>10</td><td>3.17805</td><td>1.79872</td><td>Rush (2013)Biography</td></tr>
<tr><td>98969300</td><td>112641</td><td>10</td><td>1.60944</td><td>1.79872</td><td>Casino (1995)</td></tr>
<tr><td>98969300</td><td>1800741</td><td>10</td><td>0.693147</td><td>1.79872</td><td>Step Up Revolution (2012)</td></tr>
<tr><td>98969300</td><td>1821694</td><td>10</td><td>1.79176</td><td>1.79872</td><td>Red 2 (2013)</td></tr>
<tr><td>98969300</td><td>1023481</td><td>10</td><td>0.693147</td><td>1.79872</td><td>Step Up 2 The Streets (2008)</td></tr>
<tr><td>98969300</td><td>122690</td><td>10</td><td>1.38629</td><td>1.79872</td><td>Ronin (1998)</td></tr>
<tr><td>1386760000</td><td>167404</td><td>9</td><td>1.38629</td><td>1.79064</td><td>The Sixth Sense (1999)</td></tr>
<tr><td>98969300</td><td>1148204</td><td>9</td><td>2.89037</td><td>1.78287</td><td>Orphan (2009)</td></tr>
<tr><td>98969300</td><td>119488</td><td>9</td><td>1.38629</td><td>1.78287</td><td>L.A. Confidential (1997)</td></tr>
<tr><td>98969300</td><td>914863</td><td>9</td><td>1.38629</td><td>1.78287</td><td>Unthinkable (2010)</td></tr>
<tr><td>98969300</td><td>71562</td><td>9</td><td>0.693147</td><td>1.78287</td><td>The Godfather Part II (1974)</td></tr>
<tr><td>10472900</td><td>816442</td><td>10</td><td>1.09861</td><td>1.7744</td><td>The Book Thief (2013)</td></tr>
<tr><td>198258000</td><td>19421</td><td>9</td><td>1.09861</td><td>1.75033</td><td>Steamboat Bill Jr. (1928)</td></tr>
<tr><td>198258000</td><td>1360860</td><td>9</td><td>0.693147</td><td>1.75033</td><td>Darbareye Elly (2009)</td></tr>
<tr><td>198258000</td><td>970179</td><td>9</td><td>1.38629</td><td>1.75033</td><td>Hugo (2011)</td></tr>
<tr><td>198258000</td><td>18742</td><td>9</td><td>0.693147</td><td>1.75033</td><td>The Cameraman (1928)</td></tr>
<tr><td>198258000</td><td>423176</td><td>9</td><td>1.09861</td><td>1.75033</td><td>Shijie (2004)</td></tr>
</table>

##Web service

Based on the trained model above, we created a simple web service which gets the tweet data and outputs prediction of the popularity. 

![Web service][image7]

**Sample input:**

![Sample input][image8]

**Result:  0.692387819290161**


<!--Images-->
[image1]:./media/machine-learning-sample-ranking-movie-tweets/image1.png
[image2]:./media/machine-learning-sample-ranking-movie-tweets/image2.png
[image3]:./media/machine-learning-sample-ranking-movie-tweets/image3.png
[image4]:./media/machine-learning-sample-ranking-movie-tweets/image4.png
[image5]:./media/machine-learning-sample-ranking-movie-tweets/image5.png
[image6]:./media/machine-learning-sample-ranking-movie-tweets/image6.png
[image7]:./media/machine-learning-sample-ranking-movie-tweets/image7.png
[image8]:./media/machine-learning-sample-ranking-movie-tweets/image8.png

