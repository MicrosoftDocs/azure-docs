---
title: Perform Protected Multiparty Data Collaboration on Azure
description: Learn how Azure Confidential Clean Rooms enables multiparty collaborations while preventing outside access to the data.
author: dejv
ms.service: azure-confidential-computing
ms.topic: concept-article
ms.date: 5/22/2026
ms.author: dejv
# Customer intent: "As a data analyst, I want to use Azure Confidential Clean Rooms to collaborate on sensitive data, so that I can draw insights and build models while ensuring data privacy and compliance with regulations."
---

# Azure Confidential Clean Rooms

Azure Confidential Clean Rooms offers a protected environment, called a *clean room*, that helps organizations overcome the security and privacy challenges of using sensitive data. Organizations can collaborate and analyze data in the clean room and use advanced privacy-enhancing features like protected governance and audit, verifiable trust, and controlled access, using confidential computing based building blocks.

Typical scenarios include big-data analytics on combined datasets, machine learning training and fine-tuning on jointly contributed data, and ML inferencing on sensitive inputs. These unlock value across industries: brands, publishers, and measurement partners collaborating on audience targeting, segmentation, and attribution in **media and advertising**; banks and financial institutions jointly building fraud detection models across institutions in **banking and finance**; cross-departmental and public-private collaboration on shared-interest workloads in **government and public sector**; improving healthcare outcomes with predictive diagnostics, personalized medicine, and clinical decision support in **healthcare**; and retailers and partners analyzing combined customer signals for personalization and inventory planning in **retail**.

## Azure Confidential Clean Rooms for Analytics (Preview)

Azure Confidential Clean Rooms for Analytics is a **fully managed** service that allows customers and their partners to securely analyze privacy sensitive datasets with Apache **Spark based big-data analytics (Spark SQL)** in a **confidential compute based environment** which protects their raw data from other collaborators and from the Azure operator by performing computations in a Trusted Execution Environment (TEE). Privacy sensitive datasets include personally identifiable information (PII), protected health information (PHI) and cryptographic secrets.

The following diagram shows how organizations collaborate by using Azure Confidential Clean Rooms for Analytics.

:::image type="content" source="./media/confidential-clean-rooms/azure-confidential-clean-rooms-analytics-flow.png" alt-text="Diagram showing the end-to-end analytics flow on Azure Confidential Clean Rooms: clean room setup and member addition, enabling Analytics as the workload type, publishing data store metadata, schema and encryption details, uploading keys with secure key release policy, publishing and agreeing on queries, executing queries using distributed confidential Spark SQL, and obtaining tamper-resistant audit trails. The clean room is secured by Confidential Container Instances as virtual nodes in AKS, with Contoso and Fabrikam each contributing keys, policies, and encrypted customer data from their own tenants and receiving encrypted outputs.":::

> [!NOTE]
> Azure Confidential Clean Rooms for Analytics is currently in limited preview. The preview is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Customers should not use the preview to process personal data or other data that is subject to legal or regulatory compliance requirements. The preview is intended for testing, evaluation, and feedback, and it shouldn't be used in production.

### Key features

- **Fully managed:** Azure takes care of the infrastructure provisioning and scaling with no user intervention. This significantly reduces customer onboarding effort, allowing customers to focus on the queries and insights rather than on infrastructure management.
- **Confidential Spark SQL:** An official Apache Spark image, published through the Microsoft Container Registry (MCR), is used to create a Spark SQL engine that executes approved queries inside a confidential compute environment. The Spark driver and executors run as fully attested, policy-governed enclaves on **[Confidential Azure Container Instances (C-ACI) running as virtual nodes in an Azure Kubernetes Service (AKS) cluster](https://github.com/microsoft/virtualnodesOnAzureContainerInstances)**, so collaborators' data cannot be exfiltrated during query execution.
- **Governance:** Helps manage membership to clean rooms, enables and verifies approval for queries from relevant collaborators before executing them, and verifies consent to access sensitive collaborator data. It also helps generate tamper-resistant audit trails containing salient clean-room events. This is made possible with the help of an implementation of the [Confidential Consortium Framework (CCF)](https://microsoft.github.io/CCF/main/overview/what_is_ccf.html).
- **Privacy controls:** Each contributed dataset declares an `allowedFields` list so only those columns are ever exposed to queries — every other column in the source storage is excluded from access. In addition, each published query can declare *pre-conditions* (for example, a minimum row count per input view, below which the query aborts) and *post-filters* (for example, dropping aggregated groups that fall below a minimum count). Together these guards help prevent re-identification of individuals through the output.
- **Telemetry:** Throughout every clean-room run, operational logs are streamed in real time so the workload owner can monitor performance, troubleshoot issues, and keep the analytics healthy — without ever exposing collaborator data.
- **Verifiable trust:** Cryptographic remote attestation at each step forms the cornerstone of the service, letting every participant independently verify that the clean room is running the exact code that was agreed upon, on genuine confidential hardware.
- **Open-sourced containers:** All Microsoft-provided clean-room containers and sidecars are open source, hosted at `mcr.microsoft.com/cleanroom`, with code in the [Azure/azure-cleanroom](https://github.com/Azure/azure-cleanroom/) repository. Their provenance and integrity can be verified using GitHub artifact attestation.

### Use cases

Multiparty confidential big-data analytics unlocks value in scenarios where data sensitivity, regulatory pressure, or competitive concerns previously blocked collaboration. The following are early scenarios that benefit from confidential analytics.

#### Media and advertising

- Collaboration of advertiser CRM data with publisher data for audience targeting and segment activation.
- Collaboration of audience data with measurement partners for measurement and attribution.

#### Banking and finance

- Collaboration between banks and insurance firms to upsell relevant products to existing customers without sharing raw data from either side.
- Collaboration with retailers to generate customized offers for bank customers, without exposing either party's underlying data.

#### Government and public sector

- Secure collaboration across government departments to deliver better citizen welfare outcomes.
- Secure collaboration between government and private enterprises on shared-interest workloads such as traffic monitoring and weather systems.

#### Healthcare

- Enable healthcare firms — including biopharma organizations — to combine their data with third-party institutions to accelerate clinical development, such as identifying eligible participants for a clinical trial, without exposing underlying patient data.
- Combine patient datasets across hospitals to study disease patterns or outcomes without exposing protected health information.

#### Retail

- Analyze customer behavior across retailers and partners to enable richer personalization and inventory planning, without exposing each retailer's underlying customer data.

### Frequently asked questions

- **Is there a sample clean-room application to try?**

  Yes. After your request to join the preview is accepted, use one of the published samples:

  - **Azure CLI based sample:** [analytics-using-managedcleanroom — README-CLI](https://github.com/Azure-Samples/azure-cleanroom-samples/blob/managed/demos/analytics-using-managedcleanroom/README-CLI.md)
  - **REST API based sample:** [analytics-using-managedcleanroom — README-API](https://github.com/Azure-Samples/azure-cleanroom-samples/blob/managed/demos/analytics-using-managedcleanroom/README-API.md)

- **Can more than two organizations participate in a collaboration?**

  Yes. Azure Confidential Clean Rooms allows multiple data providers to share data in a single clean room.

- **Which data formats are supported as input and output?**

  CSV, Parquet, and JSON.

- **How does the service limit which columns are exposed to queries?**

  Each contributed dataset declares an `allowedFields` list, so only those columns are exposed to queries running in the clean room. Every other column in the source storage is excluded from access.

- **How does the service prevent individual-level re-identification from the output?**

  Every published query can declare *pre-conditions* (such as a minimum row count per input view, below which the query is rejected) and *post-filters* (such as dropping aggregated groups whose counts are below a configured threshold). The query composer can set these, and other collaborators can review and approve them.

- **Who has to approve a query?**

  Every query must be approved by all collaborators whose datasets it references.

If you have more questions about the analytics solution, [email the Azure Confidential Clean Rooms product team](mailto:CleanRoomPMTeam@microsoft.com).

## Joining the preview

Azure Confidential Clean Rooms for Analytics is currently in limited preview. If you're interested in joining the preview, fill in and submit [this form](https://aka.ms/accrforanalytics-signupform).

After you submit the form, we'll review your request. If we accept your request, we'll contact you with detailed steps for joining. Keep in mind that because the preview is limited, we might not be able to accept all requests.

If you have workload requirements outside Spark SQL analytics — such as custom analytics pipelines, machine learning training and fine-tuning, or inferencing — fill in and submit the same [form](https://aka.ms/accrforanalytics-signupform), and we'll get back to you.

For questions about joining, [email the Azure Confidential Clean Rooms product team](mailto:CleanRoomPMTeam@microsoft.com).

## Related content

- [Tutorial: Prepare a deployment for a confidential container on Azure Container Instances](/azure/container-instances/container-instances-tutorial-deploy-confidential-containers-cce-arm)
- [Overview of Microsoft Azure Attestation](/azure/attestation/overview)
