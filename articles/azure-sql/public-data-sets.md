---
title: Public data sets for Azure analytics 
description: Learn about public data sets that you can use to prototype and test Azure analytics services and solutions.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: sqldbrb=2
ms.devlang: 
ms.topic: reference
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 10/01/2018
---
# Public data sets for testing and prototyping
[!INCLUDE[appliesto-asf](includes/appliesto-asf.md)]

Browse this list of public data sets for data that you can use to prototype and test storage and analytics services and solutions.

## U.S. Government and agency data

| Data source | About the data | About the files |
|---|---|---|
| [US Government data](https://catalog.data.gov/dataset) | Over 250,000 data sets covering agriculture, climate, consumer, ecosystems, education, energy, finance, health, local government, manufacturing, maritime, ocean, public safety, and science and research in the U.S. | Files of various sizes in various formats including HTML, XML, CSV, JSON, Excel, and many others. You can filter available data sets by file format. |
| [US Census data](https://www.census.gov/data.html) | Statistical data about the population of the U.S. | Data sets are in various formats. |
| [Earth science data from NASA](https://earthdata.nasa.gov/) | Over 32,000 data collections covering agriculture, atmosphere, biosphere, climate, cryosphere, human dimensions, hydrosphere, land surface, oceans, sun-earth interactions, and more. | Data sets are in various formats. |
| [Airline flight delays and other transportation data](https://www.transtats.bts.gov/OT_Delay/OT_DelayCause1.asp) | "The U.S. Department of Transportation's (DOT) Bureau of Transportation Statistics (BTS) tracks the on-time performance of domestic flights operated by large air carriers. Summary information on the number of on-time, delayed, canceled, and diverted flights appears ... in summary tables posted on this website." | Files are in CSV format. |
| [Traffic fatalities - US Fatality Analysis Reporting System (FARS)](https://www.nhtsa.gov/FARS) | "FARS is a nationwide census providing NHTSA, Congress, and the American public yearly data regarding fatal injuries suffered in motor vehicle traffic crashes." | "Create your own fatality data run online by using the FARS Query System. Or download all FARS data from 1975 to present from the FTP Site." |
| [Toxic chemical data - EPA Toxicity ForeCaster (ToxCast&trade;) data](https://www.epa.gov/chemical-research/toxicity-forecaster-toxcasttm-data) | "EPA's most updated, publicly available high-throughput toxicity data on thousands of chemicals. This data is generated through the EPA's ToxCast research effort." | Data sets are available in various formats including spreadsheets, R packages, and MySQL database files. |
| [Toxic chemical data - NIH Tox21 Data Challenge 2014](https://tripod.nih.gov/tox21/challenge/) | "The 2014 Tox21 data challenge is designed to help scientists understand the potential of the chemicals and compounds being tested through the Toxicology in the 21st Century initiative to disrupt biological pathways in ways that may result in toxic effects." | Data sets are available in SMILES and SDF formats. The data provides "assay activity data and chemical structures on the Tox21 collection of ~10,000 compounds (Tox21 10K)." |
| [Biotechnology and genome data from the NCBI](https://www.ncbi.nlm.nih.gov/guide/data-software/) | Multiple data sets covering genes, genomes, and proteins. | Data sets are in text, XML, BLAST, and other formats. A BLAST app is available. |

## Other statistical and scientific data

| Data source | About the data | About the files |
|---|---|---|
| [New York City taxi data](http://www.nyc.gov/html/tlc/html/about/trip_record_data.shtml) | "Taxi trip records include fields capturing pick-up and dropoff dates/times, pick-up and dropoff locations, trip distances, itemized fares, rate types, payment types, and driver-reported passenger counts." | Data sets are in CSV files by month. |
| [Microsoft Research data sets - "Data Science for Research"](https://www.microsoft.com/research/academic-program/data-science-microsoft-research/) | Multiple data sets covering human-computer interaction, audio/video, data mining/information retrieval, geospatial/location, natural language processing, and robotics/computer vision. | Data sets are in various formats, zipped for download. |
| [Open Science Data Cloud data](https://www.opensciencedatacloud.org/projects/) | "The Open Science Data Cloud provides the scientific community with resources for storing, sharing, and analyzing terabyte and petabyte-scale scientific datasets."| Data sets are in various formats. |
| [Global climate data - WorldClim](https://worldclim.org/) | "WorldClim is a set of global climate layers (gridded climate data) with a spatial resolution of about 1 km2. These data can be used for mapping and spatial modeling." | These files contain geospatial data. For more info, see [Data format](https://worldclim.org/formats1). |
| [Data about human society - The GDELT Project](https://www.gdeltproject.org/data.html) | "The GDELT Project is the largest, most comprehensive, and highest resolution open database of human society ever created." | The raw data files are in CSV format. |
| [Advertising click prediction data for machine learning from Criteo](https://labs.criteo.com/2013/12/download-terabyte-click-logs/) | "The largest ever publicly released ML dataset." For more info, see [Criteo's 1 TB Click Prediction Dataset](https://blogs.technet.microsoft.com/machinelearning/20../../now-available-on-azure-ml-criteos-1tb-click-prediction-dataset/). | |
| [ClueWeb09 text mining data set from The Lemur Project](https://www.lemurproject.org/clueweb09.php/) | "The ClueWeb09 dataset was created to support research on information retrieval and related human language technologies. It consists of about 1 billion web pages in 10 languages that were collected in January and February 2009." | See [Dataset Information](https://www.lemurproject.org/clueweb09/datasetInformation.php).|

## Online service data

| Data source | About the data | About the files |
|---|---|---|
| [GitHub archive](https://www.githubarchive.org/) | "GitHub Archive is a project to record the public GitHub timeline [of events], archive it, and make it easily accessible for further analysis." | Download JSON-encoded event archives in .gz (Gzip) format from a web client. |
| [GitHub activity data from The GHTorrent project](http://ghtorrent.org/) | "The GHTorrent project [is] an effort to create a scalable, queryable, offline mirror of data offered through the GitHub REST API. GHTorrent monitors the GitHub public event time line. For each event, it retrieves its contents and their dependencies, exhaustively." | MySQL database dumps are in CSV format. |
| [Stack Overflow data dump](https://archive.org/details/stackexchange) | "This is an anonymized dump of all user-contributed content on the Stack Exchange network [including Stack Overflow]." | "Each site [such as Stack Overflow] is formatted as a separate archive consisting of XML files zipped via 7-zip using bzip2 compression. Each site archive includes Posts, Users, Votes, Comments, PostHistory, and PostLinks." |
