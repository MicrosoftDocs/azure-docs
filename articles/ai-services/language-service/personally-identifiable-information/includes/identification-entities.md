---
title: Identification entities
titleSuffix: Azure AI services
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 11/02/2021
ms.author: jboback
ms.custom: language-service-pii, ignite-fall-2021
---

## Financial account identification

This entity category includes financial information and official forms of identification.

## Category: ABA routing number

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        ABA routing number

    :::column-end:::
    :::column span="2":::
        **Details**

        American Banker Association (ABA) transit routing numbers. Also returned with `domain=phi`.

        To get this entity category, add `ABARoutingNumber` to the `piiCategories` parameter. `ABARoutingNumber` will also be returned in the API response if detected.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::


## Category: SWIFT code

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        SWIFT code

    :::column-end:::
    :::column span="2":::
        **Details**

        SWIFT codes for payment instruction information. Also returned with `domain=phi`.

        To get this entity category, add `SWIFTCode` to the `piiCategories` parameter. `SWIFTCode` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `pt-pt`, `pt-br`, `ja`
      
   :::column-end:::
:::row-end:::

## Category: Credit card

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Credit card

    :::column-end:::
    :::column span="2":::
        **Details**

        Credit card numbers. Also returned with `domain=phi`.

        To get this entity category, add `CreditCardNumber` to the `piiCategories` parameter. `CreditCardNumber` will be returned in the API response if detected.

    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `pt-pt`, `pt-br`, `ja`,	`zh-hans`, `ja`, `ko`
      
   :::column-end:::
:::row-end:::

## Category: International Banking Account Number (IBAN) 

This category contains the following entity:

:::row:::
    :::column span="":::
        **Entity**

        Credit card

    :::column-end:::
    :::column span="2":::
        **Details**

        IBAN codes for payment instruction information. Also returned with `domain=phi`.

        To get this entity category, add `InternationalBankingAccountNumber` to the `piiCategories` parameter. `InternationalBankingAccountNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="2":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

## Government and country/region-specific identification

> [!NOTE]
> The following financial and country/region-specific entities are not returned with the `domain=phi` parameter:
> * Passport numbers
> * Tax IDs

The following entities are grouped and listed by country/region:

### Argentina

:::row:::
    :::column span="":::
        **Entity**

        Argentina National Identity (DNI) Number 

    :::column-end:::
    :::column span="2":::
        **Details**
        Also returned with `domain=phi`.
        
        To get this entity category, add `ARNationalIdentityNumber` to the `piiCategories` parameter. `ARNationalIdentityNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`, `es`
      
   :::column-end:::
:::row-end:::


### Austria

:::row:::
    :::column span="":::
        **Entity**

        Austria identity card

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `ATIdentityCard` to the `piiCategories` parameter. `ATIdentityCard` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `de`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Austria tax identification number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `ATTaxIdentificationNumber` to the `piiCategories` parameter. `ATTaxIdentificationNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `de`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Austria Value Added Tax (VAT) number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `ATValueAddedTaxNumber` to the `piiCategories` parameter. `ATValueAddedTaxNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `de`
      
   :::column-end:::
:::row-end:::



### Australia

:::row:::
    :::column span="":::
        **Entity**

        Australia bank account number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `AUBankAccountNumber` to the `piiCategories` parameter. `AUBankAccountNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australian business number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `AUBusinessNumber` to the `piiCategories` parameter. `AUBusinessNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australia Company Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `AUCompanyNumber` to the `piiCategories` parameter. `AUCompanyNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australia driver's license  

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `AUDriversLicenseNumber` to the `piiCategories` parameter. `AUDriversLicenseNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australia medical account number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `AUMedicalAccountNumber` to the `piiCategories` parameter. `AUMedicalAccountNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australia passport number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `AUPassportNumber` to the `piiCategories` parameter. `AUPassportNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Australia tax file number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `AUTaxFileNumber` to the `piiCategories` parameter. `AUTaxFileNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::


### Belgium

:::row:::
    :::column span="":::
        **Entity**

        Belgium national number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `BENationalNumber` to the `piiCategories` parameter. `BENationalNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `fr`, `de`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
        **Entity**

        Belgium national number V2

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `BENationalNumberV2` to the `piiCategories` parameter. `BENationalNumberV2` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `fr`, `de`
      
   :::column-end:::
:::row-end:::

:::row:::
    :::column span="":::

        Belgium Value Added Tax (VAT) number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `BEValueAddedTaxNumber` to the `piiCategories` parameter. `BEValueAddedTaxNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `fr`, `de`
      
   :::column-end:::
:::row-end:::


### Brazil 

:::row:::
    :::column span="":::
        **Entity**

        Brazil legal entity number (CNPJ)

        

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `BRLegalEntityNumber` to the `piiCategories` parameter. `BRLegalEntityNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Brazil CPF number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `BRCPFNumber` to the `piiCategories` parameter. `BRCPFNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Brazil National ID Card (RG)

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `BRNationalIDRG` to the `piiCategories` parameter. `BRNationalIDRG` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `pt-pt`, `pt-br`
      
   :::column-end:::
:::row-end:::

### Canada

:::row:::
    :::column span="":::
        **Entity**

        Canada bank account number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `CABankAccountNumber` to the `piiCategories` parameter. `CABankAccountNumber` will be returned in the API response if detected.
    
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`, `fr`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Canada driver's license number

    :::column-end:::

    :::column span="2":::

        To get this entity category, add `CADriversLicenseNumber` to the `piiCategories` parameter. `CADriversLicenseNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::

    :::column span="":::

      `en`, `fr`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Canada health service number

        
    :::column-end:::

    :::column span="2":::

        To get this entity category, add `CAHealthServiceNumber` to the `piiCategories` parameter. `CAHealthServiceNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::

    :::column span="":::

      `en`, `fr`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Canada passport number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `CAPassportNumber` to the `piiCategories` parameter. `CAPassportNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`, `fr`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Canada Personal Health Identification Number (PHIN)

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `CAPersonalHealthIdentification` to the `piiCategories` parameter. `CAPersonalHealthIdentification` will be returned in the API response if detected.

        Also returned with `domain=phi`.
      
    :::column-end:::
    :::column span="":::

      `en`, `fr`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Canada social insurance number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `CASocialInsuranceNumber` to the `piiCategories` parameter. `CASocialInsuranceNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`, `fr`
      
   :::column-end:::
:::row-end:::

### Chile 

:::row:::
    :::column span="":::
        **Entity**

        Chile identity card number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `CLIdentityCardNumber` to the `piiCategories` parameter. `CLIdentityCardNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `es`
      
   :::column-end:::
:::row-end:::

### China

:::row:::
    :::column span="":::
        **Entity**

        China Resident Identity Card (PRC) number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `CNResidentIdentityCardNumber` to the `piiCategories` parameter. `CNResidentIdentityCardNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `zh-hans`
      
   :::column-end:::
:::row-end:::


### European Union (EU)

:::row:::
    :::column span="":::
        **Entity**

        EU debit card number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `EUDebitCardNumber` to the `piiCategories` parameter. `EUDebitCardNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`, `es`, `fr`, `de`, `it`, `pt-pt` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU driver's license number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `EUDriversLicenseNumber` to the `piiCategories` parameter. `EUDriversLicenseNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`, `es`, `fr`, `de`, `it`, `pt-pt` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU GPU coordinates

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `EUGPSCoordinates` to the `piiCategories` parameter. `EUGPSCoordinates` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`, `es`, `fr`, `de`, `it`, `pt-pt` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU national identification number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `EUNationalIdentificationNumber` to the `piiCategories` parameter. `EUNationalIdentificationNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`, `es`, `fr`, `de`, `it`, `pt-pt` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU passport number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `EUPassportNumber` to the `piiCategories` parameter. `EUPassportNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`, `es`, `fr`, `de`, `it`, `pt-pt` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU Social Security Number (SSN) or equivalent ID

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `EUSocialSecurityNumber` to the `piiCategories` parameter. `EUSocialSecurityNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`, `es`, `fr`, `de`, `it`, `pt-pt` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        EU Tax Identification Number (TIN)

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `EUTaxIdentificationNumber` to the `piiCategories` parameter. `EUTaxIdentificationNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`, `es`, `fr`, `de`, `it`, `pt-pt` 
      
   :::column-end:::
:::row-end:::

### France

:::row:::
    :::column span="":::
        **Entity**

        France driver's license number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `FRDriversLicenseNumber` to the `piiCategories` parameter. `FRDriversLicenseNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `fr` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France health insurance number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `FRHealthInsuranceNumber` to the `piiCategories` parameter. `FRHealthInsuranceNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `fr` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France national ID card (CNI)

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `FRNationalID` to the `piiCategories` parameter. `FRNationalID` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `fr` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France passport number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `FRPassportNumber` to the `piiCategories` parameter. `FRPassportNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `fr` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France Social Security Number (INSEE)

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `FRSocialSecurityNumber` to the `piiCategories` parameter. `FRSocialSecurityNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `fr` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France tax identification number (Numéro SPI)

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `FRTaxIdentificationNumber` to the `piiCategories` parameter. `FRTaxIdentificationNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `fr` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        France Value Added Tax (VAT) number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `FRValueAddedTaxNumber` to the `piiCategories` parameter. `FRValueAddedTaxNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `fr` 
      
   :::column-end:::
:::row-end:::

### Germany

:::row:::
    :::column span="":::
        **Entity**

        German Driver's License Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `DEDriversLicenseNumber` to the `piiCategories` parameter. `DEDriversLicenseNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `de` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Germany Identity Card Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `DEIdentityCardNumber` to the `piiCategories` parameter. `DEIdentityCardNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `de`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Germany passport number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `DEPassportNumber` to the `piiCategories` parameter. `DEPassportNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `de` 
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Germany Tax Identification Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `DETaxIdentificationNumber` to the `piiCategories` parameter. `DETaxIdentificationNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `de`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Germany Value Added Tax Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `DEValueAddedNumber` to the `piiCategories` parameter. `DEValueAddedNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `de`
      
   :::column-end:::
:::row-end:::

### Hong Kong Special Administrative Region

:::row:::
    :::column span="":::
        **Entity**

        Hong Kong Identity Card (HKID) Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `HKIdentityCardNumber` to the `piiCategories` parameter. `HKIdentityCardNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::

### Hungary

:::row:::
    :::column span="":::
        **Entity**

        Hungary Personal Identification Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `HUPersonalIdentificationNumber` to the `piiCategories` parameter. `HUPersonalIdentificationNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Hungary Tax identification Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `HUTaxIdentificationNumber` to the `piiCategories` parameter. `HUTaxIdentificationNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Hungary Value Added Tax Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `HUValueAddedNumber` to the `piiCategories` parameter. `HUValueAddedNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::

### India

:::row:::
    :::column span="":::
        **Entity**

        India Permanent Account Number (PAN)

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `INPermanentAccount` to the `piiCategories` parameter. `INPermanentAccount` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        India Unique Identification (Aadhaar) Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `INUniqueIdentificationNumber` to the `piiCategories` parameter. `INUniqueIdentificationNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::


### Indonesia

:::row:::
    :::column span="":::
        **Entity**

        Indonesia Identity Card (KTP) Number

    :::column-end:::
    :::column span="2":::

        **Details**

        To get this entity category, add `IDIdentityCardNumber` to the `piiCategories` parameter. `IDIdentityCardNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::

### Ireland

:::row:::
    :::column span="":::
        **Entity**

        Ireland Personal Public Service (PPS) Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `IEPersonalPublicServiceNumber` to the `piiCategories` parameter. `IEPersonalPublicServiceNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::
 
        Ireland Personal Public Service (PPS) Number v2

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `IEPersonalPublicServiceNumberV2` to the `piiCategories` parameter. `IEPersonalPublicServiceNumberV2` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::

### Israel

:::row:::
    :::column span="":::
        **Entity**

        Israel National ID

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `ILNationalID` to the `piiCategories` parameter. `ILNationalID` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Israel Bank Account Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `ILBankAccountNumber` to the `piiCategories` parameter. `ILBankAccountNumber` will be returned in the API response if detected.
    
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::

### Italy

:::row:::
    :::column span="":::
        **Entity**

        Italy Driver's License ID

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `ITDriversLicenseNumber` to the `piiCategories` parameter. `ITDriversLicenseNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `it`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Italy Fiscal Code

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `ITFiscalCode` to the `piiCategories` parameter. `ITFiscalCode` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `it`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Italy Value Added Tax Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `ITValueAddedTaxNumber` to the `piiCategories` parameter. `ITValueAddedTaxNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `it`
      
   :::column-end:::
:::row-end:::


### Japan

:::row:::
    :::column span="":::
        **Entity**

        Japan Bank Account Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `JPBankAccountNumber` to the `piiCategories` parameter. `JPBankAccountNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `ja`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Japan Driver's License Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `JPDriversLicenseNumber` to the `piiCategories` parameter. `JPDriversLicenseNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `ja`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Japan "My Number" (personal)

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `JPMyNumberPersonal` to the `piiCategories` parameter. `JPMyNumberPersonal` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `ja`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Japan "My Number" (Corporate)

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `JPMyNumberCorporate` to the `piiCategories` parameter. `JPMyNumberCorporate` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `ja`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Japan Resident Registration Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `ITValueAddedTaxNumber` to the `piiCategories` parameter. `ITValueAddedTaxNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

     `ja`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Japan Residence Card Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `JPResidenceCardNumber` to the `piiCategories` parameter. `JPResidenceCardNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `ja`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Japan Social Insurance Number (SIN)

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `JPSocialInsuranceNumber` to the `piiCategories` parameter. `JPSocialInsuranceNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `ja`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Japan Passport Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `JPPassportNumber` to the `piiCategories` parameter. `JPPassportNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `ja`
      
   :::column-end:::
:::row-end:::

### Luxembourg

:::row:::
    :::column span="":::
        **Entity**

        Luxembourg National Identification Number (Natural persons)

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `LUNationalIdentificationNumberNatural` to the `piiCategories` parameter. `LUNationalIdentificationNumberNatural` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `fr`, `de`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Luxembourg National Identification Number (Non-natural persons)

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `LUNationalIdentificationNumberNonNatural` to the `piiCategories` parameter. `LUNationalIdentificationNumberNonNatural` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `fr`, `de`
      
   :::column-end:::
:::row-end:::

### Malta

:::row:::
    :::column span="":::
        **Entity**

        Malta Identity Card Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `MTIdentityCardNumber` to the `piiCategories` parameter. `MTIdentityCardNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Malta Tax Identification Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `MTTaxIDNumber` to the `piiCategories` parameter. `MTTaxIDNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::


### New Zealand

:::row:::
    :::column span="":::
        **Entity**

        New Zealand Bank Account Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `NZBankAccountNumber` to the `piiCategories` parameter. `NZBankAccountNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        New Zealand Driver's License Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `NZDriversLicenseNumber` to the `piiCategories` parameter. `NZDriversLicenseNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        New Zealand Inland Revenue Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `NZInlandRevenueNumber` to the `piiCategories` parameter. `NZInlandRevenueNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        New Zealand Ministry of Health Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `NZMinistryOfHealthNumber` to the `piiCategories` parameter. `NZMinistryOfHealthNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       New Zealand Social Welfare Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `NZSocialWelfareNumber` to the `piiCategories` parameter. `NZSocialWelfareNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::


### Philippines

:::row:::
    :::column span="":::
        **Entity**

        Philippines Unified Multi-Purpose ID Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `PHUnifiedMultiPurposeIDNumber` to the `piiCategories` parameter. `PHUnifiedMultiPurposeIDNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::

### Portugal 

:::row:::
    :::column span="":::
        **Entity**

        Portugal Citizen Card Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `PTCitizenCardNumber` to the `piiCategories` parameter. `PTCitizenCardNumber` will be returned in the API response if detected.
          
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `pt-pt`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       Portugal Tax Identification Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `PTTaxIdentificationNumber` to the `piiCategories` parameter. `PTTaxIdentificationNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `pt-pt`
      
   :::column-end:::
:::row-end:::

### Singapore

:::row:::
    :::column span="":::
        **Entity**

        Singapore National Registration ID Card (NRIC) Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `PTTaxIdentificationNumber` to the `piiCategories` parameter. `PTTaxIdentificationNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`, `zh-hans`
      
   :::column-end:::
:::row-end:::


### South Africa

:::row:::
    :::column span="":::
        **Entity**

        South Africa Identification Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `ZAIdentificationNumber` to the `piiCategories` parameter. `ZAIdentificationNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::


### South Korea

:::row:::
    :::column span="":::
        **Entity**

        South Korea Resident Registration Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `KRResidentRegistrationNumber` to the `piiCategories` parameter. `KRResidentRegistrationNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `ko`
      
   :::column-end:::
:::row-end:::

### Spain

:::row:::
    :::column span="":::
        **Entity**

        Spain DNI

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `ESDNI` to the `piiCategories` parameter. `ESDNI` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `es`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Spain Social Security Number (SSN)

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `ESSocialSecurityNumber` to the `piiCategories` parameter. `ESSocialSecurityNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `es`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Spain Tax Identification Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `ESTaxIdentificationNumber` to the `piiCategories` parameter. `ESTaxIdentificationNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `es`
      
   :::column-end:::
:::row-end:::
 
### Switzerland

:::row:::
    :::column span="":::
        **Entity**

        Swiss Social Security Number AHV

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `CHSocialSecurityNumber` to the `piiCategories` parameter. `CHSocialSecurityNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `fr`, `de`, `it`
      
   :::column-end:::
:::row-end:::


### Taiwan 

:::row:::
    :::column span="":::
        **Entity**

        Taiwan National ID

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `TWNationalID` to the `piiCategories` parameter. `TWNationalID` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       Taiwan Resident Certificate (ARC/TARC)

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `TWResidentCertificate` to the `piiCategories` parameter. `TWResidentCertificate` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

        Taiwan Passport Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `TWPassportNumber` to the `piiCategories` parameter. `TWPassportNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::

### United Kingdom

:::row:::
    :::column span="":::
        **Entity**

        U.K. Driver's License Number

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `UKDriversLicenseNumber` to the `piiCategories` parameter. `UKDriversLicenseNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
    :::column-end:::
    
:::row-end:::
:::row:::
    :::column span="":::

       U.K. Electoral Roll Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `UKNationalInsuranceNumber` to the `piiCategories` parameter. `UKNationalInsuranceNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.K. National Health Service (NHS) Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `UKNationalHealthNumber` to the `piiCategories` parameter. `UKNationalHealthNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.K. National Insurance Number (NINO)

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `UKNationalInsuranceNumber` to the `piiCategories` parameter. `UKNationalInsuranceNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.K. or U.S. Passport Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `USUKPassportNumber` to the `piiCategories` parameter. `USUKPassportNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.K. Unique Taxpayer Reference Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `UKUniqueTaxpayerNumber` to the `piiCategories` parameter. `UKUniqueTaxpayerNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::


### United States

:::row:::
    :::column span="":::
        **Entity**

        U.S. Social Security Number (SSN)

    :::column-end:::
    :::column span="2":::
        **Details**

        To get this entity category, add `USSocialSecurityNumber` to the `piiCategories` parameter. `USSocialSecurityNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::
      **Supported document languages**

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.S. Driver's License Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `USDriversLicenseNumber` to the `piiCategories` parameter. `USDriversLicenseNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.S. or U.K. Passport Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `USUKPassportNumber` to the `piiCategories` parameter. `USUKPassportNumber` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.S. Individual Taxpayer Identification Number (ITIN)

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `USIndividualTaxpayerIdentification` to the `piiCategories` parameter. `USIndividualTaxpayerIdentification` will be returned in the API response if detected.
      
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.S. Drug Enforcement Agency (DEA) Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `DrugEnforcementAgencyNumber` to the `piiCategories` parameter. `DrugEnforcementAgencyNumber` will be returned in the API response if detected.
      
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
:::row:::
    :::column span="":::

       U.S. Bank Account Number

    :::column-end:::
    :::column span="2":::

        To get this entity category, add `USBankAccountNumber` to the `piiCategories` parameter. `USBankAccountNumber` will be returned in the API response if detected.
        
        Also returned with `domain=phi`.
    :::column-end:::
    :::column span="":::

      `en`
      
   :::column-end:::
:::row-end:::
