---
title: Guidance for integration and responsible use with Trial Matcher
titleSuffix: Project Health Insights
description: Microsoft wants to help you responsibly develop and deploy solutions that use Trial Matcher.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 01/27/2023
ms.author: behoorne
---

# Integration and responsible use with Trial Matcher

As Microsoft works to help customers safely develop and deploy solutions using the Trial Matcher, we're taking a principled approach to upholding personal agency and dignity by considering the AI systems' fairness, reliability & safety, privacy & security, inclusiveness, transparency, and human accountability. These considerations are in line with our commitment to developing Responsible AI.

## General guidelines

When getting ready to integrate and use AI-powered products or features, the following activities help set you up for success:
- **Understand what it can do**: Fully vet and review the capabilities of any AI model you're using to understand its capabilities and limitations.

- **Test with real, diverse data**: Understand how your system will perform in your scenario by thoroughly testing it with real life conditions and data that reflects the diversity in your users, geography and deployment contexts. Small datasets, synthetic data and tests that don't reflect your end-to-end scenario are unlikely to sufficiently represent your production performance.

- **Respect an individual's right to privacy**: Only collect data and information from individuals for lawful and justifiable purposes. Only use data and information that you have consent to use for this purpose.

- **Legal review**: Obtain appropriate legal advice to review your solution, particularly if you will use it in sensitive or high-risk applications. Understand what restrictions you might need to work within and your responsibility to resolve any issues that might come up in the future.

- **System review**: If you're planning to integrate and responsibly use an AI-powered product or feature into an existing system of software, customers, and organizational processes, take the time to understand how each part of your system will be affected. Consider how your AI solution aligns with Microsoft's Responsible AI principles.

- **Human in the loop**: Keep a human in the loop. This means ensuring constant human oversight of the AI-powered product or feature and maintaining the role of humans in decision-making. Ensure you can have real-time human intervention in the solution to prevent harm. It enables you to manage where the AI model doesn't perform as required.

- **Security**: Ensure your solution is secure and has adequate controls to preserve the integrity of your content and prevent any unauthorized access.

- **Customer feedback loop**: Provide a feedback channel that allows users and individuals to report issues with the service once it's been deployed. Once you've deployed an AI-powered product or feature it requires ongoing monitoring and improvement – be ready to implement any feedback and suggestions for improvement.


## Integration and responsible use for Patient Health Information (PHI)

  - **Healthcare related data protections**: Healthcare data has special protections in various jurisdictions. Given the sensitive nature of health related data, make sure you know the regulations for your jurisdiction and take special care for security and data requirements when building your system. The Azure architecture center has [articles](/azure/architecture/example-scenario/data/azure-health-data-consortium) on storing health data and engineering compliance with HIPAA and HITRUST that you may find helpful.
  - **Protecting PHI**: The health feature doesn't anonymize the data you send to the service. If your system presents the response from the system with the original data, you may want to consider appropriate measures to identify and remove these entities.


## Learn more about Responsible AI
- [Microsoft Responsible AI principles](https://www.microsoft.com/ai/responsible-ai)
- [Microsoft Responsible AI resources](https://www.microsoft.com/ai/responsible-ai-resources)
- [Microsoft Azure Learning courses on Responsible AI](/training/paths/responsible-ai-business-principles/)
