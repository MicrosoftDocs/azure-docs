<properties
	pageTitle="Irregular sign in activity"
	description="A report that includes sign ins that have been identified as anomalous by our machine learning algorithms.""
	services="active-directory"
	documentationCenter=""
	authors="kenhoff"
	manager="ilanas"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/13/2015"
	ms.author="kenhoff"/>

# Irregular sign in activity

| Description        | Report location |
| :-------------     | :-------        |
| <p>This report includes sign ins that have been identified as “anomalous” by our machine learning algorithms. Reasons for marking a sign in attempt as irregular include unexpected sign in locations, time of day and locations or a combination of these. This may indicate that a hacker has been trying to sign in using this account. The machine learning algorithm classifies events as “anomalous” or “suspicious”, where “suspicious” indicates a higher likelihood of a security breach.</p><p>Results from this report will show you these sign ins, together with the classification, location and a timestamp associated with each sign in.</p><p>We will send an email notification to the global admins if we encounter 10 or more anomalous sign in events within a span of 30 days or less. Please be sure to include aad-alerts-noreply@mail.windowsazure.com in your safe senders list.</p> | Directory > Reports tab |
