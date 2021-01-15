---
author: baanders
description: include file describing the ways to integrate industry-standard models with Azure Digital Twins
ms.service: digital-twins
ms.topic: include
ms.date: 1/15/2021
ms.author: baanders
---

Using models that are based on industry standards or use standard ontology representation, such as RDF or OWL, provides a rich starting point when designing your Azure Digital Twins models. Using industry models also helps with standardization and information sharing.

There are three possible paths to integrating industry-standard models with DTDL. You can pick the one that works best for you depending on your needs: 

| Path | Description | Read more |
| --- | --- | --- |
| **Adopt** | You can start your solution with an open-source DTDL ontology that has been built on widely adopted industry standards. You can either use these model sets out-of-the-box, or extend them with your own additions for a customized solution. | [*Concepts:&nbsp;Industry-standard&nbsp;ontologies*](../articles/digital-twins/concepts-ontologies.md)<br><br>[*Concepts:&nbsp;Extending industry&nbsp;ontologies*](../articles/digital-twins/concepts-extending-ontologies.md) |
| **Convert** | If you already have existing models represented in another standard format, you can convert them to DTDL to use them with Azure Digital Twins. | [*How-to: Integrate industry-standard models*](../articles/digital-twins/how-to-integrate-models.md) |
| **Author** | You can always develop your own custom DTDL models from scratch, using any applicable industry standards as inspiration. | [*How-to: Manage DTDL models*](../articles/digital-twins/how-to-manage-model.md) |