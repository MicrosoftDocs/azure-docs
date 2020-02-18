---
title: Quickstart create a SQL Analytics pool #Required; update as needed page title displayed in search results. Include the brand.
description: Create a new SQL Analytics pool for an Azure Synapse Analytics workspace by following the steps in this guide. #Required; Add article description that is displayed in search results.
services: synapse-analytics 
author: malvenko #Required; update with your GitHub user alias, with correct capitalization.
ms.service: synapse-analytics 
ms.topic: quickstart #Required
ms.subservice:  #leave blank
ms.date: 1/10/2019 #Update with current date; mm/dd/yyyy format.
ms.author: josels #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---

<!---Recommended: Removal all the comments in this template before you sign-off or merge to master.--->

<!---quickstarts are fundamental day-1 instructions for helping new customers use a subscription to quickly try out a specific product/service. The entire activity is a short set of steps that provides an initial experience.
You only use quickstarts when you can get the service, technology, or functionality into the hands of new customers in less than 10 minutes.
--->

# Quickstart: Create a new SQL Analytics pool 
<!---Required:
Starts with "quickstart: "
Make the first word following "quickstart:" a verb.
--->

Synapse Analytics offers various analytics engines to help you ingest, transform, model, analyze,  and serve your data. A SQL Analytics pool offers T-SQL based compute and storage capabilities. After creating a SQL Analytics pool in your Synapse workspace, data can be loaded, modeled, processed, and served to obtain insights.  

This quickstart describes the steps to create a SQL Analytics pool in a Synapse workspace by using the Azure portal.

If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).

<!---Required:
Lead with a light intro that describes, in customer-friendly language, what the customer will learn, or do, or accomplish. Answer the fundamental “why would I want to do this?” question.
--->

<!---Avoid notes, tips, and important boxes. Readers tend to skip over them. Better to put that info directly into the article text.--->

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- [Synapse Analytics workspace](./quickstart-create-new-synapse-workspace.md)
<!---If you feel like your quickstart has a lot of prerequisites, the quickstart may be the wrong content type - a tutorial or how-to guide may be the better option.
If you need them, make Prerequisites your first H2 in a quickstart.
If there’s something a customer needs to take care of before they start (for example, creating a VM) it’s OK to link to that content before they begin.
--->

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/)
<!---If you need to sign in to the portal to do the quickstart, this H2 and link are required.--->

## Navigate to the Synapse Analytics workspace

<!---Required:
Quickstarts are prescriptive and guide the customer through an end-to-end procedure. Make sure to use specific naming for setting up accounts and configuring technology.
Don't link off to other content - include whatever the customer needs to complete the scenario in the article. For example, if the customer needs to set permissions, include the permissions they need to set, and the specific settings in the quickstart procedure. Don't send the customer to another article to read about it.
In a break from tradition, do not link to reference topics in the procedural part of the quickstart when using cmdlets or code. Provide customers what they need to know in the quickstart to successfully complete the quickstart.
For portal-based procedures, minimize bullets and numbering.
For the CLI or PowerShell based procedures, don't use bullets or numbering.
--->

1. Navigate to the Synapse workspace where the SQL pool will be created by typing the service name (or resource name directly) into the search bar:
![Azure portal search bar with Synapse workspaces typed in.](media/quickstart-create-a-sqlpool-00a.png).
1. From the list of workspaces, type the name (or part of the name) of the workspace to open -- in this case, we will use a workspace named **contosoanalytics**
![Listing of Synapse workspaces filtered to show those containing the name Contoso.](media/quickstart-create-a-sqlpool-00b.png)
1. Click on the **New SQL pool** command in the top bar.
![Overview of Synapse workspace with a red box around the command to create a new SQL Analytics pool.](media/quickstart-create-a-sqlpool-01.png)
1. Enter the following details in the **Basics** tab:

    | Setting | Suggested value | Description |
    | :------ | :-------------- | :---------- |
    | **SQL pool name** | contosoedw | This is the name that the SQL pool will have. |
    | **Performance level** | DW100c | Set this to the smallest size to reduce costs for this quickstart |
    ||||
    ![SQL Analytics pool create flow - basics tab.](media/quickstart-create-a-sqlpool-02.png)
    > [!IMPORTANT]
    > Note that there are specific limitations for the names that SQL pools can use. Names can't contain special characters, must be 15 or less characters, not contain reserved words, and be unique in the workspace.

4. In the next tab (Additional settings), select **none** to provision the SQL pool without data. Leave the default collation selected.
![SQL Analytics pool create flow - additional settings tab.](media/quickstart-create-a-sqlpool-03.png)

1. We will not add any tags for now, so click on **Next: Review + create**.

1. In the **Review + create** tab, make sure that the details look correct based on what was previously entered, and press **create**. 
![SQL Analytics pool create flow - review settings tab.](media/quickstart-create-a-sqlpool-04.png)

1. At this point, the resource provisioning flow will start.
 ![SQL Analytics pool create flow - resource provisioning.](media/quickstart-create-a-sqlpool-06.png)

1. After the provisioning completes, navigating back to the workspace will show a new entry for the newly created SQL pool.
 ![SQL Analytics pool create flow - resource provisioning.](media/quickstart-create-a-sqlpool-07.png)

## Clean up resources

Follow the steps below to delete the SQL pool from the workspace.
> [!WARNING]
> Deleting a SQL pool will both remove the analytics engine and the data stored in the database of the deleted SQL pool from the workspace. It will no longer be possible to connect to the SQL pool, and all queries, pipelines, and notebooks that read or write to this SQL pool will no longer work.

If you want to delete the SQL pool, do the following:

1. Navigate to the SQL pools blade in the workspace blade
1. Select the SQL pool to be deleted (in this case, **contosoedw**)
1. Select it and press **delete**.
 ![SQL Analytics pool overview - highlighting delete command.](media/quickstart-create-a-sqlpool-10.png)
1. Confirm the deletion, and press **Delete** button.
 ![SQL Analytics pool overview - highlighting delete confirmation.](media/quickstart-create-a-sqlpool-11.png)
1. When the process completes successfully, the SQL pool will no longer be listed in the workspace resources. 

<!---Required:
To avoid any costs associated with following the quickstart procedure, a Clean up resources (H2) should come just before Next steps (H2)
--->

## Next steps
Once the SQL pool is created, it will be available in the workspace for loading data, processing streams, reading from the lake, etc. 

See the other Synapse quickstarts to get started using the SQL Analytics pool.
<!--
Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](tutorial-facilities-app.md)
--->

<!--- Required:
Quickstarts should always have a Next steps H2 that points to the next logical quickstart in a series, or, if there are no other quickstarts, to some other cool thing the customer can do. A single link in the blue box format should direct the customer to the next article - and you can shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also section". --->