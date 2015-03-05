<properties 
   pageTitle="BizTalk B2B - Creation of Trading Partner Agreements" 
   description="This topic covers creation of Trading Partner Agreements" 
   services="app-service-logic" 
   documentationCenter=".net,nodejs,java" 
   authors="harishkragarwal" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="biztalk-services"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="02/27/2015"
   ms.author="hariag"/>

Trading partners are the entities involved in B2B (Business-to-Business) communications. When two trading partners (also simply referred to as partners here) partake in establishing a relationship between them then it is referred to as an Agreement. The agreement defined is based on the communication the two partners wish to achieve and hence is protocol or transport specific. The various B2B protocols and transports supported by Azure App Services currently are:

1. AS2 (Applicability Statement 2)
2. EDIFACT (United Nations/Electronic Data Interchange For Administration, Commerce and Transport (UN/EDIFACT))
3. X12 (ASC X12)

----------

The following API Apps enable the above capabilities:

1. BizTalk Trading Partner Management i.e. TPM
	1. Create and management of Partners, Profiles & Identities
	2. Storage and management of Schemas
	3. Storage and management of certificates (used in AS2 protocol)
	4. Create and management of AS2 Agreements
	5. Create and management of EDIFACT Agreements (includes batching on the send side)
	6. Create and management of X12 Agreements (includes batching on the send side)
2. AS2 Connector
	1. Executes AS2 Agreements as defined in the related TPM API App instance
	2. Surfaces AS2 processing/tracking information for troubleshooting
3. BizTalk EDIFACT
	1. Executes EDIFACT Agreements as defined in the related TPM API App instance
	2. Surfaces EDIFACT processing/tracking information for troubleshooting (if needed)
	3. Provides state management of batches (start and stop) as defined in EDIFACT Agreement(s) in the related TPM API App instance
4. BizTalk X12
	1. Executes X12 Agreements as defined in the related TPM API App instance 
	2. Surfaces X12 processing/tracking information for troubleshooting (if needed)
	3. Provides state management of batches (start and stop) as defined in X12 Agreement(s) in the related TPM API App instance

As stated above: AS2, X12 and EDIFACT API Apps require a TPM API App to function as expected.

----------

To create trading partner agreements:

1. Create an instance of 'BizTalk Trading Partner Management'. This requires a blank SQL Database to function and hence make sure that is ready before you start creating this
2. Browse to the TPM instance created and step into the ‘Partners’ part
3. Create partners as desired. Also edit the profile(s) as appropriate and add the required identities
4. Also upload schemas and certificates as required by the agreements. This out to be done by browsing the TPM instance created and stepping into the ‘Schemas’ and/or ‘Certificates’ part
5. Now use the ‘Agreements’ part to create agreements. During agreement creation one of the initial steps is to choose the protocol. Based on the protocol chosen the rest of the agreement configuration takes place. To understand each field/setting better refer to the following link: AS2 **(add link to AS2 agreement API reference)**, EDIFACT **(add link to EDIFACT agreement API reference)**, and X12 **(add link to X12 agreement API reference)**.






