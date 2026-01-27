---
title: Azure Health Data Services De-identification Service Transparency Note
description: The basics of the de-identification service in Azure Health Data Services and Responsible AI.
author: LeaKass
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: legal
ms.date: 06/19/2025
ms.author: leakassab
---
# The basics of the de-identification service in Azure Health Data Services

The de-identification service in Azure Health Data Services is an API that uses natural language processing techniques to find and label, redact, or surrogate protected health information (PHI) in unstructured text. You can use the service for diverse types of unstructured health documents, including discharge summaries, clinical notes, clinical trials, and messages.

The service uses machine learning to identify PHI, including the 18 identifiers that the Health Insurance Portability and Accountability Act of 1996 (HIPAA) recognizes. The service uses the `TAG` operation. The redaction and surrogation operations replace these PHI values with a tag of the entity type or a surrogate or pseudonym.

## Key terms

| Term | Definition |
| :--- | :------ |
| Surrogation | The replacement of data by using a pseudonym or alternative token. | 
| Tag | The action or process of detecting words and phrases mentioned in unstructured text by using named entity recognition. | 
| Consistent surrogation | The process of replacing PHI values with alternative non-PHI data so that the same PHI values are repeatedly replaced with consistent values. This action might occur within the same document or across documents for a specific organization. | 

## Capabilities

### System behavior

To use the de-identification service, the input raw, unstructured text is sent synchronously one at a time or asynchronously as a batch. For the synchronous call, the API output is handled in your application. For the batch use case, the API call requires a source and target file location in Azure Blob Storage.

Three possible operations are available through the API:

- `TAG`: The `TAG` operation returns PHI values detected with named entity recognition.
- `REDACT`: The `REDACT` operation returns the input text, except with the entity type replacing the PHI values.
- `SURROGATE`: The `SURROGATE` operation returns the input text, except with randomly selected identifiers, or the same entity type, replacing the PHI values. Consistent surrogation is available across documents by using the batch API.

## Use cases

### Intended uses

The de-identification service was built specifically for health and life sciences organizations within the United States that are subject to HIPAA. For expanded support for more languages and locales, see [Languages supported by the Azure Health Data Services de-identification service](languages-supported.md). This capability helps to support compliance with unlinked pseudonymization that follows GDPR principles. We don't recommend this service for nonmedical applications. Some common customer motivations for using the de-identification service include:

- Developing de-identified data for a test or research environment.
- Developing de-identified datasets for data analytics without revealing confidential information.
- Training machine learning models on private data, which is especially important for generative AI.
- Sharing data across collaborating institutions.

## Considerations when choosing other use cases

You're encouraged to use the de-identification service in your innovative solutions or applications. However, de-identified data alone or in combination with other information might reveal patient identities. When you create, use, and share de-identified data, you should do so responsibly.

## Disclaimer

Results derived from the de-identification service vary based on factors such as data input and functions selected. Microsoft is unable to evaluate the output of the de-identification service to determine the acceptability of any use cases or compliance needs. Outputs from the de-identification service aren't guaranteed to meet any specific legal, regulatory, or compliance requirements. Review the limitations before you use the de-identification service.

## Suggested use

The de-identification service offers the `TAG`, `REDACT`, and `SURROGATE` operations. When appropriate, we recommend that you deploy surrogation instead of redaction. Surrogation is useful when the system fails to identify true PHI. The real value is hidden among surrogates, or stand-in-data. The data is "hiding in plain sight," unlike redaction.

The service also offers consistent surrogation, or a continuous mapping of surrogate replacements across documents. Consistent surrogation is available by submitting files in batches to the API by using the asynchronous endpoint. We recommend that you limit the batch size because consistent surrogation over a large number of records degrades the privacy of the document.

## Technical limitations, operational factors, and ranges

Various cases might affect the performance of the de-identification service:

- **Coverage**: Unstructured text might contain information that reveals identifying characteristics about an individual that alone or in combination with external information reveals the identity of the individual. For example, a clinical record could state that a patient is the only known living person diagnosed with a particular rare disease. The unstructured text alone, or in combination with external information, might reveal that patient's clinical records.
- **Languages**: Currently, the de-identification service is enabled for the languages and locales listed in [Languages supported by the Azure Health Data Services de-identification service](languages-supported.md).
- **Spelling**: Incorrect spelling might affect the output. If a word or the surrounding words are misspelled, the system might not have enough information to recognize that the text is PHI.
- **Data format**: The service performs best on unstructured text, such as clinical notes, transcripts, or messages. Structured text without the context of surrounding words might not have enough information to recognize that the text is PHI.
- **Performance**: Potential error types are outlined in the system performance section.
- **Surrogation**: As stated previously, the service offers consistent surrogation or a continuous mapping of surrogate replacements across documents. Consistent surrogation is available by submitting files in batches to the API by using the asynchronous endpoint. Submitting the same files in different batches or through the real-time endpoint results in different surrogates used in place of the PHI values.
- **Compliance**: The performance of the de-identification service is dependent on the user's data. The service doesn't guarantee compliance with the HIPAA Safe Harbor method or unlinked pseudonymization aligned with GDPR principles. The service uses state-of-the-art machine learning models to identify and handle sensitive information to help support your own compliance efforts with the HIPAA Safe Harbor standards and unlinked pseudonymization aligned with GDPR principles. We encourage you to obtain appropriate legal review of your solution, particularly for sensitive or high-risk applications.

## System performance

The de-identification service might have both false positive errors and false negative errors. An example of a false positive is the tag, redaction, or surrogation of a word or token that isn't PHI. An example of a false negative is the failure of the service to tag, redact, or surrogate a word or token that is PHI.

| Classification | Example | Tag example | Explanation |
| :---------------- | :------ | :---- | :---- |
| False positive | Patient reports an allergic reaction to cat hair. | Patient reports an allergic reaction to *doctor* hair. | This example is a false positive because "cat" in this context isn't PHI. "Cat" refers to an animal and not a name. |
| False negative | Jane reports an allergic reaction to cat hair. | Jane reports an allergic reaction to cat hair. | The system failed to identify Jane as a name. |
| True positive | Jane reports an allergic reaction to cat hair. | *Patient* reports an allergic reaction to cat hair. | The system correctly identified Jane as a name. |
| True negative | Patient reports an allergic reaction to cat hair. | Patient reports an allergic reaction to cat hair. | The system correctly identified that "cat" isn't PHI. |

When we evaluate candidate models for the service, we strive to reduce false negatives. This metric is the most important from a privacy perspective.

The de-identification model is trained and evaluated on diverse types of unstructured medical documents, including clinical notes and transcripts. Training data includes synthetically generated data, open datasets, and commercially obtained datasets with patient consent.

We don't retain or use customer data to improve the service. Even though internal tests demonstrate the model's potential to generalize to different populations and locales, you should carefully evaluate your model in the context of your intended use.

## Best practices for improving system performance

Best practices help to improve the performance of the de-identification service:

- **Surrogation**: When appropriate, we recommend that you deploy surrogation instead of redaction. If the system fails to identify true PHI, the real value is hidden among surrogates, or stand-in-data. The data is "hiding in plain sight."
- **Languages**: Currently, the de-identification service is enabled for the languages and locales listed in [Languages supported by the Azure Health Data Services de-identification service](languages-supported.md). Code-switching or using languages with the wrong language-locale pairing results in worse performance.
- **Spelling**: Correct spelling improves performance. If a word or the surrounding words are misspelled, the system might not have enough information to recognize that the text is PHI.
- **Data format**: The service performs best on unstructured text, such as clinical notes, transcripts, or messages. Structured text without the context of surrounding words might not have enough information to recognize that the text is PHI.

## Evaluation of the de-identification service

### Evaluation methods

The de-identification system is evaluated in terms of its ability to detect PHI in incoming text. Secondarily, the system is evaluated on its ability to replace that PHI with synthetic data that preserves the semantics of the incoming text.

### PHI detection

The system focuses on its ability to successfully identify and remove all PHI in incoming text (recall). A secondary metric is precision, which tells us how often we think something is PHI when it isn't, and how often we identify both the type and location of PHI in text. The service is typically used to mitigate risk associated with PHI, so the primary release criteria is recall.

Recall is measured on many academic and internal datasets written in [each supported language](languages-supported.md). It typically covers medical notes and conversations across various medical specialties. Internal metrics don't include non-PHI text and are measured at an entity level with fuzzy matching so that the true text span doesn't need to match the detected one exactly.

The service goal is to maintain recall greater than 95%.

### PHI replacement

We produce synthetic data that looks like the original data source in terms of plausibility and readability. We evaluate how often the system produces replacements that can be interpreted as the same type as the original. This important intermediate metric predicts how well that downstream applications make sense of the de-identified data.

Secondarily, we internally study the performance of machine learning models trained on original versus de-identified data. We don't publish the results of these studies. Using surrogation for machine learning applications improves the downstream performance of the machine learning model.

Every machine learning application is different, so these results might not translate across applications depending on their sensitivity to PHI. If you use machine learning, you're encouraged to study the applicability of de-identified data for machine learning purposes.

### Evaluation results

The system currently meets the benchmarks for recall and precision on our academic evaluation sets.

### Limitations

The data and measurement that's performed represents most healthcare applications involving text conducted in [each supported language](languages-supported.md). In doing so, the system is optimized to perform well on medical data. We believe that it represents the typical usage, including length, encoding, formatting, markup, style, and content. The system performs well for many types of text, but it might underperform if the incoming data differs with respect to any of these metrics.

The system analyzes text in large chunks so that the context of a phrase is used to infer if it's PHI or not. We don't recommend using this system in a real-time/transcription application, where the caller might have access to the context only before a PHI utterance. The system relies on both pre- and post-text for context.

The training algorithm uses large foundational models that are trained on large amounts of text from all sources, including nonmedical sources. Every reasonable effort is made to ensure that the results of these models are in line with the domain and intended use of the application. However, these systems might not perform well in all circumstances for all data.

We don't recommend this system for nonmedical applications or for applications other than [the languages that are supported](languages-supported.md).

### Fairness considerations

The surrogation system replaces names through random selection. This process might result in a distribution of names more diverse than the original dataset. The surrogation system also strives to not include offensive content in results. A content-scanning tool evaluates the surrogation list and checks for sensitive geopolitical terms, profanity, and trademark terms in Microsoft products.

The model was augmented to provide better-than-average performance for all cultures. Data is carefully injected into the training process that represents many ethnicities to provide equal performance in PHI removal for all data, regardless of source.

The service makes no guarantees, implied or explicit, with respect to its interpretation of data. Any user of this service should make no inferences about associations or correlations between tagged data elements. These elements include gender, age, location, language, occupation, illness, income level, marital status, disease or disorder, or any other demographic information.

## Evaluate and integrate the de-identification service for your use

Microsoft wants to help you responsibly deploy the de-identification service. As part of a commitment to developing responsible AI, consider the following factors:

- **Understand what it can do**: Fully assess the capabilities of the de-identification service to understand its capabilities and limitations. Understand how it will perform in your scenario, context, and on your specific dataset.
- **Test with real, diverse data**: Understand how the de-identification service will perform in your scenario. Test it thoroughly by using real-life conditions and data that reflect the diversity in your users, geography, and deployment contexts. Small datasets, synthetic data, and tests that don't reflect your end-to-end scenario are unlikely to sufficiently represent your production performance.
- **Respect an individual's right to privacy**: Only collect or use data and information from individuals for lawful and justifiable purposes. Use only the data and information that you have consent to use or are legally permitted to use.
- **Language**: Confirm that your language is enabled for the de-identification service with the [languages and locales list](languages-supported.md).
- **Legal review**: Obtain appropriate legal review of your solution, particularly if you plan to use it in sensitive or high-risk applications. Understand what restrictions you might need to work within and any risks that need to be mitigated before use. You have a responsibility to mitigate risks and resolve any issues that might come up.
- **System review**: Understand how each part of your system will be affected if you plan to integrate and responsibly use an AI-powered product or feature in an existing system for software or customer or organizational processes. Consider how your AI solution aligns with Microsoft Responsible AI principles.
- **Human in the loop**: Keep a human in the loop and include human oversight as a consistent pattern area to explore. This practice means constant human oversight of the AI-powered product or feature. Ensure the role of humans in making any decisions that are based on the model's output. To prevent harm and to manage how the AI model performs, ensure that humans have a way to intervene in the solution in real time.
- **Security**: Ensure that your solution is secure and that it has adequate controls to preserve the integrity of your content and prevent unauthorized access.
- **Customer feedback loop**: Provide a feedback channel that users and individuals can use to report issues with the service after you deploy it. After you deploy an AI-powered product or feature, it requires ongoing monitoring and improvement. Have a plan and be ready to implement feedback and suggestions for improvement.

## Learn more about responsible AI

- [Microsoft AI principals](https://www.microsoft.com/ai/responsible-ai)
- [Microsoft Responsible AI resources](https://www.microsoft.com/ai/responsible-ai-resources)

## Learn more about the de-identification service

* Explore [Microsoft Cloud for Healthcare](https://www.microsoft.com/industry/health/microsoft-cloud-for-healthcare)
* Explore [Azure Health Data Services](https://azure.microsoft.com/products/health-data-services/)

## About this document

© 2023 Microsoft Corporation. All rights reserved. This document is provided "as-is" and for informational purposes only. Information and views expressed in this document, including URL and other internet website references, might change without notice. You bear the risk of using it. Some examples are for illustration only and are fictitious. No real association is intended or inferred.

This document is not intended to be, and should not be construed as, providing legal advice. The jurisdiction in which you're operating might have various regulatory or legal requirements that apply to your AI system. Consult a legal specialist if you're uncertain about laws or regulations that might apply to your system, especially if you think those might affect these recommendations. Be aware that not all of these recommendations and resources will be appropriate for every scenario, and conversely, these recommendations and resources might be insufficient for some scenarios.

Published: September 30, 2023

Last updated: August 16, 2024
