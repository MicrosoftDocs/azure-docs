---
title: Domain data management services concepts
description: Learn how to use Domain Data Management Services
author: marielgherz
ms.author: marielherzog
ms.service: energy-data-services
ms.topic: conceptual
ms.date: 08/18/2022
ms.custom: template-concept
---

# Domain data management service concepts

**Domain Data Management Service (DDMS)** – is a platform component that extends [OSDU&trade;](https://osduforum.org) core data platform with domain specific model and optimizations. DDMS is a mechanism of a platform extension that:

* delivers optimized handling of data for each (non-overlapping) "domain."
* pertains to a single vertical discipline or business area,  for example, Petrophysics, Geophysics, Seismic
* serves a functional aspect of one or more vertical disciplines or business areas,  for example, Earth Model
* delivers high performance capabilities not supported by OSDU&trade; generic normal APIs.
* helps achieve the extension of OSDU&trade; scope to new business areas.
* may be developed in a distributed manner with separate resources/sponsors.

OSDU&trade; Technical Standard defines the following types of OSDU&trade; application types:

| Application Type            | Description                                                                                                                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OSDU&trade;&trade; Embedded Applications | An application developed and managed within the OSDU&trade; Open-Source community that is built on and deployed as part of the OSDU&trade; Data Platform distribution.                                  |
| ISV Extension Applications  | An application, developed and managed in the marketplace that is NOT part of THE OSDU&trade; Data Platform distributions, and when selected is deployed within the OSDU&trade; Data Platform as add-ons |
| ISV third Party Applications  | An application, developed and managed in the marketplace that integrates with the OSDU&trade; Data Platform, and runs outside the OSDU&trade; Data Platform                                             |


| Characteristics                           | Embedded                           | Extension                   | Third Party |
| ----------------------------------------- | ---------------------------------- | --------------------------- | --------- |
| Developed, managed, and deployed by       | The OSDU&trade; Data Platform             | ISV                         | ISV       |
| Software License                          | Apache 2                           | ISV                         | ISV       |
| Mandatory as part of an OSDU&trade; distribution | Yes                                | No                          | No        |
| Replaceable                               | Yes, with preservation of behavior | Yes                         | Yes       |
| Architecture Compliance                   | The OSDU&trade; Standard                  | The OSDU&trade; Standard           | ISV       |
| Examples                                  | OS CRS <br /> Wellbore DDMS        | ESRI CRS <br /> Petrel DS   | Petrel    |


## Who did we build this for?

**IT Developers** build systems to connect data to domain applications (internal and external – for example, Petrel) which enables data managers to deliver projects to geoscientists. The DDMS suite on Azure Data Manager for Energy helps automate these workflows and eliminates time spent managing updates.

**Geoscientists** use domain applications for key Exploration and Production workflows such as Seismic interpretation and Well tie analysis. While these users won't directly interact with the DDMS, their expectations for data performance and accessibility will drive requirements for the DDMS in the Foundation Tier. Azure will enable geoscientists to stream cross domain data instantly in OSDU&trade; compatible applications (for example, Petrel) connected to Azure Data Manager for Energy.

**Data managers** spend a significant number of time fulfilling requests for data retrieval and delivery. The Seismic, Wellbore, and Petrel Data Services enable them to discover and manage data in one place while tracking version changes as derivatives are created.

## Platform landscape

Azure Data Manager for Energy is an OSDU&trade; compatible product, meaning that its landscape and release model are dependent on OSDU&trade;.

Currently, OSDU&trade; certification and release process are not fully defined yet and this topic should be defined as a part of the Azure Data Manager for Energy Foundation Architecture.

OSDU&trade; R3 M8 is the base for the scope of the Azure Data Manager for Energy Foundation Private – as a latest stable, tested version of the platform.

## Learn more: OSDU&trade; DDMS community principles

[OSDU&trade; community DDMS Overview](https://community.opengroup.org/osdu/documentation/-/wikis/OSDU&trade;-(C)/Design-and-Implementation/Domain-&-Data-Management-Services#ddms-requirements) provides an extensive overview of DDMS motivation and community requirements from a user, technical, and business perspective. These principles are extended to Azure Data Manager for Energy.

## DDMS requirements

A DDMS meets the following requirements, further classified into capability, architectural, operational and openness/extensibility requirements:

|**#** | **Description** | **Business rationale** | **Principle** |
|---------|---------|---------|---------|
| 1 | Data can be ingested with low friction | Need to seamlessly integrate with systems of record, to start with the industry standards | Capability |
| 2 | New data is available in workflows with minimal latency | Deliver new data in context of the end-user workflow – seamlessly and fast. | Capability |
| 3 | Domain data and services are highly usable | The business anticipates a large set of use-cases where domain data is used in various workflows. Need to make the consumption simple and efficient | Capability |
| 4 | Scalable performance for E&P workflows | E&P data has specific access requirements, way beyond standard cloud storage. Scalable E&P data requires E&P workflow experience and insights | Capability |
| 5 | Data is available for visual analytics and discovery (Viz/BI) | Deliver minimum set of visualization capabilities on the data | Capability |
| 6 | One source of truth for data | Drive towards reduction of duplication | Capability |
| 7 | Data is secured, and access governed | Securely stored and managed | Architectural |
| 8 | All data is preserved and immutable | Ability to associate data to milestones and have data/workflow traceable across the ecosystem | Architectural |
| 9 | Data is globally identifiable | No risk of overwriting or creating non-unique relationships between data and activities | Architectural |
| 10 | Data lineage is tracked | Required for auditability, re-creation of the workflow, and learning from work previously done | Architectural |
| 11 | Data is discoverable | Possible to find and consume back ingested data | Architectural |
| 12 | Provisioning | Efficient provisioning of the DDMS and auto integration with the Data Ecosystem | Operational |
| 13 | Business Continuity | Deliver on industry expectation for business continuity (RPO, RTO, SLA) | Operational |
| 14 | Cost | Cost efficient delivery of data | Operational |
| 15 | Auditability | Deliver required forensics to support cyber security incident investigations | Operational |
| 16 | Accessibility | Deliver technology | Operational |
| 17 | Domain-Centric Data APIs |  | Openness and Extensibility |
| 18 | Workflow composability and customizations |  | Openness and Extensibility |
| 19 | Data-Centric Extensibility |  | Openness and Extensibility |

OSDU&trade; is a trademark of The Open Group.

## Next steps
Advance to the seismic DDMS sdutil tutorial to learn how to use sdutil to load seismic data into seismic store.
> [!div class="nextstepaction"]
> [Tutorial: Seismic store sdutil](tutorial-seismic-ddms-sdutil.md)
