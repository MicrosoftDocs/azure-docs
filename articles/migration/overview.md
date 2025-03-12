---
title: Migrate to Azure
description: Before you migrate workloads, start with a strong foundation in Azure.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025  
ms.topic: conceptual
---

# Migrate to Azure from other clouds

Migrating a workload from another cloud to Azure typically follows the following steps:

1. Assessing your current workload in its current environment
1. Designing a similar solution in Azure
1. Preparing the workload and Azure for migration
1. Performing the migration
1. Evaluating success

These general steps are applicable for custom applications as well as for commercial off the shelf (COTS) solutions. Once on Azure, you can then further optimize your workload with services and features that will benefit your workload and its users.

Microsoft Azure has a collection of articles that can help guide you with some of these steps to have a successful migration.

## Start with a solid foundation in Azure

Before performing any workload migration, you need to make sure you've established a strong foundation on Azure. Follow the Azure adoption guidance in the [Cloud Adoption Framework](/azure/cloud-adoption-framework/get-started/) to build a solid platform for any workloads you'll be migrating.

There is also a Microsoft Learn training module available that teaches you how to [Use the Cloud Adoption Framework Migrate methodology to migrate your workload to the cloud](/training/modules/cloud-adoption-framework-migrate/).

## Tools

Microsoft Azure has tooling specifically build to help customers address key components in their migration tasks.

- [Azure Migrate](/azure/migrate/migrate-services-overview) which primarily helps with core application platform components
- [Azure SQL Migration for Azure Data Studio](/azure/dms/migration-using-azure-data-studio?tabs=azure-sql-mi) which primarily helps with migarting to Azure SQL targets

## Next step

Microsoft Learn also hosts how-tos, example migration scenarios, and other articles to help make your workload migration a success.

If you're migrating a workload from Amazon Web Services (AWS) continue exploring the guidance at:

> [!div class="nextstepaction"]
> [Migrate a workload from AWS](./migrate-from-aws.md)

If you're migrating a workload from Google cloud, see:

> [!div class="nextstepaction"]
> [Migrate a workload from Google Cloud](./migrate-from-google-cloud.md)
