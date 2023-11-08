---
title: Jupyter Notebooks in Azure Cosmos DB (preview)
description: Create and use built-in Jupyter Notebooks in Azure Cosmos DB to interactively run queries.
ms.service: cosmos-db
ms.topic: overview 
ms.date: 09/29/2022
author: seesharprun
ms.author: sidandrews
ms.reviewer: dech
ms.custom: ignite-2022
---

# Jupyter Notebooks in Azure Cosmos DB (preview)

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

> [!WARNING]
> The Jupyter Notebooks feature of Azure Cosmos DB will be retired March 30, 2024; you will not be able to use built-in Jupyter notebooks from the Azure Cosmos DB account. We recommend using [Visual Studio Code's support for Jupyter notebooks](nosql/tutorial-create-notebook-vscode.md) or your preferred notebooks client.

Jupyter Notebooks is an open-source interactive developer environment (IDE) that's designed to create, execute, and share documents that contain live code, equations, visualizations, and narrative text.

Azure Cosmos DB built-in Jupyter Notebooks are directly integrated into the Azure portal and your Azure Cosmos DB accounts, making them convenient and easy to use. Developers, data scientists, engineers, and analysts can use the familiar Jupyter Notebooks experience to perform common tasks. These common tasks include:

- data exploration
- data cleaning
- data transformations
- numerical simulations
- statistical modeling
- data visualization
- machine learning

:::image type="content" source="./media/notebooks/cosmos-notebooks-overview.png" alt-text="Screenshot of various Jupyter Notebooks visualizations in Azure Cosmos DB.":::

Azure Cosmos DB supports both C# and Python notebooks for the APIs for NoSQL, Apache Cassandra, Apache Gremlin, Table, and MongoDB. Inside the notebook, you can take advantage of built-in commands and features that make it easy to create Azure Cosmos DB resources. You can also use the built-in commands to upload, query, and visualize your data in Azure Cosmos DB.

:::image type="content" source="./media/notebooks/jupyter-notebooks-portal.png" alt-text="Screenshot of Jupyter Notebooks integrated developer environment (IDE) in Azure Cosmos DB.":::

## Benefits of Jupyter Notebooks

Jupyter Notebooks were originally developed for data science applications written in Python and R. However, they can be used in various ways for different kinds of projects, including:

### Data visualization

Jupyter Notebooks allow you to visualize data in the form of a shared notebook that renders a data set as a graphic. You can create visualizations, make interactive changes to the shared code and data set, and share the results.

### Code sharing

Services like GitHub provides ways to share code, but they're largely non-interactive. With a Jupyter Notebook, you can view code, execute it, and display the results directly in the Azure portal.

### Live interactions with code

Code in a Jupyter Notebook is dynamic; you can edit it and run the updates incrementally in real time. You can also embed user controls (for example, sliders or text input fields) that are used as input sources for code, demos, or Proof of Concepts (POCs).

### Documentation of code samples and outcomes of data exploration

If you have a piece of code and you want to explain line-by-line how it works, you can embed it in a Jupyter Notebook. You can add interactivity along with the documentation at the same time.

### Built-in commands for Azure Cosmos DB

Azure Cosmos DB's built-in magic commands make it easy to interact with your account. You can use commands like %%upload and %%sql to upload data into a container and query it using [SQL API syntax](sql-query-getting-started.md). You don't need to write extra custom code.

### All in one place environment

Jupyter Notebooks combines multiple assets into a single document including:

- code
- rich text
- images
- videos
- animations
- mathematical equations
- plots
- maps
- interactive figures
- widgets
- graphical user interfaces

## Components of a Jupyter Notebook

Jupyter Notebooks can include several types of components, each organized into discrete blocks or cells:

### Text and HTML

Plain text, or text annotated in the markdown syntax to generate HTML, can be inserted into the document at any point. CSS styling can also be included inline or added to the template used to generate the notebook.

### Code and output

Jupyter Notebooks support Python and C# code. The results of the executed code appear immediately after the code blocks, and the code blocks can be executed multiple times in any order you like.

### Visualizations

You can generate graphics and charts from the code by using modules like Matplotlib, Plotly, Bokeh, and others. Similar to the output, these visualizations appear inline next to the code that generates them. Similar to the output, these visualizations appear inline next to the code that generates them.

### Multimedia

Because Jupyter Notebooks are built on web technology, they can display all the types of multimedia supported by a web page. You can include them in a notebook as HTML elements, or you can generate them programmatically by using the `IPython.display` module.

### Data

You can import the data from Azure Cosmos containers or the results of queries into a Jupyter Notebook programmatically. Use built-in magic commands to upload or query data in Azure Cosmos DB.

## Next steps

To get started with built-in Jupyter Notebooks in Azure Cosmos DB, see the following articles:

- [Create your first notebook in an Azure Cosmos DB for NoSQL account](nosql/tutorial-create-notebook.md)
- [Import notebooks from GitHub into an Azure Cosmos DB for NoSQL account](nosql/tutorial-import-notebooks.md)
- [Review the FAQ on Jupyter Notebook support](notebooks-faq.yml)
