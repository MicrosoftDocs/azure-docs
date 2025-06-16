---  
title: Exploring and interacting with lake data using Azure Data Explorer and KQL  
titleSuffix: Microsoft Security  
description: This article describes how to explore and interact with lake data using Azure Data Explorer and KQL. You'll learn how to connect to lake data, query it, and visualize the results.  
author: EdB-MSFT
ms.topic: how-to  
ms.date: 05/13/2025
ms.author: edbaynash
  

# Customer intent: As an administrator I want to explore and interact with lake data using Azure Data Explorer and KQL so that I can analyze and visualize the data.

---  
   
# Azure Data Explorer, KQL, and the Microsoft Sentinel data lake  

Azure Data Explorer is a fast and highly scalable data analytics service designed for real-time analysis of large volumes of security-related data, making it an ideal tool for interacting with the Microsoft Sentinel data lake. The Microsoft Sentinel data lake serves as a centralized repository for storing and managing security data from various sources, enabling organizations to analyze and visualize their security landscape. By using the Kusto Query Language (KQL), Azure Data Explorer allows users to run complex queries on structured, semi-structured, and unstructured security data, helping to detect threats, investigate incidents, create charts, and improve overall security posture. Its seamless integration with Microsoft Sentinel and other Azure services provides a powerful platform for advanced analytics and data-driven decision-making in security operations.

Use Azure Data Explorer to interactively run KQL queries against all security data stored in the data lake. This article explains how to set up a connection and run a sample query using Azure Data Explorer. For more information about Azure Data Explorer, see [Azure Data Explorer documentation](/azure/data-explorer/?tabs=azure-data-explorer).

The Sentinel lake explorer KQL query tool is another KQL tool that allows you to explore and visualize data stored in the Microsoft Sentinel data lake from within the Defender portal and create jobs to promote data to the Analytics tier. For more information, see [Microsoft Sentinel lake explorer KQL queries](kql-queries.md).

For more information about KQL, see [Kusto Query Language documentation](/kusto/query/syntax-conventions?view=azure-data-explorer&preserve-view=true)

## Onboard to the Microsoft Sentinel data lake

If you have not already onboarded to the Microsoft Sentinel data lake, see [Onboarding to Microsoft Sentinel data lake](./sentinel-lake-onboarding.md). If you have recently onboarded to the data lake, it may take some time until you have ingested a sufficient volume of data before you can create meaningful analyses using KQL.


## Prerequisites
 

Ensure that you have access to your account credentials to sign in to Azure Data Explorer.
Any of the following roles grants access to the data lake 
+ Global Reader
+ Security Reader

For more information about roles and permissions, see [Roles and permissions for the Microsoft Sentinel data lake](./sentinel-lake-permissions.md).


## Connect to the data lake via Azure Data Explorer
 
1. Navigate to Azure Data Explorer at [https://dataexplorer.azure.com/](https://dataexplorer.azure.com/).
1. On the welcome page, select **Skip and sign in** to sign in with your corporate credentials.
1. Sign in with your corporate credentials. 

    :::image type="content" source="./media/kql-adx-data-lake-access/azure-data-explorer-welcome.png" lightbox="./media/kql-adx-data-lake-access/azure-data-explorer-welcome.png"  alt-text="A screenshot showing the Azure data explorer welcome screen.":::

1. In the left hand menu bar, select **Query**.
1. Select **+ Add**, then select **Connection**.
    :::image type="content" source="./media/kql-adx-data-lake-access/add-connection.png" lightbox="./media/kql-adx-data-lake-access/add-connection.png" alt-text="A screenshot showing how to add a connection.":::
1. Enter your **Connection URI** and a **Display name** and select **Add**. Use the following URI: `https://api.securityplatform.microsoft.com/lake/kql`

    :::image type="content" source="./media/kql-adx-data-lake-access/enter-connection-uri.png" lightbox="./media/kql-adx-data-lake-access/enter-connection-uri.png" alt-text="A screenshot showing the add connection URI dialog.":::

1. In the **Display name** text box, enter a descriptive name for your connection.
    :::image type="content" source="./media/kql-adx-data-lake-access/enter-connection-uri.png" lightbox="./media/kql-adx-data-lake-access/enter-connection-uri.png" alt-text="A screenshot showing the add connection URI dialog.":::

1. The Untrusted Warning pop-up appears. Select the **Trust**.    
    :::image type="content" source="./media/kql-adx-data-lake-access/untrusted-host.png" lightbox="./media/kql-adx-data-lake-access/untrusted-host.png" alt-text="A screenshot showing the untrusted host dialog.":::
1. A second **Untrusted host** pop-up appears. 
1. Enter the URL provided in the pop-up text, and select ***Trust**. 

> [!NOTE] 
> The URI to be entered isn't the same as the connection URI you entered in the previous step. 
  
   :::image type="content" source="./media/kql-adx-data-lake-access/untrusted-host-uri.png"  lightbox="./media/kql-adx-data-lake-access/untrusted-host-uri.png" alt-text="A screenshot showing the untrusted host dialog requesting confirmation of the URI.":::

Your new connection appears in the left navigation panel of Azure Data Explorer with the descriptive display name.

## Run a sample KQL query
 
To verify your connection and explore the data, run a sample KQL query that returns the top 100 rows from the Entra AADRiskyUsers table:

In the query explorer, enter the following query:

```kusto
external_table("microsoft.entra.id.AADRiskyUsers")
| take 100
``` 

Select **Run** to run the query and review the results.
 :::image type="content" source="media/kql-adx-data-lake-access/query-to-check-connectivity.png" lightbox="media/kql-adx-data-lake-access/query-to-check-connectivity.png" alt-text="A screenshot showing a sample query.":::

Once you have verified that your connection is working, consider exploring additional KQL capabilities to further analyze and interact with your security data. For more detailed information on KQL syntax and features, see the [Kusto Query Language documentation](/kusto/query/?view=azure-data-explorer).

> [!IMPORTANT]
> When running KQL queries against the Microsoft Sentinel data lake in Azure data explorer, you must use the `external_table` function to access the data. You dont need to use `external_table` when using KQL queries in the Microsoft Sentinel lake explorer.

## Sample KQL queries
 
Use the following queries to explore the data in the data lake. You can use these queries as a starting point and modify them to suit your needs. For examples using machine learning, see [KQL and machine learning in the Microsoft Sentinel data lake](kql-and-machine-learning.md)

### Risky users

List the top 10 most risky users with most sign in attempts (failed or successful) over the last 24 hours

```kusto
external_table("microsoft.entra.id.AADRiskyUsers")
| project UserPrincipalName, RiskLevel
| join kind=inner (
    external_table('microsoft.entra.id.SignInLogs')
    | where todatetime(CreatedDateTime) >= ago(24h)
    | summarize LoginCount = count() by UserPrincipalName
) on UserPrincipalName
| summarize RiskLevel = any(RiskLevel), LoginCount = sum(LoginCount) by UserPrincipalName
| top 10 by LoginCount desc
| project UserPrincipalName, RiskLevel, LoginCount
```

### Users with the most updates in Office Activity

Join top 10 users from Graph node with most updates in Office Activity

```kusto
external_table("UALNodes") 
| where [':LABEL'] == "ENTRAUSER"  
| extend UserPrincipalName = extract_json("$.userPrincipalName", Properties) 
| join kind=inner external_table("microsoft.m365.OfficeActivity") on $left.UserPrincipalName == $right.UserId 
| summarize UpdateCount = count() by UserPrincipalName
| top 10 by UpdateCount desc
```

### Detect brute force attack 

Summarize all the failures and success events for all users in the last 24 hours, 
  only identify users with more than 100 failures in the set period

```kusto
let successCodes = dynamic(["0", "50125", "50140", "70043", "70044"]);
let aadFunc = (tableName:string) {
    external_table(tableName)
    | extend FailureOrSuccess = iff(ResultType in (successCodes), "Success", "Failure")
    | summarize FailureCount = countif(FailureOrSuccess == "Failure"), SuccessCount = countif(FailureOrSuccess == "Success") by bin(CreatedDateTime, 1h), UserPrincipalName, UserDisplayName, IPAddress
    | where FailureCount > 100
    | where SuccessCount > 0
    | order by UserPrincipalName, CreatedDateTime asc
    | extend AccountCustomEntity = UserPrincipalName, IPCustomEntity = IPAddress
};
let aadSignin = aadFunc("microsoft.entra.id.SignInLogs");
let aadNonInt = aadFunc("microsoft.entra.id.AADNonInteractiveUserSignInLogs");
union isfuzzy=true aadSignin, aadNonInt
```


## Next steps

+ [Sentinel lake explorer](sentinel-lake-explorer.md)
+ [Sentinel lake notebooks](sentinel-lake-notebooks.md)
+ [Kusto Query Language documentation](/kusto/query/syntax-conventions?view=azure-data-explorer&preserve-view=true)
+ [Azure Data Explorer documentation](/azure/data-explorer/?tabs=azure-data-explorer)