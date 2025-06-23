--- 
title: Exploring and interacting with lake data using Jupyter Notebooks (Preview)
titleSuffix: Microsoft Security 
description: This article describes how to explore and interact with lake data using Spark notebooks in Visual Studio Code.
author: EdB-MSFT 
ms.topic: how-to 
ms.date: 06/04/2025
ms.author: edbayansh 

# Customer intent: As a security engineer or data scientist, I want to explore and analyze security data in the Microsoft Sentinel data lake using Jupyter notebooks, so that I can gain insights and build advanced analytics solutions.
---

# Jupyter notebooks and the Microsoft Sentinel data lake (Preview)
 
## Overview 

Microsoft Sentinel data lake is a next-generation, cloud-native security data lake that extends the capabilities of Microsoft Sentinel by providing a highly scalable, cost-effective platform for long-term storage and data retention, advanced analytics, and AI-driven security operations.

Jupyter notebooks are an integral part of the Microsoft Sentinel data lake ecosystem, offering powerful tools for data analysis and visualization. The notebooks are provided by the Microsoft Sentinel Visual Studio Code extension (preview) that allows you to interact with the data lake using Python. Notebooks enable you to perform complex data transformations, run machine learning models, and create visualizations directly within the notebook environment. 


The Microsoft Sentinel Visual Studio Code extension with Jupyter notebooks provides a powerful environment for exploring and analyzing lake data with the following benefits:

- **Interactive data exploration**: Jupyter notebooks provide an interactive environment for exploring and analyzing data. You can run code snippets, visualize results, and document your findings all in one place.
- **Integration with Python libraries**: The Microsoft Sentinel extension includes a wide range of Python libraries, enabling you to use existing tools and frameworks for data analysis, machine learning, and visualization.
- **Powerful data analysis**: With the integration of Apache Spark compute sessions, you can use the power of distributed computing to analyze large datasets efficiently. This allows you to perform complex transformations and aggregations on your security data. 
-	**Low-and-slow attacks**: Analyze large scale, complex, interconnected data related to security events, alerts, and incidents, enabling detection of sophisticated threats and patterns, such as lateral movement or low-and-slow attacks that can evade traditional rule-based systems. 
-	**AI and ML integration**: Integrate with AI and machine learning to enhance anomaly detection, threat prediction, and behavioral analysis, empowering security teams to build agents to automate their investigations. 
-	**Scalability**: Notebooks provide the scalability to process vast amounts of data cost efficiently and enable deep batch processing for uncovering trends, patterns, and anomalies. 
- **Visualization capabilities**: Jupyter notebooks support various visualization libraries, enabling you to create charts, graphs, and other visual representations of your data, helping you gain insights and communicate findings effectively.
- **Collaboration and sharing**: Jupyter notebooks can be easily shared with colleagues, allowing for collaboration on data analysis projects. You can export notebooks in various formats, including HTML and PDF, for easy sharing and presentation.
- **Documentation and reproducibility**: Jupyter notebooks allow you to document your code, analysis, and findings in a single file, making it easier to reproduce results and share your work with others. 

## Lake exploration scenarios for notebooks

The following scenarios illustrate how Jupyter notebooks in the Microsoft Sentinel Lake can be used to enhance security operations:

| Scenario | Description |
|----------|-------------|
| User behavior from failed sign ins | Establish a baseline of normal user behavior by analyzing patterns of failed sign in attempts. Investigate operations attempted before and after the failed logins to detect potential compromise or brute-force activity. |
| Sensitive data paths | Identify users and devices that have access to sensitive data assets. Combine access logs with organizational context to assess risk exposure, map access paths, and prioritize areas for security review. |
| Anomaly threat analysis | Analyze threats by identifying deviations from established baselines, such as logins from unusual locations, devices, or times. Overlay user behavior with asset data to identify high-risk activity, including potential insider threats. |
| Risk-scoring prioritization | Apply custom risk scoring models to security events in the data lake. Enrich events with contextual signals such as asset criticality and user role to quantify risk, assess blast radius, and prioritize incidents for investigation. |
| Exploratory analysis and visualization | Perform exploratory data analysis across multiple log sources to reconstruct attack timelines, determine root causes, and build custom visualizations that help communicate findings to stakeholders. |

## Writing to the lake and analytics tier

You can write data to the lake tier and analytics tier using notebooks. The Microsoft Sentinel extension for Visual Studio Code provides a Python library that abstracts the complexity of writing to the lake and analytics tiers. You can use the `MicrosoftSentinelProvider` class's `save_as_table()` function to write data to custom tables or append data to existing tables in the lake tier or analytics tier. For more information, see [Microsoft Sentinel Provider class reference](./sentinel-provider-class-reference.md).
 
## Jobs and Scheduling

You can schedule jobs to run at specific times or intervals using the Microsoft Sentinel extension for Visual Studio Code. Jobs allow you to automate data processing tasks to summarize, transform, or analyze data in the Microsoft Sentinel data lake. Use jobs to process data and write results to custom tables in the lake tier or analytics tier. For more information, see [Create and manage Jupyter notebook jobs (Preview)](./jupyter-notebook-jobs.md).


## Related content

- [Microsoft Sentinel data lake overview (Preview)](./sentinel-lake-overview.md)
- [Explore the Microsoft Sentinel data lake using Jupyter notebooks (Preview)](./jupyter-notebooks.md)
- [Sample notebooks for Microsoft Sentinel data lake (Preview)](./notebook-examples.md)
- [Microsoft Sentinel Provider class reference (Preview)](./sentinel-provider-class-reference.md)
