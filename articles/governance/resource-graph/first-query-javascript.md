---
title: 'Quickstart: Your first JavaScript query'
description: In this quickstart, you follow the steps to enable the Resource Graph library for JavaScript and run your first query.
ms.date: 01/27/2021
ms.topic: quickstart
ms.custom:
  - devx-track-js
  - mode-api
---
# Quickstart: Run your first Resource Graph query using JavaScript

This quickstart walks you through the process of adding the libraries to your JavaScript
installation. The first step to using Azure Resource Graph is to initialize a JavaScript application
with the required libraries.

At the end of this process, you'll have added the libraries to your JavaScript installation and run
your first Resource Graph query.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a
  [free](https://azure.microsoft.com/free/) account before you begin.

- **Node.js**: [Node.js](https://nodejs.org/) version 12 or higher is required.

## Application initialization

To enable JavaScript to query Azure Resource Graph, the environment must be configured. This setup
works wherever JavaScript can be used, including [bash on Windows 10](/windows/wsl/install-win10).

1. Initialize a new Node.js project by running the following command.

   ```bash
   npm init -y
   ```

1. Add a reference to the yargs module.

   ```bash
   npm install yargs
   ```

1. Add a reference to the Azure Resource Graph module.

   ```bash
   npm install @azure/arm-resourcegraph
   ```

1. Add a reference to the Azure authentication library.

   ```bash
   npm install @azure/ms-rest-nodeauth
   ```

   > [!NOTE]
   > Verify in _package.json_ `@azure/arm-resourcegraph` is version **2.0.0** or higher and
   > `@azure/ms-rest-nodeauth` is version **3.0.3** or higher.

## Query the Resource Graph

1. Create a new file named _index.js_ and enter the following code.

   ```javascript
   const argv = require("yargs").argv;
   const authenticator = require("@azure/ms-rest-nodeauth");
   const resourceGraph = require("@azure/arm-resourcegraph");

   if (argv.query && argv.subs) {
       const subscriptionList = argv.subs.split(",");

       const query = async () => {
          const credentials = await authenticator.interactiveLogin();
          const client = new resourceGraph.ResourceGraphClient(credentials);
          const result = await client.resources(
             {
                 query: argv.query,
                 subscriptions: subscriptionList,
             },
             { resultFormat: "table" }
          );
          console.log("Records: " + result.totalRecords);
          console.log(result.data);
       };

       query();
   }
   ```

1. Enter the following command in the terminal:

   ```bash
   node index.js --query "Resources | project name, type | limit 5" --subs <YOUR_SUBSCRIPTION_ID_LIST>
   ```

   Make sure to replace the `<YOUR_SUBSCRIPTION_ID_LIST>` placeholder with your comma-separated list
   of Azure subscription IDs.

   > [!NOTE]
   > As this query example doesn't provide a sort modifier such as `order by`, running this query
   > multiple times is likely to yield a different set of resources per request.

1. Change the first parameter to `index.js` and change the query to `order by` the **Name**
   property. Replace `<YOUR_SUBSCRIPTION_ID_LIST>` with your subscription ID:

   ```bash
   node index.js --query "Resources | project name, type | limit 5 | order by name asc" --subs "<YOUR_SUBSCRIPTION_ID_LIST>"
   ```

   As the script attempts to authenticate, a message similar to the following message is displayed
   in the terminal:

   > To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code FGB56WJUGK to authenticate.

   Once you authenticate in the browser, then the script continues to run.

   > [!NOTE]
   > Just as with the first query, running this query multiple times is likely to yield a different
   > set of resources per request. The order of the query commands is important. In this example,
   > the `order by` comes after the `limit`. This command order first limits the query results and
   > then orders them.

1. Change the first parameter to `index.js` and change the query to first `order by` the **Name**
   property and then `limit` to the top five results. Replace `<YOUR_SUBSCRIPTION_ID_LIST>` with
   your subscription ID:

   ```bash
   node index.js --query "Resources | project name, type | order by name asc | limit 5" --subs "<YOUR_SUBSCRIPTION_ID_LIST>"
   ```

When the final query is run several times, assuming that nothing in your environment is changing,
the results returned are consistent and ordered by the **Name** property, but still limited to the
top five results.

## Clean up resources

If you wish to remove the installed libraries from your application, run the following command.

```bash
npm uninstall @azure/arm-resourcegraph @azure/ms-rest-nodeauth yargs
```

## Next steps

In this quickstart, you've added the Resource Graph libraries to your JavaScript environment and run
your first query. To learn more about the Resource Graph language, continue to the query language
details page.

> [!div class="nextstepaction"]
> [Get more information about the query language](./concepts/query-language.md)
