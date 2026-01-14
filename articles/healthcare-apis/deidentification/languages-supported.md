---
title: Languages supported by the Azure Health Data Service De-identification service
description: "Understand on which languages the De-identification service can TAG, REDACT, and SURROGATE PHI"
author: leakassab
ms.author: leakassab
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: tutorial
ms.date: 10/23/2025

#customer intent: As customer, I want to know what languages the De-identification service can tag, redact and surrogate PHI on
---

# Languages supported by the Azure Health Data Services De-identification service

The following table lists the languages the De-identification service can TAG, REDACT, and SURROGATE PHI on for unstructured textual data:

|Language| Locale | Language-locale pair| State |
|:-----|:----:|:-----|:----:|
|English| United States| en-US  | Generally Available |
|English   |United Kingdom| en-GB | Preview|
|French  | Canada| fr-CA | Preview|
|French  |France | fr-FR | Preview|
|German  | Germany| de-DE  | Preview |
|Spanish  | United States| es-US  | Preview |

### Example inputs & outputs

| Operation  | Language-Locale pair | Input                                                                                                                                                                    | Output                                                                                                               |
|-------------|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| Redaction   | en-US               | `Kimberly Brown is a 34 y.o. female presenting with bilateral eye discomfort. Last seen by her PCP 2/6/2025 Dr. Orlo at Contoso Clinics Downtown Bellevue PCP.`           | `[patient] is a [age] y.o. female presenting with bilateral eye discomfort. Last seen by her PCP [date] [doctor] at [hospital] PCP.` |
| Redaction   | fr-CA               | `André, âgé de 45 ans, a été admis à l'Hôpital de Laval le 23 avril 2025 après une évaluation avec Dr Jeanne Dubuc.`                                         | `[patient], âgé de [age], a été admis à l'[hospital] le [date] après une évaluation avec [doctor].`    |
| Redaction   | de-DE               | `Hanna Petersen wurde am 12. Juli ins Universitätsklinikum Heidelberg aufgenommen`                                         | `Eileen Westphal wurde am 2. Juli ins Evangelisches Krankenhaus Hannover aufgenommen`    |
| Surrogation   | fr-FR               | `La patiente Amélie Leroux, âgée de 96 ans, a développé une pneumonie le 24 avril et a été hospitalisée le 27 avril`                                         | `La patiente Élise Clement, âgée de 90 ans, a développé une pneumonie le 28 mai et a été hospitalisée le 31 mai`    |
| Surrogation   | es-US               | `María López fue atendida por el Dr. Andrew Chen en el Hospital St. Mary’s en Navidad y tuvo una cita de seguimiento el 10 de enero`                                         | `Ariana Morison fue atendida por el Dr. James Pardo en el Ochsner Medical Center en Nochevieja y tuvo una cita de seguimiento el 12 de febrero`    |


