<properties 
	pageTitle="Author Custom R Modules in Azure Machine Learning | Azure" 
	description="Quick start for authoring custom R modules in Azure Machine Learning." 
	services="machine-learning" 
	documentationCenter="" 
	authors="bradsev"  
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="tbd" 
	ms.date="02/04/2015" 
	ms.author="bradsev" />


# Author Custom R Modules in Azure Machine Learning

This topic outlines how to author a custom R module in Azure Machine Learning. It describes what a custom R module is and what files are used to define them. It illustrates how to construct these files and register the module for deployment in a Machine Learning workspace. The elements and attributes used in the definition of the custom module are then described in more detail. How to use auxiliary functionality and files and multiple outputs is also outlined. 

## What is a custom R module?
A custom module is a user-defined module that can be uploaded to the workspace of a user and executed as part of an Azure Machine Learning experiment. A Custom R Module is a custom module that executes a user-defined R function in Machine Learning. R is a programming language for statistical computing and graphics that is widely used by statisticians and data scientists for implementing algorithms. Machine Learning language support is set by default to use the R language in custom modules.

Custom modules have first-class status in Azure Machine Learning in the sense that they can used just like any other module. They can be executed with other modules, included in published experiments, or visualized. Users have control over the algorithm implemented by the module, the input and output ports to be used, the modeling parameters, and other various runtime behaviors.


## Files in a Custom R Module
A custom R module is defined by a .zip file that contains, at a minimum, two files:

* A file that implements the R function exposed by the module
* An XML definition file that describes the custom module

Additional auxiliary files can also be included in the .zip file that provide functionality that can be accessed from the custom module. This option is discussed below.

## Quick Start Example
This example illustrates how to construct the files required by a custom R module, package them in a zip file and then register the module in your Machine Learning workspace.

Consider the example of a custom My Add Rows module that modifies the standard implementation of the Add Rows module used to concatenate rows (observations) from two datasets (data frames). The Add Rows module appends the rows of the second input dataset to the end of the first input dataset using the rbind algorithm. The customized `myAddRows` function similarly accepts two datasets, but also accepts an additional Boolean swap parameter as an input. If the swap parameter is **FALSE**, it returns the same data set as the standard implementation. But if the swap parameter is **TRUE**, it appends rows of first input dataset to the end of the second dataset instead. The file that implements the R myAddRows function exposed by the  My Add Rows module contains the following R code.

	myAddRows <- function(Dataset1, Dataset2, swap=FALSE) {
	if (swap) { 
		dataset <- rbind(Dataset2, Dataset1))
	 } else { 
	  	dataset <- rbind(Dataset1, Dataset2)) 
	 } 
	return (dataset)
	}

To expose this `myAddRows` function as an Azure Machine Learning module, an XML definition file must be created to specify how the My Add Rows module should look and behave. 

	<Module Version="v0.00.1" type="Public" insync="false" Owner="myName">
	  <GUID>{1CE529D1-B9D2-496F-AB42-8DBA60DE8279}</GUID>
	  <ID>myAddRows</ID>
	  <Name>My Add Rows</Name>	
	  <State>Custom</State>
	  <Description>This is my module description. </Description>
	  <Language Name="R" EntryPointFile="myAddRows.R" EntryPoint="myAddRows" />  
	    <Ports>
	      <output id="dataset" display="dataset" type="DataTable">
	        <Description>Combined Data</Description>
	      </output>
	      <input id="Dataset1" display="Dataset1" type="DataTable">
		    <Description>Input dataset 1</Description>
	      </input>
	      <input id="Dataset2" display="Dataset2" type="DataTable">
		    <Description>Input dataset 2</Description>
	      </input>
	    </Ports>
	    <Arguments>
	      <arg id="swap" display="swap" type="bool" >
	        <Description>Swaps inputs</Description>
	      </arg>
	    </Arguments>
	  <Category>My Category</Category>
	</Module>

 
Note that it is critical that the content of the ID element in the XML file matches the function name exactly. 

Save these two files as *myAddRows.R* and *myAddRows.xml* and then zip them together into a *myAddRows.zip* file.

To register them in your Machine Learning workspace, go to your  workspace in the Machine Learning Studio, click the **+NEW** button on the bottom and choose **MODULE -> FROM ZIP PACKAGE** to upload the new custom My Add Rows module.

![](http://i.imgur.com/RFJhCls.png)

The My Add Rows module is now ready to be accessed by your Machine Learning experiments.

## Elements in the XML definition file

### Inputs and Outputs
The inputs and outputs for a custom module are specified in child elements of the Ports section of the XML definition file. The order of these input and output elements determines layout experienced (UX) by users. The first child listed in the Ports element  of the XML file will be the left-most input port in the Machine Learning UX. The data types that are supported for input and output ports are as follows: 

**DataTable**: This type is passed to your R function as a data.frame. IN fact, any types (for example, CSV files or ARFF files) that are supported  by Machine Learning and that are compatible with DataTable are converted to a data.frame automatically. 

       <input id="dataset1" display="Input 1" type="DataTable" IsOptional="false">
           <Description>Input Dataset 1</Description>
       </input>

**Zip**: custom modules can accept a zip file as input. This input is unpacked into the execution directory of your function

       <input id="zippedData" display="Zip Input" type="Zip" IsOptional="false">
           <Description>Zip Input for port</Description>
       </input>

It is required that the id attributes associated with each of the input and output ports have unique values and that these values match the named parameters in your R function. Also, a default value must be specified for the attributes whose inputs are optional. The IsOptional attribute is optional for both the DataTable and Zip types and is false by default. This default value indicates that the input type is not optional.


### Parameters
Parameters for a custom module are specified in the child elements of the Arguments section of the XML definition file. As with the child elements in the Ports section, the ordering of parameters in the Arguments section defines the layout encountered in the UX. The first parameter listed will be the first function parameter. The types supported by Machine Learning for parameters are listed below. The optional attributes must have their default values specified in the XML definition. These are the values used if the parameter value is not specified when using the function. Which attributes are optional is indicated for each type.


**int** – an Integer (32-bit) type parameter.

       <arg id="intValue1" display="My int Param" type="int" IsOptional="false" MinValue=”0” MaxValue=”100”>
           <Description>Integer Parameter 1</Description>
       </arg>

IsOptional, MinValue and MaxValue are optional for int.

**double** – a double type parameter.

       <arg id="doubleValue1" display="My double Param" type="double" IsOptional="false" min="0.000" max="0.999" default="0.3">
           <Description>Double Parameter 1</Description>
       </arg>
IsOptional, min,  max, default are optional for double.

**bool** – a Boolean parameter that is represented by a check-box in UX.

       <arg id="boolValue1" display="My boolean Param" type="bool" default="true">
           <Description>Boolean Parameter 1 </Description>
       </arg>

default is optional for bool.

**string**: a standard string

        <arg id="stringValue1" display="My string Param" type="string" default="default value" IsOptional="true">
           <Description>String Parameter 1</Description>
        </arg>

default and IsOptional are optional for string.

**ColumnPickerFor**: a column selection parameter. This type renders in the UX as a column chooser. The id of the DataTable that you are choosing columns from should replace table part in the value for the type attribute. The variable will be passed to your function as a list of strings. 

        <arg id="columnSelection1" display="My Column Param" type="ColumnPickerFor:table">
           <Description>My column selector Param 1</Description>		
        </arg>

If, for example, we had a DataTable with an id of dataset1, the type would have 

		type="ColumnPickerFor:dataset1" 
                            
**enum:<DropDown Type ID>**: an enumerated (drop-down) list. The chosen value is passed as a string to your R function. This type requires that the valid enumerated values be first defined within the Arguments section.

       <DropDownType id="myDropDown1">
           <o id="red" display="Red"/>
           <o id="yellow" display="Yellow"/>
           <o id="blue" display="Blue"/>
       </DropDownType>
       <arg id="enum1" display="My Enum Param" default="red" type="enum:myDropDown1">
           <Description>My Enum Param 1</Description>
       </arg>

As with inputs and outputs, it is critical that each of the parameters have unique id values associated with them. In addition, the id values must correspond to the named parameters in your R function. In our quick start example the associated id/parameter was *swap*.

### Language Definition
The Language element in your XML definition file defines language specific functionality. For R modules generally, we have 

	<Language Name="R" EntryPointFile="myFunc.R" EntryPoint="myFunc" AddDisplayOutputPort="false"/>

This specifies the specific language, the file in which the function is defined and the entry point in that definition. The AddDisplayOutputPort attribute is optional for the Language element. As with the Execute R Script module (link TBD), if you want to add an output port that can be used for visualizing plots/graphs, choose *true* for the AddDisplayOutputPort tag and an extra output port will be displayed. 

### Auxiliary Functionality

There are a number of attributes which are not exposed by this example but that can be used by custom module authors. For example, a module can have deterministic or non-deterministic behavior. A deterministic module will not execute a second time when given the same input data and same parameter configuration. Cached results will instead be used and propagated to any downstream modules. An example of a deterministic module in Azure Machine Learning is the Add Rows module. An example of a non-deterministic module is Reader. To make your custom module non-deterministic, change the default setting by adding the following attribute to your definition:

	<IsDeterministic>false</IsDeterministic>

### Auxiliary Files

Any file that is placed in your custom module ZIP file will be available for use during execution time. If there is a directory structure present it will be preserved. This means that file sourcing will work the same locally and in Azure Machine Learning execution. 

For example, say you want to remove any rows with NAs and any duplicate rows in dataset before outputting it in myAddRows, and you’ve already written an R function that does that in a file removeDupNARows.R:

	removeDupNARows <- function(dataFrame) {
		#Remove Duplicate Rows:
		dataFrame <- unique(dataFrame)
		#Remove Rows with NAs:
		finalDataFrame <- dataFrame[complete.cases(dataFrame),]
		return(finalDataFrame)
	}
You can source the auxiliary file removeDupNARows.R in myAddRows function:

	myAddRows <- function(Dataset1, Dataset2, swap=FALSE) {
		source(“removeDupNARows.R”)
	if (swap) { 
		dataset <- rbind(Dataset2, Dataset1))
	 } else { 
	  	dataset <- rbind(Dataset1, Dataset2)) 
	 } 
	dataset <- removeDupNARows(dataset)
	return (dataset)
	}

And then upload a zip file containing ‘myAddRows.R’, ‘myAddRows.xml’, and ‘removeDupNARows.R’ as a custom R module.

### Multiple Outputs

In order to output more than one object of a supported data type, the appropriate output ports need to be specified in the XML definition file and the objects need to be returned as a list. The output objects will be assigned to output ports from left to right, reflecting the order in which the objects are placed in the returned list.
 
For example, if you want to output dataset, Dataset1, and Dataset2 to output ports dataset, dataset1, and dataset2 from left to right, respectively, define the output ports in the ‘myAddRows.xml’ file as follows:

	<Ports>
	    <output id="dataset" display="dataset" type="DataTable">
	        <Description>Combined Data</Description>
	    </output>
		<output id="Dataset1" display="dataset1" type="DataTable">
	        <Description>Combined Data</Description>
	    </output>
		<output id="Dataset2" display="dataset2" type="DataTable">
	        <Description>Combined Data</Description>
	    </output>
	    <input id="Dataset1" display="Dataset1" type="DataTable">
		    <Description>Input dataset 1</Description>
	    </input>
	    <input id="Dataset2" display="Dataset2" type="DataTable">
		    <Description>Input dataset 2</Description>
	    </input>
	</Ports>

And return the list of objects in a list in the correct order in ‘myAddRows.R’:

	myAddRows <- function(Dataset1, Dataset2, swap=FALSE) {
	if (swap) { 
		dataset <- rbind(Dataset2, Dataset1))
	 } else { 
	  	dataset <- rbind(Dataset1, Dataset2)) 
	 } 
	return (list(dataset, Dataset1, Dataset2))
	}

## Execution Environment

TBD

## Next steps

TBD
