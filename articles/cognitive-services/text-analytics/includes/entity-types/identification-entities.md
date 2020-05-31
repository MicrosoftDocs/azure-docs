---
title: Identification entities 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 04/29/2020
ms.author: aahi
---

This entity category includes financial information and official forms of identification. Available starting with model version `2019-10-01`. Subtypes are listed below. 

### Financial Account Identification

| Subtype name               | Description                                                                |
|----------------------------|----------------------------------------------------------------------------|
| ABA Routing Number        | American Banker Association(ABA) transit routing numbers.                  |
| SWIFT Code                 | SWIFT codes for payment instruction information.                           |
| Credit Card                | Credit card numbers.                                                       |
| International Banking Account Number (IBAN)                  | IBAN codes for payment instruction information.                            |


### Government and country/region specific identification

> [!NOTE]
> The following financial and country-specific entities are not returned with the `domain=phi` parameter:
> * Passport numbers
> * Tax IDs

The entities below are grouped and listed by country:

Argentina
* Argentina National Identity (DNI) Number

Australia
* Australia Passport Number
* Australia Tax File Number
* Australia Driver's License Number
* Australia Medical Account Number
* Australia Bank Account Number

Belgium
* Belgium National number

Brazil 
* Brazil Legal Entity Number (CNPJ)
* Brazil CPF number
* Brazil National ID Card (RG)

Canada
* Canada Social Insurance Number
* Canada Driver's license Number
* Canada Bank Account Number
* Canada Passport Number
* Canada Personal Health Identification Number (PHIN)
* Canada Health Service Number

Chile
* Identity card number 

China
* China Resident Identity Card (PRC) Number

Croatia
* Croatia Identity Card Number
* Croatia Personal Identification (OIB) Number

Czech Republic
* Czech Personal Identity Number

Denmark
* Denmark Personal Identification number

European Union (EU)
* EU National Identification Number
* EU Passport Number
* EU Driver's License Number
* EU Social Security Number (SSN) or Equivalent ID
* EU Tax Identification Number (TIN)
* EU Debit Card Number

Finland
* Finland National ID
* Finland Passport Number

France
* France National ID card (CNI)
* France Social Security Number (INSEE)
* France Passport Number
* France Driver's License Number

Germany
* Germany Identity Card Number
* German Passport Number
* German Driver's License Number

Greece 
* Greece National ID card number

Hong Kong
* Hong Kong Identity Card (HKID) Number

India
* India Permanent Account Number (PAN)
* India Unique Identification (Aadhaar) Number

Indonesia
* Indonesia Identity Card (KTP) Number

Ireland
* Ireland Personal Public Service (PPS) Number

Israel
* Israel National ID
* Israel Bank Account Number

Italy
* Italy Driver's license ID

Japan
* Japan Resident Registration Number
* Japanese Residence Card Number
* Japan Driver's License Number
* Social Insurance Number (SIN)
* Japan Passport Number
* Japan Bank Account Number

Malaysia
* Malaysia Identity Card number

Netherlands
* Netherlands Citizen's Service (BSN) Number

New Zealand
* New Zealand Ministry of Health Number

Norway
* Norway Identity Number

Philippines
* Philippines Unified Multi-Purpose ID Number

Poland
* Poland Identity Card
* Poland National ID (PESEL)
* Poland Passport

Portugal 
* Portugal Citizen Card Number

Saudi Arabia
* Saudi Arabia National ID

Singapore
* Singapore National Registration ID Card (NRIC) number

South Africa
* South Africa Identification Number

South Korea
* South Korea Resident Registration Number

Spain 
* Spain Social Security Number (SSN)

Sweden
* Sweden National ID
* Sweden Passport Number

Taiwan 
* Taiwan National ID
* Taiwan Resident Certificate (ARC/TARC)
* Taiwan Passport Number

Thailand
* Thai Population Identification Code

United Kingdom
* Passport ID
* U.K. Driver's license Number
* U.K. National Insurance Number (NINO)
* U.K. National Health Service Number
* U.K. Electoral Roll Number
* U.S. / U.K. Passport Number

United States
* U.S. Social Security Number (SSN)
* U.S. Driver's License Number
* U.S. / U.K. Passport Number
* U.S. Individual Taxpayer Identification Number (ITIN)
* Drug Enforcement Agency (DEA) number
* U.S. bank account number
