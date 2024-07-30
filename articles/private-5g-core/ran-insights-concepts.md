---
title: RAN Insights Concepts 
description: Learn about the key components of a RAN Insights deployed through Azure Private 5G Core. 
author: delnas
ms.author: delnas
ms.service: private-5g-core
ms.topic: concept-article 
ms.date: 5/28/2024
---

# RAN Insights concepts
Radio access network (RAN) insights is a feature of Azure Private 5G Core that allows you to view your RAN metric data in Azure portal to make actionable insights. RAN Insights collects and displays a subset of metrics from the RAN vendor’s Element Management System (EMS) and displays them as standard metrics in Azure. The selected metrics are based on customer feedback and represent the most important KPIs used for health and troubleshooting. RAN insights provides you with a unified and simplified experience to monitor and troubleshoot your RAN across multiple vendors. 


## Why use RAN insights?
RAN insights offers several benefits for managing your network, such as:

- Simple to manage – You can now utilize the Azure experience to easily view RAN metrics from multiple vendors, eliminating the need to switch between and learn various tools or dashboards. RAN insights provides a consistent and user-friendly experience that makes it easy to derive insights from metrics across your network.
- Consistent – You can customize how you group and display your RAN metrics according to your needs. For example, you can have one RAN insights resource representing multiple access points across multiple RAN vendors or have one RAN insights resource to represent access points for each RAN vendor.
- Actionable – You can use the metrics to troubleshoot problems on your network and take corrective actions. For example, if you see a large discrepancy in the handover correlated metric between core and RAN, a coverage gap might exist and you might need to optimize your radio frequency (RF) accordingly.
- Secure and compliant – RAN insights use Azure Key Vault to securely transfer and store RAN metrics data, ensuring that your data is protected and encrypted. RAN insights also complies with the General Data Protection Regulation (GDPR) and is built from 3GPP metrics from our RAN partners.

## How does RAN insights work?
RAN insights works by extending the RAN Element Management System (EMS) offered by the RAN vendor to include a Microsoft-compliant External Metrics Agent (EMA) that streams relevant RAN metrics to Azure. The RAN vendor and Microsoft agree on a common schema  based on 3GPP standards. The EMA collects the RAN metrics from the EMS and sends them to Azure via Metrics Ingestion Endpoint (MIE). This process is completed by the partner.


## Terminology
| Term | Definition |
|---------|----------------|
| RAN | Radio Access Network  |
| Access Point | A gNB (CU) or eNB instance that might contain multiple cells |
| RAN Insights Resource | A group of access points specific to a site under the same Azure object |
| Core | Packet Core |
| EMS | External Metrics Source (third party metrics source) |
| EMA | External Metrics Agent (Open Telemetry Collector) |
| MIE | Metrics Ingestion Endpoint (connects the EMA and Azure to enable metric stream) |
| Correlation | Display of relevant Core and RAN metrics on a unified graph |
| KPI | Key Performance Indicator (metrics determined to indicate performance) |


## Next step
- [Learn more about the prerequisites and how to deploy a RAN insight resource](ran-insights-create-resource.md)

