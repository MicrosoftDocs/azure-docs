---
title: Custom graphs in Microsoft Sentinel-Overview (preview)
description: An overview of custom graphs in Microsoft Sentinel 
author: EdB-MSFT
ms.author: edbaynash
ms.date: 03/23/2026
ms.topic: how-to
ms.service: microsoft-sentinel
ms.subservice: sentinel-platform

#customer intent: As a security researcher, I want to create custom graphs in my tenant so that I can continuously monitor and detect systemic threats.

---

# Custom Graph overview (preview)

Custom graphs let you build tailored security graphs tuned to your unique security scenarios using data from Sentinel data lake as well as non-Microsoft sources. With custom graph, powered by Fabric, you can build, query, and visualize connected data, uncover hidden patterns and attack paths, and help surface risks that are hard to detect when data is analyzed in isolation. These graphs provide the knowledge context that enables AI-powered agent experiences to work more effectively, speeding investigations, revealing blast radius, and helping you move from noisy, disconnected alerts to confident decisions at scale. 


## Common scenarios

These scenarios represent a sample of what’s possible with custom graphs. You can model any entities, relationships, and data from the Sentinel data lake, enabling graphs tailored to your specific security workflows and investigative needs.

| Scenario |Key questions that graph can help answer |
|----------|---------------|
| **Phishing email kill chain with enriched business context** | • Who received the phishing email, who clicked on the links, and which clicks were actually allowed by the proxy?<br>• Which emails point to the same URL, revealing waves using shared infrastructure ? Follow attachment → download → process execution → device to show the chain from inbox to compromise. |
| **DNS C2 beacon hunter** | • Show device to domain activity that exhibits beaconing behavior (low interval variance and high time coverage), separating automated traffic from human browsing.<br>• Follow the full evidence chain from device → DNS query → resolved IP → threat indicator. |
| **Behavioral attack chain detection** | • Show all IPs/users that touch behaviors mapped to 3 or more different MITRE techniques.<br>• Follow the full path from a threat indicator through the matched IP through all associated behaviors to every affected user. |
| **OAuth privilege escalation** | • Show service principals that granted permissions to themselves, then chained those permissions to reach a Tier Zero directory role. Self escalation cycle signature. |


## Building custom graphs in Microsoft Sentinel

Use the Jupyter notebooks in Microsoft Visual Studio Code to interactively create and analyze custom graphs with your data in the Microsoft Sentinel data lake. The notebooks are provided by the Microsoft Sentinel Visual Studio Code extension that allows you to interact with the Microsoft Sentinel data lake using Python for Spark (PySpark). For more information on the Microsoft Sentinel Visual Studio Code extension, see [Install Visual Studio Code and the Microsoft Sentinel extension](./notebooks.md#install-visual-studio-code-and-the-microsoft-sentinel-extension).

You can author custom graphs using either AI‑assisted graph authoring or by writing your own code using the Microsoft Sentinel graph provider reference to define your graph model (nodes and edges), transform your data from the Sentinel data lake, and use Graph Query Language (GQL) to query and analyze your graphs. For more information, see [AI-assisted custom graph authoring in Microsoft Sentinel](./create-graphs-with-ai.md),  [Microsoft Sentinel graph provider reference](./sentinel-graph-provider-reference.md) and [Graph Query Language (GQL) reference for Sentinel custom graph](./gql-reference-for-sentinel-custom-graph.md).

Once you author the graph code in notebook, your can run the notebook in an interactive session or schedule a graph job. Graphs created during the interactive notebook session are ephemeral and are available only in the context of the notebook session. To materialize your graph and share with your team, schedule a graph job to rebuild your graph frequently. Once the graph is materialized, it is accessible from: the graph experience in Microsoft Defender portal under Sentinel, Visual Studio Code Notebooks, and Graph query APIs. 

The following table summarizes the steps to build custom graphs in Microsoft Sentinel:

| Step | Description |
|------|-------------|
| **1. Create and investigate a graph in interactive notebook session** | • Jupyter notebooks in Sentinel provide an interactive environment for exploring and analyzing data in Sentinel Lake.<br>- The Microsoft Sentinel extension includes a graph builder Python library.<br>• Use the Jupyter notebook in Sentinel to define nodes and edges with Lake data, and create graphs.<br>• The graph builder library allows you to query a graph using Graph Query Language (GQL) in the Jupyter graph notebook. |
| **2. Schedule a graph job to materialize your graph** |• Materialize your graph in your tenant for continued access and collaboration.<br>• Use Sentinel jobs to tailor how often you want to refresh a materialized graph with Lake data.<br>• Query and visualize materialized graphs in graph experience in Microsoft Sentinel.|
| **3. Run advanced graph algorithms** |• Use Jupyter notebooks for accessing built-in support for GraphFrames analytics and graph traversal functions.<br>• Use purpose-built Sentinel graph algorithms for common security use cases.|

For detailed instructions on how to build custom graphs in Microsoft Sentinel, see [Custom graphs in Microsoft Sentinel](./create-custom-graphs.md).

## Visualizing graphs in Microsoft Sentinel

Microsoft Sentinel provides multiple options for visualizing graphs, including the graphs experience Microsoft Sentinel, Jupyter notebooks in the Sentinel Visual Studio Code extension. The graph experience lets you run Graph Query Language (GQL) queries, view the graph schema, visualize the graph, view graph results in tabular format, and interactively traverse the graph to the next hop with a simple click. 

:::image type="content" source="./media/custom-graphs-overview/graph-exploration-phishing-query.png"    alt-text="Screenshot of the Sentinel graph in Microsoft Sentinel showing a graph visualization." lightbox="./media/custom-graphs-overview/graph-exploration-phishing-query.png":::

For more information on visualizing graphs in Microsoft Sentinel using Sentinel graph, see [Visualize graphs in Microsoft Sentinel graph (preview)](./graph-visualization.md).



## Related content

- [Custom graphs in Microsoft Sentinel](./create-custom-graphs.md)
- [Microsoft Sentinel graph provider reference](./sentinel-graph-provider-reference.md)
- [Graph Query Language (GQL) reference for Sentinel custom graph](./gql-reference-for-sentinel-custom-graph.md)
- [Visualize graphs in Microsoft Sentinel graph (preview)](./graph-visualization.md)