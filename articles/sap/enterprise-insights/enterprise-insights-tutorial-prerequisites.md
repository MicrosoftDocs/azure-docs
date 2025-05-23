---
title: Prerequisites
description: "Prerequisites and implementation requirements of Enterprise Insights for SAP data integration and analytics."
author: ritikesh-vali
ms.author: ritikeshvali
ms.service: sap-on-azure
ms.topic: tutorial
ms.date: 05/21/2025
---

# Prerequisites

In this article, learn about the prerequisites and implementation requirements for Enterprise Insights solutions for SAP data and analytics. 

## Supported Systems

Enterprise Insights is compatible with SAP S/4HANA 1909 and newer releases. The minimum recommended version is S/4HANA 1909 FPS02, while the pre-delivered business content is based on SAP S/4HANA 2022.

> [!NOTE]
> For all analytics content, some of the resources available in Enterprise Insights may require customization and tailoring to meet your specific SAP system version and release. This is especially important for functional insights, where some objects may be present in a different version and may require further changes to ensure you can extract and process them successfully.

## Implementation Requirements

Prior to deploying Enterprise Insights, it is advisable to implement the following SAP Notes (along with any dependencies) to help prevent common issues during data extraction:

- **2930269** – ABAP CDS CDC: Common issues, troubleshooting, and components (be sure to review all notes listed in point 9 of this SAP Note)
- **3077184** – Adoption of new CDS-Views for SAP S/4HANA SD and Billing Document Data
- **3031375** – Customer-specific configuration for bucket size in CDC extraction

### Power BI Templates – SAP Hierarchies

To properly extract SAP hierarchies for use in Power BI templates, ensure the following CDS Views are available as attributes: `I_PROFITCENTERHIERARCHYNODE`, `I_COSTCENTERHIERARCHYNODE`, and `I_GLACCOUNTHIERARCHYNODE`.

SAP recommends performing these transactions in sequence:

1. **HRY_REPRELEV** – Identify and mark the required hierarchies (such as 0101 for Cost Center and 0106 for Profit Center) for replication from SET* tables into the HRRY_NODE table for the relevant organizational units.
2. **HRRP_REP** – Execute the replication or import of hierarchies already created in SAP for Financial Statements (FSVNs), Profit Centers (0106), and Cost Centers (0101) for the relevant organizational units.

Executing these transactions in order and marking the appropriate hierarchy entries for replication is essential for extracting data using the CDS Views (`I_PROFITCENTERHIERARCHY*`, `I_COSTCENTERHIERARCHY*`).

#### Further Reading

- [Replicate Runtime Hierarchy | SAP Help Portal](https://community.sap.com/)
- [Setting Report Relevancy for New Cost Center and Profit Center Hierarchies – SAP Help Portal](https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/5e23dc8fe9be4fd496f8ab556667ea05/0097f2ca29d549ec8641f5ccd3c8aebe.html)
- [How to synchronize Set Controlling Hierarchies in SAP Community](https://community.sap.com/)
- [Manage your hierarchies in FIORI 1/3 - SAP Community](https://community.sap.com/)