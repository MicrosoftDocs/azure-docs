---
title: "Harm categories in Azure Content Safety"
titleSuffix: Azure Cognitive Services
description: Learn about the different content moderation flags and severity levels that the Content Safety service returns.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-safety
ms.topic: conceptual
ms.date: 04/06/2023
ms.author: pafarley
keywords: 
---


# Harm categories in Azure Content Safety

This guide describes all of the harm categories and ratings that Content Safety uses to flag content. Both text and image content use the same set of flags.

## Harm categories

Content Safety recognizes four distinct categories of objectionable content.

| Category  | Description         |
| --------- | ------------------- |
| Hate      | **Hate** refers to any content that attacks or uses pejorative or discriminatory language in reference to a person or identity group based on certain differentiating attributes of that group. This includes but is not limited to race, ethnicity, nationality, gender identity and expression, sexual orientation, religion, immigration status, ability status, personal appearance, and body size. |
| Sexual    | **Sexual** describes content related to anatomical organs and genitals, romantic relationships, acts portrayed in erotic or affectionate terms, pregnancy, physical sexual acts&mdash;including those acts portrayed as an assault or a forced sexual violent act against one’s will&mdash;, prostitution, pornography, and abuse. |
| Violence  | **Violence** describes content related to physical actions intended to hurt, injure, damage, or kill someone or something. It also includes weapons, guns and related entities, such as manufacturers, associations, legislation, and similar. |
| Self-harm | **Self-harm** describes content related to physical actions intended to purposely hurt, injure, or damage one’s body or kill oneself. |

Classification can be multi-labeled. For example, when a text sample goes through the text moderation model, it could be classified as both Sexual content and Violence.

## Severity levels

Every harm category the service applies also comes with a severity level rating. The severity level is meant to indicate the severity of the consequences of showing the flagged content.

| Severity | Label |
| -------- | ----------- |
| 0        | Safe        |
| 2        | Low         |
| 4        | Medium      |
| 6        | High        |

A severity of 0 or "Safe" indicates a negative result: no objectionable content was detected in that category.

## Severity level definitions by category

This section describes what each severity level indicates in each category.

> [!CAUTION]
> The sections below may contain offensive content. User discretion is advised.

### Hate category severity levels

| Level                  | Description    | 
| -------------------- | ------------------------ | 
| Level 0                 | Content that is safe but may contain hate and fairness-related terms used in generic and safe contexts, like education, media, and official statistics. For example: "Hate speech is harmful as it undermines social cohesion, fosters discrimination, creates divisions, and can lay the foundation for violence." |                   
| Level 2               | Content that contains positive characterization or protection of identity groups. Slurs in research papers, dictionaries, or media with a direct quote, and general hate speech that targets objects, individuals, or groups. Content that displays discrimination, stereotypes, and prejudiced, judgmental, or opinionated views or attitudes related to hate speech in general or targeting identity groups. Media coverage, and limited hate speech or depictions of negative sentiment in fictional contexts (for example, gaming, movies, literature).  |
| Level 4          | Content that contains insults, bullying, intimidation, dehumanization, or derogation of individuals or groups. Language that mocks and imitates identity group attributes, describing individuals or groups as inferior or deficient, or denying or denigrating their existence. Texts that deny historical, well-documented, and violent events such as the Holocaust, slavery, or colonization. | 
| Level 6           | Content that contains hate speech as propaganda threatening or calling for violence against identity groups; incendiary, offensive, and vulgar language targeting specific individuals or identity groups; or claims of superiority to justify discrimination, segregation, or exclusion. Texts that contain any form of glorification of Nazi and SS symbolism, KKK, and Confederate flag outside of historical, educational, or artistic settings. Content that radicalizes, recruits, or incites people to join extremist efforts or spread hate speech. Texts that display hate crime preparation, praise, and glorification of violence against identity groups or praise, glorify, and endorse genocide.  |  

### Sexual category severity levels

| Level                  | Description               | 
| ------------------- | -------------------- | 
| Level 0                 | Content that is safe but may contain sexual-related terms used in generic and safe contexts, like education and media. For example: "The government is currently conducting a review of the Criminal Law (Sexual Offenses) Act 2017, and this time, sex workers want their voices to be heard."|                   
| Level 2                | Mentions of sexual anatomy or sex scenes in fictional and artistic contexts with limited or non-explicit depictions and nudity scenes. Medical prescriptions and diagnoses. Content that expresses prejudiced, judgmental, or opinionated views on sex-related topics. Personal experiences, sexual problems, and traumas with some graphic content including coping mechanisms and resources. |
| Level 4          | Content that describes sexual arousal and activity in explicit and graphic terms, including fantasies about sex and sexual abuse. Mentions of sexual stimulation and masturbation. Pornography limited to business and prostitution or escorting as a career, without sex scenes. Advertisement for adult products such as sex toys. Personal experiences and descriptions related to sexual, erotic, or tantric massages, strip clubs, erotic shows, or BDSM attributes and practices. | 
| Level 6              | Content that offers or asks for adult commercial sexual services, fetish, or crude content; non-consensual situations of voyeurism, sex control, or BDSM activities; sexual violence and assault, rape, or abuse in graphic details. Content that glorifies or endorses sex trafficking. Any depiction of child sexual abuse material (CSAM) including any explicit or potential reference to underage sex, sexual abuse, child grooming, child abuse, and other child exploitation. Explicit or potential references to incest, zoophilia, or necrophilia. Human sex trafficking recruitment, including victim manipulation. |  

### Violence category severity levels

| Level                  | Description          | 
| ----------------------------- | ----------------------------- | 
| Level 0                 | Content is safe but may contain terms related to violence used in generic and safe contexts like education, media, and medicine. For example: "Bruises, fractures, swollen tissue, and many other signs of physical harm." |                   
| Level 2                | Content in fictional contexts (for example gaming, literature, arts) that depict violent or graphic scenes without glorification, endorsement, or malicious intent. Content that contains personal experiences of violence (without violent intent) or biased, prejudiced, judgmental, or opinionated views on violence. Mentions of violent acts and death at low intensity.  |
| Level 4          | Content that contains graphic depictions of violence and death at medium intensity as well as fantasies about violent acts or threats. Texts that put the victim at fault or depict perpetrators in a positive light. Historical references to genocide and the Holocaust without endorsement or glorification. References to known mass shooting events without endorsement or glorification. References to terrorist and violent extremist groups and events without endorsement or glorification. Texts that seek advice or recommendation or texts that provide instructions on how to perform a violent act against an animal, an individual, a group of individuals, or an object or infrastructure that can result in individual or mass harm. Bullying and intimidation. | 
| Level 6     | Content that contains terrorist and violent extremist propaganda and violent ideology on the internet; content that describes, praises, supports, endorses, or glorifies killings as part of terroristic activity; aid offers to terrorist organizations or causes. Texts that seek instructions on affiliation with terrorist and violent extremist groups. Instructions on how to recruit followers, influence people toward a terrorist cause or extremist ideology, adopt radical views, or provide training on how terrorist and violent extremist groups operate. Texts that plan and coordinate attacks on individuals or groups of people, including shooting events, use of explosives, and any form of violent attacks that can result in individual or mass harm. Content that praises and glorifies perpetrators of violent acts, including serial killers, mass murderers, and spree killers. |  

### Self-harm category severity levels

| Level                  | Description            | 
| ----------------------------- | ----------------------------- | 
| Level 0                 | Content that is safe but may contain terms related to self-harm used in generic and safe contexts like official statistics, education, media, and medicine. For example: "If you are feeling suicidal or self-harmful, please call the National Suicide Prevention Lifeline at 1-800-273-8255 or text HOME to 741741 to connect with a trained crisis counselor."|                   
| Level 2                | Content that contains references to characters planning or committing suicide in a fictional context like literature or movies. Content with depictions of self-harm acts or suicide at low intensity. Personal biased, prejudiced, judgmental or opinionated views on self-harm. Associations with eating disorders; seeking or providing instructions for drastic and unhealthy weight loss. Personal experiences related to self-harm, including seeking professional help. |
| Level 4          | Content that mocks victims or survivors of self-harm such as eating disorders or suicide. Self-injury presented as a solution to a problem, or fantasies, desires, wishes or personal experiences about self-harm/suicide. Texts that seek or give advice, instructions or recommendations on how to perform self-harm. Bullying and intimidation that incites and promotes self-harm acts.    | 
| Level 6              | Content that seeks advice or provides instructions and methods on how to engage in self-harm that leads to death. Instructions and methods on how to commit suicide; glorification and endorsement of suicide, or other severe types of self-harm.     | 

## Next steps

Follow a quickstart to get started using Content Safety in your application.

> [!div class="nextstepaction"]
> [Content Safety quickstart](../quickstart-text.md)