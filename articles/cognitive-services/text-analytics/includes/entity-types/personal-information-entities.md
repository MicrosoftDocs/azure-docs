---
title: Named entities for Personal information 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 02/06/2020
ms.author: aahi
---

## Personal information entity types:

### Person
Recognize person names in text.

Languages:
* Public preview: `English`

| Subtype name | Description                                               | Available starting with model version |
|--------------|-----------------------------------------------------------|----------------------------------------|
| N/A          | Recognized names, for example `Bill Gates`, `Marie Curie` | `2020-02-01`                           |

### Organization  

Recognize organizations, corporations, agencies, companies, clubs and other groups of people.

Languages: 

* Public preview: `English`

| Subtype name | Description                                                                                       | Available starting with model version|
|--------------|---------------------------------------------------------------------------------------------------|--------------|
| N/A          | organizations, for example `Microsoft`, `NASA`, `National Oceanic and Atmospheric Administration` | `2020-02-01` |

### Phone Number

Phone numbers (US Phone numbers only). 

Languages:

* Public preview: `English`

| Subtype name | Description                                    | Available starting with model version |
|--------------|------------------------------------------------|----------------------------------------|
| N/A          | US phone numbers, for example `(312) 555-0176` | `2020-02-01`                           |

### Email

Email address. 

Languages:

* Public preview: `English`

| Subtype name | Description                                      | Available starting with model version |
|--------------|--------------------------------------------------|----------------------------------------|
| N/A          | Email address, for example `support@contoso.com` | `2020-02-01`                           |

### URL

Internet URLs.

Languages:

* Public preview: `English`

| Subtype name | Description                                          | Available starting with model version |
|--------------|------------------------------------------------------|----------------------------------------|
| N/A          | URLs to websites, for example `https://www.bing.com` | `2020-02-01`                           |

### IP Address

Internet Protocol Address

Languages:

* Public preview: `English`

| Subtype name | Description                              | Available starting with model version |
|--------------|------------------------------------------|----------------------------------------|
| N/A          | Network address for example `10.0.0.101` | `2020-02-01`                           |

### Quantity 

Numeric quantities

Languages:

* Public preview: `English`

| Subtype name | Description                   | Available starting with model version |
|--------------|-------------------------------|----------------------------------------|
| Age          | `90 days old`, `30 years old` | `2020-02-01`                           |

### DateTime

Date and Time entities

Languages:

* Public preview: `English`

| Subtype name | Description                   | Available starting with model version |
|--------------|-------------------------------|----------------------------------------|
| Date         | `May 2nd, 2017`, `05/02/2017` | `2020-02-01`                           |

### EU GPS Coordinates

 GPS coordinates for locations within the European Union. 

Languages:

* Public preview: `English`

| Subtype name | Description                               | Available starting with model version |
|--------------|-------------------------------------------|----------------------------------------|
| N/A          | GPS coordinates within the European Union | `2019-10-01`                           |

### Azure information

Identifiable Azure information including authentication information, and connection strings. 

* Available starting with model version `2019-10-01`.

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

* Available starting with model version `2019-10-01`.

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
