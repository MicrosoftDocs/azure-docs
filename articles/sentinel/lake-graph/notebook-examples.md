---  
title: Notebook examples for querying the Sentinel data lake (Preview)
titleSuffix: Microsoft Security  
description: This article provides sample code snippets for querying the Microsoft Sentinel data lake using Jupyter notebooks, demonstrating how to access and analyze security data.
author: EdB-MSFT  
ms.topic: how-to  
ms.date: 06/04/2025
ms.author: edbayansh  

# Customer intent: As a security engineer or data scientist, I want to see examples of how to query the Microsoft Sentinel data lake using Jupyter notebooks, so I can analyze security data effectively.
---
 
# Jupyter Notebook code examples  
 
Below are some sample code snippets that demonstrate how to interact with lake data using Jupyter notebooks.  

To run these examples, must have the require permissions and Visual Studio Code installed with the Microsoft Sentinel extension for Visual Studio Code. For more information, see [Sentinel data lake permissions](./sentinel-lake-permissions.md) and  [Use Jupyter notebooks with Microsoft Sentinel Data lake](./spark-notebooks.md).

# In this example, the goal is to identify users with failed logins attempted. To do so, this Spark notebook example processes login data from two tables: 
# "microsoft.entra.id.SignInLogs" and "microsoft.entra.id.AADNonInteractiveUserSignInLogs".
# The query performs the following steps:
# 1. Loads data from the specified tables into DataFrames.
# 2. Parses the 'Status' JSON field to extract 'errorCode' and determines whether each login attempt was a success or failure.
# 3. Aggregates the data to count the number of failed and successful login attempts for each user.
# 4. Filters the data to include only users with more than 100 failed login attempts and at least one successful login attempt.
# 5. Orders the results by the number of failed login attempts.
# 6. Combines the results from both tables into a single DataFrame.
# 7. Converts the Spark DataFrame to a Pandas DataFrame.
# 8. Filters the Pandas DataFrame to show the top 20 users with the highest number of failed login attempts.
# 9. Creates a bar chart to visualize the users with the highest number of failed login attempts.
# Note this takes approx 10 mins on Large pool depending on the amount of logs

import matplotlib.pyplot as plt
from sentinel_lake.providers import MicrosoftSentinelProvider
from pyspark.sql.functions import col, when, count, from_json, desc
from pyspark.sql.types import StructType, StructField, StringType

data_provider = MicrosoftSentinelProvider(spark)

# Function to process data
def process_data(table_name):
    # Load data into DataFrame
    df = data_provider.read_table(table_name)
    
    # Define schema for parsing the 'Status' JSON field
    status_schema = StructType([StructField("errorCode", StringType(), True)])
    # Parse the 'Status' JSON field to extract 'errorCode'
    df = df.withColumn("Status_json", from_json(col("Status"), status_schema)) \
           .withColumn("ResultType", col("Status_json.errorCode"))
    # Define success codes
    success_codes = ["0", "50125", "50140", "70043", "70044"]
    
    # Determine FailureOrSuccess based on ResultType
    df = df.withColumn("FailureOrSuccess", when(col("ResultType").isin(success_codes), "Success").otherwise("Failure"))
    
    # Summarize FailureCount and SuccessCount
    df = df.groupBy("UserPrincipalName", "UserDisplayName", "IPAddress") \
           .agg(count(when(col("FailureOrSuccess") == "Failure", True)).alias("FailureCount"),
                count(when(col("FailureOrSuccess") == "Success", True)).alias("SuccessCount"))
    
    # Filter where FailureCount > 100 and SuccessCount > 0
    df = df.filter((col("FailureCount") > 100) & (col("SuccessCount") > 0))
    
    # Order by FailureCount descending
    df = df.orderBy(desc("FailureCount"))
         
    return df

# Process the tables to a common schema
aad_signin = process_data("microsoft.entra.id.SignInLogs")
aad_non_int = process_data("microsoft.entra.id.AADNonInteractiveUserSignInLogs")

# Union the DataFrames
result_df = aad_signin.unionByName(aad_non_int)

# Show the result
result_df.show()

# Convert the Spark DataFrame to a Pandas DataFrame
result_pd_df = result_df.toPandas()

# Filter to show table with top 20 users with the highest failed logins attempted
top_20_df = result_pd_df.nlargest(20, 'FailureCount')

# Create bar chart to show users by highest failed logins attempted
plt.figure(figsize=(12, 6))
plt.bar(top_20_df['UserDisplayName'], top_20_df['FailureCount'], color='skyblue')
plt.xlabel('Users')
plt.ylabel('Number of Failed Logins')
plt.title('Top 20 Users with Failed Logins')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.show()
### Access Lake Tier Entra ID Group Table  

The following code sample demonstrates how to access the Entra ID `Group` table in the Microsoft Sentinel data lake. It retrieves various fields such as displayName, groupTypes, mail, mailNickname, description, and tenantId. 

```python  
from sentinel_lake.providers import MicrosoftSentinelProvider
data_provider = MicrosoftSentinelProvider(spark)
 
table_name = "microsoft.entra.id.group"  
df = data_provider.read_table(table_name)  
df.select("displayName", "groupTypes", "mail", "mailNickname", "description", "tenantId").show(100, truncate=False)   
```  
The following screenshot shows a sample of the output of the code above, displaying the Entra ID group information in a dataframe format.

:::image type="content" source="media/notebook-examples/sample-1-output.png" alt-text="A screenshot showing sample output for the first code example.":::

### Access Entra ID SignInLogs for a Specific User  
The following code sample demonstrates how to access the Entra ID `SignInLogs` table and filter the results for a specific user. It retrieves various fields such as UserDisplayName, UserPrincipalName, UserId, and more.

```python  
from sentinel_lake.providers import MicrosoftSentinelProvider
data_provider = MicrosoftSentinelProvider(spark)
 
table_name = "microsoft.entra.id.SignInLogs"  
df = data_provider.read_table(table_name)  
df.select("UserDisplayName", "UserPrincipalName", "UserId", "CorrelationId", "UserType", 
 "ResourceTenantId", "RiskLevel", "ResourceProvider", "IPAddress", "AppId", "AADTenantId")\
    .filter(df.UserPrincipalName == "benploni@contoso.com")\
    .show(100, truncate=False) 
```  
 
### Examine SignIn Locations  

The following code sample demonstrates how to extract and display sign-in locations from the Entra ID SignInLogs table. It uses the `from_json` function to parse the JSON structure of the `LocationDetails` field, allowing you to access specific location attributes such as city, state, and country or region.

```python  
from sentinel_lake.providers import MicrosoftSentinelProvider
from pyspark.sql.functions import from_json, col  
from pyspark.sql.types import StructType, StructField, StringType  
 
data_provider = MicrosoftSentinelProvider(spark)  
table_name = "microsoft.entra.id.signinlogs"  
df = data_provider.read_table(table_name)  
 
location_schema = StructType([  
  StructField("city", StringType(), True),  
  StructField("state", StringType(), True),  
  StructField("countryOrRegion", StringType(), True)  
])  
 
# Extract location details from JSON  
df = df.withColumn("LocationDetails", from_json(col("LocationDetails"), location_schema))  
df = df.select("UserPrincipalName", "CreatedDateTime", "IPAddress", 
 "LocationDetails.city", "LocationDetails.state", "LocationDetails.countryOrRegion")  
 
sign_in_locations_df = df.orderBy("CreatedDateTime", ascending=False)  
sign_in_locations_df.show(100, truncate=False) 
```  