<properties
   pageTitle="Get stated with sample"
   description=""
   services="power-bi-embedded"
   documentationCenter=""
   authors="dvana"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="powerbi-embedded"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="power-bi-embedded"
   ms.date="03/08/2016"
   ms.author="derrickv"/>

   # Get started with Microsoft Power BI Embedded sample code

   Here are some resources to help you get started using Microsoft Power BI Embedded preview

   -	Sample code
   -	API docs
   -	SDKs (available via NuGet)

   Let’s take a high level look at the steps involved to get started with the sample applications.

   > [AZURE.NOTE] Before starting, make sure that you have created at least one Workspace Collection in your Azure subscription. To learn how to create a Workspace Collection in the Azure Portal see [Getting Started with Power BI Embedded Preview](power-bi-embedded-get-started.md).

   ## Setup & Samples

   The following will walk you through setting up your Visual Studio development environment to access the Preview components

   1.	Download and unzip the powerbi-private-preview-sample-feb26.zip file.
   2.	Open **PowerBIPrivatePreview.sln** in Visual Studio.
   3.	Build solution.
   4.	Run ProvisionSample console app.

       ![](media\powerbi-embedded-get-started-sample\console.png)

       a.	Select option 5 to **Create a new workspace within existing collection**.

       b.	Enter your subscription id, workspace collection and signing key when prompted (These can be found in the Azure portal).
       ![](media\powerbi-embedded-get-started-sample\azure-portal.png)

       c.	Copy and save the newly created workspace id to use later (this can also be found in the Azure portal after it is created).

       d.	Import a PBIX file using option 6.

         - If prompted, provide the friendly name for your DataSet.

         - You should see a response like:

             - Checking import state... Publishing
             - Checking import state... Succeeded

     e.	If your PBIX file contains any direct query connections run option 7 to update the connection strings.

     f.	Select option 8 to retrieve the Embed URL that you should use to add the report to your application.

   5.	Open the web.config in the paas-demo web application within the same solution.

     a.	Add your signing key, workspace collection name and workspace ID to the appSettings section.

   6.	Run the paas-demo web application.

     a.	Left nav should contain a “Reports” menu.

     b.	Click the Report (should match name of imported PBIX).

     c.	Report should now render within the main portion of the app window.

       ![](media\powerbi-embedded-get-started-sample\report.png)
