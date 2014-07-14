<properties title="Use the sample datasets in Azure Machine Learning Studio" pageTitle="Use the sample datasets in Machine Learning Studio | Azure" description="Use the sample datasets in Azure Machine Learning Studio" metaKeywords="" services="" solutions="" documentationCenter="" authors="garye" videoId="" scriptId="" />

#Use the sample datasets in Azure Machine Learning Studio

ML Studio includes some sample datasets for you to use. These are standard machine learning datasets from the public domain. 

You can use these datasets in your experiments as you explore various types of analytic machine learning models in ML Studio. 

- To view a list of these standard datasets in ML Studio, click the **DATASETS** tab. For each dataset, you can see information such as the name of the dataset, who it was submitted by, and a brief description.
 
    To sort the datasets, click any column header. For example, click **SUBMITTED** BY to group all of the sample datasets provided by Microsoft Corporation. This is also an easy way to view datasets that you and other users in your workspace have imported. 

- To use a dataset in an experiment, expand the **Saved Datasets** section of the module palette to the left of the experiment canvas, or search for a specific dataset by typing the name in the search box above the palette. Drag the dataset onto the canvas to add it to your experiment. 

##Sample Datasets

The following table provides additional information about the datasets that might be useful to you while exploring the machine learning features of ML Studio. For each dataset, the table lists:
 
- The name and source of each dataset.
- A description of the dataset’s possible uses, and citations to machine learning research that used the dataset.
- A summary of the important columns included in the dataset, and other useful attributes.

Some descriptions are adapted from the documentation provided by the source (typically the [UC Irvine Machine Learning Repository](http://archive.ics.uci.edu/ml/ "UC Irvine Machine Learning Repository")), while other descriptions are based on additional investigation or reflect changes made in these samples.

<table>
<tr valign=top>
<th>Dataset name</th>
<th>Dataset description</th>
<th>Related research</th>
</tr>
<tr valign=top>
<td>Adult Census Income Binary Classification dataset</td>
<td>
<p>A subset of the 1994 Census database, using working adults over the age of 16 with an adjusted income index of > 100.</p>
<p><strong>Usage:</strong> Classify people using demographics to predict whether a person earns over 50K a year.</p>
</td>
<td>
<p>Kohavi, R., Becker, B., (1996). UCI Machine Learning Repository [<a href="http://archive.ics.uci.edu/ml">http://archive.ics.uci.edu/ml</a>]. Irvine, CA: University of California, School of Information and Computer Science</p>
</td>
</tr>

<tr valign=top>
<td>
<p>Automobile price data (Raw)</p>
</td>
<td>
<p>Information about automobiles by make and model, including the price, features such as the number of cylinders and MPG, as well as an insurance risk score.</p>
<p>The risk score is initially associated with auto price and then adjusted for actual risk in a process known to actuaries as <legacyItalic>symboling</legacyItalic>. A value of +3 indicates that the auto is risky, and a value of -3 that it is probably pretty safe.</p>
<p><strong>Usage:</strong> Predict the risk score by features, using regression or multivariate classification.</p>
</td>
<td>
<p>
Schlimmer, J.C. (1987). UCI Machine Learning Repository [<a href="http://archive.ics.uci.edu/ml">http://archive.ics.uci.edu/ml</a>]. Irvine, CA: University of California, School of Information and Computer Science
</p>
</td>
</tr>

<tr valign=top>
<td>
<p>Blood donation data</p>
</td>
<td>
<p>A subset of data from the blood donor database of the Blood Transfusion Service Center of Hsin-Chu City, Taiwan.</p>
  <p>Donor data includes the months since last donation), and frequency, or the total number of donations, time since last donation, and amount of blood donated.</p>
  <p><strong>Usage:</strong> The goal is to predict via classification whether the donor donated blood in March 2007, where 1 indicates a donor during the target period, and 0 a non-donor.</p>
</td>
<td>
<list class="bullet">
<listItem>
<p>
Yeh, I.C., (2008). UCI Machine Learning Repository [<a href="http://archive.ics.uci.edu/ml">http://archive.ics.uci.edu/ml</a>]. Irvine, CA: University of California, School of Information and Computer Science
</p>
</listItem>
<listItem>
<p>
Yeh, I-Cheng, Yang, King-Jang, and Ting, Tao-Ming, "Knowledge discovery on RFM model using Bernoulli sequence, "Expert Systems with Applications, 2008, [<a href="http://dx.doi.org/10.1016/j.eswa.2008.07.018">http://dx.doi.org/10.1016/j.eswa.2008.07.018</a>]
</p>
</listItem>
</list>
</td>
</tr>

<tr valign=top>
<td>
<p>Breast cancer data</p>
</td>
<td>
<p>One of three cancer-related datasets provided by the Oncology Institute that appears frequently in machine learning literature. Combines diagnostic information with features from laboratory analysis of about 300 tissue samples.</p>
<p><strong>Usage:</strong> Classify the type of cancer, based on 9 attributes, some of which are linear and some are categorical.</p>
</td>
<td>
<p>
Wohlberg, W.H., Street, W.N., &amp; Mangasarian, O.L. (1995). UCI Machine Learning Repository [<a href="http://archive.ics.uci.edu/ml">http://archive.ics.uci.edu/ml</a>]. Irvine, CA: University of California, School of Information and Computer Science
</p>
</td>
</tr>

<tr valign=top>
<td>
<p>Energy Efficiency Regression data</p>
</td>
<td>
<p>A collection of simulated energy profiles, based on 12 different building shapes. The buildings differ with respect to differentiated by 8 features, such as glazing area, the glazing area distribution, and orientation.</p>
<p><strong>Usage:</strong> Use either regression or classification to predict the energy efficiency rating based as one of two real valued responses. For multi-class classification, is round the response variable to the nearest integer.</p>
</td>
<td>
<p>
Xifara, A. &amp; Tsanas, A. (2012). UCI Machine Learning Repository  [<a href="http://archive.ics.uci.edu/ml">http://archive.ics.uci.edu/ml</a>]. Irvine, CA: University of California, School of Information and Computer Science
</p>
</td>
</tr>

<tr valign=top>
<td>
<p>Flight on-time performance (Raw)</p>
</td>
<td>
<p>Records of airplane flight arrivals and departures within United States from October 2011.</p>
<p><strong>Usage:</strong> Predict flight delays.</p>
</td>
<td>
<p>
From US Dept. of Transportation [<a href="http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&amp;DB_Short_Name=On-Time">http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&amp;DB_Short_Name=On-Time</a>]
</p>
</td>
</tr>

<tr valign=top>
<td>
<p>Forest fires data</p>
</td>
<td>
<p>Contains weather data, such as temperature and humidity indices and wind speed, from an area of northeast Portugal, combined with records of forest fires.</p>
<p><strong>Usage:</strong> This is a difficult regression task, where the aim is to predict the burned area of forest fires.</p>
</td>
<td>
<list class="bullet">
<listItem>
<p>
Cortez, P., &amp; Morais, A. (2008). UCI Machine Learning Repository [<a href="http://archive.ics.uci.edu/ml">http://archive.ics.uci.edu/ml</a>]. Irvine, CA: University of California, School of Information and Computer Science
</p>
</listItem>
<listItem>
<p>
[Cortez and Morais, 2007] P. Cortez and A. Morais. 
A Data Mining Approach to Predict Forest Fires using Meteorological Data. 
In J. Neves, M. F. Santos and J. Machado Eds., New Trends in Artificial Intelligence, 
Proceedings of the 13th EPIA 2007 - Portuguese Conference on Artificial Intelligence, 
December, Guimar&#227;es, Portugal, pp. 512-523, 2007. APPIA, ISBN-13 978-989-95618-0-9. Available at:
[<a href="http://www.dsi.uminho.pt/~pcortez/fires.pdf">http://www.dsi.uminho.pt/~pcortez/fires.pdf</a>]
</p>
</listItem>
</list>
</td>
</tr>

<tr valign=top>
<td>
<p>Iris two class data</p>
</td>
<td>
<p>This is perhaps the best known database to be found in the pattern recognition literature. The data set is relatively small, containing 50 examples each of petal measurements from three iris varieties.</p>
<p><strong>Usage:</strong> Predict the iris type from the measurements. 
<!-- I believe the following doesn't apply anymore, but I'm not sure so I'll remove it for now.
One class is linearly separable from the other two; but the latter are not linearly separable from each other.
-->
</p>
</td>
<td>
<p>
Fisher, R.A. (1988). UCI Machine Learning Repository  [<a href="http://archive.ics.uci.edu/ml">http://archive.ics.uci.edu/ml</a>]. Irvine, CA: University of California, School of Information and Computer Science
</p>
</td>
</tr>

<tr valign=top>
<td>
<p>MPG data for various automobiles</p>
</td>
<td>
<p>This dataset is a slightly modified version of the dataset provided by the StatLib library of Carnegie Mellon University. The dataset was used in the 1983 American Statistical Association Exposition.</p>
<p>The data lists fuel consumption for various automobiles in miles per gallon, along with information such the number of cylinders, engine displacement, horsepower, total weight, and acceleration.</p>
<p><strong>Usage:</strong> Predict fuel economy based on 3 multivalued discrete attributes and 5 continuous attributes.</p>
</td>
<td>
<p>
StatLib, Carnegie Mellon University, (1993). UCI Machine Learning Repository [<a href="http://archive.ics.uci.edu/ml">http://archive.ics.uci.edu/ml</a>]. Irvine, CA: University of California, School of Information and Computer Science
</p>
</td>
</tr>

<tr valign=top>
<td>
<p>Pima Indians Diabetes Binary Classification dataset</p>
</td>
<td>
<p>A subset of data from the National Institute of Diabetes and Digestive and Kidney Diseases database. The dataset was filtered to focus on female patients of Pima Indian heritage. The data includes medical data such as glucose and insulin levels, as well as lifestyle factors.</p>
<p><strong>Usage:</strong> Predict whether the subject has diabetes (binary classification).</p>
</td>
<td>
<p>
Sigillito, V. (1990). UCI Machine Learning Repository  [<a href="http://archive.ics.uci.edu/ml">http://archive.ics.uci.edu/ml</a>]. Irvine, CA: University of California, School of Information and Computer Science
</p>
</td>
</tr>

<tr valign=top>
<td>
<p>Restaurant customer data</p>
</td>
<td>
<p>A set of metadata about customers, including demographics and preferences.</p>
<p><strong>Usage:</strong> Use this dataset, in combination with the other two restaurant data sets, to train and test a recommender system.</p>
</td>
<td>
<p>
Bache, K. and Lichman, M. (2013). UCI Machine Learning Repository 
[<a href="http://archive.ics.uci.edu/ml">http://archive.ics.uci.edu/ml</a>].
Irvine, CA: University of California, School of Information and Computer Science.
</p>
</td>
</tr>

<tr valign=top>
<td>
<p>Restaurant feature data</p>
</td>
<td>
<p>A set of metadata about restaurants and their features, such as food type, dining style, and location.</p>
<p><strong>Usage:</strong> Use this dataset, in combination with the other two restaurant data sets, to train and test a recommender system.</p>
</td>
<td>
<p>
Bache, K. and Lichman, M. (2013). UCI Machine Learning Repository 
[<a href="http://archive.ics.uci.edu/ml">http://archive.ics.uci.edu/ml</a>].
Irvine, CA: University of California, School of Information and Computer Science.
</p>
</td>
</tr>

<tr valign=top>
<td>
<p>Restaurant ratings</p>
</td>
<td>
<p>Contains ratings given by users to restaurants on a scale from 0 to 2.</p>
<p><strong>Usage:</strong> Use this dataset, in combination with the other two restaurant data sets, to train and test a recommender system.</p>
</td>
<td>
<p>
Bache, K. and Lichman, M. (2013). UCI Machine Learning Repository 
[<a href="http://archive.ics.uci.edu/ml">http://archive.ics.uci.edu/ml</a>].
Irvine, CA: University of California, School of Information and Computer Science.
</p>
</td>
</tr>

<tr valign=top>
<td>
<p>Steel Annealing multi-class dataset</p>
</td>
<td>
<p>This dataset contains a series of records from steel annealing trials with the physical attributes (width, thickness, type (coil, sheet, etc.) of the resulting steel types.</p>
<p><strong>Usage:</strong> Predict any of two numeric class attributes; hardness or strength. You might also analyze correlations among attributes.</p>
<p>Steel grades follow a set standard, defined by SAE and other organizations. You are looking for a specific 'grade' (the class variable) and want to understand the values needed.</p>
</td>
<td>
<p>
Sterling, D. &amp; Buntine, W., (NA). UCI Machine Learning Repository  [<a href="http://archive.ics.uci.edu/ml">http://archive.ics.uci.edu/ml</a>]. Irvine, CA: University of California, School of Information and Computer Science
</p>
<p>A useful guide to steel grades:</p>
<p>[<a href="http://www.outokumpu.com/SiteCollectionDocuments/Outokumpu-steel-grades-properties-global-standards.pdf">http://www.outokumpu.com/SiteCollectionDocuments/Outokumpu-steel-grades-properties-global-standards.pdf>]
  </p>
</td>
</tr>

<tr valign=top>
<td>
<p>Telescope data</p>
</td>
<td>
<p>Records of high energy gamma particle bursts along with background noise, both simulated using a Monte Carlo process.</p>
<p>The intent of the simulation was to improve the accuracy of ground-based atmospheric Cherenkov gamma telescopes, using statistical methods to differentiate between the desired signal (Cherenkov radiation showers) and background noise (hadronic showers initiated by cosmic rays in the upper atmosphere).</p>
<p>The data has been pre-processed to create an elongated cluster with the long axis is oriented towards the camera center. The characteristics of this ellipse, (often called Hillas parameters) are among the image parameters that can be used for discrimination.</p>
<p><strong>Usage:</strong> Predict whether image of a shower represents signal or background noise.</p>
<p><strong>Notes:</strong> Simple classification accuracy is not meaningful for this data, since classifying a background event as signal is worse than classifying a signal event as background. For comparison of different classifiers the ROC graph should be used. The probability of accepting a background event as signal must be below one of the following thresholds: 0.01 , 0.02 , 0.05 , 0.1 , or 0.2.</p>
<p>Also, note that the number of background events (h, for hadronic showers) is underestimated, whereas in real measurements, the h or noise class represents the majority of events.</p>
</td>
<td>
<p>
Bock, R.K. (1995). UCI Machine Learning Repository [<a href="http://archive.ics.uci.edu/ml">http://archive.ics.uci.edu/ml</a>]. Irvine, CA: University of California, School of Information and Computer Science
</p>
</td>
</tr>

</table>

The dataset types you may encounter are listed below.

<table>
<tr>
<th>Data format</th>
<th>Description</th>
</tr>
<tr>
<td>
Comma Separated Values (CSV)
</td>
<td>
Well-known interchange format for all data platforms. ML Studio loads this data and incorporates a column-wise type guesser that applies metadata based on data sampled from each column.
</td>
</tr>
<tr>
<td>
Attribute Relationship File Format (ARFF)
</td>
<td>
Machine Learning data format defined by WEKA. Contains metadata (for nominal, numerical, and string types) that translates directly into ML Studio data tables.
</td>
</tr>
<tr>
<td>
Plain text
</td>
<td>
Plain text can be read and then split up into columns with the help of downstream preprocessing modules. The major plain text format supported is JSON.
</td>
</tr>
<tr>
<td>
DotNetTable
</td>
<td>
The serialized version of the primary container passed between modules in ML Studio (the <i>dataset</i>).
</td>
</tr>
</table>
