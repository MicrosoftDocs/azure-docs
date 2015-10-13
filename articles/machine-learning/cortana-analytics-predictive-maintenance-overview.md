<properties
	pageTitle="Overview of a predictive maintenance solution using Microsoft Cortana Analytics | Microsoft Azure"
	description="Overview of a Microsoft Cortana Analytics solution that for predictive maintenance."
	keywords="solution accelerator;cortana analytics;predictive maintenance"
	services="cortana-analytics"
	documentationCenter=""
	authors="garyericson"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="cortana-analytics"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/12/2015"
	ms.author="garye" />

# Overview of a predictive maintenance solution using Microsoft Cortana Analytics

## Executive Summary  
Predictive maintenance is one of the most demanded applications of
predictive analytics with unarguable benefits including tremendous
amount of cost savings. This playbook aims at providing a reference for
predictive maintenance solutions with the emphasis on major use cases.
It is prepared to give the reader an understanding of the most common
business scenarios of predictive maintenance, challenges of qualifying
business problems for such solutions, data required to solve these
business problems, predictive modeling techniques to build solutions
using such data and best practices with sample solution architectures.
It also describes the specifics of the predictive models developed such
as feature engineering, model development and performance evaluation. In
essence, this playbook brings together the business and analytical
guidelines needed for a successful development and deployment of
predictive maintenance solutions. These guidelines are prepared to help
the audience create an initial solution using Cortana Analytics Suite
and specifically Azure Machine Learning as a starting point in their
long term predictive maintenance strategy. The documentation regarding
Cortana Analytics Suite and Azure Machine Learning can be found in
[Cortana
Analytics](http://www.microsoft.com/server-cloud/cortana-analytics-suite/overview.aspx)
and [Azure Machine
Learning](http://azure.microsoft.com/services/machine-learning/)
pages.

## Playbook Overview and Target Audience  
This playbook is organized in a way to provide benefit to both technical
and non-technical audience with varying backgrounds and interests in
predictive maintenance space. The playbook covers both high level
aspects of the different types of predictive maintenance solutions and
details of how to implement them. The content is balanced in a way to
cater both to the audience who are only interested in understanding the
solution space and the type of applications as well as those who are
looking to implement these solutions and are hence interested in the
technical details.

Majority of the content in this playbook does not assume prior data
science knowledge or expertise. However, some parts of the playbook will
require somewhat familiarity with data science concepts to be able to
follow implementation details. Introductory level data science skills
are required to fully benefit from the material in those sections.

The first half of the playbook covers an introduction to predictive
maintenance applications, how to qualify a predictive maintenance
solution, a collection of common use cases with the details of the
business problem, the data surrounding these use cases and the business
benefits of implementing these predictive maintenance solutions. These
sections don’t require any technical knowledge in the predictive
analytics domain.

In the second half of the playbook, we cover the types of predictive
modeling techniques for predictive maintenance applications and how to
implement these models through examples from the use cases outlined in
the first half of the playbook. This is illustrated by going through the
steps of data preprocessing such as data labeling and feature
engineering, model decision, training/testing and performance evaluation
best practices. These sections are suitable for technical audience.
