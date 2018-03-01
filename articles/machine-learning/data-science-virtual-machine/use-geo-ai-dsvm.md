
# Using the Geo AI Data Science VM

Once you have provisioned your Geo AI Data Science VM (Geo-DSVM) and signed into ArcGIS Pro with your ArcGIS account, you can start interacting with ArcGIS desktop and ArcGis online to fetch data for analysis, perform data wrangling and build  models for AI applications with Geospatial information. You can also access ArcGIS from Python interfaces and R language bridge pre-configured on the Geo-DSVM.  You can combine it with the comprehensive toolset of machine learning and deep learning frameworks and other data science software available on the DSVM to build rich AI applications.  

## Configuration details

The Python library, [arcpy](http://pro.arcgis.com/en/pro-app/arcpy/main/arcgis-pro-arcpy-reference.htm) which is used to interface with ArcGIS is installed in the global root conda environment of the DSVM that is found at ```c:\anaconda```. If you running Python in a command prompt, just run ```activate``` to activate into the conda root Python environment. If you are using an IDE or Jupyter notebook, you can select the environment or kernel to ensure you are in the correct conda environment. 

The R-bridge to ArcGIS is installed as an R library named [arcgisbinding](https://github.com/R-ArcGIS/r-bridge) in the main Microsoft R server standalone instance located at ```C:\Program Files\Microsoft\ML Server\R_SERVER```. Visual Studio, RStudio and Jupyter are already pre-configured to use this R environment and will have access to the ```arcgisbinding``` R library. 

# Geo AI Data Science VM samples

In addition to the ML and deep learning framework-based samples from the base DSVM, as part of the Geo AI Data Science VM, we also provide a set of geospatial samples. These help you jump start your development of AI applications leveraging Geospatial data and the ArcGIS software. 


1. [Getting stated with Geospatial analytics with Python](https://github.com/Azure/DataScienceVM/blob/master/Notebooks/ArcGIS/Python%20walkthrough%20ArcGIS%20Data%20analysis%20and%20ML.ipynb): This is a introductory sample showing how to work with Geospatial data using the Python interface to ArcGIS provided by the [arcpy](http://pro.arcgis.com/en/pro-app/arcpy/main/arcgis-pro-arcpy-reference.htm) library. It also shows how you can combine traiditional Machine learning with Geo spatial data and visualizing the result on a map in ArcGIS. 

2. [Getting stated with Geospatial analytics with R](https://github.com/Azure/DataScienceVM/blob/master/Notebooks/ArcGIS/R%20walkthrough%20ArcGIS%20Data%20analysis%20and%20ML.ipynb): This is a similiar introductory sample showing how to work with Geospatial data using the R interface to ArcGIS provided by the [arcgisbinding](https://github.com/R-ArcGIS/r-bridge) library. 

3. [Pixel-level land use classification](https://github.com/Azure/pixel_level_land_classification): This is an end-to-end tutorial illustrating how to create a deep neural network model that accepts an aerial image as input and returns a land cover label (forested, water, etc.) for every pixel in the image. The model is buolt using Microsoft's open source [Cognitive Toolkit (CNTK)](https://www.microsoft.com/en-us/cognitive-toolkit/) deep learning framework. The example also shows how to scale out the training on [Azure Batch AI](https://docs.microsoft.com/azure/batch-ai/) and consume the model predictions in ArcGIS Pro software. 



