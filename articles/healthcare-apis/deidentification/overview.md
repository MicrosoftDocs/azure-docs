---
title: Overview of the De-identification Service in Azure Health Data Services
description: Learn how the de-identification service in Azure Health Data Services de-identifies clinical data, adhering to HIPAA compliance while retaining data relevance for research and analytics.
author: LeaKass
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: overview
ms.date: 10/24/2025
ms.author: leakassab
---

# What is the de-identification service?

![Screenshot that shows Tag, Redact, and Surrogate operations.](tag-redact-surrogate-operations.png)

The de-identification service in Azure Health Data Services enables healthcare organizations to de-identify clinical data in [multiple languages](languages-supported.md) so that the resulting data retains its clinical relevance and distribution while also adhering to the:

- Health Insurance Portability and Accountability Act of 1996 (HIPAA) privacy rule.
- Unlinked pseudonymization principle under the General Data Protection Regulation (GDPR).

The service uses state-of-the-art machine learning models to automatically extract, redact, or surrogate 27 entities. These entities include the *18 HIPAA protected health information (PHI) identifiers*. The entities come from unstructured text such as clinical notes, transcripts, messages, or clinical trial studies.

## How do you benefit from de-identifying your data?

| As a:                 | Health Data Services de-identification enables you to:                                                               |
|-------------------------|----------------------------------------------------------------------------------------------------------|
| Data scientist          | Use de-identified data to train robust machine learning models, build conversational agents, and conduct longitudinal studies. |
| Data analyst            | Monitor trends, build dashboards, and analyze outcomes without compromising privacy.                     |
| Data engineer           | Build and test development environments by using realistic, nonidentifiable data for safer deployment.             |
| Customer service agent  | Summarize support conversations and extract insights while maintaining patient confidentiality.           |
| Executive leader (C-suite) | Reduce risks of data exposure, enable secure data sharing, drive AI adoption responsibly, and ensure regulatory compliance. |
| Regulatory and compliance officer | Ensure that data handling aligns with HIPAA Safe Harbor and GDPR pseudonymization standards across multiple languages and geographies. |

## Why is this service the right fit for your use case?

The de-identification service unlocks the power of your data by automating three operations:

- `TAG`: Identifies and tags PHI in your clinical text. It specifies entity types like patient name, doctor name, and age.
- `REDACT`: Replaces the identified PHI in your clinical text with entity types.
- `SURROGATE`: Replaces the identified PHI in your clinical text with realistic pseudonyms like names of people, organizations, and hospitals. It randomizes number-based PHI like dates and alphanumeric entities such as ID numbers.

> [!TIP]
> *Surrogation*, or synthetic replacement, is a best practice for PHI protection. The service can replace PHI elements with plausible replacement values, which results in data that represents the source data most accurately. Surrogation strengthens privacy protections if any false-negative PHI values are hidden within a document.

### Consistent replacement to preserve patient timelines

Consistent surrogation results enable organizations to retain relationships that occur in the underlying dataset, which is critical for research, analytics, and machine learning. By submitting data in the same batch, Health Data Services allows for consistent replacement across entities and preserves the relative temporal relationships between events.

![Screenshot that shows consistent surrogation for English.](consistent-surrogation.png)

## De-identify clinical data securely and efficiently

The de-identification service offers many benefits, including:

- **Expanded PHI coverage**: The service expands beyond the 18 HIPAA identifiers to provide stronger privacy protections and more fine-grained distinctions between entity types. It distinguishes between doctor and patient and covers [27 PHI entities that the service de-identifies](/rest/api/health-dataplane/deidentify-text/deidentify-text#phicategory).
- **PHI compliance**: The de-identification service is designed for PHI. The service uses machine learning to identify PHI entities, including HIPAA's 18 identifiers, by using the `TAG` operation. The redaction and surrogation operations replace these identified PHI values with a tag of the entity type or a surrogate or pseudonym. The service supports compliance requirements such as HIPAA and GDPR principles.
- **Security**: The de-identification service is a stateless service. Customer data stays within the customer's tenant.
- **Role-based access control (RBAC)**: Azure RBAC enables you to manage how your organization's data is processed, stored, and accessed. You determine who has access to de-identify datasets based on roles that you define for your environment.

## Easy API integration into your workflow

![Screenshot that shows the API integration workflow.](workflow.png)

Integrating the Azure de-identification service into your environment is fast, flexible, and secure. The service is built to support health and life sciences workflows with minimal effort.

- **API-first design**: Determine whether you need real-time de-identification or asynchronous batch processing from Azure Blob Storage. The REST API and SDKs provide easy integration points to fit your system.
- **Quick setup**: Deploy the service in minutes by using the Azure portal, Azure Resource Manager templates, Bicep, or the Azure CLI. You can be up and running quickly without complex configuration.
- **Secure access**: Enable private endpoints by using Azure Private Link to keep data traffic off the public internet.
- **Fully managed identity support**: Use managed identities for secure, credential-free access to Azure Blob Storage.
- **Compliance-ready**: Operate the service within your Azure tenant and to adhere with HIPAA.

## Synchronous or asynchronous endpoints

The de-identification service offers two ways to interact with the REST API or client library (Azure SDK):

- Directly submit raw unstructured text for analysis. The API output is returned in your application.
- Submit a job for asynchronous endpoint processing of files in bulk from Blob Storage by using tag, redact, or surrogation with consistency within a job.

## Input requirements and service limits

The de-identification service is designed to receive unstructured text. To de-identify data stored in the Fast Healthcare Interoperability Resources service, see [Export de-identified data](/azure/healthcare-apis/fhir/deidentified-export).

The following service limits apply:

- Requests can't exceed 50 KB.
- Jobs can process no more than 10,000 documents.
- Each document processed by a job can't exceed 2 MB.
- Requests are throttled if you exceed 1 MB per 5 seconds or 100 requests per 5 seconds. If your use case requires higher throughput, submit a support request for consideration.

## Pricing

The de-identification service pricing depends on the amount of data de-identified by Health Data Services. You're charged per MB for any of the three operations that are offered, whether you use the asynchronous or synchronous endpoint.

The cost per MB de-identified appears in the **Unstructured De-identification** row in the **Transformation Operations (per MB)** table on the [Azure Health Data Services pricing webpage](https://azure.microsoft.com/pricing/details/health-data-services/?msockid=2982a916bc2461731022bd6cbdbd6053#pricing).

You also have a monthly allotment of 50 MB so that you can try the product for free.

The [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) helps you estimate the cost based on your use case.

When you choose to store documents in Blob Storage, charges are based on Azure Storage pricing.

## Responsible use of AI

An AI system includes the technology, the people who use it, the people affected by it, and the environment where you deploy it. To learn about responsible AI use and deployment in your systems, read the Transparency Note for the de-identification service.

## Related content

- [Quickstart: Deploy the de-identification service](quickstart.md)
- [Integration and responsible use](/legal/cognitive-services/language-service/guidance-integration-responsible-use?context=%2Fazure%2Fai-services%2Flanguage-service%2Fcontext%2Fcontext)
- [Data, privacy, and security](/legal/cognitive-services/language-service/data-privacy?context=%2Fazure%2Fai-services%2Flanguage-service%2Fcontext%2Fcontext)
