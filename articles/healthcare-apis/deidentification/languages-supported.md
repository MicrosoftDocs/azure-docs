---
title: Language Support for Azure Health Data Services De-identification Service
description: Use the de-identification service in English, French, German, and Spanish. See examples of inputs and outputs.
author: leakassab
ms.author: leakassab
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: concept-article
ms.date: 10/23/2025

#customer intent: As a user of this service, I want to know what languages I can use for de-identification of patient data, so that I can improve privacy.
---

# Language support for the Azure Health Data Services de-identification service

The Azure Health Data Services de-identification service currently works on four languages, and includes six language-locale pairings. To tag, redact, or replace unstructured textual data for purposes of de-identification, you can use the languages listed in the following table.

|Language|Locale        |Language-locale pair|Availability         |
|:-------|:-------------|:-------------------|:--------------------|
|English |United States |en-US               |Generally available  |
|English |United Kingdom|en-GB               |Preview              |
|French  |Canada        |fr-CA               |Preview              |
|French  |France        |fr-FR               |Preview              |
|German  |Germany       |de-DE               |Preview              |
|Spanish |United States |es-US               |Preview              |

The following table provides examples of inputs and outputs you can expect, according to the type of de-identification operation you want to do (such as redaction or surrogation).

| Operation   | Language-locale pair | Input                                                                                                                                                          | Output                                                                                                                                          |
|-------------|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| Redaction   | en-US                | `Kimberly Brown is a 34 y.o. female presenting with bilateral eye discomfort. Last seen by her PCP 2/6/2025 Dr. Orlo at Contoso Clinics Downtown Bellevue PCP` | `[patient] is a [age] y.o. female presenting with bilateral eye discomfort. Last seen by her PCP [date] [doctor] at [hospital] PCP.`            |
| Redaction   | fr-CA                | `André, âgé de 45 ans, a été admis à l'Hôpital de Laval le 23 avril 2025 après une évaluation avec Dr Jeanne Dubuc.`                                           | `[patient], âgé de [age], a été admis à l'[hospital] le [date] après une évaluation avec [doctor].`                                             |
| Redaction   | de-DE                | `Hanna Petersen wurde am 12. Juli ins Universitätsklinikum Heidelberg aufgenommen`                                                                             | `Eileen Westphal wurde am 2. Juli ins Evangelisches Krankenhaus Hannover aufgenommen`                                                           |
| Surrogation | fr-FR                | `La patiente Amélie Leroux, âgée de 96 ans, a développé une pneumonie le 24 avril et a été hospitalisée le 27 avril`                                           | `La patiente Élise Clement, âgée de 90 ans, a développé une pneumonie le 28 mai et a été hospitalisée le 31 mai`                                |
| Surrogation | es-US                | `María López fue atendida por el Dr. Andrew Chen en el Hospital St. Mary’s en Navidad y tuvo una cita de seguimiento el 10 de enero`                           | `Ariana Morison fue atendida por el Dr. James Pardo en el Ochsner Medical Center en Nochevieja y tuvo una cita de seguimiento el 12 de febrero` |
