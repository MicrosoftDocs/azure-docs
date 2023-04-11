---
title: Project Health Insights request info  
description: this article describes the required properties to interact with Project Health Insights
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 02/17/2023
ms.author: behoorne
---

# Project Health Insights request info  

This page describes the request models and parameters that are used to interact with Project Health Insights service.

## Request
The generic part of Project Health Insights request, common to all models.

Name    |Required|Type           |Description                                                         
--------|--------|---------------|--------------------------------------------------------------------
`patients`|yes     |Patient[]|The list of patients, including their clinical information and data.


## Patient
A patient record, including their clinical information and data.

Name|Required|Type           |Description                                                                                      
----|--------|---------------|-------------------------------------------------------------------------------------------------
`id`  |yes     |string         |A given identifier for the patient. Has to be unique across all patients in a single request.    
`info`|no      |PatientInfo    |Patient structured information, including demographics and known structured clinical information.
`data`|no      |PatientDocument|Patient unstructured clinical data, given as documents. 



## PatientInfo
Patient structured information, including demographics and known structured clinical information.

Name        |Required|Type               |Description                  
------------|--------|-------------------|-----------------------------
`gender`      |no      |string             |[ female, male, unspecified ]
`birthDate`   |no      |string             |The patient's date of birth. 
`clinicalInfo`|no      |ClinicalCodeElement|A piece of clinical information, expressed as a code in a clinical coding system.                             

## ClinicalCodeElement
A piece of clinical information, expressed as a code in a clinical coding system.

Name  |Required|Type  |Description                                                              
------|--------|------|-------------------------------------------------------------------------
`system`|yes     |string|The clinical coding system, for example ICD-10, SNOMED-CT, UMLS.                
`code`  |yes     |string|The code within the given clinical coding system.                        
`name`  |no      |string|The name of this coded concept in the coding system.                     
`value` |no      |string|A value associated with the code within the given clinical coding system.


## PatientDocument
A clinical unstructured document related to a patient.

Name           |Required|Type           |Description                                                                                                
---------------|--------|---------------|-----------------------------------------------------------------------------------------------------------
`type `          |yes     |string         |[ note, fhirBundle, dicom, genomicSequencing ]                                                             
`clinicalType`   |no      |string         |[ consultation, dischargeSummary, historyAndPhysical, procedure, progress, imaging, laboratory, pathology ]
`id`            |yes     |string         |A given identifier for the document. Has to be unique across all documents for a single patient.           
`language`       |no      |string         |A 2 letter ISO 639-1 representation of the language of the document.                                       
`createdDateTime`|no      |string         |The date and time when the document was created.                                                           
`content`        |yes     |DocumentContent|The content of the patient document.                                                                       

## DocumentContent
The content of the patient document.

Name      |Required|Type  |Description                                                                                                                                                                                                                    
----------|--------|------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`sourceType`|yes     |string|The type of the content's source.<br>If the source type is 'inline', the content is given as a string (for instance, text).<br>If the source type is 'reference', the content is given as a URI.[ inline, reference ]
`value`     |yes     |string|The content of the document, given either inline (as a string) or as a reference (URI).                                                                                                                  

## Next steps

To get started using the service, you can 

>[!div class="nextstepaction"]
> [Deploy the service via the portal](deploy-portal.md) 