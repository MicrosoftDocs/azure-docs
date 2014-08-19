<properties title="Create your first search solution using Azure Search" pageTitle="Create your first search solution using Azure Search" description="Create your first search solution using Azure Search" metaKeywords="" services="" solutions="" documentationCenter="" authors="heidist" videoId="" scriptId="" />

# Create your first search solution using Azure Search

[WACOM.INCLUDE [This article uses the Azure Preview portal](../includes/preview-portal-note.md)]

This exercise demonstrates a .NET solution that creates and populates an index on Azure Search. Sample files for this tutorial are posted at [https://azuresearchsamples.codeplex.com/](https://azuresearchsamples.codeplex.com/).

<!--Table of contents for topic, the words in brackets must match the heading wording exactly-->

+ [Tools, services and sample files](#sub-1)
+ [End Result](#sub-2)
+ [Steps](#sub-3)
+ [Next up](#next-steps)


## Tools, services, and samples

To complete this tutorial, you will need to download a few items and configure some services:

+	Visual Studio 2013 Express for the Web
+	Azure subscription with Azure Search Preview
+	Sample files from codeplex


## End result

When you're finished, you will have index and documents on Azure Search that you can use as the basis for additional exploration. The index is called **musicstoreindex**, and it is populated with documents for albums from three music genres.

When you run this program, message output appears in a console window.


## Steps

1.	Sign in to the Azure Preview Portal. If you don't have an Azure subscription, you can sign up for the trial version.
2.	Configure the free Search service, a limited version available at no additional cost to all subscribers.
3.	Download Visual Studio 2013 Express for the Web (or use an existing edition of Visual Studio 2013 if you have one). 
4.	Download the sample files. 
5.	Modify them to work with your environment and run the program. 

Sample files consist of a JSON schema, data files, and program code that calls Azure Service. 

You'll need to edit the configuration file to point to your service, with your api-key. When you run this program, the index and documents are created on your Azure Search service. At the end of this tutorial, you will have sample data loaded on Azure Search. 

Let's get started.

<h3>Sign in to the Azure Preview Portal</h3>

Azure Search is available only in the [Azure Preview Portal](https://portal.azure.com). Start here to get your service provisioned.

<h3>Configure the free Search service</h3>

We recommend using the free service for this tutorial. This is a limited version of Search that is available at no additional cost to all subscribers. 

[Configure Search on Azure Preview Portal](../search-configure/) contains more steps than you'll actually need. You can stop as soon as the free service is created. You will need the service URL and an api-key to continue with this tutorial.

<h3>Download Visual Studio 2013 Express for the Web</h3>

If you already have an existing edition of Visual Studio 2013, you can use that instead. 

Go to the [Download Center](http://www.microsoft.com/en-us/download/details.aspx?id=40747) to get Visual Studio 2013 Express for the Web.

<h3>Download sample files</h3>

Get the sample files from codeplex at [https://azuresearchsamples.codeplex.com/](https://azuresearchsamples.codeplex.com/). The package consists of a Visual Studio solution built in Visual Studio 2013 Express for the Web. 

<h3>Modify and run Intro.Net</h3>

**Intro.NET** consists of JSON schema, data files, configuration files, and program code. You’ll need to edit the configuration file to point to your service, with your api-key. 

This is a console application. When you run this program, the index and documents are created on your Azure Search service. Status is reported in the console window in Visual Studio.

1.	Open Intro.net.sln.
2.	Open app.config
3.	Replace the following settings with values that are valid for your service. You can get these values from the service dashboard in the Azure Preview Portal.

            <add key="primaryKey" value="TODO: Paste your API key here" />
            <add key="serviceUrl" value="TODO: Paste your service URL here" />

4.	Save your changes.
5.	Run the solution.

You should see a console window that reports out a series of status messages
 "Index created" is the final message. Once you see that, you can go on to the next step.


## Next up

Check back with us on the Azure Search documentation page for upcoming tutorials and videos that showcase Azure Search functionality and programming techniques. We don't promise something new every day, but when we have new material, you can find it here first. 

Thanks for completing this tutorial. Questions or comments? Find us on MSDN Azure forums.


<!--Anchors-->
[Tools, services and sample files]: #sub-1
[End Result]: #sub-2
[Steps]: #sub-3
[Next up]: #next-steps

<!--Image references-->


<!--Link references-->
[Manage your search solution in Microsoft Azure]: ../search-manage/
[Azure Search development workflow]: ../search-workflow/
[Configure Search in Azure Preview Portal]: ../search-configure
