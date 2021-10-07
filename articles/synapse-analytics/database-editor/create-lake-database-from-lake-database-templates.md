---
title: Create a lake database in Azure Synapse.
description: Learn how to explore, customize and create a lake database from database template. 
author: prlangad
ms.author: prlangad
ms.service: synapse-analytics
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 11/02/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

<!--
This template provides the basic structure of a how-to article.
See the [how-to guidance](contribute-how-to-write-howto.md) in the contributor guide.

To provide feedback on this template contact 
[the templates workgroup](mailto:templateswg@microsoft.com).
-->

<!-- 1. H1
Required. Start your H1 with a verb. Pick an H1 that clearly conveys the task the 
user will complete.
-->

# Create a lake database from database templates

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->

In this article, you will learn the type of interactions that you can perform while exploring lake database templates, creating a lake database and customizing a lake database.

<!-- 3. Prerequisites 
Optional. If you need prerequisites, make them your first H2 in a how-to guide. 
Use clear and unambiguous language and use a list format.
-->

## Prerequisites

- At least Synapse User role permissions are required for exploring an lake database template from Gallery.
- Synapse Administrator, or Synapse Contributor permissions are required on the Synapse workspace for creating a lake database.
- Storage Blob Data Contributor permissions are required on data lake.
<!-- remove this section if prerequisites are not needed -->

<!-- 4. H2s 
Required. A how-to article explains how to do a task. The bulk of each H2 should be 
a procedure.
-->

## Create lake database from database template
<!-- Introduction paragraph -->
1. From your Azure Synapse Analytics workspace **Home** hub, select **Knowledge center** and then **Browse gallery**. You will land on the **Lake database templates** tab.
2. **Lake database templates** category lists standardized database templates available for specific industry.
3. You can also visit the **Lake database templates** tab from **Data** hub, **+** Add new resource, **Browse gallery** menu.
4. Select the industry you're interested in (for example, **Retail**) and select **Continue** to navigate to the exploration of the data model.
5. You will land in the canvas where preview of data model with sample tables available to start with. The canvas has various tools to help you navigate the entity-relationship diagram.
    - **Zoom to fit** to fit all tables on the canvas in the viewing area
    - **Increase zoom** to zoom in to the canvas
    - **Decrease zoom** to zoom out of the canvas
    - **Zoom slider** to control the zoom level
    - **Zoom preview** to provide a preview of the canvas
    - **Expand all**/**Collapse all** to view more or less columns within a table on the canvas
    - **Clear canvas** to clear-off all the tables on the canvas
    ![Alt text that describes the content of the image.](/media/folder-with-same-name-as-article-file/service-technology-image-description.png)
    
6. You can select a table and select the table name. It opens the table properties pane with the tabs General, Columns, and Relationships.
    - The General tab has information on the table.
    - The Columns tab has the details about all the columns that make up the table.
    - The Relationships tab lists the incoming and outgoing relationships of the table with other tables on the canvas.
    
7. To quickly add tables that are related to the table on canvas, select the ellipses to the right of the table name and then select **Add related tables**. All tables with existing relationships are added to the canvas.
8. Once the canvas has all the tables that meet your database schema requirements, select **Create database** to proceed with creation of lake database. The new database will show up in the database editor to customize it per your business needs. You can begin to customize tables, columns, and relationships inherited from the database template. You can also add custom tables, columns, relationships as desired in the database.

## Customize storage settings for a lake database
1. In Synapse database editor, properties pane, you can provide the name of the database.
2. Under storage settings for database section, you can select the linked service from the available list of services in the drop-down.
3. Input folder name gets populated for you. You can edit the folder by selecting the existing folder path in the storage.
4. Select the Data format type as Delimited text or Parquet. 

## Add and customize tables
In this section, you will learn how to create and modify tables and their properties.
1. To change the name and description of the table, select a table. The table properties pane appears. By default, the General tab will be selected. Here, you can change the Name, Description and Storage settings for the table.
2. 

## Add and customize columns
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Add and customize relationships

## Publish a lake database

<!-- 5. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
