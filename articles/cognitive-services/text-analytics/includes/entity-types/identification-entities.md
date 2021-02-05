---
title: Identification entities 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include 
ms.date: 04/29/2020
ms.author: aahi
---

### Financial account identification

This entity category includes financial information and official forms of identification.

#### Category: ABA routing number

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        ABA routing number

    :::column-end:::
    :::column span="2":::
        **Details**

        American Banker Association (ABA) transit routing numbers.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::


#### Category: SWIFT code

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        SWIFT code

    :::column-end:::
    :::column span="2":::
        **Details**

        SWIFT codes for payment instruction information.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `pt-pt`, `pt-br`, `ja`
      
   :::column-end:::
:::row-end:::

#### Category: Credit card

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Credit card

    :::column-end:::
    :::column span="2":::
        **Details**

        Credit card numbers. 
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `pt-pt`, `pt-br`, `ja`	`pt-br`	`zh-hans`, `ja`, `ko`
      
   :::column-end:::
:::row-end:::

#### Category: International Banking Account Number (IBAN) 

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Credit card

    :::column-end:::
    :::column span="2":::
        **Details**

        IBAN codes for payment instruction information.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

### Government and country/region-specific identification

> [!NOTE]
> The following financial and country-specific entities are not returned with the `domain=phi` parameter:
> * Passport numbers
> * Tax IDs

The following entities are grouped and listed by country:

#### Argentina

:::row:::
    :::column span="":::
        **Entity**

        Argentina National Identity (DNI) Number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`
      
   :::column-end:::
:::row-end:::


#### Austria

:::row:::
    :::column span="":::
        **Entity**

        Austria identity card

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `de`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Austria tax identification number

    :::column-end:::
    :::column span="2":::

      `de`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Austria Value Added Tax (VAT) number

    :::column-end:::
    :::column span="2":::

      `de`
      
   :::column-end:::
:::row-end:::



#### Australia

:::row:::
    :::column span="":::
        **Entity**

        Australia bank account number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australian business number

    :::column-end:::
    :::column span="2":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australia Company Number

    :::column-end:::
    :::column span="2":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australia driver's license  

    :::column-end:::
    :::column span="2":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australia medical account number

    :::column-end:::
    :::column span="2":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australia passport number

    :::column-end:::
    :::column span="2":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australia passport number

    :::column-end:::
    :::column span="2":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australia tax file number

    :::column-end:::
    :::column span="2":::

      `en`
      
   :::column-end:::
:::row-end:::


#### Belgium

:::row:::
    :::column span="":::
        **Entity**

        Belgium national number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `fr`, `de`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Belgium Value Added Tax (VAT) number

    :::column-end:::
    :::column span="2":::

      `fr`, `de`
      
   :::column-end:::
:::row-end:::


#### Brazil 

:::row:::
    :::column span="":::
        **Entity**

        Brazil legal entity number (CNPJ)

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Brazil CPF number

    :::column-end:::
    :::column span="2":::

      `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Brazil National ID Card (RG)

    :::column-end:::
    :::column span="2":::

      `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

#### Bulgaria

:::row:::
    :::column span="":::
        **Entity**

        Bulgaria Uniform Civil Number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `hr`
      
   :::column-end:::
:::row-end:::

#### Canada

:::row:::
    :::column span="":::
        **Entity**

        Canada bank account number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `fr`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Canada driver's license number

    :::column-end:::
    :::column span="2":::

      `en`, `fr`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Canada health service number

    :::column-end:::
    :::column span="2":::

      `en`, `fr`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Canada passport number

    :::column-end:::
    :::column span="2":::

      `en`, `fr`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Canada Personal Health Identification Number (PHIN)

    :::column-end:::
    :::column span="2":::

      `en`, `fr`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Canada social insurance number

    :::column-end:::
    :::column span="2":::

      `en`, `fr`
      
   :::column-end:::
:::row-end:::

#### Chile 

:::row:::
    :::column span="":::
        **Entity**

        Chile identity card number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `es`
      
   :::column-end:::
:::row-end:::

#### China

:::row:::
    :::column span="":::
        **Entity**

        China Resident Identity Card (PRC) number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `zh-hans`
      
   :::column-end:::
:::row-end:::

#### Croatia

:::row:::
    :::column span="":::
        **Entity**

        Croatia Identity Card Number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `hr`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Croatia national ID card number

    :::column-end:::
    :::column span="2":::

      `hr`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Croatia Personal Identification (OIB) Number

    :::column-end:::
    :::column span="2":::

      `hr`
      
   :::column-end:::
:::row-end:::

#### Cyprus


:::row:::
    :::column span="":::
        **Entity**

        Cyprus identity card number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `el`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Cyprus tax identification number

    :::column-end:::
    :::column span="2":::

      `el`
      
   :::column-end:::
:::row-end:::

#### Czech Republic

:::row:::
    :::column span="":::
        **Entity**

        Czech personal identity number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `cs`
      
   :::column-end:::
:::row-end:::


#### Denmark

:::row:::
    :::column span="":::
        **Entity**

        Denmark personal identification number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `da`
      
   :::column-end:::
:::row-end:::

#### Estonia

:::row:::
    :::column span="":::
        **Entity**

        Estonia personal identification code

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `et`
      
   :::column-end:::
:::row-end:::

#### European Union (EU)

:::row:::
    :::column span="":::
        **Entity**

        EU debit card number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `pt-pt` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU driver's license number

    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `pt-pt` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU national identification number

    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `pt-pt` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU passport number

    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `pt-pt` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU Social Security Number (SSN) or equivalent ID

    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `pt-pt` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU Tax Identification Number (TIN)

    :::column-end:::
    :::column span="2":::

      `en`, `es`, `fr`, `de`, `it`, `pt-pt` 
      
   :::column-end:::
:::row-end:::

#### Finland

:::row:::
    :::column span="":::
        **Entity**

        Finland European Health Insurance Number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `fi` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Finland National ID

    :::column-end:::
    :::column span="2":::

      `fi` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Finland Passport Number

    :::column-end:::
    :::column span="2":::

      `fi` 
      
   :::column-end:::
:::row-end:::

#### France

:::row:::
    :::column span="":::
        **Entity**

        France driver's license number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `fr` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France health insurance number

    :::column-end:::
    :::column span="2":::

      `fr` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France national ID card (CNI)

    :::column-end:::
    :::column span="2":::

      `fr` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France passport number

    :::column-end:::
    :::column span="2":::

      `fr` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France Social Security Number (INSEE)

    :::column-end:::
    :::column span="2":::

      `fr` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France tax identification number (Numéro SPI)

    :::column-end:::
    :::column span="2":::

      `fr` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France Value Added Tax (VAT) number

    :::column-end:::
    :::column span="2":::

      `fr` 
      
   :::column-end:::
:::row-end:::

#### Germany

:::row:::
    :::column span="":::
        **Entity**

        German Driver's License Number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `de` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Germany Identity Card Number

    :::column-end:::
    :::column span="2":::

      `de`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Germany passport number

    :::column-end:::
    :::column span="2":::

      `de` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Germany Tax Identification Number

    :::column-end:::
    :::column span="2":::

      `de`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Germany Value Added Tax Number

    :::column-end:::
    :::column span="2":::

      `de`
      
   :::column-end:::
:::row-end:::

#### Greece 

:::row:::
    :::column span="":::
        **Entity**

        Greece National ID Card Number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `el` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Greece Tax identification Number

    :::column-end:::
    :::column span="2":::

      `el` 
      
   :::column-end:::
:::row-end:::

#### Hong Kong

:::row:::
    :::column span="":::
        **Entity**

        Hong Kong Identity Card (HKID) Number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `zh-hant` 
      
   :::column-end:::
:::row-end:::

#### Hungary

:::row:::
    :::column span="":::
        **Entity**

        Hungary National Identification Number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `hu` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Hungary Tax identification Number

    :::column-end:::
    :::column span="2":::

      `en`, `hu`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Hungary Value Added Tax Number

    :::column-end:::
    :::column span="2":::

      `en`, `hu` 
      
   :::column-end:::
:::row-end:::

#### India

:::row:::
    :::column span="":::
        **Entity**

        India Permanent Account Number (PAN)

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        India Unique Identification (Aadhaar) Number

    :::column-end:::
    :::column span="2":::

      `en`
      
   :::column-end:::
:::row-end:::


#### Indonesia

:::row:::
    :::column span="":::
        **Entity**

        Indonesia Identity Card (KTP) Number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `in`
      
   :::column-end:::
:::row-end:::

#### Ireland

:::row:::
    :::column span="":::
        **Entity**

        Ireland Personal Public Service (PPS) Number

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::

#### Israel

:::row:::
    :::column span="":::
        **Entity**

        Israel National ID

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `he`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Israel Bank Account Number

    :::column-end:::
    :::column span="2":::

      `en`, `he`
      
   :::column-end:::
:::row-end:::

* Israel National ID
* Israel Bank Account Number

Italy
* Italy Driver's License ID
* Italy Fiscal Code
* Italy Value Added Tax Number

Japan
* Japan Bank Account Number
* Japan Driver's License Number
* Japanese My Number Personal
* Japanese My Number Corporate
* Japan Resident Registration Number
* Japanese Residence Card Number
* Japan Social Insurance Number (SIN)
* Japan Passport Number

Latvia
* Latvia Personal Code

Lithuania
* Lithuania Personal Code

Luxemburg
* Luxemburg National Identification Number (Natural persons)
* Luxemburg National Identification Number (Non-natural persons)

Malaysia
* Malaysia Identity Card Number

Malta
* Malta Identity Card Number
* Malta Tax Identification Number

Netherlands
* Netherlands Citizen's Service (BSN) Number
* Netherlands Tax Identification Number
* Netherlands Value Added Tax Number

New Zealand
* New Zealand Bank Account Number
* New Zealand Driver's License Number
* New Zealand Inland Revenue Number
* New Zealand Ministry of Health Number
* New Zealand Social Welfare Number

Norway
* Norway Identity Number

Philippines
* Philippines Unified Multi-Purpose ID Number

Poland
* Poland Identity Card
* Poland National ID (PESEL)
* Poland Passport Number
* Poland REGON Number
* Poland Tax Identification Number

Portugal 
* Portugal Citizen Card Number
* Portugal Tax Identification Number

Romania
* Romania Personal Numerical Code (CNP)

Russia
* Russian Passport Number (Domestic)
* Russian Passport Number (International)

Saudi Arabia
* Saudi Arabia National ID

Singapore
* Singapore National Registration ID Card (NRIC) Number

Slovakia 
* Slovakia Personal Number

Slovenia
* Slovenia Tax Identification Number
* Slovenia Unique Master Citizen Number

South Africa
* South Africa Identification Number

South Korea
* South Korea Resident Registration Number

Spain 
* Spain DNI
* Spain Social Security Number (SSN)
* Spain Tax Identification Number

Sweden
* Sweden National ID
* Sweden Passport Number
* Sweden Tax Identification Number

Switzerland
* Swiss Social Security Number AHV

Taiwan 
* Taiwan National ID
* Taiwan Resident Certificate (ARC/TARC)
* Taiwan Passport Number

Thailand
* Thai Population Identification Code

Turkey
* Turkish National Identification Number

Ukraine
* Ukraine Passport Number (Domestic)
* Ukraine Passport Number (International)

United Kingdom
* U.K. Driver's License Number
* U.K. Electoral Roll Number
* U.K. National Health Service (NHS) Number
* U.K. National Insurance Number (NINO)
* U.K. Passport Number
* U.K. Unique Taxpayer Reference Number

United States
* U.S. Social Security Number (SSN)
* U.S. Driver's License Number
* U.S. Passport Number
* U.S. Individual Taxpayer Identification Number (ITIN)
* U.S. Drug Enforcement Agency (DEA) Number
* U.S. Bank Account Number
