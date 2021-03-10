---
title: Identification entities 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include 
ms.date: 02/17/2021
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
:::row-end:::


#### Austria

:::row:::
    :::column span="":::
        **Entity**

        Austria identity card

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Austria tax identification number

    :::column-end:::

:::row-end:::
:::row:::
    :::column span="":::

        Austria Value Added Tax (VAT) number

    :::column-end:::
:::row-end:::



#### Australia

:::row:::
    :::column span="":::
        **Entity**

        Australia bank account number

    :::column-end:::

:::row-end:::
:::row:::
    :::column span="":::

        Australian business number

    :::column-end:::

:::row-end:::
:::row:::
    :::column span="":::

        Australia Company Number

    :::column-end:::

:::row-end:::
:::row:::
    :::column span="":::

        Australia driver's license  

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australia medical account number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australia passport number

    :::column-end:::

:::row-end:::
:::row:::
    :::column span="":::

        Australia passport number

    :::column-end:::

:::row-end:::
:::row:::
    :::column span="":::

        Australia tax file number

    :::column-end:::

:::row-end:::


#### Belgium

:::row:::
    :::column span="":::
        **Entity**

        Belgium national number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Belgium Value Added Tax (VAT) number

    :::column-end:::

:::row-end:::


#### Brazil 

:::row:::
    :::column span="":::
        **Entity**

        Brazil legal entity number (CNPJ)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Brazil CPF number

    :::column-end:::

:::row-end:::
:::row:::
    :::column span="":::

        Brazil National ID Card (RG)

    :::column-end:::
:::row-end:::

#### Canada

:::row:::
    :::column span="":::
        **Entity**

        Canada bank account number

    :::column-end:::

:::row-end:::
:::row:::
    :::column span="":::

        Canada driver's license number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Canada health service number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Canada passport number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Canada Personal Health Identification Number (PHIN)

    :::column-end:::

:::row-end:::
:::row:::
    :::column span="":::

        Canada social insurance number

    :::column-end:::
:::row-end:::

#### Chile 

:::row:::
    :::column span="":::
        **Entity**

        Chile identity card number

    :::column-end:::
:::row-end:::

#### China

:::row:::
    :::column span="":::
        **Entity**

        China Resident Identity Card (PRC) number

    :::column-end:::
:::row-end:::


#### European Union (EU)

:::row:::
    :::column span="":::
        **Entity**

        EU debit card number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU driver's license number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU national identification number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU passport number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU Social Security Number (SSN) or equivalent ID

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU Tax Identification Number (TIN)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU GPS coordinates

    :::column-end:::
:::row-end:::

#### France

:::row:::
    :::column span="":::
        **Entity**

        France driver's license number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France health insurance number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France national ID card (CNI)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France passport number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France Social Security Number (INSEE)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France tax identification number (Numéro SPI)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France Value Added Tax (VAT) number

    :::column-end:::
:::row-end:::

#### Germany

:::row:::
    :::column span="":::
        **Entity**

        German Driver's License Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Germany Identity Card Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Germany passport number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Germany Tax Identification Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Germany Value Added Tax Number

    :::column-end:::
:::row-end:::

#### Hong Kong

:::row:::
    :::column span="":::
        **Entity**

        Hong Kong Identity Card (HKID) Number

    :::column-end:::
:::row-end:::

#### Hungary

:::row:::
    :::column span="":::
        **Entity**

        Hungary Personal Identification Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Hungary Tax identification Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Hungary Value Added Tax Number

    :::column-end:::
:::row-end:::

#### India

:::row:::
    :::column span="":::
        **Entity**

        India Permanent Account Number (PAN)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        India Unique Identification (Aadhaar) Number

    :::column-end:::
:::row-end:::


#### Indonesia

:::row:::
    :::column span="":::
        **Entity**

        Indonesia Identity Card (KTP) Number

    :::column-end:::
:::row-end:::

#### Ireland

:::row:::
    :::column span="":::
        **Entity**

        Ireland Personal Public Service (PPS) Number

    :::column-end:::
:::row-end:::

#### Israel

:::row:::
    :::column span="":::
        **Entity**

        Israel National ID

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Israel Bank Account Number

    :::column-end:::
:::row-end:::

#### Italy

:::row:::
    :::column span="":::
        **Entity**

        Italy Driver's License ID

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Italy Fiscal Code

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Italy Value Added Tax Number

    :::column-end:::
:::row-end:::


#### Japan

:::row:::
    :::column span="":::
        **Entity**

        Japan Bank Account Number

    :::column-end:::

:::row-end:::
:::row:::
    :::column span="":::

        Japan Driver's License Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Japan "My Number" (personal)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Japan "My Number" (Corporate)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Japan Resident Registration Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Japan Residence Card Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Japan Social Insurance Number (SIN)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Japan Passport Number

    :::column-end:::
:::row-end:::

#### Luxembourg

:::row:::
    :::column span="":::
        **Entity**

        Luxembourg National Identification Number (Natural persons)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Luxembourg National Identification Number (Non-natural persons)

    :::column-end:::
:::row-end:::

#### Malta

:::row:::
    :::column span="":::
        **Entity**

        Malta Identity Card Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Malta Tax Identification Number

    :::column-end:::
:::row-end:::


#### New Zealand

:::row:::
    :::column span="":::
        **Entity**

        New Zealand Bank Account Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        New Zealand Driver's License Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        New Zealand Inland Revenue Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        New Zealand Ministry of Health Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       New Zealand Social Welfare Number

    :::column-end:::
:::row-end:::


#### Philippines

:::row:::
    :::column span="":::
        **Entity**

        Philippines Unified Multi-Purpose ID Number

    :::column-end:::
:::row-end:::

#### Portugal 

:::row:::
    :::column span="":::
        **Entity**

        Portugal Citizen Card Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       Portugal Tax Identification Number

    :::column-end:::
:::row-end:::

#### Singapore

:::row:::
    :::column span="":::
        **Entity**

        Singapore National Registration ID Card (NRIC) Number

    :::column-end:::
:::row-end:::


#### South Africa

:::row:::
    :::column span="":::
        **Entity**

        South Africa Identification Number

    :::column-end:::
:::row-end:::


#### South Korea

:::row:::
    :::column span="":::
        **Entity**

        South Korea Resident Registration Number

    :::column-end:::
:::row-end:::

#### Spain

:::row:::
    :::column span="":::
        **Entity**

        Spain DNI

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Spain Social Security Number (SSN)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Spain Tax Identification Number

    :::column-end:::
:::row-end:::
 
#### Switzerland

:::row:::
    :::column span="":::
        **Entity**

        Swiss Social Security Number AHV

    :::column-end:::
:::row-end:::


#### Taiwan 

:::row:::
    :::column span="":::
        **Entity**

        Taiwan National ID

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       Taiwan Resident Certificate (ARC/TARC)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Taiwan Passport Number

    :::column-end:::
:::row-end:::

#### United Kingdom

:::row:::
    :::column span="":::
        **Entity**

        U.K. Driver's License Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.K. Electoral Roll Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.K. National Health Service (NHS) Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.K. National Insurance Number (NINO)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.K. or U.S. Passport Number

    :::column-end:::

:::row-end:::
:::row:::
    :::column span="":::

       U.K. Unique Taxpayer Reference Number

    :::column-end:::

:::row-end:::


#### United States

:::row:::
    :::column span="":::
        **Entity**

        U.S. Social Security Number (SSN)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.S. Driver's License Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.S. or U.K. Passport Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.S. Individual Taxpayer Identification Number (ITIN)

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.S. Drug Enforcement Agency (DEA) Number

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.S. Bank Account Number

    :::column-end:::
:::row-end:::
