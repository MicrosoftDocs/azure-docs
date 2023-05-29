---
title: Vercel Integration with Azure Cosmos DB
description: Learn how to integrate Azure Cosmos DB with Vercel
author: sajeetharan
ms.author: sasinnat
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: how-to
ms.date: 05/28/2023
ms.custom: build-2023
adobe-target: true
---

# Vercel Integration with Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB](includes/appliesto-nosql-mongodb.md)]

Vercel offers a user-friendly and robust platform for web application development and deployment. This new integration improves productivity as developers can now easily create Vercel applications with a backend database already configured. This Integration helps developers transform their creative ideas into reality in real-time.

## Getting started with Integrating Azure Cosmos DB with Vercel

This documentation is designed for developers seeking to effectively combine the robust capabilities of Azure Cosmos DB - a globally distributed, multi-model database service - with Vercel's high-performance deployment and hosting solution.

This integration enables developers to apply the benefits of a versatile and high-performance NoSQL database, while capitalizing on Vercel's serverless architecture and development platform.

There are two ways to integrate Cosmos DB

- [Via Vercel Integrations Marketplace](https://vercel.com/integrations/azurecosmosdb)
- Via Command Line

## Integrate Cosmos DB with Vercel via Integration Marketplace

Use this guide if you have already identified the Vercel project(s) or want to integrate an existing vercel project with

## Prerequisites

1. Vercel Account with Vercel Project – [Learn how to create a new Vercel Project](https://vercel.com/docs/concepts/projects/overview#creating-a-project)

2. Azure Cosmos DB - [Quickstart: Create an Azure Cosmos DB account](./nosql/quickstart-portal.md)

3. Some basic knowledge on Next.js, React and TypeScript

## Steps for Integrating Azure Cosmos DB with Vercel

1. Select Vercel Projects for the Integration with Azure Cosmos DB. After you have the prerequisites ready, visit the Cosmos DB [integrations page on the Vercel marketplace](https://vercel.com/integrations/azurecosmosdb) and select Add Integration

:::image type="content" source="./media/integrations/vercel/add-integration.png" alt-text="Screenshot shows the Azure Cosmos DB integration page on Vercel's marketplace" lightbox="./media/integrations/vercel/add-integration.png":::

2. Choose All projects or Specific projects for the integration. In this guide we proceed by choosing specific projects, select continue

:::image type="content" source="./media/integrations/vercel/continue.png" alt-text="Screenshot shows to select vercel projects" lightbox="./media/integrations/vercel/continue.png":::

3. Next screen will show the required permissions for the integration, select Add Integration

:::image type="content" source="./media/integrations/vercel/permissions.png" alt-text="Screenshot shows the permissions required for the integration" lightbox="./media/integrations/vercel/permissions.png":::

4. Log in to Azure using your credentials to select the existing Azure Cosmos DB account for the integration

:::image type="content" source="./media/integrations/vercel/sign_in.png" alt-text="Screenshot shows to login to azure account" lightbox="./media/integrations/vercel/sign_in.png":::

5. Choose a Directory, subscription and the Azure Cosmos DB Account

6. Verify Vercel Projects

:::image type="content" source="./media/integrations/vercel/projects.png" alt-text="Screenshot shows to verify the vercel projects for the integration" lightbox="./media/integrations/vercel/projects.png":::

7. Select Integrate

:::image type="content" source="./media/integrations/vercel/integrate.png" alt-text="Screenshot shows to confirm the integration" lightbox="./media/integrations/vercel/integrate.png":::

## Integrate Cosmos DB with Vercel via npm & Command Line

1. Execute create-next-app with npm, yarn, or pnpm to bootstrap the example:

```
npx create-next-app --example with-azure-cosmos with-azure-cosmos-app

yarn create next-app --example with-azure-cosmos with-azure-cosmos-app

pnpm create next-app --example with-azure-cosmos with-azure-cosmos-app
```

2.  Modify pages/index.tsx to add your code.

Make changes to pages/index.tsx according to your needs. You could check out the code at lib/cosmosdb.ts to check how @azure/cosmos javascript client is initialized.

3. Push the changes to a GitHub repository.

4. Set up environment variables.

• COSMOSDB_CONNECTION_STRING - You need your Cosmos DB connection string. You can find these in the Azure portal in the keys section.

• COSMOSDB_DATABASE_NAME - Name of the database you plan to use. This should already exist in the Cosmos DB account.

• COSMOSDB_CONTAINER_NAME - Name of the container you plan to use. This should already exist in the previous database.

## Integrate Cosmos DB with Vercel using marketplace template

You could use this [template](https://vercel.com/new/clone?demo-title=CosmosDB%20Starter&demo-description=Starter%20app%20built%20on%20Next.js%20and%20CosmosDB.&demo-url=https://cosmosdb-starter-test.vercel.app/&project-name=CosmosDB%20Starter&repository-name=cosmosdb-starter&repository-url=https%3A%2F%2Fgithub.com%2Fv1k1%2Fcosmosdb-starter&from=templates&integration-ids=oac_mPA9PZCLjkhQGhlA5zntNs0L&env=COSMOSDB_CONNECTION_STRING%2C%E2%80%A2%09COSMOSDB_CONTAINER_NAME) to deploy a starter web app on Vercel with Azure Cosmos DB integration.

1. Choose the GitHub repository, where you want to clone the starter repo.
   :::image type="content" source="./media/integrations/vercel/create-git-repository.png" alt-text="Screenshot to create the repository" lightbox="./media/integrations/vercel/create-git-repository.png":::

2. Click on the integration to set up Cosmos DB connection keys, these steps are described in detail in previous section.

:::image type="content" source="./media/integrations/vercel/add-integrations.png" alt-text="Screenshot shows the required permissions" lightbox="./media/integrations/vercel/add-integrations.png":::

3. Set the environment variables for the database name and container name, and finally select Deploy

:::image type="content" source="./media/integrations/vercel/configure-project.png" alt-text="Screenshot shows the required variables to establish the connection with Azure Cosmos DB" lightbox="./media/integrations/vercel/configure-project.png":::

4. Upon successful completion, the completion page would contain the link to the deployed app, or you go to the Vercel project's dashboard to get the link of your app.
