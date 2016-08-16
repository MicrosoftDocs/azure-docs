<properties
   pageTitle="Get started with Microsoft Power BI Embedded"
   description="Power BI Embedded, add interactive Power BI reports into your business intelligence application"
   services="power-bi-embedded"
   documentationCenter=""
   authors="minewiskan"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="power-bi-embedded"
   ms.devlang="NA"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="powerbi"
   ms.date="07/05/2016"
   ms.author="owend"/>

# Get started with Microsoft Power BI Embedded

**Power BI Embedded** is an Azure service that enables application developers to add interactive Power BI reports into their own applications. **Power BI Embedded** works with existing applications without needing redesign or changing the way users sign in.

Resources for **Microsoft Power BI Embedded** are provisioned through the [Azure ARM APIs](https://msdn.microsoft.com/library/mt712306.aspx). In this case, the resource you provision is a **Power BI Workspace Collection**.

![](media\power-bi-embedded-get-started\introduction.png)

## Create a workspace collection
A **Workspace Collection** is the top-level Azure resource and a container for the content that will be embedded in your application. A **Workspace Collection** can be created in two ways::

   -	Manually using the Azure Portal
   -	Programmatically using the Azure Resource Manager(ARM) APIs

Let's walk through the steps to build a **Workspace Collection** using the Azure Portal.

   1.	Open and sign into **Azure Portal**: [http://portal.azure.com](http://portal.azure.com).

   2.	Click **+ New** on the top panel.

       ![](media\power-bi-embedded-get-started\create-workspace-1.png)

   3.	Under **Data + Analytics** click **Power BI Embedded**.
   4.	On the **Creation Blade**, enter the required information. For **Pricing**, see [Power BI Embedded pricing](http://go.microsoft.com/fwlink/?LinkID=760527).

       ![](media\power-bi-embedded-get-started\create-workspace-2.png)

   5. Click **Create**.

The **Workspace Collection** will take a few moments to provision. When completed, you'll be taken to the **Workspace Collection Blade**.

   ![](media\power-bi-embedded-get-started\create-workspace-3.png)

The **Creation Blade** contains the information you need to call the APIs that create workspaces and deploy content to them.

<a name="view-access-keys"/>
## View Power BI API Access Keys

One of the most important pieces of information needed to call the Power BI REST APIs are the **Access Keys**. These are used to generate the **app tokens** that are used to authenticate your API requests. To view your **Access Keys**, click **Access Keys** on the **Settings Blade**. For more about **app tokens**, see [Authenticating and authorizing with Power BI Embedded](power-bi-embedded-app-token-flow.md).

   ![](media\power-bi-embedded-get-started\access-keys.png)

You'll'notice that you have two keys.

   ![](media\power-bi-embedded-get-started\access-keys-2.png)

Copy these keys and store them securely in your application. It's very important that you treat these keys as you would a password, because they'll provide access to all the content in your **Workspace Collection**.

While two keys are listed, only one key is needed at a particular time. The second key is provided so you can periodically regenerate keys without interrupting access to the service.

Now that you have an instance of Power BI for your application, and **Access Keys**, you can import a report into your own app. Before you learn how to import a report, the next section describes creating Power BI datasets and reports to embed into an app.

## Create Power BI datasets and reports to embed into an app

Now that you have created an instance of Power BI for your application, and have **Access Keys**, you will need to create the Power BI datasets and reports that you want to embed. Datasets and reports  can be created by using **Power BI Desktop**. You can download [Power BI Desktop for free](https://powerbi.microsoft.com/documentation/powerbi-desktop-get-the-desktop/). Or, to quickly get started, you can download the [Retail Analysis Sample PBIX]  (http://go.microsoft.com/fwlink/?LinkID=780547). To learn more about how to use **Power BI Desktop**, see [Getting Started with Power BI Desktop](https://powerbi.microsoft.com/en-us/guided-learning/powerbi-learning-0-2-get-started-power-bi-desktop).

With **Power BI Desktop**, you connect to your data source by importing a copy of the data into **Power BI Desktop** or connecting directly to the data source using **DirectQuery**.

Here are the differences between using **Import** and **DirectQuery**.

|Import | DirectQuery
|---|---
|Tables, columns, *and data* are imported or copied into **Power BI Desktop**. As you work with visualizations, **Power BI Desktop** queries a copy of the data. To see any changes that occurred to the underlying data, you must refresh, or import, a complete, current dataset again.|Only *tables and columns* are imported or copied into **Power BI Desktop**. As you work with visualizations, **Power BI Desktop** queries the underlying data source, which means you're always viewing current data.

For more about connecting to a data source, see [Connect to a data source](power-bi-embedded-connect-datasource.md).

After you save your work in **Power BI Desktop**, a PBIX file is created. This file contains your report. In addition, if you import data the PBIX contains the complete dataset, or if you use **DirectQuery**, the PBIX contains just a dataset schema. You programmatically deploy the PBIX into your workspace using the [Power BI Import API](https://msdn.microsoft.com/library/mt711504.aspx).

> [AZURE.NOTE] **Power BI Embedded** has additional APIs to change the server and database that your dataset is pointing to and set a service account credential that the dataset will use to connect to your database. See [Post SetAllConnections](https://msdn.microsoft.com/library/mt711505.aspx) and [Patch Gateway Datasource](https://msdn.microsoft.com/library/mt711498.aspx).

## Next Steps
In the previous steps, you created a workspace collection and your first report and dataset. Now it is time to learn how to write code for **Power BI Embedded**. To help you get started, we created a sample web app: [Get started with the sample](power-bi-embedded-get-started-sample.md). The sample shows you how to:

  -	Provision content
      - Create a Workspace
      - Import a PBIX file
      - Update connection strings and set credentials for your datasets.

  -	Securely embed a report

## See Also
- [Get started with sample](power-bi-embedded-get-started-sample.md)
- [Authenticating and authorizing with Power BI Embedded](power-bi-embedded-app-token-flow.md)
- [Power BI desktop](https://powerbi.microsoft.com/documentation/powerbi-desktop-get-the-desktop/)
