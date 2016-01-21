<properties
	pageTitle="Technical guide to the Cortana Analytics Solution Template for demand forecast in energy and other businesses | Microsoft Azure"
	description="A technical guide to the Solution Template with Microsoft Cortana Analytics for demand forecast in energy."
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
	ms.date="11/24/2015"
	ms.author="garye" />

# Technical guide to the Cortana Analytics Solution Template for demand forecast in energy and other businesses

## **Overview**

Solution Templates are designed to accelerate the process of building an
E2E demo on top of Cortana Analytics Suite. A deployed template will
provision your subscription with necessary Cortana Analytics components
and build the relationships between them. It also seeds the data
pipeline with sample data generated from a data simulation application which you will download and install on
your local machine after you deploy the solution template.The data generated from the simulator will hydrate the
data pipeline and start generating machine learning predictions which can
then be visualized on the Power BI dashboard. The deployment process will guide you through several steps to set up your solution credentials. Make sure you record these credentials such as solution name, username, and password you provide during the deployment.

The goal of this document is to explain the reference architecture and
different components provisioned in your subscription as part of this
solution template. The document also talks about how to replace the
sample data with real data of your own to be able to see insights and
predictions from your own data. Additionally, the document discusses the
parts of the Solution Template that would need to be modified if you
wanted to customize the solution with your own data. Instructions on how
to build the Power BI dashboard for this Solution Template are provided
at the end.

>[AZURE.TIP] You can download and print a [PDF version of this document](http://download.microsoft.com/download/F/4/D/F4D7D208-D080-42ED-8813-6030D23329E9/cortana-analytics-technical-guide-predictive-maintenance.pdf).



## **Cost Estimation Tools**

The following two tools are available to help you better understand the
total costs involved in running the Predictive Maintenance for Aerospace
Solution Template in your subscription:

-   [Microsoft Azure Cost Estimator
    Tool (online)](https://azure.microsoft.com/pricing/calculator/)

-   [Microsoft Azure Cost Estimator
    Tool (desktop)](http://www.microsoft.com/download/details.aspx?id=43376)
