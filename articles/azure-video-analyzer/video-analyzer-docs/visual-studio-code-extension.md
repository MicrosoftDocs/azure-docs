---
title: Use Azure Video Analyzer Visual Studio Code extension
description: This reference article explains how to use the various pieces of functionality in the Azure Video Analyzer Visual Studio Code extension.
ms.service: azure-video-analyzer
ms.topic: reference
ms.date: 05/01/2021

---

# Use Azure Video Analyzer Visual Studio Code extension

Azure Video Analyzer is a platform to make building video analysis programs easier, and the associated Visual Studio Code extension is a tool to make learning that platform easier.  This article is a reference to the various pieces of functionality offered by the extension.  It covers the basics of:

* Pipelines – creation, editing, deletion, viewing the JSON
* Instances – creation, activation, deactivation, deletion, viewing the JSON
* Editing a pipeline  – modules, parameters, system variables, connections, validation

If you have not set up the extension to connect to your edge device, follow the [Azure Video Analyzer Visual Studio Code extension](./create-pipeline-vs-code-extension.md) quickstart.

## Managing pipelines

To create a pipeline, along the left under your module right-click on **Pipelines** and select **Create pipeline**.  This will open up a new blank pipeline.  You can then either load one of the pre-made pipelines by selecting from the **Try sample pipelines** dropdown at the top, or building one yourself.  

After all required areas are complete, you will need to save the pipeline with the **Save** in the top right.  For sample pipelines required field should be pre-filled.  This will make it available for use with creating instances.

To edit an existing pipeline, on the left under pipelines right-click on the name of the pipeline, and select **Edit pipeline**.

To delete an existing pipeline, on the left under pipelines right-click on the name of the pipeline, and select **Delete pipeline**.  Instances will need to be removed first.

If you want to view the underlying JSON behind an existing pipeline, on the left under pipelines right-click on the name of the pipeline, and select **Show pipeline JSON**.

## Instances

To create an instance of a pipeline, along the left under pipelines right-click on the name of the pipeline and select **Create instance**.  You will then need to fill in an instance name, and any required parameters before continuing.  In the top right you can then either click **Save** which will save it in an inactive state, or **Save and activate** which will start the instance immediately.

To activate an existing instance, along the left under pipelines right-click on the name of the pipeline instance and select **Active pipeline instance**.

To deactivate a running instance, along the left under pipelines right-click on the pipeline instance and select **Deactivate pipeline instance**.  This will not delete the instance.

To delete an existing instance, along the left under pipelines right-click on the pipeline instance and select **Delete pipeline instance**.  You cannot delete an active instance.

If you want to view the underlying JSON behind an existing instance, on the left under pipelines right-click on the pipeline instance and select **Show pipeline instance JSON**.

## Editing a pipeline 

Pipelines are constructed of a variety of pieces.  You can learn about these pieces in the [Pipelines](./pipeline.md) concept doc.  This section is about the portions of the interface to help you build or edit a pipeline.

### Modules

Modules are available along the left, and are grouped into sources, processors, and sinks.  To add one to your pipeline drag it in to the editing area.

If you want another module of the same type with the same starting parameters, you can duplicate it by right-clicking on the module and selecting **Copy**.

If you want to remove a module from the pipeline, right-click on the module and select **Delete**.

### Parameters

You can edit the attributes on a module by left clicking on it in the editing area.  This will bring up a pane on the right with a list of all the elements.  Required items are marked with a red asterisk.  There is a brief description in the information text by the name of each item.

As pipelines are effectively templates that you may make multiple instances of, some items you will want to fill in at instance creation time.  You can do this with parameters.  To activate this, right-click on the three dots along the right of the attribute and select **Parameterize**.  This will bring up a window.

In the parameterization window, you can create a new parameter which will work as a value you fill in at instance creation, or select from an existing one.  Creating a new one requires you to fill out the name and type.  You can optionally enter a default value if this will only sometimes need to be changed.  When an instance is created only parameters without a default value will be required.  When you are done, click **Set**.

If you wish to manage your existing parameters, this can be done with the **Manage parameters** option along the top.  The pane that comes allows you to add new parameters, and either edit or delete existing ones.

### System variable

When creating a series of pipeline instances, there are likely cases where you want to use variables to help name files or outputs.  For example, you may wish to name a video clip with the pipeline instance name and date / time so you know where it came from and at what time.  Azure Video analyzer provides three system variables you can use in your modules to help here.

* System.PipelineName – This will return the name of the current pipeline.
* System PipelineInstanceName – This will return the name of the current pipeline instance.  It will not include the pipeline name.
* System.DateTime – This will return the current date and time.

### Connections 

When you create a pipeline, you will need to connect the various elements together.  This is done with connections.  From the circle on the edge of a module, drag to the circle on the next module you want data to flow to.  This will produce a connection.

By default, connections send all data from one module to another.  If you only want to send certain types of data, you can left click on the connection and edit the output types that are sent.  Selectable types of data include video, audio, and application.
