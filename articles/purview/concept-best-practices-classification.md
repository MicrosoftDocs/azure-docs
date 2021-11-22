---
title: Azure Purview Classification best practices
description: This article provides best practices for Classification in Azure Purview.
author: amberz
ms.author: amberz
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 11/18/2021
---

# Azure Purview Classification best practices

Data classification, in the context of Azure Purview, is a way of categorizing data assets by assigning unique logical labels or class to the data assets based on the business context of data. 
For example, Passport Number, Driving License Number, Credit Card Number, SWIFT code, Person’s Name, etc.
When data assets are classified, you can understand, search and govern it better. Most importantly it helps to understand the risks associated with data and implement measures to  protect sensitive or important data from ungoverned proliferation and unauthorized access across the data estate. 
 
Azure Purview provides automated classification capability while you scan your data sources, offering 200+ system built-in classifications as well as ability to create custom classifications for your data. Classifications can be applied to assets either automatically (when configured as part of scan) or can be manually edited in the Purview Studio post the scan and ingestion.  
 
## Intended audience

* Data Engineer 
* Domain Owner 
* Business Owner
* Data Consumers
* Data Owners and Stewards

## Why do you need adopt classification? 

Classification is the process of organizing data into **logical categories** that make it easy to retrieve, sort and identify for future use. This can be of particular importance for data governance. There are many reasons why classification is important, and the following are the most common reasons : 
* Aids in narrowing down the search for data assets you are interested in
* Helps in organizing and understanding the variety of data class that are important in your organization and where there are stored
* Helps in understanding the risks associated with the data assets which are of importance and undertaking appropriate measures to mitigate the risks

For example, consider the classification labels for *Customers* table in Azure SQL Database (below). Classifications are applied at asset level as well as schema level.

:::image type="content" source="./media/concept-best-practices/classification-customers-example-1.png" alt-text="Screen shot showing a classification in Azure SQL Database." lightbox="./media/concept-best-practices/classification-customers-example-1.png":::

**System classifications**: Azure Purview supports a large set of system classifications by default. For the entire list of available system classifications, see [Supported classifications in Azure Purview](./supported-classifications.md). 
In the example above, Person’s Name is a system classification. 

**Custom classifications**: Custom classifications can be created when you want to classify assets based on a pattern or a specific column name which is not available as a default system classification. 
Custom classifications rules can be based on a **regular expression** pattern or **dictionary**. 

For example, if employee ID column follows EMPLOYEE{GUID} pattern  (e.g. EMPLOYEE9c55c474-9996-420c-a285-0d0fc23f1f55), in this case, you can use a regular expression such as , \^EMPLOYEE\[A-Za-z0-9\]{8}-\[A-Za-z0-9\]{4}-\[A-Za-z0-9\]{4}-\[A-Za-z0-9\]{4}-\[A-Za-z0-9\]{12}\$ to create your own custom classification

:::image type="content" source="./media/concept-best-practices/classification-classification-rules-example-2.png" alt-text="Screen shot showing a classification rule." lightbox="./media/concept-best-practices/classification-classification-rules-example-2.png":::

> [!NOTE]
> Sensitivity labels are different from classifications. Sensitivity labels are categorization in the context of data security and privacy, such as Highly Confidential, Restricted, Public, etc. To use sensitivity labels in Azure Purview, you'll need at least one Microsoft 365 license/account within the same Azure Active Directory (AAD) tenant as your Azure Purview account. Read the [differences](sensitivity-labels-frequently-asked-questions.yml#what-is-the-difference-between-classifications-and-sensitivity-labels-in-azure-purview) between the two for more details.

## Classification best practice and considerations

### Considerations

* In Purview, classifications can be assigned at asset level and/or at column level, automatically by including relevant classifications in the scan rule or manually after ingesting the metadata into Purview.
* To automatic assignment, review [supported data source types](./purview-connector-overview.md).
* Before you scan your data sources in Azure Purview, it is important to understand your data, and configure appropriate scan rule set (selecting relevant system classification, custom classifications, or a combination of both) to classify your data assets as this could impact your scan performance. Refer to [supported classification](./supported-classifications.md) in product documentation for more details.
* To decide what classifications are required to be applied to the assets prior to scanning, considering the use case of how classifications would be used. Unnecessary classification labels may look noisy and even misleading for data consumers. Consider below aspects to decide, for example:
    * Classifications can be used to describe nature of the data that exist in data asset or schema being scanned. In other words, customers can identify the content of data asset or schema from the classification labels while searching the catalog.
    * Classifications can be used to set priorities and develop a plan to achieve security and compliance needs of an organization. 
    * Classifications can be used to describe the phases in their data prep processes (raw zone, landing zone, etc.) and assign the classifications to specific assets to mark where they are in the process.

* Custom classifications cannot be applied on document type assets using custom classification rules. Classifications for such types can be applied manually only.
* Purview scanner applies data sampling rules for deep scan (subject to classification) for both system and custom classifications. The sampling rule is based on the type of data sources. Refer [this](./sources-and-scans.md#sampling-within-a-file) document for more details. 
    * For structured file types, it samples the top 128 rows in each column or the first 1 MB, whichever is lower.
    * For document file formats, it samples the first 20 MB of each file.
    * If a document file is larger than 20 MB, then it is not subject to a deep scan (subject to classification). In that case, Purview captures only basic meta data like file name and fully qualified name.
    * For tabular data sources (SQL, CosmosDB), it samples the top 128 rows.
* The sampling rules apply to resource sets as well. Read [here](./sources-and-scans.md#resource-set-file-sampling) for more details.
* For **encrypted source** data assets, Purview will only pick file names, fully qualified names and schema details for structured file types and database tables. For classification to work, decrypt the encrypted data before running scans.
* If classifications are applied manually from Purview Studio, the manually applied classifications are retained in the subsequent scans. 
* Subsequent scans would not remove any classifications from assets, if they were detected previously even if the classification rules are not applicable.
* Custom classifications are not included in any default scan rules, therefore, if automatic assignment of custom classifications is expected, it is required to deploy and use a custom scan rule including the custom classification to run the scan. 

### Best practices

#### Scan rule set:

* A scan rule set determines what file types you are scanning and what classification rules will be applied to the data assets you are scanning. It is recommended to select/create and configure appropriate scan rule set for the data source being scanned. 
* Specific to classification, select relevant system classifications and/or custom classifications (if you have created one for the data being scanned). 
For example, only specific 7 system and custom classifications have been selected for the data source being scanned (e.g., Financial data)

    :::image type="content" source="./media/concept-best-practices/classification-select-classification-rules-example-3.png" alt-text="Screen shot showing a selected classification rule." lightbox="./media/concept-best-practices/classification-select-classification-rules-example-3.png":::

#### Annotation management:

* While deciding on classifications to be applied, it is recommended to:
    * Start with **Data Map>Annotation Management>Classification** blade and 
    * Review the available system classifications to be applied on data assets being scanned. The formal names of system classifications have MICROSOFT* prefix
 
    :::image type="content" source="./media/concept-best-practices/classification-classification-example-4.png" alt-text="Screen shot showing classifications." lightbox="./media/concept-best-practices/classification-classification-example-4.png":::

    * Create custom classification name, if necessary, first from this blade and then o	move to **Data Map>Annotation Management>Classification rules** and create the classification rule for the custom classification name created in the previous step

#### Custom classification:

* Create custom classification(s), only if the available system classifications do not meet your needs.
* For the **name** of custom classification, it's a good practice to use a namespace convention, i.e.,**\<company name>.\<business unit>.\<custom classification name>**. 
As an example, for the custom EMPLOYEE_ID classification for a company named Contoso, the name of your custom classification would be CONTOSO.HR.EMPLOYEE_ID, the friendly name is stored in the system as HR.EMPLOYEE ID.

    :::image type="content" source="./media/concept-best-practices/classification-custom-classification-example-5.png" alt-text="Screen shot showing a EMPLOYEE_ID custom classifications." lightbox="./media/concept-best-practices/classification-custom-classification-example-5.png":::

* While creating and configuring the classification rule for a custom classification:

    * Select the appropriate classification **name** for which the classification **rule** is to be created

    * Purview supports two methods for custom classification rule – Regular Expression and Dictionary 

    * Select appropriate method for the classification rule:

        1. Use **Regular Expression** (regex) method if the data population can be expressed through a generic pattern
        2. Use **Dictionary** method only if the list of values in the dictionary file represents all possible values of data to be classified (considering future values as well)
 
            :::image type="content" source="./media/concept-best-practices/classification-custom-classification-rule-example-6.png" alt-text="Screen shot showing setting of regular expression and dictionary." lightbox="./media/concept-best-practices/classification-custom-classification-rule-example-6.png":::

* **For regex method**:

    * Configure the regex pattern for the data to be classified. Ensure that the regex pattern is generic enough to cater for the data being classified.

    * Purview also provides feature to generate a suggested regex pattern. After uploading a sample data file, select one of the suggested patterns and select Add to Patterns to use the suggested data and column patterns. You can tweak the suggested patterns, or you may also type your own patterns without uploading a file.

    * You may also configure the column name pattern additionally, for the column to be classified to minimize false positives.

    * Also configure the “Minimum match threshold” parameter acceptable for your data matching the data pattern to apply classification. The threshold values can be between 1% and 100%. It is typically suggested to use at least 60% as the threshold to avoid false positives. However, you may configure as necessary for the specific classification scenarios (for example, it may be as low as 1% as well if you want to detect and apply classification for any value in data if it matches the pattern). 
  
        :::image type="content" source="./media/concept-best-practices/classification-custom-classification-rule-regular-expressions-example-7.png" alt-text="Screen shot showing regex method of custom classification rule." lightbox="./media/concept-best-practices/classification-custom-classification-rule-regular-expressions-example-7.png":::

    * The option to set Minimum match rule is automatically disabled, if more than one data pattern is added to the classification rule.

    * Use the “**Test classification rule**” and test with a sample data to verify if the classification rule is working as expected. Please ensure in the sample data (e.g., .csv file) at least 3 columns are present including the column on which the classification is to be applied. If the test is successful, you should see the classification label on the column (example below)
   
        :::image type="content" source="./media/concept-best-practices/classification-test-classification-rule-example-8.png" alt-text="Screen shot showing classification when test classification is successful." lightbox="./media/concept-best-practices/classification-test-classification-rule-example-8.png":::

* **For Dictionary method**:

    * The dictionary method is good to fit enumeration data or if the dictionary (list of possible values) is available.

    * It supports .csv or .tsv file, with the file size limit as 30MB.

#### Custom Classification Scenarios / Examples

1.	**How “threshold” parameter works in the regular expression?**

    * Consider below sample source data for example, where there are 5 columns and custom classification rule would be applied be columns named as ‘Sample_col1, Sample_col2, Sample_col3’ for the data pattern “N{Digit}{Digit}{Digit}AN”
    
        :::image type="content" source="./media/concept-best-practices/classification-custom-classification-rule-example-source-data-9.png" alt-text="Screen shot showing example source data." lightbox="./media/concept-best-practices/classification-custom-classification-rule-example-source-data-9.png":::

    * The custom classification is named as ‘NDDDAN’

    * The classification rule (regex for data pattern) is: ^N[0-9]{3}AN$
     
        :::image type="content" source="./media/concept-best-practices/classification-custom-classification-ndddan-10.png" alt-text="Screen shot showing a custom classification rule." lightbox="./media/concept-best-practices/classification-custom-classification-ndddan-10.png":::

    * The threshold would be computed as below for the “N[0-9]{3}AN” pattern:
     
        :::image type="content" source="./media/concept-best-practices/classification-custom-classification-rule-threshold-11.png" alt-text="Screen shot showing threshold of custom classification rule." lightbox="./media/concept-best-practices/classification-custom-classification-rule-threshold-11.png":::

    * If you keep the threshold as 55% only Sample_col1 and Sample_col2 will be classified. Sample_col3 does not meet 55% threshold criteria as shown above.
      
        :::image type="content" source="./media/concept-best-practices/classification-test-custom-classification-rule-12.png" alt-text="Screen shot showing result of high threshold criteria" lightbox="./media/concept-best-practices/classification-test-custom-classification-rule-12.png":::

2.	**How to use both data and column patterns?**

    * Suppose for the given sample data, where column B and Column C both have similar data patterns, and you would like to classify on column B based on the data pattern “P[0-9]{3}[A-Z]{2}”. 
       
        :::image type="content" source="./media/concept-best-practices/classification-custom-classification-sample-data-13.png" alt-text="Screen shot showing sample data." lightbox="./media/concept-best-practices/classification-custom-classification-sample-data-13.png":::

    * Use the column pattern along with data pattern to ensure only “Product ID” column is classified.

        :::image type="content" source="./media/concept-best-practices/classification-custom-classification-rule-14.png" alt-text="Screen shot showing classification rule." lightbox="./media/concept-best-practices/classification-custom-classification-rule-14.png":::

        > [!NOTE]
        > The column pattern is verified as an “AND” condition with data pattern.
    
    * Use the “Test classification rule” and test with a sample data to verify if the classification rule is working as expected.

        :::image type="content" source="./media/concept-best-practices/classification-custom-classification-rule-column-pattern-15.png" alt-text="Screen shot showing column pattern." lightbox="./media/concept-best-practices/classification-custom-classification-rule-column-pattern-15.png":::

3.	**How to use multiple column patterns?**

    If there are multiple column patterns to be classified for same classification rule, use pipe separated column names. For example, for columns Product ID, Product_ID, ProductID, etc. use below:
        
    :::image type="content" source="./media/concept-best-practices/classification-custom-classification-rule-multiple-column-patterns-16.png" alt-text="Screen shot showing multiple column patterns." lightbox="./media/concept-best-practices/classification-custom-classification-rule-multiple-column-patterns-16.png":::

    Refer to [regex alternation construct](/docs/docs/standard/base-types/regular-expression-language-quick-reference) for more details.

#### Manually applying/editing classification from Purview Studio:

* You can manually edit and update classification labels both at asset and schema levels in Purview Studio. However, note that applying classification manually at schema level will prevent update on future scans.
         
    :::image type="content" source="./media/concept-best-practices/classification-update-classification-17.png" alt-text="Screen shot showing update classification." lightbox="./media/concept-best-practices/classification-update-classification-17.png":::
          
    :::image type="content" source="./media/concept-best-practices/classification-update-classification-18.png" alt-text="Screen shot showing update column classification." lightbox="./media/concept-best-practices/classification-update-classification-18.png":::

* Purview allows deletion of custom classification rules, along with options to remove the classification applied on the data assets (example below)
           
    :::image type="content" source="./media/concept-best-practices/classification-delete-classification-rule-19.png" alt-text="Screen shot showing delete classification rule." lightbox="./media/concept-best-practices/classification-delete-classification-rule-19.png":::

* Purview also allows bulk edit of classification through Purview Studio. Read [here](how-to-bulk-edit-assets.md) for more details.

## Next steps
-  [Manage data sources](./manage-data-sources.md)
