---
title: Migrate Workloads from AWS Lambda to Azure Functions
description: Learn about the steps to complete your AWS Lambda to Azure Functions migration, test performance, optimize operations, and implement monitoring.
author: MadhuraBharadwaj-MSFT
ms.author: mabhar
ms.service: azure-functions
ms.topic: how-to
ms.date: 03/18/2025
#customer intent: As a developer, I want to adapt function code for compatibility and best practices so that I can migrate serverless applications from AWS Lambda to Azure Functions efficiently.
--- 

# Migrate workloads from AWS Lambda to Azure Functions

In this stage, you finish migrating your workload from AWS Lambda to Azure Functions. The goal is to adapt function code for compatibility and best practices, migrate the workload, test for performance, optimize operations, and implement monitoring for reliability and efficiency.

## Adapt function code, configuration files, and infrastructure as code files

You need to adapt function code, configuration files, and infrastructure as code (IaC) files to adhere to the Azure Functions programming model and best practices. This step helps ensure that your workload is compatible with Functions.

To update code for Azure Functions runtime requirements:

   - Modify your code to adhere to the Functions programming model. For instance, adapt your function signatures to match the format that Functions requires. For more information about function definition and execution context, see [Functions developer guides](/azure/azure-functions/functions-reference-node).

   - Use the [Functions extensions bundle](/azure/azure-functions/functions-bindings-register) to handle various bindings and triggers that are similar to AWS services. For .NET applications, you should use the appropriate NuGet packages instead of the extensions bundle.

   - The extensions bundle allows you to integrate with other Azure services such as Storage, Service Bus, and Azure Cosmos DB without needing to manually configure each binding through SDKs. For more information, see [Connect functions to Azure services by using bindings](/azure/azure-functions/add-bindings-existing-function) and [Azure Functions binding expression patterns](/azure/azure-functions/functions-bindings-expressions-patterns).

The following snippets are examples of common SDK code. The AWS Lambda code maps to the corresponding triggers, bindings, or SDK code snippets in Azure Functions.

**Reading from Amazon S3 versus Azure Blob Storage**

:::row:::
   :::column span="":::
      
      const AWS = require('aws-sdk');
      const s3 = new AWS.S3();

      exports.handler = async (event) => {
       const params = {
        Bucket: 'my-bucket',
        Key: 'my-object.txt',
       };
       const data = await
      s3.getObject(params).promise();
       console.log('File content:',
      data.Body.toString());
      };       

   :::column-end:::
   :::column span="":::
      
      import { app } from '@azure/functions';

      app.storageblob('blobTrigger', { 
       path: 'my-container/{blobName}',
       connection: 'AzureWebJobsStorage',
      }, async (context, myBlob) => { 
       context.log(`Blob content:
      ${myBlob.toString()}`);
      });
          
   :::column-end:::
:::row-end:::

| AWS Lambda code (SDK)  | Azure Functions code (Trigger)  |
|---|---|
| const AWS = require('aws-sdk');  const s3 = new AWS.S3(); <br><br> exports.handler = async (event) => {    const params = {      Bucket: 'my-bucket',      Key: 'my-object.txt', <br> }; <br> const data = await s3.getObject(params).promise();    console.log('File content:', data.Body.toString()); <br> };  | import { app } from '@azure/functions'; <br><br> app.storageblob('blobTrigger', { <br> path: 'my-container/{blobName}', <br>   connection: 'AzureWebJobsStorage', <br> }, async (context, myBlob) => { <br> context.log(`Blob content: ${myBlob.toString()}`); <br> });    |

**Writing to SQS (AWS) vs. Queue Storage (Azure)**

| AWS Lambda code (SDK)  | Azure Functions code (Trigger)  |
|---|---|
| const AWS = require('aws-sdk');  const sqs = new AWS.SQS();     exports.handler = async (event) => {    const params = {      QueueUrl: 'https://sqs.amazonaws.com/123456789012/MyQueue',      MessageBody: 'Hello, world!',    };    await sqs.sendMessage(params).promise();  };  | import { app } from '@azure/functions';     app.queue('queueTrigger', {    queueName: 'myqueue-items',    connection: 'AzureWebJobsStorage',  }, async (context, queueMessage) => {    context.log(`Queue message: ${queueMessage}`);  });    |

**Writing to a DynamoDB vs. Cosmos DB**

| AWS Lambda code (SDK)  | Azure Functions code (Trigger)  |
|---|---|
| const AWS = require('aws-sdk');  const dynamoDb = new AWS.DynamoDB.DocumentClient();     exports.handler = async (event) => {    const params = {      TableName: 'my-table',      Key: { id: '123' },    };    const data = await dynamoDb.get(params).promise();    console.log('DynamoDB record:', data.Item);  };  | import { app } from '@azure/functions';     app.cosmosDB('cosmosTrigger', {    connectionStringSetting: 'CosmosDBConnection',    databaseName: 'my-database',    containerName: 'my-container',    leaseContainerName: 'leases',  }, async (context, documents) => {    documents.forEach(doc => {      context.log(`Cosmos DB document: ${JSON.stringify(doc)}`);    });  });  |

**AWS CloudWatch Events vs Azure Timer Trigger**

| AWS Lambda code (SDK)  | Azure Functions code (Trigger)  |
|---|---|
| exports.handler = async (event) => {    console.log('Scheduled event:', event);  };  | import { app } from '@azure/functions';  app.timer('timerTrigger', { schedule: '0 */5 * * * *', // Runs every 5 minutes }, async (context, myTimer) => { if (myTimer.isPastDue) { context.log('Timer is running late!'); } context.log(Timer function executed at: ${new Date().toISOString()}); });  |

**AWS SNS vs Azure EventGrid Trigger**

| AWS Lambda code (SDK)  | Azure Functions code (Trigger)  |
|---|---|
| const AWS = require('aws-sdk');  const sns = new AWS.SNS();     exports.handler = async (event) => {    const params = {      Message: 'Hello, Event Grid!',      TopicArn: 'arn:aws:sns:us-east-1:123456789012:MyTopic',    };    await sns.publish(params).promise();  };  | import { app } from '@azure/functions';  app.eventGrid('eventGridTrigger', {}, async (context, eventGridEvent) => {    context.log(`Event Grid event: ${JSON.stringify(eventGridEvent)}`);  });  |

**AWS Kinesis vs Azure EventHubs Trigger**

| AWS Lambda code (SDK)  | Azure Functions code (Trigger)  |
|---|---|
| const AWS = require('aws-sdk');  const kinesis = new AWS.Kinesis();     exports.handler = async (event) => {    const records = event.Records.map(record => Buffer.from(record.kinesis.data, 'base64').toString());    console.log('Kinesis records:', records);  };  | import { app } from '@azure/functions';   app.eventHub('eventHubTrigger', {     connection: 'EventHubConnection',     eventHubName: 'my-event-hub',   }, async (context, eventHubMessages) => {     eventHubMessages.forEach(message => {       context.log(`Event Hub message: ${message}`);     });   });  |

Refer to these GitHub repositories for a comparison between [AWS Lambda code](https://github.com/MadhuraBharadwaj-MSFT/TestLambda), and its corresponding [Azure Functions code](https://github.com/MadhuraBharadwaj-MSFT/TestAzureFunction). For starter samples, infrastructure as code, and end to end samples for Azure Functions refer to this repository. 

### Adjust Configuration Settings: 

- Ensure your function's timeout and [memory](/azure/azure-functions/flex-consumption-how-to#configure-instance-memory) settings are compatible with Azure Functions. Configurable settings such as function timeouts are detailed in the [Azure Functions host.json configuration](/azure/azure-functions/functions-host-json).
- Follow recommended best practices for configuring permissions, access, networking and deployment.  
 
#### Configuring Permissions

Follow best practices recommended in this document when setting up Permissions on your Function Apps. Refer to section 'Configure your Function app and storage account with managed identity’ in the document: [How to create a new secretless Function App using managed identity](https://eng.ms/docs/cloud-ai-platform/devdiv/serverless-paas-balam/serverless-paas-vikr/app-service-web-apps/app-service-team-documents/functionteamdocs/faqs/tutorial-secretless-mi) 


**main.bicep** 

```
// User assigned managed identity to be used by the Function App to reach storage and service bus
module processorUserAssignedIdentity './core/identity/userAssignedIdentity.bicep' = {
  name: 'processorUserAssignedIdentity'
  scope: rg
  params: {
    location: location
    tags: tags
    identityName: !empty(processorUserAssignedIdentityName) ? processorUserAssignedIdentityName : '${abbrs.managedIdentityUserAssignedIdentities}processor-${resourceToken}'
  }
}
```

See [userAssignedIdentity.bicep](https://github.com/Azure-Samples/functions-quickstart-javascript-azd/blob/main/infra/core/identity/userAssignedIdentity.bicep)

#### Configuring Network access

Functions has support for [Virtual Network Integration](/azure/azure-functions/functions-networking-options#virtual-network-integration) which gives your function app access to resources in your virtual network. Once integrated, your app routes outbound traffic through the virtual network. This allows your app to access private endpoints or resources with rules allowing traffic from only select subnets. When the destination is an IP address outside of the virtual network, the source IP will still be sent from the one of the addresses listed in your app's properties, unless you've configured a NAT Gateway.

When enabling [virtual network](/azure/azure-functions/flex-consumption-how-to#enable-virtual-network-integration) integration for your Function Apps, 
follow best practices recommended in this document [[KPI CODE] TSG for VNet Integration for Web Apps and Function Apps | App Service Team Documents](https://eng.ms/docs/cloud-ai-platform/devdiv/serverless-paas-balam/serverless-paas-vikr/app-service-web-apps/app-service-team-documents/functionteamdocs/faqs/tsg-vnet-integration)

**main.bicep**

```
// Virtual Network & private endpoint
module serviceVirtualNetwork 'app/vnet.bicep' = {
  name: 'serviceVirtualNetwork'
  scope: rg
  params: {
    location: location
    tags: tags
    vNetName: !empty(vNetName) ? vNetName : '${abbrs.networkVirtualNetworks}${resourceToken}'
  }
}  

module servicePrivateEndpoint 'app/storage-PrivateEndpoint.bicep' = {
  name: 'servicePrivateEndpoint'
  scope: rg
  params: {
    location: location
    tags: tags
    virtualNetworkName: !empty(vNetName) ? vNetName : '${abbrs.networkVirtualNetworks}${resourceToken}'
    subnetName: serviceVirtualNetwork.outputs.peSubnetName
    resourceName: storage.outputs.name
  }
}
```

See [VNet.bicep](https://github.com/Azure-Samples/functions-quickstart-javascript-azd/blob/main/infra/app/vnet.bicep)
See [Storage-PrivateEndpoint](https://github.com/Azure-Samples/functions-quickstart-javascript-azd/blob/main/infra/app/storage-PrivateEndpoint.bicep) 

#### Configuring Deployment Settings 

Deployments follow a single path. After your project code is built and zipped into an application package, it is deployed to a blob storage container. On startup, your app gets the package and runs your function code from this package. By default, the same storage account used to store internal host metadata (AzureWebJobsStorage) is also used as the deployment container. However, you can use an alternative storage account or choose your preferred authentication method by configuring your app's deployment settings. [Learn](/azure/azure-functions/functions-deployment-technologies#one-deploy) how deployment works in Functions, and [configure deployment settings](/azure/azure-functions/flex-consumption-how-to#configure-deployment-settings).
 
### Generate Infrastructure as Code (IaC) files 

- Use tools like Bicep, Azure Resource Manager (ARM) templates, or Terraform to create IaC files for deploying Azure resources.
- Define resources such as Azure Functions, storage accounts, and networking components in your IaC files.
- Use [this repository](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/tree/main/IaC) for IaC samples that use Azure Functions recommendations and best practices.  

### Use Tools for Refactoring

- Employ tools like GitHub Copilot in VSCode for assistance in refactoring code, manual refactoring for specific changes, or other migration aids. 

If you need more detailed information on each of these steps, please visit the following resources:
- [Compare AWS and Azure compute services](/azure/architecture/aws-professional)
- [Develop Azure Functions locally](/azure/azure-functions/functions-develop-local)
- [Run Azure Functions locally](/azure/azure-functions/functions-run-local)

These resources provide specific examples and detailed steps to facilitate the migration process. 

## Deploy and Test 

### Deploy to Azure

Deploy with the [Visual Studio Code](/azure/azure-functions/functions-develop-vs-code#publish-to-azure) publish feature, or from the command line using [Azure Functions Core Tools](/azure/azure-functions/functions-run-local#project-file-deployment) or the [Azure CLI](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip). Our [Azure Dev Ops Task](/azure/azure-functions/functions-how-to-azure-devops#deploy-your-app) and [GitHub Actions](/azure/azure-functions/functions-how-to-github-actions) similarly leverage One deploy.

- Azure Functions Core Tools
   - [Deploy your function app](/azure/azure-functions/flex-consumption-how-to#deploy-your-code-project) using [Azure Functions Core Tools](/azure/azure-functions/functions-run-local)with the following command: `func azure functionapp publish <FunctionAppName> `

- CI/CD Pipelines
   - Set up a Continuous Integration/Continuous Deployment (CI/CD) pipeline using services like GitHub Actions, Azure DevOps, or another CI/CD tool.
   - Refer to [this guide for GitHub Actions](/azure/azure-functions/functions-how-to-github-actions) or [this guide for Azure DevOps](/azure/azure-functions/functions-how-to-azure-devops).

### Perform End-to-End Testing: 

- Validate Functionality
   - Test each function thoroughly to ensure it works as expected. This includes verifying input/output, event triggers, and bindings.
   - Use tools like curl or [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension on VSCode to send HTTP requests for HTTP-triggered functions.
   - For other triggers, such as timers or queues, ensure the triggers fire correctly and the functions execute as expected.

- Validate Performance
   - Conduct performance testing to compare the new Azure Functions deployment with the previous AWS Lambda deployment.
   - Monitor metrics like response time, execution time, and resource consumption.
   - Utilize Azure Application Insights for [monitoring, log analysis, and troubleshooting](/azure/azure-functions/functions-monitoring) during the testing phase. 

- Troubleshoot using Diagnose and Solve Problems
   - Leverage the [Diagnose and Solve Problems](/azure/app-service/overview-diagnostics) feature in the Azure Portal to troubleshoot your Function App.
   - This tool provides a set of diagnostics features that can help you quickly identify and resolve common issues such as application crashes, performance degradation, and configuration problems.
   - Follow the guided troubleshooting steps and recommendations provided by the tool to address identified issues. 

## Optimize and Monitor 

Follow these steps to effectively monitor, troubleshoot, and optimize your Azure Functions for performance and cost. 

### Use Azure Application Insights for Monitoring and Troubleshooting

- Set Up Application Insights
   - Enable [Azure Application Insights](/azure/azure-functions/functions-monitoring) for your Azure Functions to collect detailed telemetry data for monitoring and troubleshooting. Application Insights can be enabled through the Azure Portal or in the function app's host.json configuration file.

- Collect Telemetry Data
   - Application Insights provides various telemetry data such as request logs, performance metrics, exceptions, dependencies, and more.

- Analyze Logs and Metrics
   - Access the Application Insights dashboard from the Azure Portal to visualize and analyze logs, metrics, and other telemetry data.
   - Utilize the built-in tools for creating custom queries and visualizing data to gain insights into the performance and behavior of your Azure Functions. 

- Set Up Alerts
   - Configure alerts in Application Insights to notify you of critical issues, performance degradation, or specific events. This helps in proactive monitoring and timely response to problems.

### Optimize for Cost and Performance

- Scaling and Performance Optimization
   - Use autoscaling features available to handle varying workloads efficiently.
   - Optimize function code to improve performance by reducing execution time, optimizing dependencies, and using efficient coding practices.
   - Implement caching strategies to reduce repeated processing and latency for frequently accessed data. 

- Cost Management
   - Use the [Azure Cost Management and Billing](/azure/cost-management-billing/cost-management-billing-overview) tools to monitor and analyze your Azure Functions costs.
   - Set up budgeting and cost alerts to manage and predict expenses effectively. 

## Get Started 

- Use this [GitHub repo](https://github.com/MadhuraBharadwaj-MSFT/MigrationGetStarted) as a starter template to begin your PoC migration. This is a ready-to-deploy Functions project that has the necessary infrastructure (bicep) and source code files to help you get started. 
- If you prefer to use Terraform instead, use this [GitHub repo](https://github.com/MadhuraBharadwaj-MSFT/MigrationGetStarted-Terraform)

<!--
## Next step

> [!div class="nextstepaction"]
> [article](file.md)
-->