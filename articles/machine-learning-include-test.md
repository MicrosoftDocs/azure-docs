<properties title="This is a test of included text" pageTitle="This is a test of included text | Azure" description="This is a test of included text." metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="garye" manager="paulettm" editor="cgronlun"  videoId="" scriptId="" />

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/17/2014" ms.author="garye" />


# This is a test of included text

Here's an attempt to put a link to the level-3 headings in the include file. The first link is defined here, the  second is defined in the include file.

- [Heading A]
- [Heading B]

[Heading A]: #heading-a

Here is some text.

Now here are 2 include files embedded in a table:

|A|B|
|-|-|
| [AZURE.INCLUDE [machine-learning-heading-3-1](../includes/machine-learning-heading-3-1.md)] |(blank)
| [AZURE.INCLUDE [machine-learning-heading-3-2](../includes/machine-learning-heading-3-2.md)]

Now here is an include file with level 3 headings:

[AZURE.INCLUDE [machine-learning-heading-3-3](../includes/machine-learning-heading-3-3.md)]


### Links

Here's an attempt to link to all of the links below:

- [airportcodes](../machine-learning-include-text/#airportcodes)
- [bikerental](../machine-learning-include-text/#bikerental)
- [billgatesimage](../machine-learning-include-text/#billgatesimage)
- [airportcodes2](../machine-learning-include-text/#airportcodes2)
- [bikerental2](../machine-learning-include-text/#bikerental2)
- [billgatesimage2](../machine-learning-include-text/#billgatesimage2)


Here's a table with an attempt at inserting an externally-linkable spot in it. The links are:

- airportcodes
- bikerental
- billgatesimage

| Dataset | Associated Model | Associated Experiment |
|:------- |:---------------- |:--------------------- |
| <p ID=airportcodes>**Airport Codes Dataset <p> Flight Delays Data <p> Weather Dataset** | [Azure Machine Learning Sample: Flight delay prediction](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-flight-delay-prediction/) | Sample Experiment - Flight Delay Prediction - Development |
| <p ID=bikerental>**Bike Rental UCI dataset** | [Azure Machine Learning Sample: Prediction of the number of bike rentals](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-prediction-of-number-of-bike-rentals/) | Sample Experiment - Demand Forecasting of Bikes |
| <p ID=billgatesimage>**Bil Gates RGB Image** | [Azure Machine Learning Sample: Color quantization using K-Means clustering](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-color-quantization-using-k-means-clustering/) | Sample Experiment - Color Based Image Compression using K-Means Clustering - Development |
 
This is the same table, but in HTML. The links are:

- airportcodes2
- bikerental2
- billgatesimage2

Also replaced the first hyperlink with an explicit <a> tag, but left the next two as MD-formatted links. 

<table>

<tr><th>Dataset</th>
<th>Associated Model</th>
<th>Associated Experiment</th>
</tr>

<tr><td><p ID=airportcodes2>**Airport Codes Dataset <p> Flight Delays Data <p> Weather Dataset**</td>
<td><a href="http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-flight-delay-prediction/">Azure Machine Learning Sample: Flight delay prediction</a></td>
<td>Sample Experiment - Flight Delay Prediction - Development</td>
</tr>

<tr><td><p ID=bikerental2>**Bike Rental UCI dataset**</td>
<td>
[Azure Machine Learning Sample: Prediction of the number of bike rentals](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-prediction-of-number-of-bike-rentals/)
</td>
<td>Sample Experiment - Demand Forecasting of Bikes</td>
</tr>

<tr><td><p ID=billgatesimage2>**Bil Gates RGB Image**</td>
<td>[Azure Machine Learning Sample: Color quantization using K-Means clustering](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-sample-color-quantization-using-k-means-clustering/)</td>
<td>Sample Experiment - Color Based Image Compression using K-Means Clustering - Development</td>
</tr>

</table>
