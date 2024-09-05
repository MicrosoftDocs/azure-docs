---
title:  Overview of the De-identification service (preview) in Azure Health Data Services
description: Learn how the De-identification service (preview) in Azure Health Data Services anonymizes clinical data, ensuring HIPAA compliance while retaining data relevance for research and analytics.
author: kimiamavon
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: overview
ms.date: 7/17/2024
ms.author: kimiamavon
---

# What is the de-identification service (preview)?

The de-identification service (preview) in Azure Health Data Services enables healthcare organizations to anonymize clinical data so that the resulting data retains its clinical relevance and distribution while also adhering to the Health Insurance Portability and Accountability Act of 1996 (HIPAA) Privacy Rule. The service uses state-of-the-art machine learning models to automatically extract, redact, or surrogate 28 entities - including the HIPAA 18 Protected Health Information (PHI) identifiers – from unstructured text such as clinical notes, transcripts, messages, or clinical trial studies.

## Use de-identified data in research, analytics, and machine learning

The de-identification service (preview) unlocks data that was previously difficult to de-identify so organizations can conduct research and derive insights from analytics. The de-identification service supports three operations: **tag**, **redact**, or **surrogate PHI**. The de-identification service offers many benefits, including:

- **Surrogation**: Surrogation, or replacement, is a best practice for PHI protection. The service can replace PHI elements with plausible replacement values, resulting in data that is most representative of the source data. Surrogation strengthens privacy protections as any false-negative PHI values are hidden within a document.

- **Consistent replacement**: Consistent surrogation results enable organizations to retain relationships occurring in the underlying dataset, which is critical for research, analytics, and machine learning. By submitting data in the same batch, our service allows for consistent replacement across entities and preserves the relative temporal relationships between events.

- **Expanded PHI coverage**: The service expands beyond the 18 HIPAA Identifiers to provide stronger privacy protections and more fine-grained distinctions between entity types, such as distinguishing between Doctor and Patient.

## De-identify clinical data securely and efficiently

The de-identification service (preview) offers many benefits, including:

- **PHI compliance**: The de-identification service is designed for protected health information (PHI). The service uses machine learning to identify PHI entities, including HIPAA’s 18 identifiers, using the “TAG” operation. The redaction and surrogation operations replace these identified PHI values with a tag of the entity type or a surrogate, or pseudonym. The service also meets all regional compliance requirements including HIPAA, GDPR, and the California Consumer Privacy Act (CCPA).

- **Security**: The de-identification service is a stateless service. Customer data stays within the customer’s tenant.

- **Role-based Access Control (RBAC)**: Azure role-based access control (RBAC) enables you to manage how your organization's data is processed, stored, and accessed. You determine who has access to de-identify datasets based on roles you define for your environment.

## Synchronous or asynchronous endpoints

The de-identification service (preview) offers two ways to interact with the REST API or Client library (Azure SDK).

- Directly submit raw unstructured text for analysis. The API output is returned in your application.
- Submit a job to asynchronously endpoint process files in bulk from Azure Blob Storage using tag, redact, or surrogation with consistency within a job.

## Input requirements and service limits

The de-identification service (preview) is designed to receive unstructured text. To de-identify data stored in the FHIR&reg; service, see [Export deidentified data](/azure/healthcare-apis/fhir/deidentified-export).

The following service limits are applicable during preview:
- Requests can't exceed 50 KB.
- Jobs can process no more than 1,000 documents.
- Each document processed by a job can't exceed 2 MB.

## Pricing
As with other Azure Health Data Services, you pay only for what you use. You have a monthly allotment that enables you to try the product for free.

| Transformation Operation (per MB) | Up to 50 MB | Over 50 MB |
| ---------------- | ------ | ---- |
| Unstructured text de-identification | $0 | $0.05 |

When you choose to store documents in Azure Blob Storage, you are charged based on Azure Storage pricing.

## Responsible use of AI

An AI system includes the technology, the people who use it, the people affected by it, and the environment where you deploy it. Read the transparency note for the de-identification service (preview) to learn about responsible AI use and deployment in your systems.

## Related content

[De-identification quickstart](quickstart.md)

[Integration and responsible use](/legal/cognitive-services/language-service/guidance-integration-responsible-use?context=%2Fazure%2Fai-services%2Flanguage-service%2Fcontext%2Fcontext)

[Data, privacy, and security](/legal/cognitive-services/language-service/data-privacy?context=%2Fazure%2Fai-services%2Flanguage-service%2Fcontext%2Fcontext)
