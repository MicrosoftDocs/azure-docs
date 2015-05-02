<properties 
   pageTitle="Create a Trading Partner Agreement in Microsoft Azure App Service" 
   description="Create Trading Partner Agreements" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="harishkragarwal" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/22/2015"
   ms.author="hariag"/>


# Creating a Trading Partner Agreement   

Trading partners are the entities involved in B2B (Business-to-Business) communications. When two partners establish a relationship, this is referred to as an *Agreement*. The agreement defined is based on the communication the two partners wish to achieve and is protocol or transport specific. The various B2B protocols and transports supported  Azure App Service include:

- AS2 (Applicability Statement 2)
- EDIFACT (United Nations/Electronic Data Interchange For Administration, Commerce and Transport (UN/EDIFACT))
- X12 (ASC X12)

### BizTalk API Apps that support B2B scenarios
The following API Apps enable these capabilities using a rich and intuitive experience in the Azure Portal:


## BizTalk Trading Partner Management (TPM)
- Create and management of Partners, Profiles & Identities
- Storage and management of EDI Schemas
- Storage and management of certificates (used in AS2 protocol)
- Creation and management of AS2 Agreements
- Creation and management of EDIFACT Agreements (includes batching on the send side)
- Creation and management of X12 Agreements (includes batching on the send side)

![][1]


## AS2 Connector
- Executes AS2 Agreements as defined in the related TPM API App instance
- Surfaces AS2 processing/tracking information for troubleshooting


## BizTalk EDIFACT
- Executes EDIFACT Agreements as defined in the related TPM API App instance
- Surfaces EDIFACT processing/tracking information for troubleshooting
- Provides state management of batches (start and stop) as defined in EDIFACT Agreement(s) in the related TPM API App instance


## BizTalk X12
- Executes X12 Agreements as defined in the related TPM API App instance 
- Surfaces X12 processing/tracking information for troubleshooting
- Provides state management of batches (start and stop) as defined in X12 Agreement(s) in the related TPM API App instance

As previously stated, the AS2, X12, and EDIFACT API Apps require a TPM API App to function as expected.


## Getting Started
To create trading partner agreements:

1. Create an instance of the **BizTalk Trading Partner Management** connector. This requires a blank SQL Database to function. Before starting be sure to have a blank database available and ready for use.
2. Upload schemas and certificates as required by the agreements. This is to be done by browsing the TPM instance created and stepping into the ‘Schemas’ and/or ‘Certificates’ part
3. Browse to the TPM instance created and step into the **Partners** part
4. Create partners as desired. Also edit the profile(s) as appropriate and add the required identities
5. Now use the **Agreements** part to create agreements. During agreement creation one of the initial steps is to choose the protocol. Based on the protocol chosen the rest of the agreement configuration takes place.

![][2]

![][3]

<!--Image references-->
[1]: ./media/app-service-logic-create-a-trading-partner-agreement/TPMResourceView.jpg
[2]: ./media/app-service-logic-create-a-trading-partner-agreement/ProtocolSelection.jpg
[3]: ./media/app-service-logic-create-a-trading-partner-agreement/X12AgreementCreation.jpg
