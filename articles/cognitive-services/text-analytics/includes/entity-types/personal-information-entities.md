---
title: Named entities for Personal information 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 10/21/2019
ms.author: aahi
---

## Personal information entity types:

### Person
Recognized names and other persons in text.
Languages:
* Public preview: `English`

| Subtype name | Description             |
|--------------|-------------------------|
| N/A          | Recognized names, for example `Bill Gates`, `Marie Curie` |

### Organization  

Recognized organizations, corporations, agencies, and other groups of people. For example: companies, political groups, musical bands, sport clubs, government bodies, and public organizations. Nationalities and religions are not included in this entity type. 
Languages: 

* Public preview: `English`

| Subtype name | Description                                                                                      |
|--------------|--------------------------------------------------------------------------------------------------|
| N/A          | organizations, for example `Microsoft`, `NASA` `National Oceanic and Atmospheric Administration` |

### Phone Number

Phone numbers. 

Languages:

* Public preview: `English`

| Subtype name           | Description                                           |
|------------------------|-------------------------------------------------------|
| N/A                    | Phone numbers, for example `+1 123-123-123`.          |
| EU Phone number        | Phone numbers specific to the European union.         |
| EU Mobile Phone number | Mobile phone numbers specific to the European union. |

### EU GPS Coordinates

 GPS coordinates for locations within the European Union. 

Languages:

* Public preview: `English`

| Subtype name | Description                               |
|--------------|-------------------------------------------|
| N/A          | GPS coordinates within the European Union |

### Azure information

Identifiable Azure information including authentication information, and connection strings. 

Languages:

* Public preview: `English`

| Subtype name                          | Description                                                                 |
|---------------------------------------|-----------------------------------------------------------------------------|
| Azure DocumentDB Auth Key             | Authorization key for an Azure DocumentDB server.                           |
| Azure IAAS Database Connection String | Connection string for an Azure Infrastructure as a service (IaaS) database. |
| Azure SQL Connection String           | Connection string for an Azure SQL database.                                |
| Azure IoT Connection String           | Connection string for Azure Internet of things(IoT).                        |
| Azure Publish Setting Password        | Password for Azure Publish settings.                                        |
| Azure Redis Cache Connection String   | Connection string for an Azure Cache for Redis.                             |
| Azure SAS                             | Connection string for Azure Software as a Service(SAS).                     |
| Azure Service Bus Connection String   | Connection string for an Azure service bus.                                |
| Azure Storage Account Key             | Account key for an Azure storage account.                                   |
| Azure Storage Account Key (Generic)   | Generic account key for an Azure storage account.                           |
| SQL Server Connection String          | Connection string for a SQL server.                                         |

### Identification

Languages:

* Public preview: `English`

#### Financial Account Identification

| Subtype name               | Description                                                                |
|----------------------------|----------------------------------------------------------------------------|
| ABA Routing Numbers        | American Banker Association(ABA) transit routing numbers.                  |
| SWIFT Code                 | SWIFT codes for payment instruction information.                           |
| Credit Card                | Credit card numbers.                                                       |
| IBAN Code                  | IBAN codes for payment instruction information.                            |

#### Government and country-specific Identification

The entities below are grouped and listed by country:

Argentina
* National Identity (DNI) Number

Australia
* Tax file number 
* Driver's license ID
* Passport ID
* Medical account number
* bank account numbers (for example checking, savings and debit accounts)

Belgium
* National number

Brazil
* Legal Entity Number (CNPJ)
* CPF number
* National ID Card (RG)

Canada
* Passport ID
* Driver's license ID
* Health insurance Number
* Personal health ID Number (PHIN)
* Social Security Number
* bank account numbers (for example checking, savings and debit accounts)

Chile
* Identity card number 

China
* Identity card number
* Resident ID card (PRC) number

Croatia
* ID card number
* Personal ID (OIB) number

Czech Republic
* National ID card number

Denmark
* Personal ID number

European Union (EU)
* National ID number
* Passport ID
* Driver's license ID
* Social Security Number (SSN) or equivalent ID
* EU Tax Identification Number (TIN)
* EU Debit Card Number

Finland
* National ID number
* Passport ID

France
* National ID card (CNI)
* Social Security number (INSEE)
* Passport ID
* Driver's license ID

Germany
* ID Card number
* Passport ID
* Driver's license ID

Greece 
* National ID card number

Hong Kong
* ID card (HKID) number

India
* Permanent Account number (PAN)
* Unique ID (Aadhaar) Number

Indonesia
* ID card number (KTP)

Ireland
* Personal Public Service (PPS) Number

Israel
* National ID
* bank account numbers (for example checking, savings and debit accounts)

Italy
* Driver's license ID

Japan
* Resident registration number
* Residence card number
* Driver's license ID
* Social Insurance Number (SIN)
* Passport ID
* bank account numbers (for example checking, savings and debit accounts)

Malaysia
* ID card number

Netherlands
* Citizen's Service (BSN) number

New Zealand
* Ministry of Health Number

Norway
* ID card number

Philippines
* Unified Multi-Purpose ID Number

Poland
* ID Card number
* National ID (PESEL)
* Passport ID

Portugal 
* Citizen Card Number

Saudi Arabia
* National ID

Singapore
* National Registration ID Card (NRIC) number

South Africa
* ID Number
* Resident Registration number

South Korea
* Resident Registration Number

Spain 
* Social Security Number (SSN)

Sweden
* National ID
* Passport ID

Taiwan 
* National ID
* Resident Certificate (ARC/TARC) number
* Passport ID

Thailand
* Population Identification code

United Kingdom
* Passport ID
* Driver's license ID
* National Insurance number (NINO)
* National Health Service (NHS) number

United States
* Social Security Number (SSN)
* Driver's license ID
* Passport ID
* Electoral roll number
* Individual Tax ID Number (ITIN)
* Drug Enforcement Agency (DEA) number
* bank account numbers (for example checking, savings and debit accounts)