    <properties 
	pageTitle="Authoring Artifacts | Microsoft Azure" 
	description="Learn how to author your own artifacts for use with DevTest Labs" 
	services="devtest-lab,virtual-machines" 
	documentationCenter="na" 
	authors="patshea123" 
	manager="douge" 
	editor=""/>
  
<tags 
	ms.service="devtest-lab" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/24/2015" 
	ms.author="patshea"/>

#Authoring Artifacts

**Artifacts** are used to deploy and configure your application after a VM is provisioned. An artifact consists of an artifact definition file and other script files that are stored in a folder in a git repository. Artifact definition file consists of JSON and expressions which you can use to specify what you want to install on a machine. For example, you can define the name of artifact, command to run and parameters that are made available when the command is run. You can refer to other script files within artifact definition file using their name. 

##Artifact concepts

###Artifact definition file format
The following example shows the sections that make up the basic structure of a definition file.

	{
	  "$schema": "https://raw.githubusercontent.com/Azure/azure-devtestlab/master/schemas/2015-01-01/dtlArtifacts.json",
	  "title": "",
	  "description": "",
	  "iconUri": "",
	  "targetOsType": "",
	  "parameters": {
	    "<parameterName>": {
	      "type": "",
	      "displayName": "",
	      "description": ""
	    }
	  },
	  "runCommand": {
	    "commandToExecute": ""
	  }
	}

| Element name | Required? | Description
| ------------ | --------- | -----------
| $schema      | No        | Location of the JSON schema file that helps in testing the validity of the definition file.
| title        | Yes       | Name of the artifact that is displayed in the lab.
| description  | Yes 	   | Description of the artifact that is displayed in the lab.
| iconUri	   | No	       | Uri of the icon that will be displayed in the lab.
| targetOsType | Yes       | Operating system of the machine where artifact will be installed. Supported options are: Windows and Linux.
| parameters   | No        | Values that are provided when artifact install command is run on a machine. This helps in customizing your artifact.
| runCommand   | Yes       | Artifact install command that is executed on a machine.

###Parameters

In the parameters section of the definition file, you specify which values a user can input when installing an artifact. You can refer to these values in the artifact install command. 

You define parameters will the following structure.

	"parameters": {
	    "<parameterName>": {
	      "type": "<type-of-parameter-value>",
	      "displayName": "<display-name-of-parameter>",
	      "description": "<description-of-parameter>"
	    }
	  }

| Element name | Required? | Description
| ------------ | --------- | -----------
| type         | Yes       | Type of parameter value. See the list below for the allowed types:
|              |           | A second line
| displayName    Yes       | Name of the parameter that is displayed to a user in the lab. 
| description  | Yes 	   | Description of the parameter that is displayed in the lab.
