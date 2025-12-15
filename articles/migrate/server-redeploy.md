---
title: Redeploy servers to Azure using Infrastructure as Code
description: Learn how to automate Windows Server redeployment to Azure using Infrastructure as Code (IaC) with Azure Migrate.
author: piyushdhore-microsoft 
ms.author: piyushdhore
ms.topic: how-to
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 11/10/2025
ms.custom: engagement-fy25
# Customer intent: As a system administrator, I want to redeploy Windows Server 2003 machines to Azure using Infrastructure as Code so that I can automate the migration and reduce manual steps.
---

# Redeploy servers to Azure using Infrastructure as Code (IaC)

This article helps you redeploy **Windows and Linux Servers to Azure using Infrastructure as Code (IaC)** with step-by-step guidance to generate templates, deploy landing zones, migrate servers, and integrate disk configurations for automated, repeatable migrations.

Azure Migrate supports server redeployment through Infrastructure as Code (IaC).
You can automate the process of rebuilding and configuring servers in Azure using declarative scripts instead of manual steps. By leveraging this feature, you can:

- Create IaaS application IaC based on assessment.
- Deploy the IaaS application IaC.
- Migrate the server using the Server Migration tool.
- Detach the data disk using the disk migration script to generate disk IaC.
- Merge disk IaC with application IaC.
- Reapply the application IaC script.


## Create IaaS application IaC

Azure Migrate lets you generate Infrastructure as Code (IaC) templates for your assessed workloads or applications. These templates create an application landing zone in Azure, enabling automated deployment and configuration.

### Prerequisites

Before you begin, complete the Azure VM assessment in Azure Migrate either through workload assessment or application assessment.

### Generate Application Landing Zone IaC

Follow the steps to generate Infrastructure as Code (IaC) for your assessed workloads or applications in Azure Migrate:

1. Go to the assessment report in the Azure Migrate portal after you complete the workload or application assessment.
1. Select **Generate IaC** at the top of the report to start the code generation process.


:::image type="content" source="./media/server-redeploy/code-generation-process.png" alt-text="The screenshot shows how to start the code generation process." lightbox="./media/server-redeploy/code-generation-process.png":::

3. The portal redirects you to the IaC generation flow, where you review and select details before generating the code.

:::image type="content" source="./media/server-redeploy/generation-flow.png" alt-text="The screenshot shows how to redirect to IaC generation flow to review and select details before generating the code." lightbox="./media/server-redeploy/generation-flow.png":::

4. IaC generation currently supports only IaaS (Infrastructure as a Service) targets.
5. For workload assessments, select the workloads you want to include in the generated application code. 
6. For application assessments, select the application you want to generate IaC for. You can generate code for only one application at a time.


:::image type="content" source="./media/server-redeploy/generate-application.png" alt-text="The screenshot shows how to select application to generate IaC for one application at a time." lightbox="./media/server-redeploy/generate-application.png":::

7. Review the workloads and select **Next**.

:::image type="content" source="./media/server-redeploy/generate-for-one-application.png" alt-text="The screenshot shows how to generate code for IaC  application." lightbox="./media/server-redeploy/generate-for-one-application.png":::

8. Select **Next** again to go to the **Generate and Download** page, and review the base architecture.

9. The IaC generation feature currently supports only one architecture—a basic three-tier design with frontend, backend, and database layers optimized for non-critical development applications. This architecture also includes Cloud Adoption Framework (CAF)-aligned security best practices.

:::image type="content" source="./media/server-redeploy/supported-architecture.png" alt-text="The diagram shows the supported architecture." lightbox="./media/server-redeploy/supported-architecture.png":::

10. Select Generate Code after you finish reviewing the architecture. The assessment’s baseline architecture generates your IaC and automatically adds the selected workloads.

:::image type="content" source="./media/server-redeploy/generate-code.png" alt-text="The screenshot shows how to select Generate Code after review is complete." lightbox="./media/server-redeploy/generate-code.png":::

11. When the download completes, extract the ZIP file and go to the folder in an IDE such as **Visual Studio Code** to explore the generated code.

## Deploy the IaaS application IaC 

After generating the Infrastructure as Code (IaC) package for your assessed workloads, follow these steps to deploy the application:

1. The VM configuration details are saved in the vm_config.json file, which is automatically generated from your assessment data. 
1. To deploy the code, follow the instructions in the readme.md file included in the downloaded folder.

## Migrate servers using the server migration tool

Use the Server Migration tool in Azure Migrate to move your on-premises servers to Azure. The migration process depends on your scenario, such as:

- Lift-and-shift migration for physical or virtual machines.
- Agentless migration for VMware environments.
- Agent-based migration for Hyper-V or physical servers.

## Detach data disks and generate IaC configuration with Azure Migrate

1. Use the disk migration script in this [repository](https://github.com/Azure/AzMigrate-Hydration/tree/asr-am-support-scripts/Post%20Migration%20Customization) to detach the data disk from the migrated VM. The script generates the `disk-config.json` file, which contains the disk’s Infrastructure as Code (IaC) details. 
1. Follow the instructions in the readme.md file included in the downloaded folder to complete the detachment process.

## Merge disk IaC with application IaC

After generating the disk Infrastructure as Code (IaC) configuration, you need to integrate it with the Application IaC package to ensure the migrated application includes the correct disk settings.

### Steps to merge disk IaC

Follow the steps to merge the disk IaC:

1. **Copy disk configuration file**: Locate the `disk-config.json` file generated in step 4 and copy it into the folder that contains your Application IaC code.
1. **Update Terraform variables**: Open the terraform.tfvars file in the Application IaC folder.
    - Uncomment the following line: 
        - `disk_config_file = "./disk-config.json"`
    - This links the disk configuration to your application deployment.
1. **Review integration instructions**: For detailed guidance on using the disk configuration file, refer to the readme.md file included in the Application IaC package generated in step 1. The README explains how Terraform processes the disk configuration and applies it during deployment.

## Re-apply the application IaC script

Follow the instructions in the readme.md file included with the Application IaC package to re-apply the script. This step ensures that the disk changes are incorporated and your migration is completed successfully.

## Next steps

- Learn more [Migrate VMware VMs to Azure (agentless)](tutorial-migrate-vmware.md).
- Learn more [Migrate VMware vSphere VMs to Azure (agent-based)](tutorial-migrate-vmware-agent.md).