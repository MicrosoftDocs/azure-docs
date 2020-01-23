---
title: Introduction to the built-in Jupyter notebooks support in Azure Cosmos DB (Preview)
description: Learn how you can use the built-in Jupyter notebooks support in Azure Cosmos DB to interactively run queries.
ms.service: cosmos-db
ms.topic: overview 
ms.date: 09/22/2019
author: markjbrown
ms.author: mjbrown
---

# Built-in Jupyter notebooks support in Azure Cosmos DB

Jupyter notebook is an open-source web application that allows you to create and share documents containing live code, equations, visualizations, and narrative text. Azure Cosmos DB supports built-in Jupyter notebooks for all APIs such as Cassandra, MongoDB, SQL, Gremlin, and Table. The built-in notebook support for all Azure Cosmos DB APIs and data models allows you to interactively run queries. The Jupyter notebooks run within the Azure Cosmos accounts and they enable developers to perform data exploration, data cleaning, data transformations, numerical simulations, statistical modeling, data visualization, and machine learning.

![Jupyter notebooks visualizations in Azure Cosmos DB](./media/cosmosdb-jupyter-notebooks/cosmos-notebooks-overview.png)

The Jupyter notebooks supports magic functions that extend the capabilities of the kernel by supporting additional commands. Cosmos magic is a command that extends the capabilities of the Python kernel in Jupyter notebook so you can run Azure Cosmos SQL API queries in addition to Apache Spark. You can easily combine Python and SQL API queries to query and visualize data by using rich visualization libraries integrated with render commands.
Azure portal natively integrates Jupyter notebook experience into Azure Cosmos accounts as shown in the following image:

![Jupyter notebooks support in Azure Cosmos DB](./media/cosmosdb-jupyter-notebooks/jupyter-notebooks-portal.png)

## Benefits of Jupyter notebooks

Jupyter notebooks were originally developed for data science applications written in Python, R. However, they can be used in various ways for different kinds of projects such as:

* ***Data visualizations:** Jupyter notebooks allow you to visualize data in the form of a shared notebook that renders some data set as a graphic. Jupyter notebook lets you author visualizations, share them, and allow interactive changes to the shared code and data set.

* **Code sharing:** Services like GitHub provide ways to share code, but they’re largely non-interactive. With a Jupyter notebook, you can view code, execute it, and display the results directly in the Azure portal.

* **Live interactions with code:** Jupyter notebook code is dynamic; it can be edited and re-run incrementally in real time. Notebooks can also embed user controls (e.g., sliders or text input fields) that can be used as input sources for code, demos or Proof of Concepts(POCs).

* **Documentation of code samples and outcomes of data exploration:** If you have a piece of code and you want to explain line-by-line how it works in Azure Cosmos DB, with real-time output all along the way, you could embed it in a Jupyter Notebook. The code will remain fully functional. You can add interactivity along with the documentation at the same time.

* **Cosmos magic commands:** In Jupyter notebooks, you can use custom magic commands for Azure Cosmos DB to make interactive computing easier. For example, the %%sql magic that allows one to query a Cosmos container using SQL API directly in a notebook.

* **All in one place environment:** Jupyter notebooks combine code, rich text, images, videos, animations, mathematical equations, plots, maps, interactive figures, widgets, and graphical user interfaces into a single document.

## Components of a Jupyter notebook

Jupyter notebooks can include several types of components, each organized into discrete blocks:

* **Text and HTML:** Plain text, or text annotated in the markdown syntax to generate HTML, can be inserted into the document at any point. CSS styling can also be included inline or added to the template used to generate the notebook.

* **Code and output:** Jupyter notebooks support Python code. The results of the executed code appear immediately after the code blocks, and the code blocks can be executed multiple times in any order you like.

* **Visualizations:** Graphics and charts can be generated from the code, using modules like Matplotlib, Plotly, or Bokeh. Similar to the output, these visualizations appear inline next to the code that generates them.

* **Multimedia:** Because Jupyter notebook is built on the web technology, it can display all the types of multimedia supported in a web page. You can include them in a notebook as HTML elements, or you can generate them programmatically by using the `IPython.display` module.

* **Data:** Data from Azure Cosmos containers and results of the queries can be imported into a Jupyter notebook programmatically. For example, by including code in the notebook to query the data using any of the Cosmos DB APIs or natively built-in Apache Spark.

## Next steps

To get started with built-in Jupyter notebooks in Azure Cosmos DB see the following articles:

* [Enable notebooks in an Azure Cosmos account](enable-notebooks.md)
* [Use notebook features and commands](use-notebook-features-and-commands.md)



