---
title: Quickstart: Build a streaming application with a few clicks
description: This quickstart shows you how to get started ASA using a GitHub repository and PowerShell scripts with data generator. 
ms.service: stream-analytics
author: alex lin
ms.author: zhenxilin
ms.date: 10/27/2022
ms.topic: quickstart
---

# Build a streaming application with a few clicks

This quickstart shows how to build a streaming application with executing a few commands on PowerShell. It's the fastest way to deploy the Azure resources and test your streaming application with generated data streams. You can choose the following application examples and explore different stream analytic scenarios.
- filter clickstream requests
- join clickstream with a file
- analyze Twitter sentiment
- build geofencing (coming soon)

## Prerequisites
- Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).
- Windows PowerShell. You can find it from the Windows Start Menu or install the [latest version](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7).

## Filter clickstream requests

In this example, you learn to extract `GET` and `POST` requests from a website clickstream and store the output results to an Azure Blob Storage. Here's the architecture for this example:
![Clickstream one input](./media/quick-start-with-mock-data/clickstream-one-input.png)

Sample of clickstream:

```json
{
    "EventTime": "2022-09-09 08:58:59 UTC",
    "UserID": 465,
    "IP": "145.140.61.170",
    "Request": {
    "Method": "GET",
    "URI": "/index.html",
    "Protocol": "HTTP/1.1"
    },
    "Response": {
    "Code": 200,
    "Bytes": 42682
    },
    "Browser": "Chrome"
}
```

Follow these steps to deploy resources: 

1. Clone this [GitHub repository](https://github.com/Azure/azure-stream-analytics) to your working directory. 

2. Open PowerShell, go to the folder `Build Applications` with command `cd`.

3. Sign in to Azure with the following command. Enter your Azure credentials in the pop-up browser.

    ```powershell
    Connect-AzAccount
    ```

4. Deploy Azure sources. Replace `<subscription-id>` with your Azure subscription id and run the following command. This process may take a few minutes to complete.

    ```powershell
    .\CreateJob.ps1 -job ClickStream-Filter -subscriptionid <subscription-id> -eventsPerMinute 11
    ```

    * Subscription id can be found in the Azure dashboard.
    * `eventsPerMinute` is the input rate for generated data. In this case, the input source generates 11 events per minute.

5. Once it's done, open your browser and sign in to Azure portal. You see an Azure Resource Group named **ClickStream-Filter-rg-\*** is created with five resources:

    | Resource Type | Name | Description |
    | ------------ | --------------------------------------------- | -------------------------------- |
    | Azure Function | clickstream* | Generate clickstream data |
    | Event Hubs | clickstream* | Ingest clickstream data for consuming |
    | Stream Analytics Job | ClickStream-Filter | Define a query to extract `GET` requests from the clickstream input |
    | Blob Storage | clickstream* | Output destination for the ASA job |
    | App Service Plan | clickstream* | A necessity for Azure Function |

6. The ASA job **ClickStream-Filter** uses the following query to extract HTTP requests from the clickstream. Select **Test query** in the query editor to preview the output results.

    ```sql
    SELECT System.Timestamp Systime, UserId, Request.Method, Response.Code, Browser
    INTO BlobOutput
    FROM ClickStream TIMESTAMP BY Timestamp
    WHERE Request.Method = 'GET' or Request.Method = 'POST'
    ```

    ![Test Query](./media/quick-start-with-mock-data/test-query.png)

7. All output results are stored as `JSON` file in the Blog Storage. You can find it via: Blob Storage > Containers > job-output.
![Blob Storage](./media/quick-start-with-mock-data/blog-storage-containers.png)

8. **Congratulation!** You've deployed your first streaming application to filter a website clickstream. For other stream analytic scenarios with one stream input, you can use the following examples for the query:

* Count clicks for every hour

    ```sql
    select System.Timestamp as Systime, count( * )
    FROM clickstream
    TIMESTAMP BY EventTime
    GROUP BY TumblingWindow(hour, 1)
    ```

* Select distinct user

    ```sql
    SELECT *
    FROM clickstream
    TIMESTAMP BY Time
    WHERE ISFIRST(hour, 1) OVER(PARTITION BY userId) = 1
    ```

## Clickstream-RefJoin

If you've a user file and want to find out the username for the clickstream, you can join the clickstream with a reference input as following architecture:
![Clickstream two input](./media/quick-start-with-mock-data/clickstream-two-inputs.png)

Assume you've completed the steps for previous example, follow these steps to create a new resource group: 

1. Replace `<subscription-id>` with your Azure subscription ID and run the following command. This process may take a few minutes to deploy the resources: 

    ```powershell
    .\CreateJob.ps1 -job ClickStream-RefJoin -subscriptionid <subscription-id> -eventsPerMinute 11
    ```

2. Once it's done, sign in to the Azure portal, and you can see a resource group named **ClickStream-RefJoin-rg-\***.

3. The ASA job **ClickStream-RefJoin** uses the following query to join the clickstream with reference sql input.

    ```sql
    CREATE TABLE UserInfo(
      UserId bigint,
      UserName nvarchar(max),
      Gender nvarchar(max)
    );
    SELECT System.Timestamp Systime, ClickStream.UserId, ClickStream.Response.Code, UserInfo.UserName, UserInfo.Gender
    INTO BlobOutput
    FROM ClickStream TIMESTAMP BY EventTime
    LEFT JOIN UserInfo ON ClickStream.UserId = UserInfo.UserId
    ```

4. **Congratulation!** You've deployed a streaming application to joins clickstream with a reference input.

## Clean up resources

If you've tried out this project and no longer need the resource group, run this command on PowerShell to delete the resource group.

```powershell
Remove-AzResourceGroup -Name $resourceGroup
```

If you're planning to use this project in the future, you can skip deleting it, and stop the job for now.

## Next steps

To learn about Azure Stream Analytics, continue to the following articles:

* [Quickstart: Create an Azure Stream Analytics job in VS Code](quick-create-visual-studio-code.md)

* [Test ASA queries locally against live stream input](visual-studio-code-local-run-live-input.md)

* [Use Visual Studio Code to view Azure Stream Analytics jobs](visual-studio-code-explore-jobs.md)

* [Set up CI/CD pipelines by using the npm package](./cicd-overview.md)
