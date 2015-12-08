<properties 
	pageTitle="Stream Analytics and Machine Learning integration tuorial | Microsoft Azure" 
	description="How to leverage UDF and machine learning in stream analytics"
	keywords="data input, streaming data"
	documentationCenter=""
	services="stream-analytics"
	authors="jeffstokes72" 
	manager="paulettm" 
	editor="cgronlun"
/>

<tags 
	ms.service="stream-analytics" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-services" 
	ms.date="12/08/2015" 
	ms.author="jeffstok"
/>

# Introduction to Stream Analytics and Machine Learning integration #

This tutorial will help you quickly setup and try out Azure Stream Analytics (ASA) and Azure Machine Learning (AML) integration. At the end of this tutorial,  you will have an ASA job which reads data from Azure Blob Storage (Blob Storage for short) and outputs the data back into the same Blob Storage. Specifically, it will read the data from one container and will output into a different container. To demonstrate the value of ASA and AML integration, during the processing, ASA job will modify the input values by using a simple AML model, such that f(“foo”) = “foo Hello World!”. 