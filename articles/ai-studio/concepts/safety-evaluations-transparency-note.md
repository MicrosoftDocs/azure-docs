---
title: Transparency Note for Azure AI Studio safety evaluations
titleSuffix: Azure AI Studio
description: Azure AI Studio safety evaluations intended purpose, capabilities, limitations and how to achieve the best performance.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: article
ms.date: 5/21/2024
ms.reviewer: mithigpe
ms.author: lagayhar
author: lgayhardt
---

# Transparency Note for Azure AI Studio safety evaluations

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

## What is a Transparency Note

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it's deployed. Creating a system that is fit for its intended purpose requires an understanding of how the technology works, what its capabilities and limitations are, and how to achieve the best performance. Microsoft’s Transparency Notes are intended to help you understand how our AI technology works, the choices system owners can make that influence system performance and behavior, and the importance of thinking about the whole system, including the technology, the people, and the environment. You can use Transparency Notes when developing or deploying your own system, or share them with the people who will use or be affected by your system.

Microsoft’s Transparency Notes are part of a broader effort at Microsoft to put our AI Principles into practice. To find out more, see the [Microsoft AI principles](https://www.microsoft.com/en-us/ai/responsible-ai).

## The basics of Azure AI Studio safety evaluations

### Introduction

The Azure AI Studio safety evaluations let users evaluate the output of their generative AI application for textual content risks: hateful and unfair content, sexual content, violent content, self-harm-related content, jailbreak vulnerability. Safety evaluations can also help generate adversarial datasets to help you accelerate and augment the red-teaming operation. Azure AI Studio safety evaluations reflect Microsoft’s commitments to ensure AI systems are built safely and responsibly, operationalizing our Responsible AI principles.

### Key terms

- **Hateful and unfair content** refers to any language pertaining to hate toward or unfair representations of individuals and social groups along factors including but not limited to race, ethnicity, nationality, gender, sexual orientation, religion, immigration status, ability, personal appearance, and body size. Unfairness occurs when AI systems treat or represent social groups inequitably, creating or contributing to societal inequities.
- **Sexual content** includes language pertaining to anatomical organs and genitals, romantic relationships, acts portrayed in erotic terms, pregnancy, physical sexual acts (including assault or sexual violence), prostitution, pornography, and sexual abuse.
- **Violent content** includes language pertaining to physical actions intended to hurt, injure, damage, or kill someone or something. It also includes descriptions of weapons and guns (and related entities such as manufacturers and associations).
- **Self-harm-related content** includes language pertaining to actions intended to hurt, injure, or damage one's body or kill oneself.
- **Jailbreak**, direct prompt attacks, or user prompt injection attacks, refer to users manipulating prompts to inject harmful inputs into LLMs to distort actions and outputs. An example of a jailbreak command is a ‘DAN’ (Do Anything Now) attack, which can trick the LLM into inappropriate content generation or ignoring system-imposed restrictions.  
- **Defect rate (content risk)** is defined as the percentage of instances in your test dataset that surpass a threshold on the severity scale over the whole dataset size.
- **Red-teaming** has historically described systematic adversarial attacks for testing security vulnerabilities. With the rise of Large Language Models (LLM), the term has extended beyond traditional cybersecurity and evolved in common usage to describe many kinds of probing, testing, and attacking of AI systems. With LLMs, both benign and adversarial usage can produce potentially harmful outputs, which can take many forms, including harmful content such as hateful speech, incitement or glorification of violence, reference to self-harm-related content or sexual content.

## Capabilities

### System behavior

Azure AI Studio provisions an Azure OpenAI GPT-4 model and orchestrates adversarial attacks against your application to generate a high quality test dataset. It then provisions another GPT-4 model to annotate your test dataset for content and security. Users provide their generative AI application endpoint that they wish to test, and the safety evaluations will output a static test dataset against that endpoint along with its content risk label (Very low, Low, Medium, High) and reasoning for the AI-generated label.

### Use cases

#### Intended uses

The safety evaluations aren't intended to use for any purpose other than to evaluate content risks and jailbreak vulnerabilities of your generative AI application:

- **Evaluating your generative AI application pre-deployment**: Using the evaluation wizard in the Azure AI studio or the Azure AI Python SDK, safety evaluations can assess in an automated way to evaluate potential content or security risks.
- **Augmenting your red-teaming operations**: Using the adversarial simulator, safety evaluations can simulate adversarial interactions with your generative AI application to attempt to uncover content and security risks.
- **Communicating content and security risks to stakeholders**: Using the Azure AI studio, you can share access to your Azure AI Studio project with safety evaluations results with auditors or compliance stakeholders.

#### Considerations when choosing a use case

We encourage customers to leverage Azure AI Studio safety evaluations in their innovative solutions or applications. However, here are some considerations when choosing a use case:

- **Safety evaluations should include human-in-the-loop**: Using automated evaluations like Azure AI Studio safety evaluations should include human reviewers such as domain experts to assess whether your generative AI application has been tested thoroughly prior to deployment to end users.
- **Safety evaluations do not include total comprehensive coverage**: Though safety evaluations can provide a way to augment your testing for potential content or security risks, it wasn't designed to replace manual red-teaming operations specifically geared towards your application’s domain, use cases, and type of end users.
- Supported scenarios:
    - For adversarial simulation: Question answering, multi-turn chat, summarization, search, text rewrite, ungrounded and grounded content generation.
    - For automated annotation: Question answering and multi-turn chat.
- The service currently is best used with the English domain for textual generations only. Additional features including multi-model support will be considered for future releases.
- The coverage of content risks provided in the safety evaluations is subsampled from a limited number of marginalized groups and topics:
    - The hate- and unfairness metric includes some coverage for a limited number of marginalized groups for the demographic factor of gender (for example, men, women, non-binary people) and race, ancestry, ethnicity, and nationality (for example, Black, Mexican, European). Not all marginalized groups in gender and race, ancestry, ethnicity, and nationality are covered. Other demographic factors that are relevant to hate and unfairness don't currently have coverage (for example, disability, sexuality, religion).
    - The metrics for sexual, violent, and self-harm-related content are based on a preliminary conceptualization of these harms that are less developed than hate and unfairness. This means that we can make less strong claims about measurement coverage and how well the measurements represent the different ways these harms can occur. Coverage for these content types includes a limited number of topics relate to sex (for example, sexual violence, relationships, sexual acts), violence (for example, abuse, injuring others, kidnapping), and self-harm (for example, intentional death, intentional self-injury, eating disorders).
- Azure AI Studio safety evaluations don't currently allow for plug-ins or extensibility.
- To keep quality up to date and improve coverage, we'll aim for a cadence of future releases of improvement to the service’s adversarial simulation and annotation capabilities.

### Technical limitations, operational factors, and ranges

- The field of large language models (LLMs) continues to evolve at a rapid pace, requiring continuous improvement of evaluation techniques to ensure safe and reliable AI system deployment. Azure AI Studio safety evaluations reflect Microsoft’s commitment to continue innovating in the field of LLM evaluation. We aim to provide the best tooling to help you evaluate the safety of your generative AI applications but recognize effective evaluation is a continuous work in progress.
- Customization of Azure AI Studio safety evaluations is currently limited. We only expect users to provide their input generative AI application endpoint and our service will output a static dataset that is labeled for content risk.
- Finally, it should be noted that this system doesn't automate any actions or tasks, it only provides an evaluation of your generative AI application outputs, which should be reviewed by a human decision maker in the loop before choosing to deploy the generative AI application or system into production for end users.

## System performance

### Best practices for improving system performance

- When accounting for your domain, which might treat some content more sensitively than other, consider adjusting the threshold for calculating the defect rate.
- When using the automated safety evaluations, there might sometimes be an error in your AI-generated labels for the severity of a content risk or its reasoning. There's a manual human feedback column to enable human-in-the-loop validation of the automated safety evaluation results.

## Evaluation of Azure AI Studio safety evaluations

### Evaluation methods

For all supported content risk types, we have internally checked the quality by comparing the rate of approximate matches between human labelers using a 0-7 severity scale and the safety evaluations’ automated annotator also using a 0-7 severity scale on the same datasets. For each risk area, we had both human labelers and an automated annotator label 500 English, single-turn texts. The human labelers and the automated annotator didn't use exactly the same versions of the annotation guidelines; while the automated annotator’s guidelines stemmed from the guidelines for humans, they have since diverged to varying degrees (with the hate and unfairness guidelines having diverged the most). Despite these slight to moderate differences, we believe it's still useful to share general trends and insights from our comparison of approximate matches. In our comparisons, we looked for matches with a 2-level tolerance (where human label matched automated annotator label exactly or was within 2 levels above or below in severity), matches with a 1-level tolerance, and matches with a 0-level tolerance.

### Evaluation results

Overall, we saw a high rate of approximate matches across the self-harm and sexual content risks across all tolerance levels. For violence and for hate and unfairness, the approximate match rate across tolerance levels were lower. These results were in part due to increased divergence in annotation guideline content for human labelers versus automated annotator, and in part due to the increased amount of content and complexity in specific guidelines.

Although our comparisons are between entities that used slightly to moderately different annotation guidelines (and are thus not standard human-model agreement comparisons), these comparisons provide an estimate of the quality that we can expect from Azure AI Studio safety evaluations given the parameters of these comparisons. Specifically, we only looked at English samples, so our findings might not generalize to other languages. Also, each dataset sample consisted of only a single turn, and so more experiments are needed to verify generalizability of our evaluation findings to multi-turn scenarios (for example, a back-and-forth conversation including user queries and system responses). The types of samples used in these evaluation datasets can also greatly affect the approximate match rate between human labels and an automated annotator – if samples are easier to label (for example, if all samples are free of content risks), we might expect the approximate match rate to be higher. The quality of human labels for an evaluation could also affect the generalization of our findings.

## Evaluating and integrating Azure AI Studio safety evaluations for your use

Measurement and evaluation of your generative AI application are a critical part of a holistic approach to AI risk management. Azure AI Studio safety evaluations are complementary to and should be used in tandem with other AI risk management practices. Domain experts and human-in-the-loop reviewers should provide proper oversight when using AI-assisted safety evaluations in the generative AI application design, development, and deployment cycle. You should understand the limitations and intended uses of the safety evaluations, being careful not to rely on outputs produced by Azure AI Studio AI-assisted safety evaluations in isolation.

Due to the non-deterministic nature of the LLMs, you might experience false negative or positive results, such as a high-severity level of violent content scored as "very low" or “low.” Additionally, evaluation results might have different meanings for different audiences. For example, safety evaluations might generate a label for “low” severity of violent content that might not align to a human reviewer’s definition of how severe that specific violent content might be. In Azure AI Studio, we provide a human feedback column with thumbs up and thumbs down when viewing your evaluation results to surface which instances were approved or flagged as incorrect by a human reviewer. Consider the context of how your results might be interpreted for decision making by others you can share evaluation with and validate your evaluation results with the appropriate level of scrutiny for the level of risk in the environment that each generative AI application operates in.

## Learn more about responsible AI

- [Microsoft AI principles](https://www.microsoft.com/ai/responsible-ai)
- [Microsoft responsible AI resources](https://www.microsoft.com/ai/tools-practices)
- [Microsoft Azure Learning courses on responsible AI](/ai)

## Learn more about Azure AI Studio safety evaluations

- [Microsoft concept documentation on our approach to evaluating generative AI applications](evaluation-approach-gen-ai.md)
- [Microsoft concept documentation on how safety evaluation works](evaluation-metrics-built-in.md)
- [Microsoft how-to documentation on using safety evaluations](../how-to/evaluate-generative-ai-app.md)
- [Technical blog on how to evaluate content and security risks in your generative AI applications](https://techcommunity.microsoft.com/t5/ai-ai-platform-blog/introducing-ai-assisted-safety-evaluations-in-azure-ai-studio/ba-p/4098595)
