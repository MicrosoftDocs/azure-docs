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

   - Use the extensions bundle to integrate with other Azure services such as Storage, Service Bus, and Azure Cosmos DB without needing to manually configure each binding through SDKs. For more information, see [Connect functions to Azure services by using bindings](/azure/azure-functions/add-bindings-existing-function) and [Azure Functions binding expression patterns](/azure/azure-functions/functions-bindings-expressions-patterns).

The following snippets are examples of common SDK code. The AWS Lambda code maps to the corresponding triggers, bindings, or SDK code snippets in Azure Functions.

**Reading from Amazon S3 versus Azure Blob Storage**

:::row:::
   :::column span="":::
      
      AWS Lambda code (SDK)

      ```
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
      ```

   :::column-end:::
   :::column span="":::
      
      Azure Functions code (Trigger)

      ```
      import { app } from '@azure/functions';

      app.storageblob('blobTrigger', { 
       path: 'my-container/{blobName}',
       connection: 'AzureWebJobsStorage',
      }, async (context, myBlob) => { 
       context.log(`Blob content:
      ${myBlob.toString()}`);
      });
      ```

   :::column-end:::
:::row-end:::

**Writing to Amazon Simple Queue Service (SQS) versus Queue Storage**

:::row:::
   :::column span="":::

      AWS Lambda code (SDK)

      ```
      const AWS = require('aws-sdk');
      const sqs = new AWS.SQS(); 

      exports.handler = async (event) => {
       const params = {
        QueueUrl:
      'https://sqs.amazonaws.com/123456789012/MyQueue',
         MessageBody: 'Hello, world!',
       };
        await
      sqs.sendMessage(params).promise();
      };
      ```    

   :::column-end:::
   :::column span="":::

      Azure Functions code (Trigger)

      ```
      import { app } from '@azure/functions';

      app.queue('queueTrigger', { 
       queueName: 'myqueue-items',
       connection: 'AzureWebJobsStorage',
      }, async (context, queueMessage) => {
        context.log(`Queue message: 
      ${queueMessage}`);
      }); 
      ```

   :::column-end:::
:::row-end:::

**Writing to DynamoDB versus Azure Cosmos DB**

:::row:::
   :::column span="":::

      AWS Lambda code (SDK)

      ```
      const AWS = require('aws-sdk'); 
      const dynamoDb = new AWS.DynamoDB.DocumentClient();   

      exports.handler = async (event) => { 
      const params = { 
       TableName: 'my-table', 
       Key: { id: '123' }, 
      }; 
       const data = await dynamoDb.get(params).promise(); 
        console.log('DynamoDB record:', data.Item); 
      }; 
      ```

   :::column-end:::
   :::column span="":::

      Azure Functions code (Trigger)
      
      ```
      import { app } from '@azure/functions';  

      app.cosmosDB('cosmosTrigger', { 
       connectionStringSetting: 'CosmosDBConnection', 
       databaseName: 'my-database', 
       containerName: 'my-container', 
       leaseContainerName: 'leases', 
      }, async (context, documents) => { 
       documents.forEach(doc => { 
       context.log(`Cosmos DB document: ${JSON.stringify(doc)}`); 
       }); 
      }); 
      ```

   :::column-end:::
:::row-end:::

**Amazon CloudWatch Events versus Azure timer trigger**

:::row:::
   :::column span="":::

      AWS Lambda code (SDK)

      ```
      exports.handler = async (event) => {
       console.log('Scheduled event:', event); 
      }; 
      ```

   :::column-end:::
   :::column span="":::

      Azure Functions code (Trigger)

      ```
      import { app } from '@azure/functions'; 
       
      app.timer('timerTrigger', { schedule: '0 */5 * * * *', // Runs every 5 minutes }, async (context, myTimer) => { if (myTimer.isPastDue) { context.log('Timer is running late!'); } context.log(Timer function executed at: ${new Date().toISOString()}); });
      ```

   :::column-end:::
:::row-end:::

**Amazon Simple Notification Service (SNS) versus Azure Event Grid Trigger**

:::row:::
   :::column span="":::

      AWS Lambda code (SDK)

      ```
      const AWS = require('aws-sdk'); 
      const sns = new AWS.SNS();   

      exports.handler = async (event) => { 
       const params = { 
        Message: 'Hello, Event Grid!', 
        TopicArn: 'arn:aws:sns:us-east-1:123456789012:MyTopic', 
       }; 
       await sns.publish(params).promise(); 
      }; 
      ```

   :::column-end:::
   :::column span="":::

      Azure Functions code (Trigger)

      ```
      import { app } from '@azure/functions'; 

      app.eventGrid('eventGridTrigger', {}, 
      async (context, eventGridEvent) => { 

       context.log(`Event Grid event: 
      ${JSON.stringify(eventGridEvent)}`); 

      }); 
      ```

   :::column-end:::
:::row-end:::

**Amazon Kinesis vs Azure Event Hubs trigger**

:::row:::
   :::column span="":::

      AWS Lambda code (SDK)

      ```
      const AWS = require('aws-sdk'); 
      const kinesis = new AWS.Kinesis();   

      exports.handler = async (event) => { 
       const records = 
      event.Records.map(record => 
      Buffer.from(record.kinesis.data, 
      'base64').toString()); 
        console.log('Kinesis records:', records); 
      }; 
      ```

   :::column-end:::
   :::column span="":::

      Azure Functions code (Trigger)

      ```
      import { app } from '@azure/functions'; 
      app.eventHub('eventHubTrigger', {  
       connection: 'EventHubConnection',  
       eventHubName: 'my-event-hub',  
      }, async (context, eventHubMessages) => 
      {  
       eventHubMessages.forEach(message => 
      {  
       context.log(`Event Hub message: 
      ${message}`);  
       });  
      });
      ```

   :::column-end:::
:::row-end:::

See the following GitHub repositories to compare AWS Lambda code and Azure Functions code.

- [AWS Lambda code](https://github.com/MadhuraBharadwaj-MSFT/TestLambda)

- [Azure Functions code](https://github.com/MadhuraBharadwaj-MSFT/TestAzureFunction)

   - This repository also includes starter samples, infrastructure as code, and end-to-end samples for Azure Functions.

### Adjust configuration settings

Ensure that your function's time-out and [memory](/azure/azure-functions/flex-consumption-how-to#configure-instance-memory) settings are compatible with Azure Functions. For more information about configurable settings, see [host.json reference for Azure Functions](/azure/azure-functions/functions-host-json).

Follow the recommended best practices for permissions, access, networking, and deployment configurations. 
 
#### Configure permissions

Follow best practices when you set up permissions on your function apps. For more information, see [Configure your function app and storage account with managed identity](https://eng.ms/docs/cloud-ai-platform/devdiv/serverless-paas-balam/serverless-paas-vikr/app-service-web-apps/app-service-team-documents/functionteamdocs/faqs/tutorial-secretless-mi#configure-your-function-app-and-storage-account-with-managed-identity).

**main.bicep** 

```
// User-assigned managed identity that the function app uses to reach Storage and Service Bus
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

For more information, see [userAssignedIdentity.bicep](https://github.com/Azure-Samples/functions-quickstart-javascript-azd/blob/main/infra/core/identity/userAssignedIdentity.bicep).

#### Configure network access

Azure Functions supports [virtual network integration](/azure/azure-functions/functions-networking-options#virtual-network-integration), which gives your function app access to resources in your virtual network. After integration, your app routes outbound traffic through the virtual network. Then your app can access private endpoints or resources by using rules that only allow traffic from specific subnets. When the destination is an IP address outside of the virtual network, the source IP address sends from one of the addresses listed in your app's properties, unless you configured a NAT gateway.

When you enable [virtual network integration](/azure/azure-functions/flex-consumption-how-to#enable-virtual-network-integration) for your function apps, 
follow the best practices in [TSG for virtual network integration for web apps and function apps](https://eng.ms/docs/cloud-ai-platform/devdiv/serverless-paas-balam/serverless-paas-vikr/app-service-web-apps/app-service-team-documents/functionteamdocs/faqs/tsg-vnet-integration).

**main.bicep**

```
// Virtual network and private endpoint
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

For more information, see [VNet.bicep](https://github.com/Azure-Samples/functions-quickstart-javascript-azd/blob/main/infra/app/vnet.bicep) and [storage-PrivateEndpoint.bicep](https://github.com/Azure-Samples/functions-quickstart-javascript-azd/blob/main/infra/app/storage-PrivateEndpoint.bicep) 

#### Configure deployment settings

Deployments follow a single path. After you build your project code and zip it into an application package, deploy it to a blob storage container. When it starts, your app gets the package and runs your function code from it. By default, the same storage account that stores internal host metadata (AzureWebJobsStorage) also serves as the deployment container. However, you can use an alternative storage account or choose your preferred authentication method by configuring your app's deployment settings. For more information, see [Deployment technology details](/azure/azure-functions/functions-deployment-technologies#deployment-technology-details) and [Configure deployment settings](/azure/azure-functions/flex-consumption-how-to#configure-deployment-settings).
 
### Generate IaC files

- Use tools like Bicep, Azure Resource Manager templates, or Terraform to create IaC files to deploy Azure resources.
- Define resources such as Azure Functions, storage accounts, and networking components in your IaC files.
- Use this [IaC samples repository](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/tree/main/IaC) for samples that use Azure Functions recommendations and best practices.

### Use tools for refactoring

Use tools like GitHub Copilot in Visual Studio Code for help with code refactoring, manual refactoring for specific changes, or other migration aids.

For more information about each of these steps, see:

- [Azure for AWS professionals](/azure/architecture/aws-professional)

- [Code and test Azure Functions locally](/azure/azure-functions/functions-develop-local)

- [Develop Azure Functions locally by using Core Tools](/azure/azure-functions/functions-run-local)

These resources provide specific examples and detailed steps to facilitate the migration process. 

## Deploy and test the application

Perform a guided migration of workloads to Azure Functions, and test the deployed functions to validate their performance and correctness.

### Deploy to Azure

Deploy workloads by using the [VS Code](/azure/azure-functions/functions-develop-vs-code#publish-to-azure) publish feature. You can also deploy workloads from the command line by using [Azure Functions Core Tools](/azure/azure-functions/functions-run-local#project-file-deployment) or the [Azure CLI](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip). [Azure DevOps](/azure/azure-functions/functions-how-to-azure-devops#deploy-your-app) and [GitHub Actions](/azure/azure-functions/functions-how-to-github-actions) also use One Deploy.

- Azure Functions Core Tools: [Deploy your function app](/azure/azure-functions/flex-consumption-how-to#deploy-your-code-project) by using [Azure Functions Core Tools](/azure/azure-functions/functions-run-local) with the `func azure functionapp publish <FunctionAppName>` command.

- Continuous integration and continuous deployment (CI/CD) pipelines: Set up a CCI/CD pipeline by using services like GitHub Actions, Azure DevOps, or another CI/CD tool.

   For more information, see [Continuous delivery by using GitHub Actions](/azure/azure-functions/functions-how-to-github-actions) or [Continuous delivery with Azure Pipelines](/azure/azure-functions/functions-how-to-azure-devops).

### Perform end-to-end testing

- Validate functionality

   - Test each function thoroughly to ensure that it works as expected. These tests should include input/output, event triggers, and bindings verification.

   - Use tools like curl or [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extensions on VS Code to send HTTP requests for HTTP-triggered functions.

   - For other triggers, such as timers or queues, ensure that the triggers fire correctly and the functions run as expected.

- Validate performance

   - Conduct performance testing to compare the new Azure Functions deployment with the previous AWS Lambda deployment.

   - Monitor metrics like response time, run time, and resource consumption.

   - Use Application Insights for [monitoring, log analysis, and troubleshooting](/azure/azure-functions/functions-monitoring) during the testing phase.

- Troubleshoot by using the diagnose and solve problems feature

   Use the [diagnose and solve problems](/azure/app-service/overview-diagnostics) feature in the Azure portal to troubleshoot your function app. This tool provides a set of diagnostics features that can help you quickly identify and resolve common problems, such as application crashes, performance degradation, and configuration problems. Follow the guided troubleshooting steps and recommendations that the tool provides to address problems that you identify. 

## Optimize and monitor the application's performance

Follow these steps to effectively monitor, troubleshoot, and optimize your function app for performance and cost. 

### Use Application Insights for monitoring and troubleshooting

Enable [Application Insights](/azure/azure-functions/functions-monitoring) for your function app to collect detailed telemetry data for monitoring and troubleshooting. You can enable Application Insights through the Azure portal or in the function app's host.json configuration file. After you enable Application Insights, you can:

- Collect telemetry data. Application Insights provides various telemetry data such as request logs, performance metrics, exceptions, and dependencies.

- Analyze logs and metrics. Access the Application Insights dashboard from the Azure portal to visualize and analyze logs, metrics, and other telemetry data. Use the built-in tools to create custom queries and visualize data to gain insights into the performance and behavior of your function app. 

- Set up alerts. Configure alerts in Application Insights to notify you of critical problems, performance degradation, or specific events. These alerts help you proactively monitor and quickly respond to problems.

### Optimize for cost and performance

- Scaling and performance optimization:

   - Use autoscaling features to handle varying workloads efficiently.

   - Optimize function code to improve performance by reducing run time, optimizing dependencies, and using efficient coding practices.

   - Implement caching strategies to reduce repeated processing and latency for frequently accessed data. 

- Cost management:

   - Use the [Microsoft Cost Management](/azure/cost-management-billing/cost-management-billing-overview) tools to monitor and analyze your Azure Functions costs.

   - Set up budgeting and cost alerts to manage and predict expenses effectively.

## Get started

Use the [MigrationGetStarted repo](https://github.com/MadhuraBharadwaj-MSFT/MigrationGetStarted) as a template to begin your proof of concept. This repo includes a ready-to-deploy Azure Functions project that has the infrastructure and source code files to help you get started.

If you prefer to use Terraform, use [MigrationGetStarted-Terraform](https://github.com/MadhuraBharadwaj-MSFT/MigrationGetStarted-Terraform) instead.

<!--
## Next step

> [!div class="nextstepaction"]
> [article](file.md)
-->