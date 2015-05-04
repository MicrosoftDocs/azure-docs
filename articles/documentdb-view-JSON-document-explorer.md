<properties 
	pageTitle="View, edit, create, and upload JSON documents using the DocumentDB Document Explorer | Azure" 
	description="Learn about the DocumentDB Document Explorer, an Azure Preview portal tool to view, edit, create, and upload JSON documents with DocumentDB." 
	services="documentdb" 
	authors="stephbaron" 
	manager="johnmac" 
	editor="monicar" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="stbaro"/>

# View, edit, create, and upload JSON documents using the DocumentDB Document Explorer #

This article provides an overview of the [Microsoft Azure DocumentDB](http://azure.microsoft.com/services/documentdb/) Document Explorer, an Azure Preview portal tool that enables you to view, edit, create, and upload JSON documents with DocumentDB. 

By completing this tutorial, you'll be able to answer the following questions:  

-	How can I easily create, view, edit, and delete individual DocumentDB documents via a web browser?
-	How can I easily view the system properties of a DocumentDB document via a web browser?
-	How can I easily perform bulk ingestion of documents into DocumentDB via a web browser?

##<a id="Launch"></a>Launch and navigate Document Explorer##

Document Explorer can be launched from any of the DocumentDB account, database, and collection blades.  

1. Near the bottom of each blade is a **Developer Tools** lens that contains the **Document Explorer** part.

	![Screenshot of the Document Explorer part](./media/documentdb-view-JSON-document-explorer/documentexplorerpart.png) 

2. Simply click the tile to launch Document Explorer.

	<p>The **Database** and **Collection** drop-down list boxes are pre-populated depending on the context in which you launch Document Explorer.  For example, if you launch from a database blade, then the current database is pre-populated.  If you launch from a collection blade, then the current collection is pre-populated.

	![Screenshot of Document Explorer](./media/documentdb-view-JSON-document-explorer/documentexplorerinitial.png)

3. Document Explorer loads up to the first 100 documents in the selected collection.  You can load additional documents (in batches of 100) by selecting the **Load more** option at the bottom of the Document Explorer blade.  

4. The **Database** and **Collection** drop-down list boxes can be used to easily change the collection from which documents are currently being viewed without having to close and re-launch Document Explorer.  

5. Document Explorer also supports filtering the currently loaded set of documents by their id property.  Simply type in the filter box.

	![Screenshot of Document Explorer with filter highlighted](./media/documentdb-view-JSON-document-explorer/documentexplorerfilter.png) 

	And the results in the Document Explorer list are filtered based on your supplied criteria.

	![Screenshot of Document Explorer with filtered results](./media/documentdb-view-JSON-document-explorer/documentexplorerfilterresults.png)


	> [AZURE.IMPORTANT] The Document Explorer filter functionality only filters from the ***currently*** loaded set of documents and does not perform a query against the currently selected collection.

6. To refresh the list of documents loaded by Document Explorer, simply click the **Refresh** command at the top of the blade.

	![Screenshot of Document Explorer refresh command](./media/documentdb-view-JSON-document-explorer/documentexplorerrefresh.png)


##<a id="Create"></a>View, create, and edit documents with Document Explorer##

Document Explorer allows you to easily create, edit and delete documents.  

- To create a document, simply click the **Create Document** command and a minimal JSON snippet is provided.

	![Screenshot of Document Explorer create document experience](./media/documentdb-view-JSON-document-explorer/createdocument.png) 

- Simply type or paste the JSON content of the document you wish to create and click the **Save** command to commit your document.

	![Screenshot of Document Explorer save command](./media/documentdb-view-JSON-document-explorer/savedocument1.png)

	> [AZURE.NOTE] If you do not provide an "id" property, then Document Explorer automatically adds an id property and generates a GUID as the id value. 

- To edit an existing document, simply select it in Document Explorer, edit the document as you see fit, and click the **Save** command.

	![Screenshot of Document Explorer edit document functionality](./media/documentdb-view-JSON-document-explorer/editdocument.png)

- If you're editing a document and decide that you want to discard the current set of edits, simply click the discard command, confirm the discard action, and the previous state of the document be reloaded.

	![Screenshot of Document Explorer discard command](./media/documentdb-view-JSON-document-explorer/discardedit.png)

- You can delete a document by selecting it, clicking the **Delete** command, and then confirming the delete. After confirming, the document is immediately removed from the Document Explorer list:

	![Screenshot of Document Explorer delete command](./media/documentdb-view-JSON-document-explorer/deletedocument.png)

- Note that Document Explorer validates that any new or edited document contains valid JSON.  You can even hover over the incorrect section to get details about the validation error.

	![Screenshot of Document Explorer invalid JSON highlighting](./media/documentdb-view-JSON-document-explorer/invalidjson1.png)

- Additionally, Document Explorer prevents you from saving a document with invalid JSON content.

	![Screenshot of Document Explorer invalid JSON save error](./media/documentdb-view-JSON-document-explorer/invalidjson2.png)

- Finally, Document Explorer allows you to easily view the system properties of the currently loaded document by clicking the **Properties** command.

	![Screenshot of Document Explorer document properties view](./media/documentdb-view-JSON-document-explorer/documentproperties.png)

	> [AZURE.NOTE] The timestamp (_ts) property is internally represented as epoch time, but Document Explorer displays the value in a human readable GMT format.

##<a id="BulkAdd"></a>Bulk add documents with Document Explorer##

Document Explorer supports bulk ingestion of one or more existing JSON documents.  

1. To start the upload process, click the **Add Document** command.
	
	![Screenshot of Document Explorer bulk ingestion functionality](./media/documentdb-view-JSON-document-explorer/adddocument1.png)

2. A new blade opens.  Click the browse button to open a file explorer window and select one or more JSON documents to upload.

	![Screenshot of Document Explorer bulk ingestion process](./media/documentdb-view-JSON-document-explorer/adddocument2.png)

	> [AZURE.NOTE] Document Explorer currently supports up to 100 JSON documents per individual upload operation.

3. Once you're satisfied with your selection, click the **Upload** button.  The documents are automatically added to the Document Explorer grid and the upload results are displayed as the operation progresses. Import failures are reported for individual files.

	![Screenshot of Document Explorer bulk ingestion results](./media/documentdb-view-JSON-document-explorer/adddocument3.png)

4. Once the operation has completed, you can select up to another 100 documents to upload.

##<a name="NextSteps"></a>Next steps

To learn more about DocumentDB, click [here](http://azure.com/docdb).
