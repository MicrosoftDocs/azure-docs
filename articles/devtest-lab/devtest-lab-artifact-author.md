<properties 
	pageTitle="Create custom artifacts for your DevTest Labs VM | Microsoft Azure"
	description="Learn how to author your own artifacts for use with DevTest Labs"
	services="devtest-lab,virtual-machines"
	documentationCenter="na"
	authors="tomarcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="devtest-lab"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/01/2016"
	ms.author="tarcher"/>

#Create custom artifacts for your DevTest Labs VM

> [AZURE.VIDEO how-to-author-custom-artifacts] 

## Overview
**Artifacts** are used to deploy and configure your application after a VM is provisioned. An artifact consists of an artifact definition file and other script files that are stored in a folder in a git repository. Artifact definition files consist of JSON and expressions that you can use to specify what you want to install on a VM. For example, you can define the name of artifact, command to run, and parameters that are made available when the command is run. You can refer to other script files within the artifact definition file by name.

##Artifact definition file format
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
| title        | Yes       | Name of the artifact displayed in the lab.
| description  | Yes 	   | Description of the artifact displayed in the lab.
| iconUri	   | No	       | Uri of the icon displayed in the lab.
| targetOsType | Yes       | Operating system of the VM where artifact will be installed. Supported options are: Windows and Linux.
| parameters   | No        | Values that are provided when artifact install command is run on a machine. This helps in customizing your artifact.
| runCommand   | Yes       | Artifact install command that is executed on a VM.

###Artifact parameters

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
| displayName    Yes       | Name of the parameter that is displayed to a user in the lab.
| description  | Yes 	   | Description of the parameter that is displayed in the lab.

The allowed types are:

- string – any valid JSON string
- int – any valid JSON integer
- bool – any valid JSON Boolean
- array – any valid JSON array

##Artifact expressions and functions

You can use expression and functions to construct the artifact install command.
Expressions are enclosed with brackets ([ and ]), and are evaluated when the artifact is installed. Expressions can appear anywhere in a JSON string value and always return another JSON value. If you need to use a literal string that starts with a bracket [, you must use two brackets [[.
Typically, you use expressions with functions to construct a value. Just like in JavaScript, function calls are formatted as functionName(arg1,arg2,arg3)

The following list shows common functions.

- parameters(parameterName) - Returns a parameter value that is provided when the artifact command is run.
- concat(arg1,arg2,arg3, …..) - 	Combines multiple string values. This function can take any number of arguments.

The following example shows how to use expression and functions to construct a value.

	runCommand": {
	     "commandToExecute": "[concat('powershell.exe -File startChocolatey.ps1'
	, ' -RawPackagesList ', parameters('packages')
	, ' -Username ', parameters('installUsername')
	, ' -Password ', parameters('installPassword'))]"
	}

##Create a custom artifact

Create your custom artifact by following steps below:

1. Install a JSON editor - You will need a JSON editor to work with artifact definition files. We recommend using [Visual Studio Code](https://code.visualstudio.com/), which is available for Windows, Linux and OS X.

1. Get a sample artifactfile.json - Check out the artifacts created by Azure DevTest Labs team at our [GitHub repository](https://github.com/Azure/azure-devtestlab) where we have created a rich library of artifacts that will help you create your own artifacts. Download an artifact definition file and make changes to it to create your own artifacts.

1. Make use of IntelliSense - Leverage IntelliSense to see valid elements that can be used to construct an artifact definition file. You can also see the different options for values of an element. For example, IntelliSense show you the two choices of Windows or Linux when editing the **targetOsType** element.

1. Store the artifact in a git repository
	1. Create a separate directory for each artifact where the directory name is the same as the artifact name.
	1. Store the artifact definition file (artifactfile.json) in the directory you created.
	1. Store the scripts that are referenced from the artifact install command.

	Here is an example of how an artifact folder might look:

	![Artifact git repo example](./media/devtest-lab-artifact-author/git-repo.png)

1. Add the artifacts repository to the lab - Refer to the article, [Add a Git artifact repository to a lab](devtest-lab-add-artifact-repo.md).

## Related blog posts
- [How to troubleshoot failing Artifacts in AzureDevTestLabs](http://www.visualstudiogeeks.com/blog/DevOps/How-to-troubleshoot-failing-artifacts-in-AzureDevTestLabs)
- [Join a VM to existing AD Domain using ARM template in Azure Dev Test Lab](http://www.visualstudiogeeks.com/blog/DevOps/Join-a-VM-to-existing-AD-domain-using-ARM-template-AzureDevTestLabs)

## Next steps

- Learn how to [add a Git artifact repository to a lab](devtest-lab-add-artifact-repo.md).
