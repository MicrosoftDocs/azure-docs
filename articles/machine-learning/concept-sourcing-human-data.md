---
title: Sourcing Human Data
description: #Required; article description that is displayed in search results. 
author: nhu-do-1
ms.author: nhudo
ms.service: machine-learning
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 04/27/2022 #Required; mm/dd/yyyy format.
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

<!--Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

<!--
This template provides the basic structure of a concept article.
See the [concept guidance](contribute-how-write-concept.md) in the contributor guide.

To provide feedback on this template contact 
[the templates workgroup](mailto:templateswg@microsoft.com).
-->

<!-- 1. H1
Required. Set expectations for what the content covers, so customers know the 
content meets their needs. Should NOT begin with a verb.
-->

<!--  first level heading -->
# What is "human data" and why is it important to source responsibly?

Human data includes people’s **biometric data**—such as facial images, voice clips, iris scans, and gait, gesture, and handwriting analyses—and **personally identifiable information (PII),** such as age, ancestry, and gender identity. 

Collecting this data can be important to building AI that works for all users. But practices we have seen in the industry like collecting data from unhoused people  should be avoided because they can cause physical and psychological harm to data contributors, as well as flawed datasets.

The recommendations in this article will help you conduct data collection projects where everyone involved is treated with respect, and potential harms—especially those faced by vulnerable groups—are anticipated and addressed. This means that:

- People contributing data are not coerced or exploited in any way, and they have control over what PII is collected.
- People collecting and labeling data have adequate training as well as fair work hours and compensation.

These practices can also help ensure  more-balanced and higher-quality datasets and better stewardship of human data.

These are emerging practices, and we are continually learning. The recommendations below are a starting point as you begin your own responsible human data collections.

<!--second header -->

## General best practices

We recommend the following best practices for collecting human data directly from people

| **Recommendation**                                                   | **Why?**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|:----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Obtain voluntary informed consent.**                               | <ul><li>Not obtaining informed consent prohibits data collection, storage, processing, and use. <li>Data cannot be used for purposes that were not part of the original documented informed consent.  <li>Consent documentation that is not properly stored will result in not being able to use the associated data.<ul>                                                                                                                                                                                                                                                                      |
| **Compensate data contributors appropriately.**                      | <ul><li>Data that is obtained without appropriately compensating data contributors may lead to extortion or coercion scenarios.  <li>Inappropriate compensation can be exploitative or coercive.<ul>                                                                                                                                                                                                                                                                                                                                                                                           |
| **Let contributors self-identify demographic information**           | <ul><li>Demographic information that is not self-reported by data contributors but assigned by data collectors will 1) result in inaccurate metadata and 2) be disrespectful to data contributors<ul>                                                                                                                                                                                                                                                                                                                                                                                          |
| **Anticipate harms when recruiting vulnerable groups.**              | <ul><li>Collecting data from vulnerable population groups introduces risk to data contributors and your organization.<ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Treat data contributors with respect.**                            | <ul><li>Improper interactions with data contributors at any phase of the data collection can negatively impact data quality, as well as the overall data collection experience for data contributors and data collectors.<ul>                                                                                                                                                                                                                                                                                                                                                                  |
| **Qualify external suppliers carefully.**                            | <ul><li>Data collections with unqualified suppliers may result in low quality data, poor data management, unethical or unprofessional practices, and potentially harmful outcomes for data contributors and data collectors (including violations of human rights). <li> Annotation or labelling work (e.g., audio transcription, image tagging) with unqualified suppliers may result in low quality or biased datasets, insecure data management, unethical or unprofessional practices, and potentially harmful outcomes for data contributors (including violations of human rights).<ul>  |
| **Qualify geographies carefully.**                                   | <ul><li>Collecting data in required and/or unfamiliar geographies may result in unusable or low-quality data and may impact the safety of involved parties.<ul>                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Communicate expectations clearly in the Statement of Work (SOW).** | <ul><li>An SOW which lacks requirements for responsible and ethical data collection work may result in low-quality or poorly collected data.<ul>                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Be a good steward of your datasets.**                              | <ul><li>Improper data management and poor documentation can result in data misuse.<ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

[!TIP]
This article focuses on recommendations for human data, such as biometric data and PII, collected manually from the general public or company employees, as well as metadata relating to human characteristics, such as age, ancestry, and gender identity, that is created via annotation or labeling. The practices may also apply to collecting other data, including business, process, customer, licensed, open-source, web, and telemetry data.

<!--INSERT DOWNLOAD LINK TO FULL SOURCING HUMAN DATA DOC-->

## Best practices for collecting age, ancestry, and gender identity

In order for ML models and products to work well for everyone, the datasets used for training and evaluation should reflect the diversity of people who will use or be affected by those ML models. In many cases, age, ancestry, and gender identity can help approximate the range of factors that might affect how well a product performs for a variety of people; therefore, collecting this information requires special consideration.

First, only collect this data if it will contribute to fairer and more diverse ML-based products that perform well for all users. If you do collect this data, always let data contributors self-identify (i.e., choose their own responses) instead of having data collectors make assumptions, which might be incorrect. Also include a &#8220 prefer not to answer &#8221 option for each question. These practices will show respect for the data contributors and yield more balanced and higher-quality data.
 
These best practices have been developed based on three years of research with intended stakeholders and collaboration with many teams at Microsoft: [fairness and inclusiveness working groups] (https://www.microsoft.com/en-us/ai/our-approach?activetab=pivot1:primaryr5), [Global Diversity & Inclusion] (https://www.microsoft.com/en-us/diversity/default.aspx), [Global Readiness] (https://www.microsoft.com/security/blog/2014/09/29/microsoft-global-readiness-diverse-cultures-multiple-languages-one-world/), [Office of Responsible AI] (https://www.microsoft.com/en-us/ai/responsible-ai?activetab=pivot1:primaryr6), and others.   

To enable people to self-identify, consider using the following survey questions. 

### Age

| **How old are you?**

*Select your age range*
<ul><li>- [ ] [*Include appropriate age ranges as defined by project purpose, geographical region, and guidance from domain experts*]</li>
<li>- [ ] # to # </li>
<li>- [ ] # to # </li>
<li>- [ ] # to # </li>
<li>- Prefer not to answer </li></ul>|
|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

### Ancestry

| **Please select the categories that best describe your ancestry**

*May select multiple*
<ul><li>- [ ] [*Include appropriate categories as defined by project purpose, geographical region, and guidance from domain experts*]</li>
<li>- [ ] ancestry group </li>
<li>- [ ] ancestry group </li>
<li>- [ ] ancestry group </li>
<li>- [ ] Multiple (multiracial, mixed ancestry) </li>
<li>- [ ] Not listed, I describe myself as: _________________ </li>
<li>- Prefer not to answer </li></ul>|
|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

### Gender identity

| **How do you identify?**

*May select multiple*
<ul><li>- [ ] [*Include appropriate gender identities as defined by project purpose, geographical region, and guidance from domain experts*]</li>
<li>- [ ] gender identity </li>
<li>- [ ] gender identity </li>
<li>- [ ] gender identity </li>
<li>- [ ] Prefer to self-describe: _________________ </li>
<li>- Prefer not to answer </li></ul>|
|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

[!CAUTION]
In some parts of the world, there are laws that criminalize specific gender categories, so it may be dangerous for data contributors to answer this question honestly. Always give people a way to opt out. And work with regional experts and attorneys to conduct a careful review of the laws and cultural norms of each place where you plan to collect data, and if needed, avoid asking this question entirely. 

<!-- INCLUDE LINK TO FULL DOWNLOAD-->



## Next steps
<!-- Add a context sentence for the following links -->
For more information on how to work with your data: 

- [Write concepts](contribute-how-to-write-concept.md)
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
