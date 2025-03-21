---
title:  The Azure Health Data Services de-identification service transparency note
description: The basics of Azure Health Data Services’ de-identification service and Responsible AI
author: kimiamavon
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: legal
ms.date: 8/16/2024
ms.author: kimiamavon
---
# The basics of Azure Health Data Services’ de-identification service

Azure Health Data Services’ de-identification service is an API that uses natural language processing techniques to find and label, redact, or surrogate Protected Health Information (PHI) in unstructured text. The service can be used for diverse types of unstructured health documents, including discharge summaries, clinical notes, clinical trials, messages, and more. The service uses machine learning to identify PHI, including HIPAA’s 18 identifiers, using the “TAG” operation. The redaction and surrogation operations replace these PHI values with a tag of the entity type or a surrogate, or pseudonym.

## Key terms
| Term | Definition |
| :--- | :------ |
| Surrogation | The replacement of data using a pseudonym or alternative token. | 
| Tag | The action or process of detecting words and phrases mentioned in unstructured text using named entity recognition. | 
| Consistent Surrogation | The process of replacing PHI values with alternative non-PHI data, such that the same PHI values are repeatedly replaced with consistent values. This may be within the same document or across documents for a given organization. | 

## Capabilities
### System behavior
To use the de-identification service, the input raw, unstructured text, can be sent synchronously one at a time or asynchronously as a batch. For the synchronous call, the API output is handled in your application. For the batch use case, the API call requires a source and target file location in Azure blob storage. Three possible operations are available through the API: "Tag," "Redact," or "Surrogate." Tag returns PHI values detected with named entity recognition. Redact returns the input text, except with the entity type replacing the PHI values. Surrogation returns the input text, except with randomly selected identifiers, or the same entity type, replacing the PHI values. Consistent surrogation is available across documents using the batch API.

## Use cases
### Intended uses
The de-identification service was built specifically for health and life sciences organizations within the United States subject to HIPAA. We do not recommend this service for non-medical applications or for applications other than English. Some common customer motivations for using the de-identification service include:

- Developing de-identified data for a test or research environment
- Developing de-identified datasets for data analytics without revealing confidential information
- Training machine learning models on private data, which is especially important for generative AI
- Sharing data across collaborating institutions

## Considerations when choosing other use cases 
We encourage customers to use the de-identification service in their innovative solutions or applications. However, de-identified data alone or in combination with other information may reveal patients' identities. As such, customers creating, using, and sharing de-identified data should do so responsibly.

## Disclaimer
Results derived from the de-identification service vary based on factors such as data input and functions selected. Microsoft is unable to evaluate the output of the de-identification service to determine the acceptability of any use cases or compliance needs. Outputs from the de-identification service are not guaranteed to meet any specific legal, regulatory, or compliance requirements. Please see the limitations before using the de-identification service.

## Suggested use
The de-identification service offers three operations: Tag, Redact, and Surrogation. When appropriate, we recommend users deploy surrogation over redaction. Surrogation is useful when the system fails to identify true PHI. The real value is hidden among surrogates, or stand-in-data. The data is "hiding in plain sight," unlike redaction. The service also offers consistent surrogation, or a continuous mapping of surrogate replacements across documents. Consistent surrogation is available by submitting files in batches to the API using the asynchronous endpoint. We recommend limiting the batch size as consistent surrogation over a large number of records degrades the privacy of the document.

## Technical limitations, operational factors, and ranges
There are various cases that would impact the de-identification service’s performance.

- Coverage: Unstructured text may contain information that reveals identifying characteristics about an individual that alone, or in combination with external information, reveals the identity of the individual. For example, a clinical record could state that a patient is the only known living person diagnosed with a particular rare disease. The unstructured text alone, or in combination with external information, may reveal that patient’s clinical records.
- Languages: Currently, the de-identification service is enabled for English text only.
- Spelling: Incorrect spelling might affect the output. If a word or the surrounding words are misspelled the system might or might not have enough information to recognize that the text is PHI.
- Data Format: The service performs best on unstructured text, such as clinical notes, transcripts, or messages. Structured text without context of surrounding words may or may not have enough information to recognize that the text is PHI.
- Performance: Potential error types are outlined in the System performance section.
- Surrogation: As stated above, the service offers consistent surrogation, or a continuous mapping of surrogate replacements across documents. Consistent surrogation is available by submitting files in batches to the API using the asynchronous endpoint. Submitting the same files in different batches or through the real-time endpoint results in different surrogates used in place of the PHI values.
- Compliance: The de-identification service's performance is dependent on the user’s data. The service does not guarantee compliance with HIPAA’s Safe Harbor method or any other privacy methods. We encourage users to obtain appropriate legal review of your solution, particularly for sensitive or high-risk applications.

## System performance
The de-identification service might have both false positive errors and false negative errors. An example of
a false positive is tag, redaction, or surrogation of a word or token that is not PHI. An example of a false
negative is the service’s failure to tag, redact, or surrogate a word or token that is truly PHI.

| Classification | Example | Tag Example | Explanation |
| :---------------- | :------ | :---- | :---- |
| False Positive | Patient reports allergy to cat hair. | Patient reports allergy to DOCTOR hair. | This is an example of a false positive, as "cat" in this context isn't PHI. "Cat" refers to an animal, and not a name. |
| False Negative | Jane reports allergy to cat hair. | Jane reports allergy to cat hair. | The system failed to identify Jane as a name. |
| True Positive | Jane reports allergy to cat hair. | PATIENT reports allergy to cat hair. | The system correctly identified Jane as a name. |
| True Negative | Patient reports allergy to cat hair. | Patient reports allergy to cat hair. | The system correctly identified that "cat" is not PHI. |

When evaluating candidate models for our service, we strive to reduce false negatives, the most important
metric from a privacy perspective.

The de-identification model is trained and evaluated on diverse types of unstructured medical documents, including clinical notes and transcripts. Our training data includes synthetically generated data, open datasets, and commercially obtained datasets with patient consent. We do not retain or use customer data to improve the service. Even though internal tests demonstrate the model’s potential to generalize to different populations and locales, you should carefully evaluate your model in the context of your intended use.

## Best practices for improving system performance
There are numerous best practices to improve the de-identification services’ performance:

- Surrogation: When appropriate, we recommend users deploy surrogation over redaction. This is because if the system fails to identify true PHI, then the real value would be hidden among surrogates, or stand-in-data. The data is "hiding in plain sight."
- Languages: Currently, the de-identification service is enabled for English text only. Code-switching or using other languages results in worse performance.
- Spelling: Correct spelling improves performance. If a word or the surrounding words are misspelled the system might or might not have enough information to recognize that the text is PHI.
- Data Format: The service performs best on unstructured text, such as clinical notes, transcripts, or messages. Structured text without context of surrounding words may or may not have enough information to recognize that the text is PHI.

## Evaluation of the de-identification service
### Evaluation methods
Our de-identification system is evaluated in terms of its ability to detect PHI in incoming text, and secondarily our ability to replace that PHI with synthetic data that preserves the semantics of the incoming text.

### PHI detection
Our system focuses on its ability to successfully identify and remove all PHI in incoming text (recall). Secondary metrics include precision, which tells us how often we think something is PHI when it is not, as well as how often we identify both the type and location of PHI in text. As a service that is typically used to mitigate risk associated with PHI, the primary release criteria we use is recall. Recall is measured on a number of academic and internal datasets written in English and typically covers medical notes and conversations across various medical specialties. Our internal metrics do not include non-PHI text and are measured at an entity level with fuzzy matching such that the true text span need not match exactly to the detected one.

Our service goal is to maintain recall greater than 95%.

### PHI replacement
An important consideration for a system such as ours is that we produce synthetic data that looks like the original data source in terms of plausibility and readability. To this end, we evaluate how often our system produces replacements that can be interpreted as the same type as the original. This is an important intermediate metric that is a predictor of how well downstream applications could make sense of the de-identified data.

Secondarily, we internally study the performance of machine learning models trained on original vs. de-identified data. We do not publish the results of these studies, however we have found that using surrogation for machine learning applications can greatly improve the downstream ML model performance. As every machine learning application is different and these results may not translate across applications depending on their sensitivity to PHI, we encourage our customers who are using machine learning to study the applicability of de-identified data for machine learning purposes.

### Evaluation results
Our system currently meets our benchmarks for recall and precision on our academic evaluation sets.

### Limitations
The data and measurement that we perform represents most healthcare applications involving text conducted in English. In doing so, our system is optimized to perform well on medical data, and we believe represent the typical usage including length, encoding, formatting, markup, style, and content. Our system performs well for many types of text, but may underperform if the incoming data differs with respect to any of these
metrics. Care has been taken in the system to analyze text in large chunks, such that the context of a phrase is used to infer if it is PHI or not. We do not recommend using this system in a real-time / transcription application, where the caller may only have access to the context before a PHI utterance. Our system relies on both pre- and post- text for context.

Our training algorithm leverages large foundational models that are trained on large amounts of text from all sources, including nonmedical sources. While every reasonable effort is employed to ensure that the results of these models are in line with the domain and intended usage of the application, these systems may not perform well in all circumstances for all data. We do not recommend this system for nonmedical applications or for applications other than English.

### Fairness considerations
The surrogation system replaces names through random selection. This may result in a distribution of names more diverse than the original dataset. The surrogation system also strives to not include offensive content in results. The surrogation list has been evaluated by a content-scanning tool designed to check for sensitive geopolitical terms, profanity, and trademark terms in Microsoft products. At this time, we do not support languages other than English but plan to support multilingual input in the future.
Our model has been augmented to provide better than average performance for all cultures. We carefully inject data into our training process that represents many ethnicities in an effort to provide equal performance in PHI removal for all data, regardless of source. The service makes no guarantees implied or explicit with respect to its interpretation of data. Any user of this service should make no inferences about associations or correlations between tagged data elements such as: gender, age, location, language, occupation, illness, income level, marital status, disease or disorder, or any other demographic information.

## Evaluating and integrating the de-identification service for your use
Microsoft wants to help you responsibly deploy the de-identification service. As part of our commitment
to developing responsible AI, we urge you to consider the following factors:

- Understand what it can do: Fully assess the capabilities of the de-identification service to understand its capabilities and limitations. Understand how it will perform in your scenario, context, and on your specific data set.
- Test with real, diverse data: Understand how the de-identification service will perform in your scenario by thoroughly testing it by using real-life conditions and data that reflect the diversity in your users, geography, and deployment contexts. Small datasets, synthetic data, and tests that don't reflect your end-to-end scenario are unlikely to sufficiently represent your production performance.
- Respect an individual's right to privacy: Only collect or use data and information from individuals for lawful and justifiable purposes. Use only the data and information that you have consent to use or are legally permitted to use.
- Language: The de-identification service, at this time, is only built for English. Using other languages will impact the performance of the model.
- Legal review: Obtain appropriate legal review of your solution, particularly if you will use it in sensitive or high-risk applications. Understand what restrictions you might need to work within and any risks that need to be mitigated prior to use. It is your responsibility to mitigate such risks and resolve any issues that might come up.
- System review: If you plan to integrate and responsibly use an AI-powered product or feature into an existing system for software or customer or organizational processes, take time to understand how each part of your system will be affected. Consider how your AI solution aligns with Microsoft Responsible AI principles.
- Human in the loop: Keep a human in the loop and include human oversight as a consistent pattern area to explore. This means constant human oversight of the AI-powered product or feature and
ensuring the role of humans in making any decisions that are based on the model’s output. To prevent harm and to manage how the AI model performs, ensure that humans have a way to intervene in the solution in real time.
- Security: Ensure that your solution is secure and that it has adequate controls to preserve the integrity of your content and prevent unauthorized access.
- Customer feedback loop: Provide a feedback channel that users and individuals can use to report issues with the service after it's deployed. After you deploy an AI-powered product or feature, it requires ongoing monitoring and improvement. Have a plan and be ready to implement feedback and suggestions for improvement.

## Learn more about responsible AI
- [Microsoft AI principals](https://www.microsoft.com/ai/responsible-ai)
- [Microsoft responsible AI resources](https://www.microsoft.com/ai/responsible-ai-resources)

## Learn more about the de-identification service
* Explore [Microsoft Cloud for Healthcare](https://www.microsoft.com/industry/health/microsoft-cloud-for-healthcare) 
* Explore [Azure Health Data Services](https://azure.microsoft.com/products/health-data-services/) 

## About this document
© 2023 Microsoft Corporation. All rights reserved. This document is provided "as-is" and for informational purposes only. Information and views expressed in this document, including URL and other Internet Web site references, may change without notice. You bear the risk of using it. Some examples are for illustration only and are fictitious. No real association is intended or inferred.
This document is not intended to be, and should not be construed as providing legal advice. The jurisdiction in which you’re operating may have various regulatory or legal requirements that apply to your AI system. Consult a legal specialist if you are uncertain about laws or regulations that might apply to your system, especially if you think those might impact these recommendations. Be aware that not all of these recommendations and resources will be appropriate for every scenario, and conversely, these recommendations and resources may be insufficient for some scenarios.

Published: September 30, 2023

Last updated: August 16, 2024
