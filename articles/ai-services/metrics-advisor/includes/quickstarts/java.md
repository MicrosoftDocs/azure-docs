---
title: Metrics Advisor Java quickstart
titleSuffix: Azure AI services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-metrics-advisor
ms.topic: include
ms.date: 11/04/2022
ms.author: mbullwin
---

[Reference documentation](https://westus2.dev.cognitive.microsoft.com/docs/services/MetricsAdvisor/) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/metricsadvisor/azure-ai-metricsadvisor/src) | [Artifact (Maven)](https://search.maven.org/artifact/com.azure/azure-ai-metricsadvisor) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/metricsadvisor/azure-ai-metricsadvisor/src/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of the [Java Development Kit(JDK)](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
* Once you have your Azure subscription, <a href="https://go.microsoft.com/fwlink/?linkid=2142156"  title="Create a Metrics Advisor resource"  target="_blank">create a Metrics Advisor resource </a> in the Azure portal to deploy your Metrics Advisor instance.  
* Your own SQL database with time series data.
  
  
> [!TIP]
> * You can find Java Metrics Advisor samples on [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/metricsadvisor/azure-ai-metricsadvisor/src/samples).
> * It may take 10 to 30 minutes for your Metrics Advisor resource to deploy a service instance for you to use. Select **Go to resource** once it successfully deploys. After deployment, you can start using your Metrics Advisor instance with both the web portal and REST API. 
> * You can find the URL for the REST API in Azure portal, in the **Overview** section of your resource. It will look like this:
>    * `https://<instance-name>.cognitiveservices.azure.com/`
    
## Set up

### Create a new Gradle project

This quickstart uses the Gradle dependency manager. You can find more client library information on the [Maven Central Repository](https://search.maven.org/artifact/com.azure/azure-ai-metricsadvisor).

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `gradle init` command from your working directory. This command will create essential build files for Gradle, including *build.gradle.kts* which is used at runtime to create and configure your application.

```console
gradle init --type basic
```

When prompted to choose a **DSL**, select **Kotlin**.

### Install the client library

Locate *build.gradle.kts* and open it with your preferred IDE or text editor. Then copy in this build configuration. Be sure to include the project dependencies.

```kotlin
dependencies {
    compile("com.azure:azure-ai-metricsadvisor:1.1.8")
}
```

### Create a Java file

Create a folder for your sample app. From your working directory, run the following command:

```console
mkdir -p src/main/java
```

Navigate to the new folder and create a file called *MetricsAdvisorQuickstarts.java*. Open it in your preferred editor or IDE and add the following `import` statements:

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/metricsadvisor/azure-ai-metricsadvisor/src/samples), which contains the code examples in this quickstart.


## Environment variables

To successfully make a call against the Anomaly Detector service, you'll need the following values:

|Variable name | Value |
|--------------------------|-------------|
| `METRICS_ADVISOR_ENDPOINT` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Example endpoint: `https://YOUR_RESOURCE_NAME.cognitiveservices.azure.com/`|
| `METRICS_ADVISOR_KEY` | The key value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|
|`METRICS_ADVISOR_API_KEY` |The key value can be found under **Settings** >  **API keys** when examining your resource from the [Metrics Advisor portal](https://metricsadvisor.azurewebsites.net/). You can use either `KEY1` or `KEY2`.  |
|`SQL_CONNECTION_STRING` | This quickstart requires you to have your own SQL Database + connection string. An example connection string would look similar to the following example:`Data Source=<Server>;Initial Catalog=<db-name>;User ID=<user-name>;Password=<password>` for more information on constructing SQL connection strings, see the [SQL documentation](../../data-feeds-from-different-sources.md#azure-sql-database--sql-server).  |
|`SQL_QUERY`| Unique query specific to your dataset.|

### Create environment variables

Create and assign persistent environment variables for your key and endpoint.

# [Command Line](#tab/command-line)

```CMD
setx METRICS_ADVISOR_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
setx METRICS_ADVISOR_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
setx METRICS_ADVISOR_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
setx SQL_CONNECTION_STRING "REPLACE_WITH_YOUR_UNIQUE_SQL_CONNECTION_STRING" 
setx SQL_QUERY "REPLACE_WITH_YOUR_UNIQUE_SQL_QUERY_BASED_ON_THE_UNDERLYING_STRUCTURE_OF_YOUR_DATA" 
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('METRICS_ADVISOR_ENDPOINT', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
[System.Environment]::SetEnvironmentVariable('METRICS_ADVISOR_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
[System.Environment]::SetEnvironmentVariable('METRICS_ADVISOR_API_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
[System.Environment]::SetEnvironmentVariable('SQL_CONNECTION_STRING', 'REPLACE_WITH_YOUR_UNIQUE_SQL_CONNECTION_STRING', 'User')
[System.Environment]::SetEnvironmentVariable('SQL_QUERY', 'REPLACE_WITH_YOUR_UNIQUE_SQL_QUERY_BASED_ON_THE_UNDERLYING_STRUCTURE_OF_YOUR_DATA', 'User')
```

# [Bash](#tab/bash)

```Bash
echo export METRICS_ADVISOR_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment && source /etc/environment
echo export METRICS_ADVISOR_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
echo export METRICS_ADVISOR_API_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
echo export SQL_CONNECTION_STRING="REPLACE_WITH_YOUR_UNIQUE_SQL_CONNECTION_STRING" >> /etc/environment && source /etc/environment
echo export SQL_QUERY="REPLACE_WITH_YOUR_UNIQUE_SQL_QUERY_BASED_ON_THE_UNDERLYING_STRUCTURE_OF_YOUR_DATA" >> /etc/environment && source /etc/environment
```

---

## Create your application

Replace the contents of your .java file with the following:

```java
package com.azure.ai.metricsadvisor.administration;

import com.azure.ai.metricsadvisor.administration.models.AzureAppInsightsDataFeedSource;
import com.azure.ai.metricsadvisor.administration.models.DataFeed;
import com.azure.ai.metricsadvisor.administration.models.DataFeedDimension;
import com.azure.ai.metricsadvisor.administration.models.DataFeedGranularity;
import com.azure.ai.metricsadvisor.administration.models.DataFeedGranularityType;
import com.azure.ai.metricsadvisor.administration.models.DataFeedIngestionSettings;
import com.azure.ai.metricsadvisor.administration.models.DataFeedMetric;
import com.azure.ai.metricsadvisor.administration.models.DataFeedOptions;
import com.azure.ai.metricsadvisor.administration.models.DataFeedSchema;
import com.azure.ai.metricsadvisor.administration.models.DataFeedSourceType;
import com.azure.ai.metricsadvisor.models.MetricsAdvisorKeyCredential;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.Collections;

/**
 * Sample demonstrates how to create, get, update, delete and list datafeed.
 */
public class DatafeedSample {
    private static String subscription_key = System.getenv("METRICS_ADVISOR_KEY");
    private static String api_key = System.getenv("METRICS_ADVISOR_API_KEY");
    private static String endpoint = System.getenv("METRICS_ADVISOR_ENDPOINT");
    private static String connection_string = System.getenv("SQL_CONNECTION_STRING");
    private static String sql_query = System.getenv("SQL_QUERY");

    public static void main(String[] args) {
        final MetricsAdvisorAdministrationClient advisorAdministrationClient =
            new MetricsAdvisorAdministrationClientBuilder()
                .endpoint("https://{endpoint}.cognitiveservices.azure.com/")
                .credential(new MetricsAdvisorKeyCredential("subscription_key", "api_key"))
                .buildClient();

        // Create Data feed
DataFeed dataFeed = new DataFeed()
    .setName("dataFeedName")
    .setSource(new MySqlDataFeedSource(connection_string, sql_query))
    .setGranularity(new DataFeedGranularity().setGranularityType(DataFeedGranularityType.DAILY))
    .setSchema(new DataFeedSchema(
        Arrays.asList(
            new DataFeedMetric("cost"),
            new DataFeedMetric("revenue")
        )).setDimensions(
        Arrays.asList(
            new DataFeedDimension("city"),
            new DataFeedDimension("category")
        ))
    )
    .setIngestionSettings(new DataFeedIngestionSettings(OffsetDateTime.parse("2020-01-01T00:00:00Z")))
    .setOptions(new DataFeedOptions()
        .setDescription("data feed description")
        .setRollupSettings(new DataFeedRollupSettings()
            .setRollupType(DataFeedRollupType.AUTO_ROLLUP)));
final DataFeed createdSqlDataFeed = metricsAdvisorAdminClient.createDataFeed(dataFeed);

System.out.printf("Data feed Id : %s%n", createdSqlDataFeed.getId());
System.out.printf("Data feed name : %s%n", createdSqlDataFeed.getName());
System.out.printf("Is the query user is one of data feed administrator : %s%n", createdSqlDataFeed.isAdmin());
System.out.printf("Data feed created time : %s%n", createdSqlDataFeed.getCreatedTime());
System.out.printf("Data feed granularity type : %s%n",
    createdSqlDataFeed.getGranularity().getGranularityType());
System.out.printf("Data feed granularity value : %d%n",
    createdSqlDataFeed.getGranularity().getCustomGranularityValue());
System.out.println("Data feed related metric Ids:");
dataFeed.getMetricIds().forEach((metricId, metricName)
    -> System.out.printf("Metric Id : %s, Metric Name: %s%n", metricId, metricName));
System.out.printf("Data feed source type: %s%n", createdSqlDataFeed.getSourceType());

if (SQL_SERVER_DB == createdSqlDataFeed.getSourceType()) {
    System.out.printf("Data feed sql server query: %s%n",
        ((SqlServerDataFeedSource) createdSqlDataFeed.getSource()).getQuery());
}
        // Update the data feed.
        System.out.printf("Updating data feed: %s%n", dataFeed.getId());
        dataFeed = advisorAdministrationClient.updateDataFeed(dataFeed.setOptions(new DataFeedOptions()
            .setAdmins(Collections.singletonList("admin1@admin.com"))
        ));
        System.out.printf("Updated data feed admin list: %s%n",
            String.join(",", dataFeed.getOptions().getAdmins()));

        // Delete the data feed.
        System.out.printf("Deleting data feed: %s%n", dataFeed.getId());
        advisorAdministrationClient.deleteDataFeed(dataFeed.getId());
        System.out.printf("Deleted data feed%n");

        // List data feeds.
        System.out.printf("Listing data feeds%n");
        advisorAdministrationClient.listDataFeeds().forEach(dataFeedItem -> {
            System.out.printf("Data feed Id : %s%n", dataFeedItem.getId());
            System.out.printf("Data feed name : %s%n", dataFeedItem.getName());
            System.out.printf("Is the query user is one of data feed administrator : %s%n", dataFeedItem.isAdmin());
            System.out.printf("Data feed created time : %s%n", dataFeedItem.getCreatedTime());
            System.out.printf("Data feed granularity type : %s%n", dataFeedItem.getGranularity().getGranularityType());
            System.out.printf("Data feed granularity value : %d%n",
                dataFeedItem.getGranularity().getCustomGranularityValue());
            System.out.println("Data feed related metric Id's:");
            dataFeedItem.getMetricIds().forEach((metricId, metricName)
                -> System.out.printf("Metric Id : %s, Metric Name: %s%n", metricId, metricName));
            System.out.printf("Data feed source type: %s%n", dataFeedItem.getSourceType());
        });
    }
}
```

You can build the app with:

```console
gradle build
```

### Run the application

Run the application with the `run` goal:

```console
gradle run
```
