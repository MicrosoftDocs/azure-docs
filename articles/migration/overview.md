---
title: Migrate workloads to Azure
description: Before you migrate workloads, start with a strong foundation in Azure.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025  
ms.topic: conceptual
---

# Migrate workloads to Azure from other clouds

Migrating a workload from another cloud to Azure typically follows these steps:

1. Assess your current workload in its current environment
1. Design a similar solution in Azure
1. Prepar the current workload and Azure for migration
1. Perform the migration
1. Evaluate success

These general steps are applicable for custom applications as well as for commercial off the shelf (COTS) solutions that you wish to migrate. Once the workload is on Azure, you can then further optimize your workload with services and features that will benefit your workload and its users.

Microsoft Azure has a collection of articles that can help guide you with some of these steps to have a successful migration.

## Start with a solid foundation in Azure

Before performing any workload migration, you need to make sure you've established a strong foundation on Azure. Follow the Azure adoption guidance in the [Cloud Adoption Framework](/azure/cloud-adoption-framework/get-started/) to build a solid platform for any workloads you'll be migrating.

There is also a Microsoft Learn training module available that teaches you how to [Use the Cloud Adoption Framework Migrate methodology to migrate your workload to the cloud](/training/modules/cloud-adoption-framework-migrate/).

## Tools

Microsoft Azure has tooling specifically build to help customers address key components in their migration tasks.

- [Azure Migrate](/azure/migrate/migrate-services-overview) which primarily helps with core application platform components
- [Azure SQL Migration for Azure Data Studio](/azure/dms/migration-using-azure-data-studio?tabs=azure-sql-mi) which primarily helps with migarting to Azure SQL targets
- Use the [Microsoft Well-Architected Review assessment](/assessments/azure-architecture-review/) to evaluate your workload's current implementation decisions, you can use that after you migrate to help evaluate if there were any regressions.

## Next steps

Microsoft Learn also hosts how-tos, example migration scenarios, and other articles to help make your workload migration a success.

If you're migrating a workload from Amazon Web Services (AWS) continue exploring the guidance at:

> [!div class="nextstepaction"]
> [Migrate a workload from AWS](./migrate-from-aws.yml)

If you're migrating a workload from Google cloud, see:

> [!div class="nextstepaction"]
> [Migrate a workload from Google Cloud](./migrate-from-google-cloud.md)
