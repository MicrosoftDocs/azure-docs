---
title: Manually sourcing human data for AI development
description: Manually sourcing human data can be important to building AI systems that work for all users. But certain practices should be avoided, especially ones that can cause physical and psychological harm to data contributors, as well as flawed datasets. 
author: nhu-do-1
ms.author: nhudo
ms.service: machine-learning
ms.topic: conceptual 
ms.date: 05/05/2022 
ms.custom: responsible-ml 
---
# What is "human data" and why is it important to source responsibly?

Human data is data collected directly from, or about, people. Human data may include personal data such as names, age, images, or voice clips and sensitive data such as genetic data, biometric data, gender identity, religious beliefs, or political affiliations. 

Collecting this data can be important to building AI systems that work for all users. But certain practices should be avoided, especially ones that can cause physical and psychological harm to data contributors, as well as flawed datasets.

The best practices in this article will help you conduct manual data collection projects from volunteers where everyone involved is treated with respect, and potential harms—especially those faced by vulnerable groups—are anticipated and mitigated. This means that:

- People contributing data are not coerced or exploited in any way, and they have control over what personal data is collected.
- People collecting and labeling data have adequate training 
- These practices can also help ensure more-balanced and higher-quality datasets and better stewardship of human data.

These are emerging practices, and we are continually learning. The best practices below are a starting point as you begin your own responsible human data collections. These best practices are provided for informational purposes only and should not be treated as legal advice. All human data collections should undergo specific privacy and legal reviews.

## General best practices

We suggest the following best practices for manually collecting human data directly from people.

 
| **Best Practice**   | **Why**  |
|:--------------------|----------|
| **Obtain voluntary informed consent.**  | <ul><li>Participants should understand and consent to data collection and how their data will be used.<li>Data should only be stored, processed, and used for purposes that are part of the original documented informed consent. <li>Consent documentation should be properly stored and associated with the collected data. <ul> |
| **Compensate data contributors appropriately.** | <ul><li>Data contributors should not be pressured or coerced into data collections and should be fairly compensated for their time and data. <li>Inappropriate compensation can be exploitative or coercive.<ul> |
| **Let contributors self-identify demographic information**           | <ul><li>Demographic information that is not self-reported by data contributors but assigned by data collectors may 1) result in inaccurate metadata and 2) be disrespectful to data contributors<ul>                                                                                                                                                                                                                                                  |
| **Anticipate harms when recruiting vulnerable groups.**              | <ul><li>Collecting data from vulnerable population groups introduces risk to data contributors and your organization.<ul>                                                                                                                                                                                                                                                          |
| **Treat data contributors with respect.**                            | <ul><li>Improper interactions with data contributors at any phase of the data collection can negatively impact data quality, as well as the overall data collection experience for data contributors and data collectors.<ul>                                                                                                                                                                                                                                       |
| **Qualify external suppliers carefully.**                            | <ul><li>Data collections with unqualified suppliers may result in low quality data, poor data management, unprofessional practices, and potentially harmful outcomes for data contributors and data collectors (including violations of human rights). <li> Annotation or labeling work (e.g., audio transcription, image tagging) with unqualified suppliers may result in low quality or biased datasets, insecure data management, unprofessional practices, and potentially harmful outcomes for data contributors (including violations of human rights).<ul>  |
| **Communicate expectations clearly in the Statement of Work (SOW) with suppliers.** | <ul><li>An SOW which lacks requirements for responsible data collection work may result in low-quality or poorly collected data.<ul>                                                                                                                                                                   |
| **Qualify geographies carefully.**                                   | <ul><li> When applicable, collecting data in restricted and/or unfamiliar geographies may result in unusable or low-quality data and may impact the safety of involved parties.<ul>                                                                                                                                                                                     |
| **Be a good steward of your datasets.**                              | <ul><li>Improper data management and poor documentation can result in data misuse.<ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

>[!TIP]
>This article focuses on recommendations for human data, including personal data and sensitive data such as biometric data, health data, racial or ethnic data, data collected manually from the general public or company employees, as well as metadata relating to human characteristics, such as age, ancestry, and gender identity, that may be created via annotation or labeling. 


## Best practices for collecting age, ancestry, and gender identity

In order for AI systems to work well for everyone, the datasets used for training and evaluation should reflect the diversity of people who will use or be affected by those systems. In many cases, age, ancestry, and gender identity can help approximate the range of factors that might affect how well a product performs for a variety of people; however, collecting this information requires special consideration.

If you do collect this data, always let data contributors self-identify (choose their own responses) instead of having data collectors make assumptions, which might be incorrect. Also include a “prefer not to answer” option for each question. These practices will show respect for the data contributors and yield more balanced and higher-quality data. 
 
These best practices have been developed based on three years of research with intended stakeholders and collaboration with many teams at Microsoft: [fairness and inclusiveness working groups](https://www.microsoft.com/ai/our-approach?activetab=pivot1:primaryr5), [Global Diversity & Inclusion](https://www.microsoft.com/diversity/default.aspx), [Global Readiness](https://www.microsoft.com/security/blog/2014/09/29/microsoft-global-readiness-diverse-cultures-multiple-languages-one-world/), [Office of Responsible AI](https://www.microsoft.com/ai/responsible-ai?activetab=pivot1:primaryr6), and others.   

To enable people to self-identify, consider using the following survey questions. 

### Age

**How old are you?**

*Select your age range*

[*Include appropriate age ranges as defined by project purpose, geographical region, and guidance from domain experts*]

<ul><li># to # </li>
<li># to # </li>
<li># to # </li>
<li>Prefer not to answer </li></ul>


### Ancestry

**Please select the categories that best describe your ancestry**

*May select multiple*

[*Include appropriate categories as defined by project purpose, geographical region, and guidance from domain experts*]

<ul><li>ancestry group </li>
<li>ancestry group </li>
<li>ancestry group </li>
<li>Multiple (multiracial, mixed ancestry) </li>
<li>Not listed, I describe myself as: _________________ </li>
<li>Prefer not to answer </li></ul>


### Gender identity

**How do you identify?**

*May select multiple*

[*Include appropriate gender identities as defined by project purpose, geographical region, and guidance from domain experts*]

<ul><li>gender identity </li>
<li>gender identity </li>
<li>gender identity </li>
<li>Prefer to self-describe: _________________ </li>
<li>Prefer not to answer </li></ul>


>[!CAUTION]
>In some parts of the world, there are laws that criminalize specific gender categories, so it may be dangerous for data contributors to answer this question honestly. Always give people a way to opt out. And work with regional experts and attorneys to conduct a careful review of the laws and cultural norms of each place where you plan to collect data, and if needed, avoid asking this question entirely. 


## Next steps
For more information on how to work with your data: 

- [Secure data access in Azure Machine Learning](concept-data.md)
- [Data ingestion options for Azure Machine Learning workflows](concept-data-ingestion.md)
- [Optimize data processing with Azure Machine Learning](concept-optimize-data-processing.md)
- [Use differential privacy in Azure Machine Learning](how-to-differential-privacy.md)

Follow these how-to guides to work with your data after you've collected it:

- [Set up image labeling](how-to-create-image-labeling-projects.md)
- [Label images and text](how-to-label-data.md)

