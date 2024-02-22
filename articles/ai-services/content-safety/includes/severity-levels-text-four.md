---
title: "Severity level tables - Text, four-level"
description: Content safety severity level definition tables for text, four-level
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.topic: include
ms.date: 01/17/2024
ms.author: pafarley
---

## Text content 

#### [Warning](#tab/warning)

> [!WARNING]
> The **Severity definitions** tab in this document contains examples of harmful content that may be disturbing to some readers.  
#### [Severity definitions](#tab/definitions)

### Hate and fairness severity levels

| **Severity Level**   | **Description**   | **Example Text**   |
| --- | --- | --- |
| Safe | Content is safe but may contain hate and fairness related terms used in generic and safe contexts such as: <ul><li>Education</li><li>Media</li><li>Official statistics</li><li>History</li><li>Medicine</li><li>Science</li><li>Other similar contexts</li></ul> | `"Black people should not be killed by police or mistreated just because of their skin color."`  |
| Low  | Content that contains positive characterization or protection of the Identity groups, displays discrimination, stereotypes and prejudiced, judgmental, or opinionated views or attitudes related to hate speech or targeting identity groups. This includes:<ul><li>Slurs in research papers, dictionaries, or media with a direct quote</li><li>General hate speech that targets objects, individuals or groups</li><li>Limited hate speech or depictions of negative sentiment in fictional contexts (for example, gaming, movies, literature) </li></ul> | `"I don't like [identity group] because they are all so aggressive. They attacked us over and over again for no reason at all."` |
| Medium | Content that contains insults, bullying, intimidation, de-humanization or derogation of individuals or groups. This includes: <ul><li>Language that is mocking and imitating Identity groups attributes </li> <li>Describing individuals or groups as inferior or deficient  </li> <li>Denying or demeaning identity groups existence  </li> <li>Texts that deny historical, well-documented, and violent events such as Holocaust, enslavement, or colonization </li></ul> | `"The [real world event] is a fraud. What we've discovered is that sources have been lying about the number of victims. Here is proof."`  |
| High  | Content that contains hate speech as propaganda threatening or calling for violence against Identity groups, radicalizes, recruits or incites people to join extremist efforts or spread hate speech. This includes: <ul><li>Incendiary, offensive, and vulgar language targeting specific individuals or identity groups </li><li>Claims of superiority to justify discrimination, segregation, or exclusion </li><li>Texts that contain any form of glorification of Nazi and SS symbolism, KKK and the confederate flag outside of historical, educational, or artistic settings </li><li>Texts that display hate crime preparation, praise and glorification of violence against Identity groups, or that praise, glorify, or endorse genocide </li></ul> | `"Millions of [identity group] were wiped out because they were the inferior race. Murdering them continues to be right and honorable because…"`  |

### Sexual severity levels

| **Severity Level**   | **Description**   | **Example Text**   |
| --- | --- | --- |
| Safe  | Content is safe but may contain sexually related terms used in generic and safe contexts such as:   <ul><li>Education </li><li>Media </li><li>Official statistics </li><li>History</li><li> Medicine </li><li>Science</li><li> Mentions of family or romantic relations </li></ul> | `"Fewer young adults are having sex than in previous generations."` |
| Low  | Content that expresses prejudiced, judgmental or opinionated views on sexually related topics or mentions sexually related terms in fictional or real-world experiences that are not extremely graphic. This includes:    <ul><li> Mentions of sexual anatomy or sex scenes in fictional and artistic contexts  </li><li>Medical prescriptions and diagnosis</li><li>  Personal experiences, sexual problems and traumas with some graphic content including coping mechanisms and resources </li></ul> | `"We made out for a while, and he started to feel me up. I felt a bulge in his pants."`   |
| Medium  | Content that describes sexual arousal and activity in explicit and graphic terms, includes fantasies about sex and sexual abuse. This includes:   <ul><li>Mentions of sexual stimulation and masturbation </li><li>Pornography limited to business and prostitution, escort, etc. as careers without sex scenes </li><li>Advertisement for adult products such as sex toys </li><li>Personal experiences and descriptions related to sexual, erotic or tantric massages, strip clubs, erotic shows, BDSM attributes and practices </li></ul> | `"We both climaxed at the same time."`      |
| Level 7  | Content describing solicitation of sexual commercial services, containing detailed descriptions of sexual activity, violent sexual abuse and rape, and non-consensual power exchanges, abuse, and voyeurism. This also includes content that is used to promote, endorse, or glorify extreme or illegal sexual acts. This includes:  </li><li> Any depiction of Child Sexual Abuse Material (CSAM) including any explicit or potential reference to underage sex </li><li>Child grooming, child abuse, and other child exploitation </li><li>Explicit or potential references to incest, zoophilia, necrophilia, etc.  </li><li>Human sex trafficking recruitment, including victim manipulation  </li></ul> | `"I was abused as a child by my uncle and I liked it. Nowadays, I make money by producing child pornography with my neighbor’s 6 year old son."`    |


### Violence severity levels

| **Severity Level**   | **Description**   | **Example Text**   |
| --- | --- | --- |
| Safe  | Content is safe but may contain terms related to violence used in generic and safe contexts such as:<ul><li>Education </li><li>Media </li><li>Official statistics </li><li>History </li><li>Medicine </li><li>Science </li><li>Common objects when not used as weapons </li><li>Hunting or shooting sport and guns technical specifications </li></ul> | `"Carnivores such as lions and tigers are prone to killing one another. Death occurs at the paws, claws, jaws, or tusks that might fatally gore one another during fights."`  |
| Low  | Content in fictional contexts (for example, gaming, literature, arts) that depict violent or graphic scenes without glorification, endorsement or mal-intent. This includes: <ul><li>Personal experiences of violence (without violent intent) </li><li>Biased, prejudiced, judgmental, or opinionated views on violence </li><li>Mentions of violent acts and death at low intensity </li></ul> | `"Some people just need to be slapped."`  |
| Medium  | Content that contains graphic depictions of violence and death at medium intensity as well as fantasies about violent acts or threats. This includes: <ul><li>Texts that put the victim at fault or depict perpetrators in a positive light </li><li>Historical references to genocide and the Holocaust without endorsement or glorification </li><li>References to known mass shootings without endorsement or glorification </li><li>References to terrorist and violent extremist groups and events without endorsement or glorification </li><li>Texts that seek advice or recommendation or texts that provide instructions on how to perform a violent act against an animal, an individual, a group of individuals or an object or infrastructure that can result in individual or mass harm </li><li>Bullying and intimidation </li></ul> | `"Go to another state or another city and kill any stranger; for example, shoot them with a silencer gun. Since you have not any connection with him, you will not get caught."`  |
| High  | Content that contains terrorist or violent extremist propaganda and violent ideology on the Internet that describes, praises, supports, endorses or glorifies killings as part of terroristic activity, aids offers to terrorist organizations or causes. This includes: <ul><li>Texts that seek instructions on affiliation with terrorist and violent extremist groups </li><li>Texts that provide instructions on how to recruit followers, influence people toward a terrorist cause or extremist ideology, adopt radical views or provide training on how terrorist and violent extremist groups operate, or provide information on their leaders and members </li><li> Texts that plan and coordinate attacks on individuals or groups of people, including shooting events, use of bombs and explosives on civilian infrastructure, or bladed weapon attacks when performed by non-combatants or non-terrorists </li><li> Content that references forced labor including children, domestic servitude, stalking, and forced medical procedures </li></ul> | `"Let's call and threaten to explode the hospital during the weekend. I've got the explosives ready, and will have them installed tonight."`  |


### Self-harm severity levels

| **Severity Level**   | **Description**   | **Example Text**   |
| --- | --- | --- |
| Safe | Content is safe but may contain terms related to self-harm used in generic and safe contexts such as: <ul><li>Official statistics </li><li>Education </li><li>Media </li><li>Medical </li><li>Actions that describe accidental self-harm, first aid tips, etc. </li></ul> | `"Binging and purging may be a warning sign for people with a history of extreme weight loss."`  |
| Low  | Content that contains references to characters planning or committing suicide in a fictional context (for example, literature, movies) or contains depictions of self-harm acts or suicide at low intensity. This includes: <ul><li>Personal biased, prejudiced, judgmental or opinionated views on self-harm </li><li>Associations with eating disorders, seeking or providing instructions for drastic and unhealthy weight loss </li><li>Personal experiences related to self-harm, including seeking professional help </li></ul> | `"I'm really struggling with self-loathing and thoughts of self-harm to relieve my distress after my friend took his own life last month. Please can someone give me any useful advice?"`  |
| Medium  | Content that mocks victims or survivors of self-harm such as eating disorders or suicide, as well as bullying and intimidation that incites and promotes self-harm acts. This includes: <ul><li>Self-injury presented as a solution to a problem </li><li>Fantasies, desire, wishes or personal experiences about self-harm/suicide </li><li>Texts that seek or give advice, instructions or recommendation on how to perform self-harm </li><li>Bullying and intimidation that incites and promotes self-harm acts </li></ul> | `"Go kill yourself, you are worthless."`  |
| High | Content that includes research for advice or provides instructions and methods on how to engage in self-harm that leads to death or how to commit suicide as well as glorification and endorsement of suicide, or other severe types of self-harm. This includes: <ul><li>Texts that instruct how to write a goodbye message to your family </li><li>Self-decapitation </li><li>Burning alive </li></ul> | `"Get a shotgun and blow your brains out. It won't even hurt. And you'll be remembered for ages, like Kurt Cobain or Ernest Hemingway. There's nothing bad about suicide. Actually it's noble."`  |

---