---
title: Jupyter in Azure Sentinel security investigations | Microsoft Docs
description: Learn about why and when to use Jupyter notebooks, Python, and the MSTICPy library in Azure Sentinel investigations.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.topic: conceptual
ms.date: 07/21/2021
---

# Jupyter in Azure Sentinel security investigations

Jupyter is an interactive development and data manipulation environment hosted in a browser. Jupyter executes code that you type into a cell, and returns the output. The following example shows a Jupyter code cell and output for a simple `for` loop:

:::image type="content" source="media/jupyter/jupyter-example.png" alt-text="Screenshot showing a Jupyter code cell executing a simple for loop.":::

Jupyter Notebook is an open-source web application that lets you create and share notebooks. Notebooks can contain live code, equations, visualizations, and narrative text. The Jupyter experience and many Jupyter notebooks are now integrated into the Azure Sentinel portal. This integration makes it easy to create and run notebooks for security investigations.

For more information about Jupyter, and sample notebooks, see [jupyter.org](https://jupyter.org) and the [Jupyter introductory documentation](https://jupyter.readthedocs.io/en/latest/tryjupyter.html).

For more information about creating and running Jupyter notebooks in Azure Sentinel, see [Use Jupyter Notebook to hunt for security threats](notebooks.md).

## Jupyter in Azure Sentinel

Built-in Azure Sentinel query and investigation tools are usually sufficient to investigate incoming data. Graphical investigation tools, Log Analytics queries, and case features like Bookmarks can handle most scenarios and data investigations.

Jupyter is useful when an Azure Sentinel investigation becomes very complex. An investigation might be too complex for built-in Azure Sentinel tools when:

- The number of queries in the investigation chain is more than about seven. Seven is the number of items most people can keep in short-term memory.
- The investigation graph becomes so large that it's difficult to see details.
- You need to save queries and results, even if your browser crashes.

The following sections outline some of the benefits of working in Jupyter:

### Data persistence, repeatability, and backtracking

One of the difficulties of complex security investigations is keeping track of what you've done. You might end up with many queries and results sets, some of which turned out to be dead ends. You have to decide which queries and results to keep, and how to accumulate the useful results in a single report. You might want to backtrack and rerun the queries with different values or date ranges, or rerun the same pattern on a future investigation.

With most data-querying environments, these tasks require manual work and reliance on short-term memory. Jupyter gives you a linear progression through the investigation, and saves queries and data as you go. You can use variables like time ranges, account names, and IP addresses in the query progression. Variables make it much easier to backtrack, rerun queries, and reuse the entire workflow in future investigations.

### Scripting and programming

Jupyter doesn't limit you to querying and viewing results, but gives you the full power of a programming language. A *declarative* language like Kusto Query Language (KQL) or SQL encodes your logic in a single, possibly complex, statement. *Procedural* programming languages execute logic in a series of steps. You can do a lot in a flexible declarative language, but splitting your logic into procedural steps can be helpful and sometimes essential. Procedural code lets you:

- See and debug intermediate results.
- Add functionality like decoding fields and parsing data that might not be available in the query language.
- Reuse partial results in later processing steps.

### Joining to external data

Azure Sentinel workspace tables have most telemetry and event data, but exceptions include:

- Data in an external service that you don't own. Examples include IP Whois data, geolocation data, and threat intelligence sources.
- Sensitive data that's stored only within your organization. This data can include human resources databases, or lists of executives, administrators, and high-value assets.
- Data that you haven't yet migrated to the cloud.

Python and Jupyter can link any data to Azure Sentinel that's accessible over your network or from a file.

### Specialized data processing, machine learning, and visualization tools

Azure Sentinel and its underlying Kusto Log Analytics data store have many options for visualization and advanced data processing. Capabilities include clustering, windowed statistics, and machine learning functions. However, you might need specialized visualizations, machine learning libraries, or data processing and transformation capabilities that aren't available in Azure Sentinel.

Some well-known specialized Python capabilities are:

- *pandas* for data processing, cleanup, and engineering
- *matplotlib*, *holoviews*, and *plotly* for visualization
- *numpy* and *scipy* for advanced numerical and scientific processing
- *scikit-learn* for machine learning
- *tensorflow*, *pytorch*, and *keras* for deep learning

## Python with Jupyter

You can use Jupyter with many different languages. Python language is a good choice for the following reasons:

### Popularity

You probably already have Python coders in your organization. Python is now the most widely taught language in Computer Science courses. Python is used widely in:

- IT, where it has largely replaced perl as the go-to language for scripting and systems management.
- Web development. Many popular services such as DropBox and Instagram are written almost entirely in Python.
- Many scientific fields.

### Ecosystem

There is a vast repository of Python libraries available on [PyPi](https://pypi.org), and nearly 1 million Python repos on [GitHub](https://github.com/search?q=python). No other language ecosystem has comparable tools for data manipulation, data analysis, visualization, machine learning, and statistical analysis. Almost every major Python package and the core language itself are open source, and are written and maintained by volunteers.

### Alternatives to Python

You can use other language kernels with Juypter. You can mix languages within the same notebook to a degree by using *magics*, which allow execution of individual cells using another language. For example, it's possible to retrieve data using a PowerShell script cell, process the data in Python, and use JavaScript to render a visualization.

## MSTIC Jupyter and Python security tools

MSTIC is the Microsoft Threat Intelligence Center. MSTIC security analysts and engineers author security detections for several Microsoft platforms, and work on threat identification and investigation. MSTIC built *MSTICPy*, a library for information security investigations and hunting in Jupyter Notebook. MSTICPy can:

- Query log data from multiple sources.
- Enrich the data with threat intelligence, geolocations, and Azure resource data.
- Extract Indicators of Activity (IoA) from logs, and unpack encoded data.
- Do sophisticated analyses such as anomalous session detection and time series decomposition.
- Visualize data using interactive timelines, process trees, and multi-dimensional Morph Charts.

MCTICPy also includes some time-saving notebook tools, such as widgets that set query time boundaries, select and display items from lists, and configure the notebook environment.

:::image type="content" source="media/jupyter/msticpy.png" alt-text="Screenshot showing a MSTICPy timeline with reference marker.":::

Most of the MSTICPy package started out as inline code in a notebook. However, having a lot of code in notebooks makes it difficult to see results and text. Large blocks of code make a notebook especially intimidating for non-programmers, and make code reuse difficult. The philosophy behind MSTICPy was to create a repository for reusable functionality that makes notebooks faster to author and easier to read.

MSTIC originally built the MSTICPy package for authoring notebooks in Azure Sentinel, but the data query and acquisition components can also pull log data from other sources like Microsoft Defender and Microsoft Graph. You can use most of the components with data from any source. Almost all components use *pandas* dataframes as the ubiquitous input and output format.

## Related resources

- [Jupyter.org](https://jupyter.org)
- [Python](https://python.org)
- [PyPi](https://pypi.org)
- [GitHub](https://github.com/search?q=python)
- [Kusto Query Language](/azure/kusto/query/)
- [pandas](https://pandas.pydata.org/)
- [matplotlib](https://matplotlib.org)
- [holoviews](https://holoviews.org)
- [plotly](https://plot.ly)
- [numpy](https://www.numpy.org)
- [scipy](https://www.scipy.org)
- [scikit-learn](https://scikit-learn.org/stable/index.html)
- [tensorflow](https://www.tensorflow.org/)
- [pytorch](https://pytorch.org)
- [keras](https://keras.io/)
