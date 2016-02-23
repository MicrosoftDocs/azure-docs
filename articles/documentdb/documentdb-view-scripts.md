<properties
	pageTitle="DocumentDB JavaScript editor: Script Explorer | Microsoft Azure"
	description="Learn about the DocumentDB Script Explorer, an Azure Portal tool to manage DocumentDB server-side programming artifacts including stored procedures, triggers, and user-defined functions."
	services="documentdb"
	authors="AndrewHoh"
	manager="jhubbard"
	editor="monicar"
	documentationCenter=""/>

<tags
	ms.service="documentdb"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/22/2016"
	ms.author="anhoh"/>

# Create and run stored procedures, triggers, and user-defined functions using the DocumentDB Script Explorer

This article provides an overview of the [Microsoft Azure DocumentDB](https://azure.microsoft.com/services/documentdb/) Script Explorer, an Azure Portal tool that enables you to view DocumentDB server-side programming artifacts including stored procedures, triggers, and user-defined functions.  Read more about DocumentDB server-side programming [here](documentdb-programming.md).

By completing this tutorial, you'll be able to answer the following questions:  

-	How can I easily view, edit, and create DocumentDB stored procedures via a web browser?
-	How can I easily view and edit DocumentDB triggers via a web browser?
-	How can I easily view and edit DocumentDB user-defined functions via a web browser?

## Launch Script Explorer

Script Explorer can be launched from any of the DocumentDB account, database, and collection blades.  

1. At the top of the DocumentDB account, database, or collection blade, simply click the **Script Explorer** command.

	![Screenshot of the Script Explorer command](./media/documentdb-view-scripts/scriptexplorercommand.png)

2. <p>The **Database** and **Collection** drop-down list boxes are pre-populated depending on the context in which you launch Script Explorer.  For example, if you launch from a database blade, then the current database is pre-populated.  If you launch from a collection blade, then the current collection is pre-populated.

	![Screenshot of Script Explorer](./media/documentdb-view-scripts/scriptexplorerinitial.png)

3. The **Database** and **Collection** drop-down list boxes can be used to easily change the collection from which scripts are currently being viewed without having to close and re-launch Script Explorer.  

4. Script Explorer also supports filtering the currently loaded set of scripts by their id property.  Simply type in the filter box and the results in the Script Explorer list are filtered based on your supplied criteria.

	![Screenshot of Script Explorer with filtered results](./media/documentdb-view-scripts/scriptexplorerfilterresults.png)


	> [AZURE.IMPORTANT] The Script Explorer filter functionality only filters from the ***currently*** loaded set of scripts and does not automatically refresh the currently selected collection.

5. To refresh the list of scripts loaded by Script Explorer, simply click the **Refresh** command at the top of the blade.

	![Screenshot of Script Explorer refresh command](./media/documentdb-view-scripts/scriptexplorerrefresh.png)


## Create, view, and edit stored procedures, triggers, and user-defined functions with Script Explorer

Script Explorer allows you to easily perform CRUD operations on DocumentDB server-side programming artifacts.  

- To create a script, simply click on the applicable create command within script explorer, provide an id, enter the contents of the script, and click  the **Save** command.

	![Screenshot of Script Explorer create option](./media/documentdb-view-scripts/scriptexplorercreatecommand.png)

- When creating a trigger, you must also specify the trigger type and trigger operation

	![Screenshot of Script Explorer create trigger option](./media/documentdb-view-scripts/scriptexplorercreatetrigger.png)

- To view a script, simply click the script in which you're interested.

	![Screenshot of Script Explorer view script experience](./media/documentdb-view-scripts/scriptexplorerviewscript.png)

- To edit a script, simply make the desired changes and click the **Save** command.

	![Screenshot of Script Explorer view script experience](./media/documentdb-view-scripts/scriptexplorereditscript.png)

- To discard any pending changes to a script, simply click the **Discard** command.

	![Screenshot of Script Explorer discard changes experience](./media/documentdb-view-scripts/scriptexplorerdiscardchanges.png)

- Script Explorer also allows you to easily view the system properties of the currently loaded script by clicking the **Properties** command.

	![Screenshot of Script Explorer script properties view](./media/documentdb-view-scripts/scriptproperties.png)

	> [AZURE.NOTE] The timestamp (_ts) property is internally represented as epoch time, but Script Explorer displays the value in a human readable GMT format.

- To delete a script, select it in Script Explorer and click the **Delete** command.

	![Screenshot of Script Explorer delete command](./media/documentdb-view-scripts/scriptexplorerdeletescript1.png)

- Confirm the delete action by clicking **Yes** or cancel the delete action by clicking **No**.

	![Screenshot of Script Explorer delete command](./media/documentdb-view-scripts/scriptexplorerdeletescript2.png)

## Execute stored procedures with Script Explorer

Script Explorer allows you to execute server-side stored procedures.

- When initially opening create stored procedure, a default script *prefix* is provided. Add an id and your input parameter. For multiple parameters, the inputs must be within an array (e.g. *["foo", "bar"]*).

	![Screenshot of Script Explorer script properties view](./media/documentdb-view-scripts/scriptexploreraddinputs.png)

- To execute a script, simply click on the **Save & Execute** command within script editor pane.

	> [AZURE.NOTE] The **Save & Execute** command will save your stored procedure before executing, which will overwrite the previous version of the stored procedure.

	![Screenshot of Script Explorer script properties view](./media/documentdb-view-scripts/scriptexplorerexecsproc.png)

- Successful stored procedure executions will have a *Successfuly saved and executed the stored procedure* status and the returned results will be populated in the *Results* pane.

- If the execution encounters an error, the error will be populated in the *Results* pane.

	![Screenshot of Script Explorer script properties view](./media/documentdb-view-scripts/scriptexplorerexecutesprocerror.png)



## Next steps

To learn more about DocumentDB, click [here](http://azure.com/docdb).

For samples on server side scripts, visit our [GitHub repo](https://github.com/Azure/azure-documentdb-dotnet/tree/master/samples/code-samples/ServerSideScripts).
