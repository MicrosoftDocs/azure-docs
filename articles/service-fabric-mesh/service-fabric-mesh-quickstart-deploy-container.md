---
<!-- All articles need the metadata header along with the required values for reporting.</br>
Detailed instructions for completing this template are available in the </br>
Contributor Guide:https://review.docs.microsoft.com/en-us/help/contribute/mock-template-quickstart?branch=master -->

---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Intent and product brand in a unique string of 43-59 chars including spaces - do not include site identifier (it is auto-generated.)
description: 115-145 characters including spaces. Edit the intro para describing article intent to fit here. This abstract displays in the search result.
services: Azure SeaBreeze
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: david-stanford
ms.author: dastanfo
ms.date: 04/05/2018
ms.topic: quickstart
ms.service: service-fabric-mesh
manager: timlt
---
# SeaBreeze Application

In this introduction to Sea Breeze we will walk you through;
•	Deploying a sample quickstart application called “SbzVoting” which is a web voting application
•	Check its status as it is deploying and once it is deployed
•	Try out the application
•	Review the applications JSON file to see its layout
•	See logs from the containers deployed in your application
•	Delete the application to free up resources.
 

To read more about applications and SeaBreeze, head over to the [SeaBreeze Overview](./seabreeze-overview.md)

**Note:** In preview 2, you are restricted to a quota of 6 cores. 



## Set up the SeaBreeze CLI
In order to deploy and manage an application, we will be using Azure CLI (minimum required version is 2.0.30). If you don't currently have Azure CLI set up or need to update it, see [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest). You can run this quickstart on [Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview).

1. Open a [CLI prompt](https://docs.microsoft.com/en-us/cli/azure/overview?view=azure-cli-latest) or Bash shell using [Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview).
2. Remove any previous install of the SeaBreeze CLI module.

	```cli
	az extension remove --name azure-cli-sbz 
	```

3. Install the SeaBreeze CLI module. For the preview, we are providing a .whl file with the CLI module, at public preview we would ship it as a part of the Azure CLI.

	```cli
	az extension add --source https://seabreezepreview.blob.core.windows.net/cli/azure_cli_sbz-0.4.0-py2.py3-none-any.whl
	```

## Create the application Resource

1. Login to Azure and set your subscription to the one that has been white-listed for the preview.

	```cli
	az login
	az account set --subscription "<subscriptionName>"
	```
2. Create a resource group (RG) to deploy the application to. Alternatively, you can use an existing RG and skip this step. The preview is available only in eastus.

	```cli
	az group create --name <resourceGroupName> --location eastus 
	```

3. Create your application using the following deployment command: 

	```cli
	az sbz deployment create --resource-group <resourceGroupName> --template-uri https://seabreezequickstart.blob.core.windows.net/quickstart/application-quickstart.json

	```
In a few seconds, your command should return with "provisioningState": "Succeeded" . Given below is the output from the command when using [Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview). 

![AppDepl]
 

## Check application deployment status
At this point, your application has been deployed. You can check to see its status by using the `app show` command. This command is useful, if you wanted to followup on a application deployment.

The application name for our quickstart application is SbzVoting, so let us fetch its details. 

```cli
az sbz app show --resource-group <resourceGroupName> --name SbzVoting
```

## Go to the application

Once the application status is returned as ""provisioningState": "Succeeded", we need the ingress endpoint of the service, so let us query the network resource, so get IP address to the container where the service is deployed, and open it on a browser.

The network resource for our quickstart application is SbzVotingNetwork, so let us fetch its details.

```cli
az sbz network show --resource-group <resourceGroupName> --name SbzVotingNetwork
```
The command should now return, with information like the screen shot below when running the command in [Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview).
From the output, copy the IP address .
![ingress]

For example, my service end point IP is 13.90.141.214 and I just open the URL - http://13.90.141.214:80 in your favorite browser.

You can now add voting options to the application and vote on it, or delete the voting options.

![votingapp]

## Quick review of the quick start application details

For a detailed review of this quick start application and its source code, go to the [Samples includes in the Repo](https://github.com/Azure/seabreeze-preview-pr/tree/master/samples) folder. 

Let us quickly review the [Application-quickstart.Json](https://seabreezequickstart.blob.core.windows.net/quickstart/application-quickstart.json)

This application has two Services : VotingWeb  and VotingData . They are marked by the red boxes in the picture below.

![appjson]

Let us now review the VotingWeb service. Its code package is in a container called "VotingWeb.Code". The container details are  marked by the red boxes in the picture below.

![servicejson]


## See all the application you have currently deployed to your subscription

You can use the "app list" command to get a list of applications you have deployed to your subscription. 

```cli
az sbz app list -o table
```

## Deleting the application

There are other operations like retrieving container logs etc,that you can do on the application. scroll down for those commands. when you are ready to delete the application run the following command. 

```cli
az sbz app delete --resource-group <resourceGroupName> 
```
In order to conserve the limited resources allocated to the preview program, it is encouraged that you do not leave your application running overnight, unless you have a specific need to do so.

## See the application logs

For this preview, we have not enabled the ability for you to pump the logs, events and performance counters to azure storage for later diagnostics. That functionality will be enabled as we progress along towards public preview.

For each codepackage (container) in your service instance, you can check its status as well as the logs coming from the containers in the service. 

1. Check the logs for each container instance in a CGS. In this example, we are going to fetch the logs from the container VotingWeb.Code, which is in the first replica of the service VotingWeb
	
```cli
az sbz container logs --resource-group <myResourceGroup> --application-name SbzVoting --service-name VotingWeb --replica-name 0 --code-package-name VotingWeb.Code
```

# H1 article title
Introductory paragraph

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Log in to the Azure Portal
If required: Log in to the Azure portal at http://portal.azure.com

## Launch Azure Cloud Shell
If required

## Procedural step 1
At least one procedural step is required

## Procedural step 2


## Clean up resources
Add the steps to avoid additional costs

## Next steps
A brief sentence with a link surrounded by the blue box

Advance to the next article to learn more
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

