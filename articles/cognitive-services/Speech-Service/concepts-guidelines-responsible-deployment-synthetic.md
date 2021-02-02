---
title: Guidelines for responsible deployment of synthetic voice technology
titleSuffix: Azure Cognitive Services
description: Microsoft’s general design guidelines for using synthetic voice technology. These were developed in studies that Microsoft conducted with voice talent, consumers, as well individuals with speech disorders to guide the responsible development of synthetic voice.
services: cognitive-services
author: benoah
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/11/2019
ms.author: benoah
---

# Guidelines for responsible deployment of synthetic voice technology

## General considerations to keep in mind when implementing AI systems 

This article talks specifically about synthetic speech and Custom Neural Voice and the key considerations for making use of this technology responsibly. In general, however, there are several things you need to consider carefully when deciding how to use and implement AI-powered products and features: 

* Will this product or feature perform well in my scenario? Before deploying AI into your scenario, test how it performs using real-life data and make sure it can deliver the accuracy you need. 
* Are we equipped to identify and respond to errors? AI-powered products and features will not always be 100% accurate, so consider how you will identify and respond to any errors that may occur. 

## General guidelines for using synthetic voice technology 
Here are Microsoft’s general design guidelines for using synthetic voice technology. These were developed in studies that Microsoft conducted with voice talent, consumers, as well as individuals with speech disorders to guide the responsible development of synthetic voice.

For deployment of synthetic speech technology, the following guidelines apply across most scenarios.

### Disclose when the voice is synthetic
Disclosing that a voice is computer generated not only minimizes the risk of harmful outcomes from deception but also increases the trust in the organization delivering the voice. Learn more about [how to disclose](concepts-disclosure-guidelines.md).

Microsoft requires its customers to disclose the synthetic nature of custom neural voice to its users. 
* Make sure to provide adequate disclosure to audiences, especially when using voice of a well-known person - People make their judgment on information based on the person who delivers it, whether they do it consciously or unconsciously.  For example, disclosure could be verbally shared at the start of a broadcast. For more information visit the [disclosure patterns](concepts-disclosure-patterns.md).   
* Consider proper disclosure to parents or other parties with use cases that are designed for minors and children - If your use case is intended for minors or children, you will need to ensure that the parents or legal guardians are able to understand the disclosure about the use of synthetic media and make the right decision for the minors or children on whether to use the experience. 

### Select appropriate voice types for your scenario
Carefully consider the context of use and the potential harms associated with using synthetic voice. For example, high-fidelity synthetic voices may not be appropriate in high-risk scenarios, such as for personal messaging, financial transactions, or complex situations that require human adaptability or empathy. Users may also have different expectations for voice types. For example, when listening to sensitive news being read by a synthetic voice, some users prefer a more empathetic and human-like reading of the news, while others preferred a more monotone, unbiased voice. Consider testing your application to better understand user preferences.

### Be transparent about capabilities and limitations
Users are more likely to have higher expectations when interacting with high-fidelity synthetic voice agents. Consequently, when system capabilities don't meet those expectations, trust can suffer, and may result in unpleasant, or even harmful experiences.

### Provide optional human support
In ambiguous, transactional scenarios (for example, a call support center), users don't always trust a computer agent to appropriately respond to their requests. Human support may be necessary in these situations, regardless of the realistic quality of the voice or capability of the system.

## Considerations for voice talent
When working with voice talent, such as voice actors, to create synthetic voices, the guideline below applies.

### Obtain meaningful consent from voice talent
Voice talents should have control over their voice model (how and where it will be used) and be compensated for its use. Microsoft requires custom voice customers to obtain explicit written permission from their voice talent to create a synthetic voice and its agreement with voice talents contemplate the duration, use and any content limitations.  If you are creating a synthetic voice of a well-known person, you should provide a way for the person behind the voice to edit or approve the contents.

Some voice talents are unaware of the potential malicious uses of the technology and should be educated by system owners about the capabilities of the technology. Microsoft requires Customers to share Microsoft’s [Disclosure for Voice Talent](/legal/cognitive-services/speech-service/disclosure-voice-talent) with Voice Talent directly or through Voice Talent’s authorized representative that describes how synthetic voices are developed and operate in conjunction with text to speech services.

## Considerations for those with speech disorders
When working with individuals with speech disorders, to create or deploy synthetic voice technology, the following guidelines apply.

### Provide guidelines to establish contracts
Provide guidelines for establishing contracts with individuals who use synthetic voice for assistance in speaking. The contract should consider specifying the parties who own the voice, duration of use, ownership transfer criteria, procedures for deleting the voice font, and how to prevent unauthorized access. Additionally, enable the contractual transfer of voice font ownership after death to family members if that person has given permission.

### Account for inconsistencies in speech patterns
For individuals with speech disorders who record their own voice fonts, inconsistencies in their speech pattern (slurring or inability to pronounce certain words) may complicate the recording process. In these cases, synthetic voice technology and recording sessions should accommodate them (that is, provide breaks and additional number of recording sessions).

### Allow modification over time
Individuals with speech disorders desire to make updates to their synthetic voice to reflect aging (for example, a child reaching puberty). Individuals may also have stylistic preferences that change over time, and may want to make changes to pitch, accent, or other voice characteristics.


## Reference docs

* [Disclosure for Voice Talent](/legal/cognitive-services/speech-service/disclosure-voice-talent)
* [Gating Overview](concepts-gating-overview.md)
* [How to Disclose](concepts-disclosure-guidelines.md)
* [Disclosure Design Patterns](concepts-disclosure-patterns.md)

## Next steps

* [Disclosure for Voice Talent](/legal/cognitive-services/speech-service/disclosure-voice-talent)
* [How to Disclose](concepts-disclosure-guidelines.md)
* [Disclosure Design Patterns](concepts-disclosure-patterns.md)
