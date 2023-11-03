---
title: Planning red teaming for large language models (LLMs) and their applications 
titleSuffix: Azure OpenAI Service
description: Learn about how red teaming and adversarial testing is an essential practice in the responsible development of systems and features using large language models (LLMs)
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 11/03/2023
ms.custom: 
manager: nitinme
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
keywords:
---

# Planning red teaming for large language models (LLMs) and their applications

This guide offers some potential strategies for planning how to set up and manage red teaming for responsible AI (RAI) risks throughout the large language model (LLM) product life cycle.

## What is red teaming?

The term *red teaming* has historically described systematic adversarial attacks for testing security vulnerabilities. With the rise of LLMs, the term has extended beyond traditional cybersecurity and evolved in common usage to describe many kinds of probing, testing, and attacking of AI systems. With LLMs, both benign and adversarial usage can produce potentially harmful outputs, which can take many forms, including harmful content such as hate speech, incitement or glorification of violence, or sexual content.

## Why is RAI red teaming an important practice?

Red teaming is a best practice in the responsible development of systems and features using LLMs. While not a replacement for systematic measurement and mitigation work, red teamers help to uncover and identify harms and, in turn, enable measurement strategies to validate the effectiveness of mitigations.

While Microsoft has conducted red teaming exercises and implemented safety systems (including [content filters](./content-filter.md) and other [mitigation strategies](./prompt-engineering.md)) for its Azure OpenAI Service models (see this [Overview of responsible AI practices](/legal/cognitive-services/openai/overview)), the context of each LLM application will be unique and you also should conduct red teaming to:

- Test the LLM base model and determine whether there are gaps in the existing safety systems, given the context of your application.

- Identify and mitigate shortcomings in the existing default filters or mitigation strategies.

- Provide feedback on failures in order to make improvements.

- Note that red teaming is not a replacement for systematic measurement. A best practice is to complete an initial round of manual red teaming before conducting systematic measurements and implementing mitigations. As highlighted above, the goal of RAI red teaming is to identify harms, understand the risk surface, and develop the list of harms that can inform what needs to be measured and mitigated.

Here is how you can get started and plan your process of red teaming LLMs. Advance planning is critical to a productive red teaming exercise.

## Before testing

### Plan: Who will do the testing

**Assemble a diverse group of red teamers**

Determine the ideal composition of red teamers in terms of people’s experience, demographics, and expertise across disciplines (e.g., experts in AI, social sciences, security) for your product’s domain. For example, if you’re designing a chatbot to help health care providers, medical experts can help identify risks in that domain.

**Recruit red teamers with both benign and adversarial mindsets**

Having red teamers with an adversarial mindset and security-testing experience is essential for understanding security risks, but red teamers who are ordinary users of your application system and haven’t been involved in its development can bring valuable perspectives on harms that regular users might encounter.

[**Assign red teamers to harms and/or product features**](https://hits.microsoft.com/Recommendation/4220579)

- Assign RAI red teamers with specific expertise to probe for specific types of harms (e.g., security subject matter experts can probe for jailbreaks, meta prompt extraction, and content related to cyberattacks).

- For multiple rounds of testing, decide whether to switch red teamer assignments in each round to get diverse perspectives on each harm and maintain creativity. If switching assignments, allow time for red teamers to get up to speed on the instructions for their newly assigned harm. 

- In later stages, when the application and its UI are developed, you might want to assign red teamers to specific parts of the application (i.e., features) to ensure coverage of the entire application.

- Consider how much time and effort each red teamer should dedicate (e.g., those testing for benign scenarios might need less time than those testing for adversarial scenarios).

> [!NOTE]
> It can be helpful to provide red teamers with:
> - Clear instructions that could include:
>     - An introduction describing the purpose and goal of the given round of red teaming; the product and features that will be tested and how to access them; what kinds of issues to test for; red teamers’ focus areas, if the testing is more targeted; how much time and effort each red teamer should spend on testing; how to record results; and who to contact with questions.  
> - A file or location for recording their examples and findings, including information such as:
>     - The date an example was surfaced; a unique identifier for the input/output pair if available, for reproducibility purposes; the input prompt; a description or screenshot of the output.

### Plan: What to test

Because an application is developed using a base model, you may need to test at several different layers:

- The LLM base model with its safety system in place to identify any gaps that may need to be addressed in the context of your application system. (Testing is usually done through an API endpoint.)

- Your application. (Testing is best done through a UI.)

- Both the LLM base model and your application, before and after mitigations are in place.

The following recommendations help you choose what to test at various points during red teaming:

- You can begin by testing the base model to understand the risk surface, identify harms, and guide the development of RAI mitigations for your product.

- Test versions of your product iteratively with and without RAI mitigations in place to assess the effectiveness of RAI mitigations. (Note, manual red teaming might not be sufficient assessment—use systematic measurements as well, but only after completing an initial round of manual red teaming.)  

- Conduct testing of application(s) on the production UI as much as possible because this most closely resembles real-world usage.  

When reporting results, make clear which endpoints were used for testing. When testing was done in an endpoint other than product, consider testing again on the production endpoint or UI in future rounds.

### Plan: How to test

1. **[Conduct open-ended testing to uncover a wide range of harms.](https://hits.microsoft.com/Recommendation/4220586)**

    The benefit of RAI red teamers exploring and documenting any problematic content (rather than asking them to find examples of specific harms) enables them to creatively explore a wide range of issues, uncovering blind spots in your understanding of the risk surface.

2. **Create a list of harms from the open-ended testing.**.

    - Consider creating a list of harms, with definitions and examples of the harms.  
    - Provide this list as a guideline to red teamers in later rounds of testing.

3. **Conduct guided red teaming and iterate: Continue probing for harms in the list; identify new harms that surface.**

    Use a list of harms if available and continue testing for known harms and the effectiveness of their mitigations. In the process, you will likely identify new harms. Integrate these into the list and be open to shifting measurement and mitigation priorities to address the newly identified harms.

    Plan which harms to prioritize for iterative testing. Several factors can inform your prioritization, including, but not limited to, the severity of the harms and the context in which they are more likely to surface.

### Plan: How to record data

**[Decide what data you need to collect and what data is optional.](https://hits.microsoft.com/Recommendation/4220591)**

- Decide what data the red teamers will need to record (e.g., the input they used; the output of the system; a unique ID, if available, to reproduce the example in the future; and other notes.)

- Be strategic with what data you are collecting to avoid overwhelming red teamers, while not missing out on critical information.

**[Create a structure for data collection](https://hits.microsoft.com/Recommendation/4220592)**

A shared Excel spreadsheet is often the simplest method for collecting red teaming data. A benefit of this shared file is that red teamers can review each other’s examples to gain creative ideas for their own testing and avoid duplication of data.

## During testing

**[Plan to be on active standby while red teaming is ongoing](https://hits.microsoft.com/Recommendation/4220593)**

- Be prepared to assist red teamers with instructions and access issues.
- Monitor progress on the spreadsheet and send timely reminders to red teamers.

## After each round of testing

**[Report data](https://hits.microsoft.com/Recommendation/4220595)**

Share a short report on a regular interval with key stakeholders that:

1. Lists the top identified issues.

2. Provides a link to the raw data.

3. Previews the testing plan for the upcoming rounds.

4. Acknowledges red teamers.

5. Provides any other relevant information.

**[Differentiate between identification and measurement](https://hits.microsoft.com/Recommendation/4220596)**

In the report, be sure to clarify that the role of RAI red teaming is to expose and raise understanding of risk surface and is not a replacement for systematic measurement and rigorous mitigation work. It is important that people do not interpret specific examples as a metric for the pervasiveness of that harm.

Additionally, if the report contains problematic content and examples, consider including a content warning.

The guidance in this document is not intended to be, and should not be construed as providing, legal advice. The jurisdiction in which you're operating may have various regulatory or legal requirements that apply to your AI system. Be aware that not all of these recommendations are appropriate for every scenario and, conversely, these recommendations may be insufficient for some scenarios. 

