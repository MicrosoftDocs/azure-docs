---
title: Guidance for integration and responsible use of Personalizer
titleSuffix: Azure AI services
description: Guidance for integration and responsible use of Personalizer
author: jcodella
ms.author: jacodel
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.date: 05/23/2022
ms.topic: conceptual
---


# Guidance for integration and responsible use of Personalizer

Microsoft works to help customers responsibly develop and deploy solutions by using Azure AI Personalizer. Our principled approach upholds personal agency and dignity by considering the AI system's:  

- Fairness, reliability, and safety.
- Privacy and security.
- Inclusiveness.
- Transparency.
- Human accountability.

These considerations reflect our commitment to developing responsible AI.


## General guidelines for integration and responsible use principles

When you get ready to integrate and responsibly use AI-powered products or features, the following activities will help to set you up for success:

- Understand what it can do. Fully assess the potential of Personalizer to understand its capabilities and limitations. Understand how it will perform in your particular scenario and context by thoroughly testing it with real-life conditions and data.  

- **Respect an individual's right to privacy**. Only collect data and information from individuals for lawful and justifiable purposes. Only use data and information that you have consent to use for this purpose.

- **Obtain legal review**. Obtain appropriate legal advice to review Personalizer and how you are using it in your solution, particularly if you will use it in sensitive or high-risk applications. Understand what restrictions you might need to work within and your responsibility to resolve any issues that might come up in the future.  

- **Have a human in the loop**. Include human oversight as a consistent pattern area to explore. Ensure constant human oversight of the AI-powered product or feature. Maintain the role of humans in decision making. Make sure you can have real-time human intervention in the solution to prevent harm and manage situations when the AI system doesn’t perform as expected.  

- **Build trust with affected stakeholders**. Communicate the expected benefits and potential risks to affected stakeholders. Help people understand why the data is needed and how the use of the data will lead to their benefit. Describe data handling in an understandable way.  

- **Create a customer feedback loop**. Provide a feedback channel that allows users and individuals to report issues with the service after it's deployed. After you've deployed an AI-powered product or feature, it requires ongoing monitoring and improvement. Be ready to implement any feedback and suggestions for improvement. Establish channels to collect questions and concerns from affected stakeholders. People who might be directly or indirectly affected by the system include employees, visitors, and the general public.  

- **Feedback**: Seek feedback from a diverse sampling of the community during the development and evaluation process (for example, historically marginalized groups, people with disabilities, and service workers). For more information, see Community jury.  

- **User Study**: Any consent or disclosure recommendations should be framed in a user study. Evaluate the first and continuous-use experience with a representative sample of the community to validate that the design choices lead to effective disclosure. Conduct user research with 10-20 community members (affected stakeholders) to evaluate their comprehension of the information and to determine if their expectations are met.

- **Transparency & Explainability:** Consider enabling and using Personalizer's [inference explainability](./concepts-features.md?branch=main) capability to better understand which features play a significant role in Personalizer's decision choice in each Rank call. This capability empowers you to provide your users with transparency regarding how their data played a role in producing the recommended best action. For example, you can give your users a button labeled "Why These Suggestions?" that shows which top features played a role in producing the Personalizer results. This information can also be used to better understand what data attributes about your users, contexts, and actions are working in favor of Personalizer's choice of best action, which are working against it, and which may have little or no effect. This capability can also provide insights about your user segments and help you identify and address potential biases.

- **Adversarial use**: consider establishing a process to detect and act on malicious manipulation. There are actors that will take advantage of machine learning and AI systems' ability to learn from their environment. With coordinated attacks, they can artificially fake patterns of behavior that shift the data and AI models toward their goals. If your use of Personalizer could influence important choices, make sure you have the appropriate means to detect and mitigate these types of attacks in place.

- **Opt out**: Consider providing a control for users to opt out of receiving personalized recommendations. For these users, the Personalizer Rank API will not be called from your application. Instead, your application can use an alternative mechanism for deciding what action is taken. For example, by opting out of personalized recommendations and choosing the default or baseline action, the user would experience the action that would be taken without Personalizer's recommendation. Alternatively, your application can use recommendations based on aggregate or population-based measures (e.g., now trending, top 10 most popular, etc.).


## Your responsibility

All guidelines for responsible implementation build on the foundation that developers and businesses using Personalizer are responsible and accountable for the effects of using these algorithms in society. If you're developing an application that your organization will deploy, you should recognize your role and responsibility for its operation and how it affects people. If you're designing an application to be deployed by a third party, come to a shared understanding of who is ultimately responsible for the behavior of the application. Make sure to document that understanding.


## Questions and feedback

Microsoft is continuously upgrading tools and documents to help you act on these responsibilities. Our team invites you to [provide feedback to Microsoft](mailto:cogsvcs-RL-feedback@microsoft.com?subject%3DPersonalizer%20Responsible%20Use%20Feedback&body%3D%5BPlease%20share%20any%20question%2C%20idea%20or%20concern%5D) if you believe other tools, product features, and documents would help you implement these guidelines for using Personalizer.


## Recommended reading
- See Microsoft's six principles for the responsible development of AI published in the January 2018 book, [The Future Computed](https://news.microsoft.com/futurecomputed/).


## Next steps

Understand how the Personalizer API receives features: [Features: Action and Context](concepts-features.md)
