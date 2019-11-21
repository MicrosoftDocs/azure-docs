---
title: Use the Geo AI
titleSuffix: Azure Data Science Virtual Machine 
description: Learn how to use the Geo AI Data Science Virtual Machine to analyze data and build models based on geospatial data.
keywords: deep learning, AI, data science tools, data science virtual machine, geospatial analytics
services: machine-learning
ms.service: machine-learning
ms.subservice: data-science-vm

author: vijetajo
ms.author: vijetaj
ms.topic: conceptual
ms.date: 03/05/2018

---
# Using the Geo Artificial Intelligence Data Science Virtual Machine

Use the Geo AI Data Science VM to fetch data for analysis, perform data wrangling, and build models for AI applications that consume geospatial information. After you've provisioned your Geo AI Data Science VM and signed in to ArcGIS Pro through your ArcGIS account, you can start interacting with ArcGIS desktop and ArcGIs online. You can also access ArcGIS from Python interfaces and an R language bridge that's preconfigured on the Geo-Data Science VM. To build rich AI applications, combine the Geo-Data Science VM with the machine-learning and deep-learning frameworks and other data science software that are available on it.  


## Configuration details

The Python library, [arcpy](https://pro.arcgis.com/en/pro-app/arcpy/main/arcgis-pro-arcpy-reference.htm), which is used to interface with ArcGIS, is installed in the global root conda environment of the Data Science VM that's found at ```c:\anaconda```.

- If you're running Python at a command prompt, run ```activate``` to activate into the conda root Python environment.
- If you're using an IDE or Jupyter notebook, you can select the environment or kernel to make sure you're in the correct conda environment.

The R bridge to ArcGIS is installed as an R library named [arcgisbinding](https://github.com/R-ArcGIS/r-bridge) in the main Microsoft Machine Learning Server standalone instance that's located at ```C:\Program Files\Microsoft\ML Server\R_SERVER```. Visual Studio, RStudio, and Jupyter are already preconfigured to use this R environment and will have access to the ```arcgisbinding``` R library. 


## Geo AI Data Science VM samples

In addition to the machine-learning and deep-learning framework-based samples from the base Data Science VM, a set of geospatial samples is also provided as part of the Geo AI Data Science VM. These samples can help you jump-start your development of AI applications by using geospatial data and the ArcGIS software:


1. [Getting started with geospatial analytics with Python](https://github.com/Azure/DataScienceVM/blob/master/Notebooks/ArcGIS/Python%20walkthrough%20ArcGIS%20Data%20analysis%20and%20ML.ipynb): An introductory sample showing how to work with geospatial data through the Python interface to ArcGIS is provided by the [arcpy](https://pro.arcgis.com/en/pro-app/arcpy/main/arcgis-pro-arcpy-reference.htm) library. It also shows how to combine traditional machine learning with geospatial data and then visualize the result on a map in ArcGIS.

2. [Getting started with geospatial analytics with R](https://github.com/Azure/DataScienceVM/blob/master/Notebooks/ArcGIS/R%20walkthrough%20ArcGIS%20Data%20analysis%20and%20ML.ipynb): An introductory sample that shows how to work with geospatial data by using the R interface to ArcGIS that's provided by the [arcgisbinding](https://github.com/R-ArcGIS/r-bridge) library. 

3. [Pixel-level land use classification](https://github.com/Azure/pixel_level_land_classification): A tutorial that illustrates how to create a deep neural network model that accepts an aerial image as input and returns a land-cover label. Examples of land-cover labels are *forested* and *water*. The model returns such a label for every pixel in the image. 


## Next steps

Additional samples that use the Data Science VM are available here:

* [Samples](dsvm-samples-and-walkthroughs.md)