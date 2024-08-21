---
title: Document Intelligence US mortgage documents
titleSuffix: Azure AI services
description: Use Document Intelligence prebuilt models to analyze and extract key fields from mortgage documents.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 05/07/2024
ms.author: lajanuar
monikerRange: '>=doc-intel-4.0.0'
---
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD049 -->
<!-- markdownlint-disable MD001 -->

# Document Intelligence mortgage document models

**This content applies to:** ![checkmark](media/yes-icon.png) **v4.0 (preview)** ![checkmark](media/yes-icon.png)

The Document Intelligence Mortgage models use powerful Optical Character Recognition (OCR) capabilities and deep learning models to analyze and extract key fields from mortgage documents. Mortgage documents can be of various formats and quality. The API analyzes mortgage documents and returns a structured JSON data representation. The models currently support English-language documents only.

**Supported document types:**

* Uniform Residential Loan Application (Form 1003)
* Uniform Underwriting and Transmittal Summary (Form 1008)
* Closing Disclosure form


## Development options

::: moniker range="doc-intel-4.0.0"

Document Intelligence v4.0 (2024-07-31-preview) supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Mortgage model**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/operation-groups?view=rest-aiservices-v4.0%20(2024-07-31-preview)&preserve-view=true)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)|**&bullet; prebuilt-mortgage.us.1003</br>&bullet; prebuilt-mortgage.us.1008</br>&bullet; prebuilt-mortgage.us.closingDisclosure**|
::: moniker-end

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Try mortgage documents data extraction

To see how data extraction works for the mortgage documents service, you need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/).

* A [Document Intelligence instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

## Document Intelligence Studio

1. On the [Document Intelligence Studio home page](https://documentintelligence.ai.azure.com/studio), select **Mortgage**.

1. You can analyze the sample mortgage documents or upload your own files.

1. Select the **Run analysis** button and, if necessary, configure the **Analyze options**:

    :::image type="content" source="media/studio/run-analysis-analyze-options.png" alt-text="Screenshot of Run analysis and Analyze options buttons in the Document Intelligence Studio.":::

> [!div class="nextstepaction"]
> [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)

## Supported languages and locales

*See* our [Language Support—prebuilt models](language-support-prebuilt.md) page for a complete list of supported languages.

## Field extraction 1003 Uniform Residential Loan Application (URLA)

The following are the fields extracted from a 1003 URLA form in the JSON output response.

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`LenderLoanNumber`|`string`|Lender loan number or universal loan identifier|10Bx939c5543TqA1144M999143X38|
|`AgencyCaseNumber`|`string`|Agency case number|115894|
|`Borrowers`|`array`|||
|`Borrowers.*`|`object`|||
|`Borrowers.*.Name`|`string`|Borrower's full name as written on the form|Gwen Stacy|
|`Borrowers.*.CoBorrowerNames`|`string`|Coborrower's full name as written on the form|Glory Grant|
|`Borrowers.*.SocialSecurityNumber`|`string`|Borrower's social security number|557-99-7283|
|`Borrowers.*.BirthDate`|`date`|Borrower's date of birth|11/07/1989|
|`Borrowers.*.CitizenshipType`|`selectionGroup`|Borrower's citizenship|:selected: U.S. Citizen<br>:unselected: Permanent Resident Alien<br>:unselected: Non-Permanent Resident Alien|
|`Borrowers.*.CreditApplicationType`|`selectionGroup`|Borrower's credit type|:selected: I'm applying for individual credit.<br>:unselected: I'm applying for joint credit.|
|`Borrowers.*.NumberOfBorrowers`|`integer`|Total number of borrowers|1|
|`Borrowers.*.MaritalStatus`|`selectionGroup`|Borrower's marital status|:selected: Married<br>:unselected: Separated<br>:unselected: Unmarried|
|`Borrowers.*.NumberOfDependents`|`integer`|Total number of borrower's dependents|2|
|`Borrowers.*.DependentsAges`|`string`|Age of borrower's dependents|10, 11|
|`Borrowers.*.HomePhoneNumber`|`phoneNumber`|Borrower's home phone number|(818) 246-8900|
|`Borrowers.*.CellPhoneNumber`|`phoneNumber`|Borrower's cell phone number|(831) 728-4766|
|`Borrowers.*.WorkPhoneNumber`|`phoneNumber`|Borrower's work phone number|(987) 213-5674|
|`Borrowers.*.CurrentAddress`|`address`|Borrower's current address|1634 W Glenoaks Blvd<br>Glendale CA 91201 United States|
|`Borrowers.*.YearsInCurrentAddress`|`integer`|Years in current address|1|
|`Borrowers.*.MonthsInCurrentAddress`|`integer`|Months in current address|1|
|`Borrowers.*.CurrentHousingExpenseType`|`selectionGroup`|Borrower's housing expense type|:unselected: No primary housing expense:selected: Own:unselected: Rent|
|`Borrowers.*.CurrentMonthlyRent`|`number`|Borrower's monthly rent|1,600.00|
|`Borrowers.*.SignedDate`|`date`|Borrower's signature date|03/16/2021|
|`Borrowers.*.CoBorrowerSignedDate`|`date`|Coborrower's signature date|03/16/2021|
|`Borrowers.*.CurrentEmployment`|`object`|||
|`Borrowers.*.CurrentEmployment.DoesNotApply`|`boolean`|Checkbox state of 'Doesn't apply'|:selected:|
|`Borrowers.*.CurrentEmployment.EmployerName`|`string`|Borrower's employer or business name|Spider Wb Corp.|
|`Borrowers.*.CurrentEmployment.EmployerPhoneNumber`|`phoneNumber`|Borrower's employer phone number|(390) 353-2474|
|`Borrowers.*.CurrentEmployment.EmployerAddress`|`address`|Borrower's employer address|3533 Band Ave<br>Glendale CA 92506 United States|
|`Borrowers.*.CurrentEmployment.PositionOrTitle`|`string`|Borrower's position or title|Language Teacher|
|`Borrowers.*.CurrentEmployment.StartDate`|`date`|Borrower's employment start date|01/08/2020|
|`Borrowers.*.CurrentEmployment.GrossMonthlyIncomeTotal`|`number`|Borrower's gross monthly income total|4,254.00|
|`Loan`|`object`|||
|`Loan.Amount`|`number`|Loan amount|156,000.00|
|`Loan.PurposeType`|`selectionGroup`|Loan purpose type|:unselected: Purchase:selected: Refinance:unselected: Other|
|`Loan.OtherPurpose`|`string`|Other loan purpose type|Construction|
|`Loan.RefinanceType`|`selectionGroup`|Loan refinance type|:selected: No Cash Out<br>:unselected: Limited Cash Out<br>:unselected: Cash Out|
|`Loan.RefinanceProgramType`|`selectionGroup`|Loan refinance program type|:unselected: Full Documentation:selected: Interest Rate Reduction<br>:unselected: Streamlined without Appraisal<br>:unselected: Other|
|`Loan.OtherRefinanceProgram`|`string`|Other loan refinance program type|Cash-out refinance|
|`Property`|`object`|||
|`Property.Address`|`address`|Property address|1634 W Glenoaks Blvd<br>Glendale CA 91201 Los Angeles|
|`Property.NumberOfUnits`|`integer`|Number of units|1|
|`Property.Value`|`number`|Property value|200,000.00|
|`Property.OccupancyStatus`|`selectionGroup`|Property occupancy status|:selected: Primary Residence<br>:unselected: Second Home<br>:unselected: Investment Property|
|`Property.IsFhaSecondaryResidence`|`boolean`|Checkbox state of '`FHA` Secondary Residence'|:unselected:|
|`Property.MixedUseProperty`|`selectionGroup`|Is the property a mixed-use property?|:selected: NO:unselected: YES|
|`Property.ManufacturedHome`|`selectionGroup`|Is the property a manufactured home?|:selected: NO:unselected: YES|

## [2024-02-29-preview](#tab/2024-02-29-preview)


### Supported languages and locales



| Supported Languages | Details |
|:--------------------|:-------:|
|English|United States (`en-US`)|


### Supported document fields

#### mortgage.us.1003

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`LenderLoanNumber`|`string`|Lender loan number or universal loan identifier|10Bx939c5543TqA1144M999143X38|
|`AgencyCaseNumber`|`string`|Agency case number|115894|
|`Borrower`|`object`|||
|`Borrower.Name`|`string`|Borrower's full name as written on the form|Gwen Stacy|
|`Borrower.SocialSecurityNumber`|`string`|Borrower's social security number|557-99-7283|
|`Borrower.BirthDate`|`date`|Borrower's date of birth|11/07/1989|
|`Borrower.CitizenshipType`|`selectionGroup`|Borrower's citizenship|:selected: U.S. Citizen<br>:unselected: Permanent Resident Alien<br>:unselected: Non-Permanent Resident Alien|
|`Borrower.CreditApplicationType`|`selectionGroup`|Borrower's credit type|:selected: I'm applying for individual credit.<br>:unselected: I'm applying for joint credit.|
|`Borrower.NumberOfBorrowers`|`integer`|Total number of borrowers|1|
|`Borrower.MaritalStatus`|`selectionGroup`|Borrower's marital status|:selected: Married<br>:unselected: Separated<br>:unselected: Unmarried|
|`Borrower.NumberOfDependents`|`integer`|Total number of borrower's dependents|2|
|`Borrower.DependentsAges`|`string`|Age of borrower's dependents|10, 11|
|`Borrower.HomePhoneNumber`|`phoneNumber`|Borrower's home phone number|(818) 246-8900|
|`Borrower.CellPhoneNumber`|`phoneNumber`|Borrower's cell phone number|(831) 728-4766|
|`Borrower.WorkPhoneNumber`|`phoneNumber`|Borrower's work phone number|(987) 213-5674|
|`Borrower.CurrentAddress`|`address`|Borrower's current address|1634 W Glenoaks Blvd<br>Glendale CA 91201 United States|
|`Borrower.YearsInCurrentAddress`|`integer`|Years in current address|1|
|`Borrower.MonthsInCurrentAddress`|`integer`|Months in current address|1|
|`Borrower.CurrentHousingExpenseType`|`selectionGroup`|Borrower's housing expense type|:unselected: No primary housing expense:selected: Own:unselected: Rent|
|`Borrower.CurrentMonthlyRent`|`number`|Borrower's monthly rent|1,600.00|
|`Borrower.SignedDate`|`date`|Borrower's signature date|03/16/2021|
|`CoBorrower`|`object`|||
|`CoBorrower.Names`|`string`|Coborrowers' names|Peter Parker<br>Mary Jane Watson|
|`CoBorrower.SignedDate`|`date`|Coborrower's signature date|03/16/2021|
|`CurrentEmployment`|`object`|||
|`CurrentEmployment.DoesNotApply`|`boolean`|Checkbox state of 'Doesn't apply'|:selected:|
|`CurrentEmployment.EmployerName`|`string`|Borrower's employer or business name|Spider Wb Corp.|
|`CurrentEmployment.EmployerPhoneNumber`|`phoneNumber`|Borrower's employer phone number|(390) 353-2474|
|`CurrentEmployment.EmployerAddress`|`address`|Borrower's employer address|3533 Band Ave<br>Glendale CA 92506 United States|
|`CurrentEmployment.PositionOrTitle`|`string`|Borrower's position or title|Language Teacher|
|`CurrentEmployment.StartDate`|`date`|Borrower's employment start date|01/08/2020|
|`CurrentEmployment.GrossMonthlyIncomeTotal`|`number`|Borrower's gross monthly income total|4,254.00|
|`Loan`|`object`|||
|`Loan.Amount`|`number`|Loan amount|156,000.00|
|`Loan.PurposeType`|`selectionGroup`|Loan purpose type|:unselected: Purchase:selected: Refinance:unselected: Other|
|`Loan.OtherPurpose`|`string`|Other loan purpose type|Construction|
|`Loan.RefinanceType`|`selectionGroup`|Loan refinance type|:selected: No Cash Out<br>:unselected: Limited Cash Out<br>:unselected: Cash Out|
|`Loan.RefinanceProgramType`|`selectionGroup`|Loan refinance program type|:unselected: Full Documentation:selected: Interest Rate Reduction<br>:unselected: Streamlined without Appraisal<br>:unselected: Other|
|`Loan.OtherRefinanceProgram`|`string`|Other loan refinance program type|Cash-out refinance|
|`Property`|`object`|||
|`Property.Address`|`address`|Property address|1634 W Glenoaks Blvd<br>Glendale CA 91201 Los Angeles|
|`Property.NumberOfUnits`|`integer`|Number of units|1|
|`Property.Value`|`number`|Property value|200,000.00|
|`Property.OccupancyStatus`|`selectionGroup`|Property occupancy status|:selected: Primary Residence<br>:unselected: Second Home<br>:unselected: Investment Property|
|`Property.IsFhaSecondaryResidence`|`boolean`|Checkbox state of '`FHA` Secondary Residence'|:unselected:|
|`Property.MixedUseProperty`|`selectionGroup`|Is the property a mixed-use property?|:selected: NO:unselected: YES|
|`Property.ManufacturedHome`|`selectionGroup`|Is the property a manufactured home?|:selected: NO:unselected: YES|


The 1003 URLA key-value pairs and line items extracted are in the `documentResults` section of the JSON output.

## Field extraction 1004 Uniform Residential Appraisal Report (URAR)
The following are the fields extracted from a 1004 URAR form in the JSON output response.

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`Subject`|`object`|||
|`Subject.PropertyAddress`|`address`|Address of the property being appraised|123 Main St., Redmond, WA 98052|
|`Subject.BorrowerName`|`string`|Name of the individual or entity that is borrowing funds with the property as collateral|John Doe|
|`Subject.PublicRecordOwner`|`string`|Name of the legal owner of the property as recorded in public records|Jane Smith|
|`Subject.LegalDescription`|`string`|Formal description of the property that is recognized by law|Lot 5, Block 10 of Sunnyside Acres|
|`Subject.AssessorParcelNumber`|`string`|Unique number assigned to the property by the local tax assessor's office|12-34-56-78-90|
|`Subject.TaxYear`|`integer`|Year for which property taxes are being assessed|2023|
|`Subject.RealEstateTaxes`|`number`|Amount of property taxes levied on the property for the specified tax year|3500.00|
|`Subject.OccupantType`|`selectionGroup`|Occupant of the property based on its use (Owner, Tenant, Vacant)|:selected: Owner:unselected: Tenant:unselected: Vacant|
|`Subject.IsPud`|`boolean`|Indicates whether the property is part of a planned unit development (PUD)|:unselected:|
|`Subject.HoaAmount`|`number`|Amount of the periodic payment required by the Homeowners Association (HOA), if applicable|150.00|
|`Subject.HoaPaymentInterval`|`selectionGroup`|Frequency of the Homeowners Association (HOA) payment (per year, per month)|:unselected: per year:selected: per month|
|`Subject.PropertyRightsAppraisedType`|`selectionGroup`|Type of property rights being appraised (Fee Simple, Leasehold, Other)|:selected: Fee Simple:unselected: Leasehold:unselected: Other|
|`Subject.OtherPropertyRightsAppraised`|`string`|Description of other property rights being appraised, if not covered by standard types|Life Estate|
|`Subject.AssignmentType`|`selectionGroup`|Type of appraisal assignment (Purchase Transaction, Refinance Transaction, Other)|:unselected: Purchase Transaction:unselected: Refinance Transaction:selected: Other|
|`Subject.OtherAssignment`|`string`|Description of other types of appraisal assignments, if not covered by standard types|Market Value|
|`Subject.LenderOrClientName`|`string`|Name of the lender or client for whom the appraisal is being conducted|A B C Mortgage Company|
|`Subject.LenderOrClientAddress`|`address`|Address of the lender or client for whom the appraisal is being conducted|456 Finance Ave, Moneytown, MA 67890|
|`Contract`|`object`|||
|`Contract.ContractPrice`|`number`|Agreed-upon price of the property as stated in the purchase contract|250000.00|
|`Contract.ContractDate`|`date`|Date on which the purchase contract was signed|04/15/2023|
|`Contract.IsPropertySellerOwnerOfPublicRecord`|`selectionGroup`|Indicates whether the seller is the owner of public record|:selected: Yes:unselected: No|
|`Neighborhood`|`object`|||
|`Neighborhood.LocationType`|`selectionGroup`|Describes the location of the neighborhood (Urban, Suburban, Rural)|:selected: Urban:unselected: Suburban:unselected: Rural|
|`Neighborhood.BuiltUpType`|`selectionGroup`|Describes the level of development within the neighborhood (Over 75%, 25%-75%, Under 25%)|:selected: Over 75%:unselected: 25%-75%:unselected: Under 25%|
|`Neighborhood.GrowthType`|`selectionGroup`|Describes the growth trend of the neighborhood (Rapid, Stable, Slow)|:unselected: Rapid:selected: Stable:unselected: Slow|
|`Neighborhood.PropertyValuesTrend`|`selectionGroup`|Describes the trend in property values within the neighborhood (Increasing, Stable, Declining)|:unselected: Increasing:selected: Stable:unselected: Declining|
|`Neighborhood.DemandAndSupplyTrend`|`selectionGroup`|Describes the balance of demand and supply for properties in the neighborhood (Shortage, In Balance, Over Supply)|:unselected: Shortage:selected: In Balance:unselected: Over Supply|
|`Neighborhood.MarketingTimeTrend`|`selectionGroup`|Describes the trend in the time it takes to market properties in the neighborhood (Under 3 months, 3-6 months, Over 6 months)|:selected: Under three months:unselected: 3-6 months:unselected: Over six months|
|`Site`|`object`|||
|`Site.Utilities`|`object`|||
|`Site.Utilities.ElectricityType`|`selectionGroup`|Describes the type of electricity service available to the property (Public, Other)|:selected: Public:unselected: Other|
|`Site.Utilities.OtherElectricity`|`string`|Description of other types of electricity service, if it isn't public|Solar Panels|
|`Site.Utilities.GasType`|`selectionGroup`|Describes the type of gas service available to the property (Public, Other)|:selected: Public:unselected: Other|
|`Site.Utilities.OtherGas`|`string`|Description of other types of gas service, if it isn't public|Biogas|
|`Site.Utilities.WaterType`|`selectionGroup`|Describes the type of water service available to the property (Public, Other)|:selected: Public:unselected: Other|
|`Site.Utilities.OtherWater`|`string`|Description of other types of water service, if it isn't public|Private well|
|`Site.Utilities.SanitarySewerType`|`selectionGroup`|Describes the type of sanitary sewer service available to the property (Public, Other)|:selected: Public:unselected: Other|
|`Site.Utilities.OtherSanitarySewer`|`string`|Description of other types of sanitary sewer service, if it isn't public|Composting Toilet|
|`Site.IsFemaSpecialFloodArea`|`selectionGroup`|Indicates whether the property is located in a `FEMA`-designated special flood hazard area|:unselected: Yes:selected: No|
|`Site.FemaFloodZone`|`string`|Specific `FEMA` flood zone in which the property is located, if applicable|Zone X|
|`Site.FemaMapNumber`|`string`|Number of the `FEMA` flood map that includes the property|12345C1234J|
|`Site.FemaMapDate`|`date`|Date of the `FEMA` flood map that includes the property|08/01/2020|
|`Improvements`|`object`|||
|`Improvements.UnitsType`|`selectionGroup`|Describes the type of units present on the property (One, One with Accessory Unit)|:selected: One:unselected: One with Accessory Unit|
|`Improvements.Type`|`selectionGroup`|Describes the type of unit within the building (Det., Att., S-Det./End Unit)|:selected: Det.:unselected: Att.:unselected: S-Det./End Unit|
|`Improvements.Status`|`selectionGroup`|Describes the construction status of the property (Existing, Proposed, Under Const.)|:selected: Existing:unselected: Proposed:unselected: Under Const.|
|`Improvements.DesignStyle`|`string`|Describes the architectural design style of the property|Cape Cod|
|`Improvements.YearBuilt`|`integer`|Year in which the property was originally constructed|1985|
|`Improvements.EffectiveAgeInYears`|`number`|Effective age of the improvements.|20|
|`Improvements.FoundationType`|`selectionGroup`|Describes the type of foundation the property has (Concrete Slab, Crawl Space, Full Basement, Partial Basement)|:unselected: Concrete Slab:unselected: Crawl Space<br>:selected: Full Basement:unselected: Partial Basement|
|`Improvements.BasementArea`|`number`|Total area of the basement in square feet, if applicable|800|
|`Improvements.BasementFinish`|`number`|Percentage of the basement area that is finished|75|
|`Improvements.DamageEvidenceType`|`selectionGroup`|Any evidence of damage, issues, or conditions affecting the property (Infestation, Dampness, Settlement)|:unselected: Infestation<br>:unselected: Dampness:unselected: Settlement|
|`Improvements.HasDeficiencies`|`selectionGroup`|Indicates whether there are any physical deficiencies or adverse conditions affecting the property's livability, soundness, or structural integrity of the property|:unselected: Yes:selected: No|
|`Improvements.Deficiencies`|`string`|Description of the physical deficiencies or adverse conditions, if any|Cracked foundation wall|
|`SalesComparisonApproach`|`object`|||
|`SalesComparisonApproach.ComparableSalePrice1`|`number`|Sale price of the first comparable property used in the sales comparison approach|240000.00|
|`SalesComparisonApproach.ComparableSalePrice2`|`number`|Sale price of the second comparable property used in the sales comparison approach|245000.00|
|`SalesComparisonApproach.ComparableSalePrice3`|`number`|Sale price of the third comparable property used in the sales comparison approach|250000.00|
|`SalesComparisonApproach.IndicatedValue`|`number`|Value of the subject property as indicated by the sales comparison approach|248000.00|
|`Reconciliation`|`object`|||
|`Reconciliation.IndicatedValueBySalesComparisonApproach`|`number`|Value of the subject property as indicated by the sales comparison approach|248000.00|
|`Reconciliation.IndicatedValueByCostApproach`|`number`|Value of the subject property as indicated by the cost approach|250000.00|
|`Reconciliation.IndicatedValueByIncomeApproach`|`number`|Value of the subject property as indicated by the income approach, if applicable|245000.00|
|`Reconciliation.AppraisalType`|`selectionGroup`|Type of appraisal made.|:selected: as is:unselected: subject to completion per plans and specifications based hypothetical condition that the improvements are complete<br>completed:unselected: subject to the following repairs or alterations based on a hypothetical condition that the repairs or alterations are completed, or:unselected: subject to the<br>following required inspection based on the extraordinary assumption that the condition or deficiency doesn't require alteration or repair:|
|`Reconciliation.AppraisedMarketValue`|`number`|Final appraised market value of the subject property|248000.00|
|`Reconciliation.AppraisalEffectiveDate`|`date`|Date on which the appraisal value is considered effective|04/20/2023|
|`PudInfo`|`object`|||
|`PudInfo.IsBuilderInControlOfHoa`|`selectionGroup`|Indicates whether the developer/builder is in control of the Homeowner's Association (HOA)|:selected: Yes:unselected: No|
|`PudInfo.UnitType`|`selectionGroup`|Describes the type of unit within the PUD (Detached, Attached)|:selected: Detached:unselected: Attached|
|`PudInfo.HasMultiDwellingUnits`|`selectionGroup`|Indicates whether the project contains any multi-dwelling units|:unselected: Yes:selected: No|
|`Appraiser`|`object`|||
|`Appraiser.AppraiserName`|`string`|Name of the licensed appraiser who conducted the appraisal|Alice Johnson|
|`Appraiser.CompanyName`|`string`|Name of the appraisal company for which the appraiser works|Valuation Experts LLC|
|`Appraiser.CompanyAddress`|`address`|Physical address of the appraisal company|789 Valuation Blvd, Valuetown, MA 34567|
|`Appraiser.TelephoneNumber`|`phoneNumber`|Telephone number where the appraiser or the appraisal company can be reached|(123) 456-7890|
|`Appraiser.EmailAddress`|`string`|Email address where the appraiser or the appraisal company can be reached|alice.johnson@valuationexperts.com|
|`Appraiser.SignatureAndReportDate`|`date`|Date on which the appraiser signed the appraisal report|04/20/2023|
|`Appraiser.EffectiveDate`|`date`|Date on which the appraisal is considered effective|04/20/2023|
|`Appraiser.PropertyAppraisedAddress`|`address`|Address of the property that was appraised|123 Main St., Anytown, MA 12345|
|`Appraiser.AppraisedValueOfSubjectProperty`|`number`|Final appraised value of the subject property|248000.00|
|`Appraiser.SubjectPropertyStatus`|`selectionGroup`|Inspection status of the subject property at the time of appraisal|:unselected: Didn't inspect subject property<br>:unselected: Did inspect exterior of subject property from street<br>:unselected: Did inspect interior and exterior of subject property|
|`Appraiser.ComparableSalesStatus`|`selectionGroup`|Inspection status of the comparable sales used in the appraisal|:unselected: Didn't inspect exterior of comparable sales from street<br>:unselected: Did inspect exterior of comparable sales from street|

## Field extraction 1005 Verification of employment form 
The following are the fields extracted from a 1005 form in the JSON output response.

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`EmployerNameAndAddress`|`string`|Contact information of the company or organization where the individual is currently or previously employed, including name and address.|CONTOSO CORPORATION<br>123 BUSINESS ROAD<br>METROPOLIS, NY 10101|
|`LenderNameAndAddress`|`string`|Contact information of the financial institution or individual providing a loan, including name and address.|CONTOSO BANK<br>456 FINANCE AVE<br>CENTRAL SQUARE, NY 13036|
|`ApplicantNameAndAddress`|`string`|Contact information of the individual applying for a loan, including name and address.|JOHN DOE<br>789 RESIDENTIAL ST<br>APARTMENT 5<br>SPRINGFIELD, IL 62704|
|`PresentEmployment`|`object`|||
|`PresentEmployment.EmploymentDate`|`date`|Date when the individual's current employment began|03/01/2021|
|`PresentEmployment.PresentPosition`|`string`|Title or role the individual currently holds at their place of employment|ACCOUNT EXECUTIVE|
|`PresentEmployment.CurrentGrossBasePay`|`number`|Amount of money the individual earns before taxes and other deductions|85000|
|`PresentEmployment.CurrentGrossBasePayPeriod`|`selectionGroup`|Frequency with which the individual receives their gross base pay (Annual, Monthly, Weekly, Hourly, Other)|:unselected: Annual<br>:selected: Monthly<br>:unselected: Weekly<br>:unselected: Hourly<br>:unselected: Other (Specify)|
|`PresentEmployment.OtherCurrentGrossBasePayPeriod`|`string`|Description of the other current gross base pay period, if not covered by standard periods|Bi-Weekly|
|`PreviousEmployment`|`object`|||
|`PreviousEmployment.DateHired`|`date`|Date when the applicant was hired for their previous job|01/01/2018|
|`PreviousEmployment.DateTerminated`|`date`|Date when the applicant's employment was terminated or when they left their previous job|10/30/2020|
|`PreviousEmployment.PositionHeld`|`string`|Title or role the applicant held in their previous job|SUPERVISOR|


## Field extraction 1008 Uniform Underwriting and Transmittal Summary

The following are the fields extracted from a 1008 form in the JSON output response.

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`Borrower`|`object`|||
|`Borrower.Name`|`string`|Borrower's full name as written on the form|Valentin Grant|
|`Borrower.NumberOfBorrowers`|`integer`|Total number of borrowers|1|
|`Property`|`object`|||
|`Property.Address`|`address`|Property address|339 U.S. 82, Gulfport, MO 395503, United States|
|`Property.OccupancyStatus`|`selectionGroup`|Property occupancy status|:selected: Primary Residence<br>:unselected: Second Home<br>:unselected: Investment Property|
|`Property.SalesPrice`|`number`|Property sales price|200,000.00|
|`Property.AppraisedValue`|`number`|Property appraised value|200,000.00|
|`Property.PropertyType`|`selectionGroup`|Property type|:selected: one unit<br>:unselected: two units<br>:unselected: three units<br>:unselected: four units<br>:unselected: Condominium<br>:unselected: PUD:unselected: Co-op<br>:unselected: Manufactured Housing<br>:unselected: Single Wide:unselected: Multiwide|
|`Property.FreddieMacProjectClassificationType`|`selectionGroup`|Freddie Mac project classification|:selected: Streamlined Review<br>:unselected: Established Project<br>:unselected: New Project<br>:unselected: Detached Project<br>:unselected: two- to four-unit Project<br>:unselected: Exempt from Review<br>:unselected: Reciprocal Review|
|`Property.FannieMaeProjectClassificationType`|`selectionGroup`|Fannie Mae project classification|:unselected: E Established PUD Project<br>:unselected: F New PUD Project<br>:unselected: P Limited Review - New Condo Project<br>:unselected: Q Limited Review - Established Condo Project<br>:unselected: R Full Review - New Condo Project<br>:unselected: S Full Review - Established Condo Project<br>:unselected: T Fannie Mae Review through `PERS` - Condo Project<br>:unselected: U `FHA`-approved Condo Project<br>:unselected: V Condo Project Review Waived<br>:unselected: one Full Review - Co-op Project<br>:unselected: two Fannie Mae Review through `PERS` - Co-op Project|
|`Property.PropertyRightsType`|`selectionGroup`|Property rights|:selected: Fee Simple<br>:unselected: Leasehold|
|`Mortgage`|`object`|||
|`Mortgage.LoanType`|`selectionGroup`|Mortgage loan type|:unselected: Conventional<br>:selected: `FHA`<br>:unselected: VA<br>:unselected: USDA/RD|
|`Mortgage.AmortizationType`|`selectionGroup`|Mortgage amortizationType type|:selected: Fixed-Rate--Monthly Payments<br>:unselected: Fixed-Rate--Biweekly Payments<br>:unselected: Ballon<br>:unselected: `ARM` (type)<br>:unselected: Other (specify)|
|`Mortgage.LoanPurposeType`|`selectionGroup`|Mortgage loan purpose type|:selected: Purchase<br>:unselected: Cash-Out Refinance<br>:unselected: Limited Cash-Out Refinance (Fannie)<br>:unselected: No Cash-Out Refinance (Freddie)<br>:unselected: Home Improvement<br>:unselected: Construction Conversion/Construction to Permanent|
|`Mortgage.LienPositionType`|`selectionGroup`|Mortgage Lien position type|:selected: First Mortgage<br>:unselected: Second Mortgage|
|`Mortgage.SubordinateFinancingAmount`|`number`|Amount of subordinate financing|50,000|
|`Mortgage.LoanAmount`|`number`|The loan amount stated on the mortgage note|193,000.00|
|`Mortgage.NoteRatePercentage`|`number`|The note rate stated on the mortgage note|6.7500|
|`Mortgage.LoanTermInMonths`|`number`|The loan term in months stated on the mortgage note|360|
|`Mortgage.MortgageOriginatorType`|`selectionGroup`|Mortgage originator type|:unselected: Seller<br>: selected:Broker:unselected:Correspondent|
|`Mortgage.BrokerOrCorrespondentNameAndCompanyName`|`string`|Broker/Correspondent name and company name|Reichardt Stewart United Community Bank|
|`Mortgage.TemporaryBuydownStatus`|`selectionGroup`|Mortgage temporary buydown status|:unselected: Yes<br>:selected: No|
|`Mortgage.TemporaryBuydownTerms`|`string`|Mortgage temporary buydown terms|36|
|`Underwriting`|`object`|||
|`Underwriting.UnderwriterName`|`string`|Underwriter name|Milo Zemlak|
|`Underwriting.AppraiserNameAndLicenseNumber`|`string`|Appraiser name and license number|Twill Rath V/120100|
|`Underwriting.AppraisalCompanyName`|`string`|Appraisal company name|Key Property Solutions|
|`Underwriting.TotalBorrowerIncome`|`number`|Total borrower income|2,000.00|
|`Underwriting.QualifyingRateType`|`selectionGroup`|Underwriting qualifying rate type|:selected: Rate Used for Qualifying<br>:unselected: Initial Bought-Down Rate<br>:unselected: Other|
|`Underwriting.RateUsedForQualifying`|`number`|Underwriting qualifying rate percentage|6.75|
|`Underwriting.InitialBoughtDownRate`|`number`|Underwriting initial bought-down rate|6.75|
|`Underwriting.OtherQualifyingRate`|`number`|Underwriting other qualifying rate|6.75|
|`Underwriting.ProposedMonthlyPaymentTotal`|`number`|Proposed monthly payment total|1,251.79|
|`Underwriting.FundsRequiredToClose`|`number`|Required borrower funds to close|7,000.00|
|`Underwriting.VerifiedAssetsAmount`|`number`|Verified borrower assets|5,000.00|
|`Seller`|`object`|||
|`Seller.Name`|`string`|Seller name|Renner, Hamill, and Harber|
|`Seller.Address`|`address`|Seller address|9180 Landen Curve Apt. 137<br>Gulfport, MO 39503, United States|
|`Seller.Number`|`string`|Seller number|1487FHIUJH579836827|
|`Seller.LoanNumber`|`string`|Seller loan number|84521F5135432x468rd15375fs|
|`Seller.ContactName`|`string`|Contact name|Francisco Donnelly|
|`Seller.ContactPhoneNumber`|`phoneNumber`|Contact phone number|407-930-3985|
|`Seller.InvestorLoanNumber`|`string`|Investor loan number|987654|

The form 1008's key-value pairs and line items extracted are in the `documentResults` section of the JSON output.

## Field extraction mortgage closing disclosure

The following are the fields extracted from a mortgage closing disclosure form in the JSON output response.

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`Closing`|`object`|||
|`Closing.IssueDate`|`date`|Issue date|4/15/2013|
|`Closing.ClosingDate`|`date`|Closing date|4/15/2013|
|`Closing.DisbursementDate`|`date`|Disbursement date|4/15/2013|
|`Closing.SettlementAgent`|`string`|Settlement agent|Epsilon Title Co.|
|`Closing.FileNumber`|`string`|File number|12-3456|
|`Closing.PropertyAddress`|`address`|Property address|123 Main St., Redmond WA 98052|
|`Closing.SalePrice`|`number`|Sale price|$180,000|
|`Transaction`|`object`|||
|`Transaction.BorrowerName`|`string`|Borrower's name|Michael Jones and Mary Stone|
|`Transaction.BorrowerAddress`|`address`|Borrower's address|123 Microsoft Way, Redmond WA 98052|
|`Transaction.SellerName`|`string`|Seller's name|Renner, Hamill, and Harber|
|`Transaction.SellerAddress`|`address`|Seller's address|9180 Landen Curve Apt. 137<br>Gulfport, MO 39503, United States|
|`Transaction.LenderName`|`string`|Lender's name|Ficus Bank|
|`Transaction.BorrowerClosingCosts`|`number`|Borrower's closing costs|$9,712.10|
|`Transaction.BorrowerCashToCloseType`|`selectionGroup`|Borrower's cash to close type|:selected: From:unselected: To|
|`Transaction.BorrowerCashToCloseAmount`|`number`|Borrower's cash to close amount|$9,712.10|
|`Transaction.SellerCashToCloseType`|`selectionGroup`|Seller's cash to close type|:unselected: From:selected: To|
|`Transaction.SellerCashToCloseAmount`|`number`|Seller's cash to close amount|$64,414.96|
|`Loan`|`object`|||
|`Loan.Term`|`string`|Loan term|30 years|
|`Loan.Purpose`|`string`|Loan purpose|Purchase|
|`Loan.Product`|`string`|Loan product|Fixed Rate|
|`Loan.Type`|`selectionGroup`|Loan type|:selected: Conventional:unselected: `FHA`:unselected: VA:unselected:|
|`Loan.OtherType`|`string`|Other loan type|`RHS`|
|`Loan.IdentificationNumber`|`string`|Loan identification number|123456789|
|`Loan.MortgageInsuranceCaseNumber`|`string`|Mortgage insurance case number|000654321|
|`Loan.Amount`|`number`|Loan amount|$162,000|
|`Loan.InterestRate`|`number`|Interest rate|3.875|
|`Loan.MonthlyPrincipalAndInterest`|`number`|Monthly principal and interest|$761.78|
|`Loan.EstimatedTaxInsuranceAndAssessmentsPerMonth`|`number`|Estimated taxes, insurance, and assessments per month|$356.13|

The mortgage closing disclosure key-value pairs and line items extracted are in the `documentResults` section of the JSON output.

## Next steps

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio).

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.
 