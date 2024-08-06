---
title:  Overview of the de-identification service in Azure Health Data Services
description: Learn how the de-identification service in Azure Health Data Services anonymizes clinical data, ensuring HIPAA compliance while retaining data relevance for research and analytics.
author: kimiamavon
ms.service: healthcare-apis
ms.subservice: workspace
ms.topic: overview
ms.date: 7/17/2024
ms.author: kimiamavon
---

# What is the de-identification service?

The de-identification service in Azure Health Data Services enables healthcare organizations to anonymize clinical data so that the resulting data retains its clinical relevance and distribution while also adhering to the Health Insurance Portability and Accountability Act of 1996 (HIPAA) Privacy Rule. The service uses state-of-the-art machine learning models to automatically extract, redact, or surrogate 28 entities, including the HIPAA 18 Protected Health Information (PHI) identifiers – from unstructured text such as clinical notes, transcripts, messages, or clinical trial studies.

## Use de-identified data in research, analytics, and machine learning

The de-identification service unlocks data that was previously difficult to de-identify so organizations can conduct research and derive insights from analytics. The de-identification service supports three operations: **tag**, **redact**, or **surrogate PHI**. The de-identification service offers many benefits, including:

- **Surrogation**: Our service offers best practices for PHI protection in the form of surrogate replacement, where PHI elements are replaced with plausible looking surrogates; resulting in data that is most representative of the source data. Surrogation also provides stronger privacy protections as any false-negative PHI values are hidden within a document.

- **Consistent replacement**: Consistent surrogation results enable organizations to retain relationships occurring in the underlying dataset, which is critical for research, analytics, and machine learning. By submitting data in the same batch, our service allows for consistent replacement across entities and preserves the relative temporal relationships between events.

- **Expanded PHI coverage**: The service expands beyond the 18 HIPAA Identifiers to provide stronger privacy protections and more fine-grained distinctions between entity types, such as distinguishing between Doctor and Patient.

- **Deployment flexibility**: The de-identification service offers two ways to interact with the REST API or Client library (Azure SDK). The synchronous endpoint accepts submit raw unstructured text for analysis and the API output is returned in your application. Alternatively, use the asynchronous endpoint process files in bulk from Azure blob storage using tag, redact, or surrogation with consistency within an asynchronous call.

## De-identify clinical data securely and efficiently

The de-identification service offers many benefits, including:

- **PHI compliance**: The de-identification service is designed for protected health information (PHI). The service uses machine learning to identify PHI entities, including HIPAA’s 18 identifiers, using the “TAG” operation. The redaction and surrogation operations replace these identified PHI values with a tag of the entity type or a surrogate, or pseudonym. The service also meets all regional compliance requirements including HIPAA, GDPR, and CCPA.

- **Security**: The de-identification service is a stateless service. Customer data stays within the customer’s tenant.

- **Role-based Access Control (RBAC)**: RBAC enables you to manage how your organization's data is processed, stored, and accessed. You determine who has access to de-identify datasets based on roles you define for your environment.

## Synchronous or asynchronous endpoints

The de-identification service offers two ways to interact with the REST API or Client library (Azure SDK).

- Use the synchronous endpoint to submit raw unstructured text for analysis. The API output is returned in your application. -OR-
- Use the asynchronous endpoint process files in bulk from Azure blob storage using tag, redact, or surrogation with consistency within an asynchronous call.

| **Development option** | **Description** |
| ---------------------- | --------------- |
| REST API or Client library (Azure SDK) | Integrate the de-identification service into your applications using the REST API, or the client library. For more information, see the quickstart guide. |
| Asynchronous API | Use the asynchronous API to de-identify large volumes of data in Azure Blob Storage. The asynchronous API also enables consistent surrogation across PHI values, retaining relationships occurring in the underlying dataset. |

## Input requirements and service limits

The de-identification service is designed to receive unstructured text. For more information, see data and service limits. To de-identify data using the FHIR&reg; service, see the de-identified export documentation.

## Reference documentation and code samples

| **Development option / language** | **Reference documentation** | **Samples** |
| --------------------------------- | --------------------------- | ----------- |
| REST API                          | REST API documentation      |             |
| C#                                | C# documentation            | C# samples  |
| Java                              | Java documentation          | Java Samples|
| JavaScript                        | JavaScript documentation    | JavaScript samples |
| Python                            | Python documentation        | Python samples |

## Responsible use of AI

An AI system includes the technology, the people who use it, the people affected by it, and the environment where it's deployed. Read the transparency note for the de-identification service to learn about responsible AI use and deployment in your systems.

## Related content

[De-identification quickstart](quickstart.md)

[Integration and responsible use](/legal/cognitive-services/language-service/guidance-integration-responsible-use?context=%2Fazure%2Fai-services%2Flanguage-service%2Fcontext%2Fcontext)

[Data, privacy, and security](/legal/cognitive-services/language-service/data-privacy?context=%2Fazure%2Fai-services%2Flanguage-service%2Fcontext%2Fcontext)
