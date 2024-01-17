
---
title: "Severity level tables - image"
description: Content safety severity level definition tables, for image content, four-level
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.topic: include
ms.date: 12/18/2023
ms.author: pafarley
---


## Image content

#### [Warning](#tab/warning)

> [!WARNING]
> The **Severity definitions** tab in this document contains examples of harmful content that may be disturbing to some readers.  

#### [Severity definitions](#tab/definitions)

### Hate and fairness severity levels

| **Severity Level**   | **Description**   | **Image example**   |
| --- | --- | --- |
| Level 0 – Safe  | Content is safe but may contain hate and fairness related imagery with no sentiment or neutral sentiments in non-discriminatory non-offensive ways in the following contexts or those similar to:<ul><li>Journalistic</li><li>Historical</li><li>Medical</li><li>Legal</li><li>Educational</li><li>Geographical</li></ul> | Non confederate flags, e.g. Flags of countries or states that feature crosses<ul><li>An image of the Union Jack flag of Great Britain</li></ul>Depiction of emancipation of enslaved people in the US in historical photos  |
| Level 2 - Low  | Content that contains either positive sentiments, false positive sentiments, or negative, biased sentiments differentiating identity groups from others. This content is intended to trigger an emotional response. This includes:<ul><li>Protection</li><li>Nazi symbolism, the confederate flag, Ku Klux Klan symbolism</li><li>Stereotyping</li><li>Employment discrimination</li></ul> | Representations of 'No Hate Speech' movement</br></br>Representations of deprioritized job candidates such as candidates with disabilities in interview settings |
| Level 4 - Medium  | Content that contains negative sentiment action towards identity groups and others that leads to the promotion of action against an identity groups and sentiments of superiority. This includes:<ul><li>Insult, isolation, mocking</li><li>Nazi flag, confederate flag, and LGBTQIA+ variations and merchandise</li></ul> | Imagery that promotes social avoidance of [identity groups]</br></br>Imagery that depicts the racial improvement theory and eugenics |
| Level 6 – High   | Content that contains negative sentiment and hate speech towards identity groups leading to hate speech generation or hate crimes. This includes:<ul><li>Racism</li><li>Attacks on LGBTQIA+</li><li>Disablism</li><li>Sex-based discrimination</li><li>Glorified Nazi symbolism, Confederate flag, Ku Klux Klan symbolism</li><li>Violent confederate flag</li></ul> | Antisemitic imagery</br></br>Imagery depicting the "Southern Cross" that features a blue saltire (diagonal cross) with affiliation of obvious violence (e.g. guns in display/use) |


### Sexual severity levels

| **Severity Level**   | **Description**   | **Image example**   |
| --- | --- | --- |
| Level 0 - Safe | Content is safe but contains sexually related imagery used in a general sense. This includes:<ul><li>Family and romantic relationships</li><li>Non-sexual nudity</li><li>Clothing</li><li>Common objects</li><li>Non-sexual pose or activity</li><li>Animal mating</li><li>Sexual wellness</li></ul> | Representations of hugging or making non-sexual physical contact</br></br>Representations depicting physical display of affection such as kissing without tongue and without nudity |
| Level 2 – Low   | Content that contains sexually suggestive behaviors or acts. This includes:<ul><li>Personal experiences</li><li>Fashion modeling</li><li>Nudity in artwork</li><li>Body art</li><li>Racy display</li></ul> | Depictions of people |
| Level 4 - Medium  | Content that contains commercial and amateur erotic and/or pornographic content without visual photographic penetration and nude or semi-nude participants involved in sexual scenes meant to be sexually arousing. This includes:<ul><li>Sexual modeling</li><li>Soft nudity in artwork</li><li>Sex jobs or shops</li><li>Obscured sexual activity</li><li>Porn production backstage</li><li>Pole dancing</li></ul> | Depictions of intercourse that may be partially occluded but still clearly present in the image |
| Level 6 - High  | Content that contains explicit detailed depictions of sexual organs and sexual acts, including illegal acts. This includes:<ul><li>Amateur soft-core and hard-core pornography</li><li>Sexual solicitation</li><li>Voyeurism</li><li>Sex in artwork</li><li>BDSM with no consent or Rape</li><li>Child Sexual Exploitation and Abuse</li><li>Child grooming</li><li>Incest</li></ul> | Depictions of engagements in sexual activities with animals or corpses |


### Violence severity levels

| **Severity Level**   | **Description**   | **Image example**   |
| --- | --- | --- |
| Level 0 - Safe  | Content is safe but contains violence related imagery used in a general sense. This includes:<ul><li>Sleeping or laying pose</li><li>Common objects</li><li>Non-violent activity</li><li>Ropes not as a noose</li><li>Bladed tools in use in kitchen/sewing</li><li>Wounds, scars and surgical treatment</li><li>Hunting and shooting sport</li><li>Toy and pretend guns</li><li>Combat practice</li><li>Object damage and vandalism</li><li>Non-branded terrorist symbolism</li></ul> | Depictions of non-realistic weapons and bladed tools   |
| Level 2 – Low   | Content that contains violence related imagery and acts in real world or fictional contexts with low gore. This includes:<ul><li>Guns, weapons, and bladed tools in display and in use</li><li>Non-realistic corpse</li><li>Non-realistic violence</li><li>Animated weapons</li><li>Light injury and personal experience</li><li>Ropes as a noose</li><li>Death in historical, educational, or funerary settings</li><li>Non-realistic terrorist symbolism</li><li>Bullfighting</li></ul> | Depictions of ISIS/al-Qaeda flags  |
| Level 4 - Medium  | Content that contains moderate graphic violence and violent acts aimed at an identified target. This includes:<ul><li>Autopsy</li><li>Crime or death scene</li><li>Animal death (natural or hunted), animal sacrifice, animal abuse</li><li>Enslavement</li><li>Genocide and mass killings in historical, educational settings</li><li>Slaughterhouse</li><li>Domestic violence and physical abuse</li><li>Bullying</li><li>Guns and weapons in use against a target</li></ul> | Depictions of the use of force and coercion to aggressively dominate or intimidate an individual   |
| Level 6 - High  | Content that contains explicit detailed depictions of violence and violent acts in high gore. This includes:<ul><li>Graphic injuries and death</li><li>Dismemberment, decapitation, burning alive</li><li>Corpse decomposition</li><li>Terrorism, Terrorist groups, and flags</li><li>Forced labor and servitude, forced medical procedure</li><li>Stalking</li><li>Corpse in terrorism and war crime</li><li>Shooting event</li><li>Other extremism</li></ul> | Depictions of death when performed by terrorist groups identifiable by ISIS flags and symbols  |

### Self-harm severity levels

| **Severity Level**   | **Description**   | **Image example**   |
| --- | --- | --- |
| Level 0 - Safe  | Content is safe but contains self-harm related imagery used in a general sense. This includes:<ul><li>Low body fat</li><li>Non-self-harm act</li><li>Accidental body injury</li></ul> | Depictions of jumping with a parachute out of a plane   |
| Level 2  – Low   | Content that contains self-harm related imagery and acts in real world or fictional contexts with low gore. This includes:<ul><li>Scars</li><li>Self-harm injury in recovery</li><li>Non-realistic self-harm</li><li>Emaciated individuals or animals</li></ul> | Representations of self-harm related acts, tools, injury and emotional state   |
| Level 4 - Medium  | Content that contains moderate graphic imagery related to self-harm and suicide. This includes:<ul><li>Autopsy</li><li>Crime or death scene</li><li>Bullying</li></ul> | Representations of the use of force and coercion to aggressively dominate or intimidate an individual into self-harm  |
| Level 6 - High  | Content that contains explicit detailed depictions of self-harm and suicide in high gore. This includes:<ul><li>Imminent self-harm act</li><li>Self-harm acts</li><li>Suicide</li></ul> | Depictions of intentional suicide, where a person has committed suicide by jumping off a tall building  |

---